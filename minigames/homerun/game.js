/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 홈런볼 모으기: 진행 =================
   한 판 = 아직 못 잡은 공 12개(시즌 순서). 글러브를 좌우로 끌어 공 그림자 위에 두면 잡혀요.
   공이 떨어지는 순간(±0.2초) 누르면 나이스 캐치. 놓친 공은 판 끝에 한 번 더, 또 놓치면 다음 판 맨 앞으로.
   난이도는 시즌 따라: 봄(1~48번째 공) → 여름(~96) → 가을. 최정 공 20개는 늘 1.4초.
   잡은 공은 내 라커 공박스(LOCKER.addBall)로. 주소 끝 #replay-ground / #replay-allstar 면 그 장면만 다시 보기.
   주소에 ?dev 가 있으면 확인용 버튼이 보여요. */
var $=function(id){return document.getElementById(id)};
var cv=$('hrCanvas'),ctx=cv.getContext('2d');
var CW=0,CH=0,DPR=1;
function sizeCanvas(){
  var w=cv.parentElement.clientWidth||400;DPR=Math.min(2,window.devicePixelRatio||1);
  CW=w;CH=Math.round(w*1.12);
  cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);cv.style.height=CH+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);drawScene();
}
/* 타구 방향 → 떨어지는 가로 위치. '○○ 뒤'는 높고 길게, '○중간'은 낮고 빠르게 */
var DIRX={'좌익수 뒤':.08,'좌중간':.27,'중견수 뒤':.5,'중견수 방면 그라운드':.5,'우중간':.73,'우익수 뒤':.92};
var HOME_Y=.30,CATCH_Y=.83,TOL=.078,XMIN=.06,XMAX=.94;
var GR={call:.45,fly:1.45,q:2.25,end:4.85};   /* 그라운드 홈런 시간표(초) */
var AS={end:5.4};                              /* 올스타 브레이크 길이(초) */
var STAGE=[
  {name:'봄',dur:2.15,spread:.8,wind:0,gap:.9,b2b:.9},
  {name:'여름',dur:1.85,spread:1,wind:.08,gap:.8,b2b:.4},
  {name:'가을',dur:1.6,spread:1,wind:.18,gap:.75,b2b:.35}
];
var CHOI_DUR=1.4;
var G={as:null,asShown:false,gr:null,state:'idle',queue:[],pos:0,missed:[],retry:false,caught:0,nice:0,plan:0,ball:null,gx:.5,lastTap:-9,raf:0,last:0,wait:0,next:null,lastDate:'',replayBack:false};

function stageOf(idx){return idx<48?0:idx<96?1:2}
function nextQueue(){var q=[];for(var i=0;i<HR.length&&q.length<12;i++)if(!LOCKER.hasBall(i))q.push(i);return q}

/* 시작 화면 */
function showGate(){
  var q=nextQueue(),n=LOCKER.ballCount();G.state='idle';
  if(!q.length){
    $('gateTitle').textContent='시즌 끝!';
    $('gateText').innerHTML='2026 시즌 홈런 '+HR_TOTAL+'개를 다 모았어요.<br>공박스에서 하나씩 꺼내 보세요.';
    $('hrStart').textContent='공박스 보기';$('hrStart').dataset.go='box';
  }else{
    $('gateTitle').textContent=STAGE[stageOf(q[0])].name+' · '+(Math.floor(n/12)+1)+'판';
    $('gateText').innerHTML=hrDay(HR[q[0]].date)+'부터 공 '+q.length+'개가 날아와요.<br>시즌 '+n+'/'+HR_TOTAL;
    $('hrStart').textContent='시작';delete $('hrStart').dataset.go;
  }
  $('hrGate').hidden=false;setStrip(null);drawScene();
}
/* 위쪽 띠: 날짜 · 상대 · 문학/원정 · 이번 판 진행 */
function setStrip(h){
  if(!h){$('hrDate').textContent=LOCKER.ballCount()?'시즌 '+LOCKER.ballCount()+'/'+HR_TOTAL:'개막 준비';$('hrOpp').textContent='';$('hrChip').hidden=true;$('hrCnt').textContent='';return}
  if(G.lastDate!==h.date){var w=$('hrWhen');w.classList.remove('flip');void w.offsetWidth;if(G.lastDate)w.classList.add('flip');G.lastDate=h.date}
  $('hrDate').textContent=hrDay(h.date);$('hrOpp').textContent='vs '+h.opp;
  var c=$('hrChip');c.hidden=false;c.textContent=h.home?'문학':'원정';c.className='chip'+(h.home?' home':'');
}
function setCount(){$('hrCnt').textContent=G.retry?'다시 '+(G.pos+1)+' / '+G.queue.length:Math.min(G.pos+1,G.queue.length)+' / '+G.queue.length}
function flipStrip(d,o){$('hrDate').textContent=d;$('hrOpp').textContent=o;$('hrChip').hidden=true;var w=$('hrWhen');w.classList.remove('flip');void w.offsetWidth;w.classList.add('flip');G.lastDate=''}

