/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 포토존 화면 버튼 =================
   '내 위치' 시트의 둘러보기 목록(#tourList), 포토존 화면(#pz): 돌아가기, 세트별 도구, 포즈, 비키기, 찍기.
   플레이어존 도구: 사진 넣기(이 기기에 줄여서 저장) / 문구(#mPzLine) / 기본으로
   홈런기념판 도구: ▼ 숫자 ▲(길게 누르면 빨라짐) / 538로 */
(function tourList(){
  var el=$('tourList');
  ['hr','pz'].forEach(function(k){
    var b=document.createElement('button');b.className='zone zrow';
    var t=document.createElement('div');t.innerHTML='<b></b><span></span>';t.querySelector('b').textContent=PZ_CFG[k].label;t.querySelector('span').textContent=PZ_CFG[k].desc;b.appendChild(t);
    var c=document.createElement('span');c.className='cnt';c.textContent='포토존';b.appendChild(c);
    b.onclick=function(){closeModal('mZone');auEnsure();sfx('tap');pzStart(k)};el.appendChild(b);
  });
})();

function pzBtn(label,fn,cls){var b=document.createElement('button');b.className='pill'+(cls?' '+cls:'');b.textContent=label;if(fn)b.onclick=fn;return b}
function pzUIOpen(k){
  $('pzTitle').textContent=PZ_CFG[k].label;
  var tools=$('pzTools');tools.innerHTML='';
  if(k==='pz'){
    tools.appendChild(pzBtn('사진 넣기',function(){$('pzFile').click()}));
    tools.appendChild(pzBtn('문구',function(){var i=$('pzLineIn');i.value=PZP.line==null?PZ_CFG.pz.line:PZP.line;openModal('mPzLine');i.select()}));
    tools.appendChild(pzBtn('기본으로',function(){pzSetPhoto(null);pzSetLine(null);try{localStorage.removeItem('munhak:pzLine')}catch(e){}toast('기본 그림으로 돌아왔어요')}));
  }else{
    var dn=pzBtn('',null,'pz-step'),up=pzBtn('',null,'pz-step'),n=document.createElement('output');
    dn.innerHTML='<svg class="i" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';dn.setAttribute('aria-label','홈런 수 내리기');
    up.innerHTML='<svg class="i" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>';up.setAttribute('aria-label','홈런 수 올리기');
    n.id='pzCount';n.className='pz-count';n.setAttribute('aria-live','polite');
    pzHold(dn,-1);pzHold(up,1);
    var grp=document.createElement('div');grp.className='cap pz-num';grp.appendChild(dn);grp.appendChild(n);grp.appendChild(up);tools.appendChild(grp);
    tools.appendChild(pzBtn(PZ_CFG.hr.base+'로',function(){hrSetCount(PZ_CFG.hr.base);pzUISync()}));
  }
  var ps=$('pzPoses');ps.innerHTML='';
  PZ_CFG.poses.forEach(function(p){var b=document.createElement('button');b.textContent=p[1];b.dataset.pose=p[0];b.onclick=function(){sfx('tap');pzPose(p[0])};ps.appendChild(b)});
  $('pz').hidden=false;pzUISync();
}
function pzUIClose(){$('pz').hidden=true}
function pzUISync(){
  if($('pz').hidden&&!PZ.on)return;
  $('pzPoses').querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pose===PZ.pose)});
  $('pzHide').textContent=PZ.hidden?'다시 서기':'비키기';$('pzHide').setAttribute('aria-pressed',PZ.hidden);
  var c=$('pzCount');if(c)c.textContent=HRB.n;
}
/* 길게 누르면 점점 빠르게 */
function pzHold(b,dir){
  var tm=null,t0=0;
  function step(){if(hrSetCount(HRB.n+dir))pzUISync();else stop()}
  function loop(){var held=performance.now()-t0;step();tm=setTimeout(loop,held>1600?40:held>700?80:140)}
  function stop(){clearTimeout(tm);tm=null}
  b.addEventListener('pointerdown',function(e){e.preventDefault();auEnsure();sfx('tap');t0=performance.now();step();tm=setTimeout(loop,380)});
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){b.addEventListener(ev,stop)});
  b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();step()}});
}

$('pzBack').onclick=function(){sfx('tap');pzStop()};
$('pzHide').onclick=function(){sfx('tap');pzHide(!PZ.hidden)};
$('pzShot').onclick=function(){takePhoto(PZ.key==='hr'?'homerun':'playerzone')};
/* 사진 넣기: 긴 쪽 1400px로 줄여 jpg로 저장 */
$('pzFile').onchange=function(){
  var f=this.files&&this.files[0];this.value='';if(!f)return;
  var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
    var s=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);var url=c.toDataURL('image/jpeg',.85);
    store.set('pzPhoto',url);pzSetPhoto(url);
    toast(store.get('pzPhoto',null)?'사진을 넣었어요':'사진을 넣었어요 (이 기기에 저장은 못 했어요)',2600);
  };im.onerror=function(){toast('이 사진은 열 수 없어요')};im.src=r.result};r.readAsDataURL(f);
};
$('pzLineSave').onclick=function(){pzSetLine($('pzLineIn').value.trim());closeModal('mPzLine')};
$('pzLineIn').addEventListener('keydown',function(e){if(e.key==='Enter')$('pzLineSave').click()});
