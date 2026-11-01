/* ===== c57v: hình 3D thảm F1 / chuyên cơ / khoang chuyên cơ / trực thăng / hoàng hôn ===== */
let SK21=null;
function sk21Init(){if(SK21)return SK21;sk17Init();const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:lin(c),roughness:.45,metalness:.3},o||{})),E=(c,i)=>M(c,{emissive:lin(c),emissiveIntensity:i||1.2,toneMapped:false}),add=(g,m,x,y,z)=>{m.position.set(x||0,y||0,z||0);g.add(m);return m},P=mk=>Pool(()=>{const o=mk();scene.add(o);return o});
  SK21={
  PLANE:P(()=>{const g=new T.Group(),wh=M(0xf4f6fa,{metalness:.5,roughness:.25}),gr=M(0xc8ccd4,{metalness:.7,roughness:.3}),gl=E(0x5ab0ff,1.2),bl=M(0x1a3a8a,{metalness:.4});
    const f=add(g,new T.Mesh(new T.CylinderGeometry(1.5,1.5,22,20),wh));f.rotation.z=Math.PI/2;const n=add(g,new T.Mesh(new T.SphereGeometry(1.5,20,14),wh),11,0,0);n.scale.set(2.2,1,1);const tl=add(g,new T.Mesh(new T.ConeGeometry(1.5,5,20),wh),-13.5,.3,0);tl.rotation.z=Math.PI/2;
    add(g,new T.Mesh(new T.BoxGeometry(5,.35,30),wh),1,-.4,0);add(g,new T.Mesh(new T.BoxGeometry(2.6,.25,10),wh),-13,.6,0);const fin=add(g,new T.Mesh(new T.BoxGeometry(3.2,5,.3),bl),-13.2,3,0);fin.rotation.z=-.35;
    [-1,1].forEach(s=>{[5,10].forEach(z=>{const e=add(g,new T.Mesh(new T.CylinderGeometry(.6,.6,2.6,14),gr),1.8,-1.2,s*z);e.rotation.z=Math.PI/2})});
    for(let i=0;i<14;i++)[-1,1].forEach(s=>add(g,new T.Mesh(new T.BoxGeometry(.5,.35,.05),gl),8-i*1.3,.55,s*1.47));add(g,new T.Mesh(new T.BoxGeometry(22,.25,.06),bl),0,-.1,1.5);add(g,new T.Mesh(new T.BoxGeometry(22,.25,.06),bl),0,-.1,-1.5);return g}),
  CAB:P(()=>{const g=new T.Group(),wall=M(0xeee8dc,{roughness:.6}),gold=M(0xd9a520,{metalness:.9,roughness:.25}),win=E(0x8fd0ff,1.4);add(g,new T.Mesh(new T.BoxGeometry(2,3.4,.3),wall),0,1.7,0);const w=add(g,new T.Mesh(new T.BoxGeometry(.7,.9,.06),win),0,2,.17);w.scale.set(1,1,1);add(g,new T.Mesh(new T.BoxGeometry(2,.1,.34),gold),0,1.1,0);add(g,new T.Mesh(new T.BoxGeometry(2,.12,.34),gold),0,3.35,0);return g}),
  CLOUD:P(()=>new T.Mesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:lin(0x2a6a3a),transparent:true,opacity:.82,roughness:1,flatShading:true,emissive:lin(0x103a18),emissiveIntensity:.7,depthWrite:false}))),
  HOTEL:P(()=>{const g=new T.Group(),V=[];const mk=(w,h,d,c,acc)=>{const v=new T.Group(),m=M(c,{roughness:.5,metalness:.15}),win=E(0xffe3a0,.9),ac=M(acc,{metalness:.5,roughness:.3});add(v,new T.Mesh(new T.BoxGeometry(w,h,d),m),0,h/2,0);
      for(let y=.6;y<h-.3;y+=.55)add(v,new T.Mesh(new T.BoxGeometry(w*1.01,.14,d*1.01),win),0,y,0);add(v,new T.Mesh(new T.BoxGeometry(w*1.1,.18,d*1.1),ac),0,h+.09,0);g.add(v);V.push(v);return v};
    mk(1.4,5,1.4,0xf2efe6,0x2ab0c0);mk(2,3.2,1.3,0xf6d9b0,0xd96a3a);const s=mk(1.6,4,1.6,0xe0f0f4,0x2a7ad8);add(s,new T.Mesh(new T.BoxGeometry(1.1,1.6,1.1),M(0xe0f0f4)),0,4.8,0);mk(1.2,6.4,1.2,0xfafafa,0xd9a520);
    const r=mk(2.2,2.6,1.6,0xffe8d0,0x3ab07a);add(r,new T.Mesh(new T.CylinderGeometry(.9,.9,.2,16),M(0x3ab0e0,{emissive:lin(0x0a4a6a),emissiveIntensity:.6})),0,2.75,0);g.userData={V};return g}),
  SUN:P(()=>{const g=new T.Group(),s=new T.Mesh(new T.SphereGeometry(1,28,20),new T.MeshBasicMaterial({color:0xff7a3a,toneMapped:false})),c=new T.Mesh(new T.SphereGeometry(1.12,24,16),new T.MeshBasicMaterial({color:0xff4f8a,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));g.add(s,c);const gl=new T.Sprite(ADDM(glowT()));gl.material.color.set(0xff8a4a);gl.scale.setScalar(5);g.add(gl);return g}),
  H:{B:Pool(()=>{const beamG=new T.CylinderGeometry(1,1,1,8,1,true),g=new T.Group(),a=new T.Mesh(beamG,SK.AD(0xffffff,.5)),b=new T.Mesh(beamG,SK.AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
     DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),TOR:Pool(()=>{const t=new T.TorusGeometry(1,.035,8,72);t.rotateX(Math.PI/2);const m=new T.Mesh(t,SK.AD(0xffffff,1));scene.add(m);return m}),
     CONE:Pool(()=>{const c=new T.ConeGeometry(1,1,24,1,true);c.translate(0,-.5,0);const m=new T.Mesh(c,SK.AD(0xffffff,.4));m.frustumCulled=false;scene.add(m);return m}),
     BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s})}};return SK21}
