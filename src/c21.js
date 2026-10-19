/* ===== c21: Công sự · Chống xâm nhập (6 công trình điều chỉnh: fc1 – fc6) ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const C21T=['fc1','fc2','fc3','fc4','fc5','fc6'];
const CFG={
  /* fc1: công trình lân cận trong 4 ô chịu ít hơn 10% sát thương */
  fc1:{R:4,red:.1},
  /* fc2: hầm vận chuyển — tàu đứng sát hầm (gần như không di chuyển) .5 giây thì chui vào và ra ở hầm kế tiếp (hoặc điểm đối xứng qua căn cứ nếu chỉ có 1 hầm) */
  fc2:{dwell:.5,cd:4,fx:.45,touch:.3,slow:.6},
  /* fc3: tàu / drone đồng minh bước vào 5 ô nhận khiên chặn 400 sát thương (mỗi đơn vị tối đa 1 lần / 20 giây) */
  fc3:{R:5,sh:400,dur:10,cd:20},
  /* fc4: hồi 20% giáp tối đa cho Lưới Laser Bốn Điểm mỗi 30 giây */
  fc4:{pct:.2,cd:30},
  /* fc5: boss xâm nhập căn cứ → dựng giáp trước mặt boss chặn 2000 sát thương, đẩy boss 1 ô, hồi 50 giây */
  fc5:{hp:2000/50,push:1,cd:50,life:12,zone:5,gap:1.3},
  /* fc6: Trụ sở xuống dưới 50% máu → hồi 30% máu tối đa trong 4 giây + giáp 200 trong 8 giây, hồi 60 giây */
  fc6:{pct:.3,heal:4,sh:200,shDur:8,low:.5,cd:60}};
window.c21Has=t=>C21T.includes(t);
{const o=window.c16Has;window.c16Has=t=>(o?o(t):false)||C21T.includes(t)}
/* gắn cờ, bỏ hiệu ứng cũ (dome / aura / bị động máu) — do c21 điều khiển */
C21T.forEach(t=>{const f=NBF[t];if(f){f.c21=t;f.k='aura';['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun','v','n'].forEach(k=>{delete f[k]});delete f.e;f.r=({fc1:4,fc2:0,fc3:5,fc4:0,fc5:0,fc6:0})[t]}});
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
upd('fc1',(l,k)=>[['Phạm vi','4 ô quanh cổng'],['Hiệu ứng','Công trình lân cận chịu ít hơn 10% sát thương'],['Cộng dồn','Không (nhiều cổng vẫn chỉ giảm 10%)']],
  'Công trình lân cận trong 4 ô (không tính chính cổng) chịu ít hơn 10% sát thương.');
upd('fc2',(l,k)=>[['Cách dùng','Tàu đồng minh (kể cả tàu chính) đứng sát hầm 0,5 giây sẽ chui vào hầm'],['Điểm ra','Hầm kế tiếp trong căn cứ · nếu chỉ có 1 hầm thì ra ở phía đối diện căn cứ'],['Chống kẹt','Mỗi tàu nghỉ 4 giây sau khi ra khỏi hầm']],
  'Tàu đồng minh bước vào hầm trú ẩn sẽ di chuyển ngầm sang một hầm khác trong căn cứ (hoặc sang phía đối diện căn cứ nếu chỉ có 1 hầm). Đặt nhiều hầm để tạo mạng di chuyển.');
upd('fc3',(l,k)=>[['Phạm vi','5 ô quanh pháo đài'],['Khiên',nf(400*k)+' sát thương cho mỗi đồng minh đi vào (kể cả drone)'],['Thời gian giáp','10 giây'],['Nghỉ mỗi đơn vị','20 giây']],
  'Mọi đồng minh đi qua trong 5 ô (kể cả drone) nhận một lớp khiên chặn 400 sát thương trong 10 giây; mỗi đơn vị nhận lại sau tối thiểu 20 giây.');
upd('fc4',(l,k)=>[['Hồi giáp cho Lưới Laser Bốn Điểm','20% giáp tối đa'],['Hồi chiêu','30 giây'],['Điều kiện','Có Lưới Laser Bốn Điểm đang thiếu giáp']],
  'Hồi 20% giáp tối đa cho Lưới Laser Bốn Điểm (kể cả khi đã vỡ). Hồi chiêu 30 giây.');
upd('fc5',(l,k)=>[['Kích hoạt','Có boss xâm nhập vào căn cứ'],['Giáp trước mặt boss','Chặn '+nf(2000*k)+' sát thương · tồn tại tối đa 12 giây'],['Đẩy lùi boss','1 ô'],['Hồi chiêu','50 giây']],
  'Khi có boss xâm nhập vào căn cứ, dựng một lớp giáp trước mặt boss chắn 2000 sát thương và đẩy boss lùi 1 ô. Hồi chiêu 50 giây.');
upd('fc6',(l,k)=>[['Kích hoạt','Trụ sở xuống dưới 50% máu tối đa'],['Hồi máu cho Trụ sở','30% máu tối đa trong 4 giây'],['Giáp cho Trụ sở',nf(200*k)+' trong 8 giây'],['Hồi chiêu','60 giây']],
  'Khi Trụ sở xuống dưới 50% máu: hồi 30% máu tối đa trong 4 giây và tạo lớp giáp 200 trong 8 giây. Hồi chiêu 60 giây.');

