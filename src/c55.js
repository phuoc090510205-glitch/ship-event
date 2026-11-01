/* ===== c55: chỉnh sửa 27 kỹ năng Tối Thượng theo yêu cầu (đơn vị triệu hồi 3D, cơ chế riêng) · bỏ mục "Tham chiếu Huyền Thoại" ===== */
(function(){
if(typeof KI==='undefined')return;
/* --- 1) bỏ "Tham chiếu Huyền Thoại" khỏi toàn bộ kỹ năng Tối Thượng --- */
KI.forEach(k=>{if(k&&k[6]){const i=k[6].findIndex(r=>r[0]==='Tham chiếu Huyền Thoại');if(i>=0)k[6].splice(i,1)}});
/* --- 2) tên mới · mô tả · chỉ số --- */
const T={
'Phản Sát Thương':['Quả Cầu Kích Nổ','Biến tàu thành một quả cầu năng lượng; tàu vẫn di chuyển được để tìm mục tiêu. Hết 6 giây quả cầu phát nổ.',[['Máu quả cầu','3.000 (chặn sát thương cho tàu)'],['Thời gian','6 giây · vẫn di chuyển'],['Phát nổ','30.000 sát thương · 3 ô']],'Lớp năng lượng đỏ cam bao kín thân tàu thành quả cầu rực sáng, lõi đập như tim; khi hết giờ quả cầu co lại rồi nổ tung thành vòng lửa.'],
'Sao Chép Kỹ Năng':['Quân Đoàn Xanh','Đồng minh trong 8 ô quanh tàu được hồi lại toàn bộ kỹ năng thuyền trưởng, đồng thời triệu hồi 5 người que xanh lao vào tấn công và khiêu khích kẻ địch.',[['Hồi kỹ năng','Toàn bộ kỹ năng thuyền trưởng của đồng minh trong 8 ô'],['Người que xanh','5 · 700 máu · 20 sát thương mỗi đòn'],['Khiêu khích','Kẻ địch nhắm vào người que'],['Thời gian','20 giây']],'5 người que xanh phát sáng nhảy ra quanh tàu, chạy tới vung tay đấm kẻ địch.'],
'Bão Năng Lượng':['Bão Năng Lượng','Phóng tia sét tím xuống kẻ địch gần nhất trong 9 ô, kết liễu ngay; sau đó gọi cơn bão tím trên trời trong 7 giây.',[['Tia sét','Kết liễu kẻ địch gần nhất trong 9 ô (boss: mất 20% máu tối đa)'],['Bão tím','320 sát thương mỗi giây · bán kính 4 ô'],['Số mục tiêu','Tối đa 5 mỗi lần đánh'],['Thời gian bão','7 giây']],'Mây bão tím cuộn trên cao, tia sét tím giáng thẳng xuống mục tiêu, sau đó sét nhỏ đánh liên tục quanh tâm bão.'],
'Hủy Diệt':['Hủy Diệt','Tạo vùng đỏ tích tụ năng lượng trong 3 giây rồi bùng nổ.',[['Tích tụ','3 giây'],['Bùng nổ','20.000 sát thương · 4 ô']],'Vùng đỏ rực trên mặt sàn co thắt dần, các vòng đỏ hút vào tâm rồi nổ thành cột lửa đỏ trắng.'],
'Lưới Không Gian':['Lưới Không Gian','Triệu hồi tấm lưới phủ 12×12 ô nhốt toàn bộ kẻ địch bên trong 8 giây.',[['Phạm vi','12 × 12 ô'],['Nhốt','8 giây · không di chuyển, không dùng kỹ năng (vẫn bắn súng thường)'],['Sát thương nhận thêm','+100% từ mọi nguồn'],['Thời gian','8 giây']],'Tấm lưới năng lượng xanh lam ô vuông hạ xuống phủ kín khu vực, các nút lưới lóe sáng.'],
'Phân Thân':['Triệu Hồi Lính Vàng','Triệu hồi 9 tàu bay vàng nhỏ tấn công kẻ địch trong phạm vi, khiêu khích kẻ địch và làm choáng mỗi lần bắn trúng.',[['Số lượng','9 tàu bay vàng nhỏ'],['Máu','800 mỗi tàu'],['Sát thương','50 mỗi giây'],['Choáng','0,5 giây mỗi lần trúng'],['Khiêu khích','Có'],['Thời gian','20 giây']],'Đội 9 tàu bay vàng nhỏ cánh nhọn bay vòng quanh mục tiêu, nhả đạn vàng.'],
'Mưa Vệ Tinh':['Mưa Vệ Tinh','Triệu hồi 20 vệ tinh xanh bay lên trời; mỗi vệ tinh chiếu laser xanh xuống 1 mục tiêu trong 5 ô, khiến mục tiêu bất động (vẫn bắn và dùng kỹ năng được).',[['Số vệ tinh','20 · 800 máu mỗi vệ tinh'],['Độ cao','12 ô trên mặt sàn'],['Tầm chiếu','5 ô'],['Hiệu ứng','Bất động hoàn toàn'],['Thời gian','12 giây']],'20 vệ tinh xanh có tấm pin mặt trời bay vút lên, dàn ra khắp trời rồi chiếu tia laser xanh thẳng đứng xuống mục tiêu.'],
'Virus Cơ Giáp':['Virus Cơ Giáp','Đặt 1 quả mìn virus đỏ tồn tại 40 giây. Tàu địch chạm phải bị nhiễm virus: điên cuồng, tăng 50% tốc chạy và lao vào đồng bọn; chạm đồng bọn đủ 3 giây sẽ lây bệnh. Đủ 12 tàu nhiễm bệnh thì cả 12 tàu bị kết liễu.',[['Mìn virus','Tồn tại 40 giây'],['Tàu nhiễm','+50% tốc chạy · lao vào đồng bọn'],['Lây bệnh','Chạm 3 giây'],['Đủ 12 tàu nhiễm','Kết liễu cả 12 (boss: mất 20% máu tối đa)']],'Quả mìn đỏ gai nhọn lơ lửng nhấp nháy; tàu nhiễm bệnh phủ ánh đỏ, rung giật và lao loạn xạ.'],
'Trạm Sửa Chữa':['Robo Xanh','Triệu hồi robot xanh 3D đứng yên bên tàu: chiếu laser xanh gây sát thương lên tối đa 3 kẻ địch và hồi máu cho 3 đồng minh trong 7 ô.',[['Máu robot','2.000 · không di chuyển'],['Laser','400 sát thương mỗi giây · tối đa 3 mục tiêu'],['Hồi máu','300 mỗi giây · 3 đồng minh'],['Phạm vi','7 ô'],['Thời gian','20 giây']],'Robot xanh lam thân vuông, mắt kính sáng, hai tay giơ lên phóng các tia laser xanh tới kẻ địch và tia hồi máu tới đồng minh.'],
'Tăng Kích Cỡ':['Robo Xanh Lá','Triệu hồi robot xanh lá cao 4 ô. Nội tại hồi 1% máu mỗi giây (10% khi dưới 50% máu). Robot đi chậm, bắn laser vào kẻ địch trong tầm và hồi máu cho đồng minh quanh nó; ưu tiên mục tiêu trên không.',[['Máu robot','4.000'],['Nội tại','Hồi 1% máu/giây · 10% khi dưới 50% máu'],['Di chuyển','2 ô mỗi 2 giây'],['Laser','400 sát thương mỗi phát · robot hồi 20 máu'],['Hồi máu đồng minh','40 mỗi 0,25 giây trong 5 ô'],['Ưu tiên','Mục tiêu trên không'],['Thời gian','25 giây']],'Robot xanh lá khổng lồ cao 4 ô bước chậm rãi, mắt sáng xanh, tia laser xanh từ ngực bắn ra, vòng hồi máu xanh lan quanh chân.'],
'Thu Nhỏ Mục Tiêu':['Thu Nhỏ Mục Tiêu','Bắn viên đạn đỏ vào 1 kẻ địch trong 5 ô; mục tiêu bị thu nhỏ mỗi giây 1 lần. Đủ 5 lần thu nhỏ thì bị kết liễu và nổ gây sát thương xung quanh.',[['Tầm bắn','5 ô'],['Thu nhỏ','1 lần mỗi giây · tối đa 5 lần'],['Đủ 5 lần','Kết liễu (boss: mất 20% máu) + 50.000 sát thương trong 3 ô']],'Viên đạn đỏ găm vào mục tiêu, từng nhịp vòng đỏ siết lại làm tàu co nhỏ dần rồi nổ tung.'],
'Vũ Trụ Băng Giá':['Trụ Băng Giá','Tạo trụ băng đâm lên dưới chân kẻ địch, hất bay mục tiêu trúng đòn ra xa. Trụ băng tiếp tục đứng lại.',[['Sát thương','2.000'],['Hất bay','30 ô'],['Máu trụ băng','4.000'],['Phạm vi','8 ô']],'Trụ băng lục lăng khổng lồ trồi vụt lên từ mặt sàn, mảnh băng văng tung tóe, mục tiêu bị hất văng đi xa.'],
'Đòn Phân Rã':['Giết Khổng Lồ','Bắn tia đạn tím bay tới mục tiêu trong tầm: gây sát thương lớn lên tàu thường và cực lớn lên boss.',[['Tàu thường','3.000 sát thương'],['Boss / tàu boss','80.000 sát thương'],['Ưu tiên','Mục tiêu nhiều máu nhất (boss trước)'],['Tầm','12 ô']],'Tia đạn tím dài xé gió bay thẳng tới mục tiêu, để lại vệt sáng tím, nổ tung khi chạm.'],
'Sợi Xích Không Gian':['Hỏa Ngục Tăm Tối','Xích tím trói mục tiêu 4 giây, rồi bơm năng lượng tím làm mục tiêu phình thành quả bóng tím 8 giây, sau đó nổ tung kết liễu mục tiêu và gây sát thương xung quanh.',[['Xích tím','4 giây'],['Bóng tím','8 giây'],['Phát nổ','Kết liễu (boss: mất 20% máu) + 40.000 sát thương trong 2 ô'],['Tầm','10 ô']],'Bốn sợi xích tím từ không trung quấn chặt mục tiêu, rồi thân tàu phồng dần thành quả cầu tím căng bóng trước khi vỡ tung.'],
'Hút Năng Lượng':['Tia Sáng Phá Hạm Đội','Bắn viên đạn xanh bay thẳng tối đa 8 ô rồi nổ trong 12 ô. Dưới 4 mục tiêu: mỗi mục tiêu 2.000 sát thương; từ 4 mục tiêu trở lên: mỗi mục tiêu 12.000 sát thương.',[['Đường bay','Tối đa 8 ô'],['Vụ nổ','12 ô'],['Dưới 4 mục tiêu','2.000 mỗi mục tiêu'],['Từ 4 mục tiêu','12.000 mỗi mục tiêu']],'Viên đạn xanh lam sáng chói bay thẳng, nổ thành quả cầu ánh sáng xanh lan rộng.'],
'Giáp Bất Tử':['Thiên Thần Vàng','Triệu hồi thiên thần vàng cao 8 ô lao đến hóa vàng kẻ địch. Kẻ địch bị hạ bởi thiên thần hóa thành tượng vàng và người chơi nhận 5 Sao.',[['Thiên thần','Cao 8 ô · 4.000 máu · 18 giây'],['Hóa vàng','3.000 sát thương mỗi lần'],['Hạ mục tiêu','Hóa tượng vàng · +5 Sao']],'Thiên thần vàng sải đôi cánh lớn, vầng hào quang trên đầu, chỉ tay phóng luồng sáng vàng biến mục tiêu thành vàng.'],
'Pháo Quỷ Đạo':['Pháo Quỷ Đạo','Dựng hai nòng pháo 3D; mỗi nòng bắn một viên đạn lớn đuổi theo mục tiêu trong 18 ô.',[['Số nòng','2'],['Đạn đuổi','Tầm 18 ô'],['Sát thương','5.000 mỗi viên'],['Kết liễu','Mục tiêu dưới 18% máu tối đa (trừ boss)']],'Hai nòng pháo kim loại trồi lên hai bên tàu, giật lùi khi khai hỏa, viên đạn lớn kéo đuôi lửa lượn theo mục tiêu.'],
'Đánh Cắp Hệ Thống':['Điều Khiển Đầu Não','Điều khiển đầu não 3 kẻ địch bất kỳ trong 12 ô, biến chúng thành tàu đồng minh trong 40 giây.',[['Số mục tiêu','3 (không áp dụng boss)'],['Phạm vi','12 ô'],['Thời gian','40 giây']],'Sóng não xanh lá phóng tới ba tàu địch, quầng sáng xanh lá bao lấy chúng khi chúng quay sang phe ta.'],
'Hồi Sinh Drone':['Drone Cứu Khẩn Cấp','Triệu hồi 4 drone cứu thương bám theo đồng minh yếu nhất để hồi máu.',[['Số drone','4 · 800 máu'],['Hồi máu','500 mỗi giây (1.000 với đồng minh có từ 5.000 máu)'],['Thời gian','12 giây']],'Bốn drone trắng xanh có chữ thập phát sáng bay tới các tàu đồng minh, chiếu tia hồi máu xanh lá.'],
'Khống Chế Tâm Trí':['Bạn Là Của Tôi','Chiếm kỹ năng của một mục tiêu đang bị điều khiển (hoặc kẻ địch gần nhất): tàu được tự dùng tối đa 4 kỹ năng của mục tiêu đó.',[['Mục tiêu','Tàu đang bị điều khiển · nếu không có: kẻ địch gần nhất trong 12 ô'],['Kỹ năng chiếm','Tối đa 4'],['Thời gian dùng','30 giây · mỗi kỹ năng dùng 1 lần']],'Sợi dây tâm trí tím nối từ tàu tới mục tiêu, các biểu tượng kỹ năng bay từ mục tiêu về tàu.'],
'Triệu Hồi Thiên Hà':['Cùng Nhau Gắn Kết','Toàn bộ tàu đồng minh và công trình được vô hạn tầm bắn, cùng bắn vào mục tiêu được chỉ định trong 4 giây; sau đó cơn bão vàng giáng sét xuống mục tiêu trong 8 giây.',[['Hợp lực','4 giây · vô hạn tầm bắn'],['Bão vàng','400 sát thương mỗi tia · 12 tia mỗi giây'],['Thời gian bão','8 giây']],'Mọi tàu và công trình phe ta bắn chùm tia vàng hội tụ vào một điểm, rồi mây bão vàng kéo tới trút sét vàng liên hồi.'],
'Mặt Trời Đỏ Thiêu Đốt':['Tụi Mày Chết','Gọi mặt trời đỏ 3D lớn dần 1 ô mỗi giây tới cực hạn 30 ô, hút và thiêu đốt kẻ địch (mạnh thêm 10% mỗi ô). Đạt cực hạn thì phát nổ, ánh sáng đỏ phủ cả sàn đấu làm chói mắt toàn bộ kẻ địch 2 giây.',[['Lớn dần','1 ô mỗi giây · tối đa 30 ô'],['Thiêu đốt','200 sát thương/giây · +10% mỗi ô'],['Lực hút','Mạnh thêm 10% mỗi ô'],['Phát nổ','Chói mắt toàn sàn 2 giây · 200 sát thương']],'Mặt trời đỏ sôi sục nở to dần trên chiến trường, kéo kẻ địch vào lòng lửa, cuối cùng nổ chói lòa nhuộm đỏ cả sàn đấu.'],
'Mái Vòm Pha Lê':['Mái Vòm Pha Lê','Dựng mái vòm pha lê: mọi công trình và đồng minh trong phạm vi nhận giáp; trong lúc mái vòm còn, tên lửa của kẻ địch bay tán loạn không trúng mục tiêu.',[['Giáp','10.000 cho mọi công trình và đồng minh · 15 giây'],['Mái vòm','12 giây'],['Tên lửa địch','Bay tán loạn'],['Phạm vi','12 ô']],'Mái vòm pha lê lục giác úp lên khu vực, tên lửa địch chạm vòm bị bẻ lệch lung tung.'],
'Đồng Hồ Vũ Trụ':['Đồng Hồ Vũ Trụ','Gọi đồng hồ lớn trên đầu chiến trường (cao 8 ô) xoay 8 vòng. Mỗi vòng: kẻ địch trong phạm vi bị +10 giây hồi chiêu mọi kỹ năng và choáng 0,5 giây. Vòng cuối đóng băng toàn bộ 8 giây.',[['Số vòng','8'],['Mỗi vòng','+10 giây hồi chiêu · choáng 0,5 giây'],['Vòng cuối','Đóng băng 8 giây'],['Phạm vi','14 ô']],'Mặt đồng hồ vàng khổng lồ lơ lửng trên cao, kim quay vòng, mỗi vòng phát sóng thời gian xuống mặt sàn.'],
'Hào Quang Chiến Hạm':['Hào Quang Chiến Hạm','Trụ sở phát sáng hào quang và nhận giáp trong suốt thời gian hào quang.',[['Giáp trụ sở','10.000'],['Thời gian','25 giây']],'Vầng hào quang vàng xoay quanh trụ sở, cột sáng vàng bao lấy trụ sở.'],
'Hố Đen Nuốt Hạm Đội':['Triệu Hồi Thế Giới Thứ 3','Triệu hồi hố đen lớn; từ hố đen bay ra biến thể bóng tối của các tàu đồng minh và tàu địch, lao vào tấn công kẻ địch và công trình của chúng. Biến thể bóng tối có 100% máu tối đa của tàu gốc.',[['Hố đen','10 giây'],['Biến thể bóng tối','Tối đa 10 · 100% máu tối đa tàu gốc'],['Thời gian biến thể','25 giây']],'Hố đen xoáy tím đen mở ra, từng con tàu bóng tối đen kịt bay vụt ra lao vào địch.'],
'Phượng Hoàng Lửa':['Phượng Hoàng Lửa','Triệu hồi phượng hoàng 3D. Vừa xuất hiện sải cánh gây sát thương và cấm kỹ năng toàn bộ kẻ địch; sau 2 giây vào trạng thái chiến đấu, thân bốc lửa, ưu tiên mục tiêu cao nhất và xa nhất với 3 đòn luân phiên.',[['Sải cánh','200 sát thương · cấm kỹ năng 3 giây toàn bộ kẻ địch'],['Phượng hoàng','4.000 máu · 20 giây'],['Đòn 1','Cầu lửa 800 · thiêu đốt 50 mỗi 0,5 giây trong 3 giây'],['Đòn 2','Vỗ cánh 400 · đẩy bay 4 ô'],['Đòn 3','Lao xuyên 500 · kết liễu dưới 12% máu (trừ boss)']],'Phượng hoàng lửa sải đôi cánh rực cháy, thân bốc lửa, phóng cầu lửa, vỗ cánh tạo gió lửa và lao xuyên mục tiêu.']};
const NEW={};
KI.forEach(k=>{const t=T[k[0]];if(!t||k[2]!==2)return;if(k[0]==='Hủy Diệt'&&k[1]!=='Tối thượng')return;const cd=(k[6].find(r=>r[0]==='Hồi chiêu')||[0,'60 giây'])[1];
  k[0]=t[0];k[5]=t[1];k[6]=t[2].map(r=>r.slice()).concat([['Hồi chiêu',cd],['Hoạt họa 3D',t[3]]]);k.c55=1;k.c50=0;NEW[t[0]]=1});
/* --- 3) cơ chế --- */
const Z=G=>G.c55=G.c55||{u:[],o:[]};
const EN=G=>(G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t));
const ALL=(G,P)=>[P].concat(ALS(G,P)).filter(a=>a&&!a.dead);
const d2=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),inR=(e,x,y,r)=>Math.hypot(e.x-x,e.y-y)<=r+(e.size||2)*.3;
const sim=G=>!G||!G.hq||G!==DG;
function hit(G,e,d,col){if(e&&!e.dead&&d>0)c5Hit(G,e,d,col||'#ffffff')}
function exe(G,e,col){if(!e||e.dead)return;if(e.boss)hit(G,e,e.max*.2/.35,col);else hit(G,e,e.hp+1e7,col)}
function near(G,P,R,f){const L=EN(G).filter(e=>inR(e,P.x,P.y,R)&&(!f||f(e)));return L.sort((a,b)=>d2(a,P)-d2(b,P))}
function dense(L,r){let b=null,bv=-1;L.forEach(e=>{const n=L.filter(f=>d2(f,e)<=r).length;if(n>bv){bv=n;b=e}});return b}
function unit(G,P,o){const u=Object.assign({c55:1,x:P.x,y:P.y,h:0,hp:100,size:1,hr:.7,dead:false,born:G.t,life:20,own:P,ang:0,cd:0},o);u.max=u.hp;Z(G).u.push(u);if(!u.noHit&&typeof c14Reg==='function'){try{c14Reg(G,u)}catch(e){}}return u}
function obj(G,o){const x=Object.assign({t:0},o);Z(G).o.push(x);return x}
function mv(u,x,y,sp,dt){const dx=x-u.x,dy=y-u.y,l=Math.hypot(dx,dy);if(l<.05)return 0;const m=Math.min(l,sp*dt);u.x+=dx/l*m;u.y+=dy/l*m;u.ang=Math.atan2(dy,dx);return l}
function clamp(G,u){if(!G.wd)return;u.x=Math.max(.5,Math.min(G.wd.Wd-.5,u.x));u.y=Math.max(.5,Math.min(G.wd.Hd-.5,u.y))}
function shield(u,v,t){if(u===DG.pl){vfShieldAdd(u,v,t);return}const on=u.shd&&u.shd.t>0&&u.shd.v>0,cur=on?u.shd.v:0;u.shd={v:cur+v,t:Math.max(t,on?u.shd.t:0),max:cur+v}}
function heal(u,v){if(u&&!u.dead)u.hp=Math.min(u.max,u.hp+v)}
function imm(e,t){e.slowT=Math.max(e.slowT||0,t);e.slowK=.01}
function kb(G,e,fx,fy,dist){if(e.sb)return;const dx=e.x-fx,dy=e.y-fy,l=Math.hypot(dx,dy)||1,k=dist*(e.boss?.3:1);e.x+=dx/l*k;e.y+=dy/l*k;clamp(G,e)}
function addSao(G,n){if(sim(G))return;try{S.sao=(S.sao||0)+n;save();refresh()}catch(e){}}
function mkAlly(G,src,x,y,life,name,shadow){if(!src||!src.sh||!G.al)return null;try{const a=dfMakeShip(src.sh,'p',{},{},x,y,{dmgDiv:12,size:src.size||2.2,arm:[],eng:[],nuc:[],tnk:[],mrd:[],sks:[],lvl:1,inf:1});
  a.ws=(src.ws||[]).map(w=>Object.assign({},w,{t:Math.random()*.5}));a.dm=src.dm||1;a.hp=a.max=Math.max(1,src.max||a.max);a.ally=1;a.name=name;a.sx=a.tx=x;a.sy=a.ty=y;a.c55tmp=G.t+life;a.c55sh=shadow?1:0;if(!a.sp||a.sp<1)a.sp=3;G.al.push(a);return a}catch(e){console.error(e);return null}}
