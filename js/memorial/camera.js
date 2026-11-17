/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/camera: 등 뒤에서 따라가는 카메라 (야구장 js/game/camera.js 처럼) =================
   끌면 둘러보기(yaw·pitch), 두 손가락·휠로 확대(dist). 벽 밖으로 못 나가요. */
var _mhDp=new THREE.Vector3(),_mhDl=new THREE.Vector3();
function mhCamDesired(out,look){
  var cam=MH.cam,HALL=MH.HALL,PL=MH.PL,p=MH.player.root.position;look.set(p.x,PL.dress?-.2:1.3,p.z);/* 꾸미기 창이 아래를 덮어서, 으쓱이가 화면 위쪽에 보이게 낮게 겨눠요 */
  if(PL.intro){look.set(PL.intro.land.x,1.3,PL.intro.land.z)}
  var cp=Math.cos(cam.pitch);out.set(look.x+Math.sin(cam.yaw)*cp*cam.dist,look.y+Math.sin(cam.pitch)*cam.dist,look.z+Math.cos(cam.yaw)*cp*cam.dist);
  var q=mhToSR(out.x,out.z),r=clamp(q.r,HALL.rIn+.3,HALL.rOut-.3),s=clamp(q.s,HALL.endL+.3,HALL.endR-.3),a=mhAt(s,r);out.x=a.x;out.z=a.z;out.y=clamp(out.y,.5,HALL.height-.35);
}
function mhUpdateCam(dt,snap){
  var cam=MH.cam;mhCamDesired(_mhDp,_mhDl);var k=snap?1e9:9;
  cam.cur.x=damp(cam.cur.x,_mhDp.x,k,dt);cam.cur.y=damp(cam.cur.y,_mhDp.y,k,dt);cam.cur.z=damp(cam.cur.z,_mhDp.z,k,dt);
  cam.look.x=damp(cam.look.x,_mhDl.x,k,dt);cam.look.y=damp(cam.look.y,_mhDl.y,k,dt);cam.look.z=damp(cam.look.z,_mhDl.z,k,dt);
  camera.position.copy(cam.cur);camera.lookAt(cam.look);
}
function mhResize(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?76:56;camera.updateProjectionMatrix()}
addEventListener('resize',mhResize);
