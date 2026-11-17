/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/ui: 화면 글씨·칩·크게 보기 =================
   · 왼쪽 위 '지금 어디인지'(구역·가까운 짤 코드), 오른쪽 위 나가기(로비로)
   · 아래 점프 칩(최광야구 · 입구 · 열린 구역)과 ‹ › 걷기 버튼
   · 짤을 누르면 크게 보기(제목·코드·저장). 오늘의 포토를 누르면 '걸린 자리로 가기'도 떠요 */
var _mhChips={},_mhLastLoc='',_mhToastT,_mhHintGone=false,_mhCur=null,_mhFromToday=false;
function mhBuildChips(){
  var H=MH.HALL,L=MH.LAY,places=[['K','최광야구',H.kStart],['H','입구',0]].concat(MH.OPEN.map(function(z){return[z,z,L.zoneStart[z]+3.6]}));
  places.forEach(function(p){var b=document.createElement('button');b.className='chip';b.textContent=p[1];
    b.setAttribute('aria-label',p[0]==='H'?'입구 홀로 가기':p[0]==='K'?'최광야구로 가기':p[1]+'존으로 가기');
    b.addEventListener('click',function(){mhSkipIntro();mhJumpTo(p[2])});$('chips').appendChild(b);_mhChips[p[0]]=b});
}
function mhUpdateLoc(items){
  var s=mhToSR(MH.player.root.position.x,MH.player.root.position.z).s,k=mhPlaceAt(s),txt;
  if(k==='H')txt=Math.abs(s)<3?'Photo of Today':'입구 홀';
  else{var near=null,bd=2.2;items.forEach(function(it){if(!it.empty&&it.zone===k){var d=Math.abs(it.s-s);if(d<bd){bd=d;near=it}}});txt=(k==='K'?'최광야구':k+'존')+(near?'  '+near.code:'')}
  if(txt!==_mhLastLoc){$('loc').textContent=txt;_mhLastLoc=txt}
  for(var key in _mhChips)_mhChips[key].classList.toggle('on',key===k);
}
function mhToast(m){var t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(_mhToastT);_mhToastT=setTimeout(function(){t.classList.remove('show')},2000)}
function mhHideHint(){if(_mhHintGone)return;_mhHintGone=true;$('hint').style.opacity=0}

/* ----- 크게 보기 + 저장 ----- */
function mhOpenViewer(it,fromToday){
  _mhCur=it;_mhFromToday=!!fromToday;
  var pic=$('vpic');pic.src=it.url;pic.alt=it.title;
  $('vt').textContent=it.title;$('vm').textContent=it.code+(it.year&&it.year!=='-'?'   '+it.year:'');$('vc').textContent=it.comment||'';$('vc').hidden=!it.comment;
  $('vgo').hidden=!(fromToday);$('vsave').hidden=false;
  $('viewer').hidden=false;$('vx').focus();
}
function mhCloseViewer(){$('viewer').hidden=true;_mhCur=null;canvas.focus({preventScroll:true})}
function mhBindViewer(){
  $('vx').addEventListener('click',mhCloseViewer);
  $('viewer').addEventListener('click',function(e){if(e.target===$('viewer'))mhCloseViewer()});
  $('vgo').addEventListener('click',function(){var it=_mhCur;mhCloseViewer();if(it)mhJumpTo(it.s)});
  /* 저장: 사진 파일을 받아서 내려받기 링크로 저장 (같은 사이트의 사진이라 바로 받아져요) */
  $('vsave').addEventListener('click',function(){
    if(!_mhCur)return;var it=_mhCur;
    fetch(it.url).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){
      var a=document.createElement('a'),u=URL.createObjectURL(b);a.href=u;a.download='munhak-'+it.code+'.jpg';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);mhToast('사진을 저장했어요');
    }).catch(function(){mhToast('지금은 저장할 수 없어요')});
  });
  $('exit').addEventListener('click',function(){location.href='index.html'});
}
