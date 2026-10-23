
/* ===== c31: Quảng cáo trong game — xem quảng cáo nhận Đá (rewarded) · quảng cáo giữa màn (interstitial)
   Dùng chuẩn Google H5 Games Ads (Ad Placement API: adBreak / adConfig).
   Chưa điền mã nhà xuất bản (ca-pub-…) thì chạy CHẾ ĐỘ THỬ: hiện quảng cáo mẫu của chính game để xem luồng hoạt động. ===== */
(function(){
const ADCFG=window.ADCFG={
  client:'',          /* điền mã AdSense dạng 'ca-pub-1234567890123456' sau khi được duyệt H5 Games Ads */
  test:true,          /* true: Google chỉ trả quảng cáo thử (data-adbreak-test="on") */
  reward:50,          /* Đá nhận được mỗi lần xem hết quảng cáo */
  maxPerDay:5,        /* số lần xem nhận thưởng mỗi ngày */
  cool:180,           /* giây chờ giữa 2 lần xem nhận thưởng */
  interEvery:2,       /* cứ mỗi 2 lần xong màn thì chiếu 1 quảng cáo giữa màn */
  interGap:120,       /* tối thiểu 120 giây giữa 2 quảng cáo giữa màn */
  demoSec:5           /* thời lượng quảng cáo mẫu ở chế độ thử */
};
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const st=()=>{const A=S.ads=S.ads||{};if(A.d!==today()){A.d=today();A.n=0}A.last=A.last||0;A.lvn=A.lvn||0;A.ilast=A.ilast||0;A.tot=A.tot||0;return A};
const real=()=>/^ca-pub-\d{10,}$/.test(String(ADCFG.client||'').trim());
/* ---------- nạp thư viện Google khi đã có mã ---------- */
let loaded=false;
function boot(){if(loaded||!real())return;loaded=true;
  window.adsbygoogle=window.adsbygoogle||[];window.adBreak=window.adConfig=function(o){window.adsbygoogle.push(o)};
  const s=document.createElement('script');s.async=true;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(ADCFG.client.trim());s.crossOrigin='anonymous';
  s.setAttribute('data-ad-frequency-hint',ADCFG.interGap+'s');if(ADCFG.test)s.setAttribute('data-adbreak-test','on');document.head.appendChild(s);
  try{window.adConfig({preloadAdBreaks:'on',sound:'on'})}catch(e){}}
/* ---------- tạm dừng / tiếp tục game khi chiếu quảng cáo ---------- */
let wasPaused=null;
const pause=()=>{try{wasPaused=typeof dfPause!=='undefined'?dfPause:null;if(typeof dfPause!=='undefined')dfPause=true}catch(e){}};
const resume=()=>{try{if(wasPaused!==null&&typeof dfPause!=='undefined')dfPause=wasPaused}catch(e){}wasPaused=null};
/* ---------- quảng cáo mẫu (chế độ thử) ---------- */
const css=document.createElement('style');css.textContent=`
#c31ad{position:fixed;inset:0;z-index:150;background:rgba(2,6,18,.94);display:flex;align-items:center;justify-content:center;padding:16px}
#c31ad .bx{width:min(420px,100%);background:linear-gradient(160deg,#0d1f4a,#081230);border:1px solid #3a63c4;border-radius:16px;overflow:hidden;box-shadow:0 0 40px rgba(60,140,255,.35);color:#e8f0ff;position:relative}
#c31ad .tg{position:absolute;top:10px;left:10px;background:#ffd23a;color:#3a2300;font:800 11px system-ui,sans-serif;padding:3px 8px;border-radius:6px;letter-spacing:.5px;white-space:nowrap;z-index:2;display:inline-block;width:auto;min-width:0;max-width:none;height:auto;line-height:1.3}
#c31ad .x{position:absolute;top:8px;right:8px;min-width:34px;height:34px;border-radius:17px;border:1px solid #5a78c0;background:#14275a;color:#fff;font:700 13px system-ui,sans-serif;cursor:pointer;padding:0 10px}
#c31ad .x[disabled]{opacity:.75;cursor:default}
#c31ad .ar{height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(circle at 50% 40%,#1d4bb0,#071232 70%);text-align:center;padding:16px}
#c31ad .ar img{width:96px;height:96px;border-radius:18px;box-shadow:0 0 24px rgba(80,170,255,.6)}
#c31ad .ar b{font-size:20px;text-shadow:0 0 12px #3fd8ff}
#c31ad .ar small{color:#a9c4ff}
#c31ad .pb{height:5px;background:#0a1430;border:0;padding:0;margin:0}#c31ad .pb>div{height:100%;width:0;background:linear-gradient(90deg,#3fd8ff,#ffd23a);transition:width .2s linear}
#c31ad .ft{padding:12px 14px;font:13px system-ui,sans-serif;color:#b8c9ee;line-height:1.45}
#c31ad .ft em{color:#ffd23a;font-style:normal;font-weight:700}
.lvbtn.c31{background:linear-gradient(160deg,#3a2a06,#1a1404)!important;border-color:#c9952a!important}
.lvbtn.c31[disabled]{opacity:.6}`;document.head.appendChild(css);
function demo(kind,done){const sec=ADCFG.demoSec,lg=(document.querySelector('.evlg')||{}).src||'';
  const m=document.createElement('div');m.id='c31ad';
  m.innerHTML=`<div class="bx"><span class="tg">QUẢNG CÁO</span><button class="x" disabled>${sec}</button>
    <div class="ar">${lg?`<img src="${lg}" alt="">`:''}<b>Shop khuyến mãi Ship event</b><small>Gói Đá ưu đãi · Thuyền trưởng mới · Vũ khí giới hạn</small></div><div class="pb"><div></div></div>
    <div class="ft"><em>Chế độ thử:</em> đây là quảng cáo mẫu của chính game để bạn xem cách quảng cáo hoạt động. Khi điền mã AdSense, chỗ này sẽ hiện quảng cáo thật của Google.${kind==='reward'?`<br>Xem hết ${sec} giây để nhận <em>${NF(ADCFG.reward)} Đá</em>.`:''}</div></div>`;
  document.body.appendChild(m);const x=m.querySelector('.x'),bar=m.querySelector('.pb>div');let t=0,ok=false;
  const iv=setInterval(()=>{t+=.2;bar.style.width=Math.min(100,t/sec*100)+'%';const left=Math.ceil(sec-t);if(left>0){x.textContent=left}else if(!ok){ok=true;x.disabled=false;x.textContent='✕ Đóng'}},200);
  x.onclick=()=>{if(!ok)return;clearInterval(iv);m.remove();done(true)};
  if(kind==='reward'){const skip=document.createElement('button');skip.className='x';skip.style.cssText='top:auto;bottom:10px;right:10px';skip.textContent='Bỏ qua';
    skip.onclick=()=>{if(ok)return;clearInterval(iv);m.remove();done(false)};m.querySelector('.bx').appendChild(skip);
    const kill=setInterval(()=>{if(ok){skip.remove();clearInterval(kill)}},200)}}
/* ---------- xem quảng cáo nhận Đá ---------- */
function canReward(){const A=st(),now=Date.now()/1000;if(A.n>=ADCFG.maxPerDay)return {ok:false,why:'Hôm nay đã xem đủ '+ADCFG.maxPerDay+' lần, quay lại ngày mai nhé'};
  const w=Math.ceil(A.last+ADCFG.cool-now);if(w>0)return {ok:false,why:'Chờ '+(w>=60?Math.floor(w/60)+' phút '+(w%60)+' giây':w+' giây')+' nữa'};return {ok:true}}
function give(){const A=st();A.n++;A.last=Date.now()/1000;A.tot++;S.da=(S.da||0)+ADCFG.reward;try{save()}catch(e){}try{refresh()}catch(e){}
  try{toast('Cảm ơn bạn đã xem quảng cáo! +'+NF(ADCFG.reward)+' Đá')}catch(e){}paint()}
function reward(){const c=canReward();if(!c.ok){try{toast(c.why)}catch(e){}return}
  if(real()){boot();let shown=false;
    window.adBreak({type:'reward',name:'xem_qc_nhan_da',
      beforeAd:pause,afterAd:resume,
      beforeReward:showAdFn=>{shown=true;showAdFn()},
      adDismissed:()=>{try{toast('Bạn đóng quảng cáo sớm nên chưa nhận được Đá')}catch(e){}},
      adViewed:give,
      adBreakDone:info=>{if(!shown){try{toast('Hiện chưa có quảng cáo, bạn thử lại sau nhé')}catch(e){}}paint()}});return}
  pause();demo('reward',ok=>{resume();if(ok)give();else{try{toast('Bạn bỏ qua quảng cáo nên chưa nhận được Đá')}catch(e){}}})}
/* ---------- quảng cáo giữa màn: khi màn hình kết quả hiện ---------- */
function inter(){const A=st(),now=Date.now()/1000;A.lvn++;try{save()}catch(e){}
  if(A.lvn%ADCFG.interEvery!==0||now-A.ilast<ADCFG.interGap)return;A.ilast=now;
  if(real()){boot();window.adBreak({type:'next',name:'sau_man_choi',beforeAd:pause,afterAd:resume});return}
  demo('next',()=>{})}
{const r=document.getElementById('result');if(r){let vis=false;new MutationObserver(()=>{const v=r.style.display==='flex';if(v&&!vis)setTimeout(()=>{try{inter()}catch(e){console.error(e)}},700);vis=v}).observe(r,{attributes:true,attributeFilter:['style']})}}
/* ---------- nút ở sảnh ---------- */
let btn=null;
function paint(){if(!btn)return;const A=st(),c=canReward();btn.querySelector('small').textContent=c.ok?'Còn '+(ADCFG.maxPerDay-A.n)+'/'+ADCFG.maxPerDay+' lần hôm nay':c.why}
function mount(){const col=document.querySelector('#lobby .lvcol');if(!col||document.getElementById('c31b'))return;
  btn=document.createElement('button');btn.id='c31b';btn.className='lvbtn c31';btn.innerHTML='<span>📺</span><b>Xem quảng cáo · +'+NF(ADCFG.reward)+' Đá</b><small></small>';
  btn.onclick=reward;col.appendChild(btn);paint()}
mount();setInterval(paint,1000);
if(real())boot();
window.C31={ADCFG,reward,inter,demo,canReward,boot};
})();
