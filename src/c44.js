/* ===== c44: sức mạnh 5 thảm Người giàu (Ba Tư Dát Vàng, Kim Cương, Vàng Ròng 24K, Mưa Tiền, Nhung Đỏ Hoàng Gia) + thưởng thắng trận cho mọi thảm Người giàu ===== */
(function(){
if(!window.C40||!window.C39)return;
const C39=window.C39,X=C40.X,{enemies,allies,blds,hurt,pop,vis,unit,inR,shield,addHP,heal,BK,DBk,rnd,dist,isAlly}=C40.H;
const DB=()=>DBk(),isBoss=u=>u&&(u.boss||(u.sh&&u.sh.bk)||u.c18boss);
const sim=G=>!!(G.pv||G.c39sim||G.c18sim||G.tut);
const SV=()=>(typeof S!=='undefined'&&S&&S.da!=null)?S:window.S;
const give=(G,da,sao)=>{if(sim(G))return;try{const s=SV();s.da=(s.da||0)+da;s.sao=(s.sao||0)+sao;save();refresh()}catch(e){}};
const shV=u=>(u.shd&&u.shd.t>0&&u.shd.v)||0;

/* máu công trình bị mất (tính theo máu hiển thị) → Ba Tư / Kim Cương */
{const _B=dfDmgB;dfDmgB=function(b,d){const G=DG,S=G&&G.c40,h0=b&&b.hp;const r=_B.apply(this,arguments);try{if(S&&(S.K===50||S.K===51)&&b&&G.bl.includes(b)&&!b.c39tmp&&h0>b.hp)S.lost=(S.lost||0)+(h0-Math.max(0,b.hp))*DB()}catch(e){}return r}}

/* ================= 50 · Ba Tư Dát Vàng: mỗi 1.000 máu công trình mất → 1 lính giáo Ba Tư ================= */
X.init[50]=(G,S)=>{S.lost=0;S.used=0};
function freeSpot(G,S){const Rg=S.Rg;for(let i=0;i<40;i++){const x=rnd(Rg.x0+.8,Rg.x1-.8),y=rnd(Rg.y0+.8,Rg.y1-.8);if(!(G.bl||[]).some(b=>b.hp>0&&Math.abs(b.x-x)<b.w/2+.7&&Math.abs(b.y-y)<b.h/2+.7))return [x,y]}return [Rg.x0-1,(Rg.y0+Rg.y1)/2]}
X.step[50]=(G,S,dt,E,Rg)=>{while(S.lost-S.used>=1000){S.used+=1000;if(S.u.filter(u=>u.k==='persian'&&!u.dead).length>=12)continue;const p=freeSpot(G,S);unit(G,S,{k:'persian',x:p[0],y:p[1],hp:800,size:1.2,hr:.6,taunt:0,cd:.6,h:0,born:G.t});pop(G,p[0],p[1]-2.2,'Lính giáo Ba Tư xuất trận!','#ffd36a')}
  S.u.forEach(u=>{if(u.k!=='persian'||u.dead)return;u.th=Math.max(0,(u.th||0)-dt);u.cd-=dt;const tg=enemies(G,null).sort((a,b)=>dist(a,u)-dist(b,u))[0];if(!tg){u.mv=0;return}
    const dx=tg.x-u.x,dy=tg.y-u.y,l=Math.hypot(dx,dy)||1,reach=3+(tg.size||2)*.3;u.ang=Math.atan2(dy,dx);
    if(l>reach-.4){const s=Math.min(l-reach+.4,2.6*dt);u.x+=dx/l*s;u.y+=dy/l*s;u.mv=1}else u.mv=0;
    if(l<=reach&&u.cd<=0){u.cd=1.5;u.th=.35;hurt(G,tg,200);vis(G,{k:'ring',x:tg.x,y:tg.y,c:'#ffd36a',max:.35})}})};

/* ================= 51 · Kim Cương: trụ sở +4.000 giáp; mỗi 400 máu công trình mất → 25% mũi kim cương ================= */
X.init[51]=(G,S)=>{S.lost=0;S.used=0;const hq=(G.bl||[]).find(b=>b.t==='hq'&&b.hp>0);if(hq){shield(hq,4000/DB());hq.c44d=1;pop(G,hq.x,hq.y-2.2,'Trụ sở dát kim cương · +4.000 giáp','#bff4ff')}};
X.step[51]=(G,S,dt,E,Rg)=>{while(S.lost-S.used>=400){S.used+=400;if(Math.random()>=.25)continue;const T=enemies(G,Rg,4);if(!T.length)continue;const e=T[Math.floor(Math.random()*T.length)];
    const sp=unit(G,S,{k:'dspike',x:e.x+rnd(-.3,.3),y:e.y+rnd(-.3,.3),hp:100,size:1,hr:.5,taunt:0,life:8,h:0,born:G.t});hurt(G,e,400);const dx=e.x-S.cx,dy=e.y-S.cy,l=Math.hypot(dx,dy)||1,p=isBoss(e)?.35:1;e.x+=dx/l*p;e.y+=dy/l*p;vis(G,{k:'ring',x:sp.x,y:sp.y,c:'#bff4ff',max:.5})}
  S.u.forEach(u=>{if(u.k!=='dspike'||u.dead)return;u.life-=dt;if(u.life<=0){u.dead=true;u.gone=1}})};

/* ================= 52 · Vàng Ròng 24K: mỗi 5 giây 25% hóa vàng 1 kẻ địch trong 5 giây; bị hạ khi đang hóa vàng → +1 Sao ================= */
X.step[52]=(G,S,dt,E)=>{S.a+=dt;if(S.a<5)return;S.a-=5;if(Math.random()>=.25)return;const T=E.filter(e=>!(e.c44g>G.t));if(!T.length)return;const e=T[Math.floor(Math.random()*T.length)],d=5*BK(e);
  e.c44g=G.t+d;e.stun=Math.max(e.stun||0,d);e.noFire=Math.max(e.noFire||0,d);vis(G,{k:'goldst',e,x:e.x,y:e.y,max:d});pop(G,e.x,e.y-1.6,'Hóa vàng 5 giây','#ffd36a')};
X.death[52]=(G,S,u,isB)=>{if(!isB&&u.c44g>G.t&&(G.en||[]).includes(u)){u.c44g=0;give(G,0,1);pop(G,u.x,u.y-1.6,'+1 Sao','#ffd36a');vis(G,{k:'ring',x:u.x,y:u.y,c:'#ffd36a',max:.6})}};

/* ================= 53 · Mưa Tiền: mỗi 5 giây 25% thả tiền từ độ cao 10 ô, nằm 5 giây; tàu ta nhặt → +200 Đá, +100 giáp cộng dồn ================= */
X.step[53]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=5){S.a-=5;if(Math.random()<.25){const x=rnd(Rg.x0+.5,Rg.x1-.5),y=rnd(Rg.y0+.5,Rg.y1-.5);vis(G,{k:'money',x,y,max:5.8,up(G,S2,dt){if(this.t<.8||this.got)return;
      const u=allies(G,null).find(a=>Math.hypot(a.x-this.x,a.y-this.y)<=(a.size||2)*.45+1);if(u){this.got=1;this.max=this.t+.5;give(G,200,0);shield(u,100);pop(G,u.x,u.y-1.6,'+200 Đá · +100 giáp','#9aff7a');vis(G,{k:'ring',x:this.x,y:this.y,c:'#9aff7a',max:.5})}}});pop(G,x,y-2,'Mưa tiền!','#9aff7a')}}};

