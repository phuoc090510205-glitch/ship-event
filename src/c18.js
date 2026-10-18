/* ===== c18: Khai thác & Sản xuất · Phòng thủ · Động năng (24 công trình điều chỉnh) ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const C18T=['pr1','pr2','pr3','pr4','pr6','pr7','pr8','pr9','pr10','df1','df2','df3','df4','df5','df6','df7','df8','df9','df10','kn1','kn2','kn3','kn4'];
const CFG={
  pr1:{pvp:10,lv:5},
  pr2:{pvp:12,lv:8},
  pr3:{pvp:60,lv:120},
  pr4:{every:90,pvp:3000,lv:2000},
  pr6:{every:60,p:.2,da:4000,sao:5},
  pr7:{n:20,da:5000,sao:20},
  pr8:{n:15,R:12,hp:1000,dmg:80,cd:.5,life:15,max:3,sp:5.2,rng:3.6},
  pr9:{charge:20,R:5,dmg:500,kill:.3,sp:13},
  pr10:{n:15,sh:300,dur:10},
  df1:{rng:7,cd:.5,dmg:29/20,sp:15,tip:.48},
  df2:{rng:8,cd:1/1.6,dmg:30/20,sp:13,spl:.9,side:.23,tip:.9},
  df3:{rng:6.5,cd:1/6,dmg:.55,sp:17,ring:.36},
  df4:{rng:12,cd:4,dmg:300/20,spl:3,sp:7.5,tip:1.35},
  df5:{hp:3000,every:350,R:8,sh:200,dur:10,stun:.25},
  df6:{R:8,rate:4},
  df7:{rng:12,cd:4.5,dmg:800/20,sdmg:400/20,spl:3,sp:11,tip:1.9},
  df8:{rng:9,cd:.7,dmg:50/20,spl:1,sp:10,xs:[-.45,0,.41],tip:.95},
  df9:{every:10,hp:200,dmg:10,cd:.75,R:4,leash:12,heal:10,healCd:.5,kam:100,kamR:2,cap:6,rev:10,revHp:.3,addHp:200,da:300,sao:1,mx:6},
  df10:{rng:14,cd:1.2,dmg:150/20,exe:.02,boom:3,bdmg:70/20,tip:.33},
  kn1:{rng:8,cd:.5,dmg:1.3,sp:18,tip:.48},
  kn2:{rng:9.5,cd:.6,dmg:1.2,sp:19,side:.38,tip:.95},
  kn3:{rng:6,rate:12,dmg:20/20,sp:11,pod:.46},
  kn4:{rng:9,cd:1.1,dmg:70/20,sp:13,p3:.8,off:.42,tip:.85}};
window.c18Has=t=>C18T.includes(t);
{const o=window.c16Has;window.c16Has=t=>(o?o(t):false)||C18T.includes(t)}
/* gắn cờ, bỏ sản lượng treo máy / hiệu ứng bị động cũ */
C18T.forEach(t=>{const f=NBF[t];if(f){f.c18=t;delete f.e;if(f.k==='prod'){delete f.da;delete f.sao}}});
/* công trình đứng yên (không xoay mũi): đạn đi thẳng theo hướng nòng */
const FIX={kn1:1,kn2:1,kn4:1,df10:1,kn3:1};
const ROT={df1:1,df2:1,df3:1,df4:1,df7:1,df8:1};
C18T.forEach(t=>{const f=NBF[t];if(f&&FIX[t])f.c18fix=1});
/* đổi tên */
const REN={pr9:'Lò Tinh Luyện Đạn Quỷ',pr10:'Kho Tạo Tàu',kn3:'Dàn Tên Lửa Nhỏ 4 Nòng'};
Object.keys(REN).forEach(t=>{const b=BLD.find(x=>x.t===t);if(b)b.n=REN[t];if(UPD[t])UPD[t].n=REN[t]});
/* máu */
HPB.df5=CFG.df5.hp;
/* pháo mảnh văng bốn hướng: 120 → 290 sát thương (hiển thị ×20) */
if(NBF.kn5)NBF.kn5.dmg=290/20;if(BT.kn5)BT.kn5.dmg=290/20;
/* đồng bộ BT với số liệu mới (dùng cho công trình đối thủ trong PvP) */
{const S2=(t,o)=>{if(BT[t])Object.assign(BT[t],o)};
  S2('df1',{dmg:CFG.df1.dmg,cd:CFG.df1.cd});S2('df2',{dmg:CFG.df2.dmg*2,cd:CFG.df2.cd,rng:8});S2('df3',{cd:CFG.df3.cd});S2('df4',{dmg:CFG.df4.dmg,cd:CFG.df4.cd,spl:3});
  S2('df7',{dmg:CFG.df7.dmg,cd:CFG.df7.cd,rng:12});S2('df8',{dmg:CFG.df8.dmg*3,cd:CFG.df8.cd});S2('df10',{dmg:CFG.df10.dmg*4,cd:CFG.df10.cd});
  S2('kn1',{dmg:CFG.kn1.dmg,cd:CFG.kn1.cd});S2('kn2',{dmg:CFG.kn2.dmg*2,cd:CFG.kn2.cd});S2('kn3',{dmg:CFG.kn3.dmg*CFG.kn3.rate,cd:1,rng:6});S2('kn4',{dmg:CFG.kn4.dmg*2.8,cd:CFG.kn4.cd})}
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
const WHEN='Khi được trang bị vào chiến trường';
upd('pr1',(l,k)=>[['Sản lượng PvP',fmt(10*k)+' Đá / giây'],['Sản lượng Level',fmt(5*k)+' Đá / giây'],['Cộng vào','Phần thưởng PvP và phần thưởng Level']],'Triển khai vào chiến trường: tạo 10 Đá mỗi giây khi đấu PvP, 5 Đá mỗi giây khi chơi Level; tổng sản lượng cộng vào phần thưởng trận.');
upd('pr2',(l,k)=>[['Sản lượng PvP',fmt(12*k)+' Đá / giây'],['Sản lượng Level',fmt(8*k)+' Đá / giây'],['Cộng vào','Phần thưởng PvP và phần thưởng Level']],'Triển khai vào chiến trường: tạo 12 Đá mỗi giây khi đấu PvP, 8 Đá mỗi giây khi chơi Level; tổng sản lượng cộng vào phần thưởng trận.');
upd('pr3',(l,k)=>[['Sản lượng PvP',fmt(1*k)+' Sao / 60 giây'],['Sản lượng Level',fmt(1*k)+' Sao / 120 giây'],['Cộng vào','Phần thưởng PvP và phần thưởng Level']],'Khi có xưởng trong trận: tạo 1 Sao mỗi 60 giây khi đấu PvP, mỗi 120 giây khi chơi Level; tổng sản lượng cộng vào phần thưởng trận.');
upd('pr4',(l,k)=>[['Sản lượng PvP',nf(3000*k)+' Đá / 90 giây'],['Sản lượng Level',nf(2000*k)+' Đá / 90 giây'],['Cộng vào','Phần thưởng PvP và phần thưởng Level']],'Khi được trang bị trong trận: chuyển 3000 Đá mỗi 90 giây ở PvP, 2000 Đá mỗi 90 giây ở Level; tổng sản lượng cộng vào phần thưởng trận.');
upd('pr6',(l,k)=>[['Chu kỳ','Mỗi 1 phút, tỷ lệ 20%'],['Phần thưởng (ngẫu nhiên 1 trong 4)',nf(4000*k)+' Đá · '+fmt(5*k)+' Sao · +1 cấp thuyền trưởng · +1 cấp tàu'],['Đối tượng nâng cấp','Thuyền trưởng / tàu đồng minh bất kỳ']],'Mỗi 1 phút có 20% tỷ lệ nhận 4000 Đá, hoặc 5 Sao, hoặc +1 cấp một thuyền trưởng đồng minh bất kỳ, hoặc +1 cấp một tàu đồng minh bất kỳ.');
upd('pr7',(l,k)=>[['Điều kiện','Mỗi 20 mục tiêu bị phá hủy'],['Phần thưởng',nf(5000*k)+' Đá hoặc '+fmt(20*k)+' Sao'],['Tỷ lệ','50% mỗi loại, không nhận cả hai']],'Cứ 20 mục tiêu bị phá hủy, lò nung tạo ra 5000 Đá hoặc 20 Sao (mỗi loại 50%, không nhận cùng lúc cả hai).');
upd('pr8',(l,k)=>[['Điều kiện','Mỗi 15 đồng minh trong 12 ô bị tiêu diệt'],['Boss robot: máu',nf(1000*k)],['Sát thương mỗi đòn',nf(80*k)],['Tốc độ đánh','0,5 giây / đòn'],['Thời gian tồn tại','15 giây (mất khi lò bị phá hủy)']],'Cứ 15 đồng minh trong 12 ô bị tiêu diệt sẽ tạo 1 boss robot 1000 máu, 80 sát thương mỗi đòn, 0,5 giây / đòn, tồn tại 15 giây và biến mất nếu lò bị phá hủy.');
upd('pr9',(l,k)=>[['Tụ lực','20 giây'],['Đối tượng','1 tàu đồng minh trong 5 ô'],['Đạn quỷ tím: sát thương thêm',nf(500*k)],['Kết liễu','30% kết liễu mục tiêu (trừ boss)']],'Sau 20 giây tụ lực, ban cho 1 tàu đồng minh trong 5 ô một đòn đạn quỷ tím: đòn đánh kế tiếp gây thêm 500 sát thương, kèm tỷ lệ kết liễu đối thủ.');
upd('pr10',(l,k)=>[['Điều kiện','Mỗi 15 đồng minh tử vong'],['Hiệu ứng','Hồi sinh 1 đồng minh + '+nf(300*k)+' giáp'],['Ưu tiên','Đồng minh có thời gian hồi sinh lâu nhất']],'Khi 15 đồng minh tử vong sẽ hồi sinh 1 đồng minh bất kỳ và cho 300 giáp, ưu tiên đồng minh có thời gian hồi sinh lâu nhất.');
upd('df1',(l,k)=>[['Sát thương',nf(29*k)],['Tầm bắn','7 ô'],['Tốc độ bắn','2 phát / giây'],['Đạn','Viên đạn xanh tròn 1/4 ô'],['Mũi tháp','Xoay 360°']],'Tháp súng xoay mũi 360°, bắn viên đạn xanh tròn 1/4 ô gây 29 sát thương, 2 phát mỗi giây.');
upd('df2',(l,k)=>[['Sát thương mỗi viên',nf(30*k)],['Số viên mỗi lần','2'],['Tầm bắn','8 ô'],['Tốc độ bắn','1,6 phát / giây'],['Mũi pháo','Xoay 360°']],'Bắn hai viên đạn nổ cam vào mục tiêu trong 8 ô, 1,6 phát mỗi giây, mỗi viên 30 sát thương, xoay mũi 360°.');
upd('df3',(l,k)=>[['Sát thương',nf(11*k)],['Tốc độ bắn','6 phát / giây'],['Tầm bắn','6,5 ô'],['Nòng','Quay nòng gatling mỗi phát bắn'],['Mũi súng','Xoay 360°']],'Súng gatling quay nòng mỗi phát bắn, 6 phát mỗi giây, xoay 360°.');
upd('df4',(l,k)=>[['Sát thương',nf(300*k)],['Bán kính nổ','3 ô'],['Tốc độ bắn','1 tên lửa / 4 giây'],['Tầm bắn','12 ô']],'4 giây phóng 1 tên lửa lớn giống tên lửa của công trình, gây 300 sát thương và nổ lan 3 ô.');
upd('df5',(l,k)=>[['Mỗi 350 sát thương nhận vào','Phóng sóng năng lượng bán kính 8 ô'],['Giáp cho đồng minh trong sóng',nf(200*k)+' (10 giây)'],['Choáng kẻ địch trong sóng','0,25 giây'],['Giảm sát thương công trình lân cận',Math.min(60,Math.round(18*(1+.08*(l-1))*10)/10)+'% (4,5 ô)']],'Máu 3000. Mỗi khi chịu 350 sát thương từ mọi nguồn, phóng sóng năng lượng 8 ô: cho đồng minh trong phạm vi 200 giáp trong 10 giây và làm choáng kẻ địch trong phạm vi 0,25 giây.');
upd('df6',(l,k)=>[['Tầm đánh chặn','8 ô'],['Tốc độ đánh chặn','4 tên lửa / giây'],['Mục tiêu','Tên lửa của kẻ địch']],'Mỗi tên lửa địch bay vào trong 8 ô sẽ bị tháp phá hủy ngay, tối đa 4 tên lửa mỗi giây.');
upd('df7',(l,k)=>[['Sát thương trực tiếp',nf(800*k)],['Sát thương lan',nf(400*k)],['Bán kính nổ','3 ô'],['Tầm bắn','12 ô'],['Nòng','Xoay 360°']],'Siêu pháo xoay 360°, mỗi viên đạn gây 800 sát thương lên mục tiêu và 400 sát thương lan, tầm bắn 12 ô.');
upd('df8',(l,k)=>[['Sát thương mỗi tên lửa',nf(50*k)],['Số tên lửa mỗi lần','3'],['Tốc độ bắn','0,7 giây / lần'],['Tầm bắn','9 ô'],['Giàn','Xoay 360°']],'Xoay 360°, phóng 3 tên lửa nhỏ cùng lúc, mỗi tên lửa 50 sát thương, 0,7 giây một lần.');
upd('df9',(l,k)=>[['Chu kỳ','Mỗi 10 giây ngẫu nhiên 1 hiệu ứng'],['30%','Drone tấn công'],['10%','Drone hồi phục'],['20%','+300 Đá và +1 Sao'],['10%','Drone cảm tử'],['20%','Hồi sinh 1 tàu trong 10 ô với 30% máu'],['10%','+200 máu tối đa cho pháo đài'],['Drone','200 máu · 10 sát thương']],'Mỗi 10 giây ngẫu nhiên: 30% drone tấn công, 10% drone hồi phục, 20% nhận 300 Đá + 1 Sao, 10% drone cảm tử, 20% hồi sinh 1 tàu phe ta trong 10 ô với 30% máu, 10% +200 máu tối đa cho bản thân. Drone có 200 máu, 10 sát thương.');
upd('df10',(l,k)=>[['Sát thương mỗi nòng',nf(150*k)],['Tầm bắn','14 ô'],['Kết liễu','Mục tiêu dưới 2% máu'],['Nổ khi kết liễu','70 sát thương lan 3 ô'],['Hướng bắn','4 nòng chéo, chỉ trúng mục tiêu nằm trên nòng']],'Chỉ bắn được từ mũi 4 nòng: mục tiêu nằm ngoài nòng không nhận sát thương. Mỗi nòng 150 sát thương, kết liễu mục tiêu dưới 2% máu; mục tiêu bị kết liễu phát nổ 3 ô gây 70 sát thương lan.');
upd('kn1',(l,k)=>[['Sát thương',nf(26*k)],['Tầm bắn','8 ô'],['Hướng bắn','Chỉ bắn thẳng, không xoay nòng']],'Chỉ bắn được mục tiêu nằm trong tầm thẳng, không thể xoay nòng.');
upd('kn2',(l,k)=>[['Sát thương mỗi viên',nf(24*k)],['Số viên mỗi lần','2 viên cùng lúc'],['Tầm bắn','9,5 ô'],['Hướng bắn','Chỉ bắn thẳng, không xoay mũi']],'Bắn 2 viên đạn cùng lúc, chỉ bắn thẳng về phía trước, không thể xoay mũi.');
upd('kn3',(l,k)=>[['Tên lửa nhỏ','12 tên lửa / giây'],['Sát thương mỗi tên lửa',nf(20*k)],['Tầm bắn','6 ô']],'Bắn 12 tên lửa nhỏ mỗi giây trong tầm 6 ô, mỗi tên lửa gây 20 sát thương.');
upd('kn4',(l,k)=>[['Sát thương mỗi viên',nf(70*k)],['Tỷ lệ bắn 3 viên cùng lúc','80%'],['Tầm bắn','9 ô'],['Hướng bắn','Chỉ bắn chéo, không xoay nòng']],'Chỉ bắn ở tầm chéo, không xoay nòng; 80% bắn ra 3 viên đạn cùng lúc, mỗi viên 70 sát thương.');
upd('kn5',(l,k)=>[['Sát thương',nf(290*k)],['Tầm bắn','10 ô'],['Tốc độ bắn',(1/1.6).toFixed(1)+' phát/giây']],'Pháo bắn mảnh văng bốn hướng, tăng sát thương từ 120 lên 290.');

