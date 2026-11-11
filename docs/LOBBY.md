# 로비 (첫 화면) — index.html

3D 야구장을 불러오기 전에, 가벼운 2D '문학경기장 앞마당' 지도에서 갈 곳을 고르는 화면이에요. (2026-11-05, 묶음 `X-lobby` → `X4-landing`에서 첫 화면이 됨)
**사이트 주소로 들어오면 로비가 먼저 떠요.** 3D 야구장 본체는 `stadium.html`로 옮겼어요(내용은 예전 `index.html` 그대로). 옛 주소 `lobby.html`은 `index.html`로 보내 주는 안내 페이지예요.

## 어떻게 동작하나요

- 폰·PC 똑같이 **누르기 → 이름표(말풍선) → 한 번 더 누르면 입장**. hover는 쓰지 않아요. 이름표에 '한 번 더 누르면…' 같은 설명 문구는 넣지 않아요.
- **첫 번째 누름**에서 갈 곳의 파일을 미리 받기 시작해요(`prefetch`). 경기장은 `stadium.html`과 three.js를 미리 받아 둬서 두 번째 누를 때 덜 기다려요.
- **두 번째 누름**: 가는 중 화면(미색 + 숨 쉬는 점)을 잠깐 보여 준 뒤 이동해요.
- 그림은 가로 400 × 세로 760 한 장(SVG 코드)이고, 화면에 맞춰 가운데 놓여요. 남는 곳(폰은 위아래, PC는 양옆)은 하늘·잔디·벚나무로 이어져요. 중요한 곳은 가운데 안전 영역(가로 약 20~380)에만 둬요.

## 누르는 곳

