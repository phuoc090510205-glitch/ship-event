/* ===== c33: TRẬN ĐẤU 3D (Level + PvP) — kiểu dáng theo bản mô phỏng "Ship Event Level 3D" =====
   Sảnh, shop, Kho tàu, Nâng cấp, sảnh Trụ sở giữ 2D. Trận đấu: bầu trời tinh vân + hành tinh + thiên thạch, bệ căn cứ phát sáng,
   công trình khối 3D (trụ sở tháp vòm, tường, đại bác, laser, đại pháo, nỏ thần, phun lửa, nhà drone, máy tạo đá, mìn, trụ điện),
   tàu thân khối dựng từ ảnh gốc + mô-đun nổi theo màu ô, camera bám sát sau tàu chính, cần lái ảo, radar, HUD trận kiểu mới.
   Giữ nguyên toàn bộ chỉ số, giá, cấp độ và luật: lớp 3D chỉ vẽ lại, không đụng vào tính toán trận. */
(function(){
const R3={on:true,fail:false,models:new Map(),queue:[],inst:new Map(),hide:null,hiding:false,fx:new Map(),gid:null,cd:7.2,yaw:0,shake:0,q:-1,joy:{id:null,x:0,y:0}};
window.R3D=R3;
try{if(localStorage.getItem('se3d')==='0')R3.on=false}catch(e){}
const BLANK=new Image();BLANK.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const _dimg=dimg;
dimg=function(src){const i=_dimg(src);if(i&&R3.hiding&&R3.hide&&R3.hide.has(src))return BLANK.complete?BLANK:null;return i};
let T=null,ren=null,scene,cam,cv3,fxP,gTex,shadowP,keyL,sky,planet,atm,border,baseZ,marker,dust,polar,WHITE,FLG,FLM1,FLM2,SHG,MT=null,camT=null;
const HOV=1.6,FXY=1.2,K=1/2.4,TAU=Math.PI*2;
const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function angDiff(a,b){let d=(b-a)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d}
function loadThree(){if(window.THREE||R3.loading||R3.fail)return;R3.loading=1;const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=()=>{R3.loading=0};s.onerror=()=>{R3.loading=0;R3.fail=true;btn()};document.head.appendChild(s)}
const COLS=new Map();function col(c){let v=COLS.get(c);if(!v){v=new T.Color();try{v.setStyle(String(c||'#ffffff').slice(0,7))}catch(e){v.set(0xffffff)}COLS.set(c,v)}return v}
const lin=h=>new T.Color(h).convertSRGBToLinear();
function cvTex(w,h,fn,srgb){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);if(srgb)t.encoding=T.sRGBEncoding;return t}
const SET=()=>{try{return S.set||{}}catch(e){return {}}};
function QL(){const q=SET().q;return q==='Thấp'?0:q==='Cao'?2:1}
const CAP={part:[60,160,320],proj:[90,180,320]};
function applyQ(){const q=QL();if(q===R3.q)return;R3.q=q;ren.setPixelRatio(Math.min([1,1.5,2][q],devicePixelRatio||1));ren.shadowMap.enabled=q>0;keyL.castShadow=q>0;
  const sz=[512,1024,2048][q];if(keyL.shadow.map){keyL.shadow.map.dispose();keyL.shadow.map=null}keyL.shadow.mapSize.set(sz,sz);scene.traverse(o=>{if(o.material&&o.material.needsUpdate!==undefined)o.material.needsUpdate=true})}
function mats(){const M=o=>new T.MeshStandardMaterial(o);const L=o=>{['color','emissive'].forEach(k=>{if(o[k]!=null)o[k]=lin(o[k])});return M(o)};
  MT={dark:L({color:0x2a3346,metalness:.7,roughness:.5,flatShading:true}),metal:L({color:0x8a9ab8,metalness:.8,roughness:.35,flatShading:true}),
    red:L({color:0xff3344,emissive:0x771020,metalness:.5,roughness:.35}),cyan:L({color:0x4fd6ff,emissive:0x4fd6ff,emissiveIntensity:1.3}),
    orange:L({color:0xff9a3c,emissive:0xff7a1a,emissiveIntensity:.9}),green:L({color:0x5dffa1,emissive:0x2bd673,emissiveIntensity:1.1}),
    violet:L({color:0xb38cff,emissive:0x7a4dff,emissiveIntensity:1.2,flatShading:true}),blue:L({color:0x3f7cff,emissive:0x12307a,metalness:.6,roughness:.3,flatShading:true}),
    yellow:L({color:0xffd04a,emissive:0x7a5a00,metalness:.5,roughness:.35}),gray:L({color:0x9aa3b0,metalness:.7,roughness:.4}),tank:L({color:0xb3502a,metalness:.6,roughness:.4}),
    rubble:L({color:0x1c1f27,roughness:1,flatShading:true}),glass:L({color:0x9feaff,emissive:0x48c8ff,emissiveIntensity:.55,metalness:.2,roughness:.08}),pad:L({color:0x161d2c,metalness:.6,roughness:.6})}}
function init(){if(ren)return true;if(R3.fail||!window.THREE)return false;T=window.THREE;
  try{cv3=document.createElement('canvas');cv3.id='df3d';cv3.setAttribute('aria-hidden','true');cv3.style.cssText='position:absolute;inset:0;width:100%;height:100%;max-height:none;max-width:none;margin:0;border:0;border-radius:0;box-shadow:none;background:none;display:none;pointer-events:none';dfc.after(cv3);
    ren=new T.WebGLRenderer({canvas:cv3,antialias:true,powerPreference:'high-performance'})}catch(e){R3.fail=true;if(cv3)cv3.remove();btn();return false}
  ren.shadowMap.type=T.PCFSoftShadowMap;ren.outputEncoding=T.sRGBEncoding;ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.15;
  scene=new T.Scene();R3.scene=scene;scene.fog=new T.FogExp2(0x060a1c,.008);cam=new T.PerspectiveCamera(58,1,.05,1400);R3.cam=cam;mats();
  scene.add(new T.HemisphereLight(0x6fa8ff,0x1a1030,.6));
  keyL=new T.DirectionalLight(0xfff1dc,1.5);keyL.shadow.bias=-.0006;keyL.shadow.normalBias=.02;scene.add(keyL,keyL.target);
  const rim=new T.DirectionalLight(0x3f8cff,1);rim.position.set(-70,30,-80);scene.add(rim);
  WHITE=cvTex(4,4,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,4,4)});
  /* bầu trời tinh vân xanh + sao + hành tinh khởi đầu ở phía xa */
  const NEB=cvTex(2048,1024,(x,W,H)=>{x.fillStyle='#03050f';x.fillRect(0,0,W,H);x.globalCompositeOperation='lighter';const cs=['40,110,255','20,190,255','90,60,255','30,80,200','255,120,60'];
    for(let i=0;i<70;i++){const cx=Math.random()*W,cy=H*(.5+(Math.random()-.5)*.8),r=rand(80,420),k=cs[i%13===0?4:i%4],a=rand(.04,.16);for(const ox of[-W,0,W]){const g=x.createRadialGradient(cx+ox,cy,0,cx+ox,cy,r);g.addColorStop(0,`rgba(${k},${a})`);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(cx+ox-r,cy-r,r*2,r*2)}}
    x.globalCompositeOperation='source-over';for(let i=0;i<2600;i++){x.fillStyle=`rgba(255,255,255,${rand(.25,.9)})`;const s=Math.random()<.97?1:2;x.fillRect(Math.random()*W,Math.random()*H,s,s)}},true);
  sky=new T.Mesh(new T.SphereGeometry(600,48,24),new T.MeshBasicMaterial({map:NEB,side:T.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-20;scene.add(sky);
  const GL=glowT();
  {const n=1500,p=new Float32Array(n*3),v=new T.Vector3();for(let i=0;i<n;i++){v.set(rand(-1,1),rand(-.5,1),rand(-1,1)).normalize().multiplyScalar(rand(220,480));p.set([v.x,v.y,v.z],i*3)}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));R3.stars=new T.Points(g,new T.PointsMaterial({size:2.2,sizeAttenuation:false,map:GL,transparent:true,depthWrite:false,fog:false,color:0xcfe3ff}));scene.add(R3.stars)}
  const PLAN=cvTex(1024,512,(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1c4d6b');g.addColorStop(.5,'#2f8f8a');g.addColorStop(1,'#163a5a');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(let i=0;i<140;i++){x.fillStyle=`rgba(${Math.random()<.5?'210,240,255':'15,50,70'},${rand(.05,.2)})`;x.fillRect(0,Math.random()*H,W,rand(4,26))}
    for(let i=0;i<60;i++){const cx=Math.random()*W,cy=Math.random()*H,r=rand(20,90),gg=x.createRadialGradient(cx,cy,0,cx,cy,r);gg.addColorStop(0,'rgba(255,255,255,.32)');gg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gg;x.fillRect(cx-r,cy-r,r*2,r*2)}},true);
  planet=new T.Mesh(new T.SphereGeometry(60,48,32),new T.MeshStandardMaterial({map:PLAN,roughness:1,metalness:0,fog:false}));scene.add(planet);
  atm=new T.Sprite(new T.SpriteMaterial({map:GL,color:0x5fd0ff,transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false,fog:false}));atm.scale.set(176,176,1);scene.add(atm);
  /* bụi không gian gần sân */
  {const g=new T.BufferGeometry(),n=380,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=Math.random();p[i*3+1]=Math.random();p[i*3+2]=Math.random()}g.setAttribute('position',new T.BufferAttribute(p,3));
   dust=new T.Points(g,new T.PointsMaterial({map:GL,color:0x9fc4ff,size:.16,transparent:true,opacity:.45,depthWrite:false,blending:T.AdditiveBlending}));dust.frustumCulled=false;scene.add(dust);dust.userData.base=p.slice()}
  shadowP=new T.Mesh(new T.PlaneGeometry(1,1),new T.ShadowMaterial({opacity:.45}));shadowP.rotation.x=-Math.PI/2;shadowP.position.y=.005;shadowP.receiveShadow=true;scene.add(shadowP);
  border=new T.Group();scene.add(border);baseZ=new T.Group();scene.add(baseZ);R3.ast=new T.Group();scene.add(R3.ast);
  /* tầng hiệu ứng kỹ năng 2D (trong suốt) ngay dưới độ cao thân tàu */
  gTex=new T.CanvasTexture(dfc);gTex.encoding=T.sRGBEncoding;gTex.minFilter=T.LinearFilter;gTex.generateMipmaps=false;
  fxP=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:gTex,transparent:true,depthWrite:false,toneMapped:false,fog:false}));fxP.rotation.x=-Math.PI/2;fxP.position.y=FXY;fxP.renderOrder=6;scene.add(fxP);
  marker=new T.Mesh(new T.RingGeometry(.42,.5,40),new T.MeshBasicMaterial({color:0x4fd8ff,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide,toneMapped:false}));marker.rotation.x=-Math.PI/2;marker.position.y=.06;scene.add(marker);
  FLG=new T.ConeGeometry(1,1,12,1,true);FLG.translate(0,.5,0);FLG.rotateX(Math.PI/2);
  FLM1=new T.MeshBasicMaterial({color:0x48c8ff,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  FLM2=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  SHG=new T.SphereGeometry(1,24,16);
  applyQ();return true}
function rockGeo(r){const g=new T.IcosahedronGeometry(r,1),p=g.attributes.position,v=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const h=Math.abs(Math.sin(v.x*12.9898+v.y*78.233+v.z*37.719)*43758.5453)%1;v.multiplyScalar(.78+.42*h);p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();return g}
/* dựng sân theo kích thước chiến trường: bệ căn cứ, lưới tròn mờ, viền sân sáng, thiên thạch trang trí bên ngoài */
function setWorld(G){R3.gid=G;const Wd=G.wd.Wd,Hd=G.wd.Hd,cx=Wd/2,cz=Hd/2,RR=Math.max(Wd,Hd);
  sky.position.set(cx,0,cz);R3.stars.position.set(cx,0,cz);planet.position.set(cx-260,-40,cz-430);atm.position.copy(planet.position);
  const P=dust.geometry.attributes.position,B=dust.userData.base;for(let i=0;i<P.count;i++)P.setXYZ(i,-4+B[i*3]*(Wd+8),.2+B[i*3+1]*6,-4+B[i*3+2]*(Hd+8));P.needsUpdate=true;
  const clr=g=>{while(g.children.length){const m=g.children.pop();m.geometry&&m.geometry.dispose()}};clr(border);clr(baseZ);clr(R3.ast);
  if(polar){scene.remove(polar);polar.geometry.dispose()}polar=new T.PolarGridHelper(RR*.85,16,8,96,0x2a5cc0,0x16305e);polar.material.transparent=true;polar.material.opacity=.18;polar.position.set(cx,-.2,cz);scene.add(polar);
  /* viền sân: dải sáng trên mặt sàn + tường năng lượng mờ thấp */
  const AD=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,side:T.DoubleSide,depthWrite:false,toneMapped:false});
  [[cx,0,Wd+.25,.25],[cx,Hd,Wd+.25,.25],[0,cz,.25,Hd+.25],[Wd,cz,.25,Hd+.25]].forEach(([x,z,w,d])=>{const m=new T.Mesh(new T.PlaneGeometry(w,d),AD(0x3fb8ff,.22));m.rotation.x=-Math.PI/2;m.position.set(x,-.15,z);border.add(m)});
  const wt=cvTex(8,128,(x)=>{const g=x.createLinearGradient(0,128,0,0);g.addColorStop(0,'rgba(120,210,255,.4)');g.addColorStop(1,'rgba(40,120,255,0)');x.fillStyle=g;x.fillRect(0,0,8,128)});
  [[cx,0,Wd,0],[cx,Hd,Wd,Math.PI],[0,cz,Hd,Math.PI/2],[Wd,cz,Hd,-Math.PI/2]].forEach(([x,z,L,r])=>{const m=new T.Mesh(new T.PlaneGeometry(L,1.1),new T.MeshBasicMaterial({map:wt,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));m.position.set(x,.4,z);m.rotation.y=r;m.renderOrder=4;border.add(m)});
  /* bệ căn cứ: tấm kim loại tối, viền phát sáng */
  const R=G.wd.R;let x0=DFM-.6,z0=DFM-.6,x1=Wd-DFM+.6,z1=Hd-DFM+.6;if(R){x1=DFM+(R.x1-R.x0)+.6;z1=DFM+(R.y1-R.y0)+.6}
  const pw=x1-x0,pd=z1-z0,pad=new T.Mesh(new T.BoxGeometry(pw,.34,pd),MT.pad);pad.position.set((x0+x1)/2,-.17,(z0+z1)/2);pad.receiveShadow=true;baseZ.add(pad);
  [[pw+.08,.08,(x0+x1)/2,z0],[pw+.08,.08,(x0+x1)/2,z1],[.08,pd,x0,(z0+z1)/2],[.08,pd,x1,(z0+z1)/2]].forEach(([w,d,x,z])=>{const e=new T.Mesh(new T.BoxGeometry(w,.08,d),MT.cyan);e.position.set(x,.01,z);baseZ.add(e)});
  shadowP.position.set((x0+x1)/2,.005,(z0+z1)/2);shadowP.scale.set(pw,pd,1);
  /* thiên thạch trôi quanh sân (chỉ trang trí, nằm ngoài viền) */
  const rm=new T.MeshStandardMaterial({color:lin(0x4a403b),roughness:.95,metalness:.05,flatShading:true});R3.rocks=[];
  for(let i=0;i<14;i++){const r=rand(.8,2.5),a=rand(0,TAU),d=RR*rand(.78,1.5);const m=new T.Mesh(rockGeo(r),rm);m.position.set(cx+Math.cos(a)*d,rand(-1,2.5),cz+Math.sin(a)*d);R3.ast.add(m);R3.rocks.push({m,sp:new T.Vector3(rand(-.3,.3),rand(-.3,.3),0)})}
  keyL.target.position.set(cx,0,cz);keyL.position.set(cx+RR*.6,RR*.9,cz+RR*.4);const S2=RR*.85;
  Object.assign(keyL.shadow.camera,{left:-S2,right:S2,top:S2,bottom:-S2,near:1,far:RR*4});keyL.shadow.camera.updateProjectionMatrix();camT=null}
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
function model(src,kind){if(!src)return null;let m=R3.models.get(src);if(m)return m.ready?m:null;m={ready:false};R3.models.set(src,m);R3.queue.push({src,kind,m});return null}
function pump(){const t0=performance.now();let spin=R3.queue.length;while(R3.queue.length&&performance.now()-t0<10&&spin-->0){const j=R3.queue.shift();const im=_dimg(j.src);if(!im){R3.queue.push(j);continue}try{build(j,im)}catch(e){console.error(e);j.m.bad=true}}}
function bSrc(t,v){return t==='hq'?HQIMG:(t==='wall'&&v?BSPR.wallv:(BSPR[t]||SPR[t]))}
/* các công trình có khối 3D dựng sẵn; công trình khác: bệ + khối ép từ ảnh gốc (+ đầu pháo xoay nếu là pháo) */
const PB={hq:'hq',wall:'wall',cannon:'cannon',laser:'laser',bigcannon:'daiphao',crossbow:'nothan',flame:'phunlua',droneb:'nhadrone',crusher:'maytaoda',mine:'mine',pylon:'tesla'};
function collect(G){const L=[];
  const ships=G.en.filter(e=>e.spawn<=G.t&&!e.dead).concat(G.pl.dead?[]:[G.pl]).concat((G.al||[]).filter(a=>!a.dead));
  ships.forEach(e=>{if(!e.sh||!e.sh.img)return;L.push({o:e,k:'s',src:e.sh.img,m:model(e.sh.img,'s')})});
  const addB=(o,t,v,k)=>{const src=bSrc(t,v);if(PB[t])L.push({o,k,t,src:src||('pb:'+t),m:{ready:true,pb:true}});else if(src)L.push({o,k,t,src,m:model(src,'b')})};
  G.bl.forEach(b=>{if(b.hp<=0)return;addB(b,b.t,b.v,'b')});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead||!u.bd)return;addB(u,u.bd.t,u.bd.v,'u')});
  return L.map(i=>{if(i.m&&!i.m.ready)i.m=null;return i})}

