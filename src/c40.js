
/* ===== c40: sức mạnh thảm Sử thi (Tro Tàn, Pháp Trận, Hố Thiên Thạch) + 10 thảm Huyền thoại · hiệu ứng dựng 3D ở c33 (skill3d18) ===== */
(function(){
if(!window.C39)return;
const C39=window.C39;
const rnd=(a,b)=>a+Math.random()*(b-a),roll=(p,dt)=>Math.random()<p*dt,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const DBk=()=>typeof DFB!=='undefined'?DFB:50;
const BK=e=>e&&e.boss?1/3:1;
function Z(G){return G.c40}
const X={init:{},step:{},death:{},lethal:{},dmgB:{}};
function inR(Rg,u,m){m=m||0;return u&&u.x>=Rg.x0-m&&u.x<=Rg.x1+m&&u.y>=Rg.y0-m&&u.y<=Rg.y1+m}
function enemies(G,Rg,m){return (G.en||[]).filter(e=>e&&!e.dead&&!e.sb&&!(e.spawn>G.t)&&(Rg?inR(Rg,e,m):true))}
function allies(G,Rg,m){return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost&&(Rg?inR(Rg,u,m):true))}
function blds(G,Rg){return (G.bl||[]).filter(b=>b&&b.hp>0&&b.t!=='mine'&&(Rg?inR(Rg,b,0):true))}
function hurt(G,e,d){if(!e||e.dead||!(d>0))return;try{dfDmgS(e,d*(G.dmM||1)*(e.boss?.35:1))}catch(x){}}
function hurtPct(G,e,p){if(!e||e.dead)return;try{dfDmgS(e,e.max*p*BK(e))}catch(x){}}
function pop(G,x,y,s,col){Z(G).vis.push({k:'txt',x,y,s,col,t:0,max:1.6})}
function vis(G,o){o.t=0;Z(G).vis.push(o);return o}
const cc=['stun','silT','noFire','lockT','fearT','iceT'];
function cur(){return C39.cur()}
function key(c){return c&&c.tier>=2?(c.vk!=null?((window.C43TXT&&C43TXT[c.vk])||(window.C46TXT&&C46TXT[c.vk])||(window.C47TXT&&C47TXT[c.vk])||(window.C49TXT&&C49TXT[c.vk])?c.vk:-1):c.tier*10+c.kind):-1}
function shield(b,v){b.shd={v:(b.shd&&b.shd.t>0?b.shd.v:0)+v,max:Math.max((b.shd&&b.shd.max)||0,(b.shd&&b.shd.t>0?b.shd.v:0)+v),t:1e9}}
function addHP(u,v,isB){const k=isB?v/DBk():v;u.max+=k;u.hp=Math.min(u.max,u.hp+k)}
function heal(u,v){if(u.hp<u.max)u.hp=Math.min(u.max,u.hp+v)}

function init(G){const c=G.c39c||cur(),K=key(c);if(K<27||((G.pv||G.c18sim)&&!G.c39c))return null;const Rg=C39.region(G);if(!Rg)return null;
  const S={K,Rg,cx:(Rg.x0+Rg.x1)/2,cy:(Rg.y0+Rg.y1)/2,vis:[],u:[],t:0,cnt:0,cd:50,a:0,b:0,seen:new WeakSet(),shell:new Map(),bul:0,frag:0,met:new Set(),deaths:0,ccPrev:new WeakMap()};
  G.c40=S;
  if(K===31){const B=blds(G,Rg).filter(b=>!b.c39tmp);if(B.length){const b=B[Math.floor(Math.random()*B.length)];addHP(b,1000,1);shield(b,500/DBk());b.c40gold=1;pop(G,b.x,b.y-2,'Mạ vàng · +1.000 máu +500 giáp','#ffd36a')}}
  if(K===30)S.dragon={a:0,h:12};
  if(K===35)S.sp=[...Array(6)].map((_,i)=>({i,ph:Math.random()*6,alive:1,rs:0}));
  try{const f=X.init[K];if(f)f(G,S)}catch(e){console.error(e)}
  return S}

/* ---------- cập nhật mỗi khung ---------- */
function step(G,dt){if(!G||(G.pv&&!G.c39c)||!(dt>0)||G.done)return;let S=G.c40;if(!S){if(G.c40x)return;S=init(G);if(!S){G.c40x=1;return}}
  const Rg=S.Rg,K=S.K,E=enemies(G,Rg,0);S.t+=dt;
  /* CC giảm 10% (Pháp Trận) / kháng hiệu ứng (Mây Vàng) */
  if(K===28||K===31){allies(G,Rg,0).concat(blds(G,Rg)).forEach(u=>{const p=S.ccPrev.get(u)||{},res=K===28?.1:(u.c40cl>G.t?.1:0);if(res)cc.forEach(f=>{const v=u[f]||0,o=p[f]||0;if(v>o+1e-4)u[f]=o+(v-o)*(1-res)});const q={};cc.forEach(f=>q[f]=u[f]||0);S.ccPrev.set(u,q)})}
  ({27:tro,28:phap,29:hothach,30:hoalong,31:mayvang,32:thuycung,33:bangha,34:loithan,35:tinhlinh,36:vonghon,37:hukhong,38:phuong,39:thankiem}[K]||X.step[K]||(()=>{}))(G,S,dt,E,Rg);
  /* đốt (Hỏa Long) */
  [].concat(G.en||[]).forEach(e=>{if(!e||e.dead||!e.c40dot)return;e.c40dot=e.c40dot.filter(d=>G.t<d.until);e.c40dot.forEach(d=>hurt(G,e,d.dps*dt));if(!e.c40dot.length)e.c40dot=null});
  S.u.forEach(u=>{if(u.dead&&!u.gone){u.gone=1;u.dt0=G.t;vis(G,{k:'boom',x:u.x,y:u.y,h:u.h||1,max:.6})}});
  S.vis.forEach(v=>{v.t+=dt;if(v.up)v.up(G,S,dt)});S.vis=S.vis.filter(v=>v.t<v.max)}

/* Tro Tàn: dưới 6% máu tối đa → hóa tro, mỗi tro +5 Đá */
function tro(G,S,dt,E){E.forEach(e=>{if(e.hp>0&&e.hp<e.max*.06){try{dfDmgS(e,e.hp+1e7)}catch(x){}S.cnt++;if(!G.pv&&!G.c39sim){try{const s0=S_();s0.da=(s0.da||0)+5;save()}catch(x){}}vis(G,{k:'ash',x:e.x,y:e.y,max:4});pop(G,e.x,e.y-1.5,'Hóa tro · +5 Đá','#d8d0c0')}})}
/* Pháp Trận: thu mảnh tàu bị phá hủy về tâm, đủ 50 mảnh → 10 vì sao rơi */
function phap(G,S,dt,E,Rg){if(S.cnt>=50){S.cnt-=50;const T=enemies(G,Rg,6);for(let i=0;i<10;i++){const tg=T.length?T[i%T.length]:null,x=tg?tg.x+rnd(-1,1):rnd(Rg.x0,Rg.x1),y=tg?tg.y+rnd(-1,1):rnd(Rg.y0,Rg.y1);
    vis(G,{k:'star',x,y,max:1+i*.12,dl:i*.12,up(G,S2,dt){if(!this.hit&&this.t>=this.max-.02){this.hit=1;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-this.x,e.y-this.y)<=1.8+(e.size||2)*.3)hurt(G,e,200)});vis(G,{k:'boom',x:this.x,y:this.y,h:.5,max:.6,c:'#ffe27a'})}}})}pop(G,S.cx,S.cy-2,'Pháp trận · 10 vì sao!','#c7bbff')}}
