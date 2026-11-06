/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 1. 데이터 =================
   구단(귀여운 이름) · 유니폼 · 물건 그림과 목록 · 구장별 음식 · 이벤트 · 달력 묶음 · 조사(을/를) */
const TEAMS = {
  doo: { nick: '곰산', real: '두산', color: '#243a6e', stadium: '잠실', metro: true },
  sam: { nick: '삼별', real: '삼성', color: '#2f86d6', stadium: '대구', metro: false },
  lot: { nick: '꽃데', real: '롯데', color: '#e56b92', stadium: '사직', city: '부산', metro: false },
  lg:  { nick: '알쥐', real: 'LG',  color: '#8e2c6f', stadium: '잠실', metro: true },
  han: { nick: '하놔', real: '한화', color: '#e07b12', stadium: '대전', metro: false },
  kt:  { nick: '키티', real: 'KT',  color: '#222222', stadium: '수원', metro: true },
  nc:  { nick: '룡씨', real: 'NC',  color: '#1f9a8f', stadium: '창원', metro: false },
  kiw: { nick: '큐움', real: '키움', color: '#7b3f2a', stadium: '고척', metro: true, dome: true },
  kia: { nick: '꺄아', real: 'KIA', color: '#d8352a', stadium: '광주', metro: false }
};
const TEAM_KEYS = Object.keys(TEAMS);

const UNI = {
  u_red:   { label: '빨강 유니폼', body: '#c8102e', trim: '#ffffff' },
  u_green: { label: '초록 유니폼', body: '#2f8f4e', trim: '#ffffff' },
  u_white: { label: '흰빨 유니폼', body: '#ffffff', trim: '#c8102e', stripe: '#c8102e' },
  u_cream: { label: '크림 유니폼', body: '#f1e4c3', trim: '#1f2a5a' }
};
function jerseySvg(u) {
  return '<svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">' +
    '<path d="M20 8 L8 16 L14 26 L20 22 L20 56 L44 56 L44 22 L50 26 L56 16 L44 8 C40 13 24 13 20 8Z" fill="' + u.body + '" stroke="rgba(0,0,0,.4)" stroke-width="1.6" stroke-linejoin="round"/>' +
    (u.stripe ? '<path d="M26 24V56M32 24V56M38 24V56" stroke="' + u.stripe + '" stroke-width="1" opacity=".5"/>' : '') +
    '<path d="M20 8 C24 13 40 13 44 8" fill="none" stroke="' + u.trim + '" stroke-width="3.2"/>' +
    '<path d="M14 26 L20 22M50 26 L44 22" stroke="' + u.trim + '" stroke-width="3"/></svg>';
}
const SVG_RAIN = '<svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true"><path d="M32 6 C20 6 14 16 14 26 L8 52 L24 56 L24 40 L40 40 L40 56 L56 52 L50 26 C50 16 44 6 32 6Z" fill="#f4c20d" stroke="rgba(0,0,0,.4)" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="32" cy="22" rx="8" ry="9" fill="#fff6cf" stroke="rgba(0,0,0,.25)"/></svg>';
const SVG_FAN = '<svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true"><rect x="28" y="40" width="8" height="20" rx="4" fill="#8aa0b8"/><circle cx="32" cy="24" r="18" fill="#dfe9f3" stroke="#6b839c" stroke-width="2"/><g fill="#6b839c" opacity=".85"><path d="M32 24 L32 8 A16 16 0 0 1 44 18Z"/><path d="M32 24 L46 32 A16 16 0 0 1 36 40Z"/><path d="M32 24 L20 36 A16 16 0 0 1 16 22Z"/></g><circle cx="32" cy="24" r="3" fill="#fff"/></svg>';

/* 유니폼 그림 (ChatGPT로 그린 그림, 투명 배경으로 정리해서 안에 넣어 둠) */
var UNI_IMG = {
  u_red: 'packing/img/u-red.webp',
  u_green: 'packing/img/u-green.webp',
  u_white: 'packing/img/u-white.webp',
  u_cream: 'packing/img/u-cream.webp'
};
function uniImg(id) { return '<img src="' + UNI_IMG[id] + '" alt="" draggable="false">'; }

var TRANS_IMG = {
  t_card: 'packing/img/t-card.webp',
  t_train: 'packing/img/t-train.webp'
};
function transImg(id) { return '<img src="' + TRANS_IMG[id] + '" alt="" draggable="false">'; }

