/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= stands ================= */
var SP=.8,RD=1.15,RH=.5,AIS=1.4;
var blocks=[],decorSeats=[],crowdSpots=[];
function pos1B(s,o,side){side=side||1;return [side*(s*.7071+o*.7071),-s*.7071+o*.7071]}
/* 4인 테이블석 배치 (홈 뒤 곡면 스탠드, 작은 패치 AI): 한 줄의 좌석 n개를 4개씩 묶어 테이블 하나씩. 남는 1~3개는 2인·1인 테이블.
   3개가 남으면 2 + 1(양 끝에 하나씩), 1·2개면 한쪽 끝에 하나. 테이블 사이는 TBGAP만큼 띄움. 반환: xs(좌석 x), groups(테이블마다 가운데 x·폭) */
var TBGAP=.22;
function tbLayout(n){
  var G=Math.floor(n/4),rm=n%4,sz=[],i;if(rm===3)sz.push(2);for(i=0;i<G;i++)sz.push(4);if(rm===3)sz.push(1);else if(rm)sz.push(rm);
  var total=n*SP+Math.max(0,sz.length-1)*TBGAP,x=-total/2,xs=[],groups=[];
  sz.forEach(function(k){var x0=x;for(var j=0;j<k;j++){xs.push(x+SP/2);x+=SP}groups.push({n:k,xc:(x0+x)/2,w:k*SP-.08});x+=TBGAP});
  return {xs:xs,groups:groups,total:total};
}
/* 테이블 하나(상판 + 앞 가리개), 가운데 (x,y,z). 좌석 바닥에서 .78m 높이, 좌석 앞 .5m. rot는 Euler 회전([0,θ,0]) */
function tbParts(out,x,y,z,w,rot,fx,fz){
  out.push({g:Box(w,.05,.36),c:0x8b6a45,p:[x,y+.78,z],r:rot});
  out.push({g:Box(w,.2,.04),c:0x6b4f33,p:[x+fx*.16,y+.66,z+fz*.16],r:rot});
}
function buildBlock(cfg){
  var R=cfg.rows,C=cfg.cols,W=cfg.W||C*SP+AIS+1.2,base=cfg.base,sky=!!cfg.sky;/* sky: 땅에서 뜬 4층 스탠드(하룰라라석 쪽). 높이(base)와 따로 표시해서 base를 올려도 안 떠 보이게 (패치 AB) */
  var ul=0,ur=0,g=new THREE.Group();g.position.set(cfg.x,0,cfg.z);g.rotation.y=cfg.theta;scene.add(g);
  var bottom=sky?base-1.1:-.05,parts=[];
  parts.push({g:Box(W,base-bottom,1.9),c:0xdedad0,p:[0,(base+bottom)/2,-.95]});
  for(var r=0;r<R;r++){
    var top=base+r*RH;
    parts.push({g:Box(W,top-bottom,RD),c:r%2?0xe2ded3:0xd9d5c9,p:[0,(top+bottom)/2,r*RD+RD/2]});
    parts.push({g:Box(AIS,.03,.1),c:0xf0c43c,p:[0,top+.015,r*RD+.05]});
    [1,-1].forEach(function(s){var gap=cfg.open&&cfg.open[s>0?'r':'l'];
      if(gap)parts.push({g:Box(gap+.04,top-bottom,RD),c:r%2?0xe2ded3:0xd9d5c9,p:[s*(W/2+gap/2),(top+bottom)/2,r*RD+RD/2]});
      else parts.push({g:Box(.25,top-bottom+.9,RD),c:0xcbc5b7,p:[s*(W/2+.12),(top+.9+bottom)/2,r*RD+RD/2]})});
  }
  var lastTop=base+(R-1)*RH;
  /* 1층 블록(내야·으쓱이존·장식·홈 뒤 아래층)은 뒷벽을 2층 바닥 아랫면(FLOOR.sky-1.1)까지 올려요. 그 면에 띠 전광판이 붙고(world/ribbonline.js), 벽 위는 2층 앞까지 이어지는 복도 바닥이에요 (작은 패치 AH) */
  var tall=!sky&&!cfg.out&&!cfg.low&&base===FLOOR.inf,ex=tall?Math.max(0,FLOOR.sky-1.1-(lastTop+1.1)):0,wh=1.1+ex;
  parts.push({g:Box(W+.5,wh,.2),c:0xd2cbbd,p:[0,lastTop+wh/2,R*RD+.1]});parts.push({g:Box(W+.5,.06,.1),c:0x5b5f55,p:[0,lastTop+wh+.02,R*RD+.1]});
  if(!cfg.noRail)parts.push({g:Box(W,.07,.09),c:0x5b5f55,p:[0,base+1,-1.88]});/* noRail: 불펜 앞 블록은 앞 난간·유리가 없어요(광고띠·포스터 위로 지나가면 안 돼서, 작은 패치 AF) */
  /* 이어진 쪽: 앞 통로·뒷벽·난간도 틈만큼 이어 붙여요 */
  ['l','r'].forEach(function(k){var gap=cfg.open&&cfg.open[k];if(!gap)return;var s=k==='r'?1:-1,cx=s*(W/2+gap/2),gw=gap+.04;
    parts.push({g:Box(gw,base-bottom,1.9),c:0xdedad0,p:[cx,(base+bottom)/2,-.95]});
    parts.push({g:Box(gw,wh,.2),c:0xd2cbbd,p:[cx,lastTop+wh/2,R*RD+.1]});if(!cfg.noRail)parts.push({g:Box(gw,.07,.09),c:0x5b5f55,p:[cx,base+1,-1.88]})});
  if(sky){
    /* 4층 아래는 기둥 대신 땅에서 4층 바닥까지 속이 꽉 찬 콘크리트 덩어리(건물 느낌, 작은 패치 AH). 양옆은 열린 틈(open)이나 cfg.pad만큼 더 채워 이웃과 이어요 */
    ul=(cfg.open&&cfg.open.l)||cfg.pad||0;ur=(cfg.open&&cfg.open.r)||cfg.pad||0;var uz0=-1.9-FLOOR.gap,uz1=R*RD+.2;
    parts.push({g:Box(W+ul+ur,bottom+.05,uz1-uz0),c:0xd6d1c4,p:[(ur-ul)/2,(bottom-.05)/2,(uz0+uz1)/2]});
    parts.push({g:Box(W+.6,.25,R*RD*.62),c:0xf4f2ec,p:[0,lastTop+5.2,R*RD*.72],r:[-.08,0,0]});
    parts.push({g:Box(.3,4,.3),c:0xbfb8aa,p:[-W/2+.4,lastTop+3,R*RD-.2]});
    parts.push({g:Box(.3,4,.3),c:0xbfb8aa,p:[W/2-.4,lastTop+3,R*RD-.2]});
  }
  /* 4인 테이블석(cfg.table, 홈 뒤 곡면 스탠드): 줄마다 4개씩 묶어 테이블을 하나씩 (작은 패치 AI). 좌석은 통로 없이 TBGAP만 띄워 놓아요 */
  var TB=cfg.table?tbLayout(C):null;
  if(TB)for(var tr=0;tr<R;tr++)TB.groups.forEach(function(gp){tbParts(parts,gp.xc,base+tr*RH,tr*RD+RD*.64-.5,gp.w,[0,0,0],0,-1)});
  var terrace=new THREE.Mesh(mergeParts(parts),MVC);g.add(terrace);
  var OL=cfg.open&&cfg.open.l||0,OR=cfg.open&&cfg.open.r||0,GW=W+OL+OR;
  var glass=new THREE.Mesh(Box(GW,.95,.04),new THREE.MeshLambertMaterial({color:0xd5ecf2,transparent:true,opacity:.32,depthWrite:false}));glass.position.set((OR-OL)/2,base+.5,-1.9);if(!cfg.noRail)g.add(glass);
  var seats=[];
  for(r=0;r<R;r++)for(var c=0;c<C;c++){
    var x=TB?TB.xs[c]:(c-(C-1)/2)*SP+(c<C/2?-AIS/2:AIS/2);
    seats.push({r:r,c:c,x:x,z:r*RD+RD*.64,y:base+r*RH,occ:null,crowd:-1});
  }
  g.updateMatrixWorld(true);
  var blk={cfg:cfg,g:g,W:W,R:R,C:C,base:base,sky:sky,under:sky?{y1:bottom,x0:-W/2-ul,x1:W/2+ur,z0:-1.9-FLOOR.gap,z1:R*RD+.2}:null,ribbon:tall?{w:W,y:lastTop+wh-.5,z:R*RD-.02,y0:lastTop,y1:lastTop+wh}:null,seats:seats,terrace:terrace,key:cfg.key||null};
  blk.dim=!cfg.out;/* 밤 경기에서 살짝 어둡게 할 블록(내야·으쓱이존·하룰라라석·홈 뒤). 외야(cfg.out)는 밝게 — world/nightdim.js (작은 패치 M) */
  blk.groundH=function(lz){return base+(lz<0?0:Math.min(Math.floor(lz/RD),R-1)*RH)};
  blk.xMin=cfg.reach?cfg.reach[0]:-W/2+.45;blk.xMax=cfg.reach?cfg.reach[1]:W/2-.45;blk.links=[];
  blk.clampX=function(lx){return clamp(lx,blk.xMin,blk.xMax)};
  blk.clampZ=function(lz){return clamp(lz,-1.55,R*RD-.35)};
  terrace.userData.block=blk;
  seats.forEach(function(s){
    s.block=blk;
    if(!(cfg.empty&&cfg.empty(s))&&Math.random()<(cfg.occ||.62)){s.crowd=crowdSpots.length;crowdSpots.push({blk:blk,seat:s})}
  });
  if(cfg.key){
    var sm=new THREE.InstancedMesh(SEATGEO,new THREE.MeshLambertMaterial({color:cfg.seat}),seats.length);
    var mm=new THREE.Matrix4();
    seats.forEach(function(s,i){mm.makeTranslation(s.x,s.y,s.z);sm.setMatrixAt(i,mm)});
    sm.userData.block=blk;g.add(sm);blk.seatMesh=sm;
  }else{
    seats.forEach(function(s){decorSeats.push({blk:blk,s:s,col:cfg.seat})});
  }
  blocks.push(blk);
  return blk;
}
var SEATGEO=mergeParts([{g:Box(.6,.09,.48),c:0xffffff,p:[0,.42,0]},{g:Box(.6,.52,.08),c:0xffffff,p:[0,.7,.25],r:[-.12,0,0]},{g:Box(.08,.4,.08),c:0xb8b8b8,p:[0,.2,.05]}]);
SEATGEO.deleteAttribute('color');