/* Hố Thiên Thạch: 50 giây thả 1 thiên thạch; mỗi đạn pháo / thiên thạch rơi trong thảm giảm 1 giây */
function hothach(G,S,dt,E,Rg){S.cd-=dt;
  const now=new Set();(G.pr||[]).forEach(p=>{if(!p.dead&&p.team==='e'&&(p.k==='shell'||p.spl>0)){now.add(p);S.shell.set(p,[p.x,p.y])}});
  S.shell.forEach((xy,p)=>{if(!now.has(p)||p.dead){S.shell.delete(p);if(inR(Rg,{x:xy[0],y:xy[1]},0)){S.cd-=1;vis(G,{k:'ring',x:xy[0],y:xy[1],c:'#ffb02e',max:.5})}}});
  if(S.cd<=0){const C={x:S.cx,y:S.cy};let tg=null,bd=1e9;enemies(G,Rg,15).forEach(e=>{const q=dist(e,C);if(q<bd){bd=q;tg=e}});if(!tg){S.cd=1;return}S.cd=50;
    vis(G,{k:'meteor',x:tg.x,y:tg.y,tg,max:1.2,up(G,S2,dt){if(this.tg&&!this.tg.dead){this.x=this.tg.x;this.y=this.tg.y}if(!this.hit&&this.t>=1.18){this.hit=1;const e=this.tg;if(e&&!e.dead){hurtPct(G,e,.12);const dx=e.x-S.cx,dy=e.y-S.cy,l=Math.hypot(dx,dy)||1;e.x+=dx/l;e.y+=dy/l}
      vis(G,{k:'boom',x:this.x,y:this.y,h:.4,max:.8,c:'#ff7a2a'});if(inR(Rg,this,0))S.cd-=1;pop(G,this.x,this.y-1.6,'Thiên thạch! −12% máu','#ffb070')}}});pop(G,S.cx,S.cy-2,'Hố thiên thạch phóng!','#ffb070')}}
