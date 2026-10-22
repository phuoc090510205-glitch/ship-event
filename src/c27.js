
/* ===== c27: Kỹ năng thuyền trưởng — gỡ 9 kỹ năng · Mặt Trời Nhân Tạo mới · Mê Cung Không Gian → Vùng Cấm Tím ===== */
(function(){
if(typeof KI==='undefined'||typeof KP==='undefined'||!window.c26Plan||!window.c26Cast)return;
const DEL=['Phản Chiếu Sát Thương','Tháp Quang Học','Hố Hồng Cực','Tinh Thể Khóa','Luồng Tím Chuyển','Lồng Lập Phương','Xoáy Không Gian Tím','Dải Lụa Vàng','Quỹ Đạo Nguyên Tử'];
const SUN='Mặt Trời Nhân Tạo',MZ='Vùng Cấm Tím',MZ0='Mê Cung Không Gian';
const CF={cast:10,
  sun:{dia:5,grow:1.2,life:30,hp:1000,R:6,dmg:30,tick:.25,per:.10,met:[2,3,4,5,6,7],metDmg:150,metV:2.4,cd:210},
  mz:{rise:2,R:6,slam:1000,zone:8,dps:200,tick:.25}};
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
/* ---------- 1) gỡ kỹ năng ---------- */
const PRICE={};
DEL.forEach(n=>{const i=KI.findIndex(k=>k[0]===n);if(i>=0){PRICE[n]=[+KI[i][3]||0,+KI[i][4]||0];KI.splice(i,1);KP.splice(i,1)}KDEL[n]=1});
/* ---------- 2) viết lại hai kỹ năng ---------- */
let MZIMG=null;
{const k=KI.find(x=>x[0]===SUN);if(k){k[5]='Tạo mặt trời đường kính tới 5 ô, tồn tại 30 giây, thiêu đốt kẻ địch trong 6 ô. Kẻ địch bị thiêu chết sinh ra thiên thạch xoay quanh mặt trời.';
  k[6].length=0;k[6].push(['Sát thương thiêu đốt','30 mỗi 0,25 giây (+10% mỗi ô gần mặt trời hơn)'],['Phạm vi thiêu đốt','6 ô'],['Máu mặt trời','1.000'],['Thời gian','30 giây'],['Thiên thạch','Tối đa 6, cách mặt trời 2–7 ô, 150 sát thương khi va chạm'],['Hồi chiêu',CF.sun.cd+' giây'],['Hiệu ứng','Tạo mặt trời'],['Mục tiêu','Kẻ địch trong phạm vi'])}}
{const i=KI.findIndex(x=>x[0]===MZ0||x[0]===MZ);if(i>=0){const k=KI[i];MZIMG=KP[i];const cd=(k[6].find(r=>r[0]==='Hồi chiêu')||[0,'28 giây'])[1];k[0]=MZ;
  k[5]='Dựng mê cung tím đứng sừng sững, sau 2 giây dập mạnh xuống kẻ địch trong 6 ô và để lại vùng cấm tím trong 8 giây.';
  k[6].length=0;k[6].push(['Sát thương dập','1.000'],['Vùng cấm','200 sát thương mỗi giây'],['Phạm vi','6 ô'],['Thời gian dựng','2 giây'],['Thời gian vùng cấm','8 giây'],['Hồi chiêu',cd],['Hiệu ứng','Mê cung dập xuống, tạo vùng cấm'],['Mục tiêu','Kẻ địch trong phạm vi'])}}
/* ---------- 3) dọn dữ liệu người chơi ---------- */
function purge(){try{if(typeof S==='undefined'||!S)return;let ch=0,da=0,sao=0;
  if(Array.isArray(S.skills)){const L=[];S.skills.forEach(n=>{if(n===MZ0){n=MZ;ch=1}if(DEL.includes(n)){const p=PRICE[n];if(p){da+=p[0];sao+=p[1]}ch=1;return}if(!L.includes(n))L.push(n);else ch=1});S.skills=L}
  if(S.cske)Object.keys(S.cske).forEach(c=>{S.cske[c]=(S.cske[c]||[]).map(n=>{if(n===MZ0){ch=1;return MZ}if(DEL.includes(n)){ch=1;return ''}return n})});
  if(da||sao){S.da=(S.da||0)+da;S.sao=(S.sao||0)+sao;setTimeout(()=>{try{toast('Đã hoàn '+NF(da)+' Đá và '+NF(sao)+' Sao cho kỹ năng bị gỡ khỏi game')}catch(e){}},2600)}
  if(ch){try{save()}catch(e){}try{refresh()}catch(e){}}}catch(e){console.error(e)}}
purge();
if(typeof slFix==='function'){const _f=slFix;slFix=function(){purge();return _f.apply(this,arguments)}}

/* ---------- 4) kế hoạch + thi triển ---------- */
{const _p=window.c26Plan;window.c26Plan=function(k){if(k&&k[0]===SUN)return {cat:k[1],vf:'c5',c5:2701,vfR:0,vfNo:1,R:0,c26:'sun'};
  if(k&&k[0]===MZ)return {cat:k[1],vf:'c5',c5:2702,vfR:0,vfNo:1,R:0,c26:'mz'};return _p(k)}}
const isES=(G,P)=>!!P&&(P.team==='e'||(G.en||[]).includes(P)||(G.eu||[]).includes(P));
function foes(G,es){if(es)return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost);return (G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t))}
function hurt(G,u,d,es){if(!u||u.dead||!(d>0))return 0;const h0=u.hp;try{if(es&&u!==G.pl&&typeof dfDmgA==='function')dfDmgA(u,d);else dfDmgS(u,d,es)}catch(e){console.error(e)}return Math.max(0,h0-Math.max(0,u.hp))}
const sk=(G,e,d)=>d*(G.dmM||1)*(e.boss?.35:1);
const ringFx=(G,x,y,r,col)=>{try{G.fx.push({x,y,r,t:.4,max:.4,col})}catch(e){}};
const L27=G=>G.c27=G.c27||{sun:[],mz:[],met:[],pop:[]};
const pop=(G,x,y,s,col)=>L27(G).pop.push({x,y,s,col,t:0,max:1.3});
/* chọn tâm: nơi có nhiều kẻ địch nhất trong bán kính R quanh một kẻ địch, xét các kẻ địch trong tầm thi triển */
function bestSpot(G,P,es,R){const F=foes(G,es),C=F.filter(e=>Math.hypot(e.x-P.x,e.y-P.y)<=CF.cast+(e.size||2)*.3);
  if(!C.length){const a=isFinite(P.ang)?P.ang:-Math.PI/2;return {x:P.x+Math.cos(a)*4,y:P.y+Math.sin(a)*4,n:0}}
  let best=null;C.forEach(t=>{const M=F.filter(e=>Math.hypot(e.x-t.x,e.y-t.y)<=R),n=M.length,s=n*1000-Math.hypot(t.x-P.x,t.y-P.y);if(!best||s>best.s)best={x:t.x,y:t.y,n,s,M}});
  /* lấy tâm cụm (trung bình vị trí), tránh trùng khít vị trí một kẻ địch */
  let x=0,y=0;best.M.forEach(e=>{x+=e.x;y+=e.y});x/=best.M.length;y/=best.M.length;
  if(Math.hypot(x-best.x,y-best.y)>R*.6){x=best.x;y=best.y}
  if(F.some(e=>Math.hypot(e.x-x,e.y-y)<.15)){const a=Math.atan2(P.y-y,P.x-x)||0;x+=Math.cos(a)*.3;y+=Math.sin(a)*.3}
  return {x,y,n:best.n}}
