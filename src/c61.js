/* ===== c61: tàu vào trận / hồi sinh xuất hiện ở ô trống trên thảm (không đè công trình, không chồng nhau) — Level + PvP ===== */
(function(){
function ctx(G){let Rg=null;try{Rg=window.C39&&C39.region?C39.region(G):null}catch(e){}
  const W=G.wd.Wd,H=G.wd.Hd,blk=[];(G.bl||[]).forEach(b=>{if(b&&b.hp>0&&b.w)blk.push([b.x,b.y,b.w/2,b.h/2])});(G.eu||[]).forEach(u=>{if(u&&!u.dead&&u.w)blk.push([u.x,u.y,u.w/2,u.h/2])});
  return {Rg,W,H,blk}}
const rad=s=>Math.max(.8,(s.size||2.2)*.5);
function mk(G,placed){const C=ctx(G),Rg=C.Rg;
  const okB=(x,y,r)=>{if(x<r+.5||y<r+.5||x>C.W-r-.5||y>C.H-r-.5)return false;for(const b of C.blk)if(Math.abs(x-b[0])<b[2]+r+.25&&Math.abs(y-b[1])<b[3]+r+.25)return false;for(const q of placed)if(Math.hypot(x-q[0],y-q[1])<q[2]+r+.35)return false;return true};
  const onC=(x,y,r)=>!Rg||(x>=Rg.x0+r*.5&&x<=Rg.x1-r*.5&&y>=Rg.y0+r*.5&&y<=Rg.y1-r*.5);
  const near=(tx,ty,r,inC)=>{let best=null,bd=1e9;for(let R=0;R<70&&!best;R+=.6){const n=R?Math.max(12,Math.round(R*8)):1;for(let k=0;k<n;k++){const a=k/n*Math.PI*2,x=tx+Math.cos(a)*R,y=ty+Math.sin(a)*R;if((!inC||onC(x,y,r))&&okB(x,y,r)){const d=Math.hypot(x-tx,y-ty);if(d<bd){bd=d;best=[x,y]}}}}return best};
  const rnd=(r)=>{if(!Rg)return null;for(let i=0;i<500;i++){const x=Rg.x0+r+Math.random()*(Rg.x1-Rg.x0-2*r),y=Rg.y0+r+Math.random()*(Rg.y1-Rg.y0-2*r);if(okB(x,y,r))return [x,y]}return null};
  return {Rg,near,rnd}}
const put=(s,p)=>{s.x=p[0];s.y=p[1];s.sx=p[0];s.sy=p[1];s.tx=p[0];s.ty=p[1];s.vx=0;s.vy=0};
function spawnFix(G,onlyP){const P=G.pl;if(!P||!G.wd)return;const placed=[];(onlyP?(G.al||[]).filter(a=>a&&!a.dead):[]).forEach(a=>placed.push([a.x,a.y,rad(a)]));
  const M=mk(G,placed),Rg=M.Rg,pr=rad(P);let tx=P.x,ty=P.y;
  if(G.pvp&&Rg&&G.hq){tx=G.hq.x;ty=Rg.y0+pr+.6}
  const pp=onlyP?(M.rnd(pr)||M.near(tx,ty,pr,1)||M.near(tx,ty,pr,0)):(M.near(tx,ty,pr,1)||M.near(tx,ty,pr,0));if(pp){put(P,pp);placed.push([pp[0],pp[1],pr])}
  if(!onlyP){(G.al||[]).filter(a=>a&&!a.dead).forEach((a,i,A)=>{const r=rad(a),q=M.near(P.x+(i-(A.length-1)/2)*Math.max(3,r*2+.8),P.y+(G.pvp?1.2:1.6),r,1)||M.near(P.x,P.y,r,0);if(q){put(a,q);placed.push([q[0],q[1],r]);a.ang=-Math.PI/2}})}
  if(!onlyP)G.cam={x:P.x,y:P.y}}
function respawnAlly(G,a){const placed=[[G.pl.x,G.pl.y,rad(G.pl)]];(G.al||[]).forEach(o=>{if(o!==a&&!o.dead)placed.push([o.x,o.y,rad(o)])});const M=mk(G,placed),r=rad(a),q=M.rnd(r)||M.near(a.x,a.y,r,1);if(q)put(a,q)}
window.c61Spawn=spawnFix;window.c61Respawn=G=>{try{spawnFix(G,1)}catch(e){console.error(e)}};
{const _St=dfStep;dfStep=function(){const G=DG;if(G&&!G._c61&&G.pl&&G.hq){G._c61=1;try{spawnFix(G)}catch(e){console.error(e)}}const r=_St.apply(this,arguments);
  try{if(G&&G===DG&&!G.done)(G.al||[]).forEach(a=>{if(a.dead){a._c61d=1}else if(a._c61d){a._c61d=0;respawnAlly(G,a)}})}catch(e){}return r}}
})();
