
/* ===== c23: Cửa hàng — xem mô phỏng trước khi mua (vũ khí · modul tốc chạy · khiên · kỹ năng) ===== */
(function(){
if(typeof stRender!=='function'||typeof stList!=='function'||typeof stCost!=='function')return;
const NF=n=>Math.round(n).toLocaleString('vi-VN');
const N1=n=>String(Math.round(n*10)/10).replace('.',',');
const PCT=(a,b)=>b?Math.round((a/b-1)*100):0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const css=document.createElement('style');
css.textContent=`#toast{z-index:140;pointer-events:none}
.c23o{position:fixed;inset:0;z-index:96;background:#000c;display:flex;align-items:center;justify-content:center;padding:8px}
.c23o>div{width:min(620px,96vw);max-height:96vh;overflow:auto;background:linear-gradient(#0b1840,#060f2e);border:1.5px solid #2b5ac9;border-radius:14px;padding:12px;color:#fff;box-shadow:0 0 30px #1b4fe066;font:14px system-ui,sans-serif}
.c23o .wh{display:flex;gap:10px;align-items:center}.c23o .wh img{width:64px;height:64px;object-fit:contain;filter:drop-shadow(0 3px 6px #000)}
.c23o h3{margin:0;font-size:18px;color:#bfe3ff}.c23o .wt{display:inline-block;font-size:11px;font-weight:700;border:1px solid #1c4fc9;border-radius:6px;background:#0b1d52;padding:1px 8px;color:#dbe8ff;margin-top:3px}
.c23o .ws{display:grid;gap:6px;margin:10px 0}.c23o .ws div{background:#0a1a4a;border:1px solid #1c3a80;border-radius:8px;padding:4px 6px;text-align:center}
.c23o .ws small{display:block;font-size:9.5px;color:#8fa6d8}.c23o .ws b{font-size:14px;color:#ffe08a}
.c23o .wd{font-size:12px;color:#b8c8ee;margin-bottom:8px}.c23o canvas{width:100%;display:block;border-radius:10px;border:1px solid #1c3a80;background:#040a20}
.c23o .wb,#wpv .c23wb{display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap}.c23o .wb button,#wpv .c23wb button{padding:7px 14px;border-radius:8px;border:1px solid #4a5a86;background:#14275a;color:#fff;cursor:pointer;font-weight:700;min-height:34px}
.c23o .wb button.c23go,#wpv .c23wb button.c23go{background:linear-gradient(#ffd45a,#e79a12);color:#3a2600;border-color:#ffd45a}.c23o .wb small,#wpv .c23wb small{color:#8fa6d8;margin-left:auto;font-size:11px}
.c23pg{height:6px;border-radius:4px;background:#0a1a4a;margin-top:8px;overflow:hidden}.c23pg i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3aa0ff,#7dffcf)}
.c23r{margin-top:10px;border:1px solid #2b5ac9;border-radius:10px;background:#071235;padding:10px;color:#fff;font:13px system-ui,sans-serif}
.c23r h4{margin:0 0 6px;font-size:11.5px;letter-spacing:.09em;color:#8fb4ff}.c23r .c23h{font-size:15px;font-weight:800;color:#ffe08a;margin-bottom:6px;line-height:1.3}
.c23r .c23w{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-top:1px solid #1c3a80}.c23r .c23w span{color:#9fb6e6}.c23r .c23w b{color:#fff;text-align:right}
.c23r .c23w b.c23u{color:#7dffb0}.c23r .c23w b.c23d{color:#ff9aa6}.c23r small.c23n{display:block;margin-top:6px;color:#8fa6d8;font-size:11px;line-height:1.35}
.c23r.wait .c23h{color:#8fa6d8;font-weight:600}.c23r.wait .c23w{display:none}
.c23buy{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap;color:#fff;font:14px system-ui,sans-serif}.c23buy .c23pr{flex:1;min-width:150px;font-weight:800;color:#ffe08a}.c23buy .c23pr small{display:block;font-weight:500;color:#8fa6d8;font-size:11px}
.c23buy button{padding:10px 20px;border-radius:10px;border:1px solid #ffc53d;background:#b36b00;color:#fff;font-weight:800;font-size:15px;cursor:pointer}.c23buy button.c23dim{border-color:#555;background:#2a2a2a;color:#bbb}
.c23buy .c23own{color:#7dffb0}.c23msg{width:100%;font-size:12px;color:#ffb3b3;min-height:0}.c23msg.ok{color:#7dffb0}
#storeov .c23sb{margin-top:6px;width:100%;padding:6px;border-radius:8px;border:1px solid #3aa0ff;background:#0f3a8f;color:#fff;font-weight:700;cursor:pointer;min-height:32px}`;
document.head.appendChild(css);

/* ---------- Cửa hàng: thêm nút "Xem mô phỏng" cho từng món ---------- */
stRender=function(keep,focus){
  const o=document.getElementById('storeov');if(!o)return;
  const sc=o.scrollTop,L=stList(),sh=L.slice(0,ST.n);
  o.innerHTML=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><b style="font-size:20px">CỬA HÀNG</b><span style="flex:1"></span><span class="chip d">Đá: ${NF(S.da)}</span><span class="chip s">Sao: ${NF(S.sao)}</span><button id="stx" aria-label="Đóng" style="font-size:22px;background:none;border:0;color:#fff">×</button></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">`+STT.map(t=>`<button data-t="${t[0]}" style="padding:6px 12px;border-radius:8px;border:1px solid #1c4fc9;background:${ST.tab===t[0]?'#1c4fc9':'#0c2358'};color:#fff;font-weight:700">${t[1]}</button>`).join('')+`</div>
  <input id="stq" placeholder="Tìm theo tên..." value="${esc(ST.q)}" style="width:100%;box-sizing:border-box;padding:7px 10px;margin-bottom:8px;border-radius:8px;border:1px solid #1c4fc9;background:#0a1a3d;color:#fff">
  <div style="opacity:.75;margin-bottom:8px">${L.length} mục · mua bằng Đá và Sao · mua xong sở hữu vĩnh viễn, dùng ngay không cần chờ vượt màn.<br><b style="color:#9fd0ff">Bấm ▶ Xem mô phỏng để chạy thử và xem kết quả cuối cùng trước khi mua.</b></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">`+sh.map(it=>{const c=stCost(it),ok=S.da>=c.da&&S.sao>=c.sao;
    return `<div style="background:#0a1a3d;border:1px solid #1c4fc9;border-radius:10px;padding:10px;text-align:center"><div data-sim="${esc(it.id)}" style="height:72px;display:flex;align-items:center;justify-content:center;cursor:pointer"><img src="${it.img}" alt="" style="max-height:100%;max-width:100%;object-fit:contain"></div><b style="display:block;font-size:13px;min-height:34px">${it.n}</b><div style="color:#9fc4ff;font-size:11px;min-height:14px">${it.d||''}</div>`+
    (it.it?`<button class="c23sb" data-sim="${esc(it.id)}">▶ Xem mô phỏng</button>`:'')+
    (it.own?`<div style="margin-top:6px;padding:6px;color:#7dffb0;font-weight:700">Đã sở hữu</div>`:`<button data-b="${esc(it.id)}" style="margin-top:6px;width:100%;padding:6px;border-radius:8px;border:1px solid ${ok?'#ffc53d':'#555'};background:${ok?'#b36b00':'#222'};color:#fff;font-weight:700;line-height:1.2">${NF(c.da)} Đá<br>${NF(c.sao)} Sao</button>`)+`</div>`}).join('')+`</div>`+(L.length>sh.length?`<button id="stmore" style="display:block;margin:14px auto;padding:8px 24px;border-radius:8px;border:1px solid #1c4fc9;background:#0c2358;color:#fff">Xem thêm (${L.length-sh.length})</button>`:'');
  if(!o._c23){o._c23=1;o.addEventListener('click',e=>{const b=e.target.closest('[data-sim]');if(b)openSim(b.dataset.sim)})}
  if(keep)o.scrollTop=sc;if(focus){const i=document.getElementById('stq');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
};

/* ---------- Mua ngay trong cửa sổ mô phỏng ---------- */
function buyHtml(it){const c=stCost(it),own=!!it.own,ok=S.da>=c.da&&S.sao>=c.sao;
  return `<div class="c23buy" data-id="${esc(it.id)}"><div class="c23pr">${own?'<span class="c23own">✓ Đã sở hữu — dùng ngay trong Kho</span>':NF(c.da)+' Đá · '+NF(c.sao)+' Sao'}<small>Đang có: ${NF(S.da)} Đá · ${NF(S.sao)} Sao</small></div>${own?'':`<button data-c23="buy" class="${ok?'':'c23dim'}">MUA NGAY</button>`}<div class="c23msg"></div></div>`}
function refreshBuy(msg,ok){document.querySelectorAll('.c23buy').forEach(bar=>{const it=stList().find(x=>x.id===bar.dataset.id);if(!it)return;
  const t=document.createElement('div');t.innerHTML=buyHtml(it);const n=t.firstElementChild;if(msg&&bar.dataset.id===msg[0]){const m=n.querySelector('.c23msg');m.textContent=msg[1];m.className='c23msg'+(ok?' ok':'')}bar.replaceWith(n)})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-c23="buy"]');if(!b)return;
  const bar=b.closest('.c23buy'),it=stList().find(x=>x.id===bar.dataset.id);if(!it||it.own)return;
  const c=stCost(it);if(S.da<c.da||S.sao<c.sao){refreshBuy([it.id,'Không đủ '+(S.da<c.da?'Đá':'Sao')+' để mua món này.'],0);return}
  S.da-=c.da;S.sao-=c.sao;S.own=S.own||{};S.own[it.id]=1;
  try{save()}catch(_){}try{refresh()}catch(_){}try{stRender(true)}catch(_){}
  refreshBuy([it.id,'Đã mua '+it.n+'!'],1);try{toast('Đã mua '+it.n)}catch(_){}});

