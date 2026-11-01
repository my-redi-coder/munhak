/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 배리: 이빨(어금니) 마스코트 =================
   필요: js/entities/mascot-kit.js
   makeBarry({uni:'red'|'green'|'white', detail:'full'|'lite', scale:1})
   설계 키 1.35(봉우리 끝까지)에 size 0.86을 곱해 실제 키 약 1.16 — 몸통이 레디와 같은 크기. 뿌리 끝이 y=0, 정면이 +z.
   꼭 지킬 것: 위가 두 봉우리인 어금니 머리, 뿌리 두 개가 다리, 미색 + 반짝 하이라이트,
              입 없음, 까만 점 눈(안광 없음), 분홍 볼터치는 늘 있음(포즈 중에도), 무표정 */
var BARRY_DESIGN = {
  size: 0.86,         /* 전체 크기 배율 — 몸통(유니폼) 폭이 레디와 같아지게(2026-11-01) */
  ivory: 0xf5efe0,
  ivoryLit: 0xf8dfe6, /* 빛 받는 부분 색(야구장 초록 반사를 상쇄하려고 살짝 분홍기) */   /* 미색. 빛을 덜 타게(일부는 스스로 빛나게) 칠해서 야구장 빛 아래서도 하얗게 날아가지 않음 */
  line: 0xd6ccb0,     /* 베이지 윤곽선 */
  eye: 0x2b2b2b,
  blush: 0xe8b4b4,
  /* 왕관: 정면 윤곽(바깥 테두리 기준) + 앞뒤 두께. 가운데(cy)에서 사방으로 둥글게 부풀린 모양이라
     옆에서 봐도 통통한 원통 느낌. depth = 앞뒤 반두께, round = 둥근 정도(1이면 타원, 작을수록 각짐) */
  crown: { halfW: 0.35, botSide: 0.585, botMid: 0.53, waist: 0.95, shoulder: 1.2, peakX: 0.17, peakY: 1.35, notchY: 1.28,
           cy: 0.94, depth: 0.31, round: 0.72 },
  eyes: { x: 0.145, y: 0.96, r: 0.037 },
  cheeks: { x: 0.21, y: 0.85, s: [0.05, 0.026, 0.008] },
  shine: { x: -0.15, y: 1.21, r: 0.10, from: 1.6, to: 2.8, thick: 0.024 },
  roots: { x: 0.077, top: 0.17, r: 0.045, tilt: 0.08 },
  arm: { x: 0.34, y: 0.60, r: 0.045, len: 0.30 },
  jersey: { yBot: 0.142, yTop: 0.60, rTop: 0.345, rBot: 0.36, zs: 0.68, vDepth: 0.22, vHalf: 0.032, stripe: 0.49 }
};

function barryCrownShape(C) {
  var s = new THREE.Shape(), w = C.halfW, px = C.peakX;
  s.moveTo(-w + 0.02, C.botSide);
  s.quadraticCurveTo(0, C.botMid - (C.botSide - C.botMid), w - 0.02, C.botSide);   /* 아래: 가운데가 처진 곡선 */
  s.lineTo(w, C.waist);
  s.bezierCurveTo(w, C.shoulder, w - 0.03, C.peakY, px, C.peakY);                   /* 오른쪽 봉우리 */
  s.quadraticCurveTo(px * 0.45, C.peakY, 0, C.notchY);                               /* 가운데 오목 */
  s.quadraticCurveTo(-px * 0.45, C.peakY, -px, C.peakY);                             /* 왼쪽 봉우리 */
  s.bezierCurveTo(-w + 0.03, C.peakY, -w, C.shoulder, -w, C.waist);
  s.lineTo(-w + 0.02, C.botSide);
  return s;
}

/* 가운데(0,cy)에서 각도 phi 방향으로 윤곽까지의 거리 */
function barryRay(P, cy, phi) {
  var dx = Math.cos(phi), dy = Math.sin(phi), best = 0;
  for (var i = 0; i < P.length; i++) {
    var a = P[i], b = P[(i + 1) % P.length], ex = b.x - a.x, ey = b.y - a.y, ax = a.x, ay = a.y - cy;
    var den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    var t = (ax * ey - ay * ex) / den, u = (ax * dy - ay * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t > best) best = t;
  }
  return best;
}
function barrySe(v, e) { return Math.sign(v) * Math.pow(Math.abs(v), e); }
/* 왕관 몸통: 윤곽을 따라 앞뒤로 둥글게 부풀린 면 */
function barryCrownGeo(C, nu, nv) {
  var P = barryCrownShape(C).getPoints(48), R = [], pos = [], idx = [], i, j;
  for (i = 0; i < nu; i++) R.push(barryRay(P, C.cy, i / nu * Math.PI * 2));
  for (j = 0; j <= nv; j++) {
    var th = -Math.PI / 2 + Math.PI * j / nv, cz = barrySe(Math.cos(th), C.round), sz = barrySe(Math.sin(th), C.round);
    for (i = 0; i < nu; i++) { var ph = i / nu * Math.PI * 2; pos.push(R[i] * Math.cos(ph) * cz, C.cy + R[i] * Math.sin(ph) * cz, C.depth * sz); }
  }
  for (j = 0; j < nv; j++) for (i = 0; i < nu; i++) {
    var a = j * nu + i, b = j * nu + (i + 1) % nu, c = a + nu, d = b + nu;
    idx.push(a, b, d, a, d, c);
  }
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  g.computeVertexNormals();
  /* 앞·뒤 한가운데(모든 줄이 모이는 점)는 방향을 곧게 정해 줘야 얼굴에 주름 같은 그늘이 안 생겨요 */
  var nr = g.attributes.normal;
  for (i = 0; i < nu; i++) { nr.setXYZ(i, 0, 0, -1); nr.setXYZ(nv * nu + i, 0, 0, 1); }
  g.userData.P = P; return g;
}
/* 앞면 위 한 점(x,y)의 z와 바깥 방향 */
function barryFront(C, P, x, y, lift) {
  function z(x, y) {
    var dx = x, dy = y - C.cy, r = Math.hypot(dx, dy), Rr = barryRay(P, C.cy, Math.atan2(dy, dx)), rho = Math.min(1, r / Rr);
    var cth = Math.pow(rho, 1 / C.round), sth = Math.sqrt(Math.max(0, 1 - cth * cth));
    return C.depth * Math.pow(sth, C.round);
  }
  var e = 0.004, z0 = z(x, y), n = new THREE.Vector3(-(z(x + e, y) - z(x - e, y)) / (2 * e), -(z(x, y + e) - z(x, y - e)) / (2 * e), 1).normalize();
  return { p: new THREE.Vector3(x, y, z0).addScaledVector(n, lift || 0), n: n };
}
function barryStick(mesh, f) { mesh.position.copy(f.p); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.n); return mesh; }

