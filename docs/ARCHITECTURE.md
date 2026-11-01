# 구조

## 왜 이렇게 나눴나

파일을 작게 나눠 두고, 고칠 때는 관련 파일만 열어 봐요. 깃허브 페이지에 그대로 올리면 `index.html`이 아래 파일들을 차례로 불러와요. 빌드(합치기) 과정은 없어요.

## 폴더

| 폴더 | 내용 |
|---|---|
| `index.html` | 화면 뼈대 + 불러올 파일 목록(아래 순서대로 `<script>`) |
| `styles/` | 모양(css) |
| `js/` | 야구장 본체 (아래 레이어 표) |
| `events/` | 이벤트 장면 하나 = 파일 하나 (`homer.js` 최정 홈런, `kkk.js` KKK, `yeonan.js` 8회말 여난부두) + 이벤트 배경음 mp3 + 여난부두 가사 json |
| `minigames/` | 불펜장(미니게임): 독립 페이지들 + 공용 `shared/` (아래 '불펜장') |
| `songs/` | 직접 만든 응원가 mp3 + 목록 `songs.js` |
| `docs/` | 기획·구조·진행·모듈 지도, 직접 올리는 파일 안내(`USER-FILES.md`) |
| `tools/modmap.py` | `docs/MODULES.md`(파일마다 내놓는 이름) 다시 만들기 |

## 레이어 (아래가 바탕, 위로 갈수록 바탕을 사용)

| 레이어    | 폴더           | 하는 일                                                                                                                                                                                                                                                       |
|-----------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 앱        | `js/app/`      | 매 프레임 루프(`loop.js`), 시작 순서(`boot.js`)                                                                                                                                                                                                               |
| 화면(UI)  | `js/ui/`       | 알림·말풍선·이름표(`feedback.js`), 입장 준비(`setup.js`), 시트·설정(`sheets.js`), 공격·수비 전환 버튼(`fieldmode.js`), 이벤트 목록 시트 + 이벤트 배경음 고르기(`event-sheet.js`), 이벤트 중 볼카운트 불(`count.js`), 불펜장 창(`bullpen.js`)                                                                              |
| 게임 규칙 | `js/game/`     | 상태(`state.js`), 입장·구역 이동(`flow.js`), 행동(`actions.js`), 주변 으쓱이(`npc.js`), 입력(`input.js`), 카메라(`camera.js`), 걷기(`movement.js`), 그라운드 선수 배치·투구 흐름(`fieldplay.js`), 이벤트 진행 틀(`events.js`), 경기장 구경하기(`sightsee.js`), 이벤트 장면은 `events/` 폴더 |
| 소리      | `js/audio/`    | 함성·비트·효과음·내 음원 (`audio.js`), 이벤트 효과음 딱·뱃고동·파도·잠깐 낮추기·빨라지는 박수 (`eventsfx.js`), 이벤트 배경음 내 파일 보관·재생 (`evbgm.js`), 응원가 랜덤 재생 (`songs.js`, 곡 목록은 `songs/songs.js`)                                                                                                                 |
| 캐릭터    | `js/entities/` | 으쓱이 모델, 표정, 등판, 동작 (`character.js`), 그라운드 선수 모델·등판·자세 (`player.js`), 선수 표정 그림 (`bpface.js`)                                                                                                                                                                    |
| 공간      | `js/world/`    | 하늘, 그라운드, 펜스·소품, 빅보드(`bigboard.js`), 빅보드 화면 연출(`bbshow.js`), K보드 카드(`kboard.js`), 조명탑, 관중석 블록(이어진 블록은 `open`·`reach`·`links`), 그린존(`greenzone.js`), 홈런 현수막(`hogbanner.js`), 바비큐존(`bbq.js`), 관중 무리, 꽃잎                                                                |
| 엔진      | `js/engine/`   | 렌더러, 씬, 조명, 도형 합치기 도우미 (`renderer.js`)                                                                                                                                                                                                          |
| 바탕      | `js/core/`     | 공용 도우미(`util.js`), 데이터·문구·설정값(`config.js`)                                                                                                                                                                                                       |

스타일은 `styles/`: `tokens.css`(색·글꼴 토큰, 다크 모드) → `boot.css` → `setup.css` → `hud.css` → `sheets.css` → `event.css`(이벤트 시트·장면 중 화면·여난부두 가사) → `bullpen.css`(불펜장 창). 화면 뼈대(마크업)는 `index.html`.

## 규칙

- **불러오는 순서 = `index.html`의 `<script>` 순서.** 모든 파일이 같은 전역 공간을 써요. 뒤 파일은 앞 파일의 이름을 바로 쓸 수 있고, 앞 파일은 뒤 파일을 함수 안에서만(실행 시점에) 불러요.
- 파일 맨 바깥에서 `return` 금지(멈춰야 하면 `throw`). `name`·`status`·`top` 같은 브라우저 이름과 겹치는 전역 이름 금지.
- **문구와 숫자는 `js/core/config.js`.** 응원가 목록만 `songs/songs.js`.
- **새 기능은 새 파일로.** 새 파일을 만들면 `index.html`에 `<script>` 한 줄을 알맞은 자리에 추가.
- 확인은 사용자가 직접(스크린샷 확인 안 함). 문서는 작업 끝날 때 한 번 정리.
- **출처 주석:** 파일을 고칠 때마다 맨 위에 출처 한 줄(`출처: SSG 팬 레디코더의 문학야구장 …`)이 없으면 넣어요. 가져다 써도 되지만 돈 받고 쓰는 건 안 되고, 'SSG 팬 레디코더의 문학야구장 참조'를 남기는 게 조건.