/* ---------- ảnh: boss robot + kết cấu ---------- */
const tex=(w,h,fn)=>{try{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const u=c.toDataURL();dimg(u);return u}catch(e){return null}};
const RBIMG=tex(150,170,(q,w,h)=>{
  q.translate(w/2,0);q.lineJoin='round';
  q.fillStyle='rgba(0,0,0,.35)';q.beginPath();q.ellipse(0,104,58,60,0,0,7);q.fill();
  [-1,1].forEach(sg=>{q.fillStyle='#1a2133';RR(q,sg*46-15,96,30,66,9);q.fill();q.strokeStyle='#5a6a96';q.lineWidth=2;q.stroke();q.fillStyle='#32405f';for(let y=102;y<158;y+=10)q.fillRect(sg*46-12,y,24,4.5)});
  q.fillStyle='#26304c';RR(q,-34,84,68,34,10);q.fill();q.strokeStyle='#6b7cab';q.lineWidth=2;q.stroke();
  [-1,1].forEach(sg=>{const g=q.createLinearGradient(sg*62,0,sg*30,0);g.addColorStop(0,'#2a3558');g.addColorStop(1,'#5a6a9a');q.fillStyle=g;q.beginPath();q.arc(sg*54,62,24,0,7);q.fill();q.strokeStyle='#ff9d3a';q.lineWidth=3;q.stroke();
    q.fillStyle='#ff9d3a';q.beginPath();q.arc(sg*54,62,7,0,7);q.fill();
    q.fillStyle='#202a45';RR(q,sg*54-9,6,18,56,6);q.fill();q.strokeStyle='#8ea0d0';q.lineWidth=2;q.stroke();
    q.fillStyle='#0f1730';RR(q,sg*54-5,0,10,16,4);q.fill();q.shadowColor='#5fd8ff';q.shadowBlur=10;q.fillStyle='#8fe8ff';q.beginPath();q.arc(sg*54,2,4.5,0,7);q.fill();q.shadowBlur=0});
  const tg=q.createLinearGradient(0,40,0,112);tg.addColorStop(0,'#5d6fa3');tg.addColorStop(1,'#26304c');
  q.fillStyle=tg;q.beginPath();q.moveTo(-26,44);q.lineTo(26,44);q.lineTo(42,66);q.lineTo(36,104);q.lineTo(-36,104);q.lineTo(-42,66);q.closePath();q.fill();q.strokeStyle='#9fb0e0';q.lineWidth=2.5;q.stroke();
  q.strokeStyle='#ff9d3a';q.lineWidth=3;q.beginPath();q.moveTo(-30,56);q.lineTo(30,56);q.moveTo(-34,90);q.lineTo(34,90);q.stroke();
  q.shadowColor='#ff8a2a';q.shadowBlur=16;const cg=q.createRadialGradient(0,76,1,0,76,15);cg.addColorStop(0,'#fff3c0');cg.addColorStop(.5,'#ffb03a');cg.addColorStop(1,'#d8561a');q.fillStyle=cg;q.beginPath();q.arc(0,76,13,0,7);q.fill();q.shadowBlur=0;
  const hg=q.createLinearGradient(0,18,0,50);hg.addColorStop(0,'#7e8fc4');hg.addColorStop(1,'#33405f');q.fillStyle=hg;q.beginPath();q.moveTo(-18,48);q.lineTo(-14,24);q.quadraticCurveTo(0,14,14,24);q.lineTo(18,48);q.closePath();q.fill();q.strokeStyle='#b8c6f0';q.lineWidth=2;q.stroke();
  q.shadowColor='#ff3a3a';q.shadowBlur=12;q.fillStyle='#ff5a5a';RR(q,-11,28,22,7,3);q.fill();q.shadowBlur=0;q.fillStyle='#fff';q.fillRect(-7,30,14,2)});
const RBSH={id:'c18rb',n:'Boss robot',img:RBIMG,W:150,H:170};
const DQIMG=tex(64,64,(q,w,h)=>{const g=q.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'#ffffff');g.addColorStop(.25,'#e0a8ff');g.addColorStop(.6,'#8a2be2');g.addColorStop(1,'rgba(60,0,110,0)');q.fillStyle=g;q.beginPath();q.arc(32,32,30,0,7);q.fill()});

/* ---------- tiện ích ---------- */
const ships=G=>{const L=[];if(G.pl&&!G.pl.dead)L.push(G.pl);(G.al||[]).forEach(a=>{if(!a.dead)L.push(a)});return L};
const enemies=G=>G.en.filter(e=>!e.dead&&e.spawn<=G.t);
const near=(G,x,y,R)=>{let t=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-x,e.y-y);if(q<=R+(e.size||2)*.3&&q<bd){bd=q;t=e}});return t};
const shVal=u=>{let v=0;const c=u.cs;if(c&&c.abs&&c.abs.t>0&&c.abs.v>0)v=c.abs.v;if(u.shd&&u.shd.t>0&&u.shd.v>0)v=Math.max(v,u.shd.v);return v};
const shSet=(G,u,v,dur)=>{if(u===G.pl&&!u.cs)u.cs={};if(u.cs){u.cs.abs={v,t:dur,max:v};u.cs.circ=true;u.cs.hexc=false}else u.shd={v,t:9999,max:v,c17:G.t+dur}};
const ping=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.45,max:t||.45,col});
const beam=(G,x1,y1,x2,y2,col,w,t)=>G.bm.push({x1,y1,x2,y2,t:t||.3,col,w:w||3});
const boomFx=(G,x,y,r)=>G.fx.push({x,y,r,t:.6,max:.6,ex:1,rot:Math.random()*6.28});
const pop=(G,x,y,txt,col)=>{const L=G.c18pop=G.c18pop||[];if(L.length>40)L.shift();L.push({x,y,t:0,max:1.8,txt,col:col||'#ffe08a'})};
const rw=G=>G.c18rw||(G.c18rw={da:0,sao:0,lv:[]});
const give=(G,b,da,sao)=>{const r=rw(G);r.da+=da;r.sao+=sao;b.c18da=(b.c18da||0)+da;b.c18sa=(b.c18sa||0)+sao};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0,t=a[i];a[i]=a[j];a[j]=t}return a};

/* ---------- Máy đào quặng mini / Giàn khoan tinh thể: Đá mỗi giây ---------- */
function mine(b,dt,G,key){const C=CFG[key],r=(G.pvp?C.pvp:C.lv)*LV(b)*dt;give(G,b,r,0);b.c18pa=(b.c18pa||0)+r;b.c18pt=(b.c18pt||0)+dt;
  if(b.c18pt>=2.5){pop(G,b.x,b.y-b.h*.5,'+'+nf(b.c18pa)+' Đá','#ffe08a');b.c18pa=0;b.c18pt=0}}
const pr1=(b,dt,G)=>mine(b,dt,G,'pr1'),pr2=(b,dt,G)=>mine(b,dt,G,'pr2');
/* ---------- Xưởng chưng cất nhiên liệu: Sao theo thời gian ---------- */
function pr3(b,dt,G){const per=G.pvp?CFG.pr3.pvp:CFG.pr3.lv;b.c18s=(b.c18s||0)+dt;b.c18per=per;
  if(b.c18s>=per){b.c18s-=per;const v=LV(b);give(G,b,0,v);pop(G,b.x,b.y-b.h*.5,'+'+fmt(v)+' Sao','#9fe8ff')}}
/* ---------- Máy chuyển quặng: Đá mỗi 90 giây ---------- */
function pr4(b,dt,G){const C=CFG.pr4;b.c18T=(b.c18T==null?C.every:b.c18T)-dt;if(b.c18T>0)return;b.c18T+=C.every;
  const v=(G.pvp?C.pvp:C.lv)*LV(b);give(G,b,v,0);b.c18at=G.t;pop(G,b.x,b.y-b.h*.5,'+'+nf(v)+' Đá','#ffe08a');ping(G,b.x,b.y,Math.max(b.w,b.h)*.8,'#ffd27a',.6)}
/* ---------- Trạm phân loại khoáng sản ---------- */
function pools(G){const caps=[],sh=[];
  if(G.c18sim)return {caps:['Kaito','Luna'],ships:['sim1','sim2'],sim:1};
  try{let mc=null;const m=flS().mc;if(m&&S.caps.includes(m))mc=m;
    const al=(G.al||[]).filter(a=>a.capn&&!a.ghost);
    if(!mc&&!al.length&&S.caps&&S.caps.length)mc=S.caps.slice().sort((a,b)=>clv(b)-clv(a))[0];
    if(mc)caps.push(mc);if(typeof dfShip!=='undefined'&&dfShip&&shAny(dfShip))sh.push(dfShip);
    al.forEach(a=>{caps.push(a.capn)});(G.al||[]).forEach(a=>{if(a.ghost||a.c17w||a.c18boss)return;if(a.sh&&a.sh.id&&shAny(a.sh.id))sh.push(a.sh.id)})}catch(e){}
  return {caps:[...new Set(caps)].filter(n=>clv(n)<100),ships:[...new Set(sh)].filter(id=>aLv(id)<GMAX)}}
function pr6(b,dt,G){const C=CFG.pr6;b.c18T=(b.c18T==null?C.every:b.c18T)-dt;if(b.c18T>0)return;b.c18T+=C.every;pr6roll(b,G,false)}
function pr6roll(b,G,force){const C=CFG.pr6;b.c18at=G.t;
  if(!force&&Math.random()>=C.p){b.c18miss=G.t;pop(G,b.x,b.y-b.h*.5,'Lần này không có quặng','#8fa6d8');return}
  const lvf=LV(b),P=pools(G),opts=shuffle(['da','sao','cap','ship']);
  for(const o of opts){
    if(o==='da'){const v=C.da*lvf;give(G,b,v,0);pop(G,b.x,b.y-b.h*.5,'+'+nf(v)+' Đá','#ffe08a');break}
    if(o==='sao'){const v=C.sao*lvf;give(G,b,0,v);pop(G,b.x,b.y-b.h*.5,'+'+fmt(v)+' Sao','#9fe8ff');break}
    if(o==='cap'&&P.caps.length){const n=P.caps[(Math.random()*P.caps.length)|0];
      if(!P.sim){S.clv=S.clv||{};S.clv[n]=Math.min(100,clv(n)+1);try{save()}catch(e){}}
      const t='Thuyền trưởng '+n+' +1 cấp';rw(G).lv.push(t);pop(G,b.x,b.y-b.h*.5,t,'#b6ffb0');try{if(!G.pv&&!G.c18sim)toast('Trạm phân loại: '+t+'!')}catch(e){}break}
    if(o==='ship'&&P.ships.length){const id=P.ships[(Math.random()*P.ships.length)|0];
      let nm='Tàu';try{const s0=shAny(id);if(s0)nm=s0.n}catch(e){}
      if(!P.sim){S.alv=S.alv||{};S.alv[id]=Math.min(GMAX,aLv(id)+1);try{save()}catch(e){}}
      const t=nm+' +1 cấp';rw(G).lv.push(t);pop(G,b.x,b.y-b.h*.5,t,'#b6ffb0');try{if(!G.pv&&!G.c18sim)toast('Trạm phân loại: '+t+'!')}catch(e){}break}}}
