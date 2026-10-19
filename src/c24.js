
/* ---------- cấu hình thanh toán (chỉ sửa ở đây) ---------- */
window.SE_CFG=window.SE_CFG||{};
(function(C){
  if(C.fb==null)C.fb='https://ship-event-default-rtdb.asia-southeast1.firebasedatabase.app';                 /* địa chỉ Firebase Realtime Database, ví dụ 'https://ten-du-an-default-rtdb.asia-southeast1.firebasedatabase.app' */
  C.bank=C.bank||{name:'Agribank',full:'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',bin:'970405',acc:'2000236003939',holder:''};
  C.prefix=C.prefix||'SE';               /* tiền tố nội dung chuyển khoản */
})(window.SE_CFG);
(function(){
/*QRLIB*/
const NF=n=>Math.round(+n||0).toLocaleString('vi-VN');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CFG=window.SE_CFG,BK=()=>CFG.bank;
const ABC='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rid=n=>{const a=new Uint32Array(n);try{crypto.getRandomValues(a)}catch(e){for(let i=0;i<n;i++)a[i]=Math.random()*1e9}return [...a].map(x=>ABC[x%ABC.length]).join('')};
const P=()=>{S.pay=S.pay||{};S.pay.orders=S.pay.orders||[];return S.pay};
const me=()=>{S.fb=S.fb||{};if(!S.fb.uid)S.fb.uid='P'+rid(6);return S.fb.uid};
const say=m=>{try{toast(m)}catch(e){}};

/* ---------- VietQR (chuẩn EMVCo / NAPAS 247) ---------- */
const tlv=(id,v)=>{v=String(v);return id+String(v.length).padStart(2,'0')+v};
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function vietqr(amount,info){const b=BK();
  const mai=tlv('00','A000000727')+tlv('01',tlv('00',b.bin)+tlv('01',b.acc))+tlv('02','QRIBFTTA');
  const p=tlv('00','01')+tlv('01',amount?'12':'11')+tlv('38',mai)+tlv('53','704')+(amount?tlv('54',String(Math.round(amount))):'')+tlv('58','VN')+(info?tlv('62',tlv('08',info)):'')+'6304';
  return p+crc16(p)}
function qrCanvas(text,px){const q=qrcode(0,'M');q.addData(text);q.make();const n=q.getModuleCount(),m=4,s=Math.max(2,Math.floor(px/(n+2*m))),W=(n+2*m)*s;
  const c=document.createElement('canvas');c.width=c.height=W;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,W,W);g.fillStyle='#000';
  for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))g.fillRect((k+m)*s,(r+m)*s,s,s);c.dataset.payload=text;return c}

/* ---------- máy chủ đơn hàng: Firebase Realtime Database (REST) ---------- */
const FB=()=>String(CFG.fb||'').trim().replace(/\/+$/,'');
async function rq(path,o){o=o||{};const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),12000);
  try{const r=await fetch(FB()+'/'+path+'.json'+(o.q||''),{method:o.m||'GET',headers:o.b!==undefined?{'Content-Type':'application/json'}:undefined,body:o.b!==undefined?JSON.stringify(o.b):undefined,signal:ac.signal});
    if(r.status===401||r.status===403){const e=new Error('denied');e.denied=1;throw e}if(!r.ok)throw new Error('http '+r.status);return r.json()}finally{clearTimeout(tm)}}

/* ---------- trao vật phẩm khi chủ game đã xác nhận ---------- */
function credit(o){let msg='';
  try{
    if(o.src==='psh'){const t=window.PSHG?PSHG(o.spec):[];msg=t.join(', ')}
    else if(o.src==='g'){msg=rwGive(o.spec.g)}
    else if(o.src==='ev'){const ev=(typeof EVO!=='undefined'?EVO:[]).find(x=>x.id===o.spec.id);
      if(ev){if(o.spec.ship){S.unl=S.unl||{};S.unl[o.spec.ship]=true;const k=KSH.find(x=>x.id===o.spec.ship);msg='mở khóa tàu '+(k?k.n:'');try{evFinish(ev,msg)}catch(e){const E=evS();E.buy[ev.id]=1}}
        else{msg=evGive(ev)||'';try{evFinish(ev,msg)}catch(e){const E=evS();E.buy[ev.id]=1}}}}
  }catch(e){console.error(e)}
  o.st='done';o.got=Date.now();o.msg=msg;try{save()}catch(e){}try{refresh()}catch(e){}
  say('✅ Chủ game đã xác nhận đơn '+o.code+' · '+(msg||o.name));
  const af=AFTER[o.id];if(af)try{af()}catch(e){}
  if(FB())rq('got/'+o.id,{m:'PUT',b:{t:Date.now()}}).catch(()=>{});
  myRender()}
