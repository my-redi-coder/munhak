/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */

/* ---------- 달력 화면 ---------- */
/* ===================== 올스타 브레이크 (7/10~7/15) =====================
   홈런볼 모으기(minigames/homerun/cutscene.js·scene.js)의 올스타 컷신 그림을 가져왔어요.
   배경(하늘·조명탑·잔디·담장·관중석)과 춤추는 다섯 명·간판은 그대로, 사진 프레임만 이 게임(다이어리)에 맞게 바꿨어요. */
var BREAK_FROM = 10, BREAK_TO = 15;   // 7월
var BR_HOME_Y = 0.30;
var DANCERS = [
  { k: 'star', no: '14', name: '최정' },
  { k: 'dog', no: '20', name: '조형우' },
  { k: 'knit', no: '3', name: '정준재' },
  { k: 'cardi', no: '39', name: '김건우' },
  { k: 'vest', no: '37', name: '오태곤' }
];
function brRR(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
function brStar5(c, x, y, R, r) { c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? r : R; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } c.closePath(); }
function brChibi(c,x,y,s,d,beat){
  const sw=Math.sin(beat*Math.PI);
  c.save(); c.translate(x,y);
  const skin='#F2D2B0';
  /* 다리 */
  const pants = d.k==='knit' ? skin : '#F4F4F0';
  c.strokeStyle=pants; c.lineWidth=s*.26; c.lineCap='round';
  c.beginPath(); c.moveTo(-s*.22,-s*.1); c.lineTo(-s*.3-sw*s*.12,0); c.moveTo(s*.22,-s*.1); c.lineTo(s*.3-sw*s*.12,0); c.stroke();
  /* 몸통 */
  const bodyTop=-s*1.25, bodyH = d.k==='knit'? s*1.2 : s*1.1;
  const body={star:'#6E7B4E',dog:'#9BD34A',knit:'#4B5BD8',cardi:'#D9273A',vest:'#BFDDF3'}[d.k];
  c.fillStyle=body; brRR(c,-s*.55,bodyTop,s*1.1,bodyH,s*.25); c.fill();
  if(d.k==='knit'){ /* 무지개 지그재그 */
    const cols=['#2E6BE6','#7E4FD1','#E05AA0','#F2A3C4','#5AB7F0'];
    for(let k=0;k<5;k++){ c.strokeStyle=cols[k]; c.lineWidth=s*.13; c.beginPath();
      for(let z=0;z<=6;z++){ const zx=-s*.5+z*s/6, zy=bodyTop+s*.18+k*s*.22+(z%2?s*.08:0); z?c.lineTo(zx,zy):c.moveTo(zx,zy);} c.stroke(); }
  }
  if(d.k==='cardi'){ c.fillStyle='#8E8E8E'; brRR(c,-s*.62,bodyTop,s*.34,bodyH,s*.15); c.fill(); brRR(c,s*.28,bodyTop,s*.34,bodyH,s*.15); c.fill();
    c.fillStyle='rgba(255,255,255,.35)'; for(let k=0;k<10;k++){ c.fillRect(-s*.58+(k%2)*s*.9,bodyTop+s*.1+k*s*.09,2,2);} }
  if(d.k==='vest'){ c.fillStyle='#D61F2E'; c.beginPath(); c.moveTo(-s*.5,bodyTop+s*.1); c.lineTo(-s*.08,bodyTop+bodyH); c.lineTo(-s*.5,bodyTop+bodyH); c.fill();
    c.beginPath(); c.moveTo(s*.5,bodyTop+s*.1); c.lineTo(s*.08,bodyTop+bodyH); c.lineTo(s*.5,bodyTop+bodyH); c.fill();
    c.fillStyle='rgba(255,220,220,.7)'; for(let k=0;k<8;k++){ const sx=(k%2?1:-1)*s*(.3+(k%3)*.05); c.fillRect(sx,bodyTop+s*.3+k*s*.08,1.6,1.6);} }
  if(d.k==='star'){ c.fillStyle='#D8D2C4'; c.beginPath(); c.moveTo(-s*.25,bodyTop); c.lineTo(0,bodyTop+s*.25); c.lineTo(s*.25,bodyTop); c.fill();
    c.fillStyle='#E4C14A'; c.fillRect(s*.12,bodyTop+s*.35,s*.25,s*.08); }
  /* 팔 */
  const arm = d.k==='cardi'?'#8E8E8E': d.k==='vest'?'#BFDDF3': d.k==='knit'?'#E05AA0': d.k==='dog'?'#9BD34A':'#6E7B4E';
  const up = d.k==='vest' ? -1.25 : -.4;
  c.strokeStyle=arm; c.lineWidth=s*.22;
  const a1=up+sw*.7, a2=up-sw*.7;
  c.beginPath(); c.moveTo(-s*.5,bodyTop+s*.25); c.lineTo(-s*.5-Math.cos(a1)*s*.6,bodyTop+s*.25+Math.sin(a1)*s*.6);
  c.moveTo(s*.5,bodyTop+s*.25); c.lineTo(s*.5+Math.cos(a2)*s*.6,bodyTop+s*.25+Math.sin(a2)*s*.6); c.stroke();
  c.fillStyle= d.k==='vest'||d.k==='star' ? '#FFFFFF' : skin;
  c.beginPath(); c.arc(-s*.5-Math.cos(a1)*s*.65,bodyTop+s*.25+Math.sin(a1)*s*.65,s*.13,0,7); c.arc(s*.5+Math.cos(a2)*s*.65,bodyTop+s*.25+Math.sin(a2)*s*.65,s*.13,0,7); c.fill();
  /* 머리 */
  const hy=bodyTop-s*.55, hr=s*.6;
  if(d.k==='star'){ /* 무지개 꼬리 + 큰 별 */
    [['#F2B6C6',-.15],['#3FAE49',.12],['#9CC8EC',.38]].forEach(([col,o])=>{ c.strokeStyle=col; c.lineWidth=s*.24; c.beginPath(); c.moveTo(-hr*.6,hy+o*s); c.lineTo(-hr*2.1,hy+o*s+s*.35); c.stroke(); });
    c.fillStyle='#F4E58E'; brStar5(c,0,hy-s*.05,hr*1.75,hr*.95); c.fill(); }
  if(d.k==='knit'){ c.fillStyle='#A8743E'; brRR(c,-hr*1.12,hy-hr*.9,hr*2.24,hr*2.3,hr*.8); c.fill(); }
  c.fillStyle=skin; c.beginPath(); c.arc(0,hy,hr,0,7); c.fill();
  if(d.k==='knit'){ c.fillStyle='#A8743E'; c.beginPath(); c.ellipse(0,hy-hr*.55,hr*1.02,hr*.55,0,Math.PI,0); c.fill(); }
  if(d.k!=='star' && d.k!=='knit'){ c.fillStyle='#1E1E1E'; c.beginPath(); c.ellipse(0,hy-hr*.45,hr*.98,hr*.6,0,Math.PI,0); c.fill(); }
  if(d.k==='cardi'){ c.fillStyle='#111'; c.fillRect(-hr,hy-hr*.62,hr*2,hr*.24); c.fillStyle='#3A2A22'; c.beginPath(); c.moveTo(-hr*.14,hy+hr*.8); c.lineTo(hr*.14,hy+hr*.8); c.lineTo(0,hy+hr*1.08); c.closePath(); c.fill(); }
  if(d.k==='dog'){ c.fillStyle='#5E5E62';
    /* 진돗개처럼 위로 솟은 삼각 귀 */
    [-1,1].forEach(sd=>{ c.save(); c.translate(sd*hr*.55,hy-hr*.72); c.rotate(sd*(.28+Math.sin(beat*Math.PI)*.08));
      c.fillStyle='#5E5E62'; c.beginPath(); c.moveTo(-hr*.32,hr*.08); c.lineTo(hr*.32,hr*.08); c.lineTo(0,-hr*.78); c.closePath(); c.fill();
      c.fillStyle='#E8A9B4'; c.beginPath(); c.moveTo(-hr*.15,0); c.lineTo(hr*.15,0); c.lineTo(0,-hr*.5); c.closePath(); c.fill(); c.restore(); });
    /* 보라 줄무늬 나비넥타이 */
    const by=bodyTop+s*.08; c.fillStyle='#5B3FB8';
    c.beginPath(); c.moveTo(0,by); c.lineTo(-s*.28,by-s*.13); c.lineTo(-s*.28,by+s*.13); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0,by); c.lineTo(s*.28,by-s*.13); c.lineTo(s*.28,by+s*.13); c.closePath(); c.fill();
    c.strokeStyle='#E05AA0'; c.lineWidth=1.2; c.beginPath(); c.moveTo(-s*.22,by-s*.08); c.lineTo(-s*.22,by+s*.08); c.moveTo(s*.22,by-s*.08); c.lineTo(s*.22,by+s*.08); c.stroke();
  }
  if(d.k==='vest'){ c.fillStyle='#D61F2E'; c.beginPath(); c.moveTo(0,bodyTop+s*.08); c.lineTo(-s*.25,bodyTop-s*.04); c.lineTo(-s*.25,bodyTop+s*.2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0,bodyTop+s*.08); c.lineTo(s*.25,bodyTop-s*.04); c.lineTo(s*.25,bodyTop+s*.2); c.closePath(); c.fill(); }
  /* 얼굴 */
  if(d.k==='vest'){ c.fillStyle='#E52A2A'; brRR(c,-hr*.85,hy-hr*.22,hr*1.7,hr*.42,hr*.12); c.fill();
    c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=1; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(-hr*.8,hy-hr*.22+k*hr*.1); c.lineTo(hr*.8,hy-hr*.22+k*hr*.1); c.stroke(); } }
  else{ c.fillStyle='#1E1E1E'; c.beginPath(); c.arc(-hr*.33,hy,hr*.09,0,7); c.arc(hr*.33,hy,hr*.09,0,7); c.fill(); }
  if(d.k==='knit'){ c.fillStyle='#1E1E1E'; c.fillRect(-hr*.55,hy+hr*.18,hr*.35,hr*.1); c.fillRect(hr*.2,hy+hr*.18,hr*.35,hr*.1); }
  c.strokeStyle='#8A3A2A'; c.lineWidth=1.6; c.beginPath(); c.arc(0,hy+hr*.32,hr*.22,.2,Math.PI-.2); c.stroke();
  c.fillStyle='rgba(240,120,120,.35)'; c.beginPath(); c.arc(-hr*.55,hy+hr*.28,hr*.13,0,7); c.arc(hr*.55,hy+hr*.28,hr*.13,0,7); c.fill();
  c.restore();
}

