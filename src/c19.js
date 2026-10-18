/* ===== c19: Khống chế · Hỗ trợ · Phòng thủ (19 công trình điều chỉnh) ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const C19T=['kn6','kn7','kn8','kn9','kn10','ne1','ne2','ne3','ne4','ne5','ne6','ne7','ne8','ne9','ne10','tj1','tj2','tj3','tj4'];
const CFG={
  kn6:{rng:7,cd:6,stun:2,hw:1.1,sp:24,pull:12,tipx:.2,tip:1},
  kn7:{rng:10.5,cd:.9,dmg:2.6,spl:1.2,sp:13,tip:.36},
  kn8:{rng:15,cd:.5,dmg:80/20,mag:30,rel:7,sp:28,tip:1},
  kn9:{R:15,sh:200,dur:10,cd:8},
  kn10:{rng:14,every:5,R:5,life:5,slow:.2,tick:.1,dmg:20/20,sp:11},
  ne1:{R:5,rate:20},
  ne2:{R:8,charge:5,dmg:300/20,side:.5,tip:.9},
  ne3:{R:6,charge:7,n:3,dur:3},
  ne4:{R:9,charge:10,w:8,dmg:120/20,push:3,sp:9},
  ne5:{R:8,dur:3,gap:3},
  ne6:{R:5,cd:60,delay:.5},
  ne7:{hp:500/50,cd:30,dist:2.15,half:2.2,bulge:.95},
  ne8:{R:6,every:12,boom:4,pct:.9,rng:13,sp:12},
  ne9:{hp:4000/50,cd:50},
  ne10:{need:10000,n:4,d:3,dmg:1500/20,cd:40,gap:.6},
  tj1:{R:7},
  tj2:{R:9,n:3,dur:5,tick:.2,dmg:40/20,cd:40},
  tj3:{R:7,dmg:200/20,every:1,stun:.75,p:.1},
  tj4:{every:2,sh:5}};
window.c19Has=t=>C19T.includes(t);
{const o=window.c16Has;window.c16Has=t=>(o?o(t):false)||C19T.includes(t)}
/* gắn cờ, bỏ hiệu ứng cũ (tj: aura cũ do c19 điều khiển) */
C19T.forEach(t=>{const f=NBF[t];if(f){f.c19=t;delete f.e}});
/* công trình xoay: kn6 (chỉnh hướng ở Trụ sở, cố định ngoài trận) · kn8, ne2 (xoay 360°) · ne7 (4 hướng chéo) */
const ROT={kn6:1,kn8:1,ne2:1,ne7:1};
/* đổi tên */
const REN={kn9:'Tấm Khiên Chắn Tường Thành',kn10:'Nhà Hạt Nhân',ne5:'Tháp Thôi Miên',ne6:'Pháo Sao Chép Kỹ Năng',ne7:'Giáp Gương'};
Object.keys(REN).forEach(t=>{const b=BLD.find(x=>x.t===t);if(b)b.n=REN[t];if(UPD[t])UPD[t].n=REN[t]});
/* đồng bộ BT với số liệu mới (dùng cho bản sao công trình của đối thủ trong PvP): sát thương trung bình tương đương */
{const S2=(t,o)=>{if(BT[t])Object.assign(BT[t],o)};
  S2('kn6',{dmg:.05,cd:6,rng:7});S2('kn7',{dmg:CFG.kn7.dmg*2,cd:CFG.kn7.cd,rng:10.5,spl:1.2});S2('kn8',{dmg:CFG.kn8.dmg,cd:.75,rng:15});
  S2('kn9',{dmg:.05,cd:8,rng:15});S2('kn10',{dmg:CFG.kn10.dmg*5,cd:1,rng:14,spl:2});
  S2('ne1',{dmg:.05,cd:1,rng:5});S2('ne2',{dmg:CFG.ne2.dmg*2,cd:5,rng:8});S2('ne3',{dmg:.05,cd:7,rng:6});S2('ne4',{dmg:CFG.ne4.dmg,cd:10,rng:9});
  S2('ne5',{dmg:.05,cd:6,rng:8});S2('ne6',{dmg:.05,cd:6,rng:5});S2('ne7',{dmg:.05,cd:6,rng:8});S2('ne8',{dmg:1,cd:12,rng:13});S2('ne9',{dmg:.05,cd:6,rng:11});
  S2('ne10',{dmg:CFG.ne10.dmg*2,cd:45,rng:15})}
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
upd('kn6',(l,k)=>[['Dây phóng','2 dây · kéo 2 mục tiêu về phía bệ phóng'],['Tầm','7 ô theo hướng bệ phóng'],['Choáng mục tiêu bị kéo','2 giây'],['Hồi chiêu','6 giây'],['Hướng','Chỉnh trong Trụ sở, ra trận cố định']],'Phóng 2 dây lao kéo 2 mục tiêu trong tầm 7 ô về phía bệ phóng, kèm choáng 2 giây. Chỉnh hướng ở Trụ sở (nút “Xoay hướng”); ra chiến trường không thể quay.');
upd('kn7',(l,k)=>[['Sát thương mỗi viên',nf(52*k)],['Tầm bắn','10,5 ô'],['Nổ lan','1,2 ô'],['Hướng bắn','Chỉ bắn dọc 4 nòng chéo']],'Bốn nòng chữ X: chỉ bắn được mục tiêu nằm trên đường chéo của nòng pháo (giống pháo plasma bốn nòng).');
upd('kn8',(l,k)=>[['Sát thương mỗi viên',nf(80*k)],['Băng đạn','30 viên đạn xanh'],['Tốc độ bắn','2 phát / giây'],['Nạp đạn','7 giây'],['Nòng','Xoay 360°']],'Băng 30 viên đạn xanh, bắn 2 phát mỗi giây, mỗi viên 80 sát thương; hết đạn nạp lại 7 giây. Xoay 360°.');
upd('kn9',(l,k)=>[['Điều kiện','Có đồng minh dưới 50% máu tối đa'],['Giáp cho đồng minh và công trình',nf(200*k)],['Phạm vi','15 ô'],['Thời gian giáp','10 giây'],['Hồi chiêu','8 giây']],'Khi một đồng minh tụt dưới 50% máu tối đa, ban 200 giáp cho đồng minh và công trình trong 15 ô.');
upd('kn10',(l,k)=>[['Chu kỳ','Mỗi 5 giây phóng 1 vùng hạt nhân'],['Bán kính vùng','5 ô'],['Tồn tại','5 giây'],['Làm chậm','20%'],['Nhiễm độc',nf(20*k)+' sát thương / 0,1 giây']],'Mỗi 5 giây phóng vùng hạt nhân bán kính 5 ô kéo dài 5 giây: mục tiêu trong vùng bị chậm 20% và nhiễm độc 20 sát thương mỗi 0,1 giây.');
upd('ne1',(l,k)=>[['Truyền năng lượng',fmt(20*k)+' / giây'],['Đối tượng','1 đồng minh trong 5 ô']],'Truyền 20 năng lượng mỗi giây cho 1 đồng minh trong 5 ô.');
upd('ne2',(l,k)=>[['Tụ năng lượng','5 giây'],['Số tia','2 tia laser tím'],['Sát thương mỗi tia',nf(300*k)],['Tầm','8 ô']],'Tụ năng lượng 5 giây rồi bắn 2 tia laser tím vào mục tiêu trong 8 ô, mỗi tia 300 sát thương.');
upd('ne3',(l,k)=>[['Tụ năng lượng','7 giây'],['Số mục tiêu','3 mục tiêu trong 6 ô'],['Chói lòa','3 giây · không dùng được kỹ năng, không di chuyển được']],'Tụ năng lượng 7 giây rồi làm chói lòa 3 mục tiêu trong 6 ô trong 3 giây: không thể dùng kỹ năng và không thể di chuyển. Mục tiêu bị nhốt trong mặt lăng kính vuông nhọn.');
upd('ne4',(l,k)=>[['Tụ năng lượng','10 giây'],['Tia hồ quang','Dài 8 ô, bay tối đa 9 ô về phía trước'],['Sát thương',nf(120*k)],['Đẩy lùi','3 ô']],'Tụ năng lượng 10 giây rồi phóng tia hồ quang tím dài 8 ô bay về phía trước tối đa 9 ô, đẩy lùi mục tiêu 3 ô và gây 120 sát thương.');
upd('ne5',(l,k)=>[['Phạm vi','8 ô'],['Thôi miên','3 giây · biến mục tiêu thành đồng minh'],['Chu kỳ','Nghỉ 3 giây giữa 2 lần thôi miên']],'Chiếu tia thôi miên xanh lên mục tiêu trong 8 ô, biến mục tiêu (drone nếu có) thành đồng minh trong 3 giây.');
upd('ne6',(l,k)=>[['Phạm vi','5 ô quanh tháp'],['Hiệu ứng','Sao chép kỹ năng thuyền trưởng vừa dùng'],['Hồi chiêu','60 giây']],'Trong 5 ô, khi thuyền trưởng dùng kỹ năng, pháo sao chép và dùng lại ngay sau đó (hồi chiêu 60 giây).');
upd('ne7',(l,k)=>[['Giáp gương','Chắn '+nf(500*k)+' sát thương'],['Khi vào trận','Tự dựng tấm khiên cong đứng chéo ở mũi gương'],['Hồi chiêu','30 giây (sau khi vỡ)'],['Hướng','4 hướng chéo, chỉnh ở Trụ sở']],'Vào trận tự dựng tấm khiên cong đứng chéo theo mũi gương, chắn 500 sát thương; vỡ rồi hồi chiêu 30 giây. Xoay được 4 hướng chéo ở Trụ sở.');
upd('ne8',(l,k)=>[['Phạm vi thu năng lượng','6 ô'],['Chu kỳ','12 giây'],['Đạn xanh','Nổ bán kính 4 ô vào mục tiêu gần nhất'],['Sát thương','90% sát thương tích lũy, chia đều']],'Tích lũy sát thương do mục tiêu trong 6 ô gây ra; sau 12 giây bắn viên đạn xanh nổ 4 ô vào mục tiêu gần nhất, gây 90% sát thương đã tích lũy (chia đều nếu có nhiều mục tiêu).');
upd('ne9',(l,k)=>[['Ma trận giáp tím','Bao quanh toàn bộ Trụ sở'],['Chắn',nf(4000*k)+' sát thương'],['Hồi chiêu','50 giây (sau khi vỡ)']],'Dựng ma trận giáp tím bao quanh toàn bộ Trụ sở, chắn 4000 sát thương; vỡ rồi hồi chiêu 50 giây.');
upd('ne10',(l,k)=>[['Điều kiện','Tích lũy 10.000 sát thương nhận vào và gây ra'],['Đạn','4 đạn tím (đường kính 3 ô) rơi từ trên trời'],['Sát thương mỗi đạn',nf(1500*k)],['Hồi chiêu','40 giây']],'Tích lũy sát thương nhận vào và gây ra từ mọi nguồn; đạt 10.000 thì phóng 4 đạn tím đường kính 3 ô rơi từ trên trời xuống bất kỳ mục tiêu nào không phải công trình, mỗi đạn 1500 sát thương lần lượt. Hồi chiêu 40 giây.');
upd('tj1',(l,k)=>[['Phạm vi','7 ô'],['Mục tiêu trong vùng','Không thể dùng kỹ năng'],['Drone','Không thể chiến đấu, chỉ lơ lửng trong vùng']],'Trong 7 ô: cấm mục tiêu dùng kỹ năng và khiến drone không thể chiến đấu, chỉ có thể lơ lửng trong phạm vi.');
upd('tj2',(l,k)=>[['Phạm vi','9 ô · tối đa 3 mục tiêu'],['Giam giữ','5 giây · choáng liên tục'],['Sát thương',nf(40*k)+' mỗi 0,2 giây'],['Hồi chiêu','40 giây']],'Ma trận lăng kính hình chữ nhật 3D nhốt tối đa 3 mục tiêu trong 9 ô trong 5 giây: choáng liên tục và 40 sát thương mỗi 0,2 giây. Hồi chiêu 40 giây.');
upd('tj3',(l,k)=>[['Phạm vi xung','7 ô'],['Sát thương mỗi xung',nf(200*k)+' (chia đều cho mục tiêu trong vùng)'],['Tần suất','4 xung mỗi 4 giây'],['Choáng','10% · 0,75 giây']],'Phát xung EMP trong 7 ô: mỗi xung 200 sát thương chia đều cho mọi mục tiêu trong vùng, 4 xung mỗi 4 giây, 10% choáng 0,75 giây.');
upd('tj4',(l,k)=>[['Phạm vi','Toàn bản đồ'],['Giáp cho mỗi khiên / tường / công trình',fmt(5*k)+' mỗi 2 giây']],'Liên kết các khiên từ xa với mạng dây: mỗi khiên, tường, công trình trong toàn bản đồ nhận 5 giáp mỗi 2 giây.');

/* ---------- tiện ích ---------- */
const ships=G=>{const L=[];if(G.pl&&!G.pl.dead)L.push(G.pl);(G.al||[]).forEach(a=>{if(!a.dead)L.push(a)});return L};
const enemies=G=>G.en.filter(e=>!e.dead&&e.spawn<=G.t);
const near=(G,x,y,R)=>{let t=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-x,e.y-y);if(q<=R+(e.size||2)*.3&&q<bd){bd=q;t=e}});return t};
const nearN=(G,x,y,R,n,skip)=>enemies(G).filter(e=>!(skip&&skip(e))&&Math.hypot(e.x-x,e.y-y)<=R+(e.size||2)*.3).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).slice(0,n);
const shVal=u=>{let v=0;const c=u.cs;if(c&&c.abs&&c.abs.t>0&&c.abs.v>0)v=c.abs.v;if(u.shd&&u.shd.t>0&&u.shd.v>0)v=Math.max(v,u.shd.v);return v};
const shSet=(G,u,v,dur)=>{if(u===G.pl&&!u.cs)u.cs={};if(u.cs){u.cs.abs={v,t:dur,max:v};u.cs.circ=true;u.cs.hexc=false}else u.shd={v,t:9999,max:v,c17:G.t+dur}};
const ping=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.45,max:t||.45,col});
const beam=(G,x1,y1,x2,y2,col,w,t)=>G.bm.push({x1,y1,x2,y2,t:t||.3,col,w:w||3});
const boomFx=(G,x,y,r)=>G.fx.push({x,y,r,t:.6,max:.6,ex:1,rot:Math.random()*6.28});
const pop=(G,x,y,txt,col)=>{const L=G.c19pop=G.c19pop||[];if(L.length>40)L.shift();L.push({x,y,t:0,max:1.8,txt,col:col||'#ffe08a'})};
const dm=(b,G,d)=>d*LV(b)*(PB(G).dm||1);
/* hệ số thời gian: lò phản ứng / hồi chiêu chiến trường rút ngắn các bộ đếm */
const tk=(G,dt)=>dt/((G.c18rc||1)*((PB(G).cdm)||1));
const isDrone=e=>!!(e.drone||e.isDrone||e.k==='drone'||/drone/i.test(String(e.name||'')+String((e.sh&&e.sh.id)||'')));
/* hướng đặt ở Trụ sở: kn6 8 hướng (bước 45°), ne7 4 hướng chéo */
function dirOf(b){if(b.c19dir!=null)return b.c19dir|0;try{const D=S.base&&S.base.dir;return D?(D[b.id]|0):0}catch(e){return 0}}
const k6ang=b=>-Math.PI/2+(dirOf(b)%8)*Math.PI/4;
const ne7d=b=>dirOf(b)%4;
const ne7face=b=>-3*Math.PI/4+ne7d(b)*Math.PI/2;
/* khống chế: choáng / cố định vị trí / đẩy lùi (boss chỉ chịu 1/3) */
const ccT=(e,t)=>t*(e.boss?1/3:1);
const stunE=(e,t)=>{e.stun=Math.max(e.stun||0,ccT(e,t))};
const rootE=(e,t)=>{e.c19root=Math.max(e.c19root||0,ccT(e,t));e.c19rx=e.x;e.c19ry=e.y};
const moveE=(G,e,x,y)=>{const W=G.wd?G.wd.Wd:99,H=G.wd?G.wd.Hd:99;e.x=Math.max(.5,Math.min(W-.5,x));e.y=Math.max(.5,Math.min(H-.5,y));if(e.c19rx!=null){e.c19rx=e.x;e.c19ry=e.y}};

