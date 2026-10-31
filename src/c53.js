/* ===== c53: lưới ô boss — gấp đôi tàu (24 xanh nước biển · 18 xanh lá · 8 vàng · 8 đỏ); mỗi cấp boss mở 1 ô người chơi chọn; cấp 100 giảm 1 đơn vị vị trí ===== */
(function(){
if(typeof BSH==='undefined')return;
const BLK=["..rrrr..","..rrrr..","bbbbbbbb","bbbbbbbb","bbggggbb","bbggggbb","gggggggg","..gyyg..","..yyyy..","...yy..."];
const BASE=58,MAXC=(typeof GMAX!=='undefined'?GMAX:100)-1,CN={b:'Xanh nước biển',g:'Xanh lá',y:'Vàng',r:'Đỏ'},CC={b:'#3aa0ff',g:'#3ddc84',y:'#ffc53d',r:'#ff4a5a'},N4=[[1,0],[-1,0],[0,1],[0,-1]];
const cred=l=>Math.max(0,Math.min(MAXC,l-1)),pos=l=>l>=100?6:7;
const E0=[];function ext(id,w){if(!w)return (S.cx53&&S.cx53[id])||E0;S.cx53=S.cx53||{};return S.cx53[id]=S.cx53[id]||[]}
__D53__
function dec(v){const [W,H,x0,y0,cols,rows,rle,mh]=v;const base=rle.replace(/\d+/g,n=>'.'.repeat(+n)).split('/');const M=mh.split('/').map(h=>{let s='';for(const ch of h)s+=parseInt(ch,16).toString(2).padStart(4,'0');s=s.replace(/^0+/,'');return s.padStart(cols,'0').slice(-cols).split('').map(Number)});return {W,H,x0,y0,cols,rows,base,M}}
function setup(b){if(b._c53)return;const DD=D53[b.id];if(DD){b._c53=1;const q=dec(DD);b.W=q.W;b.H=q.H;b.x0=q.x0;b.y0=q.y0;b.gc=q.cols;b.gr=q.rows;b.gBase=q.base;b._mk=q.M;b._mg=null;b._k53=null;b._pr={};b._sl=null;b._br=null;
  Object.defineProperty(b,'g',{configurable:true,get(){sync(b);return b._mg},set(){}});
  Object.defineProperty(b,'pos',{configurable:true,get(){return pos(aLv(b.id))},set(){}});
  Object.defineProperty(b,'hull',{configurable:true,get(){return 'Boss · '+pos(aLv(b.id))+' đơn vị'},set(){}});return}
  b._c53=1;const W0=b.W,H0=b.H;let k=1;
  for(;k<8;k+=.05){const c=Math.floor(W0*k/56),r=Math.floor(H0*k/56);if(c>=10&&r>=12&&c*r>=210)break}
  b.W=Math.round(W0*k);b.H=Math.round(H0*k);const cols=Math.floor(b.W/56),rows=Math.floor(b.H/56);
  b.x0=Math.round((b.W-cols*56)/2);b.y0=Math.round((b.H-rows*56)/2);b.gc=cols;b.gr=rows;
  const R=Array.from({length:rows},()=>Array(cols).fill('.')),ox=Math.floor((cols-8)/2),oy=Math.max(0,Math.floor((rows-BLK.length)/2));
  BLK.forEach((row,j)=>[...row].forEach((c,i)=>{if(c!=='.'&&R[oy+j])R[oy+j][ox+i]=c}));
  b.gBase=R.map(r=>r.join(''));b._mg=null;b._k53=null;b._pr={};b._sl=null;b._br=null;
  Object.defineProperty(b,'g',{configurable:true,get(){sync(b);return b._mg},set(){}});
  Object.defineProperty(b,'pos',{configurable:true,get(){return pos(aLv(b.id))},set(){}});
  Object.defineProperty(b,'hull',{configurable:true,get(){return 'Boss · '+pos(aLv(b.id))+' đơn vị'},set(){}})}
function active(b){const m=new Map();b.gBase.forEach((row,j)=>[...row].forEach((c,i)=>{if(c!=='.')m.set(i+','+j,c)}));ext(b.id).slice(0,cred(aLv(b.id))).forEach(c=>m.set(c[0]+','+c[1],c[2]));return m}
function sync(b){const l=aLv(b.id),X=ext(b.id),key=l+'|'+X.length+'|'+(X.length?X[X.length-1].join(''):'');if(b._k53===key&&b._mg)return;b._k53=key;b._pr={};b._sl=null;b._br=null;
  const m=active(b);b._mg=b.gBase.map((row,j)=>[...row].map((c,i)=>m.get(i+','+j)||'.').join(''))}
/* mặt nạ hình boss: chỉ cho mở ô nằm trên thân boss */
function mask(b,cb){if(b._mk!==undefined){cb&&cb();return}b._mk=null;const im=new Image();im.onload=()=>{try{const sc=6,cw=Math.max(1,Math.round(b.W/sc)),ch=Math.max(1,Math.round(b.H/sc)),cv=document.createElement('canvas');cv.width=cw;cv.height=ch;const q=cv.getContext('2d');q.drawImage(im,0,0,cw,ch);const d=q.getImageData(0,0,cw,ch).data,M=[];
    for(let j=0;j<b.gr;j++){const row=[];for(let i=0;i<b.gc;i++){const x0=Math.floor((b.x0+56*i)/sc),y0=Math.floor((b.y0+56*j)/sc),n=Math.ceil(56/sc);let a=0,t=0;for(let y=y0;y<y0+n&&y<ch;y++)for(let x=x0;x<x0+n&&x<cw;x++){a+=d[(y*cw+x)*4+3];t++}row.push(t?a/t/255:0)}M.push(row)}
    const any=M.some(r=>r.some(v=>v<.9));b._mk=any?M:false}catch(e){b._mk=false}cb&&cb()};im.onerror=()=>{b._mk=false;cb&&cb()};im.src=b.img}
function onBody(b,i,j){return !b._mk||(b._mk[j]&&b._mk[j][i]>.22)}
BSH.forEach(setup);
window.C53={setup,total:l=>BASE+cred(l),cred,pos,
  free(b){return Math.max(0,cred(aLv(b.id))-ext(b.id).length)},
  cands(b){setup(b);const m=active(b),R=[];for(let j=0;j<b.gr;j++)for(let i=0;i<b.gc;i++){if(m.has(i+','+j)||!onBody(b,i,j))continue;const cs=new Set();N4.forEach(([dx,dy])=>{const v=m.get((i+dx)+','+(j+dy));if(v)cs.add(v)});if(cs.size)R.push([i,j,[...cs].sort((a,c)=>'bgyr'.indexOf(a)-'bgyr'.indexOf(c))])}return R},
  place(b,i,j,c){if(C53.free(b)<=0)return false;const ok=C53.cands(b).find(x=>x[0]===i&&x[1]===j);if(!ok||!ok[2].includes(c))return false;ext(b.id,1).push([i,j,c]);sync(b);return true}};
/* trang bị đi kèm boss (bộ tự lắp mặc định) luôn dùng được cho chính boss đó trong Kho tàu boss */
const AI={};function autoIds(id){if(AI[id])return AI[id];const b=BSH.find(x=>x.id===id);const set=new Set();try{const q=C52.raw(b,b.c0);Object.keys(q.wm||{}).forEach(i=>(q.wm[i]||[]).forEach(it=>set.add(it.id)));['arm','eng','nuc','tnk','mrd','sks'].forEach(k=>(q[k]||[]).forEach(it=>set.add(it.id)))}catch(e){}return AI[id]=set}
{const _so=shopOwn;shopOwn=function(x){if(_so.apply(this,arguments))return true;const id=window.__c53b||(window.C52&&C52.BM&&S.khob?S.khob.sel:null);const k=x&&x.id?x.id:x;return !!(id&&k&&autoIds(id).has(k))}}
{const _be=bsEquip;bsEquip=function(sh){const p=window.__c53b;window.__c53b=sh&&sh.bk?sh.id:p;try{return _be.apply(this,arguments)}finally{window.__c53b=p}}}
/* trang bị cũ trên lưới 5×6 không còn khớp: xóa để tự lắp lại trên lưới mới */
try{if(S.c53v!==3){S.c53v=3;S.c53m=1;if(S.cx53)S.cx53={};const K=S.khob;if(K){['wp','ar','en','rc','ms','sk','ct'].forEach(k=>{if(K[k])BSH.forEach(b=>delete K[k][b.id])});if(K.init)K.init={}}save()}}catch(e){console.error(e)}
/* boss địch trong chiến dịch: dùng lưới gốc 58 ô, không theo ô người chơi mở */
const CL={};{const _b=bossShip;bossShip=function(c){const b=_b.apply(this,arguments);if(!b)return b;setup(b);if(CL[b.id])return CL[b.id];const o=Object.create(b);
  Object.defineProperty(o,'g',{value:b.gBase.slice(),writable:true,configurable:true});o._pr={};o._sl=null;o._br=null;return CL[b.id]=o}}
/* --- Nâng cấp boss: tổng số ô, ô mở khóa, vị trí --- */
{const _R=window.gRows;window.gRows=function(it,l){const r=_R.apply(this,arguments);if(gKind!=='h'||!it||!it.bk)return r;const nx=Math.min(GMAX,l+1);
  const out=r.map(x=>x[0]==='Vị trí'?['Vị trí',pos(l)+' đơn vị',nx>l&&pos(nx)!==pos(l)?pos(nx)+' đơn vị':null]:x),k=out.findIndex(x=>x[0]==='Cấp boss');
  out.splice(k<0?out.length:k,0,['Tổng số ô',C53.total(l)+' ô',C53.total(nx)+' ô'],['Ô mở khóa (mỗi cấp)',cred(l)+'/'+MAXC,cred(nx)+'/'+MAXC]);return out}}
{const _l=bkList;bkList=function(){return _l.apply(this,arguments).map(x=>{const l=aLv(x.id);x.d='Boss chương '+((BSH.find(b=>b.id===x.id)||{}).k+1)+' · tổng số ô '+C53.total(l)+' (cấp 1: 24 xanh nước biển · 18 xanh lá · 8 vàng · 8 đỏ; +1 ô mỗi cấp) · chiếm '+pos(l)+' đơn vị vị trí'+(l<100?' (cấp 100 còn 6)':'')+', tính 1 slot.';return x})}}
{const _G=gRender;gRender=function(){_G.apply(this,arguments);try{if(gKind!=='h'||!window.gBK)return;const it=gList().find(x=>x.id===gSel.h);if(!it)return;const b=BSH.find(x=>x.id===it.id);
    const u=$('gunl');if(u)u.textContent=it.d;const f=C53.free(b),q=$('greq');if(q&&f>0)q.innerHTML='<span class="c53go" data-id="'+b.id+'" style="color:#7dffb0;text-decoration:underline;cursor:pointer">Còn '+f+' ô mới chưa đặt — chạm để chọn vị trí trong Kho tàu boss</span>';
    document.querySelectorAll('#glist .uc').forEach(c=>{const s2=BSH.find(x=>x.id===c.dataset.k),sm=c.querySelector('small.f');if(s2&&sm)sm.textContent=C53.total(aLv(s2.id))+' ô'})}catch(e){console.error(e)}}}
let pre=null;
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#gbtn')&&gKind==='h'&&window.gBK){const id=gSel.h;pre=[id,aLv(id)];setTimeout(()=>{if(!pre)return;const [i,l0]=pre,l1=aLv(i);pre=null;if(l1>l0)toast('Boss lên cấp '+l1+': mở khóa 1 ô mới'+(l1>=100?' · giảm còn 6 đơn vị vị trí':'')+'! Vào Kho tàu boss để chọn vị trí ô.')},0)}},true);
document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('.c53go');if(!g)return;e.stopPropagation();$('gup')&&($('gup').style.display='none');S.khob=S.khob||{};S.khob.c53=1;C52.enter(g.dataset.id)},true);
{const _r=kbRender;window.kbRender=kbRender=function(){_r.apply(this,arguments);document.querySelectorAll('#kbg small').forEach(s=>{if(/^Vị trí: 7 đơn vị/.test(s.textContent)){const k=s.closest('.kbk'),btn=k&&k.querySelector('button[data-id]'),b=btn&&BSH.find(x=>x.id===btn.dataset.id);if(b)s.textContent='Vị trí: '+pos(aLv(b.id))+' đơn vị · '+C53.total(aLv(b.id))+' ô · 1 slot'}})}}
/* --- Kho tàu boss: chế độ mở ô --- */
const st=document.createElement('style');st.textContent=`#c53b{position:absolute;left:8px;top:8px;z-index:7;padding:7px 11px;border-radius:10px;border:1px solid #ff9df0;background:#3a0b55;color:#fff;font:700 12px/1.2 inherit;cursor:pointer;box-shadow:0 0 12px #ff9df066}
#c53b.on{background:#1b7a4a;border-color:#7dffb0}#c53b small{display:block;font-weight:400;opacity:.8;font-size:10px}
.c53c{position:absolute;z-index:5;box-sizing:border-box;border:2px dashed #fff;border-radius:3px;cursor:pointer;animation:c53p 1s infinite alternate}.c53c:hover{background:#ffffff40}@keyframes c53p{from{opacity:.5}to{opacity:1}}
#c53pk{position:absolute;z-index:9;display:flex;gap:6px;padding:7px;border-radius:10px;background:#071530ee;border:1px solid #ff9df0;transform:translate(-50%,-110%)}
#c53pk button{all:unset;cursor:pointer;padding:6px 9px;border-radius:7px;color:#03101f;font:700 11px/1.2 inherit;white-space:nowrap}`;document.head.appendChild(st);
function cur(){if(!window.C52||!C52.BM)return null;const K=khS();return BSH.find(x=>x.id===K.sel&&bkOwn(x.id))||null}
function deco(){const b=cur(),host=$('khst');const o=$('c53b');if(o)o.remove();if(!b||!host)return;const K=khS(),l=aLv(b.id),f=C53.free(b);
  const tt=$('khtt');if(tt)tt.textContent='BOSS '+b.n.toUpperCase()+' · TỔNG '+C53.total(l)+' Ô · '+pos(l)+' ĐƠN VỊ VỊ TRÍ';
  if(getComputedStyle(host).position==='static')host.style.position='relative';if(f<=0)K.c53=0;
  const bt=document.createElement('button');bt.id='c53b';bt.className=K.c53?'on':'';
  bt.innerHTML=f>0?(K.c53?'✓ ĐANG CHỌN Ô MỚI':'＋ MỞ Ô MỚI')+'<small>Còn '+f+' ô · tổng '+C53.total(l)+' ô</small>':'TỔNG '+C53.total(l)+' Ô<small>'+(l<GMAX?'Lên cấp '+(l+1)+' để mở thêm 1 ô':'Đã mở đủ ô')+'</small>';host.appendChild(bt);
  const sh=$('khsh');if(!sh||!K.c53||f<=0)return;if(b._mk===undefined){mask(b,()=>khRender());return}const pc=v=>v/b.W*100,ph=v=>v/b.H*100;
  sh.insertAdjacentHTML('beforeend',C53.cands(b).map(([i,j,cs])=>`<div class="c53c" data-c53="${i},${j}" title="${cs.map(c=>CN[c]).join(' / ')}" style="left:${pc(b.x0+56*i)}%;top:${ph(b.y0+56*j)}%;width:${pc(56)}%;height:${ph(56)}%;background:${cs.length===1?CC[cs[0]]+'55':'linear-gradient(135deg,'+cs.map(c=>CC[c]+'66').join(',')+')'};border-color:${cs.length===1?CC[cs[0]]:'#fff'}"></div>`).join(''))}
{const _K=khRender;khRender=function(){const r=_K.apply(this,arguments);try{deco()}catch(e){console.error(e)}return r}}
function pick(b,i,j,cs,el){const old=$('c53pk');if(old)old.remove();
  const done=c=>{if(C53.place(b,i,j,c)){save();toast('Đã mở 1 ô '+CN[c]+' cho boss · còn '+C53.free(b)+' ô');khRender()}};
  if(cs.length===1){done(cs[0]);return}
  const p=document.createElement('div');p.id='c53pk';p.style.left=el.style.left;p.style.top=el.style.top;
  p.innerHTML=cs.map(c=>`<button data-k="${c}" style="background:${CC[c]}">${CN[c]}</button>`).join('');
  p.onclick=e=>{const x=e.target.closest('button');if(!x)return;e.stopPropagation();p.remove();done(x.dataset.k)};$('khsh').appendChild(p)}
document.addEventListener('click',e=>{const t=e.target;if(!t.closest)return;
  if(t.closest('#c53b')){e.stopPropagation();const b=cur();if(!b||C53.free(b)<=0){toast('Chưa có ô mới — mỗi cấp boss mở 1 ô');return}const K=khS();K.c53=K.c53?0:1;khRender();return}
  if(t.closest('#c53pk'))return;
  const c=t.closest('.c53c');if(c){e.stopPropagation();e.preventDefault();const b=cur(),[i,j]=c.dataset.c53.split(',').map(Number),cd=b&&C53.cands(b).find(x=>x[0]===i&&x[1]===j);if(cd)pick(b,i,j,cd[2],c);return}
  const p=$('c53pk');if(p)p.remove()},true);
})();
