/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 그린존 (3루 외야 돗자리 잔디 언덕) =================
   좌석 안내도 기준: 3루 외야 관중석(114B~111B) 뒤쪽, 왼쪽 폴 근처부터 좌중간까지 이어지는 잔디 언덕.
   옆에 초가정자, 폴 쪽 끝에 모래놀이장. 각도 a는 홈에서 본 방향(0=중앙, 음수=3루 쪽). */
var GZ={a0:-46*Math.PI/180,a1:-21*Math.PI/180,r0:123,r1:141};
function gzY(r){return 5.9+(r-GZ.r0)/(GZ.r1-GZ.r0)*1.3}
/* (2026-11-02) 그린존 전체를 담장 곡선을 따라 앞뒤로 밀어요(앞 옹벽이 외야석 뒤끝에 붙게). 크기·장식은 그대로 */
function gzD(a){return fenceR(a)+16.5-GZ.r0}
function gzP(a,r){r+=gzD(a);return [Math.sin(a)*r,-Math.cos(a)*r]}
(function(){
  // 잔디 언덕 (부채꼴, 바깥으로 살짝 높아짐)
  var NA=40,NR=8,P=[],UV=[],I=[];
  for(var i=0;i<=NA;i++)for(var j=0;j<=NR;j++){var a=GZ.a0+(GZ.a1-GZ.a0)*i/NA,r=GZ.r0+(GZ.r1-GZ.r0)*j/NR,p=gzP(a,r);P.push(p[0],gzY(r),p[1]);UV.push(i/NA,j/NR)}
  for(i=0;i<NA;i++)for(j=0;j<NR;j++){var k=i*(NR+1)+j;I.push(k,k+1,k+NR+1,k+1,k+NR+2,k+NR+1)}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeVertexNormals();
  var tex=canvasTex(512,128,function(x,w,h){x.fillStyle='#7fb357';x.fillRect(0,0,w,h);for(var s=0;s<16;s++){if(s%2)continue;x.fillStyle='rgba(255,255,255,.07)';x.fillRect(s*w/16,0,w/16,h)}for(s=0;s<500;s++){x.fillStyle='rgba(40,80,20,.08)';x.fillRect(rnd(0,w),rnd(0,h),2,2)}});
  var hill=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));scene.add(hill);
  // 앞쪽 옹벽 + 난간
  var h=gzY(GZ.r0);
function gzWall(r,hh,color){var P2=[],I2=[];for(var i2=0;i2<=NA;i2++){var a2=GZ.a0+(GZ.a1-GZ.a0)*i2/NA,p2=gzP(a2,r);P2.push(p2[0],0,p2[1],p2[0],hh,p2[1])}for(i2=0;i2<NA;i2++){var k2=i2*2;I2.push(k2,k2+1,k2+2,k2+1,k2+3,k2+2)}var gw=new THREE.BufferGeometry();gw.setAttribute('position',new THREE.Float32BufferAttribute(P2,3));gw.setIndex(I2);gw.computeVertexNormals();scene.add(new THREE.Mesh(gw,new THREE.MeshLambertMaterial({color:color,side:THREE.DoubleSide})))}
gzWall(GZ.r0,h,0x2c6a47);gzWall(GZ.r1,gzY(GZ.r1),0x6f8a5a);
var parts=[];
for(var a=GZ.a0;a<GZ.a1;a+=.012){var p=gzP(a,GZ.r0+.3);parts.push({g:Box(.08,1,.08),c:0xf4f2ec,p:[p[0],h+.5,p[1]]})}
var nRail=Math.round((GZ.a1-GZ.a0)/.04);for(i=0;i<nRail;i++){var q0=gzP(GZ.a0+i*(GZ.a1-GZ.a0)/nRail,GZ.r0+.3),q1=gzP(GZ.a0+(i+1)*(GZ.a1-GZ.a0)/nRail,GZ.r0+.3),len=Math.hypot(q1[0]-q0[0],q1[1]-q0[1])+.05;parts.push({g:Box(len,.08,.08),c:0xf4f2ec,p:[(q0[0]+q1[0])/2,h+1,(q0[1]+q1[1])/2],r:[0,-Math.atan2(q1[1]-q0[1],q1[0]-q0[0]),0]})}