/* ---------- hệ đạn riêng ---------- */
function mkP(G,o){const l=Math.hypot((o.tx||0)-o.x,(o.ty||0)-o.y)||1,a=o.ang!=null?o.ang:Math.atan2(o.ty-o.y,o.tx-o.x);
  const p={x:o.x,y:o.y,vx:Math.cos(a)*o.sp,vy:Math.sin(a)*o.sp,dmg:o.dmg,sdmg:o.sdmg,spl:o.spl||0,hr:o.hr||0,life:o.life||(l/o.sp+.4),tg:o.tg||null,turn:o.turn||0,st:o.st,tr:[],tl:o.tl||5,pass:o.pass||0,end:o.end||null,onHit:o.onHit||null,tot:o.tot||0,b:o.b||null,age:0,seed:Math.random()*100};
  (G.c19p=G.c19p||[]).push(p);return p}
function boom(G,x,y,r,d,sd,hit){r*=(window.c17Spl?window.c17Spl(G):1);
  enemies(G).forEach(e=>{if(Math.hypot(e.x-x,e.y-y)<r+(e.size||2)*.35)dfDmgS(e,e===hit?d:sd,false)});
  G.fx.push({x,y,r,t:.35,max:.35,col:'#ffd27a'});if(r>=1.2)boomFx(G,x,y,r*.85);else G.fx.push({x,y,r:Math.max(.4,r*.8),t:.3,max:.3,col:'#ffb066'})}
function impact(G,p,hit){
  if(p.onHit){p.onHit(G,p,hit);return}
  if(p.spl>0){boom(G,p.x,p.y,p.spl,p.dmg,p.sdmg!=null?p.sdmg:p.dmg,hit);return}
  if(hit){dfDmgS(hit,p.dmg,false);G.fx.push({x:p.x,y:p.y,r:.35,t:.2,max:.2,col:p.st==='rifle'?'#8fc8ff':'#ffd27a'})}}
function projStep(G,dt){const L=G.c19p;if(!L||!L.length)return;const Wd=G.wd?G.wd.Wd:99,Hd=G.wd?G.wd.Hd:99,E=enemies(G);
  for(const p of L){if(p.dead)continue;
    if(p.tg&&!p.tg.dead&&p.turn){const a=Math.atan2(p.tg.y-p.y,p.tg.x-p.x),v=Math.hypot(p.vx,p.vy);let ca=Math.atan2(p.vy,p.vx),da=a-ca;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
      ca+=Math.max(-p.turn*dt,Math.min(p.turn*dt,da));p.vx=Math.cos(ca)*v;p.vy=Math.sin(ca)*v}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;p.age+=dt;
    if(p.tr){p.tr.push([p.x,p.y]);if(p.tr.length>p.tl)p.tr.shift()}
    let hit=null;if(!p.pass)for(const e of E){if(e.dead)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<(e.size||2)*.42+p.hr){hit=e;break}}
    if(hit||p.life<=0||p.x<-3||p.y<-3||p.x>Wd+3||p.y>Hd+3){p.dead=true;
      if(p.end&&!hit&&p.life<=0)p.end(G,p);else if(hit||(p.spl&&p.life<=0))impact(G,p,hit)}}
  G.c19p=L.filter(p=>!p.dead)}
const cdn=(b,dt,v)=>v+Math.max(b.cd,-dt);
const muz=(G,x,y,col)=>G.fx.push({x,y,r:.32,t:.1,max:.1,col:col||'#ffffff'});
const effPush=(G,o)=>{(G.c19e=G.c19e||[]).push(o);return o};
/* làn bắn thẳng */
function lane(G,ox,oy,ax,ay,R,hw){let best=null,bd=1e9;enemies(G).forEach(e=>{const rx=e.x-ox,ry=e.y-oy,al=rx*ax+ry*ay;if(al<=0||al>R+(e.size||2)*.3)return;const pe=Math.abs(-rx*ay+ry*ax);
  if(pe<=hw+(e.size||2)*.42&&al<bd){bd=al;best=e}});return best}
const DIAG=[[1,-1],[1,1],[-1,1],[-1,-1]].map(d=>[d[0]*Math.SQRT1_2,d[1]*Math.SQRT1_2]);
function k7tips(b){const C=CFG.kn7,tl=C.tip*b.w*Math.SQRT2;return DIAG.map(d=>({x:b.x+d[0]*tl,y:b.y+d[1]*tl,dx:d[0],dy:d[1]}))}

/* ---------- Bệ Phóng Lao Đôi: 2 dây kéo 2 mục tiêu về phía bệ phóng + choáng 2 giây ---------- */
function k6tips(b){const C=CFG.kn6,a=k6ang(b),ax=Math.cos(a),ay=Math.sin(a),nx=-ay,ny=ax,L=Math.max(b.w,b.h)/2*C.tip,s=C.tipx*Math.min(b.w,b.h);
  return [-1,1].map(sg=>({x:b.x+ax*L+nx*sg*s,y:b.y+ay*L+ny*sg*s,sg}))}
function tether(G,b,e,tip){const C=CFG.kn6,o={k:'tether',b,e,ox:tip.x,oy:tip.y,x:tip.x,y:tip.y,ph:0,pt:0,rt:0,t:0,max:6};e.c19tet=1;
  o.u=function(G,dt,o){if(b.hp<=0||e.dead){e.c19tet=0;return true}
    if(o.ph===0){const dx=e.x-o.x,dy=e.y-o.y,l=Math.hypot(dx,dy)||1,m=C.sp*dt;
      if(l<=m+(e.size||2)*.4){o.x=e.x;o.y=e.y;o.ph=1;stunE(e,C.stun);ping(G,e.x,e.y,(e.size||2)*.8,'#e0e6ff',.35)}else{o.x+=dx/l*m;o.y+=dy/l*m}}
    else if(o.ph===1){o.pt+=dt;const stop=Math.max(b.w,b.h)/2+(e.size||2)*.35+.25,dx=b.x-e.x,dy=b.y-e.y,l=Math.hypot(dx,dy)||1;
      if(l>stop&&o.pt<1.4){const m=Math.min(C.pull*dt,l-stop);moveE(G,e,e.x+dx/l*m,e.y+dy/l*m);o.x=e.x;o.y=e.y}else{o.ph=2;o.rt=0}}
    else{o.rt+=dt;e.c19tet=0;if(o.rt>.25)return true}
    return false};
  o.end=function(){e.c19tet=0};
  return effPush(G,o)}
function kn6(b,dt,G){const C=CFG.kn6,pb=PB(G),R=C.rng*(pb.rm||1),a=k6ang(b),ax=Math.cos(a),ay=Math.sin(a),nx=-ay,ny=ax;b.c19a=a;b.cd-=tk(G,dt);if(b.cd>0)return;
  const L=[];enemies(G).forEach(e=>{if(e.c19tet)return;const rx=e.x-b.x,ry=e.y-b.y,al=rx*ax+ry*ay,pe=rx*nx+ry*ny;
    if(al<.4||al>R+(e.size||2)*.3)return;if(Math.abs(pe)<=C.hw+(e.size||2)*.4)L.push({e,al,pe})});
  if(!L.length)return;L.sort((p,q)=>p.al-q.al);const T=k6tips(b),pick=L.slice(0,2).sort((p,q)=>p.pe-q.pe);
  b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));b.c19fl=G.t;b.c19n=pick.length;
  pick.forEach((h,i)=>{const tip=pick.length===2?T[i]:(h.pe<0?T[0]:T[1]);tether(G,b,h.e,tip);muz(G,tip.x,tip.y,'#e0e6ff')})}
/* ---------- Pháo Nòng Chữ X: chỉ bắn dọc 4 nòng chéo ---------- */
function kn7(b,dt,G){const C=CFG.kn7,pb=PB(G),R=C.rng*(pb.rm||1),T=k7tips(b);b.cd-=dt;if(b.cd>0)return;
  const has=T.map(t=>!!lane(G,t.x,t.y,t.dx,t.dy,R,.14));if(!has.some(h=>h))return;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));b.c19fl=G.t;
  T.forEach((t,i)=>{if(!has[i])return;mkP(G,{x:t.x,y:t.y,ang:Math.atan2(t.dy,t.dx),dmg:dm(b,G,C.dmg),spl:C.spl,sp:C.sp,st:'orange',hr:.1,life:(R+.8)/C.sp,tl:6});muz(G,t.x,t.y,'#ffcf80')})}
/* ---------- Súng Trường Xuyên Giáp: băng 30 viên, nạp 7 giây ---------- */
function kn8(b,dt,G){const C=CFG.kn8,pb=PB(G),R=C.rng*(pb.rm||1);
  if(b.c19am==null){b.c19am=C.mag;b.c19rl=0}
  const tg=near(G,b.x,b.y,R);if(tg)b.c19t=Math.atan2(tg.y-b.y,tg.x-b.x);
  if(b.c19rl>0){b.c19rl-=dt;if(b.c19rl<=0){b.c19rl=0;b.c19am=C.mag;b.cd=0;ping(G,b.x,b.y,1,'#8fc8ff',.4)}return}
  b.cd-=dt;if(b.cd>0||!tg)return;b.cd=cdn(b,dt,C.cd*(G.c18rc||1)*(pb.cdm||1));
  const a=b.c19t,x=b.x+Math.cos(a)*C.tip,y=b.y+Math.sin(a)*C.tip;
  mkP(G,{x,y,ang:a,dmg:dm(b,G,C.dmg),sp:C.sp,st:'rifle',hr:.07,life:(R+1)/C.sp,tl:7});muz(G,x,y,'#bfe0ff');b.c19fl=G.t;
  b.c19am--;if(b.c19am<=0){b.c19am=0;b.c19rl=C.rel}}
/* ---------- Tấm Khiên Chắn Tường Thành: đồng minh dưới 50% máu → 200 giáp trong 15 ô ---------- */
function kn9wave(b,G){const C=CFG.kn9,v=C.sh*LV(b);b.c19w=G.t;b.c19wn=(b.c19wn||0)+1;let n=0;
  ships(G).forEach(u=>{if(u.ghost||dist(u,b)>C.R)return;if(shVal(u)<v){shSet(G,u,v,C.dur);ping(G,u.x,u.y,(u.size||2)*.9,'#bfe8ff',.6);n++}});
  const bv=v/DFB;G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine'||o.aux||dist(o,b)>C.R)return;const ex=(o.shd&&o.shd.t>0&&o.shd.v>0)?o.shd:null;if(ex&&ex.v>=bv)return;
    o.shd={v:bv,t:C.dur,max:bv};o.shdC=1;o.shdAt=G.t;n++});
  ping(G,b.x,b.y,2.4,'#cfeaff',.5);pop(G,b.x,b.y-b.h*.5,'+'+nf(v)+' giáp ('+n+')','#bfe8ff')}
function kn9(b,dt,G){const C=CFG.kn9;b.c19cd=Math.max(0,(b.c19cd||0)-tk(G,dt));const S2=b.c19set=b.c19set||new Set();
  S2.forEach(u=>{if(u.dead||!(u.max>0)||u.hp/u.max>=.5)S2.delete(u)});
  ships(G).forEach(u=>{if(u.ghost||!(u.max>0))return;if(u.hp/u.max<.5&&!S2.has(u)&&dist(u,b)<=C.R){S2.add(u);b.c19q=1}});
  if(b.c19q&&b.c19cd<=0){b.c19q=0;if(S2.size){b.c19cd=C.cd;kn9wave(b,G)}}}
/* ---------- Nhà Hạt Nhân: mỗi 5 giây phóng vùng hạt nhân bán kính 5 ô ---------- */
function zone(G,b,x,y){const C=CFG.kn10,o={k:'zone',x,y,R:C.R,max:C.life,t:0,acc:0,b,seed:Math.random()*10};
  o.u=function(G,dt,o){o.acc+=dt;let n=0;while(o.acc>=C.tick-1e-9){o.acc-=C.tick;n++}
    enemies(G).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)>o.R+(e.size||2)*.3)return;
      e.slowT=Math.max(e.slowT||0,.25);e.slowK=Math.min(e.slowK||1,1-C.slow);e.c19tox=.3;
      if(n)dfDmgS(e,dm(b,G,C.dmg)*n,false)});return false};
  return effPush(G,o)}
function kn10(b,dt,G){const C=CFG.kn10,R=C.rng*(PB(G).rm||1);b.c19T=(b.c19T==null?0:b.c19T)-tk(G,dt);if(b.c19T>0)return;
  let best=null,bs=-1,bd=1e9;enemies(G).forEach(e=>{const d=dist(e,b);if(d>R+(e.size||2)*.3)return;let sc=0;enemies(G).forEach(o=>{if(Math.hypot(o.x-e.x,o.y-e.y)<=C.R)sc++});
    if(sc>bs||(sc===bs&&d<bd)){bs=sc;bd=d;best=e}});
  if(!best)return;b.c19T=C.every;b.c19fl=G.t;const tx=best.x,ty=best.y;
  mkP(G,{x:b.x,y:b.y,tx,ty,dmg:0,sp:C.sp,st:'nuke',pass:1,life:Math.max(.25,Math.hypot(tx-b.x,ty-b.y)/C.sp),tl:12,b,end:(G,p)=>{zone(G,b,tx,ty);boomFx(G,tx,ty,2.2);ping(G,tx,ty,C.R,'#9dff5a',.6)}});
  ping(G,b.x,b.y,1.6,'#c8ff7a',.4)}
/* ---------- Tháp Tia Năng Lượng: +20 năng lượng mỗi giây cho 1 đồng minh trong 5 ô ---------- */
function ne1(b,dt,G){const C=CFG.ne1;let best=null,br=2;
  ships(G).forEach(u=>{if(u.ghost||u.inf||!(u.nrgMax>0)||dist(u,b)>C.R||u.nrg>=u.nrgMax-1e-9)return;const r=u.nrg/u.nrgMax;if(r<br){br=r;best=u}});
  b.c19tg=best;if(!best)return;const v=C.rate*LV(b)*dt;best.nrg=Math.min(best.nrgMax,best.nrg+v);b.c19e=(b.c19e||0)+v;
  G.bm.push({x1:b.x,y1:b.y,x2:best.x,y2:best.y,t:.12,col:'#7df0ff',w:3})}
