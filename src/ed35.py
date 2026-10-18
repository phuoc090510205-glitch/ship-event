import re
p='/home/claude/Ship_event.html'
s=open(p,encoding='utf8').read()
def rep1(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b)

C15=open('/home/claude/w62/c15.js',encoding='utf8').read()

# ===== logic mới: Tháp Laser / Nỏ thần / Súng phun lửa / Nhà drone tấn công =====
rep1("/* gộp pháo công trình hạng nặng vào pháo hạng nặng */",C15+"\n/* gộp pháo công trình hạng nặng vào pháo hạng nặng */")

# vòng lặp công trình: laser / nỏ / phun lửa do c15 điều khiển
rep1("    b.cd-=dt;if(b.cd>0)return;\n    const pbm=G.pb||{dm:1,cdm:1,rm:1};let tg=null,bd=sp.rng*pbm.rm;",
     "    if(window.c15Tick&&window.c15Tick(b,dt,G,reactor))return;\n    b.cd-=dt;if(b.cd>0)return;\n    const pbm=G.pb||{dm:1,cdm:1,rm:1};let tg=null,bd=sp.rng*pbm.rm;")
# nhà drone tấn công
rep1("if(b.t==='droneb'){BDR.tick(b,dt,G);return}",
     "if(b.t==='droneb'){if(window.c15Drone)window.c15Drone(b,dt,G);else BDR.tick(b,dt,G);return}")
rep1("b.drs.forEach(d=>{if(d.dead)return;const px=X(d.x),py=Y(d.y);if(d.live&&d.tg)drnBeam(",
     "b.drs.forEach(d=>{if(d.dead)return;if(b.t==='droneb'&&window.c15DroneDraw){window.c15DroneDraw(q,d,X(d.x),Y(d.y),s,T);return}const px=X(d.x),py=Y(d.y);if(d.live&&d.tg)drnBeam(")
# mũi tên: không gắn hiệu ứng VFX laser của nỏ cũ
rep1("const b=team==='p'&&src&&byPos(src.x,src.y);if(!b||!b.spec)return;",
     "const b=team==='p'&&src&&byPos(src.x,src.y);if(!b||!b.spec||(wp&&wp.sp&&wp.sp.k==='arrow'))return;")
# vẽ mũi tên vàng ngoài chiến trường
rep1("G.pr.forEach(p=>{if(p.vid&&vfxProj(q,p,s,dsx,dsy))return;if(p.k==='missile'&&window.MSL",
     "G.pr.forEach(p=>{if(p.vid&&vfxProj(q,p,s,dsx,dsy))return;if(p.k==='arrow'){window.c15Arrow(q,dsx(p.x),dsy(p.y),Math.atan2(p.vy,p.vx),s*.8,p.col);return}if(p.k==='missile'&&window.MSL")

# ===== Mô phỏng khai hỏa ở màn Nâng cấp Trụ sở =====
rep1("if(kind==='tur'){S1.nx-=dt;if(S1.nx<=0){fireTur();S1.nx=S1.cd}}",
     "if(kind==='tur'){const hh=window.c15PvStep&&c15PvStep(t,G,bx,by,dt,lv,S1,withG);if(!hh){S1.nx-=dt;if(S1.nx<=0){fireTur();S1.nx=S1.cd}}}")
rep1("const d=mkS(bx,by-dist,dmg1*18)",
     "const d=mkS(bx,by-dist,(window.c15PvHp&&c15PvHp(t,dmg1,lv))||dmg1*18)")
rep1("withG(()=>{q.lineCap='round';G.bm.forEach(b=>{if(b.vid&&vfxBeam(q,b,sc,X,Y))return;q.strokeStyle=b.col;q.lineWidth=2;",
     "withG(()=>{q.lineCap='round';G.bm.forEach(b=>{if(b.vid&&vfxBeam(q,b,sc,X,Y))return;q.strokeStyle=b.col;q.lineWidth=b.lw||2;q.shadowColor=b.col;q.shadowBlur=b.lw?10:0;")
rep1("G.pr.forEach(p=>{if(p.vid&&vfxProj(q,p,sc,X,Y))return;q.fillStyle=p.col;",
     "q.shadowBlur=0;G.pr.forEach(p=>{if(p.vid&&vfxProj(q,p,sc,X,Y))return;if(p.k==='arrow'){c15Arrow(q,X(p.x),Y(p.y),Math.atan2(p.vy,p.vx),sc*.8,p.col);return}q.fillStyle=p.col;")
