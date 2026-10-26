
/* ===== c38: năng lượng cho mọi tàu (tàu phụ, tàu địch, boss) · thanh năng lượng dưới thanh máu ===== */
(function(){
const isShip=u=>u&&!u.sb&&!u.c34u&&u.w==null&&Array.isArray(u.ws);
const cost=w=>{if(!w)return 0;if(w.ec!=null&&isFinite(w.ec))return +w.ec;try{if(w.w&&typeof wCost==='function')return +wCost(w.w.id)||0}catch(e){}return 1};
/* dự trữ = 12 giây bắn liên tục, hồi = 75% mức tiêu hao khi bắn liên tục */
function initE(u){if(u.c38)return;u.c38=1;let D=0;(u.ws||[]).forEach(w=>{D+=cost(w)/Math.max(.1,w.cd||1)});D=Math.max(.2,D);
  u.nrgMax=Math.max(10,Math.round(D*12));u.nrg=u.nrgMax;u.c38g=D*.75}
function ships(G){return [].concat(G.al||[],G.en||[]).filter(u=>isShip(u)&&u!==G.pl&&!(u.spawn>G.t))}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&dt>0)ships(G).forEach(u=>{initE(u);if(u.dead){u.nrg=u.nrgMax;return}u.c38d=Math.max(0,(u.c38d||0)-dt);if(u.c38d<=0)u.nrg=Math.min(u.nrgMax,u.nrg+u.c38g*dt)})}catch(e){console.error(e)}return r}}
/* mỗi phát bắn tốn năng lượng; hết năng lượng thì không bắn được */
{const _F=dfFireFrom;dfFireFrom=function(s,w,tg){try{const G=DG;if(G&&s&&s!==G.pl&&isShip(s)&&!G.pv&&G.ehq!==s){initE(s);const c=cost(w);if(c>0){if(s.nrg<c){if(w)w.t=Math.min(w.t||0,.25);return}s.nrg-=c;s.c38d=1}}}catch(e){}return _F.apply(this,arguments)}}
/* 2D: vẽ thanh năng lượng dưới thanh máu */
{const _c=window.c16Draw;window.c16Draw=function(q,G,X,Y,s,T){if(_c)_c.apply(this,arguments);try{if(!G||(window.R3D&&R3D.live))return;
  [G.pl].concat(G.al||[],G.en||[]).forEach(u=>{if(!u||u.dead||!isShip(u)&&u!==G.pl||(u.spawn>G.t))return;const m=u===G.pl?u.nrgMax:u.nrgMax,v=u.nrg;if(!(m>0))return;
    const bw=(u.size||2)*s*.9,x=X(u.x)-bw/2,y=Y(u.y)-(u.size||2)*s*.55+2;q.save();q.fillStyle='#000a';q.fillRect(x,y,bw,3);q.fillStyle='#35c8ff';q.fillRect(x,y,bw*Math.max(0,Math.min(1,v/m)),3);q.restore()})}catch(e){}}}
window.C38={initE,cost};
})();