const SK={
'Quả Cầu Kích Nổ'(G,P,sc){shield(P,3000*sc,6);const o=obj(G,{k:'orb',P,max:6});o.end=()=>{EN(G).forEach(e=>{if(inR(e,P.x,P.y,3))hit(G,e,30000*sc,'#ff7a30')});blast(G,P.x,P.y,3,'#ff7a30');obj(G,{k:'boom',x:P.x,y:P.y,r:3,max:.8,c:'#ff7a30'})}},
'Quân Đoàn Xanh'(G,P,sc,k){ALL(G,P).forEach(u=>{if(d2(u,P)>8+(u.size||2)*.3&&u!==P)return;(u.sk||[]).forEach(s=>{if(s&&s.cap&&s!==k)s.cd=0});ring(G,u.x,u.y,.3,(u.size||2)*1.2,.6,'#5cc8ff',4)});
  (G.pl&&G.pl.sk||[]).forEach(s=>{if(s&&s.cap&&s!==k&&s.src&&d2(s.src,P)<=8)s.cd=0});
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;unit(G,P,{k:'stk',x:P.x+Math.cos(a)*1.6,y:P.y+Math.sin(a)*1.6,hp:700*sc,size:.9,hr:.6,taunt:true,dmg:20*sc,rof:1,sp:3.5,life:20,col:'#3aa8ff'})}},
'Bão Năng Lượng'(G,P,sc){const t=near(G,P,9)[0];if(!t){toast('Không có kẻ địch trong 9 ô');return}obj(G,{k:'bolt',x:t.x,y:t.y,max:.6,c:'#c070ff'});exe(G,t,'#c070ff');
  const o=obj(G,{k:'storm',x:t.x,y:t.y,r:4,max:7,acc:0,c:'#b05cff'});o.u=(dt)=>{o.acc+=dt;if(o.acc<1)return;o.acc-=1;const L=EN(G).filter(e=>inR(e,o.x,o.y,4)).sort((a,b)=>d2(a,o)-d2(b,o)).slice(0,5);L.forEach(e=>{hit(G,e,320*sc,'#c070ff');(o.z=o.z||[]).push({x:e.x,y:e.y,t:G.t})})}},
