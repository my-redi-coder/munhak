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
| 화면(UI)  | `js/ui/`       | 알림·말풍선·이름표(`feedback.js`), 입장 준비(`setup.js`), 시트·설정(`sheets.js`), 경기 상황 칩·시트 — 공수·낮밤(`fieldmode.js`), 내 위치 펼침 메뉴(`places.js`), 담벼락(`wall.js`), 이벤트 목록 시트 + 이벤트 배경음 고르기(`event-sheet.js`), 이벤트 중 볼카운트 불(`count.js`), 불펜장 창(`bullpen.js`), 사진 찍기·미리보기(`photo.js`), 포토존 화면 버튼(`photozone-ui.js`)                                                                              |
| 게임 규칙 | `js/game/`     | 상태(`state.js`), 입장·구역 이동(`flow.js`), 행동(`actions.js`), 주변 으쓱이(`npc.js`), 입력(`input.js`), 카메라(`camera.js`), 걷기(`movement.js`), 그라운드 선수 배치·투구 흐름(`fieldplay.js`), 이벤트 진행 틀(`events.js`), 경기장 구경하기(`sightsee.js`), 포토존 진행·카메라·으쓱이 포즈(`photozone.js`), 이벤트 장면은 `events/` 폴더 |
| 소리      | `js/audio/`    | 함성·비트·효과음·내 음원 (`audio.js`), 이벤트 효과음 딱·뱃고동·파도·잠깐 낮추기·빨라지는 박수 (`eventsfx.js`), 이벤트 배경음 내 파일 보관·재생 (`evbgm.js`), 응원가 랜덤 재생 (`songs.js`, 곡 목록은 `songs/songs.js`)                                                                                                                 |
| 캐릭터    | `js/entities/` | 으쓱이 모델, 표정, 등판, 동작 (`character.js`), 그라운드 선수 모델·등판·자세 (`player.js`), 선수 표정 그림 (`bpface.js`)                                                                                                                                                                    |
| 공간      | `js/world/`    | 하늘, 그라운드, 펜스·소품, 빅보드(`bigboard.js`), 빅보드 화면 연출(`bbshow.js`), K보드 카드(`kboard.js`), 조명탑(자리 `TOWERS`), 낮·밤 경기(`daynight.js`), 관중석 블록(이어진 블록은 `open`·`reach`·`links`), 그린존(`greenzone.js`), 홈런 현수막(`hogbanner.js`), 바비큐존(`bbq.js`), 포토존 세트(`pz-kit.js` 공용, `pzone.js` 플레이어존, `hrboard.js` 홈런기념판), 관중 무리, 꽃잎                                                                |
| 엔진      | `js/engine/`   | 렌더러, 씬, 조명, 도형 합치기 도우미 (`renderer.js`)                                                                                                                                                                                                          |
| 바탕      | `js/core/`     | 공용 도우미(`util.js`), 데이터·문구·설정값(`config.js`)                                                                                                                                                                                                       |

스타일은 `styles/`: `tokens.css`(색·글꼴 토큰, 다크 모드) → `boot.css` → `setup.css` → `hud.css` → `sheets.css` → `event.css`(이벤트 시트·장면 중 화면·여난부두 가사) → `bullpen.css`(불펜장 창) → `photozone.css`(포토존 화면·사진 미리보기) → `wall.css`(담벼락). 화면 뼈대(마크업)는 `index.html`.

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
- 이벤트 중 + 내 자리로 돌아온 뒤 `EV_CALM[id]`초(config.js, 기본 30)는 `evCalm()`이 참 → 주변 으쓱이가 화내기를 고르지 않고(npc.js) 화 물결·달래기도 쉬어요(crowdtalk.js). 시작할 때 화내던 으쓱이는 `evCalmCrowd()`로 진정. 새 이벤트도 `EV_CALM`에 한 줄 추가.
- 공용 도우미: `evBoardCam()` 빅보드 꽉 차게, `evCaption(글자,대상,높이,ms)` 3D 위치 위 자막, `evCount(b,s,o)`/`evCountOff()` 볼카운트 불, `evClapBuild(초)`/`evClapStop()` 빨라지는 박수, 선수 `setFace(종류)`/`clearFace()` 표정. 숨길 이벤트는 `EVENTS`에 `hidden:true`.
- `index.html`에 `<script src="events/<이름>.js">`를 `events/homer.js` 다음 줄에 추가.

