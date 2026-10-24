/* ===== c33: TRẬN ĐẤU 3D (Level + PvP) =====
   Chỉ màn chiến đấu dựng 3D; sảnh, shop, Kho tàu, Nâng cấp, sảnh Trụ sở giữ 2D. Không vẽ lại ảnh: mỗi ảnh có sẵn (tàu, boss, công trình,
   vũ khí, khiên, động cơ, lõi, thùng chứa) được ép thành khối dày theo đúng đường viền ảnh, mặt trên là ảnh gốc có ánh sáng và bóng khối.
   Sân: bầu trời tinh vân 3D, sao + bụi không gian, sàn không kẻ ô (lưới ô vẫn tồn tại ngầm), viền sân phát sáng.
   Camera bám sau tàu chính (nút − + kéo xa / gần), tàu bị hạ thì quay về trụ sở; rung khi nổ lớn. Radar tròn. Chất lượng theo Cài đặt.
   Giữ nguyên toàn bộ chỉ số, giá, cấp độ và luật: lớp 3D chỉ vẽ lại, không đụng vào tính toán trận. */
(function(){
const R3={on:true,fail:false,models:new Map(),queue:[],inst:new Map(),hide:null,hiding:false,fx:new Map(),gid:null,cd:17,yaw:0,shake:0,q:-1};
window.R3D=R3;
try{if(localStorage.getItem('se3d')==='0')R3.on=false}catch(e){}
const BLANK=new Image();BLANK.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const _dimg=dimg;
dimg=function(src){const i=_dimg(src);if(i&&R3.hiding&&R3.hide&&R3.hide.has(src))return BLANK.complete?BLANK:null;return i};
let T=null,ren=null,scene,cam,cv3,fxP,gTex,shadowP,keyL,floor,sky,border,baseZ,marker,dust,WHITE,FLG,FLM1,FLM2,SHG,camT=null,camL=null;
const HOV=.55,FXY=.42,EL=.6;
function loadThree(){if(window.THREE||R3.loading||R3.fail)return;R3.loading=1;const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=()=>{R3.loading=0};s.onerror=()=>{R3.loading=0;R3.fail=true;btn()};document.head.appendChild(s)}
const COLS=new Map();function col(c){let v=COLS.get(c);if(!v){v=new T.Color();try{v.setStyle(String(c||'#ffffff').slice(0,7))}catch(e){v.set(0xffffff)}COLS.set(c,v)}return v}
const lin=h=>new T.Color(h).convertSRGBToLinear();
function cvTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new T.CanvasTexture(c)}
/* chất lượng đồ họa: lấy từ Cài đặt → Đồ họa (Thấp / Trung bình / Cao, Rung màn hình, Hiệu ứng ánh sáng, Hiệu ứng hạt) */
const SET=()=>{try{return S.set||{}}catch(e){return {}}};
function QL(){const q=SET().q;return q==='Thấp'?0:q==='Cao'?2:1}
const CAP={part:[50,150,300],proj:[90,180,320]};
function applyQ(){const q=QL();if(q===R3.q)return;R3.q=q;ren.setPixelRatio(Math.min([1,1.5,2][q],devicePixelRatio||1));ren.shadowMap.enabled=q>0;keyL.castShadow=q>0;
  const sz=[512,1024,2048][q];if(keyL.shadow.map){keyL.shadow.map.dispose();keyL.shadow.map=null}keyL.shadow.mapSize.set(sz,sz);scene.traverse(o=>{if(o.material&&o.material.needsUpdate!==undefined)o.material.needsUpdate=true})}
function init(){if(ren)return true;if(R3.fail||!window.THREE)return false;T=window.THREE;
  try{cv3=document.createElement('canvas');cv3.id='df3d';cv3.setAttribute('aria-hidden','true');cv3.style.cssText='position:absolute;inset:0;width:100%;height:100%;max-height:none;max-width:none;margin:0;border:0;border-radius:0;box-shadow:none;background:none;display:none;pointer-events:none';dfc.after(cv3);
    ren=new T.WebGLRenderer({canvas:cv3,antialias:true,powerPreference:'high-performance'})}catch(e){R3.fail=true;if(cv3)cv3.remove();btn();return false}
  ren.shadowMap.type=T.PCFSoftShadowMap;ren.outputEncoding=T.sRGBEncoding;ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.12;
  scene=new T.Scene();R3.scene=scene;scene.background=new T.Color(0x000208);cam=new T.PerspectiveCamera(50,1,.1,2000);R3.cam=cam;
  scene.add(new T.HemisphereLight(0xc8dcff,0x232a48,1.0));
  keyL=new T.DirectionalLight(0xfff0dc,1.35);keyL.shadow.bias=-.0007;keyL.shadow.normalBias=.02;scene.add(keyL,keyL.target);
  const rim=new T.DirectionalLight(0x5aa8ff,.75);rim.position.set(-60,30,-90);scene.add(rim);
  const fill=new T.DirectionalLight(0xffc27a,.25);fill.position.set(60,15,40);scene.add(fill);
  WHITE=cvTex(4,4,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,4,4)});
  /* bầu trời: nền tinh vân xanh của trận Level bọc quanh sân (cả phía dưới sàn) */
  sky=new T.Mesh(new T.SphereGeometry(600,48,24),new T.MeshBasicMaterial({color:0x000000,side:T.BackSide,toneMapped:false,fog:false,depthWrite:false}));sky.renderOrder=-20;scene.add(sky);
  /* lớp sao xa + bụi không gian gần sân */
  {const g=new T.BufferGeometry(),n=3000,p=new Float32Array(n*3),c=new Float32Array(n*3);for(let i=0;i<n;i++){const r=260+Math.random()*300,t=Math.random()*Math.PI*2,u=Math.acos(2*Math.random()-1);p[i*3]=r*Math.sin(u)*Math.cos(t);p[i*3+1]=r*Math.cos(u);p[i*3+2]=r*Math.sin(u)*Math.sin(t);const k=.6+Math.random()*.4,w=Math.random();c[i*3]=k*(w<.2?1:.8);c[i*3+1]=k*.9;c[i*3+2]=k}
   g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('color',new T.BufferAttribute(c,3));const st=new T.Points(g,new T.PointsMaterial({size:1.6,vertexColors:true,sizeAttenuation:true,fog:false,depthWrite:false}));st.renderOrder=-19;scene.add(st);R3.stars=st}
  {const g=new T.BufferGeometry(),n=420,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=Math.random();p[i*3+1]=Math.random();p[i*3+2]=Math.random()}g.setAttribute('position',new T.BufferAttribute(p,3));
   dust=new T.Points(g,new T.PointsMaterial({map:cvTex(32,32,(x)=>{const gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,32,32)}),color:0x9fc4ff,size:.22,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));dust.frustumCulled=false;scene.add(dust);dust.userData.base=p.slice()}
  /* sàn đấu: tấm kim loại tối trong suốt nhẹ, không kẻ ô */
  const fm=cvTex(256,256,(x)=>{const g=x.createRadialGradient(128,128,10,128,128,180);g.addColorStop(0,'#1c3470');g.addColorStop(1,'#060c22');x.fillStyle=g;x.fillRect(0,0,256,256);for(let i=0;i<900;i++){x.fillStyle='rgba(160,200,255,'+(Math.random()*.05)+')';x.fillRect(Math.random()*256,Math.random()*256,2,2)}});fm.encoding=T.sRGBEncoding;
  floor=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshLambertMaterial({map:fm,color:lin(0x5a6c94),transparent:true,opacity:.8,depthWrite:true}));floor.rotation.x=-Math.PI/2;floor.renderOrder=-10;scene.add(floor);
  shadowP=new T.Mesh(new T.PlaneGeometry(1,1),new T.ShadowMaterial({opacity:.5}));shadowP.rotation.x=-Math.PI/2;shadowP.position.y=.01;shadowP.receiveShadow=true;shadowP.renderOrder=-9;scene.add(shadowP);
  border=new T.Group();scene.add(border);baseZ=new T.Group();scene.add(baseZ);
  /* tầng hiệu ứng kỹ năng 2D (trong suốt) ngang thân tàu */
  gTex=new T.CanvasTexture(dfc);gTex.encoding=T.sRGBEncoding;gTex.minFilter=T.LinearFilter;gTex.generateMipmaps=false;
  fxP=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:gTex,transparent:true,depthWrite:false,toneMapped:false}));fxP.rotation.x=-Math.PI/2;fxP.position.y=FXY;fxP.renderOrder=6;scene.add(fxP);
  marker=new T.Mesh(new T.RingGeometry(.42,.5,40),new T.MeshBasicMaterial({color:0x4fd8ff,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide,toneMapped:false}));marker.rotation.x=-Math.PI/2;marker.position.y=.04;scene.add(marker);
  FLG=new T.ConeGeometry(1,1,16,1,true);FLG.translate(0,.5,0);FLG.rotateX(Math.PI/2);
  FLM1=new T.MeshBasicMaterial({color:0x38c8ff,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  FLM2=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  SHG=new T.SphereGeometry(1,32,16);
  applyQ();return true}
/* dựng sàn, viền phát sáng, vùng căn cứ theo kích thước chiến trường (mở rộng khi trụ sở nâng cấp) */
function setWorld(G){R3.gid=G;const Wd=G.wd.Wd,Hd=G.wd.Hd,cx=Wd/2,cz=Hd/2;
  floor.position.set(cx,0,cz);floor.scale.set(Wd+1.2,Hd+1.2,1);shadowP.position.set(cx,.01,cz);shadowP.scale.set(Wd*3,Hd*3,1);
    sky.position.set(cx,0,cz);R3.stars.position.set(cx,0,cz);
  const P=dust.geometry.attributes.position,B=dust.userData.base;for(let i=0;i<P.count;i++){P.setXYZ(i,-6+B[i*3]*(Wd+12),.3+B[i*3+1]*7,-6+B[i*3+2]*(Hd+12))}P.needsUpdate=true;
  const clr=g=>{while(g.children.length){const m=g.children.pop();m.geometry&&m.geometry.dispose();m.material&&m.material.dispose()}};clr(border);clr(baseZ);
  /* viền sân: tường năng lượng mờ dần lên trên + dải sáng chân tường + cột đèn 4 góc */
  const wt=cvTex(8,128,(x)=>{const g=x.createLinearGradient(0,128,0,0);g.addColorStop(0,'rgba(140,225,255,.55)');g.addColorStop(.12,'rgba(80,190,255,.22)');g.addColorStop(1,'rgba(40,120,255,0)');x.fillStyle=g;x.fillRect(0,0,8,128)});
  const WH=1.5;[[cx,0,Wd,0],[cx,Hd,Wd,Math.PI],[0,cz,Hd,Math.PI/2],[Wd,cz,Hd,-Math.PI/2]].forEach(([x,z,L,r])=>{const m=new T.Mesh(new T.PlaneGeometry(L,WH),new T.MeshBasicMaterial({map:wt,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));m.position.set(x,WH/2,z);m.rotation.y=r;m.renderOrder=4;border.add(m)});
  [[0,0],[Wd,0],[0,Hd],[Wd,Hd]].forEach(([x,z])=>{const p=new T.Mesh(new T.CylinderGeometry(.14,.2,1.9,12),new T.MeshStandardMaterial({color:0x1a2e5c,metalness:.6,roughness:.35,emissive:0x4fd8ff,emissiveIntensity:.7}));p.position.set(x,.95,z);p.castShadow=true;border.add(p);
    const c=new T.Mesh(new T.SphereGeometry(.2,14,10),new T.MeshBasicMaterial({color:0xcff4ff,toneMapped:false}));c.position.set(x,1.95,z);border.add(c)});
  /* vùng căn cứ: ánh sáng nền nhẹ, viền mảnh (không kẻ ô) */
  const R=G.wd.R;if(R){const x0=DFM,z0=DFM,x1=DFM+(R.x1-R.x0),z1=DFM+(R.y1-R.y0);
    const gt=cvTex(128,128,(x)=>{const g=x.createRadialGradient(64,64,4,64,64,90);g.addColorStop(0,'rgba(70,140,255,.32)');g.addColorStop(1,'rgba(40,90,255,.04)');x.fillStyle=g;x.fillRect(0,0,128,128)});
    const pl=new T.Mesh(new T.PlaneGeometry(x1-x0,z1-z0),new T.MeshBasicMaterial({map:gt,transparent:true,depthWrite:false,toneMapped:false}));pl.rotation.x=-Math.PI/2;pl.position.set((x0+x1)/2,.02,(z0+z1)/2);baseZ.add(pl);
    const pts=[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]].map(([x,z])=>new T.Vector3(x,.03,z));baseZ.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x7fe0ff,transparent:true,opacity:.5,toneMapped:false})))}
  const RR=Math.max(Wd,Hd)*.75+4;keyL.target.position.set(cx,0,cz);keyL.position.set(cx-RR*.45,RR*1.2,cz+RR*.35);
  Object.assign(keyL.shadow.camera,{left:-RR,right:RR,top:RR,bottom:-RR,near:1,far:RR*4});keyL.shadow.camera.updateProjectionMatrix();camT=null}
