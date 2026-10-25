
/* ===== c34: 23 kỹ năng drone / khiên 3D mới · gỡ 4 kỹ năng ===== */
(function(){
if(typeof KI==='undefined'||typeof KP==='undefined'||!window.c26Plan||!window.c26Cast)return;
const DEL=['Tia Kháng Lam','Khiên Quỹ Đạo','Lăng Kính Chắn','Tổ Ong Vàng'];
const REN={'Bom Đỏ Rải':'Drone Ném Bom','Drone Trung Tâm':'Tụ Họp Thành Quỷ','Chùm Dịch Chuyển Lam':'Gọi Cứu Viện','Chiến Hạm Tốc Công':'Về Đây Với Ta','Bông Tuyết Sét':'Án Tử Drone','Mìn Đỏ Lan':'Mìn Lơ Lửng','Pháo Đài Lam':'Lồng Khóa Chết','Tấm Chắn Lam':'Tứ Khiên Xanh Chém Tử','Vòng Khiên Tím':'Hóa Vị Thần','Khiên Cầu Lửa':'Thánh Nhốt Tàu','Thành Lũy Lam':'Khiên Vị Thần','Vòng Vàng Phòng Thủ':'Vòng Xoáy Mở Lối'};
const ID={'Cánh Tay Cơ Khí':'arm','Chiến Đấu Cơ Cao Cấp':'ftr','Pháo Hoa Phóng':'sky','Bong Bóng Hành Tinh':'shd','Drone Ném Bom':'bmb','Kết Giới Hành Tinh':'col','Khóa Chính Xác Đỏ':'mk','Tụ Họp Thành Quỷ':'dem','Phi Đội Vàng':'gold','Gọi Cứu Viện':'res','Về Đây Với Ta':'vd','Bầy Xanh Lục':'heal','Án Tử Drone':'zap','Tháp Pháo Tự Động':'tur','Mìn Lơ Lửng':'mn','Phi Đội Tím':'pur','Lồng Khóa Chết':'cage','Tứ Khiên Xanh Chém Tử':'s4','Đĩa Kháng Cự':'disc','Hóa Vị Thần':'god','Thánh Nhốt Tàu':'frag','Khiên Vị Thần':'bsh','Vòng Xoáy Mở Lối':'ring'};
const CF={
 arm:{hp:800,life:8,len:7,thick:3,R:8,thr:8,dmg:500,cyc:3.6,cd:250},
 ftr:{n:6,hp:500,dmg:100,rof:1,life:12,rng:6,R:10,sp:8,cd:240},
 sky:{n:6,life:5,dmg:500,R:10,h:9,cd:250},
 shd:{n:6,hp:500,life:8,abs:600,gap:1.6,ahead:3,cd:250},
 bmb:{n:6,hp:500,R:12,dmg:120,rof:2,bombs:3,sp:7,blast:1.4,cd:280},
 col:{n:6,hp:400,life:8,rate:20,sp:8,cd:250},
 mk:{R:8,n:4,hp:400,dmg:80,rof:2,life:8,rng:5,sp:8,cd:250},
 dem:{R:15,n:10,hp:4000,dmg:500,rof:3,life:12,rng:7,sp:4,scale:12,cd:250},
 gold:{n:5,hp:400,life:7,sp:14,dot:400,dotT:5,rng:2.4,R:10,cd:250},
 res:{n:7,hp:500,dmg:200,rof:1,rng:6,life:10,cd:260},
 vd:{R:12,win:3,heal:.05,shd:200,cd:250},
 heal:{n:6,hp:500,life:20,amt:1000,R:8,sp:7,cd:250},
 zap:{R:10,cd:300},
 tur:{n:4,hp:500,dmg:50,rps:4,rng:8,life:8,cd:250},
 mn:{n:3,hp:500,R:8,maxT:8,drop:1,mLife:8,dmg:200,trig:1.1,blast:1.8,sp:5,cd:230},
 pur:{n:4,hp:600,dmg:12,rps:14,rng:7,R:10,life:10,sp:6,cd:250},
 cage:{n:5,hp:500,R:12,life:8,abs:3000,rad:2.6,cd:250},
 s4:{R:9,wait:1,dmg:200,hit:2,stay:5,abs:1400,cd:250},
 disc:{life:8,ahead:2.2,rad:1.7,k:.4,ang:Math.PI/4,cd:250},
 god:{beam:10,hp:2000,dmg:200,spd:.3,buff:30,cd:280},
 frag:{R:8,n:50,rate:20,slow:.02,stun:3,dmg:30,cd:250},
 bsh:{base:2000,lost:.8,cd:250},
 ring:{gap:14,life:12,rad:1.5,inv:1,cd:250}};
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
/* ---------- 1) gỡ 4 kỹ năng, đổi tên ---------- */
const PRICE={};
DEL.forEach(n=>{const i=KI.findIndex(k=>k[0]===n);if(i>=0){PRICE[n]=[+KI[i][3]||0,+KI[i][4]||0];KI.splice(i,1);KP.splice(i,1)}if(typeof KDEL!=='undefined')KDEL[n]=1});
Object.keys(REN).forEach(a=>{const k=KI.find(x=>x[0]===a);if(k)k[0]=REN[a]});
/* ---------- 2) mô tả mới ---------- */
const TX={
 arm:['Dựng một cánh tay robot 3D khổng lồ bên cạnh tàu trong 8 giây. Cánh tay vươn ra bốc 1 tàu địch trong 8 ô, nhấc bổng rồi ném văng ra xa 8 ô; tàu bị ném chịu 500 sát thương khi rơi xuống.',
  [['Thời gian','8 giây'],['Máu cánh tay','800'],['Chiều dài','Tối đa 7 ô · dày 3 ô'],['Tầm bốc','8 ô'],['Ném xa','8 ô'],['Sát thương','500 mỗi lần ném'],['Hồi chiêu','250 giây'],['Hiệu ứng','Triệu hồi'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 ftr:['Phóng 6 chiến đấu cơ 3D bay vòng quanh và tấn công kẻ địch trong phạm vi.',
  [['Số lượng','6 drone'],['Máu drone','500'],['Sát thương','100 mỗi đòn'],['Tốc độ đánh','1 đòn mỗi giây'],['Thời gian','12 giây'],['Hồi chiêu','240 giây'],['Hiệu ứng','Tạo drone'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 sky:['Gọi 6 drone từ trên cao chiếu tia laser cam xuống kẻ địch trong phạm vi, ưu tiên mục tiêu bị đánh dấu.',
  [['Số lượng','6 drone trên cao'],['Sát thương','Tối đa 500 mỗi tia trong 5 giây'],['Ưu tiên','Mục tiêu bị đánh dấu'],['Thời gian','5 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Laser từ trên cao'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 shd:['Tạo 6 drone dàn thành hàng ngang trước mũi tàu; mỗi drone dựng một tấm khiên xanh chắn đạn phía trước.',
  [['Số lượng','6 drone'],['Khiên','Chắn 600 sát thương mỗi tấm (phía trước)'],['Máu drone','500'],['Thời gian','8 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Khiên chắn hàng ngang'],['Mục tiêu','Bảo vệ tàu ta']]],
 bmb:['Tạo 6 drone đỏ ném bom bay tới kẻ địch trong 12 ô và thả bom xuống. Mỗi drone thả tối đa 3 quả rồi biến mất.',
  [['Số lượng','6 drone'],['Sát thương','120 mỗi quả bom (cộng dồn)'],['Số bom','3 quả mỗi drone'],['Tốc độ thả','1 quả mỗi 2 giây'],['Máu drone','500'],['Phạm vi','12 ô'],['Hồi chiêu','280 giây'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 col:['Tạo 6 drone bay tới xác tàu, công trình đổ nát hoặc đá để hút năng lượng, chuyển thành Đá cho người chơi.',
  [['Số lượng','6 drone'],['Thu thập','20 Đá mỗi giây mỗi drone'],['Thời gian','8 giây'],['Máu drone','400'],['Hồi chiêu','250 giây'],['Hiệu ứng','Thu thập tài nguyên'],['Mục tiêu','Xác tàu · công trình · đá']]],
 mk:['Đánh dấu đỏ ngẫu nhiên 1 kẻ địch trong 8 ô và tạo 4 drone tấn công ưu tiên mục tiêu bị đánh dấu. Mọi drone phe ta đều nhắm vào mục tiêu này.',
  [['Phạm vi','8 ô'],['Số lượng','4 drone'],['Máu drone','400'],['Sát thương','80 mỗi đòn'],['Tốc độ đánh','1 đòn mỗi 2 giây'],['Thời gian','8 giây'],['Hồi chiêu','250 giây'],['Mục tiêu','Kẻ địch bị đánh dấu']]],
 dem:['Gom 10 drone phe ta trong 15 ô (thiếu thì tàu tự phóng thêm) hợp thể thành một drone quỷ khổng lồ to gấp 12 lần drone thường.',
  [['Hợp thể','10 drone trong 15 ô'],['Kích thước','Gấp 12 lần drone thường'],['Máu','4.000'],['Sát thương','500 mỗi đòn'],['Tốc độ đánh','1 đòn mỗi 3 giây'],['Thời gian','12 giây'],['Hồi chiêu','250 giây'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 gold:['Tạo 5 drone vàng tốc độ 200% lao tới kẻ địch trong phạm vi và phun lửa thiêu đốt.',
  [['Số lượng','5 drone'],['Tốc độ','200%'],['Sát thương lửa','400 trong 5 giây'],['Máu drone','400'],['Thời gian','7 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Phun lửa'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 res:['Gọi 7 drone xanh cứu viện đáp thẳng từ trên trời xuống, bắn kẻ địch trong 6 ô.',
  [['Số lượng','7 drone'],['Máu drone','500'],['Sát thương','200 mỗi phát'],['Tốc độ bắn','1 phát mỗi giây'],['Phạm vi','6 ô'],['Thời gian','10 giây'],['Hồi chiêu','260 giây'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 vd:['Chỉ tàu boss dùng được. Tàu mở cửa bên hông, hút mọi drone trong 12 ô bay vào trong. Mỗi drone giúp tàu hồi 5% máu tối đa; khi đầy máu, mỗi drone thành 1 lớp khiên chặn 200 sát thương (cộng dồn).',
  [['Điều kiện','Chỉ tàu boss'],['Phạm vi hút','12 ô'],['Hồi máu','5% máu tối đa mỗi drone'],['Khi đầy máu','+200 khiên mỗi drone (cộng dồn)'],['Hồi chiêu','250 giây'],['Hiệu ứng','Hút drone'],['Mục tiêu','Drone trong phạm vi']]],
 heal:['Tạo 6 drone hồi phục bay tới hồi máu cho các tàu phe ta có lượng máu thấp nhất trong 8 ô.',
  [['Số lượng','6 drone'],['Hồi máu','1.000 mỗi drone trong 20 giây'],['Phạm vi','8 ô'],['Máu drone','500'],['Thời gian','20 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Hồi phục'],['Mục tiêu','Đồng minh máu thấp nhất']]],
 zap:['Phóng một vùng điện quanh tàu trong thoáng chốc, đường kính 20 ô, kết liễu toàn bộ drone của đối phương trong vùng.',
  [['Đường kính','20 ô'],['Hiệu quả','Kết liễu mọi drone đối phương'],['Hồi chiêu','300 giây'],['Hiệu ứng','Vùng điện tức thời'],['Mục tiêu','Drone trong phạm vi']]],
 tur:['Dựng 4 tháp pháo tự động quanh tàu, mỗi tháp bắn liên tục vào kẻ địch gần nhất trong 8 ô.',
  [['Số lượng','4 tháp pháo'],['Máu tháp','500'],['Sát thương','50 mỗi viên'],['Tốc độ bắn','4 viên mỗi giây'],['Phạm vi','8 ô'],['Thời gian','8 giây'],['Hồi chiêu','250 giây'],['Mục tiêu','Kẻ địch gần nhất']]],
 mn:['Tạo 3 drone bay qua tối đa 8 kẻ địch trong 8 ô; cứ mỗi giây drone thả 1 quả mìn lơ lửng. Mìn nổ khi kẻ địch tới gần.',
  [['Số lượng','3 drone'],['Mục tiêu','Tối đa 8 kẻ địch trong 8 ô'],['Thả mìn','1 quả mỗi giây'],['Mìn tồn tại','8 giây'],['Sát thương mìn','200'],['Máu drone','500'],['Hồi chiêu','230 giây'],['Hiệu ứng','Mìn lơ lửng']]],
 pur:['Triệu hồi 4 tàu chiến tím bắn xối xả vào kẻ địch trong phạm vi.',
  [['Số lượng','4 tàu chiến'],['Máu tàu','600'],['Sát thương','12 mỗi viên'],['Tốc độ bắn','14 viên mỗi giây'],['Thời gian','10 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Triệu hồi tàu chiến'],['Mục tiêu','Kẻ địch trong phạm vi']]],
 cage:['Tạo 5 drone lao tới 1 kẻ địch trong 12 ô, dựng vòng tròn năng lượng nhốt mục tiêu 8 giây. Vòng chặn 3.000 sát thương; mỗi drone bị hạ làm vòng mất 25% giá trị; tàu bên trong có thể bắn phá vòng.',
  [['Phạm vi','12 ô'],['Số lượng','5 drone (500 máu)'],['Vòng nhốt','Chặn 3.000 sát thương'],['Mỗi drone bị hạ','−25% giá trị vòng'],['Thời gian','8 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Nhốt mục tiêu'],['Mục tiêu','1 kẻ địch']]],
 s4:['Tạo 4 tấm khiên xanh trên đầu kẻ địch gần nhất trong 9 ô; sau 1 giây cả 4 tấm cùng đâm xuống xuyên qua mục tiêu rồi đứng lại thêm 5 giây làm tường chắn.',
  [['Phạm vi','9 ô'],['Sát thương','200 mỗi tấm khiên'],['Khiên','Chặn 1.400 sát thương mỗi tấm'],['Thời gian','1 giây rơi + 5 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Khiên đâm xuống'],['Mục tiêu','Kẻ địch gần nhất']]],
 disc:['Dựng đĩa vàng trước mặt tàu trong 8 giây; đạn và laser của địch chạm đĩa bị bẻ lệch 45 độ, quay lại gây 40% sát thương gốc lên kẻ địch.',
  [['Thời gian','8 giây'],['Bẻ lệch','45 độ · đạn và laser'],['Sát thương phản','40% sát thương gốc'],['Hồi chiêu','250 giây'],['Hiệu ứng','Đĩa phản đạn'],['Mục tiêu','Phía trước tàu']]],
 god:['Tia sáng tím chiếu xuống tàu trong 10 giây. Hết thời gian, tàu hóa thần: +2.000 máu, +200 sát thương mỗi đòn và +30% tốc chạy trong 30 giây.',
  [['Thời gian chiếu','10 giây'],['Tăng máu','+2.000'],['Tăng sát thương','+200 mỗi đòn'],['Tăng tốc chạy','+30%'],['Hiệu lực','30 giây'],['Hồi chiêu','280 giây'],['Hiệu ứng','Hóa thần'],['Mục tiêu','Bản thân']]],
 frag:['Phóng 50 mảnh vỡ hành tinh bay vào kẻ địch gần nhất trong 8 ô. Mỗi mảnh làm chậm 2% (cộng dồn); đủ 50 mảnh, mục tiêu bị nhốt đứng im 3 giây không thể tấn công hay dùng kỹ năng, rồi các mảnh phát nổ.',
  [['Phạm vi','8 ô'],['Mảnh vỡ','50 mảnh'],['Làm chậm','2% mỗi mảnh (cộng dồn)'],['Đủ 50 mảnh','Đứng im · cấm tấn công và kỹ năng 3 giây'],['Phát nổ','30 sát thương mỗi mảnh (cộng dồn)'],['Hồi chiêu','250 giây'],['Mục tiêu','Kẻ địch gần nhất']]],
 bsh:['Chỉ tàu boss dùng được. Tàu được bao bọc một lớp khiên chặn 2.000 sát thương cộng thêm 80% lượng máu đã mất.',
  [['Điều kiện','Chỉ tàu boss'],['Khiên','2.000 + 80% máu đã mất'],['Hồi chiêu','250 giây'],['Hiệu ứng','Khiên vị thần'],['Mục tiêu','Bản thân']]],
 ring:['Tạo 2 vành đai vàng cách nhau 14 ô trong 12 giây. Tàu ta và đồng minh bay qua một vòng sẽ xuyên tới vòng kia và được miễn thương 1 giây.',
  [['Khoảng cách','14 ô'],['Thời gian','12 giây'],['Dịch chuyển','Qua vòng này ra vòng kia'],['Miễn thương','1 giây sau khi qua vòng'],['Hồi chiêu','250 giây'],['Hiệu ứng','Cổng dịch chuyển'],['Mục tiêu','Tàu ta và đồng minh']]]};
const CATN={ftr:'Drone',sky:'Drone',shd:'Drone',bmb:'Drone',col:'Drone',mk:'Drone',dem:'Drone',gold:'Drone',res:'Drone',vd:'Drone',heal:'Drone',zap:'Drone',tur:'Drone',mn:'Drone',pur:'Drone',cage:'Drone',arm:'Drone'};
Object.keys(ID).forEach(n=>{const k=KI.find(x=>x[0]===n),t=TX[ID[n]];if(!k||!t)return;k[5]=t[0];k[6].length=0;t[1].forEach(r=>k[6].push(r.slice()))});
/* ảnh mới cho Cánh Tay Cơ Khí */
window.C34ARM='data:image/webp;base64,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';
if(window.C34ARM){const i=KI.findIndex(k=>k[0]==='Cánh Tay Cơ Khí');if(i>=0)KP[i]=window.C34ARM}
/* ---------- 3) dọn dữ liệu người chơi ---------- */
function purge(){try{if(typeof S==='undefined'||!S)return;let ch=0,da=0,sao=0;
  if(Array.isArray(S.skills)){const L=[];S.skills.forEach(n=>{if(REN[n]){n=REN[n];ch=1}if(DEL.includes(n)){const p=PRICE[n];if(p){da+=p[0];sao+=p[1]}ch=1;return}if(!L.includes(n))L.push(n);else ch=1});S.skills=L}
  if(S.cske)Object.keys(S.cske).forEach(c=>{S.cske[c]=(S.cske[c]||[]).map(n=>{if(REN[n]){ch=1;return REN[n]}if(DEL.includes(n)){ch=1;return ''}return n})});
  if(da||sao){S.da=(S.da||0)+da;S.sao=(S.sao||0)+sao;setTimeout(()=>{try{toast('Đã hoàn '+NF(da)+' Đá và '+NF(sao)+' Sao cho kỹ năng bị gỡ khỏi game')}catch(e){}},3800)}
  if(ch){try{save()}catch(e){}try{refresh()}catch(e){}}}catch(e){console.error(e)}}
purge();
if(typeof slFix==='function'){const _f=slFix;slFix=function(){purge();return _f.apply(this,arguments)}}

/* ---------- 4) tiện ích ---------- */
const isES=(G,P)=>!!P&&(P.team==='e'||(G.en||[]).includes(P)||(G.eu||[]).includes(P));
function foes(G,es){if(es)return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost);return (G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t))}
function friends(G,es){if(es)return (G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t));return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost)}
const Z34=G=>G.c34=G.c34||{u:[],o:[],fx:[],pop:[],wr:[]};
const pop=(G,x,y,s,col)=>Z34(G).pop.push({x,y,s,col,t:0,max:1.5});
const ringFx=(G,x,y,r,col)=>{try{G.fx.push({x,y,r,t:.45,max:.45,col})}catch(e){}};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const bossK=e=>e&&e.boss?1/3:1;
const AN=P=>isFinite(P.ang)?P.ang:-Math.PI/2;
function hurt(G,u,d,es,own){if(!u||u.dead||!(d>0))return 0;const h0=u.hp,ps=G.c28src;G.c28src=own||ps;
  try{if(u.c34u){c34Dmg(G,u,d)}else if(es&&u!==G.pl&&typeof dfDmgA==='function')dfDmgA(u,d);else dfDmgS(u,d,es)}catch(e){console.error(e)}finally{G.c28src=ps}
  return Math.max(0,h0-Math.max(0,u.hp))}
const sk=(G,e,d,sc)=>d*(sc||1)*(G.dmM||1)*(e.boss?.35:1);
function clampXY(G,u){const W=(G.wd&&G.wd.Wd)||24,H=(G.wd&&G.wd.Hd)||24;u.x=Math.max(.5,Math.min(W-.5,u.x));u.y=Math.max(.5,Math.min(H-.5,u.y))}
function nearest(F,P,R){let b=null,bd=1e9;F.forEach(e=>{const q=dist(e,P)-(e.size||2)*.3;if(q<=R&&q<bd){bd=q;b=e}});return b}
function moveTo(u,gx,gy,sp,dt){const dx=gx-u.x,dy=gy-u.y,l=Math.hypot(dx,dy);if(l<.01)return 0;const m=Math.min(l,sp*dt);u.x+=dx/l*m;u.y+=dy/l*m;return l}
const boss=(G,P)=>!!P&&(P===G.pl||P.boss);
function fx(G,o){Z34(G).fx.push(o);return o}
function trc(G,u,t,c,w){fx(G,{k:'trc',x1:u.x,y1:u.y,h1:u.h||0,x2:t.x,y2:t.y,h2:t.c34u?(t.h||0):0,c,w:w||.06,t:.14,max:.14})}
/* đơn vị (drone, tháp, cánh tay…) — đối phương bắn được nhờ c14 */
function c34Dmg(G,u,d){if(u.dead)return;d*=1-(u.red||0);if(u.shd&&u.shd.v>0){const x=Math.min(u.shd.v,d);u.shd.v-=x;d-=x}u.hp-=d;u.hit=.12;if(u.hp<=0){u.hp=0;u.dead=true;ringFx(G,u.x,u.y,(u.size||1)*1.2,'#ffb060')}}
function mkU(G,P,es,sc,k,o){const u=Object.assign({c34u:1,k,x:P.x,y:P.y,h:1,hp:100,max:100,es,own:P,sc:sc||1,born:G.t,life:8,cd:0,ang:AN(P),dead:false,size:1.2,hr:.8,taunt:!es,red:0,drone:1},o);
  u.max=u.hp;clampXY(G,u);Z34(G).u.push(u);if(!es&&!u.noHit){if(typeof c14Reg==='function')c14Reg(G,u);else{u.c14t=1;G.c14t=(G.c14t||[]).filter(q=>!q.dead);G.c14t.push(u)}}return u}
/* chọn mục tiêu: ưu tiên kẻ địch bị đánh dấu (Khóa Chính Xác Đỏ) */
function markOf(G,es){const m=G.c34mk;if(m&&m.es===es&&m.e&&!m.e.dead&&G.t<m.until)return m.e;return null}
function pick(G,u,R,from){const m=markOf(G,u.es);from=from||u;if(m&&dist(m,from)<=R+6)return m;return nearest(foes(G,u.es),from,R)}
/* xác tàu để drone thu thập */
function wrecks(G){const Z=Z34(G),L=Z.wr.filter(w=>G.t-w.t<60&&w.left>0);
  (G.bl||[]).forEach(b=>{if(b.hp<=0&&b.t!=='mine'){let w=L.find(q=>q.b===b);if(!w){w={x:b.x,y:b.y,t:G.t,left:400,b};Z.wr.push(w);L.push(w)}}});
  (G.rocks||[]).forEach(r=>{if(r&&!r.dead&&r.hp>0){let w=L.find(q=>q.r===r);if(!w){w={x:r.x,y:r.y,t:G.t,left:200,r};Z.wr.push(w);L.push(w)}}});
  return L}

/* ---------- 5) kế hoạch + thi triển ---------- */
{const _p=window.c26Plan;window.c26Plan=function(k){const id=k&&ID[k[0]];if(id)return {cat:k[1],vf:'c5',c5:3400+Object.keys(TX).indexOf(id),vfR:0,vfNo:1,R:0,c26:'c34',c34:id};return _p(k)}}
{const _c=window.c26Cast;window.c26Cast=function(G,P,k,o,near,inR,sc){if(!o||o.c26!=='c34')return _c.apply(this,arguments);if(!G||!P||P.dead)return;try{cast34(G,P,o.c34,sc||1)}catch(e){console.error(e)}}}

function droneRing(P,i,n,r){const a=AN(P)+Math.PI+(i-(n-1)/2)*.5;return {x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r}}
function cast34(G,P,id,sc){const es=isES(G,P),Z=Z34(G),F=foes(G,es),C=CF[id];
 if(id==='arm'){const t=nearest(F,P,C.R),a=t?Math.atan2(t.y-P.y,t.x-P.x):AN(P)+Math.PI/2,bx=P.x+Math.cos(a)*1.6+Math.cos(a+Math.PI/2)*1.4,by=P.y+Math.sin(a)*1.6+Math.sin(a+Math.PI/2)*1.4;
   const u=mkU(G,P,es,sc,'arm',{x:bx,y:by,h:0,hp:C.hp,life:C.life,size:3,hr:1.5,drone:0,st:'rise',st0:G.t,cx:bx,cy:by,ch:3.5,yaw:a,grab:null});
   u.cx=bx+Math.cos(a)*1;u.cy=by+Math.sin(a)*1;pop(G,bx,by-3,'Cánh tay cơ khí!','#cfe6ff');return}
 if(id==='ftr'||id==='mk'||id==='pur'){let tg=null;
   if(id==='mk'){const L=F.filter(e=>dist(e,P)<=C.R+(e.size||2)*.3);tg=L.length?L[Math.floor(Math.random()*L.length)]:null;
     if(tg){G.c34mk={e:tg,es,until:G.t+C.life};pop(G,tg.x,tg.y-2.4,'Đã khóa mục tiêu!','#ff6a6a')}else pop(G,P.x,P.y-2.4,'Không có mục tiêu trong 8 ô','#ffb0b0')}
   for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,2.2),ship=id==='pur';
     mkU(G,P,es,sc,id,{x:p.x,y:p.y,h:ship?1.1:1.6,hp:C.hp,life:C.life,cd:Math.random()*(ship?.3:C.rof),orb:Math.random()*6.28,size:ship?2:1.1,hr:ship?1.1:.8,drone:ship?0:1,acc:0})}
   if(id!=='mk')pop(G,P.x,P.y-2.4,id==='pur'?'Phi đội tím · 4 tàu chiến':'Chiến đấu cơ · 6 drone',id==='pur'?'#d9b0ff':'#cfe9ff');return}
 if(id==='sky'){const L=[];for(let i=0;i<C.n;i++){const a=i/C.n*Math.PI*2;L.push(mkU(G,P,es,sc,'sky',{x:P.x+Math.cos(a)*3,y:P.y+Math.sin(a)*3,h:C.h+6,hp:1,life:C.life+.8,noHit:1,size:1,tg:null,acc:0,slot:i}))}
   pop(G,P.x,P.y-2.4,'Pháo hoa phóng · laser từ trên cao','#ffc07a');return}
 if(id==='shd'){for(let i=0;i<C.n;i++)mkU(G,P,es,sc,'shd',{h:1.4,hp:C.hp,life:C.life,slot:i,sv:C.abs,svm:C.abs,size:1.1,taunt:false});pop(G,P.x,P.y-2.4,'Bong bóng hành tinh · 6 khiên','#9fd8ff');return}
 if(id==='bmb'){const T=F.filter(e=>dist(e,P)<=C.R+(e.size||2)*.3).sort((a,b)=>dist(a,P)-dist(b,P));
   for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,2);mkU(G,P,es,sc,'bmb',{x:p.x,y:p.y,h:3,hp:C.hp,life:30,bombs:C.bombs,cd:0,tg:T.length?T[i%T.length]:null,size:1.1})}
   pop(G,P.x,P.y-2.4,'Drone ném bom!','#ff8a7a');return}
 if(id==='col'){if(G.pv&&!wrecks(G).length){for(let i=0;i<3;i++){const a=AN(P)+(i-1)*.9;Z.wr.push({x:P.x+Math.cos(a)*6,y:P.y+Math.sin(a)*6,t:G.t,left:999,fake:1})}}
   for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,2);mkU(G,P,es,sc,'col',{x:p.x,y:p.y,h:2.2,hp:C.hp,life:C.life,slot:i,acc:0,got:0,size:1})}
   pop(G,P.x,P.y-2.4,'Kết giới hành tinh · thu thập Đá','#9fe8ff');return}
 if(id==='dem'){const own=Z.u.filter(u=>u.drone&&!u.dead&&u.es===es&&u.k!=='dem'&&u.k!=='sky'&&dist(u,P)<=C.R).slice(0,C.n),cx=P.x+Math.cos(AN(P))*3,cy=P.y+Math.sin(AN(P))*3;
   const c28=(G.c28&&G.c28.o||[]).filter(o=>o.k==='dr'&&o.d&&!o.d.dead&&o.d.es===es&&dist(o.d,P)<=C.R).map(o=>o.d).slice(0,C.n-own.length);
   const M=[];own.forEach(u=>{u.merge=1;u.taunt=false;M.push({u,x:u.x,y:u.y,h:u.h||1})});c28.forEach(d=>{d.dead=true;d.gone=1;M.push({x:d.x,y:d.y,h:1.2})});
   while(M.length<C.n){const a=Math.random()*Math.PI*2;M.push({x:P.x+Math.cos(a)*1.2,y:P.y+Math.sin(a)*1.2,h:1.4})}
   const o={k:'merge',x:cx,y:cy,es,P,sc,t:0,max:1.4,M:M.map(m=>({x0:m.x,y0:m.y,h0:m.h,u:m.u}))};Z.o.push(o);pop(G,cx,cy-3,'Tụ họp thành quỷ!','#ff9a6a');return}
 if(id==='gold'){for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,1.8);mkU(G,P,es,sc,'gold',{x:p.x,y:p.y,h:1.5,hp:C.hp,life:C.life,burned:new Set(),flame:0,size:1.1})}
   pop(G,P.x,P.y-2.4,'Phi đội vàng · phun lửa','#ffd86a');return}
 if(id==='res'){for(let i=0;i<C.n;i++){const a=i/C.n*Math.PI*2+Math.random()*.3,r=2.2+Math.random()*1.4;
     mkU(G,P,es,sc,'res',{x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,h:14+i*.8,hp:C.hp,life:C.life,cd:.6+Math.random()*.4,ox:Math.cos(a)*r,oy:Math.sin(a)*r,size:1.1,land:0})}
   pop(G,P.x,P.y-2.4,'Gọi cứu viện · 7 drone','#8fe0ff');return}
 if(id==='vd'){if(!boss(G,P)){pop(G,P.x,P.y-2.4,'Chỉ tàu boss mới dùng được','#ffb0b0');return}
   if(G.pv&&!Z.u.some(u=>u.drone&&!u.dead&&u.k!=='sky')){for(let i=0;i<6;i++){const a=i/6*Math.PI*2;mkU(G,P,es,sc,'ftr',{x:P.x+Math.cos(a)*7,y:P.y+Math.sin(a)*7,h:1.6,hp:500,life:6,cd:9,orb:a,size:1.1})}}
   Z.o.push({k:'door',P,es,t:0,max:C.win+.6,got:0,pull:[]});pop(G,P.x,P.y-2.4,'Về đây với ta!','#ffe0a0');return}
 if(id==='heal'){for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,1.8);mkU(G,P,es,sc,'heal',{x:p.x,y:p.y,h:1.8,hp:C.hp,life:C.life,given:0,size:1.05,tg:null})}
   pop(G,P.x,P.y-2.4,'Bầy xanh lục · hồi phục','#8fffb0');return}
 if(id==='zap'){if(G.pv&&!Z.u.some(u=>u.drone&&!u.dead&&u.es!==es)){const E=foes(G,es);for(let i=0;i<7;i++){const e=E[i%Math.max(1,E.length)]||P,a=i*.9;mkU(G,e,!es,1,'ftr',{x:e.x+Math.cos(a)*1.8,y:e.y+Math.sin(a)*1.8,h:1.6,hp:500,life:6,cd:9,orb:a,size:1.1})}}
   Z.o.push({k:'zap',P,es,x:P.x,y:P.y,t:0,max:1,done0:0,dl:G.pv?.6:0});pop(G,P.x,P.y-2.6,'Án tử drone!','#bfe0ff');return}
 if(id==='tur'){const a0=AN(P)+Math.PI/4;for(let i=0;i<C.n;i++){const a=a0+i*Math.PI/2;mkU(G,P,es,sc,'tur',{x:P.x+Math.cos(a)*2.6,y:P.y+Math.sin(a)*2.6,h:0,hp:C.hp,life:C.life,cd:.4,yaw:a,size:1.6,hr:.9,drone:0,rise:0})}
   pop(G,P.x,P.y-2.4,'Tháp pháo tự động · 4 tháp','#cfe6ff');return}
 if(id==='mn'){const T=F.filter(e=>dist(e,P)<=C.R+(e.size||2)*.3).sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,C.maxT),R=[[],[],[]];
   T.forEach((e,i)=>R[i%3].push(e));for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,1.6),a=AN(P)+(i-1)*.8;
     if(!R[i].length)R[i].push({x:P.x+Math.cos(a)*6,y:P.y+Math.sin(a)*6,fake:1});mkU(G,P,es,sc,'mn',{x:p.x,y:p.y,h:1.6,hp:C.hp,life:12,route:R[i],ri:0,cd:.5,size:1.1})}
   pop(G,P.x,P.y-2.4,'Mìn lơ lửng!','#ff8a8a');return}
 if(id==='cage'){const t=nearest(F,P,C.R);if(!t){pop(G,P.x,P.y-2.4,'Không có mục tiêu trong 12 ô','#ffb0b0');return}
   const o={k:'cage',e:t,es,P,sc,t:0,st:'fly',x:t.x,y:t.y,v:C.abs,vm:C.abs,D:[]};
   for(let i=0;i<C.n;i++){const p=droneRing(P,i,C.n,1.6);o.D.push(mkU(G,P,es,sc,'cage',{x:p.x,y:p.y,h:1.6,hp:C.hp,life:C.life+1.5,slot:i,cg:o,size:1.1}))}
   Z.o.push(o);pop(G,t.x,t.y-2.6,'Lồng khóa chết!','#9fd8ff');return}
 if(id==='s4'){const t=nearest(F,P,C.R);if(!t){pop(G,P.x,P.y-2.4,'Không có mục tiêu trong 9 ô','#ffb0b0');return}
   Z.o.push({k:'s4',e:t,es,P,sc,t:0,x:t.x,y:t.y,st:'hover',W:[]});pop(G,t.x,t.y-2.6,'Tứ khiên xanh chém tử!','#9fd8ff');return}
 if(id==='disc'){Z.o.push({k:'disc',P,es,t:0,max:C.life,a:AN(P),x:P.x,y:P.y,n:0});pop(G,P.x,P.y-2.4,'Đĩa kháng cự','#ffe27a');return}
 if(id==='god'){Z.o.push({k:'god',P,es,t:0,st:'beam'});pop(G,P.x,P.y-2.6,'Hóa vị thần…','#e0b0ff');return}
 if(id==='frag'){const t=nearest(F,P,C.R);if(!t){pop(G,P.x,P.y-2.4,'Không có mục tiêu trong 8 ô','#ffb0b0');return}
   Z.o.push({k:'frag',e:t,es,P,sc,t:0,sent:0,hit:0,F:[],st:'fly',seed:Math.random()*99});pop(G,t.x,t.y-2.6,'Thánh nhốt tàu!','#ffc07a');return}
 if(id==='bsh'){if(!boss(G,P)){pop(G,P.x,P.y-2.4,'Chỉ tàu boss mới dùng được','#ffb0b0');return}
   const v=C.base+C.lost*Math.max(0,(P.max||0)-(P.hp||0));P.c34sh=(P.c34sh||0)+v;P.c34shm=Math.max(P.c34shm||0,P.c34sh);P.c34shT=G.t;Z.o.push({k:'bsh',P,t:0});pop(G,P.x,P.y-2.6,'Khiên vị thần · '+NF(v),'#9fd8ff');return}
 if(id==='ring'){const t=nearest(F,P,40),a=t?Math.atan2(t.y-P.y,t.x-P.x):AN(P),A={x:P.x+Math.cos(a)*3.2,y:P.y+Math.sin(a)*3.2},B={x:A.x+Math.cos(a)*C.gap,y:A.y+Math.sin(a)*C.gap};clampXY(G,A);clampXY(G,B);
   Z.o.push({k:'ring',P,es,t:0,max:C.life,A,B,a});pop(G,P.x,P.y-2.6,'Vòng xoáy mở lối','#ffe27a');return}}

/* ---------- 6) cập nhật ---------- */
function step(G,dt){const Z=G&&G.c34;if(!Z||!(dt>0))return;
  Z.u.forEach(u=>{if(u.dead){if(!u.gone){u.gone=1;u.dt0=G.t;if(u.cg)cageHit(G,u.cg);if(u.k==='arm'&&u.grab)release(G,u)}return}
    if(G.t-u.born>=u.life&&!u.merge){u.dead=true;u.gone=1;u.dt0=G.t;u.exp=1;if(u.k==='arm'&&u.grab)release(G,u);return}
    u.hit=Math.max(0,(u.hit||0)-dt);try{UU[u.k]&&UU[u.k](G,u,dt,CF[u.k])}catch(e){console.error(e)}});
  Z.u=Z.u.filter(u=>!u.dead||G.t-(u.dt0||G.t)<.8);
  Z.o.forEach(o=>{o.t+=dt;try{UO[o.k]&&UO[o.k](G,o,dt,CF[o.k])}catch(e){console.error(e)}});Z.o=Z.o.filter(o=>!o.done);
  /* đốt lửa (Phi Đội Vàng) */
  [G.pl].concat(G.al||[],G.en||[]).forEach(e=>{if(!e||e.dead||!e.c34burn)return;e.c34burn=e.c34burn.filter(b=>G.t<b.until);e.c34burn.forEach(b=>hurt(G,e,b.dps*dt,b.es,b.own));if(!e.c34burn.length)e.c34burn=null});
  /* Thánh Nhốt Tàu: giữ chậm */
  /* Hóa Vị Thần hết hiệu lực */
  [G.pl].concat(G.al||[],G.en||[]).forEach(u=>{if(!u)return;if(u.c34gb&&G.t>=u.c34gb){u.c34gb=0;u.max=Math.max(1,u.max-CF.god.hp);u.hp=Math.min(u.hp,u.max);if(u.c34spE)u.sp=(u.sp||3)/(1+CF.god.spd);u.c34spE=0}
    if(u.c34gb>G.t&&!u.c34spE&&u.vx!=null&&!u.dead){u.x+=u.vx*dt*CF.god.spd;u.y+=(u.vy||0)*dt*CF.god.spd;clampXY(G,u)}
    if(u.c34sh>0&&u.c34shT&&G.t-u.c34shT>60){u.c34sh=0}});
  Z.fx.forEach(f=>f.t-=dt);Z.fx=Z.fx.filter(f=>f.t>0);
  Z.pop.forEach(p=>p.t+=dt);Z.pop=Z.pop.filter(p=>p.t<p.max)}
/* hành vi chung: bay vòng quanh mục tiêu và bắn */
function atk(G,u,dt,C,o){o=o||{};const R=o.R||C.R||10,tg=pick(G,u,R,u.own&&!u.own.dead?u.own:u);u.tg=tg;let gx,gy;
  if(tg){u.orb=(u.orb||0)+dt*(o.ow||1.4);const r=(o.orbit||C.rng*.7)+(tg.size||2)*.3;gx=tg.x+Math.cos(u.orb)*r;gy=tg.y+Math.sin(u.orb)*r}
  else{u.orb=(u.orb||0)+dt*1;const P=u.own&&!u.own.dead?u.own:u;gx=P.x+Math.cos(u.orb)*2.6;gy=P.y+Math.sin(u.orb)*2.6}
  const l=moveTo(u,gx,gy,o.sp||C.sp||7,dt);
  if(tg){u.ang=Math.atan2(tg.y-u.y,tg.x-u.x);return tg}if(l>.05)u.ang=Math.atan2(gy-u.y,gx-u.x);return null}
const UU={
 arm(G,u,dt,C){const age=G.t-u.born;u.rise=Math.min(1,age/.7);if(age<.7)return;
  const F=foes(G,u.es),bx=u.x,by=u.y,rest={x:bx+Math.cos(u.yaw)*2.5,y:by+Math.sin(u.yaw)*2.5,h:4.5};
  const go=(gx,gy,gh,sp)=>{const dx=gx-u.cx,dy=gy-u.cy,dh=gh-u.ch,l=Math.hypot(dx,dy,dh);if(l<.01)return 0;const m=Math.min(l,sp*dt);u.cx+=dx/l*m;u.cy+=dy/l*m;u.ch+=dh/l*m;return l};
  const lim=()=>{const dx=u.cx-bx,dy=u.cy-by,dh=u.ch-2.2,l=Math.hypot(dx,dy,dh);if(l>C.len){const k=C.len/l;u.cx=bx+dx*k;u.cy=by+dy*k;u.ch=2.2+dh*k}};
  if(u.st==='rise'){u.st='idle';u.st0=G.t}
  if(u.st==='idle'){go(rest.x,rest.y,rest.h,6);if(G.t-u.st0>.3){const own=u.own&&!u.own.dead?u.own:u,t=nearest(F.filter(e=>!e.c34held),own,C.R);if(t){u.tgt=t;u.st='reach';u.st0=G.t}}}
  else if(u.st==='reach'){const t=u.tgt;if(!t||t.dead){u.st='idle';u.st0=G.t;return}u.yaw=Math.atan2(t.y-by,t.x-bx);const l=go(t.x,t.y,1.2,14);lim();
    if(l<.6||G.t-u.st0>1.2){u.grab=t;t.c34held=u;u.gx0=t.x;u.gy0=t.y;u.st='lift';u.st0=G.t}}
  else if(u.st==='lift'){const t=u.grab;if(!t||t.dead){release(G,u);u.st='idle';u.st0=G.t;return}const k=Math.min(1,(G.t-u.st0)/.6);
    go(bx+Math.cos(u.yaw)*3.2,by+Math.sin(u.yaw)*3.2,6,9);hold(G,u,t);if(k>=1){u.st='swing';u.st0=G.t;u.y0=u.yaw;
      const ex=nearest(F.filter(e=>e!==t),t,12);u.ty=ex?Math.atan2(ex.y-by,ex.x-bx)+Math.PI:u.yaw+Math.PI}}
  else if(u.st==='swing'){const t=u.grab;if(!t||t.dead){release(G,u);u.st='idle';u.st0=G.t;return}const k=Math.min(1,(G.t-u.st0)/.55);let d=u.ty-u.y0;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
    u.yaw=u.y0+d*(k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2);u.cx=bx+Math.cos(u.yaw)*4;u.cy=by+Math.sin(u.yaw)*4;u.ch=6;hold(G,u,t);
    if(k>=1){const D=C.thr*(t.boss?.5:1);UO.thrown&&Z34(G).o.push({k:'thrown',e:t,x0:t.x,y0:t.y,x1:t.x+Math.cos(u.yaw)*D,y1:t.y+Math.sin(u.yaw)*D,t:0,max:.8,es:u.es,P:u.own,sc:u.sc});
      t.c34held=null;u.grab=null;u.st='back';u.st0=G.t}}
  else if(u.st==='back'){go(rest.x,rest.y,rest.h,7);if(G.t-u.st0>Math.max(.6,C.cyc-1.9)){u.st='idle';u.st0=G.t}}},
 ftr(G,u,dt,C){const tg=atk(G,u,dt,C);u.cd-=dt;if(tg&&u.cd<=0&&dist(tg,u)<=C.rng+(tg.size||2)*.3){u.cd=C.rof;hurt(G,tg,sk(G,tg,C.dmg,u.sc),u.es,u.own);trc(G,u,tg,'#7fd8ff',.08)}},
 mk(G,u,dt,C){const tg=atk(G,u,dt,C,{R:12});u.cd-=dt;if(tg&&u.cd<=0&&dist(tg,u)<=C.rng+(tg.size||2)*.3){u.cd=C.rof;hurt(G,tg,sk(G,tg,C.dmg,u.sc),u.es,u.own);trc(G,u,tg,'#ff4a4a',.1)}},
 pur(G,u,dt,C){const tg=atk(G,u,dt,C,{orbit:4.2,ow:.7});if(!tg){u.acc=0;return}if(dist(tg,u)>C.rng+(tg.size||2)*.3)return;u.acc+=dt*C.rps;let n=0;
  while(u.acc>=1){u.acc-=1;n++}if(n){hurt(G,tg,sk(G,tg,C.dmg*n,u.sc),u.es,u.own);u.fl=(u.fl||0)+n;if(u.fl>=2){u.fl=0;trc(G,u,tg,'#d27dff',.05)}}},
 dem(G,u,dt,C){const tg=atk(G,u,dt,C,{orbit:5,ow:.5,R:14});u.cd-=dt;if(tg&&u.cd<=0&&dist(tg,u)<=C.rng+(tg.size||2)*.3+1){u.cd=C.rof;hurt(G,tg,sk(G,tg,C.dmg,u.sc),u.es,u.own);fx(G,{k:'big',x1:u.x,y1:u.y,h1:u.h,x2:tg.x,y2:tg.y,t:.4,max:.4})}},
 sky(G,u,dt,C){const age=G.t-u.born,P=u.own;u.h=C.h+Math.max(0,6*(1-age/.8));
  if(!u.tg||u.tg.dead||dist(u.tg,P)>C.R+4){const F=foes(G,u.es).filter(e=>dist(e,P)<=C.R+(e.size||2)*.3),m=markOf(G,u.es);
    if(m&&dist(m,P)<=C.R+6)u.tg=m;else if(F.length){const used=new Map();Z34(G).u.forEach(q=>{if(q.k==='sky'&&q!==u&&q.tg)used.set(q.tg,(used.get(q.tg)||0)+1)});F.sort((a,b)=>(used.get(a)||0)-(used.get(b)||0)||dist(a,P)-dist(b,P));u.tg=F[0]}else u.tg=null}
  const tg=u.tg,a=u.slot/CF.sky.n*Math.PI*2+age*.3;
  if(tg){moveTo(u,tg.x+Math.cos(a)*2.5,tg.y+Math.sin(a)*2.5,8,dt);if(age>.8&&u.acc<C.dmg){const d=Math.min(C.dmg-u.acc,C.dmg/C.life*dt);u.acc+=d;hurt(G,tg,sk(G,tg,d,u.sc),u.es,P)}u.las=age>.8?1:0}
  else{moveTo(u,P.x+Math.cos(a)*3,P.y+Math.sin(a)*3,8,dt);u.las=0}},
 shd(G,u,dt,C){const P=u.own;if(!P||P.dead){u.life=0;return}const a=AN(P),off=(u.slot-(CF.shd.n-1)/2)*C.gap,gx=P.x+Math.cos(a)*C.ahead-Math.sin(a)*off,gy=P.y+Math.sin(a)*C.ahead+Math.cos(a)*off;
  moveTo(u,gx,gy,10,dt);u.ang=a},
 bmb(G,u,dt,C){const P=u.own;if(!u.tg||u.tg.dead){u.tg=pick(G,u,C.R,P&&!P.dead?P:u)}const tg=u.tg;
  if(!tg){if(moveTo(u,P.x,P.y,C.sp,dt)<.5&&G.t-u.born>3)u.life=0;return}const l=moveTo(u,tg.x,tg.y,C.sp,dt);u.ang=Math.atan2(tg.y-u.y,tg.x-u.x);u.cd-=dt;
  if(l<1.2&&u.cd<=0&&u.bombs>0){u.cd=C.rof;u.bombs--;Z34(G).o.push({k:'bomb',x:u.x,y:u.y,h0:u.h,t:0,max:.55,es:u.es,P,sc:u.sc});if(u.bombs<=0){u.life=G.t-u.born+.9}}},
 col(G,u,dt,C){const W=wrecks(G);if(!u.w||u.w.left<=0||!W.includes(u.w)){const used=new Map();Z34(G).u.forEach(q=>{if(q.k==='col'&&q!==u&&q.w)used.set(q.w,(used.get(q.w)||0)+1)});
    W.sort((a,b)=>(used.get(a)||0)-(used.get(b)||0)||dist(a,u)-dist(b,u));u.w=W[0]||null}
  const w=u.w;u.suck=0;if(!w){const P=u.own;u.orb=(u.orb||0)+dt;moveTo(u,P.x+Math.cos(u.orb+u.slot)*2.4,P.y+Math.sin(u.orb+u.slot)*2.4,C.sp,dt);return}
  const a=u.slot*1.05,l=moveTo(u,w.x+Math.cos(a)*1.1,w.y+Math.sin(a)*1.1,C.sp,dt);u.ang=Math.atan2(w.y-u.y,w.x-u.x);
  if(l<.3){u.suck=1;const g=C.rate*dt;u.acc+=g;w.left-=g;if(u.acc>=10){const n=Math.floor(u.acc);u.acc-=n;u.got+=n;if(!u.es&&!G.pv){try{S.da=(S.da||0)+n}catch(e){}}Z34(G).tot=(Z34(G).tot||0)+n;
    if(u.got%40<n)pop(G,u.x,u.y-1.5,'+'+NF(u.got)+' Đá','#9fe8ff')}}},
 gold(G,u,dt,C){const tg=atk(G,u,dt,C,{orbit:1.6,ow:2.4,sp:C.sp});u.flame=0;if(!tg)return;if(dist(tg,u)<=C.rng+(tg.size||2)*.35){u.flame=1;
   if(!u.burned.has(tg)){u.burned.add(tg);(tg.c34burn=tg.c34burn||[]).push({dps:sk(G,tg,C.dot,u.sc)/C.dotT,until:G.t+C.dotT,es:u.es,own:u.own})}}},
 res(G,u,dt,C){const age=G.t-u.born,P=u.own;if(u.h>1.5){u.h=Math.max(1.5,u.h-dt*22);if(u.h<=1.5&&!u.land){u.land=1;ringFx(G,u.x,u.y,1.2,'#8fe0ff')}return}
  const tg=nearest(foes(G,u.es),u,C.rng);u.tg=tg;if(P&&!P.dead)moveTo(u,P.x+u.ox,P.y+u.oy,4,dt);if(tg){u.ang=Math.atan2(tg.y-u.y,tg.x-u.x);u.cd-=dt;if(u.cd<=0){u.cd=C.rof;hurt(G,tg,sk(G,tg,C.dmg,u.sc),u.es,P);trc(G,u,tg,'#5fd0ff',.1)}}},
 heal(G,u,dt,C){const P=u.own,A=friends(G,u.es).filter(a=>dist(a,P&&!P.dead?P:u)<=C.R+(a.size||2)*.3&&a.hp<a.max);
  if(!u.tg||u.tg.dead||u.tg.hp>=u.tg.max||!A.includes(u.tg)){A.sort((a,b)=>a.hp/a.max-b.hp/b.max);u.tg=A[0]||null}
  const tg=u.tg;u.beam=0;if(!tg){if(P&&!P.dead){u.orb=(u.orb||0)+dt;moveTo(u,P.x+Math.cos(u.orb+u.k.length)*2,P.y+Math.sin(u.orb)*2,C.sp,dt)}return}
  u.orb=(u.orb||0)+dt*1.5;const r=(tg.size||2)*.4+1;moveTo(u,tg.x+Math.cos(u.orb)*r,tg.y+Math.sin(u.orb)*r,C.sp,dt);u.ang=Math.atan2(tg.y-u.y,tg.x-u.x);
  if(dist(u,tg)<r+1.2&&u.given<C.amt){const h=Math.min(C.amt-u.given,C.amt/C.life*dt,tg.max-tg.hp);if(h>0){tg.hp+=h;u.given+=h;u.beam=1}}},
 tur(G,u,dt,C){u.rise=Math.min(1,(G.t-u.born)/.6);if(u.rise<1)return;const tg=nearest(foes(G,u.es),u,C.rng);u.tg=tg;if(!tg){u.acc=0;return}
  u.yaw=Math.atan2(tg.y-u.y,tg.x-u.x);u.acc=(u.acc||0)+dt*C.rps;while(u.acc>=1){u.acc-=1;hurt(G,tg,sk(G,tg,C.dmg,u.sc),u.es,u.own);u.alt=!u.alt;trc(G,u,tg,'#ff5a3a',.06)}},
 mn(G,u,dt,C){let t=u.route[u.ri];while(t&&t.dead&&u.ri<u.route.length-1){u.ri++;t=u.route[u.ri]}
  if(!t||(t.dead&&u.ri>=u.route.length-1)){const P=u.own;if(moveTo(u,P.x,P.y,C.sp,dt)<1)u.life=0;}
  else{const l=moveTo(u,t.x,t.y,C.sp,dt);u.ang=Math.atan2(t.y-u.y,t.x-u.x);if(l<.8){if(u.ri<u.route.length-1)u.ri++;else u.route=[{x:u.own.x,y:u.own.y,fake:1,dead:1}],u.ri=0}}
  u.cd-=dt;if(u.cd<=0){u.cd=C.drop;Z34(G).o.push({k:'mine',x:u.x,y:u.y,es:u.es,P:u.own,sc:u.sc,t:0,max:C.mLife,ph:Math.random()*6})}},
 cage(G,u,dt,C){const o=u.cg,t=o.e;if(o.st==='fly'){const a=u.slot/CF.cage.n*Math.PI*2;moveTo(u,t.x+Math.cos(a)*C.rad,t.y+Math.sin(a)*C.rad,12,dt);u.ang=a+Math.PI}
  else{const a=u.slot/CF.cage.n*Math.PI*2+o.t*.6;u.x=o.x+Math.cos(a)*C.rad;u.y=o.y+Math.sin(a)*C.rad;u.ang=a+Math.PI}}};
function hold(G,u,t){t.x=u.cx;t.y=u.cy;t.lift=Math.max(0,(u.ch-1.2)/1.3);t.stun=Math.max(t.stun||0,.3);t.noFire=Math.max(t.noFire||0,.3);t.silT=Math.max(t.silT||0,.3);if(t.vx!=null){t.vx=0;t.vy=0}if(t===G.pl||t.tx!=null){t.tx=t.x;t.ty=t.y}}
function release(G,u){const t=u.grab;if(t){t.c34held=null;t.lift=0}u.grab=null}
function cageHit(G,o){if(o.st==='done')return;o.v=Math.max(0,o.v-o.vm*.25);pop(G,o.x,o.y-2.4,'Lồng nhốt −25%','#bfe0ff');if(o.v<=0)breakCage(G,o)}
function breakCage(G,o){if(o.st==='done')return;o.st='done';o.t1=G.t;ringFx(G,o.x,o.y,CF.cage.rad*1.3,'#9fd8ff');pop(G,o.x,o.y-2.6,'Lồng khóa đã vỡ','#bfe0ff');o.D.forEach(d=>{if(!d.dead){d.life=G.t-d.born+.2}})}
const UO={
 thrown(G,o,dt){const e=o.e,k=Math.min(1,o.t/o.max);if(!e||e.dead){o.done=1;return}e.x=o.x0+(o.x1-o.x0)*k;e.y=o.y0+(o.y1-o.y0)*k;clampXY(G,e);e.lift=Math.sin(k*Math.PI)*3.2+(1-k)*.8;e.stun=Math.max(e.stun||0,.3);if(e.tx!=null){e.tx=e.x;e.ty=e.y}
  if(k>=1){e.lift=0;o.done=1;hurt(G,e,sk(G,e,CF.arm.dmg,o.sc),o.es,o.P);ringFx(G,e.x,e.y,2.2,'#ffb060');try{G.shake=Math.max(G.shake||0,.35)}catch(x){}fx(G,{k:'land',x:e.x,y:e.y,t:.6,max:.6});pop(G,e.x,e.y-2,'Ném văng! −'+NF(sk(G,e,CF.arm.dmg,o.sc)),'#ffc07a')}},
 merge(G,o,dt){const C=CF.dem,k=Math.min(1,o.t/o.max);o.M.forEach(m=>{if(m.u&&!m.u.dead){m.u.x=m.x0+(o.x-m.x0)*k*k;m.u.y=m.y0+(o.y-m.y0)*k*k;m.u.h=m.h0+(3-m.h0)*k}});
  if(k>=1&&!o.done){o.done=1;o.M.forEach(m=>{if(m.u){m.u.dead=true;m.u.gone=1;m.u.dt0=G.t}});
   mkU(G,o.P,o.es,o.sc,'dem',{x:o.x,y:o.y,h:4,hp:C.hp,life:C.life,cd:1,size:5,hr:2.4,orb:0});ringFx(G,o.x,o.y,4,'#ff7a4a');try{G.shake=Math.max(G.shake||0,.4)}catch(x){}}},
 bomb(G,o,dt,C){if(o.t<o.max)return;o.done=1;let n=0;foes(G,o.es).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<=CF.bmb.blast+(e.size||2)*.3){hurt(G,e,sk(G,e,CF.bmb.dmg,o.sc),o.es,o.P);n++}});fx(G,{k:'boom',x:o.x,y:o.y,r:CF.bmb.blast,c:'#ff5a2a',t:.5,max:.5})},
 mine(G,o,dt,C){if(o.t>=o.max){o.done=1;return}if(o.t<.4)return;const C2=CF.mn;if(foes(G,o.es).some(e=>Math.hypot(e.x-o.x,e.y-o.y)<=C2.trig+(e.size||2)*.3)){o.done=1;
   foes(G,o.es).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<=C2.blast+(e.size||2)*.3)hurt(G,e,sk(G,e,C2.dmg,o.sc),o.es,o.P)});fx(G,{k:'boom',x:o.x,y:o.y,r:C2.blast,c:'#ff3030',t:.5,max:.5})}},
 door(G,o,dt){const C=CF.vd;const P=o.P;if(!P||P.dead){o.done=1;return}if(o.t>=o.max){o.done=1;if(o.got)pop(G,P.x,P.y-2.6,'Hút '+o.got+' drone','#ffe0a0');return}if(o.t>C.win)return;
  const Z=Z34(G),L=Z.u.filter(u=>u.drone&&!u.dead&&!u.merge&&u.k!=='sky'&&u.k!=='dem'&&dist(u,P)<=C.R);L.forEach(u=>{u.pull=1;u.merge=1;u.taunt=false});
  (G.c28&&G.c28.o||[]).forEach(q=>{if(q.k==='dr'&&q.d&&!q.d.dead&&dist(q.d,P)<=C.R){const d=q.d;d.dead=true;d.gone=1;const u=mkU(G,P,d.es,1,'ftr',{x:d.x,y:d.y,h:1.2,hp:1,life:9,noHit:1,size:1.1});u.pull=1;u.merge=1}});
  Z.u.forEach(u=>{if(!u.pull||u.dead)return;const a=AN(P)+Math.PI/2,dx=P.x+Math.cos(a)*.8,dy=P.y+Math.sin(a)*.8,l=moveTo(u,dx,dy,9,dt);u.h=Math.max(1,u.h-dt);u.ang=Math.atan2(dy-u.y,dx-u.x);
   if(l<.35){u.dead=true;u.gone=1;u.dt0=G.t;u.pull=0;o.got++;const h=P.max*C.heal;if(P.hp<P.max-1)P.hp=Math.min(P.max,P.hp+h);else{P.c34sh=(P.c34sh||0)+C.shd;P.c34shm=Math.max(P.c34shm||0,P.c34sh);P.c34shT=G.t}fx(G,{k:'boom',x:dx,y:dy,r:.6,c:'#ffe0a0',t:.3,max:.3})}})},
 zap(G,o,dt,C){if(o.t<o.dl)return;if(!o.done0){o.done0=1;o.x=o.P.x;o.y=o.P.y;let n=0;const Z=Z34(G);
   Z.u.forEach(u=>{if(u.drone&&!u.dead&&u.es!==o.es&&Math.hypot(u.x-o.x,u.y-o.y)<=C.R){u.dead=true;u.hp=0;n++;fx(G,{k:'zz',x:u.x,y:u.y,h:u.h,t:.5,max:.5})}});
   (G.c28&&G.c28.o||[]).forEach(q=>{if(q.k==='dr'&&q.d&&!q.d.dead&&q.d.es!==o.es&&Math.hypot(q.d.x-o.x,q.d.y-o.y)<=C.R){q.d.dead=true;q.d.hp=0;n++}});
   (G.c14t||[]).forEach(q=>{if(!q.dead&&!q.c34u&&q.c28d==null&&(q.drone||q.isDrone)&&o.es&&Math.hypot(q.x-o.x,q.y-o.y)<=C.R){q.dead=true;q.hp=0;n++}});
   pop(G,o.x,o.y-3,n?'Kết liễu '+n+' drone':'Vùng điện · không có drone','#cfe6ff')}if(o.t>=o.dl+o.max)o.done=1},
 cage(G,o,dt,C){const e=o.e;if(o.st==='done'){if(G.t-o.t1>.6)o.done=1;return}if(!e||e.dead){breakCage(G,o);return}
  if(o.st==='fly'){if(o.t>=.8||o.D.every(d=>d.dead||Math.hypot(d.x-e.x,d.y-e.y)<C.rad+.5)){o.st='hold';o.t0=G.t;o.x=e.x;o.y=e.y;ringFx(G,o.x,o.y,C.rad,'#9fd8ff')}return}
  if(G.t-o.t0>=C.life){breakCage(G,o);return}const dx=e.x-o.x,dy=e.y-o.y,l=Math.hypot(dx,dy),m=Math.max(.2,C.rad-(e.size||2)*.3-.2);if(l>m){e.x=o.x+dx/l*m;e.y=o.y+dy/l*m;if(e.tx!=null){e.tx=e.x;e.ty=e.y}}e.c34cage=G.t+.1},
 s4(G,o,dt,C){const e=o.e;if(o.st==='hover'){if(e&&!e.dead){o.x=e.x;o.y=e.y}if(o.t>=C.wait){o.st='drop';o.t0=G.t}return}
  if(o.st==='drop'){const k=Math.min(1,(G.t-o.t0)/.22);o.k2=k;if(k<1)return;o.st='stay';o.t0=G.t;let n=0;
   for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,x=o.x+Math.cos(a)*.9,y=o.y+Math.sin(a)*.9;foes(G,o.es).forEach(f=>{if(Math.hypot(f.x-x,f.y-y)<=C.hit*.5+(f.size||2)*.35)hurt(G,f,sk(G,f,C.dmg,o.sc),o.es,o.P)});
     o.W.push(mkU(G,o.P,o.es,o.sc,'s4w',{x,y,h:0,hp:C.abs,life:C.stay,drone:0,taunt:false,hr:.9,size:1.6,ang:a}))}
   ringFx(G,o.x,o.y,2.2,'#9fd8ff');try{G.shake=Math.max(G.shake||0,.3)}catch(x){}fx(G,{k:'boom',x:o.x,y:o.y,r:2,c:'#7fd0ff',t:.5,max:.5});return}
  if(o.W.every(w=>w.dead))o.done=1},
 disc(G,o,dt,C){const P=o.P;if(!P||P.dead||o.t>=o.max){o.done=1;return}o.a=AN(P);o.x=P.x+Math.cos(o.a)*C.ahead;o.y=P.y+Math.sin(o.a)*C.ahead},
 god(G,o,dt,C){const P=o.P;if(!P||P.dead){o.done=1;return}if(o.st==='beam'){if(o.t>=C.beam){o.st='on';o.t0=G.t;P.max+=C.hp;P.hp+=C.hp;P.c34gb=G.t+C.buff;
    if(P.vx==null){P.sp=(P.sp||3)*(1+C.spd);P.c34spE=1}ringFx(G,P.x,P.y,3,'#d27dff');pop(G,P.x,P.y-2.8,'HÓA THẦN! +2.000 máu · +200 sát thương','#f0c0ff')}return}
  if(!(P.c34gb>G.t))o.done=1},
 frag(G,o,dt,C){const e=o.e;if(!e||e.dead){o.done=1;return}const P=o.P;
  if(o.st==='fly'){const want=Math.min(C.n,Math.floor(o.t*C.rate));while(o.sent<want){const a=Math.random()*Math.PI*2,r=1.5+Math.random()*1.5;o.F.push({x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,h:1+Math.random()*2,v:10+Math.random()*4,st:0,th:Math.random()*6.28,ph:Math.acos(1-2*Math.random()),s:.18+Math.random()*.14,i:o.sent});o.sent++}
   o.F.forEach(f=>{if(f.st)return;const tx=e.x,ty=e.y,th=1.6,dx=tx-f.x,dy=ty-f.y,dh=th-f.h,l=Math.hypot(dx,dy,dh),m=f.v*dt;if(l<=m+(e.size||2)*.3){f.st=1;o.hit++;e.slowK=Math.min(e.slowK||1,Math.max(0,1-C.slow*o.hit));e.slowT=Math.max(e.slowT||0,6)}else{f.x+=dx/l*m;f.y+=dy/l*m;f.h+=dh/l*m}});
   if(o.hit>=C.n){o.st='lock';o.t0=G.t;const d=C.stun*bossK(e);e.stun=Math.max(e.stun||0,d);e.silT=Math.max(e.silT||0,d);e.noFire=Math.max(e.noFire||0,d);o.lk=d;pop(G,e.x,e.y-2.6,'Bị nhốt 3 giây!','#ffc07a')}
   else if(o.t>8&&o.sent>=C.n&&o.F.every(f=>f.st)){o.st='lock';o.t0=G.t;o.lk=.4}return}
  if(o.st==='lock'){e.slowT=Math.max(e.slowT||0,.2);if(G.t-o.t0>=o.lk){o.st='boom';const d=sk(G,e,C.dmg*o.hit,o.sc);hurt(G,e,d,o.es,P);fx(G,{k:'boom',x:e.x,y:e.y,r:2.4,c:'#ff9a3a',t:.7,max:.7});try{G.shake=Math.max(G.shake||0,.35)}catch(x){}
    pop(G,e.x,e.y-2.6,'Nổ '+o.hit+' mảnh · −'+NF(d),'#ffb070');o.t1=G.t;e.slowK=1}return}
  if(G.t-o.t1>.9)o.done=1},
 bsh(G,o){const P=o.P;if(!P||P.dead||!(P.c34sh>0)){o.done=1;if(P)P.c34shm=0}},
 ring(G,o,dt,C){if(o.t>=o.max){o.done=1;return}friends(G,o.es).forEach(u=>{if((u.c34rc||0)>G.t)return;const dA=dist(u,o.A),dB=dist(u,o.B);let to=null;if(dA<=C.rad)to=o.B;else if(dB<=C.rad)to=o.A;if(!to)return;
   const fr=to===o.B?o.A:o.B,a=Math.atan2(to.y-fr.y,to.x-fr.x);u.x=to.x+Math.cos(a)*(C.rad+.8);u.y=to.y+Math.sin(a)*(C.rad+.8);clampXY(G,u);if(u.tx!=null){u.tx=u.x+Math.cos(a)*1.5;u.ty=u.y+Math.sin(a)*1.5}if(u.vx!=null){u.vx=0;u.vy=0}
   u.c34rc=G.t+1.2;u.c34inv=G.t+C.inv;fx(G,{k:'warp',x:fr.x,y:fr.y,x2:u.x,y2:u.y,t:.5,max:.5});pop(G,u.x,u.y-2.2,'Miễn thương 1 giây','#ffe27a')})}};

