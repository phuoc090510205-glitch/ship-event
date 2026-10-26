
/* ===== c37: bỏ thanh năng lượng ở trên · cần điều khiển + nút thao tác cho điện thoại và máy tính ===== */
(function(){
const def=document.getElementById('def');if(!def)return;
const st=document.createElement('style');st.textContent=`
#def .dfbars>.dfbw:not(#df3boss){display:none!important}
#def .dfhint{display:none!important}
#c37joy{position:absolute;left:calc(max(18px,env(safe-area-inset-left,0px)) + 6px);bottom:calc(22px + env(safe-area-inset-bottom,0px));width:132px;height:132px;border-radius:50%;z-index:7;touch-action:none;user-select:none;-webkit-user-select:none;
  background:radial-gradient(circle,rgba(79,214,255,.10) 0 55%,rgba(79,214,255,.18) 56% 100%);border:2px solid rgba(79,214,255,.5);box-shadow:0 0 18px rgba(79,214,255,.25) inset;cursor:grab}
#c37joy i{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#bff0ff,#3aa6e8 60%,#1a5aa0);box-shadow:0 0 16px rgba(79,214,255,.7);pointer-events:none;transition:transform .06s}
#c37joy b{position:absolute;color:rgba(200,235,255,.55);font:700 12px/1 system-ui,sans-serif;pointer-events:none}
#c37joy .u{left:50%;top:6px;transform:translateX(-50%)}#c37joy .d{left:50%;bottom:6px;transform:translateX(-50%)}#c37joy .l{left:7px;top:50%;transform:translateY(-50%)}#c37joy .r{right:7px;top:50%;transform:translateY(-50%)}
#c37btn{position:absolute;left:calc(max(18px,env(safe-area-inset-left,0px)) + 150px);bottom:calc(26px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:8px;z-index:7}
#c37btn button{width:52px;height:52px;border-radius:50%;border:2px solid rgba(120,170,255,.55);background:rgba(8,20,50,.8);color:#e8f2ff;font:800 11px/1.1 'Be Vietnam Pro',system-ui,sans-serif;cursor:pointer;touch-action:manipulation;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
#c37btn button span{font-size:18px;line-height:1}#c37btn button:active{background:rgba(40,90,180,.9)}
#c37key{position:absolute;left:50%;bottom:calc(4px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:6;pointer-events:none;font:600 11px/1.2 'Be Vietnam Pro',system-ui,sans-serif;color:rgba(200,225,255,.7);white-space:nowrap;text-shadow:0 0 4px #000}
#def .dfk b{font-size:12px;background:rgba(0,0,0,.55);border-radius:6px;padding:0 4px}
@media (hover:none),(max-width:820px){#c37key{display:none}}
@media (max-width:600px){#c37joy{width:112px;height:112px}#c37joy i{width:48px;height:48px;margin:-24px 0 0 -24px}#c37btn{left:calc(max(14px,env(safe-area-inset-left,0px)) + 124px)}#c37btn button{width:46px;height:46px}}`;
document.head.appendChild(st);
const joy=document.createElement('div');joy.id='c37joy';joy.setAttribute('aria-label','Cần điều khiển di chuyển tàu');joy.innerHTML='<b class="u">▲</b><b class="d">▼</b><b class="l">◀</b><b class="r">▶</b><i></i>';
const btn=document.createElement('div');btn.id='c37btn';btn.innerHTML='<button id="c37stop" title="Dừng tàu (phím Space)"><span>■</span>Dừng</button><button id="c37home" title="Về trụ sở (phím H)"><span>⌂</span>Về TS</button>';
const key=document.createElement('div');key.id='c37key';key.textContent='Di chuyển: W A S D / phím mũi tên / cần điều khiển · Kỹ năng: phím 1–6 hoặc bấm nút · Dừng: Space · Về trụ sở: H';
def.appendChild(joy);def.appendChild(btn);def.appendChild(key);
const knob=joy.querySelector('i');const J={id:null,x:0,y:0};
const R3=()=>window.R3D;
function setJ(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,m=r.width*.38;let dx=e.clientX-cx,dy=e.clientY-cy;const l=Math.hypot(dx,dy);if(l>m){dx*=m/l;dy*=m/l}
  J.x=dx/m;J.y=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`;const R=R3();if(R&&R.live&&R.joy){if(R.joy.id===null||R.joy.id==='c37'){R.joy.id='c37';R.joy.x=J.x;R.joy.y=J.y}}}
joy.addEventListener('pointerdown',e=>{J.id=e.pointerId;try{joy.setPointerCapture(e.pointerId)}catch(x){}setJ(e);e.preventDefault();e.stopPropagation()});
joy.addEventListener('pointermove',e=>{if(e.pointerId!==J.id)return;setJ(e);e.preventDefault();e.stopPropagation()});
const end=e=>{if(e.pointerId!==J.id)return;J.id=null;J.x=J.y=0;knob.style.transform='';const R=R3();if(R&&R.joy&&R.joy.id==='c37'){R.joy.id=null;R.joy.x=R.joy.y=0}try{const P=DG&&DG.pl;if(P){P.tx=P.x;P.ty=P.y}}catch(x){}};
joy.addEventListener('pointerup',end);joy.addEventListener('pointercancel',end);joy.addEventListener('lostpointercapture',end);
/* chế độ 2D: cần điều khiển đặt điểm đến theo hướng trên bản đồ */
{const _S=dfStep;dfStep=function(dt){try{const G=DG,P=G&&G.pl,R=R3();if(P&&!P.dead&&J.id!==null&&!(R&&R.live)){const l=Math.hypot(J.x,J.y);if(l>.12){const k=1.2+3.3*Math.min(1,(l-.12)/.7);P.tx=Math.max(.5,Math.min(G.wd.Wd-.5,P.x+J.x/l*k));P.ty=Math.max(.5,Math.min(G.wd.Hd-.5,P.y+J.y/l*k))}else{P.tx=P.x;P.ty=P.y}}}catch(e){}return _S.apply(this,arguments)}}
function stop(){try{const P=DG&&DG.pl;if(P){P.tx=P.x;P.ty=P.y;P.vx=(P.vx||0)*.3;P.vy=(P.vy||0)*.3}}catch(e){}}
function home(){try{const G=DG,P=G&&G.pl,hq=G&&G.hq;if(P&&hq&&!P.dead){P.tx=hq.x;P.ty=hq.y+(hq.h||2)/2+2.2}}catch(e){}}
btn.querySelector('#c37stop').onclick=e=>{e.stopPropagation();stop()};btn.querySelector('#c37home').onclick=e=>{e.stopPropagation();home()};
['pointerdown','pointerup'].forEach(t=>btn.addEventListener(t,e=>e.stopPropagation()));
addEventListener('keydown',e=>{if(typeof DG==='undefined'||!DG||def.style.display==='none'||(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)))return;
  if(e.code==='Space'){stop();e.preventDefault()}else if((e.key||'').toLowerCase()==='h')home()});
/* ẩn khi không ở trong trận */
setInterval(()=>{const on=def.style.display!=='none'&&typeof DG!=='undefined'&&DG&&!DG.done;joy.style.display=btn.style.display=key.style.display=on?'':'none'},300);
window.C37={J,stop,home};
})();
