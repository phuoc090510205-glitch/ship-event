
/* ---------- cấu hình thanh toán (chỉ sửa ở đây) ---------- */
window.SE_CFG=window.SE_CFG||{};
(function(C){
  if(C.fb==null)C.fb='';                 /* để trống: không dùng máy chủ */
  C.bank=C.bank||{name:'Agribank',full:'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',bin:'970405',acc:'2000236003939',holder:''};
  C.zalo=C.zalo||'0905110205';            /* Zalo chủ game nhận mã đơn */
  C.prefix=C.prefix||'SE';               /* tiền tố nội dung chuyển khoản */
  C.pub=C.pub||{x:'kMyXxNpT5lDXqJGPZs5s5C4f7tLPQ22k3INYDJ7lwP8',y:'lKt9cZK-bvEY_A5-7excb2f7qizNqqOR5tDNTDIMvlA'}; /* khoá công khai kiểm tra mã nhận quà */
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
const zaloUrl=()=>'https://zalo.me/'+String(CFG.zalo).replace(/\D/g,'');

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

/* ---------- mã đơn & mã nhận quà (chữ ký ECDSA P-256, không cần máy chủ) ---------- */
const enc=new TextEncoder(),dec=new TextDecoder();
const b64u=bytes=>{let s='';new Uint8Array(bytes).forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const ub64u=t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const s=atob(t),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a};
const canon=v=>Array.isArray(v)?'['+v.map(canon).join(',')+']':(v&&typeof v==='object')?'{'+Object.keys(v).sort().filter(k=>v[k]!==undefined).map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}':JSON.stringify(v);
const msgOf=o=>'SE1|'+o.id+'|'+Math.round(o.vnd)+'|'+canon({src:o.src,spec:o.spec});
const SUB=()=>window.crypto&&crypto.subtle;
let PUBK=null;
async function pubKey(){if(PUBK)return PUBK;PUBK=await SUB().importKey('jwk',{kty:'EC',crv:'P-256',x:CFG.pub.x,y:CFG.pub.y,ext:true},{name:'ECDSA',namedCurve:'P-256'},false,['verify']);return PUBK}
async function verify(o,sig){try{return await SUB().verify({name:'ECDSA',hash:'SHA-256'},await pubKey(),sig,enc.encode(msgOf(o)))}catch(e){return false}}
/* mã đơn gửi qua Zalo: SEO1.<base64url(JSON)> */
const orderToken=o=>'SEO1.'+b64u(enc.encode(JSON.stringify({id:o.id,src:o.src,spec:o.spec,vnd:Math.round(o.vnd),name:o.name,get:o.get||'',key:o.key||null,u:me(),t:o.t})));
function parseOrder(text){const m=String(text).replace(/\s+/g,'').match(/SEO1\.([A-Za-z0-9_-]+)/);if(!m)return null;try{const o=JSON.parse(dec.decode(ub64u(m[1])));return o&&o.id&&o.src?o:null}catch(e){return null}}
const zaloMsg=o=>'ĐƠN NẠP '+o.code+'\nGói: '+o.name+'\nSố tiền: '+NF(o.vnd)+' VNĐ\n'+(o.get?'Nhận: '+o.get+'\n':'')+'Mã đơn (dán vào Quản lý đơn): '+orderToken(o);
/* mã nhận quà: SEQ1-<mã đơn>-<chữ ký> */
function parseGift(text){const m=String(text).replace(/\s+/g,'').match(/SEQ1-([A-Z0-9]{4,12})-([A-Za-z0-9_-]{60,120})/);return m?{id:m[1],sig:m[2]}:null}

/* ---------- trao vật phẩm ---------- */
const AFTER={};
function credit(o){let msg='';
  try{
    if(o.src==='psh'){const t=window.PSHG?PSHG(o.spec):[];msg=t.join(', ')}
    else if(o.src==='g'){msg=rwGive(o.spec.g)}
    else if(o.src==='ev'){const ev=(typeof EVO!=='undefined'?EVO:[]).find(x=>x.id===o.spec.id);
      if(ev){if(o.spec.ship){S.unl=S.unl||{};S.unl[o.spec.ship]=true;const k=KSH.find(x=>x.id===o.spec.ship);msg='mở khóa tàu '+(k?k.n:'');try{evFinish(ev,msg)}catch(e){const E=evS();E.buy[ev.id]=1}}
        else{msg=evGive(ev)||'';try{evFinish(ev,msg)}catch(e){const E=evS();E.buy[ev.id]=1}}}}
  }catch(e){console.error(e)}
  o.st='done';o.got=Date.now();o.msg=msg;try{save()}catch(e){}try{refresh()}catch(e){}
  const af=AFTER[o.id];if(af)try{af()}catch(e){}
  return msg}
async function redeem(text){const g=parseGift(text);if(!g)return [0,'Mã nhận quà không đúng dạng. Hãy dán nguyên mã chủ game gửi (bắt đầu bằng SEQ1-).'];
  const o=P().orders.find(x=>x.id===g.id);
  if(!o)return [0,'Máy này không có đơn '+CFG.prefix+' '+g.id+'. Mã nhận quà chỉ dùng được trên đúng máy đã đặt đơn.'];
  if(o.st==='done')return [0,'Đơn '+o.code+' đã nhận quà rồi.'];
  if(!SUB())return [0,'Trình duyệt này không hỗ trợ kiểm tra mã. Hãy mở game bằng trình duyệt khác (Chrome, Safari).'];
  let sig;try{sig=ub64u(g.sig)}catch(e){return [0,'Mã nhận quà bị lỗi, hãy chép lại.']}
  if(!(await verify(o,sig)))return [0,'Mã nhận quà không hợp lệ cho đơn '+o.code+'.'];
  const msg=credit(o);return [1,'✅ Đã nhận quà đơn '+o.code+(msg?' · '+msg:'')]}

/* ---------- giao diện ---------- */
const css=document.createElement('style');
css.textContent=`.pxo{position:fixed;inset:0;z-index:97;background:#000c;display:flex;align-items:center;justify-content:center;padding:8px;font:14px system-ui,sans-serif;color:#fff}
.pxo>div{width:min(460px,96vw);max-height:96vh;overflow:auto;background:linear-gradient(#0b1840,#060f2e);border:1.5px solid #2b5ac9;border-radius:14px;padding:14px;box-shadow:0 0 30px #1b4fe066}
.pxo h3{margin:0 0 4px;font-size:17px;color:#bfe3ff;letter-spacing:.04em}.pxo .pxit{font-weight:700;color:#fff}.pxo .pxsm{font-size:12px;color:#8fa6d8;line-height:1.45}
.pxo .pxam{font-size:24px;font-weight:900;color:#ffd45a;margin:6px 0}.pxo .pxget{font-size:12.5px;color:#9fe8c0;margin-bottom:8px;line-height:1.4}
.pxo .pxqr{display:flex;justify-content:center;margin:8px 0}.pxo .pxqr canvas{width:min(220px,62vw);height:auto;border-radius:8px;border:4px solid #fff;background:#fff}
.pxo .pxrow{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:7px 0;border-top:1px solid #1c3a80}.pxo .pxrow span{color:#9fb6e6;font-size:12.5px}.pxo .pxrow b{font-size:15px;text-align:right;word-break:break-all}
.pxo .pxrow b.cd{font:800 18px ui-monospace,Consolas,monospace;color:#ffd45a;letter-spacing:.06em}
.pxo .pxcp{padding:5px 10px;border-radius:7px;border:1px solid #3aa0ff;background:#0f3a8f;color:#fff;font-size:12px;cursor:pointer;flex:none}
.pxo .pxst{margin:10px 0 4px;padding:9px 10px;border-radius:9px;background:#0a1a4a;border:1px solid #1c3a80;font-size:12.5px;line-height:1.5}
.pxo .pxst ol{margin:4px 0 0 18px;padding:0}.pxo .pxwarn{background:#2a2410;border-color:#6b5a1c;color:#ffe08a}.pxo .pxok{background:#0d2a1c;border-color:#2f7a52;color:#9fffc8}.pxo .pxbad{background:#2a1016;border-color:#7a2f3c;color:#ffb3bf}
.pxo .pxbt{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}.pxo .pxbt button,.pxo .pxbt a{flex:1;min-width:120px;padding:11px 10px;border-radius:10px;border:1px solid #4a5a86;background:#14275a;color:#fff;font-weight:800;font-size:14px;cursor:pointer;text-align:center;text-decoration:none;box-sizing:border-box}
.pxo .pxbt .go{background:linear-gradient(#ffd45a,#e79a12);color:#3a2600;border-color:#ffd45a}.pxo .pxbt .zl{background:#0068ff;border-color:#4d9bff}.pxo .pxbt button:disabled{opacity:.5}
.pxo .pxl{border-top:1px solid #1c3a80;padding:8px 0;font-size:13px;display:flex;gap:8px;justify-content:space-between;align-items:center}.pxo .pxl small{display:block;color:#8fa6d8;font-size:11.5px}
.pxo .tg{display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:99px;border:1px solid #4a5a86;color:#cfd8ee;white-space:nowrap}
.pxo .tg.w{border-color:#c9a23a;color:#ffd45a}.pxo .tg.k{border-color:#3fd08a;color:#7dffb4}
.pxo textarea{width:100%;box-sizing:border-box;background:#06122e;border:1px solid #2a4a95;border-radius:9px;color:#fff;padding:9px 10px;font:13px ui-monospace,Consolas,monospace;min-height:64px;resize:vertical}
.pxo .pxbox{word-break:break-all;font:12px ui-monospace,Consolas,monospace;background:#06122e;border:1px solid #2a4a95;border-radius:9px;padding:8px;color:#cfe4ff;max-height:110px;overflow:auto;user-select:all;-webkit-user-select:all}
.pxmy{position:absolute;right:10px;bottom:10px;z-index:5;padding:7px 12px;border-radius:99px;border:1px solid #35d4ff;background:#071a40;color:#9fe3ff;font:700 12.5px system-ui;cursor:pointer}`;
document.head.appendChild(css);
let ov=null;
function close(){if(ov){ov.remove();ov=null}}
function open(html,kind){close();ov=document.createElement('div');ov.className='pxo';if(kind)ov.dataset[kind]=1;ov.innerHTML='<div>'+html+'</div>';document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  ov.querySelectorAll('[data-a="x"]').forEach(b=>b.onclick=close);return ov}
function copy(t,b){const ok=()=>{if(b){const o=b.textContent;b.textContent='✓ Đã chép';setTimeout(()=>b.textContent=o,1400)}};
  const fb=()=>{const i=document.createElement('textarea');i.value=t;i.style.cssText='position:fixed;opacity:0';document.body.appendChild(i);i.select();let r=false;try{r=document.execCommand('copy')}catch(e){}i.remove();if(r)ok();else if(b)b.textContent='Hãy giữ ngón tay để chép'};
  try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}}
