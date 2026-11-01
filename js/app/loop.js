/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= loop ================= */
var T=0,last=performance.now(),crowdTick=0,excite=0;
function frame(now){
  requestAnimationFrame(frame);
  var dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden||MG.on||WALL.on)return;/* 불펜장·담벼락이 화면을 덮는 동안은 쉬어요 */T+=dt;
  var beat=beatPos(T);
  if(player){updatePlayer(dt);player.update(dt,beat)}
  if(phase==='game'){updateNPCs(dt,beat);if(leader){var want=(player.act==='cheer'||npcs.some(function(n){return n.act==='cheer'}))?'cheer':(Math.sin(T*.25)>.4?'cheer':null);if(leader.act!==want)leader.setAct(want);leader.update(dt,beat)}}
  var wantEx=phase==='game'&&player.act==='cheer'?1:phase==='game'&&player.act?.5:0;if(EV.run)wantEx=Math.max(wantEx,EV.excite);excite=damp(excite,wantEx,3,dt);
  crowdTick+=dt;if(crowdTick>1/30){crowdTick=0;var n=crowdSpots.length,b=crowd.base;
    for(var i=0;i<n;i++){var ph=crowd.phase[i];var lift=Math.max(0,Math.sin(T*2.2+ph))*.02+(ph<3.6?excite*Math.abs(Math.sin(Math.PI*(beat+ph*.02)))*.22:excite*.04);crowdSet(i,lift)}crowdFlush()}
  ledTex.offset.x=(T*.035)%1;boardTick(T,excite);bbqTick(dt);bbShowTick(dt);evTick(dt);pzTick(dt,beat);fieldTick(dt);dnTick(dt);
  clouds.forEach(function(c,i){c.position.x+=dt*(.6+i%3*.2)});
  if(tapMark.material.opacity>0){tapT+=dt;tapMark.material.opacity=Math.max(0,.9-tapT*1.6);var s=1+tapT*1.2;tapMark.scale.set(s,s,s)}
  if(beacon.visible)beacon.material.opacity=.85+Math.sin(T*3)*.15;
  updatePetals(dt,T);updateCam(dt);updateLabels(now);
  renderer.render(scene,camera);
}
