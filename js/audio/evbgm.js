/* ================= 이벤트 배경음 =================
   이벤트마다 정해 둔 음원 파일(EV_BGM, core/config.js)을 틀어요. 소리는 '응원 비트' 채널(AU.beat).
   evBgmPlay(id) → 틀었으면 true / evBgmStop(fadeSec) / evBgmDuck(sec): 뱃고동처럼 잠깐 낮췄다 돌아오기 */
var EVB={el:null,gain:null,on:false,BASE:.9};
function evBgmPlay(id){
  var url=EV_BGM[id];if(!url||!auEnsure()||!AU.on)return false;var c=AU.ctx;
  if(!EVB.el){EVB.el=new Audio();EVB.el.playsInline=true;EVB.gain=c.createGain();try{c.createMediaElementSource(EVB.el).connect(EVB.gain);EVB.gain.connect(AU.beat)}catch(e){}}
  EVB.el.src=url;EVB.el.currentTime=0;
  EVB.gain.gain.cancelScheduledValues(c.currentTime);EVB.gain.gain.setValueAtTime(0,c.currentTime);EVB.gain.gain.linearRampToValueAtTime(EVB.BASE,c.currentTime+.6);
  EVB.on=true;EVB.el.play().catch(function(){});return true;
}
function evBgmStop(fade){
  if(!EVB.el||!EVB.on)return;EVB.on=false;var t=AU.ctx.currentTime,el=EVB.el;fade=fade||.4;
  EVB.gain.gain.cancelScheduledValues(t);EVB.gain.gain.setTargetAtTime(0,t,fade/3);setTimeout(function(){if(!EVB.on)el.pause()},fade*1000+100);
}
function evBgmDuck(sec){if(!EVB.on)return;var t=AU.ctx.currentTime,g=EVB.gain.gain;g.cancelScheduledValues(t);g.setTargetAtTime(EVB.BASE*.15,t,.12);g.setTargetAtTime(EVB.BASE,t+sec,.6)}
document.addEventListener('visibilitychange',function(){if(!EVB.el||!EVB.on)return;if(document.hidden)EVB.el.pause();else if(AU.on)EVB.el.play().catch(function(){})});
