/* ===== c42: sức mạnh 10 thảm Tối thượng (Thần Long, Mặt Trời, Cổng Địa Ngục, Thiên Hà, Thần Thụ, Thời Không, Kraken, Thiên Giới Môn, Hỗn Độn, Ngai Vàng) · hiệu ứng 3D ở c33 (skill3d18) ===== */
(function(){
if(!window.C40||!window.C39)return;
const C39=window.C39,X=C40.X,H=C40.H,{enemies,allies,blds,hurt,hurtPct,pop,vis,unit,inR,shield,addHP,heal,BK,DBk,rnd,roll,dist,isAlly}=H;
const DB=()=>DBk(),PI2=Math.PI*2;
const scn=(S,sx,sy)=>C39.fromScene(S.Rg,sx,sy),kk=S=>C39.toScene(S.Rg,S.cx,S.cy)[2];
const nearB=(G,S,x,y,ex)=>{let b=null,bd=1e9;const L=blds(G,S.Rg).filter(q=>!q.c39tmp&&q!==ex),nw=L.filter(q=>q.t!=='wall');(nw.length?nw:L).forEach(q=>{const d=Math.hypot(q.x-x,q.y-y);if(d<bd){bd=d;b=q}});return b};
const ccE=(e,d,f)=>{d*=BK(e);(f||['stun','noFire']).forEach(k=>e[k]=Math.max(e[k]||0,d))};
const slowE=(e,k,t)=>{e.slowK=Math.min(e.slowK==null?1:e.slowK,k);e.slowT=Math.max(e.slowT||0,t||.12)};
const kill=(G,e)=>{try{dfDmgS(e,e.hp+1e7)}catch(x){}};
const dot=(G,e,total,sec)=>{(e.c40dot=e.c40dot||[]).push({dps:total/sec*(G.dmM||1),until:G.t+sec})};
const isBoss=u=>u&&(u.boss||(u.sh&&u.sh.bk)||u.c18boss);

/* ================= 40 · Thần Long Thăng Thiên ================= */
function spawnLong(G,S){const R=Math.max(S.Rg.x1-S.Rg.x0,S.Rg.y1-S.Rg.y0)/2+3;S.dr.u=unit(G,S,{k:'tlong',x:S.cx+R,y:S.cy,hp:5000,size:3,hr:1.4,h:9,taunt:0,st:'orb',a:0,cd:2.5,tr:[]});pop(G,S.cx,S.cy-3,'Thần long thăng thiên!','#ffd36a')}
X.init[40]=(G,S)=>{S.dr={u:null,rs:0};spawnLong(G,S)};
X.step[40]=(G,S,dt,E,Rg)=>{const D=S.dr,u=D.u;if(!u||u.dead){if(u&&u.dead&&!D.cool){D.cool=1;D.rs=100;pop(G,u.x,u.y-2,'Thần long ngã xuống · hồi sinh sau 100 giây','#ffb070')}if(D.cool){D.rs-=dt;if(D.rs<=0){D.cool=0;spawnLong(G,S)}}return}
  const R=Math.max(Rg.x1-Rg.x0,Rg.y1-Rg.y0)/2+3;u.a+=dt*.45;
  const ox=S.cx+Math.cos(u.a)*R,oy=S.cy+Math.sin(u.a)*R,mv=(tx,ty,sp)=>{const dx=tx-u.x,dy=ty-u.y,l=Math.hypot(dx,dy);if(l>.01){const s=Math.min(l,sp*dt);u.x+=dx/l*s;u.y+=dy/l*s;u.ang=Math.atan2(dy,dx)}return l};
  if(u.st==='orb'){mv(ox,oy,12);u.h+=(9-u.h)*Math.min(1,dt*2);u.cd-=dt;if(u.cd<=0){const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(tg){u.st='dive';u.tg=tg}else u.cd=.5}}
  else if(u.st==='dive'){const t=u.tg;if(!t||t.dead){u.st='rise';u.rt=1.2;return}const l=mv(t.x,t.y,16);u.h=Math.max(1.4,Math.min(u.h,1.4+l*.9));
    if(l<=(t.size||2)*.5+1){hurt(G,t,100);const dx=t.x-u.x,dy=t.y-u.y,q=Math.hypot(dx,dy)||1,p=isBoss(t)?.35:1;t.x+=dx/q*p;t.y+=dy/q*p;vis(G,{k:'boom',x:t.x,y:t.y,h:.6,max:.5,c:'#ffd36a'});u.st='rise';u.rt=1.2}}
  else{u.rt-=dt;mv(ox,oy,10);u.h+=(9-u.h)*Math.min(1,dt*1.5);if(u.rt<=0){u.st='orb';u.cd=2.5}}};

/* ================= 41 · Mặt Trời Vĩnh Hằng ================= */
X.step[41]=(G,S,dt,E)=>{E.forEach(e=>{if(e.c42cg>G.t||e.c42im>G.t)return;if(roll(.25,dt)){const d=2*BK(e);ccE(e,2);e.c42cg=G.t+d;e.c42im=G.t+d+2;dot(G,e,500,2);vis(G,{k:'cage',e,x:e.x,y:e.y,max:d})}})};
const antiDeath=(G,S,u,isB)=>{if(!isB||!G.bl.includes(u)||u.c42adc>G.t)return false;u.hp=Math.max(u.hp,u.max*.01);u.c42ad=G.t+1;u.c42adc=G.t+20;vis(G,{k:'sunsh',b:u,x:u.x,y:u.y,max:1});pop(G,u.x,u.y-1.6,'Chống kết liễu 1 giây','#ffd36a');return true};
X.lethal[41]=antiDeath;X.dmgB[41]=(G,S,b,d)=>b.c42ad>G.t?0:d;

/* ================= 42 · Cổng Địa Ngục ================= */
X.step[42]=(G,S,dt,E,Rg)=>{E.forEach(e=>{if(e.hp>0&&e.hp<e.max*.15&&!e.c42sk){e.c42sk=1;vis(G,{k:'suck',x0:e.x,y0:e.y,x:S.cx,y:S.cy,sh:e.sh,max:.9});kill(G,e);pop(G,e.x,e.y-1.5,'Bị cổng địa ngục nuốt','#ff6a4a')}});
  if(S.cnt>=50&&!S.wave){S.cnt-=50;S.wave=vis(G,{k:'wave',x:S.cx,y:S.cy,r:0,R:17,max:1.9,hit:new Set(),up(G,S2,dt){this.r=Math.min(this.R,this.t*10);enemies(G,null).forEach(e=>{const dx=e.x-this.x,dy=e.y-this.y,d=Math.hypot(dx,dy)||.01;if(d>this.r)return;if(!this.hit.has(e)){this.hit.add(e);hurt(G,e,200)}if(this.r<this.R){const p=isBoss(e)?.35:1,nd=d+(this.r-d)*p;e.x=this.x+dx/d*nd;e.y=this.y+dy/d*nd}});if(this.t>=this.max-.02)S.wave=null}});pop(G,S.cx,S.cy-3,'Sóng địa ngục!','#ff6a4a')}};
X.death[42]=(G,S,u,isB,ins)=>{if(!isB&&ins)S.cnt++};

/* ================= 43 · Thiên Hà Sáng Thế ================= */
const PL=[{n:'Hành tinh dung nham',c:'#ff6a2a',f:(G,e)=>dot(G,e,300,5)},{n:'Hành tinh băng',c:'#9fe0ff',f:(G,e)=>{ccE(e,1.5,['stun','noFire','iceT']);slowE(e,.6,3)}},{n:'Hành tinh sấm',c:'#c7a0ff',f:(G,e)=>ccE(e,1)},{n:'Hành tinh độc',c:'#7aff7a',f:(G,e)=>{dot(G,e,200,5);slowE(e,.7,3)}},{n:'Hành tinh vành đai',c:'#e8c070',f:(G,e)=>ccE(e,1.5,['silT','noFire'])}];
X.step[43]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a<12)return;S.a=0;const T=enemies(G,Rg,3),tg=T.length?T[Math.floor(Math.random()*T.length)]:null,P=PL[Math.floor(Math.random()*PL.length)],x=tg?tg.x:rnd(Rg.x0,Rg.x1),y=tg?tg.y:rnd(Rg.y0,Rg.y1);
  pop(G,x,y-3,P.n+' xuất hiện','#ffe8a0');
  vis(G,{k:'planet',x,y,P,tg,max:6,up(G,S2,dt){if(this.t<5&&this.tg&&!this.tg.dead){this.x+=(this.tg.x-this.x)*Math.min(1,dt*.8);this.y+=(this.tg.y-this.y)*Math.min(1,dt*.8)}
    if(!this.hit&&this.t>=5.9){this.hit=1;const cx=this.x,cy=this.y;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-cx,e.y-cy)<=2.5+(e.size||2)*.3){hurt(G,e,500);try{this.P.f(G,e)}catch(x){}}});vis(G,{k:'boom',x:cx,y:cy,h:.5,max:1,c:this.P.c});
      const hitS=[];for(let i=0;i<50;i++)hitS.push({a:i/50*PI2+rnd(-.05,.05),done:new Set()});vis(G,{k:'pshard',x:cx,y:cy,c:this.P.c,sh:hitS,max:.6,up(G,S3,dt){const r=2.5+4*Math.min(1,this.t/.5);this.sh.forEach(s=>{const sx=this.x+Math.cos(s.a)*r,sy=this.y+Math.sin(s.a)*r;enemies(G,null).forEach(e=>{if(s.done.has(e))return;if(Math.hypot(e.x-sx,e.y-sy)<=(e.size||2)*.4+.3){s.done.add(e);hurt(G,e,50)}})})}})}}})};

