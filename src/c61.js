/* ===== c61: tàu vào trận luôn đứng ngoài thảm, không đè lên công trình (Level + PvP) ===== */
(function(){
function spawnFix(G,onlyP){const P=G.pl;if(!P||!G.wd)return;
  let Rg=null;try{Rg=window.C39&&C39.region?C39.region(G):null}catch(e){}
  const W=G.wd.Wd,H=G.wd.Hd,blk=[];
  (G.bl||[]).forEach(b=>{if(b&&b.hp>0&&b.w)blk.push([b.x,b.y,b.w/2,b.h/2])});
  (G.eu||[]).forEach(u=>{if(u&&!u.dead&&u.w)blk.push([u.x,u.y,u.w/2,u.h/2])});
  const placed=[];
  const rad=s=>Math.max(.8,(s.size||2.2)*.5);
  const free=(x,y,r)=>{if(x<r+.5||y<r+.5||x>W-r-.5||y>H-r-.5)return false;
    if(Rg&&x>Rg.x0-r-.6&&x<Rg.x1+r+.6&&y>Rg.y0-r-.6&&y<Rg.y1+r+.6)return false;
    for(const b of blk)if(Math.abs(x-b[0])<b[2]+r+.4&&Math.abs(y-b[1])<b[3]+r+.4)return false;
    for(const q of placed)if(Math.hypot(x-q[0],y-q[1])<q[2]+r+.4)return false;return true};
  const find=(tx,ty,r)=>{if(free(tx,ty,r))return [tx,ty];let best=null,bd=1e9;
    for(let R=.8;R<60&&!best;R+=.8){for(let k=0;k<36;k++){const a=k/36*Math.PI*2,x=tx+Math.cos(a)*R,y=ty+Math.sin(a)*R;if(free(x,y,r)){const d=Math.hypot(x-tx,y-ty);if(d<bd){bd=d;best=[x,y]}}}}
    return best||[tx,ty]};
  const put=(s,x,y)=>{s.x=x;s.y=y;s.sx=x;s.sy=y;s.tx=x;s.ty=y};
  const pr=rad(P),front=G.pvp&&Rg&&!onlyP,fy=front?Rg.y0-pr-1.4:P.y,fx=front?(G.hq?G.hq.x:(Rg.x0+Rg.x1)/2):P.x,pp=find(fx,fy,pr);put(P,pp[0],pp[1]);placed.push([pp[0],pp[1],pr]);
  const A=onlyP?[]:(G.al||[]).filter(a=>a&&!a.dead);
  A.forEach((a,i)=>{const r=rad(a),tx=P.x+(i-(A.length-1)/2)*Math.max(3,r*2+.8),ty=front?Rg.y0-r-1.4:P.y+1.6;const q=find(tx,ty,r);put(a,q[0],q[1]);placed.push([q[0],q[1],r])});
  G.cam={x:P.x,y:P.y}}
window.c61Spawn=spawnFix;window.c61Respawn=G=>{try{spawnFix(G,1)}catch(e){console.error(e)}};
{const _St=dfStep;dfStep=function(){const G=DG;if(G&&!G._c61&&G.pl&&G.hq){G._c61=1;try{spawnFix(G)}catch(e){console.error(e)}}return _St.apply(this,arguments)}}
})();