$('hrStart').onclick=function(){if($('hrStart').dataset.go==='box'){location.href='locker.html#balls';return}startRound()};
function startRound(){
  G.queue=nextQueue();G.asShown=false;G.as=null;G.pos=0;G.missed=[];G.retry=false;G.caught=0;G.nice=0;G.plan=G.queue.length;G.lastDate='';
  $('hrGate').hidden=true;G.state='play';launchNext(.6);loop();
}
function launchNext(delay){
  if(G.pos>=G.queue.length){
    if(!G.retry&&G.missed.length){G.retry=true;G.queue=G.missed;G.missed=[];G.pos=0;flashMsg('놓친 공이 다시 날아와요',1400);delay=1.6}
    else return endRound();
  }
  var h=HR[G.queue[G.pos]];
  if(h.i===HR_BREAK_IDX&&!G.retry&&!G.asShown){
    G.asShown=true;G.ball=null;G.next=null;G.as={t:-Math.max(0,delay-.3),then:h};
    flipStrip('올스타 브레이크','7월 11일 올스타전');return;
  }
  setStrip(h);setCount();G.wait=delay;G.next=h;G.ball=null;
}
function makeBall(h){
  var st=STAGE[stageOf(h.i)],x=DIRX[h.dir];if(x==null)x=.5;
  x=.5+(x-.5)*st.spread+(Math.random()-.5)*.12;
  var far=h.dir.indexOf('뒤')>=0;
  var wind=st.wind&&Math.random()<.5?(Math.random()<.5?-1:1)*st.wind:0;
  var dur=h.name==='최정'?CHOI_DUR:st.dur+(far?.35:-.2);
  return {h:h,t:0,call:.45,dur:dur,land0:Math.min(XMAX,Math.max(XMIN,x)),wind:wind,arc:far?.52:.2,far:far,landed:false};
}
function landX(b,t){return Math.min(XMAX,Math.max(XMIN,b.land0+b.wind*t))}

function loop(){
  cancelAnimationFrame(G.raf);G.last=performance.now();
  function step(now){
    var dt=Math.min(.05,(now-G.last)/1000);G.last=now;
    if(G.state==='play'||G.state==='replay')update(dt,now);
    drawScene(now);
    if(G.state==='play'||G.state==='replay')G.raf=requestAnimationFrame(step);
  }
  G.raf=requestAnimationFrame(step);
}
function update(dt,now){
  if(G.as){
    G.as.t+=dt;
    if(G.as.t>=AS.end){var nx=G.as.then;G.as=null;LOCKER.setSeen('allstar');
      if(!nx)return finishReplay();
      setStrip(nx);setCount();G.next=nx;G.wait=.5}
    return;
  }
  if(G.next){
    G.wait-=dt;
    if(G.wait<=0){var h=G.next;G.next=null;if(h.ground){G.gr={h:h,t:0};return}G.ball=makeBall(h)}
    return;
  }
  if(G.gr){G.gr.t+=dt;if(G.gr.t>=GR.end){var g=G.gr;G.gr=null;LOCKER.setSeen('ground');if(g.replay)return finishReplay();collect(g.h,false,true)}return}
  var b=G.ball;if(!b)return;
  if(b.call>0){b.call-=dt;return}
  b.t+=dt/b.dur;
  if(b.t>=1&&!b.landed){
    b.landed=true;b.t=1;
    var ok=Math.abs(G.gx-landX(b,1))<=TOL,nice=Math.abs(now/1000-G.lastTap)<=.2;
    if(ok)collect(b.h,nice,false);else miss(b.h);
  }
}
function collect(h,nice,ground){
  LOCKER.addBall(h.i);G.caught++;if(nice){G.nice++;LOCKER.addNice()}
  var say=ground?'그라운드 홈런! '+cardEsc(h.name)+'<small>공은 담장을 안 넘었지만 홈까지 달렸어요</small>'
    :'팡! '+cardEsc(h.name)+'<small>No.'+h.no+' · 시즌 '+h.nth+'호'+(h.title?' · '+cardEsc(h.title):'')+'</small>';
  $('hrPop').innerHTML=ballHTML(h,false)+'<div class="say">'+say+'</div>'+(nice?'<span class="nice">나이스 캐치!</span>':'');
  $('hrPop').classList.add('show');G.ball=null;
  var b2b=isBackToBack(h),st=STAGE[stageOf(h.i)];
  setTimeout(function(){$('hrPop').classList.remove('show')},ground?1700:1200);
  G.pos++;launchNext((ground?1.9:1.35)+(b2b?st.b2b:st.gap)-.6);
}
function miss(h){G.missed.push(h.i);flashMsg('앞줄 관중이 잡아갔어요',1000);G.pos++;launchNext(1.3)}
/* 같은 경기·같은 이닝에 이어지는 공이면 간격을 줄여요 */
function isBackToBack(h){var nx=HR[G.queue[G.pos+1]];return !!nx&&nx.date===h.date&&nx.inn===h.inn&&nx.home===h.home}
function flashMsg(t,ms){var m=$('hrMsg');m.textContent=t;m.classList.add('show');clearTimeout(flashMsg.k);flashMsg.k=setTimeout(function(){m.classList.remove('show')},ms)}
function endRound(){
  G.state='idle';G.ball=null;G.next=null;
  var lost=G.missed.length;
  $('hrrTitle').textContent=G.caught===G.plan?'한 개도 안 놓쳤어요':'이번 판 끝';
  $('hrrMsg').textContent=lost?'못 잡은 공 '+lost+'개는 다음 판 맨 앞에서 다시 날아와요.':'잡은 공은 공박스에 순서대로 들어갔어요.';
  $('hrrCaught').textContent=G.caught+'/'+G.plan;$('hrrNice').textContent=G.nice;$('hrrSeason').textContent=LOCKER.ballCount()+'/'+HR_TOTAL;
  $('hrResult').classList.add('show');showGate();$('hrrNext').focus();
}
$('hrrNext').onclick=function(){$('hrResult').classList.remove('show');if(nextQueue().length)startRound()};