function brScene(c, W, H, dk) {
  let g = c.createLinearGradient(0, 0, 0, H * .3);
  g.addColorStop(0, dk ? '#0B1830' : '#8EC5F0'); g.addColorStop(1, dk ? '#23385C' : '#D9EEFB');
  c.fillStyle = g; c.fillRect(0, 0, W, H * .3);
  c.fillStyle = dk ? '#FFF6D0' : '#B7C4CF';
  [[.08, .05], [.92, .05]].forEach(([x, y]) => { c.fillRect(W * x - 12, H * y, 24, 10); c.fillRect(W * x - 1.5, H * y + 10, 3, H * .2); });
  if (dk) { c.fillStyle = 'rgba(255,246,208,.18)'; [.08, .92].forEach(x => { c.beginPath(); c.arc(W * x, H * .055, 40, 0, 7); c.fill(); }); }
  g = c.createLinearGradient(0, H * .26, 0, H * .56);
  g.addColorStop(0, '#3F8A4C'); g.addColorStop(1, '#2C6B3A');
  c.fillStyle = g; c.fillRect(0, H * .26, W, H * .3);
  c.fillStyle = 'rgba(255,255,255,.05)';
  for (let k = 0; k < 6; k++) { c.beginPath(); const y0 = H * (.26 + k * .05); c.moveTo(0, y0); c.lineTo(W, y0); c.lineTo(W, y0 + H * .025); c.lineTo(0, y0 + H * .025); c.fill(); }
  c.fillStyle = '#B98552';
  c.beginPath(); c.moveTo(W * .5, H * (BR_HOME_Y + .012)); c.lineTo(W * .43, H * (BR_HOME_Y - .03)); c.lineTo(W * .5, H * (BR_HOME_Y - .06)); c.lineTo(W * .57, H * (BR_HOME_Y - .03)); c.closePath(); c.fill();
  c.fillStyle = '#fff'; c.fillRect(W * .5 - 3, H * BR_HOME_Y - 2, 6, 4);
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(W * .5, H * BR_HOME_Y); c.lineTo(-W * .05, H * .56); c.moveTo(W * .5, H * BR_HOME_Y); c.lineTo(W * 1.05, H * .56); c.stroke();
  c.fillStyle = '#1C4A2A'; c.fillRect(0, H * .555, W, H * .05);
  c.fillStyle = '#F3C83D'; c.fillRect(0, H * .555, W, 3);
  for (let r = 0; r < 9; r++) {
    const y = H * (.61 + r * .044);
    c.fillStyle = r % 2 ? (dk ? '#5A1420' : '#B3192F') : (dk ? '#6A1A27' : '#C9243A');
    c.fillRect(0, y, W, H * .044);
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, y + H * .036, W, H * .008);
  }
}
function brDraw(c, W, H, t, dk) {
  brScene(c, W, H, dk);
  const rise = Math.min(1, t / .6);
  const sy = H * (.27 + (1 - rise) * .2), sw = W * .62, sh = H * .105, sx = W * .5 - sw / 2;
  c.fillStyle = '#5B4632'; c.fillRect(sx + sw * .18, sy + sh, 6, H * .07); c.fillRect(sx + sw * .82 - 6, sy + sh, 6, H * .07);
  c.fillStyle = '#14233D'; brRR(c, sx, sy, sw, sh, 8); c.fill();
  c.strokeStyle = '#F3C83D'; c.lineWidth = 3; c.stroke();
  const stars = ['#F3C83D', '#FF6B7F', '#7FD1FF'];
  for (let k = 0; k < 7; k++) { c.fillStyle = stars[k % 3]; c.beginPath(); c.arc(sx + 10 + k * (sw - 20) / 6, sy + 7, 2.2 + Math.abs(Math.sin(t * 5 + k)) * 1.4, 0, 7); c.fill(); }
  c.textAlign = 'center'; c.fillStyle = '#fff';
  c.font = Math.round(W * .062) + 'px "Black Han Sans", sans-serif'; c.fillText('ALL-STAR BREAK', W * .5, sy + sh * .6);
  c.font = 'bold ' + Math.round(W * .03) + 'px "Gowun Dodum", sans-serif'; c.fillStyle = '#F3C83D'; c.fillText('7월 11일 올스타전 · 잠깐 쉬어가요', W * .5, sy + sh * .88);
  if (t > .5) {
    const s = W * .058;
    DANCERS.forEach((d, i) => {
      const x = W * (.14 + i * .18), beat = (t - .5) * 5.2 + i * .7;
      const hop = Math.abs(Math.sin(beat * Math.PI / 2)) * s * .55;
      brChibi(c, x, H * .545 - hop, s, d, beat);
      c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x, H * .552, s * .8 - hop * .4, s * .18, 0, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.font = Math.round(W * .03) + 'px "Black Han Sans", sans-serif';
      c.fillText(d.no + ' ' + d.name, x, H * .59);
    });
  }
}
function openBreakSheet() {
  closeSheet();
  var cv = h('canvas', { class: 'brcanvas', 'aria-label': '올스타 브레이크: 춤추는 선수들' });
  var sheet = h('div', { class: 'sheet', role: 'dialog', 'aria-label': '올스타 브레이크' },
    h('div', { style: 'display:flex;justify-content:space-between;align-items:flex-start;gap:8px' },
      h('h2', null, '7월 ' + BREAK_FROM + '일 ~ ' + BREAK_TO + '일 · 올스타 브레이크'),
      h('button', { class: 'iconbtn', 'aria-label': '닫기', onclick: closeSheet }, '✕')),
    h('div', { class: 'brframe' }, cv, h('div', { class: 'brcap' }, '후반기는 7월 16일부터!')));
  var ov = h('div', { class: 'overlay', onclick: function (e) { if (e.target === ov) closeSheet(); } }, sheet);
  document.body.appendChild(ov);
  var c = cv.getContext('2d'), r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2), start = null;
  cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); c.setTransform(d, 0, 0, d, 0, 0);
  var dk = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme !== 'light';
  function frame(now) {
    if (!document.body.contains(cv)) return;
    if (start === null) start = now;
    brDraw(c, r.width, r.width * .95, RM ? 3 : (now - start) / 1000, dk);   // 장면은 원래 비율로 그리고 아래 관중석만 살짝 잘라요
    if (!RM) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function buildCalendar() {
  var gs = bundleGames(ui.bundle), st = bundleStats(ui.bundle), b = BUNDLES[ui.bundle];
  var first = GAMES[0].date, last = GAMES[GAMES.length - 1].date;
  var startMs = Math.max(Date.UTC(2026, b.months[0] - 1, 1), Date.UTC(first.y, first.m - 1, first.d));
  var endMs = Math.min(Date.UTC(2026, b.months[b.months.length - 1], 0), Date.UTC(last.y, last.m - 1, last.d));
  var byKey = {}; gs.forEach(function (g) { byKey[g.date.m + '-' + g.date.d] = g; });

  var cells = [], lead = new Date(startMs).getUTCDay(), i;
  for (i = 0; i < lead; i++) cells.push(h('div', { class: 'cell blank' }));
  for (var t = startMs; t <= endMs; t += 86400000) {
    var dt = new Date(t), mm = dt.getUTCMonth() + 1, dd = dt.getUTCDate(), g = byKey[mm + '-' + dd];
    var label = (dd === 1 || t === startMs) ? mm + '/' + dd : String(dd);
    if (!g) {
      if (mm === 7 && dd >= BREAK_FROM && dd <= BREAK_TO) {   // 올스타 브레이크
        cells.push(h('button', { class: 'cell break', 'aria-label': '올스타 브레이크 ' + mm + '월 ' + dd + '일', onclick: openBreakSheet },
          h('span', { class: 'dn' }, label), h('span', { class: 'bstar' }, '★'), h('span', { class: 'tm', style: '--c:#2c4a8c' }, '올스타')));
        continue;
      }
      cells.push(h('div', { class: 'cell off' }, h('span', { class: 'dn' }, label))); continue;
    }
    var rec = store.rec[g.id], tm = TEAMS[g.opp];
    cells.push(h('button', { class: 'cell game' + (rec ? ' done' : ''), 'aria-label': dateText(g) + ' ' + tm.nick + '전' + (g.home ? ' 홈' : ' 원정') + (rec ? (rec.s === 'perfect' ? ' 무실책' : ' 성공') : ''), onclick: (function (gg) { return function () { openSheet(gg); }; })(g) },
      h('span', { class: 'dn' }, label),
      rec ? h('span', { class: 'stp ' + g.result }, g.result === 'W' ? '승' : g.result === 'L' ? '패' : '무') : null,
      rec && rec.s === 'perfect' ? h('span', { class: 'pstar', 'aria-label': '무실책' }, '★') : null,
      h('span', { class: 'tm', style: '--c:' + tm.color }, (g.home ? '' : '@') + tm.nick)));
  }

  var king = kingCount();
  /* 그림 달력 위에 얹기: 리본=달 이름, 리본 아래=승무패, 둥근 칸=승률, 요일 칸, 42칸 격자 */
  var card = h('div', { class: 'calcard' },
    h('div', { class: 'ctitle' }, (st.perfectAll ? '👑 ' : '') + b.label),
    h('div', { class: 'crecord' }, st.w + '승 ' + st.d + '무 ' + st.l + '패'),
    h('div', { class: 'clabel' }, '승률'),
    h('div', { class: 'crt', 'aria-label': '승률' }, st.rate.toFixed(2)),
    h('div', { class: 'cwk', 'aria-hidden': 'true' }, DOW.map(function (d) { return h('span', null, d); })),
    h('div', { class: 'cgrid' }, cells));

  return h('div', { class: 'screen' },
    h('div', { class: 'topbar' },
      pkBackBtn(),
      h('div', { style: 'flex:1' }, h('h1', null, '으쓱이 다이어리')),
      king ? h('span', { class: 'badge-gold' }, '👑 퍼펙트 ' + king + '회') : null),
    h('div', { class: 'scroll' },
      h('div', { class: 'bundles', role: 'tablist' }, BUNDLES.map(function (bb, idx) {
        var s = bundleStats(idx);
        return h('button', { class: s.perfectAll ? 'gold' : '', role: 'tab', 'aria-pressed': String(idx === ui.bundle), onclick: function () { ui.bundle = idx; showCalendar(); } }, (s.perfectAll ? '👑 ' : '') + bb.label);
      })),
      card,
      h('p', { class: 'legend' }, '일정 승패 점수는 26년 공식기록이에요. 날씨와 이벤트는 랜덤이에요.'),
      h('div', { class: 'nextbar' },
        h('button', { class: 'btn red', onclick: function () { startPlay(pickGame()); } }, '🧳 짐 싸러 가기')),
      typeof qaCalendarTools === 'function' ? qaCalendarTools() : null));   // 확인용(?dev)일 때만 있어요
}
function showCalendar() { show(buildCalendar()); }

/* ---------- 경기 팝업 ---------- */
function chipsFor(m) {
  return [
    h('span', { class: 'chip' }, m.weather === 'rain' ? '🌧️ 가랑비' : m.weather === 'cloud' ? '☁️ 구름 낌' : '☀️ 해가 쨍'),
    h('span', { class: 'chip' }, m.temp === 'hot' ? '🥵 더운 날' : '🥶 쌀쌀한 날'),
    m.event ? h('span', { class: 'chip event' }, '🎉 ' + EVENTS[m.event].name) : null
  ];
}
function openSheet(g) {
  closeSheet();
  var m = missionFor(g), tm = TEAMS[g.opp], rec = store.rec[g.id];
  var sheet = h('div', { class: 'sheet', role: 'dialog', 'aria-label': dateText(g) },
    h('div', { style: 'display:flex;justify-content:space-between;align-items:flex-start;gap:8px' },
      h('h2', null, dateText(g) + (rec ? ' · ' + stadiumOf(g) : '')),   // 직관 전에는 구장도 비밀
      h('button', { class: 'iconbtn', 'aria-label': '닫기', onclick: closeSheet }, '✕')),
    /* 네모 안: 진짜 경기 정보 / 그 아래 칩: 게임 속 조건 / 그다음 내 일기 / 맨 끝에 짐싸기 버튼 */
    h('div', { class: 'sec real' },
      h('div', { class: 'chips' },
        h('span', { class: 'chip', style: 'background:' + tm.color + ';color:#fff;border-color:transparent' }, (g.home ? 'vs ' : '@ ') + tm.nick),
        h('span', { class: 'chip' }, g.home ? '홈경기' : '원정경기')),
      rec ? h('div', { class: 'board' }, h('span', null, 'SSC'), h('b', null, g.score[0] + ' : ' + g.score[1]), h('span', null, tm.nick),
                h('em', { class: 'res ' + g.result }, g.result === 'W' ? '승' : g.result === 'L' ? '패' : '무'))
          : h('div', { class: 'board hide' }, h('span', null, 'SSC'), h('b', null, '? : ?'), h('span', null, tm.nick))),
    h('div', { class: 'chips' }, rec ? chipsFor(m) : [0, 1, 2].map(function () { return h('span', { class: 'chip', style: 'color:var(--sub)' }, '???'); })),   // 직관 전에는 조건 스포 방지
    rec ? h('div', null, h('h3', null, '내 일기'), h('div', { class: 'mini-diary' }, rec.lines.map(function (t) { return h('p', null, t); }))) : null,
    h('div', { style: 'margin-top:14px' }, h('button', { class: 'btn red', style: 'width:100%', onclick: function () { closeSheet(); startPlay(g); } }, rec ? '다시 짐싸기' : '짐 싸러 가기')));
  var ov = h('div', { class: 'overlay', onclick: function (e) { if (e.target === ov) closeSheet(); } }, sheet);
  document.body.appendChild(ov);
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