/* ================= 44 · Thần Thụ Thế Giới ================= */
X.init[44]=(G,S)=>{const L=C39.epicLive(44),st=L.st,c=scn(S,165,95),k=kk(S);let cb=null,bd=1e9;const LB=blds(G,S.Rg).filter(b=>!b.c39tmp),NW=LB.filter(b=>b.t!=='wall');(NW.length?NW:LB).forEach(b=>{const d=Math.hypot((b.x-c[0])/(38*k),(b.y-c[1])/(32*k));if(d<bd){bd=d;cb=b}});S.cb=cb;S.tc={x:c[0],y:c[1]};
  const RP=(st.rt||[]).map(pts=>pts.map(p=>scn(S,p[0],p[1])));S.roots=RP;S.rb=blds(G,S.Rg).filter(b=>b!==cb&&!b.c39tmp&&RP.some(pts=>pts.some(p=>Math.abs(p[0]-b.x)<=b.w/2+.5&&Math.abs(p[1]-b.y)<=b.h/2+.5)));
  S.rb.forEach(b=>{addHP(b,b.max*.1*DB(),1)});if(cb)pop(G,cb.x,cb.y-2,'Thần thụ liên kết '+S.rb.length+' công trình nhánh rễ','#9affd0');S.hit=new Map();S.ad=0;S.uidN=0};
