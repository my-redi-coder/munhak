/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/boot: 시작 + 매 프레임 =================
   순서: 짤 목록 받기 + 벽 글씨 글꼴 받기(3.5초 넘으면 그냥 시작) → 자리 계산 → 통로·벽 그래픽·액자 짓기 → 으쓱이
        → (처음이면 꾸미기 창) → 입장 연출 → 걷기.
   engine/renderer.js가 야구장용으로 만든 하늘빛 안개·조명은 지우고 기념관 실내 조명으로 바꿔요. */
var _mhItems=[],_mhPrev=0,_mhFrame=0;
function mhSetupScene(){
  scene.children.slice().forEach(function(c){scene.remove(c)});
  scene.background=new THREE.Color(0xf2f3f5);scene.fog=new THREE.Fog(0xf2f3f5,16,52);
  camera.near=.1;camera.far=200;camera.updateProjectionMatrix();
  scene.add(new THREE.AmbientLight(0xffffff,.72));
  var s=new THREE.DirectionalLight(0xffffff,.5);s.position.set(0,12,6);scene.add(s);
  scene.add(new THREE.HemisphereLight(0xffffff,0xd8dadd,.2));
}
function mhLoop(now){
  var dt=Math.min(.05,(now-_mhPrev)/1000);_mhPrev=now;
  mhIntroTick(dt);mhUpdatePlayer(dt);MH.player.update(dt);mhUpdateCam(dt);
  if(MH.tapT>0){MH.tapT-=dt;MH.tapMark.material.opacity=Math.max(0,MH.tapT/.7)*.8;MH.tapMark.scale.setScalar(1+(.7-MH.tapT)*.5)}
  renderer.render(scene,camera);
  if((_mhFrame++)%8===0)mhUpdateLoc(_mhItems);
  requestAnimationFrame(mhLoop);
}
function mhBoot(photos){
  mhSetupScene();
  _mhItems=MH.layoutItems(photos);
  mhResize();
  mhBuildConcourse();mhBuildGraphics();mhBuildFrames(_mhItems);mhBuildCorner();mhBuildChips();
  mhMakePlayer();mhBindInput();mhBindViewer();
  $('boot').classList.add('out');
  if(mhNeedsDress())mhShowDress(mhStartIntro);else mhStartIntro();
  _mhPrev=performance.now();requestAnimationFrame(mhLoop);
}
/* 벽 글씨 글꼴을 다 받은 뒤 짓기 */
function mhFontsReady(photos){
  var txt='최광야구입구홀다음전시를준비하고있어요짤이걸릴자리문학의기억유니폼헬멧장갑시즌착용야구공사인본인직접우승상금명품가방창단기록기념표창감사계약오만원장'+photos.map(function(p){return p.title}).join('');
  var FL=['800 40px "Barlow Condensed"','italic 800 40px "Barlow Condensed"','italic 700 40px "Barlow Condensed"','600 40px "Barlow Condensed"','900 40px "Noto Sans KR"','700 40px "Noto Sans KR"','500 40px "Noto Sans KR"'];
  var ready=document.fonts&&document.fonts.load?Promise.all(FL.map(function(f){return document.fonts.load(f,txt+'ZONE AB V6 Go for it! Photo of Today 0123456789')})):Promise.resolve();
  return Promise.race([ready,new Promise(function(r){setTimeout(r,3500)})]);
}
mhLoadPhotos().then(function(photos){return mhFontsReady(photos).then(function(){return photos})}).then(mhBoot,function(){mhBoot([])});
