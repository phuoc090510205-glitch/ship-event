
/* ===== c26: Kỹ năng thuyền trưởng — gỡ 12 kỹ năng · Kiếm Năng Lượng mới · Trụ Năng Lượng → Trụ Phòng Thủ ===== */
(function(){
if(typeof KI==='undefined'||typeof KP==='undefined')return;
const DEL=['Trọng Lực Nghịch Đảo','Hố Thời Gian','Bóng Ma','Dịch Chuyển Tức Thời','Khiên Phản Đòn','Bão Nano','Triệu Hồi Thiên Thạch','Tàu Hộ Tống','Cánh Cổng Liên Kết','Đội Quân Robot','Hắc Vực Nuốt Chửng','Chuyển Hướng Đạn'];
const SW='Kiếm Năng Lượng',TU='Trụ Phòng Thủ',TU0='Trụ Năng Lượng';
const CF={sw:{R:8,len:8,dmg:1200,pct:.12,ls:.10,cd:210},tu:{hp:500,hpL:50,dmg:200,dmgL:20,rng:4,rof:1.2,life:50,max:2,cd:250,size:3}};
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
/* ---------- 1) gỡ kỹ năng (giữ giá để hoàn tiền) ---------- */
const PRICE={};
if(typeof KDEL==='undefined')window.KDEL={};
DEL.forEach(n=>{const i=KI.findIndex(k=>k[0]===n);if(i>=0){PRICE[n]=[+KI[i][3]||0,+KI[i][4]||0];KI.splice(i,1);KP.splice(i,1)}KDEL[n]=1});
/* ---------- 2) viết lại hai kỹ năng ---------- */
{const k=KI.find(x=>x[0]===SW);if(k){k[5]='Tạo kiếm năng lượng xanh dài tối đa 8 ô dựng thẳng lên trên, rồi bổ xuống nơi có nhiều kẻ địch nhất trong 8 ô. Hút 10% tổng sát thương thành máu.';
  k[6].length=0;k[6].push(['Sát thương','1.200 + 12% máu tối đa mục tiêu'],['Hút máu','10% tổng sát thương'],['Phạm vi','8 ô'],['Chiều dài kiếm','Tối đa 8 ô'],['Hồi chiêu',CF.sw.cd+' giây'],['Mục tiêu','Kẻ địch trong phạm vi, ưu tiên nơi đông nhất'])}}
{const k=KI.find(x=>x[0]===TU0)||KI.find(x=>x[0]===TU);if(k){k[0]=TU;k[1]='Phòng thủ';
  k[5]='Dựng trụ phòng thủ 3×3 ngay trước mũi tàu, tự bắn đạn xanh vào kẻ địch trong 4 ô. Tồn tại 50 giây, tối đa 2 trụ cùng lúc.';
  k[6].length=0;k[6].push(['Máu trụ','500 (+50 mỗi cấp thuyền trưởng)'],['Sát thương','200 mỗi viên (+20 mỗi cấp thuyền trưởng)'],['Tầm bắn','4 ô'],['Tốc độ bắn','1 viên mỗi 1,2 giây'],['Thời gian','50 giây'],['Số trụ tối đa','2 trụ'],['Hồi chiêu',CF.tu.cd+' giây'],['Mục tiêu','Kẻ địch gần trụ nhất'])}}
/* ---------- 3) dọn dữ liệu người chơi: đổi tên, gỡ kỹ năng đã xoá, hoàn tiền ---------- */
function purge(){try{if(typeof S==='undefined'||!S)return;let ch=0,da=0,sao=0;
  if(Array.isArray(S.skills)){const L=[];S.skills.forEach(n=>{if(n===TU0){n=TU;ch=1}if(DEL.includes(n)){const p=PRICE[n];if(p){da+=p[0];sao+=p[1]}ch=1;return}if(!L.includes(n))L.push(n);else ch=1});S.skills=L}
  if(S.cske)Object.keys(S.cske).forEach(c=>{const a=S.cske[c]||[];S.cske[c]=a.map(n=>{if(n===TU0){ch=1;return TU}if(DEL.includes(n)){ch=1;return ''}return n})});
  if(da||sao){S.da=(S.da||0)+da;S.sao=(S.sao||0)+sao;setTimeout(()=>{try{toast('Đã hoàn '+NF(da)+' Đá và '+NF(sao)+' Sao cho kỹ năng bị gỡ khỏi game')}catch(e){}},1800)}
  if(ch){try{save()}catch(e){}try{refresh()}catch(e){}}}catch(e){console.error(e)}}
purge();
if(typeof slFix==='function'){const _f=slFix;slFix=function(){purge();return _f.apply(this,arguments)}}

/* ---------- 4) kế hoạch thi triển: chuyển hai kỹ năng sang nhánh riêng ---------- */
window.c26Plan=function(k){if(!k)return null;
  if(k[0]===SW)return {cat:k[1],vf:'c5',c5:2601,vfR:CF.sw.R,vfNo:0,R:0,c26:'sw'};
  if(k[0]===TU)return {cat:k[1],vf:'c5',c5:2602,vfR:0,vfNo:1,R:0,c26:'tu'};
  return null};
const isEnemySide=(G,P)=>!!P&&(P.team==='e'||(G.en||[]).includes(P)||(G.eu||[]).includes(P));
function foes(G,enemySide){if(enemySide)return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost);
  return (G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t))}
