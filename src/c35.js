
/* ===== c35: tốc chạy / quay đầu = 0 khi chưa lắp động cơ · số ô tối thiểu mỗi màu · tàu mở khóa được lắp sẵn modul cơ bản (60% ô) ===== */
(function(){
if(typeof KSH==='undefined'||!window.C25)return;
const MIN={r:4,y:6,g:18,b:30},NEED=58;
/* ---------- 1) số ô tối thiểu (giữ đối xứng hai bên) ---------- */
function fixGrid(G0){const H=G0.length,W=G0[0].length,R=G0.map(r=>r.split(''));let ch=0;
  const cnt=()=>{const c={r:0,y:0,g:0,b:0,n:0};R.forEach(r=>r.forEach(v=>{if(v!=='.'){c.n++;if(c[v]!=null)c[v]++}}));return c};
  const mir=(i,j)=>[W-1-i,j],set=(i,j,v)=>{R[j][i]=v;const [a]=mir(i,j);R[j][a]=v;ch=1},pair=(i,j)=>(W-1-i)===i?1:2;
  const adj=(i,j,v)=>[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].some(([dx,dy])=>R[j+dy]&&R[j+dy][i+dx]===v);
  /* thêm ô khi thân tàu quá ít ô */
  let c=cnt(),guard=0;while(c.n<NEED&&guard++<400){let best=null;const cx=(W-1)/2,cy=(H-1)/2;
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(R[j][i]!=='.'||!adj(i,j,'b')&&!['r','y','g'].some(v=>adj(i,j,v)))continue;const s=Math.hypot(i-cx,(j-cy)*.8);if(!best||s<best.s)best={i,j,s}}
    if(!best)break;set(best.i,best.j,'b');c=cnt()}
  /* đổi màu ô cho đủ tối thiểu, lấy từ màu còn dư */
  const cx=(W-1)/2,cy=(H-1)/2;
  const pref={r:(i,j)=>j*1+Math.abs(i-cx)*.5,y:(i,j)=>(H-j)*1+Math.abs(i-cx)*.3,g:(i,j)=>Math.hypot(i-cx,j-cy),b:(i,j)=>-Math.hypot(i-cx,j-cy)};
  ['r','y','g','b'].forEach(k=>{let g2=0;c=cnt();while(c[k]<MIN[k]&&g2++<400){let best=null;
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){const v=R[j][i];if(v==='.'||v===k||c[v]==null)continue;if(c[v]-pair(i,j)<MIN[v])continue;
      const s=(adj(i,j,k)?0:(c[k]?100:0))+pref[k](i,j)+(v==='b'?-3:0);if(!best||s<best.s)best={i,j,s}}
    if(!best){/* không còn ô dư: thêm ô mới cạnh thân tàu rồi tô màu */let nb=null;for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(R[j][i]!=='.'||!['r','y','g','b'].some(v=>adj(i,j,v)))continue;const s=pref[k](i,j);if(!nb||s<nb.s)nb={i,j,s}}if(!nb)break;set(nb.i,nb.j,k)}
    else set(best.i,best.j,k);c=cnt()}});
  /* ô đỏ phải liền nhau ít nhất 2 ô để lắp súng */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(R[j][i]!=='r'||adj(i,j,'r'))continue;let nb=null;[[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx,dy])=>{const v=R[j+dy]&&R[j+dy][i+dx];if(v&&v!=='.'&&v!=='r'&&(cnt()[v]-pair(i+dx,j+dy))>=MIN[v]&&!nb)nb=[i+dx,j+dy]});if(nb)set(nb[0],nb[1],'r')}
  return ch?R.map(r=>r.join('')):null}
