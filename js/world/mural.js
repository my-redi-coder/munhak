/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 4층 아래 벽 벽화 (작은 패치 AH, 2026-11-09) =================
   1층 뒷벽 위 ~ 4층(하룰라라석) 바닥 사이의 벽(stands.js의 blk.under 앞면, 구장 안쪽 면만)에 의자·관중·계단 통로·통로 입구를 그려서
   1층 관중석이 4층까지 이어진 것처럼 보이게 해요. 바깥쪽 면은 그림 없이 콘크리트 그대로예요.
   - 의자 0.8m, 줄 0.5m(stands.js의 SP·RH와 같은 크기), 관중은 늘 꽉 참(MURAL.fill)
   - 칸마다 그림 3가지를 돌려 써서 입구가 있는 칸·없는 칸이 섞여요(MURAL.kinds: 입구가 몇 번째 통로에 있는지, -1이면 입구 없음)
   - 숫자는 아래 MURAL 한 곳. 그림은 칸 폭 13.8m 기준 한 장이고, 더 넓은 칸은 옆으로 이어 붙여요.
   - stands.js의 buildBlock이 sky 블록마다 muralMake(blk)를 불러요 → 이 파일은 stands.js보다 먼저 불려야 해요(stadium.html).
   - 밤 경기 어둡기는 nightdim.js가 blk.muralMat을 같이 어둡게 해요. */
var MURAL={w:13.8,h:5.0,top:12.4,px:[552,200],fill:.97,kinds:[0,-1,1,-1],n:0,tex:[],
  aisles:[4,12],cols:17,rows:10,chair:'#34548a'};
function muralRng(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function muralSitter(x,cx,y,s,col,arms,r){
  if(arms){x.strokeStyle=col;x.lineWidth=s*.34;x.lineCap='round';x.beginPath();
    x.moveTo(cx-s*.5,y+s*.9);x.lineTo(cx-s*.85,y-s*.5);x.moveTo(cx+s*.5,y+s*.9);x.lineTo(cx+s*.85,y-s*.5);x.stroke();
    x.fillStyle='#f0d2b0';x.beginPath();x.arc(cx-s*.85,y-s*.6,s*.2,0,7);x.arc(cx+s*.85,y-s*.6,s*.2,0,7);x.fill()}
  x.fillStyle=col;x.beginPath();x.rect(cx-s*.62,y+s*.55,s*1.24,s*1.1);x.fill();
  x.fillStyle='#f0d2b0';x.beginPath();x.arc(cx,y+s*.2,s*.48,0,7);x.fill();
  x.fillStyle=(r()<.5)?'#3a2a22':'#5a3b2c';x.beginPath();x.arc(cx,y+s*.12,s*.5,Math.PI,0);x.fill();
  if(col!=='#f4f2ec'&&r()<.5){x.fillStyle=col;x.beginPath();x.arc(cx,y+s*.08,s*.52,Math.PI,0);x.fill();x.fillRect(cx-s*.52,y+s*.06,s*1.04,s*.1)}
}
/* kind: 입구가 있는 통로 번호(0·1), -1이면 입구 없음 */
function muralDraw(x,w,h,kind,seed){
  var r=muralRng(seed),rows=MURAL.rows,cols=MURAL.cols,rowH=h/rows,cw=w/cols,A=MURAL.aisles;
  var pal=['#c8102e','#c8102e','#c8102e','#2f6e50','#2f6e50','#34548a','#f4f2ec'];
  var inA=function(i){return A.some(function(a){return i>=a&&i<a+2})};
  x.fillStyle='#bdb8a8';x.fillRect(0,0,w,h);
  for(var j=0;j<rows;j++){
    var y=j*rowH;x.fillStyle=(j%2)?'#d6d1c3':'#cfcabb';x.fillRect(0,y+rowH*.55,w,rowH*.5);
    for(var i=0;i<cols;i++){if(inA(i))continue;var cx=(i+.5)*cw;
      x.fillStyle=MURAL.chair;x.fillRect(cx-cw*.4,y+rowH*.1,cw*.8,rowH*.86);
      if(r()<MURAL.fill)muralSitter(x,cx,y-rowH*.18,cw*.4,pal[Math.floor(r()*pal.length)],r()<.2,r)}
  }
  A.forEach(function(a,k){var ax=a*cw,aw=cw*2;
    x.fillStyle='#e4e0d2';x.fillRect(ax,0,aw,h);
    for(var j=0;j<=rows;j++){x.fillStyle='rgba(0,0,0,.14)';x.fillRect(ax,j*rowH-1,aw,2)}
    x.fillStyle='#8d8b82';x.fillRect(ax-1,0,3,h);x.fillRect(ax+aw-2,0,3,h);
    if(k!==kind)return;
    var oy=rowH*3.5,oh=rowH*3.4;                                  /* 통로 입구: 어두운 네모 + 위 난간 + 비스듬한 난간 */
    x.fillStyle='#d9d5c6';x.fillRect(ax-cw*.45,oy-rowH*.6,aw+cw*.9,oh+rowH*.6);
    x.fillStyle='#1f1d1a';x.fillRect(ax+3,oy,aw-6,oh);
    var g=x.createLinearGradient(0,oy,0,oy+oh);g.addColorStop(0,'rgba(90,70,40,0)');g.addColorStop(1,'rgba(255,200,110,.4)');x.fillStyle=g;x.fillRect(ax+3,oy,aw-6,oh);
    x.strokeStyle='#8d8b82';x.lineWidth=3;x.beginPath();x.moveTo(ax-cw*.45,oy-rowH*.6);x.lineTo(ax+aw+cw*.45,oy-rowH*.6);
    x.moveTo(ax-cw*.45,oy-rowH*.6);x.lineTo(ax-cw*1.1,oy+oh);x.moveTo(ax+aw+cw*.45,oy-rowH*.6);x.lineTo(ax+aw+cw*1.1,oy+oh);x.stroke();
  });
}
function muralBase(v){
  if(!MURAL.tex[v]){var P=MURAL.px,c=document.createElement('canvas');c.width=P[0];c.height=P[1];muralDraw(c.getContext('2d'),P[0],P[1],MURAL.kinds[v],17+v*31);
    var t=new THREE.CanvasTexture(c);t.anisotropy=maxAniso;MURAL.tex[v]=t}
  return MURAL.tex[v];
}
/* 하룰라라석(sky) 블록의 구장 쪽 아래벽 앞면에 그림 판을 붙여요. blk.under는 stands.js가 알려 줘요 */
function muralMake(blk){
  var u=blk.under;if(!u)return;
  var uw=u.x1-u.x0,v=MURAL.n++%MURAL.kinds.length,t=muralBase(v).clone();t.needsUpdate=true;
  var rep=renderer.capabilities.isWebGL2;                         /* 오래된 WebGL1은 2의 거듭제곱이 아닌 그림을 반복 못 해서, 그땐 늘려서 붙여요 */
  if(rep){t.wrapS=THREE.RepeatWrapping;t.repeat.set(uw/MURAL.w,1)}
  var m=new THREE.MeshLambertMaterial({map:t});blk.muralMat=m;
  var p=new THREE.Mesh(new THREE.PlaneGeometry(uw,MURAL.h),m);
  p.rotation.y=Math.PI;p.position.set((u.x0+u.x1)/2,u.y1-MURAL.h/2,u.z0-.02);   /* 앞면(-z)을 보게, 4층 바닥(12.4)에서 아래로 */
  blk.g.add(p);
}
