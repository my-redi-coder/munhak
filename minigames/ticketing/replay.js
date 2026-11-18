/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 티켓팅 War: 다 모은 뒤에도 계속 (2026-11-18) =================
   65경기를 다 모으면 '티켓북 완성' 화면에서 멈추지 않고 계속 게임해요(등번호 매치처럼, 따로 부르는 이름·설명 없음).
   1) 따로 앉은 티켓이 남았으면 → 그중 하나를 자동으로 '연석으로 다시 예매'(같은 석 수, perfect.js와 같은 규칙)
   2) 전부 연석이면 → 65경기 중 아무 경기 + 석 수 랜덤. 티켓북은 바뀌지 않고, 콤보만 올라가요
      콤보 = 발권 성공 연속, 연석콤보 = 연석(같이 앉기) 성공 연속. 따로 앉으면 연석콤보만 0, 매진·결제 시간 초과면 둘 다 0
      지금 콤보는 들어와 있는 동안만 세요(저장 안 함). 최고 기록만 LOCKER.twBest에 저장
   game.js가 부르는 것: rpPick() rpWin(tog) rpLine() rpBreak() */
var RP={c:0,s:0,newBest:false};

function rpSplitAll(){var a=[];TICKETS.forEach(function(_,i){var o=LOCKER.ticket(i);if(o&&!o.tog&&o.n>1)a.push(i)});return a}
function rpPick(){var sp=rpSplitAll();
  if(sp.length){var i=sp[Math.floor(Math.random()*sp.length)];return {gi:i,goal:LOCKER.ticket(i).n,rebook:true,free:false}}
  return {gi:Math.floor(Math.random()*TICKETS.length),goal:zsGoal(),rebook:false,free:true}}
function rpWin(tog){RP.c++;RP.s=tog?RP.s+1:0;
  var b=LOCKER.twBest(),nb={c:Math.max(b.c,RP.c),s:Math.max(b.s,RP.s)};
  RP.newBest=nb.c>b.c||nb.s>b.s;if(RP.newBest)LOCKER.setTwBest(nb)}
/* 발권 화면 제목·멘트 아래 */
function rpLine(){var b=LOCKER.twBest();
  return '<div class="rp-combo'+(RP.newBest?' best':'')+'"><p class="now"><b>콤보 x'+RP.c+'</b><b class="s">연석콤보 x'+RP.s+'</b></p>'
   +'<p class="top">'+(RP.newBest?'최고 기록 경신 · ':'최고 ')+'콤보 x'+b.c+' · 연석콤보 x'+b.s+'</p></div>'}
/* 실패했을 때: 콤보가 끊겼다는 한 줄 (콤보가 있었을 때만) */
function rpBreak(){var c=RP.c,s=RP.s;RP.c=0;RP.s=0;RP.newBest=false;if(!c)return '';
  var b=LOCKER.twBest();
  return '<div class="rp-combo off"><p class="now">콤보 x'+c+(s?' · 연석콤보 x'+s:'')+'에서 끊겼어요</p><p class="top">최고 콤보 x'+b.c+' · 연석콤보 x'+b.s+'</p></div>'}
