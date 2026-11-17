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
  MIN_SLOTS:5,
  PHOTO_AT_ONCE:3,             /* 짤을 동시에 몇 장씩 받을지 (가까운 것부터, frames.js mhPumpPhotos) */
  FONT_WAIT:1500,              /* 문 열기 전 글꼴을 기다리는 최대 시간(ms). 입구 글자만 기다리고 나머지는 들어간 뒤 받아요 */                 /* 구역마다 최소 걸 자리 수 (빈 자리는 '다음 짤이 걸릴 자리') */
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
  /* B존 끝 벽 전시 코너 (corner*.js): 끝 벽 앞에 사진 한 장 같은 작은 전시. 끄려면 on:false
     extra=통로를 끝 쪽으로 더 늘리는 길이(m), stop=끝 벽에서 이만큼 앞에서 멈춰 걸음(전시물에 안 들어가게)
     place=[x, z] 코너 기준 자리(x: 끝 벽을 볼 때 오른쪽+, z: 벽에서 통로 쪽으로), cutout=등신대 그림 */
  CORNER:{
    on:true,extra:1.6,stop:2.3,wallW:8.2,
    place:{cutout:[-2.5,1.2],cutout2:[-3.3,.7],jersey:[-1,.95],bag:[.95,0],cash:[1.05,1.3]},
    cutout:{src:'memorial/corner/cutout.webp',h:1.82,ratio:494/1100},      /* 분홍 맨투맨·보라 바지 */
    cutout2:{src:'memorial/corner/cutout2.webp',h:1.82,ratio:476/1100},    /* 주황 옷·흰 조끼 (첫 등신대 왼쪽 뒤) */
    red:'#c8102e',ink:'#1e2329',mute:'#6b7178',stone:'#cbbfa9',slab:'#e9e2d3',glassEdge:0x9fd6c4
  },
  /* 저장해 두는 값 이름 (store: 'munhak:이름') — 유니폼·등판·모자는 야구장과 같은 이름을 써요 */
  KEY:{uni:'uni',hat:'hat',backName:'backName',backNum:'backNum',dressed:'dressed',today:'hallToday'}
};
