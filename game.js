/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 티켓팅 War (묶음 B, 2026-11-01) =================
   한 판: 예매 오픈(경기·목표) → 대기열 → 좌석도(빈자리 찾기) → 결제 → 발권 → 티켓북(locker.html#tickets).
   - 경기: 아직 없는 2026 승리 경기(shared/tickets.js) 중 랜덤 → 티켓북이 얼룩덜룩 채워져요
   - 목표: 혼자 직관(1) · 친구랑(2) · 가족 표(4) 랜덤
   - 같이 앉기: 1자리 / 나란히 2자리 / 한 줄 4자리·앞뒤 2+2  →  '완벽 예매!'
   - 따로라도: 1+1, 떨어진 2+2, 1+3  →  '따로라도 성공!' + 사용자 멘트.  1+1+1+1·2+1+1은 안 돼요
   - 난이도: 빈자리가 떠 있는 시간 LIFE(초)에 0.6~1.6배 랜덤, 주말은 0.8배·제한 시간 20초(평일 23초), 원정은 빈자리가 더 드물게 */
var $=function(id){return document.getElementById(id)};
var ROWS=7,COLS=8,RL='ABCDEFG';
var GOALS={1:{name:'혼자 직관 노리기',hint:'빈자리 하나만 잡으면 돼요'},
  2:{name:'친구랑 같이 가기',hint:'나란히 두 자리면 같이 앉기, 떨어져 앉아도 성공'},
  4:{name:'우리 가족 표 구하기',hint:'한 줄 4자리나 앞뒤 2+2면 같이 앉기, 떨어진 2+2·1+3도 성공'}};
var SPLIT=['음...자리가있는게 어디야?','이겨서 만납시다','응원은 각자야!'];
var SHAPES={one:[[0,0]],two:[[0,0],[0,1]],three:[[0,0],[0,1],[0,2]],row4:[[0,0],[0,1],[0,2],[0,3]],box:[[0,0],[0,1],[1,0],[1,1]]};
var LIFE={one:.68,two:.9,three:1.05,row4:1.35,box:1.35};
var MIX={1:[['one',.7],['two',.3]],2:[['one',.4],['two',.45],['three',.15]],4:[['one',.25],['two',.35],['three',.12],['row4',.13],['box',.15]]};
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function syncN(){$('bookN').textContent=LOCKER.ticketCount()+'/'+TICKETS.length}

/* ---------- 소리 ---------- */
var AC=null;
function snd(k){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  var t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);
  var P={tap:[880,1320,.07,.12],bad:[220,150,.18,.12],ok:[660,990,.25,.14],print:[140,180,1.2,.05],pop:[520,260,.1,.1]}[k];
  o.type=k==='print'?'square':'sine';o.frequency.setValueAtTime(P[0],t);o.frequency.linearRampToValueAtTime(P[1],t+P[2]);
  g.gain.setValueAtTime(P[3],t);g.gain.exponentialRampToValueAtTime(.001,t+P[2]+.05);o.start(t);o.stop(t+P[2]+.08);
  if(k==='ok'){var o2=AC.createOscillator(),g2=AC.createGain();o2.connect(g2);g2.connect(AC.destination);o2.frequency.value=1320;g2.gain.setValueAtTime(.12,t+.16);g2.gain.exponentialRampToValueAtTime(.001,t+.5);o2.start(t+.16);o2.stop(t+.55)}
}catch(e){}}

