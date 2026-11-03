/* ===== c65: PvP — công trình đối thủ có hiệu ứng thật như công trình của ta; đối thủ dùng thảm, mọi tàu/boss và kỹ năng thuyền trưởng (không phụ thuộc mở khóa của người chơi) ===== */
(function(){
const DB=()=>typeof DFB!=='undefined'?DFB:50;
const players=G=>[G.pl].concat(G.al||[]).filter(u=>u&&!u.dead);
const hitP=(G,u,d)=>{try{if(u===G.pl)dfDmgS(u,d);else dfDmgA(u,d)}catch(e){}};
const near=(a,b,r)=>Math.hypot(a.x-b.x,a.y-b.y)<=r+(b.size||2)*.3;
const LVK=l=>1+.1*((l||1)-1);
/* ---- 1) thảm của đối thủ: chọn ngẫu nhiên 1 thảm bất kỳ, áp chỉ số lên công trình địch ---- */
function carpet(G,o){if(!window.C39||!C39.CP||!C39.TIERS||!C39.KINDS)return;const r=o.rank||1;
  const tr=2+((Math.random()*4)|0);let L=C39.CP.filter(c=>c.tier===tr);if(!L.length)L=C39.CP.filter(c=>c.tier>=2);const c=L[(Math.random()*L.length)|0];if(!c)return;
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
function atk(G,dt){if(G.t-(G.pvT0||0)<60)return;G.c69at=(G.c69at||0)+dt;if(G.c69at<5)return;G.c69at-=5;if((G.c69n||0)>=50)return;const n=G.c69n=(G.c69n||0)+1;
  (G.eu||[]).forEach(u=>{if(u.dead||!u.ws||!u.ws.length)return;u.ws.forEach(w=>{if(w.c85b==null)w.c85b=w.rng||6;w.rng=w.c85b*(1+.125*n)+7});try{G.fx.push({x:u.x,y:u.y,r:Math.max(u.w||2,u.h||2)*.9,t:.6,max:.6,ns:1,col:'#ff5a5a'})}catch(e){}});
  G.pb=G.pb||{dm:1,cdm:1,rm:1};if(G.c69rm0==null)G.c69rm0=G.pb.rm||1;G.pb.rm=G.c69rm0*(1+.125*n);
  (G.bl||[]).forEach(b=>{if(b.hp<=0)return;const gun=(typeof BT!=='undefined'&&BT[b.t])||(b.nb&&(b.nb.k==='tur'||/drone/.test(b.t)));if(gun)try{G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*.9,t:.6,max:.6,ns:1,col:'#ffb04a'})}catch(e){}});
  try{toast(n===1?'⚔ Tăng tầm đánh: công trình địch luôn dẫn trước 7 ô':'⚔ Mọi công trình vào trạng thái tấn công · tầm đánh +'+n)}catch(e){}}
function pow(G,dt){if(G.t-(G.pvT0||0)<60)return;G.c69pt=(G.c69pt||0)+dt;if(G.c69pt<6)return;G.c69pt-=6;if((G.c69k||0)>=50)return;const k=G.c69k=(G.c69k||0)+1;G.c69f=100*k;
  (G.eu||[]).forEach(u=>{if(u.dead||!u.ws||!u.ws.length)return;u.ws.forEach(w=>{w.dmg=(w.dmg||0)+(k===1?600:100)/Math.max(.2,u.dm||1)});try{G.fx.push({x:u.x,y:u.y,r:Math.max(u.w||2,u.h||2)*1.1,t:.7,max:.7,ns:1,col:'#ff3a8a'})}catch(e){}});
  (G.bl||[]).forEach(b=>{if(b.hp<=0)return;const gun=(typeof BT!=='undefined'&&BT[b.t])||(b.nb&&(b.nb.k==='tur'||/drone/.test(b.t)));if(gun)try{G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*1.1,t:.7,max:.7,ns:1,col:'#ff3a8a'})}catch(e){}});
  try{toast(k===1?'💥 Tăng sát thương: công trình địch luôn dẫn trước 500 mỗi viên':'💥 Công trình hai bên +100 sát thương mỗi viên đạn ('+k+'/50)')}catch(e){}}
