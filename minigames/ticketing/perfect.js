/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 티켓팅 War: 직관전승 · 연석으로 다시 예매 (2026-11-01) =================
   직관전승 = 한 구단 티켓을 전부 모았고 몇 석이든 전부 연석(shared/ticket.js의 tkTeamPerfect).
   그 구단의 마지막 조각이 채워지는 발권 순간: 티켓 위 금박 스티커(tkSeal) 쾅 → 금색 'OO전 직관전승!' + 손글씨 한 줄 + 종이가루.
   연석으로 다시 예매: 티켓북 구단 쪽 버튼 → ticketing.html?rebook=구단. 그 구단의 따로 앉은 티켓 중 하나를 같은 석 수로.
     연석으로 잡으면 티켓이 바뀌고, 또 따로면 원래 티켓 그대로(zsRebookMiss).
   game.js가 부르는 것: zsGoal() zsRebookPick() zsChip() zsCelebrate() zsRebookMiss(). 문구는 ZS만 고치면 돼요. */
var ZS={line:'한국시리즈도 걱정없는 금손! 이제 가을야구만 가면 돼…',
  odds:[[1,.2],[2,.45],[4,.35]]};/* 좌석 수 확률: 1석 20% · 2석 45% · 4석 35% */
var ZS_RB=(function(){var m=location.search.match(/[?&]rebook=([^&]+)/);return m?decodeURIComponent(m[1]):null})();

function zsGoal(){var r=Math.random();for(var k=0;k<ZS.odds.length;k++){r-=ZS.odds[k][1];if(r<=0)return ZS.odds[k][0]}return 2}
/* 다시 예매할 티켓 하나 (없으면 null) — 주소의 rebook은 한 번만 써요 */
function zsRebookPick(){if(!ZS_RB)return null;var t=ZS_RB;ZS_RB=null;
  var sp=tkTeamSplit(t);if(!sp.length)return null;var i=sp[Math.floor(Math.random()*sp.length)];return {gi:i,goal:LOCKER.ticket(i).n}}
/* 예매 오픈 화면 맨 위 딱지 */
function zsChip(){var c=document.querySelector('#stage .tw-open');if(!c)return;var p=document.createElement('p');p.className='rb-chip';
  p.textContent='연석으로 다시 예매 · 지금 티켓은 따로 앉았어요';c.insertBefore(p,c.firstChild)}
/* 또 따로 잡았을 때: 원래 티켓 그대로 */
function zsRebookMiss(){var g=TICKETS[R.gi];snd('bad');
  $('stage').innerHTML='<div class="tw-card result"><p class="kick">연석으로 다시 예매 · '+tkMD(g)+' '+tkEsc(g.opp)+'전</p><h2>이번에도 따로…</h2><p class="sub">원래 티켓은 그대로예요. 한 번 더 해 볼까요?</p>'
   +'<div class="btns"><button class="primary" id="again">같은 경기 다시 도전</button><a class="secondary" href="locker.html#tickets">티켓북으로</a></div></div>';
  $('again').onclick=function(){newRound(true)};
}
/* 직관전승 순간 (renderPrint 뒤에 불러요) */
function zsCelebrate(){var g=TICKETS[R.gi],c=document.querySelector('#stage .result'),pr=document.querySelector('#stage .printer');if(!c||!pr)return;
  var b=document.createElement('div');b.className='zs-banner';
  b.innerHTML='<span class="t"><small>마지막 '+tkEsc(g.opp)+'전 티켓까지 전부 연석</small>'+tkEsc(g.opp)+'전 직관전승!</span><p class="zs-line">'+tkEsc(ZS.line)+'</p>';
  c.insertBefore(b,c.firstChild);
  var s=document.createElement('div');s.className='zs-seal';s.innerHTML=tkSeal(g.opp);pr.appendChild(s);
  setTimeout(function(){s.classList.add('show')},1500);
  setTimeout(function(){b.classList.add('show');zsConfetti()},1900);
}
var zsRaf=0;
function zsConfetti(){var cf=$('zsConf');if(!cf){cf=document.createElement('canvas');cf.id='zsConf';cf.className='zs-confetti';cf.setAttribute('aria-hidden','true');document.body.appendChild(cf)}
  var c=cf.getContext('2d'),W=innerWidth,H=innerHeight,D=Math.min(2,devicePixelRatio||1);cf.width=W*D;cf.height=H*D;
  var cols=['#c8102e','#f3c83d','#ffffff','#7db356','#ffe08a'],P=[];
  for(var i=0;i<120;i++)P.push({x:.5+(Math.random()-.5)*.4,y:.18+Math.random()*.05,vx:(Math.random()-.5)*.8,vy:-Math.random()*.6-.2,r:Math.random()*6.28,vr:(Math.random()-.5)*12,w:6+Math.random()*5,h:3+Math.random()*4,c:cols[i%5]});
  cancelAnimationFrame(zsRaf);var last=performance.now();
  (function f(now){var dt=Math.min(.05,(now-last)/1000);last=now;c.setTransform(D,0,0,D,0,0);c.clearRect(0,0,W,H);var alive=0;
    P.forEach(function(p){p.vy+=.8*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;if(p.y<1.05){alive++;c.save();c.translate(p.x*W,p.y*H);c.rotate(p.r);c.scale(1,Math.abs(Math.cos(p.r*1.7))+.2);c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore()}});
    if(alive)zsRaf=requestAnimationFrame(f);else c.clearRect(0,0,W,H)})(last);
}
