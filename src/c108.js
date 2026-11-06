/* ===== c108: PvP đợt 2 + 3 — tường thành (cổng) sau mỗi căn cứ địch; căn cứ mở lần lượt; tối đa 23 tàu/căn cứ; bỏ rút máu trụ sở; HUD tường thành; đợt 3: hiệu ứng sập tường + âm thanh ===== */
const GATE_W=33,GATE_H=2;
/* sập tường: âm thanh (tiếng nổ trầm + đổ vỡ) qua hệ âm thanh sẵn có */
function pvBoom(){try{if(!init()||!ctx)return;const t=ctx.currentTime;
  const s=ctx.createBufferSource();s.buffer=nbuf;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(1100,t);f.frequency.exponentialRampToValueAtTime(80,t+1.7);
  const g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.9,t+.04);g.gain.exponentialRampToValueAtTime(.001,t+1.9);
  s.connect(f);f.connect(g);g.connect(fxBus);s.start(t);s.stop(t+2);
  const o=ctx.createOscillator(),og=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(75,t);o.frequency.exponentialRampToValueAtTime(26,t+1.5);
  og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(.8,t+.05);og.gain.exponentialRampToValueAtTime(.001,t+1.6);
  o.connect(og);og.connect(fxBus);o.start(t);o.stop(t+1.7)}catch(e){}}
/* tàu phụ của căn cứ k (tối đa 23 tàu mỗi căn cứ) */
function pvOut(G,u){const i=G.en.indexOf(u);if(i>=0)G.en.splice(i,1)}
/* cất / lấy lại đơn vị của căn cứ: hp=0 + dead + hib để không bị hồi sinh; không nằm trong danh sách tàu địch */
function pvStash(G,u){u.hpSave=u.hp;u.hp=0;u.dead=true;u.hib=true;pvOut(G,u)}
function pvBack(G,u){if(!u.hib||u.gone)return;u.hib=false;u.dead=false;u.hp=u.hpSave||u.max;if(!G.en.includes(u))G.en.push(u)}
function pvEscSpawn(G,k){const o=G.pvo,n=Math.min(23,Math.max(0,(G.pvEsc||0)-23*k)),b=G.pvB[k],uq=G.pvUQ||[];
  for(let i=0;i<n;i++){const e=window.__pvMk(G,o,b.x+((i%10)-(Math.min(n,10)-1)/2)*3,b.y+2.5+Math.floor(i/10)*2.5,.55,uq[(23*k+i)%Math.max(1,uq.length)]);e.name='Tàu phụ '+o.n2;e.bk=k;G.en.push(e)}}
/* tường thành bị phá: căn cứ đó bị dọn sạch (tàu phụ và công trình) và căn cứ kế tiếp mở ra */
function pvFall(G,k){const B=G.pvB,b=B[k],g=b.gate;g.sink=0;
  b.units.forEach(u=>{if(u!==g){u.gone=1;u.hib=true;u.dead=true;u.hp=0;pvOut(G,u)}});
  g.hp=0;pvOut(G,g);
  G.en.filter(e=>e.bk===k).forEach(e=>{e.dead=true;e.hp=0;pvOut(G,e)});
  for(let i=0;i<14;i++)G.pvFxQ.push({at:G.t+i*.07,x:g.x+(i/13-.5)*GATE_W,y:g.y,r:2.2+Math.random()*2});
  pvBoom();
  if(k+1<B.length){G.pvA=k+1;const nb=B[k+1];nb.units.forEach(u=>pvBack(G,u));
    G.act=nb;G.pvRefill=G.t;pvEscSpawn(G,k+1)}
  try{toast('💥 Tường thành căn cứ '+(k+1)+' bị hạ'+(k+1<B.length?' · mở căn cứ '+(k+2):' · trụ sở đối thủ lộ diện!'))}catch(e){}}
/* chỉ căn cứ đầu tiên hiện ra lúc bắt đầu: các căn cứ sau được cất đi (sau khi thảm đã áp chỉ số) cho đến khi căn cứ trước bị dọn */
function pvHide(G){if(G.pvHid)return;G.pvHid=1;(G.pvB||[]).forEach((b,k)=>{if(k>0)b.units.forEach(u=>pvStash(G,u))})}
function pvStepB(G,dt){const B=G.pvB;if(!B||!G.pvFxQ)return;pvHide(G);
  G.pvFxQ=G.pvFxQ.filter(q=>{if(G.t<q.at)return true;try{G.fx.push({x:q.x,y:q.y,r:q.r,t:.8,max:.8,ex:1,rot:Math.random()*6.28})}catch(e){}return false});
  B.forEach(b=>{const g=b.gate;if(g&&g.sink!=null&&g.sink<1){g.sink=Math.min(1,g.sink+dt/1.6);const s=g.sink;g.h=Math.max(.05,GATE_H*(1-s));g.y=g.y0+(GATE_H-g.h)/2+s*.8}});
  const a=G.pvA,g=B[a]&&B[a].gate;if(g&&g.dead&&g.sink==null&&!g.hib)pvFall(G,a)}
/* thanh máu: tường thành của căn cứ đang đánh (đầy lại trong 5 giây sau khi tường trước bị hạ); căn cứ cuối là trụ sở */
function pvHudE(G){const B=G.pvB||[],a=G.pvA||0,g=B[a]&&B[a].gate;let f,lab;
  if(g&&!g.dead){f=Math.max(0,g.hp/g.max);lab='Thanh máu tường thành căn cứ '+(a+1)}
  else{const e=G.eh;f=Math.max(0,e.hp/e.max);lab='Thanh máu trụ sở đối thủ'}
  if(G.pvRefill>=0&&G.t-G.pvRefill<5)f*=Math.max(0,(G.t-G.pvRefill)/5);
  if($('pvhe'))$('pvhe').style.width=f*100+'%';if($('pvhp'))$('pvhp').textContent=Math.ceil(f*100)+'%';
  if($('pvhl'))$('pvhl').textContent=lab;if($('pvhn'))$('pvhn').textContent=(B.length-a)+'/'+B.length}