function ecarp(G,dt){const F=G.c65cp;if(!F||!window.C39)return;const c=F.c;
  if(!G.c65reg){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;(G.eu||[]).forEach(u=>{if(!u.w)return;x0=Math.min(x0,u.x-u.w/2);y0=Math.min(y0,u.y-u.h/2);x1=Math.max(x1,u.x+u.w/2);y1=Math.max(y1,u.y+u.h/2)});G.c65reg={x0:x0-1,y0:y0-1,x1:x1+1,y1:y1+1}}
  const R=G.c65reg,mine=[G.pl].concat(G.al||[]).filter(u=>u&&!u.dead);
  if(!G.c65cpOn){G.c65cpOn=1;try{toast('Thảm đối thủ «'+c.n.replace(/^Thảm /,'')+'» đang phát huy sức mạnh')}catch(e){}}
  if(c.tier===2&&C39.zoneStep){const M={en:mine,pl:G.pvEn||{dead:true,x:-99,y:-99},al:(G.en||[]).filter(e=>e.pvEsc&&!e.dead),bl:[],c39reg:R,t:G.t,fx:G.fx,dmM:1,wd:G.wd,pvp:true};try{C39.zoneStep(M,dt,{c,K:F.K,V:F.V,DB:DB()})}catch(e){}return}
  /* thảm hạng cao (Huyền thoại, Tối thượng, Người giàu): đòn sức mạnh thảm định kỳ lên tàu ta ở gần căn cứ địch + hồi máu công trình địch */
  const per=Math.max(5,12-c.tier);G.c65cpt=(G.c65cpt||0)+dt;if(G.c65cpt<per)return;G.c65cpt-=per;
  const tg=mine.filter(u=>u.x>R.x0-8&&u.x<R.x1+8&&u.y>R.y0-8&&u.y<R.y1+8);const d=F.V*.5,col=['#9fe8ff','#ffd24a','#ff7ae0','#ffcf5a'][Math.min(3,c.tier-2)];
  tg.forEach(u=>{hitP(G,u,d);try{G.fx.push({x:u.x,y:u.y,r:2.2,t:.6,max:.6,ex:1,rot:Math.random()*6});G.bm.push({x1:G.eh?G.eh.x:u.x,y1:G.eh?G.eh.y:u.y-6,x2:u.x,y2:u.y,t:.35,col,w:5})}catch(e){}});
  (G.eu||[]).forEach(u=>{if(!u.dead&&u.hp>0&&u.hp<u.max)u.hp=Math.min(u.max,u.hp+F.V*.2/DB())});
  if(tg.length)try{toast('⚡ Sức mạnh thảm đối thủ: −'+Math.round(d)+' máu')}catch(e){}}
