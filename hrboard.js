/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 포토존: 홈런기념판 =================
   외야 관중석 아래 인조잔디 벽. 금색 방패판(이름 머리판 + 숫자 타일 3칸 + 아래 HOMERUNS)과 왼쪽 마일스톤 판.
   숫자는 PZ_CFG.hr.base(538)에서 시작해 max(999)까지 올릴 수 있어요. 바뀐 자리 타일만 촤라락 넘어가요.
   100 단위를 넘길 때마다 마일스톤 판에 칸이 붙어요(600~900). 숫자는 이 기기에 저장(store 'pzHr'). */
var HRB={n:clamp(store.get('pzHr',PZ_CFG.hr.base),PZ_CFG.hr.base,PZ_CFG.hr.max),tiles:[],dig:[],board:null,boardW:0,miles:0,pulse:0};
var HRB_TILE={w:1,h:.92,gap:.05,y:2.75};

/* 숫자 타일 그림(0~9, 한 번만 만들어 둬요) */
function hrDigitMat(d){
  if(!HRB.dig[d])HRB.dig[d]=pzTexMat(canvasTex(256,236,function(x,w,h){
    var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#e3d69e');g.addColorStop(1,'#c9ba7c');x.fillStyle=g;x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=4;x.strokeRect(6,6,w-12,h-12);x.strokeStyle='rgba(90,70,30,.25)';x.strokeRect(12,12,w-24,h-24);
    x.textAlign='center';x.textBaseline='middle';x.font='900 178px "Arial Black", Impact, "Helvetica Neue", sans-serif';x.lineJoin='bevel';
    x.lineWidth=12;x.strokeStyle='#6c626c';x.strokeText(d,w/2,h/2+8);x.fillStyle='#9d929b';x.fillText(d,w/2,h/2+8);
  }));
  return HRB.dig[d];
}
var HRB_SIDE=null;
function hrTile(){if(!HRB_SIDE)HRB_SIDE=pzMat(0xb4a56a);var m=new THREE.Mesh(Box(HRB_TILE.w,HRB_TILE.h,.12),[HRB_SIDE,HRB_SIDE,HRB_SIDE,HRB_SIDE,hrDigitMat(0),HRB_SIDE]);var p=new THREE.Group();p.add(m);p.mesh=m;p.d=0;p.next=0;p.ft=-1;return p}
function hrSetTile(t,d){t.mesh.material[4]=hrDigitMat(d);t.d=d}

