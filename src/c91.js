/* ===== c91: PvP — tàu địch hồi sinh luôn tiếp tục tấn công · ĐẤU HẠNG 2 VS 2 (4 thảm khác nhau xếp dọc, cách nhau 1 ô, mỗi đội 1 trụ sở của người mạnh hơn) ===== */
const C91=(function(){
const DB2=()=>typeof DFB!=='undefined'?DFB:50;
const rnd=a=>a[(Math.random()*a.length)|0];
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const nm=()=>rnd(BNM)+' '+rnd(TG);
const bx=L=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;L.forEach(b=>{if(!b||!b.w)return;x0=Math.min(x0,b.x-b.w/2);y0=Math.min(y0,b.y-b.h/2);x1=Math.max(x1,b.x+b.w/2);y1=Math.max(y1,b.y+b.h/2)});return x0<1e9?{x0:x0-1,y0:y0-1,x1:x1+1,y1:y1+1}:null};
const mv=(L,dx,dy)=>L.forEach(u=>{if(!u)return;u.x+=dx;u.y+=dy;if(u.sx!=null)u.sx+=dx;if(u.sy!=null)u.sy+=dy;if(u.tx!=null)u.tx+=dx;if(u.ty!=null)u.ty+=dy});
const cpById=id=>(window.C39&&C39.CP||[]).find(c=>c.id===id)||null;

/* ---------- 1) tàu địch hồi sinh / bị kẹt: luôn lao vào tấn công ---------- */
function ours(G){return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead&&!u.ghost)}
function nearT(G,e){let b=null,bd=1e9;ours(G).forEach(u=>{const d=Math.hypot(u.x-e.x,u.y-e.y);if(d<bd){bd=d;b=u}});
  if(!b)(G.bl||[]).forEach(u=>{if(u.hp<=0||u.t==='mine')return;const d=Math.hypot(u.x-e.x,u.y-e.y)-Math.max(u.w||1,u.h||1)*.4;if(d<bd){bd=d;b=u}});return b?{u:b,d:bd}:null}
const rmax=e=>(e.ws&&e.ws.length)?Math.max(...e.ws.map(w=>w.rng||0)):5;
function keepAtk(G,dt){
  (G.en||[]).forEach(e=>{if(!(e.pvE||e.pvEsc))return;
    if(e.dead){e.c91dd=1;e.c91w=null;return}
    if(e.c91dd){e.c91dd=0;/* vừa hồi sinh: đặt lên ô trống gần phía ta nhất của thảm địch + xóa trạng thái AI cũ */
      try{if(e!==G.pvEn)espawn(G,[e])}catch(x){}
      const a=e._ai;if(a){a.ret=0;a.st=0;a.mx=e.x;a.my=e.y;a.hc=0}e._px=e.x;e._py=e.y;e.vx=0;e.vy=0;if(e.spawn>G.t)e.spawn=G.t;e.c91w={x:e.x,y:e.y,t:0,p:.8,a:0}}
    if(e.spawn>G.t||e.stun>0)return;
    if(e.c91sp0==null||e.sp>e.c91sp0)e.c91sp0=e.sp;if(!(e.sp>.05))e.sp=e.c91sp0||2.5;
    const W=e.c91w||(e.c91w={x:e.x,y:e.y,t:0,p:0,a:0});W.t+=dt;
    if(W.t>=1.2){const m=Math.hypot(e.x-W.x,e.y-W.y),T=nearT(G,e);if(m<.35&&T&&T.d>rmax(e)*.9){W.p=1.4;W.a++}else if(m>=.35)W.a=0;W.x=e.x;W.y=e.y;W.t=0}
    if(W.p>0){W.p-=dt;const T=nearT(G,e);if(!T)return;let an=Math.atan2(T.u.y-e.y,T.u.x-e.x);if(W.a>1)an+=(W.a%2?1:-1)*Math.min(1.4,.5*W.a);
      if(T.d<=rmax(e)*.85){W.p=0;return}
      const s=Math.max(1.5,e.sp)*dt;e.x=Math.max(.5,Math.min(G.wd.Wd-.5,e.x+Math.cos(an)*s));e.y=Math.max(.5,Math.min(G.wd.Hd-.5,e.y+Math.sin(an)*s));e.ang=an;e._px=e.x;e._py=e.y}})}

