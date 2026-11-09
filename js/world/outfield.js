/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 외야석: 담장 곡선을 따라 이어 붙이기 (작은 패치 L, 2026-11-02) =================
   · 담장(field.js의 fenceR, 타원)에서 OF.LIP m 뒤에 '앞 난간 곡선'을 긋고, 폴 쪽(OF.START도)부터 가운데로
     블록을 하나씩 '앞 모서리끼리 맞닿게' 놓아요. 블록은 홈이 아니라 담장 곡선을 정면으로 봐요(실제 구장처럼).
   · 블록 사이 뒤쪽으로 벌어지는 쐐기 틈은 계단으로 메우고, 줄마다 들어가는 만큼 좌석·관중을 앉혀요(보는 풍경, 걷기 X).
   · 순서: 오른쪽(1루) 바비큐존 → 걷는 외야(ZB.outfield) → 장식 / 왼쪽(3루) 작은 장식 → 장식 → 세탁소 블록(ZB.laundry, 2026-11-04) → 장식. (불펜은 담장 앞 띠에 따로: world/bullpen.js. 예전 현수막 블록은 이제 그냥 장식 관중석)
     양쪽 길이를 맞춰 좌우가 거울처럼 같은 곡선에서 끝나요(가운데는 빅보드 앞이라 비움).
   · 걷기·앉기는 블록 안 좌표로만 돌아서, 블록이 돌고 옮겨져도 그대로 따라가요(input.js·movement.js 손대지 않음).
   · 폴 바깥 모서리 장식 블록(OF.corner, 작은 패치 W, 2026-11-04): 폴 쪽 첫 칸에서 반대 방향(파울 지역 쪽)으로 한 칸. 내야 연장 블록(stands.js)과 쐐기로 이어져요. 1루·3루 대칭
   · 숫자를 바꿀 땐 OF만 고치면 블록·쐐기·바비큐존(bbq.js의 OF.bbq)이 같이 움직여요.
   · stands.js 다음, greenzone.js·hogbanner.js·bbq.js·crowd.js 앞에서 불려야 해요. */
