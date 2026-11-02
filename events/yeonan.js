/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 이벤트: 8회말 여난부두 응원 =================
   구장 조명이 꺼지고, 관중석에 폰 불빛이 하나둘 켜져 다 같이 좌우로 흔들며 떼창해요.
   낮 경기·밤 경기 어느 쪽에서 시작해도 불이 꺼졌다가, 끝나면 시작했던 모습으로 돌아와요(2026-11-01).
   음원 EV_BGM.yeonan, 가사 YEONAN.lyrics (core/config.js) — 둘 다 사용자가 events/ 폴더에 직접 올려요.
   가사 파일은 가사 싱크 도구에서 만든 {lines:[{t,e,text}]}. 없으면 가사 없이, 음원이 없으면 YEONAN.NO_SONG초 동안 돌아요.
   흐름: 암전(0~DARK) → 불빛 번짐 → 노래(SONG_AT부터) 동안 카메라가 구장 곳곳을 비춤 → 마지막은 내 자리 → 불 켜지며 끝
   카메라 순서(노래 길이 비율): 와이드 → 관중석 파노라마 → 응원석 가까이 → 외야에서 홈 쪽 → 하늘 위 은하수 → 내 자리 */
function ynEase(u){u=clamp(u,0,1);return u*u*(3-2*u)}
function ynLerp(a,b,u){return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
var YN={DARK:3.2,SONG_AT:3.6,OUT:3,lyrics:null,lyrTried:false,pts:null};
YN.SHOTS=[[0,'wide'],[.1,'pan'],[.27,'close'],[.43,'outfield'],[.58,'drone'],[.8,'seat']];

/* ---- 가사 파일: 처음 한 번만 불러 둬요 ---- */
function ynLoadLyrics(){
  if(YN.lyrTried)return;YN.lyrTried=true;
  fetch(YEONAN.lyrics,{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(d){
    if(d&&Array.isArray(d.lines))YN.lyrics=d.lines.filter(function(l){return typeof l.t==='number'&&l.text});
  }).catch(function(){console.info('여난부두 가사 파일이 없어요: '+YEONAN.lyrics)});
}

/* ---- 밤으로: 조명·하늘·안개·구름을 n(0 지금 모습 ~ 1 불 꺼진 밤)만큼 ----
   시작할 때마다 지금 모습(낮 경기든 밤 경기든, world/daynight.js)을 기억해 두고, 끝나면 그대로 돌아가요.
   조명탑 불빛·별은 dnEventDark(n)가 맡아요. */
function ynNightSetup(){
  if(YN.lit)return;var L=YN.lit=[];
  scene.children.forEach(function(o){if(o.isLight)L.push([o,o.intensity]);if(o.material&&o.material.uniforms&&o.material.uniforms.top)YN.sky=o.material.uniforms});
  YN.skyDay=['top','mid','bot'].map(function(k){return YN.sky?YN.sky[k].value.clone():null});
  YN.skyNight=[new THREE.Color(0x070d22),new THREE.Color(0x101a38),new THREE.Color(0x1d2546)];
  YN.fogDay=scene.fog.color.clone();YN.fogNight=new THREE.Color(0x0d1428);
  YN.cloudOp=clouds.map(function(c){return c.material.opacity});
}
function ynNight(n){
  ynNightSetup();YN.n=n;
  YN.lit.forEach(function(l){l[0].intensity=l[1]*(1-.8*n)});
  if(YN.sky)['top','mid','bot'].forEach(function(k,i){YN.sky[k].value.copy(YN.skyDay[i]).lerp(YN.skyNight[i],n)});
  scene.fog.color.copy(YN.fogDay).lerp(YN.fogNight,n);
  clouds.forEach(function(c,i){c.material.opacity=YN.cloudOp[i]*(1-.85*n)});
  dnEventDark(n);
}

/* ---- 관중석 불빛: 관중 무리 + 장식 관중석 자리마다 하나 (Points 한 덩어리) ---- */
function ynBuildLights(){
  if(YN.pts)return;var src=[],i,b=crowd.base,v=new THREE.Vector3();
  for(i=0;i<crowdSpots.length;i++)src.push(b[i*4],b[i*4+1]+1.74,b[i*4+2],b[i*4+3],i);
  decorSeats.forEach(function(d){if(d.blk===ZB.hog)return;/* 꽃돼지 현수막 자리는 관중이 없어서 불빛도 없음(작은 패치 M) */
    if(Math.random()<.55){v.set(d.s.x,d.s.y,d.s.z);d.blk.g.localToWorld(v);src.push(v.x,v.y+1.62,v.z,d.blk.cfg.theta,-1)}});
  var N=Math.min(src.length/5,7000);
  var P=YN.P={N:N,base:new Float32Array(N*4),ci:new Int32Array(N),ph:new Float32Array(N),on:new Float32Array(N),col:new Float32Array(N*3)};
  for(i=0;i<N;i++){var k=i*5;P.base.set([src[k],src[k+1],src[k+2],src[k+3]],i*4);P.ci[i]=src[k+4];
    P.ph[i]=rnd(-.35,.35)+src[k]*.006;var cool=Math.random()<.18;P.col.set(cool?[.82,.9,1]:[1,.93,.76],i*3)}
  var g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(N*3),3).setUsage(THREE.DynamicDrawUsage));
  YN.pts=new THREE.Points(g,new THREE.PointsMaterial({size:.95,map:glowTex(),vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
  YN.pts.frustumCulled=false;
}
function ynLights(lt,fade){
  var P=YN.P,pos=YN.pts.geometry.attributes.position.array,col=YN.pts.geometry.attributes.color.array,w=TAU/YEONAN.SWAY;
  for(var i=0;i<P.N;i++){
    var j=i*4,a=clamp((lt-P.on[i])/.7,0,1)*fade;if(P.ci[i]>=0&&crowd.hidden[P.ci[i]])a=0;
    var s=Math.sin(T*w+P.ph[i]),th=P.base[j+3],d=.34*s;
    pos[i*3]=P.base[j]+Math.cos(th)*d;pos[i*3+1]=P.base[j+1]-Math.abs(s)*.07;pos[i*3+2]=P.base[j+2]-Math.sin(th)*d;
    var tw=a*(.82+.18*Math.sin(T*2.7+i));col[i*3]=P.col[i*3]*tw;col[i*3+1]=P.col[i*3+1]*tw;col[i*3+2]=P.col[i*3+2]*tw;
  }
  YN.pts.geometry.attributes.position.needsUpdate=true;YN.pts.geometry.attributes.color.needsUpdate=true;
}

/* ---- 내 자리·주변 으쓱이 불빛 켜기/끄기 ---- */
function ynPeopleOn(){
  if(player.mode==='sit'&&PL.seat){YN.mySeat=PL.seat;standAtSeat(player,PL.seat,curBlock)}
  player.setAct('light');player.root.rotation.y=Math.PI;
  npcs.forEach(function(n){n.follow=true;n.evFollow=true;n.want='light';n.joinAt=rnd(.3,5)});
}
function ynPeopleOff(){
  if(player&&player.act==='light')player.setAct(null);
  if(YN.mySeat){sitChar(player,YN.mySeat);PL.seat=YN.mySeat;YN.mySeat=null}
  npcs.forEach(function(n){if(n.act==='light')npcStop(n);n.follow=false;n.evFollow=false;n.ai=rnd(4,10)});
}

/* ---- 노래방 가사 ---- */
function ynLyricEl(){
  if(!YN.el){YN.el=document.createElement('div');YN.el.className='ylyric';YN.el.setAttribute('aria-live','off');
    YN.el.innerHTML='<p class="box"><span class="cur"></span></p><p class="nxt"></p>';document.body.appendChild(YN.el)}
  return YN.el;
}
function ynLyric(st){
  if(YN.lyrics&&typeof ribbonFeed==='function')ribbonFeed(YN.lyrics,st);/* 띠 전광판에도 같은 가사 (world/ribbon.js) */
  var L=YN.lyrics,el=YN.el;if(!L||!L.length||!el)return;
  var ci=-1;for(var i=0;i<L.length;i++){var e=L[i].e!=null?L[i].e:(L[i+1]?L[i+1].t:L[i].t+4);if(st>=L[i].t&&st<e){ci=i;var p=(st-L[i].t)/Math.max(.3,e-L[i].t)}}
  var up=ci<0?L.filter(function(l){return l.t>st})[0]:null;
  var cur=ci>=0?L[ci]:(up&&up.t-st<2.5?up:null),nxt=ci>=0?L[ci+1]:null;
  var c=el.querySelector('.cur'),n=el.querySelector('.nxt');
  if(c.textContent!==(cur?cur.text:''))c.textContent=cur?cur.text:'';
  c.style.setProperty('--p',(ci>=0?clamp(p,0,1)*100:0).toFixed(1)+'%');
  if(n.textContent!==(nxt?nxt.text:''))n.textContent=nxt?nxt.text:'';
  el.classList.toggle('on',!!cur);
}

/* ---- 카메라: 장면마다 시작→끝으로 천천히 흘러가요 ---- */
function ynShot(name,u){
  var V=YN.V;u=ynEase(u);
  if(name==='wide')return [ynLerp([0,27,42],[0,21,26],u),[0,7,-70]];
  if(name==='pan'){var a=V.out,b=V.ussk,c=V.inf,l=u<.5?ynLerp(a,b,u*2):ynLerp(b,c,u*2-1);return [ynLerp([-8,5,-34],[-10,6,-22],u),[l[0],l[1]+2,l[2]]]}
  if(name==='close'){var f=V.fw,o=V.ussk,d=14-6*u;return [[o[0]+f[0]*d,o[1]+2.6+u,o[2]+f[2]*d],[o[0],o[1]+2.2,o[2]]]}
  if(name==='outfield')return [ynLerp([-14,24,-112],[10,20,-104],u),[4,4,4]];
  if(name==='drone'){var r=34,an=-.7+1.4*u;return [[Math.sin(an)*r,118-14*u,-44+Math.cos(an)*r],[0,0,-46]]}
  return null;
}
function ynCam(lt,frac){
  if(lt<YN.SONG_AT){var w=ynShot('wide',0);evCam(w[0],w[1],2.2,lt<.05);return}
  var i=YN.SHOTS.length-1;while(i>0&&frac<YN.SHOTS[i][0])i--;
  var s0=YN.SHOTS[i][0],s1=i+1<YN.SHOTS.length?YN.SHOTS[i+1][0]:1,nm=YN.SHOTS[i][1];
  if(nm==='seat'){EV.cam=null;return}
  var sh=ynShot(nm,clamp((frac-s0)/(s1-s0),0,1));evCam(sh[0],sh[1],1.4);
}

EV_SCENES.yeonan={
  start:function(){
    YN.lit=null;/* 지금 모습(낮·밤 경기)을 새로 기억 */
    ynLoadLyrics();ynBuildLights();
    var P=YN.P;for(var i=0;i<P.N;i++)P.on[i]=YN.DARK+rnd(0,6.5)*Math.pow(Math.random(),.6);
    scene.add(YN.pts);ynLights(0,0);
    var v=new THREE.Vector3();function bc(k){blockCenter(ZB[k],v);return [v.x,v.y,v.z]}
    var th=ZB.ussk.cfg.theta;YN.V={ussk:bc('ussk'),inf:bc('infield'),out:bc('outfield'),fw:[-Math.sin(th),0,-Math.cos(th)]};
    YN.st={song:false,songOk:false,end:null,on:false,shout:0};YN.dur=YEONAN.NO_SONG;
    YN.primed=evBgmPrime('yeonan');/* 버튼 누른 직후에 미리 재생(소리 0) → 노래 시작 때 막히지 않게 */
    bbShow('yeonan');ynCam(0,0);ynLyricEl();
    toast(EV_TEXT.yeonan.start,2400);crowdSwell(.5);EV.excite=.1;
  },
  tick:function(t,dt){
    var st=YN.st;
    /* 암전 → (끝날 때) 다시 밝게 */
    var n=st.end==null?clamp(t/YN.DARK,0,1):1-clamp((t-st.end)/YN.OUT,0,1);ynNight(n*n*(3-2*n));
    if(!st.on&&t>YN.DARK){st.on=true;ynPeopleOn();toast(EV_TEXT.yeonan.on,2400);crowdSwell(.7)}
    /* 노래 시작 */
    if(!st.song&&t>=YN.SONG_AT){st.song=true;st.t0=t;st.songOk=YN.primed?evBgmGo():evBgmPlay('yeonan');if(!st.songOk&&!AU.on)toast(EV_TEXT.yeonan.mute,2800);
      if(st.songOk)crowdSwell(.2);/* 떼창이 또렷하게: 노래 동안 평소 함성을 낮춰요(끝날 때 크게 터짐) */
      EV.excite=.25}
    /* 노래 시계: 음원이 돌면 음원 시간, 아니면 장면 시간 */
    var el=EVB.el,st_=0;
    if(st.song){
      if(st.songOk&&el&&el.error)st.songOk=false;
      var playing=st.songOk&&el&&!el.paused&&el.currentTime>0;
      st_=playing?el.currentTime:t-st.t0;
      if(st.songOk&&el&&isFinite(el.duration)&&el.duration>0)YN.dur=el.duration;
      else if(YN.lyrics&&YN.lyrics.length&&!st.songOk){var la=YN.lyrics[YN.lyrics.length-1];YN.dur=Math.max(YEONAN.NO_SONG,(la.e||la.t+4)+2)}
      ynLyric(st_);
      if(st.end==null&&(st_>=YN.dur||(st.songOk&&el&&el.ended))){st.end=t;evBgmStop(1.5);YN.el.classList.remove('on');crowdSwell(1.6,6);evCrowdCheer(.7);ynPeopleOff();
        setTimeout(function(){if(EV.run===EV_SCENES.yeonan)evCrowdShout(LINES.yeonan,3)},900)}
      /* 노래 중간중간 주변 으쓱이 말풍선 */
      if(st.end==null&&st_>st.shout*40+20&&st.shout<3){st.shout++;evCrowdShout(LINES.yeonan,1)}
    }
    var frac=st.song?clamp(st_/YN.dur,0,1):0;
    if(st.end==null)ynCam(t,frac);
    ynLights(t,st.end==null?1:1-clamp((t-st.end)/(YN.OUT*.8),0,1));
    if(st.end!=null&&t>=st.end+YN.OUT){evRelease(EV_TEXT.yeonan.back);return true}
    return false;
  },
  stop:function(){
    ynNight(0);if(YN.pts&&YN.pts.parent)scene.remove(YN.pts);
    if(YN.el)YN.el.classList.remove('on');evBgmStop(.8);ynPeopleOff();if(!YN.st||YN.st.end==null)crowdSwell(.5);YN.primed=false;
    if(BBS.kind)bbShowOff();BBS.cyc=null;
  }
};
