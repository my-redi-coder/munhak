/* ================= 응원가 랜덤 재생 =================
   응원하기를 누르면 SONGS(songs/songs.js)에서 한 곡을 랜덤으로 골라 틀어요. 직전 곡은 연달아 안 나와요.
   우선순위: 설정에서 고른 '내 응원가' 파일 > 직접 만든 응원가(SONGS) > 기본 비트
   으쓱이 율동은 곡마다 적어 둔 bpm·offset으로 박자를 맞춰요(songBeat). 소리는 '응원 비트' 채널(AU.beat). */
var SONG={el:null,cur:null,last:-1};
function songPick(){var n=SONGS.length;if(!n)return null;var i=Math.floor(Math.random()*n);if(n>1&&i===SONG.last)i=(i+1+Math.floor(Math.random()*(n-1)))%n;SONG.last=i;return SONGS[i]}
function songStart(){
  var s=songPick();if(!s)return false;
  if(!SONG.el){SONG.el=new Audio();SONG.el.loop=true;SONG.el.playsInline=true;try{AU.ctx.createMediaElementSource(SONG.el).connect(AU.beat)}catch(e){}}
  SONG.cur=s;SONG.el.src='songs/'+s.file;SONG.el.currentTime=0;SONG.el.play().catch(function(){});return true;
}
function songStop(){if(SONG.el)SONG.el.pause();SONG.cur=null}
function songPlaying(){return !!(SONG.cur&&SONG.el&&!SONG.el.paused)}
function songBeat(){return Math.max(0,(SONG.el.currentTime-(SONG.cur.offset||0))*(SONG.cur.bpm||128)/60)}
document.addEventListener('visibilitychange',function(){if(!SONG.cur||!SONG.el)return;if(document.hidden)SONG.el.pause();else if(AU.on&&AU.beatOn)SONG.el.play().catch(function(){})});
