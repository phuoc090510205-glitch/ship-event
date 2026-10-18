/* ===== c20: Bẫy · Quấy nhiễu (6 công trình điều chỉnh: tj5 – tj10) ===== */
(function(){
const LV=b=>1+.1*(((b&&b.lv)||1)-1);
const PB=G=>G.pb||{dm:1,cdm:1,rm:1};
const RR=(q,x,y,w,h,r)=>{if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h)};
const hz=i=>{const v=Math.sin(i*91.7+13.1)*43758.5453;return v-Math.floor(v)};
const fmt=x=>String(Math.round(x*100)/100).replace('.',',');
const nf=x=>Math.round(x).toLocaleString('vi-VN');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const C20T=['tj5','tj6','tj7','tj8','tj9','tj10'];
const CFG={
  /* tj5: sóng nhiễu tím — 100 sát thương, 18 ô, 50% sợ hãi 2 giây, 10% choáng 0,75 giây */
  tj5:{R:18,every:30,dmg:100/20,fear:2,pf:.5,stun:.75,ps:.1,wave:1.3},
  /* tj6: gọi bản sao tàu đồng minh bất kỳ mỗi 30 giây */
  tj6:{every:30,cap:5,drop:.8},
  /* tj7: lồng 4×4, 400 sát thương, nhốt 5 giây, hồi 30 giây, tối đa 10 lồng */
  tj7:{max:10,size:4,dmg:400/20,dur:5,cd:30},
  /* tj8: sóng đỏ bán kính 12 ô, giải thiêu đốt, +200 giáp, hồi 60 giây */
  tj8:{R:12,sh:200,dur:10,cd:60,wave:.7},
  /* tj9: 2000 máu, mỗi 400 sát thương nhận vào phát sóng 5 ô, 10% hiệu ứng ngẫu nhiên */
  tj9:{hp:2000,thr:400,R:5,p:.1,stun:.75,slow:3,slowK:.6,fear:2,sil:3,burn:3,burnD:40/20,tox:4,toxD:30/20,wave:.9,gap:.35},
  /* tj10: sóng xanh 10 ô, 200 sát thương, đẩy lùi 1 ô cho mỗi đồng minh tử vong */
  tj10:{R:10,dmg:200/20,kb:1,wave:.8,gap:.3}};
window.c20Has=t=>C20T.includes(t);
{const o=window.c16Has;window.c16Has=t=>(o?o(t):false)||C20T.includes(t)}
/* gắn cờ, bỏ hiệu ứng aura / bẫy cũ (do c20 điều khiển) */
C20T.forEach(t=>{const f=NBF[t];if(f){f.c20=t;['slow','jam','vul','dot','pulse','tr','br','dmg','rearm','stun'].forEach(k=>{delete f[k]});delete f.e;f.r=({tj5:18,tj6:0,tj7:2,tj8:12,tj9:5,tj10:10})[t]}});
/* đổi tên */
const REN={tj6:'Tháp Gọi Tàu'};
Object.keys(REN).forEach(t=>{const b=BLD.find(x=>x.t===t);if(b)b.n=REN[t];if(UPD[t])UPD[t].n=REN[t]});
/* máu */
HPB.tj9=CFG.tj9.hp;
const upd=(t,rows,note)=>{const u=UPD[t];if(u){const o=u.st;u.st=l=>[o(l)[0]].concat(rows(l,1+.1*(l-1)))}const b=BLD.find(x=>x.t===t);if(b&&note)b.note=note};
upd('tj5',(l,k)=>[['Chu kỳ','Ngay khi bắt đầu giao tranh, sau đó mỗi 30 giây'],['Phạm vi','18 ô'],['Sát thương mỗi đợt sóng',nf(100*k)],['Sợ hãi','50% · 2 giây'],['Choáng','10% · 0,75 giây']],
  'Mỗi 30 giây (và ngay khi vào trận) phát luồng sóng nhiễu tím gây 100 sát thương lên mọi mục tiêu trong 18 ô; mỗi mục tiêu có 50% bị sợ hãi 2 giây và 10% bị choáng 0,75 giây.');
upd('tj6',(l,k)=>[['Chu kỳ','Mỗi 30 giây'],['Hiệu ứng','Gọi 1 bản sao của tàu đồng minh bất kỳ xuống chiến trường'],['Bản sao','Đủ máu, vũ khí như tàu gốc · tối đa 5 bản sao cùng lúc']],
  'Cứ mỗi 30 giây gọi một bản sao của tàu đồng minh bất kỳ xuống chiến trường để chiến đấu.');
upd('tj7',(l,k)=>[['Lồng laser','4×4 ô · dựng trước ở Trụ sở, tối đa 10 vị trí'],['Trong trận','Tàng hình với kẻ thù'],['Khi địch dẫm lên','Chịu '+nf(400*k)+' sát thương, bị nhốt 5 giây'],['Hồi chiêu mỗi lồng','30 giây']],
  'Dựng trước tối đa 10 lồng laser 4×4 ô ở Trụ sở. Vào trận lưới tàng hình; kẻ thù dẫm lên chịu 400 sát thương và bị nhốt 5 giây, mỗi lồng hồi chiêu 30 giây.');
upd('tj8',(l,k)=>[['Kích hoạt','Khi địch dùng kỹ năng thiên thạch từ trên trời'],['Sóng đỏ','Bán kính 12 ô quanh cột'],['Hiệu ứng','Giải toàn bộ thiêu đốt · +'+nf(200*k)+' giáp cho đồng minh và công trình'],['Hồi chiêu','60 giây']],
  'Ngay khi nhận tín hiệu thiên thạch của kẻ thù, phát sóng đỏ 12 ô quanh cột: giải thiêu đốt và ban 200 giáp cho đồng minh, công trình. Hồi chiêu 60 giây.');
upd('tj9',(l,k)=>[['Phản ứng','Mỗi 400 sát thương nhận vào phát một luồng sóng 5 ô'],['Hiệu ứng lên mục tiêu','10% mỗi mục tiêu chịu 1 hiệu ứng ngẫu nhiên: choáng · làm chậm · sợ hãi · cấm kỹ năng · cháy · ngộ độc']],
  'Hộp bẫy 2000 máu: mỗi lần chịu 400 sát thương sẽ phát luồng sóng 5 ô, mỗi mục tiêu có 10% chịu một hiệu ứng khống chế hoặc cháy, ngộ độc, sợ hãi...');
upd('tj10',(l,k)=>[['Kích hoạt','Mỗi khi 1 đồng minh trong phạm vi tử vong'],['Sóng xanh','Rộng tối đa 10 ô'],['Sát thương',nf(200*k)],['Đẩy lùi','Nhẹ 1 ô']],
  'Mỗi khi có một đồng minh tử vong trong phạm vi, phóng sóng xanh rộng tối đa 10 ô gây 200 sát thương và đẩy lùi kẻ địch nhẹ 1 ô.');

/* ---------- tiện ích ---------- */
const ships=G=>{const L=[];if(G.pl&&!G.pl.dead)L.push(G.pl);(G.al||[]).forEach(a=>{if(!a.dead)L.push(a)});return L};
const enemies=G=>G.en.filter(e=>!e.dead&&e.spawn<=G.t);
const shVal=u=>{let v=0;const c=u.cs;if(c&&c.abs&&c.abs.t>0&&c.abs.v>0)v=c.abs.v;if(u.shd&&u.shd.t>0&&u.shd.v>0)v=Math.max(v,u.shd.v);return v};
const shSet=(G,u,v,dur)=>{if(u===G.pl&&!u.cs)u.cs={};if(u.cs){u.cs.abs={v,t:dur,max:v};u.cs.circ=true;u.cs.hexc=false}else u.shd={v,t:9999,max:v,c17:G.t+dur}};
const ping=(G,x,y,r,col,t)=>G.fx.push({x,y,r,t:t||.45,max:t||.45,col});
const beam=(G,x1,y1,x2,y2,col,w,t)=>G.bm.push({x1,y1,x2,y2,t:t||.3,col,w:w||3});
const boomFx=(G,x,y,r)=>G.fx.push({x,y,r,t:.6,max:.6,ex:1,rot:Math.random()*6.28});
const pop=(G,x,y,txt,col)=>{const L=G.c20pop=G.c20pop||[];if(L.length>40)L.shift();L.push({x,y,t:0,max:1.8,txt,col:col||'#ffe08a'})};
const dm=(b,G,d)=>d*LV(b)*(PB(G).dm||1);
const tk=(G,dt)=>dt/((G.c18rc||1)*((PB(G).cdm)||1));
/* khống chế (boss chỉ chịu 1/3) */
const ccT=(e,t)=>t*(e.boss?1/3:1);
const stunE=(e,t)=>{e.stun=Math.max(e.stun||0,ccT(e,t))};
const rootE=(e,t)=>{if(!(e.c20root>0)||e.c20rx==null){e.c20rx=e.x;e.c20ry=e.y}e.c20root=Math.max(e.c20root||0,t)};
const moveE=(G,e,x,y)=>{const W=G.wd?G.wd.Wd:99,H=G.wd?G.wd.Hd:99;e.x=Math.max(.5,Math.min(W-.5,x));e.y=Math.max(.5,Math.min(H-.5,y));if(e.c20rx!=null){e.c20rx=e.x;e.c20ry=e.y}};
const fearE=(e,t,fx,fy)=>{const d=ccT(e,t);e.fearT=Math.max(e.fearT||0,d);e.fearX=fx;e.fearY=fy;e.noFire=Math.max(e.noFire||0,d)};
const effPush=(G,o)=>{(G.c20e=G.c20e||[]).push(o);return o};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0,t=a[i];a[i]=a[j];a[j]=t}return a};
/* sóng lan: mục tiêu nào được vòng sóng quét tới thì chịu hiệu ứng đúng một lần */
function waveFx(G,o){const w={k:'wave',sty:o.sty,x:o.x,y:o.y,R:o.R,r:0,t:0,max:o.dur+.35,dur:o.dur,col:o.col,seen:new Set(),b:o.b||null};
  w.u=function(G,dt,w){const f=Math.min(1,w.t/w.dur);w.r=w.R*(1-Math.pow(1-f,1.6));
    (o.get(G)||[]).forEach(u=>{if(w.seen.has(u))return;if(Math.hypot(u.x-w.x,u.y-w.y)<=w.r+(u.size||u.w||2)*.3){w.seen.add(u);o.hit(u,w)}});return false};
  return effPush(G,w)}

