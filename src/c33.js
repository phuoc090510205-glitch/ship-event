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
    rubble:L({color:0x1c1f27,roughness:1,flatShading:true}),gold:L({color:0xe0a52a,metalness:.9,roughness:.28}),glass:L({color:0x9feaff,emissive:0x48c8ff,emissiveIntensity:.55,metalness:.2,roughness:.08}),pad:L({color:0x161d2c,metalness:.6,roughness:.6})}}
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
  planet=new T.Mesh(new T.SphereGeometry(40,48,32),new T.MeshStandardMaterial({map:PLAN,roughness:1,metalness:0,fog:false}));scene.add(planet);
  atm=new T.Sprite(new T.SpriteMaterial({map:GL,color:0x5fd0ff,transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false,fog:false}));atm.scale.set(118,118,1);scene.add(atm);
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
/* công trình: dựng khối 3D theo đúng hình gốc của game (tường, đại bác, laser, đại pháo, trụ sở, mìn, trụ điện có khung khối riêng; công trình khác ép khối từ ảnh) */
const SB={hq:1,wall:1,cannon:1,laser:1,bigcannon:1,mine:1,pylon:1};
const STX=new Map();
function sprTex(src){let o=STX.get(src);if(o)return o.ready?o:null;o={ready:false};STX.set(src,o);const im=_dimg(src);if(!im){STX.delete(src);return null}
  const t=new T.Texture(im);t.needsUpdate=true;t.encoding=T.sRGBEncoding;t.anisotropy=8;
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.drawImage(im,0,0,128,128);const id=x.getImageData(0,0,128,128),D=id.data;
  for(let i=0;i<D.length;i+=4){const r=D[i],g=D[i+1],b=D[i+2],cy=b>170&&g>160&&r<150&&D[i+3]>60;if(!cy){D[i]=D[i+1]=D[i+2]=0}D[i+3]=255}x.putImageData(id,0,0);
  const gl=new T.CanvasTexture(c);gl.encoding=T.sRGBEncoding;
  o.mat=new T.MeshStandardMaterial({map:t,emissive:0xffffff,emissiveMap:gl,emissiveIntensity:1.2,vertexColors:true,metalness:.35,roughness:.48,alphaTest:.35,side:T.DoubleSide});o.ready=true;return o}
/* chiếu ảnh từ trên xuống lên mọi mặt của khối: nhìn từ trên giống hệt ảnh gốc, mặt bên lấy màu viền và tối hơn */
function proj(geo,W,D,ox,oz){const P=geo.attributes.position,N=geo.attributes.normal,uv=new Float32Array(P.count*2),cl=new Float32Array(P.count*3);
  for(let i=0;i<P.count;i++){const x=P.getX(i)+ox,z=P.getZ(i)+oz;uv[i*2]=Math.max(.002,Math.min(.998,x/W+.5));uv[i*2+1]=Math.max(.002,Math.min(.998,.5-z/D));const ny=N.getY(i),k=ny>.6?1:ny<-.5?.3:.62+.1*ny;if(ny<=.6){uv[i*2]=.5+(uv[i*2]-.5)*.9;uv[i*2+1]=.5+(uv[i*2+1]-.5)*.9}cl[i*3]=cl[i*3+1]=cl[i*3+2]=k}
  geo.setAttribute('uv',new T.BufferAttribute(uv,2));geo.setAttribute('color',new T.BufferAttribute(cl,3));return geo}
function sbuild(tt,w,h,mat){const g=new T.Group(),W=w,D=h,mn=Math.min(w,h);let top=.5,ex={};
  const add=(geo,y,x,z)=>{x=x||0;z=z||0;geo.translate(x,y,z);proj(geo,W,D,0,0);const m=new T.Mesh(geo,mat);m.castShadow=m.receiveShadow=true;g.add(m);return m};
  const box=(a,b,c,y)=>add(new T.BoxGeometry(a,b,c),y+b/2),cyl=(r0,r1,hh,y,seg)=>add(new T.CylinderGeometry(r0,r1,hh,seg||40,1),y+hh/2);
  switch(tt){
    case 'wall':{box(W*.98,.62,D*.98,0);top=.62;break}
    case 'cannon':{box(W*.98,.26,D*.98,0);cyl(mn*.33,mn*.36,.32,.26);top=.58;
      const br=new T.Mesh(new T.CylinderGeometry(mn*.055,mn*.065,mn*.42,14),MT.gold);br.rotation.x=Math.PI/2;br.position.set(0,.62,-mn*.3);br.castShadow=true;g.add(br);
      const tip=new T.Mesh(new T.CylinderGeometry(mn*.075,mn*.075,mn*.06,14),MT.cyan);tip.rotation.x=Math.PI/2;tip.position.set(0,.62,-mn*.52);g.add(tip);break}
    case 'laser':{box(W*.98,.26,D*.98,0);cyl(mn*.36,mn*.39,.24,.26);cyl(mn*.2,mn*.24,.22,.5);const em=new T.Mesh(new T.CylinderGeometry(mn*.06,mn*.08,.42,14),MT.cyan);em.position.y=.93;g.add(em);
      const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x7fe8ff);s.scale.setScalar(mn*.55);s.position.y=1.18;g.add(s);ex.glow=s;top=1.15;break}
    case 'bigcannon':{box(W*.98,.26,D*.98,0);cyl(mn*.41,mn*.45,.6,.26,48);const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x4fd6ff);s.scale.setScalar(mn*.45);s.position.y=.8;g.add(s);ex.glow=s;top=.86;break}
    case 'hq':{cyl(mn*.49,mn*.5,.26,0,64);cyl(mn*.36,mn*.39,.24,.26,64);cyl(mn*.17,mn*.2,.22,.5,6);const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x7fe8ff);s.scale.setScalar(mn*.4);s.position.y=.82;g.add(s);ex.glow=s;
      ex.shield=new T.Mesh(new T.SphereGeometry(mn*.78,40,20,0,TAU,0,Math.PI/2),new T.MeshBasicMaterial({color:0x4fd6ff,transparent:true,opacity:.05,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));g.add(ex.shield);
      const lamp=new T.PointLight(0x4fd6ff,1.2,10,2);lamp.position.y=1.4;g.add(lamp);top=.75;break}
    case 'mine':{cyl(mn*.45,mn*.47,.14,0,40);ex.sink=.14;top=.14;break}
    case 'pylon':{cyl(mn*.48,mn*.5,.14,0,48);cyl(mn*.3,mn*.33,.22,.14,40);cyl(mn*.15,mn*.18,.5,.36,32);const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x7fe8ff);s.scale.setScalar(mn*.4);s.position.y=.95;g.add(s);ex.glow=s;ex.sink=.86;top=.86;break}}
  return {g,top,ex}}
function collect(G){const L=[];
  const ships=G.en.filter(e=>e.spawn<=G.t&&!e.dead).concat(G.pl.dead?[]:[G.pl]).concat((G.al||[]).filter(a=>!a.dead));
  ships.forEach(e=>{if(!e.sh||!e.sh.img)return;L.push({o:e,k:'s',src:e.sh.img,m:model(e.sh.img,'s')})});
  const addB=(o,t,v,k)=>{const src=bSrc(t,v);if(!src)return;if(SB[t]){const st=sprTex(src);L.push({o,k,t,src,m:st?{ready:true,sb:st}:null})}else L.push({o,k,t,src,m:model(src,'b')})};
  G.bl.forEach(b=>{if(b.hp<=0)return;addB(b,b.t,b.v,'b')});
  if(G.pvp&&G.eu)G.eu.forEach(u=>{if(u.dead||!u.bd)return;addB(u,u.bd.t,u.bd.v,'u')});
  return L.map(i=>{if(i.m&&!i.m.ready)i.m=null;return i})}
