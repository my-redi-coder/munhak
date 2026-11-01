/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 경기 상황: 공수 · 낮밤 (묶음 A, 2026-11-01) =================
   위쪽 상황 칩(#bMatch, 예: '수비 · 낮') → '경기 상황' 시트(#mMatch)에서 공수·시간을 골라요.
   공수는 game/fieldplay.js의 setFieldMode, 시간은 world/daynight.js의 setDayNight. 둘 다 이 기기에 저장돼요.
   이벤트 장면 중에는 바꿀 수 없어요(장면이 선수·조명을 직접 움직여서). 문구는 config.js의 FIELD_MODE·DAY_TIME. */
function matchSync(){
  $('matchTx').textContent=FIELD_MODE[FP.mode].short+' · '+DAY_TIME[DN.mode].short;
  document.querySelectorAll('#mMatch [data-side]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.side===FP.mode?'true':'false')});
  document.querySelectorAll('#mMatch [data-time]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.time===DN.mode?'true':'false')});
}
/* 이벤트(events/homer.js·kkk.js)가 공수를 잠깐 바꿨다 돌려놓을 때 부르는 옛 이름 — 칩 글자를 맞춰요 */
function syncFieldBtns(){matchSync()}
function pickFieldMode(m){
  if(FP.mode===m&&FP.list.length)return;
  setFieldMode(m);matchSync();sfx('tap');if(phase==='game')toast(FIELD_MODE[m].toast,2600);
}
function pickDayTime(t){
  if(DN.mode===t)return;
  setDayNight(t);matchSync();sfx('tap');if(phase==='game')toast(DAY_TIME[t].toast,2600);
}
$('bMatch').onclick=function(){
  auEnsure();if(EV.on){toast('장면이 끝나면 바꿀 수 있어요',2200);return}
  if(typeof placeMenu==='function')placeMenu(false);
  matchSync();openModal('mMatch');
};
document.querySelectorAll('#mMatch [data-side]').forEach(function(b){b.onclick=function(){pickFieldMode(b.dataset.side)}});
document.querySelectorAll('#mMatch [data-time]').forEach(function(b){b.onclick=function(){pickDayTime(b.dataset.time)}});
setFieldMode(FP.mode);matchSync();