/* ---------- Tháp Phát Sóng Nhiễu (tj5): sóng tím mỗi 30 giây, 100 sát thương, 18 ô, 50% sợ hãi, 10% choáng ---------- */
function tj5(b,dt,G){const C=CFG.tj5,R=C.R*(PB(G).rm||1);
  if(b.c20T==null){if(!enemies(G).length)return;b.c20T=0}
  b.c20T-=tk(G,dt);if(b.c20T>0)return;b.c20T+=C.every;if(b.c20T<=0)b.c20T=C.every;
  b.c20pt=G.t;b.c20pn=(b.c20pn||0)+1;b.c20ph=0;b.c20pf=0;b.c20ps=0;const d=dm(b,G,C.dmg);b.c20pd=d*20;
  waveFx(G,{sty:'purple',x:b.x,y:b.y,R,dur:C.wave,col:'#b46cff',b,get:G=>enemies(G),
    hit:e=>{dfDmgS(e,d,false);b.c20ph++;ping(G,e.x,e.y,(e.size||2)*.7,'#c58bff',.35);if(G.c20sim)pop(G,e.x,e.y-(e.size||2)*.5,'−'+nf(d*20),'#e0b8ff');
      if(Math.random()<C.pf){fearE(e,C.fear,b.x,b.y);b.c20pf++;e.c20fr=ccT(e,C.fear);pop(G,e.x,e.y-(e.size||2)*.7,'Sợ hãi','#e0b8ff')}
      if(Math.random()<C.ps){stunE(e,C.stun);b.c20ps++;pop(G,e.x,e.y-(e.size||2)*.95,'Choáng','#fff2a8')}}});
  ping(G,b.x,b.y,2.8,'#c58bff',.55);ping(G,b.x,b.y,1.6,'#ffffff',.4)}
/* ---------- Tháp Gọi Tàu (tj6): mỗi 30 giây thả 1 bản sao của tàu đồng minh bất kỳ ---------- */
function cloneOf(G,src,x,y){
  const a={team:'p',ally:1,sh:src.sh,x,y,ang:-Math.PI/2,hp:src.max,max:src.max,sp:src.sp0||src.sp||3,size:src.size||2.2,sc:src.sc,
    ws:(src.ws||[]).map(w=>Object.assign({},w,{t:Math.random()*Math.max(.2,w.cd||1)})),tx:x,ty:y,sx:x,sy:y,boss:false,dm:src.dm||1,hit:0,dead:false,spawn:0,red:src.red||0,reg:src.reg||0,dly:src.dly||99,lh:-99,acc:0,sp0:src.sp0||src.sp||3,
    inf:1,nrg:0,nrgMax:0,nrgGen:0,engDrain:0,eOn:true,mdrain:0,mOn:true,sk:[],spT:{},cs:null,hl:null,fr:null,bd:null,shd:null,rb:null,absb:null,stl:0,fd:0,
    name:(src.name||'Tàu')+' (bản sao)',c20cl:1};
  (G.al=G.al||[]).push(a);return a}
function summon(b,G){const C=CFG.tj6;
  const alive=(G.al||[]).filter(a=>a.c20cl&&!a.dead).length+(G.c20e||[]).filter(o=>o.k==='drop'&&!o.dead).length;
  if(alive>=C.cap){pop(G,b.x,b.y-b.h*.5-1,'Đã đủ '+C.cap+' bản sao','#9fc8ff');return false}
  const pool=ships(G).filter(u=>!(u.ghost||u.c20cl||u.c18boss||u.c17w)&&u.sh&&u.sh.img);
  if(!pool.length)return false;
  const src=pool[(Math.random()*pool.length)|0],W=G.wd?G.wd.Wd:99,H=G.wd?G.wd.Hd:99;
  const an=Math.random()*Math.PI*2,rr=2.6+Math.random()*1.8,x=Math.max(1,Math.min(W-1,b.x+Math.cos(an)*rr)),y=Math.max(1,Math.min(H-1,b.y+Math.sin(an)*rr));
  b.c20fl=G.t;
  effPush(G,{k:'drop',x,y,src,b,t:0,max:C.drop,u:()=>false,
    end:(G,o)=>{const a=cloneOf(G,src,x,y);b.c20n=(b.c20n||0)+1;b.c20last=src.name||'tàu';
      ping(G,x,y,2.4,'#7fe3ff',.6);ping(G,x,y,1.3,'#ffffff',.45);boomFx(G,x,y,1.4);pop(G,x,y-(a.size||2)*.8,'Bản sao: '+(src.name||'tàu'),'#9fe8ff')}});
  ping(G,b.x,b.y,2.2,'#7fe3ff',.5);pop(G,b.x,b.y-b.h*.5-1,'Gọi tàu!','#9fe8ff');return true}
function tj6(b,dt,G){const C=CFG.tj6;if(b.c20T==null)b.c20T=C.every;
  b.c20T-=tk(G,dt);if(b.c20T>0)return;b.c20T+=C.every;if(b.c20T<=0)b.c20T=C.every;summon(b,G)}
/* ---------- Lưới Bẫy Laser Tím (tj7): lồng 4×4 dựng trước ở Trụ sở, tàng hình, 400 sát thương, nhốt 5 giây ---------- */
function cagesOf(G,b){if(b.c20cg)return b.c20cg;let L=[];
  if(G.c20cgSrc)L=G.c20cgSrc;
  else if(!G.c20sim){try{const T=(S.base&&S.base.trp)||[],ox=(G.wd&&G.wd.ox)||0,oy=(G.wd&&G.wd.oy)||0;L=T.slice(0,CFG.tj7.max).map(p=>[p[0]-ox,p[1]-oy])}catch(e){}}
  b.c20cg=L.map(p=>({x:p[0],y:p[1],cd:0,at:null}));return b.c20cg}
