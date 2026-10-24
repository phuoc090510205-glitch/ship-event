/* ===== c33: TRẬN ĐẤU 3D THẬT =====
   Toàn bộ chiến trường dựng trong không gian 3D: sàn lưới phát sáng trên nền tinh vân sâu, tàu / boss thân khối có bụng tàu và lửa động cơ,
   trụ sở + công trình đứng khối trên sàn, đạn - tia - vụ nổ bay ở độ cao thân tàu, thanh máu lơ lửng trên đầu. Hiệu ứng kỹ năng chưa có
   bản 3D riêng hiển thị ở tầng hiệu ứng ngang thân tàu; Thiên Lôi có bản 3D riêng. Luật chơi không đổi; nút 3D/2D để bật / tắt. */
(function(){
const R3={on:true,fail:false,tilt:.86,models:new Map(),queue:[],inst:new Map(),hide:null,hiding:false,fx:new Map(),gid:null};
window.R3D=R3;
try{if(localStorage.getItem('se3d')==='0')R3.on=false}catch(e){}
const BLANK=new Image();BLANK.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const _dimg=dimg;
dimg=function(src){const i=_dimg(src);if(i&&R3.hiding&&R3.hide&&R3.hide.has(src))return BLANK.complete?BLANK:null;return i};
let T=null,ren=null,scene,cam,cv3,fxP,gTex,shadowP,keyL,floor,neb,border,baseZ,marker,camKey='',WHITE,FLG,FLM1,FLM2;
const HOV=.55,FXY=.42;
function loadThree(){if(window.THREE||R3.loading||R3.fail)return;R3.loading=1;const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=()=>{R3.loading=0};s.onerror=()=>{R3.loading=0;R3.fail=true;btn()};document.head.appendChild(s)}
const COLS=new Map();function col(c){let v=COLS.get(c);if(!v){v=new T.Color();try{v.setStyle(String(c||'#ffffff').slice(0,7))}catch(e){v.set(0xffffff)}COLS.set(c,v)}return v}
function cvTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new T.CanvasTexture(c)}
function init(){if(ren)return true;if(R3.fail||!window.THREE)return false;T=window.THREE;
  try{cv3=document.createElement('canvas');cv3.id='df3d';cv3.setAttribute('aria-hidden','true');cv3.style.cssText='position:absolute;inset:0;width:100%;height:100%;max-height:none;max-width:none;margin:0;border:0;border-radius:0;box-shadow:none;background:none;display:none;pointer-events:none';dfc.after(cv3);
    ren=new T.WebGLRenderer({canvas:cv3,antialias:true,powerPreference:'high-performance'})}catch(e){R3.fail=true;if(cv3)cv3.remove();btn();return false}
  ren.setPixelRatio(Math.min(2,devicePixelRatio||1));ren.shadowMap.enabled=true;ren.shadowMap.type=T.PCFSoftShadowMap;ren.outputEncoding=T.sRGBEncoding;ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.1;
  scene=new T.Scene();R3.scene=scene;scene.background=new T.Color(0x01030c);cam=new T.PerspectiveCamera(40,1,.1,1200);R3.cam=cam;
  scene.add(new T.HemisphereLight(0xc8dcff,0x232a48,1.0));
  keyL=new T.DirectionalLight(0xfff0dc,1.35);keyL.castShadow=true;keyL.shadow.mapSize.set(2048,2048);keyL.shadow.bias=-.0007;keyL.shadow.normalBias=.02;scene.add(keyL,keyL.target);
  const rim=new T.DirectionalLight(0x5aa8ff,.75);rim.position.set(-60,30,-90);scene.add(rim);
  const fill=new T.DirectionalLight(0xffc27a,.25);fill.position.set(60,15,40);scene.add(fill);
  WHITE=cvTex(4,4,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,4,4)});
  /* nền tinh vân sâu bên dưới sàn + sao */
  neb=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0x8a9cc8,toneMapped:false,fog:false}));neb.rotation.x=-Math.PI/2;neb.position.y=-70;neb.visible=false;scene.add(neb);
  {const g=new T.BufferGeometry(),n=2400,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*700;p[i*3+1]=-8-Math.random()*60;p[i*3+2]=(Math.random()-.5)*700}
   g.setAttribute('position',new T.BufferAttribute(p,3));scene.add(new T.Points(g,new T.PointsMaterial({color:0xd6e4ff,size:1.3,sizeAttenuation:true,fog:false})))}
  /* sàn chiến trường: kim loại tối, lưới ô phát sáng, hơi trong để thấy chiều sâu tinh vân bên dưới */
  const grid=cvTex(256,256,(x)=>{x.fillStyle='#000';x.fillRect(0,0,256,256);x.strokeStyle='rgba(90,170,255,.35)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*64,0);x.lineTo(i*64,256);x.moveTo(0,i*64);x.lineTo(256,i*64);x.stroke()}x.strokeStyle='rgba(130,210,255,.95)';x.lineWidth=4;x.strokeRect(0,0,256,256);
    x.fillStyle='rgba(160,225,255,.9)';[[0,0],[256,0],[0,256],[256,256]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,6,0,7);x.fill()})});
  grid.wrapS=grid.wrapT=T.RepeatWrapping;grid.anisotropy=8;grid.encoding=T.sRGBEncoding;
  floor=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshLambertMaterial({color:new T.Color(0x0a1532).convertSRGBToLinear(),emissive:new T.Color(0x3a7cff).convertSRGBToLinear(),emissiveMap:grid,emissiveIntensity:1.1,transparent:true,opacity:.93}));
  floor.rotation.x=-Math.PI/2;floor.renderOrder=-10;scene.add(floor);
  shadowP=new T.Mesh(new T.PlaneGeometry(1,1),new T.ShadowMaterial({opacity:.5}));shadowP.rotation.x=-Math.PI/2;shadowP.position.y=.01;shadowP.receiveShadow=true;shadowP.renderOrder=-9;scene.add(shadowP);
  border=new T.Group();scene.add(border);baseZ=new T.Group();scene.add(baseZ);
  /* tầng hiệu ứng kỹ năng (vẽ 2D trong suốt) đặt ngang thân tàu */
  gTex=new T.CanvasTexture(dfc);gTex.encoding=T.sRGBEncoding;gTex.minFilter=T.LinearFilter;gTex.generateMipmaps=false;
  fxP=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:gTex,transparent:true,depthWrite:false,toneMapped:false}));fxP.rotation.x=-Math.PI/2;fxP.position.y=FXY;fxP.renderOrder=6;scene.add(fxP);
  marker=new T.Mesh(new T.RingGeometry(.42,.5,40),new T.MeshBasicMaterial({color:0x4fd8ff,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide,toneMapped:false}));marker.rotation.x=-Math.PI/2;marker.position.y=.04;scene.add(marker);
  FLG=new T.ConeGeometry(1,1,16,1,true);FLG.translate(0,.5,0);FLG.rotateX(Math.PI/2);
  FLM1=new T.MeshBasicMaterial({color:0x38c8ff,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  FLM2=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  return true}
/* dựng sàn, viền, vùng căn cứ theo kích thước chiến trường */
function setWorld(G){R3.gid=G;const Wd=G.wd.Wd,Hd=G.wd.Hd,cx=Wd/2,cz=Hd/2,FW=Math.max(Wd,Hd)*4;
  floor.position.set(cx,0,cz);floor.scale.set(FW,FW,1);floor.material.emissiveMap.repeat.set(FW/4,FW/4);floor.material.emissiveMap.offset.set(-(cx-FW/2)/4%1,(cz-FW/2)/4%1);
  shadowP.position.set(cx,.01,cz);shadowP.scale.set(FW,FW,1);
  const nbi=_dimg(DFBG);if(nbi&&!neb.material.map){const t=new T.Texture(nbi);t.needsUpdate=true;t.encoding=T.sRGBEncoding;neb.material.map=t;neb.material.needsUpdate=true}
  neb.visible=!!neb.material.map;neb.position.set(cx,-70,cz);neb.scale.set(FW*3,FW*3*.62,1);
  const clr=g=>{while(g.children.length){const m=g.children.pop();m.geometry&&m.geometry.dispose();m.material&&m.material.dispose()}};clr(border);clr(baseZ);
  const rectLine=(g,x0,z0,x1,z1,c,o,y)=>{const pts=[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]].map(([x,z])=>new T.Vector3(x,y,z));g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:c,transparent:true,opacity:o,toneMapped:false})))};
  /* viền chiến trường: dải sáng + cột đèn ở 4 góc */
  rectLine(border,0,0,Wd,Hd,0x4fd8ff,.9,.03);
  [[0,0],[Wd,0],[0,Hd],[Wd,Hd]].forEach(([x,z])=>{const p=new T.Mesh(new T.CylinderGeometry(.12,.18,1.4,10),new T.MeshStandardMaterial({color:0x1a2e5c,metalness:.8,roughness:.3,emissive:0x4fd8ff,emissiveIntensity:.6}));p.position.set(x,.7,z);p.castShadow=true;border.add(p);
    const c=new T.Mesh(new T.SphereGeometry(.16,12,8),new T.MeshBasicMaterial({color:0xbff0ff,toneMapped:false}));c.position.set(x,1.45,z);border.add(c)});
  /* vùng căn cứ: bệ sáng hơi nổi */
  const R=G.wd.R;if(R){const x0=DFM,z0=DFM,x1=DFM+(R.x1-R.x0),z1=DFM+(R.y1-R.y0);
    const pl=new T.Mesh(new T.PlaneGeometry(x1-x0,z1-z0),new T.MeshBasicMaterial({color:0x1d5cff,transparent:true,opacity:.14,depthWrite:false,toneMapped:false}));pl.rotation.x=-Math.PI/2;pl.position.set((x0+x1)/2,.02,(z0+z1)/2);baseZ.add(pl);
    rectLine(baseZ,x0,z0,x1,z1,0x7fe0ff,.85,.04)}
  camKey=''}
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
      if(n){B[i]=r/n*.72+16;B[i+1]=g/n*.72+18;B[i+2]=b/n*.72+24;B[i+3]=255}}A.set(B)}for(let i=3;i<A.length;i+=4)A[i]=255;bx.putImageData(id,0,0)}
  const tex=new T.CanvasTexture(big);tex.encoding=T.sRGBEncoding;tex.anisotropy=4;
  const gc=document.createElement('canvas');gc.width=NX;gc.height=NY;{const gx=gc.getContext('2d'),gi=gx.createImageData(NX,NY);for(let i=0;i<N;i++){const k=CY[i];gi.data[i*4]=D[i*4]*k;gi.data[i*4+1]=D[i*4+1]*k;gi.data[i*4+2]=D[i*4+2]*k;gi.data[i*4+3]=255}gx.putImageData(gi,0,0)}
  const glow=new T.CanvasTexture(gc);glow.encoding=T.sRGBEncoding;
  const geo=new T.PlaneGeometry(1,1,NX-1,NY-1),P=geo.attributes.position;for(let i=0;i<P.count;i++)P.setZ(i,hs[i]||0);geo.computeVertexNormals();geo.rotateX(-Math.PI/2);
  /* đầu phun động cơ (vùng xanh sáng ở phía đuôi) → chỗ phát lửa đẩy */
  const noz=[];if(j.kind==='s'){const Q=new Uint8Array(N);for(let y=Math.floor(NY*.55);y<NY;y++)for(let X=0;X<NX;X++){const i=y*NX+X,r=D[i*4],g=D[i*4+1],bb=D[i*4+2];if(D[i*4+3]>80&&bb>200&&g>165&&(r+g+bb)/765>.62)Q[i]=1}
    const seen=new Uint8Array(N);for(let i=0;i<N;i++){if(!Q[i]||seen[i])continue;const st=[i];seen[i]=1;let n=0,sx=0,sy=0,my=0;while(st.length){const k=st.pop();n++;const X=k%NX,y=(k/NX)|0;sx+=X;sy+=y;my=Math.max(my,y);[k+1,k-1,k+NX,k-NX].forEach(q=>{if(q>=0&&q<N&&Q[q]&&!seen[q]&&Math.abs((q%NX)-X)<=1){seen[q]=1;st.push(q)}})}
      if(n>=2)noz.push({u:(sx/n+.5)/NX,v:(my+.8)/NY,r:Math.max(.025,Math.min(.09,Math.sqrt(n/Math.PI)/NX*1.1)),n})}
    noz.sort((p,q)=>q.n-p.n);noz.length=Math.min(noz.length,4)}
  const m=j.m;m.geo=geo;m.noz=noz;m.matB=new T.MeshStandardMaterial({map:tex,alphaMap:alphaT,alphaTest:.5,color:0x6a7488,metalness:.3,roughness:.6,side:T.DoubleSide});m.mat=new T.MeshStandardMaterial({map:tex,alphaMap:alphaT,alphaTest:.5,metalness:.22,roughness:.5,emissive:0xffffff,emissiveMap:glow,emissiveIntensity:1.3,side:T.DoubleSide});
  m.depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,alphaMap:alphaT,alphaTest:.5});m.ready=true}
