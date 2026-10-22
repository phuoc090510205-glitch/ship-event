import base64
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
L='/home/claude/logo/'
b64=lambda f:base64.b64encode(open(L+f,'rb').read()).decode()
OG='https://phuoc090510205-glitch.github.io/ship-event/logo.png'
# logo do người dùng cung cấp
rep1('<title>Ship event</title>','<title>Ship event</title>\n<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,'+b64('u32.png')+'">\n<link rel="apple-touch-icon" href="data:image/png;base64,'+b64('u180.png')+'">\n<meta name="theme-color" content="#0a1840">\n<meta property="og:title" content="Ship event">\n<meta property="og:image" content="'+OG+'">')
rep1('<div class="ev"><b>Ship event</b></div>','<div class="ev"><img class="evlg" alt="Ship event" src="data:image/webp;base64,'+b64('u512.webp')+'"><b class="evtx">Ship event</b></div>')
rep1('.ev b{','.evlg{display:block;width:clamp(150px,30vw,230px);height:auto;margin:0 auto;border-radius:22px;box-shadow:0 0 28px rgba(63,160,255,.55),0 0 0 2px rgba(120,200,255,.35)}\n.ev b.evtx{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}\n.ev b{')
rep1("VER='v168'","VER='v169'")
open(p,'w',encoding='utf8').write(s)
print('ok50')
