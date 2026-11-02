/* ===== c67v: hiệu ứng công trình (c17–c22) chuyển sang 3D: đạn riêng, laser, hồ quang, lồng giam, thôi miên, dây phóng, vùng phóng xạ, đạn trời, sóng, bản sao rơi, giáp chặn, bão sét, làn khói ===== */
let SK24=null;
function sk24Init(){if(SK24)return SK24;sk17Init();
  const smk=Pool(()=>{const m=new T.Mesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:0xd8e2f0,transparent:true,opacity:.42,roughness:1,flatShading:true,depthWrite:false}));scene.add(m);return m});
  const box=Pool(()=>{const m=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1,1,1)),new T.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.9,toneMapped:false}));scene.add(m);return m});
  const ball=Pool(()=>{const m=new T.Mesh(new T.SphereGeometry(1,12,10),new T.MeshBasicMaterial({color:0xffffff,toneMapped:false}));scene.add(m);return m});
  const wall=Pool(()=>{const m=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0xffd7a0,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide}));scene.add(m);return m});
  SK24={SMK:smk,BOX:box,BALL:ball,WALL:wall,
  H:{B:Pool(()=>{const beamG=new T.CylinderGeometry(1,1,1,8,1,true),g=new T.Group(),a=new T.Mesh(beamG,SK.AD(0xffffff,.5)),b=new T.Mesh(beamG,SK.AD(0xffffff,1));a.frustumCulled=b.frustumCulled=false;g.add(a,b);g.userData={a,b};scene.add(g);return g}),
     DOT:Pool(()=>{const s=new T.Sprite(ADDM(glowT()));scene.add(s);return s}),TOR:Pool(()=>{const t=new T.TorusGeometry(1,.035,8,72);t.rotateX(Math.PI/2);const m=new T.Mesh(t,SK.AD(0xffffff,1));scene.add(m);return m}),
     CONE:Pool(()=>{const c=new T.ConeGeometry(1,1,24,1,true);c.translate(0,-.5,0);const m=new T.Mesh(c,SK.AD(0xffffff,.4));m.frustumCulled=false;scene.add(m);return m}),
     BAR:Pool(()=>{const s=new T.Sprite(new T.SpriteMaterial({map:WHITE,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,fog:false}));s.center.set(0,.5);s.renderOrder=20;scene.add(s);return s})}};return SK24}
