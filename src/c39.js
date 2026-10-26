
/* ===== c39: Thảm chiến trường — 1 thảm mặc định + 60 thảm (6 hạng × 10 mẫu) bán trong Cửa hàng, buff cho toàn bộ công trình khi vào trận ===== */
(function(){
if(typeof S==='undefined')return;
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
const TIERS=[
 {k:'cb',n:'Cơ bản',da:5000,sao:50,V:20,d:'Thiết kế cơ bản, gần gũi với người chơi thông thường.'},
 {k:'bd',n:'Bình dân',da:10000,sao:200,V:50,d:'Thiết kế bình dân, hơn người chơi thông thường một bậc.'},
 {k:'st',n:'Sử thi',da:20000,sao:400,V:150,d:'Dành cho những con người phiêu lưu mang tính sử thi.'},
 {k:'ht',n:'Huyền thoại',da:40000,sao:1000,V:300,d:'Dành cho các chiến binh huyền thoại và hùng vĩ.'},
 {k:'tt',n:'Tối thượng',da:100000,sao:6000,V:600,d:'Thảm tối thượng dành cho các vị thần.'},
 {k:'ng',n:'Người giàu',da:300000,sao:10000,V:1000,arm:500,d:'Dành cho người giàu — mạnh nhất game hiện tại.'}];
/* 10 kiểu buff, giá trị tương đương nhau theo hạng (V = máu tối đa của hạng) */
const KINDS=[
 {k:'hp', n:'Lưới Thép',     h:205,txt:V=>`+${NF(V)} máu tối đa nữa cho mọi công trình`},
 {k:'dmg',n:'Sọc Lửa',       h:12, txt:V=>`+${r1(V*.06)}% sát thương công trình`},
 {k:'rof',n:'Xoáy Gió',      h:175,txt:V=>`+${r1(V*.04)}% tốc độ bắn công trình`},
 {k:'rng',n:'Mắt Ưng',       h:48, txt:V=>`+${r1(V*.02)}% tầm bắn công trình`},
 {k:'red',n:'Vảy Rồng',      h:140,txt:V=>`Công trình nhận ít hơn ${r1(Math.min(50,V*.03))}% sát thương`},
 {k:'reg',n:'Lá Hồi Sinh',   h:110,txt:V=>`Công trình hồi ${r1(V/50)} máu mỗi giây`},
 {k:'shd',n:'Lục Giác',      h:190,txt:V=>`Mỗi công trình có khiên ${NF(V)} khi vào trận`},
 {k:'hq', n:'Thành Trì',     h:32, txt:V=>`Trụ sở được thêm ${NF(V*3)} máu tối đa`},
 {k:'rage',n:'Nộ Khí',       h:355,txt:V=>`Trụ sở dưới 50% máu: +${r1(V*.12)}% sát thương công trình`},
 {k:'rev',n:'Phượng Hoàng',  h:22, txt:V=>`Công trình bị phá lần đầu sẽ hồi sinh với ${NF(V)} máu`}];
function r1(x){return String(Math.round(x*10)/10).replace('.',',')}
const CP=[{id:'cp0',n:'Thảm Xanh Mặc Định',tier:-1,kind:-1,da:0,sao:0}];
TIERS.forEach((t,ti)=>KINDS.forEach((k,ki)=>CP.push({id:'cp'+t.k+ki,n:'Thảm '+k.n+' · '+t.n,tier:ti,kind:ki,da:t.da,sao:t.sao})));
const own=c=>c.id==='cp0'||!!(S.own&&S.own[c.id]);
const cur=()=>{const c=CP.find(x=>x.id===S.carpet);return c&&own(c)?c:CP[0]};
function desc(c){if(c.tier<0)return ['Thảm xanh tiêu chuẩn bên dưới công trình.'];const t=TIERS[c.tier],k=KINDS[c.kind],L=[`+${NF(t.V)} máu tối đa cho mọi công trình`];if(t.arm)L.push(`+${NF(t.arm)} giáp (khiên) cho mọi công trình`);L.push(k.txt(t.V));return L}

/* ---------- vẽ thảm (ô lặp 256×256) ---------- */
const CV={};
function tile(c){if(CV[c.id])return CV[c.id];const N=256,cv=document.createElement('canvas');cv.width=cv.height=N;const q=cv.getContext('2d');CV[c.id]=cv;
  if(c.tier<0){q.fillStyle='#0d2a66';q.fillRect(0,0,N,N);q.strokeStyle='rgba(79,216,255,.35)';q.lineWidth=2;for(let i=0;i<=N;i+=64){q.beginPath();q.moveTo(i,0);q.lineTo(i,N);q.moveTo(0,i);q.lineTo(N,i);q.stroke()}return cv}
  const T=c.tier,K=KINDS[c.kind],h=K.h,sat=[22,40,55,65,75,70][T],li=[24,28,26,28,32,14][T],acc=`hsl(${h},${[35,60,80,90,100,90][T]}%,${[52,55,60,62,70,58][T]}%)`;
  const g=q.createLinearGradient(0,0,N,N);g.addColorStop(0,`hsl(${h},${sat}%,${li+6}%)`);g.addColorStop(1,`hsl(${(h+30)%360},${sat}%,${li-6}%)`);q.fillStyle=g;q.fillRect(0,0,N,N);
  q.save();q.strokeStyle=acc;q.fillStyle=acc;q.globalAlpha=[.35,.45,.55,.6,.7,.7][T];q.lineWidth=[2,2.5,3,3,3.5,3.5][T];
  const P=c.kind;
  if(P===0){for(let i=0;i<=N;i+=32){q.beginPath();q.moveTo(i,0);q.lineTo(i,N);q.moveTo(0,i);q.lineTo(N,i);q.stroke()}for(let x=16;x<N;x+=64)for(let y=16;y<N;y+=64){q.beginPath();q.arc(x,y,4,0,7);q.fill()}}
  else if(P===1){for(let i=-N;i<N*2;i+=40){q.beginPath();q.moveTo(i,0);q.bezierCurveTo(i+30,N*.3,i-20,N*.6,i+20,N);q.lineTo(i+34,N);q.bezierCurveTo(i-6,N*.6,i+44,N*.3,i+14,0);q.closePath();q.globalAlpha*=.6;q.fill();q.globalAlpha/=.6}}
  else if(P===2){for(let k=0;k<4;k++){const cx=(k%2)*128+64,cy=Math.floor(k/2)*128+64;q.beginPath();for(let a=0;a<14;a+=.1){const r=a*4;q.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}q.stroke()}}
  else if(P===3){for(let k=0;k<4;k++){const cx=(k%2)*128+64,cy=Math.floor(k/2)*128+64;[48,32,16].forEach(r=>{q.beginPath();q.arc(cx,cy,r,0,7);q.stroke()});q.beginPath();q.moveTo(cx-56,cy);q.lineTo(cx+56,cy);q.moveTo(cx,cy-56);q.lineTo(cx,cy+56);q.stroke()}}
  else if(P===4){for(let y=0;y<N+32;y+=24)for(let x=(y/24%2)*16;x<N+32;x+=32){q.beginPath();q.arc(x,y,16,0,Math.PI);q.stroke()}}
  else if(P===5){for(let x=32;x<N;x+=64)for(let y=32;y<N;y+=64){q.save();q.translate(x,y);for(let r=0;r<4;r++){q.rotate(Math.PI/2);q.beginPath();q.ellipse(0,-14,7,14,0,0,7);q.globalAlpha*=.7;q.fill();q.globalAlpha/=.7}q.restore()}}
  else if(P===6){const r=22,hh=r*Math.sqrt(3);for(let j=-1;j<8;j++)for(let i=-1;i<9;i++){const cx=i*r*1.5,cy=j*hh+(i%2?hh/2:0);q.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;q.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}q.closePath();q.stroke()}}
  else if(P===7){for(let y=0;y<N;y+=32){for(let x=(y/32%2)*32;x<N+64;x+=64){q.strokeRect(x-30,y+2,60,28)}}q.globalAlpha*=.6;for(let x=0;x<N;x+=32)q.fillRect(x,0,16,8)}
  else if(P===8){for(let k=0;k<6;k++){const x0=k*48+10;q.beginPath();q.moveTo(x0,0);q.lineTo(x0+18,70);q.lineTo(x0+4,90);q.lineTo(x0+26,170);q.lineTo(x0+10,190);q.lineTo(x0+30,N);q.stroke()}}
  else if(P===9){for(let k=0;k<4;k++){const cx=(k%2)*128+64,cy=Math.floor(k/2)*128+76;for(let f=-3;f<=3;f++){q.beginPath();q.ellipse(cx+f*9,cy-10-Math.abs(f)*-3,5,28,f*.25,0,7);q.stroke()}q.beginPath();q.arc(cx,cy+16,8,0,7);q.fill()}}
  q.restore();
  /* trang trí theo hạng: viền, ánh kim, lấp lánh, đá quý */
  q.save();if(T>=1){q.strokeStyle=T>=3?'rgba(255,210,90,.85)':'rgba(220,235,255,.55)';q.lineWidth=T>=3?6:4;q.strokeRect(3,3,N-6,N-6)}
  if(T>=2){q.strokeStyle=T>=3?'rgba(255,230,140,.6)':'rgba(200,220,255,.4)';q.lineWidth=2;q.strokeRect(12,12,N-24,N-24);[[12,12],[N-12,12],[12,N-12],[N-12,N-12]].forEach(([x,y])=>{q.fillStyle=q.strokeStyle;q.beginPath();q.arc(x,y,6,0,7);q.fill()})}
  if(T>=4){for(let i=0;i<40;i++){const x=(i*97)%N,y=(i*61+i*i*7)%N,s=1+i%3;const gg=q.createRadialGradient(x,y,0,x,y,s*4);gg.addColorStop(0,'rgba(255,255,255,.95)');gg.addColorStop(1,'rgba(255,240,200,0)');q.fillStyle=gg;q.beginPath();q.arc(x,y,s*4,0,7);q.fill()}}
  if(T>=5){[[N/2,8],[N/2,N-8],[8,N/2],[N-8,N/2],[N/2,N/2]].forEach(([x,y],i)=>{q.save();q.translate(x,y);q.rotate(Math.PI/4);q.fillStyle=['#ff3b6b','#3bd2ff','#7dff6a','#c070ff','#ffd24a'][i];q.shadowColor='#fff';q.shadowBlur=10;q.fillRect(-7,-7,14,14);q.strokeStyle='#ffe28a';q.lineWidth=2;q.strokeRect(-7,-7,14,14);q.restore()})}
  q.restore();return cv}
const THUMB={};function thumb(c){if(THUMB[c.id])return THUMB[c.id];const cv=document.createElement('canvas');cv.width=cv.height=128;const q=cv.getContext('2d');q.drawImage(tile(c),0,0,256,256,0,0,128,128);return THUMB[c.id]=cv.toDataURL('image/png')}
window.C39={CP,TIERS,KINDS,tile,thumb,cur};

/* ---------- hiển thị thảm: sảnh Trụ sở, trận 2D, trận 3D ---------- */
function paintBase(){try{const bd=document.getElementById('bboard'),p=bd&&bd.querySelector('.bplay');if(!p)return;const c=cur();let m=bd.querySelector('.c39mat');
  if(c.id==='cp0'){if(m)m.remove();return}
  if(!m){m=document.createElement('div');m.className='c39mat';m.style.cssText='position:absolute;pointer-events:none;z-index:0;opacity:.9';bd.insertBefore(m,bd.firstChild)}
  ['left','top','width','height'].forEach(k=>m.style[k]=p.style[k]);if(m.dataset.cp!==c.id){m.dataset.cp=c.id;m.style.backgroundImage=`linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),url(${thumb(c)})`;m.style.backgroundSize='auto,calc(var(--c)*4) calc(var(--c)*4)'}}catch(e){}}
if(typeof bRender==='function'){const _b=bRender;bRender=function(){const r=_b.apply(this,arguments);paintBase();return r}}
C39.pat2=function(q,s,bx,by){const c=cur();if(c.id==='cp0')return null;try{const pt=q.createPattern(tile(c),'repeat'),k=s*4/256;if(pt.setTransform)pt.setTransform(new DOMMatrix([k,0,0,k,bx,by]));return pt}catch(e){return null}};
C39.pad3=function(pad,pw,pd,T){const c=cur();if(c.id==='cp0')return;const tx=new T.CanvasTexture(tile(c));tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(pw/4,pd/4);tx.encoding=T.sRGBEncoding;
  pad.material=new T.MeshStandardMaterial({map:tx,roughness:.75,metalness:.25,emissive:0xffffff,emissiveMap:tx,emissiveIntensity:.18,color:0xb0b8c8})};

/* ---------- buff khi vào trận ---------- */
function apply(G){if(!G||G.c39||G.pv||G.c18sim||!G.bl)return;G.c39=1;const c=cur();if(c.tier<0)return;const t=TIERS[c.tier],K=KINDS[c.kind].k,V=t.V,DB=typeof DFB!=='undefined'?DFB:50;
  const B=G.bl.filter(b=>b&&b.t!=='mine'&&b.hp>0);G.c39f={c,K,V,DB};
  B.forEach(b=>{let add=V+(K==='hp'?V:0)+(K==='hq'&&(b.hq||b.t==='hq')?V*3:0);b.max+=add/DB;b.hp+=add/DB;
    const sh=(t.arm||0)+(K==='shd'?V:0);if(sh>0){const v=sh/DB;b.shd={v:(b.shd&&b.shd.v||0)+v,max:(b.shd&&b.shd.max||0)+v,t:1e9}}});
  G.pb=G.pb||{dm:1,cdm:1,rm:1};if(K==='dmg')G.pb.dm*=1+V*.06/100;if(K==='rof')G.pb.cdm/=1+V*.04/100;if(K==='rng')G.pb.rm*=1+V*.02/100;G.c39dm=G.pb.dm}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&!G.c39)apply(G);const F=G&&G.c39f;if(F&&dt>0){
    if(F.K==='reg')G.bl.forEach(b=>{if(b.hp>0&&b.hp<b.max&&b.t!=='mine')b.hp=Math.min(b.max,b.hp+F.V/50/F.DB*dt)});
    if(F.K==='rage'&&G.pb){const hq=G.hq,low=hq&&hq.hp>0&&hq.hp<hq.max*.5;G.pb.dm=(G.c39dm||1)*(low?1+F.V*.12/100:1);G.c39low=low}}}catch(e){console.error(e)}return r}}
{const _B=dfDmgB;dfDmgB=function(b,d){try{const G=DG,F=G&&G.c39f;if(F&&b&&G.bl.includes(b)&&b.hp>0){if(F.K==='red')d*=1-Math.min(50,F.V*.03)/100;
    if(F.K==='rev'&&!b.c39rv&&b.t!=='mine'){const sv=(b.shd&&b.shd.t>0&&b.shd.v)||0;if(b.hp+sv-d*(1-(b.red||0))<=0){b.c39rv=1;b.hp=F.V/F.DB;b.flash=.4;try{G.fx.push({x:b.x,y:b.y,r:Math.max(b.w,b.h)*1.2,t:.7,max:.7,col:'#ffb040'})}catch(e){}return}}}}catch(e){}return _B.apply(this,arguments)}}