/* 다시 보기: 그라운드 홈런 · 올스타 브레이크 (공은 새로 들어오지 않아요) */
function startReplay(kind){
  if(G.state==='play'){mgToast('지금 판을 끝낸 뒤에 다시 볼 수 있어요');return}
  $('hrGate').hidden=true;G.ball=null;G.next=null;G.state='replay';
  if(kind==='ground'){var h=HR.filter(function(x){return x.ground})[0];G.gr={h:h,t:0,replay:true};setStrip(h)}
  else{G.as={t:0,then:null};flipStrip('올스타 브레이크','7월 11일 올스타전')}
  $('hrCnt').textContent='다시 보기';loop();
}
function finishReplay(){
  G.state='idle';G.as=null;G.gr=null;G.lastDate='';
  if(G.replayBack){location.replace('locker.html#balls');return}
  showGate();
}

/* 입력: 글러브 끌기 + 누르기(나이스 캐치), 키보드 ←→ 와 스페이스 */
function px(e){var r=cv.getBoundingClientRect();return Math.min(XMAX,Math.max(XMIN,(e.clientX-r.left)/r.width))}
var dragging=false;
cv.addEventListener('pointerdown',function(e){dragging=true;cv.setPointerCapture(e.pointerId);G.gx=px(e);G.lastTap=performance.now()/1000;cv.style.cursor='grabbing';if(G.state==='idle')drawScene()});
cv.addEventListener('pointermove',function(e){if(dragging){G.gx=px(e);if(G.state==='idle')drawScene()}});
function up(){dragging=false;cv.style.cursor='grab'}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('keydown',function(e){
  if(e.key==='ArrowLeft'){G.gx=Math.max(XMIN,G.gx-.06);e.preventDefault()}
  if(e.key==='ArrowRight'){G.gx=Math.min(XMAX,G.gx+.06);e.preventDefault()}
  if(e.key===' '){G.lastTap=performance.now()/1000;e.preventDefault()}
  if(G.state==='idle')drawScene();
});
/* 다른 탭으로 가면 멈췄다가 돌아오면 이어서 */
document.addEventListener('visibilitychange',function(){if(!document.hidden&&(G.state==='play'||G.state==='replay'))loop()});
window.addEventListener('resize',sizeCanvas);
$('back').onclick=function(){location.href='bullpen.html'};

/* 확인용 (?dev) */
if(/[?&]dev\b/.test(location.search)){
  $('dev').hidden=false;
  $('dFill').onclick=function(){var l=[];for(var i=0;i<40;i++)l.push(i);LOCKER.setBalls(l);showGate();mgToast('공 40개를 채웠어요')};
  $('dBreak').onclick=function(){var l=[];for(var i=0;i<HR_BREAK_IDX;i++)l.push(i);LOCKER.setBalls(l);showGate();mgToast('올스타 브레이크 바로 앞까지 채웠어요')};
  $('dAS').onclick=function(){startReplay('allstar')};
  $('dGround').onclick=function(){startReplay('ground')};
  $('dReset').onclick=function(){LOCKER.resetBalls();G.state='idle';showGate();mgToast('공박스를 비웠어요')};
}

sizeCanvas();
if(location.hash==='#replay-ground'||location.hash==='#replay-allstar'){G.replayBack=true;startReplay(location.hash==='#replay-ground'?'ground':'allstar')}
else showGate();
