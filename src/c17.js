/* ===== c17: 20 công trình mới (Bảo trì · Chỉ huy & Nghiên cứu · Năng lượng) ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const C17T=['mt6','mt7','mt8','mt9','mt10','cm1','cm2','cm3','cm4','cm5','cm6','cm7','cm8','cm9','cm10','en1','en2','en3','en4','en5'];
const CFG={
  mt6:{range:6,shield:30,every:3,dur:10},
  mt7:{kills:3,max:5,hp:200,dmg:10,cd:.75,R:4,leash:12},
  mt8:{cd:180},
  mt9:{range:5,pct:.2},
  mt10:{every:80,max:3,hp:400,dmg:80,cd:.5,R:5,sp:4.5},
  cm1:{range:15,cd:20},
  cm2:{range:15},
  cm4:{nrg:5},
  cm5:{range:9,every:.75,p:.2,fear:1},
  cm6:{range:20,hp:50},
  cm7:{hp:800,cd:25},
  cm8:{spl:.03},
  cm9:{sh:50,dur:10,every:15},
  cm10:{every:40,cut:10,n:5},
  en1:{regen:1},
  en2:{rng:1},
  en3:{charge:5,R:5,dmg:300,rad:4,stun:.5,sp:9},
  en4:{w:2,h:4,max:25},
  en5:{len:5,hp:300,cd:30}};
window.c17Has=t=>C17T.includes(t);
{const o=window.c16Has;window.c16Has=t=>(o?o(t):false)||C17T.includes(t)}
/* gắn cờ, bỏ hiệu ứng bị động cũ của 20 công trình */
C17T.forEach(t=>{const f=NBF[t];if(f){f.c17=t;delete f.e}});
/* đổi tên */
const REN={mt6:'Bể Na Nô Giáp Trắng',mt10:'Triệu Hồi Tàu Chiến',cm1:'Phát Hiện Tàng Hình',cm2:'Tháp Tín Hiệu Xanh'};
Object.keys(REN).forEach(t=>{const b=BLD.find(x=>x.t===t);if(b)b.n=REN[t];if(UPD[t])UPD[t].n=REN[t]});
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
upd('mt6',(l,k)=>[['Giáp mỗi lần tạo',Math.round(30*k)],['Phạm vi','6 ô'],['Làm mới giáp','3 giây / tàu, không cộng dồn'],['Thời gian giáp','10 giây']],'Tạo khiên cho tàu trong phạm vi 6 ô: mỗi tàu đi qua nhận 30 giáp, giáp không cộng dồn.');
upd('mt7',(l,k)=>[['Cứ 3 mục tiêu bị tiêu diệt','Tạo 1 drone tấn công'],['Số drone tối đa','5'],['Máu drone',Math.round(200*k)],['Sát thương drone',Math.round(10*k)+' / 0,75 giây'],['Tầm đánh drone','4 ô']],'Cứ 3 mục tiêu bị tiêu diệt (tàu ta, tàu địch hay drone) tạo 1 drone tấn công, tối đa 5 drone.');
upd('mt8',(l,k)=>[['Hồi sinh','Ngay lập tức tại mô-đun'],['Hồi chiêu','180 giây']],'Khi tàu bị phá hủy sẽ hồi sinh ngay tại vị trí mô-đun này, hồi chiêu 180 giây.');
upd('mt9',(l,k)=>[['Phạm vi','5 ô'],['Tốc độ bắn tàu và drone','+'+Math.round(20*k)+'%'],['Tốc độ chạy tàu và drone','+'+Math.round(20*k)+'%']],'Trong phạm vi 5 ô, tăng tốc độ bắn và tốc độ chạy cho tàu và drone.');
upd('mt10',(l,k)=>[['Máu mỗi tàu chiến',Math.round(400*k)],['Sát thương mỗi đòn',Math.round(80*k)],['Tốc độ đánh','0,5 giây / đòn'],['Số tàu chiến tối đa','3'],['Hồi chiêu','80 giây']],'Vào trận triệu hồi tàu chiến ra chiến trường: 400 máu, 80 sát thương mỗi đòn, 0,5 giây / đòn, tối đa 3 tàu, hồi chiêu 80 giây.');
upd('cm1',(l,k)=>[['Phạm vi','15 ô'],['Hiệu ứng','Phát hiện 1 mục tiêu tàng hình, phá trạng thái tàng hình'],['Hồi chiêu','20 giây']],'Phát hiện 1 mục tiêu đang tàng hình trong 15 ô và phá trạng thái tàng hình của nó, hồi chiêu 20 giây.');
upd('cm2',(l,k)=>[['Phạm vi','15 ô'],['Hiệu ứng','Mục tiêu trong tầm bị cấm dùng 1 kỹ năng bất kỳ']],'Làm nhiễu tín hiệu mục tiêu trong 15 ô, khiến mục tiêu bị cấm dùng 1 kỹ năng bất kỳ.');
upd('cm3',(l,k)=>[['Hiệu ứng','Bản đồ toàn trận ở góc trên bên phải'],['Điều kiện','Mất khi công trình bị phá hủy']],'Tạo bản đồ toàn trận ở góc trên bên phải màn chiến đấu; bản đồ biến mất khi công trình bị phá hủy.');
upd('cm4',(l,k)=>[['Năng lượng tối đa cả đội','+'+fmt(5*k)],['Điều kiện','Mất khi công trình bị phá hủy']],'Khi được trang bị, tăng năng lượng tối đa cho cả đội thêm 5; mất hiệu ứng nếu công trình bị phá hủy.');
upd('cm5',(l,k)=>[['Phạm vi quét','9 ô'],['Chu kỳ quét','0,75 giây'],['Gây sợ hãi','20% trong 1 giây']],'Quét quanh 9 ô mỗi 0,75 giây, 20% gây sợ hãi cho tàu địch trong 1 giây.');
upd('cm6',(l,k)=>[['Máu cộng thêm cho công trình và tàu','+'+Math.round(50*k)],['Phạm vi','20 ô'],['Điều kiện','Mất khi công trình bị phá hủy']],'Tăng 50 máu cho toàn bộ công trình và tàu trong 20 ô; mất khi công trình bị phá hủy.');
upd('cm7',(l,k)=>[['Tường laser xanh','12 ô bao quanh tháp (khung 4×4)'],['Máu tường',Math.round(800*k)],['Hồi chiêu khi bị phá','25 giây']],'Đầu trận dựng tường laser xanh 12 ô bao quanh tháp, chặn mục tiêu, 800 máu, hồi chiêu 25 giây khi bị phá.');
upd('cm8',(l,k)=>[['Độ lan của đạn, công trình, kỹ năng','+'+fmt(3*k)+'%'],['Điều kiện','Khi công trình còn tồn tại']],'Mọi kỹ năng hay đòn bắn lan của đồng minh (kể cả công trình) được tăng độ lan thêm 3%.');
upd('cm9',(l,k)=>[['Giáp chặn',Math.round(50*k)+' sát thương'],['Thời gian giáp','10 giây'],['Lặp lại','Mỗi 15 giây, không cộng dồn'],['Đối tượng','Mọi đồng minh và công trình']],'Đầu trận mọi đồng minh và công trình nhận giáp chặn 50 sát thương trong 10 giây, lặp lại mỗi 15 giây, không cộng dồn.');
upd('cm10',(l,k)=>[['Giảm hồi chiêu','10 giây cho 5 kỹ năng bất kỳ'],['Chu kỳ','40 giây']],'Mỗi 40 giây giảm 10 giây hồi chiêu cho 5 kỹ năng thuyền trưởng bất kỳ.');
upd('en1',(l,k)=>[['Hồi năng lượng thêm','+'+fmt(1*k)+' mỗi giây'],['Đối tượng','Toàn đội tàu']],'Tăng hồi năng lượng cho toàn đội tàu thêm 1.');
upd('en2',(l,k)=>[['Tầm kỹ năng thuyền trưởng','+1 ô cho mọi kỹ năng']],'Tăng tầm bắn kỹ năng thuyền trưởng thêm 1 ô cho mọi kỹ năng.');
upd('en3',(l,k)=>[['Tụ lực','5 giây'],['Sát thương nổ',Math.round(300*k)],['Bán kính nổ','4 ô'],['Tầm bắn','5 ô'],['Choáng','0,5 giây']],'Tụ lực 5 giây rồi bắn viên plasma xanh tới mục tiêu trong 5 ô, nổ gây 300 sát thương trong 4 ô và choáng 0,5 giây.');
upd('en4',(l,k)=>[['Làn khói',(2+Math.floor(l/10))+'×'+(4+Math.floor(l/10))+' ô (thêm 1×1 mỗi 10 cấp)'],['Tầm đặt tối đa','25 ô quanh tổ máy'],['Số làn khói','1'],['Hiệu ứng','Tàu đồng minh và công trình trong khói tàng hình; địch trong khói mất tầm nhìn, không dùng được kỹ năng']],'Phun làn khói 2×4 ô: đồng minh và công trình trong khói tàng hình, địch vào khói mất tầm nhìn và không dùng được kỹ năng. Chọn công trình rồi bấm “Đặt làn khói” để chỉnh vị trí (tối đa 25 ô).');
upd('en5',(l,k)=>[['Bức tường cao thế','1×'+(5+Math.floor(l/10))+' ô, nằm dọc (thêm 1 ô mỗi 10 cấp)'],['Chặn',Math.round(300*k)+' sát thương'],['Hồi chiêu khi bị phá','30 giây']],'Dựng bức tường cao thế 1×5 ô màu xanh biển, chặn 300 sát thương, mục tiêu không xuyên qua được, hồi chiêu 30 giây sau khi bị phá.');

/* ---------- ảnh tàu chiến (cắt từ ảnh công trình) và kết cấu tường ---------- */
const WSIMG='data:image/webp;base64,__WSIMG__';
const WSH={id:'c17ws',n:'Tàu chiến',img:WSIMG,W:128,H:150};
const tex=(w,h,fn)=>{try{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const u=c.toDataURL();dimg(u);return u}catch(e){return null}};
BSPR.c17ring=tex(256,256,(q,w,h)=>{const g=q.createLinearGradient(0,0,w,h);g.addColorStop(0,'rgba(30,110,255,.55)');g.addColorStop(.5,'rgba(70,190,255,.7)');g.addColorStop(1,'rgba(30,110,255,.55)');
  q.fillStyle=g;q.fillRect(0,0,w,h);q.clearRect(64,64,128,128);q.shadowColor='#7fd6ff';q.shadowBlur=10;q.strokeStyle='#bfeaff';q.lineWidth=5;q.strokeRect(6,6,w-12,h-12);q.strokeRect(62,62,w-124,h-124);
  q.shadowBlur=0;q.strokeStyle='rgba(220,245,255,.9)';q.lineWidth=2;q.setLineDash([14,10]);q.strokeRect(32,32,w-64,h-64);q.setLineDash([]);
  q.fillStyle='rgba(255,255,255,.8)';[[32,32],[w-32,32],[32,h-32],[w-32,h-32]].forEach(p=>{q.beginPath();q.arc(p[0],p[1],7,0,7);q.fill()})});