function makeBarry(o) {
  o = o || {}; var D = BARRY_DESIGN, full = (o.detail || 'full') === 'full';
  var m = new Mascot({ name: '배리', uni: o.uni, detail: o.detail, scale: (o.scale || 1) * D.size, rest: 0.5, shakeAmp: 0.028, labelY: 0.8 });
  var ivory = new THREE.MeshPhongMaterial({ color: new THREE.Color(D.ivoryLit).multiplyScalar(0.28), emissive: new THREE.Color(D.ivory).multiplyScalar(0.61), shininess: 12, specular: 0x080808 }), C = D.crown, seg = full ? 32 : 18;

  /* 유니폼(왕관 아랫부분을 감쌈) */
  mascotJersey(m, Object.assign({ name: '배리', num: 'V6', seg: seg }, D.jersey));

  /* 왕관(머리 겸 몸): 정면 윤곽을 앞뒤로 둥글게 부풀림 */
  var cg = barryCrownGeo(C, full ? 72 : 40, full ? 26 : 16), CP = cg.userData.P;
  m.add(m.body, new THREE.Mesh(cg, ivory));
  m.body.add(mascotOutline(cg, D.line, [1.03, 1.02, 1.03], new THREE.Vector3(0, C.cy, 0)));

  /* 뿌리 다리: 아래가 뾰족한 물방울 */
  var R = D.roots, pts = [], i;
  for (i = 0; i <= 10; i++) { var t = i / 10; pts.push(new THREE.Vector2(R.r * Math.sin(Math.PI / 2 * Math.pow(t, 0.75)) * (t < 1 ? 1 : 1), R.top * t)); }
  pts.push(new THREE.Vector2(0.001, R.top));
  var rootGeo = new THREE.LatheGeometry(pts, full ? 16 : 10);
  [1, -1].forEach(function (s) {
    var g = new THREE.Group(); g.position.set(R.x * s, 0, 0); g.rotation.z = R.tilt * s; m.body.add(g);
    m.add(g, new THREE.Mesh(rootGeo, ivory));
    if (full) g.add(mascotOutline(rootGeo, D.line, [1.14, 1.04, 1.14], new THREE.Vector3(0, R.top / 2, 0)));
  });

  /* 팔: 미색 짧은 캡슐 */
  var armGeo = mascotCapsule(D.arm.r, D.arm.len, full ? 6 : 4);
  [1, -1].forEach(function (s) {
    var ol = full ? mascotOutline(armGeo, D.line, [1.16, 1.06, 1.16], new THREE.Vector3(0, -D.arm.len / 2, 0)) : null;
    m.addArm(s, [D.arm.x, D.arm.y, 0], armGeo, ivory, ol);
  });

  /* 얼굴: 까만 점 눈(안광 없음) + 분홍 볼터치(늘 있음). 입 없음 */
  var eyeMat = mkLambert(D.eye), blush = mkLambert(D.blush);
  [1, -1].forEach(function (s) {
    var e = m.add(m.body, new THREE.Mesh(new THREE.SphereGeometry(D.eyes.r, 16, 10), eyeMat)); e.scale.z = 0.3;
    barryStick(e, barryFront(C, CP, D.eyes.x * s, D.eyes.y, 0.002));
    var b = m.add(m.body, new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), blush)); b.scale.set(D.cheeks.s[0], D.cheeks.s[1], D.cheeks.s[2]);
    barryStick(b, barryFront(C, CP, D.cheeks.x * s, D.cheeks.y, 0.001));
  });

  /* 반짝 하이라이트: 왼쪽 위 흰 곡선(면을 따라 휘게) */
  var S = D.shine, sp = [];
  for (var k = 0; k <= 12; k++) {
    var a2 = S.from + (S.to - S.from) * k / 12;
    sp.push(barryFront(C, CP, S.x + Math.cos(a2) * S.r, S.y - S.r * 0.4 + Math.sin(a2) * S.r, 0.006).p);
  }
  m.add(m.body, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), 24, S.thick, 6, false), new THREE.MeshBasicMaterial({ color: 0xffffff })));

  m.setUniform(m.uk);
  return m;
}
