/* ===== c97: MẪU XẾP CĂN CỨ — 50 mẫu cho phe ta (mua 5.000 Đá/mẫu, bấm là tự xếp) + 50 mẫu mới cho căn cứ địch ===== */
(function(){
const H=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
const ang=(dx,y)=>Math.atan2(dx,y+.5);
/* 25 hình dạng gốc: f(dx,y,k,R) càng nhỏ càng được đặt trước (gần trụ sở) */
const SH=[
 ['Sóng biển',(dx,y)=>y+3*Math.sin(dx*.45)],
 ['Chữ V',(dx,y,k,R)=>Math.abs(y-Math.abs(dx)*.75)*2+y*.3],
 ['Mũi giáo',(dx,y)=>y*.6+Math.abs(dx)*1.6],
 ['Chữ thập',(dx,y,k,R)=>Math.min(Math.abs(dx)*2,Math.abs(y-R*.35)*2)+Math.hypot(dx,y)*.15],
 ['Chữ X',(dx,y,k,R)=>Math.min(Math.abs(dx-(y-R*.4)),Math.abs(dx+(y-R*.4)))*2+Math.hypot(dx,y)*.12],
 ['Vòng đôi',(dx,y,k,R)=>{const r=Math.hypot(dx,y);return Math.min(Math.abs(r-R*.22),Math.abs(r-R*.5))*2+r*.1}],
 ['Bông hoa',(dx,y)=>{const r=Math.hypot(dx,y);return r*(1+.35*Math.cos(5*ang(dx,y)))}],
 ['Ngôi sao',(dx,y)=>{const r=Math.hypot(dx,y);return r*(1+.45*Math.cos(6*ang(dx,y)))}],
 ['Hình vuông',(dx,y)=>Math.max(Math.abs(dx),y)],
 ['Lục giác',(dx,y)=>Math.max(Math.abs(dx)*.866+y*.5,y)],
 ['Quần đảo',(dx,y)=>{const a=((dx%7)+7)%7-3.5,b=(y%7)-3.5;return Math.hypot(a,b)*2+y*.25+Math.abs(dx)*.1}],
 ['Bậc thang',(dx,y)=>Math.floor(y/3)*10+Math.abs(dx)],
 ['Cột đôi',(dx,y,k,R)=>Math.abs(Math.abs(dx)-R*.2)*3+y*.3],
 ['Ba cột',(dx,y,k,R)=>Math.min(Math.abs(dx),Math.abs(dx-R*.3),Math.abs(dx+R*.3))*3+y*.3],
 ['Răng cưa',(dx,y)=>y+(((Math.round(dx)%4)+4)%4)*2],
 ['Mắt bão',(dx,y,k,R)=>Math.abs(Math.hypot(dx,y)-R*.3)+(ang(dx,y)+Math.PI)*.6],
 ['Trăng khuyết',(dx,y,k,R)=>{const r=Math.hypot(dx,y);return Math.abs(r-R*.4)*2+Math.max(0,R*.3-Math.hypot(dx,y-R*.25))*3}],
 ['Tam giác',(dx,y)=>y+Math.abs(dx)*1.8],
 ['Thoi dẹt',(dx,y,k,R)=>Math.abs(dx)*.5+Math.abs(y-R*.35)*1.5],
 ['Chim én',(dx,y)=>Math.abs(Math.abs(dx)-y*.7)*1.5+y*.25],
 ['Đuôi công',(dx,y,k,R)=>Math.abs(ang(dx,y))*R*.5+Math.hypot(dx,y)*.35],
 ['Mạng nhện',(dx,y)=>{const a=ang(dx,y),s=Math.PI/3,d=Math.abs(((a%s)+s)%s-s/2),r=Math.hypot(dx,y);return d*r*2+r*.25}],
 ['Ba thành lũy',(dx,y,k,R)=>Math.min(Math.hypot(dx-R*.3,y-R*.3),Math.hypot(dx+R*.3,y-R*.3),Math.hypot(dx,y))],
 ['Rải rác',(dx,y)=>H(Math.round(dx),Math.round(y))*8+y*.35+Math.abs(dx)*.15],
 ['Xương cá',(dx,y)=>Math.min(Math.abs(dx)*3,Math.abs(Math.abs(dx)-((y%4)+.5))*2)+y*.3]];
const VAR=[{s:' I',ord:['t','w','f']},{s:' II',ord:['w','t','f'],gap:1},{s:' III',ord:['f','t','w']},{s:' IV',ord:['t','f','w'],gap:1}];
function make(side){const out=[];const vs=side==='p'?[VAR[0],VAR[1]]:[VAR[2],VAR[3]];vs.forEach(v=>SH.forEach(([n,f])=>out.push({n:n+v.s,f,ord:v.ord,gap:v.gap||0})));return out}
window.__tplMake=make;
const PT=make('p');window.C97PT=PT;
/* ---- 10 MẪU TRIỂN KHAI: xếp khít toàn bộ bản đồ theo cấp trụ sở (đặt được gần hết công trình kể cả cấp 500) ---- */
const TUR=/pháo|tháp|cối|tên lửa|bệ phóng|súng|laser|đại bác|nỏ/i;
const cat=it=>{if(it.hqf)return 'hq';if(it.t==='wall')return 'w';if(it.t==='mine')return 'm';const b=BLD.find(x=>x.id===it.id)||{};return ((typeof BT!=='undefined'&&BT[it.t])||(b.nb&&b.nb.k==='tur')||TUR.test(b.n||''))?'t':'f'};
const PK=[
 ['Tiền tuyến thép',(x,y,W,H)=>y*W+Math.abs(x-W/2),['t','w','f','m']],
 ['Thành vòng pháo',(x,y,W,H)=>-Math.hypot(x-W/2,y-H+3),['t','w','f','m']],
 ['Lõi hỗ trợ',(x,y,W,H)=>Math.hypot(x-W/2,y-H+3),['f','t','w','m']],
 ['Hai cánh chim',(x,y,W,H)=>-Math.abs(x-W/2)*3+y,['t','f','w','m']],
 ['Mũi tên xuyên',(x,y,W,H)=>y+Math.abs(x-W/2)*.6,['t','w','f','m']],
 ['Bàn cờ thép',(x,y,W,H)=>((((x>>2)+(y>>2))&1)?1e4:0)+y*W+x,['t','f','w','m']],
 ['Dải pháo ngang',(x,y,W,H)=>((y>>3)&1?1e4:0)+y*W+Math.abs(x-W/2),['t','f','w','m']],
 ['Cột trụ dọc',(x,y,W,H)=>Math.abs(x-W/2)*H+y,['f','t','w','m']],
 ['Kim cương',(x,y,W,H)=>Math.abs(x-W/2)+Math.abs(y-H/2),['t','f','w','m']],
 ['Xoắn ốc',(x,y,W,H)=>{const a=Math.atan2(y-H/2,x-W/2)+Math.PI,r=Math.hypot(x-W/2,y-H/2);return r*7+a*3},['t','f','w','m']]];
PK.forEach(([n,key,ord])=>PT.push({n:'Triển khai · '+n,pack:1,key,ord}));
function pack(T){const R1=bReg(),W=R1.x1-R1.x0,H=R1.y1-R1.y0,its=items(),occ=new Uint8Array(W*H);
  const put=(x,y,w,h)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)occ[(y+j)*W+x+i]=1},ok=(x,y,w,h)=>{if(x<0||y<0||x+w>W||y+h>H)return false;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(occ[(y+j)*W+x+i])return false;return true};
  const hq=its.find(x=>x.hqf);if(!hq)return null;const hx=Math.floor(W/2-hq.w/2),hy=H-hq.h-1;put(hx,hy,hq.w,hq.h);const pos={};pos[hq.id]=[hx,hy];
  const ord=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)ord.push(y*W+x);const kv=new Float64Array(W*H);ord.forEach(i=>{kv[i]=T.key(i%W,(i/W)|0,W,H)});ord.sort((a,b)=>kv[a]-kv[b]);
  const start={};let drop=0;
  T.ord.forEach(c=>{its.filter(it=>!it.hqf&&cat(it)===c).sort((a,b)=>b.w*b.h-a.w*a.h).forEach(it=>{const sk=it.w+'x'+it.h;let k=start[sk]||0;
      for(;k<ord.length;k++){const i=ord[k],x=i%W,y=(i/W)|0;if(ok(x,y,it.w,it.h)){put(x,y,it.w,it.h);pos[it.id]=[x,y];break}}start[sk]=k;if(k>=ord.length)drop++})});
  const keep=its.filter(it=>pos[it.id]).map(it=>Object.assign({},it,{x:pos[it.id][0],y:H-(pos[it.id][1]+it.h)}));
  return {tpl:T.n,R:W,S:W,cx0:0,items:its,keep,drop}}
