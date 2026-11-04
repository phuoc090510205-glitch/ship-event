/* ===== c95: TỐI ƯU KẾT XUẤT 3D — gộp các vật thể giống nhau thành một lượt vẽ (instancing). Hình ảnh giữ nguyên: cùng hình, màu, độ sáng, vị trí; chỉ giảm số lần GPU phải vẽ ===== */
/* ---- chỉ vẽ trong tầm nhìn: tính vùng mặt đất camera đang nhìn thấy, vật ngoài vùng thì không dựng/không cập nhật hình (logic trận vẫn chạy đủ) ---- */
window.__cull=(function(){const C={on:true,x0:-1e9,x1:1e9,z0:-1e9,z1:1e9,n:0};let V=null,D=null;
  C.upd=function(cam,T){C.on=!(typeof S!=='undefined'&&S.set&&S.set.cull===false);if(!C.on)return;if(!V){V=new T.Vector3();D=new T.Vector3()}cam.updateMatrixWorld();
    let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,ok=true;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([u,v])=>{V.set(u,v,.5).unproject(cam);D.copy(V).sub(cam.position).normalize();let t;
      if(D.y<-1e-3){t=-cam.position.y/D.y;t=Math.min(t,600)}else t=600;const x=cam.position.x+D.x*t,z=cam.position.z+D.z*t;x0=Math.min(x0,x,cam.position.x);x1=Math.max(x1,x,cam.position.x);z0=Math.min(z0,z,cam.position.z);z1=Math.max(z1,z,cam.position.z)});
    const m=6;C.x0=x0-m;C.x1=x1+m;C.z0=z0-m;C.z1=z1+m};
  C.inV=function(o,r){if(!C.on)return true;const q=(r!=null?r:Math.max(o.size||0,o.w||0,o.h||0))*.6+1;return o.x+q>=C.x0&&o.x-q<=C.x1&&o.y+q>=C.z0&&o.y-q<=C.z1};
  C.inP=function(x,z,r){if(!C.on)return true;return x+r>=C.x0&&x-r<=C.x1&&z+r>=C.z0&&z-r<=C.z1};
  return C})();
window.__bat=(function(){
let T=null,S=null,on=true;const hid=[];
const SV=`attribute vec3 iPos;attribute vec2 iScl;attribute float iRot;attribute vec2 iCtr;attribute vec4 iCol;varying vec2 vUv;varying vec4 vCol;
#include <common>
#include <fog_pars_vertex>
void main(){vUv=uv;vCol=iCol;vec4 mvPosition=viewMatrix*vec4(iPos,1.0);vec2 ap=(position.xy-(iCtr-vec2(.5)))*iScl;vec2 rp;rp.x=cos(iRot)*ap.x-sin(iRot)*ap.y;rp.y=sin(iRot)*ap.x+cos(iRot)*ap.y;mvPosition.xy+=rp;gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`;
const SF=`uniform sampler2D map;uniform float alphaTest;varying vec2 vUv;varying vec4 vCol;
#include <common>
#include <fog_pars_fragment>
void main(){vec4 tx=mapTexelToLinear(texture2D(map,vUv));vec4 dc=vCol*tx;if(dc.a<alphaTest)discard;gl_FragColor=dc;
#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>
}`;
/* ---- nhóm sprite ---- */
const SG=new Map();
function sGroup(m,ro){const k=m.map.uuid+'|'+m.blending+'|'+m.depthTest+'|'+m.depthWrite+'|'+m.toneMapped+'|'+m.fog+'|'+m.transparent+'|'+m.alphaTest+'|'+ro;let g=SG.get(k);
  if(!g){const base=new T.PlaneGeometry(1,1),geo=new T.InstancedBufferGeometry();geo.index=base.index;geo.setAttribute('position',base.attributes.position);geo.setAttribute('uv',base.attributes.uv);
    const mat=new T.ShaderMaterial({uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{map:{value:null},alphaTest:{value:0}}]),vertexShader:SV,fragmentShader:SF,transparent:m.transparent,blending:m.blending,depthTest:m.depthTest,depthWrite:m.depthWrite,fog:m.fog});
    mat.toneMapped=m.toneMapped;mat.map=m.map;mat.uniforms.map.value=m.map;mat.uniforms.alphaTest.value=m.alphaTest||0;
    const me=new T.Mesh(geo,mat);me.frustumCulled=false;me.renderOrder=ro;me.userData.c95=1;S.add(me);g={k,geo,mat,me,cap:0,L:[],norm:m.blending===T.NormalBlending};g.ensure=n=>{if(n<=g.cap)return;const c=Math.max(64,1<<Math.ceil(Math.log2(n)));g.cap=c;
      g.P=new T.InstancedBufferAttribute(new Float32Array(c*3),3);g.Sc=new T.InstancedBufferAttribute(new Float32Array(c*2),2);g.R=new T.InstancedBufferAttribute(new Float32Array(c),1);g.C=new T.InstancedBufferAttribute(new Float32Array(c*2),2);g.Co=new T.InstancedBufferAttribute(new Float32Array(c*4),4);
      [g.P,g.Sc,g.R,g.C,g.Co].forEach(a=>a.setUsage(T.DynamicDrawUsage));geo.setAttribute('iPos',g.P);geo.setAttribute('iScl',g.Sc);geo.setAttribute('iRot',g.R);geo.setAttribute('iCtr',g.C);geo.setAttribute('iCol',g.Co)};SG.set(k,g)}
  return g}
