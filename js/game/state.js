/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= world state ================= */
var player=null,curBlock=null,npcs=[],leader=null,phase='boot';
var cam={yaw:0,pitch:.34,dist:4.8,cur:new THREE.Vector3(),look:new THREE.Vector3(),auto:0};
var PL={target:null,onArrive:null,seat:null,returnSeat:null,keys:{}};

function makePlayer(){
  if(player)player.dispose();
  player=new Char({player:true,name:myName(),uni:ME.uni,backName:ME.backName,backNum:ME.backNum,hat:ME.hat});
}
function placeForSetup(){
  scene.add(player.root);var sp=pos1B(27,6);player.root.position.set(sp[0],0,sp[1]);player.root.rotation.y=Math.PI/4+Math.PI;player.mode='stand';player.setAct(null);
}

/* NPCs */
function clearNPCs(){npcs.forEach(function(n){n.dispose();if(n.seat){n.seat.occ=null;if(n.seat.crowd>=0){crowd.hidden[n.seat.crowd]=0;crowdSet(n.seat.crowd,0)}}});npcs=[];crowdFlush()}
/* (작은 패치 S) 반응형 관객이 앉을 자리 고르기.
   · 이어진 옆 블록이 없는 구역: 예전처럼 앞줄 가운데에서 가까운 순서(NPC_COUNT명)
   · 옆 블록이 이어진(걷기 가능한 범위가 넓은) 구역 = 내야·하룰라라석: 내가 처음 서는 자리 앞쪽에 가장 몰리고,
     멀수록 듬성듬성 퍼져 앉아요. 옆 블록 자리도 쓰는데, 그 자리는 '내 구역 기준 좌표'로 바꾼 가짜 자리(proxy)를 만들어
     npc.js·crowdtalk.js·mascots.js가 거리를 잴 때 좌표가 맞게 해요 */
var NPC_SPREAD={sx:6.5,sa:4.4,sb:2.2,ahead:2.3,tail:.16,tailR:16,keep:.9};
function npcPickSeats(blk,n){
  var cand=[],ls=(blk.R-2)*RD+.55,v=new THREE.Vector3();
  blk.seats.forEach(function(s){if(s.crowd>=0)cand.push(s)});
  if(!blk.links.length){
    cand.sort(function(a,b){return (a.x*a.x+(a.z-3)*(a.z-3))-(b.x*b.x+(b.z-3)*(b.z-3))});
    return cand.slice(0,n);
  }
  blk.links.forEach(function(L){L.seats.forEach(function(s){
    if(s.crowd<0)return;
    v.set(s.x,s.y,s.z);L.g.localToWorld(v);blk.g.worldToLocal(v);
    cand.push({r:s.r,c:s.c,x:v.x,y:v.y,z:v.z,occ:null,crowd:s.crowd,block:blk,src:s});
  })});
  var K=NPC_SPREAD,cz=ls-K.ahead;
  var keyed=[];
  cand.forEach(function(s){
    var dx=s.x,dz=s.z-cz,sz=dz<0?K.sa:K.sb;
    if(Math.hypot(s.x,s.z-ls)<K.keep)return;                       /* 내가 서 있는 자리 바로 옆은 비워 둠 */
    var w=Math.exp(-.5*(dx*dx/(K.sx*K.sx)+dz*dz/(sz*sz)))+K.tail*Math.exp(-Math.hypot(dx,dz)/K.tailR);
    keyed.push({s:s,k:Math.pow(Math.random(),1/w)});                 /* 가중치 뽑기(큰 값 순서): 가까울수록 잘 뽑히고, 먼 곳도 가끔 뽑힘 */
  });
  keyed.sort(function(a,b){return b.k-a.k});
  return keyed.slice(0,n).map(function(o){return o.s});
}
function spawnNPCs(blk){
  clearNPCs();
  npcPickSeats(blk,NPC_COUNT).forEach(function(s){
    /* (작은 패치 Q) 으쓱이존에서만 반응하는 관객이 모두 내 유니폼 색. 다른 구역은 예전처럼 랜덤 */
    var n=new Char({name:pick(ADJ)+' 으쓱이',uni:blk.key==='ussk'?ME.uni:(Math.random()<.55?'red':pick(UKEYS)),backName:pick(BACKS),backNum:Math.random()<.85?Math.floor(rnd(0,100)):'',shadow:false,hat:Math.random()<HAT_RATE});
    n.seat=s;s.occ=n;crowd.hidden[s.crowd]=1;crowdSet(s.crowd,0);
    blk.g.add(n.root);sitChar(n,s);n.ai=rnd(2,12);npcs.push(n);
  });
  blk.seats.forEach(function(s){if(s.crowd>=0&&!s.occ)s.occ='crowd'});
  crowdFlush();
}
/* 으쓱이존이면 관객 색을 내 색에 맞춰요(유니폼을 바꿨을 때 mascots.js가 불러요) */
function npcUsskUni(){if(curBlock&&curBlock.key==='ussk')npcs.forEach(function(n){if(n.uk!==ME.uni)n.setUniform(ME.uni)})}
function sitChar(ch,s){ch.root.position.set(s.x,s.y+.07,s.z-.03);ch.root.rotation.y=Math.PI;ch.mode='sit';if(ch.shadow)ch.shadow.visible=false}
function standAtSeat(ch,s,blk){ch.root.position.set(s.x,blk.groundH(s.z),s.z-.32);ch.root.rotation.y=Math.PI;ch.mode='stand';if(ch.shadow)ch.shadow.visible=true}

/* leader on stage */
function makeLeader(){leader=new Char({name:'응원단장 민주',uni:'white',backName:'박민주',backNum:'V6',shadow:true});uniWhistle(leader);/* 모자는 안 씀, 대신 목에 호루라기 */leader.root.position.set(0,1.52+STAGE_DY,0);stageG.add(leader.root);leader.npc=true}