'Hủy Diệt'(G,P,sc){const L=near(G,P,10),c=dense(L,4)||P,x=c.x,y=c.y;const o=obj(G,{k:'redz',x,y,r:4,max:3});o.end=()=>{EN(G).forEach(e=>{if(inR(e,x,y,4))hit(G,e,20000*sc,'#ff3030')});blast(G,x,y,4,'#ff3030');obj(G,{k:'boom',x,y,r:4,max:.9,c:'#ff4030'})}},
'Lưới Không Gian'(G,P,sc){const L=near(G,P,14),c=dense(L,6)||P,x=c.x,y=c.y;const o=obj(G,{k:'net',x,y,hw:6,max:8});const S2=new Set();
  o.u=()=>{EN(G).forEach(e=>{if(Math.abs(e.x-x)<=6&&Math.abs(e.y-y)<=6){S2.add(e)}});S2.forEach(e=>{if(e.dead)return;imm(e,.3);e.silT=Math.max(e.silT||0,.3);e.cVulT=Math.max(e.cVulT||0,.3);e.cVulK=Math.max(e.cVulK||1,2)})}},
'Triệu Hồi Lính Vàng'(G,P,sc){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;unit(G,P,{k:'gship',x:P.x+Math.cos(a)*2,y:P.y+Math.sin(a)*2,h:2.2,hp:800*sc,size:.8,hr:.6,taunt:true,dmg:25*sc,rof:.5,sp:7,life:20,orb:a})}},
'Mưa Vệ Tinh'(G,P,sc){for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,r=2+Math.random()*9;unit(G,P,{k:'sat',x:P.x,y:P.y,gx:P.x+Math.cos(a)*r,gy:P.y+Math.sin(a)*r,h:0,hp:800*sc,size:.7,hr:.6,taunt:false,life:12,sp:6})}},
'Virus Cơ Giáp'(G,P,sc){const a=isFinite(P.ang)?P.ang:-Math.PI/2;obj(G,{k:'vmine',x:P.x+Math.cos(a)*3,y:P.y+Math.sin(a)*3,max:40});const V=Z(G);V.vir=V.vir||{set:new Set(),done:0}},
'Robo Xanh'(G,P,sc){const a=(isFinite(P.ang)?P.ang:-Math.PI/2)+Math.PI/2;unit(G,P,{k:'robo',x:P.x+Math.cos(a)*2.2,y:P.y+Math.sin(a)*2.2,hp:2000*sc,size:1.4,hr:.9,taunt:false,life:20,sc,col:'#3aa8ff'})},
'Robo Xanh Lá'(G,P,sc){const a=(isFinite(P.ang)?P.ang:-Math.PI/2)-Math.PI/2;unit(G,P,{k:'grobo',x:P.x+Math.cos(a)*2.5,y:P.y+Math.sin(a)*2.5,hp:4000*sc,size:2.2,hr:1.4,taunt:false,life:25,sc,col:'#3ddc84'})},
'Thu Nhỏ Mục Tiêu'(G,P,sc){const t=near(G,P,5)[0];if(!t){toast('Không có kẻ địch trong 5 ô');return}obj(G,{k:'shot',x:P.x,y:P.y,tx:t.x,ty:t.y,max:.3,c:'#ff3a3a'});
  const o=obj(G,{k:'shrink',e:t,max:5.05,n:0,s0:t.size||2});o.u=()=>{const n=Math.min(5,Math.floor(o.t));if(n>o.n){o.n=n;t.size=o.s0*(1-.15*n);ring(G,t.x,t.y,.2,o.s0*.9,.4,'#ff3a3a',3)}};
  o.end=()=>{if(t.dead)return;const x=t.x,y=t.y;t.size=o.s0;exe(G,t,'#ff3a3a');EN(G).forEach(e=>{if(e!==t&&inR(e,x,y,3))hit(G,e,50000*sc,'#ff5a3a')});blast(G,x,y,3,'#ff5a3a');obj(G,{k:'boom',x,y,r:3,max:.8,c:'#ff5a3a'})}},
