/* ===== c57: thảm Người giàu — Đường đua F1, Đường băng chuyên cơ, Khoang chuyên cơ riêng, Sân đỗ trực thăng tầng thượng, Hồ bơi vô cực hoàng hôn ===== */
(function(){
if(!window.C40||!C40.H2||!window.C49TXT)return;
const X=C40.X,{enemies,allies,blds,hurt,pop,vis,unit,shield,heal,rnd,dist,DBk}=C40.H,{fight,live}=C40.H2;
const DB=()=>DBk();
const stun=(e,t)=>{if(e&&!e.dead)e.stun=Math.max(e.stun||0,t*(e.boss?1/3:1))};
const push=(G,e,dx,dy,d)=>{if(!e||e.dead||e.sb)return;const k=d*(e.boss?.3:1);e.x+=dx*k;e.y+=dy*k;try{e.x=Math.max(.5,Math.min(G.wd.Wd-.5,e.x));e.y=Math.max(.5,Math.min(G.wd.Hd-.5,e.y))}catch(x){}};
const all=G=>(G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t));
const hq=G=>(G.bl||[]).find(b=>(b.t==='hq'||b.hq)&&!b.c39tmp&&b.hp>0);
const kill=(G,e)=>{try{if(e.boss)hurt(G,e,e.max*.2/.35);else dfDmgS(e,e.hp+1e7)}catch(x){}};
function lane(Rg,off){const h=Math.random()<.5,s=Math.random()<.5?1:-1;let x,y,dx=0,dy=0,L;
  if(h){y=rnd(Rg.y0+.5,Rg.y1-.5);x=s>0?Rg.x0-off:Rg.x1+off;dx=s;L=(Rg.x1-Rg.x0)+2*off}else{x=rnd(Rg.x0+.5,Rg.x1-.5);y=s>0?Rg.y0-off:Rg.y1+off;dy=s;L=(Rg.y1-Rg.y0)+2*off}return {x,y,dx,dy,L}}
/* ============ 1006 · Đường đua F1 phố biển ============ */
const F1C=['#ff2a2a','#ffffff','#1a1a1a','#2f7dff','#ffd02a','#2ecc71','#9b4dff','#ff8a1a','#00d2d2','#ff4fa8','#c4c8d0','#8a5a2a'];
X.init[1006]=(G,S)=>{S.a=1.5;S.n=0;S.ci=0};
X.step[1006]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=2){S.a-=2;const p=lane(Rg,4);unit(G,S,{k:'f1',x:p.x,y:p.y,dx:p.dx,dy:p.dy,L:p.L,run:0,prep:0,hp:100,size:1.1,hr:.6,sp:6,col:F1C[S.ci++%F1C.length],hitS:new Set(),ang:Math.atan2(p.dy,p.dx),born:G.t,noT:1});S.n++;
    if(S.n>=50){S.n=0;const y=(Rg.y0+Rg.y1)/2,span=Rg.y1-Rg.y0+4;vis(G,{k:'syacht',x:Rg.x0-14,y,span,len:Rg.x1-Rg.x0,x1:Rg.x1+14,hit:new Set(),max:30,up(G2,S2,dt2){this.x+=9*dt2;enemies(G,Rg,3).forEach(e=>{if(this.hit.has(e))return;if(e.x<=this.x+this.len*.5){this.hit.add(e);hurt(G,e,400);push(G,e,1,0,3);vis(G,{k:'boom',x:e.x,y:e.y,h:.4,max:.5,c:'#bfe3ff'})}});if(this.x>=this.x1)this.max=this.t+.01}});pop(G,S.cx,S.cy-4,'Du thuyền trắng băng qua!','#e8f8ff')}}
  S.u.forEach(u=>{if(u.k!=='f1'||u.dead)return;const st=u.sp*dt;u.x+=u.dx*st;u.y+=u.dy*st;u.run+=st;
    enemies(G,null,0).forEach(e=>{if(u.hitS.has(e))return;if(Math.hypot(e.x-u.x,e.y-u.y)>1+(e.size||2)*.3)return;u.hitS.add(e);hurt(G,e,50);push(G,e,u.dx,u.dy,1)});if(u.run>=u.L){u.dead=true;u.fx3=1}})};