BSPR.c17wall=tex(48,240,(q,w,h)=>{const g=q.createLinearGradient(0,0,w,0);g.addColorStop(0,'#0a3a9c');g.addColorStop(.5,'#3db6ff');g.addColorStop(1,'#0a3a9c');q.fillStyle=g;q.fillRect(0,0,w,h);
  q.shadowColor='#bfeaff';q.shadowBlur=8;q.strokeStyle='#d8f3ff';q.lineWidth=3;q.beginPath();q.moveTo(w/2,0);for(let y=0;y<h;y+=12)q.lineTo(w/2+(y%24?7:-7),y+6);q.lineTo(w/2,h);q.stroke();
  q.shadowBlur=0;q.strokeStyle='rgba(255,255,255,.55)';q.lineWidth=2;q.strokeRect(2,2,w-4,h-4);q.fillStyle='#e8f8ff';for(let y=24;y<h;y+=48){q.fillRect(0,y-2,w,4)}});

/* ---------- tiện ích ---------- */
const ships=G=>{const L=[];if(G.pl&&!G.pl.dead)L.push(G.pl);(G.al||[]).forEach(a=>{if(!a.dead)L.push(a)});return L};
const enemies=G=>G.en.filter(e=>!e.dead&&e.spawn<=G.t);
const alive=(G,t)=>(G.bl||[]).filter(b=>b.hp>0&&b.nb&&b.nb.c17===t);
const near=(G,x,y,R)=>{let t=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-x,e.y-y);if(q<=R+(e.size||2)*.3&&q<bd){bd=q;t=e}});return t};
const shVal=u=>{let v=0;const c=u.cs;if(c&&c.abs&&c.abs.t>0&&c.abs.v>0)v=c.abs.v;if(u.shd&&u.shd.t>0&&u.shd.v>0)v=Math.max(v,u.shd.v);return v};
const shSet=(G,u,v,dur)=>{if(u===G.pl&&!u.cs)u.cs={};if(u.cs){u.cs.abs={v,t:dur,max:v};u.cs.circ=true;u.cs.hexc=false}else u.shd={v,t:9999,max:v,c17:G.t+dur}};
const ping=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.45,max:t||.45,col});
const beam=(G,x1,y1,x2,y2,col,w,t)=>G.bm.push({x1,y1,x2,y2,t:t||.3,col,w:w||3});

/* ---------- Bể na nô giáp trắng: 30 giáp cho tàu trong 6 ô, không cộng dồn ---------- */
function mt6(b,dt,G){const C=CFG.mt6,add=C.shield*LV(b);
  ships(G).forEach(u=>{if(dist(u,b)>C.range)return;if(G.t-(u.nbAt==null?-99:u.nbAt)<C.every)return;if(shVal(u)>=add-1e-9)return;
    shSet(G,u,add,C.dur);u.nbAt=G.t;beam(G,b.x,b.y,u.x,u.y,'#ffffff',3,.3);ping(G,u.x,u.y,(u.size||2)*.8,'#ffffff',.4)})}

/* ---------- drone tấn công (trạm tái chế phế liệu) ---------- */
function droneRun(b,a,C,G,dt,lvf){const pb=PB(G);
  a.forEach((d,i)=>{d.age+=dt;if(d.hf>0)d.hf-=dt;if(d.fl>0)d.fl-=dt;
    let tg=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-d.x,e.y-d.y);if(q<bd){bd=q;tg=e}});
    const au=window.c17Aura?window.c17Aura(G,d.x,d.y):null,sp=7*(au?au.sp:1);let mx=0,my=0;
    if(tg&&bd<=C.R*(pb.rm||1)+(tg.size||2)*.3){
      const dx=tg.x-d.x,dy=tg.y-d.y,l=bd||1,want=Math.min(C.R-.6,3)+(tg.size||2)*.25;d.ang=Math.atan2(dy,dx);
      if(l>want+.4){mx=dx/l*Math.min(sp*dt,l-want);my=dy/l*Math.min(sp*dt,l-want)}else if(l<want-.9){mx=-dx/l*sp*.6*dt;my=-dy/l*sp*.6*dt}
      d.cd-=dt*(au?au.fr:1);if(d.cd<=0){d.cd=C.cd*(pb.cdm||1);d.fl=.08;
        dfFire({x:d.x,y:d.y,dm:pb.dm||1},{sp:{k:'gun',sp:17,col:'#9dffb0'},dmg:C.dmg*lvf,rng:C.R*(pb.rm||1)+1,col:'#9dffb0'},tg,'p')}}
    else if(tg&&Math.hypot(tg.x-b.x,tg.y-b.y)<=C.leash){const dx=tg.x-d.x,dy=tg.y-d.y,l=bd||1;d.ang=Math.atan2(dy,dx);mx=dx/l*Math.min(sp*dt,Math.max(0,l-2.8));my=dy/l*Math.min(sp*dt,Math.max(0,l-2.8))}
    else{d.a+=dt*1.2;const r=Math.max(b.w,b.h)/2+.9,tx=b.x+Math.cos(d.a+i*2.1)*r,ty=b.y+Math.sin(d.a+i*2.1)*r,dx=tx-d.x,dy=ty-d.y,l=Math.hypot(dx,dy)||1;
      if(l>.05){d.ang=Math.atan2(dy,dx);mx=dx/l*Math.min(sp*dt,l);my=dy/l*Math.min(sp*dt,l)}}
    d.x+=mx;d.y+=my;d.rot=d.ang+Math.PI/2});
  if(window.c15BulletHit)window.c15BulletHit(G,a)}

/* ---------- Trạm tái chế phế liệu: 3 mục tiêu bị tiêu diệt → 1 drone tấn công (tối đa 5) ---------- */
function mt7(b,dt,G){const C=CFG.mt7,a=b.c17d=b.c17d||[],lvf=LV(b),need=b.rcN||C.kills;
  for(let i=a.length-1;i>=0;i--)if(a[i].dead||a[i].hp<=0)a.splice(i,1);
  if(a.length>=C.max)b.rcK=Math.min(b.rcK||0,need-1);
  while((b.rcK||0)>=need&&a.length<C.max){b.rcK-=need;const hp=C.hp*lvf;
    a.push({x:b.x,y:b.y,a:Math.random()*6.28,ang:-Math.PI/2,rot:0,hp,hmax:hp,dead:false,hf:0,fl:0,cd:.3,age:0});ping(G,b.x,b.y,Math.max(b.w,b.h)*.5,'#9dffb0',.45)}
  droneRun(b,a,C,G,dt,lvf)}
window.c17Kill=function(G){G=G||DG;if(!G||!G.bl)return;G.bl.forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c17==='mt7')b.rcK=(b.rcK||0)+1})};

/* ---------- Mô-đun hồi sinh ---------- */
function mt8(b,dt,G){if(b.rvC>0){b.rvC-=dt;if(b.rvC<0)b.rvC=0}}
function revive(G,P){const m=alive(G,'mt8').find(b=>!(b.rvC>0));if(!m)return false;
  P.dead=false;P.hp=P.max;if(P.nrgMax)P.nrg=P.nrgMax;P.x=m.x;P.y=m.y+m.h/2+.9;P.vx=0;P.vy=0;P.tx=P.x;P.ty=P.y;G.respawn=0;G.deaths=Math.max(0,(G.deaths||0)-1);
  m.rvC=CFG.mt8.cd;m.rvAt=G.t;ping(G,m.x,m.y,2.2,'#7dffa0',.7);ping(G,P.x,P.y,1.6,'#ffffff',.5);try{toast('Mô-đun hồi sinh: tàu hồi sinh ngay lập tức!')}catch(e){}return true}

/* ---------- Triệu hồi tàu chiến ---------- */
function mkWarship(b,G){const C=CFG.mt10,lvf=LV(b),sz=2.3,hp=C.hp*lvf,x=b.x,y=b.y+b.h/2+1.1;
  const a={team:'p',sh:WSH,x,y,ang:-Math.PI/2,hp,max:hp,sp:C.sp,size:sz,sc:sz/Math.max(WSH.W,WSH.H),
    ws:[{sp:{k:'gun',sp:19,col:'#8fd8ff'},dmg:C.dmg*lvf,cd:C.cd,ec:0,t:.2,rng:C.R,mx:0,my:0}],tx:x,ty:y,boss:false,dm:1,hit:0,dead:false,spawn:0,red:0,reg:0,dly:99,lh:-99,acc:0,sp0:C.sp,inf:true,nrg:0,nrgMax:0,nrgGen:0,
    engDrain:0,eOn:true,mdrain:0,mOn:true,sk:[],spT:{},ally:1,name:'Tàu chiến',sx:x,sy:y,c17w:1};
  (G.al=G.al||[]).push(a);ping(G,x,y,1.8,'#8fd8ff',.6);return a}
function mt10(b,dt,G){const C=CFG.mt10,a=b.c17s=b.c17s||[],EV=b.wsEv||C.every,MX=b.wsMax||C.max;
  for(let i=a.length-1;i>=0;i--)if(a[i].dead||a[i].hp<=0)a.splice(i,1);
  if(b.wsT==null)b.wsT=0;
  if(a.length<MX){b.wsT-=dt;if(b.wsT<=0){a.push(mkWarship(b,G));b.wsT=EV}}else b.wsT=EV}

/* ---------- Phát hiện tàng hình ---------- */
const isStl=e=>e.stl>0||e.cloak>0||e.hidT>0;
function cm1(b,dt,G){const C=CFG.cm1;if(b.dtC>0){b.dtC=Math.max(0,b.dtC-dt);return}
  let best=null,bd=1e9;enemies(G).forEach(e=>{if(!isStl(e))return;const q=dist(e,b);if(q<=C.range&&q<bd){bd=q;best=e}});
  if(!best)return;best.stl=0;best.cloak=0;best.hidT=0;best.fd=0;best.rvlT=2;b.dtC=C.cd;b.dtAt=G.t;b.dtTg=best;
  beam(G,b.x,b.y,best.x,best.y,'#9fffd8',3,.5);ping(G,best.x,best.y,(best.size||2)*.9,'#9fffd8',.7)}

/* ---------- Tháp tín hiệu xanh ---------- */
function cm2(b,dt,G){const C=CFG.cm2;enemies(G).forEach(e=>{if(dist(e,b)>C.range)return;e.silT=Math.max(e.silT||0,.4);e.jmT=.4})}

/* ---------- Đài thiên văn ---------- */
function cm5(b,dt,G){const C=CFG.cm5;b.scT=(b.scT==null?C.every:b.scT)-dt;if(b.scT>0)return;b.scT+=C.every;if(b.scT<=0)b.scT=C.every;b.scAt=G.t;
  enemies(G).forEach(e=>{if(Math.hypot(e.x-b.x,e.y-b.y)>C.range+(e.size||2)*.3)return;if(Math.random()>=C.p)return;
    e.fearT=Math.max(e.fearT||0,C.fear*(e.boss?1/3:1));e.fearX=b.x;e.fearY=b.y;ping(G,e.x,e.y,(e.size||2)*.6,'#ffe27a',.5)})}

