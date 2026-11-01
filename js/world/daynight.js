/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 낮 경기 · 밤 경기 (묶음 A, 2026-11-01) =================
   setDayNight('day'|'night') → DN.FADE초 동안 서서히 바뀌어요(app/loop.js가 매 프레임 dnTick(dt)). 고른 값은 이 기기에 저장(store 'dayTime').
   밤 경기 = 하늘·안개·구름은 밤, 구장은 조명탑이 켜져서 환해요. (여난부두처럼 불 꺼진 구장이 아니에요)
   - 바뀌는 값은 모두 DN_LOOK(아래) 한 곳에. 하늘 색은 world/sky.js의 skyU, 빛은 engine/renderer.js의 빛 3개,
     조명탑 자리는 world/landmarks.js의 TOWERS·towerRY.
   - 조명탑 불빛(머리판 + 번지는 빛)과 별은 처음 밤이 될 때 만들어요.
   - 여난부두(events/yeonan.js)는 지금 모습에서 더 어둡게 갔다가 돌아와요. 그동안 dnEventDark(n)로 조명탑 불을 끄고 별을 띄워요.
   - 실내 포토존(PZ_CFG의 indoor:true, 플레이어존)은 dnOverride(0)로 들어가 있는 동안만 낮 조명. dnOverride(null)로 원래대로. */
var DN={mode:store.get('dayTime','day'),n:0,want:0,FADE:1.5,force:null,ev:0,lamps:null,stars:null};
if(!DAY_TIME[DN.mode])DN.mode='day';
DN.want=DN.n=DN.mode==='night'?1:0;

var DN_LOOK={
  sky:[0x0b1533,0x18264d,0x37446f],          /* 하늘 위 · 가운데 · 지평선(도시 불빛이 살짝) */
  fog:0x1c2646,
  hemi:{i:.74,sky:0xdfe8ff,gnd:0x5d7a52},     /* 그라운드·관중석은 조명 받은 듯 밝게, 색만 살짝 차갑게 */
  sun:{i:.7,c:0xf4f7ff,pos:[0,150,-30]},      /* 해 대신 조명탑 빛이 위에서 */
  amb:.2,
  cloud:{op:.3,c:0x5a648a},
  lamp:{core:24,haze:86,hazeOp:.32},          /* 조명탑 번지는 빛 크기 */
  stars:420
};

/* ---- 낮 값(처음 모습)을 기억해 두고, 밤 값과 섞어요 ---- */
var DN_B=(function(){
  var hemi=null,amb=null;
  scene.children.forEach(function(o){if(o.isHemisphereLight)hemi=o;if(o.isAmbientLight)amb=o});
  var C=function(h){return new THREE.Color(h)};
  return {
    hemi:hemi,amb:amb,
    day:{hi:hemi.intensity,hc:hemi.color.clone(),hg:hemi.groundColor.clone(),si:sun.intensity,sc:sun.color.clone(),sp:sun.position.clone(),ai:amb.intensity,
      sky:skyU?['top','mid','bot'].map(function(k){return skyU[k].value.clone()}):null,fog:scene.fog.color.clone(),cop:.9,cc:C(0xffffff)},
    night:{hc:C(DN_LOOK.hemi.sky),hg:C(DN_LOOK.hemi.gnd),sc:C(DN_LOOK.sun.c),sp:new THREE.Vector3().fromArray(DN_LOOK.sun.pos),
      sky:DN_LOOK.sky.map(C),fog:C(DN_LOOK.fog),cc:C(DN_LOOK.cloud.c)}
  };
})();
function dnL(a,b,n){return a+(b-a)*n}