/* ---------- Lò nung hơi nước: 20 mục tiêu bị phá hủy → 5000 Đá hoặc 20 Sao ---------- */
function pr7(b,dt,G){const C=CFG.pr7,lvf=LV(b);while((b.k7||0)>=C.n){b.k7-=C.n;b.c18at=G.t;
  if(Math.random()<.5){const v=C.da*lvf;give(G,b,v,0);pop(G,b.x,b.y-b.h*.5,'+'+nf(v)+' Đá','#ffe08a')}else{const v=C.sao*lvf;give(G,b,0,v);pop(G,b.x,b.y-b.h*.5,'+'+fmt(v)+' Sao','#9fe8ff')}
  ping(G,b.x,b.y,Math.max(b.w,b.h)*.9,'#ffffff',.6)}}
/* ---------- Lò đúc robot: 15 đồng minh gục trong 12 ô → boss robot ---------- */
function mkBoss(b,G){const C=CFG.pr8,lvf=LV(b),sz=2.7,hp=C.hp*lvf,x=b.x,y=b.y+b.h/2+1.3;
  const a={team:'p',sh:RBSH,x,y,ang:-Math.PI/2,hp,max:hp,sp:C.sp,size:sz,sc:sz/Math.max(RBSH.W,RBSH.H),
    ws:[{sp:{k:'gun',sp:20,col:'#ff9d5c'},dmg:C.dmg*lvf,cd:C.cd,ec:0,t:.2,rng:C.rng,mx:0,my:0}],tx:x,ty:y,boss:false,dm:1,hit:0,dead:false,spawn:0,red:0,reg:0,dly:99,lh:-99,acc:0,sp0:C.sp,inf:true,nrg:0,nrgMax:0,nrgGen:0,
    engDrain:0,eOn:true,mdrain:0,mOn:true,sk:[],spT:{},ally:1,name:'Boss robot',sx:x,sy:y,c18boss:1,par:b,life:C.life,age:0};
  (G.al=G.al||[]).push(a);ping(G,x,y,2.6,'#ff9d3a',.7);ping(G,x,y,1.6,'#ffffff',.5);return a}
function pr8(b,dt,G){const C=CFG.pr8,a=b.c18b=(b.c18b||[]).filter(u=>!u.dead&&u.life>0);b.c18b=a;
  while((b.k8||0)>=C.n){if(a.length>=C.max){b.k8=C.n;break}b.k8-=C.n;a.push(mkBoss(b,G));b.c18at=G.t}}
/* ---------- Lò tinh luyện đạn quỷ ---------- */
function pr9(b,dt,G){const C=CFG.pr9;b.c18c=Math.min(C.charge,(b.c18c||0)+dt);
  if(b.c18c>=C.charge){let best=null,bd=1e9;ships(G).forEach(u=>{if(u.ghost||u.c18dq>0)return;const d=dist(u,b);if(d<=C.R&&d<bd){bd=d;best=u}});
    if(best){best.c18dq=1;best.c18dqb=b;b.c18c=0;b.c18g=G.t;b.c18tg=best;beam(G,b.x,b.y,best.x,best.y,'#c58bff',4,.6);ping(G,best.x,best.y,(best.size||2)*.9,'#b46cff',.6)}}}
function demon(G,u,src,tg){const b=u.c18dqb,C=CFG.pr9;u.c18dq=0;u.c18dqb=null;const lvf=LV(b&&b.lv?b:{lv:1}),dmg=C.dmg*lvf;
  mkP(G,{x:src.x,y:src.y,tx:tg.x,ty:tg.y,dmg,sp:C.sp,st:'demon',hr:.25,turn:6,tg,life:2.5,dq:1,kill:C.kill,tl:9});ping(G,src.x,src.y,.9,'#b46cff',.35)}
/* ---------- Kho tạo tàu: 15 đồng minh tử vong → hồi sinh 1 đồng minh + 300 giáp ---------- */
function pr10(b,dt,G){const C=CFG.pr10;if((b.k10||0)<C.n)return;
  const dead=(G.al||[]).filter(a=>a.dead&&a.capn&&!a.ghost&&!a.c17w&&!a.c18boss).sort((x,y)=>(x.c18dt||0)-(y.c18dt||0));
  let tg=dead[0]||null;if(!tg&&G.pl&&G.pl.dead)tg=G.pl;
  if(!tg){b.k10=C.n;return}
  b.k10-=C.n;b.c18at=G.t;const v=C.sh*LV(b),x=b.x,y=b.y+b.h/2+1.1;
  if(tg===G.pl){const P=tg;P.dead=false;P.hp=P.max;if(P.nrgMax)P.nrg=P.nrgMax;P.x=x;P.y=y;P.vx=0;P.vy=0;P.tx=x;P.ty=y;G.respawn=0;G.deaths=Math.max(0,(G.deaths||0)-1)}
  else{tg.dead=false;tg.hp=tg.max;tg.hit=0;tg.x=x+(Math.random()-.5)*1.4;tg.y=y;tg.sx=tg.x;tg.sy=tg.y;tg.tx=tg.x;tg.ty=tg.y;tg.c18d=0;tg.ws.forEach(w=>{w.t=0})}
  shSet(G,tg,v,C.dur);b.c18tg=tg;ping(G,tg.x,tg.y,2.2,'#7dffa0',.8);ping(G,tg.x,tg.y,1.4,'#ffffff',.6);beam(G,b.x,b.y,tg.x,tg.y,'#7dffa0',4,.6);
  pop(G,tg.x,tg.y-1.2,'Hồi sinh +'+nf(v)+' giáp','#7dffa0');try{if(!G.pv&&!G.c18sim)toast('Kho tạo tàu: hồi sinh '+(tg.name||'đồng minh')+'!')}catch(e){}}
/* ghi nhận tiêu diệt (đếm cho lò nung, lò đúc robot, kho tạo tàu) */
function death(G,u,ally){if(!G||!G.bl||!u||u.c18d||u.ghost||u.c18boss)return;u.c18d=1;if(ally)u.c18dt=G.t;
  G.bl.forEach(b=>{if(b.hp<=0||!b.nb||b.aux)return;const c=b.nb.c18;if(!c)return;
    if(c==='pr7'){if(!ally)b.k7=(b.k7||0)+1}
    else if(ally){if(c==='pr8'&&dist(b,u)<=CFG.pr8.R)b.k8=(b.k8||0)+1;else if(c==='pr10')b.k10=(b.k10||0)+1}})}

/* ---------- hệ đạn riêng (đạn tháp, tên lửa, đạn quỷ) ---------- */
function mkP(G,o){const l=Math.hypot((o.tx||0)-o.x,(o.ty||0)-o.y)||1,a=o.ang!=null?o.ang:Math.atan2(o.ty-o.y,o.tx-o.x);
  const p={x:o.x,y:o.y,vx:Math.cos(a)*o.sp,vy:Math.sin(a)*o.sp,dmg:o.dmg,sdmg:o.sdmg,spl:o.spl||0,hr:o.hr||0,life:o.life||(l/o.sp+.4),tg:o.tg||null,turn:o.turn||0,st:o.st,tr:[],tl:o.tl||5,dq:o.dq||0,kill:o.kill||0,age:0,seed:Math.random()*100};
  (G.c18p=G.c18p||[]).push(p);return p}
function boom(G,x,y,r,d,sd,hit){r*=(window.c17Spl?window.c17Spl(G):1);
  enemies(G).forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<r+(e.size||2)*.35)dfDmgS(e,e===hit?d:sd,false)});
  G.fx.push({x,y,r,t:.35,max:.35,col:'#ffd27a'});if(r>=1.2)boomFx(G,x,y,r*.85);else G.fx.push({x,y,r:Math.max(.4,r*.8),t:.3,max:.3,col:'#ffb066'})}
function impact(G,p,hit){
  if(p.dq&&hit){const kill=!hit.boss&&Math.random()<p.kill;if(kill){dfDmgS(hit,hit.hp+1,false);G.fx.push({x:hit.x,y:hit.y,r:(hit.size||2)*.8,t:.6,max:.6,col:'#b46cff'})}else dfDmgS(hit,p.dmg,false);
    ping(G,p.x,p.y,1.4,'#b46cff',.5);boomFx(G,p.x,p.y,1.1);return}
  if(p.spl>0){boom(G,p.x,p.y,p.spl,p.dmg,p.sdmg!=null?p.sdmg:p.dmg,hit);return}
  if(hit){dfDmgS(hit,p.dmg,false);G.fx.push({x:p.x,y:p.y,r:.35,t:.2,max:.2,col:p.st==='blue'?'#8fc8ff':p.st==='gauss'?'#9fe8ff':'#ffd27a'})}}
function projStep(G,dt){const L=G.c18p;if(!L||!L.length)return;const Wd=G.wd?G.wd.Wd:99,Hd=G.wd?G.wd.Hd:99,E=enemies(G);
  for(const p of L){if(p.dead)continue;
    if(p.tg&&!p.tg.dead&&p.turn){const a=Math.atan2(p.tg.y-p.y,p.tg.x-p.x),v=Math.hypot(p.vx,p.vy);let ca=Math.atan2(p.vy,p.vx),da=a-ca;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
      ca+=Math.max(-p.turn*dt,Math.min(p.turn*dt,da));p.vx=Math.cos(ca)*v;p.vy=Math.sin(ca)*v}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;p.age+=dt;
    if(p.tr){p.tr.push([p.x,p.y]);if(p.tr.length>p.tl)p.tr.shift()}
    let hit=null;for(const e of E){if(e.dead)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<(e.size||2)*.42+p.hr){hit=e;break}}
    if(hit||p.life<=0||p.x<-3||p.y<-3||p.x>Wd+3||p.y>Hd+3){p.dead=true;if(hit||(p.spl&&p.life<=0))impact(G,p,hit)}}
  G.c18p=L.filter(p=>!p.dead)}

/* ---------- tháp phòng thủ ---------- */
const dm=(b,G,d)=>d*LV(b)*(PB(G).dm||1);
const muz=(G,x,y,col)=>G.fx.push({x,y,r:.32,t:.1,max:.1,col:col||'#ffffff'});
const cdn=(b,dt,v)=>v+Math.max(b.cd,-dt);
function head(b,dt,G,C){const pb=PB(G);b.cd-=dt;const R=C.rng*(pb.rm||1),tg=near(G,b.x,b.y,R);if(tg)b.c18t=Math.atan2(tg.y-b.y,tg.x-b.x);
  if(b.cd>0||!tg)return null;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));return tg}
const lifeOf=(C,G,sp)=>(C.rng*(PB(G).rm||1)+1.2)/sp+.2;
function df1(b,dt,G){const C=CFG.df1,tg=head(b,dt,G,C);if(!tg)return;const a=b.c18t,x=b.x+Math.cos(a)*C.tip,y=b.y+Math.sin(a)*C.tip;
  mkP(G,{x,y,tx:tg.x,ty:tg.y,dmg:dm(b,G,C.dmg),sp:C.sp,st:'blue',hr:.05,life:lifeOf(C,G,C.sp)});muz(G,x,y,'#9fd0ff')}
function df2(b,dt,G){const C=CFG.df2,tg=head(b,dt,G,C);if(!tg)return;const a=b.c18t,cx=Math.cos(a),sy=Math.sin(a);
  [-1,1].forEach(sg=>{const x=b.x+cx*C.tip-sy*sg*C.side,y=b.y+sy*C.tip+cx*sg*C.side;
    mkP(G,{x,y,tx:tg.x,ty:tg.y,dmg:dm(b,G,C.dmg),spl:C.spl,sp:C.sp,st:'orange',hr:.08,life:lifeOf(C,G,C.sp)});muz(G,x,y,'#ffb066')})}
function df3(b,dt,G){const C=CFG.df3,tg=head(b,dt,G,C);if(!tg)return;const a=b.c18t,d=Math.abs(C.ring)+.12,x=b.x+Math.cos(a)*d,y=b.y+Math.sin(a)*d;
  mkP(G,{x,y,tx:tg.x,ty:tg.y,dmg:dm(b,G,C.dmg),sp:C.sp,st:'tracer',hr:.05,life:lifeOf(C,G,C.sp)});b.c18sp=(b.c18sp||0)+Math.PI/3;b.c18fl=G.t;muz(G,x,y,'#fff2a8')}
function df4(b,dt,G){const C=CFG.df4,tg=head(b,dt,G,C);if(!tg)return;const a=b.c18t,x=b.x+Math.cos(a)*C.tip,y=b.y+Math.sin(a)*C.tip,R=C.rng*(PB(G).rm||1);
  mkP(G,{x,y,tx:tg.x,ty:tg.y,dmg:dm(b,G,C.dmg),spl:C.spl,sp:C.sp,st:'bigmsl',hr:.18,turn:3,tg,life:(R+3)/C.sp+.6,tl:10});b.c18fl=G.t;
  G.fx.push({x,y,r:.9,t:.35,max:.35,col:'#cfd6e6'});muz(G,x,y,'#ffb066')}
function df7(b,dt,G){const C=CFG.df7,tg=head(b,dt,G,C);if(!tg)return;const a=b.c18t,x=b.x+Math.cos(a)*C.tip,y=b.y+Math.sin(a)*C.tip;
  mkP(G,{x,y,tx:tg.x,ty:tg.y,dmg:dm(b,G,C.dmg),sdmg:dm(b,G,C.sdmg),spl:C.spl,sp:C.sp,st:'shell',hr:.2,life:lifeOf(C,G,C.sp),tl:8});b.c18fl=G.t;
  G.fx.push({x,y,r:1.3,t:.3,max:.3,col:'#ffd27a'})}
function df8(b,dt,G){const C=CFG.df8,tg=head(b,dt,G,C);if(!tg)return;const a=b.c18t,cx=Math.cos(a),sy=Math.sin(a),R=C.rng*(PB(G).rm||1);
  C.xs.forEach(ox=>{const x=b.x+cx*C.tip-sy*ox,y=b.y+sy*C.tip+cx*ox;
    mkP(G,{x,y,tx:tg.x,ty:tg.y,dmg:dm(b,G,C.dmg),spl:C.spl,sp:C.sp,st:'smallmsl',hr:.1,turn:4.5,tg,life:(R+2)/C.sp+.5,tl:7});muz(G,x,y,'#ffd0b0')});b.c18fl=G.t}
