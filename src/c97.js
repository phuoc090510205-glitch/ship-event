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
const PRICE=5000;
const own=i=>!!(S.tplP&&S.tplP[i]);
/* ---- áp mẫu lên căn cứ của ta (màn Trụ sở): trụ sở ở phía sau (dưới), pháo ra phía trước ---- */
function items(){const P=bPos();return bAvail().filter(b=>P[b.id]).map(b=>({id:b.id,t:b.t,w:b.w,h:b.h,hqf:b.t==='hq'}))}
function plan(i){if(!window.C65||!C65.layout)return null;const B={items:items()};if(!B.items.some(x=>x.hqf))return null;C65.layout(B,PT[i]);return B.tpl?B:null}
function apply(i){const B=plan(i);if(!B){toast('Không xếp được mẫu này');return false}const R1=bReg(),W=R1.x1-R1.x0,Hh=R1.y1-R1.y0;
  if(B.R>W||B.R>Hh){toast('Căn cứ chưa đủ rộng cho mẫu này — nâng cấp trụ sở để mở rộng');return false}
  const ox=R1.x0+Math.floor((W-B.R)/2),oy=R1.y0+Math.floor((Hh-B.R)/2),P=bPos();B.items.forEach(it=>{P[it.id]=[ox+it.x,oy+(B.R-(it.y+it.h))]});
  try{save()}catch(e){}try{paintBase()}catch(e){}toast('Đã xếp căn cứ theo mẫu «'+PT[i].n+'»');return true}
/* ---- giao diện ---- */
const st=document.createElement('style');st.textContent=`#c97{position:fixed;inset:0;z-index:61;display:none;flex-direction:column;background:radial-gradient(ellipse at 40% 20%,#0b2050,#040a1e 70%);color:#dfe9ff;font:600 13px system-ui,sans-serif}
#c97 .hd{position:relative;z-index:2;display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid #1f4a8a;background:#061430e6}#c97 .hd h2{margin:0;font-size:16px;color:#fff;letter-spacing:1px}#c97 .hd small{color:#9fc4ff}
#c97 button{cursor:pointer;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#dfe9ff;font:800 12px system-ui,sans-serif;padding:6px 10px}#c97 .x{margin-left:auto}
#c97 .q97g{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;padding:12px;align-content:start}
#c97 .q97c{border:1.5px solid #1f4a8a;border-radius:12px;background:#071a3a;padding:8px;display:flex;flex-direction:column;gap:6px;align-items:center}
#c97 .q97c.ow{border-color:#36d16a}#c97 canvas{position:static!important;display:block;width:118px!important;height:118px!important;max-width:none;border-radius:8px;background:#030a1c;flex:none}#c97 .q97c b{color:#fff;font-size:12px;text-align:center}
#c97 .buy{background:linear-gradient(#ffd766,#f0a500);color:#1a1200;border-color:#ffc53d}#c97 .use{background:#0c4a2a;border-color:#36d16a}`;document.head.appendChild(st);
const ov=document.createElement('div');ov.id='c97';document.body.appendChild(ov);
const KC={hq:'#ffd24a',t:'#ff6a6a',w:'#8a96ad',f:'#5fb0ff'};
function draw(cv,i){const B=plan(i),q=cv.getContext('2d'),W=cv.width;q.clearRect(0,0,W,W);if(!B){q.fillStyle='#ff8a8a';q.font='bold 12px system-ui';q.fillText('—',W/2-4,W/2);return}const s=W/B.R;
  B.items.forEach(it=>{const k=it.hqf?'hq':it.t==='wall'?'w':(typeof BT!=='undefined'&&BT[it.t])?'t':'f';q.fillStyle=KC[k];q.fillRect(it.x*s+.5,(B.R-(it.y+it.h))*s+.5,it.w*s-1,it.h*s-1)})}
function render(){const da=Math.floor(S.da||0);ov.innerHTML=`<div class="hd"><h2>MẪU XẾP CĂN CỨ</h2><small>50 mẫu · ${PRICE.toLocaleString('vi-VN')} Đá/mẫu · bạn có ${da.toLocaleString('vi-VN')} Đá · <span style="color:#ffd24a">■</span> trụ sở <span style="color:#ff6a6a">■</span> pháo <span style="color:#8a96ad">■</span> tường <span style="color:#5fb0ff">■</span> khác</small><button class="x" data-a="x">✕ Đóng</button></div>
  <div class="q97g">${PT.map((T,i)=>`<div class="q97c ${own(i)?'ow':''}"><canvas width="236" height="236" data-i="${i}"></canvas><b>${T.n}</b>${own(i)?`<button class="use" data-a="use" data-i="${i}">✓ Áp dụng</button>`:`<button class="buy" data-a="buy" data-i="${i}">Mua · ${PRICE.toLocaleString('vi-VN')} Đá</button>`}</div>`).join('')}</div>`;
  const cvs=[...ov.querySelectorAll('canvas')];let n=0;const nx=()=>{if(ov.style.display!=='flex'||n>=cvs.length)return;const c=cvs[n++];try{draw(c,+c.dataset.i)}catch(e){}setTimeout(nx,0)};nx()}
ov.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=+b.dataset.i;if(a==='x'){ov.style.display='none';return}
  if(a==='buy'){if((S.da||0)<PRICE){toast('Không đủ Đá — cần '+PRICE.toLocaleString('vi-VN')+' Đá');return}if(b.dataset.ok!=='1'){b.dataset.ok='1';b.textContent='Bấm lần nữa để mua';setTimeout(()=>{if(b.isConnected){b.dataset.ok='';b.textContent='Mua · '+PRICE.toLocaleString('vi-VN')+' Đá'}},2500);return}
    S.da-=PRICE;S.tplP=S.tplP||{};S.tplP[i]=1;try{save()}catch(e){}try{refresh()}catch(e){}toast('Đã mua mẫu «'+PT[i].n+'»');render();return}
  if(a==='use'){if(apply(i))ov.style.display='none'}});
function open(){ov.style.display='flex';render()}
setInterval(()=>{try{const bar=document.querySelector('#base .lt');if(bar&&!bar.querySelector('#c97b')){const b=document.createElement('button');b.id='c97b';b.className='brs';b.style.cssText='background:#3a2a0c;border-color:#ffc53d';b.textContent='🧩 Mẫu xếp';b.onclick=open;const r=bar.querySelector('#c92b')||bar.querySelector('#brot');bar.insertBefore(b,r||null)}}catch(e){}},500);
window.C97={open,apply,plan,PT};
})();
