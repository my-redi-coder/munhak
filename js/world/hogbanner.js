/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 꽃돼지 한돈 포스터 그림 (작은 패치 AE, 2026-11-09) =================
   예전엔 3루 외야 관중석 블록 전체를 덮는 큰 현수막이었는데, 실제 문학처럼 '불펜 지붕'으로 바뀌었어요.
   이 파일은 이제 포스터 '그림'만 그려요. 지붕 메시는 world/bullpen.js가 만들어요(1루·3루 둘 다 같은 그림).
   문구 "맘에 드는 맛 / 꽃돼지 한돈"(사용자 지정)과 배트 든 꽃돼지는 그대로예요. 지붕이 가로로 길어서 글자는 왼쪽, 꽃돼지는 오른쪽에 놓았어요.
   숫자는 HOGP 한 곳. */
var HOGP={w:2048,h:570,textX:.27,pigX:.72,pigDY:-20};
function hogPosterDraw(x,w,h){
  var F='"Gowun Dodum","Apple SD Gothic Neo",sans-serif',i;
  x.fillStyle='#ffe873';x.fillRect(0,0,w,h);
  // 테두리: 빨강·하양 줄무늬
  var nx=Math.round(w/21),ny=Math.round(h/21);
  for(i=0;i<nx;i++){x.fillStyle=i%2?'#ffffff':'#e8435a';x.fillRect(i*w/nx,0,w/nx,22);x.fillRect(i*w/nx,h-22,w/nx,22)}
  for(i=0;i<ny;i++){x.fillStyle=i%2?'#ffffff':'#e8435a';x.fillRect(0,i*h/ny,22,h/ny);x.fillRect(w-22,i*h/ny,22,h/ny)}
  x.textAlign='center';x.textBaseline='middle';
  var tx=w*HOGP.textX;
  x.fillStyle='#3d3f52';x.font='bold 70px '+F;x.fillText('맘에 드는 맛',tx,h*.3);
  x.font='bold 132px '+F;x.fillText('꽃돼지 한돈',tx,h*.58);
  // 야구배트 든 꽃돼지 (오리지널) — 예전 1024×600 그림 좌표 그대로, 가로 위치만 옮김
  x.save();x.translate(w*HOGP.pigX-512,HOGP.pigDY);
  var cx=512,cy=395;
  x.fillStyle='#ff9fb4';x.strokeStyle='#d0607c';x.lineWidth=7;
  [-1,1].forEach(function(s){x.beginPath();x.moveTo(cx+s*95,cy-80);x.lineTo(cx+s*140,cy-175);x.lineTo(cx+s*35,cy-125);x.closePath();x.fill();x.stroke()});
  x.fillStyle='#ffc2d0';x.beginPath();x.ellipse(cx,cy,150,128,0,0,TAU);x.fill();x.stroke();
  x.fillStyle='#ff6f91';for(i=0;i<5;i++){var an=i/5*TAU;x.beginPath();x.arc(cx-60+Math.cos(an)*16,cy-122+Math.sin(an)*16,13,0,TAU);x.fill()}
  x.fillStyle='#ffe873';x.beginPath();x.arc(cx-60,cy-122,10,0,TAU);x.fill();
  x.strokeStyle='#4a3a3e';x.lineWidth=10;x.lineCap='round';[-1,1].forEach(function(s){x.beginPath();x.arc(cx+s*62,cy-25,22,Math.PI*1.1,Math.PI*1.9);x.stroke()});
  x.fillStyle='rgba(255,100,135,.5)';[-1,1].forEach(function(s){x.beginPath();x.ellipse(cx+s*100,cy+20,28,17,0,0,TAU);x.fill()});
  x.fillStyle='#ff8fa8';x.beginPath();x.ellipse(cx,cy+38,58,40,0,0,TAU);x.fill();x.strokeStyle='#d0607c';x.lineWidth=6;x.stroke();
  x.fillStyle='#a8455d';[-1,1].forEach(function(s){x.beginPath();x.ellipse(cx+s*20,cy+38,9,15,0,0,TAU);x.fill()});
  x.strokeStyle='#4a3a3e';x.lineWidth=7;x.beginPath();x.arc(cx,cy+84,20,.2*Math.PI,.8*Math.PI);x.stroke();
  x.save();x.translate(cx+150,cy+80);x.rotate(.45);
  x.fillStyle='#c98a4b';x.beginPath();x.moveTo(-14,60);x.lineTo(14,60);x.lineTo(30,-230);x.quadraticCurveTo(0,-262,-30,-230);x.closePath();x.fill();
  x.strokeStyle='#8a5a2c';x.lineWidth=5;x.stroke();x.fillStyle='#8a5a2c';x.fillRect(-18,52,36,14);x.restore();
  x.fillStyle='#ffb3c4';x.strokeStyle='#d0607c';x.lineWidth=6;x.beginPath();x.ellipse(cx+150,cy+80,30,24,0,0,TAU);x.fill();x.stroke();
  x.restore();
}
/* 포스터 텍스처: 글꼴이 늦게 도착해도 다시 그려요 */
function hogPosterTex(){
  var t=canvasTex(HOGP.w,HOGP.h,hogPosterDraw);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){hogPosterDraw(t.image.getContext('2d'),HOGP.w,HOGP.h);t.needsUpdate=true});
  return t;
}
