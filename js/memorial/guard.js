/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/guard: 문을 열다 멈추면 알려 주기 (패치 AT) =================
   맨 먼저 불러요(three.js보다 앞). '문을 여는 중'에서 오류가 나거나 MH_GUARD.wait ms가 지나도 안 열리면
   계속 기다리게 두지 않고 '다시 열기' 버튼과 오류 내용을 보여 줘요. 문이 열리면(boot.js의 mhBoot 끝) MH_GUARD.done=true */
var MH_GUARD={done:false,wait:15000};
function mhGuardShow(msg,detail){
  var b=document.getElementById('boot');if(MH_GUARD.done||!b||b.classList.contains('out')||b.querySelector('.err'))return;
  var s=document.getElementById('bootMsg');if(s)s.textContent=msg;
  var d=b.querySelector('.dot');if(d)d.style.display='none';
  var e=document.createElement('div');e.className='err';e.textContent=detail||'';b.appendChild(e);
  var r=document.createElement('button');r.className='retry';r.type='button';r.textContent='다시 열기';
  r.onclick=function(){location.replace(location.pathname+'?r='+Date.now())};b.appendChild(r);
}
window.addEventListener('error',function(e){if(!e.message)return;mhGuardShow('문을 여는 중에 멈췄어요',e.message+' · '+String(e.filename||'').split('/').pop().split('?')[0]+':'+(e.lineno||''))});
window.addEventListener('unhandledrejection',function(e){var r=e.reason;mhGuardShow('문을 여는 중에 멈췄어요',String(r&&r.message||r))});
setTimeout(function(){mhGuardShow('문이 열리지 않아요','오래 기다려도 열리지 않았어요. 다시 열어 주세요.')},MH_GUARD.wait);
