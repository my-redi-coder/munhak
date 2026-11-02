/* ================= world state ================= */
var player=null,curBlock=null,npcs=[],leader=null,phase='boot';
var cam={yaw:0,pitch:.34,dist:4.8,cur:new THREE.Vector3(),look:new THREE.Vector3(),auto:0};
var PL={target:null,onArrive:null,seat:null,returnSeat:null,keys:{}};

function makePlayer(){
  if(player)player.dispose();
  player=new Char({player:true,name:myName(),uni:ME.uni,backName:ME.backName,backNum:ME.backNum});
}
function placeForSetup(){
  scene.add(player.root);var sp=pos1B(27,6);player.root.position.set(sp[0],0,sp[1]);player.root.rotation.y=Math.PI/4+Math.PI;player.mode='stand';player.setAct(null);
}

/* NPCs */
function clearNPCs(){npcs.forEach(function(n){n.dispose();if(n.seat){n.seat.occ=null;if(n.seat.crowd>=0){crowd.hidden[n.seat.crowd]=0;crowdSet(n.seat.crowd,0)}}});npcs=[];crowdFlush()}
function spawnNPCs(blk){
  clearNPCs();
  var occ=blk.seats.filter(function(s){return s.crowd>=0});
  occ.sort(function(a,b){return (a.x*a.x+(a.z-3)*(a.z-3))-(b.x*b.x+(b.z-3)*(b.z-3))});
  occ.slice(0,22).forEach(function(s){
    var n=new Char({name:pick(ADJ)+' 으쓱이',uni:Math.random()<.55?'red':pick(UKEYS),backName:pick(BACKS),backNum:Math.random()<.85?Math.floor(rnd(0,100)):'',shadow:false});
    n.seat=s;s.occ=n;crowd.hidden[s.crowd]=1;crowdSet(s.crowd,0);
    blk.g.add(n.root);sitChar(n,s);n.ai=rnd(2,12);npcs.push(n);
  });
  blk.seats.forEach(function(s){if(s.crowd>=0&&!s.occ)s.occ='crowd'});
  crowdFlush();
}
function sitChar(ch,s){ch.root.position.set(s.x,s.y+.07,s.z-.03);ch.root.rotation.y=Math.PI;ch.mode='sit';if(ch.shadow)ch.shadow.visible=false}
function standAtSeat(ch,s,blk){ch.root.position.set(s.x,blk.groundH(s.z),s.z-.32);ch.root.rotation.y=Math.PI;ch.mode='stand';if(ch.shadow)ch.shadow.visible=true}

/* leader on stage */
function makeLeader(){leader=new Char({name:'응원단장 민주',uni:'white',backName:'박민주',backNum:'V6',shadow:true});leader.root.position.set(0,1.52,0);stageG.add(leader.root);leader.npc=true}
