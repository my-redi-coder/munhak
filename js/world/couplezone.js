/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 홈런커플존 (작은 패치 AD, 2026-11-09) =================
   실제 문학의 '홈런커플존': 외야 담장 바로 뒤, 그라운드를 내려다보는 한 줄짜리 데크.
   담장에 붙은 2인용 나무 테이블 + 그 뒤 등받이 의자, 뒤쪽 외야석과는 나무 울타리로 나뉘어요. 보는 풍경이고 걷기 X.
   · 높이: 데크 바닥 = 외야석 바닥(config.js의 FLOOR.out) - CPL.drop. 테이블 윗면이 담장(3.1) 바로 아래라 앉으면 담장 너머로 그라운드가 보여요.
   · 자리: 담장(d=0)부터 외야석 앞면(d=OF.LIP=2.6) 사이. 담장 곡선을 따라 1루(+)·3루(-) 대칭, 각도 a0~a1 = 담장 분홍 벽(outskirts.js의 OSK.pink)과 같은 범위.
   · 구성(데크 위, 담장에서 바깥으로): 테이블(d≈.55) → 등받이 의자(d≈1.45) → 나무 울타리(d≈2.35).
   · 장식 관객: 의자 세트의 CPL.fanRate만큼 1~2명(관중 모형과 같은 몸·머리 모양, 따로 InstancedMesh).
   · 가볍게: 테이블 세트는 InstancedMesh 한 개, 데크·울타리는 곡선을 따라 판 하나씩.
   · 숫자는 CPL 한 곳만. outfield.js(OF·ofFence·ofLip)와 outskirts.js(OSK) 다음에 불려야 해요. */
var CPL={drop:1.0,d0:.12,d1:2.55,fenceD:2.35,fenceH:1.05,pitch:2.1,fanRate:.4,
  deck:'#7a6553',wood:0x6a4f3d,dark:0x2a1d17,bench:0x7a5d47,slat:'#b08a62',skirt:0x4a4038,
  fanColors:[0xc8102e,0xc8102e,0x2f6e50,0xf4f2ec]};
