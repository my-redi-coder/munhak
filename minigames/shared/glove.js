/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 금 글러브 아이콘 (홈런볼 모으기 결과·공박스 배지 공용, 2026-11-01) =================
   gloveSVG() — 금색 글러브 SVG 한 개. 그라데이션 id가 겹치지 않게 부를 때마다 새 id */
var GLOVE_N=0;
function gloveSVG(){var id='gg'+(++GLOVE_N);
  return '<svg class="gglove" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0B0"/><stop offset=".55" stop-color="#E2B44A"/><stop offset="1" stop-color="#A8761F"/></linearGradient></defs>'
   +'<g fill="url(#'+id+')" stroke="#8a5a12" stroke-width=".7"><ellipse cx="11.6" cy="9" rx="2.4" ry="5.6" transform="rotate(-8 11.6 9)"/><ellipse cx="15.6" cy="8" rx="2.4" ry="6"/><ellipse cx="19.6" cy="8.6" rx="2.4" ry="5.8" transform="rotate(6 19.6 8.6)"/><ellipse cx="23.2" cy="10.4" rx="2.2" ry="5" transform="rotate(14 23.2 10.4)"/><ellipse cx="6.6" cy="16.4" rx="2.6" ry="5.6" transform="rotate(-40 6.6 16.4)"/><ellipse cx="16" cy="18" rx="9.6" ry="8.4"/></g>'
   +'<ellipse cx="16" cy="17.4" rx="5.6" ry="4.8" fill="#B8862B"/><ellipse cx="16" cy="18" rx="8" ry="7" fill="none" stroke="#FFF7D6" stroke-width="1" stroke-dasharray="1.6 1.6"/></svg>';}
