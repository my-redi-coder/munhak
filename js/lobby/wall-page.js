/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 담벼락 페이지 (wall.html) =================
   로비에서 3D 야구장 없이 담벼락만 따로 열어요. 벽 그림(wallArt)은 js/ui/wall-art.js 한 곳에서 같이 써요(wall.html이 먼저 불러와요).
   '돌아가기'·Esc는 로비(index.html)로 가요. */
var WALL_BACK_URL='index.html';
var WALL={art:false};
function $(id){return document.getElementById(id)}
wallArt();
setTimeout(function(){$('wall').classList.add('on')},120);/* 형광펜이 그어져요 */
function wallBack(){location.href=WALL_BACK_URL}
$('wallBack').onclick=wallBack;
document.addEventListener('keydown',function(e){if(e.key==='Escape')wallBack()});