/* ---------- tiện ích ---------- */
const ships=G=>{const L=[];if(G.pl&&!G.pl.dead)L.push(G.pl);(G.al||[]).forEach(a=>{if(!a.dead&&!a.ghost&&!a.c18boss)L.push(a)});return L};
const enemies=G=>G.en.filter(e=>!e.dead&&e.spawn<=G.t);
const shVal=u=>{let v=0;const c=u.cs;if(c&&c.abs&&c.abs.t>0&&c.abs.v>0)v=c.abs.v;if(u.shd&&u.shd.t>0&&u.shd.v>0)v=Math.max(v,u.shd.v);return v};
const shSet=(G,u,v,dur)=>{if(u===G.pl&&!u.cs)u.cs={};if(u.cs){u.cs.abs={v,t:dur,max:v};u.cs.circ=true;u.cs.hexc=false}else u.shd={v,t:9999,max:v,c17:G.t+dur}};
const ping=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.45,max:t||.45,col});
const beam=(G,x1,y1,x2,y2,col,w,t)=>G.bm.push({x1,y1,x2,y2,t:t||.3,col,w:w||3});
const pop=(G,x,y,txt,col)=>{const L=G.c21pop=G.c21pop||[];if(L.length>40)L.shift();L.push({x,y,t:0,max:1.8,txt,col:col||'#ffe08a'})};
const tk=(G,dt)=>dt/((G.c18rc||1)*((PB(G).cdm)||1));
const effPush=(G,o)=>{(G.c21e=G.c21e||[]).push(o);return o};
const alive=G=>G.bl.filter(o=>o.hp>0&&o.t!=='mine'&&!o.aux&&!o.u);
/* khung bao quanh toàn bộ căn cứ (các công trình còn sống, không tính mìn) */
function baseBox(G){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,n=0;
  alive(G).forEach(o=>{n++;const w=(o.w||1)/2,h=(o.h||1)/2;x0=Math.min(x0,o.x-w);x1=Math.max(x1,o.x+w);y0=Math.min(y0,o.y-h);y1=Math.max(y1,o.y+h)});
  return n?{x0,y0,x1,y1,cx:(x0+x1)/2,cy:(y0+y1)/2}:null}
const mapW=G=>G.wd?G.wd.Wd:99,mapH=G=>G.wd?G.wd.Hd:99;
const moveE=(G,e,x,y)=>{e.x=Math.max(.5,Math.min(mapW(G)-.5,x));e.y=Math.max(.5,Math.min(mapH(G)-.5,y))};

/* ---------- Cổng Thép Gia Cố (fc1): công trình lân cận 4 ô chịu ít hơn 10% sát thương (hook trong dfDmgB, xem c21c) ---------- */
function gateRed(G,b){if(!G||!G.bl||!b)return 0;let r=0;const R=CFG.fc1.R*(PB(G).rm||1);
  G.bl.forEach(g=>{if(g===b||g.hp<=0||!g.nb||g.nb.c21!=='fc1')return;if(dist(g,b)<=R)r=CFG.fc1.red});return r}
function fc1(b,dt,G){let n=0;const R=CFG.fc1.R*(PB(G).rm||1);G.bl.forEach(o=>{if(o!==b&&o.hp>0&&o.t!=='mine'&&dist(o,b)<=R)n++});b.c21n=n}
/* ---------- Hầm Trú Ẩn Nhỏ (fc2): tàu đứng trên hầm → chui vào, ra ở hầm kế tiếp ---------- */
const tunnels=G=>G.bl.filter(o=>o.hp>0&&o.nb&&o.nb.c21==='fc2');
function exitFor(G,b,T){
  if(T.length>=2){const i=T.indexOf(b),o=T[(i+1)%T.length];return {x:o.x,y:o.y,b:o}}
  const bb=baseBox(G);let x=b.x,y=b.y;if(bb){x=2*bb.cx-b.x;y=2*bb.cy-b.y}
  if(Math.hypot(x-b.x,y-b.y)<4){x=b.x;y=b.y-6}
  x=Math.max(1,Math.min(mapW(G)-1,x));y=Math.max(1,Math.min(mapH(G)-1,y));
  return {x,y,b:null}}
/* va chạm của game đẩy mọi tàu ra khỏi công trình (bán kính = size×0,3) → "đứng trên hầm" = đứng sát hầm */
const shipR=u=>(u.size||2)*.3;
function touch(u,b){const hx=b.w/2,hy=b.h/2,cx=Math.max(b.x-hx,Math.min(b.x+hx,u.x)),cy=Math.max(b.y-hy,Math.min(b.y+hy,u.y));return Math.hypot(u.x-cx,u.y-cy)<=shipR(u)+CFG.fc2.touch}
/* điểm ra: ngay dưới hầm đích (hoặc trên / bên cạnh nếu sát mép bản đồ) */
function outSpot(G,u,ex){if(!ex.b)return {x:ex.x,y:ex.y};const b=ex.b,r=shipR(u)+.12,W=mapW(G),H=mapH(G);
  const C=[[b.x,b.y+b.h/2+r],[b.x,b.y-b.h/2-r],[b.x+b.w/2+r,b.y],[b.x-b.w/2-r,b.y]];
  for(const c of C)if(c[0]>=.5&&c[0]<=W-.5&&c[1]>=.5&&c[1]<=H-.5)return {x:c[0],y:c[1]};
  return {x:b.x,y:b.y}}
function enterTunnel(G,u,b){const C=CFG.fc2,ex=b.c21ex||exitFor(G,b,tunnels(G)),ox=u.x,oy=u.y,sp=outSpot(G,u,ex);
  u.x=sp.x;u.y=sp.y;u.vx=0;u.vy=0;if(u===G.pl||u.tx!=null){u.tx=u.x;u.ty=u.y}
  u.c21pp={x:u.x,y:u.y};u.c21v=0;
  u.c21cd=G.t+C.cd;u.c21lock=ex.b||null;u.c21d=null;u.c21tp=G.t;b.c21n=(b.c21n||0)+1;b.c21fl=G.t;
  ping(G,ox,oy,(u.size||2)*1.1,'#9fd8ff',C.fx);ping(G,sp.x,sp.y,(u.size||2)*1.3,'#bfeaff',C.fx+.15);beam(G,ox,oy,sp.x,sp.y,'#8fd0ff',3,C.fx);
  pop(G,sp.x,sp.y-(u.size||2)*.8,'Qua hầm','#bfeaff')}
function fc2(b,dt,G){const C=CFG.fc2,T=tunnels(G);b.c21ex=exitFor(G,b,T);b.c21tn=T.length;
  ships(G).forEach(u=>{
    const near=touch(u,b);
    if(u.c21lock===b){if(!near)u.c21lock=null;return}
    if(!near||(u.c21v||0)>C.slow){if(u.c21d&&u.c21d.b===b)u.c21d=null;return}
    if(G.t<(u.c21cd||0))return;
    if(!u.c21d||u.c21d.b!==b)u.c21d={b,t:0};
    u.c21d.t+=dt;if(u.c21d.t>=C.dwell)enterTunnel(G,u,b)})}