/* ---------- dựng khối 3D từ hình gốc (mặt nạ → khoảng cách tới mép → độ cao, vách đứng kín, màu vách lan từ viền) ---------- */
function build(j,im){
  const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,NX=j.kind==='b'?60:j.kind[0]==='m'?40:64,NY=Math.max(8,Math.round(NX*ih/iw));
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
  const h=new Float32Array(N),bev=j.kind==='b'?2:j.kind[0]==='m'?1.5:2.5;
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
  /* đầu phun động cơ (vùng xanh sáng ở phía đuôi) → chỗ phát lửa đẩy */
  const noz=[];if(j.kind==='s'||j.kind==='me'){const Q=new Uint8Array(N);for(let y=Math.floor(NY*.55);y<NY;y++)for(let X=0;X<NX;X++){const i=y*NX+X,r=D[i*4],g=D[i*4+1],bb=D[i*4+2];if(D[i*4+3]>80&&bb>200&&g>165&&(r+g+bb)/765>.62)Q[i]=1}
    const seen=new Uint8Array(N);for(let i=0;i<N;i++){if(!Q[i]||seen[i])continue;const st=[i];seen[i]=1;let n=0,sx=0,sy=0,my=0;while(st.length){const k=st.pop();n++;const X=k%NX,y=(k/NX)|0;sx+=X;sy+=y;my=Math.max(my,y);[k+1,k-1,k+NX,k-NX].forEach(q=>{if(q>=0&&q<N&&Q[q]&&!seen[q]&&Math.abs((q%NX)-X)<=1){seen[q]=1;st.push(q)}})}
      if(n>=2)noz.push({u:(sx/n+.5)/NX,v:(my+.8)/NY,r:Math.max(.025,Math.min(.09,Math.sqrt(n/Math.PI)/NX*1.1)),n})}
    noz.sort((p,q)=>q.n-p.n);noz.length=Math.min(noz.length,4)}
  const m=j.m;m.geo=geo;m.noz=noz;m.hs=hs;m.NX=NX;m.NY=NY;m.matB=new T.MeshStandardMaterial({map:tex,alphaMap:alphaT,alphaTest:.5,color:0x5b6578,metalness:.7,roughness:.55,side:T.DoubleSide});m.mat=new T.MeshStandardMaterial({map:tex,alphaMap:alphaT,alphaTest:.5,metalness:j.kind==='b'?.35:.5,roughness:.45,emissive:0xffffff,emissiveMap:glow,emissiveIntensity:1.3,side:T.DoubleSide});
  m.depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,alphaMap:alphaT,alphaTest:.5});m.ready=true}