/* ---------- Bộ chỉ huy tối cao ---------- */
function cm10(b,dt,G){const C=CFG.cm10;b.chT=(b.chT==null?C.every:b.chT)-dt;if(b.chT>0)return;b.chT=C.every;b.chAt=G.t;
  const sk=((G.pl&&G.pl.sk)||[]).filter(k=>k.cd>0).sort(()=>Math.random()-.5).slice(0,C.n);sk.forEach(k=>{k.cd=Math.max(0,k.cd-C.cut)});
  if(G.pl)ping(G,G.pl.x,G.pl.y,2,'#ffd23a',.6)}

/* ---------- Trung tâm nghiên cứu vòm kính ---------- */
function cm9(b,dt,G){const C=CFG.cm9,lvf=LV(b);b.vkT=(b.vkT==null?0:b.vkT)-dt;if(b.vkT>0)return;b.vkT=C.every;b.vkAt=G.t;
  const v=C.sh*lvf;ships(G).forEach(u=>{if(shVal(u)>=v-1e-9)return;shSet(G,u,v,C.dur);ping(G,u.x,u.y,(u.size||2)*.9,'#9fd8ff',.5)});
  const bv=v/DFB;G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine')return;const ex=(o.shd&&o.shd.t>0&&o.shd.v>0)?o.shd:null;if(ex&&ex.v>=bv)return;
    o.shd={v:bv,t:Math.max(C.dur,ex?ex.t:0),max:Math.max(bv,ex?ex.max:0)};o.shdC=1;o.shdAt=G.t})}

/* ---------- Lò phản ứng plasma ---------- */
function en3(b,dt,G){const C=CFG.en3,pb=PB(G),lvf=LV(b),R=C.R*(pb.rm||1),S=b.pl=b.pl||{c:0,orbs:[]};
  if(S.c<C.charge)S.c=Math.min(C.charge,S.c+dt*(1/(pb.cdm||1)));
  if(S.c>=C.charge){const tg=near(G,b.x,b.y,R);if(tg){S.c=0;S.orbs.push({x:b.x,y:b.y,tg,lx:tg.x,ly:tg.y,life:3})}}
  for(let i=S.orbs.length-1;i>=0;i--){const o=S.orbs[i];o.life-=dt;if(o.tg&&!o.tg.dead){o.lx=o.tg.x;o.ly=o.tg.y}
    const dx=o.lx-o.x,dy=o.ly-o.y,l=Math.hypot(dx,dy)||1e-6,m=Math.min(l,C.sp*dt);o.x+=dx/l*m;o.y+=dy/l*m;o.tr=o.tr||[];o.tr.push([o.x,o.y]);if(o.tr.length>7)o.tr.shift();
    if(l-m<=.3+((o.tg&&o.tg.size)||2)*.25||o.life<=0){S.orbs.splice(i,1);const rad=C.rad*(window.c17Spl?window.c17Spl(G):1);
      enemies(G).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<=rad+(e.size||2)*.3){dfDmgS(e,C.dmg*lvf*(pb.dm||1),false);e.stun=Math.max(e.stun||0,C.stun*(e.boss?1/3:1))}});
      G.fx.push({x:o.x,y:o.y,r:rad*.85,t:.45,max:.45,col:'#5fb4ff'});G.fx.push({x:o.x,y:o.y,r:rad*.55,t:.5,max:.5,ex:1,rot:Math.random()*6});S.bursts=S.bursts||[];S.bursts.push({x:o.x,y:o.y,r:rad,t:.5})}}}

/* ---------- tường phụ: tháp chỉ huy trung tâm (khung 12 ô) và tụ điện cao thế (1×5) ---------- */
function mkAux(G,b,kind,x,y,w,h,hp){const o={id:'c17a'+Math.random().toString(36).slice(2,7),t:kind,n:kind==='c17ring'?'Tường laser xanh':'Tường cao thế',x,y,w,h,v:kind==='c17wall',hp,max:hp,lv:b.lv||1,cd:0,spec:null,nb:null,used:false,red:0,aux:1,par:b};
  G.bl.push(o);ping(G,x,y,Math.max(w,h)*.6,'#7fd6ff',.6);return o}
function cm7(b,dt,G){const C=CFG.cm7;if(b.rg&&b.rg.hp>0){return}
  if(b.rg&&b.rg.hp<=0)b.rg=null;
  if(b.rgCd>0){b.rgCd-=dt;return}
  b.rg=mkAux(G,b,'c17ring',b.x,b.y,b.w+2,b.h+2,C.hp*LV(b)/DFB)}
function en5(b,dt,G){const C=CFG.en5;if(b.wl&&b.wl.hp>0)return;
  if(b.wl&&b.wl.hp<=0)b.wl=null;
  if(b.wcd>0){b.wcd-=dt;return}
  const len=C.len+Math.floor((b.lv||1)/10),Wd=G.wd?G.wd.Wd:99,Hd=G.wd?G.wd.Hd:99;let x=b.x+b.w/2+.5;if(x+.5>Wd-.2)x=b.x-b.w/2-.5;
  const y=Math.max(len/2,Math.min(Hd-len/2,b.y));b.wl=mkAux(G,b,'c17wall',x,y,1,len,C.hp*LV(b)/DFB)}

/* ---------- Tổ máy phát hơi nước: làn khói ---------- */
function smokeRect(b,G){const k=Math.floor((b.lv||1)/10),w=CFG.en4.w+k,h=CFG.en4.h+k;let cx,cy;
  let st=null;try{st=(typeof S!=='undefined'&&S.base&&S.base.smk&&S.base.smk[b.id])||null}catch(e){}
  const ox=(G.wd&&G.wd.ox)||0,oy=(G.wd&&G.wd.oy)||0;
  if(st){cx=st[0]-ox;cy=st[1]-oy}else{cx=b.x;cy=b.y+b.h/2+h/2+.4}
  const d=Math.hypot(cx-b.x,cy-b.y);if(d>CFG.en4.max){cx=b.x+(cx-b.x)/d*CFG.en4.max;cy=b.y+(cy-b.y)/d*CFG.en4.max}
  const Wd=G.wd?G.wd.Wd:99,Hd=G.wd?G.wd.Hd:99;cx=Math.max(w/2,Math.min(Wd-w/2,cx));cy=Math.max(h/2,Math.min(Hd-h/2,cy));
  return {cx,cy,w,h}}
window.c17SmokeRect=smokeRect;
const inRect=(r,x,y,m)=>Math.abs(x-r.cx)<=r.w/2+(m||0)&&Math.abs(y-r.cy)<=r.h/2+(m||0);

const TICK={mt6,mt7,mt8,mt9(){},mt10,cm1,cm2,cm3(){},cm4(){},cm5,cm6(){},cm7,cm8(){},cm9,cm10,en1(){},en2(){},en3,en4(){},en5};
window.c17Tick=function(b,dt,G){const c=b.nb&&b.nb.c17;if(!c)return false;const f=TICK[c];if(f)f(b,dt,G);return true};

/* ---------- hiệu ứng toàn trận (mỗi bước chiến đấu) ---------- */
window.c17Aura=function(G,x,y){let k=1;(G.bl||[]).forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c17==='mt9'&&Math.hypot(b.x-x,b.y-y)<=CFG.mt9.range)k=Math.max(k,1+CFG.mt9.pct*LV(b))});return {fr:k,sp:k}};
window.c17Spl=function(G){let k=1;((G&&G.bl)||[]).forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c17==='cm8')k=Math.max(k,1+CFG.cm8.spl*LV(b))});return k};
window.c17Sk=function(G){let k=0;((G&&G.bl)||[]).forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c17==='en2')k=Math.max(k,CFG.en2.rng)});return k};
const delta=(u,key,field,val,fill)=>{const prev=u[key]||0;if(Math.abs(val-prev)<1e-9)return;const d=val-prev;u[field]=(u[field]||0)+d;if(fill&&d>0)u[fill]=(u[fill]||0)+d;else if(fill)u[fill]=Math.min(u[fill]||0,u[field]);u[key]=val};
function global(G,dt){
  /* dọn tường phụ */
  for(let i=G.bl.length-1;i>=0;i--){const o=G.bl[i];if(o.aux&&(o.hp<=0||!o.par||o.par.hp<=0)){G.bl.splice(i,1);if(o.par){if(o.t==='c17ring'){o.par.rg=null;if(o.hp<=0)o.par.rgCd=CFG.cm7.cd}else{o.par.wl=null;if(o.hp<=0)o.par.wcd=CFG.en5.cd}}}}
  const A={};G.bl.forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c17)(A[b.nb.c17]=A[b.nb.c17]||[]).push(b)});
  const P=G.pl;
  /* năng lượng: phòng thí nghiệm lõi (+5 tối đa), dàn pin mặt trời (+1 hồi) */
  if(P){const nm=(A.cm4||[]).reduce((m,b)=>Math.max(m,CFG.cm4.nrg*LV(b)),0),ng=(A.en1||[]).reduce((m,b)=>Math.max(m,CFG.en1.regen*LV(b)),0);
    delta(P,'c17nm','nrgMax',nm,'nrg');delta(P,'c17ng','nrgGen',ng,null);if(P.nrgMax!=null&&P.nrg>P.nrgMax)P.nrg=P.nrgMax}
  /* trung tâm dữ liệu: +50 máu cho công trình và tàu trong 20 ô */
  const dc=A.cm6||[];
  const want=(x,y)=>{let v=0;dc.forEach(c=>{if(Math.hypot(c.x-x,c.y-y)<=CFG.cm6.range)v=Math.max(v,CFG.cm6.hp*LV(c))});return v};
  G.bl.forEach(o=>{if(o.t==='mine'||o.aux)return;const w=want(o.x,o.y)/DFB,p=o.c17db||0;
    if(o.hp<=0){if(p&&!w){o.max-=p;o.c17db=0}return}
    if(Math.abs(w-p)>1e-9){const d=w-p;o.max+=d;if(d>0)o.hp+=d;else o.hp=Math.min(o.hp,o.max);o.c17db=w}});
  ships(G).forEach(u=>{const w=want(u.x,u.y),p=u.c17db||0;if(Math.abs(w-p)>1e-9){const d=w-p;u.max+=d;if(d>0)u.hp+=d;else u.hp=Math.min(u.hp,u.max);u.c17db=w}});
  /* xưởng cơ khí trung tâm: tăng tốc bắn và tốc chạy */
  ships(G).forEach(u=>{const au=window.c17Aura(G,u.x,u.y);u.c17fr=au.fr>1?au.fr:0;u.c17sp=au.sp>1?au.sp:0});
  /* làn khói */
  G.bl.forEach(o=>{if(o.smk>0)o.smk=Math.max(0,o.smk-dt)});ships(G).forEach(u=>{if(u.smk>0)u.smk=Math.max(0,u.smk-dt)});
  (A.en4||[]).forEach(b=>{const r=b.smkR=smokeRect(b,G);
    ships(G).forEach(u=>{if(inRect(r,u.x,u.y,.3))u.smk=.3});
    G.bl.forEach(o=>{if(o.hp>0&&o.t!=='mine'&&!o.aux&&inRect(r,o.x,o.y,0))o.smk=.3});
    enemies(G).forEach(e=>{if(inRect(r,e.x,e.y,(e.size||2)*.2)){e.noFire=Math.max(e.noFire||0,.3);e.silT=Math.max(e.silT||0,.3);e.c17bl=.3}else if(e.c17bl>0)e.c17bl-=dt})});
  /* hết hạn giáp của tàu phụ */
  (G.al||[]).forEach(a=>{if(a.shd&&a.shd.c17&&G.t>a.shd.c17)a.shd=null});
  enemies(G).forEach(e=>{if(e.jmT>0)e.jmT-=dt;if(e.rvlT>0)e.rvlT-=dt});
  G.c17A=A}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.bl&&!G.done&&G.en)global(G,dt)}catch(e){console.error(e)}return r}}

