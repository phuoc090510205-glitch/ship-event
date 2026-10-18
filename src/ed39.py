import re
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)

C19=open('/home/claude/w62/c19.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C19+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# (2) vòng lặp công trình
rep1("if(b.nb&&b.nb.c18&&window.c18Tick&&window.c18Tick(b,dt,G))return;",
     "if(b.nb&&b.nb.c18&&window.c18Tick&&window.c18Tick(b,dt,G))return;\n    if(b.nb&&b.nb.c19&&window.c19Tick&&window.c19Tick(b,dt,G))return;")
# (3) xoay mũi tháp khi vẽ
rep1("if(b.nb&&b.nb.c18&&!b.u&&window.c18TRN)return window.c18TRN(b,im,q,x,y,w,h);",
     "if(b.nb&&b.nb.c18&&!b.u&&window.c18TRN)return window.c18TRN(b,im,q,x,y,w,h);\n  if(b.nb&&b.nb.c19&&!b.u&&window.c19TRN)return window.c19TRN(b,im,q,x,y,w,h);")
# (4) màn xem trước
rep1("if(b.nb&&b.nb.c18&&window.c18TRN&&window.c18TRN(b,im,q,x,y,w,h)){}else if(b.nb){",
     "if(b.nb&&b.nb.c18&&window.c18TRN&&window.c18TRN(b,im,q,x,y,w,h)){}else if(b.nb&&b.nb.c19&&window.c19TRN&&window.c19TRN(b,im,q,x,y,w,h)){}else if(b.nb){")
# (5) sao chép kỹ năng thuyền trưởng
rep1("try{r=cast0(P,k,sc)}finally{G.c14p=pc;G.dmM=pm}",
     "try{r=cast0(P,k,sc)}finally{G.c14p=pc;G.dmM=pm}\n  try{if(window.c19Cast&&!G.c19in)window.c19Cast(G,P,k,sc)}catch(er){console.error(er)}")
# (6) đạn: ghi nhận nguồn bắn
rep1("  G.pr.forEach(p=>{\n    if(p.dead)return;\n    if(p.tg&&!p.tg.dead){const a=Math.atan2(p.tg.y-p.y,p.tg.x-p.x)",
     "  G.pr.forEach(p=>{\n    if(p.dead)return;\n    G.c19cur=p.own||null;\n    if(p.tg&&!p.tg.dead){const a=Math.atan2(p.tg.y-p.y,p.tg.x-p.x)")
# (7) sprite công trình ở Trụ sở: xoay theo hướng đã chọn
rep1("if(BSPR[b.t])return `<img class=\"sp\" src=\"${b.t==='wall'&&b.v?BSPR.wallv:BSPR[b.t]}\" alt=\"${b.n}\">`;",
     "if(BSPR[b.t])return `<img class=\"sp\" src=\"${b.t==='wall'&&b.v?BSPR.wallv:BSPR[b.t]}\" alt=\"${b.n}\"${window.c19BI?window.c19BI(b):''}>`;")
# (8) nút Xoay hướng
rep1("try{window.c17BaseUI&&window.c17BaseUI(s)}catch(e){console.error(e)}",
     "try{window.c17BaseUI&&window.c17BaseUI(s)}catch(e){console.error(e)}\n  try{window.c19BaseUI&&window.c19BaseUI(s)}catch(e){console.error(e)}")
# (9) đặt lại vị trí cũng đặt lại hướng
rep1("$('brst').onclick=()=>{S.base.pos={};S.base.rot={};S.base.smk={};save();",
     "$('brst').onclick=()=>{S.base.pos={};S.base.rot={};S.base.smk={};S.base.dir={};save();")
rep1("VER='v156'","VER='v157'")
open(p,'w',encoding='utf8').write(s)
print('ok39')