'Trụ Băng Giá'(G,P,sc){const t=near(G,P,8)[0];const x=t?t.x:P.x+Math.cos(P.ang||0)*3,y=t?t.y:P.y+Math.sin(P.ang||0)*3;EN(G).forEach(e=>{if(inR(e,x,y,1.6)){hit(G,e,2000*sc,'#bfe9ff');kb(G,e,P.x,P.y,30)}});
  unit(G,P,{k:'icep',x,y,hp:4000*sc,size:1.6,hr:1,taunt:false,life:60});blast(G,x,y,1.8,'#bfe9ff')},
'Giết Khổng Lồ'(G,P,sc){const L=near(G,P,12);const t=L.sort((a,b)=>(b.boss?1e12:0)+b.max-((a.boss?1e12:0)+a.max))[0];if(!t){toast('Không có mục tiêu trong tầm');return}
  const o=obj(G,{k:'shot',x:P.x,y:P.y,tx:t.x,ty:t.y,max:.35,c:'#b05cff',big:1});o.end=()=>{if(t.dead)return;const boss=t.boss||t.bkBoss||(t.sh&&t.sh.bk);hit(G,t,boss?80000*sc/.35:3000*sc,'#c070ff');obj(G,{k:'boom',x:t.x,y:t.y,r:1.4,max:.6,c:'#c070ff'})}},