/* ================= 54 · Nhung Đỏ Hoàng Gia: mỗi 5 giây 25% hóa thánh 1 công trình / tàu ta: +1.000 giáp, +400 máu trong 8 giây; giáp vỡ → nổ 800 trong 3 ô ================= */
X.step[54]=(G,S,dt,E,Rg)=>{S.a+=dt;if(S.a>=5){S.a-=5;if(Math.random()<.25){const L=allies(G,Rg,0).concat(blds(G,Rg).filter(b=>!b.c39tmp)).filter(u=>!(u.c44b&&u.c44b.until>G.t));if(L.length){const u=L[Math.floor(Math.random()*L.length)],isB=G.bl.includes(u),k=isB?DB():1;
      const sv=1000/k,hp=400/k;shield(u,sv);u.max+=hp;u.hp+=hp;u.c44b={until:G.t+8,hp,base:shV(u)-sv,isB};vis(G,{k:'ring',x:u.x,y:u.y,c:'#ff6a8a',max:.7});pop(G,u.x,u.y-1.8,'Hóa thánh · +1.000 giáp +400 máu','#ffb0c8')}}}
  allies(G,null).concat(G.bl||[]).forEach(u=>{const B=u&&u.c44b;if(!B)return;const broke=shV(u)<=B.base+1e-6&&!u.dead&&u.hp>0,end=G.t>=B.until||u.dead||u.hp<=0;
    if(broke&&!B.boom){B.boom=1;enemies(G,null).forEach(e=>{if(Math.hypot(e.x-u.x,e.y-u.y)<=3+(e.size||2)*.3)hurt(G,e,800)});vis(G,{k:'boom',x:u.x,y:u.y,h:.6,max:.8,c:'#ff6a8a'});pop(G,u.x,u.y-1.8,'Giáp thánh vỡ · 800 sát thương','#ff8aa8')}
    if(broke||end){u.max=Math.max(1,u.max-B.hp);u.hp=Math.min(u.hp,u.max);if(!broke&&u.shd&&u.shd.t>0)u.shd.v=Math.max(0,Math.min(u.shd.v,B.base));u.c44b=null}})};