/* ---------- công trình dựng khối (theo bản mô phỏng; kích thước theo đúng số ô) ---------- */
function pbuild(tt,w,h){const g=new T.Group(),W=w*.9,D=h*.9;let head=null,muzzle=null,top=1.5*K;const ex={};
  const B=(a,b,c,m)=>{const o=new T.Mesh(new T.BoxGeometry(a,b,c),m);o.castShadow=o.receiveShadow=true;return o},C=(a,b,hh,s,m)=>{const o=new T.Mesh(new T.CylinderGeometry(a,b,hh,s),m);o.castShadow=o.receiveShadow=true;return o};
  if(!['mine','tesla','wall','hq'].includes(tt)){const sl=B(W,.8*K,D,MT.dark);sl.position.y=.4*K;g.add(sl);for(const cx of[-1,1])for(const cz of[-1,1]){const l=B(.25*K,.12*K,.25*K,MT.cyan);l.position.set(cx*(W/2-.25*K),.86*K,cz*(D/2-.25*K));g.add(l)}}
  const ped=(r,hh)=>{const p=C(r*K,r*1.25*K,hh*K,10,MT.metal);p.position.y=(.8+hh/2)*K;g.add(p);return .8+hh};
  const mkHead=y=>{head=new T.Group();head.position.y=y*K;head.rotation.order='YXZ';g.add(head);return head};
  switch(tt){
    case 'hq':{const f=Math.min(w,h)/4;const b=C(4.3*K*f,4.7*K*f,1.2*K,6,MT.dark);b.position.y=.6*K;g.add(b);const t2=C(3.2*K*f,3.7*K*f,1.1*K,6,MT.metal);t2.position.y=1.7*K;g.add(t2);
      const tw=C(1.2*K*f,1.8*K*f,4.2*K,8,MT.metal);tw.position.y=4.2*K;g.add(tw);const cap=new T.Mesh(new T.SphereGeometry(1.35*K*f,20,14),MT.cyan);cap.position.y=6.8*K;g.add(cap);
      ex.ring=new T.Mesh(new T.TorusGeometry(3*K*f,.14*K,8,64),MT.cyan);ex.ring.rotation.x=Math.PI/2;ex.ring.position.y=4.8*K;g.add(ex.ring);
      for(let i=0;i<6;i++){const a=i/6*TAU+Math.PI/6,l=B(.9*K,.25*K,.25*K,MT.cyan);l.position.set(Math.cos(a)*4.4*K*f,1.25*K,Math.sin(a)*4.4*K*f);l.rotation.y=-a;g.add(l)}
      const lamp=new T.PointLight(0x4fd6ff,1.6,12,2);lamp.position.y=7.5*K;g.add(lamp);
      ex.shield=new T.Mesh(new T.SphereGeometry(7.4*K*f,40,20,0,TAU,0,Math.PI/2),new T.MeshBasicMaterial({color:0x4fd6ff,transparent:true,opacity:.07,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));g.add(ex.shield);
      g.add(new T.Mesh(ex.shield.geometry,new T.MeshBasicMaterial({color:0x4fd6ff,wireframe:true,transparent:true,opacity:.06,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false})));top=7.5*K;break}
    case 'wall':{const ww=w*.92,dd=h*.92,o=B(ww,2.2*K,dd,MT.metal);o.position.y=1.1*K;g.add(o);const st=B(ww+.02,.14*K,dd-.12,MT.cyan);st.position.y=2.25*K;g.add(st);top=2.3*K;break}
    case 'cannon':{const y=ped(1.1,.7);const hd=mkHead(y+.4);hd.add(B(1.4*K,.8*K,1.4*K,MT.metal));const b=C(.22*K,.22*K,2.2*K,10,MT.dark);b.rotation.x=Math.PI/2;b.position.z=-1.4*K;hd.add(b);const tp=B(.32*K,.32*K,.32*K,MT.orange);tp.position.z=-2.5*K;hd.add(tp);muzzle=-2.7*K;top=(y+.9)*K;break}
    case 'laser':{const y=ped(1,.7);const hd=mkHead(y+.35);hd.add(B(1.1*K,.6*K,1.1*K,MT.metal));const cr=new T.Mesh(new T.OctahedronGeometry(.55*K),MT.cyan);cr.position.y=.75*K;hd.add(cr);ex.crystal=cr;const b=C(.1*K,.1*K,1.8*K,8,MT.dark);b.rotation.x=Math.PI/2;b.position.z=-1.1*K;hd.add(b);muzzle=-2.05*K;top=(y+1.4)*K;break}
    case 'daiphao':{const y=ped(1.4,.9);const hd=mkHead(y+.55);hd.add(B(1.9*K,1.1*K,1.9*K,MT.metal));const b=C(.45*K,.52*K,2.4*K,12,MT.dark);b.rotation.x=Math.PI/2;b.position.z=-1.6*K;hd.add(b);const r=new T.Mesh(new T.TorusGeometry(.5*K,.1*K,6,20),MT.orange);r.position.z=-2.8*K;hd.add(r);muzzle=-3*K;top=(y+1.2)*K;break}
    case 'nothan':{const y=ped(1.2,.8);const hd=mkHead(y+.35);hd.add(B(1*K,.5*K,2.6*K,MT.metal));const bow=B(3.6*K,.18*K,.3*K,MT.orange);bow.position.set(0,.3*K,-1*K);hd.add(bow);for(const sx of[-1,1]){const tip=B(.3*K,.5*K,.3*K,MT.metal);tip.position.set(sx*1.8*K,.3*K,-.8*K);hd.add(tip)}const rail=B(.2*K,.2*K,2.8*K,MT.dark);rail.position.y=.4*K;hd.add(rail);muzzle=-1.6*K;top=(y+1)*K;break}
    case 'phunlua':{for(const sx of[-1.15,1.15]){const tk=C(.7*K,.7*K,2.2*K,12,MT.tank);tk.position.set(sx*K,1.9*K,1.2*K);g.add(tk);const cp=new T.Mesh(new T.SphereGeometry(.7*K,12,8,0,TAU,0,Math.PI/2),MT.tank);cp.position.set(sx*K,3*K,1.2*K);g.add(cp)}
      const y=ped(.9,.5);const hd=mkHead(y+.3);hd.add(B(1.1*K,.7*K,1.1*K,MT.metal));const nz=C(.22*K,.45*K,1.6*K,10,MT.dark);nz.rotation.x=-Math.PI/2;nz.position.z=-1.2*K;hd.add(nz);muzzle=-2.1*K;top=3.4*K;break}
    case 'nhadrone':{const d=new T.Mesh(new T.SphereGeometry(2*K,20,12,0,TAU,0,Math.PI/2),MT.metal);d.position.y=.8*K;d.castShadow=true;g.add(d);const r=new T.Mesh(new T.TorusGeometry(2.7*K,.12*K,6,48),MT.green);r.rotation.x=Math.PI/2;r.position.y=.9*K;g.add(r);const l=new T.Mesh(new T.SphereGeometry(.4*K,12,8),MT.green);l.position.y=2.9*K;g.add(l);
      ex.drones=[0,1].map(i=>{const dg=new T.Group();dg.add(new T.Mesh(new T.SphereGeometry(.35*K,12,8),MT.metal));const rr=new T.Mesh(new T.TorusGeometry(.5*K,.05*K,6,20),MT.green);rr.rotation.x=Math.PI/2;dg.add(rr);const gl=new T.Sprite(new T.SpriteMaterial({map:glowT(),color:0x5dffa1,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));gl.scale.set(1.6*K,1.6*K,1);dg.add(gl);g.add(dg);return dg});top=3*K;break}
    case 'maytaoda':{ex.crystals=new T.Group();ex.crystals.position.y=.8*K;g.add(ex.crystals);for(let i=0;i<5;i++){const c=new T.Mesh(new T.ConeGeometry(.45*K,rand(1.4,2.4)*K,5),MT.violet);const a=i/5*TAU;c.position.set(Math.cos(a)*.7*K*(i?1:0),.9*K,Math.sin(a)*.7*K*(i?1:0));c.rotation.set(rand(-.3,.3),0,rand(-.3,.3));c.castShadow=true;ex.crystals.add(c)}top=2.8*K;break}
    case 'mine':{g.add(C(.9*K,1*K,.4*K,12,MT.dark));g.add(C(.35*K,.35*K,.46*K,12,MT.red));top=.5*K;ex.sink=.7*K;break}
    case 'tesla':{const b=C(.7*K,.9*K,.6*K,10,MT.dark);b.position.y=.3*K;g.add(b);const c=C(.35*K,.35*K,2.6*K,10,MT.metal);c.position.y=1.9*K;g.add(c);for(const y of[1.2,2,2.8]){const r=new T.Mesh(new T.TorusGeometry(.55*K,.08*K,6,20),MT.cyan);r.rotation.x=Math.PI/2;r.position.y=y*K;g.add(r)}const ball=new T.Mesh(new T.SphereGeometry(.45*K,14,10),MT.cyan);ball.position.y=3.4*K;g.add(ball);top=3.7*K;ex.sink=3.7*K;break}}
  return {g,head,muzzle,top,ex}}

/* ---------- tàu: thân ép từ ảnh gốc + mô-đun nổi theo màu ô ---------- */
function modsFor(e){if(e.__m3)return e.__m3;const sh=e.sh,L=[];
  const add=(def,ax,ay,rot,k)=>{if(!def||ax==null)return;const rw=rot?def.h:def.w,rh=rot?def.w:def.h;L.push({cx:(sh.x0+56*(ax+rw/2))/sh.W,cy:(sh.y0+56*(ay+rh/2))/sh.H,w:rw*56/sh.W,h:rh*56/sh.H,k})};
  if(e.team==='p'&&!e.ghost&&typeof khWpMap==='function'&&KSH.some(x=>x.id===sh.id)){try{const wm=khWpMap(sh);Object.keys(wm).forEach(i=>wm[i].forEach(it=>add(wpGet(it.id),it.ax,it.ay,it.rot,'w')));
    const F={a:typeof khArmor==='function'&&khArmor,e:typeof khEngines==='function'&&khEngines,n:typeof khReactors==='function'&&khReactors,t:typeof khTanks==='function'&&khTanks,m:typeof khMassMods==='function'&&khMassMods,k:typeof khSkills==='function'&&khSkills};
    Object.keys(F).forEach(k=>{if(F[k])(F[k](sh)||[]).forEach(it=>add(wpGet(it.id),it.ax,it.ay,it.rot,k))})}catch(er){}}
  if(!L.some(m=>m.k==='w')&&e.ws&&e.sc)e.ws.forEach(x=>{const w=x.w;if(!w||x.mx==null)return;L.push({cx:(x.mx/e.sc+sh.W/2)/sh.W,cy:(x.my/e.sc+sh.H/2)/sh.H,w:(w.w||1)*56/sh.W,h:(w.h||1)*56/sh.H,k:'w'})});
  return e.__m3=L}
function coreUV(sh){if(sh.__core!==undefined)return sh.__core;let n=0,x=0,y=0;(sh.g||[]).forEach((row,j)=>[...row].forEach((c,i)=>{if(c==='g'){n++;x+=sh.x0+56*(i+.5);y+=sh.y0+56*(j+.5)}}));return sh.__core=n?{u:x/n/sh.W,v:y/n/sh.H}:null}
const hAt=(m,u,v)=>m.hs?m.hs[Math.max(0,Math.min(m.NY-1,Math.round(v*(m.NY-1))))*m.NX+Math.max(0,Math.min(m.NX-1,Math.round(u*(m.NX-1))))]||0:.5;
function engine(U,x,y,z,r,yellow){const b=U.body;if(yellow){const eg=new T.CylinderGeometry(r*.75,r,r*2.4,10);eg.rotateX(Math.PI/2);const e=new T.Mesh(eg,MT.yellow);e.position.set(x,y,z);e.castShadow=true;b.add(e);z+=r*1.2}
  const fa=new T.Mesh(FLG,FLM1),fb=new T.Mesh(FLG,FLM2),gl=new T.Sprite(new T.SpriteMaterial({map:glowT(),color:0x48c8ff,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));fa.position.set(x,y,z);fb.position.copy(fa.position);gl.position.set(x,y,z+r*.4);b.add(fa,fb,gl);U.fl.push({a:fa,b:fb,g:gl,r})}
function mkShip(it,g,U){const o=it.o,m=it.m,ww=o.sh.W*o.sc,hh=o.sh.H*o.sc,hy=.26*Math.sqrt(ww*hh),body=U.body;U.ww=ww;U.hh=hh;U.hy=hy;
  const hull=U.hull;hull.scale.set(ww,hy,hh);const bot=new T.Mesh(m.geo,m.matB);bot.customDepthMaterial=m.depth;bot.castShadow=true;bot.scale.set(ww,-hy*.65,hh);body.add(bot);
  const top=(u,v)=>hAt(m,u,v)*hy,P=(u,v)=>[(u-.5)*ww,(v-.5)*hh],mods=modsFor(o),mn=Math.min(ww,hh);
  /* buồng lái kính */
  {const cu=coreUV(o.sh),u=.5,v=cu?Math.max(.18,cu.v-.22):.32,[x,z]=P(u,v);const cg=new T.SphereGeometry(mn*.09,16,12);cg.scale(1,.62,1.7);const c=new T.Mesh(cg,MT.glass);c.position.set(x,top(u,v)+mn*.03,z);body.add(c)}
  let eng=0;
  mods.forEach(x=>{const mw=x.w*ww,md=x.h*hh,s=Math.min(mw,md),[px,pz]=P(x.cx,x.cy),y=top(x.cx,x.cy);
    if(x.k==='w'){const n=mw>md*.9?2:1;const pod=new T.Mesh(new T.BoxGeometry(mw*.55,s*.28,md*.75),MT.red);pod.position.set(px,y+s*.14,pz);pod.castShadow=true;body.add(pod);
      for(let i=0;i<n;i++){const ox=n>1?(i?1:-1)*mw*.18:0,br=new T.Mesh(new T.CylinderGeometry(s*.07,s*.07,md*.8,8),MT.dark);br.rotation.x=Math.PI/2;br.position.set(px+ox,y+s*.16,pz-md*.55);body.add(br)}}
    else if(x.k==='a'){const pl=new T.Mesh(new T.BoxGeometry(mw*.9,s*.12,md*.85),MT.blue);pl.position.set(px,y+s*.06,pz);pl.castShadow=true;body.add(pl)}
    else if(x.k==='e'){eng++;engine(U,px,y+s*.18,pz,s*.32,true)}
    else if(x.k==='t'){const tk=new T.Mesh(new T.CylinderGeometry(s*.28,s*.28,md*.85,10),MT.gray);tk.rotation.x=Math.PI/2;tk.position.set(px,y+s*.28,pz);tk.castShadow=true;body.add(tk)}
    else{const c=new T.Mesh(new T.SphereGeometry(s*.34,16,12),MT.green.clone());c.position.set(px,y+s*.2,pz);body.add(c);(U.cores=U.cores||[]).push(c.material)}});
  if(!eng)(m.noz||[]).forEach(n=>{const [x,z]=P(n.u,n.v);engine(U,x,top(n.u,Math.max(0,n.v-.06))*.6,z,Math.max(.05,n.r*ww),false)});
  if(!eng&&!(m.noz||[]).length)[-.18,.18].forEach(dx=>engine(U,dx*ww,hy*.3,hh*.47,mn*.07,false));
  if(!U.cores){const cu=coreUV(o.sh);if(cu){const [x,z]=P(cu.u,cu.v);const c=new T.Mesh(new T.SphereGeometry(mn*.07,14,10),MT.green.clone());c.position.set(x,top(cu.u,cu.v)+mn*.02,z);body.add(c);U.cores=[c.material]}}
  const sh=new T.Mesh(SHG,new T.MeshBasicMaterial({color:0x5fa8ff,transparent:true,opacity:.08,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));sh.scale.set(ww*.66,hy*2.6+.3,hh*.66);sh.visible=false;g.add(sh);U.shield=sh}
function mkInst(it){const g=new T.Group(),body=new T.Group();g.add(body);const U=g.userData={src:it.src,ph:Math.random()*6,body,fl:[],born:t3,k:it.k,o:it.o};
  if(it.k==='s'){const m=it.m;U.model=m;const hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;body.add(hull);U.hull=hull;mkShip(it,g,U)}
  else if(it.m.pb){const tt=PB[it.t],P=pbuild(tt,it.o.w,it.o.h);body.add(P.g);U.pb=P;U.tt=tt;U.top=P.top}
  else{const m=it.m,o=it.o;U.model=m;const sl=new T.Mesh(new T.BoxGeometry(o.w*.92,.33,o.h*.92),MT.dark);sl.position.y=.165;sl.castShadow=sl.receiveShadow=true;body.add(sl);
    for(const cx of[-1,1])for(const cz of[-1,1]){const l=new T.Mesh(new T.BoxGeometry(.1,.05,.1),MT.cyan);l.position.set(cx*(o.w*.46-.1),.35,cz*(o.h*.46-.1));body.add(l)}
    const hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;const hy=.2*Math.sqrt(o.w*o.h);hull.scale.set(o.w*.88,hy,o.h*.88);hull.position.y=.33;body.add(hull);U.hull=hull;U.top=.33+hy*1.1;
    const sp=o.spec||(o.u&&o.u.ws&&o.u.ws.length);if(sp&&Math.abs(o.w-o.h)<.01){const hd=new T.Group();hd.position.y=U.top;const s=Math.min(o.w,o.h)*.5;const bx=new T.Mesh(new T.BoxGeometry(s*.55,s*.3,s*.55),MT.metal);bx.castShadow=true;hd.add(bx);const br=new T.Mesh(new T.CylinderGeometry(s*.07,s*.07,s*.8,8),MT.dark);br.rotation.x=Math.PI/2;br.position.z=-s*.5;hd.add(br);body.add(hd);U.head=hd;U.muz=-s*.9;U.top+=s*.2}}
  scene.add(g);return g}
function drop(g){scene.remove(g);const U=g.userData;if(U.hull)U.hull.material.dispose();if(U.shield)U.shield.material.dispose();if(U.pb)U.pb.g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
/* đầu pháo tự xoay về phía địch gần nhất */
function aimHead(U,b,G,dt,isU){const L=isU?[G.pl].concat(G.al||[]):G.en;let bd=(b.spec&&b.spec.rng)||(isU&&b.ws&&b.ws[0]&&b.ws[0].rng)||10,tg=null;bd+=1;
  L.forEach(e=>{if(!e||e.dead||(e.spawn!=null&&e.spawn>G.t))return;const d=Math.hypot(e.x-b.x,e.y-b.y);if(d<bd){bd=d;tg=e}});
  const hd=U.pb?U.pb.head:U.head;if(!hd)return null;if(tg){const want=Math.atan2(-(tg.x-b.x),-(tg.y-b.y));hd.rotation.y+=angDiff(hd.rotation.y,want)*Math.min(1,dt*6)}return tg}

/* ---------- camera bám sát phía sau tàu chính ---------- */
function camFollow(G,dt){const P=G.pl,dead=P.dead,f=dead?{x:G.hq.x,y:G.hq.y}:P;
  const mv=Math.hypot(P.vx||0,P.vy||0);if(!dead&&(mv>.6||R3.joy.id!==null)){const want=Math.atan2(-(P.vx||0),-(P.vy||0));if(mv>.3)R3.yaw+=angDiff(R3.yaw,want)*Math.min(1,dt*1.5)}
  const a=R3.yaw,D=R3.cd,fy=dead?1:HOV,cp=new T.Vector3(f.x+Math.sin(a)*D,fy+D*.62,f.y+Math.cos(a)*D),lk=new T.Vector3(f.x-Math.sin(a)*3.75,fy,f.y-Math.cos(a)*3.75);
  if(!camT||camT.g!==R3.gid){camT={g:R3.gid,p:cp.clone(),l:lk.clone()}}camT.p.lerp(cp,1-Math.exp(-dt*4.5));camT.l.lerp(lk,1-Math.exp(-dt*6));
  cam.position.copy(camT.p);if(R3.shake>.001&&SET().shake!==false){cam.position.x+=rand(-1,1)*R3.shake;cam.position.y+=rand(-1,1)*R3.shake;R3.shake*=Math.exp(-dt*7)}cam.lookAt(camT.l);
  const w=dfV.w,h=dfV.h;cam.aspect=w/h;cam.fov=w<h?74:58;cam.updateProjectionMatrix();
  fxP.position.set((dwx(0)+dwx(w))/2,FXY,(dwy(0)+dwy(h))/2);fxP.scale.set(dwx(w)-dwx(0),dwy(h)-dwy(0),1)}
/* cần lái ảo: đặt ngón tay ở nửa trái màn hình rồi kéo (giống bản mô phỏng); chạm phần còn lại để bay tới điểm chạm */
let stick=null,knob=null;
function joyEl(){if(stick)return;stick=document.createElement('div');stick.id='df3stick';stick.style.cssText='position:fixed;z-index:7;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;border:2px solid rgba(79,214,255,.45);background:rgba(79,214,255,.07);pointer-events:none;display:none';
  knob=document.createElement('div');knob.style.cssText='position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:rgba(79,214,255,.45);box-shadow:0 0 18px rgba(79,214,255,.6)';stick.appendChild(knob);document.body.appendChild(stick)}
addEventListener('pointerdown',e=>{if(!R3.live||e.target!==dfc||R3.joy.id!==null||e.clientX>innerWidth*.45)return;joyEl();const J=R3.joy;J.id=e.pointerId;J.ox=e.clientX;J.oy=e.clientY;J.x=J.y=0;stick.style.left=e.clientX+'px';stick.style.top=e.clientY+'px';stick.style.display='block';knob.style.transform='';try{dfc.setPointerCapture(e.pointerId)}catch(er){}e.stopImmediatePropagation();e.preventDefault()},true);
addEventListener('pointermove',e=>{const J=R3.joy;if(e.pointerId!==J.id)return;let dx=e.clientX-J.ox,dy=e.clientY-J.oy;const l=Math.hypot(dx,dy),m=56;if(l>m){dx*=m/l;dy*=m/l}J.x=dx/m;J.y=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`;e.stopImmediatePropagation()},true);
const endJoy=e=>{const J=R3.joy;if(e.pointerId!==J.id)return;J.id=null;J.x=J.y=0;if(stick)stick.style.display='none';try{const P=DG&&DG.pl;if(P){P.tx=P.x;P.ty=P.y}}catch(er){}e.stopImmediatePropagation()};
addEventListener('pointerup',endJoy,true);addEventListener('pointercancel',endJoy,true);
function joyStep(G){const J=R3.joy,P=G.pl;if(J.id===null||P.dead)return;const il=Math.hypot(J.x,J.y);if(il<.12){P.tx=P.x;P.ty=P.y;return}
  const a=R3.yaw,fx=-Math.sin(a),fz=-Math.cos(a),rx=Math.cos(a),rz=-Math.sin(a),dx=fx*-J.y+rx*J.x,dz=fz*-J.y+rz*J.x,s=4*Math.min(1,il);
  P.tx=clamp(P.x+dx*s,.5,G.wd.Wd-.5);P.ty=clamp(P.y+dz*s,.5,G.wd.Hd-.5)}
/* chạm trên màn hình 3D → đổi về đúng ô trên chiến trường */
function remap(e){if(!R3.live||e.target!==dfc||!cam)return;const r=dfc.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1);
  const rc=new T.Raycaster();rc.setFromCamera({x:nx,y:ny},cam);const p=new T.Vector3();if(!rc.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p))p.set(DG.pl.x-Math.sin(R3.yaw)*40,0,DG.pl.y-Math.cos(R3.yaw)*40);
  const cx=r.left+dsx(p.x)*r.width/dfV.w,cy=r.top+dsy(p.z)*r.height/dfV.h;try{Object.defineProperty(e,'clientX',{value:cx});Object.defineProperty(e,'clientY',{value:cy})}catch(er){}}
['pointerdown','pointermove','pointerup','click','mousedown','mousemove','mouseup','dblclick','contextmenu'].forEach(t=>addEventListener(t,remap,true));
/* phím W A S D / mũi tên đi theo hướng camera */
const KM={};const AX=[[0,-1,'w','ArrowUp'],[0,1,'s','ArrowDown'],[1,0,'d','ArrowRight'],[-1,0,'a','ArrowLeft']];
function keyMap(e){if(!R3.live)return;const k=e.key.length===1?e.key.toLowerCase():e.key,dirs={w:[0,1],arrowup:[0,1],s:[0,-1],arrowdown:[0,-1],d:[1,0],arrowright:[1,0],a:[-1,0],arrowleft:[-1,0]},d=dirs[k.toLowerCase()];if(!d)return;
  let out;if(e.type==='keydown'||!KM[e.code]){const f=[-Math.sin(R3.yaw),-Math.cos(R3.yaw)],r=[Math.cos(R3.yaw),-Math.sin(R3.yaw)],v=[f[0]*d[1]+r[0]*d[0],f[1]*d[1]+r[1]*d[0]];let best=AX[0],bd=-9;AX.forEach(a=>{const dd=a[0]*v[0]+a[1]*v[1];if(dd>bd){bd=dd;best=a}});out=k.toLowerCase().startsWith('arrow')?best[3]:best[2];KM[e.code]=out}else out=KM[e.code];
  if(e.type==='keyup')delete KM[e.code];try{Object.defineProperty(e,'key',{value:out})}catch(er){}}
addEventListener('keydown',keyMap,true);addEventListener('keyup',keyMap,true);
addEventListener('click',e=>{if(!R3.live)return;const b=e.target&&e.target.closest&&e.target.closest('#dfzi,#dfzo');if(!b)return;e.stopPropagation();e.preventDefault();R3.cd=b.id==='dfzi'?Math.max(4.2,R3.cd-1.25):Math.min(20,R3.cd+1.25)},true);

/* ---------- giao diện trận kiểu mới (chỉ khi xem 3D) ---------- */
{const st=document.createElement('style');st.textContent=`
#def.r3 .dfh{display:block;top:calc(10px + env(safe-area-inset-top,0px));left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));font-family:'Chakra Petch',system-ui,sans-serif}
#def.r3 #dfexit{position:absolute;left:0;top:0;width:auto;height:30px;padding:0 10px;border-radius:6px;font:600 12px 'Chakra Petch',system-ui,sans-serif;background:rgba(8,16,36,.76);border:1px solid rgba(90,150,255,.28)}
#def.r3 #dfexit::after{content:' Về sảnh'}
#def.r3 .dfc2{position:absolute;left:0;top:38px;display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left}
#def.r3 .dfc2 b{font-size:11px;letter-spacing:.12em;color:#4fd6ff;text-transform:uppercase}
#def.r3 .dfc2 span{font-size:18px;font-weight:700;text-shadow:0 0 12px rgba(79,214,255,.4)}
#def.r3 .dfbt{position:absolute;left:0;top:92px;display:flex;gap:5px;flex-wrap:wrap;max-width:44vw}
#def.r3 .dfbt .dfb{width:auto;min-width:34px;height:30px;padding:0 9px;border-radius:6px;font:600 12px 'Chakra Petch',system-ui,sans-serif;background:rgba(8,16,36,.76);border:1px solid rgba(90,150,255,.28)}
#def.r3 .dfbars{position:absolute;left:50%;top:0;transform:translateX(-50%);width:min(400px,40vw);max-width:none;gap:5px}
#def.r3.pv .dfbars{top:54px}
#def.r3 .dfbw span{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#cfe0ff}
#def.r3 .dfbar{height:9px;transform:skewX(-18deg);border-radius:2px;background:rgba(10,20,45,.85);border:1px solid rgba(90,150,255,.28)}
#def.r3 #dfsk{left:auto;right:max(16px,env(safe-area-inset-right,0px));transform:none;display:grid;grid-template-columns:repeat(2,64px);gap:8px;bottom:calc(16px + env(safe-area-inset-bottom,0px))}
#def.r3 .dfk{width:64px;height:64px;border-radius:50%;padding:8px}
#def.r3 .dfhint{display:none}
#df3boss{display:none}#def.r3 #df3boss.on{display:block}#df3boss span{color:#ff4d5e!important}#df3boss i{display:block;height:100%;background:linear-gradient(90deg,#b0213a,#ff4d5e)}
@media (max-width:700px){#def.r3 .dfbars{left:150px;right:104px;transform:none;width:auto}#def.r3 .dfbw span{font-size:9px}#def.r3 .dfk{width:54px;height:54px}#def.r3 #dfsk{grid-template-columns:repeat(2,54px)}}`;document.head.appendChild(st)}
function hud(G,on){const d=document.getElementById('def');if(!d)return;d.classList.toggle('r3',on);d.classList.toggle('pv',!!(on&&G&&G.pvp));if(!on)return;
  let bb=document.getElementById('df3boss');if(!bb){const bars=d.querySelector('.dfbars');if(bars){bb=document.createElement('div');bb.id='df3boss';bb.className='dfbw';bb.innerHTML='<span><b></b><em></em></span><div class="dfbar"><i></i></div>';bars.appendChild(bb)}}
  if(bb){const B=G.en.find(e=>e.boss&&!e.dead&&e.spawn<=G.t);bb.classList.toggle('on',!!B);if(B){bb.querySelector('b').textContent='BOSS '+(B.sh&&B.sh.n||'');bb.querySelector('em').textContent=Math.max(0,Math.ceil(B.hp/B.max*100))+'%';bb.querySelector('i').style.width=Math.max(0,B.hp/B.max*100)+'%'}}}
/* ---------- kho đối tượng dùng lại ---------- */
let GLOWT=null;function glowT(){if(GLOWT)return GLOWT;return GLOWT=cvTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.22,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)})}
function Pool(mk){const a=[];let n=0;return{get(){let o=a[n];if(!o){o=mk();a.push(o)}n++;o.visible=true;return o},end(){for(let i=n;i<a.length;i++)a[i].visible=false;n=0}}}
const ADDM=(map)=>new T.SpriteMaterial({map,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
let BUL,BC,BG,XS,XB,BAR,MS,RG,BMS={};
function pools(){if(BUL)return;
  /* đạn vạch sáng: thanh dài + quầng sáng (như bản mô phỏng) */
  const bg=new T.BoxGeometry(.085,.085,.85);
  BUL=Pool(()=>{const m=new T.Mesh(bg,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));const gl=new T.Sprite(ADDM(glowT()));gl.scale.set(.7,.7,1);m.add(gl);m.userData.gl=gl;scene.add(m);return m});
  const cyl=new T.CylinderGeometry(1,1,1,10,1,true);const bm=()=>{const m=new T.Mesh(cyl,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));m.frustumCulled=false;scene.add(m);return m};BC=Pool(bm);BG=Pool(bm);
  const sph=new T.SphereGeometry(1,20,12);XB=Pool(()=>{const m=new T.Mesh(sph,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m});
  XS=Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s});
  BAR=Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s});
  const mb=new T.CylinderGeometry(.054,.054,.375,8);mb.rotateX(Math.PI/2);const mc=new T.ConeGeometry(.054,.15,8);mc.rotateX(-Math.PI/2);mc.translate(0,0,-.26);
  MS=Pool(()=>{const g=new T.Group(),a=new T.Mesh(mb,MT.gray),b=new T.Mesh(mc,MT.red),f=new T.Sprite(ADDM(glowT()));f.material.color.set(0xff7a3c);f.position.z=.21;f.scale.set(.66,.66,1);g.add(a,b,f);scene.add(g);return g});
  const rg=new T.RingGeometry(.7,1,48);RG=Pool(()=>{const m=new T.Mesh(rg,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.rotation.x=-Math.PI/2;scene.add(m);return m})}
function bar(x,y,z,w,f,c,o,th){if(f<=0)return;const s=BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),th||.14,1);s.material.color.copy(col(c));s.material.opacity=o==null?1:o}
function beam(pool,a,b,r,c,o){const m=pool.get(),d=new T.Vector3().subVectors(b,a),L=d.length()||.001;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));m.scale.set(r,L,r);m.material.color.copy(col(c));m.material.opacity=o}
/* ---------- nổ xanh dương + cam, khói, mảnh vỡ, chớp sáng ---------- */
const parts=[],smokes=[],chunks=[],rings=[];let seenFx=new WeakSet(),flashL=null;
const freeP=[],freeS=[];
function partSpr(add){const s=new T.Sprite(add?ADDM(glowT()):new T.SpriteMaterial({map:glowT(),transparent:true,depthWrite:false,color:0x8a8f99}));scene.add(s);return s}
function spark(x,y,z,vx,vy,vz,c,life,sz){if(parts.length>=CAP.part[R3.q]||SET().part===false)return;const s=freeP.pop()||partSpr(true);s.visible=true;s.material.color.copy(col(c));s.position.set(x,y,z);parts.push({s,vx,vy,vz,life,max:life,sz})}
function smoke(x,y,z,life,sz){if(smokes.length>=CAP.part[R3.q]*.6||SET().part===false)return;const s=freeS.pop()||partSpr(false);s.visible=true;s.position.set(x,y,z);smokes.push({s,life,max:life,sz,vy:rand(.12,.4)})}
function flash(x,y,z,c,I){if(SET().light===false||R3.q===0)return;if(!flashL){flashL=new T.PointLight(0xffa855,0,30,2);scene.add(flashL)}if(I<flashL.intensity)return;flashL.color.copy(col(c));flashL.position.set(x,y,z);flashL.intensity=I}
const PAL=[['#4fadff','#ff8c26','#fff2d9'],['#4df2ff','#ffffff','#4db3ff']];
function boom(x,y,z,s,blue){s=Math.min(1.6,s);const n=Math.round([16,26,40][R3.q]*Math.min(1.6,.5+s)),cs=PAL[blue?1:0];
  for(let i=0;i<n;i++){const v=new T.Vector3(rand(-1,1),rand(-.5,1),rand(-1,1)).normalize().multiplyScalar(rand(1.7,8.3)*s);spark(x,y,z,v.x,v.y,v.z,cs[i%5===0?2:i%2],.75+.35*s*rand(.6,1),.62*s*rand(.7,1.2))}
  rings.push({x,y,z,r:3.2*s,t:0,max:.6+.3*s,c:blue?'#4fd6ff':'#ff9a3c'});
  const X=freeC.pop()||(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s})();X.visible=true;X.position.set(x,y,z);X.material.color.copy(col(blue?'#4fd6ff':'#ffc070'));bcores.push({s:X,t:0,max:.6,sz:s});
  flash(x,y,z,blue?'#4fd6ff':'#ffa855',5*s);if(s>.5)R3.shake+=s*.33/(1+cam.position.distanceTo(new T.Vector3(x,y,z))/12.5);
  for(let i=0;i<Math.min(6,s*4);i++)smoke(x+rand(-.4,.4)*s,y,z+rand(-.4,.4)*s,rand(.7,1.1),.6*s)}