/* ---- 조명탑 불빛: 머리판(전구 격자) + 가운데 빛 + 넓게 번지는 빛 ---- */
function dnGlowTex(){return canvasTex(128,128,function(x,w,h){var g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,252,236,1)');g.addColorStop(.25,'rgba(255,246,214,.55)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,w,h)})}
function dnBuildLamps(){
  if(DN.lamps)return;
  var face=canvasTex(180,120,function(x,w,h){
    x.fillStyle='#fbf3d6';x.fillRect(0,0,w,h);
    for(var r=0;r<4;r++)for(var c=0;c<6;c++){var cx=15+c*30,cy=15+r*30,g=x.createRadialGradient(cx,cy,0,cx,cy,14);
      g.addColorStop(0,'#ffffff');g.addColorStop(.55,'#fffbe9');g.addColorStop(1,'rgba(255,236,180,.6)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,12,0,TAU);x.fill()}
  });
  var glow=dnGlowTex(),L=DN.lamps={faces:[],sprites:[]},v=new THREE.Vector3();
  var fm=new THREE.MeshBasicMaterial({map:face,transparent:true,opacity:0,fog:false,side:THREE.DoubleSide,depthWrite:false});
  TOWERS.forEach(function(p){
    var g=new THREE.Object3D();g.position.set(p[0],TOWER_HEAD_Y,p[1]);g.rotation.set(-.3,towerRY(p[0],p[1]),0);
    var m=new THREE.Mesh(new THREE.PlaneGeometry(8.6,5.6),fm);m.position.z=.42;g.add(m);scene.add(g);L.faces.push(g);
    g.updateMatrixWorld(true);v.set(0,0,1.2);g.localToWorld(v);
    [[DN_LOOK.lamp.core,1],[DN_LOOK.lamp.haze,DN_LOOK.lamp.hazeOp]].forEach(function(s){
      var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,transparent:true,opacity:0,fog:false,depthWrite:false,blending:THREE.AdditiveBlending}));
      sp.position.copy(v);sp.scale.set(s[0],s[0],1);sp.userData.k=s[1];scene.add(sp);L.sprites.push(sp);
    });
  });
  L.mat=fm;
}
function dnBuildStars(){
  if(DN.stars)return;
  var P=[],n=DN_LOOK.stars,v=new THREE.Vector3();
  for(var i=0;i<n;i++){var y=rnd(.12,1),a=rnd(0,TAU),r=Math.sqrt(1-y*y);v.set(Math.cos(a)*r,y,Math.sin(a)*r).multiplyScalar(860);P.push(v.x,v.y,v.z)}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));
  DN.stars=new THREE.Points(g,new THREE.PointsMaterial({color:0xf2f4ff,size:1.7,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));
  scene.add(DN.stars);
}
/* 조명탑 불빛·별 세기: 밤 정도 n, 여난부두 암전 DN.ev */
function dnGlow(){
  var k=DN.n*(1-DN.ev),st=Math.max(DN.n,DN.ev);
  if(k>0||st>0){dnBuildLamps();dnBuildStars()}
  if(DN.lamps){
    DN.lamps.mat.opacity=k;DN.lamps.faces.forEach(function(g){g.visible=k>.01});
    DN.lamps.sprites.forEach(function(s){s.material.opacity=k*s.userData.k;s.visible=k>.01});
  }
  if(DN.stars){DN.stars.material.opacity=st*.9;DN.stars.visible=st>.01}
}

/* ---- n(0 낮 ~ 1 밤)만큼 섞어서 적용 ---- */
function dnApply(n){
  var D=DN_B.day,N=DN_B.night,h=DN_B.hemi;DN.n=n;
  h.intensity=dnL(D.hi,DN_LOOK.hemi.i,n);h.color.copy(D.hc).lerp(N.hc,n);h.groundColor.copy(D.hg).lerp(N.hg,n);
  sun.intensity=dnL(D.si,DN_LOOK.sun.i,n);sun.color.copy(D.sc).lerp(N.sc,n);sun.position.copy(D.sp).lerp(N.sp,n);
  DN_B.amb.intensity=dnL(D.ai,DN_LOOK.amb,n);
  if(D.sky)['top','mid','bot'].forEach(function(k,i){skyU[k].value.copy(D.sky[i]).lerp(N.sky[i],n)});
  scene.fog.color.copy(D.fog).lerp(N.fog,n);
  clouds.forEach(function(c){c.material.opacity=dnL(D.cop,DN_LOOK.cloud.op,n);c.material.color.copy(D.cc).lerp(N.cc,n)});
  dnGlow();
}
function setDayNight(m){
  if(!DAY_TIME[m])return;
  DN.mode=m;DN.want=m==='night'?1:0;store.set('dayTime',m);
  if(reduceMotion&&DN.force==null)dnApply(DN.want);
}
function dnTick(dt){
  if(DN.force!=null||(typeof EV!=='undefined'&&EV.run))return;/* 이벤트 장면이 조명을 쥐고 있는 동안은 기다려요 */
  if(DN.n===DN.want)return;
  var s=dt/DN.FADE,n=DN.want>DN.n?Math.min(DN.want,DN.n+s):Math.max(DN.want,DN.n-s);
  dnApply(n);
}
/* 실내 포토존 등: v(0~1)로 잠깐 고정, null이면 지금 고른 낮·밤으로 바로 돌아가요 (화면 전환 페이드 안에서 불러요) */
function dnOverride(v){DN.force=v;dnApply(v==null?DN.want:v)}
/* 여난부두 암전 정도(0~1): 조명탑 불은 꺼지고, 별은 보여요 */
function dnEventDark(n){DN.ev=n;dnGlow()}

if(DN.n)dnApply(DN.n);
