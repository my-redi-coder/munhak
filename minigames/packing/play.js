/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */

/* ---------- 플레이 화면 ---------- */
function pieceIcon(it) { return h('span', { class: 'pi', html: it.icon }); }

/* 아직 안 한 경기 중에서 랜덤으로 골라요. 다 했으면 무실책이 아닌 경기, 그것도 없으면 전체에서. */
function pickGame(prev) {
  var pool = GAMES.filter(function (g) { return !store.rec[g.id]; });
  if (!pool.length) pool = GAMES.filter(function (g) { return store.rec[g.id].s !== 'perfect'; });
  if (!pool.length) pool = GAMES.slice();
  if (prev && pool.length > 1) pool = pool.filter(function (g) { return g.id !== prev.id; });
  return pool[Math.floor(Math.random() * pool.length)];
}

var SHORT = { u_red: '빨강', u_green: '초록', u_white: '흰빨', u_cream: '크림' };

/* 책상에 놓일 티켓 4장: 정답 1장 + 다른 구단 3장. 같은 경기는 늘 같은 4장이 나와요. */
function ticketChoices(g) {
  var r = rng(g.id * 31 + 5), others = TEAM_KEYS.filter(function (k) { return k !== g.opp; }), i, j, t;
  for (i = others.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = others[i]; others[i] = others[j]; others[j] = t; }
  var four = [g.opp].concat(others.slice(0, 3));
  for (i = four.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = four[i]; four[i] = four[j]; four[j] = t; }
  return four.map(function (k) { return 'tk_' + k; });
}

/* 으쓱이(단발머리): 턱을 괴고 생각 중인 모습 */
var ME_SVG = '<svg viewBox="0 0 140 150" aria-hidden="true">' +
  '<g stroke="#6b3a2a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
  '<ellipse cx="70" cy="144" rx="38" ry="5" fill="rgba(0,0,0,.13)" stroke="none"/>' +
  '<path d="M31 70 Q26 22 70 20 Q114 22 109 70 L110 92 Q101 99 96 88 L44 88 Q39 99 30 92Z" fill="#4a332b"/>' +
  '<path d="M28 146 Q28 106 52 99 L88 99 Q112 106 112 146Z" fill="#d9142f"/>' +
  '<path d="M88 99 Q112 106 112 146 L98 146 Q100 114 84 102Z" fill="#b30f26" stroke="none"/>' +
  '<path d="M28 146 Q28 106 52 99 L88 99 Q112 106 112 146Z" fill="none"/>' +
  '<path d="M60 90 L60 102 Q70 108 80 102 L80 90Z" fill="#f7d3b4"/>' +
  '<path d="M54 99 L70 122 L86 99 Q70 106 54 99Z" fill="#fffaf0"/>' +
  '<path d="M38 132 Q70 138 102 132" fill="none" stroke="#fffaf0" stroke-width="3.5"/>' +
  '<ellipse cx="70" cy="62" rx="34" ry="31" fill="#fbdcc0"/>' +
  '<path d="M34 64 Q30 24 70 23 Q110 24 106 64 Q99 46 86 43 Q74 52 58 43 Q41 47 34 64Z" fill="#4a332b" stroke="none"/>' +
  '<path d="M35 62 Q41 47 58 43 Q74 52 86 43 Q99 46 105 62" fill="none"/>' +
  '<path d="M46 36 Q58 29 74 31" fill="none" stroke="#7a5a4c" stroke-width="3" opacity=".8"/>' +
  '<ellipse cx="48" cy="76" rx="6.5" ry="3.8" fill="#ff8f8f" opacity=".5" stroke="none"/>' +
  '<ellipse cx="92" cy="76" rx="6.5" ry="3.8" fill="#ff8f8f" opacity=".5" stroke="none"/>' +
  '<ellipse cx="56" cy="65" rx="5.2" ry="6.4" fill="#2a1c18" stroke="none"/>' +
  '<ellipse cx="84" cy="65" rx="5.2" ry="6.4" fill="#2a1c18" stroke="none"/>' +
  '<circle cx="58" cy="62.5" r="2.1" fill="#fff" stroke="none"/><circle cx="86" cy="62.5" r="2.1" fill="#fff" stroke="none"/>' +
  '<circle cx="54.5" cy="67.5" r="1" fill="#fff" stroke="none"/><circle cx="82.5" cy="67.5" r="1" fill="#fff" stroke="none"/>' +
  '<path d="M48 54 Q56 50 63 54" fill="none" stroke-width="2.4"/>' +
  '<path d="M77 51 Q85 47 93 52" fill="none" stroke-width="2.4"/>' +
  '<path d="M65 80 Q70 83.5 75 80" fill="none" stroke="#b0524a" stroke-width="2.4"/>' +
  '<path d="M103 126 Q116 110 98 98" fill="none" stroke-width="18"/>' +
  '<path d="M103 126 Q116 110 98 98" fill="none" stroke="#d9142f" stroke-width="12"/>' +
  '<circle cx="95" cy="93" r="9" fill="#fbdcc0"/>' +
  '<path d="M89 90 Q94 87 99 90" fill="none" stroke-width="2"/>' +
  '</g></svg>';

