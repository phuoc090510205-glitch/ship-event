/* ===== c90: SẢNH CỘNG ĐỒNG — Kênh thế giới · Clan · Tặng quà · Phòng PvP theo mã phòng ===== */
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const F=()=>{S.fb=S.fb||{};if(!S.fb.uid)S.fb.uid='P'+Math.random().toString(36).slice(2,8).toUpperCase();return S.fb};
const UID=()=>F().uid,NM=()=>S.name||'Thuyền trưởng',LV=()=>{try{return lvNow()}catch(e){return 1}};
const AV=i=>{try{return PROF.av[i|0]||''}catch(e){return ''}};
const fmtT=t=>{const d=new Date(t);return d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})+' '+d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})};
const NF=v=>Math.round(v||0).toLocaleString('vi-VN');
/* ---------- máy chủ: Firebase (nếu có địa chỉ) → kho dữ liệu Claude (nếu được ghi) → chỉ trên máy ---------- */
const fbUrl=()=>(window.SE_CFG&&SE_CFG.fb)||(()=>{try{return localStorage.getItem('se_fb')||''}catch(e){return ''}})();
const seg=p=>p.split('/').filter(Boolean);
function rest(url){const u=(p,q)=>url.replace(/\/+$/,'')+'/'+seg(p).join('/')+'.json'+(q||'');
  const j=async(p,m,b,q)=>{const r=await fetch(u(p,q),{method:m||'GET',headers:b!==undefined?{'Content-Type':'application/json'}:undefined,body:b!==undefined?JSON.stringify(b):undefined});if(!r.ok)throw new Error('http '+r.status);return r.json()};
  const arr=o=>o?Object.keys(o).map(k=>Object.assign({id:k},o[k])):[];
  return {kind:'Firebase',live:true,get:p=>j(p),set:(p,o)=>j(p,'PUT',o),del:p=>j(p,'DELETE'),add:(p,o)=>j(p,'POST',o),list:async p=>arr(await j(p)),last:async(p,n)=>arr(await j(p,'GET',undefined,'?orderBy=%22$key%22&limitToLast='+n))}}
function cdb(db){const D=p=>db.doc(p),C=p=>db.collection(p),m=s=>s.docs.map(d=>Object.assign({id:d.id},d.data()));
  return {kind:'Claude',live:true,get:async p=>{const s=await D(p).get();return s.exists?s.data():null},set:(p,o)=>D(p).set(o),del:p=>D(p).delete(),add:(p,o)=>C(p).add(o),list:async p=>m(await C(p).get()),last:async(p,n)=>m(await C(p).orderBy('t','desc').limit(n).get()).reverse()}}
function local(){const K='se_c90db',L=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}},W=o=>{try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}};
  const ls=p=>{const o=L(),pre=seg(p).join('/')+'/';return Object.keys(o).filter(k=>k.startsWith(pre)&&seg(k).length===seg(p).length+1).map(k=>Object.assign({id:seg(k).pop()},o[k]))};
  return {kind:'Ngoại tuyến',live:false,get:async p=>L()[seg(p).join('/')]||null,set:async(p,v)=>{const o=L();o[seg(p).join('/')]=v;W(o)},del:async p=>{const o=L();delete o[seg(p).join('/')];W(o)},
    add:async(p,v)=>{const o=L(),id='L'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);o[seg(p).join('/')+'/'+id]=v;W(o);return {id}},list:async p=>ls(p),last:async(p,n)=>ls(p).sort((a,b)=>(a.t||0)-(b.t||0)).slice(-n)}}