/* 금색 방패판: 머리판(이름) + 아래 뾰족판(HOMERUNS) */
function hrShield(g){
  var gold=function(x,w,h){var gr=x.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#e9cf7a');gr.addColorStop(.5,'#c9a24a');gr.addColorStop(1,'#e2c46c');return gr};
  var hs=new THREE.Shape();[[-1.42,.2],[-1.42,.8],[-1.08,1.12],[1.08,1.12],[1.42,.8],[1.42,.2]].forEach(function(p,i){i?hs.lineTo(p[0],p[1]):hs.moveTo(p[0],p[1])});
  var head=new THREE.Mesh(pzFlat(hs),pzTexMat(canvasTex(1024,330,function(x,w,h){
    x.fillStyle=gold(x,w,h);x.fillRect(0,0,w,h);
    x.fillStyle='#4b4744';x.beginPath();[[.04,.98],[.04,.3],[.2,.07],[.8,.07],[.96,.3],[.96,.98]].forEach(function(p,i){i?x.lineTo(p[0]*w,p[1]*h):x.moveTo(p[0]*w,p[1]*h)});x.fill();
    /* 왕관 */
    var cx=w/2,cy=h*.25;x.fillStyle='#e6c66d';x.beginPath();x.moveTo(cx-34,cy+16);x.lineTo(cx-38,cy-14);x.lineTo(cx-18,cy+2);x.lineTo(cx,cy-20);x.lineTo(cx+18,cy+2);x.lineTo(cx+38,cy-14);x.lineTo(cx+34,cy+16);x.fill();
    x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ead08a';
    x.font='700 84px Georgia, "Times New Roman", serif';x.fillText(PZ_CFG.hr.name,cx,h*.53);
    x.font='600 46px Georgia, "Times New Roman", serif';x.fillText(PZ_CFG.hr.sub,cx,h*.78);
  })));head.position.set(0,HRB_TILE.y+.26,.04);g.add(head);
  var bs=new THREE.Shape();[[-1.2,-.25],[1.2,-.25],[1.2,-.6],[0,-1.08],[-1.2,-.6]].forEach(function(p,i){i?bs.lineTo(p[0],p[1]):bs.moveTo(p[0],p[1])});
  var foot=new THREE.Mesh(pzFlat(bs),pzTexMat(canvasTex(1024,352,function(x,w,h){
    x.fillStyle=gold(x,w,h);x.fillRect(0,0,w,h);x.textAlign='center';x.textBaseline='middle';
    x.fillStyle='#8f7a8a';x.font='900 70px "Arial Black", Impact, sans-serif';x.fillText(PZ_CFG.hr.foot,w/2,h*.36);
    x.fillStyle='#7a6131';x.font='600 30px Georgia, serif';x.fillText(PZ_CFG.hr.rec,w/2,h*.56);
  })));foot.position.set(0,HRB_TILE.y,.04);g.add(foot);
  for(var i=0;i<3;i++){var t=hrTile();t.position.set((i-1)*(HRB_TILE.w+HRB_TILE.gap),HRB_TILE.y,.16);g.add(t);HRB.tiles.push(t)}
  hrShow(HRB.n,true);
}
/* 마일스톤 판: 지금 숫자에 맞게 칸 수가 정해져요 */
function hrMiles(n){var a=PZ_CFG.hr.miles.slice();for(var m=600;m<=900;m+=100)if(n>=m)a.push(m);return a}
function hrBoard(){
  var ms=hrMiles(HRB.n);if(HRB.board&&HRB.miles===ms.length)return;
  var g=PZ_SETS.hr.g,old=HRB.board;HRB.miles=ms.length;
  var cw=1.3,w=ms.length*cw+.3,h=1.18,tex=canvasTex(ms.length*260+60,236,function(x,W,H){
    var gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#75685f');gr.addColorStop(1,'#5d524b');x.fillStyle=gr;x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=3;x.strokeRect(6,6,W-12,H-12);
    ms.forEach(function(m,i){var cx=30+i*260+130,cy=H*.43,r=74;
      x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=4;x.beginPath();x.moveTo(cx,cy-r);x.lineTo(cx+r,cy);x.lineTo(cx,cy+r);x.lineTo(cx-r,cy);x.closePath();x.stroke();
      x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='900 '+(m<10?84:62)+'px "Arial Black", Impact, sans-serif';x.fillText(m,cx,cy+3);
      x.font='600 22px Georgia, serif';x.fillStyle='rgba(255,255,255,.8)';x.fillText('HOMERUN',cx,H*.88);
      if(i)x.fillStyle='rgba(255,255,255,.12)',x.fillRect(30+i*260-1,24,2,H-48)});
  });
  var b=new THREE.Group(),face=new THREE.Mesh(new THREE.PlaneGeometry(w,h),pzTexMat(tex)),edge=new THREE.Mesh(Box(w+.08,h+.08,.06),pzMat(0x3f3733));
  face.position.z=.035;b.add(edge);b.add(face);b.position.set(-2.4-w/2,HRB_TILE.y-.1,.05);g.add(b);
  if(old){g.remove(old);old.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material&&o.material.map)o.material.map.dispose()})}
  HRB.board=b;HRB.boardW=w;
}
/* 숫자 바꾸기: 바뀐 자리만 넘김 애니메이션 */
function hrShow(n,instant){
  var s=('00'+n).slice(-3);
  HRB.tiles.forEach(function(t,i){var d=+s[i];if(instant){hrSetTile(t,d);t.next=d;return}if(d!==t.next){t.next=d;if(t.ft<0||reduceMotion){t.ft=reduceMotion?.999:0}}});
}
function hrSetCount(n){
  n=clamp(Math.round(n),PZ_CFG.hr.base,PZ_CFG.hr.max);if(n===HRB.n)return false;
  var before=hrMiles(HRB.n).length;HRB.n=n;store.set('pzHr',n);hrShow(n);
  if(PZ_SETS.hr.g){var ms=hrMiles(n);if(ms.length!==before){hrBoard();if(ms.length>before)toast(PZ_CFG.newMile(ms[ms.length-1]),2600)}}
  if(n===PZ_CFG.hr.max){toast(PZ_CFG.full,3200);HRB.pulse=1}
  return true;
}
function hrTick(dt){
  HRB.tiles.forEach(function(t){
    if(t.ft<0)return;t.ft+=dt/.26;
    if(t.ft>=.5&&t.d!==t.next)hrSetTile(t,t.next);
    if(t.ft>=1){t.ft=t.d!==t.next?0:-1;t.rotation.x=0;return}
    t.rotation.x=t.ft<.5?t.ft*Math.PI:(t.ft-1)*Math.PI;
  });
  if(HRB.pulse>0){HRB.pulse=Math.max(0,HRB.pulse-dt*.8);var s=1+Math.sin(HRB.pulse*Math.PI*4)*.05*HRB.pulse,sg=PZ_SETS.hr.shield;sg.scale.set(s,s,1);sg.position.y=HRB_TILE.y*(1-s)}
}

