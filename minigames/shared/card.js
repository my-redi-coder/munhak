/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 선수 카드 그리기 (등번호 매치·카드 앨범 공용) ================= */
function cardEsc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function cardTag(p){var t=TIER_TAG[p.tier];return t?'<span class="tag" aria-hidden="true">'+t+'</span>':''}
/* 게임 카드 앞면: kind 'num'(등번호만) | 'name'(이름만) | 'both'(크게 보기) */
function cardFace(p,kind){
  var num='<span class="num'+(p.no.length>=3?' n3':'')+'">'+cardEsc(p.no)+'</span>';
  var nm='<span class="nm'+(p.name.length>=4?' long':'')+'">'+cardEsc(p.name)+'</span>'+(p.pos?'<span class="pos">'+cardEsc(p.pos)+'</span>':'');
  var inner=kind==='num'?num:kind==='both'?num+nm:nm+'<span class="under"></span>';
  return '<div class="pc-front t-'+p.tier+'"><div class="pc-face">'+cardTag(p)+inner+'</div></div>';
}
/* 카드 뒷면: 랜더스 빨강 + 야구공 실밥 */
var CARD_BACK='<div class="pc-back"><svg viewBox="0 0 60 80" aria-hidden="true"><path d="M13 -2 C27 22 27 58 13 82" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M47 -2 C33 22 33 58 47 82" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M15.5 -2 C29.5 22 29.5 58 15.5 82" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="1.4 4.2" opacity=".55"/><path d="M44.5 -2 C30.5 22 30.5 58 44.5 82" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="1.4 4.2" opacity=".55"/></svg></div>';
/* 앨범 칸: 모은 카드는 번호+이름(누르면 크게), 못 모은 칸은 ? */
function cardMini(p,has,isNew){
  if(!has)return '<div class="pc-mini locked" role="img" aria-label="아직 못 모은 카드">?</div>';
  return '<button class="pc-mini'+(isNew?' isnew':'')+'" data-no="'+cardEsc(p.no)+'" aria-label="'+cardEsc(p.no+'번 '+p.name+' 카드 크게 보기')+'"><div class="pc-front t-'+p.tier+'"><div class="pc-face">'+cardTag(p)
    +'<span class="num'+(p.no.length>=3?' n3':'')+'">'+cardEsc(p.no)+'</span><span class="mn">'+cardEsc(p.name)+(p.pos?' <small>'+cardEsc(p.pos.charAt(0))+'</small>':'')+'</span></div></div></button>';
}
/* 선수 정보 면 (players.js) */
function cardAge(b){var a=b.split('.'),t=new Date(),n=t.getFullYear()-a[0];if(t.getMonth()+1<+a[1]||(t.getMonth()+1===+a[1]&&t.getDate()<+a[2]))n--;return n}
function cardRear(p){
  var head='<div class="rn"><b>'+cardEsc(p.no)+'</b><span>'+cardEsc(p.name)+(p.pos?' <small>('+cardEsc(p.pos)+')</small>':'')+'</span></div>';
  var L=typeof PLAYER_LEGEND!=='undefined'&&PLAYER_LEGEND[p.no];
  if(L)return '<div class="pc-front t-'+p.tier+'"><div class="pc-rear">'+head+'<div class="nick">'+cardEsc(L.pos)+' · 은퇴</div><div class="motto">'+cardEsc(L.nick)+'</div><div class="lines">'
    +L.lines.map(function(l){return '<p>'+cardEsc(l)+'</p>'}).join('')+'</div></div></div>';
  var I=(typeof PLAYER_INFO!=='undefined'&&PLAYER_INFO[p.no])||['','','','',''];
  var rows=[['포지션',I[0]+(I[1]?' · '+I[1]:'')],['체격',I[2]],['생일',I[3]?I[3]+' ('+cardAge(I[3])+'세)':'']].filter(function(r){return r[1]});
  var season=I[4]?I[4].split(' · ').map(function(x){return '<p>'+cardEsc(x)+'</p>'}).join(''):'<p class="msg">'+cardEsc((typeof NO_RECORD_MSG!=='undefined'&&NO_RECORD_MSG[p.no])||'올해는 퓨처스에서 준비했어요')+'</p>';
  return '<div class="pc-front t-'+p.tier+'"><div class="pc-rear">'+head+'<dl>'+rows.map(function(r){return '<dt>'+r[0]+'</dt><dd>'+cardEsc(r[1])+'</dd>'}).join('')+'</dl><div class="season"><small>2026 시즌</small>'+season+'</div></div></div>';
}
/* 카드 크게 보기: 앞면으로 떴다가 뒤집혀 선수 정보. 카드를 누르면 다시 뒤집고, 바깥을 누르면 닫혀요 */
function cardView(p){
  var v=document.getElementById('cardView');
  if(!v){v=document.createElement('div');v.id='cardView';v.className='pc-view';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');v.setAttribute('aria-label','카드 크게 보기');
    v.innerHTML='<div class="pc-big" tabindex="0"></div><p class="pc-hint">카드를 누르면 뒤집혀요 · 바깥을 누르면 닫혀요</p>';document.body.appendChild(v);
    var big=v.querySelector('.pc-big');
    big.onclick=function(e){e.stopPropagation();big.classList.toggle('flipped')};
    big.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();big.classList.toggle('flipped')}if(e.key==='Escape')v.classList.remove('show')};
    v.onclick=function(){v.classList.remove('show')};}
  var b=v.querySelector('.pc-big');b.classList.remove('flipped');
  b.innerHTML='<div class="inner"><div class="side a">'+cardFace(p,'both')+'</div><div class="side b">'+cardRear(p)+'</div></div>';
  v.classList.add('show');b.focus();
  setTimeout(function(){b.classList.add('flipped')},260);
}
