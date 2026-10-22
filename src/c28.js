
/* ===== c28: Kỹ năng thuyền trưởng đợt 3 — 12 kỹ năng mới · gỡ 4 kỹ năng ===== */
(function(){
if(typeof KI==='undefined'||typeof KP==='undefined'||!window.c26Plan||!window.c26Cast)return;
const DEL=['Cổng Tím Dịch','Mạng Lưới Xanh','Lăng Kính Tím','Bảo Trì Xanh Lục'];
const REN={'Sóng Âm Xanh':'Tiếng Gầm Không Gian'};
const ID={'Sóng Âm':'sa','Màn Sương Ảo Ảnh':'fog','Hủy Trọng Lực':'ag','Vùng Cấm Đỏ':'rz','Ma Trận Số':'mx','Kho Báu Hỗn Loạn':'tr','Tiếng Gầm Không Gian':'roar','Cảnh Báo Đỏ':'rw','Vụ Nổ Đỏ Khóa':'rb','Đồng Hồ Cát':'hg','Lưới Cầu Vàng':'gn','Hạm Đội Hộ Vệ':'dr'};
const RB='Vụ Nổ Đỏ Khóa';
const CF={
  sa:{rng:12,beam:.45,n:4,gap:.32,R:9,v:18,dmg:400,kb:1,sil:1,cd:210},
  fog:{w:6,h:6,ahead:3,life:6,cd:300},
  ag:{R:6,dur:4,cd:250},
  rz:{R:7,dur:5,cd:250},
  mx:{dur:5,k:.5,cd:300},
  tr:{throwR:10,life:10,lure:14,R:7,dmg:600,kb:1,n:80,sR:6,sv:10,sDmg:70,da:10,cd:250},
  roar:{n:6,gap:.18,len:10,v:16,half:.55,band:1.1,dmg:500,fear:2,cd:250},
  rw:{R:7,life:25,boss:.3,cd:250},
  rb:{R:9,pct:.8,self:1000,cd:250},
  hg:{R:8,dur:4,cd:250},
  gn:{find:1200/65,R:15,dur:5,slow:.2,dmg:800,cd:300},
  dr:{n:10,hp:500,dmg:200,rof:.5,life:5,rng:7,sp:6,cd:240}};
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
/* ---------- 1) gỡ 4 kỹ năng, đổi tên ---------- */
const PRICE={};
DEL.forEach(n=>{const i=KI.findIndex(k=>k[0]===n);if(i>=0){PRICE[n]=[+KI[i][3]||0,+KI[i][4]||0];KI.splice(i,1);KP.splice(i,1)}KDEL[n]=1});
Object.keys(REN).forEach(a=>{const k=KI.find(x=>x[0]===a);if(k)k[0]=REN[a]});
/* ---------- 2) mô tả mới ---------- */
const TX={
 sa:['Bắn tia laser xanh vào kẻ địch gần nhất; tia sáng phát nổ tạo 4 đợt sóng âm lan rộng 9 ô quanh mục tiêu.',
  [['Sát thương','400 mỗi sóng (4 sóng)'],['Phạm vi','9 ô quanh mục tiêu'],['Đẩy lùi','1 ô (không cộng dồn)'],['Cấm kỹ năng','1 giây mỗi sóng (cộng dồn)'],['Hồi chiêu','210 giây'],['Hiệu ứng','Laser nổ thành sóng âm'],['Mục tiêu','Kẻ địch quanh mục tiêu']]],
 fog:['Phủ màn sương mù 6×6 ô ngay trước mũi tàu (tâm cách tàu 3 ô) trong 6 giây. Tàu đồng minh trong sương được che khuất, kẻ địch không nhìn thấy để nhắm bắn.',
  [['Vùng sương','6×6 ô'],['Vị trí','3 ô trước mặt tàu'],['Thời gian','6 giây'],['Hồi chiêu','300 giây'],['Hiệu ứng','Ẩn nấp đồng minh'],['Mục tiêu','Tàu đồng minh trong sương']]],
 ag:['Triệt tiêu trọng lực, nhấc bổng mọi kẻ địch trong 6 ô suốt 4 giây; trong lúc đó chúng không thể di chuyển, bắn hay dùng kỹ năng.',
  [['Phạm vi','6 ô quanh tàu'],['Thời gian','4 giây'],['Khống chế','Không thể làm gì'],['Hồi chiêu','250 giây'],['Hiệu ứng','Nhấc bổng mục tiêu'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 rz:['Tạo vùng cấm đỏ bán kính 7 ô trong 5 giây; kẻ địch trong vùng bị cấm dùng toàn bộ kỹ năng.',
  [['Phạm vi','7 ô'],['Thời gian','5 giây'],['Khống chế','Cấm dùng toàn bộ kỹ năng'],['Hồi chiêu','250 giây'],['Hiệu ứng','Vùng cấm đỏ'],['Mục tiêu','Kẻ địch trong vùng']]],
 mx:['Biến cả chiến trường thành ma trận số trong 5 giây, mọi con tàu hiện thành những mảnh vỡ chập chờn. Sát thương và hồi máu của tàu tăng 50%; kỹ năng của kẻ địch không thể chọn tàu này làm mục tiêu.',
  [['Tăng sát thương','+50%'],['Tăng hồi máu','+50%'],['Né chọn mục tiêu','Kỹ năng của kẻ địch'],['Thời gian','5 giây'],['Hồi chiêu','300 giây'],['Hiệu ứng','Hào quang bản thân'],['Mục tiêu','Tàu ta']]],
 tr:['Ném ra một rương vàng tồn tại 10 giây, dụ kẻ địch tới nhận. Kẻ địch chạm rương nhận 10 Đá, rồi rương nổ ánh vàng 7 ô và bắn ra 80 tia lửa vàng.',
  [['Vụ nổ đầu','600 sát thương, đẩy lùi 1 ô (7 ô)'],['Tia lửa vàng','80 tia × 70 sát thương (cộng dồn, 6 ô)'],['Rương vàng','Tồn tại 10 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Bùng nổ trong phạm vi'],['Mục tiêu','Kẻ địch chạm rương']]],
 roar:['Tàu gầm vang, phóng 6 sóng xanh về phía trước bay tối đa 10 ô; mỗi sóng gây sát thương và khiến kẻ địch sợ hãi bỏ chạy.',
  [['Sát thương','500 mỗi sóng (6 sóng, cộng dồn)'],['Tầm bay','10 ô'],['Sợ hãi','2 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Sợ hãi kẻ thù'],['Mục tiêu','Kẻ địch phía trước']]],
 rw:['Đặt dấu cảnh báo đỏ lên kẻ địch gần nhất trong 7 ô. Hết 25 giây, mục tiêu bị kết liễu ngay lập tức. Kẻ địch có thể dùng kỹ năng hóa giải để xóa dấu.',
  [['Phạm vi','7 ô'],['Dấu ấn','25 giây'],['Khi hết giờ','Kết liễu (trùm: mất 30% máu tối đa)'],['Hồi chiêu','250 giây'],['Hiệu ứng','Dấu cảnh báo đỏ'],['Mục tiêu','Kẻ địch gần nhất']]],
 rb:['Khi tàu chạm ngưỡng tử, tàu bùng nổ thành vụ nổ đỏ khóa 9 ô gây sát thương bằng 80% máu tối đa của tàu. Tự kích hoạt: tàu không tử vong, vụ nổ gây sát thương bằng 100% lượng máu tàu đã mất và tàu chịu 1.000 sát thương (giữ lại ít nhất 1 máu).',
  [['Phạm vi','9 ô'],['Khi tàu tử vong','80% máu tối đa của tàu'],['Tự kích hoạt','100% máu đã mất · tàu chịu 1.000'],['Hồi chiêu','250 giây'],['Hiệu ứng','Bùng nổ trong phạm vi'],['Mục tiêu','Mọi kẻ địch trong phạm vi']]],
 hg:['Bẻ cong thời gian quanh các tàu đồng minh trong 8 ô và tạo cho mỗi tàu một bản sao giống hệt trong 4 giây. Bản sao không thể tấn công hay dùng kỹ năng.',
  [['Phạm vi','8 ô'],['Thời gian','4 giây'],['Bản sao','Giống hệt tàu, không tấn công, không dùng kỹ năng'],['Hồi chiêu','250 giây'],['Hiệu ứng','Thời gian thực'],['Mục tiêu','Tàu đồng minh trong phạm vi']]],
 gn:['Giăng lưới cầu vàng bán kính 15 ô quanh kẻ địch gần nhất (tầm 1200) trong 5 giây: kẻ địch trong cầu bị chậm 20%, bị chói lóa không thể dùng kỹ năng hay định hướng. Hết giờ cầu nổ nhẹ gây 800 sát thương.',
  [['Tầm chọn mục tiêu','1200'],['Phạm vi lưới','15 ô'],['Thời gian','5 giây'],['Làm chậm','20% tốc chạy'],['Chói lóa','Không dùng kỹ năng, mất định hướng'],['Vụ nổ cuối','800 sát thương'],['Hồi chiêu','300 giây'],['Mục tiêu','Kẻ địch trong lưới']]],
 dr:['Gọi 10 drone chiến đấu lao vào tấn công kẻ địch trong 5 giây.',
  [['Số lượng','10 drone'],['Máu drone','500'],['Sát thương','200 mỗi đòn'],['Tốc độ đánh','2 đòn mỗi giây'],['Thời gian','5 giây'],['Hồi chiêu','240 giây'],['Hiệu ứng','Tạo drone'],['Mục tiêu','Kẻ địch gần nhất']]]};
Object.keys(ID).forEach(n=>{const k=KI.find(x=>x[0]===n),t=TX[ID[n]];if(!k||!t)return;k[5]=t[0];k[6].length=0;t[1].forEach(r=>k[6].push(r.slice()))});
/* ---------- 3) dọn dữ liệu người chơi ---------- */
function purge(){try{if(typeof S==='undefined'||!S)return;let ch=0,da=0,sao=0;
  if(Array.isArray(S.skills)){const L=[];S.skills.forEach(n=>{if(REN[n]){n=REN[n];ch=1}if(DEL.includes(n)){const p=PRICE[n];if(p){da+=p[0];sao+=p[1]}ch=1;return}if(!L.includes(n))L.push(n);else ch=1});S.skills=L}
  if(S.cske)Object.keys(S.cske).forEach(c=>{S.cske[c]=(S.cske[c]||[]).map(n=>{if(REN[n]){ch=1;return REN[n]}if(DEL.includes(n)){ch=1;return ''}return n})});
  if(da||sao){S.da=(S.da||0)+da;S.sao=(S.sao||0)+sao;setTimeout(()=>{try{toast('Đã hoàn '+NF(da)+' Đá và '+NF(sao)+' Sao cho kỹ năng bị gỡ khỏi game')}catch(e){}},3400)}
  if(ch){try{save()}catch(e){}try{refresh()}catch(e){}}}catch(e){console.error(e)}}
purge();
if(typeof slFix==='function'){const _f=slFix;slFix=function(){purge();return _f.apply(this,arguments)}}

/* ---------- 4) tiện ích ---------- */
const isES=(G,P)=>!!P&&(P.team==='e'||(G.en||[]).includes(P)||(G.eu||[]).includes(P));
function foes(G,es){if(es)return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost);return (G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t))}
function friends(G,es){if(es)return (G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t));return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost)}
const L28=G=>G.c28=G.c28||{o:[],sp:[],pop:[],tc:[]};
const pop=(G,x,y,s,col)=>L28(G).pop.push({x,y,s,col,t:0,max:1.4});
const ringFx=(G,x,y,r,col)=>{try{G.fx.push({x,y,r,t:.45,max:.45,col})}catch(e){}};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const bossK=e=>e&&e.boss?1/3:1;
function hurt(G,u,d,es,own){if(!u||u.dead||!(d>0))return 0;const h0=u.hp,ps=G.c28src;G.c28src=own||ps;
  try{if(es&&u!==G.pl&&typeof dfDmgA==='function')dfDmgA(u,d);else dfDmgS(u,d,es)}catch(e){console.error(e)}finally{G.c28src=ps}
  return Math.max(0,h0-Math.max(0,u.hp))}
const sk=(G,e,d,sc)=>d*(sc||1)*(G.dmM||1)*(e.boss?.35:1);
function clampXY(G,u){const W=(G.wd&&G.wd.Wd)||24,H=(G.wd&&G.wd.Hd)||24;u.x=Math.max(.5,Math.min(W-.5,u.x));u.y=Math.max(.5,Math.min(H-.5,u.y))}
function knock(G,e,cx,cy,d){if(!e||e.dead)return;let dx=e.x-cx,dy=e.y-cy,l=Math.hypot(dx,dy);if(l<.01){dx=1;dy=0;l=1}e.x+=dx/l*d;e.y+=dy/l*d;clampXY(G,e)}
function nearest(F,P,R){let b=null,bd=1e9;F.forEach(e=>{const q=dist(e,P)-(e.size||2)*.3;if(q<=R&&q<bd){bd=q;b=e}});return b}
function bestSpot(G,P,es,R,lim){const F=foes(G,es),C=F.filter(e=>dist(e,P)<=lim+(e.size||2)*.3);
  if(!C.length){const a=isFinite(P.ang)?P.ang:-Math.PI/2;return {x:P.x+Math.cos(a)*4,y:P.y+Math.sin(a)*4,n:0}}
  let best=null;C.forEach(t=>{const M=F.filter(e=>dist(e,t)<=R),s=M.length*1000-dist(t,P);if(!best||s>best.s)best={x:t.x,y:t.y,s,M}});
  let x=0,y=0;best.M.forEach(e=>{x+=e.x;y+=e.y});x/=best.M.length;y/=best.M.length;if(Math.hypot(x-best.x,y-best.y)>R*.6){x=best.x;y=best.y}
  if(F.some(e=>Math.hypot(e.x-x,e.y-y)<.15)){const a=Math.atan2(P.y-y,P.x-x)||0;x+=Math.cos(a)*.3;y+=Math.sin(a)*.3}return {x,y,n:best.M.length}}
const mxOn=(G,u)=>!!u&&u.c28mx>G.t;

/* ---------- 5) kế hoạch + thi triển ---------- */
{const _p=window.c26Plan;window.c26Plan=function(k){const id=k&&ID[k[0]];if(id)return {cat:k[1],vf:'c5',c5:2800+Object.keys(TX).indexOf(id),vfR:0,vfNo:1,R:0,c26:'c28',c28:id,noAuto:id==='rb'?1:0};return _p(k)}}
/* kỹ năng không thể chọn tàu đang ở ma trận số làm mục tiêu: tạm "giấu" tàu đó khi phe kia thi triển */
function hideFrom(G,P,fn){if(!G||!P)return fn();const es=isES(G,P),H=(es?[G.pl].concat(G.al||[]):(G.en||[])).filter(u=>u&&!u.dead&&mxOn(G,u));if(!H.length)return fn();
  const sv=H.map(u=>[u.x,u.y]);H.forEach(u=>{u.x+=1e5;u.y+=1e5});try{return fn()}finally{H.forEach((u,i)=>{u.x=sv[i][0];u.y=sv[i][1]})}}
{const _c=window.c26Cast;window.c26Cast=function(G,P,k,o,near,inR,sc){const a=arguments,t=this;
  if(!o||o.c26!=='c28')return hideFrom(G,P,()=>_c.apply(t,a));
  if(!G||!P||P.dead)return;try{hideFrom(G,P,()=>cast28(G,P,o.c28,sc||1,k))}catch(e){console.error(e)}}}
if(window.CSK&&CSK.cast){const _k=CSK.cast;CSK.cast=function(P,k,sc){const G=DG,a=arguments,t=this;return hideFrom(G,P,()=>_k.apply(t,a))}}

function cast28(G,P,id,sc,k){const es=isES(G,P),Z=L28(G),F=foes(G,es);
  if(id==='sa'){const C=CF.sa,t=nearest(F,P,C.rng),a=isFinite(P.ang)?P.ang:-Math.PI/2;
    Z.o.push({k:'sa',P,es,sc,tg:t,x:t?t.x:P.x+Math.cos(a)*8,y:t?t.y:P.y+Math.sin(a)*8,t:0,hit:[...Array(C.n)].map(()=>new Set()),kb:new Set()});return}
  if(id==='fog'){const C=CF.fog,a=isFinite(P.ang)?P.ang:-Math.PI/2;
    Z.o.push({k:'fog',P,es,x:P.x+Math.cos(a)*C.ahead,y:P.y+Math.sin(a)*C.ahead,a,t:0,max:C.life,seed:Math.random()*99});pop(G,P.x,P.y-2,'Màn sương ảo ảnh','#d8d4ff');return}
  if(id==='ag'){const C=CF.ag;let n=0;F.forEach(e=>{if(dist(e,P)>C.R+(e.size||2)*.3)return;const d=C.dur*bossK(e);
      e.stun=Math.max(e.stun||0,d);e.silT=Math.max(e.silT||0,d);e.noFire=Math.max(e.noFire||0,d);Z.o.push({k:'lift',e,t:0,max:d});n++});
    Z.o.push({k:'agw',x:P.x,y:P.y,t:0,max:.9});pop(G,P.x,P.y-2,n?'Nhấc bổng '+n+' mục tiêu':'Hủy trọng lực','#bfe3ff');return}
  if(id==='rz'){Z.o.push({k:'rz',x:P.x,y:P.y,es,t:0,max:CF.rz.dur});pop(G,P.x,P.y-2.5,'Vùng cấm đỏ!','#ff8a8a');return}
  if(id==='mx'){P.c28mx=G.t+CF.mx.dur;Z.o.push({k:'mx',P,es,t:0,max:CF.mx.dur,seed:Math.random()*99});pop(G,P.x,P.y-2,'MA TRẬN SỐ · +50%','#7dff9a');return}
  if(id==='tr'){const C=CF.tr,p=bestSpot(G,P,es,C.R,C.throwR+4);let x=p.x,y=p.y;const l=Math.hypot(x-P.x,y-P.y)||1;if(l>C.throwR){x=P.x+(x-P.x)/l*C.throwR;y=P.y+(y-P.y)/l*C.throwR}
    /* ném rương ra khoảng trống trước cụm địch (cách kẻ địch gần nhất ~3,5 ô) để chúng phải lao tới nhận */
    const ux=(x-P.x)/l,uy=(y-P.y)/l;for(let i=0;i<20;i++){const q=Math.min(...F.map(e=>Math.hypot(e.x-x,e.y-y)-(e.size||2)*.3).concat([99]));if(q>=3.5||Math.hypot(x-P.x,y-P.y)<2.5)break;x-=ux*.5;y-=uy*.5}
    const o={x,y};clampXY(G,o);
    Z.o.push({k:'tr',P,es,sc,x0:P.x,y0:P.y,x:o.x,y:o.y,t:0,st:'fly',c28st:0,life:C.life});return}
  if(id==='roar'){const C=CF.roar,h=isFinite(P.ang)?P.ang:null,inCone=e=>{if(h==null)return true;let d=Math.atan2(e.y-P.y,e.x-P.x)-h;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)<=1.05};
    /* phóng về phía trước mũi tàu; nếu phía trước không có ai thì quay về kẻ địch gần nhất */
    const tc=nearest(F.filter(inCone),P,C.len),tn=nearest(F,P,12),t=tc||(h==null?tn:null),a=t?Math.atan2(t.y-P.y,t.x-P.x):(h!=null?h:-Math.PI/2);
    Z.o.push({k:'roar',P,es,sc,a,t:0,org:[],hit:[...Array(C.n)].map(()=>new Set())});pop(G,P.x,P.y-2,'Tiếng gầm không gian!','#9fdcff');return}
  if(id==='rw'){const t=nearest(F,P,CF.rw.R);if(!t){pop(G,P.x,P.y-2,'Không có mục tiêu trong 7 ô','#ffb0b0');return}
    t.c28rw={t0:G.t,end:G.t+(G.pv?4:CF.rw.life),by:P,es,sc};Z.o.push({k:'rw',e:t,P,es,sc,t:0});pop(G,t.x,t.y-2,'Cảnh báo đỏ!','#ff6a6a');return}
  if(id==='rb'){const lost=Math.max(0,(P.max||0)-(P.hp||0)),d=G.pv?Math.max(lost,(P.max||0)*.5):lost;boom(G,P,d,es,sc);
    if(!G.pv){P.hp=Math.max(1,(P.hp||1)-CF.rb.self);P.hit=.15}pop(G,P.x,P.y-2.4,'Tự kích nổ · '+NF(d)+' sát thương','#ff7a7a');return}
  if(id==='hg'){const C=CF.hg,A=friends(G,es).filter(u=>dist(u,P)<=C.R+(u.size||2)*.3);
    A.forEach((u,i)=>{let cl=null;if(!es)cl=clone(G,u,C.dur,i);Z.o.push({k:'hg',u,cl,t:0,max:C.dur})});pop(G,P.x,P.y-2.4,'Đồng hồ cát · '+A.length+' bản sao','#ffe3a0');return}
  if(id==='gn'){const t=nearest(F,P,CF.gn.find);if(!t){pop(G,P.x,P.y-2,'Không có mục tiêu','#ffe08a');return}
    Z.o.push({k:'gn',P,es,sc,x:t.x,y:t.y,t:0,max:CF.gn.dur});pop(G,t.x,t.y-2.5,'Lưới cầu vàng!','#ffe08a');return}
  if(id==='dr'){const C=CF.dr;for(let i=0;i<C.n;i++){const a=i/C.n*Math.PI*2,d={c28d:1,x:P.x+Math.cos(a)*2,y:P.y+Math.sin(a)*2,hp:C.hp,max:C.hp,dead:false,taunt:!es,hr:.8,size:1.2,red:0,own:P,es,sc,t:C.life,cd:Math.random()*C.rof,ang:a,orb:a,born:G.t};
      clampXY(G,d);Z.o.push({k:'dr',d});if(!es){G.c14t=(G.c14t||[]).filter(q=>!q.dead);G.c14t.push(d)}}
    pop(G,P.x,P.y-2.4,'Hạm đội hộ vệ · 10 drone','#9fe8ff');return}}