## 불펜장 (미니게임)

- 야구장 위쪽 **불펜장** 버튼 → `js/ui/bullpen.js`가 `minigames/bullpen.html`을 화면 가득 창(iframe)으로 띄워요. 창이 열린 동안 야구장 그리기와 소리는 쉬어요(`MG.on`). 미니게임의 '야구장' 버튼이 `postMessage({munhak:'bullpen-close'})`로 닫아요.
- 미니게임 페이지는 야구장 코드와 엮이지 않아요. 각자 `minigames/shared/`만 써요.

| 파일 | 하는 일 |
|---|---|
| `minigames/bullpen.html` + `bullpen/` | 불펜장 첫 화면: 일러스트(`bullpen-bg.svg`), 게임 목록 `GAMES`(마운드 위 / 등판 대기 중), 내 라커 바로가기 |
| `minigames/locker.html` + `locker/` | 내 라커: 라커 두 칸씩 두 줄. `#cards` 카드 앨범(등급 네 줄, 카드 누르면 뒷면 선수 정보), `#balls` 공박스(기념구 진열장·달별 선반·다시 보기), `#tickets` 티켓북(상대 구단별 탭, 누르면 꺼내 보기 + 하이라이트), 빈 라커(안 열리고 철컹 소리만, `lkClank`) |
| `minigames/number-match.html` + `number-match/` | 등번호 매치 게임, 결과 시트, 덱 완성 엔딩. 주소에 `?dev`면 확인용 버튼 |
| `minigames/homerun.html` + `homerun/` | 홈런볼 모으기: `game.js`(판 진행·난이도·입력·다시 보기), `scene.js`(외야 장면·글러브·공), `cutscene.js`(그라운드 홈런·올스타 브레이크). 주소 끝 `#replay-ground`·`#replay-allstar`면 장면만 재생 후 공박스로, `?dev`면 확인용 버튼 |
| `minigames/ticketing.html` + `ticketing/` | 티켓팅 War: `game.js`(예매 오픈·대기열·좌석도·판정·결제·발권), `ticketing.css`. 숫자(빈자리 시간 `LIFE`, 섞는 비율 `MIX`, 제한 시간)는 `game.js` 맨 위. `?dev`면 티켓 다 채우기·비우기 |
| `minigames/shared/tickets.js` | 2026 시즌 승리 경기 65개 `TICKETS`(날짜·선발·상대·홈/원정·구장·점수·하이라이트 영상 번호). 새 경기는 맨 뒤에 붙이기(번호가 저장 키) |
| `minigames/shared/ticket.js` + `ticket.css` | 승리 티켓 그리기 `tkHTML`·`tkStack`(겹친 매수)·`tkMini`(주머니에 꽂힌 절반), 티켓북 `tkBookHTML`·`tkTeamTabs`, 구단 탭 순서 `TK_TEAMS` |
| `minigames/shared/mg.css` | 공용 색·글꼴(야구장 토큰과 같음), 위쪽 막대, 버튼, 알림 |
| `minigames/shared/store.js` | `LOCKER`: 수집품 보관(이 기기 localStorage `munhak-locker-v1`: 카드·공·나이스 캐치·본 장면·티켓), `mgToast`, `mgExit` |
| `minigames/shared/roster.js` | 선수 명단 `ROSTER`(등번호·이름·등급 legendary/core/special/normal), 동명이인 `SAME_NAME`, `TIER_TAG`·`TIER_NAME` |
| `minigames/shared/players.js` | 카드 뒷면 정보 `PLAYER_INFO`(포지션·투타·체격·생일·2026 기록), 은퇴 선수 `PLAYER_LEGEND`, `NO_RECORD_MSG` |
| `minigames/shared/card.js` + `card.css` | 선수 카드 앞·뒷면, 앨범 칸, 크게 보기(`cardView`)와 선수 정보 면(`cardRear`) |
| `minigames/shared/homeruns.js` | 2026 정규시즌 홈런 143개 `HR`, 진열장 기념구 `HR_SPECIALS`, 올스타 위치 `HR_BREAK_IDX`, 달 묶음 `HR_MONTHS`, 기념구 글귀 `hrBallLines` |
| `minigames/shared/ball.js` + `ball.css` | 손글씨 기념구 그리기 `ballHTML`(글꼴 Nanum Pen Script), 크게 보기 모양 |