const clampW=(G,v,ax)=>Math.max(1,Math.min(((G.wd&&(ax?G.wd.Hd:G.wd.Wd))||24)-1,v));
{const _c=window.c26Cast;window.c26Cast=function(G,P,k,o,near,inR,sc){
  if(!o||(o.c26!=='sun'&&o.c26!=='mz'))return _c.apply(this,arguments);
  if(!G||!P||P.dead)return;sc=sc||1;const es=isES(G,P),Z=L27(G);
  if(o.c26==='sun'){const C=CF.sun,p=bestSpot(G,P,es,C.R),x=clampW(G,p.x,0),y=clampW(G,p.y,1);
    const s={c27s:1,x,y,hp:C.hp,max:C.hp,dead:false,taunt:!es,hr:C.dia/2,size:C.dia,red:0,own:P,es,sc,t:C.life,age:0,acc:0,slots:[null,null,null,null,null,null],burned:new Set()};
    Z.sun.push(s);if(!es){G.c14t=(G.c14t||[]).filter(q=>!q.dead);G.c14t.push(s)}
    ringFx(G,x,y,3,'#ffd27a');pop(G,x,y-3.4,'Mặt trời nhân tạo · '+NF(C.hp)+' máu','#ffe29a');return}
  if(o.c26==='mz'){const C=CF.mz,p=bestSpot(G,P,es,C.R),x=clampW(G,p.x,0),y=clampW(G,p.y,1);
    Z.mz.push({x,y,own:P,es,sc,age:0,st:'rise',zt:0,acc:0,seed:Math.random()*1000});pop(G,x,y-4,'Mê cung tím!','#e0b0ff');return}}}
