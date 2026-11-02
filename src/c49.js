/* ===== c49: thảm Người giàu — Ngọc Trai, Đế Vương Tối Thượng, Siêu du thuyền, Bến du thuyền Monaco, Sòng bạc Monte Carlo, Bàn poker VIP, Két sắt Thụy Sĩ ===== */
(function(){
if(!window.C40||!C40.H2)return;
const X=C40.X,{enemies,allies,blds,hurt,pop,vis,unit,inR,shield,addHP,heal,BK,DBk,rnd,dist,isAlly}=C40.H,{fight,spot,live}=C40.H2;
const DB=()=>DBk(),sim=G=>!!(G.pv||G.c39sim||G.c18sim||G.tut),SV=()=>(typeof S!=='undefined'&&S&&S.da!=null)?S:window.S;
const give=(G,da,sao)=>{if(sim(G))return;try{const s=SV();s.da=(s.da||0)+da;s.sao=(s.sao||0)+sao;save();refresh()}catch(e){}};
const isBoss=u=>u&&(u.boss||(u.sh&&u.sh.bk)||u.c18boss),kill=(G,e)=>{try{dfDmgS(e,e.hp+1e7)}catch(x){}};
const hq=G=>(G.bl||[]).find(b=>(b.t==='hq'||b.hq)&&!b.c39tmp);
let HUD=null;function hud(G,html,col){if(sim(G))return;if(!HUD){HUD=document.createElement('div');HUD.style.cssText='position:fixed;left:8px;top:96px;z-index:8;max-width:min(320px,70vw);padding:6px 10px;border-radius:10px;background:rgba(6,14,40,.82);border:1.5px solid #4f8dff;color:#eaf2ff;font:600 12px system-ui,sans-serif;pointer-events:none;line-height:1.35';document.body.appendChild(HUD)}HUD.style.display='block';HUD.style.borderColor=col||'#4f8dff';HUD.innerHTML=html;HUD.c49g=G}
setInterval(()=>{if(!HUD)return;const G=DG,def=document.getElementById('def');if(!G||HUD.c49g!==G||G.done||(def&&def.style.display!=='block'))HUD.style.display='none'},500);
const revive=(G,n,f)=>{const D=(G.bl||[]).filter(b=>b.hp<=0&&b.t!=='mine'&&!b.c39tmp&&!(b.t==='hq'||b.hq));for(let i=0;i<n&&D.length;i++){const b=D.splice(Math.floor(Math.random()*D.length),1)[0];b.hp=b.max*f;b.flash=.5;vis(G,{k:'ring',x:b.x,y:b.y,c:'#ffd36a',max:.8})}};

/* ================= 58 · Ngọc Trai: mỗi mục tiêu bị hạ trong thảm +1 ngọc; đủ 100 → người đá ngọc ngà ================= */
X.init[58]=(G,S)=>{S.pearl=0};
X.death[58]=(G,S,u,isB,ins)=>{if(ins)S.pearl++};
X.step[58]=(G,S,dt,E,Rg)=>{if(S.pearl>=100&&!live(S,'pgolem').length){S.pearl-=100;const p=spot(G,S);unit(G,S,{k:'pgolem',x:p[0],y:p[1],hp:15000,size:5,hr:2.4,cd:1,h:0,born:G.t});try{if(window.R3D)R3D.shake=Math.max(R3D.shake||0,.6)}catch(x){}pop(G,p[0],p[1]-6,'Người đá ngọc ngà thức tỉnh!','#fff6ee')}
  live(S,'pgolem').forEach(u=>{u.cd-=dt;u.sw=Math.max(0,(u.sw||0)-dt);const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(!tg)return;const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1;u.ang=Math.atan2(dy,dx);
    if(l>3.5){u.x+=dx/l*Math.min(l-3.5,1.6*dt);u.y+=dy/l*Math.min(l-3.5,1.6*dt);u.walk=(u.walk||0)+dt}if(l<=4.5&&u.cd<=0){u.cd=3;u.sw=.8;enemies(G,null).forEach(e=>{if(Math.abs(e.x-tg.x)<=2.5+(e.size||2)*.3&&Math.abs(e.y-tg.y)<=2.5+(e.size||2)*.3)hurt(G,e,8000)});vis(G,{k:'slam',x:tg.x,y:tg.y,max:.9});try{if(window.R3D)R3D.shake=Math.max(R3D.shake||0,.4)}catch(x){}}})};

/* ================= 59 · Đế Vương Tối Thượng ================= */
X.init[59]=(G,S)=>{S.a=0;S.done=0};
X.step[59]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=10){S.a-=10;const B=blds(G,Rg).filter(b=>!b.c39tmp);if(B.length){const b=B[Math.floor(Math.random()*B.length)];addHP(b,2000,1);shield(b,500/DB());b.c40gold=1;b.c49n=(b.c49n||0)+1;pop(G,b.x,b.y-2.2,'Mạ vàng đế vương · +2.000 máu +500 giáp','#ffd36a')}}
  const h=hq(G);if(!S.done&&h&&h.hp>0&&h.hp<=h.max*.5){S.done=1;for(let i=0;i<10;i++){const p=spot(G,S);unit(G,S,{k:'stick',col:'#ffc23a',gold:1,x:p[0],y:p[1],hp:500,size:1.2,hr:.6,cd:.3+i*.05,h:0,born:G.t})}pop(G,h.x,h.y-3,'10 vệ binh vàng bảo vệ trụ sở!','#ffd36a')}
  live(S,'stick').forEach(u=>{if(u.gold)fight(G,S,u,dt,{range:4,dmg:200,cd:1.2,speed:2.6})})};

