/* ===== c86v: hình 3D cho 10 thảm Tối thượng làm lại (2025–2034) ===== */
let SK25=null;
function sk25Init(){if(SK25)return SK25;sk17Init();const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:lin(c),roughness:.6,metalness:.05},o||{})),E=(c,i)=>M(c,{emissive:lin(c),emissiveIntensity:i||1.2,toneMapped:false}),add=(g,m,x,y,z)=>{m.position.set(x||0,y||0,z||0);g.add(m);return m},P=mk=>Pool(()=>{const o=mk();scene.add(o);return o}),cyl=(a,b,h,n)=>new T.CylinderGeometry(a,b,h,n||10),sph=(r,a,b)=>new T.SphereGeometry(r,a||12,b||10),box=(x,y,z)=>new T.BoxGeometry(x,y,z);
  const quad=(body,dark,o)=>{const g=new T.Group(),U={};o=o||{};const b=add(g,new T.Mesh(sph(.5,14,10),body),0,o.by||1,0);b.scale.set(o.bl||1.6,o.bh||.8,o.bw||.7);
    const nk=add(g,new T.Mesh(cyl(.13,.2,o.nl||.8,8),body),.7,(o.by||1)+.35,0);nk.rotation.z=-(o.na||.7);const hd=add(g,new T.Mesh(box(.42,.2,.22),body),.95+(o.nl||.8)*.25,(o.by||1)+.25+(o.nl||.8)*.55,0);hd.rotation.z=-.3;U.hd=hd;
    U.legs=[[.45,.2],[.45,-.2],[-.45,.2],[-.45,-.2]].map(([x,z])=>{const p=new T.Group();p.position.set(x,(o.by||1)-.1,z);add(p,new T.Mesh(cyl(.05,.04,(o.by||1)-.1,6),o.leg||body),0,-((o.by||1)-.1)/2,0);g.add(p);return p});
    const tl=add(g,new T.Mesh(cyl(.02,.06,.5,6),dark),-.85,(o.by||1)+.05,0);tl.rotation.z=-.9;g.userData=U;return {g,U,hd}};
  SK25={
  WALL:P(()=>{const g=new T.Group(),silk=M(0xffd8ec,{side:T.DoubleSide,transparent:true,opacity:.85,emissive:lin(0x8a3a6a),emissiveIntensity:.5,roughness:.3,metalness:.2}),frame=M(0x6a3a1a);
    add(g,new T.Mesh(box(6,7,.25),silk),0,3.5,0);[-3,3].forEach(x=>add(g,new T.Mesh(box(.3,7.4,.4),frame),x,3.7,0));add(g,new T.Mesh(box(6.6,.3,.45),frame),0,7.3,0);
    const th=E(0xfff0a0,1.5);for(let i=0;i<7;i++)add(g,new T.Mesh(box(5.9,.05,.27),th),0,.5+i,0);g.userData={silk};return g}),
  MILL:P(()=>{const g=new T.Group(),wall=M(0xc84a2a),roof=M(0x3a2414),wood=M(0xe8d8b0),U={};add(g,new T.Mesh(cyl(.8,1.25,4.4,12),wall),0,2.2,0);add(g,new T.Mesh(new T.ConeGeometry(1.05,1.4,12),roof),0,5.1,0);
    add(g,new T.Mesh(box(.5,.8,.06),M(0x2a1a10)),0,.5,1.2);const hub=new T.Group();hub.position.set(0,4.4,1.05);for(let i=0;i<4;i++){const a=new T.Group();a.rotation.z=i*Math.PI/2;add(a,new T.Mesh(box(.12,2.6,.05),wood),0,1.35,0);add(a,new T.Mesh(box(.6,2,.03),M(0xffffff,{transparent:true,opacity:.9})),.33,1.55,0);hub.add(a)}
    g.add(hub);U.hub=hub;g.userData=U;return g}),
  TUL:P(()=>{const g=new T.Group(),st=M(0x2e8a3a),pet=M(0xff4060,{emissive:lin(0x401020),emissiveIntensity:.6});add(g,new T.Mesh(cyl(.05,.06,1.2,6),st),0,.6,0);const lf=add(g,new T.Mesh(sph(.3,8,6),st),.15,.35,0);lf.scale.set(.4,1,.15);
    for(let i=0;i<5;i++){const p=add(g,new T.Mesh(sph(.22,10,8),pet),Math.cos(i*1.256)*.1,1.35,Math.sin(i*1.256)*.1);p.scale.set(.6,1.3,.6)}g.userData={pet};g.scale.setScalar(1.2);return g}),
  BFLY:P(()=>{const g=new T.Group(),w=M(0xffa21a,{side:T.DoubleSide,emissive:lin(0x6a3000),emissiveIntensity:.5}),bk=M(0x1a1008),U={};add(g,new T.Mesh(cyl(.03,.03,.4,6),bk),0,0,0).rotation.z=Math.PI/2;
    const mkW=s=>{const p=new T.Group();const a=add(p,new T.Mesh(new T.CircleGeometry(.28,10),w),0,0,s*.28);a.rotation.x=-Math.PI/2;const b=add(p,new T.Mesh(new T.CircleGeometry(.18,10),w),-.18,0,s*.2);b.rotation.x=-Math.PI/2;g.add(p);return p};U.l=mkW(1);U.r=mkW(-1);g.userData=U;return g}),
  TREE:P(()=>{const g=new T.Group(),tr=M(0x6a4422),lf=M(0x3a8a2a),fl=E(0xffa21a,.8);add(g,new T.Mesh(cyl(.25,.4,3.4,8),tr),0,1.7,0);[[0,4,0,1.4],[.7,3.6,.3,1],[-.6,3.7,-.3,1.05],[.1,4.6,-.4,.9]].forEach(([x,y,z,r])=>add(g,new T.Mesh(sph(r,10,8),lf),x,y,z));
    for(let i=0;i<10;i++)add(g,new T.Mesh(sph(.09,6,4),fl),Math.cos(i)*1.2,3.4+Math.sin(i*3)*.9,Math.sin(i*1.7)*1.1);return g}),
  ZEB:P(()=>{const body=M(0xf2f2f0),dark=M(0x141414),q=quad(body,dark,{});for(let i=0;i<5;i++){const st=add(q.g,new T.Mesh(sph(.5,12,8),dark),-.5+i*.25,1,0);st.scale.set(.09,.82,.72)}add(q.g,new T.Mesh(box(.5,.1,.06),dark),.62,1.6,0).rotation.z=-.7;return q.g}),
  DEER:P(()=>{const body=M(0xb87a3a),dark=M(0x3a2410),q=quad(body,dark,{bl:1.4});const horn=M(0x2a1a10);[-.1,.1].forEach(z=>{const h=add(q.hd,new T.Mesh(cyl(.02,.04,.8,6),horn),-.05,.45,z);h.rotation.z=.25;add(q.hd,new T.Mesh(cyl(.015,.025,.35,6),horn),.08,.65,z).rotation.z=-.6});return q.g}),
  OST:P(()=>{const g=new T.Group(),bk=M(0x1a1410),wh=M(0xf2ece0),pk=M(0xe8b0a0),U={};const b=add(g,new T.Mesh(sph(.5,12,10),bk),0,1.3,0);b.scale.set(1.2,.85,.8);add(g,new T.Mesh(sph(.3,10,8),wh),-.55,1.4,0);
    const nk=add(g,new T.Mesh(cyl(.06,.09,1.1,8),pk),.45,1.95,0);nk.rotation.z=-.2;U.hd=add(g,new T.Mesh(sph(.13,8,6),pk),.58,2.5,0);U.legs=[.15,-.15].map(z=>{const p=new T.Group();p.position.set(0,1,z);add(p,new T.Mesh(cyl(.05,.04,1,6),pk),0,-.5,0);g.add(p);return p});g.userData=U;return g}),
  FLAM:P(()=>{const g=new T.Group(),pk=M(0xff7aa8,{emissive:lin(0x401020),emissiveIntensity:.3}),bk=M(0x1a1010);const b=add(g,new T.Mesh(sph(.42,12,10),pk),0,1.5,0);b.scale.set(1.3,.8,.7);
    const nk=new T.Mesh(new T.TorusGeometry(.35,.06,6,16,Math.PI*1.3),pk);nk.position.set(.35,2.05,0);nk.rotation.z=-.5;g.add(nk);add(g,new T.Mesh(sph(.12,8,6),pk),.55,2.5,0);const bl=add(g,new T.Mesh(new T.ConeGeometry(.05,.25,6),bk),.68,2.45,0);bl.rotation.z=-2.2;
    add(g,new T.Mesh(cyl(.025,.025,1.2,6),pk),0,.6,0);const l2=add(g,new T.Mesh(cyl(.025,.025,.7,6),pk),.12,.95,0);l2.rotation.z=1.1;return g}),
  ELE:P(()=>{const g=new T.Group(),sk=M(0x8a8a90,{roughness:.9}),iv=M(0xf2eadc),U={};const b=add(g,new T.Mesh(sph(.7,14,10),sk),0,1.45,0);b.scale.set(1.5,1.05,1);const hd=add(g,new T.Mesh(sph(.48,12,10),sk),1.05,1.75,0);
    [-1,1].forEach(s=>{const e=add(g,new T.Mesh(sph(.42,10,8),sk),.85,1.85,s*.5);e.scale.set(.25,1,.9)});U.tr=[];let px=1.38,py=1.55;for(let i=0;i<5;i++){U.tr.push(add(g,new T.Mesh(sph(.13-i*.012,8,6),sk),px,py,0));px+=.06;py-=.22}
    [-1,1].forEach(s=>{const t=add(g,new T.Mesh(new T.ConeGeometry(.06,.5,6),iv),1.38,1.42,s*.18);t.rotation.z=-2.3});U.legs=[[.55,.38],[.55,-.38],[-.55,.38],[-.55,-.38]].map(([x,z])=>{const p=new T.Group();p.position.set(x,1,z);add(p,new T.Mesh(cyl(.2,.2,1,10),sk),0,-.5,0);g.add(p);return p});
    U.hd=hd;g.userData=U;return g}),
  SPIKE:P(()=>new T.Mesh(new T.ConeGeometry(.35,2.2,6),M(0x2a2a34,{metalness:.95,roughness:.15,emissive:lin(0x101830),emissiveIntensity:.6}))),
  DROP:P(()=>new T.Mesh(sph(.35,12,10),E(0x9fe8ff,1.6))),
  H:{B:Pool(()=>{const beamG=new T.CylinderGeometry(1,1,1,8,1,true),g=new T.Group(),a=new T.Mesh(beamG,SK.AD(0xffffff,.5)),b=new T.Mesh(beamG,SK.AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
     DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),TOR:Pool(()=>{const t=new T.TorusGeometry(1,.035,8,72);t.rotateX(Math.PI/2);const m=new T.Mesh(t,SK.AD(0xffffff,1));scene.add(m);return m}),
     CONE:Pool(()=>{const c=new T.ConeGeometry(1,1,24,1,true);c.translate(0,-.5,0);const m=new T.Mesh(c,SK.AD(0xffffff,.4));m.frustumCulled=false;scene.add(m);return m}),
     BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s})}};return SK25}