/* ---------- 한 판 ---------- */
var R=null;
function stopRound(){if(!R)return;cancelAnimationFrame(R.raf);R.phase='done'}
function newRound(retry){
  stopRound();var left=TICKETS.map(function(_,i){return i}).filter(function(i){return !LOCKER.ticket(i)});
  if(!left.length){renderAllDone();return}
  var gi=retry&&R?R.gi:pick(left),goal=retry&&R?R.goal:pick([1,2,4]);
  R={gi:gi,goal:goal,phase:'open'};renderOpen();window.scrollTo(0,0);
}
function renderAllDone(){$('stage').innerHTML='<div class="tw-card result"><p class="kick">티켓팅 War</p><h2>티켓북 완성!</h2><p class="sub">2026 시즌 승리 '+TICKETS.length+'경기 티켓을 다 모았어요</p><div class="btns"><a class="primary" href="locker.html#tickets">티켓북 보기</a></div></div>'}
function goalIcon(n){var r='<span>'+(n===1?'<i></i>':'<i></i><i></i>')+'</span>';return '<div class="ic" aria-hidden="true">'+r+(n===4?r:'')+'</div>'}
function renderOpen(){var g=TICKETS[R.gi],G=GOALS[R.goal];
  $('stage').innerHTML='<div class="tw-card tw-open"><p class="kick">예매 오픈!</p><h2>'+tkMD(g)+' ('+tkDay(g)+') '+tkEsc(g.opp)+'전</h2><p class="meta">'+tkEsc(g.park)+' · '+(g.home?'홈 경기':'원정 경기')+'</p>'
   +'<div class="chips">'+(tkWeekend(g)?'<span class="chip hot">주말 경기 · 경쟁 치열</span>':'<span class="chip">평일 경기</span>')+(g.home?'':'<span class="chip hot">원정석만 열려요</span>')+'</div>'
   +'<div class="goal">'+goalIcon(R.goal)+'<small>오늘의 목표 · '+R.goal+'자리</small><strong>'+G.name+'</strong><span class="gh">'+G.hint+'</span></div>'
   +'<button class="primary" id="go">예매하기</button></div>';
  $('go').onclick=function(){snd('tap');renderQueue()};
}
function renderQueue(){R.phase='queue';var start=Math.floor(rnd(8000,24000)),bump=Math.random()<.4,dur=2600,t0=performance.now();
  $('stage').innerHTML='<div class="tw-card queue"><p class="meta">접속 대기 중</p><div class="big" id="qn"></div><p class="meta">명이 내 앞에 있어요</p><div class="qbar" style="margin-top:18px"><i id="qb"></i></div><p class="qmsg" id="qm"></p></div>';
  function step(now){if(R.phase!=='queue')return;var p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,2),n=Math.round(start*(1-e));
    if(bump&&p>.45){n+=Math.round(2400*Math.max(0,1-(p-.45)/.4));$('qm').textContent='앗, 새로고침은 금물!'}
    $('qn').textContent=n.toLocaleString('ko-KR');$('qb').style.width=(p*100)+'%';
    if(p<1)R.raf=requestAnimationFrame(step);else setTimeout(function(){if(R.phase==='queue')renderSeats()},250)}
  R.raf=requestAnimationFrame(step);
}

