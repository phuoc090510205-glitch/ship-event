/* ===== c64: Tự xây căn cứ theo mẫu (nhiều mẫu, theo cấp Trụ sở) — 5.000 Đá mỗi lần ===== */
(function(){
const COST=5000;
const STY=[
 {k:'ring',n:'Pháo đài vòng tròn',d:'Trụ sở ở giữa, công trình hỗ trợ sát trụ sở, pháo bao vòng ngoài, tường bao 3 vòng.'},
 {k:'double',n:'Tường kép',d:'Lõi gọn, pháo bao quanh, hai lớp tường dày sát nhau chặn đạn.'},
 {k:'front',n:'Tiền tuyến',d:'Trụ sở lùi về sau, pháo dồn lên phía trước, nhiều hàng tường chắn phía trước (hợp PvP).'},
 {k:'spread',n:'Phân tán',d:'Công trình cách nhau 1 ô, trải rộng khắp căn cứ, khó bị nổ lan.'},
 {k:'maze',n:'Mê cung',d:'Nhiều vòng tường đứt quãng bao lõi, kẻ địch phải đi vòng.'},
 {k:'diamond',n:'Kim cương',d:'Xếp theo hình thoi, pháo viền phía ngoài, tường bậc thang bao quanh.'}];
function gen(sty){
  const R=bReg(),L=bAvail().slice(),P={},RT={},occ=[];
  const fits=(x,y,w,h)=>x>=R.x0&&y>=R.y0&&x+w<=R.x1&&y+h<=R.y1&&!occ.some(o=>x<o[0]+o[2]&&x+w>o[0]&&y<o[1]+o[3]&&y+h>o[1]);
  const free=(x,y,w,h,g)=>fits(x,y,w,h)&&(!g||!occ.some(o=>x-g<o[0]+o[2]&&x+w+g>o[0]&&y-g<o[1]+o[3]&&y+h+g>o[1]));
  const put=(b,x,y,w,h)=>{P[b.id]=[x,y];occ.push([x,y,w,h])};
  const cx=(R.x0+R.x1)/2,cy=(R.y0+R.y1)/2,H=R.y1-R.y0;
  const cells=[];for(let y=R.y0;y<R.y1;y++)for(let x=R.x0;x<R.x1;x++)cells.push([x,y]);
  const met={euc:(x,y)=>Math.hypot(x-cx,y-cy),man:(x,y)=>Math.abs(x-cx)+Math.abs(y-cy),front:(x,y)=>Math.abs(x-cx)*.8+Math.abs(y-(R.y0+H*.38)),back:(x,y)=>Math.abs(x-cx)+Math.abs(y-(R.y1-H*.2))*1.2};
  const place=(b,w,h,m,g)=>{const f=met[m]||met.euc;const C=cells.map(c=>[c[0],c[1],f(c[0]+w/2,c[1]+h/2)]).sort((a,b)=>a[2]-b[2]);
    for(const c of C)if(free(c[0],c[1],w,h,g)){put(b,c[0],c[1],w,h);return true}if(g)return place(b,w,h,m,0);return false};
  const hq=L.find(b=>b.t==='hq'),walls=L.filter(b=>b.t==='wall'),isT=b=>typeof BT!=='undefined'&&BT[b.t],tur=L.filter(b=>b.t!=='hq'&&b.t!=='wall'&&isT(b)),oth=L.filter(b=>b.t!=='hq'&&b.t!=='wall'&&!isT(b));
  const big=a=>a.slice().sort((p,q)=>q.w*q.h-p.w*p.h);let wi=0;
  const W=(x,y,v)=>{if(wi>=walls.length)return;const w=v?1:2,h=v?2:1;if(fits(x,y,w,h)){RT[walls[wi].id]=!!v;put(walls[wi++],x,y,w,h)}};
  const bbox=()=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;occ.forEach(o=>{a=Math.min(a,o[0]);b=Math.min(b,o[1]);c=Math.max(c,o[0]+o[2]);d=Math.max(d,o[1]+o[3])});return [a,b,c,d]};
  const ring=(x0,y0,x1,y1,skip)=>{let n=0;const sk=()=>skip&&(n++%skip===skip-1);
    for(let x=x0;x+2<=x1;x+=2){if(!sk())W(x,y0-1,0)}for(let x=x0;x+2<=x1;x+=2){if(!sk())W(x,y1,0)}
    for(let y=y0;y+2<=y1;y+=2){if(!sk())W(x0-1,y,1)}for(let y=y0;y+2<=y1;y+=2){if(!sk())W(x1,y,1)}};
  const rest=m=>{for(;wi<walls.length;){const b=walls[wi];RT[b.id]=false;if(!place(b,2,1,m))break;wi++}};
  const putHQ=m=>{if(!hq)return;if(m==='back'){place(hq,hq.w,hq.h,'back');return}const x=Math.round(cx-hq.w/2),y=Math.round(cy-hq.h/2);if(fits(x,y,hq.w,hq.h))put(hq,x,y,hq.w,hq.h);else place(hq,hq.w,hq.h,'euc')};
  if(sty==='ring'){putHQ();big(oth).forEach(b=>place(b,b.w,b.h,'euc'));big(tur).forEach(b=>place(b,b.w,b.h,'euc'));const B=bbox();for(let k=1;k<=3;k++)ring(B[0]-k*2+1,B[1]-k*2+1,B[2]+k*2-1,B[3]+k*2-1);rest('euc')}
  else if(sty==='double'){putHQ();big(oth).forEach(b=>place(b,b.w,b.h,'euc'));big(tur).forEach(b=>place(b,b.w,b.h,'euc'));const B=bbox();for(let k=0;k<4;k++)ring(B[0]-k,B[1]-k,B[2]+k,B[3]+k);rest('euc')}
  else if(sty==='front'){putHQ('back');big(oth).forEach(b=>place(b,b.w,b.h,'back'));big(tur).forEach(b=>place(b,b.w,b.h,'front'));const B=bbox();
    for(let r=0;r<6&&wi<walls.length;r++){const y=B[1]-1-r;for(let x=(r%2?B[0]-1:B[0]-2);x+2<=B[2]+2&&wi<walls.length;x+=2)W(x,y,0)}
    for(let y=B[1];y+2<=B[3]&&wi<walls.length;y+=2){W(B[0]-1,y,1);W(B[2],y,1)}rest('front')}
  else if(sty==='spread'){putHQ();big(tur).concat(big(oth)).sort(()=>Math.random()-.5).sort((a,b)=>(isT(b)?1:0)-(isT(a)?1:0)).forEach(b=>place(b,b.w,b.h,'euc',1));
    const B=bbox();ring(B[0]-1,B[1]-1,B[2]+1,B[3]+1);rest('euc')}
  else if(sty==='maze'){putHQ();big(oth).forEach(b=>place(b,b.w,b.h,'euc'));const B0=bbox();ring(B0[0],B0[1],B0[2],B0[3],3);
    big(tur).forEach(b=>place(b,b.w,b.h,'euc'));const B=bbox();for(let k=1;k<=4;k++)ring(B[0]-k*2+1,B[1]-k*2+1,B[2]+k*2-1,B[3]+k*2-1,k%2?4:3);rest('euc')}
  else{putHQ();big(oth).forEach(b=>place(b,b.w,b.h,'man'));big(tur).forEach(b=>place(b,b.w,b.h,'man'));
    for(let pass=0;pass<3&&wi<walls.length;pass++){const B=bbox();let D=0;occ.forEach(o=>{D=Math.max(D,Math.abs(o[0]+o[2]/2-cx)+Math.abs(o[1]+o[3]/2-cy))});D=Math.ceil(D+1+pass*2);
      for(let t=-D;t<=D&&wi<walls.length;t+=2){const r=D-Math.abs(t);W(Math.round(cx+t-1),Math.round(cy-r-1),0);W(Math.round(cx+t-1),Math.round(cy+r),0)}}rest('man')}
  return {P,RT,L}}
function apply(g){const P0=bPos(),off=bOff(),rot=bRotMap();Object.keys(P0).forEach(k=>delete P0[k]);let n=0,k=0;
  g.L.forEach(b=>{if(g.P[b.id]){P0[b.id]=g.P[b.id];delete off[b.id];n++}else{off[b.id]=true;k++}});
  BLD.forEach(b=>{if(b.t==='wall'&&g.RT[b.id]!==undefined)rot[b.id]=g.RT[b.id]});try{bApplyRot()}catch(e){}return [n,k]}
function build(sty){return apply(gen(sty||'ring'))}
function draw(cv,g){const R=bReg(),q=cv.getContext('2d'),s=Math.min(cv.width/(R.x1-R.x0),cv.height/(R.y1-R.y0));q.fillStyle='#071433';q.fillRect(0,0,cv.width,cv.height);
  const ox=(cv.width-(R.x1-R.x0)*s)/2,oy=(cv.height-(R.y1-R.y0)*s)/2;q.strokeStyle='#1c3f8a';q.strokeRect(ox+.5,oy+.5,(R.x1-R.x0)*s-1,(R.y1-R.y0)*s-1);
  g.L.forEach(b=>{const p=g.P[b.id];if(!p)return;const v=b.t==='wall'?g.RT[b.id]:false,w=b.t==='wall'?(v?1:2):b.w,h=b.t==='wall'?(v?2:1):b.h;
    q.fillStyle=b.t==='hq'?'#ffc53d':b.t==='wall'?'#9aa6bf':(typeof BT!=='undefined'&&BT[b.t])?'#ff6a5a':'#4fa8ff';q.fillRect(ox+(p[0]-R.x0)*s+.5,oy+(p[1]-R.y0)*s+.5,w*s-1,h*s-1)})}
function picker(){const old=document.getElementById('c64p');if(old)old.remove();const m=document.createElement('div');m.id='c64p';
  m.style.cssText='position:fixed;inset:0;z-index:9999;background:#000b;display:flex;align-items:center;justify-content:center;padding:10px;font:14px system-ui,sans-serif;color:#e8f0ff';
  m.innerHTML=`<div style="width:min(860px,96vw);max-height:94vh;overflow:auto;background:linear-gradient(#0b1840,#060f2e);border:1.5px solid #ffc53d;border-radius:14px;padding:14px">
   <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><b style="font-size:18px;color:#ffe08a">TỰ XÂY THEO MẪU · Trụ sở cấp ${bLv('hq')}</b><span style="flex:1"></span><span style="color:#8fd8ff">Đá: ${(S.da||0).toLocaleString()}</span><button data-x style="border:0;border-radius:8px;padding:6px 12px;background:#3a4670;color:#fff">Đóng</button></div>
   <div style="font-size:12px;color:#8fa6d8;margin-bottom:10px">Chọn một mẫu, mỗi lần xây tốn 5.000 Đá. Ô vàng: Trụ sở · đỏ: pháo · xanh: công trình khác · xám: tường. Mẫu tự co giãn theo cấp Trụ sở và số công trình đang có.</div>
   <div data-g style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px"></div></div>`;
  const G0=m.querySelector('[data-g]');
  STY.forEach(t=>{const c=document.createElement('div');c.style.cssText='border:1px solid #2b5ac9;border-radius:10px;padding:8px;background:#0a1a44;display:flex;flex-direction:column;gap:6px';
    c.innerHTML=`<b style="color:#bfe3ff">${t.n}</b><canvas width="230" height="150" style="width:100%;border-radius:6px"></canvas><div style="font-size:12px;color:#9fb4d8;min-height:32px">${t.d}</div><button data-k="${t.k}" style="border:0;border-radius:8px;padding:8px;background:linear-gradient(#ffd766,#f0a500);color:#1a1200;font-weight:800;cursor:pointer">Xây mẫu này · 5.000 Đá</button>`;
    G0.appendChild(c);try{draw(c.querySelector('canvas'),gen(t.k))}catch(e){console.error(e)}});
  m.onclick=e=>{if(e.target===m||e.target.dataset.x!==undefined){m.remove();return}const b=e.target.closest('button[data-k]');if(!b)return;
    if((S.da||0)<COST){toast('Cần 5.000 Đá để tự xây căn cứ theo mẫu');return}
    S.da-=COST;const t=STY.find(x=>x.k===b.dataset.k),r=build(t.k);try{save()}catch(er){}try{bRender()}catch(er){}try{refresh()}catch(er){}m.remove();
    toast('Đã xây mẫu «'+t.n+'» · '+r[0]+' công trình'+(r[1]?' · '+r[1]+' vào kho (hết chỗ)':'')+' · −5.000 Đá')};
  document.body.appendChild(m)}
window.C64={build,gen,STY,picker};
function hook(){const b=document.getElementById('btpl');if(b&&!b.c64){b.c64=1;b.onclick=picker}}
hook();setInterval(hook,1500);
})();
