/* ===== c16: Xưởng drone bảo trì · Kho vật tư dự phòng · Ga-ra cứu hộ · Trạm y tế dã chiến · mô phỏng công trình ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const CFG={mt2:{every:60,max:3,range:7,heal:50,hp:200},mt3:{every:3,range:5,shield:40},mt4:{work:8,pct:20,speed:4.5},mt5:{early:.2}};
const C16T=['mt2','mt3','mt4','mt5'];
window.c16Has=t=>C16T.includes(t);
/* gắn cờ cho 4 công trình, bỏ hiệu ứng cũ (tăng % máu công trình của kho vật tư) */
C16T.forEach(t=>{const f=NBF[t];if(f){f.c16=t;delete f.e}});
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
upd('mt2',(l,k)=>[['Hồi máu mỗi giây (tia laser liên tục)',Math.round(50*k)],['Phạm vi','7 ô'],['Số mục tiêu mỗi drone','1'],['Máu mỗi drone',Math.round(200*k)],['Tạo drone','60 giây / drone, tối đa 3']],'Tạo drone bảo trì ra chiến trường (60 giây / drone, tối đa 3). Mỗi drone chiếu tia laser hồi 50 máu/giây cho 1 công trình trong 7 ô.');
upd('mt3',(l,k)=>[['Giáp tạo ra mỗi 3 giây',Math.round(40*k)],['Phạm vi','5 ô'],['Mục tiêu','1 công trình có máu thấp nhất'],['Giáp tối đa mỗi công trình','bằng máu tối đa']],'Cứ 3 giây tạo 40 giáp cho 1 công trình trong 5 ô, ưu tiên công trình có máu thấp nhất.');
upd('mt4',(l,k)=>[['Dựng lại công trình trong','8 giây'],['Máu khi dựng lại',Math.min(90,Math.round(20*k))+'%'],['Xe cứu hộ','1 xe, đi tới xác công trình']],'Xe cứu hộ đi tới xác công trình và dựng lại trong 8 giây, máu khi dựng lại 20%.');
upd('mt5',(l,k)=>[['Hồi sinh tàu sớm hơn',fmt(.2*k)+' giây'],['Điều kiện','Trạm còn trong chiến trường']],'Khi tàu bị phá hủy, hồi sinh sớm hơn 0,2 giây nếu có trạm y tế dã chiến trong chiến trường.');

/* ---------- Xưởng drone bảo trì: drone ra chiến trường, laser hồi máu liên tục ---------- */
function mt2(b,dt,G){const C=CFG.mt2,a=b.drs=b.drs||[],lvf=LV(b),EV=b.adEv||C.every,MX=b.adMax||C.max;
  for(let i=a.length-1;i>=0;i--)if(a[i].dead||a[i].hp<=0)a.splice(i,1);
  if(b.adT==null)b.adT=EV;
  if(a.length<MX){b.adT+=dt;if(b.adT>=EV){b.adT=0;const hp=C.hp*lvf;a.push({x:b.x,y:b.y,a:Math.random()*6.28,rot:Math.random()*6.28,tg:null,live:false,hp,hmax:hp,dead:false,hf:0,age:0});
    G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*.5,t:.45,max:.45,col:'#7dffb0'})}}else b.adT=0;
  const hurt=G.bl.filter(o=>o.hp>0&&o.hp<o.max&&o.t!=='mine'&&Math.hypot(o.x-b.x,o.y-b.y)<=C.range),rate=C.heal/DFB*lvf;
  a.forEach((d,i)=>{d.age+=dt;if(d.hf>0)d.hf-=dt;d.rot+=dt*2.2;d.a+=dt*(.9+.15*i);
    let tg=d.tg;if(tg&&(tg.hp<=0||tg.hp>=tg.max||!hurt.includes(tg)))tg=null;
    if(!tg){const used=a.filter(o=>o!==d&&o.tg).map(o=>o.tg);let best=null,br=9;hurt.forEach(o=>{if(used.includes(o))return;const r=o.hp/o.max;if(r<br){br=r;best=o}});
      if(!best)hurt.forEach(o=>{const r=o.hp/o.max;if(r<br){br=r;best=o}});tg=best}
    d.tg=tg;let hx,hy;
    if(tg){const r=Math.max(tg.w,tg.h)/2+.75;hx=tg.x+Math.cos(d.a)*r;hy=tg.y+Math.sin(d.a)*r}
    else{const r=Math.max(b.w,b.h)/2+.9;hx=b.x+Math.cos(d.a+i*2.1)*r;hy=b.y+Math.sin(d.a+i*2.1)*r}
    const au=window.c17Aura?window.c17Aura(G,d.x,d.y):null,dx=hx-d.x,dy=hy-d.y,l=Math.hypot(dx,dy)||1,m=Math.min(l,7*dt*(au?au.sp:1));d.x+=dx/l*m;d.y+=dy/l*m;
    d.live=!!tg&&Math.hypot(tg.x-d.x,tg.y-d.y)<=Math.max(tg.w,tg.h)/2+1.7;
    if(d.live)tg.hp=Math.min(tg.max,tg.hp+rate*dt)});
  if(window.c15BulletHit)window.c15BulletHit(G,a)}