/* ---------- Pháo Đài Bê Tông (fc3): đồng minh (kể cả drone) bước vào 5 ô nhận khiên 400 ---------- */
/* danh sách drone đồng minh (giống drList trong hệ kỹ năng thuyền trưởng nhưng dùng được từ ngoài) */
function droneList(G){const C=G.csk,L=[];if(C){(C.drones||[]).forEach(d=>L.push(d));(C.rd||[]).forEach(d=>L.push(d));(C.jm||[]).forEach(d=>L.push(d))}
  (G.bl||[]).forEach(b=>{if(b.drs&&b.hp>0)b.drs.forEach(d=>{if(!d.dead)L.push(d)})});return L.filter(d=>d&&d.hp>0&&!d.dead)}
function fc3(b,dt,G){const C=CFG.fc3,R=C.R*(PB(G).rm||1),v=C.sh*LV(b),prev=b.c21in||new Set(),now=new Set();
  const U=ships(G).map(u=>({u,dr:false}));droneList(G).forEach(d=>U.push({u:d,dr:true}));
  U.forEach(({u,dr})=>{if(dist(u,b)>R+(dr?.3:(u.size||2)*.3))return;now.add(u);
    if(prev.has(u))return;if(G.t<(u.c21g||0))return;
    if(dr){if(u.shd&&u.shd.t>0&&u.shd.v>=v)return;u.shd={v,t:C.dur,max:v,c21:1}}
    else{if(shVal(u)>=v)return;shSet(G,u,v,C.dur)}
    u.c21g=G.t+C.cd;b.c21n=(b.c21n||0)+1;b.c21fl=G.t;
    ping(G,u.x,u.y,dr?.9:(u.size||2)*.9,'#cfd6e8',.5);pop(G,u.x,u.y-(dr?.8:(u.size||2)*.7),'Khiên bê tông +'+nf(v),'#dfe6f5')});
  b.c21in=now}
/* drone: khiên hấp thụ sát thương — hoàn lại phần máu mất trong khung hình (kể cả khi bị hạ) nếu khiên còn đủ */
function droneShieldStep(G,dt){
  (G.c21ds||[]).forEach(d=>{const s=d.shd;if(!s||!(s.v>0)||d.c21hp==null)return;
    let D=0;if(d.dead)D=d.c21hp;else if(d.hp<d.c21hp)D=d.c21hp-d.hp;
    if(D>0){const a=Math.min(s.v,D);s.v-=a;
      if(d.dead){if(a>=D-1e-9){d.dead=false;d.rs=0;d.hp=d.c21hp}}else d.hp+=a;
      d.hf=.15;ping(G,d.x,d.y,.55,'#cfd6e8',.2);G.c21abs=(G.c21abs||0)+a}
    if(s.v<=1e-9)d.shd=null});
  droneList(G).forEach(d=>{if(d.shd&&d.shd.c21){d.shd.t-=dt;if(d.shd.t<=0)d.shd=null}});
  const S=[];droneList(G).forEach(d=>{if(d.shd&&d.shd.c21&&d.shd.v>0){d.c21hp=d.hp;S.push(d)}});G.c21ds=S}
/* ---------- Trạm Gác Chống Xâm Nhập (fc4): hồi 20% giáp tối đa cho Lưới Laser Bốn Điểm, hồi chiêu 30 giây ---------- */
const nets=G=>G.bl.filter(o=>o.hp>0&&o.nb&&o.nb.c19==='ne9'&&o.c19x);
function fc4(b,dt,G){const C=CFG.fc4;b.c21cd=Math.max(0,(b.c21cd||0)-tk(G,dt));const N=nets(G);b.c21nn=N.length;if(b.c21cd>0)return;
  const L=N.filter(o=>o.c19x.hp<o.c19x.max-1e-9);if(!L.length)return;
  L.forEach(o=>{const m=o.c19x,was=m.hp<=0;m.hp=Math.min(m.max,m.hp+m.max*C.pct);if(was){m.cd=null;m.up=G.t}m.hitT=null;
    beam(G,b.x,b.y,o.x,o.y,'#c8a8ff',3,.5);ping(G,o.x,o.y,Math.max(o.w,o.h)*.8,'#d9b8ff',.5);
    if(m.bb)[[m.bb.x0-1,m.bb.y0-1],[m.bb.x1+1,m.bb.y0-1],[m.bb.x1+1,m.bb.y1+1],[m.bb.x0-1,m.bb.y1+1]].forEach(p=>ping(G,p[0],p[1],1,'#d9b8ff',.5))});
  b.c21cd=C.cd;b.c21fl=G.t;b.c21hn=(b.c21hn||0)+1;pop(G,b.x,b.y-b.h*.5-1,'Hồi 20% giáp lưới laser','#d9b8ff')}
/* ---------- Cổng Chặn Hạng Nặng (fc5): boss xâm nhập → giáp trước mặt boss chặn 2000, đẩy boss 1 ô, hồi 50 giây ---------- */
function barGeo(G,e,o){let nb=null,bd=1e9;alive(G).forEach(x=>{const d=dist(x,e);if(d<bd){bd=d;nb=x}});
  let ux=0,uy=1,dEdge=1e9;if(nb){const dx=nb.x-e.x,dy=nb.y-e.y,l=Math.hypot(dx,dy)||1;ux=dx/l;uy=dy/l;
    /* khoảng cách từ boss tới mép công trình gần nhất theo hướng đó */
    const hx=nb.w/2,hy=nb.h/2,tx=ux?(Math.abs(dx)-hx)/Math.abs(ux):1e9,ty=uy?(Math.abs(dy)-hy)/Math.abs(uy):1e9;dEdge=Math.max(.5,Math.min(tx,ty))}
  const s=e.size||2,off=Math.max(.9,Math.min(s*.5+CFG.fc5.gap,dEdge-.6)),half=Math.max(2.2,s*.6);
  o.ux=ux;o.uy=uy;o.cx=e.x+ux*off;o.cy=e.y+uy*off;o.half=half;
  o.x1=o.cx-uy*half;o.y1=o.cy+ux*half;o.x2=o.cx+uy*half;o.y2=o.cy-ux*half}