/* kẻ địch chỉ nhắm vào mặt trời khi ở gần (7 ô) */
{const _T=window.c14Taunt;window.c14Taunt=function(e,w){let r=_T?_T.apply(this,arguments):null;
  if(r&&r.c27s&&Math.hypot(e.x-r.x,e.y-r.y)>(w?Math.max(7,(w.rng||0)+1.5):7)){const L=(DG&&DG.c27&&DG.c27.sun)||[];L.forEach(t=>{t._tt=t.taunt;t.taunt=false});try{r=_T?_T.apply(this,arguments):null}finally{L.forEach(t=>{t.taunt=t._tt})}}
  return r}}

/* ---------- 5) cập nhật ---------- */
function step(G,dt){const Z=G&&G.c27;if(!Z||!(dt>0))return;
  Z.sun.forEach(s=>{if(s.dead)return;s.age+=dt;s.t-=dt;if(s.t<=0||s.hp<=0){s.dead=true;s.end=G.t;ringFx(G,s.x,s.y,4,'#ffb04a');s.slots.forEach(m=>{if(m){m.dead=true;ringFx(G,m.x,m.y,.8,'#ffb04a')}});return}
    const C=CF.sun;s.acc+=dt;while(s.acc>=C.tick){s.acc-=C.tick;
      foes(G,s.es).forEach(e=>{const d=Math.hypot(e.x-s.x,e.y-s.y)-(e.size||2)*.3;if(d>C.R)return;const k=Math.max(0,Math.floor(C.R-Math.max(0,d))),dm=sk(G,e,C.dmg*(1+C.per*k)*s.sc);
        const was=!e.dead;hurt(G,e,dm,s.es);e.c27b=G.t;s.burned.add(e);if(was&&e.dead)meteor(G,s,e)})}
    /* mô phỏng trong cửa hàng: mục tiêu giả không chết nên cứ ~0,8 s sinh một thiên thạch để minh họa */
    if(G.pv&&s.age>1){s.dm=(s.dm||0)-dt;if(s.dm<=0){s.dm=.8;const F=foes(G,s.es),i=s.slots.findIndex(x=>!x);if(i>=0){const r=C.met[i];let a=0;for(let j=0;j<10;j++){a=Math.random()*Math.PI*2;const px=s.x+Math.cos(a)*r,py=s.y+Math.sin(a)*r;if(!F.some(e=>Math.hypot(e.x-px,e.y-py)<(e.size||2)*.42+1.2))break}
      meteor(G,s,{x:s.x+Math.cos(a)*r,y:s.y+Math.sin(a)*r});if(s.slots[i])s.slots[i].hold=1.6}}}
    s.slots.forEach((m,i)=>{if(!m)return;m.a+=m.w*dt;m.x=s.x+Math.cos(m.a)*m.r;m.y=s.y+Math.sin(m.a)*m.r;if(m.hold>0){m.hold-=dt;return}
      for(const e of foes(G,s.es)){if(Math.hypot(e.x-m.x,e.y-m.y)<=(e.size||2)*.42+.4){const was=!e.dead;hurt(G,e,sk(G,e,CF.sun.metDmg*s.sc),s.es);m.boom=1;s.slots[i]=null;ringFx(G,m.x,m.y,1.4,'#ff9a3a');ringFx(G,m.x,m.y,.8,'#fff2c0');
        if(was&&e.dead)meteor(G,s,e);break}}})});
  Z.sun=Z.sun.filter(s=>!s.dead||G.t-s.end<.6);
  Z.mz.forEach(m=>{m.age+=dt;const C=CF.mz;
    if(m.st==='rise'&&m.age>=C.rise){m.st='slam';m.sl=0}
    if(m.st==='slam'){m.sl+=dt;if(m.sl>=.22){m.st='zone';m.zt=0;let n=0;foes(G,m.es).forEach(e=>{if(Math.hypot(e.x-m.x,e.y-m.y)<=C.R+(e.size||2)*.3){hurt(G,e,sk(G,e,C.slam*m.sc),m.es);n++}});
      ringFx(G,m.x,m.y,C.R,'#c27bff');ringFx(G,m.x,m.y,C.R*.6,'#f0d8ff');try{G.shake=Math.max(G.shake||0,.35)}catch(e){}if(n)pop(G,m.x,m.y-1,'Dập trúng '+n+' mục tiêu','#f0d8ff')}}
    if(m.st==='zone'){m.zt+=dt;m.acc+=dt;while(m.acc>=C.tick){m.acc-=C.tick;foes(G,m.es).forEach(e=>{if(Math.hypot(e.x-m.x,e.y-m.y)<=C.R+(e.size||2)*.3)hurt(G,e,sk(G,e,C.dps*C.tick*m.sc),m.es)})}
      if(m.zt>=C.zone)m.st='end'}
    if(m.st==='end'){m.fade=(m.fade||0)+dt}});
  Z.mz=Z.mz.filter(m=>!(m.st==='end'&&m.fade>.5));
  Z.pop.forEach(p=>p.t+=dt);Z.pop=Z.pop.filter(p=>p.t<p.max)}
