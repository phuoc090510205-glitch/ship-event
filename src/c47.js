/* ===== c47: sức mạnh 10 thảm Tối thượng (Carnival → Gốm Bát Tràng) ===== */
(function(){
if(!window.C40||!C40.H2)return;
const X=C40.X,{enemies,allies,blds,hurt,pop,vis,unit,inR,shield,BK,DBk,rnd,dist,isAlly}=C40.H,{fight,spot,live,every,isShip}=C40.H2;
const isBoss=u=>u&&(u.boss||(u.sh&&u.sh.bk)||u.c18boss),kill=(G,e)=>{try{dfDmgS(e,e.hp+1e7)}catch(x){}};
const CC=['#ff4a6a','#ffd34a','#4ad8ff','#7aff7a','#ff9a3a','#c77dff'];
const ccE=(e,d,f)=>{d*=BK(e);(f||['stun','noFire']).forEach(k=>e[k]=Math.max(e[k]||0,d))};
const bomb=(G,x,y,dmg,r,c)=>vis(G,{k:'bomb',x,y,max:.7,c:c||'#ff7a2a',up(G,S2,dt){if(!this.hit&&this.t>=.65){this.hit=1;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-this.x,e.y-this.y)<=r+(e.size||2)*.3)hurt(G,e,dmg)});vis(G,{k:'boom',x:this.x,y:this.y,h:.3,max:.5,c:this.c})}}});
const killsIn=(G,S,u,isB,ins)=>ins&&!isB&&(G.en||[]).includes(u);
/* phía sau trụ sở (sát mép bản đồ) */
function behind(G,S,off){const W=(G.wd&&G.wd.Wd)||S.cx*2,Hh=(G.wd&&G.wd.Hd)||S.cy*2;let dx=S.cx-W/2,dy=S.cy-Hh/2,l=Math.hypot(dx,dy);if(l<1){dx=0;dy=-1;l=1}dx/=l;dy/=l;const R=Math.max(S.Rg.x1-S.Rg.x0,S.Rg.y1-S.Rg.y0)/2+off;return {x:S.cx+dx*R,y:S.cy+dy*R,fx:-dx,fy:-dy}}

/* ================= 2015 · Lễ hội Carnival ================= */
X.step[2015]=(G,S,dt,E,Rg)=>{every(S,'u800',800,()=>{if(live(S,'stick').length>=10)return;const p=spot(G,S);unit(G,S,{k:'stick',col:CC[Math.floor(Math.random()*CC.length)],carn:1,x:p[0],y:p[1],hp:300,size:1.1,hr:.55,life:8,cd:.4,h:0,born:G.t});pop(G,p[0],p[1]-2,'Người que Carnival!','#ffd34a')});
  live(S,'stick').forEach(u=>fight(G,S,u,dt,{range:5,dmg:80,cd:1.2,speed:2.2,hit:t=>vis(G,{k:'gstick',x0:u.x,y0:u.y,x:t.x,y:t.y,c:u.col,max:.35})}))};

/* ================= 2016 · Lễ hội khinh khí cầu ================= */
X.init[2016]=(G,S)=>{S.dealt=0;S.du=0};
X.step[2016]=(G,S,dt,E,Rg)=>{while(S.dealt-S.du>=1000){S.du+=1000;if(live(S,'balloon').length>=5)continue;const p=[rnd(Rg.x0,Rg.x1),rnd(Rg.y0,Rg.y1)];unit(G,S,{k:'balloon',x:p[0],y:p[1],hp:300,size:2,hr:1,life:8,cd:1.5,h:6,col:CC[Math.floor(Math.random()*CC.length)],ph:Math.random()*6,born:G.t});pop(G,p[0],p[1]-3,'Khinh khí cầu cất cánh!','#ffd34a')}
  live(S,'balloon').forEach(u=>{u.life-=dt;if(u.life<=0){u.dead=true;u.gone=1;return}const near=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0],T=near||enemies(G,Rg,2)[0];
    if(T){const dx=T.x-u.x,dy=T.y-u.y,l=Math.hypot(dx,dy)||1;u.x+=dx/l*Math.min(l,1.6*dt);u.y+=dy/l*Math.min(l,1.6*dt)}else{u.x+=Math.cos(G.t*.4+u.ph)*dt*.6;u.y+=Math.sin(G.t*.4+u.ph)*dt*.6}
    u.cd-=dt;if(u.cd<=0){u.cd=3;const tx=near?near.x:u.x,ty=near?near.y:u.y;bomb(G,tx,ty,80,1.6,'#ff7a2a');u.drop={x:tx,y:ty,t:G.t}}})};

