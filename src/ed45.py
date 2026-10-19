p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
QR=open('/home/claude/w62/qr.min.js',encoding='utf8').read().strip()
C24=open('/home/claude/w62/c24.js',encoding='utf8').read()
assert C24.count('/*QRLIB*/')==1
C24=C24.replace('/*QRLIB*/','/* qrcode-generator 1.4.4 — (c) 2009 Kazuhiko Arase, MIT license */\n'+QR)
C24='\n/* ===== c24: Thanh toán chuyển khoản ngân hàng (VietQR) + chủ game xác nhận đơn ===== */'+C24
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C24+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# Bạn bè & Góp ý dùng chung địa chỉ Firebase
rep1("const FB_URL='';","const FB_URL=(window.SE_CFG&&SE_CFG.fb)||'';")
# Shop khuyến mãi: lộ hàm trao vật phẩm, thay thanh toán giả lập bằng chuyển khoản thật
rep1("function canBuy(s){","window.PSHG=give;window.PSHL=lines;function canBuy(s){")
rep1("pay(p[0],p[1],()=>{const t=give(p[4]);save();refresh();toast('Đã mua '+p[0]+(t.length?' · '+t.join(', '):''));show(tab)})",
     "PAYX.start({src:'psh',name:p[0],vnd:p[1],spec:p[4],get:lines(p[4]).join(' · '),after:()=>{try{if($('psh').style.display!=='none')show(tab)}catch(e){}}})")
rep1("document.querySelectorAll('#psh .pb').forEach(b=>b.onclick=()=>toast('Thanh toán chưa mở trong bản thử'));",
     "document.querySelectorAll('#psh .pb').forEach(b=>b.onclick=()=>window.PAYX?PAYX.promo(b):toast('Đang tải thanh toán…'));")
rep1("grid.querySelectorAll('.pb').forEach(b=>b.onclick=()=>toast('Thanh toán chưa mở trong bản thử'));return}",
     "grid.querySelectorAll('.pb').forEach(b=>b.onclick=()=>PAYX.promo(b));return}")
rep1("$('ngrid').querySelectorAll('.nb').forEach(b=>b.onclick=()=>toast('Thanh toán chưa mở trong bản thử'));",
     "$('ngrid').querySelectorAll('.nb').forEach(b=>b.onclick=()=>window.PAYX?PAYX.nap(k,+b.dataset.i):toast('Đang tải thanh toán…'));")
# gói sự kiện: truyền tàu đã chọn để giao đúng khi được xác nhận
rep1("evPay(o,()=>{S.unl=S.unl||{};S.unl[b.dataset.id]=true;evFinish(o,'mở khóa tàu '+KSH.find(x=>x.id===b.dataset.id).n)})};",
     "evPay(o,()=>{S.unl=S.unl||{};S.unl[b.dataset.id]=true;evFinish(o,'mở khóa tàu '+KSH.find(x=>x.id===b.dataset.id).n)},{ship:b.dataset.id})};")
rep1("evPay(o,()=>{S.unl=S.unl||{};S.unl[n.id]=true;evFinish(o,'mở khóa tàu '+n.n)});return}",
     "evPay(o,()=>{S.unl=S.unl||{};S.unl[n.id]=true;evFinish(o,'mở khóa tàu '+n.n)},{ship:n.id});return}")
rep1("VER='v162'","VER='v163'")
open(p,'w',encoding='utf8').write(s)
print('ok45')
