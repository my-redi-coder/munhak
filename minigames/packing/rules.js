/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 3. 규칙 =================
   expected: 경기 조건에 맞는 정답 가방 / judge: 담은 물건을 채점(실패·성공·퍼펙트) */
function expected(m) {
  var g = m.game, st = m.stadium, dome = st === '고척', home = g.home, dow = g.date.dow;
  var far = !home && !TEAMS[g.opp].metro;
  var uni;
  if (m.event === 'red') uni = 'u_red';
  else if (m.event === 'green') uni = 'u_green';
  else if (m.event === 'incheon') uni = 'u_cream';
  else if (!home) uni = 'u_red';
  else if (dow === 5 || dow === 6) uni = 'u_green';
  else if (dow === 0) uni = 'u_cream';
  else uni = 'u_white';
  var food;
  if (m.event === 'nofood') food = [];
  else if (m.event === 'friend') food = ALL_FOOD.slice();
  else food = FOOD_AT[st].slice();
  return {
    trans: far ? 't_train' : 't_card',
    tix: 'tk_' + g.opp,
    uni: uni,
    rain: m.weather === 'rain' && !dome,
    sun: m.weather === 'sun' && !dome,
    hot: m.temp === 'hot', cold: m.temp === 'cold',
    food: food, dome: dome
  };
}

function judge(m, bag) {
  var E = expected(m), has = function (id) { return bag.indexOf(id) >= 0; };
  var first = function (cat) { return bag.filter(function (i) { return ITEM[i].cat === cat; })[0] || null; };
  var J = { E: E, bag: bag, trans: first('trans'), tix: first('tix'), misses: [] };
  J.transFail = J.trans !== E.trans;
  J.tixFail = J.tix !== E.tix;
  var add = function (k, name, id) { J.misses.push({ k: k, name: name, id: id || null }); };
  var uni = first('uni');
  if (!uni) add('uni-missing', '유니폼');
  else if (uni !== E.uni) add('uni-wrong', '유니폼', uni);
  if (E.rain && !has('p_rain')) add('rain-missing', '우비');
  if (!E.rain && has('p_rain')) add(E.dome ? 'rain-dome' : (m.weather === 'sun' ? 'rain-sun' : 'rain-cloud'), '우비');
  if (E.sun && !has('p_sun')) add('sun-missing', '선글라스');
  if (!E.sun && has('p_sun')) add(E.dome ? 'sun-dome' : (m.weather === 'rain' ? 'sun-rain' : 'sun-cloud'), '선글라스');
  if (E.hot && !has('p_fan')) add('fan-missing', '손선풍기');
  if (E.cold && has('p_fan')) add('fan-extra', '손선풍기');
  if (E.cold && !has('p_wind')) add('cold-missing', '바람막이');
  if (E.hot && has('p_wind')) add('warm-extra', '바람막이', 'p_wind');
  ALL_FOOD.forEach(function (id) {
    var need = E.food.indexOf(id) >= 0, got = has(id);
    if (need && !got) add('food-missing', ITEM[id].label, id);
    if (!need && got) add('food-extra', ITEM[id].label, id);
  });
  J.grade = (J.transFail || J.tixFail) ? 'fail' : (J.misses.length ? 'ok' : 'perfect');
  return J;
}