/* ---- nhóm lưới cơ bản phát sáng (tia, vệt đạn, vòng, cầu nổ) ---- */
const MG=new Map();
function mGroup(o,m){const k=o.geometry.uuid+'|'+m.blending+'|'+m.side+'|'+m.depthTest+'|'+m.depthWrite+'|'+(m.map?m.map.uuid:'')+'|'+m.toneMapped+'|'+m.fog+'|'+m.transparent+'|'+m.wireframe+'|'+o.renderOrder;let g=MG.get(k);
  if(!g){g={k,geo:o.geometry,src:m,ro:o.renderOrder,me:null,cap:0,L:[]};MG.set(k,g)}return g}
function mBuild(g,n){if(g.me&&n<=g.cap)return;if(g.me){if(g.me.parent)g.me.parent.remove(g.me);g.me.dispose&&g.me.dispose()}const c=Math.max(32,1<<Math.ceil(Math.log2(n)));const mat=g.src.clone();mat.color.setRGB(1,1,1);mat.opacity=1;
  const me=new T.InstancedMesh(g.geo,mat,c);me.instanceMatrix.setUsage(T.DynamicDrawUsage);me.setColorAt(0,new T.Color(1,1,1));me.instanceColor.setUsage(T.DynamicDrawUsage);me.frustumCulled=false;me.renderOrder=g.ro;me.userData.c95=1;S.add(me);g.me=me;g.cap=c}