const hAt=(m,u,v)=>m.hs?m.hs[Math.max(0,Math.min(m.NY-1,Math.round(v*(m.NY-1))))*m.NX+Math.max(0,Math.min(m.NX-1,Math.round(u*(m.NX-1))))]||0:.5;
/* tàu: chỉ thân ép từ ảnh gốc + lửa động cơ ở đầu phun có sẵn (ô mô-đun màu chỉ hiện trong Kho tàu) */
function engine(U,x,y,z,r){const b=U.body,fa=new T.Mesh(FLG,FLM1),fb=new T.Mesh(FLG,FLM2),gl=new T.Sprite(new T.SpriteMaterial({map:glowT(),color:0x48c8ff,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));fa.position.set(x,y,z);fb.position.copy(fa.position);gl.position.set(x,y,z+r*.4);b.add(fa,fb,gl);U.fl.push({a:fa,b:fb,g:gl,r})}
function mkShip(it,g,U){const o=it.o,m=it.m,ww=o.sh.W*o.sc,hh=o.sh.H*o.sc,hy=.26*Math.sqrt(ww*hh),body=U.body;U.ww=ww;U.hh=hh;U.hy=hy;
  U.hull.scale.set(ww,hy,hh);const bot=new T.Mesh(m.geo,m.matB);bot.customDepthMaterial=m.depth;bot.castShadow=true;bot.scale.set(ww,-hy*.65,hh);body.add(bot);
  const P=(u,v)=>[(u-.5)*ww,(v-.5)*hh],mn=Math.min(ww,hh);
  (m.noz||[]).forEach(n=>{const [x,z]=P(n.u,n.v);engine(U,x,hAt(m,n.u,Math.max(0,n.v-.06))*hy*.6,z,Math.max(.05,n.r*ww))});
  if(!(m.noz||[]).length)[-.18,.18].forEach(dx=>engine(U,dx*ww,hy*.3,hh*.47,mn*.07));
  const sh=new T.Mesh(SHG,new T.MeshBasicMaterial({color:0x5fa8ff,transparent:true,opacity:.08,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));sh.scale.set(ww*.66,hy*2.6+.3,hh*.66);sh.visible=false;g.add(sh);U.shield=sh}
function mkInst(it){const g=new T.Group(),body=new T.Group();g.add(body);const U=g.userData={src:it.src,ph:Math.random()*6,body,fl:[],born:t3,k:it.k,o:it.o};
  if(it.k==='s'){const m=it.m;U.model=m;const hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;body.add(hull);U.hull=hull;mkShip(it,g,U)}
  else if(it.m.sb){const P=sbuild(it.t,it.o.w,it.o.h,it.m.sb.mat);body.add(P.g);U.sb=P;U.tt=it.t;U.top=P.top;U.mat=it.m.sb.mat}
  else{const m=it.m,o=it.o;U.model=m;const hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;const hy=.3*Math.sqrt(o.w*o.h);hull.scale.set(o.w*.98,hy,o.h*.98);body.add(hull);U.hull=hull;U.top=hy*1.1}
  scene.add(g);return g}
function drop(g){scene.remove(g);const U=g.userData;if(U.hull)U.hull.material.dispose();if(U.shield)U.shield.material.dispose();if(U.sb)U.sb.g.traverse(o=>{if(o.geometry&&o.isMesh)o.geometry.dispose()})}
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
  const X=XS.get();X.position.set(x,y,z);X.userData.boom={t:0,max:.6,s};
  flash(x,y,z,blue?'#4fd6ff':'#ffa855',5*s);if(s>.5)R3.shake+=s*.33/(1+cam.position.distanceTo(new T.Vector3(x,y,z))/12.5);
  for(let i=0;i<Math.min(6,s*4);i++)smoke(x+rand(-.4,.4)*s,y,z+rand(-.4,.4)*s,rand(.7,1.1),.6*s)}
const booms=[];
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
      let sf=0;if(typeof c7ShF==='function')sf=c7ShF(o);
      U.shield.visible=sf>0&&op>.3;if(U.shield.visible){U.sfl=o.hit>0?.22:Math.max(0,(U.sfl||0)-dt);U.shield.material.opacity=.035+.04*sf+U.sfl}
      const big=o.boss,bw=big?Math.max(2.9,o.size*1.2):Math.max(.9,o.size*.55),by=y+(big?3.7:1.1)*sc,bz=o.y,show=big||o.team!=='p'||o.hp<o.max||o===G.pl;
      if(show){bar(o.x,by,bz,bw+.04,1,'#0a1020',.75,big?.22:.14);bar(o.x,by,bz,bw,Math.max(0,o.hp/o.max),big?'#ff4d5e':o.team==='p'?(o===G.pl?'#5dffa1':'#5dffa1'):'#ff6a3c',1,big?.14:.085);if(sf>0)bar(o.x,by,bz,bw,sf,'#ffffff',.9,big?.14:.085)}
      if(o.epM!=null&&(o.ep<o.epM||o.exh>0)){bar(o.x,by-.12,bz,bw,1,'#0a1020',.7,.07);bar(o.x,by-.12,bz,bw,Math.max(0,o.ep/o.epM),o.exh>0?'#ffffff':'#35c8ff',1,.05)}}
    else{const b=o,isU=it.k==='u',tt=isU?b.bd.t:b.t;g.position.set(b.x,0,b.y);
      const fl=isU?(b.hit>0):(b.flash>0),H=b.u||b;let ry=0;if(tt!=='hq'&&tt!=='wall'&&tt!=='mine'&&tt!=='pylon'&&H.da!=null&&Math.abs(b.w-b.h)<.01)ry=-(H.da+Math.PI/2);g.rotation.set(0,ry,0);
      if(U.sb){const ex=U.sb.ex;if(ex.shield){const want=fl?.3:.05;ex.shield.material.opacity+=(want-ex.shield.material.opacity)*Math.min(1,dt*(fl?20:4))}
        if(ex.glow)ex.glow.material.opacity=.65+.3*Math.sin(t3*3+b.x);
        if(ex.sink!=null){const near=(isU?[G.pl].concat(G.al||[]):G.en).some(e=>e&&!e.dead&&(e.spawn==null||e.spawn<=G.t)&&Math.hypot(e.x-b.x,e.y-b.y)<(tt==='pylon'?6:2.5));U.rise=clamp((U.rise||0)+(near?2:-.5)*dt,0,1);U.sb.g.position.y=-ex.sink*(1-U.rise)+.001}
        U.sb.g.scale.setScalar(fl?1.03:1)}
      else U.hull.material.color.setScalar(fl?2.1:1);
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
  try{skill3d(G,dt)}catch(e){console.error(e)}
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
/* ===================== HIỆU ỨNG KỸ NĂNG 3D (đợt 1) =====================
   Khóa Mục Tiêu Đỏ · Radar Quét Rộng · Phân Tích Chiến Hạm · Từ Trường Xanh · Sốc Điện Hạm · Laser Đỏ Nhẹ · Nhiễu Sóng Xanh
   + vòng sóng chung (ring) của mọi kỹ năng. Bản 2D của các hiệu ứng này tự tắt khi đang xem 3D. */
let SK=null;
function skInit(){if(SK)return SK;const AD=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false});
  const band=cvTex(8,64,(x)=>{const g=x.createLinearGradient(0,64,0,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.35,'rgba(255,255,255,.9)');g.addColorStop(.5,'rgba(255,255,255,1)');g.addColorStop(.65,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,8,64)});
  const wall=cvTex(8,64,(x)=>{const g=x.createLinearGradient(0,64,0,0);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(.3,'rgba(255,255,255,.3)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,8,64)});
  const fan=cvTex(64,64,(x)=>{const g=x.createRadialGradient(0,64,0,0,64,64);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.8,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,.9)');x.fillStyle=g;x.fillRect(0,0,64,64)});
  const disc=cvTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,.05)');g.addColorStop(.7,'rgba(255,255,255,.18)');g.addColorStop(.97,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
  const mk=(geo,map,o)=>{const m=new T.Mesh(geo,new T.MeshBasicMaterial({map,color:0xffffff,transparent:true,opacity:o||1,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m};
  const ringBand=new T.CylinderGeometry(1,1,1,64,1,true),flat=new T.RingGeometry(.9,1,64);flat.rotateX(-Math.PI/2);
  const sector=new T.CircleGeometry(1,32,-Math.PI/2,Math.PI);sector.rotateX(-Math.PI/2);
  const fanG=new T.PlaneGeometry(1,1);fanG.translate(.5,.5,0);
  const torus=new T.TorusGeometry(1,.035,6,64);torus.rotateX(Math.PI/2);
  const tick=new T.BoxGeometry(.06,.06,.5);
  const beamG=new T.CylinderGeometry(1,1,1,10,1,true);
  SK={band,wall,fan,disc,AD,
    R:Pool(()=>{const g=new T.Group(),a=mk(ringBand,band,.9),b=new T.Mesh(flat,AD(0xffffff,.9));b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    SW:Pool(()=>{const g=new T.Group(),s=mk(sector,fan,.6),f=mk(fanG,wall,.8),l=new T.Mesh(new T.BoxGeometry(1,.05,.05),AD(0xffffff,1));l.geometry.translate(.5,0,0);g.add(s,f,l);g.userData={s,f,l};scene.add(g);return g}),
    LZ:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xff2d3a,.9)),b=new T.Mesh(beamG,AD(0xffd6d6,1)),h=new T.Sprite(ADDM(glowT()));h.material.color.set(0xff3b3b);a.frustumCulled=b.frustumCulled=false;g.add(a,b,h);g.userData={a,b,h};scene.add(g);return g}),
    ORB:Pool(()=>{const g=new T.Group(),c=new T.Mesh(new T.SphereGeometry(.22,16,12),AD(0xffffff,1)),gl=new T.Sprite(ADDM(glowT())),rg=new T.Mesh(torus,AD(0x8fd0ff,.9));rg.scale.setScalar(.38);g.add(c,gl,rg);g.userData={c,gl,rg};scene.add(g);return g}),
    MAG:Pool(()=>{const g=new T.Group(),w=mk(ringBand,wall,.6),d=new T.Mesh(new T.CircleGeometry(1,48).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:disc,color:0x4da6ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false})),core=new T.Mesh(torus,AD(0x6cc0ff,.9));
      const arcs=[0,1,2].map(i=>{const a=new T.Mesh(new T.TorusGeometry(1,.03,6,40,Math.PI*.9),AD(0xbfe6ff,.8));g.add(a);return a});g.add(w,d,core);g.userData={w,d,core,arcs};scene.add(g);return g}),
    LK:Pool(()=>{const g=new T.Group(),r1=new T.Mesh(torus,AD(0xff2d44,.9)),r2=new T.Mesh(torus,AD(0xff2d44,.6)),tk=[0,1,2,3].map(()=>{const t=new T.Mesh(tick,AD(0xff2d44,.95));g.add(t);return t}),dot=new T.Sprite(ADDM(glowT())),col=new T.Mesh(beamG,AD(0xff2d44,.25));dot.material.color.set(0xff2d44);g.add(r1,r2,dot,col);g.userData={r1,r2,tk,dot,col};scene.add(g);return g})};
  return SK}
/* vòng cung tiến trình (đếm ngược thời gian khóa) */
const ARCG=new Map();function arcGeo(n){let g=ARCG.get(n);if(!g){g=new T.TorusGeometry(1,.03,6,48,Math.max(.01,n/32*TAU));g.rotateX(Math.PI/2);ARCG.set(n,g)}return g}
let intelEl=null;
function intelHud(C){if(!intelEl){intelEl=document.createElement('div');intelEl.id='df3intel';intelEl.style.cssText="position:absolute;right:max(16px,env(safe-area-inset-right,0px));top:calc(140px + env(safe-area-inset-top,0px));width:min(260px,40vw);background:rgba(8,20,48,.86);border:1px solid #ffd24a;border-radius:8px;padding:8px 10px;font:500 12px/1.45 'Be Vietnam Pro',system-ui,sans-serif;color:#e8f0ff;pointer-events:none;z-index:6;box-shadow:0 0 18px rgba(255,210,74,.25)";document.getElementById('def').appendChild(intelEl)}
  const it=C&&C.intel;if(!it||!(it.t>0)){intelEl.style.display='none';return}intelEl.style.display='block';intelEl.style.opacity=Math.min(1,it.t*3,(it.max-it.t)*6+.2);
  const h='<b style="font:700 12px Chakra Petch,system-ui;color:#ffd24a;letter-spacing:.06em">THÔNG TIN ĐỐI THỦ · '+Math.ceil(it.t)+'s</b><br>'+it.lines.map(l=>String(l).replace(/[<>&]/g,'')).join('<br>')+'<div style="height:3px;margin-top:6px;background:#ffd24a;width:'+Math.max(0,it.t/it.max*100)+'%"></div>';if(intelEl._h!==h){intelEl.innerHTML=h;intelEl._h=h}}
function skill3d(G,dt){const C=G.csk;skInit();const S2=SK;
  /* vòng sóng chung của kỹ năng: dải sáng đứng + vòng phẳng, nở ra và mờ dần */
  if(C&&C.fx)C.fx.forEach(f=>{if(f.mot)return;const p=1-f.t/f.max,r=f.r0+(f.r1-f.r0)*Math.sqrt(p),g=S2.R.get(),U=g.userData,y=hAtW(f.x,f.y,HOV)*.75,o=Math.max(0,1-p)*.9;
    g.position.set(f.x,y,f.y);U.a.scale.set(r,.25+.35*(1-p),r);U.b.scale.setScalar(r);U.a.material.color.copy(col(f.col));U.b.material.color.copy(col(f.col));U.a.material.opacity=o*.75;U.b.material.opacity=o});
  /* Radar Quét Rộng: quạt quét hình bán nguyệt + vách sáng quay theo tia quét */
  ((C&&C.sw)||[]).forEach(w=>{const p=1-w.t/w.max,u=Math.min(1,p*1.5),r=w.R*Math.sqrt(Math.min(1,p*2.2)),g=S2.SW.get(),U=g.userData,A0=w.a0,a=A0-Math.PI/2+u*Math.PI;
    g.position.set(w.P.x,HOV*.6,w.P.y);g.rotation.set(0,-A0,0);U.s.scale.set(r,1,r);U.s.material.color.copy(col(w.col));U.s.material.opacity=(1-p)*.55;
    U.f.rotation.set(0,-(a-A0),0);U.f.scale.set(r,.9,1);U.f.material.color.copy(col(w.col));U.f.material.opacity=(1-p)*.85;
    U.l.rotation.set(0,-(a-A0),0);U.l.scale.set(r,1,1);U.l.material.color.copy(col(w.col));U.l.material.opacity=1-p});
  /* Laser Đỏ Nhẹ: tia đỏ 3D từ tàu tới từng mục tiêu, nhấp nháy */
  ((C&&C.lz)||[]).forEach(l=>{if(l.tg.dead)return;const p=1-l.t/l.max,g=S2.LZ.get(),U=g.userData,a=new T.Vector3(l.P.x,HOV,l.P.y),b=new T.Vector3(l.tg.x,HOV,l.tg.y),d=b.clone().sub(a),L=d.length()||.01,fl=(1-p)*(.7+.3*Math.sin(t3*60));
    g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(.09*(1-p*.5),L,.09*(1-p*.5));U.b.scale.set(.03,L,.03);U.a.material.opacity=fl*.8;U.b.material.opacity=fl;
    U.h.position.set(0,L/2,0);U.h.scale.setScalar(.9+.3*Math.sin(t3*40));U.h.material.opacity=fl});
  /* Sốc Điện Hạm (xanh) / Nhiễu Sóng Xanh (tím): quả cầu năng lượng bay, vòng điện xoay quanh */
  ((C&&C.sh)||[]).forEach(b=>{const g=S2.ORB.get(),U=g.userData,c=b.jam?'#c9a6ff':'#7df4ff';g.position.set(b.x,HOV,b.y);U.gl.material.color.copy(col(c));U.gl.scale.setScalar(1.3+.2*Math.sin(t3*30));U.c.scale.setScalar(.9);U.rg.material.color.copy(col(b.jam?'#e6d6ff':'#bff'));U.rg.rotation.set(t3*9,t3*13,0);
    if(Math.random()<.5)spark(b.x,HOV,b.y,rand(-.6,.6),rand(-.3,.6),rand(-.6,.6),c,.3,.22)});
  /* Từ Trường Xanh: quả cầu bay vòng cung tới mục tiêu */
  ((C&&C.orbs)||[]).forEach(b=>{const g=S2.ORB.get(),U=g.userData,pr=1-b.t/b.max;g.position.set(b.x,HOV+Math.sin(Math.PI*Math.min(1,pr))*1.6,b.y);U.gl.material.color.set(0x6cc0ff);U.gl.scale.setScalar(1.5);U.c.scale.setScalar(1.1);U.rg.material.color.set(0x8fd0ff);U.rg.rotation.set(t3*6,t3*8,0);
    if(Math.random()<.8)spark(g.position.x,g.position.y,g.position.z,0,0,0,'#6cc0ff',.4,.4)});
  /* Từ Trường Xanh: vùng từ trường – vách sáng tròn, đĩa nền, các đường sức xoay và hạt bị hút vào tâm */
  ((C&&C.mags)||[]).forEach(m=>{const a=Math.min(1,m.t*2,(m.max-m.t)*5+.2),g=S2.MAG.get(),U=g.userData,R=m.R;g.position.set(m.x,0,m.y);
    U.w.scale.set(R,1.6,R);U.w.position.y=.8;U.w.material.color.set(0x3a8cff);U.w.material.opacity=.55*a;U.d.scale.setScalar(R);U.d.position.y=.05;U.d.material.opacity=a;
    U.core.scale.setScalar(R*.22);U.core.position.y=HOV*.7;U.core.material.opacity=.8*a;
    U.arcs.forEach((s,i)=>{s.scale.setScalar(R*(.45+.18*i));s.position.y=HOV*.7;s.rotation.set(Math.PI/2+.25*Math.sin(t3+i),0,-t3*2.2*(i%2?-1:1)+i*2.094);s.material.opacity=.75*a});
    if(Math.random()<.7){const an=Math.random()*TAU,rr=R*rand(.7,1);const x=m.x+Math.cos(an)*rr,z=m.y+Math.sin(an)*rr;spark(x,rand(.3,HOV*1.3),z,(m.x-x)*1.6,0,(m.y-z)*1.6,'#8fd0ff',.55,.2)}});
  /* Khóa Mục Tiêu Đỏ: vòng khóa đỏ 3D quanh tàu địch, 4 vạch ngắm xoay, vòng đếm ngược, cột sáng đỏ */
  G.en.forEach(e=>{if(e.dead||e.spawn>G.t||!(e.lockT>0&&e.cVulT>0))return;const g=S2.LK.get(),U=g.userData,r=(e.size||2)*.55,lk=Math.min(1,(e.lockMax-e.lockT)/.25),R2=r*(1.25+.9*(1-lk)),a0=t3*2.2;
    g.position.set(e.x,HOV,e.y);U.r1.scale.setScalar(R2);U.r1.material.opacity=.35+.55*lk;U.r2.geometry=arcGeo(Math.max(1,Math.round(32*Math.max(0,e.lockT/e.lockMax))));U.r2.scale.setScalar(R2*1.18);U.r2.rotation.y=-a0;
    U.tk.forEach((t,i)=>{const a=a0*-1.3+i*Math.PI/2;t.position.set(Math.cos(a)*R2*1.07,0,Math.sin(a)*R2*1.07);t.scale.set(1,1,R2*.6);t.rotation.y=Math.atan2(Math.cos(a),Math.sin(a))});
    U.dot.scale.setScalar(.5+.15*Math.sin(t3*10));U.col.scale.set(.05,3,.05);U.col.position.y=1.5;U.col.material.opacity=.25*lk});
  try{skill3d2(G,dt)}catch(e){console.error(e)}
  try{skill3d3(G,dt)}catch(e){console.error(e)}
  try{skill3d4(G,dt)}catch(e){console.error(e)}
  try{skill3d5(G,dt)}catch(e){console.error(e)}
  S2.R.end();S2.SW.end();S2.LZ.end();S2.ORB.end();S2.MAG.end();S2.LK.end();intelHud(C)}
/* ===================== KỸ NĂNG 3D (đợt 2) =====================
   Tiến Công · Giảm Hồi Chiêu Kỹ Năng · Liên Kết Tam Giác · Sửa Chữa Tàu · Drone Hồi Phục · Truyền Năng Lượng · Drone Gây Nhiễu
   · Nạp Đạn Nhanh · Cổ Vũ Phi Hành Đoàn · Drone Săn Mồi · Phun Băng Làm Lạnh · Liên Kết Xanh (+ khiên năng lượng quanh tàu) */
let SK2=null;
function sk2Init(){if(SK2)return SK2;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,10,1,true),torus=new T.TorusGeometry(1,.04,8,64);torus.rotateX(Math.PI/2);
  const face=cvTex(256,256,(x)=>{const c=128;x.clearRect(0,0,256,256);const g=x.createRadialGradient(c,c,10,c,c,126);g.addColorStop(0,'rgba(77,166,255,.08)');g.addColorStop(.75,'rgba(77,166,255,.25)');g.addColorStop(1,'rgba(77,166,255,.7)');x.fillStyle=g;x.beginPath();x.arc(c,c,126,0,7);x.fill();
    x.strokeStyle='#6cc0ff';x.lineWidth=7;x.beginPath();x.arc(c,c,121,0,7);x.stroke();x.strokeStyle='#d8f0ff';x.lineCap='round';for(let i=0;i<12;i++){const a=i*Math.PI/6,big=i%3===0,r1=big?92:102;x.lineWidth=big?7:4;x.beginPath();x.moveTo(c+Math.cos(a)*r1,c+Math.sin(a)*r1);x.lineTo(c+Math.cos(a)*114,c+Math.sin(a)*114);x.stroke()}});
  const mkB=()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g};
  const dGeo=new T.SphereGeometry(.13,14,10),dRing=new T.TorusGeometry(.2,.022,6,24);dRing.rotateX(Math.PI/2);
  const sect=r=>{const g=new T.CircleGeometry(1,24,-r,2*r);g.rotateX(-Math.PI/2);return g};
  SK2={
    B:Pool(mkB),
    CLK:Pool(()=>{const g=new T.Group(),f=new T.Mesh(new T.PlaneGeometry(2,2).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:face,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));
      const mh=new T.Mesh(new T.BoxGeometry(.04,.02,.8).translate(0,0,-.4),AD(0xffffff,1)),hh=new T.Mesh(new T.BoxGeometry(.07,.02,.5).translate(0,0,-.25),AD(0xffffff,1)),sw=new T.Mesh(new T.CircleGeometry(.85,24,0,1.2).rotateX(-Math.PI/2),AD(0x8fd0ff,.5));
      const ar=[0,1,2].map(()=>{const c=new T.Mesh(new T.ConeGeometry(.08,.2,8).rotateZ(-Math.PI/2),AD(0xbfe6ff,1));g.add(c);return c});g.add(f,mh,hh,sw);g.userData={f,mh,hh,sw,ar};scene.add(g);return g}),
    AUR:Pool(()=>{const g=new T.Group(),r=new T.Mesh(torus,AD(0xffd24a,.8)),r2=new T.Mesh(torus,AD(0xfff0a8,.5)),cv=[0,1,2].map(()=>{const c=new T.Mesh(new T.ConeGeometry(.09,.16,4),AD(0xfff0a8,1));g.add(c);return c});g.add(r,r2);g.userData={r,r2,cv};scene.add(g);return g}),
    TRI:Pool(()=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(9),3));const m=new T.Mesh(geo,AD(0x7dffb0,.12));m.frustumCulled=false;scene.add(m);return m}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    DR:Pool(()=>{const g=new T.Group(),b=new T.Mesh(dGeo,MT.metal),r=new T.Mesh(dRing,AD(0x5dffa1,1)),gl=new T.Sprite(ADDM(glowT()));gl.scale.setScalar(.7);b.castShadow=true;g.add(b,r,gl);g.userData={b,r,gl};scene.add(g);return g}),
    CONE:Pool(()=>{const m=new T.Mesh(sect(.3927),new T.MeshBasicMaterial({map:SK.fan,color:0x8dffc0,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m})};
  return SK2}
function beam2(a,b,c,w,o){const g=SK2.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.35,L,w*.35);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.45);U.a.material.opacity=o*.7;U.b.material.opacity=o}
const WH3={r:1,g:1,b:1};
const V3=(u,y)=>new T.Vector3(u.x,y==null?HOV:y,u.y);
function drone(x,z,c,al,flash,spin){const g=SK2.DR.get(),U=g.userData;g.position.set(x,HOV+.55,z);g.rotation.y=spin||t3*3;U.r.material.color.copy(col(flash?'#ffffff':c));U.r.material.opacity=al;U.gl.material.color.copy(col(c));U.gl.material.opacity=.8*al;g.scale.setScalar(Math.max(.05,al));return g}
function skill3d2(G,dt){const C=G.csk,P=G.pl;if(!C)return;sk2Init();const S2=SK2,units=[P].concat(G.al||[]).filter(u=>u&&!u.dead);
  /* Tiến Công: sóng vàng lan rộng; Giảm Hồi Chiêu: đồng hồ ánh sáng xoay ngược */
  (C.rl||[]).forEach(w=>{const p=1-w.t/w.max;
    if(w.clock){const rr=Math.max(.2,w.R*Math.min(1,p*4+.15)),spin=-(p*p*.4+p)*Math.PI*5,fa=Math.min(1,w.t*2.2),g=S2.CLK.get(),U=g.userData;g.position.set(w.P.x,HOV+.1,w.P.y);g.scale.setScalar(rr);
      U.f.material.opacity=fa;U.mh.rotation.y=-spin;U.hh.rotation.y=-spin/12;U.sw.rotation.y=-spin-Math.PI/2;U.sw.material.opacity=.5*fa;[U.mh,U.hh].forEach(m=>m.material.opacity=fa);
      U.ar.forEach((c,i)=>{const a=-t3*2.4+i*2.094;c.position.set(Math.cos(a)*1.05,0,Math.sin(a)*1.05);c.rotation.y=-a-Math.PI/2;c.material.opacity=fa});return}
    const r=w.R*Math.min(1,Math.sqrt(p*2.5)),al=Math.min(1,w.t*1.6),g=SK.R.get(),U=g.userData,c0=w.c||'#ffd24a';g.position.set(w.P.x,HOV*.5,w.P.y);U.a.scale.set(r,.9,r);U.b.scale.setScalar(r);U.a.material.color.copy(col(c0));U.b.material.color.copy(col(c0));U.a.material.opacity=.6*al;U.b.material.opacity=al});
  /* Tiến Công (đang hiệu lực): vòng vàng quay quanh tàu, mũi tên vàng bay lên */
  units.forEach(u=>{const r=u.rb;if(!r||!(r.t>0))return;const g=S2.AUR.get(),U=g.userData,rr=(u.size||2.2)*.62;g.position.set(u.x,HOV,u.y);U.r.scale.setScalar(rr);U.r.rotation.y=t3*2;U.r.material.opacity=.55+.25*Math.sin(t3*10);U.r2.scale.setScalar(rr*1.15);U.r2.position.y=-.15;U.r2.material.opacity=.3;
    U.cv.forEach((c,i)=>{const o=(t3*1.2+i/3)%1;c.position.set((i-1)*rr*.5,.3+o*1.2,0);c.material.opacity=Math.sin(o*Math.PI)})});
  /* Liên Kết Tam Giác: 3 tia xanh nối 3 tàu + mặt tam giác mờ + hạt chạy dọc cạnh */
  (C.tri||[]).forEach(w=>{const m=w.m.filter(u=>!u.dead);if(m.length<3)return;const fa=Math.min(1,w.t*3,(w.max-w.t)*6+.2),pts=m.map(u=>V3(u));
    for(let i=0;i<3;i++){const a=pts[i],b=pts[(i+1)%3];beam2(a,b,'#8dffc0',.07,fa);if(Math.random()<.4){const u=Math.random(),q=a.clone().lerp(b,u);spark(q.x,q.y,q.z,0,.3,0,'#e6fff0',.4,.22)}}
    const tm=S2.TRI.get(),A=tm.geometry.attributes.position;pts.forEach((p,i)=>A.setXYZ(i,p.x,p.y-.05,p.z));A.needsUpdate=true;tm.material.opacity=.14*fa});
  /* Sửa Chữa Tàu: vòng xanh nở ra + hạt hồi máu bay lên quanh tàu */
  (C.halo||[]).forEach(h=>{const p=1-h.t/h.max,t=S2.TOR.get(),r=(h.u.size||2.2)*(.62+.25*p);t.position.set(h.u.x,HOV,h.u.y);t.scale.set(r,1+p*3,r);t.material.color.set(0x8fffe0);t.material.opacity=Math.max(0,1-p)*.9});
  units.forEach(u=>{const c=u.cs;if(!c||!(c.healFx>0))return;const r=(u.size||2.2)*.45;for(let i=0;i<2;i++){const a=t3*5+i*Math.PI+Math.random()*.3;spark(u.x+Math.cos(a)*r,HOV-.2,u.y+Math.sin(a)*r,0,1.6,0,i?'#8dffc0':'#e6fff0',.7,.26)}});
  /* Drone Hồi Phục: drone xanh + tia hồi máu nối về tàu */
  (C.rd||[]).forEach(d=>{const sc=Math.min(1,(d.max-d.t)*4+.05,d.t*4);if(sc<=0)return;const g=drone(d.x,d.y,'#5dffa1',sc,d.hf>0);beam2(g.position.clone(),V3(d.P),'#7dffb0',.05,sc*(.6+.3*Math.sin(t3*12)))});
  /* Drone Gây Nhiễu: drone bay tới rồi chiếu nón nhiễu xanh */
  (C.jm||[]).forEach(d=>{const al=Math.min(1,d.life*3),g=drone(d.x,d.y,'#8dffc0',al,d.hf>0,d.ang?-d.ang:undefined);
    if(d.ph==='beam'&&d.bt>0){const fa=Math.min(1,d.bt*4)*(.85+.15*Math.sin(t3*18)),c=S2.CONE.get();c.position.set(d.x,HOV+.3,d.y);c.rotation.set(0,-d.ang,0);c.scale.set(d.R,1,d.R);c.material.opacity=.7*fa}});
  /* Drone Săn Mồi (và drone khác của thuyền trưởng): drone 3D + tia bắn đỏ */
  (C.drones||[]).forEach(d=>{const al=Math.min(1,d.t*2,(d.max-d.t)*5+.2);const c=d.kami?'#b070ff':d.spr?'#5ab8ff':'#ff3a2a';const g=drone(d.x,d.y,c,al,d.hf>0,d.ang!=null?-(d.ang||0):undefined);
    if(d.bt>0&&d.tg&&!d.tg.dead)beam2(g.position.clone(),V3(d.tg),'#ff4a3a',.04,Math.min(1,d.bt*8)*al)});
  /* Truyền Năng Lượng: quả cầu vàng bay sang đồng minh */
  (C.eo||[]).forEach(b=>{const g=SK.ORB.get(),U=g.userData;g.position.set(b.x,HOV,b.y);U.gl.material.color.set(0xffd24a);U.gl.scale.setScalar(1.3);U.c.scale.setScalar(.85);U.rg.material.color.set(0xfff0a8);U.rg.rotation.set(t3*10,t3*7,0);if(Math.random()<.7)spark(b.x,HOV,b.y,rand(-.4,.4),rand(0,.6),rand(-.4,.4),'#ffd24a',.4,.25)});
  /* Phun Băng Làm Lạnh: nón hơi lạnh + tinh thể băng phun ra */
  (C.ice||[]).forEach(w=>{const p=1-w.t/w.max,rr=w.R*Math.min(1,p*3.5),fa=Math.min(1,w.t*3);if(rr<.2)return;const c=S2.CONE.get();c.position.set(w.x,HOV*.8,w.y);c.rotation.set(0,-w.ang,0);c.scale.set(rr,1,rr);c.material.color.set(0xbfe9ff);c.material.opacity=.8*fa;
    for(let i=0;i<3;i++){const a=w.ang+rand(-.38,.38),v=rand(6,11);spark(w.x,HOV*.8,w.y,Math.cos(a)*v,rand(-.2,.4),Math.sin(a)*v,Math.random()<.5?'#e6f8ff':'#8fd8ff',rr/v,.24)}});
  /* Liên Kết Xanh: tia xanh lam nối tàu với đồng minh + vòng sáng quanh từng tàu */
  (C.lb||[]).forEach(w=>{const fa=Math.min(1,w.t*3,(w.max-w.t)*6+.2);[P].concat(w.m).forEach(u=>{if(!u||u.dead)return;const t=S2.TOR.get();t.position.set(u.x,HOV,u.y);t.scale.setScalar((u.size||2.2)*.7);t.material.color.set(0x5aa8ff);t.material.opacity=fa*(.45+.25*Math.sin(t3*9))});
    w.m.forEach(u=>{if(!u||u.dead)return;beam2(V3(P),V3(u),'#5aa8ff',.07,fa)})});
  /* Nạp Đạn Nhanh / Cổ Vũ Phi Hành Đoàn: vòng vàng xoay nhanh quanh tàu khi tốc độ bắn đang tăng */
  units.forEach(u=>{const f=u.fr;if(!f||!(f.t>0))return;const t=S2.TOR.get(),big=f.p>.5;t.position.set(u.x,HOV-.1,u.y);t.scale.set((u.size||2.2)*(big?.72:.6),1,(u.size||2.2)*(big?.72:.6));t.rotation.y=t3*8;t.material.color.copy(col(big?'#ff9a3c':'#ffe98a'));t.material.opacity=.5+.3*Math.sin(t3*16);
    if(Math.random()<.4){const a=Math.random()*TAU,r=(u.size||2.2)*.6;spark(u.x+Math.cos(a)*r,HOV,u.y+Math.sin(a)*r,0,.8,0,big?'#ffb347':'#fff4b8',.35,.18)}});
  S2.B.end();S2.CLK.end();S2.AUR.end();S2.TRI.end();S2.TOR.end();S2.DR.end();S2.CONE.end()}

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
/* ===================== KỸ NĂNG 3D (đợt 3) =====================
   Phóng Lao Xanh · Dịch Chuyển Tức Thời Cơ Bản · Cứu Trong Gang Tấc · Gọi Bóng · Ba Cấp Tốc · Lướt Tốc Thả Thiên Thạch · Tăng Tốc Phi Đội
   · Phun Khói Lửa · Đánh Dấu Trụ Sở Kẻ Thù · Lướt Qua Nhau · Khiên Lục Giác Cơ Bản · Khiên Đón Đạn (+ khiên tròn / khiên đồng minh) */
