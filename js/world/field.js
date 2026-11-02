/* field texture */
var FN=2048,FS=260,FZ0=-230;
function fx(x){return (x+FS/2)/FS*FN}
function fz(z){return (z-FZ0)/FS*FN}
var FK=FN/FS;
function fenceR(phi){return 95+25*Math.cos(2*phi)}
var fieldTex=canvasTex(FN,FN,function(x){
  x.fillStyle='#78ad4d';x.fillRect(0,0,FN,FN);
  // mow stripes
  for(var i=-30;i<30;i++){if(i%2)continue;x.save();x.translate(fx(0),fz(0));x.rotate(Math.PI/4);x.fillStyle='rgba(255,255,255,.06)';x.fillRect(i*7*FK,-300*FK,7*FK,600*FK);x.restore()}
  x.save();x.translate(fx(0),fz(0));x.rotate(-Math.PI/4);for(i=-30;i<30;i++){if(i%2)continue;x.fillStyle='rgba(0,40,0,.04)';x.fillRect(i*7*FK,-300*FK,7*FK,600*FK)}x.restore();
  // warning track & beyond fence
  x.beginPath();for(var a=-60;a<=60;a+=1){var p=a*Math.PI/180,r=fenceR(clamp(p,-Math.PI/4,Math.PI/4))-3.5;x.lineTo(fx(Math.sin(p)*r),fz(-Math.cos(p)*r))}
  x.lineWidth=4*FK;x.strokeStyle='#c7966a';x.stroke();
  // infield dirt (clip to fair-ish wedge)
  x.save();x.beginPath();x.moveTo(fx(0),fz(4));x.lineTo(fx(-120*Math.sin(.86)),fz(-120*Math.cos(.86)));x.lineTo(fx(120*Math.sin(.86)),fz(-120*Math.cos(.86)));x.closePath();x.clip();
  x.fillStyle='#c9905e';x.beginPath();x.arc(fx(0),fz(-18.4),29*FK,0,TAU);x.fill();x.restore();
  // inner grass
  var c=[[0,-1.6],[17.6,-19.4],[0,-37.2],[-17.6,-19.4]];
  x.fillStyle='#7cb250';x.beginPath();c.forEach(function(p,i){i?x.lineTo(fx(p[0]),fz(p[1])):x.moveTo(fx(p[0]),fz(p[1]))});x.closePath();x.fill();
  x.save();x.clip();for(i=-6;i<6;i++){if(i%2)continue;x.save();x.translate(fx(0),fz(-19.4));x.rotate(Math.PI/4);x.fillStyle='rgba(255,255,255,.07)';x.fillRect(i*4*FK,-30*FK,4*FK,60*FK);x.restore()}x.restore();
  // mound, home, bases
  x.fillStyle='#c9905e';
  [[0,-18.4,2.8],[0,0,4.2],[19.4,-19.4,2],[0,-38.8,2],[-19.4,-19.4,2]].forEach(function(p){x.beginPath();x.arc(fx(p[0]),fz(p[1]),p[2]*FK,0,TAU);x.fill()});
  // foul lines
  x.strokeStyle='#fbfaf4';x.lineWidth=Math.max(2,.12*FK);
  [1,-1].forEach(function(s){x.beginPath();x.moveTo(fx(0),fz(0));var r=fenceR(Math.PI/4);x.lineTo(fx(s*Math.sin(Math.PI/4)*r),fz(-Math.cos(Math.PI/4)*r));x.stroke()});
  // batter boxes
  x.lineWidth=Math.max(2,.08*FK);x.strokeRect(fx(.4),fz(-.9),1.2*FK,1.8*FK);x.strokeRect(fx(-1.6),fz(-.9),1.2*FK,1.8*FK);
  // on-deck circles
  x.fillStyle='rgba(201,144,94,.9)';[[9,4],[-9,4]].forEach(function(p){x.beginPath();x.arc(fx(p[0]),fz(p[1]),1.6*FK,0,TAU);x.fill()});
});
var field=new THREE.Mesh(new THREE.PlaneGeometry(FS,FS),new THREE.MeshLambertMaterial({map:fieldTex}));
field.rotation.x=-Math.PI/2;field.position.set(0,0,FZ0+FS/2);scene.add(field);
var outer=new THREE.Mesh(new THREE.CircleGeometry(700,48),new THREE.MeshLambertMaterial({color:0x93b56d}));outer.rotation.x=-Math.PI/2;outer.position.y=-.05;outer.userData.dimOut=true;scene.add(outer);