/* Vảy Hỏa Long: rồng bay trên thảm, mỗi 2 giây thả cầu lửa: 1% máu tối đa + 150 sát thương trong 5 giây */
function hoalong(G,S,dt,E,Rg){const D=S.dragon;D.a+=dt*.45;S.a+=dt;if(S.a<2)return;S.a=0;const T=enemies(G,Rg,8);if(!T.length)return;const e=T[Math.floor(Math.random()*T.length)],R=Math.max(Rg.x1-Rg.x0,Rg.y1-Rg.y0)*.45,
  x0=S.cx+Math.cos(D.a)*R,y0=S.cy+Math.sin(D.a)*R*.7;vis(G,{k:'fireball',x0,y0,h0:D.h,tg:e,x:e.x,y:e.y,max:.9,up(G,S2,dt){if(this.tg&&!this.tg.dead){this.x=this.tg.x;this.y=this.tg.y}if(!this.hit&&this.t>=.88){this.hit=1;const t=this.tg;if(t&&!t.dead){hurtPct(G,t,.01);(t.c40dot=t.c40dot||[]).push({dps:150/5*(G.dmM||1)*(t.boss?.35:1),until:G.t+5})}vis(G,{k:'boom',x:this.x,y:this.y,h:.5,max:.5,c:'#ff4a1a'})}}})}
/* Thiên Đình Mây Vàng: mây trắng mỗi 5 giây, chim mỗi 8 giây */
function mayvang(G,S,dt,E,Rg){S.a+=dt;S.b+=dt;if(S.a>=5){S.a=0;const y=rnd(Rg.y0,Rg.y1);vis(G,{k:'cloud',x:Rg.x0-4,y,max:12,sz:rnd(1,1.6),up(G,S2,dt){this.x+=dt*((Rg.x1-Rg.x0+8)/12)}})}
  if(S.b>=8){S.b=0;const lucky=Math.random()<.01;vis(G,{k:'bird',x:Rg.x0-3,y:rnd(Rg.y0,Rg.y1),max:6,up(G,S2,dt){this.x+=dt*((Rg.x1-Rg.x0+6)/6)}});if(lucky&&!G.pv&&!G.c39sim){try{S_().sao=(S_().sao||0)+10;save();refresh()}catch(x){}pop(G,S.cx,S.cy-2.5,'Chim may mắn · +10 Sao','#ffd36a')}}
  const cl=S.vis.filter(v=>v.k==='cloud'&&inR(Rg,v,0));if(cl.length)allies(G,Rg,0).forEach(u=>{if(roll(.03,dt)){u.c40cl=G.t+5;pop(G,u.x,u.y-1.5,'Mây lành · +10 máu/giây','#ffffff')}});
  allies(G,Rg,2).forEach(u=>{if(u.c40cl>G.t)heal(u,10*dt)})}
