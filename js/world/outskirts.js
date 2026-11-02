/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 조감도 포인트 (작은 패치 J, 2026-11-02) =================
   위에서 내려다봐도 '문학'처럼 보이게 하는 장식 5개. 전부 보는 풍경이고 누를 수 없어요(game/input.js의 탭 목록에 안 들어감).
   걷는 구역(stands.js 블록·걷기 범위), 빅보드 화면, 띠 전광판, 이벤트 카메라는 건드리지 않아요.
   다른 파일은 고치지 않고 index.html에 이 파일 한 줄만 더해요(bbq.js 다음).
   1. 빨간 워닝트랙 띠: 파울라인 바깥 ~ 관중석 앞, 홈 뒤를 감싸는 붉은 흙. 그라운드 위에 얇게 얹음(field.js 그대로)
   2. 바깥 흙길 링 + 나무 띠: 구장 전체를 두르는 타원 흙길과 그 바깥 나무(홈 뒤는 비워 둠)
   3. 홈런커플존 진분홍 벽: 외야 담장 안쪽 면에 진분홍 띠(가운데 나무숲 자리는 비움)
   4. 빅보드 아래 검은 백스크린 벽 + 'V6를 향해'
   5. 백스크린 앞 낮은 나무숲. bigboard.js의 둥근 나무들은 여기서 숨김(bigboard.js 그대로) */
