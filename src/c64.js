/* ===== c64: Tự xây căn cứ theo mẫu (theo cấp Trụ sở) — 5.000 Đá mỗi lần ===== */
(function(){
const COST=5000;let armT=0;
function build(){
  const R=bReg(),P0=bPos(),off=bOff(),rot=bRotMap();
  const L=bAvail().slice();const P={},RT={};const occ=[];
  const fits=(x,y,w,h)=>x>=R.x0&&y>=R.y0&&x+w<=R.x1&&y+h<=R.y1&&!occ.some(o=>x<o[0]+o[2]&&x+w>o[0]&&y<o[1]+o[3]&&y+h>o[1]);
  const put=(b,x,y,w,h)=>{P[b.id]=[x,y];occ.push([x,y,w,h])};
  const cx=(R.x0+R.x1)/2,cy=(R.y0+R.y1)/2;
  const cells=[];for(let y=R.y0;y<R.y1;y++)for(let x=R.x0;x<R.x1;x++)cells.push([x,y]);
  const spiral=(b,w,h,gap)=>{const C=cells.map(c=>[c[0],c[1],Math.hypot(c[0]+w/2-cx,c[1]+h/2-cy)]).sort((a,b)=>a[2]-b[2]);
    for(const c of C){if(gap){if(!fits(c[0]-1,c[1]-1,w+2,h+2)&&!fits(c[0],c[1],w,h))continue}if(fits(c[0],c[1],w,h)){put(b,c[0],c[1],w,h);return true}}return false};
  const hq=L.find(b=>b.t==='hq');
  if(hq){const x=Math.round(cx-hq.w/2),y=Math.round(cy-hq.h/2);if(fits(x,y,hq.w,hq.h))put(hq,x,y,hq.w,hq.h);else spiral(hq,hq.w,hq.h)}
  const walls=L.filter(b=>b.t==='wall'),tur=L.filter(b=>b.t!=='hq'&&b.t!=='wall'&&typeof BT!=='undefined'&&BT[b.t]),oth=L.filter(b=>b.t!=='hq'&&b.t!=='wall'&&!(typeof BT!=='undefined'&&BT[b.t]));
  const big=a=>a.sort((p,q)=>q.w*q.h-p.w*p.h);
  /* lõi: công trình hỗ trợ sát trụ sở, pháo phòng thủ bao bên ngoài */
  big(oth).forEach(b=>spiral(b,b.w,b.h));big(tur).forEach(b=>spiral(b,b.w,b.h));
  /* tường bao quanh lõi */
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;occ.forEach(o=>{x0=Math.min(x0,o[0]);y0=Math.min(y0,o[1]);x1=Math.max(x1,o[0]+o[2]);y1=Math.max(y1,o[1]+o[3])});
  let wi=0;const W=walls;
  for(let ring=1;ring<=3&&wi<W.length;ring++){const a=x0-ring*2+1,b=y0-ring*2+1,c=x1+ring*2-1,d=y1+ring*2-1;
    for(let x=a;x+2<=c&&wi<W.length;x+=2){if(fits(x,b-1,2,1)){RT[W[wi].id]=false;put(W[wi++],x,b-1,2,1)}}
    for(let x=a;x+2<=c&&wi<W.length;x+=2){if(fits(x,d,2,1)){RT[W[wi].id]=false;put(W[wi++],x,d,2,1)}}
    for(let y=b;y+2<=d&&wi<W.length;y+=2){if(fits(a-1,y,1,2)){RT[W[wi].id]=true;put(W[wi++],a-1,y,1,2)}}
    for(let y=b;y+2<=d&&wi<W.length;y+=2){if(fits(c,y,1,2)){RT[W[wi].id]=true;put(W[wi++],c,y,1,2)}}}
  for(;wi<W.length;wi++){RT[W[wi].id]=false;spiral(W[wi],2,1)}
  Object.keys(P0).forEach(k=>delete P0[k]);let put0=0,kho=0;
  L.forEach(b=>{if(P[b.id]){P0[b.id]=P[b.id];delete off[b.id];put0++}else{off[b.id]=true;kho++}});
  BLD.forEach(b=>{if(b.t==='wall'&&RT[b.id]!==undefined)rot[b.id]=RT[b.id]});
  try{bApplyRot()}catch(e){}return [put0,kho]}
function click(btn){
  if(Date.now()-armT>4000){armT=Date.now();btn.textContent='Bấm lần nữa: xây (5.000 Đá)';setTimeout(()=>{if(Date.now()-armT>=3900)btn.textContent='Tự xây theo mẫu'},4000);return}
  armT=0;btn.textContent='Tự xây theo mẫu';
  if((S.da||0)<COST){toast('Cần 5.000 Đá để tự xây căn cứ theo mẫu');return}
  S.da-=COST;const r=build();try{save()}catch(e){}try{bRender()}catch(e){}try{refresh()}catch(e){}
  toast('Đã xây căn cứ theo mẫu Trụ sở cấp '+bLv('hq')+' · '+r[0]+' công trình'+(r[1]?' · '+r[1]+' vào kho (hết chỗ)':'')+' · −5.000 Đá')}
window.C64={build};
function hook(){const b=document.getElementById('btpl');if(b&&!b.c64){b.c64=1;b.onclick=()=>click(b)}}
hook();setInterval(hook,1500);
})();
