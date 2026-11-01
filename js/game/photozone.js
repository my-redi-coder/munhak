/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 포토존 진행 =================
   '내 위치' → 둘러보기에서 pzStart('pz' | 'hr'). 세트(world/pzone.js, world/hrboard.js)는 야구장 밖 떨어진 곳에 처음 갈 때 지어요.
   - 사진용 으쓱이: 내 으쓱이(유니폼·등판)를 본떠 따로 세워요. 내 자리·행동은 그대로 두고 돌아오면 이어져요.
   - 카메라: 정면에서 좌우로만(PZ.pan, 살짝 돌아가는 느낌), 두 손가락·휠로 가까이/멀리(PZ.zoom: 화면에 꽉 맞는 거리의 배수).
   - 으쓱이를 누른 채 끌면 세트 앞 줄(standZ)을 따라 좌우로 옮겨요. '비키기'로 잠깐 숨겨요.
   - 포즈는 PZ_POSE(아래). entities/character.js의 update가 act 이름으로 여기서 찾아 써요.
   화면 버튼은 ui/photozone-ui.js, 찍기는 ui/photo.js(포토존은 폴라로이드 틀의 사진 칸만 잘라 폴라로이드로 저장). */
var PZ={on:false,key:null,set:null,ch:null,pan:0,zoom:1,pose:null,hidden:false,grab:false,gOff:0};
var _pzP=new THREE.Plane(new THREE.Vector3(0,0,1),0),_pzV=new THREE.Vector3();

/* 포즈: 팔(aZ 위로 들기·aX 앞으로) 값을 정해요. 반환은 표정 (entities/character.js의 FACE)
   (2026-11-01) 포즈 3개(소개·만세·브이), 포즈마다 표정이 달라요
   - 소개 'normal': 동그란 눈 + 작은 미소, 눈도 깜빡여요(차분하게 안내)
   - 만세 'joy'   : 눈웃음 + 활짝 벌린 입 + 빨간 볼(제일 신남, KKK 김광현 얼굴을 으쓱이 얼굴로 옮김)
   - 브이 'happy' : ^ ^ 눈 + 웃는 입 */
var PZ_POSE={
  pzShow:function(P,t){var s=Math.sin(t*2.4)*.05,d=PZ.dir||1;P.aX=-1.15+s;P.bX=-1.15-s;P.aZ=d>0?.8:-.3;P.bZ=d>0?.3:-.8;P.tilt=-d*.04;P.head=-d*.08;return 'normal'},
  pzBanzai:function(P,t){var s=Math.sin(t*3);P.aZ=2.75+s*.06;P.bZ=-2.75-s*.06;P.y=Math.abs(s)*.03;return 'joy'},
  pzV:function(P,t){var s=Math.sin(t*2.2);P.aZ=2.15;P.aX=-.95;P.bZ=-.18;P.tilt=.07+s*.01;P.head=-.1;return 'happy'}
};

function pzStart(k){
  if(phase!=='game'||EV.on||PZ.on||!PZ_SETS[k])return;
  if(SS.on){SS.on=false;document.body.classList.remove('ss')}
  stopAct(true);PL.target=null;PL.onArrive=null;if(player.mode==='walk')player.mode='stand';
  var S=PZ_SETS[k];
  fadeTo(PZ_CFG[k].label+'으로 가는 중',function(){
    if(!S.g){S.build();scene.add(S.g)}
    if(PZ_CFG[k].indoor)dnOverride(0);/* 실내 포토존은 밤 경기여도 낮 조명 그대로 (world/daynight.js) */
    PZ.on=true;PZ.key=k;PZ.set=S;S.g.visible=true;PZ.pan=0;PZ.zoom=1;PZ.hidden=false;PZ.grab=false;
    PZ.ch=new Char({name:myName(),uni:ME.uni,backName:ME.backName,backNum:ME.backNum});
    S.g.add(PZ.ch.root);PZ.ch.root.position.set(S.startX,0,S.standZ);PZ.ch.root.rotation.y=0;PZ.ch.mode='stand';
    pzPose(S.pose);
    document.body.classList.add('pz');setStatus(null);pzUIOpen(k);pzWinMeasure();
    snapCam();if(S.onEnter)S.onEnter();
    setTimeout(function(){if(PZ.on)toast(PZ_CFG.hint,3200)},300);
  });
}
function pzStop(){
  if(!PZ.on)return;
  fadeTo('',function(){
    PZ.on=false;PZ.set.g.visible=false;if(PZ.ch){PZ.ch.dispose();PZ.ch=null}
    if(DN.force!=null)dnOverride(null);
    document.body.classList.remove('pz');pzUIClose();snapCam();
  });
}
function pzPose(k){PZ.pose=k;if(PZ.ch)PZ.ch.setAct(k);pzUISync()}
function pzHide(on){PZ.hidden=on;if(PZ.ch)PZ.ch.root.visible=!on;pzUISync()}

