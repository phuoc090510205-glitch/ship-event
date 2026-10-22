p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
C27=open('/home/claude/w62/c27.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C27+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
rep1("VER='v166'","VER='v167'")
# chống lỗi chia 0 khi kẻ địch đứng trùng vị trí mục tiêu (vị trí thành NaN)
rep1("const q=Math.hypot(tg.x-e.x,tg.y-e.y);","const q=Math.hypot(tg.x-e.x,tg.y-e.y)||.001;")
open(p,'w',encoding='utf8').write(s)
print('ok48')
