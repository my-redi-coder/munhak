/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
makePlayer();makeLeader();makeMascots();resize();
setTimeout(function(){
  startSetup();resize();
  requestAnimationFrame(function(t){last=t;frame(t);
    setTimeout(function(){$('boot').classList.add('out');setTimeout(function(){$('boot').hidden=true},700)},500)});
},60);
var _ro=new ResizeObserver(function(){if(phase==='setup1'||phase==='setup2')applyViewOffset()});_ro.observe(document.querySelector('#setup .sheet'));