let BEp=null;
function be(){if(BEp)return BEp;BEp=(async()=>{const u=fbUrl();if(u)return rest(u);try{if(window.claude&&claude.use){const db=await claude.use('db');if(db){let ok=null;try{const us=await claude.use('user');ok=us&&us.can?us.can('data.write'):null}catch(e){}if(ok!==false)return cdb(db)}}}catch(e){}return local()})();return BEp}
async function call(f){const b=await be();try{return await f(b)}catch(e){if(b.kind==='Claude'&&/invalid_argument|not_granted|denied/i.test(String(e&&(e.code||e.message)))){BEp=Promise.resolve(local());toast('Bạn chưa có quyền ghi dữ liệu chung ở đây · chuyển sang chế độ ngoại tuyến')}else toast('Lỗi máy chủ: '+(e&&e.message||e));throw e}}
const meDoc=()=>({n:NM(),lv:LV(),av:S.av|0,rk:S.rank||1,pw:(()=>{try{return PWR.total()}catch(e){return 0}})(),c:S.c90c||null,t:Date.now()});
/* ---------- giao diện ---------- */
const st=document.createElement('style');st.textContent=`
#c90{position:fixed;inset:0;z-index:7;display:none;flex-direction:column;background:radial-gradient(ellipse at 15% 0,#14307e,transparent 60%),#050b24;color:#e8f0ff;font:14px system-ui,'Be Vietnam Pro',sans-serif;padding:env(safe-area-inset-top,0) env(safe-area-inset-right,0) env(safe-area-inset-bottom,0) env(safe-area-inset-left,0)}
#c90 .q9h{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #1c3a80;flex:none}
#c90 .q9bk{width:34px;height:34px;border-radius:10px;border:1.5px solid #35d4ff;background:#071a40;color:#5fe3ff;font-size:22px;cursor:pointer}
#c90 h1{margin:0;font-size:clamp(15px,2.6vh,20px);letter-spacing:.08em;color:#9fd6ff}
#c90 .q9sv{margin-left:auto;font-size:11px;padding:3px 9px;border-radius:99px;border:1px solid #4a5a86;color:#8fa6d8;white-space:nowrap;cursor:pointer}#c90 .q9sv.q9on{border-color:#3fd08a;color:#7dffb4}
#c90 .q9tb{display:flex;gap:6px;padding:8px 14px 0;flex:none;overflow-x:auto}
#c90 .q9tb button{flex:1;min-width:110px;padding:9px 8px;border-radius:10px 10px 0 0;border:1px solid #1c3a80;border-bottom:0;background:#0a1a46;color:#9fb6e8;font-weight:800;font-size:13px;cursor:pointer;white-space:nowrap}
#c90 .q9tb button.q9on{background:linear-gradient(#1d4cb0,#12306f);color:#fff;border-color:#35d4ff}
#c90 .q9bd{flex:1;min-height:0;overflow:auto;padding:12px 14px 18px;border-top:1px solid #1c3a80}
#c90 .q9cd{background:#0a1a46;border:1px solid #1c3a80;border-radius:12px;padding:12px;margin-bottom:10px}
#c90 .q9cd h3{margin:0 0 8px;font-size:13px;letter-spacing:.06em;color:#9fd6ff}
#c90 small,#c90 .q9dim{color:#8fa6d8;font-size:12px}
#c90 .q9bt{white-space:nowrap;padding:8px 14px;border-radius:9px;border:1px solid #4a5a86;background:#14275a;color:#fff;cursor:pointer;font-weight:700;font-size:13px}
#c90 .q9bt.q9pr{background:linear-gradient(#ffd45a,#e79a12);color:#3a2600;border-color:#ffd45a}#c90 .q9bt.q9dg{border-color:#a04050;color:#ff9aa8}#c90 .q9bt:disabled{opacity:.45;cursor:not-allowed}
#c90 .q9rw{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#c90 input,#c90 select,#c90 textarea{box-sizing:border-box;background:#06122e;border:1px solid #2a4a95;border-radius:9px;color:#fff;padding:9px 10px;font-size:14px;font-family:inherit}
#c90 .q9chat{display:flex;flex-direction:column;gap:6px;height:min(56vh,520px);overflow:auto;padding:8px;background:#040c26;border:1px solid #1c3a80;border-radius:10px;margin-bottom:8px}
#c90 .q9ms{display:flex;gap:8px;align-items:flex-start}#c90 .q9ms img{width:30px;height:30px;border-radius:50%;object-fit:cover;border:1.5px solid #35d4ff;flex:none;background:#071a40}
#c90 .q9ms .q9b{background:#0e2258;border:1px solid #1d3d8a;border-radius:10px;padding:5px 9px;max-width:78%;word-break:break-word}#c90 .q9ms.q9me{flex-direction:row-reverse}#c90 .q9ms.q9me .q9b{background:#173a1e;border-color:#2e7a3c}
#c90 .q9ms .q9n{font-size:11.5px;font-weight:800;color:#ffd45a}#c90 .q9ms .q9n i{font-style:normal;color:#7fd8ff;margin-left:4px}#c90 .q9ms .q9n s{text-decoration:none;color:#8fa6d8;font-weight:400;margin-left:6px}
#c90 .q9li{display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #12306f}#c90 .q9li:first-child{border-top:0}#c90 .q9li .q9sp{flex:1;min-width:0}#c90 .q9li b{display:block}
#c90 .q9tag{display:inline-block;padding:1px 7px;border-radius:6px;background:#2a1f05;border:1px solid #ffd45a;color:#ffd45a;font-weight:800;font-size:11px;margin-right:6px}
#c90 .q9code{font:800 clamp(22px,5vh,34px)/1 ui-monospace,Consolas,monospace;letter-spacing:.2em;color:#ffd45a}
#c90 .q9nt{background:#2a2410;border:1px solid #6b5a1c;color:#ffe08a;border-radius:10px;padding:9px 12px;font-size:12.5px;line-height:1.5;margin-bottom:10px}
#c90 .q9grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;max-height:280px;overflow:auto}
#c90 .q9grid button{text-align:left;padding:7px 8px;border-radius:8px;border:1px solid #2a4a95;background:#06122e;color:#dfe9ff;font-size:12px;cursor:pointer}#c90 .q9grid button.q9on{border-color:#ffd45a;background:#2a2410}`;
document.head.appendChild(st);
const ov=document.createElement('div');ov.id='c90';
ov.innerHTML=`<div class="q9h"><button class="q9bk" data-a="bk" aria-label="Quay lại">‹</button><h1>SẢNH CỘNG ĐỒNG</h1><span class="q9sv" id="c90sv" data-a="srv">…</span></div>
<div class="q9tb"><button data-t="w" class="q9on">🌐 Kênh thế giới</button><button data-t="c">🛡 Clan</button><button data-t="g">🎁 Tặng quà</button><button data-t="r">⚔ Phòng PvP</button></div><div class="q9bd" id="c90bd"></div>`;
document.body.appendChild(ov);
let TAB='w',timer=0,ROOM=null,lastChat='',SRV=false,GARM=0;
const bd=()=>document.getElementById('c90bd');
async function srvLabel(){const b=await be(),s=document.getElementById('c90sv');if(s){s.textContent=(b.live?'● ':'○ ')+'Máy chủ: '+b.kind;s.className='q9sv'+(b.live?' q9on':'')}}
function open(){ov.style.display='flex';srvLabel();render();clearInterval(timer);timer=setInterval(tick,3000);call(b=>b.set('players/'+UID(),meDoc())).catch(()=>{})}
function close(){ov.style.display='none';clearInterval(timer);try{refresh()}catch(e){}}
window.C90={open,close,be};
function tick(){if(ov.style.display==='none'){clearInterval(timer);return}if(TAB==='w')loadChat('world/chat/msgs','c90wc');else if(TAB==='c'&&S.c90c)loadChat('clans/'+S.c90c+'/chat','c90cc');else if(TAB==='r'&&ROOM)roomPoll();else if(TAB==='g')giftInbox(true)}
/* ---------- kênh chat ---------- */

