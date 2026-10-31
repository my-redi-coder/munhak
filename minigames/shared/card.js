/* ================= 선수 카드 그리기 (등번호 매치·카드 앨범 공용) ================= */
function cardEsc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function cardTag(p){return p.tier==='legend'?'<span class="tag" aria-hidden="true">♛</span>':p.tier==='star'?'<span class="tag" aria-hidden="true">★</span>':''}
/* 게임 카드 앞면: kind 'num'(등번호만) | 'name'(이름만) */
function cardFace(p,kind){
  var inner=kind==='num'
    ?'<span class="num'+(p.no.length>=3?' n3':'')+'">'+cardEsc(p.no)+'</span>'
    :'<span class="nm'+(p.name.length>=4?' long':'')+'">'+cardEsc(p.name)+'</span>'+(p.pos?'<span class="pos">'+cardEsc(p.pos)+'</span>':'')+'<span class="under"></span>';
  return '<div class="pc-front t-'+p.tier+'"><div class="pc-face">'+cardTag(p)+inner+'</div></div>';
}
/* 카드 뒷면: 랜더스 빨강 + 야구공 실밥 */
var CARD_BACK='<div class="pc-back"><svg viewBox="0 0 60 80" aria-hidden="true"><path d="M13 -2 C27 22 27 58 13 82" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M47 -2 C33 22 33 58 47 82" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M15.5 -2 C29.5 22 29.5 58 15.5 82" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="1.4 4.2" opacity=".55"/><path d="M44.5 -2 C30.5 22 30.5 58 44.5 82" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="1.4 4.2" opacity=".55"/></svg></div>';
/* 앨범 칸: 모은 카드는 번호+이름, 못 모은 칸은 ? */
function cardMini(p,has,isNew){
  if(!has)return '<div class="pc-mini locked" role="img" aria-label="아직 못 모은 카드">?</div>';
  return '<div class="pc-mini'+(isNew?' isnew':'')+'" role="img" aria-label="'+cardEsc(p.no+'번 '+p.name)+'"><div class="pc-front t-'+p.tier+'"><div class="pc-face">'+cardTag(p)
    +'<span class="num'+(p.no.length>=3?' n3':'')+'">'+cardEsc(p.no)+'</span><span class="mn">'+cardEsc(p.name)+(p.pos?' <small>'+cardEsc(p.pos.charAt(0))+'</small>':'')+'</span></div></div></div>';
}