X.step[44]=(G,S,dt,E,Rg)=>{const cb=S.cb,rb=S.rb.filter(b=>b.hp>0),m=1+.1*rb.length;
  if(cb&&cb.hp>0){heal(cb,200/DB()*m*dt);S.a+=dt;if(S.a>=1){S.a-=1;const cap=3000/DB(),cur=(cb.shd&&cb.shd.t>0&&cb.shd.v)||0;if(cur<cap)shield(cb,Math.min(cap-cur,100/DB()*m))}}
  S.b+=dt;if(S.b>=3){S.b-=3;rb.forEach(b=>heal(b,b.max*.02))}
  /* tinh linh (đom đóm) và lá vàng trong cảnh thảm */
  S.c=(S.c||0)+dt;if(S.c>=.25){S.c=0;const st=C39.epicLive(44).st,t=performance.now()/1000,A=allies(G,Rg,1),W=330,Hh=200;
    const chk=(id,sx,sy,v,col)=>{const w=scn(S,sx,sy);A.forEach(u=>{if(Math.hypot(u.x-w[0],u.y-w[1])>(u.size||2)*.45+.8)return;const key=id+'|'+(u.c42id||(u.c42id=++S.uidN)),last=S.hit.get(key)||-9;if(G.t-last<1.5)return;S.hit.set(key,G.t);if(u.hp<u.max){heal(u,v);vis(G,{k:'ring',x:w[0],y:w[1],c:col,max:.5})}})};
    (st.ff||[]).forEach((p,i)=>chk('f'+i,p.x+Math.sin(t*p.s*2+p.o*9)*15,p.y+Math.cos(t*p.s*2.4+p.o*7)*10,5,'#dfff8a'));
    (st.lv||[]).forEach((p,i)=>{const k=(t*p.s*.4+p.o)%1,x=((p.x+k*20+Math.sin(t*1.5+p.o*10)*14)%W+W)%W,y=-8+k*(Hh+16);chk('l'+i,x,y,10,'#ffd36a')})}
  if(S.ad>=10){S.ad-=10;let x,y,ok=false;for(let i=0;i<40&&!ok;i++){x=rnd(Rg.x0+1,Rg.x1-1);y=rnd(Rg.y0+1,Rg.y1-1);ok=!(G.bl||[]).some(b=>b.hp>0&&Math.abs(b.x-x)<b.w/2+1&&Math.abs(b.y-y)<b.h/2+1)}if(!ok){x=Rg.x0-1.5;y=S.cy}
    unit(G,S,{k:'golem',x,y,hp:700,size:2.2,hr:1.1,taunt:0,cd:1,h:0});pop(G,x,y-2.5,'Người đá thức tỉnh!','#c9b48a')}
  S.u.forEach(u=>{if(u.k!=='golem'||u.dead)return;const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];u.cd-=dt;u.sw=Math.max(0,(u.sw||0)-dt);if(!tg)return;const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1;u.ang=Math.atan2(dy,dx);
    if(l>2){u.x+=dx/l*Math.min(l-2,2.2*dt);u.y+=dy/l*Math.min(l-2,2.2*dt);u.walk=(u.walk||0)+dt}
    if(l<=2.6&&u.cd<=0){u.cd=4;u.sw=.6;const ax=u.x+dx/l*1.4,ay=u.y+dy/l*1.4;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-ax,e.y-ay)<=3+(e.size||2)*.3)hurt(G,e,200)});vis(G,{k:'slam',x:ax,y:ay,max:.7})}})};
