p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
C22=open('/home/claude/w62/c22.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C22+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
rep1("if(b.nb&&b.nb.c21&&window.c21Tick&&window.c21Tick(b,dt,G))return;",
     "if(b.nb&&b.nb.c21&&window.c21Tick&&window.c21Tick(b,dt,G))return;\n    if(b.nb&&b.nb.c22&&window.c22Tick&&window.c22Tick(b,dt,G,reactor))return;")
rep1("window.c19TRN(b,im,q,x,y,w,h)){}else if(b.nb){","window.c19TRN(b,im,q,x,y,w,h)){}else if(b.nb&&b.nb.c22&&window.c22TRN&&window.c22TRN(b,im,q,x,y,w,h)){}else if(b.nb){")
rep1("VER='v160'","VER='v161'")
open(p,'w',encoding='utf8').write(s)
print('ok43')