/* 시작 전: 오늘의 조건을 크게 보여 주고 5초 카운트다운. 게임이 시작되면 조건은 다시 볼 수 없어요. */
function briefing(g, m, go) {
  var n = 5, num = h('div', { class: 'bnum pop' }, '5'), started = false;
  var tc = TEAMS[g.opp].color;
  show(h('div', { class: 'screen brief' },
    pkBackBtn('position:absolute;left:14px;top:calc(10px + env(safe-area-inset-top, 0px))'),
    h('div', { class: 'bhead' }, '오늘의 직관 조건'),
    h('div', { class: 'bcard' },
      h('div', { class: 'bdate' }, dateText(g)),
      h('div', { class: 'bvs', style: 'background:' + tc }, (g.home ? 'vs ' : '@ ') + TEAMS[g.opp].nick),
      h('div', { class: 'bchips' }, h('span', { class: 'chip' }, g.home ? '홈경기' : '원정경기'), chipsFor(m))),
    h('div', { class: 'bnote' }, '시작하면 이 조건은 다시 볼 수 없어요. 잘 기억해요!'),
    num));
  sfx('tick');
  var iv = setInterval(function () {
    n--;
    if (n <= 0) { clearInterval(iv); if (!started) { started = true; go(); } return; }
    num.textContent = String(n); num.classList.remove('pop'); void num.offsetWidth; num.classList.add('pop'); sfx('tick');
  }, 1000);
  if (typeof QA_STOPS !== 'undefined') QA_STOPS.cur = function () { clearInterval(iv); started = true; };   // 확인용(?dev) 훅 — dev.js
}

/* 제한 시간: 깬 경기가 5개 미만이면 45초 → 45개 미만이면 30초 → 그다음(나머지 99경기)은 20초 (2026-11-08 패치 AB: 너무 쉬워서 줄임) */
function pkLimit() { var n = Object.keys(store.rec).length; return n < 5 ? 45 : n < 45 ? 30 : 20; }