X.death[44]=(G,S,u,isB,ins)=>{if(ins&&(isB||isAlly(G,u)))S.ad++};

/* ================= 45 · Thời Không Đồng Hồ ================= */
X.init[45]=(G,S)=>{const st=C39.epicLive(45).st,k=kk(S);S.gears=(st.gr||[]).map(g=>{const w=scn(S,g.x,g.y),sz=g.R>=24?'L':g.R<=16?'S':'M';return {x:w[0],y:w[1],r:(g.R+4)*k,sp:g.sp,R:g.R,sz,hp:sz==='L'?400:sz==='M'?300:200}});S.cdp=new WeakMap()};
X.step[45]=(G,S,dt,E,Rg)=>{blds(G,Rg).forEach(b=>{const g=S.gears.find(g=>Math.hypot(b.x-g.x,b.y-g.y)<=g.r);if(g){heal(b,g.hp/DB()*dt);b.c42g=g}else b.c42g=null});
  [G.pl].concat(G.al||[]).forEach(u=>{if(!u||!u.sk)return;u.sk.forEach(k=>{const p=S.cdp.get(k);if(p!=null&&k.cd>p+1){k.cd=Math.max(1,k.cd-25);vis(G,{k:'ring',x:u.x,y:u.y,c:'#7ab8ff',max:.6})}S.cdp.set(k,k.cd)})})};
window.c40RS=u=>{const G=DG,S=G&&G.c40;if(!S||S.K!==45||!u||u.team==='e'||(G.en||[]).includes(u))return 0;return isBoss(u)?10:5};

