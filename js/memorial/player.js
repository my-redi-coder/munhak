/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/player: 내 으쓱이 =================
   야구장과 똑같은 으쓱이(entities/character.js + uniform-kit.js의 Char)를 써요. 유니폼 색·등판 이름·번호·모자는 야구장과 같은 저장값(ME)을 따라가서
   경기장에서 꾸민 모습 그대로 기념관에 나타나요. 기념관 전용 동작은 '도착 인사'(act 'hi') 하나 — character.js가 PZ_POSE에서 act 이름으로 찾아 써요. */
var PZ_POSE={hi:function(P,t){P.aZ=2.45+Math.sin(t*9)*.3;P.aX=-.15;P.bZ=-.18;P.tilt=Math.sin(t*4.5)*.04;return 'happy'}};
MH.PL={target:null,keys:{},hold:0,intro:null,dress:false};
MH.cam={yaw:0,pitch:.26,dist:4.4,cur:new THREE.Vector3(),look:new THREE.Vector3()};
MH.player=null;
function mhMakePlayer(){
  MH.player=new Char({player:true,name:myName(),uni:ME.uni,backName:ME.backName,backNum:ME.backNum,hat:ME.hat});
  scene.add(MH.player.root);
}
