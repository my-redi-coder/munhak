/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 담벼락 (묶음 A, 2026-11-01) =================
   '내 위치' 메뉴 → 둘러보기 '담벼락'(ui/places.js)에서 wallOpen(). 포토존처럼 전용 화면이고, 왼쪽 위 '돌아가기'(또는 Esc)로 나가요. 하단 버튼 없음.
   - 글(제작자의 말·낙서·참고한 곳)은 stadium.html의 #wall 안에 있고, 로비에서 여는 wall.html에도 같은 글이 있어요 → 글을 고칠 땐 두 곳 다(docs/LOBBY.md).
   - (B3) 위치 글귀는 마스킹테이프로 붙인 종이 라벨(.tag), 벽 밑단·보도블록은 글 맨 끝 .wall-ground(같이 스크롤)
   - 회색 벽 일러스트 wallArt()는 js/ui/wall-art.js(로비의 wall.html과 같이 써요). 처음 들어갈 때 한 번 그려요. 글·그림은 담벼락 프로토타입 아티팩트 그대로.
   - 손글씨 글꼴(나눔붓·나눔펜·개구)은 담벼락에 처음 들어갈 때만 불러요(첫 로딩 가볍게).
   - 담벼락이 화면을 다 덮는 동안 야구장 그리기는 쉬어요(app/loop.js의 WALL.on). 스타일은 styles/wall.css */
var WALL={on:false,fonts:false,art:false};
/* 글꼴은 fonts/fonts.css에 있고, 담벼락 글자가 화면에 나올 때 저절로 내려받아요(2026-11-01부터 구글 대신 저장소) */
function wallFonts(){WALL.fonts=true}
function wallOpen(){
  if(phase!=='game'||EV.on||WALL.on)return;
  stopAct(true);PL.target=null;PL.onArrive=null;if(player.mode==='walk')player.mode='stand';setStatus(null);
  wallFonts();wallArt();
  fadeTo('담벼락으로 가는 중',function(){
    WALL.on=true;$('wall').hidden=false;document.body.classList.add('wall');$('wallScroll').scrollTop=0;
    setTimeout(function(){$('wall').classList.add('on')},120);/* 페이드가 걷힌 뒤 형광펜이 그어져요 */
    $('wallBack').focus({preventScroll:true});
  });
}
function wallClose(){
  if(!WALL.on)return;
  fadeTo('',function(){
    WALL.on=false;$('wall').classList.remove('on');$('wall').hidden=true;document.body.classList.remove('wall');
    last=performance.now();snapCam();$('bZone').focus({preventScroll:true});
  });
}
$('wallBack').onclick=function(){sfx('tap');wallClose()};
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&WALL.on){e.stopPropagation();wallClose()}},true);
