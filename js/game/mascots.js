/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= mascots: 래디·배디 =================
   모델은 js/entities/mascot-*.js, 여기서는 어디에 있을지·걷기·인사·관중 반응·율동·뒤돌기를 맡아요.
   - 공격(FP.mode 'attack') = 응원단상 위. 수비(FP.mode 'defense') = 내가 앉은 구역 관중석 통로를 돌아다녀요
     · 수비가 시작될 때마다 둘 다 / 래디만 / 배디만 중 랜덤(MASCOT_CFG.show)
     · 이벤트가 공수를 바꾸면 따라가요(최정 홈런 = 공격 → 단상, 끝나면 다시 관중석)
   - 돌아다니다 내 으쓱이와 가까워지면 멈칫하고 '인사하기'가 잠깐 떠요. 지나가면 근처 관중이 "래디다!" 하고 반응해요
   - 내가 응원하기를 하면 멈춰서 응원 율동. 누르면 시그니처 포즈(덜덜덜) — 걷는 중에도 그대로
   - 응원하기 중 가끔 응원단장 민주(+ 단상에 있는 마스코트)가 뒤돌아서 응원해요
   - 여난부두 때는 폰 불빛을 들고 좌우로
   - 내 으쓱이 유니폼(ME.uni)이 바뀌면 바로 따라 입어요 */
var MASCOT_CFG = {
  x: 1.42,          /* 응원단장(가운데)에서 양옆 거리 */
  y: 1.52,          /* 응원단상 윗면 높이(응원단장과 같음) */
  turn: 0.2,        /* 안쪽(응원단장 쪽)으로 살짝 트는 각도 */
  detail: 'lite',   /* 멀리 보이는 자리라 가벼운 모델 */
  every: [7, 13],   /* 랜덤 포즈 간격(초) */
  together: 0.25,   /* 둘이 같이 할 확률 */
  /* 수비가 시작될 때 누가 나올지(래디, 배디): 셋 중 하나를 랜덤으로 */
  show: [[1, 1], [1, 0], [0, 1]],
  pop: 0.35,        /* 나타날 때 커지는 시간(초) */
  /* 관중석 걷기: 가운데 통로(위아래) + 맨 앞 통로(좌우)만 다녀요 */
  walk: { speed: 1.05, pause: [1.5, 4], front: -0.75, toPlayer: 0.35, sep: 0.75 },
  greet: { dist: 1.9, hold: 1.3, cool: 14, text: '인사하기' },
  /* 지나갈 때 근처 관중 반응: 2~3명이 말풍선, 가끔 한 명이 유니폼 흔들기 */
  react: { every: [2.5, 4.5], radius: 2.8, max: 3, cool: 9, wave: 0.25, ms: 1900 },
  lines: {
    '래디': ['래디다!', '어! 래디다!', '래디 왔다~', '래디야 이리 와!'],
    '배디': ['배디다!', '어! 배디다!', '배디 왔다~', '배디야 이리 와!']
  },
  /* 뒤돌아 응원: 응원하기 중 every초마다, hold초 동안(돌아서 율동) */
  back: { every: [15, 25], hold: 5, k: 5 }
};
var MASC = { list: [], uk: null, next: [0, 0], where: null, blk: null, s: [], bk: { on: false, t: 20, hold: 0 } };

function mascotState() { return { st: 'idle', path: [], wait: 1, cool: 1.2, react: 2, hold: 0, pop: 1, hidden: false }; }
function mascotTurnRoot(root, want, k, dt) {
  var d = Math.atan2(Math.sin(want - root.rotation.y), Math.cos(want - root.rotation.y));
  root.rotation.y += d * Math.min(1, dt * k);
}

function makeMascots() {
  var C = MASCOT_CFG, redi = makeRedi({ uni: ME.uni, detail: C.detail }), barry = makeBarry({ uni: ME.uni, detail: C.detail });
  redi.baseRot = -C.turn; barry.baseRot = C.turn;   /* 안쪽(응원단장 쪽)으로 살짝 */
  [redi, barry].forEach(function (m) {
    m.npc = true; m.baseScale = m.root.scale.x;
    m.root.traverse(function (o) { if (o.isMesh && o.material && o.material.side !== THREE.BackSide) o.userData.mascot = m; });
  });
  MASC.list = [redi, barry]; MASC.uk = ME.uni; mascotRoll(0); mascotRoll(1);
  MASC.bk.t = rnd(C.back.every[0], C.back.every[1]);
  mascotPlace('stage', false);
}
function mascotRoll(i) { var e = MASCOT_CFG.every; MASC.next[i] = e[0] + Math.random() * (e[1] - e[0]); }