/* bản sao: giống hệt tàu, không vũ khí, không kỹ năng (tự biến mất nhờ cơ chế bóng ma sẵn có) */
function clone(G,u,life,i){try{const a=(isFinite(u.ang)?u.ang:0)+Math.PI/2*(i%2?1:-1),x=u.x+Math.cos(a)*2.4,y=u.y+Math.sin(a)*2.4;
  const g=Object.assign({},u,{team:'p',ally:1,ghost:1,nh:1,gf:'sepia(.55) hue-rotate(5deg) saturate(2.4) brightness(1.2)',gfa:.78,gt:life,glife:life,x,y,sx:x,sy:y,tx:x,ty:y,vx:0,vy:0,hp:u.hp,max:u.max,dead:false,hit:0,cs:null,hl:null,fr:null,bd:null,shd:null,rb:null,sk:[],stl:0,fd:0,inf:1,absb:null,red:0,dm:1,ws:[],ls:0,sp:u.sp||3,c14e:null,c14sh:null,c14m:.5,rvg:null,silT:0,size:u.size||2.2,c28mx:0,c28rw:null,c28clone:1});
  clampXY(G,g);(G.al=G.al||[]).push(g);return g}catch(e){console.error(e);return null}}
function boom(G,u,d,es,sc){const C=CF.rb;let n=0;foes(G,es).forEach(e=>{if(dist(e,u)<=C.R+(e.size||2)*.3){hurt(G,e,d*(sc||1)*(e.boss?.35:1),es,u);n++}});
  L28(G).o.push({k:'rbx',x:u.x,y:u.y,t:0,max:1.2});ringFx(G,u.x,u.y,C.R,'#ff3b3b');ringFx(G,u.x,u.y,C.R*.55,'#ffd0d0');try{G.shake=Math.max(G.shake||0,.4)}catch(e){}
  if(n)pop(G,u.x,u.y-1.4,'Vụ nổ đỏ khóa · trúng '+n,'#ff9a9a')}