function model(src,kind){if(!src)return null;const key=kind==='me'?'me|'+src:src;let m=R3.models.get(key);if(m)return m.ready?m:null;m={ready:false};R3.models.set(key,m);R3.queue.push({src,kind,m});return null}
function pump(){const t0=performance.now();let spin=R3.queue.length;while(R3.queue.length&&performance.now()-t0<10&&spin-->0){const j=R3.queue.shift();const im=_dimg(j.src);if(!im){R3.queue.push(j);continue}try{build(j,im)}catch(e){console.error(e);j.m.bad=true}}}
function bSrc(t,v){return t==='hq'?HQIMG:(t==='wall'&&v?BSPR.wallv:(BSPR[t]||SPR[t]))}
function collect(G){const L=[];
  const ships=G.en.filter(e=>e.spawn<=G.t&&!e.dead).concat(G.pl.dead?[]:[G.pl]).concat((G.al||[]).filter(a=>!a.dead));
  ships.forEach(e=>{if(!e.sh||!e.sh.img)return;L.push({o:e,k:'s',src:e.sh.img,m:model(e.sh.img,'s')})});
  G.bl.forEach(b=>{if(b.hp<=0)return;if(b.t==='mine'){L.push({o:b,k:'mine',src:'mine'});return}const src=bSrc(b.t,b.v);if(src)L.push({o:b,k:'b',src,m:model(src,'b')})});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead||!u.bd)return;if(u.bd.t==='mine'){L.push({o:u,k:'mine',src:'mine'});return}const src=bSrc(u.bd.t,u.bd.v);if(src)L.push({o:u,k:'u',src,m:model(src,'b')})});
  return L}
/* ---------- mô-đun đã lắp trên thân tàu (ô đỏ vũ khí, xanh dương khiên, vàng động cơ, xanh lá lõi / kỹ năng / giảm KL, xám thùng chứa) ---------- */
function modsFor(e){if(e.__m3)return e.__m3;const sh=e.sh,L=[];
  const add=(def,ax,ay,rot,k)=>{if(!def||!def.img||ax==null)return;const rw=rot?def.h:def.w,rh=rot?def.w:def.h;L.push({img:def.img,cx:(sh.x0+56*(ax+rw/2))/sh.W,cy:(sh.y0+56*(ay+rh/2))/sh.H,w:rw*56/sh.W,h:rh*56/sh.H,rot:!!rot,k})};
  if(e.team==='p'&&!e.ghost&&typeof khWpMap==='function'&&KSH.some(x=>x.id===sh.id)){try{const wm=khWpMap(sh);Object.keys(wm).forEach(i=>wm[i].forEach(it=>add(wpGet(it.id),it.ax,it.ay,it.rot,'w')));
    [[window.khArmor||(typeof khArmor==='function'&&khArmor),'a'],[typeof khEngines==='function'&&khEngines,'e'],[typeof khReactors==='function'&&khReactors,'n'],[typeof khTanks==='function'&&khTanks,'t'],[typeof khMassMods==='function'&&khMassMods,'m'],[typeof khSkills==='function'&&khSkills,'k']].forEach(([f,k])=>{if(!f)return;(f(sh)||[]).forEach(it=>add(wpGet(it.id),it.ax,it.ay,it.rot,k))})}catch(er){}}
  if(!L.some(m=>m.k==='w')&&e.ws&&e.sc)e.ws.forEach(x=>{const w=x.w;if(!w||!w.img||x.mx==null)return;L.push({img:w.img,cx:(x.mx/e.sc+sh.W/2)/sh.W,cy:(x.my/e.sc+sh.H/2)/sh.H,w:w.w*56/sh.W,h:w.h*56/sh.H,rot:false,k:'w'})});
  return e.__m3=L}
function coreUV(sh){if(sh.__core!==undefined)return sh.__core;let n=0,x=0,y=0;(sh.g||[]).forEach((row,j)=>[...row].forEach((c,i)=>{if(c==='g'){n++;x+=sh.x0+56*(i+.5);y+=sh.y0+56*(j+.5)}}));return sh.__core=n?{u:x/n/sh.W,v:y/n/sh.H}:null}
const hAt=(m,u,v)=>m.hs[Math.max(0,Math.min(m.NY-1,Math.round(v*(m.NY-1))))*m.NX+Math.max(0,Math.min(m.NX-1,Math.round(u*(m.NX-1))))]||0;
/* ---------- camera bám sau tàu chính ---------- */
function camFollow(G,dt){const P=G.pl,tg=P.dead?{x:G.hq.x,y:G.hq.y,vx:0,vy:0}:P;
  const sp=Math.hypot(tg.vx||0,tg.vy||0);if(!P.dead&&sp>.6){const want=Math.atan2(-(tg.vx||0),-(tg.vy||0));let d=want-R3.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));R3.yaw+=d*Math.min(1,dt*1.1)}
  const fw=new T.Vector3(-Math.sin(R3.yaw),0,-Math.cos(R3.yaw)),want=new T.Vector3(tg.x,.4,tg.y).addScaledVector(fw,Math.min(6,R3.cd*.22));
  if(!camT||R3.gid!==camT.g){camT={g:R3.gid,p:want.clone(),d:R3.cd}}camT.p.lerp(want,1-Math.pow(.02,dt));camT.d+=(R3.cd-camT.d)*(1-Math.pow(.05,dt));
  const D=camT.d,y=Math.sin(EL+Math.min(.45,D/120))*D,hz=Math.cos(EL+Math.min(.45,D/120))*D;
  let sx=0,sy=0;if(R3.shake>0&&SET().shake!==false){sx=(Math.random()-.5)*R3.shake*.6;sy=(Math.random()-.5)*R3.shake*.6}R3.shake=Math.max(0,R3.shake-dt*1.8);
  cam.position.set(camT.p.x+Math.sin(R3.yaw)*hz+sx,camT.p.y+y+sy,camT.p.z+Math.cos(R3.yaw)*hz);cam.lookAt(camT.p);
  const w=dfV.w,h=dfV.h;cam.aspect=w/h;cam.fov=w<h?66:50;cam.updateProjectionMatrix();
  fxP.position.set((dwx(0)+dwx(w))/2,FXY,(dwy(0)+dwy(h))/2);fxP.scale.set(dwx(w)-dwx(0),dwy(h)-dwy(0),1)}
