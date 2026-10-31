/* ================= 공격·수비 전환 ================= */
function syncFieldBtns(){['attack','defense'].forEach(function(m){$(m==='attack'?'bAtk':'bDef').setAttribute('aria-pressed',FP.mode===m?'true':'false')})}
function pickFieldMode(m){
  if(FP.mode===m&&FP.list.length)return;
  setFieldMode(m);syncFieldBtns();sfx('tap');if(phase==='game')toast(FIELD_MODE[m].toast,2600);
}
$('bAtk').onclick=function(){pickFieldMode('attack')};
$('bDef').onclick=function(){pickFieldMode('defense')};
setFieldMode(FP.mode);syncFieldBtns();
