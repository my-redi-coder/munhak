/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 세탁소 (2026-11-04, 작은 패치 U → V에서 다시 고침) =================
   야구장에서 '세탁소'란: 빈 구역 표를 다 사서 좌석마다 유니폼을 펼쳐 놓고, 멀리서 보면 응원하는 선수 등번호처럼 보이게 하는 응원.
   여기서는 꽃돼지 현수막(ZB.hog) 바로 옆 외야 장식 관중석 한 블록(ZB.laundry, outfield.js가 놓아요)을 써요.
   그 블록은 가운데 통로가 있어서 좌석이 좌우 두 구역(9칸씩)으로 나뉘는데, 그 두 구역이 곧 '네모 두 개'예요.

   · 번호 = 입장 준비에서 내가 등판에 박은 번호(ME.backNum). 입력하는 대로 바로 따라가요(ui/setup.js의 syncBack이 laundrySet을 불러요)
     홈에서 외야를 바라본 기준으로
     - 한 자리: 왼쪽 구역은 그대로(관중이 앉아 있음), 오른쪽 구역에만 숫자
     - 두 자리: 왼쪽 구역에 십의 자리, 오른쪽 구역에 일의 자리
     - 번호가 없으면: 두 구역 모두 평소처럼 관중이 앉아 있음 (세탁소 없음)
   · 숫자가 들어간 구역은 관중을 비우고(crowd.hidden), 도트 글자 모양으로 좌석에 유니폼을 걸어요.
   · 도트 한 칸 = 좌석 1개 × 1줄. 글자판은 가로 9칸 × 세로 8줄(구역 하나에 딱 맞음, 세로 줄 폭 2칸)
   · 유니폼 한 장 한 장이 진짜 등판: 흔드는 유니폼(character.js의 jerseyTex)과 같은 티셔츠 모양·같은 숫자 글꼴·크기(drawBack). 글씨만 이 구역은 검정
   · 멀리서 볼 땐 무늬 없는 흰 판으로, 가까이 가거나 확대하면(LDY.near m 안) 번호가 박힌 유니폼 그림으로 바꿔요 — 렌더링 아끼기.
   · 숫자·색·거리는 아래 LDY 한 곳만 고치면 돼요.
   필요: stands.js·outfield.js(ZB.laundry), crowd.js(crowd.hidden·crowdSet·crowdFlush) — index.html에서 crowd.js 바로 뒤에 불러요.
   (character.js의 drawBack·jerseyTex 모양은 그보다 뒤에 불려서, 그림은 처음 가까이 갈 때 만들어요)
   부르는 곳: ui/setup.js(syncBack → laundrySet), app/loop.js(laundryTick) */

/* ---------- 1. 설정 ---------- */
var LDY={
  ink:'#111111',                 // 등판 번호 글씨 색 (이 구역만 검정)
  cloth:'#f6f4ed',               // 유니폼 천 색 (흰색)
  edge:'#c8102e',                // 유니폼 가장자리 선 (흔드는 흰 유니폼과 같은 빨강)
  w:.84,                         // 유니폼 한 장의 폭(m). 좌석 간격(.8)보다 살짝 커서 옆 유니폼과 맞닿음. 높이는 그림 비율대로(256:184)
  lift:.76,                      // 좌석 바닥에서 유니폼 가운데까지 높이(m) — 등받이에 걸친 높이
  push:.03,                      // 좌석 등받이 앞면에서 필드 쪽으로 내미는 거리(m)
  tilt:-.12,                     // 등받이와 같은 기울기
  near:60,                       // 카메라가 이보다 가까우면 번호 그림, 멀면 흰 판 (m)
  hold:8,                        // 바꿀 때 덜 깜빡이게 하는 여유 (m)
  every:.25                      // 거리 확인 간격(초)
};