/* ================= 1000 · Siêu du thuyền boong gỗ tếch ================= */
X.init[1000]=(G,S)=>{S.a=20;S.done=0};
X.step[1000]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=25){S.a-=25;if(live(S,'heli').length<4){const p=spot(G,S);unit(G,S,{k:'heli',x:p[0],y:p[1],hp:300,size:2,hr:1,h:4.5,cd:1,born:G.t,ph:Math.random()*6});pop(G,p[0],p[1]-3,'Trực thăng xuất kích!','#bfe3ff')}}
  live(S,'heli').forEach(u=>{const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0]||enemies(G,Rg,6).sort((a,b)=>dist(a,u)-dist(b,u))[0];u.fire=0;
    if(tg){const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1;u.ang=Math.atan2(dy,dx);if(l>5){u.x+=dx/l*Math.min(l-5,4*dt);u.y+=dy/l*Math.min(l-5,4*dt)}if(l<=8){u.fire=1;u.tg=tg;hurt(G,tg,90*dt)}}else{u.x+=Math.cos(G.t*.5+u.ph)*dt;u.y+=Math.sin(G.t*.5+u.ph)*dt}});
  const h=hq(G);if(!S.done&&h&&h.hp>0&&h.hp<=h.max*.4){S.done=1;const y=(Rg.y0+Rg.y1)/2,span=Rg.y1-Rg.y0+4;vis(G,{k:'syacht',x:Rg.x0-14,y,span,len:Rg.x1-Rg.x0,x1:Rg.x1+14,hit:new Set(),max:30,up(G,S2,dt){this.x+=9*dt;enemies(G,Rg,3).forEach(e=>{if(this.hit.has(e))return;if(e.x<=this.x+this.len*.5){this.hit.add(e);hurt(G,e,4000);vis(G,{k:'boom',x:e.x,y:e.y,h:.4,max:.5,c:'#bfe3ff'})}});if(this.x>=this.x1)this.max=this.t+.01}});revive(G,3,.2);pop(G,S.cx,S.cy-4,'SIÊU DU THUYỀN! 4.000 sát thương · hồi sinh 3 công trình','#bfe3ff')}};

