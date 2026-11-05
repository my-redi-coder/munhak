/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 장면 쌓기 (lobby.html) =================
   아래에서 위로 층을 쌓아요. 순서를 바꾸면 겹치는 모양이 바뀌어요. 필요: kit.js scenery.js stadium.js props.js people.js */
document.getElementById('world').innerHTML = [
  L.sky(), L.hills(), L.ground(), L.plaza(), L.stadium(), L.gate(), L.annex(), L.pines(), L.queue(), L.poles(),
  L.booth(), L.wall(), L.monument(), L.sign(), L.people(), L.lawn(), L.petals(),
  '<g id="sparks"></g><g id="talkLayer"></g><g id="bubble"></g>'
].join('');
