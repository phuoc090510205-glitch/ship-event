p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)
def seg(start,end,new):
    global s
    assert s.count(start)==1,(start[:80],s.count(start))
    i=s.index(start);j=s.index(end,i);s=s[:i]+new+s[j:]
C25=open('/home/claude/w62/c25.js',encoding='utf8').read()
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C25+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")
# trận: quay đầu + đổi hướng có giới hạn
rep1("const kk=Math.min(1,3*(1+accE/100)*dt);P.vx=(P.vx||0)+(dvx-(P.vx||0))*kk;P.vy=(P.vy||0)+(dvy-(P.vy||0))*kk;P.x+=P.vx*dt;P.y+=P.vy*dt;",
     "if(window.c25Move)c25Move(P,dvx,dvy,accE,dt);else{const kk=Math.min(1,3*(1+accE/100)*dt);P.vx=(P.vx||0)+(dvx-(P.vx||0))*kk;P.vy=(P.vy||0)+(dvy-(P.vy||0))*kk;P.x+=P.vx*dt;P.y+=P.vy*dt}")
rep1("if(tg)P.ang=Math.atan2(tg.y-P.y,tg.x-P.x);else if(d>.3)P.ang=Math.atan2(P.ty-P.y,P.tx-P.x);",
     "{const a0=tg?Math.atan2(tg.y-P.y,tg.x-P.x):(d>.3?Math.atan2(P.ty-P.y,P.tx-P.x):null);if(a0!=null)P.ang=window.c25Turn?c25Turn(P,a0,dt):a0}")
# Kho: lắp / tháo theo năng lượng
rep1("    items.push({id:wid,ax:pl.ax,ay:pl.ay,rot:pl.rot?1:0});K[P.key][cur.id]=items;save();khRender();toast('Đã lắp '+w.n);return;",
     "    if(window.c25Can&&!c25Can(cur,w))return;\n    items.push({id:wid,ax:pl.ax,ay:pl.ay,rot:pl.rot?1:0});K[P.key][cur.id]=items;save();khRender();toast('Đã lắp '+w.n);return;")
rep1("{const P=KPAR[{a:'b',y:'y',n:'g',t:'s',m:'m',k:'k'}[sk]],items=P.get(cur),it=items.splice(+r.dataset.n,1)[0];",
     "{if(window.c25CanRemove&&!c25CanRemove(cur,sk,+r.dataset.n))return;const P=KPAR[{a:'b',y:'y',n:'g',t:'s',m:'m',k:'k'}[sk]],items=P.get(cur),it=items.splice(+r.dataset.n,1)[0];")
rep1("if(P){if(!P.get(cur).length){toast('Chưa lắp '+P.n+' nào');return}K[P.key][cur.id]=[];",
     "if(P){if(!P.get(cur).length){toast('Chưa lắp '+P.n+' nào');return}if(K.mod==='g'&&window.c25CanRemove&&!c25CanRemove(cur,'all:g'))return;K[P.key][cur.id]=[];")
# Kho: dòng chỉ số modul
seg("if(w.eng){const q=enAt(w);l1=`Cấp ${q.l} · Lực đẩy","else if(w.skl){",
    "if(w.eng){const q=enAt(w);l1=`Cấp ${q.l} · Tốc chạy +${f2(q.sp)} · Gia tốc +${f2(q.acc)}%`;l2=`Cần ${q.en} năng lượng · KL ${w.mass}`}\n      ")
seg("else if(w.mrd){const q=mAt(w);l1=`Cấp ${q.l} · Giảm KL","else if(w.nuc){",
    "else if(w.mrd){const q=mAt(w);l1=`Cấp ${q.l} · Giảm ${q.red.toLocaleString('vi-VN')} KL`;l2=`Cần ${q.en} năng lượng`}\n      ")
seg("else if(w.nuc){const q=nAt(w);l1=`Cấp ${q.l} · Công suất","else if(w.tnk){",
    "else if(w.nuc){const q=nAt(w);l1=`Cấp ${q.l} · Cấp +${f2(q.pw)} năng lượng`;l2=`KL ${w.mass}`}\n      ")
rep1("else{const q=arAt(w);l1=`Cấp ${q.l} · Máu ${q.dur.toLocaleString('vi-VN')}`;l2=`Hồi ${q.reg}/s · Trễ ${String(q.dly).replace('.',',')}s · KL ${w.mass}`}",
     "else{const q=arAt(w);l1=`Cấp ${q.l} · Máu +${q.dur.toLocaleString('vi-VN')}`;l2=`KL ${w.mass}`}")
# giá giữ nguyên theo khối lượng gốc
rep1("const ownPrice=it=>Math.round((39000+it.mass*380)/1000)*1000;","const ownPrice=it=>Math.round((39000+(it.m0!=null?it.m0:it.mass)*380)/1000)*1000;")
rep1("Math.round((39000+(it.mass||100)*380)/1000)*1000}\nfunction stCost(it)","Math.round((39000+((it.it&&it.it.m0!=null?it.it.m0:it.mass)||100)*380)/1000)*1000}\nfunction stCost(it)")
rep1("m=kind==='w'?.6+it.mass/80:.5+it.mass/150;","m=kind==='w'?.6+it.mass/80:.5+(it.m0!=null?it.m0:it.mass)/150;")
rep1("VER='v164'","VER='v165'")
open(p,'w',encoding='utf8').write(s)
print('ok46')
