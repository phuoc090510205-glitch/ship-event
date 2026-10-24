
/* ===== c32: 10 pháo hạng nặng — hd1 Song Nòng Gọn · hd2 Khung Thép Trường Xạ · hc1 Ba Nòng Trường Giang · hc2 Song Nòng Hộ Vệ · hc4 Mảnh Tuyệt Tầm
         hc5 Cuộn Đôi Lam Xoắn · hc6 Đôi Hạng Nặng Song Hỏa · hc7 Sáu Nòng Lục Phương · hc8 Một Nòng Độc Thương · hb10 Pháo Phá Giáp ===== */
(function(){
const C22=window.C22;if(!C22||!C22.TUR||!C22.TICK||!C22.turret)return;
const TUR=C22.TUR;
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const enemies=G=>(G.en||[]).filter(e=>!e.dead&&!(e.spawn>G.t));
const mapW=G=>G.wd?G.wd.Wd:99,mapH=G=>G.wd?G.wd.Hd:99;
function dmgB(G,b,e,d){G.c19own=b||null;try{dfDmgS(e,d,false)}finally{G.c19own=null}}
const wrapA=a=>Math.atan2(Math.sin(a),Math.cos(a));
/* xoay nòng tới mục tiêu trước khi bắn (đạn ra đúng đầu nòng, đúng hướng nòng) */
function aim(b,a,dt){if(b.c22ra==null)b.c22ra=a;b.c22a=a;const d=wrapA(a-b.c22ra),st=7*dt;b.c22ra+=Math.max(-st,Math.min(st,d));return Math.abs(wrapA(a-b.c22ra))<.12}
const muzzle=(b,a,lat)=>{const L=Math.max(b.w,b.h)*.42;return {x:b.x+Math.cos(a)*L-Math.sin(a)*lat,y:b.y+Math.sin(a)*L+Math.cos(a)*lat}};
/* sát thương theo số hiển thị (nội bộ = /20) */
const NEW={
  hd1:{rng:10.6,rate:1,n:2,par:.5,dmg:200,kind:'bullet',sp:18,col:'#4fb4ff',sz:.16},
  hd2:{rng:8,rate:1,dmg:500,kind:'lline',col:'#ffffff'},
  hc1:{rng:14,rate:2,n:3,par:.5,dmg:110,kind:'bullet',sp:18,col:'#4fb4ff',sz:.15},
  hc2:{rng:11,rate:3,n:2,par:.55,dmg:75,kind:'bullet',sp:20,col:'#ffd27a',sz:.11},
  hc4:{rng:30,cdS:3,dmg:500,kind:'far',minR:5,pri:25,sp:30,col:'#dfe8ff'},
  hc5:{rng:10,cdS:2,n:2,par:.5,dmg:200,kind:'beam',col:'#5ad8ff'},
  hc6:{rng:14,cdS:3,n:2,par:.7,dmg:500,kind:'bullet',sp:13,col:'#ff4a3a',sz:.42,minR:3,c32:'red'},
  hc7:{rng:14.4,cdS:2.8,n:6,par:.3,dmg:80,kind:'bullet',sp:17,col:'#ffcf5a',sz:.1,c32hit:'slow'},
  hc8:{rng:8,cdS:2,dmg:100,kind:'poison',dot:1200,dur:15,col:'#7dff5a'},
  hb10:{rng:13,rate:1,n:1,dmg:200,arm:2000,kind:'bullet',sp:14,col:'#ff3a3a',sz:.5,c32:'red',c32hit:'armor'}};
const NAME={hb10:'Pháo Phá Giáp'};
Object.keys(NAME).forEach(t=>{const b=BLD.find(x=>x.t===t);if(b)b.n=NAME[t];if(typeof UPD!=='undefined'&&UPD[t])UPD[t].n=NAME[t]});
/* ---------- tick riêng ---------- */
function nearT(G,b,R,minR){let t=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-b.x,e.y-b.y);if(q<(minR||0))return;if(q<=R+(e.size||2)*.3&&q<bd){bd=q;t=e}});return t}
function per(b,G,c,r){const pb=PB(G);return (c.cdS||1/c.rate)*(r||1)*(pb.cdm||1)*(G.c18rc||1)}
/* hd2: tia laser trắng xuyên mọi mục tiêu trên đường thẳng tới 8 ô */
function llineTick(b,dt,G,r){const c=TUR.hd2,pb=PB(G),R=c.rng*(pb.rm||1),P=per(b,G,c,r);b.c22per=P;if(b.c22cd==null)b.c22cd=0;b.c22cd=Math.max(b.c22cd,-dt)-dt;
  const tg=nearT(G,b,R);b.c22tg=tg;if(!tg)return;const ok=aim(b,Math.atan2(tg.y-b.y,tg.x-b.x),dt);if(b.c22cd>0||!ok)return;b.c22cd+=P;b.c22fl=G.t;
  const a=b.c22ra,m=muzzle(b,a,0),ex=b.x+Math.cos(a)*R,ey=b.y+Math.sin(a)*R,d=c.dmg/20*LV(b)*(pb.dm||1);let n=0;
  enemies(G).forEach(e=>{const dx=e.x-m.x,dy=e.y-m.y,L=Math.hypot(ex-m.x,ey-m.y)||1,ux=(ex-m.x)/L,uy=(ey-m.y)/L,al=dx*ux+dy*uy;if(al<-(e.size||2)*.4||al>L+(e.size||2)*.4)return;
    if(Math.abs(-dx*uy+dy*ux)<=(e.size||2)*.42+.25){dmgB(G,b,e,d);n++;G.fx.push({x:e.x,y:e.y,r:.5,t:.2,max:.2,col:'#ffffff'})}});
  (G.c32b=G.c32b||[]).push({x1:m.x,y1:m.y,x2:ex,y2:ey,t:0,max:.22,col:'#ffffff',w:.34});b.c32n=n}
