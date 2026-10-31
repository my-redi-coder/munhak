/* ================= 이벤트: 최정 홈런 =================
   우리 공격으로 바꾸고 타자 등판을 '최정 14'로 켜요. 방망이를 높이 세운 자세 → 다리 들고 → 딱!
   공은 3루 쪽 외야 너머 그린존으로. 빅보드는 파도 영상 + 뱃고동 → 파란 바탕 HOME RUN.
   타자는 방망이를 툭 던지고 베이스를 돌아 홈에서 대기 타자와 손을 맞춰요.
   시간표(초): 공 맞음 TC, 공 떨어짐 TC+FD, 빅보드 BOARD, HOME RUN HR, 와이드 WIDE, 내 자리 BACK, 끝 END */
var HR={TC:3.0,FD:4.4,BOARD:8.6,HRT:12.6,WIDE:15.2,BACK:19.6,END:25,RUN:2.3,SPD:6.8,AP:42};
HR.land=(function(){var a=-33*Math.PI/180,p=gzP(a,129);return new THREE.Vector3(p[0],gzY(129),p[1])})();
HR.from=new THREE.Vector3(.25,1.3,-.35);
HR.dir=new THREE.Vector3(HR.land.x-HR.from.x,0,HR.land.z-HR.from.z).normalize();
HR.ball=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),new THREE.MeshBasicMaterial({color:0xffffff}));HR.ball.visible=false;scene.add(HR.ball);
HR.trailN=26;HR.trail=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(HR.trailN*3),3)),new THREE.PointsMaterial({color:0xffffff,size:5,sizeAttenuation:false,transparent:true,opacity:.75,depthWrite:false}));
HR.trail.visible=false;HR.trail.frustumCulled=false;scene.add(HR.trail);
HR.dot=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3)),new THREE.PointsMaterial({color:0xffffff,size:9,sizeAttenuation:false,depthWrite:false}));HR.dot.frustumCulled=false;HR.ball.add(HR.dot);
HR.path=[[19.4,-19.4],[0,-38.8],[-19.4,-19.4],[0,0]];
/* 최정 자세: 방망이를 머리 뒤로 높이 세우고 무릎을 깊게 */
HR.stance=fpPose({tX:.26,hY:1.25,thA:-.3,knA:.55,thB:-.22,knB:.55,spA:.34,spB:-.34,uaX:-1.45,uaZ:-.5,faX:-1.25,ubX:-1.15,ubZ:-.05,fbX:-1.45,bX:.25,bY:0,bZ:.3});
HR.keys=(function(){var C=HR.stance,K=fpPose({}),L=fpPose({}),S=fpPose({}),F=fpPose({}),W=fpPose({}),R=fpPose({}),k;
  for(k in C){K[k]=C[k];L[k]=C[k]}
  K.thA=-.95;K.knA=1.3;K.tY=-.32;K.bX=.4;K.tX=.3;
  L.tY=-.42;L.thA=-.38;L.knA=.4;L.spA=.5;L.bX=.85;L.knB=.75;
  for(k in SWINGKEYS[2][1])S[k]=SWINGKEYS[2][1][k];S.thA=-.45;S.spA=.5;S.tY=1.05;
  for(k in SWINGKEYS[3][1])F[k]=SWINGKEYS[3][1][k];F.tY=1.7;F.uaX=-2;F.ubX=-1.8;F.bY=3.2;F.thA=-.42;F.spA=.5;
  for(k in F)W[k]=F[k];W.tX=.05;W.tY=1.25;W.hY=.95;W.uaX=-.7;W.ubX=-1.1;W.uaZ=.15;W.ubZ=.45;W.faX=-.4;W.fbX=-.9;W.bX=2.1;W.bY=1.6;W.knA=.2;W.knB=.25;
  R=fpPose({tY:.9,hY:.9,tX:.08,uaZ:.15,ubZ:-.15,thA:-.15,knA:.2,spA:.15,spB:-.15});
  return [[-1.25,C],[-.6,K],[-.16,L],[0,S],[.2,F],[.8,F],[1.35,W],[1.7,W],[2.2,R]]})();