async function pasteInto(ta){try{const t=await navigator.clipboard.readText();if(t)ta.value=t}catch(e){say('Hãy giữ ngón tay vào ô rồi chọn Dán')}}

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
   <div class="pxst pxwarn"><b>Cách nhận vật phẩm</b><ol><li>Chuyển <b>đúng số tiền</b>, ghi <b>đúng nội dung ${code}</b>.</li><li>Bấm <b>"Đã chuyển — gửi mã đơn qua Zalo"</b>: game chép sẵn mã đơn và mở Zalo ${esc(CFG.zalo)}, bạn <b>dán</b> vào tin nhắn rồi gửi.</li><li>Chủ game kiểm tra tiền về và gửi lại <b>mã nhận quà</b>. Vào <b>🧾 Đơn của tôi</b>, dán mã đó để nhận vật phẩm.</li></ol></div>
   <div class="pxbt"><button class="go" data-a="sent">Đã chuyển — gửi mã đơn qua Zalo</button><button data-a="x">Để sau</button></div>`);
  x.querySelector('.pxqr').appendChild(qrCanvas(vietqr(vnd,code),440));
  x.querySelectorAll('.pxcp').forEach(bt=>bt.onclick=()=>copy(bt.dataset.c,bt));
  x.querySelector('[data-a="sent"]').onclick=()=>{
    const ord={id,code,src:o.src,spec:o.spec,key:o.key||null,name:o.name,get:o.get||'',vnd,t:Date.now(),st:'wait'};
    P().orders.unshift(ord);P().orders=P().orders.slice(0,60);try{save()}catch(e){}
    if(o.after)AFTER[ord.id]=o.after;
    copy(zaloMsg(ord));sent(ord,true)};
}
function sent(o,auto){
  const m=zaloMsg(o);
  const x=open(`<h3>GỬI MÃ ĐƠN ${esc(o.code)}</h3><div class="pxit">${esc(o.name)} · ${NF(o.vnd)} VNĐ</div>
   <div class="pxst pxok">${auto?'Đã chép mã đơn. ':''}Mở Zalo <b>${esc(CFG.zalo)}</b>, <b>dán</b> tin nhắn bên dưới và gửi cho chủ game. Khi nhận được <b>mã nhận quà</b>, vào <b>🧾 Đơn của tôi</b> để dán mã.</div>
   <div class="pxbox">${esc(m).replace(/\n/g,'<br>')}</div>
   <div class="pxbt"><button data-a="cp">📋 Chép tin nhắn</button><a class="zl" href="${zaloUrl()}" target="_blank" rel="noopener">💬 Mở Zalo ${esc(CFG.zalo)}</a></div>
   <div class="pxbt"><button class="go" data-a="my">🧾 Đơn của tôi</button><button data-a="x">Đóng</button></div>`);
  x.querySelector('[data-a="cp"]').onclick=e=>copy(m,e.currentTarget);
  x.querySelector('[data-a="my"]').onclick=my;
  if(auto)try{window.open(zaloUrl(),'_blank','noopener')}catch(e){}}

/* ---------- 2) đơn của tôi + nhập mã nhận quà ---------- */
function my(){
  const x=open(`<h3>🧾 ĐƠN CỦA TÔI</h3>
   <div class="pxst"><b>Nhập mã nhận quà</b> chủ game gửi qua Zalo:<textarea data-g placeholder="SEQ1-…"></textarea>
     <div class="pxbt" style="margin-top:6px"><button data-a="pg">📋 Dán</button><button class="go" data-a="rd">🎁 Nhận quà</button></div><div class="pxsm" data-m></div></div>
   <div data-l></div>
   <div class="pxbt"><button data-a="x">Đóng</button></div>
   <div class="pxsm" style="margin-top:10px;text-align:right"><a href="#" data-a="adm" style="color:#6f8fd0">Quản lý đơn (dành cho chủ game)</a></div>`,'my');
  const ta=x.querySelector('[data-g]'),mm=x.querySelector('[data-m]');
  x.querySelector('[data-a="pg"]').onclick=()=>pasteInto(ta);
  x.querySelector('[data-a="rd"]').onclick=async e=>{const b=e.currentTarget;b.disabled=true;mm.textContent='Đang kiểm tra…';const r=await redeem(ta.value);b.disabled=false;mm.textContent=r[1];mm.style.color=r[0]?'#7dffb4':'#ffb3bf';if(r[0]){ta.value='';say(r[1])}myRender()};
  x.querySelector('[data-a="adm"]').onclick=e=>{e.preventDefault();admin()};
  myRender()}
const TG={wait:['Chờ mã nhận quà','w'],done:['Đã nhận','k']};
function myRender(){if(!ov||!ov.dataset.my)return;const el=ov.querySelector('[data-l]');if(!el)return;const L=P().orders;
  el.innerHTML=L.length?L.map(o=>{const t=TG[o.st]||TG.wait;return `<div class="pxl"><div><b>${esc(o.code)}</b> · ${esc(o.name)}<small>${NF(o.vnd)} VNĐ · ${new Date(o.t).toLocaleString('vi-VN')}${o.st==='done'&&o.msg?' · '+esc(o.msg):''}</small></div>`+
    (o.st==='done'?`<span class="tg k">${t[0]}</span>`:`<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end"><span class="tg w">${t[0]}</span><button class="pxcp" data-z="${esc(o.id)}">Gửi lại Zalo</button></div>`)+`</div>`}).join(''):'<div class="pxsm" style="padding:10px 0">Bạn chưa có đơn nào.</div>';
  el.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{const o=P().orders.find(x=>x.id===b.dataset.z);if(o)sent(o,false)})}

