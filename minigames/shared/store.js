/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 내 라커 (수집품 보관) =================
   불펜장 게임들이 모은 것을 이 기기 브라우저에 보관해요(localStorage). 모든 미니게임이 같이 써요.
   cards: 등번호 매치로 모은 선수 등번호 목록
   balls: 홈런볼 모으기로 잡은 공 번호(HR 순서, 0부터) / nice: 나이스 캐치 누적 / seen: 본 장면(ground 그라운드 홈런, allstar 올스타 브레이크)
   tickets: 티켓팅 War로 모은 승리 티켓 {TICKETS 번호: {n 매수, tog 같이 앉음, seat 자리, blk 구역}} (묶음 B, 2026-11-01)
   perfect: 홈런볼 모으기 퍼펙트 판 횟수 = 금 글러브 수 (2026-11-01 추가. 예전 기록엔 없어서 0부터)
   ※ 저장 칸 이름(KEY)과 항목 모양은 바꾸지 않기 — 바꾸면 다들 모은 기록이 안 보여요. 꼭 바꿔야 하면 옛 기록을 옮기는 코드를 같이 넣어요 */
var LOCKER=(function(){
  var KEY='munhak-locker-v1',d={cards:[],cardsDone:false,balls:[],nice:0,seen:{},tickets:{}};
  try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);for(var k in o)d[k]=o[k]}}catch(e){}
  if(!d.seen)d.seen={};if(!d.tickets)d.tickets={};if(!d.perfect)d.perfect=0;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
  return {
    hasCard:function(no){return d.cards.indexOf(no)>=0},
    addCard:function(no){if(d.cards.indexOf(no)>=0)return false;d.cards.push(no);save();return true},
    cardCount:function(){return d.cards.length},
    cardsDone:function(){return !!d.cardsDone},
    setCardsDone:function(v){d.cardsDone=!!v;save()},
    setCards:function(list){d.cards=list.slice();save()},
    resetCards:function(){d.cards=[];d.cardsDone=false;save()},
    hasBall:function(i){return d.balls.indexOf(i)>=0},
    addBall:function(i){if(d.balls.indexOf(i)>=0)return false;d.balls.push(i);save();return true},
    ballCount:function(){return d.balls.length},
    setBalls:function(list){d.balls=list.slice();save()},
    addNice:function(){d.nice=(d.nice||0)+1;save()},
    seen:function(k){return !!d.seen[k]},
    setSeen:function(k){d.seen[k]=true;save()},
    resetBalls:function(){d.balls=[];d.nice=0;d.seen={};save()},
    ticket:function(i){return d.tickets[i]||null},
    addTicket:function(i,o){d.tickets[i]=o;save()},
    ticketCount:function(){return Object.keys(d.tickets).length},
    resetTickets:function(){d.tickets={};save()},
    removeTicket:function(i){delete d.tickets[i];save()},
    addPerfect:function(){d.perfect=(d.perfect||0)+1;save();return d.perfect},
    perfectCount:function(){return d.perfect||0}
  };
})();
/* 짧은 알림 (모든 미니게임 페이지 공용) */
function mgToast(msg,ms,gold){var t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.toggle('gold',!!gold);t.classList.add('on');clearTimeout(mgToast.k);mgToast.k=setTimeout(function(){t.classList.remove('on')},ms||2200)}
/* (2026-11-05 로비) 나가는 길: 야구장 위 창(iframe)으로 열렸는지에 따라 달라요.
   - 야구장 위 창: mgExit = 창 닫기(야구장으로), mgGoLobby = 야구장을 나가 로비로
   - 따로 열림(로비에서 온 경우): mgExit = 로비로, mgGoStadium = 야구장(3D)으로
   주소: 로비(첫 화면) = index.html, 3D 야구장 = stadium.html (docs/LOBBY.md) */
var MG_LOBBY_URL='../index.html', MG_STADIUM_URL='../stadium.html';
function mgInGame(){return window.parent!==window}
function mgExit(){if(mgInGame())window.parent.postMessage({munhak:'bullpen-close'},'*');else location.href=MG_LOBBY_URL}
function mgGoLobby(){var u=new URL(MG_LOBBY_URL,location.href).href;if(mgInGame()){try{window.top.location.href=u;return}catch(e){}}location.href=u}
function mgGoStadium(){if(mgInGame())mgExit();else location.href=MG_STADIUM_URL}
