/* ===== c46: sức mạnh 11 thảm Tối thượng bổ sung (Bão cát → Holi) + địch ưu tiên đánh đơn vị do thảm triệu hồi ===== */
(function(){
if(!window.C40||!window.C39)return;
const X=C40.X,{enemies,allies,blds,hurt,hurtPct,pop,vis,unit,inR,shield,addHP,heal,BK,DBk,rnd,dist,isAlly}=C40.H;
const DB=()=>DBk(),isBoss=u=>u&&(u.boss||(u.sh&&u.sh.bk)||u.c18boss),kill=(G,e)=>{try{dfDmgS(e,e.hp+1e7)}catch(x){}};
const sim=G=>!!(G.pv||G.c39sim||G.c18sim||G.tut),SV=()=>(typeof S!=='undefined'&&S&&S.da!=null)?S:window.S;
const giveSao=(G,n)=>{if(sim(G))return;try{const s=SV();s.sao=(s.sao||0)+n;save();refresh()}catch(e){}};
const KS=[2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024];
const live=(S,k)=>S.u.filter(u=>u.k===k&&!u.dead);
function spot(G,S,m){const Rg=S.Rg;m=m||0;for(let i=0;i<40;i++){const x=rnd(Rg.x0+.8-m,Rg.x1-.8+m),y=rnd(Rg.y0+.8-m,Rg.y1-.8+m);if(!(G.bl||[]).some(b=>b.hp>0&&Math.abs(b.x-x)<b.w/2+.7&&Math.abs(b.y-y)<b.h/2+.7)&&!S.u.some(u=>!u.dead&&Math.hypot(u.x-x,u.y-y)<1))return [x,y]}return [Rg.x0-1.5,rnd(Rg.y0,Rg.y1)]}
/* chiến binh triệu hồi: đi tới kẻ địch gần nhất trong vùng, đánh trong tầm */
function fight(G,S,u,dt,o){u.sw=Math.max(0,(u.sw||0)-dt);u.cd=(u.cd||0)-dt;if(u.life!=null){u.life-=dt;if(u.life<=0){u.dead=true;return}}
  const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(!tg){u.mv=0;return null}const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1,reach=o.range+(tg.size||2)*.3;u.ang=Math.atan2(dy,dx);
  if(l>reach-.3&&o.speed){const s=Math.min(l-reach+.3,o.speed*dt);u.x+=dx/l*s;u.y+=dy/l*s;u.mv=1;u.walk=(u.walk||0)+dt}else u.mv=0;
  if(l<=reach&&u.cd<=0){u.cd=o.cd;u.sw=Math.min(.5,o.cd*.4);u.tx=tg.x;u.ty=tg.y;if(o.aoe){enemies(G,null).forEach(e=>{if(Math.hypot(e.x-tg.x,e.y-tg.y)<=o.aoe+(e.size||2)*.3)hurt(G,e,o.dmg)})}else hurt(G,tg,o.dmg);if(o.hit)o.hit(tg);return tg}return null}

/* địch ưu tiên tấn công đơn vị do thảm triệu hồi (đơn vị khiêu khích kéo địch trong bán kính riêng) */
function instT(){if(window.c14Taunt&&window.c14Taunt.c46)return;const _T=window.c14Taunt;const f=function(e,w){const r=_T?_T.apply(this,arguments):null;try{const G=DG,S=G&&G.c40;if(!S||!S.u||!S.u.length||!e||e.team!=='e'&&!(G.en||[]).includes(e))return r;let b=null,bd=1e9;
  for(const u of S.u){if(u.dead||u.noT)continue;const d=Math.hypot(e.x-u.x,e.y-u.y),lim=w?(w.rng+(u.size||1)*.4):14;if(u.prov&&d<=u.prov){if(d-100<bd){bd=d-100;b=u}continue}if(d<=lim&&d<bd){bd=d;b=u}}return b||r}catch(x){return r}};f.c46=1;window.c14Taunt=f}
instT();setInterval(instT,500);

/* máu công trình bị mất (máu hiển thị) + sát thương phe ta gây ra (Hội An) + lần đầu trụ sở trúng đòn (Cầu Vàng) */
{const _B=dfDmgB;dfDmgB=function(b,d){const G=DG,S=G&&G.c40,h0=b&&b.hp;if(S&&S.K===2009&&b&&(b.t==='hq'||b.hq)&&!S.hqHit&&b.hp>0&&d>0&&G.bl.includes(b)){S.hqHit=1;addHP(b,500,1);b.c46g=G.t+4;shield(b,4000/DB());b.shd.t=15;b.c46gs=1;vis(G,{k:'ring',x:b.x,y:b.y,c:'#ffd36a',max:.8});pop(G,b.x,b.y-2.4,'Trụ sở mạ vàng · khiên 4.000','#ffd36a')}
  const r=_B.apply(this,arguments);try{if(S&&KS.includes(S.K)&&b&&G.bl.includes(b)&&!b.c39tmp&&h0>b.hp)S.lost=(S.lost||0)+(h0-Math.max(0,b.hp))*DB()}catch(e){}return r}}
{const _D=dfDmgS;dfDmgS=function(s,d,f){const G=DG,S=G&&G.c40,h0=s&&s.hp;const r=_D.apply(this,arguments);try{if(S&&(S.K===2010||S.K===2016)&&s&&(G.en||[]).includes(s)&&h0>s.hp)S.dealt=(S.dealt||0)+(h0-Math.max(0,s.hp))}catch(e){}return r}}
/* mỗi khung: trừ máu tạm thời Cầu Vàng */
const tickGold=(G,S)=>{(G.bl||[]).forEach(b=>{if(b.c46g&&G.t>=b.c46g){b.c46g=0;b.max=Math.max(1,b.max-500/DB());b.hp=Math.min(b.hp,b.max)}})};
const every=(S,key,step,f)=>{S[key]=S[key]||0;while((S.lost||0)-S[key]>=step){S[key]+=step;f()}};
const isShip=(G,u,isB)=>!isB&&((G.en||[]).includes(u)||isAlly(G,u));

/* ================= 2004 · Bão cát sa mạc ================= */
X.step[2004]=(G,S,dt,E,Rg)=>{every(S,'u200',200,()=>{if(S.vis.filter(v=>v.k==='sand').length>=6)return;const p=[rnd(Rg.x0,Rg.x1),rnd(Rg.y0,Rg.y1)];vis(G,{k:'sand',x:p[0],y:p[1],a:Math.random()*6,tk:0,max:4,up(G,S2,dt){this.a+=dt*.6;this.x+=Math.cos(this.a)*1.6*dt;this.y+=Math.sin(this.a)*1.6*dt;this.tk+=dt;if(this.tk>=1){this.tk-=1;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-this.x,e.y-this.y)<=2.6+(e.size||2)*.3){hurt(G,e,20);if(Math.random()<.03){const d=BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);e.c39sand=G.t+d;vis(G,{k:'ring',x:e.x,y:e.y,c:'#d9b26f',max:.6})}}})}}})});
  every(S,'u1500',1500,()=>{if(live(S,'camel').length>=6)return;const p=spot(G,S);unit(G,S,{k:'camel',x:p[0],y:p[1],hp:300,size:1.6,hr:.8,prov:4,cd:.5,h:0,born:G.t});pop(G,p[0],p[1]-2,'Lạc đà sa mạc!','#e8c890')});
  live(S,'camel').forEach(u=>fight(G,S,u,dt,{range:3,dmg:40,cd:1.5,speed:2}))};

