/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 사진 찍기 =================
   takePhoto(이름): 지금 3D 화면을 한 장 그려 jpg로 만들고, 반짝 효과 뒤 미리보기 시트(#mPhoto)를 띄워요.
   저장은 내려받기 링크, 휴대폰에서 공유가 되면 '공유' 버튼도 보여요. 화면 버튼(HUD)은 사진에 들어가지 않아요.
   포토존 '찍기'와 위쪽 '직관 사진' 버튼(game/actions.js)이 같이 써요. */
var PHOTO={url:null,name:'munhak'};
function photoStamp(){var d=new Date(),p=function(n){return ('0'+n).slice(-2)};return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds())}
function takePhoto(tag){
  renderer.render(scene,camera);
  try{PHOTO.url=canvas.toDataURL('image/jpeg',.92)}catch(e){toast('사진을 만들지 못했어요');return}
  PHOTO.name='munhak-'+(tag||'photo')+'-'+photoStamp()+'.jpg';
  var f=$('flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');sfx('tap');
  setTimeout(function(){$('photoImg').src=PHOTO.url;var a=$('photoSave');a.href=PHOTO.url;a.download=PHOTO.name;
    $('photoShare').hidden=!(navigator.share&&navigator.canShare);openModal('mPhoto')},reduceMotion?0:260);
}
$('photoShare').onclick=function(){
  fetch(PHOTO.url).then(function(r){return r.blob()}).then(function(b){
    var file=new File([b],PHOTO.name,{type:'image/jpeg'});
    if(navigator.canShare({files:[file]}))return navigator.share({files:[file],title:'문학 포토존'});
    toast('이 기기에서는 공유가 안 돼요. 저장을 눌러 주세요');
  }).catch(function(){});
};
