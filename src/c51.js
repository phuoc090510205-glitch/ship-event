/* ===== c51: lưới ô tàu theo cấp — cấp 1: 12 xanh nước biển · 9 xanh lá · 4 vàng · 4 đỏ; mỗi 4 cấp mở 1 ô do người chơi chọn (cạnh ô đang có, màu theo ô bên cạnh) · giá Sao nâng cấp tàu 2×cấp ===== */
(function(){
if(typeof KSH==='undefined')return;
const Q={b:12,g:9,y:4,r:4},CN={b:'Xanh nước biển',g:'Xanh lá',y:'Vàng',r:'Đỏ'},CC={b:'#3aa0ff',g:'#3ddc84',y:'#ffc53d',r:'#ff4a5a'};
const credits=l=>Math.floor(l/4),MAXC=credits(typeof GMAX!=='undefined'?GMAX:100);
const N4=[[1,0],[-1,0],[0,1],[0,-1]];
function base(sh){if(sh._b51&&sh._b51f===sh.gFull)return sh._b51;const F=sh.gFull,H=F.length,W=F[0].length,sel=new Set(),out=[];
  ['r','y','g','b'].forEach(k=>{const all=[];F.forEach((row,j)=>[...row].forEach((c,i)=>{if(c===k)all.push([i,j])}));
    const q=Q[k];if(all.length<=q){all.forEach(c=>{sel.add(c[0]+','+c[1]);out.push([c[0],c[1],k])});return}
    const n=all.length,cx=all.reduce((t,c)=>t+c[0],0)/n,cy=all.reduce((t,c)=>t+c[1],0)/n,isK=(i,j)=>F[j]&&F[j][i]===k,key=(i,j)=>i+','+j,mine=new Set();
    const d=c=>Math.hypot(c[0]-cx,c[1]-cy)+Math.abs(c[0]-(W-1)/2)*.01;
    const add=c=>{const s=key(c[0],c[1]);if(mine.has(s))return;mine.add(s);sel.add(s);out.push([c[0],c[1],k])};
    while(mine.size<q){let fr=all.filter(c=>!mine.has(key(c[0],c[1]))&&(mine.size===0||N4.some(([dx,dy])=>mine.has(key(c[0]+dx,c[1]+dy)))));
      if(!fr.length)fr=all.filter(c=>!mine.has(key(c[0],c[1])));if(!fr.length)break;
      fr.sort((a,b)=>d(a)-d(b));const c=fr[0];add(c);const m=[W-1-c[0],c[1]];
      if(mine.size<q&&m[0]!==c[0]&&isK(m[0],m[1]))add(m)}});
  sh._b51f=sh.gFull;return sh._b51=out}
const E0=[];function ext(id,w){if(!w)return (S.cx51&&S.cx51[id])||E0;S.cx51=S.cx51||{};return S.cx51[id]=S.cx51[id]||[]}
function activeSet(sh){const l=shLv(sh.id),X=ext(sh.id).slice(0,credits(l)),m=new Map();base(sh).forEach(c=>m.set(c[0]+','+c[1],c[2]));X.forEach(c=>m.set(c[0]+','+c[1],c[2]));return m}
shSync=function(sh){if(!sh||sh.nolock||!sh.gFull||sh.bk)return;const l=shLv(sh.id),X=ext(sh.id),key=l+'|'+X.length+'|'+X.map(c=>c.join('')).join(';');
  if(sh._k51===key&&sh._mg)return;sh._k51=key;sh._mlv=l;sh._pr={};sh._sl=null;sh._br=null;
  const F=sh.gFull,m=activeSet(sh);sh._mg=F.map((row,j)=>[...row].map((c,i)=>m.get(i+','+j)||'.').join(''))};
KSH.forEach(sh=>{sh._mg=null;sh._k51=null});
window.C51={Q,base,credits,MAXC,total:l=>29+credits(l),
  free(sh){return Math.max(0,credits(shLv(sh.id))-ext(sh.id).length)},
  cands(sh){shSync(sh);const F=sh.gFull,m=activeSet(sh),R=[];F.forEach((row,j)=>[...row].forEach((c,i)=>{if(c==='.'||m.has(i+','+j))return;const cs=new Set();N4.forEach(([dx,dy])=>{const v=m.get((i+dx)+','+(j+dy));if(v)cs.add(v)});if(cs.size)R.push([i,j,[...cs].sort((a,b)=>'bgyr'.indexOf(a)-'bgyr'.indexOf(b))])}));return R},
  place(sh,i,j,c){if(C51.free(sh)<=0)return false;const ok=C51.cands(sh).find(x=>x[0]===i&&x[1]===j);if(!ok||!ok[2].includes(c))return false;ext(sh.id,1).push([i,j,c]);shSync(sh);return true}};
/* --- giá Sao khi nâng cấp tàu: cấp l cần 2×l Sao --- */
{const _g=gCost;gCost=function(k,it){const r=_g.apply(this,arguments);if(k==='h'&&it&&!it.bk){const l=aLv(it.id);return {da:r.da,sao:2*l}}return r}}
/* --- màn nâng cấp tàu: tổng số ô thay cho khung ô --- */
{const _R=window.gRows;window.gRows=function(it,l){const r=_R.apply(this,arguments);if(gKind!=='h'||!it||it.bk)return r;const sh=KSH.find(x=>x.id===it.id);if(!sh)return r;
  const nx=Math.min(GMAX,l+1),out=r.filter(x=>x[0]!=='Ô mở khóa'&&x[0]!=='Khung ô'),k=out.findIndex(x=>x[0]==='Cấp tàu');
  const add=[['Tổng số ô',C51.total(l)+' ô',C51.total(nx)+' ô'],['Ô mở khóa (mỗi 4 cấp)',credits(l)+'/'+MAXC,credits(nx)+'/'+MAXC]];
  out.splice(k<0?out.length:k,0,...add);return out}}
{const _G=gRender;gRender=function(){_G.apply(this,arguments);try{if(gKind!=='h')return;const L=gList(),it=L.find(x=>x.id===gSel.h)||L[0];if(!it||it.bk)return;const sh=KSH.find(x=>x.id===it.id);if(!sh)return;const l=aLv(it.id);
    const u=$('gunl');if(u)u.textContent='Thân '+sh.hull+' · tổng số ô '+C51.total(l)+' (cấp 1: 12 xanh nước biển · 9 xanh lá · 4 vàng · 4 đỏ; +1 ô mỗi 4 cấp).';
    const f=C51.free(sh),q=$('greq');if(q&&f>0){q.innerHTML='<span class="c51go" data-id="'+sh.id+'" style="color:#7dffb0;text-decoration:underline;cursor:pointer">Còn '+f+' ô mới chưa đặt — chạm để chọn vị trí trong Kho tàu</span>'}
    document.querySelectorAll('#glist .uc').forEach(c=>{const s2=KSH.find(x=>x.id===c.dataset.k);const sm=c.querySelector('small.f');if(s2&&sm)sm.textContent=C51.total(aLv(s2.id))+' ô'})}catch(e){console.error(e)}}}
let pre=null;
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#gbtn')&&gKind==='h'){const it=gList().find(x=>x.id===gSel.h);pre=it&&!it.bk?[it.id,aLv(it.id)]:null;setTimeout(()=>{if(!pre)return;const [id,l0]=pre,l1=aLv(id);pre=null;if(credits(l1)>credits(l0))toast('Tàu đạt cấp '+l1+': mở khóa 1 ô mới! Vào Kho tàu để chọn vị trí ô.')},0)}},true);
document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('.c51go');if(!g)return;e.stopPropagation();const K=khS();if(shipOpen(g.dataset.id))K.sel=g.dataset.id;K.c51=1;$('gup')&&($('gup').style.display='none');openKho()},true);
/* --- Kho tàu: chế độ mở ô --- */
const st=document.createElement('style');st.textContent=`#c51b{position:absolute;left:8px;top:8px;z-index:7;padding:7px 11px;border-radius:10px;border:1px solid #4fd8ff;background:#0b2a55;color:#fff;font:700 12px/1.2 inherit;cursor:pointer;box-shadow:0 0 12px #4fd8ff66}
#c51b.on{background:#1b7a4a;border-color:#7dffb0}#c51b small{display:block;font-weight:400;opacity:.8;font-size:10px}
.c51c{position:absolute;z-index:5;box-sizing:border-box;border:2px dashed #fff;border-radius:3px;cursor:pointer;animation:c51p 1s infinite alternate}
.c51c:hover{background:#ffffff40}@keyframes c51p{from{opacity:.55}to{opacity:1}}
#c51pk{position:absolute;z-index:9;display:flex;gap:6px;padding:7px;border-radius:10px;background:#071530ee;border:1px solid #4fd8ff;transform:translate(-50%,-110%)}
#c51pk button{all:unset;cursor:pointer;padding:6px 9px;border-radius:7px;color:#03101f;font:700 11px/1.2 inherit;white-space:nowrap}`;document.head.appendChild(st);
function deco(){const K=khS(),cur=KSH.find(x=>x.id===K.sel),host=$('khst');if(!cur||!host||cur.bk)return;const f=C51.free(cur);
  const tt=$('khtt');if(tt)tt.textContent=cur.n.toUpperCase()+' · TỔNG '+C51.total(shLv(cur.id))+' Ô';document.querySelectorAll('#khlist .khc').forEach(c=>{const s2=KSH.find(x=>x.id===c.dataset.id),i=c.querySelector('.nm i');if(s2&&i&&!s2.bk)i.textContent=C51.total(shLv(s2.id))+' ô'});
  if(getComputedStyle(host).position==='static')host.style.position='relative';
  const old=$('c51b');if(old)old.remove();if(f<=0){K.c51=0}
  const b=document.createElement('button');b.id='c51b';b.className=K.c51?'on':'';
  b.innerHTML=f>0?(K.c51?'✓ ĐANG CHỌN Ô MỚI':'＋ MỞ Ô MỚI')+'<small>Còn '+f+' ô · tổng '+C51.total(shLv(cur.id))+' ô</small>':'TỔNG '+C51.total(shLv(cur.id))+' Ô<small>Ô mới tiếp theo ở cấp '+(4*(credits(shLv(cur.id))+1)>GMAX?'—':4*(credits(shLv(cur.id))+1))+'</small>';
  host.appendChild(b);
  const sh=$('khsh');if(!sh||!K.c51||f<=0)return;const pc=v=>v/cur.W*100,ph=v=>v/cur.H*100;
  sh.insertAdjacentHTML('beforeend',C51.cands(cur).map(([i,j,cs])=>`<div class="c51c" data-c51="${i},${j}" title="${cs.map(c=>CN[c]).join(' / ')}" style="left:${pc(cur.x0+56*i)}%;top:${ph(cur.y0+56*j)}%;width:${pc(56)}%;height:${ph(56)}%;background:${cs.length===1?CC[cs[0]]+'55':'linear-gradient(135deg,'+cs.map(c=>CC[c]+'66').join(',')+')'};border-color:${cs.length===1?CC[cs[0]]:'#fff'}"></div>`).join(''))}
{const _K=khRender;khRender=function(){const r=_K.apply(this,arguments);try{deco()}catch(e){console.error(e)}return r}}
function pick(cur,i,j,cs,el){const old=$('c51pk');if(old)old.remove();
  const done=c=>{if(C51.place(cur,i,j,c)){save();toast('Đã mở 1 ô '+CN[c]+' · tổng '+(29+ext(cur.id).length)+' ô');khRender()}};
  if(cs.length===1){done(cs[0]);return}
  const p=document.createElement('div');p.id='c51pk';p.style.left=el.style.left;p.style.top=el.style.top;
  p.innerHTML=cs.map(c=>`<button data-k="${c}" style="background:${CC[c]}">${CN[c]}</button>`).join('');
  p.onclick=e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();p.remove();done(b.dataset.k)};$('khsh').appendChild(p)}
document.addEventListener('click',e=>{const t=e.target;if(!t.closest)return;
  if(t.closest('#c51b')){e.stopPropagation();const K=khS(),cur=KSH.find(x=>x.id===K.sel);if(!cur||C51.free(cur)<=0){toast('Chưa có ô mới để mở — mỗi 4 cấp tàu mở 1 ô');return}K.c51=K.c51?0:1;khRender();return}
  if(t.closest('#c51pk'))return;
  const c=t.closest('.c51c');if(c){e.stopPropagation();e.preventDefault();const K=khS(),cur=KSH.find(x=>x.id===K.sel),[i,j]=c.dataset.c51.split(',').map(Number),cd=C51.cands(cur).find(x=>x[0]===i&&x[1]===j);if(cd)pick(cur,i,j,cd[2],c);return}
  const p=$('c51pk');if(p&&!t.closest('#c51pk'))p.remove()},true);
})();
