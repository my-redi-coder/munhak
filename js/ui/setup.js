/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= setup UI ================= */
function buildSwatches(){
  var box=$('swatches');box.innerHTML='';
  UKEYS.forEach(function(k){var b=document.createElement('button');b.className='sw';b.setAttribute('role','radio');b.setAttribute('aria-checked',k===ME.uni);b.innerHTML='<i style="background:'+UNI[k].css+'"></i>'+UNI[k].label;
    b.onclick=function(){ME.uni=k;player.setUniform(k);buildSwatches();sfx('tap')};box.appendChild(b)});
}
/* (작은 패치 R) 꾸미기: 모자 쓰기 체크박스. 고른 값은 저장돼서 다음에 와도 그대로예요 */
function buildDeco(){
  var box=$('decos');box.innerHTML='';
  var b=document.createElement('button');b.className='sw';b.setAttribute('role','checkbox');b.setAttribute('aria-checked',!!ME.hat);b.textContent='모자 쓰기';
  b.onclick=function(){ME.hat=!ME.hat;player.setHat(ME.hat);store.set('hat',ME.hat);buildDeco();sfx('tap')};
  box.appendChild(b);
}
/* 입장 준비 2단계의 구역 고르기. (게임 안에서 옮기는 건 '내 위치' 메뉴, ui/places.js) */
function buildZoneList(el){
  el.innerHTML='';
  ZKEYS.forEach(function(k){
    var b=document.createElement('button');b.className='zone';b.setAttribute('role','radio');
    var on=ME.zone===k;b.setAttribute('aria-checked',on);
    var t=document.createElement('div');t.innerHTML='<b></b><span></span>';t.querySelector('b').textContent=ZONES[k].label;t.querySelector('span').textContent=ZONES[k].desc;b.appendChild(t);
    var rd=document.createElement('span');rd.className='rd';b.appendChild(rd);
    b.onclick=function(){ME.zone=k;buildZoneList(el);focusZone(k)};
    el.appendChild(b);
  });
}
function syncBack(){var n=$('inName').value.trim(),num=$('inNum').value.replace(/\D/g,'').slice(0,2);$('inNum').value=num;ME.backName=n;ME.backNum=num;player.setBack(n,num);store.set('backName',n);store.set('backNum',num)}
$('inName').addEventListener('input',syncBack);$('inNum').addEventListener('input',syncBack);
$('reroll').onclick=function(){var a;do{a=pick(ADJ)}while(a===ME.adj);ME.adj=a;$('meName').textContent=myName();player.name=myName();sfx('tap')};
$('toStep2').onclick=function(){$('step1').hidden=true;$('step2').hidden=false;phase='setup2';focusZone(ME.zone);auEnsure()};
$('toStep1').onclick=function(){$('step2').hidden=true;$('step1').hidden=false;phase='setup1';beacon.visible=false};
$('enter').onclick=function(){auEnsure();store.set('zone',ME.zone);enterGame()};

/* zone beacon */
var beaconTex=canvasTex(256,128,function(x,w,h){});
var beacon=new THREE.Sprite(new THREE.SpriteMaterial({map:beaconTex,transparent:true,depthTest:false,fog:false}));beacon.scale.set(16,8,1);beacon.visible=false;scene.add(beacon);
function drawBeacon(label){var c=beaconTex.image,x=c.getContext('2d');x.clearRect(0,0,256,128);x.fillStyle='#c8102e';x.beginPath();x.roundRect?x.roundRect(28,14,200,62,31):x.rect(28,14,200,62);x.fill();x.beginPath();x.moveTo(116,74);x.lineTo(128,96);x.lineTo(140,74);x.fill();x.fillStyle='#fff';x.font='30px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(label,128,46);beaconTex.needsUpdate=true}
var overview={pos:new THREE.Vector3(),look:new THREE.Vector3()};
function blockCenter(blk,out){out.set(0,blk.base+blk.R*RH*.5,blk.R*RD*.45);return blk.g.localToWorld(out)}
function focusZone(k){
  var blk=ZB[k],c=blockCenter(blk,new THREE.Vector3());drawBeacon(ZONES[k].label);beacon.position.set(c.x,c.y+6.5,c.z);beacon.visible=true;
  var th=blk.cfg.theta,fw=new THREE.Vector3(-Math.sin(th),0,-Math.cos(th));
  overview.look.copy(c);overview.look.y+=4;overview.pos.copy(c).addScaledVector(fw,k==='outfield'?62:52);overview.pos.y=c.y+(k==='harulala'?14:26);
  var side=new THREE.Vector3(fw.z,0,-fw.x);overview.pos.addScaledVector(side,k==='outfield'?18:-14);
}
