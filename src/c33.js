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
  try{const ne=NEB.clone();ne.mapping=T.EquirectangularReflectionMapping;ne.needsUpdate=true;const pm=new T.PMREMGenerator(ren);scene.environment=pm.fromEquirectangular(ne).texture;pm.dispose()}catch(e){console.error(e)}
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
/* đầu tháp pháo 3D: bệ cố định, đầu tháp + nòng nằm trong một trục xoay 360° (xoay theo hướng ngắm) */
let GM=null;function gunMats(){if(GM)return GM;GM={steel:new T.MeshStandardMaterial({color:lin(0x3c4656),metalness:.92,roughness:.3}),dark:new T.MeshStandardMaterial({color:lin(0x1c222c),metalness:.85,roughness:.45}),
  trim:new T.MeshStandardMaterial({color:lin(0x9aa6b8),metalness:.95,roughness:.2}),glow:new T.MeshStandardMaterial({color:lin(0x7fe8ff),emissive:lin(0x4fd6ff),emissiveIntensity:2}),hot:new T.MeshStandardMaterial({color:lin(0xffb066),emissive:lin(0xff7a20),emissiveIntensity:1.6})};return GM}
function barrel(pv,r,L,x,y,z,M){const g=new T.Group(),b=new T.Mesh(new T.CylinderGeometry(r*.85,r,L,16),M.steel),sl=new T.Mesh(new T.CylinderGeometry(r*1.35,r*1.35,L*.28,16),M.dark),mz=new T.Mesh(new T.CylinderGeometry(r*1.25,r*1.1,L*.14,16),M.trim),ho=new T.Mesh(new T.CylinderGeometry(r*.55,r*.55,.02,12),M.dark);
  [b,sl,mz,ho].forEach(m=>{m.rotation.x=Math.PI/2;m.castShadow=true;g.add(m)});b.position.z=-L/2;sl.position.z=-L*.14;mz.position.z=-L+L*.07;ho.position.z=-L-.005;g.position.set(x,y,z);pv.add(g);return g}
function sbuild(tt,w,h,mat){const g=new T.Group(),W=w,D=h,mn=Math.min(w,h);let top=.5,ex={};
  const add=(geo,y,x,z,par)=>{x=x||0;z=z||0;geo.translate(x,y,z);proj(geo,W,D,0,0);const m=new T.Mesh(geo,mat);m.castShadow=m.receiveShadow=true;(par||g).add(m);return m};
  const box=(a,b,c,y,par)=>add(new T.BoxGeometry(a,b,c),y+b/2,0,0,par),cyl=(r0,r1,hh,y,seg,par)=>add(new T.CylinderGeometry(r0,r1,hh,seg||40,1),y+hh/2,0,0,par);
  /* tạo trục xoay cho đầu tháp; hình gốc vẫn chiếu đúng lên nóc đầu tháp */
  const turret=(kind,hr,hh,y0)=>{const M=gunMats(),pv=new T.Group();g.add(pv);ex.pv=pv;cyl(hr,hr*1.06,hh,y0,40,pv);const ry=y0+hh*.55;
    const ring=new T.Mesh(new T.TorusGeometry(hr*1.04,.025,6,40),M.dark);ring.rotation.x=Math.PI/2;ring.position.y=y0+.02;pv.add(ring);
    if(kind==='laser'||kind==='beam'){const em=new T.Mesh(new T.BoxGeometry(mn*.22,mn*.16,mn*.42),M.steel);em.position.set(0,ry+.05,-hr*.75);em.castShadow=true;pv.add(em);
      [-1,1].forEach(sg=>{const f=new T.Mesh(new T.BoxGeometry(mn*.04,mn*.2,mn*.36),M.dark);f.position.set(sg*mn*.13,ry+.05,-hr*.75);pv.add(f)});
      const ln=new T.Mesh(new T.CylinderGeometry(mn*.06,mn*.06,.03,20),M.glow);ln.rotation.x=Math.PI/2;ln.position.set(0,ry+.05,-hr*.75-mn*.22);pv.add(ln);const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x7fe8ff);s.scale.setScalar(mn*.5);s.position.copy(ln.position);pv.add(s);ex.glow=s}
    else if(kind==='rail'){[-1,1].forEach(sg=>{const r=new T.Mesh(new T.BoxGeometry(mn*.05,mn*.08,mn*.75),M.trim);r.position.set(sg*mn*.07,ry,-hr*.4-mn*.3);r.castShadow=true;pv.add(r)});const c=new T.Mesh(new T.BoxGeometry(mn*.06,mn*.03,mn*.7),M.glow);c.position.set(0,ry,-hr*.4-mn*.3);pv.add(c)}
    else if(kind==='missile'){const pod=new T.Mesh(new T.BoxGeometry(mn*.42,mn*.26,mn*.36),M.steel);pod.position.set(0,ry+.06,-hr*.35);pod.castShadow=true;pv.add(pod);
      for(let i=0;i<4;i++){const t=new T.Mesh(new T.CylinderGeometry(mn*.05,mn*.05,.02,12),M.hot);t.rotation.x=Math.PI/2;t.position.set((i%2?1:-1)*mn*.1,ry+.06+(i<2?1:-1)*mn*.06,-hr*.35-mn*.185);pv.add(t)}}
    else if(kind==='flame'){barrel(pv,mn*.09,mn*.34,0,ry,-hr*.55,M);const n=new T.Mesh(new T.ConeGeometry(mn*.13,mn*.14,16,1,true),M.dark);n.rotation.x=-Math.PI/2;n.position.set(0,ry,-hr*.55-mn*.38);pv.add(n)}
    else if(kind==='heavy'){barrel(pv,mn*.085,mn*.66,0,ry,-hr*.5,M)}
    else{[-1,1].forEach(sg=>barrel(pv,mn*.045,mn*.5,sg*mn*.075,ry,-hr*.55,M))}
    return y0+hh};
  switch(tt){
    case 'wall':{box(W*.98,.62,D*.98,0);top=.62;break}
    case 'cannon':{box(W*.98,.26,D*.98,0);top=turret('gun',mn*.34,.32,.26)+.1;break}
    case 'laser':{box(W*.98,.26,D*.98,0);cyl(mn*.4,mn*.42,.1,.26);top=turret('laser',mn*.32,.3,.36)+.1;break}
    case 'bigcannon':{box(W*.98,.26,D*.98,0);top=turret('heavy',mn*.42,.48,.26)+.1;break}
    case 'hq':{cyl(mn*.49,mn*.5,.26,0,64);cyl(mn*.36,mn*.39,.24,.26,64);cyl(mn*.17,mn*.2,.22,.5,6);const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x7fe8ff);s.scale.setScalar(mn*.4);s.position.y=.82;g.add(s);ex.glow=s;
      ex.shield=new T.Mesh(new T.SphereGeometry(mn*.78,40,20,0,TAU,0,Math.PI/2),new T.MeshBasicMaterial({color:0x4fd6ff,transparent:true,opacity:.05,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));g.add(ex.shield);
      const lamp=new T.PointLight(0x4fd6ff,1.2,10,2);lamp.position.y=1.4;g.add(lamp);top=.75;break}
    case 'mine':{cyl(mn*.45,mn*.47,.14,0,40);ex.sink=.14;top=.14;break}
    default:{const sp=typeof BT!=='undefined'&&BT[tt];
      if(sp){const k=sp.k,kind=k==='beam'?'beam':k==='rail'?'rail':k==='missile'?'missile':k==='shell'?'heavy':/flame|fire/.test(tt+(sp.t||''))?'flame':'gun';box(W*.98,.28,D*.98,0);top=turret(kind,mn*.34,.34,.28)+.1}
      else{box(W*.98,.34,D*.98,0);box(W*.74,.32,D*.74,.34);cyl(mn*.18,mn*.22,.2,.66,24);const s2=new T.Sprite(ADDM(glowT()));s2.material.color.set(0x7fe8ff);s2.scale.setScalar(mn*.45);s2.position.y=.95;g.add(s2);ex.glow=s2;top=.86}
      break}
    case 'pylon':{cyl(mn*.48,mn*.5,.14,0,48);cyl(mn*.3,mn*.33,.22,.14,40);cyl(mn*.15,mn*.18,.5,.36,32);const s=new T.Sprite(ADDM(glowT()));s.material.color.set(0x7fe8ff);s.scale.setScalar(mn*.4);s.position.y=.95;g.add(s);ex.glow=s;ex.sink=.86;top=.86;break}}
  return {g,top,ex}}
function collect(G){const L=[];
  const ships=G.en.filter(e=>e.spawn<=G.t&&!e.dead).concat(G.pl.dead?[]:[G.pl]).concat((G.al||[]).filter(a=>!a.dead));
  ships.forEach(e=>{if(!e.sh||!e.sh.img)return;L.push({o:e,k:'s',src:e.sh.img,m:model(e.sh.img,'s')})});
  const addB=(o,t,v,k)=>{const src=bSrc(t,v);if(!src)return;if(SB[t]||R3.allB!==false){const st=sprTex(src);L.push({o,k,t,src,m:st?{ready:true,sb:st}:null})}else L.push({o,k,t,src,m:model(src,'b')})};
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
  const sr=Math.max(ww,hh)*.62,sh=new T.Mesh(SHG,new T.MeshBasicMaterial({color:0x7fd8ff,transparent:true,opacity:.12,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide}));sh.scale.set(sr,Math.max(.75,sr*.62),sr);sh.visible=false;g.add(sh);U.shield=sh;const sw=new T.Mesh(SHW||(SHW=new T.IcosahedronGeometry(1.02,2)),new T.MeshBasicMaterial({color:0xbff0ff,wireframe:true,transparent:true,opacity:.28,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));sh.add(sw);U.shw=sw}
function mkInst(it){const g=new T.Group(),body=new T.Group();g.add(body);const U=g.userData={src:it.src,ph:Math.random()*6,body,fl:[],born:t3,k:it.k,o:it.o};
  if(it.k==='s'){const m=it.m;U.model=m;const hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;body.add(hull);U.hull=hull;mkShip(it,g,U)}
  else if(it.m.sb){const P=sbuild(it.t,it.o.w,it.o.h,it.m.sb.mat);body.add(P.g);U.sb=P;U.tt=it.t;U.top=P.top;U.mat=it.m.sb.mat}
  else{const m=it.m,o=it.o;U.model=m;const hull=new T.Mesh(m.geo,m.mat.clone());hull.customDepthMaterial=m.depth;hull.castShadow=true;hull.receiveShadow=true;const hy=.3*Math.sqrt(o.w*o.h);hull.scale.set(o.w*.98,hy,o.h*.98);body.add(hull);U.hull=hull;U.top=hy*1.1}
  scene.add(g);return g}
function drop(g){scene.remove(g);const U=g.userData;if(U.hull)U.hull.material.dispose();if(U.shield)U.shield.material.dispose();if(U.sb)U.sb.g.traverse(o=>{if(o.geometry&&o.isMesh)o.geometry.dispose()})}
/* ---------- camera bám sát phía sau tàu chính ---------- */
function camFollow(G,dt){const P=G.pl,dead=P.dead,f=dead?{x:G.hq.x,y:G.hq.y}:P;
  const mv=Math.hypot(P.vx||0,P.vy||0);if(R3.yawT==null)R3.yawT=R3.yaw;R3.yaw+=angDiff(R3.yaw,R3.yawT)*Math.min(1,dt*7);
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
function joyStep(G){const J=R3.joy,P=G.pl;if(J.id===null){keyStep(G);return}if(P.dead)return;const il=Math.hypot(J.x,J.y);if(il<.12){P.tx=P.x;P.ty=P.y;return}
  const a=R3.yaw,fx=-Math.sin(a),fz=-Math.cos(a),rx=Math.cos(a),rz=-Math.sin(a),dx=fx*-J.y+rx*J.x,dz=fz*-J.y+rz*J.x,k=Math.min(1,(il-.12)/.7),s=1.2+3.3*k;
  P.tx=clamp(P.x+dx*s,.5,G.wd.Wd-.5);P.ty=clamp(P.y+dz*s,.5,G.wd.Hd-.5)}
/* chạm trên màn hình 3D → đổi về đúng ô trên chiến trường */
function remap(e){if(!R3.live||e.target!==dfc||!cam)return;const r=dfc.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1);
  const rc=new T.Raycaster();rc.setFromCamera({x:nx,y:ny},cam);const p=new T.Vector3();if(!rc.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p))p.set(DG.pl.x-Math.sin(R3.yaw)*40,0,DG.pl.y-Math.cos(R3.yaw)*40);
  const cx=r.left+dsx(p.x)*r.width/dfV.w,cy=r.top+dsy(p.z)*r.height/dfV.h;try{Object.defineProperty(e,'clientX',{value:cx});Object.defineProperty(e,'clientY',{value:cy})}catch(er){}}
['pointerdown','pointermove','pointerup','click','mousedown','mousemove','mouseup','dblclick','contextmenu'].forEach(t=>addEventListener(t,remap,true));
/* phím W A S D / mũi tên: đi mượt theo hướng camera (cả đường chéo), Q / E xoay camera */
const KS={};const KD={w:[0,1],arrowup:[0,1],s:[0,-1],arrowdown:[0,-1],d:[1,0],arrowright:[1,0],a:[-1,0],arrowleft:[-1,0]};
function keyMap(e){if(!R3.live||(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)))return;const k=(e.key||'').toLowerCase();
  if(k==='q'||k==='e'){if(e.type==='keydown'&&!e.repeat)R3.yawT=(R3.yawT==null?R3.yaw:R3.yawT)+(k==='q'?-1:1)*Math.PI/4;e.stopImmediatePropagation();return}
  if(!KD[k])return;if(e.type==='keydown')KS[k]=1;else delete KS[k];e.stopImmediatePropagation();e.preventDefault();
  if(e.type==='keyup'&&!Object.keys(KS).length){try{const P=DG&&DG.pl;if(P){P.tx=P.x;P.ty=P.y}}catch(er){}}}
function keyStep(G){const P=G.pl;if(P.dead)return;let x=0,y=0;for(const k in KS){x+=KD[k][0];y+=KD[k][1]}const l=Math.hypot(x,y);if(!l)return;x/=l;y/=l;
  const a=R3.yaw,fx=-Math.sin(a),fz=-Math.cos(a),rx=Math.cos(a),rz=-Math.sin(a),dx=fx*y+rx*x,dz=fz*y+rz*x;P.tx=clamp(P.x+dx*4,.5,G.wd.Wd-.5);P.ty=clamp(P.y+dz*4,.5,G.wd.Hd-.5)}
addEventListener('keydown',keyMap,true);addEventListener('keyup',keyMap,true);addEventListener('blur',()=>{for(const k in KS)delete KS[k]});
/* chuột: giữ chuột phải kéo ngang để xoay camera, lăn bánh xe để phóng to / thu nhỏ */
{let rd=null;addEventListener('contextmenu',e=>{if(R3.live&&e.target===dfc){e.preventDefault();e.stopImmediatePropagation()}},true);
 addEventListener('mousedown',e=>{if(R3.live&&e.target===dfc&&e.button===2){rd={x:e.clientX,y0:R3.yawT==null?R3.yaw:R3.yawT};e.stopImmediatePropagation();e.preventDefault()}},true);
 addEventListener('mousemove',e=>{if(rd){R3.yawT=rd.y0-(e.clientX-rd.x)*.008;e.stopImmediatePropagation()}},true);
 addEventListener('mouseup',e=>{if(rd&&e.button===2){rd=null;e.stopImmediatePropagation()}},true);
 addEventListener('wheel',e=>{if(!R3.live||e.target!==dfc)return;R3.cd=clamp(R3.cd+(e.deltaY>0?.8:-.8),4.2,20);e.preventDefault()},{passive:false,capture:true})}