/* chạm / kéo trên màn hình 3D → đổi về đúng ô trên chiến trường */
function remap(e){if(!R3.live||e.target!==dfc||!cam)return;const r=dfc.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1);
  const rc=new T.Raycaster();rc.setFromCamera({x:nx,y:ny},cam);const p=new T.Vector3();if(!rc.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p)){p.set(DG.pl.x+Math.sin(-R3.yaw)*50,0,DG.pl.y-Math.cos(R3.yaw)*50)}
  const cx=r.left+dsx(p.x)*r.width/dfV.w,cy=r.top+dsy(p.z)*r.height/dfV.h;try{Object.defineProperty(e,'clientX',{value:cx});Object.defineProperty(e,'clientY',{value:cy})}catch(er){}}
['pointerdown','pointermove','pointerup','click','mousedown','mousemove','mouseup','dblclick','contextmenu'].forEach(t=>addEventListener(t,remap,true));
/* phím W A S D / mũi tên: đi theo hướng nhìn của camera (W luôn là đi tới phía trước màn hình) */
const KM={};const AX=[[0,-1,'w','ArrowUp'],[0,1,'s','ArrowDown'],[1,0,'d','ArrowRight'],[-1,0,'a','ArrowLeft']];
function keyMap(e){if(!R3.live)return;const k=e.key.length===1?e.key.toLowerCase():e.key,dirs={w:[0,1],arrowup:[0,1],s:[0,-1],arrowdown:[0,-1],d:[1,0],arrowright:[1,0],a:[-1,0],arrowleft:[-1,0]},d=dirs[k.toLowerCase()];if(!d)return;
  let out;if(e.type==='keydown'||!KM[e.code]){const f=[-Math.sin(R3.yaw),-Math.cos(R3.yaw)],r=[Math.cos(R3.yaw),-Math.sin(R3.yaw)],v=[f[0]*d[1]+r[0]*d[0],f[1]*d[1]+r[1]*d[0]];let best=AX[0],bd=-9;AX.forEach(a=>{const dd=a[0]*v[0]+a[1]*v[1];if(dd>bd){bd=dd;best=a}});out=k.startsWith('Arrow')||k.startsWith('arrow')?best[3]:best[2];KM[e.code]=out}else out=KM[e.code];
  if(e.type==='keyup')delete KM[e.code];try{Object.defineProperty(e,'key',{value:out})}catch(er){}}
addEventListener('keydown',keyMap,true);addEventListener('keyup',keyMap,true);
/* nút − + : kéo camera xa / gần tàu */
addEventListener('click',e=>{if(!R3.live)return;const b=e.target&&e.target.closest&&e.target.closest('#dfzi,#dfzo');if(!b)return;e.stopPropagation();e.preventDefault();R3.cd=b.id==='dfzi'?Math.max(6,R3.cd/1.25):Math.min(64,R3.cd*1.25)},true);

/* ---------- kho đối tượng dùng lại ---------- */
let GLOWT=null;function glowT(){if(GLOWT)return GLOWT;return GLOWT=cvTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(220,240,255,.75)');g.addColorStop(1,'rgba(120,180,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)})}
let TRAILT=null;function trailT(){if(TRAILT)return TRAILT;return TRAILT=cvTex(128,32,(x)=>{const g=x.createLinearGradient(0,0,128,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.75,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,1)');x.fillStyle=g;x.beginPath();x.moveTo(0,16);x.lineTo(118,4);x.arc(118,16,12,-Math.PI/2,Math.PI/2);x.closePath();x.fill()})}
let SMOKET=null;function smokeT(){if(SMOKET)return SMOKET;return SMOKET=cvTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(210,215,225,.7)');g.addColorStop(1,'rgba(160,170,190,0)');x.fillStyle=g;x.fillRect(0,0,64,64)})}
function Pool(mk){const a=[];let n=0;return{get(){let o=a[n];if(!o){o=mk();a.push(o)}n++;o.visible=true;return o},end(){for(let i=n;i<a.length;i++)a[i].visible=false;n=0},get n(){return n},all:a}}
const ADDM=(map)=>new T.SpriteMaterial({map,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
let PS,PT,BC,BG,XS,XB,BAR,MS,RG,MN,DOME;
function pools(){if(PS)return;
  PS=Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s});
  PT=Pool(()=>{const s=new T.Sprite(ADDM(trailT()));s.center.set(1,.5);scene.add(s);return s});
  const cyl=new T.CylinderGeometry(1,1,1,10,1,true);
  const bm=()=>{const m=new T.Mesh(cyl,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));m.frustumCulled=false;scene.add(m);return m};BC=Pool(bm);BG=Pool(bm);
  const sph=new T.SphereGeometry(1,20,12);
  XB=Pool(()=>{const m=new T.Mesh(sph,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m});
  XS=Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s});
  BAR=Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s});
  /* tên lửa 3D: thân + mũi + đuôi phát sáng */
  const mb=new T.CylinderGeometry(.05,.06,.42,10);mb.rotateX(Math.PI/2);const mc=new T.ConeGeometry(.05,.14,10);mc.rotateX(-Math.PI/2);mc.translate(0,0,-.28);
  const mmat=new T.MeshStandardMaterial({color:0xd8dde6,metalness:.5,roughness:.35}),mtip=new T.MeshStandardMaterial({color:0xff5a3a,metalness:.3,roughness:.4,emissive:0x661100});
  MS=Pool(()=>{const g=new T.Group(),a=new T.Mesh(mb,mmat),b=new T.Mesh(mc,mtip),f=new T.Sprite(ADDM(glowT()));f.material.color.set(0xffa040);f.position.z=.26;f.scale.set(.3,.3,1);g.add(a,b,f);a.castShadow=true;scene.add(g);return g});
  const rg=new T.RingGeometry(.86,1,48);RG=Pool(()=>{const m=new T.Mesh(rg,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));m.rotation.x=-Math.PI/2;scene.add(m);return m});
  /* mìn / trụ ẩn nấp: nằm chìm dưới sàn */
  const mg=new T.CylinderGeometry(.32,.38,.12,18),mm=new T.MeshStandardMaterial({color:0x2a2f3a,metalness:.7,roughness:.35,emissive:0xff8a2a,emissiveIntensity:.25});
  MN=Pool(()=>{const g=new T.Group(),m=new T.Mesh(mg,mm),r=new T.Mesh(new T.RingGeometry(.2,.3,24),new T.MeshBasicMaterial({color:0xffb347,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));r.rotation.x=-Math.PI/2;r.position.y=.07;g.add(m,r);scene.add(g);return g});
  DOME=Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,40,20,0,Math.PI*2,0,Math.PI/2),new T.MeshBasicMaterial({color:0x7fe0ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));scene.add(m);return m})}
