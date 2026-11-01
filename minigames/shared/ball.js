/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 손글씨 기념구 (홈런볼 모으기·공박스 공용) =================
   ballHTML(h, ink) — h는 HR 한 개(homeruns.js). ink=false면 글씨 없이 공만(작은 칸·진열장).
   보통 공은 남색 사인펜 한 색, 기념 문구가 있는 공은 줄마다 색이 달라요(검정·파랑·초록·검정). */
var BALL_SEAM='<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M5 31 C30 15 70 15 95 31" fill="none" stroke="#c2182f" stroke-width=".9" opacity=".75"/><path d="M5 31 C30 15 70 15 95 31" fill="none" stroke="#c2182f" stroke-width="3.4" stroke-dasharray=".9 2.6" transform="translate(0 2.6)"/><path d="M5 69 C30 85 70 85 95 69" fill="none" stroke="#c2182f" stroke-width=".9" opacity=".75"/><path d="M5 69 C30 85 70 85 95 69" fill="none" stroke="#c2182f" stroke-width="3.4" stroke-dasharray=".9 2.6" transform="translate(0 -2.6)"/></svg>';
function ballHTML(h,ink){
  var L=hrBallLines(h);
  return '<div class="hball'+(h.title?' sp':'')+'">'+BALL_SEAM+(ink===false?'':'<div class="ink"><span class="l1">'+cardEsc(L[0])+'</span><span class="l2">'+cardEsc(L[1])+'</span><span class="l3">'+cardEsc(L[2])+'</span><span class="l4">'+cardEsc(L[3])+'</span></div>')+'</div>';
}
