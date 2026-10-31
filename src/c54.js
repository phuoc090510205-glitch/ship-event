/* ===== c54: boss trong trận boss dùng 1 kỹ năng bất kỳ có trong Shop kỹ năng (không dùng kỹ năng ngoài) ===== */
(function(){
if(typeof KI==='undefined'||typeof dfSpawnWave==='undefined')return;
const pool=()=>KI.filter(k=>k&&k[0]&&!(typeof KDEL!=='undefined'&&KDEL[k[0]])&&(typeof KC==='undefined'||KC.includes(k[1])));
const num=v=>{const m=String(v==null?'':v).match(/\d+(?:\.\d{3})+|\d+(?:[.,]\d+)?/);return m?parseFloat(m[0].replace(/\.(?=\d{3}(?!\d))/g,'').replace(',','.')):0};
const row=(k,l)=>{const r=(k[6]||[]).find(x=>x[0]===l);return r?r[1]:null};
function kind(k){const c=k[1];
  if(c==='Tối thượng'&&window.C50&&C50.SP[k[0]]&&k.c50){const a=C50.SP[k[0]][0];if(a.a==='sh')return 'def';if(a.a==='heal'||a.a==='ret'||a.a==='rev'||a.a==='hot')return 'heal';if(a.a==='buff')return 'buff';if(a.a==='zone'&&!a.dps&&!a.pd)return 'cc';return 'ult'}
  if(c==='Phòng thủ')return 'def';if(c==='Hỗ trợ')return /Hồi|Máu|Sửa/.test(k[0]+(k[5]||''))?'heal':'buff';if(c==='Điều khiển')return 'cc';return 'atk'}
function refDps(e){return Math.max(20,(e.ws||[]).reduce((s,w)=>s+(w.dmg||0)/Math.max(.1,w.cd||1),0)*(e.dm||1))}
function sty(k){try{return CSK.style(k,CSK.plan(k))}catch(e){return {m:'star',c1:'#ff7a5c',c2:'#fff',sd:1}}}
function fx(G,s,x,y,R){const C=G.csk||(G.csk={zones:[],drones:[],fx:[]});C.fx=C.fx||[];C.fx.push({mot:s.m,x,y,R:Math.max(3,R),t:1.1,max:1.1,c1:s.c1,c2:s.c2,sd:s.sd})}
function ring(G,x,y,r0,r1,t,col,lw){const C=G.csk||(G.csk={zones:[],drones:[],fx:[]});(C.fx=C.fx||[]).push({x,y,r0,r1,t,max:t,col,lw:lw||3})}
function players(G){return [G.pl].concat(G.al||[]).filter(u=>u&&!u.dead)}
function hit(G,u,d){if(u===G.pl)dfDmgS(u,d);else dfDmgA(u,d)}
function cast(G,e){const k=e.c54k,s=e.c54s,P=G.pl;const tg=players(G).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];if(!tg)return;
  const R=Math.max(3,Math.min(9,(CSK.plan(k).R||5))),ty=kind(k),dur=Math.max(2,Math.min(8,num(row(k,'Thời gian'))||num(row(k,'Thời gian tác dụng'))||4));
  const col=s.c1||'#ff7a5c';toast('Boss dùng kỹ năng: '+k[0]);
  if(ty==='atk'||ty==='ult'||ty==='cc'){const d=refDps(e)*(ty==='ult'?8:ty==='cc'?2:5);
    G.bm.push({x1:e.x,y1:e.y,x2:tg.x,y2:tg.y,t:.35,col,w:5});fx(G,s,tg.x,tg.y,R);ring(G,tg.x,tg.y,.4,R,.7,col,5);
    G.fx.push({x:tg.x,y:tg.y,r:R*.7,t:.6,max:.6,ex:1,rot:Math.random()*6});
    players(G).forEach(u=>{if(Math.hypot(u.x-tg.x,u.y-tg.y)>R+(u.size||2)*.3)return;hit(G,u,d);
      if(ty==='cc'||num(row(k,'Choáng'))){const t=Math.min(3,num(row(k,'Choáng'))||1.5);u.stun=Math.max(u.stun||0,t)}
      if(ty==='cc'){u.slowT=Math.max(u.slowT||0,dur);u.slowK=Math.min(u.slowK||1,.5)}});
    G.bl.forEach(b=>{if(b.hp>0&&b.t!=='mine'&&Math.hypot(b.x-tg.x,b.y-tg.y)<R+Math.max(b.w,b.h)*.4)dfDmgB(b,d*.5)})}
  else if(ty==='def'){e.shT=Math.max(e.shT||0,dur+2);e.shP=Math.max(e.shP||0,50);fx(G,s,e.x,e.y,(e.size||4)*.8);ring(G,e.x,e.y,.4,(e.size||4)*.9,.8,col,5)}
  else if(ty==='heal'){e.hp=Math.min(e.max,e.hp+e.max*.12);fx(G,s,e.x,e.y,(e.size||4)*.8);ring(G,e.x,e.y,.4,(e.size||4)*.9,.8,'#5dff9a',5)}
  else{e.surgeT=Math.max(e.surgeT||0,dur+2);e.surgeP=Math.max(e.surgeP||0,40);fx(G,s,e.x,e.y,(e.size||4)*.8);ring(G,e.x,e.y,.4,(e.size||4)*.9,.8,'#ffb36b',5)}}
function arm(G,e){if(e.c54k)return;const L=pool();if(!L.length)return;const k=L[Math.floor(Math.random()*L.length)];e.c54k=k;e.c54s=sty(k);e.sk=[];
  const cd=num(row(k,'Hồi chiêu'))||20;e.c54cd0=Math.max(12,Math.min(30,cd));e.c54cd=5;G.c54n=(G.c54n||0)+1;setTimeout(()=>toast('Boss '+(e.sh&&e.sh.n?e.sh.n:'')+' mang kỹ năng: '+k[0]),900)}
{const _w=dfSpawnWave;dfSpawnWave=function(){const r=_w.apply(this,arguments);try{const G=DG;(G.en||[]).forEach(e=>{if(e.boss&&!e.bkBoss)arm(G,e)})}catch(er){console.error(er)}return r}}
{const _S=dfStep;dfStep=function(dt){const r=_S.apply(this,arguments);try{const G=DG;if(!G||G.done||!G.en)return r;
  G.en.forEach(e=>{if(e.boss&&!e.bkBoss&&!e.c54k&&!e.dead)arm(G,e);if(!e.c54k||e.dead||e.spawn>G.t)return;if(e.silT>0||e.stun>0)return;e.c54cd-=dt;if(e.c54cd>0)return;
    const P=G.pl;if(!P||P.dead)return;const near=players(G).some(u=>Math.hypot(u.x-e.x,u.y-e.y)<18);if(!near){e.c54cd=1;return}
    e.c54cd=e.c54cd0;cast(G,e)})}catch(er){console.error(er)}return r}}
window.C54={pool,kind};
})();