function dSeg(x,y,o){const vx=o.x2-o.x1,vy=o.y2-o.y1,l2=vx*vx+vy*vy||1;let t=((x-o.x1)*vx+(y-o.y1)*vy)/l2;t=Math.max(0,Math.min(1,t));return Math.hypot(x-(o.x1+vx*t),y-(o.y1+vy*t))}
function barrier(G,b,e){const C=CFG.fc5,mx=C.hp*LV(b),o={k:'bar',b,e,hp:mx,hm:mx,t:0,max:C.life};barGeo(G,e,o);
  o.u=function(G,dt,o){if(e.dead||o.hp<=0)return true;barGeo(G,e,o);return false};
  o.end=function(G,o){e.c21bar=0;if(o.hp<=0&&!e.dead)pop(G,o.cx,o.cy-1,'Giáp chặn boss vỡ','#ffb0a0')};
  e.c21bar=1;const T=.25;e.c21kb={vx:-o.ux*C.push/T,vy:-o.uy*C.push/T,t:T};
  effPush(G,o);ping(G,o.cx,o.cy,o.half*.9,'#ffd27a',.6);ping(G,e.x,e.y,(e.size||2)*.9,'#ffb066',.5);
  pop(G,o.cx,o.cy-1,'Giáp chặn boss '+nf(mx*DFB),'#ffd7a0');return o}
function barHit(G,x,y,d){const L=G&&G.c21e;if(!L)return false;
  for(const o of L){if(o.k!=='bar'||o.dead||o.hp<=0)continue;
    if(dSeg(x,y,o)<=.5){o.hp-=d;o.hitT=G.t;o.hx=x;o.hy=y;ping(G,x,y,.5,'#ffe2b0',.25);if(o.hp<=0)o.hp=0;return true}}
  return false}
function fc5(b,dt,G){const C=CFG.fc5;b.c21cd=Math.max(0,(b.c21cd||0)-tk(G,dt));if(b.c21cd>0)return;
  const bb=baseBox(G);if(!bb)return;const z=C.zone;
  const L=enemies(G).filter(e=>e.boss&&!e.c21bar&&e.x>=bb.x0-z&&e.x<=bb.x1+z&&e.y>=bb.y0-z&&e.y<=bb.y1+z).sort((p,q)=>Math.hypot(p.x-bb.cx,p.y-bb.cy)-Math.hypot(q.x-bb.cx,q.y-bb.cy));
  const e=L[0];if(!e)return;b.c21cd=C.cd;b.c21fl=G.t;b.c21bn=(b.c21bn||0)+1;barrier(G,b,e)}
/* ---------- Boong-ke Bảo Vệ Lõi (fc6): Trụ sở dưới 50% máu → hồi 30% máu tối đa trong 4 giây + giáp 200 trong 8 giây ---------- */
function fc6(b,dt,G){const C=CFG.fc6,h=G.hq;b.c21cd=Math.max(0,(b.c21cd||0)-tk(G,dt));
  if(b.c21hl&&b.c21hl.t>0){const k=Math.min(dt,b.c21hl.t);if(h&&h.hp>0)h.hp=Math.min(h.max,h.hp+b.c21hl.rate*k);b.c21hl.t-=dt;if(b.c21hl.t<=0)b.c21hl=null}
  if(b.c21cd>0||!h||h.hp<=0||h.hp>h.max*C.low)return;
  b.c21cd=C.cd;b.c21fl=G.t;b.c21tn=(b.c21tn||0)+1;b.c21hl={rate:h.max*C.pct/C.heal,t:C.heal};
  const bv=C.sh*LV(b)/DFB,ex=(h.shd&&h.shd.t>0&&h.shd.v>0)?h.shd:null;
  h.shd={v:Math.max(bv,ex?ex.v:0),t:Math.max(C.shDur,ex?ex.t:0),max:Math.max(bv,ex?ex.max:0)};h.shdC=1;h.shdAt=G.t;
  beam(G,b.x,b.y,h.x,h.y,'#7dffa0',4,.6);ping(G,h.x,h.y,Math.max(h.w,h.h)*.9,'#7dffa0',.7);ping(G,h.x,h.y,Math.max(h.w,h.h)*.6,'#ffffff',.5);
  pop(G,h.x,h.y-h.h*.5-1,'Boong-ke: hồi 30% máu + giáp '+nf(C.sh*LV(b)),'#9dffb8')}
/* ---------- bảng điều khiển theo loại ---------- */
const TICK={fc1,fc2,fc3,fc4,fc5,fc6};
window.c21Tick=function(b,dt,G){const c=b.nb&&b.nb.c21;if(!c)return false;const f=TICK[c];if(f)f(b,dt,G);return true};

/* ---------- hiệu ứng toàn trận (dùng chung cho trận thật và mô phỏng) ---------- */
function pre(G,dt){
  const E=G.c21e;if(E&&E.length){for(const o of E){o.t+=dt;let d=false;try{d=o.u?!!o.u(G,dt,o):false}catch(er){console.error(er);d=true}
      if(d||o.t>=o.max){o.dead=true;if(o.end)try{o.end(G,o)}catch(er){console.error(er)}}}
    G.c21e=E.filter(o=>!o.dead)}
  if(G.c21pop){G.c21pop.forEach(o=>o.t+=dt);G.c21pop=G.c21pop.filter(o=>o.t<o.max)}
  droneShieldStep(G,dt);
  ships(G).forEach(u=>{const p=u.c21pp;u.c21v=p?Math.hypot(u.x-p.x,u.y-p.y)/Math.max(dt,.001):0;u.c21pp={x:u.x,y:u.y}});
  (G.en||[]).forEach(e=>{if(e.dead)return;
    if(e.c21kb){const k=e.c21kb,m=Math.min(dt,k.t);moveE(G,e,e.x+k.vx*m,e.y+k.vy*m);k.t-=dt;if(k.t<=0)e.c21kb=null}})}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.bl&&!G.done&&G.en)pre(G,dt)}catch(e){console.error(e)}return r}}
