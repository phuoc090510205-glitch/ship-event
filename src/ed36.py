import re
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)

C16=open('/home/claude/w62/c16.js',encoding='utf8').read()

# logic + mô phỏng mới (chèn sau c15, trước dòng gộp pháo)
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C16+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# công trình nhóm Bảo trì do c16 điều khiển
rep1("if(b.nb&&b.nb.k!=='tur'){dfNb(b,dt,G);return}",
     "if(b.nb&&b.nb.c16&&window.c16Tick&&window.c16Tick(b,dt,G))return;\n    if(b.nb&&b.nb.k!=='tur'){dfNb(b,dt,G);return}")
# vẽ drone bảo trì (xưởng drone bảo trì)
rep1("if(b.t==='droneb'&&window.c15DroneDraw){",
     "if(b.t==='mt2'&&window.c16DroneDraw){window.c16DroneDraw(q,d,X,Y,s,T);return}if(b.t==='droneb'&&window.c15DroneDraw){")
# mô phỏng cũ không nhận các công trình c16
rep1("const kindOf=(t,def)=>{const f=def&&def.nb;",
     "const kindOf=(t,def)=>{if(window.c16Has&&window.c16Has(t))return null;const f=def&&def.nb;")
rep1("VER='v152'","VER='v153'")
open(p,'w',encoding='utf8').write(s)
print('ok36')
