/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/graphics: 벽 그래픽 (빨간 꺾쇠·큰 글씨·최광야구 문틀) =================
   시안 3 그대로, 일반 구역 글자만 'ZONE A–B'로(C·D는 안 열어요). 구역 글자는 MH.OPEN을 따라가요. */
/* 꺾쇠: dir=-1 그림 왼쪽을 가리킴, +1 오른쪽 */
function mhChevronTex(dir,color){return canvasTex(400,800,function(x,w,h){x.strokeStyle=color||MH.HALL.red;x.lineWidth=96;x.lineJoin='miter';x.lineCap='butt';x.beginPath();
  if(dir<0){x.moveTo(330,20);x.lineTo(90,h/2);x.lineTo(330,h-20)}else{x.moveTo(70,20);x.lineTo(310,h/2);x.lineTo(70,h-20)}x.stroke()})}
function mhWallChevron(s,wall,pointsPlus,height){
  /* 바깥 벽(in)은 그림 오른쪽=+s, 안쪽 벽(out)은 그림 왼쪽=+s */
  var HALL=MH.HALL,dir=wall==='in'?(pointsPlus?1:-1):(pointsPlus?-1:1),h=height||3.3;
  var m=mhPlane(h/2,h,mhChevronTex(dir));mhPut(m,s,wall==='in'?HALL.rOut-.04:HALL.rIn+.04,h/2+.35,wall);return m;
}
/* 벽에 세로로 쓴 구역 글자 */
function mhZoneHeader(s,label,korean){
  var HALL=MH.HALL,w=1.2,h=3.4;
  var t=mhTexW(w,h,240,function(x,W,Hh){x.fillStyle=HALL.wine;
    if(korean){x.textAlign='center';x.textBaseline='middle';x.font='900 '+Math.round(W*.62)+'px '+MHF.kr;var ch=label.split(''),step=Hh/(ch.length+.4);ch.forEach(function(c,k){x.fillText(c,W/2,step*(k+.7))})}
    else{x.save();x.translate(W*.62,Hh);x.rotate(-Math.PI/2);x.textAlign='left';x.textBaseline='alphabetic';x.font='800 '+Math.round(W*.78)+'px '+MHF.cond;x.fillText(label,6,0);x.restore()}
  });
  var m=mhPlane(w,h,t);mhPut(m,s,HALL.rOut-.05,h/2+.45,'in');return m;
}
function mhBuildGraphics(){
  var HALL=MH.HALL,H=HALL.height,L=MH.LAY,open=MH.OPEN,zoneText='ZONE '+open[0]+(open.length>1?'–'+open[open.length-1]:'');
  /* --- 입구 홀 안쪽 벽: V6 Go for it! --- */
  var sl=mhPlane(10,3.2,mhTexW(10,3.2,180,function(x,w,h){
    x.fillStyle=HALL.red;x.textBaseline='alphabetic';x.textAlign='left';
    x.font='800 '+Math.round(h*.62)+'px '+MHF.cond;var v6='V6',w1=x.measureText(v6).width;
    x.font='italic 800 '+Math.round(h*.62)+'px '+MHF.cond;var gf=' Go for it!',w2=x.measureText(gf).width;
    var x0=(w-w1-w2)/2,y=h*.7;
    x.font='800 '+Math.round(h*.62)+'px '+MHF.cond;x.fillText(v6,x0,y);
    x.font='italic 800 '+Math.round(h*.62)+'px '+MHF.cond;x.fillText(gf,x0+w1,y);
    x.fillRect(x0,h*.82,w1+w2,h*.025);
  }));mhPut(sl,0,HALL.rIn+.04,2.25,'out');
  /* 홀 안쪽 벽 양 끝 꺾쇠 */
  mhWallChevron(-6.5,'out',false,2.6);mhWallChevron(6.5,'out',true,2.6);

  /* --- 입구 홀 바깥 벽: ← 최광야구 / Photo of Today / ZONE A–B → --- */
  mhWallChevron(-7.2,'in',false);
  var l1=mhPlane(2.6,1.6,mhTexW(2.6,1.6,220,function(x,w,h){x.fillStyle=HALL.red;x.textAlign='left';x.textBaseline='alphabetic';x.font='900 '+Math.round(h*.3)+'px '+MHF.kr;x.fillText('최광야구',4,h*.46);x.fillStyle=HALL.wallMute;x.font='600 '+Math.round(h*.16)+'px '+MHF.cond;x.fillText('Permanent exhibition',6,h*.68)}));
  mhPut(l1,-4.75,HALL.rOut-.05,2.3,'in');
  mhWallChevron(7.2,'in',true);
  var l2=mhPlane(2.6,1.6,mhTexW(2.6,1.6,220,function(x,w,h){x.fillStyle=HALL.red;x.textAlign='right';x.textBaseline='alphabetic';x.font='800 '+Math.round(h*.36)+'px '+MHF.cond;x.fillText(zoneText,w-4,h*.46);x.fillStyle=HALL.wallMute;x.font='600 '+Math.round(h*.16)+'px '+MHF.cond;x.fillText('Gallery',w-6,h*.68)}));
  mhPut(l2,4.75,HALL.rOut-.05,2.3,'in');
  var hd=mhPlane(5,.7,mhTexW(5,.7,220,function(x,w,h){x.fillStyle=HALL.wallInk;x.textAlign='center';x.textBaseline='middle';x.font='italic 700 '+Math.round(h*.7)+'px '+MHF.cond;x.fillText('Photo of Today',w/2,h*.52)}));
  mhPut(hd,0,HALL.rOut-.05,3.62,'in');

  /* --- 최광야구 입구: 빨간 문틀 + 흰 글자 --- */
  var red=new THREE.MeshLambertMaterial({color:0xc8102e}),ps=HALL.portalS;
  [HALL.rIn+.25,HALL.rOut-.25].forEach(function(r){var j=new THREE.Mesh(Box(1.1,H,.5),red);mhPut(j,ps,r,H/2,'in');scene.add(j)});
  var lin=new THREE.Mesh(Box(HALL.rOut-HALL.rIn,1,.7),red);mhPut(lin,ps,HALL.rMid,H-.5,'cw');scene.add(lin);
  var sign=function(txt,sub){return mhTexW(6.4,1,200,function(x,w,h){x.fillStyle='#ffffff';x.textAlign='center';x.textBaseline='middle';x.font='900 '+Math.round(h*.52)+'px '+MHF.kr;x.fillText(txt,w/2,h*(sub?.42:.52));if(sub){x.font='600 '+Math.round(h*.18)+'px '+MHF.cond;x.globalAlpha=.85;x.fillText(sub,w/2,h*.8)}})};
  var s1=mhPlane(6.4,1,sign('최광야구','Permanent exhibition'));mhPut(s1,ps+.36,HALL.rMid,H-.5,'cw');
  var s2=mhPlane(6.4,1,sign('입구 홀',''));mhPut(s2,ps-.36,HALL.rMid,H-.5,'ccw');

  /* --- 최광야구 안쪽 벽: 빨간 벽에 큰 흰 글씨 --- */
  var a=(ps-1.2)/HALL.rMid,b=(ps-11)/HALL.rMid;
  var rt=canvasTex(2048,1075,function(x,w,h){x.fillStyle='#c8102e';x.fillRect(0,0,w,h);x.fillStyle='#ffffff';x.textAlign='center';x.textBaseline='alphabetic';x.font='900 '+Math.round(h*.42)+'px '+MHF.kr;x.fillText('최광야구',w/2,h*.64);x.font='italic 700 '+Math.round(h*.09)+'px '+MHF.cond;x.globalAlpha=.9;x.fillText('Choi · Kwang Baseball',w/2,h*.8)});
  var rw=new THREE.Mesh(new THREE.CylinderGeometry(HALL.rIn+.02,HALL.rIn+.02,H,40,1,true,Math.PI-a,a-b),new THREE.MeshBasicMaterial({map:rt}));rw.position.y=H/2;scene.add(rw);
  mhZoneHeader(ps-1.7,'최광야구',true);

  /* --- 열린 일반 구역: 바깥 벽 세로 글자 + 안쪽 벽 꺾쇠 --- */
  open.forEach(function(z){var s0=L.zoneStart[z];mhZoneHeader(s0+1.4,'ZONE '+z,false);mhWallChevron(s0+1.2,'out',true,2.2)});
}