rep1("vfxImp(q,G,sc,X,Y);G.fx.forEach(f2=>{const a=f2.t/f2.max;",
     "vfxImp(q,G,sc,X,Y);window.c15ConeDraw&&c15ConeDraw(q,G,X,Y,sc);G.fx.forEach(f2=>{const a=f2.t/f2.max;")
rep1("if(b.dataset.a==='f'){G.pr=[];G.bm=[];G.vfi=[];S1.nx=0;if(kind==='tur')S1.nx=0}",
     "if(b.dataset.a==='f'){G.pr=[];G.bm=[];G.vfi=[];S1.nx=0;S1.c15=null;S1.lz1=S1.lz2=null;S1.xt=0;G.fcn=[];G.fbn=[];if(kind==='tur')S1.nx=0}")

# ===== Thông số hiển thị khi nâng cấp =====
rep1(" laser:{n:'Tháp Laser',m:1.5,st:l=>[['Sát thương/giây',Math.round(40*(1+.25*(l-1)))],['Tầm bắn',(8+.4*(l-1)).toFixed(1)+' ô']]},",
     " laser:{n:'Tháp Laser',m:1.5,st:l=>[['Sát thương/giây (laser đỏ liên tục)',Math.round(70*(1+.1*(l-1)))],['Tầm bắn','7 ô']]},")
rep1(" crossbow:{n:'Nỏ thần',m:2.5,st:l=>[['Sát thương xuyên',Math.round(220*(1+.25*(l-1)))],['Số mục tiêu xuyên',2+Math.floor(l/20)]]},",
     " crossbow:{n:'Nỏ thần',m:2.5,st:l=>[['Sát thương mỗi mũi tên',Math.round(20*(1+.1*(l-1)))],['Tốc độ bắn','0,1 giây / mũi tên'],['Tầm bắn','8 ô']]},")
rep1(" flame:{n:'Súng phun lửa',m:2.2,st:l=>[['Sát thương/giây',Math.round(90*(1+.25*(l-1)))],['Thiêu đốt/giây',Math.round(15*(1+.2*(l-1)))]]},",
     " flame:{n:'Súng phun lửa',m:2.2,st:l=>[['Sát thương trong 7 giây (hình nón)',Math.round(1000*(1+.1*(l-1)))],['Thiêu đốt trong 3 giây',Math.round(20*(1+.1*(l-1)))],['Tầm phun','5 ô'],['Nghỉ giữa hai lần phun','3 giây']]},")
rep1(" droneb:{n:'Nhà drone sửa chữa',m:2,st:l=>[['Hồi máu/giây',Math.round(20*(1+.2*(l-1)))],['Số drone',2+Math.floor(l/15)],['Máu drone',10+5*(l-1)]]},",
     " droneb:{n:'Nhà drone tấn công',m:2,st:l=>[['Máu mỗi drone',Math.round(200*(1+.1*(l-1)))],['Sát thương (súng xung nhỏ)',Math.round(24*(1+.1*(l-1)))],['Phạm vi tấn công','4 ô'],['Tạo drone','60 giây / drone, tối đa 3']]},")
rep1("{t:'droneb',n:'Nhà drone sửa chữa',w:3,h:3,ch:1,c:2,hl:[35,80],pos:[],note:'Drone tự sửa chữa trụ sở và công trình.'}",
     "{t:'droneb',n:'Nhà drone tấn công',w:3,h:3,ch:1,c:2,hl:[35,80],pos:[],note:'Tạo drone tấn công ra chiến trường: 60 giây / drone, tối đa 3.'}")
rep1("note:'Bắn tia laser liên tục vào kẻ địch.'","note:'Chiếu tia laser đỏ liên tục vào mục tiêu, 70 sát thương/giây.'")
rep1("note:'Bắn mũi tên xuyên thấu nhiều mục tiêu.'","note:'Bắn mũi tên vàng 0,1 giây / mũi, không xuyên mục tiêu, tầm 8 ô.'")
rep1("note:'Phun lửa tầm gần, thiêu đốt kẻ địch.'","note:'Phun lửa hình nón: 1000 sát thương trong 7 giây, kèm thiêu đốt.'")

# ===== phiên bản =====
rep1("VER='v151'","VER='v152'")
open(p,'w',encoding='utf8').write(s)
print('ok35')