/* ================= 2005 · Cực quang vịnh hẹp ================= */
X.step[2005]=(G,S,dt,E,Rg)=>{every(S,'u500',500,()=>{const a=S.vis.find(v=>v.k==='aurora');if(a){a.max+=4;return}vis(G,{k:'aurora',x:S.cx,y:S.cy,tk:0,max:4,up(G,S2,dt){this.tk+=dt;if(this.tk<1)return;this.tk-=1;
    enemies(G,Rg,4).forEach(e=>{const ins=e.x>Rg.x0+1&&e.x<Rg.x1-1&&e.y>Rg.y0+1&&e.y<Rg.y1-1;if(ins)return;hurt(G,e,50);if(e.hp>0&&e.hp<e.max*.5&&Math.random()<.2){kill(G,e);pop(G,e.x,e.y-1.5,'Cực quang kết liễu','#9affd0')}})}});pop(G,S.cx,S.cy-3,'Cực quang!','#9affd0')})};

/* ================= 2006 · Nhật thực toàn phần ================= */
X.init[2006]=(G,S)=>{S.prog=0;S.ec=0;S.kc=0};
X.death[2006]=(G,S,u,isB)=>{if(S.ec===0)S.kc++};
X.step[2006]=(G,S,dt,E,Rg)=>{if(S.ec===0){S.prog=Math.min(30,S.prog+dt/5+S.kc/5);S.kc=0;if(S.prog>=30){S.ec=1;S.et=0;pop(G,S.cx,S.cy-4,'NHẬT THỰC!','#ffb070')}return}
  S.et+=dt;if(S.ec===1&&S.et>=3){S.ec=2;S.et=0}
  if(S.ec===2&&S.et>=1.2){S.ec=3;S.et=0;const T=enemies(G,Rg,5),d=T.length?30000/T.length:0;T.forEach(e=>hurt(G,e,d));vis(G,{k:'boom',x:S.cx,y:S.cy,h:1,max:1.4,c:'#ffb070'});vis(G,{k:'wave',x:S.cx,y:S.cy,r:0,R:Math.max(Rg.x1-Rg.x0,Rg.y1-Rg.y0)/2+5,max:.8,hit:new Set(),up(){this.r=this.R*Math.min(1,this.t/.6)}});try{if(window.R3D)R3D.shake=Math.max(R3D.shake||0,.8)}catch(x){}pop(G,S.cx,S.cy-4,'Nhật thực nổ · 30.000 sát thương chia đều','#ffb070')}
  if(S.ec===3&&S.et>=5){S.ec=4;for(let i=0;i<11;i++){const p=spot(G,S);unit(G,S,{k:'stick',col:'#151018',x:p[0],y:p[1],hp:400,size:1.2,hr:.6,prov:6,cd:.4+i*.05,h:0,born:G.t,dark:1})}pop(G,S.cx,S.cy-3,'11 người que đen xuất hiện','#c7a0ff')}
  live(S,'stick').forEach(u=>fight(G,S,u,dt,{range:4,dmg:100,cd:1.2,speed:2.4}))};