function bar(x,y,z,w,f,c,o,th){if(f<=0)return;const s=BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),th||.13,1);s.material.color.copy(col(c));s.material.opacity=o==null?1:o}
function beam(pool,a,b,r,c,o){const m=pool.get(),d=new T.Vector3().subVectors(b,a),L=d.length()||.001;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));m.scale.set(r,L,r);m.material.color.copy(col(c));m.material.opacity=o}
/* ---------- hạt nổ, khói, mảnh vỡ, chớp sáng ---------- */
const parts=[],smokes=[],chunks=[],lights=[];let seenFx=new WeakSet();
function partSpr(add){const s=new T.Sprite(add?ADDM(glowT()):new T.SpriteMaterial({map:smokeT(),transparent:true,depthWrite:false}));scene.add(s);return s}
const freeP=[],freeS=[];
function spark(x,y,z,vx,vy,vz,c,life,sz){if(parts.length>=CAP.part[R3.q]||SET().part===false)return;const s=freeP.pop()||partSpr(true);s.visible=true;s.material.color.copy(col(c));s.position.set(x,y,z);parts.push({s,vx,vy,vz,life,max:life,sz})}
function smoke(x,y,z,life,sz){if(smokes.length>=CAP.part[R3.q]*.6||SET().part===false)return;const s=freeS.pop()||partSpr(false);s.visible=true;s.position.set(x,y,z);smokes.push({s,life,max:life,sz})}
function flash(x,y,z,c,I){if(SET().light===false||R3.q===0)return;let L=lights.find(l=>l.t<=0);if(!L){if(lights.length>=4)L=lights.reduce((a,b)=>a.t<b.t?a:b);else{const p=new T.PointLight(0xffffff,0,10,2);scene.add(p);L={p,t:0};lights.push(L)}}L.p.color.copy(col(c));L.p.position.set(x,y,z);L.I=I;L.t=.35;L.p.distance=4+I*2}
const rings=[];
function boom(x,z,r,ex,c){const n=Math.min(70,Math.round(10+r*14));const cs=['#6ab8ff','#ffa040','#ffffff','#ffd27a','#4f9bff'];
  for(let i=0;i<n;i++){const a=Math.random()*6.28,u=Math.random(),v=(2+Math.random()*4)*(.6+r*.35);spark(x,HOV*.8,z,Math.cos(a)*v*(1-u*.5),u*v*.9+1,Math.sin(a)*v*(1-u*.5),ex?cs[i%cs.length]:(i%3?c:'#ffffff'),.45+Math.random()*.55,.18+Math.random()*.2)}
  rings.push({x,z,r:r*1.7,t:0,max:.55,c:ex?'#9fd8ff':c});if(ex)rings.push({x,z,r:r*1.1,t:-.05,max:.5,c:'#ffb347'});
  flash(x,1,z,ex?'#ffc070':c,Math.min(8,2+r*2));if(ex&&r>=2.2)R3.shake=Math.min(1.1,R3.shake+r*.18);for(let i=0;i<Math.min(8,r*3);i++)smoke(x+(Math.random()-.5)*r,HOV*.8,z+(Math.random()-.5)*r,1+Math.random(),.6+r*.4)}
function debris(g,b){const m=g.userData.model;if(!m)return;const ww=b.w,hh=b.h,n=Math.min(16,Math.round(6+ww*hh*1.2));
  for(let i=0;i<n;i++){const s=.18+Math.random()*.35*Math.sqrt(ww*hh)/2,c=new T.Mesh(new T.BoxGeometry(s,s*.6,s*(.6+Math.random()*.8)),m.mat);c.castShadow=true;c.position.set(b.x+(Math.random()-.5)*ww*.8,.2+Math.random()*.6,b.y+(Math.random()-.5)*hh*.8);
    const a=Math.atan2(c.position.z-b.y,c.position.x-b.x);scene.add(c);chunks.push({m:c,vx:Math.cos(a)*(1+Math.random()*3),vy:2+Math.random()*4,vz:Math.sin(a)*(1+Math.random()*3),rx:(Math.random()-.5)*8,rz:(Math.random()-.5)*8,t:0})}
  boom(b.x,b.y,Math.max(1.6,Math.sqrt(ww*hh)),true,'#ffa040')}
function stepFx(dt){
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;if(p.life<=0){p.s.visible=false;freeP.push(p.s);parts.splice(i,1);continue}p.vy-=6*dt;p.vx*=.97;p.vz*=.97;p.s.position.x+=p.vx*dt;p.s.position.y=Math.max(.05,p.s.position.y+p.vy*dt);p.s.position.z+=p.vz*dt;const k=p.life/p.max;p.s.scale.setScalar(p.sz*(.5+k*.8));p.s.material.opacity=Math.min(1,k*1.5)}
  for(let i=smokes.length-1;i>=0;i--){const p=smokes[i];p.life-=dt;if(p.life<=0){p.s.visible=false;freeS.push(p.s);smokes.splice(i,1);continue}const k=p.life/p.max;p.s.position.y+=dt*.35;p.s.scale.setScalar(p.sz*(1.6-k));p.s.material.opacity=.55*k}
  for(let i=chunks.length-1;i>=0;i--){const c=chunks[i];c.t+=dt;const m=c.m;if(m.position.y>.08||c.vy>0){c.vy-=9*dt;m.position.x+=c.vx*dt;m.position.y+=c.vy*dt;m.position.z+=c.vz*dt;m.rotation.x+=c.rx*dt;m.rotation.z+=c.rz*dt;if(m.position.y<.08){m.position.y=.08;c.vy*=-.25;c.vx*=.5;c.vz*=.5;c.rx*=.4;c.rz*=.4;if(Math.abs(c.vy)<.6)c.vy=0}}
    if(c.t>3.2){m.position.y-=dt*.4;if(c.t>4.2){scene.remove(m);m.geometry.dispose();chunks.splice(i,1)}}}
  lights.forEach(L=>{if(L.t>0){L.t-=dt;L.p.intensity=Math.max(0,L.I*(L.t/.35))}else L.p.intensity=0});
  RG.end();for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.t+=dt;if(r.t>=r.max){rings.splice(i,1);continue}if(r.t<0)continue;const k=r.t/r.max,m=RG.get();m.position.set(r.x,.08,r.z);m.scale.setScalar(.2+r.r*k);m.material.color.copy(col(r.c));m.material.opacity=.9*(1-k)}}