function S_(){return (typeof S!=='undefined'&&S&&S.da!=null)?S:window.S}
/* Thủy Cung Long Vương */
function thuycung(G,S,dt,E,Rg){allies(G,Rg,0).forEach(u=>{if(u.nrgMax>0)u.nrg=Math.min(u.nrgMax,(u.nrg||0)+2*dt)});S.a+=dt;if(S.a>=3){S.a=0;blds(G,Rg).forEach(b=>shield(b,10/DBk()))}
  E.forEach(e=>{if(roll(.04,dt)){hurt(G,e,100);const d=1*BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);vis(G,{k:'fish',x:e.x,y:e.y,e,max:1.1});e.c40up=G.t+1}})}
/* Băng Hà Cổ Đại */
function bangha(G,S,dt,E){E.forEach(e=>{e.slowK=Math.min(e.slowK==null?1:e.slowK,.75);e.slowT=Math.max(e.slowT||0,.12);
  if(roll(.08,dt)){const d=1.5*BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);vis(G,{k:'glacier',e,x:e.x,y:e.y,max:d})}
  else if(roll(.12,dt)){const d=.74*BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);vis(G,{k:'ice',e,x:e.x,y:e.y,max:d})}})}
/* Đài Lôi Thần */
function loithan(G,S,dt,E,Rg){S.a+=dt;S.b+=dt;const q=C39.toScene(Rg,S.cx,S.cy),R=45*q[2],cxy=C39.fromScene(Rg,165,100);
  if(S.a>=30){S.a=0;blds(G,Rg).forEach(b=>{if(Math.hypot(b.x-cxy[0],b.y-cxy[1])<=R){addHP(b,700,1);shield(b,300/DBk());vis(G,{k:'bolt',x:b.x,y:b.y,max:.5,c:'#9fd0ff'})}});pop(G,cxy[0],cxy[1]-2,'Lôi thần · +700 máu +300 giáp','#bfe0ff')}
  if(S.b>=3){S.b=0;if(Math.random()<.18&&E.length){const e=E[Math.floor(Math.random()*E.length)];hurt(G,e,200);vis(G,{k:'bolt',x:e.x,y:e.y,max:.45,c:'#ffffff'})}}}
/* Rừng Tinh Linh */
function tinhlinh(G,S,dt,E,Rg){const RW=Rg.x1-Rg.x0,RH=Rg.y1-Rg.y0,T=S.t;
  S.sp.forEach(p=>{if(!p.alive){p.rs-=dt;if(p.rs<=0)p.alive=1;return}p.x=S.cx+Math.sin(T*.35+p.ph)*RW*.42;p.y=S.cy+Math.cos(T*.27+p.ph*1.7)*RH*.42;
    const hit=allies(G,null).find(u=>Math.hypot(u.x-p.x,u.y-p.y)<=(u.size||2)*.45+.6)||blds(G,Rg).find(b=>Math.abs(b.x-p.x)<=b.w/2+.4&&Math.abs(b.y-p.y)<=b.h/2+.4);
    if(hit){const isB=G.bl.includes(hit);addHP(hit,7,isB);p.alive=0;p.rs=5;vis(G,{k:'ring',x:p.x,y:p.y,c:'#9affd0',max:.6});pop(G,hit.x,hit.y-1.5,'+7 máu tối đa','#9affd0')}});
  S.a+=dt;if(S.a>=3){S.a=0;allies(G,Rg,0).forEach(u=>{heal(u,u.max*(u.hp<u.max*.4?.05:.01))});blds(G,Rg).forEach(b=>heal(b,b.max*(b.hp<b.max*.4?.05:.01)))}}