let SK3=null;
function sk3Init(){if(SK3)return SK3;const AD=SK.AD;
  const hex=cvTex(256,128,(x)=>{x.clearRect(0,0,256,128);x.strokeStyle='rgba(200,240,255,.95)';x.lineWidth=2.2;const r=10,h=r*Math.sqrt(3);for(let row=-1;row<8;row++)for(let col=-1;col<16;col++){const cx=col*r*1.5,cy=row*h+(col%2?h/2:0);x.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;x[i?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath();x.stroke()}});
  hex.wrapS=hex.wrapT=T.RepeatWrapping;
  const streak=cvTex(16,128,(x)=>{const g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(160,220,255,.7)');g.addColorStop(1,'rgba(60,140,255,0)');x.fillStyle=g;x.fillRect(0,0,16,128)});
  const sm=(m)=>new T.MeshBasicMaterial({map:m,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false});
  const strG=new T.PlaneGeometry(1,1);strG.translate(0,-.5,0);strG.rotateX(-Math.PI/2);/* dải phẳng kéo dài về +z */
  const rock=rockGeo(1),rockM=new T.MeshStandardMaterial({color:lin(0x5a463a),roughness:.9,flatShading:true,emissive:lin(0x401000)});
  const arcG=new T.CylinderGeometry(1,1,1,40,1,true,-Math.PI/2,Math.PI);/* nửa vòng phía trước (mặt -z) */
  SK3={hex,
    STR:Pool(()=>{const g=new T.Group();[0,1,2].forEach(i=>{const m=new T.Mesh(strG,sm(streak));m.frustumCulled=false;g.add(m)});const gl=new T.Sprite(ADDM(glowT()));gl.material.color.set(0x50beff);g.add(gl);g.userData={gl};scene.add(g);return g}),
    BUB:Pool(()=>{const g=new T.Group(),s=new T.Mesh(SHG,AD(0x9fe3ff,.15)),h=new T.Mesh(SHG,new T.MeshBasicMaterial({map:hex,color:0x9fe3ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false})),r=new T.Mesh(new T.TorusGeometry(1,.02,6,48).rotateX(Math.PI/2),AD(0xcfefff,.8));g.add(s,h,r);g.userData={s,h,r};scene.add(g);return g}),
    MET:Pool(()=>{const g=new T.Group(),m=new T.Mesh(rock,rockM),f=new T.Sprite(ADDM(glowT()));m.scale.setScalar(.22);m.castShadow=true;f.material.color.set(0xff9a3c);f.scale.setScalar(.9);g.add(m,f);g.userData={m,f};scene.add(g);return g}),
    FIRE:Pool(()=>{const m=new T.Mesh(strG,sm(SK.disc));m.material.color.set(0xff7a22);m.frustumCulled=false;scene.add(m);return m}),
    PATH:Pool(()=>{const m=new T.Mesh(strG,AD(0xffd24a,.35));m.frustumCulled=false;scene.add(m);return m}),
    CHV:Pool(()=>{const m=new T.Mesh(new T.ConeGeometry(.16,.34,3).rotateX(-Math.PI/2).rotateY(Math.PI),AD(0xffd24a,1));scene.add(m);return m}),
    COL:Pool(()=>{const m=new T.Mesh(new T.CylinderGeometry(1,1,1,16,1,true),new T.MeshBasicMaterial({map:SK.wall,color:0xff4a4a,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));scene.add(m);return m}),
    ARC:Pool(()=>{const g=new T.Group(),a=new T.Mesh(arcG,new T.MeshBasicMaterial({map:hex,color:0x4aa8ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false})),b=new T.Mesh(arcG,AD(0xbfe9ff,.25));g.add(a,b);g.userData={a,b};scene.add(g);return g})};
  return SK3}
/* vệt phản lực xanh phía sau tàu (Phóng Lao Xanh, lướt, tăng tốc) */
function jet(u,dx,dz,big,c){const g=SK3.STR.get(),y=u.ang!=null?1:1;g.position.set(u.x,HOV,u.y);g.rotation.set(0,Math.atan2(-dx,-dz),0);const r=(u.size||2.2)*.5,L=r*(big?2.4:1.6)*(1+.15*Math.sin(t3*30));
  g.children.forEach((m,i)=>{if(!m.isMesh)return;const k=i-1;m.position.set(k*r*.45,0,0);m.scale.set(r*(k?.28:.42),1,L*(k?.8:1));m.material.color.copy(col(c))});g.userData.gl.scale.setScalar(r*2.6);g.userData.gl.material.color.copy(col(c));g.userData.gl.material.opacity=big?.6:.35}
function skill3d3(G,dt){const C=G.csk,P=G.pl;if(!C)return;sk3Init();const S3=SK3,units=[P].concat(G.al||[]).filter(u=>u&&!u.dead);
  /* Phóng Lao Xanh / lướt (Lướt Tốc, Lướt Qua Nhau): 3 vệt phản lực dài; Ba Cấp Tốc và tăng tốc khác: vệt ngắn */
  units.forEach(u=>{const c=u.cs||{};let dx=0,dz=0,big=false;
    if(c.glT>0&&c.gld){dx=c.gld[0];dz=c.gld[1];big=true}else if(c.lao>0){const l=Math.hypot(u.vx||0,u.vy||0);if(l>.5){dx=u.vx/l;dz=u.vy/l}else{dx=-Math.cos(u.ang||0);dz=-Math.sin(u.ang||0);dx=-dx;dz=-dz}big=true}
    else if((u.boostT>0)||(u.spb&&u.spb.t>0)||c.dash>0){const l=Math.hypot(u.vx||0,u.vy||0);if(l>.5){dx=u.vx/l;dz=u.vy/l}}
    if(dx||dz)jet(u,dx,dz,big,big?'#50beff':'#9fe0ff');
  /* khiên của tàu: khiên tròn (Dịch Chuyển Tức Thời...), khiên lục giác, khiên đồng minh xanh lá; vàng khi đang bất tử (Cứu Trong Gang Tấc) */
    const ab=c.abs&&c.abs.t>0&&c.abs.v>0,sd=u.shd&&u.shd.t>0&&u.shd.v>0,inv=c.inv>0;
    if(ab||sd||inv){const g=S3.BUB.get(),U=g.userData,rr=(u.size||2.2)*.62*1.2*(1+.03*Math.sin(t3*6)),f=ab?Math.min(1,c.abs.v/Math.max(1,c.abs.max)):sd?Math.min(1,u.shd.v/Math.max(1,u.shd.max)):1,cc=inv?'#ffd24a':ab?((c.hexc&&HXC[c.hexc])||'#9fe3ff'):'#8dffc0';
      g.position.set(u.x,HOV,u.y);g.scale.set(rr,rr*.7,rr);U.s.material.color.copy(col(cc));U.s.material.opacity=.08+.12*f;U.h.visible=!!(ab&&c.hexc);U.h.material.opacity=.35+.4*f;U.h.material.map.offset.x=t3*.05;
      U.r.material.color.copy(col(cc));U.r.rotation.y=t3*2;U.r.material.opacity=.5+.4*f}});
  /* Khiên Đón Đạn: tấm khiên cong 180° phía trước mũi tàu */
  units.forEach(u=>{const a=u.cs&&u.cs.arc;if(!a||!(a.t>0))return;const g=S3.ARC.get(),U=g.userData,R=(u.size||2.2)*.75,f=Math.min(1,a.v/a.max),fa=Math.min(1,a.t*3);g.position.set(u.x,HOV,u.y);g.rotation.set(0,Math.atan2(Math.cos(u.ang||0),Math.sin(u.ang||0)),0);g.scale.set(R,.9,R);
    U.a.material.color.copy(col(a.hf>0?'#ffffff':'#4aa8ff'));U.a.material.opacity=fa*(.5+.4*f);U.b.material.opacity=fa*.25});
  /* Lướt Tốc Thả Thiên Thạch: thiên thạch rực lửa rơi từ trên cao xuống mục tiêu */
  (C.met||[]).forEach(m=>{const t=m.tg;if(!t||m.a<m.d)return;const p=Math.min(1,(m.a-m.d)/m.f),lx=t.x+m.ox,lz=t.y+m.oy,g=S3.MET.get(),U=g.userData;
    g.position.set(lx-2.4*(1-p),HOV*.6+9*(1-p),lz-3.2*(1-p));U.m.rotation.set(t3*4,t3*3,0);U.f.scale.setScalar(.9+.3*Math.random());smoke(g.position.x,g.position.y,g.position.z,.6,.35);spark(g.position.x,g.position.y,g.position.z,rand(-.5,.5),1,rand(-.5,.5),'#ff9a3c',.3,.3)});
  /* Tăng Tốc Phi Đội: vòng xanh lan ra kèm mũi tên chạy ra ngoài */
  (C.sr||[]).forEach(w=>{const p=1-w.t/w.max,rr=w.R*Math.min(1,Math.sqrt(p*2.2)),fa=Math.min(1,w.t*2.2);if(rr<.1)return;const g=SK.R.get(),U=g.userData;g.position.set(w.P.x,HOV*.5,w.P.y);U.a.scale.set(rr,.7,rr);U.b.scale.setScalar(rr);U.a.material.color.set(0x5ad8ff);U.b.material.color.set(0xbff0ff);U.a.material.opacity=.6*fa;U.b.material.opacity=fa;
    for(let i=0;i<8;i++){const a=i*Math.PI/4+p*.6,rad=rr*(.45+.4*((p*1.5+i/8)%1)),c=S3.CHV.get();c.position.set(w.P.x+Math.cos(a)*rad,HOV*.5,w.P.y+Math.sin(a)*rad);c.rotation.set(0,Math.atan2(Math.cos(a),Math.sin(a)),0);c.material.color.set(0xe6fbff);c.material.opacity=fa}});
  /* Phun Khói Lửa: vệt lửa cháy trên đường bay, lửa bốc lên */
  (C.fseg||[]).forEach(sg=>{const a=Math.max(0,Math.min(1,sg.t/.8,(sg.max-sg.t)*6+.25)),dx=sg.x2-sg.x1,dz=sg.y2-sg.y1,L=Math.hypot(dx,dz)||.01,m=S3.FIRE.get();m.position.set(sg.x1,.08,sg.y1);m.rotation.set(0,Math.atan2(dx,dz),0);m.scale.set(.9,1,L);m.material.opacity=a;
    if(Math.random()<.5*a){const u=Math.random();spark(sg.x1+dx*u+rand(-.2,.2),.2,sg.y1+dz*u+rand(-.2,.2),0,rand(.8,1.6),0,Math.random()<.5?'#ffd060':'#ff7a22',.5,.3)}});
  /* Đánh Dấu Trụ Sở Kẻ Thù: đường dẫn vàng trên sàn tới trụ sở địch, mũi tên chạy, cột sáng đỏ trên trụ sở địch */
  if(C.mk&&G.eh){const mk=C.mk,pts=mk.path||[],fa=Math.min(1,mk.t*1.5,(mk.max-mk.t)*3+.2);let acc=0;
    for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b.x-a.x,dz=b.y-a.y,L=Math.hypot(dx,dz)||.01,m=S3.PATH.get();m.position.set(a.x,.06,a.y);m.rotation.set(0,Math.atan2(dx,dz),0);m.scale.set(.5,1,L);m.material.opacity=.3*fa;
      for(let d=(2.2-((acc+t3*2.2)%2.2));d<L;d+=2.2){const c=S3.CHV.get();c.position.set(a.x+dx/L*d,.25,a.y+dz/L*d);c.rotation.set(0,Math.atan2(dx,dz),0);c.material.color.set(0xffd24a);c.material.opacity=fa*.9}acc+=L}
    const h=G.eh,c=S3.COL.get();c.position.set(h.x,3,h.y);c.scale.set(.8,6,.8);c.material.opacity=.6*fa*(.8+.2*Math.sin(t3*6))}
  S3.STR.end();S3.BUB.end();S3.MET.end();S3.FIRE.end();S3.PATH.end();S3.CHV.end();S3.COL.end();S3.ARC.end()}
/* ===================== KỸ NĂNG 3D (đợt 4) =====================
   Sóng Khiên Trụ · Vòng Chặn Tên Lửa · Giáp Tổ Ong Vàng · Khiên Đội Hình · Khiên Phản Xung · Hồi Phục Thoáng Chốc · Thu Hút Hỏa Lực
   · Khiên Phản Sát Thương · Đạn Sao Xanh */
let SK4=null;
function sk4Init(){if(SK4)return SK4;const AD=SK.AD,sm=(m,c)=>new T.MeshBasicMaterial({map:m,color:c||0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false});
  const pil=new T.PlaneGeometry(.08,1);pil.translate(0,.5,0);
  const arc=new T.TorusGeometry(1,.035,6,24,1.8);arc.rotateX(Math.PI/2);
  const tail=new T.ConeGeometry(1,1,12,1,true);tail.translate(0,-.5,0);tail.rotateX(Math.PI/2);/* đỉnh ở gốc, loe về +z */
  SK4={
    PIL:Pool(()=>{const g=new T.Group();for(let i=0;i<14;i++){const m=new T.Mesh(pil,sm(SK.wall,0x8fd8ff));m.frustumCulled=false;g.add(m)}scene.add(g);return g}),
    PLK:Pool(()=>{const g=new T.Group(),a=new T.Mesh(new T.BoxGeometry(1,1,1),sm(SK3.hex,0x4aa8ff)),b=new T.Mesh(new T.BoxGeometry(1,1,1),AD(0xcfeeff,.25));g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    ARC:Pool(()=>{const m=new T.Mesh(arc,AD(0xd9a6ff,.6));scene.add(m);return m}),
    SB:Pool(()=>{const g=new T.Group(),c=new T.Sprite(ADDM(glowT())),t=new T.Mesh(tail,sm(SK3?null:null,0x50aaff)),r=new T.Mesh(new T.TorusGeometry(1,.03,6,24,2.5).rotateX(Math.PI/2),AD(0x78dcff,.85));
      t.material=AD(0x50aaff,.55);c.material.color.set(0xdff4ff);g.add(c,t,r);g.userData={c,t,r};scene.add(g);return g})};
  const torus=new T.TorusGeometry(1,.04,8,64);torus.rotateX(Math.PI/2);
  SK4.TOR=Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m});
  SK4.BUB=Pool(()=>{const g=new T.Group(),s=new T.Mesh(SHG,AD(0x9fe3ff,.15)),h=new T.Mesh(SHG,sm(SK3.hex,0x9fe3ff)),r=new T.Mesh(new T.TorusGeometry(1,.02,6,48).rotateX(Math.PI/2),AD(0xcfefff,.8));g.add(s,h,r);g.userData={s,h,r};scene.add(g);return g});
  SK4.COL=Pool(()=>{const m=new T.Mesh(new T.CylinderGeometry(1,1,1,16,1,true),sm(SK.wall,0xff4a4a));scene.add(m);return m});
  return SK4}
const HXC={violet:'#b080ff',gold:'#ffd24a'};
function skill3d4(G,dt){const C=G.csk,P=G.pl;if(!C)return;sk4Init();const S4=SK4,units=[P].concat(G.al||[]).filter(u=>u&&!u.dead);
  /* Sóng Khiên Trụ: các cột sáng bật lên quanh tàu + 3 vòng sóng dâng lên */
  (C.cyl||[]).forEach(w=>{const p=1-w.t/w.max,r0=(w.P.size||2.2)*.6,fa=Math.min(1,w.t*2.5),g=S4.PIL.get();g.position.set(w.P.x,HOV-.4,w.P.y);
    g.children.forEach((m,i)=>{const a=i*TAU/14,rr=r0*(1+p*.6);m.position.set(Math.cos(a)*rr,0,Math.sin(a)*rr);m.rotation.y=-a;m.scale.set(1,(1.2+(i%3)*.5)*Math.min(1,p*2.5)*.6,1);m.material.opacity=fa*.85});
    for(let i=0;i<3;i++){const pp=Math.max(0,Math.min(1,p*1.4-i*.18)),t=S4.TOR.get();t.position.set(w.P.x,HOV-.4+pp*.5*i,w.P.y);t.scale.setScalar(r0*(1+pp*1.6));t.material.color.set(0x8fd8ff);t.material.opacity=fa*(1-pp*.6)}});
  units.forEach(u=>{const c=u.cs||{};
    /* Giáp Tổ Ong Vàng: khiên lục giác vàng bọc tàu */
    if(c.hcm&&c.hcm.t>0){const g=S4.BUB.get(),U=g.userData,rr=(u.size||2.2)*.78*(1+.03*Math.sin(t3*6)),f=Math.min(1,c.hcm.v/c.hcm.max);g.position.set(u.x,HOV,u.y);g.scale.set(rr,rr*.75,rr);
      U.s.material.color.set(0xffd24a);U.s.material.opacity=.1+.1*f;U.h.visible=true;U.h.material.color.set(0xffd24a);U.h.material.opacity=.45+.4*f+(c.hcm.hf>0?.3:0);U.h.material.map.offset.x=t3*.05;U.r.material.color.set(0xffe98a);U.r.material.opacity=.7}
    /* Khiên Đội Hình: tấm khiên mỏng dài 6 ô chắn phía trước */
    const a=c.plank;if(a&&a.t>0&&a.cx!=null){const g=S4.PLK.get(),U=g.userData,f=Math.min(1,a.v/a.max),fa=Math.min(1,a.t*3);g.position.set(a.cx,HOV,a.cy);g.rotation.set(0,Math.atan2(a.ux,a.uy)+Math.PI/2,0);g.scale.set(6,1.1,.12);
      U.a.material.color.copy(col(a.hf>0?'#ffffff':'#4aa8ff'));U.a.material.opacity=fa*(.55+.35*f);U.b.material.opacity=fa*.25}
    /* Thu Hút Hỏa Lực: vòng tím co dần vào tàu, các cung tím xoay quanh, cột sáng tím */
    if(c.taunt>0){const fa=Math.min(1,c.taunt*2.5);for(let i=0;i<3;i++){const p=((t3*.8+i/3)%1),R=4.4*(1-p)+1.2,t=S4.TOR.get();t.position.set(u.x,HOV,u.y);t.scale.setScalar(R);t.material.color.copy(col(i%2?'#a060ff':'#7a3cff'));t.material.opacity=fa*Math.sin(p*Math.PI)*.45}
      for(let i=0;i<6;i++){const an=i*Math.PI/3+t3*.9,m=S4.ARC.get();m.position.set(u.x+Math.cos(an)*3.2,HOV,u.y+Math.sin(an)*3.2);m.scale.setScalar(1.6);m.rotation.y=-(an+Math.PI-.9);m.material.color.set(0x9a5cff);m.material.opacity=fa*.4}
      const col2=S4.COL.get();col2.position.set(u.x,HOV+1.4,u.y);col2.scale.set(.5,2.8,.5);col2.material.color.set(0xb070ff);col2.material.opacity=.35*fa}});
  /* Đạn Sao Xanh: sao chổi xanh có lõi sáng, đuôi loe và vòng xoay phía trước */
  (C.sb||[]).forEach(b=>{if(b.done)return;const g=S4.SB.get(),U=g.userData,L=Math.min(b.d+1.2,5);g.position.set(b.x,HOV,b.y);g.rotation.set(0,Math.atan2(-b.vx,-b.vy),0);
    U.c.scale.set(.9,.9,1);U.t.scale.set(.2,.2,L);U.t.position.z=0;U.r.scale.setScalar(.55);U.r.position.z=-.15;U.r.rotation.z=t3*6;if(Math.random()<.6)spark(b.x,HOV,b.y,rand(-.3,.3),rand(-.2,.3),rand(-.3,.3),'#8fe0ff',.35,.2)});
  S4.PIL.end();S4.PLK.end();S4.ARC.end();S4.SB.end();S4.TOR.end();S4.BUB.end();S4.COL.end()}
/* ===================== KỸ NĂNG 3D (đợt 5) — nhóm đạn / tia / vùng kỹ năng =====================
   Cặp Tia Đỏ · Đạn Lửa Ba · Viên Đạn Vàng · Cầu Sét Lam · Tên Lửa Đôi · Chùm Laser Lam · Sét Chuỗi Cơ Bản · Mưa Đạn Đỏ
   (bộ dựng chung này cũng áp dụng cho các đạn / tia / vùng cùng loại của kỹ năng phía sau: Đạn Xuyên Thời Không, Đạn Choáng Diện Rộng,
   Tia Sét Ba Nhánh, Pháo Lửa Trình Diễn, Vòng Cung Đỏ, Tia Nảy Thời Không, Tên Lửa Nhắm Mục Tiêu...) */
let SK5=null;
const VBC={fire:'#ff8a2a',gold:'#ffd34a',rbul:'#ff4a4a',sil:'#dfeaff',stb:'#c79bff',pyro:'#ff8a2a',bolt:'#9fe0ff',lring:'#6fd0ff',brk:'#8fdcff',vb:'#9a5cff',comet:'#6fd0ff',shd:'#bfeaff'};
function sk5Init(){if(SK5)return SK5;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true);
  const mb=new T.CylinderGeometry(.054,.054,.375,8);mb.rotateX(Math.PI/2);const mc=new T.ConeGeometry(.054,.15,8);mc.rotateX(-Math.PI/2);mc.translate(0,0,-.26);
  const mkB=()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g};
  SK5={B:Pool(mkB),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    MS:Pool(()=>{const g=new T.Group(),a=new T.Mesh(mb,MT.gray),b=new T.Mesh(mc,MT.red),f=new T.Sprite(ADDM(glowT()));f.material.color.set(0xff7a3c);f.position.z=.21;f.scale.set(.66,.66,1);g.add(a,b,f);scene.add(g);return g}),
    ZN:Pool(()=>{const g=new T.Group(),w=new T.Mesh(new T.CylinderGeometry(1,1,1,48,1,true),new T.MeshBasicMaterial({map:SK.wall,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false})),
      d=new T.Mesh(new T.CircleGeometry(1,48).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:SK.disc,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false})),
      hole=new T.Mesh(new T.SphereGeometry(1,24,16),new T.MeshBasicMaterial({color:0x000000})),rim=new T.Mesh(new T.TorusGeometry(1,.04,6,48).rotateX(Math.PI/2),AD(0xc9a0ff,.9));g.add(w,d,hole,rim);g.userData={w,d,hole,rim};scene.add(g);return g})};
  return SK5}