/* ============ 1007 · Đường băng chuyên cơ ============ */
X.init[1007]=(G,S)=>{S.a=0;S.need=50;S.pl=null};
X.death[1007]=(G,S)=>{if(!S.pl)S.need=Math.max(1,S.need-1)};
X.step[1007]=(G,S,dt,E,Rg)=>{if(!S.pl){S.a+=dt;if(S.a>=S.need){S.a=0;S.need=50;const s=Math.random()<.5?1:-1,y=rnd(Rg.y0,Rg.y1);S.pl={x:s>0?Rg.x0-30:Rg.x1+30,y,dx:s,x1:s>0?Rg.x1+30:Rg.x0-30,sp:16,hitDone:0,car:[]};pop(G,S.cx,S.cy-4,'Chuyên cơ cất cánh!','#ffffff')}return}
  const P=S.pl;P.x+=P.dx*P.sp*dt;
  if(!P.hitDone&&((P.dx>0&&P.x>=(Rg.x0+Rg.x1)/2)||(P.dx<0&&P.x<=(Rg.x0+Rg.x1)/2))){P.hitDone=1;const L=all(G).filter(e=>Math.abs(e.y-P.y)<=15&&e.x>=Rg.x0-14&&e.x<=Rg.x1+14);const d=L.length?3000/L.length:0;
    L.forEach(e=>{hurt(G,e,d);if(!e.dead&&!e.boss&&!e.sb&&Math.random()<.5){P.car.push({e,ox:e.x-P.x,oy:e.y-P.y})}});if(L.length)pop(G,P.x,P.y-3,L.length+' mục tiêu · '+Math.round(d)+' sát thương mỗi mục tiêu · cuốn theo '+P.car.length,'#ffffff')}
  P.car.forEach(c=>{const e=c.e;if(e.dead)return;e.x=P.x+c.ox*.3;e.y=P.y+c.oy*.3;stun(e,.2);e.noFire=Math.max(e.noFire||0,.2);e.c57up=1});
  if((P.dx>0&&P.x>=P.x1)||(P.dx<0&&P.x<=P.x1)){P.car.forEach(c=>{if(!c.e.dead)kill(G,c.e);c.e.c57up=0});vis(G,{k:'boom',x:P.x,y:P.y,h:6,max:1.2,c:'#ffb040'});pop(G,P.x,P.y-3,'Chuyên cơ phát nổ!','#ffb040');S.pl=null}};
/* ============ 1008 · Khoang chuyên cơ riêng ============ */
X.init[1008]=(G,S)=>{S.a=0;S.ph=0};
X.step[1008]=(G,S,dt,E,Rg)=>{S.a+=dt;
  if(S.ph===0&&S.a>=80){S.ph=1;S.a=0;S.sp=0;pop(G,S.cx,S.cy-4,'Khoang chuyên cơ đóng lại!','#e8f0ff')}
  else if(S.ph===1){S.sp+=dt;while(S.sp>=1){S.sp-=1;['#1a2a6a','#c8102e'].forEach((c,i)=>{const x=rnd(Rg.x0+.8,Rg.x1-.8),y=rnd(Rg.y0+.8,Rg.y1-.8);unit(G,S,{k:'stick',col:c,x,y,hp:200,size:1,hr:.6,cd:.5,att:1,born:G.t})})}
    live(S,'stick').forEach(u=>{if(u.att)fight(G,S,u,dt,{scan:4,range:1.1,speed:3,cd:1,dmg:20})});
    if(S.a>=25){S.ph=2;S.a=0;live(S,'stick').forEach(u=>{if(!u.att)return;enemies(G,null,0).forEach(e=>{if(dist(e,u)<=3+(e.size||2)*.3)hurt(G,e,300)});vis(G,{k:'boom',x:u.x,y:u.y,h:.6,max:.6,c:'#ffb060'});u.dead=true;u.fx3=1});pop(G,S.cx,S.cy-4,'Bầu trời chuyển xanh · bão axit kéo đến','#7dff8a')}}
  else if(S.ph===2&&S.a>=5){S.ph=3;S.a=0;S.acc=0}
  else if(S.ph===3){S.acc+=dt;while(S.acc>=.5){S.acc-=.5;all(G).forEach(e=>{if(e.sb){hurt(G,e,200);e.noFire=Math.max(e.noFire||0,5)}else hurt(G,e,40)})}if(S.a>=5){S.ph=0;S.a=0}}};
