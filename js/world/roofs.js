/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 하룰라라석 말발굽 지붕 (작은 패치 L, 2차) =================
   위층(하룰라라 높이) 스탠드 전체를 한 장으로 이어서 덮는 지붕이에요. 3루 쪽 끝 → 홈 뒤 부채꼴 → 1루 쪽 끝까지 쭉 이어져요.
   · 윗면: 기둥 간격마다 마루(하얀)와 골(회색빛)이 반복되는 '물결' + 잔 부채살 주름. 마루마다 뾰족 장식.
   · 앞 테두리: 검은 철골 트러스 보 + 그 앞면에 필드를 향한 조명 뱅크. 밤(DN.n)에 켜지고 빛이 번져요. 낮엔 꺼진 회색 판.
   · 아랫면: 밤에 주황 기운. 뒤쪽엔 가는 철골 기둥(좌석 위에 서는 자리에만).
   · 눌러지거나 걷는 곳이 아니에요. 걷기·전광판·이벤트에 영향 없음. 카메라가 지붕 높이 안쪽으로 들어오면 지붕·조명이 반투명해져요.
   · 블록마다 있던 작은 지붕 판은 이 지붕 바로 아래에 겹쳐 숨어요(stands.js는 그대로).
   · curvestand.js 다음에 불려야 해요(호 모양 숫자를 그대로 써요). index.html에서 curvestand.js 바로 아래에 둬요. */
