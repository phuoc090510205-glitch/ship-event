/* ===== c15: Tháp Laser · Nỏ thần · Súng phun lửa · Nhà drone tấn công ===== */
(function(){
const FLD={R:5,H:.46,ON:7,CD:3,D:1000,BD:20,BT:3};   /* súng phun lửa: tầm 5 ô, nón ±26°, phun 7 giây, nghỉ 3 giây */
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
function nearest(G,x,y,R){let t=null,bd=1e9;G.en.forEach(e=>{if(e.dead||e.spawn>G.t)return;const q=Math.hypot(e.x-x,e.y-y);if(q<=R+(e.size||2)*.3&&q<bd){bd=q;t=e}});return t}
function bmRef(G,o,x1,y1,x2,y2,col,w){if(!o||!(o.t>0)){o={x1,y1,x2,y2,t:.16,col,w};G.bm.push(o);return o}o.x1=x1;o.y1=y1;o.x2=x2;o.y2=y2;o.t=.16;return o}
/* ---------- Tháp Laser: tia đỏ chiếu liên tục, 70 sát thương/giây ---------- */
function laser(b,dt,G,rc){const pb=PB(G),R=7*(pb.rm||1);
  let tg=b.lzT;if(tg&&(tg.dead||tg.spawn>G.t||Math.hypot(tg.x-b.x,tg.y-b.y)>R+(tg.size||2)*.3))tg=null;
  if(!tg)tg=nearest(G,b.x,b.y,R);
  b.lzT=tg;if(!tg)return;
  b.ang=Math.atan2(tg.y-b.y,tg.x-b.x);
  const dps=70*LV(b)*(pb.dm||1)/(rc*(pb.cdm||1));
  {const h0=tg.hit;dfDmgS(tg,dps*dt,false);if(G.t-(b.lzF||-9)>=.3)b.lzF=G.t;else tg.hit=h0}
  b.lzb1=bmRef(G,b.lzb1,b.x,b.y,tg.x,tg.y,'#ff2a2a',5);b.lzb2=bmRef(G,b.lzb2,b.x,b.y,tg.x,tg.y,'#ffd6d6',1.6);
  if(G.t-(b.lzS||-9)>.09){b.lzS=G.t;G.fx.push({x:tg.x,y:tg.y,r:.5,t:.14,max:.14,col:'#ff5040'})}}
/* ---------- Nỏ thần: mũi tên vàng, 0,1 giây/mũi, 20 sát thương, không xuyên, tầm 8 ô ---------- */
function cross(b,dt,G,rc){const pb=PB(G),R=8*(pb.rm||1);
  b.cd=(b.cd||0)-dt;const tg=nearest(G,b.x,b.y,R);
  if(!tg){if(b.cd<0)b.cd=0;return}
  b.ang=Math.atan2(tg.y-b.y,tg.x-b.x);
  let n=0;while(b.cd<=0&&n<3){b.cd+=.1*rc*(pb.cdm||1);n++;
    dfFire({x:b.x,y:b.y,dm:pb.dm||1},{sp:{k:'arrow',sp:26,col:'#ffd23a'},dmg:20*LV(b),rng:R,col:'#ffd23a'},tg,'p')}
  if(b.cd<-.1)b.cd=0}
/* ---------- Súng phun lửa: nón lửa đỏ cam, 1000 sát thương / 7 giây + thiêu đốt 20 / 3 giây ---------- */
function inCone(b,a,R,e,H){const dx=e.x-b.x,dy=e.y-b.y,q=Math.hypot(dx,dy);if(q>R+(e.size||2)*.3)return false;
  let da=Math.atan2(dy,dx)-a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
  return Math.abs(da)<=H+Math.atan2((e.size||2)*.35,Math.max(.6,q))}
function ignite(G,e,lvf,dm){e.fbT=FLD.BT;e.fbD=FLD.BD/FLD.BT*lvf*dm;G.fbn=G.fbn||[];if(!G.fbn.includes(e))G.fbn.push(e)}
function coneRef(G,key,o){const L=G.fcn=G.fcn||[];let c=L.find(q=>q.k===key);if(!c){c=Object.assign({k:key},o);L.push(c)}else Object.assign(c,o);c.until=G.t+.12;return c}
function flame(b,dt,G,rc){const pb=PB(G),R=FLD.R*(pb.rm||1),lvf=LV(b),f=b.fs=b.fs||{m:'idle',t:0,a:-Math.PI/2,no:0};
  if(f.m==='cool'){f.t-=dt;if(f.t<=0)f.m='idle';return}
  const t=nearest(G,b.x,b.y,R);
  if(f.m==='idle'){if(!t)return;f.m='on';f.t=FLD.ON;f.no=0;f.a=Math.atan2(t.y-b.y,t.x-b.x)}
  f.t-=dt;
  if(t){f.no=0;let da=Math.atan2(t.y-b.y,t.x-b.x)-f.a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;f.a+=Math.max(-3.5*dt,Math.min(3.5*dt,da))}else f.no+=dt;
  b.ang=f.a;
  const off=Math.max(b.w,b.h)*.35;
  coneRef(G,b,{x0:b.x+Math.cos(f.a)*off,y0:b.y+Math.sin(f.a)*off,a:f.a,L:R,h:FLD.H});
  const dps=FLD.D/FLD.ON*lvf*(pb.dm||1);
  G.en.forEach(e=>{if(e.dead||e.spawn>G.t)return;if(!inCone(b,f.a,R,e,FLD.H))return;
    const h=e.hit;dfDmgS(e,dps*dt,false);e.hit=h;ignite(G,e,lvf,pb.dm||1)});
  if(f.t<=0||f.no>1.2){f.m='cool';f.t=FLD.CD*rc*(pb.cdm||1)}}
/* thiêu đốt: 20 sát thương trong 3 giây (xử lý sau mỗi bước chiến đấu) */
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);const G=DG;
  if(G&&G.fbn&&G.fbn.length){for(let i=G.fbn.length-1;i>=0;i--){const e=G.fbn[i];if(e.dead||!(e.fbT>0)){e.fbT=0;G.fbn.splice(i,1);continue}e.fbT-=dt;const h=e.hit;dfDmgS(e,e.fbD*dt,false);e.hit=h}}
  return r}}
