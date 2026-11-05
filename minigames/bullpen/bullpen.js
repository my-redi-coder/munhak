/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 불펜장 첫 화면 =================
   GAMES에 게임을 적으면 목록에 나와요. ready:true면 '마운드 위'(바로 하기), 아니면 '등판 대기 중'(준비 중). */
var GAMES=[
  {no:1,title:'등번호 매치',desc:'등번호 카드와 이름 카드를 짝지어 랜더스 카드를 모아요',href:'number-match.html',ready:true,
   meta:function(){return '카드 앨범 '+LOCKER.cardCount()+' / '+ROSTER.length}},
  {no:2,title:'홈런볼 모으기',desc:'외야석에서 2026 시즌 랜더스 홈런볼을 순서대로 잡아요',href:'homerun.html',ready:true,
   meta:function(){return '공박스 '+LOCKER.ballCount()+' / '+HR_TOTAL}},
  {no:3,title:'티켓팅 War',desc:'2026 시즌 이긴 경기 티켓을 모아 티켓북을 채워요',href:'ticketing.html',ready:true,
   meta:function(){return '티켓북 '+LOCKER.ticketCount()+' / '+TICKETS.length}}
];
function bpGameHTML(g){
  var inner='<span class="jno" aria-hidden="true">'+g.no+'</span><span><b>'+cardEsc(g.title)+'</b><span class="d">'+cardEsc(g.desc)+'</span>'
    +'<span class="meta"><small>'+cardEsc(g.meta())+'</small><span class="go">'+(g.ready?'등판하기':'준비 중')+'</span></span></span>';
  return g.ready?'<a class="game" href="'+g.href+'">'+inner+'</a>':'<div class="game wait" aria-disabled="true">'+inner+'</div>';
}
function bpRender(){
  document.getElementById('onMound').innerHTML=GAMES.filter(function(g){return g.ready}).map(bpGameHTML).join('');
  var w=GAMES.filter(function(g){return !g.ready});
  document.getElementById('waitList').innerHTML=w.map(bpGameHTML).join('');
  document.getElementById('waitSec').hidden=!w.length;
  document.getElementById('lockerMeta').textContent='카드 앨범 '+LOCKER.cardCount()+'/'+ROSTER.length+', 공박스 '+LOCKER.ballCount()+'/'+HR_TOTAL+', 티켓북 '+LOCKER.ticketCount()+'/'+TICKETS.length;
}
document.getElementById('exit').onclick=mgExit;
/* (2026-11-05 로비) 따로 열렸으면(로비에서 온 경우) 왼쪽 위 버튼은 '로비', 야구장 위 창이면 '야구장'(창 닫기).
   아래 '다른 곳으로' 줄에는 어느 쪽에서 열렸든 로비·야구장 둘 다 있어요 */
if(!mgInGame())document.getElementById('exitLbl').textContent='로비';
document.getElementById('goLobby').onclick=mgGoLobby;
document.getElementById('goStadium').onclick=mgGoStadium;
bpRender();
/* 게임에서 돌아왔을 때 숫자 다시 */
window.addEventListener('pageshow',bpRender);
