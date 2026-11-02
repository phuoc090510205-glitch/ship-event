/* ===== c70 (trong phạm vi c39): PvP — trải thảm riêng cho từng phe, phủ kín công trình của phe đó, hai thảm cách nhau ít nhất 1 ô ===== */
C39.mat3=function(c,pw,pd,T){if(!c||c.id==='cp0')return null;
  if(isAn(c)){const L=epicLive(ek(c)),tx=new T.CanvasTexture(L.cv);tx.encoding=T.sRGBEncoding;const ar=(L.cv.width/L.cv.height),want=pw/pd;if(want<ar){tx.repeat.set(want/ar,1);tx.offset.set((1-want/ar)/2,0)}else{tx.repeat.set(1,ar/want);tx.offset.set(0,(1-ar/want)/2)}
    return {m:new T.MeshStandardMaterial({map:tx,roughness:.8,metalness:.15,emissive:0xffffff,emissiveMap:tx,emissiveIntensity:.45,color:0xd0d0d0}),tx,k:ek(c)}}
  const tx=new T.CanvasTexture(tile(c));tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(pw/4,pd/4);tx.encoding=T.sRGBEncoding;
  return {m:new T.MeshStandardMaterial({map:tx,roughness:.75,metalness:.25,emissive:0xffffff,emissiveMap:tx,emissiveIntensity:.18,color:0xb0b8c8}),tx,k:null}};
C39.PADX=[];
C39.pvpPads=function(G,parent,T){C39.PADX=[];PAD3=null;
  const box=L=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;L.forEach(b=>{if(!b||!b.w)return;x0=Math.min(x0,b.x-b.w/2);y0=Math.min(y0,b.y-b.h/2);x1=Math.max(x1,b.x+b.w/2);y1=Math.max(y1,b.y+b.h/2)});return x0<1e9?{x0:x0-1,y0:y0-1,x1:x1+1,y1:y1+1}:null};
  const rp=box((G.bl||[]).filter(b=>!b.c39tmp)),re=box(G.eu||[]);
  if(rp&&re){/* giữ khoảng cách tối thiểu 1 ô giữa hai thảm */const ov=(a,b)=>a.x0<b.x1+1&&a.x1+1>b.x0&&a.y0<b.y1+1&&a.y1+1>b.y0;if(ov(rp,re)){if(re.y1<=rp.y1)re.y1=Math.min(re.y1,rp.y0-1);else re.y0=Math.max(re.y0,rp.y1+1)}}
  const put=(R,c,tag)=>{if(!R||!c)return;const w=R.x1-R.x0,d=R.y1-R.y0;if(w<=0||d<=0)return;const M=C39.mat3(c,w,d,T);if(!M)return;
    const m=new T.Mesh(new T.BoxGeometry(w,.05,d),M.m);m.position.set((R.x0+R.x1)/2,.028,(R.y0+R.y1)/2);m.receiveShadow=true;parent.add(m);
    const e=new T.Mesh(new T.BoxGeometry(w+.1,.03,d+.1),new T.MeshBasicMaterial({color:tag==='p'?0x4fd8ff:0xff6a7a}));e.position.set(m.position.x,.004,m.position.z);parent.add(e);
    if(M.k)C39.PADX.push({k:M.k,tx:M.tx})};
  put(rp,cur(),'p');put(re,G.c65cp&&G.c65cp.c,'e');G.c70=1};
setInterval(()=>{try{if(!C39.PADX.length||typeof DG==='undefined'||!DG||DG.done||!DG.pvp)return;const t=performance.now()/1000,seen={};C39.PADX.forEach(p=>{if(!seen[p.k]){seen[p.k]=1;epicDraw(p.k,t)}p.tx.needsUpdate=true})}catch(e){}},70);