/* ---- người chơi máy trong Kênh thế giới (chạy trên máy người xem, không ghi lên máy chủ, có gắn nhãn "máy") ---- */
const BOT=(function(){const R=a=>a[(Math.random()*a.length)|0];const N=[];const TAGS=['VN1','RỒNG','SAO','HUB','TITAN','ĐÊM','LỬA','ORB','KÌ','HẠM'];
  const P1=['Rồng','Sói','Bão','Sao','Hổ','Ưng','Lửa','Băng','Sấm','Gió','Mèo','Cáo','Thép','Đêm','Ngân','Phượng','Kỳ','Hải','Thiên','Long'],P2=['Đen','Bạc','Lửa','Xanh','Vàng','Đỏ','Trắng','Tím','Không Gian','Sắt','Đá','Vô Ảnh','Bất Bại','Thép','Hà','Tử'],P3=['Pro','VN','99','2k','x','Mini','Boss','Captain','',''];
  const nm=()=>{const n=R(P1)+' '+R(P2)+(Math.random()<.5?' '+R(P3):'');return n.trim()+(Math.random()<.3?' '+((Math.random()*90+10)|0):'')};
  for(let i=0;i<26;i++)N.push({u:'bot'+i,n:nm(),lv:5+((Math.random()*95)|0),av:(Math.random()*40)|0,c:Math.random()<.55?R(TAGS):null});
  const X=['Ai đánh PvP 2 vs 2 không, vào phòng mình nè','Thảm Serengeti triệu hồi ngựa vằn nhìn vui ghê','Clan mình đang tuyển thêm người, ai vào không','Mới lên bậc 10 xếp hạng, mệt thật sự','Có ai biết xếp căn cứ mẫu nào thủ tốt không?','Mẫu Mắt bão thủ khá chắc đó các bác','Pháo laser nâng cấp tới cấp 50 là bắn sướng tay','Boss màn 30 khó quá, ai qua chưa','Tàu boss mới đẹp thật','Vừa mua mẫu Chữ X, xếp lại căn cứ nhìn gọn hẳn','Đội mình bị phá trụ sở phút cuối, tiếc ghê','Ai có mã phòng PvP giao hữu không','Thuyền trưởng cấp 60 mở thêm ô kỹ năng rồi','Bật nền tối trong cài đặt chơi mượt hơn hẳn','Mạng bẫy điện từ giáp khủng thật','Có ai tặng quà thảm không, mình đang thiếu','Hôm nay đánh được 7 trận thắng liên tiếp','Kỹ năng ong lửa của địch khó chịu ghê','Mô-đun hồi phục lắp vào trụ sở đỡ lắm','Chào cả nhà, mình mới chơi','Phút thứ 5 trụ sở tụt máu nhanh lắm, phải đánh nhanh','Thảm hồng hạc nhìn đẹp mà khiêu khích địch tốt','Ai chỉ mình cách mở ô mới cho tàu boss với','Xạ thủ đêm bắn tỉa đau thật','Đá kiếm ở đâu nhanh nhất vậy mọi người','Mới ghép được tàu phụ thứ 40','Đánh 2 vs 2 với đồng đội máy cũng ổn phết','Tối nay clan mình đánh giao hữu nhé','Gg mọi người','Lại thua vì quên nâng tường thành 😅','Trụ sở cấp 30 mà lưới mô-đun rộng hẳn','Ai thử thảm sắt từ chưa, gai đẩy lùi vui lắm','Giờ này đông người chơi ghê','Cho mình hỏi thuyền trưởng nào hợp với pháo hạng nặng','Vừa nổ trụ sở địch, cảnh quay đã mắt thật'];
  const RE=[['chào|hello|hi|xin chào','Chào bạn nha 👋','Chào bạn, chơi vui nhé!','Hello, mới vào hả bạn?'],['pvp|phòng|giao hữu','Mình vào được nè, gửi mã phòng đi','Để tí mình rảnh đánh với bạn','PvP giờ này dễ ghép lắm'],['clan','Clan mình còn chỗ đó bạn','Vào clan có chat riêng tiện lắm'],['\\?|sao|làm sao|cách','Bạn thử vào phần nâng cấp xem','Mình cũng đang thắc mắc giống bạn','Xem trong cài đặt có đó bạn']];
  let L=[],last=0;const mk=(b,x,t)=>({id:'b'+t+'_'+((Math.random()*1e6)|0),u:b.u,n:b.n,lv:b.lv,av:b.av,c:b.c,x,t,bot:1});
  function seed(){if(L.length)return;const now=Date.now();for(let i=14;i>0;i--)L.push(mk(R(N),R(X),now-i*(25000+Math.random()*30000)));last=now}
  function tick(){seed();const now=Date.now();if(now-last>4000+Math.random()*9000){last=now;L.push(mk(R(N),R(X),now));if(L.length>60)L=L.slice(-60)}}
  function reply(x){const lo=x.toLowerCase();const m=RE.find(r=>new RegExp(r[0]).test(lo));const n=m?1+(Math.random()<.4):Math.random()<.5?1:0;for(let i=0;i<n;i++)setTimeout(()=>{L.push(mk(R(N),m?R(m.slice(1)):R(X),Date.now()))},2000+Math.random()*4000+i*2500)}
  function merge(A){tick();return A.concat(L).sort((a,b)=>a.t-b.t).slice(-60)}
  return {merge,reply,tick}})();
async function loadChat(path,elId){const el=document.getElementById(elId);if(!el)return;let L=[];try{L=await call(b=>b.last(path,60))}catch(e){L=[]}if(path==='world/chat/msgs')L=BOT.merge(L);
  const key=L.map(m=>m.id).join(',');if(key===el.dataset.k)return;el.dataset.k=key;const atB=el.scrollTop+el.clientHeight>=el.scrollHeight-30;
  el.innerHTML=L.length?L.map(m=>`<div class="q9ms ${m.u===UID()?'q9me':''}"><img src="${AV(m.av)}" alt=""><div class="q9b"><div class="q9n">${esc(m.n)}${m.c?`<i>[${esc(m.c)}]</i>`:''}<s>Lv.${m.lv|0} · ${fmtT(m.t)}${m.bot?' · máy':''}</s></div>${esc(m.x)}</div></div>`).join(''):'<div class="q9dim" style="text-align:center;margin:auto">Chưa có tin nhắn nào — hãy chào mọi người!</div>';
  if(atB||!el.dataset.sc){el.scrollTop=el.scrollHeight;el.dataset.sc=1}}
