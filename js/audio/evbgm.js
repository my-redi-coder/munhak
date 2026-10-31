/* ================= 이벤트 배경음 (내 파일) =================
   이벤트마다 내가 고른 음원·영상 파일을 배경음으로 틀어요. 페이지에 넣지 않고
   이 기기 브라우저(IndexedDB)에만 보관해요. 그래서 공유받은 사람에겐 안 들리고, 다른 기기에선 다시 골라야 해요.
   소리는 '응원 비트' 채널(AU.beat)로 나가요.
   evBgmSet(id, file) / evBgmClear(id) / evBgmName(id) / evBgmPlay(id) / evBgmStop(fadeSec) / evBgmDuck(sec) */
var EVB={files:{},el:null,src:null,gain:null,url:null,on:false,BASE:.9,DB:'munhak',ST:'evbgm'};
function evbDB(fn){try{var r=indexedDB.open(EVB.DB,1);r.onupgradeneeded=function(){r.result.createObjectStore(EVB.ST)};r.onsuccess=function(){fn(r.result)};r.onerror=function(){}}catch(e){}}
function evbSave(id,v){evbDB(function(db){try{var s=db.transaction(EVB.ST,'readwrite').objectStore(EVB.ST);v?s.put(v,id):s.delete(id)}catch(e){}})}
evbDB(function(db){try{var q=db.transaction(EVB.ST).objectStore(EVB.ST).openCursor();q.onsuccess=function(){var c=q.result;if(!c){if(typeof syncEvBgmUI==='function')syncEvBgmUI();return}EVB.files[c.key]=c.value;c.continue()}}catch(e){}});
function evBgmSet(id,file){EVB.files[id]={blob:file,name:file.name};evbSave(id,EVB.files[id])}
function evBgmClear(id){delete EVB.files[id];evbSave(id,null)}
function evBgmName(id){return EVB.files[id]?EVB.files[id].name:''}
function evBgmPlay(id){
  var f=EVB.files[id];if(!f||!auEnsure()||!AU.on)return false;var c=AU.ctx;
  if(!EVB.el){EVB.el=new Audio();EVB.el.playsInline=true;EVB.gain=c.createGain();try{EVB.src=c.createMediaElementSource(EVB.el);EVB.src.connect(EVB.gain);EVB.gain.connect(AU.beat)}catch(e){}}
  if(EVB.url)URL.revokeObjectURL(EVB.url);EVB.url=URL.createObjectURL(f.blob);EVB.el.src=EVB.url;EVB.el.currentTime=0;
  EVB.gain.gain.cancelScheduledValues(c.currentTime);EVB.gain.gain.setValueAtTime(0,c.currentTime);EVB.gain.gain.linearRampToValueAtTime(EVB.BASE,c.currentTime+.6);
  EVB.on=true;EVB.el.play().catch(function(){});return true;
}
function evBgmStop(fade){
  if(!EVB.el||!EVB.on)return;EVB.on=false;var c=AU.ctx,t=c.currentTime,el=EVB.el;fade=fade||.4;
  EVB.gain.gain.cancelScheduledValues(t);EVB.gain.gain.setTargetAtTime(0,t,fade/3);setTimeout(function(){if(!EVB.on)el.pause()},fade*1000+100);
}
function evBgmDuck(sec){if(!EVB.on)return;var t=AU.ctx.currentTime,g=EVB.gain.gain;g.cancelScheduledValues(t);g.setTargetAtTime(EVB.BASE*.15,t,.12);g.setTargetAtTime(EVB.BASE,t+sec,.6)}
document.addEventListener('visibilitychange',function(){if(!EVB.el||!EVB.on)return;if(document.hidden)EVB.el.pause();else if(AU.on)EVB.el.play().catch(function(){})});