function hurt(G,u,d,enemySide){if(!u||u.dead||!(d>0))return 0;const h0=u.hp;
  try{if(enemySide&&u!==G.pl&&typeof dfDmgA==='function')dfDmgA(u,d);else dfDmgS(u,d,enemySide)}catch(e){console.error(e)}
  return Math.max(0,h0-Math.max(0,u.hp))}
const lvOf=(k,P)=>{try{if(k&&k.cn&&typeof clv==='function')return Math.max(1,clv(k.cn))}catch(e){}return Math.max(1,(P&&P.capLv)||1)};
const fxL=G=>G.c26fx=G.c26fx||[],tuL=G=>G.c26tu=G.c26tu||[],buL=G=>G.c26b=G.c26b||[],popL=G=>G.c26p=G.c26p||[];
const pop=(G,x,y,s,col)=>popL(G).push({x,y,s,col,t:0,max:1.2});
const ringFx=(G,x,y,r,col)=>{try{G.fx.push({x,y,r,t:.4,max:.4,col})}catch(e){}};
function onBlade(P,a,e,len){const dx=e.x-P.x,dy=e.y-P.y,c=Math.cos(a),s=Math.sin(a),al=dx*c+dy*s,pp=Math.abs(-dx*s+dy*c),r=(e.size||2)*.35;
  return al>=-r&&al<=len+r&&pp<=.9+r}