### 새 미니게임 더하는 법

1. `minigames/<이름>.html` + `minigames/<이름>/` 폴더(js·css). `shared/` 파일들을 불러와요.
2. `minigames/bullpen/bullpen.js`의 `GAMES`에 한 줄. 만드는 중엔 `ready:false`(등판 대기 중), 열 때 `ready:true`.
3. 모으는 게 있으면 `shared/store.js`의 `LOCKER`에 칸을 더하고, `locker.html`에 라커 칸을 열어요.

## 포토존 (플레이어존·홈런기념판)

- 들어가는 길: 위쪽 구역 버튼 → **내 위치** 펼침 메뉴 → '둘러보기'(`js/ui/places.js`). `pzStart('pz'|'hr')`, 나가기는 화면 왼쪽 위 '돌아가기'(`pzStop`).
- 세트는 야구장 밖 떨어진 곳에 처음 갈 때 지어요(플레이어존 x=150, 홈런기념판 x=−150, z=380). 세트 약속은 `js/world/pz-kit.js` 맨 위 주석. 새 포토존은 `PZ_SETS.<이름>`에 세트를 등록하고 `config.js`의 `PZ_CFG`에 이름·설명, `TOURS`에 이름, `places.js`의 `TOUR_GO`·`PLACE_ICO`에 한 줄, `photozone-ui.js`의 도구에 한 줄. 실내 세트면 `PZ_CFG`에 `indoor:true`(밤 경기여도 낮 조명).
- 사진용 으쓱이는 내 으쓱이(유니폼·등판)를 본떠 따로 세워요. 내 자리·행동은 그대로.
- 카메라: 정면에서 좌우(`PZ.pan`)와 가까이/멀리(`PZ.zoom`, 폴라로이드 틀의 사진 칸 `#pzWin`에 꽉 맞는 거리의 배수 — `pzFitD`, 칸 크기·위치는 `PZ_WIN`)만. 으쓱이를 누른 채 끌면 좌우로 옮겨요.
- 포즈는 `PZ_POSE`(game/photozone.js) 3개, 함수가 돌려주는 값이 표정: 소개 `normal` / 만세 `joy` / 브이 `happy`. 표정 그림은 `character.js`의 `faceTex`·`FACE`. `update`가 act 이름으로 찾아 써요.
- 찍기는 `takePhoto(이름, {pola:true})`(ui/photo.js): 포토존은 폴라로이드 틀의 사진 칸(`#pzWin`)만 잘라 1080×1080(`photoWin`, 잠깐 해상도를 올려 그림) → `polaCompose`로 종이·문구·날짜·테이프를 붙여 jpg. 틀 비율은 `POLA`와 `styles/photozone.css`가 같아야 해요. 위쪽 '직관 사진' 버튼(`game/actions.js`)은 화면 그대로. 버튼은 안 찍힘 → 미리보기 시트에서 저장·공유(문구는 미리보기에서 눌러 그 사진만 고침).
- 이 기기에 저장: 플레이어존 사진(`munhak:pzPhoto`, 긴 쪽 1400px jpg), 한 줄 문구(`pzLine`), 홈런 수(`pzHr`).

## 위쪽 버튼 · 내 위치 · 담벼락 (묶음 A, 2026-11-01)

