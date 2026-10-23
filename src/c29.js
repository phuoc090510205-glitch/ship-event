
/* ===== c29: 3 pháo hạng nặng — Cối Khổng Lồ Vòng Thép (hd10) · Pháo Song Nòng Tầm Xa (hd9) · Pháo Nòng To Khung Vuông (hd8) ===== */
(function(){
const C22=window.C22;if(!C22||!C22.TUR||!C22.TICK||!C22.turret)return;
const TUR=C22.TUR;
/* sát thương theo số hiển thị (nội bộ = /20), giống c22 */
const NEW={
  hd10:{rng:12,cdS:2.4,n:1,dmg:1200,kind:'lob',sp:9,col:'#ffd23a',sz:1.34,spl:1,boom:1,hide:1e9,c29:'mortar',fire:{w:3,h:3,life:4,tick:.1,dmg:20}},
  hd9:{rng:15,rate:3,n:2,par:.5,dmg:300,kind:'bullet',sp:18,col:'#20232c',sz:.2,hide:1e9,c29:'black'},
  hd8:{rng:14,cdS:2.4,n:1,dmg:500,kind:'bullet',sp:14,col:'#ffd23a',sz:.5,hide:1e9,c29:'gold',sp40:{R:3,k:.4}}};
Object.keys(NEW).forEach(t=>{const c=NEW[t];c.id=t;TUR[t]=c;C22.TICK[t]=(b,dt,G,r)=>C22.turret(b,dt,G,TUR[t],r||1);if(!C22.C22T.includes(t))C22.C22T.push(t);
  [typeof NBF!=='undefined'?NBF[t]:null,(BLD.find(x=>x.t===t)||{}).nb].forEach(f=>{if(!f)return;f.c22=t;f.k='aura';['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun','v','n','e','rng','cd','sp','spl','col','t','r'].forEach(k=>{delete f[k]});f.r=0});
  if(typeof BT!=='undefined'&&BT[t])delete BT[t]});
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const fm=x=>String(Math.round(x*100)/100).replace('.',',');
/* ---------- thông tin nâng cấp + mô tả ---------- */
const ROWS={
  hd10:k=>[['Sát thương đạn tròn',nf(1200*k)],['Đạn','Đạn tròn vàng bán kính 1 ô'],['Tốc độ bắn','1 phát / '+fm(NEW.hd10.cdS)+' giây'],['Tầm bắn','12 ô · xoay 360°'],['Vệt lửa','3×3 ô, '+nf(20*k)+' sát thương mỗi 0,1 giây, tồn tại 4 giây']],
  hd9:k=>[['Sát thương mỗi viên',nf(300*k)],['Số viên mỗi lượt','2 (bắn cùng lúc)'],['Tốc độ bắn','3 lượt/giây'],['Tầm bắn','15 ô · xoay 360°']],
  hd8:k=>[['Sát thương viên đạn',nf(500*k)],['Đạn','Đạn vàng to 1×1 ô'],['Tốc độ bắn','1 phát / '+fm(NEW.hd8.cdS)+' giây'],['Tầm bắn','14 ô · xoay 360°'],['Sát thương lan','40% cho mục tiêu trong 3 ô quanh điểm trúng']]};
const NOTE={
  hd10:'Cối bắn đạn tròn vàng bán kính 1 ô, tầm 12 ô, 1.200 sát thương; chỗ trúng để lại vệt lửa 3×3 ô gây 20 sát thương mỗi 0,1 giây trong 4 giây.',
  hd9:'Bắn 2 viên đạn đen cùng lúc vào mục tiêu trong 15 ô, mỗi viên 300 sát thương, 3 phát mỗi giây, xoay 360°.',
  hd8:'Bắn 1 viên đạn vàng to 1×1 vào mục tiêu trong 14 ô, 500 sát thương; mục tiêu trong 3 ô quanh đó chịu 40% sát thương.'};
Object.keys(NEW).forEach(t=>{const u=typeof UPD!=='undefined'&&UPD[t];if(u&&u.st){const o=u.st;u.st=l=>[o(l)[0]].concat(ROWS[t](1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b)b.note=NOTE[t]});
/* ---------- hiệu ứng sau khi đạn chạm: vệt lửa, sát thương lan ---------- */
const enemies=G=>(G.en||[]).filter(e=>!e.dead&&!(e.spawn>G.t));
function dmgB(G,b,e,d){G.c19own=b||null;try{dfDmgS(e,d,false)}finally{G.c19own=null}}
function after(G,p){const c=p.cfg;
  if(c.fire){const F=c.fire;(G.c29f=G.c29f||[]).push({x:p.tx!=null?p.tx:p.x,y:p.ty!=null?p.ty:p.y,w:F.w,h:F.h,t:0,max:F.life,acc:0,b:p.own,d:F.dmg/20*LV(p.own)*(PB(G).dm||1),seed:Math.random()*99});
    G.fx.push({x:p.tx,y:p.ty,r:1.6,t:.4,max:.4,col:'#ffd23a'})}
  if(c.sp40){const W=(G.wd&&G.wd.Wd)||99,H=(G.wd&&G.wd.Hd)||99;if(p.x<-3||p.y<-3||p.x>W+3||p.y>H+3||!(p.life>0))return;
    const E=enemies(G);let hit=null,bd=1e9;E.forEach(e=>{const q=Math.hypot(e.x-p.x,e.y-p.y);if(q<(e.size||2)*.42+p.hr+.35&&q<bd){bd=q;hit=e}});
    let n=0;E.forEach(e=>{if(e===hit||e.dead)return;if(Math.hypot(e.x-p.x,e.y-p.y)<=c.sp40.R+(e.size||2)*.3){dmgB(G,p.own,e,p.dmg*c.sp40.k);n++}});
    G.fx.push({x:p.x,y:p.y,r:c.sp40.R,t:.35,max:.35,col:'#ffe27a'});G.fx.push({x:p.x,y:p.y,r:1.1,t:.5,max:.5,ex:1,rot:Math.random()*6.28});p.c29n=n}}
function fireStep(G,dt){const L=G.c29f;if(!L||!L.length)return;
  L.forEach(f=>{f.t+=dt;f.acc+=dt;const tk=NEW.hd10.fire.tick;while(f.acc>=tk&&f.t<=f.max+1e-6){f.acc-=tk;enemies(G).forEach(e=>{const m=(e.size||2)*.3;if(Math.abs(e.x-f.x)<=f.w/2+m&&Math.abs(e.y-f.y)<=f.h/2+m){dmgB(G,f.b,e,f.d);e.c29burn=G.t+.2}})}});
  G.c29f=L.filter(f=>f.t<f.max)}
function wrapStep(G,inner){const mine=(G&&G.c22p||[]).filter(p=>p.cfg&&p.cfg.c29&&!p.dead);const r=inner();
  if(G){mine.forEach(p=>{if(p.dead&&!p.c29d){p.c29d=1;try{after(G,p)}catch(e){console.error(e)}}})}return r}
{const _S=dfStep;dfStep=function(dt){const G=DG,a=arguments,t=this;const r=wrapStep(G,()=>_S.apply(t,a));try{if(DG&&DG.bl&&!DG.done)fireStep(DG,dt)}catch(e){console.error(e)}return r}}
/* ---------- vẽ: đạn riêng + vệt lửa ---------- */
function drawShot(q,p,X,Y,s,T){const c=p.cfg,x=X(p.x),y=Y(p.y);q.save();
  if(c.c29==='mortar'){const u=p.u||0,hgt=Math.sin(Math.PI*u)*s*Math.max(1.6,(p.dur||1)*2.4),r=s*1*(.85+.15*Math.sin(Math.PI*u));
    q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.ellipse(x,y,r*.9,r*.45,0,0,7);q.fill();
    q.translate(x,y-hgt);q.shadowColor='#ffb020';q.shadowBlur=20;const g=q.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);g.addColorStop(0,'#fff6c8');g.addColorStop(.45,'#ffd23a');g.addColorStop(1,'#c27a10');q.fillStyle=g;q.beginPath();q.arc(0,0,r,0,7);q.fill();
    q.shadowBlur=0;q.strokeStyle='rgba(120,70,10,.8)';q.lineWidth=2;q.beginPath();q.arc(0,0,r*.98,0,7);q.stroke();q.strokeStyle='rgba(255,250,220,.6)';q.beginPath();q.arc(0,0,r*.62,-2.4,-1.2);q.stroke()}
  else if(c.c29==='black'){const a=Math.atan2(p.vy,p.vx),r=Math.max(3,s*.2);q.translate(x,y);q.rotate(a);
    const L=r*5,g=q.createLinearGradient(-L,0,0,0);g.addColorStop(0,'rgba(90,96,110,0)');g.addColorStop(1,'rgba(150,158,175,.55)');q.fillStyle=g;q.beginPath();q.ellipse(-L*.5,0,L*.5,r*.6,0,0,7);q.fill();
    q.fillStyle='#14161c';q.strokeStyle='#9aa4b8';q.lineWidth=1.4;q.beginPath();q.ellipse(0,0,r*1.25,r*.85,0,0,7);q.fill();q.stroke();q.fillStyle='rgba(255,255,255,.35)';q.beginPath();q.arc(r*.3,-r*.3,r*.28,0,7);q.fill()}
  else if(c.c29==='gold'){const a=Math.atan2(p.vy,p.vx),r=s*.5;q.translate(x,y);q.rotate(a);
    const L=r*3.2,g=q.createLinearGradient(-L,0,0,0);g.addColorStop(0,'rgba(255,190,40,0)');g.addColorStop(1,'rgba(255,214,80,.75)');q.globalCompositeOperation='lighter';q.fillStyle=g;q.beginPath();q.ellipse(-L*.5,0,L*.55,r*.8,0,0,7);q.fill();q.globalCompositeOperation='source-over';
    q.shadowColor='#ffcc33';q.shadowBlur=16;const gg=q.createRadialGradient(-r*.25,-r*.25,r*.1,0,0,r);gg.addColorStop(0,'#fffbe0');gg.addColorStop(.5,'#ffd23a');gg.addColorStop(1,'#d08a12');q.fillStyle=gg;q.beginPath();q.arc(0,0,r,0,7);q.fill()}
  q.restore()}
function drawFire(q,f,X,Y,s,T){const x=X(f.x),y=Y(f.y),w=f.w*s,h=f.h*s,al=Math.min(1,f.t/.15,(f.max-f.t)/.4);q.save();q.globalAlpha=Math.max(0,al);
  const g=q.createRadialGradient(x,y,0,x,y,Math.max(w,h)*.7);g.addColorStop(0,'rgba(255,140,30,.42)');g.addColorStop(1,'rgba(255,60,0,.08)');q.fillStyle=g;q.fillRect(x-w/2,y-h/2,w,h);
  q.strokeStyle='rgba(255,170,60,.55)';q.setLineDash([5,4]);q.lineWidth=1.5;q.strokeRect(x-w/2,y-h/2,w,h);q.setLineDash([]);
  q.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const hx=Math.sin(f.seed+i*12.99)*.5,hy=Math.sin(f.seed*1.3+i*7.7)*.5,fx=x+hx*w*.9,fy=y+hy*h*.9,k=(T*2.2+i*.37)%1,fh=s*(.45+.3*Math.sin(i*2.1))*(1-k*.4);
    const gg=q.createLinearGradient(fx,fy,fx,fy-fh);gg.addColorStop(0,'rgba(255,120,20,.9)');gg.addColorStop(.6,'rgba(255,210,60,.7)');gg.addColorStop(1,'rgba(255,255,200,0)');q.fillStyle=gg;
    q.beginPath();q.moveTo(fx-s*.16,fy);q.quadraticCurveTo(fx-s*.12,fy-fh*.55,fx+Math.sin(T*9+i)*s*.06,fy-fh);q.quadraticCurveTo(fx+s*.12,fy-fh*.55,fx+s*.16,fy);q.closePath();q.fill()}
  q.restore()}
function draw(q,G,X,Y,s,T){if(!G)return;(G.c29f||[]).forEach(f=>{try{drawFire(q,f,X,Y,s,T)}catch(e){}});
  (G.c22p||[]).forEach(p=>{if(!p.dead&&p.cfg&&p.cfg.c29)try{drawShot(q,p,X,Y,s,T)}catch(e){}});
  (G.en||[]).forEach(e=>{if(e.dead||!(e.c29burn>G.t))return;const x=X(e.x),y=Y(e.y);q.save();q.globalAlpha=.8;q.fillStyle='#ff8a2a';for(let i=0;i<3;i++){const a=T*8+i*2.1,r=(e.size||2)*s*.22;q.beginPath();q.arc(x+Math.cos(a)*r,y+Math.sin(a)*r-s*.2,Math.max(2,s*.1),0,7);q.fill()}q.restore()})}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s,T==null?(G&&G.t)||0:T)}catch(e){console.error(e)}}}
