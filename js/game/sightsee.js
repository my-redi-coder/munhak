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
}
function ssClamp(){var L=SS.LIM;SS.T.x=clamp(SS.T.x,-L.x,L.x);SS.T.z=clamp(SS.T.z,L.zMin,L.zMax);SS.T.y=clamp(SS.T.y,0,L.yMax)}

/* 두 번 톡: 350ms 안에, 손가락이 40px 안쪽에서 다시 누르면 */
function ssTap(cx,cy){
  var now=performance.now();
  if(now-SSTAP.t<350&&Math.hypot(cx-SSTAP.x,cy-SSTAP.y)<40){SSTAP.t=0;ssFocus(cx,cy)}
  else{SSTAP.t=now;SSTAP.x=cx;SSTAP.y=cy}
}
/* 누른 곳에 실제로 있는 것(포스터·관중석 등)을 찾아 그 자리를 중심으로. 하늘·구름·빛 같은 건 건너뜀 */
function ssFocus(cx,cy){
  ssRay.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);
  var hits=ssRay.intersectObjects(scene.children,true),p=null;
  for(var i=0;i<hits.length;i++){
    var o=hits[i].object;if(!o.isMesh)continue;
    var vis=true,q=o;while(q){if(!q.visible){vis=false;break}q=q.parent}if(!vis)continue;
    var m=Array.isArray(o.material)?o.material[0]:o.material;
    if(!m||m.side===THREE.BackSide||(m.transparent&&m.opacity<.9))continue;
    p=hits[i].point;break;
  }
  if(!p){p=new THREE.Vector3();if(!ssRay.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),p))return}
  SS.T.copy(p);SS.dist=clamp(SS.dist*.55,SS.MIN,SS.MAX);ssClamp();ssSync();sfx('tap');
}

/* '가운데로' 버튼 — 중심이 처음 자리에서 멀어졌을 때만 보여요 */
function ssBtn(){
  if(SS.btn)return SS.btn;
  var b=document.createElement('button');b.type='button';b.textContent='가운데로';
  b.style.cssText='position:fixed;right:12px;top:calc(env(safe-area-inset-top,0px) + 12px);z-index:30;padding:9px 15px;border:0;border-radius:999px;background:rgba(241,239,229,.94);color:#454a3c;font-size:14px;font-weight:600;font-family:inherit;box-shadow:0 2px 8px rgba(0,0,0,.2);display:none;cursor:pointer';
  b.addEventListener('click',function(e){e.stopPropagation();ssHome()});
  document.body.appendChild(b);SS.btn=b;return b;
}
function ssHome(){SS.T.copy(SS.T0);SS.dist=SS.D0;ssSync()}
function ssSync(){
  var b=ssBtn(),d=Math.hypot(SS.T.x-SS.T0.x,SS.T.z-SS.T0.z)+Math.abs(SS.T.y-SS.T0.y);
  b.style.display=SS.on&&d>3?'block':'none';
}
