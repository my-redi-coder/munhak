/* ================= ballplayer (그라운드 선수) =================
   으쓱이와 같은 둥근 인상이지만 키가 크고 등이 넓은 체형.
   몸통 뒤쪽은 납작한 타원이라 등판(이름·번호) 자리가 넉넉해요.
   평소엔 등판을 숨기고, 이벤트 때 setBack(이름, 번호)로 켜요.
   앞쪽 +z, 왼쪽 +x (A쪽 팔·다리), 오른쪽 −x (B쪽, 던지는 팔). */
var BP={hip:.92,L1:.44,L2:.46,TW:1.18,TD:.8,wood:0xd9b27c,glove:0x6b4128,shoe:0x26262b,gear:0x2b3140};
var BPGEO={};
function bpGeo(tk){
  if(BPGEO[tk])return BPGEO[tk];var t=TEAMS[tk],g={};
  g.pelvis=mergeParts([{g:Cyl(.2,.19,.2,16),c:t.body,p:[0,.88,0],s:[BP.TW*.95,1,BP.TD]},{g:Cyl(.205,.205,.05,16),c:t.belt,p:[0,.97,0],s:[BP.TW*.95,1,BP.TD]}]);
  g.thigh=mergeParts([{g:Cyl(.1,.088,.46,10),c:t.body,p:[0,-.21,0]}]);
  g.shin=mergeParts([{g:Cyl(.088,.08,.12,10),c:t.body,p:[0,-.05,0]},{g:Cyl(.074,.066,.3,10),c:t.sock,p:[0,-.25,0]},{g:Box(.14,.07,.26),c:BP.shoe,p:[0,-.425,.05]}]);
  g.torso=mergeParts([{g:Cyl(.215,.2,.6,18),c:t.body,p:[0,.3,0],s:[BP.TW,1,BP.TD]},{g:Box(.022,.5,.02),c:t.trim,p:[0,.3,.168]},
    {g:Cyl(.06,.07,.14,10),c:SKIN,p:[0,.66,0]},{g:Cyl(.13,.215,.06,18,false),c:t.body,p:[0,.59,0],s:[BP.TW,1,BP.TD]}]);
  g.upper=mergeParts([{g:Cyl(.078,.072,.24,10),c:t.body,p:[0,-.11,0]},{g:Cyl(.075,.075,.025,10),c:t.trim,p:[0,-.225,0]}]);
  g.fore=mergeParts([{g:Cyl(.056,.05,.25,10),c:SKIN,p:[0,-.125,0]},{g:new THREE.SphereGeometry(.058,10,8),c:SKIN,p:[0,-.27,0]}]);
  g.head=mergeParts([{g:new THREE.SphereGeometry(.17,20,14),c:SKIN},
    {g:new THREE.SphereGeometry(.05,8,6),c:SKIN,p:[.168,0,0],s:[.5,1,.8]},{g:new THREE.SphereGeometry(.05,8,6),c:SKIN,p:[-.168,0,0],s:[.5,1,.8]}]);
  /* 눈 점은 따로: 표정 그림(entities/bpface.js)을 덮을 때 숨겨요 */
  g.eyes=mergeParts([{g:new THREE.SphereGeometry(.018,6,5),c:0x2b2320,p:[.06,0,.158]},{g:new THREE.SphereGeometry(.018,6,5),c:0x2b2320,p:[-.06,0,.158]}]);
  g.cap=mergeParts([{g:new THREE.SphereGeometry(.18,18,10,0,TAU,0,Math.PI*.5),c:t.cap,p:[0,.03,0]},{g:Cyl(.13,.13,.018,16,false,-Math.PI/2,Math.PI),c:t.cap,p:[0,.035,.13],s:[1,1,1.05]},{g:new THREE.SphereGeometry(.022,6,4),c:t.cap,p:[0,.21,0]}]);
  g.helmet=mergeParts([{g:new THREE.SphereGeometry(.195,18,12,0,TAU,0,Math.PI*.5),c:t.helmet,p:[0,.02,0]},{g:Cyl(.14,.14,.02,16,false,-Math.PI/2,Math.PI),c:t.helmet,p:[0,.02,.15]},{g:Cyl(.08,.08,.06,12),c:t.helmet,p:[-.17,-.04,0],r:[0,0,Math.PI/2]}]);
  g.mask=mergeParts([{g:new THREE.SphereGeometry(.19,16,10,0,TAU,0,Math.PI*.55),c:BP.gear,p:[0,.02,0]},{g:Box(.26,.24,.05),c:0x1a1d24,p:[0,-.03,.17]}]);
  g.chest=mergeParts([{g:Box(.42,.48,.08),c:BP.gear,p:[0,.3,.17]}]);
  g.shinGuard=mergeParts([{g:Box(.15,.34,.07),c:BP.gear,p:[0,-.2,.08]}]);
  g.glove=mergeParts([{g:new THREE.SphereGeometry(.1,10,8),c:BP.glove,s:[1,1.25,.55],p:[0,-.3,.03]}]);
  g.mitt=mergeParts([{g:new THREE.SphereGeometry(.14,12,8),c:BP.glove,s:[1,1,.55],p:[0,-.3,.04]}]);
  g.bat=mergeParts([{g:Cyl(.036,.016,.84,10),c:BP.wood,p:[0,.36,0]},{g:Cyl(.024,.024,.03,8),c:BP.wood,p:[0,-.07,0]}]);
  return BPGEO[tk]=g;
}
var BPBACK=new THREE.CylinderGeometry(.2198,.2068,.5,16,1,true,Math.PI-.95,1.9);
function bpBackTex(tk,name,num){var t=TEAMS[tk];return canvasTex(256,256,function(x,w,h){
  x.clearRect(0,0,w,h);x.textAlign='center';x.textBaseline='middle';x.fillStyle=t.ink;
  if(name){var n=String(name);x.font='bold '+(n.length>5?28:n.length>3?34:40)+'px '+KFONT;x.fillText(n,w/2,h*.2)}
  if(num!==''&&num!=null){x.font='900 '+Math.round(h*.5)+'px "Arial Black","Helvetica Neue",Arial,sans-serif';x.fillText(String(num),w/2,h*.6)}
})}

