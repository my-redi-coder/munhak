/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 4. 일기 문장 =================
   채점 결과를 일기 문장으로. 곰산전 특별 문장·곰산 팬 친구 이벤트 문장도 여기 */
function diaryHead(m) {
  var g = m.game;
  return { t: g.date.m + '월 ' + g.date.d + '일, ' + (m.temp === 'hot' ? '덥고' : '쌀쌀하고') + ' ' + (m.weather === 'rain' ? '가랑비 오는' : m.weather === 'cloud' ? '구름 낀' : '해가 쨍한') + ' 날.', k: 'date' };
}

function timeoutLines(m) {
  var L = [diaryHead(m)];
  if (m.event) L.push({ t: EVENTS[m.event].line });
  L.push({ t: '가방을 싸다가 시간이 다 가 버렸다…' });
  L.push({ t: '선발 투수 이미 1회 초 던지는 중…', k: 'fail' });
  L.push({ t: '입장 대기하다 1회 놓쳤습니다 😭', k: 'fail' });
  L.push({ t: '오늘의 직관: 실패', k: 'end' });
  return L;
}

function diaryLines(m, J) {
  var g = m.game, opp = TEAMS[g.opp], st = m.stadium, city = (g.home ? '문학' : (TEAMS[g.opp].city || st)), E = J.E;
  var L = [diaryHead(m)];
  if (m.event) L.push({ t: EVENTS[m.event].line });

  /* 교통: 틀리면 여기서 끝 */
  if (J.transFail) {
    if (!J.trans) { L.push({ t: '가방에 교통수단이 없었다. 일단 걸어서 출발했다…' }); L.push({ t: eun(st) + ' 너무 멀었다.' }); }
    else if (J.trans === 't_card') { L.push({ t: '교통카드를 찍고 지하철에 탔다.' }); L.push({ t: '지하철로는 ' + city + '에 갈 수 없다는 사실…' }); }
    else { L.push({ t: '기차표를 들고 힘차게 출발했다.' }); L.push({ t: '그런데 ' + eun(st) + ' 기차 탈 거리가 아니었다…' }); }
    L.push({ t: '도착 실패… 난 어디에 도착한 거지?', k: 'fail' });
    L.push({ t: '오늘의 직관: 실패', k: 'end' });
    return L;
  }
  L.push({ t: st + '에 도착했다.' });

  /* 티켓: 틀리면 여기서 끝 */
  if (J.tixFail) {
    if (!J.tix) { L.push({ t: '그런데… 티켓이 없었다.' }); L.push({ t: '문 앞에서 하염없이 함성만 들었다.' }); }
    else { L.push({ t: TEAMS[J.tix.slice(3)].nick + '전 티켓을 내밀었다.' }); L.push({ t: '“오늘은 ' + opp.nick + '전인데요?”' }); L.push({ t: '진짜 경기를 못 보게 됐다…', k: 'fail' }); }
    L.push({ t: '오늘의 직관: 실패', k: 'end' });
    return L;
  }
  L.push({ t: opp.nick + '전 티켓을 꺼냈다. 입장!' });

  /* 곰산전 특별 문장(홈·원정 모두): 잘 골라도 실책은 아니지만 웃긴 일이 생겨요 */
  if (g.opp === 'doo') {
    var funny = [' 먹으려 했는데... 이미 솔드아웃이라고 한다 ㅜㅜ', ' 먹으려 했는데... 줄이 너무 길어서 먹지는 못했다 ㅜㅜ'], fi = 0;
    (FOOD_AT[st] || []).forEach(function (id) {
      if (J.bag.indexOf(id) < 0 || E.food.indexOf(id) < 0) return;
      if (id === 'f_gimmal') L.push({ t: '명물이라는 ' + eul(ITEM[id].label) + ' 먹으려 했는데.... 이미 곰산 팬들이 다 털어가서 솔드아웃이라고 한다 ㅜㅜ' });
      else if (fi < funny.length) L.push({ t: eul(ITEM[id].label) + funny[fi++] });
    });
  }

  /* 소소한 실수: 일기는 계속 이어져요 */
  J.misses.forEach(function (x) {
    var t = '';
    switch (x.k) {
      case 'rain-dome': t = '그런데… 고척은 돔이었다 ㅜㅜㅜ'; break;
      case 'rain-sun': t = '해가 쨍쨍한 날 우비를 입은 사람은 나뿐이었다.'; break;
      case 'rain-missing': t = '가랑비가 내리기 시작했다. 우비가 없다… 비 맞는 응원단이 되었다.'; break;
      case 'rain-cloud': t = '구름만 끼고 비는 안 오는데 우비를 입은 사람은 나뿐이었다.'; break;
      case 'sun-dome': t = '돔 안에서 선글라스를 꼈더니 아무것도 안 보였다.'; break;
      case 'sun-rain': t = '가랑비가 내리는 날 선글라스를 낀 나, 앞이 더 안 보였다.'; break;
      case 'sun-cloud': t = '구름 낀 날 선글라스를 낀 나, 하늘이 더 어두워 보였다.'; break;
      case 'sun-missing': t = '햇빛이 너무 눈부셨다. 눈을 찌푸린 채 9회까지 봤다.'; break;
      case 'fan-missing': t = '너무 더웠다… 손부채로 버텼다.'; break;
      case 'fan-extra': t = '쌀쌀한데 손선풍기를 돌리는 나, 주변이 쳐다본다.'; break;
      case 'cold-missing': t = '쌀쌀해서 덜덜 떨었다. 바람막이가 없었다.'; break;
      case 'warm-extra': t = '더운데 ' + eul(x.name) + ' 챙겨 왔다. 가방만 무거웠다.'; break;
      case 'uni-missing': t = '유니폼을 깜빡했다. 사복으로 응원했다.'; break;
      case 'uni-wrong': t = '그런데… 오늘의 드레스코드는 ' + UNI[E.uni].label + '였다. 나만 ' + eul(UNI[x.id].label) + ' 입었다.'; break;
      case 'food-missing': t = (m.event === 'friend' && (FOOD_AT[st] || []).indexOf(x.id) < 0) ? '곰산 팬 친구가 ' + iga(x.name) + ' 먹고 싶다고 투덜투덜거렸다.... 여긴 ' + st + '인데...' : eul(x.name) + ' 못 먹었다. 입이 심심했다.'; break;
      case 'food-extra': t = (m.event === 'nofood') ? eul(x.name) + ' 먹으려 했는데 입맛이 없어서 손도 못 댔다.' : eun(x.name) + ' ' + (g.home ? '란다스' : opp.nick) + '네 명물이 아니었다.'; break;
    }
    L.push({ t: t, k: 'miss' });
  });

  /* 마무리 */
  if (!J.misses.length) {
    L.push({ t: g.result === 'L' ? '오늘은 졌지만 가방만큼은 완벽했다.' : g.result === 'W' ? '이긴 날의 가방은 가볍게 반짝였다.' : '비겼지만 가방은 승리였다.' });
    L.push({ t: '완벽한 하루였다.', k: 'end' });
    L.push({ t: '오늘의 실책: 없음 (무실책)', k: 'end' });
  } else {
    L.push({ t: '그래도 경기는 재미있게 봤다.' });
    L.push({ t: '오늘의 실책: ' + J.misses.map(function (x) { return x.name + ' 1개'; }).join(' · '), k: 'end' });
  }
  return L;
}

