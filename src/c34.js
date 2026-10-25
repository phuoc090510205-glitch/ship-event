
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
 shd:{n:6,hp:500,life:8,abs:600,gap:2,ahead:3,cd:250},
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
  [['Số lượng','6 drone'],['Khiên','Hình tròn 2×2 ô, chắn 600 sát thương mỗi tấm (phía trước)'],['Máu drone','500'],['Thời gian','8 giây'],['Hồi chiêu','250 giây'],['Hiệu ứng','Khiên chắn hàng ngang'],['Mục tiêu','Bảo vệ tàu ta']]],
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
    if(lx>=.3&&lx<=1.5&&Math.abs(ly)<=1.05){u.sv-=p.dmg||0;u.shh=G.t;p.dead=true;fx(G,{k:'spark',x:p.x,y:p.y,c:'#7fd0ff',t:.25,max:.25});return true}}
  return false}
function blockBeam(G,x,y,d){if(!G||!G.c34)return false;const Z=G.c34;
  for(const o of Z.o){if(o.k==='disc'&&!o.es){const C=CF.disc,dx=x-o.x,dy=y-o.y,c=Math.cos(o.a),s=Math.sin(o.a),lx=dx*c+dy*s,ly=-dx*s+dy*c;
      if(Math.abs(lx)<=.6&&Math.abs(ly)<=C.rad){if(o.bt&&G.t-o.bt<.05)return true;o.bt=G.t;const na=o.a+(ly>=0?1:-1)*C.ang,F=foes(G,false);let best=null,bd=1e9;
        F.forEach(e=>{const ex=e.x-o.x,ey=e.y-o.y,t=ex*Math.cos(na)+ey*Math.sin(na),pd=Math.abs(-ex*Math.sin(na)+ey*Math.cos(na));if(t>0&&t<12&&pd<(e.size||2)*.5&&t<bd){bd=t;best=e}});
        if(best)hurt(G,best,d*C.k,false,o.P);fx(G,{k:'dlz',x1:o.x,y1:o.y,x2:o.x+Math.cos(na)*(best?bd:9),y2:o.y+Math.sin(na)*(best?bd:9),t:.15,max:.15});return true}}
    if(o.k==='cage'&&o.st==='hold'&&!o.es&&o.v>0){const l=Math.hypot(x-o.x,y-o.y);if(Math.abs(l-CF.cage.rad)<=.4&&dist(o.e,o)<CF.cage.rad){o.v-=d;if(o.v<=0)breakCage(G,o);return true}}}
  for(const u of Z.u){if(u.k!=='shd'||u.dead||u.es||!(u.sv>0))continue;const dx=x-u.x,dy=y-u.y,c=Math.cos(u.ang),s=Math.sin(u.ang),lx=dx*c+dy*s,ly=-dx*s+dy*c;
    if(lx>=.3&&lx<=1.5&&Math.abs(ly)<=1.05){u.sv-=d;u.shh=G.t;return true}}
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
