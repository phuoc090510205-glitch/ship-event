/* ===== c33: ĐỒ HỌA 3D CHO TRẬN ĐẤU =====
   Tàu, boss, tàu đồng minh, trụ sở, tường thành, đại bác, tháp laser và mọi công trình được dựng khối 3D từ chính hình gốc của game.
   Nền trận, đạn, tia, thanh máu và hiệu ứng kỹ năng 2D được trải lên mặt chiến trường; kỹ năng Thiên Lôi có hiệu ứng 3D riêng.
   Luật chơi Level / PvP không đổi: lớp 3D chỉ vẽ lại, không đụng vào tính toán trận. Nút 3D/2D trên thanh trận để bật / tắt. */
(function(){
const R3={on:true,fail:false,tilt:.52,models:new Map(),queue:[],inst:new Map(),hide:null,hiding:false,fx:new Map()};
window.R3D=R3;
try{if(localStorage.getItem('se3d')==='0')R3.on=false}catch(e){}
const BLANK=new Image();BLANK.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const _dimg=dimg;
dimg=function(src){const i=_dimg(src);if(i&&R3.hiding&&R3.hide&&R3.hide.has(src))return BLANK.complete?BLANK:null;return i};
let T=null,ren=null,scene,cam,cv3,ground,gTex,shadowP,keyL,camKey='',tex2d=null;
function loadThree(){if(window.THREE||R3.loading||R3.fail)return;R3.loading=1;const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=()=>{R3.loading=0};s.onerror=()=>{R3.loading=0;R3.fail=true;btn()};document.head.appendChild(s)}
function init(){if(ren)return true;if(R3.fail||!window.THREE)return false;T=window.THREE;
  try{cv3=document.createElement('canvas');cv3.id='df3d';cv3.setAttribute('aria-hidden','true');cv3.style.cssText='position:absolute;inset:0;width:100%;height:100%;max-height:none;max-width:none;margin:0;border:0;border-radius:0;box-shadow:none;background:none;display:none;pointer-events:none';dfc.after(cv3);
    ren=new T.WebGLRenderer({canvas:cv3,antialias:true,powerPreference:'high-performance'})}catch(e){R3.fail=true;if(cv3)cv3.remove();btn();return false}
  ren.setPixelRatio(Math.min(2,devicePixelRatio||1));ren.shadowMap.enabled=true;ren.shadowMap.type=T.PCFSoftShadowMap;ren.outputEncoding=T.sRGBEncoding;ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;
  scene=new T.Scene();R3.scene=scene;scene.background=new T.Color(0x02051a);cam=new T.PerspectiveCamera(34,1,.1,800);R3.cam=cam;
  scene.add(new T.HemisphereLight(0xb0ccff,0x161c30,.8));
  keyL=new T.DirectionalLight(0xfff0dc,1.15);keyL.castShadow=true;keyL.shadow.mapSize.set(2048,2048);keyL.shadow.bias=-.0009;scene.add(keyL,keyL.target);
  const rim=new T.DirectionalLight(0x5aa8ff,.55);rim.position.set(-40,25,-60);scene.add(rim);
  /* nền sao ngoài chiến trường */
  {const g=new T.BufferGeometry(),n=1600,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*600;p[i*3+1]=-20-Math.random()*40;p[i*3+2]=(Math.random()-.5)*600}
   g.setAttribute('position',new T.BufferAttribute(p,3));scene.add(new T.Points(g,new T.PointsMaterial({color:0xcfe0ff,size:1.1})))}
  /* mặt chiến trường = khung hình 2D của trận (nền, đạn, tia, hiệu ứng, thanh máu), mép mờ dần */
  gTex=new T.CanvasTexture(dfc);gTex.encoding=T.sRGBEncoding;gTex.minFilter=T.LinearFilter;gTex.generateMipmaps=false;
  const fc=document.createElement('canvas');fc.width=fc.height=64;{const x=fc.getContext('2d'),d=x.createImageData(64,64);for(let y=0;y<64;y++)for(let X=0;X<64;X++){const e=Math.min(X,63-X,y,63-y)/4;const v=Math.round(255*Math.min(1,e));const i=(y*64+X)*4;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0)}
  ground=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:gTex,alphaMap:new T.CanvasTexture(fc),transparent:true,toneMapped:false,depthWrite:true}));ground.rotation.x=-Math.PI/2;ground.renderOrder=-10;scene.add(ground);
  shadowP=new T.Mesh(new T.PlaneGeometry(1,1),new T.ShadowMaterial({opacity:.4}));shadowP.rotation.x=-Math.PI/2;shadowP.position.y=.02;shadowP.receiveShadow=true;shadowP.renderOrder=-9;scene.add(shadowP);
  return true}