'Hỏa Ngục Tăm Tối'(G,P,sc){const t=near(G,P,10).sort((a,b)=>b.max-a.max)[0];if(!t){toast('Không có mục tiêu trong 10 ô');return}const s0=t.size||2;
  const o=obj(G,{k:'hell',e:t,max:12,s0});o.u=()=>{if(t.dead){o.t=o.max;return}if(o.t<4){c5St(t,.3)}else{c5St(t,.3);imm(t,.3);t.silT=Math.max(t.silT||0,.3);t.size=s0*(1+.06*(o.t-4))}};
  o.end=()=>{t.size=s0;if(t.dead)return;const x=t.x,y=t.y;exe(G,t,'#b05cff');EN(G).forEach(e=>{if(e!==t&&inR(e,x,y,2))hit(G,e,40000*sc,'#b05cff')});blast(G,x,y,2.4,'#b05cff');obj(G,{k:'boom',x,y,r:2.4,max:.9,c:'#b05cff'})}},
'Tia Sáng Phá Hạm Đội'(G,P,sc){const t=near(G,P,20)[0];let dx=Math.cos(P.ang||-Math.PI/2),dy=Math.sin(P.ang||-Math.PI/2);if(t){const l=d2(t,P)||1;dx=(t.x-P.x)/l;dy=(t.y-P.y)/l}
  let L=8;EN(G).forEach(e=>{const px=e.x-P.x,py=e.y-P.y,pr=px*dx+py*dy;if(pr>0&&pr<L&&Math.abs(px*dy-py*dx)<(e.size||2)*.35)L=pr});const x=P.x+dx*L,y=P.y+dy*L;
  const o=obj(G,{k:'shot',x:P.x,y:P.y,tx:x,ty:y,max:.45,c:'#4fd8ff',big:1});o.end=()=>{const H=EN(G).filter(e=>inR(e,x,y,12)),d=H.length>=4?12000:2000;H.forEach(e=>hit(G,e,d*sc,'#7fe8ff'));obj(G,{k:'boom',x,y,r:12,max:1,c:'#4fd8ff'});ring(G,x,y,.5,12,.8,'#7fe8ff',5);toast('Tia Sáng Phá Hạm Đội: '+H.length+' mục tiêu · '+d.toLocaleString('vi-VN')+' sát thương mỗi mục tiêu')}},
'Thiên Thần Vàng'(G,P,sc){unit(G,P,{k:'angel',x:P.x,y:P.y-1,h:0,hp:4000*sc,size:2.4,hr:1.4,taunt:false,life:18,sp:6,dmg:3000*sc,rof:1.6})},
'Pháo Quỷ Đạo'(G,P,sc){const L=near(G,P,18);const a=isFinite(P.ang)?P.ang:-Math.PI/2;[-1,1].forEach((s,i)=>{const cx=P.x+Math.cos(a+s*Math.PI/2)*1.6,cy=P.y+Math.sin(a+s*Math.PI/2)*1.6;
  const c=unit(G,P,{k:'cannon',x:cx,y:cy,hp:1,noHit:1,life:2.4,ang:a});const t=L[i%Math.max(1,L.length)];if(!t)return;
  const sh=obj(G,{k:'hshell',x:cx,y:cy,tg:t,max:6,sp:11,c:'#ffb040'});sh.u=(dt)=>{let tg=sh.tg;if(!tg||tg.dead){tg=sh.tg=near(G,sh,18)[0];if(!tg){sh.t=sh.max;return}}const l=mv(sh,tg.x,tg.y,sh.sp,dt);if(l<(tg.size||2)*.35+.3){hit(G,tg,5000*sc,'#ffb040');if(!tg.dead&&!tg.boss&&tg.hp<=tg.max*.18)exe(G,tg,'#ffb040');obj(G,{k:'boom',x:tg.x,y:tg.y,r:1.5,max:.6,c:'#ffb040'});sh.t=sh.max;sh.hitDone=1}}})},