(function(){
  if(typeof OF==='undefined')return;
  var D=Math.PI/180,Y=FLOOR.out-CPL.drop,a0=(typeof OSK!=='undefined'?OSK.pink.a0:7),a1=(typeof OSK!=='undefined'?OSK.pink.a1:40);
  CPL.y=Y;CPL.a0=a0;CPL.a1=a1;
  function nrm(p){var f=ofFence(p),l=ofLip(p);return [(l[0]-f[0])/OF.LIP,(l[1]-f[1])/OF.LIP]}          // 담장에서 바깥쪽 단위 방향
  function curve(side){var a=[],L=0,prev=null;                                                    // 곡선 위 점(1/4도마다) + 누적 길이
    for(var deg=a0;deg<=a1+1e-6;deg+=.25){var p=side*deg*D,f=ofFence(p),n=nrm(p),q={f:f,n:n,th:Math.atan2(n[0],n[1])};
      if(prev)L+=Math.hypot(f[0]-prev.f[0],f[1]-prev.f[1]);q.L=L;a.push(q);prev=q}
    return a}
  /* 곡선을 따라 가는 띠 하나(d=담장에서 거리, y=높이): 가로 판(flat) 또는 세로 판 */
  function strip(cv,da,db,ya,yb,uvLen){var P=[],UV=[],I=[];
    cv.forEach(function(q,i){var A=[q.f[0]+q.n[0]*da,q.f[1]+q.n[1]*da],B=[q.f[0]+q.n[0]*db,q.f[1]+q.n[1]*db];
      P.push(A[0],ya,A[1],B[0],yb,B[1]);UV.push(q.L/uvLen,0,q.L/uvLen,1);
      if(i){var k=(i-1)*2;I.push(k,k+1,k+2,k+1,k+3,k+2)}});
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeVertexNormals();return g}
  var deckTex=canvasTex(128,128,function(x,w,h){x.fillStyle=CPL.deck;x.fillRect(0,0,w,h);       // 바닥 판자 무늬
    for(var i=0;i<8;i++){x.fillStyle='rgba(0,0,0,.24)';x.fillRect(i*16,0,1.5,h);x.fillStyle='rgba(255,255,255,'+(i%2?.04:.08)+')';x.fillRect(i*16+2,0,13,h)}});
  deckTex.wrapS=deckTex.wrapT=THREE.RepeatWrapping;
  var slatTex=canvasTex(64,64,function(x,w,h){x.fillStyle='#5d4632';x.fillRect(0,0,w,h);           // 울타리 세로 널빤지
    for(var i=0;i<4;i++){x.fillStyle=CPL.slat;x.fillRect(i*16+1,0,12,h);x.fillStyle='rgba(0,0,0,.12)';x.fillRect(i*16+9,0,2,h)}
    x.fillStyle='#4a3626';x.fillRect(0,6,w,5);x.fillRect(0,h-12,w,5)});
  slatTex.wrapS=slatTex.wrapT=THREE.RepeatWrapping;
  var deckMat=new THREE.MeshLambertMaterial({map:deckTex,side:THREE.DoubleSide}),
      skirtMat=new THREE.MeshLambertMaterial({color:CPL.skirt,side:THREE.DoubleSide}),
      slatMat=new THREE.MeshLambertMaterial({map:slatTex,side:THREE.DoubleSide});
  /* 테이블 세트 한 개(국소 좌표: x=담장을 따라, z=담장에서 바깥, y=데크 바닥 위) */
  var P=[];
  P.push({g:Box(1.55,.06,.55),c:CPL.wood,p:[0,.78,.55]});                                         // 테이블 상판
  [[-.7,.3],[.7,.3],[-.7,.8],[.7,.8]].forEach(function(l){P.push({g:Box(.06,.75,.06),c:CPL.dark,p:[l[0],.375,l[1]]})});
  P.push({g:Box(.22,.012,.14),c:0xf4f2ec,p:[.45,.816,.72]});P.push({g:Box(.08,.014,.14),c:0xc8102e,p:[.38,.818,.72]});   // 좌석표
  P.push({g:Box(1.5,.07,.42),c:CPL.bench,p:[0,.45,1.45]});                                          // 의자 앉는 곳
  P.push({g:Box(1.5,.5,.05),c:CPL.bench,p:[0,.78,1.68],r:[-.1,0,0]});                               // 등받이
  [-.65,.65].forEach(function(x){P.push({g:Box(.07,.45,.4),c:CPL.dark,p:[x,.225,1.45]})});
  var unitGeo=mergeParts(P);
  var units=[],fans=[],m=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),v=new THREE.Vector3(),s1=new THREE.Vector3(1,1,1);
  [1,-1].forEach(function(side){
    var cv=curve(side),Ltot=cv[cv.length-1].L;
    scene.add(new THREE.Mesh(strip(cv,CPL.d0,CPL.d1,Y,Y,6),deckMat));                                 // 데크 바닥
    var sk=strip(cv,CPL.d0,CPL.d0,0,Y,6);scene.add(new THREE.Mesh(sk,skirtMat));                      // 데크 앞 옆판(담장 뒤라 잘 안 보여요)
    [0,cv.length-1].forEach(function(i){var c=cv[i],g=new THREE.Mesh(Box(.12,Y,CPL.d1-CPL.d0),skirtMat);   // 양 끝 막음판
      g.position.set(c.f[0]+c.n[0]*(CPL.d0+CPL.d1)/2,Y/2,c.f[1]+c.n[1]*(CPL.d0+CPL.d1)/2);g.rotation.y=c.th;scene.add(g)});
    var fz=strip(cv,CPL.fenceD,CPL.fenceD,Y,Y+CPL.fenceH,1.0);scene.add(new THREE.Mesh(fz,slatMat));  // 나무 울타리
    /* 테이블 세트: 곡선 길이를 pitch 간격으로 나눠 가운데 맞춤 */
    var n=Math.floor((Ltot-.6)/CPL.pitch),start=(Ltot-(n-1)*CPL.pitch)/2,j=0;
    for(var k=0;k<n;k++){var want=start+k*CPL.pitch;while(j<cv.length-2&&cv[j+1].L<want)j++;
      var c=cv[j],t=(want-c.L)/Math.max(1e-6,cv[j+1].L-c.L),c2=cv[j+1],
          fx=c.f[0]+(c2.f[0]-c.f[0])*t,fzz=c.f[1]+(c2.f[1]-c.f[1])*t,th=c.th+(c2.th-c.th)*t;
      units.push({x:fx,z:fzz,th:th});
      if(Math.random()<CPL.fanRate){var two=Math.random()<.6;(two?[-.35,.35]:[pick([-.35,.35])]).forEach(function(ox){fans.push({x:fx,z:fzz,th:th,ox:ox})})}}
  });
  var im=new THREE.InstancedMesh(unitGeo,MVC,units.length);
  units.forEach(function(u,i){q.setFromAxisAngle(up,u.th);m.compose(v.set(u.x,Y,u.z),q,s1);im.setMatrixAt(i,m)});
  im.instanceMatrix.needsUpdate=true;scene.add(im);
  /* 장식 관객: 의자에 앉아 그라운드(담장 쪽)를 봐요 */
  if(fans.length){
    var body=new THREE.InstancedMesh(Cyl(.21,.25,.5,8),new THREE.MeshLambertMaterial({color:0xffffff}),fans.length),
        head=new THREE.InstancedMesh(new THREE.SphereGeometry(.27,10,8),new THREE.MeshLambertMaterial({color:SKIN}),fans.length),
        hair=new THREE.InstancedMesh(new THREE.SphereGeometry(.29,10,6,0,TAU,0,Math.PI*.52),new THREE.MeshLambertMaterial({color:HAIR}),fans.length),col=new THREE.Color();
    fans.forEach(function(f,i){
      var cs=Math.cos(f.th),sn=Math.sin(f.th),lz=1.42,px=f.x+f.ox*cs+lz*sn,pz=f.z-f.ox*sn+lz*cs;     // 국소 (ox, lz) → 세계 좌표
      q.setFromAxisAngle(up,f.th+Math.PI);
      m.compose(v.set(px,Y+.75,pz),q,s1);body.setMatrixAt(i,m);
      m.compose(v.set(px,Y+1.23,pz),q,s1);head.setMatrixAt(i,m);
      m.compose(v.set(px,Y+1.27,pz),q,s1);hair.setMatrixAt(i,m);
      body.setColorAt(i,col.setHex(pick(CPL.fanColors)))});
    [body,head,hair].forEach(function(o){o.instanceMatrix.needsUpdate=true;scene.add(o)});
    if(body.instanceColor)body.instanceColor.needsUpdate=true;
  }
  CPL.units=units.length;CPL.fans=fans.length;
})();