/* tiêu diệt: đếm cho trạm tái chế, mô-đun hồi sinh */
{const _S=dfDmgS;dfDmgS=function(s,d,f){const G=DG,was=s&&s.dead,r=_S.apply(this,arguments);
  try{if(G&&G.bl&&s&&!was&&s.dead){window.c17Kill(G);if(s===G.pl)revive(G,s)}}catch(e){console.error(e)}return r}}
{const _A=dfDmgA;dfDmgA=function(a,d){const G=DG,was=a&&a.dead,r=_A.apply(this,arguments);try{if(G&&G.bl&&a&&!was&&a.dead)window.c17Kill(G)}catch(e){console.error(e)}return r}}
/* viện nghiên cứu cầu quang: tăng độ lan 3% */
{const _B=dfBlast;dfBlast=function(x,y,r,d,team){if(team==='p'){const k=window.c17Spl(DG);if(k>1)r*=k}return _B.call(this,x,y,r,d,team)}}
/* dãy ắc quy trụ: kỹ năng thuyền trưởng +1 ô */

/* ---------- vẽ ---------- */
const lab=(q,x,y,t,col)=>{q.save();q.font='bold 11px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';q.strokeText(t,x,y);q.fillStyle=col||'#fff';q.fillText(t,x,y);q.restore()};
function drawSmoke(q,G,X,Y,s,T,b){const r=b.smkR||smokeRect(b,G),x0=X(r.cx-r.w/2),y0=Y(r.cy-r.h/2),w=r.w*s,h=r.h*s;
  q.save();q.beginPath();RR(q,x0,y0,w,h,s*.4);q.clip();q.fillStyle='rgba(175,195,220,.30)';q.fillRect(x0,y0,w,h);
  const N=Math.round(r.w*r.h*3.2);for(let i=0;i<N;i++){const u=(T*.05*(1+hz(i)*.8)+hz(i+9))%1,px=x0+hz(i+3)*w+Math.sin(T*.7+i)*s*.25,py=y0+h*u,rad=s*(.55+hz(i+5)*.7),g=q.createRadialGradient(px,py,0,px,py,rad);
    g.addColorStop(0,'rgba(232,240,252,.46)');g.addColorStop(1,'rgba(232,240,252,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,rad,0,7);q.fill()}
  q.restore();q.save();q.setLineDash([6,5]);q.strokeStyle='rgba(200,220,245,.55)';q.lineWidth=1.5;q.beginPath();RR(q,x0,y0,w,h,s*.4);q.stroke();
  q.strokeStyle='rgba(200,220,245,.3)';q.beginPath();q.moveTo(X(b.x),Y(b.y));q.lineTo(X(r.cx),Y(r.cy));q.stroke();q.restore();
  for(let i=0;i<4;i++){const u=(T*.9+i*.25)%1;q.save();q.globalAlpha=(1-u)*.5;q.fillStyle='#e8f2ff';q.beginPath();q.arc(X(b.x)+(hz(i)-.5)*b.w*s*.5,Y(b.y)-u*s*1.1,s*(.18+.3*u),0,7);q.fill();q.restore()}}
function drawMini(q,G,x0,y0,w,h,vp){const Wd=G.wd.Wd,Hd=G.wd.Hd,sx=w/Wd,sy=h/Hd;
  q.save();q.fillStyle='rgba(4,12,40,.86)';q.strokeStyle='#4fd8ff';q.lineWidth=1.5;q.beginPath();RR(q,x0-5,y0-16,w+10,h+21,6);q.fill();q.stroke();
  q.font='bold 9px sans-serif';q.fillStyle='#8fe6ff';q.textAlign='left';q.fillText('BẢN ĐỒ CHIẾN THUẬT',x0,y0-5);
  q.beginPath();q.rect(x0,y0,w,h);q.clip();q.fillStyle='rgba(10,30,80,.95)';q.fillRect(x0,y0,w,h);
  const R=G.wd.R;if(R&&typeof DFM!=='undefined'){q.fillStyle='rgba(30,90,200,.38)';q.fillRect(x0+DFM*sx,y0+DFM*sy,(R.x1-R.x0)*sx,(R.y1-R.y0)*sy)}
  G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine')return;q.fillStyle=b.hq?'#4fd8ff':b.aux?'#8fe6ff':'#5b8dff';q.fillRect(x0+(b.x-b.w/2)*sx,y0+(b.y-b.h/2)*sy,Math.max(2,b.w*sx),Math.max(2,b.h*sy));
    if(b.nb&&b.nb.c17==='en4'&&b.smkR){const r=b.smkR;q.fillStyle='rgba(205,215,230,.45)';q.fillRect(x0+(r.cx-r.w/2)*sx,y0+(r.cy-r.h/2)*sy,r.w*sx,r.h*sy)}});
  const dot=(x,y,r,col)=>{q.fillStyle=col;q.beginPath();q.arc(x0+Math.max(0,Math.min(Wd,x))*sx,y0+Math.max(0,Math.min(Hd,y))*sy,r,0,7);q.fill()};
  G.en.forEach(e=>{if(!e.dead&&e.spawn<=G.t)dot(e.x,e.y,e.boss?4:2.6,'#ff4a5a')});
  (G.al||[]).forEach(a=>{if(!a.dead)dot(a.x,a.y,2.4,'#6dff9a')});
  G.bl.forEach(b=>{[b.drs,b.c17d].forEach(L=>{if(L)L.forEach(d=>{if(!d.dead)dot(d.x,d.y,1.7,'#9fe8ff')})})});
  if(G.pl&&!G.pl.dead){dot(G.pl.x,G.pl.y,3.6,'#ffffff');q.strokeStyle='#4fd8ff';q.lineWidth=1;q.beginPath();q.arc(x0+Math.max(0,Math.min(Wd,G.pl.x))*sx,y0+Math.max(0,Math.min(Hd,G.pl.y))*sy,5.5,0,7);q.stroke()}
  if(vp){q.strokeStyle='rgba(255,255,255,.75)';q.lineWidth=1;q.strokeRect(x0+vp.x0*sx,y0+vp.y0*sy,(vp.x1-vp.x0)*sx,(vp.y1-vp.y0)*sy)}
  q.restore()}
