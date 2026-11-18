/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 빅보드 양옆 공중 컨페티 =================
   빅보드 화면이 아니라 빅보드 앞 공중(양옆)에서 큼지막한 종이 조각이 '팡' 터져 펄럭이며 내려와요.
   CF.EVERY초마다 왼쪽·오른쪽이 살짝 엇갈려 터지고, 한쪽마다 CF.SLOT번 치를 돌려 써서 끊김이 없어요.
   켜고 끄기: cfShow(true/false) — 지금은 오늘 하루 빅보드(world/todayboard.js)가 켜요.
   조각 하나 = 평면 1장(InstancedMesh 하나로 전부 그림). */
var CF={on:false,EVERY:4.2,SLOT:3,PER:190,SIZE:[1.7,0.95],
  at:[[-31,BB.CY+5,BB.Z+13],[31,BB.CY+5,BB.Z+13]],/* 터지는 자리: 빅보드 양쪽 끝 앞 공중 */
  COLS:[0xe3203a,0xffffff,0xffd23f,0xe3203a,0xd9dee6,0xff8fa8,0xffffff],t:0,n:0,next:[0,.35],slot:[0,0],ps:[],flash:[]};
(function(){
  var N=2*CF.SLOT*CF.PER;CF.n=N;
  var geo=new THREE.PlaneGeometry(CF.SIZE[0],CF.SIZE[1]);
  var mat=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,fog:false});
  var m=new THREE.InstancedMesh(geo,mat,N);m.frustumCulled=false;m.visible=false;scene.add(m);CF.mesh=m;
  var col=new THREE.Color();
  for(var i=0;i<N;i++){CF.ps.push({live:false,p:new THREE.Vector3(),v:new THREE.Vector3(),r:new THREE.Euler(),w:new THREE.Vector3(),s:1,ph:0});
    col.setHex(CF.COLS[i%CF.COLS.length]);m.setColorAt(i,col)}
  m.instanceColor.needsUpdate=true;
  // 터질 때 번쩍이는 빛 (양쪽 하나씩)
  var fc=document.createElement('canvas');fc.width=fc.height=128;var fx=fc.getContext('2d'),rg=fx.createRadialGradient(64,64,2,64,64,64);
  rg.addColorStop(0,'rgba(255,250,220,1)');rg.addColorStop(.35,'rgba(255,220,140,.6)');rg.addColorStop(1,'rgba(255,200,120,0)');fx.fillStyle=rg;fx.fillRect(0,0,128,128);
  var ft=new THREE.CanvasTexture(fc);
  CF.at.forEach(function(a){var s=new THREE.Sprite(new THREE.SpriteMaterial({map:ft,transparent:true,depthWrite:false,fog:false,opacity:0}));s.position.set(a[0],a[1],a[2]);s.scale.set(16,16,1);s.visible=false;scene.add(s);CF.flash.push({s:s,t:9})});
  CF.dm=new THREE.Object3D();CF.hide=new THREE.Matrix4().makeScale(0,0,0);
  for(i=0;i<N;i++)m.setMatrixAt(i,CF.hide);m.instanceMatrix.needsUpdate=true;
  if(window.TD&&TD.on)cfShow(true);
})();
function cfShow(on){CF.on=on;CF.mesh.visible=on;CF.t=0;CF.next=[.2,.55];if(!on){CF.ps.forEach(function(q){q.live=false});CF.flash.forEach(function(f){f.s.visible=false})}}
/* 한쪽(side 0=왼쪽,1=오른쪽) 한 번 터뜨리기: 공 모양으로 퍼지되 위·앞(관중석 쪽)으로 조금 더 */
function cfBurst(side){
  var a=CF.at[side],base=(side*CF.SLOT+CF.slot[side])*CF.PER;CF.slot[side]=(CF.slot[side]+1)%CF.SLOT;
  for(var i=0;i<CF.PER;i++){var q=CF.ps[base+i];
    var u=rnd(-1,1),th=rnd(0,TAU),rr=Math.sqrt(1-u*u),sp=rnd(14,34);
    q.p.set(a[0]+rnd(-1,1),a[1]+rnd(-1,1),a[2]+rnd(-1,1));
    q.v.set(rr*Math.cos(th)*sp+(side?6:-6),u*sp*.8+12,rr*Math.sin(th)*sp*.7+8);
    q.r.set(rnd(0,TAU),rnd(0,TAU),rnd(0,TAU));q.w.set(rnd(-9,9),rnd(-7,7),rnd(-9,9));q.s=rnd(.7,1.35);q.ph=rnd(0,TAU);q.live=true}
  var f=CF.flash[side];f.t=0;f.s.visible=true;
}
function cfTick(dt){
  if(!CF.on)return;CF.t+=dt;
  for(var sd=0;sd<2;sd++){CF.next[sd]-=dt;if(CF.next[sd]<=0){cfBurst(sd);CF.next[sd]+=CF.EVERY}}
  CF.flash.forEach(function(f){if(!f.s.visible)return;f.t+=dt;var k=f.t/.45;if(k>=1){f.s.visible=false;return}f.s.material.opacity=(1-k)*.95;var sc=10+k*22;f.s.scale.set(sc,sc,1)});
  var m=CF.mesh,dm=CF.dm,drag=Math.exp(-2.1*dt);
  for(var i=0;i<CF.n;i++){var q=CF.ps[i];if(!q.live)continue;
    q.v.y-=9.8*dt;q.v.multiplyScalar(drag);if(q.v.y<-4.2)q.v.y=-4.2;/* 종이라 천천히 떨어져요 */
    q.p.x+=(q.v.x+Math.sin(CF.t*2.3+q.ph)*1.6)*dt;q.p.y+=q.v.y*dt;q.p.z+=(q.v.z+Math.cos(CF.t*1.9+q.ph)*1.1)*dt;
    q.r.x+=q.w.x*dt;q.r.y+=q.w.y*dt;q.r.z+=q.w.z*dt;
    if(q.p.y<1){q.live=false;m.setMatrixAt(i,CF.hide);continue}
    dm.position.copy(q.p);dm.rotation.copy(q.r);dm.scale.setScalar(q.s);dm.updateMatrix();m.setMatrixAt(i,dm.matrix)}
  m.instanceMatrix.needsUpdate=true;
}