/* where: 'stage'(단상) | 'stands'(내 구역 관중석). pop = 나타날 때 커지는 연출 */
function mascotPlace(where, pop) {
  var C = MASCOT_CFG, roll = where === 'stands' ? pick(C.show) : [1, 1];
  MASC.where = where; MASC.blk = curBlock;
  MASC.list.forEach(function (m, i) {
    var s = MASC.s[i] = mascotState(); m.walk(false); m.pose('idle');
    if (!roll[i]) { s.hidden = true; m.root.visible = false; return; }
    m.root.visible = true;
    if (where === 'stage') {
      stageG.add(m.root); m.root.position.set(i ? -C.x : C.x, C.y, 0); m.root.rotation.y = m.baseRot;
    } else {
      /* 내 구역 통로 입구(맨 뒤 가운데)에서 나타나요 */
      var z = curBlock.R * RD - 0.95;
      curBlock.g.add(m.root); m.root.position.set(i ? -0.25 : 0.25, curBlock.groundH(z), z); m.root.rotation.y = Math.PI;
    }
    s.pop = pop ? 0 : 1; m.root.scale.setScalar(m.baseScale * (pop ? 0.001 : 1));
  });
}
function mascotMeshes() {
  var a = []; MASC.list.forEach(function (m, i) { if (MASC.s[i] && MASC.s[i].hidden) return; a.push.apply(a, m.meshes); }); return a;
}
function mascotTap(m) { m.signature(); MASC.bk.on = false; MASC.bk.t = rnd(MASCOT_CFG.back.every[0], MASCOT_CFG.back.every[1]); }

/* ---------- 관중석 걷기 ---------- */
function mascotPickPath(m, s) {
  var W = MASCOT_CFG.walk, b = curBlock, p = m.root.position, pp = player.root.position;
  var zf = W.front, zE = b.R * RD - 0.95, lim = b.W / 2 - 0.6;
  var onCenter = Math.abs(p.x) < 0.3, onFront = Math.abs(p.z - zf) < 0.3, toP = Math.random() < W.toPlayer;
  var front = Math.random() < (pp.z < 5 ? 0.5 : 0.15), path = [];
  if (front) {
    var tx = toP ? clamp(pp.x, -lim, lim) : rnd(-lim, lim);
    if (!onFront) path.push({ x: 0, z: zf });
    path.push({ x: tx, z: zf });
  } else {
    var tz = toP ? clamp(pp.z, zf, zE) : rnd(zf, zE);
    if (!onCenter) path.push({ x: 0, z: zf });
    path.push({ x: 0, z: tz });
  }
  s.path = path; s.st = 'walk';
}
function mascotWalk(m, s, i, dt) {
  var W = MASCOT_CFG.walk, p = m.root.position, t = s.path[0];
  var dx = t.x - p.x, dz = t.z - p.z, d = Math.hypot(dx, dz);
  if (d < 0.05) {
    p.x = t.x; p.z = t.z; s.path.shift();
    if (!s.path.length) { s.st = 'idle'; s.wait = rnd(W.pause[0], W.pause[1]); m.walk(false); }
    return;
  }
  /* 둘이 부딪히지 않게: 배디가 래디 가까이면 잠깐 기다려요 */
  var o = MASC.list[1 - i], so = MASC.s[1 - i];
  if (i === 1 && so && !so.hidden && Math.hypot(o.root.position.x - p.x, o.root.position.z - p.z) < W.sep) { m.walk(false); return; }
  var st = Math.min(d, W.speed * dt); p.x += dx / d * st; p.z += dz / d * st; m.walk(true);
  mascotTurnRoot(m.root, Math.atan2(dx, dz), 10, dt);
}
/* 지나가는 마스코트에 근처 관중이 반응 */
function mascotReact(m) {
  var R = MASCOT_CFG.react, lines = MASCOT_CFG.lines[m.name], p = m.root.position, now = performance.now();
  if (!lines || EV.on) return;
  var list = npcs.filter(function (c) { return c.seat && !c.act && !c.follow && now - (c.mrAt || 0) > R.cool * 1000 && Math.hypot(c.seat.x - p.x, c.seat.z - p.z) < R.radius; })
    .sort(function (a, b) { return Math.hypot(a.seat.x - p.x, a.seat.z - p.z) - Math.hypot(b.seat.x - p.x, b.seat.z - p.z); });
  var n = Math.min(list.length, Math.floor(rnd(2, R.max + 1)));
  for (var k = 0; k < n; k++) {
    var c = list[k]; c.mrAt = now; addLabel(c, crowdPick(lines), 'say', R.ms);
    if (k === 0 && Math.random() < R.wave) { npcStart(c, 'wave'); c.ai = rnd(2.5, 4); }
  }
}
function mascotStands(m, s, i, dt, f) {
  var C = MASCOT_CFG, p = m.root.position, pp = player.root.position;
  p.y = damp(p.y, curBlock.groundH(p.z), 16, dt);
  /* 이벤트 중: 가만히(여난부두는 폰 불빛), 그라운드 쪽을 봐요 */
  if (f.ev) { m.walk(false); m.pose(f.light ? 'light' : 'idle'); mascotTurnRoot(m.root, Math.PI, 6, dt); return; }
  /* 내가 응원하기 중: 멈춰서 같이 율동 */
  if (f.cheer) { m.walk(false); m.pose('cheer'); mascotTurnRoot(m.root, Math.PI, 6, dt); s.st = s.path.length ? 'walk' : 'idle'; s.wait = Math.max(s.wait, 1); return; }
  m.pose('idle');
  if (m.posing()) { m.walk(false); return; }   /* 시그니처 포즈 중엔 제자리 */
  var d = Math.hypot(pp.x - p.x, pp.z - p.z);
  if (s.cool > 0) s.cool -= dt;
  if (s.st === 'greet') {
    s.hold -= dt; m.walk(false); mascotTurnRoot(m.root, Math.atan2(pp.x - p.x, pp.z - p.z), 12, dt);
    if (s.hold <= 0) s.st = s.path.length ? 'walk' : 'idle';
    return;
  }
  if (s.cool <= 0 && d < C.greet.dist) {   /* 마주침 → 멈칫 + 인사하기 */
    s.st = 'greet'; s.hold = C.greet.hold; s.cool = C.greet.cool; m.walk(false);
    addLabel(m, C.greet.text, 'tag', C.greet.hold * 1000); return;
  }
  s.react -= dt; if (s.react <= 0) { s.react = rnd(C.react.every[0], C.react.every[1]); mascotReact(m); }
  if (s.st === 'idle') { m.walk(false); s.wait -= dt; if (s.wait <= 0) mascotPickPath(m, s); }
  else mascotWalk(m, s, i, dt);
}