function beam5(a,b,c,w,o){const g=SK5.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap5(a,b,c,o,seed){const n=8,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();const fr=Math.floor(t3*30);
  for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(seed*13+i*7.3+fr*3.1)*.35:0,up=i<n?Math.cos(seed*7+i*5.1+fr*2.3)*.25:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam5(p0,p1,c,.07,o);p0=p1}
  const h=SK5.DOT.get();h.position.copy(b);h.scale.setScalar(1.1);h.material.color.copy(col(c));h.material.opacity=o}
function skill3d5(G,dt){const V=G.csk&&G.csk.vf;if(!V)return;sk5Init();const S5=SK5,Y=HOV;
  /* tia: Cặp Tia Đỏ (2 tia đỏ lệch), Cầu Sét Lam / Sét Chuỗi (sét gấp khúc), Chùm Laser Lam (laser xanh dài), Tia Nảy, Vòng Cung Đỏ */
  (V.l||[]).forEach(l=>{
    if(l.k==='arcr'){const p=1-Math.max(0,l.t)/l.max,cur=l.a0-Math.PI/2+Math.PI*p,fa=Math.min(1,l.t/.15),a=new T.Vector3(l.P.x,Y,l.P.y),b=new T.Vector3(l.P.x+Math.cos(cur)*4,Y,l.P.y+Math.sin(cur)*4);beam5(a,b,'#ff2832',.32,fa);
      for(let k=1;k<5;k++){const c2=cur-k*.12;if(c2<l.a0-Math.PI/2)break;beam5(a,new T.Vector3(l.P.x+Math.cos(c2)*4,Y,l.P.y+Math.sin(c2)*4),'#ff2832',.2,fa*.25*(1-k/5))}return}
    if(l.k==='lbeam'){const p=1-l.t/l.max;beam5(new T.Vector3(l.x,Y,l.y),new T.Vector3(l.ex,Y,l.ey),'#3a8cff',.45*(1-p*.6),1-p);return}
    if(!l.tg||l.tg.dead)return;const p=1-l.t/l.max,a=new T.Vector3(l.P.x,Y,l.P.y),b=new T.Vector3(l.tg.x,Y,l.tg.y);
    if(l.k==='lzr'){beam5(a,b,'#3a8cff',.25*(1-p*.4),1-p);const h=S5.DOT.get();h.position.copy(b);h.scale.setScalar(1.2);h.material.color.set(0x5ab4ff);h.material.opacity=1-p;return}
    if(l.k==='beam'){const d=b.clone().sub(a),L=d.length()||1,o=new T.Vector3(-d.z/L*.22*l.off,0,d.x/L*.22*l.off);beam5(a.clone().add(o),b,'#ff2d3a',.1*(1-p*.5),(1-p)*(.75+.25*Math.sin(t3*60)));const h=S5.DOT.get();h.position.copy(b);h.scale.setScalar(.8*(1-p)+.2);h.material.color.set(0xff6a5a);h.material.opacity=1-p;return}
    zap5(a,b,'#5aa8ff',1-p,l.seed||1)});
  /* đạn kỹ năng: lõi sáng + vệt sáng theo đường bay; tên lửa 3D có khói; sao chổi rơi từ trên xuống */
  (V.b||[]).forEach(b=>{if(b.done)return;const k=b.k;
    if(k==='msl'||k==='msl3'||k==='msl9'||k==='rmsl'){const m=S5.MS.get(),an=b.a!=null?b.a:Math.atan2(b.vy||0,b.vx||1);m.position.set(b.x,Y,b.y);m.rotation.set(0,Math.atan2(-Math.cos(an),-Math.sin(an)),0);if(Math.random()<.9)smoke(b.x,Y,b.y,rand(.5,.9),.32);return}
    const c=VBC[k]||'#ffb347';let y=Y;if(k==='comet'){const pp=Math.min(1,b.p||0);y=Y+9*(1-pp*pp)}
    const hd=S5.DOT.get();hd.position.set(b.x,k==='comet'?y:Y,k==='comet'?(b.ty!=null?b.ty:b.y):b.y);hd.scale.setScalar(k==='gold'||k==='comet'?1.1:k==='vb'?1:.75);hd.material.color.copy(col(c));hd.material.opacity=1;
    (b.h||[]).forEach((p,i)=>{if(i%1)return;const s=S5.DOT.get(),f=1-i/((b.h.length||1)+1);s.position.set(p.x,k==='comet'?hd.position.y+i*.9:Y,k==='comet'?hd.position.z:p.y);s.scale.setScalar(.6*f+.15);s.material.color.copy(col(c));s.material.opacity=.7*f});
    if(k==='fire'||k==='pyro'){if(Math.random()<.5)spark(b.x,Y,b.y,rand(-.4,.4),rand(.2,.8),rand(-.4,.4),Math.random()<.5?'#ffd060':'#ff6a1a',.35,.22)}
    else if(k==='vb'){if(Math.random()<.6)spark(b.x,Y,b.y,rand(-.5,.5),rand(-.3,.3),rand(-.5,.5),'#b98cff',.3,.2)}});
  /* vùng kỹ năng: mưa đạn đỏ, vùng lửa, hố đen, vùng thời gian, vùng điện, cầu lửa */
  (V.z||[]).forEach(z=>{const a=Math.min(1,z.t/.6),g=S5.ZN.get(),U=g.userData,r=z.r;g.position.set(z.x,0,z.y);const K={rain:['#ff3c3c','#ff7a5a'],fire4:['#ff6a14','#ffb347'],hole:['#7a3cff','#c9a0ff'],clock:['#5ab4ff','#cfe9ff'],circ:['#3a8cff','#dff3ff']}[z.k]||['#ff6e14','#ffe678'];
    U.w.scale.set(r,z.k==='hole'?.6:1.2,r);U.w.position.y=z.k==='hole'?.3:.6;U.w.material.color.copy(col(K[0]));U.w.material.opacity=.5*a;U.d.scale.setScalar(r);U.d.position.y=.05;U.d.material.color.copy(col(K[0]));U.d.material.opacity=.9*a;
    U.hole.visible=z.k==='hole';U.rim.visible=z.k==='hole'||z.k==='clock';U.rim.scale.setScalar(r);U.rim.position.y=Y*.5;U.rim.material.color.copy(col(K[1]));U.rim.material.opacity=.8*a;U.rim.rotation.y=t3*1.5;
    if(z.k==='hole'){U.hole.scale.setScalar(r*.6);U.hole.position.y=Y*.5;for(let i=0;i<2;i++){const an=Math.random()*TAU,pr=(z.pull||r*3)*rand(.5,1);const x=z.x+Math.cos(an)*pr,zz=z.y+Math.sin(an)*pr;spark(x,Y*.5,zz,(z.x-x)*1.4,0,(z.y-zz)*1.4,K[1],.6,.22)}}
    else if(z.k==='rain'){for(let i=0;i<2;i++){const an=Math.random()*TAU,rr=r*Math.sqrt(Math.random()),x=z.x+Math.cos(an)*rr,zz=z.y+Math.sin(an)*rr;spark(x-1,5,zz-1.5,3.3,-9,5,K[1],.5,.25)}}
    else if(z.k==='circ'){if(Math.random()<.5){const an=Math.random()*TAU;zap5(new T.Vector3(z.x+Math.cos(an)*r*.95,.3,z.y+Math.sin(an)*r*.95),new T.Vector3(z.x+Math.cos(an+1)*r*.3,.5,z.y+Math.sin(an+1)*r*.3),'#bfe6ff',.8,Math.random()*9)}}
    else for(let i=0;i<2;i++){const an=Math.random()*TAU,rr=r*.9*Math.sqrt(Math.random());spark(z.x+Math.cos(an)*rr,.15,z.y+Math.sin(an)*rr,0,rand(1,2.2),0,Math.random()<.5?K[1]:K[0],.6,.3)}});
  /* đốt cháy trên tàu địch (Cặp Tia Đỏ...): lửa bốc lên trên thân tàu */
  (V.d||[]).forEach(o=>{const e=o.e;if(!e||e.dead)return;if(Math.random()<.5){const r=(e.size||2)*.35;spark(e.x+rand(-r,r),Y,e.y+rand(-r,r),0,1.3,0,o.col||'#ff5a1a',.45,.26)}});
  S5.B.end();S5.DOT.end();S5.MS.end();S5.ZN.end()}