/* tự kích nổ khi tàu tử vong */
function onDeath(G,s){try{if(!G||!s||s.c28clone)return;const L=(G.pl&&G.pl.sk)||[];let k=L.find(k=>k&&k.cap&&k.cap[0]===RB&&(k.src||G.pl)===s&&!(k.cd>0));
  if(!k&&Array.isArray(s.sk))k=s.sk.find(k=>k&&k.cap&&k.cap[0]===RB&&!(k.cd>0));if(!k)return;
  k.cd=(k.q&&k.q.cd)||CF.rb.cd;boom(G,s,(s.max||0)*CF.rb.pct,isES(G,s),1);pop(G,s.x,s.y-2.4,'Vụ nổ đỏ khóa!','#ff6a6a')}catch(e){console.error(e)}}

/* ---------- 6) móc vào lõi trận ---------- */
const side=(G,u)=>isES(G,u)?'e':'p';
function boostD(G,s,d){const src=G&&(G.c28src||G.c14p);if(src&&s&&src!==s&&mxOn(G,src)&&side(G,src)!==side(G,s))return d*(1+CF.mx.k);return d}
{const _D=dfDmgS;dfDmgS=function(s,d,f){const G=DG;if(G&&s&&d>0)d=boostD(G,s,d);const was=s&&!s.dead,r=_D.call(this,s,d,f);if(was&&s.dead&&G)onDeath(G,s);return r}}
if(typeof dfDmgA==='function'){const _A=dfDmgA;dfDmgA=function(a,d){const G=DG;if(G&&a&&d>0)d=boostD(G,a,d);const was=a&&!a.dead,r=_A.call(this,a,d);if(was&&a.dead&&G)onDeath(G,a);return r}}
{const _F=dfFire;dfFire=function(src,wp,tg,team){const G=DG,o=src&&(src.o||src);if(!G||!mxOn(G,o))return _F.apply(this,arguments);
  const n0=(G.pr||[]).length,ps=G.c28src;G.c28src=o;try{return _F.apply(this,arguments)}finally{G.c28src=ps;for(let i=n0;i<(G.pr||[]).length;i++){const p=G.pr[i];if(p&&!p.c28b){p.c28b=1;p.dmg=(p.dmg||0)*(1+CF.mx.k)}}}}}