const PRICE=5000;
const own=i=>!!(S.tplP&&S.tplP[i]);
/* ---- áp mẫu lên căn cứ của ta (màn Trụ sở): trụ sở ở phía sau (dưới), pháo ra phía trước ---- */
function items(){bPos();return bAvail().map(b=>({id:b.id,t:b.t,w:b.w,h:b.h,hqf:b.t==='hq'}))}/* mọi công trình đang có theo cấp trụ sở (kể cả trong Kho) */
const PC={};
function plan(i){const R1=bReg(),k=i+'|'+bLv('hq')+'|'+bAvail().length;if(PC[k]!==undefined)return PC[k];if(PT[i]&&PT[i].pack)return PC[k]=pack(PT[i]);if(!window.C65||!C65.layout)return null;const B={items:items()};if(!B.items.some(x=>x.hqf))return PC[k]=null;C65.layout(B,PT[i]);if(!B.tpl)return PC[k]=null;
  /* mẫu quá lớn so với bản đồ: giữ phần gần trụ sở nhất (ưu tiên theo mẫu), phần còn lại cất Kho */
  const W=R1.x1-R1.x0,Hh=R1.y1-R1.y0,S2=Math.min(B.R,W,Hh),x0=Math.max(0,Math.min(B.R-S2,Math.round(B.R/2-S2/2)));
  B.keep=B.items.filter(it=>it.hqf||(it.x>=x0&&it.x+it.w<=x0+S2&&it.y+it.h<=S2));B.drop=B.items.length-B.keep.length;B.cx0=x0;B.S=S2;return PC[k]=B}
