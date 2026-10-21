
/* ---------- Số liệu thật của game: lấy tàu đang chọn trong Kho làm tàu mẫu ---------- */
const DEF={hp:90,speed:16.8,turn:16.8,mass:1380,enMax:1,enGen:1,reg:0,dly:5,acc:0};
function refCtx(){let sh=null;try{sh=KSH.find(x=>x.id===khS().sel)||KSH[0]}catch(e){sh=KSH&&KSH[0]}
  const c={sh,wm:{},E0:[],A0:[]};try{c.wm=khWpMap(sh);c.E0=khEngines(sh).map(x=>({id:x.id}));c.A0=khArmor(sh).map(x=>({id:x.id}))}catch(e){}return c}
function stats(c,eng,arm){try{const t=khStats(c.sh,c.wm,null,arm||c.A0,eng||c.E0);if(t&&isFinite(t.hp)&&isFinite(t.speed))return t}catch(e){}return Object.assign({},DEF)}
/* ---------- vẽ ---------- */
const tx=(q,s,x,y,col,sz,al)=>{q.fillStyle=col||'#fff';q.font='bold '+(sz||11)+'px system-ui,sans-serif';q.textAlign=al||'left';q.textBaseline='alphabetic';q.fillText(s,x,y)};
const bgd=(q,W,H)=>{const g=q.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1640');g.addColorStop(1,'#040a20');q.fillStyle=g;q.fillRect(0,0,W,H);
  q.strokeStyle='rgba(80,130,255,.10)';q.lineWidth=1;for(let x=0;x<W;x+=30){q.beginPath();q.moveTo(x+.5,0);q.lineTo(x+.5,H);q.stroke()}for(let y=0;y<H;y+=30){q.beginPath();q.moveTo(0,y+.5);q.lineTo(W,y+.5);q.stroke()}};
const barD=(q,x,y,w,h,f,col)=>{q.fillStyle='#000b';q.fillRect(x,y,w,h);q.fillStyle=col;q.fillRect(x,y,w*Math.max(0,Math.min(1,f)),h);q.strokeStyle='#fff6';q.lineWidth=1;q.strokeRect(x+.5,y+.5,w-1,h-1)};
const spr=(q,sh,x,y,s,a)=>{const im=sh&&dimg(sh.img);q.save();q.globalAlpha=a==null?1:a;
  if(im&&im.complete&&im.naturalWidth){const r=im.naturalWidth/im.naturalHeight;q.drawImage(im,x-s*r/2,y-s/2,s*r,s)}
  else{q.fillStyle='#8fb4ff';q.beginPath();q.moveTo(x,y-s/2);q.lineTo(x+s*.4,y+s/2);q.lineTo(x-s*.4,y+s/2);q.closePath();q.fill()}q.restore()};
const enemyMk=(q,x,y,s,col,flash)=>{q.save();q.translate(x,y);q.fillStyle=flash?'#fff':(col||'#c22a3c');q.strokeStyle='#ffb3bb';q.lineWidth=1.5;
  q.beginPath();q.moveTo(0,s*.5);q.lineTo(s*.5,-s*.4);q.lineTo(s*.2,-s*.25);q.lineTo(0,-s*.45);q.lineTo(-s*.2,-s*.25);q.lineTo(-s*.5,-s*.4);q.closePath();q.fill();q.stroke();q.restore()};
const ringD=(q,x,y,r,col,a,lw)=>{q.save();q.globalAlpha=Math.max(0,a);q.strokeStyle=col;q.lineWidth=lw||3;q.beginPath();q.arc(x,y,Math.max(1,r),0,7);q.stroke();q.restore()};
const flame=(q,x,y,len,w,col)=>{const g=q.createLinearGradient(0,y,0,y+len);g.addColorStop(0,col||'#ffd45a');g.addColorStop(1,'rgba(255,90,20,0)');q.fillStyle=g;q.beginPath();q.moveTo(x-w/2,y);q.lineTo(x+w/2,y);q.lineTo(x,y+len);q.closePath();q.fill()};
const floatTx=(q,list,col)=>{list.forEach(f=>{const k=f.t/f.max;if(!(k<1))return;q.globalAlpha=1-k;tx(q,f.s,f.x,f.y-k*26,f.col||col||'#fff',f.sz||12,'center');q.globalAlpha=1})};