/* ---------- 7) chặn / bẻ đạn: khiên Bong Bóng, Đĩa Kháng Cự, Lồng Khóa Chết ---------- */
function blockProj(G,p){if(!G||!G.c34||p.dead||p.c34df)return false;const Z=G.c34,es=p.team!=='e';
  for(const o of Z.o){if(o.k==='disc'&&o.es===es){const C=CF.disc,dx=p.x-o.x,dy=p.y-o.y,c=Math.cos(o.a),s=Math.sin(o.a),lx=dx*c+dy*s,ly=-dx*s+dy*c;
      if(Math.abs(lx)<=.6&&Math.abs(ly)<=C.rad){const v=Math.hypot(p.vx,p.vy)||10,sg=ly>=0?1:-1,na=Math.atan2(-p.vy,-p.vx)+sg*C.ang;p.c34df=1;
        if(p.pvT){p.dead=true}else{p.vx=Math.cos(na)*v;p.vy=Math.sin(na)*v;p.team=es?'e':'p';p.dmg=(p.dmg||0)*C.k;p.tg=null;p.life=Math.max(p.life||0,1.2);p.x=o.x+c*.8;p.y=o.y+s*.8}
        o.n++;fx(G,{k:'spark',x:o.x+(-s)*ly,y:o.y+c*ly,c:'#ffe27a',t:.3,max:.3});return true}}
    if(o.k==='cage'&&o.st==='hold'&&o.es===es&&o.v>0){const C=CF.cage,dx=p.x-o.x,dy=p.y-o.y,l=Math.hypot(dx,dy);if(Math.abs(l-C.rad)<=.45&&(dx*p.vx+dy*p.vy)>0){o.v-=p.dmg||0;p.dead=true;fx(G,{k:'spark',x:p.x,y:p.y,c:'#9fd8ff',t:.25,max:.25});if(o.v<=0)breakCage(G,o);return true}}}
  for(const u of Z.u){if(u.k!=='shd'||u.dead||u.es!==es||!(u.sv>0))continue;const dx=p.x-u.x,dy=p.y-u.y,c=Math.cos(u.ang),s=Math.sin(u.ang),lx=dx*c+dy*s,ly=-dx*s+dy*c;
    if(lx>=-.2&&lx<=.9&&Math.abs(ly)<=CF.shd.gap*.55){u.sv-=p.dmg||0;u.shh=G.t;p.dead=true;fx(G,{k:'spark',x:p.x,y:p.y,c:'#7fd0ff',t:.25,max:.25});return true}}
  return false}
