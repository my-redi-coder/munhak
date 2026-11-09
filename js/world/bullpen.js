/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 불펜 (작은 패치 AE, 2026-11-09) =================
   실제 문학: 폴 바로 옆 담장 뒤의 뚫린 칸(불펜). 한쪽 끝은 하늘이 열려 있고 포수가 앉아요.
   가운데 쪽 끝은 '꽃돼지 한돈 포스터'가 지붕이 되어 불펜 깊이 전체를 덮고, 판판한 한 장으로 뒤 관중석 앞 3줄 위에 걸쳐요(처마는 담장 윗면에 얹힘, 폭 8m×경사 8m 정사각형). 그 아래 마운드에 투수가 서요.
   열린 쪽 위 관중석 난간에는 긴 광고띠(<조선B&B깍두기> … 홈런존)가 걸려요.
   · 길이·위치: 안내도(축척 확인) 기준 약 24m였으나, 포스터가 한 블록에만 걸치도록 블록 이음매에 맞춰 21.9m로 줄였어요(작은 패치 AF). 폴(45°)에서 가운데 쪽으로 PEN.len m (약 33.7°까지). 1루·3루 똑같이 대칭.
   · 깊이: 담장 ~ 관중석 앞 난간(OF.LIP 2.6m, 실제 블록 앞면은 약 2.2m). 블록은 하나도 안 옮겨요.
   · 걸어 다니는 구역은 건드리지 않아요. 보는 풍경이에요.
   · 선수는 js/game/penplay.js가 세워요(이 파일은 PEN.pt()로 자리만 알려 줘요).
   · 홈런커플존·분홍 담장 띠(outskirts.js의 OSK.pink)는 PEN.a1에서 시작해요 → 이 파일이 outskirts.js·couplezone.js보다 먼저 불려야 해요.
   · outfield.js(OF·ofFence·ofLip)와 hogbanner.js(hogPosterTex) 다음에 불려야 해요. 숫자는 PEN 한 곳. */
