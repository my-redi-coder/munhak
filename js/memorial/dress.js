/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/dress: 으쓱이 꾸미기 창 (처음 한 번만) =================
   로비에서 바로 기념관으로 온 사람은 경기장 '입장 준비'를 안 거쳐서 유니폼·등판이 비어 있어요. 그래서 처음 들어올 때 한 번만 이 창이 떠요.
   · 고르는 것: 유니폼 색 · 모자 · 등판 이름·번호 (경기장 입장 준비와 같은 항목, 같은 저장값)
   · 뜨는 조건(mhNeedsDress): 'dressed' 표시가 없고 등판 이름·번호도 저장돼 있지 않을 때 — 경기장에서 이미 꾸민 사람은 안 떠요
   · '들어가기'를 누르면 저장하고(dressed) 다시는 안 떠요. 기념관 안에서 다시 바꾸는 버튼은 없어요(바꾸려면 경기장 입장 준비)
   · 으쓱이는 바로 위에서 보이고 고르는 즉시 바뀌어요 */
function mhNeedsDress(){return !(store.get(MH.KEY.dressed,false)||ME.backName||ME.backNum)}
function mhBuildDressSwatches(){
  var box=$('dSwatches');box.innerHTML='';
  UKEYS.forEach(function(k){var b=document.createElement('button');b.type='button';b.className='sw';b.setAttribute('role','radio');b.setAttribute('aria-checked',k===ME.uni);
    b.innerHTML='<i style="background:'+UNI[k].css+'"></i>'+UNI[k].label;
    b.onclick=function(){ME.uni=k;MH.player.setUniform(k);store.set(MH.KEY.uni,k);mhBuildDressSwatches()};box.appendChild(b)});
}
function mhBuildDressHat(){
  var box=$('dHat');box.innerHTML='';var b=document.createElement('button');b.type='button';b.className='sw';b.setAttribute('role','checkbox');b.setAttribute('aria-checked',!!ME.hat);b.textContent='모자 쓰기';
  b.onclick=function(){ME.hat=!ME.hat;MH.player.setHat(ME.hat);store.set(MH.KEY.hat,ME.hat);mhBuildDressHat()};box.appendChild(b);
}
function mhSyncDressBack(){
  var n=$('dName').value.trim(),num=$('dNum').value.replace(/\D/g,'').slice(0,2);$('dNum').value=num;
  ME.backName=n;ME.backNum=num;MH.player.setBack(n,num);
}
function mhShowDress(onDone){
  var PL=MH.PL,cam=MH.cam,player=MH.player,land=mhLandAt();
  PL.dress=true;player.root.position.set(land.x,0,land.z);player.root.rotation.y=0;player.root.visible=true;
  cam.yaw=0;cam.pitch=.1;cam.dist=3.2;mhUpdateCam(1,true);
  mhBuildDressSwatches();mhBuildDressHat();$('dName').value=ME.backName||'';$('dNum').value=ME.backNum||'';
  $('dName').addEventListener('input',mhSyncDressBack);$('dNum').addEventListener('input',mhSyncDressBack);
  $('dress').hidden=false;
  $('dGo').onclick=function(){
    mhSyncDressBack();
    store.set(MH.KEY.backName,ME.backName);store.set(MH.KEY.backNum,ME.backNum);store.set(MH.KEY.uni,ME.uni);store.set(MH.KEY.hat,ME.hat);store.set(MH.KEY.dressed,true);
    $('dress').hidden=true;PL.dress=false;cam.dist=4.4;onDone();
  };
}