function fixShip(sh){if(!sh||sh._c35||sh.bk)return;sh._c35=1;try{
  if(sh.gFull){const n=fixGrid(sh.gFull);if(n){sh.gFull=n;sh._pool=null;sh._mlv=null;sh._mg=sh.nolock?n:null;sh._pr={};sh._sl=null;sh._br=null}}
  else{const d=Object.getOwnPropertyDescriptor(sh,'g');if(d&&'value' in d&&Array.isArray(sh.g)){const n=fixGrid(sh.g);if(n){sh.g=n;sh._sl=null}}}}catch(e){console.error(e)}}
KSH.forEach(fixShip);
/* ô bị khóa theo cấp tàu: luôn mở đủ số ô tối thiểu của từng màu */
{const _S=shSync;shSync=function(sh){const r=_S.apply(this,arguments);try{if(sh&&!sh.nolock&&sh.gFull&&sh._mg&&sh._c35mg!==sh._mg){const R=sh._mg.map(x=>x.split('')),F=sh.gFull,W=F[0].length,c={r:0,y:0,g:0,b:0};
    R.forEach(r=>r.forEach(v=>{if(c[v]!=null)c[v]++}));let ch=0;
    Object.keys(MIN).forEach(k=>{if(c[k]>=MIN[k])return;for(let j=0;j<F.length&&c[k]<MIN[k];j++)for(let i=0;i<W&&c[k]<MIN[k];i++){if(F[j][i]===k&&R[j][i]==='.'){R[j][i]=k;c[k]++;const m=W-1-i;if(m!==i&&F[j][m]===k&&R[j][m]==='.'){R[j][m]=k;c[k]++}ch=1}}});
    if(ch){sh._mg=R.map(r=>r.join(''));sh._sl=null;sh._pr={}}sh._c35mg=sh._mg}}catch(e){console.error(e)}return r}}

/* ---------- 2) tốc chạy và quay đầu = 0 khi không có động cơ hoạt động (tàu phe ta) ---------- */
{const _K=khStats;khStats=function(){const t=_K.apply(this,arguments);try{if(window.c35Team!=='e'&&t&&!(t.eon>0)){t.speed=0;t.speed0=0;t.turn=0;if(t.spT)Object.keys(t.spT).forEach(k=>t.spT[k]=0);t.noEng=1}}catch(e){}return t}}
{const _D=dfStats;dfStats=function(){const r=_D.apply(this,arguments);try{if(window.c35Team!=='e'){const t=khStats.apply(this,arguments);if(t&&t.noEng){r.speed=0;r.speed0=0;if(r.spT)Object.keys(r.spT).forEach(k=>r.spT[k]=0);r.turn=0;r.noEng=1}}}catch(e){}return r}}
{const _M=dfMakeShip;dfMakeShip=function(sh,team){const p=window.c35Team;window.c35Team=team;try{const r=_M.apply(this,arguments);try{if(r&&team!=='e'&&!(sh&&sh.bk)){const t=dfStats.apply(this,[sh].concat([].slice.call(arguments,2,4)));if(t&&t.noEng){r.sp=0;r.spT={'11':0,'10':0,'01':0,'00':0};r.turn=0;r.noEng=1}}}catch(e){}return r}finally{window.c35Team=p}}}
{const _T=window.c25Turn;if(_T)window.c25Turn=function(P,a,dt){if(P&&P.noEng)return isFinite(P.ang)?P.ang:a;return _T.apply(this,arguments)}}
{const _V=window.c25Move;if(_V)window.c25Move=function(P,dvx,dvy,accE,dt){if(P&&P.noEng){dvx=0;dvy=0}return _V.call(this,P,dvx,dvy,accE,dt)}}
if(typeof dfAllies==='function'){const _A=dfAllies;dfAllies=function(dt){const G=DG,L=((G&&G.al)||[]).filter(a=>a&&a.noEng&&!a.dead).map(a=>[a,a.x,a.y,a.ang]);const r=_A.apply(this,arguments);
  L.forEach(([a,x,y,an])=>{if(a.fmT>0)return;a.x=x;a.y=y;a.ang=an});return r}}

