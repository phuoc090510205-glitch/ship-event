/* ===== c71: bấm giữ nút nâng cấp để lên cấp liên tục · bản đồ chiến thuật hình chữ nhật thay radar tròn ===== */
(function(){
const isUp=b=>{if(!b||b.disabled)return false;if(['ubtn','gbtn','cbtn'].includes(b.id)||b.classList.contains('ubtn'))return true;if(b.dataset&&b.dataset.a==='up')return true;const t=(b.textContent||'').trim().toUpperCase();return /^NÂNG CẤP\b|^LÊN CẤP|^NÂNG\b/.test(t)&&t.length<40};
let T=null,on=false;
function stop(why){if(on)window.__c71why=why;on=false;clearTimeout(T);T=null}
function res(){try{return (S.da||0)+(S.sao||0)}catch(e){return 0}}
addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||!isUp(b))return;stop();on=true;
  const id=b.id,da=b.dataset&&b.dataset.id,key=b.dataset&&b.dataset.a;let n=0,same=0;
  const find=()=>{if(document.body.contains(b)&&b.offsetParent)return b;if(id)return document.getElementById(id);if(da)return document.querySelector(`button[data-a="${key}"][data-id="${da}"]`);return null};
  let last=0;const tick=()=>{if(!on)return;const now=performance.now(),want=n<6?160:n<20?90:50,k=last?Math.max(1,Math.min(5,Math.round((now-last)/want))):1;last=now;for(let i=0;i<k&&on;i++){const x=find();if(!x||x.disabled||!x.offsetParent){stop('gone');return}const r0=res();x.click();n++;if(res()===r0){if(++same>=2){stop('nores');return}}else same=0;if(n>=150){stop('max');return}}T=setTimeout(tick,want)};
  T=setTimeout(tick,450)},true);
['pointerup','pointercancel','blur','contextmenu'].forEach(t=>addEventListener(t,e=>stop(t),true));
addEventListener('pointerleave',e=>{if(e.target===document.documentElement)stop('leave')},true);
/* bản đồ chiến thuật: khi có Trung tâm bản đồ chiến thuật (cm3) còn đứng thì ẩn radar tròn */
const mc=document.createElement('canvas');mc.id='c71map';mc.style.cssText='position:fixed;right:max(14px,env(safe-area-inset-right,0px));top:calc(8px + env(safe-area-inset-top,0px));z-index:6;pointer-events:none;display:none';document.body.appendChild(mc);
function drawMap(G){const W=G.wd.Wd,H=G.wd.Hd,w=Math.round(Math.min(200,innerWidth*.3)),h=Math.round(Math.max(60,Math.min(160,w*H/W))),dpr=Math.min(2,devicePixelRatio||1);
  if(mc.width!==Math.round((w+12)*dpr)||mc.height!==Math.round((h+24)*dpr)){mc.width=Math.round((w+12)*dpr);mc.height=Math.round((h+24)*dpr);mc.style.width=(w+12)+'px';mc.style.height=(h+24)+'px'}
  const q=mc.getContext('2d');q.setTransform(dpr,0,0,dpr,0,0);q.clearRect(0,0,w+12,h+24);try{window.c17Mini(q,G,6,19,w,h,null)}catch(e){}}
setInterval(()=>{const r=document.getElementById('df3r');if(!r)return;let m=false;try{m=typeof DG!=='undefined'&&DG&&!DG.done&&!DG.pv&&(DG.bl||[]).some(b=>b.t==='cm3'&&b.hp>0)}catch(e){}r.classList.toggle('c71h',m);mc.style.display=m?'block':'none';if(m)drawMap(DG)},120);
{const st=document.createElement('style');st.textContent='#df3r.c71h{visibility:hidden!important;display:none!important}';document.head.appendChild(st)}
window.C71={isUp};
})();
