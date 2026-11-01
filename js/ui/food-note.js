/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 야푸먹기 이스터에그: 으쓱이의 스페인어 수첩 (묶음 B, 2026-11-01) =================
   테이블 위 남색 수첩(귀퉁이 33)을 누르면 위로 넘기는 메모장이 펼쳐져요. 안내 문구는 일부러 없음.
   1장 <암기장> + 수염 난 투수 ♥ SSG 낙서 / 2장 체크된 두 문장 + COMPLETE 도장(Oct 16, 2026 · max 2 years) / 3장 빈 체크박스 세 문장.
   한글 뜻은 보여주지 않아요. 글을 고칠 땐 NOTE_PAGES만. 모양은 styles/food-note.css
   food.js와 연결: fdTable()이 noteSvg()를 그리고, openFood가 noteBind(), closeFood·foodEsc가 noteClose()를 불러요. */
var NOTE={on:false,page:0,built:false,fonts:false};
var NOTE_PAGES=[
  {cover:true},
  {done:true,lines:[['노 떼 바야스!','No te vayas'],['께다떼 꼰 노소뜨로스!','Quédate con nosotros']]},
  {lines:[['꼰띠고 빠라 시엠쁘레!','Contigo para siempre'],['가네모스 엘 쁘록시모 아뇨','Ganemos el próximo año'],['떼 아모~<span class="nt-heart">♥</span>','Te amo']]}
];
var NOTE_DOODLE='<svg class="nt-doodle" viewBox="0 0 300 150" aria-label="수염 난 투수와 SSG 사이에 하트 낙서" role="img"><g fill="none" stroke="#22407a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M44 38q4-20 26-21q20 0 25 18" fill="#c8102e" stroke="#22407a"/><path d="M93 34q14-1 22 5"/><path d="M46 38q-6 22 10 32q16 8 30-2q12-10 8-30"/><path d="M58 46l6 3M80 49l7-4"/><circle cx="62" cy="54" r="2.4" fill="#22407a"/><circle cx="82" cy="54" r="2.4" fill="#22407a"/><path d="M61 63q11 10 22 0q-11 4-22 0" fill="#fff"/><path d="M60 60q5-5 12-1q7-4 12 1q-4 3-12 0q-8 3-12 0z" fill="#22407a" stroke-width="1.6"/><path d="M66 72q6 5 12 0M68 74v3M72 75v3M76 74v3" stroke-width="1.6"/><path d="M50 60l-1 3M52 65l-1 3M93 59l1 3M91 64l1 3" stroke-width="1.4"/><path d="M100 30l4-5M104 38l6-2" stroke-width="1.8"/><path d="M54 72q-8 22-4 40h44q4-20-6-40"/><path d="M88 76q16-10 22-30"/><circle cx="112" cy="40" r="6" fill="#fff"/><path d="M109 37q3 3 0 7M115 37q-3 3 0 7" stroke="#c8102e" stroke-width="1.2"/><path d="M56 78q-16 4-28 -6"/><path d="M28 72q-8-2-10-8q8-4 12 2" fill="#c99b68"/><path d="M62 112q-4 16-8 28h-8"/><path d="M84 112q16-4 30-18l6 4"/></g><path d="M150 64q-14-20-28-8q-10 12 4 26q12 12 24 22q12-10 24-22q14-14 4-26q-14-12-28 8z" fill="#ef6f7c" stroke="#c8102e" stroke-width="2.6" stroke-linejoin="round" transform="rotate(-6 150 80)"/><path d="M128 52q-6-8-2-14M174 48q6-8 2-14M150 116v10" fill="none" stroke="#c8102e" stroke-width="2" stroke-linecap="round"/><text x="236" y="96" text-anchor="middle" font-family="Nanum Pen Script, cursive" font-size="60" fill="#c8102e" transform="rotate(5 236 80)">SSG</text><path d="M200 108q18 6 36 0t36 2" fill="none" stroke="#c8102e" stroke-width="2.4" stroke-linecap="round"/></svg>';
var NOTE_STAMP='<svg class="nt-stamp" viewBox="0 0 150 92" aria-label="COMPLETE 도장, Oct 16, 2026, max 2 years" role="img"><defs><mask id="ntInk"><rect width="150" height="92" fill="#fff"/><g fill="#000"><circle cx="20" cy="30" r="2"/><circle cx="104" cy="16" r="1.5"/><circle cx="128" cy="58" r="2.4"/><circle cx="48" cy="72" r="1.7"/><circle cx="80" cy="44" r="1.3"/><circle cx="36" cy="50" r="1.1"/><path d="M96 78q10-2 18-8" stroke="#000" stroke-width="2" fill="none"/><circle cx="66" cy="20" r="1"/><circle cx="140" cy="30" r="1.2"/></g></mask></defs><g mask="url(#ntInk)" fill="#d8263c" stroke="none"><rect x="3" y="3" width="144" height="86" rx="6" fill="none" stroke="#d8263c" stroke-width="4.5"/><rect x="10" y="10" width="130" height="72" rx="3" fill="none" stroke="#d8263c" stroke-width="1.4"/><text x="75" y="47" text-anchor="middle" font-family="Black Han Sans, sans-serif" font-size="27" letter-spacing="1.5">COMPLETE</text><path d="M22 55H128" stroke="#d8263c" stroke-width="1.4"/><text x="75" y="69" text-anchor="middle" font-family="Gowun Dodum, sans-serif" font-size="11.5" letter-spacing=".6">Oct 16, 2026</text><text x="75" y="79" text-anchor="middle" font-family="Gowun Dodum, sans-serif" font-size="8.5" letter-spacing=".6">max 2 years</text></g></svg>';
/* 테이블 위 수첩 (fdTable 안 SVG 조각, 360×400 좌표) */
function noteSvg(){
  return '<g id="fdNote" class="fd-tap" role="button" tabindex="0" aria-label="수첩" transform="translate(186 122) rotate(-9)">'
   +'<rect x="3" y="4" width="40" height="54" rx="3" fill="#fffdf6"/><rect x="0" y="2" width="40" height="54" rx="3" fill="#1f3f78"/>'
   +'<path d="M7 0v6M15 0v6M23 0v6M31 0v6" stroke="#a9a9a3" stroke-width="1.6" fill="none"/><rect x="4" y="36" width="32" height="1.6" fill="#c8102e" opacity=".8"/>'
   +'<text x="30" y="50" text-anchor="middle" font-family="Nanum Pen Script, cursive" font-size="13" fill="#fff" transform="rotate(-8 30 46)">33</text></g>';
}
function noteFonts(){if(NOTE.fonts)return;NOTE.fonts=true;var l=document.createElement('link');l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nanum+Pen+Script&display=swap';document.head.appendChild(l)}
function noteLine(t,checked){
  return '<div class="nt-ln"><svg class="nt-box" viewBox="0 0 28 28" aria-hidden="true"><path class="sq" d="M3 4.5L25 3.5L24.5 25L4 24.5Z"/>'
   +(checked?'<path class="ck" pathLength="1" d="M6 14L12 21L27 1"/>':'')+'</svg><div class="nt-tx"><p class="nt-say">'+t[0]+'</p><p class="nt-es" lang="es">'+t[1]+'</p></div></div>';
}
function noteBuild(){
  if(NOTE.built)return;NOTE.built=true;
  var o=document.createElement('div');o.id='noteOv';o.className='nt-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','으쓱이의 스페인어 수첩');
  var pages='';
  for(var i=NOTE_PAGES.length-1;i>=0;i--){var P=NOTE_PAGES[i],inner;
    if(P.cover)inner='<div class="nt-in nt-mid">'+NOTE_DOODLE+'<p class="nt-title">&lt;암기장&gt;</p></div>';
    else inner='<div class="nt-in nt-list'+(P.lines.length>2?' nt-three':'')+'">'+P.lines.map(function(t){return noteLine(t,P.done)}).join('')+'</div>'+(P.done?NOTE_STAMP:'');
    pages+='<section class="nt-page" data-p="'+i+'" aria-label="'+(i+1)+'장">'+inner+'<span class="nt-no">'+(i+1)+'</span></section>';
  }
  o.innerHTML='<button class="nt-x" id="ntX" aria-label="수첩 닫기">×</button><div class="nt-book" id="ntBook"><div class="nt-back"></div><div class="nt-rings"><i></i><i></i><i></i><i></i><i></i><i></i></div>'+pages+'</div>'
   +'<div class="nt-foot"><button class="nt-btn" id="ntPrev">이전 장</button><div class="nt-dots" aria-hidden="true"><b></b><b></b><b></b></div><button class="nt-btn main" id="ntNext">넘기기</button></div>';
  $('food').appendChild(o);
  $('ntX').onclick=noteClose;$('ntNext').onclick=function(){noteGo(1)};$('ntPrev').onclick=function(){noteGo(-1)};
  o.addEventListener('click',function(e){if(e.target===o)noteClose()});
  o.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowUp')noteGo(1);if(e.key==='ArrowLeft'||e.key==='ArrowDown')noteGo(-1)});
  var sx=0,sy=0,bk=$('ntBook');
  bk.addEventListener('pointerdown',function(e){sx=e.clientX;sy=e.clientY});
  bk.addEventListener('pointerup',function(e){var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<40)return;noteGo(dy<-40||dx<-40?1:-1)});
}
function notePaint(){
  var ps=[].slice.call(document.querySelectorAll('#noteOv .nt-page')).sort(function(a,b){return a.dataset.p-b.dataset.p});
  ps.forEach(function(p,i){p.classList.toggle('gone',i<NOTE.page);p.setAttribute('aria-hidden',i!==NOTE.page);p.classList.toggle('now',i===NOTE.page&&NOTE.on)});
  [].forEach.call(document.querySelectorAll('#noteOv .nt-dots b'),function(d,i){d.classList.toggle('on',i===NOTE.page)});
  $('ntPrev').disabled=NOTE.page===0;$('ntNext').textContent=NOTE.page===NOTE_PAGES.length-1?'덮기':'넘기기';
}
function noteGo(d){var n=NOTE.page+d;if(n<0)return;if(n>=NOTE_PAGES.length){noteClose();return}NOTE.page=n;fdSnd('rustle');notePaint()}
function noteOpen(){if(NOTE.on)return;noteFonts();noteBuild();NOTE.on=true;NOTE.page=0;var o=$('noteOv');o.classList.add('on');notePaint();fdSnd('rustle');$('ntNext').focus()}
function noteClose(){if(!NOTE.on)return;NOTE.on=false;var o=$('noteOv');o.classList.remove('on');notePaint();var n=$('fdNote');if(n)n.focus()}
function noteBind(){var n=$('fdNote');if(n)fdBind(n,noteOpen)}
