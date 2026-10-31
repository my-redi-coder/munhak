/* ================= input ================= */
var ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),ptrs=new Map(),drag=null,pinch=null;
canvas.addEventListener('pointerdown',function(e){canvas.focus({preventScroll:true});ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now()});canvas.setPointerCapture(e.pointerId);if(ptrs.size===2){var a=Array.from(ptrs.values());pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),dist:cam.dist};drag=null}else drag={moved:false};cam.auto=phase==='setup1'?0:cam.auto});
canvas.addEventListener('pointermove',function(e){var p=ptrs.get(e.pointerId);if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(pinch&&ptrs.size===2){var a=Array.from(ptrs.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);cam.dist=clamp(pinch.dist*pinch.d/Math.max(20,d),2.2,11);return}
  if(drag){if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>7)drag.moved=true;if(drag.moved&&(phase==='game'||phase==='setup1')){cam.yaw-=dx*.0065;cam.pitch=clamp(cam.pitch+dy*.0045,phase==='setup1'?-.1:.04,1.15)}}});
function endPtr(e){var p=ptrs.get(e.pointerId);if(!p)return;ptrs.delete(e.pointerId);
  if(drag&&!drag.moved&&!pinch&&performance.now()-p.t<600)onTap(e.clientX,e.clientY);
  if(ptrs.size<2)pinch=null;if(ptrs.size===0){drag=null;if(phase==='setup1')cam.auto=1}}
canvas.addEventListener('pointerup',endPtr);canvas.addEventListener('pointercancel',function(e){ptrs.delete(e.pointerId);drag=null;pinch=null});
canvas.addEventListener('wheel',function(e){e.preventDefault();cam.dist=clamp(cam.dist*(1+Math.sign(e.deltaY)*.08),2.2,11)},{passive:false});

var tapMark=new THREE.Mesh(new THREE.RingGeometry(.22,.3,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));tapMark.rotation.x=-Math.PI/2;scene.add(tapMark);var tapT=0;
function onTap(cx,cy){
  if(phase!=='game'||EV.on)return;
  ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  var objs=[];npcs.forEach(function(n){objs.push.apply(objs,n.meshes)});objs.push.apply(objs,player.meshes);
  if(leader)objs.push.apply(objs,leader.meshes);FP.list.forEach(function(p){objs.push.apply(objs,p.meshes)});
  objs.push(curBlock.seatMesh,curBlock.terrace);blocks.forEach(function(b){if(b!==curBlock)objs.push(b.terrace)});objs.push(field);
  var hits=ray.intersectObjects(objs,false);if(!hits.length)return;var h=hits[0],o=h.object;
  if(o.userData.bp){addLabel(o.userData.bp,o.userData.bp.label,'tag',2400);sfx('tap');return}
  if(o.userData.char){var ch=o.userData.char;addLabel(ch,ch===player?myName():ch.name,'tag',2400);sfx('tap');return}
  if(o===curBlock.seatMesh){
    var s=curBlock.seats[h.instanceId];if(!s)return;
    if(s.occ&&s.occ!==player){toast(s.occ==='crowd'?'다른 관중이 앉은 자리예요':s.occ.name+'님 자리예요',2000);return}
    if(PL.seat===s&&player.mode==='sit')return;
    goToSeat(s);return;
  }
  if(o===curBlock.terrace){var lp=curBlock.g.worldToLocal(h.point.clone());walkTo(curBlock.clampX(lp.x),curBlock.clampZ(lp.z),null,'걷는 중');showTap(h.point);return}
  if(o.userData.block){toast('다른 구역은 위쪽 구역 버튼으로 옮겨요',2200);return}
  toast('가까운 관중석 바닥을 눌러주세요',2000);
}
function showTap(p){tapMark.position.set(p.x,p.y+.03,p.z);tapMark.material.opacity=.9;tapMark.scale.set(1,1,1);tapT=0}
function leaveSeat(){if(PL.seat){PL.seat.occ=null;PL.seat=null}PL.returnSeat=null}
function walkTo(x,z,onArrive,label){
  if(player.act)stopAct(true);
  if(player.mode==='sit'){var s=PL.seat;standAtSeat(player,s,curBlock)}
  leaveSeat();PL.target={x:x,z:z};PL.onArrive=onArrive;setStatus(label||'걷는 중');sfx('tap');
}
function goToSeat(s){
  walkTo(s.x,s.z-.38,function(){if(s.occ&&s.occ!==player){toast('그새 다른 관중이 앉았어요',2000);return}s.occ=player;PL.seat=s;sitChar(player,s);sfx('sit');toast('자리에 앉았어요',1600)},'자리로 가는 중');
}
addEventListener('keydown',function(e){
  if(e.target&&e.target.tagName==='INPUT')return;
  if(foodOpen()){if(e.key==='Escape')foodEsc();return}
  if(e.key==='Escape'){['mZone','mSet'].forEach(function(id){if(!$(id).hidden)closeModal(id)});return}
  if(phase!=='game')return;
  var k=e.key.toLowerCase();
  if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].indexOf(k)>=0){PL.keys[k]=true;e.preventDefault()}
  if(k==='1')startAct('cheer');if(k==='2')startAct('angry');if(k==='3')startAct('wave');if(k==='4')openFood();
});
addEventListener('keyup',function(e){PL.keys[e.key.toLowerCase()]=false});
addEventListener('blur',function(){PL.keys={}});
