makePlayer();makeLeader();resize();
setTimeout(function(){
  startSetup();resize();
  requestAnimationFrame(function(t){last=t;frame(t);
    setTimeout(function(){$('boot').classList.add('out');setTimeout(function(){$('boot').hidden=true},700)},500)});
},60);
var _ro=new ResizeObserver(function(){if(phase==='setup1'||phase==='setup2')applyViewOffset()});_ro.observe(document.querySelector('#setup .sheet'));
