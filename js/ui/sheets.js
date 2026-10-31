/* modals */
var lastFocus=null;
function openModal(id){lastFocus=document.activeElement;var m=$(id);m.hidden=false;var f=m.querySelector('button,input');if(f)f.focus()}
function closeModal(id){$(id).hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.querySelectorAll('.modal').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m||e.target.closest('[data-close]'))closeModal(m.id)})});
/* settings */
[['vAmb','oAmb','amb'],['vBeat','oBeat','beat'],['vSfx','oSfx','sfx']].forEach(function(a){var i=$(a[0]),o=$(a[1]);i.value=AU.vol[a[2]];o.textContent=AU.vol[a[2]];i.addEventListener('input',function(){AU.vol[a[2]]=+i.value;o.textContent=i.value;store.set('vol',AU.vol);applyVol()})});