window.c16DroneDraw=function(q,d,X,Y,s,T){const px=X(d.x),py=Y(d.y),h=s*.62*Math.min(1,.3+d.age*1.5);
  if(d.live&&d.tg)drnBeam(q,px,py,X(d.tg.x),Y(d.tg.y),T,1,s);
  drnSpr(q,px,py,h,d.rot,1,null,d.hf>0?'#ffffff':null);drnBar(q,px,py,h,d)};

/* ---------- Kho vật tư dự phòng: 3 giây tạo 40 giáp cho 1 công trình trong 5 ô ---------- */
function mt3(b,dt,G){const C=CFG.mt3;b.sT=(b.sT==null?C.every:b.sT)-dt;if(b.sT>0)return;b.sT+=C.every;if(b.sT<=0)b.sT=C.every;
  const add=C.shield/DFB*LV(b);let best=null,br=1e9;
  G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine'||Math.hypot(o.x-b.x,o.y-b.y)>C.range)return;const sv=(o.shd&&o.shd.t>0)?o.shd.v:0;if(sv>=o.max-1e-9)return;const r=(o.hp+sv)/o.max;if(r<br){br=r;best=o}});
  if(!best)return;const o=best;if(!(o.shd&&o.shd.t>0))o.shd={v:0,t:9999,max:o.max};
  o.shd.v=Math.min(o.max,o.shd.v+add);o.shd.max=Math.max(o.shd.max||0,o.max);o.shd.t=Math.max(o.shd.t,9999);o.shdAt=G.t;o.shdC=1;
  G.bm.push({x1:b.x,y1:b.y,x2:o.x,y2:o.y,t:.35,col:'#8fd8ff',w:3});G.fx.push({x:o.x,y:o.y,r:Math.max(o.w,o.h)*.75,t:.45,max:.45,col:'#8fd8ff'})}

/* ---------- Ga-ra cứu hộ: xe 2D đi tới xác công trình, dựng lại trong 8 giây (20% máu) ---------- */
function mt4(b,dt,G){const C=CFG.mt4,v=b.gv=b.gv||{m:'idle',x:b.x,y:b.y,ang:0,t:0,tg:null},pct=Math.min(.9,C.pct/100*LV(b));
  const wreck=()=>{let best=null,bd=1e9;G.bl.forEach(o=>{if(o.hp>0||o.t==='mine'||o.hq||o.aux||o===b)return;if(o.rvBy&&o.rvBy!==b){if(o.rvBy.hp>0)return;o.rvBy=null;o.rb=0}const q=Math.hypot(o.x-b.x,o.y-b.y);if(q<bd){bd=q;best=o}});return best};
  const mv=(tx,ty,sp)=>{const dx=tx-v.x,dy=ty-v.y,l=Math.hypot(dx,dy);if(l>.001)v.ang=Math.atan2(dy,dx);const m=Math.min(l,sp*dt);if(l>.001){v.x+=dx/l*m;v.y+=dy/l*m}return l-m};
  const take=w=>{w.rvBy=b;v.tg=w;v.m='go'};
  if(v.m==='idle'||v.m==='back'){const w=wreck();if(w){if(v.m==='idle'){v.x=b.x;v.y=b.y;G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*.5,t:.4,max:.4,col:'#ffd27a'})}take(w)}}
  if(v.m==='go'){const w=v.tg;if(!w||w.hp>0){v.tg=null;v.m='back'}else{const stop=Math.max(w.w,w.h)/2+.95,dx=w.x-v.x,dy=w.y-v.y,l=Math.hypot(dx,dy);
      if(l<=stop+.05){v.m='work';v.t=0;v.ang=Math.atan2(dy,dx)}else mv(w.x-dx/l*stop,w.y-dy/l*stop,C.speed)}}
  else if(v.m==='work'){const w=v.tg;if(!w||w.hp>0){v.tg=null;v.m='back'}else{v.t+=dt;w.rb=Math.min(1,v.t/C.work);
      if(v.t>=C.work){w.hp=w.max*pct;w.rb=0;w.rvBy=null;w.shd=null;w.flash=.3;w.used=false;G.fx.push({x:w.x,y:w.y,r:Math.max(w.w,w.h)*1.2,t:.6,max:.6,col:'#7dffa0'});v.tg=null;
        const n=wreck();if(n)take(n);else v.m='back'}}}
  else if(v.m==='back'){if(mv(b.x,b.y,C.speed*1.1)<.12)v.m='idle'}}