function sk24End(){if(!SK24)return;['SMK','BOX','BALL','WALL'].forEach(k=>SK24[k].end());Object.values(SK24.H).forEach(p=>p.end())}
window.c67hide=G=>{try{return !!(window.R3D&&R3D.live&&typeof DG!=='undefined'&&DG&&G===DG)}catch(e){return false}};
const en8L=G=>(G.bl||[]).concat(G.eu||[]).filter(b=>b.hp>0&&!b.dead&&((b.nb&&b.nb.c17)||(b.bd&&b.bd.nb&&b.bd.nb.c17))==='en8');
function skill3d24(G,dt){if(!G||G!==DG||!(G.c19e||G.c19p||G.c20e||G.c21e||G.c22e||G.c22p||(G.bl||[]).some(b=>b.smkR)||en8L(G).length)){if(SK24)sk24End();return}sk24Init();const s17=SK17;SK17=SK24.H;
  try{const K=SK24,V=(x,z,y)=>new T.Vector3(x,y,z),hz=u=>Math.max(.6,(u.size||2)*.35);
   const cage=(x,z,w,h,y0,col,o)=>{const m=K.BOX.get();m.position.set(x,y0+h/2,z);m.scale.set(w,h,w);m.material.color.set(col);m.material.opacity=o;m.rotation.y=t3*.6};
   const ball=(x,y,z,r,col)=>{const m=K.BALL.get();m.position.set(x,y,z);m.scale.setScalar(r);m.material.color.set(col);dot17(x,y,z,r*4,col,.6)};
   /* --- đạn riêng c19 / c22 --- */
   (G.c19p||[]).forEach(p=>{if(p.dead)return;const c=(p.st&&p.st.col)||(p.b&&p.b.nb&&p.b.nb.col)||'#9fe0ff',r=.16+(p.spl?.1:0);ball(p.x,.9,p.y,r,c);const sp=Math.hypot(p.vx,p.vy)||1;beam17(V(p.x,p.y,.9),V(p.x-p.vx/sp*1.2,p.y-p.vy/sp*1.2,.9),c,r*.6,.5)});
   (G.c22p||[]).forEach(p=>{if(p.dead||p.hide)return;const c=p.col||'#ffd27a',r=Math.max(.12,(p.sz||.3)*.5);let y=.9;if(p.kind==='lob'&&p.dur){const u=Math.min(1,(p.u||0)/p.dur);y=.6+Math.sin(u*Math.PI)*Math.max(2,Math.hypot(p.tx-p.x0,p.ty-p.y0)*.3)}
     const sp=Math.hypot(p.vx,p.vy)||1;if(p.kind==='missile'){const dT=p.tg&&!p.tg.dead?Math.hypot(p.tg.x-p.x,p.tg.y-p.y):3,air=p.tg&&((p.tg.h||0)>1),up=Math.min(1,(p.age||0)/.35),y2=.9+2.1*up*(air?1:Math.min(1,dT/3)),ux=p.vx/sp,uy=p.vy/sp,cl=(y2-(p._y||y2))*8;p._y=y2;
       const nose=V(p.x+ux*.35,p.y+uy*.35,y2+cl*.05),tail=V(p.x-ux*.55,p.y-uy*.55,y2-cl*.08);beam17(tail,nose,'#e8ecf4',Math.max(.07,r*.55),1);dot17(nose.x,nose.y,nose.z,.35,'#ff5a4a',.9);beam17(V(p.x-ux*.5,p.y-uy*.5,y2-cl*.08),V(p.x-ux*1.9,p.y-uy*1.9,y2-cl*.25),'#ffb070',r*.45,.7);dot17(tail.x,tail.y,tail.z,.6,'#ffcf7a',.8);if(Math.random()<.5)spark(tail.x,tail.y,tail.z,0,.2,0,'#cfd6e0',.5,.25)}
     else ball(p.x,y,p.y,r,c);if(p.kind==='missile'){}
     else beam17(V(p.x,p.y,y),V(p.x-p.vx/sp*1,p.y-p.vy/sp*1,y),c,r*.5,.45)});
   /* --- hiệu ứng c19 --- */
   (G.c19e||[]).forEach(o=>{const f=o.max?Math.min(1,o.t/o.max):0;switch(o.k){
     case'laser':beam17(V(o.x1,o.y1,.9),V(o.x2,o.y2,.9),o.col||'#ff5a5a',Math.max(.06,(o.w||6)/40),1-f);dot17(o.x2,.9,o.y2,1.2,o.col||'#ff5a5a',.8*(1-f));break;
     case'arc':{const a=V(o.x-o.dy*(o.w||2)/2,o.y+o.dx*(o.w||2)/2,.8),b=V(o.x+o.dy*(o.w||2)/2,o.y-o.dx*(o.w||2)/2,.8);zap17(a,b,'#b78cff',.9,o.t*20,.35,.08);dot17(o.x,.8,o.y,2,'#c9a8ff',.6);break}
     case'prism':{const e=o.e;if(e&&!e.dead){const r=hz(e)*2;cage(e.x,e.y,r,r*1.3,.1,'#cfe8ff',.85);dot17(e.x,1,e.y,r*1.6,'#e8f4ff',.35+.2*Math.sin(t3*9))}break}
     case'hyp':{const e=o.e,b=o.b;if(e&&!e.dead){for(let i=0;i<3;i++)tor17(e.x,1+i*.45+Math.sin(t3*3+i)*.1,e.y,hz(e)*(1.4-i*.3),'#7fb0ff',.7,0,0);if(b)zap17(V(b.x,b.y,1.6),V(e.x,e.y,1.2),'#9fc8ff',.5,o.t*13,.15,.04)}break}
     case'tether':{const b=o.b;if(b){beam17(V(b.x,b.y,1.2),V(o.x,o.y,.9),'#e0e6ff',.05,.9);dot17(o.x,.9,o.y,.9,'#ffffff',.9)}break}
     case'zone':{const R=o.R||5,pu=.5+.5*Math.sin(t3*4+(o.seed||0));tor17(o.x,.08,o.y,R,'#7dff6a',.6,0,0);tor17(o.x,.1,o.y,R*(.4+.6*((t3*.6)%1)),'#b8ff9a',.4,0,0);dot17(o.x,.6,o.y,R*1.4,'#5aff4a',.12+.06*pu);
       for(let i=0;i<5;i++){const a=i/5*6.283+t3*.7,rr=R*.6;beam17(V(o.x+Math.cos(a)*rr,o.y+Math.sin(a)*rr,0),V(o.x+Math.cos(a)*rr,o.y+Math.sin(a)*rr,1.6+pu),'#8aff7a',.05,.35)}break}
     case'sky':{if(o.t<o.dl)break;const u=o.t-o.dl;if(u<.85){const k=u/.85;ball(o.x,12*(1-k)+.4,o.y,.45,'#d07bff');beam17(V(o.x,o.y,12*(1-k)+.4),V(o.x,o.y,12*(1-k)+3),'#e0a8ff',.18,.6);tor17(o.x,.06,o.y,1.5,'#d07bff',.3+.5*k,0,0)}
       else{const k=Math.min(1,(u-.85)/.5);tor17(o.x,.1,o.y,.5+2.5*k,'#e0a8ff',1-k,0,0);dot17(o.x,.8,o.y,4*(1-k)+1,'#f0c8ff',.7*(1-k))}break}
     case'box':{const e=o.e;if(e&&!e.dead){const r=hz(e)*2.1;cage(e.x,e.y,r,r,.05,'#b6a0ff',.9);if(Math.random()<.25)zap17(V(e.x-r/2,e.y-r/2,r),V(e.x+r/2,e.y+r/2,0),'#c8b6ff',.6,Math.random()*9,.2,.04)}break}}});
   /* --- c20 --- */
   (G.c20e||[]).forEach(o=>{const f=o.max?Math.min(1,o.t/o.max):0;
     if(o.k==='wave'){tor17(o.x,.15,o.y,Math.max(.1,o.r||0),o.col||'#9fe8ff',Math.max(0,1-f),0,0);tor17(o.x,.5,o.y,Math.max(.1,(o.r||0)*.96),o.col||'#9fe8ff',Math.max(0,.5-f*.5),0,0)}
     else if(o.k==='drop'){const y=10*(1-f)+.5;ball(o.x,y,o.y,.5,'#7fe3ff');cone17(V(o.x,o.y,y+.2),V(o.x,o.y,0),1.2,'#7fe3ff',.18);tor17(o.x,.06,o.y,1.2+f,'#9fe8ff',.6,0,0)}
     else if(o.k==='cage'){(o.es||[]).forEach(e=>{if(e.dead)return;const r=hz(e)*2.2;cage(e.x,e.y,r,r*1.2,.05,'#c58bff',.95);tor17(e.x,.1,e.y,r*.75,'#c58bff',.6,0,0)})}});
   /* --- c21: giáp chặn boss --- */
   (G.c21e||[]).forEach(o=>{if(o.k!=='bar'||o.cx==null)return;const m=K.WALL.get(),len=(o.half||2.2)*2,hp=o.hm?o.hp/o.hm:1;m.position.set(o.cx,1.1,o.cy);m.scale.set(len,2.2,.25);m.rotation.set(0,-Math.atan2(o.uy,o.ux)+Math.PI/2,0);m.material.opacity=.1+.15*hp+.05*Math.sin(t3*8);
     bar17(o.cx,2.6,o.cy,1.6,hp,'#ffd7a0')});
   /* --- c22: bão sét --- */
   (G.c22e||[]).forEach(o=>{if(o.k!=='storm')return;const h=6.5;for(let i=0;i<9;i++){const a=i/9*6.283+(o.rot||0),r=1.2+(i%3)*.6;dot17(o.x+Math.cos(a)*r,h+Math.sin(t3*2+i)*.25,o.y+Math.sin(a)*r,2.4,'#7ab8ff',.35)}
     dot17(o.x,h,o.y,6,'#3a6aff',.25);(o.bolts||[]).forEach(b=>{if(b.t<b.max)zap17(V(o.x,o.y,h),V(b.x,b.y,0),'#cfe8ff',.95,b.seed+o.t*30,.45,.07)})});
   /* --- c17: làn khói 3D --- */
   (G.bl||[]).forEach(b=>{if(!b.smkR||b.hp<=0)return;(b.smkL||[b.smkR]).forEach((r,ri)=>{const nx=Math.max(2,Math.round(r.w/1.3)),nz=Math.max(2,Math.round(r.h/1.3));
     for(let i=0;i<nx;i++)for(let j=0;j<nz;j++)for(let l=0;l<2;l++){const m=K.SMK.get(),x=r.cx-r.w/2+(i+.5)*r.w/nx,z=r.cy-r.h/2+(j+.5)*r.h/nz,ph=t3*.8+i*1.7+j*2.3+l*2.1+ri;m.position.set(x+Math.sin(ph)*.18,(l?2.2:.85)+Math.sin(ph*1.3)*.15,z+Math.cos(ph)*.18);m.scale.set(.85*r.w/nx*1.15,(l?.95:1.0)+.1*Math.sin(ph),.85*r.h/nz*1.15);m.rotation.y=ph*.3}})});
   /* --- Lò hợp hạch mini: cột sáng 3D chiếu thẳng lên trời, cao tối đa 15 ô --- */
   en8L(G).forEach((b,i)=>{const x=b.x,z=b.y,H=15,p=.5+.5*Math.sin(t3*3+i),w=.55+.12*Math.sin(t3*7+i);
     beam17(V(x,z,.2),V(x,z,H),'#46b4ff',w*1.6,.35+.1*p);beam17(V(x,z,.2),V(x,z,H),'#bff0ff',w*.55,.85);
     beam17(V(x,z,H*.55),V(x,z,H),'#2a78ff',w*2.4,.18);
     dot17(x,.6,z,3.4+p,'#9fe8ff',.75);dot17(x,H,z,2.6+p*.8,'#7fd0ff',.55);
     tor17(x,.15,z,8,'#6ed2ff',.22+.08*p);for(let k=0;k<3;k++){const u=(t3*.45+k/3)%1;tor17(x,.3+u*H,z,.9+.5*(1-u),'#cfefff',(1-u)*.7)}
     if(Math.random()<.5)spark(x+(Math.random()-.5)*.8,.4,z+(Math.random()-.5)*.8,0,4+Math.random()*5,0,'#bfeaff',2.2,.18)});}
  catch(e){console.error(e)}finally{SK17=s17;sk24End()}}