/* ---------- 좌석도 ---------- */
function pickShape(){var r=Math.random(),a=MIX[R.goal];for(var i=0;i<a.length;i++){r-=a[i][1];if(r<=0)return a[i][0]}return a[0][0]}
function renderSeats(){var g=TICKETS[R.gi];R.phase='seat';
  R.blk=g.home?'1루 내야 '+Math.floor(rnd(3,10))+'구역':'3루 원정석 '+Math.floor(rnd(1,4))+'구역';
  R.S=[];for(var i=0;i<ROWS*COLS;i++)R.S.push({s:'taken',exp:0,gone:-9e9});
  R.mine=[];R.mult=tkWeekend(g)?.8:1;R.gap=(g.home?.55:.72)*(tkWeekend(g)?1.1:1);R.dur=(tkWeekend(g)?20:23)*1000;
  var h='<div class="seathead"><div><b>'+tkMD(g)+' '+tkEsc(g.opp)+'전</b><span>'+R.blk+' · '+GOALS[R.goal].name+'</span></div><div class="pick"><span id="pk">0 / '+R.goal+'</span><small>내 자리</small></div></div>'
   +'<div class="tbar" id="tbar"><i id="tb"></i></div><div class="ground">그라운드 쪽</div><div class="mapbox"><div class="seats" id="seats">';
  for(var r=0;r<ROWS;r++){h+='<span class="rowl">'+RL[r]+'</span>';for(var c=0;c<COLS;c++)h+='<button class="st" data-i="'+(r*COLS+c)+'" aria-label="'+RL[r]+'열 '+(c+1)+'번"></button>'}
  h+='</div><div class="isun" id="isun"><p>이미 선택된 좌석입니다.</p><div>확인</div></div><div id="payBox"></div></div>'
   +'<div class="legend"><span><i style="background:var(--mint)"></i>빈자리</span><span><i style="background:var(--red)"></i>내 자리</span><span><i style="background:var(--taken)"></i>팔린 자리</span></div>'
   +'<p class="hint" id="hint">빈자리가 반짝이면 얼른 눌러요</p>';
  $('stage').innerHTML=h;R.btn=[].slice.call(document.querySelectorAll('#seats .st'));
  $('seats').addEventListener('pointerdown',seatTap);
  $('seats').addEventListener('click',function(e){if(e.detail===0)seatTap(e)});
  R.t0=performance.now();R.next=R.t0+300;for(var k=0;k<3;k++)spawn(R.t0);
  R.raf=requestAnimationFrame(tick);
}
function spawn(now){
  if(R.S.filter(function(x){return x.s==='open'}).length>11)return;
  var key=pickShape(),sh=SHAPES[key];
  var maxR=ROWS-Math.max.apply(null,sh.map(function(p){return p[0]})),maxC=COLS-Math.max.apply(null,sh.map(function(p){return p[1]}));
  for(var tries=0;tries<14;tries++){
    var r0=Math.floor(Math.random()*maxR),c0=Math.floor(Math.random()*maxC),cells=sh.map(function(p){return (r0+p[0])*COLS+c0+p[1]});
    if(cells.every(function(i){return R.S[i].s==='taken'&&now-R.S[i].gone>500})){
      var life=LIFE[key]*R.mult*rnd(.6,1.6)*1000;cells.forEach(function(i){R.S[i].s='open';R.S[i].exp=now+life*rnd(.92,1.08)});return}
  }
}
function tick(now){if(R.phase!=='seat'&&R.phase!=='pay')return;
  R.S.forEach(function(x){if(x.s==='open'&&now>x.exp){x.s='taken';x.gone=now}});
  if(R.phase==='seat'){
    if(now>=R.next){spawn(now);R.next=now+R.gap*1000*rnd(.6,1.4)}
    var left=R.dur-(now-R.t0);$('tb').style.width=Math.max(0,left/R.dur*100)+'%';$('tbar').classList.toggle('low',left<5000);
    if(left<=0){fail('매진됐어요','취소표를 노려 보세요');return}
  }else{var l=R.payEnd-now;$('cd').textContent=Math.max(0,l/1000).toFixed(1);if(l<=0){fail('결제 시간이 지났어요','잡았던 자리가 풀렸어요 ㅠ');return}}
  R.btn.forEach(function(b,i){var x=R.S[i],c='st'+(x.s==='open'?' open':x.s==='mine'?' mine':(now-x.gone<350?' gone':''));if(b.className.indexOf('nope')<0&&b.className!==c)b.className=c});
  R.raf=requestAnimationFrame(tick);
}
function seatTap(e){var b=e.target.closest('.st');if(!b||R.phase!=='seat')return;e.preventDefault();
  var i=+b.dataset.i,x=R.S[i],now=performance.now();
  if(x.s==='open'){if(R.mine.length>=R.goal){hint('이미 '+R.goal+'자리를 골랐어요',true);return}
    x.s='mine';R.mine.push(i);snd('tap');$('pk').textContent=R.mine.length+' / '+R.goal;if(R.mine.length===R.goal)judge(now);else hint(R.goal-R.mine.length+'자리 더!')}
  else if(x.s==='mine'){x.s='open';x.exp=now+900;R.mine.splice(R.mine.indexOf(i),1);$('pk').textContent=R.mine.length+' / '+R.goal;snd('pop')}
  else{snd('bad');if(now-x.gone<800)isun();b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');setTimeout(function(){b.classList.remove('nope')},260)}
}
function isun(){var p=$('isun');p.classList.add('on');clearTimeout(R.isT);R.isT=setTimeout(function(){p.classList.remove('on')},900)}
function hint(m,bad){var h=$('hint');h.textContent=m;h.classList.toggle('bad',!!bad)}
/* 고른 자리 → 줄마다 붙은 묶음 [{r,cs}] */
function runs(list){var by={};list.forEach(function(i){var r=Math.floor(i/COLS);(by[r]=by[r]||[]).push(i%COLS)});
  var out=[];Object.keys(by).sort().forEach(function(r){var cs=by[r].sort(function(a,b){return a-b}),cur=[cs[0]];
    for(var k=1;k<cs.length;k++){if(cs[k]===cs[k-1]+1)cur.push(cs[k]);else{out.push({r:+r,cs:cur});cur=[cs[k]]}}out.push({r:+r,cs:cur})});return out}
function judge(now){var ru=runs(R.mine),L=ru.map(function(x){return x.cs.length}).sort(),tog=false,ok=true;
  if(R.goal===1)tog=true;
  else if(R.goal===2)tog=L.length===1;
  else{tog=(L.length===1)||(L.join()==='2,2'&&Math.abs(ru[0].r-ru[1].r)===1&&ru[0].cs[0]===ru[1].cs[0]);
    ok=tog||L.join()==='2,2'||L.join()==='1,3'}
  if(!ok){var last=R.mine.pop();R.S[last].s='taken';R.S[last].gone=now;$('pk').textContent=R.mine.length+' / '+R.goal;snd('bad');
    hint(L.join()==='1,1,1,1'?'가족이 뿔뿔이 흩어졌어요! 둘씩은 붙어 앉아요':'2+2나 1+3까지만 돼요',true);return}
  R.tog=tog;R.seatStr=ru.map(function(x){return RL[x.r]+'열 '+x.cs.map(function(c){return c+1}).join('·')+'번'}).join(', ');
  R.phase='pay';R.payEnd=now+4000;snd('ok');
  $('payBox').innerHTML='<div class="pay"><div class="tw-card"><h3>'+R.goal+'자리 잡았어요!</h3><p class="sl">'+R.seatStr+'</p><p class="cd" id="cd">4.0</p><button class="primary" id="payBtn">결제하기</button></div></div>';
  $('payBtn').onclick=paid;$('payBtn').focus();
}
function paid(){if(R.phase!=='pay')return;cancelAnimationFrame(R.raf);R.phase='done';
  LOCKER.addTicket(R.gi,{n:R.goal,tog:R.tog,seat:R.seatStr,blk:R.blk});syncN();renderPrint()}
function fail(t,s){cancelAnimationFrame(R.raf);R.phase='done';snd('bad');var g=TICKETS[R.gi];
  $('stage').innerHTML='<div class="tw-card result"><p class="kick">'+tkMD(g)+' '+tkEsc(g.opp)+'전</p><h2>'+t+'</h2><p class="sub">'+s+'</p><div class="btns"><button class="primary" id="again">같은 경기 다시 도전</button><button class="secondary" id="other">다른 경기 예매하기</button></div></div>';
  $('again').onclick=function(){newRound(true)};$('other').onclick=function(){newRound()};
}
function renderPrint(){var i=R.gi;snd('print');
  var line=R.tog?(R.goal===1?'혼자여도 직관은 직관!':R.goal===2?'나란히 앉아요':'온 가족이 같이 앉아요'):pick(SPLIT);
  $('stage').innerHTML='<div class="tw-card result"><p class="kick">발권 완료</p><h2>'+(R.tog?'완벽 예매!':'따로라도 성공!')+'</h2><p class="line">'+tkEsc(line)+'</p>'
   +'<div class="printer"><div class="slot"></div><div class="paper"><div class="tkwrap">'+tkStack(i)+'</div></div></div>'
   +'<div class="btns"><button class="primary" id="tuck">티켓북에 꽂기</button><button class="secondary" id="more">한 판 더</button></div></div>';
  $('tuck').onclick=function(){try{sessionStorage.setItem('tw-new',String(i))}catch(e){}location.href='locker.html#tickets'};
  $('more').onclick=function(){newRound()};
}

/* ---------- 시작 ---------- */
$('back').onclick=function(){location.href='bullpen.html'};
if(/[?&]dev\b/.test(location.search)){$('dev').hidden=false;
  $('devFill').onclick=function(){TICKETS.forEach(function(g,i){if(!LOCKER.ticket(i)){var n=pick([1,2,4]);LOCKER.addTicket(i,{n:n,tog:n===1||Math.random()<.6,seat:'C열 4'+(n>1?'·5':'')+'번',blk:g.home?'1루 내야 5구역':'3루 원정석 2구역'})}});syncN();mgToast('티켓을 다 채웠어요')};
  $('devClear').onclick=function(){LOCKER.resetTickets();syncN();newRound();mgToast('티켓을 다 비웠어요')};
}
syncN();newRound();
window.addEventListener('pageshow',function(e){if(e.persisted){syncN();if(!R||R.phase==='done')newRound()}});
