/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/frames: 액자 + 벽 글씨 + 오늘의 포토 =================
   · 짤 한 장 = 16:9 액자 한 칸. 비율이 다르면 좌우를 흰색으로 채워요(그림 안에서 가운데에 맞춤)
   · 액자 위 벽 글씨: 제목 + 얇은 빨간 줄 + 코드(·2026). 태그·사람 이름은 화면에 안 나와요
   · 눌러지는 곳은 MH.hits에 모아요(input.js가 맞힘) */
MH.hits=[];MH.today=null;
function mhDrawPhoto(x,w,h,im){
  x.fillStyle='#ffffff';x.fillRect(0,0,w,h);if(!im)return;
  var r=Math.min(w/im.width,h/im.height),iw=im.width*r,ih=im.height*r;x.drawImage(im,(w-iw)/2,(h-ih)/2,iw,ih);
}
function mhPhotoTex(it){
  var tex=canvasTex(1024,576,function(x,w,h){mhDrawPhoto(x,w,h,null)});
  var im=new Image();im.onload=function(){it._im=im;var c=tex.image;mhDrawPhoto(c.getContext('2d'),c.width,c.height,im);tex.needsUpdate=true};im.src=it.url;
  return tex;
}
function mhEmptyFrame(g,W,Hh,fr){
  var et=canvasTex(1024,576,function(x,w,h){x.fillStyle='#f6f7f8';x.fillRect(0,0,w,h);x.strokeStyle='#c4c8cd';x.lineWidth=4;x.setLineDash([22,14]);x.strokeRect(18,18,w-36,h-36);x.fillStyle='#9aa0a6';x.font='500 '+Math.round(h*.065)+'px '+MHF.kr;x.textAlign='center';x.textBaseline='middle';x.fillText('다음 짤이 걸릴 자리',w/2,h/2)});
  var ep=new THREE.Mesh(new THREE.PlaneGeometry(W,Hh),new THREE.MeshBasicMaterial({map:et}));ep.position.z=.025;ep.userData.empty=true;g.add(ep);MH.hits.push(ep);fr.material=new THREE.MeshLambertMaterial({color:0xd5d8dc});
}
function mhHangFrame(it,s,scale,opt){
  opt=opt||{};var HALL=MH.HALL,W=HALL.frameW*scale,Hh=HALL.frameH*scale,y=opt.y||HALL.frameY,wl=opt.wall||it.wall||'in',d=wl==='out'?1:-1,r=(wl==='out'?HALL.rIn:HALL.rOut)+d*.06;
  var g=new THREE.Group();scene.add(g);mhPut(g,s,r,y,wl);
  var fr=new THREE.Mesh(Box(W+.07,Hh+.07,.04),new THREE.MeshLambertMaterial({color:0x1c1f23}));g.add(fr);
  if(it.empty){mhEmptyFrame(g,W,Hh,fr);return}
  if(!it._tex)it._tex=mhPhotoTex(it);
  var pic=new THREE.Mesh(new THREE.PlaneGeometry(W,Hh),new THREE.MeshBasicMaterial({map:it._tex}));pic.position.z=.025;pic.userData.item=it;if(opt.today)pic.userData.today=true;g.add(pic);MH.hits.push(pic);
  if(opt.noCaption)return;
  /* 액자 위 벽 글씨: 제목 + 얇은 빨간 줄 + 코드·연도 */
  var cw=W,ch=.62,date=it.year&&it.year!=='-'?it.year:'';
  var ct=mhTexW(cw,ch,300,function(x,w,h){x.textAlign='left';x.textBaseline='alphabetic';
    x.fillStyle=HALL.wallInk;x.font='700 '+Math.round(h*.3)+'px '+MHF.kr;x.fillText(it.title,2,h*.36);
    var tw=Math.min(w-4,Math.max(x.measureText(it.title).width,w*.42));x.fillStyle=HALL.red;x.fillRect(2,h*.47,tw,Math.max(2,h*.022));
    x.fillStyle=HALL.wallMute;x.font='600 '+Math.round(h*.26)+'px '+MHF.cond;x.fillText(it.code+(date?'   '+date:''),2,h*.82)});
  var cap=mhPlane(cw,ch,ct);mhPut(cap,s,r-d*.02,y+Hh/2+.42,wl);
  if(it.comment){var mt=mhTexW(cw,.3,300,function(x,w,h){x.fillStyle=HALL.wallMute;x.textAlign='left';x.textBaseline='middle';x.font='500 '+Math.round(h*.5)+'px '+MHF.kr;x.fillText(it.comment,2,h/2)});var cm=mhPlane(cw,.3,mt);mhPut(cm,s,r-d*.02,y-Hh/2-.26,wl)}
}
function mhBuildFrames(items){
  var HALL=MH.HALL;
  items.forEach(function(it){mhHangFrame(it,it.s,1)});
  /* 오늘의 포토: 입장할 때 하나 고정 (지난번과 다른 짤). 짤이 하나도 없으면 안 걸어요 */
  var pool=items.filter(function(it){return !it.empty});if(!pool.length)return;
  var last=store.get(MH.KEY.today,''),cand=pool.filter(function(it){return it.code!==last});
  MH.today=pick(cand.length?cand:pool);store.set(MH.KEY.today,MH.today.code);
  mhHangFrame(MH.today,0,HALL.todayScale,{y:2.02,noCaption:true,today:true,wall:'in'});
  var T=MH.today,tw=HALL.frameW*HALL.todayScale;
  var tc=mhPlane(tw,.36,mhTexW(tw,.36,260,function(x,w,h){x.textBaseline='middle';x.textAlign='left';
    x.fillStyle=HALL.wallMute;x.font='600 '+Math.round(h*.62)+'px '+MHF.cond;var a=T.code+'   ',aw=x.measureText(a).width;x.fillText(a,2,h/2);
    x.fillStyle=HALL.wallInk;x.font='700 '+Math.round(h*.55)+'px '+MHF.kr;x.fillText(T.title,2+aw,h/2)}));
  mhPut(tc,0,HALL.rOut-.05,.72,'in');
}