/* kỹ năng phe ta: Cổng Địa Ngục phóng to hố đen / kỹ năng lan, kéo dài hố đen & cổng dịch chuyển; Thời Không kéo dài kỹ năng từ 6 giây trở lên */
function skArrs(G){const A=[];if(G.csk)Object.values(G.csk).forEach(v=>{if(Array.isArray(v))A.push(v)});if(G.c34&&G.c34.u)A.push(G.c34.u);if(G.c26fx)A.push(G.c26fx);if(G.c34&&G.c34.fx)A.push(G.c34.fx);return A}
if(window.CSK&&CSK.cast){const _k=CSK.cast;CSK.cast=function(P,k){const G=DG,S=G&&G.c40;if(!S||(S.K!==42&&S.K!==45)||!P||P.team==='e'||(G.en||[]).includes(P))return _k.apply(this,arguments);
  const before=new Map();skArrs(G).forEach(a=>before.set(a,new Set(a)));const r=_k.apply(this,arguments);
  try{const nm=((k&&k.m&&k.m.n)||(k&&k.cap&&k.cap[0])||'')+' '+((k&&k.cap&&k.cap[5])||''),bh=/hố đen|hút/i.test(nm),pt=/dịch chuyển|cổng/i.test(nm),sp=/lan/i.test(nm);let n=0;
    skArrs(G).forEach(a=>{const old=before.get(a)||new Set();a.forEach(o=>{if(!o||typeof o!=='object'||old.has(o))return;n++;
      if(S.K===42){if(bh||sp){['R','r','rad'].forEach(f=>{if(typeof o[f]==='number')o[f]*=1.5})}if(bh||pt){['t','max','life','dur'].forEach(f=>{if(typeof o[f]==='number'&&o[f]>0)o[f]+=5})}}
      else{['t','life','dur'].forEach(f=>{if(typeof o[f]==='number'&&o[f]>=6){o[f]+=3;if(typeof o.max==='number')o.max+=3}})}})});
    if(n&&S.K===42&&(bh||sp||pt))pop(G,P.x,P.y-1.8,'Cổng địa ngục cường hóa kỹ năng','#ff8a6a');if(n&&S.K===45)pop(G,P.x,P.y-1.8,'Thời không kéo dài kỹ năng','#9fd0ff')}catch(e){console.error(e)}return r}}

/* ================= 46 · Xoáy Nước Kraken ================= */
X.init[46]=(G,S)=>{S.kcd=0;S.kr=null};
function krakenUp(G,S){const b=unit(G,S,{k:'kraken',x:S.cx,y:S.cy,hp:4000,size:4,hr:2,taunt:0,life:40,h:0});b.tn=[];for(let i=0;i<8;i++){const a=i/8*PI2,t=unit(G,S,{k:'tent',x:S.cx+Math.cos(a)*3.6,y:S.cy+Math.sin(a)*3.6,a,hp:500,size:1.2,hr:.7,taunt:0,cd:1+i*.35,body:b,h:0});b.tn.push(t)}S.kr=b;pop(G,S.cx,S.cy-3.5,'KRAKEN trồi lên!','#7ad8ff')}
X.step[46]=(G,S,dt,E,Rg)=>{S.kcd=Math.max(0,S.kcd-dt);
  E.forEach(e=>{if(e.c42wh>G.t){const dx=S.cx-e.x,dy=S.cy-e.y,l=Math.hypot(dx,dy)||1,p=isBoss(e)?.35:1;e.x+=(dx/l*1.2-dy/l*1.6)*dt*p;e.y+=(dy/l*1.2+dx/l*1.6)*dt*p;slowE(e,.5)}
    else if(!(e.c42wi>G.t)&&roll(.25,dt)){e.c42wh=G.t+1;e.c42wi=G.t+3;vis(G,{k:'whirl',e,x:e.x,y:e.y,max:1})}
    if(e.hp>0&&e.hp<e.max*.18&&!e.dead){vis(G,{k:'tent1',x0:S.cx,y0:S.cy,x:e.x,y:e.y,max:.7});kill(G,e);S.cnt++;pop(G,e.x,e.y-1.5,'Xúc tu nuốt chửng ('+(S.cnt%30)+'/30)','#7ad8ff')}});
  const K=S.kr;if(K&&!K.dead){K.life-=dt;if(K.life<=0){K.dead=true;K.tn.forEach(t=>t.dead=true);pop(G,K.x,K.y-3,'Kraken lặn xuống','#7ad8ff')}else K.tn.forEach(t=>{if(t.dead)return;t.cd-=dt;t.sw=Math.max(0,(t.sw||0)-dt);if(t.cd>0)return;const tg=enemies(G,null).sort((a,b)=>dist(a,t)-dist(b,t))[0];if(!tg)return;t.cd=3;t.sw=.5;t.tg=tg;t.tx=tg.x;t.ty=tg.y;
      if(tg.hp<tg.max*.15){kill(G,tg);K.max+=200;K.hp+=200;vis(G,{k:'tent1',x0:t.x,y0:t.y,x:tg.x,y:tg.y,max:.7});pop(G,tg.x,tg.y-1.5,'Kraken nuốt xác · +200 máu tối đa','#7ad8ff')}
      else{hurt(G,tg,400);if(Math.random()<.25)ccE(tg,1);vis(G,{k:'boom',x:tg.x,y:tg.y,h:.3,max:.4,c:'#7ad8ff'})}})}
  if(K&&K.dead){K.tn.forEach(t=>t.dead=true);S.kr=null;S.kcd=80}
  if(!S.kr&&S.kcd<=0&&S.cnt>=30){S.cnt-=30;krakenUp(G,S)}};