/* ---------- 3) quản lý đơn — dành cho chủ game ---------- */
const AK='se_owner_key',LOG='se_owner_log';
const lsg=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}},lss=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}};
const logs=()=>{try{return JSON.parse(lsg(LOG)||'[]')}catch(e){return[]}};
let PRIV=null;
async function privKey(){const t=lsg(AK).trim();const m=t.match(/^SEK1\.([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})$/);if(!m)return null;
  if(m[2]!==CFG.pub.x||m[3]!==CFG.pub.y)return null;
  if(PRIV&&PRIV.t===t)return PRIV.k;const k=await SUB().importKey('jwk',{kty:'EC',crv:'P-256',d:m[1],x:m[2],y:m[3],ext:true},{name:'ECDSA',namedCurve:'P-256'},false,['sign']);PRIV={t,k};return k}
/* đối chiếu gói với bảng giá trên máy chủ game */
const PRICE=s=>+String(s).replace(/[^\d]/g,'')||0;
function official(o){try{
  const k=o.key||{};
  if(k.t==='nap'){const c=(NAP[k.k]||[])[k.i];if(!c)return null;const p=napPack(k.k,k.i);return {name:p.name,vnd:p.vnd,spec:p.spec}}
  if(k.t==='promo'){const p=PROMO[k.i];return p?{name:p.name,vnd:p.vnd,spec:p.spec}:null}
  if(k.t==='psh'&&window.PSHT){const L0=typeof PSHT[k.tab]==='function'?PSHT[k.tab]():PSHT[k.tab];const p=(L0||[]).find(x=>x[0]===o.name);return p?{name:p[0],vnd:p[1],spec:p[4]}:null}
  if(o.src==='ev'&&typeof EVO!=='undefined'){const e=EVO.find(x=>x.id===o.spec.id);return e?{name:e.n,vnd:e.p,spec:o.spec}:null}
  }catch(e){}return null}