/* đạn thẳng theo hướng nòng cố định: chỉ bắn mục tiêu nằm trong làn */
function lane(G,ox,oy,ax,ay,R,hw){let best=null,bd=1e9;enemies(G).forEach(e=>{const rx=e.x-ox,ry=e.y-oy,al=rx*ax+ry*ay;if(al<=0||al>R+(e.size||2)*.3)return;const pe=Math.abs(-rx*ay+ry*ax);
  if(pe<=hw+(e.size||2)*.42&&al<bd){bd=al;best=e}});return best}
function kn1(b,dt,G){const C=CFG.kn1,pb=PB(G),R=C.rng*(pb.rm||1),ox=b.x,oy=b.y-C.tip;b.cd-=dt;
  if(b.cd>0||!lane(G,ox,oy,0,-1,R,.05))return;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));
  mkP(G,{x:ox,y:oy,ang:-Math.PI/2,dmg:dm(b,G,C.dmg),sp:C.sp,st:'gauss',hr:.05,life:(R+.8)/C.sp});muz(G,ox,oy,'#9fe8ff');b.c18fl=G.t}
function kn2(b,dt,G){const C=CFG.kn2,pb=PB(G),R=C.rng*(pb.rm||1),oy=b.y-C.tip;b.cd-=dt;
  if(b.cd>0||!(lane(G,b.x-C.side,oy,0,-1,R,.05)||lane(G,b.x+C.side,oy,0,-1,R,.05)))return;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));
  [-1,1].forEach(sg=>{const ox=b.x+sg*C.side;mkP(G,{x:ox,y:oy,ang:-Math.PI/2,dmg:dm(b,G,C.dmg),sp:C.sp,st:'gauss',hr:.05,life:(R+.8)/C.sp});muz(G,ox,oy,'#9fe8ff')});b.c18fl=G.t}
function kn3(b,dt,G){const C=CFG.kn3,pb=PB(G),R=C.rng*(pb.rm||1),tg=near(G,b.x,b.y,R);b.cd-=dt;if(!tg){if(b.cd<0)b.cd=0;return}
  const per=(1/C.rate)*(G.c18rc||1)*(pb.cdm||1);let n=0;
  while(b.cd<=0&&n<4){b.cd+=per;n++;const i=(b.c18i=((b.c18i||0)+1)%4),px=(i&1?1:-1)*C.pod,py=(i&2?1:-1)*C.pod,x=b.x+px,y=b.y+py,a=Math.atan2(tg.y-y,tg.x-x)+(Math.random()-.5)*.5;
    mkP(G,{x,y,ang:a,dmg:dm(b,G,C.dmg),sp:C.sp,st:'smallmsl',hr:.08,turn:7,tg,sz:.7,life:(R+2)/C.sp+.4,tl:6});b.c18pod=i;b.c18fl=G.t}}
function kn4(b,dt,G){const C=CFG.kn4,pb=PB(G),R=C.rng*(pb.rm||1),ax=-Math.SQRT1_2,ay=-Math.SQRT1_2,nx=Math.SQRT1_2,ny=-Math.SQRT1_2,ox=b.x+ax*C.tip,oy=b.y+ay*C.tip,offs=[-C.off,0,C.off];b.cd-=dt;
  const has=offs.map(o=>!!lane(G,ox+nx*o,oy+ny*o,ax,ay,R,.07));if(b.cd>0||!has.some(h=>h))return;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));
  let use=[0,1,2];if(Math.random()>=C.p3){const ok=use.filter(i=>has[i]);use=[ok[(Math.random()*ok.length)|0]]}
  use.forEach(i=>{const x=ox+nx*offs[i],y=oy+ny*offs[i];mkP(G,{x,y,ang:Math.atan2(ay,ax),dmg:dm(b,G,C.dmg),sp:C.sp,st:'tri',hr:.08,life:(R+.8)/C.sp,tl:6});muz(G,x,y,'#ffb066')});b.c18fl=G.t;b.c18n=use.length}
/* Pháo plasma bốn phương: chỉ trúng mục tiêu nằm trên tia của 4 nòng chéo; kết liễu dưới 2% máu, nổ lan khi hạ gục */
const DIAG=[[1,-1],[1,1],[-1,1],[-1,-1]].map(d=>[d[0]*Math.SQRT1_2,d[1]*Math.SQRT1_2]);
function df10tips(b){const C=CFG.df10,tl=C.tip*b.w*Math.SQRT2;return DIAG.map(d=>({x:b.x+d[0]*tl,y:b.y+d[1]*tl,dx:d[0],dy:d[1]}))}
function df10(b,dt,G){const C=CFG.df10,pb=PB(G),R=C.rng*(pb.rm||1),T=df10tips(b);b.cd-=dt;if(b.cd>0)return;
  const lines=T.map(t=>{const L=[];enemies(G).forEach(e=>{const rx=e.x-t.x,ry=e.y-t.y,al=rx*t.dx+ry*t.dy;if(al<=0||al>R+(e.size||2)*.3)return;const pe=Math.abs(-rx*t.dy+ry*t.dx);if(pe<=.12+(e.size||2)*.42)L.push({e,al})});return L});
  if(!lines.some(L=>L.length))return;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));b.c18fl=G.t;b.c18lines=[];
  const d=dm(b,G,C.dmg),bd=dm(b,G,C.bdmg);
  lines.forEach((L,k)=>{if(!L.length){b.c18lines.push(null);return}const t=T[k];let far=0;
    L.sort((p,q)=>p.al-q.al).forEach(h=>{const e=h.e;if(e.dead)return;far=Math.max(far,h.al);const left=e.hp-d;
      if(left<=e.max*C.exe&&left>0)dfDmgS(e,e.hp+1,false);else dfDmgS(e,d,false);
      if(e.dead){const r=C.boom*(window.c17Spl?window.c17Spl(G):1);enemies(G).forEach(o=>{if(o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<r+(o.size||2)*.35)dfDmgS(o,bd,false)});
        G.fx.push({x:e.x,y:e.y,r,t:.4,max:.4,col:'#c58bff'});boomFx(G,e.x,e.y,r*.8)}
      G.fx.push({x:t.x+t.dx*h.al,y:t.y+t.dy*h.al,r:.45,t:.2,max:.2,col:'#d9b0ff'})});
    const len=Math.min(R,far+.6);G.bm.push({x1:t.x,y1:t.y,x2:t.x+t.dx*len,y2:t.y+t.dy*len,t:.2,col:'#c58bff',w:5});b.c18lines.push([t.x,t.y,t.x+t.dx*len,t.y+t.dy*len]);muz(G,t.x,t.y,'#e4c8ff')})}
/* Tháp khiên năng lượng: mỗi 350 sát thương nhận vào phóng sóng năng lượng */
function df5wave(b,G){const C=CFG.df5,v=C.sh*LV(b);b.c18w=G.t;b.c18wn=(b.c18wn||0)+1;
  ships(G).forEach(u=>{if(dist(u,b)<=C.R&&shVal(u)<v){shSet(G,u,v,C.dur);ping(G,u.x,u.y,(u.size||2)*.9,'#9fd8ff',.6)}});
  const bv=v/DFB;G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine'||o.aux||dist(o,b)>C.R)return;const ex=(o.shd&&o.shd.t>0&&o.shd.v>0)?o.shd:null;if(ex&&ex.v>=bv)return;o.shd={v:bv,t:C.dur,max:bv};o.shdC=1;o.shdAt=G.t});
  enemies(G).forEach(e=>{if(dist(e,b)<=C.R+(e.size||2)*.3){e.stun=Math.max(e.stun||0,C.stun*(e.boss?1/3:1));ping(G,e.x,e.y,(e.size||2)*.6,'#9fd8ff',.35)}});
  ping(G,b.x,b.y,2.5,'#bfeaff',.5)}
function df5(b,dt,G){const C=CFG.df5;
  const hpd=b.c18hp==null?0:Math.max(0,b.c18hp-b.hp)*DFB;b.c18hp=b.hp;
  let sd=0;if(b.shd&&b.shd.t>0){if(b.c18sv!=null)sd=Math.max(0,b.c18sv-b.shd.v)*DFB;b.c18sv=b.shd.v}else b.c18sv=null;
  b.c18a=(b.c18a||0)+hpd+sd;
  while(b.c18a>=C.every&&b.hp>0){b.c18a-=C.every;df5wave(b,G)}}
/* Tháp radar đánh chặn: phá hủy tên lửa địch trong 8 ô, 4 tên lửa / giây */
function df6(b,dt,G){const C=CFG.df6,R=C.R*(PB(G).rm||1);b.cd-=dt;b.c18sw=((b.c18sw||0)+dt*2.4)%(Math.PI*2);if(b.cd>0)return;
  let m=null,bd=1e9;G.pr.forEach(p=>{if(p.dead||p.team!=='e'||p.k!=='missile')return;const d=Math.hypot(p.x-b.x,p.y-b.y);if(d<=R&&d<bd){bd=d;m=p}});
  if(!m){b.cd=0;return}b.cd=cdn(b,dt,1/C.rate);m.dead=true;beam(G,b.x,b.y,m.x,m.y,'#8fe8ff',3,.22);G.fx.push({x:m.x,y:m.y,r:.75,t:.3,max:.3,col:'#ffd27a'});G.fx.push({x:m.x,y:m.y,r:.4,t:.2,max:.2,col:'#ffffff'});
  b.c18ic=(b.c18ic||0)+1;b.c18ia=G.t}
/* ---------- Pháo đài đa năng ---------- */
function droneRun(b,a,C,G,dt){const lvf=LV(b),pb=PB(G);
  a.forEach((d,i)=>{d.age+=dt;if(d.hf>0)d.hf-=dt;if(d.fl>0)d.fl-=dt;
    const au=window.c17Aura?window.c17Aura(G,d.x,d.y):null,sp=7*(au?au.sp:1);let mx=0,my=0;
    const orbit=()=>{d.a+=dt*1.2;const r=Math.max(b.w,b.h)/2+.9,tx=b.x+Math.cos(d.a+i*2.1)*r,ty=b.y+Math.sin(d.a+i*2.1)*r,dx=tx-d.x,dy=ty-d.y,l=Math.hypot(dx,dy)||1;
      if(l>.05){d.ang=Math.atan2(dy,dx);mx=dx/l*Math.min(sp*dt,l);my=dy/l*Math.min(sp*dt,l)}};
    const goto_=(tx,ty,keep)=>{const dx=tx-d.x,dy=ty-d.y,l=Math.hypot(dx,dy)||1;d.ang=Math.atan2(dy,dx);const m=Math.min(sp*dt,Math.max(0,l-keep));mx=dx/l*m;my=dy/l*m;return l};
    if(d.k==='a'){let tg=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-d.x,e.y-d.y);if(q<bd){bd=q;tg=e}});
      if(tg&&bd<=C.R*(pb.rm||1)+(tg.size||2)*.3){const want=Math.min(C.R-.6,3)+(tg.size||2)*.25;d.ang=Math.atan2(tg.y-d.y,tg.x-d.x);
        if(bd>want+.4){mx=(tg.x-d.x)/bd*Math.min(sp*dt,bd-want);my=(tg.y-d.y)/bd*Math.min(sp*dt,bd-want)}
        d.cd-=dt*(au?au.fr:1);if(d.cd<=0){d.cd=C.cd*(pb.cdm||1);d.fl=.08;dfFire({x:d.x,y:d.y,dm:pb.dm||1},{sp:{k:'gun',sp:17,col:'#9dffb0'},dmg:C.dmg*lvf,rng:C.R*(pb.rm||1)+1,col:'#9dffb0'},tg,'p')}}
      else if(tg&&Math.hypot(tg.x-b.x,tg.y-b.y)<=C.leash)goto_(tg.x,tg.y,2.8);else orbit()}
    else if(d.k==='h'){let tg=null,br=1.01;
      ships(G).forEach(u=>{if(u.hp<u.max&&dist(u,b)<=C.leash){const r=u.hp/u.max;if(r<br){br=r;tg=u}}});
      G.bl.forEach(o=>{if(o.hp>0&&o.hp<o.max&&!o.aux&&o.t!=='mine'&&dist(o,b)<=C.leash){const r=o.hp/o.max;if(r<br){br=r;tg=o}}});
      if(tg){const l=goto_(tg.x,tg.y,1.2);if(l<2.4){d.cd-=dt;if(d.cd<=0){d.cd=C.healCd;d.fl=.12;const v=C.heal*lvf;const isB=isBl(G,tg);tg.hp=Math.min(tg.max,tg.hp+(isB?v/DFB:v));beam(G,d.x,d.y,tg.x,tg.y,'#7dffa0',3,.3)}}}else orbit()}
    else{let tg=null,bd=1e9;enemies(G).forEach(e=>{if(Math.hypot(e.x-b.x,e.y-b.y)>C.leash)return;const q=Math.hypot(e.x-d.x,e.y-d.y);if(q<bd){bd=q;tg=e}});
      if(tg){goto_(tg.x,tg.y,0);const sp2=sp*1.35;const dx=tg.x-d.x,dy=tg.y-d.y,l=Math.hypot(dx,dy)||1;mx=dx/l*Math.min(sp2*dt,l);my=dy/l*Math.min(sp2*dt,l);
        if(l<=.9+(tg.size||2)*.3){d.dead=true;dfBlast(d.x,d.y,C.kamR,C.kam*lvf*(pb.dm||1),'p');G.fx.push({x:d.x,y:d.y,r:C.kamR,t:.4,max:.4,col:'#ff9a5c'})}}
      else orbit()}
    d.x+=mx;d.y+=my;d.rot=d.ang+Math.PI/2});
  if(window.c15BulletHit)window.c15BulletHit(G,a)}
