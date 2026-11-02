/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 홈 뒤 곡면 스탠드 (작은 패치 K, 2026-11-02) =================
   홈 뒤 가운데 테이블석(걷기 없는 장식 블록 2개) 양옆의 빈 틈을, 각도를 조금씩 꺾은 장식 블록으로 이어서 둥글게 감싸요.
   · 가운데 블록과 걷는 구역(내야·외야·으쓱이존·하룰라라)·이어진 블록은 건드리지 않아요. 새 블록은 전부 key 없는 장식이에요.
   · 위층(높이 3m 이상) 새 블록에는 stands.js가 띠 전광판을 자동으로 붙여요 → 양옆 띠와 이어진 한 줄처럼 보여요.
   · 블록 사이 벌어진 쐐기 틈은 계단 모양 콘크리트로 메워요(눌러지거나 걷는 곳이 아니에요).
   · 반드시 stands.js 다음, crowd.js 앞에서 불려야 해요(관중이 새 블록에도 앉도록). index.html에서 outskirts.js 바로 아래에 둬요. */
var CVS={
  half:6.9,        // 가운데 블록 반폭(14칸 블록 폭 13.8m의 절반)
  cols:6,          // 채움 블록 칸 수(폭 7.4m)
  seat:0x34548a,   // 가운데 블록과 같은 파랑
  levels:[
    {base:.6,  rows:9, zf:15.1, th:[22],    occ:.55},  // 아래층: zf=가운데 블록 앞줄의 z, th=꺾는 각도(도)
    {base:13.5,rows:8, zf:28.6, th:[15,30], occ:.45}   // 위층(띠 전광판 붙음)
  ]
};
(function(){
  var rep0=ledTex.repeat.x,rad=Math.PI/180,WD=CVS.cols*SP+AIS+1.2,wedges=[];
  // 이전 블록 옆면과 다음 블록 옆면 사이를 계단 모양으로 메워요 (H=이음 꼭짓점, up/un=이전·다음 블록이 뒤로 뻗는 방향)
  function wedge(L,Hx,Hz,up,un){
    var bottom=L.base>3?L.base-1.1:-.05,t=0,steps=[[0,1.9,L.base,0xdedad0]];
    for(var r=0;r<L.rows;r++)steps.push([1.9+r*RD,1.9+(r+1)*RD,L.base+r*RH,r%2?0xe2ded3:0xd9d5c9]);
    steps.forEach(function(s){
      var P=[[Hx+s[0]*up[0],Hz+s[0]*up[1]],[Hx+s[1]*up[0],Hz+s[1]*up[1]],[Hx+s[1]*un[0],Hz+s[1]*un[1]],[Hx+s[0]*un[0],Hz+s[0]*un[1]]];
      var sh=new THREE.Shape();P.forEach(function(p,i){i?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1])});
      var g=new THREE.ExtrudeGeometry(sh,{depth:s[2]-bottom,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,bottom,0);
      wedges.push({g:g,c:s[3]})});
  }
  CVS.levels.forEach(function(L){
    [1,-1].forEach(function(side){
      var Hx=side*CVS.half,Hz=L.zf,prev=0;
      L.th.forEach(function(deg){
        var th=deg*rad,d=[side*Math.cos(th),-Math.sin(th)],un=[side*Math.sin(th),Math.cos(th)],up=[side*Math.sin(prev),Math.cos(prev)];
        wedge(L,Hx,Hz,up,un);
        // 새 블록: 앞줄 중앙 F = H + (폭/2)*d, 블록 기준점 p = F + 1.9*(뒤쪽 방향)
        var Fx=Hx+WD/2*d[0],Fz=Hz+WD/2*d[1];
        buildBlock({x:Fx+1.9*un[0],z:Fz+1.9*un[1],theta:side*th,base:L.base,rows:L.rows,cols:CVS.cols,seat:CVS.seat,occ:L.occ});
        Hx+=WD*d[0];Hz+=WD*d[1];prev=th;
      });
    });
  });
  scene.add(new THREE.Mesh(mergeParts(wedges),MVC));
  ledTex.repeat.set(rep0,1);   // 좁은 블록이 띠 그림 비율을 바꿔 놓은 걸 되돌려요(기존 띠 글자가 안 찌그러지게)
})();