/* ---------- Tháp Laser Đôi Tím: tụ 5 giây, 2 tia 300 sát thương ---------- */
const chg=(b,dt,G,C)=>{b.c19c=Math.min(C.charge,(b.c19c||0)+tk(G,dt));return b.c19c>=C.charge-1e-9};
function laserFx(G,x1,y1,x2,y2,col,w,t){effPush(G,{k:'laser',x1,y1,x2,y2,col,w:w||6,t:0,max:t||.35,u:()=>false})}
function ne2(b,dt,G){const C=CFG.ne2,R=C.R*(PB(G).rm||1),ok=chg(b,dt,G,C),tg=near(G,b.x,b.y,R);if(tg)b.c19t=Math.atan2(tg.y-b.y,tg.x-b.x);
  if(!ok||!tg)return;b.c19c=0;b.c19fl=G.t;const a=b.c19t,cx=Math.cos(a),sy=Math.sin(a);
  [-1,1].forEach(sg=>{const x=b.x+cx*C.tip-sy*sg*C.side,y=b.y+sy*C.tip+cx*sg*C.side;laserFx(G,x,y,tg.x,tg.y,'#c58bff',7,.4);dfDmgS(tg,dm(b,G,C.dmg),false);muz(G,x,y,'#e4c8ff')});
  ping(G,tg.x,tg.y,(tg.size||2)*.8,'#c58bff',.45);boomFx(G,tg.x,tg.y,(tg.size||2)*.5)}
/* ---------- Tháp Lăng Kính Hội Tụ: tụ 7 giây, chói lòa 3 mục tiêu 3 giây ---------- */
function ne3(b,dt,G){const C=CFG.ne3,R=C.R*(PB(G).rm||1),ok=chg(b,dt,G,C);if(!ok)return;
  const L=nearN(G,b.x,b.y,R,C.n);if(!L.length)return;b.c19c=0;b.c19fl=G.t;
  L.forEach(e=>{const d=ccT(e,C.dur);e.silT=Math.max(e.silT||0,d);rootE(e,C.dur);e.c19dz=Math.max(e.c19dz||0,d);
    beam(G,b.x,b.y,e.x,e.y,'#bfe0ff',4,.5);ping(G,e.x,e.y,(e.size||2)*.9,'#cfe8ff',.5);
    effPush(G,{k:'prism',e,t:0,max:d,u:(G,dt,o)=>e.dead})});
  pop(G,b.x,b.y-b.h*.5,'Chói lòa '+L.length+' mục tiêu','#cfe8ff')}
/* ---------- Lò Plasma Phóng Điện: tụ 10 giây, hồ quang dài 8 ô bay tối đa 9 ô ---------- */
function ne4(b,dt,G){const C=CFG.ne4,R=C.R*(PB(G).rm||1),ok=chg(b,dt,G,C);if(!ok)return;
  const tg=near(G,b.x,b.y,R);if(!tg)return;b.c19c=0;b.c19fl=G.t;
  const a=Math.atan2(tg.y-b.y,tg.x-b.x),dx=Math.cos(a),dy=Math.sin(a),st=Math.max(b.w,b.h)/2+.2,hit=new Set(),dmg=dm(b,G,C.dmg);
  const o={k:'arc',x:b.x+dx*st,y:b.y+dy*st,dx,dy,w:C.w,trav:0,t:0,max:6,b};
  o.u=function(G,dt,o){const m=C.sp*dt;o.x+=dx*m;o.y+=dy*m;o.trav+=m;
    enemies(G).forEach(e=>{if(hit.has(e))return;const rx=e.x-o.x,ry=e.y-o.y,al=rx*dx+ry*dy,pe=-rx*dy+ry*dx;
      if(Math.abs(al)<=.9+(e.size||2)*.3&&Math.abs(pe)<=C.w/2+(e.size||2)*.3){hit.add(e);dfDmgS(e,dmg,false);
        const d=C.push*(e.boss?1/3:1),T=.25;e.c19kb={vx:dx*d/T,vy:dy*d/T,t:T};G.fx.push({x:e.x,y:e.y,r:(e.size||2)*.7,t:.3,max:.3,col:'#d9b0ff'})}});
    return o.trav>=C.R};
  effPush(G,o);ping(G,o.x,o.y,2.2,'#c58bff',.5)}
/* ---------- Tháp Thôi Miên: tia xanh biến mục tiêu thành đồng minh trong 3 giây ---------- */
function ne5(b,dt,G){const C=CFG.ne5,R=C.R*(PB(G).rm||1);
  const h=b.c19h;
  if(h){h.t-=dt;if(h.e.dead||h.t<=0){h.e.c19hypT=0;h.e.hyp=0;b.c19h=null;b.c19cd=C.gap;return}
    G.bm.push({x1:b.x,y1:b.y,x2:h.e.x,y2:h.e.y,t:.1,col:'#7fb0ff',w:3});return}
  b.c19cd=Math.max(0,(b.c19cd||0)-tk(G,dt));if(b.c19cd>0)return;
  const L=enemies(G).filter(e=>!(e.hyp>0)&&Math.hypot(e.x-b.x,e.y-b.y)<=R+(e.size||2)*.3).sort((p,q)=>(isDrone(q)-isDrone(p))||dist(p,b)-dist(q,b));
  const e=L[0];if(!e)return;const d=ccT(e,C.dur);e.c19hypT=d;e.hyp=1;b.c19h={e,t:d,max:d};b.c19fl=G.t;
  effPush(G,{k:'hyp',b,e,t:0,max:d,u:(G,dt,o)=>e.dead||!(e.c19hypT>0)});
  ping(G,e.x,e.y,(e.size||2)*1.1,'#7fb0ff',.5);pop(G,e.x,e.y-(e.size||2)*.7,'Thôi miên '+fmt(d)+'s','#9fc8ff')}
/* ---------- Pháo Sao Chép Kỹ Năng: sao chép kỹ năng thuyền trưởng trong 5 ô ---------- */
function ne6(b,dt,G){b.c19cd=Math.max(0,(b.c19cd||0)-tk(G,dt))}
window.c19Cast=function(G,P,k,sc){if(!G||G.c19in||G.c14in||!P||!k||!k.cap||P.silT>0||P.dead||!G.bl)return;
  if(!(P===G.pl||(G.al||[]).includes(P)))return;
  const C=CFG.ne6,b=G.bl.find(o=>o.hp>0&&o.nb&&o.nb.c19==='ne6'&&dist(o,P)<=C.R&&!(o.c19cd>0));if(!b)return;
  b.c19cd=C.cd;b.c19fl=G.t;(G.c19q=G.c19q||[]).push({t:C.delay,P,k,sc:sc||1,b,fake:!!k.fake});
  beam(G,b.x,b.y,P.x,P.y,'#7df0ff',3,.5);ping(G,P.x,P.y,(P.size||2)*1.1,'#7df0ff',.5);pop(G,b.x,b.y-b.h*.5,'Sao chép kỹ năng!','#7df0ff')};
function qStep(G,dt){const Q=G.c19q;if(!Q||!Q.length)return;
  for(const it of Q){it.t-=dt;if(it.t>0)continue;it.done=1;if(it.P.dead||it.b.hp<=0)continue;
    if(it.fake){ping(G,it.P.x,it.P.y,(it.P.size||2)*1.6,'#7df0ff',.7);ping(G,it.P.x,it.P.y,(it.P.size||2)*.9,'#ffffff',.5);continue}
    G.c19in=1;try{const K=window.CSK||(typeof CSK!=='undefined'?CSK:null);if(K&&K.cast)K.cast(it.P,it.k,it.sc);ping(G,it.P.x,it.P.y,(it.P.size||2)*1.6,'#7df0ff',.7)}catch(e){console.error(e)}finally{G.c19in=0}}
  G.c19q=Q.filter(i=>!i.done)}
/* ---------- Giáp Gương: khiên cong đứng chéo ở mũi gương, chắn 500 sát thương ---------- */
function mirGeo(b){const C=CFG.ne7,f=ne7face(b),fx=Math.cos(f),fy=Math.sin(f),nx=-fy,ny=fx,cx=b.x+fx*C.dist,cy=b.y+fy*C.dist,P=[];
  for(let i=0;i<=12;i++){const u=-1+i/6,s=u*C.half,off=C.bulge*(1-u*u);P.push([cx+nx*s+fx*off,cy+ny*s+fy*off])}return {P,f,fx,fy,cx,cy}}
function dPoly(P,x,y){let m=1e9;for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],bx=P[i][0],by=P[i][1],vx=bx-ax,vy=by-ay,l2=vx*vx+vy*vy||1;let t=((x-ax)*vx+(y-ay)*vy)/l2;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(x-(ax+vx*t),y-(ay+vy*t)))}return m}
function ne7(b,dt,G){const C=CFG.ne7;let m=b.c19m;if(!m){const mx=C.hp*LV(b);m=b.c19m={hp:mx,max:mx,cd:null,up:G.t};ping(G,b.x,b.y,2.4,'#bfe0ff',.6)}
  if(m.hp<=0){if(m.cd==null){m.cd=C.cd}m.cd-=tk(G,dt);if(m.cd<=0){m.hp=m.max;m.cd=null;m.up=G.t;const g=mirGeo(b);ping(G,g.cx+g.fx*C.bulge*.6,g.cy+g.fy*C.bulge*.6,2.2,'#bfe0ff',.6);pop(G,b.x,b.y-b.h*.5,'Giáp gương sẵn sàng','#bfe0ff')}}}
function mirrorHit(G,x,y,d,p){let hit=false;if(!G||!G.bl)return false;
  G.bl.forEach(b=>{if(hit||b.hp<=0||!b.nb||b.nb.c19!=='ne7')return;const m=b.c19m;if(!m||m.hp<=0)return;const g=mirGeo(b);
    if(dPoly(g.P,x,y)<=.5){m.hp-=d;m.hitT=G.t;m.hx=x;m.hy=y;m.abs=(m.abs||0)+d;hit=true;ping(G,x,y,.55,'#cfe8ff',.3);
      if(m.hp<=0){m.hp=0;m.cd=null;boomFx(G,g.cx+g.fx*CFG.ne7.bulge*.6,g.cy+g.fy*CFG.ne7.bulge*.6,1.6);pop(G,b.x,b.y-b.h*.5,'Giáp gương vỡ','#ffb0a0')}}});
  return hit}
/* ---------- Tháp Cộng Hưởng Cuộn: tích lũy sát thương do mục tiêu trong 6 ô gây ra → đạn xanh nổ 4 ô ---------- */
function ne8(b,dt,G){const C=CFG.ne8,R=C.rng*(PB(G).rm||1);b.c19w=(b.c19w==null?C.every:b.c19w)-tk(G,dt);if(b.c19w>0)return;
  if(!(b.c19acc>0)){b.c19w=C.every;return}
  const tg=near(G,b.x,b.y,R);if(!tg)return;b.c19w=C.every;const tot=b.c19acc*C.pct/20;b.c19acc=0;b.c19fl=G.t;b.c19last=tot*20;
  mkP(G,{x:b.x,y:b.y,tx:tg.x,ty:tg.y,dmg:0,sp:C.sp,st:'blt',hr:.15,turn:5,tg,tl:9,life:(R+3)/C.sp+.6,b,tot,
    onHit:(G,p,hit)=>{const r=C.boom*(window.c17Spl?window.c17Spl(G):1),L=enemies(G).filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<r+(e.size||2)*.35);if(hit&&!L.includes(hit))L.push(hit);
      L.forEach(e=>dfDmgS(e,p.tot/Math.max(1,L.length),false));G.fx.push({x:p.x,y:p.y,r,t:.45,max:.45,col:'#7fc4ff'});boomFx(G,p.x,p.y,r*.8);pop(G,p.x,p.y-1,'-'+nf(p.tot*20/Math.max(1,L.length))+' mỗi mục tiêu','#9fd0ff')},
    end:(G,p)=>{p.onHit(G,p,null)}});
  ping(G,b.x,b.y,2.4,'#7fc4ff',.5)}
/* ---------- Lưới Laser Bốn Điểm: ma trận giáp tím quanh Trụ sở chắn 4000 sát thương ---------- */
function ne9(b,dt,G){const C=CFG.ne9;let m=b.c19x;if(!m){const mx=C.hp*LV(b);m=b.c19x={hp:mx,max:mx,cd:null,up:G.t}}
  if(m.hp<=0){if(m.cd==null){m.cd=C.cd}m.cd-=tk(G,dt);if(m.cd<=0){m.hp=m.max;m.cd=null;m.up=G.t;const h=G.hq;if(h)ping(G,h.x,h.y,Math.max(h.w,h.h)*.9,'#b99cff',.7);pop(G,b.x,b.y-b.h*.5,'Ma trận giáp sẵn sàng','#d9b0ff')}}}
function hqAbsorb(G,hq,d){G.bl.forEach(b=>{if(!(d>0)||b.hp<=0||!b.nb||b.nb.c19!=='ne9')return;const m=b.c19x;if(!m||m.hp<=0)return;const a=Math.min(d,m.hp);m.hp-=a;d-=a;m.hitT=G.t;m.abs=(m.abs||0)+a;
    if(m.hp<=0){m.hp=0;m.cd=null;ping(G,hq.x,hq.y,Math.max(hq.w,hq.h)*.9,'#ffb0a0',.6);pop(G,b.x,b.y-b.h*.5,'Ma trận giáp vỡ','#ffb0a0')}});return d}
/* ---------- Siêu Pháo Quang Phổ: đủ 10.000 sát thương → 4 đạn tím rơi từ trời ---------- */
function skyShell(G,b,tg,delay){const C=CFG.ne10,o={k:'sky',x:tg.x,y:tg.y,tg,t:0,max:delay+1.4,dl:delay,hit:false,b};
  o.u=function(G,dt,o){if(o.t<o.dl)return false;const u=o.t-o.dl;
    if(u<.5&&o.tg&&!o.tg.dead){o.x=o.tg.x;o.y=o.tg.y}
    if(u>=.85&&!o.hit){o.hit=true;const r=C.d/2;enemies(G).forEach(e=>{if(Math.hypot(e.x-o.x,e.y-o.y)<r+(e.size||2)*.35)dfDmgS(e,dm(b,G,C.dmg),false)});
      G.fx.push({x:o.x,y:o.y,r:r*1.3,t:.5,max:.5,col:'#c58bff'});boomFx(G,o.x,o.y,r*1.2);ping(G,o.x,o.y,r*1.7,'#e0c0ff',.45)}
    return false};
  return effPush(G,o)}
