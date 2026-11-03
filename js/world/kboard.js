/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= K보드 (홈 뒤 관중석 앞 난간에 거는 K 카드) =================
   kbAdd(look) 카드 한 장을 위에서 내려 난간에 걸어요. look=true면 루킹 삼진 = 뒤집힌 K(ꓘ).
   kbTick(dt) 걸린 뒤 대롱대롱 흔들림 · kbClear() 모두 치우기.
   자리: 홈 뒤 곡면 스탠드(world/curvestand.js) 아래층 앞 유리 난간. 중계 화면(투수 등 뒤)에서 포수 왼쪽, 1루 쪽에 보여요.
   (작은 패치 P) 예전엔 일자 블록 난간(z 15)에 걸었는데, 곡면 스탠드로 바뀌면서 난간이 홈 쪽으로(가운데 z 12.09) 다가오고 옆은 휘어서
   카드가 관중석 속에 파묻혔어요. 그래서 카드마다 난간 위 자리(x,z)와 난간이 바라보는 각도(ang, 도)를 따로 적어요.
   난간 앞줄: 가운데 블록 x −2.9~2.9 (z 12.09), 1루 쪽 블록은 (2.9,12.09)에서 30° 꺾여 (7.92,9.19)까지.
   ※ 이 스탠드를 테이블석 등으로 다시 바꾸면 아래 P 숫자만 새 난간에 맞춰 고치면 돼요. */
var KB={P:[{x:1.8,z:11.88,ang:0},{x:3.36,z:11.6,ang:30},{x:4.53,z:10.92,ang:30}],Y:1.64,W:1.05,H:1.3,cards:[],tex:{}};
function kbTex(look){var k=look?'look':'swing';return KB.tex[k]||(KB.tex[k]=canvasTex(128,160,function(x,w,h){
  x.fillStyle='#ffffff';x.fillRect(0,0,w,h);x.strokeStyle='#c8102e';x.lineWidth=6;x.strokeRect(5,5,w-10,h-10);
  x.save();x.translate(w/2,h/2+6);if(look)x.scale(-1,1);x.textAlign='center';x.textBaseline='middle';
  x.font='900 128px "Arial Black","Helvetica Neue",Arial,sans-serif';x.fillStyle='#c8102e';x.fillText('K',0,0);x.restore();
}))}
KB.geo=new THREE.PlaneGeometry(KB.W,KB.H);KB.geo.translate(0,-KB.H/2,0);
function kbAdd(look){
  var i=KB.cards.length;if(i>=KB.P.length)return;
  var m=new THREE.Mesh(KB.geo,new THREE.MeshLambertMaterial({map:kbTex(look),side:THREE.DoubleSide}));
  var q=KB.P[i];m.rotation.y=Math.PI+q.ang*Math.PI/180;m.position.set(q.x,KB.Y+1.1,q.z);scene.add(m);KB.cards.push({m:m,t:0});
}
function kbTick(dt){KB.cards.forEach(function(c){c.t+=dt;var t=c.t,u=clamp(t/.35,0,1);
  c.m.position.y=KB.Y+1.1*(1-u)*(1-u);c.m.rotation.z=t<.35?0:.32*Math.exp(-2.4*(t-.35))*Math.sin(8*(t-.35))})}
function kbClear(){KB.cards.forEach(function(c){scene.remove(c.m);c.m.material.dispose()});KB.cards=[]}