'Điều Khiển Đầu Não'(G,P,sc){const L=near(G,P,12,e=>!e.boss&&!e.c55ctl&&e.sh).sort(()=>Math.random()-.5).slice(0,3);if(!L.length){toast('Không có kẻ địch phù hợp trong 12 ô');return}
  L.forEach(e=>{const a=mkAlly(G,e,e.x,e.y,40,'Bị điều khiển · '+((e.sh&&e.sh.n)||''));if(!a)return;a.hp=e.hp;e.c55ctl={a,s0:e.spawn,until:G.t+40};e.spawn=1e9;a.c55src=e;obj(G,{k:'mind',x:e.x,y:e.y,a,max:40,c:'#7dff8a'});ring(G,e.x,e.y,.3,(e.size||2)*1.4,.6,'#7dff8a',5)})},
'Drone Cứu Khẩn Cấp'(G,P,sc){for(let i=0;i<4;i++)unit(G,P,{k:'mdrone',x:P.x+(i-1.5),y:P.y+1,h:1.8,hp:800*sc,size:.6,hr:.5,taunt:false,life:12,sp:8,sc})},
'Bạn Là Của Tôi'(G,P,sc,k){const ctl=(G.al||[]).filter(a=>!a.dead&&a.c55src);let src=ctl[0]?ctl[0].c55src:near(G,P,12)[0];if(!src){toast('Không có mục tiêu để chiếm kỹ năng');return}
  let L=(src.sk||[]).filter(s=>s&&s.cap).map(s=>s.cap);if(src.c54k)L.push(src.c54k);
  if(!L.length){const pool=KI.filter(x=>x[2]!==2&&!(typeof KDEL!=='undefined'&&KDEL[x[0]])&&!x.c55&&x[0]!==k.cap[0]);for(let i=0;i<4&&pool.length;i++)L.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])}
  L=L.slice(0,4);obj(G,{k:'link',P,e:src,max:1.2,c:'#c070ff'});
  if(P!==G.pl||sim(G)){L.forEach(c=>{try{cast(P,{m:{n:c[0]},q:{pw:0,dur:0,cd:0,ec:0},cd:0,cap:c},sc)}catch(e){}});return}
  const add=L.map(c=>{const i=KI.indexOf(c);return {m:{n:c[0]+' (chiếm)',img:(typeof KP!=='undefined'&&KP[i])||'',t:'cap',id:'c55s'+i},q:{pw:0,dur:0,cd:999,ec:0},cd:0,cap:c,c55once:1,c55until:G.t+30,sty:csStyle(c,csPlan(c))}});
  P.sk=(P.sk||[]).concat(add);toast('Đã chiếm '+add.length+' kỹ năng: '+L.map(c=>c[0]).join(', ')+' (30 giây)')},
'Cùng Nhau Gắn Kết'(G,P,sc){const L=EN(G).sort((a,b)=>b.max-a.max);let t=(P.tg&&!P.tg.dead)?P.tg:near(G,P,14).sort((a,b)=>b.max-a.max)[0]||L[0];if(!t){toast('Không có mục tiêu');return}
  const o=obj(G,{k:'focus',e:t,max:12,acc:0,sacc:0,c:'#ffd24a'});o.u=(dt)=>{if(!o.e||o.e.dead){o.e=near(G,o.e||P,8)[0];if(!o.e){o.t=o.max;return}}const e=o.e;
    if(o.t<4){o.acc+=dt;if(o.acc>=.5){o.acc-=.5;ALL(G,P).forEach(u=>{const dps=(u.ws||[]).reduce((s,w)=>s+(w.dmg||0)/Math.max(.1,w.cd||1),0)*(u.dm||1);hit(G,e,dps*.5,'#ffd24a');(o.ln=o.ln||[]).push({x:u.x,y:u.y,t:G.t})});(G.bl||[]).forEach(b=>{if(b.hp>0&&b.t!=='mine'&&b.t!=='wall'){hit(G,e,20,'#ffd24a');(o.ln=o.ln||[]).push({x:b.x,y:b.y,t:G.t})}})}}
    else{o.sacc+=dt*12;while(o.sacc>=1){o.sacc-=1;hit(G,e,400*sc,'#ffe27a')}}}},
'Tụi Mày Chết'(G,P,sc){const L=EN(G),c=dense(L,8)||P;const o=obj(G,{k:'sun',x:c.x,y:c.y,max:30,acc:0});
  o.u=(dt)=>{const D=Math.min(30,1+o.t),r=D/2,m=1+.1*D;o.r=r;EN(G).forEach(e=>{if(!inR(e,o.x,o.y,r))return;if(!e.sb&&!e.boss){const dx=o.x-e.x,dy=o.y-e.y,l=Math.hypot(dx,dy)||1;const st=Math.min(l,1.2*m*dt*.5);e.x+=dx/l*st;e.y+=dy/l*st}});o.acc+=dt;if(o.acc>=.5){o.acc-=.5;EN(G).forEach(e=>{if(inR(e,o.x,o.y,r))hit(G,e,100*m*sc,'#ff4020')})}};
  o.end=()=>{EN(G).forEach(e=>{e.silT=Math.max(e.silT||0,2);e.jamT=Math.max(e.jamT||0,2);e.jamK=Math.min(e.jamK||1,.2);if(inR(e,o.x,o.y,15))hit(G,e,200*sc,'#ff4020')});obj(G,{k:'flash',max:2,c:'#ff3010'});obj(G,{k:'boom',x:o.x,y:o.y,r:15,max:1.2,c:'#ff5020'})}},
'Mái Vòm Pha Lê'(G,P,sc){const x=P.x,y=P.y,R=12;ALL(G,P).forEach(u=>{if(d2(u,P)<=R)shield(u,10000*sc,15)});(G.bl||[]).forEach(b=>{if(b.hp>0&&b.t!=='mine'&&Math.hypot(b.x-x,b.y-y)<=R){const on=b.shd&&b.shd.t>0&&b.shd.v>0;b.shd={v:(on?b.shd.v:0)+10000*sc,t:15,max:(on?b.shd.v:0)+10000*sc}}});
  const o=obj(G,{k:'dome',x,y,r:R,max:12});o.u=()=>{(G.pr||[]).forEach(p=>{if(p.team!=='e'||p.c55sc||p.dead)return;const isM=p.tg||(p.k&&/msl|missile|rocket/.test(p.k))||(p.sp&&/msl|missile|rocket/.test(p.sp.k||''));if(!isM||Math.hypot(p.x-x,p.y-y)>R+2)return;p.c55sc=1;p.tg=null;const a=Math.random()*Math.PI*2,v=Math.hypot(p.vx||0,p.vy||0)||8;p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v})}},
