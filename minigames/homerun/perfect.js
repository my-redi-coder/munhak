/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 홈런볼 모으기: 퍼펙트 판 · 금 글러브 도전 (2026-11-01) =================
   퍼펙트 판 = 한 판의 공을 하나도 안 놓치고 전부 나이스 캐치(그라운드 홈런 장면은 잡는 공이 아니라 빼고 세요).
   - 마지막 나이스 캐치 순간: 하늘에 'N개 전부 나이스 캐치!' + 종이가루 + 글러브가 금색(✦ 반짝) + 나이스 캐치 딱지도 금색
   - 결과 화면: 빨간 PERFECT 도장 + '짐승도 울고 갈 수비…!' + 금 글러브 줄(지금까지 퍼펙트 n회)
   - 기록: LOCKER.addPerfect() (shared/store.js) → 공박스 '기념구 진열장' 옆 금 글러브 배지(locker/locker.js)
   금 글러브 도전: 시즌 143개를 다 모은 뒤 시작 화면에 열려요. 시즌 공 중 랜덤 12개(그라운드 홈런 빼고), 올스타 장면 없음,
   놓친 공 다시 오기 없음, 공박스·나이스 캐치 누적은 그대로 두고 퍼펙트 기록만 쌓여요. 판수 제한 없음.
   game.js가 부르는 것: pfPool() pfMoment() pfResult(perfect,count) pfReset(). 문구를 바꾸려면 PF만 고치면 돼요. */
var PF={banner:function(n){return n+'개 전부 나이스 캐치!'},line:'짐승도 울고 갈 수비…!',title:'퍼펙트 판!',size:12};

/* 금 글러브 도전: 시즌 공에서 랜덤 12개 (계절이 섞이면 공 속도도 공마다 그 계절대로) */
function pfPool(){
  var a=HR.filter(function(h){return !h.ground}).map(function(h){return h.i});
  for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}
  return a.slice(0,PF.size);
}

/* 금 글러브: scene.js의 글러브 모양 그대로, 색만 금색 + 반짝 (G.gold일 때) */
var _pfGlove=drawGlove;
drawGlove=function(x,y,W){
  if(!G.gold)return _pfGlove(x,y,W);
  var c=ctx,s=W*.075,k,t=performance.now()/1000;
  c.save();c.translate(x,y);
  c.fillStyle='rgba(255,210,90,.35)';c.beginPath();c.arc(0,-s*.1,s*1.7,0,7);c.fill();
  c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,s*.95,s*1.05,s*.28,0,0,7);c.fill();
  var g=c.createLinearGradient(-s,-s,s,s);g.addColorStop(0,'#FFF0B0');g.addColorStop(.5,'#E2B44A');g.addColorStop(1,'#A8761F');c.fillStyle=g;
  for(k=-2;k<=1;k++){c.beginPath();c.ellipse(k*s*.36+s*.1,-s*.55,s*.2,s*.5,k*.12,0,7);c.fill()}
  c.beginPath();c.ellipse(-s*.95,-s*.05,s*.22,s*.48,-.7,0,7);c.fill();
  c.beginPath();c.ellipse(0,0,s*.85,s*.72,0,0,7);c.fill();
  c.fillStyle='#B8862B';c.beginPath();c.ellipse(0,-s*.05,s*.5,s*.42,0,0,7);c.fill();
  c.strokeStyle='#FFF7D6';c.lineWidth=1.5;c.setLineDash([3,3]);c.beginPath();c.ellipse(0,0,s*.72,s*.6,0,0,7);c.stroke();c.setLineDash([]);
  var a=(Math.sin(t*5)+1)/2,r=s*(.25+.2*a);
  c.translate(s*.7,-s*.95);c.fillStyle='rgba(255,255,255,'+(.5+.5*a)+')';
  c.beginPath();c.moveTo(0,-r);c.quadraticCurveTo(0,0,r,0);c.quadraticCurveTo(0,0,0,r);c.quadraticCurveTo(0,0,-r,0);c.quadraticCurveTo(0,0,0,-r);c.fill();
  c.restore();
};

/* 종이가루 (필드 위 캔버스 #hrConfetti) */
var PF_CF=[],pfRaf=0;
function pfConfetti(){
  var cf=$('hrConfetti');if(!cf)return;cf.width=cv.width;cf.height=cv.height;cf.style.height=cv.style.height;
  var cols=['#c8102e','#f3c83d','#ffffff','#7db356','#ffe08a'],c=cf.getContext('2d');PF_CF=[];
  for(var i=0;i<110;i++)PF_CF.push({x:.5+(Math.random()-.5)*.3,y:.12+Math.random()*.06,vx:(Math.random()-.5)*.9,vy:-Math.random()*.7-.2,
    r:Math.random()*6.28,vr:(Math.random()-.5)*12,w:5+Math.random()*5,h:3+Math.random()*4,c:cols[i%cols.length]});
  cancelAnimationFrame(pfRaf);var last=performance.now();
  (function f(now){var dt=Math.min(.05,(now-last)/1000);last=now;c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,CW,CH);var alive=0;
    PF_CF.forEach(function(p){p.vy+=.9*dt;p.vx*=.99;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;if(p.y<1.05){alive++;
      c.save();c.translate(p.x*CW,p.y*CH);c.rotate(p.r);c.scale(1,Math.abs(Math.cos(p.r*1.7))+.2);c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore()}});
    if(alive)pfRaf=requestAnimationFrame(f);else c.clearRect(0,0,CW,CH)})(last);
}

/* 마지막 나이스 캐치 순간 */
function pfMoment(){
  G.gold=true;var b=$('hrPerfect');b.textContent=PF.banner(G.need);b.classList.remove('show');void b.offsetWidth;b.classList.add('show');
  pfConfetti();if(G.state!=='play')drawScene();
}
/* 결과 화면 꾸미기 (퍼펙트가 아니면 다 숨김) */
function pfResult(perfect,count){
  $('pfStamp').classList.remove('show');$('pfLine').hidden=!perfect;$('pfGlove').hidden=!perfect;$('hrPerfect').classList.remove('show');
  if(!perfect)return;
  $('hrrTitle').textContent=PF.title;$('pfLine').textContent=PF.line;
  $('pfGlove').innerHTML=gloveSVG()+'<span>금 글러브 하나 더! 지금까지 <b>퍼펙트 '+count+'회</b></span>';
  void $('pfStamp').offsetWidth;$('pfStamp').classList.add('show');
}
function pfReset(){G.gold=false;G.need=0;G.miss=0;G.perfect=false;$('hrPerfect').classList.remove('show');cancelAnimationFrame(pfRaf);
  var cf=$('hrConfetti');if(cf)cf.getContext('2d').clearRect(0,0,cf.width,cf.height)}
