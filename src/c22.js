/* ===== c22: Công sự · Đánh chặn · Pháo hạng nặng (33 công trình điều chỉnh: fc7–fc10, ic1–ic10, ha1–ha10, hb1–hb9) ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
/* ---------- thông số tháp / pháo (sát thương tính theo số hiển thị; nội bộ = /20) ----------
   rate: số lượt bắn mỗi giây · cdS: số giây giữa 2 lượt · n: số đạn mỗi lượt · seq: giãn cách giữa các đạn liên tiếp
   par: khoảng cách ngang giữa các nòng · spread: góc xòe · dmgR: sát thương ngẫu nhiên [min,max]
   kind: bullet | missile | lob | pierce | beam | cont · spl: bán kính nổ · ex: nhân sát thương khi mục tiêu còn >= hp máu
   kb: đẩy lùi {p: xác suất, d: số ô} · slow {k,t} · stun {p,t} · grow: tăng máu tối đa mỗi đòn trúng · mag/reload: băng đạn */
const TUR={
  ic1:{rng:6,rate:2,n:1,dmg:30,kind:'missile',sp:9,col:'#ff9d8a',sz:.15,rocket:1,spl:0},
  ic3:{rng:11,rate:2,n:2,seq:.14,alt:.34,dmg:90,kind:'missile',sp:9,col:'#ff8a8a',sz:.19,rocket:1},
  ic4:{rng:7,cdS:1,n:16,seq:.022,spread:.7,jit:.1,dmg:30,kind:'missile',sp:10.5,col:'#ffb38a',sz:.1,rocket:1},
  ic8:{rng:20,rate:4,n:1,dmg:90,kind:'missile',sp:7,col:'#c8e0ff',sz:.17,rocket:1,hide:2,stealth:1,jit:.16},
  ic9:{rng:12,rate:4,n:1,dmg:200,kind:'missile',sp:9,col:'#ff7a7a',sz:.2,rocket:1,kb:{p:.1,d:1},alt:.3},
  ha1:{rng:6,rate:2,n:2,par:.55,dmg:90,kind:'bullet',sp:17,col:'#69b6ff',sz:.13,slow:{k:.9,t:1}},
  ha2:{rng:7,rate:2,n:1,dmg:80,kind:'bullet',sp:14,col:'#ff9a3c',sz:.19,spl:1.2,ex:{hp:3000,m:4},boom:1},
  ha3:{rng:7,rate:3,n:1,dmg:200,kind:'bullet',sp:17,col:'#58a8ff',sz:.2,plasma:1},
  ha4:{rng:6,rate:12,n:1,dmg:20,kind:'bullet',sp:21,col:'#ffd860',sz:.075,mag:120,reload:3,barrels:7},
  ha5:{rng:7,rate:2,n:3,seq:.09,dmg:29,kind:'bullet',sp:17,col:'#5ab4ff',sz:.09},
  ha6:{rng:7,kind:'cont',lasers:2,dps:100,col:'#7ee8ff',par:.62},
  ha7:{rng:8,cdS:7,n:1,dmg:800,kind:'bullet',sp:15,col:'#4fd0ff',sz:.3,arc:1,charge:1},
  ha8:{rng:15.8,cdS:2.7,n:1,dmg:400,kind:'lob',sp:9,col:'#58b4ff',sz:.85,spl:2,dia:1,minR:1,boom:1},
  ha9:{rng:7,cdS:4,n:1,dmg:300,kind:'pierce',sp:24,col:'#60b0ff',sz:.2,charge:1},
  ha10:{rng:15.2,rate:2,n:6,par:.42,dmg:200,kind:'bullet',sp:15,col:'#5ab0ff',sz:.12},
  hb1:{rng:19.2,rate:2,n:2,par:.46,dmgR:[10,200],kind:'bullet',sp:17,col:'#cfe0ff',sz:.12},
  hb2:{rng:6,rate:1,n:2,par:.6,dmg:200,kind:'bullet',sp:11,col:'#4aa8ff',sz:.22,spl:2.5,dia:1,kb:{p:1,d:1},boom:1},
  hb3:{rng:7,rate:2,n:4,par:.34,dmg:80,kind:'bullet',sp:18,col:'#c79bff',sz:.1},
  hb4:{rng:8,rate:1,n:2,par:.66,dmg:200,kind:'bullet',sp:13,col:'#58a8ff',sz:.5,ex:{hp:3000,m:5}},
  hb5:{rng:7,rate:1,n:3,par:.5,dmg:150,kind:'beam',col:'#5ad8ff',grow:5},
  hb6:{rng:8,cdS:3,n:1,dmg:500,kind:'bullet',sp:15,col:'#58a8ff',sz:.24,ex:{hp:4000,m:8}},
  hb7:{rng:8,rate:2,n:1,dmg:140,kind:'bullet',sp:16,col:'#ff5a5a',sz:.13},
  hb8:{rng:7,rate:3,n:2,par:.5,dmg:200,kind:'bullet',sp:19,col:'#ffe080',sz:.12,stun:{p:.2,t:.1}},
  hb9:{rng:8,rate:2,n:4,par:.3,dmg:80,kind:'bullet',sp:18,col:'#ffd860',sz:.11}};
Object.keys(TUR).forEach(k=>{TUR[k].id=k});
const NONT=['fc7','fc8','fc10','ic2','ic5','ic6','ic7','ic10'];
const C22T=NONT.concat(['fc9'],Object.keys(TUR));
const CFG={
  fc7:{rev:40},
  fc8:{slow:.1,zone:5},
  fc10:{hp:10000/DFB,cd:60,pad:1.6},
  ic2:{rate:80/DFB},
  ic5:{R:12,cd:50,life:7,per:3,dmg:120,sp:6,rad:2.6},
  ic6:{rate:1.1,dmg:1.05},
  ic7:{R:8,n:6},
  ic10:{R:9,n:20}};
window.c22Has=t=>C22T.includes(t);
{const o=window.c16Has;window.c16Has=t=>(o?o(t):false)||C22T.includes(t)}
/* ---------- đổi tên · kích thước · máu ---------- */
const ren=(t,n)=>{const b=BLD.find(x=>x.t===t);if(b)b.n=n;const u=UPD[t];if(u)u.n=n};
ren('ic2','Động Cơ Quạt 4 Cánh');ren('ic7','Radar Đánh Chặn');
{const b=BLD.find(x=>x.t==='fc7');if(b){b.w=2;b.h=2}}
HPB.fc7=3000;HPB.fc9=2000;
/* gắn cờ, bỏ hiệu ứng cũ — do c22 điều khiển */
NONT.concat(Object.keys(TUR)).forEach(t=>{const f=NBF[t];if(f){f.c22=t;f.k='aura';['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun','v','n','e','rng','cd','sp','spl','col','t','r'].forEach(k=>{delete f[k]});f.r=0}
  if(typeof BT!=='undefined'&&BT[t])delete BT[t]});
/* fc9 (hầm ngầm kiên cố) dùng lại cơ chế hầm của c21 (fc2): cùng một mạng hầm */
{const f=NBF.fc9;if(f){f.c21='fc2';f.k='aura';['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun','v','n'].forEach(k=>{delete f[k]});delete f.e;f.r=0}}
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
const per=c=>c.cdS?'1 lượt / '+fmt(c.cdS)+' giây':fmt(c.rate)+' lượt/giây';
function turRows(c,l,k){const r=[];
  if(c.kind==='cont')r.push(['Sát thương',nf(c.dps*k)+'/giây mỗi tia · '+c.lasers+' tia cùng lúc vào 1 mục tiêu']);
  else{
    const unit=c.kind==='missile'?'tên lửa':c.kind==='beam'?'tia':'viên';
    r.push(['Sát thương mỗi '+unit,c.dmgR?nf(c.dmgR[0]*k)+' – '+nf(c.dmgR[1]*k)+' (ngẫu nhiên, tùy may mắn)':nf(c.dmg*k)]);
    r.push(['Số '+unit+' mỗi lượt',c.n+(c.seq&&!c.burst&&c.n<5?' (bắn liên tiếp)':'')]);
    r.push(['Tốc độ bắn',per(c)])}
  r.push(['Tầm bắn',fmt(c.rng)+' ô · xoay 360°']);
  if(c.minR)r.push(['Tầm tối thiểu',fmt(c.minR)+' ô tính từ mép pháo (mục tiêu sát hơn không bắn được)']);
  if(c.spl)r.push(c.dia?['Vùng nổ','Rộng '+fmt(c.spl*2)+' ô']:['Bán kính nổ',fmt(c.spl)+' ô']);
  if(c.ex)r.push(['Mục tiêu từ '+nf(c.ex.hp)+' máu','Sát thương ×'+c.ex.m]);
  if(c.slow)r.push(['Làm chậm',Math.round((1-c.slow.k)*100)+'% trong '+c.slow.t+' giây']);
  if(c.stun)r.push(['Choáng','Xác suất '+Math.round(c.stun.p*100)+'% · '+fmt(c.stun.t)+' giây']);
  if(c.kb)r.push(['Đẩy lùi nhẹ',(c.kb.p<1?'Xác suất '+Math.round(c.kb.p*100)+'% · ':'')+fmt(c.kb.d)+' ô']);
  if(c.grow)r.push(['Mỗi tia trúng','Máu tối đa của tháp +'+c.grow]);
  if(c.mag)r.push(['Băng đạn',c.mag+' viên · nạp '+c.reload+' giây']);
  if(c.cdS&&c.charge)r.push(['Nạp năng lượng',fmt(c.cdS)+' giây mỗi phát']);
  if(c.hide)r.push(['Tên lửa tàng hình','2 giây đầu bay rồi mới lộ diện']);
  if(c.stealth)r.push(['Ẩn thân','Không thể bị phát hiện cho đến khi chịu sát thương']);
  if(c.rocket)r.push(['Trạm Nạp Tên Lửa','Được +10% tốc độ bắn, +5% sát thương']);
  return r}