function ne10(b,dt,G){const C=CFG.ne10;b.c19cd=Math.max(0,(b.c19cd||0)-tk(G,dt));b.c19acc=b.c19acc||0;if(b.c19acc<C.need||b.c19cd>0)return;
  const L=shuffle(enemies(G).slice());if(!L.length)return;b.c19acc=0;b.c19cd=C.cd;b.c19fl=G.t;
  for(let i=0;i<C.n;i++)skyShell(G,b,L[i%L.length],i*C.gap);
  pop(G,b.x,b.y-b.h*.5,'Quang phổ: 4 đạn tím!','#e0c0ff');ping(G,b.x,b.y,2.6,'#c58bff',.6)}
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0,t=a[i];a[i]=a[j];a[j]=t}return a};
/* ---------- Trạm Gây Nhiễu Radar: cấm kỹ năng, drone chỉ lơ lửng ---------- */
function tj1(b,dt,G){const C=CFG.tj1,R=C.R*(PB(G).rm||1);b.c19sw=((b.c19sw||0)+dt*2)%(Math.PI*2);let n=0;
  enemies(G).forEach(e=>{if(Math.hypot(e.x-b.x,e.y-b.y)>R+(e.size||2)*.3)return;n++;e.silT=Math.max(e.silT||0,.35);e.c19jam=.35;if(isDrone(e)){e.noFire=Math.max(e.noFire||0,.35);e.c19dj=.35}});
  b.c19n=n}
/* ---------- Lăng Kính Ảo Ảnh: nhốt tối đa 3 mục tiêu, choáng liên tục + 40 sát thương / 0,2 giây ---------- */
function tj2(b,dt,G){const C=CFG.tj2,R=C.R*(PB(G).rm||1);b.c19cd=Math.max(0,(b.c19cd||0)-tk(G,dt));if(b.c19cd>0)return;
  const L=nearN(G,b.x,b.y,R,C.n,e=>e.c19cage);if(!L.length)return;b.c19cd=C.cd;b.c19fl=G.t;const d=dm(b,G,C.dmg);
  L.forEach((e,i)=>{e.c19cage=1;const o={k:'box',e,b,t:0,max:C.dur,acc:0,duty:0,seed:i*1.7};
    o.u=function(G,dt,o){if(e.dead||b.hp<=0)return true;o.acc+=dt;o.duty+=dt;
      if(e.boss){if(o.duty>=.3){o.duty-=.3;e.stun=Math.max(e.stun||0,.1)}}else e.stun=Math.max(e.stun||0,.3);
      while(o.acc>=C.tick-1e-9){o.acc-=C.tick;dfDmgS(e,d,false)}return false};
    o.end=function(){e.c19cage=0};effPush(G,o);beam(G,b.x,b.y,e.x,e.y,'#b6a0ff',3,.4)});
  pop(G,b.x,b.y-b.h*.5,'Nhốt '+L.length+' mục tiêu','#c8b6ff')}
/* ---------- Bộ Phát Xung EMP: 4 xung / 4 giây, 200 sát thương chia đều, 10% choáng 0,75 giây ---------- */
function tj3(b,dt,G){const C=CFG.tj3,R=C.R*(PB(G).rm||1);b.c19T=(b.c19T==null?C.every:b.c19T)-tk(G,dt);if(b.c19T>0)return;b.c19T+=C.every;if(b.c19T<=0)b.c19T=C.every;
  const L=enemies(G).filter(e=>Math.hypot(e.x-b.x,e.y-b.y)<=R+(e.size||2)*.3);b.c19pt=G.t;b.c19pn=(b.c19pn||0)+1;if(!L.length)return;
  const per=dm(b,G,C.dmg)/L.length;b.c19ps=0;
  L.forEach(e=>{dfDmgS(e,per,false);if(Math.random()<C.p){stunE(e,C.stun);b.c19ps++;ping(G,e.x,e.y,(e.size||2)*.8,'#9fd8ff',.4)}beam(G,b.x,b.y,e.x,e.y,'#8fe8ff',2,.18)});
  b.c19dn=L.length;b.c19pd=per*20}
/* ---------- Mạng Bẫy Điện Từ: mỗi khiên / tường / công trình toàn bản đồ +5 giáp mỗi 2 giây ---------- */
function tj4(b,dt,G){const C=CFG.tj4;b.c19T=(b.c19T==null?C.every:b.c19T)-tk(G,dt);if(b.c19T>0)return;b.c19T+=C.every;if(b.c19T<=0)b.c19T=C.every;
  const add=C.sh*LV(b)/DFB;let n=0;
  G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine'||o.aux||o.u)return;
    if(!(o.shd&&o.shd.t>0&&o.shd.v>0))o.shd={v:0,t:9999,max:o.max};
    o.shd.v=Math.min(o.max,o.shd.v+add);o.shd.max=Math.max(o.shd.max||0,o.max);o.shd.t=Math.max(o.shd.t,6);o.shdC=1;n++});
  b.c19pt=G.t;b.c19n=n;b.c19sh=(b.c19sh||0)+C.sh*LV(b)}
/* ---------- bảng điều khiển theo loại ---------- */
const TICK={kn6,kn7,kn8,kn9,kn10,ne1,ne2,ne3,ne4,ne5,ne6,ne7,ne8,ne9,ne10,tj1,tj2,tj3,tj4};
window.c19Tick=function(b,dt,G){const c=b.nb&&b.nb.c19;if(!c)return false;const f=TICK[c];if(f)f(b,dt,G);return true};

/* ---------- hiệu ứng toàn trận (dùng chung cho trận thật và mô phỏng) ---------- */
function pre(G,dt){
  projStep(G,dt);
  const E=G.c19e;if(E&&E.length){for(const o of E){o.t+=dt;let d=false;try{d=o.u?!!o.u(G,dt,o):false}catch(er){console.error(er);d=true}
      if(d||o.t>=o.max){o.dead=true;if(o.end)try{o.end(G,o)}catch(er){}}}
    G.c19e=E.filter(o=>!o.dead)}
  qStep(G,dt);
  if(G.c19pop){G.c19pop.forEach(o=>o.t+=dt);G.c19pop=G.c19pop.filter(o=>o.t<o.max)}
  (G.en||[]).forEach(e=>{if(e.dead)return;
    if(e.c19kb){const k=e.c19kb,m=Math.min(dt,k.t);moveE(G,e,e.x+k.vx*m,e.y+k.vy*m);k.t-=dt;if(k.t<=0)e.c19kb=null}
    if(e.c19root>0){e.c19root-=dt;if(e.c19rx==null){e.c19rx=e.x;e.c19ry=e.y}else{e.x=e.c19rx;e.y=e.c19ry}if(e.c19root<=0){e.c19root=0;e.c19rx=null}}
    if(e.c19hypT>0){e.c19hypT-=dt;if(e.c19hypT<=0){e.c19hypT=0;e.hyp=0}else e.hyp=Math.max(e.hyp||0,.5)}
    for(const k of ['c19jam','c19dz','c19tox','c19dj'])if(e[k]>0)e[k]-=dt});
  G.c19cur=null}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.bl&&!G.done&&G.en)pre(G,dt)}catch(e){console.error(e)}return r}}
/* ghi nhận sát thương: ne8 (do mục tiêu trong 6 ô gây ra) · ne10 (mọi nguồn) */
function evt(G,kind,disp){if(!G||!G.bl||!(disp>0))return;
  G.bl.forEach(b=>{if(b.hp<=0||!b.nb)return;const c=b.nb.c19;if(c==='ne10')b.c19acc=(b.c19acc||0)+disp;
    else if(c==='ne8'&&kind!=='e'){const o=G.c19cur;if(o&&!o.dead&&o.team==='e'&&Math.hypot(o.x-b.x,o.y-b.y)<=CFG.ne8.R+(o.size||2)*.3)b.c19acc=(b.c19acc||0)+disp}})}
{const _S=dfDmgS;dfDmgS=function(s,d,f){const G=DG;try{if(G&&s&&!s.dead)evt(G,s.team==='e'?'e':'m',d*20)}catch(e){console.error(e)}return _S.apply(this,arguments)}}
{const _A=dfDmgA;dfDmgA=function(a,d){const G=DG;try{if(G&&a&&!a.dead)evt(G,'m',d*20)}catch(e){console.error(e)}return _A.apply(this,arguments)}}
{const _B=dfDmgB;dfDmgB=function(b,d){const G=DG;try{if(G&&G.bl&&b&&b.hp>0&&b.t!=='mine'&&d>0){evt(G,'b',d*DFB);if(b.hq)d=hqAbsorb(G,b,d)}}catch(e){console.error(e)}
  if(!(d>0))return;return _B.call(this,b,d)}}
{const _F=dfFire;dfFire=function(src,wp,tg,team){const G=DG;if(team==='e'&&G){const o=G.c19cur;G.c19cur=(src&&src.o)||null;try{return _F.apply(this,arguments)}finally{G.c19cur=o}}return _F.apply(this,arguments)}}
/* giáp gương chắn đạn / tia của địch */
{const _H=window.c14Hit;window.c14Hit=function(p){const G=DG;try{if(G&&G.bl&&p&&p.team==='e'&&!p.dead&&mirrorHit(G,p.x,p.y,p.dmg||0,p)){p.dead=true;return true}}catch(e){console.error(e)}return _H?_H.apply(this,arguments):false}}
{const _H=window.c14BeamHit;window.c14BeamHit=function(x,y,d){const G=DG;try{if(G&&G.bl&&mirrorHit(G,x,y,d||0))return true}catch(e){console.error(e)}return _H?_H.apply(this,arguments):false}}

/* ---------- xoay mũi: kn6 (hướng chỉnh ở Trụ sở, cố định) · kn8 / ne2 (360°) · ne7 (4 hướng chéo) ---------- */
window.c19TRN=function(b,im,q,x,y,w,h){const k=b.nb&&b.nb.c19;if(!k||!ROT[k])return false;
  let ta;if(k==='kn6')ta=k6ang(b);else if(k==='ne7')ta=-Math.PI/2+ne7d(b)*Math.PI/2;else{ta=b.c19t;if(ta==null)ta=-Math.PI/2}
  if(b.c19ra==null)b.c19ra=ta;
  if(k==='kn8'||k==='ne2'){let df=ta-b.c19ra;df=Math.atan2(Math.sin(df),Math.cos(df));b.c19ra+=df*.22}else b.c19ra=ta;
  const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;
  q.save();q.translate(x+w/2,y+h/2);q.rotate(b.c19ra+Math.PI/2);q.drawImage(im,-dw/2,-dh/2,dw,dh);q.restore();return true};

/* ---------- Trụ sở: chỉnh hướng bệ phóng lao (8 hướng) và giáp gương (4 hướng chéo) ---------- */
const DN6=['Lên','Lên phải','Phải','Xuống phải','Xuống','Xuống trái','Trái','Lên trái'];
const DN7=['Tây-Bắc (trên trái)','Đông-Bắc (trên phải)','Đông-Nam (dưới phải)','Tây-Nam (dưới trái)'];
const baseDir=b=>{try{return (S.base&&S.base.dir&&(S.base.dir[b.id]|0))||0}catch(e){return 0}};
window.c19BI=function(b){const t=b&&b.t;if(t!=='kn6'&&t!=='ne7')return '';const d=t==='kn6'?(baseDir(b)%8)*45:(baseDir(b)%4)*90;if(!d)return '';let sc=1;if(t==='kn6'){const th=d*Math.PI/180,c=Math.abs(Math.cos(th)),n=Math.abs(Math.sin(th)),w=b.w||1,h=b.h||2;sc=Math.min(w/(w*c+h*n),h/(w*n+h*c))}return ' style="transform:rotate('+d+'deg) scale('+sc.toFixed(3)+')"'};
window.c19BaseUI=function(sel){const rot=document.getElementById('brot');if(!rot)return;
  let btn=document.getElementById('bdir');
  if(!btn){btn=document.createElement('button');btn.id='bdir';btn.className='brs';btn.style.cssText='background:#0c2a70;border-color:#1c4fc9';rot.insertAdjacentElement('afterend',btn);
    btn.onclick=()=>{const b=BLD.find(x=>x.id===bState.sel);if(!b||(b.t!=='kn6'&&b.t!=='ne7'))return;const D=(S.base.dir=S.base.dir||{}),n=b.t==='kn6'?8:4;D[b.id]=((D[b.id]|0)+1)%n;save();bRender()}}
  const ok=!!sel&&(sel.t==='kn6'||sel.t==='ne7');btn.style.display=ok?'':'none';
  if(ok){const d=baseDir(sel),nm=sel.t==='kn6'?DN6[d%8]:DN7[d%4];btn.textContent='Xoay hướng';
    const n=document.getElementById('bnote');if(n)n.innerHTML+=' · <b>Hướng: '+nm+'</b> (bấm “Xoay hướng” để đổi; ra chiến trường không thể quay)'}};