/* ---------- Trạm y tế dã chiến: tàu bị hạ hồi sinh sớm hơn 0,2 giây ---------- */
window.c16Rsp=function(G){let r=0;(G.bl||[]).forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c16==='mt5')r=Math.max(r,CFG.mt5.early*LV(b))});return r};
{const _S=dfDmgS;dfDmgS=function(s,d,fromE){const G=DG,was=s&&s.dead,r=_S.apply(this,arguments);
  try{if(G&&s&&!was&&s.dead&&s.team!=='e'&&s===G.pl){const e=window.c16Rsp(G);if(e>0){G.respawn=Math.max(.05,G.respawn-e);G.fx.push({x:s.x,y:s.y,r:1.5,t:.6,max:.6,col:'#7dffa0'})}}}catch(er){}
  return r}}
window.c16Tick=function(b,dt,G){const c=b.nb&&b.nb.c16;if(!c)return false;if(c==='mt2')mt2(b,dt,G);else if(c==='mt3')mt3(b,dt,G);else if(c==='mt4')mt4(b,dt,G);return true};

/* ---------- vẽ: xe cứu hộ, công trình đang dựng lại, giáp ---------- */
window.c16Veh=function(q,x,y,ang,s,T,work,al){q.save();q.translate(x,y);q.rotate(ang);q.globalAlpha=al==null?1:al;const u=s;
  q.fillStyle='rgba(0,0,0,.35)';q.beginPath();q.ellipse(0,.05*u,.74*u,.42*u,0,0,7);q.fill();
  q.fillStyle='#161a24';[[-.4,-.37],[-.4,.27],[.34,-.37],[.34,.27]].forEach(w=>q.fillRect((w[0]-.15)*u,w[1]*u,.3*u,.1*u));
  const g=q.createLinearGradient(0,-.32*u,0,.32*u);g.addColorStop(0,'#ffc23a');g.addColorStop(1,'#e0780a');
  q.fillStyle=g;q.strokeStyle='#5a3207';q.lineWidth=Math.max(1,.04*u);q.beginPath();RR(q,-.64*u,-.3*u,1.28*u,.6*u,.1*u);q.fill();q.stroke();
  q.fillStyle='#2a3350';q.beginPath();RR(q,.16*u,-.27*u,.46*u,.54*u,.08*u);q.fill();
  q.fillStyle='#6fb6ff';q.beginPath();RR(q,.44*u,-.22*u,.14*u,.44*u,.04*u);q.fill();
  q.fillStyle='#e8eefc';q.fillRect(.22*u,-.2*u,.18*u,.4*u);
  q.fillStyle='#1b1b1b';for(let i=0;i<4;i++)q.fillRect((-.62+i*.1)*u,(-.3)*u,.05*u,.6*u);   /* vạch cảnh báo phía sau */
  q.fillStyle='#ffd23a';for(let i=0;i<4;i++)q.fillRect((-.57+i*.1)*u,(-.3)*u,.05*u,.6*u);
  q.fillStyle='#8c95ab';q.beginPath();q.arc(-.2*u,0,.12*u,0,7);q.fill();q.strokeStyle='#3a4256';q.stroke();
  const bl=work?.95:-.7,sw=work?.12*Math.sin(T*2.4):0;q.strokeStyle='#d8dde8';q.lineWidth=Math.max(2,.07*u);q.lineCap='round';q.beginPath();q.moveTo(-.2*u,0);q.lineTo((-.2+bl*Math.cos(sw))*u,bl*Math.sin(sw)*u);q.stroke();
  q.fillStyle='#ffb12a';q.beginPath();q.arc((-.2+bl*Math.cos(sw))*u,bl*Math.sin(sw)*u,.07*u,0,7);q.fill();
  const f=Math.sin(T*14)>0;q.fillStyle=f?'#ff4a4a':'#5a2a2a';q.beginPath();q.arc(.3*u,-.15*u,.05*u,0,7);q.fill();q.fillStyle=f?'#2a3a5a':'#5aa0ff';q.beginPath();q.arc(.3*u,.15*u,.05*u,0,7);q.fill();
  q.restore()};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
