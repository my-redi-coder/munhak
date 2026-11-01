/* fence */
(function(){
  var P=[],N=[],h=3.1,parts=[];
  for(var a=-45;a<45;a+=1.5){
    var p0=a*Math.PI/180,p1=(a+1.5)*Math.PI/180,r0=fenceR(p0),r1=fenceR(p1);
    var A=[Math.sin(p0)*r0,-Math.cos(p0)*r0],B=[Math.sin(p1)*r1,-Math.cos(p1)*r1];
    var nx=-(Math.sin(p0)+Math.sin(p1))/2,nz=(Math.cos(p0)+Math.cos(p1))/2;
    P.push(A[0],0,A[1],B[0],0,B[1],B[0],h,B[1], A[0],0,A[1],B[0],h,B[1],A[0],h,A[1]);
    for(var k=0;k<6;k++)N.push(nx,0,nz);
  }
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  scene.add(new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:0x2c6a47,side:THREE.DoubleSide})));
  var g2=g.clone();g2.scale(1.0,.05,1.0);var m2=new THREE.Mesh(g2,new THREE.MeshLambertMaterial({color:0xf0c43c,side:THREE.DoubleSide}));m2.position.y=h;scene.add(m2);
  [1,-1].forEach(function(s){var r=fenceR(Math.PI/4);var pole=new THREE.Mesh(Cyl(.25,.3,24,8),new THREE.MeshLambertMaterial({color:0xf0c43c}));pole.position.set(s*Math.sin(Math.PI/4)*r,12,-Math.cos(Math.PI/4)*r);scene.add(pole)});
})();

/* bases, mound, dugouts */
(function(){
  var parts=[];
  [[19.4,-19.4],[0,-38.8],[-19.4,-19.4]].forEach(function(b){parts.push({g:Box(.4,.08,.4),c:0xffffff,p:[b[0],.04,b[1]],r:[0,Math.PI/4,0]})});
  parts.push({g:Box(.43,.03,.43),c:0xffffff,p:[0,.02,-.1],r:[0,Math.PI/4,0]});
  parts.push({g:Cyl(2.6,2.8,.25,24),c:0xc4895a,p:[0,.12,-18.4]});
  parts.push({g:Box(.6,.05,.15),c:0xffffff,p:[0,.27,-18.4]});
  [1,-1].forEach(function(s){
    var d=[s*.7071,-.7071],n=[s*.7071,.7071],cx=d[0]*14+n[0]*10.5,cz=d[1]*14+n[1]*10.5,ry=s*Math.PI/4;
    parts.push({g:Box(12,1.2,3),c:0x3b4a3f,p:[cx,.6,cz],r:[0,ry,0]});
    parts.push({g:Box(12.4,.2,3.6),c:0xc8102e,p:[cx,1.3,cz],r:[0,ry,0]});
  });
  scene.add(new THREE.Mesh(mergeParts(parts),MVC));
})();

/* LED ribbon */
var ledTex=canvasTex(1024,64,function(x,w,h){x.fillStyle='#14211b';x.fillRect(0,0,w,h);x.font='30px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.textBaseline='middle';var msgs=['봄에 만나요','1루 관중석','다음 시즌, 문학에서','소리 질러!'];var px=20;for(var i=0;i<8;i++){var m=msgs[i%msgs.length];x.fillStyle=i%2?'#f6e7b0':'#ff5a6e';x.fillText(m,px,h/2+2);px+=x.measureText(m).width+60}});
ledTex.wrapS=THREE.RepeatWrapping;
var ledMat=new THREE.MeshBasicMaterial({map:ledTex,fog:false});
