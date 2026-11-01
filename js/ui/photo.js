/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 사진 찍기 =================
   takePhoto(이름): 지금 3D 화면을 한 장 그려 jpg로 만들고, 반짝 효과 뒤 미리보기 시트(#mPhoto)를 띄워요.
   저장은 내려받기 링크, 휴대폰에서 공유가 되면 '공유' 버튼도 보여요. 화면 버튼(HUD)은 사진에 들어가지 않아요.
   포토존 '찍기'와 위쪽 '직관 사진' 버튼(game/actions.js)이 같이 써요.

   (2026-11-01) 포토존은 폴라로이드로 저장해요 — takePhoto(이름, {pola:true})
   - 화면의 폴라로이드 틀(#pzFrame)에서 사진 칸(#pzWin)만 잘라 정사각형 PHOTO.SIZE px로
   - 아이보리 종이 + 두꺼운 아래 여백 + 연분홍 마스킹테이프 + 손글씨 문구·날짜 (모양 숫자는 POLA)
   - 문구는 PZ_CFG.pola.caption 하나로 고정. 미리보기에서 문구를 누르면 그 사진에만 바꿔요(다음 사진은 다시 기본)
   - 저장본: 반듯하게 + 둘레에 연한 배경(테이프가 안 잘리게) / 미리보기: 배경 없이 살짝 기울이고 그림자(CSS) */
var PHOTO={url:null,name:'munhak',SIZE:1080,shot:null,cap:null,date:'',pola:false,font:null};
/* 사진 칸 한 변을 1로 둔 비율. 화면 틀(styles/photozone.css의 .pz-paper·.pz-win)도 같은 비율이에요 */
var POLA={side:.075,top:.075,bot:.29,pad:.09,
  paper:'#fbf8f1',bg:'#f4ece6',ink:'#2b3a5c',inkSoft:'#5b6680',petal:'#f6a9bf',petalLine:'#d9809c',tape:'rgba(246,186,203,.82)',
  font:'"Nanum Pen Script", "Gaegu", cursive',capSize:.085,dateSize:.058};
function photoStamp(){var d=new Date(),p=function(n){return ('0'+n).slice(-2)};return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds())}
function photoDate(){var d=new Date(),p=function(n){return ('0'+n).slice(-2)};return d.getFullYear()+'. '+p(d.getMonth()+1)+'. '+p(d.getDate())}
/* 손글씨 글꼴은 포토존에 처음 들어갈 때 미리 받아둬요(ui/photozone-ui.js가 부름). 글꼴 파일은 fonts/ (2026-11-01부터 구글 대신 저장소) */
function photoFonts(){
  if(PHOTO.font)return PHOTO.font;
  PHOTO.font=new Promise(function(ok){
    if(!document.fonts||!document.fonts.load)return ok();
    var tm=setTimeout(ok,2500);/* 늦으면 기본 글꼴로 */
    document.fonts.load('60px "Nanum Pen Script"','문학에서 봄을 기다리며 2026').then(function(){clearTimeout(tm);ok()},ok);
  });
  return PHOTO.font;
}
/* 화면의 사진 칸(#pzWin)만 잘라 정사각형 캔버스로. 잠깐 해상도를 올려 한 번 그리고 바로 되돌려요(화면은 안 깜빡여요) */
function photoWin(){
  var win=$('pzWin').getBoundingClientRect(),cr=canvas.getBoundingClientRect();
  var pr0=renderer.getPixelRatio(),pr=Math.min(3,Math.max(pr0,PHOTO.SIZE/Math.max(1,win.width)));
  if(pr!==pr0)renderer.setPixelRatio(pr);
  renderer.render(scene,camera);
  var k=canvas.width/cr.width,o=document.createElement('canvas');o.width=o.height=PHOTO.SIZE;
  o.getContext('2d').drawImage(canvas,(win.left-cr.left)*k,(win.top-cr.top)*k,win.width*k,win.height*k,0,0,PHOTO.SIZE,PHOTO.SIZE);
  if(pr!==pr0){renderer.setPixelRatio(pr0);renderer.render(scene,camera)}
  return o;
}
/* 벚꽃잎 하나(가운데 홈이 파인 잎) */
function polaPetal(x,cx,cy,r,rot){
  x.save();x.translate(cx,cy);x.rotate(rot);x.beginPath();
  x.moveTo(0,r);x.bezierCurveTo(-r*1.1,r*.4,-r*.9,-r*.8,-r*.22,-r*.9);x.lineTo(0,-r*.62);x.lineTo(r*.22,-r*.9);x.bezierCurveTo(r*.9,-r*.8,r*1.1,r*.4,0,r);
  x.fillStyle=POLA.petal;x.fill();x.lineWidth=r*.09;x.strokeStyle=POLA.petalLine;x.stroke();
  x.beginPath();x.moveTo(0,r*.6);x.lineTo(0,-r*.2);x.lineWidth=r*.07;x.stroke();x.restore();
}
/* 마스킹테이프: 양 끝이 톱니처럼 뜯긴 반투명 띠 */
function polaTape(x,cx,cy,w,h,rot){
  x.save();x.translate(cx,cy);x.rotate(rot);var z=h/6;
  x.beginPath();x.moveTo(-w/2,-h/2);x.lineTo(w/2,-h/2);for(var i=0;i<6;i++)x.lineTo(w/2+(i%2?-z*.6:0),-h/2+(i+1)*z);
  x.lineTo(-w/2,h/2);for(i=0;i<6;i++)x.lineTo(-w/2+(i%2?0:z*.6),h/2-(i+1)*z);x.closePath();
  x.fillStyle=POLA.tape;x.fill();x.clip();
  x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=w*.02;for(var s=-w;s<w;s+=w*.09){x.beginPath();x.moveTo(s,-h/2);x.lineTo(s+h,h/2);x.stroke()}
  x.restore();
}
/* 폴라로이드 한 장(배경 없음): 종이 + 사진 + 문구·날짜 + 테이프. 돌려주는 값 {c:캔버스, cap:문구 칸 위치(0~1)} */
function polaCompose(shot,cap,date){
  var P=shot.width,sd=P*POLA.side,tp=P*POLA.top,bt=P*POLA.bot,pad=P*POLA.pad,W=P+sd*2,H=tp+P+bt;
  var c=document.createElement('canvas');c.width=Math.round(W+pad*2);c.height=Math.round(H+pad*2);var x=c.getContext('2d');
  x.translate(pad,pad);
  /* 종이 + 아주 옅은 결 */
  x.fillStyle=POLA.paper;x.fillRect(0,0,W,H);
  for(var i=0;i<2600;i++){x.fillStyle=Math.random()<.5?'#000':'#fff';x.globalAlpha=Math.random()*.035;x.fillRect(Math.random()*W,Math.random()*H,1+Math.random()*2,1+Math.random()*2)}x.globalAlpha=1;
  /* 사진 + 칸 테두리 그늘 */
  x.drawImage(shot,sd,tp,P,P);x.strokeStyle='rgba(60,40,20,.12)';x.lineWidth=3;x.strokeRect(sd+1.5,tp+1.5,P-3,P-3);
  /* 문구(왼쪽, 살짝 기울게) + 꽃잎 */
  var by=tp+P,fs=P*POLA.capSize,maxW=P*.82;x.font=fs+'px '+POLA.font;
  while(x.measureText(cap).width>maxW&&fs>P*.05){fs*=.94;x.font=fs+'px '+POLA.font}
  var cx=sd+P*.03,cy=by+bt*.42,tw=x.measureText(cap).width;
  x.save();x.translate(cx,cy);x.rotate(-.025);x.fillStyle=POLA.ink;x.textBaseline='middle';x.textAlign='left';x.fillText(cap,0,0);x.restore();
  polaPetal(x,cx+tw+fs*.55,cy-fs*.28,fs*.3,.5);
  /* 날짜(오른쪽 아래) */
  x.font=(P*POLA.dateSize)+'px '+POLA.font;x.fillStyle=POLA.inkSoft;x.textAlign='right';x.textBaseline='middle';x.fillText(date,sd+P-P*.02,by+bt*.76);
  /* 테이프: 위 가장자리에 걸쳐서 */
  polaTape(x,W/2,0,P*.34,P*.1,-.07);
  return {c:c,cap:{l:(pad+sd)/c.width,t:(pad+by+bt*.18)/c.height,w:P/c.width,h:bt*.46/c.height}};
}
/* 저장본: 연한 배경 + 종이 그림자 + 반듯한 폴라로이드 → jpg */
function polaFlat(card){
  var c=document.createElement('canvas');c.width=card.width;c.height=card.height;var x=c.getContext('2d');
  x.fillStyle=POLA.bg;x.fillRect(0,0,c.width,c.height);
  x.shadowColor='rgba(80,50,40,.18)';x.shadowBlur=c.width*.02;x.shadowOffsetY=c.width*.006;x.drawImage(card,0,0);
  return c.toDataURL('image/jpeg',.92);
}
/* 문구가 바뀌면 다시 그려 미리보기·저장 링크를 바꿔요 */
function polaRender(){
  var r=polaCompose(PHOTO.shot,PHOTO.cap,PHOTO.date);
  PHOTO.url=polaFlat(r.c);var a=$('photoSave');a.href=PHOTO.url;
  $('photoImg').src=r.c.toDataURL('image/png');
  var h=$('polaCapHit').style;h.left=r.cap.l*100+'%';h.top=r.cap.t*100+'%';h.width=r.cap.w*100+'%';h.height=r.cap.h*100+'%';
}
/* takePhoto(이름, {pola:true}) — pola면 폴라로이드(포토존), 아니면 지금 화면 그대로(직관 사진) */
function takePhoto(tag,opt){
  var pola=!!(opt&&(opt.pola||opt.square));
  try{if(pola)PHOTO.shot=photoWin();else{renderer.render(scene,camera);PHOTO.url=canvas.toDataURL('image/jpeg',.92)}}catch(e){toast('사진을 만들지 못했어요');return}
  PHOTO.pola=pola;PHOTO.name='munhak-'+(tag||'photo')+'-'+photoStamp()+'.jpg';
  var f=$('flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');sfx('tap');
  var ready=pola?photoFonts():Promise.resolve();
  setTimeout(function(){ready.then(function(){
    $('photoStage').classList.toggle('pola',pola);$('polaCapHit').hidden=!pola;$('polaCapIn').hidden=true;$('polaHelp').hidden=!pola;
    if(pola){PHOTO.cap=PZ_CFG.pola.caption;PHOTO.date=photoDate();polaRender()}else $('photoImg').src=PHOTO.url;
    var a=$('photoSave');a.href=PHOTO.url;a.download=PHOTO.name;
    $('photoShare').hidden=!(navigator.share&&navigator.canShare);openModal('mPhoto');
  })},reduceMotion?0:260);
}
/* 문구 고치기: 문구를 누르면 그 자리에 입력칸. 엔터·바깥 누르기로 끝, 비우면 기본 문구로 */
$('polaCapHit').onclick=function(){
  var i=$('polaCapIn'),h=$('polaCapHit');i.style.cssText=h.style.cssText;i.style.fontSize=Math.max(16,$('photoImg').clientWidth*.064)+'px';/* 16px 미만이면 아이폰이 확대돼요 */
  i.value=PHOTO.cap;i.hidden=false;h.hidden=true;i.focus();i.select();
};
function polaCapDone(){
  var i=$('polaCapIn');if(i.hidden)return;
  var t=i.value.trim().slice(0,PZ_CFG.pola.max);PHOTO.cap=t||PZ_CFG.pola.caption;
  i.hidden=true;$('polaCapHit').hidden=false;polaRender();
}
$('polaCapIn').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();polaCapDone()}else if(e.key==='Escape'){e.stopPropagation();this.value=PHOTO.cap;polaCapDone()}});
$('polaCapIn').addEventListener('blur',polaCapDone);
$('photoShare').onclick=function(){
  polaCapDone();
  fetch(PHOTO.url).then(function(r){return r.blob()}).then(function(b){
    var file=new File([b],PHOTO.name,{type:'image/jpeg'});
    if(navigator.canShare({files:[file]}))return navigator.share({files:[file],title:'문학 포토존'});
    toast('이 기기에서는 공유가 안 돼요. 저장을 눌러 주세요');
  }).catch(function(){});
};