var OF={
  LIP:2.6,            // 담장 → 관중석 앞 난간 거리(m)
  START:46.5,         // 폴 쪽 첫 칸이 시작하는 각도(도). 폴은 45°
  base:FLOOR.out,rows:8,seat:0x6f9d45,   // 높이는 config.js의 FLOOR.out (패치 AC: 1.6 → 3.2)
  right:[{t:'bbq',w:24},{t:'walk',cols:18},{t:'decor',cols:18}],
  left:[{t:'decor',cols:6},{t:'decor',cols:18},{t:'laundry',cols:18},{t:'decor',cols:18}],/* 폴 쪽 두 칸(작은 장식 + 장식) 앞이 3루 불펜(world/bullpen.js) 자리라 이제 관중이 다시 앉아요(작은 패치 AE, 예전엔 현수막 블록이라 비웠음). 그 옆 블록 = 세탁소(world/laundry.js): 블록 가운데 통로를 사이에 둔 좌우 두 구역에 십의 자리·일의 자리 */
  bbq:null,           // 바비큐존 자리 {x,z,theta} — bbq.js가 읽어요
  cornerCols:9,       // 폴 바깥 모서리 장식 블록 폭(칸). 작은 패치 W
  corner:{}           // 모서리 블록 자리 corner[1](1루)·corner[-1](3루) = {x,z,theta,n}
};
function ofFence(p){var r=fenceR(p);return [Math.sin(p)*r,-Math.cos(p)*r]}
function ofOut(x,z,nx,nz){return nx*x+nz*z<0?[-nx,-nz]:[nx,nz]}           // 홈 반대쪽(바깥)을 보게
function ofLip(p){var e=.0005,a=ofFence(p-e),b=ofFence(p+e),tx=b[0]-a[0],tz=b[1]-a[1],L=Math.hypot(tx,tz),f=ofFence(p),n=ofOut(f[0],f[1],-tz/L,tx/L);return [f[0]+n[0]*OF.LIP,f[1]+n[1]*OF.LIP]}
(function(){
  var D=Math.PI/180,wedges=[],SEATW=SP;
  function slotW(s){return s.w||s.cols*SP+AIS+1.2+.5}                 // 블록 폭 + 양옆 벽
  /* 한쪽 줄 세우기: 앞 모서리 c0에서 정확히 w만큼 떨어진 곡선 위 점 c1을 찾아 그 사이에 칸을 놓아요 */
  function chain(side,list){
    var p=side*OF.START*D,c0=ofLip(p),out=[];
    list.forEach(function(s){
      var w=slotW(s),lo=0,hi=p;
      for(var i=0;i<50;i++){var m=(lo+hi)/2,c=ofLip(m);if(Math.hypot(c[0]-c0[0],c[1]-c0[1])>w)lo=m;else hi=m}
      var c1=ofLip((lo+hi)/2),mx=(c0[0]+c1[0])/2,mz=(c0[1]+c1[1])/2,dx=c1[0]-c0[0],dz=c1[1]-c0[1],L=Math.hypot(dx,dz),n=ofOut(mx,mz,-dz/L,dx/L);
      out.push({s:s,c0:c0,c1:c1,mx:mx,mz:mz,n:n,theta:Math.atan2(n[0],n[1])});c0=c1;p=(lo+hi)/2;
    });
    return out;
  }
  function place(k){
    var s=k.s,o=s.t==='bbq'?1:1.9,x=k.mx+k.n[0]*o,z=k.mz+k.n[1]*o;     // 앞 난간이 곡선 위에 오게
    if(s.t==='bbq'){OF.bbq={x:x,z:z,theta:k.theta};return}
    var cfg={x:x,z:z,theta:k.theta,base:OF.base,rows:OF.rows,cols:s.cols,seat:OF.seat,occ:s.t==='walk'?.6:.55,out:true};/* out: 밤에도 밝게(world/nightdim.js) */
    if(s.t==='walk')cfg.key='outfield';
    var b=buildBlock(cfg);
    if(s.t==='walk')ZB.outfield=b;
    if(s.t==='laundry')ZB.laundry=b;/* 세탁소 블록(현수막 바로 옆) — world/laundry.js가 이 블록의 좌우 두 구역을 써요 */
  }
  /* 쐐기: H=맞닿은 앞 모서리, up·un=양쪽 블록이 뒤로 뻗는 방향. 계단 + 뒷벽 + 줄마다 좌석 */
  function wedge(H,up,un){
    var B=OF.base,R=OF.rows,bottom=-.05,lastTop=B+(R-1)*RH,steps=[[0,1.9,B,0xdedad0]];
    for(var r=0;r<R;r++)steps.push([1.9+r*RD,1.9+(r+1)*RD,B+r*RH,r%2?0xe2ded3:0xd9d5c9]);
    steps.push([1.9+R*RD,1.9+R*RD+.2,lastTop+1.1,0xd2cbbd]);
    steps.forEach(function(s){
      var P=[[H[0]+s[0]*up[0],H[1]+s[0]*up[1]],[H[0]+s[1]*up[0],H[1]+s[1]*up[1]],[H[0]+s[1]*un[0],H[1]+s[1]*un[1]],[H[0]+s[0]*un[0],H[1]+s[0]*un[1]]];
      var sh=new THREE.Shape();P.forEach(function(p,i){i?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1])});
      var g=new THREE.ExtrudeGeometry(sh,{depth:s[2]-bottom,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,bottom,0);
      wedges.push({g:g,c:s[3]});
    });
    /* 좌석: 쐐기 가운데 방향을 보게(관중·장식 의자는 crowd.js가 blk.g·cfg.theta로 그려요) */
    var mn=[up[0]+un[0],up[1]+un[1]],ml=Math.hypot(mn[0],mn[1]),blk={g:new THREE.Group(),cfg:{theta:Math.atan2(mn[0]/ml,mn[1]/ml)},key:null};
    blk.g.updateMatrixWorld(true);
    for(r=0;r<R;r++){
      var d=1.9+r*RD+RD*.64,a=[H[0]+d*up[0],H[1]+d*up[1]],b=[H[0]+d*un[0],H[1]+d*un[1]],w=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.floor((w-.5)/SEATW);
      for(var i=0;i<n;i++){var t=(i+.5)/n,st={x:a[0]+(b[0]-a[0])*t,y:B+r*RH,z:a[1]+(b[1]-a[1])*t,occ:null,crowd:-1};
        if(Math.random()<.55){st.crowd=crowdSpots.length;crowdSpots.push({blk:blk,seat:st})}
        decorSeats.push({blk:blk,s:st,col:OF.seat});
      }
    }
  }
  /* 폴 바깥 모서리 한 칸(작은 패치 W, 2026-11-04): 첫 칸이 시작하는 점에서 '반대 방향'(파울 지역 쪽)으로 담장 곡선을 따라 장식 블록 하나.
     내야 연장 블록(stands.js)과 바비큐존/3루 첫 칸 사이 빈 곳을 메워요. 1루·3루 대칭. 앞에 불펜(world/pen.js) */
  function rchain(side,cols){
    var p0=side*OF.START*D,c0=ofLip(p0),w=cols*SP+AIS+1.2+.5,lo=Math.abs(p0),hi=lo+40*D;
    for(var i=0;i<50;i++){var m=(lo+hi)/2,c=ofLip(side*m);if(Math.hypot(c[0]-c0[0],c[1]-c0[1])<w)lo=m;else hi=m}
    var c1=ofLip(side*(lo+hi)/2),mx=(c0[0]+c1[0])/2,mz=(c0[1]+c1[1])/2,dx=c1[0]-c0[0],dz=c1[1]-c0[1],L=Math.hypot(dx,dz),n=ofOut(mx,mz,-dz/L,dx/L);
    return {s:{t:'corner',cols:cols},c0:c0,c1:c1,mx:mx,mz:mz,n:n,theta:Math.atan2(n[0],n[1])};
  }
  [[1,OF.right],[-1,OF.left]].forEach(function(e){
    var ks=chain(e[0],e[1]),cn=rchain(e[0],OF.cornerCols);
    ks.forEach(place);place(cn);
    OF.corner[e[0]]={x:cn.mx+cn.n[0]*1.9,z:cn.mz+cn.n[1]*1.9,theta:cn.theta,n:cn.n};
    wedge(cn.c0,cn.n,ks[0].n);
    wedge(cn.c1,[e[0]*.7071,.7071],cn.n);/* 내야 연장 끝 블록(stands.js)과 모서리 블록 사이 뒤쪽으로 벌어지는 쐐기: 계단 + 줄마다 좌석·관중(여난부두 불빛도 crowdSpots·decorSeats로 따라감) */
    for(var i=0;i<ks.length-1;i++)wedge(ks[i].c1,ks[i].n,ks[i+1].n);
  });
  scene.add(new THREE.Mesh(mergeParts(wedges),MVC));
})();