function model(src,kind){if(!src)return null;let m=R3.models.get(src);if(m)return m.ready?m:null;m={ready:false};R3.models.set(src,m);R3.queue.push({src,kind,m});return null}
function pump(){const t0=performance.now();let spin=R3.queue.length;while(R3.queue.length&&performance.now()-t0<10&&spin-->0){const j=R3.queue.shift();const im=_dimg(j.src);if(!im){R3.queue.push(j);continue}try{build(j,im)}catch(e){console.error(e);j.m.bad=true}}}
function bSrc(t,v){return t==='hq'?HQIMG:(t==='wall'&&v?BSPR.wallv:(BSPR[t]||SPR[t]))}
function collect(G){const L=[];
  const ships=G.en.filter(e=>e.spawn<=G.t&&!e.dead).concat(G.pl.dead?[]:[G.pl]).concat((G.al||[]).filter(a=>!a.dead));
  ships.forEach(e=>{if(!e.sh||!e.sh.img)return;L.push({o:e,k:'s',src:e.sh.img,m:model(e.sh.img,'s')})});
  G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine')return;const src=bSrc(b.t,b.v);if(src)L.push({o:b,k:'b',src,m:model(src,'b')})});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead||!u.bd||u.bd.t==='mine')return;const src=bSrc(u.bd.t,u.bd.v);if(src)L.push({o:u,k:'u',src,m:model(src,'b')})});
  return L}