/* điều hướng kẻ địch: bị chói lóa thì đi lạc, rương vàng thì lao tới nhận */
window.c28Tg=function(e,tg){const G=DG;if(!G||!e)return null;
  if(e.c28bl>G.t){if(!e.c28w||G.t>e.c28wt){const a=Math.random()*Math.PI*2,r=2+Math.random()*3;e.c28w={x:e.x+Math.cos(a)*r,y:e.y+Math.sin(a)*r,c28st:0};clampXY(G,e.c28w);e.c28wt=G.t+.9}return e.c28w}
  const Z=G.c28;if(!Z)return null;let best=null,bd=1e9;Z.o.forEach(o=>{if(o.k!=='tr'||o.st!=='wait'||o.es)return;const q=dist(o,e);if(q<=CF.tr.lure&&q<bd){bd=q;best=o}});return best};
{const _T=window.c14Taunt;window.c14Taunt=function(e,w){let r=_T?_T.apply(this,arguments):null;
  if(r&&r.c28d&&dist(e,r)>(w?Math.max(7,(w.rng||0)+1.5):7)){const Z=DG&&DG.c28,L=Z?Z.o.filter(o=>o.k==='dr').map(o=>o.d):[];L.forEach(t=>{t._tt=t.taunt;t.taunt=false});try{r=_T?_T.apply(this,arguments):null}finally{L.forEach(t=>{t.taunt=t._tt})}}
  return r}}

/* ---------- 7) cập nhật ---------- */
function step(G,dt){const Z=G&&G.c28;if(!Z||!(dt>0))return;
  Z.o.forEach(o=>{o.t+=dt;try{U[o.k]&&U[o.k](G,o,dt)}catch(e){console.error(e)}});
  Z.o=Z.o.filter(o=>!o.done);
  Z.sp.forEach(p=>{const m=p.v*dt;p.x+=p.vx*m;p.y+=p.vy*m;p.d+=m;if(p.d>=CF.tr.sR){p.done=1;return}
    for(const e of foes(G,p.es)){if(Math.hypot(e.x-p.x,e.y-p.y)<=(e.size||2)*.42+.2){hurt(G,e,sk(G,e,CF.tr.sDmg,p.sc),p.es,p.P);p.done=1;p.hx=1;break}}});
  Z.sp=Z.sp.filter(p=>!p.done);
  Z.tc.forEach(t=>t.t-=dt);Z.tc=Z.tc.filter(t=>t.t>0);
  /* ma trận số: hồi máu cho phe mình tăng 50% */
  ['p','e'].forEach(sd=>{const es=sd==='e',on=friends(G,es).some(u=>mxOn(G,u));friends(G,es).forEach(u=>{const h=u.hp;if(on&&u._c28h>0&&h>u._c28h+1e-6&&h<u.max)u.hp=Math.min(u.max,h+(h-u._c28h)*CF.mx.k);u._c28h=u.hp})});
  Z.pop.forEach(p=>p.t+=dt);Z.pop=Z.pop.filter(p=>p.t<p.max)}
