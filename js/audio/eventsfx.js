/* ================= 이벤트 효과음 =================
   모두 효과음 채널(AU.sfx)로 나가요. 소리가 꺼져 있으면 조용히 넘어가요.
   evSound('crack') 방망이에 맞는 '딱'
   evSound('horn')  배 뱃고동 '뿌우우우' (낮은 소리 두 겹 + 항구 메아리)
   evSound('surf')  파도가 밀려와 부서지는 소리
   evClapBuild(초) / evClapStop()  2스트라이크 때 빨라지는 관중 박수 */
var HORN_VOL=1.4;  // 뱃고동 크기 (예전 0.34)
/* 방망이 '딱' 소리 숫자(Hz=높낮이, vol=크기). 더 묵직하게: body·low를 낮추고 lowVol·tail을 올려요. 더 날카롭게: clickHz·click을 올려요 */
var CRACK={clickHz:2600,click:.5,noiseHz:700,noise:.6,tailHz:380,tail:.5,body:[520,230],bodyVol:.75,bodyDur:.15,low:[170,80],lowVol:.7};
/* 잠깐 낮추기: 관중 함성과 이벤트 배경음을 sec초 동안 줄였다가 되돌려요 */
function evDuck(sec){if(!AU.ctx)return;var t=AU.ctx.currentTime,g=AU.crowdG.gain;g.cancelScheduledValues(t);g.setTargetAtTime(.18,t,.12);g.setTargetAtTime(.9,t+sec,.6);if(typeof evBgmDuck==='function')evBgmDuck(sec)}
function evReady(){return AU.ctx&&AU.on&&AU.ctx.state==='running'}
function evSound(kind){
  if(!evReady())return;var c=AU.ctx,t=c.currentTime;
  if(kind==='pop'){
    /* 미트에 꽂히는 '팡!': 짧고 단단한 가죽 소리 + 낮은 울림 */
    noiseHit(t,.05,'bandpass',1400,1.1,1.1,AU.sfx);noiseHit(t,.12,'lowpass',420,.8,.7,AU.sfx);
    var po=c.createOscillator(),pg=c.createGain();po.type='sine';po.frequency.setValueAtTime(190,t);po.frequency.exponentialRampToValueAtTime(70,t+.12);
    pg.gain.setValueAtTime(.6,t);pg.gain.exponentialRampToValueAtTime(.001,t+.16);po.connect(pg);pg.connect(AU.sfx);po.start(t);po.stop(t+.18);
  }else if(kind==='crack'){
    /* (작은 패치 P) 묵직한 '딱': 예전엔 높은 소리(1900Hz·2200Hz 이상)뿐이라 '띡'이었어요.
       나무 방망이 몸통 소리(200~500Hz)와 낮은 '퉁'(100~180Hz)을 더하고 높은 딸깍은 짧게 줄였어요. 숫자는 맨 위 CRACK에서 고쳐요. */
    var K=CRACK;
    noiseHit(t,.022,'highpass',K.clickHz,.8,K.click,AU.sfx);   // 맞는 순간 짧은 딸깍
    noiseHit(t,.11,'bandpass',K.noiseHz,1.3,K.noise,AU.sfx);   // 나무 부딪히는 마른 소리
    noiseHit(t,.26,'lowpass',K.tailHz,.8,K.tail,AU.sfx);       // 뒤에 남는 낮은 울림
    var o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(K.body[0],t);o.frequency.exponentialRampToValueAtTime(K.body[1],t+.09);
    g.gain.setValueAtTime(K.bodyVol,t);g.gain.exponentialRampToValueAtTime(.001,t+K.bodyDur);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+K.bodyDur+.02);   // 몸통 '딱'
    var o2=c.createOscillator(),g2=c.createGain();o2.type='sine';o2.frequency.setValueAtTime(K.low[0],t);o2.frequency.exponentialRampToValueAtTime(K.low[1],t+.2);
    g2.gain.setValueAtTime(K.lowVol,t);g2.gain.exponentialRampToValueAtTime(.001,t+.22);o2.connect(g2);g2.connect(AU.sfx);o2.start(t);o2.stop(t+.24);   // 낮은 '퉁'(무게감)
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
/* 2스트라이크 박수: dur초 동안 관중 박수가 점점 빨라지고 커져요(관중 함성 채널). evClapStop()으로 바로 끊어요 */
var EVCLAP={g:null};
function evClapBuild(dur){
  if(!evReady())return;evClapStop();var c=AU.ctx,t0=c.currentTime+.05,g=EVCLAP.g=c.createGain();g.gain.value=1;g.connect(AU.amb);
  for(var t=0;t<dur;){var u=t/dur,v=.18+.32*u;for(var j=0;j<6;j++)noiseHit(t0+t+Math.random()*.035,.08,'bandpass',rnd(1200,2200),.9,v*rnd(.6,1),g);t+=.5-.36*u}
}
function evClapStop(){if(!EVCLAP.g||!AU.ctx)return;var g=EVCLAP.g;EVCLAP.g=null;g.gain.setTargetAtTime(0,AU.ctx.currentTime,.04);setTimeout(function(){try{g.disconnect()}catch(e){}},700)}