window.c15Tick=function(b,dt,G,rc){if(b.t==='laser'){laser(b,dt,G,rc);return true}if(b.t==='crossbow'){cross(b,dt,G,rc);return true}if(b.t==='flame'){flame(b,dt,G,rc);return true}return false};
/* ---------- vẽ: mũi tên vàng, nón lửa, lửa thiêu đốt ---------- */
window.c15Arrow=function(q,x,y,a,s,col){const L=s*.9,w=Math.max(1.6,s*.07);q.save();q.translate(x,y);q.rotate(a);q.shadowColor=col||'#ffd23a';q.shadowBlur=8;q.lineCap='round';
  q.strokeStyle='#ffe58a';q.lineWidth=w;q.beginPath();q.moveTo(-L*.5,0);q.lineTo(L*.34,0);q.stroke();
  q.fillStyle='#fff3b0';q.beginPath();q.moveTo(L*.62,0);q.lineTo(L*.27,-w*2.3);q.lineTo(L*.27,w*2.3);q.closePath();q.fill();
  q.strokeStyle='#ffc936';q.lineWidth=Math.max(1,w*.6);for(const k of [-1,1]){q.beginPath();q.moveTo(-L*.5,0);q.lineTo(-L*.64,k*w*2.2);q.stroke();q.beginPath();q.moveTo(-L*.36,0);q.lineTo(-L*.5,k*w*2.2);q.stroke()}
  q.restore()};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