- 위쪽 왼쪽: 나가기, **내 위치**(지금 구역 이름 ▾). 누르면 버튼 바로 아래 펼침 메뉴(`#placeMenu`, `js/ui/places.js`). 관중석 4곳 + 둘러보기(`TOURS` 순서: 홈런기념판·플레이어존·경기장 구경·담벼락). 구역별 관중 수는 보여 주지 않아요(위쪽 전체 관중 수만).
- 위쪽 오른쪽: 관중 수·소리·설정·직관 사진 / 이벤트·불펜장 / **상황 칩**(`#bMatch`, 예: '수비 · 낮'). 칩 → '경기 상황' 시트(`#mMatch`)에서 공수·낮밤 (`js/ui/fieldmode.js`). 이벤트 장면 중엔 안 열려요.
- 새 둘러보기 더하기: `config.js`의 `TOURS`에 이름 + `TOUR_CFG`에 `label` → `places.js`의 `TOUR_GO`(들어가는 함수)·`PLACE_ICO`(아이콘 path)에 한 줄씩.
- 경기장 구경: 둘러보기에서 `ssStart()`(`js/game/sightsee.js`), 나가기는 아래 '돌아가기'.
- 담벼락: `wallOpen()`/`wallClose()`(`js/ui/wall.js`). 글은 `index.html`의 `#wall` 안에만 있어요(고칠 땐 거기만). 벽 그림은 `wallArt()`. 손글씨 글꼴 3개는 처음 들어갈 때만 불러요. 담벼락이 열려 있는 동안 야구장 그리기는 쉬어요(`loop.js`의 `WALL.on`).

## 낮·밤 경기 (묶음 A, 2026-11-01)

- `js/world/daynight.js`: `setDayNight('day'|'night')` → `DN.FADE`(1.5초) 동안 서서히. 매 프레임 `dnTick(dt)`(`loop.js`). 저장 이름 `dayTime`.
- 밤 모습은 `DN_LOOK` 한 곳에서: 하늘 3색(`sky.js`의 `skyU`), 안개, 빛 3개(`renderer.js`), 구름, 조명탑 불빛 크기, 별 수. 구장은 조명 받은 듯 밝게 두고 색만 살짝 차갑게.
- 조명탑 불빛(머리판 전구 격자 + 번지는 빛)과 별은 처음 밤이 될 때 만들어요. 자리는 `landmarks.js`의 `TOWERS`·`towerRY`.
- 이벤트와 같이 쓰기: 장면이 돌고 있는 동안(`EV.run`) 낮밤 전환은 기다려요. 여난부두는 시작할 때 지금 모습을 기억해 두고 더 어둡게 갔다가 그대로 돌아와요. 그동안 `dnEventDark(n)`로 조명탑 불은 끄고 별은 띄워요.
- 실내 포토존은 `dnOverride(0)`(들어갈 때)·`dnOverride(null)`(나올 때). 페이드 안에서 바로 바뀌어요.


## 묶음 B: 스페인어 수첩 · 관중 멘트 · 티켓팅 War (2026-11-01)

- **스페인어 수첩** `js/ui/food-note.js` + `styles/food-note.css`: 야푸먹기 테이블(`food.js`의 `fdTable`)이 `noteSvg()`로 수첩을 그리고, `openFood`가 `noteBind()`, `closeFood`·`foodEsc`가 `noteClose()`. 펼친 수첩은 `#food` 안에 처음 열 때 만들어요(`noteBuild`). 글은 `NOTE_PAGES`만 고치면 돼요. 손글씨 글꼴은 처음 열 때만 불러와요.
- **핸드폰 잠금화면** `js/ui/food-phone.js` + `styles/food-phone.css`: `fdTable`이 `phoneSvg(hm)`로 작은 핸드폰을 그리고, `openFood`가 `phoneBind()`, `closeFood`·`foodEsc`가 `phoneClose()`. 펼친 잠금화면은 `#food` 안에 처음 열 때 만들어요(`phBuild`). 개막일·알림 글·링크는 `PHONE_CFG`만. 배경화면은 `phWall()` SVG.
- **관중 멘트** `js/game/crowdtalk.js`: 멘트 목록은 `config.js`의 `TALK`(angry·good·calm × any·attack·defense)와 `LINES`(cheer 구호·wave). `talkPool`이 지금 공수(`FP.mode`)를 보고 섞어요. `crowdSay` 말풍선(3.5초 안에 같은 글자 안 겹침), `crowdWave` 화·응원 물결(근처 여러 명이 따라 하고 몇 초 뒤 멈춤 `waveFollow`, 물결끼리 `CROWD.GAP`초 쉼), `crowdCalm` 화 물결 뒤 달래기. `npc.js`가 행동 시작 때 부르고, 내가 화내면 `npcReact`가 근처 여러 명을 끌어들여요. 비율·확률은 `CROWD` 숫자만 바꾸면 돼요.
- **티켓팅 War**: 위 불펜장 표 참고. 티켓 저장은 `LOCKER.addTicket(i,{n,tog,seat,blk})`. 발권 뒤 '티켓북에 꽂기'는 sessionStorage `tw-new`에 번호를 남기고 `locker.html#tickets`로 가요(방금 꽂은 티켓 강조).