/* ================= 2017 · Đêm rạp xiếc ================= */
X.init[2017]=(G,S)=>{S.ci=0};
X.step[2017]=(G,S,dt,E,Rg)=>{every(S,'u1000',1000,()=>{for(let k=0;k<3;k++){const kind=['eleph','bclown','aerial'][S.ci%3];S.ci++;if(live(S,kind).length)continue;const p=spot(G,S);
      if(kind==='eleph')unit(G,S,{k:'eleph',x:p[0],y:p[1],hp:800,size:2.2,hr:1.1,cd:.5,h:0,born:G.t});
      else if(kind==='bclown')unit(G,S,{k:'stick',col:'#3a8aff',bclown:1,x:p[0],y:p[1],hp:200,size:1.2,hr:.6,cd:.5,h:0,born:G.t});
      else unit(G,S,{k:'aerial',x:p[0],y:p[1],hp:200,size:1.2,hr:.6,cd:1.5,h:5,born:G.t,ax:p[0],ay:p[1]});
      pop(G,p[0],p[1]-2.5,kind==='eleph'?'Voi rạp xiếc!':kind==='bclown'?'Chú hề xanh!':'Người diễn đu dây!','#ffd34a');break}});
  live(S,'eleph').forEach(u=>fight(G,S,u,dt,{range:1.8,dmg:80,cd:1.5,speed:3}));
  live(S,'stick').forEach(u=>{if(u.bclown)fight(G,S,u,dt,{range:4,dmg:120,cd:2,speed:2.2,hit:t=>vis(G,{k:'can',x0:u.x,y0:u.y,x:t.x,y:t.y,c:['#3a8aff','#ff3a3a','#3aff6a'][Math.floor(Math.random()*3)],max:.5})})});
  live(S,'aerial').forEach(u=>{const t=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(t){const dx=t.x-u.x,dy=t.y-u.y,l=Math.hypot(dx,dy)||1;u.x+=dx/l*Math.min(l,2*dt);u.y+=dy/l*Math.min(l,2*dt)}u.cd-=dt;if(u.cd<=0){u.cd=3;bomb(G,u.x,u.y,40,1.6,'#ffd34a')}})};

/* ================= 2018 · Vòng đu quay công viên đêm ================= */
X.init[2018]=(G,S)=>{S.bd=0};
X.death[2018]=(G,S,u,isB,ins)=>{if(!isB||!ins||u.c39tmp)return;S.bd++;if(S.bd>=5){S.bd-=5;const p=spot(G,S);unit(G,S,{k:'ferris',x:p[0],y:p[1],hp:3000,size:3,hr:1.5,h:0,born:G.t});pop(G,p[0],p[1]-6,'Vòng đu quay dựng lên!','#ff9ae8')}
  const hq=(G.bl||[]).find(b=>b.t==='hq'&&b.hp>0);if(hq&&u.w>=3&&u.h>=3&&u!==hq&&Math.hypot(u.x-hq.x,u.y-hq.y)<=6){unit(G,S,{k:'ghouse',x:u.x,y:u.y,hp:500,size:Math.max(u.w,u.h),hr:1,life:20,cd:.5,h:0,born:G.t});pop(G,u.x,u.y-2,'Nhà vàng công viên!','#ffd36a')}};
X.step[2018]=(G,S,dt,E,Rg)=>{live(S,'ghouse').forEach(h=>{h.life-=dt;if(h.life<=0){h.dead=true;h.gone=1;return}h.cd-=dt;if(h.cd<=0){h.cd=2;if(live(S,'stick').length<15)unit(G,S,{k:'stick',col:'#ffd36a',mini:1,x:h.x+rnd(-.6,.6),y:h.y+(h.size||2)*.5,hp:50,size:.8,hr:.4,life:12,cd:.3,h:0,born:G.t})}});
  live(S,'stick').forEach(u=>fight(G,S,u,dt,{range:1.4,dmg:20,cd:1,speed:2.6}))};