async function send(path,inp,elId){const x=inp.value.trim().slice(0,200);if(!x)return;const now=Date.now();if(now-(send.t||0)<1500){toast('Gửi chậm lại một chút');return}send.t=now;inp.value='';
  let tag=null;try{if(S.c90c){const c=await call(b=>b.get('clans/'+S.c90c));tag=c&&c.tag}}catch(e){}
  if(path==='world/chat/msgs')BOT.reply(x);try{await call(b=>b.add(path,{u:UID(),n:NM(),lv:LV(),av:S.av|0,c:tag,x,t:now}));loadChat(path,elId)}catch(e){}}
function chatBox(id,path,ph){return `<div class="q9chat" id="${id}"><div class="q9dim" style="text-align:center;margin:auto">Đang tải…</div></div><div class="q9rw"><input id="${id}i" maxlength="200" placeholder="${ph}" style="flex:1;min-width:160px"><button class="q9bt q9pr" data-a="send" data-p="${path}" data-e="${id}">Gửi</button></div>`}
/* ---------- render các tab ---------- */
async function render(){ov.querySelectorAll('.q9tb button').forEach(b=>b.classList.toggle('q9on',b.dataset.t===TAB));const B=bd();const b=await be();
  const off=b.live?'':`<div class="q9nt">Đang ở chế độ <b>ngoại tuyến</b>: dữ liệu chỉ lưu trên máy này, người chơi khác chưa thấy được. Để mọi người cùng chơi, chủ game dán địa chỉ máy chủ Firebase vào mục <b>Máy chủ</b> (bấm vào nhãn máy chủ ở góc phải).</div>`;
  const sv=SRV?`<div class="q9cd"><h3>MÁY CHỦ</h3><small>Dán địa chỉ Firebase Realtime Database (miễn phí) để mọi người chơi cùng kênh thế giới, clan, tặng quà và phòng PvP. Để trống = dùng kho dữ liệu sẵn có hoặc ngoại tuyến.</small><div class="q9rw" style="margin-top:8px"><input id="c90fb" value="${esc(fbUrl())}" placeholder="https://ten-du-an-default-rtdb.firebaseio.com" style="flex:1;min-width:200px"><button class="q9bt q9pr" data-a="srvsave">Lưu</button></div></div>`:'';
  if(TAB==='w'){B.innerHTML=sv+off+`<div class="q9cd"><h3>🌐 KÊNH THẾ GIỚI</h3><small>Trò chuyện với mọi người chơi · tối đa 200 ký tự · giữ lịch sự</small><div style="height:8px"></div>${chatBox('c90wc','world/chat/msgs','Nhập tin nhắn…')}</div>`;loadChat('world/chat/msgs','c90wc')}
  else if(TAB==='c')renderClan(B,off);else if(TAB==='g')renderGift(B,off);else renderRoom(B,off)}
/* ---------- CLAN ---------- */
const CLAN_COST=5000,CLAN_MAX=30;
async function renderClan(B,off){B.innerHTML=off+'<div class="q9cd q9dim">Đang tải clan…</div>';let my=null,inv=[];
  try{if(S.c90c){my=await call(b=>b.get('clans/'+S.c90c));if(!my||!my.mem||!my.mem[UID()]){S.c90c=null;save();my=null}}inv=await call(b=>b.list('inbox/'+UID()+'/cinv'))}catch(e){}
  if(my){const M=Object.entries(my.mem||{}).sort((a,b)=>(b[1].r==='lead')-(a[1].r==='lead')||(b[1].lv||0)-(a[1].lv||0)),lead=my.lead===UID();let req=[];if(lead){try{req=await call(b=>b.list('clans/'+S.c90c+'/req'))}catch(e){}}
    B.innerHTML=off+`<div class="q9cd"><h3><span class="q9tag">${esc(my.tag)}</span>${esc(my.name)}</h3><small>${esc(my.d||'')}</small><div class="q9rw" style="margin-top:8px"><small>Thành viên ${M.length}/${CLAN_MAX} · ${my.open?'Mở tự do':'Cần duyệt'} · Mã clan: <b>${esc(S.c90c)}</b></small><span style="flex:1"></span>${lead?`<button class="q9bt" data-a="ctog">${my.open?'Đổi sang cần duyệt':'Đổi sang mở tự do'}</button>`:''}<button class="q9bt q9dg" data-a="cleave">${lead?'Giải tán / rời':'Rời clan'}</button></div></div>
      ${lead?`<div class="q9cd"><h3>MỜI NGƯỜI CHƠI</h3><div class="q9rw"><input id="c90inv" placeholder="Mã người chơi (vd P1A2B3)" style="flex:1;min-width:160px;text-transform:uppercase"><button class="q9bt q9pr" data-a="cinv">Gửi lời mời</button></div><small>Mã người chơi xem ở mục Bạn bè & Góp ý.</small>
        ${req.length?'<div style="margin-top:8px">'+req.map(r=>`<div class="q9li"><img src="${AV(r.av)}" style="width:34px;height:34px;border-radius:50%" alt=""><div class="q9sp"><b>${esc(r.n)}</b><small>Lv.${r.lv|0} xin vào clan</small></div><button class="q9bt q9pr" data-a="creqok" data-id="${esc(r.id)}">Duyệt</button><button class="q9bt q9dg" data-a="creqno" data-id="${esc(r.id)}">Từ chối</button></div>`).join('')+'</div>':''}</div>`:''}
      <div class="q9cd"><h3>THÀNH VIÊN</h3>${M.map(([u,m])=>`<div class="q9li"><img src="${AV(m.av)}" style="width:34px;height:34px;border-radius:50%" alt=""><div class="q9sp"><b>${esc(m.n)} ${m.r==='lead'?'👑':''}</b><small>Lv.${m.lv|0} · Bậc ${m.rk||1} · Lực chiến ${NF(m.pw)} · ${esc(u)}</small></div>${lead&&u!==UID()?`<button class="q9bt q9dg" data-a="ckick" data-id="${esc(u)}">Mời ra</button>`:''}</div>`).join('')}</div>
      <div class="q9cd"><h3>💬 CHAT CLAN</h3>${chatBox('c90cc','clans/'+S.c90c+'/chat','Nhắn cho cả clan…')}</div>`;loadChat('clans/'+S.c90c+'/chat','c90cc');return}
  let L=[];try{L=await call(b=>b.list('clans'))}catch(e){}L=L.filter(c=>c&&c.name&&c.mem).sort((a,b)=>Object.keys(b.mem).length-Object.keys(a.mem).length).slice(0,60);
  B.innerHTML=off+(inv.length?`<div class="q9cd"><h3>LỜI MỜI VÀO CLAN</h3>${inv.map(i=>`<div class="q9li"><div class="q9sp"><b><span class="q9tag">${esc(i.tag)}</span>${esc(i.name)}</b><small>${esc(i.fn)} mời bạn · ${fmtT(i.t)}</small></div><button class="q9bt q9pr" data-a="cacc" data-id="${esc(i.id)}" data-c="${esc(i.cid)}">Vào clan</button><button class="q9bt q9dg" data-a="crej" data-id="${esc(i.id)}">Bỏ qua</button></div>`).join('')}</div>`:'')+
   `<div class="q9cd"><h3>LẬP CLAN MỚI</h3><div class="q9rw"><input id="c90cn" maxlength="20" placeholder="Tên clan" style="flex:2;min-width:140px"><input id="c90ct" maxlength="4" placeholder="Ký hiệu" style="width:90px;text-transform:uppercase"><label class="q9dim"><input type="checkbox" id="c90co" checked> Mở tự do</label><button class="q9bt q9pr" data-a="cnew">Lập clan · ${NF(CLAN_COST)} Đá</button></div><input id="c90cd" maxlength="80" placeholder="Giới thiệu ngắn (không bắt buộc)" style="width:100%;margin-top:8px"></div>
   <div class="q9cd"><h3>DANH SÁCH CLAN</h3>${L.length?L.map(c=>{const n=Object.keys(c.mem).length;return `<div class="q9li"><div class="q9sp"><b><span class="q9tag">${esc(c.tag)}</span>${esc(c.name)}</b><small>${n}/${CLAN_MAX} thành viên · ${c.open?'Mở tự do':'Cần duyệt'} · ${esc(c.d||'')}</small></div><button class="q9bt q9pr" data-a="cjoin" data-id="${esc(c.id)}" ${n>=CLAN_MAX?'disabled':''}>${c.open?'Vào ngay':'Xin vào'}</button></div>`}).join(''):'<small>Chưa có clan nào — hãy là người đầu tiên lập clan!</small>'}</div>`}