| 곳 | 그림 | 첫 번째 누름 | 두 번째 누름 |
|---|---|---|---|
| 경기장 입장 | 티켓부스(왼쪽 아래) | 이름표 '경기장 입장 / 티켓부스' | `stadium.html`(3D 야구장)으로 |
| 정문 | 가운데 활짝 열린 문 + 표 받는 직원 | '표가 있어야 들어갈 수 있어요. 티켓부스로 가볼까요?' + **티켓부스에 ✦ 반짝**(정문을 눌렀을 때만) | 안내와 반짝 다시 |
| 불펜장 | 빨간 길찾기 표지판(왼쪽) | '불펜장 / 미니게임' | `minigames/bullpen.html` |
| 라커룸 | 빨간 길찾기 표지판(오른쪽) | '라커룸 / 수집품 보관소' | `minigames/locker.html` |
| 담벼락 | 부스 옆 벽돌벽(작게, 덜 튀게) | '담벼락 / 제작자의 한마디' | `wall.html` |
| 문학기념관 | 건물 오른쪽 옆 작은 문 | '문학기념관 / 준비 중이에요' | 문이 흔들리고 '아직 전시 기간이 아닙니다' |
| Munhak 상징물 | 글자 모양 조형물 + 노란 별 | (이름표 없음) | 노란 별이 흔들려요 |
| 믿을맨 저금통 | 왼쪽 아래 벚나무 옆 풀밭의 아주 작은 은색 동전(일부러 작게) | 이름표 '믿을맨 저금통' | 별도 저장소 `piggyback1`(<https://my-redi-coder.github.io/piggyback1/>)로 |

## 파일 지도 (불러오는 순서)

| 파일 | 하는 일 |
|---|---|
| `index.html` | **로비(첫 화면)** 뼈대(제목 글자·SVG 틀·안내 자리)와 불러올 파일 목록. 링크 미리보기(OG) 태그 포함 |
| `stadium.html` | 3D 야구장 본체(예전 `index.html` 그대로) |
| `lobby.html` | 옛 주소 → `index.html`로 보내는 안내 페이지 |
| `styles/lobby.css` | 화면 바깥 모양(제목·이름표 글꼴·토스트·가는 중 화면)과 움직임(벚꽃잎·구름·흔들림) |
| `js/lobby/config.js` | **설정** — 글귀·갈 곳(url)·열림 여부·이름표 위치·으쓱이 한마디 |
| `js/lobby/kit.js` | 도구 — 난수, 지붕 곡선, 눌러지는 곳 `hot(...)`, 나무·덤불·벚나무. `L`(그림 층 모음)을 만듦 |
| `js/lobby/scenery.js` | 하늘·구름·언덕·땅·앞마당 바닥·잔디밭·벚나무·벚꽃잎 |
| `js/lobby/stadium.js` | 경기장 건물·열린 정문·줄 기둥·문학기념관 문 |
| `js/lobby/props.js` | 나무·깃발·만국기·티켓부스·담벼락·Munhak 상징물·표지판·믿을맨 저금통 동전(`L.coin`) |
| `js/lobby/people.js` | 응원 나온 으쓱이와 표 받는 직원(`PEOPLE` 목록) |
| `js/lobby/scene.js` | 층을 아래에서 위로 쌓음(순서를 바꾸면 겹침이 바뀜) |
| `js/lobby/interact.js` | 누르기·이름표·미리 받기·이동·반짝·흔들기·으쓱이 한마디 |
| `wall.html` + `js/lobby/wall-page.js` + `styles/wall-page.css` | 담벼락만 따로 여는 페이지(3D 없이). 벽 그림은 `js/ui/wall-art.js`(3D 야구장 안 담벼락과 공용) |
| `fonts/AlfaSlabOne-Regular.woff2` | 포스터·깃발·으쓱이 배 글자('Go for it!' 'V6' 'L')용 영문 글꼴(약 9KB) |

## 자주 고치는 것

- **글귀·갈 곳**: `js/lobby/config.js`의 `hotspots`. 이름표 풍선이 가리키는 자리는 `anchors`.
- **으쓱이 한 명 더**: `js/lobby/people.js`의 `PEOPLE`에 한 줄(`x`,`y`는 발이 닿는 자리, `uni` red·white·green·staff, `pose` stand·cheer·sign·flag·wave·scan, `cap` 모자, `talk` 그 사람만의 한마디).
- **상징물 자리**: `props.js`의 `L.monument` 첫 줄 `translate(58 0)`. 숫자를 바꾸면 좌우로 움직여요.
- **눌러지는 영역**: `hot(id, 이름, 그림, [x, y, 가로, 세로])`의 마지막 네모(보이지 않는 누름 영역). 폰에서 누르기 쉽게 가로·세로 40 이상.
- **포스터 문구**: `stadium.js`의 `Go for it!` / `V6`. 노란색은 쓰지 않아요(빨강·흰색만).
- **벚꽃잎 수**: `scenery.js`의 `L.petals` 반복 수(26).
- **저금통 동전 자리·크기**: `props.js`의 `L.coin` 첫 줄 `x`·`y`(지금 122, 748)와 `scale(.075)`. 자리를 옮기면 `config.js`의 `anchors.piggy`(이름표 꼬리 끝)도 같이 고쳐요. 흰 테두리(`fSel`)가 잘리지 않게 `.art` 안의 보이지 않는 네모 크기도 같이 봐요.

## 지키는 선

- 구단 로고·엠블럼·실제 간판 글씨·입점 브랜드는 그리지 않아요. 건물 모양과 분위기만 오마주.
- 상징물은 로고 대신 **굵은 하얀 글씨 + 빨간 테두리 + 노란 별** 글자 조형물('Munhak').
- 이 페이지는 `styles/tokens.css`를 불러오지 않아요(그 안의 `[tabindex]:focus-visible` 테두리가 상징물에 보기 싫게 나왔어요). 새 소품에 `tabindex`를 줄 땐 `lobby.css`의 `.hot,.toy{outline:none}`에 더해요.

- **다크 모드에서도 똑같은 색**: `index.html`·`wall.html`의 `<meta name="color-scheme" content="only light">`와 `lobby.css`의 `color-scheme:only light`가 폰·브라우저의 강제 다크 모드를 막아요. 이 줄들을 지우지 않아요(로비 색은 다크 모드용 값이 따로 없어요).

## 나가는 길

| 어디서 | 누르면 |
|---|---|
| 야구장(3D) '나가기' → '다시 입장하기' | **로비**로(`js/game/flow.js`의 `LOBBY_URL`) |
| 불펜장(로비에서 따로 열었을 때) 왼쪽 위 '로비' | 로비로 |
| 불펜장 맨 아래 '다른 곳으로' — '로비' / '야구장' | 로비 / 야구장(3D) |
| 불펜장(야구장 위 창으로 열었을 때) 왼쪽 위 '야구장' | 창을 닫고 야구장으로(그대로) |
| 불펜장(야구장 위 창) 맨 아래 '로비' | 야구장을 나가 로비로 |
| 라커룸 '뒤로' | 불펜장으로(그대로) → 불펜장에서 위 길로 |
| 담벼락(wall.html) '돌아가기'·Esc | 로비로(`wall-page.js`의 `WALL_BACK_URL`) |

불펜장 쪽 공용 함수와 주소는 `minigames/shared/store.js`(`mgExit` `mgGoLobby` `mgGoStadium`, `MG_LOBBY_URL` `MG_STADIUM_URL`).

## 주소가 적힌 곳 (이름이 바뀌었을 때 고칠 곳)

첫 화면 교체(2026-11-05, `X4-landing`)로 이렇게 정해졌어요. 파일 이름을 또 바꾸게 되면 아래를 같이 고쳐요.

| 파일 | 이름 | 지금 값 |
|---|---|---|
| `js/lobby/config.js` | `hotspots.stadium`의 `url`, `prefetch` 첫 주소 | `'stadium.html'` |
| `js/lobby/config.js` | `hotspots.piggy`의 `url`, `prefetch` (저금통은 따로 배포한 저장소) | `'https://my-redi-coder.github.io/piggyback1/'` |
| `js/lobby/wall-page.js` | `WALL_BACK_URL` | `'index.html'` |
| `js/game/flow.js` | `LOBBY_URL` | `'index.html'` |
| `minigames/shared/store.js` | `MG_LOBBY_URL` / `MG_STADIUM_URL` | `'../index.html'` / `'../stadium.html'` |
| `tools/modmap.py` | 읽는 파일 | `stadium.html`·`index.html`·`wall.html` (고친 뒤 `python3 tools/modmap.py`로 `docs/MODULES.md` 다시 만들기) |

- 각 파일 맨 위 주석의 "`index.html`에서 …불러요"는 3D 야구장 시절 이름이에요. **`stadium.html`**을 뜻해요(주석이라 동작에는 영향 없음).
- 폰에서 올릴 때: 이름 바꾸기가 안 되니 새 이름의 파일로 올리고, 옛 이름 파일은 덮어쓰거나 안내 페이지로 만들어요(`lobby.html`처럼).

## 담벼락 글은 두 곳

야구장 안 담벼락(`stadium.html`의 `#wall`)과 로비에서 여는 `wall.html`에 같은 글이 들어 있어요. 글을 고칠 땐 두 곳 다 고쳐요.