'Đồng Hồ Vũ Trụ'(G,P,sc){const L=near(G,P,18),c=dense(L,7)||P;const o=obj(G,{k:'clock',x:c.x,y:c.y,r:14,max:8.05,n:0});
  o.u=()=>{const n=Math.min(8,Math.floor(o.t)+1);if(n>o.n){o.n=n;EN(G).forEach(e=>{if(!inR(e,o.x,o.y,14))return;(e.sk||[]).forEach(s=>{if(s)s.cd=(s.cd||0)+10});if(e.c54cd!=null)e.c54cd+=10;if(n<8)c5St(e,.5);else{c5St(e,8);e.silT=Math.max(e.silT||0,8*(e.boss?1/3:1))}});ring(G,o.x,o.y,.5,14,.6,n<8?'#ffd24a':'#bfe9ff',5)}}},
'Hào Quang Chiến Hạm'(G,P,sc){const hq=(G.bl||[]).find(b=>b.hp>0&&(b.t==='hq'||b.hq))||G.hq;if(!hq){toast('Không có trụ sở');return}const on=hq.shd&&hq.shd.t>0&&hq.shd.v>0;hq.shd={v:(on?hq.shd.v:0)+10000*sc,t:25,max:(on?hq.shd.v:0)+10000*sc};obj(G,{k:'halo',b:hq,max:25})},
'Triệu Hồi Thế Giới Thứ 3'(G,P,sc){const a=isFinite(P.ang)?P.ang:-Math.PI/2,x=P.x+Math.cos(a)*4,y=P.y+Math.sin(a)*4;const src=[].concat(ALL(G,P),EN(G)).filter(s=>s.sh&&!s.c55sh).slice(0,10);
  const o=obj(G,{k:'hole',x,y,max:10,q:src.slice(),acc:0});o.u=(dt)=>{o.acc+=dt;if(o.acc<.5||!o.q.length)return;o.acc=0;const s=o.q.shift();const al=mkAlly(G,s,x,y,25,'Bóng tối · '+((s.sh&&s.sh.n)||''),1);if(al){al.c55sh=1;ring(G,x,y,.2,2,.4,'#7a3aff',4)}}},
'Phượng Hoàng Lửa'(G,P,sc){const u=unit(G,P,{k:'phx',x:P.x,y:P.y-1.5,h:3.5,hp:4000*sc,size:2,hr:1.2,taunt:false,life:20,sp:7,sc,st:0,cyc:0});EN(G).forEach(e=>{hit(G,e,200*sc,'#ff8a20');e.silT=Math.max(e.silT||0,3*(e.boss?1/3:1))});ring(G,P.x,P.y,.5,14,.8,'#ff8a20',6)}
};
/* --- hành vi đơn vị --- */
const UU={
 stk(G,u,dt){const t=(c14TauntBy(u)||nearestE(G,u,12));u.sw=Math.max(0,(u.sw||0)-dt);if(!t){mv(u,u.own.x+1,u.own.y+1,u.sp,dt);u.mvg=1;return}const l=d2(u,t);if(l>(t.size||2)*.35+.8){mv(u,t.x,t.y,u.sp,dt);u.mvg=1}else{u.mvg=0;u.cd-=dt;if(u.cd<=0){u.cd=u.rof;u.sw=.4;hit(G,t,u.dmg,'#5cc8ff')}}},
 gship(G,u,dt){const t=nearestE(G,u.own,10);u.orb+=dt*1.6;const cx=t?t.x:u.own.x,cy=t?t.y:u.own.y,r=t?2.6+(t.size||2)*.3:2.4;mv(u,cx+Math.cos(u.orb)*r,cy+Math.sin(u.orb)*r,u.sp,dt);if(t){u.ang=Math.atan2(t.y-u.y,t.x-u.x);u.cd-=dt;if(u.cd<=0){u.cd=u.rof;hit(G,t,u.dmg,'#ffd24a');c5St(t,.5);(u.sh=u.sh||[]).push({x:t.x,y:t.y,t:G.t})}}},
 sat(G,u,dt){u.h=Math.min(12,u.h+dt*8);if(mv(u,u.gx,u.gy,u.sp,dt)>.1)return;if(u.h<11.5)return;let t=u.tg;if(!t||t.dead||d2(t,u)>5+(t.size||2)*.3){t=u.tg=nearestE(G,u,5)}if(t)imm(t,.25)},
 robo(G,u,dt){u.cd-=dt;const L=EN(G).filter(e=>inR(e,u.x,u.y,7)).sort((a,b)=>d2(a,u)-d2(b,u)).slice(0,3);u.tg=L;L.forEach(e=>hit(G,e,400*u.sc*dt,'#4fd8ff'));const A=ALL(G,u.own).filter(a=>d2(a,u)<=7&&a.hp<a.max).sort((a,b)=>a.hp/a.max-b.hp/b.max).slice(0,3);u.ha=A;A.forEach(a=>heal(a,300*u.sc*dt))},
 grobo(G,u,dt){heal(u,u.max*(u.hp<u.max*.5?.1:.01)*dt);const air=EN(G).filter(e=>e.c34u||e.drone||e.fly||e.h>1);const t=(air.length?air.sort((a,b)=>d2(a,u)-d2(b,u))[0]:null)||nearestE(G,u,14);
   if(t&&d2(t,u)>5)mv(u,t.x,t.y,1,dt);u.cd-=dt;u.tg=t&&d2(t,u)<=8?t:null;if(u.tg&&u.cd<=0){u.cd=1;hit(G,u.tg,400*u.sc,'#3ddc84');heal(u,20);u.zap=G.t}
   u.hacc=(u.hacc||0)+dt;while(u.hacc>=.25){u.hacc-=.25;ALL(G,u.own).forEach(a=>{if(d2(a,u)<=5)heal(a,40*u.sc)})}},
 icep(G,u,dt){},
 angel(G,u,dt){u.h=Math.min(1,u.h+dt);u.cd-=dt;let t=u.tg;if(!t||t.dead)t=u.tg=nearestE(G,u,16);if(!t){mv(u,u.own.x,u.own.y-2,u.sp,dt);return}if(d2(t,u)>3.5)mv(u,t.x,t.y,u.sp,dt);else if(u.cd<=0){u.cd=u.rof;u.zap=G.t;u.zt={x:t.x,y:t.y};hit(G,t,u.dmg,'#ffd24a');if(t.dead){addSao(G,5);obj(G,{k:'statue',x:t.x,y:t.y,s:t.size||2,max:4});toast('Thiên Thần Vàng hóa vàng 1 kẻ địch · +5 Sao')}}},
 cannon(G,u,dt){},
 mdrone(G,u,dt){const A=ALL(G,u.own).sort((a,b)=>a.hp/a.max-b.hp/b.max);const i=Z(G).u.filter(x=>x.k==='mdrone'&&!x.dead).indexOf(u);const t=A[i%Math.max(1,A.length)];if(!t)return;u.tg=t;mv(u,t.x+Math.cos(G.t*2+i)*1.4,t.y+Math.sin(G.t*2+i)*1.4,u.sp,dt);heal(t,(t.max>=5000?1000:500)*u.sc*dt)},
 phx(G,u,dt){const age=G.t-u.born;if(age<2){u.ang=-Math.PI/2;return}u.st=1;u.cd-=dt;const L=EN(G);if(!L.length)return;const t=L.slice().sort((a,b)=>((b.h||0)-(a.h||0))||(d2(b,u.own)-d2(a,u.own)))[0];u.tg=t;
   if(u.dive){const l=mv(u,u.dive.x,u.dive.y,16,dt);if(l<.3)u.dive=null;return}
   if(d2(t,u)>6)mv(u,t.x,t.y,u.sp,dt);else u.ang=Math.atan2(t.y-u.y,t.x-u.x);if(u.cd>0)return;u.cd=1.5;const n=u.cyc++%3;
   if(n===0){obj(G,{k:'shot',x:u.x,y:u.y,tx:t.x,ty:t.y,max:.35,c:'#ff7a20',big:1});hit(G,t,800*u.sc,'#ff7a20');(t.c55burn=t.c55burn||[]).push({until:G.t+3,acc:0,d:50*u.sc})}
   else if(n===1){hit(G,t,400*u.sc,'#ffb060');kb(G,t,u.x,u.y,4);obj(G,{k:'wind',x:t.x,y:t.y,max:.6})}
   else{const dx=t.x-u.x,dy=t.y-u.y,l=Math.hypot(dx,dy)||1;u.dive={x:t.x+dx/l*3,y:t.y+dy/l*3};hit(G,t,500*u.sc,'#ffd060');if(!t.dead&&!t.boss&&t.hp<=t.max*.12)exe(G,t,'#ffd060')}}
};
function nearestE(G,p,R){return near(G,p,R)[0]||null}
function c14TauntBy(u){return null}
/* --- 4) thi triển --- */
function c55Cast(P,k,sc){const G=DG;if(!G||!P||P.dead)return;if(P.silT>0)return;const f=SK[k.cap[0]];if(!f)return;sc=sc||1;
  try{f(G,P,sc,k)}catch(e){console.error(e)}const sty=(k.sty&&k.sty.ready)?k.sty:(k.sty=csStyle(k.cap,csPlan(k.cap)));P.cs=P.cs||{};P.cs.last=k;P.cs.sty=sty;
  if(k.c55once){k.cd=1e9;k.c55used=1}}
