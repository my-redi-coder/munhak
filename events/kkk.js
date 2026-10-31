/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 이벤트: KKK (김광현) =================
   우리 수비로 바꾸고 투수 등판을 '김광현 29'로, 왼손 투구(글러브는 오른손)로 바꿔요.
   타석마다: 왼쪽 위 카운트 S 노랑 1 → 2(박수 빨라지고 함성 커짐) → 결정구 → 삼진 자막·O 빨강 +1·K보드 카드
   1) 오프닝: 그라운드 높이 낮은 카메라, 다리 들기 → 투구 따라 흐르기 → 첫 타자 루킹 삼진 '팡!'
      → 시무룩한 1번 타자 얼굴(주근깨) → 걸어 나오는 투수 둘레를 돌아 앞모습
   2) 중계 구도(투수 등 뒤 높이): 두 번째 타자 루킹 삼진 → 시무룩한 2번 타자 얼굴(짙은 눈썹)
   3) 같은 구도: 세 번째 타자 헛스윙 삼진 (얼굴 컷 없이 바로 만세)
   4) 등 뒤 낮은 곳에서 X자 만세 전신 (천천히 조금 다가가기)  5) 눈웃음 얼굴 클로즈업  6) 전광판 K K K  7) 내 자리
   시간표(초): 타석 시작 AB, 공 도착 A, 타자 얼굴 컷 F[시작,끝], 투수 걷기 W, 만세 UP, 얼굴 FACE, 전광판 BOARD, 내 자리 BACK, 끝 END
   카운트: 타석 시작 뒤 S1·S2초에 노랑 불 */
var KK={AB:[0,9.2,14.3],A:[2.6,11.8,16.9],F:[[3.6,5.2],[12.7,14.3]],W:5.2,CUT2:9.2,CUT3:14.3,UP:17.5,FACE:20.95,BOARD:22.55,BACK:25.75,END:29.05,
  S1:.35,S2:1.0,BATTER_FACE:['sulk-freckle','sulk-brow',null],v1:new THREE.Vector3(),v2:new THREE.Vector3()};
/* 왼손잡이: 오른손 투구 키를 좌우로 뒤집어요 */
function kkMirror(P){var Q={},k;for(k in P)Q[k]=P[k];
  Q.thA=P.thB;Q.thB=P.thA;Q.knA=P.knB;Q.knB=P.knA;Q.spA=-P.spB;Q.spB=-P.spA;
  Q.uaX=P.ubX;Q.ubX=P.uaX;Q.uaY=-P.ubY;Q.ubY=-P.uaY;Q.uaZ=-P.ubZ;Q.ubZ=-P.uaZ;Q.faX=P.fbX;Q.fbX=P.faX;
  Q.tY=-P.tY;Q.tZ=-P.tZ;Q.hY=-P.hY;Q.rY=-P.rY;return Q}