window.c15ConeDraw=function(q,G,X,Y,s){if(!G)return;const T=G.t,L=G.fcn;
  if(L&&L.length){G.fcn=L.filter(c=>c.until>T);G.fcn.forEach(c=>{const ox=X(c.x0),oy=Y(c.y0),len=c.L*s,tn=Math.tan(c.h);
    q.save();q.globalCompositeOperation='lighter';q.translate(ox,oy);q.rotate(c.a);
    [[1,'255,40,6',.9,1],[.84,'255,115,14',.95,.76],[.6,'255,212,84',1,.46]].forEach((w,i)=>{const ln=len*w[0]*(1+.04*Math.sin(T*35+i*2)),hw=tn*w[3],g=q.createLinearGradient(0,0,ln,0);
      g.addColorStop(0,'rgba('+w[1]+','+w[2]+')');g.addColorStop(.55,'rgba('+w[1]+','+(w[2]*.55)+')');g.addColorStop(1,'rgba('+w[1]+',0)');
      q.fillStyle=g;q.beginPath();q.moveTo(0,0);const N=10;
      for(let k=1;k<=N;k++){const d=ln*k/N;q.lineTo(d,-hw*d*(1+.1*Math.sin(T*28+k*1.7+i)))}
      for(let k=N;k>=1;k--){const d=ln*k/N;q.lineTo(d,hw*d*(1+.1*Math.sin(T*26+k*2.3+i*2)))}
      q.closePath();q.fill()});
    for(let i=0;i<52;i++){const u=(T*1.8+i*.618)%1,d=u*len,lat=(hz(i)*2-1)*tn*d*.85,r=Math.max(2,s*(.12+.36*u)*(.6+hz(i+7)*.6));
      const g=q.createRadialGradient(d,lat,0,d,lat,r);g.addColorStop(0,u<.3?'rgba(255,246,200,.95)':u<.65?'rgba(255,176,56,.85)':'rgba(255,72,22,.7)');g.addColorStop(1,'rgba(255,50,10,0)');
      q.globalAlpha=1-u*.65;q.fillStyle=g;q.beginPath();q.arc(d,lat,r,0,7);q.fill()}
    q.restore()})}
  const B=G.fbn;if(B&&B.length){q.save();q.globalCompositeOperation='lighter';B.forEach(e=>{if(e.dead||!(e.fbT>0))return;const px=X(e.x),py=Y(e.y),r=(e.size||2)*s*.4;
    const g=q.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(255,170,60,'+(.35+.15*Math.sin(T*30+e.x))+')');g.addColorStop(1,'rgba(255,70,10,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r,0,7);q.fill();
    for(let i=0;i<4;i++){const u=(T*1.7+i*.27+e.x*.13)%1;q.globalAlpha=(1-u)*.8;q.fillStyle='#ffb13a';q.beginPath();q.arc(px+Math.sin(i*5.1+T*3)*r*.5,py-u*r*1.1,Math.max(1.2,s*.06*(1-u)),0,7);q.fill()}q.globalAlpha=1});q.restore()}};
{const _D=dfDraw;dfDraw=function(){_D.apply(this,arguments);try{const G=DG;if(G&&((G.fcn&&G.fcn.length)||(G.fbn&&G.fbn.length))){dq.setTransform(dfV.dpr,0,0,dfV.dpr,0,0);window.c15ConeDraw(dq,G,dsx,dsy,dfV.s)}}catch(e){}}}
/* ---------- Nhà drone tấn công: mỗi 60 giây tạo 1 drone (tối đa 3), 200 máu, súng xung nhỏ, tầm 400 ---------- */
function hurtD(G,d,dmg){d.hp-=dmg;d.hf=.15;G.fx.push({x:d.x,y:d.y,r:.35,t:.2,max:.2,col:'#ffb0a0'});if(d.hp<=0&&!d.dead){d.hp=0;d.dead=true;d.rs=8;G.fx.push({x:d.x,y:d.y,r:.8,t:.4,max:.4,ex:1,rot:0});if(window.c17Kill)window.c17Kill(G)}}
const DR={hp:200,dmg:24,cd:.6,R:4,max:3,every:60,leash:12};
window.c15Drone=function(b,dt,G){const a=b.drs=b.drs||[],pb=PB(G),lvf=LV(b);
  for(let i=a.length-1;i>=0;i--)if(a[i].dead||a[i].hp<=0)a.splice(i,1);
  const EV=b.adEv||DR.every,MX=b.adMax||DR.max;if(b.adT==null)b.adT=EV;
  if(a.length<MX){b.adT+=dt;if(b.adT>=EV){b.adT=0;const hp=DR.hp*lvf;
    a.push({x:b.x,y:b.y,a:Math.random()*6.28,ang:-Math.PI/2,rot:0,hp,hmax:hp,dead:false,hf:0,fl:0,cd:.3,age:0});
    G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*.5,t:.45,max:.45,col:'#6fc8ff'})}}else b.adT=0;
  a.forEach((d,i)=>{d.age+=dt;if(d.hf>0)d.hf-=dt;if(d.fl>0)d.fl-=dt;
    let tg=null,bd=1e9;G.en.forEach(e=>{if(e.dead||e.spawn>G.t)return;const q=Math.hypot(e.x-d.x,e.y-d.y);if(q<bd){bd=q;tg=e}});
    const au=window.c17Aura?window.c17Aura(G,d.x,d.y):null,sp=7*(au?au.sp:1);let mx=0,my=0;
    if(tg&&bd<=DR.R*(pb.rm||1)+(tg.size||2)*.3){      /* trong tầm: giữ cự ly và bắn */
      const dx=tg.x-d.x,dy=tg.y-d.y,l=bd||1,want=Math.min(DR.R-.6,3)+(tg.size||2)*.25;d.ang=Math.atan2(dy,dx);
      if(l>want+.4){mx=dx/l*Math.min(sp*dt,l-want);my=dy/l*Math.min(sp*dt,l-want)}else if(l<want-.9){mx=-dx/l*sp*.6*dt;my=-dy/l*sp*.6*dt}
      d.cd-=dt*(au?au.fr:1);if(d.cd<=0){d.cd=DR.cd*(pb.cdm||1);d.fl=.08;
        dfFire({x:d.x,y:d.y,dm:pb.dm||1},{sp:{k:'gun',sp:17,col:'#ffe27a'},dmg:DR.dmg*lvf,rng:DR.R*(pb.rm||1)+1,col:'#ffe27a'},tg,'p')}}
    else if(tg&&Math.hypot(tg.x-b.x,tg.y-b.y)<=DR.leash){  /* ra chiến trường tìm địch */
      const dx=tg.x-d.x,dy=tg.y-d.y,l=bd||1;d.ang=Math.atan2(dy,dx);mx=dx/l*Math.min(sp*dt,Math.max(0,l-2.8));my=dy/l*Math.min(sp*dt,Math.max(0,l-2.8))}
    else{d.a+=dt*1.2;const r=Math.max(b.w,b.h)/2+.9,tx=b.x+Math.cos(d.a+i*2.1)*r,ty=b.y+Math.sin(d.a+i*2.1)*r,dx=tx-d.x,dy=ty-d.y,l=Math.hypot(dx,dy)||1;
      if(l>.05){d.ang=Math.atan2(dy,dx);mx=dx/l*Math.min(sp*dt,l);my=dy/l*Math.min(sp*dt,l)}}
    d.x+=mx;d.y+=my;d.rot=d.ang+Math.PI/2});
  window.c15BulletHit(G,a)};