const booms=[],bcores=[],freeC=[];
function debris(g,b){const m=g.userData.model,ww=b.w,hh=b.h,n=Math.min(18,Math.round(5+Math.max(ww,hh)*3));
  for(let i=0;i<n;i++){const s=rand(.1,.29)*(.6+Math.max(ww,hh)*.3),c=new T.Mesh(new T.BoxGeometry(s,s*rand(.5,1),s),m?m.mat:(Math.random()<.5?MT.rubble:MT.metal));c.castShadow=true;c.position.set(b.x+rand(-1,1)*ww*.4,rand(.2,.8),b.y+rand(-1,1)*hh*.4);scene.add(c);
    chunks.push({m:c,vx:rand(-3.3,3.3),vy:rand(2.5,5.8),vz:rand(-3.3,3.3),rx:rand(-6,6),rz:rand(-6,6),t:0})}
  const sz=Math.max(ww,hh);boom(b.x,.6,b.y,.8+sz*.35,false);
  if(b.t!=='mine'){const r=new T.Mesh(new T.CylinderGeometry(sz*.4,sz*.5,.15,7),MT.rubble);r.position.set(b.x,.07,b.y);scene.add(r);chunks.push({m:r,rest:1,t:0,vx:0,vy:0,vz:0,rx:0,rz:0,life:30})}}