// 뒤쪽 나무
  for(i=0;i<26;i++){a=rnd(GZ.a0,GZ.a1);var r=rnd(GZ.r1+1,GZ.r1+6);p=gzP(a,r);parts.push({g:Cyl(.4,.55,5,6),c:0x6b5444,p:[p[0],gzY(GZ.r1)+2.5,p[1]]});parts.push({g:new THREE.SphereGeometry(rnd(2.8,3.8),10,8),c:pick([0x5f9a4a,0x6faa55,0xf3b3c6,0x4f8a3e]),p:[p[0],gzY(GZ.r1)+6.2,p[1]],s:[1,1.1,1]})}
  // 모래놀이장 (폴 쪽 끝)
  var sa=-43.6*Math.PI/180,sr=127.5;p=gzP(sa,sr);var sy=gzY(sr);
  parts.push({g:Box(5.2,.35,4.2),c:0xa77a4f,p:[p[0],sy+.12,p[1]],r:[0,-sa,0]});parts.push({g:Box(4.6,.36,3.6),c:0xe9d3a3,p:[p[0],sy+.14,p[1]],r:[0,-sa,0]});
  parts.push({g:new THREE.SphereGeometry(.5,8,6),c:0xf2c230,p:[p[0]+.8,sy+.4,p[1]]});parts.push({g:Box(.6,.4,.6),c:0x3e8ad6,p:[p[0]-.9,sy+.5,p[1]+.4]});
  // 초가정자 (좌중간 끝)
  var pa=-23.6*Math.PI/180,pr=131;p=gzP(pa,pr);var py=gzY(pr);
  parts.push({g:Box(5,.5,5),c:0x9b7653,p:[p[0],py+.25,p[1]],r:[0,-pa+Math.PI/4,0]});
  for(i=0;i<4;i++){var ca=-pa+Math.PI/4+i*Math.PI/2+Math.PI/4,cx=p[0]+Math.sin(ca)*2.9,cz=p[1]+Math.cos(ca)*2.9;parts.push({g:Cyl(.16,.18,3.2,6),c:0x6b4a32,p:[cx,py+2.1,cz]})}
  parts.push({g:new THREE.ConeGeometry(4.6,2.6,4),c:0xcfaa62,p:[p[0],py+4.9,p[1]],r:[0,-pa,0]});
  parts.push({g:new THREE.SphereGeometry(.45,8,6),c:0xb88e48,p:[p[0],py+6.2,p[1]]});
  // 그늘막 텐트
  var spots=[];function free(a,r,d){for(var q=0;q<spots.length;q++){var s=spots[q];if(Math.hypot((a-s[0])*r,r-s[1])<d+s[2])return false}return true}
  spots.push([sa,sr,3.6],[pa,pr,4.2],[-33*Math.PI/180,137.5,4.6]);
  var tc=[0xf6f4ed,0xbfe0f2,0xffd8a8,0xc8e6b0,0xf7c6d4];
  for(i=0,k=0;i<60&&k<8;i++){a=rnd(GZ.a0+.02,GZ.a1-.02);r=rnd(128,139);if(!free(a,r,1.8))continue;spots.push([a,r,1.8]);k++;p=gzP(a,r);
    parts.push({g:new THREE.ConeGeometry(1.7,1.7,4,1,true),c:pick(tc),p:[p[0],gzY(r)+.85,p[1]],r:[0,-a+Math.PI/4,0]})}
  scene.add(new THREE.Mesh(mergeParts(parts),new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide})));
  // 안내판
  var sp=gzP(-33*Math.PI/180,137.5),signTex=canvasTex(512,200,function(x,w,h){x.fillStyle='#2c6a47';x.fillRect(0,0,w,h);x.fillStyle='#f4f2ec';x.textAlign='center';x.textBaseline='middle';x.font='bold 84px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.fillText('그린존',w/2,80);x.font='36px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.fillText('돗자리 펴고 쉬어 가요',w/2,155)});
  var sign=new THREE.Mesh(new THREE.PlaneGeometry(9,3.5),new THREE.MeshBasicMaterial({map:signTex,side:THREE.DoubleSide}));sign.position.set(sp[0],gzY(137.5)+3.6,sp[1]);sign.rotation.y=Math.atan2(-sp[0],-sp[1]);scene.add(sign);
  var sposts=new THREE.Mesh(mergeParts([{g:Box(.3,4,.3),c:0x5b5f55,p:[-3.6,-2,-.1]},{g:Box(.3,4,.3),c:0x5b5f55,p:[3.6,-2,-.1]}]),MVC);sposts.position.copy(sign.position);sposts.rotation.copy(sign.rotation);scene.add(sposts);
  // 돗자리 + 앉은 사람들
  var matTex=canvasTex(64,64,function(x,w,h){x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='rgba(0,0,0,.18)';for(var q=0;q<8;q++){x.fillRect(q*8,0,4,h);x.fillRect(0,q*8,w,4)}});
  matTex.wrapS=matTex.wrapT=THREE.RepeatWrapping;matTex.repeat.set(2,2);
  var mats=[],ppl=[];
  for(i=0;i<400&&mats.length<46;i++){a=rnd(GZ.a0+.01,GZ.a1-.01);r=rnd(124.5,139.5);if(!free(a,r,1.15))continue;spots.push([a,r,1.15]);mats.push({a:a,r:r,y:gzY(r),rot:-a+rnd(-.5,.5)})}
  var mc=[0xf7a8b8,0x8fc9e8,0xf6d36b,0xa7d68a,0xc7b3e6,0xf4f2ec,0xff8a7a];
  var mim=new THREE.InstancedMesh(Box(1.9,.05,1.5),new THREE.MeshLambertMaterial({map:matTex}),mats.length),m4=new THREE.Matrix4(),q4=new THREE.Quaternion(),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1),up=new THREE.Vector3(0,1,0),col=new THREE.Color();
  mats.forEach(function(m,i){p=gzP(m.a,m.r);v.set(p[0],m.y+.04,p[1]);q4.setFromAxisAngle(up,m.rot);m4.compose(v,q4,one);mim.setMatrixAt(i,m4);mim.setColorAt(i,col.setHex(pick(mc)));
    var n=Math.random()<.2?0:1+Math.floor(rnd(0,3));for(var t=0;t<n;t++){var ox=rnd(-.6,.6),oz=rnd(-.4,.4);ppl.push({x:p[0]+Math.cos(m.rot)*ox+Math.sin(m.rot)*oz,z:p[1]-Math.sin(m.rot)*ox+Math.cos(m.rot)*oz,y:m.y,face:Math.atan2(-p[0],-p[1])+rnd(-.6,.6)})}});
  scene.add(mim);
  var bim=new THREE.InstancedMesh(Cyl(.2,.26,.55,8),new THREE.MeshLambertMaterial({color:0xffffff}),ppl.length),him=new THREE.InstancedMesh(new THREE.SphereGeometry(.24,10,8),new THREE.MeshLambertMaterial({color:SKIN}),ppl.length),rim=new THREE.InstancedMesh(new THREE.SphereGeometry(.26,10,6,0,TAU,0,Math.PI*.52),new THREE.MeshLambertMaterial({color:HAIR}),ppl.length);
  ppl.forEach(function(o,i){q4.setFromAxisAngle(up,o.face);v.set(o.x,o.y+.32,o.z);m4.compose(v,q4,one);bim.setMatrixAt(i,m4);v.y=o.y+.78;m4.compose(v,q4,one);him.setMatrixAt(i,m4);rim.setMatrixAt(i,m4);
    var u=Math.random();bim.setColorAt(i,col.setHex(u<.45?UNI.red.hex:u<.7?0xf6f4ed:u<.85?UNI.green.hex:pick([0xf2c230,0x8fc9e8])))});
  scene.add(bim,him,rim);
})();
