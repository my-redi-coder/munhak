/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 한 줄로 이어진 띠 전광판 (작은 패치 AH, 2026-11-09) =================
   실제 구장처럼 띠 전광판을 2층 앞면이 아니라 그 한 칸 아래, 1층 맨 뒷줄 바로 위 뒷벽(stands.js의 blk.ribbon)에 붙이고,
   3루 쪽 끝 → 홈 뒤 → 1루 쪽 끝까지 **한 줄**로 이어서 글씨가 끊김 없이 구장을 따라 흘러요.
   - 블록을 홈 기준 각도 순서(3루 끝 → 1루 끝)로 줄 세우고, 뒷벽 가운데끼리의 실제 거리를 이어 붙여 칸마다 그림 좌표(UV)를 이어 줘요.
     (그림 한 장 = RL.per m. 흐르기는 ribbon.js가 ledTex.offset으로 한 번에 돌려요 → 모든 칸이 같이 흘러요)
   - 이전엔 2층 앞면 칸마다 같은 그림을 따로 붙였어요(칸마다 문구가 다시 시작). 지금은 칸이 달라도 이어져요.
   - 가사(ribbon.js)는 그림 한 장을 줄 단위로 채워 그리니 그대로 동작해요. 이 파일은 curvestand.js 다음에 불려야 해요(홈 뒤 아래층 블록이 있어야 해서). */
var RL={per:24,h:.9,list:[]};
(function(){
  var zc=1.27,bl=blocks.filter(function(b){return b.ribbon}),v=new THREE.Vector3();
  bl.forEach(function(b){b.g.updateMatrixWorld(true);v.set(0,0,b.ribbon.z);b.g.localToWorld(v);b.rp={x:v.x,z:v.z,a:Math.atan2(v.x,v.z-zc)}});
  bl.sort(function(a,b){return a.rp.a-b.rp.a});
  var T=[],t=0;
  bl.forEach(function(b,i){if(i)t+=Math.hypot(b.rp.x-bl[i-1].rp.x,b.rp.z-bl[i-1].rp.z);else t=b.ribbon.w/2;T.push(t)});
  var Tmax=t+bl[bl.length-1].ribbon.w/2;
  bl.forEach(function(b,i){
    var R=b.ribbon,g=new THREE.PlaneGeometry(R.w,RL.h),uv=g.attributes.uv,uc=(Tmax-T[i])/RL.per;
    /* 판은 필드 쪽(-z)을 보게 돌려요. 보는 사람 오른쪽이 블록 -x라 길이 방향(t)은 판 가로와 반대 → 그림 좌표는 판 가로(px)를 따라 늘려요 */
    for(var k=0;k<uv.count;k++){var px=(uv.getX(k)-.5)*R.w;uv.setX(k,uc+px/RL.per)}
    var m=new THREE.Mesh(g,ledMat);m.rotation.y=Math.PI;m.position.set(0,R.y,R.z);b.g.add(m);RL.list.push(m);
  });
  RL.total=Tmax;
})();