function cageTrig(b,G,cg,T){const C=CFG.tj7,d=dm(b,G,C.dmg),h=C.size/2;cg.cd=C.cd;cg.at=G.t;b.c20n=(b.c20n||0)+T.length;b.c20fl=G.t;
  T.forEach(e=>{const m=Math.min(h-.3,(e.size||2)*.3);moveE(G,e,Math.max(cg.x-h+m,Math.min(cg.x+h-m,e.x)),Math.max(cg.y-h+m,Math.min(cg.y+h-m,e.y)));
    dfDmgS(e,d,false);e.c20cage=1;stunE(e,C.dur);rootE(e,ccT(e,C.dur));ping(G,e.x,e.y,(e.size||2)*.9,'#c58bff',.45)});
  const o={k:'cage',cg,es:T.slice(),t:0,max:C.dur,b,seed:Math.random()*10};
  o.u=function(G,dt,o){o.es=o.es.filter(e=>{if(e.dead){e.c20cage=0;return false}if(o.t>=ccT(e,C.dur)){e.c20cage=0;return false}
      e.stun=Math.max(e.stun||0,.3);rootE(e,.3);return true});return false};
  o.end=function(){o.es.forEach(e=>{e.c20cage=0})};
  effPush(G,o);ping(G,cg.x,cg.y,C.size*.75,'#b46cff',.55);boomFx(G,cg.x,cg.y,1.6);pop(G,cg.x,cg.y-h-.2,'Sập bẫy! −'+nf(d*20),'#e0b8ff')}
function tj7(b,dt,G){const C=CFG.tj7,L=cagesOf(G,b),h=C.size/2;
  L.forEach(cg=>{cg.cd=Math.max(0,cg.cd-tk(G,dt));if(cg.cd>0)return;
    const T=enemies(G).filter(e=>!e.c20cage&&Math.abs(e.x-cg.x)<=h+(e.size||2)*.1&&Math.abs(e.y-cg.y)<=h+(e.size||2)*.1);
    if(T.length)cageTrig(b,G,cg,T)})}
/* ---------- Cột Phát Sóng Báo Động (tj8): thiên thạch của địch → sóng đỏ 12 ô, giải thiêu đốt, +200 giáp ---------- */
const BURNK=['burnT','burnK','burnD','fbT','fbD','c20burn','c19burn'];
function cleanse(u){let had=false;BURNK.forEach(k=>{if(u[k]){had=true;u[k]=(k==='c20burn'||k==='c19burn')?null:0}});return had}
function alarm(b,G){const C=CFG.tj8,v=C.sh*LV(b),R=C.R*(PB(G).rm||1);b.c20cd=C.cd;b.c20fl=G.t;b.c20an=(b.c20an||0)+1;b.c20n=0;b.c20cl=0;
  waveFx(G,{sty:'red',x:b.x,y:b.y,R,dur:C.wave,col:'#ff4a4a',b,
    get:G=>ships(G).concat(G.bl.filter(o=>o.hp>0&&o.t!=='mine'&&!o.aux&&!o.u&&o!==b)),
    hit:u=>{if(cleanse(u))b.c20cl++;
      if(u.sh){if(shVal(u)<v){shSet(G,u,v,C.dur);b.c20n++}ping(G,u.x,u.y,(u.size||2)*.9,'#ff9a9a',.5)}
      else{const bv=v/DFB,ex=(u.shd&&u.shd.t>0&&u.shd.v>0)?u.shd:null;if(!(ex&&ex.v>=bv)){u.shd={v:bv,t:C.dur,max:bv};u.shdC=1;u.shdAt=G.t;b.c20n++}}}});
  ping(G,b.x,b.y,2.6,'#ff6a6a',.55);ping(G,b.x,b.y,1.4,'#ffffff',.4);pop(G,b.x,b.y-b.h*.5-1,'Báo động! +'+nf(v)+' giáp','#ffb0b0')}
function tj8(b,dt,G){b.c20cd=Math.max(0,(b.c20cd||0)-tk(G,dt))}
/* tín hiệu thiên thạch từ kỹ năng của kẻ thù: boss ngày, đạn gắn cờ thiên thạch, kỹ năng thuyền trưởng của địch */
window.c20Meteor=function(G,x,y,r,src){if(!G||!G.bl||G.done)return false;let n=0;G.c20sig=(G.c20sig||0)+1;
  G.bl.forEach(b=>{if(b.hp<=0||!b.nb||b.nb.c20!=='tj8'||b.c20cd>0)return;alarm(b,G);n++});return n>0};
const METEOR=/Thiên Thạch|Sao Băng|Sao Chổi|Vệ Tinh/;
window.c20BossCast=function(G,e,name){if(!G||!METEOR.test(String(name||'')))return false;const P=G.pl||{};return window.c20Meteor(G,P.x,P.y,2.5,e)};
window.c20Cast=function(G,P,k,sc){if(!G||!P||!k||!k.cap)return;const en=P.team==='e'||(G.en||[]).includes(P)||(G.eu||[]).includes(P);if(!en)return;
  if(METEOR.test(String(k.cap[0]||'')))window.c20Meteor(G,P.x,P.y,2.5,P)};
/* ---------- Hộp Bẫy Chấn Động (tj9): 2000 máu, mỗi 400 sát thương nhận vào → sóng 5 ô, 10% hiệu ứng ngẫu nhiên ---------- */
const FX9=['stun','slow','fear','sil','burn','tox'];
const FX9N={stun:'Choáng',slow:'Làm chậm',fear:'Sợ hãi',sil:'Cấm kỹ năng',burn:'Cháy',tox:'Ngộ độc'};
function fx9(b,G,e,kind){const C=CFG.tj9,d=dm(b,G,1);
  switch(kind){
  case'stun':stunE(e,C.stun);break;
  case'slow':{const t=ccT(e,C.slow);e.slowT=Math.max(e.slowT||0,t);e.slowK=Math.min(e.slowK||1,C.slowK);e.c20sl=t;break}
  case'fear':fearE(e,C.fear,b.x,b.y);e.c20fr=ccT(e,C.fear);break;
  case'sil':{const t=ccT(e,C.sil);e.silT=Math.max(e.silT||0,t);e.c20si=t;break}
  case'burn':e.c20burn={t:C.burn,d:C.burnD*d};break;
  case'tox':e.c20tox={t:C.tox,d:C.toxD*d};break}
  pop(G,e.x,e.y-(e.size||2)*.8,FX9N[kind],kind==='burn'?'#ffb070':kind==='tox'?'#c8ff7a':'#ffe9a8')}
function quake(b,G){const C=CFG.tj9,R=C.R*(PB(G).rm||1);b.c20wn=(b.c20wn||0)+1;b.c20fl=G.t;b.c20hit=0;b.c20eff=0;
  waveFx(G,{sty:'quake',x:b.x,y:b.y,R,dur:C.wave,col:'#ffb24a',b,get:G=>enemies(G),
    hit:e=>{b.c20hit++;if(Math.random()<C.p){b.c20eff++;fx9(b,G,e,FX9[(Math.random()*FX9.length)|0])}}});
  ping(G,b.x,b.y,Math.max(b.w,b.h)*.9,'#ffc46a',.5)}
function tj9(b,dt,G){const C=CFG.tj9;
  if(b.c20h==null||b.c20ht==null||G.t-b.c20ht>.25)b.c20h=b.hp;b.c20ht=G.t;
  if(b.hp<b.c20h)b.c20acc=(b.c20acc||0)+(b.c20h-b.hp)*DFB;b.c20h=b.hp;
  b.c20q=b.c20q||0;while((b.c20acc||0)>=C.thr){b.c20acc-=C.thr;if(b.c20q<6)b.c20q++}
  if(b.c20q>=6)b.c20acc=0;
  if(b.c20q>0){b.c20gap=(b.c20gap||0)-dt;if(b.c20gap<=0){b.c20q--;b.c20gap=C.gap;quake(b,G)}}}
/* ---------- Trạm Nhiễu Loạn Diện Rộng (tj10): mỗi đồng minh tử vong trong phạm vi → sóng xanh 200 sát thương, đẩy lùi 1 ô ---------- */
function surge(b,G){const C=CFG.tj10,R=C.R*(PB(G).rm||1),d=dm(b,G,C.dmg);b.c20wn=(b.c20wn||0)+1;b.c20fl=G.t;b.c20hit=0;b.c20pd=d*20;
  waveFx(G,{sty:'blue',x:b.x,y:b.y,R,dur:C.wave,col:'#4aa8ff',b,get:G=>enemies(G),
    hit:e=>{dfDmgS(e,d,false);b.c20hit++;if(G.c20sim)pop(G,e.x,e.y-(e.size||2)*.5,'−'+nf(d*20),'#bfe0ff');const dx=e.x-b.x,dy=e.y-b.y,l=Math.hypot(dx,dy)||1,T=.25,k=C.kb*(e.boss?1/3:1);
      e.c20kb={vx:dx/l*k/T,vy:dy/l*k/T,t:T};ping(G,e.x,e.y,(e.size||2)*.7,'#8fd0ff',.35)}});
  ping(G,b.x,b.y,Math.max(b.w,b.h)*.8,'#6fbaff',.5);ping(G,b.x,b.y,1.6,'#ffffff',.35)}