const NOTE={
  ic1:'Bắn 2 tên lửa mỗi giây vào mục tiêu trong 6 ô, mỗi tên lửa 30 sát thương.',
  ic3:'Mỗi lượt phóng 2 tên lửa liên tiếp, mỗi tên lửa 90 sát thương, 2 lượt mỗi giây.',
  ic4:'Mỗi giây phóng 16 tên lửa nhỏ vào mục tiêu trong 7 ô, mỗi tên lửa 30 sát thương.',
  ic8:'Ẩn cho đến khi chịu sát thương. Phóng 4 tên lửa tàng hình mỗi giây (lộ sau 2 giây), 90 sát thương, tầm 20 ô.',
  ic9:'Phóng 4 tên lửa tầm trung mỗi giây, 200 sát thương, 10% đẩy lùi 1 ô, tầm 12 ô.',
  ha1:'Bắn 2 đạn xanh mỗi lượt, mỗi viên 90 sát thương, làm chậm 10% trong 1 giây, 2 lượt/giây, tầm 6 ô.',
  ha2:'Bắn đạn cam nổ, 80 sát thương, ×4 với mục tiêu từ 3.000 máu, 2 phát/giây, tầm 7 ô.',
  ha3:'Bắn đạn plasma xanh 200 sát thương, 3 phát mỗi giây, tầm 7 ô.',
  ha4:'Xoay nòng khi bắn: 12 viên/giây, mỗi viên 20 sát thương, băng 120 viên nạp 3 giây, tầm 6 ô.',
  ha5:'Bắn 3 đạn xanh liên tiếp, mỗi viên 29 sát thương, 2 lượt/giây, tầm 7 ô.',
  ha6:'Hai tia laser cùng lúc vào 1 mục tiêu trong 7 ô, mỗi tia 100 sát thương/giây.',
  ha7:'Nạp hồ quang 7 giây rồi bắn đạn hồ quang xanh 800 sát thương vào mục tiêu gần nhất trong 8 ô.',
  ha8:'Phóng đạn đại pháo xanh to 2 ô, vùng nổ rộng 4 ô, 400 sát thương; không bắn được mục tiêu sát trong 1 ô.',
  ha9:'Tụ lực 4 giây rồi bắn đạn plasma xanh xuyên mọi mục tiêu trong 7 ô, 300 sát thương mỗi mục tiêu.',
  ha10:'Bắn 6 đạn xanh cùng lúc, mỗi viên 200 sát thương, 2 lượt mỗi giây.',
  hb1:'Bắn đạn đôi, mỗi viên 10–200 sát thương tùy may mắn, 2 lượt mỗi giây.',
  hb2:'Bắn 2 đạn xanh nổ vùng rộng 5 ô, đẩy lùi 1 ô, 200 sát thương, tầm 6 ô.',
  hb3:'Bắn 4 đạn cùng lúc vào 1 mục tiêu trong 7 ô, mỗi viên 80 sát thương, 2 lượt/giây.',
  hb4:'Bắn 2 đạn xanh cỡ 1 ô mỗi giây, 200 sát thương, ×5 với mục tiêu từ 3.000 máu, tầm 8 ô.',
  hb5:'Bắn 3 tia laser xanh cùng lúc, mỗi tia 150 sát thương và +5 máu tối đa cho tháp, tầm 7 ô.',
  hb6:'3 giây bắn 1 đạn xanh 500 sát thương, ×8 với mục tiêu từ 4.000 máu, tầm 8 ô.',
  hb7:'Bắn 2 đạn đỏ mỗi giây, mỗi viên 140 sát thương, tầm 8 ô.',
  hb8:'Bắn 2 viên cùng lúc, 3 lượt/giây, 200 sát thương, 20% choáng 0,1 giây, tầm 7 ô.',
  hb9:'Mỗi lượt bắn 4 đạn vàng, 2 lượt/giây, mỗi viên 80 sát thương, tầm 8 ô.'};
Object.keys(TUR).forEach(t=>{const c=TUR[t];upd(t,(l,k)=>turRows(c,l,k),NOTE[t])});
upd('fc7',(l,k)=>[['Kích thước','2×2'],['Chặn sát thương','Bằng máu của tường'],['Hồi sinh','Tự dựng lại sau 40 giây kể từ lúc bị phá hủy']],
  'Bức tường bao cát 2×2 chặn đạn địch. Bị phá hủy sẽ tự hồi sinh sau 40 giây.');
upd('fc8',(l,k)=>[['Làm chậm','Tàu địch tiến vào căn cứ chậm đi 10%'],['Vùng tác dụng','Toàn bộ khu vực căn cứ (khung nét đứt xanh)'],['Cộng dồn','Không']],
  'Làm chậm 10% các tàu địch tiến vào căn cứ.');
upd('fc9',(l,k)=>[['Cách dùng','Tàu đồng minh đứng sát hầm 0,5 giây chui vào, ra ở hầm kế tiếp'],['Mạng hầm','Chung với Hầm Trú Ẩn Nhỏ'],['Chống kẹt','Mỗi tàu nghỉ 4 giây sau khi ra']],
  'Hầm ngầm kiên cố có máu cao, dịch chuyển tàu từ hầm này sang hầm khác (chung mạng với Hầm Trú Ẩn Nhỏ).');
upd('fc10',(l,k)=>[['Lớp phòng thủ trắng',nf(10000*k)+' sát thương bao quanh căn cứ'],['Kích hoạt','Sau khi lớp giáp Lưới Laser Bốn Điểm bị phá hủy'],['Hồi chiêu','60 giây']],
  'Khi lớp giáp của Lưới Laser Bốn Điểm bị phá hủy, dựng lớp phòng thủ trắng bao quanh căn cứ chặn 10.000 sát thương. Hồi chiêu 60 giây.');
upd('ic2',(l,k)=>[['Nạp khiên cho mọi công trình',nf(80*k)+' khiên/giây'],['Phạm vi','Toàn bộ căn cứ'],['Cộng dồn','Có (mỗi động cơ nạp riêng)']],
  'Động cơ quạt quay nạp năng lượng cho lớp khiên của mọi công trình trong căn cứ, hồi 80 khiên mỗi giây.');
upd('ic5',(l,k)=>[['Tích lực','50 giây'],['Cơn bão xanh','Bay đến mục tiêu trong 12 ô, tồn tại 7 giây'],['Sấm sét','3 tia mỗi giây, mỗi tia '+nf(120*k)+' sát thương']],
  'Tích lực 50 giây rồi tạo cơn bão xanh bay tới mục tiêu trong 12 ô, tồn tại 7 giây, mỗi giây đánh 3 tia sét 120 sát thương.');
upd('ic6',(l,k)=>[['Công trình tên lửa','Tăng 10% tốc độ bắn tên lửa'],['Sát thương tên lửa','Tăng 5%'],['Cộng dồn','Không']],
  'Giúp các công trình tên lửa bắn nhanh hơn 10% và gây thêm 5% sát thương.');
upd('ic7',(l,k)=>[['Tầm đánh chặn','8 ô'],['Đánh chặn','6 viên đạn địch mỗi giây (phá hủy đạn)']],
  'Khi có đạn của địch trong 8 ô, radar đánh chặn bằng cách phá hủy chúng, tối đa 6 viên mỗi giây.');
upd('ic10',(l,k)=>[['Tầm đánh chặn','9 ô'],['Đánh chặn','20 tên lửa của địch mỗi giây']],
  'Chuyên đánh chặn đạn phòng không từ tên lửa: đánh chặn 20 tên lửa mỗi giây trong phạm vi 9 ô.');

/* ---------- tiện ích ---------- */
const enemies=G=>G.en.filter(e=>!e.dead&&e.spawn<=G.t);
const ping=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.45,max:t||.45,col});
const boomFx=(G,x,y,r)=>G.fx.push({x,y,r,t:.6,max:.6,ex:1,rot:Math.random()*6.28});
const beam=(G,x1,y1,x2,y2,col,w,t)=>G.bm.push({x1,y1,x2,y2,t:t||.14,col,w:w||2});
const pop=(G,x,y,txt,col)=>{const L=G.c22pop=G.c22pop||[];if(L.length>36)L.shift();L.push({x,y,t:0,max:1.5,txt,col:col||'#ffe08a'})};
const tk=(G,dt)=>dt/((G.c18rc||1)*((PB(G).cdm)||1));
const effPush=(G,o)=>{(G.c22e=G.c22e||[]).push(o);return o};
const mapW=G=>G.wd?G.wd.Wd:99,mapH=G=>G.wd?G.wd.Hd:99;
const moveE=(G,e,x,y)=>{e.x=Math.max(.5,Math.min(mapW(G)-.5,x));e.y=Math.max(.5,Math.min(mapH(G)-.5,y))};
const alive=G=>G.bl.filter(o=>o.hp>0&&o.t!=='mine'&&!o.aux&&!o.u);
const near=(G,x,y,R,minR)=>{let t=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-x,e.y-y);if(q<(minR||0))return;if(q<=R+(e.size||2)*.3&&q<bd){bd=q;t=e}});return t};
/* khung bao quanh căn cứ (chỉ nở ra, không thu lại — giống Lưới Laser Bốn Điểm) */
function boxOf(G,m){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,n=0;
  alive(G).forEach(o=>{n++;const w=(o.w||1)/2,h=(o.h||1)/2;x0=Math.min(x0,o.x-w);x1=Math.max(x1,o.x+w);y0=Math.min(y0,o.y-h);y1=Math.max(y1,o.y+h)});
  if(n){const b=m&&m.bb;if(b){x0=Math.min(x0,b.x0);y0=Math.min(y0,b.y0);x1=Math.max(x1,b.x1);y1=Math.max(y1,b.y1)}const r={x0,y0,x1,y1,cx:(x0+x1)/2,cy:(y0+y1)/2};if(m)m.bb=r;return r}
  return m&&m.bb||null}

/* ---------- thời gian ---------- */
const rtk=(G,dt)=>dt/(G.c18rc||1);
const ENP=G=>(G.pr||[]).filter(p=>!p.dead&&p.team==='e');
const nets=G=>G.bl.filter(o=>o.hp>0&&o.nb&&o.nb.c19==='ne9'&&o.c19x);
const isMis=o=>{const t=o&&o.nb&&o.nb.c22;if(t&&TUR[t])return !!TUR[t].rocket;return !!o&&(['df4','df8','kn3'].includes(o.t)||!!(o.spec&&o.spec.k==='missile'))};
const stationOn=G=>!!(G&&G.bl&&G.bl.some(o=>o.hp>0&&o.nb&&o.nb.c22==='ic6'&&!o.c22off));
/* ---------- Chiến Hào Bao Cát (fc7): tường 2x2, vỡ thì tự hồi sinh sau 40 giây ---------- */
function fc7(b,dt,G){if(b.c22rv!=null)b.c22rv=null}
function reviveStep(G,dt){
  G.bl.forEach(b=>{if(!b.nb||b.nb.c22!=='fc7'||b.hp>0)return;
    if(b.c22rv==null){b.c22rv=CFG.fc7.rev;b.c22dn=(b.c22dn||0)+1;pop(G,b.x,b.y-1,'Tường vỡ · tự hồi sinh sau '+CFG.fc7.rev+'s','#e8d29a')}
    b.c22rv-=rtk(G,dt);
    if(b.c22rv<=0){b.hp=b.max;b.c22rv=null;b.flash=.4;b.shd=null;b.c22rvd=(b.c22rvd||0)+1;
      ping(G,b.x,b.y,Math.max(b.w,b.h)*1.2,'#f0dca0',.7);ping(G,b.x,b.y,Math.max(b.w,b.h)*.7,'#ffffff',.5);pop(G,b.x,b.y-1.2,'Chiến hào hồi sinh','#f6e6b0')}})}
