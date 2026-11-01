/* ================= 3루 외야 홈런 현수막 =================
   홈런이 자주 떨어지는 3루 쪽 외야 관중석(ZB.hog 블록) 위에 덮어 둔 큰 현수막.
   문구 &quot;맘에 드는 맛 / 꽃돼지 한돈&quot;(사용자 지정), 그림은 직접 그린 배트 든 꽃돼지. 아래 좌석은 stands.js의 empty 옵션으로 비워 둠. */
var hogTex=canvasTex(1024,600,function(x,w,h){
  var F='"Gowun Dodum","Apple SD Gothic Neo",sans-serif';
  x.fillStyle='#ffe873';x.fillRect(0,0,w,h);
  // 테두리: 빨강·하양 줄무늬
  for(var i=0;i<48;i++){x.fillStyle=i%2?'#ffffff':'#e8435a';x.fillRect(i*w/48,0,w/48,22);x.fillRect(i*w/48,h-22,w/48,22)}
  for(i=0;i<28;i++){x.fillStyle=i%2?'#ffffff':'#e8435a';x.fillRect(0,i*h/28,22,h/28);x.fillRect(w-22,i*h/28,22,h/28)}
  x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='#3d3f52';x.font='bold 50px '+F;x.fillText('맘에 드는 맛',w/2,72);
  x.font='bold 104px '+F;x.fillText('꽃돼지 한돈',w/2,160);
  // 야구배트 든 꽃돼지 (오리지널)
  var cx=w/2,cy=395;
  // 귀
  x.fillStyle='#ff9fb4';x.strokeStyle='#d0607c';x.lineWidth=7;
  [-1,1].forEach(function(s){x.beginPath();x.moveTo(cx+s*95,cy-80);x.lineTo(cx+s*140,cy-175);x.lineTo(cx+s*35,cy-125);x.closePath();x.fill();x.stroke()});
  // 얼굴
  x.fillStyle='#ffc2d0';x.beginPath();x.ellipse(cx,cy,150,128,0,0,TAU);x.fill();x.stroke();
  // 머리 위 꽃
  x.fillStyle='#ff6f91';for(i=0;i<5;i++){var an=i/5*TAU;x.beginPath();x.arc(cx-60+Math.cos(an)*16,cy-122+Math.sin(an)*16,13,0,TAU);x.fill()}
  x.fillStyle='#ffe873';x.beginPath();x.arc(cx-60,cy-122,10,0,TAU);x.fill();
  // 눈·볼·코·입
  x.strokeStyle='#4a3a3e';x.lineWidth=10;x.lineCap='round';[-1,1].forEach(function(s){x.beginPath();x.arc(cx+s*62,cy-25,22,Math.PI*1.1,Math.PI*1.9);x.stroke()});
  x.fillStyle='rgba(255,100,135,.5)';[-1,1].forEach(function(s){x.beginPath();x.ellipse(cx+s*100,cy+20,28,17,0,0,TAU);x.fill()});
  x.fillStyle='#ff8fa8';x.beginPath();x.ellipse(cx,cy+38,58,40,0,0,TAU);x.fill();x.strokeStyle='#d0607c';x.lineWidth=6;x.stroke();
  x.fillStyle='#a8455d';[-1,1].forEach(function(s){x.beginPath();x.ellipse(cx+s*20,cy+38,9,15,0,0,TAU);x.fill()});
  x.strokeStyle='#4a3a3e';x.lineWidth=7;x.beginPath();x.arc(cx,cy+84,20,.2*Math.PI,.8*Math.PI);x.stroke();
  // 배트 (오른손에 들고 위로)
  x.save();x.translate(cx+150,cy+80);x.rotate(.45);
  x.fillStyle='#c98a4b';x.beginPath();x.moveTo(-14,60);x.lineTo(14,60);x.lineTo(30,-230);x.quadraticCurveTo(0,-262,-30,-230);x.closePath();x.fill();
  x.strokeStyle='#8a5a2c';x.lineWidth=5;x.stroke();x.fillStyle='#8a5a2c';x.fillRect(-18,52,36,14);x.restore();
  // 손(앞발)으로 배트 잡기
  x.fillStyle='#ffb3c4';x.strokeStyle='#d0607c';x.lineWidth=6;x.beginPath();x.ellipse(cx+150,cy+80,30,24,0,0,TAU);x.fill();x.stroke();
});
var hogBanner=null;
(function(){
  var blk=ZB.hog;if(!blk)return;
  var z0=-.2,z1=blk.R*RD,len=Math.hypot(z1-z0,(z1-z0)*RH/RD),wid=blk.W-.6;
  var geo=new THREE.PlaneGeometry(wid,len,14,14),pa=geo.attributes.position;
  for(var i=0;i<pa.count;i++){var px=pa.getX(i),py=pa.getY(i);pa.setZ(i,Math.sin(px*.9+py*.5)*.06+Math.sin(py*1.3)*.05)}
  geo.computeVertexNormals();
  var sd=new THREE.Vector3(0,RH,RD).normalize(),n=new THREE.Vector3(-1,0,0).cross(sd);
  geo.applyMatrix4(new THREE.Matrix4().makeBasis(new THREE.Vector3(-1,0,0),sd,n));
  var zc=(z0+z1)/2,yc=blk.base+zc*RH/RD+.75;
  hogBanner=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:hogTex,side:THREE.DoubleSide}));
  hogBanner.position.set(0,yc,zc);blk.g.add(hogBanner);
  // 맨 위 난간에 묶은 끈
  var ties=[];[-1,1].forEach(function(s){ties.push({g:Box(.06,.06,.8),c:0xf4f2ec,p:[s*(wid/2-.3),blk.base+(blk.R-1)*RH+1.05,z1-.1]})});
  blk.g.add(new THREE.Mesh(mergeParts(ties),MVC));
})();
