/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= uniform-kit: 유니폼 꾸밈 (배 L · 가슴 앞 조각 · 모자 · 호루라기) =================
   (작은 패치 R) 으쓱이 22명·응원단장 민주·마스코트가 같은 유니폼을 입도록 모아 둔 부품이에요.
   필요: three.js, engine/renderer.js(canvasTex·mergeParts), core/config.js(UNI), entities/character.js(GEO) — index.html에서 character.js 바로 뒤에 불러요.
   쓰는 곳: character.js(Char의 앞 조각·모자), game/state.js(응원단장 호루라기), entities/mascot-kit.js(마스코트 배 L)

   · 배 L: 글꼴 파일 없이 'Alfa Slab One'의 대문자 L 윤곽만 따서 그려요(글꼴 라이선스 OFL, fonts/LICENSE.md). 색은 UNI[k].ink(빨강·초록은 흰색, 흰 유니폼은 빨강)
   · 가슴 앞 조각: 등판(backSeg)처럼 몸통 앞쪽에 원통 조각을 하나 더 씌워 L을 박아요. 같은 유니폼 색끼리 그림·재질을 나눠 써서 가벼워요
   · 모자: 머리(headG)에 붙여요. 색은 UNI[k].cap(흰 유니폼은 빨간 모자), 앞에 흰 L. 챙은 속이 꽉 찬 초승달 판(두께 .03)이라 모자 아랫선에서 틈 없이 이어져요
   · 호루라기: 응원단장 민주 목에 거는 검은 줄 + 은색 호루라기 */

/* ---------- 대문자 L (글꼴 단위 1000, y가 위쪽) ---------- */
var UNI_L = { path: 'M20 0V164H70V614H20V778H442V614H350V164H440V256H639V0Z', x0: 20, x1: 639, h: 778 };
var UNI_LP = new Path2D(UNI_L.path);
/* x: 캔버스 2D 그리기 도구, (cx,cy): L의 한가운데, capH: L의 높이(픽셀) */
function uniDrawL(x, cx, cy, capH, color) {
  var s = capH / UNI_L.h;
  x.save(); x.translate(cx - (UNI_L.x0 + UNI_L.x1) / 2 * s, cy + capH / 2); x.scale(s, -s);
  x.fillStyle = color; x.fill(UNI_LP); x.restore();
}

/* ---------- 가슴 앞 조각 ---------- */
GEO.frontSeg = new THREE.CylinderGeometry(.258, .309, .52, 20, 1, true, -.78, 1.56);   /* 몸통 앞쪽(+z)만, 등판 조각과 같은 방식 */
var UNI_FRONT = {};
function uniFrontMat(uk) {
  if (UNI_FRONT[uk]) return UNI_FRONT[uk];
  var u = UNI[uk];
  var tex = canvasTex(256, 302, function (x, w, h) {
    x.fillStyle = u.css; x.fillRect(0, 0, w, h);
    if (uk === 'white') { x.strokeStyle = 'rgba(29,44,79,.12)'; x.lineWidth = 2; for (var i = 10; i < w; i += 23) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } }   /* 등판과 같은 흰 유니폼 세로줄 */
    uniDrawL(x, w / 2, h * .5, 124, u.ink);
  });
  return UNI_FRONT[uk] = new THREE.MeshLambertMaterial({ map: tex });
}

