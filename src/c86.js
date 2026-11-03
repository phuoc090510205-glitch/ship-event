/* ===== c86: 10 thảm Tối thượng làm lại — Khung cửi dệt lụa, Thư pháp chữ Việt, Cối xay gió & tulip, Đàn bướm vua, Đại di cư Serengeti, Hồ hồng hạc, Đàn voi bên hồ, Vũ điệu Fractal, Giao thoa sóng ánh sáng, Chất lỏng sắt từ ===== */
(function(){
if(!window.C40||!C40.H2||!window.C49TXT)return;
const X=C40.X,{enemies,allies,blds,hurt,pop,vis,unit,rnd,dist,inR,heal,isAlly,DBk}=C40.H,{spot,live}=C40.H2;
const DB=()=>DBk(),all=G=>(G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t)),reach=(e,r)=>r+(e.size||2)*.3;
const push=(G,e,dx,dy,d)=>{if(!e||e.dead||e.sb)return;const l=Math.hypot(dx,dy)||1,k=d*(e.boss?.3:1);e.x+=dx/l*k;e.y+=dy/l*k;try{e.x=Math.max(.5,Math.min(G.wd.Wd-.5,e.x));e.y=Math.max(.5,Math.min(G.wd.Hd-.5,e.y))}catch(x){}};
const ourB=(G,u)=>(G.bl||[]).includes(u)&&!u.c39tmp&&u.t!=='mine'&&!u.aux;
const mv=(u,tx,ty,sp,dt,stop)=>{const dx=tx-u.x,dy=ty-u.y,l=Math.hypot(dx,dy)||1;u.ang=Math.atan2(dy,dx);if(l>stop){const s=Math.min(l-stop,sp*dt);u.x+=dx/l*s;u.y+=dy/l*s;u.mv=1;u.walk=(u.walk||0)+dt}else u.mv=0;return l};
/* đơn vị cận chiến chung: đi tới mục tiêu và đánh */
function brawl(G,u,dt,tg,o){u.cd=(u.cd||0)-dt;u.sw=Math.max(0,(u.sw||0)-dt);if(!tg){u.mv=0;return}const rc=reach(tg,o.range);const l=mv(u,tg.x,tg.y,o.speed,dt,rc-.2);
  if(l<=rc&&u.cd<=0){u.cd=o.cd;u.sw=.45;hurt(G,tg,o.dmg);if(o.hit)o.hit(tg)}}
const nearE=(G,u,L)=>(L||all(G)).sort((a,b)=>dist(a,u)-dist(b,u))[0]||null;
/* mục tiêu "đang bị nhắm đến": kẻ địch bị tàu ta nhắm nhiều nhất */
function focus(G){const c=new Map();[G.pl].concat(G.al||[]).forEach(a=>{const t=a&&!a.dead&&((a.ai&&a.ai.tg)||a.tg);if(t&&!t.dead)c.set(t,(c.get(t)||0)+1)});let b=null,n=0;c.forEach((v,k)=>{if(v>n){n=v;b=k}});return b}
/* hướng có nhiều công trình địch nhất (PvP) hoặc nhiều địch nhất */
function hotDir(G,S){const L=(G.eu&&G.eu.length?G.eu.filter(u=>!u.dead&&u.hp>0):all(G));let x=0,y=0;L.forEach(e=>{x+=e.x;y+=e.y});if(!L.length)return [0,-1];x/=L.length;y/=L.length;const dx=x-S.cx,dy=y-S.cy,l=Math.hypot(dx,dy)||1;return [dx/l,dy/l]}

/* ============ 2025 · Khung cửi dệt lụa ============ */
X.init[2025]=(G,S)=>{S.th=0;S.tm=5};
X.death[2025]=(G,S,u,isB,ins)=>{if(isB||isAlly(G,u)||u.c40u)return;S.tm-=ins?1:.5};
X.step[2025]=(G,S,dt,E,Rg)=>{S.tm-=dt;while(S.tm<=0){S.tm+=5;S.th++;vis(G,{k:'silk',x0:Rg.x0,x1:Rg.x1,y:Rg.y0+(Rg.y1-Rg.y0)*((S.th%15)+.5)/15,max:1.2,i:S.th});
    if(S.th>=15){S.th=0;const d=hotDir(G,S),hw=(Rg.x1-Rg.x0)/2+2,hh=(Rg.y1-Rg.y0)/2+2,k=Math.min(Math.abs(d[0])>1e-3?hw/Math.abs(d[0]):1e9,Math.abs(d[1])>1e-3?hh/Math.abs(d[1]):1e9);
      const x=S.cx+d[0]*k,y=S.cy+d[1]*k;unit(G,S,{k:'silkwall',x,y,ang:Math.atan2(d[1],d[0])+Math.PI/2,hp:800,size:6,hr:3,prov:16,h:0,born:G.t});pop(G,x,y-4,'Tường lụa dệt xong! Kẻ địch dồn đánh tường','#ffd8f0')}
    else pop(G,S.cx,Rg.y0-1.5,'Dệt lụa '+S.th+'/15','#ffe0b0')}};

/* ============ 2026 · Thư pháp chữ Việt ============ */
const WORDS=['Nhẫn','Tâm','Phúc','An','Đức','Trí','Dũng','Hiếu','Lộc','Thọ','Nghĩa','Tín'];
X.init[2026]=(G,S)=>{S.wt=0;S.n=0};
X.step[2026]=(G,S,dt,E,Rg)=>{S.wt+=dt;S.prog=Math.min(1,S.wt/8);if(S.wt<8)return;S.wt=0;S.n++;const w=WORDS[(S.n-1)%WORDS.length];S.word=w;vis(G,{k:'callig',x:S.cx,y:S.cy,w,max:2.4});
  let best=null,bt=0;const P=G.pl;if(P&&P.dead&&(G.respawn||0)>bt){bt=G.respawn;best='pl'}(G.al||[]).forEach(a=>{if(a.dead&&(a.c36rs||0)>bt){bt=a.c36rs;best=a}});
  if(best==='pl'){G.respawn=Math.max(0,G.respawn-2);pop(G,S.cx,S.cy-3,'Chữ «'+w+'» · tàu chính hồi sinh sớm 2 giây','#fff3d0')}
  else if(best){best.c36rs=Math.max(0,best.c36rs-2);pop(G,S.cx,S.cy-3,'Chữ «'+w+'» · tàu phụ hồi sinh sớm 2 giây','#fff3d0')}
  else pop(G,S.cx,S.cy-3,'Chữ «'+w+'» hoàn thành','#fff3d0')};

/* ============ 2027 · Cối xay gió và hoa tulip ============ */
const TUL=['#e0202a','#ffd020','#ff7ab8','#ffffff','#ff8a2a','#c040d0','#ff4060'];
X.death[2027]=(G,S,u,isB,ins)=>{if(isB&&ourB(G,u)){unit(G,S,{k:'windmill',x:u.x,y:u.y,hp:800,size:2.4,hr:1.3,prov:14,h:0,born:G.t});pop(G,u.x,u.y-3,'Cối xay gió dựng lên!','#ffe8c0')}
  else if(!isB&&isAlly(G,u)){unit(G,S,{k:'tulip',col:TUL[Math.floor(Math.random()*TUL.length)],x:u.x,y:u.y,hp:100,size:1,hr:.6,life:15,h:0,born:G.t,tk:1})}};
X.step[2027]=(G,S,dt)=>{live(S,'tulip').forEach(u=>{u.life-=dt;if(u.life<=0){u.dead=true;u.fx3=1;return}u.tk-=dt;if(u.tk<=0){u.tk+=1;all(G).forEach(e=>{if(Math.hypot(e.x-u.x,e.y-u.y)<=reach(e,3))hurt(G,e,30)});vis(G,{k:'ring',x:u.x,y:u.y,c:u.col,max:.5})}})};

/* ============ 2028 · Đàn bướm vua di cư ============ */
function bfly(G,S,x,y){if(live(S,'bfly').length>=60)return null;return unit(G,S,{k:'bfly',x:x+rnd(-.6,.6),y:y+rnd(-.6,.6),hp:80,size:.7,hr:.45,h:1.4,ph:Math.random()*6,cd:Math.random(),born:G.t})}
X.init[2028]=(G,S)=>{S.kc=0};
X.death[2028]=(G,S,u,isB,ins)=>{if(isB&&ourB(G,u)){unit(G,S,{k:'btree',x:u.x,y:u.y,hp:500,size:2,hr:1.1,prov:14,life:15,sp:2,h:0,born:G.t});pop(G,u.x,u.y-3,'Cây bướm vua mọc lên','#ffd27a');return}
  if(!isB&&!isAlly(G,u)&&!u.c40u&&ins){S.kc++;if(S.kc>=3){S.kc-=3;for(let i=0;i<5;i++)bfly(G,S,u.x,u.y);pop(G,u.x,u.y-2,'5 bướm vua bay ra!','#ffb02e')}}};
X.step[2028]=(G,S,dt)=>{const F=focus(G);live(S,'btree').forEach(t=>{t.life-=dt;if(t.life<=0){t.dead=true;t.fx3=1;return}t.sp-=dt;if(t.sp<=0){t.sp+=2;bfly(G,S,t.x,t.y)}});
  live(S,'bfly').forEach(u=>{const tg=(F&&!F.dead)?F:nearE(G,u);brawl(G,u,dt,tg,{range:.8,speed:5,cd:.8,dmg:10});u.h=1.2+Math.sin(G.t*4+u.ph)*.35})};

/* ============ 2029 · Đại di cư Serengeti ============ */
const BEAST={zebra:{hp:250,dmg:50,sz:1.6},ostrich:{hp:100,dmg:30,sz:1.2},deer:{hp:200,dmg:40,sz:1.4}};
X.init[2029]=(G,S)=>{S.go=0};
X.death[2029]=(G,S,u,isB,ins)=>{if(isB||!isAlly(G,u)||!inR(S.Rg,u,0))return;const r=Math.random(),k=r<.5?'zebra':r<.8?'ostrich':'deer',B=BEAST[k],p=spot(G,S);
  unit(G,S,{k:'sbeast',bk:k,x:p[0],y:p[1],hp:B.hp,dmg:B.dmg,size:B.sz,hr:.75,h:0,born:G.t,ang:Math.random()*6});pop(G,p[0],p[1]-2,(k==='zebra'?'Ngựa vằn':k==='ostrich'?'Đà điểu':'Linh dương sừng')+' gia nhập đàn ('+live(S,'sbeast').length+'/30)','#f8d898')};
X.step[2029]=(G,S,dt)=>{const L=live(S,'sbeast');if(!S.go&&L.length>=30){S.go=1;pop(G,S.cx,S.cy-4,'ĐẠI DI CƯ! 30 con thú lao vào công trình địch','#ffb060')}
  if(!S.go){L.forEach(u=>{u.mv=0;u.ang+=dt*.2*Math.sin(G.t+u.born)});return}
  const tgs=(G.eu&&G.eu.length)?G.eu.filter(e=>!e.dead&&e.hp>0):all(G);L.forEach(u=>brawl(G,u,dt,nearE(G,u,tgs.slice()),{range:1.2,speed:4.5,cd:1,dmg:u.dmg}));if(!L.length)S.go=0};

/* ============ 2030 · Hồ hồng hạc ============ */
X.init[2030]=(G,S)=>{S.coat=[];allies(G,null).forEach(u=>{if(u===G.pl){u.cs=u.cs||{};u.cs.abs={v:100,t:15,max:100};u.cs.circ=true}else u.shd={v:100,t:15,max:100,c86:1};S.coat.push(u)});
  blds(G,null).forEach(b=>{const v=100/DB();b.shd={v,t:15,max:v,c86:1};S.coat.push(b)});pop(G,S.cx,S.cy-4,'Lớp lông hồng hạc · +100 giáp trong 15 giây','#ffb8d0')};
X.death[2030]=(G,S,u,isB,ins)=>{if(isB||!isAlly(G,u))return;if(live(S,'flamingo').length>=25)return;const p=spot(G,S);unit(G,S,{k:'flamingo',x:p[0],y:p[1],hp:400,size:1.2,hr:.7,prov:14,h:0,born:G.t,ang:Math.random()*6})};
X.step[2030]=(G,S,dt)=>{if(S.t>=15&&S.coat){S.coat.forEach(u=>{if(u===G.pl){if(u.cs&&u.cs.abs&&u.cs.abs.max===100)u.cs.abs=null}else if(u.shd&&u.shd.c86)u.shd=null});S.coat=null}};

/* ============ 2031 · Đàn voi bên hồ nước ============ */
X.init[2031]=(G,S)=>{S.lost=0;S.lh=5};
X.death[2031]=(G,S,u,isB,ins)=>{if((isB&&ourB(G,u))||(!isB&&isAlly(G,u))){S.lost++;if(S.lost>=5){S.lost-=5;const mom=Math.random()<.5,p=spot(G,S);
  unit(G,S,{k:'w2eleph',mom,x:p[0],y:p[1],hp:mom?1000:500,dmg:mom?200:100,size:mom?4:2.4,hr:mom?2:1.2,h:0,born:G.t,ag:[],lhp:0,ang:Math.random()*6});pop(G,p[0],p[1]-4,mom?'Voi mẹ xuất hiện!':'Voi con xuất hiện!','#e8d8b0')}}};
{const _h=window.c14Hit;window.c14Hit=function(p){try{const G=DG,S=G&&G.c40;if(S&&S.K===2031&&p&&p.team==='e'&&!p.dead){const a=p.own||p.src||p.o||p.P;if(a)for(const o of S.u){if(o.dead||o.k!=='w2eleph')continue;if(Math.hypot(o.x-p.x,o.y-p.y)<=(o.hr||.6)&&!o.ag.includes(a))o.ag.push(a)}}}catch(e){}return _h?_h.apply(this,arguments):false}}
X.step[2031]=(G,S,dt,E,Rg)=>{live(S,'w2eleph').forEach(u=>{if(u.lhp&&u.hp<u.lhp-.01){const sus=all(G).filter(e=>e._tg===u).concat(nearE(G,u)?[nearE(G,u)]:[]);const a=sus[0];if(a&&!u.ag.includes(a))u.ag.push(a)}u.lhp=u.hp;
    u.ag=u.ag.filter(e=>e&&!e.dead&&e.hp>0);const tg=u.ag[0]||nearE(G,u);brawl(G,u,dt,tg,{range:u.mom?2.2:1.4,speed:u.mom?2.6:3.2,cd:1.4,dmg:u.dmg})});
  S.lh-=dt;if(S.lh<=0){S.lh+=5;allies(G,Rg,0).forEach(u=>heal(u,20));blds(G,Rg).forEach(b=>heal(b,20/DB()));vis(G,{k:'lake',x:S.cx,y:S.cy,max:1})}};

/* ============ 2032 · Vũ điệu Fractal vô tận ============ */
X.init[2032]=(G,S)=>{S.a=0};
X.step[2032]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=6){S.a-=6;if(live(S,'stick').length<20){const x=rnd(Rg.x0+.5,Rg.x1-.5),y=rnd(Rg.y0+.5,Rg.y1-.5);unit(G,S,{k:'stick',col:'#06060c',dark:1,frac:1,x,y,hp:300,size:1.1,hr:.55,h:0,born:G.t,tk:1});pop(G,x,y-2,'Người que fractal nhảy múa!','#c8a0ff')}}
  live(S,'stick').forEach(u=>{if(!u.frac)return;const tg=nearE(G,u);if(tg){const l=Math.hypot(tg.x-u.x,tg.y-u.y);if(l>1.2){const w=Math.sin(G.t*6+u.born)*.9,dx=(tg.x-u.x)/l,dy=(tg.y-u.y)/l,vx=dx-dy*w,vy=dy+dx*w,vl=Math.hypot(vx,vy)||1;u.x+=vx/vl*4*dt;u.y+=vy/vl*4*dt}}
    u.ang=(u.ang||0)+dt*5;u.mv=1;u.walk=(u.walk||0)+dt*1.6;u.sw=.5*Math.abs(Math.sin(G.t*4+u.born));u.tk-=dt;if(u.tk<=0){u.tk+=1;all(G).forEach(e=>{if(Math.hypot(e.x-u.x,e.y-u.y)<=reach(e,5))hurt(G,e,30)});vis(G,{k:'fring',x:u.x,y:u.y,max:.6})}})};

