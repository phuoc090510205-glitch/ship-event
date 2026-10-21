
/* ===== c25: Kho tàu — ô đối xứng hai bên · tốc chạy 40 + quay đầu 40 giảm theo độ nặng · năng lượng từ lõi hạt nhân · modul tính theo số ô ===== */
(function(){
const N1=n=>String(Math.round((+n||0)*10)/10).replace('.',',');
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
const cellsOf=x=>x&&x.cells?x.cells.length:((x&&x.w||1)*(x&&x.h||1));
/* mỗi cấp: 1 ô +4%, 2 ô +5%, 3 ô +6%, … */
const LVK=(x,l)=>1+(3+cellsOf(x))/100*(((l||aLv(x.id))|0)-1);
/* độ nặng: 1.000 KL còn 50%, 2.000 KL còn 33% */
const MF=m=>1000/(1000+Math.max(0,m));
const BASE_SP=40,BASE_TURN=40,TURN_DEG=6,SP_DIV=12;
const C=window.C25={cellsOf,LVK,MF,BASE_SP,BASE_TURN,TURN_DEG,SP_DIV};

/* ---------- 1) ô trong kho tàu đều hai bên ---------- */
function mirror(g){if(!g||!g.length)return g;const W=g[0].length;
  return g.map(r=>{const a=r.split('');for(let i=0;i<Math.floor(W/2);i++){const j=W-1-i,L=a[i],R=a[j];if(L===R)continue;const v=L!=='.'?L:R;a[i]=v;a[j]=v}return a.join('')})}
C.mirror=mirror;
function fixShip(sh){if(!sh||sh._c25)return;sh._c25=1;const d=Object.getOwnPropertyDescriptor(sh,'g');
  if(sh.gFull){sh.gFull=mirror(sh.gFull);if(sh.nolock||!(d&&d.get))sh._mg=sh.gFull}
  else if(d&&'value' in d)sh.g=mirror(sh.g);
  sh._pool=null;sh._mlv=null;if(!sh.nolock)sh._mg=null;sh._pr={};sh._sl=null;sh._br=null}
(typeof KSH!=='undefined'?KSH:[]).forEach(fixShip);
try{(typeof BSH!=='undefined'?BSH:[]).forEach(fixShip)}catch(e){}
/* ô khóa theo cấp: khóa và mở theo từng cặp đối xứng (ô giữa trục đi một mình) */
shPool=function(sh){
  if(sh._pool)return sh._pool;const G=sh.gFull,W=G[0].length,by={r:[],b:[],g:[],y:[]};
  G.forEach((row,j)=>[...row].forEach((c,i)=>{if(by[c])by[c].push([i,j])}));
  const q={b:Math.floor(by.b.length/2),g:Math.floor(by.g.length/2),y:Math.floor(by.y.length/2),r:by.r.length>=20?Math.floor(by.r.length/4):0},ord={};
  Object.keys(by).forEach(k=>{const a=by[k],n=a.length||1,cx=a.reduce((t,c)=>t+c[0],0)/n,cy=a.reduce((t,c)=>t+c[1],0)/n,seen=new Set(),gs=[];
    a.map(c=>[c[0],c[1],Math.hypot(c[0]-cx,c[1]-cy)]).sort((u,v)=>v[2]-u[2]||u[1]-v[1]||u[0]-v[0]).forEach(c=>{const key=c[0]+','+c[1];if(seen.has(key))return;seen.add(key);
      const grp=[[c[0],c[1],k]],mx=W-1-c[0],mk=mx+','+c[1];if(mx!==c[0]&&G[c[1]][mx]===k&&!seen.has(mk)){seen.add(mk);grp.push([mx,c[1],k])}gs.push(grp)});
    let cnt=0;ord[k]=[];for(const g of gs){if(cnt+g.length>q[k])continue;ord[k].push(g);cnt+=g.length}});
  const seq=['b','g','y','b','r','b','g','y','b','b'],pool=[];let guard=0,tot=0;
  while(tot<20&&guard++<600){const k=seq[guard%seq.length];if(!ord[k].length)continue;const g=ord[k][0];if(tot+g.length>20){ord[k].shift();continue}pool.push(ord[k].shift());tot+=g.length}
  return sh._pool=pool};
shSync=function(sh){if(sh.nolock)return;const l=shLv(sh.id);if(sh._mlv!==l||!sh._mg){sh._mlv=l;sh._pr={};sh._sl=null;
  const u=shU(l),P=shPool(sh),rows=sh.gFull.map(r=>r.split(''));let open=0,i=0;
  for(;i<P.length;i++){if(open+P[i].length>u)break;open+=P[i].length}
  P.slice(i).forEach(g=>g.forEach(c=>{rows[c[1]][c[0]]='.'}));sh._mg=rows.map(r=>r.join(''))}};

/* ---------- 2) số liệu modul mới ---------- */
const M0=x=>{if(x.m0==null)x.m0=x.mass};
ENG.forEach(e=>{M0(e);e.mass=Math.round(e.m0*3.5);e.en=2*cellsOf(e)});          /* tốc chạy: khối lượng +250% */
ARM.forEach(a=>{M0(a);a.mass=Math.round(a.m0*4);a.reg=0});                         /* khiên: khối lượng +300%, không hồi máu */
NUC.forEach(n=>{M0(n);n.mass=30*cellsOf(n)});                                       /* lõi hạt nhân: 30 KL mỗi ô */
MRD.forEach(m=>{M0(m);m.mass=0;m.en=2*cellsOf(m)});                                 /* giảm KL: bản thân không nặng */
/* súng: năng lượng tiêu hao +300% */
WP.forEach(w=>{const c=WPE[w.id]!=null?WPE[w.id]:.3;WPE[w.id]=Math.round(c*4*100)/100;const u=(String(w.en||'').match(/\/\s*(.+)$/)||[])[1]||'phát';w.en=String(WPE[w.id]).replace('.',',')+' / '+u});
enAt=function(e,l){l=l||aLv(e.id);const c=cellsOf(e),k=LVK(e,l);return {l,cells:c,sp:Math.round(6*c*k*10)/10,acc:Math.round(6*c*k*10)/10,en:2*c,mass:e.mass,thr:0,vmax:0}};
mAt=function(m,l){l=l||aLv(m.id);const c=cellsOf(m),k=LVK(m,l);return {l,cells:c,red:Math.round(50*c*k),en:2*c,mass:0,pct:0,cap:0,stab:0}};
nAt=function(n,l){l=l||aLv(n.id);const c=cellsOf(n),k=LVK(n,l);return {l,cells:c,pw:Math.round(3*c*k*10)/10,mass:30*c,eff:0,stab:0,res:0}};
{const _A=arAt;arAt=function(a,l){const q=_A(a,l);q.reg=0;q.mass=a.mass;return q}}

/* ---------- 3) năng lượng: lõi cấp, động cơ + giảm KL dùng (2 mỗi ô) ---------- */
function power(nuc,eng,mrd,force){let sup=0;(nuc||[]).forEach(it=>{const n=NUC.find(x=>x.id===it.id);if(n)sup+=nAt(n).pw});
  let left=sup;const take=(L,list)=>(L||[]).map(it=>{const m=list.find(x=>x.id===it.id);if(!m)return false;const c=2*cellsOf(m);if(force||c<=left+1e-9){left-=c;return true}return false});
  const engOn=take(eng,ENG),mrdOn=take(mrd,MRD);
  return {sup:Math.round(sup*10)/10,use:Math.round((sup-left)*10)/10,left:Math.round(left*10)/10,engOn,mrdOn,off:engOn.filter(x=>!x).length+mrdOn.filter(x=>!x).length}}
C.power=power;

/* ---------- 4) chỉ số tàu ---------- */
khStats=function(cur,wm,fit,arm,eng,nuc,tnk,mrd,skl,hlv){const HQ=hAt(hlv===undefined?shLv(cur.id):hlv);
  wm=wm||khWpMap(cur);arm=arm||khArmor(cur);eng=eng||khEngines(cur);nuc=nuc||khReactors(cur);tnk=tnk||khTanks(cur);mrd=mrd||khMassMods(cur);skl=skl||khSkills(cur);
  const b=khCount(cur,'b'),g=khCount(cur,'g'),y=khCount(cur,'y'),wmass=khUsed(wm).ms,A=khArmSum(arm),T=khTnkSum(tnk),Sk=khSkSum(skl);
  const N={n:nuc.length,mass:0,cells:0};nuc.forEach(it=>{const n=NUC.find(x=>x.id===it.id);if(!n)return;N.mass+=n.mass;N.cells+=cellsOf(n)});
  const PW=power(nuc,eng,mrd,window.c25Force);
  const E={n:eng.length,sp:0,acc:0,mass:0,cells:0,on:0};eng.forEach((it,i)=>{const e=ENG.find(x=>x.id===it.id);if(!e)return;E.mass+=e.mass;E.cells+=cellsOf(e);if(PW.engOn[i]){const q=enAt(e);E.sp+=q.sp;E.acc+=q.acc;E.on++}});
  const Mm={n:mrd.length,red:0,cells:0,on:0};mrd.forEach((it,i)=>{const m=MRD.find(x=>x.id===it.id);if(!m)return;Mm.cells+=cellsOf(m);if(PW.mrdOn[i]){Mm.red+=mAt(m).red;Mm.on++}});
  const hull=150+6*(b+g+y),mass0=Math.round(hull+wmass+A.mass+E.mass+N.mass+T.mass+Sk.mass);
  const red=Math.min(Mm.red,mass0*.8),mass=Math.round(mass0-red),mf=MF(mass);
  const hp=Math.max(10,Math.round((1200+45*b+25*g+T.hp)/100)+HQ.hp+Math.round(A.dur));
  const spRaw=BASE_SP+E.sp+(HQ.sp||0),speed=Math.round(spRaw*mf*10)/10,turn=Math.round(BASE_TURN*mf*10)/10;
  let wd=0,wmax=0;Object.keys(wm).forEach(i=>wm[i].forEach(it=>{const w=wpGet(it.id);if(!w)return;const c=wCost(w.id);wd+=c/Math.max(.1,wSec(w));wmax=Math.max(wmax,c)}));
  return {b,g,y,wmass,amass:A.mass,emass:E.mass,nmass:N.mass,tmass:T.mass,mmass:0,kmass:Sk.mass,hull,mass,mass0,red,hp,
    speed,speed0:speed,spT:{'11':speed,'10':speed,'01':speed,'00':speed},spRaw,espd:E.sp,turn,mf,blk:A.blk,reg:0,dly:A.dly,anum:A.n,acells:A.cells,
    enum:E.n,eon:E.on,ecells:E.cells,vmax:0,acc:E.acc,thr:0,en:2*E.cells,nnum:N.n,ncells:N.cells,tnum:T.n,mnum:Mm.n,mon:Mm.on,mred:Mm.red,mcells:Mm.cells,
    enMax:1+T.cap,enGen:1+Math.max(0,PW.left),pwSup:PW.sup,pwUse:PW.use,pwLeft:PW.left,pwOff:PW.off,wdrain:wd,wmaxc:wmax,edrain:0,mdrain:0,res:0}};
let LAST=null;
dfStats=function(sh,wm,fit,arm,eng,nuc,tnk,mrd,skl,hlv){const t=khStats(sh,wm,fit,arm,eng,nuc,tnk,mrd,skl,hlv),sp=Math.max(.5,t.speed/SP_DIV);LAST={turn:t.turn*TURN_DEG};
  return {hp:t.hp,speed:sp,speed0:sp,spT:{'11':sp,'10':sp,'01':sp,'00':sp},mass:t.mass,blk:t.blk,reg:0,dly:t.dly,acc:t.acc,enMax:t.enMax,enGen:t.enGen,edrain:0,mdrain:0,turn:t.turn*TURN_DEG}};
{const _M=dfMakeShip;dfMakeShip=function(){LAST=null;const r=_M.apply(this,arguments);if(r&&LAST)r.turn=LAST.turn;return r}}

/* ---------- 5) trong trận: tàu quay đầu và đổi hướng theo chỉ số QUAY ĐẦU ---------- */
const wrapA=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
const omega=P=>(P.turn>0?P.turn:240)*Math.PI/180;
window.c25Turn=function(P,a,dt){if(P.ang==null||!isFinite(P.ang))return a;const w=omega(P)*dt,d=wrapA(a-P.ang);return P.ang+Math.max(-w,Math.min(w,d))};
window.c25Move=function(P,dvx,dvy,accE,dt){const kk=Math.min(1,3*(1+(accE||0)/100)*dt),w=omega(P)*dt;
  let vx=P.vx||0,vy=P.vy||0;const ds=Math.hypot(dvx,dvy);
  if(P.mh==null||!isFinite(P.mh))P.mh=Math.hypot(vx,vy)>.05?Math.atan2(vy,vx):(isFinite(P.ang)?P.ang:-Math.PI/2);
  if(ds<1e-4){vx+=(0-vx)*kk;vy+=(0-vy)*kk}
  else{const ta=Math.atan2(dvy,dvx),d=wrapA(ta-P.mh);P.mh=wrapA(P.mh+Math.max(-w,Math.min(w,d)));
    const rem=Math.abs(wrapA(ta-P.mh)),tgt=ds*Math.max(.25,Math.cos(Math.min(rem,Math.PI/2))),sp=Math.hypot(vx,vy),ns=sp+(tgt-sp)*kk;
    vx=Math.cos(P.mh)*ns;vy=Math.sin(P.mh)*ns}
  P.vx=vx;P.vy=vy;P.x+=vx*dt;P.y+=vy*dt};

/* ---------- 6) Kho: chặn lắp khi thiếu năng lượng, chặn tháo lõi đang cấp điện ---------- */
const say=m=>{try{toast(m)}catch(e){}};
window.c25Can=function(cur,w){if(!w||!(w.eng||w.mrd))return true;
  const PW=power(khReactors(cur),khEngines(cur),khMassMods(cur)),need=2*cellsOf(w);
  if(need>PW.left+1e-9){say('Không đủ năng lượng: '+w.n+' cần '+need+' NL, tàu còn '+N1(Math.max(0,PW.left))+' NL. Lắp thêm lõi hạt nhân (mỗi ô +3 NL).');return false}return true};
window.c25CanRemove=function(cur,sk,idx){if(sk!=='n'&&sk!=='all:g')return true;
  const nuc=khReactors(cur).slice(),eng=khEngines(cur),mrd=khMassMods(cur),before=power(nuc,eng,mrd).off;
  if(sk==='n')nuc.splice(idx,1);else nuc.length=0;const after=power(nuc,eng,mrd);
  if(after.off>before){say('Không tháo được: động cơ và bộ giảm KL đang dùng năng lượng của lõi này. Tháo bớt chúng trước.');return false}return true};

/* ---------- 7) bảng chỉ số trong Kho (bỏ ô KHIÊN) ---------- */
khInfo=function(cur,wm,fit){
  const t=khStats(cur,wm,fit),f=n=>Math.round(n).toLocaleString('vi-VN'),pct=Math.round(t.mf*100),warn=t.wmaxc>t.enMax;
  const el=$('khinfo');if(!el)return;
  el.innerHTML=
   `<div class="khin"><h5><i style="background:#ff5a6a"></i>MÁU</h5><strong>${f(t.hp)}</strong><small>${t.b} ô giáp · ${t.g} ô lõi${t.anum?' · +'+f(khArmSum(khArmor(cur)).dur)+' từ '+t.anum+' khiên':''}</small><div class="bar"><i style="width:${Math.min(100,t.hp)}%;background:#ff5a6a"></i></div></div>`+
   `<div class="khin"><h5><i style="background:#ffc53d"></i>TỐC CHẠY</h5><strong>${N1(t.speed)}<em> điểm</em></strong><small>Gốc ${BASE_SP}${t.espd?' + động cơ '+N1(t.espd):''} = ${N1(t.spRaw)} · độ nặng còn ${pct}%${t.acc?' · gia tốc +'+N1(t.acc)+'%':''}</small><div class="bar"><i style="width:${Math.min(100,t.speed/1.2)}%;background:#ffc53d"></i></div></div>`+
   `<div class="khin"><h5><i style="background:#ff9f43"></i>QUAY ĐẦU</h5><strong>${N1(t.turn)}<em> điểm</em></strong><small>Gốc ${BASE_TURN} · độ nặng còn ${pct}% · càng nặng càng khó quay đầu</small><div class="bar"><i style="width:${Math.min(100,t.turn/.4)}%;background:#ff9f43"></i></div></div>`+
   `<div class="khin"><h5><i style="background:#34e08a"></i>NĂNG LƯỢNG</h5><strong>${N1(t.pwLeft)}<em> / ${N1(t.pwSup)} còn dư</em></strong><small style="${t.pwOff||warn?'color:#ff9aa5':''}">Lõi hạt nhân cấp ${N1(t.pwSup)} · động cơ + giảm KL dùng ${N1(t.pwUse)}${t.pwOff?' · ⚠ '+t.pwOff+' modul thiếu năng lượng, chưa hoạt động':''} · súng: dự trữ ${N1(t.enMax)}, hồi +${N1(t.enGen)}/s, bắn −${N1(t.wdrain)}/s${warn?' · ⚠ súng cần ≥'+N1(t.wmaxc):''}</small><div class="bar"><i style="width:${t.pwSup?Math.min(100,t.pwUse/t.pwSup*100):0}%;background:#34e08a"></i></div></div>`+
   `<div class="khin"><h5><i style="background:#35d4ff"></i>ĐỘ NẶNG</h5><strong>${f(t.mass)}<em>KL${t.red>0?' · −'+f(t.red):''}</em></strong><small>Thân ${f(t.hull)} + vũ khí ${f(t.wmass)} + khiên ${f(t.amass)} + động cơ ${f(t.emass)} + hạt nhân ${f(t.nmass)} + thùng ${f(t.tmass)} + kỹ năng ${f(t.kmass)}${t.red>0?' − giảm KL '+f(t.red):''}</small><div class="bar"><i style="width:${Math.min(100,t.mass/20)}%;background:#35d4ff"></i></div></div>`};

/* ---------- 8) màn nâng cấp modul ---------- */
{const _R=window.gRows;window.gRows=function(it,l){
  const nx=Math.min(GMAX,l+1),c=cellsOf(it),per=(3+c)+'% mỗi cấp ('+c+' ô)';
  if(it.eng){const a=enAt(it,l),b=enAt(it,nx);return [['Tốc chạy','+'+N1(a.sp),'+'+N1(b.sp)],['Gia tốc','+'+N1(a.acc)+'%','+'+N1(b.acc)+'%'],['Tăng theo cấp',per,null],['Năng lượng cần',a.en+' NL',null],['Khối lượng',it.mass,null],['Ô vàng',it.w+'×'+it.h,null]]}
  if(it.mrd){const a=mAt(it,l),b=mAt(it,nx);return [['Giảm khối lượng',NF(a.red)+' KL',NF(b.red)+' KL'],['Tăng theo cấp',per,null],['Năng lượng cần',a.en+' NL',null],['Ô xanh lá',it.w+'×'+it.h,null]]}
  if(it.nuc){const a=nAt(it,l),b=nAt(it,nx);return [['Năng lượng cấp','+'+N1(a.pw),'+'+N1(b.pw)],['Tăng theo cấp',per,null],['Khối lượng',it.mass,null],['Ô xanh lá',it.w+'×'+it.h,null]]}
  if(it.armor){const a=arAt(it,l),b=arAt(it,nx);return [['Máu',NF(a.dur),NF(b.dur)],['Khối lượng',it.mass,null],['Ô xanh',it.w+'×'+it.h,null]]}
  return _R(it,l)}}
})();
