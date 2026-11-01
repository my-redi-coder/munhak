/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 포토존 공용 도구 =================
   두 포토존 세트(world/pzone.js, world/hrboard.js)가 같이 쓰는 도우미.
   PZ_SETS[key]에 세트를 등록하면 game/photozone.js가 카메라·으쓱이를 붙여요.
   세트 약속: {O:세트 위치, g:그룹(build()가 만듦), build(), T:보는 곳(세트 안 좌표), W·H:한 화면에 담을 폭·높이,
             camY·lookY, standZ:으쓱이 서는 줄, standX:[왼쪽,오른쪽], startX, panMin·panMax, zoomMax(), pose:기본 포즈,
             pointX(): 으쓱이가 '소개'할 때 가리킬 곳, onEnter(), tick(dt)} */
var PZ_SETS={};

/* 모양을 평면 판으로: UV를 모양의 상자에 맞춰 0~1로 펴요(그림 한 장이 판에 꽉 차게) */
function pzFlat(shape){
  var g=new THREE.ShapeGeometry(shape,24);g.computeBoundingBox();
  var b=g.boundingBox,w=b.max.x-b.min.x,h=b.max.y-b.min.y,p=g.attributes.position,uv=g.attributes.uv;
  for(var i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)-b.min.x)/w,(p.getY(i)-b.min.y)/h);
  uv.needsUpdate=true;return g;
}
/* 위가 둥글게 솟은 아치(플레이어존 틀). 가운데가 yC, 양끝이 yS */
function pzArch(path,w,y0,yS,yC){
  path.moveTo(-w/2,y0);path.lineTo(w/2,y0);path.lineTo(w/2,yS);
  path.quadraticCurveTo(w*.18,yC+(yC-yS)*.55,0,yC);path.quadraticCurveTo(-w*.18,yC+(yC-yS)*.55,-w/2,yS);path.lineTo(-w/2,y0);
  return path;
}
/* 그림 도우미 */
function pzStar(x,cx,cy,r,n,fill){
  n=n||5;x.beginPath();for(var i=0;i<n*2;i++){var a=-Math.PI/2+i*Math.PI/n,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.closePath();x.fillStyle=fill||'#fff';x.fill();
}
function pzSpark(x,cx,cy,r,col){x.beginPath();x.moveTo(cx,cy-r);x.quadraticCurveTo(cx,cy,cx+r,cy);x.quadraticCurveTo(cx,cy,cx,cy+r);x.quadraticCurveTo(cx,cy,cx-r,cy);x.quadraticCurveTo(cx,cy,cx,cy-r);x.fillStyle=col||'#fff';x.fill()}
function pzScribble(x,pts,col,lw){x.save();x.strokeStyle=col||'rgba(255,255,255,.85)';x.lineWidth=lw||4;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=4)x.quadraticCurveTo(pts[i],pts[i+1],pts[i+2],pts[i+3]);x.stroke();x.restore()}
function pzRound(x,l,t,w,h,r){x.beginPath();x.moveTo(l+r,t);x.arcTo(l+w,t,l+w,t+h,r);x.arcTo(l+w,t+h,l,t+h,r);x.arcTo(l,t+h,l,t,r);x.arcTo(l,t,l+w,t,r);x.closePath()}
/* 사진을 칸에 꽉 채우기(넘치는 쪽은 잘라요) */
function pzCover(x,img,l,t,w,h){var s=Math.max(w/img.width,h/img.height),iw=img.width*s,ih=img.height*s;x.save();x.beginPath();x.rect(l,t,w,h);x.clip();x.drawImage(img,l+(w-iw)/2,t+(h-ih)/2,iw,ih);x.restore()}
/* 단색 기본 재질(세트는 그림자 없이 그림으로 명암을 넣어요) */
function pzMat(c){return new THREE.MeshBasicMaterial({color:c})}
function pzTexMat(t){return new THREE.MeshBasicMaterial({map:t})}
/* 바닥·벽용 잔잔한 무늬 그림(반복) */
function pzNoiseTex(w,h,base,dots,alpha,rep){
  var t=canvasTex(w,h,function(x){x.fillStyle=base;x.fillRect(0,0,w,h);for(var i=0;i<dots.n;i++){x.fillStyle=pick(dots.c);x.globalAlpha=rnd(alpha[0],alpha[1]);x.fillRect(rnd(0,w),rnd(0,h),rnd(dots.s[0],dots.s[1]),rnd(dots.s[2],dots.s[3]))}x.globalAlpha=1});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);return t;
}
