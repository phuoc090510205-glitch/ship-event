/* ===== c65: PvP — công trình đối thủ có hiệu ứng thật như công trình của ta; đối thủ dùng thảm, mọi tàu/boss và kỹ năng thuyền trưởng (không phụ thuộc mở khóa của người chơi) ===== */
(function(){
const DB=()=>typeof DFB!=='undefined'?DFB:50;
const players=G=>[G.pl].concat(G.al||[]).filter(u=>u&&!u.dead);
const hitP=(G,u,d)=>{try{if(u===G.pl)dfDmgS(u,d);else dfDmgA(u,d)}catch(e){}};
const near=(a,b,r)=>Math.hypot(a.x-b.x,a.y-b.y)<=r+(b.size||2)*.3;
const LVK=l=>1+.1*((l||1)-1);
/* ---- 1) thảm của đối thủ: chọn ngẫu nhiên 1 thảm bất kỳ, áp chỉ số lên công trình địch ---- */
function carpet(G,o){if(!window.C39||!C39.CP||!C39.TIERS||!C39.KINDS)return;const r=o.rank||1;
  const L=C39.CP.filter(c=>c.tier>=0&&c.tier<=Math.min(5,Math.floor(r/3)+1));const c=(L.length?L:C39.CP)[(Math.random()*(L.length||C39.CP.length))|0];if(!c)return;
  const t=C39.TIERS[c.tier],K=(C39.KINDS[c.kind]||{}).k,V=t.V;G.c65cp={c,K,V};
  G.eu.forEach(u=>{if(u.dead)return;const add=V+(K==='hp'||K==='rev'?V:0)+(K==='hq'&&u===G.eh?V*3:0);u.max+=add/DB();u.hp+=add/DB();
    const sh=(t.arm||0)+(K==='shd'?V:0);if(sh>0){const v=sh/DB();u.shd={v:(u.shd&&u.shd.v||0)+v,max:(u.shd&&u.shd.max||0)+v,t:1e9}}
    if(K==='red')u.red=Math.min(.6,(u.red||0)+Math.min(50,V*.03)/100);
    (u.ws||[]).forEach(w=>{if(K==='dmg'||K==='rage')w.dmg*=1+V*.06/100;if(K==='rof')w.cd/=1+V*.04/100;if(K==='rng')w.rng*=1+V*.02/100})});
  setTimeout(()=>{try{toast('Đối thủ trải '+c.n)}catch(e){}},1600)}
/* ---- 2) hiệu ứng công trình đối thủ theo loại công trình ---- */
function arm(G){const hs=Math.sqrt((G.pvo&&G.pvo.fr)||1);let pas=0;
  G.eu.forEach(u=>{const bd=u.bd||{},f=bd.nb;if(!f)return;const l=bd.lv||1;
    if(f.k==='tur'&&f.dmg&&!(u.ws&&u.ws.length)){u.ws=[{w:null,sp:{k:f.t||'gun',sp:f.sp||14,spl:f.spl,col:f.col||'#ff8a6a'},dmg:f.dmg*LVK(l)*hs,cd:f.cd||1,t:Math.random()*(f.cd||1),rng:f.rng||8,mx:0,my:0}]}
    if(f.k==='pas')pas++;
    u.c65={k:f.k,r:f.r||6,l,jam:f.jam,slow:f.slow,pulse:f.pulse,dot:f.dot,a:f.a,v:f.v,cd:0}});
  const m=1+Math.min(.5,pas*.05);if(pas)G.eu.forEach(u=>(u.ws||[]).forEach(w=>w.dmg*=m));G.c65on=1}
function atk(G,dt){G.c69at=(G.c69at||0)+dt;if(G.c69at<15)return;G.c69at-=15;if((G.c69n||0)>=50)return;const n=G.c69n=(G.c69n||0)+1;
  (G.eu||[]).forEach(u=>{if(u.dead||!u.ws||!u.ws.length)return;u.ws.forEach(w=>{w.rng=(w.rng||6)+1});try{G.fx.push({x:u.x,y:u.y,r:Math.max(u.w||2,u.h||2)*.9,t:.6,max:.6,col:'#ff5a5a'})}catch(e){}});
  G.pb=G.pb||{dm:1,cdm:1,rm:1};if(G.c69rm0==null)G.c69rm0=G.pb.rm||1;G.pb.rm=G.c69rm0*(1+.125*n);
  (G.bl||[]).forEach(b=>{if(b.hp<=0)return;const gun=(typeof BT!=='undefined'&&BT[b.t])||(b.nb&&(b.nb.k==='tur'||/drone/.test(b.t)));if(gun)try{G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*.9,t:.6,max:.6,col:'#ffb04a'})}catch(e){}});
  try{toast('⚔ Mọi công trình vào trạng thái tấn công · tầm đánh +'+n)}catch(e){}}