function apply(i){const B=plan(i);if(!B){toast('Không xếp được mẫu này');return false}const R1=bReg(),W=R1.x1-R1.x0,Hh=R1.y1-R1.y0;
  const ox=R1.x0+Math.floor((W-B.S)/2),oy=R1.y0+Math.floor((Hh-B.S)/2),P=bPos(),off=bOff(),ks=new Map(B.keep.map(x=>[x.id,x]));
  B.items.forEach(it0=>{const it=ks.get(it0.id);if(it){P[it.id]=[ox+it.x-B.cx0,oy+(B.S-(it.y+it.h))];delete off[it.id]}else{delete P[it0.id];off[it0.id]=true}});
  try{save()}catch(e){}try{bRender()}catch(e){}toast('Đã xếp '+B.keep.length+' công trình theo mẫu «'+PT[i].n+'»'+(B.drop?' · '+B.drop+' công trình không đủ chỗ đã cất vào Kho':''));return true}
/* ---- giao diện ---- */
const st=document.createElement('style');st.textContent=`#c97{position:fixed;inset:0;z-index:61;display:none;flex-direction:column;background:radial-gradient(ellipse at 40% 20%,#0b2050,#040a1e 70%);color:#dfe9ff;font:600 13px system-ui,sans-serif}
#c97 .hd{position:relative;z-index:2;display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid #1f4a8a;background:#061430e6}#c97 .hd h2{margin:0;font-size:16px;color:#fff;letter-spacing:1px}#c97 .hd small{color:#9fc4ff}
#c97 button{cursor:pointer;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#dfe9ff;font:800 12px system-ui,sans-serif;padding:6px 10px}#c97 .x{margin-left:auto}
#c97 .q97g{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;padding:12px;align-content:start}
#c97 .q97c{border:1.5px solid #1f4a8a;border-radius:12px;background:#071a3a;padding:8px;display:flex;flex-direction:column;gap:6px;align-items:center}
#c97 .q97c.q97o{border-color:#36d16a}#c97 canvas{position:static!important;display:block;width:118px!important;height:118px!important;max-width:none;border-radius:8px;background:#030a1c;flex:none}#c97 .q97c b{color:#fff;font-size:12px;text-align:center}
#c97 .buy{background:linear-gradient(#ffd766,#f0a500);color:#1a1200;border-color:#ffc53d}#c97 .use{background:#0c4a2a;border-color:#36d16a}`;document.head.appendChild(st);
const ov=document.createElement('div');ov.id='c97';document.body.appendChild(ov);
const KC={hq:'#ffd24a',t:'#ff6a6a',w:'#8a96ad',f:'#5fb0ff'};
function draw(cv,i){const B=plan(i),q=cv.getContext('2d'),W=cv.width;q.clearRect(0,0,W,W);if(!B){q.fillStyle='#ff8a8a';q.font='bold 12px system-ui';q.fillText('—',W/2-4,W/2);return}const s=W/B.S;
  B.keep.forEach(it=>{const k=it.hqf?'hq':it.t==='wall'?'w':(typeof BT!=='undefined'&&BT[it.t])?'t':'f';q.fillStyle=KC[k];q.fillRect((it.x-B.cx0)*s+.5,(B.S-(it.y+it.h))*s+.5,it.w*s-1,it.h*s-1)})}