/* ---------- Phòng Tuyến Kiểm Soát (fc8): phong tuyết làm chậm 10% tàu địch tiến vào căn cứ ---------- */
/* "vào căn cứ" = vào khu vực căn cứ của màn chơi (khung nét đứt xanh); không có khung đó (màn xem trước) thì lấy khung bao công trình + 5 ô */
function zoneOf(G){const R=G.wd&&G.wd.R;if(R&&R.x1>R.x0)return {x0:R.x0,y0:R.y0,x1:R.x1,y1:R.y1};const bb=boxOf(G);if(!bb)return null;const z=CFG.fc8.zone;return {x0:bb.x0-z,y0:bb.y0-z,x1:bb.x1+z,y1:bb.y1+z}}
function fc8(b,dt,G){const C=CFG.fc8,z=zoneOf(G);b.c22z=z;let n=0;if(!z){b.c22n=0;return}
  enemies(G).forEach(e=>{if(e.x<z.x0||e.x>z.x1||e.y<z.y0||e.y>z.y1)return;
    const k=(e.slowT>0?(e.slowK==null?1:e.slowK):1);e.slowK=Math.min(k,1-C.slow);e.slowT=Math.max(e.slowT||0,.3);e.c22sn=G.t;n++});
  b.c22n=n}
/* ---------- Pháo Đài Tuyến Phòng Thủ (fc10): sau khi Lưới Laser Bốn Điểm vỡ giáp → dựng lớp phòng thủ trắng 10.000, hồi chiêu 60 giây ---------- */
function fc10(b,dt,G){const C=CFG.fc10;let w=b.c22w;if(!w){const mx=C.hp*LV(b);w=b.c22w={hp:0,max:mx,cd:0,s:'idle',bb:null}}
  const N=nets(G);b.c22nn=N.length;
  if(w.s==='cd'){w.cd-=tk(G,dt);if(w.cd<=0){w.cd=0;w.s='idle';pop(G,b.x,b.y-b.h*.5-1,'Lớp trắng sẵn sàng','#ffffff')}}
  if(w.s==='idle'){
    if(N.some(o=>o.c19x.hp<=0)){w.hp=w.max;w.s='up';w.bb=null;boxOf(G,w);w.up=G.t;b.c22fl=G.t;b.c22bn=(b.c22bn||0)+1;
      const bb=w.bb;if(bb)[[bb.x0-C.pad,bb.y0-C.pad],[bb.x1+C.pad,bb.y0-C.pad],[bb.x1+C.pad,bb.y1+C.pad],[bb.x0-C.pad,bb.y1+C.pad]].forEach(p=>ping(G,p[0],p[1],1.3,'#ffffff',.7));
      beam(G,b.x,b.y,bb?bb.cx:b.x,bb?bb.cy:b.y,'#ffffff',4,.5);pop(G,b.x,b.y-b.h*.5-1,'Lớp phòng thủ trắng '+nf(w.max*DFB),'#ffffff')}}
  else if(w.s==='up'){boxOf(G,w);if(w.hp<=0){w.hp=0;w.s='cd';w.cd=C.cd;const bb=w.bb;if(bb)[[bb.x0,bb.y0],[bb.x1,bb.y0],[bb.x1,bb.y1],[bb.x0,bb.y1]].forEach(p=>ping(G,p[0],p[1],1.2,'#ffd0d0',.6));pop(G,b.x,b.y-b.h*.5-1,'Lớp trắng vỡ','#ffd0d0')}}}
/* lớp trắng hấp thụ sát thương lên công trình (chỉ khi không còn lưới laser nào đang có giáp) */
function whiteAbsorb(G,bd,d){
  if(nets(G).some(o=>o.c19x.hp>0))return d;
  G.bl.forEach(o=>{if(!(d>0)||o.hp<=0||!o.nb||o.nb.c22!=='fc10')return;const w=o.c22w;if(!w||w.s!=='up'||w.hp<=0)return;
    const bb=boxOf(G,w),P=CFG.fc10.pad;if(!bb||bd.x<bb.x0-P||bd.x>bb.x1+P||bd.y<bb.y0-P||bd.y>bb.y1+P)return;
    const a=Math.min(d,w.hp);w.hp-=a;d-=a;w.hitT=G.t;w.hx=bd.x;w.hy=bd.y;w.abs=(w.abs||0)+a;if(w.hp<=0)w.hp=0});
  return d}
/* ---------- Động Cơ Quạt 4 Cánh (ic2): nạp 80 khiên/giây cho khiên của mọi công trình ---------- */
function chargeAll(G,k){let n=0;
  G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine')return;
    const s=o.shd;if(s&&s.t>0&&s.max>0&&s.v<s.max-1e-9){s.v=Math.min(s.max,Math.max(0,s.v)+k);n++}
    [o.c19m,o.c19x,o.c22w].forEach(m=>{if(m&&m.hp>0&&m.max>0&&m.hp<m.max-1e-9){m.hp=Math.min(m.max,m.hp+k);n++}})});
  return n}
function ic2(b,dt,G){const C=CFG.ic2;const n=chargeAll(G,C.rate*LV(b)*dt);b.c22ch=n;b.c22sp=n>0?1:Math.max(0,(b.c22sp||0)-dt*2)}
/* ---------- Quạt Đẩy Bão Đạn (ic5): tích lực 50 giây → cơn bão xanh bay tới mục tiêu trong 12 ô, 3 tia sét/giây ---------- */
function pickStorm(G,b,x,y,R){let t=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-x,e.y-y);if(q<=R&&q<bd){bd=q;t=e}});return t}
function bolt(G,o,b,e){const C=CFG.ic5,d=C.dmg/20*LV(b)*(PB(G).dm||1);G.c19own=b;try{dfDmgS(e,d,false)}finally{G.c19own=null}
  o.bolts.push({x:e.x+(Math.random()-.5)*.5,y:e.y,t:0,max:.28,seed:Math.random()*100});o.nb=(o.nb||0)+1;
  ping(G,e.x,e.y,(e.size||2)*.55,'#9fe0ff',.28)}
function storm(G,b,tg){const C=CFG.ic5,o={k:'storm',b,x:b.x,y:b.y,tg,t:0,max:C.life,acc:0,bolts:[],n:0,rot:0};
  o.u=function(G,dt,o){let t=o.tg;if(!t||t.dead)t=o.tg=pickStorm(G,b,o.x,o.y,C.R*(PB(G).rm||1)+4);
    if(t){const dx=t.x-o.x,dy=t.y-o.y,l=Math.hypot(dx,dy);if(l>.2){const m=Math.min(l,C.sp*dt);o.x+=dx/l*m;o.y+=dy/l*m}}
    o.rot+=dt*5;o.bolts=o.bolts.filter(q=>(q.t+=dt)<q.max);
    o.acc=Math.min(o.acc+dt*C.per,1.6);
    while(o.acc>=1){let v=(o.tg&&!o.tg.dead&&Math.hypot(o.tg.x-o.x,o.tg.y-o.y)<=C.rad+(o.tg.size||2)*.3)?o.tg:null;
      if(!v)v=pickStorm(G,b,o.x,o.y,C.rad);if(!v){o.acc=Math.min(o.acc,1);break}
      o.acc-=1;bolt(G,o,b,v)}
    return false};
  return effPush(G,o)}
function ic5(b,dt,G){const C=CFG.ic5;if(b.c22cd==null)b.c22cd=C.cd;b.c22cd=Math.max(0,b.c22cd-tk(G,dt));if(b.c22cd>0)return;
  const tg=pickStorm(G,b,b.x,b.y,C.R*(PB(G).rm||1));if(!tg)return;
  b.c22cd=C.cd;b.c22fl=G.t;b.c22bn=(b.c22bn||0)+1;storm(G,b,tg);ping(G,b.x,b.y,Math.max(b.w,b.h)*.9,'#8fd8ff',.6);pop(G,b.x,b.y-b.h*.5-1,'Cơn bão xanh!','#bfe8ff')}
/* ---------- Trạm Nạp Tên Lửa Tự Động (ic6) ---------- */
function ic6(b,dt,G){let n=0;G.bl.forEach(o=>{if(o!==b&&o.hp>0&&isMis(o))n++});b.c22n=n}
/* ---------- Radar Đánh Chặn (ic7) · Tổ Hợp Phòng Không Vòng (ic10) ---------- */
function icept(b,dt,G,R,per,only,col){R*=(PB(G).rm||1);b.c22q=Math.min(per,(b.c22q||0)+per*dt);if(b.c22q<1)return;
  let c=0;for(const p of G.pr){if(b.c22q<1)break;if(p.dead||p.team!=='e')continue;if(only&&!only(p))continue;if(Math.hypot(p.x-b.x,p.y-b.y)>R)continue;
    p.dead=true;b.c22q-=1;c++;if(b.c22bm==null||G.t-b.c22bm>.05){b.c22bm=G.t;beam(G,b.x,b.y,p.x,p.y,col,2,.1)}G.fx.push({x:p.x,y:p.y,r:.38,t:.2,max:.2,col})}
  if(c){b.c22k=(b.c22k||0)+c;b.c22fl=G.t}}
function ic7(b,dt,G){const C=CFG.ic7;icept(b,dt,G,C.R,C.n,null,'#ffe08a')}
function ic10(b,dt,G){const C=CFG.ic10;icept(b,dt,G,C.R,C.n,p=>p.k==='missile','#ffb38a')}
const TICKN={fc7,fc8,fc10,ic2,ic5,ic6,ic7,ic10};

/* ================= Động cơ pháo / tên lửa riêng của c22 ================= */
const ROTK=t=>t[0]==='h';
const muzzle=(b,a,L,lat)=>({x:b.x+Math.cos(a)*L-Math.sin(a)*lat,y:b.y+Math.sin(a)*L+Math.cos(a)*lat});
const bore=(b,c)=>c.rot?Math.min(b.w,b.h)*.5:0;
const minRof=(b,c)=>c.minR?c.minR+Math.max(b.w,b.h)/2:0;
const latOf=(b,c,i,n)=>{
  if(c.barrels){b.c22br=(b.c22br||0)+Math.PI*2/c.barrels;return Math.sin(b.c22br)*.2}
  if(c.par){const w=Math.min(c.par*(n-1),Math.min(b.w,b.h)*.9),st=n>1?w/(n-1):0;return (i-(n-1)/2)*st}
  if(c.alt){if(n>1)return (i-(n-1)/2)*c.alt;b.c22bi=((b.c22bi||0)+1)%4;return (b.c22bi-1.5)*c.alt}
  return 0};
