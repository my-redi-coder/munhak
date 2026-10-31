/* ================= 이벤트: KKK (김광현) =================
   우리 수비로 바꾸고 투수 등판을 '김광현 29'로, 왼손 투구(글러브는 오른손)로 바꿔요.
   1) 오프닝: 그라운드 높이 낮은 카메라, 다리 들기 → 투구 따라 흐르기 → 첫 타자 루킹 삼진 '팡!' → 걸어 나오는 투수 둘레를 돌아 앞모습
   2) 중계 구도(투수 등 뒤 높이): 두 번째 타자 루킹 삼진
   3) 같은 구도: 세 번째 타자 헛스윙 삼진
   4) 등 뒤 낮은 곳에서 올려다보는 만세 (천천히 다가가기)  5) 얼굴 클로즈업  6) 전광판 K K K  7) 내 자리
   시간표(초): 공 도착 A1·A2·A3, 만세 컷 UP, 얼굴 FACE, 전광판 BOARD, 내 자리 BACK, 끝 END */
var KK={A:[1.1,7.85,11.35],CUT2:6.0,CUT3:9.4,UP:11.95,FACE:15.4,BOARD:17.0,BACK:20.2,END:23.5};
/* 왼손잡이: 오른손 투구 키를 좌우로 뒤집어요 */
function kkMirror(P){var Q={},k;for(k in P)Q[k]=P[k];
  Q.thA=P.thB;Q.thB=P.thA;Q.knA=P.knB;Q.knB=P.knA;Q.spA=-P.spB;Q.spB=-P.spA;
  Q.uaX=P.ubX;Q.ubX=P.uaX;Q.uaY=-P.ubY;Q.ubY=-P.uaY;Q.uaZ=-P.ubZ;Q.ubZ=-P.uaZ;Q.faX=P.fbX;Q.fbX=P.faX;
  Q.tY=-P.tY;Q.tZ=-P.tZ;Q.hY=-P.hY;Q.rY=-P.rY;return Q}
KK.keys=PITCHKEYS.map(function(k){return [k[0],kkMirror(k[1])]});
KK.glove=fpPose({uaZ:.12,ubX:-1.0,fbX:-1.55,ubZ:.3,tX:.05});
KK.banzai=fpPose({uaX:-2.95,ubX:-2.95,uaZ:-.3,ubZ:.3,faX:-.25,fbX:-.25,tX:-.14});
function kkWalk(ph){var s=Math.sin(ph);return fpPose({thA:-.35*s,thB:.35*s,knA:.25+.3*Math.max(0,-s),knB:.25+.3*Math.max(0,s),uaX:.3*s,uaZ:.12,ubX:-1.0,fbX:-1.55,ubZ:.3,tX:.06})}
function kkTurn(o,x,z,dt,k){var a=Math.atan2(x-o.root.position.x,z-o.root.position.z),d=a-o.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.root.rotation.y+=d*Math.min(1,k*dt)}
function kkEase(u){u=clamp(u,0,1);return u*u*(3-2*u)}
function kkLerp(a,b,u){return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}

