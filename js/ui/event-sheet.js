/* ================= 이벤트 시트 =================
   위쪽 '이벤트' 버튼 → 목록(EVENTS, core/config.js). 열린 장면을 누르면 시트를 닫고 startEvent(id). */
function buildEventList(){
  var el=$('eventList');el.innerHTML='';
  EVENTS.forEach(function(ev){
    var b=document.createElement('button');b.className='zone zrow evrow'+(ev.ready?'':' soon');b.disabled=!ev.ready;
    var t=document.createElement('div');t.innerHTML='<b></b><span></span>';t.querySelector('b').textContent=ev.label;t.querySelector('span').textContent=ev.desc;b.appendChild(t);
    var c=document.createElement('span');c.className='cnt';c.textContent=ev.ready?(ev.tag||'보기')+(evBgmName(ev.id)?' · ♪':''):'곧 열려요';b.appendChild(c);
    if(ev.ready)b.onclick=function(){closeModal('mEvent');sfx('tap');startEvent(ev.id)};
    el.appendChild(b);
  });
}
$('bEvent').onclick=function(){auEnsure();if(EV.on)return;buildEventList();openModal('mEvent')};
/* 이벤트 배경음 고르기 (설정 시트) — 지금은 최정 홈런 한 곡 */
function syncEvBgmUI(){var n=evBgmName('homer');$('evBgmName').textContent=n?'최정 홈런: '+n:'지금은 배경음이 없어요.';$('evBgmClear').hidden=!n;$('evBgmPick').textContent=n?'다른 파일 고르기':'파일 고르기'}
$('evBgmPick').onclick=function(){$('evBgmIn').click()};
$('evBgmIn').addEventListener('change',function(){var f=this.files&&this.files[0];if(!f)return;evBgmSet('homer',f);syncEvBgmUI();toast('최정 홈런 배경음을 골랐어요');this.value=''});
$('evBgmClear').onclick=function(){evBgmClear('homer');syncEvBgmUI();toast('배경음을 지웠어요',1600)};
syncEvBgmUI();
