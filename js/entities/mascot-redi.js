/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 레디: 진회색 진돗개 마스코트 =================
   필요: js/entities/mascot-kit.js
   makeRedi({uni:'red'|'green'|'white', detail:'full'|'lite', scale:1})
   키 1.35(귀 끝까지). 발바닥이 y=0, 정면이 +z.
   꼭 지킬 것: 뾰족한 세모 귀, 진회색 털, 까만 굵은 눈썹·코, 흰자 있는 동그란 눈, 입 대신 작은 분홍 혀, 꼬리 없음 */
var REDI_DESIGN = {
  fur: 0x3a3b40,      /* 진회색 털 */
  earIn: 0x5a5b63,    /* 귀 안쪽(조금 밝게) */
  ink: 0x111114,      /* 눈썹·코·눈동자 */
  eyeWhite: 0xffffff,
  tongue: 0xe8798c,
  head: { y: 0.89, r: 0.31 },
  ear: { x: 0.19, y: 1.10, r: 0.15, h: 0.31, tilt: 0.42, flat: 0.45 },
  eye: { yaw: 19.5, pitch: 2, r: 0.042, pupil: 0.026 },
  brow: { yaw: 19.5, pitch: 21, arc: 0.05, thick: 0.022 },
  /* 주둥이: 통통한 윗입술 두 덩이(바깥쪽이 올라가 웃는 입) + 아래 턱 + 사이로 보이는 혀 */
  muzzle: { y: 0.79, x: 0.058, s: [0.084, 0.064, 0.066], smile: 0.36, out: 0.045, dots: 0x2a2b2f },
  chin: { y: 0.71, s: [0.075, 0.036, 0.055] },
  nose: { y: 0.843, s: [0.052, 0.032, 0.03] },
  feet: { x: 0.11, y: 0.05, s: [0.105, 0.05, 0.085] },
  arm: { x: 0.27, y: 0.52, r: 0.05, len: 0.40 },
  jersey: { yBot: 0.10, yTop: 0.60, rTop: 0.28, rBot: 0.31, zs: 0.8, vDepth: 0.28, vHalf: 0.045, stripe: 0.59 }
};