var PROP_IMG = {
  p_rain: 'packing/img/p-rain.webp',
  p_sun: 'packing/img/p-sun.webp',
  p_fan: 'packing/img/p-fan.webp',
  p_wind: 'packing/img/p-wind.webp'
};
function propImg(id) { return '<img src="' + PROP_IMG[id] + '" alt="" draggable="false">'; }

const ITEMS = [];
const ITEM = {};
function addItem(o) { ITEMS.push(o); ITEM[o.id] = o; }
Object.keys(UNI).forEach(function (id) { addItem({ id: id, cat: 'uni', label: UNI[id].label, icon: uniImg(id) }); });
addItem({ id: 't_card', cat: 'trans', label: '교통카드', icon: transImg('t_card') });
addItem({ id: 't_train', cat: 'trans', label: '기차표', icon: transImg('t_train') });
addItem({ id: 'p_rain', cat: 'prop', label: '우비', icon: propImg('p_rain') });
addItem({ id: 'p_sun', cat: 'prop', label: '선글라스', icon: propImg('p_sun') });
addItem({ id: 'p_fan', cat: 'prop', label: '손선풍기', icon: propImg('p_fan') });
addItem({ id: 'p_wind', cat: 'prop', label: '바람막이', icon: propImg('p_wind') });
TEAM_KEYS.forEach(function (k) {
  addItem({ id: 'tk_' + k, cat: 'tix', label: TEAMS[k].nick + '전', icon: '<div class="tkicon" style="--c:' + TEAMS[k].color + '"><i></i><b>' + TEAMS[k].nick + '</b></div>' });
});
addItem({ id: 'f_smoothie', cat: 'food', label: '란다스무디', icon: '🥤' });
addItem({ id: 'f_shrimp', cat: 'food', label: '크림새우', icon: '🍤' });
addItem({ id: 'f_bread', cat: 'food', label: '빵봉지', icon: '🍞' });
addItem({ id: 'f_gimmal', cat: 'food', label: '김말국', icon: '🍜' });
addItem({ id: 'f_ppo', cat: 'food', label: '뽀용만두', icon: '🥟' });
addItem({ id: 'f_pork', cat: 'food', label: '돼지국밥', icon: '🍲' });
addItem({ id: 'f_flat', cat: 'food', label: '납작만두', icon: '🥙' });
addItem({ id: 'f_yuk', cat: 'food', label: '육전', icon: '🥩' });
addItem({ id: 'f_agu', cat: 'food', label: '아구찜', icon: '🐟' });

const CATS = [
  { id: 'uni', name: '옷장' }, { id: 'trans', name: '교통' }, { id: 'prop', name: '소품함' },
  { id: 'tix', name: '티켓' }, { id: 'food', name: '야푸' }
];
const EXCLUSIVE = { uni: true, trans: true, tix: true };      // 하나만 담을 수 있는 칸
const FOOD_AT = { 문학: ['f_smoothie', 'f_shrimp'], 고척: ['f_shrimp'], 대전: ['f_bread'], 잠실: ['f_gimmal'], 수원: ['f_ppo'], 사직: ['f_pork'], 대구: ['f_flat'], 광주: ['f_yuk'], 창원: ['f_agu'] };
const ALL_FOOD = ITEMS.filter(function (i) { return i.cat === 'food'; }).map(function (i) { return i.id; });

const EVENTS = {
  red:     { name: '레드데이', homeOnly: true,  line: '오늘은 레드데이! 다들 빨갛게 입고 온다고 한다.' },
  green:   { name: '그린데이', homeOnly: true,  line: '오늘은 그린데이! 문학이 초록빛으로 물든다고 한다.' },
  incheon: { name: '인천상륙데이', homeOnly: true, line: '오늘은 인천상륙데이! 크림색 인천군이 상륙한다.' },
  nofood:  { name: '입맛 없음', homeOnly: false, line: '오늘은 이상하게 입맛이 없다.' },
  friend:  { name: '곰산 팬 친구 동행', homeOnly: false, line: '곰산 팬 친구가 같이 가자고 했다. 오늘은 먹을 게 많아질 것 같다.' }
};

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const BUNDLES = [
  { label: '3~4월', months: [3, 4] }, { label: '5월', months: [5] }, { label: '6월', months: [6] },
  { label: '7월', months: [7] }, { label: '8월', months: [8] }, { label: '9~10월', months: [9, 10] }
];

/* 한국어 조사 도우미 */
function hasJong(w) { var c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0; }
function eul(w) { return w + (hasJong(w) ? '을' : '를'); }
function eun(w) { return w + (hasJong(w) ? '은' : '는'); }
function iga(w) { return w + (hasJong(w) ? '이' : '가'); }

