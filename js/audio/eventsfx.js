/* ================= 이벤트 효과음 =================
   모두 효과음 채널(AU.sfx)로 나가요. 소리가 꺼져 있으면 조용히 넘어가요.
   evSound('crack') 방망이에 맞는 '딱'
   evSound('horn')  배 뱃고동 '뿌우우우' (낮은 소리 두 겹 + 항구 메아리)
   evSound('surf')  파도가 밀려와 부서지는 소리 */
var HORN_VOL=1.4;  // 뱃고동 크기 (예전 0.34)
/* 잠깐 낮추기: 관중 함성과 이벤트 배경음을 sec초 동안 줄였다가 되돌려요 */
function evDuck(sec){if(!AU.ctx)return;var t=AU.ctx.currentTime,g=AU.crowdG.gain;g.cancelScheduledValues(t);g.setTargetAtTime(.18,t,.12);g.setTargetAtTime(.9,t+sec,.6);if(typeof evBgmDuck==='function')evBgmDuck(sec)}
function evReady(){return AU.ctx&&AU.on&&AU.ctx.state==='running'}
function evSound(kind){
  if(!evReady())return;var c=AU.ctx,t=c.currentTime;
  if(kind==='crack'){
    noiseHit(t,.06,'highpass',2200,.8,.9,AU.sfx);noiseHit(t,.18,'bandpass',900,1.4,.5,AU.sfx);
    var o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(1900,t);o.frequency.exponentialRampToValueAtTime(700,t+.08);
    g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+.14);
  }else if(kind==='horn'){
    /* 휴대폰 스피커는 100Hz 아래가 거의 안 나와서, 낮은 바탕(98Hz) 위에 잘 들리는 배음(196·294Hz)을 두껍게 얹어요.
       압축기로 크게 키우고, 울리는 동안 관중 함성·이벤트 배경음을 잠깐 낮춰요(evDuck). */
    var D=3.1,out=c.createGain(),lp=c.createBiquadFilter(),cmp=c.createDynamicsCompressor(),dl=c.createDelay(1),fb=c.createGain(),wet=c.createGain();
    lp.type='lowpass';lp.frequency.setValueAtTime(600,t);lp.frequency.linearRampToValueAtTime(2200,t+.4);lp.frequency.setValueAtTime(2200,t+D-.6);lp.frequency.linearRampToValueAtTime(500,t+D+.6);lp.Q.value=1.2;
    cmp.threshold.value=-20;cmp.knee.value=8;cmp.ratio.value=6;cmp.attack.value=.01;cmp.release.value=.3;
    out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(HORN_VOL,t+.3);out.gain.setValueAtTime(HORN_VOL*.95,t+D-.5);out.gain.linearRampToValueAtTime(0,t+D+.7);
    dl.delayTime.value=.33;fb.gain.value=.35;wet.gain.value=.4;
    lp.connect(cmp);cmp.connect(out);out.connect(AU.sfx);out.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(AU.sfx);
    var vib=c.createOscillator(),vg=c.createGain();vib.frequency.value=5.2;vg.gain.value=5;vib.connect(vg);vib.start(t);vib.stop(t+D+1);
    [[98,'sawtooth',.5],[147,'sawtooth',.45],[196,'sawtooth',.55],[294,'square',.22],[392,'square',.1]].forEach(function(n){
      var o=c.createOscillator(),g=c.createGain();o.type=n[1];o.frequency.setValueAtTime(n[0]*.94,t);o.frequency.linearRampToValueAtTime(n[0],t+.3);o.frequency.setValueAtTime(n[0],t+D-.3);o.frequency.linearRampToValueAtTime(n[0]*.97,t+D+.6);
      vg.connect(o.detune);g.gain.value=n[2];o.connect(g);g.connect(lp);o.start(t);o.stop(t+D+1);
    });
    evDuck(D+.8);
    setTimeout(function(){try{fb.gain.setTargetAtTime(0,c.currentTime,.4)}catch(e){}},(D+2.5)*1000);
  }else if(kind==='surf'){
    var s=c.createBufferSource();s.buffer=AU.noise;s.loop=true;var f=c.createBiquadFilter(),sg=c.createGain();f.type='lowpass';
    f.frequency.setValueAtTime(300,t);f.frequency.linearRampToValueAtTime(900,t+1.8);f.frequency.linearRampToValueAtTime(3200,t+2.1);f.frequency.exponentialRampToValueAtTime(500,t+4.2);
    sg.gain.setValueAtTime(0,t);sg.gain.linearRampToValueAtTime(.3,t+1.9);sg.gain.linearRampToValueAtTime(.8,t+2.15);sg.gain.exponentialRampToValueAtTime(.01,t+4.4);
    s.connect(f);f.connect(sg);sg.connect(AU.sfx);s.start(t);s.stop(t+4.5);
  }
}