function step(G,dt){try{esup(G,dt)}catch(e){console.error(e)}try{ecast(G,dt)}catch(e){console.error(e)}try{atk(G,dt);pow(G,dt);if(!esum(G,dt))ecarp(G,dt);else if(!G.c65cpOn){G.c65cpOn=1}}catch(e){console.error(e)}if(!G.c65on||!G.eu)return;const P=G.pl;let slowK=1;
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

/* ---- 4) thảm đối thủ dùng TOÀN BỘ sức mạnh thảm như của ta (thần long, khách sạn, hành tinh rơi, xúc xắc, thuyền, máy bay, kraken…): chạy chính bộ máy thảm C40 cho phe địch ---- */
const ckey=c=>c&&c.tier>=2?(c.vk!=null?c.vk:c.tier*10+c.kind):-1;
function mirror(G){const M=G.c72M||(G.c72M={pvp:true,c72:1,c39sim:1});M.en=players(G);M.pl=(G.pvEn&&!G.pvEn.dead)?G.pvEn:{dead:true,x:-99,y:-99,hp:0,max:1,ws:[]};M.al=(G.en||[]).filter(e=>e.pvEsc&&!e.dead);
  if(!G.c72eh||G.c72eh.o!==G.eh){const o=G.eh;G.c72eh={o,p:new Proxy(o,{get:(t,k)=>k==='t'?'hq':t[k]})}}const EP=G.c72eh.p;M.bl=G.eu.map(u=>u===G.eh?EP:u);M.hq=EP;
  M.t=G.t;M.fx=G.fx;M.bm=G.bm;M.pr=G.pr;M.rocks=G.rocks;M.dmM=1;M.wd=G.wd;M.c39reg=G.c65reg;M.c39c=G.c65cp&&G.c65cp.c;M.kills=0;return M}
function esum(G,dt){const F=G.c65cp;if(!F||!window.C40||!C40.step||!G.c65reg)return false;const K=ckey(F.c);if(K<27)return false;
  const M=mirror(G);if(M.c40x&&!M.c40)return false;M.c40=G.c40e||null;
  const _D=dfDmgS;dfDmgS=function(u,d,f){if(u&&u!==G.pl&&(G.al||[]).includes(u)&&typeof dfDmgA==='function')return dfDmgA(u,d);return _D.apply(this,arguments)};
  try{C40.step(M,dt)}catch(e){console.error(e)}finally{dfDmgS=_D}
  if(!M.c40)return false;
  if(!G.c40e){G.c40e=M.c40;G.c40e.c72=1;try{toast('Thảm đối thủ «'+F.c.n.replace(/^Thảm /,'')+'» phát huy toàn bộ sức mạnh!')}catch(e){}}
  const S=G.c40e;if(S.u.length>300)S.u=S.u.filter(u=>!u.gone||G.t-u.dt0<3);return true}
/* tàu ta bị hạ trong vùng thảm địch: đếm cho các thảm tính theo lượt hạ (Pháp Trận, Hư Không, Thánh Kiếm, Cổng Địa Ngục…) */
{const ours=(G,u)=>u===G.pl||(G.al||[]).includes(u);
 const hook=u=>{const G=DG,S=G&&G.c40e,M=G&&G.c72M;if(!S||!M)return;const ins=C40.H.inR(S.Rg,u,2);if(S.K===28&&ins)S.cnt+=5;if(S.K===37&&ins)S.frag+=50;if(S.K===39&&ins)S.deaths++;try{const f=C40.X.death[S.K];if(f)f(M,S,u,false,ins)}catch(e){}};
 const _S=dfDmgS;dfDmgS=function(s,d,f){const G=DG,was=s&&!s.dead,r=_S.apply(this,arguments);try{if(G&&G.c40e&&was&&s.dead&&ours(G,s))hook(s)}catch(e){}return r};
 if(typeof dfDmgA==='function'){const _A=dfDmgA;dfDmgA=function(a,d){const G=DG,was=a&&!a.dead,r=_A.apply(this,arguments);try{if(G&&G.c40e&&was&&a.dead&&ours(G,a))hook(a)}catch(e){}return r}}}
/* phe ta bắn được quân thảm đối thủ */
window.c72Hit=function(p){const G=DG,S=G&&G.c40e;if(!S||!S.u.length||p.team==='e'||p.dead)return false;for(const u of S.u){if(u.dead||u.noT)continue;if(Math.hypot(u.x-p.x,u.y-p.y)<=(u.hr||.6)+.15){p.dead=true;try{if(p.spl)dfBlast(p.x,p.y,p.spl,p.dmg,'p');dfDmgS(u,p.dmg||0)}catch(e){}return true}}return false};
{const _B=bmkFor;bmkFor=function(u){const r=_B.apply(this,arguments);if(r)return r;try{const G=DG,S=G&&G.c40e;if(!S||!u||!S.u.length||!G.pvp)return null;const rg=(u.ws&&u.ws.length)?Math.max(...u.ws.map(w=>w.rng||0)):8;let b=null,bd=rg;
  for(const o of S.u){if(o.dead||o.noT)continue;const q=Math.hypot(o.x-u.x,o.y-u.y);if(q<bd){bd=q;b=o}}if(!b)return null;for(const e of G.en){if(e.dead||e.spawn>G.t)continue;if(Math.hypot(e.x-u.x,e.y-u.y)<bd)return null}return b}catch(e){return null}}}
{const _B=dfBlast;dfBlast=function(x,y,r,d,team){const out=_B.apply(this,arguments);try{const G=DG,S=G&&G.c40e;if(S&&team==='p')S.u.forEach(u=>{if(!u.dead&&!u.noT&&Math.hypot(u.x-x,u.y-y)<=r+(u.hr||.6))dfDmgS(u,d)})}catch(e){}return out}}
/* ---- 5) 10 mẫu xây riêng cho căn cứ đối thủ: trụ sở luôn ở hàng cuối cùng (xa phía ta nhất), công trình nằm gọn trong thảm ---- */
const TPL=[
 {n:'Hàng ngang',f:(dx,y)=>y*100+Math.abs(dx)},
 {n:'Cột dọc',f:(dx,y)=>Math.abs(dx)*100+y},
 {n:'Bán nguyệt',f:(dx,y)=>Math.hypot(dx,y*1.1)},
 {n:'Mũi tên',f:(dx,y)=>Math.abs(dx)+y*.5},
 {n:'Hai cánh',f:(dx,y,k,R)=>Math.abs(Math.abs(dx)-R*.28)*2+y*.5},
 {n:'Kim cương',f:(dx,y,k,R)=>Math.abs(dx)+Math.abs(y-R*.4)},
 {n:'Tường chắn',f:(dx,y,k,R)=>k==='w'?(R-y)*100+Math.abs(dx):y*100+Math.abs(dx),ord:['f','t','w']},
 {n:'Bàn cờ',f:(dx,y)=>y*100+Math.abs(dx),gap:1},
 {n:'Xoắn ốc',f:(dx,y)=>Math.hypot(dx,y)+Math.atan2(y,dx)*1.6},
 {n:'Pháo đài',f:(dx,y,k,R)=>{const r=Math.hypot(dx,y);return k==='f'?r:k==='t'?Math.abs(r-R*.38):Math.abs(r-R*.6)},ord:['f','t','w']}];
/* cấp công trình địch tăng dần theo bậc: bậc 1 ≈ cấp 1 · bậc 15 = toàn bộ cấp 100 */
function lvRank(B,rank){const r=Math.max(1,Math.min(15,rank||1)),fl=Math.round(1+99*Math.pow((r-1)/14,1.35));
  B.items.forEach(it=>{const f=it.hqf?fl:Math.max(1,fl-((Math.random()*Math.max(1,fl*.08))|0));it.lv=Math.min(100,Math.max(it.lv||1,r>=15?100:f))});const hq=B.items.find(i=>i.hqf);if(hq)B.hqLv=hq.lv;B.lvFloor=fl;return B}
function layout(B,ti){const items=B.items,hq=items.find(i=>i.hqf);if(!hq)return B;const rest=items.filter(i=>i!==hq),T=TPL[ti!=null?ti:(Math.random()*TPL.length)|0],gap=T.gap||0;
  const kind=i=>i.t==='wall'?'w':(typeof BT!=='undefined'&&BT[i.t])?'t':'f',ord=T.ord||['t','w','f'];
  rest.sort((a,b)=>ord.indexOf(kind(a))-ord.indexOf(kind(b))||(b.w*b.h-a.w*a.h));
  const area=items.reduce((s,i)=>s+(i.w+gap)*(i.h+gap),0);let R=Math.max(hq.w+4,Math.ceil(Math.sqrt(area*1.3)));
  for(let tr=0;tr<14;tr++,R+=2){const g=new Uint8Array(R*R),put=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j*R+i]=1},
      free=(x,y,w,h,m)=>{for(let j=Math.max(0,y-m);j<Math.min(R,y+h+m);j++)for(let i=Math.max(0,x-m);i<Math.min(R,x+w+m);i++)if(g[j*R+i])return false;return true};
    const hx=Math.floor((R-hq.w)/2);put(hx,0,hq.w,hq.h);const pos=[[hq,hx,0]],cache={};let ok=true;
    for(const it of rest){const k=kind(it),key=k+it.w+'x'+it.h;let L=cache[key];if(!L){L=[];for(let y=0;y<=R-it.h;y++)for(let x=0;x<=R-it.w;x++)L.push([x,y,T.f(x+it.w/2-R/2,y+it.h/2,k,R)]);L.sort((a,b)=>a[2]-b[2]);cache[key]=L}
      let q=null;for(const c of L){if(free(c[0],c[1],it.w,it.h,gap)){q=c;break}}if(!q){ok=false;break}put(q[0],q[1],it.w,it.h);pos.push([it,q[0],q[1]])}
    if(ok){pos.forEach(([it,x,y])=>{it.x=x;it.y=y});B.R=R;B.tpl=T.n;return B}}
  return B}
{const _G=pvGenBase;pvGenBase=function(rank){const B=_G.apply(this,arguments);try{layout(B)}catch(e){console.error(e)}try{lvRank(B,rank)}catch(e){console.error(e)}return B}}