/* Cõi Vong Hồn: mộ mỗi 14 giây, ma 100 máu 50 tấn công, hồi sinh 10 giây ở mộ */
function vonghon(G,S,dt,E,Rg){S.a+=dt;const graves=S.u.filter(u=>u.k==='grave'&&!u.dead);
  if(S.a>=14&&graves.length<6){S.a=0;let x,y,ok=false;for(let i=0;i<40&&!ok;i++){x=rnd(Rg.x0+1,Rg.x1-1);y=rnd(Rg.y0+1,Rg.y1-1);ok=!(G.bl||[]).some(b=>b.hp>0&&Math.abs(b.x-x)<b.w/2+1&&Math.abs(b.y-y)<b.h/2+1)&&!S.u.some(u=>!u.dead&&u.k==='grave'&&Math.hypot(u.x-x,u.y-y)<2)}
    if(ok){const g=unit(G,S,{k:'grave',x,y,hp:300,size:1.4,hr:.8,taunt:0});g.gh=null;spawnGhost(G,S,g);pop(G,x,y-1.5,'Mộ vong hồn','#c7bbff')}}
  S.u.forEach(u=>{if(u.k==='grave'&&!u.dead&&(!u.gh||u.gh.dead)){u.rs=(u.rs==null?10:u.rs)-dt;if(u.gh&&u.gh.dead&&u.rs<=0){u.rs=null;spawnGhost(G,S,u)}}
    if(u.k==='ghost'&&!u.dead){const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];const gx=tg?tg.x:u.g.x+Math.cos(S.t+u.ph)*2,gy=tg?tg.y:u.g.y+Math.sin(S.t+u.ph)*2,dx=gx-u.x,dy=gy-u.y,l=Math.hypot(dx,dy)||1;u.x+=dx/l*Math.min(l,4*dt);u.y+=dy/l*Math.min(l,4*dt);u.ang=Math.atan2(dy,dx);
      u.cd=(u.cd||0)-dt;if(tg&&u.cd<=0&&dist(tg,u)<=(tg.size||2)*.45+.7){u.cd=1;hurt(G,tg,50);vis(G,{k:'ring',x:tg.x,y:tg.y,c:'#cfe8ff',max:.4})}}})}
function spawnGhost(G,S,g){const u=unit(G,S,{k:'ghost',x:g.x,y:g.y,hp:100,size:1.1,hr:.7,taunt:0,g,ph:Math.random()*6,h:1.4});g.gh=u;g.rs=null;return u}
function unit(G,S,o){const u=Object.assign({c40u:1,dead:false,red:0,hit:0,h:0},o);u.max=u.hp;S.u.push(u);try{c14Reg(G,u)}catch(x){u.c14t=1;(G.c14t=G.c14t||[]).push(u)}return u}
/* Hư Không Vũ Trụ: đếm đạn bắn ra trong thảm (100 viên → sao chổi 400), thu 2.500 mảnh → hư không nuốt 4 mục tiêu */
function hukhong(G,S,dt,E,Rg){const now=new Set();(G.pr||[]).forEach(p=>{if(p.dead)return;now.add(p);if(!S.seen.has(p)&&inR(Rg,p,0)){S.seen.add(p);S.bul++;S.met.add(p)}});
  S.met.forEach(p=>{if(!now.has(p)||p.dead){S.met.delete(p);S.frag+=1}});
  if(S.bul>=100){S.bul-=100;const T=enemies(G,Rg,4);if(T.length){const e=T[Math.floor(Math.random()*T.length)];vis(G,{k:'comet',tg:e,x:e.x,y:e.y,max:1,up(G,S2,dt){if(this.tg&&!this.tg.dead){this.x=this.tg.x;this.y=this.tg.y}if(!this.hit&&this.t>=.98){this.hit=1;enemies(G,null).forEach(q=>{if(Math.hypot(q.x-this.x,q.y-this.y)<=1.5+(q.size||2)*.3)hurt(G,q,400)});vis(G,{k:'boom',x:this.x,y:this.y,h:.4,max:.7,c:'#9fd0ff'})}}})}}
  if(S.frag>=2500&&!S.void){S.frag-=2500;const C={x:S.cx,y:S.cy},T=enemies(G,Rg,12).sort((a,b)=>dist(a,C)-dist(b,C)).slice(0,4);
    S.void=vis(G,{k:'void',x:S.cx,y:S.cy,T,max:3.2,up(G,S2,dt){this.T.forEach(e=>{if(e.dead)return;const dx=this.x-e.x,dy=this.y-e.y,l=Math.hypot(dx,dy);if(l>.3){e.x+=dx/l*Math.min(l,dt*5);e.y+=dy/l*Math.min(l,dt*5)}e.lift=Math.min(2,(e.lift||0)+dt*.8);e.stun=Math.max(e.stun||0,.2);e.noFire=Math.max(e.noFire||0,.2)});
      if(!this.hit&&this.t>=3.1){this.hit=1;this.T.forEach(e=>{e.lift=0;if(e.dead)return;if(e.boss)hurtPct(G,e,.3);else{try{dfDmgS(e,e.hp+1e7)}catch(x){}}});vis(G,{k:'boom',x:this.x,y:this.y,h:3,max:1,c:'#b07aff'});S.void=null;pop(G,this.x,this.y-3,'Hư không nuốt chửng!','#d0a0ff')}}});pop(G,S.cx,S.cy-3,'Hư không mở ra…','#d0a0ff')}}