EV_SCENES.kkk={
  start:function(){
    KK.prevMode=FP.mode;setFieldMode('defense');syncFieldBtns();EV.field=true;
    var p=KK.p=fpByRole('P');KK.b=fpByRole('B');KK.c=fpByRole('C');
    p.setBack('김광현',29);var g=p.arm[0].fo.children[1];if(g)p.arm[1].fo.add(g);
    KK.home=p.root.position.clone();p.root.rotation.y=0;
    KK.st={k:0,walk:0,up:false,face:false,board:false,back:false,ph:0};
    bbShow('kkk');BBS.n=0;
    var por=camera.aspect<1;KK.P0=[2.3,.85,-21.8];KK.La=por?[-.2,1.8,-17.6]:[-.6,1.7,-15.5];KK.Lb=por?[-.1,1.5,-13]:[-.2,1.2,-7];
    evCam(KK.P0,KK.La,12,true);toast(EV_TEXT.kkk.start,2400);crowdSwell(.7);
  },
  tick:function(t,dt){
    var st=KK.st,p=KK.p,b=KK.b,c=KK.c,S=PLAYER_SCALE,i;
    /* 지금 몇 번째 공인지: 다음 도착 시각 기준 */
    var n=t<KK.CUT2?0:t<KK.CUT3?1:2,A=KK.A[n],pt=t-A+PITCH.arrive;
    /* 컷: 마운드로 되돌리기 */
    if(n>0&&!st['cut'+n]){st['cut'+n]=true;p.root.position.copy(KK.home);p.root.rotation.y=0;b.apply(fpPose(POSE.bat),0,dt);
      evCam([.9,6.8,-33],[-.2,.9,1],12,true)}
    /* 투수 */
    if(!st.up){
      if(n===0&&t>2){var f=clamp((t-2)/2.6,0,1),dir=[Math.sin(1.27),Math.cos(1.27)];
        if(f<1){p.root.position.x=KK.home.x+dir[0]*1.8*f;p.root.position.z=KK.home.z+dir[1]*1.8*f;st.ph+=dt*6.5;p.apply(kkWalk(st.ph),8,dt)}else p.apply(KK.glove,6,dt);
        kkTurn(p,KK.home.x+dir[0]*9,KK.home.z+dir[1]*9,dt,4)}
      else p.apply(fpKeys(KK.keys,pt),0,dt);
    }
    /* 공: 왼손을 떠나 포수 미트로 */
    var u=(pt-PITCH.release)/(PITCH.arrive-PITCH.release);
    if(!st.up&&u>0&&u<1){FP.ball.visible=true;FP.ball.position.set(.3*S*(1-u)+.1*S*u,(1.75*S+.25)*(1-u)+.75*S*u+Math.sin(Math.PI*u)*.3,(KK.home.z+.8)*(1-u)+(1.15-.5*S)*u)}else FP.ball.visible=false;
    /* 타자: 앞 두 명은 그대로 보고(루킹), 세 번째는 헛스윙 */
    if(n===2&&pt>PITCH.arrive-.34&&!st.up)b.apply(fpKeys(SWINGKEYS,pt-(PITCH.arrive-.34)),0,dt);
    else if(pt>PITCH.arrive+.6){var P=fpPose(POSE.bat);P.bX=1.4;P.hY=.3;P.tX=.05;b.apply(P,4,dt)}
    else{P=fpPose(POSE.bat);P.bX+=Math.sin(t*1.5)*.05;b.apply(P,8,dt)}
    /* 포수·야수 */
    FP.list.forEach(function(q){var r=q.role,Q;
      if(r==='P'||r==='B')return;
      if(r==='C'){Q=fpPose(POSE.crouch);if(pt>PITCH.arrive-.15&&pt<PITCH.arrive+.7)Q.uaX=-1.45;if(st.up)Q=fpPose(POSE.stand)}
      else if(r==='D'||r==='K')Q=fpPose(POSE.arms);
      else Q=fpPose(st.up?POSE.stand:pt>PITCH.kick&&pt<PITCH.arrive+.8?POSE.ready:POSE.relax);
      q.apply(Q,8,dt)});
    /* '팡!' 삼진 */
    if(st.k===n&&t>=A){st.k++;evSound('pop');BBS.n=st.k;BBS.t=0;evCaption(EV_TEXT.kkk.k,b.root,2.9,n===2?550:1500);
      crowdSwell([.85,1.1,1.7][n],[5,6,8][n]);EV.excite=[.4,.6,1][n];if(n===2){evCrowdCheer(.7)}}
    /* 오프닝 카메라: 투구 따라 흐르기 → 투수 둘레 돌아 앞모습 */
    if(n===0){
      if(t<2)evCam(KK.P0,kkLerp(KK.La,KK.Lb,kkEase(t/1.3)),12);
      else{var w=kkEase((t-2)/3.6),a0=Math.atan2(KK.P0[0]-KK.home.x,KK.P0[2]-KK.home.z),a1=1.27+.28,a=a0+(a1-a0)*w,rr=4.3-1.8*w,cy=.85+.65*w,pp=p.root.position;
        evCam([pp.x+Math.sin(a)*rr,cy,pp.z+Math.cos(a)*rr],[pp.x,1.95+.15*w,pp.z],10)}
    }
    /* 만세: 등 뒤 낮은 곳에서 올려다보며 천천히 다가가기 */
    if(!st.up&&t>=KK.UP){st.up=true;p.root.position.copy(KK.home);p.root.rotation.y=0;FP.ball.visible=false;evCam([.35,.55,KK.home.z-3.4],[0,2.9,KK.home.z+.4],20,true)}
    if(st.up){
      if(t<KK.FACE){p.apply(KK.banzai,9,dt);var v=kkEase((t-KK.UP)/3.4);evCam(kkLerp([.35,.55,KK.home.z-3.4],[.25,.8,KK.home.z-2.2],v),[0,2.9,KK.home.z+.4],20)}
      else p.apply(fpPose(POSE.stand),5,dt);
    }
    if(!st.face&&t>=KK.FACE){st.face=true;evCam([.18,2.66,KK.home.z+1.25],[0,2.6,KK.home.z],8,true)}
    if(!st.board&&t>=KK.BOARD){st.board=true;BBS.n=3;BBS.t=0;evBoardCam()}
    if(!st.back&&t>=KK.BACK){st.back=true;evRelease(EV_TEXT.kkk.back);setTimeout(function(){evCrowdShout(LINES.kkk,3)},700)}
    return t>=KK.END;
  },
  stop:function(){FP.ball.visible=false;if(BBS.kind)bbShowOff();EV.field=false;setFieldMode(KK.prevMode||'defense');syncFieldBtns()}
};