const isBl=(G,u)=>G.bl.includes(u);
function addDrone(b,G,k){const C=CFG.df9,hp=C.hp*LV(b);b.c18d.push({k,x:b.x,y:b.y,a:Math.random()*6.28,ang:-Math.PI/2,rot:0,hp,hmax:hp,dead:false,hf:0,fl:0,cd:.3,age:0});ping(G,b.x,b.y,Math.max(b.w,b.h)*.5,k==='a'?'#9dffb0':k==='h'?'#7dffe0':'#ff9a5c',.45)}
function df9(b,dt,G){const C=CFG.df9,a=b.c18d=(b.c18d||[]).filter(d=>!d.dead&&d.hp>0);b.c18d=a;droneRun(b,a,C,G,dt);
  b.c18T=(b.c18T==null?C.every:b.c18T)-dt;if(b.c18T>0)return;b.c18T+=C.every;b.c18at=G.t;
  const W=[['a',30],['h',10],['loot',20],['k',10],['rev',20],['hp',10]],lvf=LV(b);
  const deadSh=()=>{const L=(G.al||[]).filter(u=>u.dead&&!u.ghost&&!u.c18boss&&(u.capn||u.c17w)&&dist(u,b)<=C.rev);if(G.pl&&G.pl.dead&&dist(G.pl,b)<=C.rev)L.push(G.pl);return L};
  let list=W.slice(),pick=null;
  while(list.length&&!pick){const tot=list.reduce((s,w)=>s+w[1],0);let r=Math.random()*tot,i=0;for(;i<list.length-1;i++){r-=list[i][1];if(r<0)break}
    const k=list[i][0];if((k==='a'||k==='h'||k==='k')&&a.length>=C.cap){list.splice(i,1);continue}if(k==='rev'&&!deadSh().length){list.splice(i,1);continue}pick=k}
  if(!pick)return;b.c18last=pick;
  if(pick==='a'||pick==='h'||pick==='k'){addDrone(b,G,pick);pop(G,b.x,b.y-b.h*.5,pick==='a'?'Drone tấn công':pick==='h'?'Drone hồi phục':'Drone cảm tử',pick==='a'?'#9dffb0':pick==='h'?'#7dffe0':'#ffb08a')}
  else if(pick==='loot'){give(G,b,C.da*lvf,C.sao*lvf);pop(G,b.x,b.y-b.h*.5,'+'+nf(C.da*lvf)+' Đá · +'+fmt(C.sao*lvf)+' Sao','#ffe08a')}
  else if(pick==='rev'){const L=deadSh(),u=L[(Math.random()*L.length)|0];
    if(u===G.pl){u.dead=false;u.hp=u.max*C.revHp;u.vx=0;u.vy=0;u.tx=u.x;u.ty=u.y;G.respawn=0;G.deaths=Math.max(0,(G.deaths||0)-1)}else{u.dead=false;u.hp=u.max*C.revHp;u.hit=0;u.c18d=0;if(u.ws)u.ws.forEach(w=>{w.t=0})}
    ping(G,u.x,u.y,2,'#7dffa0',.8);beam(G,b.x,b.y,u.x,u.y,'#7dffa0',4,.5);pop(G,u.x,u.y-1.2,'Hồi sinh 30% máu','#7dffa0')}
  else{const v=C.addHp*lvf/DFB;b.max+=v;b.hp+=v;b.c18hpAdd=(b.c18hpAdd||0)+C.addHp*lvf;ping(G,b.x,b.y,Math.max(b.w,b.h)*.8,'#ffe08a',.6);pop(G,b.x,b.y-b.h*.5,'+'+nf(C.addHp*lvf)+' máu tối đa','#ffe08a')}}
/* ---------- bảng điều khiển theo loại ---------- */
const TICK={pr1,pr2,pr3,pr4,pr6,pr7,pr8,pr9,pr10,df1,df2,df3,df4,df5,df6,df7,df8,df9,df10,kn1,kn2,kn3,kn4};
window.c18Tick=function(b,dt,G){const c=b.nb&&b.nb.c18;if(!c)return false;const f=TICK[c];if(f)f(b,dt,G);return true};

/* ---------- hiệu ứng toàn trận (dùng chung cho trận thật và mô phỏng) ---------- */
function pre(G,dt){
  projStep(G,dt);
  if(G.c18pop){G.c18pop.forEach(o=>o.t+=dt);G.c18pop=G.c18pop.filter(o=>o.t<o.max)}
  const al=G.al||[];
  for(let i=al.length-1;i>=0;i--){const a=al[i];if(!a.c18boss)continue;a.life-=dt;a.age=(a.age||0)+dt;
    if(a.life<=0||a.dead||!a.par||a.par.hp<=0){if(!a.dead)ping(G,a.x,a.y,2,'#ff9d3a',.6);a.dead=true;al.splice(i,1)}}
  if(!G.c18sim)[G.pl].concat(al).forEach(u=>{if(!u)return;if(u.dead){if(!u.c18d)death(G,u,true);if(u.c18dq)u.c18dq=0}else if(u.c18d)u.c18d=0})}
function global(G,dt){G.c18rc=G.bl.some(b=>b.t==='reactor'&&b.hp>0)?.9:1;pre(G,dt)}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.bl&&!G.done&&G.en)global(G,dt)}catch(e){console.error(e)}return r}}
{const _S=dfDmgS;dfDmgS=function(s,d,f){const G=DG,was=s&&s.dead,r=_S.apply(this,arguments);
  try{if(G&&G.bl&&s&&!was&&s.dead)death(G,s,s.team==='p'||s===G.pl)}catch(e){console.error(e)}return r}}
{const _A=dfDmgA;dfDmgA=function(a,d){const G=DG,was=a&&a.dead,r=_A.apply(this,arguments);try{if(G&&G.bl&&a&&!was&&a.dead)death(G,a,true)}catch(e){console.error(e)}return r}}
/* đạn quỷ: đòn bắn kế tiếp của tàu được ban kèm 1 viên đạn quỷ tím */
{const _F=dfFire;dfFire=function(src,wp,tg,team){const r=_F.apply(this,arguments);
  try{const u=src&&src.o;if(team==='p'&&u&&u.c18dq>0&&tg&&!u.dead&&DG&&DG.bl)demon(DG,u,src,tg)}catch(e){console.error(e)}return r}}
/* thưởng: cộng sản lượng vào phần thưởng Level / PvP */
function settle(G){if(!G||G.c18set||!G.c18rw)return null;G.c18set=1;const r=G.c18rw,da=Math.floor(r.da+1e-6),sao=Math.floor(r.sao+1e-6);
  if(da>0)S.da+=da;if(sao>0)S.sao+=sao;try{save()}catch(e){}
  const parts=[];if(da)parts.push('+'+nf(da)+' Đá');if(sao)parts.push('+'+nf(sao)+' Sao');
  let txt='';if(parts.length)txt='Khai thác trong trận: '+parts.join(', ')+'.';if(r.lv.length)txt+=(txt?' ':'')+'Nâng cấp: '+r.lv.join('; ')+'.';
  return {da,sao,txt}}
function pvTxt(r,win){try{if(r&&r.txt)setTimeout(()=>{const ok=document.getElementById('pvok');if(ok&&!document.getElementById('c18pvr'))ok.insertAdjacentHTML('beforebegin','<div id="c18pvr" style="margin:4px 0">'+r.txt+'</div>')},win?1100:1500)}catch(e){}}
{const _F=dfFinish;dfFinish=function(win){const G=DG;let r=null,pv=false;try{if(G&&G.bl&&!G.done){pv=!!G.pvp;r=settle(G)}}catch(e){console.error(e)}
  const o=_F.apply(this,arguments);
  if(pv)pvTxt(r,win);else try{if(r&&r.txt)setTimeout(()=>{const el=document.getElementById('rr');if(el)el.textContent+=' '+r.txt},win?1000:1400)}catch(e){}return o}}
{const _E=dfExit;dfExit=function(){const G=DG;let r=null;try{if(G&&G.bl&&G.pvp&&!G.done)r=settle(G)}catch(e){console.error(e)}
  const o=_E.apply(this,arguments);pvTxt(r,false);return o}}

/* ---------- xoay mũi tháp (chỉ các tháp xoay 360°); tháp cố định giữ nguyên hướng ---------- */
window.c18TRN=function(b,im,q,x,y,w,h){const k=b.nb&&b.nb.c18;if(!k||!ROT[k])return false;
  let ta=b.c18t;if(ta==null)ta=-Math.PI/2;if(b.c18ra==null)b.c18ra=ta;let df=ta-b.c18ra;df=Math.atan2(Math.sin(df),Math.cos(df));b.c18ra+=df*.22;
  const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;
  q.save();q.translate(x+w/2,y+h/2);q.rotate(b.c18ra+Math.PI/2);q.drawImage(im,-dw/2,-dh/2,dw,dh);q.restore();return true};

