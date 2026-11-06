/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 시작 =================
   packing.html          → 오늘의 조건 화면 + 카운트다운 후 랜덤 경기로 바로 시작
   packing.html#diary    → 으쓱이 다이어리(달력)부터 열기 (라커룸의 다이어리에서 이 주소로 와요) */
loadStore();
if (location.hash === '#diary') showCalendar(); else startPlay(pickGame());