function pre(scene,cam,TT){if(!on)return;T=TT;S=scene;hid.length=0;SG.forEach(g=>{g.L.length=0});MG.forEach(g=>{g.L.length=0});
  try{scene.updateMatrixWorld();
    scene.traverseVisible(o=>{if(o.userData&&o.userData.c95)return;
      if(o.isSprite){if(window.__batNS)return;if(!o.parent.isScene||true){const e=o.matrixWorld.elements;if(!__cull.inP(e[12],e[14],Math.hypot(e[0],e[1],e[2])+1)){o.visible=false;hid.push(o);return}}const m=o.material;if(!m||m.visible===false||!m.map||m.sizeAttenuation===false||!m.isSpriteMaterial||o.onBeforeRender!==T.Object3D.prototype.onBeforeRender)return;sGroup(m,o.renderOrder).L.push(o);return}
      if(o.isMesh&&window.__batMesh!==false&&!o.isInstancedMesh&&!o.castShadow&&!o.receiveShadow){const m=o.material;if(!m||Array.isArray(m)||m.visible===false||!m.isMeshBasicMaterial||m.blending!==T.AdditiveBlending||m.depthWrite!==false||!m.transparent||m.vertexColors||o.geometry.morphAttributes&&Object.keys(o.geometry.morphAttributes).length||o.onBeforeRender!==T.Object3D.prototype.onBeforeRender)return;mGroup(o,m).L.push(o)}});
    const ce=cam.matrixWorld.elements;
    SG.forEach(g=>{const L=g.L,n=L.length;if(g.me.parent!==scene)scene.add(g.me);if(n<3){g.me.visible=false;return}g.ensure(n);
      if(g.norm)L.sort((a,b)=>{const ea=a.matrixWorld.elements,eb=b.matrixWorld.elements;return ((eb[12]-ce[12])**2+(eb[13]-ce[13])**2+(eb[14]-ce[14])**2)-((ea[12]-ce[12])**2+(ea[13]-ce[13])**2+(ea[14]-ce[14])**2)});
      const P=g.P.array,Sc=g.Sc.array,R=g.R.array,C=g.C.array,Co=g.Co.array;
      for(let i=0;i<n;i++){const o=L[i],e=o.matrixWorld.elements,m=o.material;P[i*3]=e[12];P[i*3+1]=e[13];P[i*3+2]=e[14];Sc[i*2]=Math.hypot(e[0],e[1],e[2]);Sc[i*2+1]=Math.hypot(e[4],e[5],e[6]);R[i]=m.rotation||0;C[i*2]=o.center.x;C[i*2+1]=o.center.y;
        Co[i*4]=m.color.r;Co[i*4+1]=m.color.g;Co[i*4+2]=m.color.b;Co[i*4+3]=Math.max(0,Math.min(1,m.opacity));o.visible=false;hid.push(o)}
      {let cx=0,cy=0,cz=0;for(let i=0;i<n;i++){cx+=P[i*3];cy+=P[i*3+1];cz+=P[i*3+2]}g.me.position.set(cx/n,cy/n,cz/n);g.me.updateMatrixWorld(true)}[g.P,g.Sc,g.R,g.C,g.Co].forEach(a=>{a.needsUpdate=true});g.geo.instanceCount=n;g.me.visible=true});
    MG.forEach(g=>{const L=g.L,n=L.length;if(window.__batOnly!=null&&window.__batOnly!==g.k){if(g.me)g.me.visible=false;return}if(g.me&&g.me.parent!==scene)scene.add(g.me);if(n<3){if(g.me)g.me.visible=false;return}mBuild(g,n);const me=g.me,ia=me.instanceMatrix.array,ca=me.instanceColor.array;
      let cx=0,cy=0,cz=0;for(let i=0;i<n;i++){const e=L[i].matrixWorld.elements;cx+=e[12];cy+=e[13];cz+=e[14]}cx/=n;cy/=n;cz/=n;me.position.set(cx,cy,cz);me.updateMatrixWorld(true);
      for(let i=0;i<n;i++){const o=L[i],m=o.material,a=Math.max(0,Math.min(1,m.opacity));ia.set(o.matrixWorld.elements,i*16);ia[i*16+12]-=cx;ia[i*16+13]-=cy;ia[i*16+14]-=cz;ca[i*3]=m.color.r*a;ca[i*3+1]=m.color.g*a;ca[i*3+2]=m.color.b*a;o.visible=false;hid.push(o)}
      me.count=n;me.instanceMatrix.needsUpdate=true;me.instanceColor.needsUpdate=true;me.visible=true})}catch(e){console.error(e);post();on=false}}
function post(){for(let i=0;i<hid.length;i++)hid[i].visible=true;hid.length=0}
return {pre,post,set:v=>{on=!!v;if(!on){SG.forEach(g=>{g.me.visible=false});MG.forEach(g=>{if(g.me)g.me.visible=false})}},get on(){return on},keys:()=>[...MG.values()].filter(g=>g.L.length>=3).map(g=>[g.k,g.L.length,g.geo.type,g.src.transparent,g.src.opacity,g.src.depthWrite]),stat:()=>({sg:[...SG.values()].map(g=>g.L.length),mg:[...MG.values()].map(g=>g.L.length)})};
})();