KK.keys=PITCHKEYS.map(function(k){return [k[0],kkMirror(k[1])]});
KK.glove=fpPose({uaZ:.12,ubX:-1.0,fbX:-1.55,ubZ:.3,tX:.05});
/* 만세: 팔은 위로 대각선, 다리는 옆으로 대각선 — X자 */
KK.banzai=fpPose({uaX:-.12,ubX:-.12,uaZ:2.4,ubZ:-2.4,faX:0,fbX:0,spA:.42,spB:-.42,thA:0,thB:0,knA:0,knB:0,tX:-.08});
/* 삼진 당한 타자: 방망이 내리고 고개 숙여 시무룩 */
KK.sulk=(function(){var P=fpPose(POSE.bat);P.bX=1.4;P.hY=.9;P.tX=.14;return P})();
function kkWalk(ph){var s=Math.sin(ph);return fpPose({thA:-.35*s,thB:.35*s,knA:.25+.3*Math.max(0,-s),knB:.25+.3*Math.max(0,s),uaX:.3*s,uaZ:.12,ubX:-1.0,fbX:-1.55,ubZ:.3,tX:.06})}
function kkTurn(o,x,z,dt,k){var a=Math.atan2(x-o.root.position.x,z-o.root.position.z),d=a-o.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.root.rotation.y+=d*Math.min(1,k*dt)}
function kkEase(u){u=clamp(u,0,1);return u*u*(3-2*u)}
function kkLerp(a,b,u){return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
/* 타자 얼굴 카메라: 얼굴 앞에서 조금씩 다가가기 (u 0→1) */
function kkFaceCam(b,u,cut){var hp=b.head.getWorldPosition(KK.v1),fd=b.head.getWorldDirection(KK.v2),l=Math.hypot(fd.x,fd.z)||1,d=1.45-.3*u;
  evCam([hp.x+fd.x/l*d,hp.y-.12,hp.z+fd.z/l*d],[hp.x,hp.y-.04,hp.z],14,cut)}
/* 만세 카메라: 등 뒤 낮은 곳, 손끝·발끝까지 다 들어오는 거리 (세로 화면이면 더 뒤로) */
function kkBanzaiCam(u,cut){var tn=Math.tan(camera.fov*Math.PI/360),h=KK.home,d=Math.max(1.4/tn,.9/(tn*camera.aspect))*1.2*(1.1-.1*u);
  evCam([.3-.15*u,h.y+.55,h.z-d],[0,h.y+1.45,h.z],12,cut)}

EV_SCENES.kkk={
  start:function(){
    KK.prevMode=FP.mode;setFieldMode('defense');syncFieldBtns();EV.field=true;
    var p=KK.p=fpByRole('P');KK.b=fpByRole('B');KK.c=fpByRole('C');
    p.setBack('김광현',29);var g=p.arm[0].fo.children[1];if(g)p.arm[1].fo.add(g);
    KK.home=p.root.position.clone();p.root.rotation.y=0;
    KK.st={k:0,ab:-1,s:0,fc:-1,wc:false,walk:0,up:false,face:false,board:false,back:false,ph:0};
    bbShow('kkk');BBS.n=0;kbClear();evCount(0,0,0);
    var por=camera.aspect<1;KK.P0=[2.3,.85,-21.8];KK.La=por?[-.2,1.8,-17.6]:[-.6,1.7,-15.5];KK.Lb=por?[-.1,1.5,-13]:[-.2,1.2,-7];
    evCam(KK.P0,KK.La,12,true);toast(EV_TEXT.kkk.start,2400);crowdSwell(.7);
  },
  tick:function(t,dt){
    var st=KK.st,p=KK.p,b=KK.b,S=PLAYER_SCALE,P;
    kbTick(dt);
    /* 지금 몇 번째 타석인지 */
    var n=t<KK.CUT2?0:t<KK.CUT3?1:2,A=KK.A[n],ab=KK.AB[n],pt=t-A+PITCH.arrive;
    var fi=n<2&&!st.up&&t>=KK.F[n][0]&&t<KK.F[n][1];   // 타자 얼굴 컷 중
    /* 타석 시작: 타자 얼굴 바꾸기, 카운트 S 0, (두 번째부터) 마운드로 되돌리고 중계 구도 */
    if(st.ab<n){st.ab=n;st.s=0;b.setFace(KK.BATTER_FACE[n]);evCount(0,0,n);
      if(n>0){p.root.position.copy(KK.home);p.root.rotation.y=0;b.apply(fpPose(POSE.bat),0,dt);evCam([.9,6.8,-33],[-.2,.9,1],12,true)}}
    /* 카운트: 노랑 1 → 노랑 2 (박수 빨라지고 함성 커짐) */
    if(st.k===n){
      if(st.s<1&&t>=ab+KK.S1){st.s=1;evCount(0,1,n);crowdSwell(.75)}
      if(st.s<2&&t>=ab+KK.S2){st.s=2;evCount(0,2,n);crowdSwell(1.15);EV.excite=.35;evClapBuild(A-t)}
    }
    /* 투수 */
    if(!st.up){
      if(n===0&&t>KK.W){var f=clamp((t-KK.W)/2.6,0,1),dir=[Math.sin(1.27),Math.cos(1.27)];
        if(f<1){p.root.position.x=KK.home.x+dir[0]*1.8*f;p.root.position.z=KK.home.z+dir[1]*1.8*f;st.ph+=dt*6.5;p.apply(kkWalk(st.ph),8,dt)}else p.apply(KK.glove,6,dt);
        kkTurn(p,KK.home.x+dir[0]*9,KK.home.z+dir[1]*9,dt,4)}
      else p.apply(fpKeys(KK.keys,pt),0,dt);
    }
    /* 공: 왼손을 떠나 포수 미트로 */
    var u=(pt-PITCH.release)/(PITCH.arrive-PITCH.release);
    if(!st.up&&u>0&&u<1){FP.ball.visible=true;FP.ball.position.set(.3*S*(1-u)+.1*S*u,(1.75*S+.25)*(1-u)+.75*S*u+Math.sin(Math.PI*u)*.3,(KK.home.z+.8)*(1-u)+(1.15-.5*S)*u)}else FP.ball.visible=false;
    /* 타자: 앞 두 명은 그대로 보고(루킹), 세 번째는 헛스윙. 얼굴 컷 땐 고개 숙여 시무룩 */
    if(fi){b.apply(KK.sulk,6,dt);b.head.rotation.x=.24}
    else if(n===2&&pt>PITCH.arrive-.34&&!st.up)b.apply(fpKeys(SWINGKEYS,pt-(PITCH.arrive-.34)),0,dt);
    else if(pt>PITCH.arrive+.6){P=fpPose(POSE.bat);P.bX=1.4;P.hY=.3;P.tX=.05;b.apply(P,4,dt)}
    else{P=fpPose(POSE.bat);P.bX+=Math.sin(t*1.5)*.05;b.apply(P,8,dt)}
    /* 포수·야수 */
    FP.list.forEach(function(q){var r=q.role,Q;
      if(r==='P'||r==='B')return;
      if(r==='C'){Q=fpPose(POSE.crouch);if(pt>PITCH.arrive-.15&&pt<PITCH.arrive+.7)Q.uaX=-1.45;if(st.up)Q=fpPose(POSE.stand)}
      else if(r==='D'||r==='K')Q=fpPose(POSE.arms);
      else Q=fpPose(st.up?POSE.stand:pt>PITCH.kick&&pt<PITCH.arrive+.8?POSE.ready:POSE.relax);
      q.apply(Q,8,dt)});
    /* '팡!' 삼진: 자막(루킹/헛스윙), 카운트 S 꺼지고 O +1, K보드 카드(루킹은 뒤집힌 K) */
    if(st.k===n&&t>=A){st.k++;evClapStop();evSound('pop');BBS.n=st.k;BBS.t=0;evCaption(EV_TEXT.kkk.k[n],b.root,2.9,n===2?550:950,{k:true,rev:n<2});
      evCount(0,0,n+1);kbAdd(n<2);
      crowdSwell([.85,1.1,1.7][n],[5,6,8][n]);EV.excite=[.4,.6,1][n];if(n===2){evCrowdCheer(.7)}}
    /* 타자 얼굴 컷 (1·2번째 삼진 뒤) */
    if(fi){kkFaceCam(b,kkEase((t-KK.F[n][0])/1.6),st.fc!==n);st.fc=n}
    /* 오프닝 카메라: 투구 따라 흐르기 → (얼굴 컷) → 투수 둘레 돌아 앞모습 */
    else if(n===0){
      if(t<KK.W)evCam(KK.P0,kkLerp(KK.La,KK.Lb,kkEase((t-(KK.A[0]-1.1))/1.3)),12);
      else{var w=kkEase((t-KK.W)/3.6),a0=Math.atan2(KK.P0[0]-KK.home.x,KK.P0[2]-KK.home.z),a1=1.27+.28,a=a0+(a1-a0)*w,rr=4.3-1.8*w,cy=.85+.65*w,pp=p.root.position;
        evCam([pp.x+Math.sin(a)*rr,cy,pp.z+Math.cos(a)*rr],[pp.x,1.95+.15*w,pp.z],10,!st.wc);st.wc=true}
    }
    /* 만세: 등 뒤 낮은 곳에서 X자 전신, 조금씩 다가가기 */
    if(!st.up&&t>=KK.UP){st.up=true;p.root.position.copy(KK.home);p.root.rotation.y=0;FP.ball.visible=false;p.setFace('joy');kkBanzaiCam(0,true)}
    if(st.up){
      if(t<KK.FACE){P=fpPose(KK.banzai);var pm=Math.sin((t-KK.UP)*5)*.07;P.uaZ+=pm;P.ubZ-=pm;p.apply(P,9,dt);kkBanzaiCam(kkEase((t-KK.UP)/3.4),false)}
      else p.apply(fpPose(POSE.stand),5,dt);
    }
    /* 눈웃음 + 활짝 벌린 입 클로즈업 */
    if(!st.face&&t>=KK.FACE){st.face=true;evCam([.18,2.66,KK.home.z+1.25],[0,2.6,KK.home.z],8,true)}
    if(!st.board&&t>=KK.BOARD){st.board=true;BBS.n=3;BBS.t=0;evBoardCam()}
    if(!st.back&&t>=KK.BACK){st.back=true;evCountOff();evRelease(EV_TEXT.kkk.back);setTimeout(function(){evCrowdShout(LINES.kkk,EV_SHOUT_N)},700)}
    return t>=KK.END;
  },
  stop:function(){FP.ball.visible=false;evClapStop();evCountOff();kbClear();if(BBS.kind)bbShowOff();EV.field=false;setFieldMode(KK.prevMode||'defense');syncFieldBtns()}
};
