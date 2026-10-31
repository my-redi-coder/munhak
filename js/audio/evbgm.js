/* ================= 이벤트 배경음 =================
   이벤트마다 정해 둔 음원 파일(EV_BGM, core/config.js)을 틀어요. 소리는 '응원 비트' 채널(AU.beat).
   evBgmPlay(id) → 틀었으면 true / evBgmPrime(id) 소리 0으로 미리 재생 → evBgmGo() 처음부터 키우기 / evBgmStop(fadeSec) / evBgmDuck(sec): 뱃고동처럼 잠깐 낮췄다 돌아오기 */
var EVB={el:null,gain:null,on:false,BASE:.9};
function evBgmPlay(id){return evBgmPrime(id)&&evBgmGo()}
/* 미리 준비: 버튼 누른 직후(이벤트 start)에 소리 0으로 재생을 시작해 둬요.
   폰 브라우저는 '누르고 한참 뒤에 처음 나오는 소리'를 막기도 해서, 나중에 시작하는 노래는 이걸 먼저 불러요. */
function evBgmPrime(id){
  var url=EV_BGM[id];if(!url||!auEnsure()||!AU.on)return false;var c=AU.ctx;
  if(!EVB.el){EVB.el=new Audio();EVB.el.playsInline=true;EVB.el.preload='auto';EVB.gain=c.createGain();try{c.createMediaElementSource(EVB.el).connect(EVB.gain);EVB.gain.connect(AU.beat)}catch(e){}}
  EVB.gain.gain.cancelScheduledValues(c.currentTime);EVB.gain.gain.setValueAtTime(0,c.currentTime);
  if(EVB.el.getAttribute('src')!==url)EVB.el.src=url;
  try{EVB.el.currentTime=0}catch(e){}
  EVB.on=true;EVB.el.play().catch(function(){});return true;
}
/* 진짜 시작: 처음부터, 소리를 서서히 키워요 */
function evBgmGo(){
  if(!EVB.el||!EVB.on)return false;var c=AU.ctx;
  try{EVB.el.currentTime=0}catch(e){}
  if(EVB.el.paused)EVB.el.play().catch(function(){});
  EVB.gain.gain.cancelScheduledValues(c.currentTime);EVB.gain.gain.setValueAtTime(0,c.currentTime);EVB.gain.gain.linearRampToValueAtTime(EVB.BASE,c.currentTime+.6);
  return !EVB.el.error;
}
function evBgmStop(fade){
  if(!EVB.el||!EVB.on)return;EVB.on=false;var t=AU.ctx.currentTime,el=EVB.el;fade=fade||.4;
  EVB.gain.gain.cancelScheduledValues(t);EVB.gain.gain.setTargetAtTime(0,t,fade/3);setTimeout(function(){if(!EVB.on)el.pause()},fade*1000+100);
}
function evBgmDuck(sec){if(!EVB.on)return;var t=AU.ctx.currentTime,g=EVB.gain.gain;g.cancelScheduledValues(t);g.setTargetAtTime(EVB.BASE*.15,t,.12);g.setTargetAtTime(EVB.BASE,t+sec,.6)}
document.addEventListener('visibilitychange',function(){if(!EVB.el||!EVB.on)return;if(document.hidden)EVB.el.pause();else if(AU.on)EVB.el.play().catch(function(){})});