const dmgOf=(p,e)=>{let d=p.dmg;if(p.ex&&e.hp>=p.ex.hp)d*=p.ex.m;return d};
function kick(G,e,cx,cy,d,fx,fy){let dx=e.x-cx,dy=e.y-cy,l=Math.hypot(dx,dy);if(l<.06){dx=fx||0;dy=fy||-1;l=Math.hypot(dx,dy)||1}
  const T=.25;e.c22kb={vx:dx/l*d/T,vy:dy/l*d/T,t:T}}
function hurt(G,p,e,d){const c=p.cfg,o=p.own;G.c19own=o||null;try{dfDmgS(e,d,false)}finally{G.c19own=null}
  if(!c)return;
  if(c.slow){const k=(e.slowT>0?(e.slowK==null?1:e.slowK):1);e.slowK=Math.min(k,c.slow.k);e.slowT=Math.max(e.slowT||0,c.slow.t)}
  if(c.stun&&Math.random()<c.stun.p){e.stun=Math.max(e.stun||0,c.stun.t*(e.boss?.3:1));G.fx.push({x:e.x,y:e.y,r:.5,t:.2,max:.2,col:'#ffe888'})}
  if(c.kb&&!e.dead&&(c.kb.p>=1||Math.random()<c.kb.p))kick(G,e,p.x,p.y,c.kb.d,p.vx,p.vy);
  if(c.grow&&o&&o.hp>0){o.max+=c.grow/DFB;o.hp+=c.grow/DFB;o.c22gr=(o.c22gr||0)+c.grow}}
function explode(G,p,x,y,hit){const c=p.cfg,r=p.spl*(window.c17Spl?window.c17Spl(G):1);
  enemies(G).forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<r+(e.size||2)*.35)hurt(G,{cfg:c,own:p.own,x,y,vx:p.vx,vy:p.vy},e,dmgOf(p,e))});
  G.fx.push({x,y,r,t:.35,max:.35,col:p.col});if(r>=1.2)boomFx(G,x,y,r*.85);else G.fx.push({x,y,r:Math.max(.4,r*.8),t:.3,max:.3,col:'#ffb066'})}
function impact(G,p,hit){
  if(p.spl>0){explode(G,p,p.x,p.y,hit);return}
  if(hit){hurt(G,p,hit,dmgOf(p,hit));G.fx.push({x:p.x,y:p.y,r:.3+p.sz,t:.2,max:.2,col:p.col})}}
function projStep(G,dt){const L=G.c22p;if(!L||!L.length)return;const W=mapW(G),H=mapH(G),E=enemies(G);
  for(const p of L){if(p.dead)continue;p.age+=dt;
    if(p.kind==='lob'){const u=Math.min(1,p.age/p.dur);p.x=p.x0+(p.tx-p.x0)*u;p.y=p.y0+(p.ty-p.y0)*u;p.u=u;if(u>=1){p.dead=true;explode(G,p,p.tx,p.ty,null)}continue}
    if(p.turn){if(!p.tg||p.tg.dead){if(!p.rt||G.t-p.rt>.12){p.rt=G.t;p.tg=near(G,p.x,p.y,9)}}
      if(p.tg&&!p.tg.dead){const a=Math.atan2(p.tg.y-p.y,p.tg.x-p.x),v=Math.hypot(p.vx,p.vy);let ca=Math.atan2(p.vy,p.vx),da=a-ca;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
        ca+=Math.max(-p.turn*dt,Math.min(p.turn*dt,da));p.vx=Math.cos(ca)*v;p.vy=Math.sin(ca)*v}}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.tr){p.tr.push(p.x,p.y);if(p.tr.length>p.tl*2)p.tr.splice(0,2)}
    const out=p.x<-3||p.y<-3||p.x>W+3||p.y>H+3;
    if(p.pass){E.forEach(e=>{if(e.dead||p.hits.has(e))return;if(Math.hypot(e.x-p.x,e.y-p.y)<(e.size||2)*.42+p.hr){p.hits.add(e);hurt(G,p,e,dmgOf(p,e));G.fx.push({x:e.x,y:e.y,r:.5,t:.2,max:.2,col:p.col})}});
      if(p.life<=0||out)p.dead=true;continue}
    let hit=null;for(const e of E){if(e.dead)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<(e.size||2)*.42+p.hr){hit=e;break}}
    if(hit){p.dead=true;impact(G,p,hit)}
    else if(p.life<=0||out){p.dead=true;if(p.spl>0&&!out)explode(G,p,p.x,p.y,null)}}
  G.c22p=L.filter(p=>!p.dead)}
/* ---------- bắn ---------- */
function spawnP(G,b,c,tg,a0,lat){const pb=PB(G),boost=!!c.rocket&&stationOn(G),R=c.rng*(pb.rm||1);
  let dmg=c.dmgR?(c.dmgR[0]+Math.random()*(c.dmgR[1]-c.dmgR[0])):c.dmg;dmg=dmg/20*LV(b)*(pb.dm||1)*(boost?1.05:1);
  const m=muzzle(b,a0,bore(b,c),lat);let ah=Math.atan2(tg.y-m.y,tg.x-m.x);
  if(c.spread)ah+=(Math.random()-.5)*c.spread;if(c.jit)ah+=(Math.random()-.5)*c.jit*2;
  const p={x:m.x,y:m.y,vx:Math.cos(ah)*c.sp,vy:Math.sin(ah)*c.sp,dmg,kind:c.kind,cfg:c,col:c.col,sz:c.sz,spl:c.spl||0,own:b,ex:c.ex||null,age:0,hr:c.kind==='missile'?.06+c.sz*.3:c.sz*.5,hide:c.hide||0,tr:null,tl:7,seed:Math.random()*100,pass:0,turn:0,tg:null};
  if(c.kind==='missile'){p.tg=tg;p.turn=7;p.tr=[];p.life=(R+3)/c.sp+.8}
  else if(c.kind==='lob'){const d0=Math.hypot(tg.x-m.x,tg.y-m.y),dur=Math.max(.3,d0/c.sp);p.dur=dur;p.x0=m.x;p.y0=m.y;
    p.tx=Math.max(.3,Math.min(mapW(G)-.3,tg.x+(tg.c22vx||0)*dur*.9));p.ty=Math.max(.3,Math.min(mapH(G)-.3,tg.y+(tg.c22vy||0)*dur*.9));p.u=0;p.vx=Math.cos(ah)*c.sp;p.vy=Math.sin(ah)*c.sp;p.life=dur+1}
  else if(c.kind==='pierce'){p.pass=1;p.hits=new Set();p.life=(R+1.2)/c.sp;p.tr=[];p.tl=10}
  else p.life=(R+1.2)/c.sp;
  (G.c22p=G.c22p||[]).push(p);
  G.fx.push({x:m.x,y:m.y,r:.28+c.sz*.6,t:.1,max:.1,col:c.col});return p}
function hitscan(G,b,c,tg,a0,i,n){const pb=PB(G),lat=latOf(b,c,i,n),m=muzzle(b,a0,bore(b,c),lat);
  const d=c.dmg/20*LV(b)*(pb.dm||1),e=tg;const off=(i-(n-1)/2)*.16;
  const px=-Math.sin(a0),py=Math.cos(a0);
  beam(G,m.x,m.y,e.x+px*off,e.y+py*off,c.col,3,.14);
  hurt(G,{cfg:c,own:b,x:e.x,y:e.y,vx:Math.cos(a0),vy:Math.sin(a0)},e,(c.ex&&e.hp>=c.ex.hp)?d*c.ex.m:d);
  G.fx.push({x:e.x,y:e.y,r:.38,t:.16,max:.16,col:c.col})}
function fireShot(b,G,c,s){const R=c.rng*(PB(G).rm||1);let tg=s.tg;
  if(!tg||tg.dead)tg=near(G,b.x,b.y,R*1.15,minRof(b,c));if(!tg)return;
  const a=Math.atan2(tg.y-b.y,tg.x-b.x);b.c22a=a;
  if(c.kind==='beam'){hitscan(G,b,c,tg,a,s.i,s.n);return}
  spawnP(G,b,c,tg,a,latOf(b,c,s.i,s.n))}
function volley(b,G,c,tg){const n=c.n,seq=c.seq||0;b.c22fl=G.t;b.c22vn=(b.c22vn||0)+1;
  if(c.mag)b.c22mg=Math.max(0,(b.c22mg==null?c.mag:b.c22mg)-1);
  for(let i=0;i<n;i++){const s={t:i*seq,i,n,tg};if(s.t<=0)fireShot(b,G,c,s);else(b.c22qu=b.c22qu||[]).push(s)}}
function cont(b,dt,G,c,R){let tg=b.c22tg;
  if(!tg||tg.dead||Math.hypot(tg.x-b.x,tg.y-b.y)>R+(tg.size||2)*.3)tg=b.c22tg=near(G,b.x,b.y,R);
  if(!tg){b.c22on=0;return}
  const a=Math.atan2(tg.y-b.y,tg.x-b.x);b.c22a=a;b.c22on=1;b.c22fl=G.t;
  const d=c.dps/20*LV(b)*(PB(G).dm||1)*dt;
  for(let i=0;i<c.lasers;i++){const m=muzzle(b,a,bore(b,c),(i-(c.lasers-1)/2)*Math.min(c.par,Math.min(b.w,b.h)*.9));
    beam(G,m.x,m.y,tg.x,tg.y,c.col,3,.07);
    G.c19own=b;try{dfDmgS(tg,d,false)}finally{G.c19own=null}}
  if(!b.c22fx||G.t-b.c22fx>.12){b.c22fx=G.t;G.fx.push({x:tg.x+(Math.random()-.5)*.4,y:tg.y+(Math.random()-.5)*.4,r:.3,t:.14,max:.14,col:c.col})}}
function stealth(b,G){if(b.c22hp0==null)b.c22hp0=b.hp;if(b.hp<b.c22hp0-1e-9&&!b.c22rev){b.c22rev=1;b.c22revT=G.t;pop(G,b.x,b.y-b.h*.5-.8,'Lộ diện!','#ffb8a0');ping(G,b.x,b.y,Math.max(b.w,b.h)*.9,'#ffb8a0',.5)}
  b.c22hp0=b.hp;b.c22hid=!b.c22rev;if(b.c22hid)b.smk=Math.max(b.smk||0,.3)}