/* ---- 6) MỌI công trình có cơ chế riêng của địch chạy đúng cơ chế như của ta (tạo giáp, hồi máu, dựng lại, hồi sinh, pháo đặc biệt, bẫy, lồng, sóng…) ---- */
const SKIP=new Set(['pr6','mine','warp','hangar']);
const ety=u=>u&&u.bd?u.bd.t:u&&u.t;
const SPEC=u=>{const nb=u&&u.bd&&u.bd.nb;if(!nb||SKIP.has(ety(u)))return false;return !!(nb.c16||nb.c17||nb.c18||nb.c19||nb.c20||nb.c21||nb.c22||(nb.k&&nb.k!=='tur'))};
const SUP={has:t=>!SKIP.has(t)};
function eprox(u,i){if(!u.c81p){const nb=u.bd&&u.bd.nb,lv=(u.bd&&u.bd.lv)||1,id='e81_'+ety(u)+'_'+i;u.c81p=new Proxy(u,{get:(t,k)=>k==='nb'?nb:k==='t'?ety(t):k==='lv'?lv:k==='id'?id:k==='hq'?(t===(DG&&DG.host?DG.host.eh:DG&&DG.eh)):k==='spec'?null:t[k]})}return u.c81p}
function bworld(G){let M=G.c81M;if(!M||M.host!==G){M=G.c81M={host:G,c81:1,pvp:false,c20sim:1,c39:1,c40x:1,pb:{dm:1,cdm:1,rm:1},respawn:0,deaths:0,kills:0,done:false,cur:G.cur,dmM:1};window.__MB=(window.__MB||[]).filter(w=>w.host===G);window.__MB.push(M)}
  const ours=players(G);ours.forEach(u=>{if(u.spawn==null)u.spawn=0});
  M.pl=(G.pvEn&&!G.pvEn.dead)?G.pvEn:(M.dpl||(M.dpl={dead:true,x:-99,y:-99,hp:0,max:1,ws:[],sk:[],cs:{}}));M.al=(G.en||[]).filter(e=>e.pvEsc&&!e.dead);M.en=ours;
  M.bl=(G.eu||[]).map((u,i)=>eprox(u,i));M.hq=G.eh&&G.eh.c81p;M.t=G.t;M.fx=G.fx;M.bm=G.bm;M.wd=G.wd;M.pr=G.pr;M.rocks=G.rocks||[];M.ehq=M.hq;return M}
