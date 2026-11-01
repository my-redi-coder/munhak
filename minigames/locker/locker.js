/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 내 라커 =================
   첫 화면: 라커 두 칸(카드 앨범 / 공박스). 주소 끝 #cards = 카드 앨범, #balls = 공박스.
   카드 앨범: 등급 네 줄(레전더리·코어·스페셜·선수단). 모은 카드를 누르면 크게 떠서 뒷면 선수 정보로 뒤집혀요(card.js cardView).
   공박스: 위 기념구 진열장(날짜만, 눌러야 어떤 공인지) → 달 고르기 → 선반(한 줄 5개, 시즌 순서).
     기념구는 선반 제자리에 ★ 표시만 남아요. 공을 누르면 손글씨 기념구가 크게.
     그라운드 홈런·올스타 브레이크를 게임에서 한 번 본 사람에게만 '다시 보기' 버튼.
     (2026-11-01) 퍼펙트 판을 한 번이라도 하면 '기념구 진열장' 옆에 금 글러브 배지(퍼펙트 n회). 공을 크게 보면 아래 실밥 밑에 〈언제나 처음은 소중하다〉(shared/ball.js)
   (묶음 B) 라커는 두 칸씩 두 줄: 카드 앨범 · 공박스 / 티켓북(#tickets) · 빈 라커(안 열리고 철컹 소리만).
   티켓북: 상대 구단별 탭(많이 이긴 순), 주머니에 반쯤 꽂힌 티켓, 누르면 꺼내 보기 + 하이라이트. 그리기는 shared/ticket.js
   (2026-11-01) 티켓이 하나도 없으면 안내 문구(#tkEmpty).
   (2026-11-01) ?embed 로 열리면 야구장 야푸먹기 테이블 위에 띄운 티켓북(js/ui/food-ticket.js): 뒤로·Esc는 창 닫기, '티켓팅 하러 가기'는 야구장의 불펜장 창으로 티켓팅 War를 열어요 */
var $=function(id){return document.getElementById(id)};
var curMonth='open';
var LK_EMBED=/[?&]embed=1/.test(location.search);
function lkCloseEmbed(){try{parent.postMessage('munhak:tkb-close',location.origin)}catch(e){}}
if(LK_EMBED){document.documentElement.classList.add('embed');$('back').setAttribute('aria-label','티켓북 닫기');
  $('tkGo').onclick=function(e){e.preventDefault();try{parent.postMessage('munhak:tkb-ticketing',location.origin)}catch(er){}}}
function lkRender(){
  var n=LOCKER.cardCount(),T=ROSTER.length,view=location.hash==='#cards'?'cards':location.hash==='#balls'?'balls':location.hash==='#tickets'?'tickets':'home';
  var cvw=$('cardView');if(cvw)cvw.classList.remove('show');$('ballView').classList.remove('show');
  $('cardsMeta').textContent=n+' / '+T+'장';
  $('ballsMeta').textContent=LOCKER.ballCount()+' / '+HR_TOTAL+'개';
  $('ticketsMeta').textContent=LOCKER.ticketCount()+' / '+TICKETS.length+'장';
  $('home').hidden=view!=='home';$('cards').hidden=view!=='cards';$('balls').hidden=view!=='balls';$('tickets').hidden=view!=='tickets';
  $('title').textContent=view==='cards'?'카드 앨범':view==='balls'?'공박스':view==='tickets'?'티켓북':'내 라커';
  if(view==='cards')lkCards();
  if(view==='balls')lkBalls();
  if(view==='tickets')lkTickets();
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
  var pc=LOCKER.perfectCount(),gb=$('gBadge');gb.hidden=!pc;/* (2026-11-01) 홈런볼 퍼펙트 판 = 금 글러브 */
  if(pc){gb.innerHTML=gloveSVG()+'퍼펙트 <b>'+pc+'</b>회';gb.setAttribute('aria-label','금 글러브 '+pc+'개, 퍼펙트 판 '+pc+'회')}
  $('replayGround').hidden=!LOCKER.seen('ground');$('replayAS').hidden=!LOCKER.seen('allstar');
  $('replays').hidden=!(LOCKER.seen('ground')||LOCKER.seen('allstar'));
}
$('months').addEventListener('click',function(e){var b=e.target.closest('.month');if(!b)return;curMonth=b.dataset.k;lkBalls()});
function lkOpenBall(i){$('ballBig').innerHTML=ballHTML(HR[i],true);$('ballView').classList.add('show')}
$('showcase').addEventListener('click',function(e){var b=e.target.closest('.case.has');if(b)lkOpenBall(+b.dataset.i)});
$('shelf').addEventListener('click',function(e){var b=e.target.closest('.slot[data-i]');if(b)lkOpenBall(+b.dataset.i)});
$('ballView').onclick=function(){$('ballView').classList.remove('show')};
document.addEventListener('keydown',function(e){if(e.key==='Escape')$('ballView').classList.remove('show')});


/* ---------- 티켓북 (묶음 B) ---------- */
var tkTeam=null;
function lkTickets(){
  var newI=null;try{var v=sessionStorage.getItem('tw-new');if(v!=null){newI=+v;sessionStorage.removeItem('tw-new');tkTeam=TICKETS[newI].opp}}catch(e){}
  if(!tkTeam)tkTeam=TK_TEAMS[0];
  $('tkCount').textContent=LOCKER.ticketCount()+' / '+TICKETS.length;
  $('tkEmpty').hidden=LOCKER.ticketCount()>0;
  $('tkTabs').innerHTML=tkTeamTabs(tkTeam);
  var cur=$('tkTabs').querySelector('[aria-pressed="true"]');if(cur&&cur.scrollIntoView)cur.scrollIntoView({block:'nearest',inline:'center'});
  $('tkGrid').innerHTML=tkBookHTML(tkTeam,newI);
}
$('tkTabs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;tkTeam=b.dataset.t;lkTickets()});
$('tkGrid').addEventListener('click',function(e){var b=e.target.closest('.pocket.has');if(!b)return;
  var i=+b.dataset.i,o=LOCKER.ticket(i);$('tkBox').innerHTML=tkStack(i);
  $('tkTog').textContent=o.n+'매 · '+(o.n===1?'혼자 직관':o.tog?'같이 앉았어요':'따로 앉았어요');
  $('tkYt').href='https://www.youtube.com/watch?v='+encodeURIComponent(TICKETS[i].v);$('tkModal').hidden=false;$('tkClose').focus()});
function tkClose(){$('tkModal').hidden=true}
$('tkClose').onclick=tkClose;$('tkModal').addEventListener('click',function(e){if(e.target.id==='tkModal')tkClose()});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;if(!$('tkModal').hidden)tkClose();else if(LK_EMBED)lkCloseEmbed()});
/* 빈 라커: 안 열리고 철컹 */
var lkAC=null;
function lkClank(){try{lkAC=lkAC||new(window.AudioContext||window.webkitAudioContext)();if(lkAC.state==='suspended')lkAC.resume();
  var c=lkAC,t=c.currentTime,out=c.createGain();out.gain.value=.5;out.connect(c.destination);
  [[523,.9],[1187,.5],[1764,.35],[2690,.2]].forEach(function(p){var o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=p[0];
    g.gain.setValueAtTime(p[1]*.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.6);o.connect(g);g.connect(out);o.start(t);o.stop(t+.62)});
  var n=c.sampleRate*.05,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  var s=c.createBufferSource(),f=c.createBiquadFilter(),g2=c.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=3000;g2.gain.value=.6;s.connect(f);f.connect(g2);g2.connect(out);s.start(t);
}catch(e){}}
$('emptyDoor').onclick=function(){var d=$('emptyDoor');lkClank();d.classList.remove('rattle');void d.offsetWidth;d.classList.add('rattle')};
$('back').onclick=function(){if(LK_EMBED){lkCloseEmbed();return}if(location.hash==='#cards'||location.hash==='#balls'||location.hash==='#tickets')location.hash='';else location.href='bullpen.html'};
window.addEventListener('hashchange',lkRender);
window.addEventListener('pageshow',lkRender);
lkRender();
