/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 바비큐존 (1루 외야 계단식 불판 테이블) =================
   사진 기준: 외야 담장 뒤로 계단처럼 올라가는 칸막이 부스. 칸마다 빨강·주황 낮은 벽, 짙은 나무 테이블과 양쪽 벤치,
   테이블 위 불판과 고기, 민트색 난간, 맨 윗줄은 빨간 차양 지붕. 연기는 bbqTick에서 매 프레임 올라감.
   자리·방향은 world/outfield.js가 담장 곡선을 따라 정해 OF.bbq에 넣어 줘요(1루 폴 쪽 첫 칸). */
var BBQ={rows:4,D:3,rise:1,base:FLOOR.out,cols:6,bw:3.6};/* base = 외야석과 같은 높이(config.js의 FLOOR.out) */
var bbqSmoke=[];
(function(){
  var g=new THREE.Group();g.position.set(OF.bbq.x,0,OF.bbq.z);g.rotation.y=OF.bbq.theta;scene.add(g);
  var R=BBQ.rows,D=BBQ.D,C=BBQ.cols,BW=BBQ.bw,W=C*BW+2.4,parts=[],grills=[],ppl=[];
  function fy(i){return BBQ.base+i*BBQ.rise}
  // 계단 바닥 + 앞 옹벽
  parts.push({g:Box(W,BBQ.base,1),c:0x2c6a47,p:[0,BBQ.base/2,-.5]});
  for(var i=0;i<R;i++){var y=fy(i);parts.push({g:Box(W,y,D),c:i%2?0xd9d5c9:0xcfcabd,p:[0,y/2,i*D+D/2]})}
  // 양옆 계단 + 민트 난간
  [-1,1].forEach(function(s){var sx=s*(W/2-.6);
    for(i=0;i<R*2;i++)parts.push({g:Box(1.1,.04,.1),c:0xf0c43c,p:[sx,fy(Math.floor(i/2))+(i%2)*.5+.02,i*D/2+.05]});
    var L=Math.hypot(R*D,R*BBQ.rise);parts.push({g:Box(.1,.1,L),c:0x6fd0b0,p:[sx-s*.6,BBQ.base+R*BBQ.rise/2+1,R*D/2],r:[-Math.atan2(BBQ.rise,D),0,0]})});
  for(var x=-W/2+.3;x<W/2;x+=1.2)parts.push({g:Box(.08,1,.08),c:0x6fd0b0,p:[x,BBQ.base+.5,-.05]});
  parts.push({g:Box(W,.1,.1),c:0x6fd0b0,p:[0,BBQ.base+1,-.05]});
  // 부스
  var wallC=[0xd8452e,0xe86a35],up=new THREE.Vector3(0,1,0);
  for(i=0;i<R;i++){var y0=fy(i),z0=i*D;
    for(var c=0;c<C;c++){var bx=(c-(C-1)/2)*BW;
      parts.push({g:Box(BW-.1,.95,.12),c:wallC[(i+c)%2],p:[bx,y0+.48,z0+.15]});
      parts.push({g:Box(.1,1.1,D-.3),c:0xc23a2a,p:[bx-BW/2,y0+.55,z0+D/2]});
      parts.push({g:Box(2.3,.08,.85),c:0x3b3530,p:[bx,y0+.76,z0+1.4]});
      parts.push({g:Box(.1,.72,.6),c:0x2b2622,p:[bx-.9,y0+.36,z0+1.4]});parts.push({g:Box(.1,.72,.6),c:0x2b2622,p:[bx+.9,y0+.36,z0+1.4]});
      parts.push({g:Box(2.1,.06,.32),c:0x4a3f36,p:[bx,y0+.45,z0+.62]});parts.push({g:Box(2.1,.06,.32),c:0x4a3f36,p:[bx,y0+.45,z0+2.2]});
      parts.push({g:Box(2.1,.4,.06),c:0x4a3f36,p:[bx,y0+.7,z0+2.38]});
      // 불판 + 고기
      var gx=bx+rnd(-.3,.3),gz=z0+1.4;
      parts.push({g:Box(.8,.07,.5),c:0x1d1d1d,p:[gx,y0+.84,gz]});parts.push({g:Box(.84,.03,.54),c:0x555555,p:[gx,y0+.8,gz]});
      for(var k=0;k<5;k++)parts.push({g:Box(rnd(.12,.2),.03,rnd(.08,.12)),c:pick([0xe8a39a,0xd98a6c,0xb5654a,0x7fb257]),p:[gx+rnd(-.3,.3),y0+.89,gz+rnd(-.17,.17)],r:[0,rnd(0,1),0]});
      parts.push({g:new THREE.CylinderGeometry(.07,.07,.12,8),c:0xf4f2ec,p:[bx+.85,y0+.86,gz+.25]});parts.push({g:new THREE.CylinderGeometry(.07,.07,.12,8),c:0x7fb257,p:[bx-.85,y0+.86,gz-.2]});
      if(Math.random()<.85){grills.push(new THREE.Vector3(gx,y0+.95,gz));
        var n=1+Math.floor(rnd(0,4));for(k=0;k<n;k++){var back=k<2||Math.random()<.5;ppl.push({x:bx+(k%2?.5:-.5)+rnd(-.15,.15),z:back?z0+2.2:z0+.62,y:y0+.45,face:back?Math.PI:0})}}
    }
    parts.push({g:Box(.1,1.1,D-.3),c:0xc23a2a,p:[W/2-1.2,y0+.55,z0+D/2]});
  }
  // 맨 윗줄 빨간 차양
  var zt=(R-1)*D,yt=fy(R-1);
  for(c=0;c<=C;c+=2){bx=(c-C/2)*BW;parts.push({g:Box(.18,3.2,.18),c:0xb3261e,p:[bx,yt+1.6,zt+.2]});parts.push({g:Box(.18,3.6,.18),c:0xb3261e,p:[bx,yt+1.8,zt+D-.2]})}
  parts.push({g:Box(W-1.6,.2,D+1),c:0xc8102e,p:[0,yt+3.55,zt+D/2],r:[.06,0,0]});
  parts.push({g:Box(W-1.6,.7,.12),c:0xa50e26,p:[0,yt+3.2,zt-.3]});
  g.add(new THREE.Mesh(mergeParts(parts),MVC));
  // 차양 앞 이름 띠
  var nt=canvasTex(1024,64,function(x,w,h){x.fillStyle='#a50e26';x.fillRect(0,0,w,h);x.fillStyle='#fff3e6';x.font='bold 40px "Gowun Dodum","Apple SD Gothic Neo",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('바비큐존  ·  구워 먹으며 봐요',w/2,h/2+2)});
  var nm=new THREE.Mesh(new THREE.PlaneGeometry(14,.66),new THREE.MeshBasicMaterial({map:nt}));nm.position.set(0,yt+3.2,zt-.37);nm.rotation.y=Math.PI;g.add(nm);
  // 앉은 사람들
  var m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1),col=new THREE.Color();
  var bim=new THREE.InstancedMesh(Cyl(.2,.26,.55,8),new THREE.MeshLambertMaterial({color:0xffffff}),ppl.length),him=new THREE.InstancedMesh(new THREE.SphereGeometry(.24,10,8),new THREE.MeshLambertMaterial({color:SKIN}),ppl.length),rim=new THREE.InstancedMesh(new THREE.SphereGeometry(.26,10,6,0,TAU,0,Math.PI*.52),new THREE.MeshLambertMaterial({color:HAIR}),ppl.length);
  ppl.forEach(function(o,i){q.setFromAxisAngle(up,o.face);v.set(o.x,o.y+.32,o.z);m4.compose(v,q,one);bim.setMatrixAt(i,m4);v.y=o.y+.78;m4.compose(v,q,one);him.setMatrixAt(i,m4);rim.setMatrixAt(i,m4);
    var u=Math.random();bim.setColorAt(i,col.setHex(u<.5?UNI.red.hex:u<.75?0xf6f4ed:u<.88?UNI.green.hex:pick([0x30405e,0xf2c230])))});
  g.add(bim,him,rim);
  // 연기
  var st=canvasTex(64,64,function(x,w,h){var gr=x.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,w,h)});
  g.updateMatrixWorld(true);
  grills.forEach(function(p){var w=p.clone();g.localToWorld(w);for(var k=0;k<3;k++){var s=new THREE.Sprite(new THREE.SpriteMaterial({map:st,color:0xb9b4ac,transparent:true,depthWrite:false,opacity:0}));scene.add(s);bbqSmoke.push({s:s,o:w,t:k/3*2.6+rnd(0,.4),life:2.6,dx:rnd(-.3,.3)})}});
})();
/* 매 프레임: 불판 연기 */
function bbqTick(dt){
  for(var i=0;i<bbqSmoke.length;i++){var p=bbqSmoke[i];p.t+=dt;if(p.t>p.life){p.t-=p.life;p.dx=rnd(-.3,.3)}
    var u=p.t/p.life,sc=.5+u*2;p.s.position.set(p.o.x+p.dx*u*2,p.o.y+u*2.6,p.o.z);p.s.scale.set(sc,sc,sc);p.s.material.opacity=Math.sin(u*Math.PI)*.6}
}