function esup(G,dt){const L=(G.eu||[]).map((u,i)=>[u,i]).filter(([u])=>SPEC(u));const M=bworld(G);if(!L.length)return;
  window.__mwRun([M],()=>{L.forEach(([u,i])=>{if(u.dead||u.hp<=0)return;const b=eprox(u,i),nb=b.nb;
    try{if(nb.c16&&window.c16Tick&&c16Tick(b,dt,M))return;if(nb.c17&&window.c17Tick&&c17Tick(b,dt,M))return;if(nb.c18&&window.c18Tick&&c18Tick(b,dt,M))return;if(nb.c19&&window.c19Tick&&c19Tick(b,dt,M))return;
      if(nb.c20&&window.c20Tick&&c20Tick(b,dt,M))return;if(nb.c21&&window.c21Tick&&c21Tick(b,dt,M))return;if(nb.c22&&window.c22Tick&&c22Tick(b,dt,M,1))return;if(nb.k&&nb.k!=='tur'&&typeof dfNb==='function')dfNb(b,dt,M)}catch(e){}})});
  /* công trình địch được dựng lại -> đưa trở lại trận */
  (G.eu||[]).forEach(u=>{if(u.hp>0&&u.dead){u.dead=false;u.hit=0;if(!G.en.includes(u))G.en.push(u)}});
  /* mô-đun hồi sinh của địch */
  const E=G.pvEn;if(E&&E.dead&&!G.done&&!(G.eh&&G.eh.dead)){const m=L.map(([u])=>u).find(u=>ety(u)==='mt8'&&!u.dead&&u.hp>0&&!(u.c81rv>G.t));
    if(m){const R=G.c65reg||{x0:m.x-3,x1:m.x+3,y0:m.y-3,y1:m.y+3};E.dead=false;E.hp=E.max;if(E.nrgMax)E.nrg=E.nrgMax;E.x=R.x0+(R.x1-R.x0)*(.2+Math.random()*.6);E.y=R.y1+1.2;E.tx=E.x;E.ty=E.y;E.vx=0;E.vy=0;
      if(!G.en.includes(E))G.en.push(E);G.pvRs=0;m.c81rv=G.t+180;try{G.fx.push({x:m.x,y:m.y,r:2.2,t:.7,max:.7,col:'#7dffa0'});G.fx.push({x:E.x,y:E.y,r:1.8,t:.6,max:.6,col:'#ffffff'});toast('Mô-đun hồi sinh của đối thủ: tàu chính địch hồi sinh ngay!')}catch(e){}}}}