function admin(){
  const x=open(`<h3>🔑 QUẢN LÝ ĐƠN NẠP</h3><div class="pxsm">Dành cho chủ game. Người chơi gửi tin nhắn đơn qua Zalo → bạn kiểm tra tiền về trong app Agribank → dán tin nhắn vào đây → tạo mã nhận quà gửi lại cho họ.</div>
   <div data-k></div><div data-w></div><div data-h></div><div class="pxbt"><button data-a="x">Đóng</button></div>`,'adm');
  adRender()}
async function adRender(){if(!ov||!ov.dataset.adm)return;const kEl=ov.querySelector('[data-k]'),wEl=ov.querySelector('[data-w]'),hEl=ov.querySelector('[data-h]');
  if(!SUB()){kEl.innerHTML='<div class="pxst pxbad">Trình duyệt này không hỗ trợ tạo mã. Hãy dùng Chrome hoặc Safari bản mới.</div>';return}
  const k=await privKey();
  if(!k){kEl.innerHTML=`<div class="pxst pxwarn"><b>Nhập khoá chủ game</b> (chuỗi bắt đầu bằng SEK1., trong tệp KHOA-CHU-GAME.txt). Chỉ cần nhập một lần trên máy này.<textarea data-kv placeholder="SEK1.…"></textarea><div class="pxbt" style="margin-top:6px"><button data-a="kp">📋 Dán</button><button class="go" data-a="ks">Lưu khoá</button></div><div class="pxsm" data-km></div></div>`;
    wEl.innerHTML='';hEl.innerHTML='';
    const ta=kEl.querySelector('[data-kv]');kEl.querySelector('[data-a="kp"]').onclick=()=>pasteInto(ta);
    kEl.querySelector('[data-a="ks"]').onclick=async()=>{const v=ta.value.replace(/\s+/g,'');const old=lsg(AK);lss(AK,v);PRIV=null;if(await privKey().catch(()=>null)){adRender()}else{if(old)lss(AK,old);else try{localStorage.removeItem(AK)}catch(e){}kEl.querySelector('[data-km]').textContent='Khoá không đúng. Hãy chép lại nguyên dòng trong tệp KHOA-CHU-GAME.txt.'}};
    return}
  kEl.innerHTML=`<div class="pxsm" style="margin:8px 0">✓ Đã có khoá chủ game trên máy này · <a href="#" data-a="kd" style="color:#6f8fd0">gỡ khoá</a></div>`;
  kEl.querySelector('[data-a="kd"]').onclick=e=>{e.preventDefault();if(e.currentTarget.dataset.s!=='1'){e.currentTarget.dataset.s='1';e.currentTarget.textContent='bấm lần nữa để gỡ';return}try{localStorage.removeItem(AK)}catch(_){}PRIV=null;adRender()};
  wEl.innerHTML=`<div class="pxst"><b>Dán tin nhắn đơn</b> người chơi gửi qua Zalo:<textarea data-o placeholder="ĐƠN NẠP SE …  Mã đơn: SEO1.…"></textarea><div class="pxbt" style="margin-top:6px"><button data-a="op">📋 Dán</button><button class="go" data-a="oc">Xem đơn</button></div></div><div data-od></div>`;
  const ta=wEl.querySelector('[data-o]'),od=wEl.querySelector('[data-od]');
  wEl.querySelector('[data-a="op"]').onclick=async()=>{await pasteInto(ta);show()};
  wEl.querySelector('[data-a="oc"]').onclick=show;
  function show(){const o=parseOrder(ta.value);if(!o){od.innerHTML='<div class="pxst pxbad">Không đọc được mã đơn. Hãy dán nguyên tin nhắn có dòng "Mã đơn: SEO1.…".</div>';return}
    const off=official(o),done=logs().find(l=>l.id===o.id);
    const priceOk=off&&Math.round(off.vnd)===Math.round(o.vnd),specOk=off&&canon(off.spec)===canon(o.spec);
    const chk=!off?'<div class="pxst pxwarn">⚠ Không đối chiếu được với bảng giá hiện tại. Hãy kiểm tra kỹ gói và số tiền.</div>'
      :(priceOk&&specOk)?'<div class="pxst pxok">✓ Gói và giá khớp bảng giá của game.</div>'
      :'<div class="pxst pxbad">⚠ Đơn KHÔNG khớp bảng giá: '+(!priceOk?'giá đúng là '+NF(off.vnd)+' VNĐ. ':'')+(!specOk?'nội dung gói bị sửa. ':'')+'Không nên duyệt.</div>';
    od.innerHTML=`<div class="pxrow"><span>Nội dung chuyển khoản cần thấy</span><b class="cd">${esc(CFG.prefix+' '+o.id)}</b></div>
      <div class="pxrow"><span>Số tiền cần nhận</span><b>${NF(o.vnd)} VNĐ</b></div><div class="pxrow"><span>Gói</span><b>${esc(o.name)}</b></div>
      ${o.get?`<div class="pxrow"><span>Người chơi nhận</span><b style="font-size:13px">${esc(o.get)}</b></div>`:''}<div class="pxrow"><span>Người chơi · lúc đặt</span><b style="font-size:13px">${esc(o.u||'?')} · ${o.t?new Date(o.t).toLocaleString('vi-VN'):'?'}</b></div>${chk}
      ${done?'<div class="pxst pxok">Đơn này đã được duyệt lúc '+new Date(done.t).toLocaleString('vi-VN')+'. Mã nhận quà cũ ở dưới.</div>':''}
      <div class="pxbt"><button class="go" data-a="ok">${done?'Hiện lại mã nhận quà':'✓ Đã nhận đủ tiền — tạo mã nhận quà'}</button></div><div data-gc></div>`;
    od.querySelector('[data-a="ok"]').onclick=async e=>{const b=e.currentTarget;b.disabled=true;let code=done&&done.code;
      if(!code){try{const sig=await SUB().sign({name:'ECDSA',hash:'SHA-256'},await privKey(),enc.encode(msgOf(o)));code='SEQ1-'+o.id+'-'+b64u(sig)}catch(err){b.disabled=false;od.querySelector('[data-gc]').innerHTML='<div class="pxst pxbad">Không tạo được mã.</div>';return}
        const L=logs();L.unshift({id:o.id,name:o.name,vnd:o.vnd,u:o.u,code,t:Date.now()});lss(LOG,JSON.stringify(L.slice(0,300)))}
      const gc=od.querySelector('[data-gc]');gc.innerHTML=`<div class="pxst pxok"><b>Mã nhận quà</b> — chép và gửi lại cho người chơi qua Zalo:<div class="pxbox" style="margin-top:6px">${esc(code)}</div><div class="pxbt" style="margin-top:6px"><button data-a="gcp">📋 Chép mã nhận quà</button></div></div>`;
      gc.querySelector('[data-a="gcp"]').onclick=ev=>copy(code,ev.currentTarget);copy(code);hist()}}
  function hist(){const L=logs();hEl.innerHTML=L.length?'<div class="pxsm" style="margin-top:12px"><b>Đơn đã duyệt trên máy này</b></div>'+L.slice(0,30).map(l=>`<div class="pxl"><div><b style="font-family:ui-monospace,Consolas,monospace;color:#ffd45a">${esc(CFG.prefix+' '+l.id)}</b> · ${NF(l.vnd)} VNĐ<small>${esc(l.name)} · ${new Date(l.t).toLocaleString('vi-VN')}</small></div><button class="pxcp" data-cc="${esc(l.code)}">Chép mã</button></div>`).join(''):'';
    hEl.querySelectorAll('[data-cc]').forEach(b=>b.onclick=()=>copy(b.dataset.cc,b))}
  hist()}

