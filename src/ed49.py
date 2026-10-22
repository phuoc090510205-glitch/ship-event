p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
C28=open('/home/claude/w62/c28.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C28+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# điều hướng kẻ địch (rương vàng dụ tới, chói lóa đi lạc)
rep1("    e._tg=tg;\n    const rs=e.ws.map(w=>w.rng),stay=rs.length?Math.max(3,Math.min(...rs)+1.5):5;",
     "    e._tg=tg;\n    if(window.c28Tg){const z=window.c28Tg(e,tg);if(z)tg=z}\n    const rs=e.ws.map(w=>w.rng),stay=tg&&tg.c28st!=null?tg.c28st:(rs.length?Math.max(3,Math.min(...rs)+1.5):5);")
# đồng minh không tự dùng Vụ Nổ Đỏ Khóa (chỉ tự nổ khi tử vong)
rep1("if(pl.gt||pl.mark)continue;","if(pl.gt||pl.mark||pl.noAuto)continue;")
# kỹ năng hóa giải xóa dấu Cảnh Báo Đỏ
rep1("function c7CC(u){","function c7CC(u){u.c28rw=null;")
rep1("u.stun=0;u.slowT=0;u.slowK=1;u.silT=0;u.lockT=0;u.jamT=0;u.iceT=0;ring(G,u.x,u.y,.2,(u.size||2)*1.2","u.c28rw=null;u.stun=0;u.slowT=0;u.slowK=1;u.silT=0;u.lockT=0;u.jamT=0;u.iceT=0;ring(G,u.x,u.y,.2,(u.size||2)*1.2")
rep1("['stun','slowT','jamT','silT','lockT','iceT'].forEach(f=>{u[f]=0});u.slowK=1;u.jamK=1;","['stun','slowT','jamT','silT','lockT','iceT'].forEach(f=>{u[f]=0});u.c28rw=null;u.slowK=1;u.jamK=1;")
rep1("u.stun=0;u.slowT=0;u.slowK=1;u.silT=0;u.lockT=0;u.jamT=0;u.iceT=0;u.bmk=0","u.c28rw=null;u.stun=0;u.slowT=0;u.slowK=1;u.silT=0;u.lockT=0;u.jamT=0;u.iceT=0;u.bmk=0")
rep1("if(o.wave){['stun','slowT','jamT','silT','vulT','cVulT','lockT'].forEach(f=>{if(P[f]>0)P[f]=0});","if(o.wave){P.c28rw=null;['stun','slowT','jamT','silT','vulT','cVulT','lockT'].forEach(f=>{if(P[f]>0)P[f]=0});")
rep1("VER='v167'","VER='v168'")
open(p,'w',encoding='utf8').write(s)
print('ok49')