const U={
 sa(G,o){const C=CF.sa;if(o.t<C.beam){if(o.tg&&!o.tg.dead){o.x=o.tg.x;o.y=o.tg.y}return}
  if(!o.boom){o.boom=1;ringFx(G,o.x,o.y,1.6,'#9fffe0');ringFx(G,o.x,o.y,.8,'#ffffff')}
  const F=foes(G,o.es);for(let i=0;i<C.n;i++){const r=(o.t-C.beam-i*C.gap)*C.v;if(r<0||r>C.R+1)continue;
    F.forEach(e=>{if(o.hit[i].has(e))return;const q=Math.hypot(e.x-o.x,e.y-o.y)-(e.size||2)*.3;if(q>Math.min(r,C.R))return;o.hit[i].add(e);
      hurt(G,e,sk(G,e,C.dmg,o.sc),o.es,o.P);if(!e.dead){e.silT=Math.max(0,e.silT||0)+C.sil*bossK(e);if(!o.kb.has(e)){o.kb.add(e);knock(G,e,o.x,o.y,C.kb)}}})}
  if(o.t>C.beam+(C.n-1)*C.gap+C.R/C.v+.4)o.done=1},
 fog(G,o){if(o.t>=o.max){o.done=1;return}const C=CF.fog,c=Math.cos(o.a),s=Math.sin(o.a);
  friends(G,o.es).forEach(u=>{const dx=u.x-o.x,dy=u.y-o.y,lx=dx*c+dy*s,ly=-dx*s+dy*c;if(Math.abs(lx)<=C.w/2+.3&&Math.abs(ly)<=C.h/2+.3){u.c28fog=G.t+.12;if(!o.es)u.smk=Math.max(u.smk||0,.3);else u.hidT=Math.max(u.hidT||0,.3)}})},
 lift(G,o){const e=o.e;if(e.dead||o.t>=o.max){e.lift=0;o.done=1;return}const up=Math.min(1,o.t/.45),dn=Math.min(1,(o.max-o.t)/.35);e.lift=Math.min(up,dn)*(.85+.1*Math.sin(G.t*4+o.max))},
 agw(G,o){if(o.t>=o.max)o.done=1},
 rz(G,o){if(o.t>=o.max){o.done=1;return}const C=CF.rz;foes(G,o.es).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<=C.R+(e.size||2)*.3){e.silT=Math.max(e.silT||0,.25);e.c28rz=G.t+.15}})},
 mx(G,o){if(o.t>=o.max||!o.P||o.P.dead){if(o.P)o.P.c28mx=0;o.done=1}},
 tr(G,o){const C=CF.tr;
  if(o.st==='fly'){if(o.t>=.6){o.st='wait';o.t0=G.t;ringFx(G,o.x,o.y,1.2,'#ffd84a')}return}
  if(o.st==='wait'){const age=G.t-o.t0;if(age>=C.life){o.st='gone';o.gt=G.t;return}
    let who=null;for(const e of foes(G,o.es)){if(Math.hypot(e.x-o.x,e.y-o.y)<=(e.size||2)*.42+.9){who=e;break}}
    if(!who&&G.pv&&age>1.6)who=nearest(foes(G,o.es),o,99);
    if(who)openChest(G,o,who);return}
  if(o.st==='open'){if(G.t-o.ot>1.1)o.done=1;return}
  if(o.st==='gone'&&G.t-o.gt>.6)o.done=1},
 roar(G,o){const C=CF.roar,P=o.P;for(let i=0;i<C.n;i++){const st=i*C.gap;if(o.t<st)continue;if(!o.org[i])o.org[i]={x:P.x,y:P.y};const r=(o.t-st)*C.v,O=o.org[i];if(r>C.len+.5)continue;
    foes(G,o.es).forEach(e=>{if(o.hit[i].has(e))return;const dx=e.x-O.x,dy=e.y-O.y,q=Math.hypot(dx,dy);if(Math.abs(q-r)>C.band+(e.size||2)*.3||q>C.len+(e.size||2)*.3)return;
      let da=Math.atan2(dy,dx)-o.a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;if(Math.abs(da)>C.half+Math.atan2((e.size||2)*.3,Math.max(.5,q)))return;
      o.hit[i].add(e);hurt(G,e,sk(G,e,C.dmg,o.sc),o.es,P);if(!e.dead){const f=C.fear*bossK(e);e.fearT=Math.max(e.fearT||0,f);e.fearX=O.x;e.fearY=O.y;e.c28fr=G.t+f}})}
  if(o.t>(C.n-1)*C.gap+C.len/C.v+.4)o.done=1},
 rw(G,o){const e=o.e,m=e&&e.c28rw;if(!e||e.dead){o.done=1;return}
  if(!m){o.done=1;pop(G,e.x,e.y-2,'Dấu cảnh báo đã bị hóa giải','#c8ffd8');return}
  if(G.t>=m.end){e.c28rw=null;o.done=1;ringFx(G,e.x,e.y,(e.size||2)*1.4,'#ff2a2a');ringFx(G,e.x,e.y,(e.size||2)*.7,'#ffffff');
    if(e.boss)hurt(G,e,e.max*CF.rw.boss,o.es,o.P);else{const ps=G.c28src;G.c28src=null;try{if(o.es&&e!==G.pl&&typeof dfDmgA==='function')dfDmgA(e,e.hp+1e7);else dfDmgS(e,e.hp+1e7,o.es)}finally{G.c28src=ps}}
    pop(G,e.x,e.y-2,e.boss?'Cảnh báo đỏ · −30% máu':'KẾT LIỄU!','#ff5050')}},
 rbx(G,o){if(o.t>=o.max)o.done=1},
 hg(G,o){if(o.t>=o.max||o.u.dead){o.done=1;if(o.cl&&!o.cl.dead){o.cl.gt=0}return}if(o.cl&&!o.cl.dead){o.cl.ws=[];o.cl.sk=[];o.cl.silT=99}},
 gn(G,o){const C=CF.gn;if(o.t<o.max){foes(G,o.es).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)>C.R+(e.size||2)*.3)return;e.slowT=Math.max(e.slowT||0,.25);e.slowK=Math.min(e.slowK||1,1-C.slow);e.silT=Math.max(e.silT||0,.25);e.c28bl=G.t+.25});return}
  if(!o.boom){o.boom=1;let n=0;foes(G,o.es).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<=C.R+(e.size||2)*.3){hurt(G,e,sk(G,e,C.dmg,o.sc),o.es,o.P);n++}});
    ringFx(G,o.x,o.y,C.R,'#ffd84a');ringFx(G,o.x,o.y,C.R*.5,'#fff3b0');if(n)pop(G,o.x,o.y-1,'Lưới cầu nổ · trúng '+n,'#ffe08a')}
  if(o.t>o.max+.7)o.done=1},
 dr(G,o,dt){const d=o.d,C=CF.dr;if(d.dead){if(!d.gone){d.gone=1;ringFx(G,d.x,d.y,1,'#ffb060')}o.done=1;return}
  d.t=C.life-(G.t-d.born);if(d.t<=0){d.dead=true;d.gone=1;ringFx(G,d.x,d.y,.8,'#9fe8ff');o.done=1;return}
  let tg=null,bd=1e9;foes(G,d.es).forEach(e=>{const q=dist(e,d);if(q<bd&&dist(e,d.own)<=14){bd=q;tg=e}});
  let gx,gy;if(tg){d.orb+=dt*1.6;const r=2.4+(e=>(e.size||2)*.4)(tg);gx=tg.x+Math.cos(d.orb)*r;gy=tg.y+Math.sin(d.orb)*r}else{d.orb+=dt*1.2;gx=d.own.x+Math.cos(d.orb)*2.6;gy=d.own.y+Math.sin(d.orb)*2.6}
  const dx=gx-d.x,dy=gy-d.y,l=Math.hypot(dx,dy);if(l>.01){const m=Math.min(l,C.sp*dt);d.x+=dx/l*m;d.y+=dy/l*m}
  if(tg){d.ang=Math.atan2(tg.y-d.y,tg.x-d.x);d.cd-=dt;if(d.cd<=0&&dist(tg,d)<=C.rng+(tg.size||2)*.3){d.cd=C.rof;hurt(G,tg,sk(G,tg,C.dmg,d.sc),d.es,d.own);L28(G).tc.push({x1:d.x,y1:d.y,x2:tg.x,y2:tg.y,t:.12})}}
  else if(l>.05)d.ang=Math.atan2(dy,dx)}};
function openChest(G,o,who){const C=CF.tr;o.st='open';o.ot=G.t;
  pop(G,who.x,who.y-1.6,'+'+C.da+' Đá','#ffe27a');if(o.es&&who===G.pl&&!G.pv){try{S.da=(S.da||0)+C.da;save();refresh()}catch(e){}}
  let n=0;foes(G,o.es).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<=C.R+(e.size||2)*.3){hurt(G,e,sk(G,e,C.dmg,o.sc),o.es,o.P);knock(G,e,o.x,o.y,C.kb);n++}});
  for(let i=0;i<C.n;i++){const a=i/C.n*Math.PI*2+Math.random()*.05;L28(G).sp.push({x:o.x,y:o.y,vx:Math.cos(a),vy:Math.sin(a),v:C.sv*(.8+Math.random()*.4),d:0,es:o.es,sc:o.sc,P:o.P})}
  ringFx(G,o.x,o.y,C.R,'#ffd84a');ringFx(G,o.x,o.y,C.R*.45,'#fff6c8');try{G.shake=Math.max(G.shake||0,.3)}catch(e){}if(n)pop(G,o.x,o.y-2.2,'Rương vàng nổ · trúng '+n,'#ffe08a')}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}
