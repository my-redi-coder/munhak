/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* 빅보드는 world/bigboard.js */
/* light towers & hills — 조명탑 자리 TOWERS, 머리판 방향 towerRY는 밤 경기 불빛(world/daynight.js)도 같이 써요 */
var TOWERS=[[52,30],[-52,30],[95,-40],[-95,-40],[70,-150],[-70,-150]],TOWER_HEAD_Y=48;
/* (2026-11-01) 언덕이 생기면 안 되는 자리: 플레이어존(world/pzone.js O 150,0,380)·홈런기념판(world/hrboard.js O -150,0,380) 세트와 그 앞 카메라 길.
   언덕 46개는 자리가 랜덤이라, 세트 안이나 카메라 앞에 걸리면 '커다란 산'이 보였어요. 세트 자리를 옮기면 여기도 같이 고쳐요.
   x 중심, z 중심, 좌우 반폭, 뒤(-)·앞(+) 범위 */
var HILL_CLEAR=[{x:150,z:380,hw:50,back:15,front:95},{x:-158,z:380,hw:62,back:15,front:95}];
function hillBlocked(x,z,R){return HILL_CLEAR.some(function(c){
  var dx=Math.max(Math.abs(x-c.x)-c.hw,0),dz=z<c.z-c.back?(c.z-c.back)-z:(z>c.z+c.front?z-(c.z+c.front):0);return Math.hypot(dx,dz)<R})}
function towerRY(x,z){return Math.atan2(-x,-(z+30))}
(function(){
  var parts=[];
  function tower(x,z){parts.push({g:Cyl(.7,1,46,8),c:0xa7aea2,p:[x,23,z]});parts.push({g:Box(9,6,.8),c:0xeef0ea,p:[x,TOWER_HEAD_Y,z],r:[-.3,towerRY(x,z),0]})}
  TOWERS.forEach(function(p){tower(p[0],p[1])});
  for(var i=0,tries=0;i<46&&tries<600;tries++){var a=rnd(0,TAU),r=rnd(260,420),s=rnd(30,80);if(hillBlocked(Math.sin(a)*r,-Math.cos(a)*r,s*1.6))continue;i++;parts.push({g:new THREE.SphereGeometry(1,10,6,0,TAU,0,Math.PI/2),c:pick([0x86ad63,0x7aa35a,0x93b872,0xa7c487]),p:[Math.sin(a)*r,-2,-Math.cos(a)*r],s:[s*1.6,s*.45,s*1.6]})}
  for(i=0;i<60;i++){a=rnd(0,TAU);r=rnd(185,235);var tx=Math.sin(a)*r,tz=-Math.cos(a)*r+20;parts.push({g:Cyl(.6,.8,6,6),c:0x6b5444,p:[tx,3,tz]});parts.push({g:new THREE.SphereGeometry(4.5,10,8),c:pick([0xf7c6d4,0xf3b3c6,0xfad6df,0x9cc76d]),p:[tx,8,tz],s:[1,.8,1]})}
  var lm=new THREE.Mesh(mergeParts(parts),MVC);lm.userData.dimOut=true;/* 밤엔 더 어둡게(world/nightdim.js) */scene.add(lm);
})();