/* ================= 2007 · Hang Sơn Đoòng ================= */
X.step[2007]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=5){S.a-=5;const t=E.slice().sort((a,b)=>b.hp-a.hp)[0];if(t){const d=t.max*.03;t.hp-=d;t.hit=.15;if(t.hp<=0){t.hp=.01;kill(G,t)}vis(G,{k:'cavebeam',e:t,x:t.x,y:t.y,max:1.2});pop(G,t.x,t.y-1.6,'Ánh sáng hang động · '+Math.round(d),'#fff3c0')}}
  live(S,'cbird').forEach(u=>{u.h=1.6+Math.sin(G.t*6+u.ph)*.3;fight(G,S,u,dt,{range:3,dmg:50,cd:1,speed:5})})};
X.death[2007]=(G,S,u,isB,ins)=>{if(!ins)return;const n=isB?5:3;for(let i=0;i<n;i++){if(live(S,'cbird').length>=30)break;unit(G,S,{k:'cbird',x:u.x+rnd(-1,1),y:u.y+rnd(-1,1),hp:50,size:1,hr:.5,cd:.3,life:20,h:1.6,ph:Math.random()*6,born:G.t})}};

/* ================= 2008 · Vịnh Hạ Long ================= */
X.death[2008]=(G,S,u,isB,ins)=>{if(!ins)return;if(isB&&!u.c39tmp){unit(G,S,{k:'karst',x:u.x,y:u.y,hp:1000,size:Math.max(u.w||2,u.h||2),hr:1,prov:4,life:15,h:0,born:G.t});pop(G,u.x,u.y-2,'Núi đá Hạ Long trồi lên','#9fd8a0')}if(isShip(G,u,isB))S.cnt++};
X.step[2008]=(G,S,dt,E,Rg)=>{S.u.forEach(u=>{if(u.k==='karst'&&!u.dead){u.life-=dt;if(u.life<=0){u.dead=true;u.gone=1}}});
  if(S.cnt>=10){S.cnt-=10;const y=rnd(Rg.y0-8,Rg.y1+8);vis(G,{k:'junk',x:Rg.x0-8,y,x1:Rg.x1+8,hit:new Set(),max:60,up(G,S2,dt){this.x+=4*dt;enemies(G,null).forEach(e=>{if(this.hit.has(e))return;if(Math.abs(e.x-this.x)<=1.6+(e.size||2)*.3&&Math.abs(e.y-this.y)<=1+(e.size||2)*.3){this.hit.add(e);hurt(G,e,400);const p=isBoss(e)?.35:1;e.x+=p;e.y+=(e.y>=this.y?1:-1)*p*.5}});if(this.x>=this.x1)this.max=this.t+.01}});pop(G,Rg.x0,y-2,'Thuyền buồm Hạ Long!','#ffb070')}};

