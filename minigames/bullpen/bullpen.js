/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 불펜장 첫 화면 =================
   GAMES에 게임을 적으면 목록에 나와요. ready:true면 '마운드 위'(바로 하기), 아니면 '등판 대기 중'(준비 중). */
var GAMES=[
  {no:1,title:'등번호 매치',desc:'등번호 카드와 이름 카드를 짝지어 랜더스 카드를 모아요',href:'number-match.html',ready:true,
   meta:function(){return '카드 앨범 '+LOCKER.cardCount()+' / '+ROSTER.length}},
  {no:2,title:'홈런볼 모으기',desc:'외야석에서 2026 시즌 랜더스 홈런볼을 순서대로 잡아요',href:'homerun.html',ready:true,
   meta:function(){return '공박스 '+LOCKER.ballCount()+' / '+HR_TOTAL}}
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
  document.getElementById('lockerMeta').textContent='카드 앨범 '+LOCKER.cardCount()+'/'+ROSTER.length+', 공박스 '+LOCKER.ballCount()+'/'+HR_TOTAL;
}
document.getElementById('exit').onclick=mgExit;
bpRender();
/* 게임에서 돌아왔을 때 숫자 다시 */
window.addEventListener('pageshow',bpRender);
