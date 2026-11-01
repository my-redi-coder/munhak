/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= mascot-kit: 레디·배리 공용 뼈대 =================
   야구장 코드를 몰라도 돌아가요(THREE만 있으면 됨). 다른 페이지에서도 이 파일 + 캐릭터 파일만 불러 쓰면 돼요.
   쓰는 법: var m=makeRedi({uni:'red'}); scene.add(m.root); 매 프레임 m.update(dt,beat);
            m.setUniform('white'); m.pose('cheer'|'idle'); m.signature();
   생김새 규칙은 docs/MASCOTS.md */

/* 유니폼 색 — core/config.js의 UNI와 같은 값(있으면 그걸 씀) */
var MASCOT_UNI = {
  red:   { hex: 0xc8102e, css: '#c8102e', ink: '#ffffff' },
  green: { hex: 0x1d6a46, css: '#1d6a46', ink: '#ffffff' },
  white: { hex: 0xf6f4ed, css: '#f6f4ed', ink: '#c8102e' }
};
function mascotUni(k) {
  var u = MASCOT_UNI[k] || MASCOT_UNI.red;
  if (typeof UNI !== 'undefined' && UNI[k]) u = { hex: UNI[k].hex, css: UNI[k].css, ink: k === 'white' ? '#c8102e' : '#ffffff' };
  return u;
}
var MASCOT_FONT = '"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif';
var MASCOT_REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* 시그니처 포즈 시간표(초): 팔 올리기 → 덜덜덜 → 팔 내리기 */
var MASCOT_SIG = { up: 0.3, shake: 1.5, down: 0.4 };

/* ---------- 작은 도구 ---------- */
function mkLambert(color, o) { o = o || {}; o.color = color; return new THREE.MeshLambertMaterial(o); }
function mkShiny(color, shininess) { return new THREE.MeshPhongMaterial({ color: color, shininess: shininess || 40, specular: 0x2a2a2a }); }
/* 머리(공) 표면의 한 점에 부품을 붙이고 바깥을 보게 함. 각도는 도(deg): yaw 좌우, pitch 위아래 */
function mascotOnSphere(mesh, center, r, yawDeg, pitchDeg, lift) {
  var yaw = yawDeg * Math.PI / 180, pitch = pitchDeg * Math.PI / 180;
  var d = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
  mesh.position.copy(center).addScaledVector(d, r + (lift || 0));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d);
  return mesh;
}
/* 바깥 윤곽선(뒤집힌 껍데기): 같은 모양을 조금 크게, 뒷면만 칠함 */
function mascotOutline(geo, color, grow, center) {
  var g = geo.clone(), c = center || new THREE.Vector3();
  g.translate(-c.x, -c.y, -c.z); g.scale(grow[0], grow[1], grow[2]); g.translate(c.x, c.y, c.z);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: color, side: THREE.BackSide }));
}
function mascotCapsule(r, len, seg) {
  /* 아래로 늘어진 캡슐(어깨가 원점) */
  var pts = [], n = seg || 6, i;
  for (i = 0; i <= n; i++) { var a = -Math.PI / 2 + Math.PI / 2 * i / n; pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r - len + r)); }
  for (i = 0; i <= n; i++) { var b = Math.PI / 2 * i / n; pts.push(new THREE.Vector2(Math.cos(b) * r, Math.sin(b) * r - r)); }
  return new THREE.LatheGeometry(pts, seg ? seg * 2 + 2 : 12);
}

/* ---------- 유니폼 ----------
   통(원통)에 그림을 감아요. 정면 = 그림의 양 끝(u=0), 등 = 그림 가운데(u=.5).
   o: { yBot, yTop, rTop, rBot, zs(앞뒤 납작), vDepth(V넥 깊이 비율), vHalf(V넥 반폭, 둘레 비율), stripe(가슴 줄 높이 비율), name, num, seg } */