async function check(){if(!FB())return;const L=P().orders.filter(o=>o.st==='sent');
  for(const o of L){try{const v=await rq('ok/'+o.id+'/v');if(v===1&&o.st==='sent')credit(o);else if(v===-1&&o.st==='sent'){o.st='no';save();say('❌ Đơn '+o.code+' bị từ chối. Liên hệ chủ game nếu bạn đã chuyển tiền.');myRender()}}catch(e){}}}

/* ---------- giao diện ---------- */
const css=document.createElement('style');
css.textContent=`.pxo{position:fixed;inset:0;z-index:97;background:#000c;display:flex;align-items:center;justify-content:center;padding:8px;font:14px system-ui,sans-serif;color:#fff}
.pxo>div{width:min(460px,96vw);max-height:96vh;overflow:auto;background:linear-gradient(#0b1840,#060f2e);border:1.5px solid #2b5ac9;border-radius:14px;padding:14px;box-shadow:0 0 30px #1b4fe066}
.pxo h3{margin:0 0 4px;font-size:17px;color:#bfe3ff;letter-spacing:.04em}.pxo .pxit{font-weight:700;color:#fff}.pxo .pxsm{font-size:12px;color:#8fa6d8;line-height:1.45}
.pxo .pxam{font-size:24px;font-weight:900;color:#ffd45a;margin:6px 0}.pxo .pxget{font-size:12.5px;color:#9fe8c0;margin-bottom:8px;line-height:1.4}
.pxo .pxqr{display:flex;justify-content:center;margin:8px 0}.pxo .pxqr canvas{width:min(220px,62vw);height:auto;border-radius:8px;border:4px solid #fff;background:#fff}
.pxo .pxrow{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:7px 0;border-top:1px solid #1c3a80}.pxo .pxrow span{color:#9fb6e6;font-size:12.5px}.pxo .pxrow b{font-size:15px;text-align:right;word-break:break-all}
.pxo .pxrow b.cd{font:800 18px ui-monospace,Consolas,monospace;color:#ffd45a;letter-spacing:.06em}
.pxo .pxcp{padding:4px 9px;border-radius:7px;border:1px solid #3aa0ff;background:#0f3a8f;color:#fff;font-size:12px;cursor:pointer;flex:none}
.pxo .pxst{margin:10px 0 4px;padding:9px 10px;border-radius:9px;background:#0a1a4a;border:1px solid #1c3a80;font-size:12.5px;line-height:1.5}
.pxo .pxst ol{margin:4px 0 0 18px;padding:0}.pxo .pxwarn{background:#2a2410;border-color:#6b5a1c;color:#ffe08a}.pxo .pxok{background:#0d2a1c;border-color:#2f7a52;color:#9fffc8}
.pxo .pxbt{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}.pxo .pxbt button{flex:1;min-width:120px;padding:11px 10px;border-radius:10px;border:1px solid #4a5a86;background:#14275a;color:#fff;font-weight:800;font-size:14px;cursor:pointer}
.pxo .pxbt button.go{background:linear-gradient(#ffd45a,#e79a12);color:#3a2600;border-color:#ffd45a}.pxo .pxbt button:disabled{opacity:.5}
.pxo .pxl{border-top:1px solid #1c3a80;padding:8px 0;font-size:13px;display:flex;gap:8px;justify-content:space-between;align-items:center}.pxo .pxl small{display:block;color:#8fa6d8;font-size:11.5px}
.pxo .tg{display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:99px;border:1px solid #4a5a86;color:#cfd8ee;white-space:nowrap}
.pxo .tg.w{border-color:#c9a23a;color:#ffd45a}.pxo .tg.k{border-color:#3fd08a;color:#7dffb4}.pxo .tg.n{border-color:#c04a5a;color:#ff9aa8}
.pxo input{width:100%;box-sizing:border-box;background:#06122e;border:1px solid #2a4a95;border-radius:9px;color:#fff;padding:9px 10px;font-size:14px}
.pxo .pxtab{display:flex;gap:6px;margin:8px 0}.pxo .pxtab button{flex:1;padding:7px;border-radius:8px;border:1px solid #1c4fc9;background:#0c2358;color:#fff;font-weight:700;cursor:pointer}.pxo .pxtab button.on{background:#1c4fc9}
.pxo .pxa{display:flex;gap:6px;flex:none}.pxo .pxa button{padding:7px 10px;border-radius:8px;font-weight:800;cursor:pointer;border:1px solid #3fd08a;background:#0d4a2c;color:#fff}.pxo .pxa button.no{border-color:#c04a5a;background:#4a1420}
#pxbell{position:fixed;left:8px;top:calc(8px + env(safe-area-inset-top,0px));z-index:98;display:none;padding:7px 12px;border-radius:99px;border:1.5px solid #ffd45a;background:#3a2600;color:#ffd45a;font:800 13px system-ui;cursor:pointer;box-shadow:0 0 14px #ffb34a88}
.pxmy{position:absolute;right:10px;bottom:10px;z-index:5;padding:7px 12px;border-radius:99px;border:1px solid #35d4ff;background:#071a40;color:#9fe3ff;font:700 12.5px system-ui;cursor:pointer}`;
document.head.appendChild(css);
let ov=null;
function close(){if(ov){ov.remove();ov=null}}
function open(html){close();ov=document.createElement('div');ov.className='pxo';ov.innerHTML='<div>'+html+'</div>';document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)close()});return ov}
const copy=(t,b)=>{const ok=()=>{if(b){const o=b.textContent;b.textContent='✓ Đã chép';setTimeout(()=>b.textContent=o,1400)}};
  try{navigator.clipboard.writeText(t).then(ok,()=>{fallback()})}catch(e){fallback()}
  function fallback(){const i=document.createElement('textarea');i.value=t;document.body.appendChild(i);i.select();try{document.execCommand('copy');ok()}catch(e){}i.remove()}};

