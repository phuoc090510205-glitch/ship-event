/* ===== c69: tàu phụ hộ tống — chế độ Theo tàu chính / Tấn công / Phòng thủ ===== */
(function(){
const MODES=[['fol','Theo tàu chính','🚀'],['atk','Tấn công','⚔'],['def','Phòng thủ','🛡']];
const isPv=()=>{const G=typeof DG!=='undefined'?DG:null;return !!(G&&G.pvp)};const mode=()=>isPv()?(S.c69pv||'atk'):(S.c69m||'fol');
function patrol(G){const A=(G.al||[]).filter(a=>!a.dead);if(!A.length)return;let Rg=null;try{Rg=C39.region(G)}catch(e){}if(!Rg&&G.hq)Rg={x0:G.hq.x-6,y0:G.hq.y-6,x1:G.hq.x+6,y1:G.hq.y+6};if(!Rg)return;
  const o=3,x0=Rg.x0-o,y0=Rg.y0-o,W=Rg.x1-Rg.x0+2*o,H=Rg.y1-Rg.y0+2*o,P=2*(W+H);
  A.forEach((a,i)=>{let s=((G.t*2.2+i*P/A.length)%P+P)%P,x,y;if(s<W){x=x0+s;y=y0}else if((s-=W)<H){x=x0+W;y=y0+s}else if((s-=H)<W){x=x0+W-s;y=y0+H}else{s-=W;x=x0;y=y0+H-s}a.c69pt={x,y}})}
{const _A=dfAllies;dfAllies=function(dt){try{const G=DG;if(G){G.c69m=mode();if(G.c69m==='def')patrol(G)}}catch(e){}return _A.apply(this,arguments)}}
/* nút chọn chế độ trong trận */
const bar=document.createElement('div');bar.id='c69bar';bar.style.cssText='position:fixed;left:10px;top:calc(150px + env(safe-area-inset-top,0px));z-index:8;display:none;flex-direction:column;gap:4px;font:800 11px system-ui,sans-serif';
bar.innerHTML='<div style="color:#bfe3ff;text-shadow:0 1px 2px #000">TÀU PHỤ</div>'+MODES.map(m=>`<button data-m="${m[0]}" style="pointer-events:auto;padding:4px 8px;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#cfe0ff;text-align:left;cursor:pointer">${m[2]} ${m[1]}</button>`).join('');
document.body.appendChild(bar);
bar.onclick=e=>{const b=e.target.closest('button[data-m]');if(!b)return;if(isPv())S.c69pv=b.dataset.m;else S.c69m=b.dataset.m;const mm=mode();if(typeof DG!=='undefined'&&DG)DG.c69m=mm;try{save()}catch(_){}paint();
  try{toast(mm==='atk'?'Tàu phụ: 100% cùng lao vào tấn công, không rút lui cho tới khi bị hạ':mm==='def'?'Tàu phụ: chạy quanh ngoài thảm bảo vệ trụ sở':'Tàu phụ: đi theo tàu chính')}catch(_){}};
function paint(){const m=mode();bar.querySelectorAll('button').forEach(b=>{const on=b.dataset.m===m;b.style.background=on?'linear-gradient(#ffd766,#f0a500)':'#0b1a44';b.style.color=on?'#1a1200':'#cfe0ff';b.style.borderColor=on?'#ffc53d':'#2b5ac9'})}
setInterval(()=>{const G=typeof DG!=='undefined'?DG:null,on=!!(G&&!G.done&&!G.pvp&&(G.al||[]).some(a=>!a.dead&&!a.c91a)&&document.getElementById('def')&&document.getElementById('def').style.display!=='none');const v=on?'flex':'none';const tp=G&&G.pvp?'calc(200px + env(safe-area-inset-top,0px))':'calc(150px + env(safe-area-inset-top,0px))';if(bar.style.top!==tp)bar.style.top=tp;if(bar.style.display!==v){bar.style.display=v;if(on)paint()}},400);
window.C69={mode,patrol};
})();
/* ===== c80: PvP — sắp lại HUD (máu trụ sở đối thủ, bảng điểm) tránh chồng lên ô tàu phụ; ẩn thông báo kỹ năng; chế độ tàu phụ chọn trước ở phần chuẩn bị hạm đội ===== */
(function(){
const st=document.createElement('style');st.textContent=`
body.c80pv #pvhud{left:max(16px,env(safe-area-inset-left,0px));top:calc(130px + env(safe-area-inset-top,0px));transform:none;width:min(36vw,230px);text-align:left;background:rgba(6,12,32,.55);border:1px solid #ff6a7a66;border-radius:8px;padding:3px 8px;box-sizing:border-box}
body.c80pv #c36sc{left:max(16px,env(safe-area-inset-left,0px))!important;right:auto!important;top:calc(176px + env(safe-area-inset-top,0px))!important;transform:none!important}
body.c80pv #skbn{display:none!important}
body.c80pv #c36sc{display:none!important}
.c80m{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 10px;border:1.5px solid #1f4a8a;border-radius:12px;background:linear-gradient(#071a3c,#050f2a);color:#dfe9ff;font:700 13px system-ui,sans-serif}
.c80m b{margin-right:4px;color:#bfe3ff}.c80m button{padding:5px 10px;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#cfe0ff;font:800 12px system-ui,sans-serif;cursor:pointer}
.c80m button.on{background:linear-gradient(#ffd766,#f0a500);color:#1a1200;border-color:#ffc53d}.c80m small{flex-basis:100%;color:#8fa6d8;font-weight:600}`;document.head.appendChild(st);
const M=[['fol','🚀 Theo tàu chính','Tàu phụ bay theo bảo vệ tàu chính'],['atk','⚔ Tấn công','100% tàu phụ cùng lao vào tấn công, không rút lui'],['def','🛡 Phòng thủ','Tàu phụ chạy quanh thảm bảo vệ trụ sở']];
function box(pv){const m=pv?(S.c69pv||'atk'):(S.c69m||'fol'),d=document.createElement('div');d.dataset.pv=pv?1:'';d.className='c80m';const sp=S.c82spd||1;d.innerHTML=pv?'<b>Tốc độ trận:</b>'+[1,2].map(v=>`<button data-c82s="${v}" class="${v===sp?'on':''}">x${v}</button>`).join('')+'<small>Chế độ tàu phụ chỉnh ở phần Chuẩn bị hạm đội</small>':'<b>Chế độ tàu phụ:</b>'+M.map(x=>`<button data-c80="${x[0]}" class="${x[0]===m?'on':''}">${x[1]}</button>`).join('')+'<b style="margin-left:10px">Tốc độ trận:</b>'+[1,2].map(v=>`<button data-c82s="${v}" class="${v===sp?'on':''}">x${v}</button>`).join('')+'<small>'+(M.find(x=>x[0]===m)||M[0])[2]+'</small>';
  d.onclick=e=>{const v=e.target.closest('button[data-c82s]');if(v){S.c82spd=+v.dataset.c82s;try{save()}catch(_){}document.querySelectorAll('.c80m').forEach(x=>x.replaceWith(box(!!x.dataset.pv)));return}const b=e.target.closest('button[data-c80]');if(!b)return;if(pv)S.c69pv=b.dataset.c80;else{S.c69m=b.dataset.c80;S.c69pv=S.c69m}try{save()}catch(_){}document.querySelectorAll('.c80m').forEach(x=>x.replaceWith(box(!!x.dataset.pv)))};return d}
function inject(){try{const fb=document.getElementById('flbody'),pre=document.getElementById('dfpre');if(fb&&pre&&pre.style.display!=='none'&&fb.childElementCount&&!fb.querySelector('.c80m'))fb.insertBefore(box(false),fb.children[1]||null);
  const f=document.querySelector('#lvpane .pvfm');if(f&&f.offsetParent&&!(f.previousElementSibling&&f.previousElementSibling.classList.contains('c80m')))f.insertAdjacentElement('beforebegin',box(true))}catch(e){}
  try{const G=typeof DG!=='undefined'?DG:null,on=!!(G&&G.pvp&&!G.done);document.body.classList.toggle('c80pv',on);const h=document.getElementById('pvhud'),sc=document.getElementById('c36sc');if(sc){if(on&&h&&getComputedStyle(h).display!=='none'){const r=h.getBoundingClientRect();sc.style.setProperty('top',Math.round(r.bottom+6)+'px','important')}else sc.style.removeProperty('top')}}catch(e){}}
setInterval(inject,300);
})();
/* ===== c81: PvP — thanh máu tàu phụ của địch, đặt ngay dưới hàng tàu phụ của ta ===== */
(function(){
const st=document.createElement('style');st.textContent=`#c81el{position:fixed;top:calc(66px + env(safe-area-inset-top,0px));right:calc(max(16px,env(safe-area-inset-right,0px)) + clamp(92px,17vh,124px));display:none;gap:6px;z-index:6;pointer-events:none;flex-wrap:nowrap;max-width:46vw;overflow:hidden;align-items:flex-end}
#c81el .t{font:800 10px system-ui,sans-serif;color:#ff9aa6;text-shadow:0 1px 2px #000;align-self:center;margin-right:2px}
#c81el .al{width:46px;display:flex;flex-direction:column;align-items:center;gap:2px}
#c81el .av{width:34px;height:34px;border-radius:50%;border:2px solid #ff4f6a;background:#2a0812 center/80% no-repeat;box-shadow:0 0 8px rgba(255,79,106,.45)}
#c81el .hp{width:40px;height:5px;border-radius:3px;background:#2a0812;border:1px solid #7a1d2a;overflow:hidden}
#c81el .hp i{display:block;height:100%;background:linear-gradient(90deg,#ff3a4a,#ff9a6a)}
#c81el .al.dead .av{filter:grayscale(1) brightness(.45);border-color:#555}
@media (max-width:600px){#c81el{top:calc(56px + env(safe-area-inset-top,0px))}#c81el .al{width:38px}#c81el .av{width:28px;height:28px}#c81el .hp{width:34px}}`;document.head.appendChild(st);
const EL=document.createElement('div');EL.id='c81el';document.body.appendChild(EL);let key='';
setInterval(()=>{try{const G=typeof DG!=='undefined'?DG:null,def=document.getElementById('def');if(!G||!G.pvp||G.done||!def||def.style.display==='none'){EL.style.display='none';key='';return}
  const cur=(G.en||[]).filter(e=>e.pvEsc);G.c81L=G.c81L||[];cur.forEach(e=>{if(!G.c81L.includes(e))G.c81L.push(e)});const L=G.c81L;
  if(!L.length){EL.style.display='none';return}const k=L.length+'';if(k!==key){key=k;EL.innerHTML='<span class="t">ĐỊCH</span>'+L.map(e=>`<div class="al"><div class="av" style="background-image:url('${(e.sh&&e.sh.img)||''}')"></div><div class="hp"><i></i></div></div>`).join('')}
  EL.style.display='flex';[...EL.querySelectorAll('.al')].forEach((el,i)=>{const e=L[i];if(!e)return;const f=e.dead?0:Math.max(0,e.hp/e.max);el.classList.toggle('dead',!!e.dead||f<=0);el.querySelector('.hp i').style.width=(f*100)+'%'})}catch(e){}},200);
})();
/* ===== c82: tốc độ trận chọn trước · tàu phụ tự dùng kỹ năng của thuyền trưởng gắn trên chính nó ===== */
(function(){let lastG=null;
setInterval(()=>{try{const G=typeof DG!=='undefined'?DG:null;if(G&&G!==lastG){lastG=G;dfSpeed=S.c82spd||1;const b=document.getElementById('dfspd');if(b)b.textContent='x'+dfSpeed}if(!G)lastG=null}catch(e){}},200);
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&!G.done&&window.CSK&&CSK.cast)(G.al||[]).forEach(a=>{if(a.dead||!a.c82sk||!a.c82sk.length||a.silT>0||a.stun>0)return;
    const near=(G.en||[]).some(e=>!e.dead&&!(e.spawn>G.t)&&Math.hypot(e.x-a.x,e.y-a.y)<16);a.c82sk.forEach(k=>{k.cd-=dt;if(k.cd>0||!near)return;k.cd=k.cd0||20;a.cs=a.cs||{};try{CSK.cast(a,k,1)}catch(e){console.error(e)}})})}catch(e){}return r}}
})();