/* ---------- 모자 ---------- */
GEO.cap = (function () {
  var crown = new THREE.SphereGeometry(.372, 28, 16, 0, TAU, 0, Math.PI * .5); crown.scale(1, .92, 1);
  /* 챙: 모자 아랫선(반지름 R)에서 시작해 앞으로 길어지고 양 끝(±A)에서 길이 0 → 모자에 녹아드는 초승달 판 */
  var R = .358, L = .215, A = 1.2, n = 28, sh = new THREE.Shape(), i, t;
  for (i = 0; i <= n; i++) { t = -A + 2 * A * i / n; var px = R * Math.sin(t), py = R * Math.cos(t); if (i === 0) sh.moveTo(px, py); else sh.lineTo(px, py); }
  for (i = n; i >= 0; i--) { t = -A + 2 * A * i / n; var r = R + L * Math.pow(Math.max(0, Math.cos(Math.PI / 2 * t / A)), .7); sh.lineTo(r * Math.sin(t), r * Math.cos(t)); }
  var brim = new THREE.ExtrudeGeometry(sh, { depth: .03, bevelEnabled: false });
  brim.rotateX(Math.PI / 2); brim.translate(0, .015, 0);      /* 평면의 y → 앞(+z), 두께 .03 가운데가 y=0 */
  return mergeParts([
    { g: crown, c: 0xffffff, p: [0, .09, 0] },
    { g: brim, c: 0xffffff, p: [0, .105, 0] },                /* 아랫면이 모자 아랫선(.09)과 같은 높이 */
    { g: new THREE.SphereGeometry(.035, 10, 8), c: 0xffffff, p: [0, .09 + .372 * .92, 0] }
  ]);
})();
GEO.capL = new THREE.SphereGeometry(.378, 16, 8, Math.PI / 2 - .3, .6, .42, .6); GEO.capL.scale(1, .92, 1);   /* 모자 앞면에 붙이는 L 자리 */
var UNI_CAP = {}, UNI_CAPL = {};
function uniCapMat(uk) {
  return UNI_CAP[uk] || (UNI_CAP[uk] = new THREE.MeshLambertMaterial({ color: UNI[uk].cap, vertexColors: true, side: THREE.DoubleSide }));
}
function uniCapLMat(uk) {
  if (UNI_CAPL[uk]) return UNI_CAPL[uk];
  var tex = canvasTex(160, 110, function (x, w, h) { x.clearRect(0, 0, w, h); uniDrawL(x, w / 2, h / 2, 74, '#ffffff'); });   /* 모자의 L은 늘 흰색 */
  return UNI_CAPL[uk] = new THREE.MeshLambertMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
}
/* 머리에 모자 얹기/벗기 (Char가 부름). 처음 쓸 때만 만들고 그 뒤론 보이기만 바꿈 */
function uniHat(ch, on) {
  if (on && !ch.hatG) {
    var g = ch.hatG = new THREE.Group();
    ch.hatCap = new THREE.Mesh(GEO.cap, uniCapMat(ch.uk));
    ch.hatL = new THREE.Mesh(GEO.capL, uniCapLMat(ch.uk)); ch.hatL.position.y = .09;
    [ch.hatCap, ch.hatL].forEach(function (m) { g.add(m); m.userData.char = ch; ch.meshes.push(m); });
    ch.headG.add(g);
  }
  if (ch.hatG) ch.hatG.visible = !!on;
  ch.hat = !!on;
  /* (작은 패치 S) 유니폼을 흔들 때 머리 위로 드는 유니폼 판(jersey)이 모자 속을 뚫고 지나가서 '머리에 박힌' 것처럼 보였음 →
     모자를 쓴 동안은 판을 모자 꼭대기(약 1.66) 위로 올려요. 모자가 없으면 예전 높이(1.64) 그대로 */
  if (ch.jersey) ch.jersey.position.y = on ? 1.99 : 1.64;
}

/* ---------- 응원단장 호루라기: 검은 목줄이 가슴 앞으로 V로 내려오고 은색 호루라기가 달려요 ---------- */
function uniWhistle(ch) {
  var rAt = function (y) { return .258 + .051 * ((.96 - y) / .52) + .009; };   /* 가슴 앞 조각 표면 반지름 */
  var pts = [], front = [[.16, .957], [.1, .915], [0, .872], [-.1, .915], [-.16, .957]];
  front.forEach(function (p) { pts.push(new THREE.Vector3(p[0], p[1], Math.sqrt(Math.max(.001, rAt(p[1]) * rAt(p[1]) - p[0] * p[0])))); });
  pts.push(new THREE.Vector3(-.2, .958, -.16), new THREE.Vector3(0, .958, -.262), new THREE.Vector3(.2, .958, -.16));
  var dark = new THREE.MeshLambertMaterial({ color: 0x23262b });
  var cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 48, .0075, 6, true), dark);
  var metal = new THREE.MeshPhongMaterial({ color: 0xd9dde3, shininess: 70, specular: 0x999999 });
  var wg = new THREE.Group(); wg.position.set(0, .858, rAt(.858) + .012);
  var bodyW = new THREE.Mesh(new THREE.CylinderGeometry(.026, .026, .07, 14), metal); bodyW.rotation.z = Math.PI / 2; wg.add(bodyW);
  var tip = new THREE.Mesh(new THREE.BoxGeometry(.034, .018, .026), metal); tip.position.set(-.05, -.004, 0); wg.add(tip);
  var hole = new THREE.Mesh(new THREE.BoxGeometry(.018, .004, .02), dark); hole.position.set(.004, .0265, 0); wg.add(hole);
  var g = new THREE.Group(); g.add(cord); g.add(wg);
  ch.body.add(g); ch.whistle = g;
}
