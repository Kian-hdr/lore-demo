import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(root,"memory.html"),"utf8");
const match = html.match(/<script id="memory-engine">([\s\S]*?)<\/script>/);
assert.ok(match,"inline engine exists");
const context = { TextEncoder };
vm.createContext(context);
vm.runInContext(match[1],context,{timeout:1000});
const M = context.LoreMemory;
const plain = value => JSON.parse(JSON.stringify(value));
const clone = value => JSON.parse(JSON.stringify(value));
let checks = 0;
function check(name, fn) {
  fn();
  checks += 1;
  console.log("PASS",name);
}
const initial = M.create();

check("broad query uses only coarse record",() => {
  const result = M.query(initial,M.K.BROAD);
  assert.equal(result.status,1);
  assert.equal(result.level,2);
  assert.deepEqual(plain(result.selected),[2]);
  assert.equal(result.metrics.selectedCodeReferences,3);
  assert.equal(result.metrics.ruleEvaluations,result.trace.length);
  assert.deepEqual(plain(result.answer.codes),[101,103]);
});

check("exact query opens the literal and evidence",() => {
  const result = M.query(initial,M.K.EXACT);
  assert.equal(result.status,1);
  assert.equal(result.level,0);
  assert.equal(result.answer.value,10);
  assert.equal(result.answer.operator,102);
  assert.deepEqual(plain(result.selected),[2,1]);
  assert.deepEqual(plain(result.evidence),[1001]);
  assert.equal(result.metrics.selectedCodeReferences,6);
});

const correction = M.correct(initial,12);
check("correction is append-only and invalidates dependencies",() => {
  assert.equal(correction.status,1);
  assert.deepEqual(plain(correction.invalidated),[2]);
  assert.equal(correction.appended,4);
  assert.equal(initial.records[0].status,1,"caller state remains intact");
  assert.equal(initial.records.length,3);
  assert.equal(correction.store.records.length,4);
  assert.equal(correction.store.records.find(r=>r.id===1).status,2);
  assert.equal(correction.store.records.find(r=>r.id===1).literals.threshold.value,10);
  assert.equal(correction.store.records.find(r=>r.id===2).status,0);
  assert.equal(correction.store.records.find(r=>r.id===2).invalidatedBy,4);
  assert.deepEqual(plain(correction.store.records.find(r=>r.id===4).supersedes),[1]);
  assert.equal(correction.store.evidence.length,3);
  assert.equal(correction.store.evidence[0].text,initial.evidence[0].text);
});

check("corrected exact answer changes, broad skips invalid summary",() => {
  const exact = M.query(correction.store,M.K.EXACT);
  assert.equal(exact.status,1);
  assert.equal(exact.answer.value,12);
  assert.deepEqual(plain(exact.selected),[2,4]);
  const broad = M.query(correction.store,M.K.BROAD);
  assert.equal(broad.status,1);
  assert.equal(broad.level,0);
  assert.ok(broad.trace.some(step=>step.rule===5));
});

check("dependent invalidation is transitive",() => {
  const store = clone(initial);
  store.records.push({...clone(store.records[1]),id:20,depends:[2]});
  const result=M.correct(store,15);
  assert.equal(result.status,1);
  assert.deepEqual(plain(result.invalidated),[2,20]);
});

check("serialized roundtrip retains correction, exactness and evidence",() => {
  const serialized=M.serialize(correction.store);
  const restored=M.restore(serialized);
  assert.equal(restored.status,1);
  assert.equal(M.serialize(restored.store),serialized);
  assert.deepEqual(plain(M.query(restored.store,M.K.EXACT)),plain(M.query(correction.store,M.K.EXACT)));
  assert.equal(M.query(restored.store,M.K.EXACT).answer.value,12);
  assert.equal(restored.store.records.find(r=>r.id===2).status,0);
  assert.equal(restored.store.evidence[2].source,"Synthetic user correction");
});

check("known observational ground truth is one",() => {
  const result=M.query(initial,M.K.OBSERVE);
  assert.equal(result.status,1);
  assert.deepEqual([result.answer.numerator,result.answer.denominator],[1,1]);
  assert.deepEqual(plain(result.selected),[3]);
});

check("known intervention ground truth is one half",() => {
  const result=M.query(initial,M.K.INTERVENE);
  assert.equal(result.status,1);
  assert.deepEqual([result.answer.numerator,result.answer.denominator],[1,2]);
  assert.equal(result.metrics.ruleEvaluations,4);
  assert.ok(result.trace.filter(step=>step.rule===9).length===2);
});

check("total store bytes count the whole UTF-8 serialization",() => {
  const result=M.query(initial,M.K.BROAD);
  assert.equal(result.metrics.serializedBytes,Buffer.byteLength(JSON.stringify(initial),"utf8"));
  assert.equal(result.metrics.modelPositions,null);
  assert.ok(M.query(correction.store,M.K.EXACT).metrics.serializedBytes>result.metrics.serializedBytes);
});

