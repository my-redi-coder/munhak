/* ================= field play (그라운드 선수 배치) =================
   FP.mode 'defense' = 우리 팀 9명 수비 + 상대 타자
           'attack'  = 상대 팀 9명 수비 + 우리 타자·대기 타자·주루 코치
   투구 한 번(PITCH.T초)마다 투수 → 공 → 포수가 돌고, 야수는 다리 들 때 자세를 낮춰요. */
var FP={mode:store.get('fieldMode','defense'),list:[],t:0,swing:false,ball:null};
if(!FIELD_MODE[FP.mode])FP.mode='defense';
var PITCH={T:8,kick:4.5,release:5.55,arrive:5.95};
FP.ball=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),new THREE.MeshLambertMaterial({color:0xffffff}));FP.ball.visible=false;scene.add(FP.ball);

function faceTo(o,x,z){o.root.rotation.y=Math.atan2(x-o.root.position.x,z-o.root.position.z)}
function fpAdd(team,role,x,z,y,label,gear){
  var p=new Ballplayer({team:team,role:role,label:TEAMS[team].label+' '+label,gear:gear});
  p.root.position.set(x,y||0,z);scene.add(p.root);p.off=Math.random()*3;FP.list.push(p);return p;
}
function setFieldMode(m){
  FP.list.forEach(function(p){p.dispose()});FP.list=[];FP.mode=m;store.set('fieldMode',m);
  var def=m==='defense'?'home':'away',bat=m==='defense'?'away':'home',bs=bat==='home'?HOME_SIDE:-HOME_SIDE;
  DEF_KEYS.forEach(function(k){var q=POS[k],p=fpAdd(def,k,q.at[0],q.at[1],q.y,q.label);faceTo(p,0,k==='C'?-18:-4)});
  var b=fpAdd(bat,'B',-.95,0,0,'타자','bat');b.root.rotation.y=Math.PI/2;
  var d=fpAdd(bat,'D',bs*9,4,0,'대기 타자','bat');faceTo(d,0,-18);
  [[24.5,'1루 코치'],[-24.5,'3루 코치']].forEach(function(c){faceTo(fpAdd(bat,'K',c[0],-15,0,c[1],'none'),0,0)});
  FP.t=PITCH.kick-1.2;
}
function fpByRole(r){for(var i=0;i<FP.list.length;i++)if(FP.list[i].role===r)return FP.list[i]}
/* 키프레임 사이를 부드럽게 */
function fpKeys(keys,t){
  if(t<=keys[0][0])return keys[0][1];
  for(var i=1;i<keys.length;i++)if(t<keys[i][0]){var a=keys[i-1],b=keys[i],u=(t-a[0])/(b[0]-a[0]);u=u*u*(3-2*u);var o={};for(var k in a[1])o[k]=a[1][k]+(b[1][k]-a[1][k])*u;return o}
  return keys[keys.length-1][1];
}
function fpPose(over){var P=bpPose();for(var k in over)P[k]=over[k];return P}
var POSE={
  stand:fpPose({uaZ:.12,ubZ:-.12}),
  relax:fpPose({tX:.12,uaX:-.2,ubX:-.2,faX:-.6,fbX:-.6,uaZ:-.15,ubZ:.15}),
  ready:fpPose({tX:.5,thA:-.62,knA:1,thB:-.62,knB:1,spA:.32,spB:-.32,uaX:-.85,ubX:-.85,faX:-.55,fbX:-.55,uaZ:-.12,ubZ:.12}),
  crouch:fpPose({tX:.18,thA:-1.4,knA:2.35,thB:-1.4,knB:2.35,spA:.42,spB:-.42,uaX:-1.25,faX:-.5,uaZ:-.2,ubX:-.3,fbX:-1.2,ubZ:-.2}),
  arms:fpPose({uaX:-1.1,faX:-1.5,uaZ:-.55,ubX:-1.1,fbX:-1.5,ubZ:.55}),
  bat:fpPose({tX:.22,hY:1.25,thA:-.18,knA:.32,thB:-.12,knB:.32,spA:.3,spB:-.3,uaX:-1.15,uaZ:-.55,faX:-1.1,ubX:-.95,ubZ:-.1,fbX:-1.3,bX:.55,bY:0,bZ:.35})
};
var PITCHKEYS=[
  [0,fpPose({uaX:-.7,faX:-1.6,uaZ:-.5,ubX:-.7,fbX:-1.6,ubZ:.5,tX:.05})],
  [PITCH.kick,fpPose({uaX:-.7,faX:-1.6,uaZ:-.5,ubX:-.7,fbX:-1.6,ubZ:.5,tX:.05})],
  [PITCH.kick+.55,fpPose({thA:-1.45,knA:1.7,tY:.75,tX:-.05,hY:-.6,uaX:-1.5,faX:-1.4,uaZ:-.5,ubX:-1.5,fbX:-1.4,ubZ:.5})],
  [PITCH.release-.18,fpPose({thA:-.75,knA:.5,thB:.45,knB:.3,tY:.3,hY:-.25,uaX:-1.4,uaZ:.4,ubX:.4,ubZ:-1.9,fbX:-1.7,spA:.2})],
  [PITCH.release,fpPose({thA:-.85,knA:.6,thB:.6,knB:.5,tX:.55,tY:-.25,uaX:-.5,uaZ:.2,ubX:-2.9,ubZ:-.4,fbX:-.4,spA:.2})],
  [PITCH.release+.4,fpPose({thA:-.7,knA:.75,thB:.2,knB:1.1,tX:.75,tY:-.45,uaX:-.3,uaZ:.4,ubX:-.6,ubZ:.6,fbX:-.4,spA:.25})],
  [PITCH.release+1.3,fpPose({uaX:-.4,faX:-.8,ubX:-.4,fbX:-.8,tX:.1})],
  [PITCH.T,fpPose({uaX:-.7,faX:-1.6,uaZ:-.5,ubX:-.7,fbX:-1.6,ubZ:.5,tX:.05})]
];
var SWINGKEYS=(function(){var B=POSE.bat,L=fpPose({}),S=fpPose({}),F=fpPose({}),k;
  for(k in B){L[k]=B[k];S[k]=B[k];F[k]=B[k]}
  L.tY=-.35;L.thA=-.35;L.knA=.45;L.bX=.8;
  S.tY=1.0;S.hY=.4;S.thA=-.4;S.knA=.2;S.bX=1.55;S.bY=1.3;S.bZ=0;S.uaZ=-.2;S.ubZ=.3;S.uaX=-1.4;S.ubX=-1.3;
  F.tY=1.55;F.hY=-.1;F.thA=-.4;F.knA=.15;F.knB=.6;F.bX=1.2;F.bY=2.9;F.bZ=-.6;F.uaX=-1.6;F.ubX=-1.5;F.uaZ=.3;F.ubZ=.6;
  return [[0,B],[.28,L],[.42,S],[.62,F],[1.3,F],[1.9,B]]})();