/* ---------- 3) tàu mở khóa được lắp sẵn modul cơ bản: động cơ, khiên, súng, lõi hạt nhân, thùng năng lượng (~60% ô) ---------- */
function cells(x){return x&&x.cells?x.cells.length:((x&&x.w||1)*(x&&x.h||1))}
function autoFit(sh){const K=khS();K.fit=K.fit||{};['wp','ar','en','rc','ct'].forEach(k=>K[k]=K[k]||{});
  const n=c=>khCount(sh,c),N=sh.g.join('').replace(/\./g,'').length,T=Math.round(.6*N);let used=0;const id=sh.id;
  const W1=WP.find(x=>x.id==='w1'),A1=ARM.find(x=>x.id==='a1'),E1=ENG.find(x=>x.id==='e1'),N1=NUC.find(x=>x.id==='n1'),T1=TNK.find(x=>x.id==='t1');
  /* súng cơ bản vào ô đỏ */
  const wm=khWpMap(sh),hasW=Object.keys(wm).some(i=>(wm[i]||[]).length);
  if(!hasW&&W1){const sl=khSlots(sh);let cap=Math.max(1,Math.round(.6*n('r')/cells(W1)));K.wp[id]=K.wp[id]||{};
    sl.forEach((q,i)=>{const items=[];let pl;while(cap>0&&(pl=khPlaceFree(q,W1,0,khOccOf(items),null,W1.norot))){items.push({id:W1.id,ax:pl.ax,ay:pl.ay,rot:pl.rot?1:0});cap--;used+=cells(W1)}if(items.length)K.wp[id][i]=items})}
  else used+=Object.keys(wm).reduce((s,i)=>s+(wm[i]||[]).reduce((t,it)=>t+cells(wpGet(it.id)),0),0);
  const put=(kind,key,item,want)=>{const cur=(K[key][id]||[]);if(cur.length){used+=cur.reduce((s,it)=>s+1,0);return cur.length}if(!item||want<=0)return 0;
    const reg=khPReg(sh,kind),L=[];let occ=kind==='s'?khRawOcc(sh):Object.assign({},khOccOf((K.ct||{})[id]));if(kind==='g')['ms','sk'].forEach(k=>Object.assign(occ,khOccOf((K[k]||{})[id])));
    for(let i=0;i<want;i++){const pl=khPlaceFree(reg,item,0,occ,null,item.norot);if(!pl)break;const it={id:item.id,ax:pl.ax,ay:pl.ay,rot:pl.rot?1:0};L.push(it);Object.assign(occ,khOccOf([it]))}
    K[key][id]=L;used+=L.length*cells(item);return L.length};
  const ne=put('y','en',E1,Math.max(1,Math.round(.6*n('y'))));
  put('b','ar',A1,Math.round(.3*n('b')));
  put('g','rc',N1,Math.max(Math.ceil(2*ne/3)+1,Math.round(.35*n('g'))));
  put('s','ct',T1,Math.max(1,T-used));
  try{['ar','en','rc','ct'].forEach(k=>{(K[k][id]||[]).forEach(it=>{if(S.own)S.own[it.id]=1})})}catch(e){}}
function autoFitAll(){try{if(typeof S==='undefined'||!S)return;S.afit=S.afit||{};let ch=0;
  KSH.forEach(sh=>{if(sh.bk||S.afit[sh.id]||!shipOpen(sh.id))return;try{autoFit(sh)}catch(e){console.error(e)}S.afit[sh.id]=1;ch=1});
  if(ch){try{save()}catch(e){}}}catch(e){console.error(e)}}
autoFitAll();
if(typeof khRender==='function'){const _R=khRender;khRender=function(){autoFitAll();return _R.apply(this,arguments)}}
if(typeof dfStart==='function'){const _s=dfStart;dfStart=function(){autoFitAll();return _s.apply(this,arguments)}}
window.C35={MIN,fixGrid,autoFit,autoFitAll};
})();