/* ---------- vẽ ---------- */
const lab=(q,x,y,t,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';q.strokeText(t,x,y);q.fillStyle=col||'#fff';q.fillText(t,x,y);q.restore()};
const dashRing=(q,x,y,r,col,w)=>{q.save();q.setLineDash([4,6]);q.strokeStyle=col;q.lineWidth=w||1.4;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
function drawProj(q,p,X,Y,s,T){const x=X(p.x),y=Y(p.y),a=Math.atan2(p.vy,p.vx);
  const trail=(col,w,al)=>{const n=p.tr.length;if(n<2)return;q.save();q.lineCap='round';for(let i=1;i<n;i++){q.globalAlpha=(i/n)*al;q.strokeStyle=col;q.lineWidth=Math.max(1,w*i/n);q.beginPath();q.moveTo(X(p.tr[i-1][0]),Y(p.tr[i-1][1]));q.lineTo(X(p.tr[i][0]),Y(p.tr[i][1]));q.stroke()}q.restore()};
  q.save();
  switch(p.st){
  case'orange':{trail('#ff9a3a',s*.16,.5);const r=s*.17,g=q.createRadialGradient(x,y,0,x,y,r*1.6);g.addColorStop(0,'#fff6d0');g.addColorStop(.4,'#ffa43a');g.addColorStop(1,'rgba(255,90,20,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.6,0,7);q.fill();q.fillStyle='#ff8a1e';q.beginPath();q.arc(x,y,r*.72,0,7);q.fill();q.fillStyle='#fff0b8';q.beginPath();q.arc(x-r*.15,y-r*.15,r*.3,0,7);q.fill();break}
  case'rifle':{trail('#5fb0ff',s*.1,.55);q.translate(x,y);q.rotate(a);q.shadowColor='#4aa8ff';q.shadowBlur=s*.25;const g=q.createLinearGradient(-s*.42,0,s*.14,0);g.addColorStop(0,'rgba(60,150,255,0)');g.addColorStop(.7,'#5fb8ff');g.addColorStop(1,'#ffffff');q.fillStyle=g;q.beginPath();q.moveTo(s*.2,0);q.lineTo(-s*.42,-s*.04);q.lineTo(-s*.42,s*.04);q.fill();break}
  case'nuke':{trail('#a8ff4a',s*.32,.55);const r=s*.3,g=q.createRadialGradient(x,y,0,x,y,r*1.9);g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#d8ff7a');g.addColorStop(.65,'#6fd81e');g.addColorStop(1,'rgba(60,160,10,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.9,0,7);q.fill();
    q.fillStyle='#1c2a0a';q.beginPath();q.arc(x,y,r*.62,0,7);q.fill();q.fillStyle='#e8ff6a';for(let i=0;i<3;i++){const a0=T*5+i*2.094;q.beginPath();q.moveTo(x,y);q.arc(x,y,r*.55,a0,a0+.95);q.closePath();q.fill()}break}
  case'blt':{trail('#6ab7ff',s*.28,.55);const r=s*.26,g=q.createRadialGradient(x,y,0,x,y,r*1.8);g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#a8d8ff');g.addColorStop(.65,'#2f86ff');g.addColorStop(1,'rgba(20,60,200,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.8,0,7);q.fill();break}
  default:q.fillStyle='#fff';q.beginPath();q.arc(x,y,s*.1,0,7);q.fill()}
  q.restore()}
function drawE(q,o,G,X,Y,s,T){
  if(o.k==='tether'){const x0=X(o.ox),y0=Y(o.oy),x1=X(o.x),y1=Y(o.y),a=Math.atan2(y1-y0,x1-x0),fade=o.ph===2?Math.max(0,1-o.rt/.25):1;
    q.save();q.globalAlpha=fade;q.lineCap='round';q.strokeStyle='rgba(15,22,40,.92)';q.lineWidth=Math.max(3,s*.11);q.beginPath();q.moveTo(x0,y0);q.lineTo(x1,y1);q.stroke();
    q.strokeStyle='#d6e4ff';q.lineWidth=Math.max(1.3,s*.045);q.setLineDash([s*.16,s*.07]);q.beginPath();q.moveTo(x0,y0);q.lineTo(x1,y1);q.stroke();q.setLineDash([]);
    q.translate(x1,y1);q.rotate(a);q.shadowColor='#bcd8ff';q.shadowBlur=8;q.fillStyle='#eef4ff';q.strokeStyle='#5a6a96';q.lineWidth=1.5;q.beginPath();q.moveTo(s*.3,0);q.lineTo(-s*.08,-s*.15);q.lineTo(s*.02,0);q.lineTo(-s*.08,s*.15);q.closePath();q.fill();q.stroke();q.restore()}
  else if(o.k==='zone'){const px=X(o.x),py=Y(o.y),R=o.R*s,al=Math.min(1,o.t*3)*Math.min(1,(o.max-o.t)*2.5);
    q.save();q.globalAlpha=Math.max(0,al);const g=q.createRadialGradient(px,py,R*.1,px,py,R);g.addColorStop(0,'rgba(190,255,110,.16)');g.addColorStop(.6,'rgba(120,225,50,.26)');g.addColorStop(1,'rgba(70,190,30,.42)');
    q.fillStyle=g;q.beginPath();q.arc(px,py,R,0,7);q.fill();q.strokeStyle='rgba(210,255,120,.9)';q.lineWidth=2.5;q.shadowColor='#a8ff4a';q.shadowBlur=10;q.setLineDash([R*.12,R*.07]);q.lineDashOffset=-T*30;q.beginPath();q.arc(px,py,R*(.97+.02*Math.sin(T*6)),0,7);q.stroke();q.setLineDash([]);
    q.shadowBlur=0;q.fillStyle='rgba(30,70,8,.55)';q.beginPath();q.arc(px,py,R*.16,0,7);q.fill();q.fillStyle='rgba(235,255,120,.85)';for(let i=0;i<3;i++){const a0=T*1.6+i*2.094;q.beginPath();q.moveTo(px,py);q.arc(px,py,R*.14,a0,a0+1.0);q.closePath();q.fill()}
    for(let i=0;i<16;i++){const u=(T*.45+hz(i+o.seed)*3)%1,a0=hz(i*3+o.seed)*6.28,rr=Math.sqrt(hz(i*7+o.seed))*R*.92;q.globalAlpha=al*(1-u)*.8;q.fillStyle='#d8ff7a';q.beginPath();q.arc(px+Math.cos(a0)*rr,py+Math.sin(a0)*rr-u*s*.9,Math.max(1.2,s*.05*(1-u)),0,7);q.fill()}
    q.restore()}
  else if(o.k==='arc'){const cx=X(o.x),cy=Y(o.y),dx=o.dx,dy=o.dy,nx=-dy,ny=dx,al=Math.min(1,o.t*8)*Math.min(1,(9-o.trav)*.5+.4),N=26,W=o.w*s;
    const pt=(i,j)=>{const u=i/N*2-1,lat=u*W/2,fw=-.07*lat*lat/s*1+(hz(i*5+Math.floor(T*28))-.5)*j;return [cx+nx*lat+dx*fw,cy+ny*lat+dy*fw]};
    q.save();q.globalAlpha=Math.max(0,al);q.lineCap='round';q.lineJoin='round';q.globalCompositeOperation='lighter';
    [[s*.34,'rgba(150,60,255,.35)',s*.2],[s*.14,'rgba(200,120,255,.75)',s*.1],[s*.05,'#ffffff',s*.06]].forEach(L=>{q.strokeStyle=L[1];q.lineWidth=L[0];q.beginPath();for(let i=0;i<=N;i++){const p=pt(i,L[2]);i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1])}q.stroke()});
    q.strokeStyle='rgba(220,170,255,.7)';q.lineWidth=s*.04;for(let k=0;k<4;k++){const i=3+k*6,p=pt(i,s*.2);q.beginPath();q.moveTo(p[0],p[1]);q.lineTo(p[0]+dx*s*(.5+hz(k+Math.floor(T*20))*.5)+nx*(hz(k+9)-.5)*s*.8,p[1]+dy*s*(.5+hz(k+Math.floor(T*20))*.5)+ny*(hz(k+9)-.5)*s*.8);q.stroke()}
    q.restore()}
  else if(o.k==='laser'){const x1=X(o.x1),y1=Y(o.y1),x2=X(o.x2),y2=Y(o.y2),f=Math.max(0,1-o.t/o.max);
    q.save();q.lineCap='round';q.globalCompositeOperation='lighter';q.globalAlpha=f;q.strokeStyle='rgba(170,80,255,.5)';q.lineWidth=o.w*s*.09+3;q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke();
    q.strokeStyle='rgba(225,180,255,.9)';q.lineWidth=o.w*s*.04+1.5;q.stroke();q.strokeStyle='#fff';q.lineWidth=Math.max(1,o.w*s*.015);q.stroke();
    const g=q.createRadialGradient(x2,y2,0,x2,y2,s*.7);g.addColorStop(0,'rgba(255,255,255,'+f+')');g.addColorStop(1,'rgba(150,60,255,0)');q.fillStyle=g;q.beginPath();q.arc(x2,y2,s*.7,0,7);q.fill();q.restore()}
  else if(o.k==='prism'){const e=o.e;if(!e||e.dead)return;const px=X(e.x),py=Y(e.y),r=(e.size||2)*s*.62,u=Math.min(1,o.t*5)*Math.min(1,(o.max-o.t)*4+.2),ph=T*.9;
    q.save();q.globalAlpha=Math.max(0,.92*u);q.translate(px,py);q.rotate(ph*.35);
    const pts=[];for(let i=0;i<8;i++){const a0=i*Math.PI/4-Math.PI/2,rr=i%2===0?r*1.55:r*.86;pts.push([Math.cos(a0)*rr,Math.sin(a0)*rr])}
    const g=q.createRadialGradient(0,0,r*.2,0,0,r*1.55);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(.6,'rgba(150,200,255,.35)');g.addColorStop(1,'rgba(90,150,255,.22)');
    q.fillStyle=g;q.strokeStyle='rgba(235,246,255,.95)';q.lineWidth=2;q.shadowColor='#9fd0ff';q.shadowBlur=14;q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();q.fill();q.stroke();
    q.shadowBlur=0;q.strokeStyle='rgba(255,255,255,.55)';q.lineWidth=1.2;for(let i=0;i<8;i+=2){q.beginPath();q.moveTo(0,0);q.lineTo(pts[i][0],pts[i][1]);q.stroke()}
    q.fillStyle='rgba(255,255,255,.25)';q.beginPath();q.moveTo(0,0);q.lineTo(pts[0][0],pts[0][1]);q.lineTo(pts[1][0],pts[1][1]);q.lineTo(pts[2][0],pts[2][1]);q.closePath();q.fill();q.restore();
    q.save();q.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const a0=T*3+i*1.26,rr=r*(.6+.5*hz(i+Math.floor(T*4)));q.fillStyle='rgba(255,255,255,'+(.5*u)+')';q.beginPath();q.arc(px+Math.cos(a0)*rr,py+Math.sin(a0)*rr,Math.max(1.2,s*.05),0,7);q.fill()}q.restore();
    lab(q,px,py-(e.size||2)*s*.82,'Chói lòa '+Math.max(0,Math.ceil(o.max-o.t))+'s','#cfe8ff',10)}
  else if(o.k==='box'){const e=o.e;if(!e||e.dead)return;const px=X(e.x),py=Y(e.y),w=(e.size||2)*s*.95,h=w*.78,dx=w*.3,dy=-w*.3,u=Math.min(1,o.t*5)*Math.min(1,(o.max-o.t)*4+.2);
    const x0=px-w/2-dx/2,y0=py-h/2-dy/2;
    q.save();q.globalAlpha=Math.max(0,u);q.lineJoin='round';
    q.fillStyle='rgba(140,110,255,.16)';q.beginPath();q.rect(x0+dx,y0+dy,w,h);q.fill();
    q.fillStyle='rgba(170,140,255,.22)';q.beginPath();q.moveTo(x0,y0);q.lineTo(x0+dx,y0+dy);q.lineTo(x0+dx+w,y0+dy);q.lineTo(x0+w,y0);q.closePath();q.fill();
    q.fillStyle='rgba(120,200,255,.2)';q.beginPath();q.moveTo(x0+w,y0);q.lineTo(x0+w+dx,y0+dy);q.lineTo(x0+w+dx,y0+dy+h);q.lineTo(x0+w,y0+h);q.closePath();q.fill();
    q.fillStyle='rgba(200,230,255,.14)';q.beginPath();q.rect(x0,y0,w,h);q.fill();
    q.strokeStyle='rgba(215,205,255,.95)';q.lineWidth=2;q.shadowColor='#a890ff';q.shadowBlur=10;
    q.beginPath();q.rect(x0,y0,w,h);q.rect(x0+dx,y0+dy,w,h);[[0,0],[w,0],[0,h],[w,h]].forEach(c=>{q.moveTo(x0+c[0],y0+c[1]);q.lineTo(x0+c[0]+dx,y0+c[1]+dy)});q.stroke();
    q.shadowBlur=0;q.strokeStyle='rgba(255,255,255,.55)';q.lineWidth=1.2;const sc=(T*.9+o.seed)%1;q.beginPath();q.moveTo(x0,y0+sc*h);q.lineTo(x0+w,y0+sc*h);q.lineTo(x0+w+dx,y0+sc*h+dy);q.stroke();
    q.restore();lab(q,px,py-h*.8,'Bị nhốt '+Math.max(0,Math.ceil(o.max-o.t))+'s','#d8ccff',10)}
  else if(o.k==='hyp'){const e=o.e,b=o.b;if(!e||e.dead)return;const px=X(e.x),py=Y(e.y),bx=X(b.x),by=Y(b.y),r=(e.size||2)*s*.6;
    q.save();q.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const u=(T*1.4+i/4)%1,x=bx+(px-bx)*u,y=by+(py-by)*u;q.strokeStyle='rgba(120,190,255,'+(.75*(1-u))+')';q.lineWidth=2.5;q.beginPath();q.arc(x,y,s*(.15+.5*u),0,7);q.stroke()}
    q.globalCompositeOperation='source-over';q.strokeStyle='rgba(140,200,255,.9)';q.lineWidth=2.5;q.setLineDash([r*.4,r*.25]);q.lineDashOffset=-T*40;q.beginPath();q.arc(px,py,r*1.15,0,7);q.stroke();q.setLineDash([]);
    q.strokeStyle='rgba(190,225,255,.8)';q.lineWidth=2;q.beginPath();for(let i=0;i<=40;i++){const a0=i/40*12.566+T*4,rr=r*.2+r*.9*i/40;i?q.lineTo(px+Math.cos(a0)*rr,py+Math.sin(a0)*rr):q.moveTo(px,py)}q.stroke();q.restore();
    lab(q,px,py-(e.size||2)*s*.78,'Đồng minh '+Math.max(0,Math.ceil(o.max-o.t))+'s','#9fc8ff',10)}
  else if(o.k==='sky'){if(o.t<o.dl)return;const u=o.t-o.dl,px=X(o.x),py=Y(o.y),R=CFG.ne10.d/2*s;
    if(u<.9){const w=Math.min(1,u*3);q.save();q.strokeStyle='rgba(200,120,255,'+(.5+.35*Math.sin(T*18))+')';q.lineWidth=2.5;q.setLineDash([R*.3,R*.15]);q.lineDashOffset=-T*40;q.beginPath();q.arc(px,py,R,0,7);q.stroke();q.setLineDash([]);
      q.fillStyle='rgba(150,60,255,'+(.1+.18*u)+')';q.beginPath();q.arc(px,py,R,0,7);q.fill();q.restore()}
    if(u<.85){const f=Math.pow(1-u/.85,1.7),sy=py-f*s*10,r=R*.55;q.save();q.globalCompositeOperation='lighter';
      const tg=q.createLinearGradient(px,sy,px,sy-s*4);tg.addColorStop(0,'rgba(190,110,255,.8)');tg.addColorStop(1,'rgba(120,40,255,0)');q.fillStyle=tg;q.beginPath();q.moveTo(px-r*.8,sy);q.lineTo(px+r*.8,sy);q.lineTo(px,sy-s*4);q.closePath();q.fill();
      const g=q.createRadialGradient(px,sy,0,px,sy,r*1.6);g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#e0b8ff');g.addColorStop(.65,'#9a3cff');g.addColorStop(1,'rgba(80,0,180,0)');q.fillStyle=g;q.beginPath();q.arc(px,sy,r*1.6,0,7);q.fill();q.restore()}
    else if(u<1.15){const f=(u-.85)/.3;q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(225,180,255,'+(1-f)+')';q.lineWidth=5*(1-f)+1.5;q.beginPath();q.arc(px,py,R*(.6+.9*f),0,7);q.stroke();
      const g=q.createRadialGradient(px,py,0,px,py,R*1.2);g.addColorStop(0,'rgba(255,255,255,'+(.8*(1-f))+')');g.addColorStop(1,'rgba(150,60,255,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,R*1.2,0,7);q.fill();q.restore()}}}
function info(b,G){const c=b.nb.c19,t=Math.ceil;
  switch(c){
  case'kn6':return b.cd>0?['Dây phóng: hồi '+t(b.cd)+'s','#c8d6ff']:['Dây phóng: sẵn sàng','#e0e6ff'];
  case'kn8':return b.c19rl>0?['Nạp đạn '+t(b.c19rl)+'s','#ffd27a']:['Đạn '+(b.c19am==null?CFG.kn8.mag:b.c19am)+'/'+CFG.kn8.mag,'#bfe0ff'];
  case'kn9':return b.c19cd>0?['Khiên: hồi '+t(b.c19cd)+'s','#c8d6ff']:['Khiên: sẵn sàng','#bfe8ff'];
  case'kn10':return b.c19T>0?['Vùng hạt nhân sau '+t(b.c19T)+'s','#d8ff7a']:['Vùng hạt nhân: sẵn sàng','#d8ff7a'];
  case'ne1':return b.c19tg?['Truyền '+fmt(CFG.ne1.rate*LV(b))+' năng lượng/giây','#7df0ff']:['Không có đồng minh cần năng lượng','#8fa6d8'];
  case'ne2':case'ne3':case'ne4':{const C=CFG[c],f=(b.c19c||0)/C.charge;return f>=1?['Sẵn sàng','#e4c8ff']:['Tụ năng lượng '+t(C.charge-(b.c19c||0))+'s','#d9b0ff']}
  case'ne5':return b.c19h?['Thôi miên '+t(b.c19h.t)+'s','#9fc8ff']:b.c19cd>0?['Nghỉ '+t(b.c19cd)+'s','#8fa6d8']:['Sẵn sàng','#9fc8ff'];
  case'ne6':return b.c19cd>0?['Sao chép: hồi '+t(b.c19cd)+'s','#c8d6ff']:['Sao chép: sẵn sàng','#7df0ff'];
  case'ne7':{const m=b.c19m;return !m?['Giáp gương','#bfe0ff']:m.hp>0?['Chắn '+nf(m.hp*DFB)+'/'+nf(m.max*DFB),'#bfe0ff']:['Giáp gương hồi '+t(m.cd==null?CFG.ne7.cd:m.cd)+'s','#ffc86a']}
  case'ne8':return ['Tích lũy '+nf(b.c19acc||0)+' · nổ sau '+t(Math.max(0,b.c19w==null?CFG.ne8.every:b.c19w))+'s','#9fd0ff'];
  case'ne9':{const m=b.c19x;return !m?['Ma trận giáp','#d9b0ff']:m.hp>0?['Ma trận '+nf(m.hp*DFB)+'/'+nf(m.max*DFB),'#d9b0ff']:['Ma trận hồi '+t(m.cd==null?CFG.ne9.cd:m.cd)+'s','#ffc86a']}
  case'ne10':return ['Quang phổ '+nf(Math.min(b.c19acc||0,CFG.ne10.need))+'/'+nf(CFG.ne10.need)+(b.c19cd>0?' · hồi '+t(b.c19cd)+'s':''),'#e0c0ff'];
  case'tj1':return b.c19n?['Nhiễu '+b.c19n+' mục tiêu','#bfe6ff']:['Đang quét radar','#8fa6d8'];
  case'tj2':return b.c19cd>0?['Hồi '+t(b.c19cd)+'s','#c8b6ff']:['Sẵn sàng','#c8b6ff'];
  case'tj3':return ['Xung EMP · '+(b.c19dn||0)+' mục tiêu','#8fe8ff'];
  case'tj4':return ['Mạng điện từ · +'+fmt(CFG.tj4.sh*LV(b))+' giáp/2s','#8fe8ff'];
  default:return null}}
function drawMir(q,b,G,X,Y,s,T){const m=b.c19m;if(!m)return;const g=mirGeo(b),P=g.P.map(p=>[X(p[0]),Y(p[1])]),hit=m.hitT!=null?Math.max(0,1-(G.t-m.hitT)/.35):0,up=Math.min(1,(G.t-(m.up||0))/.6);
  if(m.hp<=0){q.save();q.setLineDash([5,7]);q.strokeStyle='rgba(190,215,255,.2)';q.lineWidth=2;q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();q.restore();return}
  const f=m.hp/m.max,dx=-g.fy*s*.2,dy=g.fx*s*.2;
  q.save();q.globalAlpha=Math.max(.15,up);q.lineJoin='round';q.lineCap='round';
  q.fillStyle='rgba(150,205,255,'+(.2+.12*f+.2*hit)+')';q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));for(let i=P.length-1;i>=0;i--)q.lineTo(P[i][0]-g.fx*s*.28,P[i][1]-g.fy*s*.28);q.closePath();q.fill();
  q.shadowColor='#9fd0ff';q.shadowBlur=10+14*hit;q.strokeStyle='rgba(225,242,255,'+(.7+.3*f)+')';q.lineWidth=s*.14;q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();
  q.shadowBlur=0;q.strokeStyle='rgba(255,255,255,.85)';q.lineWidth=s*.04;q.beginPath();P.forEach((p,i)=>{const x=p[0]+g.fx*s*.05,y=p[1]+g.fy*s*.05;i?q.lineTo(x,y):q.moveTo(x,y)});q.stroke();
  const sh=((T*.6)%1),k=Math.floor(sh*(P.length-1));q.globalCompositeOperation='lighter';q.fillStyle='rgba(255,255,255,.7)';q.beginPath();q.arc(P[k][0],P[k][1],s*.1,0,7);q.fill();q.restore()}
function drawMat(q,b,G,X,Y,s,T){const m=b.c19x,h=G.hq;if(!m||!h)return;const w=h.w+1.4,hh=h.h+1.4,x0=X(h.x-w/2),y0=Y(h.y-hh/2),W=w*s,H=hh*s,up=Math.min(1,(G.t-(m.up||0))/.7),hit=m.hitT!=null?Math.max(0,1-(G.t-m.hitT)/.35):0;
  if(m.hp<=0){q.save();q.setLineDash([6,8]);q.strokeStyle='rgba(190,170,255,.22)';q.lineWidth=2;q.strokeRect(x0,y0,W,H);q.restore();return}
  const f=m.hp/m.max;q.save();q.globalAlpha=Math.max(.2,up);
  const g=q.createLinearGradient(x0,y0,x0+W,y0+H);g.addColorStop(0,'rgba(150,90,255,'+(.12+.1*f+.2*hit)+')');g.addColorStop(1,'rgba(90,60,220,'+(.16+.12*f+.2*hit)+')');
  q.fillStyle=g;q.shadowColor='#a070ff';q.shadowBlur=14+14*hit;q.strokeStyle='rgba(205,175,255,'+(.7+.3*f)+')';q.lineWidth=3;q.beginPath();RR(q,x0,y0,W,H,s*.5);q.fill();q.stroke();q.shadowBlur=0;
  q.strokeStyle='rgba(190,150,255,.4)';q.lineWidth=1;q.beginPath();const st=s*.7;for(let x=x0+st;x<x0+W;x+=st){q.moveTo(x,y0);q.lineTo(x,y0+H)}for(let y=y0+st;y<y0+H;y+=st){q.moveTo(x0,y);q.lineTo(x0+W,y)}q.stroke();
  const sc=(T*.5)%1;q.strokeStyle='rgba(235,215,255,.5)';q.lineWidth=2;q.beginPath();q.moveTo(x0,y0+sc*H);q.lineTo(x0+W,y0+sc*H);q.stroke();
  q.globalCompositeOperation='lighter';[[x0,y0],[x0+W,y0],[x0,y0+H],[x0+W,y0+H]].forEach((p,i)=>{const r=s*(.2+.06*Math.sin(T*6+i)),gg=q.createRadialGradient(p[0],p[1],0,p[0],p[1],r*2);gg.addColorStop(0,'rgba(255,255,255,.95)');gg.addColorStop(.4,'rgba(190,130,255,.8)');gg.addColorStop(1,'rgba(110,50,255,0)');q.fillStyle=gg;q.beginPath();q.arc(p[0],p[1],r*2,0,7);q.fill();
    q.strokeStyle='rgba(215,170,255,.55)';q.lineWidth=2;q.beginPath();q.moveTo(X(b.x),Y(b.y));q.lineTo(p[0],p[1]);q.stroke()});
  q.restore()}
window.c19Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  G.bl.forEach(b=>{if(b.hp<=0)return;const c=b.nb&&b.nb.c19;if(!c)return;const px=X(b.x),py=Y(b.y),top=py-b.h*s*.62;
    if(c==='kn6'){const a=k6ang(b),ax=Math.cos(a),ay=Math.sin(a),C=CFG.kn6;q.save();q.strokeStyle='rgba(200,215,255,.15)';q.lineWidth=2;q.setLineDash([5,7]);k6tips(b).forEach(t=>{q.beginPath();q.moveTo(X(t.x),Y(t.y));q.lineTo(X(t.x+ax*C.rng),Y(t.y+ay*C.rng));q.stroke()});q.restore()}
    else if(c==='kn7'){const C=CFG.kn7;q.save();q.strokeStyle='rgba(255,200,130,.14)';q.lineWidth=1.2;q.setLineDash([5,7]);k7tips(b).forEach(t=>{q.beginPath();q.moveTo(X(t.x),Y(t.y));q.lineTo(X(t.x+t.dx*C.rng),Y(t.y+t.dy*C.rng));q.stroke()});q.restore()}
    else if(c==='kn9'){const u=b.c19w!=null?(G.t-b.c19w)/.9:2;if(u<1){q.save();q.globalCompositeOperation='lighter';const R=CFG.kn9.R*s*u;q.strokeStyle='rgba(200,235,255,'+(.8*(1-u))+')';q.lineWidth=5*(1-u)+1.5;q.beginPath();q.arc(px,py,R,0,7);q.stroke();const g=q.createRadialGradient(px,py,R*.75,px,py,R);g.addColorStop(0,'rgba(120,200,255,0)');g.addColorStop(1,'rgba(150,220,255,'+(.3*(1-u))+')');q.fillStyle=g;q.beginPath();q.arc(px,py,R,0,7);q.fill();q.restore()}}
    else if(c==='ne1'){dashRing(q,px,py,CFG.ne1.R*s,'rgba(125,240,255,.2)')}
    else if(c==='ne2'||c==='ne3'||c==='ne4'){const C=CFG[c],f=Math.min(1,(b.c19c||0)/C.charge),col=c==='ne3'?'200,230,255':'200,130,255';
      if(c!=='ne4')dashRing(q,px,py,C.R*s,'rgba('+col+',.2)');
      q.save();q.globalCompositeOperation='lighter';const r=s*(.25+.9*f),g=q.createRadialGradient(px,py,0,px,py,r*1.5);g.addColorStop(0,'rgba('+col+','+(.15+.55*f)+')');g.addColorStop(1,'rgba('+col+',0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.5,0,7);q.fill();
      q.strokeStyle='rgba('+col+',.9)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.62,-Math.PI/2,-Math.PI/2+Math.PI*2*f);q.stroke();q.restore()}
    else if(c==='ne5'){dashRing(q,px,py,CFG.ne5.R*s,'rgba(120,180,255,.2)')}
    else if(c==='ne6'){dashRing(q,px,py,CFG.ne6.R*s,'rgba(125,240,255,.22)');const f=b.c19cd>0?b.c19cd/CFG.ne6.cd:0;if(f>0){q.save();q.strokeStyle='rgba(255,200,110,.8)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.62,-Math.PI/2,-Math.PI/2+Math.PI*2*f);q.stroke();q.restore()}}
    else if(c==='ne7')drawMir(q,b,G,X,Y,s,T);
    else if(c==='ne8'){const C=CFG.ne8;dashRing(q,px,py,C.R*s,'rgba(110,180,255,.22)');const f=Math.min(1,(b.c19acc||0)/6000);q.save();q.globalCompositeOperation='lighter';const r=s*(.2+.6*f),g=q.createRadialGradient(px,py,0,px,py,r*1.6);g.addColorStop(0,'rgba(200,230,255,.8)');g.addColorStop(.5,'rgba(70,150,255,.5)');g.addColorStop(1,'rgba(40,100,255,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.6,0,7);q.fill();q.restore()}
    else if(c==='ne9')drawMat(q,b,G,X,Y,s,T);
    else if(c==='ne10'){const f=Math.min(1,(b.c19acc||0)/CFG.ne10.need);q.save();q.globalCompositeOperation='lighter';const r=s*(.3+1.1*f),g=q.createRadialGradient(px,py,0,px,py,r*1.5);g.addColorStop(0,'rgba(255,230,255,'+(.2+.6*f)+')');g.addColorStop(.5,'rgba(170,90,255,'+(.15+.4*f)+')');g.addColorStop(1,'rgba(100,40,255,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.5,0,7);q.fill();
      q.strokeStyle='rgba(225,190,255,.9)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.58,-Math.PI/2,-Math.PI/2+Math.PI*2*f);q.stroke();q.restore()}
    else if(c==='tj1'){const R=CFG.tj1.R*s,a=b.c19sw||0;dashRing(q,px,py,R,'rgba(130,210,255,.25)');q.save();q.globalCompositeOperation='lighter';const g=q.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,'rgba(120,220,255,.3)');g.addColorStop(1,'rgba(120,220,255,0)');q.fillStyle=g;q.beginPath();q.moveTo(px,py);q.arc(px,py,R,a-.55,a);q.closePath();q.fill();q.strokeStyle='rgba(190,245,255,.7)';q.lineWidth=1.6;q.beginPath();q.moveTo(px,py);q.lineTo(px+Math.cos(a)*R,py+Math.sin(a)*R);q.stroke();q.restore()}
    else if(c==='tj2'){dashRing(q,px,py,CFG.tj2.R*s,'rgba(180,150,255,.2)')}
    else if(c==='tj3'){const R=CFG.tj3.R*s,u=b.c19pt!=null?(G.t-b.c19pt)/.7:2;dashRing(q,px,py,R,'rgba(130,230,255,.2)');if(u<1){q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(150,235,255,'+(.85*(1-u))+')';q.lineWidth=4*(1-u)+1.5;q.shadowColor='#7fe8ff';q.shadowBlur=10;q.beginPath();q.arc(px,py,R*u,0,7);q.stroke();q.restore()}}
    else if(c==='tj4'){const u=b.c19pt!=null?(G.t-b.c19pt)/.8:2;if(u<1){q.save();q.globalCompositeOperation='lighter';G.bl.forEach(o=>{if(o.hp<=0||o.t==='mine'||o.aux||o.u||o===b)return;const x2=X(o.x),y2=Y(o.y);q.strokeStyle='rgba(130,230,255,'+(.5*(1-u))+')';q.lineWidth=1.6;q.beginPath();q.moveTo(px,py);
        const N=6,nx=-(y2-py),ny=x2-px,l=Math.hypot(nx,ny)||1;for(let k=1;k<N;k++){const t=k/N,j=(hz(k*7+Math.floor(T*14)+o.x*3)-.5)*s*.5;q.lineTo(px+(x2-px)*t+nx/l*j,py+(y2-py)*t+ny/l*j)}q.lineTo(x2,y2);q.stroke()});q.restore()}}
    const L=info(b,G);if(L)lab(q,px,top,L[0],L[1],10)});
  (G.c19e||[]).forEach(o=>{try{drawE(q,o,G,X,Y,s,T)}catch(e){}});
  (G.c19p||[]).forEach(p=>{if(!p.dead)drawProj(q,p,X,Y,s,T)});
  enemies(G).forEach(e=>{const px=X(e.x),py=Y(e.y),r=(e.size||2)*s;
    if(e.c19jam>0){q.save();q.strokeStyle='rgba(130,210,255,.85)';q.lineWidth=2;q.setLineDash([3,3]);q.beginPath();q.arc(px,py,r*.52,0,7);q.stroke();q.setLineDash([]);lab(q,px,py-r*.62,e.c19dj>0?'Drone bị khóa':'Cấm kỹ năng','#bfe6ff',9);q.restore()}
    if(e.c19tox>0){q.save();q.strokeStyle='rgba(190,255,100,.8)';q.lineWidth=2;q.beginPath();q.arc(px,py,r*.55,0,7);q.stroke();lab(q,px,py-r*.62,'Nhiễm độc','#d8ff7a',9);q.restore()}});
  (G.c19pop||[]).forEach(o=>{const u=o.t/o.max;q.save();q.globalAlpha=Math.min(1,(1-u)*2);lab(q,X(o.x),Y(o.y)-u*s*1.3,o.txt,o.col,11);q.restore()})};
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{window.c19Draw(q,G,X,Y,s,T)}catch(e){console.error(e)}}}

/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở ---------- */
(function(){
const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;
const {mkBld,mkEn,shell}=H;
const txt=(q,s,x,y,col,sz,al)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign=al||'center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
const mkAl=(G,c,x,y,i,hp,o)=>{const a=Object.assign({team:'p',x,y,hx:x,hy:y,hp:hp||100,max:hp||100,size:1.5,sh:c.pool[(i||0)%c.pool.length],dead:false,hit:0,ang:-Math.PI/2,capn:'Kaito',ws:[]},o||{});(G.al=G.al||[]).push(a);return a};
const drawAl=(q,a,X,Y,s,alpha)=>{if(a.dead)return;const im=dimg(a.sh.img);if(!im)return;const h=a.size*s,w=h*im.naturalWidth/im.naturalHeight;
  q.save();q.translate(X(a.x),Y(a.y));q.globalAlpha=alpha==null?1:alpha;q.drawImage(im,-w/2,-h/2,w,h);q.restore();
  if(a.max<1e8){const bw=a.size*s*.9,f=Math.max(0,a.hp/a.max);q.fillStyle='#000a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw,4);q.fillStyle='#6dff9a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw*f,4)}};
const shRing=(q,a,X,Y,s,T)=>{const v=shVal(a);if(!(v>0)||a.dead)return;q.save();q.strokeStyle='rgba(235,248,255,'+(.6+.25*Math.sin(T*8))+')';q.lineWidth=2.5;q.shadowColor='#fff';q.shadowBlur=10;q.beginPath();q.arc(X(a.x),Y(a.y),a.size*s*.66,0,7);q.stroke();q.restore()};
const expire=G=>{(G.al||[]).forEach(a=>{if(a.shd&&a.shd.c17&&G.t>a.shd.c17)a.shd=null;if(a.cs&&a.cs.abs&&a.cs.abs.t>0)a.cs.abs.t-=G.dtc||.02});G.bl.forEach(b=>{if(b.shd&&b.shd.t>0&&b.shd.t<9000){b.shd.t-=G.dtc||.02;if(b.shd.t<=0)b.shd=null}})};
const sway=(G,a,i,ax,ay)=>{a.x=a.hx+Math.sin(G.t*.8+i*1.7)*(ax==null?.45:ax);a.y=a.hy+Math.cos(G.t*.6+i)*(ay==null?.3:ay)};
const safe=o=>{['init','step','under','over'].forEach(k=>{const f=o[k];if(f)o[k]=function(){try{return f.apply(this,arguments)}catch(e){console.error('c19 sc',o.title,e)}}});return o};
const T0=(G,dt)=>{G.dtc=dt;pre(G,dt);expire(G)};
const solid=b=>{b.hp=b.max};
const mkE=(G,c,x,y,hp)=>{const e=mkEn(G,c,x,y,hp||1e9);e.noRev=true;e.hx=e.x;e.hy=e.y;e.hpb=1;return e};
const initC=(G,c,rc)=>{G.c18sim=1;G.c19sim=1;G.pvp=false;if(rc)G.c18rc=rc};
const dec=(e,dt)=>{if(e.stun>0)e.stun=Math.max(0,e.stun-dt);if(e.slowT>0){e.slowT-=dt;if(e.slowT<=0)e.slowK=1}if(e.silT>0)e.silT=Math.max(0,e.silT-dt);e.hp=e.max=1e9};
const homeAll=(es)=>es.forEach(e=>{e.x=e.hx;e.y=e.hy;e.stun=0;e.c19tet=0;e.c19kb=null;e.c19root=0;e.c19rx=null;e.slowK=1;e.slowT=0});
const mkSh=(G,x,y,tx,ty,dmg,sp)=>shell(G,x,y,tx,ty,dmg,sp||9);

SC.kn6=safe({title:'BỆ PHÓNG LAO ĐÔI',note:'Chỉnh hướng ở Trụ sở · 2 dây lao kéo 2 mục tiêu trong 7 ô về phía bệ phóng + choáng 2 giây (hồi 6 giây)',
  init(G,c){initC(G,c);c.b=mkBld(G,'kn6',7.5,7.9,{lv:c.lv});c.b.c19dir=0;c.es=[mkE(G,c,6.6,3.4),mkE(G,c,8.5,1.9),mkE(G,c,12.7,3.2)];c.ft=-9;c.fl=null},
  step(G,dt,c){const b=c.b;c.es.forEach(e=>dec(e,dt));T0(G,dt);solid(b);TICK.kn6(b,dt,G);
    if(b.c19fl!==c.fl){c.fl=b.c19fl;c.ft=G.t}if(G.t-c.ft>3.8&&c.es.some(e=>Math.hypot(e.x-e.hx,e.y-e.hy)>.1))homeAll(c.es)},
  over(q,G,c,X,Y,s){c.es.forEach((e,i)=>{if(e.stun>0)txt(q,'choáng '+fmt(e.stun)+'s',X(e.x),Y(e.y)-e.size*s*.7,'#e0e6ff',10);else if(i===2)txt(q,'ngoài làn · không bị kéo',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10)});
    txt(q,'Hướng đặt ở Trụ sở: Lên · ra trận không thể quay',X(7.5),Y(9.9),'#bfd0ff',11)}});

SC.kn7=safe({title:'PHÁO NÒNG CHỮ X',note:'Chỉ bắn được mục tiêu nằm trên đường chéo của 4 nòng: 52 sát thương, nổ lan 1,2 ô',
  init(G,c){initC(G,c);c.b=mkBld(G,'kn7',7.5,6.4,{lv:c.lv});c.es=[0,1,2,3].map(i=>mkE(G,c,7.5,6.4));c.o=mkE(G,c,7.5,.9)},
  step(G,dt,c){const b=c.b;c.es.forEach((e,i)=>{const d=DIAG[i],L=4.2+((G.t*.8+i)%3)*1.6;e.x=b.x+d[0]*L;e.y=b.y+d[1]*L;e.hp=e.max=1e9});c.o.x=7.5+Math.sin(G.t*.7)*3.4;c.o.y=.9;c.o.hp=c.o.max=1e9;T0(G,dt);solid(b);TICK.kn7(b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'ngoài nòng · không trúng',X(c.o.x),Y(c.o.y)-c.o.size*s*.7,'#8fa6d8',10);txt(q,'Chỉ bắn dọc 4 đường chéo',X(7.5),Y(9.9),'#ffd0a0',11)}});

SC.kn8=safe({title:'SÚNG TRƯỜNG XUYÊN GIÁP',note:'Băng 30 viên đạn xanh · 2 phát/giây · 80 sát thương/viên · nạp 7 giây · xoay 360°',
  init(G,c){initC(G,c);c.b=mkBld(G,'kn8',7.5,6.9,{lv:c.lv});c.b.c19am=7;c.es=[mkE(G,c,3.4,2.6),mkE(G,c,12,3),mkE(G,c,7.5,.9)]},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*(.5+i*.15)+i*2)*2.2;e.y=e.hy+Math.cos(G.t*.4+i)*.6;e.hp=e.max=1e9});T0(G,dt);solid(c.b);TICK.kn8(c.b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'Hết 30 viên: nạp lại 7 giây',X(7.5),Y(9.9),'#bfe0ff',11)}});

SC.kn9=safe({title:'TẤM KHIÊN CHẮN TƯỜNG THÀNH',note:'Khi đồng minh dưới 50% máu: +200 giáp cho đồng minh và công trình trong 15 ô (xem nhanh)',
  init(G,c){initC(G,c);c.b=mkBld(G,'kn9',7.5,5.6,{lv:c.lv});c.a=[mkAl(G,c,3.4,3,0,100),mkAl(G,c,12.2,3.3,1,100),mkAl(G,c,7.5,9,2,100)];c.w=[mkBld(G,'wall',4.6,6.6,{w:2,h:1,max:4}),mkBld(G,'cannon',11.2,7,{max:4})];c.t=0;c.low=false},
  step(G,dt,c){c.t+=dt;c.a.forEach((a,i)=>{sway(G,a,i);a.hp=Math.max(a.hp,a.max*(c.low&&i===0?.4:1))});solid(c.b);const a0=c.a[0];
    if(!c.low&&c.t>2.2){c.low=true;a0.hp=a0.max*.4;c.t=0}else if(c.low&&c.t>4.6){c.low=false;a0.hp=a0.max;c.t=0}
    c.w.forEach(b=>{b.hp=b.max});T0(G,dt);TICK.kn9(c.b,dt,G)},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t);const v=shVal(a);if(v>0)txt(q,'+'+Math.round(v*1)+' giáp',X(a.x),Y(a.y)-a.size*s*.8,'#ffffff',10);else if(a.hp<a.max*.5)txt(q,'dưới 50% máu',X(a.x),Y(a.y)-a.size*s*.8,'#ffb0a0',10)});
    c.w.forEach(b=>{if(b.shd&&b.shd.v>0)txt(q,'+'+Math.round(b.shd.v*DFB)+' giáp',X(b.x),Y(b.y)-b.h*s*.8,'#bfe8ff',10)});txt(q,'Phạm vi 15 ô',X(7.5),Y(9.9),'#bfe8ff',11)}});

SC.kn10=safe({title:'NHÀ HẠT NHÂN',note:'Mỗi 5 giây phóng vùng hạt nhân bán kính 5 ô, 5 giây: chậm 20% · nhiễm độc 20 sát thương / 0,1 giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'kn10',7.5,7.6,{lv:c.lv});c.es=[mkE(G,c,4.2,1.8),mkE(G,c,6.4,1.1),mkE(G,c,9.4,1.5),mkE(G,c,11.8,2.1)];c.es.forEach((e,i)=>{e.sp0=.55+i*.05})},
  step(G,dt,c){c.es.forEach(e=>{dec(e,dt);e.y+=e.sp0*dt*(e.slowK||1);if(e.y>4.8){e.y=.6;e.slowK=1;e.slowT=0}});T0(G,dt);solid(c.b);TICK.kn10(c.b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'Trong vùng: chậm 20% · −20 / 0,1 giây',X(7.5),Y(9.9),'#d8ff7a',11)}});

SC.ne1=safe({title:'THÁP TIA NĂNG LƯỢNG',note:'Truyền 20 năng lượng mỗi giây cho 1 đồng minh trong 5 ô',
  init(G,c){initC(G,c);c.b=mkBld(G,'ne1',7.5,5.6,{lv:c.lv});c.a=[mkAl(G,c,4.2,4.4,0,100,{nrg:15,nrgMax:100}),mkAl(G,c,10.8,6.2,1,100,{nrg:45,nrgMax:100}),mkAl(G,c,1.6,2.4,2,100,{nrg:10,nrgMax:100})]},
  step(G,dt,c){c.a.forEach((a,i)=>{sway(G,a,i);a.nrg=Math.max(0,a.nrg-(i===2?0:9)*dt);if(i===1&&a.nrg<20)a.nrg=45;if(i===0&&a.nrg<=0)a.nrg=0});T0(G,dt);solid(c.b);TICK.ne1(c.b,dt,G)},
  over(q,G,c,X,Y,s){ring2(q,X(c.b.x),Y(c.b.y),5*s);c.a.forEach(a=>{drawAl(q,a,X,Y,s);const bw=a.size*s*.9,f=a.nrg/a.nrgMax;q.fillStyle='#000a';q.fillRect(X(a.x)-bw/2,Y(a.y)+a.size*s*.6,bw,4);q.fillStyle='#43e6ff';q.fillRect(X(a.x)-bw/2,Y(a.y)+a.size*s*.6,bw*f,4);txt(q,'NL '+Math.round(a.nrg)+'/'+a.nrgMax,X(a.x),Y(a.y)+a.size*s*.6+14,'#9fe8ff',10)})}});
const ring2=(q,x,y,r)=>{q.save();q.setLineDash([5,6]);q.strokeStyle='rgba(125,240,255,.35)';q.lineWidth=1.5;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};

SC.ne2=safe({title:'THÁP LASER ĐÔI TÍM',note:'Tụ năng lượng 5 giây rồi bắn 2 tia laser tím, mỗi tia 300 sát thương, tầm 8 ô',
  init(G,c){initC(G,c);c.b=mkBld(G,'ne2',7.5,6.4,{lv:c.lv});c.b.c19c=2.2;c.es=[mkE(G,c,4.2,1.6),mkE(G,c,11,2.2),mkE(G,c,7.5,.6)];c.d=0},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.6+i*2)*1.2;e.hp=e.max=1e9});const f0=c.b.c19fl;T0(G,dt);solid(c.b);TICK.ne2(c.b,dt,G);if(c.b.c19fl!==f0)c.d+=2},
  over(q,G,c,X,Y,s){txt(q,'Mỗi lần: 2 tia × 300 sát thương',X(7.5),Y(9.9),'#e4c8ff',11)}});

SC.ne3=safe({title:'THÁP LĂNG KÍNH HỘI TỤ',note:'Tụ năng lượng 7 giây rồi làm chói lòa 3 mục tiêu trong 6 ô trong 3 giây: không dùng được kỹ năng, không di chuyển được',
  init(G,c){initC(G,c);c.b=mkBld(G,'ne3',7.5,6.4,{lv:c.lv});c.b.c19c=4.6;c.es=[mkE(G,c,4.4,3),mkE(G,c,10.8,3.4),mkE(G,c,7.5,1.8),mkE(G,c,13.6,.8)]},
  step(G,dt,c){c.es.forEach((e,i)=>{dec(e,dt);e.x=e.hx+Math.sin(G.t*.8+i*2.1)*1.3;e.y=e.hy+Math.cos(G.t*.6+i)*.4});T0(G,dt);solid(c.b);TICK.ne3(c.b,dt,G)},
  over(q,G,c,X,Y,s){c.es.forEach((e,i)=>{if(!(e.c19root>0)&&i===3)txt(q,'ngoài 6 ô',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10)});txt(q,'Chói lòa: cấm kỹ năng + không thể di chuyển',X(7.5),Y(9.9),'#cfe8ff',11)}});

SC.ne4=safe({title:'LÒ PLASMA PHÓNG ĐIỆN',note:'Tụ năng lượng 10 giây rồi phóng hồ quang tím dài 8 ô bay tối đa 9 ô: 120 sát thương, đẩy lùi 3 ô',
  init(G,c){initC(G,c);c.b=mkBld(G,'ne4',7.5,7.3,{lv:c.lv});c.b.c19c=6.8;c.es=[mkE(G,c,3.8,3.2),mkE(G,c,6.2,2.6),mkE(G,c,8.8,3.6),mkE(G,c,11.4,2.8)];c.ft=-9;c.fl=null},
  step(G,dt,c){const b=c.b;c.es.forEach(e=>{e.hp=e.max=1e9});T0(G,dt);solid(b);TICK.ne4(b,dt,G);if(b.c19fl!==c.fl){c.fl=b.c19fl;c.ft=G.t}if(G.t-c.ft>3.4&&c.es.some(e=>Math.hypot(e.x-e.hx,e.y-e.hy)>.1))homeAll(c.es)},
  over(q,G,c,X,Y,s){txt(q,'Hồ quang dài 8 ô · bay tối đa 9 ô · đẩy lùi 3 ô',X(7.5),Y(9.9),'#e4c8ff',11)}});

SC.ne5=safe({title:'THÁP THÔI MIÊN',note:'Chiếu tia thôi miên xanh lên mục tiêu trong 8 ô: biến mục tiêu thành đồng minh trong 3 giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'ne5',7.5,6.6,{lv:c.lv});c.es=[mkE(G,c,4.6,2.8),mkE(G,c,8.2,1.4),mkE(G,c,11.4,3)];c.fc=0},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.6+i*2)*.9;e.hp=e.max=1e9});T0(G,dt);solid(c.b);TICK.ne5(c.b,dt,G);
    c.fc-=dt;c.es.forEach((e,i)=>{if(e.c19hypT>0&&c.fc<=0){c.fc=.55;let t=null,bd=1e9;c.es.forEach(o=>{if(o!==e){const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<bd){bd=d;t=o}}});if(t){G.bm.push({x1:e.x,y1:e.y,x2:t.x,y2:t.y,t:.16,col:'#ff66dd',w:3});G.fx.push({x:t.x,y:t.y,r:.5,t:.2,max:.2,col:'#ff66dd'})}}})},
  over(q,G,c,X,Y,s){txt(q,'Mục tiêu bị thôi miên bắn vào phe địch',X(7.5),Y(9.9),'#9fc8ff',11)}});

