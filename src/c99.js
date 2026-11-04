/* ===== c99: KHÓI máy hơi nước có 200 máu (bị bắn tan, hồi lại sau 40 giây) · TỰ ĐIỀU KHIỂN TÀU CHÍNH (công tắc ở Chuẩn bị hạm đội) ===== */
(function(){
const DBk=()=>typeof DFB!=='undefined'?DFB:50,SHP=()=>200/DBk();
window.__smkLive=function(b,G,L){b.smkH=b.smkH||[];b.smkD=b.smkD||[];const out=[];(L||[]).forEach((r,i)=>{if(!r)return;if(b.smkD[i]){if(G.t<b.smkD[i])return;b.smkD[i]=0;b.smkH[i]=SHP()}if(b.smkH[i]==null)b.smkH[i]=SHP();r.si=i;r.hpf=Math.max(0,b.smkH[i]/SHP());out.push(r)});return out};
function smokeHits(G){const ours=(G.bl||[]).filter(b=>b.hp>0&&b.smkL&&b.smkL.length),theirs=(G.eu||[]).filter(u=>!u.dead&&u.smkL&&u.smkL.length);if(!ours.length&&!theirs.length)return;
  (G.pr||[]).forEach(p=>{if(!p||p.dead||!(p.dmg>0))return;const L=p.team==='e'?ours:theirs;for(const b of L){const R=b.smkL;for(let k=0;k<R.length;k++){const r=R[k];if(Math.abs(p.x-r.cx)<=r.w/2&&Math.abs(p.y-r.cy)<=r.h/2){
      b.smkH[r.si]-=p.dmg;p.dead=true;r.hpf=Math.max(0,b.smkH[r.si]/SHP());if(b.smkH[r.si]<=0){b.smkD[r.si]=G.t+40;R.splice(k,1);if(b.smkR===r)b.smkR=R[0]||null;try{G.fx.push({x:r.cx,y:r.cy,r:Math.max(r.w,r.h)*.5,t:.6,max:.6,ns:1,col:'#cfd6e2'})}catch(e){}}return}}}})}
/* ---- PvP: kẻ địch (đạn công trình, tàu, kỹ năng) chỉ nhắm trụ sở khi tàu và công trình khác của ta đã bị tiêu diệt hết ---- */
window.__hqLast=function(G){if(!G||!G.pvp)return false;if(G.c100t===G.t)return G.c100v;G.c100t=G.t;
  const any=[G.pl].concat(G.al||[]).some(u=>u&&!u.dead&&!u.ghost)||(G.bl||[]).some(b=>b.hp>0&&!b.hq&&b.t!=='mine'&&!b.c39tmp);return G.c100v=any};
/* ---- tự điều khiển tàu chính ---- */
let manT=0,skT=0;
function manual(){try{const k=typeof dfKeys!=='undefined'?dfKeys:{};return ['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].some(x=>k[x])}catch(e){return false}}
function auto(G,dt){const P=G.pl;if(!P||P.dead)return;if(manual()){manT=1.5;return}if(manT>0){manT-=dt;return}
  const E=(G.en||[]).filter(e=>e&&!e.dead&&!(e.spawn>G.t)&&!e.ghost&&!(e.hp<=0));if(!E.length)return;
  let tg=null,bd=1e9;E.forEach(e=>{const d=Math.hypot(e.x-P.x,e.y-P.y)+(e.sb?6:0);if(d<bd){bd=d;tg=e}});if(!tg)return;
  const rng=Math.max(3,...(P.ws||[]).map(w=>w.rng||0))*((G.pb&&G.pb.rm)||1),d=Math.hypot(tg.x-P.x,tg.y-P.y)||1,ux=(tg.x-P.x)/d,uy=(tg.y-P.y)/d,want=Math.max(2,rng*.75);
  if(d>rng*.95||d<want*.6){P.tx=tg.x-ux*want;P.ty=tg.y-uy*want}else{P.tx=P.x;P.ty=P.y}
  skT-=dt;if(skT<=0&&d<16&&typeof dfSkUse==='function'){skT=.6;(P.sk||[]).forEach((k,i)=>{if(!k||k.cd>0||!k.m)return;const t=k.m.t;if(t==='heal'&&P.hp>P.max*.6)return;if(t==='nrg'&&P.nrg>P.nrgMax*.4)return;try{dfSkUse(i)}catch(e){}})}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(G&&!G.done){smokeHits(G);if(S.c99ap)auto(G,dt)}}catch(e){console.error(e)}return r}}
/* công tắc ở Chuẩn bị hạm đội */
function box(){const d=document.createElement('div');d.className='c80m';d.id='c99ap';const on=!!S.c99ap;
  d.innerHTML='<b>Điều khiển tàu chính:</b>'+`<button data-c99="0" class="${on?'':'on'}">🕹 Tự tay</button><button data-c99="1" class="${on?'on':''}">🤖 Tự động</button>`+'<small>'+(on?'Tàu chính tự di chuyển, tự bắn và tự dùng kỹ năng. Chạm phím di chuyển để tạm điều khiển tay.':'Bạn tự điều khiển tàu chính.')+'</small>';
  d.onclick=e=>{const b=e.target.closest('button[data-c99]');if(!b)return;S.c99ap=b.dataset.c99==='1';try{save()}catch(x){}d.replaceWith(box());try{toast(S.c99ap?'🤖 Tàu chính tự điều khiển: BẬT':'🕹 Tàu chính tự điều khiển: TẮT')}catch(x){}};return d}
setInterval(()=>{try{const fb=document.getElementById('flbody');if(fb&&fb.offsetParent!==null&&!document.getElementById('c99ap')){const m=fb.querySelector('.c80m');if(m)m.insertAdjacentElement('afterend',box());else fb.insertBefore(box(),fb.children[1]||null)}}catch(e){}},500);
})();