/* ---------- 1) MODUL TỐC CHẠY: đua 10 ô giữa tàu hiện tại và tàu đã lắp động cơ ---------- */
function sceneEng(it,c){
  const m=it.it,A=stats(c,c.E0);window.c25Force=true;let B;try{B=stats(c,c.E0.concat([{id:m.id}]))}finally{window.c25Force=false}const D=10,T=18,SD=(window.C25&&C25.SP_DIV)||12;
  const PWr=window.C25?C25.power((()=>{try{return khReactors(c.sh)}catch(e){return[]}})(),c.E0,(()=>{try{return khMassMods(c.sh)}catch(e){return[]}})()):{left:0},need=2*(window.C25?C25.cellsOf(m):m.w*m.h);
  const mk=t=>({vt:Math.max(.5,t.speed/SD),acc:t.acc||0,d:0,v:0,fin:null,t90:null,top:0});
  const L=[mk(A),mk(B)];let done=false;
  const fin=()=>L.map(s=>s.fin!=null?s.fin:T+(D-s.d)/Math.max(.05,s.v));
  return {T,isDone:()=>done,
    step(dt,t){L.forEach(s=>{if(s.fin!=null)return;const kk=Math.min(1,3*(1+s.acc/100)*dt);s.v+=(s.vt-s.v)*kk;s.d+=s.v*dt;s.top=Math.max(s.top,s.v);
        if(s.t90==null&&s.v>=.9*s.vt)s.t90=t;if(s.d>=D){s.fin=t-(s.d-D)/Math.max(.01,s.v);s.d=D}});
      if(L.every(s=>s.fin!=null))done=true},
    draw(q,W,H,t){bgd(q,W,H);const y0=H-52,y1=52,pu=(y0-y1)/D,lx=[W*.28,W*.72],lw=Math.min(W*.34,170);
      lx.forEach(x=>{q.fillStyle='rgba(30,60,140,.22)';q.fillRect(x-lw/2,y1-26,lw,y0-y1+62)});
      for(let i=0;i<=D;i+=2){const y=y0-i*pu;q.strokeStyle='rgba(143,180,255,.25)';q.beginPath();q.moveTo(6,y);q.lineTo(W-6,y);q.stroke();tx(q,i+' ô',8,y-3,'#6f8fd0',9)}
      for(let k=0;k<20;k++){q.fillStyle=k%2?'#fff':'#111';q.fillRect(6+k*(W-12)/20,y1-3,(W-12)/20,6)}tx(q,'ĐÍCH',W/2,y1-9,'#ffe08a',11,'center');
      const nm=['TÀU HIỆN TẠI','SAU KHI LẮP ĐỘNG CƠ NÀY'],col=['#9fb4d8','#ffd45a'];
      L.forEach((s,i)=>{const x=lx[i],y=y0-s.d*pu;tx(q,nm[i],x,16,col[i],10,'center');
        if(s.fin==null){for(let k=0;k<12;k++){const yy=((k*61.7+s.d*pu*1.6)%(y0-y1+40))+y1-20;q.strokeStyle='rgba(255,255,255,.10)';q.beginPath();q.moveTo(x-lw/2+8+(k*37)%(lw-16),yy);q.lineTo(x-lw/2+8+(k*37)%(lw-16),yy+10);q.stroke()}
          const k2=Math.min(1,s.v/Math.max(.5,s.vt));flame(q,x,y+22,12+34*k2,14,i?'#ffd45a':'#7fb4ff')}
        spr(q,c.sh,x,y,50);
        tx(q,N1(s.v*SD)+' điểm',x,Math.min(H-8,y+44),col[i],11,'center');
        if(s.fin!=null){q.fillStyle=i?'#7dffb0':'#cfd8ee';q.font='bold 14px system-ui,sans-serif';q.textAlign='center';q.fillText('⏱ '+N1(s.fin)+' s',x,y1+30)}});
      tx(q,'Thời gian: '+N1(t)+' s',W/2,H-10,'#8fa6d8',11,'center')},
    result(){const f=fin(),dv=B.speed-A.speed;
      return {hd:dv>0?'Chạy nhanh hơn +'+PCT(B.speed,A.speed)+'% · đến đích sớm hơn '+N1(f[0]-f[1])+' giây':'Động cơ này không làm tàu nhanh hơn so với hiện tại',
        rows:[['Tốc chạy',N1(A.speed)+' → '+N1(B.speed)+' điểm',dv>0?'up':''],['Quay đầu',N1(A.turn)+' → '+N1(B.turn)+' điểm (tàu nặng hơn)',B.turn<A.turn?'dn':''],['Chạy hết '+D+' ô',N1(f[0])+' s → '+N1(f[1])+' s',f[1]<f[0]?'up':''],
          ['Gia tốc','+'+NF(A.acc||0)+'% → +'+NF(B.acc||0)+'%',(B.acc||0)>(A.acc||0)?'up':''],['Đạt 90% tốc độ tối đa sau',(L[0].t90==null?'—':N1(L[0].t90)+' s')+' → '+(L[1].t90==null?'—':N1(L[1].t90)+' s')],
          ['Khối lượng tàu',NF(A.mass)+' → '+NF(B.mass),B.mass>A.mass?'dn':''],['Năng lượng cần',need+' NL · tàu đang dư '+N1(Math.max(0,PWr.left))+' NL',need>PWr.left?'dn':'up']],
        nt:'Tính trên tàu đang chọn trong Kho ('+(c.sh&&c.sh.n||'tàu mẫu')+'), cộng thêm 1 động cơ này vào các động cơ đang lắp. '+(need>PWr.left?'⚠ Tàu chưa đủ năng lượng để lắp động cơ này: cần lắp thêm lõi hạt nhân (mỗi ô +3 NL). ':'')+'Chưa tính việc còn đủ ô vàng để lắp hay không.'}}}}

