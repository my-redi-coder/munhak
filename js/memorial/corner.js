/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/corner: B존 끝 벽 전시 코너 (배치·뒤 벽·조명) =================
   B존을 지나 통로가 막힌 벽(MH.HALL.endR) 앞에 사진 한 장을 옮겨 놓은 듯한 작은 전시 코너를 세워요.
   왼쪽부터: 1 등신대 → 유니폼·헬멧·장갑 → 가방(벽 선반 위) / 사인과 현금(앞 받침대). 뒤 벽은 베이지 + 따뜻한 조명.
   끄려면 config.js의 MH.CORNER.on=false (통로 길이·걷기 멈춤 자리도 원래대로).
   필요: memorial/layout.js(mhPut·mhAt) · corner-art.js · corner-items.js */
function mhcFrame(w,h,t,x,y,z,root){var g=new THREE.Group();
  mhcAdd(new THREE.Mesh(Box(w+.06,h+.06,.03),mhcStd({color:0x8b6d47,roughness:.6})),0,0,0,g);
  mhcAdd(new THREE.Mesh(new THREE.PlaneGeometry(w,h),mhcStd({map:t,roughness:.9})),0,0,.016,g);
  return mhcAdd(g,x,y,z,root)}
/* 뒤 벽: 베이지 판·천장 단·간접조명 띠·경기장 화면·옛 사진·문서 액자 */
function mhcBackdrop(root){
  var W=MHC.wallW,H=MH.HALL.height;
  var wt=canvasTex(1024,520,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#f2e7d6');g.addColorStop(.5,'#eadcc8');g.addColorStop(1,'#dccdb7');x.fillStyle=g;x.fillRect(0,0,w,h);
    x.fillStyle='#cbbca5';x.fillRect(0,h*.97,w,h*.03)});
  mhcAdd(new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshBasicMaterial({map:wt})),0,H/2,.012,root);
  mhcAdd(new THREE.Mesh(Box(W,.35,1.1),new THREE.MeshBasicMaterial({color:0xf1ebe1})),0,H-.17,.55,root);
  mhcAdd(new THREE.Mesh(Box(W,.03,.06),new THREE.MeshBasicMaterial({color:0xffe2b0,fog:false})),0,H-.36,1.08,root);
  mhcAdd(new THREE.Mesh(new THREE.PlaneGeometry(W,.6),new THREE.MeshBasicMaterial({map:canvasTex(8,64,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,214,150,.8)');g.addColorStop(1,'rgba(255,214,150,0)');x.fillStyle=g;x.fillRect(0,0,w,h)}),transparent:true,depthWrite:false})),0,H-.65,.02,root);
  /* 가운데: 유니폼 뒤 경기장 화면(살짝 둥글게) */
  var scr=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,1.75,40,1,true,-.42,.84),new THREE.MeshBasicMaterial({map:mhcStadiumTex(),side:THREE.BackSide}));
  scr.rotation.y=Math.PI;mhcAdd(scr,-.45,1.75,3.24,root);
  [.86,2.64].forEach(function(y){mhcAdd(new THREE.Mesh(Box(2.75,.05,.35),new THREE.MeshLambertMaterial({color:0xdccdb5})),-.45,y,.12,root)});
  /* 왼쪽(등신대 뒤): 옛 사진·문서 */
  mhcFrame(.62,.43,mhcOldPhotoTex(),-2.75,2.3,.03,root);mhcFrame(.62,.43,mhcOldPhotoTex(),-3.6,2.3,.03,root);
  mhcFrame(.38,.5,mhcDocTex(11,'창단'),-3.0,1.6,.03,root);mhcFrame(.38,.5,mhcDocTex(12,'기록'),-2.52,1.6,.03,root);
  /* 오른쪽: 설명판 + 문서 액자 */
  var panel=mhLiveTex(500,700,function(x,w,h){x.fillStyle='#f7f1e6';x.fillRect(0,0,w,h);x.fillStyle=MH.HALL.wallInk;x.font='900 46px '+MHF.kr;x.fillText('문학의 기억',36,90);
    x.fillStyle=MH.HALL.red;x.fillRect(36,112,70,6);x.fillStyle='#8c8478';for(var i=0;i<14;i++)x.fillRect(36,160+i*34,(w-72)*(i%4===3?.55:.95),9)});
  mhcAdd(new THREE.Mesh(new THREE.PlaneGeometry(.75,1.05),new THREE.MeshBasicMaterial({map:panel})),1.95,2.0,.025,root);
  var t=['기념','표창','감사','우승','기록','계약'];
  for(var i=0;i<6;i++)mhcFrame(.3,.4,mhcDocTex(20+i,t[i]),2.62+(i%3)*.38,2.45-Math.floor(i/3)*.55,.03,root);
  for(var k=0;k<3;k++)mhcFrame(.12,.48,mhcDocTex(40+k,''),2.65+k*.22,1.3,.03,root);
}
/* 바닥 그림자(그림자 계산 없이 가볍게): 물건 밑에 옅은 타원 */
function mhcBlob(root,x,z,w,d){var t=canvasTex(64,64,function(c,w2,h2){var g=c.createRadialGradient(32,32,4,32,32,32);g.addColorStop(0,'rgba(60,45,30,.28)');g.addColorStop(1,'rgba(60,45,30,0)');c.fillStyle=g;c.fillRect(0,0,w2,h2)});
  var m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;mhcAdd(m,x,.006,z,root)}
function mhBuildCorner(){
  if(!MHC.on)return;
  var root=new THREE.Group();
  mhcBackdrop(root);
  /* 사진과 같은 순서 (x=오른쪽, z=끝 벽에서 통로 쪽으로) */
  var P=MHC.place;
  var cut=mhcCutout();cut.rotation.y=.18;cut.scale.setScalar(1.08);mhcAdd(cut,P.cutout[0],0,P.cutout[1],root);
  var js=mhcJerseySet();js.rotation.y=.12;mhcAdd(js,P.jersey[0],0,P.jersey[1],root);
  mhcAdd(mhcBagShelf(),P.bag[0],0,P.bag[1],root);
  var cc=mhcCashCase();cc.rotation.y=-.06;mhcAdd(cc,P.cash[0],0,P.cash[1],root);
  mhcBlob(root,P.cutout[0],P.cutout[1],1.3,.8);mhcBlob(root,P.jersey[0],P.jersey[1],1.9,1.4);mhcBlob(root,P.cash[0],P.cash[1],1.9,1.3);
  mhPut(root,MH.HALL.endR,MH.HALL.rMid,0,'ccw');scene.add(root);root.updateMatrixWorld(true);
  /* 따뜻한 전시 조명: 물건마다 위에서 비추는 스포트라이트 (가까운 곳만 밝힘) */
  ['cutout','jersey','bag','cash'].forEach(function(k){var p=P[k],sp=new THREE.SpotLight(0xffe4bd,.85,7,.4,.6,1.2);
    sp.position.copy(root.localToWorld(new THREE.Vector3(p[0],MH.HALL.height-.05,p[1]+1.6)));
    sp.target.position.copy(root.localToWorld(new THREE.Vector3(p[0],1,p[1])));scene.add(sp,sp.target)});
  MHC.root=root;
}