/* ---------- camera nghiêng thấp, luôn thấy trọn phần chiến trường đang xem ---------- */
function fitCam(){const w=dfV.w,h=dfV.h,key=[w,h,dfV.s,dfV.cx,dfV.cy,dfV.ty,R3.tilt].join(',');if(key===camKey)return;camKey=key;
  const x0=dwx(0),x1=dwx(w),y0=dwy(0),y1=dwy(h),Gd=DG.wd,fx0=Math.max(x0,-.6),fx1=Math.min(x1,Gd.Wd+.6),fy0=Math.max(y0,-.6),fy1=Math.min(y1,Gd.Hd+.6),cx=(fx0+fx1)/2;
  cam.aspect=w/h;cam.fov=w<h?56:40;cam.updateProjectionMatrix();
  const pit=R3.tilt,v=new T.Vector3(),C=[[fx0,fy0,0],[fx1,fy0,0],[fx0,fy1,0],[fx1,fy1,0],[fx0,fy0,1.5],[fx1,fy0,1.5]];let tz=(fy0+fy1)/2,D=fx1-fx0;
  const place=(Dd,z)=>{cam.position.set(cx,Math.cos(pit)*Dd,z+Math.sin(pit)*Dd);cam.lookAt(cx,0,z);cam.updateMatrixWorld()};
  const ext=()=>{let mx=0,a=9,b=-9;C.forEach(([X,Z,Y])=>{v.set(X,Y,Z).project(cam);mx=Math.max(mx,Math.abs(v.x));a=Math.min(a,v.y);b=Math.max(b,v.y)});return[mx,a,b]};
  const top=Math.min(.86,1-46/h*2);
  for(let it=0;it<5;it++){let lo=.5,hi=(fx1-fx0+fy1-fy0)*8;for(let k=0;k<26;k++){const m=(lo+hi)/2;place(m,tz);const e=ext();if(e[0]<=.98&&e[1]>=-.97&&e[2]<=top)hi=m;else lo=m}D=hi;place(D,tz);const e=ext();tz-=((e[1]+e[2])/2-(top-.97)/2)*(fy1-fy0)*.45}
  fxP.position.set((x0+x1)/2,FXY,(y0+y1)/2);fxP.scale.set(x1-x0,y1-y0,1);
  const R=Math.max(Gd.Wd,Gd.Hd)*.75+4,mx=(fx0+fx1)/2,mz=(fy0+fy1)/2;
  keyL.target.position.set(mx,0,mz);keyL.position.set(mx-R*.45,R*1.2,mz+R*.35);
  Object.assign(keyL.shadow.camera,{left:-R,right:R,top:R,bottom:-R,near:1,far:R*4});keyL.shadow.camera.updateProjectionMatrix()}