function pow(G,dt){G.c69pt=(G.c69pt||0)+dt;if(G.c69pt<20)return;G.c69pt-=20;if((G.c69k||0)>=50)return;const k=G.c69k=(G.c69k||0)+1;G.c69f=100*k;
  (G.eu||[]).forEach(u=>{if(u.dead||!u.ws||!u.ws.length)return;u.ws.forEach(w=>{w.dmg=(w.dmg||0)+100/Math.max(.2,u.dm||1)});try{G.fx.push({x:u.x,y:u.y,r:Math.max(u.w||2,u.h||2)*1.1,t:.7,max:.7,col:'#ff3a8a'})}catch(e){}});
  (G.bl||[]).forEach(b=>{if(b.hp<=0)return;const gun=(typeof BT!=='undefined'&&BT[b.t])||(b.nb&&(b.nb.k==='tur'||/drone/.test(b.t)));if(gun)try{G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*1.1,t:.7,max:.7,col:'#ff3a8a'})}catch(e){}});
  try{toast('💥 Công trình hai bên +100 sát thương mỗi viên đạn · tổng +'+G.c69f+' ('+k+'/50)')}catch(e){}}
function step(G,dt){try{atk(G,dt);pow(G,dt)}catch(e){console.error(e)}if(!G.c65on||!G.eu)return;const P=G.pl;let slowK=1;
  G.eu.forEach(u=>{const c=u.c65;if(!c||u.dead||u.hp<=0)return;c.cd-=dt;const R=c.r,lk=LVK(c.l);
    if(c.k==='aura'){players(G).forEach(s=>{if(!near(u,s,R))return;
        if(c.jam)(s.ws||[]).forEach(w=>{w.t+=dt*Math.min(.6,c.jam)});
        if(c.slow||!(c.jam||c.pulse||c.dot))slowK=Math.min(slowK,1-Math.min(.5,(c.slow||.2)));
        if(c.dot)hitP(G,s,(typeof c.dot==='number'?c.dot:20)*lk*dt*.5)});
      if(c.pulse&&c.cd<=0){c.cd=4;players(G).forEach(s=>{if(near(u,s,R))hitP(G,s,(typeof c.pulse==='number'?c.pulse:200)*lk/4)});try{G.fx.push({x:u.x,y:u.y,r:R,t:.4,max:.4,col:'#8fe8ff'})}catch(e){}}}
    else if(c.k==='heal'&&c.cd<=0){c.cd=1;const a=(c.a||30)*lk/DB();G.eu.forEach(v=>{if(!v.dead&&v.hp>0&&v.hp<v.max&&Math.hypot(v.x-u.x,v.y-u.y)<=R+3)v.hp=Math.min(v.max,v.hp+a)})}
    else if(c.k==='dome'&&!c.done){c.done=1;G.eu.forEach(v=>{if(Math.hypot(v.x-u.x,v.y-u.y)<=R)v.red=Math.min(.6,(v.red||0)+Math.min(.4,(c.v||20)/100))})}
    else if(c.k==='trap'&&c.cd<=0){const hit=players(G).filter(s=>near(u,s,R));if(hit.length){c.cd=6;hit.forEach(s=>hitP(G,s,300*lk));try{G.fx.push({x:u.x,y:u.y,r:R,t:.5,max:.5,ex:1,rot:0})}catch(e){}}}
    else if(c.k==='rev'&&!c.used){const d=G.eu.find(v=>v!==u&&(v.dead||v.hp<=0)&&!v.c65rv&&v!==G.eh);if(d){c.used=1;d.c65rv=1;d.dead=false;d.hp=d.max*.5;try{G.fx.push({x:d.x,y:d.y,r:2,t:.6,max:.6,col:'#9ff0b8'})}catch(e){}}}});
  const F=G.c65cp;if(F){if(F.K==='reg')G.eu.forEach(u=>{if(!u.dead&&u.hp>0&&u.hp<u.max)u.hp=Math.min(u.max,u.hp+F.V/50/DB()*dt)});
    if(F.K==='rev'&&!F.rv){const d=G.eu.find(u=>u!==G.eh&&(u.dead||u.hp<=0));if(d){F.rv=1;d.dead=false;d.hp=F.V/DB()}}}
  /* làm chậm tàu ta trong vùng công trình địch */
  players(G).forEach(s=>{if(slowK<1&&s===P){if(!s.c65sk){s.c65sk=slowK;s.sp*=slowK}}else if(s.c65sk){s.sp/=s.c65sk;s.c65sk=0}})}
/* ---- 3) kỹ năng thuyền trưởng của đối thủ (dùng chung bộ máy kỹ năng boss c54) ---- */
function skills(G){if(!window.C54||!C54.pool)return;const pool=C54.pool();if(!pool.length)return;
  G.en.filter(e=>!e.dead&&(e.pvE||e.pvEsc)).forEach(e=>{const k=pool[(Math.random()*pool.length)|0];e.c54k=k;try{e.c54s=CSK.style(k,CSK.plan(k))}catch(x){e.c54s={m:'star',c1:'#ff7a5c',c2:'#fff',sd:1}}
    const m=String(((k[6]||[]).find(r=>r[0]==='Hồi chiêu')||[])[1]||'').match(/\d+/);e.c54cd0=Math.max(12,Math.min(30,m?+m[0]:20));e.c54cd=4+Math.random()*4})}
{const _P=pvSetup;pvSetup=function(G,o){const r=_P.apply(this,arguments);try{G.c69d0={da:S.da,sao:S.sao}}catch(e){}try{carpet(G,o)}catch(e){console.error(e)}try{arm(G)}catch(e){console.error(e)}try{skills(G)}catch(e){console.error(e)}return r}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.pvp&&!G.done)step(G,dt)}catch(e){console.error(e)}return r}}
window.C65={carpet,arm,skills};
})();
