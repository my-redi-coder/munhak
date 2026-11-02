/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 경기장 구경하기 =================
   '내 위치' 메뉴 → 둘러보기 '경기장 구경'(ui/places.js)에서 ssStart() → 카메라가 경기장 위로 떠올라요.
   (2026-11-01 묶음 A: 위쪽 '구경' 버튼은 없앴어요) 드래그로 돌리고, 두 손가락·휠로 가까이/멀리.
   아래 '돌아가기'(상태 캡슐)로 내 자리 카메라로 돌아와요. 구경 중엔 위·아래 버튼을 숨겨요(body.ss, styles/hud.css).
   카메라는 game/camera.js의 camDesired가 ssCam을 불러서 정해요.

   (2026-11-03 작은 패치 J) 보는 중심(SS.T)을 옮길 수 있어요 — 가운데에 묶여 있어서 구석 포스터를 못 봤어요.
   · 두 손가락으로 끌기 → ssPan (PC: 오른쪽 버튼 드래그 또는 Shift+드래그)
   · 두 번 톡 누르기 → ssTap → ssFocus (누른 곳으로 중심 이동 + 살짝 가까이)
   · 중심이 멀어지면 위쪽 오른쪽에 '가운데로' 버튼(JS로 만듦) → ssHome
   · 중심이 구장 밖으로 못 나가게 ssClamp. 입력은 game/input.js가 연결해요. */

var SS={on:false,yaw:.55,pitch:.5,dist:115,MIN:10,MAX:190,T:new THREE.Vector3(0,6,-38),T0:new THREE.Vector3(0,6,-38),D0:115,btn:null,
  LIM:{x:150,zMin:-160,zMax:50,yMax:60}};
var ssRay=new THREE.Raycaster(),SSTAP={t:0,x:0,y:0};

function ssStart(){
  if(phase!=='game'||EV.on||SS.on)return;
  stopAct(true);PL.target=null;PL.onArrive=null;if(player.mode==='walk')player.mode='stand';
  fadeTo('',function(){SS.on=true;SS.T.copy(SS.T0);SS.dist=SS.D0;SSTAP.t=0;document.body.classList.add('ss');setStatus('경기장 구경 중');$('statusStop').textContent='돌아가기';snapCam();ssSync();setTimeout(function(){toast('드래그로 돌리고, 두 손가락으로 확대·이동, 두 번 톡 누르면 그곳으로 가요',4200)},300)});
}
function ssStop(){
  if(!SS.on)return;
  fadeTo('',function(){SS.on=false;document.body.classList.remove('ss');setStatus(null);$('statusStop').textContent='멈추기';snapCam();ssSync()});
}
function ssCam(out,look){var cp=Math.cos(SS.pitch);look.copy(SS.T);out.set(SS.T.x+Math.sin(SS.yaw)*cp*SS.dist,SS.T.y+Math.sin(SS.pitch)*SS.dist,SS.T.z+Math.cos(SS.yaw)*cp*SS.dist)}
function ssDrag(dx,dy){SS.yaw-=dx*.005;SS.pitch=clamp(SS.pitch+dy*.004,.1,1.4)}

/* 보는 중심 옮기기: 손가락이 움직인 만큼 화면 속 그림이 따라오게(지도 앱처럼) */
function ssPan(dx,dy){
  var s=2*Math.tan(camera.fov*Math.PI/360)*SS.dist/innerHeight,sy=s/Math.max(.35,Math.sin(SS.pitch)),
      sn=Math.sin(SS.yaw),cs=Math.cos(SS.yaw);
  SS.T.x+=-cs*dx*s-sn*dy*sy;
  SS.T.z+=sn*dx*s-cs*dy*sy;
  ssClamp();ssSync();
