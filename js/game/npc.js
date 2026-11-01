/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= NPC behaviour =================
   (묶음 B) 말풍선·물결은 game/crowdtalk.js. 행동 고르는 비율(응원2·화1·흔들기1)은 그대로
   (2026-11-01) 이벤트 중·직후엔 화내기를 고르면 그냥 가만히 있어요(evCalm). 내가 직접 화내면 따라 화내는 건 그대로 */
function npcReact(a){
  var near=npcs.slice().sort(function(x,y){return Math.abs(x.seat.x-player.root.position.x)+Math.abs(x.seat.z-player.root.position.z)-(Math.abs(y.seat.x-player.root.position.x)+Math.abs(y.seat.z-player.root.position.z))});
  if(a==='cheer'){
    var n=0;near.forEach(function(c){if(Math.random()<.6){n++;c.follow=true;c.joinAt=rnd(.3,2.6);c.want='cheer'}});
    if(n)setTimeout(function(){if(player.act==='cheer')toast('주변 으쓱이 '+n+'명이 같이 응원해요',2600)},2600);
  }else if(a==='angry'){
    /* (묶음 B) 화는 몰려서: 근처 여러 명이 같이 화내요 */
    var m=0;near.slice(0,6).forEach(function(c){if(!c.act&&Math.random()<.65){m++;c.follow=true;c.joinAt=rnd(.4,2.2);c.want='angry'}});
    CROWD.last=performance.now()/1000;setTimeout(function(){crowdCalm(player.root.position.x,player.root.position.z)},rnd(5000,7000));
    if(m)setTimeout(function(){if(player.act==='angry')toast(m===1?'옆자리 으쓱이도 같이 화내요':'주변 으쓱이 '+m+'명이 같이 화내요',2600)},1600);
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
      if(n.joinAt>0){n.joinAt-=dt;if(n.joinAt<=0){npcStart(n,n.want);n.ai=n.waveFollow?rnd(3,6):rnd(6,14);crowdSay(n,n.want)}}
      else if(n.waveFollow){n.ai-=dt;if(n.ai<=0){n.follow=false;n.waveFollow=false;npcStop(n);n.ai=rnd(8,22)}}
    }else{
      n.ai-=dt;
      if(n.ai<=0){
        if(n.act){npcStop(n);n.ai=rnd(8,22)}
        else{var a=pick(['cheer','cheer','angry','wave']);
          /* 이벤트 중·직후(game/events.js의 evCalm)엔 화 대신 가만히 앉아 있어요 */
          if(a==='angry'&&typeof evCalm==='function'&&evCalm()){n.ai=rnd(4,10)}
          else{npcStart(n,a);n.ai=rnd(3,6);
            if(Math.random()<.55)toast(n.name+NPC_MSG[a],2400,true);
            crowdSay(n,a);crowdWave(a,n);
          }
        }
      }
    }
    n.update(dt,beat);
    n.root.getWorldPosition(_np);_np.y+=1;n.root.visible=_np.distanceTo(camera.position)>1.7;
  });
}
var _np=new THREE.Vector3();