/* nút xoay camera trên màn hình (điện thoại) */
function rotBtns(){if(document.getElementById('df3rl'))return;const z=document.getElementById('dfzo');if(!z)return;[['df3rr','⟳',1],['df3rl','⟲',-1]].forEach(([id,t,sg])=>{const b=document.createElement('button');b.className='dfb';b.id=id;b.textContent=t;b.title=sg<0?'Xoay camera trái (Q)':'Xoay camera phải (E)';b.style.cssText='font-weight:900';
  b.onclick=e=>{e.stopPropagation();R3.yawT=(R3.yawT==null?R3.yaw:R3.yawT)+sg*Math.PI/4};z.parentNode.insertBefore(b,z.nextSibling)})}
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
let SHW=null,BUL,BC,BG,XS,XB,BAR,MS,RG,BMS={},TRL,ARW,SHL,IMP;
function pools(){if(BUL)return;
  /* đạn vạch sáng: thanh dài + quầng sáng (như bản mô phỏng) */
  const bg=new T.BoxGeometry(.085,.085,.85);
  BUL=Pool(()=>{const m=new T.Mesh(bg,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));const gl=new T.Sprite(ADDM(glowT()));gl.scale.set(.7,.7,1);m.add(gl);m.userData.gl=gl;scene.add(m);return m});
  const cyl=new T.CylinderGeometry(1,1,1,10,1,true);const bm=()=>{const m=new T.Mesh(cyl,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));m.frustumCulled=false;scene.add(m);return m};BC=Pool(bm);BG=Pool(bm);
  /* đạn 3D: vệt sáng kéo dài phía sau, mũi tên có cán + đầu + lông, đạn pháo kim loại có quầng lửa */
  TRL=Pool(bm);
  {const sh=new T.CylinderGeometry(.03,.03,1,6);sh.rotateX(Math.PI/2);const hd=new T.ConeGeometry(.08,.25,6);hd.rotateX(-Math.PI/2);hd.translate(0,0,-.6);const fl=new T.BoxGeometry(.16,.01,.18);fl.translate(0,0,.45);const fl2=fl.clone();fl2.rotateZ(Math.PI/2);
   const wm=new T.MeshStandardMaterial({color:lin(0x8a6a4a),roughness:.7}),mm=new T.MeshStandardMaterial({color:lin(0xdfe6ee),metalness:.9,roughness:.25});
   ARW=Pool(()=>{const g=new T.Group(),a=new T.Mesh(sh,wm),b=new T.Mesh(hd,mm),c=new T.Mesh(fl,new T.MeshBasicMaterial({color:0xffffff})),d=new T.Mesh(fl2,c.material),gl=new T.Sprite(ADDM(glowT()));gl.scale.setScalar(.5);gl.position.z=-.6;g.add(a,b,c,d,gl);g.userData={c,gl};scene.add(g);return g});
   const sb=new T.CylinderGeometry(.11,.11,.26,12);sb.rotateX(Math.PI/2);const sn=new T.SphereGeometry(.11,12,8,0,TAU,0,Math.PI/2);sn.rotateX(-Math.PI/2);sn.translate(0,0,-.13);
   SHL=Pool(()=>{const g=new T.Group(),a=new T.Mesh(sb,mm),b=new T.Mesh(sn,new T.MeshStandardMaterial({color:lin(0xffb066),emissive:lin(0xff7a20),emissiveIntensity:1.2})),gl=new T.Sprite(ADDM(glowT()));gl.scale.setScalar(.9);g.add(a,b,gl);g.userData={b,gl};g.scale.setScalar(1.3);scene.add(g);return g});
   const tg=new T.TorusGeometry(1,.04,6,40);tg.rotateX(Math.PI/2);IMP=Pool(()=>{const m=new T.Mesh(tg,new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m})}
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
  applyQ();const PV=R3.pv,w=PV?PV.w:(dfc.clientWidth||dfV.w),h=PV?PV.h:(dfc.clientHeight||dfV.h),pr=ren.getPixelRatio();if(cv3.width!==Math.round(w*pr)||cv3.height!==Math.round(h*pr))ren.setSize(w,h,false);
  if(R3.gid!==G){setWorld(G);seenFx=new WeakSet();R3.yaw=0;R3.yawT=0}pools();baseZ.visible=!PV;if(shadowP)shadowP.visible=!PV;if(PV)pvCam(G,PV);else{joyStep(G);camFollow(G,dt)}gTex.needsUpdate=true;
  sky.rotation.y+=dt*.004;planet.rotation.y+=dt*.01;(R3.rocks||[]).forEach(r=>{r.m.rotation.x+=r.sp.x*dt;r.m.rotation.y+=r.sp.y*dt});
  {const P=dust.geometry.attributes.position;for(let i=0;i<P.count;i+=5)P.setY(i,P.getY(i)+Math.sin(t3*.6+i)*.002);P.needsUpdate=true}
  const used=new Set();BH=[];
  L.forEach(it=>{if(!it.m)return;const o=it.o;let g=R3.inst.get(o);
    if(!g||g.userData.src!==it.src){if(g)drop(g);g=mkInst(it);R3.inst.set(o,g)}
    used.add(o);const U=g.userData;
    if(it.k==='s'){const M=U.hull.material,lf=o.lift||0;let sc=1+Math.min(1,lf)*.25;
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
      U.shield.visible=sf>0&&op>.3;if(U.shield.visible){U.sfl=o.hit>0?.3:Math.max(0,(U.sfl||0)-dt);U.shield.material.opacity=.08+.1*sf+U.sfl;if(U.shw){U.shw.material.opacity=.1+.16*sf+U.sfl*1.5;U.shw.rotation.y+=dt*.4}}
      const big=o.boss,bw=big?Math.max(2.9,o.size*1.2):Math.max(.9,o.size*.55),by=y+(big?3.7:1.1)*sc,bz=o.y,show=big||o.team!=='p'||o.hp<o.max||o===G.pl;
      if(show){bar(o.x,by,bz,bw+.04,1,'#0a1020',.75,big?.22:.14);bar(o.x,by,bz,bw,Math.max(0,o.hp/o.max),big?'#ff4d5e':o.team==='p'?(o===G.pl?'#5dffa1':'#5dffa1'):'#ff6a3c',1,big?.14:.085);if(sf>0)bar(o.x,by,bz,bw,sf,'#ffffff',.9,big?.14:.085)}
      if(o.epM!=null&&(o.ep<o.epM||o.exh>0)){bar(o.x,by-.12,bz,bw,1,'#0a1020',.7,.07);bar(o.x,by-.12,bz,bw,Math.max(0,o.ep/o.epM),o.exh>0?'#ffffff':'#35c8ff',1,.05)}}
    else{const b=o,isU=it.k==='u',tt=isU?b.bd.t:b.t;g.position.set(b.x,0,b.y);
      const fl=isU?(b.hit>0):(b.flash>0),H=b.u||b;let ry=0;if(!U.sb&&tt!=='hq'&&tt!=='wall'&&tt!=='mine'&&tt!=='pylon'&&H.da!=null&&Math.abs(b.w-b.h)<.01)ry=-(H.da+Math.PI/2);g.rotation.set(0,ry,0);
      if(U.sb&&U.sb.ex.pv){const want=H.da!=null?-(H.da+Math.PI/2):(U.aim==null?0:U.aim+dt*.25);U.aim=U.aim==null?want:U.aim+angDiff(U.aim,want)*Math.min(1,dt*10);U.sb.ex.pv.rotation.y=U.aim}
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
  const a=new T.Vector3(),b=new T.Vector3();
  G.pr.forEach(p=>{if(np++>capP)return;let st=PH.get(p);const tgtY=hAtW(p.x,p.y,HOV);if(!st){st={y:hAtW(p.x,p.y,HOV)};PH.set(p,st)}st.y+=(tgtY-st.y)*Math.min(1,dt*5);
    const yaw=Math.atan2(-(p.vx||0),-(p.vy||0));
    if(p.k==='missile'){const m=MS.get();m.position.set(p.x,st.y,p.y);m.rotation.set(0,yaw,0);if(Math.random()<.9)smoke(p.x-(p.vx||0)*.03,st.y,p.y-(p.vy||0)*.03,rand(.6,1),.38);return}
    const spd=Math.hypot(p.vx||0,p.vy||0),ux=spd?(p.vx/spd):0,uz=spd?(p.vy/spd):0,vc=(p.vid&&window.VFX&&VFX[p.vid])?VFX[p.vid]:null,cc=p.col||(vc&&vc.ca)||'#ffd27a';
    if(p.k==='arrow'){const g=ARW.get();g.position.set(p.x,st.y,p.y);g.rotation.set(0,yaw,0);g.userData.gl.material.color.copy(col(cc));a.set(p.x,st.y,p.y);b.set(p.x-ux*1.4,st.y,p.y-uz*1.4);beam(TRL,a,b,.03,cc,.45);return}
    if(p.k==='shell'||p.spl>0){const g=SHL.get(),sz=p.spl?1+Math.min(1,p.spl*.25):1;let yy=st.y,pit=0,bx=p.x-ux*1.6,by2=st.y,bz=p.y-uz*1.6;
      /* đạn đại pháo: bay vòng cung từ miệng pháo lên trời rồi rơi xuống mục tiêu */
      if(p.k==='shell'){if(st.d0==null){st.sx=p.x;st.sy=p.y;st.d0=shellRange(G,p,ux,uz,spd)}const D0=Math.max(.5,st.d0),H=Math.max(1.8,D0*.5),tr=Math.hypot(p.x-st.sx,p.y-st.sy),u=Math.min(1,tr/D0),hu=u=>H*4*u*(1-u);yy=st.y+hu(u);pit=Math.atan(H*4*(1-2*u)/D0);
        const u0=Math.max(0,u-1.4/D0);bx=st.sx+ux*u0*D0;bz=st.sy+uz*u0*D0;by2=st.y+hu(u0)}
      g.position.set(p.x,yy,p.y);g.rotation.set(0,yaw,0);g.rotateX(pit);g.scale.setScalar(1.3*sz);g.userData.gl.material.color.copy(col(cc));a.set(p.x,yy,p.y);b.set(bx,by2,bz);beam(TRL,a,b,.09*sz,cc,.55);if(Math.random()<.45)smoke(bx,by2,bz,rand(.3,.5),.35);return}
    const m=BUL.get(),c=col(cc),sz=vc?Math.max(.8,Math.min(1.8,vc.size*4||1)):1;m.position.set(p.x,st.y,p.y);m.rotation.set(0,yaw,0);m.scale.set(sz*1.3,sz*1.3,sz*(1+Math.min(1.5,spd/20)));m.material.color.copy(c).lerp(WH3,.35);m.userData.gl.material.color.copy(c);m.userData.gl.scale.setScalar(.9*sz);
    a.set(p.x,st.y,p.y);b.set(p.x-ux*Math.min(2.2,.5+spd*.07),st.y,p.y-uz*Math.min(2.2,.5+spd*.07));beam(TRL,a,b,.05*sz,cc,.6)});
  /* tia: từ đầu tháp tới mục tiêu */
  G.bm.forEach(B=>{const o=Math.min(1,B.t*8);if(o<=0)return;a.set(B.x1,hAtW(B.x1,B.y1,HOV),B.y1);b.set(B.x2,hAtW(B.x2,B.y2,HOV),B.y2);const r=Math.max(.035,(B.w||3)/26*.5);beam(BC,a,b,r*.5,'#ffffff',.9*o);beam(BG,a,b,r*1.7,B.col,.45*o)});
  /* vụ nổ */
  G.fx.forEach(f=>{const k=f.t/f.max;if(k<=0)return;const y=hAtW(f.x,f.y,HOV)*.9;if(!seenFx.has(f)){seenFx.add(f);if(f.ex||f.r>=1)boom(f.x,y,f.y,Math.max(.22,f.r*.42),!f.ex&&/^#?[0-9a-f]{0,2}[89a-f]/i.test(f.col||''));else boom(f.x,y,f.y,.22,false)}
    const m=XB.get(),R=f.r*(1.1-k*.5)*(f.ex?.6:.8);m.position.set(f.x,y,f.y);m.scale.setScalar(Math.max(.05,R));m.material.color.copy(col(f.ex?'#ffb347':f.col));m.material.opacity=Math.min(1,k*.6)});
  BUL.end();BC.end();BG.end();XB.end();MS.end();TRL.end();ARW.end();SHL.end();
  try{imp3d(G)}catch(e){console.error(e)}try{skill3d16(G,dt)}catch(e){console.error(e)}try{skill3d17(G,dt)}catch(e){console.error(e)}try{shields3d(G)}catch(e){console.error(e)}XS.end();IMP.end();stepFx(dt);
  const P=G.pl;marker.visible=!PV&&!P.dead&&R3.joy.id===null&&Math.hypot(P.tx-P.x,P.ty-P.y)>.3;if(marker.visible){marker.position.x=P.tx;marker.position.z=P.ty;marker.rotation.z+=dt*2;marker.scale.setScalar(1+.15*Math.sin(t3*6))}
  try{skill3d(G,dt)}catch(e){console.error(e)}
  try{rocks3d(G)}catch(e){console.error(e)}tlb(G,dt);BAR.end();if(!PV)hud(G,true);
  ren.render(scene,cam);if(!PV)radar(G)}
/* ---------- nổ / chớp nòng 3D cho đạn công trình (thay cho hình 2D) ---------- */
const IMPSEEN=new WeakSet();
function imp3d(G){if(!G.vfi)return;G.vfi.forEach(f=>{const r=window.VFX&&VFX[f.id];if(!r)return;const p=1-f.t/f.max,al=1-p,y=hAtW(f.x,f.y,HOV);
  if(f.type==='muz'){const L=.75,mx=f.x+Math.cos(f.a||0)*L,mz=f.y+Math.sin(f.a||0)*L;flashDot(mx,y,mz,Math.max(.35,r.size*1.8)*(1+p*.5),r.ca,al*.8);return}
  const R=f.R||1;if(!IMPSEEN.has(f)){IMPSEEN.add(f);const n=Math.min(14,4+Math.round(R*3));for(let i=0;i<n;i++){const an=Math.random()*TAU,v=rand(1.5,4)*Math.min(2,R);spark(f.x,y,f.y,Math.cos(an)*v,rand(.5,3),Math.sin(an)*v,Math.random()<.5?r.ca:r.cb,rand(.3,.6),.25)}if(r.imp==='shock'||R>1.6)for(let i=0;i<4;i++)smoke(f.x+rand(-.4,.4)*R,y,f.y+rand(-.4,.4)*R,rand(.5,1)*R*.6,.6)}
  const m=IMP.get();m.position.set(f.x,r.imp==='shock'?.2:y*.7,f.y);m.scale.setScalar(Math.max(.05,R*p*1.15));m.material.color.copy(col(r.cb||r.ca));m.material.opacity=al;
  flashDot(f.x,y,f.y,R*(r.imp==='flash'?1.6:1)*(.6+.8*p),r.ca,al*.9)})}
function flashDot(x,y,z,s,c,o){const d=XS.get();d.position.set(x,y,z);d.scale.setScalar(s);if(d.material){d.material.color&&d.material.color.copy(col(c));d.material.opacity=o}}
/* ---------- khiên của công trình dạng 3D: vòm khiên bao trọn công trình, giáp gương cong dựng đứng, ma trận giáp phủ cả căn cứ, vòm giảm sát thương ---------- */
let SKH=null;
function skhInit(){if(SKH)return SKH;const AD=SK.AD,hemi=new T.SphereGeometry(1,32,14,0,TAU,0,Math.PI/2),hw=new T.IcosahedronGeometry(1.01,2);
  const dm=()=>new T.MeshBasicMaterial({color:0x7fd8ff,transparent:true,opacity:.12,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide});
  const wm=()=>new T.MeshBasicMaterial({color:0xbff0ff,wireframe:true,transparent:true,opacity:.25,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
  SKH={DOME:Pool(()=>{const g=new T.Group(),a=new T.Mesh(hemi,dm()),b=new T.Mesh(hw,wm());b.scale.y=1;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    MIR:Pool(()=>{const N=13,geo=new T.BufferGeometry(),pos=new Float32Array(N*2*3),idx=[];for(let i=0;i<N-1;i++){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setIndex(idx);
      const m=new T.Mesh(geo,new T.MeshStandardMaterial({color:lin(0x9fd0ff),emissive:lin(0x3a8aff),emissiveIntensity:.8,metalness:.6,roughness:.1,transparent:true,opacity:.55,side:T.DoubleSide,depthWrite:false}));m.frustumCulled=false;
      const eg=new T.BufferGeometry();eg.setAttribute('position',new T.BufferAttribute(new Float32Array(N*3),3));const e=new T.Line(eg,new T.LineBasicMaterial({color:0xe8f6ff,transparent:true}));e.frustumCulled=false;const g=new T.Group();g.add(m,e);g.userData={m,e,N};scene.add(g);return g}),
    BOX:Pool(()=>{const g=new T.Group(),b=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0xb48cff,transparent:true,opacity:.07,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide})),e=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1,1,1)),new T.LineBasicMaterial({color:0xd8bfff,transparent:true,opacity:.7}));g.add(b,e);g.userData={b,e};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s})};return SKH}
function shields3d(G){skhInit();const S=SKH;
  const dome=(x,z,rx,ry,rz,c,o,wo)=>{const g=S.DOME.get(),U=g.userData;g.position.set(x,0,z);g.scale.set(rx,ry,rz);U.a.material.color.copy(col(c));U.a.material.opacity=o;U.b.material.color.copy(col(c)).lerp(WH3,.5);U.b.material.opacity=wo;U.b.rotation.y=t3*.2;return g};
  (G.bl||[]).forEach(b=>{if(b.hp<=0)return;
    /* giáp do công trình khác cấp cho công trình: vòm khiên bao trọn */
    if(b.shd&&b.shd.t>0&&b.shd.v>0){const f=Math.min(1,b.shd.v/Math.max(1e-9,b.shd.max||b.shd.v)),fl=b.flash>0?.12:0;dome(b.x,b.y,Math.max(b.w,1)*.78,Math.max(1.4,Math.max(b.w,b.h)*.55),Math.max(b.h,1)*.78,'#9fe0ff',.08+.08*f+fl,.18+.2*f+fl*1.5)}
    /* vòm giảm sát thương công trình lân cận */
    if(b.nb&&b.nb.k==='dome'&&b.nb.r){const r=b.nb.r;dome(b.x,b.y,r,r*.55,r,'#78e6ff',.045,.09)}
    /* Giáp Gương: tấm khiên cong dựng đứng ở mũi gương */
    const m=b.c19m;if(b.nb&&b.nb.c19==='ne7'&&m&&m.hp>0&&window.c19Geo){const gg=window.c19Geo.mirGeo(b),up=Math.min(1,(G.t-(m.up||0))/.6),hit=m.hitT!=null?Math.max(0,1-(G.t-m.hitT)/.35):0,f=m.hp/m.max,g=S.MIR.get(),U=g.userData,pa=U.m.geometry.attributes.position,pe=U.e.geometry.attributes.position,H=2.2*up;
      gg.P.forEach((p,i)=>{if(i>=U.N)return;pa.setXYZ(i*2,p[0],.05,p[1]);pa.setXYZ(i*2+1,p[0],H,p[1]);pe.setXYZ(i,p[0],H,p[1])});pa.needsUpdate=true;pe.needsUpdate=true;U.m.geometry.computeVertexNormals();U.m.geometry.computeBoundingSphere();
      U.m.material.opacity=.3+.25*f+.3*hit;U.m.material.emissiveIntensity=.6+1.5*hit;U.e.material.opacity=.7+.3*f;const k=Math.floor(((t3*.6)%1)*(gg.P.length-1)),q=gg.P[k];const d=S.DOT.get();d.position.set(q[0],H,q[1]);d.scale.setScalar(.6);d.material.color.set(0xffffff);d.material.opacity=.8}
    /* Ma Trận Giáp: lồng giáp tím phủ trọn căn cứ, 4 cột góc phát sáng */
    const x=b.c19x;if(b.nb&&b.nb.c19==='ne9'&&x&&x.hp>0&&x.bb&&window.c19Geo){const C4=window.c19Geo.matCorners(x.bb),x0=C4[0][0],z0=C4[0][1],x1=C4[2][0],z1=C4[2][1],up=Math.min(1,(G.t-(x.up||0))/.7),hit=x.hitT!=null?Math.max(0,1-(G.t-x.hitT)/.35):0,f=x.hp/x.max,H=2.6*up,g=S.BOX.get(),U=g.userData;
      g.position.set((x0+x1)/2,H/2,(z0+z1)/2);g.scale.set(x1-x0,Math.max(.05,H),z1-z0);U.b.material.opacity=.04+.04*f+.08*hit;U.e.material.opacity=.35+.3*f+.3*hit;C4.forEach((p,i)=>{const d=S.DOT.get();d.position.set(p[0],H,p[1]);d.scale.setScalar(1+.2*Math.sin(t3*5+i));d.material.color.set(0xbe82ff);d.material.opacity=.9})}});
  /* Mảng khiên: tăng sáng vòm khiên trụ sở khi còn đứng */
  if((G.bl||[]).some(p=>p.t==='shield'&&p.hp>0)){const hq=(G.bl||[]).find(b=>b.hq&&b.hp>0);if(hq){const r=Math.max(hq.w,hq.h)*.8;dome(hq.x,hq.y,r,r*.62,r,'#4fd6ff',.07,.16)}}
  S.DOME.end();S.MIR.end();S.BOX.end();S.DOT.end()}
/* tầm rơi dự kiến của đạn pháo: mục tiêu đầu tiên trên đường bay, nếu không có thì hết tầm */
function shellRange(G,p,ux,uz,spd){const L=Math.max(1,(p.life||1)*spd);let best=L;const chk=(x,y,r)=>{const rx=x-p.x,ry=y-p.y,t=rx*ux+ry*uz;if(t<=0||t>best)return;const pd=Math.abs(-rx*uz+ry*ux);if(pd<=r)best=t};
  if(p.team==='e'){(G.bl||[]).forEach(b=>{if(b.hp>0)chk(b.x,b.y,Math.max(b.w,b.h)*.5+.3)});[G.pl].concat(G.al||[]).forEach(u=>{if(u&&!u.dead)chk(u.x,u.y,(u.size||2)*.45)})}
  else (G.en||[]).forEach(e=>{if(!e.dead&&!(e.spawn>G.t))chk(e.x,e.y,(e.size||2)*.45+.2)});return best}
/* ===================== ĐÁ TRÊN CHIẾN TRƯỜNG LEVEL =====================
   Đá 200 máu, bị đạn bắn trúng thì mất máu và có thể vỡ; tàu nào va phải đá thì cả tàu và đá cùng chịu 30 sát thương mỗi lần va chạm. */
const ROCK_HP=200,ROCK_HIT=30,ROCK_CD=.6;
function rockInit(G){G.rocks=[];const W=G.wd.Wd,H=G.wd.Hd,R=G.wd.R,bx0=DFM-2,by0=DFM-2,bx1=DFM+(R?(R.x1-R.x0):0)+2,by1=DFM+(R?(R.y1-R.y0):0)+2,n=Math.max(8,Math.min(18,Math.round(W*H/80)));let g=0;
  while(G.rocks.length<n&&g++<600){const x=1.5+Math.random()*(W-3),y=1.5+Math.random()*(H-3),r=.7+Math.random()*.8;if(x>bx0-r&&x<bx1+r&&y>by0-r&&y<by1+r)continue;if(G.rocks.some(o=>Math.hypot(o.x-x,o.y-y)<o.r+r+1.2))continue;
    G.rocks.push({x,y,r,hp:ROCK_HP,max:ROCK_HP,dead:false,hit:0,seed:Math.random()*99})}}
function rockStep(G,dt){if(!G.rocks||G.over||G.done)return;const L=G.rocks;L.forEach(k=>{k.hit=Math.max(0,k.hit-dt)});
  const ships=[G.pl].concat(G.al||[],(G.en||[]).filter(e=>!(e.spawn>G.t))).filter(u=>u&&!u.dead&&!u.ghost);
  L.forEach(k=>{if(k.dead)return;ships.forEach(u=>{const dx=u.x-k.x,dy=u.y-k.y,d=Math.hypot(dx,dy)||.001,rr=k.r+(u.size||2)*.42;if(d>=rr)return;
      u.x=k.x+dx/d*rr;u.y=k.y+dy/d*rr;const m=u._rk||(u._rk=new Map()),last=m.get(k);if(last!=null&&G.t-last<ROCK_CD)return;m.set(k,G.t);
      k.hp-=ROCK_HIT;k.hit=.15;if(u===G.pl)dfDmgS(u,ROCK_HIT,true);else if(u.team==='e')dfDmgS(u,ROCK_HIT);else if(typeof dfDmgA==='function')dfDmgA(u,ROCK_HIT);else{u.hp-=ROCK_HIT;u.hit=.1}
      G.fx.push({x:k.x+dx/d*k.r,y:k.y+dy/d*k.r,r:.6,t:.3,max:.3,ex:1,rot:Math.random()*6})});
    (G.pr||[]).forEach(p=>{if(p.dead)return;if(Math.hypot(p.x-k.x,p.y-k.y)>k.r+.15)return;p.dead=true;k.hp-=Math.max(1,p.dmg||1);k.hit=.12;G.fx.push({x:p.x,y:p.y,r:p.spl?Math.max(.8,p.spl):.5,t:.3,max:.3,ex:1,rot:Math.random()*6})});
    if(k.hp<=0&&!k.dead){k.dead=true;k.hp=0;G.fx.push({x:k.x,y:k.y,r:k.r*1.8,t:.8,max:.8,ex:1,rot:Math.random()*6});k.dt=G.t}});
  G.pr=(G.pr||[]).filter(p=>!p.dead)}
if(typeof dfStep==='function'){const _st=dfStep;dfStep=function(dt){_st.apply(this,arguments);try{const G=DG;if(G&&!G.pvp&&!G.pv){if(!G.rocks)rockInit(G);rockStep(G,dt)}}catch(e){console.error(e)}}}
/* đá ở chế độ 2D */
setTimeout(()=>{if(typeof dfDraw!=='function')return;const _d=dfDraw;dfDraw=function(){const r=_d.apply(this,arguments);try{const G=DG;if(G&&G.rocks&&!R3.live){const q=dq,s=dsx(1)-dsx(0);G.rocks.forEach(k=>{if(k.dead)return;const x=dsx(k.x),y=dsy(k.y),R=k.r*s;q.save();q.fillStyle=k.hit>0?'#a09080':'#5a4a40';q.strokeStyle='#2a201a';q.lineWidth=2;q.beginPath();for(let i=0;i<9;i++){const a=i/9*6.283,v=.8+.2*Math.sin(k.seed+i*2.3);q.lineTo(x+Math.cos(a)*R*v,y+Math.sin(a)*R*v)}q.closePath();q.fill();q.stroke();
  if(k.hp<k.max){const bw=R*1.6;q.fillStyle='#000a';q.fillRect(x-bw/2,y-R-8,bw,4);q.fillStyle='#d8b890';q.fillRect(x-bw/2,y-R-8,bw*k.hp/k.max,4)}q.restore()})}}catch(e){}return r}},0);
/* đá ở chế độ 3D: khối đá thật, chớp sáng khi trúng đòn, thanh máu */
const ROCKM=new Map();let rockMat=null;
function rocks3d(G){const L=G.rocks||[];if(!rockMat)rockMat=new T.MeshStandardMaterial({color:lin(0x5a4a40),roughness:.92,metalness:.08,flatShading:true});
  L.forEach(k=>{let m=ROCKM.get(k);if(k.dead){if(m){scene.remove(m);m.material.dispose();ROCKM.delete(k)}return}
    if(!m){m=new T.Mesh(rockGeo(k.r),rockMat.clone());m.castShadow=m.receiveShadow=true;m.rotation.set(k.seed,k.seed*2,0);scene.add(m);ROCKM.set(k,m)}
    m.userData.seen=t3;m.position.set(k.x,HOV*.75+.15*Math.sin(t3*.6+k.seed),k.y);m.rotation.y+=.003;m.material.emissive=m.material.emissive||new T.Color();m.material.emissive.setRGB(k.hit>0?.6:0,k.hit>0?.45:0,k.hit>0?.3:0);
    if(k.hp<k.max){bar(k.x,HOV*.75+k.r+.6,k.y,Math.max(1,k.r*1.6),1,'#0a1020',.7,.08);bar(k.x,HOV*.75+k.r+.6,k.y,Math.max(1,k.r*1.6),k.hp/k.max,'#d8b890',1,.06)}});
  ROCKM.forEach((m,k)=>{if(m.userData.seen!==t3||!L.includes(k)){scene.remove(m);m.material.dispose();ROCKM.delete(k)}})}
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
  try{skill3d6(G,dt)}catch(e){console.error(e)}
  try{skill3d7(G,dt)}catch(e){console.error(e)}
  try{skill3d8(G,dt)}catch(e){console.error(e)}
  try{skill3d9(G,dt)}catch(e){console.error(e)}
  try{skill3d10(G,dt)}catch(e){console.error(e)}
  try{skill3d11(G,dt)}catch(e){console.error(e)}
  try{skill3d12(G,dt)}catch(e){console.error(e)}
  try{skill3d13(G,dt)}catch(e){console.error(e)}
  try{skill3d14(G,dt)}catch(e){console.error(e)}
  try{skill3d15(G,dt)}catch(e){console.error(e)}
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
    g.position.set(lx-2.4*(1-p),HOV*.6+13.5*(1-p),lz-3.2*(1-p));U.m.rotation.set(t3*4,t3*3,0);U.f.scale.setScalar(.9+.3*Math.random());smoke(g.position.x,g.position.y,g.position.z,.6,.35);spark(g.position.x,g.position.y,g.position.z,rand(-.5,.5),1,rand(-.5,.5),'#ff9a3c',.3,.3)});
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
    if(k==='rmsl'&&b.tx!=null){const pp=Math.min(1,b.p||0),h=10.5*(1-pp*pp),m=S5.MS.get();m.position.set(b.tx+h*.25,Y*.5+h,b.ty);m.rotation.set(-Math.PI/2+.25,0,0);m.scale.setScalar(1.4);if(Math.random()<.9)smoke(b.tx+h*.25,Y*.5+h+.3,b.ty,rand(.4,.7),.3);return}
    if(k==='msl'||k==='msl3'||k==='msl9'||k==='rmsl'){const m=S5.MS.get(),an=b.a!=null?b.a:Math.atan2(b.vy||0,b.vx||1);m.position.set(b.x,Y,b.y);m.rotation.set(0,Math.atan2(-Math.cos(an),-Math.sin(an)),0);if(Math.random()<.9)smoke(b.x,Y,b.y,rand(.5,.9),.32);return}
    const c=VBC[k]||'#ffb347';let y=Y;if(k==='comet'){const pp=Math.min(1,b.p||0);y=Y+13.5*(1-pp*pp)}
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
/* ===================== KỸ NĂNG 3D (đợt 6) =====================
   Sao Chổi Lam · Loạt Tên Lửa Nhỏ · Tia Xuyên Vòng (bộ đạn chung đợt 5) · Sao Băng Lao · Bước Nhảy Hư Không · Gió Lốc Vàng · Đuôi Lửa
   · Húc Thiết Giáp · Bóng Ma Mùa Đông · Lướt Bóng Đêm · Bão Bụi Sao */
R3.c5k={tlb:1,comet:1,shield:1,windtrail:1,firetrail:1,dashtrail:1,bdust:1,dash:1};
let SK6=null;
function sk6Init(){if(SK6)return SK6;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true);
  const tail=new T.ConeGeometry(1,1,16,1,true);tail.translate(0,-.5,0);tail.rotateX(Math.PI/2);
  const sect=new T.CircleGeometry(1,32,-1.0472,2.0944);sect.rotateX(-Math.PI/2);
  const seg=new T.TorusGeometry(1,.035,6,16,1.05);seg.rotateX(Math.PI/2);
  SK6={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    COM:Pool(()=>{const g=new T.Group(),h=new T.Sprite(ADDM(glowT())),t=new T.Mesh(tail,AD(0xffd24a,.6)),c=new T.Mesh(new T.SphereGeometry(.28,16,12),AD(0xfffbe0,1));h.material.color.set(0xffd24a);g.add(h,t,c);g.userData={h,t,c};scene.add(g);return g}),
    SHR:Pool(()=>{const g=new T.Group(),r=new T.Mesh(new T.TorusGeometry(1,.04,8,64).rotateX(Math.PI/2),AD(0xb080ff,.9)),s=new T.Mesh(SHG,AD(0xb080ff,.1)),sg=[0,1,2,3,4,5].map(()=>{const m=new T.Mesh(seg,AD(0xe0c8ff,.8));g.add(m);return m});g.add(r,s);g.userData={r,s,sg};scene.add(g);return g}),
    PAT:Pool(()=>{const m=new T.Mesh(new T.CircleGeometry(1,32).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:SK.disc,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));scene.add(m);return m}),
    SEC:Pool(()=>{const m=new T.Mesh(sect,new T.MeshBasicMaterial({map:SK.fan,color:0x9a60ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m})};
  return SK6}
function beam6(a,b,c,w,o){const g=SK6.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function skill3d6(G,dt){const X=G.csk&&G.csk.vf&&G.csk.vf.x2;if(!X||!X.c5)return;sk6Init();const S6=SK6,Y=HOV;
  const fa=o=>o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
  X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const a=fa(o);
    /* Sao Băng Lao: sao băng vàng lao thẳng, đuôi loe dài */
    if(o.k==='comet'){const f=o.dist<14?1:Math.max(0,1-(o.age-14/20)/.5),g=S6.COM.get(),U=g.userData;g.position.set(o.x,Y,o.y);g.rotation.set(0,Math.atan2(-o.d[0],-o.d[1]),0);U.h.scale.setScalar(3.2);U.h.material.opacity=.8*f*a;U.t.scale.set(.85,.85,6);U.t.material.opacity=.6*f*a;U.c.material.opacity=f*a;
      if(Math.random()<.8)spark(o.x,Y,o.y,rand(-1,1),rand(0,1.2),rand(-1,1),Math.random()<.5?'#ffe68a':'#ffb347',.5,.3)}
    /* Bước Nhảy Hư Không: khiên tím có các đoạn lục giác xoay quanh tàu */
    else if(o.k==='shield'){const P=o.P;if(!P||P.dead)return;const g=S6.SHR.get(),U=g.userData,R=(P.size||2.2)*.9;g.position.set(P.x,Y,P.y);U.r.scale.setScalar(R);U.r.material.color.copy(col(o.col));U.r.material.opacity=.9*a;U.s.scale.set(R*.95,R*.6,R*.95);U.s.material.color.copy(col(o.col));U.s.material.opacity=.1*a;
      U.sg.forEach((m,i)=>{m.scale.setScalar(R*1.04);m.rotation.y=-(i/6*TAU+t3*.5);m.position.y=Math.sin(t3*2+i)*.08;m.material.opacity=.8*a})}
    /* Gió Lốc Vàng (gió xanh) / Đuôi Lửa: các vũng gió xoáy hoặc lửa để lại trên đường bay */
    else if(o.k==='windtrail'||o.k==='firetrail'){const fire=o.k==='firetrail';(o.patches||[]).forEach(p=>{const f=Math.min(1,p.t/.6),m=S6.PAT.get();m.position.set(p.x,.06,p.y);m.scale.setScalar(1.6);m.rotation.y=p.a+t3*(fire?0:3);m.material.color.copy(col(fire?'#ff7a20':'#6ac8ff'));m.material.opacity=.8*f*a;
      if(Math.random()<.25*f){if(fire)spark(p.x+rand(-.6,.6),.2,p.y+rand(-.6,.6),0,rand(1,2),0,Math.random()<.5?'#ffd060':'#ff6a1a',.6,.3);else{const an=Math.random()*TAU;spark(p.x+Math.cos(an)*1.1,.3,p.y+Math.sin(an)*1.1,-Math.sin(an)*2.5,rand(.6,1.4),Math.cos(an)*2.5,'#cfeeff',.6,.22)}}})}
    /* Húc Thiết Giáp / Bóng Ma Mùa Đông: vệt lướt sáng nở dần theo đường húc */
    else if(o.k==='dashtrail'){const pts=o.pts||[];if(pts.length<2)return;const f=Math.max(0,Math.min(1,(o.max-o.age)/.5)),c='rgb('+o.col+')',step=Math.max(1,Math.floor(pts.length/24));
      for(let i=step;i<pts.length;i+=step){const u=i/pts.length;beam6(new T.Vector3(pts[i-step].x,Y,pts[i-step].y),new T.Vector3(pts[i].x,Y,pts[i].y),c,.08+.3*u,u*.8*f*a)}}
    /* Bão Bụi Sao: quạt bụi tím 120° với các ngôi sao lấp lánh bay ra */
    else if(o.k==='bdust'){const f=Math.max(0,Math.min(1,o.age/.4,(o.max-o.age)/.6)),m=S6.SEC.get();m.position.set(o.x,Y*.6,o.y);m.rotation.set(0,-o.a,0);m.scale.set(o.R,1,o.R);m.material.color.set(0x7a3ce0);m.material.opacity=.45*f*a;
      for(let i=0;i<2;i++){const an=o.a+rand(-1.04,1.04),v=rand(2,5);spark(o.x,Y*.6,o.y,Math.cos(an)*v,rand(-.2,.5),Math.sin(an)*v,Math.random()<.66?'#e8c8ff':'#ffe08a',o.R/v,.25)}}
    /* Lướt Bóng Đêm: vệt lướt tím phía sau tàu */
    else if(o.k==='dash'){const P=o.P;if(!P)return;for(let i=0;i<5;i++){const a0=new T.Vector3(P.x-o.dx*i*.8,Y,P.y-o.dy*i*.8),a1=new T.Vector3(P.x-o.dx*(i+1)*.8,Y,P.y-o.dy*(i+1)*.8);beam6(a0,a1,o.col,.25*(1-i/6),.5*a*(1-i/5))}const h=S6.DOT.get();h.position.set(P.x,Y,P.y);h.scale.setScalar(1.8);h.material.color.copy(col(o.col));h.material.opacity=.7*a}});
  S6.B.end();S6.DOT.end();S6.COM.end();S6.SHR.end();S6.PAT.end();S6.SEC.end()}
/* ===================== KỸ NĂNG 3D (đợt 7) =====================
   Khiên Thép Lạnh · Khiên Gương · Vỏ Giáp Nhím · Màn Chắn Đồng Đội · Tái Sinh Nhanh · Giáp Phản Xung · Bất Tử Ngắn · Lá Chắn Hành Tinh
   · Mưa Thiên Thạch (+ vòng bất tử, vệ tinh quay quanh tàu) */
Object.assign(R3.c5k,{farc:1,spiky:1,vbeam:1,heal:1,aura:1,planets:1,rain:1,inv:1,orbit:1});
let SK7=null;
function sk7Init(){if(SK7)return SK7;const AD=SK.AD,sm=(m,c)=>new T.MeshBasicMaterial({map:m,color:c||0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false});
  const farcG=new T.CylinderGeometry(1,1,1,32,1,true,Math.PI/2-.95,1.9);/* cung ±0,95 rad quanh trục +x */
  const spike=new T.ConeGeometry(.12,.42,6);spike.rotateZ(-Math.PI/2);spike.translate(.21,0,0);
  const torus=new T.TorusGeometry(1,.035,6,64);torus.rotateX(Math.PI/2);
  const dash=new T.TorusGeometry(1,.05,6,10,.5);dash.rotateX(Math.PI/2);
  const pcol=['#7ec8ff','#ffb070','#b89aff','#8affc0'].map(c=>{const t=cvTex(64,64,(x)=>{const g=x.createRadialGradient(22,22,3,32,32,32);g.addColorStop(0,'#ffffff');g.addColorStop(.35,c);g.addColorStop(1,'#14203a');x.fillStyle=g;x.fillRect(0,0,64,64);for(let i=0;i<8;i++){x.fillStyle='rgba(255,255,255,.12)';x.fillRect(0,Math.random()*64,64,3)}},true);return new T.MeshStandardMaterial({map:t,roughness:.8,emissive:lin(c),emissiveIntensity:.25})});
  SK7={farcG,pcol,
    FARC:Pool(()=>{const g=new T.Group(),a=new T.Mesh(farcG,sm(SK3.hex,0x6ac8ff)),b=new T.Mesh(farcG,AD(0xe8fbff,.3));g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    SPK:Pool(()=>{const g=new T.Group(),sp=[];for(let i=0;i<12;i++){const m=new T.Mesh(spike,new T.MeshStandardMaterial({color:lin(0x9fd8ff),emissive:lin(0x3a8cff),emissiveIntensity:.8,metalness:.6,roughness:.3}));m.rotation.y=-i/12*TAU;g.add(m);sp.push(m)}const gl=new T.Sprite(ADDM(glowT()));g.add(gl);g.userData={sp,gl};scene.add(g);return g}),
    VB:Pool(()=>{const g=new T.Group(),w=new T.Mesh(new T.CylinderGeometry(1,1,1,16,1,true),sm(SK.wall,0x6dff9a)),c=new T.Mesh(new T.CylinderGeometry(1,1,1,10,1,true),AD(0xffffff,.9)),r=new T.Mesh(torus,AD(0x6dff9a,.9));w.material.map=SK.wall;g.add(w,c,r);g.userData={w,c,r};scene.add(g);return g}),
    AUR:Pool(()=>{const g=new T.Group(),ds=[];for(let i=0;i<8;i++){const m=new T.Mesh(dash,AD(0xffffff,.8));m.rotation.y=-i/8*TAU;g.add(m);ds.push(m)}const r2=new T.Mesh(torus,AD(0xffffff,.5)),gl=new T.Sprite(ADDM(glowT()));g.add(r2,gl);g.userData={ds,r2,gl};scene.add(g);return g}),
    PL:Pool(()=>{const g=new T.Group(),m=new T.Mesh(new T.SphereGeometry(.42,20,14),pcol[0]),ring=new T.Mesh(new T.TorusGeometry(.55,.03,6,32,TAU).rotateX(Math.PI/2),AD(0x6dff9a,.9)),gl=new T.Sprite(ADDM(glowT()));m.castShadow=true;gl.material.color.set(0xff8a40);g.add(m,ring,gl);g.userData={m,ring,gl};scene.add(g);return g}),
    MT:Pool(()=>{const g=new T.Group(),m=new T.Mesh(rockGeo(1),new T.MeshStandardMaterial({color:lin(0x5a463a),roughness:.9,flatShading:true,emissive:lin(0x501400)})),f=new T.Sprite(ADDM(glowT()));m.scale.setScalar(.2);f.material.color.set(0xff6a20);f.scale.setScalar(.9);g.add(m,f);g.userData={m,f};scene.add(g);return g}),
    RING:Pool(()=>{const m=new T.Mesh(torus,AD(0xff7a30,.5));scene.add(m);return m}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s})};
  return SK7}
function skill3d7(G,dt){const X=G.csk&&G.csk.vf&&G.csk.vf.x2;if(!X||!X.c5)return;sk7Init();const S7=SK7,Y=HOV;
  const fa=o=>o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
  X.c5.forEach(o=>{if(o.dl>0||!o.k||!R3.c5k[o.k])return;const a=fa(o),P=o.P;
    /* Khiên Gương: tấm gương cong vân lục giác trước mũi tàu */
    if(o.k==='farc'){if(!P)return;const f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.4)),g=S7.FARC.get(),U=g.userData,an=P.ang!=null?P.ang:-Math.PI/2,R=(P.size||2.2)*1.15;
      g.position.set(P.x-Math.cos(an)*R*.35,Y,P.y-Math.sin(an)*R*.35);g.rotation.set(0,-an,0);g.scale.set(R*1.15,1,R*1.15);U.a.material.color.copy(col(o.col));U.a.material.opacity=.85*f*a;U.b.material.opacity=.3*f*a}
    /* Vỏ Giáp Nhím: vòng gai kim loại xoay quanh tàu */
    else if(o.k==='spiky'){if(!P)return;const f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.4)),g=S7.SPK.get(),U=g.userData;g.position.set(P.x,Y,P.y);g.rotation.y=t3*.8;g.scale.setScalar(o.R*.9*f+.05);U.gl.material.color.copy(col(o.col));U.gl.scale.setScalar(2.6);U.gl.material.opacity=.35*f*a}
    /* Tái Sinh Nhanh: cột sáng xanh lá từ trời chiếu xuống tàu được hồi sinh */
    else if(o.k==='vbeam'){const p=o.age/o.max,f=p<.5?p/.5:Math.max(0,1-(p-.5)/.5),c=o.hex||'#ff3a3a',g=S7.VB.get(),U=g.userData;g.position.set(o.x,0,o.y);
      U.w.scale.set(.4+.5*f,14,.4+.5*f);U.w.position.y=7;U.w.material.color.copy(col(c));U.w.material.opacity=.9*f;U.c.scale.set(.12+.1*f,14,.12+.1*f);U.c.position.y=7;U.c.material.opacity=.9*f;
      U.r.scale.setScalar((o.col?1.2:4)*Math.min(1,p*2));U.r.position.y=.1;U.r.material.color.copy(col(c));U.r.material.opacity=.8*f}
    /* hồi máu: dấu cộng xanh bay lên quanh tàu */
    else if(o.k==='heal'){if(!P||P.dead)return;if(Math.random()<.4){const an=Math.random()*TAU,r=(P.size||2.2)*.4;spark(P.x+Math.cos(an)*r,Y-.3,P.y+Math.sin(an)*r,0,1.4,0,'#7fffaa',.8,.28)}}
    /* Giáp Phản Xung / Bất Tử Ngắn: vòng nét đứt xoay + vòng ngoài + quầng sáng */
    else if(o.k==='aura'||o.k==='inv'){if(!P||P.dead)return;const g=S7.AUR.get(),U=g.userData,R=(P.size||2.2)*(o.k==='inv'?.8+.1*Math.sin(t3*12):.95),c=o.k==='inv'?'#ffffff':o.col;g.position.set(P.x,Y,P.y);g.rotation.y=t3*1.5;g.scale.setScalar(R);
      U.ds.forEach(m=>{m.material.color.copy(col(c));m.material.opacity=.8*a});U.r2.scale.setScalar(1.12);U.r2.material.color.copy(col(c));U.r2.material.opacity=.45*a;U.gl.scale.setScalar(2.4);U.gl.material.color.copy(col(o.col||c));U.gl.material.opacity=.3*a}
    /* Lá Chắn Hành Tinh: 4 hành tinh nhỏ quay quanh tàu, sau đó lao vào kẻ địch */
    else if(o.k==='planets'){if(!P)return;if(o.ph===0)(o.pl||[]).forEach((p,i)=>{if(p.hp<=0)return;const an=p.a+o.rot,g=S7.PL.get(),U=g.userData;g.position.set(P.x+Math.cos(an)*2.4,Y,P.y+Math.sin(an)*2.4);U.m.material=S7.pcol[i%4];U.m.rotation.y=t3;U.ring.visible=true;U.ring.scale.setScalar(Math.max(.05,p.hp/p.max));U.gl.material.opacity=p.fl>0?.8:0;U.gl.material.color.set(0xffffff)});
      else(o.fl||[]).forEach((f,i)=>{if(f.done)return;const g=S7.PL.get(),U=g.userData;g.position.set(f.x,Y,f.y);U.m.material=S7.pcol[i%4];U.ring.visible=false;U.gl.material.color.set(0xff8a40);U.gl.scale.setScalar(2.2);U.gl.material.opacity=.7;if(Math.random()<.7)spark(f.x,Y,f.y,rand(-.5,.5),rand(0,.8),rand(-.5,.5),'#ffa060',.4,.3)})}
    /* Mưa Thiên Thạch: vùng mưa cam, thiên thạch rực lửa rơi chéo, chớp sáng khi chạm đất */
    else if(o.k==='rain'){const r=S7.RING.get();r.position.set(o.cx,.08,o.cy);r.scale.setScalar(o.R);r.rotation.y=-t3*.5;r.material.opacity=.45*a;
      (o.ms||[]).forEach(m=>{const d=o.age-m.t;if(d<0||d>.55)return;if(d<.4){const u=1-d/.4,g=S7.MT.get();g.position.set(m.x+u*2.2,.2+u*10.5,m.y-u*1.4);g.userData.m.rotation.set(t3*5,t3*4,0)}else{const u=(d-.4)/.15,s=S7.DOT.get();s.position.set(m.x,.3,m.y);s.scale.setScalar(1.8*(1-u)+.3);s.material.color.set(0xff8a40);s.material.opacity=1-u}})}
    /* vệ tinh đá quay quanh tàu */
    else if(o.k==='orbit'){if(!P||P.dead)return;for(let i=0;i<3;i++){const aa=o.age*2.2+i*2.094,g=S7.PL.get(),U=g.userData;g.position.set(P.x+Math.cos(aa)*2.2,Y,P.y+Math.sin(aa)*2.2);U.m.material=MT.metal;U.ring.visible=false;U.gl.material.color.set(0x9fe0ff);U.gl.scale.setScalar(1.6);U.gl.material.opacity=.35*a}}});
  S7.FARC.end();S7.SPK.end();S7.VB.end();S7.AUR.end();S7.PL.end();S7.MT.end();S7.RING.end();S7.DOT.end()}
/* ===================== KỸ NĂNG 3D (đợt 8) =====================
   Né Xa Tôi Ra · Bom Từ Trường · Lưới Điện Tím · Vòng Lửa Quay · Pháo Hoa Chết Chóc · Bão Đạn Kim · Vòng Xoáy Tử Thần · Tia Laser Xanh
   · Nhát Chém Kết Liễu · Xạ Thủ Đêm (+ băng phủ tàu địch) */
Object.assign(R3.c5k,{nwave:1,mbomb:1,pbolt:1,fring:1,smis:1,needle:1,ice:1,vxtt:1,lzb:1,slash:1,aimr:1,snip:1});
let SK8=null;
function sk8Init(){if(SK8)return SK8;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.022,8,64);torus.rotateX(Math.PI/2);
  const band=new T.CylinderGeometry(1,1,1,64,1,true);
  const mb=new T.CylinderGeometry(.04,.04,.3,6);mb.rotateX(Math.PI/2);const mc=new T.ConeGeometry(.04,.12,6);mc.rotateX(-Math.PI/2);mc.translate(0,0,-.21);
  const nd=new T.BoxGeometry(.035,.035,1);nd.translate(0,0,.5);/* kim: từ gốc kéo dài về +z */
  const blade=new T.TorusGeometry(1,.06,6,32,1.6);blade.rotateX(Math.PI/2);blade.rotateY(-.8);
  SK8={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    BAND:Pool(()=>{const m=new T.Mesh(band,new T.MeshBasicMaterial({map:SK.band,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,16,12),AD(0xffffff,1));scene.add(m);return m}),
    MSL:Pool(()=>{const g=new T.Group(),a=new T.Mesh(mb,MT.gray),b=new T.Mesh(mc,MT.red);g.add(a,b);scene.add(g);return g}),
    NDL:Pool(()=>{const m=new T.Mesh(nd,AD(0xcfeaff,.95));m.frustumCulled=false;scene.add(m);return m}),
    ICE:Pool(()=>{const g=new T.Group(),a=new T.Mesh(new T.CylinderGeometry(1,1,1,6,1),new T.MeshStandardMaterial({color:lin(0xbfeeff),transparent:true,opacity:.35,metalness:.1,roughness:.05,emissive:lin(0x3aa8ff),emissiveIntensity:.4,depthWrite:false})),b=new T.Mesh(new T.CylinderGeometry(1,1,1,6,1,true),AD(0xe8ffff,.6));b.material.wireframe=true;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    BLD:Pool(()=>{const m=new T.Mesh(blade,AD(0x8fd8ff,1));scene.add(m);return m})};
  return SK8}
function beam8(a,b,c,w,o){const g=SK8.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap8(a,b,c,o,sd){const n=9,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(t3*70+i*4+sd)*.4:0,up=i<n?Math.cos(t3*61+i*7+sd)*.3:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam8(p0,p1,c,.09,o);p0=p1}}
function dot8(x,y,z,s,c,o){const d=SK8.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function skill3d8(G,dt){const X=G.csk&&G.csk.vf&&G.csk.vf.x2;if(!X||!X.c5)return;sk8Init();const S8=SK8,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z);
  const fa=o=>o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
  X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=fa(o),P=o.P;
    /* Né Xa Tôi Ra: sóng xung kích xanh lan ra 6 ô, hất văng kẻ địch */
    if(k==='nwave'){if(!P)return;const R=Math.max(.01,o.R),f=Math.max(0,1-o.age/.9),b=S8.BAND.get();b.position.set(P.x,Y*.6,P.y);b.scale.set(R,1.2*f+.2,R);b.material.color.set(0x3a9ad8);b.material.opacity=.6*f*a;
      const t=S8.TOR.get();t.position.set(P.x,Y*.6,P.y);t.scale.setScalar(R);t.material.color.set(0xa8ecff);t.material.opacity=.75*f*a;if(o.age>.12){const t2=S8.TOR.get();t2.position.set(P.x,Y*.6,P.y);t2.scale.setScalar(R*.62);t2.material.color.set(0x8fe8ff);t2.material.opacity=.6*f*a}}
    /* Bom Từ Trường: quả bom cam bay ra, hút địch bằng các vòng co dần */
    else if(k==='mbomb'){const f=Math.min(1,o.age/.2,o.ph===2?Math.max(0,1-(o.t2||0)/.5):1),b=S8.BALL.get();b.position.set(o.x,Y,o.y);b.scale.setScalar(.3+.05*Math.sin(t3*10));b.material.color.set(0xd85a00);b.material.opacity=.7*f*a;dot8(o.x,Y,o.y,2.4,'#c04a00',.5*f*a);if(o.ph===2){const u=Math.min(1,(o.t2||0)/.5),t=S8.TOR.get();t.position.set(o.x,Y*.7,o.y);t.scale.setScalar(.5+4*u);t.material.color.set(0xffb040);t.material.opacity=(1-u)*a}
      if(o.ph===1)for(let i=0;i<3;i++){const ph=(t3*1.5+i/3)%1,t=S8.TOR.get();t.position.set(o.x,Y*.7,o.y);t.scale.setScalar(4*(1-ph*.85));t.material.color.set(0xff9a30);t.material.opacity=(1-ph)*.7*f*a}}
    /* Lưới Điện Tím: sét tím nhảy dây chuyền qua tối đa 13 kẻ địch */
    else if(k==='pbolt'){const f=1-o.age/o.max,A=V3a(o.x1,o.y1),B=V3a(o.x2,o.y2);zap8(A,B,'#9a4aff',f*a,o.x1*7);dot8(B.x,Y,B.z,1.8,'#b070ff',.75*f*a)}
    /* Vòng Lửa Quay: vòng 14 cầu lửa xoay quanh tàu */
    else if(k==='fring'){if(!P||P.dead)return;const R=Math.max(.01,o.R),f=Math.max(0,Math.min(1,o.age/.3,(o.max-o.age)/.5)),t=S8.TOR.get();t.position.set(P.x,Y,P.y);t.scale.setScalar(R);t.rotation.y=-o.rot;t.material.color.set(0xff6a1a);t.material.opacity=.5*f*a;
      for(let i=0;i<14;i++){const an=o.rot+i/14*TAU,x=P.x+Math.cos(an)*R,z=P.y+Math.sin(an)*R;dot8(x,Y,z,.8+.15*Math.sin(t3*18+i*2),i%2?'#ff7a1a':'#ffc04a',.9*f*a);if(Math.random()<.05)spark(x,Y,z,0,1,0,'#ffd070',.4,.25)}}
    /* Pháo Hoa Chết Chóc: 40 tên lửa nhỏ toả ra rồi lao vào mục tiêu */
    else if(k==='smis'){const m=S8.MSL.get();m.position.set(o.x,Y,o.y);m.rotation.set(0,Math.atan2(-Math.cos(o.a),-Math.sin(o.a)),0);dot8(o.x-Math.cos(o.a)*.3,Y,o.y-Math.sin(o.a)*.3,.55,'#ffa040',.85*a);if(Math.random()<.25)smoke(o.x,Y,o.y,.45,.22)}
    /* Bão Đạn Kim: hàng trăm kim băng xanh bay theo hình quạt */
    else if(k==='needle'){const m=S8.NDL.get();m.position.set(o.x,Y,o.y);m.rotation.set(0,Math.atan2(-Math.cos(o.a),-Math.sin(o.a)),0);m.scale.set(1,1,1.1);m.material.opacity=.95*a}
    /* băng phủ tàu địch: khối lục giác băng trong suốt */
    else if(k==='ice'){const e=o.e;if(!e||e.dead)return;const g=S8.ICE.get(),U=g.userData,R=(e.size||2)*.55;g.position.set(e.x,Y,e.y);g.scale.set(R,.9,R);g.rotation.y=.3;U.a.material.opacity=.35*a;U.b.material.opacity=.5*a}
    /* Vòng Xoáy Tử Thần: quả cầu tím bay ra, nở thành vòng xoáy hút và phóng sét tím */
    else if(k==='vxtt'){const f=Math.min(1,o.age/.15,o.ph===2?Math.max(0,1-(o.t2||0)/.5):1);dot8(o.x,Y,o.y,2.2,'#7a30d0',.55*f*a);const b=S8.BALL.get();b.position.set(o.x,Y,o.y);b.scale.setScalar(.3+.04*Math.sin(t3*12));b.material.color.set(0x5a20c0);b.material.opacity=.7*f*a;if(o.ph===2){const u=Math.min(1,(o.t2||0)/.5),t=S8.TOR.get();t.position.set(o.x,Y*.7,o.y);t.scale.setScalar(.5+3.5*u);t.material.color.set(0xb070ff);t.material.opacity=(1-u)*a}
      if(o.ph===1){for(let i=0;i<3;i++){const an=Math.random()*TAU,r=3.4*Math.random()+.5;spark(o.x+Math.cos(an)*r,Y,o.y+Math.sin(an)*r,-Math.sin(an)*3-(Math.cos(an)*r)*.8,rand(-.2,.2),Math.cos(an)*3-(Math.sin(an)*r)*.8,i%2?'#d8a0ff':'#9a4aff',.5,.25)}
        (o.ts||[]).forEach((e,i)=>{if(!e.dead)zap8(V3a(o.x,o.y),V3a(e.x,e.y),'#9a4aff',.8*f*a,i*3)})}}
    /* Tia Laser Xanh: tia laser xanh liên tục bám mục tiêu */
    else if(k==='lzb'){let A,B,f=1;if(P){if(P.dead||!o.tg||o.tg.dead)return;A=V3a(P.x,P.y);B=V3a(o.tg.x,o.tg.y);f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.3))}else{A=V3a(o.x1,o.y1);B=V3a(o.x2,o.y2);f=Math.max(0,1-o.age/o.max)}
      const pu=1+.1*Math.sin(t3*40);beam8(A,B,o.col1||'#3a90ff',.3*pu,f*a);dot8(B.x,Y,B.z,1.7,o.col1||'#3a90ff',.7*f*a);dot8(A.x,Y,A.z,.9,o.col1||'#3a90ff',.6*f*a)}
    /* Nhát Chém Kết Liễu: lưỡi chém cong xanh xẹt qua mục tiêu */
    else if(k==='slash'){const f=Math.max(0,1-o.age/.5),u=Math.min(1,o.age/.12),m=S8.BLD.get();m.position.set(o.x,Y,o.y);m.rotation.set(0,-(o.a+.9),0);m.scale.set(2.2*u+.05,1,2.2*u+.05);m.material.opacity=f*a;dot8(o.x,Y,o.y,2.2*f+.1,'#6ac8ff',.5*f*a)}
    /* Xạ Thủ Đêm: tia ngắm nét đứt + vòng ngắm đỏ trên mục tiêu, rồi viên đạn bắn tỉa vụt qua */
    else if(k==='aimr'){const t=o.aim&&o.aim.tg;if(o.ph!==0||!t||t.dead||!P||P.dead)return;const u=Math.min(1,(o.t1||0)/5),R=(t.size||2)*(1.6-.6*u);beam8(V3a(P.x,P.y),V3a(t.x,t.y),'#6ac8ff',.03,.5*a*(.6+.4*Math.sin(t3*20)));
      const r=S8.TOR.get();r.position.set(t.x,Y,t.y);r.scale.setScalar(R*.5);r.material.color.set(0xff3a3a);r.material.opacity=.95*a;for(let i=0;i<4;i++){const an=i*Math.PI/2;beam8(V3a(t.x+Math.cos(an)*R*.3,t.y+Math.sin(an)*R*.3),V3a(t.x+Math.cos(an)*R*.7,t.y+Math.sin(an)*R*.7),'#ff3a3a',.04,.9*a)}}
    else if(k==='snip'){const A=V3a(o.x,o.y),B=V3a(o.x-Math.cos(o.a)*6,o.y-Math.sin(o.a)*6);beam8(A,B,'#3a90ff',.1,a);dot8(o.x,Y,o.y,1.3,'#6ac8ff',.9*a)}});
  S8.B.end();S8.DOT.end();S8.TOR.end();S8.BAND.end();S8.BALL.end();S8.MSL.end();S8.NDL.end();S8.ICE.end();S8.BLD.end()}
