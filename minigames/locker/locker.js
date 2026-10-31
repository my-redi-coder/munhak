/* ================= 내 라커 =================
   첫 화면: 라커 두 칸(카드 앨범 / 공박스 준비 중). 카드 앨범을 누르면 #cards 화면.
   주소 끝이 #cards면 바로 카드 앨범을 열어요(등번호 매치 결과에서 넘어올 때). */
function lkRender(){
  var n=LOCKER.cardCount(),T=ROSTER.length;
  document.getElementById('cardsMeta').textContent=n+' / '+T+'장';
  var cards=location.hash==='#cards';
  document.getElementById('home').hidden=cards;document.getElementById('cards').hidden=!cards;
  document.getElementById('title').textContent=cards?'카드 앨범':'내 라커';
  if(!cards)return;
  var pct=Math.round(n/T*100);
  document.getElementById('albumCount').textContent=n+' / '+T;
  document.getElementById('albumPct').textContent=pct+'%';
  document.getElementById('albumBar').style.width=pct+'%';
  var fresh={};try{(JSON.parse(sessionStorage.getItem('nm-new')||'[]')).forEach(function(no){fresh[no]=1})}catch(e){}
  function cell(p){return cardMini(p,LOCKER.hasCard(p.no),fresh[p.no])}
  document.getElementById('albumSpecial').innerHTML=ROSTER.filter(function(p){return p.tier!=='normal'}).map(cell).join('');
  document.getElementById('albumAll').innerHTML=ROSTER.filter(function(p){return p.tier==='normal'}).map(cell).join('');
  document.getElementById('doneNote').hidden=n<T;
}
document.getElementById('back').onclick=function(){if(location.hash==='#cards')location.hash='';else location.href='bullpen.html'};
window.addEventListener('hashchange',lkRender);
window.addEventListener('pageshow',lkRender);
lkRender();