/* ================= 1001 · Bến du thuyền Monaco ================= */
const GUN=[{n:'Súng máy',d:12,c:'#ffd34a'},{n:'Pháo nhẹ',d:35,c:'#ff9a2a'},{n:'Laser',d:60,c:'#ff3a6a'},{n:'Tên lửa',d:110,c:'#ff6a2a'},{n:'Pháo plasma',d:150,c:'#3ad8ff'},{n:'Pháo ray',d:199,c:'#c77dff'}];
X.init[1001]=(G,S)=>{S.a=0};
X.step[1001]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=4){S.a-=4;if(live(S,'myacht').length<12){const p=spot(G,S);unit(G,S,{k:'myacht',x:p[0],y:p[1],hp:100,size:2,hr:1,h:0,cd:1.2,born:G.t,gun:GUN[Math.floor(Math.random()*GUN.length)],ang:Math.random()*6})}}
  live(S,'myacht').forEach(u=>{if(G.t-u.born<1)return;u.cd-=dt;const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(tg)u.ga=Math.atan2(tg.y-u.y,tg.x-u.x);if(tg&&u.cd<=0){u.cd=1;hurt(G,tg,u.gun.d);vis(G,{k:'gtrace',x0:u.x,y0:u.y,x:tg.x,y:tg.y,c:u.gun.c,max:.25})}})};

/* ================= 1002 · Sòng bạc Monte Carlo ================= */
const RED=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
X.init[1002]=(G,S)=>{S.cd=5;S.spin=null};
X.death[1002]=(G,S,u,isB)=>{if(!isB&&(G.en||[]).includes(u))S.cd-=.5};
X.step[1002]=(G,S,dt,E,Rg)=>{const sp=S.spin;if(sp){sp.t+=dt;const col=n=>n===0?'#3aff7a':RED.includes(n)?'#ff4a4a':'#e8e8f0';
    if(sp.t<1.2){const r=Math.floor(Math.random()*37);sp.show=r;hud(G,'🎰 Sòng bạc đang quay… <b style="color:'+col(r)+'">'+r+'</b>','#ffd36a');return}
    sp.show=sp.n;if(sp.t<4.2){hud(G,'🎰 Sòng bạc ra số <b style="color:'+col(sp.n)+'">'+sp.n+'</b> → '+sp.n+' × 50 = <b>'+(sp.n*50).toLocaleString('vi-VN')+'</b> sát thương <span style="opacity:.75">(súng bắn sau '+Math.ceil(4.2-sp.t)+' giây)</span>','#ffd36a');return}
    S.spin=null;S.cd=5;const d=sp.n*50,T=enemies(G,Rg,4),t=T.length?T[Math.floor(Math.random()*T.length)]:null;if(t&&d>0){vis(G,{k:'skygun',x:t.x,y:t.y,tg:t,c:col(sp.n),max:1,up(G,S2,dt){if(this.tg&&!this.tg.dead){this.x=this.tg.x;this.y=this.tg.y}if(!this.hit&&this.t>=.6){this.hit=1;if(this.tg&&!this.tg.dead)hurt(G,this.tg,d);vis(G,{k:'boom',x:this.x,y:this.y,h:.4,max:.5,c:'#ffd36a'})}}})}
    hud(G,'🎰 Số '+sp.n+' · súng trên trời bắn '+d.toLocaleString('vi-VN')+' sát thương'+(t?'':' (không có mục tiêu)'),'#ffd36a');pop(G,S.cx,S.cy-3,'Sòng bạc: '+sp.n+' × 50 = '+d,'#ffd36a');return}
  S.cd-=dt;if(S.cd<=0)S.spin={t:0,n:Math.floor(Math.random()*37),show:0};else hud(G,'🎰 Sòng bạc quay tiếp sau '+Math.ceil(S.cd)+' giây','#4f8dff')};

