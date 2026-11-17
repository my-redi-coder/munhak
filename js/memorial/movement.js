/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/movement: 걷기 (야구장 js/game/movement.js 와 같은 방식) =================
   바닥 누르기 · 키보드(WASD·방향키) · ‹ › 버튼 길게 누르기. 통로 안(안쪽·바깥 벽 사이, 양 끝 안)으로만 걸어요.
   통로가 휘는 만큼 카메라도 같이 돌아서 벽을 보는 각도가 그대로예요. */
function mhClampPos(x,z){var H=MH.HALL,q=mhToSR(x,z),r=clamp(q.r,H.rIn+.55,H.rOut-.55),s=clamp(q.s,H.endL+.7,H.endR-.7);return mhAt(s,r)}
function mhWalkTo(x,z){var p=mhClampPos(x,z);MH.PL.target={x:p.x,z:p.z};MH.player.act=null}
function mhTurnTo(want,dt){var r=MH.player.root,cur=r.rotation.y,diff=Math.atan2(Math.sin(want-cur),Math.cos(want-cur));r.rotation.y=cur+diff*Math.min(1,dt*14)}
function mhUpdatePlayer(dt){
  var PL=MH.PL,cam=MH.cam,player=MH.player,HALL=MH.HALL;
  if(PL.intro||PL.dress)return;
  var r=player.root,pos=r.position,kx=0,kz=0,K=PL.keys,before=mhToSR(pos.x,pos.z).s;
  if(K.w||K.arrowup)kz-=1;if(K.s||K.arrowdown)kz+=1;if(K.a||K.arrowleft)kx-=1;if(K.d||K.arrowright)kx+=1;
  var wx=0,wz=0;
  if(kx||kz){var yaw=cam.yaw,fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=-fz,rz=fx;wx=fx*(-kz)+rx*kx;wz=fz*(-kz)+rz*kx}
  else if(PL.hold){var t=before/HALL.rMid,tx=Math.cos(t),tz=Math.sin(t),cx=Math.cos(cam.yaw),cz=-Math.sin(cam.yaw),d=cx*tx+cz*tz;
    var sg=Math.abs(d)>.35?Math.sign(d):Math.sign(-Math.sin(cam.yaw)*tx-Math.cos(cam.yaw)*tz)||1;wx=tx*sg*PL.hold;wz=tz*sg*PL.hold}
  if(wx||wz){
    var len=Math.hypot(wx,wz);wx/=len;wz/=len;PL.target=null;player.act=null;
    var p=mhClampPos(pos.x+wx*HALL.walkSpeed*dt,pos.z+wz*HALL.walkSpeed*dt);pos.x=p.x;pos.z=p.z;
    mhTurnTo(Math.atan2(wx,wz),dt);player.mode='walk';mhHideHint();
  }else if(PL.target){
    var dx=PL.target.x-pos.x,dz=PL.target.z-pos.z,dd=Math.hypot(dx,dz);
    if(dd<.06){pos.x=PL.target.x;pos.z=PL.target.z;PL.target=null;player.mode='stand'}
    else{var st=Math.min(dd,HALL.walkSpeed*dt);pos.x+=dx/dd*st;pos.z+=dz/dd*st;mhTurnTo(Math.atan2(dx,dz),dt);player.mode='walk'}
  }else if(player.mode==='walk')player.mode='stand';
  var after=mhToSR(pos.x,pos.z).s;cam.yaw-=(after-before)/HALL.rMid;
}