/* hc4: tầm 30 ô, ưu tiên mục tiêu từ 25 ô trở lên, không thấy mục tiêu dưới 5 ô; đạn xuyên qua mục tiêu khác để tới đích */
function farTick(b,dt,G,r){const c=TUR.hc4,pb=PB(G),R=c.rng*(pb.rm||1),P=per(b,G,c,r);b.c22per=P;if(b.c22cd==null)b.c22cd=0;b.c22cd=Math.max(b.c22cd,-dt)-dt;
  let best=null,bs=-1;enemies(G).forEach(e=>{const q=Math.hypot(e.x-b.x,e.y-b.y);if(q<c.minR||q>R+(e.size||2)*.3)return;const s=(q>=c.pri?1000:0)+q;if(s>bs){bs=s;best=e}});
  b.c22tg=best;if(!best)return;const ok=aim(b,Math.atan2(best.y-b.y,best.x-b.x),dt);if(b.c22cd>0||!ok)return;b.c22cd+=P;b.c22fl=G.t;
  const a=b.c22ra,m=muzzle(b,a,0),tx=best.x+(best.c22vx||0)*.2,ty=best.y+(best.c22vy||0)*.2,dur=Math.max(.15,Math.hypot(tx-m.x,ty-m.y)/c.sp),d=c.dmg/20*LV(b)*(pb.dm||1);
  (G.c22p=G.c22p||[]).push({x:m.x,y:m.y,x0:m.x,y0:m.y,tx,ty,dur,u:0,vx:Math.cos(a)*c.sp,vy:Math.sin(a)*c.sp,dmg:d,kind:'lob',cfg:Object.assign({},c,{hide:1e9,c32r:1}),col:c.col,sz:.14,spl:.35,own:b,ex:null,age:0,hr:.1,hide:1e9,tr:null,tl:7,seed:Math.random()*100,pass:0,turn:0,tg:best,life:dur+1});
  G.fx.push({x:m.x,y:m.y,r:.5,t:.12,max:.12,col:'#ffffff'})}
/* hc8: tia độc 100 + nhiễm độc 1.200 trong 15 giây, cộng dồn */
function poisonTick(b,dt,G,r){const c=TUR.hc8,pb=PB(G),R=c.rng*(pb.rm||1),P=per(b,G,c,r);b.c22per=P;if(b.c22cd==null)b.c22cd=0;b.c22cd=Math.max(b.c22cd,-dt)-dt;
  const tg=nearT(G,b,R);b.c22tg=tg;if(!tg)return;const ok=aim(b,Math.atan2(tg.y-b.y,tg.x-b.x),dt);if(b.c22cd>0||!ok)return;b.c22cd+=P;b.c22fl=G.t;
  const k=LV(b)*(pb.dm||1),m=muzzle(b,b.c22ra,0);dmgB(G,b,tg,c.dmg/20*k);(tg.c32pz=tg.c32pz||[]).push({rate:c.dot/c.dur/20*k,t:c.dur,b});
  (G.c32b=G.c32b||[]).push({x1:m.x,y1:m.y,x2:tg.x,y2:tg.y,t:0,max:.3,col:'#7dff5a',w:.22,tox:1});G.fx.push({x:tg.x,y:tg.y,r:.7,t:.3,max:.3,col:'#9dff7a'})}