window.c17Mini=drawMini;
window.c17Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  const A=G.c17A||(()=>{const a={};G.bl.forEach(b=>{if(b.hp>0&&b.nb&&b.nb.c17)(a[b.nb.c17]=a[b.nb.c17]||[]).push(b)});return a})();
  G.bl.forEach(b=>{if(b.hp<=0)return;const c=b.nb&&b.nb.c17;
    if(b.aux){const x=X(b.x-b.w/2),y=Y(b.y-b.h/2),w=b.w*s,h=b.h*s;q.save();q.globalCompositeOperation='lighter';
      if(b.t==='c17ring'){q.strokeStyle='rgba(160,225,255,'+(.35+.25*Math.sin(T*9))+')';q.lineWidth=2;q.strokeRect(x+s*.5,y+s*.5,w-s,h-s);q.strokeRect(x+s*.06,y+s*.06,w-s*.12,h-s*.12)}
      else{for(let i=0;i<3;i++){const yy=y+((T*(.8+i*.3)+i*.37)%1)*h;q.fillStyle='rgba(210,240,255,.5)';q.fillRect(x,yy,w,Math.max(2,s*.07))}
        q.strokeStyle='rgba(190,235,255,'+(.5+.4*Math.sin(T*25))+')';q.lineWidth=1.5;q.beginPath();let px=x+w/2,py=y;q.moveTo(px,py);for(let k=1;k<=12;k++){px=x+w/2+(hz(k+Math.floor(T*14))-.5)*w*.9;py=y+h*k/12;q.lineTo(px,py)}q.stroke()}
      q.restore();return}
    if(c==='mt6'||c==='mt9'||c==='cm5'||c==='cm1'||c==='cm2'||c==='cm6'){const R=c==='mt6'?6:c==='mt9'?5:c==='cm5'?9:15;if(c!=='cm6'){q.save();q.setLineDash([4,6]);q.strokeStyle=c==='mt9'?'rgba(255,200,90,.28)':c==='cm2'?'rgba(80,170,255,.3)':c==='cm1'?'rgba(120,255,210,.25)':'rgba(190,230,255,.28)';q.lineWidth=1.5;q.beginPath();q.arc(X(b.x),Y(b.y),R*s,0,7);q.stroke();q.restore()}}
    if(c==='cm5'&&b.scAt!=null){const u=(G.t-b.scAt)/.75;if(u>=0&&u<1){q.save();q.strokeStyle='rgba(255,230,140,'+(1-u)*.8+')';q.lineWidth=2+2*(1-u);q.beginPath();q.arc(X(b.x),Y(b.y),CFG.cm5.range*s*u,0,7);q.stroke();q.restore()}}
    if(c==='cm1'){const px=X(b.x),py=Y(b.y);q.save();q.globalCompositeOperation='lighter';const a0=T*2.2,g=q.createRadialGradient(px,py,0,px,py,CFG.cm1.range*s);g.addColorStop(0,'rgba(120,255,210,.16)');g.addColorStop(1,'rgba(120,255,210,0)');
      q.fillStyle=g;q.beginPath();q.moveTo(px,py);q.arc(px,py,CFG.cm1.range*s,a0,a0+.5);q.closePath();q.fill();q.restore();
      if(b.dtC>0)lab(q,px,py-b.h*s*.65,'Hồi chiêu '+Math.ceil(b.dtC)+'s','#9fffd8')}
    if(c==='cm2'){q.save();q.strokeStyle='rgba(110,190,255,.45)';q.lineWidth=2;for(let i=0;i<3;i++){const u=(T*.6+i/3)%1;q.globalAlpha=(1-u)*.6;q.beginPath();q.arc(X(b.x),Y(b.y),u*CFG.cm2.range*s,0,7);q.stroke()}q.restore()}
    if(c==='mt8'){const px=X(b.x),py=Y(b.y)-b.h*s*.62;if(b.rvC>0)lab(q,px,py,'Hồi sinh sau '+Math.ceil(b.rvC)+'s','#ffb0a0');else lab(q,px,py,'Sẵn sàng hồi sinh','#9ff0b8')}
    if(c==='cm7'&&b.rgCd>0)lab(q,X(b.x),Y(b.y)-b.h*s*.62,'Tường laser: '+Math.ceil(b.rgCd)+'s','#9fd8ff');
    if(c==='en5'&&b.wcd>0)lab(q,X(b.x),Y(b.y)-b.h*s*.62,'Tường cao thế: '+Math.ceil(b.wcd)+'s','#9fd8ff');
    if(c==='en4')drawSmoke(q,G,X,Y,s,T,b);
    if(c==='en3'&&b.pl){const S=b.pl,px=X(b.x),py=Y(b.y),f=S.c/CFG.en3.charge,r=s*(.2+.5*f);q.save();q.globalCompositeOperation='lighter';
      const g=q.createRadialGradient(px,py,0,px,py,r*1.6);g.addColorStop(0,'rgba(210,240,255,'+(.5+.5*f)+')');g.addColorStop(.4,'rgba(70,170,255,'+(.4+.4*f)+')');g.addColorStop(1,'rgba(40,110,255,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.6,0,7);q.fill();
      if(f>=1){q.strokeStyle='rgba(180,230,255,.8)';q.lineWidth=2;q.beginPath();q.arc(px,py,r*1.15+Math.sin(T*14)*2,0,7);q.stroke()}q.restore();
      S.orbs.forEach(o=>{const ox=X(o.x),oy=Y(o.y);q.save();q.globalCompositeOperation='lighter';(o.tr||[]).forEach((p,i,L)=>{q.globalAlpha=(i+1)/L.length*.5;q.fillStyle='#66b8ff';q.beginPath();q.arc(X(p[0]),Y(p[1]),s*.16*(i+1)/L.length,0,7);q.fill()});
        q.globalAlpha=1;const g2=q.createRadialGradient(ox,oy,0,ox,oy,s*.42);g2.addColorStop(0,'#ffffff');g2.addColorStop(.35,'#7fcbff');g2.addColorStop(1,'rgba(60,140,255,0)');q.fillStyle=g2;q.beginPath();q.arc(ox,oy,s*.42,0,7);q.fill();q.restore()});
      if(S.bursts){S.bursts=S.bursts.filter(u=>(u.t-=.016)>0);S.bursts.forEach(u=>{const k=1-u.t/.5;q.save();q.strokeStyle='rgba(120,200,255,'+(1-k)+')';q.lineWidth=3;q.beginPath();q.arc(X(u.x),Y(u.y),u.r*s*(.3+.7*k),0,7);q.stroke();q.restore()})}}
    if(c==='mt7'&&b.c17d)b.c17d.forEach(d=>{if(d.dead)return;const px=X(d.x),py=Y(d.y),h=s*.72*Math.min(1,.35+d.age*1.2);drnSpr(q,px,py,h,(d.ang!=null?d.ang:-Math.PI/2)+Math.PI/2,1,window.DRN5,d.hf>0?'#ffffff':'#7dff9a');
      if(d.fl>0){q.save();q.globalCompositeOperation='lighter';q.fillStyle='rgba(180,255,190,.9)';q.beginPath();q.arc(px+Math.cos(d.ang)*h*.5,py+Math.sin(d.ang)*h*.5,h*.14,0,7);q.fill();q.restore()}drnBar(q,px,py,h,d)})});
  /* mục tiêu bị nhiễu / bị lộ */
  enemies(G).forEach(e=>{const px=X(e.x),py=Y(e.y);
    if(e.jmT>0){q.save();q.strokeStyle='rgba(120,200,255,.85)';q.lineWidth=2;q.setLineDash([3,3]);q.beginPath();q.arc(px,py,(e.size||2)*s*.5,0,7);q.stroke();q.setLineDash([]);q.fillStyle='#bfe6ff';q.font='bold '+Math.round(s*.5)+'px sans-serif';q.textAlign='center';q.fillText('⚡',px,py-(e.size||2)*s*.62);q.restore()}
    if(e.rvlT>0){q.save();q.strokeStyle='rgba(159,255,216,'+Math.min(1,e.rvlT)+')';q.lineWidth=2.5;q.beginPath();q.arc(px,py,(e.size||2)*s*.62,0,7);q.stroke();q.restore()}
    if(e.c17bl>0){q.save();q.fillStyle='rgba(220,230,245,.7)';q.font='bold '+Math.round(s*.42)+'px sans-serif';q.textAlign='center';q.fillText('?',px,py-(e.size||2)*s*.62);q.restore()}});
  /* bản đồ chiến thuật: chỉ trong trận thật, góc trên bên phải */
  if((A.cm3||[]).length&&typeof dfV!=='undefined'&&q===dq&&G===DG&&G.wd&&!G.pv){const w=Math.round(Math.min(150,dfV.w*.3)),h=Math.round(w*G.wd.Hd/G.wd.Wd),x0=dfV.w-w-14,y0=78;
    drawMini(q,G,x0,y0,w,h,{x0:-X(0)/s,y0:-Y(0)/s,x1:(dfV.w-X(0))/s,y1:(dfV.h-Y(0))/s})}};
/* gộp vào hàm vẽ phụ của c16 để dùng chung cho trận thật và mô phỏng */
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{window.c17Draw(q,G,X,Y,s,T)}catch(e){console.error(e)}}}

/* ---------- giao diện đặt làn khói trong Trụ sở ---------- */
(function(){
  const isG=b=>!!b&&b.t==='en4';
  const smkMap=()=>{const B=S.base=S.base||{};B.smk=B.smk||{};return B.smk};
  const lvOf=b=>{try{return bLv(b.t)}catch(e){return 1}};
  const dims=b=>{const k=Math.floor(lvOf(b)/10);return {w:CFG.en4.w+k,h:CFG.en4.h+k}};
  const cen=b=>{const p=bPos()[b.id];return p?[p[0]+b.w/2,p[1]+b.h/2]:null};
  function clampC(b,x,y){const d=dims(b),R=bReg(),g=cen(b);
    x=Math.round(x-d.w/2)+d.w/2;y=Math.round(y-d.h/2)+d.h/2;
    x=Math.max(R.x0+d.w/2,Math.min(R.x1-d.w/2,x));y=Math.max(R.y0+d.h/2,Math.min(R.y1-d.h/2,y));
    const dx=x-g[0],dy=y-g[1],L=Math.hypot(dx,dy);if(L>CFG.en4.max){x=g[0]+dx/L*CFG.en4.max;y=g[1]+dy/L*CFG.en4.max}
    return [x,y]}
  function curC(b){const st=smkMap()[b.id],d=dims(b),g=cen(b);if(st)return clampC(b,st[0],st[1]);return [g[0],g[1]+b.h/2+d.h/2+.4]}
  if(!document.getElementById('c17smkcss')){const st=document.createElement('style');st.id='c17smkcss';
    st.textContent='.c17smk{position:absolute;z-index:6;pointer-events:none;background:rgba(200,214,235,.38);border:2px solid rgba(235,243,255,.85);border-radius:8px;color:#fff;font:700 11px sans-serif;display:flex;align-items:center;justify-content:center;text-shadow:0 1px 2px #000;box-shadow:0 0 14px rgba(190,210,240,.5)}.c17smk.on{background:rgba(120,200,255,.4);border-color:#7fe3ff}.c17rng{position:absolute;pointer-events:none;border:2px dashed rgba(127,227,255,.75);border-radius:50%}';
    document.head.appendChild(st)}
  window.c17BaseUI=function(sel){
    const brd=document.getElementById('bboard');if(!brd)return;
    let btn=document.getElementById('bsmk');
    if(!btn){const rot=document.getElementById('brot');if(rot){btn=document.createElement('button');btn.id='bsmk';btn.className='brs';btn.style.cssText='background:#0c2a70;border-color:#1c4fc9';rot.insertAdjacentElement('afterend',btn);
      btn.onclick=()=>{const b=BLD.find(x=>x.id===bState.sel);if(!isG(b))return;bState.smk=bState.smk&&bState.smkId===b.id?0:1;bState.smkId=b.id;bRender()}}}
    if(!isG(sel)||bState.smkId!==sel.id)bState.smk=0;
    if(btn){btn.style.display=isG(sel)?'':'none';btn.textContent=bState.smk?'Xong':'Đặt làn khói'}
    const P=bPos(),c='var(--c)';let h='';
    BLD.forEach(b=>{if(!isG(b)||!bAvail().includes(b)||!P[b.id])return;const d=dims(b),k=curC(b),on=bState.smk&&bState.smkId===b.id;
      if(on){const g=cen(b);h+=`<div class="c17rng" style="left:calc(${c}*${g[0]-CFG.en4.max});top:calc(${c}*${g[1]-CFG.en4.max});width:calc(${c}*${CFG.en4.max*2});height:calc(${c}*${CFG.en4.max*2})"></div>`}
      h+=`<div class="c17smk ${on?'on':''}" style="left:calc(${c}*${k[0]-d.w/2});top:calc(${c}*${k[1]-d.h/2});width:calc(${c}*${d.w});height:calc(${c}*${d.h})">Khói</div>`});
    if(h)brd.insertAdjacentHTML('beforeend',h);
    if(bState.smk){const n=document.getElementById('bnote');if(n)n.innerHTML='<b>Đặt làn khói</b> · Bấm vào ô trên bản đồ để đặt tâm làn khói (tối đa '+CFG.en4.max+' ô quanh tổ máy, vòng nét đứt). Bấm vào chính tổ máy để về mặc định, bấm “Xong” để kết thúc.'}};
  const brd=document.getElementById('bboard');
  if(brd)brd.addEventListener('pointerdown',e=>{
    if(!bState.smk)return;const b=BLD.find(x=>x.id===bState.smkId);if(!isG(b)){bState.smk=0;return}
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const r=brd.getBoundingClientRect(),cs=bCell(),gx=(e.clientX-r.left)/cs,gy=(e.clientY-r.top)/cs,g=cen(b);
    if(!g)return;
    if(Math.hypot(gx-g[0],gy-g[1])<=Math.max(b.w,b.h)/2){delete smkMap()[b.id];try{toast('Đã đặt làn khói về vị trí mặc định')}catch(er){}}
    else{const d=dims(b),k=clampC(b,gx,gy);smkMap()[b.id]=k}
    save();bRender()},true);
})();