/* ---------- 1) hộp thanh toán ---------- */
function start(o){
  const b=BK(),id=rid(6),code=CFG.prefix+' '+id,vnd=Math.round(o.vnd||0);
  const x=open(`<h3>THANH TOÁN CHUYỂN KHOẢN</h3><div class="pxit">${esc(o.name)}</div><div class="pxam">${NF(vnd)} VNĐ</div>
   ${o.get?`<div class="pxget">Bạn nhận: ${esc(o.get)}</div>`:''}
   <div class="pxqr"></div><div class="pxsm" style="text-align:center">Quét mã bằng app ngân hàng bất kỳ (VietQR) — số tiền và nội dung đã điền sẵn</div>
   <div class="pxrow"><span>Ngân hàng</span><b>${esc(b.name)}</b></div>
   <div class="pxrow"><span>Số tài khoản</span><b>${esc(b.acc)}</b><button class="pxcp" data-c="${esc(b.acc)}">Sao chép</button></div>
   ${b.holder?`<div class="pxrow"><span>Chủ tài khoản</span><b>${esc(b.holder)}</b></div>`:''}
   <div class="pxrow"><span>Số tiền</span><b>${NF(vnd)} VNĐ</b><button class="pxcp" data-c="${vnd}">Sao chép</button></div>
   <div class="pxrow"><span>Nội dung chuyển khoản</span><b class="cd">${code}</b><button class="pxcp" data-c="${code}">Sao chép</button></div>
   <div class="pxst pxwarn"><b>Cách thanh toán</b><ol><li>Chuyển <b>đúng số tiền</b> và ghi <b>đúng nội dung ${code}</b>.</li><li>Bấm <b>"Tôi đã chuyển khoản"</b> bên dưới.</li><li>Chủ game kiểm tra tiền về và xác nhận — vật phẩm tự vào tài khoản của bạn (khi bạn đang mở game).</li></ol></div>
   <div class="pxbt"><button class="go" data-a="sent">Tôi đã chuyển khoản</button><button data-a="x">Để sau</button></div><div class="pxsm" data-msg style="margin-top:6px"></div>`);
  x.querySelector('.pxqr').appendChild(qrCanvas(vietqr(vnd,code),440));
  x.querySelectorAll('.pxcp').forEach(bt=>bt.onclick=()=>copy(bt.dataset.c,bt));
  x.querySelector('[data-a="x"]').onclick=close;
  x.querySelector('[data-a="sent"]').onclick=async e=>{const bt=e.currentTarget;bt.disabled=true;const msg=x.querySelector('[data-msg]');msg.textContent='Đang gửi đơn…';
    const ord={id,code,src:o.src,spec:o.spec,name:o.name,get:o.get||'',vnd,t:Date.now(),st:'local'};
    if(FB()){let ok=false,tries=0;
      while(!ok&&tries<3){tries++;try{await rq('orders/'+ord.id,{m:'PUT',b:{u:me(),it:String(o.name).slice(0,110),g:String(o.get||'').slice(0,200),vnd,code:ord.code,t:ord.t}});ok=true}
        catch(err){if(err.denied&&tries<3){ord.id=rid(6);ord.code=CFG.prefix+' '+ord.id;continue}break}}
      if(ok)ord.st='sent';else{msg.textContent='Không gửi được đơn lên máy chủ. Kiểm tra mạng rồi bấm lại.';bt.disabled=false;return}}
    P().orders.unshift(ord);P().orders=P().orders.slice(0,60);try{save()}catch(e){}
    if(o.after)AFTER[ord.id]=o.after;
    showSent(ord)};
}
const AFTER={};
function showSent(o){const on=o.st==='sent';
  open(`<h3>ĐÃ GỬI ĐƠN ${esc(o.code)}</h3><div class="pxit">${esc(o.name)} · ${NF(o.vnd)} VNĐ</div>
   <div class="pxst ${on?'pxok':'pxwarn'}">${on?'Đơn đã gửi tới chủ game. Khi chủ game xác nhận đã nhận tiền, vật phẩm sẽ <b>tự động</b> vào tài khoản của bạn — chỉ cần mở game. Bạn có thể xem trạng thái ở "🧾 Đơn của tôi".'
     :'Game chưa kết nối máy chủ xác nhận nên đơn mới chỉ lưu trên máy này. Hãy báo chủ game mã <b>'+esc(o.code)+'</b> để được hỗ trợ.'}</div>
   <div class="pxbt"><button class="go" data-a="my">🧾 Đơn của tôi</button><button data-a="x">Đóng</button></div>`);
  ov.querySelector('[data-a="x"]').onclick=close;ov.querySelector('[data-a="my"]').onclick=my}

