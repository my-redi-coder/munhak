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
/* (작은 패치 BA) 입장·구역 이동 때 카메라를 빅보드 쪽으로 돌리고, 빅보드가 BBV.want 이상 보이고 가운데가 화면 맨 위로 붙지 않는(위에서 약 15% 아래, BBV.maxCy — 버튼에 안 가리게) 가장 큰 기울기(pitch)를 골라요.
   기울기가 클수록 구장·내 으쓱이가 더 보이니까 '조건을 지키는 가장 큰 값'. 화면 비율(폰 세로·PC 가로)에 따라 알아서 달라져요.
   땅에 카메라가 닿아 더 못 내려가는 자리는 가장 낮게 보이는 기울기, 그것도 안 되는 아주 좁은 화면은 가장 많이 보이는 기울기로 */
var BBV={want:.8,maxCy:.7,cols:21,rows:9,cy:0},_bc=new THREE.PerspectiveCamera(55,1,.1,1600),_bp=new THREE.Vector3(),_bl=new THREE.Vector3(),_bv=new THREE.Vector3();
function bbSeen(){
  camDesired(_bp,_bl);_bc.fov=camera.fov;_bc.aspect=camera.aspect;_bc.updateProjectionMatrix();_bc.position.copy(_bp);_bc.lookAt(_bl);_bc.updateMatrixWorld(true);
  var n=0,t=0;
  for(var i=0;i<=BBV.cols;i++)for(var j=0;j<=BBV.rows;j++){
    _bv.set((i/BBV.cols-.5)*BB.W,BB.Y0+(j/BBV.rows)*BB.H,BB.Z+1.4).project(_bc);t++;
    if(_bv.z<1&&Math.abs(_bv.x)<=1&&Math.abs(_bv.y)<=1)n++;
  }
  _bv.set(0,BB.CY,BB.Z+1.4).project(_bc);BBV.cy=_bv.y;
  return n/t;
}
function bbAimCam(){
  player.root.getWorldPosition(_bv);cam.yaw=Math.atan2(_bv.x,_bv.z-BB.Z);   /* 시선이 빅보드 가운데를 향하게 */
  var ok=null,low=null,most=null,mf=-1,lc=9;
  for(var p=.55;p>=.02;p-=.03){
    cam.pitch=p;var f=bbSeen(),c=BBV.cy;
    if(f>mf+.001){mf=f;most=p}                              /* 가장 많이 보이는 기울기 */
    if(f>=BBV.want){if(!ok&&c<=BBV.maxCy)ok=p;if(c<lc-.001){lc=c;low=p}}   /* 조건을 지키는 가장 큰 값 / 그중 가장 낮게 보이는 값 */
  }
  cam.pitch=ok!=null?ok:low!=null?low:most!=null?most:.3;
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