## 묶음 C: 응원단상 마스코트 (2026-11-01)

- **모델(야구장과 분리)** `js/entities/mascot-kit.js` + `mascot-redi.js` + `mascot-barry.js`: THREE만 있으면 돌아가요. `makeRedi(o)`·`makeBarry(o)` → `Mascot`(`root`, `meshes`, `headG`=이름표 자리, `setUniform(uk)`, `pose('cheer'|'idle')`, `signature()`, `posing()`, `update(dt,beat)`, `dispose()`). `o = {uni, detail:'full'|'lite', scale}`. 유니폼 색은 `UNI`(config.js)가 있으면 그걸, 없으면 `MASCOT_UNI`. 생김새 숫자는 `REDI_DESIGN`·`BARRY_DESIGN`, 포즈 시간은 `MASCOT_SIG`.
- **응원단상** `js/game/mascots.js`: `makeMascots()`(boot.js, `makeLeader()` 다음)가 `stageG`에 세움. `mascotTick(dt,beat)`(loop.js, 매 프레임 — 입장 준비 화면에서도 유니폼은 따라감): `ME.uni` 비교 → `setUniform`, `leader.act==='cheer'`면 율동, `player.act==='cheer'`이고 이벤트 중이 아니면 `MASC.next` 타이머로 랜덤 포즈. 누르기는 `input.js`가 `mascotMeshes()`를 맞힘 대상에 넣고 `userData.mascot`이면 `mascotTap` + 이름표.
- 배리 몸통은 정면 윤곽(`barryCrownShape`)을 가운데에서 사방으로 부풀린 면(`barryCrownGeo`), 얼굴 부품은 `barryFront(x,y)`로 휜 앞면에 붙여요. 재질은 빛을 덜 타게(일부 자체 발광) 해서 야구장 빛에 하얗게 날아가지 않게.


## 묶음 F: 티켓북 바로가기 · 퍼펙트 판 · 글꼴 (2026-11-01)

- **글꼴**: `fonts/fonts.css`(@font-face 6개) → 각 html `<head>`에서 한 줄(`fonts/fonts.css`, 미니게임은 `../fonts/fonts.css`). 구글 글꼴 서버는 안 씀. 새 글자가 필요하면 원본 글꼴을 다시 줄여야 해요(Claude에게 부탁).
- **야푸먹기 → 티켓북**: `js/ui/food-ticket.js`가 라커 페이지를 `?embed=1`로 iframe에 띄움. 라커 쪽(`minigames/locker/locker.js`의 `LK_EMBED`)은 '뒤로'·Esc를 `parent.postMessage('munhak:tkb-close')`로, '티켓팅 하러 가기'를 `'munhak:tkb-ticketing'`으로 바꿔 보냄. 같은 사이트(origin)에서 온 메시지만 받음.
- **불펜장 창에 바로 열기**: `openBullpen(url)` — url을 주면 그 미니게임 페이지로.
- **홈런볼 퍼펙트·도전**: `minigames/homerun/perfect.js`(game.js 다음에 불러옴). game.js는 `pfPool()` `pfMoment()` `pfResult()` `pfReset()`만 부름. 금 글러브 아이콘은 `minigames/shared/glove.js`(결과·공박스 공용).
- **저장 칸**: `minigames/shared/store.js`의 `munhak-locker-v1`은 이름·모양을 바꾸지 않기. 새 항목은 기본값을 넣어 더하기(이번 `perfect`처럼).

## 티켓팅 War 직관전승 (2026-11-01)

- 계산·그림은 `minigames/shared/ticket.js`(`tkTeamPerfect` `tkTeamSplit` `tkSeal` `tkPerfHead` `tkRebookHead`, 티켓팅·티켓북 공용), 연출·다시 예매·확률은 `minigames/ticketing/perfect.js`(game.js 앞에 불러옴).
- 저장 칸은 그대로(티켓 기록만 보고 계산). 확인용으로 `LOCKER.removeTicket(i)`만 더함.
