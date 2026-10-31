/* 빅보드는 world/bigboard.js */
/* light towers & hills */
(function(){
  var parts=[];
  function tower(x,z){parts.push({g:Cyl(.7,1,46,8),c:0xa7aea2,p:[x,23,z]});var ry=Math.atan2(-x,-(z+30));parts.push({g:Box(9,6,.8),c:0xeef0ea,p:[x,48,z],r:[-.3,ry,0]})}
  [[52,30],[-52,30],[95,-40],[-95,-40],[70,-150],[-70,-150]].forEach(function(p){tower(p[0],p[1])});
  for(var i=0;i<46;i++){var a=rnd(0,TAU),r=rnd(260,420),s=rnd(30,80);parts.push({g:new THREE.SphereGeometry(1,10,6,0,TAU,0,Math.PI/2),c:pick([0x86ad63,0x7aa35a,0x93b872,0xa7c487]),p:[Math.sin(a)*r,-2,-Math.cos(a)*r],s:[s*1.6,s*.45,s*1.6]})}
  for(i=0;i<60;i++){a=rnd(0,TAU);r=rnd(185,235);var tx=Math.sin(a)*r,tz=-Math.cos(a)*r+20;parts.push({g:Cyl(.6,.8,6,6),c:0x6b5444,p:[tx,3,tz]});parts.push({g:new THREE.SphereGeometry(4.5,10,8),c:pick([0xf7c6d4,0xf3b3c6,0xfad6df,0x9cc76d]),p:[tx,8,tz],s:[1,.8,1]})}
  scene.add(new THREE.Mesh(mergeParts(parts),MVC));
})();