/* ---------- 2) đơn của tôi ---------- */
const TG={sent:['Chờ xác nhận','w'],local:['Chưa gửi máy chủ','w'],done:['Đã nhận','k'],no:['Bị từ chối','n']};
function my(){const L=P().orders;
  open(`<h3>🧾 ĐƠN CỦA TÔI</h3><div class="pxsm">Mã người chơi: <b>${esc(me())}</b>${FB()?'':' · <span style="color:#ffd45a">chưa kết nối máy chủ xác nhận</span>'}</div><div data-l></div>
   <div class="pxbt"><button data-a="r">↻ Kiểm tra lại</button><button data-a="x">Đóng</button></div>
   <div class="pxsm" style="margin-top:10px;text-align:right"><a href="#" data-a="adm" style="color:#6f8fd0">Quản lý đơn (dành cho chủ game)</a></div>`);
  ov.dataset.my=1;myRender();
  ov.querySelector('[data-a="x"]').onclick=close;ov.querySelector('[data-a="r"]').onclick=async()=>{await check();myRender()};
  ov.querySelector('[data-a="adm"]').onclick=e=>{e.preventDefault();admin()}}
function myRender(){if(!ov||!ov.dataset.my)return;const el=ov.querySelector('[data-l]');if(!el)return;const L=P().orders;
  el.innerHTML=L.length?L.map(o=>{const t=TG[o.st]||['?',''];return `<div class="pxl"><div><b>${esc(o.code)}</b> · ${esc(o.name)}<small>${NF(o.vnd)} VNĐ · ${new Date(o.t).toLocaleString('vi-VN')}${o.st==='done'&&o.msg?' · '+esc(o.msg):''}</small></div><span class="tg ${t[1]}">${t[0]}</span></div>`}).join(''):'<div class="pxsm" style="padding:10px 0">Bạn chưa có đơn nào.</div>'}

