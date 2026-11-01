/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 등번호 매치 =================
   4×3 판에 선수 6명: 등번호 카드와 이름 카드를 짝지어요. 맞춘 선수는 내 라커 카드 앨범(LOCKER)에 들어가요.
   뽑기: 아직 못 모은 선수가 3배 잘 나오고, 레전더리(골드)는 가장 희귀, 스페셜(그린)은 조금 희귀. 코어(레드)는 일반과 같아요. 동명이인(SAME_NAME)은 한 판에 같이 안 나와요.
   ROSTER 전부 모으면 '덱 완성' 엔딩(한 번만). 주소 끝에 ?dev 를 붙이면 확인용 버튼이 보여요. */
var NM={PAIRS:6,W_NEW:3,W_HAVE:1,W_LEG_NEW:2,W_LEG_HAVE:.5,W_SP_NEW:2.5,W_SP_HAVE:.8};
var cards=[],open=[],lock=false,moves=0,matched=0,t0=0,timer=null,fresh=[];
var $=function(id){return document.getElementById(id)};

function nmWeight(p){var has=LOCKER.hasCard(p.no);
  if(p.tier==='legendary')return has?NM.W_LEG_HAVE:NM.W_LEG_NEW;
  if(p.tier==='special')return has?NM.W_SP_HAVE:NM.W_SP_NEW;
  return has?NM.W_HAVE:NM.W_NEW}
function nmDraw(force){
  var picks=force?[force]:[];
  while(picks.length<NM.PAIRS){
    var ban={};picks.forEach(function(p){ban[p.no]=1;if(SAME_NAME[p.no])ban[SAME_NAME[p.no]]=1});
    var pool=ROSTER.filter(function(p){return !ban[p.no]}),sum=0,i;
    for(i=0;i<pool.length;i++)sum+=nmWeight(pool[i]);
    var r=Math.random()*sum;for(i=0;i<pool.length;i++){r-=nmWeight(pool[i]);if(r<=0)break}
    picks.push(pool[Math.min(i,pool.length-1)]);
  }
  return picks;
}
function nmShuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}

function nmNew(force){
  clearInterval(timer);timer=null;open=[];lock=false;moves=0;matched=0;fresh=[];
  $('time').textContent='0:00';$('moves').textContent='0';
  var list=[];nmDraw(force).forEach(function(p){list.push({p:p,kind:'num'},{p:p,kind:'name'})});
  cards=nmShuffle(list);var b=$('board');b.innerHTML='';
  cards.forEach(function(c){
    var el=document.createElement('div');el.className='card';el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','뒤집힌 카드');
    el.innerHTML='<div class="inner">'+CARD_BACK+'<div class="side">'+cardFace(c.p,c.kind)+'</div></div>';
    el.onclick=function(){nmFlip(c)};
    el.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();nmFlip(c)}};
    c.el=el;b.appendChild(el);
  });
  nmCount();
}
function nmTick(){var s=Math.floor((Date.now()-t0)/1000);$('time').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function nmFlip(c){
  if(lock||c.up||c.done)return;
  if(!timer){t0=Date.now();timer=setInterval(nmTick,500)}
  c.up=true;c.el.classList.add('up');c.el.setAttribute('aria-label',c.kind==='num'?'등번호 '+c.p.no:'선수 '+c.p.name);
  open.push(c);if(open.length<2)return;
  moves++;$('moves').textContent=moves;
  var a=open[0],b=open[1];open=[];
  if(a.p.no===b.p.no&&a.kind!==b.kind){
    a.done=b.done=true;a.el.classList.add('done');b.el.classList.add('done');matched++;
    if(LOCKER.addCard(a.p.no)){fresh.push(a.p);nmCount()}
    if(a.p.tier!=='normal')mgToast(TIER_TAG[a.p.tier]+' '+TIER_NAME[a.p.tier]+' 카드 · '+a.p.no+' '+a.p.name,2600,true);
    if(matched===NM.PAIRS)setTimeout(nmFinish,650);
  }else{
    lock=true;
    setTimeout(function(){[a,b].forEach(function(x){x.up=false;x.el.classList.remove('up');x.el.setAttribute('aria-label','뒤집힌 카드')});lock=false},850);
  }
}
function nmCount(){$('count').textContent=LOCKER.cardCount()+'/'+ROSTER.length}
function nmFinish(){
  clearInterval(timer);timer=null;nmTick();
  $('rTime').textContent=$('time').textContent;$('rMoves').textContent=moves;$('rCount').textContent=LOCKER.cardCount()+'/'+ROSTER.length;
  $('rMsg').textContent=fresh.length?'새 카드 '+fresh.length+'장을 카드 앨범에 넣었어요.':'이번 판은 이미 모은 선수들이었어요.';
  $('rNew').innerHTML=fresh.map(function(p){return cardMini(p,true,false)}).join('');
  try{sessionStorage.setItem('nm-new',JSON.stringify(fresh.map(function(p){return p.no})))}catch(e){}
  if(LOCKER.cardCount()>=ROSTER.length&&!LOCKER.cardsDone()){LOCKER.setCardsDone(true);nmEnding();return}
  $('result').classList.add('show');$('rAgain').focus();
}

/* 덱 완성 엔딩 */
function nmEnding(){
  $('result').classList.remove('show');$('ending').classList.add('show');
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cv=$('confetti'),x=cv.getContext('2d'),W=cv.width=innerWidth,H=cv.height=innerHeight,cols=['#ffe79a','#ffffff','#f7c948','#ff8fa0'],end=Date.now()+6000,ps=[];
  for(var i=0;i<160;i++)ps.push({x:Math.random()*W,y:-Math.random()*H,vx:(Math.random()-.5)*1.6,vy:2+Math.random()*3,r:Math.random()*6.28,vr:(Math.random()-.5)*.2,w:5+Math.random()*6,h:8+Math.random()*8,c:cols[i%4]});
  (function loop(){x.clearRect(0,0,W,H);
    ps.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;if(p.y>H+20&&Date.now()<end){p.y=-20;p.x=Math.random()*W}
      x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
    if(Date.now()<end+3000&&$('ending').classList.contains('show'))requestAnimationFrame(loop);else x.clearRect(0,0,W,H)})();
}

$('restart').onclick=function(){nmNew()};
$('rAgain').onclick=function(){$('result').classList.remove('show');nmNew()};
$('back').onclick=function(){location.href='bullpen.html'};
$('endClose').onclick=function(){location.href='locker.html#cards'};

/* 확인용 (?dev) */
if(/[?&]dev\b/.test(location.search)){
  $('dev').hidden=false;
  $('dLegend').onclick=function(){nmNew(ROSTER_BY['26'])};
  $('dPeek').onclick=function(){cards.forEach(function(c){c.el.classList.toggle('up')})};
  $('dAlmost').onclick=function(){var left=ROSTER.filter(function(p){return p.tier==='legendary'})[0];
    LOCKER.setCards(ROSTER.filter(function(p){return p!==left}).map(function(p){return p.no}));LOCKER.setCardsDone(false);nmNew(left);mgToast(left.no+' '+left.name+' 한 장 남았어요')};
  $('dReset').onclick=function(){LOCKER.resetCards();nmNew();mgToast('카드 앨범을 비웠어요')};
}
nmNew();