var ZB={};
(function(){
  var p;
  p=pos1B(34,14);ZB.ussk=buildBlock({key:'ussk',x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.inf,rows:9,cols:14,seat:0xc8102e,occ:.58});
  p=pos1B(20,14);ZB.infield=buildBlock({key:'infield',x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.inf,rows:9,cols:14,seat:0x2f6e50,occ:.6,open:{l:.2},reach:[-14-6.9+.45,6.9-.45]});
  p=pos1B(22,29);ZB.harulala=buildBlock({key:'harulala',x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.sky,sky:true,rows:8,cols:14,seat:0x34548a,occ:.5,open:{l:2.2,r:2.2},reach:[-16-6.9+.45,16+6.9-.45]});
  /* 외야(걷는 블록 ZB.outfield)·외야 장식 블록은 world/outfield.js가 담장 곡선을 따라 놓아요 */
  // decor
  /* 걸어서 이어지는 옆 블록 (하룰라라석 양옆, 내야 왼쪽) — 이어진 쪽 옆벽 없음 */
  p=pos1B(6,14);ZB.infield.links.push(buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.inf,rows:9,cols:14,seat:0x2f6e50,open:{r:.01}}));
  [48,62].forEach(function(s){p=pos1B(s,14);buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.inf,rows:9,cols:14,seat:pick([0x2f6e50,0xc8102e])})});
  /* 3루 쪽 1층: 1루와 좌우대칭. 3루 블록은 옆으로 돌아 있어 local +x가 홈 쪽이에요 → 홈 쪽 이웃(s-14)과 이어지는 틈은 r, 먼 쪽은 l (작은 패치 AI) */
  [6,20,34,48,62].forEach(function(s){p=pos1B(s,14,-1);var o=s===6?{l:.01}:s===20?{r:.2}:null,cf={x:p[0],z:p[1],theta:-Math.PI/4,base:FLOOR.inf,rows:9,cols:14,seat:0x2f6e50};if(o)cf.open=o;buildBlock(cf)});
  /* 내야 연장(작은 패치 W, 2026-11-04): 내야석 끝에서 폴 쪽 모서리 블록(outfield.js의 OF.corner)까지 장식 블록 두 칸(폭 14칸 + 좁은 6칸). 1루·3루 대칭. 걷기·앉기 X, 가운데 조명탑과 겹치지 않는 자리 */
  [[76,14],[86.9,6]].forEach(function(e){[1,-1].forEach(function(sd){p=pos1B(e[0],14,sd);buildBlock({low:true,x:p[0],z:p[1],theta:sd*Math.PI/4,base:FLOOR.inf,rows:9,cols:e[1],seat:pick([0x2f6e50,0xc8102e])})})});
  buildBlock({x:0,z:17,theta:0,base:FLOOR.inf,rows:9,cols:14,seat:0x34548a});
  buildBlock({x:0,z:30.5,theta:0,base:FLOOR.sky,sky:true,rows:8,cols:14,seat:0x34548a});
  p=pos1B(6,29);ZB.harulala.links.push(buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.sky,sky:true,rows:8,cols:14,seat:0x34548a,occ:.45,open:{r:.01}}));
  p=pos1B(38,29);ZB.harulala.links.push(buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.sky,sky:true,rows:8,cols:14,seat:0x34548a,occ:.45,open:{l:.01}}));
  p=pos1B(52,29);buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:FLOOR.sky,sky:true,rows:8,cols:14,seat:0x34548a,occ:.45});
  /* 3루 쪽 2층: 1루와 똑같이 틈 없이 쭉 이어지게(작은 패치 AI). 3루 블록은 local +x가 홈 쪽이라 1루의 l·r이 거꾸로예요 */
  [6,22,38,52].forEach(function(s){p=pos1B(s,29,-1);var o=s===6?{l:.01}:s===22?{l:2.2,r:2.2}:s===38?{r:.01}:null,cf={x:p[0],z:p[1],theta:-Math.PI/4,base:FLOOR.sky,sky:true,rows:8,cols:14,seat:0x34548a,occ:s===22?.5:.45};if(o)cf.open=o;buildBlock(cf)});
})();
/* cheer stage near 으쓱이존 */
var stageG=new THREE.Group();
(function(){var p=pos1B(34,8.6);stageG.position.set(p[0],0,p[1]);stageG.rotation.y=Math.PI/4;scene.add(stageG);
  var sy=STAGE_DY;/* 1층이 올라간 만큼 단상도 같이 (작은 패치 AH). 몸통은 땅에서 윗면까지 꽉 차게 */
  stageG.add(new THREE.Mesh(mergeParts([{g:Box(4.4,1.4+sy,2.6),c:0xc8102e,p:[0,(1.4+sy)/2,0]},{g:Box(4.6,.12,2.8),c:0xf4f2ec,p:[0,1.46+sy,0]},{g:Box(4.4,.06,.06),c:0xf4f2ec,p:[0,2.4+sy,-1.3]},{g:Box(.06,1,.06),c:0xf4f2ec,p:[-2.17,1.95+sy,-1.3]},{g:Box(.06,1,.06),c:0xf4f2ec,p:[2.17,1.95+sy,-1.3]}]),MVC));
})();