function turret(b,dt,G,c,reactor){const pb=PB(G),R=c.rng*(pb.rm||1),boost=!!c.rocket&&stationOn(G);b.c22boost=boost;
  if(c.stealth)stealth(b,G);
  const per=(c.cdS||1/c.rate)*reactor*(pb.cdm||1)*(G.c18rc||1)/(boost?1.1:1);b.c22per=per;
  if(b.c22cd==null)b.c22cd=c.charge?per:0;
  b.c22cd=Math.max(b.c22cd,-dt)-dt;
  if(c.mag){if(b.c22mg==null)b.c22mg=c.mag;
    if(b.c22mg<=0){if(b.c22rl==null)b.c22rl=c.reload*(pb.cdm||1)*(G.c18rc||1);b.c22rl-=dt;if(b.c22rl<=0){b.c22mg=c.mag;b.c22rl=null}}}
  if(b.c22qu&&b.c22qu.length){const L=b.c22qu;b.c22qu=[];for(const s of L){s.t-=dt;if(s.t>0)b.c22qu.push(s);else fireShot(b,G,c,s)}}
  if(c.kind==='cont'){cont(b,dt,G,c,R);return}
  if(b.c22cd>0)return;if(c.mag&&b.c22mg<=0)return;
  const tg=near(G,b.x,b.y,R,minRof(b,c));b.c22tg=tg;if(!tg)return;
  b.c22a=Math.atan2(tg.y-b.y,tg.x-b.x);volley(b,G,c,tg);b.c22cd+=per}
const TICK={};Object.keys(TICKN).forEach(k=>TICK[k]=TICKN[k]);Object.keys(TUR).forEach(k=>{TICK[k]=(b,dt,G,reactor)=>turret(b,dt,G,TUR[k],reactor||1)});
window.c22Tick=function(b,dt,G,reactor){const t=b.nb&&b.nb.c22;if(!t)return false;if(G.done)return true;const f=TICK[t];if(f)f(b,dt,G,reactor||1);return true};
/* ---------- hiệu ứng toàn trận ---------- */
function pre(G,dt){
  const E=G.c22e;if(E&&E.length){for(const o of E){o.t+=dt;let d=false;try{d=o.u?!!o.u(G,dt,o):false}catch(er){console.error(er);d=true}
      if(d||o.t>=o.max){o.dead=true;if(o.end)try{o.end(G,o)}catch(er){console.error(er)}}}
    G.c22e=E.filter(o=>!o.dead)}
  if(G.c22pop){G.c22pop.forEach(o=>o.t+=dt);G.c22pop=G.c22pop.filter(o=>o.t<o.max)}
  reviveStep(G,dt);
  (G.en||[]).forEach(e=>{if(e.dead)return;
    if(e.c22px!=null&&dt>0){e.c22vx=(e.x-e.c22px)/dt;e.c22vy=(e.y-e.c22py)/dt}
    if(e.c22kb){const k=e.c22kb,m=Math.min(dt,k.t);moveE(G,e,e.x+k.vx*m,e.y+k.vy*m);k.t-=dt;if(k.t<=0)e.c22kb=null}
    e.c22px=e.x;e.c22py=e.y});
  projStep(G,dt)}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.bl&&!G.done&&G.en)pre(G,dt)}catch(e){console.error(e)}return r}}
/* lớp phòng thủ trắng (fc10) */
{const _B=dfDmgB;dfDmgB=function(b,d){try{const G=DG;if(G&&G.bl&&b&&b.hp>0&&b.t!=='mine'&&d>0)d=whiteAbsorb(G,b,d)}catch(e){console.error(e)}
  if(!(d>0))return;return _B.call(this,b,d)}}
/* ic6: trạm nạp tên lửa — công trình tên lửa có sẵn bắn nhanh hơn 10%, sát thương +5% */
const MISOLD=['df4','df8','kn3'];
const oldMis=b=>!!b&&!(b.nb&&b.nb.c22)&&(MISOLD.includes(b.t)||!!(b.spec&&b.spec.k==='missile'));
/* tốc độ bắn: bớt thêm 10% thời gian hồi; sát thương +5% (qua hệ số G.pb.dm chỉ trong lượt của công trình đó) */
['c15Tick','c18Tick','c19Tick','c20Tick'].forEach(n=>{const _T=window[n];if(!_T)return;
  window[n]=function(b,dt,G,reactor){let on=false;try{on=!!(b&&G&&oldMis(b)&&stationOn(G))}catch(e){}
    if(!on)return _T.apply(this,arguments);
    if(b.cd>0)b.cd-=dt*.1;
    if(n==='c15Tick')return _T.apply(this,arguments);
    const had=G.pb,o=had?had.dm:1;if(had)had.dm=o*1.05;else G.pb={dm:1.05,cdm:1,rm:1};
    try{return _T.apply(this,arguments)}finally{if(had)had.dm=o;else G.pb=had}}});
{const _F=dfFire;dfFire=function(src,wp,tg,team){try{if(team==='p'&&wp&&wp.sp&&wp.sp.k==='missile'&&src&&!src.o&&stationOn(DG))wp=Object.assign({},wp,{dmg:wp.dmg*1.05})}catch(e){}return _F.call(this,src,wp,tg,team)}}
/* ================= vẽ ================= */
const lab=(q,x,y,t,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';q.strokeText(t,x,y);q.fillStyle=col||'#fff';q.fillText(t,x,y);q.restore()};
const dashRing=(q,x,y,r,col,w)=>{q.save();q.setLineDash([4,6]);q.strokeStyle=col;q.lineWidth=w||1.4;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
const cdArc=(q,px,py,r,f,col)=>{q.save();q.strokeStyle=col;q.lineWidth=3;q.beginPath();q.arc(px,py,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,Math.min(1,f)));q.stroke();q.restore()};
/* xoay pháo 360° (công trình hạng nặng) và làm mờ hầm tàng hình */
window.c22TRN=function(b,im,q,x,y,w,h){const t=b.nb&&b.nb.c22;if(!t)return false;const c=TUR[t];
  const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight);let dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;
  if(c&&c.stealth&&b.c22hid){q.globalAlpha=.38;q.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);q.globalAlpha=1;
    q.save();q.setLineDash([5,5]);q.strokeStyle='rgba(160,190,230,.5)';q.lineWidth=1.4;q.strokeRect(x+3,y+3,w-6,h-6);q.restore();return true}
  if(!c||!ROTK(t))return false;
  let ta=b.c22a;if(ta==null)ta=-Math.PI/2;if(b.c22ra==null)b.c22ra=ta;
  let df=ta-b.c22ra;df=Math.atan2(Math.sin(df),Math.cos(df));b.c22ra+=df*.25;
  const k=Math.min(1,1.4*Math.min(dw,dh)/Math.max(dw,dh));dw*=k;dh*=k;
  q.save();q.translate(x+w/2,y+h/2);q.rotate(b.c22ra+Math.PI/2);q.drawImage(im,-dw/2,-dh/2,dw,dh);q.restore();return true};
{const _T=window.TRN;window.TRN=function(b,im,q,x,y,w,h){if(b&&b.nb&&b.nb.c22&&!b.u&&window.c22TRN&&window.c22TRN(b,im,q,x,y,w,h))return true;return _T?_T.apply(this,arguments):false}}
function drawP(q,p,X,Y,s,T){
  if(p.hide&&p.age<p.hide)return;
  const x=X(p.x),y=Y(p.y),a=Math.atan2(p.vy,p.vx),col=p.col,sz=Math.max(1.5,p.sz*s);
  q.save();
  if(p.kind==='missile'){
    if(p.tr&&p.tr.length>=4){q.lineCap='round';q.strokeStyle=col;q.globalAlpha=.35;q.lineWidth=Math.max(1,sz*.6);q.beginPath();q.moveTo(X(p.tr[0]),Y(p.tr[1]));for(let i=2;i<p.tr.length;i+=2)q.lineTo(X(p.tr[i]),Y(p.tr[i+1]));q.lineTo(x,y);q.stroke();q.globalAlpha=1}
    q.translate(x,y);q.rotate(a);q.fillStyle='#eef2ff';q.fillRect(-sz*1.2,-sz*.38,sz*2.3,sz*.76);q.fillStyle=col;q.beginPath();q.moveTo(sz*1.1,-sz*.38);q.lineTo(sz*1.8,0);q.lineTo(sz*1.1,sz*.38);q.fill();
    q.globalCompositeOperation='lighter';q.fillStyle='rgba(255,170,70,.85)';q.beginPath();q.ellipse(-sz*1.4,0,sz*(.9+.3*Math.sin(T*40+p.seed)),sz*.34,0,0,7);q.fill()}
  else if(p.kind==='lob'){
    const u=p.u||0,hgt=Math.sin(Math.PI*u)*s*Math.max(1.2,p.dur*2.2);
    q.fillStyle='rgba(0,0,0,.28)';q.beginPath();q.ellipse(x,y,sz*.9,sz*.5,0,0,7);q.fill();
    q.translate(x,y-hgt);q.shadowColor=col;q.shadowBlur=14;q.fillStyle=col;q.beginPath();q.arc(0,0,sz*.75,0,7);q.fill();q.fillStyle='#e8f6ff';q.beginPath();q.arc(-sz*.18,-sz*.2,sz*.34,0,7);q.fill()}
  else if(p.kind==='pierce'){
    q.translate(x,y);q.rotate(a);const L=s*2.2;const g=q.createLinearGradient(-L,0,sz,0);g.addColorStop(0,col+'00');g.addColorStop(1,col);
    q.globalCompositeOperation='lighter';q.fillStyle=g;q.beginPath();q.moveTo(-L,0);q.lineTo(0,-sz*.8);q.lineTo(sz*.8,0);q.lineTo(0,sz*.8);q.closePath();q.fill();
    q.fillStyle='#fff';q.beginPath();q.arc(0,0,sz*.5,0,7);q.fill()}
  else if(p.cfg&&p.cfg.arc){
    q.translate(x,y);q.globalCompositeOperation='lighter';q.shadowColor=col;q.shadowBlur=18;q.fillStyle=col;q.beginPath();q.arc(0,0,sz*.85,0,7);q.fill();
    q.strokeStyle='#e8fbff';q.lineWidth=1.6;q.beginPath();for(let i=0;i<6;i++){const an=hz(p.seed+i+Math.floor(T*14))*6.28,r=sz*(1.1+hz(i+3)*.9);q.moveTo(0,0);q.lineTo(Math.cos(an)*r,Math.sin(an)*r)}q.stroke()}
  else if(p.cfg&&p.cfg.plasma){
    q.translate(x,y);q.globalCompositeOperation='lighter';q.shadowColor=col;q.shadowBlur=16;q.fillStyle=col;q.beginPath();q.arc(0,0,sz*.9,0,7);q.fill();
    q.fillStyle='#fff';q.beginPath();q.arc(0,0,sz*.45,0,7);q.fill();q.strokeStyle=col;q.lineWidth=1.4;q.beginPath();q.arc(0,0,sz*(1.2+.2*Math.sin(T*18)),0,7);q.stroke()}
  else{
    q.translate(x,y);q.rotate(a);q.globalCompositeOperation='lighter';q.shadowColor=col;q.shadowBlur=9;
    const L=sz*(2.2+Math.min(3,p.cfg.sp/8)),g=q.createLinearGradient(-L,0,sz,0);g.addColorStop(0,col+'00');g.addColorStop(1,col);
    q.fillStyle=g;q.beginPath();q.ellipse(-L*.35,0,L*.65,sz*.62,0,0,7);q.fill();q.fillStyle='#fff';q.beginPath();q.arc(sz*.2,0,sz*.42,0,7);q.fill()}
  q.restore()}