/* ---------- 2 + 5) Hai tàu bị bắn cùng một loạt đạn: dùng cho KHIÊN và kỹ năng CHẮN ---------- */
function sceneDuel(o,c){
  const mk=(h,reg,dly)=>({max:h,hp:h,reg,dly,since:99,dead:false,flash:0,boom:0,blk:0,bul:[]}),S=[mk(o.hA,o.regA,o.dlyA),mk(o.hB,o.regB,o.dlyB)];let acc=0,fx=[];
  const sc={S,T:o.T,
    step(dt,t){
      if(t<o.tFire){acc+=dt;while(acc>=.4){acc-=.4;S.forEach(s=>s.bul.push({p:0,dmg:o.dps*.4}))}}
      const lap=(o.lapseAt!=null&&t>=o.lapseAt)?o.lapse:1;
      S.forEach((s,i)=>{s.bul.forEach(b=>b.p+=dt/.45);
        s.bul=s.bul.filter(b=>{if(b.p<1)return true;
          if(!s.dead){let d=b.dmg;if(i===1&&o.sh&&t>=o.sh.t&&t<o.sh.t+o.sh.d){d*=1-o.sh.pw/100;s.blk+=b.dmg-d}
            const wasSh=i===1&&s.hp>o.hA;s.hp-=d;s.since=0;s.flash=.18;s.hitSh=wasSh;if(s.hp<=0){s.hp=0;s.dead=true;s.boom=0}}return false});
        s.flash=Math.max(0,s.flash-dt);if(s.dead){s.boom+=dt;return}
        const g=dt*lap;s.since+=g;if(s.since>=s.dly&&s.hp<s.max&&s.reg>0)s.hp=Math.min(s.max,s.hp+s.reg*g)})},
    draw(q,W,H,t){bgd(q,W,H);const lx=[W*.27,W*.73],ys=H-92,ye=44,bw=Math.min(150,W*.4),scale=Math.max(o.hA,o.hB);
      lx.forEach((x,i)=>{const s=S[i],sh=o.sh&&i===1&&t>=o.sh.t&&t<o.sh.t+o.sh.d;
        tx(q,o.labels[i],x,16,i?'#ffd45a':'#9fb4d8',10,'center');
        q.fillStyle='rgba(30,60,140,.18)';q.fillRect(x-bw/2-14,24,bw+28,H-32);
        enemyMk(q,x,ye+8,28,'#c22a3c',0);tx(q,'ĐỊCH',x,ye+34,'#ff9aa6',9,'center');
        s.bul.forEach(b=>{const yy=ye+22+(ys-ye-48)*b.p;q.fillStyle='#ffb37a';q.beginPath();q.arc(x,yy,4,0,7);q.fill();q.fillStyle='rgba(255,180,120,.35)';q.fillRect(x-1.5,yy-14,3,14)});
        if(!s.dead){spr(q,c.sh,x,ys,54);if(sh){ringD(q,x,ys,36+Math.sin(t*12)*2,'#7fd0ff',.85,3);q.save();q.globalAlpha=.16;q.fillStyle='#7fd0ff';q.beginPath();q.arc(x,ys,36,0,7);q.fill();q.restore()}
          if(s.flash>0)ringD(q,x,ys,30+(.18-s.flash)*60,s.hitSh||sh?'#7fd0ff':'#ff6a78',s.flash*5,3)}
        else{const k=Math.min(1,s.boom/.9);for(let j=0;j<4;j++){q.save();q.globalAlpha=1-k;q.fillStyle=j%2?'#ffd45a':'#ff6a3d';q.beginPath();q.arc(x+Math.cos(j*1.6)*k*18,ys+Math.sin(j*1.6)*k*18,10+k*22,0,7);q.fill();q.restore()}tx(q,'BỊ PHÁ HỦY',x,ys+4,'#ff6a78',12,'center')}
        const bx=x-bw/2,by=ys-48,tot=bw*s.max/scale;
        q.fillStyle='#000b';q.fillRect(bx,by,bw,10);
        const base=Math.min(s.hp,o.hA),fr=base/o.hA,bc=fr>.5?'#54d37a':fr>.25?'#ffc53d':'#ff4d5e';
        q.fillStyle=bc;q.fillRect(bx,by,bw*base/scale,10);
        if(s.hp>o.hA){q.fillStyle='#4aa8ff';q.fillRect(bx+bw*o.hA/scale,by,bw*(s.hp-o.hA)/scale,10)}
        q.strokeStyle='#fff7';q.lineWidth=1;q.strokeRect(bx+.5,by+.5,tot-1,9);
        tx(q,NF(s.hp)+' / '+NF(s.max),x,by-4,'#fff',10,'center')});
      tx(q,o.footer(t),W/2,H-10,'#8fa6d8',11,'center')}};
  return sc}

