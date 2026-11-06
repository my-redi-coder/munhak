/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 확인용(?dev) =================
   주소 끝에 ?dev 가 있을 때만 켜져요. 일반 화면에는 아무것도 안 나와요.
   - 위쪽 가운데 '확인용 다이어리' 탭: 어느 화면에서든 으쓱이 다이어리(달력)로
   - 달력 맨 아래: 이 달 다 채우기 · 퍼펙트로 채우기 · 축하 화면 보기 · 비우기 (기록은 진짜 일정·결과 기준)
   ※ 다이어리를 바로 여는 주소 packing.html#diary 는 확인용이 아니라 라커룸 등에서 쓰는 진짜 기능이에요. */
(function () {
  if (!/[?&]dev(&|=|$)/.test(location.search)) return;
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'packing/dev.css'; document.head.appendChild(css);
  window.QA_STOPS = { cur: null };   // play.js가 진행 중인 판(타이머)을 멈출 수 있게 알려 줘요

  function fillMonth(kind) {
    bundleGames(ui.bundle).forEach(function (g) {
      if (kind === 'clear') { delete store.rec[g.id]; return; }
      var m = missionFor(g), E = expected(m), bag = [E.trans, E.tix];
      if (kind === 'perfect') bag.push(E.uni);   // '다 채우기'는 유니폼을 빼먹어서 실책 1개짜리 성공
      if (E.rain) bag.push('p_rain'); if (E.sun) bag.push('p_sun'); if (E.hot) bag.push('p_fan'); if (E.cold) bag.push('p_wind');
      var J = judge(m, bag.concat(E.food));
      store.rec[g.id] = { s: J.grade, miss: J.misses.map(function (x) { return x.name; }), lines: diaryLines(m, J).map(function (l) { return l.t; }) };
    });
    saveStore(); showCalendar();
  }
  /* 한 달을 퍼펙트로 채우고, 그 달 마지막 경기를 막 깬 것처럼 결과 일기(축하 문구 포함)를 바로 보여 줘요 */
  function previewCelebration() {
    fillMonth('perfect');
    var gs = bundleGames(ui.bundle), g = gs[gs.length - 1], m = missionFor(g), E = expected(m), bag = [E.trans, E.tix, E.uni];
    if (E.rain) bag.push('p_rain'); if (E.sun) bag.push('p_sun'); if (E.hot) bag.push('p_fan'); if (E.cold) bag.push('p_wind');
    var J = judge(m, bag.concat(E.food));
    showDiary(g, diaryLines(m, J), J.grade);
  }
  window.qaCalendarTools = function () {
    return h('div', { class: 'qa-row' },
      h('span', { class: 'qa-lb' }, '확인용'),
      h('button', { class: 'qa-b', onclick: function () { fillMonth('ok'); } }, '이 달 다 채우기'),
      h('button', { class: 'qa-b', onclick: function () { fillMonth('perfect'); } }, '이 달 퍼펙트로 채우기'),
      h('button', { class: 'qa-b', onclick: previewCelebration }, '축하 화면 보기'),
      h('button', { class: 'qa-b', onclick: function () { fillMonth('clear'); } }, '이 달 비우기'));
  };
  document.body.appendChild(h('button', { class: 'qa-btn', 'aria-label': '확인용: 으쓱이 다이어리 바로가기', onclick: function () {
    if (QA_STOPS.cur) { QA_STOPS.cur(); QA_STOPS.cur = null; }
    closeSheet(); showCalendar();
  } }, '확인용 다이어리'));
})();