/* ================= 47 · Thiên Giới Môn ================= */
X.init[47]=(G,S)=>{S.ad=0};
X.lethal[47]=(G,S,u,isB)=>{if(isB?!G.bl.includes(u):!isAlly(G,u))return false;if(!inR(S.Rg,u,isB?0:2)||Math.random()>=.25)return false;u.hp=u.max*.5;u.hit=.2;if(u===G.pl){u.dead=false;G.respawn=0}vis(G,{k:'ring',x:u.x,y:u.y,c:'#fff3c0',max:.8});pop(G,u.x,u.y-1.6,'Thiên giới hồi sinh!','#fff3c0');return true};
X.death[47]=(G,S,u,isB,ins)=>{if(ins&&(isB||isAlly(G,u)))S.ad++};
function angExp(G,S,u){const n=u.c42st.n;u.c42st.n=0;if(n<=0)return;const d=3000*(1-.05*(15-n));enemies(G,null).forEach(e=>{if(Math.hypot(e.x-u.x,e.y-u.y)<=3+(e.size||2)*.3)hurt(G,e,d)});vis(G,{k:'boom',x:u.x,y:u.y,h:.8,max:.9,c:'#fff3c0'});pop(G,u.x,u.y-2,'Giáp thiên thần nổ · '+Math.round(d).toLocaleString('vi-VN'),'#fff3c0')}
X.step[47]=(G,S,dt,E,Rg)=>{if(S.ad>=40&&!S.u.some(u=>u.k==='angel'&&!u.dead)){S.ad-=40;unit(G,S,{k:'angel',x:S.cx,y:S.cy,hp:2000,size:2.4,hr:1.2,taunt:0,cd:1,h:5,dl:1.2});pop(G,S.cx,S.cy-3,'Thiên thần giáng thế!','#fff3c0')}
  S.u.forEach(a=>{if(a.k!=='angel'||a.dead)return;a.dl=Math.max(0,(a.dl||0)-dt);a.cd-=dt;if(a.cd>0)return;a.cd=3;const L=allies(G,Rg,2).concat(blds(G,Rg).filter(b=>!b.c39tmp)).sort((p,q)=>p.hp/p.max-q.hp/q.max).slice(0,2);
    L.forEach(u=>{const isB=G.bl.includes(u);u.c42st=u.c42st||{n:0};shield(u,isB?300/DB():300);u.c42st.n++;u.c42st.sv=(u.shd&&u.shd.v)||0;vis(G,{k:'abeam',a,u,x:u.x,y:u.y,max:.6});if(u.c42st.n>=15)angExp(G,S,u)})});
  /* giáp vỡ → nổ theo số cộng dồn */
  allies(G,null).concat(G.bl||[]).forEach(u=>{const s=u&&u.c42st;if(!s||s.n<=0)return;const v=(u.shd&&u.shd.t>0&&u.shd.v)||0;if(v<=1e-6||u.dead||u.hp<=0)angExp(G,S,u)})};

/* ================= 48 · Hỗn Độn Nguyên Tố ================= */
X.init[48]=(G,S)=>{const c=scn(S,165,100);S.ec={x:c[0],y:c[1]};S.cb=nearB(G,S,c[0],c[1]);S.bt=new WeakMap();
  const cb=S.cb;if(cb){addHP(cb,2000,1);shield(cb,700/DB());pop(G,cb.x,cb.y-2,'Tâm hỗn độn · +2.000 máu +700 giáp','#ffd36a')}
  blds(G,S.Rg).forEach(b=>{if(b!==cb&&!b.c39tmp&&elem(S,b)===2)addHP(b,500,1)})};