function poisonStep(G,dt){(G.en||[]).forEach(e=>{const L=e.c32pz;if(!L||!L.length)return;if(e.dead){e.c32pz=null;return}let d=0,bb=null;L.forEach(p=>{const s=Math.min(dt,p.t);d+=p.rate*s;p.t-=dt;bb=p.b});e.c32pz=L.filter(p=>p.t>0);if(d>0)dmgB(G,bb,e,d)})}
Object.keys(NEW).forEach(t=>{const c=NEW[t];c.id=t;TUR[t]=c;
  C22.TICK[t]=c.kind==='lline'?llineTick:c.kind==='far'?farTick:c.kind==='poison'?poisonTick:(b,dt,G,r)=>C22.turret(b,dt,G,TUR[t],r||1);
  if(!C22.C22T.includes(t))C22.C22T.push(t);
  [typeof NBF!=='undefined'?NBF[t]:null,(BLD.find(x=>x.t===t)||{}).nb].forEach(f=>{if(!f)return;f.c22=t;f.k='aura';['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun','v','n','e','rng','cd','sp','spl','col','t','r'].forEach(k=>{delete f[k]});f.r=0});
  if(typeof BT!=='undefined'&&BT[t])delete BT[t]});
/* ---------- hiệu ứng khi đạn trúng: làm chậm ngẫu nhiên (hc7), phá giáp (hb10) ---------- */
function hitOf(G,p){const W=mapW(G),H=mapH(G);if(p.x<-3||p.y<-3||p.x>W+3||p.y>H+3||!(p.life>0))return null;let hit=null,bd=1e9;enemies(G).concat((G.en||[]).filter(e=>e.dead)).forEach(e=>{const q=Math.hypot(e.x-p.x,e.y-p.y);if(q<(e.size||2)*.42+p.hr+.35&&q<bd){bd=q;hit=e}});return hit}
function after(G,p){const c=p.cfg,e=hitOf(G,p);if(!e||e.dead)return;
  if(c.c32hit==='slow'&&Math.random()<.2){const k=(e.slowT>0?(e.slowK==null?1:e.slowK):1);e.slowK=Math.max(.3,k-.1);e.slowT=Math.max(e.slowT||0,2);e.c32sl=G.t+2;G.fx.push({x:e.x,y:e.y,r:.6,t:.25,max:.25,col:'#bfe8ff'})}
  if(c.c32hit==='armor'){let a=c.arm/20*LV(p.own)*(PB(G).dm||1),br=0;
    [e.shd,e.cs&&e.cs.abs].forEach(s=>{if(s&&s.v>0&&a>0){const x=Math.min(s.v,a);s.v-=x;a-=x;br+=x}});if(e.shT>0){e.shT=0;e.shP=0;br+=1}
    if(br>0){e.c32ab=G.t+.6;G.fx.push({x:e.x,y:e.y,r:(e.size||2)*.8,t:.4,max:.4,col:'#ff7a7a'})}}}
