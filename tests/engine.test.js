const assert=require('assert');const {score,routeInfo,DEMO}=require(__dirname+'/../data.js');
// engine
const night=score('d',23,[],[]),noon=score('d',12,[],[]);assert(night.risk>noon.risk,'night>noon');
assert.strictEqual(score('zz',12,[],[]).level,'No data');
const mk=c=>[{id:'x',z:'zz',cat:'assault',hr:12,age:0,conf:c}];
assert(score('zz',12,mk(2),[]).risk>score('zz',12,mk(0),[]).risk,'verified weighs more');
assert(score('zz',12,mk(0),['x']).risk===score('zz',12,mk(0),['x']).risk);
const old=[{id:'o',z:'zz',cat:'assault',hr:12,age:90,conf:3}];assert(score('zz',12,old,[]).risk<score('zz',12,[{id:'o',z:'zz',cat:'assault',hr:12,age:0,conf:3}],[]).risk,'recency');
Object.values(DEMO.dests).forEach(d=>{const f=routeInfo(d.fast,23,[],[]),s=routeInfo(d.safe,23,[],[]);assert(f.min&&s.min)});
console.log('engine ok; route a@23h',routeInfo(DEMO.dests.a.fast,23,[],[]),routeInfo(DEMO.dests.a.safe,23,[],[]));
const D=require(__dirname+'/../data.js');global.DEMO=D.DEMO;global.score=D.score;global.routeInfo=D.routeInfo;global.CAT=D.CAT;
// stub DOM
const store={};const el={innerHTML:'',textContent:'',className:'',value:'2468',setAttribute(){},classList:{toggle(){}}};
const ss={};global.sessionStorage={getItem:k=>ss[k]||null,setItem:(k,v)=>ss[k]=v,removeItem:k=>delete ss[k]};
global.localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]};
global.location={hash:'',protocol:'file:'};global.window=global;global.window.scrollTo=()=>{};global.window.addEventListener=()=>{};
global.document={querySelector:()=>el,querySelectorAll:()=>[],addEventListener(){},body:{classList:{toggle(){}}},documentElement:{classList:{toggle(){}}},activeElement:null,createElement:()=>({click(){}})};
Object.defineProperty(global,'navigator',{value:{onLine:true},writable:true,configurable:true});global.setInterval=()=>0;global.confirm=()=>true;
let now=Date.now();Date.now=()=>now;
require(__dirname+'/../app.js');const T=window.ST;
for(const r of ['safety','route','sos','me','responder']){location.hash='#/'+r;T.render(true);assert(el.innerHTML.length>200,r)}
// SOS flow: auto responder
location.hash='#/sos';T.acts.sos();assert.strictEqual(T.ui.cd,5);for(let i=0;i<5;i++)T.tick();
assert.strictEqual(T.S().sos.status,'searching');now+=7000;T.tick();assert.strictEqual(T.S().sos.status,'enroute');
now+=11000;T.tick();assert.strictEqual(T.S().sos.status,'arrived');T.acts.safe();assert.strictEqual(T.S().sos.status,'resolved');
assert.strictEqual(T.S().sos.loc,null);assert.strictEqual(T.S().sos.sharing,false);assert.strictEqual(T.S().history.length,1);T.acts.done();assert.strictEqual(T.S().sos,null);
// escalation: no responder
T.S().set.sim='none';localStorage.setItem('safetrail_v1',JSON.stringify(Object.assign(T.S(),{set:Object.assign(T.S().set,{sim:'none'})})));
T.acts.sos();for(let i=0;i<5;i++)T.tick();now+=25000;T.tick();assert.strictEqual(T.S().sos.esc,2);assert.strictEqual(T.S().sos.status,'searching');
// human responder
location.hash='#/responder';el.value='2468';T.acts.login();T.render(true);assert(/Incoming SOS/.test(el.innerHTML));el.value='8';T.acts.accept();assert.strictEqual(T.S().sos.status,'enroute');
T.render(true);assert(/Resolve emergency/.test(el.innerHTML));el.value='False alarm';T.acts.resolveR();assert.strictEqual(T.S().sos.status,'resolved');
// offline queue
T.acts.done();navigator.onLine=false;T.acts.sos();for(let i=0;i<5;i++)T.tick();assert.strictEqual(T.S().sos.status,'queued');
// XSS escaping
const s=T.S();s.sos.details='<img src=x onerror=alert(1)>';localStorage.setItem('safetrail_v1',JSON.stringify(s));location.hash='#/sos';T.render(true);assert(!/<img src=x/.test(el.innerHTML),'xss');
console.log('flows ok');