function tj10(b,dt,G){const C=CFG.tj10,R=C.R*(PB(G).rm||1);
  const D=b.c20dd=b.c20dd||new Set(),first=!b.c20in;b.c20in=1;
  [G.pl].concat(G.al||[]).forEach(u=>{if(!u||u.ghost||u.c18boss)return;
    if(!u.dead){D.delete(u);return}
    if(D.has(u))return;D.add(u);if(first)return;
    if(dist(u,b)<=R+(u.size||2)*.3){b.c20q=Math.min(8,(b.c20q||0)+1);b.c20dn=(b.c20dn||0)+1;pop(G,u.x,u.y-(u.size||2)*.7,'Đồng minh gục','#9fd0ff')}});
  b.c20q=b.c20q||0;if(b.c20q>0){b.c20gap=(b.c20gap||0)-dt;if(b.c20gap<=0){b.c20q--;b.c20gap=C.gap;surge(b,G)}}}
/* ---------- bảng điều khiển theo loại ---------- */
const TICK={tj5,tj6,tj7,tj8,tj9,tj10};
window.c20Tick=function(b,dt,G){const c=b.nb&&b.nb.c20;if(!c)return false;const f=TICK[c];if(f)f(b,dt,G);return true};

/* ---------- hiệu ứng toàn trận (dùng chung cho trận thật và mô phỏng) ---------- */
function pre(G,dt){
  const E=G.c20e;if(E&&E.length){for(const o of E){o.t+=dt;let d=false;try{d=o.u?!!o.u(G,dt,o):false}catch(er){console.error(er);d=true}
      if(d||o.t>=o.max){o.dead=true;if(o.end)try{o.end(G,o)}catch(er){console.error(er)}}}
    G.c20e=E.filter(o=>!o.dead)}
  if(G.c20pop){G.c20pop.forEach(o=>o.t+=dt);G.c20pop=G.c20pop.filter(o=>o.t<o.max)}
  (G.pr||[]).forEach(p=>{if(p&&p.team==='e'&&!p.c20s&&(p.meteor||p.k==='meteor')){p.c20s=1;window.c20Meteor(G,p.x,p.y,p.spl||2,null)}});
  (G.en||[]).forEach(e=>{if(e.dead)return;
    if(e.c20kb){const k=e.c20kb,m=Math.min(dt,k.t);moveE(G,e,e.x+k.vx*m,e.y+k.vy*m);k.t-=dt;if(k.t<=0)e.c20kb=null}
    if(e.c20root>0){e.c20root-=dt;if(e.c20rx==null){e.c20rx=e.x;e.c20ry=e.y}else{e.x=e.c20rx;e.y=e.c20ry}if(e.c20root<=0){e.c20root=0;e.c20rx=null}}
    for(const k of ['c20burn','c20tox']){const o=e[k];if(!o||e.dead)continue;const s=Math.min(dt,o.t);o.t-=dt;if(s>0)dfDmgS(e,o.d*s,false);if(o.t<=0)e[k]=null}
    for(const k of ['c20fr','c20sl','c20si'])if(e[k]>0)e[k]-=dt});}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.bl&&!G.done&&G.en)pre(G,dt)}catch(e){console.error(e)}return r}}

/* ---------- Trụ sở: đặt lồng laser của Lưới Bẫy Laser Tím (tối đa 10 vị trí, 4×4 ô) ---------- */
(function(){
  const TJ='tj7';
  const isG=b=>!!b&&b.t===TJ;
  const trp=()=>{const B=S.base=S.base||{};if(!Array.isArray(B.trp))B.trp=[];return B.trp};
  const snap=(x,y)=>{const R=bReg(),h=CFG.tj7.size/2;x=Math.round(x);y=Math.round(y);return [Math.max(R.x0+h,Math.min(R.x1-h,x)),Math.max(R.y0+h,Math.min(R.y1-h,y))]};
  if(!document.getElementById('c20cagcss')){const st=document.createElement('style');st.id='c20cagcss';
    st.textContent='.c20cg{position:absolute;z-index:5;pointer-events:none;box-sizing:border-box;border:2px dashed rgba(215,170,255,.85);background-color:rgba(150,70,255,.2);background-image:linear-gradient(rgba(215,170,255,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(215,170,255,.28) 1px,transparent 1px);background-size:25% 25%;border-radius:6px;color:#fff;font:700 11px sans-serif;display:flex;align-items:center;justify-content:center;text-shadow:0 1px 2px #000;box-shadow:inset 0 0 14px rgba(170,90,255,.45)}.c20cg.on{border-style:solid;background-color:rgba(170,100,255,.32);box-shadow:0 0 12px rgba(190,120,255,.6),inset 0 0 14px rgba(170,90,255,.5)}';
    document.head.appendChild(st)}
  window.c20BaseUI=function(sel){
    const brd=document.getElementById('bboard');if(!brd)return;
    let btn=document.getElementById('bcag'),clr=document.getElementById('bcax');
    const rot=document.getElementById('brot');
    if(!btn&&rot){btn=document.createElement('button');btn.id='bcag';btn.className='brs';btn.style.cssText='background:#3a1670;border-color:#7a3be0';rot.insertAdjacentElement('afterend',btn);
      btn.onclick=()=>{const b=BLD.find(x=>x.id===bState.sel);if(!isG(b))return;bState.cag=bState.cag?0:1;bRender()}}
    if(!clr&&btn){clr=document.createElement('button');clr.id='bcax';clr.className='brs';clr.style.cssText='background:#5a1420;border-color:#c43a52';btn.insertAdjacentElement('afterend',clr);
      clr.onclick=()=>{trp().length=0;save();bRender();try{toast('Đã xóa hết lồng laser')}catch(er){}}}
    if(!isG(sel))bState.cag=0;
    const n=trp().length,on=!!bState.cag;
    if(btn){btn.style.display=isG(sel)?'':'none';btn.textContent=on?'Xong':'Đặt lồng laser ('+n+'/'+CFG.tj7.max+')'}
    if(clr){clr.style.display=(isG(sel)&&on&&n)?'':'none';clr.textContent='Xóa hết lồng'}
    const b=BLD.find(x=>x.t===TJ),P=bPos(),c='var(--c)',h=CFG.tj7.size;
    if(b&&P[b.id]&&bAvail().includes(b)&&(on||isG(sel))){let H='';
      trp().forEach((p,i)=>{H+=`<div class="c20cg ${on?'on':''}" style="left:calc(${c}*${p[0]-h/2});top:calc(${c}*${p[1]-h/2});width:calc(${c}*${h});height:calc(${c}*${h})">Lồng ${i+1}</div>`});
      if(H)brd.insertAdjacentHTML('beforeend',H)}
    if(on){const nt=document.getElementById('bnote');if(nt)nt.innerHTML='<b>Đặt lồng laser</b> · Bấm vào ô trên bản đồ để dựng lồng 4×4 (đã có '+n+'/'+CFG.tj7.max+'). Bấm vào lồng có sẵn để gỡ. Vào trận các lồng tàng hình với kẻ thù. Bấm “Xong” để kết thúc.'}
    else if(isG(sel)){const nt=document.getElementById('bnote');if(nt)nt.innerHTML+=' · <b>Lồng đã dựng: '+n+'/'+CFG.tj7.max+'</b> (bấm “Đặt lồng laser” để thêm/gỡ)'}};
  const brd=document.getElementById('bboard');
  if(brd)brd.addEventListener('pointerdown',e=>{
    if(!bState.cag)return;const b=BLD.find(x=>x.id===bState.sel);if(!isG(b)){bState.cag=0;return}
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const r=brd.getBoundingClientRect(),cs=bCell(),gx=(e.clientX-r.left)/cs,gy=(e.clientY-r.top)/cs,L=trp(),h=CFG.tj7.size/2;
    const i=L.findIndex(p=>Math.abs(gx-p[0])<h&&Math.abs(gy-p[1])<h);
    if(i>=0){L.splice(i,1);try{toast('Đã gỡ lồng')}catch(er){}}
    else if(L.length>=CFG.tj7.max){try{toast('Đã đủ '+CFG.tj7.max+' vị trí lồng — bấm vào một lồng để gỡ bớt')}catch(er){}}
    else{const k=snap(gx,gy);if(!L.some(p=>p[0]===k[0]&&p[1]===k[1]))L.push(k)}
    save();bRender()},true);
})();