function wrapStep(G,inner){const mine=(G&&G.c22p||[]).filter(p=>p.cfg&&p.cfg.c32hit&&!p.dead);const r=inner();if(G)mine.forEach(p=>{if(p.dead&&!p.c32d){p.c32d=1;try{after(G,p)}catch(e){console.error(e)}}});return r}
function fxStep(G,dt){const B=G.c32b;if(B&&B.length){B.forEach(o=>o.t+=dt);G.c32b=B.filter(o=>o.t<o.max)}poisonStep(G,dt)}
{const _S=dfStep;dfStep=function(dt){const G=DG,a=arguments,t=this;const r=wrapStep(G,()=>_S.apply(t,a));try{if(DG&&DG.bl&&!DG.done)fxStep(DG,dt)}catch(e){console.error(e)}return r}}
/* ---------- mô tả + bảng thông số ---------- */
const ROWS={
  hd1:k=>[['Sát thương mỗi viên',nf(200*k)],['Số viên mỗi lượt','2 viên đạn xanh, bay song song'],['Tốc độ bắn','1 lượt/giây'],['Tầm bắn','10,6 ô · xoay 360°']],
  hd2:k=>[['Sát thương',nf(500*k)+' cho mọi mục tiêu trên đường tia'],['Tia laser','Trắng, xuyên qua mục tiêu, dài tối đa 8 ô'],['Tốc độ bắn','1 phát/giây'],['Tầm bắn','8 ô · xoay 360°']],
  hc1:k=>[['Sát thương mỗi viên',nf(110*k)],['Số viên mỗi lượt','3 viên đạn xanh, bay thẳng song song'],['Tốc độ bắn','2 lượt/giây'],['Tầm bắn','14 ô · xoay 360°']],
  hc2:k=>[['Sát thương mỗi viên',nf(75*k)],['Số viên mỗi lượt','2 viên, bay thẳng song song'],['Tốc độ bắn','3 lượt/giây'],['Tầm bắn','11 ô · xoay 360°']],
  hc4:k=>[['Sát thương mỗi viên',nf(500*k)],['Tầm bắn','Tối đa 30 ô · xoay 360°'],['Ưu tiên','Mục tiêu từ 25 ô trở lên'],['Điểm mù','Không nhắm được mục tiêu dưới 5 ô'],['Đạn','Xuyên qua mục tiêu khác để tới đích'],['Tốc độ bắn','1 viên / 3 giây']],
  hc5:k=>[['Sát thương mỗi tia',nf(200*k)],['Số tia mỗi lượt','2 tia laser xanh'],['Tốc độ bắn','1 lượt / 2 giây'],['Tầm bắn','10 ô · xoay 360°']],
  hc6:k=>[['Sát thương mỗi viên',nf(500*k)],['Số viên mỗi lượt','2 viên pháo đỏ lớn'],['Tốc độ bắn','1 lượt / 3 giây'],['Tầm bắn','14 ô · xoay 360°'],['Điểm mù','Không nhắm được mục tiêu dưới 5 ô']],
  hc7:k=>[['Sát thương mỗi viên',nf(80*k)],['Số viên mỗi lượt','6 viên, bay thẳng song song'],['Làm chậm','20% tỷ lệ · chậm 10% trong 2 giây · cộng dồn'],['Tốc độ bắn','1 lượt / 2,8 giây'],['Tầm bắn','14,4 ô · xoay 360°']],
  hc8:k=>[['Sát thương tia độc',nf(100*k)],['Nhiễm độc','Thêm '+nf(1200*k)+' trong 15 giây · cộng dồn'],['Tốc độ bắn','1 phát / 2 giây'],['Tầm bắn','8 ô · xoay 360°']],
  hb10:k=>[['Sát thương lên máu',nf(200*k)],['Sát thương lên giáp',nf(2000*k)+' (phá khiên của mục tiêu)'],['Đạn','Đạn đỏ đường kính 1 ô'],['Tốc độ bắn','1 phát/giây'],['Tầm bắn','13 ô · xoay 360°']]};
const NOTE={
  hd1:'Bắn 2 viên đạn xanh cùng lúc, bay song song, mỗi viên 200 sát thương, 1 lượt mỗi giây.',
  hd2:'Bắn tia laser trắng xuyên qua mọi mục tiêu trên đường thẳng dài tối đa 8 ô, mỗi mục tiêu 500 sát thương, 1 phát mỗi giây.',
  hc1:'Bắn 3 viên đạn xanh bay thẳng song song vào mục tiêu trong 14 ô, mỗi viên 110 sát thương, 2 lượt mỗi giây.',
  hc2:'Bắn 2 viên đạn cùng lúc bay thẳng song song vào mục tiêu trong 11 ô, mỗi viên 75 sát thương, 3 lượt mỗi giây.',
  hc4:'Tầm bắn 30 ô, ưu tiên mục tiêu từ 25 ô trở lên, không nhắm được mục tiêu dưới 5 ô. Đạn xuyên qua mục tiêu khác để tới đích, 500 sát thương, 3 giây 1 viên.',
  hc5:'Bắn 2 tia laser xanh cùng lúc vào mục tiêu trong 10 ô, mỗi tia 200 sát thương, 2 giây 1 lượt.',
  hc6:'Bắn 2 viên pháo đỏ lớn vào mục tiêu trong 14 ô, mỗi viên 500 sát thương; không nhắm được mục tiêu dưới 5 ô; 3 giây 1 lượt.',
  hc7:'Bắn 6 viên đạn cùng lúc, mỗi viên 80 sát thương; mỗi viên trúng có 20% làm chậm 10% trong 2 giây (cộng dồn).',
  hc8:'Bắn tia độc vào kẻ địch trong 8 ô: 100 sát thương và nhiễm độc thêm 1.200 sát thương trong 15 giây (cộng dồn), 2 giây 1 phát.',
  hb10:'Bắn đạn đỏ đường kính 1 ô vào mục tiêu trong 13 ô: 200 sát thương lên máu và 2.000 sát thương lên giáp (khiên), 1 phát mỗi giây.'};
