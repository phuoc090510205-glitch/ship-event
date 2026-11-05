/* ===== c107: NHIỀU CĂN CỨ — căn cứ 1 rộng 11×11, cứ 5 cấp trụ sở căn cứ mới nhất rộng thêm 1 ô; đủ 23×23 thì mở căn cứ tiếp theo.
   Mỗi công trình thuộc 1 căn cứ (S.base.bk). Căn cứ có trụ sở luôn đứng cuối hàng dọc. Màn chơi/đấu boss dùng căn cứ có trụ sở.
   Số công trình được dùng = theo thứ tự mở khóa, tới khi lấp ~62% diện tích các căn cứ ===== */
(function(){
const MX=23,S0=11,ST=13,FILL=.62;
const SB=()=>S.base=S.base||{};
window.__mbSizes=function(lv){if(lv==null)lv=bLv('hq');const st=Math.floor((Math.max(1,lv)-1)/5),n=Math.floor(st/ST)+1,o=[];for(let j=0;j<n;j++)o.push(Math.min(MX,S0+st-j*ST));return o};
window.__mbCells=lv=>__mbSizes(lv).reduce((a,s)=>a+s*s,0);
let GK='',GS=null;
window.__mbOK=function(b){const lv=bLv('hq'),k=lv+'|'+BLD.length;if(k!==GK){GK=k;GS=new Set();const bud=__mbCells(lv)*FILL;let a=0;
  const L=BLD.map((x,i)=>[x,i]).filter(([x])=>x.t!=='shield'&&x.t!=='hangar'&&x.t!=='cm3'&&chOpen(x.ch)&&lv>=x.hl).sort((p,q)=>((p[0].t==='hq'?0:1)-(q[0].t==='hq'?0:1))||(p[0].hl-q[0].hl)||(p[1]-q[1]));
  for(const [x] of L){const ar=x.w*x.h;if(x.t!=='hq'&&a+ar>bud)break;a+=ar;GS.add(x.id)}}return GS.has(b.id)};
const HQ=()=>BLD.find(x=>x.t==='hq');
window.__mbHQ=function(){const B=SB(),h=HQ();return (B.bk&&h&&B.bk[h.id]!=null)?B.bk[h.id]:0};
window.__mbN=()=>__mbSizes().length;
window.__mbOrd=function(){const B=SB(),n=__mbN();let o=(B.ord||[]).filter(j=>j<n);for(let j=0;j<n;j++)if(!o.includes(j))o.unshift(j);const h=__mbHQ();o=o.filter(j=>j!==h);o.push(h);B.ord=o;return o};
window.__mbCur=function(){const B=SB(),n=__mbN();if(!(B.cur>=0&&B.cur<n))B.cur=__mbHQ();return B.cur};
window.__mbReg=function(j){const s=__mbSizes()[j]||S0,a=Math.floor((BN-s)/2);return {x0:a,y0:a,x1:a+s,y1:a+s,s}};
/* chuyển dữ liệu cũ (1 bản đồ lớn) sang nhiều căn cứ: tự chia công trình vào các căn cứ, còn thừa cất Kho */
let MG=false;
window.__mbMig=function(){const B=SB();if(B.mbv===1||MG)return;MG=true;try{const P=(B.pos=B.pos||{}),off=(B.off=B.off||{}),sz=__mbSizes(),n=sz.length;B.bk={};B.ord=null;B.cur=0;
  const G=sz.map(s=>new Uint8Array(s*s)),R=sz.map((s,j)=>__mbReg(j));
  const ok=(j,x,y,w,h)=>{const s=sz[j];if(x<0||y<0||x+w>s||y+h>s)return false;for(let v=0;v<h;v++)for(let u=0;u<w;u++)if(G[j][(y+v)*s+x+u])return false;return true},put=(j,x,y,w,h)=>{const s=sz[j];for(let v=0;v<h;v++)for(let u=0;u<w;u++)G[j][(y+v)*s+x+u]=1};
  const L=BLD.filter(b=>bUnl(b)),h=L.find(b=>b.t==='hq');
  if(h){const s=sz[0],x=Math.floor((s-h.w)/2),y=s-h.h-1;put(0,x,y,h.w,h.h);P[h.id]=[R[0].x0+x,R[0].y0+y];B.bk[h.id]=0;delete off[h.id]}
  /* chia đều: mỗi căn cứ chỉ lấp tới ~70% trước, phần còn lại mới dồn vào chỗ trống */
  const AR=sz.map(()=>0);if(h)AR[0]+=h.w*h.h;const tot=L.reduce((a,b)=>a+b.w*b.h,0),cap=sz.map(s=>s*s*Math.min(.92,Math.max(.5,tot/__mbCells()+.06)));
  const tryPut=(b,lim)=>{const ord=sz.map((s,j)=>j).sort((p,q)=>AR[p]/(sz[p]*sz[p])-AR[q]/(sz[q]*sz[q]));for(const j of ord){if(lim&&AR[j]+b.w*b.h>cap[j])continue;const s=sz[j];for(let y=0;y<=s-b.h;y++)for(let x=0;x<=s-b.w;x++)if(ok(j,x,y,b.w,b.h)){put(j,x,y,b.w,b.h);AR[j]+=b.w*b.h;P[b.id]=[R[j].x0+x,R[j].y0+y];B.bk[b.id]=j;delete off[b.id];return true}}return false};
  L.filter(b=>b!==h).sort((a,b)=>b.w*b.h-a.w*a.h).forEach(b=>{if(!tryPut(b,true)&&!tryPut(b,false)){delete P[b.id];off[b.id]=true}});
  B.mbv=1;try{save()}catch(e){}}finally{MG=false}};
window.__mbIn=function(b){const B=SB(),bk=(B.bk=B.bk||{}),off=B.off||{};if(off[b.id]){delete bk[b.id];return true}const c=__mbCur();if(bk[b.id]==null)bk[b.id]=b.t==='hq'?0:c;return bk[b.id]===c};
/* thanh chọn căn cứ trong màn Trụ sở */
const st=document.createElement('style');st.textContent=`#c107{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:4px 2px 6px;font:700 12px system-ui,sans-serif;color:#cfe0ff}
#c107 button{cursor:pointer;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#dfe9ff;font:800 12px system-ui,sans-serif;padding:5px 9px}
#c107 button.on{background:linear-gradient(#2f7bff,#1546b8);border-color:#9cc4ff;color:#fff;box-shadow:0 0 8px #3f8cff}#c107 button.hq{border-color:#ffd24a}#c107 .mv{background:#14304f;padding:5px 7px}#c107 small{color:#8fb0e8;font-weight:600}`;document.head.appendChild(st);
function bar(){const brd=document.getElementById('bboard');if(!brd)return;const sc=brd.closest('.bscroll')||brd.parentElement;let el=document.getElementById('c107');if(!el){el=document.createElement('div');el.id='c107';sc.parentElement.insertBefore(el,sc)}
  const o=__mbOrd(),c=__mbCur(),sz=__mbSizes(),h=__mbHQ(),pi=o.indexOf(c);
  el.innerHTML=o.map((j,i)=>`<button data-b="${j}" class="${j===c?'on':''} ${j===h?'hq':''}">${j===h?'🏰 ':''}Căn cứ ${i+1} · ${sz[j]}×${sz[j]}</button>`).join('')+
   (c!==h&&o.length>2?`<button class="mv" data-m="-1" ${pi<=0?'disabled':''}>◀ Lên trước</button><button class="mv" data-m="1" ${pi>=o.length-2?'disabled':''}>Lùi sau ▶</button>`:'')+
   `<small>Căn cứ 1 ở tiền tuyến (PvP đánh vào trước) · căn cứ có trụ sở 🏰 luôn ở cuối, dùng cho màn chơi và đấu boss · chuyển công trình sang căn cứ khác: cất vào Kho rồi mở căn cứ kia và đặt ra</small>`}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#c107 button');if(!t||t.disabled)return;const B=SB();
  if(t.dataset.b!=null){B.cur=+t.dataset.b;bAvail.c=null;bState.sel=null;try{save()}catch(x){}bRender();return}
  if(t.dataset.m!=null){const o=__mbOrd(),i=o.indexOf(__mbCur()),k=i+(+t.dataset.m);if(k<0||k>=o.length-1)return;[o[i],o[k]]=[o[k],o[i]];B.ord=o;try{save()}catch(x){}bRender()}});
const _R=bRender;bRender=function(){const r=_R.apply(this,arguments);try{bar()}catch(e){console.error(e)}return r};
})();
