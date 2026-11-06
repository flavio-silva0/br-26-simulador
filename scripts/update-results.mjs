import fs from 'node:fs';
import vm from 'node:vm';

let html=fs.readFileSync('index.html','utf8');
const pattern=/(<script id="br-data"[^>]*>)(.*?)(<\/script>)/s;
const data=JSON.parse(html.match(pattern)[2]);
const results=[
  {home:'Palmeiras',away:'Remo',home_goals:6,away_goals:1,date:'2026-11-05',rodada:34,source:'https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/11/05/palmeiras-remo-brasileirao-2026-34-rodada-como-foi.ghtm'},
  {home:'Cruzeiro',away:'Bahia',home_goals:3,away_goals:2,date:'2026-11-05',rodada:34,source:'https://www.gazetaesportiva.com/campeonatos/brasileiro-serie-a/cruzeiro-bate-bahia-com-dois-de-kaio-jorge-e-vence-a-quarta-seguida/'}
];
data.completed_results??=[];
for(const r of results){
  const i=data.fixtures.findIndex(f=>f.home===r.home&&f.away===r.away&&f.date===r.date);
  if(i<0)continue;
  const h=data.current.find(t=>t[0]===r.home),a=data.current.find(t=>t[0]===r.away);
  h[2]++;a[2]++;h[6]+=r.home_goals;h[7]+=r.away_goals;a[6]+=r.away_goals;a[7]+=r.home_goals;
  if(r.home_goals>r.away_goals){h[1]+=3;h[3]++;a[5]++;}else if(r.home_goals<r.away_goals){a[1]+=3;a[3]++;h[5]++;}else{h[1]++;a[1]++;h[4]++;a[4]++;}
  data.fixtures.splice(i,1);data.completed_results.push(r);
}
data.asof='2026-11-06 · após os jogos de 05/11';data.total_future_games=data.fixtures.length;
// Reuse the same seeded, conditional Poisson score engine as the simulator.
const sandbox={fIndex:data.fixtures};vm.createContext(sandbox);
vm.runInContext(html.match(/function pois\(lambda\)[\s\S]*?(?=function init\()/)[0],sandbox);
const random=vm.runInContext('mulberry32(20261106)',sandbox);
const clubs=data.current.map(t=>t[0]),idx=Object.fromEntries(clubs.map((c,i)=>[c,i]));
const fixtures=data.fixtures.map(f=>({...f,hi:idx[f.home],ai:idx[f.away]}));
const N=data.simulations,points=clubs.map(()=>[]),posSum=clubs.map(()=>0),falls=clubs.map(()=>0);
const conditionals=Object.fromEntries(Object.keys(data.conditional).map(k=>[k,Array.from({length:3},()=>({n:0,h:0,a:0}))]));
const cmp=(a,b)=>b.p-a.p||b.w-a.w||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.i-b.i;
let representative=null,best=Infinity;
const seasons=[];
for(let n=0;n<N;n++){
  const rows=data.current.map((t,i)=>({i,p:t[1],w:t[3],gf:t[6],ga:t[7]})),scores=[],outcomes=[];
  for(let j=0;j<fixtures.length;j++){
    const f=fixtures[j],u=random(),o=u<f.ph?0:u<f.ph+f.pd?1:2;
    const [hg,ag]=sandbox.sampleScore(j,['H','D','A'][o],random);scores.push([hg,ag]);outcomes.push(o);
    const h=rows[f.hi],a=rows[f.ai];h.gf+=hg;h.ga+=ag;a.gf+=ag;a.ga+=hg;
    if(o===0){h.p+=3;h.w++;}else if(o===2){a.p+=3;a.w++;}else{h.p++;a.p++;}
  }
  const ranked=[...rows].sort(cmp),down=new Set(ranked.slice(16).map(t=>t.i));
  ranked.forEach((t,p)=>{points[t.i].push(t.p);posSum[t.i]+=p+1;if(p>=16)falls[t.i]++;});
  fixtures.forEach((f,j)=>{const c=conditionals[f.home+' x '+f.away];if(c){const x=c[outcomes[j]];x.n++;x.h+=Number(down.has(f.hi));x.a+=Number(down.has(f.ai));}});
  // Keep a bounded pool of realizable seasons to choose a central scenario.
  if(n<10000)seasons.push({rows,ranked,scores,n});
}
const means=points.map(p=>p.reduce((a,b)=>a+b,0)/N);
for(const s of seasons){const loss=s.rows.reduce((sum,t)=>sum+(t.p-means[t.i])**2,0);if(loss<best){best=loss;representative=s;}}
data.fixtures.forEach((f,i)=>{[f.representative_home_goals,f.representative_away_goals]=representative.scores[i];});
data.final=data.current.map((t,i)=>{
  points[i].sort((a,b)=>a-b);const rp=representative.ranked.findIndex(r=>r.i===i)+1;
  return {pos:rp,club:t[0],current_pts:t[1],games_remaining:38-t[2],expected_pts:means[i],avg_position:posSum[i]/N,relegation_probability:falls[i]/N,p10_points:points[i][Math.floor(N*.1)],p90_points:points[i][Math.floor(N*.9)],representative_pts:representative.rows[i].p,representative_position:rp};
}).sort((a,b)=>a.pos-b.pos);
data.conditional=Object.fromEntries(Object.entries(conditionals).map(([k,v])=>[k,v.map((x,i)=>({resultado:['casa','empate','fora'][i],frequencia:x.n/N,risco_casa:x.h/x.n,risco_fora:x.a/x.n}))]));
data.representative_index=representative.n;data.scenario_loss=best;data.seed=20261106;
data.ranked_central=representative.ranked.map(t=>clubs[t.i]);data.relegated_central=data.ranked_central.slice(16);
html=html.replace(pattern,(_,a,b,c)=>a+JSON.stringify(data)+c);
fs.writeFileSync('index.html',html);
console.log(JSON.stringify({results:data.completed_results,remaining:data.fixtures.length,simulations:N,central:data.ranked_central}));