/* ============ 1009 · Sân đỗ trực thăng tầng thượng ============ */
X.init[1009]=(G,S)=>{S.a=17;S.h=null;S.bombs=[]};
X.step[1009]=(G,S,dt,E,Rg)=>{S.bombs=S.bombs.filter(b=>{b.t+=dt;if(b.t>=.7&&!b.hit){b.hit=1;enemies(G,null,0).forEach(e=>{if(Math.hypot(e.x-b.x,e.y-b.y)<=2+(e.size||2)*.3)hurt(G,e,300)});vis(G,{k:'boom',x:b.x,y:b.y,h:.3,max:.6,c:'#ff8a3a'})}return b.t<.9});
  let h=S.h;if(!h||h.dead){if(h&&h.dead&&!S.down){S.down=1;S.a=0}S.h=null;S.a+=dt;if(S.a>=20){S.a=0;S.down=0;const sd=Math.random()<.5?-1:1;h=S.h=unit(G,S,{k:'heli',x:S.cx+sd*((Rg.x1-Rg.x0)/2+12),y:S.cy,hp:1200,size:2,hr:1.1,h:6,ph:Math.random()*6,born:G.t,c57:1,gcd:0,bcd:3,spot:{x:S.cx,y:S.cy}});h.ang=Math.atan2(S.cy-h.y,S.cx-h.x);pop(G,h.x,h.y-3,'Trực thăng đen xuất kích!','#cfd8e8')}return}
  const age=G.t-h.born;if(age>=30){h.leave=(h.leave||0)+dt;h.x+=Math.cos(h.ang+Math.PI)*8*dt;h.y+=Math.sin(h.ang+Math.PI)*8*dt;h.h+=dt*3;h.fire=0;if(h.leave>3){h.dead=true;h.fx3=1}return}
  h.spot.x=S.cx+Math.sin(G.t*.7)*(Rg.x1-Rg.x0)*.35;h.spot.y=S.cy+Math.cos(G.t*.9)*(Rg.y1-Rg.y0)*.35;if(age<2){h.fire=0;return}
  h.bcd-=dt;if(h.bcd<=0&&age>=3){h.bcd=3;for(let i=0;i<2;i++)S.bombs.push({x:rnd(Rg.x0,Rg.x1),y:rnd(Rg.y0,Rg.y1),t:0})}
  const tg=all(G).filter(e=>dist(e,h)<=16).sort((a,b)=>dist(a,h)-dist(b,h))[0];h.tg=tg;h.fire=!!tg;if(tg){h.ang=Math.atan2(tg.y-h.y,tg.x-h.x);h.gcd-=dt;while(h.gcd<=0){h.gcd+=1/12;hurt(G,tg,14)}}};
/* ============ 1010 · Hồ bơi vô cực hoàng hôn ============ */
const SKC=['#ff6a3a','#ffd02a','#2f7dff','#2ecc71','#ff4fa8','#9b4dff','#00d2d2','#ffffff','#ff8a1a'];
function hotelSpot(G,S,h){let Rg=null;try{Rg=C39.region(G)}catch(e){}const Wd=G.wd?G.wd.Wd:99,Hd=G.wd?G.wd.Hd:99;
  const bad=(x,y)=>x<1.5||y<1.5||x>Wd-1.5||y>Hd-1.5||(Rg&&x>Rg.x0-1.6&&x<Rg.x1+1.6&&y>Rg.y0-1.6&&y<Rg.y1+1.6)||(G.bl||[]).some(b=>b.hp>0&&Math.abs(b.x-x)<b.w/2+1.2&&Math.abs(b.y-y)<b.h/2+1.2)||S.u.some(u=>!u.dead&&u.k==='hotel'&&Math.hypot(u.x-x,u.y-y)<2.2);
  const cx=Rg?(Rg.x0+Rg.x1)/2:h.x,cy=Rg?(Rg.y0+Rg.y1)/2:h.y,R0=Rg?Math.max(Rg.x1-Rg.x0,Rg.y1-Rg.y0)/2:6;
  for(let ring=0;ring<6;ring++)for(let i=0;i<40;i++){const a=rnd(0,Math.PI*2),r=R0+2.2+ring*1.6+rnd(0,1),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(!bad(x,y))return [x,y]}
  return [cx+R0+3,cy]}