check("presentation strings do not control numeric reasoning",() => {
  const changed=clone(initial);
  changed.presentation.codes["102"]="unrelated label";
  changed.evidence[0].text="A presentation-only evidence string.";
  assert.equal(M.query(changed,M.K.EXACT).answer.value,10);
  assert.equal(M.query(changed,M.K.INTERVENE).answer.denominator,2);
});

for (const [name, mutate, error] of [
  ["schema",store=>store.schema=2,M.E.VERSION],
  ["codebook",store=>store.codebook.version=2,M.E.VERSION],
  ["code definition",store=>store.codebook.entries[0].arity=99,M.E.VERSION],
  ["record version",store=>store.records[0].version=2,M.E.VERSION],
  ["missing evidence",store=>store.evidence=[],M.E.EVIDENCE],
  ["unknown code",store=>store.records[0].codes=[999],M.E.RECORD],
  ["exact literal",store=>store.records[0].literals.threshold.value=10.5,M.E.LITERAL],
  ["stale summary",store=>store.records[0].status=2,M.E.RECORD],
  ["causal context",store=>store.records[2].worlds[0][3]=2,M.E.CAUSAL]
]) {
  check(name+" mismatch abstains",() => {
    const store=clone(initial); mutate(store);
    const result=M.query(store,name==="causal context"?M.K.INTERVENE:M.K.EXACT);
    assert.equal(result.status,0);
    assert.equal(result.error,error);
    const restored=M.restore(JSON.stringify(store));
    assert.equal(restored.status,0);
  });
}

check("malformed stores, queries and restore payloads abstain",() => {
  assert.equal(M.query(null,M.K.BROAD).status,0);
  assert.equal(M.query(initial,999).error,M.E.QUERY);
  assert.equal(M.restore("{").status,0);
  assert.equal(M.restore(" ".repeat(65537)).status,0);
});

check("bad correction preserves caller store",() => {
  const before=JSON.stringify(initial);
  for(const bad of [NaN,10.1,-2147483649,2147483648,"12"]) {
    assert.equal(M.correct(initial,bad).status,0);
    assert.equal(JSON.stringify(initial),before);
  }
});

check("signed i32 threshold extremes survive serialization",() => {
  for(const value of [-2147483648,2147483647]) {
    const result=M.correct(initial,value);
    assert.equal(result.status,1);
    const restored=M.restore(M.serialize(result.store));
    assert.equal(restored.status,1);
    assert.equal(M.query(restored.store,M.K.EXACT).answer.value,value);
  }
});

check("read budget permits coarse and abstains before exact expansion",() => {
  const broad=M.query(initial,M.K.BROAD,3);
  assert.equal(broad.status,1);
  assert.equal(broad.metrics.selectedCodeReferences,3);
  const exact=M.query(initial,M.K.EXACT,3);
  assert.equal(exact.status,0);
  assert.equal(exact.error,M.E.BUDGET);
  assert.deepEqual(plain(exact.selected),[2]);
  assert.equal(exact.metrics.selectedCodeReferences,3);
  assert.ok(exact.trace.some(step=>step.rule===10));
  assert.equal(M.query(initial,M.K.EXACT,6).status,1);
  assert.equal(M.query(initial,M.K.OBSERVE,3).error,M.E.BUDGET);
  assert.equal(M.query(initial,M.K.OBSERVE,6).status,1);
});

for (const [name,mutate] of [
  ["dangling child",store=>store.records[1].children=[999]],
  ["dangling supersedes",store=>store.records[0].supersedes=[999]],
  ["bad record ID",store=>store.records[0].id="1"],
  ["invalid status",store=>store.records[1].status=7],
  ["invalid level",store=>store.records[0].level=2],
  ["missing array",store=>delete store.records[0].supersedes],
  ["duplicate active fact",store=>store.records.push({...clone(store.records[0]),id:20})],
  ["dependency cycle",store=>{
    store.records.push({...clone(store.records[1]),id:20,depends:[2]});
    store.records[1].depends=[20];
  }]
]) {
  check(name+" fails query and restore",() => {
    const store=clone(initial); mutate(store);
    assert.equal(M.query(store,M.K.EXACT).status,0);
    assert.equal(M.restore(JSON.stringify(store)).status,0);
  });
}

check("store capacity stops corrections before producing unrestorable data",() => {
  let store=M.create();
  let rejected=false;
  for(let index=0;index<40;index++) {
    const before=JSON.stringify(store);
    const result=M.correct(store,index);
    if(result.status===0) {
      assert.equal(result.error,M.E.CAPACITY);
      assert.equal(JSON.stringify(store),before);
      rejected=true;
      break;
    }
    store=result.store;
    assert.equal(M.restore(M.serialize(store)).status,1);
  }
  assert.equal(rejected,true);
  assert.equal(store.records.length,M.LIMITS.records);
});

console.log(checks+" memory checks passed.");
