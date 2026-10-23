p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
C31=open("/home/claude/w62/c31.js",encoding="utf8").read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C31+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
rep1("VER='v171'","VER='v172'")
open(p,'w',encoding='utf8').write(s)
print('ok53')
