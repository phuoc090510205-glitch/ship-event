p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
C26=open('/home/claude/w62/c26.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C26+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
rep1("  return o;\n}\nfunction csCol(k,o){","  if(window.c26Plan){const z=window.c26Plan(k);if(z)return z}\n  return o;\n}\nfunction csCol(k,o){")
rep1("    else if(o.vf==='c5'){c5Cast(G,V,P,k,o,near,inR)}","    else if(o.vf==='c5'){if(o.c26&&window.c26Cast)window.c26Cast(G,P,k,o,near,inR,sc);else c5Cast(G,V,P,k,o,near,inR)}")
rep1("VER='v165'","VER='v166'")
open(p,'w',encoding='utf8').write(s)
print('ok47')
