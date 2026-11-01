/* ===== c58: thảm Người giàu — Biệt thự nước Maldives, Đảo cọ nhân tạo, Sân golf hoàng gia, Trường đua ngựa hoàng gia ===== */
(function(){
if(!window.C40||!C40.H2||!window.C49TXT)return;
const X=C40.X,{enemies,hurt,pop,vis,unit,rnd,dist,inR}=C40.H,{fight,live}=C40.H2;
const stun=(e,t)=>{if(e&&!e.dead)e.stun=Math.max(e.stun||0,t*(e.boss?1/3:1))};
const push=(G,e,dx,dy,d)=>{if(!e||e.dead||e.sb)return;const l=Math.hypot(dx,dy)||1,k=d*(e.boss?.3:1);e.x+=dx/l*k;e.y+=dy/l*k;try{e.x=Math.max(.5,Math.min(G.wd.Wd-.5,e.x));e.y=Math.max(.5,Math.min(G.wd.Hd-.5,e.y))}catch(x){}};
const all=G=>(G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t));
const near=(G,Rg,m)=>all(G).filter(e=>inR(Rg,e,m));
const reach=(e,r)=>r+(e.size||2)*.3;
/* điểm trên chu vi hình chữ nhật cách thảm o ô, tham số s (0..chu vi), đi theo chiều kim đồng hồ */
function perim(Rg,o,s){const x0=Rg.x0-o,y0=Rg.y0-o,W=Rg.x1-Rg.x0+2*o,H=Rg.y1-Rg.y0+2*o,P=2*(W+H);s=((s%P)+P)%P;
  if(s<W)return {x:x0+s,y:y0,a:0};s-=W;if(s<H)return {x:x0+W,y:y0+s,a:Math.PI/2};s-=H;if(s<W)return {x:x0+W-s,y:y0+H,a:0};s-=W;return {x:x0,y:y0+H-s,a:Math.PI/2}}
function slots(Rg,need){const L=[];for(let o=5;L.length<need&&o<30;o+=2){const W=Rg.x1-Rg.x0+2*o,H=Rg.y1-Rg.y0+2*o;[[W,0],[H,W],[W,W+H],[H,2*W+H]].forEach(([len,s0])=>{const n=Math.floor(len/4),pad=(len-n*4)/2;for(let i=0;i<n;i++){const p=perim(Rg,o,s0+pad+i*4+2);L.push({x:p.x,y:p.y,a:p.a,o})}})}return L.slice(0,Math.max(need,L.length))}
const GOLDC=['#ffd700','#ffc42a','#ffe066','#f0b400'];
/* ============ 1011 · Biệt thự nước Maldives ============ */
X.init[1011]=(G,S)=>{S.need=G.pvp?50:20;S.sl=slots(S.Rg,S.need);S.a=0;S.ph=0;S.vl=[];S.st=[];S.made=0};
X.death[1011]=(G,S,u,isB,ins)=>{if(ins&&S.ph===0)S.a+=1};
X.step[1011]=(G,S,dt,E,Rg)=>{const pl=live(S,'plank');S.st=S.st.filter(s=>{s.t+=dt;if(s.t>=.6&&!s.hit){s.hit=1;all(G).forEach(e=>{if(Math.hypot(e.x-s.x,e.y-s.y)<=reach(e,.9)){hurt(G,e,200);stun(e,.5)}});vis(G,{k:'boom',x:s.x,y:s.y,h:.3,max:.45,c:'#fff3a0'})}return s.t<.8});
  live(S,'stick').forEach(u=>{if(u.gold)fight(G,S,u,dt,{scan:12,range:1.1,speed:3.2,cd:1,dmg:50})});
  if(S.ph===0){S.a+=dt;if(pl.length>=S.need){S.ph=S.vl.length?2:1;S.a=0;if(S.ph===1){for(let i=0;i<8;i++){const ring=S.sl.filter(q=>q.o===5),Pm=ring.length*4,p=perim(Rg,5,i/8*2*(Rg.x1-Rg.x0+Rg.y1-Rg.y0+20)+2);S.vl.push({x:p.x,y:p.y,a:p.a,born:G.t})}pop(G,S.cx,S.cy-4,'Đường gỗ hoàn thiện · dựng 8 biệt thự nước','#ffe6a8')}return}
    if(S.a>=12){S.a=0;const used=new Set(pl.map(u=>u.si));const i=S.sl.findIndex((q,j)=>!used.has(j));if(i>=0){const q=S.sl[i];unit(G,S,{k:'plank',x:q.x,y:q.y,a:q.a,si:i,hp:200,size:1.6,hr:.9,born:G.t});S.made++}}return}
  S.a+=dt;
  if(S.ph===1&&S.a>=2.5){S.ph=2;S.a=0}
  else if(S.ph===2){if(!S.dz){S.dz=1;all(G).forEach(e=>stun(e,2));pop(G,S.cx,S.cy-5,'Ánh sao rực rỡ · mọi tàu choáng ngợp 2 giây','#fff6c0')}if(S.a>=2){S.ph=3;S.a=0;S.ns=0;S.sa=0;S.dz=0}}
  else if(S.ph===3){S.sa+=dt;while(S.sa>=1/3&&S.ns<99){S.sa-=1/3;S.ns++;const L=near(G,Rg,12);const e=L[Math.floor(Math.random()*L.length)];const x=e?e.x+rnd(-.3,.3):rnd(Rg.x0,Rg.x1),y=e?e.y+rnd(-.3,.3):rnd(Rg.y0,Rg.y1);S.st.push({x,y,t:0,sx:x+rnd(-3,3),sy:y+rnd(-3,3)})}if(S.ns>=99){S.ph=4;S.a=0;S.sk=0;pop(G,S.cx,S.cy-5,'Lính người que vàng xuất trận!','#ffd700')}}
  else if(S.ph===4){S.sk+=dt;while(S.sk>=1&&S.a<=10.5){S.sk-=1;S.vl.forEach(v=>unit(G,S,{k:'stick',col:GOLDC[Math.floor(Math.random()*4)],x:v.x+rnd(-.6,.6),y:v.y+rnd(-.6,.6),hp:400,size:1,hr:.6,cd:.5,gold:1,born:G.t}))}if(S.a>=10){S.ph=5;S.a=0}}
  else if(S.ph===5&&S.a>=30){S.a=0;S.ph=pl.length>=S.need?2:0}
  if(S.ph>=2&&S.ph!==5&&pl.length<S.need&&S.ph!==3&&S.ph!==4){S.ph=0;S.a=0}};
/* ============ 1012 · Đảo cọ nhân tạo ============ */
X.init[1012]=(G,S)=>{S.a=12;S.g=0;S.full=0};
X.step[1012]=(G,S,dt,E,Rg)=>{const ys=live(S,'myacht').filter(u=>u.c58);S.a+=dt;const W=(Rg.x1-Rg.x0)/2,H=(Rg.y1-Rg.y0)/2;
  if(S.a>=14){S.a-=14;if(ys.length<8){const th=Math.random()*6.283;unit(G,S,{k:'myacht',c58:1,th,dir:Math.random()<.5?1:-1,rr:rnd(2.5,4.5),x:S.cx+Math.cos(th)*(W+3.5),y:S.cy+Math.sin(th)*(H+3.5),hp:400,size:2,hr:1,h:0,born:G.t,gun:{c:'#ffffff',d:0},hs:new Map(),ang:0});pop(G,S.cx,S.cy-4,'Du thuyền nhỏ ra khơi','#e8f8ff');if(ys.length+1>=8)S.full=1}}
  ys.forEach(u=>{const R=Math.max(W,H)+u.rr,w=5/R*u.dir;u.th+=w*dt;const nx=S.cx+Math.cos(u.th)*(W+u.rr),ny=S.cy+Math.sin(u.th)*(H+u.rr);u.ang=Math.atan2(ny-u.y,nx-u.x);u.x=nx;u.y=ny;u.ga=u.ang;
    all(G).forEach(e=>{if(Math.hypot(e.x-u.x,e.y-u.y)>reach(e,1.3))return;const t=u.hs.get(e)||0;if(G.t<t)return;u.hs.set(e,G.t+1.5);hurt(G,e,100);vis(G,{k:'boom',x:e.x,y:e.y,h:.2,max:.35,c:'#bfe8ff'})})});
  if(S.full){S.g+=dt;if(S.g>=8){S.g-=8;const n=live(S,'gull').length;for(let i=0;i<Math.min(5,40-n);i++){const r=rnd(1,Math.max(W,H)+6),th=Math.random()*6.283;unit(G,S,{k:'gull',x:S.cx+Math.cos(th)*r,y:S.cy+Math.sin(th)*r,r,th,w:rnd(.35,.7)*(Math.random()<.5?1:-1),hp:50,size:.8,hr:.5,h:8,cd:rnd(0,1),born:G.t,noT:1})}if(n<40)pop(G,S.cx,S.cy-4,'Đàn hải âu trắng bay tới','#ffffff')}}
  live(S,'gull').forEach(u=>{u.cd-=dt;u.dv=Math.max(0,(u.dv||0)-dt);const tg=all(G).filter(e=>Math.hypot(e.x-u.x,e.y-u.y)<=8).sort((a,b)=>dist(a,u)-dist(b,u))[0];
    if(tg){const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1;if(l>2){u.x+=dx/l*4*dt;u.y+=dy/l*4*dt}u.ang=Math.atan2(dy,dx);if(u.cd<=0){u.cd=1;hurt(G,tg,40);u.dv=.4;u.tx=tg.x;u.ty=tg.y}}
    else{u.th+=u.w*dt;const nx=S.cx+Math.cos(u.th)*u.r,ny=S.cy+Math.sin(u.th)*u.r;u.ang=Math.atan2(ny-u.y,nx-u.x);u.x+=(nx-u.x)*Math.min(1,dt*2);u.y+=(ny-u.y)*Math.min(1,dt*2)}})};
/* ============ 1013 · Sân golf hoàng gia ============ */
X.init[1013]=(G,S)=>{S.a=9;S.b=[]};
X.death[1013]=(G,S,u,isB,ins)=>{if(ins)S.a+=1};
X.step[1013]=(G,S,dt,E,Rg)=>{S.a+=dt;
  if(S.a>=12){const L=near(G,Rg,4);if(L.length){S.a=0;const e=L[Math.floor(Math.random()*L.length)],tx=Rg.x0+1.2,ty=Rg.y1-1.2;S.b.push({e,x0:tx,y0:ty,x:tx,y:ty,t:0,T:.9});pop(G,tx,ty-2,'Phát bóng!','#ffffff')}else S.a=12}
  S.b=S.b.filter(b=>{b.t+=dt;const e=b.e,k=Math.min(1,b.t/b.T);if(!e.dead){b.ex=e.x;b.ey=e.y}b.x=b.x0+(b.ex-b.x0)*k;b.y=b.y0+(b.ey-b.y0)*k;b.h=Math.sin(k*Math.PI)*Math.max(3,Math.hypot(b.ex-b.x0,b.ey-b.y0)*.35);
    if(k>=1){if(!e.dead){hurt(G,e,600);push(G,e,b.ex-b.x0,b.ey-b.y0,3);vis(G,{k:'boom',x:b.ex,y:b.ey,h:.3,max:.45,c:'#ffffff'})}return false}return true})};
/* ============ 1014 · Trường đua ngựa hoàng gia ============ */
const HC=['#3a2414','#8a5a2a','#f2efe8','#1a1a1a','#c8a070','#7a7a80','#b07a40','#5a3a1a'],JC=['#ffd700','#2f7dff','#2ecc71','#9b4dff','#ffffff','#00d2d2','#ff8a1a','#ff4fa8'];
X.init[1014]=(G,S)=>{S.a=9};
X.step[1014]=(G,S,dt,E,Rg)=>{S.a+=dt;const hs=live(S,'horse');
  if(S.a>=12){S.a-=12;if(hs.length<10){const p={x:rnd(Rg.x0+1,Rg.x1-1),y:Rg.y1+1};unit(G,S,{k:'horse',x:p.x,y:p.y,hp:300,size:1.4,hr:.8,col:HC[Math.floor(Math.random()*HC.length)],jc:JC[Math.floor(Math.random()*JC.length)],cd:0,ang:-Math.PI/2,born:G.t,run:0});pop(G,p.x,p.y-2,'Ngựa đua xuất phát!','#ffe6a8')}}
  hs.forEach(u=>{u.cd-=dt;u.run+=dt;const tg=enemies(G,Rg,12).sort((a,b)=>dist(a,u)-dist(b,u))[0];let dx,dy;
    if(tg&&u.cd<=.4){dx=tg.x-u.x;dy=tg.y-u.y}else{const th=G.t*.6+u.born;dx=S.cx+Math.cos(th)*6-u.x;dy=S.cy+Math.sin(th)*6-u.y;if(u.cd>.4){dx=Math.cos(u.ang);dy=Math.sin(u.ang)}}
    const l=Math.hypot(dx,dy)||1,ta=Math.atan2(dy,dx);let da=ta-u.ang;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;u.ang+=Math.max(-5*dt,Math.min(5*dt,da));u.x+=Math.cos(u.ang)*7*dt;u.y+=Math.sin(u.ang)*7*dt;u.mv=1;
    if(tg&&u.cd<=0&&Math.hypot(tg.x-u.x,tg.y-u.y)<=reach(tg,1)){u.cd=1;hurt(G,tg,120);push(G,tg,Math.cos(u.ang),Math.sin(u.ang),2);vis(G,{k:'boom',x:tg.x,y:tg.y,h:.3,max:.35,c:'#ffe6a8'});
      if(tg.dead||tg.hp<=0){unit(G,S,{k:'stick',col:JC[Math.floor(Math.random()*JC.length)],x:tg.x,y:tg.y,hp:50,size:1,hr:.6,cd:.5,hk:1,born:G.t})}}
    u.x=Math.max(Rg.x0-12,Math.min(Rg.x1+12,u.x));u.y=Math.max(Rg.y0-12,Math.min(Rg.y1+12,u.y))});
  live(S,'stick').forEach(u=>{if(u.hk)fight(G,S,u,dt,{scan:12,range:1.1,speed:3,cd:1,dmg:30})})};
Object.assign(window.C49TXT,{
 1011:'vẽ dần từng đường gỗ (dài 4 ô, 200 máu) quanh thảm cách 5 ô, mỗi 12 giây 1 đường — mỗi kẻ địch bị hạ trong thảm rút ngắn 1 giây; đủ 20 đường gỗ (PvP 50) thì dựng 8 biệt thự nước sáng đèn lấp lánh: ánh sao trên trời làm mọi tàu choáng ngợp 2 giây, rồi 99 ngôi sao (3 sao/giây, từ độ cao 12 ô) giáng xuống mục tiêu, mỗi sao 200 sát thương và choáng 0,5 giây; sau đó mỗi biệt thự gọi 10 lính người que vàng trong 10 giây (400 máu, 50 sát thương/đòn)',
 1012:'mỗi 14 giây triệu hồi 1 du thuyền nhỏ (400 máu) chạy vòng quanh ngoài thảm, gây 100 sát thương lên mục tiêu va phải, tối đa 8 chiếc; đủ đội du thuyền thì mỗi 8 giây một đàn hải âu trắng (mỗi con 50 máu) bay lượn cao 8 ô trên thảm, liên tục tấn công mục tiêu trong tầm 40 sát thương mỗi lần',
 1013:'mỗi 12 giây một quả bóng golf bay tới 1 mục tiêu bất kỳ trong phạm vi thảm: 600 sát thương và đẩy mục tiêu đi 3 ô; mỗi mục tiêu bị hạ trong phạm vi thảm rút ngắn 1 giây',
 1014:'mỗi 12 giây thả 1 ngựa đua có nài (300 máu, nhiều màu, không có màu đỏ) tông mục tiêu 120 sát thương và đẩy lùi 2 ô; mỗi mục tiêu ngựa hạ gục sinh ra 1 người que (50 máu, 30 sát thương/đòn) tại chỗ'});
})();