function meteor(G,s,e){const i=s.slots.findIndex(x=>!x);if(i<0)return;const r=CF.sun.met[i],a=Math.atan2(e.y-s.y,e.x-s.x);
  s.slots[i]={r,a,w:CF.sun.metV/r,x:s.x+Math.cos(a)*r,y:s.y+Math.sin(a)*r,born:G.t,seed:Math.random()*10};ringFx(G,e.x,e.y,1.2,'#ffcc66');pop(G,e.x,e.y-1,'Thiên thạch!','#ffcc88')}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}
if(window.CSK&&CSK.tick){const _t=CSK.tick;CSK.tick=function(dt){const r=_t.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}

/* ---------- 6) vẽ ---------- */
const imgOf=u=>{try{return u&&typeof dimg==='function'?dimg(u):null}catch(e){return null}};
function mazeRings(q,x,y,R,s,t,al,seed){q.save();q.globalAlpha=al;q.translate(x,y);
  const n=6;for(let i=1;i<=n;i++){const r=R*i/n,sides=8,gap=Math.floor((Math.sin(seed+i*7.1)*.5+.5)*sides);
    q.strokeStyle=i%2?'#d58cff':'#a64dff';q.lineWidth=Math.max(1.5,s*.12);q.shadowColor='#b86bff';q.shadowBlur=10;
    q.beginPath();for(let j=0;j<sides;j++){if(j===gap)continue;const a0=j/sides*Math.PI*2+Math.PI/8,a1=(j+1)/sides*Math.PI*2+Math.PI/8;q.moveTo(Math.cos(a0)*r,Math.sin(a0)*r);q.lineTo(Math.cos(a1)*r,Math.sin(a1)*r)}q.stroke();
    if(i<n){const j=Math.floor((Math.sin(seed*1.7+i*3.3)*.5+.5)*sides),a=j/sides*Math.PI*2+Math.PI/8;q.beginPath();q.moveTo(Math.cos(a)*r,Math.sin(a)*r);q.lineTo(Math.cos(a)*R*(i+1)/n,Math.sin(a)*R*(i+1)/n);q.stroke()}}
  q.restore()}
function draw(q,G,X,Y,s){const Z=G&&G.c27;if(!Z)return;
  Z.mz.forEach(m=>{const C=CF.mz,x=X(m.x),y=Y(m.y),R=C.R*s;
    if(m.st==='zone'||m.st==='end'){const al=m.st==='end'?Math.max(0,1-m.fade/.5):1,pul=.5+.5*Math.sin(G.t*6);
      q.save();q.globalAlpha=.22*al;const g=q.createRadialGradient(x,y,R*.1,x,y,R);g.addColorStop(0,'#b56bff');g.addColorStop(1,'rgba(120,40,200,.15)');q.fillStyle=g;q.beginPath();q.arc(x,y,R,0,7);q.fill();q.restore();
      mazeRings(q,x,y,R,s,G.t,(.65+.35*pul)*al,m.seed);
      q.save();q.globalAlpha=al;q.strokeStyle='#e9c8ff';q.lineWidth=2;q.beginPath();q.arc(x,y,R+3,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,1-m.zt/C.zone));q.stroke();q.restore()}
    else{/* mê cung dựng đứng rồi dập xuống */
      const im=imgOf(MZIMG),w=R*1.2,h=w*.82,k=m.st==='slam'?Math.min(1,m.sl/.22):0,rise=m.st==='rise'?Math.min(1,m.age/.5):1;
      /* vòng phạm vi + bóng đổ dưới chân mê cung */
      q.save();q.globalAlpha=.3*rise;q.strokeStyle='#c27bff';q.setLineDash([6,6]);q.lineWidth=2;q.beginPath();q.arc(x,y,R,0,7);q.stroke();q.setLineDash([]);
      q.globalAlpha=.45*rise;q.fillStyle='#2a0a4a';q.beginPath();q.ellipse(x,y,w*.55,w*.14,0,0,7);q.fill();q.restore();
      /* tấm mê cung dựng đứng: chân bám đất, mọc lên trong 0,5 s, khi dập thì đổ ập xuống (co chiều cao) */
      const hh=h*rise*(1-k*.94),bob=m.st==='rise'?Math.sin(G.t*3)*s*.08:0,top=y-hh-bob;
      q.save();q.shadowColor='#b86bff';q.shadowBlur=26;
      q.beginPath();if(q.roundRect)q.roundRect(x-w/2,top,w,Math.max(2,hh),Math.min(14,hh/2));else q.rect(x-w/2,top,w,Math.max(2,hh));q.closePath();
      q.fillStyle='rgba(70,20,130,.9)';q.fill();q.save();q.clip();
      if(im&&im.complete&&im.naturalWidth){q.globalAlpha=.97;q.drawImage(im,x-w/2,top,w,Math.max(2,hh))}else mazeRings(q,x,top+hh/2,Math.min(w,hh)*.45,s,G.t,1,m.seed);
      const gl=q.createLinearGradient(0,top,0,top+hh);gl.addColorStop(0,'rgba(240,210,255,.25)');gl.addColorStop(1,'rgba(60,0,120,.35)');q.fillStyle=gl;q.fillRect(x-w/2,top,w,hh);q.restore();
      q.lineWidth=3;q.strokeStyle='#e7c2ff';q.stroke();q.restore();
      if(k>0){q.save();q.globalAlpha=k;q.strokeStyle='#f3dcff';q.lineWidth=4;q.beginPath();q.ellipse(x,y,R*k,R*k*.35,0,0,7);q.stroke();q.restore()}
      if(m.st==='rise'){const left=Math.max(0,C.rise-m.age);q.save();q.fillStyle='#f0d8ff';q.font='bold '+Math.max(12,Math.round(s*.55))+'px system-ui,sans-serif';q.textAlign='center';q.fillText(left.toFixed(1)+' s',x,y+s*.9);q.restore()}}});
  Z.sun.forEach(sn=>{const C=CF.sun,x=X(sn.x),y=Y(sn.y),gk=Math.min(1,sn.age/C.grow),r=C.dia/2*s*gk,al=sn.dead?Math.max(0,1-(G.t-sn.end)/.6):1;
    q.save();q.globalAlpha=.18*al;q.strokeStyle='#ffb04a';q.setLineDash([5,7]);q.lineWidth=2;q.beginPath();q.arc(x,y,C.R*s,0,7);q.stroke();q.setLineDash([]);q.restore();
    q.save();q.globalAlpha=al;const g1=q.createRadialGradient(x,y,0,x,y,r*2.1);g1.addColorStop(0,'rgba(255,220,120,.55)');g1.addColorStop(1,'rgba(255,120,30,0)');q.fillStyle=g1;q.beginPath();q.arc(x,y,r*2.1,0,7);q.fill();
    const g=q.createRadialGradient(x,y,0,x,y,Math.max(1,r));g.addColorStop(0,'#ffffff');g.addColorStop(.35,'#fff1a8');g.addColorStop(.75,'#ffb13b');g.addColorStop(1,'#ff6a1a');
    q.shadowColor='#ffb04a';q.shadowBlur=30;q.fillStyle=g;q.beginPath();q.arc(x,y,Math.max(1,r),0,7);q.fill();q.shadowBlur=0;
    q.strokeStyle='rgba(255,230,160,.8)';q.lineWidth=2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2+G.t*.6,f=1+.18*Math.sin(G.t*7+i);q.beginPath();q.moveTo(x+Math.cos(a)*r*1.02,y+Math.sin(a)*r*1.02);q.lineTo(x+Math.cos(a)*r*1.25*f,y+Math.sin(a)*r*1.25*f);q.stroke()}
    sn.slots.forEach(m=>{if(m){q.strokeStyle='rgba(255,180,90,.25)';q.lineWidth=1;q.beginPath();q.arc(x,y,m.r*s,0,7);q.stroke()}});
    if(!sn.dead){const bw=Math.max(40,C.dia*s*.9),by=y-r-s*.7;q.fillStyle='#000a';q.fillRect(x-bw/2,by,bw,Math.max(4,s*.18));q.fillStyle='#ffcf4a';q.fillRect(x-bw/2,by,bw*Math.max(0,sn.hp/sn.max),Math.max(4,s*.18));
      q.strokeStyle='rgba(255,230,160,.9)';q.lineWidth=2;q.beginPath();q.arc(x,y,r+s*.35,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,sn.t/C.life));q.stroke()}
    q.restore();
    sn.slots.forEach(m=>{if(!m)return;const mx=X(m.x),my=Y(m.y),rr=Math.max(4,s*.32);q.save();
      const tx=-Math.sin(m.a),ty=Math.cos(m.a);const tg=q.createLinearGradient(mx,my,mx-tx*rr*4,my-ty*rr*4);tg.addColorStop(0,'rgba(255,160,60,.8)');tg.addColorStop(1,'rgba(255,90,20,0)');
      q.strokeStyle=tg;q.lineWidth=rr*1.2;q.beginPath();q.moveTo(mx,my);q.lineTo(mx-tx*rr*4,my-ty*rr*4);q.stroke();
      q.fillStyle='#7a4a2a';q.strokeStyle='#ffb070';q.lineWidth=2;q.beginPath();for(let i=0;i<7;i++){const a=i/7*Math.PI*2+m.seed,rq=rr*(.8+.25*Math.sin(m.seed*3+i*2.1));q.lineTo(mx+Math.cos(a)*rq,my+Math.sin(a)*rq)}q.closePath();q.fill();q.stroke();q.restore()})});
  (G.en||[]).concat(G.pl?[G.pl]:[]).forEach(e=>{if(!e||e.dead||!(e.c27b>G.t-.3))return;const x=X(e.x),y=Y(e.y);q.save();q.globalAlpha=.7;q.fillStyle='#ff8a2a';for(let i=0;i<3;i++){const a=G.t*9+i*2.1,rr=(e.size||2)*s*.25;q.beginPath();q.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr-s*.2,Math.max(2,s*.12),0,7);q.fill()}q.restore()});
  Z.pop.forEach(p=>{const k=p.t/p.max;q.save();q.globalAlpha=Math.max(0,1-k);q.fillStyle=p.col||'#fff';q.font='bold '+Math.max(11,Math.round(s*.45))+'px system-ui,sans-serif';q.textAlign='center';q.fillText(p.s,X(p.x),Y(p.y)-k*s*1.2);q.restore()})}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s)}catch(e){console.error(e)}}}
if(window.CSK&&CSK.draw){const _d=CSK.draw;CSK.draw=function(q,sc,X,Y){const r=_d.apply(this,arguments);try{draw(q,DG,X,Y,sc)}catch(e){console.error(e)}return r}}
window.C27={CF,DEL,PRICE,purge,step,draw,bestSpot};
})();
