/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= player movement ================= */
function updatePlayer(dt){
  if(!curBlock||phase!=='game')return;
  var r=player.root,pos=r.position,kx=0,kz=0,K=PL.keys;
  if(K.w||K.arrowup)kz-=1;if(K.s||K.arrowdown)kz+=1;if(K.a||K.arrowleft)kx-=1;if(K.d||K.arrowright)kx+=1;
  var speed=2.7;
  if(kx||kz){
    if(player.act)stopAct(true);if(player.mode==='sit')standAtSeat(player,PL.seat,curBlock);leaveSeat();PL.target=null;setStatus(null);
    var yaw=cam.yaw,fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=-fz,rz=fx;
    var wx=fx*(-kz)+rx*kx,wz=fz*(-kz)+rz*kx,len=Math.hypot(wx,wz);wx/=len;wz/=len;
    var th=-curBlock.cfg.theta,lx=wx*Math.cos(th)+wz*Math.sin(th),lz=-wx*Math.sin(th)+wz*Math.cos(th);
    pos.x=curBlock.clampX(pos.x+lx*speed*dt);pos.z=curBlock.clampZ(pos.z+lz*speed*dt);
    r.rotation.y=Math.atan2(lx,lz);player.mode='walk';
  }else if(PL.target){
    var dx=PL.target.x-pos.x,dz=PL.target.z-pos.z,d=Math.hypot(dx,dz);
    if(d<.06){pos.x=PL.target.x;pos.z=PL.target.z;PL.target=null;player.mode='stand';setStatus(null);var cb=PL.onArrive;PL.onArrive=null;if(cb)cb()}
    else{var st=Math.min(d,speed*dt);pos.x+=dx/d*st;pos.z+=dz/d*st;var want=Math.atan2(dx,dz),cur=r.rotation.y,diff=Math.atan2(Math.sin(want-cur),Math.cos(want-cur));r.rotation.y=cur+diff*Math.min(1,dt*14);player.mode='walk'}
  }else if(player.mode==='walk')player.mode='stand';
  if(player.mode!=='sit')pos.y=damp(pos.y,curBlock.groundH(pos.z),16,dt);
  if(player.act){lineT-=dt;if(lineT<=0){if(Math.random()<.85)addLabel(player,actLine(player.act),player.act==='angry'?'angry':'say',1700);lineT=player.act==='angry'?1.9:rnd(3.2,4.8)}}
}