function sk25End(){if(!SK25)return;Object.keys(SK25).forEach(k=>{if(k!=='H')SK25[k].end()});Object.values(SK25.H).forEach(p=>p.end())}
function sk25Body(G,S){const K=SK25,V=(x,z,y)=>new T.Vector3(x,y,z),Rg=S.Rg;
  S.u.forEach(u=>{if(u.dead)return;const rise=Math.min(1,(G.t-(u.born||0))*2);
    if(u.k==='silkwall'){const g=K.WALL.get();g.position.set(u.x,-7*(1-rise),u.y);g.rotation.y=-(u.ang||0);bar17(u.x,8,u.y,3,u.hp/u.max,'#ffb8e0')}
    else if(u.k==='windmill'){const g=K.MILL.get();g.position.set(u.x,0,u.y);g.scale.setScalar(rise);g.rotation.y=.4;g.userData.hub.rotation.z=G.t*1.6;bar17(u.x,6.6,u.y,1.8,u.hp/u.max,'#ffe0a0')}
    else if(u.k==='tulip'){const g=K.TUL.get();g.userData.pet.color.set(u.col);g.position.set(u.x,0,u.y);g.scale.setScalar(1.2*rise*(u.life<1?Math.max(.1,u.life):1));g.rotation.y=G.t*.5;bar17(u.x,2.2,u.y,.8,u.hp/u.max,u.col);if(u.tk>.85)tor17(u.x,.08,u.y,3*(1-(u.tk-.85)/.15),u.col,.5)}
    else if(u.k==='bfly'){const g=K.BFLY.get(),U=g.userData,f=Math.sin(G.t*22+u.ph)*1.1;g.position.set(u.x,u.h||1.4,u.y);g.rotation.y=-(u.ang||0);U.l.rotation.x=f;U.r.rotation.x=-f;g.scale.setScalar(1.4)}
    else if(u.k==='btree'){const g=K.TREE.get();g.position.set(u.x,0,u.y);g.scale.setScalar(rise);bar17(u.x,5.6,u.y,1.6,u.hp/u.max,'#ffd27a')}
    else if(u.k==='sbeast'){const g=(u.bk==='zebra'?K.ZEB:u.bk==='ostrich'?K.OST:K.DEER).get(),U=g.userData||{},wk=u.mv?Math.sin((u.walk||0)*10):0;g.position.set(u.x,0,u.y);g.rotation.y=-(u.ang||0);g.scale.setScalar(rise*(u.bk==='ostrich'?.9:1.05));
      (U.legs||[]).forEach((l,i)=>l.rotation.z=(i%2?wk:-wk)*.5);if(U.hd)U.hd.rotation.z=-.3+(u.sw>0?Math.sin(u.sw/.45*Math.PI)*.5:0);bar17(u.x,2.6,u.y,.9,u.hp/u.max,'#f8d898')}
    else if(u.k==='flamingo'){const g=K.FLAM.get();g.position.set(u.x,0,u.y);g.rotation.y=-(u.ang||0);g.scale.setScalar(rise);bar17(u.x,3,u.y,1,u.hp/u.max,'#ff9ac0')}
    else if(u.k==='w2eleph'){const g=K.ELE.get(),U=g.userData,s=u.mom?3.6:1.8,wk=u.mv?Math.sin((u.walk||0)*5):0,at=u.sw>0?Math.sin(u.sw/.45*Math.PI):0;g.position.set(u.x,0,u.y);g.rotation.y=-(u.ang||0);g.scale.setScalar(s*rise);
      U.legs.forEach((l,i)=>l.rotation.z=(i%2?wk:-wk)*.35);U.tr.forEach((t,i)=>{t.position.y=1.55-i*.22+at*i*.08});bar17(u.x,s*2.3+.4,u.y,u.mom?2.6:1.6,u.hp/u.max,'#d8d8e0')}});
  S.vis.forEach(v=>{const k=v.t/v.max;
    if(v.k==='silk'){const y=v.y,a=1-k;beam17(V(v.x0,y,.15),V(v.x0+(v.x1-v.x0)*Math.min(1,k*2),y,.15),'#ffe0f0',.06,a)}
    else if(v.k==='callig'){dot17(v.x,4+k*2,v.y,10,'#fff3d0',.5*(1-k));tor17(v.x,.1,v.y,3+k*5,'#2a1a10',(1-k)*.8)}
    else if(v.k==='ndrop'){if(!v.hit){const g=K.DROP.get(),h=14*(1-Math.min(1,v.t/.9));g.position.set(v.x,h,v.y);beam17(V(v.x,v.y,h),V(v.x,v.y,h+3),'#9fe8ff',.15,.6);tor17(v.x,.06,v.y,2.5,'#9fe8ff',.3+.4*k)}else tor17(v.x,.1,v.y,2.5+(v.t-.9)*12,'#c8f4ff',Math.max(0,1-(v.t-.9)*8))}
    else if(v.k==='fspike'){const g=K.SPIKE.get(),r=Math.min(1,v.t*6)*(1-Math.max(0,(k-.6)/.4));g.position.set(v.x,-1.1+2.2*r*.5,v.y);g.scale.set(1,r,1);dot17(v.x,.3,v.y,1.6,'#9fb0ff',.5*(1-k))}
    else if(v.k==='fring'){tor17(v.x,.1,v.y,1+k*4,'#b07aff',.6*(1-k))}
    else if(v.k==='lake'){tor17(v.x,.08,v.y,2+k*12,'#7ad0ff',.5*(1-k))}});
  if(S.K===2030&&S.coat&&S.t<15)S.coat.forEach(u=>{if(!u||u.dead||u.hp<=0)return;const r=Math.max(u.size||1,u.w||1,u.h||1)*.6;tor17(u.x,.4+Math.sin(G.t*3+u.x)*.1,u.y,r,'#ff8ac0',.55);dot17(u.x,1,u.y,r*2,'#ffb8d8',.15)});
  if(S.K===2026&&S.prog!=null){const r=Math.max(Rg.x1-Rg.x0,Rg.y1-Rg.y0)*.3;tor17(S.cx,.12,S.cy,r*S.prog,'#3a2414',.7)}}
function skill3d25(G,dt){const L=[G.c40,G.c40e].concat(G.c40L||[]).filter(S=>S&&S.K>=2025&&S.K<=2034);if(!L.length){if(SK25)sk25End();return}sk25Init();const s17=SK17;SK17=SK25.H;
  try{L.forEach(S=>sk25Body(G,S))}catch(e){console.error(e)}finally{SK17=s17;sk25End()}}
