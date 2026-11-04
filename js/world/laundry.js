/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 세탁소 (2026-11-04) =================
   야구장에서 '세탁소'란: 빈 구역 표를 다 사서 좌석마다 유니폼을 펼쳐 놓고, 멀리서 보면 응원하는 선수 등번호처럼 보이게 하는 응원.
   여기서는 꽃돼지 현수막(ZB.hog) 바로 옆 외야 장식 관중석 두 칸(ZB.laundry, outfield.js가 놓아요)에 내 등번호를 깔아요.

   · 번호 = 입장 준비에서 내가 등판에 박은 번호(ME.backNum). 입력하는 대로 바로 따라가요(ui/setup.js의 syncBack이 laundrySet을 불러요)
     - 한 자리: 왼쪽 칸은 그대로(관중이 앉아 있음), 오른쪽 칸에만 숫자
     - 두 자리: 왼쪽 칸에 십의 자리, 오른쪽 칸에 일의 자리
     - 번호가 없으면: 두 칸 모두 평소처럼 관중이 앉아 있음 (세탁소 없음)
   · 번호가 들어간 칸은 관중을 비우고(crowd.hidden), 도트 글자 모양으로 좌석에 유니폼을 걸어요. 유니폼 한 장 한 장이 진짜 등판(번호 그림)이에요.
   · 도트 한 칸 = 좌석 3개 × 1줄(위에서 보면 거의 정사각형). 글자판은 가로 6칸 × 세로 7칸. 한 칸 폭이 좌석 18개(통로 사이)와 딱 맞아요.
   · 멀리서 볼 땐 무늬 없는 흰 판으로, 가까이 가거나 확대하면(LDY.near m 안) 번호가 박힌 유니폼 그림으로 바꿔요 — 렌더링 아끼기.
   · 숫자·색·거리는 아래 LDY 한 곳만 고치면 돼요. 등판 글씨 색은 이 구역만 검정(LDY.ink).
   필요: stands.js·outfield.js(ZB.laundry), crowd.js(crowd.hidden·crowdSet·crowdFlush) — index.html에서 crowd.js 바로 뒤에 불러요.
   부르는 곳: ui/setup.js(syncBack → laundrySet), app/loop.js(laundryTick) */

/* ---------- 1. 설정 ---------- */
var LDY={
  ink:'#111111',                 // 등판 번호 글씨 색 (이 구역만 검정)
  cloth:'#f6f4ed',               // 유니폼 천 색 (흰색)
  stripe:'rgba(29,44,79,.12)',   // 흰 유니폼 세로줄 (그라운드 선수·으쓱이 흰 유니폼과 같음)
  w:.8,h:1.1,                     // 유니폼 한 장의 크기(m). 좌석 간격이 .8이라 옆 유니폼과 살짝 맞닿게
  lift:.9,                       // 좌석 바닥에서 유니폼 가운데까지 높이(m) — 등받이에 걸친 높이
  push:.03,                      // 좌석 등받이 앞면에서 필드 쪽으로 내미는 거리(m) — 등받이에 딱 걸치게
  tilt:-.12,                     // 등받이와 같은 기울기
  near:60,                       // 카메라가 이보다 가까우면 번호 그림, 멀면 흰 판 (m)
  hold:8,                        // 바꿀 때 덜 깜빡이게 하는 여유 (m)
  every:.25,                     // 거리 확인 간격(초)
  pxW:3,                         // 도트 한 칸이 차지하는 좌석 수(가로)
  rowOff:1                       // 글자판 맨 아래를 둘 줄 (0번 줄은 비워 두고 1~7번 줄에)
};

/* ---------- 2. 도트 글자 (가로 6 × 세로 7, #=유니폼 있음) ---------- */
var LDY_FONT={
  '0':['.####.','#....#','#....#','#....#','#....#','#....#','.####.'],
  '1':['..##..','.###..','..##..','..##..','..##..','..##..','.####.'],
  '2':['.####.','#....#','.....#','...##.','..#...','.#....','######'],
  '3':['.####.','#....#','.....#','..###.','.....#','#....#','.####.'],
  '4':['....#.','...##.','..#.#.','.#..#.','######','....#.','....#.'],
  '5':['######','#.....','#####.','.....#','.....#','#....#','.####.'],
  '6':['.####.','#.....','#.....','#####.','#....#','#....#','.####.'],
  '7':['######','.....#','....#.','...#..','..#...','..#...','..#...'],
  '8':['.####.','#....#','#....#','.####.','#....#','#....#','.####.'],
  '9':['.####.','#....#','#....#','.#####','.....#','.....#','.####.']
};

/* ---------- 3. 유니폼 그림·재질 ---------- */
var LDY_GEO=(function(){var g=new THREE.PlaneGeometry(LDY.w,LDY.h);g.rotateY(Math.PI);return g})();   /* 필드 쪽(-z)을 바라보게 */
/* 티셔츠 모양 + 세로줄 + 검은 큰 번호. txt는 번호 전체 (예: '14') — 어느 칸이든 한 장에 번호 전체가 써 있어요 */
function ldyJerseyTex(txt){
  return canvasTex(128,148,function(x,w,h){
    x.clearRect(0,0,w,h);
    x.fillStyle=LDY.cloth;x.beginPath();
    x.moveTo(40,4);x.quadraticCurveTo(w/2,26,88,4);          // 목선
    x.lineTo(122,34);x.lineTo(108,62);x.lineTo(94,52);        // 오른쪽 소매
    x.lineTo(94,h-4);x.lineTo(34,h-4);x.lineTo(34,52);        // 몸통
    x.lineTo(20,62);x.lineTo(6,34);x.closePath();x.fill();     // 왼쪽 소매
    x.save();x.clip();x.strokeStyle=LDY.stripe;x.lineWidth=2;for(var i=10;i<w;i+=11){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}x.restore();
    x.textAlign='center';x.textBaseline='middle';x.fillStyle=LDY.ink;
    var fs=txt.length>1?58:78;x.font='900 '+fs+'px "Arial Black","Helvetica Neue",Arial,sans-serif';
    x.fillText(txt,w/2,h*.56);
  });
}
var LDY_FAR=new THREE.MeshBasicMaterial({color:LDY.cloth,side:THREE.DoubleSide});   /* 멀리서: 무늬 없는 흰 판. 조명 영향 없이 늘 하얗게 보이게 Basic */
var LDY_NEAR=null;                                                                     /* 가까이서: 번호 그림(번호가 바뀔 때마다 새로 그림) */