/* ================= 2019 · Tàu lượn siêu tốc ================= */
X.init[2019]=(G,S)=>{S.cd=0;S.ch=0};
X.death[2019]=(G,S,u,isB,ins)=>{if(ins)S.cd=Math.max(0,S.cd-1)};
X.step[2019]=(G,S,dt,E,Rg)=>{every(S,'u1000',1000,()=>{S.ch=Math.min(3,S.ch+1)});S.cd=Math.max(0,S.cd-dt);
  if(!S.rc&&S.ch>0&&S.cd<=0){S.ch--;S.cd=15;const y=rnd(Rg.y0+1,Rg.y1-1);S.rc=vis(G,{k:'coaster',x:Rg.x0-8,y,x1:Rg.x1+30,cap:[],max:60,up(G,S2,dt){this.x+=8*dt;this.y+=Math.sin(this.t*2.4)*1.6*dt;
      enemies(G,null).forEach(e=>{if(this.cap.includes(e))return;if(Math.abs(e.x-this.x)>1.6+(e.size||2)*.3||Math.abs(e.y-this.y)>1.2+(e.size||2)*.3)return;if(isBoss(e)){if(!e.c47b||G.t-e.c47b>2){e.c47b=G.t;hurt(G,e,e.max*.1)}return}this.cap.push(e);e.c47o=this.cap.length});
      this.cap.forEach(e=>{if(e.dead)return;e.x=this.x-e.c47o*1.3;e.y=this.y;e.lift=Math.min(1.2,(e.lift||0)+dt*2);e.stun=Math.max(e.stun||0,.2);e.noFire=Math.max(e.noFire||0,.2)});
      if(this.x>=this.x1){this.cap.forEach(e=>{e.lift=0;if(!e.dead)kill(G,e)});if(this.cap.length)pop(G,this.x,this.y-2,'Tàu lượn kết liễu '+this.cap.length+' tàu','#ff9ae8');this.max=this.t+.01;S.rc=null}}});pop(G,Rg.x0,y-2,'Tàu lượn siêu tốc!','#ff9ae8')}};

/* ================= 2020 · Sân khấu hòa nhạc ================= */
X.init[2020]=(G,S)=>{S.cd=0;S.ch=0;S.st=behind(G,S,2)};
X.death[2020]=(G,S,u,isB,ins)=>{if(ins)S.cd=Math.max(0,S.cd-1)};
X.step[2020]=(G,S,dt,E,Rg)=>{every(S,'u1400',1400,()=>{S.ch=Math.min(3,S.ch+1)});S.cd=Math.max(0,S.cd-dt);
  if(S.ch>0&&S.cd<=0&&!S.show){S.ch--;S.cd=25;S.show=vis(G,{k:'concert',x:S.st.x,y:S.st.y,fx:S.st.fx,fy:S.st.fy,max:3,up(G,S2,dt){enemies(G,Rg,6).forEach(e=>{ccE(e,.25,['stun','noFire','silT']);e.c47d=G.t+.25});if(this.t>=2.98)S.show=null}});pop(G,S.st.x,S.st.y-4,'Hòa nhạc! Kẻ địch nhảy nhót','#ff9ae8')}};

/* ================= 2021 · Đầu máy hơi nước ================= */
X.init[2021]=(G,S)=>{S.cd=0;S.ch=0};
X.death[2021]=(G,S,u,isB,ins)=>{if(ins)S.cd=Math.max(0,S.cd-.5)};
X.step[2021]=(G,S,dt,E,Rg)=>{every(S,'u1300',1300,()=>{S.ch=Math.min(3,S.ch+1)});S.cd=Math.max(0,S.cd-dt);
  if(S.ch>0&&S.cd<=0&&!S.tr){S.ch--;S.cd=14;const y=rnd(Rg.y0+1,Rg.y1-1);S.tr=vis(G,{k:'steam',y,x0:Rg.x0-10,x1:Rg.x1+10,x:Rg.x0-10,hit:new Set(),max:60,up(G,S2,dt){if(this.t<2)return;this.x+=8*dt;
      enemies(G,null).forEach(e=>{const dy=e.y-this.y,near=Math.abs(e.x-this.x)<=4;if(near&&Math.abs(dy)<=3+(e.size||2)*.3)ccE(e,.2);if(this.hit.has(e))return;if(Math.abs(e.x-(this.x+1.4))<=1.6+(e.size||2)*.3&&Math.abs(dy)<=1+(e.size||2)*.3){this.hit.add(e);hurt(G,e,300);const p=isBoss(e)?.7:2;e.y+=(dy>=0?1:-1)*p}});
      if(this.x>=this.x1){this.max=this.t+.01;S.tr=null}}});pop(G,Rg.x0,y-2,'Đường ray dựng lên · tàu hơi nước tới!','#d8c8a0')}};

/* ================= 2022 · Lò rèn thần ================= */
X.init[2022]=(G,S)=>{S.n=0};
X.step[2022]=(G,S,dt,E,Rg)=>{every(S,'u500',500,()=>{S.n++;const big=S.n>=6;const d=big?800:20;enemies(G,Rg,0).forEach(e=>hurt(G,e,d));vis(G,{k:'forge',x:S.cx,y:S.cy,big,max:big?1.4:.9});
    if(big){S.n=0;const dead=(G.bl||[]).filter(b=>b.hp<=0&&b.t!=='mine'&&!b.c39tmp&&b.t!=='hq');if(dead.length){const b=dead[Math.floor(Math.random()*dead.length)];b.hp=b.max*.5;b.flash=.5;vis(G,{k:'ring',x:b.x,y:b.y,c:'#ffb02e',max:.8});pop(G,b.x,b.y-2,'Lò rèn hồi sinh công trình!','#ffb02e')}
      try{if(window.R3D)R3D.shake=Math.max(R3D.shake||0,.6)}catch(x){}pop(G,S.cx,S.cy-3,'Búa thần · 800 sát thương!','#ffb02e')}}) };

