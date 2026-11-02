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
setInterval(()=>{const G=typeof DG!=='undefined'?DG:null,on=!!(G&&!G.done&&(G.al||[]).some(a=>!a.dead)&&document.getElementById('def')&&document.getElementById('def').style.display!=='none');const v=on?'flex':'none';if(bar.style.display!==v){bar.style.display=v;if(on)paint()}},400);
window.C69={mode,patrol};
})();