/* fc1: công trình lân cận 4 ô chịu ít hơn 10% sát thương */
{const _B=dfDmgB;dfDmgB=function(b,d){try{const G=DG;if(G&&G.bl&&b&&b.hp>0&&b.t!=='mine'&&d>0){const r=gateRed(G,b);if(r>0){d*=1-r;b.c21rt=G.t}}}catch(e){console.error(e)}return _B.call(this,b,d)}}
/* fc5: giáp chặn boss chắn đạn / tia của địch */
{const _H=window.c14Hit;window.c14Hit=function(p){const G=DG;try{if(G&&G.bl&&p&&p.team==='e'&&!p.dead&&barHit(G,p.x,p.y,p.dmg||0)){p.dead=true;return true}}catch(e){console.error(e)}return _H?_H.apply(this,arguments):false}}
{const _H=window.c14BeamHit;window.c14BeamHit=function(x,y,d){const G=DG;try{if(G&&G.bl&&barHit(G,x,y,d||0))return true}catch(e){console.error(e)}return _H?_H.apply(this,arguments):false}}
/* ---------- vẽ ---------- */
const lab=(q,x,y,t,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';q.strokeText(t,x,y);q.fillStyle=col||'#fff';q.fillText(t,x,y);q.restore()};
const dashRing=(q,x,y,r,col,w)=>{q.save();q.setLineDash([4,6]);q.strokeStyle=col;q.lineWidth=w||1.4;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
const cdArc=(q,px,py,r,f,col)=>{q.save();q.strokeStyle=col;q.lineWidth=3;q.beginPath();q.arc(px,py,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,Math.min(1,f)));q.stroke();q.restore()};
function info(b,G){const c=b.nb.c21,t=Math.ceil;
  switch(c){
  case'fc1':return ['Giảm 10% sát thương · '+(b.c21n||0)+' công trình','#cfd8ea'];
  case'fc2':return ['Hầm '+(b.c21tn||1)+' điểm · '+(b.c21n||0)+' lượt','#9fd8ff'];
  case'fc3':return ['Khiên bê tông · '+(b.c21n||0)+' lượt','#dfe6f5'];
  case'fc4':return !(b.c21nn>0)?['Chưa có Lưới Laser','#b9a0e8']:b.c21cd>0?['Hồi giáp lưới: '+t(b.c21cd)+'s','#d9b8ff']:['Sẵn sàng hồi giáp lưới','#d9b8ff'];
  case'fc5':return b.c21cd>0?['Cổng chặn: hồi '+t(b.c21cd)+'s','#ffd7a0']:['Chờ boss xâm nhập','#ffd7a0'];
  case'fc6':return b.c21cd>0?['Boong-ke: hồi '+t(b.c21cd)+'s','#9dffb8']:['Boong-ke sẵn sàng (Trụ sở <50%)','#9dffb8'];
  default:return null}}
function drawBar(q,o,G,X,Y,s,T){const x1=X(o.x1),y1=Y(o.y1),x2=X(o.x2),y2=Y(o.y2),cx=X(o.cx+o.ux*.9),cy=Y(o.cy+o.uy*.9),f=Math.max(0,o.hp/o.hm),hit=o.hitT!=null?Math.max(0,1-(G.t-o.hitT)/.3):0,up=Math.min(1,o.t/.4),fade=Math.min(1,(o.max-o.t)/.8);
  q.save();q.globalAlpha=Math.max(.15,Math.min(up,fade));q.lineCap='round';
  q.shadowColor='#ffb347';q.shadowBlur=12+10*hit;q.strokeStyle='rgba(255,215,140,'+(.45+.4*f+.3*hit)+')';q.lineWidth=Math.max(3,s*.34);
  q.beginPath();q.moveTo(x1,y1);q.quadraticCurveTo(cx,cy,x2,y2);q.stroke();
  q.shadowBlur=0;q.strokeStyle='rgba(255,245,220,'+(.5+.4*f)+')';q.lineWidth=1.6;q.beginPath();q.moveTo(x1,y1);q.quadraticCurveTo(cx,cy,x2,y2);q.stroke();
  q.globalCompositeOperation='lighter';q.fillStyle='rgba(255,190,90,.9)';for(let i=0;i<=6;i++){const u=i/6,mx=(1-u)*(1-u)*x1+2*(1-u)*u*cx+u*u*x2,my=(1-u)*(1-u)*y1+2*(1-u)*u*cy+u*u*y2;q.beginPath();q.arc(mx,my,s*(.07+.03*Math.sin(T*6+i)),0,7);q.fill()}
  q.restore();lab(q,(x1+x2)/2,(y1+y2)/2-s*.9,'Giáp chặn boss '+nf(o.hp*DFB)+'/'+nf(o.hm*DFB),'#ffe2b0',10)}
window.c21Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  G.bl.forEach(b=>{if(b.hp<=0)return;const c=b.nb&&b.nb.c21;if(!c)return;const px=X(b.x),py=Y(b.y),top=py-b.h*s*.62;
    if(c==='fc1'){dashRing(q,px,py,CFG.fc1.R*s*(PB(G).rm||1),'rgba(190,205,230,.2)')}
    else if(c==='fc2'){const ex=b.c21ex;q.save();q.setLineDash([5,5]);q.strokeStyle='rgba(120,200,255,.45)';q.lineWidth=1.4;q.strokeRect(px-b.w*s/2+2,py-b.h*s/2+2,b.w*s-4,b.h*s-4);q.setLineDash([]);
      q.globalCompositeOperation='lighter';q.strokeStyle='rgba(150,220,255,.65)';q.lineWidth=2;for(let i=0;i<2;i++){q.beginPath();const a0=T*2.4+i*Math.PI;q.arc(px,py,b.w*s*(.18+.1*i),a0,a0+Math.PI*1.2);q.stroke()}
      if(ex){const x2=X(ex.x),y2=Y(ex.y);q.globalCompositeOperation='source-over';q.setLineDash([3,7]);q.strokeStyle='rgba(130,210,255,.35)';q.lineWidth=1.3;q.beginPath();q.moveTo(px,py);q.lineTo(x2,y2);q.stroke();q.setLineDash([]);
        if(!ex.b){q.strokeStyle='rgba(130,210,255,.6)';q.lineWidth=2;q.beginPath();q.arc(x2,y2,s*.9,0,7);q.stroke();q.beginPath();q.arc(x2,y2,s*.5,0,7);q.stroke();lab(q,x2,y2-s*1.1,'Điểm ra','#bfeaff',9)}}
      q.restore()}
    else if(c==='fc3'){dashRing(q,px,py,CFG.fc3.R*s*(PB(G).rm||1),'rgba(210,220,240,.2)')}
    else if(c==='fc4'){cdArc(q,px,py,b.w*s*.62,b.c21cd>0?1-b.c21cd/CFG.fc4.cd:1,'rgba(200,160,255,.8)')}
    else if(c==='fc5'){cdArc(q,px,py,b.w*s*.62,b.c21cd>0?1-b.c21cd/CFG.fc5.cd:1,'rgba(255,200,120,.85)')}
    else if(c==='fc6'){cdArc(q,px,py,b.w*s*.62,b.c21cd>0?1-b.c21cd/CFG.fc6.cd:1,'rgba(120,255,160,.85)');
      if(b.c21hl&&G.hq){const h=G.hq,hx=X(h.x),hy=Y(h.y),f=b.c21hl.t/CFG.fc6.heal;q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(125,255,165,'+(.35+.4*f)+')';q.lineWidth=3;q.beginPath();q.arc(hx,hy,Math.max(h.w,h.h)*s*(.55+.12*Math.sin(T*8)),0,7);q.stroke();q.restore()}}
    const L=info(b,G);if(L)lab(q,px,top,L[0],L[1],10)});
  /* khiên của drone (fc3) */
  droneList(G).forEach(d=>{if(d.shd&&d.shd.v>0&&d.shd.t>0){const px=X(d.x),py=Y(d.y);q.save();q.strokeStyle='rgba(225,232,248,'+(.6+.25*Math.sin(T*8))+')';q.lineWidth=2;q.shadowColor='#fff';q.shadowBlur=8;q.beginPath();q.arc(px,py,s*.55,0,7);q.stroke();q.restore()}});
  (G.c21e||[]).forEach(o=>{try{if(o.k==='bar')drawBar(q,o,G,X,Y,s,T)}catch(e){}});
  (G.c21pop||[]).forEach(o=>{const u=o.t/o.max;q.save();q.globalAlpha=Math.min(1,(1-u)*2);lab(q,X(o.x),Y(o.y)-u*s*1.3,o.txt,o.col,11);q.restore()})};
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{window.c21Draw(q,G,X,Y,s,T)}catch(e){console.error(e)}}}