function drawStorm(q,o,G,X,Y,s,T){const px=X(o.x),py=Y(o.y),R=CFG.ic5.rad*s,up=Math.min(1,o.t/.5),fade=Math.min(1,(o.max-o.t)/.8);
  q.save();q.globalAlpha=Math.max(.2,Math.min(up,fade));
  const g=q.createRadialGradient(px,py,0,px,py,R*1.3);g.addColorStop(0,'rgba(120,200,255,.5)');g.addColorStop(.6,'rgba(50,110,220,.32)');g.addColorStop(1,'rgba(20,60,160,0)');
  q.fillStyle=g;q.beginPath();q.arc(px,py,R*1.3,0,7);q.fill();
  q.globalCompositeOperation='lighter';q.lineCap='round';
  for(let i=0;i<4;i++){const a0=o.rot*(1+i*.18)+i*1.57,r=R*(.35+.18*i);q.strokeStyle='rgba(140,215,255,'+(.7-.1*i)+')';q.lineWidth=2.4;q.beginPath();q.arc(px,py,r,a0,a0+Math.PI*1.1);q.stroke()}
  o.bolts.forEach(bq=>{const u=bq.t/bq.max,bx=X(bq.x),by=Y(bq.y);q.globalAlpha=1-u;q.strokeStyle='#e6fbff';q.shadowColor='#7ad0ff';q.shadowBlur=14;q.lineWidth=2.4;
    q.beginPath();let cx=bx+(hz(bq.seed)-.5)*s*.6,cy=by-s*4.2;q.moveTo(cx,cy);for(let i=1;i<=6;i++){const f=i/6;cx=bx+(hz(bq.seed+i)-.5)*s*.9*(1-f);cy=by-s*4.2*(1-f);q.lineTo(cx,cy)}q.stroke()});
  q.restore();lab(q,px,py-R*1.15,'Bão '+Math.ceil(o.max-o.t)+'s','#bfe8ff',10)}
function fanDraw(q,b,G,X,Y,s,T){const px=X(b.x),py=Y(b.y),r=Math.min(b.w,b.h)*s*.46,sp=b.c22sp||0;b.c22fa=(b.c22fa||0)+(2.2+9*sp)*(G.dtc||.02);
  q.save();q.translate(px,py);q.rotate(b.c22fa);q.globalCompositeOperation='lighter';
  for(let i=0;i<4;i++){q.rotate(Math.PI/2);const g=q.createLinearGradient(0,0,r,0);g.addColorStop(0,'rgba(160,230,255,.55)');g.addColorStop(1,'rgba(90,170,255,.08)');q.fillStyle=g;q.beginPath();q.ellipse(r*.55,0,r*.5,r*.2,0,0,7);q.fill()}
  q.fillStyle='rgba(220,248,255,.9)';q.beginPath();q.arc(0,0,r*.14,0,7);q.fill();q.restore();
  if(sp>0){q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(130,220,255,'+(.3+.25*Math.sin(T*9))+')';q.lineWidth=2;q.beginPath();q.arc(px,py,r*(1.05+.08*Math.sin(T*9)),0,7);q.stroke();q.restore()}}
function snowDraw(q,b,G,X,Y,s,T){const z=b.c22z;if(!z)return;const x0=X(z.x0),y0=Y(z.y0),w=(z.x1-z.x0)*s,h=(z.y1-z.y0)*s;
  q.save();q.fillStyle='rgba(190,225,255,.06)';q.fillRect(x0,y0,w,h);q.setLineDash([9,8]);q.strokeStyle='rgba(190,225,255,.45)';q.lineWidth=1.5;q.strokeRect(x0,y0,w,h);q.setLineDash([]);
  q.beginPath();q.rect(x0,y0,w,h);q.clip();q.fillStyle='rgba(240,248,255,.85)';
  const N=Math.min(80,Math.max(20,Math.round(w*h/(s*s)/3)));
  for(let i=0;i<N;i++){const px=x0+(((hz(i)+.04*Math.sin(T*.8+i)+T*.01*hz(i+4))%1)+1)%1*w,py=y0+((hz(i+31)+T*(.07+.08*hz(i+5)))%1)*h;q.beginPath();q.arc(px,py,s*(.03+.05*hz(i+7)),0,7);q.fill()}
  q.restore();
  enemies(G).forEach(e=>{if(e.c22sn!=null&&G.t-e.c22sn<.4)lab(q,X(e.x),Y(e.y)-(e.size||2)*s*.62,'❄ −10%','#d8f0ff',10)})}
function whiteDraw(q,b,G,X,Y,s,T){const w=b.c22w;if(!w||w.s!=='up'||!w.bb)return;const P=CFG.fc10.pad,bb=w.bb,x0=X(bb.x0-P),y0=Y(bb.y0-P),W=(bb.x1-bb.x0+2*P)*s,H=(bb.y1-bb.y0+2*P)*s,f=Math.max(0,w.hp/w.max),hit=w.hitT!=null?Math.max(0,1-(G.t-w.hitT)/.35):0;
  q.save();q.shadowColor='#fff';q.shadowBlur=14+14*hit;q.lineWidth=Math.max(3,s*.16);q.strokeStyle='rgba(255,255,255,'+(.45+.45*f)+')';q.fillStyle='rgba(255,255,255,'+(.04+.08*f+.18*hit)+')';
  q.beginPath();RR(q,x0,y0,W,H,s*1.2);q.fill();q.stroke();q.shadowBlur=0;q.lineWidth=1.2;q.strokeStyle='rgba(255,255,255,'+(.22+.2*Math.sin(T*3))+')';q.beginPath();RR(q,x0+s*.28,y0+s*.28,W-s*.56,H-s*.56,s);q.stroke();q.restore();
  lab(q,x0+W/2,y0-s*.3,'Lớp phòng thủ trắng '+nf(w.hp*DFB)+'/'+nf(w.max*DFB),'#ffffff',11)}
function sweepDraw(q,b,G,X,Y,s,T,R,col){const px=X(b.x),py=Y(b.y);dashRing(q,px,py,R*s,col+'55');
  q.save();q.globalCompositeOperation='lighter';const a=T*3.2;const g=q.createRadialGradient(px,py,0,px,py,R*s);g.addColorStop(0,col+'00');g.addColorStop(1,col+'44');
  q.fillStyle=g;q.beginPath();q.moveTo(px,py);q.arc(px,py,R*s,a-.5,a);q.closePath();q.fill();q.restore()}
function info(b,G){const c=b.nb.c22,t=Math.ceil,C=TUR[c];
  switch(c){
  case'fc7':return null;
  case'fc8':return ['Phong tuyết · '+(b.c22n||0)+' tàu bị chậm','#cfe8ff'];
  case'fc9':return null;
  case'fc10':{const w=b.c22w;if(!w||w.s==='idle')return !(b.c22nn>0)?['Cần Lưới Laser Bốn Điểm','#d8d8e8']:['Chờ lưới laser vỡ giáp','#ffffff'];
    return w.s==='up'?['Lớp trắng '+nf(w.hp*DFB),'#ffffff']:['Hồi chiêu '+t(w.cd)+'s','#d8d8e8']}
  case'ic2':return ['Nạp khiên · '+(b.c22ch||0)+' lớp','#9fe8ff'];
  case'ic5':return b.c22cd>0?['Tích lực '+t(b.c22cd)+'s','#8fd0ff']:['Sẵn sàng tạo bão','#8fd0ff'];
  case'ic6':return ['Tăng tốc · '+(b.c22n||0)+' công trình tên lửa','#ffd27a'];
  case'ic7':return ['Radar · đã chặn '+(b.c22k||0),'#ffe08a'];
  case'ic10':return ['Phòng không · chặn '+(b.c22k||0)+' tên lửa','#ffb38a'];
  case'ic8':return b.c22hid?['Ẩn thân','#9fb4d8']:['Đã lộ diện','#ffb8a0'];
  case'ha4':return b.c22rl!=null?['Nạp đạn '+t(b.c22rl)+'s','#ffd860']:['Đạn '+(b.c22mg==null?C.mag:b.c22mg)+'/'+C.mag,'#ffd860'];
  case'hb5':return b.c22gr?['Máu tối đa +'+nf(b.c22gr),'#7ee8ff']:null;
  default:return null}}
window.c22Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  G.bl.forEach(b=>{const c=b.nb&&b.nb.c22;if(!c)return;const px=X(b.x),py=Y(b.y);
    if(b.hp<=0){if(c==='fc7'&&b.c22rv!=null){const f=1-b.c22rv/CFG.fc7.rev;cdArc(q,px,py,Math.max(b.w,b.h)*s*.4,f,'rgba(240,215,150,.9)');lab(q,px,py+4,'Hồi sinh '+Math.ceil(b.c22rv)+'s','#f6e6b0',11)}return}
    const top=py-b.h*s*.62;
    if(c==='fc8')snowDraw(q,b,G,X,Y,s,T);
    else if(c==='fc10'){whiteDraw(q,b,G,X,Y,s,T);const w=b.c22w;cdArc(q,px,py,b.w*s*.62,w&&w.s==='cd'?1-w.cd/CFG.fc10.cd:1,'rgba(255,255,255,.85)')}
    else if(c==='ic2')fanDraw(q,b,G,X,Y,s,T);
    else if(c==='ic5')cdArc(q,px,py,b.w*s*.62,b.c22cd>0?1-b.c22cd/CFG.ic5.cd:1,'rgba(140,210,255,.9)');
    else if(c==='ic6'){if(b.c22fl!=null)G.bl.forEach(o=>{if(o!==b&&o.hp>0&&isMis(o)){q.save();q.setLineDash([3,7]);q.strokeStyle='rgba(255,210,120,.28)';q.lineWidth=1.2;q.beginPath();q.moveTo(px,py);q.lineTo(X(o.x),Y(o.y));q.stroke();q.restore()}})}
    else if(c==='ic7')sweepDraw(q,b,G,X,Y,s,T,CFG.ic7.R*(PB(G).rm||1),'#ffe08a');
    else if(c==='ic10')sweepDraw(q,b,G,X,Y,s,T,CFG.ic10.R*(PB(G).rm||1),'#ffb38a');
    else if(TUR[c]){const C=TUR[c];
      if(C.charge){const f=b.c22per?1-Math.max(0,Math.min(1,b.c22cd/b.c22per)):1,a=b.c22ra!=null?b.c22ra:(b.c22a!=null?b.c22a:-Math.PI/2),m=muzzle(b,a,bore(b,C),0),mx=X(m.x),my=Y(m.y);
        q.save();q.globalCompositeOperation='lighter';const r=s*(.1+.3*f)*(1+.12*Math.sin(T*14)),g=q.createRadialGradient(mx,my,0,mx,my,r*2);g.addColorStop(0,'#ffffff');g.addColorStop(.35,C.col);g.addColorStop(1,C.col+'00');q.fillStyle=g;q.beginPath();q.arc(mx,my,r*2,0,7);q.fill();q.restore()}
      if(c==='ha4'){const a=b.c22ra!=null?b.c22ra:-Math.PI/2,m=muzzle(b,a,bore(b,C),0),mx=X(m.x),my=Y(m.y);q.save();q.fillStyle='rgba(255,216,96,.9)';for(let i=0;i<7;i++){const an=(b.c22br||0)+i*Math.PI*2/7;q.beginPath();q.arc(mx+Math.cos(an)*s*.16,my+Math.sin(an)*s*.16,s*.04,0,7);q.fill()}q.restore()}
      if(C.stealth&&b.c22hid){/* đã vẽ mờ trong c22TRN */}}
    const L=info(b,G);if(L)lab(q,px,top,L[0],L[1],10)});
  (G.c22e||[]).forEach(o=>{try{if(o.k==='storm')drawStorm(q,o,G,X,Y,s,T)}catch(e){}});
  (G.c22p||[]).forEach(p=>{if(!p.dead)try{drawP(q,p,X,Y,s,T)}catch(e){}});
  (G.c22pop||[]).forEach(o=>{const u=o.t/o.max;q.save();q.globalAlpha=Math.min(1,(1-u)*2);lab(q,X(o.x),Y(o.y)-u*s*1.3,o.txt,o.col,11);q.restore()})};
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{window.c22Draw(q,G,X,Y,s,T)}catch(e){console.error(e)}}}