/* ---------- vẽ ---------- */
const lab=(q,x,y,t,col,sz)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.7)';q.strokeText(t,x,y);q.fillStyle=col||'#fff';q.fillText(t,x,y);q.restore()};
const dashRing=(q,x,y,r,col,w)=>{q.save();q.setLineDash([4,6]);q.strokeStyle=col;q.lineWidth=w||1.4;q.beginPath();q.arc(x,y,r,0,7);q.stroke();q.restore()};
const WC={purple:'170,80,255',red:'255,70,70',quake:'255,170,60',blue:'70,160,255'};
function drawWave(q,o,X,Y,s,T){const px=X(o.x),py=Y(o.y),r=o.r*s,f=Math.max(0,1-o.t/o.max),al=Math.min(1,f*1.7),C=WC[o.sty]||'255,255,255';if(r<=1)return;
  q.save();q.globalCompositeOperation='lighter';
  const g=q.createRadialGradient(px,py,r*.45,px,py,r);g.addColorStop(0,'rgba('+C+',0)');g.addColorStop(1,'rgba('+C+','+(.26*al)+')');q.fillStyle=g;q.beginPath();q.arc(px,py,r,0,7);q.fill();
  for(let i=0;i<3;i++){const rr=r-i*s*(o.sty==='red'?1.1:.85);if(rr<=0)continue;q.strokeStyle='rgba('+C+','+((.9-i*.28)*al)+')';q.lineWidth=Math.max(1.2,(6-i*1.8)*(s/32));q.shadowColor='rgb('+C+')';q.shadowBlur=10;
    q.beginPath();const N=96;for(let k=0;k<=N;k++){const a=k/N*6.2832;let w=0;
      if(o.sty==='purple')w=.014*Math.sin(a*11+T*16+i*2)+.006*Math.sin(a*29-T*21);else if(o.sty==='blue')w=.01*Math.sin(a*17+T*30);else if(o.sty==='quake')w=.012*Math.sin(a*7+T*10);else w=.008*Math.sin(a*5+T*12);
      const x=px+Math.cos(a)*rr*(1+w),y=py+Math.sin(a)*rr*(1+w);k?q.lineTo(x,y):q.moveTo(x,y)}q.stroke()}
  q.shadowBlur=0;
  if(o.sty==='purple'){q.strokeStyle='rgba(225,190,255,'+(.7*al)+')';q.lineWidth=1.4;for(let i=0;i<46;i++){const a=hz(i*3+Math.floor(T*12))*6.2832,l=s*(.25+.55*hz(i*7+Math.floor(T*12)));q.beginPath();q.moveTo(px+Math.cos(a)*(r-l),py+Math.sin(a)*(r-l));q.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r);q.stroke()}}
  else if(o.sty==='blue'){q.strokeStyle='rgba(210,235,255,'+(.9*al)+')';q.lineWidth=1.8;for(let k=0;k<7;k++){const a0=hz(k+Math.floor(T*10))*6.2832;q.beginPath();for(let j=0;j<=8;j++){const a=a0+j*.045,rr=r+(hz(j*5+k+Math.floor(T*20))-.5)*s*.9;j?q.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr):q.moveTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr)}q.stroke()}}
  else if(o.sty==='quake'){q.strokeStyle='rgba(255,210,120,'+(.6*al)+')';q.lineWidth=1.6;for(let i=0;i<16;i++){const a=hz(i*3)*6.2832,a2=a+(hz(i*5)-.5)*.35,l0=r*.12,l1=r*(.55+.4*hz(i*7));q.beginPath();q.moveTo(px+Math.cos(a)*l0,py+Math.sin(a)*l0);q.lineTo(px+Math.cos(a2)*(l0+l1)*.5,py+Math.sin(a2)*(l0+l1)*.5);q.lineTo(px+Math.cos(a)*Math.min(r,l1),py+Math.sin(a)*Math.min(r,l1));q.stroke()}}
  else if(o.sty==='red'){q.strokeStyle='rgba(255,200,200,'+(.55*al*(.6+.4*Math.sin(T*30)))+')';q.lineWidth=2.5;q.beginPath();q.arc(px,py,r*.62,0,7);q.stroke()}
  q.restore()}
function drawE(q,o,G,X,Y,s,T){
  if(o.k==='wave')drawWave(q,o,X,Y,s,T);
  else if(o.k==='drop'){const px=X(o.x),py=Y(o.y),u=Math.min(1,o.t/o.max),f=u*u,im=o.src&&o.src.sh?dimg(o.src.sh.img):null,top=py-s*9*(1-f);
    q.save();q.globalCompositeOperation='lighter';
    const g=q.createLinearGradient(px,py-s*10,px,py);g.addColorStop(0,'rgba(120,230,255,0)');g.addColorStop(1,'rgba(120,230,255,'+(.16+.16*u)+')');q.fillStyle=g;[1,.62,.3].forEach((k,i)=>{const w=s*1.1*(1-u*.5)*k;q.globalAlpha=1;q.fillRect(px-w/2,py-s*10,w,s*10)});
    q.strokeStyle='rgba(180,245,255,'+(.4+.5*u)+')';q.lineWidth=2.5;q.beginPath();q.arc(px,py,s*(2.2-1.4*u),0,7);q.stroke();
    q.strokeStyle='rgba(255,255,255,'+(.3+.5*u)+')';q.lineWidth=1.5;q.beginPath();q.arc(px,py,s*(1.1-.5*u),0,7);q.stroke();q.restore();
    if(im){const h=((o.src.size||2.2)*s)*(1.25-.25*u),w=h*im.naturalWidth/im.naturalHeight;q.save();q.globalAlpha=Math.min(1,u*1.6);q.filter='brightness(1.4) saturate(1.3) hue-rotate(160deg)';q.drawImage(im,px-w/2,top-h/2,w,h);q.restore()}
    lab(q,px,py-s*1.5,'Bản sao đang hạ cánh','#9fe8ff',10)}
  else if(o.k==='cage'){const cg=o.cg,h=CFG.tj7.size/2,x0=X(cg.x-h),y0=Y(cg.y-h),W=h*2*s,dx=s*.7,dy=-s*.9,u=Math.min(1,o.t*6)*Math.min(1,(o.max-o.t)*3+.15);
    q.save();q.globalAlpha=Math.max(0,u);q.lineJoin='round';
    q.fillStyle='rgba(120,60,230,.13)';q.fillRect(x0,y0,W,W);
    q.fillStyle='rgba(160,100,255,.18)';q.beginPath();q.moveTo(x0,y0);q.lineTo(x0+dx,y0+dy);q.lineTo(x0+dx+W,y0+dy);q.lineTo(x0+W,y0);q.closePath();q.fill();
    q.shadowColor='#b46cff';q.shadowBlur=12;q.strokeStyle='rgba(225,190,255,.95)';q.lineWidth=2.4;
    q.beginPath();q.rect(x0,y0,W,W);q.rect(x0+dx,y0+dy,W,W);[[0,0],[W,0],[0,W],[W,W]].forEach(c=>{q.moveTo(x0+c[0],y0+c[1]);q.lineTo(x0+c[0]+dx,y0+c[1]+dy)});q.stroke();
    q.shadowBlur=0;q.strokeStyle='rgba(215,170,255,.75)';q.lineWidth=1.4;q.beginPath();
    for(let i=1;i<4;i++){const t=i/4;q.moveTo(x0+W*t,y0);q.lineTo(x0+W*t,y0+W);q.moveTo(x0,y0+W*t);q.lineTo(x0+W,y0+W*t);q.moveTo(x0+W*t+dx,y0+dy);q.lineTo(x0+W*t+dx,y0+W+dy);q.moveTo(x0+dx,y0+W*t+dy);q.lineTo(x0+W+dx,y0+W*t+dy)}q.stroke();
    q.globalCompositeOperation='lighter';q.strokeStyle='rgba(255,255,255,.7)';q.lineWidth=1.6;const sc=(T*1.1+o.seed)%1;q.beginPath();q.moveTo(x0,y0+sc*W);q.lineTo(x0+W,y0+sc*W);q.lineTo(x0+W+dx,y0+sc*W+dy);q.stroke();
    [[0,0],[W,0],[0,W],[W,W]].forEach((c,i)=>{const r=s*(.18+.05*Math.sin(T*8+i)),gg=q.createRadialGradient(x0+c[0],y0+c[1],0,x0+c[0],y0+c[1],r*2);gg.addColorStop(0,'rgba(255,255,255,.9)');gg.addColorStop(.4,'rgba(190,120,255,.7)');gg.addColorStop(1,'rgba(120,50,255,0)');q.fillStyle=gg;q.beginPath();q.arc(x0+c[0],y0+c[1],r*2,0,7);q.fill()});
    q.restore();
    o.es.forEach(e=>lab(q,X(e.x),Y(e.y)-(e.size||2)*s*.8,'Bị nhốt '+Math.max(0,Math.ceil(ccT(e,CFG.tj7.dur)-o.t))+'s','#e0c8ff',10))}}