/* ---------- 4. 칸마다 유니폼 판 만들기 ---------- */
var LDYB=[];   /* 칸마다 {blk, mesh, spots:[그 칸 관중 번호들]} */
(function(){
  var list=ZB.laundry||[];
  list.forEach(function(blk){
    var n=blk.R*blk.C;
    var im=new THREE.InstancedMesh(LDY_GEO,LDY_FAR,n);im.count=0;im.visible=false;im.frustumCulled=false;
    blk.g.add(im);
    var spots=[];crowdSpots.forEach(function(cs,i){if(cs.blk===blk)spots.push(i)});
    LDYB.push({blk:blk,mesh:im,spots:spots,showing:false});
  });
})();

/* 한 칸에 글자 하나(0~9)를 놓기: 불 켜진 도트의 좌석마다 유니폼 한 장 */
function ldyFill(b,ch){
  var blk=b.blk,rows=LDY_FONT[ch],C=blk.C,dummy=new THREE.Object3D(),k=0;
  if(!rows)return false;
  var seatAt={};blk.seats.forEach(function(s){seatAt[s.r+','+s.c]=s});
  for(var gy=0;gy<7;gy++)for(var gx=0;gx<6;gx++){
    if(rows[gy].charAt(gx)!=='#')continue;
    var r=LDY.rowOff+(6-gy);                                 // 글자 위쪽(gy 0)이 위 줄
    for(var q=0;q<LDY.pxW;q++){
      var c=C-1-(gx*LDY.pxW+q);                              // 홈에서 보면 왼쪽(gx 0)이 +x쪽 = 번호 큰 좌석
      var s=seatAt[r+','+c];if(!s)continue;
      dummy.position.set(s.x,s.y+LDY.lift,s.z+.21-LDY.push);dummy.rotation.set(LDY.tilt,0,0);dummy.updateMatrix();
      b.mesh.setMatrixAt(k++,dummy.matrix);
    }
  }
  b.mesh.count=k;b.mesh.instanceMatrix.needsUpdate=true;return true;
}
function ldyOff(b){
  if(b.mesh.visible||b.showing){b.mesh.visible=false;b.mesh.count=0;b.showing=false;
    b.spots.forEach(function(i){crowd.hidden[i]=0;crowdSet(i,0)})}
}
function ldyOn(b,ch){
  if(!ldyFill(b,ch)){ldyOff(b);return}
  b.mesh.visible=true;b.showing=true;
  b.spots.forEach(function(i){crowd.hidden[i]=1;crowdSet(i,0)});            /* 이 칸 관중은 비움 */
}

/* ---------- 5. 번호가 바뀔 때 ---------- */
var LDY_NUM='';
/* num: 등판 번호 글자(예: '', '7', '14'). 입장 준비에서 입력할 때마다 불려요 */
function laundrySet(num){
  num=String(num==null?'':num).replace(/\D/g,'').slice(0,2);
  LDY_NUM=num;
  var L=LDYB[0],R=LDYB[1];if(!L||!R)return;
  if(num===''){ldyOff(L);ldyOff(R)}
  else if(num.length===1){ldyOff(L);ldyOn(R,num)}                           /* 한 자리: 오른쪽 칸만 */
  else{ldyOn(L,num.charAt(0));ldyOn(R,num.charAt(1))}                        /* 두 자리: 양쪽 칸 */
  if(LDY_NEAR){if(LDY_NEAR.map)LDY_NEAR.map.dispose();LDY_NEAR.dispose();LDY_NEAR=null}
  if(num!==''){LDY_NEAR=new THREE.MeshBasicMaterial({map:ldyJerseyTex(num),alphaTest:.5,side:THREE.DoubleSide})}
  ldyLod(true);crowdFlush();
}

/* ---------- 6. 멀리/가까이 바꾸기 (렌더링 아끼기) ---------- */
var LDY_T=0,LDY_CLOSE=false;
function ldyLod(force){
  var d=1e9,c=new THREE.Vector3();
  LDYB.forEach(function(b){
    if(!b.showing)return;
    c.set(0,b.blk.base+b.blk.R*RH*.5,b.blk.R*RD*.5);b.blk.g.localToWorld(c);
    d=Math.min(d,camera.position.distanceTo(c));
  });
  var want=LDY_CLOSE?d<LDY.near+LDY.hold:d<LDY.near;      /* 켜진 칸 중 가장 가까운 칸 기준 */
  if(!force&&want===LDY_CLOSE)return;
  LDY_CLOSE=want;
  LDYB.forEach(function(b){b.mesh.material=(want&&LDY_NEAR)?LDY_NEAR:LDY_FAR});
}
/* 매 프레임 loop.js가 불러요. 거리 확인은 LDY.every초마다 한 번만 */
function laundryTick(dt){
  LDY_T+=dt;if(LDY_T<LDY.every)return;LDY_T=0;ldyLod(false);
}

laundrySet(ME.backNum);   /* 저장돼 있던 번호로 시작 */
