/* ================= 불펜장 (미니게임) =================
   위쪽 '불펜장' 버튼 → minigames/bullpen.html을 야구장 위 창(iframe)으로 띄워요.
   창이 열려 있는 동안 야구장 그리기는 쉬어요(app/loop.js의 MG.on). 미니게임 쪽 '야구장' 버튼이 postMessage로 닫아요. */
var MG={on:false,url:'minigames/bullpen.html'};
/* url을 주면 그 미니게임 페이지로 바로 열어요(2026-11-01: 야푸먹기 티켓북 → 티켓팅 War) */
function openBullpen(url){
  if(EV.on||SS.on||MG.on)return;
  stopAct(true);MG.on=true;MG.prevAmb=AU.on;
  var u=url||MG.url,f=$('bullpenFrame');if(f.getAttribute('src')!==u)f.setAttribute('src',u);
  $('bullpen').hidden=false;document.body.classList.add('mg');
  if(AU.on&&AU.ctx)AU.ctx.suspend().catch(function(){});
  setTimeout(function(){try{f.focus()}catch(e){}},100);
}
function closeBullpen(){
  if(!MG.on)return;MG.on=false;$('bullpen').hidden=true;document.body.classList.remove('mg');
  $('bullpenFrame').setAttribute('src',MG.url);/* 다음에 열 때 불펜장 첫 화면부터 */
  if(AU.on&&AU.ctx)AU.ctx.resume().catch(function(){});
  last=performance.now();$('bBullpen').focus();
}
$('bBullpen').onclick=function(){auEnsure();openBullpen()};
window.addEventListener('message',function(e){if(e.data&&e.data.munhak==='bullpen-close')closeBullpen()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&MG.on)closeBullpen()});