window.c26Cast=function(G,P,k,o,near,inR,sc){if(!G||!P||P.dead)return;sc=sc||1;const es=isEnemySide(G,P);
  if(o.c26==='sw'){const C=CF.sw,F=foes(G,es).filter(e=>Math.hypot(e.x-P.x,e.y-P.y)<=C.R+(e.size||2)*.3);if(!F.length)return;
    let best=null;F.forEach(t=>{const a=Math.atan2(t.y-P.y,t.x-P.x),n=F.filter(e=>onBlade(P,a,e,C.len)).length,sc2=n*1000-Math.hypot(t.x-P.x,t.y-P.y);if(!best||sc2>best.s)best={a,s:sc2,n}});
    fxL(G).push({k:'sw',P,a:best.a,t:0,max:1.2,done:false,es,sc,len:C.len});pop(G,P.x,P.y-(P.size||2)*.7,'Kiếm năng lượng!','#9fe8ff');return}
  if(o.c26==='tu'){const C=CF.tu,L=lvOf(k,P),a=isFinite(P.ang)?P.ang:-Math.PI/2,d=(P.size||2.2)*.5+2.3;
    const W=(G.wd&&G.wd.Wd)||24,H=(G.wd&&G.wd.Hd)||24;let x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d;
    const others=tuL(G).filter(t=>!t.dead&&Math.hypot(t.x-x,t.y-y)<3.1);if(others.length){const px=-Math.sin(a),py=Math.cos(a),sd=(tuL(G).filter(t=>t.own===P).length%2)?-1:1;x+=px*3.3*sd;y+=py*3.3*sd}
    x=Math.max(1.6,Math.min(W-1.6,x));y=Math.max(1.6,Math.min(H-1.6,y));
    const mine=tuL(G).filter(t=>!t.dead&&t.own===P).sort((p,q)=>p.born-q.born);while(mine.length>=C.max){const o2=mine.shift();o2.dead=true;o2.gone=1;ringFx(G,o2.x,o2.y,2,'#9fd8ff')}
    const mx=C.hp+C.hpL*(L-1);
    const t={c26t:1,x,y,hp:mx,max:mx,dead:false,taunt:!es,hr:1.6,size:3,red:0,own:P,es,life:C.life,t:C.life,cd:.5,L,dmg:(C.dmg+C.dmgL*(L-1))*sc,ang:a,born:G.t,rise:0};
    tuL(G).push(t);if(!es){G.c14t=(G.c14t||[]).filter(q=>!q.dead);G.c14t.push(t)}
    ringFx(G,x,y,2.2,'#7fd8ff');pop(G,x,y-2,'Trụ phòng thủ · '+NF(mx)+' máu','#bfe8ff');return}};
/* địch chỉ nhắm vào trụ khi đang ở gần (7 ô) */
{const _T=window.c14Taunt;window.c14Taunt=function(e,w){let r=_T?_T.apply(this,arguments):null;
  if(r&&r.c26t&&Math.hypot(e.x-r.x,e.y-r.y)>(w?Math.max(7,(w.rng||0)+1.5):7)){const L=(DG&&DG.c26tu)||[];L.forEach(t=>{t._tt=t.taunt;t.taunt=false});try{r=_T?_T.apply(this,arguments):null}finally{L.forEach(t=>{t.taunt=t._tt})}}
  return r}}

/* ---------- 5) cập nhật mỗi khung hình ---------- */
function step(G,dt){if(!G||!(dt>0))return;
  const F=G.c26fx;if(F&&F.length){F.forEach(f=>{f.t+=dt;
    if(f.k==='sw'&&!f.done&&f.t>=.68){f.done=true;const P=f.P;if(!P||P.dead)return;const C=CF.sw;let dealt=0,n=0;
      foes(G,f.es).forEach(e=>{if(!onBlade(P,f.a,e,f.len))return;const d=(C.dmg+C.pct*(e.max||e.hp||0))*f.sc*(G.dmM||1)*(e.boss?.35:1);const got=hurt(G,e,d,f.es);dealt+=got;n++;
        ringFx(G,e.x,e.y,(e.size||2)*.9,'#7fe8ff')});
      f.n=n;if(dealt>0){const h=dealt*C.ls;P.hp=Math.min(P.max||P.hp,P.hp+h);pop(G,P.x,P.y-(P.size||2)*.9,'+'+NF(h)+' máu','#7dffb0')}
      if(n)pop(G,P.x+Math.cos(f.a)*f.len*.6,P.y+Math.sin(f.a)*f.len*.6-1,'Trúng '+n+' mục tiêu · '+NF(dealt)+' sát thương','#bff3ff')}});
    G.c26fx=F.filter(f=>f.t<f.max)}
  const T=G.c26tu;if(T&&T.length){T.forEach(t=>{if(t.dead)return;t.rise=Math.min(1,t.rise+dt*3);t.t-=dt;if(t.t<=0){t.dead=true;t.gone=1;ringFx(G,t.x,t.y,2,'#9fd8ff');return}
      t.cd-=dt;let tg=null,bd=1e9;foes(G,t.es).forEach(e=>{const q=Math.hypot(e.x-t.x,e.y-t.y);if(q<=CF.tu.rng+(e.size||2)*.3&&q<bd){bd=q;tg=e}});
      if(tg){const a=Math.atan2(tg.y-t.y,tg.x-t.x);let d=a-t.ang;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;t.ang+=Math.max(-8*dt,Math.min(8*dt,d));
        if(t.cd<=0){t.cd=CF.tu.rof;t.fl=.12;const c=Math.cos(t.ang),s=Math.sin(t.ang);buL(G).push({x:t.x+c*1.3,y:t.y+s*1.3,tg,es:t.es,dmg:t.dmg,life:1.2,sp:14})}}
      if(t.fl>0)t.fl-=dt});
    G.c26tu=T.filter(t=>!t.dead||(t.gone&&(t.dt=(t.dt||0)+dt)<.4))}
  const B=G.c26b;if(B&&B.length){B.forEach(b=>{b.life-=dt;const tg=b.tg;if(!tg||tg.dead){b.life=0;return}const dx=tg.x-b.x,dy=tg.y-b.y,l=Math.hypot(dx,dy)||1,m=Math.min(l,b.sp*dt);b.x+=dx/l*m;b.y+=dy/l*m;
      if(l<=(tg.size||2)*.42+.25){b.life=0;hurt(G,tg,b.dmg*(G.dmM||1)*(tg.boss?.35:1),b.es);ringFx(G,tg.x,tg.y,(tg.size||2)*.6,'#6fd8ff')}});G.c26b=B.filter(b=>b.life>0)}
  const Pp=G.c26p;if(Pp&&Pp.length){Pp.forEach(p=>p.t+=dt);G.c26p=Pp.filter(p=>p.t<p.max)}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}
