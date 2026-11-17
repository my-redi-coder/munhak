/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/corner-art: B존 끝 벽 전시 코너의 그림(캔버스 텍스처) =================
   시안: 아티팩트 '문학기념관 · B존 끝 벽 전시 코너 (시안)'. 실제 로고·실제 지폐 도안·실제 선수 사인은 그리지 않아요(분위기만).
   필요: engine/renderer.js(canvasTex) · memorial/toolkit.js(MHF). 내놓는 것: 그림 만드는 함수들(mhc…Tex)과 작은 도구(mhcStd·mhcAdd·mhcRnd) */
var MHC=MH.CORNER;
function mhcStd(o){return new THREE.MeshStandardMaterial(o)}
function mhcAdd(m,x,y,z,parent){m.position.set(x,y,z);(parent||scene).add(m);return m}
function mhcCast(m){m.traverse(function(o){if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});return m}
function mhcRnd(seed){return function(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
function mhcNoiseTex(base,amt,seed){var r=mhcRnd(seed||7);return canvasTex(256,256,function(x,w,h){x.fillStyle=base;x.fillRect(0,0,w,h);
  for(var i=0;i<5000;i++){var v=r();x.fillStyle=v>.5?'rgba(255,255,255,'+amt*r()+')':'rgba(60,45,25,'+amt*r()+')';x.fillRect(r()*w,r()*h,1+r()*2,1+r()*2)}})}


/* 뒤 벽: 경기장 화면·옛 단체사진·문서 */
function mhcStadiumTex(){return canvasTex(1400,560,function(x,w,h){
  var g=x.createLinearGradient(0,0,0,h*.45);g.addColorStop(0,'#8fb9dd');g.addColorStop(1,'#d5e5ef');x.fillStyle=g;x.fillRect(0,0,w,h);
  /* 지붕·관중석 */
  x.fillStyle='#46505e';x.beginPath();x.moveTo(0,h*.18);x.quadraticCurveTo(w*.5,h*.06,w,h*.2);x.lineTo(w,h*.24);x.quadraticCurveTo(w*.5,h*.11,0,h*.22);x.fill();
  for(var i=0;i<9;i++){x.fillStyle=i%2?'#6f8297':'#5c6f86';x.beginPath();var y0=h*(.23+i*.028),y1=y0+h*.028;
    x.moveTo(0,y0+h*.03);x.quadraticCurveTo(w*.5,y0-h*.06,w,y0+h*.03);x.lineTo(w,y1+h*.03);x.quadraticCurveTo(w*.5,y1-h*.06,0,y1+h*.03);x.fill()}
  x.fillStyle='#2e5e3c';x.fillRect(0,h*.5,w,h*.02);
  /* 잔디(줄무늬)·내야 흙·흰 선 */
  for(var k=0;k<10;k++){x.fillStyle=k%2?'#4f9a50':'#5aa85a';x.fillRect(0,h*(.52+k*.048),w,h*.048)}
  x.fillStyle='#b5875c';x.beginPath();x.ellipse(w*.5,h*1.05,w*.38,h*.4,0,Math.PI,2*Math.PI);x.fill();
  x.fillStyle='#5aa85a';x.beginPath();x.ellipse(w*.5,h*1.07,w*.25,h*.25,0,Math.PI,2*Math.PI);x.fill();
  x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=4;x.beginPath();x.moveTo(w*.5,h);x.lineTo(w*.05,h*.62);x.moveTo(w*.5,h);x.lineTo(w*.95,h*.62);x.stroke();
})}
function mhcOldPhotoTex(){var r=mhcRnd(3);return canvasTex(400,280,function(x,w,h){x.fillStyle='#d9d4c8';x.fillRect(0,0,w,h);x.fillStyle='#a7a196';x.fillRect(14,14,w-28,h-28);
  for(var row=0;row<3;row++)for(var i=0;i<9;i++){var cx=40+i*40+(row%2)*10,cy=70+row*60;x.fillStyle='#3b3833';x.beginPath();x.arc(cx,cy,10,0,7);x.fill();x.fillStyle='#e9e5dc';x.fillRect(cx-14,cy+10,28,30)}
  x.fillStyle='rgba(60,50,40,.18)';for(var k=0;k<300;k++)x.fillRect(r()*w,r()*h,2,2)})}
function mhcDocTex(seed,title){var r=mhcRnd(seed);return canvasTex(300,400,function(x,w,h){x.fillStyle='#efe6d2';x.fillRect(0,0,w,h);x.strokeStyle='#b49a6a';x.lineWidth=6;x.strokeRect(14,14,w-28,h-28);
  x.fillStyle='#4a3b26';x.font='700 30px '+MHF.kr;x.textAlign='center';x.fillText(title||'',w/2,70);
  x.fillStyle='#8a7a60';for(var i=0;i<11;i++)x.fillRect(40,100+i*22,(w-80)*(.6+.4*r()),5);
  x.fillStyle='#b03a2e';x.beginPath();x.arc(w*.72,h*.86,22,0,7);x.fill()})}
/* 전시물 그림: 유니폼·가방 무늬·사인판·공·오만원·지폐 옆면 */
function mhcJerseyTex(){return canvasTex(840,750,function(x,w,h){
  /* uv: x -0.42~0.42 → 0~w, y 0~0.75 → 아래~위 */
  x.fillStyle='#fbfbf9';x.fillRect(0,0,w,h);
  x.strokeStyle='rgba(200,16,46,.13)';x.lineWidth=2;for(var i=0;i<w;i+=26){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}
  var X=function(v){return(v+.42)/.84*w},Y=function(v){return h-v/.75*h};
  x.fillStyle=MHC.red;x.beginPath();x.moveTo(X(-.42),Y(.43));x.lineTo(X(-.39),Y(.51));x.lineTo(X(-.37),Y(.5));x.lineTo(X(-.4),Y(.42));x.fill();
  x.beginPath();x.moveTo(X(.42),Y(.43));x.lineTo(X(.39),Y(.51));x.lineTo(X(.37),Y(.5));x.lineTo(X(.4),Y(.42));x.fill();
  x.lineWidth=12;x.strokeStyle=MHC.red;x.beginPath();x.moveTo(X(-.09),Y(.75));x.quadraticCurveTo(X(0),Y(.66),X(.09),Y(.75));x.stroke();
  x.font='700 132px '+MHF.cond;x.textAlign='center';x.lineWidth=10;x.strokeStyle='#5c0a18';x.fillStyle=MHC.red;x.lineJoin='round';
  x.save();x.translate(w/2,Y(.38));x.rotate(-.05);x.strokeText('MUNHAK',0,0);x.fillText('MUNHAK',0,0);x.restore();
  x.fillStyle='#d6a640';x.beginPath();x.arc(X(.16),Y(.17),34,0,7);x.fill();x.fillStyle=MHC.red;x.beginPath();x.arc(X(.16),Y(.17),26,0,7);x.fill();
  x.fillStyle='#9a9a9a';x.font='600 26px '+MHF.cond;x.fillText('SSG.COM',X(-.15),Y(.6));x.fillText('SSG.COM',X(.15),Y(.6));
  x.fillStyle='#e8bf3a';x.fillRect(X(.33),Y(.56),30,18);
})}
function mhcBagTex(){return canvasTex(1024,512,function(x,w,h){x.fillStyle='#5e3f27';x.fillRect(0,0,w,h);
  /* 무늬: 꽃잎·별 모양을 비스듬한 격자로 (실제 로고 글자는 넣지 않음) */
  x.fillStyle='#b88a52';var step=64;
  for(var r=0;r<h/step+1;r++)for(var c=0;c<w/step+1;c++){var cx=c*step+(r%2)*step/2,cy=r*step;
    var k=(r+c)%3;x.save();x.translate(cx,cy);
    if(k===0){for(var p=0;p<4;p++){x.rotate(Math.PI/2);x.beginPath();x.ellipse(0,-9,5,9,0,0,7);x.fill()}x.fillStyle='#5e3f27';x.beginPath();x.arc(0,0,3,0,7);x.fill();x.fillStyle='#b88a52'}
    else if(k===1){x.beginPath();for(var q=0;q<8;q++){var a=q*Math.PI/4,rr=q%2?5:13;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.fill()}
    else{x.beginPath();x.arc(0,0,11,0,7);x.fill();x.fillStyle='#5e3f27';for(var s=0;s<4;s++){x.beginPath();x.ellipse(Math.cos(s*Math.PI/2+.78)*5,Math.sin(s*Math.PI/2+.78)*5,3,5,s*Math.PI/2+.78,0,7);x.fill()}x.fillStyle='#b88a52'}
    x.restore()}
  var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,240,220,.12)');g.addColorStop(1,'rgba(0,0,0,.18)');x.fillStyle=g;x.fillRect(0,0,w,h)})}
function mhcSignTex(){var r=mhcRnd(29);return canvasTex(560,430,function(x,w,h){x.fillStyle='#ece9e2';x.fillRect(0,0,w,h);
  for(var i=0;i<1600;i++){x.fillStyle='rgba(120,110,95,'+r()*.12+')';x.fillRect(r()*w,r()*h,2,2)}
  /* 사인: 굵은 매직 느낌의 빠른 획 + 끝을 돼지꼬리처럼 말아 뺌 + 18 */
  x.strokeStyle='#1d1d20';x.lineCap='round';x.lineJoin='round';
  var L=function(wd,pts){x.lineWidth=wd;x.beginPath();x.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=6)x.bezierCurveTo(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5]);x.stroke()};
  L(11,[70,215, 120,190,165,175,175,182, 160,230,120,290,105,325, 150,310,205,300,245,300]);   /* 첫 꺾임 */
  L(12,[205,150, 215,200,212,250,200,330]);                                                     /* 세로 내리긋기 */
  L(10,[230,205, 270,170,300,175,285,220, 270,260,240,250,265,230]);                           /* 동그랗게 감기 */
  L(11,[290,300, 300,250,320,200,345,170, 330,230,330,290,350,320]);                           /* 뾰족 산 */
  L(8,[120,265, 250,215,380,165,470,125]);                                                      /* 길게 그은 사선 */
  /* 돼지꼬리: 오른쪽 아래로 빠지며 두 바퀴 꼬불 */
  x.lineWidth=7;x.beginPath();x.moveTo(350,320);x.bezierCurveTo(375,345,400,340,405,320);
  var cx=420,cy=322;for(var k=0;k<=2*Math.PI*2.1;k+=.08){var rr=17-k*1.1;x.lineTo(cx+Math.cos(k+Math.PI)*rr+k*2.2,cy+Math.sin(k+Math.PI)*rr*.85)}x.stroke();
  /* 18 */
  x.lineWidth=9;x.beginPath();x.moveTo(445,195);x.lineTo(430,275);x.stroke();
  x.lineWidth=8;x.beginPath();x.ellipse(478,212,15,17,.2,0,7);x.stroke();x.beginPath();x.ellipse(470,255,19,22,.2,0,7);x.stroke();
  x.strokeStyle='#cfc9bd';x.lineWidth=10;x.strokeRect(5,5,w-10,h-10)})}
function mhcBallTex(){return canvasTex(256,128,function(x,w,h){x.fillStyle='#f6f4ee';x.fillRect(0,0,w,h);x.strokeStyle='#c8102e';x.lineWidth=3;
  for(var s=0;s<2;s++){x.beginPath();for(var i=0;i<=64;i++){var u=i/64*w,v=h/2+Math.sin(i/64*Math.PI*2+s*Math.PI)*h*.3;i?x.lineTo(u,v):x.moveTo(u,v)}x.stroke()}
  x.fillStyle='#2a3a6a';x.font='700 16px '+MHF.cond;x.fillText('MUNHAK',w*.38,h*.55)})}
function mhcBillTex(){var r=mhcRnd(77);return canvasTex(512,226,function(x,w,h){
  var g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#f1c46a');g.addColorStop(.5,'#f6d688');g.addColorStop(1,'#e7b357');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.strokeStyle='rgba(150,95,30,.35)';x.lineWidth=1;for(var i=0;i<40;i++){x.beginPath();x.arc(w*.3,h*.5,8+i*5,0,7);x.stroke()}
  x.fillStyle='rgba(255,246,220,.85)';x.beginPath();x.ellipse(w*.72,h*.5,48,62,0,0,7);x.fill();
  x.fillStyle='rgba(120,80,40,.55)';x.beginPath();x.ellipse(w*.72,h*.44,18,22,0,0,7);x.fill();x.beginPath();x.ellipse(w*.72,h*.72,32,22,0,Math.PI,0);x.fill();
  x.fillStyle='#7a4a1c';x.font='700 38px '+MHF.cond;x.fillText('50000',22,52);x.font='700 26px '+MHF.cond;x.fillText('50000',w-110,h-18);
  /* 띠지 */
  x.fillStyle='#fdfcf8';x.fillRect(w*.42,0,46,h);x.fillStyle='#b8322a';x.font='700 15px '+MHF.kr;x.save();x.translate(w*.42+30,h*.5);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('오만원 100장',0,0);x.restore();
})}
function mhcEdgeTex(){return canvasTex(256,32,function(x,w,h){x.fillStyle='#ecd6a4';x.fillRect(0,0,w,h);for(var i=0;i<h;i+=2){x.fillStyle=i%4?'#f3e2b8':'#d9be82';x.fillRect(0,i,w,1)}x.fillStyle='#fdfcf8';x.fillRect(w*.42,0,24,h)})}
