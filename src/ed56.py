p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
# --- cơ chế đạn thực tế cho pháo c22 ---
# 1) đạn ra ở đầu nòng (không ra từ tâm công trình)
rep1("const bore=(b,c)=>c.rot?Math.min(b.w,b.h)*.5:0;","const bore=(b,c)=>c.rot?Math.min(b.w,b.h)*.5:Math.max(b.w,b.h)*.42;")
# 2) xoay nòng tới mục tiêu xong mới bắn (đạn đi đúng hướng nòng)
rep1("const ROTK=t=>t[0]==='h';","const ROTK=t=>t[0]==='h';\nfunction aimOk(b,a,dt){if(b.c22ra==null)b.c22ra=a;b.c22a=a;let d=a-b.c22ra;d=Math.atan2(Math.sin(d),Math.cos(d));const st=7*dt;b.c22ra+=Math.max(-st,Math.min(st,d));d=a-b.c22ra;return Math.abs(Math.atan2(Math.sin(d),Math.cos(d)))<.12}")
rep1("b.c22a=Math.atan2(tg.y-b.y,tg.x-b.x);volley(b,G,c,tg);b.c22cd+=per}","{const a0=Math.atan2(tg.y-b.y,tg.x-b.x);if(ROTK(String(b.nb&&b.nb.c22||''))&&!aimOk(b,a0,dt))return;b.c22a=a0}volley(b,G,c,tg);b.c22cd+=per}")
# 3) pháo nhiều nòng: các viên bay thẳng song song theo hướng nòng, không chụm vào một điểm
rep1("let ah=Math.atan2(tg.y-m.y,tg.x-m.x);","let ah=(c.n>1&&!c.spread&&c.kind==='bullet')?a0:Math.atan2(tg.y-m.y,tg.x-m.x);")
C32=open('/home/claude/w62/c32.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C32+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
rep1("VER='v173'","VER='v174'")
open(p,'w',encoding='utf8').write(s)
print('ok56')
