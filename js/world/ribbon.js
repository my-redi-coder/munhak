/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 띠 전광판 가사 (2026-11-01) =================
   관중석을 두른 띠 전광판(js/world/props.js의 ledTex, 1024×64 그림 한 장을 여러 칸으로 이어 붙인 것).
   - 평소: 문구(props.js의 LED_MSGS)가 계속 흘러요.
   - 응원하기로 응원가가 나오면: 그 곡 가사 파일(lyrics/song번호.json, 2번 여난부두는 events/yeonan-lyrics.json)을 불러와
     지금 부르는 줄을 띄워요. 가사가 나오는 동안은 흐르던 글씨가 멈추고, 같은 줄이 칸마다 보여요. 줄이 바뀌면 반짝.
   - 여난부두 이벤트: events/yeonan.js의 ynLyric이 ribbonFeed()로 가사와 노래 시간을 넘겨줘요.
   - 쉬는 동안·노래가 끝나면 평소 문구로. 가사 파일이 없는 곡도 평소 문구 그대로.
   - 긴 줄은 한 칸에 맞게 글씨를 줄여요(RIB.max에서 RIB.min까지).
   app/loop.js가 매 프레임 ribbonTick(T)를 불러요. */
var RIB={line:null,flash:0,lit:false,cache:{},feed:null,max:30,min:17,gap:.035};
function ribLyricUrl(n){return n===2?YEONAN.lyrics:'lyrics/song'+n+'.json'}
/* 응원가 번호: SONGS의 파일 이름 song5.mp3 → 5 */
function ribSongNo(s){var m=s&&s.file&&String(s.file).match(/song(\d+)\./);return m?+m[1]:null}
function ribLoad(n){
  if(RIB.cache[n]!==undefined)return;RIB.cache[n]=null;/* 불러오는 중·없음 */
  fetch(ribLyricUrl(n),{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(d){
    if(d&&Array.isArray(d.lines))RIB.cache[n]=d.lines.filter(function(l){return typeof l.t==='number'&&l.text});
  }).catch(function(){});
}
function ribLineAt(L,t){if(!L)return null;
  for(var i=0;i<L.length;i++){var e=L[i].e!=null?L[i].e:(L[i+1]?L[i+1].t:L[i].t+4);if(t>=L[i].t&&t<e)return L[i].text}return null}
/* 여난부두 이벤트가 매 프레임 넘겨줘요 */
function ribbonFeed(L,t){RIB.feed={L:L,t:t,at:performance.now()}}
function ribDraw(text,glow){
  var c=ledTex.image,x=c.getContext('2d'),w=c.width,h=c.height,fs=RIB.max;
  x.fillStyle='#14211b';x.fillRect(0,0,w,h);x.textBaseline='middle';x.textAlign='center';
  do{x.font=fs+'px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';if(x.measureText(text).width<=w-70)break;fs--}while(fs>RIB.min);
  x.fillStyle='#ff5a6e';x.font='22px sans-serif';x.fillText('♪',22,h/2+2);x.fillText('♪',w-22,h/2+2);
  x.font=fs+'px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';
  if(glow){x.shadowColor='rgba(255,236,170,.95)';x.shadowBlur=14}
  x.fillStyle=glow?'#ffffff':'#f6e7b0';x.fillText(text,w/2,h/2+2);x.shadowBlur=0;
  ledTex.needsUpdate=true;
}
function ribbonTick(T){
  var text=null,f=RIB.feed;
  if(f&&performance.now()-f.at<400)text=ribLineAt(f.L,f.t);
  else if(typeof songPlaying==='function'&&songPlaying()){var n=ribSongNo(SONG.cur);if(n!=null){ribLoad(n);text=ribLineAt(RIB.cache[n],SONG.el.currentTime)}}
  if(text!==RIB.line){RIB.line=text;
    if(text){RIB.flash=T;RIB.lit=true;ribDraw(text,true)}
    else{ledDrawDefault();ledTex.needsUpdate=true}}
  else if(text&&RIB.lit&&T-RIB.flash>.35){RIB.lit=false;ribDraw(text,false)}
  if(text)ledTex.offset.x=0;else ledTex.offset.x=(T*RIB.gap)%1;
}
/* 글꼴(고운돋움)이 늦게 오면 평소 문구를 한 번 다시 그려요 */
if(document.fonts&&document.fonts.load)document.fonts.load('30px "Gowun Dodum"','봄에 만나요 V6를 향해').then(function(){if(!RIB.line){ledDrawDefault();ledTex.needsUpdate=true}},function(){});
