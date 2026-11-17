/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/config: 문학기념관 설정 =================
   기념관(memorial.html)의 숫자·이름은 여기서만 고쳐요. 이 페이지의 이름은 모두 MH 한 곳에 모아서 야구장 코드(config.js 등)와 안 겹쳐요.
   · 짤 목록은 memorial/photos.json (짤을 더 걸 땐 거기만 고치면 구역 길이가 알아서 늘어나요)
   · 구역: K=최광야구(왼쪽 상설전시), A=2026년 짤, B=그 이전 짤. C·D는 아직 안 열어요(MH.OPEN에 넣으면 열릴 준비)
   · 통로 길이는 짤 개수로 정해져요(layout.js). 너무 길어지면 통로가 알아서 더 크게 둥글어져요 */
var MH={
  PHOTOS_URL:'memorial/photos.json',
  ZONES:{
    K:{label:'최광야구',code:'CK'},
    A:{label:'ZONE A',code:'A'},
    B:{label:'ZONE B',code:'B'}
  },
  OPEN:['A','B'],              /* 열려 있는 일반 구역 (위치 순서대로) */
  MIN_SLOTS:5,                 /* 구역마다 최소 걸 자리 수 (빈 자리는 '다음 짤이 걸릴 자리') */
  HALL:{
    rIn:38,rOut:46,rMid:42,height:4.2,        /* 콩코스: 안쪽 벽·바깥 벽 반지름(m), 천장 높이. 반지름은 layout.js가 길이에 맞춰 키울 수 있음 */
    hallHalf:9.5,                              /* 입구 홀 반 길이(m) */
    portalS:-10,                               /* 최광야구 입구 자리 */
    kStart:-13.8,                              /* 최광야구 첫 액자 */
    zoneStart:9.5,                             /* A존 시작 (B는 A 길이만큼 뒤) */
    gap:3.9,                                   /* 액자 사이 간격 */
    frameW:2.8,frameH:1.575,frameY:1.95,       /* 액자(16:9) 크기·가운데 높이 */
    todayScale:1.3,                            /* 오늘의 포토 액자 배율 */
    endL:-51,endR:98,                          /* 통로 양 끝 (layout.js가 다시 계산) */
    walkSpeed:2.7,
    wallInk:'#1e2329',wallMute:'#6b7178',red:'#c8102e',wine:'#8f1630'
  },
  /* 저장해 두는 값 이름 (store: 'munhak:이름') — 유니폼·등판·모자는 야구장과 같은 이름을 써요 */
  KEY:{uni:'uni',hat:'hat',backName:'backName',backNum:'backNum',dressed:'dressed',today:'hallToday'}
};