/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở (20 công trình mới) ---------- */
(function(){
const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;
const {mkBld,mkEn}=H;
const txt=(q,s,x,y,col,sz,al)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign=al||'center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
const ring=(q,x,y,r,col,w,dash)=>{q.save();q.strokeStyle=col;q.lineWidth=w||1.5;if(dash)q.setLineDash(dash);q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
const mkAl=(G,c,x,y,i,hp)=>{const a={team:'p',x,y,hx:x,hy:y,hp:hp||100,max:hp||100,size:1.5,sh:c.pool[(i||0)%c.pool.length],dead:false,hit:0,ang:-Math.PI/2};(G.al=G.al||[]).push(a);return a};
const drawAl=(q,a,X,Y,s,alpha)=>{if(a.dead)return;const im=a.c17w?dimg(WSIMG):dimg(a.sh.img);if(!im)return;const h=a.size*s*(a.c17w?1.15:1),w=h*im.naturalWidth/im.naturalHeight;
  q.save();q.translate(X(a.x),Y(a.y));q.globalAlpha=alpha==null?1:alpha;q.rotate(a.c17w?(a.ang==null?-Math.PI/2:a.ang)+Math.PI/2:0);q.drawImage(im,-w/2,-h/2,w,h);q.restore();
  if(a.max<1e8){const bw=a.size*s*.9,f=Math.max(0,a.hp/a.max);q.fillStyle='#000a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw,4);q.fillStyle='#6dff9a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw*f,4)}};
const shRing=(q,a,X,Y,s,T)=>{const v=shVal(a);if(!(v>0)||a.dead)return;q.save();q.strokeStyle='rgba(235,248,255,'+(.6+.25*Math.sin(T*8))+')';q.lineWidth=2.5;q.shadowColor='#fff';q.shadowBlur=10;q.beginPath();q.arc(X(a.x),Y(a.y),a.size*s*.66,0,7);q.stroke();q.restore()};
const expire=G=>{(G.al||[]).forEach(a=>{if(a.shd&&a.shd.c17&&G.t>a.shd.c17)a.shd=null});G.bl.forEach(b=>{if(b.shd&&b.shd.t>0){b.shd.t-=G.dtc||.02;if(b.shd.t<=0)b.shd=null}})};
const sway=(G,a,i,ax,ay)=>{a.x=a.hx+Math.sin(G.t*.8+i*1.7)*(ax==null?.45:ax);a.y=a.hy+Math.cos(G.t*.6+i)*(ay==null?.3:ay)};
const fire=(G,x,y,tx,ty,dmg,col,sp)=>{sp=sp||14;const l=Math.hypot(tx-x,ty-y)||1;G.pr.push({x,y,vx:(tx-x)/l*sp,vy:(ty-y)/l*sp,dmg:dmg||1,team:'p',k:'gun',col:col||'#8fd8ff',life:l/sp+.25})};
const safe=o=>{['init','step','under','over'].forEach(k=>{const f=o[k];if(f)o[k]=function(){try{return f.apply(this,arguments)}catch(e){console.error('c17 sc',o.title,e)}}});return o};
const fl=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.5,max:t||.5,col});
const ex=(G,x,y,r)=>G.fx.push({x,y,r,t:.6,max:.6,ex:1,rot:Math.random()*6});

SC.mt6=safe({title:'BỂ NA NÔ GIÁP TRẮNG',note:'Tàu trong 6 ô nhận 30 giáp, không cộng dồn',
  init(G,c){c.b=mkBld(G,'mt6',7.5,7.7,{lv:c.lv});c.a=[mkAl(G,c,5,5.3,0),mkAl(G,c,10.4,6.2,1),mkAl(G,c,1.8,1.9,2),mkAl(G,c,13.2,2.2,3)]},
  step(G,dt,c){G.dtc=dt;c.a.forEach((a,i)=>sway(G,a,i));mt6(c.b,dt,G);expire(G)},
  under(q,G,c,X,Y,s){ring(q,X(c.b.x),Y(c.b.y),6*s,'rgba(255,255,255,.5)',1.5,[6,5])},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t);const v=shVal(a);txt(q,v>0?'+'+Math.round(v)+' giáp':'ngoài 6 ô',X(a.x),Y(a.y)-a.size*s*.8,v>0?'#ffffff':'#8fa6d8',10)})}});

SC.mt7=safe({title:'TRẠM TÁI CHẾ PHẾ LIỆU',note:'Xem nhanh: 3 mục tiêu bị diệt tạo 1 drone tấn công (tối đa 5)',
  init(G,c){c.b=mkBld(G,'mt7',7.5,7.7,{lv:c.lv});c.es=[0,1,2].map(i=>mkEn(G,c,3.2+i*4.3,1.3+(i%2)*.8,300));c.kt=0;c.n=0},
  step(G,dt,c){c.kt+=dt;if(c.kt>1.2){c.kt=0;const e=c.es[(c.n++)%3];if(!e.dead){dfDmgS(e,e.hp+5,false);ex(G,e.x,e.y,1.2)}}mt7(c.b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'Mục tiêu bị diệt: '+(c.b.rcK||0)+'/3 · Drone: '+(c.b.c17d||[]).length+'/5',X(7.5),Y(9.9),'#bfffc9',11)}});

SC.mt8=safe({title:'MÔ-ĐUN HỒI SINH',note:'Tàu bị phá hủy sẽ hồi sinh ngay tại mô-đun, hồi chiêu 180 giây (xem nhanh)',
  init(G,c){c.b=mkBld(G,'mt8',3.2,7.6,{lv:c.lv});c.sh=mkAl(G,c,10.6,4.3,0,300);c.tm=0;c.ph=0;c.cd=0},
  step(G,dt,c){c.tm+=dt;if(c.cd>0)c.cd=Math.max(0,c.cd-dt*65);const a=c.sh;
    if(c.ph===0&&c.tm>2.2){c.ph=1;c.tm=0;a.dead=true;ex(G,a.x,a.y,2)}
    else if(c.ph===1&&c.tm>.3){c.ph=2;c.tm=0;a.dead=false;a.x=a.hx=3.2;a.y=a.hy=5.7;a.hp=a.max;fl(G,3.2,7.6,2.2,'#7dffa0',.7);fl(G,a.x,a.y,1.6,'#ffffff',.5);c.cd=180}
    else if(c.ph===2&&c.tm>2.8){c.ph=0;c.tm=0;a.x=a.hx=10.6;a.y=a.hy=4.3;fl(G,a.x,a.y,1.3,'#9fd8ff',.5)}},
  over(q,G,c,X,Y,s){drawAl(q,c.sh,X,Y,s);txt(q,c.ph===1?'Bị phá hủy!':c.ph===2?'Hồi sinh tức thì':'Chiến đấu',X(c.sh.x),Y(c.sh.y)-1.2*s,c.ph===2?'#7dffa0':'#fff',11);
    txt(q,c.cd>0?'Hồi chiêu: '+Math.ceil(c.cd)+' giây':'Sẵn sàng',X(3.2),Y(9.6),c.cd>0?'#ffc86a':'#7dffa0',11)}});

SC.mt9=safe({title:'XƯỞNG CƠ KHÍ TRUNG TÂM',note:'Trong 5 ô: tăng tốc độ bắn và tốc độ chạy cho tàu và drone',
  init(G,c){c.b=mkBld(G,'mt9',7.5,7.6,{lv:c.lv});c.a=[mkAl(G,c,5,5.4,0),mkAl(G,c,12.4,2.6,1)];c.e=[mkEn(G,c,5,.6,1e9),mkEn(G,c,12.4,.6,1e9)];c.fc=[0,0];c.ph=[0,0]},
  step(G,dt,c){c.a.forEach((a,i)=>{const k=window.c17Aura(G,a.x,a.y);a.k=k.fr;c.ph[i]+=dt*k.sp;a.x=a.hx+Math.sin(c.ph[i]*1.5)*.7;a.y=a.hy;c.fc[i]-=dt*k.fr;if(c.fc[i]<=0){c.fc[i]=.7;fire(G,a.x,a.y-.7,c.e[i].x,c.e[i].y,1,i?'#ffb38a':'#9dffb0')}})},
  under(q,G,c,X,Y,s){const T=G.t;ring(q,X(c.b.x),Y(c.b.y),5*s,'rgba(255,200,90,.65)',1.6,[6,5]);ring(q,X(c.b.x),Y(c.b.y),(5*((T*.5)%1))*s,'rgba(255,200,90,.3)',2)},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);txt(q,a.k>1?'tốc bắn · tốc chạy ×'+String(Math.round(a.k*100)/100).replace('.',','):'ngoài 5 ô: ×1',X(a.x),Y(a.y)-a.size*s*.8,a.k>1?'#ffd27a':'#8fa6d8',10)})}});

SC.mt10=safe({title:'TRIỆU HỒI TÀU CHIẾN',note:'Xem nhanh: thực tế 80 giây gọi 1 tàu chiến (tối đa 3)',
  init(G,c){c.b=mkBld(G,'mt10',7.5,7.6,{lv:c.lv});c.b.wsEv=5;c.b.wsT=.8;c.es=[mkEn(G,c,3.6,1.2,1e9),mkEn(G,c,11.4,1.6,1e9)]},
  step(G,dt,c){mt10(c.b,dt,G);(G.al||[]).forEach((a,i)=>{if(a.dead)return;const hx=3.4+i*4.1,hy=5.4+(i%2)*.5;a.x+=(hx-a.x)*Math.min(1,dt*1.5);a.y+=(hy+Math.sin(G.t*1.5+i)*.3-a.y)*Math.min(1,dt*1.5);
    const e=c.es[i%2];a.ang=Math.atan2(e.y-a.y,e.x-a.x);a.fc=(a.fc||0)-dt;if(a.fc<=0){a.fc=.5;fire(G,a.x,a.y,e.x,e.y,1,'#8fd8ff',16)}})},
  over(q,G,c,X,Y,s){(G.al||[]).forEach(a=>drawAl(q,a,X,Y,s));txt(q,'Tàu chiến: '+(c.b.c17s||[]).length+'/3',X(7.5),Y(9.9),'#bfe6ff',11)}});

SC.cm1=safe({title:'PHÁT HIỆN TÀNG HÌNH',note:'Phát hiện 1 mục tiêu tàng hình trong 15 ô, hồi chiêu 20 giây (xem nhanh)',
  init(G,c){c.b=mkBld(G,'cm1',7.5,7.7,{lv:c.lv});c.e=mkEn(G,c,10.5,2.4,1e9);c.e2=mkEn(G,c,3.5,3.4,1e9);c.e.noRev=c.e2.noRev=true;c.e.stl=50;c.e2.stl=0;c.tm=0},
  step(G,dt,c){c.tm+=dt;c.e.x=10.5+Math.sin(G.t*.9)*1.2;if(c.e.stl>0&&!(c.b.dtC>0))c.b.dtC=0;if(c.b.dtC>3.5)c.b.dtC=3.5;cm1(c.b,dt,G);if(c.e.stl<=0&&!(c.e.rvlT>0)&&c.tm>3.5){c.e.stl=50;c.tm=0}if(c.e.rvlT>0&&c.tm>3){c.tm=0}},
  over(q,G,c,X,Y,s){const e=c.e;if(e.stl>0){q.save();q.fillStyle='rgba(5,12,34,.82)';q.beginPath();q.arc(X(e.x),Y(e.y),e.size*s*.62,0,7);q.fill();q.restore();txt(q,'Tàng hình',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10)}else txt(q,'Bị phát hiện!',X(e.x),Y(e.y)-e.size*s*.7,'#9fffd8',11);
    txt(q,c.b.dtC>0?'Hồi chiêu: '+Math.ceil(c.b.dtC*5.7)+' giây':'Sẵn sàng',X(7.5),Y(9.9),'#ffc86a',11)}});

