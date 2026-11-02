/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 하룰라라석 말발굽 지붕 (작은 패치 L) =================
   위층(하룰라라 높이) 스탠드 전체를 한 장으로 이어서 덮는 흰 지붕이에요. 3루 쪽 끝 → 홈 뒤 부채꼴 → 1루 쪽 끝까지 쭉 이어지고,
   부채살 줄무늬(리브)와 두꺼운 앞 테두리로 문학 지붕 느낌을 내요. 눌러지거나 걷는 곳이 아니라서 걷기·전광판·이벤트에 영향이 없어요.
   · 블록마다 있던 작은 지붕 판은 이 지붕 바로 아래에 겹쳐 숨어요(stands.js는 그대로).
   · 카메라가 지붕 높이 안쪽으로 들어오면 자동으로 반투명해져서(걸을 때·앉을 때) 시야를 가리지 않아요. 위에서 내려다볼 땐 그대로 보여요.
   · curvestand.js 다음에 불려야 해요(호 모양 숫자를 그대로 써요). index.html에서 curvestand.js 바로 아래에 둬요. */
var ROOF={
  z0:1.6,        // 지붕 앞끝: 앞줄에서 본 좌석 줄 위치(1.6 = 둘째 줄쯤, 앞 한두 줄은 하늘에서 보여요). 작게 하면 더 앞까지 덮어요
  th:.3,         // 지붕 두께
  farS:59.4,     // 대각선 쪽 지붕이 끝나는 위치(맨 끝 블록 끝 + 여유)
  rib:2.2,       // 부채살 한 칸 너비(m)
  fade:.2        // 카메라가 지붕 안으로 들어올 때의 투명도
};
(function(){
  if(typeof CVS==='undefined'||!CVS.levels||!CVS.levels[1])return;
  var S=.7071,rad=Math.PI/180,L=CVS.levels[1],
      xd=(6+L.o-1.9-6.9)*S,r=xd/S,zc=(L.o-1.9-r)/S,seg=90/L.n,off=L.o-1.9,
      lastTop=L.base+(L.rows-1)*RH,z1=L.rows*RD+1.6,A=ROOF.z0+1.9,B=z1+1.9;
  function yTop(z){return lastTop+5.2+.08*(z-6.6)+.165}          // 예전 작은 지붕(기울기 .08) 윗면보다 .04 위
  function diag(s,side){return [side*(s+off)*S,(off-s)*S]}        // 대각선 블록 앞줄 위의 점 (pos1B(s,off,side)와 같음)

  /* 앞줄(블록 앞쪽 가장자리)이 지나는 꼭짓점들: 3루 끝 → 3루 대각선 → 호 → 1루 대각선 → 1루 끝 */
  var V=[diag(ROOF.farS,-1)],U=[[-S,S]];
  for(var k=0;k<=L.n;k++){var a=(-45+seg*k)*rad;V.push([r*Math.sin(a),zc+r*Math.cos(a)])}
  for(k=0;k<L.n;k++){var f=(-45+seg*(k+.5))*rad;U.push([Math.sin(f),Math.cos(f)])}
  V.push(diag(ROOF.farS,1));U.push([S,S]);
  var n=V.length,Mi=[];                                            // 꼭짓점마다 '모서리 이음' 방향(양쪽 블록이 뒤로 뻗는 방향의 평균)
  for(k=0;k<n;k++){var u0=U[Math.max(k-1,0)],u1=U[Math.min(k,U.length-1)],q=1+u0[0]*u1[0]+u0[1]*u1[1];Mi.push([(u0[0]+u1[0])/q,(u0[1]+u1[1])/q])}
  function P(i,d,y){return [V[i][0]+d*Mi[i][0],y,V[i][1]+d*Mi[i][1]]}

  /* 윗면(줄무늬 그림) */
  var pos=[],uv=[],idx=[],len=0,poly=[],y0=yTop(ROOF.z0),y1=yTop(z1);
  for(k=0;k<n;k++){
    if(k)len+=Math.hypot(V[k][0]-V[k-1][0],V[k][1]-V[k-1][1]);
    pos.push.apply(pos,P(k,A,y0));uv.push(len/ROOF.rib,0);
    pos.push.apply(pos,P(k,B,y1));uv.push(len/ROOF.rib,1);
    if(k<n-1)idx.push(2*k,2*k+1,2*k+3,2*k,2*k+3,2*k+2);
  }
  var tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));tg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));tg.setIndex(idx);tg.computeVertexNormals();
  var rib=canvasTex(64,16,function(x,w,h){x.fillStyle='#f5f3ec';x.fillRect(0,0,w,h);x.fillStyle='#b4b0a3';x.fillRect(0,0,5,h);x.fillStyle='#ffffff';x.fillRect(5,0,9,h);x.fillStyle='#e3e0d6';x.fillRect(w/2,0,3,h)});
  rib.wrapS=THREE.RepeatWrapping;rib.needsUpdate=true;
  var mTop=new THREE.MeshLambertMaterial({map:rib,side:THREE.DoubleSide});

  /* 아랫면·앞뒤 테두리·양끝 마개 (색깔 점으로 칠한 한 덩어리) */
  var sp=[],sc=[];
  function quad(a,b,c,d,col){var C=new THREE.Color(col);[a,b,c,a,c,d].forEach(function(p){sp.push(p[0],p[1],p[2]);sc.push(C.r,C.g,C.b)})}
  function dn(p,h){return [p[0],p[1]-h,p[2]]}
  for(k=0;k<n-1;k++){
    var ai=P(k,A,y0),bi=P(k,B,y1),aj=P(k+1,A,y0),bj=P(k+1,B,y1);
    quad(dn(ai,ROOF.th),dn(bi,ROOF.th),dn(bj,ROOF.th),dn(aj,ROOF.th),0xd8d5cb);                 // 아랫면
    quad(P(k,A,y0+.12),P(k+1,A,y0+.12),dn(aj,ROOF.th+.38),dn(ai,ROOF.th+.38),0xf3f1ea);          // 앞 테두리(두껍고 하얗게)
    quad(bi,bj,dn(bj,ROOF.th+.15),dn(bi,ROOF.th+.15),0xcdc9bd);                                  // 뒤 테두리
  }
  [0,n-1].forEach(function(e){var a2=P(e,A,y0),b2=P(e,B,y1);quad(a2,b2,dn(b2,ROOF.th),dn(a2,ROOF.th),0xe6e3da)});
  var sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(sc,3));sg.computeVertexNormals();
  var mSolid=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
  var roof=new THREE.Group();roof.add(new THREE.Mesh(tg,mTop));roof.add(new THREE.Mesh(sg,mSolid));scene.add(roof);

  /* 카메라가 지붕 높이 안쪽(지붕 밑~위 몇 m)이고 지붕 평면 안이면 반투명 */
  for(k=0;k<n;k++){var p1=P(k,A,0);poly.push([p1[0],p1[2]])}
  for(k=n-1;k>=0;k--){var p2=P(k,B+1.5,0);poly.push([p2[0],p2[2]])}
  function inside(x,z){var c=false;for(var i=0,j=poly.length-1;i<poly.length;j=i++){var a=poly[i],b=poly[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
  var cur=1;
  (function tick(){
    requestAnimationFrame(tick);
    var cp=camera.position,near=cp.y>y0-ROOF.th-1.8&&cp.y<y1+5&&inside(cp.x,cp.z),t=near?ROOF.fade:1;
    cur+=(t-cur)*.18;if(Math.abs(t-cur)<.01)cur=t;
    [mTop,mSolid].forEach(function(m){m.opacity=cur;m.transparent=cur<.99;m.depthWrite=cur>=.99});
  })();
})();
