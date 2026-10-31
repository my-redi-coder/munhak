/* ================= 내 라커 (수집품 보관) =================
   불펜장 게임들이 모은 것을 이 기기 브라우저에 보관해요(localStorage). 모든 미니게임이 같이 써요.
   cards: 등번호 매치로 모은 선수 등번호 목록 / balls: 홈런볼 모으기(준비 중) */
var LOCKER=(function(){
  var KEY='munhak-locker-v1',d={cards:[],cardsDone:false,balls:[]};
  try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);for(var k in o)d[k]=o[k]}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
  return {
    hasCard:function(no){return d.cards.indexOf(no)>=0},
    addCard:function(no){if(d.cards.indexOf(no)>=0)return false;d.cards.push(no);save();return true},
    cardCount:function(){return d.cards.length},
    cardsDone:function(){return !!d.cardsDone},
    setCardsDone:function(v){d.cardsDone=!!v;save()},
    setCards:function(list){d.cards=list.slice();save()},
    resetCards:function(){d.cards=[];d.cardsDone=false;save()},
    ballCount:function(){return d.balls.length}
  };
})();
/* 짧은 알림 (모든 미니게임 페이지 공용) */
function mgToast(msg,ms,gold){var t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.toggle('gold',!!gold);t.classList.add('on');clearTimeout(mgToast.k);mgToast.k=setTimeout(function(){t.classList.remove('on')},ms||2200)}
/* 야구장으로 돌아가기: 야구장 위 창이면 창을 닫고, 따로 열었으면 야구장 첫 화면으로 */
function mgExit(){if(window.parent!==window)window.parent.postMessage({munhak:'bullpen-close'},'*');else location.href='../index.html'}