PZ_SETS.hr={
  O:new THREE.Vector3(-150,0,380),g:null,T:new THREE.Vector3(.6,0,0),W:6.6,H:5,camY:1.5,lookY:2.35,
  standZ:1.25,standX:[-16,7],startX:2.25,panMax:3,pose:'pzShow',
  get panMin(){return -(2.4+HRB.boardW)},
  zoomMax:function(){return Math.max(1.6,(4+HRB.boardW)/this.W*1.15)},
  pointX:function(){return 0},
  build:function(){
    var g=this.g=new THREE.Group();g.position.copy(this.O);g.visible=false;
    /* 잔디벽 */
    var turf=pzNoiseTex(256,256,'#5e8a3c',{n:2600,c:['#4f7a31','#6f9c48','#3f6627','#7aa852'],s:[1,2,2,6]},[.5,.9],[24,2.4]);
    var wall=new THREE.Mesh(new THREE.PlaneGeometry(64,4.6),pzTexMat(turf));wall.position.set(-8,2.3,0);g.add(wall);
    var shade=canvasTex(8,128,function(x,w,h){var gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(0,0,0,.25)');gr.addColorStop(.25,'rgba(0,0,0,0)');gr.addColorStop(.85,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=gr;x.fillRect(0,0,w,h)});
    var sm=new THREE.Mesh(new THREE.PlaneGeometry(64,4.6),new THREE.MeshBasicMaterial({map:shade,transparent:true,depthWrite:false}));sm.position.set(-8,2.3,.01);g.add(sm);
    /* 벽 위: 덮개, 난간, 스피커, 관중석 경사 */
    var cap=new THREE.Mesh(Box(64,.18,.5),pzMat(0x9a9d97));cap.position.set(-8,4.68,-.15);g.add(cap);
    var postM=pzMat(0x6f9c8a);for(var px=-38;px<=22;px+=3.2){var po=new THREE.Mesh(Box(.07,1.25,.07),postM);po.position.set(px,5.35,-.2);g.add(po)}
    [5.1,5.5,5.9].forEach(function(y){var r=new THREE.Mesh(Box(64,.03,.03),pzMat(0x8fa39a));r.position.set(-8,y,-.2);g.add(r)});
    [-11,-3.5,4.5].forEach(function(x){var sp=new THREE.Mesh(Box(.55,.6,.45),pzMat(0x222222));sp.position.set(x,5.1,-.35);g.add(sp)});
    var seats=canvasTex(64,256,function(x,w,h){x.fillStyle='#b8bcbf';x.fillRect(0,0,w,h);for(var y=0;y<h;y+=16){x.fillStyle='#9ea3a6';x.fillRect(0,y,w,6);x.fillStyle='#d0d3d4';x.fillRect(0,y+6,w,3)}});seats.wrapS=seats.wrapT=THREE.RepeatWrapping;seats.repeat.set(40,3);
    var st=new THREE.Mesh(new THREE.PlaneGeometry(64,17),pzTexMat(seats));st.position.set(-8,4.78+8.5*Math.cos(.98),-.45-8.5*Math.sin(.98));st.rotation.x=-.98;g.add(st);
    /* 바닥: 배수 덮개 + 통로 */
    var curb=new THREE.Mesh(Box(64,.12,.5),pzMat(0x55585a));curb.position.set(-8,.06,.28);g.add(curb);
    var grate=canvasTex(64,16,function(x,w,h){x.fillStyle='#2a2c2d';x.fillRect(0,0,w,h);x.fillStyle='#57595a';for(var i=0;i<w;i+=6)x.fillRect(i,2,2,h-4)});grate.wrapS=THREE.RepeatWrapping;grate.repeat.set(120,1);
    var gr=new THREE.Mesh(new THREE.PlaneGeometry(64,.3),pzTexMat(grate));gr.rotation.x=-Math.PI/2;gr.position.set(-8,.125,.3);g.add(gr);
    var walk=new THREE.Mesh(new THREE.PlaneGeometry(64,80),pzTexMat(pzNoiseTex(256,256,'#b9bbb8',{n:900,c:['#a8aaa7','#c8cac6','#9c9e9b'],s:[1,3,1,3]},[.3,.6],[16,20])));walk.rotation.x=-Math.PI/2;walk.position.set(-8,0,40.5);g.add(walk);
    var lip=new THREE.Mesh(Box(64,.22,.4),pzMat(0xd9dbd7));lip.position.set(-8,.11,.65);g.add(lip);
    /* 방패판 + 마일스톤 판 */
    var shield=this.shield=new THREE.Group();shield.position.set(0,0,.02);g.add(shield);hrShield(shield);
    hrBoard();
    return g;
  },
  tick:hrTick
};