var PEN={
  len:21.9,               // 불펜 길이(m): 폴에서 가운데 쪽으로. 3루 큰 블록·1루 가짜 관중석 칸의 가운데 쪽 이음매(33.7°)와 같음
  roof:[13.9,21.9],       // 포스터가 놓이는 구간(폴에서 m) — 가운데 쪽 8m, 한 블록 안
  banner:[.6,12.9],       // 광고띠 구간(폴에서 m) — 열린 쪽 위
  catcherAt:2.4,          // 포수 자리(폴에서 m)
  plate:18.44,            // 포수 ~ 투수 거리(m, 규정 거리 그대로)
  floor:.8,               // 불펜 바닥 높이(담장 3.1 뒤로 숨게)
  d:1.1,                  // 투구 줄이 담장에서 떨어진 거리(m)
  benchD:1.75,            // 벤치 자리(담장에서 m)
  wallTop:3.28,           // 담장 윗면(노란 줄 위) — 포스터 처마가 얹히는 높이
  rail:4.2,               // 관중석 앞 난간 높이(config.js의 FLOOR.out + 1)
  dEnd:7.85,              // 포스터 위쪽 끝이 담장에서 떨어진 거리 = 뒤 블록 3번째 줄 끝
  hEnd:5.0,               // 그 끝의 높이(3번째 줄 끝 높이 4.7 + 0.3) → 한 장의 판판한 면, 경사 약 12°
  bannerD:1.95,           // 광고띠가 걸리는 거리(블록 앞면보다 앞)
  bannerY:[3.4,4.7],      // 광고띠 아래·위 높이
  scale:1.0,              // 불펜 선수 크기: 그라운드 선수(1.25배)보다 작게 = 실제 비율
  a1:32.5                 // 불펜이 끝나는 각도(도) — 아래에서 길이로 다시 계산
};
(function(){
  var D=Math.PI/180,tab=[{L:0,deg:45}],L=0,prev=ofFence(45*D),a;
  for(a=45-.05;a>=20;a-=.05){var q=ofFence(a*D);L+=Math.hypot(q[0]-prev[0],q[1]-prev[1]);prev=q;tab.push({L:L,deg:a})}
  function degAt(l){var lo=0,hi=tab.length-1;while(hi-lo>1){var m=(lo+hi)>>1;if(tab[m].L<l)lo=m;else hi=m}
    var A=tab[lo],B=tab[hi],u=B.L===A.L?0:(l-A.L)/(B.L-A.L);return A.deg+(B.deg-A.deg)*u}
  PEN.a1=Math.round(degAt(PEN.len)*10)/10;
  function nrm(p){var f=ofFence(p),l=ofLip(p);return [(l[0]-f[0])/OF.LIP,(l[1]-f[1])/OF.LIP]}
  /* 폴에서 l m, 담장에서 바깥으로 d m 떨어진 땅 위의 점. side: 1=1루, -1=3루. n=바깥 방향 */
  PEN.pt=function(side,l,d){var p=side*degAt(l)*D,f=ofFence(p),n=nrm(p);return {x:f[0]+n[0]*d,z:f[1]+n[1]*d,n:n}};
  PEN.tan=function(side,l){var a=PEN.pt(side,l-.5,0),b=PEN.pt(side,l+.5,0);return [b.x-a.x,b.z-a.z]};
  PEN.center=function(side){return PEN.pt(side,PEN.len/2,1)};
  /* 곡선을 따라 가는 띠: 담장 쪽 (d0,y0) ~ 바깥쪽 (d1,y1). flip이면 글자가 반대로 안 읽히게 u를 뒤집어요(1루) */
  function strip(side,l0,l1,d0,y0,d1,y1,flip){
    var P=[],UV=[],I=[],n=Math.max(2,Math.ceil((l1-l0)/.5)+1),i;
    for(i=0;i<n;i++){var l=l0+(l1-l0)*i/(n-1),A=PEN.pt(side,l,d0),B=PEN.pt(side,l,d1),u=i/(n-1);if(flip)u=1-u;
      P.push(A.x,y0,A.z,B.x,y1,B.z);UV.push(u,0,u,1);
      if(i){var k=(i-1)*2;I.push(k,k+1,k+2,k+1,k+3,k+2)}}
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeVertexNormals();return g;
  }
  /* 폴에서 l m 지점에 서 있는 세로 판: 점 목록 [[d,y],…](볼록 모양)을 부채꼴로 */
  function wall(side,l,pts){
    var P=[],I=[];pts.forEach(function(q,i){var A=PEN.pt(side,l,q[0]);P.push(A.x,q[1],A.z);if(i>1)I.push(0,i-1,i)});
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();return g;
  }
  function bannerDraw(x,w,h,labelLeft){
    var F='"Gowun Dodum","Apple SD Gothic Neo",sans-serif',i;
    x.fillStyle='#f6f4ec';x.fillRect(0,0,w,h);x.fillStyle='#2f3a33';x.fillRect(0,0,w,8);x.fillRect(0,h-8,w,8);
    x.fillStyle='#c8102e';x.fillRect(0,h-16,w,8);
    x.textBaseline='middle';x.textAlign='center';x.fillStyle='#1d2420';
    var lab=w*.1,x0=labelLeft?lab:0,span=w-lab;       // 작은 '홈런존' 자리를 뺀 가운데 부분에 문구 두 번
    x.font='bold 118px '+F;
    [.25,.75].forEach(function(u){x.fillText('조선B&B깍두기',x0+span*u,h*.5-4)});
    x.font='bold 40px '+F;x.fillStyle='#5b6159';x.fillText('홈런존',labelLeft?lab/2:w-lab/2,h*.5-4);
  }
  function bannerTex(labelLeft){
    var W=2048,H=190,t=canvasTex(W,H,function(x,w,h){bannerDraw(x,w,h,labelLeft)});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){bannerDraw(t.image.getContext('2d'),W,H,labelLeft);t.needsUpdate=true});
    return t;
  }
  var dirt=new THREE.MeshLambertMaterial({color:0xb98f62,side:THREE.DoubleSide}),conc=new THREE.MeshLambertMaterial({color:0xd9d5c9,side:THREE.DoubleSide});
  var posterMat=new THREE.MeshLambertMaterial({map:hogPosterTex(),side:THREE.DoubleSide});
  var bannerMat={};bannerMat[-1]=new THREE.MeshBasicMaterial({map:bannerTex(false),side:THREE.DoubleSide});bannerMat[1]=new THREE.MeshBasicMaterial({map:bannerTex(true),side:THREE.DoubleSide});
  /* 각도(도) → 폴에서 잰 거리(m) (degAt의 거꾸로) */
  function lAt(deg){var lo=0,hi=tab.length-1;while(hi-lo>1){var m=(lo+hi)>>1;if(tab[m].deg>deg)lo=m;else hi=m}
    var A=tab[lo],B=tab[hi],u=B.deg===A.deg?0:(deg-A.deg)/(B.deg-A.deg);return A.L+(B.L-A.L)*u}
  /* 포스터 밑(폭 8m × 담장에서 dEnd) 좌석의 관중은 비워요: crowd.js가 cs.gone 표시를 보고 숨겨요(관중이 포스터를 뚫고 나오지 않게) */
  PEN.cleared=0;
  crowdSpots.forEach(function(cs){
    var v=new THREE.Vector3(cs.seat.x,cs.seat.y,cs.seat.z);cs.blk.g.localToWorld(v);
    var p=Math.atan2(v.x,-v.z),deg=Math.abs(p)/D;if(deg>45||deg<20)return;
    var d=Math.hypot(v.x,v.z)-fenceR(p),l=lAt(deg);
    if(l>=PEN.roof[0]-.8&&l<=PEN.roof[1]+.3&&d>0&&d<PEN.dEnd+.7){cs.gone=true;PEN.cleared++}
  });
  PEN.built=[];
  [1,-1].forEach(function(side){
    var flip=side>0,fl=PEN.floor,parts=[];
    // 바닥(흙) + 폴 쪽 끝 벽 + 가운데 쪽 끝 벽(지붕 모양 따라 사다리꼴)
    scene.add(new THREE.Mesh(strip(side,0,PEN.len,.05,fl,2.75,fl,false),dirt));
    scene.add(new THREE.Mesh(wall(side,0,[[0,0],[2.75,0],[2.75,3.2],[0,3.2]]),conc));
    var sl=(PEN.hEnd-PEN.wallTop)/PEN.dEnd;                                    // 포스터 경사(높이/거리)
    scene.add(new THREE.Mesh(wall(side,PEN.len,[[0,0],[2.75,0],[2.75,PEN.wallTop+sl*2.75],[0,PEN.wallTop]]),conc));
    // 포스터: 담장 윗면(처마)에서 시작해 한 장의 판판한 면으로 뒤 관중석 3줄 위에 걸쳐요. 불펜 깊이 전체를 덮고 처마는 담장에 얹혀요
    var roof=new THREE.Mesh(strip(side,PEN.roof[0],PEN.roof[1],0,PEN.wallTop,PEN.dEnd,PEN.hEnd,flip),posterMat);scene.add(roof);
    // 광고띠: 열린 쪽 위 관중석 앞 난간에 걸림(1루는 '홈런존' 글자가 가운데 쪽(왼쪽)에 오게 따로 그림)
    var ban=new THREE.Mesh(strip(side,PEN.banner[0],PEN.banner[1],PEN.bannerD,PEN.bannerY[0],PEN.bannerD,PEN.bannerY[1],flip),bannerMat[side]);scene.add(ban);
    // 마운드 + 투구판, 홈 플레이트, 벤치 둘
    var mo=PEN.pt(side,PEN.catcherAt+PEN.plate,PEN.d),pl=PEN.pt(side,PEN.catcherAt,PEN.d),tn=PEN.tan(side,PEN.catcherAt+PEN.plate),ry=Math.atan2(tn[0],tn[1]);
    parts.push({g:Cyl(.55,1.05,.24,18),c:0xc9a070,p:[mo.x,fl+.12,mo.z]});
    parts.push({g:Box(.6,.04,.16),c:0xffffff,p:[mo.x,fl+.26,mo.z],r:[0,ry,0]});
    parts.push({g:Cyl(.24,.24,.03,5),c:0xffffff,p:[pl.x,fl+.02,pl.z]});
    [8.6,11.6].forEach(function(l){var b=PEN.pt(side,l,PEN.benchD),t2=PEN.tan(side,l),r2=Math.atan2(t2[0],t2[1]);
      parts.push({g:Box(.42,.07,2.3),c:0x7a5d47,p:[b.x,fl+.46,b.z],r:[0,r2,0]});
      [-1,1].forEach(function(s){parts.push({g:Box(.3,.44,.08),c:0x4a3f36,p:[b.x+Math.sin(r2)*s*.95,fl+.22,b.z+Math.cos(r2)*s*.95],r:[0,r2,0]})})});
    scene.add(new THREE.Mesh(mergeParts(parts),MVC));
    PEN.built.push(side);
  });
})();