const memRec=r=>({n:NM(),lv:LV(),av:S.av|0,rk:S.rank||1,pw:(()=>{try{return PWR.total()}catch(e){return 0}})(),r:r||'mem',t:Date.now()});
async function joinClan(cid,force){const c=await call(b=>b.get('clans/'+cid));if(!c){toast('Clan không còn tồn tại');return}const n=Object.keys(c.mem||{}).length;if(n>=CLAN_MAX){toast('Clan đã đủ người');return}
  if(!c.open&&!force){await call(b=>b.set('clans/'+cid+'/req/'+UID(),{n:NM(),lv:LV(),av:S.av|0,t:Date.now()}));toast('Đã gửi đơn xin vào clan '+c.name);return}
  c.mem=c.mem||{};c.mem[UID()]=memRec('mem');await call(b=>b.set('clans/'+cid,c));S.c90c=cid;save();toast('Đã vào clan '+c.name)}
/* ---------- TẶNG QUÀ ---------- */
const KINDS=[['cp','Thảm'],['wp','Vũ khí'],['ar','Giáp'],['md','Modul'],['sh','Tàu'],['bk','Tàu boss'],['sk','Kỹ năng'],['cap','Thuyền trưởng']];
const own=()=>S.own||(S.own={});
const arr=v=>Array.isArray(v)?v:[];
function nameOf(x){return x?(x.n||x[0]||x.id):''}
function mine(k){try{
  if(k==='cp')return (window.C39&&C39.CP||[]).filter(c=>c.id!=='cp0'&&own()[c.id]).map(c=>({id:c.id,n:c.n}));
  if(k==='wp')return arr(typeof WP!=='undefined'?WP:[]).filter(w=>own()[w.id]).map(w=>({id:w.id,n:nameOf(w)}));
  if(k==='ar')return arr(typeof ARM!=='undefined'?ARM:[]).filter(w=>w&&w.id&&own()[w.id]).map(w=>({id:w.id,n:nameOf(w)}));
  if(k==='md')return [].concat(typeof ENG!=='undefined'?ENG:[],typeof NUC!=='undefined'?NUC:[],typeof TNK!=='undefined'?TNK:[],typeof MRD!=='undefined'?MRD:[]).filter(w=>w&&w.id&&own()[w.id]).map(w=>({id:w.id,n:nameOf(w)}));
  if(k==='sh')return arr(typeof KSH!=='undefined'?KSH:[]).filter(x=>S.unl&&S.unl[x.id]).map(x=>({id:x.id,n:x.n}));
  if(k==='bk')return arr(typeof BSH!=='undefined'?BSH:[]).filter(x=>bkOwn(x.id)).map(x=>({id:x.id,n:x.n}));
  if(k==='sk')return arr(S.skills).map(n=>({id:n,n}));
  if(k==='cap')return arr(S.caps).map(n=>({id:n,n}))}catch(e){}return []}
function inUseCap(n){try{const f=flS();if(f.mc===n)return true;return (f.e||[]).some(e=>e&&e.c===n)}catch(e){return false}}
function takeFrom(k,id){
  if(['cp','wp','ar','md'].includes(k)){if(!own()[id])return false;delete own()[id];return true}
  if(k==='sh'){if(!(S.unl&&S.unl[id]))return false;delete S.unl[id];return true}
  if(k==='bk'){if(!bkOwn(id))return false;delete S.bk.o[id];return true}
  if(k==='sk'){const i=arr(S.skills).indexOf(id);if(i<0)return false;S.skills.splice(i,1);try{Object.keys(S.cske||{}).forEach(c=>{S.cske[c]=(S.cske[c]||[]).map(n=>n===id?null:n)})}catch(e){}return true}
  if(k==='cap'){const i=arr(S.caps).indexOf(id);if(i<0||S.caps.length<=1||inUseCap(id))return false;S.caps.splice(i,1);return true}return false}