/* ===================== KỸ NĂNG 3D (đợt 9) =====================
   Móc Câu Không Gian · Dấu Ấn Săn Mồi · Đòn Trả Thù · Băng Giá Tức Thì · Choáng Điện · Vùng Chậm Thời Gian · Xoáy Ngược Hướng · Thôi Miên
   · Còng Năng Lượng · Tiếng Hú Câm Lặng */
Object.assign(R3.c5k,{hkch:1,tmark:1,gshield:1,bolt:1,ecr:1,tzone:1,xnh:1,hyp:1,cuff:1,sil:1});
let SK9=null;
function sk9Init(){if(SK9)return SK9;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.03,8,64);torus.rotateX(Math.PI/2);
  const link=new T.TorusGeometry(.26,.06,6,16),dome=new T.SphereGeometry(1,40,16,0,TAU,0,Math.PI/2);
  const sc=document.createElement('canvas');sc.width=sc.height=128;const x=sc.getContext('2d');x.strokeStyle='#ff4a6a';x.lineWidth=14;x.shadowColor='#ff2050';x.shadowBlur=12;x.beginPath();x.arc(64,64,44,0,7);x.moveTo(33,95);x.lineTo(95,33);x.stroke();
  const silT=new T.CanvasTexture(sc);
  SK9={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    LNK:Pool(()=>{const m=new T.Mesh(link,new T.MeshStandardMaterial({color:lin(0xbfe6ff),metalness:.8,roughness:.25,emissive:lin(0x3a9aff),emissiveIntensity:.8,transparent:true}));scene.add(m);return m}),
    DOME:Pool(()=>{const m=new T.Mesh(dome,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.1,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));scene.add(m);return m}),
    SIL:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:silT,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(s);return s})};
  return SK9}
function beam9(a,b,c,w,o){const g=SK9.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap9(a,b,c,o,sd,amp,w){amp=amp||.4;const n=9,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(t3*70+i*4+sd)*amp:0,up=i<n?Math.cos(t3*61+i*7+sd)*amp*.7:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam9(p0,p1,c,w||.09,o);p0=p1}}
function dot9(x,y,z,s,c,o){const d=SK9.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor9(x,y,z,r,c,o,rx,rz){const t=SK9.TOR.get();t.position.set(x,y,z);t.scale.setScalar(r);t.rotation.set(rx||0,0,rz||0);t.material.color.copy(col(c));t.material.opacity=o;return t}
function skill3d9(G,dt){const X=G.csk&&G.csk.vf&&G.csk.vf.x2;if(!X||!X.c5)return;sk9Init();const S9=SK9,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z);
  const fa=o=>o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1,ok=e=>e&&!e.dead;
  X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=fa(o);
    /* Móc Câu Không Gian: xích năng lượng từng mắt nối tàu với mục tiêu, kéo mục tiêu lại */
    if(k==='hkch'){const P=o.P,t=o.t;if(!ok(P)||!ok(t))return;const f=Math.max(0,Math.min(1,o.age/.1,(o.max-o.age)/.3)),A=V3a(P.x,P.y),B=V3a(t.x,t.y),d=B.clone().sub(A),L=d.length(),n=Math.max(2,Math.floor(L/.42)),an=Math.atan2(d.x,d.z);
      beam9(A,B,'#4aa8ff',.12,.35*f*a);for(let i=1;i<n;i++){const m=S9.LNK.get(),p=A.clone().addScaledVector(d,i/n);m.position.copy(p);m.rotation.set(0,an,i%2?Math.PI/2:0);m.rotateY(Math.PI/2);m.material.opacity=f*a}
      dot9(B.x,Y,B.z,2,'#6ac8ff',.6*f*a);const h=S9.TOR.get();h.position.copy(B);h.scale.setScalar((t.size||2)*.45);h.rotation.set(0,0,0);h.material.color.set(0x9fe0ff);h.material.opacity=.8*f*a}
    /* Dấu Ấn Săn Mồi: vòng ngắm đỏ xoay + 4 vạch, co lại khi đánh dấu */
    else if(k==='tmark'){const t=o.t;if(!ok(t))return;const R=(t.size||2)*.5*(1.1+.5*Math.max(0,1-o.age/.3)),f=Math.max(0,Math.min(1,(o.max-o.age)/.4));tor9(t.x,Y+.4,t.y,R,'#ff3a3a',.95*f*a);
      for(let i=0;i<4;i++){const an=i*Math.PI/2+t3*2;beam9(V3a(t.x+Math.cos(an)*R*.75,t.y+Math.sin(an)*R*.75,Y+.4),V3a(t.x+Math.cos(an)*R*1.35,t.y+Math.sin(an)*R*1.35,Y+.4),'#ff3a3a',.05,.9*f*a)}dot9(t.x,Y,t.y,R*1.6,'#ff4040',.3*f*a)}
    /* Đòn Trả Thù: khiên cầu vàng bọc tàu, 6 hạt vàng quay quanh */
    else if(k==='gshield'){const P=o.P;if(!ok(P))return;const R=(P.size||2.2)*.55,f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.5)),d=S9.DOME.get();d.position.set(P.x,Y-.3,P.y);d.scale.set(R,R*.9,R);d.material.color.set(0xffc830);d.material.opacity=.28*f*a;
      tor9(P.x,Y-.25,P.y,R,'#ffd24a',.9*f*a);tor9(P.x,Y+.2,P.y,R*.8,'#fff0a0',.5*f*a,.25*Math.sin(t3*2),.25*Math.cos(t3*2));
      for(let i=0;i<6;i++){const an=-t3*1.4+i*1.047;dot9(P.x+Math.cos(an)*R,Y-.1+.3*Math.sin(t3*3+i),P.y+Math.sin(an)*R,.45,'#ffe58a',.9*f*a)}}
    /* Choáng Điện: tia sét xanh phóng tới từng mục tiêu */
    else if(k==='bolt'){if(o.x2==null)return;const f=1-o.age/o.max,B=V3a(o.x2,o.y2);zap9(V3a(o.x1,o.y1),B,'#3a90ff',f*a,o.x1*5);dot9(B.x,Y,B.z,1.7,'#50b4ff',.7*f*a)}
    /* điện giật liên tục trên tàu địch */
    else if(k==='ecr'){const e=o.e;if(!ok(e))return;const r=(e.size||2)*.45,f=Math.min(1,(o.max-o.age)/.4),C=V3a(e.x,e.y);for(let j=0;j<4;j++){const a0=t3*13+j*1.57+Math.sin(t3*7+j)*.5,E2=V3a(e.x+Math.cos(a0)*r*1.1,e.y+Math.sin(a0)*r*1.1,Y+Math.sin(t3*30+j)*.4);zap9(C,E2,j%2?'#dff4ff':'#4a98ff',(.55+.4*Math.sin(t3*30+j*3))*f*a,j*9,.12,.05)}dot9(e.x,Y,e.y,r*2.6,'#4a98ff',.3*f*a)}
    /* Vùng Chậm Thời Gian: mái vòm xanh như mặt đồng hồ, kim quay chậm */
    else if(k==='tzone'){const R=o.R,f=Math.max(0,Math.min(1,o.age/.4,(o.max-o.age)/.6)),d=S9.DOME.get();d.position.set(o.x,.05,o.y);d.scale.set(R,R*.45,R);d.material.color.set(0x3c8cff);d.material.opacity=.12*f*a;
      tor9(o.x,.1,o.y,R,'#8fd0ff',.85*f*a);tor9(o.x,.1,o.y,R*.9,'#5aa8ff',.4*f*a);
      for(let i=0;i<12;i++){const an=i/12*TAU,r0=R*(i%3?.9:.82);beam9(V3a(o.x+Math.cos(an)*r0,o.y+Math.sin(an)*r0,.12),V3a(o.x+Math.cos(an)*R*.98,o.y+Math.sin(an)*R*.98,.12),'#9fd8ff',.05,.7*f*a)}
      const h1=t3*.35,h2=t3*.05;beam9(V3a(o.x,o.y,.15),V3a(o.x+Math.cos(h1)*R*.75,o.y+Math.sin(h1)*R*.75,.15),'#cfeaff',.07,.8*f*a);beam9(V3a(o.x,o.y,.15),V3a(o.x+Math.cos(h2)*R*.5,o.y+Math.sin(h2)*R*.5,.15),'#cfeaff',.1,.8*f*a);dot9(o.x,.3,o.y,1.2,'#8fd0ff',.7*f*a)}
    /* Xoáy Ngược Hướng: vòng xoáy tím quanh tàu đẩy địch lùi */
    else if(k==='xnh'){const P=o.P;if(!ok(P))return;const R=o.R,f=Math.max(0,Math.min(1,o.age/.4,(o.max-o.age)/.6));tor9(P.x,.1,P.y,R,'#b88aff',.8*f*a);
      for(let j=0;j<5;j++)for(let m=1;m<=10;m++){const u=m/10,an=-t3*2.2+j*1.2566-u*5.5,rr=R*(.15+.85*u);dot9(P.x+Math.cos(an)*rr,.2+.4*u,P.y+Math.sin(an)*rr,.5+.5*u,j%2?'#e0c8ff':'#9a5cff',.55*f*a)}
      const d=S9.DOME.get();d.position.set(P.x,.05,P.y);d.scale.set(R,R*.3,R);d.material.color.set(0x8c50ff);d.material.opacity=.08*f*a}
    /* Thôi Miên: xoắn ốc tím quanh tàu địch + xoắn hồng lơ lửng trên đầu */
    else if(k==='hyp'){const e=o.e;if(!ok(e))return;const R=(e.size||2)*.45,f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.4));for(let m=1;m<=14;m++){const u=m/14,an=t3*5+u*12,rr=R*(.15+.85*u);dot9(e.x+Math.cos(an)*rr,Y,e.y+Math.sin(an)*rr,.35,'#e8a0ff',.85*f*a)}
      const hy=Y+1.4;for(let m=1;m<=10;m++){const u=m/10,an=-t3*7+u*10,rr=.35*u;dot9(e.x+Math.cos(an)*rr,hy+u*.15,e.y+Math.sin(an)*rr,.25,'#ff9aef',.95*f*a)}dot9(e.x,hy,e.y,1,'#ff66dd',.45*f*a)}
    /* Còng Năng Lượng: hai vòng còng xanh ngọc khoá chặt tàu địch */
    else if(k==='cuff'){const e=o.e;if(!ok(e))return;const R=(e.size||2)*.45;tor9(e.x,Y,e.y,R,'#44ddff',.95*a,.5,t3*.8);tor9(e.x,Y,e.y,R*1.2,'#44ddff',.7*a,-.5,-t3*.6);dot9(e.x,Y,e.y,R*2.2,'#44ddff',.25*a)}
    /* Tiếng Hú Câm Lặng: biển cấm đỏ lơ lửng trên tàu địch bị cấm kỹ năng */
    else if(k==='sil'){const e=o.e;if(!ok(e))return;const s=S9.SIL.get();s.position.set(e.x,Y+1.3+.08*Math.sin(t3*4),e.y);s.scale.setScalar(.9);s.material.opacity=.95*a}});
  S9.B.end();S9.DOT.end();S9.TOR.end();S9.LNK.end();S9.DOME.end();S9.SIL.end()}
/* ===================== KỸ NĂNG 3D (đợt 10) =====================
   Lực Đẩy Cực Đại (sóng nwave đã có) · Bầy Ong Lửa · Hộ Vệ Song Sinh · Bóng Chiến Binh · Vệ Tinh Pháo · Mồi Nhử Khổng Lồ · Kéo Bạn Về (xích hkch đã có) */
Object.assign(R3.c5k,{bee:1,gdrn:1,shad:1,satl:1,bdec:1});
let SK10=null;const DEC=new Map();
function sk10Init(){if(SK10)return SK10;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.03,8,64);torus.rotateX(Math.PI/2);
  const beeB=new T.SphereGeometry(.13,10,8);beeB.scale(1,.75,1.5);const wing=new T.PlaneGeometry(.22,.1);wing.rotateX(-Math.PI/2);
  const beeM=new T.MeshStandardMaterial({color:lin(0xffb040),emissive:lin(0xff7a10),emissiveIntensity:.7,metalness:.3,roughness:.4}),stripe=new T.MeshBasicMaterial({color:0x4a2a10}),wingM=new T.MeshBasicMaterial({color:0xfff2c8,transparent:true,opacity:.6,side:T.DoubleSide,depthWrite:false});
  const stG=new T.CylinderGeometry(.135,.135,.05,10);stG.rotateX(Math.PI/2);
  const hex=new T.CylinderGeometry(.36,.36,.16,6),arm=new T.BoxGeometry(.06,.04,.6),rot=new T.CylinderGeometry(.22,.22,.02,16),rotB=new T.CylinderGeometry(.24,.24,.01,16,1,true);
  const dMat=new T.MeshStandardMaterial({color:lin(0x2a9a64),metalness:.6,roughness:.35,emissive:lin(0x1a6a40),emissiveIntensity:.5}),aMat=new T.MeshStandardMaterial({color:lin(0xcffff0),metalness:.7,roughness:.3}),rMat=new T.MeshBasicMaterial({color:0xbeffe1,transparent:true,opacity:.35,depthWrite:false});
  const sB=new T.BoxGeometry(.7,.55,.7),pan=new T.BoxGeometry(1.1,.04,.55),dish=new T.SphereGeometry(.3,16,8,0,TAU,0,Math.PI/2.4),mast=new T.CylinderGeometry(.03,.03,.5,6);
  const pMat=new T.MeshStandardMaterial({color:lin(0x2a4aa8),metalness:.5,roughness:.3,emissive:lin(0x16306a),emissiveIntensity:.6});
  SK10={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s}),
    BEE:Pool(()=>{const g=new T.Group(),b=new T.Mesh(beeB,beeM),s1=new T.Mesh(stG,stripe),s2=new T.Mesh(stG,stripe),w1=new T.Mesh(wing,wingM),w2=new T.Mesh(wing,wingM);s1.position.z=-.03;s2.position.z=.07;s1.scale.set(1.01,.76,1);s2.scale.set(.9,.7,1);w1.position.set(.13,.08,0);w2.position.set(-.13,.08,0);g.add(b,s1,s2,w1,w2);g.userData={w1,w2};scene.add(g);return g}),
    DRN:Pool(()=>{const g=new T.Group(),c=new T.Mesh(hex,dMat.clone());g.add(c);const R=[];for(let i=0;i<4;i++){const an=i*Math.PI/2+Math.PI/4,a=new T.Mesh(arm,aMat);a.position.set(Math.cos(an)*.3,0,Math.sin(an)*.3);a.rotation.y=-an+Math.PI/2;const r=new T.Mesh(rot,rMat),rb=new T.Mesh(rotB,aMat);r.position.set(Math.cos(an)*.58,.06,Math.sin(an)*.58);rb.position.copy(r.position);g.add(a,r,rb);R.push(r)}g.userData={c,R};scene.add(g);return g}),
    SAT:Pool(()=>{const g=new T.Group(),b=new T.Mesh(sB,new T.MeshStandardMaterial({color:lin(0xe0b040),metalness:.85,roughness:.3,emissive:lin(0x6a4a00),emissiveIntensity:.4})),p1=new T.Mesh(pan,pMat),p2=new T.Mesh(pan,pMat),d=new T.Mesh(dish,aMat),m=new T.Mesh(mast,aMat);
      p1.position.x=.95;p2.position.x=-.95;d.rotation.x=Math.PI/2;d.position.set(0,0,.42);m.position.y=.5;g.add(b,p1,p2,d,m);g.userData={b,d};scene.add(g);return g})};
  return SK10}
function beam10(a,b,c,w,o){const g=SK10.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function dot10(x,y,z,s,c,o){const d=SK10.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor10(x,y,z,r,c,o){const t=SK10.TOR.get();t.position.set(x,y,z);t.scale.setScalar(r);t.material.color.copy(col(c));t.material.opacity=o;return t}
function bar10(x,y,z,w,f,c){const bg=SK10.BAR.get();bg.position.set(x-w/2,y,z);bg.scale.set(w,.12,1);bg.material.color.set(0x101820);bg.material.opacity=.8;if(f<=0)return;const s=SK10.BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),.12,1);s.material.color.copy(col(c));s.material.opacity=1}
/* Mồi Nhử Khổng Lồ: dựng lại tàu mồi khổng lồ bằng chính mô hình 3D của tàu được sao chép, phủ ánh vàng */
function decoy10(o,a){const D=o.D,sh=o.sh;if(!sh||!sh.img)return;const m=model(sh.img,'s');if(!m)return;let g=DEC.get(o);
  if(!g){const k=D.size/Math.max(sh.W||1,sh.H||1),ww=(sh.W||1)*k,hh=(sh.H||1)*k,hy=.26*Math.sqrt(ww*hh),mat=m.mat.clone();mat.transparent=true;mat.color=new T.Color(1.6,1.25,.5);mat.emissive=new T.Color(.35,.22,0);
    g=new T.Group();const top=new T.Mesh(m.geo,mat),bot=new T.Mesh(m.geo,mat);top.scale.set(ww,hy,hh);bot.scale.set(ww,-hy*.65,hh);top.castShadow=bot.castShadow=true;g.add(top,bot);g.userData={mat,hh,ww};scene.add(g);DEC.set(o,g)}
  const U=g.userData,f=Math.min(1,o.age/.25);g.visible=true;g.position.set(D.x,HOV+Math.sin(t3*1.4)*.12,D.y);g.rotation.set(0,-((D.ang||0)+Math.PI/2),0);U.mat.opacity=.92*f;U.mat.emissiveIntensity=D.hit>0?2.4:1.4;U.seen=t3;
  const rr=D.size*.55;tor10(D.x,.15,D.y,rr,'#ffd24a',.7*f*a);dot10(D.x,HOV,D.y,D.size*1.4,'#ffd24a',.2*f*a);
  const ay=HOV+1.2+D.size*.35+.15*Math.sin(t3*4);beam10(new T.Vector3(D.x,ay+.5,D.y),new T.Vector3(D.x,ay,D.y),'#ffe58a',.12,.9*f*a);dot10(D.x,ay,D.y,.8,'#ffe58a',.8*f*a);
  bar10(D.x,HOV+1+D.size*.35,D.y,Math.max(1.6,D.size*.6),D.hp/D.max,'#ffd24a')}
function skill3d10(G,dt){const X=G.csk&&G.csk.vf&&G.csk.vf.x2;sk10Init();const S10=SK10,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z),ok=e=>e&&!e.dead;
  const fa=o=>o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
  if(X&&X.c5)X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=fa(o);
    /* Bầy Ong Lửa: 80 con ong lửa vỗ cánh, kéo vệt lửa, lao vào mục tiêu */
    if(k==='bee'){const g=S10.BEE.get(),U=g.userData,an=o.a||0,w=Math.sin(t3*70+o.x*9)*.7;g.scale.setScalar(2.2);g.position.set(o.x,Y+.15*Math.sin(t3*9+o.y*3),o.y);g.rotation.set(0,Math.atan2(Math.cos(an),Math.sin(an)),0);U.w1.rotation.z=.4+w;U.w2.rotation.z=-.4-w;
      dot10(o.x,Y,o.y,.7,'#ff9a2a',.55*a);beam10(V3a(o.x,o.y),V3a(o.x-Math.cos(an)*.9,o.y-Math.sin(an)*.9),'#ff6a1a',.06,.6*a)}
    /* Hộ Vệ Song Sinh: 2 drone hộ vệ bốn cánh quạt màu xanh lục bay quanh tàu */
    else if(k==='gdrn'){const D=o.D;if(!ok(D))return;const f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.4)),g=S10.DRN.get(),U=g.userData;g.position.set(D.x,Y+.25+.1*Math.sin(t3*3+D.x),D.y);g.rotation.y=t3*.5;g.scale.setScalar(f);U.R.forEach((r,i)=>r.rotation.y=t3*40+i);
      U.c.material.emissive.copy(D.hit>0?WH3:lin(0x1a6a40));dot10(D.x,Y+.25,D.y,1.6,'#66ffaa',.35*f*a);bar10(D.x,Y+1,D.y,1,D.hp/D.max,'#66ffaa')}
    /* Bóng Chiến Binh: vòng nét đứt xanh + vòng đếm thời gian quanh bóng ma (tàu bóng ma đã là mô hình 3D trong suốt) */
    else if(k==='shad'){const g=o.g;if(!ok(g))return;const R=(g.size||2.2)*.6,f=Math.max(0,Math.min(1,o.age/.3,(o.max-o.age)/.5)),rem=Math.max(0,1-o.age/o.max),n=24;
      for(let i=0;i<n;i++){const an=i/n*TAU+t3*.8;if(i%2)continue;beam10(V3a(g.x+Math.cos(an)*R,g.y+Math.sin(an)*R,.6),V3a(g.x+Math.cos(an+TAU/n)*R,g.y+Math.sin(an+TAU/n)*R,.6),'#8fd8ff',.04,.7*f*a)}
      const m=Math.max(1,Math.round(32*rem));for(let i=0;i<m;i++){const an=-Math.PI/2+i/32*TAU;dot10(g.x+Math.cos(an)*R*1.15,.6,g.y+Math.sin(an)*R*1.15,.35,'#cfeeff',.8*f*a)}dot10(g.x,Y,g.y,R*2.6,'#58b8ff',.18*f*a)}
    /* Vệ Tinh Pháo: vệ tinh vàng có tấm pin mặt trời, chĩa đĩa và bắn tia vàng liên tục */
    else if(k==='satl'){const D=o.D;if(!ok(D))return;const f=Math.max(0,Math.min(1,o.age/.3,(o.max-o.age)/.5)),g=S10.SAT.get(),U=g.userData,y=Y+1.2+Math.sin(t3*1.6)*.15,t=o.tg;g.position.set(D.x,y,D.y);g.scale.setScalar(1.3*f);
      U.b.material.emissive.copy(D.hit>0?WH3:lin(0x6a4a00));if(ok(t)){g.rotation.set(0,Math.atan2(t.x-D.x,t.y-D.y),0);const A=V3a(D.x,D.y,y),B=V3a(t.x,t.y),pu=1+.12*Math.sin(t3*38);beam10(A,B,'#ffc21a',.22*pu,f*a);dot10(B.x,Y,B.z,1.6,'#ffd24a',.7*f*a);dot10(A.x,y,A.z,1.1,'#ffe27a',.6*f*a)}else g.rotation.set(0,Math.sin(t3*.6)*.4,0);
      bar10(D.x,y+1.2,D.y,1.8,D.hp/D.max,'#ffd24a')}
    else if(k==='bdec'){if(ok(o.D))decoy10(o,a)}});
  DEC.forEach((g,o)=>{if(g.userData.seen!==t3||!o.D||o.D.dead||o.done){g.visible=false;if(!o.D||o.D.dead||o.done||t3-(g.userData.seen||0)>2){scene.remove(g);g.userData.mat.dispose();DEC.delete(o)}}});
  S10.B.end();S10.DOT.end();S10.TOR.end();S10.BAR.end();S10.BEE.end();S10.DRN.end();S10.SAT.end()}
/* ===================== KỸ NĂNG 3D (đợt 11) =====================
   Đóng Băng · Hút Máu · Thiên Thạch · Bùng Nổ Plasma · Dịch Chuyển Tức Thời · Rải Mìn · Nhảy Chân Không · Mã Hóa Thời Không · Chớp Điện Tốc · Thả Cầu Phát Nổ */
Object.assign(R3.c5k,{iceb:1,icee:1,lsa:1,mete:1,pexp:1,pbal:1,tpr:1,vac:1,ports:1,lnz:1,bomber:1,tbeam:1,wave:1});
let SK11=null;const BMB=new Map();
function sk11Init(){if(SK11)return SK11;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.018,8,72);torus.rotateX(Math.PI/2);
  const iceM=new T.MeshStandardMaterial({color:lin(0xcff4ff),transparent:true,opacity:.75,metalness:.1,roughness:.08,emissive:lin(0x3a90e0),emissiveIntensity:.55,flatShading:true});
  const crys=new T.IcosahedronGeometry(1,0),hexP=new T.CylinderGeometry(1,1,1,6,1),mineG=new T.SphereGeometry(.2,12,8),spike=new T.ConeGeometry(.05,.16,5);
  const mineM=new T.MeshStandardMaterial({color:lin(0x6a5a3a),metalness:.8,roughness:.35,emissive:lin(0xffa040),emissiveIntensity:.15});
  const disk=new T.CircleGeometry(1,40);disk.rotateX(-Math.PI/2);
  SK11={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(SHG,AD(0xffffff,1));scene.add(m);return m}),
    CRY:Pool(()=>{const m=new T.Mesh(crys,iceM.clone());m.castShadow=true;scene.add(m);return m}),
    HEX:Pool(()=>{const g=new T.Group(),a=new T.Mesh(hexP,iceM.clone()),b=new T.Mesh(hexP,AD(0xffffff,.5));a.material.opacity=.4;a.material.depthWrite=false;b.material.wireframe=true;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    ROCK:Pool(()=>{const m=new T.Mesh(rockGeo(.5),new T.MeshStandardMaterial({color:lin(0x4a3020),roughness:.9,emissive:lin(0xff5a10),emissiveIntensity:.35,flatShading:true}));m.castShadow=true;scene.add(m);return m}),
    HOLE:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.92,depthWrite:false}));m.renderOrder=2;scene.add(m);return m}),
    MINE:Pool(()=>{const g=new T.Group(),b=new T.Mesh(mineG,mineM);g.add(b);for(let i=0;i<6;i++){const s=new T.Mesh(spike,mineM),v=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]][i];s.position.set(v[0]*.22,v[1]*.22,v[2]*.22);s.lookAt(v[0]*2,v[1]*2,v[2]*2);s.rotateX(Math.PI/2);g.add(s)}
      const l=new T.Sprite(ADDM(glowT()));l.scale.setScalar(.35);l.position.y=.22;g.add(l);g.userData={l};scene.add(g);return g})};
  return SK11}
