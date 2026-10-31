/* ================= 이벤트 시트 =================
   위쪽 '이벤트' 버튼 → 목록(EVENTS, core/config.js). 열린 장면을 누르면 시트를 닫고 startEvent(id). */
function buildEventList(){
  var el=$('eventList');el.innerHTML='';
  EVENTS.forEach(function(ev){if(ev.hidden)return;
    var b=document.createElement('button');b.className='zone zrow evrow'+(ev.ready?'':' soon');b.disabled=!ev.ready;
    var t=document.createElement('div');t.innerHTML='<b></b><span></span>';t.querySelector('b').textContent=ev.label;t.querySelector('span').textContent=ev.desc;b.appendChild(t);
    var c=document.createElement('span');c.className='cnt';c.textContent=ev.ready?(ev.tag||'보기'):'곧 열려요';b.appendChild(c);
    if(ev.ready)b.onclick=function(){closeModal('mEvent');sfx('tap');startEvent(ev.id)};
    el.appendChild(b);
  });
}
$('bEvent').onclick=function(){auEnsure();if(EV.on||SS.on)return;buildEventList();openModal('mEvent')};