/* Phượng Hoàng Tái Sinh: thiêu đốt 10 mỗi 0,25 giây; đủ 60 tàu đi qua thảm → triệu hồi phượng hoàng */
function phuong(G,S,dt,E,Rg){S.a+=dt;while(S.a>=.25){S.a-=.25;E.forEach(e=>hurt(G,e,10))}
  allies(G,Rg,0).concat(E).forEach(u=>{if(!S.seen.has(u)){S.seen.add(u);S.cnt++}});
  const live=S.u.find(u=>u.k==='phoenix'&&!u.dead);if(S.cnt>=60&&!live){S.cnt-=60;const u=unit(G,S,{k:'phoenix',x:S.cx,y:S.cy,hp:1000,size:2.4,hr:1.2,taunt:0,h:4.5,cd:1});pop(G,S.cx,S.cy-3,'Phượng hoàng tái sinh!','#ffb02e')}
  S.u.forEach(u=>{if(u.k!=='phoenix'||u.dead)return;const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];const gx=tg?tg.x:S.cx+Math.cos(S.t*.5)*3,gy=tg?tg.y:S.cy+Math.sin(S.t*.5)*3,dx=gx-u.x,dy=gy-u.y,l=Math.hypot(dx,dy)||1,want=tg?3:0;
    if(l>want+.2){u.x+=dx/l*Math.min(l-want,6*dt);u.y+=dy/l*Math.min(l-want,6*dt)}u.ang=Math.atan2(dy,dx);u.cd-=dt;
    if(tg&&u.cd<=0&&l<=4.3){u.cd=1.2;const a=u.ang;enemies(G,null).forEach(e=>{const ex=e.x-u.x,ey=e.y-u.y,d=Math.hypot(ex,ey);if(d>4+(e.size||2)*.3)return;let da=Math.atan2(ey,ex)-a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;if(Math.abs(da)<=.55)hurt(G,e,100)});vis(G,{k:'cone',x:u.x,y:u.y,a,h:u.h,max:.5})}})}
/* Thánh Địa Thánh Kiếm: đủ 100 lượt bị hạ trong thảm → kiếm thánh giáng xuống */
function thankiem(G,S,dt,E,Rg){if(S.deaths>=100&&!S.sw){S.deaths-=100;S.sw=vis(G,{k:'sword',x:S.cx,y:S.cy,max:2.2,up(G,S2,dt){if(!this.hit&&this.t>=1.2){this.hit=1;allies(G,Rg,0).forEach(u=>heal(u,u.max*.25));blds(G,Rg).forEach(b=>heal(b,b.max*.25));
    enemies(G,Rg,0).forEach(e=>{const d=e.max*.2*BK(e);e.hp-=d;e.hit=.15;if(e.hp<=0){try{dfDmgS(e,1e7)}catch(x){}}});vis(G,{k:'boom',x:this.x,y:this.y,h:.5,max:1,c:'#fff3c0'});S.sw=null;pop(G,this.x,this.y-3,'Kiếm thánh giáng trần!','#fff3c0')}}});pop(G,S.cx,S.cy-3,'Thánh kiếm sắp giáng…','#fff3c0')}}

