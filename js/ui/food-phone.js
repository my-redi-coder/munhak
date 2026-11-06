/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 야푸먹기: 테이블 위 핸드폰 잠금화면 (작은 패치 B3, 2026-11-01) =================
   테이블 위 핸드폰을 누르면 손에 든 것처럼 아래에서 쓱 올라와요. 잠금화면 = 해 질 녘 문학 조명탑 배경화면
   + 큰 시계 + 개막 D-day 위젯 + 알림 2장(잉스타그램, 너튜브). 알림을 누르면 새 탭으로 열려요.
   닫기: 바깥 누르기 · × · 아래 홈 바 · 핸드폰을 아래로 쓸어내리기 · Esc
   글·링크·개막일을 고칠 땐 PHONE_CFG만. 모양은 styles/food-phone.css
   food.js와 연결: fdTable()이 phoneSvg()를 그리고, openFood가 phoneBind(), closeFood·foodEsc가 phoneClose()를 불러요. */
var PHONE_CFG={
  opening:[2027,3,27],          /* 다음 시즌 개막일 (년, 월, 일) — 시즌이 바뀌면 여기만 */
  openLabel:'3.27 (토)',
  season:'2027',
  carrier:'문학 5G',
  apps:[
    {id:'insta',name:'잉스타그램',time:'방금',body:'ssglanders.incheon님이 새 게시물을 올렸어요 📸',url:'https://www.instagram.com/ssglanders.incheon/'},
    {id:'tube',name:'너튜브',time:'12분 전',body:'SSG LANDERS 채널에 새 영상이 올라왔어요',url:'https://www.youtube.com/@SSGLANDERS'}
  ]
};
var PHONE={on:false,built:false,t:0,drag:null};
var PH_DAYS=['일','월','화','수','목','금','토'];
/* 앱 아이콘 (오리지널: 빨강·주황 카메라 / 빨강 재생 버튼) */
var PH_ICON={
  insta:'<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="phIg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c8102e"/><stop offset="1" stop-color="#f39a2b"/></linearGradient></defs><rect width="40" height="40" rx="10" fill="url(#phIg)"/><rect x="9" y="9" width="22" height="22" rx="7" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="20" cy="20" r="5.4" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="26.6" cy="13.4" r="1.6" fill="#fff"/></svg>',
  tube:'<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#d81f36"/><rect x="7" y="11" width="26" height="18" rx="6" fill="#fff"/><path d="M17.5 15.5v9l8-4.5z" fill="#d81f36"/></svg>'
};
/* 배경화면: 해 질 녘 하늘 + 조명탑 실루엣 + 번지는 불빛 (360×780) */
function phWall(){
  var bok=[[48,330,26,'#ffd9a0',.32],[300,300,34,'#ffb98a',.26],[120,470,18,'#fff1c9',.4],[250,430,22,'#ffcf9a',.34],[180,380,12,'#ffe8c0',.45],[330,520,16,'#ffd2a6',.3],[20,520,20,'#ffcfa0',.28],[210,500,9,'#fff4dc',.55],[90,410,10,'#ffe4b8',.4]];
  var b=bok.map(function(c){return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="'+c[3]+'" opacity="'+c[4]+'"/>'}).join('');
  function tower(x,top,s){
    var h='',r,c;for(r=0;r<3;r++)for(c=0;c<5;c++)h+='<rect x="'+(x-19*s+c*8*s+1.5*s)+'" y="'+(top+r*6.5*s+2*s)+'" width="'+5*s+'" height="'+4*s+'" rx="1" fill="#fff6dc"/>';
    return '<circle cx="'+x+'" cy="'+(top+10*s)+'" r="'+46*s+'" fill="url(#phGlow)"/>'
      +'<path d="M'+(x-2.5*s)+' '+(top+20*s)+'L'+(x-5*s)+' 640L'+(x+5*s)+' 640L'+(x+2.5*s)+' '+(top+20*s)+'Z" fill="#251c38"/>'
      +'<rect x="'+(x-20*s)+'" y="'+top+'" width="'+40*s+'" height="'+21*s+'" rx="2" fill="#2c2142"/>'+h;
  }
  return '<svg class="ph-wall" viewBox="0 0 360 780" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'
   +'<linearGradient id="phSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2150"/><stop offset=".28" stop-color="#3f3874"/><stop offset=".5" stop-color="#9a5584"/><stop offset=".66" stop-color="#ec8766"/><stop offset=".76" stop-color="#f8c383"/><stop offset="1" stop-color="#f8c383"/></linearGradient>'
   +'<radialGradient id="phSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient>'
   +'<radialGradient id="phGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2cf" stop-opacity=".75"/><stop offset=".35" stop-color="#ffd59a" stop-opacity=".28"/><stop offset="1" stop-color="#ffc98a" stop-opacity="0"/></radialGradient>'
   +'<linearGradient id="phShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>'
   +'<filter id="phBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter></defs>'
   +'<rect width="360" height="780" fill="url(#phSky)"/>'
   +'<g fill="#fff" opacity=".7"><circle cx="40" cy="70" r="1.1"/><circle cx="96" cy="128" r=".8"/><circle cx="210" cy="62" r="1"/><circle cx="300" cy="104" r="1.3"/><circle cx="330" cy="40" r=".8"/><circle cx="150" cy="170" r=".7"/><circle cx="262" cy="190" r=".8"/></g>'
   +'<ellipse cx="200" cy="600" rx="210" ry="110" fill="url(#phSun)"/>'
   +tower(62,392,1.15)+tower(300,420,1)
   +'<path d="M-10 610Q60 584 130 590Q180 594 230 586Q300 576 370 600V780H-10Z" fill="#2a2040"/>'
   +'<path d="M-10 640Q90 618 180 624Q270 630 370 616V780H-10Z" fill="#211932"/>'
   +'<g stroke="#3a2e55" stroke-width="1.2" opacity=".8"><path d="M-10 652Q90 632 180 638Q270 644 370 630M-10 668Q90 650 180 655Q270 660 370 648"/></g>'
   +'<g filter="url(#phBlur)">'+b+'</g>'
   +'<rect width="360" height="780" fill="url(#phShade)"/></svg>';
}
/* 테이블 위 작은 핸드폰 (fdTable 안 SVG 조각, 360×400 좌표) */
function phoneSvg(hm){
  var d=phDday();
  return '<defs><linearGradient id="fdPhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a62"/><stop offset=".5" stop-color="#a65a82"/><stop offset=".78" stop-color="#f2a073"/><stop offset="1" stop-color="#3a2a4a"/></linearGradient></defs>'
   +'<g transform="translate(258 28) rotate(-8)"><g id="fdPhone" class="fd-tap fd-buzz" role="button" tabindex="0" aria-label="핸드폰 보기">'
   +'<rect width="48" height="92" rx="8" fill="#1d1e22"/><rect x="3" y="4" width="42" height="84" rx="5" fill="url(#fdPhSky)"/>'
   +'<path d="M3 76q10-3 21-2t21-3V83a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" fill="#2a2040"/><path d="M10 76V60M8 58h5v3h-5z" stroke="#2a2040" stroke-width="1.4" fill="#fff3d6"/>'
   +'<text id="fdClock" x="24" y="17" font-size="9" fill="#fff" text-anchor="middle">'+hm+'</text>'
   +'<rect x="11" y="21" width="26" height="10" rx="3" fill="rgba(20,16,40,.35)"/><text x="24" y="28.6" font-size="6" font-weight="700" fill="#fff" text-anchor="middle">'+d.big+'</text>'
   +'<g><rect x="5" y="36" width="38" height="10" rx="3" fill="rgba(255,255,255,.88)"/><rect x="7" y="38" width="6" height="6" rx="1.6" fill="#e8562e"/><text x="15" y="43" font-size="4.3" fill="#333">잉스타그램</text></g>'
   +'<g><rect x="5" y="48" width="38" height="10" rx="3" fill="rgba(255,255,255,.88)"/><rect x="7" y="50" width="6" height="6" rx="1.6" fill="#d81f36"/><text x="15" y="55" font-size="4.3" fill="#333">너튜브</text></g>'
   +'<rect x="18" y="83" width="12" height="2" rx="1" fill="#fff" opacity=".7"/></g></g>';
}
/* 개막 D-day: 개막 전 'D-146' / 당일 'D-DAY' / 지난 뒤 '시즌 진행 중' */
function phDday(){
  var o=PHONE_CFG.opening,n=new Date(),a=new Date(o[0],o[1]-1,o[2]),b=new Date(n.getFullYear(),n.getMonth(),n.getDate());
  var k=Math.round((a-b)/864e5);
  if(k>0)return{top:PHONE_CFG.season+' 개막까지',big:'D-'+k,sub:PHONE_CFG.openLabel,say:PHONE_CFG.season+' 개막까지 '+k+'일, '+PHONE_CFG.openLabel};
  if(k===0)return{top:'오늘 개막! 🎉',big:'D-DAY',sub:PHONE_CFG.openLabel,say:'오늘 '+PHONE_CFG.season+' 시즌 개막'};
  return{top:PHONE_CFG.season+' 시즌',big:'진행 중',sub:'문학에서 만나요',say:PHONE_CFG.season+' 시즌 진행 중'};
}
function phBuild(){
  if(PHONE.built)return;PHONE.built=true;
  var o=document.createElement('div');o.id='phoneOv';o.className='ph-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','내 핸드폰 잠금화면');
  var notes=PHONE_CFG.apps.map(function(a,i){
    return '<a class="ph-nt" href="'+a.url+'" target="_blank" rel="noopener" style="--i:'+i+'" aria-label="'+a.name+' 알림, '+a.body+' (새 창)">'
      +'<span class="ph-app">'+PH_ICON[a.id]+'</span><span class="ph-nt-tx"><span class="ph-nt-hd"><b>'+a.name+'</b><time>'+a.time+'</time></span><span class="ph-nt-bd">'+a.body+'</span></span></a>';
  }).join('');
  o.innerHTML='<button class="ph-x" id="phX" aria-label="핸드폰 내려놓기">×</button>'
   +'<div class="ph-dev" id="phDev"><div class="ph-scr">'+phWall()
   +'<i class="ph-island" aria-hidden="true"></i>'
   +'<div class="ph-bar" aria-hidden="true"><span>'+PHONE_CFG.carrier+'</span><span class="ph-ic">'
     +'<svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>'
     +'<svg viewBox="0 0 16 12"><path d="M8 11.5l2.6-3a3.6 3.6 0 0 0-5.2 0zM3.6 6.6a6.3 6.3 0 0 1 8.8 0l1.6-1.8a8.8 8.8 0 0 0-12 0zM.4 3a11 11 0 0 1 15.2 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
     +'<svg viewBox="0 0 27 12"><rect x=".7" y=".7" width="22" height="10.6" rx="3" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/><rect x="2.4" y="2.4" width="15" height="7.2" rx="1.6"/><path d="M24.4 4.2v3.6a1.8 1.8 0 0 0 0-3.6z" opacity=".5"/></svg>'
   +'</span></div>'
   +'<div class="ph-head"><svg class="ph-lock" viewBox="0 0 14 18" aria-hidden="true"><rect x="1" y="7.5" width="12" height="9.5" rx="2.4" fill="currentColor"/><path d="M3.8 7.5V5.2a3.2 3.2 0 0 1 6.4 0v2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
     +'<p class="ph-date" id="phDate"></p><p class="ph-clock" id="phClock"></p></div>'
   +'<div class="ph-dday" id="phDday" role="img"><span class="ph-dd-top"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#fff"/><path d="M4.2 2.6q2.4 5.4 0 10.8M11.8 2.6q-2.4 5.4 0 10.8" fill="none" stroke="#d81f36" stroke-width="1.2" stroke-dasharray="1.6 1.2"/></svg><span id="phDdTop"></span></span><b class="ph-dd-big" id="phDdBig"></b><span class="ph-dd-sub" id="phDdSub"></span></div>'
   +'<div class="ph-notes">'+notes+'</div>'
   +'<div class="ph-foot" aria-hidden="true"><span class="ph-round"><svg viewBox="0 0 24 24"><path d="M8 2h8v4l-2 4v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10L8 6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 13v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>'
     +'<span class="ph-round"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></div>'
   +'<button class="ph-home" id="phHome" aria-label="핸드폰 내려놓기"></button>'
   +'</div></div>';
  $('food').appendChild(o);
  $('phX').onclick=phoneClose;$('phHome').onclick=phoneClose;
  o.addEventListener('click',function(e){if(e.target===o)phoneClose()});
  /* 아래로 쓸어내리면 내려놓기 (알림 위에서 시작하면 그냥 누르기) */
  var dev=$('phDev');
  dev.addEventListener('pointerdown',function(e){if(e.target.closest('a,button'))return;PHONE.drag={y:e.clientY,dy:0,id:e.pointerId};dev.setPointerCapture(e.pointerId);dev.classList.add('drag')});
  dev.addEventListener('pointermove',function(e){var d=PHONE.drag;if(!d||d.id!==e.pointerId)return;d.dy=Math.max(0,e.clientY-d.y);dev.style.transform='translateY('+d.dy+'px) rotate('+(d.dy*.02)+'deg)'});
  function up(e){var d=PHONE.drag;if(!d||d.id!==e.pointerId)return;PHONE.drag=null;dev.classList.remove('drag');dev.style.transform='';if(d.dy>90)phoneClose()}
  dev.addEventListener('pointerup',up);dev.addEventListener('pointercancel',up);
}
function phTime(){
  var n=new Date(),d=phDday();
  $('phClock').textContent=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);
  $('phDate').textContent=(n.getMonth()+1)+'월 '+n.getDate()+'일 '+PH_DAYS[n.getDay()]+'요일';
  $('phDdTop').textContent=d.top;$('phDdBig').textContent=d.big;$('phDdSub').textContent=d.sub;$('phDday').setAttribute('aria-label',d.say);
  var c=$('fdClock');if(c)c.textContent=$('phClock').textContent;
}
/* 알림 도착 소리: 알림 두 장이 내려올 때 '띵' 두 번 (효과음 채널) */
function phChime(){
  if(!AU.ctx||!AU.on||AU.ctx.state!=='running')return;var t=AU.ctx.currentTime;
  [.5,.85].forEach(function(s){fdTone(t+s,1318,1318,.09,.07);fdTone(t+s+.09,1760,1760,.16,.05)});
}
function phoneOpen(){
  if(PHONE.on)return;phBuild();phTime();var o=$('phoneOv');
  PHONE.on=true;o.classList.add('on');phChime();
  clearInterval(PHONE.t);PHONE.t=setInterval(phTime,10000);
  setTimeout(function(){if(PHONE.on){var a=o.querySelector('.ph-nt');if(a)a.focus({preventScroll:true})}},80);
}
function phoneClose(){
  if(!PHONE.on)return;PHONE.on=false;clearInterval(PHONE.t);var o=$('phoneOv');o.classList.remove('on');
  var n=$('fdPhone');if(n)n.focus();
}
function phoneBind(){var n=$('fdPhone');if(n)fdBind(n,phoneOpen)}
