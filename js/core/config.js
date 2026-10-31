/* ================= data ================= */
var ADJ=['기쁜','화난','외로운','신난','설레는','졸린','배고픈','들뜬','씩씩한','수줍은','억울한','느긋한','두근거리는','목이 쉰','행복한','초조한','당당한','뿌듯한','감격한','지친'];
var UNI={
  red:{label:'빨강',hex:0xc8102e,css:'#c8102e',ink:'#ffffff',trim:'#f1d9a6'},
  green:{label:'초록',hex:0x1d6a46,css:'#1d6a46',ink:'#ffffff',trim:'#e9c45c'},
  white:{label:'흰색',hex:0xf6f4ed,css:'#f6f4ed',ink:'#c8102e',trim:'#1d2c4f'}
};
var UKEYS=['red','green','white'];
var SKIN=0xffdcc4,HAIR=0x3b2a22,PANTS=0xf2f0e9,SHOE=0x34343a,TEE=0xf3f1ea;
var ZONES={
  ussk:{label:'으쓱이존',desc:'응원단상 바로 앞, 제일 신나는 자리'},
  infield:{label:'내야',desc:'1루 베이스가 가까이 보이는 자리'},
  outfield:{label:'외야',desc:'홈런볼이 날아오는 오른쪽 담장 너머'},
  harulala:{label:'하룰라라석',desc:'4층 높은 곳, 구장이 한눈에'}
};
var ZKEYS=['ussk','infield','outfield','harulala'];
var BACKS=['으쓱이','직관러','봄날','만루','끝내기','도루왕','홈런볼','응원단','개막전',''];
var LINES={
  angry:['볼이잖아 볼!!','심판님 보셨잖아요!!','그걸 못 잡아?!','번트를 왜 대!!','병살만은 안 돼…','투수 바꿔!!','왜 거기서 뛰어!!','오늘 진짜 안 봐!!','아 진짜아아!!'],
  cheer:['가자!!','하나 더!','오늘도 이긴다!','최강 랜더스!','소리 질러!'],
  wave:['여기 보세요!!','흔들어 흔들어~','유니폼 들어!!','우리 선수 최고!']
};

var ME={adj:pick(ADJ),uni:pick(UKEYS),backName:store.get('backName',''),backNum:store.get('backNum',''),zone:store.get('zone','ussk')};
if(!ZONES[ME.zone])ME.zone='ussk';
function myName(){return ME.adj+' 으쓱이'}

/* field players — 팀 색, 수비 위치, 크기 (문학 홈팀 더그아웃은 1루 쪽) */
var TEAMS={
  home:{label:'우리 팀',body:0xf6f4ed,cap:0xc8102e,trim:0xc8102e,belt:0x1d2c4f,sock:0xc8102e,ink:'#c8102e',edge:'#ffffff',helmet:0xc8102e},
  away:{label:'상대 팀',body:0x9a9ea4,cap:0x34394a,trim:0x34394a,belt:0x34394a,sock:0x34394a,ink:'#2b3346',edge:'#d9dbde',helmet:0x34394a}
};
var HOME_SIDE=1;          // 우리 더그아웃 방향: 1 = 1루(+x)
var PLAYER_SCALE=1.25;    // 관중석에서 잘 보이도록 실제보다 조금 크게
var POS={                  // [x,z], 홈 (0,0), 중견수 쪽이 -z
  P:{label:'투수',at:[0,-18.2],y:.25},C:{label:'포수',at:[0,1.15]},
  '1B':{label:'1루수',at:[17.6,-23.5]},'2B':{label:'2루수',at:[8.5,-33]},SS:{label:'유격수',at:[-8.5,-33]},'3B':{label:'3루수',at:[-17.6,-23.5]},
  LF:{label:'좌익수',at:[-47,-66]},CF:{label:'중견수',at:[0,-84]},RF:{label:'우익수',at:[47,-66]}
};
var DEF_KEYS=['P','C','1B','2B','SS','3B','LF','CF','RF'];
var FIELD_MODE={attack:{label:'우리 공격',toast:'우리 팀 공격이에요. 타석에 우리 선수가 섰어요'},defense:{label:'우리 수비',toast:'우리 팀 수비예요. 그라운드에 우리 선수들이 나갔어요'}};

/* 이벤트 (나에게만 보이는 장면) — 목록·문구 */
var EVENTS=[
  {id:'homer',label:'최정 홈런',tag:'14번',desc:'최정이 그린존으로 큼지막하게 넘겨요',ready:true},
  {id:'kkk',label:'KKK',tag:'29번',desc:'김광현이 삼진 세 개를 잡고 만세',ready:true},
  {id:'yeonan',label:'8회말 여난부두 응원',tag:'떼창',desc:'불빛 속에 하나 되는 으쓱이들',ready:true},
  {id:'bench',label:'벤치클리어링',tag:'',desc:'양 팀 더그아웃이 우르르 나와요',ready:false,hidden:true},
  {id:'hog',label:'꽃돼지 안타',tag:'92번',desc:'데굴데굴 굴러서 1루까지',ready:false,hidden:true}
];
/* 이벤트 배경음: 직접 찍은 육성응원 (events/ 폴더) */
var EV_BGM={homer:'events/homer-bgm.mp3',yeonan:'events/yeonan.mp3'};
/* 8회말 여난부두: 음원(EV_BGM.yeonan)·가사(lyrics)는 사용자가 events/ 폴더에 직접 올려요. 둘 다 없어도 장면은 돌아가요.
   SWAY: 불빛을 왼쪽→오른쪽→왼쪽 한 번 흔드는 데 걸리는 초 / NO_SONG: 음원이 없을 때 장면 길이(초) */
var YEONAN={lyrics:'events/yeonan-lyrics.json',SWAY:3.2,NO_SONG:48};
var EV_TEXT={
  kkk:{start:'29번 김광현이 마운드에 올라요',k:'삼진',back:'KKK! 주변 으쓱이들이 일어나 환호해요',watch:'KKK 보는 중'},
  yeonan:{start:'8회말, 구장 조명이 꺼져요',on:'하나둘 폰 불빛이 켜져요',mute:'소리를 켜면 떼창이 들려요',back:'여난부두 떼창 끝! 다시 불이 켜져요',watch:'여난부두 응원 중'},
  homer:{start:'14번 최정이 타석에 들어서요',hit:'딱! 크다아아',land:'그린존으로 넘어갔어요!',back:'최정 홈런! 주변 으쓱이들이 일어나 환호해요',watch:'최정 홈런 보는 중'}
};
LINES.kkk=['김광현!! 김광현!!','KKK!!!','삼진이다!!','에이스!!','광현아 사랑해!!'];
LINES.yeonan=['여난부두~!!','최고다 랜더스!!','소름 돋았어','이 맛에 야구 보지'];
LINES.homer=['최정!! 최정!!','넘어갔다!!','홈런이다!!','소년장사!!','역시 최정!!'];

