/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 야푸먹기: 테이블 위 입장권 → 티켓북 (2026-11-01) =================
   테이블 위 입장권을 누르면 그 자리에서 티켓북(minigames/locker.html#tickets)이 아래에서 올라와 펼쳐져요.
   불펜장으로 이동하지 않고, 닫으면 다시 테이블 앞. 티켓북 안의 '뒤로'·바깥 누르기·Esc로 닫혀요.
   티켓북은 같은 사이트의 라커 페이지를 ?embed 로 띄운 것이라, 모은 티켓 기록(localStorage)을 그대로 보여줘요.
   티켓북 맨 아래 '티켓팅 하러 가기'는 야푸먹기를 닫고 불펜장 창(js/ui/bullpen.js)에 티켓팅 War를 바로 열어요.
   반짝 힌트: 사이트를 연 뒤 테이블이 처음 보일 때 한 번, 입장권 귀퉁이에 작은 ✦ 빛이 두 번 반짝.
   food.js와 연결: fdTable()의 입장권 <g id="fdTicket">, openFood가 ticketBind(), closeFood·foodEsc가 ticketClose(). 모양은 styles/food-ticket.css */
var TKB={on:false,built:false,glinted:false};
var TKB_SRC='minigames/locker.html?embed=1';
function ticketBuild(){
  if(TKB.built)return;TKB.built=true;
  var o=document.createElement('div');o.id='tkbOv';o.className='tkb-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','티켓북');
  o.innerHTML='<div class="tkb-sheet"><iframe id="tkbFrame" title="티켓북"></iframe></div>';
  $('food').appendChild(o);
  o.addEventListener('click',function(e){if(e.target===o)ticketClose()});
  window.addEventListener('message',function(e){if(e.origin!==location.origin)return;
    if(e.data==='munhak:tkb-close')ticketClose();
    /* 티켓북 맨 아래 '티켓팅 하러 가기' → 야푸먹기를 닫고 불펜장 창에 티켓팅 War */
    else if(e.data==='munhak:tkb-ticketing'){ticketClose();closeFood();openBullpen('minigames/ticketing.html')}});
}
function ticketOpen(){
  if(TKB.on)return;ticketBuild();TKB.on=true;
  /* 열 때마다 새로 불러서 방금 모은 티켓까지 보이게 */
  $('tkbFrame').src=TKB_SRC+'&t='+Date.now()+'#tickets';
  var o=$('tkbOv');o.classList.add('on');if(typeof fdSnd==='function')fdSnd('rustle');
  setTimeout(function(){try{$('tkbFrame').focus()}catch(e){}},350);
}
function ticketClose(){
  if(!TKB.on)return;TKB.on=false;var o=$('tkbOv');o.classList.remove('on');
  setTimeout(function(){if(!TKB.on)$('tkbFrame').src='about:blank'},300);
  var t=$('fdTicket');if(t)t.focus();
}
/* 입장권 귀퉁이 반짝 (사이트 열고 한 번만) */
function ticketGlint(){
  if(TKB.glinted)return;TKB.glinted=true;
  setTimeout(function(){var t=$('fdTicket');if(!t||!FOOD.open)return;
    var g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','fd-glint');g.setAttribute('aria-hidden','true');
    g.setAttribute('transform','translate(47 -24)');
    g.innerHTML='<path d="M0-9Q0 0 9 0Q0 0 0 9Q0 0-9 0Q0 0 0-9Z" fill="#fff"/><circle r="2.2" fill="#fff"/>';
    t.appendChild(g);setTimeout(function(){g.remove()},2200);
  },700);
}
function ticketBind(){var t=$('fdTicket');if(!t)return;fdBind(t,ticketOpen);ticketGlint()}
