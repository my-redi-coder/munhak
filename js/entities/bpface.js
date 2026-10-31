/* ================= 그라운드 선수 표정 (이벤트에서 가까이 비출 때) =================
   평소 선수 얼굴은 눈 점만 있어요. p.setFace(종류)로 앞얼굴에 표정 그림을 덮고, p.clearFace()로 되돌려요.
   종류: 'sulk-pimple' 시무룩 + 여드름 / 'sulk-brow' 시무룩 + 짙은 눈썹 / 'joy' 눈웃음 + 활짝 벌린 입
   그림 판은 머리 앞쪽 조각(좌우 PH, 위아래 TH0부터 TH 라디안)에 감겨요. 모자·헬멧 챙(높이 .02~.03) 아래만 보여요. */
var BPF={R:.1715,PH:2.0,TH0:.72,TH:2.0,W:256,mats:{}};
BPF.H=Math.round(BPF.W*BPF.TH/BPF.PH);
BPF.geo=new THREE.SphereGeometry(BPF.R,24,16,Math.PI/2-BPF.PH/2,BPF.PH,BPF.TH0,BPF.TH);
/* 얼굴 위 자리 → 그림 판 좌표. ax: 가운데서 옆으로 돈 각도(라디안, +가 그림 오른쪽), y: 머리 가운데 기준 높이 */
function bpfXY(ax,y){var th=Math.acos(clamp(y/.17,-1,1));return [BPF.W/2+ax/BPF.PH*BPF.W,(th-BPF.TH0)/BPF.TH*BPF.H]}
var BPF_INK='#2b2320';
function bpfTex(kind){return canvasTex(BPF.W,BPF.H,function(x,w,h){
  x.fillStyle='#ffdcc4';x.fillRect(0,0,w,h);
  x.lineCap='round';x.lineJoin='round';x.strokeStyle=BPF_INK;x.fillStyle=BPF_INK;
  function line(a,b,lw){var p=bpfXY(a[0],a[1]),q=bpfXY(b[0],b[1]);x.lineWidth=lw;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.stroke()}
  function dot(ax,y,rx,ry,col){var p=bpfXY(ax,y);x.fillStyle=col;x.beginPath();x.ellipse(p[0],p[1],rx,ry,0,0,TAU);x.fill()}
  if(kind==='joy'){
    /* 볼 빨갛게 */
    [-.62,.62].forEach(function(a){dot(a,-.05,17,10,'rgba(255,120,130,.55)')});
    /* 눈웃음 ∩ */
    x.strokeStyle=BPF_INK;x.lineWidth=7;[-.34,.34].forEach(function(a){var p=bpfXY(a,-.015);x.beginPath();x.arc(p[0],p[1]+6,13,Math.PI*1.1,Math.PI*1.9);x.stroke()});
    /* 활짝 벌린 입: 위는 반듯, 아래로 둥글게 + 윗니 + 혀 */
    var m=bpfXY(0,-.07),mw=34,md=34;
    x.beginPath();x.moveTo(m[0]-mw,m[1]);x.lineTo(m[0]+mw,m[1]);x.quadraticCurveTo(m[0]+mw,m[1]+md*1.3,m[0],m[1]+md*1.3);x.quadraticCurveTo(m[0]-mw,m[1]+md*1.3,m[0]-mw,m[1]);x.closePath();
    x.fillStyle='#7a1f2a';x.fill();x.save();x.clip();
    x.fillStyle='#ffffff';x.fillRect(m[0]-mw,m[1],mw*2,7);
    x.fillStyle='#f07a86';x.beginPath();x.ellipse(m[0],m[1]+md*1.18,mw*.62,md*.42,0,0,TAU);x.fill();x.restore();
    x.strokeStyle=BPF_INK;x.lineWidth=4;x.stroke();
    return;
  }
  /* 시무룩: 팔자 눈썹(안쪽이 올라감) + 아래로 내리깐 눈 + 삐죽 내민 ∩ 입 */
  var thick=kind==='sulk-brow';
  if(thick){
    x.fillStyle='#1c1512';
    [[-1,1],[1,-1]].forEach(function(s){var o=bpfXY(s[0]*.6,-.014),i=bpfXY(s[0]*.13,.008);
      x.beginPath();x.moveTo(o[0],o[1]+6);x.lineTo(o[0],o[1]-6);x.lineTo(i[0],i[1]-9);x.lineTo(i[0],i[1]+6);x.closePath();x.fill()});
  }else{x.strokeStyle=BPF_INK;[-1,1].forEach(function(s){line([s*.52,-.014],[s*.16,.006],4.5)})}
  x.strokeStyle=BPF_INK;
  [-1,1].forEach(function(s){
    /* 눈꺼풀 반쯤 내려온 눈: 아래 반쪽 점 + 위 눈꺼풀 선 */
    var p=bpfXY(s*.34,-.03);x.fillStyle=BPF_INK;x.beginPath();x.ellipse(p[0],p[1]+2,7,6,0,0,Math.PI);x.fill();
    x.lineWidth=4;x.beginPath();x.moveTo(p[0]-11,p[1]-s*3);x.lineTo(p[0]+11,p[1]+s*3);x.stroke();
  });
  /* 입: 작은 ∩ + 아랫입술 */
  var m=bpfXY(0,-.105);x.lineWidth=4.5;x.beginPath();x.moveTo(m[0]-15,m[1]+5);x.quadraticCurveTo(m[0],m[1]-8,m[0]+15,m[1]+5);x.stroke();
  x.strokeStyle='rgba(180,90,90,.55)';x.lineWidth=3;x.beginPath();x.moveTo(m[0]-7,m[1]+9);x.quadraticCurveTo(m[0],m[1]+12,m[0]+7,m[1]+9);x.stroke();
  if(kind==='sulk-pimple'){
    /* 여드름: 볼·코 옆·턱에 붉은 점 */
    [[-.62,-.06,6],[-.5,-.1,4.5],[-.7,-.02,4],[.56,-.07,5.5],[.66,-.11,4],[.16,-.06,3.5],[-.1,-.135,4.5],[.48,-.03,3.5]].forEach(function(d){
      var p=bpfXY(d[0],d[1]);x.fillStyle='rgba(225,80,80,.55)';x.beginPath();x.arc(p[0],p[1],d[2]+2.5,0,TAU);x.fill();
      x.fillStyle='#d9454b';x.beginPath();x.arc(p[0],p[1],d[2],0,TAU);x.fill();
      x.fillStyle='rgba(255,236,220,.85)';x.beginPath();x.arc(p[0]-d[2]*.3,p[1]-d[2]*.35,d[2]*.35,0,TAU);x.fill()});
  }
})}
function bpfMat(kind){return BPF.mats[kind]||(BPF.mats[kind]=new THREE.MeshLambertMaterial({map:bpfTex(kind)}))}
Ballplayer.prototype.setFace=function(kind){
  if(!kind){this.clearFace();return}
  if(!this.faceM){this.faceM=new THREE.Mesh(BPF.geo,bpfMat(kind));this.head.add(this.faceM)}else this.faceM.material=bpfMat(kind);
  this.faceM.visible=true;if(this.eyes)this.eyes.visible=false;
};
Ballplayer.prototype.clearFace=function(){if(this.faceM)this.faceM.visible=false;if(this.eyes)this.eyes.visible=true};
