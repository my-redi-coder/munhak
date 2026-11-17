/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/concourse: 둥근 통로(벽·바닥·천장·조명) =================
   시안 3(2026-11-02 확정)의 통로 그대로예요: 선수통로 톤의 흰 벽, 밝은 회색 타일 바닥, 천장 줄조명, 양 끝 막힌 벽.
   MH.walls(눌러서 걷기 막는 벽)·MH.floor(눌러서 걷는 바닥)를 만들어요. */
MH.walls=[];MH.floor=null;
function mhBuildConcourse(){
  var HALL=MH.HALL,H=HALL.height,TH1=HALL.endR/HALL.rMid,TH0=HALL.endL/HALL.rMid,len=TH1-TH0,seg=Math.max(220,Math.ceil(len*60));
  /* 벽: 위가 살짝 밝은 흰 벽 + 3m마다 아주 옅은 이음선 */
  var wallTex=canvasTex(256,512,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#fbfbfc');g.addColorStop(.75,'#f1f2f4');g.addColorStop(1,'#e9ebee');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='rgba(30,35,41,.028)';x.fillRect(0,0,2,h)});
  wallTex.wrapS=THREE.RepeatWrapping;
  var outT=wallTex.clone();outT.needsUpdate=true;outT.repeat.set(len*HALL.rOut/3,1);
  var inT=wallTex.clone();inT.needsUpdate=true;inT.repeat.set(len*HALL.rIn/3,1);
  var outer=new THREE.Mesh(new THREE.CylinderGeometry(HALL.rOut,HALL.rOut,H,seg,1,true,Math.PI-TH1,len),new THREE.MeshBasicMaterial({map:outT,side:THREE.BackSide}));outer.position.y=H/2;scene.add(outer);
  var inner=new THREE.Mesh(new THREE.CylinderGeometry(HALL.rIn,HALL.rIn,H,seg,1,true,Math.PI-TH1,len),new THREE.MeshBasicMaterial({map:inT}));inner.position.y=H/2;scene.add(inner);
  MH.walls.push(outer,inner);
  /* 걸레받이(밝은 회색 띠) */
  var b1=new THREE.Mesh(new THREE.CylinderGeometry(HALL.rOut-.02,HALL.rOut-.02,.14,seg,1,true,Math.PI-TH1,len),new THREE.MeshBasicMaterial({color:0xd3d6da,side:THREE.BackSide}));b1.position.y=.07;scene.add(b1);
  var b2=new THREE.Mesh(new THREE.CylinderGeometry(HALL.rIn+.02,HALL.rIn+.02,.14,seg,1,true,Math.PI-TH1,len),new THREE.MeshBasicMaterial({color:0xd3d6da}));b2.position.y=.07;scene.add(b2);
  /* 바닥: 밝은 회색 타일(60cm), 줄눈 */
  var tile=canvasTex(256,256,function(x,w,h){x.fillStyle='#e6e8eb';x.fillRect(0,0,w,h);var s=w/2;for(var i=0;i<2;i++)for(var j=0;j<2;j++){x.fillStyle=((i+j)%2)?'#e9ebee':'#e3e6e9';x.fillRect(i*s+2,j*s+2,s-4,s-4)}x.fillStyle='#d2d5d9';x.fillRect(0,0,w,2);x.fillRect(0,0,2,h);x.fillRect(0,s-1,w,2);x.fillRect(s-1,0,2,h)});
  tile.wrapS=tile.wrapT=THREE.RepeatWrapping;tile.repeat.set(HALL.rOut*2/1.2,HALL.rOut*2/1.2);
  var fg=new THREE.RingGeometry(HALL.rIn,HALL.rOut,seg,3,Math.PI/2-TH1,len);fg.rotateX(-Math.PI/2);
  MH.floor=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({map:tile}));scene.add(MH.floor);
  /* 천장 */
  var ceil=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({color:0xeceef0,side:THREE.DoubleSide}));ceil.position.y=H;scene.add(ceil);
  /* 천장 줄조명: 통로를 비스듬히 가로지르는 흰 빛줄 (선수통로 사진) */
  var lg=Box(.09,.03,1),lm=new THREE.MeshBasicMaterial({color:0xffffff,fog:false});
  var n=Math.floor((HALL.endR-HALL.endL)/2.6),inst=new THREE.InstancedMesh(lg,lm,n),d=new THREE.Object3D(),i;
  for(i=0;i<n;i++){var s=HALL.endL+1.3+i*2.6,p=mhAt(s,HALL.rMid),t=p.t,a=.62;
    var rx=Math.sin(t),rz=-Math.cos(t),tx=Math.cos(t),tz=Math.sin(t),dx=Math.cos(a)*rx+Math.sin(a)*tx,dz=Math.cos(a)*rz+Math.sin(a)*tz;
    d.position.set(p.x,H-.02,p.z);d.rotation.set(0,Math.atan2(dx,dz),0);d.scale.set(1,1,(HALL.rOut-HALL.rIn)/Math.cos(a)+1);d.updateMatrix();inst.setMatrixAt(i,d.matrix)}
  scene.add(inst);
  /* 동그란 매입등 */
  var dg=new THREE.CircleGeometry(.11,16);dg.rotateX(Math.PI/2);var dm=new THREE.MeshBasicMaterial({color:0xfdfdfd,fog:false});
  var m2=Math.floor((HALL.endR-HALL.endL)/5.2)*2,inst2=new THREE.InstancedMesh(dg,dm,m2),k=0;
  for(i=0;k<m2;i++){[HALL.rOut-1.1,HALL.rIn+1.1].forEach(function(r,j){if(k>=m2)return;var q=mhAt(HALL.endL+2.6+i*5.2+j*2.6,r);d.position.set(q.x,H-.015,q.z);d.rotation.set(0,0,0);d.scale.set(1,1,1);d.updateMatrix();inst2.setMatrixAt(k++,d.matrix)})}
  scene.add(inst2);
  /* 양 끝 막힌 벽 */
  [[HALL.endL,'cw'],[HALL.endR,'ccw']].forEach(function(e){
    var tx=canvasTex(512,300,function(x,w,h){x.fillStyle='#f4f5f6';x.fillRect(0,0,w,h);x.fillStyle=HALL.red;x.fillRect(0,h*.86,w,h*.03)});
    var m=new THREE.Mesh(new THREE.PlaneGeometry(HALL.rOut-HALL.rIn+.2,H),new THREE.MeshBasicMaterial({map:tx}));mhPut(m,e[0],HALL.rMid,H/2,e[1]);scene.add(m);MH.walls.push(m);
    var note=mhPlane(3.2,.4,mhTexW(3.2,.4,200,function(x,w,h){x.fillStyle=HALL.wallMute;x.font='500 '+Math.round(h*.5)+'px '+MHF.kr;x.textAlign='center';x.textBaseline='middle';x.fillText('다음 전시를 준비하고 있어요',w/2,h/2)}));mhPut(note,e[0]+(e[1]==='cw'?.02:-.02),HALL.rMid,1.6,e[1]);
  });
}