function hrRunPose(ph){var s=Math.sin(ph),c=Math.max(0,Math.sin(ph+1.2)),d=Math.max(0,Math.sin(ph+1.2+Math.PI));
  return fpPose({tX:.26,thA:-.28-.72*s,knA:.45+.85*c,thB:-.28+.72*s,knB:.45+.85*d,spA:.08,spB:-.08,uaX:.75*s,ubX:-.75*s,faX:-1.5,fbX:-1.5,uaZ:.15,ubZ:-.15})}
function hrBallAt(u,out){var e=1-Math.pow(1-u,1.18);out.set(HR.from.x+(HR.land.x-HR.from.x)*e,HR.from.y+(HR.land.y-HR.from.y)*u+4*HR.AP*u*(1-u),HR.from.z+(HR.land.z-HR.from.z)*e);return out}
function hrTurn(p,x,z,dt,k){var a=Math.atan2(x-p.root.position.x,z-p.root.position.z),d=a-p.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));p.root.rotation.y+=d*Math.min(1,(k||5)*dt)}
/* 빅보드가 화면에 꽉 차는 카메라 거리 (세로 화면이면 더 뒤로, 홈 위까지만) */
function hrBoardCam(){var tn=Math.tan(camera.fov*Math.PI/360),d=Math.max(46,BB.W*.5/(tn*camera.aspect)+4,BB.H*.9/tn);d=Math.min(d,-BB.Z-2);evCam([0,BB.CY+2,BB.Z+d],[0,BB.CY,BB.Z],8,true)}

