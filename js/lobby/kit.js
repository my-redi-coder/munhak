/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 도구 (lobby.html) =================
   그림을 그릴 때 쓰는 작은 도우미: 난수(rng), 지붕 곡선(arcY), 눌러지는 자리(hot), 나무·덤불·벚나무.
   모든 그림 파일(scenery·stadium·props·people)이 `L` 안에 '층(layer)' 하나씩을 내놓고, scene.js가 쌓아요.
   필요: config.js */
const L = {};   // 그림 층 모음: L.sky(), L.stadium() … 각각 SVG 글자(문자열)를 돌려줘요
const NS = 'http://www.w3.org/2000/svg';
const rng = (seed)=>()=> (seed = (seed*16807) % 2147483647) / 2147483647;
const arcY = (x,y0)=>{ const t=(x-6)/388; return y0 - 88*t*(1-t); };   // 건물 지붕선(살짝 휜 곡선)
const hot = (id,label,art,hit)=>
  `<g class="hot" data-id="${id}" role="button" tabindex="0" aria-label="${label}"><g class="art">${art}</g><rect class="hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}" fill="#fff" fill-opacity="0"/></g>`;

const pine = (x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-8" width="6" height="10" fill="#7a5233"/><path d="M0,-84 L-15,-50 L-8,-50 L-20,-28 L-11,-28 L-25,-6 L25,-6 L11,-28 L20,-28 L8,-50 L15,-50 Z" fill="#2f8a4e"/><path d="M0,-84 L15,-50 L8,-50 L20,-28 L11,-28 L25,-6 L6,-6 Z" fill="#3ea35f" opacity=".55"/></g>`;
const bush = (x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="22" ry="4" fill="#000" opacity=".08"/><circle cx="-11" cy="-7" r="10" fill="#5fae52"/><circle cx="9" cy="-8" r="11" fill="#6dbb5c"/><circle cx="-1" cy="-13" r="9" fill="#78c466"/></g>`;
const cherry = (x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity=".1"/>
  <path d="M-4,0 C-3,-18 -8,-30 -14,-42 L-9,-44 C-5,-36 -1,-30 0,-24 C2,-32 8,-40 14,-46 L18,-42 C10,-34 5,-24 5,0 Z" fill="#7b5236"/>
  <circle cx="-24" cy="-52" r="20" fill="#ffb9cc"/><circle cx="0" cy="-66" r="26" fill="#ffbfd1"/>
  <circle cx="24" cy="-50" r="21" fill="#ffb4c8"/><circle cx="-6" cy="-46" r="20" fill="#ffc8d7"/>
  <circle cx="-8" cy="-72" r="12" fill="#ffd9e4"/><circle cx="16" cy="-62" r="9" fill="#ffd9e4"/>
  <circle cx="-28" cy="-56" r="8" fill="#ffd9e4"/><circle cx="12" cy="-44" r="7" fill="#f7a1ba" opacity=".7"/>
  <circle cx="-18" cy="-40" r="6" fill="#f7a1ba" opacity=".7"/></g>`;