/* ================= 2009 · Cầu Vàng Bà Nà ================= */
const SC=['#ff4a4a','#4ab8ff','#7aff7a','#ffd34a','#ff7ae8','#ffffff','#ff9a3a','#a07aff'];
X.death[2009]=(G,S,u,isB,ins)=>{if(!isB&&isAlly(G,u)){const p=[u.x,u.y];unit(G,S,{k:'stick',col:SC[Math.floor(Math.random()*SC.length)],x:p[0],y:p[1],hp:200,size:1.1,hr:.55,life:5,cd:.3,h:0,born:G.t})}
  if(isB&&ins&&!u.c39tmp){S.bd=(S.bd||0)+1;if(S.bd>=2){S.bd-=2;const R=S.Rg,side=Math.floor(Math.random()*4),x=side===0?R.x0-2.5:side===1?R.x1+2.5:rnd(R.x0,R.x1),y=side===2?R.y0-2.5:side===3?R.y1+2.5:rnd(R.y0,R.y1);
    unit(G,S,{k:'shand',x,y,hp:500,size:2,hr:1,life:7,cd:1,h:0,born:G.t});pop(G,x,y-3,'Bàn tay đá Bà Nà!','#d8c8a0')}}};
X.step[2009]=(G,S,dt,E,Rg)=>{tickGold(G,S);live(S,'stick').forEach(u=>fight(G,S,u,dt,{range:3,dmg:40,cd:1,speed:2.6}));
  live(S,'shand').forEach(u=>{u.life-=dt;u.sw=Math.max(0,(u.sw||0)-dt);if(u.life<=0){u.dead=true;u.gone=1;return}u.cd-=dt;if(u.cd>0)return;u.cd=1;const T=enemies(G,Rg,0);if(!T.length)return;const t=T[Math.floor(Math.random()*T.length)];u.tx=t.x;u.ty=t.y;u.sw=.5;hurt(G,t,300);const d=.4*BK(t);t.stun=Math.max(t.stun||0,d);t.noFire=Math.max(t.noFire||0,d);vis(G,{k:'slam',x:t.x,y:t.y,max:.6})})};

/* ================= 2010 · Phố cổ Hội An đêm hoa đăng ================= */
const LC=[{n:'đỏ',c:'#ff3a2a',f:(G,e)=>{if(Math.random()<.2)(e.c40dot=e.c40dot||[]).push({dps:400*(G.dmM||1),until:G.t+2})}},{n:'hồng',c:'#ff7ac8',f:(G,e)=>{const d=.5*BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d)}},
  {n:'vàng',c:'#ffd34a',f:(G,e)=>{const d=3*BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);e.c46g2=G.t+d;vis(G,{k:'goldst',e,x:e.x,y:e.y,max:d})}},{n:'cam',c:'#ff9a2a',f:(G,e)=>{e.silT=Math.max(e.silT||0,3*BK(e))}}];
X.init[2010]=(G,S)=>{S.cd=5;S.dealt=0;S.du=0};
X.step[2010]=(G,S,dt,E,Rg)=>{while(S.dealt-S.du>=200){S.du+=200;S.cd-=.5}S.cd-=dt;const sky=S.vis.filter(v=>v.k==='lantern'&&!v.fall);
  if(S.cd<=0){S.cd=5;if(sky.length<10){const C=LC[Math.floor(Math.random()*LC.length)],T=enemies(G,Rg,2),t=T.length?T[Math.floor(Math.random()*T.length)]:null;
    vis(G,{k:'lantern',C,x:t?t.x:rnd(Rg.x0,Rg.x1),y:t?t.y:rnd(Rg.y0,Rg.y1),tg:t,max:6.2,ph:Math.random()*6,up(G,S2,dt){if(this.t<5){if(this.tg&&!this.tg.dead){this.x+=(this.tg.x-this.x)*Math.min(1,dt*.7);this.y+=(this.tg.y-this.y)*Math.min(1,dt*.7)}return}this.fall=1;
      if(!this.hit&&this.t>=5.8){this.hit=1;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-this.x,e.y-this.y)<=1+(e.size||2)*.35){hurt(G,e,200);this.C.f(G,e)}});vis(G,{k:'boom',x:this.x,y:this.y,h:.4,max:.6,c:this.C.c})}}})}}};