if(window.CSK&&CSK.tick){const _t=CSK.tick;CSK.tick=function(dt){const r=_t.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}

/* ---------- 6) vẽ ---------- */
function draw(q,G,X,Y,s){if(!G)return;
  (G.c26tu||[]).forEach(t=>{const x=X(t.x),y=Y(t.y),w=CF.tu.size*s,a=t.gone?Math.max(0,1-(t.dt||0)/.4):1,k=.6+.4*(t.rise||1);
    q.save();q.globalAlpha=a;q.translate(x,y);q.scale(k,k);
    q.fillStyle='rgba(0,0,0,.35)';q.fillRect(-w/2+3,-w/2+5,w,w);
    const g=q.createLinearGradient(0,-w/2,0,w/2);g.addColorStop(0,'#2b4a86');g.addColorStop(1,'#13234a');q.fillStyle=g;q.strokeStyle='#6fd8ff';q.lineWidth=Math.max(1.5,s*.08);
    q.beginPath();if(q.roundRect)q.roundRect(-w/2,-w/2,w,w,s*.35);else q.rect(-w/2,-w/2,w,w);q.fill();q.stroke();
    q.strokeStyle='rgba(111,216,255,.35)';q.lineWidth=1;for(let i=1;i<3;i++){q.beginPath();q.moveTo(-w/2+i*w/3,-w/2+3);q.lineTo(-w/2+i*w/3,w/2-3);q.stroke();q.beginPath();q.moveTo(-w/2+3,-w/2+i*w/3);q.lineTo(w/2-3,-w/2+i*w/3);q.stroke()}
    q.fillStyle='#0b1a3a';q.strokeStyle='#9fe8ff';q.lineWidth=Math.max(1.5,s*.07);q.beginPath();q.arc(0,0,s*.75,0,7);q.fill();q.stroke();
    q.save();q.rotate(t.ang||0);q.fillStyle=t.fl>0?'#ffffff':'#7fd8ff';q.fillRect(s*.2,-s*.16,s*1.25,s*.32);q.restore();
    q.shadowColor='#6fd8ff';q.shadowBlur=10;q.fillStyle='#bff3ff';q.beginPath();q.arc(0,0,s*.25,0,7);q.fill();q.shadowBlur=0;
    q.restore();
    if(!t.gone){const bw=w*.9,by=y-w/2-s*.45;q.fillStyle='#000a';q.fillRect(x-bw/2,by,bw,Math.max(4,s*.18));q.fillStyle='#5dff9a';q.fillRect(x-bw/2,by,bw*Math.max(0,t.hp/t.max),Math.max(4,s*.18));
      q.strokeStyle='rgba(159,232,255,.8)';q.lineWidth=2;q.beginPath();q.arc(x,y,w*.62,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,t.t/t.life));q.stroke();
      q.setLineDash([4,5]);q.strokeStyle='rgba(111,216,255,.22)';q.lineWidth=1;q.beginPath();q.arc(x,y,CF.tu.rng*s,0,7);q.stroke();q.setLineDash([])}});
  (G.c26b||[]).forEach(b=>{const x=X(b.x),y=Y(b.y);q.save();q.shadowColor='#4fc8ff';q.shadowBlur=12;q.fillStyle='#bff3ff';q.beginPath();q.arc(x,y,Math.max(2.5,s*.2),0,7);q.fill();q.fillStyle='#4fc8ff';q.beginPath();q.arc(x,y,Math.max(4,s*.32),0,7);q.globalAlpha=.4;q.fill();q.restore()});
  (G.c26fx||[]).forEach(f=>{if(f.k!=='sw')return;const P=f.P;if(!P)return;const t=f.t,up=-Math.PI/2;
    let len,ang,al=1;
    if(t<.35){len=f.len*(t/.35);ang=up}else if(t<.5){len=f.len;ang=up}
    else if(t<.68){len=f.len;let d=f.a-up;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;const u=(t-.5)/.18;ang=up+d*u*u}
    else{len=f.len;ang=f.a;al=Math.max(0,1-(t-.68)/.52)}
    const x=X(P.x),y=Y(P.y),L=len*s,W=Math.max(6,s*.55);
    q.save();q.globalAlpha=al;q.translate(x,y);
    if(t>=.5){let d=f.a-up;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;const a1=up,a2=t<.68?ang:f.a;q.strokeStyle='rgba(111,216,255,.14)';q.lineWidth=L*.9;q.beginPath();q.arc(0,0,L*.55,Math.min(a1,a1+d*(t<.68?((t-.5)/.18)**2:1)),Math.max(a1,a1+d*(t<.68?((t-.5)/.18)**2:1)));q.stroke()}
    q.rotate(ang);q.shadowColor='#4fd8ff';q.shadowBlur=22;
    const g=q.createLinearGradient(0,-W/2,0,W/2);g.addColorStop(0,'rgba(80,200,255,.85)');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'rgba(80,200,255,.85)');
    q.fillStyle=g;q.beginPath();q.moveTo(s*.4,-W/2);q.lineTo(L-W,-W/2);q.lineTo(L,0);q.lineTo(L-W,W/2);q.lineTo(s*.4,W/2);q.closePath();q.fill();
    q.fillStyle='#2a6bd8';q.fillRect(s*.1,-W*.9,s*.3,W*1.8);q.restore();
    if(t>=.68&&t<.95){const k=(t-.68)/.27,ex=X(P.x+Math.cos(f.a)*f.len*.55),ey=Y(P.y+Math.sin(f.a)*f.len*.55);q.save();q.globalAlpha=1-k;q.strokeStyle='#bff3ff';q.lineWidth=4;q.beginPath();q.arc(ex,ey,s*(1+k*3),0,7);q.stroke();q.restore()}});
  (G.c26p||[]).forEach(p=>{const k=p.t/p.max;q.save();q.globalAlpha=Math.max(0,1-k);q.fillStyle=p.col||'#fff';q.font='bold '+Math.max(11,Math.round(s*.45))+'px system-ui,sans-serif';q.textAlign='center';q.fillText(p.s,X(p.x),Y(p.y)-k*s*1.2);q.restore()})}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s)}catch(e){console.error(e)}}}
if(window.CSK&&CSK.draw){const _d=CSK.draw;CSK.draw=function(q,sc,X,Y){const r=_d.apply(this,arguments);try{draw(q,DG,X,Y,sc)}catch(e){console.error(e)}return r}}
window.C26={CF,DEL,PRICE,purge,step,draw,onBlade};
})();