SC.ne6=safe({title:'PHÁO SAO CHÉP KỸ NĂNG',note:'Thuyền trưởng trong 5 ô dùng kỹ năng: pháo sao chép và dùng lại ngay sau đó (hồi chiêu 60 giây, xem nhanh)',
  init(G,c){initC(G,c,.12);c.b=mkBld(G,'ne6',7.5,6.4,{lv:c.lv});c.a=[mkAl(G,c,4.6,4.6,0,100),mkAl(G,c,11,5,1,100),mkAl(G,c,13.3,1.8,2,100)];c.t=0;c.n=0},
  step(G,dt,c){c.a.forEach((a,i)=>sway(G,a,i));T0(G,dt);solid(c.b);TICK.ne6(c.b,dt,G);c.t+=dt;
    if(c.t>2.6){c.t=0;const a=c.a[c.n++%3];G.fx.push({x:a.x,y:a.y,r:(a.size||2)*1.3,t:.6,max:.6,col:'#ffd27a'});a.c19sk=G.t;window.c19Cast(G,a,{cap:['Kaito'],fake:true},1)}},
  over(q,G,c,X,Y,s){c.a.forEach((a,i)=>{drawAl(q,a,X,Y,s);if(a.c19sk!=null&&G.t-a.c19sk<1.2)txt(q,Math.hypot(a.x-c.b.x,a.y-c.b.y)<=5?'dùng kỹ năng → được sao chép':'dùng kỹ năng (ngoài 5 ô)',X(a.x),Y(a.y)-a.size*s*.8,Math.hypot(a.x-c.b.x,a.y-c.b.y)<=5?'#7df0ff':'#8fa6d8',10)})}});

