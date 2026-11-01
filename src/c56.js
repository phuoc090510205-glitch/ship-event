/* ===== c56: thảm Phòng trưng bày siêu xe — 5 đợt 8 siêu xe chạy qua thảm, đợt 6 siêu xe đỏ khổng lồ ===== */
(function(){
if(!window.C40||!C40.H2||!window.C49TXT)return;
const X=C40.X,{enemies,hurt,pop,unit,rnd}=C40.H;
const COL=['#ffffff','#1c1c22','#2f7dff','#ffd02a','#2ecc71','#9b4dff','#ff8a1a','#c4c8d0'];
const stun=(e,t)=>{if(!e||e.dead)return;e.stun=Math.max(e.stun||0,t*(e.boss?1/3:1))};
const push=(G,e,dx,dy,d)=>{if(!e||e.dead||e.sb)return;const k=d*(e.boss?.3:1);e.x+=dx*k;e.y+=dy*k;try{e.x=Math.max(.5,Math.min(G.wd.Wd-.5,e.x));e.y=Math.max(.5,Math.min(G.wd.Hd-.5,e.y))}catch(x){}};
function lane(Rg,off){const h=Math.random()<.5,s=Math.random()<.5?1:-1;let x,y,dx=0,dy=0,L;
  if(h){y=rnd(Rg.y0+.5,Rg.y1-.5);x=s>0?Rg.x0-off:Rg.x1+off;dx=s;L=(Rg.x1-Rg.x0)+2*off}else{x=rnd(Rg.x0+.5,Rg.x1-.5);y=s>0?Rg.y0-off:Rg.y1+off;dy=s;L=(Rg.y1-Rg.y0)+2*off}
  return {x,y,dx,dy,L}}
function car(G,S,big,col){const p=lane(S.Rg,big?12:8);return unit(G,S,{k:'scar',x:p.x,y:p.y,dx:p.dx,dy:p.dy,L:p.L,run:0,prep:3,hp:big?400:100,size:big?6:1.3,hr:big?2.6:.7,sp:big?5:4,dmg:big?300:200,pd:big?9:1,st:big?1:0,big:big?1:0,col,hitS:new Set(),ang:Math.atan2(p.dy,p.dx),born:G.t,noT:1})}
X.init[1005]=(G,S)=>{S.a=9;S.w=0};
X.step[1005]=(G,S,dt,E,Rg)=>{S.a+=dt;
  if(S.a>=12){S.a-=12;S.w++;if(S.w<=5){COL.forEach(c=>car(G,S,0,c));pop(G,(Rg.x0+Rg.x1)/2,Rg.y0-1.5,'Đợt siêu xe '+S.w+'/5','#ffffff')}else{car(G,S,1,'#e8101a');S.w=0;pop(G,(Rg.x0+Rg.x1)/2,Rg.y0-1.5,'Siêu xe đỏ khổng lồ!','#ff4a4a')}}
  S.u.forEach(u=>{if(u.k!=='scar'||u.dead)return;if(u.prep>0){u.prep-=dt;return}const st=u.sp*dt;u.x+=u.dx*st;u.y+=u.dy*st;u.run+=st;u.mv=1;
    const r=u.big?2.6:.9;enemies(G,null,0).forEach(e=>{if(u.hitS.has(e))return;if(Math.hypot(e.x-u.x,e.y-u.y)>r+(e.size||2)*.3)return;u.hitS.add(e);hurt(G,e,u.dmg);push(G,e,u.dx,u.dy,u.pd);if(u.st)stun(e,u.st)});
    if(u.run>=u.L){u.dead=true;u.gone=1;u.fx3=1}})};
window.C49TXT[1005]='mỗi 12 giây 8 siêu xe 8 màu (không có đỏ) xuất phát cách thảm 8 ô, chuẩn bị 3 giây rồi chạy 4 ô/giây băng qua thảm tới cách thảm 8 ô; mỗi xe 100 máu, tông kẻ địch 200 sát thương và đẩy lùi 1 ô; sau 5 đợt, đợt thứ 6 là siêu xe đỏ khổng lồ (to gấp 5, cao 4 ô, 400 máu) chờ cách thảm 12 ô, chuẩn bị 3 giây rồi lao 5 ô/giây, tông 300 sát thương, hất xa 9 ô và choáng 1 giây';
})();
