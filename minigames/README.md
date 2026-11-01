<!-- SSG 팬 레디코더의 문학야구장 -->
# 불펜장 (미니게임)

야구장 위쪽 **불펜장** 버튼으로 열려요. 페이지마다 따로 돌고, 공용 파일은 `shared/`에 있어요.

- `bullpen.html` 불펜장 첫 화면 — 게임 목록은 `bullpen/bullpen.js`의 `GAMES`
- `locker.html` 내 라커 — 카드 앨범(`#cards`, 카드 누르면 뒷면 선수 정보), 공박스(`#balls`)
- `number-match.html` 등번호 매치 — 확인용 버튼은 주소 끝에 `?dev`
- `homerun.html` 홈런볼 모으기 — 확인용 버튼은 주소 끝에 `?dev`
- `shared/homeruns.js` 2026 시즌 홈런 143개 — 기록을 고칠 땐 이 파일만
- `shared/players.js` 카드 뒷면 선수 정보
- `shared/roster.js` 선수 명단 — 선수가 바뀌면 이 파일만 고쳐요

모은 카드는 이 기기 브라우저에 저장돼요(폰·컴퓨터 따로, 브라우저 기록을 지우면 사라져요). 자세한 구조는 `docs/ARCHITECTURE.md`의 '불펜장'.