X.init[1010]=(G,S)=>{S.a=10;S.sun=0;S.sunHP=500;S.buff=0};
X.step[1010]=(G,S,dt,E,Rg)=>{const H=hq(G);S.a+=dt;const hot=live(S,'hotel');
  if(S.a>=12&&H){S.a-=12;if(S.made===undefined)S.made=0;if(hot.length<14){const p=hotelSpot(G,S,H);unit(G,S,{k:'hotel',x:p[0],y:p[1],hp:300,size:1.8,hr:1,v:Math.floor(Math.random()*5),born:G.t,sc:6});pop(G,p[0],p[1]-3,'Khách sạn biển mới','#ffd9a0')}}
  hot.forEach(u=>{u.sc-=dt;if(u.sc<=0&&(u.made||0)<3){u.sc=8;u.made=(u.made||0)+1;unit(G,S,{k:'stick',col:SKC[Math.floor(Math.random()*SKC.length)],x:u.x+rnd(-.6,.6),y:u.y+1,hp:200,size:1,hr:.6,cd:.5,hs:1,born:G.t})}});
  live(S,'stick').forEach(u=>{if(u.hs)fight(G,S,u,dt,{scan:10,range:1.1,speed:3,cd:1,dmg:50})});
  const full=live(S,'hotel').length>=14&&S.sunHP>0;S.sun=Math.max(0,Math.min(1,S.sun+(full?dt/5:-dt/5)));if(!full&&S.sun<=0&&S.sunHP<=0&&live(S,'hotel').length<14)S.sunHP=500;
  if(H){S.sx=H.x;S.sy=H.y;S.sr=Math.max(H.w,H.h)/2}
  const on=S.sun>=1;S.bt=(S.bt||0)-dt;
  if(on&&S.bt<=0){S.bt=2;const top=u=>{const sh=u.shd&&u.shd.t>0?u.shd.v:0;if(sh<200){u.shd={v:200,t:3,max:200}}};allies(G,null,0).forEach(top);live(S,'hotel').forEach(top);live(S,'stick').forEach(top);[H].forEach(b=>{if(b&&b.hp>0){const v=200/DB(),sh=b.shd&&b.shd.t>0?b.shd.v:0;if(sh<v)b.shd={v,t:3,max:v}}});if(!S.buff)pop(G,S.sx,S.sy-5,'Hoàng hôn vẫy gọi · +200 giáp · +10% tốc chạy','#ffb070')}
  const al=[G.pl].concat(G.al||[]).filter(a=>a&&!a.dead);if(on&&!S.buff){S.buff=1;al.forEach(a=>{if(!a.c57sp){a.c57sp=1;a.sp*=1.1;if(a.sp0)a.sp0*=1.1}})}else if(!on&&S.buff){S.buff=0;al.forEach(a=>{if(a.c57sp){a.c57sp=0;a.sp/=1.1;if(a.sp0)a.sp0/=1.1}})}
  /* mặt trời hoàng hôn có thể bị bắn: đơn vị ẩn ở vị trí trụ sở */
  if(S.sun>0&&H){let su=S.su;if(!su||su.dead){if(su&&su.dead){S.sunHP=0;S.sun=0;S.su=null;pop(G,H.x,H.y-5,'Mặt trời hoàng hôn tắt','#ffb070');return}su=S.su=unit(G,S,{k:'sunset',x:H.x,y:H.y,hp:S.sunHP,size:2,hr:Math.max(1,S.sr||1),h:12,noT:1,born:G.t})}su.x=H.x;su.y=H.y;S.sunHP=su.hp}
  else if(S.su&&!S.su.dead){S.su.dead=true;S.su.fx3=1;S.su=null}};
Object.assign(window.C49TXT,{
 1006:'mỗi 2 giây 1 xe F1 màu khác nhau băng qua thảm 6 ô/giây (100 máu), húc kẻ địch trong 1 ô gây 50 sát thương và đẩy lùi 1 ô; sau 50 lượt xe chạy qua, du thuyền trắng chạy ngang thảm gây 400 sát thương lên mọi kẻ địch trên thảm và đẩy đi 3 ô',
 1007:'mỗi 50 giây chuyên cơ trắng khổng lồ (dài 28 ô, sải cánh 30 ô, bay cao 12 ô) bay qua thảm — mỗi kẻ địch bị hạ rút ngắn 1 giây; 3.000 sát thương chia đều cho mọi mục tiêu bên dưới, 50% mục tiêu bị cuốn theo máy bay và bị kết liễu khi máy bay nổ cách thảm 30 ô',
 1008:'sau 80 giây khoang chuyên cơ đóng kín quanh thảm trong 25 giây, mỗi giây gọi 2 tiếp viên (1 nam 1 nữ, 200 máu, 20 sát thương/đòn, đánh kẻ địch trong 4 ô); hết giờ tiếp viên phát nổ 300 sát thương trong 3 ô, bầu trời chuyển xanh, bão axit kéo đến 5 giây rồi trút mưa axit 5 giây: tối đa 400 sát thương lên mọi kẻ địch, 2.000 lên công trình địch và công trình địch không thể tấn công',
 1009:'triệu hồi trực thăng đen (1.200 máu) lơ lửng cách thảm 12 ô, liên tục rọi đèn xuống thảm trong 30 giây rồi bay đi; sau 2 giây chuẩn bị: từ giây thứ 3 cứ 3 giây thả 2 quả bom xuống vị trí bất kỳ trên thảm (300 sát thương, 2 ô) và súng gatling bắn 12 viên/giây, mỗi viên 14 sát thương',
 1010:'mỗi 12 giây dựng 1 khách sạn biển (300 máu) bên ngoài thảm, tối đa 14; mỗi khách sạn 8 giây cho ra 1 người que (200 máu, 50 sát thương), tối đa 3 người que mỗi khách sạn; đủ 14 khách sạn: sau 5 giây mặt trời hoàng hôn (500 máu) hiện trên trụ sở 12 ô — mọi đồng minh, trụ sở, công trình, khách sạn, người que +200 giáp, đồng minh +10% tốc chạy; mất 1 khách sạn thì mặt trời từ từ tắt'});
})();
