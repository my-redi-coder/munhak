/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 7-a. 화면 도구 =================
   h(태그, 속성, 자식…)로 화면 조각을 만들고 show(화면)로 갈아 끼워요 */
var app = document.getElementById('app');
var ui = { bundle: 0 };
function h(tag, attrs) {
  var e = document.createElement(tag), kids = Array.prototype.slice.call(arguments, 2);
  if (attrs) for (var k in attrs) {
    var v = attrs[k];
    if (v === false || v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  kids.forEach(function addKid(c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(addKid); return; }
    e.append(c.nodeType ? c : document.createTextNode(c));
  });
  return e;
}
function show(node) { app.replaceChildren(node); }
function closeSheet() { var s = document.querySelector('.overlay'); if (s) s.remove(); }
function dateText(g) { return g.date.m + '월 ' + g.date.d + '일 (' + DOW[g.date.dow] + ')'; }

/* 불펜장으로 나가기 */
function pkExit() { location.href = 'bullpen.html'; }
function pkBackBtn(extra) { return h('button', { class: 'iconbtn', 'aria-label': '불펜장으로', onclick: pkExit, style: extra || null }, '←'); }