function mascotJerseyTex(uk, o) {
  var u = mascotUni(uk), h = o.yTop - o.yBot, a = (o.rTop + o.rBot) / 2, b = a * o.zs;
  var circ = 2 * Math.PI * Math.sqrt((a * a + b * b) / 2);
  var W = 1024, H = Math.round(W * h / circ);
  var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  var x = cv.getContext('2d');
  x.fillStyle = u.css; x.fillRect(0, 0, W, H);
  var trim = uk === 'white' ? '#c8102e' : '#ffffff';
  /* 가슴 흰 줄: 앞쪽 반 바퀴만 */
  var sy = o.stripe * H, st = Math.max(6, H * 0.035);
  x.fillStyle = trim; x.fillRect(0, sy - st / 2, W * 0.25, st); x.fillRect(W * 0.75, sy - st / 2, W * 0.25, st);
  /* V넥(흰 테두리 선) — 정면이 그림 양 끝이라 두 번 그림 */
  x.strokeStyle = trim; x.lineWidth = Math.max(7, H * 0.035); x.lineJoin = 'miter'; x.lineCap = 'butt';
  [0, W].forEach(function (fx) {
    var vw = W * o.vHalf;
    x.beginPath(); x.moveTo(fx - vw, -4); x.lineTo(fx, o.vDepth * H); x.lineTo(fx + vw, -4); x.stroke();
  });
  /* 등판: 위에 이름, 아래 큰 V6 */
  x.fillStyle = u.ink; x.textAlign = 'center'; x.textBaseline = 'middle';
  if (o.name) { x.font = '700 ' + Math.round(H * 0.16) + 'px ' + MASCOT_FONT; x.fillText(o.name, W / 2, H * 0.24); }
  if (o.num) { x.font = '600 ' + Math.round(H * 0.42) + 'px "Helvetica Neue",Arial,' + MASCOT_FONT; x.fillText(o.num, W / 2, H * 0.62); }
  var t = new THREE.CanvasTexture(cv); t.anisotropy = 4; return t;
}
function mascotJersey(m, o) {
  var g = new THREE.CylinderGeometry(o.rTop, o.rBot, o.yTop - o.yBot, o.seg || 32, 1, true, 0, Math.PI * 2);
  var mat = mkLambert(0xffffff, { side: THREE.DoubleSide });
  var mesh = new THREE.Mesh(g, mat); mesh.position.y = (o.yTop + o.yBot) / 2; mesh.scale.z = o.zs;
  m.add(m.body, mesh);
  m.jerseyOpt = o; m.jerseyMat = mat; m.uniMats = m.uniMats || [];
  return mesh;
}

