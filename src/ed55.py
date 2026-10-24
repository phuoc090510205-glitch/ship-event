p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
rep1("VER='v172'","VER='v173'")
open(p,'w',encoding='utf8').write(s)
print('ok55')