/* ============ 2033 · Giao thoa sóng ánh sáng ============ */
X.init[2033]=(G,S)=>{S.a=0};
X.step[2033]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a<3)return;S.a-=3;const x=rnd(Rg.x0,Rg.x1),y=rnd(Rg.y0,Rg.y1);
  vis(G,{k:'ndrop',x,y,max:1,up(G2,S2,d2){if(this.hit||this.t<.9)return;this.hit=1;const R=2.5;
    all(G).forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<=reach(e,R))hurt(G,e,400)});
    allies(G,null).forEach(u=>{if(Math.hypot(u.x-x,u.y-y)>R+(u.size||2)*.3)return;if(u===G.pl){u.cs=u.cs||{};const c=u.cs.abs;u.cs.abs={v:Math.max(300,c&&c.t>0?c.v:0),t:6,max:300};u.cs.circ=true}else u.shd={v:Math.max(300,(u.shd&&u.shd.t>0&&u.shd.v)||0),t:6,max:300}});
    blds(G,null).forEach(b=>{if(Math.hypot(b.x-x,b.y-y)<=R+Math.max(b.w,b.h)*.4)heal(b,200/DB())});vis(G,{k:'boom',x,y,h:.3,max:.6,c:'#9fe8ff'})}})};

/* ============ 2034 · Chất lỏng sắt từ ============ */
X.init[2034]=(G,S)=>{S.a=0};
X.step[2034]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a<5)return;S.a-=5;const L=all(G).filter(e=>inR(Rg,e,0));
  L.forEach(e=>{hurt(G,e,200);push(G,e,e.x-S.cx,e.y-S.cy,1);vis(G,{k:'fspike',x:e.x,y:e.y,max:.7})});if(L.length)pop(G,S.cx,S.cy-3,'Gai sắt từ đâm '+L.length+' mục tiêu','#c8d0e0')};

