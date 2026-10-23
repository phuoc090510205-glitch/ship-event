
/* ===== c30: 5 công trình hạng nặng — hd3 Tháp Tám Ống Xoay · hd4 Pháo Ba Nòng Tầm Xa · hd5 Pháo Nhãn Xanh Đại Khung · hd6 Trụ Cuộn Lam Hồ Quang · hd7 Tháp Ba Nòng ===== */
(function(){
const C22=window.C22;if(!C22||!C22.TUR||!C22.TICK||!C22.turret)return;
const TUR=C22.TUR;
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const enemies=G=>(G.en||[]).filter(e=>!e.dead&&!(e.spawn>G.t));
const mapW=G=>G.wd?G.wd.Wd:99,mapH=G=>G.wd?G.wd.Hd:99;
function dmgB(G,b,e,d){G.c19own=b||null;try{dfDmgS(e,d,false)}finally{G.c19own=null}}
/* sát thương theo số hiển thị (nội bộ = /20) */
const NEW={
  hd3:{rng:12,rate:12,n:1,dmg:120,kind:'bullet',sp:20,col:'#ffd860',sz:.08,barrels:8},
  hd4:{rng:21,cdS:2,n:3,dmg:300,kind:'lob',sp:24,col:'#9fe0ff',sz:.16,minR:6,far:1,hide:1e9,c30:'rail'},
  hd5:{rng:12,cdS:6,n:1,dmg:500,kind:'bullet',sp:11,col:'#58c8ff',sz:.55,plasma:1,charge:1,ice:{R:4,life:4,slow:.3}},
  hd6:{rng:12,cdS:5,charge:1,col:'#7fd8ff',kind:'chain',dmg:500,dmg2:200,jumps:6,jr:4.5},
  hd7:{rng:14,rate:4,n:3,par:.5,dmg:280,dmgSide:250,side:.7,kind:'bullet',sp:18,col:'#ffcf5a',sz:.2}};
const NAME={hd7:'Tháp Ba Nòng',hd4:'Pháo Ba Nòng Tầm Xa'};
Object.keys(NAME).forEach(t=>{const b=BLD.find(x=>x.t===t);if(b)b.n=NAME[t];if(typeof UPD!=='undefined'&&UPD[t])UPD[t].n=NAME[t]});
/* ---------- tick riêng ---------- */
function lat(i,n,par){return (i-(n-1)/2)*par}
/* pháo ba nòng tầm xa: nhắm mục tiêu XA NHẤT trong 21 ô, không thấy mục tiêu trong 6 ô; đạn bay xuyên tới đúng mục tiêu */
function farTick(b,dt,G,reactor){const c=TUR.hd4,pb=PB(G),R=c.rng*(pb.rm||1),per=c.cdS*(reactor||1)*(pb.cdm||1)*(G.c18rc||1);b.c22per=per;
  if(b.c22cd==null)b.c22cd=0;b.c22cd=Math.max(b.c22cd,-dt)-dt;if(b.c22cd>0)return;
  let tg=null,bd=-1;enemies(G).forEach(e=>{const q=Math.hypot(e.x-b.x,e.y-b.y);if(q<c.minR)return;if(q<=R+(e.size||2)*.3&&q>bd){bd=q;tg=e}});
  b.c22tg=tg;if(!tg)return;const a=Math.atan2(tg.y-b.y,tg.x-b.x);b.c22a=a;b.c22fl=G.t;b.c22cd+=per;
  const d=c.dmg/20*LV(b)*(pb.dm||1),px=-Math.sin(a),py=Math.cos(a),L=Math.min(b.w,b.h)*.5;
  for(let i=0;i<3;i++){const o=lat(i,3,.42),x=b.x+Math.cos(a)*L+px*o,y=b.y+Math.sin(a)*L+py*o,tx=tg.x+(tg.c22vx||0)*.15+px*o*.4,ty=tg.y+(tg.c22vy||0)*.15+py*o*.4,
      dur=Math.max(.15,Math.hypot(tx-x,ty-y)/c.sp);
    (G.c22p=G.c22p||[]).push({x,y,x0:x,y0:y,tx,ty,dur,u:0,vx:Math.cos(a)*c.sp,vy:Math.sin(a)*c.sp,dmg:d,kind:'lob',cfg:c,col:c.col,sz:c.sz,spl:.35,own:b,ex:null,age:0,hr:.1,hide:1e9,tr:null,tl:7,seed:Math.random()*100,pass:0,turn:0,tg,life:dur+1})}
  G.fx.push({x:b.x+Math.cos(a)*L,y:b.y+Math.sin(a)*L,r:.6,t:.12,max:.12,col:c.col})}
/* trụ cuộn lam: tụ lực 5 giây → tia điện 500 nảy sang tối đa 6 mục tiêu gần bên (200 mỗi lần nảy) */
function chainTick(b,dt,G,reactor){const c=TUR.hd6,pb=PB(G),R=c.rng*(pb.rm||1),per=c.cdS*(reactor||1)*(pb.cdm||1)*(G.c18rc||1);b.c22per=per;
  if(b.c22cd==null)b.c22cd=per;b.c22cd=Math.max(b.c22cd,-dt)-dt;
  let tg=null,bd=1e9;enemies(G).forEach(e=>{const q=Math.hypot(e.x-b.x,e.y-b.y);if(q<=R+(e.size||2)*.3&&q<bd){bd=q;tg=e}});
  if(tg)b.c22a=Math.atan2(tg.y-b.y,tg.x-b.x);if(b.c22cd>0||!tg)return;
  b.c22cd+=per;b.c22fl=G.t;const k=LV(b)*(pb.dm||1),hit=[tg],pts=[{x:b.x,y:b.y},{x:tg.x,y:tg.y}];dmgB(G,b,tg,c.dmg/20*k);
  let cur=tg;for(let j=0;j<c.jumps;j++){let nx=null,nd=1e9;enemies(G).forEach(e=>{if(hit.includes(e))return;const q=Math.hypot(e.x-cur.x,e.y-cur.y);if(q<=c.jr+(e.size||2)*.3&&q<nd){nd=q;nx=e}});
    if(!nx)break;hit.push(nx);pts.push({x:nx.x,y:nx.y});dmgB(G,b,nx,c.dmg2/20*k);cur=nx}
  (G.c30z=G.c30z||[]).push({pts,t:0,max:.45,seed:Math.random()*99});hit.forEach(e=>G.fx.push({x:e.x,y:e.y,r:(e.size||2)*.5,t:.3,max:.3,col:'#bfeeff'}));b.c30n=hit.length}
/* tháp ba nòng: viên giữa 280, hai viên bên nhỏ hơn 30% gây 250 */
function triTick(b,dt,G,reactor){const c=TUR.hd7,n0=(G.c22p||[]).length;C22.turret(b,dt,G,c,reactor||1);const L=G.c22p||[];
  const mine=L.slice(n0).filter(p=>p.own===b);if(mine.length!==3)return;const k=LV(b)*(PB(G).dm||1);
  mine.forEach((p,i)=>{if(i===1){p.dmg=c.dmg/20*k}else{p.dmg=c.dmgSide/20*k;p.sz=c.sz*c.side;p.hr*=c.side}})}
Object.keys(NEW).forEach(t=>{const c=NEW[t];c.id=t;TUR[t]=c;
  C22.TICK[t]=t==='hd4'?farTick:t==='hd6'?chainTick:t==='hd7'?triTick:(b,dt,G,r)=>C22.turret(b,dt,G,TUR[t],r||1);
  if(!C22.C22T.includes(t))C22.C22T.push(t);
  [typeof NBF!=='undefined'?NBF[t]:null,(BLD.find(x=>x.t===t)||{}).nb].forEach(f=>{if(!f)return;f.c22=t;f.k='aura';['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun','v','n','e','rng','cd','sp','spl','col','t','r'].forEach(k=>{delete f[k]});f.r=0});
  if(typeof BT!=='undefined'&&BT[t])delete BT[t]});
/* ---------- mô tả + bảng thông số ---------- */
const ROWS={
  hd3:k=>[['Sát thương mỗi viên',nf(120*k)],['Nòng','8 nòng thay nhau bắn liên tiếp'],['Tốc độ bắn','12 viên/giây'],['Tầm bắn','12 ô · xoay 360°']],
  hd4:k=>[['Sát thương mỗi viên',nf(300*k)],['Số viên mỗi lượt','3 (bắn cùng lúc)'],['Tốc độ bắn','1 lượt / 2 giây'],['Tầm bắn','21 ô · xoay 360°'],['Điểm mù','Không thấy mục tiêu trong 6 ô'],['Nhắm bắn','Mục tiêu xa nhất; đạn xuyên qua các mục tiêu khác để tới đích']],
  hd5:k=>[['Tụ lực','6 giây mỗi phát'],['Sát thương đạn',nf(500*k)],['Đạn','Đạn xanh 1 ô vào mục tiêu gần nhất'],['Tầm bắn','12 ô · xoay 360°'],['Vệt băng','Nổ lan 4 ô, tồn tại 4 giây, làm chậm 30%']],
  hd6:k=>[['Tụ lực','5 giây mỗi phát'],['Tia điện đầu',nf(500*k)+' sát thương'],['Nảy sang','Tối đa 6 mục tiêu gần bên, mỗi mục tiêu '+nf(200*k)],['Tầm bắn','12 ô · xoay 360°']],
  hd7:k=>[['Viên giữa',nf(280*k)+' sát thương'],['Hai viên bên',nf(250*k)+' sát thương (nhỏ hơn 30%)'],['Số viên mỗi lượt','3 (bắn cùng lúc)'],['Tốc độ bắn','4 lượt/giây'],['Tầm bắn','14 ô · xoay 360°']]};
const NOTE={
  hd3:'Tám nòng thay nhau bắn liên tiếp 12 viên mỗi giây vào mục tiêu trong 12 ô, mỗi viên 120 sát thương.',
  hd4:'Bắn 3 viên cùng lúc vào mục tiêu xa nhất trong 21 ô (không thấy mục tiêu trong 6 ô), mỗi viên 300 sát thương, xuyên qua mục tiêu khác để tới đích, 1 phát mỗi 2 giây.',
  hd5:'Tụ lực 6 giây rồi bắn đạn xanh 1 ô vào mục tiêu gần nhất trong 12 ô, 500 sát thương; nổ lan 4 ô tạo vệt băng 4 giây làm chậm 30%.',
  hd6:'Tụ lực 5 giây rồi phóng tia điện vào mục tiêu trong 12 ô: 500 sát thương, nảy sang tối đa 6 mục tiêu gần bên, mỗi mục tiêu 200 sát thương.',
  hd7:'Bắn 3 viên cùng lúc: viên giữa 280 sát thương, hai viên bên nhỏ hơn 30% gây 250 sát thương, 4 lượt mỗi giây, tầm 14 ô.'};
Object.keys(NEW).forEach(t=>{const u=typeof UPD!=='undefined'&&UPD[t];if(u&&u.st){const o=u.st;u.st=l=>[o(l)[0]].concat(ROWS[t](1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b)b.note=NOTE[t]});
/* ---------- vệt băng sau khi đạn xanh nổ ---------- */
function after(G,p){const c=p.cfg;if(!c.ice)return;const W=mapW(G),H=mapH(G);if(p.x<-3||p.y<-3||p.x>W+3||p.y>H+3)return;
  (G.c30i=G.c30i||[]).push({x:p.x,y:p.y,R:c.ice.R,t:0,max:c.ice.life,slow:c.ice.slow,seed:Math.random()*99});G.fx.push({x:p.x,y:p.y,r:c.ice.R,t:.45,max:.45,col:'#bfeaff'})}
function iceStep(G,dt){const L=G.c30i;if(L&&L.length){L.forEach(z=>{z.t+=dt;enemies(G).forEach(e=>{if(Math.hypot(e.x-z.x,e.y-z.y)<=z.R+(e.size||2)*.3){const k=(e.slowT>0?(e.slowK==null?1:e.slowK):1);e.slowK=Math.min(k,1-z.slow);e.slowT=Math.max(e.slowT||0,.15);e.c30ic=G.t+.15}})});G.c30i=L.filter(z=>z.t<z.max)}
  const Z=G.c30z;if(Z&&Z.length){Z.forEach(z=>z.t+=dt);G.c30z=Z.filter(z=>z.t<z.max)}}
function wrapStep(G,inner){const mine=(G&&G.c22p||[]).filter(p=>p.cfg&&p.cfg.ice&&!p.dead);const r=inner();if(G)mine.forEach(p=>{if(p.dead&&!p.c30d){p.c30d=1;try{after(G,p)}catch(e){console.error(e)}}});return r}
{const _S=dfStep;dfStep=function(dt){const G=DG,a=arguments,t=this;const r=wrapStep(G,()=>_S.apply(t,a));try{if(DG&&DG.bl&&!DG.done)iceStep(DG,dt)}catch(e){console.error(e)}return r}}
/* ---------- vẽ ---------- */
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
function draw(q,G,X,Y,s,T){if(!G)return;
  (G.c30i||[]).forEach(z=>{const x=X(z.x),y=Y(z.y),R=z.R*s,al=Math.max(0,Math.min(1,z.t/.2,(z.max-z.t)/.5));q.save();q.globalAlpha=al;
    const g=q.createRadialGradient(x,y,R*.1,x,y,R);g.addColorStop(0,'rgba(220,245,255,.45)');g.addColorStop(.7,'rgba(140,210,255,.25)');g.addColorStop(1,'rgba(120,200,255,.05)');q.fillStyle=g;q.beginPath();q.arc(x,y,R,0,7);q.fill();
    q.strokeStyle='rgba(210,240,255,.8)';q.lineWidth=2;q.beginPath();q.arc(x,y,R,0,7);q.stroke();q.lineWidth=1.4;q.strokeStyle='rgba(235,250,255,.7)';
    for(let i=0;i<12;i++){const an=i/12*Math.PI*2+z.seed,r1=R*(.25+.5*hz(z.seed+i)),cx=x+Math.cos(an)*r1,cy=y+Math.sin(an)*r1,m=s*(.25+.2*hz(i*3+z.seed));for(let j=0;j<3;j++){const b=j*Math.PI/3;q.beginPath();q.moveTo(cx-Math.cos(b)*m,cy-Math.sin(b)*m);q.lineTo(cx+Math.cos(b)*m,cy+Math.sin(b)*m);q.stroke()}}
    q.restore()});
  (G.c30z||[]).forEach(z=>{const k=z.t/z.max;q.save();q.globalAlpha=Math.max(0,1-k);q.globalCompositeOperation='lighter';q.lineCap='round';q.lineJoin='round';
    for(let w=0;w<2;w++){q.strokeStyle=w?'#ffffff':'#6fd0ff';q.lineWidth=w?1.6:5;q.shadowColor='#5fc8ff';q.shadowBlur=w?0:14;q.beginPath();
      for(let i=0;i<z.pts.length-1;i++){const a=z.pts[i],b=z.pts[i+1],x1=X(a.x),y1=Y(a.y),x2=X(b.x),y2=Y(b.y),L=Math.hypot(x2-x1,y2-y1),nx=-(y2-y1)/(L||1),ny=(x2-x1)/(L||1),seg=Math.max(3,Math.round(L/14));
        if(i===0)q.moveTo(x1,y1);for(let j=1;j<=seg;j++){const u=j/seg,o=j===seg?0:(hz(z.seed+i*31+j+Math.floor(T*30))-.5)*Math.min(18,L*.18);q.lineTo(x1+(x2-x1)*u+nx*o,y1+(y2-y1)*u+ny*o)}}
      q.stroke()}
    q.restore()});
  (G.c22p||[]).forEach(p=>{if(p.dead||!p.cfg||p.cfg.c30!=='rail')return;const x=X(p.x),y=Y(p.y),a=Math.atan2(p.ty-p.y0,p.tx-p.x0),r=Math.max(2.5,s*.16);q.save();q.translate(x,y);q.rotate(a);q.globalCompositeOperation='lighter';
    const L=s*2.4,g=q.createLinearGradient(-L,0,0,0);g.addColorStop(0,'rgba(120,210,255,0)');g.addColorStop(1,'rgba(160,230,255,.9)');q.fillStyle=g;q.beginPath();q.ellipse(-L*.5,0,L*.5,r*.7,0,0,7);q.fill();
    q.fillStyle='#ffffff';q.shadowColor='#7fd8ff';q.shadowBlur=10;q.beginPath();q.ellipse(0,0,r*1.6,r*.7,0,0,7);q.fill();q.restore()});
  (G.en||[]).forEach(e=>{if(e.dead||!(e.c30ic>G.t))return;const x=X(e.x),y=Y(e.y),r=(e.size||2)*s*.48;q.save();q.globalAlpha=.55;q.strokeStyle='#d8f4ff';q.lineWidth=2;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()});
  (G.bl||[]).forEach(b=>{if(b.hp<=0||!b.nb||b.nb.c22!=='hd4')return;const T2=b.c22tg;if(!T2||T2.dead)return;q.save();q.globalAlpha=.25;q.strokeStyle='#9fe0ff';q.setLineDash([4,8]);q.lineWidth=1.2;q.beginPath();q.moveTo(X(b.x),Y(b.y));q.lineTo(X(T2.x),Y(T2.y));q.stroke();q.restore()})}
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{draw(q,G,X,Y,s,T==null?(G&&G.t)||0:T)}catch(e){console.error(e)}}}
/* ---------- mô phỏng xem trước ---------- */
(function(){const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;const {mkBld,mkEn}=H;
  const txt=(q,s,x,y,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
  const mkE=(G,c,x,y)=>{const e=mkEn(G,c,x,y,1e9);e.noRev=true;return e};
  function track(c,G,e){if(e._h==null)e._h=e.hp;if(e.hp<e._h)(c.log=c.log||[]).push([G.t,(e._h-e.hp)*20]);e._h=e.hp;if(c.log)c.log=c.log.filter(x=>G.t-x[0]<(c.win||3))}
  const dps=(c,G)=>{const L=c.log||[];if(!L.length)return 0;const w=c.win||3,t0=Math.max(.5,Math.min(w,G.t));return L.reduce((a,x)=>a+x[1],0)/t0};
  const POS={hd3:[[7.5,3]],hd7:[[7.5,2.8]],hd4:[[7.5,.9],[6.2,4.6],[8.8,4.4]],hd5:[[7.5,2.8],[5.4,3.4],[9.6,3.2]],hd6:[[7.5,2.6],[5.3,3.3],[9.7,3.1],[4,1.6],[11,1.8],[6.2,1],[8.8,.9]]};
  Object.keys(NEW).forEach(t=>{const bn=((BLD.find(b=>b.t===t)||{}).n||t).toUpperCase();
    SC[t]={title:bn,note:NOTE[t],
      init(G,c){G.c22sim=1;G.pvp=false;const d=BLD.find(x=>x.t===t)||{h:4},by=Math.min(7.5,9.8-d.h/2);c.b=mkBld(G,t,7.5,by,{lv:c.lv});c.ph=0;c.log=[];c.win=(t==='hd5'||t==='hd6')?8:3;c.es=POS[t].map(p=>mkE(G,c,p[0],p[1]))},
      step(G,dt,c){try{c.ph+=dt;G.dtc=dt;wrapStep(G,()=>C22.pre(G,dt));iceStep(G,dt);c.b.hp=c.b.max;
        if(t==='hd3'||t==='hd7'){c.es[0].x=7.5+3*Math.sin(c.ph*.6);c.es[0].y=2.8+.5*Math.sin(c.ph)}
        window.c22Tick(c.b,dt,G,1);c.es.forEach(e=>track(c,G,e))}catch(e){console.error(e)}},
      over(q,G,c,X,Y,s){try{const b=c.b;let l2='';if(TUR[t].charge&&b.c22per)l2=' · tụ lực '+Math.round(100*Math.max(0,Math.min(1,1-b.c22cd/b.c22per)))+'%';
        txt(q,'Gây ≈ '+nf(dps(c,G))+' sát thương/giây (tổng)'+l2,X(7.5),Y(9.9),'#ffe08a',11);
        if(t==='hd4'){txt(q,'Mục tiêu xa nhất',X(c.es[0].x),Y(c.es[0].y)+c.es[0].size*s*.8,'#bfeaff',10);txt(q,'Trong 6 ô: không thấy',X(7.5),Y(5.6),'#ffb0a0',10)}}catch(e){}}}})})();
window.C30={NEW,after,iceStep};
})();