/* ---------- 2. 도트 글자 (가로 9 × 세로 8, #=유니폼 있음) ---------- */
var LDY_FONT={
  '0':['..#####..','.##...##.','.##...##.','.##...##.','.##...##.','.##...##.','.##...##.','..#####..'],
  '1':['...###...','..####...','...###...','...###...','...###...','...###...','...###...','.#######.'],
  '2':['..#####..','.##...##.','.....###.','....###..','...###...','..###....','.##......','.#######.'],
  '3':['..#####..','.##...##.','.....###.','...####..','.....###.','.....###.','.##...##.','..#####..'],
  '4':['....###..','...####..','..##.##..','.##..##..','.#######.','.....##..','.....##..','.....##..'],
  '5':['.#######.','.##......','.##......','.######..','.....###.','.....###.','.##...##.','..#####..'],
  '6':['..#####..','.##...##.','.##......','.######..','.##...##.','.##...##.','.##...##.','..#####..'],
  '7':['.#######.','.....###.','....###..','....##...','...###...','...##....','...##....','...##....'],
  '8':['..#####..','.##...##.','.##...##.','..#####..','.##...##.','.##...##.','.##...##.','..#####..'],
  '9':['..#####..','.##...##.','.##...##.','.##...##.','..######.','.....##..','.##...##.','..#####..']
};
var LDY_GW=9,LDY_GH=8;

/* ---------- 3. 유니폼 그림·재질 ---------- */
var LDY_H=LDY.w*184/256;                       // 흔드는 유니폼 그림(256×184)과 같은 비율
var LDY_GEO=(function(){var g=new THREE.PlaneGeometry(LDY.w,LDY_H);g.rotateY(Math.PI);return g})();   /* 필드 쪽(-z)을 바라보게 */
/* 흔드는 유니폼(character.js jerseyTex)과 같은 티셔츠 모양, 번호는 같은 drawBack(글꼴·크기 그대로)으로. txt는 번호 전체(예: '14') */
function ldyJerseyTex(txt){
  return canvasTex(256,184,function(x,w,h){
    x.clearRect(0,0,w,h);x.beginPath();
    x.moveTo(84,6);x.lineTo(10,36);x.lineTo(26,82);x.lineTo(60,70);x.lineTo(60,180);x.lineTo(196,180);x.lineTo(196,70);x.lineTo(230,82);x.lineTo(246,36);x.lineTo(172,6);x.quadraticCurveTo(128,26,84,6);x.closePath();
    x.fillStyle=LDY.cloth;x.fill();x.lineWidth=4;x.strokeStyle=LDY.edge;x.stroke();
    drawBack(x,140,150,{ink:LDY.ink,trim:LDY.cloth},'',txt,128,108);
  });
}
var LDY_FAR=new THREE.MeshBasicMaterial({color:LDY.cloth,side:THREE.DoubleSide});   /* 멀리서: 무늬 없는 흰 판. 조명 영향 없이 늘 하얗게 보이게 Basic */
var LDY_NEAR=null,LDY_NEAR_NUM='';                                                 /* 가까이서: 번호 그림(처음 가까이 갈 때 만들고, 번호가 바뀌면 새로) */

/* ---------- 4. 세탁소 블록 준비 ---------- */
var LDYB=null;   /* {blk, mesh, half:{L:{spots},R:{spots}}, showing} — 블록이 없으면 null */
(function(){
  var blk=ZB.laundry;if(!blk)return;
  var im=new THREE.InstancedMesh(LDY_GEO,LDY_FAR,blk.R*blk.C);im.count=0;im.visible=false;im.frustumCulled=false;blk.g.add(im);
  var half={L:{spots:[]},R:{spots:[]}},mid=blk.C/2;
  crowdSpots.forEach(function(cs,i){
    if(cs.blk!==blk)return;
    (cs.seat.c>=mid?half.L:half.R).spots.push(i);   /* 블록 안 x가 클수록(c가 클수록) 홈에서 보면 왼쪽 */
  });
  LDYB={blk:blk,mesh:im,half:half,showing:false};
})();