function elem(S,u){const q=C39.toScene(S.Rg,u.x,u.y);let a=Math.atan2(q[1]-100,q[0]-165);if(a<0)a+=PI2;return Math.floor(a/(Math.PI/2))%4}/* 0 hỏa · 1 nước · 2 đất · 3 băng */
X.step[48]=(G,S,dt,E,Rg)=>{const cb=S.cb;S.a+=dt;S.b+=dt;
  blds(G,Rg).forEach(b=>{if(b.c39tmp)return;if(b===cb){heal(b,b.max*.04*dt);return}const el=elem(S,b);if(el===2)heal(b,b.max*.01*dt)});
  if(S.b>=2){S.b-=2;blds(G,Rg).forEach(b=>{if(b!==cb&&elem(S,b)===1){const cap=2000/DB(),cur=(b.shd&&b.shd.t>0&&b.shd.v)||0;if(cur<cap)shield(b,Math.min(cap-cur,200/DB()))}})}
  allies(G,Rg,0).forEach(u=>{if(elem(S,u)===1&&u.nrgMax>0)u.nrg=Math.min(u.nrgMax,(u.nrg||0)+10*dt)});
  const x0=S.ec.x,y0=S.ec.y;
  E.forEach(e=>{const el=elem(S,e);if(el===0){hurtPct(G,e,.02*dt);if(e.hp>0&&e.hp<e.max*.05){kill(G,e);pop(G,e.x,e.y-1.5,'Thiêu rụi','#ff7a2a')}}
    else if(el===3){slowE(e,.8);if(roll(.1,dt)){ccE(e,1,['stun','noFire','iceT']);hurt(G,e,50);vis(G,{k:'ice',e,x:e.x,y:e.y,max:BK(e)})}}
    const onL=(Math.abs(e.y-y0)<=.6+(e.size||2)*.25)||(Math.abs(e.x-x0)<=.6+(e.size||2)*.25);if(onL&&G.t-(S.bt.get(e)||-9)>=1){S.bt.set(e,G.t);hurt(G,e,200);vis(G,{k:'ring',x:e.x,y:e.y,c:'#ffffff',max:.4})}})};
/* ================= 49 · Ngai Vàng Vũ Trụ ================= */
X.init[49]=(G,S)=>{const c=scn(S,165,95);S.tb=nearB(G,S,c[0],c[1]);const b=S.tb;if(b){addHP(b,3000,1);shield(b,500/DB());pop(G,b.x,b.y-2,'Ngai vàng · +3.000 máu +500 giáp','#ffd36a')}};
X.step[49]=()=>{};
X.death[49]=(G,S,u,isB,ins)=>{const b=S.tb;if(!isB&&ins&&b&&b.hp>0&&(G.en||[]).includes(u)){heal(b,b.max*.03);vis(G,{k:'ring',x:b.x,y:b.y,c:'#ffd36a',max:.5})}};
X.dmgB[49]=(G,S,b,d)=>{if(b!==S.tb)return d;const other=(G.bl||[]).some(q=>q!==b&&q.hp>0&&q.t!=='mine'&&!q.c39tmp);if(other){b.c42iv=G.t+.3;return 0}return d};
/* đòn đánh của công trình trung tâm (Hỗn Độn) / công trình trên ngai (Ngai Vàng) */
function onShot(G,b,tg){const S=G&&G.c40;if(!S||!tg||tg.dead)return;
  if(S.K===48&&b===S.cb){dot(G,tg,tg.max*.05*BK(tg)+300,5);if(tg.hp<tg.max*.12){kill(G,tg);pop(G,tg.x,tg.y-1.5,'Kết liễu nguyên tố','#ffb02e')}vis(G,{k:'ring',x:tg.x,y:tg.y,c:'#ff7a2a',max:.4})}
  if(S.K===49&&b===S.tb){hurt(G,tg,2000);if(Math.random()<.25){ccE(tg,1);ccE(tg,1.5,['silT']);slowE(tg,.6,2);pop(G,tg.x,tg.y-1.5,'Nguyên tố vũ trụ: 3 khống chế','#c7a0ff')}vis(G,{k:'orbhit',x0:b.x,y0:b.y,x:tg.x,y:tg.y,max:.4})}}
C40.onShot=onShot;
if(typeof dfFire==='function'){const _F=dfFire;dfFire=function(src,wp,tg,team){const r=_F.apply(this,arguments);try{const G=DG,S=G&&G.c40;if(S&&(S.K===48||S.K===49)&&team!=='e'&&src&&!src.o&&tg){const b=(G.bl||[]).find(q=>q.x===src.x&&q.y===src.y);if(b)onShot(G,b,tg)}}catch(e){console.error(e)}return r}}
})();