/* chạm / kéo trên màn hình 3D → đổi về đúng ô trên chiến trường */
function remap(e){if(!R3.live||e.target!==dfc||!cam)return;const r=dfc.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1);
  const rc=new T.Raycaster();rc.setFromCamera({x:nx,y:ny},cam);const p=new T.Vector3();if(!rc.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p))return;
  const cx=r.left+dsx(p.x)*r.width/dfV.w,cy=r.top+dsy(p.z)*r.height/dfV.h;try{Object.defineProperty(e,'clientX',{value:cx});Object.defineProperty(e,'clientY',{value:cy})}catch(er){}}
['pointerdown','pointermove','pointerup','click','mousedown','mousemove','mouseup','dblclick','contextmenu'].forEach(t=>addEventListener(t,remap,true));

/* ---------- kho đối tượng dùng lại (đạn, tia, nổ, thanh máu) ---------- */
let GLOWT=null;function glowT(){if(GLOWT)return GLOWT;return GLOWT=cvTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(220,240,255,.75)');g.addColorStop(1,'rgba(120,180,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)})}
let TRAILT=null;function trailT(){if(TRAILT)return TRAILT;return TRAILT=cvTex(128,32,(x)=>{const g=x.createLinearGradient(0,0,128,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.75,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,1)');x.fillStyle=g;x.beginPath();x.moveTo(0,16);x.lineTo(118,4);x.arc(118,16,12,-Math.PI/2,Math.PI/2);x.closePath();x.fill()})}
function Pool(mk){const a=[];let n=0;return{get(){let o=a[n];if(!o){o=mk();a.push(o)}n++;o.visible=true;return o},end(){for(let i=n;i<a.length;i++)a[i].visible=false;n=0},all:a}}
const ADDM=(map)=>new T.SpriteMaterial({map,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
let PS,PT,BC,BG,XS,XB,BAR;
function pools(){if(PS)return;
  PS=Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s});
  PT=Pool(()=>{const s=new T.Sprite(ADDM(trailT()));s.center.set(1,.5);scene.add(s);return s});
  const cyl=new T.CylinderGeometry(1,1,1,10,1,true);
  BC=Pool(()=>{const m=new T.Mesh(cyl,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));m.frustumCulled=false;scene.add(m);return m});
  BG=Pool(()=>{const m=new T.Mesh(cyl,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));m.frustumCulled=false;scene.add(m);return m});
  const sph=new T.SphereGeometry(1,20,12);
  XB=Pool(()=>{const m=new T.Mesh(sph,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m});
  XS=Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s});
  BAR=Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s})}
