/* ===== c100: TRỤ SỞ 500 CẤP · thêm số lượng công trình (pháo/tháp 15 · mìn 30 · tường +1 mỗi 2 cấp · công trình khác 5) — số thực được dùng còn bị giới hạn theo diện tích các căn cứ (c107) ===== */
(function(){
const TUR=/pháo|tháp|cối|tên lửa|bệ phóng|súng|laser|đại bác|nỏ/i;
const base={};BLD.forEach(b=>{(base[b.t]=base[b.t]||[]).push(b)});
Object.keys(base).forEach(t=>{const L=base[t],b0=L[0];if(t==='hq'||t==='warp'||t==='shield'||t==='hangar'||t==='cm3'||t==='refine')return;
  let hls=[];
  if(t==='wall'){for(let l=102;l<=500;l+=2)hls.push(l)}
  else{const max=t==='mine'?30:((typeof BT!=='undefined'&&BT[t])||(b0.nb&&b0.nb.k==='tur')||TUR.test(b0.n||''))?15:5,k=max-L.length;for(let j=1;j<=k;j++)hls.push(100+Math.round(400*j/k))}
  hls.forEach((hl,j)=>{const n0=String(b0.n||'').replace(/\s\d+$/,''),i=L.length+j+1;BLD.push(Object.assign({},b0,{id:t+'_x'+(j+1),n:n0+' '+i,hl,pos:null}))})});
})();
