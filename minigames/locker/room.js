/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 라커룸 누르기·새로고침 (2026-11-05, 패치 Y) =================
   누르면 이름표(예: 카드 앨범 · 84 / 84장) → 같은 곳을 한 번 더 누르면 열려요(로비와 같은 방식).
   열린다 = 주소 끝을 #cards / #balls / #tickets 로 바꾸기(locker.js 가 화면을 바꿔요). 찬장·라커 안 빈 곳은 눌러도 반응 없음.
   roomState() — 보여 줄 값: 이름·번호는 입장 준비에서 정한 값(야구장과 같은 브라우저 저장 'munhak:backName'·'munhak:backNum').
     입장 준비를 안 했으면 번호는 'V6', 이름은 번호판에만 '으쓱이'(유니폼 등판엔 이름 없음).
     ※ 유니폼 색은 저장되지 않아서 흰 홈 유니폼으로 고정이에요.
   처음 들어오면 누를 수 있는 곳 귀퉁이에서 ✦ 가 두 번 반짝여요(ROOM.glinted, 페이지를 새로 열면 다시).
   roomRefresh() — 장면을 다시 그림(locker.js 의 lkRender 가 첫 화면일 때 불러요). */
var ROOM={armed:null,timer:0,glinted:false};
function roomSaved(k){try{var v=localStorage.getItem('munhak:'+k);return v==null?'':String(JSON.parse(v)||'')}catch(e){return ''}}
function roomState(){
  return {name:roomSaved('backName').slice(0,8),num:roomSaved('backNum').replace(/\D/g,'').slice(0,2)||'V6',/* 번호를 안 정했으면 V6 */
    perfect:LOCKER.perfectCount(),tickets:LOCKER.ticketCount(),cards:LOCKER.cardCount(),balls:LOCKER.ballCount()};
}
function roomTagText(go,st){
  if(go==='cards')return '카드 앨범 · '+st.cards+' / '+ROSTER.length+'장';
  if(go==='tickets')return '티켓북 · '+st.tickets+' / '+TICKETS.length+'장';
  if(go==='balls')return st.perfect>0&&ROOM.armedEl&&ROOM.armedEl.getAttribute('aria-label').indexOf('금 글러브')===0?'금 글러브 · 퍼펙트 '+st.perfect+'회':'공박스 · '+st.balls+' / '+HR_TOTAL+'개';
  return '';
}
function roomHideTag(){clearTimeout(ROOM.timer);ROOM.armed=null;ROOM.armedEl=null;var t=document.getElementById('roomTag');if(t)t.classList.remove('on')}
function roomShowTag(el,text){
  var host=document.getElementById('roomScene'),t=document.getElementById('roomTag'),hr=host.getBoundingClientRect(),er=el.getBoundingClientRect();
  t.textContent=text;t.classList.add('on');
  var x=er.left-hr.left+er.width/2,w=t.offsetWidth/2+6;
  x=Math.max(w,Math.min(hr.width-w,x));
  var below=er.top-hr.top<110;/* 위쪽 번호판을 안 가리게: 위가 좁으면 아래에 */
  t.classList.toggle('below',below);
  t.style.left=x+'px';t.style.top=(below?er.bottom-hr.top:er.top-hr.top)+'px';
}
function roomTap(el){
  var go=el.getAttribute('data-go');
  if(ROOM.armedEl===el){roomHideTag();location.hash='#'+go;return}
  roomHideTag();ROOM.armed=go;ROOM.armedEl=el;
  el.classList.remove('pop');void el.getBoundingClientRect();el.classList.add('pop');
  roomShowTag(el,roomTagText(go,roomState()));
  ROOM.timer=setTimeout(roomHideTag,3400);
}
function roomRefresh(){
  var host=document.getElementById('roomScene');if(!host)return;
  var st=roomState(),sig=JSON.stringify(st);
  if(sig===ROOM.sig&&host.querySelector('svg'))return;/* 값이 그대로면 다시 안 그려요(pageshow 로 한 번 더 불려도 반짝이 안 끊기게) */
  ROOM.sig=sig;roomHideTag();roomBuild(host,st,!ROOM.glinted);ROOM.glinted=true;/* ✦ 반짝은 페이지를 연 뒤 처음 한 번만 */
}
(function(){
  var host=document.getElementById('roomScene');if(!host)return;
  host.addEventListener('click',function(e){var el=e.target.closest('.hot');if(el&&host.contains(el))roomTap(el);else roomHideTag()});
  host.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var el=e.target.closest&&e.target.closest('.hot');if(el){e.preventDefault();roomTap(el)}});
  document.addEventListener('click',function(e){if(!host.contains(e.target))roomHideTag()});
})();