R3.tlbOn=()=>!!R3.live;

/* ---------- nối vào vòng vẽ trận ---------- */
function btn(){const b=document.getElementById('df3b');if(!b)return;b.textContent=R3.fail?'2D':(R3.on?'3D':'2D');b.setAttribute('aria-pressed',String(R3.on&&!R3.fail));b.title=R3.fail?'Máy không hỗ trợ đồ họa 3D':(R3.on?'Đang xem 3D · chạm để về 2D':'Đang xem 2D · chạm để xem 3D')}
{const z=document.getElementById('dfzo');if(z){const b=document.createElement('button');b.className='dfb';b.id='df3b';b.style.cssText='font-weight:900;font-size:12px';z.parentNode.insertBefore(b,z);
  b.onclick=()=>{if(R3.fail){toast('Máy không hỗ trợ đồ họa 3D, đang dùng 2D');return}R3.on=!R3.on;try{localStorage.setItem('se3d',R3.on?'1':'0')}catch(e){}btn()};btn()}}
function off(){R3.live=false;if(cv3)cv3.style.display='none';const r=document.getElementById('df3r');if(r)r.style.display='none';try{hud(null,false)}catch(e){}if(stick)stick.style.display='none';R3.joy.id=null;if(intelEl)intelEl.style.display='none'}
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
