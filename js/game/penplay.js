/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 불펜 선수 (작은 패치 AE, 2026-11-09) =================
   world/bullpen.js가 만든 불펜 칸 안에 선수를 세워요. 1루 = 우리 팀(home), 3루 = 상대 팀(away). 공수 모드(FP.mode)와 상관없이 늘 있어요.
   · 열린 쪽(폴 쪽) 끝에 포수가 쪼그려 앉고, 포스터 지붕 아래 마운드에서 투수가 포수에게 던져요(PITCH 시간표 그대로, 8초마다 한 번).
   · 대기 선수 둘은 벤치에 앉아 있어요. 크기는 PEN.scale(1.0 = 실제 비율), 그라운드 선수(PLAYER_SCALE 1.25)보다 작아요.
   · 카메라가 멀면(PENP.near m 밖) 움직임을 쉬어 가볍게. 선수를 누르면 이름표(input.js가 PENP.list를 같이 봐요).
   · fieldplay.js(fpKeys·PITCHKEYS·POSE·PITCH) 다음에 불려야 해요. 숫자는 PENP 한 곳. */
var PENP={list:[],pens:[],near:170,t:[0,3.1]};
var PEN_SIT=fpPose({thA:-1.45,knA:1.5,thB:-1.45,knB:1.5,spA:.08,spB:-.08,tX:.1,uaX:-.45,faX:-.95,ubX:-.45,fbX:-.95,uaZ:.1,ubZ:-.1});
(function(){
  [[1,'home'],[-1,'away']].forEach(function(e,idx){
    var side=e[0],team=e[1],fl=PEN.floor;
    function add(role,l,d,label,gear,y){
      var q=PEN.pt(side,l,d),p=new Ballplayer({team:team,role:role,label:TEAMS[team].label+' '+label,gear:gear});
      p.root.scale.setScalar(PEN.scale);p.root.position.set(q.x,y,q.z);scene.add(p.root);p.off=Math.random()*3;p.pen=idx;PENP.list.push(p);return p;
    }
    var mo=PEN.pt(side,PEN.catcherAt+PEN.plate,PEN.d),pl=PEN.pt(side,PEN.catcherAt,PEN.d);
    var pit=add('P',PEN.catcherAt+PEN.plate,PEN.d,'불펜 투수',null,fl+.24),cat=add('C',PEN.catcherAt,PEN.d,'불펜 포수',null,fl);
    faceTo(pit,pl.x,pl.z);faceTo(cat,mo.x,mo.z);
    var sit=[8.6,11.6].map(function(l){var w=add('W',l,PEN.benchD,'대기 선수','none',fl);var q=PEN.pt(side,l,PEN.benchD);faceTo(w,q.x-q.n[0]*5,q.z-q.n[1]*5);return w});
    var ball=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),new THREE.MeshLambertMaterial({color:0xffffff}));ball.visible=false;scene.add(ball);
    PENP.pens.push({side:side,p:pit,c:cat,w:sit,ball:ball,mo:mo,pl:pl,c0:PEN.center(side),on:true});
  });
})();
function penTick(dt){
  if(!PENP.pens.length)return;
  PENP.pens.forEach(function(pn,i){
    var dx=camera.position.x-pn.c0.x,dz=camera.position.z-pn.c0.z,near=dx*dx+dz*dz<PENP.near*PENP.near;
    if(!near){if(pn.on){pn.on=false;pn.ball.visible=false}return}pn.on=true;
    var t0=PENP.t[i];PENP.t[i]=(t0+dt)%PITCH.T;var t=PENP.t[i];
    pn.p.t+=dt;pn.p.apply(fpKeys(PITCHKEYS,t),0,dt);
    var P=fpPose(POSE.crouch);
    if(t>PITCH.arrive-.15&&t<PITCH.arrive+.5){P.uaX=-1.45;P.tX=.08}
    if(t>PITCH.arrive+1.2&&t<PITCH.T-.6){P=fpPose(POSE.relax);P.tX=.3}
    pn.c.t+=dt;pn.c.apply(P,10,dt);
    pn.w.forEach(function(w){w.t+=dt;var Q=fpPose(PEN_SIT);Q.tX+=Math.sin(w.t*1.1+w.off)*.03;Q.hY=Math.sin(w.t*.45+w.off)*.4;w.apply(Q,8,dt)});
    /* 공: 투수 손 → 포수 미트 */
    var u=(t-PITCH.release)/(PITCH.arrive-PITCH.release);
    if(u>0&&u<1){var fl=PEN.floor,S=PEN.scale;pn.ball.visible=true;
      pn.ball.position.set(pn.mo.x*(1-u)+pn.pl.x*u,(fl+.24+1.75*S)*(1-u)+(fl+.6*S)*u+Math.sin(Math.PI*u)*.25,pn.mo.z*(1-u)+pn.pl.z*u)}
    else pn.ball.visible=false;
  });
}
