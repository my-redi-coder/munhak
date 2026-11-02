/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 외야석: 담장 곡선을 따라 이어 붙이기 (작은 패치 L, 2026-11-02) =================
   · 담장(field.js의 fenceR, 타원)에서 OF.LIP m 뒤에 '앞 난간 곡선'을 긋고, 폴 쪽(OF.START도)부터 가운데로
     블록을 하나씩 '앞 모서리끼리 맞닿게' 놓아요. 블록은 홈이 아니라 담장 곡선을 정면으로 봐요(실제 구장처럼).
   · 블록 사이 뒤쪽으로 벌어지는 쐐기 틈은 계단으로 메우고, 줄마다 들어가는 만큼 좌석·관중을 앉혀요(보는 풍경, 걷기 X).
   · 순서: 오른쪽(1루) 바비큐존 → 걷는 외야(ZB.outfield) → 장식 / 왼쪽(3루) 작은 장식 → 현수막(ZB.hog) → 장식 → 장식.
     양쪽 길이를 맞춰 좌우가 거울처럼 같은 곡선에서 끝나요(가운데는 빅보드 앞이라 비움).
   · 걷기·앉기는 블록 안 좌표로만 돌아서, 블록이 돌고 옮겨져도 그대로 따라가요(input.js·movement.js 손대지 않음).
   · 숫자를 바꿀 땐 OF만 고치면 블록·쐐기·바비큐존(bbq.js의 OF.bbq)이 같이 움직여요.
   · stands.js 다음, greenzone.js·hogbanner.js·bbq.js·crowd.js 앞에서 불려야 해요. */
var OF={
  LIP:2.6,            // 담장 → 관중석 앞 난간 거리(m)
  START:46.5,         // 폴 쪽 첫 칸이 시작하는 각도(도). 폴은 45°
  base:1.6,rows:8,seat:0x6f9d45,
  right:[{t:'bbq',w:24},{t:'walk',cols:18},{t:'decor',cols:18}],
  left:[{t:'decor',cols:6},{t:'hog',cols:18},{t:'decor',cols:18},{t:'decor',cols:18}],
  bbq:null            // 바비큐존 자리 {x,z,theta} — bbq.js가 읽어요
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
    var cfg={x:x,z:z,theta:k.theta,base:OF.base,rows:OF.rows,cols:s.cols,seat:OF.seat,occ:s.t==='walk'?.6:.55};
    if(s.t==='walk')cfg.key='outfield';
    if(s.t==='hog')cfg.empty=function(){return true};
    var b=buildBlock(cfg);
    if(s.t==='walk')ZB.outfield=b;if(s.t==='hog')ZB.hog=b;
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
  [chain(1,OF.right),chain(-1,OF.left)].forEach(function(ks){
    ks.forEach(place);
    for(var i=0;i<ks.length-1;i++)wedge(ks[i].c1,ks[i].n,ks[i+1].n);
  });
  scene.add(new THREE.Mesh(mergeParts(wedges),MVC));
})();