function Ballplayer(o){
  this.team=o.team;this.role=o.role;this.label=o.label||'';var G=bpGeo(o.team),self=this;this.meshes=[];
  var root=this.root=new THREE.Group(),body=this.body=new THREE.Group();root.add(body);root.scale.setScalar(PLAYER_SCALE);
  function add(par,geo,mat,p,r){var m=new THREE.Mesh(geo,mat||MVC);if(p)m.position.set(p[0],p[1],p[2]);if(r)m.rotation.set(r[0],r[1],r[2]);par.add(m);m.userData.bp=self;self.meshes.push(m);return m}
  function grp(par,x,y,z){var g=new THREE.Group();g.position.set(x,y,z);par.add(g);return g}
  add(body,G.pelvis);
  this.leg=[1,-1].map(function(s){var th=grp(body,s*.11,BP.hip,0);add(th,G.thigh);var sh=grp(th,0,-BP.L1,0);add(sh,G.shin);if(o.role==='C')add(sh,G.shinGuard);return {th:th,sh:sh}});
  var tor=this.torso=grp(body,0,.98,0);add(tor,G.torso);
  this.backMat=new THREE.MeshLambertMaterial({transparent:true,alphaTest:.35});
  this.back=add(tor,BPBACK,this.backMat,[0,.32,0]);this.back.scale.set(BP.TW,1,BP.TD);this.back.visible=false;
  if(o.role==='C')add(tor,G.chest);
  this.arm=[1,-1].map(function(s){var up=grp(tor,s*.27,.5,0);add(up,G.upper);var fo=grp(up,0,-.24,0);add(fo,G.fore);return {up:up,fo:fo}});
  var gear=o.role==='C'?G.mitt:G.glove;
  if(o.gear!=='none'&&o.gear!=='bat')add(this.arm[0].fo,gear,MVC,[0,0,0]);
  this.head=this.headG=grp(tor,0,.86,0);add(this.head,G.head);this.eyes=add(this.head,G.eyes);
  add(this.head,o.role==='C'?G.mask:o.gear==='bat'?G.helmet:G.cap);
  if(o.gear==='bat'){this.bat=grp(tor,-.08,.42,.2);add(this.bat,G.bat)}
  this.shadow=new THREE.Mesh(GEO.shadow,shadowMat);this.shadow.position.y=.02;this.shadow.scale.setScalar(1.1);root.add(this.shadow);
  this.cur=bpPose();this.t=Math.random()*10;
}
function bpPose(){return {tX:0,tY:0,tZ:0,hY:0,thA:0,knA:0,spA:.06,thB:0,knB:0,spB:-.06,uaX:0,uaY:0,uaZ:.1,faX:0,ubX:0,ubY:0,ubZ:-.1,fbX:0,bX:.6,bY:0,bZ:.3,rY:0}}
Ballplayer.prototype.setBack=function(name,num){if(this.backMat.map)this.backMat.map.dispose();this.backMat.map=bpBackTex(this.team,name,num);this.backMat.needsUpdate=true;this.back.visible=!!(name||(num!==''&&num!=null))};
Ballplayer.prototype.hideBack=function(){this.back.visible=false};
Ballplayer.prototype.apply=function(P,k,dt){
  var c=this.cur;for(var key in P)c[key]=k?damp(c[key],P[key],k,dt):P[key];
  var la=this.leg[0],lb=this.leg[1],aa=this.arm[0],ab=this.arm[1];
  la.th.rotation.set(c.thA,0,c.spA);la.sh.rotation.x=c.knA;lb.th.rotation.set(c.thB,0,c.spB);lb.sh.rotation.x=c.knB;
  this.torso.rotation.set(c.tX,c.tY,c.tZ);this.head.rotation.set(-c.tX*.7,c.hY,0);
  aa.up.rotation.set(c.uaX,c.uaY,c.uaZ);aa.fo.rotation.x=c.faX;ab.up.rotation.set(c.ubX,c.ubY,c.ubZ);ab.fo.rotation.x=c.fbX;
  if(this.bat)this.bat.rotation.set(c.bX,c.bY,c.bZ);
  var ext=function(th,kn,sp){return (BP.L1*Math.cos(th)+(BP.L2+.02)*Math.cos(th+kn))*Math.cos(sp)};
  this.body.position.y=Math.max(ext(c.thA,c.knA,c.spA),ext(c.thB,c.knB,c.spB))-BP.hip;this.body.rotation.y=c.rY;
};
Ballplayer.prototype.dispose=function(){if(this.root.parent)this.root.parent.remove(this.root);if(this.backMat.map)this.backMat.map.dispose();this.backMat.dispose()};
