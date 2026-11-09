/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 밤 경기: 구역별 어둡기 (작은 패치 M, 2026-11-02) =================
   원칙: 밤에도 그라운드·외야 관중석은 밝게(조명이 닿는 곳). 내야·으쓱이존·하룰라라석(홈 뒤 포함)은 살짝 어둡게. 구장 바깥 땅·언덕·나무·흙길은 더 어둡게.
   - 숫자는 아래 ND 한 곳만 고치면 돼요. 1이면 그대로, 작을수록 어두워요 (zone .85 = 85% 밝기, out .6 = 60% 밝기).
   - 밤 정도 n(0 낮 ~ 1 밤)만큼 섞어서, 낮↔밤이 바뀌는 1.5초 동안 같이 서서히 바뀌어요(world/daynight.js의 dnApply가 ndApply(n)를 불러요).
   - 어두워지는 대상
     · 구역(ND.zone): stands.js에서 blk.dim인 블록 = 외야(cfg.out)가 아닌 모든 블록. 계단·뒷벽(terrace), 키 있는 블록의 의자, 장식 의자(crowd.js가 userData.dimZone으로 따로 묶어 둠), 관중 몸·머리·머리카락
     · 바깥(ND.out): userData.dimOut이 붙은 것 — 바깥 땅(field.js), 언덕·조명탑·벚나무(landmarks.js), 흙길·나무 띠(outskirts.js)
   - 여난부두 암전은 이 위에 더해져요(조명 자체를 80% 낮춤). 실내 포토존이 dnOverride(0)을 부르면 n=0이라 원래 밝기로 돌아와요.
   - 새 구역을 어둡게 하려면: 블록이면 cfg.out을 안 붙이면 되고, 그 밖의 덩어리는 mesh.userData.dimOut=true. 이 파일은 crowd.js·daynight.js 다음에 불려야 해요. */
var ND={zone:.70,out:.6,mats:[],crowd:null,last:-1};

(function(){
  var terrM=MVC.clone(),outM=MVC.clone();/* 정점 색 재질은 공용(MVC)이라, 어둡게 할 것만 복사본을 따로 써요 */
  function reg(m,kind){if(!m||ND.mats.some(function(o){return o.m===m}))return;ND.mats.push({m:m,base:m.color.clone(),kind:kind})}
  /* 1. 구역 블록: 계단·뒷벽, 키 있는 블록의 의자 */
  blocks.forEach(function(b){
    if(!b.dim)return;
    b.terrace.material=terrM;reg(terrM,'zone');
    if(b.seatMesh)reg(b.seatMesh.material,'zone');
  });
  /* 2. 장식 의자 묶음(crowd.js) + 바깥(userData.dimOut) */
  scene.children.forEach(function(o){
    if(o.userData&&o.userData.dimZone)reg(o.material,'zone');
    if(o.userData&&o.userData.dimOut){
      if(o.material===MVC)o.material=outM;
      reg(o.material,'out');
    }
  });
  /* 3. 관중: 몸은 원래 색을 기억해 두고, 머리·머리카락은 칸마다 곱하는 색을 새로 둬요 */
  var n=crowdSpots.length,one=new THREE.Color(1,1,1),i;
  for(i=0;i<n;i++){crowd.head.setColorAt(i,one);crowd.hair.setColorAt(i,one)}
  ND.crowd={base:crowd.body.instanceColor.array.slice(),dim:crowdSpots.map(function(c){return !!(c.blk&&c.blk.dim)})};
})();

function ndK(n,k){return 1+(k-1)*n}
function ndApply(n){
  if(n===ND.last)return;ND.last=n;
  var kz=ndK(n,ND.zone),ko=ndK(n,ND.out);
  ND.mats.forEach(function(o){o.m.color.copy(o.base).multiplyScalar(o.kind==='out'?ko:kz)});
  var C=ND.crowd;if(!C)return;
  var bc=crowd.body.instanceColor.array,hc=crowd.head.instanceColor.array,rc=crowd.hair.instanceColor.array;
  for(var i=0;i<C.dim.length;i++){
    var k=C.dim[i]?kz:1,j=i*3;
    bc[j]=C.base[j]*k;bc[j+1]=C.base[j+1]*k;bc[j+2]=C.base[j+2]*k;
    hc[j]=hc[j+1]=hc[j+2]=rc[j]=rc[j+1]=rc[j+2]=k;
  }
  crowd.body.instanceColor.needsUpdate=true;crowd.head.instanceColor.needsUpdate=true;crowd.hair.instanceColor.needsUpdate=true;
}
ndApply(DN.n);
