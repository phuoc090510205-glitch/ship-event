/* ===== c52: Kho tàu boss (lắp ráp riêng cho boss) · mục Nâng cấp boss dưới Nâng cấp trụ sở · giá boss đầu tiên 10.000 Đá + 500 Sao ===== */
(function(){
if(typeof BSH==='undefined'||typeof KSH==='undefined')return;
/* --- giá boss đầu tiên --- */
{const _p=bkPrice;bkPrice=function(b){if(b&&b.k===0)return {da:10000,sao:500};return _p.apply(this,arguments)}}
/* --- trạng thái lắp ráp riêng cho boss --- */
let BM=false;const _bs=bsEquip;
{const _k=khS;khS=function(){if(!BM)return _k.apply(this,arguments);const K=(S.khob=S.khob||{});K.fit=K.fit||{};const own=bkOwned();
  if(!own.some(b=>b.id===K.sel))K.sel=own[0]&&own[0].id;if(!KMOD.some(m=>m.k===K.mod))K.mod='r';return K}}
const KEYS=['wp','ar','en','rc','ms','sk','ct'];
function hasLoad(id){const K=S.khob;return !!(K&&KEYS.some(k=>K[k]&&K[k][id]&&(Array.isArray(K[k][id])?K[k][id].length:Object.keys(K[k][id]).length)))}
function initLoad(sh){if(hasLoad(sh.id)||(S.khob&&S.khob.init&&S.khob.init[sh.id]))return;const q=_bs(sh,sh.c0),K=(S.khob=S.khob||{});KEYS.forEach(k=>K[k]=K[k]||{});
  const cp=a=>JSON.parse(JSON.stringify(a||[]));K.wp[sh.id]=JSON.parse(JSON.stringify(q.wm||{}));K.ar[sh.id]=cp(q.arm);K.en[sh.id]=cp(q.eng);K.rc[sh.id]=cp(q.nuc);K.ms[sh.id]=cp(q.mrd);K.sk[sh.id]=cp(q.sks);K.ct[sh.id]=cp(q.tnk);
  K.init=K.init||{};K.init[sh.id]=1}
function load(sh){if(!hasLoad(sh.id)&&!(S.khob&&S.khob.init&&S.khob.init[sh.id]))return null;const was=BM;BM=true;
  try{return {wm:khWpMap(sh),arm:khArmor(sh),eng:khEngines(sh),nuc:khReactors(sh),tnk:khTanks(sh),mrd:khMassMods(sh),sks:khSkills(sh)}}catch(e){console.error(e);return null}finally{BM=was}}
let PB=null;
bsEquip=function(sh,c){if(PB&&sh&&PB===sh.id){const q=load(sh);if(q)return q}return _bs.apply(this,arguments)};
{const _b=bkBuild;bkBuild=function(sh){const p=PB;PB=sh&&sh.id;try{return _b.apply(this,arguments)}finally{PB=p}}}
{const _s=bkStat;bkStat=function(sh){const p=PB;PB=sh&&sh.id;try{return _s.apply(this,arguments)}finally{PB=p}}}
function enter(id){const own=bkOwned();if(!own.length){toast('Chưa có boss nào — mua boss ở Kho boss trước');return}
  own.forEach(b=>{initLoad(b);if(!KSH.includes(b))KSH.push(b)});BM=true;const K=khS();if(id&&own.some(b=>b.id===id))K.sel=id;save();
  const kb=$('kbs');if(kb)kb.style.display='none';_open()}
function exit(){if(!BM)return;BM=false;for(let i=KSH.length-1;i>=0;i--)if(KSH[i].bk)KSH.splice(i,1)}
const _open=openKho;openKho=function(){exit();const r=_open.apply(this,arguments);const h=document.querySelector('#kho .lt h1');if(h)h.textContent='KHO TÀU';return r};
document.querySelectorAll('[data-k]').forEach(b=>{if(b.dataset.k==='Kho tàu')b.onclick=openKho});
document.addEventListener('click',()=>setTimeout(()=>{if(!BM)return;const vis=id=>{const e=$(id);return e&&getComputedStyle(e).display!=='none'};if(!vis('kho')&&!vis('wpn'))exit()},0),true);
document.addEventListener('click',e=>{if(!BM)return;if(e.target.closest&&e.target.closest('#khback')){e.stopPropagation();e.preventDefault();exit();$('kho').style.display='none';kbOpen()}},true);
{const _d=dfStart;dfStart=function(){exit();return _d.apply(this,arguments)}}
{const _R=khRender;khRender=function(){const r=_R.apply(this,arguments);if(!BM)return r;try{
  const K=khS(),cur=bkOwned().find(b=>b.id===K.sel);
  document.querySelectorAll('#khlist .khc').forEach(c=>{const b=BSH.find(x=>x.id===c.dataset.id);if(!b||!bkOwn(b.id)){c.style.display='none';return}const i=c.querySelector('.nm i');if(i)i.textContent='Cấp '+aLv(b.id);const hl=c.querySelector('.hl');if(hl)hl.textContent='Boss chương '+(b.k+1)});
  const n=$('khcnt');if(n)n.textContent='KHO TÀU BOSS · '+bkOwned().length+' BOSS';
  const tt=$('khtt');if(tt&&cur)tt.textContent='BOSS '+cur.n.toUpperCase()+' · LƯỚI 5×6 · '+cur.g.join('').replace(/\./g,'').length+' Ô';
  const h=document.querySelector('#kho .lt h1');if(h)h.textContent='KHO TÀU BOSS'}catch(e){console.error(e)}return r}}
/* --- Kho boss: nút Kho tàu boss + nút Lắp ráp trên từng boss đã sở hữu --- */
{const kh=document.querySelector('#kbs .kbh');if(kh&&!$('kbfit')){const b=document.createElement('button');b.id='kbfit';b.textContent='KHO TÀU BOSS';
  b.style.cssText='margin-left:auto;padding:6px 12px;border-radius:9px;border:1px solid #4fd8ff;background:linear-gradient(#1b4f9a,#0b2350);color:#fff;font-weight:700;font-size:clamp(10px,1.5vw,13px);cursor:pointer';
  b.onclick=()=>enter();const c=kh.querySelector('.kbc');kh.insertBefore(b,c)}
  const kn=document.querySelector('#kbs .kbn');if(kn)kn.textContent='Hạ Boss cuối mỗi chương để mở khóa boss tương ứng trong kho, rồi mua bằng Đá và Sao. Boss đã mua: lắp vũ khí, khiên, động cơ, mô-đun ở KHO TÀU BOSS; nâng cấp (100 cấp) ở mục Nâng cấp boss; đưa vào Hạm đội (chiếm 7 đơn vị vị trí, chỉ tính 1 slot).'}
{const _r=kbRender;window.kbRender=kbRender=function(){_r.apply(this,arguments);document.querySelectorAll('#kbg button[data-a="up"]').forEach(b=>{if(b.nextElementSibling&&b.nextElementSibling.dataset.a==='fit')return;
    const f=document.createElement('button');f.dataset.a='fit';f.dataset.id=b.dataset.id;f.textContent='LẮP RÁP';f.style.cssText='margin-top:4px;border-color:#4fd8ff!important;background:linear-gradient(#1b4f9a,#0b2350)!important';b.after(f)})}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#kbg button[data-a="fit"]');if(!b)return;e.stopPropagation();enter(b.dataset.id)},true);
/* --- Nâng cấp boss --- */
window.gBK=false;
{const _o=openGup;openGup=function(kind,bk){window.gBK=kind==='h'&&!!bk;
  if(window.gBK){const L=bkList();if(!L.length){window.gBK=false;toast('Chưa có boss nào — mua boss ở Kho boss trước');return}if(!L.some(x=>x.id===gSel.h))gSel.h=L[0].id;$('upg')&&($('upg').style.display='none');const kb=$('kbs');if(kb)kb.style.display='none'}
  else if(kind==='h'&&BSH.some(b=>b.id===gSel.h))gSel.h=(KSH.find(x=>!x.bk&&shipOpen(x.id))||KSH[0]).id;
  return _o.call(this,kind)}}
{const _g=gRender;gRender=function(){_g.apply(this,arguments);if(gKind==='h'&&window.gBK){$('gtt').textContent='NÂNG CẤP BOSS';$('gh3').textContent='Boss có thể nâng cấp (tối đa cấp '+GMAX+')'}}}
function card(){const g=$('uggrid');if(!g||g.querySelector('.ugc[data-i="8"]'))return;const b=BSH.find(x=>bkOwn(x.id))||BSH[0];
  g.insertAdjacentHTML('beforeend',`<div class="ugc" data-i="8"><div class="ugh"><span>9</span>NÂNG CẤP BOSS</div><img src="${b.img}" alt="" style="object-fit:contain;background:radial-gradient(circle at 50% 60%,#3a1250,#0a0618 70%)"></div>`)}
card();
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button[data-k="Nâng cấp"]');if(t)setTimeout(card,0);
  const c=e.target.closest&&e.target.closest('#uggrid .ugc[data-i="8"]');if(c){e.stopPropagation();openGup('h',1)}},true);
window.C52={enter,exit,load,hasLoad,get BM(){return BM}};
})();