window.c16Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  G.bl.forEach(o=>{
    if(o.hp<=0&&o.rb>0&&o.rvBy&&o.rvBy.hp>0){const x=X(o.x-o.w/2),y=Y(o.y-o.h/2),w=o.w*s,h=o.h*s,im=dimg(BSPR[o.t]||SPR[o.t]);
      if(im){q.save();q.beginPath();q.rect(x,y+h*(1-o.rb),w,h*o.rb);q.clip();q.globalAlpha=.85;
        if(o.nb){const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;q.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}else q.drawImage(im,x,y,w,h);q.restore()}
      q.save();q.strokeStyle='#ffd27a';q.lineWidth=1.5;q.setLineDash([4,3]);q.strokeRect(x+1,y+1,w-2,h-2);q.setLineDash([]);
      const bw=Math.max(w*.9,s*1.6),bx=x+w/2-bw/2,by=y-s*.3;q.fillStyle='#000a';q.fillRect(bx,by,bw,s*.17);q.fillStyle='#ffd23a';q.fillRect(bx,by,bw*o.rb,s*.17);
      q.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const u=(T*3+i*.37)%1,sx=X(o.x)+(hz(i+Math.floor(T*3))*2-1)*w*.35,sy=Y(o.y)+(hz(i*3+Math.floor(T*3))*2-1)*h*.35;q.globalAlpha=1-u;q.fillStyle='#ffe38a';q.beginPath();q.arc(sx,sy,Math.max(1.2,s*.05*(1-u)),0,7);q.fill()}
      q.restore()}
    if(o.hp>0&&o.shdC&&o.shd&&o.shd.t>0&&o.shd.v>0){const a0=Math.min(1,.6+.4*o.shd.v/Math.max(1e-9,o.shd.max)),pu=Math.max(0,1-(G.t-(o.shdAt||-9))/.6),x=X(o.x-o.w/2)-3,y=Y(o.y-o.h/2)-3,w=o.w*s+6,h=o.h*s+6;
      q.save();q.shadowColor='#7fd0ff';q.shadowBlur=8+10*pu;q.fillStyle='rgba(100,190,255,'+(.08*a0+.12*pu)+')';q.strokeStyle='rgba(150,220,255,'+Math.min(1,a0*.7+.3*pu)+')';q.lineWidth=2+2*pu;
      q.beginPath();RR(q,x,y,w,h,Math.min(10,s*.3));q.fill();q.stroke();q.restore()}
    const v=o.gv;if(v&&v.m!=='idle'&&o.hp>0)window.c16Veh(q,X(v.x),Y(v.y),v.ang,s*.95,T,v.m==='work')})};
{const _D=dfDraw;dfDraw=function(){_D.apply(this,arguments);try{const G=DG;if(G&&G.bl){dq.setTransform(dfV.dpr,0,0,dfV.dpr,0,0);window.c16Draw(dq,G,dsx,dsy,dfV.s,G.t)}}catch(e){}}}

/* =====================================================================
   Mô phỏng ở màn Nâng cấp Trụ sở: mìn, tường, trụ điện, nhà drone tấn công,
   xưởng drone bảo trì, kho vật tư, ga-ra cứu hộ, trạm y tế dã chiến
   ===================================================================== */
const SC=window.c16SC={};
const bpx=(t,lv)=>t==='mine'?100/DFB:(bHP(t)||800)/DFB;
function mkBld(G,t,x,y,o){o=o||{};const d=BLD.find(b=>b.t===t)||{w:2,h:2,nb:null},lv=o.lv||1;
  const b={id:'pv'+t+G.bl.length,t,n:d.n,x,y,w:o.w||d.w,h:o.h||d.h,v:false,hp:1,max:1,lv,cd:0,spec:null,nb:d.nb||null,used:false,red:t==='wall'?Math.min(.6,.02*lv):0};
  b.max=o.max||bpx(t,lv);b.hp=b.max*(o.f==null?1:o.f);G.bl.push(b);return b}
function mkEn(G,c,x,y,hp,quiet){const e={sh:c.pool[c.pi++%c.pool.length],team:'e',x,y,home:[x,y],size:1.9,hp,max:hp,rv:0,hit:0,dead:false,spawn:0,stun:0,slowT:0,slowK:1,ang:Math.PI/2,red:0,ws:[]};G.en.push(e);return e}
const shell=(G,x,y,tx,ty,dmg,sp)=>{const l=Math.hypot(tx-x,ty-y)||1;sp=sp||9;G.pr.push({x,y,vx:(tx-x)/l*sp,vy:(ty-y)/l*sp,dmg,team:'e',k:'shell',col:'#ff8a8a',spl:0,life:l/sp+.5})};
const shooter=(G,c,e,tgs,dmg,cd,key)=>{c[key]=(c[key]||Math.random()*.5)-c.dt;if(c[key]>0)return;c[key]+=cd;const alive=tgs().filter(b=>b.hp>0);if(!alive.length)return;const b=alive[(Math.random()*alive.length)|0];shell(G,e.x,e.y+.5,b.x+(Math.random()-.5)*b.w*.4,b.y-b.h*.3,dmg,9)};