/* ---------- 뒤돌아 응원 ---------- */
function mascotBackTick(dt, where, ld) {
  var B = MASCOT_CFG.back, k = MASC.bk, posing = false;
  if (where === 'stage') MASC.list.forEach(function (m, i) { if (!MASC.s[i].hidden && m.posing()) posing = true; });
  if (!ld || posing) { if (k.on) { k.on = false; k.t = rnd(B.every[0], B.every[1]); } }
  else if (!k.on) { k.t -= dt; if (k.t <= 0) { k.on = true; k.hold = B.hold; } }
  else { k.hold -= dt; if (k.hold <= 0) { k.on = false; k.t = rnd(B.every[0], B.every[1]); } }
  /* 응원단장은 늘, 단상에 있는 마스코트도 같이 */
  if (leader) mascotTurnRoot(leader.root, k.on ? Math.PI : 0, B.k, dt);
  if (where === 'stage') MASC.list.forEach(function (m, i) {
    if (MASC.s[i].hidden) return;
    mascotTurnRoot(m.root, k.on ? Math.PI - m.baseRot : m.baseRot, B.k, dt);
  });
}

function mascotTick(dt, beat) {
  if (!MASC.list.length) return;
  var C = MASCOT_CFG;
  /* 유니폼 따라 입기 */
  if (MASC.uk !== ME.uni) { MASC.uk = ME.uni; MASC.list.forEach(function (m) { m.setUniform(ME.uni); }); }
  var game = phase === 'game', ev = !!EV.on;
  /* 어디에 있을지: 수비 = 내 구역 관중석, 그 밖엔 단상 */
  var where = (game && curBlock && FP.mode === 'defense') ? 'stands' : 'stage';
  if (MASC.where !== where || (where === 'stands' && MASC.blk !== curBlock)) mascotPlace(where, true);
  var ld = game && !!leader && leader.act === 'cheer' && !ev;      /* 응원단장이 율동 중 */
  var cheerMe = game && !!player && player.act === 'cheer' && !ev;  /* 내가 응원하기 중 */
  var dance = where === 'stage' ? ld : cheerMe, light = ev && EV.id === 'yeonan';
  /* 내가 응원하기 중일 때만 랜덤 시그니처 포즈(뒤돌아 있는 동안은 쉼) */
  if (cheerMe && !MASC.bk.on) {
    for (var i = 0; i < 2; i++) {
      if (MASC.s[i].hidden) continue;
      MASC.next[i] -= dt;
      if (MASC.next[i] <= 0) {
        var a = MASC.list[i], b = MASC.list[1 - i];
        if (!a.posing()) a.signature();
        if (Math.random() < C.together && !MASC.s[1 - i].hidden) { if (!b.posing()) b.signature(); mascotRoll(1 - i); }
        mascotRoll(i);
      }
    }
  }
  MASC.list.forEach(function (m, i) {
    var s = MASC.s[i]; if (!s || s.hidden) return;
    if (s.pop < 1) { s.pop = Math.min(1, s.pop + dt / C.pop); m.root.scale.setScalar(m.baseScale * Math.max(0.001, mascotEase(s.pop))); }
    if (where === 'stage') { m.walk(false); m.pose(light ? 'light' : (dance ? 'cheer' : 'idle')); }
    else mascotStands(m, s, i, dt, { ev: ev, cheer: cheerMe, light: light });
    m.update(dt, beat);
  });
  mascotBackTick(dt, where, ld);
}