function giveTo(k,id){
  if(['cp','wp','ar','md'].includes(k)){own()[id]=1;return}
  if(k==='sh'){S.unl=S.unl||{};S.unl[id]=true;return}
  if(k==='bk'){S.bk=S.bk||{};S.bk.o=S.bk.o||{};S.bk.o[id]=1;return}
  if(k==='sk'){S.skills=arr(S.skills);if(!S.skills.includes(id))S.skills.push(id);return}
  if(k==='cap'){S.caps=arr(S.caps);if(!S.caps.includes(id))S.caps.push(id)}}
let GK='cp',GSEL=null;
async function giftInbox(quiet){const el=document.getElementById('c90gi');if(!el)return;let L=[];try{L=await call(b=>b.list('inbox/'+UID()+'/gift'))}catch(e){return}L.sort((a,b)=>(b.t||0)-(a.t||0));
  const key=L.map(x=>x.id).join(',');if(quiet&&key===el.dataset.k)return;el.dataset.k=key;
  el.innerHTML=L.length?L.map(g=>`<div class="q9li"><div class="q9sp"><b>🎁 ${esc(g.nm)}</b><small>${esc((KINDS.find(x=>x[0]===g.k)||[0,''])[1])} · từ ${esc(g.fn)} (${esc(g.f)}) · ${fmtT(g.t)}${g.msg?' · “'+esc(g.msg)+'”':''}</small></div><button class="q9bt q9pr" data-a="gclaim" data-id="${esc(g.id)}">Nhận quà</button></div>`).join(''):'<small>Chưa có quà nào gửi tới bạn.</small>'}
function renderGift(B,off){const L=mine(GK);if(GSEL&&!L.some(x=>x.id===GSEL))GSEL=null;
  B.innerHTML=off+`<div class="q9cd"><h3>📥 QUÀ NHẬN ĐƯỢC</h3><div id="c90gi"><small>Đang tải…</small></div></div>
  <div class="q9cd"><h3>🎁 TẶNG QUÀ CHO NGƯỜI CHƠI KHÁC</h3><small>Mã của bạn: <b style="color:#ffd45a">${esc(UID())}</b> · Vật phẩm tặng đi sẽ chuyển hẳn sang người nhận.</small>
   <div class="q9rw" style="margin:8px 0">${KINDS.map(k=>`<button class="q9bt ${k[0]===GK?'q9pr':''}" data-a="gk" data-k="${k[0]}">${k[1]}</button>`).join('')}</div>
   <div class="q9grid">${L.length?L.map(x=>`<button data-a="gsel" data-id="${esc(x.id)}" class="${x.id===GSEL?'q9on':''}">${esc(x.n)}</button>`).join(''):'<small>Bạn chưa sở hữu vật phẩm loại này để tặng (chỉ tặng được vật phẩm đã mua / đã sở hữu).</small>'}</div>
   <div class="q9rw" style="margin-top:8px"><input id="c90gto" placeholder="Mã người nhận (vd P1A2B3)" style="flex:1;min-width:150px;text-transform:uppercase"><input id="c90gm" maxlength="60" placeholder="Lời nhắn (không bắt buộc)" style="flex:2;min-width:150px"><button class="q9bt q9pr" data-a="gsend" ${GSEL?'':'disabled'}>Tặng</button></div></div>`;giftInbox()}
/* ---------- PHÒNG PvP THEO MÃ ---------- */
function snap(){const P=bPos(),L=bPlaced().filter(b=>b.t!=='mine'&&b.t!=='warp'&&b.t!=='hangar'&&P[b.id]);let y1=-1e9,x0=1e9;L.forEach(b=>{y1=Math.max(y1,P[b.id][1]+b.h);x0=Math.min(x0,P[b.id][0])});
  const items=L.map(b=>({id:b.id,t:b.t,x:P[b.id][0]-x0,y:y1-(P[b.id][1]+b.h),w:b.w,h:b.h,lv:bLv(b.t),v:!!b.v,hqf:b.t==='hq'?1:0}));
  let ship=null,esc=0,cap=null,sk=[];try{const f=PWR.fleet();ship=f[0]&&f[0].id;esc=Math.max(0,f.length-1)}catch(e){}try{cap=flS().mc||S.caps[0];sk=((S.cske||{})[cap]||[]).filter(Boolean)}catch(e){}
  return {n:NM(),u:UID(),rank:S.rank||1,hqLv:bLv('hq'),ship,esc,cap,clv:(()=>{try{return clv(cap)}catch(e){return 1}})(),sk,cp:(()=>{try{return C39.cur().id}catch(e){return null}})(),pw:(()=>{try{return PWR.total()}catch(e){return 0}})(),items,t:Date.now()}}