/* sức mạnh thảm của đối thủ (PvP): vẽ bằng chính bộ vẽ thảm — vẽ thảm ta trước rồi vẽ tiếp thảm địch trong cùng khung hình */
if(typeof skill3d18==='function'&&typeof sk18Body==='function'){const o18=skill3d18;skill3d18=function(G,dt){const E=G&&G.c40e;if(!E)return o18(G,dt);const P=G.c40;
  if(!P){G.c40=E;try{return o18(G,dt)}finally{G.c40=P}}
  const B=sk18Body;sk18Body=function(G2,dt2,S2){const ps=Object.values(SK18).filter(p=>p&&typeof p.end==='function'),ends=ps.map(p=>p.end);ps.forEach(p=>p.end=()=>{});
    try{B(G2,dt2,P)}catch(e){console.error(e)}finally{ps.forEach((p,i)=>p.end=ends[i])}B(G2,dt2,E)};
  try{return o18(G,dt)}finally{sk18Body=B}}}
if(typeof skill3d20==='function'){const o20=skill3d20;skill3d20=function(G,dt){const E=G&&G.c40e;if(!E)return o20(G,dt);const P=G.c40;G.c40={u:(P&&P.u?P.u:[]).concat(E.u||[])};try{return o20(G,dt)}finally{G.c40=P}}}
[['skill3d21',1007,1010],['skill3d22',1011,1014],['skill3d23',1015,1017]].forEach(([n,a,b])=>{try{const o=eval(n);if(typeof o!=='function')return;const inR=S=>!!(S&&S.K>=a&&S.K<=b);
  const w=function(G,dt){const E=G&&G.c40e;if(inR(E)&&!inR(G.c40)){const P=G.c40;G.c40=E;try{return o(G,dt)}finally{G.c40=P}}return o(G,dt)};
  if(n==='skill3d21')skill3d21=w;else if(n==='skill3d22')skill3d22=w;else skill3d23=w}catch(e){}});