/* ---------- vẽ ---------- */
const lab=(q,x,y,t,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';q.strokeText(t,x,y);q.fillStyle=col||'#fff';q.fillText(t,x,y);q.restore()};
const dashRing=(q,x,y,r,col,w)=>{q.save();q.setLineDash([4,6]);q.strokeStyle=col;q.lineWidth=w||1.4;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
function drawProj(q,p,X,Y,s,T){const x=X(p.x),y=Y(p.y),a=Math.atan2(p.vy,p.vx);
  const trail=(col,w,al)=>{const n=p.tr.length;if(n<2)return;q.save();q.lineCap='round';for(let i=1;i<n;i++){q.globalAlpha=(i/n)*al;q.strokeStyle=col;q.lineWidth=Math.max(1,w*i/n);q.beginPath();q.moveTo(X(p.tr[i-1][0]),Y(p.tr[i-1][1]));q.lineTo(X(p.tr[i][0]),Y(p.tr[i][1]));q.stroke()}q.restore()};
  q.save();
  switch(p.st){
  case'blue':{const r=s*.125;q.shadowColor='#4aa8ff';q.shadowBlur=r*2.4;q.fillStyle='#2f86ff';q.beginPath();q.arc(x,y,r,0,7);q.fill();q.shadowBlur=0;q.fillStyle='#c4e2ff';q.beginPath();q.arc(x-r*.22,y-r*.22,r*.45,0,7);q.fill();break}
  case'orange':{trail('#ff9a3a',s*.16,.5);const r=s*.17,g=q.createRadialGradient(x,y,0,x,y,r*1.6);g.addColorStop(0,'#fff6d0');g.addColorStop(.4,'#ffa43a');g.addColorStop(1,'rgba(255,90,20,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.6,0,7);q.fill();q.fillStyle='#ff8a1e';q.beginPath();q.arc(x,y,r*.72,0,7);q.fill();q.fillStyle='#fff0b8';q.beginPath();q.arc(x-r*.15,y-r*.15,r*.3,0,7);q.fill();break}
  case'tracer':{q.translate(x,y);q.rotate(a);q.shadowColor='#ffd84a';q.shadowBlur=s*.15;q.fillStyle='#ffd84a';q.fillRect(-s*.3,-s*.035,s*.4,s*.07);q.shadowBlur=0;q.fillStyle='#fff';q.fillRect(-s*.08,-s*.018,s*.18,s*.036);break}
  case'bigmsl':{trail('#c8ccd8',s*.3,.4);q.translate(x,y);q.rotate(a);const L=s*1.0,W=s*.2,fl=1+.3*Math.sin(T*50+p.seed);
    q.globalCompositeOperation='lighter';const fg=q.createLinearGradient(-L*.5,0,-L*(.5+.8*fl),0);fg.addColorStop(0,'rgba(255,230,150,.95)');fg.addColorStop(.5,'rgba(255,130,30,.7)');fg.addColorStop(1,'rgba(255,60,0,0)');q.fillStyle=fg;q.beginPath();q.moveTo(-L*.5,-W*.32);q.lineTo(-L*(.5+.8*fl),0);q.lineTo(-L*.5,W*.32);q.fill();q.globalCompositeOperation='source-over';
    q.fillStyle='#8e96ab';q.beginPath();q.moveTo(-L*.5,W*.3);q.lineTo(-L*.72,W*.78);q.lineTo(-L*.3,W*.3);q.fill();q.beginPath();q.moveTo(-L*.5,-W*.3);q.lineTo(-L*.72,-W*.78);q.lineTo(-L*.3,-W*.3);q.fill();
    const bg=q.createLinearGradient(0,-W/2,0,W/2);bg.addColorStop(0,'#f4f6fb');bg.addColorStop(.5,'#c9cfdd');bg.addColorStop(1,'#7e869b');q.fillStyle=bg;q.fillRect(-L*.5,-W/2,L*.78,W);
    q.fillStyle='#6a728a';q.fillRect(-L*.1,-W/2,L*.05,W);
    const ng=q.createLinearGradient(0,-W/2,0,W/2);ng.addColorStop(0,'#ffd27a');ng.addColorStop(1,'#b8721a');q.fillStyle=ng;q.beginPath();q.moveTo(L*.28,-W/2);q.quadraticCurveTo(L*.45,-W*.3,L*.52,0);q.quadraticCurveTo(L*.45,W*.3,L*.28,W/2);q.closePath();q.fill();break}
  case'shell':{trail('#ff9d3a',s*.4,.5);const r=s*.27,g=q.createRadialGradient(x,y,0,x,y,r*1.9);g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#ffd27a');g.addColorStop(.65,'#ff7a1e');g.addColorStop(1,'rgba(255,60,0,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.9,0,7);q.fill();q.fillStyle='#3a2410';q.beginPath();q.arc(x,y,r*.55,0,7);q.fill();q.strokeStyle='#ffb04a';q.lineWidth=2;q.stroke();break}
  case'smallmsl':{trail('#d8dce8',s*.12,.35);q.translate(x,y);q.rotate(a);const k=p.sz||1,L=s*.42*k,W=s*.09*k,fl=1+.3*Math.sin(T*60+p.seed);
    q.globalCompositeOperation='lighter';q.fillStyle='rgba(255,150,50,.9)';q.beginPath();q.moveTo(-L*.5,-W*.4);q.lineTo(-L*(.5+.9*fl),0);q.lineTo(-L*.5,W*.4);q.fill();q.globalCompositeOperation='source-over';
    q.fillStyle='#cdd3e2';q.fillRect(-L*.5,-W/2,L*.8,W);q.fillStyle='#ff8a3a';q.beginPath();q.moveTo(L*.3,-W/2);q.lineTo(L*.5,0);q.lineTo(L*.3,W/2);q.fill();q.fillStyle='#8e96ab';q.fillRect(-L*.5,-W*.9,L*.18,W*1.8);break}
  case'gauss':{trail('#7fe8ff',s*.1,.5);q.translate(x,y);q.rotate(a);q.shadowColor='#5fd8ff';q.shadowBlur=s*.25;const g=q.createLinearGradient(-s*.4,0,s*.15,0);g.addColorStop(0,'rgba(80,200,255,0)');g.addColorStop(.7,'#7fe8ff');g.addColorStop(1,'#ffffff');q.fillStyle=g;q.beginPath();q.moveTo(s*.2,0);q.lineTo(-s*.4,-s*.05);q.lineTo(-s*.4,s*.05);q.fill();break}
  case'tri':{trail('#ff8a3a',s*.14,.5);q.translate(x,y);q.rotate(a);q.shadowColor='#ff8a3a';q.shadowBlur=s*.2;const g=q.createLinearGradient(-s*.34,0,s*.18,0);g.addColorStop(0,'rgba(255,120,40,0)');g.addColorStop(.6,'#ffb04a');g.addColorStop(1,'#fff2c0');q.fillStyle=g;q.beginPath();q.moveTo(s*.22,0);q.lineTo(-s*.34,-s*.07);q.lineTo(-s*.34,s*.07);q.fill();break}
  case'demon':{trail('#a050ff',s*.3,.55);const r=s*.3,g=q.createRadialGradient(x,y,0,x,y,r*1.8);g.addColorStop(0,'#ffffff');g.addColorStop(.25,'#e0a8ff');g.addColorStop(.6,'#8a2be2');g.addColorStop(1,'rgba(60,0,110,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.8,0,7);q.fill();
    q.fillStyle='#1a0830';q.beginPath();q.arc(x,y,r*.5,0,7);q.fill();q.fillStyle='#d9a0ff';for(let i=0;i<3;i++){const ph=T*10+i*2.09;q.beginPath();q.arc(x+Math.cos(ph)*r*.95,y+Math.sin(ph)*r*.95,r*.17,0,7);q.fill()}break}
  default:q.fillStyle='#fff';q.beginPath();q.arc(x,y,s*.1,0,7);q.fill()}
  q.restore()}
function drawGatling(q,b,X,Y,s,T){const a=b.c18ra!=null?b.c18ra:(b.c18t!=null?b.c18t:-Math.PI/2),C=CFG.df3,px=X(b.x+Math.cos(a)*C.ring*b.h),py=Y(b.y+Math.sin(a)*C.ring*b.h),R=.17*b.h*s;
  b.c18sd=(b.c18sd||0)+((b.c18sp||0)-(b.c18sd||0))*.35;const sd=b.c18sd;
  q.save();q.translate(px,py);const g=q.createRadialGradient(0,0,R*.2,0,0,R*1.25);g.addColorStop(0,'#0b1220');g.addColorStop(.7,'#1a2438');g.addColorStop(1,'#4c5a7a');q.fillStyle=g;q.beginPath();q.arc(0,0,R*1.15,0,7);q.fill();
  q.strokeStyle='#8fa0c4';q.lineWidth=Math.max(1,R*.14);q.beginPath();q.arc(0,0,R*1.15,0,7);q.stroke();
  for(let i=0;i<6;i++){const th=sd+i*Math.PI/3,bx=Math.cos(th)*R*.62,by=Math.sin(th)*R*.62;q.fillStyle='#d8e0f2';q.beginPath();q.arc(bx,by,R*.34,0,7);q.fill();q.fillStyle='#05080f';q.beginPath();q.arc(bx,by,R*.2,0,7);q.fill()}
  q.fillStyle='#5a6a8c';q.beginPath();q.arc(0,0,R*.2,0,7);q.fill();
  if(b.c18fl!=null&&(b.G18t-b.c18fl)<.08){q.globalCompositeOperation='lighter';const f=q.createRadialGradient(0,0,0,0,0,R*1.8);f.addColorStop(0,'rgba(255,240,170,.9)');f.addColorStop(1,'rgba(255,200,60,0)');q.fillStyle=f;q.beginPath();q.arc(0,0,R*1.8,0,7);q.fill()}
  q.restore()}
window.c18Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  G.bl.forEach(b=>{if(b.hp<=0)return;const c=b.nb&&b.nb.c18;if(!c)return;b.G18t=G.t;const px=X(b.x),py=Y(b.y),top=py-b.h*s*.62;
    if(c==='pr1'||c==='pr2'){
      for(let i=0;i<3;i++){const u=(T*.5+i/3)%1;q.save();q.globalCompositeOperation='lighter';q.globalAlpha=(1-u)*.8;q.fillStyle=c==='pr1'?'#ffe08a':'#9fe8ff';q.beginPath();q.arc(px+(hz(i+3)-.5)*b.w*s*.6,py-u*s*.9,s*.06,0,7);q.fill();q.restore()}
      if(b.c18da>0)lab(q,px,top,'Đã tạo '+nf(b.c18da)+' Đá','#ffe08a',10)}
    else if(c==='pr3'){lab(q,px,top,'Sao sau '+Math.max(0,Math.ceil((b.c18per||CFG.pr3.lv)-(b.c18s||0)))+'s','#9fe8ff',10)}
    else if(c==='pr4'){lab(q,px,top,'Chuyển quặng sau '+Math.max(0,Math.ceil(b.c18T==null?CFG.pr4.every:b.c18T))+'s','#ffe08a',10)}
    else if(c==='pr6'){lab(q,px,top,'Phân loại sau '+Math.max(0,Math.ceil(b.c18T==null?CFG.pr6.every:b.c18T))+'s','#bfe6ff',10);
      if(b.c18at!=null&&G.t-b.c18at<.8){const u=(G.t-b.c18at)/.8;q.save();q.strokeStyle='rgba(190,230,255,'+(1-u)+')';q.lineWidth=3;q.beginPath();q.arc(px,py,u*s*2.2,0,7);q.stroke();q.restore()}}
    else if(c==='pr7'){lab(q,px,top,'Mục tiêu bị phá hủy: '+(b.k7||0)+'/'+CFG.pr7.n,'#ffd0a0',10)}
    else if(c==='pr8'){dashRing(q,px,py,CFG.pr8.R*s,'rgba(255,150,60,.22)');lab(q,px,top,'Đồng minh gục: '+(b.k8||0)+'/'+CFG.pr8.n,'#ffb070',10)}
    else if(c==='pr9'){const C=CFG.pr9,f=Math.min(1,(b.c18c||0)/C.charge),r=s*(.15+.55*f);dashRing(q,px,py,C.R*s,'rgba(190,120,255,.26)');
      q.save();q.globalCompositeOperation='lighter';const g=q.createRadialGradient(px,py,0,px,py,r*1.7);g.addColorStop(0,'rgba(240,210,255,'+(.5+.5*f)+')');g.addColorStop(.45,'rgba(150,60,230,'+(.4+.4*f)+')');g.addColorStop(1,'rgba(80,0,160,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.7,0,7);q.fill();
      for(let i=0;i<3;i++){const th=T*3+i*2.09;q.fillStyle='rgba(230,190,255,.9)';q.beginPath();q.arc(px+Math.cos(th)*r*1.1,py+Math.sin(th)*r*1.1,s*.06,0,7);q.fill()}q.restore();
      lab(q,px,top,f>=1?'Chờ tàu trong 5 ô':'Tụ lực '+Math.ceil(C.charge-(b.c18c||0))+'s','#d9b0ff',10)}
    else if(c==='pr10'){lab(q,px,top,'Đồng minh gục: '+(b.k10||0)+'/'+CFG.pr10.n,'#9fffb8',10)}
    else if(c==='df3')drawGatling(q,b,X,Y,s,T);
    else if(c==='df5'){const C=CFG.df5;dashRing(q,px,py,C.R*s,'rgba(120,200,255,.2)');lab(q,px,top,'Sóng năng lượng: '+Math.floor(b.c18a||0)+'/'+C.every,'#9fd8ff',10);
      const u=b.c18w!=null?(G.t-b.c18w)/.8:2;if(u<1){q.save();q.globalCompositeOperation='lighter';const R=C.R*s*u,g=q.createRadialGradient(px,py,R*.7,px,py,R);g.addColorStop(0,'rgba(100,190,255,0)');g.addColorStop(1,'rgba(150,220,255,'+(.55*(1-u))+')');q.fillStyle=g;q.beginPath();q.arc(px,py,R,0,7);q.fill();
        q.strokeStyle='rgba(210,240,255,'+(1-u)+')';q.lineWidth=4*(1-u)+1.5;q.beginPath();q.arc(px,py,R,0,7);q.stroke();q.restore()}}
    else if(c==='df6'){const C=CFG.df6,R=C.R*s,a=b.c18sw||0;dashRing(q,px,py,R,'rgba(120,230,255,.25)');
      q.save();q.globalCompositeOperation='lighter';const g=q.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,'rgba(120,230,255,.28)');g.addColorStop(1,'rgba(120,230,255,0)');q.fillStyle=g;q.beginPath();q.moveTo(px,py);q.arc(px,py,R,a-.5,a);q.closePath();q.fill();
      q.strokeStyle='rgba(180,245,255,.7)';q.lineWidth=1.5;q.beginPath();q.moveTo(px,py);q.lineTo(px+Math.cos(a)*R,py+Math.sin(a)*R);q.stroke();q.restore();
      if(b.c18ic)lab(q,px,top,'Đã đánh chặn: '+b.c18ic,'#9fe8ff',10)}
    else if(c==='df9'){lab(q,px,top,'Chu kỳ sau '+Math.max(0,Math.ceil(b.c18T==null?CFG.df9.every:b.c18T))+'s','#ffe08a',10);
      (b.c18d||[]).forEach(d=>{if(d.dead)return;const dx=X(d.x),dy=Y(d.y),h=s*.72*Math.min(1,.35+d.age*1.2);const col=d.hf>0?'#ffffff':d.k==='a'?'#7dff9a':d.k==='h'?'#6ee7ff':'#ff7a5c';
        drnSpr(q,dx,dy,h,(d.ang!=null?d.ang:-Math.PI/2)+Math.PI/2,1,window.DRN5,col);
        if(d.k==='h'){q.save();q.fillStyle='#7dff9a';q.fillRect(dx-h*.08,dy-h*.22,h*.16,h*.44);q.fillRect(dx-h*.22,dy-h*.08,h*.44,h*.16);q.restore()}
        if(d.fl>0&&d.k==='a'){q.save();q.globalCompositeOperation='lighter';q.fillStyle='rgba(180,255,190,.9)';q.beginPath();q.arc(dx+Math.cos(d.ang)*h*.5,dy+Math.sin(d.ang)*h*.5,h*.14,0,7);q.fill();q.restore()}
        drnBar(q,dx,dy,h,d)})}
    else if(c==='df10'){const T4=df10tips(b);
      q.save();q.globalCompositeOperation='lighter';
      T4.forEach((t,i)=>{const tx=X(t.x),ty=Y(t.y),f=b.c18fl!=null?Math.max(0,1-(G.t-b.c18fl)/.25):0,r=s*(.2+.14*Math.sin(T*6+i)+.3*f);
        const g=q.createRadialGradient(tx,ty,0,tx,ty,r*1.8);g.addColorStop(0,'rgba(240,215,255,.95)');g.addColorStop(.4,'rgba(170,90,255,.7)');g.addColorStop(1,'rgba(90,20,200,0)');q.fillStyle=g;q.beginPath();q.arc(tx,ty,r*1.8,0,7);q.fill();
        q.strokeStyle='rgba(200,150,255,.13)';q.lineWidth=1.2;q.setLineDash([5,7]);q.beginPath();q.moveTo(tx,ty);q.lineTo(tx+t.dx*CFG.df10.rng*s,ty+t.dy*CFG.df10.rng*s);q.stroke();q.setLineDash([])});
      q.restore()}
    else if(c==='kn1'||c==='kn2'||c==='kn4'){const C=CFG[c];q.save();q.strokeStyle='rgba(150,225,255,.13)';q.lineWidth=1.2;q.setLineDash([5,7]);
      if(c==='kn4'){const ax=-Math.SQRT1_2,ay=ax,nx=Math.SQRT1_2,ny=-Math.SQRT1_2,ox=b.x+ax*C.tip,oy=b.y+ay*C.tip;[-C.off,0,C.off].forEach(o=>{q.beginPath();q.moveTo(X(ox+nx*o),Y(oy+ny*o));q.lineTo(X(ox+nx*o+ax*C.rng),Y(oy+ny*o+ay*C.rng));q.stroke()})}
      else{(c==='kn1'?[0]:[-C.side,C.side]).forEach(o=>{q.beginPath();q.moveTo(X(b.x+o),Y(b.y-C.tip));q.lineTo(X(b.x+o),Y(b.y-C.tip-C.rng));q.stroke()})}
      q.restore()}
    else if(c==='kn3'){if(b.c18fl!=null&&G.t-b.c18fl<.08){const i=b.c18pod||0,C=CFG.kn3;q.save();q.globalCompositeOperation='lighter';q.fillStyle='rgba(255,190,100,.85)';q.beginPath();q.arc(X(b.x+(i&1?1:-1)*C.pod),Y(b.y+(i&2?1:-1)*C.pod),s*.2,0,7);q.fill();q.restore()}}
    else if(c==='df4'||c==='df7'||c==='df8'||c==='df1'||c==='df2'){}
    if(c==='pr8'&&b.c18b)b.c18b.forEach(a=>{if(a.dead)return;const ax=X(a.x),ay=Y(a.y),u=Math.max(0,a.life/CFG.pr8.life);q.save();q.strokeStyle='rgba(255,150,50,.85)';q.lineWidth=2.5;q.beginPath();q.arc(ax,ay,a.size*s*.62,-Math.PI/2,-Math.PI/2+u*Math.PI*2);q.stroke();q.restore();
      lab(q,ax,ay-a.size*s*.72,'BOSS ROBOT '+Math.ceil(a.life)+'s','#ffb070',10)})});
  /* tàu mang đạn quỷ */
  const sh=[];if(G.pl&&!G.pl.dead)sh.push(G.pl);(G.al||[]).forEach(a=>{if(!a.dead)sh.push(a)});
  sh.forEach(u=>{if(!(u.c18dq>0))return;q.save();q.globalCompositeOperation='lighter';const r=(u.size||2)*s*.7,g=q.createRadialGradient(X(u.x),Y(u.y),r*.5,X(u.x),Y(u.y),r*1.3);g.addColorStop(0,'rgba(160,60,255,0)');g.addColorStop(1,'rgba(190,110,255,'+(.5+.25*Math.sin(T*8))+')');q.fillStyle=g;q.beginPath();q.arc(X(u.x),Y(u.y),r*1.3,0,7);q.fill();q.restore();lab(q,X(u.x),Y(u.y)-(u.size||2)*s*.8,'Đạn quỷ','#d9b0ff',10)});
  /* đạn */
  (G.c18p||[]).forEach(p=>{if(!p.dead)drawProj(q,p,X,Y,s,T)});
  /* nhãn nổi */
  (G.c18pop||[]).forEach(o=>{const u=o.t/o.max;q.save();q.globalAlpha=Math.min(1,(1-u)*2);lab(q,X(o.x),Y(o.y)-u*s*1.3,o.txt,o.col,11);q.restore()});
  /* tổng sản lượng trong trận thật */
  if(typeof dq!=='undefined'&&q===dq&&G===DG&&!G.pv&&G.c18rw&&(G.c18rw.da>=1||G.c18rw.sao>=1||G.c18rw.lv.length)&&typeof dfV!=='undefined'){const r=G.c18rw,t='Khai thác: +'+nf(r.da)+' Đá'+(r.sao>=1?' · +'+nf(r.sao)+' Sao':'')+(r.lv.length?' · '+r.lv.length+' nâng cấp':'');
    q.save();q.font='bold 12px sans-serif';const w=q.measureText(t).width+20,x=dfV.w/2-w/2,y=50;q.fillStyle='rgba(8,20,60,.78)';q.strokeStyle='#ffd45a';q.lineWidth=1.5;q.beginPath();RR(q,x,y,w,22,8);q.fill();q.stroke();q.fillStyle='#ffe9a0';q.textAlign='center';q.fillText(t,dfV.w/2,y+15);q.restore()}};
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{window.c18Draw(q,G,X,Y,s,T)}catch(e){console.error(e)}}}

/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở ---------- */
(function(){
const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;
const {mkBld,mkEn}=H;
const txt=(q,s,x,y,col,sz,al)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign=al||'center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
const ring=(q,x,y,r,col,w,dash)=>{q.save();q.strokeStyle=col;q.lineWidth=w||1.5;if(dash)q.setLineDash(dash);q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
const mkAl=(G,c,x,y,i,hp,o)=>{const a=Object.assign({team:'p',x,y,hx:x,hy:y,hp:hp||100,max:hp||100,size:1.5,sh:c.pool[(i||0)%c.pool.length],dead:false,hit:0,ang:-Math.PI/2,capn:'Kaito',ws:[]},o||{});(G.al=G.al||[]).push(a);return a};
const drawAl=(q,a,X,Y,s,alpha)=>{if(a.dead)return;const im=dimg(a.c18boss?RBIMG:a.sh.img);if(!im)return;const h=a.size*s*(a.c18boss?1.1:1),w=h*im.naturalWidth/im.naturalHeight;
  q.save();q.translate(X(a.x),Y(a.y));q.globalAlpha=alpha==null?1:alpha;q.rotate(a.c18boss?(a.ang==null?-Math.PI/2:a.ang)+Math.PI/2:0);q.drawImage(im,-w/2,-h/2,w,h);q.restore();
  if(a.max<1e8){const bw=a.size*s*.9,f=Math.max(0,a.hp/a.max);q.fillStyle='#000a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw,4);q.fillStyle='#6dff9a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw*f,4)}};
const shRing=(q,a,X,Y,s,T)=>{const v=shVal(a);if(!(v>0)||a.dead)return;q.save();q.strokeStyle='rgba(235,248,255,'+(.6+.25*Math.sin(T*8))+')';q.lineWidth=2.5;q.shadowColor='#fff';q.shadowBlur=10;q.beginPath();q.arc(X(a.x),Y(a.y),a.size*s*.66,0,7);q.stroke();q.restore()};
const expire=G=>{(G.al||[]).forEach(a=>{if(a.shd&&a.shd.c17&&G.t>a.shd.c17)a.shd=null});G.bl.forEach(b=>{if(b.shd&&b.shd.t>0){b.shd.t-=G.dtc||.02;if(b.shd.t<=0)b.shd=null}})};
const sway=(G,a,i,ax,ay)=>{a.x=a.hx+Math.sin(G.t*.8+i*1.7)*(ax==null?.45:ax);a.y=a.hy+Math.cos(G.t*.6+i)*(ay==null?.3:ay)};
const safe=o=>{['init','step','under','over'].forEach(k=>{const f=o[k];if(f)o[k]=function(){try{return f.apply(this,arguments)}catch(e){console.error('c18 sc',o.title,e)}}});return o};
const fl=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.5,max:t||.5,col});
const T0=(G,dt)=>{G.dtc=dt;pre(G,dt);expire(G)};
const solid=b=>{b.hp=b.max};
const mkE=(G,c,x,y,hp)=>{const e=mkEn(G,c,x,y,hp||1e9);e.noRev=true;e.hx=e.x;e.hy=e.y;return e};
const drift=(G,e,i,ax,ay,sp)=>{e.x=e.hx+Math.sin(G.t*(sp||.7)+i*2.1)*ax;e.y=e.hy+Math.cos(G.t*(sp||.7)*.8+i)*(ay||0)};
const WAT=(q,X,Y,G,c,s)=>txt(q,G.pvp?'Đang ở chế độ PvP':'Đang ở chế độ Level',X(7.5),Y(.9),G.pvp?'#ffb0a0':'#9fe8ff',11);
const modeSw=(G,c)=>{G.pvp=Math.floor(G.t/9)%2===1};
const initC=(G,c)=>{G.c18sim=1;G.pvp=false};
const mkDead=(G,e)=>{if(!e.dead)dfDmgS(e,e.hp+5,false)};

/* --- khai thác --- */
const MINE={pr1:['MÁY ĐÀO QUẶNG MINI','10 Đá/giây ở PvP · 5 Đá/giây ở Level (tự đổi chế độ mỗi 9 giây)',10,5],pr2:['GIÀN KHOAN TINH THỂ','12 Đá/giây ở PvP · 8 Đá/giây ở Level (tự đổi chế độ mỗi 9 giây)',12,8]};
['pr1','pr2'].forEach(k=>{const m=MINE[k];SC[k]=safe({title:m[0],note:m[1],
  init(G,c){initC(G,c);c.b=mkBld(G,k,7.5,5.6,{lv:c.lv});c.base=0},
  step(G,dt,c){modeSw(G,c);T0(G,dt);solid(c.b);TICK[k](c.b,dt,G)},
  over(q,G,c,X,Y,s){WAT(q,X,Y,G,c,s);const r=rw(G),rate=(G.pvp?m[2]:m[3])*(1+.1*((c.lv||1)-1));txt(q,'Đang tạo: '+fmt(rate)+' Đá / giây',X(7.5),Y(8.4),'#ffe08a',13);
    txt(q,'Tổng sản lượng cộng vào phần thưởng: '+nf(r.da)+' Đá',X(7.5),Y(9.4),'#bfe6ff',11)}})});
SC.pr3=safe({title:'XƯỞNG CHƯNG CẤT NHIÊN LIỆU',note:'1 Sao mỗi 60 giây ở PvP · 120 giây ở Level (xem nhanh ×15)',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr3',7.5,5.6,{lv:c.lv})},
  step(G,dt,c){G.pvp=Math.floor(G.t/10)%2===1;T0(G,dt);solid(c.b);pr3(c.b,dt*15,G)},
  over(q,G,c,X,Y,s){WAT(q,X,Y,G,c,s);const per=(G.pvp?60:120);txt(q,'Thực tế: 1 Sao / '+per+' giây',X(7.5),Y(8.4),'#9fe8ff',13);txt(q,'Tổng sản lượng cộng vào phần thưởng: '+fmt(rw(G).sao)+' Sao',X(7.5),Y(9.4),'#bfe6ff',11)}});
SC.pr4=safe({title:'MÁY TUYỂN QUẶNG',note:'3000 Đá mỗi 90 giây ở PvP · 2000 Đá ở Level (xem nhanh ×15)',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr4',7.5,5.6,{lv:c.lv})},
  step(G,dt,c){G.pvp=Math.floor(G.t/14)%2===1;T0(G,dt);solid(c.b);pr4(c.b,dt*15,G)},
  over(q,G,c,X,Y,s){WAT(q,X,Y,G,c,s);const v=(G.pvp?3000:2000)*(1+.1*((c.lv||1)-1));txt(q,'Mỗi 90 giây: +'+nf(v)+' Đá',X(7.5),Y(8.4),'#ffe08a',13);txt(q,'Tổng sản lượng cộng vào phần thưởng: '+nf(rw(G).da)+' Đá',X(7.5),Y(9.4),'#bfe6ff',11)}});
SC.pr6=safe({title:'TRẠM PHÂN LOẠI KHOÁNG SẢN',note:'Mỗi 1 phút, 20%: 4000 Đá / 5 Sao / +1 cấp thuyền trưởng / +1 cấp tàu (xem nhanh)',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr6',7.5,5.4,{lv:c.lv});c.t=1.5;c.n=0},
  step(G,dt,c){T0(G,dt);solid(c.b);c.t-=dt;if(c.t<=0){c.t=3.2;c.n++;c.b.c18T=60;pr6roll(c.b,G,c.n%5!==0)}},
  over(q,G,c,X,Y,s){txt(q,'Thực tế: mỗi 60 giây có 20% tỷ lệ nhận 1 trong 4',X(7.5),Y(8.6),'#bfe6ff',11);const r=rw(G);txt(q,nf(r.da)+' Đá · '+fmt(r.sao)+' Sao · '+r.lv.length+' lần nâng cấp',X(7.5),Y(9.5),'#ffe08a',12)}});
SC.pr7=safe({title:'LÒ NUNG HƠI NƯỚC',note:'Mỗi 20 mục tiêu bị phá hủy: 5000 Đá hoặc 20 Sao (50% mỗi loại)',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr7',7.5,6.2,{lv:c.lv});c.es=[0,1,2,3,4].map(i=>mkE(G,c,2.4+i*2.6,1.5+(i%2)*.8,40));c.t=0},
  step(G,dt,c){T0(G,dt);solid(c.b);c.t+=dt;if(c.t>.28){c.t=0;const e=c.es[(Math.random()*5)|0];if(!e.dead){dfDmgS(e,e.hp+5,false);boomFx(G,e.x,e.y,1)}}pr7(c.b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'Mục tiêu bị phá hủy: '+(c.b.k7||0)+'/20 · Đã nhận: '+nf(rw(G).da)+' Đá, '+fmt(rw(G).sao)+' Sao',X(7.5),Y(9.7),'#ffd0a0',11)}});
SC.pr8=safe({title:'LÒ ĐÚC ROBOT',note:'15 đồng minh trong 12 ô bị tiêu diệt: tạo boss robot 1000 máu, 80 sát thương / 0,5 giây, tồn tại 15 giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr8',7.5,6.4,{lv:c.lv});c.es=[mkE(G,c,4.6,2.2,1e9),mkE(G,c,10.8,2.0,1e9)];c.t=0;c.a=[];c.fc=0},
  step(G,dt,c){T0(G,dt);solid(c.b);const b=c.b;
    if(!(b.c18b&&b.c18b.length)){c.t+=dt;if(c.t>.2&&(b.k8||0)<15){c.t=0;const a=mkAl(G,c,2+Math.random()*11,8+Math.random()*1.5,(Math.random()*3)|0,10);a.size=1.1;a.dead=true;G.fx.push({x:a.x,y:a.y,r:1.1,t:.5,max:.5,ex:1,rot:1});b.k8=(b.k8||0)+1;G.al=G.al.filter(u=>!u.dead)}}
    pr8(b,dt,G);
    (b.c18b||[]).forEach((a,i)=>{const e=c.es[i%2];a.x+=(e.x-a.x)*Math.min(1,dt*.7);a.y+=(Math.max(e.y+2.2,3.2)-a.y)*Math.min(1,dt*.7);a.ang=Math.atan2(e.y-a.y,e.x-a.x);c.fc-=dt;if(c.fc<=0){c.fc=.5;mkP(G,{x:a.x,y:a.y,tx:e.x,ty:e.y,dmg:0,sp:16,st:'tri',life:.7})}});
    if(!(b.c18b&&b.c18b.length)&&b.c18bl)b.c18bl=0},
  over(q,G,c,X,Y,s){(G.al||[]).forEach(a=>{if(a.c18boss)drawAl(q,a,X,Y,s)});txt(q,'Đồng minh gục: '+Math.min(15,c.b.k8||0)+'/15 · Boss: '+((c.b.c18b||[]).length?'đang tồn tại':'chưa có'),X(7.5),Y(9.8),'#ffb070',11)}});
SC.pr9=safe({title:'LÒ TINH LUYỆN ĐẠN QUỶ',note:'Tụ lực 20 giây rồi ban cho 1 tàu trong 5 ô đòn đạn quỷ: +500 sát thương, có tỷ lệ kết liễu (xem nhanh ×5)',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr9',7.5,5.8,{lv:c.lv});c.a=[mkAl(G,c,4.4,5.2,0,300),mkAl(G,c,10.6,6.2,1,300),mkAl(G,c,13.8,1.8,2,300)];c.e=mkE(G,c,7.5,1.3,1e9);c.fc=[.3,.8,1.1];c.hits=0},
  step(G,dt,c){T0(G,dt);solid(c.b);c.a.forEach((a,i)=>{sway(G,a,i);a.size=1.5});pr9(c.b,dt*5,G);
    c.a.forEach((a,i)=>{c.fc[i]-=dt;if(c.fc[i]<=0){c.fc[i]=1.3;dfFire({x:a.x,y:a.y-.7,dm:1,o:a},{sp:{k:'gun',sp:14,col:'#9dffb0'},dmg:.02,rng:12,col:'#9dffb0'},c.e,'p')}});
    c.e.hp=c.e.max=1e9},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s)});txt(q,'Tàu có đạn quỷ: đòn bắn kế tiếp +500 sát thương, 30% kết liễu',X(7.5),Y(9.8),'#d9b0ff',11)}});