function sceneArm(it,c){
  const m=it.it,qa=arAt(m),A=stats(c,null,c.A0),B=stats(c,null,c.A0.concat([{id:m.id}])),hA=Math.max(1,A.hp),hB=Math.max(hA,B.hp),dps=hA/6,P1=8,LAP=10;
  const RG=(B.reg||0)>0,d=sceneDuel({hA,hB,regA:A.reg||0,regB:B.reg||0,dlyA:A.dly||5,dlyB:B.dly||5,dps,tFire:P1,lapseAt:RG?P1+.6:null,lapse:LAP,T:P1+.6+(RG?6:1.4),labels:['TÀU HIỆN TẠI','CÓ KHIÊN NÀY'],
    footer:t=>t<P1+.6||!RG?'Địch bắn liên tục cùng một loạt đạn vào cả hai tàu':'⏩ Tua nhanh ×'+LAP+': tàu tự hồi phục khi hết bị bắn'},c);
  d.result=()=>{const tA=hA/dps,tB=hB/dps,s=d.S[1],pc=Math.round(Math.max(0,(hB-dps*P1))/hB*100),rB=B.reg||0,dly=B.dly||5;
    return {hd:'Chịu thêm '+NF(hB-hA)+' sát thương (+'+PCT(hB,hA)+'% máu) · sống thêm '+N1(tB-tA)+' giây dưới hỏa lực',
      rows:[['Máu tối đa',NF(hA)+' → '+NF(hB),'up'],['Tàu hiện tại dưới loạt đạn','bị hạ sau '+N1(tA)+' s'],
        ['Khi có khiên này',tB<=P1?'bị hạ sau '+N1(tB)+' s (+'+N1(tB-tA)+' s)':'còn '+pc+'% máu sau '+P1+' s (trụ được '+N1(tB)+' s)','up'],
        ['Hồi phục',rB>0?N1(rB)+' máu/giây, sau '+N1(dly)+' s không bị bắn':'Khiên không tự hồi máu',rB>0?'up':''],['Tốc chạy · quay đầu',N1(A.speed)+' · '+N1(A.turn)+' → '+N1(B.speed)+' · '+N1(B.turn)+' điểm',B.speed<A.speed?'dn':''],
        ['Máu cuối mô phỏng',s.dead?'Bị phá hủy':NF(s.hp)+' / '+NF(s.max)],['Khối lượng tàu',NF(A.mass)+' → '+NF(B.mass),B.mass>A.mass?'dn':'']],
      nt:'Tính trên tàu đang chọn trong Kho ('+(c.sh&&c.sh.n||'tàu mẫu')+') có thêm khiên này; địch bắn một loạt đạn đủ hạ tàu hiện tại sau 6 giây. Khiên cộng thẳng vào máu tàu (phần xanh) và bị tiêu hao cuối cùng.'}};
  return d}

