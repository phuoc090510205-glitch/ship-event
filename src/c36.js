
/* ===== c36: xóa Lò tinh luyện · bảng đồng đội + bảng tỉ số kiểu Liên Quân · hồi sinh 10 giây (boss 20 giây) ===== */
(function(){
/* ---------- 1) xóa công trình Lò tinh luyện ---------- */
try{const i=BLD.findIndex(b=>b.id==='refine');if(i>=0)BLD.splice(i,1);if(typeof S!=='undefined'&&S.base&&S.base.pos)delete S.base.pos.refine}catch(e){}
/* ---------- 2) thời gian hồi sinh ---------- */
const RS=u=>(u&&(u.boss||(u.sh&&u.sh.bk)||u.c18boss))?20:10;window.c36RS=RS;
/* ---------- 3) đếm hạ gục ---------- */
const isShip=u=>u&&!u.sb&&!u.c34u&&!u.ghost&&!u.c28clone&&u.w==null;
function onDie(G,u){if(!G||!isShip(u))return;if(u.team==='e'||(G.en||[]).includes(u))G.c36k=(G.c36k||0)+1;else G.c36d=(G.c36d||0)+1;
  if(u!==G.pl&&!u.ghost&&(u.ally||u.capn)&&!(G.en||[]).includes(u)){u.c36rs=RS(u);u.c36rm=u.c36rs}}
{const _D=dfDmgS;dfDmgS=function(s,d,f){const was=s&&!s.dead,r=_D.apply(this,arguments);try{if(was&&s.dead)onDie(DG,s)}catch(e){}return r}}
if(typeof dfDmgA==='function'){const _A=dfDmgA;dfDmgA=function(a,d){const was=a&&!a.dead,r=_A.apply(this,arguments);try{if(was&&a.dead)onDie(DG,a)}catch(e){}return r}}
/* đặt lại thời gian hồi sinh tàu chính: 10 giây, tàu boss 20 giây */
{const _D=dfDmgS;dfDmgS=function(s,d,f){const G=DG,was=s&&!s.dead,r=_D.apply(this,arguments);try{if(G&&s===G.pl&&was&&s.dead){const want=RS(s),orig=(G.bl||[]).some(b=>b.t==='hangar'&&b.hp>0)?4:8;G.respawn=Math.max(.05,want-Math.max(0,orig-(G.respawn||0)));G.c36rm=want}}catch(e){}return r}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{step(DG,dt)}catch(e){console.error(e)}return r}}
function step(G,dt){if(!G||G.pv||!(dt>0))return;const hq=G.hq;
  /* tàu đồng minh hồi sinh ở trụ sở */
  (G.al||[]).forEach((a,i)=>{if(!a||!a.dead||a.ghost||a.c17w||a.c18boss||!(a.ally||a.capn))return;if(a.c36rs==null){a.c36rs=RS(a);a.c36rm=a.c36rs}a.c36rs-=dt;
    if(a.c36rs<=0&&hq&&!(hq.hp<=0)){a.dead=false;a.hp=a.max;a.hit=0;a.shd=null;a.c36rs=null;const off=((i%5)-2)*2.4;a.x=hq.x+off;a.y=hq.y+(hq.h||2)/2+3;a.sx=a.x;a.sy=a.y;a.tx=a.x;a.ty=a.y;a.ang=-Math.PI/2;
      try{G.fx.push({x:a.x,y:a.y,r:2,t:.6,max:.6,col:'#7dffa0'})}catch(e){}}});
  /* PvP: tàu phụ địch hồi sinh ở trụ sở địch; tàu chính địch 10 giây */
  if(G.pvp&&G.eh&&!G.eh.dead){if(!G.c36esc)G.c36esc=(G.en||[]).filter(e=>e.pvEsc);
    G.c36esc.forEach((e,i)=>{if(!e.dead)return;e.c36rs=(e.c36rs==null?RS(e):e.c36rs)-dt;e.c36rm=RS(e);if(e.c36rs>0)return;e.c36rs=null;e.dead=false;e.hp=e.max;e.hit=0;
      e.x=G.eh.x+((i%10)-4.5)*2.4;e.y=G.eh.y+(G.eh.h||2)/2+5;e.tx=e.x;e.ty=e.y;e.ang=Math.PI/2;if(!G.en.includes(e))G.en.push(e)});}}

/* ---------- 4) giao diện: ẩn thanh máu tàu chính & trụ sở ở trên, thêm bảng đồng đội + bảng tỉ số ---------- */
const st=document.createElement('style');st.textContent=`
#def .dfbars>.dfbw:not(.e){display:none!important}
#c36al{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));right:calc(max(16px,env(safe-area-inset-right,0px)) + clamp(92px,17vh,124px));display:flex;gap:6px;z-index:6;pointer-events:none;flex-wrap:nowrap;max-width:46vw;overflow:hidden}
#c36al .al{width:46px;display:flex;flex-direction:column;align-items:center;gap:2px}
#c36al .av{position:relative;width:42px;height:42px;border-radius:50%;border:2px solid #3fa0ff;background:#0a1630 center/cover no-repeat;box-shadow:0 0 8px rgba(63,160,255,.45)}
#c36al .sh{position:absolute;right:-6px;bottom:-4px;width:22px;height:22px;border-radius:6px;border:1.5px solid #9fd8ff;background:#061024 center/contain no-repeat}
#c36al .hp{width:44px;height:5px;border-radius:3px;background:#0a1230;border:1px solid #1d3a86;overflow:hidden}
#c36al .hp i{display:block;height:100%;background:linear-gradient(90deg,#2fbf6f,#7dff9d)}
#c36al .al.lo .hp i{background:linear-gradient(90deg,#ff4a4a,#ff9a6a)}
#c36al .al.dead .av{filter:grayscale(1) brightness(.5);border-color:#666}
#c36al .al .cd{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font:800 16px/1 'Be Vietnam Pro',system-ui,sans-serif;color:#fff;text-shadow:0 0 4px #000}
#c36al .al.dead .cd{display:flex}
#c36sc{position:absolute;left:50%;top:calc(4px + env(safe-area-inset-top,0px));transform:translateX(-50%);display:flex;align-items:center;gap:10px;z-index:6;pointer-events:none;
  background:linear-gradient(90deg,rgba(20,70,160,.85),rgba(8,16,40,.9) 45%,rgba(8,16,40,.9) 55%,rgba(160,30,40,.85));border:1px solid rgba(120,170,255,.45);border-radius:10px;padding:3px 14px;font:800 18px/1.1 'Be Vietnam Pro',system-ui,sans-serif;color:#fff}
#c36sc .a{color:#6fc0ff;min-width:22px;text-align:right}#c36sc .b{color:#ff7a7a;min-width:22px}#c36sc small{font-size:10px;color:#cfe0ff;font-weight:700;letter-spacing:.05em}
#def.pv #c36sc{top:calc(56px + env(safe-area-inset-top,0px))}
#def:not(.r3) #c36sc{top:calc(50px + env(safe-area-inset-top,0px))}
#def .dfbars{margin-top:30px}#def.r3 .dfbars{top:30px}#def.r3.pv .dfbars{top:84px}
#c36rs{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);z-index:6;pointer-events:none;display:none;text-align:center;font:800 22px/1.3 'Be Vietnam Pro',system-ui,sans-serif;color:#fff;text-shadow:0 0 8px #000}
#c36rs b{display:block;font-size:46px;color:#ffd24a}
@media (max-width:600px){#c36al .al{width:38px}#c36al .av{width:34px;height:34px}#c36al .sh{width:18px;height:18px}#c36al .hp{width:36px}#c36sc{font-size:15px}}`;
document.head.appendChild(st);
const def=document.getElementById('def');let AL=null,SC=null,RV=null;
function els(){if(AL||!def)return;AL=document.createElement('div');AL.id='c36al';SC=document.createElement('div');SC.id='c36sc';RV=document.createElement('div');RV.id='c36rs';def.appendChild(AL);def.appendChild(SC);def.appendChild(RV)}
function port(n){try{const i=CAP.findIndex(c=>c[0]===n);return i>=0?PORT[i]:''}catch(e){return ''}}
let last='';
function hud(){const G=typeof DG!=='undefined'?DG:null;if(!def||def.style.display==='none'||!G||G.pv||!G.pl){if(AL)AL.style.display=SC.style.display=RV.style.display='none';return}els();
  const L=(G.al||[]).filter(a=>a&&!a.ghost&&!a.c17w&&!a.c18boss&&!a.c28clone&&(a.ally||a.capn));
  const key=L.map(a=>(a.capn||'')+'|'+((a.sh&&a.sh.id)||'')).join(',');
  if(key!==last){last=key;AL.innerHTML=L.map(a=>{const im=port(a.capn),si=(a.sh&&a.sh.img)||'';return `<div class="al"><div class="av" style="background-image:url('${im}')" title="${(a.capn||'')+' · '+(a.name||'')}"><div class="sh" style="background-image:url('${si}')"></div><div class="cd"></div></div><div class="hp"><i></i></div></div>`}).join('')}
  AL.style.display=L.length?'flex':'none';
  [...AL.children].forEach((el,i)=>{const a=L[i];if(!a)return;const f=a.dead?0:Math.max(0,a.hp/a.max);el.classList.toggle('dead',!!a.dead);el.classList.toggle('lo',f<.3);el.querySelector('.hp i').style.width=(f*100)+'%';
    if(a.dead)el.querySelector('.cd').textContent=a.c36rs!=null?Math.max(0,Math.ceil(a.c36rs)):''});
  SC.style.display='flex';SC.innerHTML=`<small>TA</small><span class="a">${G.c36k||0}</span><span>⚔</span><span class="b">${G.c36d||0}</span><small>ĐỊCH</small>`;
  const P=G.pl;if(P.dead&&!G.done&&!G.over){RV.style.display='block';RV.innerHTML=`Tàu bị hạ — hồi sinh sau<b>${Math.max(0,Math.ceil(G.respawn||0))}s</b>`}else RV.style.display='none'}
setInterval(()=>{try{hud()}catch(e){}},200);
window.C36={RS,hud};
})();