/* ---------- Bảng kết quả ---------- */
function resHtml(wait){return `<div class="c23r wait"><h4>KẾT QUẢ CUỐI CÙNG</h4><div class="c23h">${wait||'Đang mô phỏng… kết quả sẽ hiện khi chạy xong.'}</div><div class="c23rows"></div><small class="c23n"></small></div>`}
function fillRes(box,r){const el=box.querySelector('.c23r');if(!el)return;el.classList.remove('wait');
  el.querySelector('.c23h').textContent=r.hd;
  el.querySelector('.c23rows').innerHTML=r.rows.map(x=>`<div class="c23w"><span>${x[0]}</span><b class="${x[2]==='up'?'c23u':x[2]==='dn'?'c23d':''}">${x[1]}</b></div>`).join('');
  el.querySelector('.c23n').textContent=r.nt||'';
  el.scrollIntoView&&el.scrollIntoView({block:'nearest',behavior:'smooth'})}

/* ---------- Mô phỏng vũ khí: dùng lại bộ mô phỏng đạn của sảnh vũ khí, thêm đo sát thương + kết quả cuối ---------- */
const WT=12;
function weapon(it){
  if(!window.WPV||!WPV.open)return;
  closeSim();WPV.close();WPV.open(it.id);
  const G=WPV.state(),el=document.getElementById('wpv');if(!G||!el)return;
  const box=el.firstElementChild,w=it.it,dm=G.en[0],R={hp:dm.hp,dmg:0,done:false};
  Object.defineProperty(dm,'hp',{configurable:true,enumerable:true,get(){return R.hp},set(v){if(v<R.hp)R.dmg+=R.hp-v;R.hp=(v<dm.max*.3&&v<R.hp)?dm.max:v}});
  const sec=document.createElement('div');
  sec.innerHTML=`<div class="c23pg"><i></i></div><div class="c23wb"><button class="c23go" data-c23="rerun">🔁 Chạy lại</button><small>Mô phỏng ${WT} giây ở cấp ${wLv(w.id)} · mục tiêu giả tự hồi máu</small></div>`+resHtml('Đang bắn thử… kết quả hiện sau '+WT+' giây mô phỏng.')+buyHtml(it);
  box.appendChild(sec);
  const bar=sec.querySelector('.c23pg i');
  sec.querySelector('[data-c23="rerun"]').onclick=e=>{e.stopPropagation();weapon(it)};
  const tick=()=>{if(!el.isConnected)return;
    bar.style.width=Math.min(100,G.t/WT*100)+'%';
    if(!R.done&&G.t>=WT){R.done=true;const A=wAt(w),tot=R.dmg*12,dps=tot/G.t;
      fillRes(sec,{hd:'Gây '+NF(tot)+' sát thương trong '+WT+' giây (≈ '+NF(dps)+' / giây)',
        rows:[['Tổng sát thương ('+WT+' giây)',NF(tot),'up'],['Sát thương trung bình',NF(dps)+' / giây'],['Sát thương mỗi phát',A.dmg],['Nhịp bắn',A.rof],['Tầm bắn',A.rng],['Năng lượng',w.en||'—']],
        nt:'Đo trên mục tiêu giả đứng yên, chưa trừ giáp của tàu địch. Cấp vũ khí càng cao sát thương càng lớn.'})}
    requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
}
