/* ===== c48: thảm Người giàu — Ngọc Khảm (vòng quay ngọc), Lông Thú Bạch Kim (thú bạch kim), Cẩm Thạch Sảnh 7 Sao (xúc xắc 3 ô) ===== */
(function(){
if(!window.C40||!C40.H2)return;
const X=C40.X,{enemies,allies,blds,hurt,hurtPct,pop,vis,unit,inR,shield,BK,DBk,rnd,dist,isAlly}=C40.H,{fight,spot,live}=C40.H2;
const DB=()=>DBk(),sim=G=>!!(G.pv||G.c39sim||G.c18sim||G.tut),SV=()=>(typeof S!=='undefined'&&S&&S.da!=null)?S:window.S;
const give=(G,da,sao)=>{if(sim(G))return;try{const s=SV();s.da=(s.da||0)+da;s.sao=(s.sao||0)+sao;save();refresh()}catch(e){}};
const ccE=(e,d,f)=>{d*=BK(e);(f||['stun','noFire']).forEach(k=>e[k]=Math.max(e[k]||0,d))};

/* ---------- bảng kết quả góc trên bên trái ---------- */
let HUD=null;function hud(G,html,col){if(sim(G))return;if(!HUD){HUD=document.createElement('div');HUD.id='c48hud';HUD.style.cssText='position:fixed;left:8px;top:96px;z-index:8;max-width:min(320px,70vw);padding:6px 10px;border-radius:10px;background:rgba(6,14,40,.82);border:1.5px solid #4f8dff;color:#eaf2ff;font:600 12px system-ui,sans-serif;pointer-events:none;line-height:1.35';document.body.appendChild(HUD)}
  HUD.style.display='block';HUD.style.borderColor=col||'#4f8dff';HUD.innerHTML=html;HUD.c48g=G}
setInterval(()=>{if(!HUD)return;const G=DG,def=document.getElementById('def');if(!G||HUD.c48g!==G||G.done||(def&&def.style.display!=='block'))HUD.style.display='none'},500);

/* ================= 55 · Ngọc Khảm: mỗi 10 giây quay ngọc 2 giây ================= */
const GEM=[{k:'r',n:'Ngọc Đỏ',c:'#ff3a3a',t:'3 viên đạn lửa: +5% máu tối đa mục tiêu mỗi viên (toàn bộ tàu ta và công trình)'},{k:'p',n:'Ngọc Tím',c:'#c060ff',t:'3 viên đạn tím cho tàu ta: câm lặng 3 giây (cộng dồn), có thể thiêu tím 20 sát thương'},
  {k:'b',n:'Ngọc Xanh',c:'#3ab8ff',t:'3 viên đạn xanh: đẩy lùi 1 ô và choáng 1 giây (toàn bộ tàu ta và công trình)'},{k:'g',n:'Ngọc Lục',c:'#3aff7a',t:'mọc 1 cây 300 máu trong thảm'}];
X.init[55]=(G,S)=>{S.cd=10;S.roll=null;S.last=null;hud(G,'💎 Ngọc khảm · lần quay đầu sau 10 giây','#3ab8ff')};
X.death[55]=(G,S,u,isB,ins)=>{if(isB&&ins)S.cd-=2;else if(!isB&&isAlly(G,u))S.cd-=1;else if(!isB&&(G.en||[]).includes(u)&&ins)S.cd-=.5};
X.step[55]=(G,S,dt,E,Rg)=>{if(S.roll){S.roll.t+=dt;if(S.roll.t<2){const g=GEM[Math.floor(S.roll.t*12)%4];hud(G,'💎 Ngọc khảm đang quay… <b style="color:'+g.c+'">'+g.n+'</b>',g.c);return}
    const g=S.roll.g;S.roll=null;S.last={g,t:G.t};S.cd=10;pop(G,S.cx,S.cy-3,g.n+'!',g.c);
    if(g.k==='g'){const p=spot(G,S);unit(G,S,{k:'gtree',x:p[0],y:p[1],hp:300,size:1.6,hr:.8,h:0,born:G.t})}
    else{const L=allies(G,null).concat(g.k==='p'?[]:blds(G,null).filter(b=>!b.c39tmp));L.forEach(u=>{u.c48s={k:g.k,n:3,c:g.c}})}
    hud(G,'💎 <b style="color:'+g.c+'">'+g.n+'</b> · '+g.t,g.c);return}
  S.cd-=dt;if(S.cd<=0){S.roll={t:0,g:GEM[Math.floor(Math.random()*4)]};pop(G,S.cx,S.cy-3,'Quay ngọc khảm!','#ffd36a')}
  else if(!S.last||G.t-S.last.t>6)hud(G,'💎 Ngọc khảm · quay tiếp sau '+Math.ceil(S.cd)+' giây'+(S.last?' · lần trước: <b style="color:'+S.last.g.c+'">'+S.last.g.n+'</b>':''),'#4f8dff')};
/* bắn: tiêu 1 viên ngọc và áp hiệu ứng lên mục tiêu */
function shot(G,u,tg){const c=u&&u.c48s;if(!c||c.n<=0||!tg||tg.dead)return;c.n--;
  if(c.k==='r'){hurtPct(G,tg,.05);vis(G,{k:'gemhit',x:tg.x,y:tg.y,c:c.c,max:.4})}
  else if(c.k==='p'){tg.silT=(tg.silT>0?tg.silT:0)+3*BK(tg);if(Math.random()<.5)(tg.c40dot=tg.c40dot||[]).push({dps:20/3*(G.dmM||1),until:G.t+3});vis(G,{k:'gemhit',x:tg.x,y:tg.y,c:c.c,max:.4})}
  else if(c.k==='b'){const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1,p=tg.boss?.35:1;tg.x+=dx/l*p;tg.y+=dy/l*p;ccE(tg,1);vis(G,{k:'gemhit',x:tg.x,y:tg.y,c:c.c,max:.4})}
  if(c.n<=0)u.c48s=null}
if(typeof dfFire==='function'){const _F=dfFire;dfFire=function(src,wp,tg,team){const r=_F.apply(this,arguments);try{const G=DG,S=G&&G.c40;if(S&&S.K===55&&team!=='e'&&src&&tg){const u=src.o||(G.bl||[]).find(b=>b.x===src.x&&b.y===src.y);if(u)shot(G,u,tg)}}catch(e){}return r}}

/* ================= 56 · Lông Thú Bạch Kim ================= */
const BEAST=[{k:'wolf',n:'Sói bạch kim'},{k:'bear',n:'Gấu bạch kim'},{k:'lion2',n:'Sư tử bạch kim'},{k:'eagle',n:'Đại bàng bạch kim'},{k:'furw',n:'Chiến binh lông bạch kim'}];
X.init[56]=(G,S)=>{S.cd=30};
X.death[56]=(G,S,u,isB,ins)=>{if(ins)S.cd=Math.max(0,S.cd-1)};
function beast(G,S){if(S.u.filter(u=>u.c48b&&!u.dead).length>=4)return;const B=BEAST[Math.floor(Math.random()*BEAST.length)],p=spot(G,S);unit(G,S,{k:'beast',bk:B.k,c48b:1,x:p[0],y:p[1],hp:800,size:B.k==='bear'?2:1.6,hr:.8,cd:.5,h:B.k==='eagle'?2.2:0,born:G.t});pop(G,p[0],p[1]-2.4,B.n+' xuất hiện!','#e8f0ff')}
X.step[56]=(G,S,dt,E,Rg)=>{S.cd-=dt;if(S.cd<=0){S.cd=30;beast(G,S)}C40.H2.every(S,'u1000',1000,()=>beast(G,S));
  S.u.forEach(u=>{if(!u.c48b||u.dead)return;fight(G,S,u,dt,{range:u.bk==='eagle'?2.5:1.9,dmg:200,cd:1.5,speed:u.bk==='eagle'?5:u.bk==='bear'?2.4:3.6})})};

/* ================= 57 · Cẩm Thạch Sảnh 7 Sao: đồng minh bị hạ → xúc xắc 3 ô (1–3) quay 3 giây ================= */
const DICE={3:'+3 Sao',4:'1 người lính que',5:'+5.000 Đá',6:'ngôi sao 8 cánh rơi · 700 sát thương',7:'+800 giáp cho mọi đồng minh trong 4 giây',8:'mưa 80 mảnh sao',9:'người đá khổng lồ'};
X.init[57]=(G,S)=>{S.q=0;S.dice=null};
X.death[57]=(G,S,u,isB)=>{if(isB||isAlly(G,u))S.q=Math.min(5,S.q+1)};
X.step[57]=(G,S,dt,E,Rg)=>{S.u.forEach(u=>{if(u.k==='golem'&&u.big&&!u.dead){u.life-=dt;if(u.life<=0){u.dead=true;return}u.cd-=dt;u.sw=Math.max(0,(u.sw||0)-dt);const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(!tg)return;const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1;u.ang=Math.atan2(dy,dx);if(l>2.5){u.x+=dx/l*Math.min(l-2.5,2*dt);u.y+=dy/l*Math.min(l-2.5,2*dt);u.walk=(u.walk||0)+dt}
      if(l<=3.2&&u.cd<=0){u.cd=5;u.sw=.6;enemies(G,null).forEach(e=>{if(Math.abs(e.x-tg.x)<=2+(e.size||2)*.3&&Math.abs(e.y-tg.y)<=2+(e.size||2)*.3)hurt(G,e,800)});vis(G,{k:'slam',x:tg.x,y:tg.y,max:.8})}}});
  live(S,'stick').forEach(u=>fight(G,S,u,dt,{range:1.6,dmg:14,cd:1,speed:2.6}));
  S.u.forEach(u=>{if(u.c48arm&&G.t>=u.c48arm.until){if(u.shd&&u.shd.t>0)u.shd.v=Math.max(0,Math.min(u.shd.v,u.c48arm.base));u.c48arm=null}});
  (G.bl||[]).concat(allies(G,null)).forEach(u=>{if(u.c48arm&&G.t>=u.c48arm.until){if(u.shd&&u.shd.t>0)u.shd.v=Math.max(0,Math.min(u.shd.v,u.c48arm.base));u.c48arm=null}});
  if(S.dice){const D=S.dice;D.t+=dt;if(D.t<3){D.show=D.r.map((v,i)=>D.t<1+i?1+Math.floor(Math.random()*3):v);hud(G,'🎲 Xúc xắc 7 sao: '+D.show.map((v,i)=>D.t<1+i?'<b>'+v+'</b>':'<b style="color:#ffd36a">'+v+'</b>').join(' + '),'#ffd36a');return}
    const sum=D.r.reduce((a,b)=>a+b,0);D.show=D.r.slice();D.sum=sum;
    if(D.t<5){hud(G,'🎲 Kết quả: <b style="color:#ffd36a">'+D.r.join(' + ')+' = '+sum+'</b> → '+DICE[sum]+' <span style="opacity:.75">(nhận sau '+Math.ceil(5-D.t)+' giây)</span>','#ffd36a');return}
    S.dice=null;S.last={sum,t:G.t};hud(G,'🎲 '+'Xúc xắc ra <b style="color:#ffd36a">'+sum+'</b> · '+DICE[sum],'#ffd36a');pop(G,S.cx,S.cy-3,'Xúc xắc '+sum+' · '+DICE[sum],'#ffd36a');dice(G,S,sum);return}
  if(S.q>0){S.q--;S.dice={t:0,r:[0,0,0].map(()=>1+Math.floor(Math.random()*3))}}};
function dice(G,S,n){const Rg=S.Rg;
  if(n===3)give(G,0,3);
  else if(n===4){const p=spot(G,S);unit(G,S,{k:'stick',col:'#e8e8f0',x:p[0],y:p[1],hp:200,size:1.1,hr:.55,life:5,cd:.3,h:0,born:G.t})}
  else if(n===5)give(G,5000,0);
  else if(n===6){const T=enemies(G,Rg,4),t=T.length?T[Math.floor(Math.random()*T.length)]:null,x=t?t.x:S.cx,y=t?t.y:S.cy;vis(G,{k:'star8',x,y,tg:t,max:1.3,up(G,S2,dt){if(this.tg&&!this.tg.dead){this.x=this.tg.x;this.y=this.tg.y}if(!this.hit&&this.t>=1.25){this.hit=1;enemies(G,null).forEach(e=>{if(Math.abs(e.x-this.x)<=2+(e.size||2)*.3&&Math.abs(e.y-this.y)<=2+(e.size||2)*.3)hurt(G,e,700)});vis(G,{k:'boom',x:this.x,y:this.y,h:.4,max:.8,c:'#ffe27a'})}}})}
  else if(n===7){blds(G,null).filter(b=>!b.c39tmp).concat(allies(G,null)).forEach(u=>{const isB=G.bl.includes(u),v=isB?800/DB():800,base=(u.shd&&u.shd.t>0&&u.shd.v)||0;shield(u,v);u.c48arm={until:G.t+4,base};vis(G,{k:'ring',x:u.x,y:u.y,c:'#e8f0ff',max:.6})})}
  else if(n===8){vis(G,{k:'starrain',x:S.cx,y:S.cy,P:[...Array(80)].map(()=>({x:rnd(Rg.x0-2,Rg.x1+2),y:rnd(Rg.y0-2,Rg.y1+2)})),max:3.2,up(G,S2,dt){if(!this.go&&this.t>=2){this.go=1;const T=enemies(G,Rg,4);this.P.forEach((p,i)=>{const t=T.length?T[i%T.length]:null;p.tg=t;p.tx=t?t.x:p.x;p.ty=t?t.y:p.y})}
    if(this.go&&!this.hit&&this.t>=2.6){this.hit=1;this.P.forEach(p=>{if(p.tg&&!p.tg.dead)hurt(G,p.tg,23)})}}})}
  else if(n===9){const p=spot(G,S);unit(G,S,{k:'golem',big:1,x:p[0],y:p[1],hp:2000,size:3,hr:1.5,life:12,cd:1,h:0,born:G.t});pop(G,p[0],p[1]-5,'Người đá khổng lồ!','#c9b48a')}}

Object.assign(window.C44TXT||(window.C44TXT={}),{55:'mỗi 10 giây quay ngọc khảm 2 giây (kết quả hiện trên thảm và góc trên bên trái): Đỏ cho tàu ta và công trình 3 viên đạn lửa +5% máu tối đa mục tiêu; Tím cho tàu ta 3 viên câm lặng 3 giây (cộng dồn) kèm thiêu tím; Xanh 3 viên đẩy lùi 1 ô và choáng 1 giây; Lục mọc 1 cây 300 máu. Tàu ta bị hạ giảm 1 giây, tàu địch 0,5 giây, công trình 2 giây',
  56:'mỗi 30 giây và mỗi 1.000 máu công trình mất gọi 1 thú bạch kim (sói, gấu, sư tử, đại bàng, chiến binh lông thú) 800 máu, 200 sát thương, tối đa 4; mỗi mục tiêu bị hạ trong thảm giảm 1 giây',
  57:'mỗi khi tàu ta hoặc công trình bị hạ, quay xúc xắc 3 ô (1–3) trong 3 giây: 3 → +3 Sao · 4 → lính que · 5 → +5.000 Đá · 6 → sao 8 cánh rơi 700 sát thương (4x4) · 7 → +800 giáp mọi đồng minh 4 giây · 8 → 80 mảnh sao, mỗi mảnh 23 · 9 → người đá cao 5 ô (2.000 máu, đập 800 sát thương 4x4 mỗi 5 giây, 12 giây)'});
})();