/* ---------- dựng khối 3D từ hình gốc (mặt nạ → khoảng cách tới mép → độ cao, vách đứng kín, màu vách lan từ viền) ---------- */
function build(j,im){
  const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,NX=j.kind==='b'?60:64,NY=Math.max(8,Math.round(NX*ih/iw));
  const c=document.createElement('canvas');c.width=NX;c.height=NY;const x=c.getContext('2d');x.drawImage(im,0,0,NX,NY);
  const D=x.getImageData(0,0,NX,NY).data,N=NX*NY,M=new Uint8Array(N),L=new Float32Array(N),CY=new Uint8Array(N);
  for(let i=0;i<N;i++){const r=D[i*4],g=D[i*4+1],b=D[i*4+2];M[i]=D[i*4+3]>60?1:0;L[i]=(r*.3+g*.59+b*.11)/255;CY[i]=(b>170&&g>170&&r<150)?1:0}
  if(j.kind==='s'){const Tm=new Uint8Array(M);for(let y=0;y<NY;y++)for(let X=0;X<NX;X++){if(M[y*NX+X])continue;let n=0;for(let a=-1;a<=1&&!n;a++)for(let b=-1;b<=1;b++){const yy=y+a,xx=X+b;if(yy>=0&&xx>=0&&yy<NY&&xx<NX&&M[yy*NX+xx]){n=1;break}}Tm[y*NX+X]=n}
    for(let y=0;y<NY;y++)for(let X=0;X<NX;X++){if(!Tm[y*NX+X]||M[y*NX+X])continue;let all=1;for(let a=-1;a<=1&&all;a++)for(let b=-1;b<=1;b++){const yy=y+a,xx=X+b;if(yy<0||xx<0||yy>=NY||xx>=NX||!Tm[yy*NX+xx]){all=0;break}}if(all)M[y*NX+X]=1}}
  /* viền ngoài 1 ô luôn cao 0 để tạo vách */
  for(let X=0;X<NX;X++){M[X]=0;M[(NY-1)*NX+X]=0}for(let y=0;y<NY;y++){M[y*NX]=0;M[y*NX+NX-1]=0}
  const d=new Float32Array(N);for(let i=0;i<N;i++)d[i]=M[i]?1e9:0;
  const at=(X,Y)=>X<0||Y<0||X>=NX||Y>=NY?0:d[Y*NX+X];
  for(let y=0;y<NY;y++)for(let X=0;X<NX;X++){const i=y*NX+X;if(d[i])d[i]=Math.min(d[i],at(X-1,y)+1,at(X,y-1)+1,at(X-1,y-1)+1.414,at(X+1,y-1)+1.414)}
  for(let y=NY-1;y>=0;y--)for(let X=NX-1;X>=0;X--){const i=y*NX+X;if(d[i])d[i]=Math.min(d[i],at(X+1,y)+1,at(X,y+1)+1,at(X+1,y+1)+1.414,at(X-1,y+1)+1.414)}
  const h=new Float32Array(N),bev=j.kind==='b'?2:2.5;
  for(let i=0;i<N;i++){if(!M[i])continue;const e=Math.min(1,d[i]/bev),core=Math.min(1,d[i]/(NX*.22));h[i]=(.62+.38*Math.sqrt(e))*.75+core*.4+.1*(L[i]-.45)}
  const hs=new Float32Array(h);for(let y=1;y<NY-1;y++)for(let X=1;X<NX-1;X++){const i=y*NX+X;if(!M[i])continue;let s=0,n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const k=(y+a)*NX+X+b;if(M[k]){s+=h[k];n++}}hs[i]=(hs[i]*2+s)/(n+2)}
  const MD=new Uint8Array(M);for(let y=0;y<NY;y++)for(let X=0;X<NX;X++){const i=y*NX+X;if(M[i])continue;for(let a=-1;a<=1&&!MD[i];a++)for(let b=-1;b<=1;b++){const yy=y+a,xx=X+b;if(yy>=0&&xx>=0&&yy<NY&&xx<NX&&M[yy*NX+xx]){MD[i]=1;break}}}
  const am=document.createElement('canvas');am.width=NX;am.height=NY;{const ax=am.getContext('2d'),ad=ax.createImageData(NX,NY);for(let i=0;i<N;i++){const v=MD[i]?255:0;ad.data[i*4]=ad.data[i*4+1]=ad.data[i*4+2]=v;ad.data[i*4+3]=255}ax.putImageData(ad,0,0)}
  const alphaT=new T.CanvasTexture(am);alphaT.magFilter=alphaT.minFilter=T.NearestFilter;alphaT.generateMipmaps=false;
  /* màu: ảnh thu nhỏ + lan màu viền ra vùng trong suốt cho vách */
  const bw=Math.min(256,iw),bh=Math.max(1,Math.round(bw*ih/iw)),big=document.createElement('canvas');big.width=bw;big.height=bh;const bx=big.getContext('2d');bx.drawImage(im,0,0,bw,bh);
  {const id=bx.getImageData(0,0,bw,bh),A=id.data;for(let pass=0;pass<6;pass++){const B=new Uint8ClampedArray(A);for(let y=0;y<bh;y++)for(let X=0;X<bw;X++){const i=(y*bw+X)*4;if(A[i+3]>200)continue;let r=0,g=0,b=0,n=0;
      if(X+1<bw&&A[i+7]>200){r+=A[i+4];g+=A[i+5];b+=A[i+6];n++}if(X>0&&A[i-1]>200){r+=A[i-4];g+=A[i-3];b+=A[i-2];n++}if(y+1<bh&&A[i+bw*4+3]>200){const k=i+bw*4;r+=A[k];g+=A[k+1];b+=A[k+2];n++}if(y>0&&A[i-bw*4+3]>200){const k=i-bw*4;r+=A[k];g+=A[k+1];b+=A[k+2];n++}
      if(n){B[i]=r/n*.5+12;B[i+1]=g/n*.5+12;B[i+2]=b/n*.5+14;B[i+3]=255}}A.set(B)}for(let i=3;i<A.length;i+=4)A[i]=255;bx.putImageData(id,0,0)}
  const tex=new T.CanvasTexture(big);tex.encoding=T.sRGBEncoding;tex.anisotropy=4;
  const gc=document.createElement('canvas');gc.width=NX;gc.height=NY;{const gx=gc.getContext('2d'),gi=gx.createImageData(NX,NY);for(let i=0;i<N;i++){const k=CY[i];gi.data[i*4]=D[i*4]*k;gi.data[i*4+1]=D[i*4+1]*k;gi.data[i*4+2]=D[i*4+2]*k;gi.data[i*4+3]=255}gx.putImageData(gi,0,0)}
  const glow=new T.CanvasTexture(gc);glow.encoding=T.sRGBEncoding;
  const geo=new T.PlaneGeometry(1,1,NX-1,NY-1),P=geo.attributes.position;for(let i=0;i<P.count;i++)P.setZ(i,hs[i]||0);geo.computeVertexNormals();geo.rotateX(-Math.PI/2);
  const m=j.m;m.geo=geo;m.mat=new T.MeshStandardMaterial({map:tex,alphaMap:alphaT,alphaTest:.5,metalness:j.kind==='b'?.35:.5,roughness:.45,emissive:0xffffff,emissiveMap:glow,emissiveIntensity:1.3,side:T.DoubleSide});
  m.depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,alphaMap:alphaT,alphaTest:.5});m.ready=true}
