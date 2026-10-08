/* DEMO / SIMULATION DATA — fictional city, simulated reports. Not real incidents. */
const DEMO={note:'DEMO DATA — fictional city, simulated reports',
zones:[{id:'a',n:'Central Station',x:20,y:28},{id:'b',n:'Market Lane',x:48,y:20},{id:'c',n:'Riverside Park',x:78,y:30},{id:'d',n:'Old Bridge Underpass',x:26,y:70},{id:'e',n:'University Gate',x:54,y:58},{id:'f',n:'Industrial Yard',x:82,y:76}],
reports:[],
dests:{a:{fast:{p:['e','d','a'],m:11},safe:{p:['e','b','a'],m:15}},c:{fast:{p:['e','c'],m:8},safe:{p:['e','b','c'],m:12}},f:{fast:{p:['e','f'],m:7},safe:{p:['e','b','c','f'],m:16}}}};
const CAT={assault:'Assault / threat',harassment:'Harassment / following',theft:'Theft / snatching',lighting:'Poor lighting',suspicious:'Suspicious activity',accident:'Road hazard'};
const RISK_W={assault:1.6,harassment:1,theft:.6,lighting:.5,suspicious:.4,accident:.3};
(function(){let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const P={a:[['theft','harassment','suspicious'],18,22,7],b:[['theft','suspicious'],11,17,5],c:[['harassment','lighting','assault'],20,2,6],d:[['lighting','assault','harassment'],21,3,8],e:[['accident','theft'],8,19,3],f:[['lighting','suspicious','assault'],19,4,4]};
Object.keys(P).forEach(z=>{const [cats,lo,hi,n]=P[z];const span=(hi-lo+24)%24+1;
for(let i=0;i<n;i++)DEMO.reports.push({id:'d'+z+i,z,cat:cats[Math.floor(rnd()*cats.length)],hr:(lo+Math.floor(rnd()*span))%24,age:Math.floor(rnd()*60),conf:Math.floor(rnd()*4)})})})();
const hd=(a,b)=>{const d=Math.abs(a-b)%24;return Math.min(d,24-d)};
/* Transparent formula: each report contributes  categoryWeight x timeMatch x recency x credibility. No ML. */
function score(z,hour,extra,conf){extra=extra||[];conf=conf||[];
const rs=DEMO.reports.concat(extra).filter(r=>r.z===z);let s=0,tm=0,rc=0,v=0;const by={};
rs.forEach(r=>{const ver=(r.conf+(conf.includes(r.id)?1:0))>=2;const t=.35+.65*Math.exp(-(hd(r.hr,hour)**2)/18);const rec=Math.pow(.5,r.age/21);const c=RISK_W[r.cat]*t*rec*(ver?1:.5);s+=c;tm+=t;rc+=rec;if(ver)v++;by[r.cat]=(by[r.cat]||0)+c});
const n=rs.length,risk=Math.round(100*(1-Math.exp(-s/3)));
const cf=n===0?'none':(n<4||v/n<.3)?'low':(n<8||v/n<.5)?'medium':'high';
return{n,v,risk,safety:100-risk,level:n===0?'No data':risk<25?'Low':risk<50?'Moderate':'High',conf:cf,tm:n?tm/n:0,rc:n?rc/n:0,by,rs}}
function routeInfo(r,hour,extra,conf){const rk=r.p.map(z=>score(z,hour,extra,conf).risk);return{min:r.m,mean:Math.round(rk.reduce((a,b)=>a+b,0)/rk.length),peak:Math.max.apply(null,rk)}}
if(typeof module!=='undefined')module.exports={DEMO,score,routeInfo,CAT};
