/* ===== c63: boss làm tàu phụ hộ tống chiếm 7 vị trí (6 khi boss đạt cấp 100) trong số vị trí hộ tống (tối đa 101) ===== */
(function(){
const cost=id=>{try{return id&&shBk(id)?(aLv(id)>=100?6:7):1}catch(e){return 1}};
function plan(){const C=fuN(),F=flS();let used=0;const idx=[],bad=new Set();
  for(let i=0;used<C&&i<600;i++){const e=F.e[i]||{};let c=cost(e.s);if(used+c>C){bad.add(i);c=1}idx.push(i);used+=c}
  let real=0;idx.forEach(i=>{const e=F.e[i]||{};if(!bad.has(i)&&e.s)real+=cost(e.s)});return {idx,bad,used:Math.min(C,real),C}}
function fit(id,i){const F=flS(),e=F.e[i]||(F.e[i]={}),old=e.s;e.s=id;const p=plan();e.s=old;return p.idx.includes(i)&&!p.bad.has(i)}
window.C63={cost,plan,fit};
fuIdx=function(){return plan().idx};
{const _fr=flReady;flReady=function(i){if(plan().bad.has(i))return false;return _fr(i)}}
})();