function model(src,kind){if(!src)return null;let m=R3.models.get(src);if(m)return m.ready?m:null;m={ready:false};R3.models.set(src,m);R3.queue.push({src,kind,m});return null}
function pump(){const t0=performance.now();let spin=R3.queue.length;while(R3.queue.length&&performance.now()-t0<9&&spin-->0){const j=R3.queue.shift();const im=_dimg(j.src);if(!im){R3.queue.push(j);continue}try{build(j,im)}catch(e){console.error(e);j.m.bad=true}}}

/* ---------- gom đối tượng trận cần dựng 3D ---------- */
function bSrc(t,v){return t==='hq'?HQIMG:(t==='wall'&&v?BSPR.wallv:(BSPR[t]||SPR[t]))}
function collect(G){const L=[];
  const ships=G.en.filter(e=>e.spawn<=G.t&&!e.dead).concat(G.pl.dead?[]:[G.pl]).concat((G.al||[]).filter(a=>!a.dead));
  ships.forEach(e=>{if(!e.sh||!e.sh.img)return;L.push({o:e,k:'s',src:e.sh.img,m:model(e.sh.img,'s')})});
  G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine')return;const src=bSrc(b.t,b.v);if(src)L.push({o:b,k:'b',src,m:model(src,'b')})});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead||!u.bd||u.bd.t==='mine')return;const src=bSrc(u.bd.t,u.bd.v);if(src)L.push({o:u,k:'u',src,m:model(src,'b')})});
  return L}