/* ---------- 3) KỸ NĂNG (modul): mỗi loại một cảnh mô phỏng riêng ---------- */
function sceneSkl(it,c){
  const m=it.it,q=sAt(m),ref=stats(c),Hm=Math.max(1,ref.hp),Em=Math.max(.5,ref.enMax||1),tc=1.5,dur=q.dur>0?q.dur:5;
  const meta=[['Hồi chiêu',N1(q.cd)+' giây'],['Năng lượng mỗi lần dùng',q.ec>0?N1(q.ec):'Không tốn']];
  const hud=(g,W,hp,en)=>{const w=Math.min(190,W*.42);tx(g,'MÁU',12,22,'#ff9aa6',9);barD(g,48,13,w,10,hp/Hm,'#ff5a6a');tx(g,NF(hp)+'/'+NF(Hm),52+w,22,'#fff',9);
    tx(g,'NL',12,40,'#8ff0b8',9);barD(g,48,31,w,10,en/Em,'#34e08a');tx(g,N1(en)+'/'+N1(Em),52+w,40,'#fff',9)};
  const icon=(g,W,act)=>{const im=dimg(it.img);g.save();if(act){g.shadowColor='#ffd45a';g.shadowBlur=18}if(im&&im.complete&&im.naturalWidth){const s=40,r=im.naturalWidth/im.naturalHeight;g.drawImage(im,W-s*r-12,10,s*r,s)}g.restore()};
  const kind=m.t;
  if(kind==='heal'||kind==='nrg'){const isH=kind==='heal',mx=isH?Hm:Em;let v=mx*(isH?.3:.1),to=null,cast=false,v0=v,fx=[],fl=[];
    return {T:5,step(dt,t){if(!cast&&t>=tc){cast=true;to=Math.min(mx,v+mx*q.pw/100);fx.push({t:0,max:.9});fl.push({t:0,max:1.1,s:'+'+N1(to-v0)+(isH?' máu':' NL'),col:isH?'#7dffb0':'#8ff0b8',sz:15})}
        if(cast)v+=(to-v)*Math.min(1,dt*5);fx.forEach(f=>f.t+=dt);fl.forEach(f=>f.t+=dt)},
      draw(g,W,H,t){bgd(g,W,H);const cx=W/2,cy=H*.58;spr(g,c.sh,cx,cy,84);
        fx.forEach(f=>{const k=f.t/f.max;if(k<1)ringD(g,cx,cy,14+k*70,isH?'#7dffb0':'#8ff0b8',1-k,3)});
        if(cast&&t<tc+1.4)for(let i=0;i<8;i++){const a=i*.8+t*2,r=30+((t*40+i*9)%40);g.fillStyle=isH?'#7dffb0':'#8ff0b8';g.globalAlpha=.7;g.fillRect(cx+Math.cos(a)*r-2,cy-((t-tc)*36+i*6)%60+10,4,4);g.globalAlpha=1}
        floatTx(g,fl.map(f=>({...f,x:cx,y:cy-46})));hud(g,W,isH?v:Hm*.9,isH?Em*.8:v);icon(g,W,cast&&t<tc+1.2);
        tx(g,t<tc?(isH?'Tàu đang bị thương nặng…':'Năng lượng đang cạn…'):'Đã dùng kỹ năng!',W/2,H-10,'#8fa6d8',11,'center')},
      result(){const g=to-v0;return {hd:isH?'Hồi '+N1(g)+' máu ('+N1(q.pw)+'% máu tối đa) ngay lập tức':'Nạp '+N1(g)+' năng lượng ('+N1(q.pw)+'% năng lượng tối đa) ngay lập tức',
          rows:[[isH?'Máu':'Năng lượng',N1(v0)+' → '+N1(to)+' / '+N1(mx),'up'],['Sức mạnh',N1(q.pw)+'% '+(isH?'máu':'năng lượng')+' tối đa'],isH?['Hồi trung bình nếu dùng liên tục',N1(g/Math.max(1,q.cd))+' máu/giây']:['Nạp thêm mỗi lần dùng','+'+N1(g)+' NL']].concat(meta,[['Khối lượng',NF(m.mass)]]),
          nt:'Tính trên tàu đang chọn trong Kho ('+(c.sh&&c.sh.n||'tàu mẫu')+'): máu tối đa '+NF(Hm)+', năng lượng tối đa '+N1(Em)+'. Cảnh mô phỏng cho tàu bắt đầu ở mức '+(isH?'30% máu':'10% năng lượng')+'.'}}}}
  if(kind==='surge'){const base=10,fire=.5,T=tc+dur+2,pw=q.pw;let acc=.2,tot0=0,tot1=0,nb=0,ns=0,bul=[],fl=[],on=false;
    return {T,step(dt,t){on=t>=tc&&t<tc+dur;acc+=dt;while(acc>=fire&&t<T-.6){acc-=fire;const d=on?base*(1+pw/100):base;bul.push({p:0,d,on});tot0+=base;tot1+=d;ns++;if(on)nb++}
        bul.forEach(b=>b.p+=dt/.3);bul=bul.filter(b=>{if(b.p<1)return true;fl.push({t:0,max:.7,s:N1(b.d),col:b.on?'#ffd45a':'#fff',sz:b.on?14:11,x:0,y:0});return false});fl.forEach(f=>f.t+=dt);fl=fl.filter(f=>f.t<f.max)},
      draw(g,W,H,t){bgd(g,W,H);const cx=W/2,cy=H-70,ty=92;enemyMk(g,cx,ty,42,'#c22a3c',fl.length&&fl[fl.length-1].t<.08);tx(g,'MỤC TIÊU GIẢ',cx,ty-30,'#ff9aa6',9,'center');
        if(on){g.save();g.globalAlpha=.25+.1*Math.sin(t*14);g.fillStyle='#ffb36b';g.beginPath();g.arc(cx,cy,48,0,7);g.fill();g.restore();ringD(g,cx,cy,44,'#ffb36b',.9,3)}
        spr(g,c.sh,cx,cy,70);bul.forEach(b=>{const y=cy-30-(cy-30-ty-18)*b.p;g.fillStyle=b.on?'#ffd45a':'#fff';g.beginPath();g.arc(cx,y,b.on?5:3.5,0,7);g.fill()});
        floatTx(g,fl.map(f=>({...f,x:cx+((f.t*53)%1-.5)*40,y:ty+12})));
        hud(g,W,Hm,Em);icon(g,W,on);
        tx(g,'TỔNG SÁT THƯƠNG',12,H-58,'#6f8fd0',9,'left');tx(g,'Không dùng: '+N1(tot0),12,H-42,'#cfd8ee',11,'left');tx(g,'Dùng kỹ năng: '+N1(tot1),12,H-27,'#ffd45a',12,'left');
        tx(g,on?'⚡ TĂNG SÁT THƯƠNG +'+N1(pw)+'% (còn '+N1(Math.max(0,tc+dur-t))+' s)':(t<tc?'Bắn bình thường…':'Hết hiệu lực'),W/2,H-8,on?'#ffd45a':'#8fa6d8',11,'center')},
      result(){return {hd:'Tăng +'+N1(pw)+'% sát thương trong '+N1(dur)+' giây · tổng sát thương +'+PCT(tot1,tot0)+'% trong '+N1(T-.6)+' giây',
          rows:[['Sát thương mỗi phát',N1(base)+' → '+N1(base*(1+pw/100))+' khi bật','up'],['Số phát trong lúc bật',String(nb)],['Tổng sát thương',N1(tot0)+' → '+N1(tot1),'up'],['Thời gian hiệu lực',N1(dur)+' giây']].concat(meta,[['Khối lượng',NF(m.mass)]]),
          nt:'Mô phỏng với vũ khí mẫu 2 phát/giây, 10 sát thương/phát, bắn vào mục tiêu giả đứng yên. Thực tế bonus nhân lên sát thương của mọi vũ khí trên tàu.'}}}}
  if(kind==='boost'){const SD=(window.C25&&C25.SP_DIV)||12,vt=Math.max(.5,ref.speed/SD),ac=ref.acc||0,pw=q.pw,T=tc+dur+2.5;
    const run=bf=>{let v=0,d=0,t=0;while(t<T){const w=vt*((bf&&t>=tc&&t<tc+dur)?1+pw/100:1);v+=(w-v)*Math.min(1,3*(1+ac/100)*.02);d+=v*.02;t+=.02}return d};
    const dA=run(false),dB=run(true),Lg=Math.max(4,dB*1.08),sA={v:0,d:0},sB={v:0,d:0};
    return {T,step(dt,t){[sA,sB].forEach((s,i)=>{const w=vt*((i&&t>=tc&&t<tc+dur)?1+pw/100:1);s.v+=(w-s.v)*Math.min(1,3*(1+ac/100)*dt);s.d+=s.v*dt})},
      draw(g,W,H,t){bgd(g,W,H);const y0=H-44,y1=34,pu=(y0-y1)/Lg,lx=[W*.28,W*.72],lw=Math.min(W*.34,170),on=t>=tc&&t<tc+dur,step=Lg>20?5:2;
        lx.forEach(x=>{g.fillStyle='rgba(30,60,140,.22)';g.fillRect(x-lw/2,y1-20,lw,y0-y1+54)});
        for(let i=0;i<=Lg;i+=step){const y=y0-i*pu;g.strokeStyle='rgba(143,180,255,.22)';g.beginPath();g.moveTo(6,y);g.lineTo(W-6,y);g.stroke();tx(g,i+' ô',8,y-3,'#6f8fd0',9)}
        [sA,sB].forEach((s,i)=>{const x=lx[i],y=y0-s.d*pu;tx(g,i?'DÙNG KỸ NĂNG':'KHÔNG DÙNG',x,14,i?'#ffd45a':'#9fb4d8',10,'center');
          const boost=i&&on;flame(g,x,y+24,12+(boost?60:26)*Math.min(1,s.v/Math.max(.5,vt)),boost?20:14,boost?'#7fd8ff':'#ffd45a');
          if(boost)ringD(g,x,y,40+Math.sin(t*16)*3,'#7fd8ff',.7,3);spr(g,c.sh,x,y,50);tx(g,N1(s.v*SD)+' điểm',x,Math.min(H-8,y+46),i?'#ffd45a':'#cfd8ee',11,'center')});
        icon(g,W,on);tx(g,on?'🚀 TĂNG TỐC +'+N1(pw)+'% (còn '+N1(Math.max(0,tc+dur-t))+' s)':(t<tc?'Chạy bình thường…':'Hết hiệu lực'),W/2,H-8,on?'#ffd45a':'#8fa6d8',11,'center')},
      result(){return {hd:'Tăng +'+N1(pw)+'% tốc chạy trong '+N1(dur)+' giây · đi xa hơn +'+PCT(dB,dA)+'% trong '+N1(T)+' giây',
          rows:[['Tốc chạy khi bật',N1(ref.speed)+' → '+N1(ref.speed*(1+pw/100))+' điểm','up'],['Quãng đường '+N1(T)+' giây',N1(dA)+' → '+N1(dB)+' ô','up'],['Thời gian hiệu lực',N1(dur)+' giây']].concat(meta,[['Khối lượng',NF(m.mass)]]),
          nt:'Tính trên tàu đang chọn trong Kho ('+(c.sh&&c.sh.n||'tàu mẫu')+'), tốc chạy hiện tại '+N1(ref.speed)+' điểm.'}}}}
  if(kind==='shield'){const pw=q.pw,T=tc+dur+2,dps=Hm/6;
    const d=sceneDuel({hA:Hm,hB:Hm,regA:0,regB:0,dlyA:5,dlyB:5,dps,tFire:T-.7,T,sh:{t:tc,d:dur,pw},labels:['KHÔNG DÙNG','DÙNG CHẮN NĂNG LƯỢNG'],
      footer:t=>t<tc?'Địch đang bắn cả hai tàu…':(t<tc+dur?'🛡 CHẮN BẬT: giảm '+N1(pw)+'% sát thương nhận (còn '+N1(Math.max(0,tc+dur-t))+' s)':'Chắn hết hiệu lực')},c);
    d.result=()=>{const a=d.S[0],b=d.S[1],pa=a.dead?0:Math.round(a.hp/Hm*100),pb=b.dead?0:Math.round(b.hp/Hm*100);
      return {hd:'Giảm '+N1(pw)+'% sát thương nhận trong '+N1(dur)+' giây · chặn được '+NF(b.blk)+' sát thương',
        rows:[['Sát thương chặn được',NF(b.blk),'up'],['Giảm sát thương',N1(pw)+'% trong '+N1(dur)+' giây'],['Máu còn lại sau '+N1(T)+' giây','Không dùng: '+(a.dead?'bị hạ':pa+'%')+' · Dùng: '+(b.dead?'bị hạ':pb+'%'),pb>pa?'up':'']].concat(meta,[['Khối lượng',NF(m.mass)]]),
        nt:'Hai tàu mẫu cùng máu '+NF(Hm)+' (lấy từ tàu đang chọn) bị bắn cùng loạt đạn đủ hạ tàu không chắn sau 6 giây.'}};
    return d}
  /* emp */
  {const R=7,E=[[2.5,.4],[4,2.3],[5.4,4],[6.6,5.4],[8.6,1.2]],eMax=Hm*3,dmg=Math.max(eMax*.2,Hm*q.pw/100*2),T=5;
    const en=E.map(e=>({d:e[0],a:e[1],hp:eMax,to:eMax,inR:e[0]<=R,hit:false,flash:0}));let cast=false,tw=0,fl=[];
    return {T,step(dt,t){if(!cast&&t>=tc){cast=true;tw=0}
        if(cast){tw+=dt;const wr=tw/.7*R;en.forEach(e=>{if(e.inR&&!e.hit&&wr>=e.d){e.hit=true;e.to=Math.max(0,eMax-dmg);e.flash=.3;fl.push({t:0,max:.9,s:'-'+NF(dmg),col:'#ff9aa6',sz:13,e})}})}
        en.forEach(e=>{e.hp+=(e.to-e.hp)*Math.min(1,dt*8);e.flash=Math.max(0,e.flash-dt)});fl.forEach(f=>f.t+=dt)},
      draw(g,W,H,t){bgd(g,W,H);const cx=W/2,cy=H/2+8,u=Math.min(W/2-22,(H-54)/2)/9.4;
        g.save();g.setLineDash([5,5]);g.strokeStyle='rgba(143,180,255,.5)';g.beginPath();g.arc(cx,cy,R*u,0,7);g.stroke();g.restore();tx(g,'Tầm '+R+' ô',cx,cy-R*u-4,'#8fb4ff',10,'center');
        if(cast&&tw<.9){const k=Math.min(1,tw/.7);ringD(g,cx,cy,k*R*u,'#9fe3ff',1-tw/.9,5);ringD(g,cx,cy,k*R*u*.8,'#fff',.6*(1-tw/.9),2)}
        en.forEach(e=>{const x=cx+Math.cos(e.a)*e.d*u,y=cy+Math.sin(e.a)*e.d*u;enemyMk(g,x,y,26,e.inR?'#c22a3c':'#6b3a46',e.flash>0);
          barD(g,x-18,y+20,36,5,e.hp/eMax,e.inR?'#ff5a6a':'#8a6a70');if(!e.inR)tx(g,'ngoài tầm',x,y-18,'#8a9ac0',9,'center')});
        spr(g,c.sh,cx,cy,56);floatTx(g,fl.map(f=>({...f,x:cx+Math.cos(f.e.a)*f.e.d*u,y:cy+Math.sin(f.e.a)*f.e.d*u-12})));
        hud(g,W,Hm,Em);icon(g,W,cast&&t<tc+.8);tx(g,cast?'💥 Xung điện từ nổ quanh tàu!':'Tàu địch đang áp sát…',W/2,H-8,'#8fa6d8',11,'center')},
      result(){const n=en.filter(e=>e.hit).length;return {hd:'Trúng '+n+'/'+en.length+' tàu địch trong '+R+' ô · mỗi tàu mất '+NF(dmg)+' máu ('+Math.round(dmg/eMax*100)+'% máu tối đa)',
          rows:[['Tàu địch bị trúng',n+' / '+en.length+' (trong tầm '+R+' ô)','up'],['Sát thương mỗi tàu',NF(dmg)+' (≈'+Math.round(dmg/eMax*100)+'% máu tối đa)','up'],['Sức mạnh',N1(q.pw)+'% máu tàu bạn × 2 = '+NF(Hm*q.pw/100*2)]].concat(meta,[['Khối lượng',NF(m.mass)]]),
          nt:'Sát thương mỗi tàu = số lớn hơn giữa 20% máu tối đa của tàu địch (4% với trùm) và 2 × '+N1(q.pw)+'% máu tàu bạn. Tàu địch mẫu có máu '+NF(eMax)+' (= 3 × máu tàu bạn).'}}}}
}