function render(){const da=Math.floor(S.da||0);ov.innerHTML=`<div class="hd"><h2>MẪU XẾP CĂN CỨ</h2><small>60 mẫu (10 mẫu triển khai vừa khít) · tự xếp toàn bộ ${(()=>{try{return bAvail().length}catch(e){return 0}})()} công trình của Trụ sở cấp ${(()=>{try{return bLv('hq')}catch(e){return 1}})()} · ${PRICE.toLocaleString('vi-VN')} Đá/mẫu · bạn có ${da.toLocaleString('vi-VN')} Đá · <span style="color:#ffd24a">■</span> trụ sở <span style="color:#ff6a6a">■</span> pháo <span style="color:#8a96ad">■</span> tường <span style="color:#5fb0ff">■</span> khác</small><button class="x" data-a="x">✕ Đóng</button></div>
  <div class="q97g">${PT.map((T,i)=>[T,i]).sort((a,b)=>(b[0].pack?1:0)-(a[0].pack?1:0)).map(([T,i])=>`<div class="q97c ${own(i)?'q97o':''}"><canvas width="236" height="236" data-i="${i}"></canvas><b>${T.n}</b>${T.pack?'<small style="color:#7dffb0">Vừa khít bản đồ · xếp gần hết công trình</small>':''}${own(i)?`<button class="use" data-a="use" data-i="${i}">✓ Áp dụng</button>`:`<button class="buy" data-a="buy" data-i="${i}">Mua · ${PRICE.toLocaleString('vi-VN')} Đá</button>`}</div>`).join('')}</div>`;
  const cvs=[...ov.querySelectorAll('canvas')];let n=0;const nx=()=>{if(ov.style.display!=='flex'||n>=cvs.length)return;const c=cvs[n++];try{draw(c,+c.dataset.i)}catch(e){}setTimeout(nx,0)};nx()}
ov.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=+b.dataset.i;if(a==='x'){ov.style.display='none';return}
  if(a==='buy'){if((S.da||0)<PRICE){toast('Không đủ Đá — cần '+PRICE.toLocaleString('vi-VN')+' Đá');return}if(b.dataset.ok!=='1'){b.dataset.ok='1';b.textContent='Bấm lần nữa để mua';setTimeout(()=>{if(b.isConnected){b.dataset.ok='';b.textContent='Mua · '+PRICE.toLocaleString('vi-VN')+' Đá'}},2500);return}
    S.da-=PRICE;S.tplP=S.tplP||{};S.tplP[i]=1;try{save()}catch(e){}try{refresh()}catch(e){}toast('Đã mua mẫu «'+PT[i].n+'»');render();return}
  if(a==='use'){if(apply(i))ov.style.display='none'}});
function open(){ov.style.display='flex';render()}
setInterval(()=>{try{const bar=document.querySelector('#base .lt');if(bar&&!bar.querySelector('#c97b')){const b=document.createElement('button');b.id='c97b';b.className='brs';b.style.cssText='background:#3a2a0c;border-color:#ffc53d';b.textContent='🧩 Mẫu xếp';b.onclick=open;const r=bar.querySelector('#c92b')||bar.querySelector('#brot');bar.insertBefore(b,r||null)}}catch(e){}},500);
window.C97={open,apply,plan,PT};
})();