/* ================= thưởng thắng trận: mọi thảm Người giàu +100 Sao (PvP) / +50 Sao (Level, Boss); Vàng Ròng +50% thưởng; Mưa Tiền +200% Đá (Boss +150%) ================= */
{const _F=dfFinish;dfFinish=function(win){const G=DG;let c=null;try{c=C39.cur()}catch(e){}
  if(!G||G.done||sim(G)||!c||c.tier!==5)return _F.apply(this,arguments);const s=SV(),d0=s.da,s0=s.sao,pvp=!!G.pvp,boss=!!(G.dboss||(typeof CUR!=='undefined'&&CUR&&CUR.daily));
  const r=_F.apply(this,arguments);if(!win)return r;try{const dDa=Math.max(0,s.da-d0),dSao=Math.max(0,s.sao-s0);let da=0,sao=pvp?100:50;
    if(c.id==='cpng2'){da+=Math.round(dDa*.5);sao+=Math.round(dSao*.5)}if(c.id==='cpng3')da+=Math.round(dDa*(boss?1.5:2));
    s.da+=da;s.sao+=sao;save();try{refresh()}catch(e){}const msg='Thưởng thảm Người giàu: '+(da?'+'+da.toLocaleString('vi-VN')+' Đá · ':'')+'+'+sao+' Sao';
    setTimeout(()=>{try{toast(msg)}catch(e){}const el=document.getElementById('rr');if(el&&!pvp)el.textContent+=' '+msg+'.'},pvp?1200:1300)}catch(e){console.error(e)}return r}}

window.C44TXT={50:'mỗi 1.000 máu công trình bị mất triệu hồi 1 lính giáo Ba Tư (cao 2 ô, 800 máu, đâm 200 sát thương, tầm giáo 3 ô)',
  51:'trụ sở dát kim cương +4.000 giáp; mỗi 400 máu công trình bị mất có 25% gọi mũi kim cương trồi lên đâm kẻ địch 400 sát thương và đẩy lùi 1 ô, mũi kim tồn tại 8 giây (100 máu)',
  52:'+50% phần thưởng trận PvP, Level và Boss; mỗi 5 giây 25% hóa vàng 1 kẻ địch trong 5 giây, hạ nó khi đang hóa vàng được +1 Sao',
  53:'+200% Đá thưởng trận PvP và Level (Boss +150%); mỗi 5 giây 25% mưa tiền rơi xuống thảm trong 5 giây, tàu ta nhặt được +200 Đá và +100 giáp cộng dồn',
  54:'mỗi 5 giây 25% hóa thánh 1 công trình hoặc tàu ta trong thảm: +1.000 giáp, +400 máu trong 8 giây; giáp vỡ gây 800 sát thương trong 3 ô'};
window.C44WIN='Thắng trận: +100 Sao (PvP) · +50 Sao (Level, Boss)';
})();