function beam11(a,b,c,w,o){const g=SK11.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap11(a,b,c,o,sd,amp,w){amp=amp||.4;const n=10,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(t3*70+i*4+sd)*amp:0,up=i<n?Math.cos(t3*61+i*7+sd)*amp*.6:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam11(p0,p1,c,w||.08,o);p0=p1}}
function dot11(x,y,z,s,c,o){const d=SK11.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor11(x,y,z,r,c,o){const t=SK11.TOR.get();t.position.set(x,y,z);t.scale.setScalar(r);t.rotation.set(0,0,0);t.material.color.copy(col(c));t.material.opacity=o;return t}
/* lỗ đen nhỏ: đĩa đen + 3 nhánh xoắn tím/lam */
function hole11(x,z,R,o){if(R<=.02)return;const h=SK11.HOLE.get();h.position.set(x,.06,z);h.scale.setScalar(R);h.material.opacity=.92*o;
  for(let j=0;j<3;j++)for(let i=1;i<=9;i++){const t=i/9,aa=-t3*4+j*2.09+t*7,r=R*(1+t*1.6);dot11(x+Math.cos(aa)*r,.15+.1*t,z+Math.sin(aa)*r,.45*(1-t*.5),['#7a5cff','#b98cff','#5ad0ff'][j],.6*o)}tor11(x,.1,z,R,'#d9c8ff',.7*o);dot11(x,.3,z,R*3,'#8a6cff',.25*o)}
/* Thả Cầu Phát Nổ: tàu ném bom bay lên bằng chính mô hình 3D của tàu nguồn */
function bomber11(o,a){const sh=o.sh;if(!sh||!sh.img)return null;const m=model(sh.img,'s');if(!m)return null;let g=BMB.get(o);
  if(!g){const ww=sh.W*o.sc,hh=sh.H*o.sc,hy=.26*Math.sqrt(ww*hh),mat=m.mat.clone();mat.transparent=true;g=new T.Group();const top=new T.Mesh(m.geo,mat),bot=new T.Mesh(m.geo,mat);top.scale.set(ww,hy,hh);bot.scale.set(ww,-hy*.65,hh);top.castShadow=bot.castShadow=true;g.add(top,bot);g.userData={mat};scene.add(g);BMB.set(o,g)}
  const L=Math.min(1,o.lift||0),f=o.ph===2?Math.max(0,1-((o.lift||1)-1)/1.2):1;g.visible=true;g.userData.seen=t3;g.position.set(o.x,HOV+L*2.2+(o.ph===2?((o.lift||1)-1)*3:0),o.y);g.rotation.set(0,-(o.ang+Math.PI/2),0);g.scale.setScalar(1+L*.3);g.userData.mat.opacity=.95*f*a;return g}
function skill3d11(G,dt){const C=G.csk,X=C&&C.vf&&C.vf.x2;sk11Init();const S11=SK11,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z),ok=e=>e&&!e.dead;
  const fa=o=>o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
  if(X&&X.c5)X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=fa(o);
    /* Đóng Băng: tảng băng pha lê rơi từ trên trời xuống rồi vỡ toả gai băng */
    if(k==='iceb'){if(o.age<.6){const p=o.age/.6,c=S11.CRY.get();c.position.set(o.x,Y+13.5*(1-p*p),o.y);c.scale.set(1.5,1.9,1.5).multiplyScalar(1+.4*(1-p));c.rotation.set(t3*2,t3*1.3,0);c.material.opacity=.85;dot11(o.x,Y+13.5*(1-p*p),o.y,4,'#8fe0ff',.35);dot11(o.x,.1,o.y,3*p,'#0a3a6a',.4*p)}
      else{const u=(o.age-.6)/.25,f=Math.max(0,1-u);for(let i=0;i<14;i++){const an=i/14*TAU+.3,r0=.5+u*1.2,r1=(1.6+u*3.2)*(i%2?1:.7);beam11(V3a(o.x+Math.cos(an)*r0,o.y+Math.sin(an)*r0,Y*.6),V3a(o.x+Math.cos(an)*r1,o.y+Math.sin(an)*r1,Y*.6+(i%3)*.3),'#dffaff',.1,f*a)}dot11(o.x,Y,o.y,8*(1-u*.4),'#9ee8ff',.7*f*a)}}
    /* tàu địch bị đóng băng: khối băng lục giác bọc quanh, có tia lấp lánh */
    else if(k==='icee'){const e=o.e;if(!ok(e))return;const R=(e.size||2)*.55,f=Math.max(0,Math.min(1,o.age/.15,(o.max-o.age)/.4)),g=S11.HEX.get(),U=g.userData;g.position.set(e.x,Y,e.y);g.scale.set(R,1,R);g.rotation.y=.3;U.a.material.opacity=.45*f*a;U.b.material.opacity=.6*f*a;
      const sp=(Math.sin(t3*6+e.x)+1)/2;dot11(e.x+R*.3,Y+.55,e.y-R*.3,.7,'#ffffff',sp*f*a);dot11(e.x,Y,e.y,R*2.8,'#9ee8ff',.3*f*a)}
    /* Hút Máu: vòng đỏ bao tàu, giọt máu bay lên, vòng đếm thời gian */
    else if(k==='lsa'){const P=o.P;if(!ok(P))return;const R=(P.size||2.2)*.5,f=Math.max(0,Math.min(1,o.age/.2,(o.max-o.age)/.6)),pl=P.c14lf>0?1:0;tor11(P.x,Y-.2,P.y,R*(1+.05*Math.sin(t3*8)),'#ff4a6a',(.55+.4*pl)*f*a);
      for(let i=0;i<6;i++){const u=(t3*.8+i/6)%1,an=i*1.047+t3*.4;dot11(P.x+Math.cos(an)*R*.8,Y-.2+u*1.6,P.y+Math.sin(an)*R*.8,.4,'#ff4a6a',(1-u)*.85*f*a)}
      const rem=Math.max(0,1-o.age/o.max),n=Math.max(1,Math.round(30*rem));for(let i=0;i<n;i++){const an=-Math.PI/2+i/30*TAU;dot11(P.x+Math.cos(an)*R*1.2,Y-.2,P.y+Math.sin(an)*R*1.2,.28,'#ffb0bd',.8*f*a)}dot11(P.x,Y,P.y,R*3,'#ff3050',(.18+.2*pl)*f*a)}
    /* Thiên Thạch: thiên thạch lửa rơi chéo từ trên trời, vòng cảnh báo đỏ dưới đất */
    else if(k==='mete'){const p=Math.min(1,o.age/o.max),r=S11.ROCK.get(),hx=o.x+3*(1-p),hy=Y+18*(1-p),hz=o.y-1.5*(1-p);r.position.set(hx,hy,hz);r.scale.setScalar(1.3);r.rotation.set(t3*3,t3*2,0);
      dot11(hx,hy,hz,2.4,'#ff7a1a',.9);dot11(hx,hy,hz,1.2,'#ffe0a0',.8);beam11(V3a(hx,hz,hy),V3a(hx+1.4,hz-.7,hy+4.5),'#ff8a30',.35,.7);if(Math.random()<.5)smoke(hx,hy,hz,.6,.35);
      tor11(o.x,.1,o.y,2.4*(.5+.5*p),'#ff6a30',.25+.45*p)}
    /* Bùng Nổ Plasma: quả cầu plasma tím bay thẳng rồi nổ thành quả cầu tím khổng lồ toả sét */
    else if(k==='pbal'){const pu=1+.2*Math.sin(t3*25),b=S11.BALL.get();b.position.set(o.x,Y,o.y);b.scale.setScalar(.35*pu);b.material.color.set(0xc080ff);b.material.opacity=.9;dot11(o.x,Y,o.y,2.6*pu,'#a050ff',.55);
      for(let i=0;i<4;i++){const an=t3*11+i*1.57;zap11(V3a(o.x,o.y),V3a(o.x+Math.cos(an)*.9,o.y+Math.sin(an)*.9,Y+Math.sin(t3*40+i)*.4),'#e8c8ff',.8,i*5,.08,.04)}if(Math.random()<.4)spark(o.x,Y,o.y,rand(-1,1),rand(-.3,.3),rand(-1,1),'#d8a0ff',.4,.2)}
    else if(k==='pexp'){const u=Math.min(1,o.age/.35),R=Math.max(.1,10*(1-Math.pow(1-u,3))),f=Math.max(0,1-Math.max(0,o.age-.35)/.75),b=S11.BALL.get();b.position.set(o.x,0,o.y);b.scale.set(R,R*.55,R);b.material.color.set(0x5a18a8);b.material.opacity=.14*f;
      tor11(o.x,.15,o.y,R,'#d8a8ff',.9*f);tor11(o.x,.15,o.y,R*.7,'#ffffff',.6*f);for(let i=0;i<8;i++){const a0=i/8*TAU+t3*.7;zap11(V3a(o.x,o.y,Y*.8),V3a(o.x+Math.cos(a0)*R*.95,o.y+Math.sin(a0)*R*.95,.3),i%2?'#f0d8ff':'#a050ff',(.35+.3*Math.sin(t3*30+i))*f,i*3,.35,.06)}dot11(o.x,Y,o.y,R*.7,'#e0c0ff',.45*f)}
    /* Dịch Chuyển Tức Thời: tia ngắm tím nét đứt + vòng ngắm tím co dần quanh mục tiêu */
    else if(k==='tpr'){const P=o.P,t=o.aim&&o.aim.tg;if(o.ph!==0||!ok(t)||!ok(P))return;const u=Math.min(1,(o.t1||0)/3),R=(t.size||2)*.5*(1.7-.7*u);
      const A=V3a(P.x,P.y),B=V3a(t.x,t.y),d=B.clone().sub(A),L=d.length(),n=Math.floor(L/.5);for(let i=0;i<n;i+=2)beam11(A.clone().addScaledVector(d,i/n),A.clone().addScaledVector(d,Math.min(1,(i+1)/n)),'#c080ff',.03,.55);
      tor11(t.x,Y,t.y,R,'#d8a0ff',.95);tor11(t.x,Y,t.y,R*.6,'#c080ff',.5).rotation.set(t3*2,0,0);for(let i=0;i<4;i++){const an=i*Math.PI/2+t3;beam11(V3a(t.x+Math.cos(an)*R*.75,t.y+Math.sin(an)*R*.75),V3a(t.x+Math.cos(an)*R*1.3,t.y+Math.sin(an)*R*1.3),'#d8a0ff',.05,.9)}}
    /* Nhảy Chân Không: 2 lỗ đen nối nhau, cả hạm đội chui qua; đồng đội vừa dịch chuyển có vòng sáng lam */
    else if(k==='vac'){const g=Math.min(1,o.age/.25),ea=Math.max(0,Math.min(1,(o.max-o.age)/.4)),ta=o.age-o.tpT;hole11(o.ax,o.ay,1.3*(o.tp?Math.max(0,1-ta/.8):1)*g,ea);hole11(o.bx,o.by,1.3*g,ea);
      if(o.tp&&ta<2){const f=Math.max(0,Math.min(1,(2-ta)/.4));(o.us||[]).forEach(u=>{if(!ok(u))return;tor11(u.x,Y,u.y,(u.size||2)*.5,'#bfeaff',.85*f);dot11(u.x,Y,u.y,(u.size||2)*1.3,'#8ad8ff',.25*f)})}}
    /* Mã Hóa Thời Không: 5 cổng không gian xoáy tím rải khắp bản đồ */
    else if(k==='ports'){const ea=Math.max(0,Math.min(1,(o.max-o.age)/.4)),g=Math.min(1,o.age/.25)*ea;(o.H||[]).forEach(h=>{hole11(h.x,h.y,2*g*.55,g);tor11(h.x,.12,h.y,2*g,'#d9c8ff',.8*g)})}
    /* Chớp Điện Tốc: vệt sét lam để lại trên đường lướt */
    else if(k==='lnz'){const f=Math.max(0,Math.min(1,(o.max-o.age)/.6)),A=V3a(o.x1,o.y1,Y*.5),B=V3a(o.x2,o.y2,Y*.5);beam11(A,B,'#66b8ff',.35,.25*f);zap11(A,B,'#e8f6ff',.95*f,Math.floor(t3*18),.35,.06);zap11(A,B,'#66b8ff',.5*f,Math.floor(t3*18)+7,.4,.05)}
    /* Thả Cầu Phát Nổ: tàu nguồn bay lên cao, bay tới mục tiêu và thả bom */
    else if(k==='bomber'){bomber11(o,1)}
    else if(k==='tbeam'){const B=o.B,t=o.t;if(!ok(t)||!B)return;const by=HOV+Math.min(1,B.lift||0)*2.2,A=V3a(B.x,B.y,by),E=V3a(t.x,t.y,Y+(t.lift||0)*1.3);beam11(A,E,'#ffd24a',.45,.7*a);dot11(E.x,E.y,E.z,1.6+.3*Math.sin(t3*10),'#ffd24a',.5*a)}
    /* sóng nổ lam lan rộng */
    else if(k==='wave'){const f=1-o.age/o.max,R=Math.max(.05,o.r||0);tor11(o.x,.2,o.y,R,o.col||'#8ee8ff',.8*f);tor11(o.x,.2,o.y,R*.97,'#ffffff',.6*f)}});
  BMB.forEach((g,o)=>{if(g.userData.seen!==t3){g.visible=false;if(o.done||o.age>=o.max||t3-(g.userData.seen||0)>2){scene.remove(g);g.userData.mat.dispose();BMB.delete(o)}}});
  /* Rải Mìn: mìn gai kim loại lơ lửng, đèn cam nhấp nháy khi sắp hết giờ */
  const V=C&&C.vf;if(V&&V.m)V.m.forEach(m=>{if(m.t<=0)return;const g=S11.MINE.get(),fl=m.t<3?(Math.sin(t3*14)>0?1:.3):1;g.position.set(m.x,.45+.06*Math.sin(t3*3+m.x),m.y);g.rotation.set(t3*.5,t3*.8,0);g.userData.l.material.color.set(m.arm>0?0x888888:0xffa040);g.userData.l.material.opacity=fl});
  S11.B.end();S11.DOT.end();S11.TOR.end();S11.BALL.end();S11.CRY.end();S11.HEX.end();S11.ROCK.end();S11.HOLE.end();S11.MINE.end()}
/* ===================== KỸ NĂNG 3D (đợt 12) =====================
   nhóm kỹ năng đặc biệt dùng danh sách x2: Lỗ Sâu Nhỏ · Vòng Sóng Tím · Khóa Mục Tiêu Xanh · Khóa Tên Lửa Đỏ · Bắn Phá Chéo · Vòng Bảo Vệ Vàng · Chiến Thuật Số
   · Tường Khiên Chắn · Bùng Nổ Đỏ · Tâm Điểm Chính Xác · Bẫy Vòng Tím · Sóng Thời Không · Đốm Sáng Lừa · Bóng Ma Xanh Lục · Lướt Xanh … */
let SK12=null;
const rgbHex=s=>{if(!s)return '#ffffff';if(s[0]==='#')return s;const p=String(s).split(',').map(v=>Math.max(0,Math.min(255,parseInt(v)||0)));return '#'+p.map(v=>v.toString(16).padStart(2,'0')).join('')};
function sk12Init(){if(SK12)return SK12;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.02,8,72);torus.rotateX(Math.PI/2);
  const disk=new T.CircleGeometry(1,48);disk.rotateX(-Math.PI/2);const blade=new T.TorusGeometry(1,.07,6,32,1.6);blade.rotateX(Math.PI/2);blade.rotateY(-.8);
  const hex=new T.CylinderGeometry(.3,.3,.13,6),arm=new T.BoxGeometry(.05,.035,.5),rot=new T.CylinderGeometry(.18,.18,.015,14);
  const armM=new T.MeshStandardMaterial({color:lin(0xdde8ff),metalness:.7,roughness:.3}),rotM=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false});
  const flame=new T.ConeGeometry(1,1,12,1,true);flame.rotateX(-Math.PI/2);flame.translate(0,0,-.5);/* lửa: đỉnh hướng -z */
  SK12={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    DISK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.renderOrder=2;scene.add(m);return m}),
    DARK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0x061440,transparent:true,opacity:.85,depthWrite:false}));m.renderOrder=2;scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(SHG,AD(0xffffff,1));scene.add(m);return m}),
    BLD:Pool(()=>{const m=new T.Mesh(blade,AD(0xc07bff,1));scene.add(m);return m}),
    WALL:Pool(()=>{const g=new T.Group(),f=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0x50aaff,transparent:true,opacity:.2,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false})),p=new T.Mesh(new T.BoxGeometry(.12,1,1),new T.MeshStandardMaterial({color:lin(0x9fe3ff),transparent:true,opacity:.55,emissive:lin(0x3a9aff),emissiveIntensity:.9,metalness:.2,roughness:.1,depthWrite:false})),gw=new T.Mesh(new T.PlaneGeometry(1,1,5,5),new T.MeshBasicMaterial({color:0xbfeaff,wireframe:true,transparent:true,opacity:.5,toneMapped:false}));
      f.rotation.x=-Math.PI/2;gw.rotation.y=Math.PI/2;g.add(f,p,gw);g.userData={f,p,gw};scene.add(g);return g}),
    BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s}),
    FL:Pool(()=>{const m=new T.Mesh(flame,AD(0x60b0ff,.85));m.frustumCulled=false;scene.add(m);return m}),
    DRN:Pool(()=>{const g=new T.Group(),c=new T.Mesh(hex,new T.MeshStandardMaterial({color:0xffffff,metalness:.6,roughness:.35,emissive:0x000000,emissiveIntensity:.8}));g.add(c);const R=[];for(let i=0;i<4;i++){const an=i*Math.PI/2+Math.PI/4,a=new T.Mesh(arm,armM);a.position.set(Math.cos(an)*.25,0,Math.sin(an)*.25);a.rotation.y=-an+Math.PI/2;const r=new T.Mesh(rot,rotM);r.position.set(Math.cos(an)*.48,.05,Math.sin(an)*.48);g.add(a,r);R.push(r)}
      const l=new T.Sprite(ADDM(glowT()));l.scale.setScalar(.7);g.add(l);g.userData={c,R,l};scene.add(g);return g})};
  return SK12}
function beam12(a,b,c,w,o){const g=SK12.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function dot12(x,y,z,s,c,o){const d=SK12.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor12(x,y,z,r,c,o){const t=SK12.TOR.get();t.position.set(x,y,z);t.scale.setScalar(Math.max(.01,r));t.rotation.set(0,0,0);t.material.color.copy(col(c));t.material.opacity=o;return t}
function disk12(x,y,z,r,c,o){const d=SK12.DISK.get();d.position.set(x,y,z);d.scale.setScalar(Math.max(.01,r));d.material.color.copy(col(c));d.material.opacity=o;return d}
function dash12(x,z,y,R,c,o,n,rot,w){n=n||20;for(let i=0;i<n;i+=1){const a0=i/n*TAU+(rot||0),a1=a0+TAU/n*.6;beam12(new T.Vector3(x+Math.cos(a0)*R,y,z+Math.sin(a0)*R),new T.Vector3(x+Math.cos(a1)*R,y,z+Math.sin(a1)*R),c,w||.05,o)}}
function arcDots12(x,z,y,R,a0,len,c,o,s){const n=Math.max(2,Math.round(len*R*4));for(let i=0;i<=n;i++){const an=a0+len*i/n;dot12(x+Math.cos(an)*R,y,z+Math.sin(an)*R,s||.3,c,o)}}
function bar12(x,y,z,w,f,c){const bg=SK12.BAR.get();bg.position.set(x-w/2,y,z);bg.scale.set(w,.12,1);bg.material.color.set(0x101820);bg.material.opacity=.8;if(f<=0)return;const s=SK12.BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),.12,1);s.material.color.copy(col(c));s.material.opacity=1}
function drone12(x,z,ang,c,o,sc){const g=SK12.DRN.get(),U=g.userData;g.position.set(x,HOV+.3+.08*Math.sin(t3*4+x),z);g.rotation.set(0,-ang,0);g.scale.setScalar((sc||1)*Math.max(.05,o));U.c.material.color.copy(col(c)).lerp(WH3,.4);U.c.material.emissive.copy(col(c));U.l.material.color.copy(col(c));U.l.material.opacity=.6*o;U.R.forEach((r,i)=>r.rotation.y=t3*40+i)}
function skill3d12(G,dt){const C=G.csk,X=C&&C.vf&&C.vf.x2;if(!X)return;sk12Init();const S=SK12,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z),ok=e=>e&&!e.dead;
  /* Lỗ Sâu Nhỏ: cặp lỗ sâu xanh lam xoáy nối hai đầu */
  (X.wm||[]).forEach(w=>{const fa=Math.max(0,Math.min(1,w.t/.4,(w.max-w.t)/.25+.05));[w.a,w.b].forEach((A,ix)=>{const R=w.r,d=S.DARK.get();d.position.set(A.x,.05,A.y);d.scale.setScalar(R);d.material.opacity=.85*fa;
    for(let i=0;i<3;i++)arcDots12(A.x,A.y,.15+i*.12,R*(1-i*.25),t3*(ix?-2.2:2.2)+i*2,4.2,i?'#7fd0ff':'#d8f2ff',fa*(.8-i*.2),.35);dot12(A.x,.4,A.y,R*2.6,'#3a90ff',.3*fa)})});
  /* sóng tròn tím lan rộng */
  (X.pr||[]).forEach(r=>{const fa=Math.max(0,1-r.r/r.max*.7);tor12(r.x,.25,r.y,r.r,'#d8b8ff',.9*fa);tor12(r.x,.25,r.y,r.r*.985,'#9a3cff',.5*fa)});
  (X.tr||[]).forEach(r=>{const P=r.P;if(!ok(P))return;const p=1-r.t/r.max;dot12(P.x,Y,P.y,1+3*p,'#6ec8ff',.4+.5*p)});
  /* Vòng Sóng Tím: quả cầu tím nạp năng lượng quanh tàu */
  (X.pg||[]).forEach(p=>{const el=p.max-p.t;if(el<2||!ok(p.P))return;const k=(el-2)/2,R=.5+2.2*k;dot12(p.P.x,Y,p.P.y,R*2.2,'#be6eff',.5+.4*k);tor12(p.P.x,Y,p.P.y,R*(1.3-.4*((t3*3)%1)),'#e0c4ff',.8)});
  /* tia kỹ năng (laser, xung, chùm…) + drone hỗ trợ */
  (X.g||[]).forEach(g=>{
    if(g.k==='dro'){const oa=g.orb?g.orb.a0+g.orb.w*(g.max-g.t):0,p=g.orb?{x:g.fr.x+Math.cos(oa)*g.orb.r,y:g.fr.y+Math.sin(oa)*g.orb.r}:(g.fr?{x:g.fr.x+g.ox,y:g.fr.y+g.oy}:{x:g.x,y:g.y}),tg=g.tg,ang=tg?Math.atan2(tg.y-p.y,tg.x-p.x):-Math.PI/2,fa=Math.max(0,Math.min(1,g.t/.25,(g.max-g.t)/.2+.01));drone12(p.x,p.y,g.img==='r'?t3*2.4:ang,g.img==='r'?'#ff3a2a':'#5ab8ff',fa,g.img==='r'?1.3:1);return}
    const f=g.fr?{x:g.fr.x+(g.ox||0),y:g.fr.y+(g.oy||0)}:{x:g.fx,y:g.fy},e=g.tg?{x:g.tg.x,y:g.tg.y}:{x:g.ex,y:g.ey},p=1-g.t/g.max,fa=Math.max(0,g.big?Math.min(1,g.t/.12,(1-p)*1.4):Math.min(1,g.t/.12,(g.max-g.t)/.1+.05)),w=g.w||.3,c0=rgbHex(g.c&&g.c[0]),A=V3a(f.x,f.y),B=V3a(e.x,e.y);
    beam12(A,B,c0,w*.5,.55*fa);beam12(A,B,(g.c&&g.c[1])||'#ffffff',w*.2,.75*fa);
    if(g.fl){for(let i=0;i<6;i++){let u=((t3*1.4)+i/6)%1;if(g.fl<0)u=1-u;const q=A.clone().lerp(B,u);dot12(q.x,q.y,q.z,Math.max(.3,w*.9),'#ffffff',fa)}}
    if(g.tg&&!g.big)dot12(B.x,B.y,B.z,1.1,c0,fa)});
  /* Khóa Mục Tiêu Xanh / Đỏ: vòng đếm ngược + 4 góc khung ngắm quanh mục tiêu */
  (X.mk||[]).forEach(m=>{const e=m.e;if(!ok(e))return;const r=(e.size||2)*.55*.5,c=m.k==='b'?'#4da6ff':'#ff3a3a',y=Y+.5;arcDots12(e.x,e.y,y,r*1.15,t3*2,TAU*Math.max(0,m.t/m.max),c,.9,.28);
    const b=r*.95,l=r*.35;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,d])=>{const cx=e.x+a*b,cz=e.y+d*b;beam12(V3a(cx,cz-d*l,y),V3a(cx,cz,y),c,.05,.9);beam12(V3a(cx,cz,y),V3a(cx-a*l,cz,y),c,.05,.9)});disk12(e.x,y-.02,e.y,r,c,.15)});
  /* tên lửa vàng (Khóa Tên Lửa Đỏ) */
  (X.yl||[]).forEach(b=>{const l=Math.hypot(b.vx,b.vy)||1,dx=b.vx/l,dz=b.vy/l;beam12(V3a(b.x,b.y),V3a(b.x-dx*1.5,b.y-dz*1.5),'#ffbe1e',.5,.6);beam12(V3a(b.x,b.y),V3a(b.x-dx*1.2,b.y-dz*1.2),'#ffe58a',.22,.95);dot12(b.x,Y,b.y,1.1,'#ffffff',.9)});
  (X.k||[]).forEach(b=>{drone12(b.x,b.y,t3*6+(b.id||0),'#b070ff',1,1.1);beam12(V3a(b.x,b.y),V3a(b.x-Math.cos(b.ang)*.9,b.y-Math.sin(b.ang)*.9),'#c07bff',.06,.5)});
  (X.gh||[]).forEach(b=>drone12(b.x,b.y,b.ang+Math.PI/2,'#4dff9a',1,1));
  /* Vòng Bảo Vệ Vàng: vòng khiên vàng nét đứt quay quanh đồng đội */
  (X.gr||[]).forEach(r=>{const U=r.fr;if(!ok(U))return;const R=(U.size||2.2)*.8*.5,fa=Math.max(0,Math.min(1,r.t/.15,(r.max-r.t)/.1+.1));dash12(U.x,U.y,Y,R,'#ffe58a',.9*fa,16,t3*2.4,.07);tor12(U.x,Y,U.y,R*1.08,'#fff6c8',.6*fa);dot12(U.x,Y,U.y,R*2.6,'#ffc828',.25*fa)});
  /* Chiến Thuật Số: đường đi nét đứt xanh lục dẫn mục tiêu tới vòng đích, chấm trắng chạy dọc */
  (X.pd||[]).forEach(d=>{const e=d.e;if(!ok(e)||!d.pts||!d.pts.length)return;const pts=d.pts,fa=Math.min(1,d.t/.3+.3);for(let i=1;i<pts.length;i++)if(i%2)beam12(V3a(pts[i-1].x,pts[i-1].y,.3),V3a(pts[i].x,pts[i].y,.3),'#4dffb0',.05,.7*fa);
    const end=pts[pts.length-1],R=(e.size||2)*.25;tor12(end.x,.3,end.y,R,'#9fffd6',.8*fa);disk12(end.x,.28,end.y,R,'#4dffb0',.2*fa);
    const pr=Math.min(1,1-d.t/d.max),fi=pr*(pts.length-1),i0=Math.floor(fi),i1=Math.min(pts.length-1,i0+1),f=fi-i0;dot12(pts[i0].x+(pts[i1].x-pts[i0].x)*f,.35,pts[i0].y+(pts[i1].y-pts[i0].y)*f,.5,'#ffffff',fa)});
  /* Tường Khiên Chắn: bức tường năng lượng dựng đứng, nền vuông lưới xanh, thanh máu */
  (X.wl||[]).forEach(w=>{const Sz=5,fa=w.mode==='wall'?Math.max(0,Math.min(1,w.t/.4,w.age/.2+.2)):1,hr=Math.max(0,w.hp/w.max),g=S.WALL.get(),U=g.userData,an=Math.atan2(w.dy,w.dx);g.position.set(w.cx,0,w.cy);g.rotation.set(0,-an,0);
    U.f.scale.set(Sz,Sz,1);U.f.position.set(0,.06,0);U.f.material.opacity=(.1+.18*hr+(w.hit>0?.25:0))*fa;U.p.scale.set(1,2.6,Sz);U.p.position.set(Sz/2,1.3,0);U.p.material.opacity=(.35+.3*hr)*fa;U.p.material.emissiveIntensity=w.hit>0?2:.9;U.gw.scale.set(Sz,2.6,1);U.gw.position.set(Sz/2+.07,1.3,0);U.gw.material.opacity=.45*fa;
    bar12(w.cx,3.2,w.cy,Sz*.8,hr,'#7fdcff')});
  /* Bùng Nổ Đỏ: cầu lửa đỏ bay tới, nạp năng lượng với vùng nổ đỏ co dần */
  (X.ob||[]).forEach(o=>{const ch=o.age>=o.fly,pr=ch?Math.min(1,(o.age-o.fly)/o.ch):0,R=.5*(1+.3*Math.sin(o.age*(10+pr*20))+pr*.6),b=S.BALL.get();b.position.set(o.x,Y,o.y);b.scale.setScalar(R*.6);b.material.color.set(0xff5030);b.material.opacity=.95;dot12(o.x,Y,o.y,R*4,'#ff3a1a',.8);dot12(o.x,Y,o.y,R*1.4,'#fff0c8',.9);
    if(ch){disk12(o.x,.08,o.y,8,'#ff3a1a',.08+.1*pr);dash12(o.x,o.y,.15,8*(1-pr*.85),'#ff6a3a',.6,28,t3*.6,.06)}});
  (X.sh||[]).forEach(b=>{const a=Math.max(0,b.t/b.max);beam12(V3a(b.x,b.y),V3a(b.x-Math.cos(b.a)*.9,b.y-Math.sin(b.a)*.9),'#ff8a3a',.08,a)});
  /* Tâm Điểm Chính Xác: vòng ngắm đỏ-lam xoay + chữ thập trắng trên mục tiêu */
  (X.rt||[]).forEach(r=>{const e=r.e;if(!ok(e))return;const R=(e.size||2)*.5*(.75+.6*r.t/r.max),a=t3*3,y=Y+.5;[[a,'#ff3a3a'],[a+Math.PI,'#ff3a3a'],[a+1.57,'#3a8aff'],[a+1.57+Math.PI,'#3a8aff']].forEach(([s0,c])=>arcDots12(e.x,e.y,y,R,s0,1.4,c,.95,.35));
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dz])=>beam12(V3a(e.x+dx*R*.6,e.y+dz*R*.6,y),V3a(e.x+dx*R*1.25,e.y+dz*R*1.25,y),'#ffffff',.04,.95))});
  (X.ps||[]).forEach(r=>{if(!ok(r.e))return;dash12(r.e.x,r.e.y,Y,(r.e.size||2)*.3,'#4dff3a',.6,12,0,.04)});
  /* Bẫy Vòng Tím: vùng bẫy tím với vòng trong co lại */
  (X.tp||[]).forEach(r=>{const p=1-r.t/r.max;disk12(r.x,.06,r.y,r.r,'#9a4aff',.12+.18*p);tor12(r.x,.12,r.y,r.r,'#c07bff',.9);tor12(r.x,.14,r.y,r.r*(1-p*.8),'#e6ccff',.8)});
  /* vệt cầu vồng 6 màu */
  (X.rw||[]).forEach(r=>{const u=Math.min(8,r.age*16),Cs=['#3a8aff','#ff3a3a','#ff9a2a','#ffe14a','#3aff7a','#b45cff'],nx=-r.dy,ny=r.dx,fa=Math.min(1,r.t/.25);Cs.forEach((c,i)=>{const o=(i-2.5)*.15,ux=r.x+nx*o,uy=r.y+ny*o,a=Math.max(0,u-2.6);if(u-a>.01)beam12(V3a(ux+r.dx*a,uy+r.dy*a),V3a(ux+r.dx*u,uy+r.dy*u),c,.07,fa)})});
  /* Đốm Sáng Lừa: đốm sáng vàng nhử đạn */
  (X.dc||[]).forEach(d=>{if(d.dead)return;dot12(d.x,Y,d.y,.9,'#fff0a0',.95);dot12(d.x,Y,d.y,.35,'#ffffff',1)});
  /* Bóng Ma Xanh Lục: vòng tím nét đứt + 20 hạt tím quay quanh tàu */
  (X.ms||[]).forEach(m=>{const P=m.P;if(!ok(P))return;dash12(P.x,P.y,Y,2.2,'#b45cff',.7,18,t3*2.7,.06);for(let i=0;i<20;i++){const a=i*Math.PI/10+m.age*5,r=1.8+(i%4)*.3;dot12(P.x+Math.cos(a)*r,Y+.2*Math.sin(a*2),P.y+Math.sin(a)*r,.3,'#d8a8ff',.9)}});
  /* lưỡi chém cong tím bay */
  (X.sw||[]).forEach(w=>{const m=S.BLD.get();m.position.set(w.x,Y,w.y);m.rotation.set(0,-Math.atan2(w.dy,w.dx)-.0,0);m.scale.set(2,1,2);m.material.opacity=.9});
  /* Sóng Thời Không: vòng sóng lan (lam / đỏ / cầu vồng) */
  (X.cw||[]).forEach(w=>{if(w.d>0||w.r<=0)return;const fa=Math.min(1,(w.max-w.r)/3+.25);if(w.kind==='rb')['#3a8aff','#ff3a3a','#ff9a2a','#ffe14a','#3aff7a','#b45cff'].forEach((c,i)=>tor12(w.x,.25,w.y,Math.max(.05,w.r+(i-2.5)*.16),c,.85*fa));
    else{const sw=w.kind==='sw';tor12(w.x,.25,w.y,w.r,sw?'#4a9aff':'#ff2a2a',(sw?.45:.6)*fa);tor12(w.x,.25,w.y,w.r*.99,sw?'#cfe6ff':'#ffb0a0',(sw?.6:.9)*fa)}});
  /* Lướt Xanh: hai luồng lửa phản lực lam phụt sau tàu */
  (X.gl||[]).forEach(g=>{if(!g.fl)return;const u=g.u;if(!ok(u))return;const p=Math.max(0,g.t)/g.max,a=u.ang!=null?u.ang:-Math.PI/2,sz=(u.size||2.2)*.5,L=sz*(.5+1.5*p)*(.85+.15*Math.sin(t3*40)),fx=Math.cos(a),fz=Math.sin(a),sx=-fz,sz2=fx;
    [-1,1].forEach(sg=>{const bx=u.x-fx*sz*.42+sx*sg*sz*.17,bz=u.y-fz*sz*.42+sz2*sg*sz*.17,W=sz*.14*(.6+.6*p),m=S.FL.get();m.position.set(bx,Y,bz);m.rotation.set(0,Math.atan2(fx,fz),0);m.scale.set(W,W,L);m.material.opacity=.85;dot12(bx,Y,bz,W*4,'#bfe6ff',.8)})});
  S.B.end();S.DOT.end();S.TOR.end();S.DISK.end();S.DARK.end();S.BALL.end();S.BLD.end();S.WALL.end();S.BAR.end();S.FL.end();S.DRN.end()}
/* ===================== MÔ PHỎNG KỸ NĂNG 3D (Shop kỹ năng) =====================
   Dùng chung bộ dựng 3D của trận: tàu, công trình, đạn, nổ và hiệu ứng kỹ năng đã có bản 3D;
   hiệu ứng chưa có bản 3D vẫn vẽ 2D lên một tấm trong suốt phủ đúng mặt sân mô phỏng. */
function pvCam(G,PV){const WW=PV.WW,HH=PV.HH,cx=WW/2,asp=PV.w/PV.h;cam.aspect=asp;cam.fov=asp<1?62:50;cam.updateProjectionMatrix();
  const D=Math.max(WW,HH)*(asp<1?.8:.62);cam.position.set(cx,D*.9,HH+D*.35);cam.lookAt(cx,0,HH*.5);
  fxP.position.set(cx,FXY,HH/2);fxP.scale.set(WW,HH,1)}
R3.pvDraw=function(o){if(!R3.on||R3.fail)return false;if(!window.THREE){loadThree();return false}if(!init())return false;if(R3.live&&DG&&!DG.pv)return false;
  const G=o.G,prevDG=DG,prevLive=R3.live;
  const bl0=G.bl;if(o.bl){const e=(G.en||[]).find(e=>e&&!e.dead&&e.team==='e');o.bl.forEach(b=>{if(e)b.da=Math.atan2(e.y-b.y,e.x-b.x)});G.bl=(bl0||[]).concat(o.bl)}const al0=G.al,extra=(o.AL||[]).filter(a=>a&&!(al0||[]).includes(a));if(extra.length)G.al=(al0||[]).concat(extra);
  [G.pl].concat(G.en||[],G.al||[]).forEach(u=>{if(!u)return;if(u.sh&&!u.sc)u.sc=(u.size||2)/Math.max(u.sh.W||1,u.sh.H||1);if(u.ang==null||isNaN(u.ang))u.ang=u.team==='e'?Math.PI/2:-Math.PI/2});
  let fx=R3.pvFx;if(!fx){fx=R3.pvFx=document.createElement('canvas')}const fw=Math.round(o.Wpx*o.dpr),fh=Math.round(o.Hpx*o.dpr);if(fx.width!==fw||fx.height!==fh){fx.width=fw;fx.height=fh}
  const q2=fx.getContext('2d'),sc=o.sc,X=x=>x*sc,Y=y=>y*sc;
  try{DG=G;let L=[];try{pump();L=collect(G)}catch(e){console.error(e)}
    R3.hide=new Set(L.filter(i=>i.m).map(i=>i.src));R3.hiding=true;R3.live=true;
    q2.setTransform(o.dpr,0,0,o.dpr,0,0);q2.clearRect(0,0,o.Wpx,o.Hpx);
    if(o.fx2d){try{o.fx2d(q2,X,Y)}catch(e){console.error(e)}}else{try{CSK.under(q2,sc,X,Y)}catch(e){}}
    /* tàu nào chưa dựng xong mô hình 3D thì tạm vẽ hình gốc để không bị mất tàu */
    L.forEach(i=>{if(i.m||i.k!=='s')return;const u=i.o,im=_dimg(i.src);if(!im||!im.naturalWidth)return;const h=(u.size||2)*sc,w=h*im.naturalWidth/im.naturalHeight;q2.save();q2.translate(X(u.x),Y(u.y));q2.rotate((u.ang!=null?u.ang:-Math.PI/2)+Math.PI/2);if(u.ghost){q2.globalAlpha=.65}q2.drawImage(im,-w/2,-h/2,w,h);q2.restore()});
    if(!o.fx2d){try{if(G.csk)CSK.draw(q2,sc,X,Y)}catch(e){console.error(e)}}
    R3.hiding=false;R3.pv={w:o.Wpx,h:o.Hpx,WW:o.WW,HH:o.HH};gTex.image=fx;
    render(G,L);
    const q=o.q;q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,q.canvas.width,q.canvas.height);q.drawImage(cv3,0,0,q.canvas.width,q.canvas.height);q.setTransform(o.dpr,0,0,o.dpr,0,0);
    return true}
  catch(e){console.error(e);return false}
  finally{G.al=al0;G.bl=bl0;R3.pv=null;R3.hiding=false;R3.live=prevLive;DG=prevDG;gTex.image=dfc;gTex.needsUpdate=true}};
/* ===================== KỸ NĂNG 3D (đợt 13) =====================
   Vùng kỹ năng tối thượng (Mặt Trời Đỏ Thiêu Đốt, Phượng Hoàng Lửa, Siêu Tân Tinh, Mưa Sao Băng Lam, Bão Sét Tím, Hố Đen Xoáy Tròn…):
   cột vùng sáng có chiều cao + hoạ tiết 3D theo từng loại (mặt trời nổi, thiên thạch rơi thật từ trời, sét từ mây, cột sáng giáng xuống, gai băng mọc lên…)
   + các đòn rơi từ trời: Mưa Thiên Thạch nhỏ, quả cầu rơi, bão mây sét, cột sáng, tên lửa rơi (rmsl) rơi thẳng đứng */
Object.assign(R3.c5k,{met:1,fall:1,storm:1,pillar:1,bomb:1});
let SK13=null;const fr13=x=>x-Math.floor(x),rn13=(i,s)=>fr13(Math.sin(i*12.9898+s*78.233)*43758.5453);
function sk13Init(){if(SK13)return SK13;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.018,8,72);torus.rotateX(Math.PI/2);
  const disk=new T.CircleGeometry(1,48);disk.rotateX(-Math.PI/2);const wallG=new T.CylinderGeometry(1,1,1,48,1,true);wallG.translate(0,.5,0);
  const spike=new T.ConeGeometry(.22,1,6);spike.translate(0,.5,0);const dome=new T.IcosahedronGeometry(1,2);
  const iceM=new T.MeshStandardMaterial({color:lin(0xcff4ff),transparent:true,opacity:.8,metalness:.1,roughness:.1,emissive:lin(0x3a90e0),emissiveIntensity:.6,flatShading:true});
  SK13={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    DISK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.renderOrder=2;scene.add(m);return m}),
    DARK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.9,depthWrite:false}));m.renderOrder=3;scene.add(m);return m}),
    WALL:Pool(()=>{const m=new T.Mesh(wallG,new T.MeshBasicMaterial({map:SK.wall,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(SHG,AD(0xffffff,1));scene.add(m);return m}),
    ROCK:Pool(()=>{const m=new T.Mesh(rockGeo(.5),new T.MeshStandardMaterial({color:lin(0x4a3020),roughness:.9,emissive:lin(0xff5a10),emissiveIntensity:.45,flatShading:true}));m.castShadow=true;scene.add(m);return m}),
    SPK:Pool(()=>{const m=new T.Mesh(spike,iceM.clone());m.castShadow=true;scene.add(m);return m}),
    CLOUD:Pool(()=>{const m=new T.Mesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:lin(0x3a4a78),transparent:true,opacity:.75,roughness:1,metalness:0,flatShading:true,emissive:lin(0x18284a),emissiveIntensity:.6,depthWrite:false}));scene.add(m);return m}),
    DOME:Pool(()=>{const m=new T.Mesh(dome,new T.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.4,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m})};
  return SK13}