/* ---- 7) thuyền trưởng của tàu địch: mỗi tàu địch có 1 thuyền trưởng, cấp theo bậc, tự dùng đúng các kỹ năng của thuyền trưởng đó (drone, robot, ong lửa, đẩy lùi…) ---- */
function ecap(G,e){if(e.c82sk)return;const r=Math.max(1,Math.min(15,(G.pvo&&G.pvo.rank)||1)),lv=Math.min(100,Math.round(1+99*Math.pow((r-1)/14,1.2))),C=(typeof CAP!=='undefined'?CAP:[]);
  const c=C[(Math.random()*C.length)|0];e.capn=c?c[0]:'Thuyền trưởng';e.c82lv=lv;e.c54k=null;e.c82sk=[];const n=(typeof CSL!=='undefined'?CSL:[5,30,60,90]).filter(u=>lv>=u).length,R=(typeof SLR!=='undefined'?SLR:[3,0,1,2]);
  for(let j=0;j<n;j++){const L=[];KI.forEach((k,ix)=>{if(k&&k[2]===R[j]&&!(typeof KDEL!=='undefined'&&KDEL[k[0]])&&(typeof KC==='undefined'||KC.includes(k[1])))L.push(ix)});if(!L.length)continue;const ix=L[(Math.random()*L.length)|0],k=KI[ix];
    const cd=parseFloat(String(((k[6]||[]).find(x=>x[0]==='Hồi chiêu')||[0,'20'])[1]).replace(',','.'))||20;const ent={m:{n:k[0],img:(typeof KP!=='undefined'?KP[ix]:''),t:'cap',id:'cs'+ix},q:{pw:0,dur:0,cd,ec:0},cd:4+Math.random()*6,cd0:Math.max(6,cd),cap:k,src:e,cn:e.capn};
    try{ent.sty=CSK.style(k,CSK.plan(k))}catch(x){}e.c82sk.push(ent)}}
function sworld(G){let W=G.c82W;if(!W||W.host!==G){W=G.c82W={host:G,c82:1,pvp:false,c39:1,c40x:1,c20sim:1,dmM:1,kills:0,deaths:0,respawn:0,done:false,pb:{dm:1,cdm:1,rm:1}};window.__MW=(window.__MW||[]).filter(w=>w.host===G);window.__MW.push(W)}
  const M=bworld(G);W.pl=M.pl;if(!W.pl.cs)W.pl.cs={};W.al=M.al;W.en=M.en;W.bl=M.bl;W.hq=M.hq;W.t=G.t;W.fx=G.fx;W.bm=G.bm;W.wd=G.wd;W.pr=G.pr;W.rocks=G.rocks||[];W.eu=[];return W}