Object.keys(NEW).forEach(t=>{const u=typeof UPD!=='undefined'&&UPD[t];if(u&&u.st){const o=u.st;u.st=l=>[o(l)[0]].concat(ROWS[t](1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b)b.note=NOTE[t]});
/* ---------- vẽ: tia laser, tia độc, đạn pháo đỏ, độc trên kẻ địch ---------- */
function draw(q,G,X,Y,s,T){if(!G)return;
  (G.c32b||[]).forEach(o=>{const k=o.t/o.max,x1=X(o.x1),y1=Y(o.y1),x2=X(o.x2),y2=Y(o.y2);q.save();q.globalAlpha=Math.max(0,1-k);q.lineCap='round';q.globalCompositeOperation='lighter';
    q.shadowColor=o.col;q.shadowBlur=16;q.strokeStyle=o.tox?'rgba(110,255,80,.55)':'rgba(200,225,255,.55)';q.lineWidth=Math.max(5,o.w*s*1.6);q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke();
    q.strokeStyle=o.tox?'#eaffd8':'#ffffff';q.lineWidth=Math.max(2,o.w*s*.55);q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke();
    if(o.tox){for(let i=0;i<6;i++){const u=(i+.5)/6,px=x1+(x2-x1)*u+Math.sin(T*20+i*2)*4,py=y1+(y2-y1)*u+Math.cos(T*18+i)*4;q.fillStyle='#9dff7a';q.beginPath();q.arc(px,py,2.2,0,7);q.fill()}}q.restore()});
  (G.c22p||[]).forEach(p=>{if(p.dead||!p.cfg)return;
    if(p.cfg.c32r){const x=X(p.x),y=Y(p.y),a=Math.atan2(p.ty-p.y0,p.tx-p.x0),r=Math.max(2.5,s*.14);q.save();q.translate(x,y);q.rotate(a);q.globalCompositeOperation='lighter';
      const L=s*3,g=q.createLinearGradient(-L,0,0,0);g.addColorStop(0,'rgba(200,220,255,0)');g.addColorStop(1,'rgba(230,240,255,.9)');q.fillStyle=g;q.beginPath();q.ellipse(-L*.5,0,L*.5,r*.6,0,0,7);q.fill();q.fillStyle='#fff';q.beginPath();q.ellipse(0,0,r*1.8,r*.6,0,0,7);q.fill();q.restore()}});
  (G.en||[]).forEach(e=>{if(e.dead)return;const x=X(e.x),y=Y(e.y),r=(e.size||2)*s*.45;
    if(e.c32pz&&e.c32pz.length){q.save();q.globalAlpha=.75;q.fillStyle='#7dff5a';for(let i=0;i<Math.min(6,2+e.c32pz.length);i++){const a=T*3+i*1.3,rr=r*.7;q.beginPath();q.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr-((T*20+i*7)%10)*.6,2.4,0,7);q.fill()}
      q.globalAlpha=1;q.font='bold 10px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';const tx='☠×'+e.c32pz.length;q.strokeText(tx,x,y-r-6);q.fillStyle='#b8ff9a';q.fillText(tx,x,y-r-6);q.restore()}
    if(e.c32sl>T){q.save();q.globalAlpha=.6;q.strokeStyle='#bfe8ff';q.lineWidth=2;q.setLineDash([3,4]);q.beginPath();q.arc(x,y,r*1.05,0,7);q.stroke();q.restore()}
    if(e.c32ab>T){q.save();q.globalAlpha=Math.min(1,(e.c32ab-T)/.3);q.strokeStyle='#ff6a6a';q.lineWidth=3;for(let i=0;i<5;i++){const a=i*1.26+T*4;q.beginPath();q.moveTo(x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.7);q.lineTo(x+Math.cos(a)*r*1.25,y+Math.sin(a)*r*1.25);q.stroke()}q.restore()}})}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s,T==null?(G&&G.t)||0:T)}catch(e){console.error(e)}}}