/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở ---------- */
(function(){
const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;
const {mkBld,mkEn,shell}=H;
const txt=(q,s,x,y,col,sz,al)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign=al||'center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
const safe=o=>{['init','step','under','over'].forEach(k=>{const f=o[k];if(f)o[k]=function(){try{return f.apply(this,arguments)}catch(e){console.error('c22 sc',o.title,e)}}});return o};
const expire=G=>{G.bl.forEach(b=>{if(b.shd&&b.shd.t>0&&b.shd.t<9000){b.shd.t-=G.dtc||.02;if(b.shd.t<=0)b.shd=null}})};
const T0=(G,dt)=>{G.dtc=dt;pre(G,dt);expire(G)};
const solid=b=>{b.hp=b.max};
const mkE=(G,c,x,y,hp)=>{const e=mkEn(G,c,x,y,hp||1e9);e.noRev=true;e.hx=e.x;e.hy=e.y;e.hpb=1;return e};
const initC=(G,c,rc)=>{G.c18sim=1;G.c19sim=1;G.c20sim=1;G.c21sim=1;G.c22sim=1;G.pvp=false;if(rc)G.c18rc=rc};
const mkSh=(G,x,y,tx,ty,dmg,sp)=>shell(G,x,y,tx,ty,dmg,sp||9);
const hqOf=(G,x,y,max)=>{const h=mkBld(G,'hq4',x,y,{w:4,h:4,max:max||60});h.hq=true;h.hp=h.max;G.hq=h;return h};
const bn=t=>((BLD.find(b=>b.t===t)||{}).n||t).toUpperCase();
/* ghi lại sát thương gây ra để hiển thị số/giây (3 giây gần nhất) */
function track(c,G,e){if(e._h==null)e._h=e.hp;if(e.hp<e._h)(c.log=c.log||[]).push([G.t,(e._h-e.hp)*20]);e._h=e.hp;
  if(c.log)c.log=c.log.filter(x=>G.t-x[0]<3)}
const dps=(c,G)=>{const L=c.log||[];if(!L.length)return 0;const t0=Math.max(.5,Math.min(3,G.t));return L.reduce((a,x)=>a+x[1],0)/t0};
/* ---------- khung chung cho 24 tháp / bệ phóng ---------- */
function turScene(t,opt){opt=opt||{};const C=TUR[t];
  return safe({title:bn(t),note:opt.note||NOTE[t],
    init(G,c){initC(G,c,opt.rc);const d=BLD.find(x=>x.t===t),by=Math.min(7.5,9.8-d.h/2);c.b=mkBld(G,t,7.5,by,{lv:c.lv});c.by=by;c.e1=mkE(G,c,7.5,3.6);c.es=[c.e1];c.ph=0;c.log=[];
      if(opt.two||C.ex){c.e2=mkEn(G,c,9.5,4.4,C.ex?Math.max(500,C.ex.hp*.4):6000);c.e2.noRev=false;c.es.push(c.e2)}
      if(C.minR){c.e3=mkE(G,c,7.5,by-d.h/2-.55);c.es.push(c.e3)}},
    step(G,dt,c){c.ph+=dt;T0(G,dt);solid(c.b);
      c.e1.x=7.5+3.0*Math.sin(c.ph*.55);c.e1.y=3.5+.5*Math.sin(c.ph*.8);
      if(c.e2){const px=c.e2.x;c.e2.x=7.5+3.0*Math.sin(c.ph*.55+(C.ex?2.6:.7));c.e2.y=4.5+.4*Math.sin(c.ph*.6+1)}
      if(c.e3){c.e3.x=7.5;c.e3.y=c.by-c.b.h/2-.55}
      window.c22Tick(c.b,dt,G,1);c.es.forEach(e=>track(c,G,e))},
    over(q,G,c,X,Y,s){const d=dps(c,G),b=c.b;
      if(C.ex){txt(q,'Mục tiêu từ '+nf(C.ex.hp)+' máu: sát thương ×'+C.ex.m,X(c.e1.x),Y(c.e1.y)-c.e1.size*s*.7,'#ffd27a',10);
        txt(q,'Dưới '+nf(C.ex.hp)+' máu: sát thương ×1',X(c.e2.x),Y(c.e2.y)-c.e2.size*s*.7,'#bfd8ff',10)}
      if(c.e3)txt(q,'Sát mép pháo (≤1 ô): không bắn được',X(c.e3.x),Y(c.e3.y)-c.e3.size*s*.7,'#ffb0a0',10);
      let l2='';if(C.mag)l2=b.c22rl!=null?' · nạp đạn '+Math.ceil(b.c22rl)+'s':' · đạn '+(b.c22mg==null?C.mag:b.c22mg)+'/'+C.mag;
      if(C.charge&&b.c22per)l2=' · nạp '+Math.round(100*Math.max(0,Math.min(1,1-b.c22cd/b.c22per)))+'%';
      if(C.grow)l2=' · máu tối đa +'+nf(b.c22gr||0);
      if(C.stealth)l2=b.c22hid?' · ĐANG ẨN THÂN':' · ĐÃ LỘ DIỆN';
      if(!C.ex)txt(q,'Gây ≈ '+nf(d)+' sát thương/giây'+(c.es.length>1?' (tổng)':'')+l2,X(7.5),Y(9.9),'#ffe08a',11);
      else txt(q,'Hai mục tiêu: lớn / nhỏ'+l2,X(7.5),Y(9.9),'#ffe08a',11)}})}
Object.keys(TUR).forEach(t=>{if(t==='ic8'||t==='ic6')return;SC[t]=turScene(t,{two:['ha8','hb2','ha9','ha10','ic4'].includes(t)})});
/* ---------- fc7 ---------- */
SC.fc7=safe({title:'CHIẾN HÀO BAO CÁT',note:'Tường bao cát 2×2 chặn được 3.000 sát thương; vỡ thì tự hồi sinh sau 40 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.b=mkBld(G,'fc7',7.5,6.5,{lv:c.lv});c.es=[mkE(G,c,5.6,1.2),mkE(G,c,9.4,1.2)];c.t1=0;c.rv=0},
  step(G,dt,c){T0(G,dt);window.c22Tick(c.b,dt,G,1);c.t1-=dt;if(c.t1<=0&&c.b.hp>0){c.t1=.14;const e=c.es[(Math.random()*2)|0];mkSh(G,e.x,e.y+.5,c.b.x+(Math.random()-.5)*1.4,c.b.y-.8,.9,10)}
    if(c.b.c22rvd)c.rv=c.b.c22rvd},
  over(q,G,c,X,Y,s){const b=c.b;txt(q,b.hp>0?'Chiến hào '+nf(b.hp*DFB)+'/'+nf(b.max*DFB):'Tường đã vỡ · hồi sinh sau '+Math.ceil(b.c22rv||0)+' giây (×0,1)',X(7.5),Y(9.9),'#f6e6b0',11);
    if(c.rv)txt(q,'Đã hồi sinh '+c.rv+' lần',X(7.5),Y(9.4),'#bfeaff',10)}});
/* ---------- fc8 ---------- */
SC.fc8=safe({title:'PHÒNG TUYẾN KIỂM SOÁT',note:'Phong tuyết làm chậm 10% các tàu địch tiến vào căn cứ (vùng nét đứt: khu vực căn cứ)',
  init(G,c){initC(G,c);G.wd={R:{x0:.8,y0:2.4,x1:11.0,y1:9.9,k:0},Wd:15,Hd:10};c.b=mkBld(G,'fc8',6.0,7.6,{lv:c.lv});c.w=mkBld(G,'wall',8.0,7.2,{w:2,h:1,max:30});c.a=mkE(G,c,4.5,-1.5);c.a.sp=1.8;c.b2=mkE(G,c,12.9,-1.5);c.b2.sp=1.8;c.ph=0},
  step(G,dt,c){T0(G,dt);solid(c.b);solid(c.w);window.c22Tick(c.b,dt,G,1);
    [c.a,c.b2].forEach(e=>{e.y+=e.sp*(e.slowT>0?(e.slowK||1):1)*dt;if(e.slowT>0)e.slowT-=dt;else e.slowK=1;if(e.y>5.6){e.y=-1.5}})},
  over(q,G,c,X,Y,s){const sa=c.a.slowT>0?(c.a.slowK||1):1;txt(q,'Trong khu căn cứ: tốc độ '+Math.round(sa*100)+'%',X(c.a.x),Y(c.a.y)+c.a.size*s*.85,sa<1?'#d8f0ff':'#ffffff',10);
    txt(q,'Ngoài: 100%',X(c.b2.x),Y(c.b2.y)+c.b2.size*s*.85,'#ffffff',10)}});
/* ---------- fc10 ---------- */
SC.fc10=safe({title:'PHÁO ĐÀI TUYẾN PHÒNG THỦ',note:'Sau khi Lưới Laser Bốn Điểm bị phá hủy giáp, dựng lớp phòng thủ trắng chặn 10.000 sát thương, hồi chiêu 60 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.h=hqOf(G,9.2,5.0,400);c.n=mkBld(G,'ne9',3.4,7.6,{lv:c.lv});c.b=mkBld(G,'fc10',12.6,8.0,{lv:c.lv});c.es=[mkE(G,c,6.4,.5),mkE(G,c,11.5,.2)];c.t1=0},
  step(G,dt,c){T0(G,dt);solid(c.b);solid(c.n);if(c.h.hp<c.h.max*.5)c.h.hp=c.h.max;window.C19.TICK.ne9(c.n,dt,G);window.c22Tick(c.b,dt,G,1);
    c.t1-=dt;if(c.t1<=0){c.t1=.12;const e=c.es[(Math.random()*2)|0];mkSh(G,e.x,e.y+.5,c.h.x+(Math.random()-.5)*2,c.h.y-1,2.2,10)}},
  over(q,G,c,X,Y,s){const m=c.n.c19x,w=c.b.c22w;txt(q,(m?(m.hp>0?'Lưới laser '+nf(m.hp*DFB):'Lưới laser đã vỡ'):'…')+' · '+(w?(w.s==='up'?'lớp trắng '+nf(w.hp*DFB)+'/'+nf(w.max*DFB):w.s==='cd'?'lớp trắng hồi chiêu '+Math.ceil(w.cd)+'s':'lớp trắng chờ lưới vỡ'):''),X(7.5),Y(9.9),'#ffffff',11)}});
/* ---------- ic2 ---------- */
SC.ic2=safe({title:bn('ic2'),note:'Động cơ quạt quay nạp năng lượng cho khiên của toàn bộ công trình trong căn cứ: +80 khiên mỗi giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'ic2',7.5,7.2,{lv:c.lv});c.w1=mkBld(G,'wall',3.6,6.6,{w:2,h:1,max:30});c.w2=mkBld(G,'wall',11.4,6.6,{w:2,h:1,max:30});
    [c.w1,c.w2].forEach(w=>{w.shd={v:0,t:9999,max:400/DFB}});c.es=[mkE(G,c,3.6,1.2),mkE(G,c,11.4,1.2)];c.t1=0;c.k=0},
  step(G,dt,c){T0(G,dt);solid(c.b);solid(c.w1);solid(c.w2);window.c22Tick(c.b,dt,G,1);
    c.t1-=dt;if(c.t1<=0){c.t1=.6;c.k++;const w=c.k%2?c.w1:c.w2,e=c.k%2?c.es[0]:c.es[1];mkSh(G,e.x,e.y+.5,w.x,w.y-.3,2,10)}},
  over(q,G,c,X,Y,s){[c.w1,c.w2].forEach(w=>{const v=w.shd?w.shd.v*DFB:0;txt(q,'Khiên '+nf(v)+'/'+nf(w.shd.max*DFB),X(w.x),Y(w.y)-s*.8,'#e8f6ff',10)});
    txt(q,'Nạp +80 khiên/giây cho mọi công trình có khiên',X(7.5),Y(9.9),'#9fe8ff',11)}});
/* ---------- ic5 ---------- */
SC.ic5=safe({title:bn('ic5'),note:'Tích lực 50 giây rồi tạo cơn bão xanh bay tới mục tiêu trong 12 ô, tồn tại 7 giây, mỗi giây đánh 3 tia sét 120 sát thương (tích lực xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.b=mkBld(G,'ic5',7.5,8.0,{lv:c.lv});c.e=mkE(G,c,4.0,1.4);c.ph=0;c.log=[];c.tot=0;c.storms=0},
  step(G,dt,c){c.ph+=dt;T0(G,dt);solid(c.b);c.e.x=7.5+3.6*Math.sin(c.ph*.35);c.e.y=2.0+.8*Math.sin(c.ph*.6);window.c22Tick(c.b,dt,G,1);track(c,G,c.e);if(c.e._h!=null)c.tot=(c.e.max-c.e.hp)*20;c.storms=c.b.c22bn||0},
  over(q,G,c,X,Y,s){txt(q,c.b.c22cd>0?'Tích lực: còn '+Math.ceil(c.b.c22cd)+' giây (×0,1)':'Sẵn sàng tạo bão',X(7.5),Y(9.9),'#bfe8ff',11);
    txt(q,'Tổng sát thương đã gây: '+nf(c.tot)+' · '+c.storms+' cơn bão',X(7.5),Y(9.4),'#ffe08a',10)}});
/* ---------- ic6 ---------- */
SC.ic6=safe({title:bn('ic6'),note:'Giúp các công trình tên lửa bắn nhanh hơn 10% và gây thêm 5% sát thương (so sánh: 6 giây có trạm / 6 giây không trạm)',
  init(G,c){initC(G,c);c.s=mkBld(G,'ic6',3.4,7.6,{lv:c.lv});c.m=mkBld(G,'ic1',7.5,7.6,{lv:c.lv});c.e=mkE(G,c,7.5,3.4);c.ph=0;c.res={on:null,off:null};c.cnt=0;c.dm=0;c.t0=0;c.prev=0},
  step(G,dt,c){c.ph+=dt;T0(G,dt);solid(c.s);solid(c.m);c.e.x=7.5+2.6*Math.sin(c.ph*.5);c.e.y=3.4+.4*Math.sin(c.ph*.8);
    const on=Math.floor(c.ph/6)%2===0;c.s.c22off=!on;if(c.on!==on){if(c.on!=null)c.res[c.on?'on':'off']={n:c.cnt/Math.max(.5,c.ph-c.t0),d:c.dm/Math.max(1,c.cnt)};c.on=on;c.cnt=0;c.dm=0;c.t0=c.ph}
    const v0=c.m.c22vn||0;window.c22Tick(c.s,dt,G,1);window.c22Tick(c.m,dt,G,1);if((c.m.c22vn||0)>v0)c.cnt++;
    (G.c22p||[]).forEach(p=>{if(p.own===c.m&&!p.cm){p.cm=1;c.dm=(c.dm||0)+p.dmg*20}})},
  over(q,G,c,X,Y,s){txt(q,c.on?'CÓ trạm nạp: bắn nhanh hơn 10%, sát thương +5%':'KHÔNG có trạm nạp',X(c.s.x),Y(c.s.y)+s*1.45,c.on?'#ffd27a':'#cfd8ea',10);
    const f=r=>r?fmt(r.n)+' lượt/giây · '+nf(r.d)+' sát thương':'…';
    txt(q,'Có trạm: '+f(c.res.on)+'   |   Không trạm: '+f(c.res.off),X(7.5),Y(9.9),'#ffe08a',10)}});
/* ---------- ic7 / ic10 ---------- */
function intScene(t,fire,note){return safe({title:bn(t),note,
  init(G,c){initC(G,c);c.b=mkBld(G,t,7.5,6.6,{lv:c.lv});c.w=mkBld(G,'wall',7.5,8.9,{w:2,h:1,max:300});c.es=[mkE(G,c,4.5,-.6),mkE(G,c,10.5,-.6)];c.t1=0;c.leak=0;c.sent=0;c.hp0=c.w.hp},
  step(G,dt,c){T0(G,dt);solid(c.b);window.c22Tick(c.b,dt,G,1);if(c.w.hp<c.w.max*.5)c.w.hp=c.w.max;
    c.t1-=dt;if(c.t1<=0){c.t1=fire.dt;for(let i=0;i<fire.n;i++){const e=c.es[(Math.random()*2)|0],tx=c.w.x+(Math.random()-.5)*1.6;
        mkSh(G,e.x+(Math.random()-.5)*.6,e.y+.5,tx,c.w.y-.3,.3,fire.sp);c.sent++;const p=G.pr[G.pr.length-1];if(fire.k)p.k=fire.k;
        if(fire.mix&&i%2){p.k='shell'}}}},
  over(q,G,c,X,Y,s){txt(q,'Đã chặn '+(c.b.c22k||0)+' · địch đã bắn '+c.sent+' (chặn tối đa '+(t==='ic7'?6:20)+'/giây)',X(7.5),Y(9.9),'#ffe08a',11)}})}
SC.ic7=intScene('ic7',{dt:.25,n:3,sp:7},'Khi có đạn địch trong 8 ô, radar đánh chặn bằng cách phá hủy chúng, tối đa 6 viên mỗi giây');
SC.ic10=intScene('ic10',{dt:.2,n:6,sp:8,k:'missile',mix:1},'Chuyên đánh chặn đạn phòng không từ tên lửa: 20 tên lửa mỗi giây trong 9 ô (không chặn đạn thường)');
/* ---------- ic8 ---------- */
SC.ic8=safe({title:bn('ic8'),note:'Không thể bị phát hiện cho đến khi chịu sát thương. Phóng 4 tên lửa tàng hình mỗi giây (lộ sau 2 giây), 90 sát thương, tầm 20 ô',
  init(G,c){initC(G,c);c.b=mkBld(G,'ic8',7.5,7.6,{lv:c.lv});c.w=mkBld(G,'wall',11.8,7.8,{w:2,h:1,max:300});c.e1=mkE(G,c,7.5,2.6);c.e2=mkE(G,c,5.0,1.4);c.es=[c.e1,c.e2];c.ph=0;c.log=[];c.t1=0;c.hit=0},
  step(G,dt,c){c.ph+=dt;T0(G,dt);solid(c.w);c.e1.x=7.5+3.2*Math.sin(c.ph*.45);c.e1.y=2.6+.4*Math.sin(c.ph*.7);c.e2.x=11.5-2*Math.sin(c.ph*.4);
    const cyc=c.ph%18;if(cyc<.05&&c.b.c22rev){c.b.c22rev=0;c.hit=0;c.b.hp=c.b.max}
    c.t1-=dt;if(c.t1<=0){c.t1=.5;mkSh(G,c.e2.x,c.e2.y+.5,c.w.x,c.w.y-.3,.2,9)}
    if(cyc>8&&!c.hit){c.hit=1;mkSh(G,c.e1.x,c.e1.y+.5,c.b.x,c.b.y-.3,3,9)}
    c.b.hp=Math.max(c.b.hp,c.b.max*.3);window.c22Tick(c.b,dt,G,1);track(c,G,c.e1)},
  over(q,G,c,X,Y,s){txt(q,c.b.c22hid?'Hầm ngầm đang ẨN THÂN (địch bắn tường bên cạnh, không thấy hầm)':'Hầm đã chịu sát thương → LỘ DIỆN',X(7.5),Y(9.9),c.b.c22hid?'#9fb4d8':'#ffb8a0',11)}});
/* ---------- xuất để kiểm thử ---------- */
window.C22={C22T,CFG,TUR,TICK,tick:window.c22Tick,pre,projStep,reviveStep,whiteAbsorb,chargeAll,icept,storm,turret,boxOf,nets,stationOn,SC:Object.keys(SC).filter(k=>C22T.includes(k))};
})();
})();