/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở ---------- */
(function(){const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;const {mkBld,mkEn}=H;
  const txt=(q,s,x,y,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
  const mkE=(G,c,x,y,hp)=>{const e=mkEn(G,c,x,y,hp||1e9);e.noRev=true;return e};
  function track(c,G,e){if(e._h==null)e._h=e.hp;if(e.hp<e._h)(c.log=c.log||[]).push([G.t,(e._h-e.hp)*20]);e._h=e.hp;if(c.log)c.log=c.log.filter(x=>G.t-x[0]<3)}
  const dps=(c,G)=>{const L=c.log||[];if(!L.length)return 0;const t0=Math.max(.5,Math.min(3,G.t));return L.reduce((a,x)=>a+x[1],0)/t0};
  Object.keys(NEW).forEach(t=>{const C=NEW[t],bn=((BLD.find(b=>b.t===t)||{}).n||t).toUpperCase();
    SC[t]={title:bn,note:NOTE[t],
      init(G,c){G.c22sim=1;G.pvp=false;const d=BLD.find(x=>x.t===t)||{h:4},by=Math.min(7.5,9.8-d.h/2);c.b=mkBld(G,t,7.5,by,{lv:c.lv});c.ph=0;c.log=[];
        c.es=t==='hd8'?[mkE(G,c,7.5,2.6),mkE(G,c,5.2,3.4),mkE(G,c,9.8,3.2)]:t==='hd10'?[mkE(G,c,7.5,2.8),mkE(G,c,8.6,3.6)]:[mkE(G,c,7.5,2.8)]},
      step(G,dt,c){try{c.ph+=dt;G.dtc=dt;wrapStep(G,()=>C22.pre(G,dt));fireStep(G,dt);c.b.hp=c.b.max;
        if(t==='hd9'){c.es[0].x=7.5+3.2*Math.sin(c.ph*.7);c.es[0].y=2.8+.6*Math.sin(c.ph)}
        window.c22Tick(c.b,dt,G,1);c.es.forEach(e=>track(c,G,e))}catch(e){console.error(e)}},
      over(q,G,c,X,Y,s){try{txt(q,'Gây ≈ '+nf(dps(c,G))+' sát thương/giây (tổng)',X(7.5),Y(9.9),'#ffe08a',11);
        if(t==='hd8'&&c.es[1])txt(q,'Trong 3 ô: 40%',X(c.es[1].x),Y(c.es[1].y)-c.es[1].size*s*.75,'#ffe9a0',10);
        if(t==='hd10'&&c.es[1])txt(q,'Vệt lửa 3×3',X(c.es[1].x),Y(c.es[1].y)-c.es[1].size*s*.75,'#ffb070',10)}catch(e){}}}})})();
window.C29={NEW,after,fireStep};
})();