/* ---------- Cửa hàng: thêm thẻ "Thảm chiến trường" ---------- */
if(typeof STT!=='undefined'&&!STT.some(t=>t[0]==='m'))STT.push(['m','Thảm chiến trường']);
let CF='all';
function renderCarpets(keep){const o=document.getElementById('storeov');if(!o)return;const sc=o.scrollTop,F=NF,C=cur();
  const L=CP.filter(c=>CF==='all'||(CF==='own'?own(c):String(c.tier)===CF));
  o.innerHTML=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><b style="font-size:20px">${ST.only==='m'?'THẢM CHIẾN TRƯỜNG':'CỬA HÀNG'}</b><span style="flex:1"></span><span class="chip d">Đá: ${F(S.da)}</span><span class="chip s">Sao: ${F(S.sao)}</span><button id="stx" aria-label="Đóng" style="font-size:22px;background:none;border:0;color:#fff">×</button></div>`+
  (ST.only==='m'?'':`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">`+STT.map(t=>`<button data-t="${t[0]}" style="padding:6px 12px;border-radius:8px;border:1px solid #1c4fc9;background:${ST.tab===t[0]?'#1c4fc9':'#0c2358'};color:#fff;font-weight:700">${t[1]}</button>`).join('')+`</div>`)+`
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">`+[['all','Tất cả'],['own','Đã sở hữu']].concat(TIERS.map((t,i)=>[String(i),t.n])).map(f=>`<button data-cf="${f[0]}" style="padding:4px 10px;border-radius:14px;border:1px solid #2b6bff;background:${CF===f[0]?'#2b6bff':'#0a1a3d'};color:#fff;font-size:12px;font-weight:700">${f[1]}</button>`).join('')+`</div>
  <div style="opacity:.8;margin-bottom:8px">Thảm trải dưới căn cứ, buff cho <b>toàn bộ công trình</b> khi vào trận Level và PvP. Đang dùng: <b style="color:#7dffb0">${C.n}</b></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px">`+L.map(c=>{const t=c.tier>=0?TIERS[c.tier]:null,ok=S.da>=c.da&&S.sao>=c.sao,on=C.id===c.id,mine=own(c),col=['#9fb4d0','#7dd3ff','#c58bff','#ffc53d','#fff3b0','#ff6ad5'][c.tier]||'#7dffb0';
    return `<div style="background:#0a1a3d;border:1px solid ${on?'#7dffb0':'#1c4fc9'};border-radius:10px;padding:8px;text-align:center;${on?'box-shadow:0 0 12px rgba(125,255,176,.4)':''}"><img src="${thumb(c)}" alt="" style="width:100%;aspect-ratio:1;border-radius:8px;display:block;object-fit:cover">
      <b style="display:block;font-size:13px;margin-top:6px;min-height:34px">${c.n}</b>${t?`<div style="font-size:11px;font-weight:800;color:${col}">HẠNG ${t.n.toUpperCase()}</div>`:''}
      <div style="font-size:11px;color:#bfe0ff;text-align:left;margin:4px 0;min-height:42px">${desc(c).map(x=>'• '+x).join('<br>')}</div>`+
      (on?`<div style="padding:6px;color:#7dffb0;font-weight:800">Đang dùng</div>`:mine?`<button data-cpe="${c.id}" style="width:100%;padding:6px;border-radius:8px;border:1px solid #7dffb0;background:#145c3a;color:#fff;font-weight:800">Trải thảm</button>`:
      `<button data-cpb="${c.id}" style="width:100%;padding:6px;border-radius:8px;border:1px solid ${ok?'#ffc53d':'#555'};background:${ok?'#b36b00':'#222'};color:#fff;font-weight:700;line-height:1.2">${F(c.da)} Đá<br>${F(c.sao)} Sao</button>`)+`</div>`}).join('')+`</div>`;
  if(!o.dataset.c39){o.dataset.c39=1;o.addEventListener('click',e=>{if(ST.tab!=='m')return;const f=e.target.closest('[data-cf]');if(f){CF=f.dataset.cf;renderCarpets(true);return}
    const q=e.target.closest('[data-cpe]');if(q){S.carpet=q.dataset.cpe;try{save()}catch(x){}paintBase();renderCarpets(true);try{toast('Đã trải '+CP.find(c=>c.id===S.carpet).n)}catch(x){}return}
    const b=e.target.closest('[data-cpb]');if(b){const c=CP.find(x=>x.id===b.dataset.cpb);if(!c||own(c))return;if(S.da<c.da||S.sao<c.sao){toast('Không đủ '+(S.da<c.da?'Đá':'Sao'));return}
      S.da-=c.da;S.sao-=c.sao;S.own=S.own||{};S.own[c.id]=1;S.carpet=c.id;try{save()}catch(x){}try{refresh()}catch(x){}paintBase();renderCarpets(true);toast('Đã mua và trải '+c.n)}})}
  if(keep)o.scrollTop=sc}
{const _r=stRender;stRender=function(keep,focus){if(ST.tab==='m')return renderCarpets(keep);return _r.apply(this,arguments)}}
function openCarpets(){try{ST.tab='m';ST.only='m';C39.inOpen=1;stOpen()}catch(e){console.error(e)}finally{C39.inOpen=0}}
{const _o=stOpen;stOpen=function(){if(!C39.inOpen){ST.only=null;if(ST.tab==='m')ST.tab='w'}return _o.apply(this,arguments)}}
C39.open=openCarpets;

/* ---------- nút "Thảm chiến trường" ở sảnh (cạnh Trụ sở) ---------- */
function lobbyBtn(){const t=document.getElementById('tsf');if(!t||!t.parentElement)return;let b=document.getElementById('c39btn');
  if(!b){b=document.createElement('button');b.id='c39btn';b.className='tsf';b.setAttribute('aria-label','Thảm chiến trường');b.innerHTML='<img alt="" style="width:34px;height:34px;border-radius:6px;object-fit:cover"><span>Thảm chiến trường</span>';b.onclick=openCarpets;t.parentElement.appendChild(b)}
  const im=b.querySelector('img'),c=cur();if(im.dataset.id!==c.id){im.dataset.id=c.id;im.src=thumb(c)}
  const cs=t.style;b.style.display=getComputedStyle(t).display==='none'?'none':'flex';b.style.width=cs.width;b.style.height=cs.height;b.style.bottom=cs.bottom;b.style.left='calc('+(cs.left||'10px')+' + '+(cs.width||'153px')+' + 8px)';b.style.flexDirection='column';b.style.alignItems='center';b.style.justifyContent='center';b.style.gap='4px'}
setInterval(lobbyBtn,600);lobbyBtn();
})();
