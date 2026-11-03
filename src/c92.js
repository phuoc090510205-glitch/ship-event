/* ===== c92: xóa Bản đồ dịch chuyển · LẮP RÁP MÔ-ĐUN CHO TRỤ SỞ (120 ô: 70 xanh nước biển bao quanh + 50 xanh lá ở lõi, +1 ô mỗi cấp trụ sở, người chơi tự chọn vị trí + màu) ===== */
(function(){
/* ---------- 1) xóa công trình Bản đồ dịch chuyển ---------- */
try{for(let i=BLD.length-1;i>=0;i--)if(BLD[i].t==='warp')BLD.splice(i,1);[S.base,S.pvb].forEach(B=>{if(B&&B.pos)Object.keys(B.pos).forEach(k=>{if(/warp/.test(k))delete B.pos[k]})})}catch(e){}

/* ---------- 2) lưới ô của trụ sở ---------- */
const GW=25,O=7;/* khung 25×25, lưới gốc 11×11 đặt ở (7..17) */
const CC={b:'#2f8cff',g:'#36d16a'},CN={b:'Xanh nước biển',g:'Xanh lá'};
const N4=[[1,0],[-1,0],[0,1],[0,-1]];
let BASE=null;function base(){if(BASE)return BASE;const m=new Map();
  for(let j=0;j<11;j++)for(let i=0;i<11;i++){const core=i>=2&&i<=8&&j>=2&&j<=8;m.set((O+i)+','+(O+j),core?'g':'b')}
  m.set((O+5)+','+(O+1),'g');/* lõi 50 ô */m.delete((O+5)+','+(O+10));/* vòng ngoài 70 ô */return BASE=m}
const D=()=>{S.hqm=S.hqm||{ext:[],it:[]};return S.hqm};
const hqLv=()=>{try{return bLv('hq')||1}catch(e){return 1}};
const credits=()=>Math.max(0,hqLv()-1);
const free=()=>Math.max(0,credits()-D().ext.length);
function cells(){const m=new Map(base());D().ext.slice(0,credits()).forEach(c=>m.set(c[0]+','+c[1],c[2]));return m}
function cands(){const m=cells(),R=[];for(let j=0;j<GW;j++)for(let i=0;i<GW;i++){const k=i+','+j;if(m.has(k))continue;const cs=new Set();N4.forEach(([dx,dy])=>{const v=m.get((i+dx)+','+(j+dy));if(v)cs.add(v)});if(cs.size)R.push([i,j,[...cs].sort()])}return R}
/* ---------- 3) mô-đun: ô xanh nước biển = khiên; ô xanh lá = hạt nhân, thùng chứa, giảm khối lượng, mô-đun kỹ năng ---------- */
const GRP=[['b','🛡 Khiên','ARM'],['g','⚛ Hạt nhân','NUC'],['g','🛢 Thùng chứa','TNK'],['g','⚖ Giảm khối lượng','MRD'],['g','✦ Kỹ năng','SKL']];
const LIST=n=>{try{return eval(n)||[]}catch(e){return []}};
const ALL=()=>GRP.reduce((a,g)=>a.concat(LIST(g[2])),[]);
const item=id=>ALL().find(x=>x.id===id);
const col=x=>x&&x.kind==='b'?'b':'g';
const own=id=>{try{return typeof shopOwn==='function'?shopOwn(id):!!(S.own&&S.own[id])}catch(e){return false}};
const LVf=id=>{try{return 1+.05*(aLv(id)-1)}catch(e){return 1}};
const dims=p=>{const x=item(p.id);return x?(p.r?[x.h,x.w]:[x.w,x.h]):[1,1]};
function occ(skip){const o=new Map();D().it.forEach((p,n)=>{if(n===skip)return;const [w,h]=dims(p);for(let j=0;j<h;j++)for(let i=0;i<w;i++)o.set((p.x+i)+','+(p.y+j),n)});return o}
function fits(id,x,y,r,skip){const it=item(id);if(!it)return false;const w=r?it.h:it.w,h=r?it.w:it.h,m=cells(),o=occ(skip),c=col(it);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=(x+i)+','+(y+j);if(m.get(k)!==c||o.has(k))return false}return true}
function clean(){const L=D().it,keep=[];L.forEach(p=>{const it=item(p.id);if(!it||!own(p.id))return;D().it=keep;if(fits(p.id,p.x,p.y,p.r))keep.push(p)});D().it=keep}
/* ---------- 4) chỉ số cộng cho trụ sở ---------- */
function stats(){const s={hp:0,shd:0,reg:0,dmg:0,rof:0,red:0,sk:[]};
  D().it.forEach(p=>{const it=item(p.id);if(!it)return;const f=LVf(p.id);
    if(it.armor){s.shd+=it.dur*6*f;s.reg+=(it.reg||0)*.5*f}
    else if(it.nuc){s.dmg+=it.pw*.6*f;s.rof+=(it.eff||0)*.03*f}
    else if(it.tnk){s.hp+=(it.hp||0)*2*f}
    else if(it.mrd){s.red+=it.pct*.25*f}
    else if(it.skl)s.sk.push({t:it.t,pw:it.pw*f,dur:it.dur||5,cd:it.cd||30,n:it.n})});
  s.dmg=Math.min(300,s.dmg);s.rof=Math.min(100,s.rof);s.red=Math.min(50,s.red);return s}
const nf=v=>Math.round(v).toLocaleString('vi-VN');
function sumTxt(s){const L=[];if(s.hp)L.push('+'+nf(s.hp)+' máu');if(s.shd)L.push('+'+nf(s.shd)+' giáp');if(s.reg)L.push('hồi '+nf(s.reg)+' giáp/giây');if(s.dmg)L.push('+'+nf(s.dmg)+'% sát thương');if(s.rof)L.push('+'+nf(s.rof)+'% tốc bắn');if(s.red)L.push('giảm '+nf(s.red)+'% sát thương nhận');
  s.sk.forEach(k=>L.push('Kỹ năng «'+k.n+'» (hồi '+k.cd+' giây)'));return L.length?L.join(' · '):'Chưa lắp mô-đun nào'}
/* ---------- 5) áp vào trận ---------- */
{const _S=dfStart;dfStart=function(){const r=_S.apply(this,arguments);try{const G=DG;if(G&&G.hq&&!G.c92){G.c92=1;const h=G.hq,s=stats(),DB=typeof DFB!=='undefined'?DFB:50;
    if(s.hp){h.max+=s.hp/DB;h.hp+=s.hp/DB}if(s.shd){const v=s.shd/DB;h.shd={v:((h.shd&&h.shd.v)||0)+v,max:((h.shd&&h.shd.max)||0)+v,t:1e9}}
    if(s.red)h.red=Math.min(.6,(h.red||0)+s.red/100);
    if(h.spec&&(s.dmg||s.rof))h.spec=Object.assign({},h.spec,{dmg:h.spec.dmg*(1+s.dmg/100),cd:h.spec.cd/(1+s.rof/100)});
    G.c92s={h,s,DB,sk:s.sk.map(k=>({...k,t0:Math.min(8,k.cd*.3)})),buf:0}}}catch(e){console.error(e)}return r}}
{const _T=dfStep;dfStep=function(dt){const r=_T.apply(this,arguments);try{const G=DG,C=G&&G.c92s;if(!C||G.done||!(dt>0))return r;const h=C.h;if(G.hq!==h||!(h.hp>0))return r;
    if(C.s.reg&&h.shd&&h.shd.max>0)h.shd.v=Math.min(h.shd.max,h.shd.v+C.s.reg/C.DB*dt);
    if(C.buf>0){C.buf-=dt;if(C.buf<=0&&C.sp0){h.spec=C.sp0;C.sp0=null}}
    C.sk.forEach(k=>{k.t0-=dt;if(k.t0>0)return;k.t0=k.cd;const fx=c=>{try{G.fx.push({x:h.x,y:h.y,r:Math.max(h.w,h.h)*1.2,t:.6,max:.6,col:c})}catch(e){}};
      if(k.t==='heal'||k.t==='nrg'){h.hp=Math.min(h.max,h.hp+h.max*k.pw/(k.t==='heal'?200:400));fx('#7dffa0')}
      else if(k.t==='shield'){const v=h.max*k.pw/400;h.shd={v:((h.shd&&h.shd.v)||0)+v,max:Math.max((h.shd&&h.shd.max)||0,((h.shd&&h.shd.v)||0)+v),t:1e9};fx('#8fd8ff')}
      else if(h.spec&&!C.sp0){C.sp0=h.spec;h.spec=Object.assign({},h.spec,k.t==='surge'?{dmg:h.spec.dmg*(1+k.pw/100)}:{cd:h.spec.cd/(1+k.pw/200)});C.buf=k.dur;fx('#ffd24a')}})}catch(e){console.error(e)}return r}}

/* ---------- 6) giao diện lắp ráp ---------- */
const st=document.createElement('style');st.textContent=`
#c92{position:fixed;inset:0;z-index:60;display:none;flex-direction:column;background:radial-gradient(ellipse at 40% 30%,#0b2050,#040a1e 70%);color:#dfe9ff;font:600 13px system-ui,sans-serif}
#c92 .hd{position:relative;z-index:5;display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid #1f4a8a;background:#061430e6}
#c92 .hd h2{margin:0;font-size:16px;letter-spacing:1px;color:#fff}#c92 .hd small{color:#9fc4ff;font-weight:600}#c92 .hd .x{margin-left:auto}
#c92 button{cursor:pointer;border-radius:8px;border:1.5px solid #2b5ac9;background:#0b1a44;color:#dfe9ff;font:800 12px system-ui,sans-serif;padding:6px 10px}
#c92 button.on{background:linear-gradient(#ffd766,#f0a500);color:#1a1200;border-color:#ffc53d}
#c92 .bd{flex:1;display:flex;gap:10px;padding:10px;min-height:0;overflow:hidden}
#c92 .gp{flex:1.25;position:relative;min-width:0;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center}
#c92 .gr{position:relative}
#c92 .cl{position:absolute;box-sizing:border-box;border:1px solid #0006;border-radius:2px}
#c92 .cl.b{background:#1d5fb8;box-shadow:inset 0 0 0 1px #5fb0ff55}#c92 .cl.g{background:#1f8a45;box-shadow:inset 0 0 0 1px #7dffb055}
#c92 .cl.ok{outline:2px solid #fff;z-index:2}#c92 .cl.no{outline:2px solid #ff5a6a;z-index:2}
#c92 .cd{position:absolute;box-sizing:border-box;border:2px dashed #fff;border-radius:3px;cursor:pointer;animation:c92p 1s infinite alternate;z-index:3}@keyframes c92p{from{opacity:.5}to{opacity:1}}
#c92 .pm{position:absolute;box-sizing:border-box;border:1.5px solid #ffffffaa;border-radius:4px;background:#061226cc center/contain no-repeat;cursor:pointer;z-index:4}
#c92 .pm:hover{border-color:#ff8a8a}
#c92 .hqi{position:absolute;pointer-events:none;opacity:.22;font-size:0;background:center/contain no-repeat;z-index:1}
#c92 .sd{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0;max-width:440px}
#c92 .tb{display:flex;gap:4px;flex-wrap:wrap}
#c92 .ls{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;align-content:start;padding:2px}
#c92 .it{position:relative;border:1.5px solid #1f4a8a;border-radius:9px;background:#071a3a;padding:5px;text-align:center;cursor:pointer;font-size:10.5px}
#c92 .it img{width:100%;height:46px;object-fit:contain}#c92 .it b{display:block;font-size:10px;color:#fff;line-height:1.2}#c92 .it i{font-style:normal;color:#9fc4ff}
#c92 .it.sel{border-color:#ffc53d;box-shadow:0 0 10px #ffc53d88}#c92 .it.lk{opacity:.4;cursor:not-allowed}
#c92 .sm{padding:8px;border:1px solid #1f4a8a;border-radius:9px;background:#061430;font-weight:600;color:#bfe3ff;line-height:1.45}
#c92 .pk{position:absolute;z-index:9;display:flex;gap:6px;padding:7px;border-radius:10px;background:#071530ee;border:1px solid #4fd8ff;transform:translate(-50%,-110%)}
@media(orientation:portrait){#c92 .bd{flex-direction:column}#c92 .sd{max-width:none}}`;document.head.appendChild(st);
const ov=document.createElement('div');ov.id='c92';document.body.appendChild(ov);
const U={tab:0,sel:null,r:0,open:0};
function render(){clean();const m=cells(),f=free(),s=stats();let nb=0,ng=0;m.forEach(v=>v==='b'?nb++:ng++);
  ov.innerHTML=`<div class="hd"><h2>MÔ-ĐUN TRỤ SỞ</h2><small>Cấp ${hqLv()} · ${m.size} ô (${nb} xanh nước biển · ${ng} xanh lá) · cấp 1 có 120 ô, mỗi cấp +1 ô</small><button class="x" data-a="x">✕ Đóng</button></div>
  <div class="bd"><div class="gp" id="c92gp"></div><div class="sd">
   <div class="tb"><button data-a="open" class="${U.open?'on':''}">${f>0?(U.open?'✓ ĐANG CHỌN Ô MỚI':'＋ MỞ Ô MỚI')+' · còn '+f:'Ô mới: nâng cấp trụ sở'}</button><button data-a="rot" class="${U.r?'on':''}">⟳ Xoay ${U.r?'(đang xoay)':''}</button><button data-a="clr">Tháo hết</button></div>
   <div class="tb">${GRP.map((g,i)=>`<button data-a="tab" data-i="${i}" class="${i===U.tab?'on':''}" style="border-color:${CC[g[0]]}">${g[1]}</button>`).join('')}</div>
   <div style="font-size:11px;color:#9fc4ff">${GRP[U.tab][0]==='b'?'Lắp vào ô <b style="color:#5fb0ff">xanh nước biển</b>':'Lắp vào ô <b style="color:#7dffb0">xanh lá</b>'} · chọn món rồi chạm ô trên lưới · chạm mô-đun đã lắp để tháo</div>
   <div class="ls">${LIST(GRP[U.tab][2]).map(x=>{const o=own(x.id);return `<div class="it ${U.sel===x.id?'sel':''} ${o?'':'lk'}" data-id="${x.id}" title="${x.d||''}"><img src="${x.img}" alt=""><b>${x.n}</b><i>${x.w}×${x.h}${o?'':' · 🔒 chưa có'}</i></div>`}).join('')}</div>
   <div class="sm"><b style="color:#fff">Trụ sở được cộng:</b> ${sumTxt(s)}</div></div></div>`;
  grid()}
function grid(){const gp=ov.querySelector('#c92gp');if(!gp)return;const m=cells(),cd=U.open&&free()>0?cands():[];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  const ext=(i,j)=>{x0=Math.min(x0,i);y0=Math.min(y0,j);x1=Math.max(x1,i);y1=Math.max(y1,j)};m.forEach((v,k)=>{const [i,j]=k.split(',').map(Number);ext(i,j)});cd.forEach(c=>ext(c[0],c[1]));
  const W=x1-x0+1,H=y1-y0+1,cs=Math.max(10,Math.floor(Math.min((gp.clientWidth||600)/W,(gp.clientHeight||500)/H)*.94));
  let h=`<div class="gr" style="width:${W*cs}px;height:${H*cs}px">`;
  const hq=(typeof BLD!=='undefined'?BLD.find(b=>b.t==='hq'):null),hi=hq&&(hq.img||(typeof BIMG!=='undefined'&&BIMG.hq));
  m.forEach((v,k)=>{const [i,j]=k.split(',').map(Number);h+=`<div class="cl ${v}" data-c="${i},${j}" style="left:${(i-x0)*cs}px;top:${(j-y0)*cs}px;width:${cs}px;height:${cs}px"></div>`});
  if(hi)h+=`<div class="hqi" style="left:${(O+2-x0)*cs}px;top:${(O+2-y0)*cs}px;width:${7*cs}px;height:${7*cs}px;background-image:url(${hi})"></div>`;
  D().it.forEach((p,n)=>{const it=item(p.id);if(!it)return;const [w,hh]=dims(p);h+=`<div class="pm" data-n="${n}" title="${it.n} — chạm để tháo" style="left:${(p.x-x0)*cs}px;top:${(p.y-y0)*cs}px;width:${w*cs}px;height:${hh*cs}px;background-image:url(${it.img})"></div>`});
  cd.forEach(([i,j,c])=>{h+=`<div class="cd" data-o="${i},${j}" title="${c.map(x=>CN[x]).join(' / ')}" style="left:${(i-x0)*cs}px;top:${(j-y0)*cs}px;width:${cs}px;height:${cs}px;background:${c.length===1?CC[c[0]]+'66':'linear-gradient(135deg,'+CC.b+'88,'+CC.g+'88)'}"></div>`});
  gp.innerHTML=h+'</div>'}
function place(i,j,c){if(free()<=0)return;D().ext.push([i,j,c]);try{save()}catch(e){}toast('Đã mở 1 ô '+CN[c]);if(free()<=0)U.open=0;render()}
ov.addEventListener('click',e=>{const t=e.target;const a=t.closest('[data-a]');
  if(a){const k=a.dataset.a;if(k==='x'){ov.style.display='none';return}if(k==='rot'){U.r^=1;render();return}if(k==='tab'){U.tab=+a.dataset.i;U.sel=null;render();return}
    if(k==='clr'){D().it=[];try{save()}catch(e){}render();return}
    if(k==='open'){if(free()<=0){toast('Chưa có ô mới — mỗi cấp trụ sở mở 1 ô');return}U.open^=1;render();return}}
  const pk=t.closest('.pk');if(pk){const b=t.closest('button[data-k]');if(b){const [i,j]=pk.dataset.o.split(',').map(Number);place(i,j,b.dataset.k)}return}
  const old=ov.querySelector('.pk');if(old)old.remove();
  const o=t.closest('.cd');if(o){const [i,j]=o.dataset.o.split(',').map(Number),cd=cands().find(x=>x[0]===i&&x[1]===j);if(!cd)return;if(cd[2].length===1){place(i,j,cd[2][0]);return}
    const p=document.createElement('div');p.className='pk';p.dataset.o=i+','+j;p.style.left=(parseFloat(o.style.left)+o.offsetWidth/2)+'px';p.style.top=o.style.top;p.innerHTML=cd[2].map(c=>`<button data-k="${c}" style="background:${CC[c]};color:#03101f">${CN[c]}</button>`).join('');o.parentNode.appendChild(p);return}
  const it=t.closest('.it');if(it){if(it.classList.contains('lk')){toast('Chưa sở hữu món này — mua ở Shop');return}U.sel=U.sel===it.dataset.id?null:it.dataset.id;render();return}
  const pm=t.closest('.pm');if(pm&&!U.sel){D().it.splice(+pm.dataset.n,1);try{save()}catch(e){}render();return}
  const cl=t.closest('.cl')||pm;if(cl&&U.sel){const gr=ov.querySelector('.gr'),R=gr.getBoundingClientRect(),c0=ov.querySelector('.cl'),cs=c0?c0.offsetWidth:20;
    let x0=1e9,y0=1e9;cells().forEach((v,k)=>{const [i,j]=k.split(',').map(Number);x0=Math.min(x0,i);y0=Math.min(y0,j)});(U.open&&free()>0?cands():[]).forEach(c=>{x0=Math.min(x0,c[0]);y0=Math.min(y0,c[1])});
    const i=x0+Math.floor((e.clientX-R.left)/cs),j=y0+Math.floor((e.clientY-R.top)/cs),x=item(U.sel),w=U.r?x.h:x.w,h=U.r?x.w:x.h,px=i-Math.floor((w-1)/2),py=j-Math.floor((h-1)/2);
    if(fits(U.sel,px,py,U.r)){D().it.push({id:U.sel,x:px,y:py,r:U.r?1:0});try{save()}catch(e){}render()}else toast(col(x)==='b'?'Không vừa: khiên cần đủ ô xanh nước biển trống':'Không vừa: mô-đun cần đủ ô xanh lá trống')}});
window.addEventListener('resize',()=>{if(ov.style.display==='flex')grid()});
function open(){ov.style.display='flex';render()}
/* nút mở ở màn Trụ sở + màn Nâng cấp trụ sở */
setInterval(()=>{try{const bar=document.querySelector('#base .lt');if(bar&&!bar.querySelector('#c92b')){const b=document.createElement('button');b.id='c92b';b.className='brs';b.style.cssText='background:#0c4a2a;border-color:#36d16a';b.textContent='⚙ Mô-đun trụ sở';b.onclick=open;const r=bar.querySelector('#brot');bar.insertBefore(b,r||null)}
  const f=free(),b=document.getElementById('c92b');if(b)b.textContent='⚙ Mô-đun trụ sở'+(f>0?' ('+f+' ô mới)':'')}catch(e){}},500);
window.C92={open,stats,cells,cands,base,free,credits,place:(i,j,c)=>{place(i,j,c)},fits};
})();