/* 한 구역에 글자 하나를 놓기: 불 켜진 도트의 좌석마다 유니폼 한 장 (k부터 이어서 놓고 다음 번호를 돌려줘요) */
function ldyFill(side,ch,k){
  var b=LDYB,blk=b.blk,rows=LDY_FONT[ch],mid=blk.C/2,dummy=new THREE.Object3D(),seatAt={};
  if(!rows||mid!==LDY_GW)return k;
  blk.seats.forEach(function(s){seatAt[s.r+','+s.c]=s});
  var c0=side==='L'?mid:0;                               // 구역의 첫 좌석 번호
  for(var gy=0;gy<LDY_GH;gy++)for(var gx=0;gx<LDY_GW;gx++){
    if(rows[gy].charAt(gx)!=='#')continue;
    var s=seatAt[(LDY_GH-1-gy)+','+(c0+(LDY_GW-1-gx))];  // 글자 위쪽이 위 줄, 홈에서 보면 왼쪽(gx 0)이 번호 큰 좌석
    if(!s)continue;
    dummy.position.set(s.x,s.y+LDY.lift,s.z+.21-LDY.push);dummy.rotation.set(LDY.tilt,0,0);dummy.updateMatrix();
    b.mesh.setMatrixAt(k++,dummy.matrix);
  }
  return k;
}
function ldyCrowd(side,hide){
  LDYB.half[side].spots.forEach(function(i){crowd.hidden[i]=hide?1:0;crowdSet(i,0)});
}

/* ---------- 5. 번호가 바뀔 때 ---------- */
var LDY_NUM='';
/* num: 등판 번호 글자(예: '', '7', '14'). 입장 준비에서 입력할 때마다 불려요 */
function laundrySet(num){
  num=String(num==null?'':num).replace(/\D/g,'').slice(0,2);
  LDY_NUM=num;
  if(!LDYB)return;
  var tens=num.length===2?num.charAt(0):'',ones=num.length?num.charAt(num.length-1):'',k=0;
  if(tens)k=ldyFill('L',tens,k);
  if(ones)k=ldyFill('R',ones,k);
  LDYB.mesh.count=k;LDYB.mesh.instanceMatrix.needsUpdate=true;
  LDYB.showing=k>0;LDYB.mesh.visible=k>0;
  ldyCrowd('L',!!tens);ldyCrowd('R',!!ones);                 /* 숫자가 들어간 구역만 관중 비움, 나머지는 평소대로 */
  if(LDY_NEAR){if(LDY_NEAR.map)LDY_NEAR.map.dispose();LDY_NEAR.dispose();LDY_NEAR=null;LDY_NEAR_NUM=''}
  ldyLod(true);crowdFlush();
}

/* ---------- 6. 멀리/가까이 바꾸기 (렌더링 아끼기) ---------- */
var LDY_T=0,LDY_CLOSE=false,LDY_C=new THREE.Vector3();
function ldyLod(force){
  if(!LDYB)return;
  var b=LDYB,want=false;
  if(b.showing){
    LDY_C.set(0,b.blk.base+b.blk.R*RH*.5,b.blk.R*RD*.5);b.blk.g.localToWorld(LDY_C);
    var d=camera.position.distanceTo(LDY_C);
    want=LDY_CLOSE?d<LDY.near+LDY.hold:d<LDY.near;
  }
  if(want&&!LDY_NEAR&&typeof drawBack==='function'){LDY_NEAR=new THREE.MeshBasicMaterial({map:ldyJerseyTex(LDY_NUM),alphaTest:.5,side:THREE.DoubleSide});LDY_NEAR_NUM=LDY_NUM}
  if(!force&&want===LDY_CLOSE)return;
  LDY_CLOSE=want;
  b.mesh.material=(want&&LDY_NEAR)?LDY_NEAR:LDY_FAR;
}
/* 매 프레임 loop.js가 불러요. 거리 확인은 LDY.every초마다 한 번만 */
function laundryTick(dt){
  LDY_T+=dt;if(LDY_T<LDY.every)return;LDY_T=0;ldyLod(false);
}

laundrySet(ME.backNum);   /* 저장돼 있던 번호로 시작 */