var ROOF={
  z0:1.6,        // 지붕 앞끝: 앞줄에서 본 좌석 줄 위치(작게 하면 더 앞까지 덮어요)
  th:.34,        // 지붕 두께
  farS:59.4,     // 대각선 쪽 지붕이 끝나는 위치(맨 끝 블록 끝 + 여유)
  bay:8,         // 기둥·조명·뾰족 장식 간격(m, 대략)
  amp:1.0,       // 물결 높이(마루가 골보다 올라오는 높이)
  ribP:2.0,      // 잔 부채살 주름 간격(m)
  ribA:.12,      // 잔 주름 깊이
  beamH:.95,     // 앞 철골 보 높이
  spire:2.2,     // 마루 위 뾰족 장식 높이
  fade:.2        // 카메라가 지붕 안으로 들어올 때의 투명도
};
(function(){
  if(typeof CVS==='undefined'||!CVS.levels||!CVS.levels[1])return;
  var S=.7071,rad=Math.PI/180,TP=Math.PI*2,L=CVS.levels[1],
      xd=(6+L.o-1.9-6.9)*S,r=xd/S,zc=(L.o-1.9-r)/S,seg=90/L.n,off=L.o-1.9,
      lastTop=L.base+(L.rows-1)*RH,z1=L.rows*RD+1.6,A=ROOF.z0+1.9,B=z1+1.9,th=ROOF.th;
  function yTop(z){return lastTop+5.2+.08*(z-6.6)+.165}          // 예전 작은 지붕(기울기 .08) 윗면보다 .04 위
  function diag(s,side){return [side*(s+off)*S,(off-s)*S]}        // 대각선 블록 앞줄 위의 점 (pos1B(s,off,side)와 같음)

  /* 앞줄(블록 앞쪽 가장자리)이 지나는 꼭짓점들: 3루 끝 → 3루 대각선 → 호 → 1루 대각선 → 1루 끝 */
  var V=[diag(ROOF.farS,-1)],U=[[-S,S]];
  for(var k=0;k<=L.n;k++){var a=(-45+seg*k)*rad;V.push([r*Math.sin(a),zc+r*Math.cos(a)])}
  for(k=0;k<L.n;k++){var f=(-45+seg*(k+.5))*rad;U.push([Math.sin(f),Math.cos(f)])}
  V.push(diag(ROOF.farS,1));U.push([S,S]);
  var n=V.length,Mi=[],cum=[0];                                    // Mi: 꼭짓점마다 '모서리 이음' 방향(양쪽 블록이 뒤로 뻗는 방향의 평균)
  for(k=0;k<n;k++){var u0=U[Math.max(k-1,0)],u1=U[Math.min(k,U.length-1)],q=1+u0[0]*u1[0]+u0[1]*u1[1];Mi.push([(u0[0]+u1[0])/q,(u0[1]+u1[1])/q])}
  for(k=0;k<n-1;k++)cum.push(cum[k]+Math.hypot(V[k+1][0]-V[k][0],V[k+1][1]-V[k][1]));
  var total=cum[n-1],N=Math.max(2,Math.round(total/ROOF.bay)),P=total/N;     // N칸, 한 칸 길이 P
  function frame(s){var i=0;while(i<n-2&&s>cum[i+1])i++;var t=(s-cum[i])/(cum[i+1]-cum[i]);
    return {F:[V[i][0]+(V[i+1][0]-V[i][0])*t,V[i][1]+(V[i+1][1]-V[i][1])*t],M:[Mi[i][0]+(Mi[i+1][0]-Mi[i][0])*t,Mi[i][1]+(Mi[i+1][1]-Mi[i][1])*t],u:U[i],s:s,i:i}}
  function wv(s){return .5+.5*Math.cos(TP*s/P)}                    // 기둥 자리에서 1(마루), 칸 가운데에서 0(골)
  function rb(s){return .5+.5*Math.cos(TP*s/ROOF.ribP)}
  function yy(z,s){return yTop(z)+ROOF.amp*wv(s)+ROOF.ribA*rb(s)}

  /* 샘플 위치: 촘촘한 간격 + 꼭짓점 */
  var sv=[],st=total/Math.ceil(total/.4);
  for(var m=0;m*st<total-1e-6;m++)sv.push(m*st);sv.push(total);cum.forEach(function(c){sv.push(c)});
  sv.sort(function(x,y){return x-y});sv=sv.filter(function(v,i){return !i||v-sv[i-1]>1e-4});
  var FR=sv.map(frame),ns=FR.length;
  function at(f,d,y){return [f.F[0]+d*f.M[0],y,f.F[1]+d*f.M[1]]}

  /* 1. 윗면 + 아랫면 (물결 격자) */
  var tp=[],tc=[],up=[],ix=[],cT=new THREE.Color(0xb7b4a9),cC=new THREE.Color(0xffffff),cc=new THREE.Color();
  FR.forEach(function(f,i){
    var w=wv(f.s),rr=rb(f.s);cc.copy(cT).lerp(cC,Math.pow(w,.7)).multiplyScalar(.78+.22*rr);
    var a1=at(f,A,yy(ROOF.z0,f.s)),b1=at(f,B,yy(z1,f.s));
    tp.push(a1[0],a1[1],a1[2],b1[0],b1[1],b1[2]);tc.push(cc.r,cc.g,cc.b,cc.r,cc.g,cc.b);
    up.push(a1[0],a1[1]-th,a1[2],b1[0],b1[1]-th,b1[2]);
    if(i<ns-1)ix.push(2*i,2*i+1,2*i+3,2*i,2*i+3,2*i+2);
  });
  function grid(pos,col){var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));if(col)g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(ix);g.computeVertexNormals();return g}
  var mTop=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}),
      mUnder=new THREE.MeshLambertMaterial({color:0xbeb9ab,side:THREE.DoubleSide,emissive:0x000000});

  /* 2. 앞 철골 트러스 보 (격자 그림) */
  var truss=canvasTex(128,64,function(x,w,h){x.fillStyle='#363a40';x.fillRect(0,0,w,h);x.strokeStyle='#8e949c';x.lineWidth=5;
    x.beginPath();x.moveTo(0,3);x.lineTo(w,3);x.moveTo(0,h-3);x.lineTo(w,h-3);x.stroke();x.lineWidth=4;
    x.beginPath();x.moveTo(0,h-4);x.lineTo(w/4,4);x.lineTo(w/2,h-4);x.lineTo(w*3/4,4);x.lineTo(w,h-4);x.stroke()});
  truss.wrapS=THREE.RepeatWrapping;truss.needsUpdate=true;
  var bp=[],bu=[],Af=A-.35;
  FR.forEach(function(f){var y=yy(ROOF.z0,f.s)-.06,t1=at(f,Af,y),b1=at(f,Af,y-ROOF.beamH);
    bp.push(t1[0],t1[1],t1[2],b1[0],b1[1],b1[2]);bu.push(f.s/2.4,1,f.s/2.4,0)});
  var bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute(bp,3));bg.setAttribute('uv',new THREE.Float32BufferAttribute(bu,2));bg.setIndex(ix);bg.computeVertexNormals();
  var mBeam=new THREE.MeshLambertMaterial({map:truss,side:THREE.DoubleSide});

  /* 3. 뒤 테두리·양끝 마개 (색깔 점) */
  var sp=[],sc=[];
  function quad(a,b,c,d,col){var C=new THREE.Color(col);[a,b,c,a,c,d].forEach(function(p){sp.push(p[0],p[1],p[2]);sc.push(C.r,C.g,C.b)})}
  function dn(p,h){return [p[0],p[1]-h,p[2]]}
  for(var i=0;i<ns-1;i++){var f0=FR[i],f1=FR[i+1],o0=at(f0,B,yy(z1,f0.s)),o1=at(f1,B,yy(z1,f1.s));quad(o0,o1,dn(o1,th+.2),dn(o0,th+.2),0xcdc9bd)}
  [0,ns-1].forEach(function(e){var f=FR[e],p1=at(f,A,yy(ROOF.z0,f.s)),p2=at(f,B,yy(z1,f.s));quad(p1,p2,dn(p2,th),dn(p1,th),0xe6e3da)});
  var sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(sc,3));sg.computeVertexNormals();

  /* 4. 기둥 자리마다: 뾰족 장식 · 철골 기둥 · 조명 뱅크 */
  var parts=[],lampP=[],lampU=[],lampI=[],glows=[];
  function inBlock(s,f){                                           // 대각선 쪽 기둥은 좌석 덩어리 위에만 세워요(블록 사이 빈틈은 건너뜀)
    if(f.i>0&&f.i<n-2)return true;
    var sd=f.i===0?ROOF.farS-s:-.9+(s-cum[n-2]);
    return [6,22,38,52].some(function(s0){return sd>s0-6.3&&sd<s0+6.3});
  }
  var lamp=canvasTex(128,48,function(x,w,h){x.fillStyle='#24272c';x.fillRect(0,0,w,h);x.fillStyle='#fff';
    for(var yy2=0;yy2<3;yy2++)for(var xx=0;xx<8;xx++){x.beginPath();x.arc(10+xx*15.5,9+yy2*15,5.2,0,TP);x.fill()}});
  var mLamp=new THREE.MeshBasicMaterial({map:lamp,side:THREE.DoubleSide}),
      glowT=canvasTex(64,64,function(x,w,h){var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,248,225,1)');g.addColorStop(.35,'rgba(255,240,200,.45)');g.addColorStop(1,'rgba(255,230,180,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
  for(var j=0;j<=N;j++){
    var s=j*P,f=frame(s),u=f.u,th2=Math.atan2(u[0],u[1]),tg=[u[1],-u[0]],crest=ROOF.amp+ROOF.ribA;
    // 뾰족 장식
    var sx=f.F[0]+u[0]*(3.6+1.9),sz=f.F[1]+u[1]*(3.6+1.9);
    parts.push({g:Cyl(0,.34,ROOF.spire,6),c:0xf3f1ea,p:[sx,yTop(3.6)+crest+ROOF.spire/2-.05,sz]});
    // 철골 기둥 (뒤쪽 좌석 위)
    if(inBlock(s,f)){var cx=f.F[0]+u[0]*10.9,cz=f.F[1]+u[1]*10.9,yb=lastTop-.4,yt=yTop(9)+crest-th-.1;
      parts.push({g:Cyl(.2,.24,yt-yb,8),c:0x4a4d53,p:[cx,(yb+yt)/2,cz]})}
    // 조명 뱅크: 보 앞면에 붙인 어두운 상자 + 불빛 판 + 번지는 빛
    var yc=yy(ROOF.z0,s)-.06-ROOF.beamH/2,hx=f.F[0]+u[0]*(Af-.35),hz=f.F[1]+u[1]*(Af-.35);
    parts.push({g:Box(3.5,1.25,.5),c:0x2b2e33,p:[hx,yc,hz],r:[0,th2,0]});
    var fx=hx-u[0]*.27,fz=hz-u[1]*.27,b0=lampP.length/3;
    [[-1.65,.52],[1.65,.52],[1.65,-.52],[-1.65,-.52]].forEach(function(c,ci){lampP.push(fx+tg[0]*c[0],yc+c[1],fz+tg[1]*c[0]);lampU.push(ci===0||ci===3?0:1,ci<2?1:0)});
    lampI.push(b0,b0+1,b0+2,b0,b0+2,b0+3);
    var spr=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,color:0xfff3d6,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    spr.position.set(fx-u[0]*.5,yc,fz-u[1]*.5);spr.scale.set(8,5.5,1);glows.push(spr);
  }
  var pg=mergeParts(parts),lg=new THREE.BufferGeometry();
  lg.setAttribute('position',new THREE.Float32BufferAttribute(lampP,3));lg.setAttribute('uv',new THREE.Float32BufferAttribute(lampU,2));lg.setIndex(lampI);lg.computeVertexNormals();
  var mMisc=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});

  var roof=new THREE.Group();
  [[grid(tp,tc),mTop],[grid(up),mUnder],[bg,mBeam],[sg,mMisc],[pg,mMisc],[lg,mLamp]].forEach(function(e){roof.add(new THREE.Mesh(e[0],e[1]))});
  glows.forEach(function(g){roof.add(g)});scene.add(roof);

  /* 5. 카메라가 지붕 높이 안쪽(지붕 밑~위 몇 m)이고 지붕 평면 안이면 반투명 / 밤엔 조명 켜짐 */
  var poly=[],y0=yTop(ROOF.z0),y1=yTop(z1)+ROOF.amp;
  for(k=0;k<n;k++){var p1=[V[k][0]+A*Mi[k][0],V[k][1]+A*Mi[k][1]];poly.push(p1)}
  for(k=n-1;k>=0;k--){var p2=[V[k][0]+(B+1.5)*Mi[k][0],V[k][1]+(B+1.5)*Mi[k][1]];poly.push(p2)}
  function inside(x,z){var c=false;for(var i=0,j=poly.length-1;i<poly.length;j=i++){var a=poly[i],b=poly[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
  var cur=1,solids=[mTop,mUnder,mBeam,mMisc,mLamp];
  (function tick(){
    requestAnimationFrame(tick);
    var cp=camera.position,near=cp.y>y0-th-1.8&&cp.y<y1+5&&inside(cp.x,cp.z),t=near?ROOF.fade:1;
    cur+=(t-cur)*.18;if(Math.abs(t-cur)<.01)cur=t;
    var k2=typeof DN!=='undefined'?DN.n*(1-DN.ev):0;
    solids.forEach(function(m){m.opacity=cur;m.transparent=cur<.99;m.depthWrite=cur>=.99});
    var lv=.32+.68*k2;mLamp.color.setRGB(lv,lv,lv*.97);                                        // 낮엔 꺼진 회색 판, 밤엔 환하게
    mUnder.emissive.setRGB(.42*k2,.2*k2,.05*k2);                                               // 밤엔 아랫면에 주황 기운
    glows.forEach(function(g){g.material.opacity=k2*.85*cur;g.visible=g.material.opacity>.01});
  })();
})();