/* ---------- 4) nối vào các nơi trả tiền thật trong game ---------- */
function napPack(k,i){const c=(typeof NAP!=='undefined'&&NAP[k]||[])[i];if(!c)return null;
  const unit=/Sao/.test(c[2]||c[1])?'sao':'da',base=PRICE(c[2]||c[1]),bonus=PRICE(c[0]),tot=Math.round(base*(1+bonus/100));
  return {name:(c[2]?c[1]:'Nạp '+c[1]),vnd:PRICE(c[3]),spec:{g:{[unit]:tot}},get:NF(tot)+' '+(unit==='sao'?'Sao':'Đá')+(bonus?' ('+NF(base)+' + thưởng '+bonus+'%)':'')}}
function nap(k,i){const p=napPack(k,i);if(!p)return;start({src:'g',key:{t:'nap',k,i},spec:p.spec,name:p.name,vnd:p.vnd,get:p.get})}
/* 5 gói Đá/Sao ở tab Khuyến mãi (đọc từ thẻ tĩnh lúc tải game) */
const PROMO=[];
(function(){const g=document.querySelector('#psh .pgrid');if(!g)return;[...g.querySelectorAll('.pc')].forEach((c,i)=>{const sp={};let bad=false;
  const take=t=>{const m=String(t).match(/^(Đá|Sao)\s*x\s*([\d.,]+)/);if(!m){bad=true;return}const k=m[1]==='Đá'?'da':'sao';sp[k]=(sp[k]||0)+PRICE(m[2])};
  const h=((c.querySelector('h4')||{}).textContent||'').trim(),b=c.querySelector('.pa b'),lis=[...c.querySelectorAll('ul li')].map(x=>x.textContent.trim()).filter(Boolean);
  if(b&&!lis.length)take(h+' '+b.textContent.trim());else if(lis.length)lis.forEach(take);else bad=true;
  PROMO[i]=bad||!Object.keys(sp).length?null:{name:h,vnd:PRICE((c.querySelector('.pb')||{}).textContent),spec:{g:sp},get:Object.keys(sp).map(k=>NF(sp[k])+' '+(k==='sao'?'Sao':'Đá')).join(' + ')}})})();