const _c0=cast0;cast0=function(P,k,sc){if(k&&k.cap&&k.cap.c55&&SK[k.cap[0]])return c55Cast(P,k,sc);return _c0.apply(this,arguments)};
window.C55={SK,T,NEW};
/* --- 5) cập nhật mỗi khung hình --- */
{const _S=dfStep;dfStep=function(dt){_S.call(this,dt);const G=DG;if(!G||!G.c55&&!(G.al||[]).some(a=>a.c55tmp)&&!(G.pl&&G.pl.sk||[]).some(s=>s.c55once))return;const V=G.c55||{u:[],o:[]};
  try{
  V.u.forEach(u=>{if(u.dead)return;if(G.t-u.born>=u.life){u.dead=true;u.dt0=G.t;return}try{UU[u.k]&&UU[u.k](G,u,dt)}catch(e){console.error(e)}clamp(G,u)});
  V.u=V.u.filter(u=>!u.dead||G.t-(u.dt0||G.t)<.6);V.u.forEach(u=>{if(u.dead&&u.dt0==null)u.dt0=G.t});
  V.o.forEach(o=>{if(o.done)return;o.t+=dt;try{o.u&&o.u(dt)}catch(e){console.error(e)}if(o.t>=o.max){o.done=1;try{o.end&&o.end()}catch(e){console.error(e)}}});V.o=V.o.filter(o=>!o.done);
  /* virus */
  const VR=V.vir;if(VR){const mines=V.o.filter(o=>o.k==='vmine');EN(G).forEach(e=>{if(VR.set.has(e))return;if(mines.some(m=>inR(e,m.x,m.y,1)))infect(G,VR,e)});
    VR.set.forEach(e=>{if(e.dead){VR.set.delete(e);return}const others=EN(G).filter(o=>!VR.set.has(o));const t=others.sort((a,b)=>d2(a,e)-d2(b,e))[0];if(t){const sp=(e.sp||2)*1.5;mv(e,t.x,t.y,sp,dt);if(d2(e,t)<=((e.size||2)+(t.size||2))*.35+.3){e.c55touch=(e.c55touch||0)+dt;if(e.c55touch>=3){e.c55touch=0;infect(G,VR,t)}}}
      if(Math.random()<.2)ring(G,e.x,e.y,.1,(e.size||2)*.8,.3,'#ff3030',2)});
    if(VR.set.size>=12){const L=[...VR.set];VR.set.clear();L.forEach(e=>{exe(G,e,'#ff3030');obj(G,{k:'boom',x:e.x,y:e.y,r:1.6,max:.7,c:'#ff3030'})});toast('Virus Cơ Giáp: 12 tàu nhiễm bệnh bị kết liễu!')}}
  /* thiêu đốt phượng hoàng */
  (G.en||[]).forEach(e=>{if(!e.c55burn||e.dead)return;e.c55burn=e.c55burn.filter(b=>G.t<b.until);e.c55burn.forEach(b=>{b.acc+=dt;while(b.acc>=.5){b.acc-=.5;hit(G,e,b.d,'#ff7a20')}});if(!e.c55burn.length)e.c55burn=null});
  /* tàu đồng minh tạm (bóng tối, bị điều khiển) */
  (G.al||[]).forEach(a=>{if(!a.c55tmp)return;if(G.t>=a.c55tmp||a.dead){const e=a.c55src;if(e&&e.c55ctl){e.spawn=Math.min(e.c55ctl.s0||0,G.t);e.c55ctl=null;if(a.dead){e.x=a.x;e.y=a.y;dfDmgS(e,e.hp+1e9)}else{e.x=a.x;e.y=a.y;e.hp=Math.min(e.max,a.hp)}}a.c55gone=1;a.dead=true}});
  if(G.al&&G.al.some(a=>a.c55gone))G.al=G.al.filter(a=>!a.c55gone);
  /* kỹ năng chiếm được */
  const P=G.pl;if(P&&P.sk&&P.sk.some(s=>s.c55once&&(s.c55used||G.t>=s.c55until)))P.sk=P.sk.filter(s=>!(s.c55once&&(s.c55used||G.t>=s.c55until)));
  /* vẽ 2D khi không xem 3D */
  if(!(window.R3D&&R3D.live)){V.u.forEach(u=>{if(!u.dead)ring(G,u.x,u.y,0,u.size*.6,.05,u.col||'#ffd24a',2)});V.o.forEach(o=>{if(o.x!=null)ring(G,o.x,o.y,0,o.r||1.2,.05,o.c||'#ffffff',2)})}
  }catch(e){console.error(e)}}}
function infect(G,VR,e){if(VR.set.has(e))return;VR.set.add(e);ring(G,e.x,e.y,.2,(e.size||2)*1.2,.5,'#ff3030',4)}
})();