window.c16Help={mkBld,mkEn,shell,shooter};
SC.mine={title:'MÌN NỔ',note:'Mục tiêu giả bước vào vùng kích nổ',
  init(G,c){c.m=mkBld(G,'mine',7.5,6.6,{w:1,h:1,max:2,lv:c.lv});c.dmg=10*(1+.12*(c.lv-1));c.es=[mkEn(G,c,6.8,-.6,c.dmg*2.4),mkEn(G,c,8.3,-1.9,c.dmg*2.4)];c.rst=0;c.es.forEach(e=>{e.noRev=true})},
  step(G,dt,c){const m=c.m;c.es.forEach(e=>{if(!e.dead)e.y+=2.3*dt});
    if(m.hp>0&&!m.used){for(const e of c.es){if(!e.dead&&Math.hypot(e.x-m.x,e.y-m.y)<1.3){m.used=true;m.hp=0;dfBlast(m.x,m.y,2.6,c.dmg,'p');c.rst=2.4;break}}}
    if(m.used){c.rst-=dt;if(c.rst<=0){m.used=false;m.hp=m.max;c.es.forEach((e,i)=>{e.dead=false;e.hp=e.max;e.x=e.home[0];e.y=e.home[1];e.rvT=0})}}},
  under(q,G,c,X,Y,s){if(c.m.hp>0){q.save();q.setLineDash([4,4]);q.strokeStyle='rgba(255,210,120,.55)';q.beginPath();q.arc(X(c.m.x),Y(c.m.y),1.3*s,0,7);q.stroke();q.strokeStyle='rgba(255,120,60,.35)';q.beginPath();q.arc(X(c.m.x),Y(c.m.y),2.6*s,0,7);q.stroke();q.restore()}}};
SC.wall={title:'TƯỜNG CHẶN ĐẠN',note:'Tường chặn đạn địch và giảm sát thương',
  init(G,c){c.w=[5.5,7.5,9.5].map(x=>mkBld(G,'wall',x,6.7,{w:2,h:1,lv:c.lv}));c.s=[mkEn(G,c,4.3,1.1,1e9),mkEn(G,c,10.7,1.1,1e9)];c.dmg=c.w[0].max*.12},
  step(G,dt,c){c.dt=dt;c.s.forEach((e,i)=>shooter(G,c,e,()=>c.w,c.dmg,.75+i*.1,'k'+i));
    c.w.forEach(w=>{if(w.hp<=w.max*.08){w.rt=(w.rt||0)+dt;if(w.rt>1.1){w.hp=w.max;w.rt=0;G.fx.push({x:w.x,y:w.y,r:1.3,t:.5,max:.5,col:'#7dffa0'})}}})}};
SC.pylon={title:'KHIÊN ĐIỆN TRỤ ĐIỆN',note:'Công trình trong vòng điện nhận ít hơn 25% sát thương',
  init(G,c){c.p=mkBld(G,'pylon',7.6,6.9,{w:1,h:1,lv:c.lv});c.a=mkBld(G,'cannon',5.2,6.4,{});c.b=mkBld(G,'cannon',12.0,6.4,{});c.s=[mkEn(G,c,7.6,1.0,1e9)];c.dmg=c.a.max*.1;c.R=3.4+c.lv*.03},
  step(G,dt,c){c.dt=dt;shooter(G,c,c.s[0],()=>[c.a,c.b],c.dmg,.5,'k');[c.a,c.b].forEach(b=>{if(b.hp<=b.max*.08){b.rt=(b.rt||0)+dt;if(b.rt>1.1){b.hp=b.max;b.rt=0;G.fx.push({x:b.x,y:b.y,r:1.4,t:.5,max:.5,col:'#7dffa0'})}}})},
  under(q,G,c,X,Y,s){const x=X(c.p.x),y=Y(c.p.y),r=c.R*s,T=G.t;q.save();const g=q.createRadialGradient(x,y,r*.2,x,y,r);g.addColorStop(0,'rgba(120,190,255,.04)');g.addColorStop(1,'rgba(120,190,255,.22)');q.fillStyle=g;q.beginPath();q.arc(x,y,r,0,7);q.fill();
    q.strokeStyle='rgba(150,220,255,'+(.55+.2*Math.sin(T*9))+')';q.lineWidth=2;q.shadowColor='#7fd0ff';q.shadowBlur=8;q.beginPath();for(let i=0;i<=90;i++){const a=i/90*6.2832,k=1+.012*Math.sin(a*9+T*12);const px=x+Math.cos(a)*r*k,py=y+Math.sin(a)*r*k;i?q.lineTo(px,py):q.moveTo(px,py)}q.stroke();q.restore()},
  over(q,G,c,X,Y,s){q.save();q.font='bold 11px sans-serif';q.textAlign='center';q.fillStyle='#bfe6ff';q.fillText('−25% sát thương',X(c.a.x),Y(c.a.y)-c.a.h*s*.7);q.fillStyle='#ffb0a0';q.fillText('không có khiên',X(c.b.x),Y(c.b.y)-c.b.h*s*.7);q.restore()}};
SC.droneb={title:'DRONE TẤN CÔNG',note:'Xem nhanh: thực tế 60 giây tạo 1 drone',
  init(G,c){c.b=mkBld(G,'droneb',7.5,7.2,{w:3,h:3,lv:c.lv});c.b.adEv=6;c.e=mkEn(G,c,7.5,1.9,24*(1+.1*(c.lv-1))*9)},
  step(G,dt,c){window.c15Drone(c.b,dt,G)}};
