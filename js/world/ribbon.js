/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 띠 전광판 가사 (2026-11-01) =================
   관중석을 두른 띠 전광판(js/world/props.js의 ledTex, 1024×64 그림 한 장을 여러 칸으로 이어 붙인 것).
   - 평소: 문구(props.js의 LED_MSGS)가 계속 흘러요.
   - 응원하기로 응원가가 나오면: 그 곡 가사 파일(lyrics/song번호.json, 2번 여난부두는 events/yeonan-lyrics.json)을 불러와
     지금 부르는 줄을 '♪ 줄 ♪ 줄 ♪ …'처럼 끊김 없이 이어 붙여 흘려요(평소보다 조금 빠르게, RIB.lyrSpeed). 줄이 바뀌면 반짝.
     (2026-11-01 고침) 처음엔 멈춰서 가운데 띄웠는데, 구역마다 판 길이가 달라 짧은 판에선 잘려 보여서 흐르기로 바꿈
   - 여난부두 이벤트: events/yeonan.js의 ynLyric이 ribbonFeed()로 가사와 노래 시간을 넘겨줘요.
   - 쉬는 동안·노래가 끝나면 평소 문구로. 가사 파일이 없는 곡도 평소 문구 그대로.
   - 그림 한 장(1024px)에 줄이 딱 맞게 몇 번 반복되도록 살짝 늘이거나 줄여서, 이어지는 곳이 끊겨 보이지 않아요. 아주 긴 줄은 글씨를 줄여요.
   app/loop.js가 매 프레임 ribbonTick(T)를 불러요. */
var RIB={line:null,flash:0,lit:false,cache:{},feed:null,max:30,min:17,speed:.035,lyrSpeed:.06,off:0,lastT:null};
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
/* 줄을 '♪ 줄' 단위로 이어 붙여, 그림 한 장에 정수 번 들어가게 가로로 살짝 맞춰요 → 이어 붙인 곳도 매끈 */
function ribDraw(text,glow){
  var c=ledTex.image,x=c.getContext('2d'),w=c.width,h=c.height,fs=RIB.max,unit=function(){return x.measureText('♪  '+text+'      ').width};
  x.setTransform(1,0,0,1,0,0);x.fillStyle='#14211b';x.fillRect(0,0,w,h);x.textBaseline='middle';x.textAlign='left';
  x.font=fs+'px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';
  while(unit()>w&&fs>RIB.min){fs--;x.font=fs+'px "Gowun Dodum","Apple SD Gothic Neo",sans-serif'}
  var u=unit(),k=Math.max(1,Math.round(w/u)),sx=w/(k*u);
  x.save();x.scale(sx,1);
  for(var i=0;i<k;i++){var px=i*u;
    x.shadowBlur=0;x.fillStyle='#ff5a6e';x.fillText('♪',px+6,h/2+2);
    if(glow){x.shadowColor='rgba(255,236,170,.95)';x.shadowBlur=14}
    x.fillStyle=glow?'#ffffff':'#f6e7b0';x.fillText(text,px+6+x.measureText('♪  ').width,h/2+2)}
  x.restore();x.shadowBlur=0;ledTex.needsUpdate=true;
}
function ribbonTick(T){
  var text=null,f=RIB.feed;
  if(f&&performance.now()-f.at<400)text=ribLineAt(f.L,f.t);
  else if(typeof songPlaying==='function'&&songPlaying()){var n=ribSongNo(SONG.cur);if(n!=null){ribLoad(n);text=ribLineAt(RIB.cache[n],SONG.el.currentTime)}}
  if(text!==RIB.line){RIB.line=text;
    if(text){RIB.flash=T;RIB.lit=true;ribDraw(text,true)}
    else{ledDrawDefault();ledTex.needsUpdate=true}}
  else if(text&&RIB.lit&&T-RIB.flash>.35){RIB.lit=false;ribDraw(text,false)}
  /* 흐르기: 평소 문구·가사 모두. 속도만 달라요(멈추지 않아요) */
  var dt=RIB.lastT==null?0:Math.min(.1,Math.max(0,T-RIB.lastT));RIB.lastT=T;
  RIB.off=(RIB.off+dt*(text?RIB.lyrSpeed:RIB.speed))%1;ledTex.offset.x=RIB.off;
}
/* 글꼴(고운돋움)이 늦게 오면 평소 문구를 한 번 다시 그려요 */
if(document.fonts&&document.fonts.load)document.fonts.load('30px "Gowun Dodum"','봄에 만나요 V6를 향해').then(function(){if(!RIB.line){ledDrawDefault();ledTex.needsUpdate=true}},function(){});