/* ================= 2023 · Xưởng thổi thủy tinh ================= */
X.death[2023]=(G,S,u,isB,ins)=>{if(!isB||!ins||u.c39tmp)return;const hp=Math.max(1,u.max*.5);unit(G,S,{k:'glass',x:u.x,y:u.y,w:u.w,hh:u.h,bt:u.t,hp,size:Math.max(u.w,u.h),hr:Math.max(u.w,u.h)*.45,h:0,born:G.t});pop(G,u.x,u.y-2,'Công trình thủy tinh','#bff4ff')};
X.step[2023]=()=>{};

/* ================= 2024 · Gốm bàn xoay Bát Tràng ================= */
X.init[2024]=(G,S)=>{S.ad=0;S.bd=0};
X.death[2024]=(G,S,u,isB,ins)=>{if(isB&&ins&&!u.c39tmp){S.bd++;S.lx=u.x;S.ly=u.y}if(!isB&&isAlly(G,u))S.ad++;
  if(S.ad>=5&&S.bd>=1){S.ad-=5;S.bd-=1;const x=S.lx!=null?S.lx:S.cx,y=S.ly!=null?S.ly:S.cy;vis(G,{k:'pottery',x,y,tk:1,max:2.05,up(G,S2,dt){this.tk+=dt;if(this.tk>=1){this.tk-=1;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-this.x,e.y-this.y)<=4+(e.size||2)*.3)hurt(G,e,200)})}}});pop(G,x,y-2,'Bàn xoay gốm Bát Tràng!','#d8a070')}};
X.step[2024]=()=>{};

window.C47TXT={2015:'mỗi 800 máu công trình mất gọi 1 người que Carnival (300 máu, phóng que sáng 80 sát thương, 8 giây)',
  2016:'mỗi 1.000 sát thương phe ta gây ra gọi 1 khinh khí cầu (300 máu, 8 giây, tối đa 5) bay trên thảm, mỗi 3 giây thả bom 80 sát thương, ưu tiên mục tiêu ngay dưới nó',
  2017:'mỗi 1.000 máu công trình mất lần lượt gọi voi rạp xiếc (800 máu, húc 80), chú hề xanh (200 máu, ném lon 120 trong 4 ô mỗi 2 giây), người diễn đu dây (200 máu, thả bom 40 mỗi 3 giây); mỗi loại tối đa 1',
  2018:'mỗi 5 công trình bị phá dựng vòng đu quay 3.000 máu; công trình từ 3x3 gần trụ sở (6 ô) bị phá dựng nhà vàng 500 máu trong 20 giây, mỗi 2 giây sinh 1 người que (50 máu, 20 sát thương)',
  2019:'mỗi 1.000 máu công trình mất có tàu lượn chạy xuyên thảm, kéo tàu địch theo và kết liễu khi đi xa thảm 30 ô; hồi 15 giây, mỗi mục tiêu bị hạ trong thảm giảm 1 giây',
  2020:'mỗi 1.400 máu công trình mất mở hòa nhạc 3 giây sau lưng trụ sở: kẻ địch trong và quanh thảm nhảy nhót, không bắn và không dùng kỹ năng; hồi 25 giây, mỗi mục tiêu bị hạ giảm 1 giây',
  2021:'mỗi 1.300 máu công trình mất dựng đường ray qua thảm, 2 giây sau tàu hơi nước chạy qua: 300 sát thương, đẩy lùi 2 ô, choáng kẻ địch gần đường ray; tối đa 1 tàu, hồi 14 giây, mỗi mục tiêu bị hạ giảm 0,5 giây',
  2022:'mỗi 500 máu công trình mất búa rèn đập 20 sát thương lên mọi kẻ địch trong thảm; lần thứ 6 đập mạnh 800 sát thương và hồi sinh 1 công trình',
  2023:'mỗi công trình bị phá trong thảm để lại 1 công trình thủy tinh (không tấn công, máu bằng 50% công trình thật)',
  2024:'mỗi khi đủ 5 tàu ta và 1 công trình bị phá, bàn xoay gốm xuất hiện 2 giây, mỗi giây gây 200 sát thương trong 4 ô'};
})();