function stepFx(dt){
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;if(p.life<=0){p.s.visible=false;freeP.push(p.s);parts.splice(i,1);continue}const dmp=Math.pow(.06,dt);p.vx*=dmp;p.vy*=dmp;p.vz*=dmp;p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;p.s.position.z+=p.vz*dt;const k=1-p.life/p.max;p.s.scale.setScalar(p.sz*(1+k*.8));p.s.material.opacity=1-k}
  for(let i=smokes.length-1;i>=0;i--){const p=smokes[i];p.life-=dt;if(p.life<=0){p.s.visible=false;freeS.push(p.s);smokes.splice(i,1);continue}const k=1-p.life/p.max;p.s.position.y+=p.vy*dt;p.s.scale.setScalar(p.sz*(1+2.2*k));p.s.material.opacity=.55*(1-k)}
  for(let i=chunks.length-1;i>=0;i--){const c=chunks[i];c.t+=dt;const m=c.m;
    if(c.rest){if(c.t>c.life){scene.remove(m);m.geometry.dispose();chunks.splice(i,1)}continue}
    c.vy-=12.5*dt;m.position.x+=c.vx*dt;m.position.y+=c.vy*dt;m.position.z+=c.vz*dt;m.rotation.x+=c.rx*dt;m.rotation.z+=c.rz*dt;
    if(m.position.y<.06){m.position.y=.06;c.vy*=-.3;c.vx*=.6;c.vz*=.6;c.rx*=.5;c.rz*=.5}
    if(c.t>3){m.scale.multiplyScalar(.97);if(c.t>3.8){scene.remove(m);m.geometry.dispose();chunks.splice(i,1)}}}
  if(flashL)flashL.intensity*=Math.pow(.02,dt);
  for(let i=bcores.length-1;i>=0;i--){const c=bcores[i];c.t+=dt;const k=c.t/c.max;if(k>=1){c.s.visible=false;freeC.push(c.s);bcores.splice(i,1);continue}c.s.scale.setScalar(Math.max(.01,c.sz*3.75*(1-k*1.4)));c.s.material.opacity=Math.max(0,1-k*1.6)}
  RG.end();for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.t+=dt;if(r.t>=r.max){rings.splice(i,1);continue}const k=r.t/r.max,m=RG.get();m.position.set(r.x,r.y,r.z);m.scale.setScalar(.2+r.r*k);m.material.color.copy(col(r.c));m.material.opacity=.85*(1-k)}}
