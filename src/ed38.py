import re
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)

C18=open('/home/claude/w62/c18.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C18+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# 24 công trình khai thác & phòng thủ do c18 điều khiển
rep1("if(b.nb&&b.nb.c17&&window.c17Tick&&window.c17Tick(b,dt,G))return;",
     "if(b.nb&&b.nb.c17&&window.c17Tick&&window.c17Tick(b,dt,G))return;\n    if(b.nb&&b.nb.c18&&window.c18Tick&&window.c18Tick(b,dt,G))return;")
# xoay mũi tháp: chỉ các tháp xoay 360°; tháp cố định giữ nguyên hướng
rep1("window.TRN=function(b,im,q,x,y,w,h){\n  const G=DG;",
     "window.TRN=function(b,im,q,x,y,w,h){\n  if(b.nb&&b.nb.c18&&!b.u&&window.c18TRN)return window.c18TRN(b,im,q,x,y,w,h);\n  const G=DG;")
# màn xem trước: vẽ tháp xoay
rep1("if(im){if(b.nb){const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;q.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}else q.drawImage(im,x,y,w,h)}else{q.fillStyle='#223f7c'",
     "if(im){if(b.nb&&b.nb.c18&&window.c18TRN&&window.c18TRN(b,im,q,x,y,w,h)){}else if(b.nb){const rr=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*rr,dh=im.naturalHeight*rr;q.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}else q.drawImage(im,x,y,w,h)}else{q.fillStyle='#223f7c'")
rep1("VER='v155'","VER='v156'")
open(p,'w',encoding='utf8').write(s)
print('ok38')