EV_SCENES.homer={
  start:function(){
    HR.prevMode=FP.mode;setFieldMode('attack');syncFieldBtns();EV.field=true;
    HR.b=fpByRole('B');HR.p=fpByRole('P');HR.d=fpByRole('D');HR.b.setBack('최정',14);
    HR.b.root.position.set(-.95,0,0);HR.b.root.rotation.y=Math.PI/2;
    HR.st={hit:false,land:false,board:0,leg:0,ph:0,dist:0,home:false,toss:false,sw:false};
    HR.tbuf=[];HR.ball.visible=false;HR.trail.visible=false;
    var por=camera.aspect<1;evCam(por?[-3.2,2.5,7.6]:[-6.4,2.2,1.9],por?[-.3,1.4,-6]:[.8,1.5,-7],6,true);
    toast(EV_TEXT.homer.start,2600);HR.bgm=evBgmPlay('homer');HR.cv=HR.bgm?.55:1;crowdSwell(.75*HR.cv);
  },
  tick:function(t,dt){
    var st=HR.st,b=HR.b,cs=t-HR.TC,S=PLAYER_SCALE;
    /* 투수: 미리 정해 둔 투구 키프레임을 '공 도착 = TC'에 맞춰 재생 */
    var pt=t-HR.TC+PITCH.arrive;
    if(!st.hit){HR.p.apply(fpKeys(PITCHKEYS,pt),0,dt);hrPreField(pt,dt)}
    hrOnDeck(t,dt);
    var u=(pt-PITCH.release)/(PITCH.arrive-PITCH.release);
    if(!st.hit&&u>0&&u<1){FP.ball.visible=true;FP.ball.position.set(-.3*S*(1-u)+.1*S*u,(1.75*S+.25)*(1-u)+(HR.from.y)*u+Math.sin(Math.PI*u)*.3,-17.4*(1-u)+HR.from.z*u)}else FP.ball.visible=false;
    /* 타자 */
    if(cs<HR.RUN){var P=cs<-1.25?fpPose(HR.stance):fpKeys(HR.keys,cs);if(cs<-1.25)P.bX+=Math.sin(t*1.6)*.06;b.apply(P,cs<-1.25?8:0,dt)}
    if(!st.toss&&cs>1.55){st.toss=true;b.bat.visible=false;HR.loose=hrLooseBat(b)}
    if(HR.loose)hrLooseTick(HR.loose,dt);
    /* 맞는 순간 */
    if(!st.hit&&cs>=0){st.hit=true;evSound('crack');crowdSwell(1.5*HR.cv,9);EV.excite=.7;toast(EV_TEXT.homer.hit,2000);HR.ball.visible=true;HR.trail.visible=true;
      HR.p.apply(fpPose(POSE.stand),0,dt);cam.cur.y+=.12}
    /* 공 비행 + 카메라 */
    if(st.hit){
      var f=clamp(cs/HR.FD,0,1),bp=HR.ball.position;
      if(f<1)hrBallAt(f,bp);else{var hb=clamp((cs-HR.FD)/.6,0,1);bp.set(HR.land.x+HR.dir.x*2.2*hb,HR.land.y+.14+Math.sin(Math.PI*hb)*1.1,HR.land.z+HR.dir.z*2.2*hb)}
      HR.tbuf.unshift(bp.clone());if(HR.tbuf.length>HR.trailN)HR.tbuf.pop();
      var arr=HR.trail.geometry.attributes.position.array;for(var i=0;i<HR.trailN;i++){var q=HR.tbuf[Math.min(i,HR.tbuf.length-1)];arr[i*3]=q.x;arr[i*3+1]=q.y;arr[i*3+2]=q.z}
      HR.trail.geometry.attributes.position.needsUpdate=true;HR.trail.visible=f<1;
      if(cs>.45&&f<.8){var D=HR.dir;evCam([bp.x-D.x*13,bp.y+2.6,bp.z-D.z*13],[bp.x+D.x*10,bp.y-1.5,bp.z+D.z*10],cs<.55?30:18,cs<.5)}
      else if(f>=.8&&t<HR.BOARD){var la=-24*Math.PI/180,lp=gzP(la,103);evCam([lp[0],19,lp[1]],[HR.land.x,HR.land.y+2,HR.land.z],2.4)}
      if(!st.land&&f>=1){st.land=true;toast(EV_TEXT.homer.land,2200);evCrowdCheer(.7);crowdSwell(1.6*HR.cv,7)}
      hrFielders(t,dt,cs);
    }
    /* 빅보드: 파도 + 뱃고동 → HOME RUN */
    if(st.board===0&&t>=HR.BOARD){st.board=1;HR.ball.visible=false;bbShow('wave');hrBoardCam();setTimeout(function(){if(EV.run===EV_SCENES.homer)evSound('horn')},250);setTimeout(function(){if(EV.run===EV_SCENES.homer)evSound('surf')},800)}
    if(st.board===1&&t>=HR.HRT){st.board=2;bbShow('homerun');crowdSwell(1.8*HR.cv,8);EV.excite=1}
    if(st.board===2&&t>=HR.WIDE){st.board=3;evCam(camera.aspect<1?[16,26,34]:[34,24,30],camera.aspect<1?[2,9,-60]:[-6,7,-48],6,true)}
    if(st.board===3&&t>=HR.BACK){st.board=4;evRelease(EV_TEXT.homer.back);setTimeout(function(){evCrowdShout(LINES.homer,3)},700)}
    /* 주루 */
    if(cs>=HR.RUN&&!st.home)hrRun(dt);
    if(st.home)hrHighFive(t,dt);
    return t>=HR.END;
  },
  stop:function(){
    evBgmStop(1.5);HR.ball.visible=false;HR.trail.visible=false;FP.ball.visible=false;if(HR.loose){scene.remove(HR.loose.m);HR.loose=null}
    if(BBS.kind)bbShowOff();EV.field=false;setFieldMode(HR.prevMode||'attack');syncFieldBtns();
  }
};
/* 야수: 공 쪽으로 몸을 돌려 바라봐요. 좌익수는 담장 쪽으로 몇 걸음 뛰다 멈춰요 */
function hrFielders(t,dt,cs){
  var bp=HR.ball.position;
  FP.list.forEach(function(p){
    var r=p.role;if(r==='B'||r==='D')return;
    if(r==='K'){var near=HR.b.root.position.distanceTo(p.root.position)<14,P=fpPose(POSE.arms);if(near||HR.st.land){var cl=Math.abs(Math.sin(t*12));P.uaZ=-.25-.3*cl;P.ubZ=.25+.3*cl;P.faX=-1.9;P.fbX=-1.9}hrTurn(p,HR.b.root.position.x,HR.b.root.position.z,dt,4);p.apply(P,8,dt);return}
    if(r==='LF'&&cs<2){var dx=HR.land.x-p.root.position.x,dz=HR.land.z-p.root.position.z,L=Math.hypot(dx,dz);p.root.position.x+=dx/L*6*dt;p.root.position.z+=dz/L*6*dt;p.apply(hrRunPose(t*9),0,dt)}
    else p.apply(fpPose(cs<1.4&&r!=='C'&&r!=='P'?POSE.ready:POSE.stand),5,dt);
    if(cs<HR.FD+.6)hrTurn(p,bp.x,bp.z,dt,r==='C'?3:5);
  });
}
/* 맞기 전: 투수가 다리를 들면 야수는 자세를 낮추고, 포수는 앉아서 미트를 내밀어요 */
function hrPreField(pt,dt){var live=pt>PITCH.kick;FP.list.forEach(function(p){var r=p.role,P;
  if(r==='P'||r==='B'||r==='D')return;
  if(r==='C'){P=fpPose(POSE.crouch);if(pt>PITCH.arrive-.4)P.uaX=-1.45}else if(r==='K')P=fpPose(POSE.arms);else P=fpPose(live?POSE.ready:POSE.relax);
  p.apply(P,8,dt)})}