if(window.CSK&&CSK.tick){const _t=CSK.tick;CSK.tick=function(dt){const r=_t.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}

/* ---------- 8) vẽ ---------- */
const GL='01アカサタナハマヤラワ0123456789ABCDEFΣΔΨ';
function draw(q,G,X,Y,s){const Z=G&&G.c28;if(!Z)return;const T=G.t;
  /* lớp dưới: vùng, lưới, bóng nâng */
  Z.o.forEach(o=>{q.save();try{
   if(o.k==='rz'){const x=X(o.x),y=Y(o.y),R=CF.rz.R*s,al=Math.min(1,o.t/.25,(o.max-o.t)/.35);q.globalAlpha=Math.max(0,al);
     const g=q.createRadialGradient(x,y,R*.2,x,y,R);g.addColorStop(0,'rgba(255,40,40,.08)');g.addColorStop(1,'rgba(255,30,30,.28)');q.fillStyle=g;q.beginPath();q.arc(x,y,R,0,7);q.fill();
     q.strokeStyle='#ff3b3b';q.lineWidth=3;q.shadowColor='#ff2020';q.shadowBlur=14;q.setLineDash([14,8]);q.lineDashOffset=-T*30;q.beginPath();q.arc(x,y,R,0,7);q.stroke();q.setLineDash([]);
     q.lineWidth=2;q.globalAlpha*=.6;for(let i=0;i<24;i++){const a=i/24*Math.PI*2+T*.4;q.beginPath();q.moveTo(x+Math.cos(a)*R*.9,y+Math.sin(a)*R*.9);q.lineTo(x+Math.cos(a+.12)*R*.97,y+Math.sin(a+.12)*R*.97);q.stroke()}
     q.globalAlpha=Math.max(0,al)*.85;const r2=Math.max(10,s*.9);q.strokeStyle='#ff5050';q.lineWidth=Math.max(3,s*.16);q.beginPath();q.arc(x,y,r2,0,7);q.stroke();q.beginPath();q.moveTo(x-r2*.7,y+r2*.7);q.lineTo(x+r2*.7,y-r2*.7);q.stroke()}
   else if(o.k==='gn'){const x=X(o.x),y=Y(o.y),R=CF.gn.R*s,al=o.t<o.max?Math.min(1,o.t/.3):Math.max(0,1-(o.t-o.max)/.7);q.globalAlpha=al;
     const g=q.createRadialGradient(x,y,R*.1,x,y,R);g.addColorStop(0,'rgba(255,220,90,.05)');g.addColorStop(.85,'rgba(255,200,60,.12)');g.addColorStop(1,'rgba(255,230,120,.32)');q.fillStyle=g;q.beginPath();q.arc(x,y,R,0,7);q.fill();
     q.strokeStyle='rgba(255,215,90,.75)';q.shadowColor='#ffd84a';q.shadowBlur=10;q.lineWidth=2;q.beginPath();q.arc(x,y,R,0,7);q.stroke();q.lineWidth=1.3;
     for(let i=1;i<6;i++){const k=i/6*2-1;q.beginPath();q.ellipse(x,y+k*R,R*Math.sqrt(1-k*k),R*Math.sqrt(1-k*k)*.18,0,0,7);q.stroke()}
     for(let i=0;i<6;i++){const ph=i/6*Math.PI+T*.5,rx=Math.abs(Math.cos(ph))*R;q.beginPath();q.ellipse(x,y,Math.max(1,rx),R,0,0,7);q.stroke()}
     if(o.t<o.max){q.lineWidth=4;q.strokeStyle='#fff1b0';q.beginPath();q.arc(x,y,R+6,-Math.PI/2,-Math.PI/2+2*Math.PI*(1-o.t/o.max));q.stroke()}}
   else if(o.k==='lift'){const e=o.e;if(!e.dead){const x=X(e.x),y=Y(e.y),r=(e.size||2)*s*.45;q.globalAlpha=.55;q.fillStyle='#0a1630';q.beginPath();q.ellipse(x,y+r*.6,r*1.1,r*.32,0,0,7);q.fill();
     q.strokeStyle='#8fd0ff';q.lineWidth=2;q.shadowColor='#6fb8ff';q.shadowBlur=10;for(let i=0;i<3;i++){const k=((T*1.2+i/3)%1);q.globalAlpha=.7*(1-k);q.beginPath();q.ellipse(x,y+r*.6-k*r*1.6,r*(1.2-k*.4),r*.3*(1.2-k*.4),0,0,7);q.stroke()}}}
   else if(o.k==='agw'){const x=X(o.x),y=Y(o.y),k=o.t/o.max;q.globalAlpha=1-k;q.strokeStyle='#9fd8ff';q.lineWidth=3;q.shadowColor='#7fc8ff';q.shadowBlur=14;q.beginPath();q.arc(x,y,CF.ag.R*s*k,0,7);q.stroke();q.setLineDash([6,6]);q.beginPath();q.arc(x,y,CF.ag.R*s,0,7);q.stroke()}
   else if(o.k==='hg'){const u=o.u;[u,o.cl].forEach((w,j)=>{if(!w||w.dead)return;const x=X(w.x),y=Y(w.y),r=(w.size||2)*s*.75;q.save();q.globalAlpha=.75*Math.min(1,(o.max-o.t)/.4,o.t/.2);
     q.strokeStyle=j?'#ffd27a':'#ffe9b0';q.lineWidth=2;q.shadowColor='#ffcf6a';q.shadowBlur=12;for(let i=0;i<3;i++){const rr=r*(1+.22*i)+Math.sin(T*5+i*2)*3;q.beginPath();for(let a=0;a<=64;a++){const t=a/64*Math.PI*2,w2=1+.06*Math.sin(t*5+T*6+i);q.lineTo(x+Math.cos(t)*rr*w2,y+Math.sin(t)*rr*w2)}q.stroke()}
     for(let i=0;i<12;i++){const a=i/12*Math.PI*2+T*(j?-1:1)*.8;q.beginPath();q.moveTo(x+Math.cos(a)*r*1.5,y+Math.sin(a)*r*1.5);q.lineTo(x+Math.cos(a)*r*1.65,y+Math.sin(a)*r*1.65);q.stroke()}
     if(!j){const hx=x,hy=y-r*1.6,h=Math.max(8,s*.5);q.fillStyle='#ffe2a0';q.beginPath();q.moveTo(hx-h*.5,hy-h);q.lineTo(hx+h*.5,hy-h);q.lineTo(hx,hy);q.lineTo(hx+h*.5,hy+h);q.lineTo(hx-h*.5,hy+h);q.lineTo(hx,hy);q.closePath();q.fill()}q.restore()})}
  }finally{q.restore()}});
  /* hiệu ứng chính */
  Z.o.forEach(o=>{q.save();try{
   if(o.k==='sa'){const C=CF.sa,P=o.P,x=X(o.x),y=Y(o.y);
     if(o.t<C.beam+.15&&P){const a=Math.min(1,(C.beam+.15-o.t)/.2);q.globalAlpha=a;q.lineCap='round';q.shadowColor='#3dffcf';q.shadowBlur=18;q.strokeStyle='rgba(60,255,200,.55)';q.lineWidth=Math.max(6,s*.45);q.beginPath();q.moveTo(X(P.x),Y(P.y));q.lineTo(x,y);q.stroke();q.strokeStyle='#e8fffa';q.lineWidth=Math.max(2,s*.14);q.stroke()}
     if(o.t>=C.beam){const k=o.t-C.beam;if(k<.35){q.globalAlpha=1-k/.35;const g=q.createRadialGradient(x,y,0,x,y,s*2.4);g.addColorStop(0,'#ffffff');g.addColorStop(.4,'rgba(80,255,210,.8)');g.addColorStop(1,'rgba(80,255,210,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,s*2.4,0,7);q.fill()}
       for(let i=0;i<C.n;i++){const r=(k-i*C.gap)*C.v;if(r<0||r>C.R+1)continue;const al=Math.max(0,1-r/(C.R+1));q.globalAlpha=al;q.shadowColor='#3dffcf';q.shadowBlur=12;
         for(let j=0;j<3;j++){const rr=Math.max(1,(r-j*.35)*s);q.strokeStyle=j?'rgba(120,255,220,.6)':'#c8fff0';q.lineWidth=j?2:4;q.beginPath();q.arc(x,y,rr,0,7);q.stroke()}}}}
   else if(o.k==='roar'){const C=CF.roar;for(let i=0;i<C.n;i++){const O=o.org[i];if(!O)continue;const r=(o.t-i*C.gap)*C.v;if(r<0||r>C.len+.5)continue;const al=Math.max(0,1-r/(C.len+.5))*.95,x=X(O.x),y=Y(O.y);
       q.globalAlpha=al;q.shadowColor='#4aa8ff';q.shadowBlur=18;q.lineCap='round';q.strokeStyle='rgba(70,160,255,.55)';q.lineWidth=Math.max(8,C.band*s*.9);q.beginPath();q.arc(x,y,Math.max(1,r*s),o.a-C.half,o.a+C.half);q.stroke();
       q.strokeStyle='#dff0ff';q.lineWidth=Math.max(2,s*.12);q.beginPath();q.arc(x,y,Math.max(1,r*s),o.a-C.half*.9,o.a+C.half*.9);q.stroke()}}
   else if(o.k==='rbx'){const x=X(o.x),y=Y(o.y),k=o.t/o.max,R=CF.rb.R*s;q.globalAlpha=Math.max(0,1-k);
     const g=q.createRadialGradient(x,y,0,x,y,R*Math.min(1,k*2.2));g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.3,'rgba(255,60,60,.75)');g.addColorStop(1,'rgba(160,0,0,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,R*Math.min(1,k*2.2),0,7);q.fill();
     q.strokeStyle='#ff3030';q.lineWidth=5;q.shadowColor='#ff0000';q.shadowBlur=20;const rr=R*Math.min(1,k*1.6);q.beginPath();for(let i=0;i<8;i++){const a0=i/8*Math.PI*2+k,a1=a0+Math.PI/8*1.4;q.moveTo(x+Math.cos(a0)*rr,y+Math.sin(a0)*rr);q.arc(x,y,rr,a0,a1)}q.stroke();
     const L=Math.max(10,s*.8);q.globalAlpha=Math.max(0,1-k*1.4);q.lineWidth=3;q.strokeStyle='#ffd0d0';q.strokeRect(x-L*.6,y-L*.2,L*1.2,L);q.beginPath();q.arc(x,y-L*.2,L*.4,Math.PI,0);q.stroke()}
   else if(o.k==='tr'){const C=CF.tr;let x,y,h=0;if(o.st==='fly'){const k=Math.min(1,o.t/.6);x=X(o.x0+(o.x-o.x0)*k);y=Y(o.y0+(o.y-o.y0)*k);h=Math.sin(k*Math.PI)*s*2}else{x=X(o.x);y=Y(o.y)}
     const al=o.st==='gone'?Math.max(0,1-(G.t-o.gt)/.6):o.st==='open'?Math.max(0,1-(G.t-o.ot)/.25):1,w=Math.max(18,s*1.3);q.globalAlpha=al;
     if(o.st==='wait'){const pl=.5+.5*Math.sin(T*6);q.globalAlpha=al*.35;q.strokeStyle='#ffd84a';q.lineWidth=2;q.setLineDash([4,8]);q.lineDashOffset=-T*20;q.beginPath();q.arc(x,y,w*(1.2+pl*.3),0,7);q.stroke();q.setLineDash([]);q.globalAlpha=al}
     q.translate(x,y-h);q.shadowColor='#ffcc33';q.shadowBlur=22;q.fillStyle='#8a4a12';q.fillRect(-w/2,-w*.25,w,w*.55);q.fillStyle='#ffcf3a';q.fillRect(-w/2,-w*.25,w,w*.1);q.fillRect(-w*.08,-w*.25,w*.16,w*.55);
     q.fillStyle='#b8661a';q.beginPath();q.moveTo(-w/2,-w*.25);q.quadraticCurveTo(0,-w*.62,w/2,-w*.25);q.closePath();q.fill();q.strokeStyle='#ffe58a';q.lineWidth=2;q.stroke();q.strokeRect(-w/2,-w*.25,w,w*.55);
     q.fillStyle='#fff6c0';q.beginPath();q.arc(0,-w*.05,w*.07,0,7);q.fill();
     for(let i=0;i<4;i++){const a=T*2+i*1.6,rr=w*(.7+.15*Math.sin(T*3+i));q.globalAlpha=al*(.5+.5*Math.sin(T*7+i*2));q.fillStyle='#fff3a0';q.beginPath();q.arc(Math.cos(a)*rr,Math.sin(a)*rr*.6-w*.2,2.2,0,7);q.fill()}
     if(o.st==='wait'){q.globalAlpha=al;q.shadowBlur=0;q.fillStyle='#fff1c0';q.font='bold '+Math.max(11,Math.round(s*.45))+'px system-ui,sans-serif';q.textAlign='center';q.fillText(Math.max(0,C.life-(G.t-o.t0)).toFixed(0)+' s',0,w*.75)}}
   else if(o.k==='rw'){const e=o.e,m=e&&e.c28rw;if(m&&!e.dead){const x=X(e.x),y=Y(e.y-(e.lift||0)*1.3),r=(e.size||2)*s*.62,left=Math.max(0,m.end-G.t),urg=left<5?.5+.5*Math.sin(T*14):.5+.5*Math.sin(T*4);
     q.strokeStyle='#ff2a2a';q.shadowColor='#ff0000';q.shadowBlur=12;q.lineWidth=2.5;q.globalAlpha=.6+.4*urg;q.beginPath();q.arc(x,y,r,0,7);q.stroke();
     for(let i=0;i<4;i++){const a=i*Math.PI/2+T*1.5;q.beginPath();q.moveTo(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8);q.lineTo(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r*1.3);q.stroke()}
     const h=Math.max(14,s*.9),ty=y-r-h*1.1;q.globalAlpha=1;q.fillStyle='#d01818';q.beginPath();q.moveTo(x,ty-h*.6);q.lineTo(x+h*.62,ty+h*.45);q.lineTo(x-h*.62,ty+h*.45);q.closePath();q.fill();q.strokeStyle='#ffd0d0';q.lineWidth=2;q.stroke();
     q.shadowBlur=0;q.fillStyle='#fff';q.font='bold '+Math.round(h*.62)+'px system-ui,sans-serif';q.textAlign='center';q.fillText('!',x,ty+h*.32);q.fillStyle='#ffb0b0';q.font='bold '+Math.max(11,Math.round(s*.42))+'px system-ui,sans-serif';q.fillText(left.toFixed(left<10?1:0)+' s',x,ty-h*.75)}}
   else if(o.k==='dr'){const d=o.d;if(!d.dead){const x=X(d.x),y=Y(d.y),r=Math.max(6,s*.42);q.translate(x,y);q.rotate(d.ang);q.shadowColor='#5fd8ff';q.shadowBlur=10;q.fillStyle='#cfe9ff';q.strokeStyle='#2a6aa8';q.lineWidth=1.5;
     q.beginPath();q.moveTo(r,0);q.lineTo(-r*.7,-r*.65);q.lineTo(-r*.35,0);q.lineTo(-r*.7,r*.65);q.closePath();q.fill();q.stroke();q.fillStyle='#62e0ff';q.beginPath();q.arc(-r*.5,0,r*.22+Math.sin(T*20)*1,0,7);q.fill();
     q.rotate(-d.ang);q.shadowBlur=0;const bw=r*2;q.fillStyle='#000a';q.fillRect(-bw/2,-r*1.35,bw,3);q.fillStyle='#5fe08a';q.fillRect(-bw/2,-r*1.35,bw*Math.max(0,d.hp/d.max),3)}}
  }finally{q.restore()}});
  /* màn sương phủ lên tàu */
  Z.o.forEach(o=>{if(o.k!=='fog')return;const C=CF.fog,al=Math.min(1,o.t/.4,(o.max-o.t)/.5);q.save();q.globalAlpha=Math.max(0,al);q.translate(X(o.x),Y(o.y));q.rotate(o.a);const w=C.w*s,h=C.h*s;
    for(let i=0;i<16;i++){const gx=(i%4-1.5)/4+Math.sin(o.seed+i*12.9898)*.06,gy=(Math.floor(i/4)-1.5)/4+Math.sin(o.seed*1.7+i*78.233)*.06,px=(gx+.04*Math.sin(T*.6+i))*w,py=(gy+.04*Math.cos(T*.5+i*1.3))*h,rr=w*(.24+.08*Math.abs(Math.sin(i*3.1)));
      const g=q.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,'rgba(222,220,240,.62)');g.addColorStop(.6,'rgba(190,188,220,.35)');g.addColorStop(1,'rgba(170,170,210,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,rr,0,7);q.fill()}
    q.globalAlpha=Math.max(0,al)*.35;q.strokeStyle='#e8e6ff';q.setLineDash([5,7]);q.lineWidth=1.5;q.strokeRect(-w/2,-h/2,w,h);q.restore()});
  /* tia lửa vàng, vệt đạn drone */
  Z.sp.forEach(p=>{const x=X(p.x),y=Y(p.y);q.save();q.globalAlpha=Math.max(0,1-p.d/CF.tr.sR);q.strokeStyle='#ffd24a';q.shadowColor='#ffb020';q.shadowBlur=8;q.lineWidth=2.4;q.beginPath();q.moveTo(x,y);q.lineTo(x-p.vx*s*.7,y-p.vy*s*.7);q.stroke();q.restore()});
  Z.tc.forEach(t=>{q.save();q.globalAlpha=t.t/.12;q.strokeStyle='#8ff0ff';q.lineWidth=2;q.shadowColor='#5fd8ff';q.shadowBlur=8;q.beginPath();q.moveTo(X(t.x1),Y(t.y1));q.lineTo(X(t.x2),Y(t.y2));q.stroke();q.restore()});
  /* đi lạc do chói lóa, sợ hãi */
  (G.en||[]).concat([G.pl]).forEach(e=>{if(!e||e.dead)return;const x=X(e.x),y=Y(e.y-(e.lift||0)*1.3),r=(e.size||2)*s*.5;
    if(e.c28bl>T){q.save();q.globalAlpha=.85;q.fillStyle='#fff6c0';q.shadowColor='#ffd84a';q.shadowBlur=12;for(let i=0;i<3;i++){const a=T*3+i*2.1,px=x+Math.cos(a)*r*.6,py=y-r*.9+Math.sin(a)*r*.25,k=3+2*Math.sin(T*9+i);q.beginPath();q.moveTo(px,py-k);q.lineTo(px+k*.35,py);q.lineTo(px,py+k);q.lineTo(px-k*.35,py);q.closePath();q.fill()}q.restore()}
    if(e.c28fr>T){q.save();q.fillStyle='#bfe3ff';q.font='bold '+Math.max(12,Math.round(s*.6))+'px system-ui,sans-serif';q.textAlign='center';q.globalAlpha=.9;q.fillText('!!',x+r*.9,y-r*.9+Math.sin(T*12)*2);q.restore()}});
  /* ma trận số */
  const M=Z.o.filter(o=>o.k==='mx');if(M.length){const o=M[0],al=Math.max(0,Math.min(1,o.t/.35,(o.max-o.t)/.35));drawMatrix(q,G,X,Y,s,al,o)}
  Z.pop.forEach(p=>{const k=p.t/p.max;q.save();q.globalAlpha=Math.max(0,1-k);q.fillStyle=p.col||'#fff';q.font='bold '+Math.max(11,Math.round(s*.45))+'px system-ui,sans-serif';q.textAlign='center';q.fillText(p.s,X(p.x),Y(p.y)-k*s*1.2);q.restore()})}
function drawMatrix(q,G,X,Y,s,al,o){const T=G.t,cv=q.canvas;q.save();q.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;
  q.globalAlpha=al*.42;q.fillStyle='#001a08';q.fillRect(0,0,W,H);
  const fs=Math.max(12,Math.round(Math.min(W,H)/42));q.font=fs+'px monospace';q.textAlign='center';const cols=Math.ceil(W/fs);
  for(let c=0;c<cols;c++){const sp=1.6+((c*7919)%13)/6,len=6+(c*31)%9,head=((T*sp*fs*3+((c*104729)%H))%(H+len*fs))-len*fs*.2;
    for(let j=0;j<len;j++){const y=head-j*fs;if(y<-fs||y>H+fs)continue;q.globalAlpha=al*(j===0?.95:.6*(1-j/len));q.fillStyle=j===0?'#dfffe6':'#29ff6a';q.fillText(GL[(c*17+j*7+Math.floor(T*12+c))%GL.length],c*fs+fs/2,y)}}
  q.restore();
  /* tàu hiện thành mảnh vỡ chập chờn */
  q.save();const U=[G.pl].concat(G.al||[]).concat(G.en||[]).filter(u=>u&&!u.dead&&!(u.spawn>T));
  U.forEach((u,ui)=>{const x=X(u.x),y=Y(u.y),r=(u.size||2)*s*.55;q.globalAlpha=al;
    for(let i=0;i<6;i++){const k=Math.sin(ui*13.1+i*7.7+Math.floor(T*10)*.37),yy=y-r+(i+.5)*(2*r/6),off=k*r*.35;q.fillStyle=i%2?'rgba(0,30,10,.55)':'rgba(40,255,120,.16)';q.fillRect(x-r+off,yy-r/6,2*r*(.55+.45*Math.abs(k)),r/3*.7)}
    q.strokeStyle='#39ff7a';q.lineWidth=1.5;q.shadowColor='#39ff7a';q.shadowBlur=8;const b=r*.35;
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{q.beginPath();q.moveTo(x+sx*r,y+sy*(r-b));q.lineTo(x+sx*r,y+sy*r);q.lineTo(x+sx*(r-b),y+sy*r);q.stroke()})});
  /* hào quang tàu thi triển */
  const P=o.P;if(P&&!P.dead){const x=X(P.x),y=Y(P.y),r=(P.size||2)*s*.8;q.globalAlpha=al;q.strokeStyle='#7dff9a';q.shadowColor='#3dff7a';q.shadowBlur=22;q.lineWidth=3;
    q.beginPath();q.arc(x,y,r*(1+.08*Math.sin(T*6)),0,7);q.stroke();q.lineWidth=1.5;q.setLineDash([3,5]);q.lineDashOffset=-T*40;q.beginPath();q.arc(x,y,r*1.3,0,7);q.stroke();q.setLineDash([]);
    q.shadowBlur=0;q.fillStyle='#caffd8';q.font='bold '+Math.max(11,Math.round(s*.42))+'px monospace';q.textAlign='center';q.fillText('+50% · '+Math.max(0,o.max-o.t).toFixed(1)+'s',x,y-r*1.45)}
  q.restore()}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s)}catch(e){console.error(e)}}}
if(window.CSK&&CSK.draw){const _d=CSK.draw;CSK.draw=function(q,sc,X,Y){const r=_d.apply(this,arguments);try{draw(q,DG,X,Y,sc)}catch(e){console.error(e)}return r}}
window.C28={CF,DEL,REN,ID,PRICE,purge,step,draw,cast28,onDeath};
})();
