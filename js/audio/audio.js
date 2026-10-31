/* ================= audio ================= */
var AU={ctx:null,on:store.get('soundOn',true),vol:store.get('vol',{amb:70,beat:80,sfx:70}),beatOn:false,t0:0,file:null,el:null,src:null,timer:null};
var BPM=128,SPB=60/BPM,STEP=SPB/4,FILE_BPM=126;
var MEL=[[0,67,2],[2,67,2],[4,69,2],[6,72,4],[12,69,2],[14,67,2],[16,72,2],[18,72,2],[20,74,2],[22,76,4],[28,74,2],[30,72,2],[32,69,2],[34,72,2],[36,69,2],[38,67,4],[44,64,2],[46,67,2],[48,72,2],[50,74,2],[52,76,2],[54,79,6]];
var MELMAP={};MEL.forEach(function(m){MELMAP[m[0]]=m});
var ROOTS=[36,33,29,31];
function hz(m){return 440*Math.pow(2,(m-69)/12)}
function auEnsure(){
  if(AU.ctx){if(AU.on&&!document.hidden&&AU.ctx.state==='suspended')AU.ctx.resume();return true}
  var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  var c;try{c=AU.ctx=new AC()}catch(e){return false}
  AU.master=c.createGain();AU.master.gain.value=AU.on?1:0;AU.master.connect(c.destination);
  AU.amb=c.createGain();AU.beat=c.createGain();AU.sfx=c.createGain();
  [AU.amb,AU.beat,AU.sfx].forEach(function(g){g.connect(AU.master)});applyVol();
  var len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0),b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
  for(var i=0;i<len;i++){var w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+w*.5362)*.11}
  AU.noise=buf;
  var wn=c.createBuffer(1,c.sampleRate*.5,c.sampleRate),wd=wn.getChannelData(0);for(i=0;i<wd.length;i++)wd[i]=Math.random()*2-1;AU.white=wn;
  var src=c.createBufferSource();src.buffer=buf;src.loop=true;
  var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=650;bp.Q.value=.45;
  AU.crowdG=c.createGain();AU.crowdG.gain.value=.5;
  src.connect(bp);bp.connect(AU.crowdG);AU.crowdG.connect(AU.amb);src.start();
  var lfo=c.createOscillator();lfo.frequency.value=.08;var lg=c.createGain();lg.gain.value=.12;lfo.connect(lg);lg.connect(AU.crowdG.gain);lfo.start();
  AU.beatBus=c.createGain();AU.beatBus.gain.value=.55;AU.beatBus.connect(AU.beat);
  setInterval(function(){if(AU.ctx&&AU.ctx.state==='running'&&Math.random()<.5)chirp()},5200);
  return true;
}
function applyVol(){if(!AU.ctx)return;var t=AU.ctx.currentTime;AU.amb.gain.setTargetAtTime(AU.vol.amb/100,t,.05);AU.beat.gain.setTargetAtTime(AU.vol.beat/100,t,.05);AU.sfx.gain.setTargetAtTime(AU.vol.sfx/100,t,.05)}
function setSound(on){AU.on=on;store.set('soundOn',on);if(on){auEnsure();if(AU.ctx&&AU.ctx.state==='suspended'&&!document.hidden)AU.ctx.resume()}if(AU.master)AU.master.gain.setTargetAtTime(on?1:0,AU.ctx.currentTime,.05);if(AU.el){if(!on)AU.el.pause();else if(AU.beatOn&&AU.file)AU.el.play().catch(function(){})}drawSoundIcon()}
function crowdSwell(level,dur){if(!AU.ctx)return;var t=AU.ctx.currentTime,g=AU.crowdG.gain;g.cancelScheduledValues(t);g.setTargetAtTime(level,t,.4);if(dur)g.setTargetAtTime(.5,t+dur,1.2)}
function noiseHit(t,dur,type,freq,q,gain,dest){var c=AU.ctx,s=c.createBufferSource();s.buffer=AU.white;var f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q||1;var g=c.createGain();g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(f);f.connect(g);g.connect(dest||AU.beatBus);s.start(t);s.stop(t+dur+.02)}
function drum(t,v){var c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(48,t+.22);g.gain.setValueAtTime(.95*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.38);o.connect(g);g.connect(AU.beatBus);o.start(t);o.stop(t+.4);noiseHit(t,.03,'lowpass',2500,.7,.25*v)}
function clap(t,v){v=v||1;for(var i=0;i<3;i++)noiseHit(t+i*.011,.09,'bandpass',1500,.9,.45*v)}
function hat(t){noiseHit(t,.045,'highpass',7500,.7,.16)}
function bass(t,m,d){var c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=hz(m);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.42,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AU.beatBus);o.start(t);o.stop(t+d+.02)}
function brass(t,m,d){var c=AU.ctx,f=c.createBiquadFilter(),g=c.createGain();f.type='lowpass';f.Q.value=2;f.frequency.setValueAtTime(700,t);f.frequency.linearRampToValueAtTime(2600,t+.05);f.frequency.exponentialRampToValueAtTime(1300,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.025);g.gain.setValueAtTime(.14,t+d*.8);g.gain.exponentialRampToValueAtTime(.001,t+d+.08);f.connect(g);g.connect(AU.beatBus);[-8,8].forEach(function(dt){var o=c.createOscillator();o.type='sawtooth';o.frequency.value=hz(m);o.detune.value=dt;o.connect(f);o.start(t);o.stop(t+d+.1)})}
function stepAt(i,t){var s=i%64,b=s%16;if(b%4===0)drum(t,b===0?1:.72);if(b===4||b===12)clap(t);if(s===56||s===58)clap(t,1.15);if(b%4===2)hat(t);if(b===0||b===6||b===8||b===14)bass(t,ROOTS[Math.floor(s/16)],STEP*(b===6||b===14?1.6:3));var m=MELMAP[s];if(m)brass(t,m[1],m[2]*STEP)}
function beatStart(){
  if(!auEnsure()||!AU.on)return;
  var c=AU.ctx;AU.beatOn=true;crowdSwell(.85);
  if(AU.file&&AU.el){AU.el.currentTime=0;AU.el.play().catch(function(){});return}
  if(songStart())return;
  AU.beatBus.gain.cancelScheduledValues(c.currentTime);AU.beatBus.gain.setValueAtTime(.55,c.currentTime);
  AU.t0=c.currentTime+.06;var next=AU.t0,step=0;
  clearInterval(AU.timer);AU.timer=setInterval(function(){while(next<c.currentTime+.14){stepAt(step,next);next+=STEP;step++}},25);
}
function beatStop(){
  AU.beatOn=false;clearInterval(AU.timer);AU.timer=null;
  if(AU.el)AU.el.pause();songStop();
  if(AU.ctx){var t=AU.ctx.currentTime;AU.beatBus.gain.setTargetAtTime(0,t,.08);crowdSwell(.5)}
}
function beatPos(now){
  if(AU.beatOn&&AU.ctx&&AU.ctx.state==='running'){
    if(AU.file&&AU.el&&!AU.el.paused)return AU.el.currentTime*FILE_BPM/60;
    if(songPlaying())return songBeat();
    if(!AU.file&&!SONG.cur)return Math.max(0,(AU.ctx.currentTime-AU.t0)/SPB);
  }
  return now*BPM/60;
}
function sfx(kind){
  if(!AU.ctx||!AU.on||AU.ctx.state!=='running')return;var c=AU.ctx,t=c.currentTime,o,g;
  if(kind==='tap'){o=c.createOscillator();g=c.createGain();o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1320,t+.06);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+.14)}
  else if(kind==='sit'){o=c.createOscillator();g=c.createGain();o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(70,t+.12);g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+.2)}
  else if(kind==='angry'){o=c.createOscillator();g=c.createGain();var f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=900;o.type='sawtooth';o.frequency.setValueAtTime(140,t);o.frequency.linearRampToValueAtTime(95,t+.35);g.gain.setValueAtTime(.0,t);g.gain.linearRampToValueAtTime(.18,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(f);f.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+.42);crowdSwell(.7,1.5)}
  else if(kind==='whoosh'){var s=c.createBufferSource();s.buffer=AU.white;var bf=c.createBiquadFilter();bf.type='bandpass';bf.Q.value=1.2;bf.frequency.setValueAtTime(400,t);bf.frequency.exponentialRampToValueAtTime(2400,t+.3);g=c.createGain();g.gain.setValueAtTime(.0,t);g.gain.linearRampToValueAtTime(.3,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+.4);s.connect(bf);bf.connect(g);g.connect(AU.sfx);s.start(t);s.stop(t+.42)}
}
function chirp(){var c=AU.ctx,t=c.currentTime;for(var i=0;i<3;i++){var o=c.createOscillator(),g=c.createGain(),tt=t+i*.13;o.type='sine';o.frequency.setValueAtTime(3100,tt);o.frequency.linearRampToValueAtTime(4300,tt+.05);o.frequency.linearRampToValueAtTime(3300,tt+.09);g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.035,tt+.01);g.gain.exponentialRampToValueAtTime(.001,tt+.1);o.connect(g);g.connect(AU.amb);o.start(tt);o.stop(tt+.12)}}
document.addEventListener('visibilitychange',function(){if(!AU.ctx)return;if(document.hidden){AU.ctx.suspend();if(AU.el)AU.el.pause()}else if(AU.on){AU.ctx.resume();if(AU.beatOn&&AU.file&&AU.el)AU.el.play().catch(function(){})}});