function blockBeam(G,x,y,d){if(!G||!G.c34)return false;const Z=G.c34;
  for(const o of Z.o){if(o.k==='disc'&&!o.es){const C=CF.disc,dx=x-o.x,dy=y-o.y,c=Math.cos(o.a),s=Math.sin(o.a),lx=dx*c+dy*s,ly=-dx*s+dy*c;
      if(Math.abs(lx)<=.6&&Math.abs(ly)<=C.rad){if(o.bt&&G.t-o.bt<.05)return true;o.bt=G.t;const na=o.a+(ly>=0?1:-1)*C.ang,F=foes(G,false);let best=null,bd=1e9;
        F.forEach(e=>{const ex=e.x-o.x,ey=e.y-o.y,t=ex*Math.cos(na)+ey*Math.sin(na),pd=Math.abs(-ex*Math.sin(na)+ey*Math.cos(na));if(t>0&&t<12&&pd<(e.size||2)*.5&&t<bd){bd=t;best=e}});
        if(best)hurt(G,best,d*C.k,false,o.P);fx(G,{k:'dlz',x1:o.x,y1:o.y,x2:o.x+Math.cos(na)*(best?bd:9),y2:o.y+Math.sin(na)*(best?bd:9),t:.15,max:.15});return true}}
    if(o.k==='cage'&&o.st==='hold'&&!o.es&&o.v>0){const l=Math.hypot(x-o.x,y-o.y);if(Math.abs(l-CF.cage.rad)<=.4&&dist(o.e,o)<CF.cage.rad){o.v-=d;if(o.v<=0)breakCage(G,o);return true}}}
  for(const u of Z.u){if(u.k!=='shd'||u.dead||u.es||!(u.sv>0))continue;const dx=x-u.x,dy=y-u.y,c=Math.cos(u.ang),s=Math.sin(u.ang),lx=dx*c+dy*s,ly=-dx*s+dy*c;
    if(lx>=-.2&&lx<=.9&&Math.abs(ly)<=CF.shd.gap*.55){u.sv-=d;u.shh=G.t;return true}}
  return false}
{const _h=window.c14Hit;window.c14Hit=function(p){const G=DG;try{if(blockProj(G,p))return true}catch(e){console.error(e)}return _h?_h.apply(this,arguments):false}}
{const _b=window.c14BeamHit;window.c14BeamHit=function(x,y,d){const G=DG;try{if(blockBeam(G,x,y,d))return true}catch(e){console.error(e)}return _b?_b.apply(this,arguments):false}}
/* đạn phe ta (đội 'p') bị Đĩa Kháng Cự / khiên của địch chặn */
{const _S=dfStep;dfStep=function(dt){const G=DG;if(G&&G.c34&&G.pr&&G.c34.o.some(o=>o.es)){G.pr.forEach(p=>{if(!p.dead&&p.team==='p')blockProj(G,p)})}return _S.apply(this,arguments)}}
/* đơn vị của ta bị đạn địch trúng: c14 gọi c14Dmg — đảm bảo dùng c34Dmg khi là đơn vị c34 */
/* ---------- 8) khiên, miễn thương, tăng sát thương ---------- */
function absorb(G,s,d){if(!G||!s||!(d>0))return d;if(s.c34inv>G.t)return 0;if(s.c34sh>0){const x=Math.min(s.c34sh,d);s.c34sh-=x;d-=x;if(s.c34sh<=0)s.c34sh=0}return d}
{const _D=dfDmgS;dfDmgS=function(s,d,f){const G=DG;if(G&&s&&d>0){d=absorb(G,s,d);if(!(d>0))return}return _D.call(this,s,d,f)}}
if(typeof dfDmgA==='function'){const _A=dfDmgA;dfDmgA=function(a,d){const G=DG;if(G&&a&&d>0){d=absorb(G,a,d);if(!(d>0))return}return _A.call(this,a,d)}}
{const _F=dfFire;dfFire=function(src,wp,tg,team){const G=DG,o=src&&(src.o||src);if(G&&o&&o.c34gb>G.t&&wp){wp=Object.assign({},wp,{dmg:(wp.dmg||0)+CF.god.dmg/((src&&src.dm)||1)});const a=[].slice.call(arguments);a[1]=wp;return _F.apply(this,a)}return _F.apply(this,arguments)}}
/* xác tàu bị hạ: lưu vị trí để drone thu thập */
{const _D=dfDmgS;dfDmgS=function(s,d,f){const was=s&&!s.dead,r=_D.apply(this,arguments);try{const G=DG;if(G&&was&&s.dead&&!s.c34u)Z34(G).wr.push({x:s.x,y:s.y,t:G.t,left:300+(s.boss?600:0)})}catch(e){}return r}}
/* drone của ta: kẻ địch chỉ nhắm khi ở gần (7 ô) */
{const _T=window.c14Taunt;window.c14Taunt=function(e,w){let r=_T?_T.apply(this,arguments):null;
  if(r&&r.c34u&&dist(e,r)>(w?Math.max(7,(w.rng||0)+1.5):7)){const Z=DG&&DG.c34,L=Z?Z.u:[];L.forEach(t=>{t._tt=t.taunt;t.taunt=false});try{r=_T?_T.apply(this,arguments):null}finally{L.forEach(t=>{t.taunt=t._tt})}}
  return r}}
