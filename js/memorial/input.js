/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/input: 입력 (야구장 js/game/input.js 처럼) =================
   누르면 걷기 · 끌면 둘러보기 · 두 손가락·휠로 확대 · 키보드 WASD/방향키 · ‹ › 버튼 길게 누르기.
   꾸미기 창이 떠 있을 땐(PL.dress) 걷지 않고 끌어서 돌려 보기만 돼요. 글자 칸에 쓰는 중엔 키보드 걷기를 막아요. */
var _mhRay=new THREE.Raycaster(),_mhNdc=new THREE.Vector2(),_mhPtrs=new Map(),_mhDrag=null,_mhPinch=null;
MH.tapMark=null;MH.tapT=0;
function mhBindInput(){
  var PL=MH.PL,cam=MH.cam,ptrs=_mhPtrs;
  MH.tapMark=new THREE.Mesh(new THREE.RingGeometry(.2,.28,28),new THREE.MeshBasicMaterial({color:0xc8102e,transparent:true,opacity:0,depthWrite:false}));MH.tapMark.rotation.x=-Math.PI/2;scene.add(MH.tapMark);
  canvas.addEventListener('pointerdown',function(e){canvas.focus({preventScroll:true});ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now()});canvas.setPointerCapture(e.pointerId);
    if(ptrs.size===2){var a=Array.from(ptrs.values());_mhPinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),dist:cam.dist};_mhDrag=null}else _mhDrag={moved:false}});
  canvas.addEventListener('pointermove',function(e){var p=ptrs.get(e.pointerId);if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(_mhPinch&&ptrs.size===2){var a=Array.from(ptrs.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);cam.dist=clamp(_mhPinch.dist*_mhPinch.d/Math.max(20,d),2.4,7);return}
    if(_mhDrag&&!PL.intro){if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>7)_mhDrag.moved=true;if(_mhDrag.moved){cam.yaw-=dx*.0065;cam.pitch=clamp(cam.pitch+dy*.0045,-.05,.9);mhHideHint()}}});
  function endPtr(e){var p=ptrs.get(e.pointerId);if(!p)return;ptrs.delete(e.pointerId);if(_mhDrag&&!_mhDrag.moved&&!_mhPinch&&performance.now()-p.t<600)mhOnTap(e.clientX,e.clientY);if(ptrs.size<2)_mhPinch=null;if(ptrs.size===0)_mhDrag=null}
  canvas.addEventListener('pointerup',endPtr);canvas.addEventListener('pointercancel',function(e){ptrs.delete(e.pointerId);_mhDrag=null;_mhPinch=null});
  canvas.addEventListener('wheel',function(e){e.preventDefault();cam.dist=clamp(cam.dist*(1+Math.sign(e.deltaY)*.08),2.4,7)},{passive:false});
  var MOVE=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'];
  addEventListener('keydown',function(e){
    if(!$('viewer').hidden){if(e.key==='Escape')mhCloseViewer();return}
    var tg=(e.target&&e.target.tagName)||'';if(PL.dress||tg==='INPUT'||tg==='TEXTAREA'||tg==='BUTTON')return;
    var k=e.key.toLowerCase();if(MOVE.indexOf(k)>=0){PL.keys[k]=true;mhSkipIntro();e.preventDefault()}});
  addEventListener('keyup',function(e){PL.keys[e.key.toLowerCase()]=false});
  addEventListener('blur',function(){PL.keys={};PL.hold=0});
  /* ‹ › 버튼: 누르고 있는 동안 통로를 따라 걸어요 */
  [['wl',-1],['wr',1]].forEach(function(b){var el=$(b[0]);
    el.addEventListener('pointerdown',function(e){e.preventDefault();mhSkipIntro();PL.hold=b[1];el.setPointerCapture(e.pointerId)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(function(n){el.addEventListener(n,function(){if(PL.hold===b[1])PL.hold=0})});
    el.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();PL.hold=b[1]}});el.addEventListener('keyup',function(){PL.hold=0});
  });
}
function mhOnTap(cx,cy){
  var PL=MH.PL;
  if(PL.dress)return;
  if(PL.intro){mhSkipIntro();return}
  _mhNdc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);_mhRay.setFromCamera(_mhNdc,camera);
  var objs=MH.hits.concat(MH.player.meshes,MH.walls,[MH.floor]),hits=_mhRay.intersectObjects(objs,false);if(!hits.length)return;
  var h=hits[0],o=h.object;
  if(o.userData.char){mhToast(MH.player.name);return}
  if(o.userData.item){mhOpenViewer(o.userData.item,!!o.userData.today);return}
  if(o.userData.empty){mhToast('다음 짤이 걸릴 자리예요');return}
  if(o===MH.floor){mhWalkTo(h.point.x,h.point.z);MH.tapMark.position.set(PL.target.x,.03,PL.target.z);MH.tapT=.7;mhHideHint()}
}