/* ---------- Cửa sổ mô phỏng dùng chung ---------- */
let cur=null;
function closeSim(){if(!cur)return;cancelAnimationFrame(cur.raf);cur.el.remove();cur=null}
function custom(it,spec){
  closeSim();try{WPV.close()}catch(_){}
  const c=refCtx(),m=it.it,el=document.createElement('div');el.className='c23o';
  el.innerHTML=`<div><div class="wh"><img src="${it.img}" alt=""><div><h3>${it.n}</h3>${spec.tags.map(t=>`<span class="wt">${t}</span>`).join(' ')}</div></div>
  <div class="ws" style="grid-template-columns:repeat(${spec.stats.length},1fr)">${spec.stats.map(s=>`<div><small>${s[0]}</small><b>${s[1]}</b></div>`).join('')}</div>
  <div class="wd">${m.d||''}</div><canvas></canvas><div class="c23pg"><i></i></div>
  <div class="wb"><button class="c23go" data-c="r">🔁 Chạy lại</button><button data-c="s">Chậm ×0.5</button><button data-c="x">Đóng</button><small>${spec.hint}</small></div>
  ${resHtml()}${buyHtml(it)}</div>`;
  document.body.appendChild(el);
  const cv=el.querySelector('canvas'),g=cv.getContext('2d'),Wp=Math.max(260,cv.clientWidth||360),Hp=Math.min(300,Math.max(240,innerHeight-420)),dpr=Math.min(2,devicePixelRatio||1);
  cv.width=Wp*dpr;cv.height=Hp*dpr;cv.style.aspectRatio=Wp+'/'+Hp;
  const sc=spec.scene(c),S1={el,raf:0,speed:1,t:0,done:false,sc};cur=S1;
  const pg=el.querySelector('.c23pg i');let last=performance.now();
  const finish=()=>{if(S1.done)return;S1.done=true;let r;try{r=sc.result()}catch(e){console.error(e);r={hd:'Không tính được kết quả',rows:[],nt:''}}S1.res=r;fillRes(el,r)};
  const loop=now=>{if(cur!==S1)return;const dt=Math.min(.05,(now-last)/1000)*S1.speed;last=now;
    if(!S1.done){let r=dt;while(r>0&&!S1.done){const h=Math.min(.02,r);S1.t+=h;sc.step(h,S1.t);r-=h;if(S1.t>=sc.T||(sc.isDone&&sc.isDone()))finish()}}
    g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,Wp,Hp);try{sc.draw(g,Wp,Hp,S1.t)}catch(e){console.error(e)}
    pg.style.width=Math.min(100,S1.t/sc.T*100)+'%';S1.raf=requestAnimationFrame(loop)};
  el.onclick=e=>{if(e.target===el){closeSim();return}const b=e.target.closest('button[data-c]');if(!b)return;
    if(b.dataset.c==='x')closeSim();else if(b.dataset.c==='r'){custom(it,spec)}
    else if(b.dataset.c==='s'){S1.speed=S1.speed===1?.5:1;b.textContent=S1.speed===1?'Chậm ×0.5':'Bình thường ×1'}};
  S1.raf=requestAnimationFrame(loop);return S1}