function info(b,G){const c=b.nb.c20,t=Math.ceil;
  switch(c){
  case'tj5':return b.c20T==null?['Chờ giao tranh','#b9a0e8']:['Sóng nhiễu sau '+t(Math.max(0,b.c20T))+'s','#d9b8ff'];
  case'tj6':{const n=(G.al||[]).filter(a=>a.c20cl&&!a.dead).length;return ['Gọi tàu sau '+t(Math.max(0,b.c20T==null?CFG.tj6.every:b.c20T))+'s · '+n+'/'+CFG.tj6.cap,'#9fe8ff']}
  case'tj7':{const L=b.c20cg||[],r=L.filter(g=>!(g.cd>0)).length;return L.length?['Lồng sẵn sàng '+r+'/'+L.length,'#d9b8ff']:['Chưa dựng lồng nào (đặt ở Trụ sở)','#b9a0e8']}
  case'tj8':return b.c20cd>0?['Báo động: hồi '+t(b.c20cd)+'s','#ffc0c0']:['Báo động: sẵn sàng','#ffb0b0'];
  case'tj9':return ['Chấn động '+nf(Math.min(CFG.tj9.thr,b.c20acc||0))+'/'+CFG.tj9.thr,'#ffd9a0'];
  case'tj10':return (b.c20q>0)?['Sóng xanh đang phát','#9fd0ff']:['Chờ đồng minh gục','#9fd0ff'];
  default:return null}}