function beam13(a,b,c,w,o){const g=SK13.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap13(a,b,c,o,sd,amp,w){amp=amp||.4;const n=9,d=b.clone().sub(a),L=d.length()||.01;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,ox=i<n?Math.sin(t3*60+i*4+sd)*amp:0,oz=i<n?Math.cos(t3*53+i*7+sd)*amp:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(ox,0,oz));beam13(p0,p1,c,w||.08,o);p0=p1}}
function dot13(x,y,z,s,c,o){const d=SK13.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor13(x,y,z,r,c,o){const t=SK13.TOR.get();t.position.set(x,y,z);t.scale.setScalar(Math.max(.01,r));t.rotation.set(0,0,0);t.material.color.copy(col(c));t.material.opacity=o;return t}
/* thiên thạch rơi thẳng từ trời xuống (x,z), tiến độ p 0..1 */
function fallRock13(x,z,p,sz,c1,c2){const h=18*(1-p*p),ox=3*(1-p),oz=-1.5*(1-p),r=SK13.ROCK.get();r.position.set(x+ox,HOV*.5+h,z+oz);r.scale.setScalar(sz);r.rotation.set(t3*3+x,t3*2,0);
  dot13(x+ox,HOV*.5+h,z+oz,sz*4,c1,.9);dot13(x+ox,HOV*.5+h,z+oz,sz*2,c2||'#fff0c0',.8);beam13(new T.Vector3(x+ox,HOV*.5+h,z+oz),new T.Vector3(x+ox+sz*2.6,HOV*.5+h+sz*8,z+oz-sz*1.3),c1,sz*.6,.7);if(Math.random()<.35)smoke(x+ox,HOV*.5+h,z+oz,.5,.3)}
function zone13(z,dt){const S=SK13,a=Math.max(0,Math.min(1,z.t*2,(z.max-z.t)*4+.3)),R=z.R,c1=(z.sty&&z.sty.c1)||z.col||'#7fd0ff',c2=(z.sty&&z.sty.c2)||'#ffffff',m=(z.sty&&z.sty.m)||'star',x=z.x,y=z.y,sd=(z.sty&&z.sty.sd)||1,Y=HOV;
  /* nền chung: sàn sáng + vành + tường sáng mờ dựng đứng + hạt bay lên */
  const d=S.DISK.get();d.position.set(x,.05,y);d.scale.setScalar(R);d.material.color.copy(col(c1));d.material.opacity=.16*a;
  tor13(x,.1,y,R*.97,c1,.6*a);const w=S.WALL.get();w.position.set(x,0,y);w.scale.set(R,1.6+.2*Math.sin(t3*2),R);w.material.color.copy(col(c1));w.material.opacity=.5*a;
  for(let i=0;i<10;i++){const u=fr13(t3*.45+i*.137),an=i*2.39+t3*(.4+(i%3)*.2),rr=R*.9*Math.sqrt(rn13(i,sd));dot13(x+Math.cos(an)*rr,.2+u*3.5,y+Math.sin(an)*rr,.35,i%2?c1:c2,a*(1-u))}
  if(m==='sun'){const sy=Y+2.6+.15*Math.sin(t3*2),b=S.BALL.get();b.position.set(x,sy,y);b.scale.setScalar(R*.15+.4);b.material.color.copy(col(c1));b.material.opacity=.85*a;dot13(x,sy,y,R*1.2,c1,.55*a);dot13(x,sy,y,R*.4,'#ffffff',.6*a);
    const n=10;for(let i=0;i<n;i++){const an=i/n*TAU+t3*.5,L=R*(.6+.3*Math.sin(t3*3+i));beam13(new T.Vector3(x,sy,y),new T.Vector3(x+Math.cos(an)*L,.3,y+Math.sin(an)*L),c1,.12,.55*a)}}
  else if(m==='meteor'){for(let i=0;i<6;i++){const ph=fr13(t3*.9+rn13(i,sd)),cyc=Math.floor(t3*.9+rn13(i,sd)),px=x+(rn13(i,cyc)-.5)*R*1.5,pz=y+(rn13(i+9,cyc)-.5)*R*1.5;if(ph<.75)fallRock13(px,pz,ph/.75,.55,c1,c2);else{const u=(ph-.75)/.25;tor13(px,.15,pz,.4+2*u,c1,(1-u)*a);dot13(px,.4,pz,3*(1-u),c2,(1-u)*a)}}}
  else if(m==='hole'){const k=S.DARK.get();k.position.set(x,.08,y);k.scale.setScalar(R*.32);k.material.opacity=.92*a;const b=S.BALL.get();b.position.set(x,Y*.7,y);b.scale.setScalar(R*.16);b.material.color.set(0x1a0638);b.material.opacity=.9*a;
    for(let j=0;j<3;j++)for(let i=1;i<=12;i++){const u=i/12,an=-t3*3+j*2.09+u*6,r=R*(.25+.75*u);dot13(x+Math.cos(an)*r,.2+u*.3,y+Math.sin(an)*r,.5*(1-u*.4),j%2?c2:c1,.7*a)}tor13(x,Y*.7,y,R*.35,c1,.8*a).rotation.set(1.1,t3,0)}
  else if(m==='bolt'){for(let i=0;i<8;i++){const an=i*.785+t3*.3,rr=R*(.25+.4*rn13(i,sd)),b=S.CLOUD.get();b.position.set(x+Math.cos(an)*rr,6+.3*Math.sin(t3+i),y+Math.sin(an)*rr);b.scale.set(R*.26,R*.13,R*.26);b.rotation.set(0,t3*.2+i,0);b.material.opacity=.7*a}dot13(x,6,y,R*1.4,c1,.3*a);
    for(let i=0;i<3;i++){const cyc=Math.floor(t3*5+i*.33),px=x+(rn13(i,cyc)-.5)*R*1.6,pz=y+(rn13(i+5,cyc)-.5)*R*1.6;if(rn13(i+2,cyc)<.7){zap13(new T.Vector3(px+.3,6,pz),new T.Vector3(px,.2,pz),c2,.95*a,cyc+i,.45,.09);dot13(px,.3,pz,1.6,c1,.8*a)}}}
  else if(m==='beam'||m==='holy'){for(let i=0;i<4;i++){const ph=fr13(t3*.8+i*.25),cyc=Math.floor(t3*.8+i*.25),px=x+(rn13(i,cyc)-.5)*R*1.4,pz=y+(rn13(i+7,cyc)-.5)*R*1.4,f=Math.sin(ph*Math.PI);beam13(new T.Vector3(px,9,pz),new T.Vector3(px,0,pz),i%2?c2:c1,.25+.35*f,.85*f*a);dot13(px,.3,pz,1.8*f+.2,c1,.8*f*a)}
    if(m==='holy'){beam13(new T.Vector3(x,10,y),new T.Vector3(x,0,y),c2,R*.25,.35*a);for(let i=0;i<8;i++){const u=fr13(t3*.4+i/8),an=i*.8;dot13(x+Math.cos(an)*R*.5,8*(1-u),y+Math.sin(an)*R*.5,.4,c2,a*u)}}}
  else if(m==='ice'){for(let i=0;i<9;i++){const an=i*2.39+sd,rr=R*.8*Math.sqrt(rn13(i,sd)),g=Math.min(1,(z.max-z.t)*2.5-i*.08),sp=S.SPK.get();if(g<=0){sp.visible=false;continue}sp.position.set(x+Math.cos(an)*rr,0,y+Math.sin(an)*rr);sp.scale.set(1+rn13(i,3),(1.2+rn13(i,4)*1.6)*g,1+rn13(i,3));sp.rotation.set((rn13(i,5)-.5)*.5,0,(rn13(i,6)-.5)*.5);sp.material.opacity=.8*a}}
  else if(m==='fire'){for(let i=0;i<4;i++){const an=Math.random()*TAU,rr=R*.85*Math.sqrt(Math.random());spark(x+Math.cos(an)*rr,.2,y+Math.sin(an)*rr,rand(-.3,.3),rand(2,4),rand(-.3,.3),Math.random()<.5?c1:'#ffd060',.7,.35)}
    for(let i=0;i<6;i++){const u=fr13(t3*1.2+i/6),an=i*1.05+t3;dot13(x+Math.cos(an)*R*.3*(1-u),.3+u*4,y+Math.sin(an)*R*.3*(1-u),1.4*(1-u)+.3,i%2?c1:'#ffb040',.7*(1-u)*a)}}
  else if(m==='nano'){for(let j=0;j<2;j++)for(let i=0;i<14;i++){const u=i/14,an=t3*2+j*Math.PI+u*TAU*2,r=R*.55;dot13(x+Math.cos(an)*r,.3+u*3,y+Math.sin(an)*r,.35,j?c2:c1,.8*a)}}
  else if(m==='grav'){for(let i=0;i<3;i++){const u=fr13(t3*.7+i/3),r=R*(1-u*.9);tor13(x,.2+u*.6,y,r,c1,(u)*.9*a)}const b=S.BALL.get();b.position.set(x,Y*.6,y);b.scale.setScalar(.4+.1*Math.sin(t3*8));b.material.color.copy(col(c2));b.material.opacity=.8*a}
  else if(m==='time'){const h1=t3*.6,h2=t3*.07;for(let i=0;i<12;i++){const an=i/12*TAU;beam13(new T.Vector3(x+Math.cos(an)*R*.86,.15,y+Math.sin(an)*R*.86),new T.Vector3(x+Math.cos(an)*R*.96,.15,y+Math.sin(an)*R*.96),c2,.06,.8*a)}
    beam13(new T.Vector3(x,.2,y),new T.Vector3(x+Math.cos(h1)*R*.75,.2,y+Math.sin(h1)*R*.75),c2,.08,.9*a);beam13(new T.Vector3(x,.2,y),new T.Vector3(x+Math.cos(h2)*R*.5,.2,y+Math.sin(h2)*R*.5),c2,.12,.9*a);tor13(x,2.2,y,R*.5,c1,.6*a).rotation.set(t3*.7,0,t3*.4)}
  else if(m==='sonic'){for(let i=0;i<3;i++){const u=fr13(t3*.8+i/3),w2=S.WALL.get();w2.position.set(x,0,y);w2.scale.set(R*(.2+.8*u),.6+1.2*(1-u),R*(.2+.8*u));w2.material.color.copy(col(i%2?c2:c1));w2.material.opacity=.7*(1-u)*a}}
  else if(m==='prism'){const dm=S.DOME.get();dm.position.set(x,0,y);dm.scale.set(R*.95,R*.6,R*.95);dm.rotation.y=t3*.2;dm.material.color.copy(col(c1));dm.material.opacity=.35*a}
  else if(m==='web'){for(let i=0;i<8;i++){const an=i/8*TAU+t3*.1;beam13(new T.Vector3(x,.25,y),new T.Vector3(x+Math.cos(an)*R*.95,.25,y+Math.sin(an)*R*.95),c1,.04,.7*a)}[.35,.6,.85].forEach(f=>tor13(x,.25,y,R*f,c2,.5*a))}
  else if(m==='portal'){const t=tor13(x,1.6,y,Math.min(R*.5,1.8),c1,.9*a);t.rotation.set(Math.PI/2,0,t3*2);for(let i=0;i<10;i++){const an=-t3*4+i*.63,r=Math.min(R*.5,1.8)*(.3+.07*i);dot13(x+Math.cos(an)*r,1.6+Math.sin(an)*r,y,.35,c2,.7*a)}}
  else if(m==='shards'){for(let i=0;i<8;i++){const u=fr13(t3*.7+i/8),an=i/8*TAU+sd,r=R*.9*u,sp=S.SPK.get();sp.position.set(x+Math.cos(an)*r,.3+Math.sin(u*Math.PI)*2,y+Math.sin(an)*r);sp.scale.set(.6,.9,.6);sp.rotation.set(t3*3+i,t3*2,0);sp.material.opacity=.85*(1-u)*a}}
  else{for(let i=0;i<5;i++){const an=i/5*TAU+t3*.5;beam13(new T.Vector3(x,1.2,y),new T.Vector3(x+Math.cos(an)*R*.8,.3,y+Math.sin(an)*R*.8),c1,.1,.6*a);dot13(x+Math.cos(an)*R*.8,.4,y+Math.sin(an)*R*.8,1,c2,.7*a)}dot13(x,1.2,y,1.8,c1,.8*a)}}
function skill3d13(G,dt){const C=G.csk;if(!C)return;sk13Init();const S=SK13,Y=HOV;
  (C.zones||[]).forEach(z=>zone13(z,dt));
  (C.fx||[]).forEach(f=>{if(f.mot)zone13({x:f.x,y:f.y,R:f.R||3,t:f.t,max:f.max,sty:{m:f.mot,c1:f.c1,c2:f.c2,sd:f.sd}},dt)});
  const X=C.vf&&C.vf.x2;if(X&&X.c5)X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
    /* mưa thiên thạch nhỏ: khối đá lửa rơi thật từ trên trời, vòng cảnh báo dưới đất */
    if(k==='met'){const p=Math.min(1,o.age/o.max);fallRock13(o.x,o.y,p,.45,'#ff9a40','#ffcc66');tor13(o.x,.1,o.y,1.3*p+.05,'#ff6a2a',.5)}
    /* quả cầu năng lượng rơi từ trời (Thả Cầu Phát Nổ, Búa Thần…) */
    else if(k==='fall'){const p=Math.min(1,o.age/o.max),h=18*(1-p*p),c=o.col||'#4ab8ff',r=o.r||1,ox=2*(1-p),b=S.BALL.get();b.position.set(o.x+ox,Y*.5+h,o.y);b.scale.setScalar(.25+r*.18);b.material.color.copy(col(c));b.material.opacity=.95;
      dot13(o.x+ox,Y*.5+h,o.y,1.2+r*.6,c,.9);beam13(new T.Vector3(o.x+ox,Y*.5+h,o.y),new T.Vector3(o.x+ox+1.4,Y*.5+h+5,o.y),c,.18+r*.06,.7);tor13(o.x,.1,o.y,r*p+.05,c,.4*p+.1)}
    /* bão mây sét: đám mây lơ lửng trên cao, sét giáng thẳng xuống */
    else if(k==='storm'){const R=o.R,f=Math.max(0,Math.min(1,o.age/.3,(o.max-o.age)/.4));for(let i=0;i<7;i++){const an=i*.9+t3*.6,rr=R*(.2+.5*rn13(i,2)),b=S.CLOUD.get();b.position.set(o.x+Math.cos(an)*rr,5.5+.3*Math.sin(t3+i),o.y+Math.sin(an)*rr);b.scale.set(R*.32,R*.15,R*.32);b.rotation.set(0,t3*.2+i,0);b.material.opacity=.7*f}
      dot13(o.x,5.5,o.y,R*2.2,'#6ad0ff',.25*f);tor13(o.x,.1,o.y,R,'#6ad0ff',.45*f);
      (o.bolts||[]).forEach((b,i)=>{const fa=Math.min(1,b.t*5)*f;zap13(new T.Vector3(b.x+.3,5.5,b.y),new T.Vector3(b.x,.2,b.y),'#e8f8ff',fa,i*7+(b.seed||0),.4,.08);dot13(b.x,.3,b.y,1.6,'#6ad0ff',.8*fa)})}
    /* cột sáng giáng xuống từ trời */
    else if(k==='pillar'){const f=Math.max(0,1-o.age/o.max),w=.35+.3*f;beam13(new T.Vector3(o.x,14,o.y),new T.Vector3(o.x,0,o.y),'#9fe0ff',w,.9*f);beam13(new T.Vector3(o.x,14,o.y),new T.Vector3(o.x,0,o.y),'#ffffff',w*.35,f);dot13(o.x,.3,o.y,3,'#6ad0ff',.7*f)}
    /* bom tím hút: quả cầu tím + vòng gai co vào */
    else if(k==='bomb'){const p=o.age/o.max,b=S.BALL.get();b.position.set(o.x,Y,o.y);b.scale.setScalar(.35+.1*Math.sin(t3*10));b.material.color.set(0xb060ff);b.material.opacity=.85;dot13(o.x,Y,o.y,2,'#e090ff',.7);tor13(o.x,Y*.6,o.y,4,'#c060ff',.6);
      for(let i=0;i<8;i++){const an=i/8*TAU+t3,r=4-3*p;beam13(new T.Vector3(o.x+Math.cos(an)*r,Y*.6,o.y+Math.sin(an)*r),new T.Vector3(o.x+Math.cos(an)*r*.6,Y*.6,o.y+Math.sin(an)*r*.6),'#d070ff',.05,.6)}}});
  S.B.end();S.DOT.end();S.TOR.end();S.DISK.end();S.DARK.end();S.WALL.end();S.BALL.end();S.ROCK.end();S.SPK.end();S.DOME.end();S.CLOUD.end()}
/* ===================== KỸ NĂNG 3D (đợt 14) =====================
   Ném Tủ Lạnh · Hạch Đỏ Nổ · Mặt Trời Nhân Tạo · Vùng Cấm Tím (mê cung không gian) · Pháo Đài (trụ phòng thủ) · Tiếng Gầm Không Gian · vệ tinh pháo nhỏ · drone hộ vệ */
Object.assign(R3.c5k,{fridge:1,nuke:1,ring2:1,fort:1,guard:1,sat:1});
let SK14=null;
function sk14Init(){if(SK14)return SK14;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.02,8,72);torus.rotateX(Math.PI/2);
  const disk=new T.CircleGeometry(1,48);disk.rotateX(-Math.PI/2);
  const white=new T.MeshStandardMaterial({color:lin(0xe9eff3),metalness:.25,roughness:.35}),grey=new T.MeshStandardMaterial({color:lin(0x6b7a86),metalness:.6,roughness:.3});
  const steel=new T.MeshStandardMaterial({color:lin(0x5a6a8a),metalness:.75,roughness:.35}),dark=new T.MeshStandardMaterial({color:lin(0x2a3550),metalness:.7,roughness:.4}),cyan=new T.MeshStandardMaterial({color:lin(0x66ddff),emissive:lin(0x66ddff),emissiveIntensity:1.5});
  /* mặt mê cung: vẽ các vòng bát giác có lối mở */
  const mc=document.createElement('canvas');mc.width=mc.height=256;{const x=mc.getContext('2d');x.fillStyle='#2a0a52';x.fillRect(0,0,256,256);x.translate(128,128);for(let i=1;i<=6;i++){const r=118*i/6,gap=i*3%8;x.strokeStyle=i%2?'#e2a8ff':'#b06bff';x.lineWidth=7;x.shadowColor='#c27bff';x.shadowBlur=10;x.beginPath();for(let j=0;j<8;j++){if(j===gap)continue;const a0=j/8*TAU+Math.PI/8,a1=(j+1)/8*TAU+Math.PI/8;x.moveTo(Math.cos(a0)*r,Math.sin(a0)*r);x.lineTo(Math.cos(a1)*r,Math.sin(a1)*r)}x.stroke()}}
  const mzT=new T.CanvasTexture(mc);mzT.encoding=T.sRGBEncoding;
  SK14={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    DISK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.renderOrder=2;scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(SHG,AD(0xffffff,1));scene.add(m);return m}),
    BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s}),
    ROCK:Pool(()=>{const m=new T.Mesh(rockGeo(.5),new T.MeshStandardMaterial({color:lin(0x7a4a2a),roughness:.9,emissive:lin(0xff7020),emissiveIntensity:.4,flatShading:true}));m.castShadow=true;scene.add(m);return m}),
    /* tủ lạnh 3D: thân trắng, khe cửa, tay nắm, viền sáng */
    FRG:Pool(()=>{const g=new T.Group(),b=new T.Mesh(new T.BoxGeometry(1,1.9,.85),white.clone()),seam=new T.Mesh(new T.BoxGeometry(1.01,.06,.86),new T.MeshStandardMaterial({color:lin(0xc4d0d9)})),h1=new T.Mesh(new T.BoxGeometry(.08,.42,.1),grey),h2=new T.Mesh(new T.BoxGeometry(.08,.55,.1),grey);
      seam.position.y=.28;h1.position.set(.32,.62,.46);h2.position.set(.32,-.1,.46);b.castShadow=true;g.add(b,seam,h1,h2);g.userData={b};scene.add(g);return g}),
    /* pháo đài: bệ lục giác kim loại + 3 tháp pháo + đèn xanh */
    FORT:Pool(()=>{const g=new T.Group(),base=new T.Mesh(new T.CylinderGeometry(1.6,1.75,.7,6),steel),top=new T.Mesh(new T.CylinderGeometry(1.2,1.5,.35,6),dark),core=new T.Mesh(new T.CylinderGeometry(.35,.35,.2,16),cyan);base.position.y=.35;top.position.y=.87;core.position.y=1.1;base.castShadow=top.castShadow=true;g.add(base,top,core);
      const tw=[];for(let i=-1;i<=1;i++){const t=new T.Group(),bd=new T.Mesh(new T.BoxGeometry(.38,.5,.38),dark),br=new T.Mesh(new T.CylinderGeometry(.07,.08,.7,10),steel);br.rotation.x=Math.PI/2;br.position.set(0,.1,-.4);bd.castShadow=true;t.add(bd,br);t.position.set(i*.75,1.3,0);g.add(t);tw.push(t)}
      const l=new T.Sprite(ADDM(glowT()));l.material.color.set(0x66ddff);l.scale.setScalar(2.4);l.position.y=1.1;g.add(l);g.userData={tw,l};scene.add(g);return g}),
    SAT:Pool(()=>{const g=new T.Group(),b=new T.Mesh(new T.BoxGeometry(.5,.4,.5),new T.MeshStandardMaterial({color:lin(0x9aa8c0),metalness:.8,roughness:.3})),pm=new T.MeshStandardMaterial({color:lin(0x3a90ff),emissive:lin(0x1a4aa0),emissiveIntensity:.6,metalness:.5,roughness:.3}),p1=new T.Mesh(new T.BoxGeometry(.75,.03,.42),pm),p2=p1.clone();p1.position.x=.65;p2.position.x=-.65;g.add(b,p1,p2);scene.add(g);return g}),
    WALL:Pool(()=>{const m=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:lin(0x7a3ad0),emissive:lin(0xb86bff),emissiveIntensity:.9,metalness:.3,roughness:.4,transparent:true}));m.castShadow=true;scene.add(m);return m}),
    SLAB:Pool(()=>{const m=new T.Mesh(new T.BoxGeometry(1,1,.25),[0,1,2,3,4,5].map(i=>i===4||i===5?new T.MeshStandardMaterial({map:mzT,emissive:0xffffff,emissiveMap:mzT,emissiveIntensity:.8,transparent:true}):new T.MeshStandardMaterial({color:lin(0x46147f),emissive:lin(0x6a2aa8),emissiveIntensity:.6,transparent:true})));m.castShadow=true;scene.add(m);return m}),
    SUN:Pool(()=>{const g=new T.Group(),s=new T.Mesh(new T.SphereGeometry(1,32,20),new T.MeshStandardMaterial({color:lin(0xffa830),emissive:lin(0xff9a20),emissiveIntensity:1.1,roughness:.6})),h=new T.Mesh(new T.SphereGeometry(1.12,32,20),AD(0xff7a1a,.35)),l=new T.Sprite(ADDM(glowT()));l.material.color.set(0xff8a2a);l.scale.setScalar(3.2);g.add(s,h,l);g.userData={s,h,l};scene.add(g);return g})};
  return SK14}
function beam14(a,b,c,w,o){const g=SK14.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function dot14(x,y,z,s,c,o){const d=SK14.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor14(x,y,z,r,c,o){const t=SK14.TOR.get();t.position.set(x,y,z);t.scale.setScalar(Math.max(.01,r));t.rotation.set(0,0,0);t.material.color.copy(col(c));t.material.opacity=o;return t}
function dash14(x,z,y,R,c,o,n,rot,w){n=n||24;for(let i=0;i<n;i++){const a0=i/n*TAU+(rot||0),a1=a0+TAU/n*.55;beam14(new T.Vector3(x+Math.cos(a0)*R,y,z+Math.sin(a0)*R),new T.Vector3(x+Math.cos(a1)*R,y,z+Math.sin(a1)*R),c,w||.05,o)}}
function bar14(x,y,z,w,f,c){const bg=SK14.BAR.get();bg.position.set(x-w/2,y,z);bg.scale.set(w,.13,1);bg.material.color.set(0x101820);bg.material.opacity=.8;if(f<=0)return;const s=SK14.BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),.13,1);s.material.color.copy(col(c));s.material.opacity=1}
function skill3d14(G,dt){sk14Init();const S=SK14,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z),ok=e=>e&&!e.dead;
  const X=G.csk&&G.csk.vf&&G.csk.vf.x2;
  if(X&&X.c5)X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
    /* Ném Tủ Lạnh: tủ lạnh 3D rơi thẳng từ trời xuống, đập đất rồi lăn lộn đâm vào địch */
    if(k==='fridge'){const F=o,g=S.FRG.get(),U=g.userData;let h=0,fo=1;if(F.ph===0){h=Math.max(0,1-F.age/.75)*21;const p=.5+.4*Math.sin(t3*16);tor14(F.x,.1,F.y,1.6,'#ffd24a',p);const d=S.DISK.get();d.position.set(F.x,.06,F.y);d.scale.setScalar(1.6);d.material.color.set(0xffd24a);d.material.opacity=.18;
        beam14(V3a(F.x,F.y,h+2),V3a(F.x,F.y,h+5.5),'#ffe68c',.12,.5)}else if(F.ph===2)fo=Math.max(0,1-(F.t2||0)/.4);
      g.position.set(F.x,.95+h,F.y);if(F.ph===1){const dir=Math.atan2(F.dx||0,F.dy||1);g.rotation.set(0,0,0);g.rotateY(dir);g.rotateX(F.rot||0)}else g.rotation.set(.15*Math.sin(t3*3),F.rot||0,(F.rot||0)*.5);
      U.b.material.transparent=fo<1;U.b.material.opacity=fo;g.visible=fo>.02;if(F.ph===1){dot14(F.x,.4,F.y,2.6,'#ffd24a',.3);if(Math.random()<.4)smoke(F.x,.3,F.y,.5,.3)}}
    else if(k==='ring2'){const f=Math.max(0,Math.min(1,(o.max-o.age)/.6));dash14(o.x,o.y,.2,o.R,'#ffd24a',.8*f,32,t3*.5,.07)}
    /* Hạch Đỏ Nổ: lõi hạch đỏ rực lơ lửng hút địch bằng xích đỏ, rồi nổ thành sóng xung kích + mưa mảnh lửa rơi từ trời */
    else if(k==='nuke'){const cx=o.cx,cy=o.cy;if(o.age<3){const R=1.3+.5*Math.sin(t3*8)+o.age*.5,b=S.BALL.get();b.position.set(cx,Y+.6,cy);b.scale.setScalar(R*.5);b.material.color.set(0xff5030);b.material.opacity=.95*a;dot14(cx,Y+.6,cy,R*3,'#ff3a20',.6*a);dot14(cx,Y+.6,cy,R*1.1,'#fff0c8',.8*a);
        for(let i=0;i<3;i++)tor14(cx,Y+.6,cy,R*.75,'#ff6a40',.6*a).rotation.set(t3*2+i,i*1.1,t3);
        (o.pick||[]).forEach(e=>{if(!ok(e))return;const A=V3a(cx,cy,Y+.6),B=V3a(e.x,e.y),d=B.clone().sub(A),n=Math.max(2,Math.floor(d.length()/.5));for(let i=0;i<n;i+=2)beam14(A.clone().addScaledVector(d,i/n),A.clone().addScaledVector(d,Math.min(1,(i+1)/n)),'#ff5a40',.05,.8*a);dot14(e.x,Y,e.y,(e.size||2)*1.4,'#ff4a30',.4*a)})}
      else{const bt=o.age-3,fr=Math.min(1,bt/.5);if(fr<1){tor14(cx,.3,cy,9*fr+.1,'#ff8a50',(1-fr)*.9);const d=S.DISK.get();d.position.set(cx,.08,cy);d.scale.setScalar(9*fr+.1);d.material.color.set(0xff3a1a);d.material.opacity=.25*(1-fr);const b=S.BALL.get();b.position.set(cx,Y*.5,cy);b.scale.set(3*(1-fr)+.2,2.4*(1-fr)+.2,3*(1-fr)+.2);b.material.color.set(0xffa060);b.material.opacity=.8*(1-fr)}
        let nf=0;(o.sh||[]).forEach(z=>{const d=o.age-z.t;if(d<-.35||d>.3||nf>70)return;nf++;if(d<0){const u=1+d/.35,h=9*(1-u),hx=z.x+2*(1-u);dot14(hx,Y*.4+h,z.y,.7,'#ff6a30',.9);beam14(V3a(hx,z.y,Y*.4+h),V3a(hx+.6,z.y,Y*.4+h+1.4),'#ff9a50',.08,.8)}else dot14(z.x,.3,z.y,1.4*(1-d/.3)+.2,'#ff7a40',(1-d/.3))})}}
    /* Pháo Đài: pháo đài lục giác 3D có 3 tháp pháo xoay về địch */
    else if(k==='fort'){const g=S.FORT.get(),U=g.userData,B=o.big?2.4:1;g.position.set(o.x,0,o.y);g.scale.setScalar(B*Math.min(1,o.age/.3+.05));const e=(G.en||[]).filter(ok).sort((p,q)=>Math.hypot(p.x-o.x,p.y-o.y)-Math.hypot(q.x-o.x,q.y-o.y))[0];
      const yaw=e?Math.atan2(-(e.x-o.x),-(e.y-o.y)):t3*.5;U.tw.forEach(t=>t.rotation.y=yaw);U.l.material.opacity=.4+.2*Math.sin(t3*4)}
    /* drone hộ vệ xanh lá quay quanh tàu */
    else if(k==='guard'){const P=o.P;if(!ok(P))return;for(let i=0;i<(o.n||2);i++){const aa=t3*2.4+i*Math.PI;const x=P.x+Math.cos(aa)*1.9,z=P.y+Math.sin(aa)*1.9*.8;const b=S.BALL.get();b.position.set(x,Y,z);b.scale.setScalar(.28);b.material.color.set(0xd8fff0);b.material.opacity=a;dot14(x,Y,z,1.4,'#66ffaa',.7*a)}tor14(P.x,Y,P.y,1.9,'#66ffaa',.35*a)}
    /* vệ tinh pháo nhỏ */
    else if(k==='sat'){const g=S.SAT.get();g.position.set(o.x,Y+1,o.y);g.rotation.set(0,t3*.8,0);dot14(o.x,Y+1,o.y,1.6,'#ffb040',.4*a)}});
  /* Mặt Trời Nhân Tạo (c27): quả cầu mặt trời thật lơ lửng, vành nhật hoa, thiên thạch quay quanh có đuôi lửa, thanh máu + vòng thời gian */
  const Z=G.c27;if(Z){(Z.sun||[]).forEach(sn=>{const gk=Math.min(1,sn.age/1.2),r=2.5*gk,al=sn.dead?Math.max(0,1-(G.t-sn.end)/.6):1;if(al<=0)return;const g=S.SUN.get(),U=g.userData,y=Y+r*.6+.2;g.position.set(sn.x,y,sn.y);g.scale.setScalar(Math.max(.05,r));U.h.material.opacity=.45*al*(.8+.2*Math.sin(t3*5));U.l.material.opacity=.8*al;U.s.material.opacity=al;U.s.material.transparent=al<1;g.rotation.y=t3*.3;
      dash14(sn.x,sn.y,.15,6,'#ffb04a',.3*al,30,t3*.2,.05);for(let i=0;i<12;i++){const an=i/12*TAU+t3*.6,f=1+.18*Math.sin(t3*7+i);beam14(V3a(sn.x+Math.cos(an)*r*1.02,sn.y+Math.sin(an)*r*1.02,y),V3a(sn.x+Math.cos(an)*r*1.3*f,sn.y+Math.sin(an)*r*1.3*f,y),'#ffe6a0',.06,.7*al)}
      (sn.slots||[]).forEach(m=>{if(!m)return;const rk=S.ROCK.get();rk.position.set(m.x,y,m.y);rk.scale.setScalar(.75);rk.rotation.set(t3*2+(m.seed||0),t3,0);const tx=-Math.sin(m.a),tz=Math.cos(m.a);beam14(V3a(m.x,m.y,y),V3a(m.x-tx*1.4,m.y-tz*1.4,y),'#ff9a3c',.18,.75*al);dot14(m.x,y,m.y,1,'#ffb060',.6*al)});
      if(!sn.dead){bar14(sn.x,y+r+.9,sn.y,Math.max(2.4,4.5),sn.hp/sn.max,'#ffcf4a');const rem=Math.max(0,sn.t/30),n=Math.max(1,Math.round(36*rem));for(let i=0;i<n;i++){const an=-Math.PI/2+i/36*TAU;dot14(sn.x+Math.cos(an)*(r+.5),.2,sn.y+Math.sin(an)*(r+.5),.3,'#ffe6a0',.7*al)}}});
    /* Vùng Cấm Tím (mê cung không gian): tấm mê cung dựng đứng mọc lên, đổ ập xuống, rồi thành tường mê cung 3D thấp trên sàn */
    (Z.mz||[]).forEach(m=>{const R=6;if(m.st==='zone'||m.st==='end'){const al=m.st==='end'?Math.max(0,1-(m.fade||0)/.5):1,pul=.65+.35*Math.sin(G.t*6);const d=S.DISK.get();d.position.set(m.x,.05,m.y);d.scale.setScalar(R);d.material.color.set(0xb56bff);d.material.opacity=.15*al;
        for(let i=1;i<=6;i++){const r=R*i/6,gap=Math.floor((Math.sin(m.seed+i*7.1)*.5+.5)*8);for(let j=0;j<8;j++){if(j===gap)continue;const a0=j/8*TAU+Math.PI/8,a1=(j+1)/8*TAU+Math.PI/8,x0=m.x+Math.cos(a0)*r,z0=m.y+Math.sin(a0)*r,x1=m.x+Math.cos(a1)*r,z1=m.y+Math.sin(a1)*r,w=S.WALL.get(),L=Math.hypot(x1-x0,z1-z0);
          w.position.set((x0+x1)/2,.3,(z0+z1)/2);w.scale.set(L+.05,.6*Math.min(1,(m.zt||0)*3+.3),.14);w.rotation.set(0,-Math.atan2(z1-z0,x1-x0),0);w.material.opacity=al;w.material.emissiveIntensity=.3+.35*pul*(i%2)}}
        const rem=Math.max(0,1-(m.zt||0)/8),n=Math.max(1,Math.round(40*rem));for(let i=0;i<n;i++){const an=-Math.PI/2+i/40*TAU;dot14(m.x+Math.cos(an)*(R+.3),.25,m.y+Math.sin(an)*(R+.3),.3,'#e9c8ff',.8*al)}}
      else{const w=R*1.2,h=w*.82,kk=m.st==='slam'?Math.min(1,(m.sl||0)/.22):0,rise=m.st==='rise'?Math.min(1,m.age/.5):1,sl=S.SLAB.get();dash14(m.x,m.y,.12,R,'#c27bff',.35*rise,30,t3*.3,.05);
        sl.scale.set(w,h*rise,1);const tilt=-kk*Math.PI/2;sl.rotation.set(tilt,0,0);sl.position.set(m.x,Math.cos(-tilt)*h*rise/2+.05,m.y+Math.sin(-tilt)*h*rise/2);sl.material.forEach(q=>q.opacity=1);
        if(kk>0){tor14(m.x,.15,m.y,R*kk,'#f3dcff',kk)}else dot14(m.x,h*rise*.5,m.y,w*1.3,'#b86bff',.25)}})}
  /* Tiếng Gầm Không Gian (c28): sóng âm hình cung dựng đứng lao về phía trước */
  const Z8=G.c28;if(Z8&&Z8.o)Z8.o.forEach(o=>{if(o.k!=='roar')return;const n=6,gap=.18,len=10,v=16,half=.55;for(let i=0;i<n;i++){const O=o.org&&o.org[i];if(!O)continue;const r=(o.t-i*gap)*v;if(r<0||r>len+.5)continue;const al=Math.max(0,1-r/(len+.5))*.95;
      const segs=10;for(let j=0;j<segs;j++){const a0=o.a-half+2*half*j/segs,a1=o.a-half+2*half*(j+1)/segs,p0=V3a(O.x+Math.cos(a0)*r,O.y+Math.sin(a0)*r,.9),p1=V3a(O.x+Math.cos(a1)*r,O.y+Math.sin(a1)*r,.9);beam14(p0,p1,'#46a0ff',.45,.55*al);beam14(p0.clone().setY(1.6),p1.clone().setY(1.6),'#dff0ff',.08,.8*al);beam14(p0.clone().setY(.25),p1.clone().setY(.25),'#dff0ff',.08,.8*al)}}});
  S.B.end();S.DOT.end();S.TOR.end();S.DISK.end();S.BALL.end();S.BAR.end();S.ROCK.end();S.FRG.end();S.FORT.end();S.SAT.end();S.WALL.end();S.SLAB.end();S.SUN.end()}
