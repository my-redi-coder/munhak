/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 홈 뒤 곡면 스탠드 (작은 패치 K, 2차) =================
   홈 뒤 가운데의 일자 테이블석 블록 2개(걷기 없는 장식)를 치우고, 같은 자리에 부채꼴로 퍼지는 장식 블록을 세워요.
   · 호의 양 끝은 양옆 대각선 블록의 홈 쪽 끝에 딱 맞게 이어져요(대각선 블록·걷는 구역·이어진 블록은 그대로).
   · 블록은 호의 중심(홈 뒤쪽 한 점)에서 바깥으로 방사형으로 뻗어서, 뒤쪽으로 갈수록 벌어지는 틈은 계단 콘크리트로 메워요.
   · 위층(높이 3m 이상) 새 블록에는 stands.js가 띠 전광판을 자동으로 붙여요 → 양옆 띠와 한 줄로 이어져요.
   · 반드시 stands.js 다음, crowd.js 앞에서 불려야 해요(관중이 새 블록에 앉도록). index.html에서 outskirts.js 바로 아래에 둬요. */
var CVS={
  seat:0x34548a,   // 가운데 블록과 같은 파랑
  levels:[         // o=대각선 블록이 놓인 거리(stands.js의 pos1B 두 번째 값), n=호를 나누는 블록 수
    {base:.6,  rows:9, o:14, n:3, occ:.55},   // 아래층
    {base:13.5,rows:8, o:29, n:5, occ:.45}    // 위층(띠 전광판 붙음)
  ],
  wedges:[]        // 블록 사이 쐐기 틈 {H 이음 꼭짓점, up·un 양쪽 뒤로 뻗는 방향, base, rows} — 아래에서 채워요
};
(function(){
  var S=.7071,rep0=ledTex.repeat.x,rad=Math.PI/180,wedges=[];
  /* 1. 예전 홈 뒤 가운데 장식 블록 2개 치우기 (관중·장식 의자도 같이: crowd.js가 읽기 전이라 안전해요) */
  var old=blocks.filter(function(b){return !b.key&&b.cfg.x===0&&b.cfg.theta===0&&(b.cfg.z===17||b.cfg.z===30.5)});
  old.forEach(function(b){scene.remove(b.g);blocks.splice(blocks.indexOf(b),1)});
  var kc=crowdSpots.filter(function(c){return old.indexOf(c.blk)<0});crowdSpots.length=0;
  kc.forEach(function(c,i){c.seat.crowd=i;crowdSpots.push(c)});
  var kd=decorSeats.filter(function(d){return old.indexOf(d.blk)<0});decorSeats.length=0;kd.forEach(function(d){decorSeats.push(d)});

  /* 2. 이웃 블록 사이 벌어진 틈을 계단 콘크리트로 메우기 (H=이음 꼭짓점, up/un=양쪽 블록이 뒤로 뻗는 방향) */
  function wedge(L,H,up,un){
    CVS.wedges.push({H:H,up:up,un:un,base:L.base,rows:L.rows});   // 여난부두 불빛이 이 틈에도 켜져요(events/yeonan.js)
    var bottom=L.base>3?L.base-1.1:-.05,steps=[[0,1.9,L.base,0xdedad0]];
    for(var r=0;r<L.rows;r++)steps.push([1.9+r*RD,1.9+(r+1)*RD,L.base+r*RH,r%2?0xe2ded3:0xd9d5c9]);
    steps.forEach(function(s){
      var P=[[H[0]+s[0]*up[0],H[1]+s[0]*up[1]],[H[0]+s[1]*up[0],H[1]+s[1]*up[1]],[H[0]+s[1]*un[0],H[1]+s[1]*un[1]],[H[0]+s[0]*un[0],H[1]+s[0]*un[1]]];
      var sh=new THREE.Shape();P.forEach(function(p,i){i?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1])});
      var g=new THREE.ExtrudeGeometry(sh,{depth:s[2]-bottom,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,bottom,0);
      wedges.push({g:g,c:s[3]})});
  }

  /* 3. 층마다 부채꼴 만들기: 대각선 블록 앞줄이 놓인 직선에 딱 닿는 원(중심 (0,zc), 반지름 r)을 그리고, 그 위에 블록을 놓아요 */
  CVS.levels.forEach(function(L){
    var xd=(6+L.o-1.9-6.9)*S,           // 대각선 블록 앞줄의 홈 쪽 끝 x (stands.js의 s=6 이어진 블록 기준)
        r=xd/S,zc=(L.o-1.9-r)/S,         // 호가 대각선 앞줄에 접하는 원
        seg=90/L.n,chord=2*r*Math.sin(seg/2*rad),
        cols=Math.max(2,Math.round((chord-AIS-1.2)/SP)),W=cols*SP+AIS+1.2,rc=Math.sqrt(r*r-W*W/4),ends=[];
    for(var k=0;k<L.n;k++){
      var phi=(-45+seg*(k+.5))*rad,u=[Math.sin(phi),Math.cos(phi)],d=[Math.cos(phi),-Math.sin(phi)],
          F=[rc*u[0],zc+rc*u[1]];                                   // 앞줄 중앙
      buildBlock({x:F[0]+1.9*u[0],z:F[1]+1.9*u[1],theta:phi,base:L.base,rows:L.rows,cols:cols,seat:CVS.seat,occ:L.occ});
      ends.push({u:u,l:[F[0]-W/2*d[0],F[1]-W/2*d[1]],r:[F[0]+W/2*d[0],F[1]+W/2*d[1]]});
    }
    wedge(L,ends[0].l,[-S,S],ends[0].u);                              // 3루 쪽 끝: 대각선 블록과 이어짐
    wedge(L,ends[L.n-1].r,ends[L.n-1].u,[S,S]);                       // 1루 쪽 끝
    for(k=0;k<L.n-1;k++)wedge(L,[(ends[k].r[0]+ends[k+1].l[0])/2,(ends[k].r[1]+ends[k+1].l[1])/2],ends[k].u,ends[k+1].u);
  });
  scene.add(new THREE.Mesh(mergeParts(wedges),MVC));
  ledTex.repeat.set(rep0,1);   // 좁은 블록이 띠 그림 비율을 바꿔 놓은 걸 되돌려요(기존 띠 글자가 안 찌그러지게)
})();