SC.mt2={title:'DRONE BẢO TRÌ',note:'Xem nhanh: thực tế 60 giây tạo 1 drone',
  init(G,c){c.b=mkBld(G,'mt2',7.5,7.4,{lv:c.lv});c.b.adEv=6;c.t=[mkBld(G,'cannon',3.9,5.6,{max:4,f:.35}),mkBld(G,'laser',11.1,5.6,{max:4,f:.6}),mkBld(G,'wall',7.5,3.9,{w:2,h:1,max:4,f:.5})];c.s=[mkEn(G,c,3.5,.4,1e9),mkEn(G,c,11.5,.4,1e9)]},
  step(G,dt,c){c.dt=dt;c.s.forEach((e,i)=>shooter(G,c,e,()=>c.t,.4,.8+i*.15,'k'+i));window.c16Tick(c.b,dt,G);
    c.t.forEach(b=>{if(b.hp<=b.max*.06){b.hp=b.max*.4}})}};
SC.mt3={title:'TẠO GIÁP SỬA CHỮA',note:'Giáp tạo cho công trình có máu thấp nhất',
  init(G,c){c.b=mkBld(G,'mt3',7.5,7.5,{lv:c.lv});c.t=[mkBld(G,'cannon',4.2,5.6,{max:4}),mkBld(G,'laser',10.8,5.6,{max:4}),mkBld(G,'wall',7.5,4.0,{w:2,h:1,max:4})];c.s=[mkEn(G,c,3.5,.4,1e9),mkEn(G,c,11.5,.4,1e9)]},
  step(G,dt,c){c.dt=dt;c.s.forEach((e,i)=>shooter(G,c,e,()=>c.t,.28,.75+i*.15,'k'+i));window.c16Tick(c.b,dt,G);
    c.t.forEach(b=>{if(b.hp<=b.max*.07){b.hp=b.max*.6;b.shd=null}})},
  under(q,G,c,X,Y,s){q.save();q.setLineDash([5,5]);q.strokeStyle='rgba(143,216,255,.4)';q.beginPath();q.arc(X(c.b.x),Y(c.b.y),5*s,0,7);q.stroke();q.restore()}};
SC.mt4={title:'DỰNG LẠI CÔNG TRÌNH',note:'Xe cứu hộ đi tới xác công trình',
  init(G,c){c.b=mkBld(G,'mt4',3.4,7.4,{lv:c.lv});c.w=mkBld(G,'cannon',11.0,5.6,{});c.alive=false;c.tm=0},
  step(G,dt,c){c.tm+=dt;const w=c.w;
    if(w.hp>0){if(!c.alive){c.alive=true;c.tm=0}if(c.tm>2.5){w.hp=0;w.shd=null;c.alive=false;G.fx.push({x:w.x,y:w.y,r:w.w*1.5,t:.8,max:.8,ex:1,rot:Math.random()*6})}}
    window.c16Tick(c.b,dt,G)}};
SC.mt5={title:'HỒI SINH TÀU',note:'Tàu chính bị hạ rồi hồi sinh',
  init(G,c){c.b=mkBld(G,'mt5',3.6,7.4,{lv:c.lv});c.ship=c.pool[0];c.ph=0;c.tm=0;c.early=.2*(1+.1*(c.lv-1));c.rs=4},
  step(G,dt,c){c.tm+=dt;
    if(c.ph===0&&c.tm>1.6){c.ph=1;c.tm=0;c.left=c.rs-c.early;G.fx.push({x:9.5,y:5.4,r:2.2,t:.9,max:.9,ex:1,rot:1});G.fx.push({x:9.5,y:5.4,r:1.5,t:.6,max:.6,col:'#7dffa0'})}
    else if(c.ph===1){c.left-=dt;if(c.left<=0){c.ph=0;c.tm=0;G.fx.push({x:9.5,y:5.4,r:1.6,t:.6,max:.6,col:'#7dffa0'})}}},
  over(q,G,c,X,Y,s){q.save();q.textAlign='center';
    if(c.ph===0){const im=dimg(c.ship.img);if(im){const h=2.4*s,w=h*im.naturalWidth/im.naturalHeight;q.drawImage(im,X(9.5)-w/2,Y(5.4)-h/2,w,h)}}
    else{q.font='bold 16px sans-serif';q.fillStyle='#fff';q.fillText('Hồi sinh sau '+Math.max(0,c.left).toFixed(1).replace('.',',')+' giây',X(9.5),Y(4.4));q.font='11px sans-serif';q.fillStyle='#9ff0b8';q.fillText('Sớm hơn '+fmt(c.early)+' giây nhờ trạm y tế dã chiến',X(9.5),Y(5.1));q.fillStyle='#8fa6d8';q.fillText('(không có trạm: '+c.rs.toFixed(1).replace('.',',')+' giây)',X(9.5),Y(5.8))}
    q.restore()}};