/* ===================== KỸ NĂNG 3D (đợt 15) =====================
   Cầu Lửa Mặt Trời · Hố Đen Hủy Diệt · Giáp Hấp Thụ · Hạm Đội Mũi Giáo · Mũi Tên Sấm Sét · Laser Bề Mặt · Tấm Khiên Nano · Tốc Độ Tím · Vệt Sao Tím
   · Bão Bụi Sao (vùng bụi) + vùng lửa / vùng chậm / vùng chung · đạn kỹ năng chung · Cá Không Gian · Vòng Xoáy Tử Thần có phễu xoáy 3D */
Object.assign(R3.c5k,{sun:1,bhole2:1,absb:1,pbeam:1,tarrow:1,lanes:1,dome:1,zone:1,fire:1,dust:1,slow:1,proj:1});
let SK15=null;
function sk15Init(){if(SK15)return SK15;const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.02,8,72);torus.rotateX(Math.PI/2);
  const disk=new T.CircleGeometry(1,48);disk.rotateX(-Math.PI/2);const hemi=new T.SphereGeometry(1,40,16,0,TAU,0,Math.PI/2),hex=new T.IcosahedronGeometry(1,2);
  const wallG=new T.CylinderGeometry(1,1,1,48,1,true);wallG.translate(0,.5,0);const funnel=new T.CylinderGeometry(1,.15,1,32,1,true);funnel.translate(0,.5,0);
  /* cá không gian: thân thoi + đuôi + vây, bằng khối 3D */
  const fishB=new T.SphereGeometry(.5,16,10);fishB.scale(1.9,.7,.85);const tail=new T.ConeGeometry(.45,.8,4);tail.rotateZ(Math.PI/2);tail.translate(-1.25,0,0);const fin=new T.ConeGeometry(.22,.6,3);
  const fishM=new T.MeshStandardMaterial({color:lin(0x7ab8ff),emissive:lin(0x3a6aff),emissiveIntensity:.7,metalness:.4,roughness:.25,transparent:true,opacity:.85});
  const arc=(r,a)=>{const g=new T.TorusGeometry(r,.09,6,24,a);g.rotateX(Math.PI/2);g.rotateY(a/2);return g};
  SK15={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    DISK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.renderOrder=2;scene.add(m);return m}),
    DARK:Pool(()=>{const m=new T.Mesh(SHG,new T.MeshBasicMaterial({color:0x05000c,transparent:true,opacity:.95}));scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(SHG,AD(0xffffff,1));scene.add(m);return m}),
    SUNB:Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,28,18),new T.MeshStandardMaterial({color:lin(0xffa830),emissive:lin(0xff8a20),emissiveIntensity:1.2,roughness:.6}));scene.add(m);return m}),
    HEMI:Pool(()=>{const m=new T.Mesh(hemi,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.15,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));scene.add(m);return m}),
    HEXW:Pool(()=>{const m=new T.Mesh(hex,new T.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.3,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m}),
    WALL:Pool(()=>{const m=new T.Mesh(wallG,new T.MeshBasicMaterial({map:SK.wall,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m}),
    FUN:Pool(()=>{const m=new T.Mesh(funnel,new T.MeshBasicMaterial({map:SK.wall,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m}),
    ARC:Pool(()=>{const g=new T.Group(),cs=[[1.25,'#7a2aff',.5],[1,'#b45cff',.8],[.78,'#e6ccff',.9]].map(([r,c,o])=>{const m=new T.Mesh(arc(1.5*r,1.9),AD(c,o));m.position.x=-.5;g.add(m);return m});g.userData={cs};scene.add(g);return g}),
    FISH:Pool(()=>{const g=new T.Group(),b=new T.Mesh(fishB,fishM),t=new T.Mesh(tail,fishM),f1=new T.Mesh(fin,fishM),f2=new T.Mesh(fin,fishM),eye=new T.Mesh(new T.SphereGeometry(.07,8,6),new T.MeshBasicMaterial({color:0xffffff}));f1.position.set(.1,0,.5);f1.rotation.set(Math.PI/2,0,-.6);f2.position.set(.1,0,-.5);f2.rotation.set(-Math.PI/2,0,-.6);eye.position.set(.75,.12,.25);g.add(b,t,f1,f2,eye);g.userData={t};scene.add(g);return g})};
  return SK15}
function beam15(a,b,c,w,o){const g=SK15.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap15(a,b,c,o,sd,amp,w){amp=amp||.3;const n=10,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(t3*50+i*2+sd)*amp:0,up=i<n?Math.cos(t3*45+i*3+sd)*amp:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam15(p0,p1,c,w||.05,o);p0=p1}}
function dot15(x,y,z,s,c,o){const d=SK15.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor15(x,y,z,r,c,o){const t=SK15.TOR.get();t.position.set(x,y,z);t.scale.setScalar(Math.max(.01,r));t.rotation.set(0,0,0);t.material.color.copy(col(c));t.material.opacity=o;return t}
function disk15(x,y,z,r,c,o){const d=SK15.DISK.get();d.position.set(x,y,z);d.scale.setScalar(Math.max(.01,r));d.material.color.copy(col(c));d.material.opacity=o;return d}
function dash15(x,z,y,R,c,o,n,rot,w){n=n||24;for(let i=0;i<n;i++){const a0=i/n*TAU+(rot||0),a1=a0+TAU/n*.55;beam15(new T.Vector3(x+Math.cos(a0)*R,y,z+Math.sin(a0)*R),new T.Vector3(x+Math.cos(a1)*R,y,z+Math.sin(a1)*R),c,w||.05,o)}}
function skill3d15(G,dt){const C=G.csk,X=C&&C.vf&&C.vf.x2;sk15Init();const S=SK15,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z),ok=e=>e&&!e.dead;
  if(X&&X.c5)X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
    /* Cầu Lửa Mặt Trời: quả cầu lửa mặt trời rơi từ trời, đập xuống rồi lăn đi thiêu đốt */
    if(k==='sun'){const R=o.Rs||3.5;let y,sc=1,fo=1;if(o.ph===0){const f=o.fall||0;y=Y*.6+21*(1-f)*(1-f)+R*.35;sc=.5+.5*f;disk15(o.x,.06,o.y,R*f,'#ff6a20',.25*f);dash15(o.x,o.y,.12,R,'#ff9a30',.5,28,t3,.06)}else{fo=o.ph===2?Math.max(0,1-(o.t2||0)/.6):1;y=R*.35+.1;if(Math.random()<.6)spark(o.x+rand(-1,1)*R*.4,.3,o.y+rand(-1,1)*R*.4,rand(-.5,.5),rand(1,3),rand(-.5,.5),'#ffb040',.6,.3)}
      const b=S.SUNB.get();b.position.set(o.x+(o.ph===0?2*(1-(o.fall||0)):0),y,o.y);b.scale.setScalar(R*.4*sc);b.rotation.set(t3,t3*.7,0);b.material.transparent=fo<1;b.material.opacity=fo;
      dot15(b.position.x,y,o.y,R*1.6*sc,'#ff7a20',.6*fo*a);if(o.ph===0)beam15(b.position.clone(),b.position.clone().add(new T.Vector3(2.5,7,0)),'#ff8a30',R*.18,.6);
      for(let i=0;i<10;i++){const an=t3*2+i*.628,r2=R*.4*sc*(1.25+.2*Math.sin(t3*9+i*3));beam15(V3a(b.position.x+Math.cos(an)*R*.38*sc,o.y+Math.sin(an)*R*.38*sc,y),V3a(b.position.x+Math.cos(an)*r2,o.y+Math.sin(an)*r2,y),'#ffe080',.07,.7*fo*a)}}
    /* Hố Đen Hủy Diệt: hố đen hình cầu thật + đĩa bồi tụ xoáy + phễu hút */
    else if(k==='bhole2'){const R=o.R||2,f=o.age<3?Math.min(1,o.age/.5):Math.max(0,1-(o.age-3)/.6),y=Y*.8,d=S.DARK.get();d.position.set(o.x,y,o.y);d.scale.setScalar(R*.85*f+.01);
      for(let j=0;j<3;j++){const t=tor15(o.x,y,o.y,R*(1.3+j*.45),j%2?'#b080ff':'#8a50ff',.7*f*a);t.rotation.set(.35,t3*(1.5-j*.3),0)}
      dash15(o.x,o.y,.12,(o.Rp||9)*Math.max(.3,1-(o.age%1)*.2),'#8a50ff',.3*f*a,32,-t3,.05);const fu=S.FUN.get();fu.position.set(o.x,0,o.y);fu.scale.set(R*2.6,y,R*2.6);fu.rotation.y=-t3*2;fu.material.color.set(0x7a3cff);fu.material.opacity=.5*f*a;
      for(let i=0;i<5;i++)for(let j=1;j<=8;j++){const u=j/8,an=-t3*3+i*1.2566-u*2.4,rr=R*(2.2-1.5*u);dot15(o.x+Math.cos(an)*rr,y*(.3+.7*u),o.y+Math.sin(an)*rr,.35,'#c8a0ff',.7*f*a)}dot15(o.x,y,o.y,R*3,'#7a3cff',.4*f*a)}
    /* Giáp Hấp Thụ: khiên cầu lưới lục giác bao tàu, hút sát thương */
    else if(k==='absb'){const P=o.P;if(!ok(P))return;const R=2.5*(1+.03*Math.sin(t3*8)),f=Math.max(0,Math.min(1,(o.max-o.age)/.3,o.age/.15)),h=S.HEMI.get();h.position.set(P.x,0,P.y);h.scale.set(R,R*.75,R);h.material.color.set(0x50d0ff);h.material.opacity=.14*f;
      const w=S.HEXW.get();w.position.set(P.x,0,P.y);w.scale.set(R*1.01,R*.76,R*1.01);w.rotation.y=t3*.3;w.material.color.set(0x7fe8ff);w.material.opacity=.35*f;tor15(P.x,.1,P.y,R,'#7fe8ff',.9*f)}
    /* Hạm Đội Mũi Giáo: phi thuyền tím trên cao giáng cột laser tím thẳng xuống mục tiêu */
    else if(k==='pbeam'){const p=o.age/o.max,f=Math.max(0,Math.min(1,p/.1,(1-p)/.12)),sx=o.fx,sz=o.fy,sy=6,b=S.BALL.get();b.position.set(sx,sy,sz);b.scale.set(.7,.25,.45);b.material.color.set(0x8040d0);b.material.opacity=.95*a;dot15(sx,sy,sz,1.8,'#b070ff',.6*a);
      if(o.age>.05){const w=(.7+.25*Math.sin(t3*30))*f;beam15(V3a(sx,sz,sy),V3a(o.x,o.y,0),'#be64ff',w,.85*f);beam15(V3a(sx,sz,sy),V3a(o.x,o.y,0),'#ffe6ff',w*.3,f);dot15(o.x,.3,o.y,3+f,'#b070ff',.65*f);tor15(o.x,.12,o.y,1.5,'#e0c0ff',.8*f*a)}}
    /* Mũi Tên Sấm Sét: mũi tên điện 3D lao thẳng, kéo vệt sét, giật điện kẻ bị trúng */
    else if(k==='tarrow'){const d=o.d,hd=Math.min(o.dist,o.L),hx=o.sx+d[0]*hd,hz=o.sy+d[1]*hd,A=V3a(o.sx,o.sy),H=V3a(hx,hz);beam15(A,H,'#40b8ff',.18,.5*a);zap15(A,H,'#d0f4ff',.9*a,o.sx*3,.3,.04);
      if(o.dist<o.L){const tl=V3a(hx-d[0]*5,hz-d[1]*5);beam15(tl,H,'#96e6ff',.35,.9);const nx=-d[1],nz=d[0];beam15(H,V3a(hx-d[0]*1.3+nx*1,hz-d[1]*1.3+nz*1),'#dff6ff',.12,1);beam15(H,V3a(hx-d[0]*1.3-nx*1,hz-d[1]*1.3-nz*1),'#dff6ff',.12,1);dot15(hx,Y,hz,3,'#40b8ff',.6);dot15(hx,Y,hz,.8,'#ffffff',1)}
      (o.sk||[]).forEach((z,i)=>{if(z.t<=0||!ok(z.e))return;const r=(z.e.size||2)*.35,C2=V3a(z.e.x,z.e.y);for(let j=0;j<3;j++){const a1=t3*9+j*2.1;zap15(C2,V3a(z.e.x+Math.cos(a1)*r*1.1,z.e.y+Math.sin(a1)*r*1.1,Y+Math.sin(t3*20+j)*.4),'#9fe8ff',.85*a,i*5+j,.12,.04)}dot15(z.e.x,Y,z.e.y,r*3,'#40b8ff',.3*a)})}
    /* Laser Bề Mặt: các bản sao lao trên mặt sàn để lại vệt laser vàng có tia điện, cột sáng vàng tại đầu vệt */
    else if(k==='lanes'){const d=o.d,f1=Math.min(1,o.age/o.dur),f0=Math.max(0,(o.age-4)/o.dur),ft=Math.min(1,(o.max-o.age)/.4);(o.lanes||[]).forEach((ln,i)=>{if(f1>f0){const A=V3a(ln.sx+d[0]*o.L*f0,ln.sy+d[1]*o.L*f0,.25),B=V3a(ln.sx+d[0]*o.L*f1,ln.sy+d[1]*o.L*f1,.25);beam15(A,B,'#ffc830',.35,.55*ft*a);beam15(A,B,'#fff6b0',.08,.9*ft*a);zap15(A,B,'#ffe060',.8*ft*a,i*7,.2,.035)}
      if(o.age<=o.dur&&ln.hx!=null){beam15(V3a(ln.hx,ln.hy,9),V3a(ln.hx,ln.hy,0),'#ffd23c',.3,.9*a);dot15(ln.hx,.3,ln.hy,2,'#ffd24a',.7*a)}})}
    /* Tấm Khiên Nano: mái vòm lưới lục giác 3D, vệt quét sáng chạy qua, vòng năng lượng còn lại */
    else if(k==='dome'){const D=o.D;if(!D)return;const R=D.R,f=Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.2)),pf=Math.max(0,(D.pool||0)/2000),h=S.HEMI.get();h.position.set(D.x,0,D.y);h.scale.set(R,R*.7,R);h.material.color.set(0x78e6ff);h.material.opacity=(.1+(D.flash>0?.12:0))*f;
      const w=S.HEXW.get();w.position.set(D.x,0,D.y);w.scale.set(R*1.01,R*.71,R*1.01);w.rotation.y=t3*.15;w.material.color.set(0x9fefff);w.material.opacity=.3*f;tor15(D.x,.1,D.y,R,'#9fefff',.7*f);
      const sw=((t3*.7)%1)*2-1;tor15(D.x,R*.7*Math.sqrt(Math.max(0,1-sw*sw))*.98,D.y,R*Math.abs(sw)+.01,'#c8faff',.35*f);const n=Math.max(1,Math.round(40*pf));for(let i=0;i<n;i++){const an=-Math.PI/2+i/40*TAU;dot15(D.x+Math.cos(an)*R*1.03,.2,D.y+Math.sin(an)*R*1.03,.3,'#ffffff',.8*f)}}
    /* vùng kỹ năng chung: vùng bụi sao (Bão Bụi Sao), vùng lửa, vùng chậm */
    else if(k==='zone'||k==='fire'||k==='dust'||k==='slow'){const R=o.r||1,c=o.col||'#a8b8ff',w=S.WALL.get();w.position.set(o.x,0,o.y);w.scale.set(R,k==='dust'?1.6:1,R);w.material.color.copy(col(c));w.material.opacity=.45*a;disk15(o.x,.06,o.y,R,c,.18*a);dash15(o.x,o.y,.12,R,c,.7*a,14,t3*(k==='slow'?-1:1),.04);
      if(k==='dust'){for(let i=0;i<7;i++){const an=t3*.8+i*.9,u=fr13?fr13(t3*.3+i*.21):((t3*.3+i*.21)%1);dot15(o.x+Math.cos(an)*R*.6,.3+u*2.2,o.y+Math.sin(an)*R*.6,.45,i%3?'#ffffff':'#e8c8ff',.75*a*(1-u*.5))}}
      else if(k==='fire'){if(Math.random()<.5)spark(o.x+rand(-1,1)*R*.6,.2,o.y+rand(-1,1)*R*.6,0,rand(1.5,3),0,Math.random()<.5?'#ffee99':c,.5,.3)}
      else if(k==='slow'){const h=t3*2;beam15(V3a(o.x,o.y,.2),V3a(o.x+Math.cos(h)*R*.8,o.y+Math.sin(h)*R*.8,.2),c,.05,.8*a)}}
    /* đạn kỹ năng chung (tên lửa, đạn năng lượng) */
    else if(k==='proj'){const L=o.thin?1.2:2,c=o.col||'#9fe8ff',A=V3a(o.x,o.y),B=V3a(o.x-Math.cos(o.a)*L,o.y-Math.sin(o.a)*L);beam15(A,B,c,o.thin?.08:.18,.75*a);dot15(o.x,Y,o.y,o.thin?.6:1.1,c,.9);dot15(o.x,Y,o.y,.3,'#ffffff',1)}
    /* Vòng Xoáy Tử Thần: thêm phễu xoáy tím dựng đứng khi đang hút */
    else if(k==='vxtt'&&o.ph===1){const fu=S.FUN.get();fu.position.set(o.x,0,o.y);fu.scale.set(3.6,3.2,3.6);fu.rotation.y=-t3*3;fu.material.color.set(0x9a4aff);fu.material.opacity=.55*a;const fu2=S.FUN.get();fu2.position.set(o.x,0,o.y);fu2.scale.set(2.4,4,2.4);fu2.rotation.y=-t3*4.5;fu2.material.color.set(0xd8a0ff);fu2.material.opacity=.35*a;
      for(let i=0;i<14;i++){const u=fr13((t3*.7+i/14)),an=-t3*4+i*1.3,r=3.4*(1-u)+.2;dot15(o.x+Math.cos(an)*r,3.2*(1-u)+.3,o.y+Math.sin(an)*r,.35,i%2?'#d8a0ff':'#9a4aff',.8*a)}}});
  if(X){
  /* Tốc Độ Tím: lưỡi cong tím 3D lao vòng, có vệt gió khi bay */
  (X.pc||[]).forEach(c=>{const g=S.ARC.get(),a2=Math.atan2(c.dy,c.dx),fl=c.mode==='fly',ap=c.mode==='ch'?Math.min(1,c.age/.25):1;g.position.set(c.x,Y,c.y);g.rotation.set(0,-a2,0);g.scale.setScalar(fl?1.15:.9);g.userData.cs.forEach((m,i)=>m.material.opacity=[.5,.8,.9][i]*ap);
    if(fl)for(let i=-2;i<=2;i++){const nx=-Math.sin(a2),nz=Math.cos(a2),bx=c.x-Math.cos(a2)*2.2+nx*i*.4,bz=c.y-Math.sin(a2)*2.2+nz*i*.4;beam15(V3a(bx,bz),V3a(bx-Math.cos(a2)*1.6,bz-Math.sin(a2)*1.6),'#9a6aff',.04,.5)}});
  /* Vệt Sao Tím: 3 vệt sao cong tím 3D bay theo tàu rồi lao tiếp */
  (X.str||[]).forEach(w=>{if(w.mode==='att'&&!ok(w.P))return;const g=S.ARC.get(),a2=Math.atan2(w.dy,w.dx),ap=Math.min(1,w.age/(.12+w.k*.08));g.position.set(w.x,Y,w.y);g.rotation.set(0,-a2,0);g.scale.setScalar(1);g.userData.cs.forEach((m,i)=>m.material.opacity=[.5,.8,.9][i]*ap);
    [-.95,.95].forEach(t=>{const lx=-.5+Math.cos(t)*1.5,lz=Math.sin(t)*1.5,ca=Math.cos(a2),sa=Math.sin(a2);dot15(w.x+lx*ca-lz*sa,Y,w.y+lx*sa+lz*ca,.7,'#ffffff',ap)})});
  /* Cá Không Gian: cá 3D bơi lượn, đuôi vẫy, vệt gợn sóng phía sau */
  (X.fh||[]).forEach(f=>{const g=S.FISH.get(),a2=Math.atan2(f.dy,f.dx);g.position.set(f.x,Y+.15*Math.sin(f.age*3),f.y);g.rotation.set(0,-a2,.15*Math.sin(f.age*5));g.scale.setScalar(1.3);g.userData.t.rotation.y=Math.sin(f.age*14)*.5;
    dot15(f.x,Y,f.y,3.4,'#78beff',.3);for(let i=0;i<3;i++)for(let j=1;j<=5;j++){const bx=f.x-Math.cos(a2)*(1.8+j*.45),bz=f.y-Math.sin(a2)*(1.8+j*.45),off=(i-1)*.3+Math.sin(f.age*10+j*.9+i)*.25*j/4;dot15(bx-Math.sin(a2)*off,Y,bz+Math.cos(a2)*off,.3,i?'#7a6aff':'#5ac8ff',.45*(1-j/6))}})}
  S.B.end();S.DOT.end();S.TOR.end();S.DISK.end();S.DARK.end();S.BALL.end();S.SUNB.end();S.HEMI.end();S.HEXW.end();S.WALL.end();S.FUN.end();S.ARC.end();S.FISH.end()}
/* ===================== KỸ NĂNG 3D (đợt 16) =====================
   Kiếm Năng Lượng · Trụ Phòng Thủ (c26) · Vùng Cấm Đỏ · Ma Trận Số · Kho Báu Hỗn Loạn · Hạm Đội Hộ Vệ · Sóng Âm · Màn Sương Ảo Ảnh · Hủy Trọng Lực
   · Cảnh Báo Đỏ · Vụ Nổ Đỏ Khóa · Đồng Hồ Cát · Lưới Cầu Vàng (c28) · Khiên Phản Đạn · Tín Hiệu Lỗi · Vụ Nổ Hư Không (theo ảnh: lõi đen, mảnh tinh thể đen vỡ tung, sét tím toả)
   · tàu địch xuất hiện qua cổng sáng · biểu tượng choáng 3D */
Object.assign(R3.c5k,{rsh:1,cone:1,err:1,void:1});
let SK16=null;const WARP=new WeakSet(),WFX=[];
/* ===== đợt 17: 23 kỹ năng drone / khiên (c34) dựng 3D ===== */
let SK17=null;
function sk17Init(){if(SK17)return SK17;skInit();const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.035,8,72);torus.rotateX(Math.PI/2);
  const MSd=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:lin(c),metalness:.6,roughness:.35},o||{})),GLm=c=>new T.MeshBasicMaterial({color:c,toneMapped:false});
  const white=MSd(0xe9eef5,{metalness:.5,roughness:.28}),dark=MSd(0x1b2332,{metalness:.8,roughness:.35}),gun=MSd(0x3a4352,{metalness:.9,roughness:.25}),
    redH=MSd(0x5a1a1a,{metalness:.7,roughness:.3}),purH=MSd(0x3a1f5c,{metalness:.75,roughness:.3,emissive:lin(0x2a0a50),emissiveIntensity:.6}),goldH=MSd(0xd9a520,{metalness:.95,roughness:.2,emissive:lin(0x4a3000),emissiveIntensity:.4}),
    orange=MSd(0xff8a20,{metalness:.4,roughness:.4,emissive:lin(0xff6a00),emissiveIntensity:.7});
  const hexT=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.strokeStyle='#ffffff';x.lineWidth=3;const r=22,h=r*Math.sqrt(3);
    for(let j=-1;j<8;j++)for(let i=-1;i<9;i++){const cx=i*r*1.5,cy=j*h+(i%2?h/2:0);x.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath();x.stroke()}
    const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t})();
  const swT=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.translate(128,128);for(let i=0;i<5;i++){x.rotate(TAU/5);const g=x.createLinearGradient(0,0,120,0);g.addColorStop(0,'rgba(255,255,220,1)');g.addColorStop(1,'rgba(255,190,40,0)');x.strokeStyle=g;x.lineWidth=10;x.beginPath();for(let k=0;k<60;k++){const a=k/60*3,r=k*2;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.stroke()}return new T.CanvasTexture(c)})();
  const hexM=(c,o)=>new T.MeshBasicMaterial({map:hexT,color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false});
  const glowS=(c,s,x,y,z)=>{const g=new T.Sprite(ADDM(glowT()));g.material.color.set(c);g.scale.setScalar(s);g.position.set(x||0,y||0,z||0);return g};
  const add=(g,m,x,y,z)=>{m.position.set(x||0,y||0,z||0);m.castShadow=true;g.add(m);return m};
  /* --- các khung drone theo ảnh kỹ năng, mặt trước hướng -z --- */
  function orb(c,hull,o){o=o||{};const g=new T.Group(),b=new T.Group();g.add(b);const r=o.r||.32;
    add(b,new T.Mesh(new T.SphereGeometry(r,20,14),hull||white));const band=new T.Mesh(new T.TorusGeometry(r*1.02,.045,8,32),dark);b.add(band);
    const eye=add(b,new T.Mesh(new T.SphereGeometry(r*.32,14,10),GLm(c)),0,0,-r*.92);const lens=add(b,new T.Mesh(new T.TorusGeometry(r*.36,.03,6,20),dark),0,0,-r*.88);
    const pods=[];[-1,1].forEach(s=>{const p=add(b,new T.Mesh(new T.CylinderGeometry(r*.28,r*.34,r*1.1,12),o.pod||dark),s*r*1.15,0,r*.15);p.rotation.x=Math.PI/2;const gl=glowS(c,r*1.4,s*r*1.15,0,r*.8);b.add(gl);pods.push(gl)});
    if(o.fin)[-1,1].forEach(s=>{const f=add(b,new T.Mesh(new T.BoxGeometry(r*.9,.03,r*.5),o.fin),s*r*1.6,0,r*.2)});
    const gl=glowS(c,r*2.2,0,0,-r*1.05);b.add(gl);g.userData={b,eye,gl,pods,c};return g}
  function jet(c,hull,o){o=o||{};const g=new T.Group(),b=new T.Group();g.add(b);
    const fu=add(b,new T.Mesh(new T.CylinderGeometry(.05,.15,1,12),hull||white));fu.rotation.x=-Math.PI/2;
    const sh=new T.Shape();sh.moveTo(0,-.28);sh.lineTo(.6,.26);sh.lineTo(.46,.36);sh.lineTo(.12,.22);sh.lineTo(0,.3);sh.lineTo(-.12,.22);sh.lineTo(-.46,.36);sh.lineTo(-.6,.26);sh.closePath();
    const wg=new T.ExtrudeGeometry(sh,{depth:.035,bevelEnabled:false});wg.rotateX(Math.PI/2);const w=add(b,new T.Mesh(wg,o.wing||dark),0,.02,.1);
    [-1,1].forEach(s=>{add(b,new T.Mesh(new T.BoxGeometry(.04,.12,.22),o.tip||hull||white),s*.5,.06,.38)});
    const can=add(b,new T.Mesh(new T.SphereGeometry(.09,12,8),MSd(0x0a1a3a,{metalness:.9,roughness:.1})),0,.08,-.12);can.scale.set(1,.7,2);
    const eye=add(b,new T.Mesh(new T.SphereGeometry(.07,12,8),GLm(c)),0,.1,.08);const gl=glowS(c,.5,0,.1,.08);b.add(gl);
    const pods=[glowS(c,.45,-.08,0,.55),glowS(c,.45,.08,0,.55)];pods.forEach(p=>b.add(p));g.userData={b,eye,gl,pods,c};return g}
  function ship(){const g=new T.Group(),b=new T.Group();g.add(b);add(b,new T.Mesh(new T.BoxGeometry(.42,.16,1.3),purH));const n=add(b,new T.Mesh(new T.ConeGeometry(.3,.6,4),purH),0,0,-.9);n.rotation.x=-Math.PI/2;n.rotation.y=Math.PI/4;n.scale.set(1,1,.45);
    const sh=new T.Shape();sh.moveTo(0,-.3);sh.lineTo(.8,.35);sh.lineTo(.7,.5);sh.lineTo(0,.3);sh.lineTo(-.7,.5);sh.lineTo(-.8,.35);sh.closePath();const wg=new T.ExtrudeGeometry(sh,{depth:.05,bevelEnabled:false});wg.rotateX(Math.PI/2);add(b,new T.Mesh(wg,dark),0,-.02,.1);
    add(b,new T.Mesh(new T.BoxGeometry(.2,.14,.5),dark),0,.14,.05);[-1,1].forEach(s=>{const l=add(b,new T.Mesh(new T.BoxGeometry(.03,.03,1.2),GLm(0xc27dff)),s*.22,.05,0)});
    const eye=add(b,new T.Mesh(new T.BoxGeometry(.16,.05,.1),GLm(0xe0b0ff)),0,.2,-.18);const pods=[-.14,0,.14].map(x=>{const p=glowS(0xb060ff,.5,x,0,.72);b.add(p);return p});const gl=glowS(0xb060ff,.9,0,.2,-.18);b.add(gl);g.userData={b,eye,gl,pods,c:0xb060ff};return g}
  function giant(){const g=orb(0x4fd8ff,white,{r:.32,fin:dark}),U=g.userData,ring=new T.Group();U.b.add(ring);const rg=new T.Mesh(new T.TorusGeometry(.62,.025,6,64),GLm(0x6fe0ff));rg.rotation.x=Math.PI/2;ring.add(rg);
    for(let i=0;i<6;i++){const a=i/6*TAU,n=new T.Mesh(new T.SphereGeometry(.07,10,8),white);n.position.set(Math.cos(a)*.62,0,Math.sin(a)*.62);ring.add(n);const e=new T.Mesh(new T.SphereGeometry(.03,8,6),GLm(0x6fe0ff));e.position.copy(n.position).multiplyScalar(1.13);ring.add(e)}
    const crown=add(U.b,new T.Mesh(new T.ConeGeometry(.12,.25,6),dark),0,.36,0);const big=add(U.b,new T.Mesh(new T.TorusGeometry(.13,.025,8,24),GLm(0xff5a3a)),0,0,-.31);U.ring=ring;U.horn=[-1,1].map(s=>{const h=add(U.b,new T.Mesh(new T.ConeGeometry(.05,.3,6),redH),s*.2,.28,-.05);h.rotation.z=-s*.5;return h});U.eye.material=GLm(0xff5a3a);return g}
  function turret(){const g=new T.Group(),b=new T.Group();g.add(b);for(let i=0;i<3;i++){const a=i/3*TAU,l=new T.Mesh(new T.CylinderGeometry(.04,.05,.9,8),gun);l.position.set(Math.cos(a)*.3,.35,Math.sin(a)*.3);l.rotation.set(Math.sin(a)*.6,0,-Math.cos(a)*.6);l.castShadow=true;b.add(l)}
    add(b,new T.Mesh(new T.CylinderGeometry(.22,.26,.2,16),dark),0,.75,0);const hd=new T.Group();hd.position.y=.9;b.add(hd);add(hd,new T.Mesh(new T.BoxGeometry(.42,.28,.5),white),0,.08,0);add(hd,new T.Mesh(new T.BoxGeometry(.44,.08,.3),dark),0,.24,.05);
    const brl=[-1,1].map(s=>{const m=add(hd,new T.Mesh(new T.CylinderGeometry(.045,.055,.7,10),gun),s*.12,.08,-.55);m.rotation.x=Math.PI/2;return m});const tip=[-1,1].map(s=>{const t=glowS(0xff4a2a,.35,s*.12,.08,-.92);hd.add(t);return t});
    const eye=add(hd,new T.Mesh(new T.SphereGeometry(.05,10,8),GLm(0xff4a2a)),0,.12,-.26);g.userData={b,hd,tip,eye,c:0xff4a2a};return g}
  function mine(){const g=new T.Group(),m=new T.Mesh(new T.IcosahedronGeometry(.2,0),redH);g.add(m);const sp=new T.ConeGeometry(.04,.18,5);const pos=new T.IcosahedronGeometry(1,0).attributes.position,seen=new Set();
    for(let i=0;i<pos.count;i++){const v=new T.Vector3().fromBufferAttribute(pos,i),key=v.toArray().map(n=>n.toFixed(2)).join();if(seen.has(key))continue;seen.add(key);const c=new T.Mesh(sp,gun);c.position.copy(v).multiplyScalar(.24);c.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());g.add(c)}
    const core=new T.Mesh(new T.SphereGeometry(.09,10,8),GLm(0xff2020));core.position.z=-.17;g.add(core);const gl=glowS(0xff2a2a,.9);g.add(gl);g.userData={gl,core};return g}
  function bomb(){const g=new T.Group();const m=new T.Mesh(new T.SphereGeometry(.15,12,10),redH);m.scale.y=1.3;g.add(m);const f=new T.Mesh(new T.BoxGeometry(.24,.12,.02),gun);f.position.y=.2;g.add(f);const f2=f.clone();f2.rotation.y=Math.PI/2;g.add(f2);g.add(glowS(0xff5a2a,.5,0,-.1,0));return g}
  function panel(){const g=new T.Group(),sh=new T.Shape();sh.moveTo(-.7,1.1);sh.lineTo(.7,1.1);sh.lineTo(.7,-.6);sh.lineTo(0,-1.2);sh.lineTo(-.7,-.6);sh.closePath();
    const ho=new T.Path();ho.moveTo(-.45,.85);ho.lineTo(.45,.85);ho.lineTo(.45,-.45);ho.lineTo(0,-.85);ho.lineTo(-.45,-.45);ho.closePath();
    const fr=new T.Shape(sh.getPoints());fr.holes.push(ho);const fg=new T.ExtrudeGeometry(fr,{depth:.12,bevelEnabled:false});fg.translate(0,0,-.06);const fm=new T.Mesh(fg,new T.MeshStandardMaterial({color:lin(0x7fd0ff),emissive:lin(0x2a8aff),emissiveIntensity:1.2,metalness:.6,roughness:.3,transparent:true}));g.add(fm);
    const pg=new T.ShapeGeometry(new T.Shape(ho.getPoints())),pm=new T.MeshBasicMaterial({map:hexT,color:0x6fc8ff,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});const p=new T.Mesh(pg,pm);g.add(p);
    const fill=new T.Mesh(new T.ShapeGeometry(sh),new T.MeshBasicMaterial({color:0x2a7aff,transparent:true,opacity:.18,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));g.add(fill);g.userData={fm,pm,fill};return g}
  const POOL=f=>Pool(()=>{const g=f();scene.add(g);return g});
  const coneG=new T.ConeGeometry(1,1,16,1,true);coneG.translate(0,-.5,0);
  const segG=new T.CylinderGeometry(1,1,1,16);segG.translate(0,.5,0);
  SK17={hexT,
    B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    CONE:Pool(()=>{const m=new T.Mesh(coneG,AD(0xffffff,.4));m.frustumCulled=false;scene.add(m);return m}),
    BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s}),
    SHC:Pool(()=>{const g=new T.Group(),hx=new T.Mesh(new T.CircleGeometry(1,48),new T.MeshBasicMaterial({map:hexT,color:0x6fd0ff,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false})),
      fl=new T.Mesh(new T.CircleGeometry(1,48),new T.MeshBasicMaterial({color:0x2a8aff,transparent:true,opacity:.28,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false})),
      rim=new T.Mesh(new T.TorusGeometry(1,.05,8,64),new T.MeshBasicMaterial({color:0x9fe4ff,transparent:true,toneMapped:false})),gl=new T.Sprite(ADDM(glowT()));gl.material.color.set(0x4fb8ff);gl.scale.setScalar(2.6);
      hx.material.map=hexT.clone();hx.material.map.needsUpdate=true;hx.material.map.repeat.set(.6,.6);g.add(fl,hx,rim,gl);g.userData={hx,fl,rim,gl};scene.add(g);return g}),
    HEXP:Pool(()=>{const m=new T.Mesh(new T.CylinderGeometry(1,1,1,16,1,true,-.62,1.24),hexM(0x5fc0ff,.5));m.frustumCulled=false;scene.add(m);return m}),
    DOME:Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,32,20),hexM(0x5fc0ff,.35));m.renderOrder=3;scene.add(m);return m}),
    WALLC:Pool(()=>{const m=new T.Mesh(new T.CylinderGeometry(1,1,1,48,1,true),hexM(0x6fd0ff,.4));m.frustumCulled=false;scene.add(m);return m}),
    DISC:Pool(()=>{const g=new T.Group(),d=new T.Mesh(new T.CircleGeometry(1,48),new T.MeshBasicMaterial({map:hexT,color:0xffd84a,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false})),f=new T.Mesh(new T.CircleGeometry(1,48),new T.MeshBasicMaterial({color:0xffb020,transparent:true,opacity:.22,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false})),r=new T.Mesh(new T.TorusGeometry(1,.06,8,64),goldH);
      g.add(d,f,r);g.userData={d,f,r};scene.add(g);return g}),
    SWIRL:Pool(()=>{const m=new T.Mesh(new T.CircleGeometry(1,40),new T.MeshBasicMaterial({map:swT,color:0xffffff,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false}));scene.add(m);return m}),
    RINGG:Pool(()=>{const m=new T.Mesh(new T.TorusGeometry(1,.12,12,64),goldH);m.castShadow=true;scene.add(m);return m}),
    ROCK:Pool(()=>{const m=new T.Mesh(rockGeo(.2),new T.MeshStandardMaterial({color:lin(0x8a7060),roughness:.85,metalness:.15,flatShading:true,emissive:lin(0x3a1a00),emissiveIntensity:.4}));m.castShadow=true;scene.add(m);return m}),
    SEG:Pool(()=>{const m=new T.Mesh(segG,white);m.castShadow=true;m.frustumCulled=false;scene.add(m);return m}),
    SEGD:Pool(()=>{const m=new T.Mesh(segG,dark);m.castShadow=true;m.frustumCulled=false;scene.add(m);return m}),
    JOINT:Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,20,14),dark);m.castShadow=true;scene.add(m);return m}),
    ABASE:Pool(()=>{const g=new T.Group();add(g,new T.Mesh(new T.CylinderGeometry(1.5,1.6,.5,32),dark),0,.25,0);add(g,new T.Mesh(new T.CylinderGeometry(1.2,1.35,.6,32),white),0,.8,0);const ring=add(g,new T.Mesh(new T.TorusGeometry(1.25,.06,8,48),GLm(0x4fd8ff)),0,.55,0);ring.rotation.x=Math.PI/2;
      const sh=add(g,new T.Mesh(new T.BoxGeometry(1.4,1.2,1.4),white),0,1.6,0);[-1,1].forEach(s=>add(g,new T.Mesh(new T.BoxGeometry(.2,1,1.1),dark),s*.8,1.6,0));const lt=add(g,new T.Mesh(new T.SphereGeometry(.12,10,8),GLm(0xff9a2a)),0,1.6,-.72);
      g.userData={sh,ring};scene.add(g);return g}),
    CLAW:Pool(()=>{const g=new T.Group(),hub=add(g,new T.Mesh(new T.CylinderGeometry(.45,.55,.5,16),dark),0,0,0);hub.rotation.x=Math.PI/2;const F=[];
      for(let i=0;i<3;i++){const f=new T.Group(),a=i/3*TAU;f.rotation.z=a;const p1=add(f,new T.Mesh(new T.BoxGeometry(.16,.7,.2),white),0,.35,0),j=new T.Group();j.position.set(0,.7,0);f.add(j);const p2=add(j,new T.Mesh(new T.BoxGeometry(.13,.55,.17),gun),0,.27,0);
        const tip=add(j,new T.Mesh(new T.ConeGeometry(.08,.25,6),dark),0,.62,0);const fg=new T.Group();fg.add(f);fg.position.z=-.3;g.add(fg);f.userData={j};F.push(f)}
      const gl=glowS(0xff9a2a,.8,0,0,-.4);g.add(gl);g.userData={F,gl};scene.add(g);return g}),
    FTR:POOL(()=>jet(0x4fd8ff,white,{wing:dark})),MN:POOL(()=>jet(0xff3a3a,dark,{wing:redH,tip:redH})),
    SKY:POOL(()=>{const g=orb(0xffa040,white,{pod:orange,fin:dark});const em=new T.Mesh(new T.CylinderGeometry(.06,.1,.18,10),dark);em.position.y=-.32;g.userData.b.add(em);return g}),
    SHD:POOL(()=>orb(0x4fd8ff,white,{fin:dark})),BMB:POOL(()=>orb(0xff2a2a,redH,{pod:dark,fin:redH})),COL:POOL(()=>{const g=orb(0x6fe8ff,white,{fin:dark});const em=new T.Mesh(new T.CylinderGeometry(.12,.08,.12,12),dark);em.position.y=-.33;g.userData.b.add(em);return g}),
    MK:POOL(()=>orb(0xff3a3a,white,{fin:dark})),GOLD:POOL(()=>{const g=orb(0xffb020,white,{pod:goldH,fin:goldH});const n=new T.Mesh(new T.ConeGeometry(.1,.3,10),goldH);n.rotation.x=-Math.PI/2;n.position.z=-.4;g.userData.b.add(n);return g}),
    RES:POOL(()=>jet(0x5fd0ff,white,{wing:MSd(0x1a5aa8)})),HEAL:POOL(()=>orb(0x3dff7a,white,{fin:dark})),CAGE:POOL(()=>{const g=orb(0x6fd0ff,white,{});const r=new T.Mesh(new T.TorusGeometry(.42,.025,6,32),GLm(0x6fd0ff));r.rotation.x=Math.PI/2;g.userData.b.add(r);return g}),
    PUR:POOL(ship),DEM:POOL(giant),TUR:POOL(turret),MINE:POOL(mine),BOMB:POOL(bomb),PANEL:POOL(panel)};
  return SK17}