function ecast(G,dt){if(!window.CSK||!CSK.cast)return;const W=sworld(G),ours=players(G);
  (G.en||[]).forEach(e=>{if(e.dead||!(e.pvE||e.pvEsc))return;ecap(G,e);if(!e.c82sk.length||e.silT>0||e.stun>0||e.spawn>G.t)return;const near=ours.some(u=>Math.hypot(u.x-e.x,u.y-e.y)<16);
    e.c82sk.forEach(k=>{k.cd-=dt;if(k.cd>0||!near)return;k.cd=k.cd0;const tm=e.team;window.__mwRun([W],()=>{e.team='p';e.cs=e.cs||{};try{CSK.cast(e,k,1)}finally{e.team=tm}})})})}
/* ---- 3) kỹ năng thuyền trưởng của đối thủ (dùng chung bộ máy kỹ năng boss c54) ---- */
function skills(G){(G.en||[]).forEach(e=>{if(!e.dead&&(e.pvE||e.pvEsc))ecap(G,e)})}
/* hai phe không chồng công trình: luôn giữ khoảng cách giữa hai thảm (≥1 ô) */
function sep(G){const box=L=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;L.forEach(b=>{if(!b||!b.w)return;x0=Math.min(x0,b.x-b.w/2);y0=Math.min(y0,b.y-b.h/2);x1=Math.max(x1,b.x+b.w/2);y1=Math.max(y1,b.y+b.h/2)});return x0<1e9?{x0:x0-1,y0:y0-1,x1:x1+1,y1:y1+1}:null};
  const rp=box((G.bl||[]).filter(b=>!b.c39tmp)),re=box(G.eu||[]);if(!rp||!re)return 0;if(!(re.x0<rp.x1+1&&re.x1+1>rp.x0))return 0;const gap=rp.y0-re.y1;if(gap>=1)return 0;const d=1-gap+.01;
  const E=(G.eu||[]).concat((G.en||[]).filter(e=>!(G.eu||[]).includes(e)));E.forEach(e=>{e.y-=d;if(e.sy!=null)e.sy-=d;if(e.ty!=null)e.ty-=d});
  const minY=Math.min(...E.map(e=>e.y-(e.h||e.size||1)/2));if(minY<1){const k=1-minY;E.concat(G.bl||[],[G.pl],G.al||[]).forEach(e=>{if(!e)return;e.y+=k;if(e.sy!=null)e.sy+=k;if(e.ty!=null)e.ty+=k});G.wd.Hd+=k}
  return d}
{const _P=pvSetup;pvSetup=function(G,o){const r=_P.apply(this,arguments);try{G.c87sep=sep(G)}catch(e){console.error(e)}try{G.c69d0={da:S.da,sao:S.sao}}catch(e){}try{carpet(G,o)}catch(e){console.error(e)}try{arm(G)}catch(e){console.error(e)}try{skills(G)}catch(e){console.error(e)}try{(G.eu||[]).forEach(u=>{if(SPEC(u)){u.c65=null;const nb=u.bd.nb;if(nb.c16||nb.c17||nb.c18||nb.c19||nb.c20||nb.c21||nb.c22)u.ws=[]}})}catch(e){}try{if(!(o&&o.human))G.eu.forEach(u=>{u.max*=1.5;u.hp=Math.min(u.max,u.hp*1.5);(u.ws||[]).forEach(w=>{w.dmg*=1.5})})}catch(e){console.error(e)}return r}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.pvp&&!G.done)step(G,dt)}catch(e){console.error(e)}return r}}
window.C65={carpet,arm,skills,layout,TPL,esum,ckey,lvRank,esup,SPEC,ecap,ecast,sep};
(function hk(){if(!window.PWR||!PWR.boost){setTimeout(hk,300);return}if(PWR.boost.c82)return;const _b=PWR.boost;PWR.boost=function(o){const r=_b.apply(this,arguments);try{const mine=Math.max(0,PWR.fleet().length-1);o.esc=Math.min(101,mine+3)}catch(e){}return r};PWR.boost.c82=1})();
})();
