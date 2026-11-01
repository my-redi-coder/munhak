/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 담벼락 (묶음 A, 2026-11-01) =================
   '내 위치' 메뉴 → 둘러보기 '담벼락'(ui/places.js)에서 wallOpen(). 포토존처럼 전용 화면이고, 왼쪽 위 '돌아가기'(또는 Esc)로 나가요. 하단 버튼 없음.
   - 글(제작자의 말·낙서·참고한 곳)은 index.html의 #wall 안에 그대로 있어요. 글을 고칠 땐 index.html만.
   - (B3) 위치 글귀는 마스킹테이프로 붙인 종이 라벨(.tag), 벽 밑단·보도블록은 글 맨 끝 .wall-ground(같이 스크롤)
   - 회색 벽 일러스트는 아래 wallArt()가 처음 들어갈 때 한 번 그려요. 글·그림은 담벼락 프로토타입 아티팩트 그대로.
   - 손글씨 글꼴(나눔붓·나눔펜·개구)은 담벼락에 처음 들어갈 때만 불러요(첫 로딩 가볍게).
   - 담벼락이 화면을 다 덮는 동안 야구장 그리기는 쉬어요(app/loop.js의 WALL.on). 스타일은 styles/wall.css */
var WALL={on:false,fonts:false,art:false};
/* 글꼴은 fonts/fonts.css에 있고, 담벼락 글자가 화면에 나올 때 저절로 내려받아요(2026-11-01부터 구글 대신 저장소) */
function wallFonts(){WALL.fonts=true}
function wallArt(){
  if(WALL.art)return;WALL.art=true;
  $('wallArt').innerHTML='<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="야구장 담벼락">'
  +'<defs><filter id="wallGrain"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/>'
  +'<feColorMatrix values="0 0 0 0 .35 0 0 0 0 .4 0 0 0 0 .45 0 0 0 .32 0"/></filter>'
  +'<filter id="wallBlot"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="9"/>'
  +'<feColorMatrix values="0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .64 0 0 0 .5 0"/></filter></defs>'
  +'<rect width="400" height="800" fill="#bcc6cc"/>'
  +'<rect width="400" height="800" filter="url(#wallBlot)"/>'
  +'<rect width="400" height="800" filter="url(#wallGrain)"/>'
  +'<path d="M132 0V800M272 0V800" stroke="#a3adb3" stroke-width="2"/>'
  +'<path d="M18 40c6 30-4 60 2 90s-6 50 0 80M386 300c-8 20 2 34-4 52s6 30 0 48" stroke="#8f9aa1" stroke-width="1.2" fill="none"/>'
  +'<g fill="none" stroke="#b3786c" stroke-width="1.3" opacity=".55">'
  +'<path d="M300 120c18-14 46-4 44 22s-30 32-46 18-14-30 2-40z"/>'
  +'<path d="M312 140h.5M328 140h.5M314 154c6 4 12 4 16 0"/>'
  +'<path d="M40 470l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z"/>'
  +'<path d="M310 560c-6-12 14-18 16-6 2-12 22-6 16 6l-16 18z"/>'
  +'<path d="M60 640c20-6 40 4 64-2"/></g>'
  +'<g font-family="Nanum Pen Script, cursive" fill="#6c7880" opacity=".55" font-size="20">'
  +'<text x="24" y="92" transform="rotate(-6 24 92)">직관승리</text>'
  +'<text x="290" y="70" transform="rotate(4 290 70)">2026 우승가자</text></g>'
  +'</svg>';/* (B3) 벽 밑단·보도블록은 화면에 고정하지 않고 글 맨 끝(.wall-ground)으로 옮김 — 폰 스크롤 때 한 박자 늦게 따라오던 문제 */
}
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