X.death[2010]=(G,S,u,isB,ins)=>{if(!isB&&u.c46g2>G.t&&(G.en||[]).includes(u)){u.c46g2=0;giveSao(G,2);pop(G,u.x,u.y-1.6,'+2 Sao','#ffd34a')}
  if(isB&&ins&&!u.c39tmp&&Math.random()<.5){unit(G,S,{k:'house',x:u.x,y:u.y,hp:500,size:Math.max(u.w||2,u.h||2),hr:1,prov:3,h:0,born:G.t});pop(G,u.x,u.y-2,'Nhà phố cổ dựng lên','#ffd36a')}};

/* ================= 2011 · Múa rối nước ================= */
X.death[2011]=(G,S,u,isB,ins)=>{if(!ins)return;if(isB&&!u.c39tmp&&live(S,'clown').length<3){const p=spot(G,S);unit(G,S,{k:'clown',col:'#ffffff',x:p[0],y:p[1],hp:400,size:1.3,hr:.65,life:5,cd:.2,h:0,born:G.t});pop(G,p[0],p[1]-2.4,'Chú hề múa rối!','#ffb0e0')}
  if(!isB&&isAlly(G,u)){S.ad=(S.ad||0)+1;if(S.ad>=2){S.ad-=2;const T=enemies(G,S.Rg,2),t=T.length?T[Math.floor(Math.random()*T.length)]:null,x=t?t.x:rnd(S.Rg.x0,S.Rg.x1),y=t?t.y:rnd(S.Rg.y0,S.Rg.y1);
    enemies(G,null).forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<=2+(e.size||2)*.3){hurt(G,e,300);const d=BK(e);e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);e.c40up=G.t+1;vis(G,{k:'fish',x:e.x,y:e.y,e,max:1.1})}});vis(G,{k:'fish',x,y,max:1.1});pop(G,x,y-2,'Cá rối nước!','#8fd8ff')}}};
X.step[2011]=(G,S,dt)=>{live(S,'clown').forEach(u=>fight(G,S,u,dt,{range:2.5,dmg:200,cd:1,speed:2.4}))};

/* ================= 2012 · Múa lân đêm Trung Thu ================= */
X.init[2012]=(G,S)=>{S.bd=0;S.lcd=0;S.lan=0};
X.death[2012]=(G,S,u,isB,ins)=>{if(isB&&ins&&!u.c39tmp)S.bd++};
X.step[2012]=(G,S,dt,E,Rg)=>{every(S,'u300',300,()=>{if(S.lan<20){S.lan++;S.lp=S.lp||[];S.lp.push({x:rnd(Rg.x0,Rg.x1),y:rnd(Rg.y0,Rg.y1),ph:Math.random()*6})}});
  const L=live(S,'lion')[0];S.lcd=Math.max(0,S.lcd-dt);
  if(S.lan>0){if(L){S.lan--;S.lp.shift();L.life+=1;pop(G,L.x,L.y-4,'+1 giây cho lân','#ff9a3a')}else if(S.lcd>0){S.lan--;S.lp.shift();S.lcd=Math.max(0,S.lcd-1)}}
  if(!L&&S.lcd<=0&&S.bd>=8){S.bd-=8;const p=spot(G,S);unit(G,S,{k:'lion',x:p[0],y:p[1],hp:1000,size:2.4,hr:1.2,life:8,cd:.5,h:0,born:G.t});pop(G,p[0],p[1]-5,'Lân Trung Thu xuất hiện!','#ff9a3a')}
  if(L){fight(G,S,L,dt,{range:4,dmg:400,cd:2,speed:4.5});if(L.dead)S.lcd=25}
  S.u.forEach(u=>{if(u.k==='lion'&&u.dead&&!u.cdset){u.cdset=1;S.lcd=25}})};

/* ================= 2013 · Pháo hoa đêm giao thừa ================= */
X.step[2013]=(G,S,dt,E)=>{E.forEach(e=>{if(e.hp>0&&e.hp<e.max*.4&&!e.c46fw){e.c46fw=1;const x=e.x,y=e.y;kill(G,e);enemies(G,null).forEach(q=>{if(q!==e&&Math.hypot(q.x-x,q.y-y)<=2.5+(q.size||2)*.3)hurt(G,q,20)});vis(G,{k:'firework',x,y,max:1.6,c:['#ff4a6a','#ffd34a','#4ad8ff','#a07aff','#7aff9a'][Math.floor(Math.random()*5)]});pop(G,x,y-1.6,'Pháo hoa!','#ffd34a')}})};