SC.pr10=safe({title:'KHO TẠO TÀU',note:'Khi 15 đồng minh tử vong: hồi sinh 1 đồng minh (ưu tiên hồi sinh lâu nhất) và cho 300 giáp',
  init(G,c){initC(G,c);c.b=mkBld(G,'pr10',7.5,5.6,{lv:c.lv});c.a=[mkAl(G,c,3.4,4.6,0,300),mkAl(G,c,12.2,4.4,1,300)];c.t=0;c.ph=0;c.a[0].dead=true;c.a[0].c18dt=0},
  step(G,dt,c){T0(G,dt);solid(c.b);const b=c.b;c.a.forEach((a,i)=>{if(!a.dead)sway(G,a,i)});
    if(c.ph===0){c.t+=dt;if(c.t>.22&&(b.k10||0)<15){c.t=0;b.k10=(b.k10||0)+1;G.fx.push({x:1.5+Math.random()*12,y:8.4,r:.9,t:.4,max:.4,ex:1,rot:2})}if((b.k10||0)>=15)c.ph=1}
    pr10(b,dt,G);if(c.ph===1&&!c.a[0].dead){c.ph=2;c.t=0}
    if(c.ph===2){c.t+=dt;if(c.t>4.5){c.ph=0;c.t=0;c.a[0].dead=true;c.a[0].c18dt=G.t;c.a[0].x=c.a[0].hx;c.a[0].y=c.a[0].hy}}},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t);if(a.dead)txt(q,'Đã gục',X(a.x),Y(a.y),'#ffb0a0',11)});txt(q,'Đồng minh tử vong: '+Math.min(15,c.b.k10||0)+'/15',X(7.5),Y(9.8),'#9fffb8',11)}});