const SPEC={
  eng:(it)=>{const q=enAt(it.it);return {tags:['MODUL TỐC CHẠY','Cấp '+q.l,it.it.w+'×'+it.it.h+' ô'],
    stats:[['TỐC CHẠY','+'+N1(q.sp)],['GIA TỐC','+'+N1(q.acc)+'%'],['NĂNG LƯỢNG','cần '+q.en],['KHỐI LƯỢNG',it.it.mass]],hint:'Đua 10 ô: tàu hiện tại và tàu đã lắp động cơ này',scene:c=>sceneEng(it,c)}},
  arm:(it)=>{const q=arAt(it.it);return {tags:['KHIÊN','Cấp '+q.l,it.it.w+'×'+it.it.h+' ô'],
    stats:[['MÁU THÊM',NF(q.dur)],['KHỐI LƯỢNG',it.it.mass]],hint:'Hai tàu chịu cùng một loạt đạn',scene:c=>sceneArm(it,c)}},
  skl:(it)=>{const q=sAt(it.it);return {tags:[SKN[it.it.t]||'KỸ NĂNG','Cấp '+q.l,it.it.w+'×'+it.it.h+' ô'],
    stats:[['SỨC MẠNH',N1(q.pw)+'%'],['THỜI GIAN',q.dur?N1(q.dur)+'s':'Tức thì'],['HỒI CHIÊU',N1(q.cd)+'s'],['NĂNG LƯỢNG',N1(q.ec)],['KHỐI LƯỢNG',it.it.mass]],hint:'Tự động dùng kỹ năng ở giây thứ 1,5',scene:c=>sceneSkl(it,c)}}
};
function openSim(id){const it=stList().find(x=>x.id===id);if(!it||!it.it)return;const m=it.it;
  try{if(m.eng)return custom(it,SPEC.eng(it));if(m.armor)return custom(it,SPEC.arm(it));if(m.skl)return custom(it,SPEC.skl(it));return weapon(it)}
  catch(e){console.error(e);try{toast('Không mở được mô phỏng')}catch(_){}}}
window.C23={openSim,closeSim,state:()=>cur,sceneEng,sceneArm,sceneSkl,sceneDuel,refCtx,stats};
})();
