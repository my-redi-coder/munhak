/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= input ================= */

/* 2026-11-03 작은 패치 J: 경기장 구경 중 두 손가락 이동·두 번 톡 초점·PC 오른쪽/Shift 드래그 이동 → game/sightsee.js의 ssPan·ssTap */
var ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),ptrs=new Map(),drag=null,pinch=null;
canvas.addEventListener('pointerdown',function(e){canvas.focus({preventScroll:true});ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now()});canvas.setPointerCapture(e.pointerId);if(ptrs.size===2){var a=Array.from(ptrs.values());pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),dist:cam.dist,sd:SS.dist,pz:PZ.zoom};drag=null}else drag={moved:false,grab:PZ.on&&pzGrab(e.clientX,e.clientY)};cam.auto=phase==='setup1'?0:cam.auto});
canvas.addEventListener('pointermove',function(e){var p=ptrs.get(e.pointerId);if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(pinch&&ptrs.size===2){var a=Array.from(ptrs.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(PZ.on){pzZoomTo(pinch.pz*pinch.d/Math.max(20,d));return}if(SS.on){SS.dist=clamp(pinch.sd*pinch.d/Math.max(20,d),SS.MIN,SS.MAX);var mx=(a[0].x+a[1].x)/2,my=(a[0].y+a[1].y)/2;if(pinch.lx!==undefined)ssPan(mx-pinch.lx,my-pinch.ly);pinch.lx=mx;pinch.ly=my;return}cam.dist=clamp(pinch.dist*pinch.d/Math.max(20,d),2.2,11);return}
  if(drag){if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>7)drag.moved=true;if(drag.moved&&PZ.on){pzDrag(dx,dy,e.clientX,e.clientY,drag.grab);return}if(drag.moved&&SS.on){if(e.buttons&2||e.shiftKey)ssPan(dx,dy);else ssDrag(dx,dy);return}if(drag.moved&&(phase==='game'||phase==='setup1')){cam.yaw-=dx*.0065;cam.pitch=clamp(cam.pitch+dy*.0045,phase==='setup1'?-.1:.04,1.15)}}});
function endPtr(e){var p=ptrs.get(e.pointerId);if(!p)return;ptrs.delete(e.pointerId);
  if(drag&&!drag.moved&&!pinch&&performance.now()-p.t<600){if(SS.on)ssTap(e.clientX,e.clientY);else onTap(e.clientX,e.clientY)}
  if(ptrs.size<2)pinch=null;if(ptrs.size===0){drag=null;if(PZ.on)pzRelease();if(phase==='setup1')cam.auto=1}}
canvas.addEventListener('pointerup',endPtr);canvas.addEventListener('pointercancel',function(e){ptrs.delete(e.pointerId);drag=null;pinch=null});
canvas.addEventListener('contextmenu',function(e){if(SS.on)e.preventDefault()});

canvas.addEventListener('wheel',function(e){e.preventDefault();if(PZ.on){pzZoomTo(PZ.zoom*(1+Math.sign(e.deltaY)*.08));return}if(SS.on){SS.dist=clamp(SS.dist*(1+Math.sign(e.deltaY)*.08),SS.MIN,SS.MAX);return}cam.dist=clamp(cam.dist*(1+Math.sign(e.deltaY)*.08),2.2,11)},{passive:false});

var tapMark=new THREE.Mesh(new THREE.RingGeometry(.22,.3,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));tapMark.rotation.x=-Math.PI/2;scene.add(tapMark);var tapT=0;
function onTap(cx,cy){
  if(phase!=='game'||EV.on||SS.on||PZ.on)return;
  ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  var objs=[];npcs.forEach(function(n){objs.push.apply(objs,n.meshes)});objs.push.apply(objs,player.meshes);
  if(leader)objs.push.apply(objs,leader.meshes);objs.push.apply(objs,mascotMeshes());FP.list.forEach(function(p){objs.push.apply(objs,p.meshes)});
  objs.push(curBlock.seatMesh,curBlock.terrace);blocks.forEach(function(b){if(b!==curBlock)objs.push(b.terrace)});objs.push(field);
  var hits=ray.intersectObjects(objs,false);if(!hits.length)return;var h=hits[0],o=h.object;
  if(o.userData.bp){addLabel(o.userData.bp,o.userData.bp.label,'tag',2400);sfx('tap');return}
  if(o.userData.mascot){var mm=o.userData.mascot;mascotTap(mm);addLabel(mm,mm.name,'tag',2400);sfx('tap');return}
  if(o.userData.char){var ch=o.userData.char;addLabel(ch,ch===player?myName():ch.name,'tag',2400);sfx('tap');return}
  if(o===curBlock.seatMesh){
    var s=curBlock.seats[h.instanceId];if(!s)return;
    if(s.occ&&s.occ!==player){toast(s.occ==='crowd'?'다른 관중이 앉은 자리예요':s.occ.name+'님 자리예요',2000);return}
    if(PL.seat===s&&player.mode==='sit')return;
    goToSeat(s);return;
  }
  if(o===curBlock.terrace||curBlock.links.indexOf(o.userData.block)>=0){var lp=curBlock.g.worldToLocal(h.point.clone());walkTo(curBlock.clampX(lp.x),curBlock.clampZ(lp.z),null,'걷는 중');showTap(h.point);return}
  if(o.userData.block){toast('다른 구역은 위쪽 구역 버튼으로 옮겨요',2200);return}