/* --- tháp --- */
const TUR=(k,title,note,pos,esList,extra)=>{SC[k]=safe({title,note,
  init(G,c){initC(G,c);c.b=mkBld(G,k,pos[0],pos[1],{lv:c.lv});c.es=esList.map((p,i)=>mkE(G,c,p[0],p[1]));c.n=0;if(extra&&extra.init)extra.init(G,c)},
  step(G,dt,c){T0(G,dt);solid(c.b);c.es.forEach((e,i)=>{const p=esList[i];e.hx=p[0];e.hy=p[1];drift(G,e,i,p[2]||0,p[3]||0,p[4]);e.hp=e.max=1e9});TICK[k](c.b,dt,G);if(extra&&extra.step)extra.step(G,dt,c)},
  under(q,G,c,X,Y,s){if(extra&&extra.under)extra.under(q,G,c,X,Y,s)},
  over(q,G,c,X,Y,s){if(extra&&extra.over)extra.over(q,G,c,X,Y,s)}})};
TUR('df1','THÁP SÚNG PHÒNG THỦ','Xoay mũi 360°, bắn viên đạn xanh tròn 1/4 ô: 29 sát thương, 2 phát/giây',[7.5,6.4],[[3.2,2.2,1.4,.6],[12,1.8,1.6,.8],[7.5,.9,3,.4,.9]]);
TUR('df2','PHÁO ĐÔI CƯỜNG KÍCH','Xoay 360°, bắn hai viên đạn nổ cam: 30 sát thương mỗi viên, 1,6 phát/giây, tầm 8 ô',[7.5,6.3],[[3.4,2.4,1.4,.6],[12,2,1.6,.8]]);
TUR('df3','SÚNG GATLING HẠNG NẶNG','Quay nòng gatling mỗi phát bắn, 6 phát/giây, xoay 360°',[7.5,6.6],[[4.5,3.4,1.6,.6],[11,3,1.6,.8]]);
TUR('df4','BỆ PHÓNG TÊN LỬA HẠNG NẶNG','4 giây phóng 1 tên lửa lớn: 300 sát thương, nổ lan 3 ô, tầm 12 ô',[7.5,6.6],[[3.6,1.6,1.4,.4],[7.8,1.2,2.4,.4,1.1],[11.6,2,1.2,.4]]);
TUR('df7','SIÊU PHÁO HỦY DIỆT','Xoay 360°: 800 sát thương lên mục tiêu, 400 sát thương lan, tầm 12 ô',[7.5,7.2],[[3.6,1.6,1.4,.4],[7.8,1.2,2.4,.4,1.1],[11.6,2,1.2,.4]]);
TUR('df8','GIÀN TÊN LỬA MINI','Xoay 360°, phóng 3 tên lửa nhỏ cùng lúc: 50 sát thương mỗi tên lửa, 0,7 giây/lần',[7.5,6.4],[[3.6,2,1.4,.4],[7.8,1.2,2.2,.4,1],[11.6,2.6,1.2,.4]]);
TUR('df10','PHÁO PLASMA BỐN NÒNG','Chỉ bắn từ mũi 4 nòng chéo: 150 sát thương mỗi nòng, kết liễu dưới 2% máu, nổ lan 3 ô',[7.5,5.8],[[2.2,.9,.2,0,.6],[12.8,.9,.2,0,.6],[3.6,9.4,.2,0,.6],[11.4,9.4,.2,0,.6],[13,3.6,3,1.2,.5]],
  {init(G,c){c.es.forEach((e,i)=>{e.hpb=1e9});c.k=0},
   step(G,dt,c){c.es.forEach((e,i)=>{if(i<4){const t=df10tips(c.b)[i],L=4+((G.t*.8+i)%3)*2.2;e.x=t.x+t.dx*L;e.y=t.y+t.dy*L}});
     if(c.b.c18fl!=null&&G.t-c.b.c18fl<.02)c.k++}});
TUR('kn1','PHÁO GAUSS ĐƠN','Chỉ bắn mục tiêu nằm trong tầm thẳng phía trước, không thể xoay nòng',[7.5,7.4],[[7.5,1.4,3.6,0,.6],[3.4,3,.3,0],[11.8,3,.3,0]]);
TUR('kn2','PHÁO GAUSS ĐÔI','Bắn 2 viên đạn cùng lúc về phía trước, không thể xoay mũi',[7.5,7.2],[[7.5,1.4,3.6,0,.6],[3.2,3,.3,0],[11.8,3,.3,0]]);
TUR('kn3','DÀN TÊN LỬA NHỎ 4 NÒNG','Bắn 12 tên lửa nhỏ mỗi giây trong tầm 6 ô, mỗi tên lửa 20 sát thương',[7.5,6.4],[[4,2.6,1.5,.6],[11,2.4,1.6,.8]]);
TUR('kn4','PHÁO BA NÒNG XIÊN','Chỉ bắn ở tầm chéo (hướng trên-trái), không xoay nòng; 80% bắn 3 viên cùng lúc, mỗi viên 70 sát thương',[10.4,7.6],[[6.4,3.6,.7,.7,.6],[2.8,1.6,.5,.5,.4],[11.4,2.6,.5,0,.4]],
  {init(G,c){c.es.forEach(e=>{e.hpb=1e9})},
   step(G,dt,c){const e=c.es[0],b=c.b,u=(G.t*.35)%1;e.x=b.x-2.2-u*7;e.y=b.y-2.2-u*7+Math.sin(G.t*2.3)*(u<.5?.0:1.8)}});
SC.df5=safe({title:'THÁP KHIÊN NĂNG LƯỢNG',note:'Máu 3000; mỗi 350 sát thương nhận vào phóng sóng 8 ô: +200 giáp 10 giây cho đồng minh, choáng địch 0,25 giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'df5',7.5,6.2,{lv:c.lv});c.a=[mkAl(G,c,4.3,5.2,0,100),mkAl(G,c,11,4.5,1,100),mkAl(G,c,2.2,1.6,2,100)];c.es=[mkE(G,c,5,1.1),mkE(G,c,10.4,1.3),mkE(G,c,7.5,.8)];c.fc=[.3,.8,1.2]},
  step(G,dt,c){T0(G,dt);const b=c.b;c.a.forEach((a,i)=>{sway(G,a,i,.4,.3);a.hp=a.max});b.hp=b.max;
    c.es.forEach((e,i)=>{e.hp=e.max=1e9;c.fc[i]-=dt;if(c.fc[i]<=0){c.fc[i]=.7+i*.25;const l=Math.hypot(b.x-e.x,b.y-e.y)||1;G.pr.push({x:e.x,y:e.y+.4,vx:(b.x-e.x)/l*9,vy:(b.y-e.y)/l*9,dmg:3.4,team:'e',k:'shell',col:'#ff8a8a',spl:0,life:l/9+.4})}});
    b.hp=b.max;df5(b,dt,G)},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t);const v=shVal(a);if(v>0)txt(q,'+'+Math.round(v)+' giáp',X(a.x),Y(a.y)-a.size*s*.8,'#ffffff',10)});
    c.es.forEach(e=>{if(e.stun>0)txt(q,'choáng',X(e.x),Y(e.y)-e.size*s*.7,'#9fd8ff',10)});txt(q,'Sát thương đã nhận: '+Math.floor(c.b.c18a||0)+'/350 · Sóng đã phóng: '+(c.b.c18wn||0),X(7.5),Y(9.8),'#9fd8ff',11)}});
SC.df6=safe({title:'THÁP RADAR ĐÁNH CHẶN',note:'Phá hủy tên lửa địch bay vào trong 8 ô, tốc độ 4 tên lửa mỗi giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'df6',7.5,6.2,{lv:c.lv});c.t=mkBld(G,'cannon',3.2,6.4,{});c.es=[mkE(G,c,4,.8),mkE(G,c,11,.8),mkE(G,c,7.5,.6)];c.fc=[.2,.5,.9];c.n=0},
  step(G,dt,c){T0(G,dt);c.b.hp=c.b.max;c.t.hp=c.t.max;c.es.forEach((e,i)=>{e.hp=e.max=1e9;e.x=e.hx+Math.sin(G.t*.6+i*2)*1.2;c.fc[i]-=dt;if(c.fc[i]<=0){c.fc[i]=1.25+i*.15;const tg=i===1?c.b:i===0?c.t:c.b,l=Math.hypot(tg.x-e.x,tg.y-e.y)||1;
      G.pr.push({x:e.x,y:e.y+.5,vx:(tg.x-e.x)/l*4.6,vy:(tg.y-e.y)/l*4.6,dmg:5,team:'e',k:'missile',col:'#ff8a8a',spl:0,life:l/4.6+.5})}});df6(c.b,dt,G)},
  under(q,G,c,X,Y,s){ring(q,X(c.b.x),Y(c.b.y),8*s,'rgba(120,230,255,.3)',1.5,[5,6])},
  over(q,G,c,X,Y,s){G.pr.forEach(p=>{if(p.k!=='missile'||p.dead)return;const a=Math.atan2(p.vy,p.vx);q.save();q.translate(X(p.x),Y(p.y));q.rotate(a);q.fillStyle='#cfd6e6';q.fillRect(-s*.24,-s*.06,s*.46,s*.12);q.fillStyle='#ff7a5c';q.beginPath();q.moveTo(s*.22,-s*.06);q.lineTo(s*.34,0);q.lineTo(s*.22,s*.06);q.fill();q.restore()});
    txt(q,'Tên lửa địch bị phá hủy: '+(c.b.c18ic||0),X(7.5),Y(9.8),'#9fe8ff',11)}});
SC.df9=safe({title:'PHÁO ĐÀI ĐA NĂNG',note:'Mỗi 10 giây ngẫu nhiên: drone tấn công 30% · hồi phục 10% · 300 Đá + 1 Sao 20% · cảm tử 10% · hồi sinh tàu 20% · +200 máu tối đa 10% (xem nhanh)',
  init(G,c){initC(G,c);c.b=mkBld(G,'df9',7.5,6.3,{lv:c.lv});c.a=[mkAl(G,c,3.4,5,0,100),mkAl(G,c,12,5.2,1,100)];c.a[0].hp=c.a[0].max*.4;c.es=[mkE(G,c,4.2,1.3,300),mkE(G,c,11.5,1.5,300)];c.t=0;c.b.c18T=1.5},
  step(G,dt,c){T0(G,dt);const b=c.b;solid(b);c.a.forEach((a,i)=>{if(!a.dead)sway(G,a,i,.4,.3)});c.es.forEach((e,i)=>{if(e.hp<e.max*.5)e.hp=e.max;e.x=e.hx+Math.sin(G.t*.6+i)*1;e.y=e.hy});
    df9(b,dt,G);if(b.c18T>2.6)b.c18T=2.6;c.t+=dt;if(c.t>7){c.t=0;const a=c.a[(Math.random()*2)|0];if(!a.dead){a.dead=true;ex2(G,a.x,a.y)}}c.a.forEach(a=>{if(!a.dead&&a.hp<a.max*.4&&c.t<.1)a.hp=a.max*.4})},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);if(a.dead)txt(q,'đã gục',X(a.x),Y(a.y),'#ffb0a0',10)});txt(q,'Drone: '+((c.b.c18d||[]).length)+'/6 · Nhận: '+nf(rw(G).da)+' Đá, '+fmt(rw(G).sao)+' Sao',X(7.5),Y(9.8),'#ffe08a',11)}});
const ex2=(G,x,y)=>G.fx.push({x,y,r:1.2,t:.6,max:.6,ex:1,rot:1});
/* xuất để kiểm thử */
window.C18={C18T,CFG,TICK,tick:window.c18Tick,pre,projStep,death,df10tips,mkBoss,RBSH,pools,settle,pr6roll,demon,df5wave,lane,mkP,SC:Object.keys(SC).filter(k=>C18T.includes(k))};
})();
})();
