/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= actions ================= */
var ACT_LABEL={cheer:'응원하는 중',angry:'화내는 중',wave:'유니폼 흔드는 중'};
var ACT_BTN={cheer:'응원하기',angry:'화내기',wave:'유니폼 흔들기'};
var lineT=0;
function setActButtons(){document.querySelectorAll('.act').forEach(function(b){var a=b.dataset.act;if(a==='food')return;var on=player.act===a;b.setAttribute('aria-pressed',on);b.querySelector('span').textContent=on?'멈추기':ACT_BTN[a]})}
function startAct(a){
  if(EV.on||SS.on)return;
  if(player.act===a){stopAct();return}
  PL.target=null;PL.onArrive=null;
  if(player.mode==='sit'&&PL.seat){PL.returnSeat=PL.seat;standAtSeat(player,PL.seat,curBlock)}
  else if(player.mode==='walk')player.mode='stand';
  var prev=player.act;
  if(prev)npcs.forEach(function(n){if(n.follow){n.follow=false;n.ai=rnd(.3,1.5)}});
  player.setAct(a);player.root.rotation.y=Math.PI;
  setActButtons();setStatus(null);
  if(a==='cheer'){beatStart();if(!AU.on)toast('소리가 꺼져 있어요. 위쪽 소리 버튼으로 켤 수 있어요',2800)}else if(prev==='cheer')beatStop();
  if(a==='angry')sfx('angry');if(a==='wave')sfx('whoosh');
  lineT=0;npcReact(a);
}
function stopAct(silent){
  if(!player||!player.act)return;var prev=player.act;player.setAct(null);setActButtons();
  if(prev==='cheer')beatStop();
  labels=labels.filter(function(l){if(l.ch===player&&l.kind!=='tag'){l.el.remove();return false}return true});
  npcs.forEach(function(n){if(n.follow){n.follow=false;n.ai=rnd(.3,2.5)}});
  if(PL.returnSeat){var s=PL.returnSeat;PL.returnSeat=null;sitChar(player,s);PL.seat=s}
}
document.querySelectorAll('.act').forEach(function(b){b.onclick=function(){auEnsure();var a=b.dataset.act;if(a==='food'){openFood();return}startAct(a)}});
$('bPhoto').onclick=function(){auEnsure();if(phase==='game')takePhoto('jikgwan')};
$('bExit').onclick=leaveGame;
$('bSound').onclick=function(){setSound(!AU.on);toast(AU.on?'소리를 켰어요':'소리를 껐어요',1600);if(AU.on&&player.act==='cheer')beatStart()};
$('bZone').onclick=function(){buildZoneList($('zoneList2'),true);openModal('mZone')};
$('bSet').onclick=function(){openModal('mSet')};
$('statusStop').onclick=function(){if(EV.on){skipEvent();return}if(SS.on){ssStop();return}PL.target=null;PL.onArrive=null;if(player.mode==='walk')player.mode='stand';setStatus(null)};
function setStatus(t){if(!t){$('status').hidden=true;return}$('statusTx').textContent=t;$('status').hidden=false}