/* ---------- camera nghiêng, luôn thấy trọn khung trận ---------- */
const V3=()=>new T.Vector3();
function fitCam(){const w=dfV.w,h=dfV.h,key=[w,h,dfV.s,dfV.cx,dfV.cy,dfV.ty,R3.tilt].join(',');if(key===camKey)return;camKey=key;
  const x0=dwx(0),x1=dwx(w),y0=dwy(0),y1=dwy(h),cx0=(x0+x1)/2,Ww=x1-x0,Hw=y1-y0,Gd=DG.wd,fx0=Math.max(x0,-.5),fx1=Math.min(x1,Gd.Wd+.5),fy0=Math.max(y0,-.5),fy1=Math.min(y1,Gd.Hd+.5),cx=(fx0+fx1)/2;
  cam.aspect=w/h;cam.fov=w<h?50:34;cam.updateProjectionMatrix();
  const pit=R3.tilt,v=V3(),C=[[fx0,fy0],[fx1,fy0],[fx0,fy1],[fx1,fy1]];let tz=(fy0+fy1)/2,D=Ww;
  const place=(Dd,z)=>{cam.position.set(cx,Math.cos(pit)*Dd,z+Math.sin(pit)*Dd);cam.lookAt(cx,0,z);cam.updateMatrixWorld()};
  const ext=()=>{let mx=0,a=9,b=-9;C.forEach(([X,Z])=>{v.set(X,0,Z).project(cam);mx=Math.max(mx,Math.abs(v.x));a=Math.min(a,v.y);b=Math.max(b,v.y)});return[mx,a,b]};
  for(let it=0;it<4;it++){let lo=.5,hi=Math.max(Ww,Hw)*8;for(let k=0;k<26;k++){const m=(lo+hi)/2;place(m,tz);const e=ext();if(e[0]<=1&&e[1]>=-1&&e[2]<=1)hi=m;else lo=m}D=hi;place(D,tz);const e=ext();tz-=(e[1]+e[2])/2*(fy1-fy0)*.5}
  ground.position.set(cx0,0,(y0+y1)/2);ground.scale.set(Ww,Hw,1);
  const G=DG,Wd=G.wd.Wd,Hd=G.wd.Hd,R=Math.max(Wd,Hd,Ww,Hw);shadowP.position.set(cx,.02,(y0+y1)/2);shadowP.scale.set(Ww*1.4,Hw*1.4,1);
  keyL.target.position.set(cx,0,(y0+y1)/2);keyL.position.set(cx-R*.35,R*1.1,(y0+y1)/2+R*.45);
  Object.assign(keyL.shadow.camera,{left:-R*.8,right:R*.8,top:R*.8,bottom:-R*.8,near:1,far:R*3});keyL.shadow.camera.updateProjectionMatrix()}
/* chạm / kéo trên màn hình 3D → đổi về đúng ô trên chiến trường */
const ray=()=>new T.Raycaster(),gp=()=>new T.Plane(new T.Vector3(0,1,0),0);
function remap(e){if(!R3.live||e.target!==dfc||!cam)return;const r=dfc.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1);
  const rc=ray();rc.setFromCamera({x:nx,y:ny},cam);const p=V3();if(!rc.ray.intersectPlane(gp(),p))return;
  const cx=r.left+dsx(p.x)*r.width/dfV.w,cy=r.top+dsy(p.z)*r.height/dfV.h;try{Object.defineProperty(e,'clientX',{value:cx});Object.defineProperty(e,'clientY',{value:cy})}catch(er){}}
