/* ================= NPC behaviour ================= */
function npcReact(a){
  var near=npcs.slice().sort(function(x,y){return Math.abs(x.seat.x-player.root.position.x)+Math.abs(x.seat.z-player.root.position.z)-(Math.abs(y.seat.x-player.root.position.x)+Math.abs(y.seat.z-player.root.position.z))});
  if(a==='cheer'){
    var n=0;near.forEach(function(c){if(Math.random()<.6){n++;c.follow=true;c.joinAt=rnd(.3,2.6);c.want='cheer'}});
    if(n)setTimeout(function(){if(player.act==='cheer')toast('주변 으쓱이 '+n+'명이 같이 응원해요',2600)},2600);
  }else if(a==='angry'){
    var c=near[0];if(c&&Math.random()<.8){c.follow=true;c.joinAt=rnd(.6,1.4);c.want='angry';setTimeout(function(){if(player.act==='angry')toast('옆자리 '+c.name+'님도 같이 화내요',2600)},1500)}
  }else if(a==='wave'){
    var cnt=0;near.slice(0,8).forEach(function(c){if(Math.random()<.45){cnt++;c.follow=true;c.joinAt=rnd(.5,2.5);c.want='wave'}});
    if(cnt)setTimeout(function(){if(player.act==='wave')toast(cnt===1?'옆자리 으쓱이도 유니폼을 흔들어요':'주변 으쓱이 '+cnt+'명이 같이 유니폼을 흔들어요',2600)},2200);
  }
}
var NPC_MSG={cheer:'님이 응원을 시작했어요',angry:'님이 화를 내고 있어요',wave:'님이 유니폼을 흔들었어요'};
function npcStart(n,a){if(n.mode==='sit')standAtSeat(n,n.seat,curBlock);n.setAct(a)}
function npcStop(n){n.setAct(null);sitChar(n,n.seat)}
function updateNPCs(dt,beat){
  npcs.forEach(function(n){
    if(n.follow){
      if(n.joinAt>0){n.joinAt-=dt;if(n.joinAt<=0){npcStart(n,n.want);n.ai=rnd(6,14)}}
    }else{
      n.ai-=dt;
      if(n.ai<=0){
        if(n.act){npcStop(n);n.ai=rnd(8,22)}
        else{var a=pick(['cheer','cheer','angry','wave']);npcStart(n,a);n.ai=rnd(3,6);
          if(Math.random()<.55)toast(n.name+NPC_MSG[a],2400,true);
          if(a==='angry'&&Math.random()<.6)addLabel(n,pick(LINES.angry),'angry',2200);
        }
      }
    }
    n.update(dt,beat);
    n.root.getWorldPosition(_np);_np.y+=1;n.root.visible=_np.distanceTo(camera.position)>1.7;
  });
}
var _np=new THREE.Vector3();
