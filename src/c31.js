
/* ===== c31: Quảng cáo trong game (Monetag)
   - Xem quảng cáo nhận thưởng: 15 giây · 30 giây · 60 giây (ở Shop khuyến mãi → tab "Xem quảng cáo" và đầu tab "Tài nguyên"; nút ở sảnh)
   - Quảng cáo giữa màn: khi màn hình kết quả hiện (giới hạn tần suất)
   Quảng cáo chạy trong một KHUNG RIÊNG (iframe ads.html, cách ly hoàn toàn với dữ liệu game) nên không bao giờ đè lên nút trong game.
   Chỉ chạy quảng cáo thật khi mở game từ github.io; nơi khác (bản trên Claude, mở thử) hiện quảng cáo mẫu. ===== */
(function(){
const ADCFG=window.ADCFG={
  hosts:/(^|\.)github\.io$/i,          /* chỉ bật quảng cáo thật ở các địa chỉ này */
  frame:'ads.html',                     /* trang chứa mã Monetag, đặt cạnh index.html */
  tiers:[                               /* thời lượng (giây) → phần thưởng */
    {sec:15,sao:50,da:3000},
    {sec:30,sao:100,da:5000},
    {sec:60,sao:300,da:10000}],
  perDay:5,                             /* mỗi mức xem tối đa 5 lần/ngày */
  cool:60,                              /* chờ 60 giây giữa 2 lần xem nhận thưởng */
  interEvery:2,interGap:120,interSec:5  /* quảng cáo giữa màn: mỗi 2 màn, cách nhau ≥120 giây, tắt được sau 5 giây */
};
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
const live=()=>ADCFG.hosts.test(location.hostname||'');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const st=()=>{const A=S.ads=S.ads||{};if(A.d!==today()){A.d=today();A.c={}}A.c=A.c||{};A.last=A.last||0;A.lvn=A.lvn||0;A.ilast=A.ilast||0;A.tot=A.tot||0;return A};
const left=t=>Math.max(0,ADCFG.perDay-(st().c[t.sec]||0));
const coolLeft=()=>Math.max(0,Math.ceil(st().last+ADCFG.cool-Date.now()/1000));
const img=k=>{try{return LA[k]||''}catch(e){return ''}};
/* ---------- giao diện ---------- */
const css=document.createElement('style');css.textContent=`
#c31w{position:fixed;inset:0;z-index:160;background:#030817;display:flex;flex-direction:column;color:#e8f0ff;font-family:inherit}
#c31w .c3h{display:flex;align-items:center;gap:10px;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px;background:#081534;border-bottom:1px solid #1f3d7a}
#c31w .c3h .t{color:#fff;font-weight:800;font-size:14px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#c31w .c3h .tg{display:inline-block;width:auto;min-width:0;max-width:none;flex:none;background:#ffd23a;color:#3a2300;font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:5px;white-space:nowrap}
#c31w .c3g{width:40px;height:40px;flex:none;position:relative}#c31w .c3g svg{transform:rotate(-90deg)}#c31w .c3g b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px}
#c31w .c3r{flex:1;min-height:0;position:relative;background:#050d24}
#c31w iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#050d24}
#c31w .c3f{display:flex;gap:8px;align-items:center;padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));background:#081534;border-top:1px solid #1f3d7a}
#c31w .c3f small{flex:1;color:#9fb6e6;font-size:12px;line-height:1.3}
#c31w .c3f button{border-radius:10px;padding:9px 14px;font:700 13px inherit;cursor:pointer;border:1px solid #4a5f95;background:#13265a;color:#fff;white-space:nowrap}
#c31w .c3f button.go{background:linear-gradient(#ffd96a,#f0a316);color:#3a2300;border-color:#ffd96a}#c31w .c3f button[disabled]{opacity:.45;cursor:default}
#c31w .c3d{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:24px;padding:16px;background:radial-gradient(circle at 50% 40%,#1d4bb0,#050d24 72%);text-align:center}
#c31w .c3d img{width:min(30vh,150px);height:min(30vh,150px);border-radius:20px;box-shadow:0 0 30px rgba(80,170,255,.55)}
#c31w .c3d b{display:block;font-size:20px;text-shadow:0 0 12px #3fd8ff;margin-bottom:6px}#c31w .c3d small{color:#bcd0ff;font-size:13px}
#c31w .c3d .nt{margin-top:10px;font-size:11.5px;color:#ffd23a}
#psh .pc.c31c{position:relative;background:linear-gradient(160deg,#3a2a06,#160f02)!important;border-color:#d9a43a!important}
#psh .pc.c31c .c31t{position:absolute;top:4px;right:4px;background:#ffd23a;color:#3a2300;font-size:10px;font-weight:800;padding:1px 6px;border-radius:5px}
#psh .pc.c31c .pb{background:linear-gradient(#ffd96a,#f0a316)!important;color:#3a2300!important}
#psh .pc.c31c .pb[disabled]{filter:grayscale(.8);opacity:.6}
#psh .pc.c31c .pa{font-size:26px}#psh .pc.c31c h4{color:#ffe08a!important;font-weight:800;font-size:14px!important}
.lvbtn.c31{background:linear-gradient(160deg,#3a2a06,#1a1404)!important;border-color:#c9952a!important}`;document.head.appendChild(css);
/* ---------- màn hình xem quảng cáo ---------- */
let cur=null;
function open(mode,tier,done){if(cur)return;const sec=mode==='reward'?tier.sec:ADCFG.interSec,need=sec;
  const m=document.createElement('div');m.id='c31w';const C=2*Math.PI*16;
  const title=mode==='reward'?'Xem quảng cáo '+sec+' giây · nhận '+NF(tier.sao)+' Sao + '+NF(tier.da)+' Đá':'Quảng cáo giữa màn';
  m.innerHTML=`<div class="c3h"><span class="tg">QUẢNG CÁO</span><span class="t">${title}</span><div class="c3g"><svg width="40" height="40"><circle cx="20" cy="20" r="16" stroke="#1f3d7a" stroke-width="4" fill="none"/><circle class="pr" cx="20" cy="20" r="16" stroke="#ffd23a" stroke-width="4" fill="none" stroke-dasharray="${C}" stroke-dashoffset="${C}" stroke-linecap="round"/></svg><b>${sec}</b></div></div>
    <div class="c3r"></div>
    <div class="c3f"><small>${mode==='reward'?'Giữ màn hình này đến hết giờ để nhận thưởng. Thoát sớm sẽ không nhận được.':'Bạn có thể đóng sau '+sec+' giây.'}</small><button class="x">${mode==='reward'?'Thoát':'Đóng'}</button>${mode==='reward'?'<button class="go" disabled>🎁 Nhận thưởng</button>':''}</div>`;
  document.body.appendChild(m);const fr=m.querySelector('.c3r');
  if(live()){const f=document.createElement('iframe');f.src=ADCFG.frame+'?m='+mode+'&s='+sec+'&r='+Date.now();
    /* không có allow-same-origin: mã quảng cáo bị cách ly, không đọc được dữ liệu/tiền của game */
    f.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms');f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');fr.appendChild(f)}
  else{const lg=(document.querySelector('.evlg')||{}).src||'';fr.innerHTML=`<div class="c3d">${lg?`<img src="${lg}" alt="">`:''}<div><b>Shop khuyến mãi Ship event</b><small>Gói Đá ưu đãi · Thuyền trưởng mới · Vũ khí giới hạn</small><div class="nt">Quảng cáo mẫu — quảng cáo thật chỉ hiện khi chơi trên bản GitHub (github.io)</div></div></div>`}
  let t=0,okk=false,last=performance.now();const pr=m.querySelector('.pr'),lb=m.querySelector('.c3g b'),go=m.querySelector('.go'),x=m.querySelector('.x');
  const iv=setInterval(()=>{const now=performance.now(),dt=(now-last)/1000;last=now;if(document.hidden||okk)return;t=Math.min(need,t+Math.min(dt,.5));
    pr.setAttribute('stroke-dashoffset',String(C*(1-t/need)));lb.textContent=Math.max(0,Math.ceil(need-t));
    if(t>=need){okk=true;lb.textContent='✓';if(go){go.disabled=false}else{x.textContent='✕ Đóng'}}},200);
  const close=got=>{clearInterval(iv);m.remove();cur=null;try{if(wasP!==null&&typeof dfPause!=='undefined')dfPause=wasP}catch(e){}done&&done(got)};
  let wasP=null;try{if(typeof dfPause!=='undefined'){wasP=dfPause;dfPause=true}}catch(e){}
  x.onclick=()=>{if(mode!=='reward'&&!okk)return;if(mode==='reward'&&!okk){if(!confirm('Thoát bây giờ sẽ không nhận được thưởng. Vẫn thoát?'))return}close(okk&&mode!=='reward')};
  if(go)go.onclick=()=>{if(okk)close(true)};
  if(mode!=='reward'){x.disabled=true;const k=setInterval(()=>{if(okk){x.disabled=false;clearInterval(k)}},200)}
  cur=m}
/* ---------- nhận thưởng ---------- */
function canWatch(t){if(left(t)<=0)return 'Hôm nay đã xem đủ '+ADCFG.perDay+' lần mức '+t.sec+' giây';const c=coolLeft();if(c>0)return 'Chờ '+c+' giây nữa rồi xem tiếp nhé';return ''}
function watch(i){const t=ADCFG.tiers[i];const why=canWatch(t);if(why){try{toast(why)}catch(e){}return}
  open('reward',t,got=>{if(!got){try{toast('Bạn thoát sớm nên chưa nhận được thưởng')}catch(e){}paint();return}
    const A=st();A.c[t.sec]=(A.c[t.sec]||0)+1;A.last=Date.now()/1000;A.tot++;S.sao=(S.sao||0)+t.sao;S.da=(S.da||0)+t.da;
    try{save()}catch(e){}try{refresh()}catch(e){}try{toast('Cảm ơn bạn! +'+NF(t.sao)+' Sao, +'+NF(t.da)+' Đá')}catch(e){}paint()})}
/* ---------- thẻ trong Shop khuyến mãi ---------- */
const psh=document.getElementById('psh'),grid=psh&&psh.querySelector('.pgrid'),side=psh&&psh.querySelector('.pside');
function cardsHTML(){return ADCFG.tiers.map((t,i)=>{const w=canWatch(t),n=left(t);
  return `<div class="pc c31c" data-c31="${i}"><h4>📺 Xem ${t.sec} giây</h4><div class="pa">${img('st')?`<img src="${img('st')}" alt="" style="max-width:44%;mix-blend-mode:screen">`:'⭐'}${img('gem')?`<img src="${img('gem')}" alt="" style="max-width:44%;mix-blend-mode:screen">`:'💎'}</div><ul><li>Sao x ${NF(t.sao)}</li><li>Đá x ${NF(t.da)}</li><li>Còn ${n}/${ADCFG.perDay} lần hôm nay</li></ul><button class="pb" data-c31b="${i}" ${w?'disabled':''}>${w&&n>0?'Chờ '+coolLeft()+'s':w?'Hết lượt':'▶ Xem ngay'}</button></div>`}).join('')}
function bind(){grid.querySelectorAll('[data-c31b]').forEach(b=>b.onclick=e=>{e.stopPropagation();watch(+b.dataset.c31b)})}
function curTab(){const b=side&&side.querySelector('.pt.on');return b&&b.dataset.t}
let busy=false;
function inject(){if(!grid||busy)return;const tab=curTab();busy=true;try{
  if(tab==='Xem quảng cáo'){if(!grid.querySelector('.c31c')||grid.children.length!==ADCFG.tiers.length){grid.classList.add('pk2');grid.innerHTML=cardsHTML();bind()}}
  else if(tab==='Tài nguyên'){if(!grid.querySelector('.c31c')){grid.insertAdjacentHTML('afterbegin',cardsHTML());bind()}}}finally{busy=false}}
function paint(){if(!grid)return;const tab=curTab();if(tab!=='Xem quảng cáo'&&tab!=='Tài nguyên')return;busy=true;try{grid.querySelectorAll('.c31c').forEach(c=>c.remove());if(tab==='Xem quảng cáo'){grid.innerHTML=cardsHTML()}else grid.insertAdjacentHTML('afterbegin',cardsHTML());bind()}finally{busy=false}paintBtn()}
if(grid){new MutationObserver(()=>{if(!busy)inject()}).observe(grid,{childList:true})}
if(side&&!side.querySelector('[data-t="Xem quảng cáo"]')){const b=document.createElement('button');b.className='pt';b.dataset.t='Xem quảng cáo';b.innerHTML='<i style="background:none;display:flex;align-items:center;justify-content:center;font-style:normal">📺</i>Xem quảng cáo';
  const ref=side.querySelector('[data-t="Tài nguyên"]');side.insertBefore(b,ref||side.firstChild);
  b.onclick=()=>{side.querySelectorAll('.pt[data-t]').forEach(x=>x.classList.toggle('on',x===b));busy=true;try{grid.classList.add('pk2');grid.innerHTML=cardsHTML();bind()}finally{busy=false}}}
setInterval(()=>{try{if(psh&&psh.style.display!=='none'&&coolLeft()>=0){const tab=curTab();if(tab==='Xem quảng cáo'||tab==='Tài nguyên'){const b=grid.querySelector('[data-c31b]');if(b&&(coolLeft()>0||b.disabled))paint()}}}catch(e){}},1000);
/* ---------- nút ở sảnh: mở thẳng tab Xem quảng cáo ---------- */
let lb=null;
function paintBtn(){if(!lb)return;const tot=ADCFG.tiers.reduce((s,t)=>s+left(t),0),c=coolLeft();lb.querySelector('small').textContent=tot?(c>0?'Chờ '+c+' giây · ':'')+'Còn '+tot+' lượt hôm nay':'Hết lượt hôm nay'}
function mountBtn(){const col=document.querySelector('#lobby .lvcol');if(!col||document.getElementById('c31b'))return;
  lb=document.createElement('button');lb.id='c31b';lb.className='lvbtn c31';lb.innerHTML='<span>📺</span><b>Xem quảng cáo nhận thưởng</b><small></small>';
  lb.onclick=()=>{try{$('pshopen').click()}catch(e){}setTimeout(()=>{const b=side&&side.querySelector('[data-t="Xem quảng cáo"]');if(b)b.click()},60)};col.appendChild(lb);paintBtn()}
mountBtn();setInterval(paintBtn,1000);
/* ---------- quảng cáo giữa màn ---------- */
function inter(){const A=st(),now=Date.now()/1000;A.lvn++;try{save()}catch(e){}
  if(A.lvn%ADCFG.interEvery!==0||now-A.ilast<ADCFG.interGap||cur)return;A.ilast=now;try{save()}catch(e){}open('next',null,()=>{})}
{const r=document.getElementById('result');if(r){let vis=false;new MutationObserver(()=>{const v=r.style.display==='flex';if(v&&!vis)setTimeout(()=>{try{inter()}catch(e){console.error(e)}},800);vis=v}).observe(r,{attributes:true,attributeFilter:['style']})}}
window.C31={ADCFG,watch,inter,open,canWatch,live};
})();