/* đơn vị c34 nhận sát thương qua c14Dmg: c14Dmg đã xử lý hp/shd/dead nên giữ nguyên */
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}
if(window.CSK&&CSK.tick){const _t=CSK.tick;CSK.tick=function(dt){const r=_t.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}

/* ---------- 9) vẽ 2D (khi tắt 3D) ---------- */
const COL={arm:'#cfd8e6',ftr:'#cfe9ff',sky:'#ffb060',shd:'#7fd0ff',bmb:'#ff5a4a',col:'#7fe8ff',mk:'#ff6a6a',dem:'#ff7a4a',gold:'#ffd24a',res:'#5fd0ff',heal:'#6fff9a',tur:'#c8ccd6',mn:'#ff4a4a',pur:'#c27dff',cage:'#e8f4ff',s4w:'#7fd0ff'};
function draw(q,G,X,Y,s){const Z=G&&G.c34;if(!Z)return;const T=G.t,L3=!!(window.R3D&&R3D.live);
  if(!L3){
  Z.o.forEach(o=>{q.save();try{
    if(o.k==='mine'){q.fillStyle='#ff3030';q.shadowColor='#ff0000';q.shadowBlur=8;q.beginPath();q.arc(X(o.x),Y(o.y),s*.25,0,7);q.fill()}
    else if(o.k==='bomb'){q.fillStyle='#ffb060';q.beginPath();q.arc(X(o.x),Y(o.y)-(1-o.t/o.max)*s*2,s*.2,0,7);q.fill()}
    else if(o.k==='cage'&&o.st!=='fly'){q.strokeStyle='#9fd8ff';q.lineWidth=3;q.globalAlpha=.4+.6*o.v/o.vm;q.beginPath();q.arc(X(o.x),Y(o.y),CF.cage.rad*s,0,7);q.stroke()}
    else if(o.k==='disc'){q.translate(X(o.x),Y(o.y));q.rotate(o.a);q.fillStyle='rgba(255,220,80,.45)';q.strokeStyle='#ffe27a';q.lineWidth=2;q.beginPath();q.ellipse(0,0,s*.25,CF.disc.rad*s,0,0,7);q.fill();q.stroke()}
    else if(o.k==='ring'){[o.A,o.B].forEach(p=>{q.strokeStyle='#ffd24a';q.lineWidth=4;q.shadowColor='#ffb020';q.shadowBlur=12;q.beginPath();q.arc(X(p.x),Y(p.y),CF.ring.rad*s,0,7);q.stroke()})}
    else if(o.k==='god'&&o.st==='beam'&&o.P){const x=X(o.P.x),y=Y(o.P.y);q.fillStyle='rgba(200,120,255,.35)';q.fillRect(x-s*.8,0,s*1.6,y)}
    else if(o.k==='zap'&&o.t>=o.dl){q.strokeStyle='#cfe6ff';q.lineWidth=3;q.globalAlpha=Math.max(0,1-(o.t-o.dl)/o.max);q.beginPath();q.arc(X(o.x),Y(o.y),CF.zap.R*s*Math.min(1,(o.t-o.dl)*4),0,7);q.stroke()}
    else if(o.k==='frag'){q.fillStyle='#b08a6a';o.F.forEach(f=>{const x=f.st?X(o.e.x)+Math.cos(f.th)*s*.9:X(f.x),y=f.st?Y(o.e.y)+Math.sin(f.th)*s*.9:Y(f.y);q.fillRect(x-2,y-2,4,4)})}
  }finally{q.restore()}});
  Z.u.forEach(u=>{if(u.dead)return;q.save();const x=X(u.x),y=Y(u.y)-(u.h||0)*s*.3,r=Math.max(5,s*.35*(u.k==='dem'?4:u.k==='arm'?2:1));q.fillStyle=COL[u.k]||'#fff';q.shadowColor=q.fillStyle;q.shadowBlur=8;
    q.beginPath();q.arc(x,y,r,0,7);q.fill();q.shadowBlur=0;q.fillStyle='#000a';q.fillRect(x-r,y-r-6,2*r,3);q.fillStyle='#5fe08a';q.fillRect(x-r,y-r-6,2*r*Math.max(0,u.hp/u.max),3);
    if(u.k==='arm'){q.strokeStyle='#cfd8e6';q.lineWidth=Math.max(4,s*.6);q.beginPath();q.moveTo(x,y);q.lineTo(X(u.cx),Y(u.cy)-u.ch*s*.3);q.stroke()}
    if(u.k==='shd'&&u.sv>0){q.translate(X(u.x),Y(u.y));q.rotate(u.ang);q.strokeStyle='#7fd0ff';q.lineWidth=3;q.beginPath();q.moveTo(s*.6,-CF.shd.gap*s*.5);q.lineTo(s*.6,CF.shd.gap*s*.5);q.stroke()}
    q.restore()});
  Z.fx.forEach(f=>{if(f.k!=='trc')return;q.save();q.globalAlpha=f.t/f.max;q.strokeStyle=f.c;q.lineWidth=2;q.beginPath();q.moveTo(X(f.x1),Y(f.y1));q.lineTo(X(f.x2),Y(f.y2));q.stroke();q.restore()})}
  Z.pop.forEach(p=>{const k=p.t/p.max;q.save();q.globalAlpha=Math.max(0,1-k);q.fillStyle=p.col||'#fff';q.font='bold '+Math.max(11,Math.round(s*.45))+'px system-ui,sans-serif';q.textAlign='center';q.fillText(p.s,X(p.x),Y(p.y)-k*s*1.2);q.restore()})}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s)}catch(e){console.error(e)}}}
if(window.CSK&&CSK.draw){const _d=CSK.draw;CSK.draw=function(q,sc,X,Y){const r=_d.apply(this,arguments);try{draw(q,DG,X,Y,sc)}catch(e){console.error(e)}return r}}
window.C34={CF,DEL,REN,ID,PRICE,purge,step,draw,cast34,blockProj,blockBeam};
})();
