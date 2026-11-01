/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 포토존: 플레이어존 =================
   3번 게이트 실내 통로의 빨간 아치 패널. 패널 그림은 pzPanelDraw()가 그려요.
   - 사진이 없으면 기본 그림 '다음 시즌의 주인공'(봄 하늘, 꽃잎, 빛나는 야구공, 소품 액자)
   - 사진을 넣으면 위쪽 큰 칸을 사진으로 꽉 채워요
   'PLAYER OF THE MONTH'는 고정, 아래 띠의 한 줄 문구만 바꿀 수 있어요(PZP.line). 사진·문구는 이 기기에 저장. */
var PZP={img:null,line:store.get('pzLine',null),tex:null,cv:null,W:5.6,Y0:.45,YS:3.75,YC:4.3};

function pzPanelDraw(){
  var x=PZP.cv.getContext('2d'),w=PZP.cv.width,h=PZP.cv.height,ph=h*.74,img=PZP.img;
  x.clearRect(0,0,w,h);
  if(img){pzCover(x,img,0,0,w,ph);var sh=x.createLinearGradient(0,ph*.7,0,ph);sh.addColorStop(0,'rgba(120,8,20,0)');sh.addColorStop(1,'rgba(120,8,20,.55)');x.fillStyle=sh;x.fillRect(0,ph*.7,w,ph*.3)}
  else pzDefaultArt(x,w,ph);
  /* 별·손글씨 낙서(실제 패널처럼 가장자리에) */
  [[.05,.5,22],[.94,.42,26],[.9,.12,16],[.12,.16,14],[.7,.06,12],[.3,.62,12]].forEach(function(s){pzStar(x,s[0]*w,s[1]*h,s[2]*w/1536*1.6,5,'rgba(255,255,255,.95)')});
  pzSpark(x,.24*w,.1*h,18,'#fff');pzSpark(x,.8*w,.6*h,22,'#fff');
  pzScribble(x,[.03*w,.66*h,.06*w,.6*h,.1*w,.64*h,.14*w,.68*h,.17*w,.62*h],'rgba(255,255,255,.9)',4);
  pzScribble(x,[.86*w,.28*h,.9*w,.24*h,.93*w,.3*h],'rgba(255,255,255,.9)',4);
  /* 아래 띠 */
  var g=x.createLinearGradient(0,ph,0,h);g.addColorStop(0,'#c8102e');g.addColorStop(1,'#9e0c22');x.fillStyle=g;x.fillRect(0,ph,w,h-ph);
  x.fillStyle='rgba(255,255,255,.9)';x.fillRect(0,ph,w,5);
  x.textAlign='center';x.textBaseline='middle';
  x.font='900 '+Math.round(h*.085)+'px Georgia, "Times New Roman", serif';x.fillStyle='rgba(70,0,10,.35)';x.fillText(PZ_CFG.pz.title,w/2+4,ph+h*.075+4);
  x.fillStyle='#fff';x.fillText(PZ_CFG.pz.title,w/2,ph+h*.075);
  var line=PZP.line==null?PZ_CFG.pz.line:PZP.line;
  if(line){x.font=Math.round(h*.046)+'px "Gowun Dodum", sans-serif';var lw=Math.min(w*.8,x.measureText(line).width+h*.1),lh=h*.072;
    pzRound(x,w/2-lw/2,ph+h*.142,lw,lh,8);x.fillStyle='#fff';x.fill();x.fillStyle='#a00d24';x.fillText(line,w/2,ph+h*.142+lh/2+2)}
  if(PZP.tex)PZP.tex.needsUpdate=true;
}
/* 기본 그림: 다음 시즌의 주인공 (봄 하늘 + 구장 실루엣 + 빛나는 공 + 소품 액자) */
function pzDefaultArt(x,w,h){
  var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#7fbbe8');g.addColorStop(.6,'#cfe6f5');g.addColorStop(1,'#ffe3ea');x.fillStyle=g;x.fillRect(0,0,w,h);
  /* 구장 실루엣: 관중석 곡선 + 조명탑 */
  x.fillStyle='rgba(88,112,140,.35)';x.beginPath();x.moveTo(0,h);x.lineTo(0,h*.78);x.quadraticCurveTo(w/2,h*.6,w,h*.78);x.lineTo(w,h);x.fill();
  [[.14,.5],[.32,.44],[.68,.44],[.86,.5]].forEach(function(l){var lx=l[0]*w,ly=l[1]*h;x.fillRect(lx-3,ly,6,h*.3);x.fillRect(lx-22,ly-16,44,18)});
  x.fillStyle='rgba(88,112,140,.22)';x.fillRect(0,h*.9,w,h*.1);
  /* 꽃잎 */
  for(var i=0;i<70;i++){var px=rnd(0,w),py=rnd(0,h*.95),r=rnd(6,13);x.save();x.translate(px,py);x.rotate(rnd(0,TAU));x.fillStyle=pick(['#ffc7d6','#ffb3c7','#ffdbe5','#fff0f4']);x.globalAlpha=rnd(.6,.95);x.beginPath();x.ellipse(0,0,r,r*.55,0,0,TAU);x.fill();x.restore()}
  /* 빛나는 야구공 (주인공 자리) */
  var cx=w/2,cy=h*.46,R=h*.2,gl=x.createRadialGradient(cx,cy,R*.6,cx,cy,R*2.4);gl.addColorStop(0,'rgba(255,248,214,.95)');gl.addColorStop(1,'rgba(255,248,214,0)');x.fillStyle=gl;x.fillRect(cx-R*2.5,cy-R*2.5,R*5,R*5);
  var bg=x.createRadialGradient(cx-R*.35,cy-R*.35,R*.1,cx,cy,R);bg.addColorStop(0,'#fff');bg.addColorStop(1,'#e9e4da');x.fillStyle=bg;x.beginPath();x.arc(cx,cy,R,0,TAU);x.fill();
  x.strokeStyle='#d0242f';x.lineWidth=R*.05;
  [[-1,-.75,.75],[1,Math.PI-.75,Math.PI+.75]].forEach(function(q){var sx=cx+q[0]*R*1.32,sr=R*.95;x.lineWidth=R*.05;x.beginPath();x.arc(sx,cy,sr,q[1],q[2]);x.stroke();
    x.lineWidth=R*.03;for(var k=0;k<=8;k++){var a=q[1]+(q[2]-q[1])*k/8,ax=sx+Math.cos(a)*sr,ay=cy+Math.sin(a)*sr,nx=Math.cos(a)*R*.08,ny=Math.sin(a)*R*.08;x.beginPath();x.moveTo(ax-nx-ny*.6,ay-ny+nx*.6);x.lineTo(ax+nx-ny*.6,ay+ny+nx*.6);x.stroke()}});
  /* 소품 액자: 글러브·티켓(왼쪽), 배트·모자(오른쪽) */
  [[.13,.24,-.12,pzIcoGlove],[.15,.56,.08,pzIcoTicket],[.86,.24,.1,pzIcoBat],[.84,.56,-.07,pzIcoCap]].forEach(function(f){
    var fw=w*.15,fh=fw*1.12;x.save();x.translate(f[0]*w,f[1]*h);x.rotate(f[2]);x.shadowColor='rgba(0,0,0,.18)';x.shadowBlur=14;x.fillStyle='#fff';x.fillRect(-fw/2,-fh/2,fw,fh);x.shadowBlur=0;
    x.fillStyle='#f6e9d4';x.fillRect(-fw/2+10,-fh/2+10,fw-20,fh-46);f[3](x,0,-14,fw*.32);x.restore()});
}
function pzIcoGlove(x,cx,cy,r){x.fillStyle='#b9772f';x.beginPath();x.ellipse(cx,cy+r*.15,r*.75,r*.85,0,0,TAU);x.fill();for(var i=0;i<4;i++){x.beginPath();x.ellipse(cx-r*.5+i*r*.33,cy-r*.6,r*.14,r*.42,0,0,TAU);x.fill()}x.fillStyle='#8a5320';x.fillRect(cx-r*.6,cy+r*.75,r*1.2,r*.22)}
function pzIcoTicket(x,cx,cy,r){x.fillStyle='#c8102e';x.fillRect(cx-r,cy-r*.5,r*2,r);x.fillStyle='#fff';x.beginPath();x.arc(cx-r,cy,r*.2,0,TAU);x.arc(cx+r,cy,r*.2,0,TAU);x.fill();x.font='bold '+Math.round(r*.42)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('TICKET',cx,cy)}
function pzIcoBat(x,cx,cy,r){x.save();x.translate(cx,cy);x.rotate(-.7);x.fillStyle='#c79a5b';x.beginPath();x.moveTo(-r*.08,r*1.1);x.lineTo(r*.08,r*1.1);x.lineTo(r*.2,-r*1.05);x.quadraticCurveTo(0,-r*1.25,-r*.2,-r*1.05);x.closePath();x.fill();x.restore();x.fillStyle='#fff';x.strokeStyle='#d0242f';x.lineWidth=3;x.beginPath();x.arc(cx+r*.6,cy+r*.55,r*.3,0,TAU);x.fill();x.stroke()}
function pzIcoCap(x,cx,cy,r){x.fillStyle='#c8102e';x.beginPath();x.arc(cx,cy+r*.2,r*.8,Math.PI,0);x.fill();x.fillRect(cx-r*.1,cy+r*.15,r*1.2,r*.2);x.fillStyle='#fff';x.beginPath();x.arc(cx,cy-r*.62,r*.1,0,TAU);x.fill()}

