/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 한 줄로 이어진 띠 전광판 (작은 패치 AH·AI, 2026-11-09) =================
   실제 구장처럼 띠 전광판을 2층 앞면이 아니라 그 한 칸 아래, 1층 맨 뒷줄 바로 위 뒷벽(stands.js의 blk.ribbon)에 붙이고,
   3루 쪽 끝 → 홈 뒤 → 1루 쪽 끝까지 **한 줄**로 이어서 글씨가 끊김 없이 구장을 따라 흘러요.
   - 블록을 홈 기준 각도 순서(3루 끝 → 1루 끝)로 줄 세우고, 길이를 차례로 이어 붙여 칸마다 그림 좌표(UV)를 이어 줘요.
     (그림 한 장 = RL.per m. 흐르기는 ribbon.js가 ledTex.offset으로 한 번에 돌려요 → 모든 칸이 같이 흘러요)
   - (작은 패치 AI) 홈 뒤 곡면 아래층은 블록 사이가 벌어져 띄엄띄엄 보였어요 → 블록 끝에서 다음 블록 시작까지 **이음 벽 + 띠**를 같이 세워서 이어요.
   - (작은 패치 AI) 띠는 **지붕이 끝나는 자리까지만**(roofs.js의 ROOF.farS, 대각선 위치 s). 그 너머 블록은 띠 없음, 걸친 블록은 잘라 붙여요.
   - 이 파일은 roofs.js 다음에 불려야 해요(ROOF.farS를 읽어요). 이음 벽은 밤 경기 어둡기(nightdim.js)에 같이 들어가요. */
var RL={per:24,h:.9,list:[],total:0};
/* 번쩍임 막기(작은 패치 AJ): 이음 벽 띠가 벽 앞면에서 5mm밖에 안 떨어져 있어서, 멀리서(경기장 구경) 벽과 깊이가 겹쳐 줄무늬로 깜빡였어요.
   판을 벽에서 4cm 띄우고, 재질에 깊이 우선(polygonOffset)을 줘서 벽보다 늘 앞에 그려요 */
ledMat.polygonOffset=true;ledMat.polygonOffsetFactor=-4;ledMat.polygonOffsetUnits=-4;ledMat.needsUpdate=true;
(function(){
  var S=.7071,zc=1.27,farS=(typeof ROOF!=='undefined'&&ROOF.farS)||59.4,bl=blocks.filter(function(b){return b.ribbon}),wallP=[];
  var X=new THREE.Vector3(1,0,0),NZ=new THREE.Vector3(0,0,-1),v=new THREE.Vector3();
  var items=[];
  bl.forEach(function(b){
    var R=b.ribbon,th=b.cfg.theta;b.g.updateMatrixWorld(true);
    v.set(0,0,R.z);b.g.localToWorld(v);var c=v.clone();
    var dx=X.clone().transformDirection(b.g.matrixWorld),nn=NZ.clone().transformDirection(b.g.matrixWorld);
    var x0=-b.W/2,x1=b.W/2,diag=Math.abs(Math.abs(th)-Math.PI/4)<1e-3;
    if(diag){var sc=th>0?(c.x-c.z)*S:(-c.x-c.z)*S;      /* 대각선 위치 s (홈에서 멀어지는 거리) */
      if(th>0)x1=Math.min(x1,farS-sc);else x0=Math.max(x0,sc-farS)}   /* 오른쪽 블록은 local +x, 왼쪽은 -x가 멀어지는 쪽 */
    if(x1-x0<.05)return;
    items.push({b:b,R:R,c:c,dx:dx,n:nn,x0:x0,x1:x1,a:Math.atan2(c.x,c.z-zc)});
  });
  items.sort(function(p,q){return p.a-q.a});
  /* 앞에서부터 길이를 이어 붙여요: 블록 → (벌어진 틈이면 이음 벽) → 블록 … */
  var t=0,prev=null,conns=[];
  items.forEach(function(it){
    it.P0=it.c.clone().addScaledVector(it.dx,it.x0);it.P1=it.c.clone().addScaledVector(it.dx,it.x1);
    if(prev){var d=it.P0.clone().sub(prev.P1),L=Math.hypot(d.x,d.z);
      if(L>.03&&d.dot(prev.dx)>0){conns.push({A:prev.P1.clone(),B:it.P0.clone(),t:t,L:L,R:it.R});t+=L}}
    it.t0=t;t+=it.x1-it.x0;prev=it;
  });
  var Tmax=t;RL.total=Tmax;
  function plane(len,pos,nrm,y,tMid){
    var g=new THREE.PlaneGeometry(len,RL.h),uv=g.attributes.uv,uc=(Tmax-tMid)/RL.per;
    for(var k=0;k<uv.count;k++){var px=(uv.getX(k)-.5)*len;uv.setX(k,uc+px/RL.per)}   /* 보는 사람 오른쪽(판 +x)이 길이 t의 반대 방향 */
    var m=new THREE.Mesh(g,ledMat);m.rotation.y=Math.atan2(nrm.x,nrm.z);m.position.set(pos.x,y,pos.z);scene.add(m);RL.list.push(m);
  }
  items.forEach(function(it){var len=it.x1-it.x0,mid=(it.x0+it.x1)/2;
    plane(len,it.c.clone().addScaledVector(it.dx,mid),it.n,it.R.y,it.t0+len/2)});
  conns.forEach(function(cn){
    var dd=cn.B.clone().sub(cn.A).divideScalar(cn.L),M=cn.A.clone().add(cn.B).multiplyScalar(.5),nrm=new THREE.Vector3(dd.z,0,-dd.x);
    if(nrm.x*(0-M.x)+nrm.z*(zc-M.z)<0)return;                          /* 필드(홈) 쪽을 보지 않으면 순서가 어긋난 틈이라 건너뛰어요 */
    var R=cn.R,wh=R.y1-R.y0;
    if(cn.L>.35)wallP.push({g:Box(cn.L+.05,wh,.2),c:0xd2cbbd,p:[M.x-nrm.x*.1,R.y0+wh/2,M.z-nrm.z*.1],r:[0,Math.atan2(-dd.z,dd.x),0]});
    plane(cn.L,M.clone().addScaledVector(nrm,.04),nrm,R.y,cn.t+cn.L/2);
  });
  if(wallP.length){var wm=new THREE.Mesh(mergeParts(wallP),MVC.clone());wm.userData.dimZone=true;scene.add(wm)}
})();
