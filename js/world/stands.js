/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= stands ================= */
var SP=.8,RD=1.15,RH=.5,AIS=1.4;
/* (2026-11-02) 외야석 반지름 = 담장 반지름 + SOUT. 걷는 외야(+30°)는 이 값과 같아서(107.5+4.5=112) 그대로 둠. 바비큐존·그린존도 이 값에 맞춰요 */
var SOUT=4.5;function standR(a){return fenceR(a)+SOUT}
var blocks=[],decorSeats=[],crowdSpots=[];
function pos1B(s,o,side){side=side||1;return [side*(s*.7071+o*.7071),-s*.7071+o*.7071]}
function buildBlock(cfg){
  var R=cfg.rows,C=cfg.cols,W=C*SP+AIS+1.2,base=cfg.base;
  var g=new THREE.Group();g.position.set(cfg.x,0,cfg.z);g.rotation.y=cfg.theta;scene.add(g);
  var bottom=base>3?base-1.1:-.05,parts=[];
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
  parts.push({g:Box(W+.5,1.1,.2),c:0xd2cbbd,p:[0,lastTop+.55,R*RD+.1]});parts.push({g:Box(W+.5,.06,.1),c:0x5b5f55,p:[0,lastTop+1.12,R*RD+.1]});
  parts.push({g:Box(W,.07,.09),c:0x5b5f55,p:[0,base+1,-1.88]});
  /* 이어진 쪽: 앞 통로·뒷벽·난간도 틈만큼 이어 붙여요 */
  ['l','r'].forEach(function(k){var gap=cfg.open&&cfg.open[k];if(!gap)return;var s=k==='r'?1:-1,cx=s*(W/2+gap/2),gw=gap+.04;
    parts.push({g:Box(gw,base-bottom,1.9),c:0xdedad0,p:[cx,(base+bottom)/2,-.95]});
    parts.push({g:Box(gw,1.1,.2),c:0xd2cbbd,p:[cx,lastTop+.55,R*RD+.1]});parts.push({g:Box(gw,.07,.09),c:0x5b5f55,p:[cx,base+1,-1.88]})});
  if(base>3){
    parts.push({g:Cyl(.45,.45,base,10),c:0xbfb8aa,p:[-W/2+.6,base/2,R*RD-.6]});
    parts.push({g:Cyl(.45,.45,base,10),c:0xbfb8aa,p:[W/2-.6,base/2,R*RD-.6]});
    parts.push({g:Box(W+.6,.25,R*RD*.62),c:0xf4f2ec,p:[0,lastTop+5.2,R*RD*.72],r:[-.08,0,0]});
    parts.push({g:Box(.3,4,.3),c:0xbfb8aa,p:[-W/2+.4,lastTop+3,R*RD-.2]});
    parts.push({g:Box(.3,4,.3),c:0xbfb8aa,p:[W/2-.4,lastTop+3,R*RD-.2]});
  }
  var terrace=new THREE.Mesh(mergeParts(parts),MVC);g.add(terrace);
  var OL=cfg.open&&cfg.open.l||0,OR=cfg.open&&cfg.open.r||0,GW=W+OL+OR;
  var glass=new THREE.Mesh(Box(GW,.95,.04),new THREE.MeshLambertMaterial({color:0xd5ecf2,transparent:true,opacity:.32,depthWrite:false}));glass.position.set((OR-OL)/2,base+.5,-1.9);g.add(glass);
  if(base>3){var led=new THREE.Mesh(new THREE.PlaneGeometry(W,.9),ledMat);led.material.map.repeat.set(W/24,1);led.rotation.y=Math.PI;led.position.set(0,base-.6,-1.97);g.add(led)}
  var seats=[];
  for(r=0;r<R;r++)for(var c=0;c<C;c++){
    var x=(c-(C-1)/2)*SP+(c<C/2?-AIS/2:AIS/2);
    seats.push({r:r,c:c,x:x,z:r*RD+RD*.64,y:base+r*RH,occ:null,crowd:-1});
  }
  g.updateMatrixWorld(true);
  var blk={cfg:cfg,g:g,W:W,R:R,C:C,base:base,seats:seats,terrace:terrace,key:cfg.key||null};
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
  p=pos1B(34,14);ZB.ussk=buildBlock({key:'ussk',x:p[0],z:p[1],theta:Math.PI/4,base:.6,rows:9,cols:14,seat:0xc8102e,occ:.58});
  p=pos1B(20,14);ZB.infield=buildBlock({key:'infield',x:p[0],z:p[1],theta:Math.PI/4,base:.6,rows:9,cols:14,seat:0x2f6e50,occ:.6,open:{l:.2},reach:[-14-6.9+.45,6.9-.45]});
  p=pos1B(22,29);ZB.harulala=buildBlock({key:'harulala',x:p[0],z:p[1],theta:Math.PI/4,base:13.5,rows:8,cols:14,seat:0x34548a,occ:.5,open:{l:2.2,r:2.2},reach:[-16-6.9+.45,16+6.9-.45]});
  var ph=30*Math.PI/180,rr=112;ZB.outfield=buildBlock({key:'outfield',x:Math.sin(ph)*rr,z:-Math.cos(ph)*rr,theta:Math.PI-ph,base:1.6,rows:8,cols:18,seat:0x6f9d45,occ:.6});
  // decor
  /* 걸어서 이어지는 옆 블록 (하룰라라석 양옆, 내야 왼쪽) — 이어진 쪽 옆벽 없음 */
  p=pos1B(6,14);ZB.infield.links.push(buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:.6,rows:9,cols:14,seat:0x2f6e50,open:{r:.01}}));
  [48,62].forEach(function(s){p=pos1B(s,14);buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:.6,rows:9,cols:14,seat:pick([0x2f6e50,0xc8102e])})});
  [6,20,34,48,62].forEach(function(s){p=pos1B(s,14,-1);buildBlock({x:p[0],z:p[1],theta:-Math.PI/4,base:.6,rows:9,cols:14,seat:0x2f6e50})});
  buildBlock({x:0,z:17,theta:0,base:.6,rows:9,cols:14,seat:0x34548a});
  buildBlock({x:0,z:30.5,theta:0,base:13.5,rows:8,cols:14,seat:0x34548a});
  p=pos1B(6,29);ZB.harulala.links.push(buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:13.5,rows:8,cols:14,seat:0x34548a,occ:.45,open:{r:.01}}));
  p=pos1B(38,29);ZB.harulala.links.push(buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:13.5,rows:8,cols:14,seat:0x34548a,occ:.45,open:{l:.01}}));
  p=pos1B(52,29);buildBlock({x:p[0],z:p[1],theta:Math.PI/4,base:13.5,rows:8,cols:14,seat:0x34548a,occ:.45});
  [6,22,38,52].forEach(function(s){p=pos1B(s,29,-1);buildBlock({x:p[0],z:p[1],theta:-Math.PI/4,base:13.5,rows:8,cols:14,seat:0x34548a,occ:.45})});
  /* 가운데 ±10° 블록은 뺌(빅보드 앞을 비움). 반지름은 담장을 따라 standR */
[-40,-30,-20,20].forEach(function(d){var a=d*Math.PI/180,r=standR(a),b=buildBlock({x:Math.sin(a)*r,z:-Math.cos(a)*r,theta:Math.PI-a,base:1.6,rows:8,cols:18,seat:0x6f9d45,occ:.55,empty:d===-40?function(s){return true}:null});if(d===-40)ZB.hog=b});
})();
/* cheer stage near 으쓱이존 */
var stageG=new THREE.Group();
(function(){var p=pos1B(34,8.6);stageG.position.set(p[0],0,p[1]);stageG.rotation.y=Math.PI/4;scene.add(stageG);
  stageG.add(new THREE.Mesh(mergeParts([{g:Box(4.4,1.4,2.6),c:0xc8102e,p:[0,.7,0]},{g:Box(4.6,.12,2.8),c:0xf4f2ec,p:[0,1.46,0]},{g:Box(4.4,.06,.06),c:0xf4f2ec,p:[0,2.4,-1.3]},{g:Box(.06,1,.06),c:0xf4f2ec,p:[-2.17,1.95,-1.3]},{g:Box(.06,1,.06),c:0xf4f2ec,p:[2.17,1.95,-1.3]}]),MVC));
})();
