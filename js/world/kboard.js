/* ================= K보드 (홈 뒤 관중석 앞 난간에 거는 K 카드) =================
   kbAdd(look) 카드 한 장을 위에서 내려 난간에 걸어요. look=true면 루킹 삼진 = 뒤집힌 K(ꓘ).
   kbTick(dt) 걸린 뒤 대롱대롱 흔들림 · kbClear() 모두 치우기.
   자리: 홈 뒤 블록(z 17) 앞 유리 난간(z 약 15.1, 높이 1.6). 중계 화면(투수 등 뒤)에서 포수 왼쪽, 1루 쪽에 보여요. */
var KB={X:[1.9,3.25,4.6],Y:1.64,Z:15.0,W:1.05,H:1.3,cards:[],tex:{}};
function kbTex(look){var k=look?'look':'swing';return KB.tex[k]||(KB.tex[k]=canvasTex(128,160,function(x,w,h){
  x.fillStyle='#ffffff';x.fillRect(0,0,w,h);x.strokeStyle='#c8102e';x.lineWidth=6;x.strokeRect(5,5,w-10,h-10);
  x.save();x.translate(w/2,h/2+6);if(look)x.scale(-1,1);x.textAlign='center';x.textBaseline='middle';
  x.font='900 128px "Arial Black","Helvetica Neue",Arial,sans-serif';x.fillStyle='#c8102e';x.fillText('K',0,0);x.restore();
}))}
KB.geo=new THREE.PlaneGeometry(KB.W,KB.H);KB.geo.translate(0,-KB.H/2,0);
function kbAdd(look){
  var i=KB.cards.length;if(i>=KB.X.length)return;
  var m=new THREE.Mesh(KB.geo,new THREE.MeshLambertMaterial({map:kbTex(look),side:THREE.DoubleSide}));
  m.rotation.y=Math.PI;m.position.set(KB.X[i],KB.Y+1.1,KB.Z);scene.add(m);KB.cards.push({m:m,t:0});
}
function kbTick(dt){KB.cards.forEach(function(c){c.t+=dt;var t=c.t,u=clamp(t/.35,0,1);
  c.m.position.y=KB.Y+1.1*(1-u)*(1-u);c.m.rotation.z=t<.35?0:.32*Math.exp(-2.4*(t-.35))*Math.sin(8*(t-.35))})}
function kbClear(){KB.cards.forEach(function(c){scene.remove(c.m);c.m.material.dispose()});KB.cards=[]}