/* ================= 1003 · Bàn poker cao thủ (bàn VIP) ================= */
const VIP=[{k:'b',n:'Xanh',c:'#3ab8ff',t:'mưa 30 sát thương/giây trong 3 giây'},{k:'r',n:'Đỏ',c:'#ff3a2a',t:'thiêu cháy thảm 50 sát thương mỗi 0,1 giây trong 3 giây'},{k:'w',n:'Trắng',c:'#ffffff',t:'kết liễu 1 tàu địch'},{k:'y',n:'Vàng',c:'#ffd34a',t:'+1 Sao'}];
X.init[1003]=(G,S)=>{S.a=0};
X.step[1003]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a<4)return;S.a-=4;const v=VIP[Math.floor(Math.random()*4)];hud(G,'🃏 Bàn VIP ra màu <b style="color:'+v.c+'">'+v.n+'</b> · '+v.t,v.c);pop(G,S.cx,S.cy-3,'Bàn VIP: '+v.n,v.c);vis(G,{k:'chip',x:S.cx,y:S.cy,c:v.c,max:1.2});
  if(v.k==='b')vis(G,{k:'vrain',x:S.cx,y:S.cy,tk:0,max:3,up(G,S2,dt){this.tk+=dt;if(this.tk>=1){this.tk-=1;enemies(G,Rg,0).forEach(e=>hurt(G,e,30))}}});
  else if(v.k==='r')vis(G,{k:'vfire',x:S.cx,y:S.cy,tk:0,max:3,up(G,S2,dt){this.tk+=dt;while(this.tk>=.1){this.tk-=.1;enemies(G,Rg,0).forEach(e=>hurt(G,e,50))}}});
  else if(v.k==='w'){const T=enemies(G,Rg,0);if(T.length){const t=T[Math.floor(Math.random()*T.length)];vis(G,{k:'cavebeam',e:t,x:t.x,y:t.y,max:.8});if(isBoss(t))hurt(G,t,t.max*.2);else kill(G,t)}}
  else give(G,0,1)};

/* ================= 1004 · Két sắt ngân hàng Thụy Sĩ ================= */
X.init[1004]=(G,S)=>{const h=hq(G);blds(G,S.Rg).forEach(b=>{if(b.c39tmp||b.t==='mine')return;if(b===h){addHP(b,5000,1);shield(b,300/DB());b.c49safe=2}else if(!b.spec){addHP(b,2000,1);shield(b,100/DB());b.c49safe=1}});S.a=0};
X.step[1004]=(G,S,dt)=>{S.a+=dt;if(S.a>=10){S.a-=10;const alive=(G.bl||[]).some(b=>b.c49safe&&b.hp>0);if(alive){give(G,0,1);const b=(G.bl||[]).find(b=>b.c49safe===2&&b.hp>0)||(G.bl||[]).find(b=>b.c49safe&&b.hp>0);pop(G,b.x,b.y-2.2,'Két sắt sinh lời · +1 Sao','#ffd36a')}}};

window.C49TXT={1000:'mỗi 25 giây gọi trực thăng (300 máu) bắn súng gatling 9 viên/giây, mỗi viên 10 sát thương; trụ sở lần đầu xuống 40% máu: siêu du thuyền to bằng thảm chạy qua gây 4.000 sát thương lên mọi kẻ địch và hồi sinh 3 công trình với 20% máu',
  1001:'mỗi 4 giây một du thuyền nhỏ 2x2 (100 máu) cập bến trên thảm và dựng 1 khẩu súng ngẫu nhiên trên boong, bắn mỗi giây trong 4 ô với 12–199 sát thương tùy loại súng; tối đa 12 du thuyền',
  1002:'mỗi 5 giây quay số sòng bạc (0–36), hiện số 3 giây rồi súng trên trời bắn 1 kẻ địch với sát thương = số × 50; mỗi tàu địch bị hạ giảm 0,5 giây',
  1003:'mỗi 4 giây bàn VIP ra 1 màu: Xanh mưa 30 sát thương/giây trong 3 giây · Đỏ thiêu cháy thảm 50 sát thương mỗi 0,1 giây trong 3 giây · Trắng kết liễu 1 tàu địch · Vàng +1 Sao',
  1004:'dựng két sắt bảo vệ công trình không có súng (+2.000 máu, +100 giáp), két vàng cho trụ sở (+5.000 máu, +300 giáp); còn két sắt thì mỗi 10 giây +1 Sao'};
Object.assign(window.C44TXT||(window.C44TXT={}),{58:'mỗi mục tiêu bị hạ trong thảm (kể cả tàu ta) tích 1 ngọc trai; đủ 100 viên gọi người đá ngọc ngà cao 12 ô (15.000 máu, đập 8.000 sát thương ô 5x5 mỗi 3 giây)',
  59:'mỗi 10 giây mạ vàng 1 công trình: +2.000 máu tối đa và +500 giáp (cộng dồn); trụ sở xuống 50% máu gọi 10 người que mạ vàng (500 máu, 200 sát thương, tầm 4 ô), 1 lần mỗi trận'});
})();