/* 사진 넣기/빼기·문구 바꾸기 (ui/photozone-ui.js가 불러요) */
function pzSetPhoto(url){
  if(!url){PZP.img=null;try{localStorage.removeItem('munhak:pzPhoto')}catch(e){}pzPanelDraw();return}
  var im=new Image();im.onload=function(){PZP.img=im;pzPanelDraw()};im.src=url;
}
function pzSetLine(t){PZP.line=t;store.set('pzLine',t);pzPanelDraw()}

PZ_SETS.pz={
  O:new THREE.Vector3(150,0,380),g:null,T:new THREE.Vector3(0,0,0),W:6.4,H:4.9,camY:1.45,lookY:2.15,
  standZ:1.45,standX:[-3.6,3.6],startX:1.7,panMin:-3,panMax:3,zoomMax:function(){return 1.5},pose:'pzV',
  pointX:function(){return 0},
  build:function(){
    var g=this.g=new THREE.Group();g.position.copy(this.O);g.visible=false;var P=PZP;
    /* 통로: 바닥·벽·천장 (실내라서 그림으로 명암) */
    var fl=new THREE.Mesh(new THREE.PlaneGeometry(34,30),pzTexMat(pzNoiseTex(256,256,'#4a4b4e',{n:900,c:['#3e3f42','#58595c','#2f3033'],s:[1,3,1,3]},[.3,.7],[10,9])));fl.rotation.x=-Math.PI/2;fl.position.set(0,0,12);g.add(fl);
    var wallT=canvasTex(512,256,function(x,w,h){var gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#c9c7c2');gr.addColorStop(1,'#a9a7a2');x.fillStyle=gr;x.fillRect(0,0,w,h);x.strokeStyle='rgba(0,0,0,.08)';x.lineWidth=2;for(var i=0;i<w;i+=128){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}});wallT.wrapS=THREE.RepeatWrapping;wallT.repeat.set(5,1);
    var back=new THREE.Mesh(new THREE.PlaneGeometry(34,5.2),pzTexMat(wallT));back.position.set(0,2.6,-.5);g.add(back);
    [-1,1].forEach(function(s){var sw=new THREE.Mesh(new THREE.PlaneGeometry(30,5.2),pzMat(0xb3b1ac));sw.rotation.y=-s*Math.PI/2;sw.position.set(s*17,2.6,12);g.add(sw);
      var col=new THREE.Mesh(Box(.9,5.2,.9),pzMat(0xbebcb6));col.position.set(s*6.2,2.6,.3);g.add(col)});
    var ceil=new THREE.Mesh(new THREE.PlaneGeometry(34,30),pzMat(0x6f6d69));ceil.rotation.x=Math.PI/2;ceil.position.set(0,5.2,12);g.add(ceil);
    for(var bz=1;bz<27;bz+=4){var bm=new THREE.Mesh(Box(34,.45,.5),pzMat(0x85837e));bm.position.set(0,4.95,bz);g.add(bm);
      var lamp=new THREE.Mesh(Box(1.6,.06,.3),pzMat(0xfffbea));lamp.position.set(-3,4.7,bz+2);g.add(lamp);var l2=lamp.clone();l2.position.x=3;g.add(l2)}
    var fr=new THREE.Mesh(new THREE.PlaneGeometry(34,5.2),pzMat(0x9c9a95));fr.rotation.y=Math.PI;fr.position.set(0,2.6,27);g.add(fr);
    /* 빨간 아치 틀 + 패널 */
    var f=.32,outer=pzArch(new THREE.Shape(),P.W+f*2,P.Y0-f*.6,P.YS+f,P.YC+f);outer.holes.push(pzArch(new THREE.Path(),P.W,P.Y0,P.YS,P.YC));
    var frame=new THREE.Mesh(new THREE.ExtrudeGeometry(outer,{depth:.36,bevelEnabled:false,curveSegments:24}),[pzMat(0xd3192f),pzMat(0x8e1121)]);frame.position.z=-.3;g.add(frame);
    var base=new THREE.Mesh(Box(P.W+f*2,P.Y0-f*.6,.4),[pzMat(0x9e0c22),pzMat(0x9e0c22),pzMat(0xb81229),pzMat(0x9e0c22),pzMat(0xc8102e),pzMat(0x9e0c22)]);base.position.set(0,(P.Y0-f*.6)/2,-.1);g.add(base);
    P.cv=document.createElement('canvas');P.cv.width=1536;P.cv.height=Math.round(1536*(P.YC-P.Y0)/P.W);
    P.tex=new THREE.CanvasTexture(P.cv);P.tex.anisotropy=maxAniso;
    var panel=new THREE.Mesh(pzFlat(pzArch(new THREE.Shape(),P.W,P.Y0,P.YS,P.YC)),pzTexMat(P.tex));panel.position.z=-.2;g.add(panel);
    /* 위쪽 빨간 띠(천장까지 이어진 부분) */
    var top=new THREE.Mesh(Box(P.W+3,.5,.4),pzMat(0xc8102e));top.position.set(0,P.YC+.6,-.25);g.add(top);
    pzPanelDraw();
    var saved=store.get('pzPhoto',null);if(saved)pzSetPhoto(saved);
    if(document.fonts&&document.fonts.load)document.fonts.load('40px "Gowun Dodum"').then(pzPanelDraw,function(){});
    return g;
  }
};
