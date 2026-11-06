function pvSetup(G,o){
  G.pvp=true;G.waves=1;G.wave=0;G.nextAt=1e9;G.pvo=o;
  const hq=G.hq,hx=hq.x,hy=hq.y,hs=Math.sqrt(o.fr),B=o.base;
  /* số căn cứ địch = số căn cứ của người chơi (theo cấp trụ sở); căn cứ có trụ sở đứng cuối, tường thành đứng sau mỗi căn cứ */
  const nB=Math.max(1,__mbSizes(bLv('hq')).length);
  const gens=[];for(let k=0;k<nB-1;k++){const g=pvGenBase(o.rank);g.items=g.items.filter(i=>!i.hqf);gens.push(g)}
  const bases=gens.concat([B]),last=bases.length-1;
  const GL=Math.max(1,Math.min(100,B.hqLv||1)),GH=(5000+500*(GL-1))/DFB*hs;
  /* bố trí dọc: căn cứ 1 sát tiền tuyến (cách trụ sở ta GAP ô), các căn cứ sau nằm lần lượt phía trên, cách nhau 4 ô (chứa tường thành) */
  let bottom=hy-GAP;
  const L=bases.map((b,k)=>{const R=b.R||16,top=bottom-R,ox=hx+hq.w/2-R/2,rec={b,k,R,top,ox,gate:null};bottom=top-4;return rec});
  const U=[];
  L.forEach(({b,k,R,top,ox})=>{
    b.items.forEach(it=>{
      const def=it.def,sp=BT[it.t],ex=ox+it.x+it.w/2,ey=top+it.y+it.h/2,f=hs,hp0=Math.max(2,hpAt(it.t,it.lv)/DFB)*f,
        wp=(sp&&(!def.nb||def.nb.k==='tur'))?[{w:null,sp:{k:sp.k,sp:sp.sp,spl:sp.spl,col:sp.col},dmg:sp.dmg*(1+.1*(it.lv-1))*hs,cd:sp.cd,t:Math.random()*sp.cd,rng:sp.rng,mx:0,my:0}]:[];
      const bd={t:it.t,v:!!it.v,nb:def.nb||null,lv:it.lv};
      const u={team:'e',sh:STUB,x:ex,y:ey,sx:ex,sy:ey,ang:Math.PI/2,hp:hp0,max:hp0,sp:0,size:Math.max(it.w,it.h)*1.1,sc:1e-4,ws:wp,tx:ex,ty:ey,boss:false,dm:1,hit:0,dead:false,spawn:0,sb:1,bd,inf:1,lh:-99,dly:1e9,w:it.w,h:it.h,red:it.t==='wall'?Math.min(.6,.02*it.lv):0,bk:k};
      U.push(u);if(it.hqf&&k===last)G.eh=u});
    if(k<last){const gx=ox+R/2,gy=top-2,g={team:'e',sh:STUB,x:gx,y:gy,sx:gx,sy:gy,ang:Math.PI/2,hp:GH,max:GH,sp:0,size:16,sc:1e-4,ws:[],tx:gx,ty:gy,boss:false,dm:1,hit:0,dead:false,spawn:0,sb:1,bd:{t:'wall',v:false,nb:null,lv:GL,gate:1},inf:1,lh:-99,dly:1e9,w:33,h:2,red:0,bk:k,gate:1,sink:null,y0:gy};
      U.push(g);L[k].gate=g}
  });
  if(!G.eh)G.eh=U[0];
  G.eu=U;U.forEach(u=>G.en.push(u));
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  const ext=(x,y,w,h)=>{x0=Math.min(x0,x-w/2);x1=Math.max(x1,x+w/2);y0=Math.min(y0,y-h/2);y1=Math.max(y1,y+h/2)};
  G.bl.forEach(b=>ext(b.x,b.y,b.w,b.h));U.forEach(u=>ext(u.x,u.y,u.w,u.h));
  const dx=16-x0,dy=8-y0;
  G.bl.forEach(b=>{b.x+=dx;b.y+=dy});U.forEach(u=>{u.x+=dx;u.y+=dy;u.sx=u.x;u.sy=u.y;u.tx=u.x;u.ty=u.y;if(u.gate)u.y0=u.y});
  G.wd.Wd=Math.max(44,x1-x0+32);G.wd.Hd=y1-y0+16;G.wd.R={x0:0,y0:0,x1:0,y1:0,k:0};
  const P=G.pl;P.x=hq.x;P.y=hq.y+hq.h/2+2.2;P.tx=P.x;P.ty=P.y;
  (G.al||[]).forEach((a,i,A)=>{a.x=P.x+(i-(A.length-1)/2)*3+(A.length===1?-2.5:0);a.y=P.y+1.6;a.sx=a.x;a.sy=a.y;a.tx=a.x;a.ty=a.y;a.ang=-Math.PI/2});
  G.pvZone={px0:x0+dx,px1:x1+dx,py0:y0+dy,py1:y1+dy};
  G.ehq=G.eh;
  G.pvB=L.map(r=>({k:r.k,units:U.filter(u=>u.bk===r.k),gate:r.gate,x:r.ox+r.R/2+dx,y:r.top+r.R+3+dy}));
  G.pvA=0;G.act=G.pvB[0];G.pvFxQ=[];G.pvRefill=-1;
  {const seen=new Set([o.os.id,o.os.n]),sh=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
   const op=sh(KSH.concat(typeof BSH!=='undefined'?BSH:[])),cl=[],uq=[];
   op.concat(cl).forEach(x=>{if(!seen.has(x.id)&&!seen.has(x.n)){seen.add(x.id);seen.add(x.n);uq.push(x)}});
   G.pvUQ=uq;o.esc=Math.min(101,o.esc||0);G.pvEsc=o.esc}
  G.pvEn=pvMkEnemy(G,o,G.act.x,G.act.y);G.en.push(G.pvEn);G.pvRs=0;G.pvT0=G.t;
  pvEscSpawn(G,0);
  G.cam={x:P.x,y:P.y};dfZoom=1;
  $('pvhm').textContent=(o.rk?'XẾP HẠNG':o.tab===2?'GIAO HỮU':'ĐẤU NHANH');hud.style.display='block';
  toast('Đối thủ: «'+o.base.ar+'» · '+nB+' căn cứ · trụ sở Lv.'+o.base.hqLv+' · '+(o.esc?o.esc+' tàu phụ':'không tàu phụ')+' · phá tường thành để mở căn cứ kế tiếp, phá trụ sở cuối cùng để thắng!');
}
