import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync('index.html','utf8');
const data=JSON.parse(html.match(/<script id="br-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
const update=JSON.parse(fs.readFileSync('data/update-2026-11-16.json','utf8'));
const source=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(m=>m[1]).find(s=>s.includes('const DATA='));
function app(saved={}){
  const storage=new Map(Object.entries(saved));
  const nodes=new Map();
  const context={document:{getElementById(id){
    if(id==='br-data')return {textContent:JSON.stringify(data)};
    if(!nodes.has(id))nodes.set(id,{innerHTML:'',hidden:false});return nodes.get(id);
  }},location:{protocol:'https:'},window:{scrollTo(){}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};
  vm.createContext(context);vm.runInContext(source.replace(/\binit\(\);\s*$/,''),context);
  return {run:s=>vm.runInContext(s,context),storage,nodes};
}

test('all 20 club records match the verified CBF snapshot',()=>{
  assert.equal(data.current.length,20);
  for(const row of update.current)assert.deepEqual(data.current.find(t=>t[0]===row[0]),row);
  assert.equal(data.current.reduce((s,t)=>s+t[6]-t[7],0),0);
});
test('39 future games close every club at 38 appearances; completed games cannot be predicted',()=>{
  assert.equal(data.fixtures.length,39);assert.equal(data.total_future_games,39);
  assert.equal(data.current.reduce((s,t)=>s+t[2],0)/2,341);
  const key=f=>`${f.rodada}|${f.home}|${f.away}`;
  assert.equal(new Set(data.fixtures.map(key)).size,39);
  for(const t of data.current){
    assert.equal(t[1],t[3]*3+t[4]);assert.equal(t[2],t[3]+t[4]+t[5]);
    assert.equal(t[2]+data.fixtures.filter(f=>f.home===t[0]||f.away===t[0]).length,38);
  }
  for(const r of data.completed_results)assert.ok(!data.fixtures.some(f=>key(f)===key(r)));
  for(const f of update.schedule)assert.equal(data.fixtures.find(g=>key(f)===key(g)).date,f.date);
});
test('Monte Carlo output is finite, bounded, and has four relegated teams per season',()=>{
  assert.equal(data.simulations,250000);assert.equal(data.seed,20261116);
  assert.ok(Math.abs(data.final.reduce((s,t)=>s+t.relegation_probability,0)-4)<1e-10);
  for(const t of data.final){
    assert.ok(Number.isFinite(t.expected_pts)&&Number.isFinite(t.avg_position));
    assert.ok(t.expected_pts>=t.current_pts&&t.expected_pts<=t.current_pts+3*t.games_remaining);
    assert.ok(t.relegation_probability>=0&&t.relegation_probability<=1);
    assert.ok(t.p10_points<=t.p90_points);
  }
  for(const f of data.fixtures)assert.ok(Math.abs(f.ph+f.pd+f.pa-1)<1e-10);
  for(const rows of Object.values(data.conditional)){
    assert.ok(Math.abs(rows.reduce((s,r)=>s+r.frequencia,0)-1)<1e-10);
    for(const r of rows)for(const p of [r.risco_casa,r.risco_fora])assert.ok(Number.isFinite(p)&&p>=0&&p<=1);
  }
});
test('only four nonempty rounds remain and incomplete predictions do not reveal standings',()=>{
  const a=app();assert.equal(a.run('JSON.stringify(ROUND_ORDER)'),'[35,36,37,38]');
  assert.equal(a.run('ROUND_GROUPS.every(g=>g.games.length>0)'),true);
  assert.equal(a.run('computeFinal()'),null);
  assert.match(a.run('simSetup()'),/39 palpites/);
});
test('home wins, draws, away wins and mixed predictions produce valid 38-game tables',()=>{
  for(const outcome of ['H','D','A','mixed']){
    const a=app();a.run(`game.favorite='Vasco';game.picks=Object.fromEntries(fIndex.map((f,i)=>[i,${outcome==='mixed'?"['H','D','A'][i%3]":JSON.stringify(outcome)}]));`);
    const out=a.run('computeFinal()');assert.equal(out.rows.length,20);
    for(const t of out.rows){assert.equal(t.played,38);assert.equal(t.wins+t.draws+t.losses,38);assert.equal(t.pts,t.wins*3+t.draws);}
    assert.equal(out.rows.reduce((s,t)=>s+t.gf-t.ga,0),0);
    assert.equal(Object.keys(out.matches).length,39);
    for(let i=0;i<39;i++){
      const [h,g]=out.matches[i].split(' × ').map(Number);
      const pick=a.run(`game.picks[${i}]`);assert.equal(h>g?'H':h===g?'D':'A',pick);
    }
    assert.match(a.run('simResult()'),/39\/39 PALPITES/);
  }
});
test('legacy progress preserves each remaining fixture instead of shifting predictions',()=>{
  for(const [key,fixtureKeys] of Object.entries(data.legacy_fixture_keys)){
    const picks=Object.fromEntries(fixtureKeys.map((_,i)=>[i,['H','D','A'][i%3]]));
    const a=app({[key]:JSON.stringify({favorite:'Vasco',phase:'result',step:5,picks})});a.run('safeLoad()');
    assert.equal(a.run('selectedCount()'),39);assert.equal(a.run('game.phase'),'result');
    for(let i=0;i<39;i++){
      const f=data.fixtures[i],old=fixtureKeys.indexOf(`${f.rodada}|${f.home}|${f.away}`);
      assert.equal(a.run(`game.picks[${i}]`),picks[old]);
    }
    assert.equal(JSON.parse(a.storage.get('br26:torcedor:v2')).fixtureKeys.length,39);
  }
});
test('saved identities survive reordering and partial progress resumes in a valid round',()=>{
  const keys=data.fixtures.map(f=>`${f.rodada}|${f.home}|${f.away}`).reverse();
  const a=app({'br26:torcedor:v2':JSON.stringify({favorite:'Vasco',phase:'result',step:5,fixtureKeys:keys,picks:{0:'A',38:'D'}})});
  a.run('safeLoad()');assert.equal(a.run('game.picks[38]'),'A');assert.equal(a.run('game.picks[0]'),'D');
  assert.equal(a.run('game.phase'),'play');assert.equal(a.run('game.step'),0);
});
test('overview, standings and risk screens render from the updated dataset',()=>{
  const a=app();a.run('renderOverview();renderStandings();renderRisk();');
  assert.match(a.nodes.get('top-metrics').innerHTML,/>39</);
  assert.match(a.nodes.get('completed-fixtures').innerHTML,/Chapecoense/);
  assert.equal((a.nodes.get('classification-body').innerHTML.match(/<tr /g)||[]).length,20);
  assert.ok(!a.nodes.get('full-risk-list').innerHTML.includes('NaN'));
});
