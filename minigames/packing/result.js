/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */

/* ---------- 일기 결과 화면 ---------- */
function showDiary(g, lines, grade) {
  var ledgerLine = null, bodyLines = [];
  lines.forEach(function (l) { if (l.t.indexOf('오늘의 실책: ') === 0) ledgerLine = l; else bodyLines.push(l); });
  var bodyEls = bodyLines.map(function (l) { return h('div', { class: 'l ' + (l.k || '') }, l.t); });
  var ledEl = ledgerLine ? h('div', { class: 'l ledger' + (grade === 'perfect' ? ' clean' : '') }, h('small', null, '오늘의 실책'), h('b', null, ledgerLine.t.slice(ledgerLine.t.indexOf(': ') + 2))) : null;
  var els = ledEl ? bodyEls.concat([ledEl]) : bodyEls;
  var stampText = grade === 'fail' ? '실패' : '성공';
  var stamp = h('div', { class: 'bigstamp ' + (grade === 'fail' ? 'fail' : 'ok'), 'aria-label': stampText }, stampText);
  var stamp2 = grade === 'perfect' ? h('div', { class: 'bigstamp clean', 'aria-label': '무실책' }, '무실책 ✓') : null;
  var paper = h('div', { class: 'paper', 'aria-live': 'polite' }, h('div', { class: 'pbody' }, bodyEls), ledEl || '', stamp, stamp2 || '');
  var after = h('div', { class: 'after' });
  var hint = h('div', { class: 'skiphint' }, '화면을 누르면 빨리 넘어가요');
  var timers = [], finished = false;

  function finishReveal() {
    if (finished) return; finished = true;
    timers.forEach(clearTimeout);
    els.forEach(function (e) { e.classList.add('on'); });
    hint.remove();
    setTimeout(function () {
      stamp.classList.add('on'); sfx('stamp');
      if (stamp2) setTimeout(function () { stamp2.classList.add('on'); sfx('gold'); }, RM ? 0 : 450);
      var bi = bundleOf(g), st = bundleStats(bi), kids = [];
      if (grade === 'perfect' && st.perfectAll) kids.push(h('div', { class: 'kingbanner' }, [['8%', '22%', 0], ['20%', '72%', .5], ['25%', '12%', 1.1], ['66%', '76%', .3], ['80%', '18%', .8], ['92%', '66%', 1.4]].map(function (p, i) { return h('span', { class: 'spk', 'aria-hidden': 'true', style: 'left:' + p[0] + ';top:' + p[1] + ';animation-delay:' + p[2] + 's;font-size:' + (i % 2 ? 12 : 16) + 'px' }, i % 3 === 2 ? '★' : '✦'); }), h('div', { style: 'font-size:18px' }, '👑 ' + BUNDLES[bi].label + ' 퍼펙트!'), h('div', { style: 'font-size:13.5px;font-weight:normal;margin-top:2px' }, '이 달 모든 경기를 무실책으로 해냈어요')));
      else if (grade === 'ok') kids.push(h('p', { class: 'notice', style: 'text-align:center' }, '다시 짐싸서 무실책에 도전할 수 있어요. 더 잘한 기록만 남아요.'));
      var again = h('button', { class: 'btn ' + (grade === 'fail' ? 'red' : 'ghost'), onclick: function () { startPlay(g); } }, '이 경기 다시 짐싸기');
      var next = h('button', { class: 'btn ' + (grade === 'fail' ? 'ghost' : 'red'), onclick: function () { startPlay(pickGame(g)); } }, '다음 경기 짐 싸러 가기');
      if (grade === 'fail') kids.push(again, next); else { kids.push(next); if (grade === 'ok') kids.push(again); }
      kids.push(h('button', { class: 'btn ghost', onclick: function () { ui.bundle = bundleOf(g); showCalendar(); } }, '📖 으쓱이 다이어리 보기'));
      after.replaceChildren.apply(after, kids);
      if (grade === 'perfect' && st.perfectAll) sfx('gold');
    }, RM ? 0 : 120);
  }
  els.forEach(function (e, i) { timers.push(setTimeout(function () { if (!finished) { e.classList.add('on'); sfx('tick'); } }, RM ? 0 : 700 * (i + 1))); });
  timers.push(setTimeout(finishReveal, RM ? 0 : 700 * (els.length + 1)));
  paper.addEventListener('click', finishReveal);

  show(h('div', { class: 'screen' },
    h('div', { class: 'topbar' }, pkBackBtn(), h('h1', null, '직관 일기'), h('span', { class: 'sub' }, dateText(g))),
    h('div', { class: 'scroll' }, paper, hint, after)));
}