window.c15BulletHit=function(G,a){G.pr.forEach(p=>{if(p.dead||p.team!=='e')return;a.forEach(d=>{if(d.dead||d.hp<=0||Math.hypot(p.x-d.x,p.y-d.y)>.5)return;p.dh=p.dh||[];if(p.dh.includes(d))return;p.dh.push(d);hurtD(G,d,p.dmg||1)})})};
window.c15DroneDraw=function(q,d,px,py,s,T){const h=s*.72*Math.min(1,.35+d.age*1.2);
  drnSpr(q,px,py,h,(d.ang!=null?d.ang:-Math.PI/2)+Math.PI/2,1,window.DRN5,d.hf>0?'#ffffff':'#4fc3ff');
  if(d.fl>0){q.save();q.globalCompositeOperation='lighter';q.fillStyle='rgba(255,226,122,.9)';q.beginPath();q.arc(px+Math.cos(d.ang)*h*.5,py+Math.sin(d.ang)*h*.5,h*.14,0,7);q.fill();q.restore()}
  drnBar(q,px,py,h,d)};
/* ---------- Mô phỏng khai hỏa ở màn nâng cấp công trình ---------- */
window.c15PvHp=function(t,dmg1,lv){const f=1+.1*((lv||1)-1);return t==='laser'?70*f*5:t==='crossbow'?20*f*30:t==='flame'?(FLD.D+10)*f:null};
window.c15PvStep=function(t,G,bx,by,dt,lv,S1,withG){
  if(t!=='laser'&&t!=='crossbow'&&t!=='flame')return false;
  const dm=G.en[0];if(!dm)return true;const lvf=1+.1*(lv-1),live=!dm.dead&&dm.rv<=0;
  if(dm.fbT>0){dm.fbT-=dt;if(live)dm.hp-=dm.fbD*dt;G.fbn=dm.fbT>0?[dm]:[]}else if(G.fbn&&G.fbn.length)G.fbn=[];
  if(t==='laser'){if(!live){S1.lz1=S1.lz2=null;return true}
    dm.hp-=70*lvf*dt;if(G.t-(S1.lzF||-9)>=.3){S1.lzF=G.t;dm.hit=.06}
    S1.lz1=bmRef(G,S1.lz1,bx,by,dm.x,dm.y,'#ff2a2a',5);S1.lz2=bmRef(G,S1.lz2,bx,by,dm.x,dm.y,'#ffd6d6',1.6);
    S1.lz1.lw=5;S1.lz2.lw=1.8;
    if(G.t-(S1.lzS||-9)>.09){S1.lzS=G.t;G.fx.push({x:dm.x,y:dm.y,r:.5,t:.14,max:.14,col:'#ff5040'})}return true}
  if(t==='crossbow'){S1.xt=(S1.xt||0)-dt;if(live&&S1.xt<=0){S1.xt+=.1;withG(()=>dfFire({x:bx,y:by,dm:1},{sp:{k:'arrow',sp:26,col:'#ffd23a'},dmg:20*lvf,rng:8.5,col:'#ffd23a'},dm,'p'))}if(S1.xt<-.1)S1.xt=0;return true}
  /* súng phun lửa */
  const f=S1.c15=S1.c15||{m:'idle',t:0},a=Math.atan2(dm.y-by,dm.x-bx),dist=Math.hypot(dm.x-bx,dm.y-by);
  if(f.m==='cool'){f.t-=dt;if(f.t<=0)f.m='idle';return true}
  if(f.m==='idle'){if(!live)return true;f.m='on';f.t=FLD.ON}
  f.t-=dt;
  coneRef(G,'pv',{x0:bx,y0:by,a,L:FLD.R,h:FLD.H});
  if(live&&dist<=FLD.R+(dm.size||2)*.3){dm.hp-=FLD.D/FLD.ON*lvf*dt;dm.fbT=FLD.BT;dm.fbD=FLD.BD/FLD.BT*lvf}
  if(f.t<=0){f.m='cool';f.t=FLD.CD}
  return true};
})();