SC.cm2=safe({title:'THÁP TÍN HIỆU XANH',note:'Làm nhiễu mục tiêu trong 15 ô: cấm dùng 1 kỹ năng bất kỳ',
  init(G,c){c.b=mkBld(G,'cm2',7.5,7.7,{lv:c.lv});c.es=[mkEn(G,c,4,2.8,1e9),mkEn(G,c,11,3.4,1e9),mkEn(G,c,7.5,1.9,1e9)];c.es.forEach(e=>{e.noRev=true;e.hx=e.x})},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.7+i*2)*.8;if(e.silT>0)e.silT-=dt});cm2(c.b,dt,G)},
  under(q,G,c,X,Y,s){ring(q,X(c.b.x),Y(c.b.y),15*s,'rgba(110,190,255,.4)',1.5,[6,5]);const r=((G.t*.9)%1)*9*s;ring(q,X(c.b.x),Y(c.b.y),r,'rgba(110,190,255,'+(.5*(1-r/(9*s)))+')',2)},
  over(q,G,c,X,Y,s){c.es.forEach(e=>{const on=e.silT>0;txt(q,on?'⚡ kỹ năng bị cấm':'✦ kỹ năng',X(e.x),Y(e.y)-e.size*s*.7,on?'#bfe6ff':'#ffe27a',10)})}});

SC.cm3=safe({title:'TRUNG TÂM BẢN ĐỒ CHIẾN THUẬT',note:'Hiện bản đồ toàn trận ở góc trên bên phải; mất khi công trình bị phá hủy',
  init(G,c){c.b=mkBld(G,'cm3',4,7.6,{lv:c.lv});c.es=[0,1,2,3].map(i=>{const e=mkEn(G,c,2+i*3.6,1+(i%2)*1.4,1e9);e.hx=e.x;e.noRev=true;return e});c.a=[mkAl(G,c,5.5,5,0),mkAl(G,c,9,5.8,1)];c.tm=0},
  step(G,dt,c){c.tm+=dt;c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.8+i)*1.2});c.a.forEach((a,i)=>sway(G,a,i,.8,.4));c.b.hp=(c.tm%8)<6?c.b.max:0},
  over(q,G,c,X,Y,s){c.a.forEach(a=>drawAl(q,a,X,Y,s));if(c.b.hp>0){const w=Math.round(s*5.2),h=Math.round(w*G.wd.Hd/G.wd.Wd),x0=X(15)-w-8,y0=22;window.c17Mini(q,G,x0,y0,w,h,null)}else txt(q,'Công trình bị phá hủy: bản đồ biến mất',X(10.5),Y(1.2),'#ffb0a0',10)}});

SC.cm4=safe({title:'PHÒNG THÍ NGHIỆM LÕI NĂNG LƯỢNG',note:'Tăng năng lượng tối đa của cả đội thêm 5; mất khi bị phá hủy',
  init(G,c){c.b=mkBld(G,'cm4',3.4,7.6,{lv:c.lv});c.tm=0},
  step(G,dt,c){c.tm+=dt;c.b.hp=(c.tm%8)<5.5?c.b.max:0},
  over(q,G,c,X,Y,s){const on=c.b.hp>0,base=10,mx=on?base+5*(1+.1*((c.lv||1)-1)):base,bw=7.5*s,x0=X(6),y0=Y(3);txt(q,'Năng lượng tối đa của đội',X(10),Y(2),'#bfe6ff',11);
    q.fillStyle='#0b1a44';q.fillRect(x0,y0,bw,s*.9);const f=mx/(base+5*(1+.1*((c.lv||1)-1)));q.fillStyle=on?'#ffd23a':'#8a7a3a';q.fillRect(x0,y0,bw*f,s*.9);q.strokeStyle='#fff6';q.strokeRect(x0,y0,bw,s*.9);
    txt(q,String(Math.round(mx)),x0+bw*f-14,y0+s*.65,'#000',12);txt(q,on?'+5 nhờ phòng thí nghiệm':'công trình bị phá hủy: mất hiệu ứng',X(10),Y(5),on?'#7dffa0':'#ffb0a0',11)}});

SC.cm5=safe({title:'ĐÀI THIÊN VĂN',note:'Quét quanh 9 ô mỗi 0,75 giây, 20% gây sợ hãi cho tàu địch 1 giây',
  init(G,c){c.b=mkBld(G,'cm5',7.5,7.7,{lv:c.lv});c.es=[];for(let i=0;i<7;i++){const e=mkEn(G,c,2+i*1.9,1.6+(i%3)*1.1,1e9);e.hx=e.x;e.hy=e.y;e.noRev=true;c.es.push(e)}},
  step(G,dt,c){cm5(c.b,dt,G);c.es.forEach(e=>{if(e.fearT>0){e.fearT-=dt;const dx=e.x-e.fearX,dy=e.y-e.fearY,l=Math.hypot(dx,dy)||1;e.x+=dx/l*2.2*dt;e.y=Math.max(.5,e.y+dy/l*2.2*dt)}else{e.x+=(e.hx-e.x)*dt*.8;e.y+=(e.hy-e.y)*dt*.8}})},
  under(q,G,c,X,Y,s){ring(q,X(c.b.x),Y(c.b.y),9*s,'rgba(255,226,122,.45)',1.5,[6,5]);const u=((G.t/.75)%1);ring(q,X(c.b.x),Y(c.b.y),u*9*s,'rgba(255,226,122,'+(.5*(1-u))+')',2.5)},
  over(q,G,c,X,Y,s){c.es.forEach(e=>{if(e.fearT>0)txt(q,'😱',X(e.x),Y(e.y)-e.size*s*.6,'#fff',16)})}});

SC.cm6=safe({title:'TRUNG TÂM DỮ LIỆU',note:'+50 máu cho công trình và tàu trong 20 ô; mất khi công trình bị phá hủy',
  init(G,c){c.b=mkBld(G,'cm6',7.5,7.7,{lv:c.lv});c.t=[mkBld(G,'cannon',3.2,5.8,{}),mkBld(G,'laser',11.8,5.8,{}),mkBld(G,'wall',7.5,3.6,{w:2,h:1})];c.a=mkAl(G,c,7.5,5.5,0);c.tm=0},
  step(G,dt,c){c.tm+=dt;c.b.hp=(c.tm%9)<6.5?c.b.max:0},
  under(q,G,c,X,Y,s){if(c.b.hp<=0)return;const u=((G.t*.6)%1);ring(q,X(c.b.x),Y(c.b.y),u*14*s,'rgba(120,230,255,'+(.45*(1-u))+')',3)},
  over(q,G,c,X,Y,s){drawAl(q,c.a,X,Y,s);const on=c.b.hp>0;[...c.t,c.a].forEach((o,i)=>{const u=((G.t*.7+i*.3)%1);if(on){q.save();q.globalAlpha=1-u;txt(q,'+50 máu',X(o.x),Y(o.y)-(o.size||o.h||1)*s*.6-u*s*1.2,'#7dffa0',11);q.restore()}});
    if(!on)txt(q,'công trình bị phá hủy: mất hiệu ứng',X(7.5),Y(1.2),'#ffb0a0',10)}});

SC.cm7=safe({title:'THÁP CHỈ HUY TRUNG TÂM',note:'Dựng tường laser xanh 12 ô quanh tháp, 800 máu, hồi chiêu 25 giây (xem nhanh)',
  init(G,c){c.b=mkBld(G,'cm7',7.5,6.6,{w:2,h:2,lv:c.lv});c.es=[mkEn(G,c,3.2,1.2,1e9),mkEn(G,c,11.8,1.2,1e9)];c.kc=[0,0];c.b.rgCd=.5},
  step(G,dt,c){c.dt=dt;const b=c.b;b.hp=b.max;if(b.rg&&b.rg.hp<=0){const i=G.bl.indexOf(b.rg);if(i>=0)G.bl.splice(i,1);b.rg=null;b.rgCd=5}
    c.es.forEach((e,i)=>{c.kc[i]-=dt;if(c.kc[i]<=0){c.kc[i]=.8;const l=Math.hypot(b.x-e.x,b.y-e.y)||1;G.pr.push({x:e.x,y:e.y,vx:(b.x-e.x)/l*9,vy:(b.y-e.y)/l*9,dmg:b.rg?b.rg.max/14:0,team:'e',k:'shell',col:'#ff8a8a',spl:0,life:l/9+.5})}});cm7(b,dt,G)},
  over(q,G,c,X,Y,s){const b=c.b;txt(q,b.rg?'Tường laser: '+Math.max(0,Math.round(b.rg.hp/b.rg.max*800))+' máu':'Hồi chiêu: '+Math.ceil((b.rgCd||0)*5)+' giây',X(7.5),Y(9.9),b.rg?'#bfe6ff':'#ffc86a',11)}});

SC.cm8=safe({title:'VIỆN NGHIÊN CỨU CẦU QUANG',note:'Mọi kỹ năng và đòn bắn lan của đồng minh (kể cả công trình) lan rộng thêm 3%',
  init(G,c){c.b=mkBld(G,'cm8',3.4,7.6,{lv:c.lv});c.tm=0},
  step(G,dt,c){c.tm+=dt},
  over(q,G,c,X,Y,s){const k=1+.03*(1+.1*((c.lv||1)-1)),u=(c.tm%2.4)/2.4,R=2.4;txt(q,'Vùng nổ lan',X(10),Y(2.2),'#bfe6ff',11);const x=X(10.2),y=Y(5);
    q.save();q.globalAlpha=1-u*.7;ring(q,x,y,R*s*(.4+.6*u),'#ffb066',2);ring(q,x,y,R*s*k*(.4+.6*u),'#7dffa0',2.5);q.restore();
    txt(q,'Cam: thường · Xanh: +'+String(Math.round((k-1)*10000)/100).replace('.',',')+'%',X(10),Y(8.4),'#fff',10)}});