/* ---------- vẽ 3D ---------- */
let t3=0,lastT=performance.now();const pa=()=>new T.Vector3();
function render(G,L){const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;t3+=dt;
  applyQ();const w=dfc.clientWidth||dfV.w,h=dfc.clientHeight||dfV.h,pr=ren.getPixelRatio();if(cv3.width!==Math.round(w*pr)||cv3.height!==Math.round(h*pr))ren.setSize(w,h,false);
  if(R3.gid!==G){setWorld(G);seenFx=new WeakSet();R3.yaw=0}pools();camFollow(G,dt);gTex.needsUpdate=true;
  if(!sky.material.map){const nbi=_dimg(DFBG);if(nbi){const t=new T.Texture(nbi);t.needsUpdate=true;t.encoding=T.sRGBEncoding;sky.material.map=t;sky.material.color=lin(0x9aa8c8);sky.material.needsUpdate=true}}
  sky.rotation.y+=dt*.004;{const P=dust.geometry.attributes.position;for(let i=0;i<P.count;i+=7)P.setY(i,P.getY(i)+Math.sin(t3*.6+i)*.002);P.needsUpdate=true}
  const used=new Set();MN.end();DOME.end();
  L.forEach(it=>{const o=it.o;
    if(it.k==='mine'){const m=MN.get(),arm=o.used||o.trig||o.on;m.position.set(o.x,arm?.06:-.045,o.y);m.children[1].material.opacity=.35+.35*Math.sin(t3*4+o.x);return}
    if(!it.m)return;let g=R3.inst.get(o);
    if(!g||g.userData.src!==it.src){if(g)drop(g);g=mkInst(it);R3.inst.set(o,g)}
    used.add(o);const U=g.userData,M=U.hull.material;U.o=o;U.k=it.k;
    if(it.k==='s'){const lf=o.lift||0;let sc=1+lf*.25;
      if(o.boss){const a=t3-U.born;if(a<1.3){const k=Math.min(1,a/1.1);sc*=.25+.75*(1+2.7*Math.pow(k-1,3)+1.7*Math.pow(k-1,2));if(!U.bfx){U.bfx=1;boom(o.x,o.y,Math.max(3,o.size),true,'#ff6a78');rings.push({x:o.x,z:o.y,r:o.size*2.6,t:0,max:1.1,c:'#ff6a78'})}}}
      g.scale.setScalar(sc);const y=HOV+lf*1.3+Math.sin(t3*1.6+U.ph)*.05;g.position.set(o.x,y,o.y);
      const ry=-(o.ang+Math.PI/2),pry=U.ry==null?ry:U.ry;let dr=ry-pry;dr=Math.atan2(Math.sin(dr),Math.cos(dr));U.ry=ry;U.roll=(U.roll||0)*.88+Math.max(-.4,Math.min(.4,-dr/Math.max(dt,.001)*.05))*.12;
      g.rotation.set(0,ry,0);U.body.rotation.z=U.roll;U.body.rotation.x=Math.sin(t3*1.3+U.ph)*.025;
      let op=1;if(o.ghost)op=o.gfa!=null?Math.min(o.gfa,o.gt*2,(o.glife-o.gt)*3+.2):Math.min(.65,o.gt*2,(o.glife-o.gt)*3+.2);else if(o.stl>0)op=o.stlA||.4;else if(o.fd>0)op=.6;
      M.transparent=op<.99;M.opacity=Math.max(.05,op);M.color.setScalar(o.hit>0?2.4:1);if(o.ghost)M.color.setRGB(.7,1.2,1.6);
      const stun=o.stun>0||o.stT>0;M.emissiveIntensity=stun?1.4+Math.sin(t3*30)*.6:1.4;
      attachMods(g);
      const mv=Math.min(1,Math.hypot(o.vx||0,o.vy||0)/4+.35);U.fl.forEach((f,i)=>{const k=mv*(1+.18*Math.sin(t3*31+i*2)+.08*Math.sin(t3*53+i));f.a.scale.set(f.r,f.r,f.r*6*k);f.b.scale.set(f.r*.5,f.r*.5,f.r*3.4*k);f.a.visible=f.b.visible=op>.3});
      /* lõi năng lượng: sáng theo mức năng lượng, tối khi cạn */
      if(U.core){let e=.75+.15*Math.sin(t3*3+U.ph);if(o===G.pl&&o.nrgMax){const f=o.nrg/o.nrgMax;e=o.nrg<1?.08:.25+.75*f;e*=1+.12*Math.sin(t3*4)}U.core.material.opacity=e;U.core.scale.setScalar(U.coreS*(.85+.3*e))}
      /* khiên năng lượng mờ bao quanh khi khiên còn máu */
      let sf=0;if(typeof c7ShF==='function')sf=c7ShF(o);if(o.cs&&o.cs.abs&&o.cs.abs.v>0)sf=Math.max(sf,.5);
      U.shield.visible=sf>0&&op>.3;if(U.shield.visible){U.shield.material.opacity=.07+.08*sf+(o.hit>0?.25:0)+.03*Math.sin(t3*5)}
      /* thanh máu lơ lửng (boss: thanh lớn riêng) */
      const ww=U.ww,hh=U.hh,big=o.boss,bw=big?Math.max(3,o.size*1.25):Math.max(.8,o.size*.9),th=big?.24:.13,by=y+U.hy*sc+(big?1.1:.75)*sc,bz=o.y;
      bar(o.x,by,bz,bw+.06,1,'#05081a',.8,th+.05);bar(o.x,by,bz,bw,Math.max(0,o.hp/o.max),big?'#ff3b5c':o.team==='p'?'#4fd8ff':'#ff6a78',1,th);
      if(sf>0)bar(o.x,by,bz,bw,sf,'#ffffff',.9,th);
      if(o.epM!=null&&(o.ep<o.epM||o.exh>0)){bar(o.x,by-th-.04,bz,bw,1,'#05081a',.7,.09);bar(o.x,by-th-.04,bz,bw,Math.max(0,o.ep/o.epM),o.exh>0?'#ffffff':'#35c8ff',1,.09)}}
    else{const b=o,ww=b.w,hh=b.h,tt=(it.k==='u'?b.bd.t:b.t),hq=tt==='hq',hy=(hq?.26:tt==='wall'?.24:.22)*Math.sqrt(ww*hh);U.hull.scale.set(ww,hy,hh);g.position.set(b.x,0,b.y);
      const H=b.u||b;let ry=0;if(tt!=='hq'&&tt!=='wall'&&H.da!=null&&Math.abs(ww-hh)<.01)ry=-(H.da+Math.PI/2);g.rotation.set(0,ry,0);
      const fl=it.k==='u'?(b.hit>0):(b.flash>0);M.color.setScalar(fl?2.1:1);
      if(U.core){U.core.position.y=hy*1.15;const p=1+.12*Math.sin(t3*3);U.core.scale.setScalar(Math.sqrt(ww*hh)*.42*p);U.core.material.opacity=.55+.2*Math.sin(t3*3)}
      /* khiên vòm trụ sở sáng lên khi trúng đạn */
      if(hq&&fl){const d=DOME.get();d.position.set(b.x,0,b.y);const R=Math.max(ww,hh)*.8;d.scale.set(R,R*.7,R);d.material.opacity=.18+.12*Math.sin(t3*20)}
      const mx=b.max||1,show=b.hp<mx||hq||b.hq||(b.shd&&b.shd.t>0&&b.shd.v>0);
      if(show){const bw=Math.max(ww*.9,1.6),by=hy+.6,bz=b.y-hh*.15;bar(b.x,by,bz,bw+.06,1,'#05081a',.8,.18);bar(b.x,by,bz,bw,Math.max(0,b.hp/mx),(hq||b.hq)?'#4fd8ff':b.hp/mx>.4?'#6dff9a':'#ff6a78');if(b.shd&&b.shd.t>0&&b.shd.v>0)bar(b.x,by,bz,bw,Math.min(1,b.shd.v/Math.max(1e-9,b.shd.max)),'#ffffff',.9)}}});
  /* công trình bị phá vỡ thành mảnh; tàu bị hạ nổ tung */
  R3.inst.forEach((g,o)=>{if(!used.has(o)){const U=g.userData;if(U.k==='b'||U.k==='u'){if((o.hp!=null&&o.hp<=0)||o.dead)debris(g,o)}else if(U.k==='s'&&(o.dead||o.hp<=0))boom(o.x,o.y,Math.max(1.2,o.size*.7),true,'#ffa040');drop(g);R3.inst.delete(o)}});
  /* đạn: cầu sáng có vệt đuôi; tên lửa 3D có vệt khói */
  const a=pa(),b=pa(),p1=pa(),p2=pa();let np=0;const capP=CAP.proj[R3.q];
  G.pr.forEach(p=>{if(np++>capP)return;const sp=Math.hypot(p.vx||0,p.vy||0);
    if(p.k==='missile'){const m=MS.get();m.position.set(p.x,HOV,p.y);m.rotation.set(0,Math.atan2(-(p.vx||0),-(p.vy||0)),0);if(Math.random()<.6)smoke(p.x-(p.vx||0)*.03,HOV,p.y-(p.vy||0)*.03,.7,.35);return}
    const c=p.col,sz=p.spl?.55:.32,s=PS.get();s.position.set(p.x,HOV,p.y);s.scale.set(sz,sz,1);s.material.color.copy(col(c));s.material.opacity=1;
    if(sp>.5){const t=PT.get();t.position.copy(s.position);p1.set(p.x,HOV,p.y).project(cam);p2.set(p.x-p.vx*.05,HOV,p.y-p.vy*.05).project(cam);t.material.rotation=Math.atan2(p1.y-p2.y,(p1.x-p2.x)*cam.aspect);const ln=Math.min(2.2,.25+sp*.06);t.scale.set(ln,sz*.55,1);t.material.color.copy(col(c));t.material.opacity=.85}});
  /* tia: lõi sáng + quầng màu */
  G.bm.forEach(B=>{const o=Math.min(1,B.t*8);if(o<=0)return;a.set(B.x1,HOV,B.y1);b.set(B.x2,HOV,B.y2);const r=Math.max(.035,(B.w||3)/26*.5);beam(BC,a,b,r*.45,'#ffffff',.85*o);beam(BG,a,b,r*1.6,B.col,.45*o)});
  /* vụ nổ: cầu lửa + hạt văng + vòng sóng + chớp sáng */
  G.fx.forEach(f=>{const k=f.t/f.max;if(k<=0)return;if(!seenFx.has(f)){seenFx.add(f);if(f.ex||f.r>=1)boom(f.x,f.y,f.r,!!f.ex,f.col||'#ffd27a');else for(let i=0;i<5;i++)spark(f.x,HOV,f.y,(Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4,f.col||'#fff',.35,.14)}
    const m=XB.get(),R=f.r*(1.1-k*.5)*(f.ex?.8:1);m.position.set(f.x,HOV*.8,f.y);m.scale.setScalar(Math.max(.05,R));m.material.color.copy(col(f.ex?'#ffb347':f.col));m.material.opacity=Math.min(1,k*.75);
    const s=XS.get();s.position.copy(m.position);s.scale.setScalar(R*2.6);s.material.color.copy(col(f.ex?'#ffd27a':f.col));s.material.opacity=Math.min(1,k*.9)});
  PS.end();PT.end();BC.end();BG.end();XB.end();XS.end();MS.end();stepFx(dt);
  const P=G.pl;marker.visible=!P.dead&&Math.hypot(P.tx-P.x,P.ty-P.y)>.3;if(marker.visible){marker.position.x=P.tx;marker.position.z=P.ty;marker.rotation.z+=dt*2;marker.scale.setScalar(1+.15*Math.sin(t3*6))}
  tlb(G,dt);BAR.end();
  ren.render(scene,cam);radar(G)}
function mkInst(it){const m=it.m,g=new T.Group(),body=new T.Group(),hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;body.add(hull);g.add(body);
  const U=g.userData={src:it.src,ph:Math.random()*6,hull,body,fl:[],model:m,born:t3};
  if(it.k==='s'){const o=it.o,ww=o.sh.W*o.sc,hh=o.sh.H*o.sc,hy=.2*Math.sqrt(ww*hh);U.ww=ww;U.hh=hh;U.hy=hy;hull.scale.set(ww,hy,hh);
    const bot=new T.Mesh(m.geo,m.matB);bot.customDepthMaterial=m.depth;bot.castShadow=true;bot.scale.set(ww,-hy*.6,hh);body.add(bot);U.bot=bot;
    U.mods=modsFor(o).map(x=>Object.assign({},x));U.hasEng=U.mods.some(x=>x.k==='e');
    if(!U.hasEng)(m.noz||[]).forEach(n=>addFlame(U,(n.u-.5)*ww,(n.v-.5)*hh,n.r*ww));
    const cu=coreUV(o.sh);if(cu){const c=new T.Sprite(ADDM(glowT()));c.material.color.set(0x6dffb0);c.position.set((cu.u-.5)*ww,hAt(m,cu.u,cu.v)*hy+.05,(cu.v-.5)*hh);U.coreS=Math.min(ww,hh)*.32;body.add(c);U.core=c}
    const sh=new T.Mesh(SHG,new T.MeshBasicMaterial({color:0x7fd8ff,transparent:true,opacity:.1,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));sh.scale.set(ww*.72,hy*2.4+.35,hh*.72);sh.visible=false;g.add(sh);U.shield=sh}
  else{const tt=it.k==='u'?it.o.bd.t:it.o.t;if(tt==='hq'||/laser|tesla|arc|ion/i.test(tt)){const c=new T.Sprite(ADDM(glowT()));c.material.color.set(tt==='hq'?0x7fe8ff:0x9fd0ff);g.add(c);U.core=c}}
  scene.add(g);return g}
function addFlame(U,x,z,r){const fa=new T.Mesh(FLG,FLM1),fb=new T.Mesh(FLG,FLM2);fa.position.set(x,.02,z);fb.position.copy(fa.position);U.body.add(fa,fb);U.fl.push({a:fa,b:fb,r:Math.max(.04,r)})}
/* gắn khối mô-đun lên mặt thân tàu khi mô hình của chúng đã sẵn sàng */
function attachMods(g){const U=g.userData;if(!U.mods||!U.mods.length)return;const hm=U.model;
  U.mods=U.mods.filter(x=>{const kind=x.k==='e'?'me':'m',m=model(x.img,kind);if(!m)return true;
    const mw=x.w*U.ww,md=x.h*U.hh,px=(x.cx-.5)*U.ww,pz=(x.cy-.5)*U.hh,base=hAt(hm,x.cx,x.cy)*U.hy,th=Math.max(.04,Math.min(.3,.32*Math.min(mw,md)));
    const me=new T.Mesh(m.geo,m.mat);me.customDepthMaterial=m.depth;me.castShadow=true;me.position.set(px,base-.01,pz);
    if(x.rot){me.rotation.y=-Math.PI/2;me.scale.set(md,th,mw)}else me.scale.set(mw,th,md);U.body.add(me);
    if(x.k==='e'){const nz=(m.noz&&m.noz.length)?m.noz:[{u:.5,v:.97,r:.16}];nz.forEach(n=>{let lx=(n.u-.5),lz=(n.v-.5);if(x.rot){const t=lx;lx=-lz;lz=t}addFlame(U,px+lx*(x.rot?md:mw),pz+lz*(x.rot?mw:md),n.r*(x.rot?md:mw))})}
    return false})}
function drop(g){scene.remove(g);g.userData.hull.material.dispose();if(g.userData.core)g.userData.core.material.dispose();if(g.userData.shield)g.userData.shield.material.dispose()}
/* ---------- radar tròn ---------- */
let rdc=null,rdq=null,rdn=0;
function radar(G){if(!rdc){rdc=document.createElement('canvas');rdc.id='df3r';rdc.width=rdc.height=240;rdc.setAttribute('aria-label','Radar');rdc.style.cssText='position:absolute;left:max(10px,env(safe-area-inset-left,0px));bottom:calc(10px + env(safe-area-inset-bottom,0px));width:clamp(84px,15vh,120px);height:clamp(84px,15vh,120px);max-height:none;border:0;border-radius:50%;background:none;pointer-events:none;z-index:5';document.getElementById('def').appendChild(rdc);rdq=rdc.getContext('2d')}
  rdc.style.display='block';if(rdn++%3)return;const q=rdq,W=240,R=112,c=W/2,P=G.pl,ox=P.dead?G.hq.x:P.x,oy=P.dead?G.hq.y:P.y,rng=Math.max(G.wd.Wd,G.wd.Hd)*.62,k=R/rng,cs=Math.cos(R3.yaw),sn=Math.sin(R3.yaw);
  const pt=(x,y)=>{const dx=x-ox,dy=y-oy,rx=dx*cs-dy*sn,ry=dx*sn+dy*cs;return[c+rx*k,c+ry*k]};
  q.clearRect(0,0,W,W);q.save();q.beginPath();q.arc(c,c,R,0,7);q.fillStyle='rgba(4,14,40,.78)';q.fill();q.clip();
  q.strokeStyle='rgba(90,180,255,.25)';q.lineWidth=2;[R*.33,R*.66].forEach(r=>{q.beginPath();q.arc(c,c,r,0,7);q.stroke()});q.beginPath();q.moveTo(c-R,c);q.lineTo(c+R,c);q.moveTo(c,c-R);q.lineTo(c,c+R);q.stroke();
  const sw=(t3*1.6)%6.283;q.fillStyle='rgba(80,200,255,.12)';q.beginPath();q.moveTo(c,c);q.arc(c,c,R,sw-.5,sw);q.closePath();q.fill();
  {const A=pt(0,0),B=pt(G.wd.Wd,0),C=pt(G.wd.Wd,G.wd.Hd),D=pt(0,G.wd.Hd);q.strokeStyle='rgba(120,220,255,.6)';q.beginPath();q.moveTo(...A);q.lineTo(...B);q.lineTo(...C);q.lineTo(...D);q.closePath();q.stroke()}
  const dot=(x,y,r,f)=>{const [a,b]=pt(x,y);q.fillStyle=f;q.beginPath();q.arc(a,b,r,0,7);q.fill()};
  G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine')return;const [a,bb]=pt(b.x,b.y);q.fillStyle=b.hq||b.t==='hq'?'#ffd24a':'rgba(140,190,255,.8)';const s=Math.max(3,Math.min(b.w,b.h)*k*.8);q.fillRect(a-s/2,bb-s/2,s,s)});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead)return;const [a,bb]=pt(u.x,u.y);q.fillStyle=u.bd&&u.bd.t==='hq'?'#ff8a3a':'rgba(255,120,130,.75)';const s=Math.max(3,Math.min(u.w,u.h)*k*.8);q.fillRect(a-s/2,bb-s/2,s,s)});
  G.en.forEach(e=>{if(e.dead||e.spawn>G.t)return;dot(e.x,e.y,e.boss?7:4,'#ff4d5e')});(G.al||[]).forEach(a=>{if(!a.dead)dot(a.x,a.y,4,'#6dffb0')});
  if(!P.dead){q.fillStyle='#4fd8ff';q.beginPath();q.moveTo(c,c-9);q.lineTo(c-6,c+6);q.lineTo(c+6,c+6);q.closePath();q.fill()}
  q.restore();q.strokeStyle='rgba(120,210,255,.8)';q.lineWidth=3;q.beginPath();q.arc(c,c,R,0,7);q.stroke()}
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
  b.onclick=()=>{if(R3.fail){toast('Máy không hỗ trợ đồ họa 3D, đang dùng 2D');return}R3.on=!R3.on;try{localStorage.setItem('se3d',R3.on?'1':'0')}catch(e){}btn()};btn()}}
