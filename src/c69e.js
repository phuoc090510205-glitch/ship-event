  {const G=DG,quit=/Bỏ cuộc|đầu hàng/i.test(why||''),H=win?G.eh:G.hq,r1=rankNow(),p1=S.rpts||0,d0=G.c69d0||{da:S.da-da,sao:S.sao-sa};
   hud.style.display='none';
   const B='<button id="pvn" style="margin-top:10px">TIẾP TỤC</button>';
   const show3=()=>{const dDa=S.da-d0.da,dSa=S.sao-d0.sao;
     res.innerHTML=`<h1 style="color:#ffe08a;text-shadow:0 0 18px #ffb21a">TỔNG KẾT TRẬN ĐẤU</h1><div style="display:grid;grid-template-columns:auto auto;gap:6px 18px;font-size:clamp(13px,2.8vh,18px);text-align:left;margin:6px 0">
       <span>Kết quả</span><b style="color:${win?'#4cf59a':'#ff7a88'}">${win?'Chiến thắng':'Thất bại'}</b>
       <span>Đá nhận được</span><b style="color:#8fd8ff">${dDa>=0?'+':''}${dDa.toLocaleString('vi-VN')}</b>
       <span>Sao nhận được</span><b style="color:#ffd700">${dSa>=0?'+':''}${dSa.toLocaleString('vi-VN')}</b>
       <span>Tàu địch bị hạ</span><b>${G.kills||0}</b>
       <span>Thời gian</span><b>${Math.round(G.t-(G.pvT0||0))} giây</b></div><button id="pvok">VỀ SẢNH PvP</button>`;
     $('pvok').onclick=()=>{res.style.display='none';hud.style.display='none';busy=false;PVO=null;dfExit();lvTab('pvp')}};
   const show2=()=>{let h,c,sub,img='';try{img=PR['b'+Math.min(15,Math.max(1,r1))]||''}catch(e){}
     if(!rk){h='TRẬN GIAO HỮU';c='#bfe3ff';sub='Trận này không tính điểm hạng · Bậc '+r1+' · '+RN[r1-1]}
     else if(win&&r1>rk0){h='CHÚC MỪNG THĂNG HẠNG MỚI!';c='#4cf59a';sub='Bậc '+rk0+' · '+RN[rk0-1]+'  ➜  Bậc '+r1+' · '+RN[r1-1]}
     else if(win){h='CHÚC MỪNG! +1 ĐIỂM HẠNG';c='#4cf59a';sub='Bậc '+r1+' · '+RN[r1-1]+' · còn '+Math.max(0,4-p1)+' điểm nữa để thăng hạng'}
     else if(r1<rk0){h='GIÁNG HẠNG';c='#ff7a88';sub='Bậc '+rk0+' · '+RN[rk0-1]+'  ➜  Bậc '+r1+' · '+RN[r1-1]}
     else{h=p1<p0?'−1 ĐIỂM HẠNG':'GIỮ HẠNG';c='#ff9a8a';sub='Bậc '+r1+' · '+RN[r1-1]+(p1<p0?' · thua thêm '+(p1+1)+' trận sẽ bị giáng hạng':'')}
     const pips=rk?'<div style="display:flex;gap:6px;margin:6px 0">'+[0,1,2,3].map(i=>`<i style="width:22px;height:10px;border-radius:5px;background:${i<p1?'#4fd8ff':'#1b2a52'};box-shadow:${i<p1?'0 0 8px #4fd8ff':'none'}"></i>`).join('')+'</div>':'';
     const logo=img?`<div style="position:relative;margin:4px 0"><div style="position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(${c}66,transparent 70%);animation:c69g 1.6s ease-in-out infinite alternate"></div><img src="${img}" alt="" style="position:relative;width:clamp(96px,24vh,170px);height:auto;border-radius:16px;filter:drop-shadow(0 0 14px ${c});${(r1<rk0&&rk)?'filter:grayscale(.4) drop-shadow(0 0 10px '+c+');':''}animation:c69p .7s cubic-bezier(.2,1.6,.4,1)"></div>`:'';
     if(!document.getElementById('c69css')){const st=document.createElement('style');st.id='c69css';st.textContent='@keyframes c69p{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}@keyframes c69g{from{opacity:.4;transform:scale(.92)}to{opacity:1;transform:scale(1.08)}}';document.head.appendChild(st)}
     res.innerHTML=`${logo}<h1 style="color:${c};text-shadow:0 0 20px ${c};font-size:clamp(20px,5.5vh,44px)">${h}</h1><div style="font-size:clamp(14px,3vh,20px)">${sub}</div>${pips}${B}`;$('pvn').onclick=show3};
   const show1=()=>{res.style.display='flex';res.innerHTML=`<h1 class="${win?'w':'l'}">${win?'CHIẾN THẮNG':'THẤT BẠI'}</h1><div>${why||(win?'Trụ sở đối thủ đã bị phá hủy':'Trụ sở của bạn đã bị phá hủy')}</div>${B}`;$('pvn').onclick=show2};
   if(quit||!H||!window.R3D){setTimeout(show1,400)}
   else{const P=G.pl,fx0=P.x,fy0=P.y,tx=H.x,ty=H.y,cd0=R3D.cd;G.camF={x:fx0,y:fy0};let t=0,last=performance.now();const hp0=Math.max(1,(H.max||1)*.02);H.hp=hp0;H.dead=false;H.c69hold=1;
     try{toast(win?'Trụ sở đối thủ sụp đổ!':'Trụ sở của bạn bị phá hủy!')}catch(e){}
     const step=()=>{if(DG!==G)return;const now=performance.now(),rd=Math.max(0,(now-last)/1000),dt=Math.min(.05,rd);t+=Math.min(.2,rd);last=now;
       if(t<5){const k=t/5,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;G.camF.x=fx0+(tx-fx0)*e;G.camF.y=fy0+(ty-fy0)*e;R3D.cd=cd0+(14-cd0)*e}
       else{G.camF.x=tx;G.camF.y=ty;const u=Math.min(1,(t-5)/4),w=(H.w||4),h=(H.h||4);
         if(Math.random()<.35+u*.4)G.fx.push({x:tx+(Math.random()-.5)*w*1.3,y:ty+(Math.random()-.5)*h*1.3,r:.8+Math.random()*(1.2+2.5*u),t:.7,max:.7,ex:1,rot:Math.random()*6.28});
         R3D.shake=Math.max(R3D.shake||0,.12+u*.35);if(!G.c69big){H.flash=.12;H.hp=Math.max(.5,hp0*(1-u))}
         if(t>8.2&&!G.c69big){G.c69big=1;G.fx.push({x:tx,y:ty,r:Math.max(w,h)*2.6,t:1.3,max:1.3,ex:1,rot:0});H.hp=0;H.c69hold=0;if(H.sb||!H.hq)H.dead=true}}
       (G.fx||[]).forEach(f=>{f.t-=dt});G.fx=(G.fx||[]).filter(f=>f.t>0);try{dfDraw()}catch(e){}
       if(t<9.3)requestAnimationFrame(step);else{R3D.cd=cd0;show1()}};
     requestAnimationFrame(step)}}
}
