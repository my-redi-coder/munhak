/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 내 위치 펼침 메뉴 (묶음 A, 2026-11-01) =================
   위쪽 '내 위치' 버튼(#bZone, 지금 구역 이름) 바로 아래로 펼쳐지는 메뉴(#placeMenu). 예전 '내 위치' 시트(관중 수 표시)를 대신해요.
   - 관중석: ZKEYS 순서(으쓱이존·내야·외야·하룰라라석) → goZone. 지금 있는 구역은 빨갛게(aria-current).
   - 둘러보기: config.js의 TOURS 순서 → TOUR_GO에 적힌 함수(포토존 pzStart · 경기장 구경 ssStart).
   새 둘러보기 = TOURS에 이름 + TOUR_CFG(또는 PZ_CFG)에 label + 아래 TOUR_GO·PLACE_ICO에 한 줄씩.
   메뉴 밖을 누르거나 Esc면 닫혀요. */
var PLACE_ICO={
  seat:'<path d="M6 10V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><path d="M4 10h16v5H4zM6 15v5M18 15v5"/>',
  hr:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  pz:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="8.5" r="1.5"/>',
  look:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
var TOUR_GO={hr:function(){pzStart('hr')},pz:function(){pzStart('pz')},look:function(){ssStart()}};
function placeItem(ico,label,cur,fn){
  var b=document.createElement('button');b.className='pitem';b.setAttribute('role','menuitem');
  if(cur)b.setAttribute('aria-current','true');
  b.innerHTML='<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+PLACE_ICO[ico]+'</svg><span></span>';
  b.querySelector('span').textContent=label;
  b.onclick=function(){placeMenu(false);auEnsure();sfx('tap');fn()};
  return b;
}
function placeGroup(m,title){var h=document.createElement('h4');h.textContent=title;m.appendChild(h)}
function placeMenuBuild(){
  var m=$('placeMenu');m.innerHTML='';
  placeGroup(m,'관중석');
  ZKEYS.forEach(function(k){var here=curBlock&&curBlock.key===k;
    m.appendChild(placeItem('seat',ZONES[k].label,here,function(){if(!here)goZone(k,true)}))});
  m.appendChild(document.createElement('hr'));
  placeGroup(m,'둘러보기');
  TOURS.forEach(function(k){var c=PZ_CFG[k]||TOUR_CFG[k];if(c&&TOUR_GO[k])m.appendChild(placeItem(k,c.label,false,TOUR_GO[k]))});
}
function placeMenu(open){
  var m=$('placeMenu'),b=$('bZone'),on=open==null?m.hidden:open;
  if(on&&(phase!=='game'||EV.on))return;
  if(on)placeMenuBuild();
  m.hidden=!on;b.setAttribute('aria-expanded',on?'true':'false');
  if(on){var f=m.querySelector('[aria-current]')||m.querySelector('.pitem');if(f)f.focus({preventScroll:true})}
}
$('bZone').onclick=function(e){e.stopPropagation();auEnsure();placeMenu()};
document.addEventListener('pointerdown',function(e){
  if($('placeMenu').hidden)return;
  if(!e.target.closest('#placeMenu')&&!e.target.closest('#bZone'))placeMenu(false);
},true);
document.addEventListener('keydown',function(e){
  if($('placeMenu').hidden)return;
  if(e.key==='Escape'){placeMenu(false);$('bZone').focus();e.stopPropagation()}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){/* 메뉴가 열려 있으면 화살표는 메뉴 안에서만 (으쓱이는 안 걸어요) */
    var it=[].slice.call($('placeMenu').querySelectorAll('.pitem')),i=it.indexOf(document.activeElement);
    i=(i+(e.key==='ArrowDown'?1:-1)+it.length)%it.length;it[i].focus();e.preventDefault();e.stopPropagation();
  }
},true);