SC.ne7=safe({title:'GIÁP GƯƠNG',note:'Vào trận tự dựng tấm khiên cong đứng chéo ở mũi gương, chắn 500 sát thương, hồi chiêu 30 giây; xoay 4 hướng chéo ở Trụ sở (xem nhanh)',
  init(G,c){initC(G,c,.2);c.b=mkBld(G,'ne7',7.5,6,{lv:c.lv});c.es=[0,1,2,3].map(i=>mkE(G,c,7.5,6));c.fc=0},
  step(G,dt,c){const b=c.b;b.c19dir=Math.floor(G.t/9)%4;const f=ne7face(b);c.es.forEach((e,i)=>{const a=-3*Math.PI/4+i*Math.PI/2;e.x=Math.max(.6,Math.min(14.4,b.x+Math.cos(a)*6.4));e.y=Math.max(.5,Math.min(9.4,b.y+Math.sin(a)*5.2));e.hp=e.max=1e9});
    T0(G,dt);solid(b);TICK.ne7(b,dt,G);c.fc-=dt;if(c.fc<=0){c.fc=.6;const e=c.es[b.c19dir];mkSh(G,e.x,e.y,b.x,b.y,.8,9)}
    G.pr.forEach(p=>{if(!p.dead&&p.team==='e'&&mirrorHit(G,p.x,p.y,p.dmg,p))p.dead=true})},
  over(q,G,c,X,Y,s){const b=c.b;txt(q,'Hướng: '+['Tây-Bắc','Đông-Bắc','Đông-Nam','Tây-Nam'][b.c19dir]+' · chỉnh ở Trụ sở',X(7.5),Y(9.9),'#bfe0ff',11)}});