/* 카메라: 세트 폭·높이가 폴라로이드 사진 칸(#pzWin)에 꽉 차는 거리 × zoom (2026-11-01)
   PZ_WIN.f = 사진 칸 한 변 ÷ 화면 짧은 쪽, PZ_WIN.dy = 사진 칸 가운데가 화면 가운데보다 위로 간 px.
   사진 칸이 위로 올라간 만큼 카메라를 내려서 세트가 칸 가운데 오게 해요 */
var PZ_WIN={f:1,dy:0};
function pzWinMeasure(){var e=$('pzWin'),r=e&&e.getBoundingClientRect();if(!r||!r.width){PZ_WIN.f=1;PZ_WIN.dy=0;return}
  PZ_WIN.f=r.width/Math.min(innerWidth,innerHeight);PZ_WIN.dy=innerHeight/2-(r.top+r.height/2)}
addEventListener('resize',function(){if(PZ.on)pzWinMeasure()});
function pzFitD(S){var t=Math.tan(camera.fov*Math.PI/360);return Math.max(S.W,S.H)/2/(t*Math.min(camera.aspect,1)*PZ_WIN.f)}
function pzCam(out,look){
  var S=PZ.set,O=S.O,d=pzFitD(S)*PZ.zoom,sh=PZ_WIN.dy/(innerHeight/2)*d*Math.tan(camera.fov*Math.PI/360);
  look.set(O.x+S.T.x+PZ.pan,O.y+S.lookY-d*.045-sh,O.z+S.T.z);
  out.set(O.x+S.T.x+PZ.pan*.5,O.y+S.camY+d*.03-sh,O.z+S.T.z+d);
}
function pzZoomTo(z){if(PZ.on)PZ.zoom=clamp(z,.55,PZ.set.zoomMax())}

/* 끌기: 으쓱이를 잡았으면 옮기고, 아니면 화면을 좌우로 */
function pzRayX(cx,cy){
  ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  _pzP.constant=-(PZ.set.O.z+PZ.set.standZ);return ray.ray.intersectPlane(_pzP,_pzV)?_pzV.x-PZ.set.O.x:null;
}
function pzGrab(cx,cy){
  if(!PZ.ch||PZ.hidden)return false;
  ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  if(!ray.intersectObjects(PZ.ch.meshes,false).length)return false;
  var x=pzRayX(cx,cy);PZ.grab=true;PZ.gOff=x==null?0:PZ.ch.root.position.x-x;return true;
}
function pzDrag(dx,dy,cx,cy,grab){
  if(grab&&PZ.grab){var x=pzRayX(cx,cy);if(x!=null)PZ.ch.root.position.x=clamp(x+PZ.gOff,PZ.set.standX[0],PZ.set.standX[1]);return}
  var S=PZ.set;PZ.pan=clamp(PZ.pan-dx*pzFitD(S)*PZ.zoom*.0016,S.panMin,S.panMax);
}
function pzRelease(){PZ.grab=false}

function pzTick(dt,beat){
  if(!PZ.on||!PZ.ch)return;
  var S=PZ.set,c=PZ.ch.root;
  /* '소개' 포즈면 가리킬 곳 쪽으로 몸을 살짝 틀어요 */
  var want=0;if(PZ.pose==='pzShow'){var dx=S.pointX()-c.position.x;PZ.dir=dx>=0?1:-1;want=PZ.dir*.38}
  c.rotation.y=damp(c.rotation.y,want,8,dt);
  PZ.ch.update(dt,beat);
  if(S.tick)S.tick(dt);
}
