/* ===== c66: kéo làn khói bằng tay — trong Trụ sở và ngay trong trận ===== */
(function(){
const smk=()=>{const B=S.base=S.base||{};B.smk=B.smk||{};return B.smk};
/* --- trong trận (3D): chạm vào làn khói rồi kéo --- */
let drag=null;
function world(e){const R=window.R3D;if(!R||!R.cam||!window.THREE)return null;const cv=e.target.getBoundingClientRect?e.target:null;if(!cv)return null;const r=cv.getBoundingClientRect();try{R.cam.updateMatrixWorld()}catch(_){}
  const v=new THREE.Vector3((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1,.5);{const PI=new THREE.Matrix4().copy(R.cam.projectionMatrix);(PI.invert?PI.invert():PI.getInverse(R.cam.projectionMatrix));v.applyMatrix4(PI).applyMatrix4(R.cam.matrixWorld)}const o=R.cam.position,d=v.sub(o);if(Math.abs(d.y)<1e-6)return null;const t=-o.y/d.y;if(t<0)return null;return {x:o.x+d.x*t,y:o.z+d.z*t}}
function gens(G){return (G.bl||[]).filter(b=>b.t==='en4'&&b.hp>0)}
function wpt(e){const cv=document.getElementById('dfcv'),R=window.R3D;if(!cv||!R||!R.cam||!window.THREE)return null;const raw=e.c66raw||[e.clientX,e.clientY],r=cv.getBoundingClientRect();
  const rc=new THREE.Raycaster();rc.setFromCamera({x:(raw[0]-r.left)/r.width*2-1,y:-(raw[1]-r.top)/r.height*2+1},R.cam);const p=new THREE.Vector3();if(!rc.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),p))return null;return {x:p.x,y:p.z}}
function hitAt(G,e){const w=wpt(e);if(!w)return null;let best=null,bd=1e9;gens(G).forEach(b=>{const r=c17SmokeRect(b,G);if(!r)return;if(Math.abs(w.x-r.cx)<=r.w/2+1.2&&Math.abs(w.y-r.cy)<=r.h/2+1.2){const q=Math.hypot(w.x-r.cx,w.y-r.cy);if(q<bd){bd=q;best={b,r,w}}}});return best}
window.c66Hit=e=>{try{const G=(typeof DG!=='undefined'&&DG)?DG:null;if(!G||G.done||e.target!==document.getElementById('dfcv'))return false;return !!hitAt(G,e)}catch(_){return false}};
addEventListener('pointerdown',e=>{const G=(typeof DG!=='undefined'&&DG)?DG:null;if(!G||G.done||e.target!==document.getElementById('dfcv'))return;const h=hitAt(G,e);if(!h)return;
  drag={b:h.b,dx:h.r.cx-h.w.x,dy:h.r.cy-h.w.y,id:e.pointerId};e.preventDefault();e.stopImmediatePropagation();try{toast('Đang kéo làn khói')}catch(_){}},true);
addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const G=(typeof DG!=='undefined'&&DG)?DG:null;if(!G){drag=null;return}e.preventDefault();e.stopImmediatePropagation();const w=wpt(e);if(!w)return;
  const ox=(G.wd&&G.wd.ox)||0,oy=(G.wd&&G.wd.oy)||0;smk()[drag.b.id]=[w.x+drag.dx+ox,w.y+drag.dy+oy]},true);
addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;e.stopImmediatePropagation();drag=null;try{save()}catch(_){}},true);
/* --- trong Trụ sở: kéo thẳng khung "Khói" --- */
let bd=null;
function hookBoard(){const brd=document.getElementById('bboard');if(!brd||brd.c66)return;brd.c66=1;
  brd.addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest('.c17smk[data-smk]');if(!el)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const b=BLD.find(x=>x.id===el.dataset.smk);if(!b)return;const r=brd.getBoundingClientRect(),cs=bCell();bd={b,el,cs,r,id:e.pointerId,w:el.offsetWidth/cs,h:el.offsetHeight/cs};try{el.setPointerCapture(e.pointerId)}catch(_){}},true);
  brd.addEventListener('pointermove',e=>{if(!bd||e.pointerId!==bd.id)return;e.preventDefault();e.stopImmediatePropagation();const r=brd.getBoundingClientRect(),gx=(e.clientX-r.left)/bd.cs,gy=(e.clientY-r.top)/bd.cs;
    const c=window.c17SmkClamp?c17SmkClamp(bd.b,gx,gy):[gx,gy];bd.el.style.left='calc(var(--c)*'+(c[0]-bd.w/2)+')';bd.el.style.top='calc(var(--c)*'+(c[1]-bd.h/2)+')';bd.c=c},true);
  const end=e=>{if(!bd||e.pointerId!==bd.id)return;e.stopImmediatePropagation();if(bd.c){smk()[bd.b.id]=bd.c;try{save()}catch(_){}}bd=null;try{bRender()}catch(_){}};
  brd.addEventListener('pointerup',end,true);brd.addEventListener('pointercancel',end,true)}
hookBoard();setInterval(hookBoard,1500);
window.C66={gens,wpt};
})();