/* ================= 2014 · Lễ hội sắc màu Holi ================= */
X.death[2014]=(G,S,u,isB)=>{if(isB||!inR(S.Rg,u,3))return;const r=(u.size||2)*.5+.3,col=['#ff3a8a','#ffd34a','#3ad8ff','#7aff4a','#b07aff','#ff8a2a'][Math.floor(Math.random()*6)];
  vis(G,{k:'holi',x:u.x,y:u.y,r,c:col,max:5,up(G,S2,dt){enemies(G,null).forEach(e=>{if(Math.hypot(e.x-this.x,e.y-this.y)<=this.r+(e.size||2)*.3){e.noFire=Math.max(e.noFire||0,.25);e.c28bl=G.t+.25}})}})};

C40.H2={fight,spot,live,every,isShip};
window.C46TXT={2004:'mỗi 200 máu công trình mất tạo bão cát 4 giây: 20 sát thương mỗi giây, 3% hóa cát choáng 1 giây; mỗi 1.500 máu mất gọi lạc đà 300 máu, đánh 40 trong 3 ô, khiêu khích địch trong 4 ô',
  2005:'mỗi 500 máu công trình mất tạo cực quang quanh thảm 4 giây: 50 sát thương mỗi giây, 20% kết liễu mục tiêu dưới 50% máu',
  2006:'mặt trời và mặt trăng trên trời cách nhau 30 ô, mặt trăng tiến 1 ô mỗi 5 giây (mỗi mục tiêu bị hạ giảm 1 giây); nhật thực xong rơi xuống nổ 30.000 sát thương chia đều cho địch trong thảm và quanh thảm 5 ô, rồi gọi 11 người que đen (400 máu, 100 sát thương, tầm 4 ô, khiêu khích 6 ô); 1 lần mỗi trận',
  2007:'mỗi 5 giây chiếu sáng kẻ địch nhiều máu nhất: 3% máu tối đa sát thương chuẩn; mỗi tàu bị hạ trong thảm gọi 3 chim đen (công trình bị phá gọi 5), chim 50 máu, đánh 50 trong 3 ô',
  2008:'công trình bị phá dựng núi đá Hạ Long tại chỗ (1.000 máu, 15 giây, khiêu khích 4 ô); mỗi 10 tàu bị hạ trong thảm có thuyền buồm chạy ngang 4 ô/giây, húc 400 sát thương và đẩy lùi 1 ô',
  2009:'tàu ta bị hạ gọi 1 người que (200 máu, 40 sát thương, 5 giây); mỗi 2 công trình bị phá dựng bàn tay đá 500 máu ngoài thảm trong 7 giây, mỗi giây đập 300 sát thương + choáng 0,4 giây; trụ sở trúng đòn lần đầu được mạ vàng +500 máu (4 giây) và khiên chặn 4.000 trong 15 giây',
  2010:'mỗi 5 giây thả 1 đèn hoa đăng lơ lửng (tối đa 10 đèn), sau 5 giây rơi xuống gây 200 sát thương: đỏ 20% thiêu 40 mỗi 0,1 giây trong 2 giây, hồng choáng 0,5 giây, vàng hóa vàng 3 giây (hạ được +2 Sao), cam cấm kỹ năng 3 giây; mỗi 200 sát thương phe ta gây ra giảm 0,5 giây hồi đèn; công trình bị phá 50% dựng nhà phố cổ 500 máu khiêu khích 3 ô',
  2011:'mỗi công trình bị phá gọi 1 chú hề múa rối (400 máu, 200 sát thương, 5 giây, tối đa 3); mỗi 2 tàu ta bị hạ có cá rối nước nhảy lên gây 300 sát thương và hất tung 1 giây',
  2012:'mỗi 8 công trình bị phá gọi lân Trung Thu chân cao 4 ô (1.000 máu, cắn 400 trong 4 ô mỗi 2 giây, 8 giây, hồi 25 giây); mỗi 300 máu công trình mất thả 1 lồng đèn: +1 giây cho lân hoặc giảm 1 giây hồi lân',
  2013:'kẻ địch dưới 40% máu bị pháo hoa kết liễu, nổ lan 20 sát thương lên địch xung quanh',
  2014:'mỗi tàu bị hạ trong thảm để lại một đám màu Holi bằng kích thước tàu trong 5 giây, làm mù kẻ địch đứng trong đó'};
})();
