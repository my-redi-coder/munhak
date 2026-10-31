/* ================= 경기장 구경하기 =================
   위쪽 '구경' 버튼 → 카메라가 경기장 위로 떠올라요. 드래그로 돌리고, 두 손가락·휠로 가까이/멀리.
   아래 '돌아가기'(상태 캡슐)로 내 자리 카메라로 돌아와요. 구경 중엔 위·아래 버튼을 숨겨요(body.ss, styles/hud.css).
   카메라는 game/camera.js의 camDesired가 ssCam을 불러서 정해요. */
var SS={on:false,yaw:.55,pitch:.5,dist:115,MIN:30,MAX:190,T:new THREE.Vector3(0,6,-38)};
function ssStart(){
  if(phase!=='game'||EV.on||SS.on)return;
  stopAct(true);PL.target=null;PL.onArrive=null;if(player.mode==='walk')player.mode='stand';
  fadeTo('',function(){SS.on=true;document.body.classList.add('ss');setStatus('경기장 구경 중');$('statusStop').textContent='돌아가기';snapCam();setTimeout(function(){toast('드래그로 돌려 보고, 두 손가락이나 휠로 가까이 봐요',3200)},300)});
}
function ssStop(){
  if(!SS.on)return;
  fadeTo('',function(){SS.on=false;document.body.classList.remove('ss');setStatus(null);$('statusStop').textContent='멈추기';snapCam()});
}
function ssCam(out,look){var cp=Math.cos(SS.pitch);look.copy(SS.T);out.set(SS.T.x+Math.sin(SS.yaw)*cp*SS.dist,SS.T.y+Math.sin(SS.pitch)*SS.dist,SS.T.z+Math.cos(SS.yaw)*cp*SS.dist)}
function ssDrag(dx,dy){SS.yaw-=dx*.005;SS.pitch=clamp(SS.pitch+dy*.004,.1,1.4)}
$('bLook').onclick=function(){auEnsure();sfx('tap');ssStart()};
