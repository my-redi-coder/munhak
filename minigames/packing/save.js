/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */

/* ================= 5. 저장 =================
   기록은 내 라커(shared/store.js의 LOCKER)에 보관해요: LOCKER.diaryAll() = { 경기번호: { s: 'ok'|'perfect', miss: [실책 이름], lines: [일기 줄] } }.
   경기번호는 schedule.js의 GAMES 순서(날짜순 1~144)라서 일정을 바꾸지 않는 한 그대로예요. 소리 켬/끔도 LOCKER에 있어요. */
var store = { rec: LOCKER.diaryAll(), get snd() { return LOCKER.pkSound(); }, set snd(v) { LOCKER.setPkSound(v); } };
function loadStore() { /* LOCKER가 알아서 읽어 와요 */ }
function saveStore() { LOCKER.saveDiary(); }
var RANK = { ok: 1, perfect: 2 };
function saveRecord(id, grade, misses, lines) {
  var old = store.rec[id];
  var better = !old || RANK[grade] > RANK[old.s] || (RANK[grade] === RANK[old.s] && misses.length < old.miss.length);
  if (better) { store.rec[id] = { s: grade, miss: misses, lines: lines }; saveStore(); }
  return better;
}
function bundleGames(i) { return GAMES.filter(function (g) { return BUNDLES[i].months.indexOf(g.date.m) >= 0; }); }
function bundleOf(g) { for (var i = 0; i < BUNDLES.length; i++) if (BUNDLES[i].months.indexOf(g.date.m) >= 0) return i; return 0; }
function bundleStats(i) {
  var gs = bundleGames(i), cleared = 0, perfect = 0, w = 0, d = 0, l = 0;
  /* 승·무·패는 내가 직관을 성공한 경기만 세요: 게임을 깰수록 승률이 바뀌어요 */
  gs.forEach(function (g) { var r = store.rec[g.id]; if (r) { cleared++; if (r.s === 'perfect') perfect++; if (g.result === 'W') w++; else if (g.result === 'L') l++; else d++; } });
  return { total: gs.length, cleared: cleared, perfectAll: gs.length > 0 && perfect === gs.length, done: gs.length > 0 && cleared === gs.length, w: w, d: d, l: l, rate: w + l ? w / (w + l) : 0 };
}
function kingCount() { var n = 0; for (var i = 0; i < BUNDLES.length; i++) if (bundleStats(i).perfectAll) n++; return n; }