let cur=null;const stop=()=>{if(cur){cancelAnimationFrame(cur.raf);cur=null}};
function mount(){stop();
  const hq=$('hqu');if(!hq||hq.style.display==='none')return;const t=uSel,sc0=SC[t];if(!sc0)return;
  const old=document.getElementById('bpv');if(old)old.remove();
  const anchor=document.querySelector('#hqu .ubuy');if(!anchor)return;
  const sec=document.createElement('div');sec.id='bpv';sec.innerHTML=`<h5>MÔ PHỎNG ${sc0.title}</h5><canvas></canvas><div class="bt"><button data-a="f">🔥 Thử lại</button><button data-a="s">Chậm ×0.5</button><small>${sc0.note||''}</small></div>`;
  anchor.parentNode.insertBefore(sec,anchor);
  const cv=sec.querySelector('canvas'),q=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),Wpx=Math.max(220,Math.min(460,(sec.clientWidth||320))),Hpx=Math.round(Wpx*.68),sc=Wpx/15,WW=15,HH=Hpx/sc;
  cv.width=Wpx*dpr;cv.height=Hpx*dpr;cv.style.aspectRatio=Wpx+'/'+Hpx;
  const S1={raf:0,speed:1,G:null,c:null};cur=S1;
  const withG=fn=>{const prev=DG;DG=S1.G;try{return fn()}catch(e){console.error(e)}finally{DG=prev}};
  const build=()=>{const G={t:0,pr:[],bm:[],fx:[],vfi:[],en:[],eu:[],bl:[],al:[],kills:0,deaths:0,respawn:0,pl:{x:7.5,y:HH-2,dead:true,size:1,hp:1,max:1},pb:{dm:1,cdm:1,rm:1},wd:{Wd:WW,Hd:HH},hq:{x:7.5,y:HH-2,w:1,h:1,hp:1,max:1},done:false,over:false,wave:1,waves:1};
    S1.G=G;const c=S1.c={lv:bLv(t),pool:KSH.slice().sort(()=>Math.random()-.5),pi:0,dt:0};withG(()=>sc0.init(G,c))};
  build();
  const step=dt=>{const G=S1.G,c=S1.c;G.t+=dt;c.dt=dt;
    withG(()=>{sc0.step(G,dt,c);
      G.pr.forEach(p=>{if(p.dead)return;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0||p.y>HH+1||p.y<-2||p.x<-1||p.x>WW+1){p.dead=true;return}
        if(p.team==='e'){const b=dfBuildingAt(p.x,p.y);if(b){p.dead=true;dfDmgB(b,p.dmg);G.fx.push({x:p.x,y:p.y,r:.4,t:.22,max:.22,col:'#ffb066'})}}
        else{for(const e of G.en){if(e.dead||e.rv>0)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<e.size*.42){p.dead=true;dfDmgS(e,p.dmg,false);break}}}});
      G.pr=G.pr.filter(p=>!p.dead);
      G.en.forEach(e=>{e.hit=Math.max(0,e.hit-dt);if(e.dead&&!e.noRev){e.rvT=(e.rvT||0)+dt;if(e.rvT>1.6){e.dead=false;e.hp=e.max;e.rvT=0;e.x=e.home[0];e.y=e.home[1]}}});
      G.bl.forEach(b=>{b.flash=Math.max(0,(b.flash||0)-dt)});
      G.bm.forEach(b=>b.t-=dt);G.bm=G.bm.filter(b=>b.t>0);G.fx.forEach(f=>f.t-=dt);G.fx=G.fx.filter(f=>f.t>0)})};
  const drawBld=(b,X,Y)=>{const x=X(b.x-b.w/2),y=Y(b.y-b.h/2),w=b.w*sc,h=b.h*sc;
    if(b.hp<=0){if(b.t!=='mine'){q.fillStyle='rgba(60,40,40,.7)';q.fillRect(x+w*.1,y+h*.1,w*.8,h*.8)}return}
    if(b.t==='mine'){q.fillStyle='#ffd27a';q.globalAlpha=.7;q.beginPath();q.arc(x+w/2,y+h/2,sc*.28,0,7);q.fill();q.globalAlpha=1;return}
    const im=dimg(BSPR[b.t]||SPR[b.t]);q.save();if(b.flash>0)q.filter='brightness(2)';
    if(im){if(b.nb){const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;q.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}else q.drawImage(im,x,y,w,h)}else{q.fillStyle='#223f7c';q.fillRect(x+2,y+2,w-4,h-4)}
    q.restore();
    if(b.hp<b.max||(b.shd&&b.shd.t>0&&b.shd.v>0)){const bw=Math.max(w*.9,sc*1.6),bx=x+w/2-bw/2,by=y-sc*.28;q.fillStyle='#000a';q.fillRect(bx,by,bw,sc*.16);q.fillStyle=b.hp/b.max>.4?'#6dff9a':'#ff6a78';q.fillRect(bx,by,bw*Math.max(0,b.hp/b.max),sc*.16);
      if(b.shd&&b.shd.t>0&&b.shd.v>0){q.fillStyle='#fff';q.fillRect(bx,by,bw*Math.min(1,b.shd.v/Math.max(1e-9,b.shd.max)),sc*.16)}}};
  const draw=()=>{const G=S1.G,c=S1.c;q.setTransform(dpr,0,0,dpr,0,0);q.clearRect(0,0,Wpx,Hpx);
    const g=q.createLinearGradient(0,0,0,Hpx);g.addColorStop(0,'#0a1640');g.addColorStop(1,'#040a20');q.fillStyle=g;q.fillRect(0,0,Wpx,Hpx);
    q.strokeStyle='rgba(80,130,255,.10)';for(let x=0;x<Wpx;x+=sc){q.beginPath();q.moveTo(x,0);q.lineTo(x,Hpx);q.stroke()}for(let y=0;y<Hpx;y+=sc){q.beginPath();q.moveTo(0,y);q.lineTo(Wpx,y);q.stroke()}
    const X=x=>x*sc,Y=y=>y*sc;if(sc0.under)sc0.under(q,G,c,X,Y,sc);
    G.bl.forEach(b=>drawBld(b,X,Y));
    withG(()=>{window.c16Draw(q,G,X,Y,sc,G.t)});
    G.bl.forEach(b=>{if(!b.drs||b.hp<=0)return;b.drs.forEach(d=>{if(d.dead)return;if(b.t==='droneb')window.c15DroneDraw(q,d,X(d.x),Y(d.y),sc,G.t);else window.c16DroneDraw(q,d,X,Y,sc,G.t)})});
    G.en.forEach(e=>{if(e.dead)return;const im=dimg(e.sh.img),h=e.size*sc,x=X(e.x),y=Y(e.y);q.save();q.translate(x,y);if(e.hit>0)q.filter='brightness(2)';
      if(im){const w=h*im.naturalWidth/im.naturalHeight;q.rotate(Math.PI);q.drawImage(im,-w/2,-h/2,w,h)}q.restore();
      if(e.max<1e8){const bw=h*.9,f=Math.max(0,e.hp/e.max);q.fillStyle='#000a';q.fillRect(x-bw/2,y-h*.62,bw,5);q.fillStyle=f>.5?'#ff8a8a':'#ff3a4a';q.fillRect(x-bw/2,y-h*.62,bw*f,5);q.strokeStyle='#fff6';q.strokeRect(x-bw/2,y-h*.62,bw,5)}});
    q.save();q.lineCap='round';G.bm.forEach(b=>{q.globalAlpha=Math.min(1,b.t*7);q.strokeStyle=b.col;q.shadowColor=b.col;q.shadowBlur=8;q.lineWidth=Math.max(1.5,(b.w||2)*sc/12);q.beginPath();q.moveTo(X(b.x1),Y(b.y1));q.lineTo(X(b.x2),Y(b.y2));q.stroke()});q.restore();
    G.pr.forEach(p=>{q.fillStyle=p.col;q.shadowColor=p.col;q.shadowBlur=6;q.beginPath();q.arc(X(p.x),Y(p.y),Math.max(2,sc*.1),0,7);q.fill();q.shadowBlur=0});
    G.fx.forEach(f=>{const a=Math.max(0,f.t/f.max),gx=X(f.x),gy=Y(f.y);
      if(f.ex){const im=dfExImg();if(im){const p=1-a,sz=f.r*sc*2*(.35+.85*Math.sqrt(p));q.save();q.globalCompositeOperation='lighter';q.globalAlpha=Math.min(1,a*1.6);q.translate(gx,gy);q.rotate((f.rot||0)+p*.4);q.drawImage(im,-sz/2,-sz/2,sz,sz);q.restore()}return}
      const r=Math.max(2,f.r*sc*(1.1-a*.5)),gg=q.createRadialGradient(gx,gy,0,gx,gy,r);gg.addColorStop(0,(f.col||'#fff')+'cc');gg.addColorStop(1,(f.col||'#fff')+'00');q.save();q.globalAlpha=a*.9;q.fillStyle=gg;q.beginPath();q.arc(gx,gy,r,0,7);q.fill();q.restore()});
    if(sc0.over)sc0.over(q,G,c,X,Y,sc)};
  let last=performance.now();
  const loop=now=>{if(cur!==S1)return;if(!document.body.contains(cv)||$('hqu').style.display==='none'){stop();return}
    const dt=Math.min(.05,(now-last)/1000)*S1.speed;last=now;let tt=dt;while(tt>0){const h=Math.min(.02,tt);step(h);tt-=h}draw();S1.raf=requestAnimationFrame(loop)};
  sec.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.a==='f')build();else{S1.speed=S1.speed===1?.5:1;b.textContent=S1.speed===1?'Chậm ×0.5':'Bình thường ×1'}};
  S1.raf=requestAnimationFrame(loop)}
window.C16PV={mount,stop,state:()=>cur&&cur.G,scene:()=>cur&&cur.c};
{const _u=uRender;uRender=function(){_u.apply(this,arguments);try{mount()}catch(e){console.error(e)}}}
})();
