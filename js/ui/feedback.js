/* ================= UI helpers ================= */
var toastT=null,lastAmbientToast=0,lastSysToast=0;
function toast(msg,ms,ambient){
  var now=performance.now();if(ambient){if(EV.on)return;if(now-lastAmbientToast<4200||now-lastSysToast<2600)return;lastAmbientToast=now}else lastSysToast=now;
  var el=$('toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('on')},ms||2600);
}
var labels=[];
function addLabel(ch,text,kind,ms){
  labels=labels.filter(function(l){if(l.ch===ch&&l.kind===kind){l.el.remove();return false}return true});
  var el=document.createElement('div');el.className=kind==='tag'?'tag':'bub'+(kind==='angry'?' angry':'');
  if(kind==='tag'&&ch===player){var i=document.createElement('i');i.textContent='나';el.appendChild(i);el.appendChild(document.createTextNode(text))}else el.textContent=text;
  $('labels').appendChild(el);labels.push({ch:ch,el:el,kind:kind,until:performance.now()+(ms||2400)});
}
var _p=new THREE.Vector3();
function updateLabels(now){
  var W=innerWidth,H=innerHeight;
  labels=labels.filter(function(l){
    if(now>l.until||!l.ch.root.parent){l.el.remove();return false}
    l.ch.headG.getWorldPosition(_p);_p.y+=l.kind==='tag'?.55:.7;
    if(l.kind!=='tag'&&l.ch.act==='wave')_p.y+=.45;
    _p.project(camera);
    if(_p.z>1){l.el.style.opacity=0;return true}
    l.el.style.opacity=1;l.el.style.transform='translate('+((_p.x*.5+.5)*W)+'px,'+((-_p.y*.5+.5)*H)+'px) translate(-50%,-100%)';
    return true;
  });
}
function clearLabels(){labels.forEach(function(l){l.el.remove()});labels=[]}

function drawSoundIcon(){
  $('sndIco').innerHTML=AU.on?'<path d="M4 10v4h3.5L12 18V6L7.5 10z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>':'<path d="M4 10v4h3.5L12 18V6L7.5 10z"/><path d="M16 10l4 4M20 10l-4 4"/>';
  $('bSound').setAttribute('aria-label',AU.on?'소리 끄기':'소리 켜기');
}

/* counts */
var COUNTS={ussk:Math.floor(rnd(780,920)),infield:Math.floor(rnd(1100,1300)),outfield:Math.floor(rnd(1400,1650)),harulala:Math.floor(rnd(380,470))};
function fmt(n){return n.toLocaleString('ko-KR')}
function totalCount(){return COUNTS.ussk+COUNTS.infield+COUNTS.outfield+COUNTS.harulala}
setInterval(function(){ZKEYS.forEach(function(k){COUNTS[k]=Math.max(100,COUNTS[k]+Math.floor(rnd(-4,6)))});$('crowdN').textContent=fmt(totalCount())},9000);