function bar(x,y,z,w,f,c,o){if(f<=0)return;const s=BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),.13,1);s.material.color.copy(col(c));s.material.opacity=o==null?1:o}
const yAx=()=>new T.Vector3(0,1,0);
function beam(pool,a,b,r,c,o){const m=pool.get(),d=new T.Vector3().subVectors(b,a),L=d.length()||.001;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(yAx(),d.multiplyScalar(1/L));m.scale.set(r,L,r);m.material.color.copy(col(c));m.material.opacity=o}

/* ---------- vẽ 3D ---------- */
let t3=0,lastT=performance.now();const sv=()=>new T.Vector3();
function render(G,L){const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;t3+=dt;
  const w=dfc.clientWidth||dfV.w,h=dfc.clientHeight||dfV.h,pr=ren.getPixelRatio();if(cv3.width!==Math.round(w*pr)||cv3.height!==Math.round(h*pr))ren.setSize(w,h,false);
  if(R3.gid!==G)setWorld(G);fitCam();gTex.needsUpdate=true;pools();
  const used=new Set();
  L.forEach(it=>{if(!it.m)return;const o=it.o;let g=R3.inst.get(o);
    if(!g||g.userData.src!==it.src){if(g)drop(g);g=mkInst(it);R3.inst.set(o,g)}
    used.add(o);const U=g.userData,M=U.hull.material;
    if(it.k==='s'){const ww=o.sh.W*o.sc,hh=o.sh.H*o.sc,lf=o.lift||0,sc=1+lf*.25,hy=.2*Math.sqrt(ww*hh);
      U.hull.scale.set(ww,hy,hh);U.bot.scale.set(ww,-hy*.6,hh);g.scale.setScalar(sc);
      const y=HOV+lf*1.3+Math.sin(t3*1.6+U.ph)*.05;g.position.set(o.x,y,o.y);
      /* nghiêng thân khi đổi hướng */
      const ry=-(o.ang+Math.PI/2);let dr=ry-(U.ry==null?ry:U.ry);dr=Math.atan2(Math.sin(dr),Math.cos(dr));U.ry=(U.ry==null?ry:U.ry)+dr;U.roll=(U.roll||0)*.9+Math.max(-.35,Math.min(.35,-dr/Math.max(dt,.001)*.04))*.1;
      g.rotation.set(0,ry,0);U.hull.rotation.z=U.bot.rotation.z=U.roll;
      let op=1;if(o.ghost)op=o.gfa!=null?Math.min(o.gfa,o.gt*2,(o.glife-o.gt)*3+.2):Math.min(.65,o.gt*2,(o.glife-o.gt)*3+.2);else if(o.stl>0)op=o.stlA||.4;else if(o.fd>0)op=.6;
      M.transparent=op<.99;M.opacity=Math.max(.05,op);M.color.setScalar(o.hit>0?2.4:1);if(o.ghost)M.color.setRGB(.7,1.2,1.6);
      const stun=o.stun>0||o.stT>0||o.c5st>0;M.emissiveIntensity=stun?1.4+Math.sin(t3*30)*.6:1.4;
      const mv=Math.min(1,Math.hypot(o.vx||0,o.vy||0)/4+.35);U.fl.forEach((f,i)=>{const k=mv*(1+.18*Math.sin(t3*31+i*2)+.08*Math.sin(t3*53+i));f.a.scale.set(f.r*ww,f.r*ww,f.r*ww*6*k);f.b.scale.set(f.r*ww*.5,f.r*ww*.5,f.r*ww*3.4*k);f.a.visible=f.b.visible=op>.3});
      /* thanh máu lơ lửng */
      const bw=Math.max(.8,o.size*.9),by=y+hy+.75*sc,bz=o.y;bar(o.x,by,bz,bw,1,'#05081a',.75);bar(o.x,by,bz,bw,Math.max(0,o.hp/o.max),o.team==='p'?'#4fd8ff':'#ff6a78');
      if(typeof c7ShF==='function'){const f=c7ShF(o);if(f>0)bar(o.x,by,bz,bw,f,'#ffffff',.9)}
      if(o.epM!=null&&(o.ep<o.epM||o.exh>0)){bar(o.x,by-.15,bz,bw,1,'#05081a',.7);bar(o.x,by-.15,bz,bw,Math.max(0,o.ep/o.epM),o.exh>0?'#ffffff':'#35c8ff')}}
    else{const b=o,ww=b.w,hh=b.h,tt=(it.k==='u'?b.bd.t:b.t),hq=tt==='hq',hy=(hq?.26:tt==='wall'?.24:.22)*Math.sqrt(ww*hh);U.hull.scale.set(ww,hy,hh);g.position.set(b.x,0,b.y);
      const H=b.u||b;let ry=0;if(tt!=='hq'&&tt!=='wall'&&H.da!=null&&Math.abs(ww-hh)<.01)ry=-(H.da+Math.PI/2);g.rotation.set(0,ry,0);
      const fl=it.k==='u'?(b.hit>0):(b.flash>0);M.color.setScalar(fl?2.1:1);
      if(U.core){U.core.position.y=hy*1.15;const p=1+.12*Math.sin(t3*3);U.core.scale.setScalar(Math.sqrt(ww*hh)*.42*p);U.core.material.opacity=.55+.2*Math.sin(t3*3)}
      const mx=b.max||1,show=b.hp<mx||hq||b.hq||(b.shd&&b.shd.t>0&&b.shd.v>0);
      if(show){const bw=Math.max(ww*.9,1.6),by=hy+.55,bz=b.y-hh*.15;bar(b.x,by,bz,bw,1,'#05081a',.75);bar(b.x,by,bz,bw,Math.max(0,b.hp/mx),(hq||b.hq)?'#4fd8ff':b.hp/mx>.4?'#6dff9a':'#ff6a78');if(b.shd&&b.shd.t>0&&b.shd.v>0)bar(b.x,by,bz,bw,Math.min(1,b.shd.v/Math.max(1e-9,b.shd.max)),'#ffffff',.9)}}});
  R3.inst.forEach((g,o)=>{if(!used.has(o)){drop(g);R3.inst.delete(o)}});
  /* đạn bay ở độ cao thân tàu, có vệt sáng phía sau */
  const a=sv(),b=sv(),pa=sv(),pb=sv();
  G.pr.forEach(p=>{const c=p.k==='missile'?'#ffb347':p.col,sz=p.spl?.5:p.k==='missile'?.42:.32;const s=PS.get();s.position.set(p.x,HOV,p.y);s.scale.set(sz,sz,1);s.material.color.copy(col(c));s.material.opacity=1;
    const sp=Math.hypot(p.vx||0,p.vy||0);if(sp>.5){const t=PT.get();t.position.copy(s.position);pa.set(p.x,HOV,p.y).project(cam);pb.set(p.x-p.vx*.05,HOV,p.y-p.vy*.05).project(cam);
      t.material.rotation=Math.atan2(pa.y-pb.y,(pa.x-pb.x)*cam.aspect);const ln=Math.min(2.2,.25+sp*.06)*(p.k==='missile'?1.3:1);t.scale.set(ln,sz*.55,1);t.material.color.copy(col(c));t.material.opacity=.85}});
  /* tia: lõi sáng + quầng màu */
  G.bm.forEach(B=>{const o=Math.min(1,B.t*8);if(o<=0)return;a.set(B.x1,HOV,B.y1);b.set(B.x2,HOV,B.y2);const r=Math.max(.035,(B.w||3)/26*.5);beam(BC,a,b,r*.45,'#ffffff',.85*o);beam(BG,a,b,r*1.6,B.col,.45*o)});
  /* vụ nổ: cầu lửa nở ra + quầng sáng */
  G.fx.forEach(f=>{const k=f.t/f.max;if(k<=0)return;const m=XB.get(),R=f.r*(1.1-k*.5)*(f.ex?.8:1);m.position.set(f.x,HOV*.8,f.y);m.scale.setScalar(Math.max(.05,R));m.material.color.copy(col(f.ex?'#ffb347':f.col));m.material.opacity=Math.min(1,k*.75);
    const s=XS.get();s.position.copy(m.position);s.scale.setScalar(R*2.6);s.material.color.copy(col(f.ex?'#ffd27a':f.col));s.material.opacity=Math.min(1,k*.9)});
  PS.end();PT.end();BC.end();BG.end();XB.end();XS.end();
  /* điểm đến của tàu */
  const P=G.pl;marker.visible=!P.dead&&Math.hypot(P.tx-P.x,P.ty-P.y)>.3;if(marker.visible){marker.position.x=P.tx;marker.position.z=P.ty;marker.rotation.z+=dt*2;marker.scale.setScalar(1+.15*Math.sin(t3*6))}
  tlb(G,dt);BAR.end();
  ren.render(scene,cam)}