/* ---------- mô phỏng xem trước ---------- */
(function(){const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;const {mkBld,mkEn}=H;
  const txt=(q,s,x,y,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
  const mkE=(G,c,x,y)=>{const e=mkEn(G,c,x,y,1e9);e.noRev=true;return e};
  function track(c,G,e){if(e._h==null)e._h=e.hp;if(e.hp<e._h)(c.log=c.log||[]).push([G.t,(e._h-e.hp)*20]);e._h=e.hp;if(c.log)c.log=c.log.filter(x=>G.t-x[0]<(c.win||3))}
  const dps=(c,G)=>{const L=c.log||[];if(!L.length)return 0;const w=c.win||3,t0=Math.max(.5,Math.min(w,G.t));return L.reduce((a,x)=>a+x[1],0)/t0};
  const POS={hd1:[[7.5,3]],hd2:[[7.5,4.6],[7.5,2.6],[7.5,.8]],hc1:[[7.5,3]],hc2:[[7.5,3]],hc4:[[7.5,.6],[6.3,4.8],[8.7,4.6]],hc5:[[7.5,3]],hc6:[[7.5,1.2],[7.5,5.4]],hc7:[[7.5,2.8]],hc8:[[7.5,3.2],[5.6,3.6]],hb10:[[7.5,2.8]]};
  Object.keys(NEW).forEach(t=>{const bn=((BLD.find(b=>b.t===t)||{}).n||t).toUpperCase();
    SC[t]={title:bn,note:NOTE[t],
      init(G,c){G.c22sim=1;G.pvp=false;const d=BLD.find(x=>x.t===t)||{h:4},by=Math.min(7.5,9.8-d.h/2);c.b=mkBld(G,t,7.5,by,{lv:c.lv});c.ph=0;c.log=[];c.win=t==='hc8'?8:3;c.es=POS[t].map(p=>mkE(G,c,p[0],p[1]));
        if(t==='hb10')c.es[0].shd={v:400,t:9999,max:400}},
      step(G,dt,c){try{c.ph+=dt;G.dtc=dt;wrapStep(G,()=>C22.pre(G,dt));fxStep(G,dt);c.b.hp=c.b.max;
        if(['hd1','hc1','hc2','hc5','hc7'].includes(t)){c.es[0].x=7.5+2.6*Math.sin(c.ph*.6);c.es[0].y=3+.5*Math.sin(c.ph)}
        if(t==='hb10'&&c.es[0].shd&&c.es[0].shd.v<=0&&c.ph%6<.05)c.es[0].shd.v=400;
        window.c22Tick(c.b,dt,G,1);c.es.forEach(e=>track(c,G,e))}catch(e){console.error(e)}},
      over(q,G,c,X,Y,s){try{txt(q,'Gây ≈ '+nf(dps(c,G))+' sát thương/giây (tổng)',X(7.5),Y(9.9),'#ffe08a',11);
        if(t==='hc4'){txt(q,'Mục tiêu xa nhất (ưu tiên ≥25 ô)',X(c.es[0].x),Y(c.es[0].y)+c.es[0].size*s*.8,'#dfe8ff',10);txt(q,'Dưới 5 ô: không nhắm được',X(7.5),Y(5.9),'#ffb0a0',10)}
        if(t==='hc6')txt(q,'Dưới 5 ô: không nhắm được',X(c.es[1].x),Y(c.es[1].y)-c.es[1].size*s*.7,'#ffb0a0',10);
        if(t==='hb10'){const e=c.es[0];txt(q,'Giáp: '+nf(Math.max(0,(e.shd&&e.shd.v)||0)*20),X(e.x),Y(e.y)-e.size*s*.75,'#ff9a9a',10)}}catch(e){}}}})})();
window.C32={NEW,after,fxStep,aim};
})();
