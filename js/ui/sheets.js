/* modals */
var lastFocus=null;
function openModal(id){lastFocus=document.activeElement;var m=$(id);m.hidden=false;var f=m.querySelector('button,input');if(f)f.focus()}
function closeModal(id){$(id).hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.querySelectorAll('.modal').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m||e.target.closest('[data-close]'))closeModal(m.id)})});
/* settings */
[['vAmb','oAmb','amb'],['vBeat','oBeat','beat'],['vSfx','oSfx','sfx']].forEach(function(a){var i=$(a[0]),o=$(a[1]);i.value=AU.vol[a[2]];o.textContent=AU.vol[a[2]];i.addEventListener('input',function(){AU.vol[a[2]]=+i.value;o.textContent=i.value;store.set('vol',AU.vol);applyVol()})});
$('pickFile').onclick=function(){$('fileIn').click()};
$('fileIn').addEventListener('change',function(){
  var f=this.files&&this.files[0];if(!f)return;auEnsure();
  var wasOn=AU.beatOn;if(wasOn)beatStop();
  if(AU.el){AU.el.pause();URL.revokeObjectURL(AU.el.src)}
  if(!AU.el){AU.el=new Audio();AU.el.loop=true;AU.el.crossOrigin='anonymous';try{AU.src=AU.ctx.createMediaElementSource(AU.el);AU.src.connect(AU.beat)}catch(e){}}
  AU.el.src=URL.createObjectURL(f);AU.file=f.name;
  $('fileName').textContent='지금 응원가: '+f.name;$('clearFile').hidden=false;$('pickFile').textContent='다른 파일 고르기';
  toast('응원하기를 누르면 고른 음원이 나와요');
  if(wasOn&&player.act==='cheer')beatStart();
});
$('clearFile').onclick=function(){var wasOn=AU.beatOn;if(wasOn)beatStop();if(AU.el){AU.el.pause();URL.revokeObjectURL(AU.el.src);AU.el.removeAttribute('src')}AU.file=null;$('fileName').textContent='지금은 기본 비트예요.';this.hidden=true;$('pickFile').textContent='음원 파일 고르기';if(wasOn&&player.act==='cheer')beatStart()};
if(!matchMedia('(pointer:coarse)').matches)$('howto').textContent='바닥을 클릭하면 걷고, 의자를 클릭하면 가서 앉아요. WASD나 방향키로도 걸어요. 드래그로 둘러보고 휠로 확대·축소해요. 1·2·3으로 행동을 바로 할 수 있어요.';
