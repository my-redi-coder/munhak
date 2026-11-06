/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 6. 소리 · 움직임 줄이기 설정 ================= */
var AC = null;
function tone(type, f0, f1, dur, vol, delay) {
  var t = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.02);
}
function sfx(kind) {
  if (!store.snd) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    if (kind === 'thud') tone('sine', 170, 60, 0.14, 0.35);
    else if (kind === 'pop') tone('triangle', 520, 780, 0.08, 0.18);
    else if (kind === 'stamp') { tone('sine', 120, 40, 0.22, 0.5); tone('square', 90, 50, 0.08, 0.12); }
    else if (kind === 'gold') { tone('triangle', 660, 660, 0.25, 0.2); tone('triangle', 880, 880, 0.3, 0.2, 0.12); tone('triangle', 1320, 1320, 0.4, 0.2, 0.26); }
    else if (kind === 'tick') tone('square', 880, 880, 0.04, 0.06);
  } catch (e) { /* 소리가 안 나도 괜찮아요 */ }
}
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

