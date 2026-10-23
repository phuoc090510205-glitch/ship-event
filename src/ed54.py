p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
# xác minh trang với Monetag
rep1('<title>Ship event</title>','<title>Ship event</title>\n<meta name="monetag" content="3afc552a3eae35e4b248ad4590e15763">')
open(p,'w',encoding='utf8').write(s)
print('ok54')
