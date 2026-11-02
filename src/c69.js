/* ===== c69: tàu phụ hộ tống — chế độ Theo tàu chính / Tấn công / Phòng thủ ===== */
(function(){
const MODES=[['fol','Theo tàu chính','🚀'],['atk','Tấn công','⚔'],['def','Phòng thủ','🛡']];
const mode=()=>S.c69m||'fol';
function patrol(G){const A=(G.al||[]).filter(a=>!a.dead);if(!A.length)return;let Rg=null;try{Rg=C39.region(G)}catch(e){}if(!Rg&&G.hq)Rg={x0:G.hq.x-6,y0:G.hq.y-6,x1:G.hq.x+6,y1:G.hq.y+6};if(!Rg)return;
  const o=3,x0=Rg.x0-o,y0=Rg.y0-o,W=Rg.x1-Rg.x0+2*o,H=Rg.y1-Rg.y0+2*o,P=2*(W+H);
  A.forEach((a,i)=>{let s=((G.t*2.2+i*P/A.length)%P+P)%P,x,y;if(s<W){x=x0+s;y=y0}else if((s-=W)<H){x=x0+W;y=y0+s}else if((s-=H)<W){x=x0+W-s;y=y0+H}else{s-=W;x=x0;y=y0+H-s}a.c69pt={x,y}})}
{const _A=dfAllies;dfAllies=function(dt){try{const G=DG;if(G){G.c69m=mode();if(G.c69m==='def')patrol(G)}}catch(e){}return _A.apply(this,arguments)}}
/* nút chọn chế độ trong trận */
const bar=document.createElement('div');bar.id='c69bar';bar.style.cssText='position:fixed;left:10px;top:calc(150px + env(safe-area-inset-top,0px));z-index:8;display:none;flex-direction:column;gap:4px;font:800 11px system-ui,sans-serif';
bar.innerHTML='<div style="color:#bfe3ff;text-shadow:0 1px 2px #000">TÀU PHỤ</div>'+MODES.map(m=>`<button data-m="${m[0]}" style="pointer-events:auto;padding:4px 8px;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#cfe0ff;text-align:left;cursor:pointer">${m[2]} ${m[1]}</button>`).join('');
document.body.appendChild(bar);
bar.onclick=e=>{const b=e.target.closest('button[data-m]');if(!b)return;S.c69m=b.dataset.m;if(typeof DG!=='undefined'&&DG)DG.c69m=S.c69m;try{save()}catch(_){}paint();
  try{toast(S.c69m==='atk'?'Tàu phụ: 100% cùng lao vào tấn công, không rút lui cho tới khi bị hạ':S.c69m==='def'?'Tàu phụ: chạy quanh ngoài thảm bảo vệ trụ sở':'Tàu phụ: đi theo tàu chính')}catch(_){}};
function paint(){const m=mode();bar.querySelectorAll('button').forEach(b=>{const on=b.dataset.m===m;b.style.background=on?'linear-gradient(#ffd766,#f0a500)':'#0b1a44';b.style.color=on?'#1a1200':'#cfe0ff';b.style.borderColor=on?'#ffc53d':'#2b5ac9'})}
setInterval(()=>{const G=typeof DG!=='undefined'?DG:null,on=!!(G&&!G.done&&!G.pvp&&(G.al||[]).some(a=>!a.dead)&&document.getElementById('def')&&document.getElementById('def').style.display!=='none');const v=on?'flex':'none';if(bar.style.display!==v){bar.style.display=v;if(on)paint()}},400);
window.C69={mode,patrol};
})();
/* ===== c80: PvP — sắp lại HUD (máu trụ sở đối thủ, bảng điểm) tránh chồng lên ô tàu phụ; ẩn thông báo kỹ năng; chế độ tàu phụ chọn trước ở phần chuẩn bị hạm đội ===== */
(function(){
const st=document.createElement('style');st.textContent=`
body.c80pv #pvhud{left:max(16px,env(safe-area-inset-left,0px));top:calc(130px + env(safe-area-inset-top,0px));transform:none;width:min(36vw,230px);text-align:left;background:rgba(6,12,32,.55);border:1px solid #ff6a7a66;border-radius:8px;padding:3px 8px;box-sizing:border-box}
body.c80pv #c36sc{left:max(16px,env(safe-area-inset-left,0px))!important;right:auto!important;top:calc(176px + env(safe-area-inset-top,0px))!important;transform:none!important}
body.c80pv #skbn{display:none!important}
.c80m{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 10px;border:1.5px solid #1f4a8a;border-radius:12px;background:linear-gradient(#071a3c,#050f2a);color:#dfe9ff;font:700 13px system-ui,sans-serif}
.c80m b{margin-right:4px;color:#bfe3ff}.c80m button{padding:5px 10px;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#cfe0ff;font:800 12px system-ui,sans-serif;cursor:pointer}
.c80m button.on{background:linear-gradient(#ffd766,#f0a500);color:#1a1200;border-color:#ffc53d}.c80m small{flex-basis:100%;color:#8fa6d8;font-weight:600}`;document.head.appendChild(st);
const M=[['fol','🚀 Theo tàu chính','Tàu phụ bay theo bảo vệ tàu chính'],['atk','⚔ Tấn công','100% tàu phụ cùng lao vào tấn công, không rút lui'],['def','🛡 Phòng thủ','Tàu phụ chạy quanh thảm bảo vệ trụ sở']];
function box(){const m=S.c69m||'fol',d=document.createElement('div');d.className='c80m';d.innerHTML='<b>Chế độ tàu phụ:</b>'+M.map(x=>`<button data-c80="${x[0]}" class="${x[0]===m?'on':''}">${x[1]}</button>`).join('')+'<small>'+(M.find(x=>x[0]===m)||M[0])[2]+'</small>';
  d.onclick=e=>{const b=e.target.closest('button[data-c80]');if(!b)return;S.c69m=b.dataset.c80;try{save()}catch(_){}document.querySelectorAll('.c80m').forEach(x=>x.replaceWith(box()))};return d}
function inject(){try{const fb=document.getElementById('flbody'),pre=document.getElementById('dfpre');if(fb&&pre&&pre.style.display!=='none'&&fb.childElementCount&&!fb.querySelector('.c80m'))fb.insertBefore(box(),fb.children[1]||null);
  const f=document.querySelector('#lvpane .pvfm');if(f&&f.offsetParent&&!(f.previousElementSibling&&f.previousElementSibling.classList.contains('c80m')))f.insertAdjacentElement('beforebegin',box())}catch(e){}
  try{const G=typeof DG!=='undefined'?DG:null;document.body.classList.toggle('c80pv',!!(G&&G.pvp&&!G.done))}catch(e){}}
setInterval(inject,300);
})();