/* ---------- 뼈대 ---------- */
function Mascot(o) {
  this.name = o.name; this.uk = o.uni || 'red'; this.detail = o.detail || 'full';
  this.root = new THREE.Group(); this.body = new THREE.Group(); this.root.add(this.body);
  this.meshes = []; this.arms = []; this.ears = [];
  this.state = 'idle'; this.sigT = -1; this.t = Math.random() * 10; this.beatOff = 0;
  this.cur = { a: 0, b: 0, ax: 0, bx: 0, y: 0, tilt: 0 };
  this.rest = o.rest || 0.42; this.vUp = o.vUp || 2.5; this.shakeAmp = o.shakeAmp || 0.03;   /* 2.5 ≈ 위로 대각선 V(세로에서 약 37°) */
  if (o.scale) this.root.scale.setScalar(o.scale);
  /* 이름표 자리(머리 위). 야구장 이름표는 headG 위치 + 0.55에 떠요 */
  this.headG = new THREE.Group(); this.headG.position.y = o.labelY || 0.85; this.body.add(this.headG);
}
Mascot.prototype.add = function (parent, mesh) { parent.add(mesh); mesh.userData.mascot = this; this.meshes.push(mesh); return mesh; };
/* 팔: side +1 = 몸 +x쪽(관중이 보기엔 오른쪽), 어깨 위치에 회전축 */
Mascot.prototype.addArm = function (side, pivot, geo, mat, outline) {
  var g = new THREE.Group(); g.position.set(pivot[0] * side, pivot[1], pivot[2] || 0); this.body.add(g);
  this.add(g, new THREE.Mesh(geo, mat)); if (outline) g.add(outline);
  g.userData.side = side; this.arms.push(g); return g;
};
Mascot.prototype.addEar = function (group) { this.ears.push(group); group.userData.baseZ = group.rotation.z; return group; };
Mascot.prototype.setUniform = function (uk) {
  this.uk = uk; var u = mascotUni(uk);
  if (this.jerseyMat) { if (this.jerseyMat.map) this.jerseyMat.map.dispose(); this.jerseyMat.map = mascotJerseyTex(uk, this.jerseyOpt); this.jerseyMat.needsUpdate = true; }
  (this.uniMats || []).forEach(function (mt) { mt.color.setHex(u.hex); });
};
Mascot.prototype.pose = function (p) { this.state = p === 'cheer' ? 'cheer' : 'idle'; };
Mascot.prototype.signature = function () { this.sigT = 0; };
Mascot.prototype.posing = function () { return this.sigT >= 0; };
function mascotDamp(c, t, k, dt) { return c + (t - c) * (1 - Math.exp(-k * dt)); }
function mascotEase(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
Mascot.prototype.update = function (dt, beat) {
  dt = Math.max(0, dt || 0);   /* 첫 프레임에 dt가 음수로 올 때가 있어 포즈가 멈추던 것 막기 */
  this.t += dt; var t = this.t, R = this.rest, V = this.vUp, k = 12;
  if (beat == null) beat = t * 128 / 60;
  /* 기본 자세(a = +x팔, b = -x팔; 값이 클수록 바깥·위로) */
  var P = { a: R, b: R, ax: 0, bx: 0, y: Math.sin(t * 2) * 0.006, tilt: 0 };
  if (this.state === 'cheer') {
    /* 응원단장 으쓱이와 같은 8박 율동 */
    var bb = beat + this.beatOff, bf = Math.floor(bb), bi = ((bf % 8) + 8) % 8, f = bb - bf;
    P.y = Math.abs(Math.sin(Math.PI * bb)) * 0.05; k = 18;
    if (bi < 2) { P.a = 2.6; P.ax = -0.2; P.b = 0.32; P.tilt = -0.07; }
    else if (bi < 4) { P.b = 2.6; P.bx = -0.2; P.a = 0.32; P.tilt = 0.07; }
    else if (bi < 6) { var sw = Math.sin(Math.PI * (bb - 4) * 0.5 + Math.PI / 2); P.a = 2.7; P.b = 2.7; P.tilt = sw * 0.14; }
    else { var cl = Math.max(0, Math.sin(Math.PI * 2 * f)); P.ax = P.bx = -1.3; P.a = P.b = 0.3 - 0.24 * cl; }
  }
  /* 시그니처 포즈가 위에 덮어씀 */
  var shake = 0, S = MASCOT_SIG;
  if (this.sigT >= 0) {
    this.sigT += dt; var s = this.sigT, w;
    if (s < S.up) w = mascotEase(s / S.up);
    else if (s < S.up + S.shake) { w = 1; shake = 1; }
    else if (s < S.up + S.shake + S.down) w = 1 - mascotEase((s - S.up - S.shake) / S.down);
    else { w = 0; this.sigT = -1; if (this.onSigEnd) this.onSigEnd(this); }
    P.a += (V - P.a) * w; P.b += (V - P.b) * w; P.ax *= 1 - w; P.bx *= 1 - w; P.tilt *= 1 - w; P.y *= 1 - w;
    k = 22;
  }
  var c = this.cur; for (var key in P) c[key] = mascotDamp(c[key], P[key], k, dt);
  var amp = MASCOT_REDUCED ? 0.35 : 1, s2 = this.sigT, jy = 0, jx = 0, ja = 0, je = 0;
  if (shake) {
    jy = Math.sin(s2 * Math.PI * 2 * 11) * this.shakeAmp * amp;
    jx = Math.sin(s2 * Math.PI * 2 * 17) * this.shakeAmp * 0.3 * amp;
    ja = Math.sin(s2 * Math.PI * 2 * 15) * 0.06 * amp;
    je = Math.sin(s2 * Math.PI * 2 * 19) * 0.16 * amp;
  }
  var self = this;
  this.arms.forEach(function (g) {
    var sd = g.userData.side, v = sd > 0 ? c.a : c.b, vx = sd > 0 ? c.ax : c.bx;
    g.rotation.set(vx, 0, (v + ja * sd) * sd);
  });
  this.ears.forEach(function (g, i) { g.rotation.z = g.userData.baseZ + je * (i % 2 ? -1 : 1); });
  this.body.position.set(jx, c.y + Math.abs(jy) * 0.4 + jy, 0); this.body.rotation.z = c.tilt;
};
Mascot.prototype.dispose = function () {
  if (this.root.parent) this.root.parent.remove(this.root);
  this.root.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
};