async function roomPoll(){if(!ROOM)return;let r=null;try{r=await call(b=>b.get('rooms/'+ROOM))}catch(e){return}if(!r){ROOM=null;render();return}const k=JSON.stringify([r.h&&r.h.u,r.g&&r.g.u,(r.res||[]).length]);if(k!==roomPoll.k){roomPoll.k=k;render()}}
async function renderRoom(B,off){let r=null;if(ROOM){try{r=await call(b=>b.get('rooms/'+ROOM))}catch(e){}if(!r)ROOM=null}
  if(!r){B.innerHTML=off+`<div class="q9cd"><h3>⚔ PHÒNG ĐẤU PvP THEO MÃ</h3><small>Tạo phòng rồi gửi mã cho bạn bè. Hai bên lần lượt tấn công căn cứ và hạm đội thật của nhau (trận giao hữu, không tính điểm hạng, địch không được cộng thêm sức mạnh AI).</small>
     <div class="q9rw" style="margin-top:10px"><button class="q9bt q9pr" data-a="rnew">Tạo phòng mới</button><span class="q9dim">hoặc</span><input id="c90rc" maxlength="6" placeholder="Nhập mã phòng" style="width:150px;text-transform:uppercase;letter-spacing:.15em"><button class="q9bt" data-a="rjoin">Vào phòng</button></div></div>`;return}
  const meH=r.h&&r.h.u===UID(),opp=meH?r.g:r.h,res=(r.res||[]).slice(-10).reverse();
  B.innerHTML=off+`<div class="q9cd"><h3>PHÒNG</h3><div class="q9rw"><span class="q9code">${esc(ROOM)}</span><small>Gửi mã này cho bạn bè để vào phòng</small><span style="flex:1"></span><button class="q9bt q9dg" data-a="rleave">Rời phòng</button></div></div>
   <div class="q9cd"><h3>NGƯỜI CHƠI</h3>${[r.h,r.g].map((p,i)=>p?`<div class="q9li"><div class="q9sp"><b>${i?'Khách':'Chủ phòng'}: ${esc(p.n)} ${p.u===UID()?'(bạn)':''}</b><small>Bậc ${p.s&&p.s.rank||1} · Trụ sở Lv.${p.s&&p.s.hqLv||1} · ${(p.s&&p.s.items||[]).length} công trình · ${p.s&&p.s.esc||0} tàu phụ · Lực chiến ${NF(p.s&&p.s.pw)}</small></div></div>`:`<div class="q9li"><div class="q9sp"><small>Đang chờ người chơi thứ hai vào phòng…</small></div></div>`).join('')}
    <div class="q9rw" style="margin-top:8px"><button class="q9bt q9pr" data-a="rfight" ${opp?'':'disabled'}>⚔ Tấn công căn cứ của ${esc(opp?opp.n:'đối thủ')}</button><button class="q9bt" data-a="rsync">Cập nhật đội hình của tôi</button></div></div>
   <div class="q9cd"><h3>KẾT QUẢ</h3>${res.length?res.map(x=>`<div class="q9li"><div class="q9sp"><b>${esc(x.n)} ${x.w?'thắng':'thua'} khi tấn công ${esc(x.o)}</b><small>${fmtT(x.t)}</small></div></div>`).join(''):'<small>Chưa có trận nào.</small>'}</div>`}