/* ---------- 3) quản lý đơn — dành cho chủ game ---------- */
const AK='se_admin_key';
const akey=()=>{try{return localStorage.getItem(AK)||''}catch(e){return''}};
let AD={tab:'w',list:[],st:{},got:{},busy:false,seen:null,last:0};
async function adPull(){if(!FB())return;
  const o=await rq('orders',{q:'?orderBy=%22t%22&limitToLast=200'});
  const L=Object.keys(o||{}).map(k=>Object.assign({id:k},o[k])).filter(x=>x&&typeof x.t==='number').sort((a,b)=>b.t-a.t);
  const need=L.filter(x=>AD.st[x.id]!==1&&AD.st[x.id]!==-1).slice(0,120);
  for(let i=0;i<need.length;i+=12)await Promise.all(need.slice(i,i+12).map(async x=>{try{const v=await rq('ok/'+x.id+'/v');AD.st[x.id]=v===1?1:v===-1?-1:0}catch(e){}}));
  const gotNeed=L.filter(x=>AD.st[x.id]===1&&!AD.got[x.id]).slice(0,60);
  await Promise.all(gotNeed.map(async x=>{try{const g=await rq('got/'+x.id);if(g)AD.got[x.id]=1}catch(e){}}));
  AD.list=L;AD.last=Date.now();return L}
const pend=()=>AD.list.filter(x=>!AD.st[x.id]);
function admin(){
  open(`<h3>🔔 QUẢN LÝ ĐƠN NẠP</h3><div class="pxsm">Dành cho chủ game. Đối chiếu <b>nội dung chuyển khoản</b> và <b>số tiền</b> trong app Agribank rồi bấm xác nhận.</div>
   <div data-cfg></div><div class="pxtab"><button data-t="w">Chờ xác nhận</button><button data-t="a">Tất cả</button></div><div data-l class="pxsm">Đang tải…</div>
   <div class="pxbt"><button data-a="r">↻ Tải lại</button><button data-a="n">🔔 Bật thông báo</button><button data-a="x">Đóng</button></div>`);
  ov.dataset.adm=1;
  ov.querySelector('[data-a="x"]').onclick=close;ov.querySelector('[data-a="r"]').onclick=()=>adLoad(true);
  ov.querySelector('[data-a="n"]').onclick=async e=>{try{const r=await Notification.requestPermission();e.currentTarget.textContent=r==='granted'?'🔔 Đã bật':'🔕 Trình duyệt chặn'}catch(_){e.currentTarget.textContent='🔕 Không hỗ trợ'}};
  ov.querySelectorAll('.pxtab button').forEach(b=>b.onclick=()=>{AD.tab=b.dataset.t;adRender()});
  adCfg();adLoad(true)}
