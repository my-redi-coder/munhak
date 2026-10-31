/* ================= game flow ================= */
function fadeTo(msg,fn){var f=$('fade');$('fadeMsg').textContent=msg||'';f.classList.add('on');setTimeout(function(){fn();setTimeout(function(){f.classList.remove('on')},120)},reduceMotion?60:380)}
function enterGame(){
  fadeTo(ZONES[ME.zone].label+'으로 들어가는 중',function(){
    $('setup').hidden=true;$('hud').hidden=false;beacon.visible=false;camera.clearViewOffset();
    $('crowdN').textContent=fmt(totalCount());drawSoundIcon();
    phase='game';goZone(ME.zone,false);
    if(AU.on){auEnsure();}
    setTimeout(function(){addLabel(player,myName(),'tag',3200)},450);
    setTimeout(function(){toast('바닥을 누르면 걷고, 의자를 누르면 가서 앉아요',3600)},900);
    setTimeout(function(){toast('아래 응원하기를 누르면 응원가가 나와요',3200)},5200);
  });
}
function goZone(k,withFade){
  var run=function(){
    PL.returnSeat=null;stopAct(true);leaveSeat();PL.target=null;setStatus(null);
    if(player.root.parent)player.root.parent.remove(player.root);
    curBlock=ZB[k];curBlock.g.add(player.root);
    var sz=(curBlock.R-2)*RD+.55;player.root.position.set(0,curBlock.groundH(sz),sz);player.root.rotation.y=Math.PI;player.mode='stand';if(player.shadow)player.shadow.visible=true;
    spawnNPCs(curBlock);
    var wy=curBlock.cfg.theta+Math.PI;cam.yaw=wy+Math.PI;cam.pitch=.5;cam.dist=6.2;
    snapCam();
    $('zoneName').textContent=ZONES[k].label;ME.zone=k;store.set('zone',k);
    if(withFade)setTimeout(function(){toast(ZONES[k].label+'에 왔어요. 빈 의자를 찾아 앉아 보세요',3000)},500);
  };
  if(withFade)fadeTo(ZONES[k].label+'으로 가는 중',run);else run();
}
function leaveGame(){
  stopAct(true);beatStop();clearNPCs();clearLabels();
  $('hud').hidden=true;$('bye').hidden=false;phase='bye';
  if(AU.ctx)AU.ctx.suspend();
}
$('again').onclick=function(){
  $('bye').hidden=true;ME.adj=pick(ADJ);ME.uni=pick(UKEYS);
  if(player.root.parent)player.root.parent.remove(player.root);
  makePlayer();startSetup();if(AU.ctx&&AU.on)AU.ctx.resume();
};
function startSetup(){
  phase='setup1';$('setup').hidden=false;$('step1').hidden=false;$('step2').hidden=true;
  $('meName').textContent=myName();$('inName').value=ME.backName;$('inNum').value=ME.backNum;
  buildSwatches();buildZoneList($('zoneList'),false);placeForSetup();
  cam.yaw=player.root.rotation.y+.5;cam.dist=3.9;cam.pitch=.12;cam.auto=1;snapCam();
}