/* ---------- 2) ĐẤU ĐÔI 2 VS 2 ---------- */
try{if(!MODES.some(m=>/2 VS 2/.test(m)))MODES.push('ĐẤU ĐÔI · 2 VS 2')}catch(e){}
function gen(o){const pool=KSH.concat(typeof BSH!=='undefined'?BSH:[]),r=rankNow();
  let cps=shuf((window.C39&&C39.CP||[]).filter(c=>c.tier>=2&&c.id!=='cp0'&&c.id!==S.carpet));const seen=new Set();cps=cps.filter(c=>{const k=c.n;if(seen.has(k))return false;seen.add(k);return true});
  const fa=window.__c91fa!=null?+window.__c91fa:.8+Math.random()*.5,f2=.72+Math.random()*.25,mine=(()=>{try{return Math.max(0,PWR.fleet().length-1)}catch(e){return 0}})();
  let mp=1,op=1;try{mp=PWR.total();op=PWR.opp(o)}catch(e){}
  const X={an:nm(),as:rnd(pool),fa,apw:mp*fa,ally:fa>1,ab:pvGenBase(r),acp:cps[1]&&cps[1].id,aci:(Math.random()*CAP.length)|0,
    n3:nm(),os2:rnd(pool),f2,epw:op*f2,eb:pvGenBase(o.rank),ecp2:cps[2]&&cps[2].id,aEsc:Math.min(30,mine),e2Esc:Math.min(30,mine)};
  o.c91cp1=cps[0]&&cps[0].id;o.c91=X;o.mode=2;window.__c91o=o;return X}
/* chỉ số thảm lên một nhóm công trình (thảm của đồng đội / đối thủ thứ 2) */
function cstat(L,c,team,hq){if(!c||!window.C39||!C39.TIERS||!C39.KINDS)return;const t=C39.TIERS[c.tier],K=(C39.KINDS[c.kind]||{}).k,V=t&&t.V||0;if(!V)return;
  L.forEach(u=>{const add=V+(K==='hp'||K==='rev'?V:0)+(K==='hq'&&u===hq?V*3:0);u.max+=add/DB2();u.hp+=add/DB2();
    const sh=(t.arm||0)+(K==='shd'?V:0);if(sh>0){const v=sh/DB2();u.shd={v:(u.shd&&u.shd.v||0)+v,max:(u.shd&&u.shd.max||0)+v,t:1e9}}
    if(K==='red')u.red=Math.min(.6,(u.red||0)+Math.min(50,V*.03)/100);
    const dk=1+(K==='dmg'||K==='rage'?V*.06/100:0),rf=1+(K==='rof'?V*.04/100:0),rg=1+(K==='rng'?V*.02/100:0);
    if(team==='e')(u.ws||[]).forEach(w=>{w.dmg*=dk;w.cd/=rf;w.rng*=rg});
    else if(u.spec&&(dk>1||rf>1||rg>1))u.spec=Object.assign({},u.spec,{dmg:u.spec.dmg*dk,cd:u.spec.cd/rf,rng:u.spec.rng*rg})})}
function eUnit(o,it,x,y){const def=it.def,sp=BT[it.t],hs=Math.sqrt(o.fr||1),hp0=Math.max(2,hpAt(it.t,it.lv)/DB2())*hs,
  wp=(sp&&(!def.nb||def.nb.k==='tur'))?[{w:null,sp:{k:sp.k,sp:sp.sp,spl:sp.spl,col:sp.col},dmg:sp.dmg*(1+.1*(it.lv-1))*hs,cd:sp.cd,t:Math.random()*sp.cd,rng:sp.rng,mx:0,my:0}]:[];
  return {team:'e',sh:STUB,x,y,sx:x,sy:y,ang:Math.PI/2,hp:hp0,max:hp0,sp:0,size:Math.max(it.w,it.h)*1.1,sc:1e-4,ws:wp,tx:x,ty:y,boss:false,dm:1,hit:0,dead:false,spawn:0,sb:1,bd:{t:it.t,v:!!it.v,nb:def.nb||null,lv:it.lv},inf:1,lh:-99,dly:1e9,w:it.w,h:it.h,red:it.t==='wall'?Math.min(.6,.02*it.lv):0,c91g:'e2'}}
function aBld(it,i,x,y){const def=it.def,hp=Math.max(2,hpAt(it.t,it.lv)/DB2());
  return {id:(def.id||it.t)+'_c91a'+i,t:it.t,n:def.n,x,y,w:it.w,h:it.h,v:!!it.v,hp,max:hp,lv:it.lv,cd:Math.random()*.6,spec:BT[it.t]?Object.assign({},BT[it.t]):null,nb:def.nb||null,used:false,red:it.t==='wall'?Math.min(.6,.02*it.lv):0,c91g:'al',hq:false}}