function adCfg(){const el=ov&&ov.querySelector('[data-cfg]');if(!el)return;
  if(!FB()){el.innerHTML='<div class="pxst pxwarn">Game chưa kết nối máy chủ Firebase nên chưa nhận được đơn. Hãy tạo Firebase theo hướng dẫn rồi điền địa chỉ vào cấu hình game.</div>';return}
  const k=akey();
  el.innerHTML=k?`<div class="pxsm" style="margin:6px 0">Mật khẩu chủ game đã lưu trên máy này · <a href="#" data-a="k" style="color:#6f8fd0">đổi</a></div>`
    :`<div class="pxst"><b>Nhập mật khẩu chủ game</b> (đúng như trong luật Firebase) để xác nhận đơn:<div style="display:flex;gap:6px;margin-top:6px"><input type="password" data-k autocomplete="off"><button class="pxcp" data-a="ks">Lưu</button></div></div>`;
  const s=el.querySelector('[data-a="ks"]');if(s)s.onclick=()=>{const v=el.querySelector('[data-k]').value.trim();if(!v)return;try{localStorage.setItem(AK,v)}catch(e){}adCfg();adLoad(true)};
  const c=el.querySelector('[data-a="k"]');if(c)c.onclick=e=>{e.preventDefault();try{localStorage.removeItem(AK)}catch(_){}adCfg()}}
async function adLoad(force){if(!ov||!ov.dataset.adm||!FB())return;if(!akey()){const l=ov.querySelector('[data-l]');if(l)l.textContent='Nhập mật khẩu chủ game để xem danh sách đơn.';return}try{await adPull()}catch(e){const l=ov&&ov.querySelector('[data-l]');if(l)l.textContent='Không tải được đơn (kiểm tra mạng hoặc luật Firebase).';return}adRender();bell()}
function adRender(){if(!ov||!ov.dataset.adm)return;ov.querySelectorAll('.pxtab button').forEach(b=>b.classList.toggle('on',b.dataset.t===AD.tab));
  const el=ov.querySelector('[data-l]');const L=AD.tab==='w'?pend():AD.list;
  el.innerHTML=L.length?L.map(x=>{const s=AD.st[x.id],t=s===1?(AD.got[x.id]?['Người chơi đã nhận','k']:['Đã xác nhận','k']):s===-1?['Đã từ chối','n']:['Chờ xác nhận','w'];
    return `<div class="pxl"><div><b style="font-family:ui-monospace,Consolas,monospace;color:#ffd45a">${esc(x.code)}</b> · <b>${NF(x.vnd)} VNĐ</b><small>${esc(x.it)}${x.g?' — '+esc(x.g):''}</small><small>Người chơi ${esc(x.u)} · ${new Date(x.t).toLocaleString('vi-VN')}</small></div>`+
      (s?`<span class="tg ${t[1]}">${t[0]}</span>`:`<div class="pxa"><button data-ok="${esc(x.id)}">✓ Đã nhận tiền</button><button class="no" data-no="${esc(x.id)}">✕</button></div>`)+`</div>`}).join('')
    :`<div style="padding:10px 0">${AD.tab==='w'?'Không có đơn nào đang chờ.':'Chưa có đơn nào.'}</div>`;
  el.querySelectorAll('[data-ok],[data-no]').forEach(b=>b.onclick=()=>adSet(b.dataset.ok||b.dataset.no,b.dataset.ok?1:-1,b))}
async function adSet(id,v,b){const k=akey();if(!k){say('Nhập mật khẩu chủ game trước');adCfg();return}
  const x=AD.list.find(o=>o.id===id);if(v===-1&&b.dataset.sure!=='1'){b.dataset.sure='1';b.textContent='Từ chối?';return}
  b.disabled=true;
  try{await rq('ok/'+id,{m:'PUT',b:{v,t:Date.now(),k}});AD.st[id]=v;say(v===1?'Đã xác nhận '+(x?x.code:id):'Đã từ chối '+(x?x.code:id));adRender();bell()}
  catch(e){b.disabled=false;say(e.denied?'Sai mật khẩu chủ game (không khớp luật Firebase)':'Không gửi được, thử lại')}}