['pointerdown','pointermove','pointerup','click','mousedown','mousemove','mouseup','dblclick','contextmenu'].forEach(t=>addEventListener(t,remap,true));

/* ---------- vẽ 3D ---------- */
let t3=0,lastT=performance.now();
function render(G,L){const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;t3+=dt;
  const w=dfc.clientWidth||dfV.w,h=dfc.clientHeight||dfV.h;if(cv3.width!==Math.round(w*ren.getPixelRatio())||cv3.height!==Math.round(h*ren.getPixelRatio()))ren.setSize(w,h,false);
  fitCam();gTex.needsUpdate=true;
  const used=new Set();
  L.forEach(it=>{if(!it.m)return;const o=it.o;let g=R3.inst.get(o);
    if(!g||g.userData.src!==it.src){if(g){scene.remove(g);g.material.dispose()}g=new T.Mesh(it.m.geo,it.m.mat.clone());g.customDepthMaterial=it.m.depth;g.castShadow=true;g.receiveShadow=true;g.userData={src:it.src,ph:Math.random()*6};scene.add(g);R3.inst.set(o,g)}
    used.add(o);const M=g.material;
    if(it.k==='s'){const ww=o.sh.W*o.sc,hh=o.sh.H*o.sc,lf=o.lift||0,sc=1+lf*.25;g.scale.set(ww*sc,.16*Math.sqrt(ww*hh)*sc,hh*sc);
      g.position.set(o.x,.3+lf*1.3+Math.sin(t3*1.6+g.userData.ph)*.04,o.y);g.rotation.set(0,-(o.ang+Math.PI/2),0);
      let op=1;if(o.ghost)op=o.gfa!=null?Math.min(o.gfa,o.gt*2,(o.glife-o.gt)*3+.2):Math.min(.65,o.gt*2,(o.glife-o.gt)*3+.2);else if(o.stl>0)op=o.stlA||.4;else if(o.fd>0)op=.6;
      M.transparent=op<.99;M.opacity=Math.max(.05,op);M.color.setScalar(o.hit>0?2.3:1);if(o.ghost)M.color.setRGB(.7,1.2,1.6);
      M.emissiveIntensity=(o.stun>0||o.stT>0)?1.3+Math.sin(t3*30)*.5:1.3}
    else{const b=it.k==='u'?o:o,ww=b.w,hh=b.h;const hq=(it.k==='b'&&b.t==='hq');g.scale.set(ww,(hq?.16:.13)*Math.sqrt(ww*hh),hh);g.position.set(b.x,0,b.y);
      const H=b.u||b,tr=(it.k==='u'?b.bd.t:b.t);let ry=0;if(tr!=='hq'&&tr!=='wall'&&H.da!=null&&Math.abs(ww-hh)<.01)ry=-(H.da+Math.PI/2);g.rotation.set(0,ry,0);
      const fl=it.k==='u'?(b.hit>0):(b.flash>0);M.color.setScalar(fl?2.1:1)}});
  R3.inst.forEach((g,o)=>{if(!used.has(o)){scene.remove(g);g.material.dispose();R3.inst.delete(o)}});
  tlb(G,dt);
  ren.render(scene,cam)}