/* ---------- móc vào sát thương: đếm hạ gục, hồi sinh (Thánh Kiếm), giảm sát thương kỹ năng (Pháp Trận) ---------- */
function onDeath(G,u,isB){const S=G&&G.c40;if(!S)return;const Rg=S.Rg,ins=inR(Rg,u,isB?0:2);
  if(S.K===28&&ins&&!isB){S.cnt+=5;for(let i=0;i<5;i++)vis(G,{k:'shard',x0:u.x+rnd(-1,1),y0:u.y+rnd(-1,1),x:S.cx,y:S.cy,max:1.2+i*.1})}
  if(S.K===28&&ins&&isB)S.cnt+=5;
  if(S.K===37&&ins)S.frag+=isB?80:50;
  if(S.K===39&&ins)S.deaths++;
  try{const f=X.death[S.K];if(f)f(G,S,u,isB,ins)}catch(e){console.error(e)}}
const isAlly=(G,u)=>u===G.pl||(G.al||[]).includes(u);
function revive(G,u,isB){const S=G&&G.c40;if(S){try{const f=X.lethal[S.K];if(f&&f(G,S,u,isB))return true}catch(e){console.error(e)}}if(!S||S.K!==39||!inR(S.Rg,u,0))return false;if(isB?!G.bl.includes(u):!isAlly(G,u))return false;if(Math.random()>=.08)return false;
  u.hp=u.max*.2;u.hit=.2;if(u===G.pl){u.dead=false;G.respawn=0}vis(G,{k:'ring',x:u.x,y:u.y,c:'#fff3c0',max:.8});pop(G,u.x,u.y-1.6,'Thánh địa hồi sinh!','#fff3c0');return true}
const skl=(G,u)=>G&&G.c40&&G.c40.K===28&&G.c40skl&&inR(G.c40.Rg,u,0);
{const _D=dfDmgS;dfDmgS=function(s,d,f){const G=DG;try{if(G&&s&&!s.dead&&G.c40){if(skl(G,s)&&isAlly(G,s))d*=.9;if(s.hp-d<=0&&revive(G,s,0))return}}catch(x){}const was=s&&!s.dead,r=_D.apply(this,arguments);try{if(G&&was&&s.dead&&!s.c40u&&!s.ghost)onDeath(G,s,0)}catch(x){}return r}}
if(typeof dfDmgA==='function'){const _A=dfDmgA;dfDmgA=function(a,d){const G=DG;try{if(G&&a&&!a.dead&&G.c40){if(skl(G,a))d*=.9;if(a.hp-d*(1-(a.red||0))<=0&&revive(G,a,0))return}}catch(x){}const was=a&&!a.dead,r=_A.apply(this,arguments);try{if(G&&was&&a.dead&&!a.ghost)onDeath(G,a,0)}catch(x){}return r}}
{const _B=dfDmgB;dfDmgB=function(b,d){const G=DG;try{if(G&&b&&b.hp>0&&G.c40){if(skl(G,b))d*=.9;{const f=X.dmgB[G.c40.K];if(f){d=f(G,G.c40,b,d);if(!(d>0))return}}const sv=(b.shd&&b.shd.t>0&&b.shd.v)||0;if(b.hp+sv-d*(1-(b.red||0))<=0&&revive(G,b,1))return}}catch(x){}const was=b&&b.hp>0,r=_B.apply(this,arguments);try{if(G&&was&&b.hp<=0)onDeath(G,b,1)}catch(x){}return r}}
/* đánh dấu lúc kẻ địch thi triển kỹ năng (Pháp Trận giảm 10% sát thương kỹ năng) */
if(window.CSK&&CSK.cast){const _k=CSK.cast;CSK.cast=function(P){const G=DG,es=G&&P&&(P.team==='e'||(G.en||[]).includes(P));const pv=G&&G.c40skl;if(G&&es)G.c40skl=1;try{return _k.apply(this,arguments)}finally{if(G)G.c40skl=pv}}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}
/* đá bị phá (Hư Không) */
window.C40={step,init,X,H:{enemies,allies,blds,hurt,hurtPct,pop,vis,unit,inR,shield,addHP,heal,BK,DBk,rnd,roll,dist,isAlly}};
})();
