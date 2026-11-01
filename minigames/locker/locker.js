/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 내 라커 =================
   첫 화면: 라커 두 칸(카드 앨범 / 공박스). 주소 끝 #cards = 카드 앨범, #balls = 공박스.
   카드 앨범: 등급 네 줄(레전더리·코어·스페셜·선수단). 모은 카드를 누르면 크게 떠서 뒷면 선수 정보로 뒤집혀요(card.js cardView).
   공박스: 위 기념구 진열장(날짜만, 눌러야 어떤 공인지) → 달 고르기 → 선반(한 줄 5개, 시즌 순서).
     기념구는 선반 제자리에 ★ 표시만 남아요. 공을 누르면 손글씨 기념구가 크게.
     그라운드 홈런·올스타 브레이크를 게임에서 한 번 본 사람에게만 '다시 보기' 버튼. */
var $=function(id){return document.getElementById(id)};
var curMonth='open';
function lkRender(){
  var n=LOCKER.cardCount(),T=ROSTER.length,view=location.hash==='#cards'?'cards':location.hash==='#balls'?'balls':'home';
  var cvw=$('cardView');if(cvw)cvw.classList.remove('show');$('ballView').classList.remove('show');
  $('cardsMeta').textContent=n+' / '+T+'장';
  $('ballsMeta').textContent=LOCKER.ballCount()+' / '+HR_TOTAL+'개';
  $('home').hidden=view!=='home';$('cards').hidden=view!=='cards';$('balls').hidden=view!=='balls';
  $('title').textContent=view==='cards'?'카드 앨범':view==='balls'?'공박스':'내 라커';
  if(view==='cards')lkCards();
  if(view==='balls')lkBalls();
}
function lkCards(){
  var n=LOCKER.cardCount(),T=ROSTER.length,pct=Math.round(n/T*100);
  $('albumCount').textContent=n+' / '+T;$('albumPct').textContent=pct+'%';$('albumBar').style.width=pct+'%';
  var fresh={};try{(JSON.parse(sessionStorage.getItem('nm-new')||'[]')).forEach(function(no){fresh[no]=1})}catch(e){}
  function put(id,tier){$(id).innerHTML=ROSTER.filter(function(p){return p.tier===tier}).map(function(p){return cardMini(p,LOCKER.hasCard(p.no),fresh[p.no])}).join('')}
  put('albumLegendary','legendary');put('albumCore','core');put('albumSpecial','special');put('albumAll','normal');
  $('doneNote').hidden=n<T;
}
$('cards').addEventListener('click',function(e){var b=e.target.closest('button.pc-mini');if(b)cardView(ROSTER_BY[b.dataset.no])});

function lkBalls(){
  $('showcase').innerHTML=HR_SPECIALS.map(function(h){
    var has=LOCKER.hasBall(h.i);
    return '<button class="case'+(has?' has':'')+'" data-i="'+h.i+'"'+(has?'':' disabled')+' aria-label="'+hrDay(h.date)+(has?' 기념구 보기':', 아직 못 모은 기념구')+'"><div class="glass">'+(has?ballHTML(h,false):'<span class="q">?</span>')+'</div><small>'+hrDay(h.date)+'</small></button>';
  }).join('');
  var m=HR_MONTHS.filter(function(x){return x.k===curMonth})[0];
  $('months').innerHTML=HR_MONTHS.map(function(x){
    var list=HR.filter(function(h){return x.ms.indexOf(h.date.slice(0,2))>=0}),got=list.filter(function(h){return LOCKER.hasBall(h.i)}).length;
    return '<button class="month" data-k="'+x.k+'" aria-pressed="'+(x.k===curMonth)+'">'+x.label+'<small>'+got+'/'+list.length+'</small></button>';
  }).join('');
  $('shelf').innerHTML=HR.filter(function(h){return m.ms.indexOf(h.date.slice(0,2))>=0}).map(function(h){
    if(!LOCKER.hasBall(h.i))return '<div class="slot empty" role="img" aria-label="'+(h.i+1)+'번째 홈런, 아직 못 모았어요"><div class="stand"><i></i></div><span class="ord">'+(h.i+1)+'</span></div>';
    return '<button class="slot'+(h.title?' inCase':'')+'" data-i="'+h.i+'" aria-label="'+(h.i+1)+'번째 홈런 '+cardEsc(h.name)+' 기념구 보기">'+ballHTML(h,false)+'<span class="no">'+h.no+'</span>'+(h.title?'<span class="star" aria-hidden="true">★</span>':'')+'</button>';
  }).join('');
  var sp=HR_SPECIALS.filter(function(h){return LOCKER.hasBall(h.i)}).length;
  $('seasonLine').textContent='시즌 '+LOCKER.ballCount()+' / '+HR_TOTAL+' · 진열장 '+sp+' / '+HR_SPECIALS.length;
  $('replayGround').hidden=!LOCKER.seen('ground');$('replayAS').hidden=!LOCKER.seen('allstar');
  $('replays').hidden=!(LOCKER.seen('ground')||LOCKER.seen('allstar'));
}
$('months').addEventListener('click',function(e){var b=e.target.closest('.month');if(!b)return;curMonth=b.dataset.k;lkBalls()});
function lkOpenBall(i){$('ballBig').innerHTML=ballHTML(HR[i],true);$('ballView').classList.add('show')}
$('showcase').addEventListener('click',function(e){var b=e.target.closest('.case.has');if(b)lkOpenBall(+b.dataset.i)});
$('shelf').addEventListener('click',function(e){var b=e.target.closest('.slot[data-i]');if(b)lkOpenBall(+b.dataset.i)});
$('ballView').onclick=function(){$('ballView').classList.remove('show')};
document.addEventListener('keydown',function(e){if(e.key==='Escape')$('ballView').classList.remove('show')});

$('back').onclick=function(){if(location.hash==='#cards'||location.hash==='#balls')location.hash='';else location.href='bullpen.html'};
window.addEventListener('hashchange',lkRender);
window.addEventListener('pageshow',lkRender);
lkRender();