function sk21End(){if(!SK21)return;Object.keys(SK21).forEach(k=>{if(k!=='H')SK21[k].end()});Object.values(SK21.H).forEach(p=>p.end())}
function skill3d21(G,dt){const S=G.c40;if(!S||!(S.K>=1007&&S.K<=1010)){if(SK21)sk21End();return}sk21Init();const s17=SK17;SK17=SK21.H;
  try{const K=SK21,Y=HOV,V=(x,z,y)=>new T.Vector3(x,y,z),Rg=S.Rg;
   if(S.K===1007&&S.pl){const P=S.pl,g=K.PLANE.get();g.position.set(P.x,12,P.y);g.rotation.set(0,P.dx>0?0:Math.PI,0);dot17(P.x,.1,P.y,20,'#000000',.25);for(let i=0;i<4;i++)dot17(P.x-P.dx*(15+i*2),11.6,P.y+(i%2?6:-6),2,'#ffffff',.35-i*.07)}
   if(S.K===1008){if(S.ph===1){const W=Rg.x1-Rg.x0,H=Rg.y1-Rg.y0,rise=Math.min(1,S.a*1.5);const seg=(x,z,ry)=>{const g=K.CAB.get();g.position.set(x,-3.4*(1-rise),z);g.rotation.y=ry};
      for(let x=Rg.x0+1;x<Rg.x1;x+=2){seg(x,Rg.y0-.3,0);seg(x,Rg.y1+.3,0)}for(let y=Rg.y0+1;y<Rg.y1;y+=2){seg(Rg.x0-.3,y,Math.PI/2);seg(Rg.x1+.3,y,Math.PI/2)}
      for(let x=Rg.x0+2;x<Rg.x1;x+=4)beam17(V(x,Rg.y0-.3,3.5*rise),V(x,Rg.y1+.3,3.5*rise),'#e8dcc0',.12,.8)}
     if(S.ph===2||S.ph===3){const cx=S.cx,cy=S.cy;dot17(cx,16,cy,140,'#30ff60',.28);for(let i=0;i<10;i++){const c=K.CLOUD.get(),a=i/10*Math.PI*2+t3*.15;c.position.set(cx+Math.cos(a)*7,13+Math.sin(t3+i)*.4,cy+Math.sin(a)*7);c.scale.set(3.2,1.6,3.2)}
      if(S.ph===3)for(let i=0;i<50;i++){const x=rand(Rg.x0-4,Rg.x1+4),z=rand(Rg.y0-4,Rg.y1+4),y=rand(1,12);beam17(V(x,z,y),V(x,z,y-1.2),'#7dff6a',.03,.8)}}}
   if(S.K===1009){const h=S.h;if(h&&!h.dead&&G.t-h.born<30){cone17(V(h.x,h.y,(h.h||6)-.4),V(h.spot.x,h.spot.y,0),2.2,'#fff6c0',.22);tor17(h.spot.x,.08,h.spot.y,2.2,'#fff6c0',.5)}
     (S.bombs||[]).forEach(b=>{if(b.hit)return;const p=Math.min(1,b.t/.7),hh=(h?h.h||6:6)*(1-p);dot17(b.x,hh+.3,b.y,.9,'#ff8a3a',1);tor17(b.x,.06,b.y,2,'#ff4a2a',.4+.4*p)})}
   if(S.K===1010){S.u.forEach(u=>{if(u.k!=='hotel'||u.dead)return;const g=K.HOTEL.get(),r=Math.min(1,(G.t-u.born)*1.5);g.userData.V.forEach((v,i)=>v.visible=i===u.v);g.position.set(u.x,0,u.y);g.scale.set(.6,.6*r,.6);bar17(u.x,4.4,u.y,1.4,u.hp/u.max,'#ffd9a0')});
     if(S.sun>0&&S.sx!=null){const g=K.SUN.get(),r=Math.max(.3,(S.sr||2)*S.sun);g.position.set(S.sx,12,S.sy);g.scale.setScalar(r);dot17(S.sx,10,S.sy,90,'#ff7a40',.18*S.sun);beam17(V(S.sx,S.sy,12),V(S.sx,S.sy,0),'#ffb070',r*.6,.15*S.sun);if(S.su&&!S.su.dead)bar17(S.sx,12+r+.6,S.sy,2.2,S.su.hp/S.su.max,'#ffb070')}}}
  catch(e){console.error(e)}finally{SK17=s17;sk21End()}}
