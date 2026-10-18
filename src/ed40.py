import re
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)

C20=open('/home/claude/w62/c20.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C20+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# vòng lặp công trình
rep1("if(b.nb&&b.nb.c19&&window.c19Tick&&window.c19Tick(b,dt,G))return;",
     "if(b.nb&&b.nb.c19&&window.c19Tick&&window.c19Tick(b,dt,G))return;\n    if(b.nb&&b.nb.c20&&window.c20Tick&&window.c20Tick(b,dt,G))return;")
# nút đặt lồng ở Trụ sở
rep1("try{window.c19BaseUI&&window.c19BaseUI(s)}catch(e){console.error(e)}",
     "try{window.c19BaseUI&&window.c19BaseUI(s)}catch(e){console.error(e)}\n  try{window.c20BaseUI&&window.c20BaseUI(s)}catch(e){console.error(e)}")
# kỹ năng thuyền trưởng của địch (thiên thạch)
rep1("try{if(window.c19Cast&&!G.c19in)window.c19Cast(G,P,k,sc)}catch(er){console.error(er)}",
     "try{if(window.c19Cast&&!G.c19in)window.c19Cast(G,P,k,sc)}catch(er){console.error(er)}\n  try{if(window.c20Cast)window.c20Cast(G,P,k,sc)}catch(er){console.error(er)}")
# boss ngày dùng kỹ năng thiên thạch
rep1("toast('Boss dùng «'+k[0]+'»');",
     "toast('Boss dùng «'+k[0]+'»');try{window.c20BossCast&&window.c20BossCast(G,e,k[0])}catch(er){console.error(er)}")
rep1("VER='v157'","VER='v158'")
open(p,'w',encoding='utf8').write(s)
print('ok40')