SC.ne8=safe({title:'THÁP CỘNG HƯỞNG CUỘN',note:'Tích lũy sát thương do mục tiêu trong 6 ô gây ra; sau 12 giây bắn đạn xanh nổ 4 ô, gây 90% sát thương đã tích lũy (xem nhanh ×4)',
  init(G,c){initC(G,c,.25);c.b=mkBld(G,'ne8',7.5,6.3,{lv:c.lv});c.w=mkBld(G,'cannon',3.6,7.6,{max:4});c.es=[mkE(G,c,5.2,3.2),mkE(G,c,9.8,3.4),mkE(G,c,13.5,1.2)];c.fc=[0,.2,.4]},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.5+i*2.2)*.8;e.hp=e.max=1e9;c.fc[i]-=dt;if(c.fc[i]<=0){c.fc[i]=.5;G.bm.push({x1:e.x,y1:e.y,x2:c.w.x,y2:c.w.y,t:.1,col:'#ff8a8a',w:2});if(Math.hypot(e.x-c.b.x,e.y-c.b.y)<=6+e.size*.3)c.b.c19acc=(c.b.c19acc||0)+25*20}});
    c.w.hp=c.w.max;T0(G,dt);solid(c.b);TICK.ne8(c.b,dt,G)},
  over(q,G,c,X,Y,s){const e=c.es[2];txt(q,'ngoài 6 ô · không tích lũy',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10);txt(q,'Đạn xanh nổ 4 ô: 90% sát thương tích lũy, chia đều',X(7.5),Y(9.9),'#9fd0ff',11)}});

SC.ne9=safe({title:'LƯỚI LASER BỐN ĐIỂM',note:'Ma trận giáp tím bao quanh toàn bộ Trụ sở, chắn 4000 sát thương, hồi chiêu 50 giây (xem nhanh)',
  init(G,c){initC(G,c,.2);const h=mkBld(G,'hq4',9.2,5.4,{w:4,h:4,max:60});h.hq=true;h.hp=h.max;G.hq=h;c.h=h;c.b=mkBld(G,'ne9',3,7.6,{lv:c.lv});c.es=[mkE(G,c,5.4,.8),mkE(G,c,10,-.2),mkE(G,c,13.6,.9)];c.fc=[0,.15,.3]},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.5+i*2)*.6;e.hp=e.max=1e9;c.fc[i]-=dt;if(c.fc[i]<=0){c.fc[i]=.5;mkSh(G,e.x,e.y+.5,c.h.x+(Math.random()-.5)*2,c.h.y-1,.7,9)}});
    if(c.h.hp<c.h.max*.3)c.h.hp=c.h.max;T0(G,dt);solid(c.b)},
  over(q,G,c,X,Y,s){TICK.ne9(c.b,G.dtc||.02,G);const m=c.b.c19x;txt(q,m&&m.hp>0?'Ma trận chắn '+nf(m.hp*DFB)+' sát thương còn lại':'Ma trận vỡ · hồi chiêu '+Math.ceil(m&&m.cd!=null?m.cd:CFG.ne9.cd)+'s',X(7.5),Y(9.9),m&&m.hp>0?'#d9b0ff':'#ffc86a',11)}});

SC.ne10=safe({title:'SIÊU PHÁO QUANG PHỔ',note:'Tích lũy 10.000 sát thương nhận vào và gây ra: 4 đạn tím (đường kính 3 ô) rơi từ trên trời, mỗi đạn 1500 sát thương, hồi chiêu 40 giây (xem nhanh)',
  init(G,c){initC(G,c,.2);c.b=mkBld(G,'ne10',7.5,7.4,{lv:c.lv});c.es=[mkE(G,c,3.6,1.8),mkE(G,c,7.6,.9),mkE(G,c,11.4,2),mkE(G,c,5.6,3.8)]},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.55+i*1.9)*1.3;e.y=e.hy+Math.cos(G.t*.4+i)*.5;e.hp=e.max=1e9});if(!(c.b.c19cd>0))c.b.c19acc=(c.b.c19acc||0)+1700*dt;T0(G,dt);solid(c.b);TICK.ne10(c.b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'Đạn rơi lần lượt xuống mục tiêu bất kỳ (không phải công trình)',X(7.5),Y(9.9),'#e0c0ff',11)}});

SC.tj1=safe({title:'TRẠM GÂY NHIỄU RADAR',note:'Trong 7 ô: cấm mục tiêu dùng kỹ năng; drone không thể chiến đấu, chỉ lơ lửng trong phạm vi',
  init(G,c){initC(G,c);c.b=mkBld(G,'tj1',7.5,6.5,{lv:c.lv});c.es=[mkE(G,c,4.2,2.8),mkE(G,c,10.8,3.4),mkE(G,c,13.4,.9),mkE(G,c,7.6,1.8)];c.es[3].size=1.1;c.es[3].isDrone=true;c.fc=0},
  step(G,dt,c){c.es.forEach((e,i)=>{e.x=e.hx+Math.sin(G.t*.7+i*2)*(i===3?1.5:.9);e.y=e.hy+Math.cos(G.t*.5+i)*.4;dec(e,dt)});T0(G,dt);solid(c.b);TICK.tj1(c.b,dt,G)},
  over(q,G,c,X,Y,s){const e=c.es[2];txt(q,'ngoài 7 ô · dùng kỹ năng bình thường',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10);txt(q,'Cấm kỹ năng · drone chỉ lơ lửng, không bắn được',X(7.5),Y(9.9),'#bfe6ff',11)}});

SC.tj2=safe({title:'LĂNG KÍNH ẢO ẢNH',note:'Ma trận 3D nhốt tối đa 3 mục tiêu trong 9 ô trong 5 giây: choáng liên tục + 40 sát thương / 0,2 giây, hồi 40 giây (xem nhanh)',
  init(G,c){initC(G,c,.2);c.b=mkBld(G,'tj2',7.5,6.6,{lv:c.lv});c.es=[mkE(G,c,4,2.4),mkE(G,c,7.5,1.2),mkE(G,c,11,2.6),mkE(G,c,13.6,.8)];c.d=0},
  step(G,dt,c){c.es.forEach((e,i)=>{dec(e,dt);if(!(e.stun>0)){e.x=e.hx+Math.sin(G.t*.6+i*2)*.8}});T0(G,dt);solid(c.b);TICK.tj2(c.b,dt,G)},
  over(q,G,c,X,Y,s){txt(q,'Choáng liên tục · −40 / 0,2 giây · tối đa 3 mục tiêu',X(7.5),Y(9.9),'#c8b6ff',11)}});

SC.tj3=safe({title:'BỘ PHÁT XUNG EMP',note:'Xung trong 7 ô, 4 xung mỗi 4 giây: mỗi xung 200 sát thương chia đều cho mục tiêu trong vùng, 10% choáng 0,75 giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'tj3',7.5,6.6,{lv:c.lv});c.es=[mkE(G,c,4.4,3.2),mkE(G,c,10.8,3.6),mkE(G,c,7.6,1.4),mkE(G,c,12.6,1.2)];c.pn=null},
  step(G,dt,c){c.es.forEach((e,i)=>{dec(e,dt);e.x=e.hx+Math.sin(G.t*.6+i*2)*.7});T0(G,dt);solid(c.b);TICK.tj3(c.b,dt,G);
    if(c.b.c19pn!==c.pn){c.pn=c.b.c19pn;const inR=c.es.filter(e=>Math.hypot(e.x-c.b.x,e.y-c.b.y)<=7+e.size*.3);inR.forEach(e=>pop(G,e.x,e.y-.8,'-'+nf(c.b.c19pd||0)+(e.stun>0?' · choáng':''),'#9fe8ff'))}},
  over(q,G,c,X,Y,s){txt(q,'Mỗi xung: 200 ÷ số mục tiêu trong vùng',X(7.5),Y(9.9),'#8fe8ff',11)}});

SC.tj4=safe({title:'MẠNG BẪY ĐIỆN TỪ',note:'Mỗi khiên, tường, công trình trên toàn bản đồ nhận 5 giáp mỗi 2 giây (xem nhanh ×4)',
  init(G,c){initC(G,c,.25);c.b=mkBld(G,'tj4',7.5,6.6,{lv:c.lv});c.w=[mkBld(G,'wall',3.4,3.4,{w:2,h:1,max:4}),mkBld(G,'cannon',11.6,3.4,{max:4}),mkBld(G,'laser',3.6,8.2,{max:4}),mkBld(G,'wall',12.4,8.4,{w:2,h:1,max:4})];c.w.forEach(b=>{b.hp=b.max})},
  step(G,dt,c){c.w.forEach(b=>{b.hp=b.max});T0(G,dt);solid(c.b);TICK.tj4(c.b,dt,G)},
  over(q,G,c,X,Y,s){c.w.concat([c.b]).forEach(b=>{if(b.shd&&b.shd.v>0)txt(q,'Giáp '+Math.round(b.shd.v*DFB),X(b.x),Y(b.y)-b.h*s*.7,'#8fe8ff',10)});txt(q,'+5 giáp mỗi 2 giây cho mọi công trình',X(7.5),Y(9.9),'#8fe8ff',11)}});

/* xuất để kiểm thử */
window.C19={C19T,CFG,TICK,tick:window.c19Tick,pre,projStep,mkP,mirGeo,mirrorHit,hqAbsorb,evt,k6tips,k7tips,tether,zone,kn9wave,skyShell,qStep,dirOf,SC:Object.keys(SC).filter(k=>C19T.includes(k))};
})();
})();