/* độ cao theo vị trí: trên công trình thì ở đầu pháo, ngoài ra ở độ cao bay của tàu */
let BH=[];function hAtW(x,z,def){for(const b of BH){if(Math.abs(x-b.x)<=b.w/2&&Math.abs(z-b.y)<=b.h/2)return b.top}return def}
const PH=new WeakMap();

/* ---------- vẽ 3D ---------- */
let t3=0,lastT=performance.now();
function render(G,L){const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;t3+=dt;
  applyQ();const w=dfc.clientWidth||dfV.w,h=dfc.clientHeight||dfV.h,pr=ren.getPixelRatio();if(cv3.width!==Math.round(w*pr)||cv3.height!==Math.round(h*pr))ren.setSize(w,h,false);
  if(R3.gid!==G){setWorld(G);seenFx=new WeakSet();R3.yaw=0}pools();joyStep(G);camFollow(G,dt);gTex.needsUpdate=true;
  sky.rotation.y+=dt*.004;planet.rotation.y+=dt*.01;(R3.rocks||[]).forEach(r=>{r.m.rotation.x+=r.sp.x*dt;r.m.rotation.y+=r.sp.y*dt});
  {const P=dust.geometry.attributes.position;for(let i=0;i<P.count;i+=5)P.setY(i,P.getY(i)+Math.sin(t3*.6+i)*.002);P.needsUpdate=true}
  const used=new Set();BH=[];
  L.forEach(it=>{if(!it.m)return;const o=it.o;let g=R3.inst.get(o);
    if(!g||g.userData.src!==it.src){if(g)drop(g);g=mkInst(it);R3.inst.set(o,g)}
    used.add(o);const U=g.userData;
    if(it.k==='s'){const M=U.hull.material,lf=o.lift||0;let sc=1+lf*.25;
      if(o.boss){const a=t3-U.born;if(a<1.3){const k=Math.min(1,a/1.1);sc*=.25+.75*(1+2.7*Math.pow(k-1,3)+1.7*Math.pow(k-1,2));if(!U.bfx){U.bfx=1;boom(o.x,HOV,o.y,2.6,false);rings.push({x:o.x,y:.2,z:o.y,r:o.size*3,t:0,max:1.2,c:'#ff4d5e'})}}}
      g.scale.setScalar(sc);const y=HOV+lf*1.3+Math.sin(t3*2.2+o.x)*(o.boss?.2:.09);g.position.set(o.x,y,o.y);
      const ry=-(o.ang+Math.PI/2),turn=angDiff(U.ry==null?ry:U.ry,ry);U.ry=ry;U.bank=clamp((U.bank||0)+((-turn/Math.max(dt,.001)*.06)-(U.bank||0))*Math.min(1,dt*6),-.9,.9);
      const spd=Math.hypot(o.vx||0,o.vy||0);g.rotation.set(0,ry,0);U.body.rotation.z=o.boss?U.bank*.2:U.bank;U.body.rotation.x=-Math.min(.25,spd*.02);
      let op=1;if(o.ghost)op=o.gfa!=null?Math.min(o.gfa,o.gt*2,(o.glife-o.gt)*3+.2):Math.min(.65,o.gt*2,(o.glife-o.gt)*3+.2);else if(o.stl>0)op=o.stlA||.4;else if(o.fd>0)op=.6;
      M.transparent=op<.99;M.opacity=Math.max(.05,op);const hf=o.hit>0?.55:0;M.color.setScalar(1+hf*2);if(o.ghost)M.color.setRGB(.7,1.2,1.6);
      M.emissiveIntensity=(o.stun>0||o.stT>0)?1.4+Math.sin(t3*30)*.6:1.4;
      const f=.85+Math.random()*.3,sp=.6+Math.min(1,spd/6)*.8;U.fl.forEach(F=>{F.a.scale.set(F.r,F.r,F.r*5*sp*f);F.b.scale.set(F.r*.45,F.r*.45,F.r*3*sp*f);F.g.scale.setScalar(F.r*4.2*f);F.a.visible=F.b.visible=F.g.visible=op>.3});
      if(U.cores){let e=.75+.2*Math.sin(t3*6+U.ph);if(o===G.pl&&o.nrgMax)e=.12+1.5*(o.nrg/o.nrgMax)*(.8+.2*Math.sin(t3*6));U.cores.forEach(m=>m.emissiveIntensity=e)}
      let sf=0;if(typeof c7ShF==='function')sf=c7ShF(o);if(o.cs&&o.cs.abs&&o.cs.abs.v>0)sf=Math.max(sf,.5);
      U.shield.visible=sf>0&&op>.3;if(U.shield.visible){U.sfl=o.hit>0?.22:Math.max(0,(U.sfl||0)-dt);U.shield.material.opacity=.035+.04*sf+U.sfl}
      const big=o.boss,bw=big?Math.max(2.9,o.size*1.2):Math.max(.9,o.size*.55),by=y+(big?3.7:1.1)*sc,bz=o.y,show=big||o.team!=='p'||o.hp<o.max||o===G.pl;
      if(show){bar(o.x,by,bz,bw+.04,1,'#0a1020',.75,big?.22:.14);bar(o.x,by,bz,bw,Math.max(0,o.hp/o.max),big?'#ff4d5e':o.team==='p'?(o===G.pl?'#5dffa1':'#5dffa1'):'#ff6a3c',1,big?.14:.085);if(sf>0)bar(o.x,by,bz,bw,sf,'#ffffff',.9,big?.14:.085)}
      if(o.epM!=null&&(o.ep<o.epM||o.exh>0)){bar(o.x,by-.12,bz,bw,1,'#0a1020',.7,.07);bar(o.x,by-.12,bz,bw,Math.max(0,o.ep/o.epM),o.exh>0?'#ffffff':'#35c8ff',1,.05)}}
    else{const b=o,isU=it.k==='u',tt=isU?b.bd.t:b.t;g.position.set(b.x,0,b.y);
      const fl=isU?(b.hit>0):(b.flash>0);
      if(U.pb){const P=U.pb,ex=P.ex;
        if(ex.ring)ex.ring.rotation.z+=dt*.8;if(ex.shield){const want=fl?.32:.07;ex.shield.material.opacity+=(want-ex.shield.material.opacity)*Math.min(1,dt*(fl?20:4))}
        if(ex.crystal)ex.crystal.rotation.y+=dt*2;if(ex.crystals)ex.crystals.rotation.y+=dt*.6;
        if(ex.drones)ex.drones.forEach((d,i)=>{const a=t3*1.6+i*Math.PI;d.position.set(Math.cos(a)*1.45,1.75,Math.sin(a)*1.45);d.rotation.y+=dt*4});
        if(ex.sink!=null){const near=(isU?[G.pl].concat(G.al||[]):G.en).some(e=>e&&!e.dead&&(e.spawn==null||e.spawn<=G.t)&&Math.hypot(e.x-b.x,e.y-b.y)<(tt==='pylon'?6:2.5));U.rise=clamp((U.rise||0)+(near?2:-.5)*dt,0,1);P.g.position.y=-ex.sink*(1-U.rise)}
        if(fl)P.g.scale.setScalar(1.03);else P.g.scale.setScalar(1)}
      else{U.hull.material.color.setScalar(fl?2.1:1)}
      aimHead(U,b,G,dt,isU);
      BH.push({x:b.x,y:b.y,w:b.w,h:b.h,top:Math.max(.4,(U.top||1)*.8)});
      const mx=b.max||1,hq=tt==='hq'||b.hq,show=b.hp<mx||hq||(b.shd&&b.shd.t>0&&b.shd.v>0);
      if(show&&tt!=='mine'){const bw=hq?2.1:.95,by=(U.top||1)+.5,bz=b.y;bar(b.x,by,bz,bw+.04,1,'#0a1020',.75,.15);bar(b.x,by,bz,bw,Math.max(0,b.hp/mx),hq?'#4fd6ff':'#5dffa1',1,.09);if(b.shd&&b.shd.t>0&&b.shd.v>0)bar(b.x,by,bz,bw,Math.min(1,b.shd.v/Math.max(1e-9,b.shd.max)),'#ffffff',.9,.09)}}});
  R3.inst.forEach((g,o)=>{if(!used.has(o)){const U=g.userData;if(U.k==='b'||U.k==='u'){if((o.hp!=null&&o.hp<=0)||o.dead)debris(g,o)}else if(U.k==='s'&&(o.dead||o.hp<=0))boom(o.x,HOV,o.y,o.boss?2.6:o===G.pl?2:1.3,false);drop(g);R3.inst.delete(o)}});
  /* đạn: vạch sáng bay theo hướng, tên lửa có vệt khói; độ cao chuyển dần giữa đầu pháo và độ cao tàu */
  let np=0;const capP=CAP.proj[R3.q];
  G.pr.forEach(p=>{if(np++>capP)return;let st=PH.get(p);const tgtY=hAtW(p.x,p.y,HOV);if(!st){st={y:hAtW(p.x,p.y,HOV)};PH.set(p,st)}st.y+=(tgtY-st.y)*Math.min(1,dt*5);
    const yaw=Math.atan2(-(p.vx||0),-(p.vy||0));
    if(p.k==='missile'){const m=MS.get();m.position.set(p.x,st.y,p.y);m.rotation.set(0,yaw,0);if(Math.random()<.9)smoke(p.x-(p.vx||0)*.03,st.y,p.y-(p.vy||0)*.03,rand(.6,1),.38);return}
    const m=BUL.get(),c=col(p.col),sz=p.spl?1.7:1;m.position.set(p.x,st.y,p.y);m.rotation.set(0,yaw,0);m.scale.set(sz,sz,sz*(1+Math.min(1.5,Math.hypot(p.vx||0,p.vy||0)/20)));m.material.color.copy(c);m.userData.gl.material.color.copy(c)});
  /* tia: từ đầu tháp tới mục tiêu */
  const a=new T.Vector3(),b=new T.Vector3();
  G.bm.forEach(B=>{const o=Math.min(1,B.t*8);if(o<=0)return;a.set(B.x1,hAtW(B.x1,B.y1,HOV),B.y1);b.set(B.x2,hAtW(B.x2,B.y2,HOV),B.y2);const r=Math.max(.035,(B.w||3)/26*.5);beam(BC,a,b,r*.5,'#ffffff',.9*o);beam(BG,a,b,r*1.7,B.col,.45*o)});
  /* vụ nổ */
  G.fx.forEach(f=>{const k=f.t/f.max;if(k<=0)return;const y=hAtW(f.x,f.y,HOV)*.9;if(!seenFx.has(f)){seenFx.add(f);if(f.ex||f.r>=1)boom(f.x,y,f.y,Math.max(.22,f.r*.42),!f.ex&&/^#?[0-9a-f]{0,2}[89a-f]/i.test(f.col||''));else boom(f.x,y,f.y,.22,false)}
    const m=XB.get(),R=f.r*(1.1-k*.5)*(f.ex?.6:.8);m.position.set(f.x,y,f.y);m.scale.setScalar(Math.max(.05,R));m.material.color.copy(col(f.ex?'#ffb347':f.col));m.material.opacity=Math.min(1,k*.6)});
  BUL.end();BC.end();BG.end();XB.end();MS.end();
  XS.end();stepFx(dt);
  const P=G.pl;marker.visible=!P.dead&&R3.joy.id===null&&Math.hypot(P.tx-P.x,P.ty-P.y)>.3;if(marker.visible){marker.position.x=P.tx;marker.position.z=P.ty;marker.rotation.z+=dt*2;marker.scale.setScalar(1+.15*Math.sin(t3*6))}
  tlb(G,dt);BAR.end();hud(G,true);
  ren.render(scene,cam);radar(G)}
/* ---------- radar tròn (góc phải trên) ---------- */
let rdc=null,rdq=null,rdn=0;
function radar(G){if(!rdc){rdc=document.createElement('canvas');rdc.id='df3r';rdc.width=rdc.height=232;rdc.setAttribute('aria-label','Radar');rdc.style.cssText='position:absolute;right:max(16px,env(safe-area-inset-right,0px));top:calc(10px + env(safe-area-inset-top,0px));width:clamp(84px,16vh,116px);height:clamp(84px,16vh,116px);max-height:none;border:1px solid rgba(90,150,255,.28);border-radius:50%;background:rgba(6,14,32,.72);pointer-events:none;z-index:5';document.getElementById('def').appendChild(rdc);rdq=rdc.getContext('2d')}
  rdc.style.display='block';rdc.style.top=G.pvp?'calc(58px + env(safe-area-inset-top,0px))':'calc(10px + env(safe-area-inset-top,0px))';if(rdn++%3)return;
  const x=rdq,S=232,c=S/2,R=c-6,P=G.pl,o=P.dead?{x:G.hq.x,y:G.hq.y}:P,rng=Math.max(G.wd.Wd,G.wd.Hd)*.6,k=R/rng,a=R3.yaw,cs=Math.cos(a),sn=Math.sin(a);
  x.clearRect(0,0,S,S);x.strokeStyle='rgba(90,150,255,.35)';x.lineWidth=1.5;for(const r of[R,R*.5]){x.beginPath();x.arc(c,c,r,0,TAU);x.stroke()}
  const Pp=(px,pz)=>{const dx=px-o.x,dz=pz-o.y;return[c+(dx*cs-dz*sn)*k,c+(dx*sn+dz*cs)*k]};
  const dot=(px,pz,cl,s,sq)=>{const[X,Y]=Pp(px,pz);if((X-c)**2+(Y-c)**2>R*R)return;x.fillStyle=cl;if(sq)x.fillRect(X-s,Y-s,s*2,s*2);else{x.beginPath();x.arc(X,Y,s,0,TAU);x.fill()}};
  {const A=Pp(0,0),B=Pp(G.wd.Wd,0),C=Pp(G.wd.Wd,G.wd.Hd),D=Pp(0,G.wd.Hd);x.save();x.beginPath();x.arc(c,c,R,0,TAU);x.clip();x.strokeStyle='rgba(63,184,255,.4)';x.beginPath();x.moveTo(...A);x.lineTo(...B);x.lineTo(...C);x.lineTo(...D);x.closePath();x.stroke();x.restore()}
  (R3.rocks||[]).forEach(r=>dot(r.m.position.x,r.m.position.z,'rgba(150,140,130,.45)',3));
  G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine'||b.t==='pylon')return;if(b.hq||b.t==='hq')dot(b.x,b.y,'#ffffff',6,true);else dot(b.x,b.y,'rgba(93,255,161,.75)',b.t==='wall'?1.6:2.6,true)});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead)return;dot(u.x,u.y,u.bd&&u.bd.t==='hq'?'#ffb35a':'rgba(255,120,90,.75)',u.bd&&u.bd.t==='hq'?6:2.6,true)});
  G.en.forEach(e=>{if(e.dead||e.spawn>G.t)return;dot(e.x,e.y,e.boss?'#ff3048':'#ff6a3c',e.boss?9:4.5)});(G.al||[]).forEach(s=>{if(!s.dead)dot(s.x,s.y,'#8affd0',3)});
  if(!P.dead){x.fillStyle='#4fd6ff';x.beginPath();x.moveTo(c,c-9);x.lineTo(c+6,c+6);x.lineTo(c-6,c+6);x.closePath();x.fill()}}
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
      F.rg-=dt;if(F.rg<=0){F.rg=.045;const top=new T.Vector3(o.x,SKY,o.y),bot=new T.Vector3(o.x,HOV,o.y),P=zig(top,bot,22,1.2);F.bolt.set(P);
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
function off(){R3.live=false;if(cv3)cv3.style.display='none';const r=document.getElementById('df3r');if(r)r.style.display='none';try{hud(null,false)}catch(e){}if(stick)stick.style.display='none';R3.joy.id=null}
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