/* ---------- Thiên Lôi 3D: mây giông, khóa mục tiêu 0,3 giây, tia sét 3 lớp + 4 nhánh, lóe sáng ---------- */
const ADD=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
let GLOWT=null;function glowT(){if(GLOWT)return GLOWT;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(200,235,255,.75)');g.addColorStop(1,'rgba(80,160,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return GLOWT=new T.CanvasTexture(c)}
const sprite=(c,o)=>{const s=new T.Sprite(new T.SpriteMaterial({map:glowT(),color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));return s};
function zig(a,b,n,amp){const P=[],d=new T.Vector3().subVectors(b,a),Ln=d.length(),u=d.clone().normalize(),p1=Math.abs(u.x)>.9?new T.Vector3(0,0,1):new T.Vector3(1,0,0),s1=new T.Vector3().crossVectors(u,p1).normalize(),s2=new T.Vector3().crossVectors(u,s1);
  for(let i=0;i<=n;i++){const t=i/n,p=a.clone().addScaledVector(d,t);if(i&&i<n){const k=amp*Math.pow(Math.sin(Math.PI*t),.6)*Ln/10;p.addScaledVector(s1,(Math.random()-.5)*2*k).addScaledVector(s2,(Math.random()-.5)*2*k)}P.push(p)}return P}
function tube(P,r){const path=new T.CurvePath();for(let i=0;i<P.length-1;i++)path.add(new T.LineCurve3(P[i],P[i+1]));return new T.TubeGeometry(path,P.length*2,r,5,false)}
function mkBolt(rs,cols){const grp=new T.Group(),ms=rs.map((r,i)=>{const m=new T.Mesh(new T.BufferGeometry(),ADD(cols[i][0],cols[i][1]));m.userData={r,o:cols[i][1]};m.frustumCulled=false;grp.add(m);return m});scene.add(grp);
  return{grp,set(P){ms.forEach(m=>{m.geometry.dispose();m.geometry=tube(P,m.userData.r)})},a(f){ms.forEach(m=>m.material.opacity=m.userData.o*f);grp.visible=f>.01},kill(){ms.forEach(m=>{m.geometry.dispose();m.material.dispose()});scene.remove(grp)}}}
function tlb(G,dt){const C5=G.csk,X=C5&&C5.vf&&C5.vf.x2,list=X&&X.c5?X.c5.filter(o=>o.k==='tlb'&&!(o.dl>0)):[],seen=new Set();
  list.forEach(o=>{seen.add(o);let F=R3.fx.get(o);const SKY=15;
    if(!F){F={grp:new T.Group(),rg:0};scene.add(F.grp);
      F.cloud=[];for(let i=0;i<22;i++){const dark=Math.random()<.7,s=new T.Sprite(new T.SpriteMaterial({map:glowT(),color:dark?0x24325c:0x7fa4ff,transparent:true,opacity:0,depthWrite:false,blending:dark?T.NormalBlending:T.AdditiveBlending,toneMapped:false}));const a=Math.random()*6.28,r=Math.random()*3.4,sz=2.4+Math.random()*2.6;s.scale.set(sz,sz*.6,1);s.position.set(Math.cos(a)*r,(Math.random()-.5)*.6,Math.sin(a)*r);s.userData={a,r,o:dark?.7:.4,sp:.2+Math.random()*.3,y0:(Math.random()-.5)*.6};F.grp.add(s);F.cloud.push(s)}
      F.ring=new T.Mesh(new T.RingGeometry(.92,1,48),ADD(0x9fe0ff,0));F.ring.rotation.x=-Math.PI/2;F.grp.add(F.ring);
      F.guide=new T.Mesh(new T.CylinderGeometry(.04,.04,1,6,1,true),ADD(0x9fe0ff,0));F.grp.add(F.guide);
      F.fall=sprite(0x6ad0ff,0);F.grp.add(F.fall);F.flash=sprite(0xffffff,0);F.grp.add(F.flash);F.halo=sprite(0x9fe0ff,0);F.grp.add(F.halo);
      F.wave=new T.Mesh(new T.RingGeometry(.88,1,64),ADD(0xd8f4ff,0));F.wave.rotation.x=-Math.PI/2;F.grp.add(F.wave);
      F.light=new T.PointLight(0xbfe8ff,0,14,2);F.grp.add(F.light);R3.fx.set(o,F)}
    const a=o.age||0;F.grp.position.set(o.x,0,o.y);
    const cA=Math.min(1,a/.15+.3)*(a>.7?Math.max(0,1-(a-.7)/.3):1);F.cloud.forEach(s=>{const u=s.userData;u.a+=dt*u.sp;s.position.x=Math.cos(u.a)*u.r;s.position.z=Math.sin(u.a)*u.r;s.position.y=SKY+u.y0;s.material.opacity=u.o*cA});
    if(a<.3){const u=a/.3;F.ring.material.opacity=.3+.6*u;F.ring.scale.setScalar(2.4-1.4*u);F.ring.position.y=.05;F.ring.rotation.z+=dt*3;
      F.guide.material.opacity=.35*u;F.guide.scale.set(1,SKY,1);F.guide.position.y=SKY/2;F.fall.material.opacity=.6*u;F.fall.position.y=SKY*(1-.6*u);F.fall.scale.setScalar(1.2+2*u)}
    else{F.ring.material.opacity=0;F.guide.material.opacity=0;F.fall.material.opacity=0;const f=Math.max(0,1-(a-.3)/.7);
      if(!F.bolt){F.bolt=mkBolt([.28,.12,.04],[[0x2a78ff,.35],[0x7fd0ff,.7],[0xffffff,1]]);F.br=[0,1,2,3].map(()=>mkBolt([.08,.03],[[0x6ab7ff,.5],[0xbfe8ff,.9]]))}
      F.rg-=dt;if(F.rg<=0){F.rg=.045;const top=new T.Vector3(o.x,SKY,o.y),bot=new T.Vector3(o.x,.35,o.y),P=zig(top,bot,22,1.2);F.bolt.set(P);
        F.br.forEach((b,i)=>{const p0=P[3+i*2],an=Math.random()*6.28,q1=p0.clone().add(new T.Vector3(Math.cos(an)*1.8,-1.8,Math.sin(an)*1.8)),q2=q1.clone().add(new T.Vector3(Math.cos(an)*1,-1.9,Math.sin(an)*1));b.set([p0].concat(zig(p0,q1,4,2).slice(1),zig(q1,q2,4,2).slice(1)))})}
      const fl=f*(.75+.25*Math.random());F.bolt.a(fl);F.br.forEach(b=>b.a(fl*.8));
      F.light.position.y=1.5;F.light.intensity=6*f*f;F.flash.position.y=.7;F.flash.scale.setScalar(4.5*(1-f*.2));F.flash.material.opacity=.95*f;F.halo.position.y=.7;F.halo.scale.setScalar(12*(1.1-f*.3));F.halo.material.opacity=.6*f;
      const k=(a-.3)/.7;F.wave.position.y=.06;F.wave.scale.setScalar(.4+5*Math.min(1,k*1.4));F.wave.material.opacity=Math.max(0,.9*(1-k*1.2))}});
  R3.fx.forEach((F,o)=>{if(seen.has(o))return;if(F.bolt){F.bolt.kill();F.br.forEach(b=>b.kill())}F.grp.traverse(m=>{if(m.material)m.material.dispose();if(m.geometry)m.geometry.dispose()});scene.remove(F.grp);R3.fx.delete(o)})}
R3.tlbOn=()=>!!R3.live;

/* ---------- nối vào vòng vẽ trận ---------- */
function btn(){const b=document.getElementById('df3b');if(!b)return;b.textContent=R3.fail?'2D':(R3.on?'3D':'2D');b.setAttribute('aria-pressed',String(R3.on&&!R3.fail));b.title=R3.fail?'Máy không hỗ trợ đồ họa 3D':(R3.on?'Đang xem 3D · chạm để về 2D':'Đang xem 2D · chạm để xem 3D')}
{const z=document.getElementById('dfzo');if(z){const b=document.createElement('button');b.className='dfb';b.id='df3b';b.style.cssText='font-weight:900;font-size:12px';z.parentNode.insertBefore(b,z);
  b.onclick=()=>{if(R3.fail){toast('Máy không hỗ trợ đồ họa 3D, đang dùng 2D');return}R3.on=!R3.on;try{localStorage.setItem('se3d',R3.on?'1':'0')}catch(e){}btn();camKey=''};btn()}}
function off(){R3.live=false;if(cv3)cv3.style.display='none'}
setTimeout(()=>{
  const _D=dfDraw;dfDraw=function(){const G=DG;
    if(!G||!R3.on||R3.fail){off();return _D.apply(this,arguments)}
    if(!window.THREE){loadThree();off();return _D.apply(this,arguments)}
    if(!init()){off();return _D.apply(this,arguments)}
    let L=[];try{pump();L=collect(G)}catch(e){console.error(e)}
    R3.hide=new Set(L.filter(i=>i.m).map(i=>i.src));R3.hiding=true;R3.live=true;
    try{_D.apply(this,arguments)}finally{R3.hiding=false}
    try{cv3.style.display='block';render(G,L)}catch(e){console.error(e);R3.fail=true;off();btn()}};
  const _E=dfExit;dfExit=function(){off();R3.inst.forEach(g=>{scene&&scene.remove(g);g.material.dispose()});R3.inst.clear();return _E.apply(this,arguments)};
  if(R3.on)loadThree();
},0);
})();
