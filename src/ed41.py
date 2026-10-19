p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
a="VER='v158'"
assert s.count(a)==1
open(p,'w',encoding='utf8').write(s.replace(a,"VER='v159'"))
