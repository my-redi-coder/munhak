/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 담벼락 벽 그림 (작은 패치 AB, 2026-11-08) =================
   회색 벽 일러스트(wallArt)는 담벼락이 열리는 두 곳이 같이 써요: 3D 야구장 안(js/ui/wall.js) · 로비에서 바로 여는 wall.html(js/lobby/wall-page.js).
   예전엔 두 파일에 똑같은 코드가 한 벌씩 있어서 고칠 때 두 번 고쳐야 했어요 → 이 파일 한 곳에서만 고쳐요.
   - 이 파일은 함수만 내놓아요. 부르는 쪽 파일이 먼저 `var WALL={art:false,...}` 와 `$()` 를 갖고 있어야 해요(둘 다 함수가 불릴 때 쓰니까, 불러오는 순서는 상관없어요).
   - 처음 부를 때 한 번만 그려요(WALL.art). 그림 속 손글씨는 Nanum Pen Script(fonts/fonts.css) */
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
