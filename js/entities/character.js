/* ================= character ================= */
var GEO={};
GEO.base=mergeParts([{g:Cyl(.27,.27,.14,16),c:PANTS,p:[0,.45,0]}]);
GEO.leg=mergeParts([{g:Cyl(.09,.085,.25,10),c:PANTS,p:[0,-.125,0]},{g:Cyl(.072,.07,.08,10),c:0xc8102e,p:[0,-.29,0]},{g:Box(.15,.09,.22),c:SHOE,p:[0,-.355,.035]}]);
GEO.torso=Cyl(.25,.3,.52,18);
GEO.backSeg=new THREE.CylinderGeometry(.259,.305,.46,14,1,true,Math.PI-.78,1.56);
GEO.head=new THREE.SphereGeometry(.32,24,18);
GEO.face=new THREE.SphereGeometry(.324,20,12,Math.PI/2-.85,1.7,1.2,.9);
GEO.hair=(function(){var g=mergeParts([{g:new THREE.SphereGeometry(.35,24,12,0,TAU,0,Math.PI*.42),c:HAIR},{g:Cyl(.352,.385,.32,28,true,.95,TAU-1.9),c:HAIR,p:[0,-.05,0]}]);return g})();
GEO.jersey=new THREE.PlaneGeometry(.86,.62,12,6);
var ARMGEO={};
function armGeo(k){if(ARMGEO[k])return ARMGEO[k];var sl=k==='tee'?TEE:UNI[k].hex;ARMGEO[k]=mergeParts([{g:Cyl(.078,.072,k==='tee'?.12:.26,10),c:sl,p:[0,k==='tee'?-.06:-.12,0]},{g:Cyl(.062,.06,k==='tee'?.26:.14,10),c:SKIN,p:[0,k==='tee'?-.24:-.31,0]},{g:new THREE.SphereGeometry(.078,10,8),c:SKIN,p:[0,-.4,0]}]);return ARMGEO[k]}
var M={skin:new THREE.MeshLambertMaterial({color:SKIN}),hair:new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide})};
var shadowTex=canvasTex(64,64,function(x){var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(40,50,30,.42)');g.addColorStop(1,'rgba(40,50,30,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
var shadowMat=new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false});
GEO.shadow=new THREE.CircleGeometry(.45,20);GEO.shadow.rotateX(-Math.PI/2);

function faceTex(kind){
  return canvasTex(256,136,function(x,w,h){
    x.clearRect(0,0,w,h);
    x.fillStyle='rgba(255,140,150,.45)';[[66,80],[190,80]].forEach(function(p){x.beginPath();x.ellipse(p[0],p[1],15,9,0,0,TAU);x.fill()});
    x.strokeStyle='#2b2320';x.fillStyle='#2b2320';x.lineCap='round';x.lineWidth=5;
    if(kind==='happy'){[[96,54],[160,54]].forEach(function(p){x.beginPath();x.moveTo(p[0]-9,p[1]+4);x.lineTo(p[0],p[1]-5);x.lineTo(p[0]+9,p[1]+4);x.stroke()});x.beginPath();x.moveTo(114,82);x.quadraticCurveTo(128,104,142,82);x.closePath();x.fillStyle='#9b3a3a';x.fill()}
    else if(kind==='angry'){x.lineWidth=6;x.beginPath();x.moveTo(82,36);x.lineTo(106,46);x.moveTo(174,36);x.lineTo(150,46);x.stroke();[[96,58],[160,58]].forEach(function(p){x.beginPath();x.ellipse(p[0],p[1],6,7,0,0,TAU);x.fill()});x.lineWidth=5;x.beginPath();x.moveTo(114,96);x.quadraticCurveTo(128,84,142,96);x.stroke();x.strokeStyle='#e0263f';x.lineWidth=4;x.beginPath();x.moveTo(196,22);x.quadraticCurveTo(204,30,212,22);x.moveTo(196,40);x.quadraticCurveTo(204,32,212,40);x.moveTo(194,24);x.quadraticCurveTo(202,31,194,38);x.moveTo(214,24);x.quadraticCurveTo(206,31,214,38);x.stroke()}
    else if(kind==='blink'){x.lineWidth=5;[[96,56],[160,56]].forEach(function(p){x.beginPath();x.moveTo(p[0]-8,p[1]);x.lineTo(p[0]+8,p[1]);x.stroke()});x.lineWidth=4;x.beginPath();x.moveTo(118,86);x.quadraticCurveTo(128,94,138,86);x.stroke()}
    else{[[96,56],[160,56]].forEach(function(p){x.beginPath();x.ellipse(p[0],p[1],7,9.5,0,0,TAU);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(p[0]+2.5,p[1]-3.5,2.4,0,TAU);x.fill();x.fillStyle='#2b2320'});x.lineWidth=4;x.beginPath();x.moveTo(118,86);x.quadraticCurveTo(128,94,138,86);x.stroke()}
  });
}
var FACE={};['normal','happy','angry','blink'].forEach(function(k){FACE[k]=new THREE.MeshLambertMaterial({map:faceTex(k),transparent:true,depthWrite:false})});

var KFONT='"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif';
function drawBack(x,w,h,u,name,num,ox,oy){
  x.textAlign='center';x.textBaseline='middle';
  if(name){x.fillStyle=u.ink;x.font='bold '+(name.length>5?26:32)+'px '+KFONT;x.fillText(name,ox,oy-h*.27)}
  if(num!==''&&num!=null){x.font='900 '+Math.round(h*.46)+'px "Arial Black","Helvetica Neue",Arial,sans-serif';x.lineWidth=7;x.strokeStyle=u.trim;x.strokeText(String(num),ox,oy+h*.1);x.fillStyle=u.ink;x.fillText(String(num),ox,oy+h*.1)}
}
function backTex(uk,name,num){var u=UNI[uk];return canvasTex(240,256,function(x,w,h){x.fillStyle=u.css;x.fillRect(0,0,w,h);if(uk==='white'){x.strokeStyle='rgba(29,44,79,.12)';x.lineWidth=2;for(var i=10;i<w;i+=22){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}}drawBack(x,w,h,u,name,num,w/2,h/2+6)})}
function jerseyTex(uk,name,num){var u=UNI[uk];return canvasTex(256,184,function(x,w,h){
  x.clearRect(0,0,w,h);x.beginPath();x.moveTo(84,6);x.lineTo(10,36);x.lineTo(26,82);x.lineTo(60,70);x.lineTo(60,180);x.lineTo(196,180);x.lineTo(196,70);x.lineTo(230,82);x.lineTo(246,36);x.lineTo(172,6);x.quadraticCurveTo(128,26,84,6);x.closePath();
  x.fillStyle=u.css;x.fill();x.lineWidth=4;x.strokeStyle=uk==='white'?'#c8102e':'rgba(255,255,255,.75)';x.stroke();
  drawBack(x,140,150,u,name,num,128,108)})}

var jerseyShared={};
function Char(o){
  this.name=o.name;this.uk=o.uni;this.player=!!o.player;this.npc=!o.player;
  var root=this.root=new THREE.Group(),body=this.body=new THREE.Group();root.add(body);
  this.torsoMat=new THREE.MeshLambertMaterial({color:UNI[o.uni].hex});
  this.meshes=[];var self=this;
  function add(parent,mesh){parent.add(mesh);mesh.userData.char=self;self.meshes.push(mesh);return mesh}
  add(body,new THREE.Mesh(GEO.base,MVC));
  this.legA=new THREE.Group();this.legA.position.set(.11,.4,0);body.add(this.legA);add(this.legA,new THREE.Mesh(GEO.leg,MVC));
  this.legB=new THREE.Group();this.legB.position.set(-.11,.4,0);body.add(this.legB);add(this.legB,new THREE.Mesh(GEO.leg,MVC));
  this.torso=add(body,new THREE.Mesh(GEO.torso,this.torsoMat));this.torso.position.y=.7;
  this.backMat=new THREE.MeshLambertMaterial({color:0xffffff});
  this.back=add(body,new THREE.Mesh(GEO.backSeg,this.backMat));this.back.position.y=.7;
  this.armA=new THREE.Group();this.armA.position.set(.31,.9,0);body.add(this.armA);this.armAm=add(this.armA,new THREE.Mesh(armGeo(o.uni),MVC));
  this.armB=new THREE.Group();this.armB.position.set(-.31,.9,0);body.add(this.armB);this.armBm=add(this.armB,new THREE.Mesh(armGeo(o.uni),MVC));
  var hg=this.headG=new THREE.Group();hg.position.y=1.24;body.add(hg);
  add(hg,new THREE.Mesh(GEO.head,M.skin));
  this.face=add(hg,new THREE.Mesh(GEO.face,FACE.normal));this.faceKind='normal';
  add(hg,new THREE.Mesh(GEO.hair,M.hair));
  this.jersey=new THREE.Group();this.jersey.position.set(0,1.64,-.12);this.jersey.visible=false;body.add(this.jersey);
  this.jGeo=this.player?GEO.jersey.clone():GEO.jersey;
  this.jMat=new THREE.MeshLambertMaterial({transparent:true,alphaTest:.3,side:THREE.FrontSide});
  var j1=new THREE.Mesh(this.jGeo,this.jMat),j2=new THREE.Mesh(this.jGeo,this.jMat);j2.rotation.y=Math.PI;this.jersey.add(j1);this.jersey.add(j2);
  if(o.shadow!==false){this.shadow=new THREE.Mesh(GEO.shadow,shadowMat);this.shadow.position.y=.02;root.add(this.shadow)}
  this.cur={aZ:.12,aX:0,bZ:-.12,bX:0,lA:0,lB:0,y:0,tilt:0,head:0,jz:0};
  this.mode='stand';this.act=null;this.t=Math.random()*10;this.blinkT=rnd(2,5);this.beatOff=Math.random()<.5?0:(Math.random()<.5?.08:-.08);
  this.setBack(o.backName||'',o.backNum==null?'':o.backNum);
}
Char.prototype.setUniform=function(k){this.uk=k;this.torsoMat.color.setHex(this.act==='wave'?TEE:UNI[k].hex);var ag=armGeo(this.act==='wave'?'tee':k);this.armAm.geometry=ag;this.armBm.geometry=ag;this.setBack(this.bn,this.bnum)};
Char.prototype.setBack=function(name,num){
  this.bn=name;this.bnum=num;
  if(this.backMat.map)this.backMat.map.dispose();this.backMat.map=backTex(this.uk,name,num);this.backMat.needsUpdate=true;
  if(this.jMat.map)this.jMat.map.dispose();this.jMat.map=jerseyTex(this.uk,name,num);this.jMat.needsUpdate=true;
};
Char.prototype.setAct=function(a){
  var prev=this.act;this.act=a;
  var wave=a==='wave';
  if((prev==='wave')!==wave){this.torsoMat.color.setHex(wave?TEE:UNI[this.uk].hex);var ag=armGeo(wave?'tee':this.uk);this.armAm.geometry=ag;this.armBm.geometry=ag;this.back.visible=!wave;this.jersey.visible=wave}
};
Char.prototype.setFace=function(k){if(this.faceKind!==k){this.faceKind=k;this.face.material=FACE[k]}};
Char.prototype.update=function(dt,beat){
  this.t+=dt;var t=this.t,P={aZ:.12,aX:0,bZ:-.12,bX:0,lA:0,lB:0,y:0,tilt:0,head:0,jz:0},face='normal',k=14;
  if(this.mode==='walk'){var s=Math.sin(t*11);P.lA=s*.7;P.lB=-s*.7;P.aX=-s*.55;P.bX=s*.55;P.y=Math.abs(Math.cos(t*11))*.04}
  else if(this.mode==='sit'){P.lA=P.lB=-1.45;P.aX=P.bX=-.4;P.aZ=.16;P.bZ=-.16;P.y=Math.sin(t*1.6)*.006}
  else P.y=Math.sin(t*2)*.008;
  if(this.act==='cheer'){
    var b=beat+this.beatOff,bf=Math.floor(b),bi=((bf%8)+8)%8,f=b-bf;
    P.y=Math.abs(Math.sin(Math.PI*b))*.075;P.lA=P.lB=0;face='happy';k=20;
    if(bi<2){P.aZ=2.6;P.aX=-.25;P.bZ=-.32;P.bX=-.2;P.tilt=-.08}
    else if(bi<4){P.bZ=-2.6;P.bX=-.25;P.aZ=.32;P.aX=-.2;P.tilt=.08}
    else if(bi<6){var sw=Math.sin(Math.PI*(b-4)*.5+Math.PI/2);P.aZ=2.75;P.bZ=-2.75;P.tilt=sw*.17}
    else{var cl=Math.max(0,Math.sin(TAU*f));P.aX=P.bX=-1.35;P.aZ=.3-.24*cl;P.bZ=-P.aZ}
  }else if(this.act==='angry'){
    P.y=Math.abs(Math.sin(t*11))*.15;P.lA=P.lB=0;var sh=Math.sin(t*34)*.2;P.aX=-1.8+sh;P.bX=-1.8-sh;P.aZ=.42;P.bZ=-.42;P.tilt=Math.sin(t*21)*.05;P.head=Math.sin(t*17)*.09;face='angry';k=22;
  }else if(this.act==='wave'){
    P.lA=P.lB=0;var w=Math.sin(t*5.5);P.aZ=2.88+w*.12;P.bZ=-2.88+w*.12;P.tilt=w*.05;P.y=Math.abs(w)*.03;P.jz=w*.2;face='happy';
    if(this.player){var pa=this.jGeo.attributes.position,a=pa.array;for(var i=0;i<pa.count;i++){var x=a[i*3],y=a[i*3+1];a[i*3+2]=Math.sin(x*7+t*9)*.035*(.4+Math.abs(x))+Math.sin(y*6+t*7)*.02}pa.needsUpdate=true}
  }
  this.blinkT-=dt;if(face==='normal'){if(this.blinkT<0){face='blink';if(this.blinkT<-.13)this.blinkT=rnd(2.2,5)}}
  this.setFace(face);
  var c=this.cur;for(var key in P)c[key]=damp(c[key],P[key],k,dt);
  this.armA.rotation.set(c.aX,0,c.aZ);this.armB.rotation.set(c.bX,0,c.bZ);
  this.legA.rotation.x=c.lA;this.legB.rotation.x=c.lB;
  this.body.position.y=c.y;this.body.rotation.z=c.tilt;this.headG.rotation.z=c.head;this.jersey.rotation.z=c.jz;
};
Char.prototype.dispose=function(){if(this.root.parent)this.root.parent.remove(this.root);if(this.backMat.map)this.backMat.map.dispose();if(this.jMat.map)this.jMat.map.dispose();this.torsoMat.dispose();this.backMat.dispose();this.jMat.dispose();if(this.player)this.jGeo.dispose()};