function off(){R3.live=false;if(cv3)cv3.style.display='none';const r=document.getElementById('df3r');if(r)r.style.display='none'}
setTimeout(()=>{
  const _D=dfDraw;dfDraw=function(){const G=DG;
    if(!G||!R3.on||R3.fail){off();return _D.apply(this,arguments)}
    if(!window.THREE){loadThree();off();return _D.apply(this,arguments)}
    if(!init()){off();return _D.apply(this,arguments)}
    let L=[];try{pump();L=collect(G)}catch(e){console.error(e)}
    R3.hide=new Set(L.filter(i=>i.m).map(i=>i.src));R3.hiding=true;R3.live=true;dfZoom=1;
    try{_D.apply(this,arguments)}finally{R3.hiding=false}
    try{cv3.style.display='block';render(G,L)}catch(e){console.error(e);R3.fail=true;off();btn()}
    try{const P=G.pl,el=document.getElementById('dfen');if(el)el.style.filter=(P.nrgD>0&&P.nrg<P.nrgMax)?'grayscale(1) brightness(.85)':''}catch(e){}};
  const _E=dfExit;dfExit=function(){off();R3.inst.forEach(g=>drop(g));R3.inst.clear();R3.gid=null;return _E.apply(this,arguments)};
  if(R3.on)loadThree();
  if(typeof renderSe==='function'){const _R=renderSe;renderSe=function(){_R.apply(this,arguments);try{const P=document.getElementById('pp-se');const h=[...P.querySelectorAll('h4')].find(x=>x.textContent.trim()==='Đồ họa');if(!h||P.querySelector('#se3d'))return;
    const row=document.createElement('div');row.className='srow';row.innerHTML='<label>Trận đấu 3D</label><span class="tg"><input type="checkbox" id="se3d" '+(R3.on?'checked':'')+'><i></i></span>';h.parentNode.insertBefore(row,h.nextSibling);
    row.querySelector('input').onchange=e=>{R3.on=e.target.checked;try{localStorage.setItem('se3d',R3.on?'1':'0')}catch(er){}btn();if(R3.on)loadThree()}}catch(e){}}}
},0);
})();