function promo(btn){const c=btn.closest('.pc'),i=[...btn.closest('.pgrid').querySelectorAll('.pc')].indexOf(c),p=PROMO[i];
  if(!p||(c.querySelector('h4')||{}).textContent.trim()!==p.name){say('Gói này chưa mở bán');return}
  start({src:'g',key:{t:'promo',i},spec:p.spec,name:p.name,vnd:p.vnd,get:p.get})}
function psh(tab,p,after){start({src:'psh',key:{t:'psh',tab},name:p[0],vnd:p[1],spec:p[4],get:window.PSHL?PSHL(p[4]).join(' · '):'',after})}
if(typeof evPay==='function')evPay=function(o,done,x){start({src:'ev',spec:{id:o.id,ship:x&&x.ship||null},name:o.n,vnd:o.p,get:x&&x.ship?'Mở khóa tàu '+((KSH.find(k=>k.id===x.ship)||{}).n||''):''})};
/* nút "Đơn của tôi" ở Shop khuyến mãi và màn Nạp */
['psh','nap'].forEach(id=>{const s=document.getElementById(id);if(!s)return;const b=document.createElement('button');b.className='pxmy';b.textContent='🧾 Đơn của tôi · nhập mã quà';b.onclick=my;
  if(getComputedStyle(s).position==='static')s.style.position='relative';s.appendChild(b)});
window.PAYX={start,nap,promo,psh,my,admin,redeem,parseOrder,parseGift,orderToken,zaloMsg,vietqr,crc16,cfg:CFG,msgOf};
})();
