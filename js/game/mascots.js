/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= mascots: 응원단상 레디·배리 =================
   모델은 js/entities/mascot-*.js, 여기서는 세우기·유니폼 따라가기·율동·포즈 타이밍만 맡아요.
   - 내 으쓱이 유니폼(ME.uni)이 바뀌면 바로 따라 입어요
   - 응원단장이 춤추면 같이 율동
   - 내가 응원하기 중이면 각자 every초마다 시그니처 포즈, together 확률로 둘이 같이
   - 누르면 바로 포즈(input.js) */
var MASCOT_CFG = {
  x: 1.42,          /* 응원단장(가운데)에서 양옆 거리 */
  y: 1.52,          /* 응원단상 윗면 높이(응원단장과 같음) */
  turn: 0.2,        /* 안쪽(응원단장 쪽)으로 살짝 트는 각도 */
  detail: 'lite',   /* 멀리 보이는 자리라 가벼운 모델 */
  every: [7, 13],   /* 랜덤 포즈 간격(초) */
  together: 0.25    /* 둘이 같이 할 확률 */
};
var MASC = { list: [], uk: null, next: [0, 0] };

function makeMascots() {
  var C = MASCOT_CFG, redi = makeRedi({ uni: ME.uni, detail: C.detail }), barry = makeBarry({ uni: ME.uni, detail: C.detail });
  /* 관중석에서 봤을 때 왼쪽 레디, 오른쪽 배리 */
  redi.root.position.set(C.x, C.y, 0); redi.root.rotation.y = -C.turn;
  barry.root.position.set(-C.x, C.y, 0); barry.root.rotation.y = C.turn;
  [redi, barry].forEach(function (m) {
    m.npc = true;
    m.root.traverse(function (o) { if (o.isMesh && o.material && o.material.side !== THREE.BackSide) o.userData.mascot = m; });
    stageG.add(m.root);
  });
  MASC.list = [redi, barry]; MASC.uk = ME.uni; mascotRoll(0); mascotRoll(1);
}
function mascotRoll(i) { var e = MASCOT_CFG.every; MASC.next[i] = e[0] + Math.random() * (e[1] - e[0]); }
function mascotMeshes() { var a = []; MASC.list.forEach(function (m) { a.push.apply(a, m.meshes); }); return a; }
function mascotTap(m) { m.signature(); }
function mascotTick(dt, beat) {
  if (!MASC.list.length) return;
  /* 유니폼 따라 입기 */
  if (MASC.uk !== ME.uni) { MASC.uk = ME.uni; MASC.list.forEach(function (m) { m.setUniform(ME.uni); }); }
  var game = phase === 'game', dance = game && leader && leader.act === 'cheer';
  /* 내가 응원하기 중일 때만 랜덤 포즈 */
  if (game && player && player.act === 'cheer' && !EV.on) {
    for (var i = 0; i < 2; i++) {
      MASC.next[i] -= dt;
      if (MASC.next[i] <= 0) {
        var a = MASC.list[i], b = MASC.list[1 - i];
        if (!a.posing()) a.signature();
        if (Math.random() < MASCOT_CFG.together) { if (!b.posing()) b.signature(); mascotRoll(1 - i); }
        mascotRoll(i);
      }
    }
  }
  MASC.list.forEach(function (m) { m.pose(dance ? 'cheer' : 'idle'); m.update(dt, beat); });
}
