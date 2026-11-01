/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 손글씨 기념구 (홈런볼 모으기·공박스 공용) =================
   ballHTML(h, ink) — h는 HR 한 개(homeruns.js). ink=false면 글씨 없이 공만(작은 칸·진열장).
   보통 공은 남색 사인펜 한 색, 기념 문구가 있는 공은 줄마다 색이 달라요(검정·파랑·초록·검정).
   (2026-11-01) 글씨가 있는 공(크게 보기)은 아래 실밥 바로 밑에 실제 SSG 기념구처럼 검정 작은 글씨 한 줄(BALL_MOTTO).
   실밥 곡선을 따라 휘어요. 문구를 바꾸려면 BALL_MOTTO 한 줄만 고치면 돼요. */
var BALL_MOTTO='언제나 처음은 소중하다';
var BALL_N=0;/* 공마다 곡선 id가 겹치지 않게 */
function ballMotto(){var id='bm'+(++BALL_N);
  return '<svg class="motto" viewBox="0 0 100 100" aria-hidden="true"><path id="'+id+'" d="M22 83C39 91.5 61 91.5 78 83" fill="none"/><text><textPath href="#'+id+'" startOffset="50%" text-anchor="middle">'+cardEsc(BALL_MOTTO)+'</textPath></text></svg>';}
var BALL_SEAM='<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M5 31 C30 15 70 15 95 31" fill="none" stroke="#c2182f" stroke-width=".9" opacity=".75"/><path d="M5 31 C30 15 70 15 95 31" fill="none" stroke="#c2182f" stroke-width="3.4" stroke-dasharray=".9 2.6" transform="translate(0 2.6)"/><path d="M5 69 C30 85 70 85 95 69" fill="none" stroke="#c2182f" stroke-width=".9" opacity=".75"/><path d="M5 69 C30 85 70 85 95 69" fill="none" stroke="#c2182f" stroke-width="3.4" stroke-dasharray=".9 2.6" transform="translate(0 -2.6)"/></svg>';
function ballHTML(h,ink){
  var L=hrBallLines(h);
  return '<div class="hball'+(h.title?' sp':'')+'">'+BALL_SEAM+(ink===false?'':ballMotto()+'<div class="ink"><span class="l1">'+cardEsc(L[0])+'</span><span class="l2">'+cardEsc(L[1])+'</span><span class="l3">'+cardEsc(L[2])+'</span><span class="l4">'+cardEsc(L[3])+'</span></div>')+'</div>';
}