function beam17(a,b,c,w,o){const g=SK17.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap17(a,b,c,o,sd,amp,w){amp=amp||.3;const n=9,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(t3*55+i*3+sd)*amp:0,up=i<n?Math.cos(t3*47+i*5+sd)*amp:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam17(p0,p1,c,w||.06,o);p0=p1}}
function dot17(x,y,z,s,c,o){const d=SK17.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor17(x,y,z,r,c,o,rx,rz){const t=SK17.TOR.get();t.position.set(x,y,z);t.scale.setScalar(Math.max(.01,r));t.rotation.set(rx||0,0,rz||0);t.material.color.copy(col(c));t.material.opacity=o;return t}
function cone17(a,b,r,c,o){const m=SK17.CONE.get(),d=b.clone().sub(a),L=d.length()||.01;m.position.copy(a);m.quaternion.setFromUnitVectors(new T.Vector3(0,-1,0),d.multiplyScalar(1/L));m.scale.set(r,L,r);m.material.color.copy(col(c));m.material.opacity=o;return m}
function bar17(x,y,z,w,f,c){const bg=SK17.BAR.get();bg.position.set(x-w/2,y,z);bg.scale.set(w,.11,1);bg.material.color.set(0x101820);bg.material.opacity=.8;if(f<=0)return;const s=SK17.BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),.11,1);s.material.color.copy(col(c));s.material.opacity=1}
function seg17(pool,a,b,r){const m=pool.get(),d=b.clone().sub(a),L=d.length()||.01;m.position.copy(a);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));m.scale.set(r,L,r);return m}
const K17={ftr:'FTR',sky:'SKY',bmb:'BMB',col:'COL',mk:'MK',dem:'DEM',gold:'GOLD',res:'RES',heal:'HEAL',mn:'MN',pur:'PUR',cage:'CAGE'};
const SC17={ftr:.85,sky:.9,shd:.95,bmb:.95,col:.9,mk:.9,dem:6.6,gold:.95,res:.85,heal:.95,mn:.8,pur:1.5,cage:.9};
function skill3d17(G,dt){const Z=G.c34;if(!Z)return;sk17Init();const S=SK17,Y=HOV,V=(x,z,y)=>new T.Vector3(x,y,z),ok=e=>e&&!e.dead;
  /* đơn vị */
  Z.u.forEach(u=>{const dead=u.dead,age=G.t-u.born,dk=dead?Math.max(0,1-(G.t-(u.dt0||G.t))/.5):1;if(dead&&dk<=0)return;
    if(dead&&!u.fx3){u.fx3=1;if(u.exp||u.k==='arm'||u.k==='tur'||u.k==='s4w'||u.k==='pur'||u.k==='dem')boom(u.x,(u.h||0)+.6,u.y,u.k==='dem'?2:u.k==='arm'?1.6:.7,u.k!=='dem');else if(!u.pull)boom(u.x,(u.h||0)+.6,u.y,.45,true)}
    const pk=K17[u.k];
    if(pk){if(dead)return;const g=S[pk].get(),U=g.userData,sc=SC17[u.k]*(u.k==='res'&&u.h>2?1.1:1),hy=(u.h||1)+.55+(u.k==='dem'?0:.06*Math.sin(t3*4+u.x*3)),bk=u.k==='dem'?.05:.25;
      g.position.set(u.x,hy,u.y);g.rotation.set(0,-(u.ang||0)-Math.PI/2,0);U.b.rotation.z=Math.sin(t3*2+u.x)*bk;g.scale.setScalar(sc*Math.min(1,age*3+.05));
      const hf=u.hit>0;if(U.eye)U.eye.material.color.set(hf?0xffffff:U.c);if(U.pods)U.pods.forEach(p=>p.scale.setScalar((u.k==='dem'?.5:.45)*(.8+.4*Math.random())));if(U.ring)U.ring.rotation.y=t3*1.5;
      const bw=u.k==='dem'?4:u.k==='pur'?1.3:.8;if(u.k!=='sky')bar17(u.x,hy+sc*(u.k==='dem'?.75:.55),u.y,bw,u.hp/u.max,u.es?'#ff6a3c':'#5fe08a');
      /* hiệu ứng riêng */
      if(u.k==='res'&&u.h>1.6){beam17(V(u.x,u.y,u.h+12),V(u.x,u.y,0),'#5fd0ff',.5,.35);dot17(u.x,.15,u.y,1.6,'#5fd0ff',.5);tor17(u.x,.1,u.y,1+.2*Math.sin(t3*8),'#8fe0ff',.6)}
      if(u.k==='sky'){const tg=u.tg;if(tg&&ok(tg)&&u.las){const E=V(tg.x,tg.y,Y+(tg.lift||0)*1.3),A=V(u.x,u.y,hy-.3);beam17(A,E,'#ff8a20',.32+.05*Math.sin(t3*30+u.slot),.85);beam17(A,E,'#ffe0a0',.08,1);dot17(E.x,E.y,E.z,1.4+.3*Math.sin(t3*25),'#ff9a2a',.85);
          if(Math.random()<.4)spark(E.x,E.y,E.z,rand(-2,2),rand(1,3),rand(-2,2),'#ffb060',.4,.3)}}
      if(u.k==='col'&&u.suck&&u.w){const A=V(u.x,u.y,hy-.25),E=V(u.w.x,u.w.y,.1);cone17(A,E,1.1,'#5fd8ff',.22);beam17(A,E,'#9fe8ff',.05,.6);for(let i=0;i<3;i++){const k=((t3*1.4+i/3+u.slot*.13)%1);dot17(E.x+(A.x-E.x)*k,E.y+(A.y-E.y)*k,E.z+(A.z-E.z)*k,.35,'#bff4ff',.9)}}
      if(u.k==='gold'&&u.flame&&ok(u.tg)){const tg=u.tg,A=V(u.x,u.y,hy),E=V(tg.x,tg.y,Y+(tg.lift||0)*1.3),f=1+.15*Math.sin(t3*40+u.x);cone17(A,E,.55*f,'#ff6a10',.45);cone17(A,E,.28*f,'#ffd060',.6);if(Math.random()<.7)spark(E.x,E.y,E.z,rand(-1.5,1.5),rand(.5,2.5),rand(-1.5,1.5),'#ff9a2a',.35,.35)}
      if(u.k==='heal'&&u.beam&&ok(u.tg)){const tg=u.tg,A=V(u.x,u.y,hy),E=V(tg.x,tg.y,Y+(tg.lift||0)*1.3);beam17(A,E,'#3dff7a',.14,.8);dot17(E.x,E.y+.4,E.z,1.1,'#5dff9a',.45);if(Math.random()<.3)spark(E.x+rand(-.5,.5),E.y,E.z+rand(-.5,.5),0,1.5,0,'#8fffb0',.6,.25)}
      if(u.k==='mk'&&ok(u.tg)&&Math.random()<.02)0;
      if(u.pull)beam17(V(u.x,u.y,hy),V(u.own.x,u.own.y,Y),'#ffe0a0',.04,.5);
      if(u.merge&&!u.pull)dot17(u.x,hy,u.y,.9,'#ff9a5a',.7);
      return}
    if(u.k==='shd'){if(dead)return;const g=S.SHD.get();g.position.set(u.x,u.h+.5,u.y);g.rotation.set(0,-(u.ang||0)-Math.PI/2,0);g.scale.setScalar(.9*Math.min(1,age*3+.05));bar17(u.x,u.h+1.1,u.y,.7,u.hp/u.max,'#5fe08a');
      if(u.sv>0){const g2=S.SHC.get(),U2=g2.userData,fl=u.shh&&G.t-u.shh<.15,k=(.45+.55*u.sv/u.svm)*Math.min(1,age*2.5),c=Math.cos(u.ang),sn=Math.sin(u.ang);
        g2.position.set(u.x+c*.85,u.h+.5,u.y+sn*.85);g2.rotation.set(0,-u.ang+Math.PI/2,0);g2.scale.setScalar(Math.min(1,age*3+.1));U2.hx.material.opacity=(fl?1:.55+.15*Math.sin(t3*4+u.slot))*k;U2.fl.material.opacity=(fl?.5:.22)*k;
        U2.rim.material.opacity=k;U2.gl.material.opacity=(fl?.8:.35)*k;U2.hx.rotation.z=t3*.3+u.slot;beam17(V(u.x,u.y,u.h+.5),V(u.x+c*.85,u.y+sn*.85,u.h+.5),'#6fd0ff',.06,.7*k);
        bar17(u.x,u.h+1.25,u.y,.7,u.sv/u.svm,'#8fd8ff')}return}
    if(u.k==='tur'){if(dead)return;const g=S.TUR.get(),U=g.userData,r=u.rise||0;g.position.set(u.x,-1.2*(1-r),u.y);g.rotation.set(0,0,0);g.scale.setScalar(1.4);U.hd.rotation.y=-(u.yaw||0)-Math.PI/2;const fl=u.tg&&Math.random()<.6;U.tip.forEach((t,i)=>t.scale.setScalar(fl&&(i===(u.alt?1:0))?.7:.25));
      bar17(u.x,2,u.y,.9,u.hp/u.max,'#5fe08a');if(age<.6)dot17(u.x,.2,u.y,2*(1-age/.6)+.5,'#ffb060',.6);return}
    if(u.k==='s4w'){const g=S.PANEL.get(),U=g.userData;g.position.set(u.x,1.25,u.y);g.rotation.set(0,-u.ang+Math.PI/2,0);g.scale.setScalar(1);const f=u.hp/u.max;U.pm.opacity=(.35+.3*f)*dk;U.fill.material.opacity=.15*dk;U.fm.material.opacity=dk;U.fm.material.emissiveIntensity=u.hit>0?3:1.2;
      if(!dead)bar17(u.x,2.7,u.y,.9,f,'#8fd8ff');return}
    if(u.k==='arm'){if(dead)return;const r=u.rise||0,bx=u.x,bz=u.y,base=S.ABASE.get(),yw=Math.atan2(u.cy-bz,u.cx-bx);base.position.set(bx,-2.4*(1-r),bz);base.rotation.set(0,-yw-Math.PI/2,0);base.userData.ring.material.color.set(u.hit>0?0xffffff:0x4fd8ff);
      const sy=2.2-2.4*(1-r),Sx=V(bx,bz,sy),cx=bx+(u.cx-bx)*r,cz=bz+(u.cy-bz)*r,ch=sy+(u.ch-2.2)*r,dx=cx-bx,dz=cz-bz,dh=ch-sy,dH=Math.hypot(dx,dz)||.001,L1=3.6,L2=3.4,D=Math.min(L1+L2-.05,Math.max(.6,Math.hypot(dH,dh))),al=Math.atan2(dh,dH);
      const c1=Math.max(-1,Math.min(1,(L1*L1+D*D-L2*L2)/(2*L1*D))),p1=al+Math.acos(c1),ux=dx/dH,uz=dz/dH,E=V(bx+ux*Math.cos(p1)*L1,bz+uz*Math.cos(p1)*L1,sy+Math.sin(p1)*L1),W=V(bx+ux*Math.cos(al)*D,bz+uz*Math.cos(al)*D,sy+Math.sin(al)*D);
      seg17(S.SEG,Sx,E,.85);seg17(S.SEGD,Sx.clone().add(V(0,0,.3)),E.clone().add(V(0,0,.3)),.22);seg17(S.SEG,E,W,.68);seg17(S.SEGD,E.clone().add(V(0,0,-.25)),W.clone().add(V(0,0,-.25)),.18);
      const j1=S.JOINT.get();j1.position.copy(Sx);j1.scale.setScalar(1.1);const j2=S.JOINT.get();j2.position.copy(E);j2.scale.setScalar(.85);dot17(E.x,E.y,E.z,.7,'#4fd8ff',.6);
      const cl=S.CLAW.get(),CU=cl.userData,dir=W.clone().sub(E).normalize();cl.position.copy(W);cl.quaternion.setFromUnitVectors(new T.Vector3(0,0,-1),dir);cl.scale.setScalar(1.25);const open=u.grab?.15:(u.st==='reach'?.9:.5);
      CU.F.forEach(f=>{f.rotation.x=-open*.8;f.userData.j.rotation.x=open*.9-.6});bar17(bx,4.6,bz,1.6,u.hp/u.max,'#5fe08a');
      for(let i=0;i<2;i++)dot17(bx+rand(-1,1),.3,bz+rand(-1,1),.5,'#4fd8ff',.3);if(u.grab)tor17(W.x,W.y-.6,W.z,1.1+.1*Math.sin(t3*12),'#ff9a2a',.6);return}
    if(u.k==='cage'||u.k==='mn'){}});
  /* hiệu ứng / vật thể */
  Z.o.forEach(o=>{const k=o.k;
    if(k==='mine'){const g=S.MINE.get(),U=g.userData,a=Math.min(1,o.t*3,(o.max-o.t)*2+.2),bl=o.max-o.t<2?(Math.sin(t3*20)>0?1:.3):1;g.position.set(o.x,.9+.15*Math.sin(t3*2.5+o.ph),o.y);g.rotation.set(t3*.6+o.ph,t3*.8,0);g.scale.setScalar(1.3*a);U.gl.material.opacity=.7*bl;U.gl.scale.setScalar(.9+.2*Math.sin(t3*6+o.ph));return}
    if(k==='bomb'){const g=S.BOMB.get(),p=Math.min(1,o.t/o.max);g.position.set(o.x,(o.h0+.4)*(1-p*p),o.y);g.rotation.set(0,0,0);g.scale.setScalar(1.3);if(Math.random()<.5)smoke(o.x,(o.h0+.4)*(1-p*p)+.3,o.y,.4,.25);return}
    if(k==='thrown'){const e=o.e;if(!ok(e))return;for(let i=0;i<2;i++)smoke(e.x,Y+(e.lift||0)*1.3,e.y,.5,.4);return}
    if(k==='merge'){const p=Math.min(1,o.t/o.max);tor17(o.x,3.6,o.y,4*(1-p)+.4,'#ff7a4a',.7);dot17(o.x,3.6,o.y,1+5*p,'#ff9a5a',.5*p);o.M.forEach((m,i)=>{if(m.u)return;const x=m.x0+(o.x-m.x0)*p*p,z=m.y0+(o.y-m.y0)*p*p,h=m.h0+(3-m.h0)*p+.6;const g=S.FTR.get();g.position.set(x,h,z);g.rotation.set(0,-Math.atan2(o.y-m.y0,o.x-m.x0)-Math.PI/2,0);g.scale.setScalar(.85);beam17(V(x,z,h),V(o.x,o.y,3.6),'#6fe0ff',.03,.5)});return}
    if(k==='door'){const P=o.P;if(!ok(P))return;const a=Math.min(1,o.t*3,(o.max-o.t)*3),an=(P.ang||0)+Math.PI/2,dx=P.x+Math.cos(an)*.8,dz=P.y+Math.sin(an)*.8;dot17(dx,Y+.2,dz,2.2+.4*Math.sin(t3*10),'#ffe0a0',.8*a);tor17(dx,Y+.2,dz,1+.4*Math.sin(t3*6),'#ffd27a',.7*a,Math.PI/2,an);for(let i=0;i<4;i++){const kk=(t3*1.5+i/4)%1;tor17(dx+Math.cos(an)*kk*6,Y+.2,dz+Math.sin(an)*kk*6,1.4*(1-kk)+.2,'#ffe0a0',.5*a*(1-kk),Math.PI/2,an)}return}
    if(k==='zap'){if(o.t<o.dl){dot17(o.P.x,Y,o.P.y,2+o.t*4,'#9fd0ff',.6);return}const p=(o.t-o.dl)/o.max,R=CF34().zap.R*Math.min(1,p*4),a=1-p;const d=S.DOME.get();d.position.set(o.x,0,o.y);d.scale.set(R,R*.5,R);d.material.color.set(0x8fd0ff);d.material.opacity=.45*a;d.material.map.offset.x=t3*.3;
      tor17(o.x,.2,o.y,R,'#cfe6ff',.9*a);tor17(o.x,.2,o.y,R*.6,'#8fd0ff',.6*a);for(let i=0;i<10;i++){const an=i/10*TAU+t3*2,rr=R*(.5+.5*Math.sin(i*7.1+t3*9));zap17(V(o.x,o.y,Y),V(o.x+Math.cos(an)*rr,o.y+Math.sin(an)*rr,.3+Math.random()*R*.4),'#bfe0ff',a,i*3.7,.6,.07)}return}
    if(k==='cage'){const e=o.e,C=CF34().cage;if(o.st==='fly'){if(ok(e))tor17(e.x,.15,e.y,C.rad,'#6fd0ff',.4);return}const a=o.st==='done'?Math.max(0,1-(G.t-o.t1)/.6):Math.min(1,(G.t-o.t0)*3),f=Math.max(0,o.v/o.vm),w=S.WALLC.get();
      w.position.set(o.x,1.4,o.y);w.scale.set(C.rad,2.8,C.rad);w.material.opacity=(.18+.32*f)*a;w.material.map.offset.x=t3*.1;tor17(o.x,.15,o.y,C.rad,'#9fd8ff',.9*a);tor17(o.x,2.8,o.y,C.rad,'#9fd8ff',.7*a*f+.1);
      o.D.forEach(d=>{if(ok(d))beam17(V(d.x,d.y,d.h+.55),V(o.x,o.y,1.4),'#6fd0ff',.04,.5*a)});if(ok(e))bar17(o.x,3.4,o.y,2,f,'#9fd8ff');return}
    if(k==='s4'){if(o.st==='stay')return;const y0=o.st==='hover'?4.6+.3*Math.sin(t3*4):4.6*(1-(o.k2||0))+1.25*(o.k2||0);for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,r=o.st==='hover'?1.4:1.4-.5*(o.k2||0),g=S.PANEL.get(),U=g.userData;
        g.position.set(o.x+Math.cos(a)*r,y0,o.y+Math.sin(a)*r);g.rotation.set(o.st==='hover'?.35:0,-a+Math.PI/2,0);g.scale.setScalar(1);U.pm.opacity=.6;U.fill.material.opacity=.2;U.fm.material.opacity=1;U.fm.material.emissiveIntensity=1.6}
      tor17(o.x,.15,o.y,1.6+.2*Math.sin(t3*8),'#6fd0ff',.7);if(o.st==='hover')beam17(V(o.x,o.y,.2),V(o.x,o.y,6),'#6fd0ff',.06,.3);return}
    if(k==='disc'){const P=o.P;if(!ok(P))return;const C=CF34().disc,a=Math.min(1,o.t*4,(o.max-o.t)*3),g=S.DISC.get(),U=g.userData;g.position.set(o.x,Y+.2,o.y);g.rotation.set(0,-o.a+Math.PI/2,0);g.scale.set(C.rad,C.rad*1.1,1);
      U.d.material.opacity=.55*a;U.f.material.opacity=(.18+.08*Math.sin(t3*6))*a;U.d.rotation.z=t3*.4;dot17(o.x,Y+.2,o.y,2.2,'#ffd84a',.35*a);return}
    if(k==='god'){const P=o.P;if(!ok(P))return;if(o.st==='beam'){const a=Math.min(1,o.t*2),p=o.t/CF34().god.beam;beam17(V(P.x,P.y,30),V(P.x,P.y,0),'#9a40ff',.95+.1*Math.sin(t3*10),.28*a);beam17(V(P.x,P.y,30),V(P.x,P.y,0),'#e0b8ff',.2,.55*a);
        for(let i=0;i<3;i++){const kk=((t3*.6+i/3)%1);tor17(P.x,kk*6,P.y,1.6+.4*Math.sin(t3*3+i),'#d27dff',.7*(1-kk)*a)}if(Math.random()<.6)spark(P.x+rand(-1,1),rand(0,4),P.y+rand(-1,1),0,rand(1,3),0,'#e0b0ff',.8,.3);
        tor17(P.x,.12,P.y,2.2,'#b060ff',.5*a);const n=Math.round(24*p);for(let i=0;i<n;i++){const an=-Math.PI/2+i/24*TAU;dot17(P.x+Math.cos(an)*2.5,.2,P.y+Math.sin(an)*2.5,.3,'#e0b0ff',.8)}}return}
    if(k==='frag'){const e=o.e;if(!ok(e))return;const R=(e.size||2)*.45+.5,ey=Y+(e.lift||0)*1.3;o.F.forEach(f=>{const m=S.ROCK.get();let x,y,z;
        if(f.st){const th=f.th+(o.st==='lock'?t3*.3:t3*1.2),ph=f.ph;x=e.x+Math.sin(ph)*Math.cos(th)*R;y=ey+Math.cos(ph)*R*.8;z=e.y+Math.sin(ph)*Math.sin(th)*R}else{x=f.x;y=f.h+.5;z=f.y;if(Math.random()<.15)spark(x,y,z,0,0,0,'#ffb060',.3,.25)}
        if(o.st==='boom')return;m.position.set(x,y,z);m.rotation.set(t3*2+f.i,t3*1.5+f.i*2,0);m.scale.setScalar(f.s*4);m.material.emissiveIntensity=o.st==='lock'?1.2+.8*Math.sin(t3*16):.4});
      if(o.st==='lock')dot17(e.x,ey,e.y,R*2.6,'#ff9a3a',.35+.15*Math.sin(t3*16));return}
    if(k==='bsh'){return}
    if(k==='ring'){const C=CF34().ring,a=Math.min(1,o.t*3,(o.max-o.t)*2);[o.A,o.B].forEach((p,j)=>{const r=S.RINGG.get();r.position.set(p.x,C.rad+.3,p.y);r.rotation.set(0,-o.a+Math.PI/2,0);r.scale.setScalar(C.rad*a+.01);
        const s=S.SWIRL.get();s.position.copy(r.position);s.rotation.set(0,-o.a+Math.PI/2,(j?-1:1)*t3*3);s.scale.setScalar(C.rad*.95*a+.01);s.material.opacity=.75*a;dot17(p.x,C.rad+.3,p.y,C.rad*2.4,'#ffd24a',.35*a);
        for(let i=0;i<3;i++){const an=t3*2+i*2.1+j;spark(p.x+Math.cos(an)*C.rad*.2,C.rad+.3+Math.sin(an)*C.rad,p.y,0,.2,0,'#ffe27a',.4,.25)}});
      const n=10;for(let i=0;i<n;i++){const f=((i/n+t3*.25)%1);dot17(o.A.x+(o.B.x-o.A.x)*f,C.rad+.3,o.A.y+(o.B.y-o.A.y)*f,.35,'#ffe27a',.35*a)}return}});
  /* tia, vệt đạn, nổ */
  Z.fx.forEach(f=>{const a=f.t/f.max;
    if(f.k==='trc'){beam17(V(f.x1,f.y1,(f.h1||0)+.6),V(f.x2,f.y2,f.h2?f.h2+.6:Y),f.c,f.w*1.6,.9*a);dot17(f.x2,Y,f.y2,.6,f.c,.7*a);return}
    if(f.k==='big'){const A=V(f.x1,f.y1,f.h1+.6),E=V(f.x2,f.y2,Y);beam17(A,E,'#ff5a3a',.5*a+.1,.9*a);beam17(A,E,'#ffe0c0',.15,a);dot17(E.x,E.y,E.z,2.5*a+.5,'#ff7a4a',.8*a);if(!f.s3){f.s3=1;boom(E.x,E.y,E.z,.8,false)}return}
    if(f.k==='boom'){if(!f.s3){f.s3=1;boom(f.x,.8,f.y,Math.max(.4,f.r*.5),/7fd0ff|ffe0a0/.test(f.c))}tor17(f.x,.15,f.y,f.r*(1.2-a*.6),f.c,a);return}
    if(f.k==='land'){if(!f.s3){f.s3=1;boom(f.x,.6,f.y,1,false)}tor17(f.x,.12,f.y,2.6*(1-a)+.3,'#ffb060',a);return}
    if(f.k==='spark'){dot17(f.x,Y+.2,f.y,1.2*a+.3,f.c,a);return}
    if(f.k==='zz'){if(!f.s3){f.s3=1;boom(f.x,(f.h||1)+.6,f.y,.5,true)}for(let i=0;i<2;i++)zap17(V(f.x,f.y,(f.h||1)+.6),V(f.x+rand(-1,1),f.y+rand(-1,1),(f.h||1)+rand(0,1)),'#cfe6ff',a,i*5,.3,.05);return}
    if(f.k==='dlz'){const A=V(f.x1,f.y1,Y+.2),E=V(f.x2,f.y2,Y+.2);beam17(A,E,'#ff4a4a',.18,a);beam17(A,E,'#ffe0a0',.05,a);return}
    if(f.k==='warp'){dot17(f.x,1.8,f.y,2.5*a,'#ffd24a',a);dot17(f.x2,1.8,f.y2,2.5*a,'#ffe27a',a);return}});
  /* trạng thái trên tàu: dấu đỏ, khiên, miễn thương, hóa thần, cháy, bị nhốt */
  const mk=G.c34mk&&G.c34mk.e&&!G.c34mk.e.dead&&G.t<G.c34mk.until?G.c34mk.e:null;
  if(mk){const r=(mk.size||2)*.55+.4,y=Y+(mk.lift||0)*1.3;tor17(mk.x,y,mk.y,r,'#ff2a2a',.9);tor17(mk.x,y,mk.y,r*1.35,'#ff4a4a',.5);for(let i=0;i<4;i++){const an=i*Math.PI/2+t3;beam17(V(mk.x+Math.cos(an)*r*.8,mk.y+Math.sin(an)*r*.8,y),V(mk.x+Math.cos(an)*r*1.6,mk.y+Math.sin(an)*r*1.6,y),'#ff3030',.05,.9)}
    beam17(V(mk.x,mk.y,y+.4),V(mk.x,mk.y,y+3),'#ff3030',.03,.5);dot17(mk.x,y+3,mk.y,.6,'#ff3030',.9)}
  [G.pl].concat(G.al||[],G.en||[]).forEach(u=>{if(!ok(u))return;const r=(u.size||2)*.5,y=Y+(u.lift||0)*1.3;
    if(u.c34sh>0){const d=S.DOME.get(),f=Math.min(1,u.c34sh/Math.max(1,u.c34shm||u.c34sh)),R=r*1.6+.4;d.position.set(u.x,y,u.y);d.scale.setScalar(R);d.material.color.set(0x5fc0ff);d.material.opacity=.22+.25*f;d.material.map.offset.x=t3*.05;d.rotation.y=t3*.2}
    if(u.c34inv>G.t)dot17(u.x,y,u.y,r*3,'#ffe27a',.5+.2*Math.sin(t3*30));
    if(u.c34gb>G.t){tor17(u.x,.12,u.y,r*1.4+.2*Math.sin(t3*4),'#d27dff',.8);dot17(u.x,y,u.y,r*2.4,'#c070ff',.3);if(Math.random()<.3)spark(u.x+rand(-r,r),y,u.y+rand(-r,r),0,1.6,0,'#e0b0ff',.6,.25)}
    if(u.c34burn&&Math.random()<.6){spark(u.x+rand(-r,r)*.6,y+.2,u.y+rand(-r,r)*.6,rand(-.3,.3),rand(1,2.4),rand(-.3,.3),Math.random()<.5?'#ff6a10':'#ffc040',.45,.3);if(Math.random()<.2)smoke(u.x,y+.4,u.y,.6,.35)}});
  S.B.end();S.DOT.end();S.TOR.end();S.CONE.end();S.BAR.end();S.HEXP.end();S.SHC.end();S.DOME.end();S.WALLC.end();S.DISC.end();S.SWIRL.end();S.RINGG.end();S.ROCK.end();S.SEG.end();S.SEGD.end();S.JOINT.end();S.ABASE.end();S.CLAW.end();
  ['FTR','MN','SKY','SHD','BMB','COL','MK','GOLD','RES','HEAL','CAGE','PUR','DEM','TUR','MINE','BOMB','PANEL'].forEach(k=>S[k].end())}
function CF34(){return (window.C34&&C34.CF)||{}}