SC.cm9=safe({title:'TRUNG TÂM NGHIÊN CỨU VÒM KÍNH',note:'Mọi đồng minh và công trình nhận giáp chặn 50 sát thương trong 10 giây, lặp lại mỗi 15 giây',
  init(G,c){c.b=mkBld(G,'cm9',3.4,7.6,{lv:c.lv});c.t=[mkBld(G,'cannon',8.2,6.3,{}),mkBld(G,'wall',12,6.3,{w:2,h:1})];c.a=[mkAl(G,c,7,3.4,0),mkAl(G,c,11.3,3.1,1)];G.dtc=.02},
  step(G,dt,c){G.dtc=dt;c.a.forEach((a,i)=>sway(G,a,i));cm9(c.b,dt,G);expire(G)},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t)});c.t.forEach(o=>{if(o.shd&&o.shd.t>0){q.save();q.strokeStyle='rgba(235,248,255,.8)';q.lineWidth=2.5;q.shadowColor='#fff';q.shadowBlur=10;q.strokeRect(X(o.x-o.w/2)-3,Y(o.y-o.h/2)-3,o.w*s+6,o.h*s+6);q.restore()}});
    txt(q,'Lượt giáp kế tiếp sau '+Math.max(0,Math.ceil(c.b.vkT||0))+' giây',X(8),Y(9.9),'#bfe6ff',11)}});

SC.cm10=safe({title:'BỘ CHỈ HUY TỐI CAO',note:'Mỗi 40 giây giảm 10 giây hồi chiêu cho 5 kỹ năng thuyền trưởng (xem nhanh)',
  init(G,c){c.b=mkBld(G,'cm10',3.4,7.6,{lv:c.lv});c.cd=[26,30,18,34,22,38,12];c.mx=[30,34,30,36,30,40,24];c.pu=0;c.tm=0},
  step(G,dt,c){c.tm+=dt;c.cd=c.cd.map(v=>Math.max(0,v-dt*2.5));c.pu=Math.max(0,c.pu-dt);if(c.tm>4){c.tm=0;c.pu=1;let n=0;c.cd=c.cd.map((v,i)=>{if(v>0&&n<5){n++;return Math.max(0,v-10)}return v})}},
  over(q,G,c,X,Y,s){txt(q,'Hồi chiêu kỹ năng thuyền trưởng',X(7.5),Y(1.8),'#bfe6ff',11);c.cd.forEach((v,i)=>{const x=X(2.1+i*1.75),y=Y(3),w=s*1.15;q.fillStyle='#0b1a44';q.fillRect(x,y,w,w);q.fillStyle=c.pu>0?'#ffd23a':'#4f7cff';const h=w*v/c.mx[i];q.fillRect(x,y+w-h,w,h);q.strokeStyle='#fff7';q.strokeRect(x,y,w,w);txt(q,v>0?String(Math.ceil(v)):'✓',x+w/2,y+w+s*.55,'#fff',10)});
    if(c.pu>0)txt(q,'−10 giây × 5 kỹ năng',X(7.5),Y(6.4),'#ffd23a',13)}});

SC.en1=safe({title:'DÀN PIN MẶT TRỜI',note:'Tăng hồi năng lượng cho cả đội thêm 1',
  init(G,c){c.b=mkBld(G,'en1',3.4,7.6,{lv:c.lv});c.tm=0},
  step(G,dt,c){c.tm+=dt},
  over(q,G,c,X,Y,s){const k=1+.1*((c.lv||1)-1),bw=7.5*s,x0=X(6);txt(q,'Năng lượng hồi theo thời gian',X(10),Y(2.2),'#bfe6ff',11);
    [['Không có',1,'#8a7a3a'],['Có dàn pin (+'+String(Math.round(k*100)/100).replace('.',',')+' hồi)',1+k,'#ffd23a']].forEach((r,i)=>{const y=Y(3.4+i*2.3),f=Math.min(1,(c.tm*r[1]/8)%1.15);q.fillStyle='#0b1a44';q.fillRect(x0,y,bw,s*.9);q.fillStyle=r[2];q.fillRect(x0,y,bw*Math.min(1,f),s*.9);q.strokeStyle='#fff6';q.strokeRect(x0,y,bw,s*.9);txt(q,r[0],x0+bw/2,y-s*.18,'#fff',10)})}});

SC.en2=safe({title:'DÃY ẮC QUY TRỤ',note:'Tăng tầm bắn của kỹ năng thuyền trưởng thêm 1 ô',
  init(G,c){c.b=mkBld(G,'en2',3.4,7.6,{lv:c.lv});c.a=mkAl(G,c,9,6,0);c.e=mkEn(G,c,9,1.2,1e9);c.tm=0},
  step(G,dt,c){c.tm+=dt;c.a.x=c.a.hx+Math.sin(G.t*.8)*.4},
  under(q,G,c,X,Y,s){const x=X(c.a.x),y=Y(c.a.y),k=1+.1*((c.lv||1)-1);ring(q,x,y,3.6*s,'rgba(255,255,255,.4)',1.5,[5,5]);ring(q,x,y,(3.6+k)*s,'rgba(127,227,255,.85)',2.2);
    const u=(G.t%1.8)/1.8;if(u<.9){q.save();q.fillStyle='#7fe3ff';q.shadowColor='#7fe3ff';q.shadowBlur=8;q.beginPath();q.arc(x,y-u*(3.6+k)*s,3,0,7);q.fill();q.restore()}},
  over(q,G,c,X,Y,s){drawAl(q,c.a,X,Y,s);txt(q,'tầm cũ',X(c.a.x+3.4),Y(c.a.y)-3,'#ddd',10);txt(q,'+1 ô',X(c.a.x+3.4),Y(c.a.y-3.6)-4,'#7fe3ff',11)}});

SC.en3=safe({title:'LÒ PHẢN ỨNG PLASMA',note:'Tụ lực 5 giây, bắn plasma tới mục tiêu trong 5 ô, nổ 300 sát thương trong 4 ô và làm choáng 0,5 giây',
  init(G,c){c.b=mkBld(G,'en3',7.5,8,{lv:c.lv});c.es=[mkEn(G,c,5.7,4.6,1e9),mkEn(G,c,7.6,3.5,1e9),mkEn(G,c,9.6,4.8,1e9)];c.es.forEach(e=>{e.noRev=true});c.tx=[]},
  step(G,dt,c){c.es.forEach(e=>{if(e.stun>0){if(!e.c17s){e.c17s=1;c.tx.push({x:e.x,y:e.y,t:.9})}e.stun-=dt}else e.c17s=0});c.tx.forEach(o=>o.t-=dt);c.tx=c.tx.filter(o=>o.t>0);en3(c.b,dt,G)},
  over(q,G,c,X,Y,s){c.es.forEach(e=>{if(e.stun>0)txt(q,'💫 choáng',X(e.x),Y(e.y)-e.size*s*.65,'#bfe6ff',10)});c.tx.forEach(o=>txt(q,'-'+Math.round(300*(1+.1*((c.lv||1)-1))),X(o.x),Y(o.y)-(1-o.t)*s*1.3-s*.4,'#ff9a8a',12));
    const S=c.b.pl;txt(q,S&&S.c<5?'Tụ lực '+S.c.toFixed(1).replace('.',',')+' / 5 giây':'Sẵn sàng bắn',X(7.5),Y(9.95),'#bfe6ff',11)}});

SC.en4=safe({title:'TỔ MÁY PHÁT HƠI NƯỚC',note:'Làn khói 2×4 ô: đồng minh tàng hình, địch trong khói mất tầm nhìn (đặt vị trí ở màn Trụ sở)',
  init(G,c){c.b=mkBld(G,'en4',3.4,3.1,{lv:c.lv});c.a=mkAl(G,c,1,2,0);c.a.dir=1;c.es=[mkEn(G,c,9,2.3,1e9),mkEn(G,c,11.4,5.6,1e9)];c.es[0].noRev=true;c.sm=0;c.bt=mkBld(G,'cannon',12.5,8.2,{});c.k=0},
  step(G,dt,c){c.k-=dt;const r=window.c17SmokeRect(c.b,G);c.rc=r;const a=c.a;a.x+=a.dir*2*dt;if(a.x>13)a.dir=-1;if(a.x<1)a.dir=1;a.y=r.cy;
    const ins=u=>Math.abs(u.x-r.cx)<=r.w/2&&Math.abs(u.y-r.cy)<=r.h/2;a.in=ins(a);c.es[0].x=r.cx+(Math.sin(G.t*.8)>0?.3:-.3)+Math.sin(G.t*.8)*.3;c.es[0].y=r.cy-.5;c.es[0].in=ins(c.es[0]);
    c.es.forEach(e=>{if(e.in){e.noFire=.3}});
    if(c.k<=0){c.k=.9;const e=c.es[1];if(!e.in){const l=Math.hypot(c.bt.x-e.x,c.bt.y-e.y)||1;G.pr.push({x:e.x,y:e.y,vx:(c.bt.x-e.x)/l*9,vy:(c.bt.y-e.y)/l*9,dmg:.2,team:'e',k:'shell',col:'#ff8a8a',spl:0,life:l/9+.3})}}},
  over(q,G,c,X,Y,s){drawAl(q,c.a,X,Y,s,c.a.in?.3:1);if(c.a.in)txt(q,'tàng hình',X(c.a.x),Y(c.a.y)-1.1*s,'#e8f2ff',10);const e=c.es[0];if(e.in)txt(q,'mất tầm nhìn · cấm kỹ năng',X(e.x),Y(e.y)-1.3*s,'#ffd0c8',10)}});

SC.en5=safe({title:'TỤ ĐIỆN CAO THẾ',note:'Dựng tường cao thế 1×5 chặn 300 sát thương, hồi chiêu 30 giây sau khi bị phá (xem nhanh)',
  init(G,c){c.b=mkBld(G,'en5',3.2,6.4,{lv:c.lv});c.es=[mkEn(G,c,11.5,3.4,1e9),mkEn(G,c,11.5,6.6,1e9)];c.kc=[0,.4];c.b.wcd=.5},
  step(G,dt,c){const b=c.b;b.hp=b.max;if(b.wl&&b.wl.hp<=0){const i=G.bl.indexOf(b.wl);if(i>=0)G.bl.splice(i,1);b.wl=null;b.wcd=5}
    c.es.forEach((e,i)=>{c.kc[i]-=dt;if(c.kc[i]<=0){c.kc[i]=.8;const l=Math.hypot(b.x-e.x,b.y-e.y)||1;G.pr.push({x:e.x,y:e.y,vx:(b.x-e.x)/l*9,vy:(b.y-e.y)/l*9,dmg:b.wl?b.wl.max/12:0,team:'e',k:'shell',col:'#ff8a8a',spl:0,life:l/9+.5})}});en5(b,dt,G)},
  over(q,G,c,X,Y,s){const b=c.b;txt(q,b.wl?'Tường cao thế: '+Math.max(0,Math.round(b.wl.hp/b.wl.max*300*(1+.1*((c.lv||1)-1))))+' máu':'Hồi chiêu: '+Math.ceil((b.wcd||0)*6)+' giây',X(7.5),Y(9.9),b.wl?'#bfe6ff':'#ffc86a',11)}});
})();

window.C17={CFG,C17T,mkWarship,smokeRect,shVal,shSet,ships};
})();
