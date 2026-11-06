/* ================= 빅보드 (중앙 외야 전광판) =================
   실제 규격: 가로 63.398m × 세로 17.962m (약 3.53:1), 2016년 설치.
   양옆·위에 이퀄라이저 LED 바, 위쪽에 인천 상징(다리·비행기·배) 구조물.
   1m = 1 단위. 홈플레이트(0,0)에서 중앙 담장 120m, 빅보드 앞면은 약 129m. */
var BB={W:63.398,H:17.962,Z:-131,Y0:15};
BB.CY=BB.Y0+BB.H/2+1.2;
var bbEq=null;
var bbScreenTex=canvasTex(2048,Math.round(2048*BB.H/BB.W),function(x,w,h){
  var F='"Gowun Dodum","Apple SD Gothic Neo",sans-serif';
  var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#d2223b');g.addColorStop(1,'#8f0f22');x.fillStyle=g;x.fillRect(0,0,w,h);
  // 왼쪽: 큰 문구
  x.fillStyle='rgba(255,255,255,.08)';for(var i=0;i<24;i++){x.beginPath();x.arc(rnd(0,w*.5),rnd(0,h),rnd(20,90),0,TAU);x.fill()}
  x.fillStyle='#fff6f0';x.textAlign='center';x.textBaseline='middle';
  x.font='bold 118px '+F;x.fillText('봄을 기다리는',w*.255,h*.38);
  x.font='bold 200px '+F;x.fillText('문학',w*.255,h*.7);
  // 오른쪽: 점수판
  var L=w*.53,T=34,PW=w-L-34,PH=h-68;
  x.fillStyle='#173326';x.fillRect(L,T,PW,PH);x.strokeStyle='#2f5a43';x.lineWidth=5;x.strokeRect(L+6,T+6,PW-12,PH-12);
  var cols=['1','2','3','4','5','6','7','8','9','R','H','E'],cx0=L+230,cw=(PW-260)/cols.length;
  x.font='34px '+F;x.fillStyle='#bcd3c4';cols.forEach(function(c,i){x.fillText(c,cx0+i*cw+cw/2,T+62)});
  x.textAlign='left';x.fillStyle='#f7f2df';x.font='40px '+F;x.fillText('원정',L+40,T+150);x.fillText('란다스',L+40,T+240);
  x.textAlign='center';x.fillStyle='#f6c64a';for(var r=0;r<2;r++)for(i=0;i<cols.length;i++)x.fillText('–',cx0+i*cw+cw/2,T+150+r*90);
  var lab=[['B',3],['S',2],['O',2]],px=L+120;x.textAlign='left';x.font='34px '+F;
  lab.forEach(function(l){x.fillStyle='#bcd3c4';x.fillText(l[0],px,T+PH-50);for(var k=0;k<l[1];k++){x.fillStyle='#2c4a3a';x.beginPath();x.arc(px+50+k*36,T+PH-50,13,0,TAU);x.fill()}px+=220});
});
function bbPanelTex(lines){return canvasTex(512,180,function(x,w,h){
  x.fillStyle=lines[1];x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=6;x.strokeRect(8,8,w-16,h-16);
  x.fillStyle=lines[2];x.font='bold 64px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(lines[0],w/2,h/2+4);
})}
(function(){
  var g=new THREE.Group();g.position.set(0,0,BB.Z);scene.add(g);
  var parts=[],W=BB.W,H=BB.H,CY=BB.CY;
  // 아래 건물(2층 관람동) + 기둥
  BB.g=g;
  parts.push({g:Box(72,BB.Y0,12),c:0xe9e6dc,p:[0,BB.Y0/2,1]});
  parts.push({g:Box(72.4,.5,12.4),c:0xcfcabd,p:[0,BB.Y0,1]});
  // 전광판 틀
  parts.push({g:Box(W+3.2,H+3,2.6),c:0x2b2f2c,p:[0,CY,0]});
  parts.push({g:Box(W+3.6,.5,3),c:0x8c8f86,p:[0,CY+H/2+1.5,0]});
  // 오른쪽 뒤 문학경기장 탑
  parts.push({g:Cyl(2.2,4.2,44,10),c:0x9a9d95,p:[50,22,-22]});parts.push({g:Cyl(3.2,2.2,4,10),c:0x8a8d85,p:[50,46,-22]});
  // 광고탑 기둥
  [-1,1].forEach(function(s){parts.push({g:Box(1.4,24,1.4),c:0x8c8f86,p:[s*42,12,4]})});
  g.add(new THREE.Mesh(mergeParts(parts),MVC));
  // 건물 유리 띠 + 이름 띠
  var glass=new THREE.Mesh(Box(66,2.6,.2),new THREE.MeshLambertMaterial({color:0x9fc6d4}));glass.position.set(0,7.4,7.05);g.add(glass);
  var nameTex=canvasTex(1024,96,function(x,w,h){x.fillStyle='#262b29';x.fillRect(0,0,w,h);x.fillStyle='#f3efe2';x.font='bold 52px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('인천 SSC 란다스필드',w/2,h/2+3)});
  var nm=new THREE.Mesh(new THREE.PlaneGeometry(26,2.4),new THREE.MeshBasicMaterial({map:nameTex,fog:false}));nm.position.set(0,12.2,7.12);g.add(nm);
  // 화면 (실측 비율)
  var scr=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshBasicMaterial({map:bbScreenTex,fog:false}));scr.position.set(0,CY,1.32);g.add(scr);BB.scr=scr;
  // 위쪽 구조물: 물결 지붕 + 다리 주탑 + 비행기 + 배 (실루엣)
  var top=CY+H/2+1.75,half=(W+3.6)/2,sh=new THREE.Shape();
  sh.moveTo(-half,0);
  for(var i=0;i<=40;i++){var u=i/40,xx=-half+u*2*half;sh.lineTo(xx,1.4+Math.sin(u*Math.PI*3+.4)*1.1+Math.sin(u*Math.PI)*3)}
  sh.lineTo(half,0);sh.lineTo(-half,0);
  var crown=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.8,bevelEnabled:false}),new THREE.MeshLambertMaterial({color:0xb4553f}));crown.position.set(0,top,-.4);g.add(crown);
  var deco=[];
  [-24,-12].forEach(function(px){deco.push({g:Box(.5,7,.5),c:0xd8d4c8,p:[px-1.2,top+3.6,0],r:[0,0,-.16]});deco.push({g:Box(.5,7,.5),c:0xd8d4c8,p:[px+1.2,top+3.6,0],r:[0,0,.16]});deco.push({g:Box(3.2,.4,.5),c:0xd8d4c8,p:[px,top+4.4,0]});
    [-1,1].forEach(function(s){for(var k=1;k<=4;k++){var dx=s*k*1.7,L=Math.hypot(dx,5);deco.push({g:Box(.12,L,.12),c:0xeeeae0,p:[px+dx/2,top+4.3,0],r:[0,0,Math.atan2(dx,5)]})}});
  });
  // 비행기
  deco.push({g:Box(7,.9,.6),c:0xe8e4d8,p:[10,top+4.8,0]});deco.push({g:Box(1.2,4,.4),c:0xe8e4d8,p:[10.4,top+4.8,0],r:[0,0,.35]});deco.push({g:Box(.8,1.8,.4),c:0xe8e4d8,p:[7,top+5.5,0],r:[0,0,-.3]});
  // 배
  deco.push({g:Box(8,1.2,.6),c:0x6c7a86,p:[23,top+2.6,0]});deco.push({g:Box(3,1.8,.6),c:0xe8e4d8,p:[21.5,top+4,0]});deco.push({g:Box(.5,2.2,.5),c:0xc8102e,p:[24,top+4.2,0]});
  var dm=new THREE.Mesh(mergeParts(deco),MVC);dm.position.set(0,1.8,.9);g.add(dm);
  // 광고판 (양옆 3단)
  var ads=[[['봄맞이 할인','#1d5aa8','#ffe066'],['문학마트','#f2c230','#2b2b2b'],['every day','#ffffff','#2f8f4e']],[['봄을 기다려요','#f4f2ec','#c8102e'],['꿀꿀 BBQ','#ffffff','#454a3c'],['소리 질러!','#c8102e','#ffffff']]];
  [-1,1].forEach(function(s,si){ads[si].forEach(function(a,k){var m=new THREE.Mesh(new THREE.PlaneGeometry(10,3.4),new THREE.MeshBasicMaterial({map:bbPanelTex(a),fog:false}));m.position.set(s*42,25.5-k*3.8,4.8);g.add(m);
    var back=new THREE.Mesh(Box(10.4,3.6,.6),new THREE.MeshLambertMaterial({color:0x6c7067}));back.position.set(s*42,25.5-k*3.8,4.4);g.add(back)})});
  // 이퀄라이저 LED (양옆 세로 막대 3줄 × 14칸, 위쪽 가로 30줄 × 3칸)
  var segs=[],sg=new THREE.BoxGeometry(1,1,.3);
  [-1,1].forEach(function(s){for(var b=0;b<3;b++)for(var k=0;k<14;k++)segs.push({x:s*(W/2+.4+b*.9+.5),y:CY-H/2+.7+k*1.28,sx:.7,sy:1,bar:(s<0?0:3)+b,lv:k/14})});
  for(var b=0;b<30;b++)for(var k=0;k<3;k++)segs.push({x:-W/2+1.2+b*(W-2.4)/29,y:CY+H/2+.25+k*.42,sx:1.5,sy:.3,bar:6+b,lv:k/3});
  var im=new THREE.InstancedMesh(sg,new THREE.MeshBasicMaterial({color:0xffffff,fog:false}),segs.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),sc=new THREE.Vector3();
  segs.forEach(function(sg,i){v.set(sg.x,sg.y,1.45);sc.set(sg.sx,sg.sy,1);m4.compose(v,q,sc);im.setMatrixAt(i,m4);im.setColorAt(i,new THREE.Color(0x3a1418))});
  g.add(im);bbEq={im:im,segs:segs,on:new THREE.Color(0xff4d62),hi:new THREE.Color(0xfff2c0),off:new THREE.Color(0x3a1418)};
  // 가운데 나무숲 (외야 관중석 사이)
  var tr=[];for(i=0;i<9;i++){var a=rnd(-.08,.08),r=rnd(114,123),tx=Math.sin(a)*r,tz=-Math.cos(a)*r;tr.push({g:Cyl(.35,.5,4,6),c:0x6b5444,p:[tx,2,tz]});tr.push({g:new THREE.SphereGeometry(2.6,10,8),c:pick([0x5f9a4a,0x6faa55,0x4f8a3e]),p:[tx,5.2,tz],s:[1,1.15,1]})}
  scene.add(new THREE.Mesh(mergeParts(tr),MVC));
})();
/* 매 프레임: 이퀄라이저 (함성이 클수록 높게) */
function boardTick(t,ex){
  if(!bbEq)return;var e=bbEq,amp=.35+ex*.6;
  for(var i=0;i<e.segs.length;i++){var s=e.segs[i],lev=.5+.5*Math.sin(t*(3+s.bar%5*.7)+s.bar*1.7);lev=lev*amp+.08;
    e.im.setColorAt(i,s.lv<lev?(s.lv>lev-.15?e.hi:e.on):e.off)}
  e.im.instanceColor.needsUpdate=true;
}