function fieldTick(dt){
  if(!FP.list.length||EV.field)return;
  var t0=FP.t;FP.t=(FP.t+dt)%PITCH.T;var t=FP.t;if(t<t0)FP.swing=Math.random()<.35;
  var live=t>PITCH.kick&&t<PITCH.arrive+1.2;
  FP.list.forEach(function(p){
    p.t+=dt;var P,k=10,r=p.role,sway=Math.sin(p.t*1.4+p.off);
    if(r==='P')P=fpKeys(PITCHKEYS,t),k=0;
    else if(r==='C'){P=fpPose(POSE.crouch);if(t>PITCH.arrive-.15&&t<PITCH.arrive+.5){P.uaX=-1.45;P.tX=.08}if(t>PITCH.arrive+1.2&&t<PITCH.T-.6){P=fpPose(POSE.relax);P.tX=.3}}
    else if(r==='B'){var st=t-(PITCH.arrive-.42);P=FP.swing&&st>0?fpKeys(SWINGKEYS,st):fpPose(POSE.bat);if(!FP.swing||st<=0){P.bX+=sway*.08;P.tY=t>PITCH.kick?-.18:0}k=FP.swing&&st>0?0:8}
    else if(r==='D'){var dsw=(p.t+p.off*2)%6.5;P=dsw<1.9?fpKeys(SWINGKEYS,dsw):fpPose(POSE.bat);P.hY=dsw<1.9?P.hY:.9;k=dsw<1.9?0:8}
    else if(r==='K'){P=fpPose(POSE.arms);if(t>PITCH.arrive+.3&&t<PITCH.arrive+1.1){var cl=Math.abs(Math.sin((t-PITCH.arrive)*14));P.uaZ=-.25-.3*cl;P.ubZ=.25+.3*cl;P.faX=-1.9;P.fbX=-1.9}}
    else{P=fpPose(live?POSE.ready:POSE.relax);if(!live){P.tX+=sway*.03;P.rY=Math.sin(p.t*.35+p.off)*.12}}
    p.apply(P,k,dt);
  });
  /* 공: 손을 떠나 포수 미트로 */
  var u=(t-PITCH.release)/(PITCH.arrive-PITCH.release);
  if(u>0&&u<1){var S=PLAYER_SCALE;FP.ball.visible=true;FP.ball.position.set(-.3*S*(1-u)+.1*S*u,(1.75*S+.25)*(1-u)+.75*S*u+Math.sin(Math.PI*u)*.3,-17.4*(1-u)+(1.15-.5*S)*u)}
  else FP.ball.visible=false;
}