async function roomSet(fn){const r=await call(b=>b.get('rooms/'+ROOM));if(!r)return null;fn(r);await call(b=>b.set('rooms/'+ROOM,r));return r}
/* ---------- sự kiện ---------- */
ov.addEventListener('click',async e=>{const t=e.target.closest('[data-t]');if(t&&t.parentElement.classList.contains('q9tb')){TAB=t.dataset.t;render();return}
  const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id;
  try{
  if(a==='bk')close();
  else if(a==='srv'){SRV=!SRV;render()}
  else if(a==='srvsave'){const u=document.getElementById('c90fb').value.trim();try{localStorage.setItem('se_fb',u)}catch(x){}BEp=null;SRV=false;srvLabel();render()}
  else if(a==='send'){const inp=document.getElementById(b.dataset.e+'i');send(b.dataset.p,inp,b.dataset.e)}
  else if(a==='cnew'){if(S.c90c){toast('Bạn đang ở trong một clan');return}const n=document.getElementById('c90cn').value.trim(),tg=document.getElementById('c90ct').value.trim().toUpperCase();if(n.length<2||tg.length<2){toast('Nhập tên clan (≥2 ký tự) và ký hiệu (2–4 ký tự)');return}
    if((S.da||0)<CLAN_COST){toast('Cần '+NF(CLAN_COST)+' Đá để lập clan');return}const cid='C'+Math.random().toString(36).slice(2,8).toUpperCase();
    await call(x=>x.set('clans/'+cid,{name:n,tag:tg,d:document.getElementById('c90cd').value.trim().slice(0,80),open:document.getElementById('c90co').checked,lead:UID(),mem:{[UID()]:memRec('lead')},t:Date.now()}));S.da-=CLAN_COST;S.c90c=cid;save();toast('Đã lập clan '+n);render()}
  else if(a==='cjoin'){await joinClan(id);render()}
  else if(a==='cacc'){await joinClan(b.dataset.c,true);await call(x=>x.del('inbox/'+UID()+'/cinv/'+id));render()}
  else if(a==='crej'){await call(x=>x.del('inbox/'+UID()+'/cinv/'+id));render()}
  else if(a==='cinv'){const to=document.getElementById('c90inv').value.trim().toUpperCase();if(!/^P[0-9A-Z]{4,10}$/.test(to)){toast('Mã người chơi không hợp lệ');return}const c=await call(x=>x.get('clans/'+S.c90c));await call(x=>x.add('inbox/'+to+'/cinv',{cid:S.c90c,name:c.name,tag:c.tag,f:UID(),fn:NM(),t:Date.now()}));toast('Đã gửi lời mời tới '+to)}
  else if(a==='creqok'){const r=await call(x=>x.get('clans/'+S.c90c+'/req/'+id));const c=await call(x=>x.get('clans/'+S.c90c));if(c&&r&&Object.keys(c.mem).length<CLAN_MAX){c.mem[id]={n:r.n,lv:r.lv,av:r.av,r:'mem',t:Date.now()};await call(x=>x.set('clans/'+S.c90c,c))}await call(x=>x.del('clans/'+S.c90c+'/req/'+id));render()}
  else if(a==='creqno'){await call(x=>x.del('clans/'+S.c90c+'/req/'+id));render()}
  else if(a==='ckick'){const c=await call(x=>x.get('clans/'+S.c90c));if(c&&c.lead===UID()){delete c.mem[id];await call(x=>x.set('clans/'+S.c90c,c))}render()}
  else if(a==='ctog'){const c=await call(x=>x.get('clans/'+S.c90c));if(c&&c.lead===UID()){c.open=!c.open;await call(x=>x.set('clans/'+S.c90c,c))}render()}
  else if(a==='cleave'){const c=await call(x=>x.get('clans/'+S.c90c));if(c){if(c.lead===UID()){const rest=Object.keys(c.mem).filter(u=>u!==UID());if(rest.length){delete c.mem[UID()];c.lead=rest[0];c.mem[rest[0]].r='lead';await call(x=>x.set('clans/'+S.c90c,c))}else await call(x=>x.del('clans/'+S.c90c))}else{delete c.mem[UID()];await call(x=>x.set('clans/'+S.c90c,c))}}S.c90c=null;save();toast('Đã rời clan');render()}
  else if(a==='gk'){GK=b.dataset.k;GSEL=null;render()}
  else if(a==='gsel'){GSEL=id;render()}
  else if(a==='gsend'){const to=document.getElementById('c90gto').value.trim().toUpperCase(),msg=document.getElementById('c90gm').value.trim().slice(0,60);if(!/^P[0-9A-Z]{4,10}$/.test(to)){toast('Mã người nhận không hợp lệ');return}if(to===UID()){toast('Không thể tự tặng cho mình');return}
    const it=mine(GK).find(x=>x.id===GSEL);if(!it)return;if(GK==='cap'&&(inUseCap(it.id)||S.caps.length<=1)){toast('Thuyền trưởng đang được ráp vào tàu hoặc là thuyền trưởng duy nhất — gỡ ra trước khi tặng');return}
    if(!(GARM>Date.now())){GARM=Date.now()+4000;b.textContent='Bấm lần nữa để xác nhận tặng «'+it.n+'»';setTimeout(()=>{if(b.isConnected)b.textContent='Tặng'},4000);return}GARM=0;
    if(!takeFrom(GK,it.id)){toast('Không thể tặng vật phẩm này');return}save();
    try{await call(x=>x.add('inbox/'+to+'/gift',{k:GK,it:it.id,nm:it.n,f:UID(),fn:NM(),msg,t:Date.now()}))}catch(er){giveTo(GK,it.id);save();return}
    GSEL=null;toast('Đã tặng «'+it.n+'» cho '+to);try{refresh()}catch(x){}render()}
  else if(a==='gclaim'){const g=await call(x=>x.get('inbox/'+UID()+'/gift/'+id));if(!g){render();return}await call(x=>x.del('inbox/'+UID()+'/gift/'+id));giveTo(g.k,g.it||g.id);save();try{refresh()}catch(x){}toast('Đã nhận «'+g.nm+'» từ '+g.fn);render()}
  else if(a==='rnew'){const code=Math.random().toString(36).slice(2,8).toUpperCase();await call(x=>x.set('rooms/'+code,{h:{u:UID(),n:NM(),s:snap()},g:null,res:[],t:Date.now()}));ROOM=code;render()}
  else if(a==='rjoin'){const code=document.getElementById('c90rc').value.trim().toUpperCase();if(code.length<4){toast('Nhập mã phòng');return}const r=await call(x=>x.get('rooms/'+code));if(!r){toast('Không tìm thấy phòng '+code);return}
    if(r.h&&r.h.u!==UID()){if(r.g&&r.g.u&&r.g.u!==UID()){toast('Phòng đã đủ 2 người');return}r.g={u:UID(),n:NM(),s:snap()};await call(x=>x.set('rooms/'+code,r))}ROOM=code;render()}
  else if(a==='rleave'){ROOM=null;render()}
  else if(a==='rsync'){await roomSet(r=>{if(r.h&&r.h.u===UID())r.h.s=snap();else if(r.g&&r.g.u===UID())r.g.s=snap()});toast('Đã cập nhật đội hình của bạn trong phòng');render()}
  else if(a==='rfight'){const r=await call(x=>x.get('rooms/'+ROOM));const opp=r&&(r.h&&r.h.u===UID()?r.g:r.h);if(!opp||!opp.s){toast('Chưa có đối thủ');return}
    if(!window.SEROOM||!SEROOM.start){toast('Chưa sẵn sàng');return}const code=ROOM;close();try{$('lobby').style.display='none';$('lvsel').style.display='flex';lvTab('pvp')}catch(x){}
    SEROOM.start(Object.assign({code},opp.s),async win=>{try{const rr=await call(x=>x.get('rooms/'+code));if(rr){rr.res=(rr.res||[]).concat([{n:NM(),o:opp.n,w:!!win,t:Date.now()}]).slice(-30);await call(x=>x.set('rooms/'+code,rr))}}catch(x){}})}
  }catch(er){console.error(er)}});
ov.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'&&/i$/.test(e.target.id)){const btn=e.target.parentElement.querySelector('[data-a=send]');if(btn)btn.click()}});
/* ---------- nút ở sảnh (cạnh Trụ sở và Thảm chiến trường) ---------- */
const ico='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#0d2a6a" stroke="#5fe3ff" stroke-width="3"/><path d="M8 32h48M32 6c-10 12-10 40 0 52M32 6c10 12 10 40 0 52" stroke="#5fe3ff" stroke-width="2.5" fill="none"/><path d="M40 40h16v10l-5-3h-11z" fill="#ffd45a"/></svg>');
function lobbyBtn(){const t=document.getElementById('tsf');if(!t||!t.parentElement)return;let b=document.getElementById('c90btn');
  if(!b){b=document.createElement('button');b.id='c90btn';b.className='tsf';b.setAttribute('aria-label','Cộng đồng');b.innerHTML='<img alt="" src="'+ico+'" style="width:34px;height:34px"><span>Cộng đồng</span>';b.onclick=open;t.parentElement.appendChild(b)}
  const cs=t.style;b.style.display=getComputedStyle(t).display==='none'?'none':'flex';b.style.width=cs.width;b.style.height=cs.height;b.style.bottom=cs.bottom;b.style.left='calc('+(cs.left||'10px')+' + 2*('+(cs.width||'153px')+' + 8px))';b.style.flexDirection='column';b.style.alignItems='center';b.style.justifyContent='center';b.style.gap='4px'}
setInterval(lobbyBtn,700);lobbyBtn();
})();
