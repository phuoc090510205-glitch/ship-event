/* ===== c60: tài khoản chủ game (admin) — vô hạn tài nguyên =====
   Chỉ tài khoản đăng nhập có chữ ký hợp lệ của khoá chủ game (ECDSA P-256, khoá công khai trong PAYX.cfg.pub) mới được vô hạn.
   Chữ ký chỉ tạo được trên máy đã nhập khoá chủ game (KHOA-CHU-GAME.txt); khoá bí mật không nằm trong mã game. */
(function(){
const MAXV=999999999,MSG=a=>'SE-ADMIN|v1|'+a;
const acc=()=>{try{return localStorage.getItem('hdvt_acc')||''}catch(e){return''}};
const sub=()=>window.crypto&&crypto.subtle;
const b64u=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const ub64=t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const s=atob(t),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
const pub=()=>window.PAYX&&PAYX.cfg&&PAYX.cfg.pub;
let ADM=false,busy=false,PK=null;
async function pubKey(){const p=pub();if(!p||!sub())return null;if(PK&&PK.x===p.x)return PK.k;const k=await sub().importKey('jwk',{kty:'EC',crv:'P-256',x:p.x,y:p.y,ext:true},{name:'ECDSA',namedCurve:'P-256'},false,['verify']);PK={x:p.x,k};return k}
async function verify(a,sig){try{const k=await pubKey();if(!k||!sig)return false;return await sub().verify({name:'ECDSA',hash:'SHA-256'},k,ub64(sig),new TextEncoder().encode(MSG(a)))}catch(e){return false}}
async function signWithOwner(a){try{const t=(localStorage.getItem('se_owner_key')||'').trim(),p=pub();const m=t.match(/^SEK1\.([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})$/);if(!m||!p||m[2]!==p.x||m[3]!==p.y||!sub())return null;
  const k=await sub().importKey('jwk',{kty:'EC',crv:'P-256',d:m[1],x:m[2],y:m[3],ext:true},{name:'ECDSA',namedCurve:'P-256'},false,['sign']);const sig=b64u(await sub().sign({name:'ECDSA',hash:'SHA-256'},k,new TextEncoder().encode(MSG(a))));return (await verify(a,sig))?sig:null}catch(e){return null}}
function topUp(){if(!ADM)return;let ch=0;if(S.da<MAXV){S.da=MAXV;_tk.d=MAXV;ch=1}if(S.sao<MAXV){S.sao=MAXV;_tk.s=MAXV;ch=1}
  try{const I=invG();Object.keys(MATS).forEach(k=>{if((I[k]||0)<99999){I[k]=99999;ch=1}})}catch(e){}if(ch){try{save()}catch(e){}}}
function badge(){const d=document.getElementById('da');if(!d)return;let b=document.getElementById('c60b');
  if(!ADM){if(b)b.remove();return}
  if(!b){b=document.createElement('span');b.id='c60b';b.title='Tài khoản chủ game · vô hạn tài nguyên';b.style.cssText='display:inline-flex;align-items:center;gap:4px;margin-left:6px;padding:2px 8px;border-radius:999px;background:linear-gradient(90deg,#ffd02a,#ff9a2a);color:#3a2000;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap';b.textContent='👑 Chủ game · ∞';b.onclick=menu;const c=d.closest('.chip')||d.parentNode;c.parentNode.insertBefore(b,c)}
  d.textContent='∞';const s=document.getElementById('sao');if(s)s.textContent='∞'}
function menu(){const old=document.getElementById('c60m');if(old){old.remove();return}const m=document.createElement('div');m.id='c60m';m.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999;background:#0e1838;border:1px solid #ffd02a;border-radius:14px;padding:16px;color:#fff;max-width:320px;font:14px system-ui;box-shadow:0 10px 40px #000a';
  m.innerHTML='<b style="color:#ffd02a">👑 Tài khoản chủ game</b><div style="margin:8px 0;opacity:.85">Tài khoản <b>'+String(acc()).replace(/[<>&"]/g,'')+'</b> đang được vô hạn Đá, Sao và vật liệu. Các tài khoản khác chơi bình thường.</div><div style="display:flex;gap:8px;justify-content:flex-end"><button data-a="off" style="padding:6px 10px;border-radius:8px;border:0;background:#3a4670;color:#fff">Tắt cho tài khoản này</button><button data-a="x" style="padding:6px 10px;border-radius:8px;border:0;background:#ffd02a;color:#3a2000;font-weight:700">Đóng</button></div>';
  m.querySelector('[data-a="x"]').onclick=()=>m.remove();m.querySelector('[data-a="off"]').onclick=()=>{off();m.remove()};document.body.appendChild(m)}
function off(){S.admOff=1;delete S.admSig;ADM=false;if(S.admBak){S.da=S.admBak.da;S.sao=S.admBak.sao;_tk.d=S.da;_tk.s=S.sao;try{if(S.admBak.inv)S.inv=S.admBak.inv}catch(e){}delete S.admBak}try{save()}catch(e){}try{refresh()}catch(e){}badge()}
async function check(){if(busy)return;busy=true;try{const a=acc();let ok=false;
  if(a&&S.admSig&&S.admAcc===a)ok=await verify(a,S.admSig);
  let oa='';try{oa=localStorage.getItem('se_owner_acc')||''}catch(e){}
  if(!ok&&a&&!S.admOff&&(!oa||oa===a)){const sig=await signWithOwner(a);if(sig){S.admSig=sig;S.admAcc=a;ok=true;try{if(!oa)localStorage.setItem('se_owner_acc',a)}catch(e){}}}
  if(ok&&!ADM){if(!S.admBak)S.admBak={da:S.da,sao:S.sao,inv:JSON.parse(JSON.stringify(S.inv||{}))};ADM=true;topUp();try{refresh()}catch(e){}}
  if(!ok&&ADM){ADM=false}
  if(!ok&&S.admSig&&S.admAcc!==a){delete S.admSig}
  badge()}finally{busy=false}}
/* bật lại khi chủ game muốn (gọi SEADM.on() hoặc nhập lại khoá) */
window.SEADM={get on(){return ADM},check,enable(){delete S.admOff;try{localStorage.setItem('se_owner_acc',acc())}catch(e){}try{save()}catch(e){}return check()},disable:off};
{const _r=refresh;refresh=function(){const r=_r.apply(this,arguments);try{badge()}catch(e){}return r}}
setInterval(()=>{topUp();badge()},700);setInterval(check,4000);setTimeout(check,600);
})();