/* 방망이 툭: 손을 떠나 앞으로 빙글 돌며 떨어져요 */
function hrLooseBat(b){var m=new THREE.Mesh(bpGeo('home').bat,MVC);m.scale.setScalar(PLAYER_SCALE);b.bat.getWorldPosition(m.position);b.bat.getWorldQuaternion(m.quaternion);scene.add(m);return {m:m,v:new THREE.Vector3(1.6,2.4,-.9),w:new THREE.Vector3(5,1,7),t:0}}
function hrLooseTick(L,dt){if(L.t>2)return;L.t+=dt;L.v.y-=9.8*dt;L.m.position.addScaledVector(L.v,dt);if(L.m.position.y<.05){L.m.position.y=.05;L.v.set(L.v.x*.3,Math.abs(L.v.y)*.25,L.v.z*.3);L.w.multiplyScalar(.4)}L.m.rotation.x+=L.w.x*dt;L.m.rotation.z+=L.w.z*dt}
/* 베이스 돌기 */
function hrRun(dt){
  var st=HR.st,b=HR.b,tg=HR.path[st.leg],dx=tg[0]-b.root.position.x,dz=tg[1]-b.root.position.z,L=Math.hypot(dx,dz),step=HR.SPD*dt;
  if(L<step){b.root.position.x=tg[0];b.root.position.z=tg[1];st.leg++;if(st.leg>=HR.path.length){st.home=true;st.homeT=EV.t;return}}
  else{b.root.position.x+=dx/L*step;b.root.position.z+=dz/L*step}
  hrTurn(b,tg[0],tg[1],dt,8);st.ph+=step*1.45;b.apply(hrRunPose(st.ph),6,dt);
}
/* 홈에서 대기 타자와 두 손 하이파이브 */
function hrHighFive(t,dt){
  var b=HR.b,d=HR.d,k=t-HR.st.homeT,up=fpPose({uaX:-2.7,ubX:-2.7,faX:-.2,fbX:-.2,uaZ:-.15,ubZ:.15,tX:-.05});
  hrTurn(b,d.root.position.x,d.root.position.z,dt,6);b.apply(k<1.4?up:fpPose(POSE.stand),7,dt);
}
function hrOnDeck(t,dt){var d=HR.d;if(!d)return;var tx=1.6,tz=1.4,dx=tx-d.root.position.x,dz=tz-d.root.position.z,L=Math.hypot(dx,dz);
  if(L>.15&&t>HR.BACK-2){d.root.position.x+=dx/L*2.2*dt;d.root.position.z+=dz/L*2.2*dt}
  hrTurn(d,HR.b.root.position.x,HR.b.root.position.z,dt,5);
  var P=HR.st.home&&t-HR.st.homeT<1.4?fpPose({uaX:-2.7,ubX:-2.7,faX:-.2,fbX:-.2,uaZ:-.15,ubZ:.15}):fpPose(POSE.arms);if(HR.st.land&&!HR.st.home){var cl=Math.abs(Math.sin(t*11));P.uaZ=-.25-.3*cl;P.ubZ=.25+.3*cl;P.faX=-1.9;P.fbX=-1.9}d.apply(P,8,dt)}
