/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= camera ================= */
var _t=new THREE.Vector3(),_d=new THREE.Vector3();
function camTarget(out){player.root.getWorldPosition(out);out.y+=player.mode==='sit'?1.05:1.3;if(phase==='game'){var a=cam.dist*.32;out.x-=Math.sin(cam.yaw)*a;out.z-=Math.cos(cam.yaw)*a}return out}
function camDesired(out,look){
  if(phase==='setup2'){out.copy(overview.pos);look.copy(overview.look);return}
  if(EV.cam&&phase==='game'){out.copy(EV.cam.pos);look.copy(EV.cam.look);return}
  if(PZ.on&&phase==='game'){pzCam(out,look);return}
  if(SS.on&&phase==='game'){ssCam(out,look);return}
  camTarget(look);var cp=Math.cos(cam.pitch);
  out.set(look.x+Math.sin(cam.yaw)*cp*cam.dist,look.y+Math.sin(cam.pitch)*cam.dist,look.z+Math.cos(cam.yaw)*cp*cam.dist);
  if(phase==='game'&&curBlock){var lp=curBlock.g.worldToLocal(out.clone());if(lp.z>-1.9&&lp.x>curBlock.xMin-.9&&lp.x<curBlock.xMax+.9){var gh=curBlock.groundH(clamp(lp.z,-1,99))+1.0;if(lp.y<gh){out.y+=gh-lp.y}}}
}
function snapCam(){camDesired(cam.cur,cam.look);camera.position.copy(cam.cur);camera.lookAt(cam.look)}
var _dp=new THREE.Vector3(),_dl=new THREE.Vector3();
function updateCam(dt){
  if(phase==='setup1'&&cam.auto)cam.yaw+=dt*.32*(reduceMotion?.3:1);
  camDesired(_dp,_dl);var k=phase==='setup2'?2.2:EV.cam&&phase==='game'?EV.cam.k:PZ.on?8:SS.on?7:9;
  cam.cur.x=damp(cam.cur.x,_dp.x,k,dt);cam.cur.y=damp(cam.cur.y,_dp.y,k,dt);cam.cur.z=damp(cam.cur.z,_dp.z,k,dt);
  cam.look.x=damp(cam.look.x,_dl.x,k,dt);cam.look.y=damp(cam.look.y,_dl.y,k,dt);cam.look.z=damp(cam.look.z,_dl.z,k,dt);
  camera.position.copy(cam.cur);camera.lookAt(cam.look);
}
function resize(){
  var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  applyViewOffset();
}
function applyViewOffset(){
  var w=innerWidth,h=innerHeight;
  if(phase==='setup1'||phase==='setup2'){
    var sh=document.querySelector('#setup .sheet').getBoundingClientRect();
    if(w>=820)camera.setViewOffset(w,h,-(sh.right)/2,0,w,h);else camera.setViewOffset(w,h,0,Math.min(sh.height,h*.58)/2,w,h);
  }else camera.clearViewOffset();
}
addEventListener('resize',resize);