## Claude와 고치는 순서 (토큰 아끼기)

1. 사용자가 원하는 걸 말해요.
2. Claude는 저장소를 받아 `docs/MODULES.md`와 이 문서로 고칠 파일을 고르고, **그 파일만** 열어요.
3. 고친 파일만 돌려줘요. 어느 폴더에 올릴지 같이 알려줘요.
4. 사용자는 깃허브에서 그 폴더로 가서 **Add file → Upload files**로 끌어다 놓기 → **Commit changes**. 1~2분 뒤 페이지에 반영돼요.

## 이벤트 만드는 법

- 장면 하나 = `events/<이름>.js` 하나. `EV_SCENES['<id>']={start(),tick(t,dt)→끝나면 true,stop()}`로 등록.
- 공통 틀은 `js/game/events.js`: `startEvent`, `evCam(위치,보는곳,부드러움,컷)`, `evRelease(문구)`, `EV.field`(선수 직접 조종), 관중 반응 `evCrowdCheer/Shout`.
- 목록·문구는 `config.js`의 `EVENTS`, `EV_TEXT`. 열 때 `ready:true`.
- 빅보드 화면 연출은 `js/world/bbshow.js`, 효과음은 `js/audio/eventsfx.js`, 배경음은 `js/audio/evbgm.js`(파일은 `events/`, 목록은 `config.js`의 `EV_BGM`).
- 공용 도우미: `evBoardCam()` 빅보드 꽉 차게, `evCaption(글자,대상,높이,ms)` 3D 위치 위 자막, `evCount(b,s,o)`/`evCountOff()` 볼카운트 불, `evClapBuild(초)`/`evClapStop()` 빨라지는 박수, 선수 `setFace(종류)`/`clearFace()` 표정. 숨길 이벤트는 `EVENTS`에 `hidden:true`.
- `index.html`에 `<script src="events/<이름>.js">`를 `events/homer.js` 다음 줄에 추가.

## 불펜장 (미니게임)

- 야구장 위쪽 **불펜장** 버튼 → `js/ui/bullpen.js`가 `minigames/bullpen.html`을 화면 가득 창(iframe)으로 띄워요. 창이 열린 동안 야구장 그리기와 소리는 쉬어요(`MG.on`). 미니게임의 '야구장' 버튼이 `postMessage({munhak:'bullpen-close'})`로 닫아요.
- 미니게임 페이지는 야구장 코드와 엮이지 않아요. 각자 `minigames/shared/`만 써요.

| 파일 | 하는 일 |
|---|---|
| `minigames/bullpen.html` + `bullpen/` | 불펜장 첫 화면: 일러스트(`bullpen-bg.svg`), 게임 목록 `GAMES`(마운드 위 / 등판 대기 중), 내 라커 바로가기 |
| `minigames/locker.html` + `locker/` | 내 라커: 라커 두 칸. `#cards` 카드 앨범(등급 네 줄, 카드 누르면 뒷면 선수 정보), `#balls` 공박스(기념구 진열장·달별 선반·다시 보기) |
| `minigames/number-match.html` + `number-match/` | 등번호 매치 게임, 결과 시트, 덱 완성 엔딩. 주소에 `?dev`면 확인용 버튼 |
| `minigames/homerun.html` + `homerun/` | 홈런볼 모으기: `game.js`(판 진행·난이도·입력·다시 보기), `scene.js`(외야 장면·글러브·공), `cutscene.js`(그라운드 홈런·올스타 브레이크). 주소 끝 `#replay-ground`·`#replay-allstar`면 장면만 재생 후 공박스로, `?dev`면 확인용 버튼 |
| `minigames/shared/mg.css` | 공용 색·글꼴(야구장 토큰과 같음), 위쪽 막대, 버튼, 알림 |
| `minigames/shared/store.js` | `LOCKER`: 수집품 보관(이 기기 localStorage `munhak-locker-v1`: 카드·공·나이스 캐치·본 장면), `mgToast`, `mgExit` |
| `minigames/shared/roster.js` | 선수 명단 `ROSTER`(등번호·이름·등급 legendary/core/special/normal), 동명이인 `SAME_NAME`, `TIER_TAG`·`TIER_NAME` |
| `minigames/shared/players.js` | 카드 뒷면 정보 `PLAYER_INFO`(포지션·투타·체격·생일·2026 기록), 은퇴 선수 `PLAYER_LEGEND`, `NO_RECORD_MSG` |
| `minigames/shared/card.js` + `card.css` | 선수 카드 앞·뒷면, 앨범 칸, 크게 보기(`cardView`)와 선수 정보 면(`cardRear`) |
| `minigames/shared/homeruns.js` | 2026 정규시즌 홈런 143개 `HR`, 진열장 기념구 `HR_SPECIALS`, 올스타 위치 `HR_BREAK_IDX`, 달 묶음 `HR_MONTHS`, 기념구 글귀 `hrBallLines` |
| `minigames/shared/ball.js` + `ball.css` | 손글씨 기념구 그리기 `ballHTML`(글꼴 Nanum Pen Script), 크게 보기 모양 |

### 새 미니게임 더하는 법

1. `minigames/<이름>.html` + `minigames/<이름>/` 폴더(js·css). `shared/` 파일들을 불러와요.
2. `minigames/bullpen/bullpen.js`의 `GAMES`에 한 줄. 만드는 중엔 `ready:false`(등판 대기 중), 열 때 `ready:true`.
3. 모으는 게 있으면 `shared/store.js`의 `LOCKER`에 칸을 더하고, `locker.html`에 라커 칸을 열어요.