function startPlay(g) {
  closeSheet();
  var m = missionFor(g);
  var P = { g: g, m: m, bag: [], food: [], step: 1, tix: ticketChoices(g), limit: pkLimit(), done: false, raf: 0, t0: 0 };

  var bar = h('i'), num = h('span', { class: 'timernum' }, String(P.limit));
  var stage = h('div', { class: 'stage' });
  var bag = h('div', { class: 'bag', 'aria-label': '직관 가방' });
  var gobar = h('div', { class: 'gobar' });
  var sndBtn = h('button', { class: 'iconbtn', 'aria-label': '소리 켜고 끄기', onclick: function () { store.snd = !store.snd; saveStore(); sndBtn.textContent = store.snd ? '🔊' : '🔇'; } }, store.snd ? '🔊' : '🔇');

  function inBag(id) { return P.bag.indexOf(id) >= 0; }
  function drag(el, it) { makeDraggable(el, it); return el; }
  function scene(name, cls, content) { return h('section', { class: 'scene ' + cls, 'aria-label': name }, h('span', { class: 'sname' }, name), content); }

  /* ----- 화면 1: 책상 (티켓 + 교통) ----- */
  function renderStage1() {
    var rots = [-2.5, 2, 1.5, -2];
    var tix = P.tix.map(function (id, i) {
      var it = ITEM[id], tm = TEAMS[id.slice(3)];
      return drag(h('div', { class: 'tkbig drag' + (inBag(id) ? ' inbag' : ''), style: '--c:' + tm.color + ';--rot:' + rots[i] + 'deg', role: 'listitem', 'aria-label': it.label }, h('div', { class: 'band' }, h('span', null, '2026 직관 티켓'), h('span', null, 'ADMIT ONE')), h('div', { class: 'main' }, h('small', null, 'SSC vs'), h('b', null, tm.nick)), h('div', { class: 'stub' }, h('small', null, '입장'), h('i', null, '1'), h('small', null, '매'))), it);
    });
    var trans = h('div', { class: 'trans' },
      drag(h('div', { class: 'tcard drag' + (inBag('t_card') ? ' inbag' : ''), role: 'listitem', 'aria-label': '교통카드', html: ITEM.t_card.icon }), ITEM.t_card),
      drag(h('div', { class: 'ttrain drag' + (inBag('t_train') ? ' inbag' : ''), role: 'listitem', 'aria-label': '기차표', html: ITEM.t_train.icon }), ITEM.t_train));
    stage.replaceChildren(h('div', { class: 'deskfull' }, h('span', { class: 'sname' }, '1/3 책상'), h('div', { class: 'tickets' }, tix), trans));
  }

  /* ----- 화면 2: 열린 옷장 (유니폼 + 소품) ----- */
  function renderStage2() {
    var rots = [-2, 1.5, -1.5, 2], pos = [[0, 0, 1], [36.8, 3, 1], [18.4, 25, 3], [55.8, 28, 3]];   // 왼쪽%, 위%, 겹치는 순서
    var hang = ['u_red', 'u_green', 'u_white', 'u_cream'].map(function (id, i) {
      var it = ITEM[id];
      return drag(h('div', { class: 'hang2 drag' + (inBag(id) ? ' inbag' : ''), style: 'left:' + pos[i][0] + '%;top:' + pos[i][1] + '%;z-index:' + pos[i][2] + ';--rot:' + rots[i] + 'deg', role: 'listitem', 'aria-label': it.label },
        h('div', { class: 'ic', html: it.icon })), it);
    });
    function prop(id) {
      var it = ITEM[id];
      return drag(h('div', { class: 'sprop drag' + (inBag(id) ? ' inbag' : ''), role: 'listitem', 'aria-label': it.label },
        h('div', { class: 'ic', html: it.icon }), h('div', { class: 'lb' }, it.label)), it);
    }
    stage.replaceChildren(h('div', { class: 'wardfull' }, h('span', { class: 'sname' }, '2/3 옷장'),
      h('div', { class: 'closet' }, h('i', { class: 'rail r1' }), h('i', { class: 'rail r2' }), hang),
      h('div', { class: 'shelf2' }, ['p_rain', 'p_sun', 'p_fan', 'p_wind'].map(prop))));
  }

  /* ----- 화면 3: 야푸는 뭐 먹지? (가방에 안 들어가요. 경기장에서 먹을 거라서) ----- */
  function toggleFood(id) {
    if (P.done) return;
    var i = P.food.indexOf(id);
    if (i >= 0) P.food.splice(i, 1); else P.food.push(id);
    sfx('pop'); renderStage3();
  }
  function renderStage3() {
    var foods = ALL_FOOD.map(function (id) {
      var it = ITEM[id], on = P.food.indexOf(id) >= 0;
      return h('button', { class: 'food' + (on ? ' on' : ''), 'aria-pressed': String(on), onclick: function () { toggleFood(id); } },
        h('span', { class: 'ic' }, it.icon), h('span', { class: 'lb' }, it.label));
    });
    stage.replaceChildren(h('div', { class: 'think' },
      h('p', { class: 'cap' }, '3/3 · 경기장에 도착해서 먹을 거라 가방엔 안 들어가요'),
      h('div', { class: 'bubble' }, h('div', { class: 'foods' }, foods)),
      h('div', { class: 'me' }, h('span', { class: 'meimg', html: ME_SVG }), h('div', { class: 'say' }, '야푸는 뭘 먹지?'))));
  }
  function renderStageNow() { if (P.step === 1) renderStage1(); else if (P.step === 2) renderStage2(); else renderStage3(); }
  function go(step) { P.step = step; sfx('tick'); renderAll(); }

  function renderGo() {
    if (P.step === 1) gobar.replaceChildren(h('button', { class: 'btn red', onclick: function () { go(2); } }, '다음'));
    else if (P.step === 2) gobar.replaceChildren(
      h('button', { class: 'btn ghost', onclick: function () { go(1); } }, '← 책상'),
      h('button', { class: 'btn red', onclick: function () { go(3); } }, '다음'));
    else gobar.replaceChildren(
      h('button', { class: 'btn ghost', onclick: function () { go(2); } }, '← 옷장'),
      h('button', { class: 'btn red', onclick: function () { finish(false); } }, '야구보러 출발!'));
  }
  function renderBag() {
    var kids = [];
    if (!P.bag.length) kids.push(h('div', { class: 'empty' }, '여기에 끌어다 담아요'));
    else {
      /* 물건은 그림 그대로 작게: 아랫줄부터 4개씩, 가방끈 뒤에 놓여요 */
      var ROT = [-5, 4, -3, 6, 3, -6, 5, -4];
      kids.push(h('div', { class: 'contents' }, P.bag.map(function (id, i) {
        var it = ITEM[id], row = i < 4 ? 0 : 1, col = row ? i - 4 : i;
        var cnt = row ? Math.min(P.bag.length - 4, 4) : Math.min(P.bag.length, 4);
        var x = 51 - ((cnt - 1) * 12 + 21) / 2 + col * 12, y = row ? 36 : 56;
        return h('button', { class: 'piece', 'aria-label': it.label + ' 꺼내기', title: it.label, style: '--x:' + x + '%;--y:' + y + '%;--r:' + ROT[i % 8] + 'deg;--z:' + (row ? 1 + col : 5 + col), onclick: function () { removeFromBag(id); } }, pieceIcon(it));
      })));
    }
    bag.replaceChildren.apply(bag, kids);
  }
  function renderAll() { renderStageNow(); renderGo(); renderBag(); }
  function shake() { bag.classList.remove('shake'); void bag.offsetWidth; if (!RM) bag.classList.add('shake'); }
  function addToBag(id) {
    if (P.done || inBag(id) || P.step === 3) return;
    var cat = ITEM[id].cat;
    if (EXCLUSIVE[cat]) P.bag = P.bag.filter(function (x) { return ITEM[x].cat !== cat; });
    P.bag.push(id); sfx('thud'); shake(); renderBag(); renderStageNow();
  }
  function removeFromBag(id) {
    if (P.done) return;
    P.bag = P.bag.filter(function (x) { return x !== id; }); sfx('pop'); renderBag(); if (P.step < 3) renderStageNow();
  }

  /* 끌어서 담기: 손가락 위쪽에 물건이 떠서 따라와요. 가볍게 톡 눌러도 담겨요(숨은 보조). */
  function overBag(x, y) { var r = bag.getBoundingClientRect(); return x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 30 && y <= r.bottom + 8; }
  function makeDraggable(el, it) {
    el.addEventListener('pointerdown', function (e) {
      if (P.done || (e.pointerType === 'mouse' && e.button !== 0)) return;
      var sx = e.clientX, sy = e.clientY, ghost = null, dragging = false, id = e.pointerId;
      try { el.setPointerCapture(id); } catch (err) { /* 일부 브라우저 */ }
      function place(cx, cy) { ghost.style.transform = 'translate(' + (cx - 46) + 'px,' + (cy - ghost.offsetHeight - 34) + 'px) scale(1.08)'; }
      function onMove(ev) {
        if (!dragging && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
          dragging = true;
          ghost = h('div', { class: 'ghost-item' }, h('div', { class: 'ic', html: it.icon }), it.cat === 'tix' ? '' : it.label);
          document.body.appendChild(ghost); el.classList.add('lifted');
        }
        if (dragging) { place(ev.clientX, ev.clientY); bag.classList.toggle('over', overBag(ev.clientX, ev.clientY - 40)); }
      }
      function end(ev, ok) {
        el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onCancel);
        try { el.releasePointerCapture(id); } catch (err) { /* 무시 */ }
        var inside = dragging && overBag(ev.clientX, ev.clientY - 40);
        if (ghost) ghost.remove(); el.classList.remove('lifted'); bag.classList.remove('over');
        if (ok && (!dragging || inside)) {
          /* 이미 담긴 물건은 다시 톡 누르면 빠져요 (끌어다 놓는 건 무시) */
          if (inBag(it.id)) { if (!dragging) removeFromBag(it.id); } else addToBag(it.id);
        }
      }
      function onUp(ev) { end(ev, true); }
      function onCancel(ev) { end(ev, false); }
      el.addEventListener('pointermove', onMove); el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onCancel);
    });
  }

  function tick(now) {
    if (P.done) return;
    var left = Math.max(0, P.limit - (now - P.t0) / 1000);
    bar.style.width = (left / P.limit * 100) + '%'; num.textContent = String(Math.ceil(left));
    bar.classList.toggle('low', left / P.limit < 0.25);
    if (left <= 0) { finish(true); return; }
    P.raf = requestAnimationFrame(tick);
  }
  function finish(timeout) {
    if (P.done) return;
    P.done = true; cancelAnimationFrame(P.raf);
    var lines, grade, J = null;
    if (timeout) { lines = timeoutLines(m); grade = 'fail'; }
    else { J = judge(m, P.bag.concat(P.food)); lines = diaryLines(m, J); grade = J.grade; }
    if (grade !== 'fail') saveRecord(g.id, grade, J.misses.map(function (x) { return x.name; }), lines.map(function (l) { return l.t; }));
    showDiary(g, lines, grade);
  }

  function begin() {
  show(h('div', { class: 'screen' },
    h('div', { class: 'topbar' },
      pkBackBtn(),
      h('h1', null, '직관 짐싸기'),
      h('button', { class: 'iconbtn', 'aria-label': '으쓱이 다이어리 보기', onclick: function () { P.done = true; cancelAnimationFrame(P.raf); showCalendar(); } }, '📖'),
      sndBtn),
    h('div', { class: 'timer', role: 'timer' }, bar, num),
    stage,
    h('div', { class: 'bagwrap' }, bag),
    gobar));
  renderAll();
  P.t0 = performance.now(); P.raf = requestAnimationFrame(tick);   // 카운트다운이 끝나면 시작!
  if (typeof QA_STOPS !== 'undefined') QA_STOPS.cur = function () { P.done = true; cancelAnimationFrame(P.raf); };   // 확인용(?dev) 훅 — dev.js
  }
  briefing(g, m, begin);
}

