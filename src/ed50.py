import base64
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
L='/home/claude/logo/'
b64=lambda f:base64.b64encode(open(L+f,'rb').read()).decode()
svg=base64.b64encode(open(L+'emblem.svg','rb').read()).decode()
OG='https://phuoc090510205-glitch.github.io/ship-event/logo.png'
rep1('<title>Ship event</title>','<title>Ship event</title>\n<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,'+b64('icon-32.png')+'">\n<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,'+svg+'">\n<link rel="apple-touch-icon" href="data:image/png;base64,'+b64('icon-180.png')+'">\n<meta name="theme-color" content="#0a1840">\n<meta property="og:title" content="Ship event">\n<meta property="og:image" content="'+OG+'">')
rep1('<div class="ev"><b>Ship event</b></div>','<div class="ev"><img class="evlg" alt="Ship event" src="data:image/svg+xml;base64,'+svg+'"><b>Ship event</b></div>')
rep1('.ev b{','.evlg{display:block;width:clamp(84px,20vw,132px);height:auto;margin:0 auto 6px;filter:drop-shadow(0 0 16px rgba(63,216,255,.55))}\n.ev b{')
rep1("VER='v168'","VER='v169'")
open(p,'w',encoding='utf8').write(s)
print('ok50')
