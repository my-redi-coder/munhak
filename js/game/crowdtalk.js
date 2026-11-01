/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 관중 멘트 + 물결 (묶음 B, 2026-11-01) =================
   멘트 목록은 core/config.js의 TALK(angry·good·calm × any·attack·defense)와 LINES(cheer 구호·wave).
   - talkPool(kind): 언제든 + 지금 공수(FP.mode) 멘트
   - actLine(act): 행동에 맞는 한 줄 (cheer = 구호 + 좋은 반응, angry = 화, wave = 흔들기)
   - crowdSay(ch,act): 말풍선. 몇 초 안에 같은 글자는 다시 안 나와요(물결 때 서로 다른 멘트)
   - crowdWave(act,src): 화(angry)·응원(cheer)은 근처 으쓱이 여러 명에게 번져요. 물결끼리는 CROWD.GAP초 쉬어요
   - 화 물결이 끝나면 가끔 옆 사람이 달래요(calm) */
var CROWD={GAP:6,last:-99,recent:[],
  JOIN:{angry:[2,5],cheer:[3,6]},   /* 물결에 따라오는 사람 수 범위 */
  SAY:{angry:.8,cheer:.6,wave:.45}, /* 행동을 시작할 때 말풍선을 띄울 확률 */
  CALM:.5};
function talkPool(kind){var t=TALK[kind],m=(typeof FP!=='undefined'&&FP.mode==='attack')?'attack':'defense';return t.any.concat(t[m]||[])}
function actLine(act){
  if(act==='angry')return crowdPick(talkPool('angry'));
  if(act==='cheer')return crowdPick(Math.random()<.35?LINES.cheer:talkPool('good'));
  return crowdPick(LINES[act]||LINES.cheer);
}
function crowdPick(list){
  var now=performance.now();CROWD.recent=CROWD.recent.filter(function(r){return now-r.t<3500});
  var used=CROWD.recent.map(function(r){return r.s}),ok=list.filter(function(s){return used.indexOf(s)<0});
  var s=pick(ok.length?ok:list);CROWD.recent.push({s:s,t:now});return s;
}
function crowdSay(ch,act,force){
  if(typeof EV!=='undefined'&&EV.on)return;
  if(!force&&Math.random()>(CROWD.SAY[act]||.4))return;
  addLabel(ch,actLine(act),act==='angry'?'angry':'say',2200);
}
function crowdNear(x,z,except){
  return npcs.filter(function(n){return n!==except&&!n.follow&&!n.act}).sort(function(a,b){
    return Math.hypot(a.seat.x-x,a.seat.z-z)-Math.hypot(b.seat.x-x,b.seat.z-z)});
}
function crowdWave(act,src){
  if(act!=='angry'&&act!=='cheer')return 0;if(typeof EV!=='undefined'&&EV.on)return 0;
  if(act==='angry'&&typeof evCalm==='function'&&evCalm())return 0;/* 이벤트 직후엔 화 물결 없음 */
  var T=performance.now()/1000;if(T-CROWD.last<CROWD.GAP)return 0;CROWD.last=T;
  var x=src.seat?src.seat.x:src.root.position.x,z=src.seat?src.seat.z:src.root.position.z;
  var R=CROWD.JOIN[act],want=Math.floor(rnd(R[0],R[1]+1)),list=crowdNear(x,z,src).slice(0,want+2),n=0;
  list.forEach(function(c){if(n>=want||Math.random()<.2)return;n++;c.follow=true;c.waveFollow=true;c.joinAt=rnd(.3,2.2);c.want=act});
  if(act==='angry')setTimeout(function(){crowdCalm(x,z)},rnd(4200,5600));
  return n;
}
function crowdCalm(x,z){
  if(typeof EV!=='undefined'&&EV.on)return;if(typeof evCalm==='function'&&evCalm()&&player.act!=='angry')return;/* 화낸 사람이 없으면 달래지 않아요 */
  if(Math.random()>CROWD.CALM)return;
  var c=npcs.filter(function(n){return n.act!=='angry'}).sort(function(a,b){return Math.hypot(a.seat.x-x,a.seat.z-z)-Math.hypot(b.seat.x-x,b.seat.z-z)})[0];
  if(c)addLabel(c,crowdPick(talkPool('calm')),'say',2400);
}