/* chuông báo đơn mới trên máy của chủ game */
const bellEl=document.createElement('button');bellEl.id='pxbell';bellEl.onclick=admin;document.body.appendChild(bellEl);
function bell(){const n=pend().length;bellEl.style.display=akey()&&FB()&&n?'block':'none';bellEl.textContent='🔔 '+n+' đơn nạp chờ xác nhận'}
function beep(){try{const A=new (window.AudioContext||window.webkitAudioContext)(),o=A.createOscillator(),g=A.createGain();o.frequency.value=880;g.gain.value=.08;o.connect(g);g.connect(A.destination);o.start();o.frequency.setValueAtTime(1320,A.currentTime+.15);o.stop(A.currentTime+.32)}catch(e){}}
async function adWatch(){if(!akey()||!FB())return;try{await adPull()}catch(e){return}
  const ids=pend().map(x=>x.id);
  if(AD.seen){const fresh=pend().filter(x=>!AD.seen.has(x.id));
    if(fresh.length){const x=fresh[0];beep();say('🔔 Đơn nạp mới '+x.code+' · '+NF(x.vnd)+' VNĐ');
      try{if(document.hidden&&window.Notification&&Notification.permission==='granted')new Notification('Đơn nạp mới · '+x.code,{body:NF(x.vnd)+' VNĐ — '+x.it})}catch(e){}}}
  AD.seen=new Set(ids);bell();adRender()}

/* ---------- 4) nối vào các nơi trả tiền thật trong game ---------- */
const PRICE=s=>+String(s).replace(/[^\d]/g,'')||0;
function nap(k,i){const c=(typeof NAP!=='undefined'&&NAP[k]||[])[i];if(!c)return;
  const unit=/Sao/.test(c[2]||c[1])?'sao':'da',base=PRICE(c[2]||c[1]),bonus=PRICE(c[0]),tot=Math.round(base*(1+bonus/100));
  start({src:'g',spec:{g:{[unit]:tot}},name:(c[2]?c[1]:'Nạp '+c[1]),vnd:PRICE(c[3]),get:NF(tot)+' '+(unit==='sao'?'Sao':'Đá')+(bonus?' ('+NF(base)+' + thưởng '+bonus+'%)':'')})}
function promo(btn){const c=btn.closest('.pc');if(!c)return;const g={};let bad=false;
  const take=(t)=>{const m=String(t).match(/^(Đá|Sao)\s*x\s*([\d.,]+)/);if(!m){bad=true;return}const k=m[1]==='Đá'?'da':'sao';g[k]=(g[k]||0)+PRICE(m[2])};
  const h=(c.querySelector('h4')||{}).textContent||'',b=c.querySelector('.pa b'),lis=[...c.querySelectorAll('ul li')].map(x=>x.textContent.trim()).filter(Boolean);
  if(b&&!lis.length)take(h.trim()+' '+b.textContent.trim());else if(lis.length)lis.forEach(take);else bad=true;
  if(bad||!Object.keys(g).length){say('Gói này chưa mở bán');return}
  start({src:'g',spec:{g},name:h,vnd:PRICE(btn.textContent),get:Object.keys(g).map(k=>NF(g[k])+' '+(k==='sao'?'Sao':'Đá')).join(' + ')})}
if(typeof evPay==='function')evPay=function(o,done,x){start({src:'ev',spec:{id:o.id,ship:x&&x.ship||null},name:o.n,vnd:o.p,get:x&&x.ship?'Mở khóa tàu '+((KSH.find(k=>k.id===x.ship)||{}).n||''):''})};
/* nút "Đơn của tôi" ở Shop khuyến mãi và màn Nạp */
['psh','nap'].forEach(id=>{const s=document.getElementById(id);if(!s)return;const b=document.createElement('button');b.className='pxmy';b.textContent='🧾 Đơn của tôi';b.onclick=my;
  if(getComputedStyle(s).position==='static')s.style.position='relative';s.appendChild(b)});
window.PAYX={start,nap,promo,my,admin,check,vietqr,crc16,cfg:CFG,_ad:AD,_watch:adWatch};
/* kiểm tra định kỳ: người chơi nhận vật phẩm, chủ game nhận chuông báo */
setTimeout(()=>{check();adWatch()},2500);
setInterval(()=>{if(P().orders.some(o=>o.st==='sent'))check()},20000);
setInterval(()=>{if(ov&&ov.dataset.adm)adLoad();else adWatch()},20000);
setInterval(()=>{if(ov&&ov.dataset.my)check()},8000);
})();
