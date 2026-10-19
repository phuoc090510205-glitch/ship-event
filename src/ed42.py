p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
C21=open('/home/claude/w62/c21.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C21+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
rep1("if(b.nb&&b.nb.c20&&window.c20Tick&&window.c20Tick(b,dt,G))return;",
     "if(b.nb&&b.nb.c20&&window.c20Tick&&window.c20Tick(b,dt,G))return;\n    if(b.nb&&b.nb.c21&&window.c21Tick&&window.c21Tick(b,dt,G))return;")
rep1("VER='v159'","VER='v160'")
open(p,'w',encoding='utf8').write(s)
print('ok42')