function aShip(G,o,sh,x,y,k,name){const tier=Math.min(10,2+Math.floor(rankNow()/1.5)),a=dfMakeShip(sh,'p',dfLoadout(sh,tier),{},x,y,{dmgDiv:12,size:k<1?2.1:2.5,inf:1});
  const P=G.pl,dp=P.ws.reduce((s,w)=>s+w.dmg/Math.max(.1,w.cd),0)*(P.dm||1),de=a.ws.reduce((s,w)=>s+w.dmg/Math.max(.1,w.cd),0),f=o.c91.fa;
  a.hp=a.max=Math.max(1,P.max*f*k);a.dm=de>0?Math.max(.2,Math.min(6,dp*f*k/de)):1;a.ally=1;a.name=name;a.ang=-Math.PI/2;a.sx=a.tx=x;a.sy=a.ty=y;a.c91a=1;
  try{ecap(G,a)}catch(e){}return a}
function setup2(G,o){const X=o.c91;G.c91=X;
  const me=(G.bl||[]).filter(b=>!b.c39tmp);me.forEach(b=>b.c91g='me');(G.eu||[]).forEach(u=>u.c91g='e1');
  /* căn cứ đồng đội (phe ta: phía trước là hướng lên) */
  const AB=X.ab,al=[];let ahq=null;AB.items.forEach((it,i)=>{if(it.hqf&&!X.ally)return;const b=aBld(it,i,it.x+it.w/2,AB.R-(it.y+it.h/2));if(it.hqf){b.hq=true;b.hp=b.max=Math.max(b.max,G.hq.max);ahq=b}al.push(b)});
  if(X.ally&&ahq){const h=G.hq;h.hq=false;const ix=G.bl.indexOf(h);if(ix>=0)G.bl.splice(ix,1);const j=me.indexOf(h);if(j>=0)me.splice(j,1);G.c91myHq=h;G.hq=ahq}
  al.forEach(b=>G.bl.push(b));
  /* căn cứ đối thủ thứ 2 (không có trụ sở) */
  const EB=X.eb,e2=[];EB.items.forEach(it=>{if(it.hqf)return;e2.push(eUnit(o,it,it.x+it.w/2,it.y+it.h/2))});e2.forEach(u=>{G.eu.push(u);G.en.push(u)});
  /* xếp 4 thảm theo chiều dọc, cách nhau đúng 1 ô */
  const e1=(G.eu||[]).filter(u=>u.c91g==='e1'),order=[e1,e2].concat(X.ally?[me,al]:[al,me]),boxes=order.map(bx);
  const W=Math.max(...boxes.map(b=>b?b.x1-b.x0:0)),Wd=Math.max(44,W+32),cx=Wd/2;let cy=8;
  order.forEach((L,i)=>{const B=boxes[i];if(!B)return;const dx=cx-(B.x0+B.x1)/2,dy=cy-B.y0;mv(L,dx,dy);cy=B.y1+dy+1});
  G.wd.Wd=Wd;G.wd.Hd=cy-1+8;
  const bm=bx(me),ba=bx(al),be=bx(e1);G.c39reg=bm;G.c65reg=be;G.c91box={me:bm,al:ba,e1:be,e2:bx(e2)};
  G.pvZone={px0:Math.min(bm.x0,ba.x0)+1,px1:Math.max(bm.x1,ba.x1)-1,py0:Math.min(bm.y0,ba.y0)+1,py1:Math.max(bm.y1,ba.y1)-1};
  /* chỉ số thảm của đồng đội + đối thủ thứ 2 */
  cstat(al,cpById(X.acp),'p',ahq);cstat(e2,cpById(X.ecp2),'e',null);
  /* tàu: ta ở mép trước thảm của mình, đồng đội ở mép trước thảm đồng đội */
  const P=G.pl;P.x=cx;P.y=bm.y0+1.4;P.tx=P.x;P.ty=P.y;P.sx=P.x;P.sy=P.y;
  (G.al||[]).forEach((a,i,A)=>{a.x=Math.max(1,Math.min(Wd-1,P.x+(i-(A.length-1)/2)*2.4));a.y=P.y+1.3+Math.floor(i/12)*1.3;a.sx=a.tx=a.x;a.sy=a.ty=a.y;a.ang=-Math.PI/2});
  const ay=ba.y0+1.4,am=aShip(G,o,X.as,cx,ay,1,X.an);G.al.push(am);G.c91am=am;
  for(let i=0;i<X.aEsc;i++){const sh=rnd(KSH),a=aShip(G,o,sh,Math.max(1,Math.min(Wd-1,cx+((i%10)-4.5)*2.4)),ay+1.3+Math.floor(i/10)*1.3,.55,'Tàu phụ '+X.an);G.al.push(a)}
  /* tàu chính + tàu phụ của đối thủ thứ 2 (vị trí cuối cùng do espawn đặt lên ô trống gần ta nhất) */
  const o2=Object.assign({},o,{g:o.g*X.f2,n2:X.n3}),ex=cx,ey=(G.c91box.e2||be).y1-1;
  const m2=pvMkEnemy(G,o2,ex,ey,1,X.os2);m2.pvE=0;m2.pvEsc=1;m2.c91m=1;m2.name=X.n3;G.en.push(m2);G.pvEn2=m2;
  for(let i=0;i<X.e2Esc;i++){const e=pvMkEnemy(G,o2,ex+((i%10)-4.5)*2.4,ey,.55,rnd(KSH));e.name='Tàu phụ '+X.n3;G.en.push(e)}
  G.cam={x:P.x,y:P.y};
  setTimeout(()=>{try{toast('2 VS 2 · Đồng đội: '+X.an+(X.ally?' (trụ sở đội ta)':'')+' · Đối thủ: '+o.n2+' & '+X.n3)}catch(e){}},2600)}
{const _F=pvFind;pvFind=function(){const r=_F.apply(this,arguments);try{if(PVO&&PVO.mode===2&&!PVO.c91)gen(PVO)}catch(e){console.error(e)}return r}}
{const _V=pvVS;pvVS=function(st,o){const r=_V.apply(this,arguments);try{const X=o&&o.c91;if(!X)return r;
  const L=vs.querySelector('.pvc.L');if(L&&!L.querySelector('.c91t'))L.querySelector('.lv').insertAdjacentHTML('beforebegin',`<div class="nm c91t" style="color:#9fffc8">+ Đồng đội: ${X.an} · ⚔ ${PWR.fmt(X.apw)}${X.ally?' · giữ trụ sở':''}</div>`);
  const R=vs.querySelector('#pvrc .pvc');if(R&&st==='f'&&!R.querySelector('.c91t'))R.querySelector('.lv').insertAdjacentHTML('beforebegin',`<div class="nm c91t" style="color:#ffb3b3">+ Đồng đội: ${X.n3} · ⚔ ${PWR.fmt(X.epw)}</div>`)}catch(e){}return r}}
{const _P=pvSetup;pvSetup=function(G,o){const r=_P.apply(this,arguments);try{if(o&&o.mode===2&&o.c91)setup2(G,o)}catch(e){console.error(e)}return r}}
/* thảm 3D: 4 thảm riêng cho 4 người chơi */
(function hk(){if(!window.C39||!C39.pvpPads||!C39.mat3){setTimeout(hk,300);return}if(C39.pvpPads.c91)return;const _p=C39.pvpPads;
  C39.pvpPads=function(G,parent,T){if(!G||!G.c91)return _p.apply(this,arguments);C39.PADX=[];const X=G.c91;
    const grp=[['me',(G.bl||[]).filter(b=>b.c91g==='me'||(b.hq&&!b.c91g)),cpById(S.carpet),'p'],['al',(G.bl||[]).filter(b=>b.c91g==='al'),cpById(X.acp),'p'],['e1',(G.eu||[]).filter(u=>u.c91g==='e1'),G.c65cp&&G.c65cp.c,'e'],['e2',(G.eu||[]).filter(u=>u.c91g==='e2'),cpById(X.ecp2),'e']];
    grp.forEach(([k,L,c,tag])=>{const R=bx(L);if(!R)return;const w=R.x1-R.x0,d=R.y1-R.y0;
      const e=new T.Mesh(new T.BoxGeometry(w+.1,.03,d+.1),new T.MeshBasicMaterial({color:tag==='p'?0x4fd8ff:0xff6a7a}));e.position.set((R.x0+R.x1)/2,.004,(R.y0+R.y1)/2);parent.add(e);
      const M=c&&c.id!=='cp0'?C39.mat3(c,w,d,T):null;if(!M)return;const m=new T.Mesh(new T.BoxGeometry(w,.05,d),M.m);m.position.set((R.x0+R.x1)/2,.028,(R.y0+R.y1)/2);m.receiveShadow=true;parent.add(m);if(M.k)C39.PADX.push({k:M.k,tx:M.tx})});
    G.c70=1};C39.pvpPads.c91=1})();
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.pvp&&!G.done)keepAtk(G,dt)}catch(e){console.error(e)}return r}}
return {gen,setup2,keepAtk,cstat};
})();
window.C91=C91;
