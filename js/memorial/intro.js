/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/intro: 입장 + 바로 가기 =================
   · 입장: 오늘의 포토 앞으로 톡 떨어져요(움직임 줄이기 설정이면 바로 서 있음)
   · 꾸미기 창이 뜰 땐(dress.js) 으쓱이가 같은 자리에 서 있고 카메라가 앞에서 비춰요
   · 바로 가기: 아래 칩·'걸린 자리로 가기'가 화면을 잠깐 가렸다가 그 자리 앞으로 옮겨요 */
function mhLandAt(){return mhAt(0,MH.HALL.rOut-3.3)}
function mhStartIntro(){
  var PL=MH.PL,cam=MH.cam,player=MH.player,land=mhLandAt();
  player.root.position.set(land.x,0,land.z);player.root.rotation.y=0;/* 카메라 쪽을 봄 */
  if(reduceMotion){cam.yaw=0;cam.pitch=.26;cam.dist=4.4;player.root.visible=true;mhUpdateCam(1,true);mhArrive();return}
  PL.intro={t:0,land:land};player.root.visible=false;cam.yaw=Math.PI;cam.pitch=.12;cam.dist=4.4;mhUpdateCam(1,true);
}
function mhIntroTick(dt){
  var PL=MH.PL,cam=MH.cam,player=MH.player,I=PL.intro;if(!I)return;I.t+=dt;var t=I.t;
  /* 0~1.7초: 뒤의 'V6 Go for it!' 벽에서 오늘의 포토 쪽으로 돌기 */
  var u=clamp(t/1.7,0,1),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;cam.yaw=Math.PI*(1-e);cam.pitch=.12+.14*e;
  /* 1.3초부터 떨어지기 */
  var f=(t-1.3)/.5;if(f>0){player.root.visible=true;var y=f<1?2.8*(1-f*f):Math.max(0,Math.sin(Math.min(1,(f-1)/.5)*Math.PI)*.12*(1-(f-1)/.5));player.root.position.y=y;player.body.scale.set(1,f>=1&&f<1.25?.9:1,1)}
  if(t>2.4){player.root.position.y=0;player.body.scale.set(1,1,1);PL.intro=null;mhArrive()}
}
function mhArrive(){var p=MH.player;p.act='hi';setTimeout(function(){if(p.act==='hi')p.act=null},1700)}
function mhSkipIntro(){var PL=MH.PL;if(!PL.intro)return;PL.intro.t=2.5;MH.cam.yaw=0;MH.cam.pitch=.26;MH.player.root.visible=true;mhIntroTick(0)}
function mhJumpTo(s){
  var f=$('fade');f.classList.add('on');
  setTimeout(function(){var p=mhAt(s,MH.HALL.rOut-3.3),player=MH.player;player.root.position.set(p.x,0,p.z);player.root.rotation.y=Math.PI-p.t;MH.cam.yaw=-p.t;MH.cam.pitch=.26;MH.PL.target=null;player.mode='stand';mhUpdateCam(1,true);f.classList.remove('on')},reduceMotion?0:220);
}