function makeRedi(o) {
  o = o || {}; var D = REDI_DESIGN, full = (o.detail || 'full') === 'full';
  var m = new Mascot({ name: '레디', uni: o.uni, detail: o.detail, scale: o.scale, rest: 0.42 });
  var fur = mkLambert(D.fur), ink = mkShiny(D.ink, 60), seg = full ? 32 : 18;

  /* 몸: 유니폼 + 어깨 덮개(유니폼 색) */
  mascotJersey(m, Object.assign({ name: '레디', num: 'V6', seg: seg }, D.jersey));
  var cap = mkLambert(mascotUni(m.uk).hex); m.uniMats = [cap];
  var sh = m.add(m.body, new THREE.Mesh(new THREE.SphereGeometry(D.jersey.rTop, seg, 10, 0, Math.PI * 2, 0, Math.PI / 2), cap));
  sh.position.y = D.jersey.yTop - 0.01; sh.scale.set(1, 0.3, D.jersey.zs);

  /* 발 */
  [1, -1].forEach(function (s) {
    var f = m.add(m.body, new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), fur));
    f.scale.set(D.feet.s[0], D.feet.s[1], D.feet.s[2]); f.position.set(D.feet.x * s, D.feet.y, 0.03);
  });

  /* 팔 */
  var armGeo = mascotCapsule(D.arm.r, D.arm.len, full ? 6 : 4);
  m.addArm(1, [D.arm.x, D.arm.y, 0], armGeo, fur); m.addArm(-1, [D.arm.x, D.arm.y, 0], armGeo, fur);

  /* 머리 */
  var hc = new THREE.Vector3(0, D.head.y, 0), head = new THREE.Group(); m.body.add(head); m.headParts = head;
  m.add(head, new THREE.Mesh(new THREE.SphereGeometry(D.head.r, seg, Math.round(seg * 0.75)), fur)).position.copy(hc);

  /* 귀: 납작한 네모뿔(정면에서 세모) + 안쪽 밝은 세모 */
  var E = D.ear;
  var earGeo = new THREE.ConeGeometry(E.r, E.h, 4); earGeo.rotateY(Math.PI / 4); earGeo.translate(0, E.h / 2, 0);
  var inGeo = new THREE.ConeGeometry(E.r * 0.62, E.h * 0.7, 4); inGeo.rotateY(Math.PI / 4); inGeo.translate(0, E.h * 0.35, 0);
  var inMat = mkLambert(D.earIn);
  [1, -1].forEach(function (s) {
    var g = new THREE.Group(); g.position.set(E.x * s, E.y, 0.02); g.rotation.z = -E.tilt * s; head.add(g);
    var e = m.add(g, new THREE.Mesh(earGeo, fur)); e.scale.z = E.flat;
    if (full) { var ei = m.add(g, new THREE.Mesh(inGeo, inMat)); ei.scale.z = E.flat; ei.position.set(0, 0.03, E.r * E.flat * 0.32); }
    m.addEar(g);
  });

  /* 눈: 흰자 + 까만 눈동자 */
  var white = mkLambert(D.eyeWhite);
  [1, -1].forEach(function (s) {
    var w = m.add(head, new THREE.Mesh(new THREE.SphereGeometry(D.eye.r, 16, 10), white)); w.scale.z = 0.35;
    mascotOnSphere(w, hc, D.head.r, D.eye.yaw * s, D.eye.pitch, -0.004);
    var p = m.add(head, new THREE.Mesh(new THREE.SphereGeometry(D.eye.pupil, 14, 8), ink)); p.scale.z = 0.4;
    mascotOnSphere(p, hc, D.head.r, (D.eye.yaw - 1.5) * s, D.eye.pitch - 1, 0.008);
  });

  /* 눈썹: 굵은 아치 */
  var B = D.brow, browGeo = new THREE.TorusGeometry(B.arc, B.thick, 6, 14, Math.PI * 0.72);
  browGeo.rotateZ(Math.PI * 0.14); browGeo.translate(0, -B.arc * 0.75, 0);
  [1, -1].forEach(function (s) {
    var b = m.add(head, new THREE.Mesh(browGeo, ink));
    mascotOnSphere(b, hc, D.head.r, B.yaw * s, B.pitch, 0.006); b.rotateZ(-0.18 * s);
  });

  /* 주둥이: 윗입술 두 덩이 + 가운데 홈 + 수염 점 + 턱 + 혀 */
  var M = D.muzzle, surf = function (y) { return Math.sqrt(D.head.r * D.head.r - Math.pow(y - D.head.y, 2)); };
  var pz = surf(M.y) - M.s[2] + M.out + M.s[2] * 0.35, padFront = pz + M.s[2];
  var dotMat = full ? mkLambert(M.dots) : null, dotGeo = full ? new THREE.SphereGeometry(0.0085, 8, 6) : null;
  [1, -1].forEach(function (s) {
    var g = new THREE.Group(); g.position.set(M.x * s, M.y, pz); g.rotation.z = M.smile * s; head.add(g);
    var pad = m.add(g, new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), fur)); pad.scale.set(M.s[0], M.s[1], M.s[2]);
    /* 웃는 입선: 윗입술 덩이 아래 테두리를 따라 바깥쪽으로 올라가는 까만 선 */
    var lip = [];
    for (var i = 0; i <= 10; i++) {
      var th = (-115 + 105 * i / 10) * Math.PI / 180, cx = Math.cos(th), cy = Math.sin(th);
      lip.push(new THREE.Vector3(cx * M.s[0] * 0.97 * s, cy * M.s[1] * 0.97, M.s[2] * 0.3));
    }
    m.add(g, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lip), 20, 0.006, 6, false), ink));
    if (full) [[0.15, 0.45], [0.45, 0.35], [0.7, 0.15], [0.3, 0.0], [0.6, -0.15], [0.35, -0.38]].forEach(function (d) {
      /* 입술 덩이 표면 위 점(d = [바깥쪽, 위아래] 비율) */
      var ux = d[0] * s, uy = d[1], uz = Math.sqrt(Math.max(0, 1 - ux * ux - uy * uy));
      var dot = m.add(g, new THREE.Mesh(dotGeo, dotMat)); dot.scale.z = 0.5;
      dot.position.set(ux * M.s[0], uy * M.s[1], uz * M.s[2]);
      dot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(ux / M.s[0], uy / M.s[1], uz / M.s[2]).normalize());
    });
  });
  if (full) {
    var groove = m.add(head, new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.06, 0.02), mkLambert(D.ink)));
    groove.position.set(0, M.y + 0.012, padFront - 0.012);
    var inside = m.add(head, new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), mkLambert(0x1a1a1d)));
    inside.scale.set(0.055, 0.03, 0.03); inside.position.set(0, M.y - 0.045, padFront - 0.05);
  }
  var C = D.chin, chin = m.add(head, new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), fur));
  chin.scale.set(C.s[0], C.s[1], C.s[2]); chin.position.set(0, C.y, surf(C.y) - C.s[2] + 0.07);
  var tg = m.add(head, new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), mkLambert(D.tongue)));
  tg.scale.set(0.046, 0.02, 0.035); tg.position.set(0, M.y - 0.058, padFront - 0.042); tg.rotation.x = -0.25;
  var nose = m.add(head, new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), ink));
  nose.scale.set(D.nose.s[0], D.nose.s[1], D.nose.s[2]); nose.position.set(0, D.nose.y, padFront - 0.012);

  m.setUniform(m.uk);
  return m;
}