var OSK={
  red:{color:0xc4624c,s0:3.4,s1:93,o0:2.5,o1:12,homeR:4.2},           // 띠: 라인에서 o0~o1m 바깥, 홈 흙 원 반지름 homeR
  ring:{cx:0,cz:-55,rx:132,rz:118,w:6,color:0xcdb08a,behindGap:.42}, // 흙길 타원, 홈 뒤(behindGap 라디안 양쪽)엔 나무 안 심음
  trees:{n:70,from:7,to:20},                                         // 흙길 바깥 7~20m
  pink:{color:0xd6336c,a0:7,a1:40,y0:.9,y1:2.95},                     // 담장 각도(도) ±a0~±a1, 높이 y0~y1
  wall:{w:28,h:11,z:-123.55,text:'V6를 향해'},                         // 빅보드 건물 앞면(z −124) 바로 앞, 이름 띠(높이 11~13.4) 아래까지
  bush:{x:13,z0:-121.2,z1:-123.2,n:18}                                 // 담장(z −120)과 벽 사이
};
(function(){
  var S=.7071;
  function p1B(s,o,side){return [side*(s*S+o*S),-s*S+o*S]}           // stands.js의 pos1B와 같은 좌표
  function flatMat(c){return new THREE.MeshLambertMaterial({color:c,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}

  /* ---------- 1. 빨간 워닝트랙 띠 ---------- */
  var R=OSK.red,sh=new THREE.Shape(),pts=[];
  // 바깥(관중석 쪽): 1루 끝 → 홈 뒤 꼭짓점(관중석 밑) → 3루 끝
  pts.push(p1B(R.s1,R.o1,1));pts.push([0,R.o1/S]);pts.push(p1B(R.s1,R.o1,-1));
  // 안쪽(라인 쪽): 3루 끝 → 홈 흙 원 둘레(홈 뒤로) → 1루 끝
  pts.push(p1B(R.s1,R.o0,-1));
  var sIn=Math.sqrt(R.homeR*R.homeR-R.o0*R.o0),a3=Math.atan2(p1B(sIn,R.o0,-1)[1],p1B(sIn,R.o0,-1)[0]),a1=Math.atan2(p1B(sIn,R.o0,1)[1],p1B(sIn,R.o0,1)[0]);
  if(a3<a1)a3+=TAU;                                                    // 홈 뒤(+z)로 돌아가게
  for(var i=0;i<=24;i++){var a=a3+(a1-a3)*i/24;pts.push([Math.cos(a)*R.homeR,Math.sin(a)*R.homeR])}
  pts.push(p1B(R.s1,R.o0,1));
  pts.forEach(function(p,k){k?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1])});
  var red=new THREE.Mesh(new THREE.ShapeGeometry(sh),flatMat(R.color));red.rotation.x=-Math.PI/2;red.position.y=.03;scene.add(red);
  // 띠에 가려진 대기 타자 원(field.js와 같은 자리·색)을 다시 그려요
  [[9,4],[-9,4]].forEach(function(p){var c=new THREE.Mesh(new THREE.CircleGeometry(1.6,24),flatMat(0xc9905e));c.rotation.x=-Math.PI/2;c.position.set(p[0],.05,p[1]);scene.add(c)});

  /* ---------- 2. 바깥 흙길 링 + 나무 띠 ---------- */
  var G=OSK.ring,P=[],N=[],I=[],seg=120;
  for(i=0;i<=seg;i++){var t=i/seg*TAU,cx=Math.sin(t),cz=-Math.cos(t);
    P.push(G.cx+cx*(G.rx-G.w/2),0,G.cz+cz*(G.rz-G.w/2), G.cx+cx*(G.rx+G.w/2),0,G.cz+cz*(G.rz+G.w/2));N.push(0,1,0,0,1,0);
    if(i<seg){var b=i*2;I.push(b,b+2,b+1,b+1,b+2,b+3)}}
  var rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));rg.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));rg.setIndex(I);
  var ring=new THREE.Mesh(rg,flatMat(G.color));ring.material.side=THREE.DoubleSide;ring.position.y=.05;ring.userData.dimOut=true;scene.add(ring);
  var T=OSK.trees,tp=[],placed=0,tries=0;
  while(placed<T.n&&tries<600){tries++;
    var t2=rnd(0,TAU);if(Math.abs(Math.atan2(Math.sin(t2),-Math.cos(t2)))<G.behindGap)continue; // 홈 뒤(+z 쪽)는 비움
    var d=rnd(T.from,T.to),tx=G.cx+Math.sin(t2)*(G.rx+G.w/2+d),tz=G.cz-Math.cos(t2)*(G.rz+G.w/2+d);
    if(typeof hillBlocked==='function'&&hillBlocked(tx,tz,4))continue;                          // 포토존 세트·카메라 길
    if(typeof TOWERS!=='undefined'&&TOWERS.some(function(w){return Math.hypot(w[0]-tx,w[1]-tz)<6}))continue; // 조명탑 옆
    var sc=rnd(.8,1.25),pink=Math.random()<.25;placed++;
    tp.push({g:Cyl(.35,.5,3.2*sc,6),c:0x6b5444,p:[tx,1.6*sc,tz]});
    tp.push({g:new THREE.SphereGeometry(2.4*sc,9,7),c:pink?pick([0xf2b8c6,0xf6c9d4]):pick([0x5f9a4a,0x6faa55,0x4f8a3e,0x76b05c]),p:[tx,3.2*sc+1.6*sc,tz],s:[1,1.1,1]})}
  var trees=new THREE.Mesh(mergeParts(tp),MVC);trees.userData.dimOut=true;scene.add(trees);

  /* ---------- 3. 홈런커플존 진분홍 벽 (담장 안쪽 면) ---------- */
  var K=OSK.pink,PP=[],PN=[];
  [[-K.a1,-K.a0],[K.a0,K.a1]].forEach(function(rng){
    for(var a=rng[0];a<rng[1];a+=1.5){var q0=a*Math.PI/180,q1=Math.min(a+1.5,rng[1])*Math.PI/180,r0=fenceR(q0)-.1,r1=fenceR(q1)-.1;
      var A=[Math.sin(q0)*r0,-Math.cos(q0)*r0],B=[Math.sin(q1)*r1,-Math.cos(q1)*r1],nx=-(Math.sin(q0)+Math.sin(q1))/2,nz=(Math.cos(q0)+Math.cos(q1))/2;
      PP.push(A[0],K.y0,A[1],B[0],K.y0,B[1],B[0],K.y1,B[1], A[0],K.y0,A[1],B[0],K.y1,B[1],A[0],K.y1,A[1]);
      for(var k=0;k<6;k++)PN.push(nx,0,nz)}});
  var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(PP,3));pg.setAttribute('normal',new THREE.Float32BufferAttribute(PN,3));
  scene.add(new THREE.Mesh(pg,new THREE.MeshLambertMaterial({color:K.color,side:THREE.DoubleSide})));

  /* ---------- 4. 검은 백스크린 벽 + 'V6를 향해' ---------- */
  var W=OSK.wall,F='"Gowun Dodum","Apple SD Gothic Neo",sans-serif';
  function drawWall(x,w,h){x.fillStyle='#1e2321';x.fillRect(0,0,w,h);
    x.textAlign='center';x.textBaseline='middle';x.fillStyle='#f3efe2';x.font='bold 150px '+F;x.fillText(W.text,w/2,h*.36)}
  var wallTex=canvasTex(1024,Math.round(1024*W.h/W.w),drawWall);
  var wall=new THREE.Mesh(new THREE.PlaneGeometry(W.w,W.h),new THREE.MeshLambertMaterial({map:wallTex}));wall.position.set(0,W.h/2,W.z);scene.add(wall);
  // 글꼴이 늦게 오면 한 번 다시 그려요(처음엔 기본 글꼴로 그려질 수 있어서)
  if(document.fonts&&document.fonts.load)document.fonts.load('150px "Gowun Dodum"',W.text).then(function(){var c=wallTex.image;drawWall(c.getContext('2d'),c.width,c.height);wallTex.needsUpdate=true}).catch(function(){});

  /* ---------- 5. 낮은 나무숲 + 예전 둥근 나무 숨기기 ---------- */
  var U=OSK.bush,bp=[];
  for(i=0;i<U.n;i++){var bx=-U.x+2*U.x*i/(U.n-1)+rnd(-.6,.6),bz=rnd(U.z1,U.z0),r=rnd(1.6,2.3);
    bp.push({g:new THREE.SphereGeometry(r,9,6),c:pick([0x4f8a3e,0x5f9a4a,0x467f38,0x6faa55]),p:[bx,rnd(1.6,2.4),bz],s:[1.25,.85,.8]})}
  scene.add(new THREE.Mesh(mergeParts(bp),MVC));
  // bigboard.js가 가운데에 심은 둥근 나무 묶음(한 덩어리): 자리·크기로 찾아서 숨겨요. 못 찾으면 그대로 둬요
  var box=new THREE.Box3();
  scene.children.forEach(function(o){if(!o.isMesh||o.material!==MVC||o===red)return;box.setFromObject(o);
    var c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());
    if(Math.abs(c.x)<6&&c.z<-110&&c.z>-130&&sz.x<30&&sz.z<20&&box.max.y<10&&box.min.y>-.5&&box.min.y<.5&&sz.y>6)o.visible=false});
})();