/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở ---------- */
(function(){
const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;
const {mkBld,mkEn,shell}=H;
const txt=(q,s,x,y,col,sz,al)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign=al||'center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
const mkAl=(G,c,x,y,i,hp,o)=>{const a=Object.assign({team:'p',x,y,hx:x,hy:y,hp:hp||100,max:hp||100,size:1.5,sh:c.pool[(i||0)%c.pool.length],dead:false,hit:0,ang:-Math.PI/2,capn:'Kaito',ws:[],name:'Tàu '+((i||0)+1)},o||{});(G.al=G.al||[]).push(a);return a};
const drawAl=(q,a,X,Y,s,alpha)=>{if(a.dead)return;const im=dimg(a.sh.img);if(!im)return;const h=a.size*s,w=h*im.naturalWidth/im.naturalHeight;
  q.save();q.translate(X(a.x),Y(a.y));q.globalAlpha=alpha==null?1:alpha;q.drawImage(im,-w/2,-h/2,w,h);q.restore();
  if(a.max<1e8){const bw=a.size*s*.9,f=Math.max(0,a.hp/a.max);q.fillStyle='#000a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw,4);q.fillStyle='#6dff9a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw*f,4)}};
const shRing=(q,a,X,Y,s,T)=>{const v=shVal(a);if(!(v>0)||a.dead)return;q.save();q.strokeStyle='rgba(255,235,235,'+(.6+.25*Math.sin(T*8))+')';q.lineWidth=2.5;q.shadowColor='#fff';q.shadowBlur=10;q.beginPath();q.arc(X(a.x),Y(a.y),a.size*s*.66,0,7);q.stroke();q.restore()};
const expire=G=>{(G.al||[]).forEach(a=>{if(a.shd&&a.shd.c17&&G.t>a.shd.c17)a.shd=null;if(a.cs&&a.cs.abs&&a.cs.abs.t>0)a.cs.abs.t-=G.dtc||.02});G.bl.forEach(b=>{if(b.shd&&b.shd.t>0&&b.shd.t<9000){b.shd.t-=G.dtc||.02;if(b.shd.t<=0)b.shd=null}})};
const safe=o=>{['init','step','under','over'].forEach(k=>{const f=o[k];if(f)o[k]=function(){try{return f.apply(this,arguments)}catch(e){console.error('c21 sc',o.title,e)}}});return o};
const T0=(G,dt)=>{G.dtc=dt;pre(G,dt);expire(G)};
const solid=b=>{b.hp=b.max};
const mkE=(G,c,x,y,hp)=>{const e=mkEn(G,c,x,y,hp||1e9);e.noRev=true;e.hx=e.x;e.hy=e.y;e.hpb=1;return e};
const initC=(G,c,rc)=>{G.c18sim=1;G.c19sim=1;G.c20sim=1;G.c21sim=1;G.pvp=false;if(rc)G.c18rc=rc};
const mkSh=(G,x,y,tx,ty,dmg,sp)=>shell(G,x,y,tx,ty,dmg,sp||9);
const walk=(a,tx,ty,sp,dt)=>{const dx=tx-a.x,dy=ty-a.y,l=Math.hypot(dx,dy);if(l<.05)return true;const m=Math.min(l,sp*dt);a.x+=dx/l*m;a.y+=dy/l*m;return l-m<.05};
const hqOf=(G,x,y,max)=>{const h=mkBld(G,'hq4',x,y,{w:4,h:4,max:max||60});h.hq=true;h.hp=h.max;G.hq=h;return h};

SC.fc1=safe({title:'CỔNG THÉP GIA CỐ',note:'Công trình lân cận trong 4 ô chịu ít hơn 10% sát thương (không tính chính cổng; nhiều cổng không cộng dồn)',
  init(G,c){initC(G,c);c.b=mkBld(G,'fc1',7.5,6.0,{lv:c.lv});c.wa=mkBld(G,'wall',4.4,6.6,{w:2,h:1,max:30});c.wb=mkBld(G,'wall',12.6,9.0,{w:2,h:1,max:30});c.es=[mkE(G,c,5.0,.6),mkE(G,c,11.0,.6)];c.la=0;c.lb=0;c.t1=0},
  step(G,dt,c){T0(G,dt);solid(c.b);c.la+=(c.wa.max-c.wa.hp)*DFB;c.lb+=(c.wb.max-c.wb.hp)*DFB;c.wa.hp=c.wa.max;c.wb.hp=c.wb.max;TICK.fc1(c.b,dt,G);
    c.t1-=dt;if(c.t1<=0){c.t1=.3;mkSh(G,c.es[0].x,c.es[0].y+.5,c.wa.x,c.wa.y-.2,.7,9);mkSh(G,c.es[1].x,c.es[1].y+.5,c.wb.x,c.wb.y-.2,.7,9)}},
  over(q,G,c,X,Y,s){txt(q,'Trong 4 ô: nhận '+nf(c.la)+' (−10%)',X(c.wa.x),Y(c.wa.y)-s*.9,'#cfe0ff',10);txt(q,'Ngoài 4 ô: nhận '+nf(c.lb),X(c.wb.x),Y(c.wb.y)-s*.9,'#ffd0a0',10);
    txt(q,'Cùng loại đạn, cùng số phát bắn · so sánh tổng sát thương nhận',X(7.5),Y(9.9),'#cfd8ea',11)}});

SC.fc2=safe({title:'HẦM TRÚ ẨN NHỎ',note:'Tàu đồng minh đứng sát hầm 0,5 giây sẽ chui vào và ra ở hầm kế tiếp (nhiều hầm tạo thành mạng; chỉ 1 hầm thì ra phía đối diện căn cứ)',
  init(G,c){initC(G,c);c.A=mkBld(G,'fc2',3.4,7.6,{lv:c.lv});c.B=mkBld(G,'fc2',11.6,7.6,{lv:c.lv});c.w=mkBld(G,'wall',7.5,8.6,{w:2,h:1,max:30});c.a=[mkAl(G,c,3.4,3.4,0,100)];c.ph=0;c.tg=[3.4,7.6];c.wait=0;c.lastTp=-1;c.tn=0},
  step(G,dt,c){const a=c.a[0];T0(G,dt);solid(c.A);solid(c.B);TICK.fc2(c.A,dt,G);TICK.fc2(c.B,dt,G);
    if(a.c21tp!=null&&a.c21tp!==c.lastTp){c.lastTp=a.c21tp;c.tn++;c.wait=1.8;const ex=a.x<7.5?c.A:c.B;c.tg=[ex.x,ex.y-3.4]}
    if(c.wait>0){c.wait-=dt;if(c.wait<=0){const ex=a.x<7.5?c.A:c.B;c.tg=[ex.x,ex.y]}}
    else walk(a,c.tg[0],c.tg[1],3.2,dt);
    a.hp=a.max},
  over(q,G,c,X,Y,s){drawAl(q,c.a[0],X,Y,s);txt(q,'Hầm A',X(c.A.x),Y(c.A.y)+s*1.55,'#bfeaff',10);txt(q,'Hầm B',X(c.B.x),Y(c.B.y)+s*1.55,'#bfeaff',10);
    txt(q,c.tn?'Đã qua hầm '+c.tn+' lần · mỗi tàu nghỉ 4 giây sau khi ra':'Tàu đi tới hầm A…',X(7.5),Y(9.9),'#bfeaff',11)}});

SC.fc9=safe(Object.assign({},SC.fc2,{title:'HẦM NGẦM KIÊN CỐ',note:'Hầm ngầm 2.000 máu: tàu đồng minh đứng sát hầm 0,5 giây sẽ chui vào và ra ở hầm kế tiếp (chung mạng với Hầm Trú Ẩn Nhỏ)',
  init(G,c){initC(G,c);c.A=mkBld(G,'fc9',3.4,7.6,{lv:c.lv});c.B=mkBld(G,'fc9',11.6,7.6,{lv:c.lv});c.w=mkBld(G,'wall',7.5,8.6,{w:2,h:1,max:30});c.a=[mkAl(G,c,3.4,3.4,0,100)];c.ph=0;c.tg=[3.4,7.6];c.wait=0;c.lastTp=-1;c.tn=0}}));
SC.fc3=safe({title:'PHÁO ĐÀI BÊ TÔNG',note:'Đồng minh (kể cả drone) đi vào 5 ô nhận khiên chặn 400 sát thương trong 10 giây; mỗi đơn vị nhận lại sau tối thiểu 20 giây',
  init(G,c){initC(G,c);c.b=mkBld(G,'fc3',7.5,5.2,{lv:c.lv});c.hub=mkBld(G,'wall',13.0,9.0,{w:2,h:1,max:30});c.dr={x:12.6,y:8.2,ang:-Math.PI/2,hp:200,hmax:200,dead:false,hf:0,fl:0,age:5,rs:0};c.hub.drs=[c.dr];
    c.a=[mkAl(G,c,2,2.6,0,1e5)];c.es=[mkE(G,c,7.5,-.6)];c.t1=0;c.k=0;c.ph=0},
  step(G,dt,c){c.ph+=dt;const a=c.a[0];T0(G,dt);solid(c.b);TICK.fc3(c.b,dt,G);a.hp=a.max=1e5;c.dr.hp=Math.max(c.dr.hp,1);
    a.x=2.2+(Math.sin(c.ph*.55-1.2)*.5+.5)*10.6;a.y=2.8+Math.sin(c.ph*.7)*.5;
    c.dr.age+=dt;if(c.dr.hf>0)c.dr.hf-=dt;c.dr.x=9.2+Math.sin(c.ph*.9)*3.2;c.dr.y=7.4+Math.cos(c.ph*.7)*.5;
    c.t1-=dt;if(c.t1<=0){c.t1=.4;c.k++;const t=c.k%2?a:c.dr;mkSh(G,c.es[0].x+(c.k%3-1)*2,c.es[0].y+.5,t.x,t.y,1.2,9)}},
  over(q,G,c,X,Y,s){const a=c.a[0];drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t);if(window.c15DroneDraw)window.c15DroneDraw(q,c.dr,X(c.dr.x),Y(c.dr.y),s,G.t);
    const sv=shVal(a);txt(q,sv>0?'Khiên '+nf(sv):'Chưa có khiên',X(a.x),Y(a.y)-a.size*s*.8,sv>0?'#dfe6f5':'#8fa6d8',10);
    const dv=c.dr.shd&&c.dr.shd.v>0?c.dr.shd.v:0;txt(q,dv>0?'Drone: khiên '+nf(dv):'Drone: chưa có khiên',X(c.dr.x),Y(c.dr.y)-s*.8,dv>0?'#dfe6f5':'#8fa6d8',10);
    txt(q,'Đi vào 5 ô: +400 khiên · rời đi và quay lại sau 20 giây sẽ có khiên mới',X(7.5),Y(9.9),'#dfe6f5',11)}});

SC.fc4=safe({title:'TRẠM GÁC CHỐNG XÂM NHẬP',note:'Hồi 20% giáp tối đa cho Lưới Laser Bốn Điểm, hồi chiêu 30 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.h=hqOf(G,9.2,4.6,60);c.n=mkBld(G,'ne9',3.2,7.6,{lv:c.lv});c.b=mkBld(G,'fc4',12.8,8.0,{lv:c.lv});c.es=[mkE(G,c,6.4,.5),mkE(G,c,11.5,.2)];c.t1=0;c.last=0;c.heals=0},
  step(G,dt,c){T0(G,dt);solid(c.b);solid(c.n);if(c.h.hp<c.h.max*.5)c.h.hp=c.h.max;window.C19.TICK.ne9(c.n,dt,G);const m=c.n.c19x,h0=m?m.hp:0;TICK.fc4(c.b,dt,G);if(m&&m.hp>h0+1e-9)c.heals++;
    c.t1-=dt;if(c.t1<=0){c.t1=.25;const e=c.es[(Math.random()*2)|0];mkSh(G,e.x,e.y+.5,c.h.x+(Math.random()-.5)*2,c.h.y-1,.9,9)}},
  over(q,G,c,X,Y,s){const m=c.n.c19x;txt(q,m?(m.hp>0?'Lưới laser '+nf(m.hp*DFB)+'/'+nf(m.max*DFB):'Lưới laser đã vỡ')+' · Trạm gác đã hồi '+c.heals+' lần':'…',X(7.5),Y(9.9),'#d9b8ff',11)}});

SC.fc5=safe({title:'CỔNG CHẶN HẠNG NẶNG',note:'Boss xâm nhập căn cứ: dựng giáp trước mặt boss chặn 2000 sát thương và đẩy boss lùi 1 ô, hồi chiêu 50 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.h=hqOf(G,7.5,7.2,60);c.b=mkBld(G,'fc5',3.4,8.0,{lv:c.lv});c.w=mkBld(G,'wall',11.6,8.0,{w:2,h:1,max:30});c.e=mkE(G,c,7.5,-3.2);c.e.boss=true;c.e.size=3.6;c.e.noRev=true;c.t1=0;c.tt=0},
  step(G,dt,c){c.tt+=dt;T0(G,dt);solid(c.b);solid(c.w);if(c.h.hp<c.h.max*.5)c.h.hp=c.h.max;c.e.hp=c.e.max=1e9;
    if(!c.e.c21kb&&!c.e.c21bar&&c.e.y<1.2)c.e.y+=1.5*dt;
    if(c.tt>26){c.tt=0;c.e.x=7.5;c.e.y=-3.2;c.e.c21bar=0;c.b.c21cd=0;(G.c21e||[]).forEach(o=>{o.dead=true;o.t=o.max})}
    TICK.fc5(c.b,dt,G);
    c.t1-=dt;if(c.t1<=0&&c.e.y>-1){c.t1=.4;const tg=[c.h,c.w,c.b][(Math.random()*3)|0];mkSh(G,c.e.x,c.e.y+1,tg.x+(Math.random()-.5)*2,tg.y-.5,2.5,9)}},
  over(q,G,c,X,Y,s){const o=(G.c21e||[]).find(o=>o.k==='bar');txt(q,'Boss',X(c.e.x),Y(c.e.y)-c.e.size*s*.7,'#ffd7a0',10);
    txt(q,o?'Giáp chặn boss '+nf(o.hp*DFB)+'/'+nf(o.hm*DFB)+' · boss bị đẩy lùi 1 ô':(c.b.c21cd>0?'Cổng hồi chiêu '+Math.ceil(c.b.c21cd)+'s':'Đang chờ boss xâm nhập căn cứ…'),X(7.5),Y(9.9),'#ffe2b0',11)}});

SC.fc6=safe({title:'BOONG-KE BẢO VỆ LÕI',note:'Khi Trụ sở dưới 50% máu: hồi 30% máu tối đa trong 4 giây và tạo lớp giáp 200 trong 8 giây, hồi chiêu 60 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.h=hqOf(G,8.4,5.0,60);c.b=mkBld(G,'fc6',3.2,7.6,{lv:c.lv});c.es=[mkE(G,c,5.5,.4),mkE(G,c,11.2,.2)];c.t1=0},
  step(G,dt,c){T0(G,dt);solid(c.b);if(c.h.hp<c.h.max*.1)c.h.hp=c.h.max*.1;TICK.fc6(c.b,dt,G);
    c.t1-=dt;if(c.t1<=0){c.t1=.22;const e=c.es[(Math.random()*2)|0];mkSh(G,e.x,e.y+.5,c.h.x+(Math.random()-.5)*2,c.h.y-1,1.6,9)}},
  over(q,G,c,X,Y,s){const h=c.h,sv=h.shd&&h.shd.t>0&&h.shd.v>0?h.shd.v*DFB:0;txt(q,'Trụ sở '+nf(h.hp*DFB)+'/'+nf(h.max*DFB)+(sv>0?' · giáp '+nf(sv):''),X(h.x),Y(h.y)-h.h*s*.62-8,sv>0?'#9dffb8':'#ffffff',10);
    txt(q,c.b.c21hl?'Đang hồi máu…':(c.b.c21cd>0?'Boong-ke hồi chiêu '+Math.ceil(c.b.c21cd)+'s':'Boong-ke chờ Trụ sở xuống dưới 50%'),X(7.5),Y(9.9),'#9dffb8',11)}});

/* xuất để kiểm thử */
window.C21={C21T,CFG,TICK,tick:window.c21Tick,pre,gateRed,tunnels,exitFor,enterTunnel,barrier,barHit,droneShieldStep,droneList,baseBox,SC:Object.keys(SC).filter(k=>C21T.includes(k))};
})();
})();