window.c20Draw=function(q,G,X,Y,s,T){if(!G||!G.bl)return;
  G.bl.forEach(b=>{if(b.hp<=0)return;const c=b.nb&&b.nb.c20;if(!c)return;const px=X(b.x),py=Y(b.y),top=py-b.h*s*.62;
    if(c==='tj5'){dashRing(q,px,py,CFG.tj5.R*s*(PB(G).rm||1),'rgba(190,130,255,.16)');const f=b.c20T==null?0:1-Math.max(0,b.c20T)/CFG.tj5.every;
      q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(200,140,255,.85)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.62,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,f));q.stroke();q.restore()}
    else if(c==='tj6'){const f=1-Math.max(0,b.c20T==null?CFG.tj6.every:b.c20T)/CFG.tj6.every;q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(125,235,255,.85)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.7,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,f));q.stroke();q.restore()}
    else if(c==='tj7'){const L=b.c20cg||[],h=CFG.tj7.size/2;
      L.forEach((cg,i)=>{const x0=X(cg.x-h),y0=Y(cg.y-h),W=h*2*s,rd=cg.cd>0;
        q.save();q.setLineDash([6,6]);q.strokeStyle=rd?'rgba(255,170,120,.35)':'rgba(200,150,255,.32)';q.lineWidth=1.6;q.strokeRect(x0,y0,W,W);q.setLineDash([]);
        q.strokeStyle=rd?'rgba(255,170,120,.3)':'rgba(200,150,255,.28)';q.lineWidth=1;q.beginPath();for(let k=1;k<4;k++){q.moveTo(x0+W*k/4,y0);q.lineTo(x0+W*k/4,y0+W);q.moveTo(x0,y0+W*k/4);q.lineTo(x0+W,y0+W*k/4)}q.stroke();
        q.fillStyle=rd?'rgba(255,150,100,.07)':'rgba(170,100,255,.07)';q.fillRect(x0,y0,W,W);q.restore();
        lab(q,x0+W/2,y0+W/2+4,rd?'Hồi '+Math.ceil(cg.cd)+'s':'Lồng '+(i+1)+' · tàng hình',rd?'#ffc8a0':'#d9c0ff',10)})}
    else if(c==='tj8'){dashRing(q,px,py,CFG.tj8.R*s*(PB(G).rm||1),'rgba(255,110,110,.18)');
      if(!(b.c20cd>0)){q.save();q.globalCompositeOperation='lighter';const r=b.w*s*(.7+.08*Math.sin(T*6)),g=q.createRadialGradient(px,py,0,px,py,r*1.4);g.addColorStop(0,'rgba(255,90,90,.45)');g.addColorStop(1,'rgba(255,60,60,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.4,0,7);q.fill();q.restore()}
      else{const f=1-b.c20cd/CFG.tj8.cd;q.save();q.strokeStyle='rgba(255,170,170,.8)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.7,-Math.PI/2,-Math.PI/2+Math.PI*2*f);q.stroke();q.restore()}}
    else if(c==='tj9'){const f=Math.min(1,(b.c20acc||0)/CFG.tj9.thr);dashRing(q,px,py,CFG.tj9.R*s*(PB(G).rm||1),'rgba(255,190,100,.15)');
      q.save();q.globalCompositeOperation='lighter';q.strokeStyle='rgba(255,200,110,.9)';q.lineWidth=3;q.beginPath();q.arc(px,py,b.w*s*.58,-Math.PI/2,-Math.PI/2+Math.PI*2*f);q.stroke();
      if(f>.01){const r=s*(.3+.7*f),g=q.createRadialGradient(px,py,0,px,py,r*1.4);g.addColorStop(0,'rgba(255,200,120,'+(.15+.35*f)+')');g.addColorStop(1,'rgba(255,140,40,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.4,0,7);q.fill()}q.restore()}
    else if(c==='tj10'){dashRing(q,px,py,CFG.tj10.R*s*(PB(G).rm||1),'rgba(110,180,255,.16)');
      q.save();q.globalCompositeOperation='lighter';const r=b.w*s*(.5+.05*Math.sin(T*7)),g=q.createRadialGradient(px,py,0,px,py,r*1.5);g.addColorStop(0,'rgba(140,200,255,.4)');g.addColorStop(1,'rgba(60,140,255,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,r*1.5,0,7);q.fill();q.restore()}
    const L=info(b,G);if(L)lab(q,px,top,L[0],L[1],10)});
  (G.c20e||[]).forEach(o=>{try{drawE(q,o,G,X,Y,s,T)}catch(e){}});
  ships(G).forEach(a=>{if(!a.c20cl)return;const px=X(a.x),py=Y(a.y),r=(a.size||2)*s*.62;q.save();q.strokeStyle='rgba(125,235,255,.85)';q.lineWidth=1.8;q.setLineDash([3,3]);q.beginPath();q.arc(px,py,r,0,7);q.stroke();q.restore();lab(q,px,py+r+10,'Bản sao','#9fe8ff',9)});
  enemies(G).forEach(e=>{const px=X(e.x),py=Y(e.y),r=(e.size||2)*s;
    if(e.c20burn){q.save();q.globalAlpha=.3+.2*Math.sin(T*25);q.fillStyle='#ff5a1a';q.beginPath();q.arc(px,py,r*.45,0,7);q.fill();q.globalAlpha=.9;q.fillStyle='#ffb347';for(let i=0;i<4;i++){const u=(T*1.8+i*.25)%1;q.beginPath();q.arc(px+Math.sin(i*5+T*6)*r*.25,py+r*.2-u*r*.6,2.2*(1-u),0,7);q.fill()}q.restore()}
    if(e.c20tox){q.save();q.strokeStyle='rgba(190,255,100,.8)';q.lineWidth=2;q.beginPath();q.arc(px,py,r*.52,0,7);q.stroke();q.restore()}
    if(e.c20fr>0)lab(q,px,py-r*.62,'Sợ hãi','#e0b8ff',9);
    else if(e.c20si>0)lab(q,px,py-r*.62,'Cấm kỹ năng','#bfe6ff',9);
    else if(e.c20sl>0)lab(q,px,py-r*.62,'Chậm','#9fd0ff',9)});
  (G.c20pop||[]).forEach(o=>{const u=o.t/o.max;q.save();q.globalAlpha=Math.min(1,(1-u)*2);lab(q,X(o.x),Y(o.y)-u*s*1.3,o.txt,o.col,11);q.restore()})};
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{window.c20Draw(q,G,X,Y,s,T)}catch(e){console.error(e)}}}

/* ---------- mô phỏng xem trước ở màn Nâng cấp Trụ sở ---------- */
(function(){
const SC=window.c16SC,H=window.c16Help;if(!SC||!H)return;
const {mkBld,mkEn}=H;
const txt=(q,s,x,y,col,sz,al)=>{q.save();q.font='bold '+(sz||11)+'px sans-serif';q.textAlign=al||'center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.75)';q.strokeText(s,x,y);q.fillStyle=col||'#fff';q.fillText(s,x,y);q.restore()};
const mkAl=(G,c,x,y,i,hp,o)=>{const a=Object.assign({team:'p',x,y,hx:x,hy:y,hp:hp||100,max:hp||100,size:1.5,sh:c.pool[(i||0)%c.pool.length],dead:false,hit:0,ang:-Math.PI/2,capn:'Kaito',ws:[],name:'Tàu '+((i||0)+1)},o||{});(G.al=G.al||[]).push(a);return a};
const drawAl=(q,a,X,Y,s,alpha)=>{if(a.dead)return;const im=dimg(a.sh.img);if(!im)return;const h=a.size*s,w=h*im.naturalWidth/im.naturalHeight;
  q.save();q.translate(X(a.x),Y(a.y));q.globalAlpha=alpha==null?1:alpha;q.drawImage(im,-w/2,-h/2,w,h);q.restore();
  if(a.max<1e8){const bw=a.size*s*.9,f=Math.max(0,a.hp/a.max);q.fillStyle='#000a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw,4);q.fillStyle='#6dff9a';q.fillRect(X(a.x)-bw/2,Y(a.y)-a.size*s*.66,bw*f,4)}};
const shRing=(q,a,X,Y,s,T)=>{const v=shVal(a);if(!(v>0)||a.dead)return;q.save();q.strokeStyle='rgba(255,235,235,'+(.6+.25*Math.sin(T*8))+')';q.lineWidth=2.5;q.shadowColor='#fff';q.shadowBlur=10;q.beginPath();q.arc(X(a.x),Y(a.y),a.size*s*.66,0,7);q.stroke();q.restore()};
const expire=G=>{(G.al||[]).forEach(a=>{if(a.shd&&a.shd.c17&&G.t>a.shd.c17)a.shd=null;if(a.cs&&a.cs.abs&&a.cs.abs.t>0)a.cs.abs.t-=G.dtc||.02});G.bl.forEach(b=>{if(b.shd&&b.shd.t>0&&b.shd.t<9000){b.shd.t-=G.dtc||.02;if(b.shd.t<=0)b.shd=null}})};
const sway=(G,a,i,ax,ay)=>{a.x=a.hx+Math.sin(G.t*.8+i*1.7)*(ax==null?.45:ax);a.y=a.hy+Math.cos(G.t*.6+i)*(ay==null?.3:ay)};
const safe=o=>{['init','step','under','over'].forEach(k=>{const f=o[k];if(f)o[k]=function(){try{return f.apply(this,arguments)}catch(e){console.error('c20 sc',o.title,e)}}});return o};
const T0=(G,dt)=>{G.dtc=dt;pre(G,dt);expire(G)};
const solid=b=>{b.hp=b.max};
const mkE=(G,c,x,y,hp)=>{const e=mkEn(G,c,x,y,hp||1e9);e.noRev=true;e.hx=e.x;e.hy=e.y;e.hpb=1;return e};
const initC=(G,c,rc)=>{G.c18sim=1;G.c19sim=1;G.c20sim=1;G.pvp=false;if(rc)G.c18rc=rc};
/* địch trong mô phỏng: hết hiệu ứng thì tự về chỗ cũ; sợ hãi thì chạy xa */
const dec=(e,dt,home)=>{if(e.stun>0)e.stun=Math.max(0,e.stun-dt);if(e.slowT>0){e.slowT-=dt;if(e.slowT<=0)e.slowK=1}if(e.silT>0)e.silT=Math.max(0,e.silT-dt);if(e.noFire>0)e.noFire=Math.max(0,e.noFire-dt);e.hp=e.max=1e9;
  if(e.fearT>0){e.fearT-=dt;const dx=e.x-e.fearX,dy=e.y-e.fearY,l=Math.hypot(dx,dy)||1;e.x=Math.max(.5,Math.min(14.5,e.x+dx/l*3.2*dt));e.y=Math.max(.5,Math.min(9.5,e.y+dy/l*3.2*dt))}
  else if(home!==false&&!(e.c20root>0)&&!(e.stun>0)){const k=Math.min(1,dt*(e.c20kb?0:.9));e.x+=(e.hx-e.x)*k;e.y+=(e.hy-e.y)*k}};
const sh0=(G,x,y,tx,ty)=>beam(G,x,y,tx,ty,'#ff8a8a',2,.12);

SC.tj5=safe({title:'THÁP PHÁT SÓNG NHIỄU',note:'Ngay khi giao tranh và mỗi 30 giây: sóng nhiễu tím 100 sát thương trong 18 ô · 50% sợ hãi 2 giây · 10% choáng 0,75 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.b=mkBld(G,'tj5',7.5,7.4,{lv:c.lv});c.es=[mkE(G,c,3.0,2.6),mkE(G,c,6.0,1.0),mkE(G,c,9.6,1.8),mkE(G,c,12.4,3.0),mkE(G,c,8.2,4.4)]},
  step(G,dt,c){c.es.forEach(e=>dec(e,dt));T0(G,dt);solid(c.b);TICK.tj5(c.b,dt,G)},
  over(q,G,c,X,Y,s){const b=c.b;txt(q,b.c20pn?'Sóng #'+b.c20pn+': '+b.c20ph+' mục tiêu · '+b.c20pf+' sợ hãi · '+b.c20ps+' choáng':'Đang chờ giao tranh…',X(7.5),Y(9.9),'#d9b8ff',11)}});

SC.tj6=safe({title:'THÁP GỌI TÀU',note:'Mỗi 30 giây gọi 1 bản sao của tàu đồng minh bất kỳ xuống chiến trường · tối đa 5 bản sao cùng lúc (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.b=mkBld(G,'tj6',7.5,7.9,{lv:c.lv});c.a=[mkAl(G,c,3.6,4.6,0,100),mkAl(G,c,11.4,5.0,1,100),mkAl(G,c,7.5,2.8,2,100)];c.t0=0},
  step(G,dt,c){(G.al||[]).forEach((a,i)=>{if(a.hx==null){a.hx=a.x;a.hy=a.y}sway(G,a,i);a.hp=a.max=a.c20cl?a.max:100});T0(G,dt);solid(c.b);TICK.tj6(c.b,dt,G);
    if(G.t-c.t0>27&&!(G.c20e||[]).some(o=>o.k==='drop')){c.t0=G.t;G.al=G.al.filter(a=>!a.c20cl);c.b.c20T=null}},
  over(q,G,c,X,Y,s){(G.al||[]).forEach(a=>drawAl(q,a,X,Y,s));const n=(G.al||[]).filter(a=>a.c20cl&&!a.dead).length;txt(q,'Bản sao: '+n+'/5 · mỗi bản sao đủ máu, mang vũ khí như tàu gốc',X(7.5),Y(9.9),'#9fe8ff',11)}});

SC.tj7=safe({title:'LƯỚI BẪY LASER TÍM',note:'Lồng 4×4 dựng trước ở Trụ sở (tối đa 10), tàng hình với kẻ thù: địch dẫm lên chịu 400 sát thương, bị nhốt 5 giây · mỗi lồng hồi 30 giây (xem nhanh)',
  init(G,c){initC(G,c,.2);G.c20cgSrc=[[3.6,3.4],[11.2,3.4]];c.b=mkBld(G,'tj7',7.5,8.2,{lv:c.lv});c.es=[mkE(G,c,3.6,-.4),mkE(G,c,11.2,-2.2),mkE(G,c,7.5,-1)];c.es.forEach((e,i)=>{e.sp0=1.5+i*.15})},
  step(G,dt,c){c.es.forEach(e=>{dec(e,dt,false);if(!(e.stun>0)&&!(e.c20root>0))e.y+=e.sp0*dt;if(e.y>7.4){e.y=-.8;e.c20cage=0;e.c20root=0;e.c20rx=null}});T0(G,dt);solid(c.b);TICK.tj7(c.b,dt,G)},
  over(q,G,c,X,Y,s){const e=c.es[2];txt(q,'ngoài lồng · đi qua bình thường',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10);txt(q,'Lồng tàng hình với địch · −400 sát thương · nhốt 5 giây',X(7.5),Y(9.9),'#d9c0ff',11)}});

SC.tj8=safe({title:'CỘT PHÁT SÓNG BÁO ĐỘNG',note:'Khi nhận tín hiệu thiên thạch của kẻ thù: sóng đỏ 12 ô giải thiêu đốt, +200 giáp cho đồng minh và công trình · hồi 60 giây (xem nhanh ×10)',
  init(G,c){initC(G,c,.1);c.b=mkBld(G,'tj8',7.5,6.2,{lv:c.lv});c.a=[mkAl(G,c,3.4,3.6,0,100),mkAl(G,c,11.6,3.2,1,100),mkAl(G,c,7.5,8.8,2,100)];c.w=[mkBld(G,'wall',4.4,7.0,{w:2,h:1,max:4}),mkBld(G,'cannon',11.0,6.8,{max:4})];c.es=[mkE(G,c,7.5,.8)];c.ph=0;c.sent=false;c.burn=false;c.m=null},
  step(G,dt,c){c.ph+=dt;c.a.forEach((a,i)=>{sway(G,a,i);a.hp=a.max;if(a.burnT>0)a.burnT-=dt});c.w.forEach(b=>{b.hp=b.max});c.es.forEach(e=>dec(e,dt));
    if(!c.burn&&c.ph>.6){c.burn=true;c.a[0].burnT=4;c.a[1].burnT=4}
    if(!c.sent&&c.ph>1.3){c.sent=true;c.m={t:0,x:7.5+(Math.random()-.5)*3,y:8.8};window.c20Meteor(G,c.m.x,c.m.y,2.5,c.es[0])}
    if(c.m){c.m.t+=dt;if(c.m.t>1.5)c.m=null}
    if(c.ph>7.4){c.ph=0;c.sent=false;c.burn=false;c.a.forEach(a=>{a.shd=null;a.burnT=0});c.w.forEach(b=>{b.shd=null})}
    T0(G,dt);solid(c.b);TICK.tj8(c.b,dt,G)},
  over(q,G,c,X,Y,s){
    if(c.m){const u=Math.min(1,c.m.t/1.2),x=X(c.m.x),y=Y(c.m.y)-(1-u)*s*9,r=s*.5;q.save();q.globalCompositeOperation='lighter';
      const tg=q.createLinearGradient(x+s*1.2,y-s*3,x,y);tg.addColorStop(0,'rgba(255,120,40,0)');tg.addColorStop(1,'rgba(255,170,60,.8)');q.fillStyle=tg;q.beginPath();q.moveTo(x-r*.7,y);q.lineTo(x+r*.7,y);q.lineTo(x+s*1.2,y-s*3);q.closePath();q.fill();
      const g=q.createRadialGradient(x,y,0,x,y,r*1.6);g.addColorStop(0,'#fff');g.addColorStop(.35,'#ffc060');g.addColorStop(.7,'#ff5a1a');g.addColorStop(1,'rgba(180,30,0,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r*1.6,0,7);q.fill();q.restore();
      if(c.m.t<.6)txt(q,'Tín hiệu thiên thạch!',X(c.m.x),Y(c.m.y)-s*1.4,'#ffb08a',11)}
    c.a.forEach(a=>{drawAl(q,a,X,Y,s);shRing(q,a,X,Y,s,G.t);const v=shVal(a);
      if(a.burnT>0){q.save();q.globalAlpha=.35+.2*Math.sin(G.t*25);q.fillStyle='#ff5a1a';q.beginPath();q.arc(X(a.x),Y(a.y),a.size*s*.5,0,7);q.fill();q.restore();txt(q,'Đang cháy',X(a.x),Y(a.y)-a.size*s*.82,'#ffb070',10)}
      else if(v>0)txt(q,'+'+Math.round(v)+' giáp',X(a.x),Y(a.y)-a.size*s*.82,'#ffffff',10)});
    c.w.forEach(b=>{if(b.shd&&b.shd.v>0)txt(q,'+'+Math.round(b.shd.v*DFB)+' giáp',X(b.x),Y(b.y)-b.h*s*.8,'#ffd0d0',10)});
    txt(q,'Giải thiêu đốt · +200 giáp trong 12 ô quanh cột',X(7.5),Y(9.9),'#ffb0b0',11)}});

SC.tj9=safe({title:'HỘP BẪY CHẤN ĐỘNG',note:'2000 máu · mỗi lần chịu 400 sát thương phát sóng 5 ô: mỗi mục tiêu 10% chịu 1 hiệu ứng ngẫu nhiên (choáng, chậm, sợ hãi, cấm kỹ năng, cháy, ngộ độc)',
  init(G,c){initC(G,c);c.b=mkBld(G,'tj9',7.5,5.4,{lv:c.lv});c.es=[mkE(G,c,4.2,2.6),mkE(G,c,10.4,3.0),mkE(G,c,7.5,1.0),mkE(G,c,13.9,1.2),mkE(G,c,1.2,3.4)];c.hit=0},
  step(G,dt,c){const b=c.b;c.es.forEach(e=>dec(e,dt));c.hit-=dt;
    if(c.hit<=0){c.hit=.9;const e=c.es[(Math.random()*3)|0];sh0(G,e.x,e.y,b.x,b.y);b.hp-=170/DFB;ping(G,b.x+(Math.random()-.5)*b.w*.6,b.y+(Math.random()-.5)*b.h*.6,.5,'#ff9a7a',.25)}
    if(b.hp<b.max*.4)b.hp=b.max;T0(G,dt);TICK.tj9(b,dt,G)},
  over(q,G,c,X,Y,s){c.es.slice(3).forEach(e=>txt(q,'ngoài 5 ô · không bị ảnh hưởng',X(e.x),Y(e.y)-e.size*s*.7,'#8fa6d8',10));const b=c.b;txt(q,'Sóng #'+(b.c20wn||0)+(b.c20wn?': '+b.c20hit+' mục tiêu · '+b.c20eff+' dính hiệu ứng':'')+' · cứ 400 sát thương nhận vào',X(7.5),Y(9.9),'#ffd9a0',11)}});

SC.tj10=safe({title:'TRẠM NHIỄU LOẠN DIỆN RỘNG',note:'Mỗi khi 1 đồng minh trong phạm vi tử vong: sóng xanh rộng tối đa 10 ô, 200 sát thương, đẩy lùi kẻ địch nhẹ 1 ô',
  init(G,c){initC(G,c);c.b=mkBld(G,'tj10',7.5,6.4,{lv:c.lv});c.a=[mkAl(G,c,3.2,4.2,0,100),mkAl(G,c,11.8,4.4,1,100),mkAl(G,c,7.5,9.0,2,100)];c.es=[mkE(G,c,4.2,1.4),mkE(G,c,7.5,.8),mkE(G,c,11.0,1.6)];c.ph=2.2;c.k=0;c.rv=null},
  step(G,dt,c){c.ph-=dt;c.a.forEach((a,i)=>{if(!a.dead)sway(G,a,i);a.hp=a.max});c.es.forEach(e=>dec(e,dt));
    if(c.ph<=0){c.ph=5;const a=c.a[c.k%3];c.k++;if(!a.dead){a.dead=true;a.dt=2.6;boomFx(G,a.x,a.y,(a.size||2)*1.2)}}
    c.a.forEach(a=>{if(a.dead){a.dt-=dt;if(a.dt<=0){a.dead=false;a.hx=a.hx;ping(G,a.x,a.y,1.4,'#9fe8ff',.4)}}});
    T0(G,dt);solid(c.b);TICK.tj10(c.b,dt,G)},
  over(q,G,c,X,Y,s){c.a.forEach(a=>{drawAl(q,a,X,Y,s);if(a.dead)txt(q,'đã tử vong',X(a.x),Y(a.y),'#9fd0ff',10)});const b=c.b;
    txt(q,b.c20wn?'Sóng #'+b.c20wn+': '+b.c20hit+' mục tiêu · −'+nf(b.c20pd||0)+' · đẩy lùi 1 ô':'Chờ đồng minh tử vong…',X(7.5),Y(9.9),'#9fd0ff',11)}});

/* xuất để kiểm thử */
window.C20={C20T,CFG,TICK,tick:window.c20Tick,pre,waveFx,cagesOf,cageTrig,summon,cloneOf,alarm,quake,surge,fx9,cleanse,SC:Object.keys(SC).filter(k=>C20T.includes(k))};
})();
})();