function mkInst(it){const m=it.m,g=new T.Group(),hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;g.add(hull);
  const U=g.userData={src:it.src,ph:Math.random()*6,hull,fl:[]};
  if(it.k==='s'){const bot=new T.Mesh(m.geo,m.matB);bot.customDepthMaterial=m.depth;bot.castShadow=true;g.add(bot);U.bot=bot;
    (m.noz||[]).forEach(n=>{const fa=new T.Mesh(FLG,FLM1),fb=new T.Mesh(FLG,FLM2),ww=it.o.sh.W*it.o.sc,hh=it.o.sh.H*it.o.sc;fa.position.set((n.u-.5)*ww,.02,(n.v-.5)*hh);fb.position.copy(fa.position);g.add(fa,fb);U.fl.push({a:fa,b:fb,r:n.r})})}
  else{const tt=it.k==='u'?it.o.bd.t:it.o.t;if(tt==='hq'||/laser|tesla|arc|ion/i.test(tt)){const c=new T.Sprite(ADDM(glowT()));c.material.color.set(tt==='hq'?0x7fe8ff:0x9fd0ff);g.add(c);U.core=c}}
  scene.add(g);return g}
function drop(g){scene.remove(g);g.userData.hull.material.dispose();if(g.userData.core)g.userData.core.material.dispose()}
/* ---------- Thiên Lôi 3D: mây giông, khóa mục tiêu 0,3 giây, tia sét 3 lớp + 4 nhánh, lóe sáng ---------- */
const ADD=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
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
  const _E=dfExit;dfExit=function(){off();R3.inst.forEach(g=>drop(g));R3.inst.clear();R3.gid=null;return _E.apply(this,arguments)};
  if(R3.on)loadThree();
},0);
})();
