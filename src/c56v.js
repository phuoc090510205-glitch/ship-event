/* ===== c56v: hình 3D siêu xe (thảm Phòng trưng bày siêu xe) ===== */
let SK20=null;
function sk20Init(){if(SK20)return SK20;sk17Init();const add=(g,m,x,y,z)=>{m.position.set(x||0,y||0,z||0);g.add(m);return m},P=mk=>Pool(()=>{const o=mk();scene.add(o);return o});
  SK20={CAR:P(()=>{const g=new T.Group(),paint=new T.MeshStandardMaterial({color:0xffffff,metalness:.85,roughness:.22}),dark=new T.MeshStandardMaterial({color:lin(0x111318),metalness:.6,roughness:.4}),glass=new T.MeshStandardMaterial({color:lin(0x14202e),metalness:.9,roughness:.08,transparent:true,opacity:.85}),
    lamp=new T.MeshBasicMaterial({color:0xfff6d0,toneMapped:false}),tail=new T.MeshBasicMaterial({color:0xff2020,toneMapped:false});
    const body=add(g,new T.Mesh(new T.BoxGeometry(1,.26,2.2),paint),0,.3,0);const nose=add(g,new T.Mesh(new T.BoxGeometry(.98,.16,.6),paint),0,.3,-1.25);nose.rotation.x=.18;
    const cab=add(g,new T.Mesh(new T.BoxGeometry(.78,.24,.95),glass),0,.55,.15);cab.scale.set(1,1,1);const roof=add(g,new T.Mesh(new T.BoxGeometry(.7,.05,.6),paint),0,.68,.2);
    const sp=add(g,new T.Mesh(new T.BoxGeometry(1,.05,.25),dark),0,.6,1.1);[-1,1].forEach(s=>{add(g,new T.Mesh(new T.BoxGeometry(.05,.18,.05),dark),s*.4,.5,1.1)});
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const w=add(g,new T.Mesh(new T.CylinderGeometry(.2,.2,.16,14),dark),sx*.52,.2,sz*.72);w.rotation.z=Math.PI/2});
    [-1,1].forEach(s=>{add(g,new T.Mesh(new T.BoxGeometry(.2,.06,.04),lamp),s*.33,.33,-1.52);add(g,new T.Mesh(new T.BoxGeometry(.24,.06,.04),tail),s*.33,.36,1.11)});
    const hl=new T.Sprite(ADDM(glowT()));hl.material.color.set(0xfff0c0);hl.scale.setScalar(1.4);hl.position.set(0,.35,-1.7);g.add(hl);g.userData={paint,hl};return g}),
   H:{B:Pool(()=>{const beamG=new T.CylinderGeometry(1,1,1,8,1,true),g=new T.Group(),a=new T.Mesh(beamG,SK.AD(0xffffff,.5)),b=new T.Mesh(beamG,SK.AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
     DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),TOR:Pool(()=>{const t=new T.TorusGeometry(1,.035,8,72);t.rotateX(Math.PI/2);const m=new T.Mesh(t,SK.AD(0xffffff,1));scene.add(m);return m}),
     CONE:Pool(()=>{const c=new T.ConeGeometry(1,1,24,1,true);c.translate(0,-.5,0);const m=new T.Mesh(c,SK.AD(0xffffff,.4));m.frustumCulled=false;scene.add(m);return m}),
     BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s})}};return SK20}
function sk20End(){if(!SK20)return;SK20.CAR.end();Object.values(SK20.H).forEach(p=>p.end())}
function skill3d20(G,dt){const S=G.c40;const L=S&&S.u?S.u.filter(u=>(u.k==='scar'||u.k==='f1')&&!u.dead):[];if(!L.length){if(SK20)sk20End();return}sk20Init();const s17=SK17;SK17=SK20.H;
  try{const Y=HOV;L.forEach(u=>{const g=SK20.CAR.get(),U=g.userData,big=u.big,sc=big?5:1.15,bob=u.prep>0?Math.sin(t3*40)*.012*sc:0;g.position.set(u.x,bob,u.y);g.rotation.y=-(u.ang||0)-Math.PI/2;if(u.k==='f1')g.scale.set(1.05,.55,1.35);else g.scale.set(sc,big?5.7:sc,sc);U.paint.color.set(u.col);U.hl.material.opacity=u.prep>0?.5+.5*Math.abs(Math.sin(t3*6)):1;
    if(u.prep>0){dot17(u.x-u.dx*1.3*sc,.25,u.y-u.dy*1.3*sc,.8*sc,'#a0a0a0',.35)}else{if(Math.random()<.5)dot17(u.x-u.dx*1.2*sc+rand(-.3,.3),.2,u.y-u.dy*1.2*sc+rand(-.3,.3),.6*sc,'#8a8a90',.4)}
    bar17(u.x,(big?4.6:.95),u.y,big?3:1,u.hp/u.max,big?'#ff4a4a':'#ffffff');if(big&&u.prep>0)tor17(u.x,.1,u.y,4+Math.sin(t3*8)*.4,'#ff3030',.6)})}
  catch(e){console.error(e)}finally{SK17=s17;sk20End()}}
