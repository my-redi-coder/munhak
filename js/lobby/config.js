/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 설정 (lobby.html) =================
   글귀 · 열림 여부 · 눌렀을 때 가는 곳(주소)을 여기서만 고쳐요. 그림 모양은 scenery·stadium·props·people.js.
   - kind: 'enter'(두 번째 누르면 url로 이동) / 'info'(안내만) / 'museum'(museumOpen이 true일 때만 열려요)
   - url: 가는 곳(3D 야구장 본체는 stadium.html, 로비 자신은 index.html)
   - prefetch: 첫 번째 누를 때 미리 받아 두는 파일(두 번째 누를 때 덜 기다리게) */
const CONFIG = {
  museumOpen: false,            // true로 바꾸면 문학기념관 문이 열려요(url도 함께 채우기)
  idleClearSec: 10,             // 이름표가 떠 있다가 저절로 꺼지는 시간
  hotspots: {
    stadium: { kind:'enter', label:'티켓부스', sub:'경기장 입장', url:'stadium.html', go:'경기장으로 입장하는 중',
               prefetch:['stadium.html','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'] },
    bullpen: { kind:'enter', sub:'미니게임', url:'minigames/bullpen.html', go:'불펜장으로 가는 중',
               prefetch:['minigames/bullpen.html'] },
    locker:  { kind:'enter', label:'라커룸', sub:'수집품 보관소', url:'minigames/locker.html', go:'라커룸으로 가는 중',
               prefetch:['minigames/locker.html'] },
    wall:    { kind:'enter', label:'담벼락', sub:'제작자의 말', url:'wall.html', go:'담벼락으로 가는 중',
               prefetch:['wall.html'] },
    gate:    { kind:'info',  label:'정문', sub:['표가 있어야 들어갈 수 있어요','티켓부스로 가볼까요?'] },
    museum:  { kind:'museum', label:'문학기념관', sub:()=> CONFIG.museumOpen ? '' : '준비 중이에요',
               url:null, go:'문학기념관으로 가는 중', closedMsg:'아직 전시 기간이 아닙니다' }
  },
  // 이름표가 뜰 때 풍선 꼬리가 향하는 자리(그림 좌표 400×760)
  anchors: {
    stadium:{x:82,y:422}, wall:{x:180,y:452}, bullpen:{x:268,y:556},
    locker:{x:348,y:556}, gate:{x:200,y:298}, museum:{x:318,y:298}
  },
  talk: ['봄에 만나요','V6를 향해','다음 시즌, 문학에서','Go for it!','소리 질러!']   // 으쓱이들이 가끔 하는 말
};