function sk16Init(){if(SK16)return SK16;skInit();const AD=SK.AD,beamG=new T.CylinderGeometry(1,1,1,8,1,true),torus=new T.TorusGeometry(1,.02,8,72);torus.rotateX(Math.PI/2);
  const disk=new T.CircleGeometry(1,48);disk.rotateX(-Math.PI/2);const wallG=new T.CylinderGeometry(1,1,1,48,1,true);wallG.translate(0,.5,0);
  const steel=new T.MeshStandardMaterial({color:lin(0x2b4a86),metalness:.8,roughness:.35}),trim=new T.MeshStandardMaterial({color:lin(0x9fe8ff),emissive:lin(0x4fd6ff),emissiveIntensity:1.2}),gm=new T.MeshStandardMaterial({color:lin(0x3c4656),metalness:.92,roughness:.3});
  const wood=new T.MeshStandardMaterial({color:lin(0x8a4a12),roughness:.7}),gold=new T.MeshStandardMaterial({color:lin(0xffcf3a),metalness:.9,roughness:.25,emissive:lin(0x6a4a00),emissiveIntensity:.5});
  const shard=new T.OctahedronGeometry(.5,0);shard.scale(.7,1.4,.5);const shardM=new T.MeshStandardMaterial({color:lin(0x1a1030),metalness:.6,roughness:.25,emissive:lin(0x3a1a7a),emissiveIntensity:.5,flatShading:true});
  const tx=(f)=>{const c=document.createElement('canvas');c.width=c.height=128;f(c.getContext('2d'));const t=new T.CanvasTexture(c);return t};
  const noT=tx(x=>{x.strokeStyle='#ff4a4a';x.lineWidth=14;x.shadowColor='#ff2020';x.shadowBlur=12;x.beginPath();x.arc(64,64,44,0,7);x.moveTo(33,95);x.lineTo(95,33);x.stroke()});
  const warnT=tx(x=>{x.fillStyle='#d01818';x.strokeStyle='#ffd0d0';x.lineWidth=6;x.beginPath();x.moveTo(64,10);x.lineTo(120,112);x.lineTo(8,112);x.closePath();x.fill();x.stroke();x.fillStyle='#fff';x.font='bold 74px sans-serif';x.textAlign='center';x.fillText('!',64,104)});
  const errT=tx(x=>{x.fillStyle='#e0c8ff';x.font='bold 80px sans-serif';x.textAlign='center';x.shadowColor='#b070ff';x.shadowBlur=14;x.fillText('!?',64,92)});
  const digT=tx(x=>{x.fillStyle='#29ff6a';x.font='bold 96px monospace';x.textAlign='center';x.shadowColor='#29ff6a';x.shadowBlur=12;x.fillText('1',40,100);x.fillText('0',92,80)});
  const sp=(map)=>Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map,transparent:true,depthWrite:false,toneMapped:false}));scene.add(s);return s});
  SK16={B:Pool(()=>{const g=new T.Group(),a=new T.Mesh(beamG,AD(0xffffff,.5)),b=new T.Mesh(beamG,AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
    DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),
    TOR:Pool(()=>{const m=new T.Mesh(torus,AD(0xffffff,1));scene.add(m);return m}),
    DISK:Pool(()=>{const m=new T.Mesh(disk,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.renderOrder=2;scene.add(m);return m}),
    WALL:Pool(()=>{const m=new T.Mesh(wallG,new T.MeshBasicMaterial({map:SK.wall,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false,fog:false}));m.frustumCulled=false;scene.add(m);return m}),
    BALL:Pool(()=>{const m=new T.Mesh(SHG,AD(0xffffff,1));scene.add(m);return m}),
    DARK:Pool(()=>{const m=new T.Mesh(SHG,new T.MeshBasicMaterial({color:0x020008}));scene.add(m);return m}),
    SHARD:Pool(()=>{const m=new T.Mesh(shard,shardM);m.castShadow=true;scene.add(m);return m}),
    NET:Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,16,8,0,TAU,0,Math.PI/2),new T.MeshBasicMaterial({color:0xffd84a,wireframe:true,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));scene.add(m);return m}),
    CLOUD:Pool(()=>{const m=new T.Mesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:lin(0xdedcf0),transparent:true,opacity:.5,roughness:1,flatShading:true,emissive:lin(0x5a5878),emissiveIntensity:.5,depthWrite:false}));scene.add(m);return m}),
    BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s}),
    NO:sp(noT),WARN:sp(warnT),ERR:sp(errT),DIG:sp(digT),
    /* thanh kiếm năng lượng: lưỡi thon phát sáng + chuôi */
    /* Kiếm Năng Lượng theo ảnh kỹ năng: chuôi cơ khí sẫm màu, chắn tay nhiều gai, lưỡi thép sẫm có răng cưa + viền xanh phát sáng, mũi giáo có ngạnh, rãnh năng lượng giữa lưỡi */
    SWD:Pool(()=>{const g=new T.Group(),blade=new T.Group(),R=[[.14,0],[.14,.2],[.18,.245],[.12,.29],[.12,.47],[.155,.515],[.1,.56],[.1,.79],[.21,.83],[.075,.88],[0,1]],sh=new T.Shape();sh.moveTo(-R[0][0],0);R.forEach(p=>sh.lineTo(p[0],p[1]));for(let i=R.length-2;i>=0;i--)sh.lineTo(-R[i][0],R[i][1]);
      const core=new T.ExtrudeGeometry(sh,{depth:.06,bevelEnabled:true,bevelThickness:.025,bevelSize:.012,bevelSegments:1,curveSegments:1});core.translate(0,0,-.03);
      const steel=new T.MeshStandardMaterial({color:lin(0x1c2a44),metalness:.9,roughness:.22,emissive:lin(0x0a2a6a),emissiveIntensity:.6,transparent:true}),glowM=new T.MeshBasicMaterial({color:0x4fd8ff,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide});
      const c=new T.Mesh(core,steel),edge=new T.Mesh(new T.ShapeGeometry(sh),glowM);edge.scale.set(1.35,1.03,1);const edge2=edge.clone();edge2.rotation.y=Math.PI/2;edge2.scale.set(.5,1.03,1);
      const rune=new T.Mesh(new T.BoxGeometry(.035,.72,.1),new T.MeshBasicMaterial({color:0xcff6ff,transparent:true,toneMapped:false}));rune.position.y=.42;c.castShadow=true;blade.add(edge,edge2,c,rune);
      const hm=new T.MeshStandardMaterial({color:lin(0x141a26),metalness:.85,roughness:.35,transparent:true}),tm=new T.MeshStandardMaterial({color:lin(0x2a6bd8),metalness:.8,roughness:.3,emissive:lin(0x1a4aff),emissiveIntensity:.5,transparent:true});
      const grip=new T.Mesh(new T.CylinderGeometry(.06,.07,.62,10),hm);grip.position.y=-.33;const pom=new T.Mesh(new T.OctahedronGeometry(.12,0),tm);pom.position.y=-.68;pom.scale.y=1.6;
      const guard=new T.Mesh(new T.BoxGeometry(.62,.1,.16),hm);guard.position.y=-.02;const gc=new T.Mesh(new T.OctahedronGeometry(.1,0),new T.MeshBasicMaterial({color:0x8fe8ff,toneMapped:false}));gc.position.set(0,-.02,.07);g.add(grip,pom,guard,gc);
      [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sy])=>{const sp=new T.Mesh(new T.ConeGeometry(.045,.32,5),tm);sp.position.set(sx*.3,-.02+sy*.08,0);sp.rotation.z=-sx*(sy>0?.7:2.3);g.add(sp)});
      g.add(blade);const gl=new T.Sprite(ADDM(glowT()));gl.material.color.set(0x4fd8ff);g.add(gl);g.userData={blade,steel,glowM,rune,hm,tm,gl};scene.add(g);return g}),
    /* trụ phòng thủ: bệ vuông + đầu tháp xoay + nòng thép */
    TU:Pool(()=>{const g=new T.Group(),b=new T.Mesh(new T.BoxGeometry(1,.45,1),steel),b2=new T.Mesh(new T.BoxGeometry(.86,.06,.86),trim),hd=new T.Group(),c=new T.Mesh(new T.CylinderGeometry(.3,.33,.3,24),steel),br1=new T.Mesh(new T.CylinderGeometry(.045,.055,.6,12),gm),br2=br1.clone(),core=new T.Mesh(new T.SphereGeometry(.1,12,8),trim);
      b.position.y=.225;b2.position.y=.46;c.position.y=.15;[br1,br2].forEach((m,i)=>{m.rotation.x=Math.PI/2;m.position.set(i?.07:-.07,.18,-.42)});core.position.y=.34;b.castShadow=c.castShadow=true;hd.position.y=.49;hd.add(c,br1,br2,core);g.add(b,b2,hd);g.userData={hd,b};scene.add(g);return g}),
    CHEST:Pool(()=>{const g=new T.Group(),b=new T.Mesh(new T.BoxGeometry(1,.55,.7),wood),lid=new T.Mesh(new T.CylinderGeometry(.35,.35,1,16,1,false,0,Math.PI),wood),band=new T.Mesh(new T.BoxGeometry(1.02,.08,.72),gold),band2=new T.Mesh(new T.BoxGeometry(.14,.6,.72),gold),lock=new T.Mesh(new T.SphereGeometry(.08,10,8),gold);
      b.position.y=.275;lid.rotation.z=Math.PI/2;lid.rotation.y=Math.PI/2;lid.position.y=.55;band.position.y=.5;band2.position.y=.28;lock.position.set(0,.45,.37);b.castShadow=lid.castShadow=true;g.add(b,lid,band,band2,lock);scene.add(g);return g}),
    DRN:Pool(()=>{const g=new T.Group(),bd=new T.Mesh(new T.ConeGeometry(.16,.55,4),new T.MeshStandardMaterial({color:lin(0xcfe9ff),metalness:.7,roughness:.3})),w=new T.Mesh(new T.BoxGeometry(.6,.03,.18),new T.MeshStandardMaterial({color:lin(0x2a6aa8),metalness:.6,roughness:.4})),en=new T.Sprite(ADDM(glowT()));
      bd.rotation.x=-Math.PI/2;w.position.z=.08;en.material.color.set(0x62e0ff);en.scale.setScalar(.35);en.position.z=.3;g.add(bd,w,en);scene.add(g);return g}),
    HG:Pool(()=>{const g=new T.Group(),m=new T.MeshStandardMaterial({color:lin(0xffe2a0),emissive:lin(0xffb030),emissiveIntensity:.8,transparent:true,opacity:.85}),c1=new T.Mesh(new T.ConeGeometry(.22,.3,12),m),c2=c1.clone(),f=new T.MeshStandardMaterial({color:lin(0x8a5a20),metalness:.6}),t1=new T.Mesh(new T.CylinderGeometry(.26,.26,.04,12),f),t2=t1.clone();
      c1.position.y=.15;c1.rotation.x=Math.PI;c2.position.y=-.15;t1.position.y=.32;t2.position.y=-.32;g.add(c1,c2,t1,t2);scene.add(g);return g})};
  return SK16}
function beam16(a,b,c,w,o){const g=SK16.B.get(),U=g.userData,d=b.clone().sub(a),L=d.length()||.01;g.position.copy(a).addScaledVector(d,.5);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.multiplyScalar(1/L));U.a.scale.set(w,L,w);U.b.scale.set(w*.32,L,w*.32);U.a.material.color.copy(col(c));U.b.material.color.copy(col(c)).lerp(WH3,.6);U.a.material.opacity=o*.6;U.b.material.opacity=o}
function zap16(a,b,c,o,sd,amp,w){amp=amp||.3;const n=9,d=b.clone().sub(a),L=d.length()||.01,nx=-d.z/L,nz=d.x/L;let p0=a.clone();for(let i=1;i<=n;i++){const f=i/n,off=i<n?Math.sin(t3*55+i*3+sd)*amp:0,up=i<n?Math.cos(t3*47+i*5+sd)*amp:0,p1=a.clone().addScaledVector(d,f).add(new T.Vector3(nx*off,up,nz*off));beam16(p0,p1,c,w||.06,o);p0=p1}}
function dot16(x,y,z,s,c,o){const d=SK16.DOT.get();d.position.set(x,y,z);d.scale.setScalar(s);d.material.color.copy(col(c));d.material.opacity=o;return d}
function tor16(x,y,z,r,c,o){const t=SK16.TOR.get();t.position.set(x,y,z);t.scale.setScalar(Math.max(.01,r));t.rotation.set(0,0,0);t.material.color.copy(col(c));t.material.opacity=o;return t}
function disk16(x,y,z,r,c,o){const d=SK16.DISK.get();d.position.set(x,y,z);d.scale.setScalar(Math.max(.01,r));d.material.color.copy(col(c));d.material.opacity=o;return d}
function wall16(x,z,r,h,c,o){const w=SK16.WALL.get();w.position.set(x,0,z);w.scale.set(Math.max(.01,r),h,Math.max(.01,r));w.material.color.copy(col(c));w.material.opacity=o;return w}
function dash16(x,z,y,R,c,o,n,rot,w){n=n||24;for(let i=0;i<n;i++){const a0=i/n*TAU+(rot||0),a1=a0+TAU/n*.55;beam16(new T.Vector3(x+Math.cos(a0)*R,y,z+Math.sin(a0)*R),new T.Vector3(x+Math.cos(a1)*R,y,z+Math.sin(a1)*R),c,w||.05,o)}}
function bar16(x,y,z,w,f,c){const bg=SK16.BAR.get();bg.position.set(x-w/2,y,z);bg.scale.set(w,.12,1);bg.material.color.set(0x101820);bg.material.opacity=.8;if(f<=0)return;const s=SK16.BAR.get();s.position.set(x-w/2,y,z);s.scale.set(Math.max(.001,w*Math.min(1,f)),.12,1);s.material.color.copy(col(c));s.material.opacity=1}
function spr16(pool,x,y,z,s,o){const p=pool.get();p.position.set(x,y,z);p.scale.setScalar(s);p.material.opacity=o;return p}
function skill3d16(G,dt){sk16Init();const S=SK16,Y=HOV,V3a=(x,z,y)=>new T.Vector3(x,y==null?Y:y,z),ok=e=>e&&!e.dead,C=G.csk,X=C&&C.vf&&C.vf.x2;
  /* tàu địch xuất hiện: cổng sáng xanh dựng đứng + cột sáng + vòng lan */
  (G.en||[]).forEach(e=>{if(e.spawn==null||e.spawn>G.t||WARP.has(e))return;WARP.add(e);if(G.t-e.spawn<1.2)WFX.push({x:e.x,y:e.y,e,t0:t3,boss:!!e.boss})});
  for(let i=WFX.length-1;i>=0;i--){const w=WFX[i],k=(t3-w.t0)/.9;if(k>=1){WFX.splice(i,1);continue}const R=(w.boss?3.2:1.5)*(.4+k),f=1-k,x=w.e&&!w.e.dead?w.e.x:w.x,z=w.e&&!w.e.dead?w.e.y:w.y;
    const t=tor16(x,Y,z,R,w.boss?'#ff5a6a':'#6ad8ff',f);t.rotation.set(Math.PI/2,0,t3*3);tor16(x,.12,z,R*1.3,w.boss?'#ff8a8a':'#bfeaff',.7*f);beam16(V3a(x,z,0),V3a(x,z,6),w.boss?'#ff5a6a':'#6ad8ff',.28*f+.03,.5*f);dot16(x,Y,z,R*2.2,'#9fe8ff',.6*f)}
  /* biểu tượng choáng 3D: 3 ngôi sao vàng quay trên đầu tàu địch */
  (G.en||[]).forEach(e=>{if(!ok(e)||!(e.stun>0)||(e.spawn!=null&&e.spawn>G.t))return;const r=(e.size||2)*.35,y=Y+(e.size||2)*.45+.4;for(let i=0;i<3;i++){const a=t3*4+i*2.09;dot16(e.x+Math.cos(a)*r,y,e.y+Math.sin(a)*r,.35,'#ffe066',.95)}});
  if(X&&X.c5)X.c5.forEach(o=>{if(o.dl>0||!o.k)return;const k=o.k,a=o.max?Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.1+.2)):1;
    /* Khiên Phản Đạn: vòm đỏ phản đạn, chớp trắng nơi đạn dội lại */
    if(k==='rsh'){const P=o.P;if(!ok(P))return;const R=o.R,f=Math.max(0,Math.min(1,(o.max-o.age)/.4,o.age/.15));wall16(P.x,P.y,R,1.4,'#ff6a6a',.55*f);disk16(P.x,.06,P.y,R,'#ff5050',.12*f);tor16(P.x,.12,P.y,R,'#ff6a6a',.9*f);dash16(P.x,P.y,1.4,R*.98,'#ffd0d0',.6*f,24,t3*1.2,.04);
      (o.fl||[]).forEach(r=>{const fa=Math.max(0,r.t/.3);for(let j=-2;j<=2;j++){const an=r.a+j*.09;beam16(V3a(P.x+Math.cos(an)*R,P.y+Math.sin(an)*R,.1),V3a(P.x+Math.cos(an)*R,P.y+Math.sin(an)*R,1.4),'#ffffff',.06,fa)}})}
    /* Tín Hiệu Lỗi: luồng nhiễu tím hình nón lan ra, kẻ trúng bị lỗi (!? lơ lửng, vạch nhiễu) */
    else if(k==='cone'){const L=o.len;if(L<=.05)return;const f=Math.min(1,o.age/.25)*Math.max(0,Math.min(1,(o.max-o.age)/.5)),ca=Math.cos(o.a),sa=Math.sin(o.a),hw=d=>(1+8*d/o.L)/2;
      for(let i=0;i<6;i++){const d=((t3*2.2+i/6)%1)*L,w=hw(d),cx=o.x+ca*d,cz=o.y+sa*d;beam16(V3a(cx-sa*w,cz+ca*w,.35),V3a(cx+sa*w,cz-ca*w,.35),'#b070ff',.07,(1-d/L)*.8*f);beam16(V3a(cx,cz,.1),V3a(cx,cz,.1+1.2*(1-d/L)),'#5a20b0',.05,.5*f)}
      [[-1],[1]].forEach(([sg])=>beam16(V3a(o.x-sa*hw(0)*sg,o.y+ca*hw(0)*sg,.3),V3a(o.x+ca*L-sa*hw(L)*sg,o.y+sa*L+ca*hw(L)*sg,.3),'#7a3cc8',.06,.8*f));
      const gs=Math.floor(t3*14);for(let i=0;i<7;i++){const d=(((gs*37+i*53)%100)/100)*L,w=hw(d),yy=(((gs*17+i*29)%100)/100*2-1)*w;dot16(o.x+ca*d-sa*yy,.5,o.y+sa*d+ca*yy,.4,i%2?'#ff4ad0':'#5ad0ff',.7*f)}}
    else if(k==='err'){const e=o.e;if(!ok(e))return;const r=(e.size||2)*.35;dash16(e.x,e.y,Y,r*1.2,'#b070ff',.8*a,14,t3*2,.04);spr16(S.ERR,e.x,Y+r+.9+.1*Math.sin(t3*20),e.y,.9,a);
      const gs=Math.floor(t3*14);for(let i=0;i<3;i++){const yy=Y-r+(((gs*37+i*53)%100)/100)*r*2;beam16(V3a(e.x-r,e.y,yy),V3a(e.x+r*.6,e.y,yy),'#b464ff',.03,.6*a)}}
    /* Vụ Nổ Hư Không (theo ảnh kỹ năng): lõi hư không đen, mảnh tinh thể đen bị hút xoáy vào, sét tím toả tia; rồi vỡ tung thành mảnh tinh thể văng ra kèm sét */
    else if(k==='void'){const x=o.x,z=o.y,R=o.R||2.5,Rp=o.Rp||10,pre=o.age<3,f=pre?Math.min(1,o.age/.5):Math.max(0,1-(o.age-3)/.7),y=Y*.9;
      const core=S.DARK.get();core.position.set(x,y,z);core.scale.setScalar(pre?R*.55*(1+.05*Math.sin(t3*9)):R*.55*f+.01);dot16(x,y,z,R*3.4*(pre?1:1+(1-f)*2),'#6a2cff',.65*f);dot16(x,y,z,R*1.4,'#c8a0ff',.5*f);
      dash16(x,z,.12,Rp*(1-(o.age%1)*.25),'#8a50ff',.35*f,32,t3,.05);disk16(x,.06,z,Rp,'#3a1080',.12*f);
      const n=14;for(let i=0;i<n;i++){const s=S.SHARD.get(),a0=i/n*TAU+i*.7;let r,h;if(pre){const u=(o.age/3+i*.071)%1;r=R*.7+(Rp*.55)*(1-u);h=y+Math.sin(i*1.7+t3)*1.2*(1-u);s.position.set(x+Math.cos(a0-o.age*1.5*(1+u))*r,h,z+Math.sin(a0-o.age*1.5*(1+u))*r)}
        else{const u=Math.min(1,(o.age-3)/.6);r=R*.6+u*R*4.5;h=y+Math.sin(i*2.3)*u*2.2;s.position.set(x+Math.cos(a0)*r,h,z+Math.sin(a0)*r)}s.rotation.set(t3*2+i,t3*1.3+i*2,0);s.scale.setScalar((.8+.5*((i*7)%5)/5)*(pre?1:f+.2));s.visible=f>.03}
      const nb=pre?5:9;for(let i=0;i<nb;i++){const an=i/nb*TAU+Math.floor(t3*8)*.6,L=pre?R*1.2+Rp*.25*Math.abs(Math.sin(t3*3+i)):R*(2+5*(1-f));zap16(V3a(x,z,y),V3a(x+Math.cos(an)*L,z+Math.sin(an)*L,y+Math.sin(i+t3)*1.2),i%2?'#e0c0ff':'#9a50ff',(pre?.75:f),i*7,pre?.25:.4,.06)}
      if(!pre&&f>0){tor16(x,y,z,R*2+(1-f)*Rp*.6,'#e0c0ff',f);tor16(x,.15,z,R*2.5+(1-f)*Rp,'#8a50ff',f*.7)}}});
  /* c26: Trụ Phòng Thủ + đạn, Kiếm Năng Lượng */
  (G.c26tu||[]).forEach(t=>{const g=S.TU.get(),U=g.userData,a=t.gone?Math.max(0,1-(t.dt||0)/.4):1,k=.6+.4*(t.rise==null?1:t.rise),sz=3;g.position.set(t.x,0,t.y);g.scale.set(sz*.62*k,sz*.62*k*a,sz*.62*k);U.hd.rotation.y=-((t.ang||0)+Math.PI/2);U.b.material.emissive=U.b.material.emissive||new T.Color();
    if(t.fl>0)dot16(t.x+Math.cos(t.ang||0)*1.2,1,t.y+Math.sin(t.ang||0)*1.2,.9,'#9fe8ff',.9);
    if(!t.gone){bar16(t.x,2.4,t.y,2.6,t.hp/t.max,'#5dff9a');dash16(t.x,t.y,.1,4,'#6fd8ff',.25,28,t3*.3,.04);const rem=Math.max(0,t.t/t.life),n=Math.max(1,Math.round(30*rem));for(let i=0;i<n;i++){const an=-Math.PI/2+i/30*TAU;dot16(t.x+Math.cos(an)*1.3,.2,t.y+Math.sin(an)*1.3,.25,'#9fe8ff',.7)}}});
  (G.c26b||[]).forEach(b=>{dot16(b.x,Y,b.y,.7,'#4fc8ff',.9);dot16(b.x,Y,b.y,.25,'#ffffff',1)});
  (G.c26fx||[]).forEach(f=>{if(f.k!=='sw')return;const P=f.P;if(!P)return;const t=f.t,len=f.len*(t<.35?t/.35:1),D=new T.Vector3(Math.cos(f.a),0,Math.sin(f.a));let th=0,al=1;
    if(t<.5)th=0;else if(t<.68){const u=(t-.5)/.18;th=Math.PI/2*u*u}else{th=Math.PI/2;al=Math.max(0,1-(t-.68)/.52)}
    const dir=new T.Vector3(0,1,0).multiplyScalar(Math.cos(th)).addScaledVector(D,Math.sin(th)).normalize(),g=S.SWD.get(),U=g.userData;g.position.set(P.x,Y,P.y);g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir);
    const W=Math.max(1.2,f.len*.19),bl=Math.max(.05,len);U.blade.scale.set(W,bl,W);U.blade.position.y=.05;[U.steel,U.rune.material,U.hm,U.tm].forEach(m=>m.opacity=al);U.glowM.opacity=(.45+.2*Math.sin(t3*20))*al;U.gl.position.y=bl*.5;U.gl.scale.setScalar(bl*.9+1);U.gl.material.opacity=.35*al;g.scale.setScalar(1.3);
    for(let i=0;i<2;i++){if(Math.random()<.6){const u1=Math.random(),u2=Math.min(1,u1+.15+Math.random()*.2),side=new T.Vector3(-dir.z,0,dir.x).multiplyScalar(W*.28*(Math.random()<.5?-1:1)),p1=new T.Vector3(P.x,Y,P.y).addScaledVector(dir,bl*1.3*u1).add(side),p2=new T.Vector3(P.x,Y,P.y).addScaledVector(dir,bl*1.3*u2).addScaledVector(side,-.5);zap16(p1,p2,'#bff3ff',.9*al,i*9+t3,.12,.04)}}
    if(Math.random()<.5){const u=Math.random()*bl*1.3;spark(P.x+dir.x*u,Y+dir.y*u,P.y+dir.z*u,rand(-1,1),rand(-.5,1),rand(-1,1),'#8fe8ff',.35,.25)}
    if(t>=.5){const steps=12,th1=t<.68?th:Math.PI/2;for(let i=0;i<=steps;i++){const q=th1*i/steps,dd=new T.Vector3(0,1,0).multiplyScalar(Math.cos(q)).addScaledVector(D,Math.sin(q));dot16(P.x+dd.x*len*.85,Y+dd.y*len*.85,P.y+dd.z*len*.85,1.1,'#6fd8ff',.35*al)}}
    if(t>=.68&&t<.95){const kk=(t-.68)/.27,ex=P.x+D.x*len*.55,ez=P.y+D.z*len*.55;tor16(ex,.2,ez,1+kk*3,'#bff3ff',1-kk);dot16(ex,.4,ez,3*(1-kk),'#4fd8ff',.8*(1-kk))}});
  /* c28 */
  const Z=G.c28;if(Z){const T2=G.t;
    (Z.o||[]).forEach(o=>{const k=o.k;
      if(k==='rz'){const R=7,al=Math.max(0,Math.min(1,o.t/.25,(o.max-o.t)/.35));disk16(o.x,.06,o.y,R,'#ff2828',.2*al);wall16(o.x,o.y,R,1.6,'#ff3b3b',.55*al);dash16(o.x,o.y,.15,R,'#ff3b3b',.9*al,30,t3*.4,.06);spr16(S.NO,o.x,2.2+.1*Math.sin(t3*3),o.y,1.6,.9*al)}
      else if(k==='gn'){const R=15,al=o.t<o.max?Math.min(1,o.t/.3):Math.max(0,1-(o.t-o.max)/.7),n=S.NET.get();n.position.set(o.x,0,o.y);n.scale.set(R,R*.5,R);n.rotation.y=t3*.15;n.material.opacity=.45*al;tor16(o.x,.1,o.y,R,'#ffd75a',.8*al);
        if(o.t<o.max){const rem=1-o.t/o.max,m=Math.max(1,Math.round(48*rem));for(let i=0;i<m;i++){const an=-Math.PI/2+i/48*TAU;dot16(o.x+Math.cos(an)*(R+.5),.3,o.y+Math.sin(an)*(R+.5),.4,'#fff1b0',.8*al)}}}
      else if(k==='lift'){const e=o.e;if(!ok(e))return;const r=(e.size||2)*.45;for(let i=0;i<3;i++){const kk=((t3*1.2+i/3)%1);tor16(e.x,.2+kk*(Y+(e.lift||0)*1.3),e.y,r*(1.2-kk*.4),'#8fd0ff',.7*(1-kk))}beam16(V3a(e.x,e.y,0),V3a(e.x,e.y,Y+(e.lift||0)*1.3),'#6fb8ff',r*.8,.18)}
      else if(k==='agw'){const kk=o.t/o.max;tor16(o.x,.2,o.y,6*kk+.05,'#9fd8ff',1-kk);wall16(o.x,o.y,6*kk+.05,1.2*(1-kk)+.1,'#7fc8ff',.5*(1-kk));dash16(o.x,o.y,.12,6,'#9fd8ff',.5*(1-kk),24,0,.04)}
      else if(k==='hg'){[o.u,o.cl].forEach((w,j)=>{if(!ok(w))return;const r=(w.size||2)*.4,fa=Math.max(0,.75*Math.min(1,(o.max-o.t)/.4,o.t/.2));for(let i=0;i<3;i++){const t=tor16(w.x,Y,w.y,r*(1+.22*i)+Math.sin(t3*5+i*2)*.08,j?'#ffd27a':'#ffe9b0',fa);t.rotation.set(.3*Math.sin(t3+i),0,.3*Math.cos(t3*1.3+i))}
        if(!j){const h=S.HG.get();h.position.set(w.x,Y+r+1.1,w.y);h.rotation.set(0,0,Math.sin(t3*2)*.3);h.scale.setScalar(1.6)}})}
      else if(k==='sa'){const P=o.P,beam=.45;if(o.t<beam+.15&&ok(P)){const al=Math.min(1,(beam+.15-o.t)/.2);beam16(V3a(P.x,P.y),V3a(o.x,o.y),'#3cffc8',.35,.7*al);beam16(V3a(P.x,P.y),V3a(o.x,o.y),'#e8fffa',.1,al)}
        if(o.t>=beam){const kk=o.t-beam;if(kk<.35)dot16(o.x,Y,o.y,4.8*(1-kk/.35)+.5,'#50ffd2',1-kk/.35);for(let i=0;i<4;i++){const r=(kk-i*.32)*18;if(r<0||r>10)continue;const al=Math.max(0,1-r/10);wall16(o.x,o.y,Math.max(.05,r),1.1,'#78ffdc',.6*al);tor16(o.x,.6,o.y,Math.max(.05,r),'#c8fff0',al)}}}
      else if(k==='rbx'){const kk=o.t/o.max,R=9,b=S.BALL.get();b.position.set(o.x,0,o.y);const rr=R*Math.min(1,kk*2.2);b.scale.set(rr,rr*.5,rr);b.material.color.set(0xff3030);b.material.opacity=Math.max(0,1-kk)*.35;
        const r2=R*Math.min(1,kk*1.6);for(let i=0;i<8;i++){const a0=i/8*TAU+kk,a1=a0+Math.PI/8*1.4;beam16(V3a(o.x+Math.cos(a0)*r2,o.y+Math.sin(a0)*r2,.4),V3a(o.x+Math.cos(a1)*r2,o.y+Math.sin(a1)*r2,.4),'#ff3030',.12,Math.max(0,1-kk))}dot16(o.x,Y,o.y,4*(1-kk),'#ffffff',Math.max(0,1-kk*1.5))}
      else if(k==='tr'){let x,z,h=0;if(o.st==='fly'){const kk=Math.min(1,o.t/.6);x=o.x0+(o.x-o.x0)*kk;z=o.y0+(o.y-o.y0)*kk;h=Math.sin(kk*Math.PI)*3}else{x=o.x;z=o.y}
        const al=o.st==='gone'?Math.max(0,1-(T2-o.gt)/.6):o.st==='open'?Math.max(0,1-(T2-o.ot)/.25):1;if(al<=0)return;const c=S.CHEST.get();c.position.set(x,h,z);c.rotation.set(0,t3*.4,o.st==='fly'?Math.sin(t3*8)*.2:0);c.scale.setScalar(1.3*Math.max(.05,al));
        dot16(x,h+.6,z,2.6,'#ffcc33',.45*al);for(let i=0;i<5;i++){const an=t3*2+i*1.3,rr=1.1+.2*Math.sin(t3*3+i);dot16(x+Math.cos(an)*rr,h+.5+.4*Math.sin(t3*4+i),z+Math.sin(an)*rr,.35,'#fff3a0',al*(.5+.5*Math.sin(t3*7+i*2)))}
        if(o.st==='wait')dash16(x,z,.12,1.6+.3*Math.sin(t3*6),'#ffd84a',.4,18,t3,.04)}
      else if(k==='rw'){const e=o.e,m=e&&e.c28rw;if(!m||!ok(e))return;const r=(e.size||2)*.45,left=Math.max(0,m.end-G.t),urg=left<5?.5+.5*Math.sin(t3*14):.5+.5*Math.sin(t3*4);tor16(e.x,Y,e.y,r,'#ff2a2a',.6+.4*urg);
        for(let i=0;i<4;i++){const an=i*Math.PI/2+t3*1.5;beam16(V3a(e.x+Math.cos(an)*r*.8,e.y+Math.sin(an)*r*.8),V3a(e.x+Math.cos(an)*r*1.3,e.y+Math.sin(an)*r*1.3),'#ff2a2a',.05,.9)}spr16(S.WARN,e.x,Y+r+1.2+.1*Math.sin(t3*6),e.y,1.1,1)}
      else if(k==='dr'){const d=o.d;if(!ok(d))return;const g=S.DRN.get();g.position.set(d.x,Y+.3+.08*Math.sin(t3*5+d.x),d.y);g.rotation.set(0,-(d.ang||0)-Math.PI/2,0);g.scale.setScalar(1.4);bar16(d.x,Y+.9,d.y,.8,d.hp/d.max,'#5fe08a')}
      else if(k==='fog'){const al=Math.max(0,Math.min(1,o.t/.4,(o.max-o.t)/.5)),ca=Math.cos(o.a),sa=Math.sin(o.a);for(let i=0;i<16;i++){const gx=((i%4)-1.5)/4*6+Math.sin(o.seed+i*12.9)*.4,gy=(Math.floor(i/4)-1.5)/4*6+Math.sin(o.seed*1.7+i*78.2)*.4,px=gx+.25*Math.sin(t3*.6+i),pz=gy+.25*Math.cos(t3*.5+i*1.3);
        const c=S.CLOUD.get();c.position.set(o.x+px*ca-pz*sa,.6+.4*Math.sin(i*2.1+t3*.4),o.y+px*sa+pz*ca);c.scale.set(1.5+.4*Math.abs(Math.sin(i*3.1)),.9,1.5+.4*Math.abs(Math.cos(i*2.3)));c.rotation.y=i+t3*.1;c.material.opacity=.45*al}}});
    (Z.sp||[]).forEach(p=>{const al=Math.max(0,1-p.d/6);beam16(V3a(p.x,p.y),V3a(p.x-p.vx*.7,p.y-p.vy*.7),'#ffd24a',.07,al)});
    (Z.tc||[]).forEach(t=>beam16(V3a(t.x1,t.y1),V3a(t.x2,t.y2),'#8ff0ff',.05,t.t/.12));
    (G.en||[]).concat([G.pl]).forEach(e=>{if(!ok(e))return;const r=(e.size||2)*.4,y=Y+(e.lift||0)*1.3+r+.6;if(e.c28bl>T2)for(let i=0;i<3;i++){const an=t3*3+i*2.1;dot16(e.x+Math.cos(an)*r*.6,y,e.y+Math.sin(an)*r*.6,.45,'#fff6c0',.9)}});
    /* Ma Trận Số: mưa ký tự số xanh rơi trong không gian quanh trận, tàu thi triển có hào quang xanh */
    const M=(Z.o||[]).find(o=>o.k==='mx');if(M){const al=Math.max(0,Math.min(1,M.t/.35,(M.max-M.t)/.35)),P=M.P,cx=P&&ok(P)?P.x:G.wd.Wd/2,cz=P&&ok(P)?P.y:G.wd.Hd/2;
      for(let i=0;i<70;i++){const sx=cx+(rn13?(rn13(i,3)-.5):((i*.37)%1-.5))*26,sz=cz+((rn13?rn13(i,7):(i*.61)%1)-.5)*26,sp=2+((i*7919)%13)/4,u=((t3*sp*.25+((i*104729)%97)/97)%1);spr16(S.DIG,sx,9*(1-u),sz,.55,al*(.4+.6*(1-u)))}
      if(P&&ok(P)){const r=(P.size||2)*.55;tor16(P.x,Y,P.y,r*(1+.08*Math.sin(t3*6)),'#7dff9a',al);dash16(P.x,P.y,Y,r*1.3,'#3dff7a',.7*al,20,t3*2,.04);wall16(P.x,P.y,r*1.1,2,'#3dff7a',.35*al)}}}
  S.B.end();S.DOT.end();S.TOR.end();S.DISK.end();S.WALL.end();S.BALL.end();S.DARK.end();S.SHARD.end();S.NET.end();S.CLOUD.end();S.BAR.end();S.NO.end();S.WARN.end();S.ERR.end();S.DIG.end();S.SWD.end();S.TU.end();S.CHEST.end();S.DRN.end();S.HG.end()}
R3.tlbOn=()=>!!R3.live;

/* ---------- nối vào vòng vẽ trận ---------- */
function btn(){const b=document.getElementById('df3b');if(!b)return;b.textContent=R3.fail?'2D':(R3.on?'3D':'2D');b.setAttribute('aria-pressed',String(R3.on&&!R3.fail));b.title=R3.fail?'Máy không hỗ trợ đồ họa 3D':(R3.on?'Đang xem 3D · chạm để về 2D':'Đang xem 2D · chạm để xem 3D')}
{const z=document.getElementById('dfzo');if(z){const b=document.createElement('button');b.className='dfb';b.id='df3b';b.style.cssText='font-weight:900;font-size:12px';z.parentNode.insertBefore(b,z);
  b.onclick=()=>{if(R3.fail){toast('Máy không hỗ trợ đồ họa 3D, đang dùng 2D');return}R3.on=!R3.on;try{localStorage.setItem('se3d',R3.on?'1':'0')}catch(e){}btn()};btn()}}
function off(){R3.live=false;['df3rl','df3rr'].forEach(id=>{const b=document.getElementById(id);if(b)b.style.display='none'});if(cv3)cv3.style.display='none';const r=document.getElementById('df3r');if(r)r.style.display='none';try{hud(null,false)}catch(e){}if(stick)stick.style.display='none';R3.joy.id=null;if(intelEl)intelEl.style.display='none'}
setTimeout(()=>{
  const _D=dfDraw;dfDraw=function(){const G=DG;
    if(!G||!R3.on||R3.fail){off();return _D.apply(this,arguments)}
    if(!window.THREE){loadThree();off();return _D.apply(this,arguments)}
    if(!init()){off();return _D.apply(this,arguments)}
    let L=[];try{pump();L=collect(G)}catch(e){console.error(e)}
    R3.hide=new Set(L.filter(i=>i.m).map(i=>i.src));R3.hiding=true;R3.live=true;dfZoom=1;try{rotBtns();['df3rl','df3rr'].forEach(id=>{const b=document.getElementById(id);if(b)b.style.display=''})}catch(e){}
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
