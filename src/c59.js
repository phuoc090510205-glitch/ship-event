/* ===== c59: thảm Người giàu — Sân polo quý tộc, Sân tennis cỏ danh giá, Cuộc đua thuyền buồm Regatta ===== */
(function(){
if(!window.C40||!C40.H2||!window.C49TXT)return;
const X=C40.X,{enemies,blds,hurt,pop,vis,unit,rnd,dist,inR}=C40.H,{fight,live}=C40.H2;
const SVS=()=>{try{return S}catch(e){return null}},SAVE=()=>{try{save()}catch(e){}};
const stun=(e,t)=>{if(e&&!e.dead)e.stun=Math.max(e.stun||0,t*(e.boss?1/3:1))};
const push=(G,e,dx,dy,d)=>{if(!e||e.dead||e.sb)return;const l=Math.hypot(dx,dy)||1,k=d*(e.boss?.3:1);e.x+=dx/l*k;e.y+=dy/l*k;try{e.x=Math.max(.5,Math.min(G.wd.Wd-.5,e.x));e.y=Math.max(.5,Math.min(G.wd.Hd-.5,e.y))}catch(x){}};
const all=G=>(G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t));
const reach=(e,r)=>r+(e.size||2)*.3;
const hq=G=>(G.bl||[]).find(b=>(b.t==='hq'||b.hq)&&!b.c39tmp&&b.hp>0);
/* ============ 1015 · Sân polo quý tộc ============ */
const HEL=['#ffd700','#2f7dff','#2ecc71','#9b4dff','#ff8a1a','#00d2d2','#ff4fa8','#ffffff','#e8302a','#c4c8d0'],HOR=['#3a2414','#8a5a2a','#f2efe8','#1a1a1a','#c8a070','#7a7a80','#b07a40'];
/* quà: càng cao càng hiếm, mốc cao nhất 0,4% */
const RW=[['da',40,30],['da',80,18],['da',150,10],['da',300,5],['da',600,1.6],['da',1200,.4],['sao',3,20],['sao',6,9],['sao',12,4],['sao',20,1.6],['sao',40,.4]];
function roll(){let r=Math.random()*100;for(const q of RW){if((r-=q[2])<0)return q}return RW[0]}
function slot(G,S,i){const H=hq(G);const cx=G.wd?G.wd.Wd/2:S.cx,cy=G.wd?G.wd.Hd/2:S.cy;if(!H)return {x:S.cx-3+i,y:S.cy+3,a:0};let dx=H.x-cx,dy=H.y-cy,l=Math.hypot(dx,dy);if(l<.5){dx=0;dy=1;l=1}dx/=l;dy/=l;const back=Math.max(H.w,H.h)/2+2.5,px=-dy,py=dx,o=(i-3)*1.5;return {x:H.x+dx*back+px*o,y:H.y+dy*back+py*o,a:Math.atan2(-dy,-dx)}}
function rider(G,S,i){const p=slot(G,S,i);return unit(G,S,{k:'polo',i,x:p.x,y:p.y,ang:p.a,hp:500,size:1.4,hr:.8,col:HOR[i%HOR.length],hel:HEL[Math.floor(Math.random()*HEL.length)],cd:0,born:G.t})}
X.init[1015]=(G,S)=>{S.a=0;S.go=0;S.hel=[];S.rs={};for(let i=0;i<7;i++)rider(G,S,i)};
X.step[1015]=(G,S,dt,E,Rg)=>{S.a+=dt;if(!S.go&&S.a>=15){S.go=1;pop(G,S.cx,S.cy-4,'Kỵ binh polo xung trận!','#ffe6a8')}
  const rs=live(S,'polo');for(let i=0;i<7;i++){if(rs.some(u=>u.i===i))continue;S.rs[i]=(S.rs[i]||0)+dt;if(S.rs[i]>=30){S.rs[i]=0;const u=rider(G,S,i);u.wait=S.go?2:0}}
  rs.forEach(u=>{u.cd-=dt;u.mv=0;if(!S.go||(u.wait=Math.max(0,(u.wait||0)-dt))>0){const p=slot(G,S,u.i);u.x+=(p.x-u.x)*Math.min(1,dt*2);u.y+=(p.y-u.y)*Math.min(1,dt*2);return}
    const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(!tg)return;const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1,rc=reach(tg,1.6);u.ang=Math.atan2(dy,dx);
    if(l>rc-.2){const s=Math.min(l-rc+.2,8/1.5*dt);u.x+=dx/l*s;u.y+=dy/l*s;u.mv=1}
    if(l<=rc&&u.cd<=0){u.cd=1;u.sw=.35;hurt(G,tg,120);if(tg.dead||tg.hp<=0){const q=roll();S.hel.push({x:tg.x,y:tg.y,col:u.hel,t:0,q})}}
    u.sw=Math.max(0,(u.sw||0)-dt)});
  S.hel=S.hel.filter(h=>{h.t+=dt;if(h.t>=2&&!h.got){h.got=1;const SS=SVS();if(SS){if(h.q[0]==='da')SS.da=(SS.da||0)+h.q[1];else SS.sao=(SS.sao||0)+h.q[1];SAVE()}pop(G,h.x,h.y-2,'+'+h.q[1]+(h.q[0]==='da'?' Đá':' Sao'),h.q[0]==='da'?'#8fd8ff':'#ffd700')}return h.t<2.6})};
/* ============ 1016 · Sân tennis cỏ danh giá ============ */
X.init[1016]=(G,S)=>{S.a=0;S.cam=1;S.tb=[];S.k=0};
X.step[1016]=(G,S,dt,E,Rg)=>{S.a+=dt;const B=blds(G,Rg).concat([hq(G)]).filter((b,i,a)=>b&&b.hp>0&&a.indexOf(b)===i);
  if(S.cam){if(S.a<13){B.forEach(b=>{b.smk=Math.max(b.smk||0,13-S.a)})}else{S.cam=0;S.k=0;B.forEach(b=>{b.smk=0;const r=Math.max(b.w||1,b.h||1)/2+3;all(G).forEach(e=>{if(Math.hypot(e.x-b.x,e.y-b.y)<=reach(e,r)){if(!e.c59t||e.c59t!==G.t){e.c59t=G.t;hurt(G,e,200)}}});vis(G,{k:'boom',x:b.x,y:b.y,h:.5,max:.6,c:'#c8ff8a'})});pop(G,S.cx,S.cy-4,'Lộ diện! 200 sát thương quanh công trình','#c8ff8a')}return}
  S.k+=dt;if(S.k>=5){const L=all(G).filter(e=>inR(Rg,e,4));if(L.length){S.k=0;const e=L[Math.floor(Math.random()*L.length)];S.tb.push({e,x0:S.cx,y0:S.cy,t:0,T:.6})}else S.k=5}
  S.tb=S.tb.filter(b=>{b.t+=dt;const e=b.e;if(!e.dead){b.ex=e.x;b.ey=e.y}const k=Math.min(1,b.t/b.T);b.x=b.x0+(b.ex-b.x0)*k;b.y=b.y0+(b.ey-b.y0)*k;b.h=Math.sin(k*Math.PI)*2.5+.3;if(k>=1){if(!e.dead){hurt(G,e,50);stun(e,.5)}return false}return true})};
/* ============ 1017 · Cuộc đua thuyền buồm Regatta ============ */
const SAIL=['#ff4a4a','#ffd02a','#2f7dff','#2ecc71','#ff8a1a','#9b4dff','#00d2d2','#ff4fa8','#ffffff','#ffe066','#7ad0ff','#c4ff4a'];
X.init[1017]=(G,S)=>{S.a=10;S.n=0;S.y=null};
X.step[1017]=(G,S,dt,E,Rg)=>{const bs=live(S,'sboat');
  if(!S.y){S.a+=dt;if(S.a>=12){S.a-=12;const x=rnd(Rg.x0,Rg.x1),y=rnd(Rg.y0,Rg.y1);unit(G,S,{k:'sboat',x,y,hp:200,size:1.2,hr:.7,col:SAIL[S.n++%SAIL.length],ang:Math.random()*6.28,cd:0,born:G.t,wt:Math.random()*6});pop(G,x,y-2,'Thuyền buồm '+(bs.length+1)+'/12','#e8f8ff')}}
  bs.forEach(u=>{u.cd-=dt;const tg=enemies(G,Rg,6).sort((a,b)=>dist(a,u)-dist(b,u))[0];let ta;if(tg)ta=Math.atan2(tg.y-u.y,tg.x-u.x);else{u.wt+=dt*.5;const tx=S.cx+Math.cos(u.wt)*6,ty=S.cy+Math.sin(u.wt*1.3)*6;ta=Math.atan2(ty-u.y,tx-u.x)}
    let da=ta-u.ang;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;u.ang+=Math.max(-3*dt,Math.min(3*dt,da));u.x+=Math.cos(u.ang)*3.5*dt;u.y+=Math.sin(u.ang)*3.5*dt;u.x=Math.max(Rg.x0-6,Math.min(Rg.x1+6,u.x));u.y=Math.max(Rg.y0-6,Math.min(Rg.y1+6,u.y));
    if(tg&&u.cd<=0&&Math.hypot(tg.x-u.x,tg.y-u.y)<=reach(tg,1.1)){u.cd=1;hurt(G,tg,10);push(G,tg,Math.cos(u.ang),Math.sin(u.ang),1)}});
  if(!S.y&&bs.length>=12){bs.forEach(u=>{all(G).forEach(e=>{if(Math.hypot(e.x-u.x,e.y-u.y)<=reach(e,3))hurt(G,e,500)});vis(G,{k:'boom',x:u.x,y:u.y,h:.4,max:.7,c:u.col});u.dead=true;u.fx3=1});
    const s=Math.random()<.5?1:-1,y=S.cy;S.y=unit(G,S,{k:'ryacht',x:s>0?Rg.x0-22:Rg.x1+22,y,dx:s,x1:s>0?Rg.x1+22:Rg.x0-22,hp:1200,size:6,hr:4,h:0,ang:s>0?0:Math.PI,born:G.t,hit:new Set()});S.a=0;pop(G,S.cx,S.cy-5,'12 thuyền phát nổ · du thuyền trắng hùng vĩ tiến vào!','#ffffff')}
  const Y=S.y;if(Y){if(Y.dead){if(!Y.done){all(G).forEach(e=>{if(Math.hypot(e.x-Y.x,e.y-Y.y)<=reach(e,7))hurt(G,e,5000)});vis(G,{k:'boom',x:Y.x,y:Y.y,h:2,max:1.2,c:'#ffd08a'});pop(G,Y.x,Y.y-4,'Du thuyền nổ tung! 5.000 sát thương','#ffb040')}S.y=null;return}
    Y.x+=Y.dx*4*dt;all(G).forEach(e=>{if(Y.hit.has(e))return;if(Math.abs(e.x-Y.x)<=17.5+(e.size||2)*.3&&Math.abs(e.y-Y.y)<=3+(e.size||2)*.3){Y.hit.add(e);hurt(G,e,300);vis(G,{k:'boom',x:e.x,y:e.y,h:.3,max:.4,c:'#ffffff'})}});
    if((Y.dx>0&&Y.x>=Y.x1)||(Y.dx<0&&Y.x<=Y.x1)){Y.done=1;Y.dead=true;Y.fx3=1;S.y=null}}};
Object.assign(window.C49TXT,{
 1015:'triệu hồi sẵn 7 kỵ binh polo (500 máu, cầm giáo, mũ nhiều màu) sau trụ sở, tốc chạy 8 ô mỗi 1,5 giây; 15 giây sau khi trận bắt đầu đồng loạt lao lên, mỗi đòn 120 sát thương; mỗi mục tiêu bị hạ để lại 1 chiếc mũ quà thưởng: 40–1.200 Đá hoặc 3–40 Sao (quà càng cao càng hiếm, mốc cao nhất chỉ 0,4%)',
 1016:'ngụy trang mọi công trình và trụ sở trên thảm trong 13 giây đầu trận (kẻ địch không nhắm vào được); khi lộ diện gây 200 sát thương lên mục tiêu trong 3 ô quanh mỗi công trình; sau đó mỗi 5 giây tung 1 quả bóng tennis vào 1 mục tiêu trong phạm vi: 50 sát thương và choáng 0,5 giây',
 1017:'mỗi 12 giây triệu hồi 1 thuyền buồm nhỏ nhiều màu (200 máu) húc mục tiêu 10 sát thương và đẩy nhẹ 1 ô; đủ 12 thuyền thì cả 12 phát nổ (500 sát thương trong 3 ô) và du thuyền trắng hùng vĩ (cao 12 ô, dài 35 ô, 1.200 máu) chạy qua thảm gây 300 sát thương lên mọi mục tiêu va phải; nếu bị phá hủy, du thuyền nổ tung 5.000 sát thương trong 7 ô'});
})();
