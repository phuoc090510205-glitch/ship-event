import re
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)

C17=open('/home/claude/w62/c17.js',encoding='utf8').read().replace('__WSIMG__',open('/home/claude/w62/warship.b64').read().strip())
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C17+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# công trình nhóm c17 do c17 điều khiển
rep1("if(b.nb&&b.nb.c16&&window.c16Tick&&window.c16Tick(b,dt,G))return;",
     "if(b.nb&&b.nb.c16&&window.c16Tick&&window.c16Tick(b,dt,G))return;\n    if(b.nb&&b.nb.c17&&window.c17Tick&&window.c17Tick(b,dt,G))return;")
# làn khói: địch không thấy công trình / tàu đồng minh đang trong khói
rep1("G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine')return;const q=dd(e,b)-Math.max(b.w,b.h)*.4;if(q<bd){bd=q;tg=b}});",
     "G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine'||b.smk>0)return;const q=dd(e,b)-Math.max(b.w,b.h)*.4;if(q<bd){bd=q;tg=b}});")
rep1("G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine')return;const q=dd(e,b);if(q<w.rng+Math.max(b.w,b.h)*.4&&q<b2){b2=q;t2=b}});",
     "G.bl.forEach(b=>{if(b.hp<=0||b.t==='mine'||b.smk>0)return;const q=dd(e,b);if(q<w.rng+Math.max(b.w,b.h)*.4&&q<b2){b2=q;t2=b}});")
rep1("if(!P.dead){const q=dd(e,P);if(q<9&&q<bd+3){bd=q;tg=P}}","if(!P.dead&&!(P.smk>0)){const q=dd(e,P);if(q<9&&q<bd+3){bd=q;tg=P}}")
rep1("if(!P.dead&&!(P.stl>0)){const q=dd(e,P);","if(!P.dead&&!(P.stl>0)&&!(P.smk>0)){const q=dd(e,P);")
# xưởng cơ khí trung tâm: tốc độ chạy / tốc độ bắn
rep1("(P.boostT>0?1+P.boostP/100:1),accE","(P.boostT>0?1+P.boostP/100:1)*(P.c17sp||1),accE")
rep1("function spK(u){let k=u&&u.spb&&u.spb.t>0?1+u.spb.p:1;","function spK(u){let k=(u&&u.spb&&u.spb.t>0?1+u.spb.p:1)*((u&&u.c17sp)||1);")
rep1("function frK(u){return u&&u.fr&&u.fr.t>0?1+u.fr.p:1}","function frK(u){return (u&&u.fr&&u.fr.t>0?1+u.fr.p:1)*((u&&u.c17fr)||1)}")
rep1("function c5Near(G,x,y,R,n){const L=c5E(G)","function c5Near(G,x,y,R,n){R+=(window.c17Sk?window.c17Sk(G):0);const L=c5E(G)")
# giao diện đặt làn khói trong Trụ sở
rep1("Mở theo chương: ${nc.map(b=>b.n).join(', ')}.`:'');\n}\nfunction bCnt(){","Mở theo chương: ${nc.map(b=>b.n).join(', ')}.`:'');\n  try{window.c17BaseUI&&window.c17BaseUI(s)}catch(e){console.error(e)}\n}\nfunction bCnt(){")
rep1("$('brst').onclick=()=>{S.base.pos={};S.base.rot={};save();","$('brst').onclick=()=>{S.base.pos={};S.base.rot={};S.base.smk={};save();")
rep1("VER='v153'","VER='v155'")
open(p,'w',encoding='utf8').write(s)
print('ok37')