Object.assign(window.C49TXT,{
 2025:'mỗi 5 giây dệt 1 đường lụa (mỗi mục tiêu bị hạ trong thảm rút ngắn 1 giây, ngoài thảm 0,5 giây); đủ 15 đường lập tức dựng 1 bức tường lụa cao 7 ô, dài 1×6 ô, 800 máu chắn trước mặt thảm về phía có nhiều công trình địch nhất, kẻ địch ưu tiên tấn công bức tường',
 2026:'mỗi 8 giây hoàn thành 1 chữ thư pháp; mỗi chữ hoàn thành giảm 2 giây thời gian hồi sinh cho tàu đang chờ hồi sinh lâu nhất',
 2027:'công trình bị phá hủy dựng lên 1 cối xay gió cao 6 ô, 800 máu, là mục tiêu ưu tiên của địch; tàu đồng minh bị hạ hóa thành 1 bông tulip màu bất kỳ tại chỗ trong 15 giây (100 máu), mỗi giây gây 30 sát thương trong 3 ô',
 2028:'cứ 3 mục tiêu bị hạ trong thảm thì 5 bướm vua vàng bay ra (80 máu, đánh gần 10 sát thương, ưu tiên mục tiêu đang bị phe ta nhắm); công trình bị phá hủy mọc 1 cây cao 5 ô, 500 máu trong 15 giây, là mục tiêu ưu tiên của địch, cứ 2 giây sinh 1 bướm vua',
 2029:'mỗi tàu đồng minh bị hạ trong thảm gọi 1 con thú tại ô trống của thảm: 50% ngựa vằn (250 máu, 50 sát thương), 30% đà điểu (100 máu, 30 sát thương), còn lại linh dương sừng (200 máu, 40 sát thương); đủ 30 con thì cả đàn đồng loạt lao vào công trình địch',
 2030:'vào trận mọi tàu và công trình được phủ lông hồng hạc +100 giáp trong 15 giây đầu; mỗi tàu đồng minh bị hạ tạo 1 con hồng hạc (400 máu) đứng yên tại ô trống của thảm, là mục tiêu ưu tiên của tàu và công trình địch, tối đa 25 con',
 2031:'cứ 5 tàu đồng minh hoặc 5 công trình bị phá hủy thì 1 con voi xuất hiện tại ô trống của thảm: 50% voi mẹ (1.000 máu, 200 sát thương, cao 8 ô) hoặc 50% voi con (500 máu, 100 sát thương, cao 4 ô); voi đánh lần lượt từng kẻ đã gây sát thương lên nó; mỗi 5 giây hồ nước hồi 20 máu cho mọi đồng minh và công trình trong thảm',
 2032:'mỗi 6 giây 1 người que đen xuất hiện ở vùng tối của thảm (300 máu), nhảy vũ điệu fractal liên tục, di chuyển 4 ô mỗi giây theo điệu nhảy về phía mục tiêu và gây 30 sát thương mỗi giây trong 5 ô xung quanh',
 2033:'mỗi 3 giây 1 giọt nơtron từ trời rơi xuống vị trí bất kỳ trong thảm: hồi 200 máu cho công trình, +300 giáp cho đồng minh và gây 400 sát thương lên kẻ địch trong tầm rơi',
 2034:'mỗi 5 giây gai sắt từ trồi lên đâm mọi mục tiêu đang ở trong thảm: 200 sát thương và đẩy lùi 1 ô'});
})();
