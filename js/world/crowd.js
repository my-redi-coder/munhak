/* decor seats instanced */
(function(){
  var cols={};decorSeats.forEach(function(d){var ck=d.col+(d.blk.dim?'d':'');(cols[ck]=cols[ck]||[]).push(d)});/* 'd'가 붙은 묶음은 밤에 어두워져요(world/nightdim.js) */
  var m=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),s1=new THREE.Vector3(1,1,1);
  Object.keys(cols).forEach(function(k){
    var arr=cols[k],im=new THREE.InstancedMesh(SEATGEO,new THREE.MeshLambertMaterial({color:arr[0].col}),arr.length);im.userData.dimZone=!!arr[0].blk.dim;
    arr.forEach(function(d,i){v.set(d.s.x,d.s.y,d.s.z);d.blk.g.localToWorld(v);q.setFromAxisAngle(new THREE.Vector3(0,1,0),d.blk.cfg.theta);m.compose(v,q,s1);im.setMatrixAt(i,m)});
    scene.add(im);
  });
})();

/* crowd instanced */
var _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_v=new THREE.Vector3(),_s=new THREE.Vector3(),_up=new THREE.Vector3(0,1,0);
var crowd={};
(function(){
  var n=crowdSpots.length;
  var gb=Cyl(.21,.25,.5,8),gh=new THREE.SphereGeometry(.27,10,8),gr=new THREE.SphereGeometry(.29,10,6,0,TAU,0,Math.PI*.52);
  crowd.body=new THREE.InstancedMesh(gb,new THREE.MeshLambertMaterial({color:0xffffff}),n);
  crowd.head=new THREE.InstancedMesh(gh,new THREE.MeshLambertMaterial({color:SKIN}),n);
  crowd.hair=new THREE.InstancedMesh(gr,new THREE.MeshLambertMaterial({color:HAIR}),n);
  [crowd.body,crowd.head,crowd.hair].forEach(function(m){m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(m)});
  crowd.base=new Float32Array(n*4);crowd.phase=new Float32Array(n);crowd.hidden=new Uint8Array(n);crowd.zone=[];
  var v=new THREE.Vector3(),col=new THREE.Color();
  crowdSpots.forEach(function(cs,i){
    v.set(cs.seat.x,cs.seat.y,cs.seat.z+.02);cs.blk.g.localToWorld(v);
    crowd.base[i*4]=v.x;crowd.base[i*4+1]=v.y;crowd.base[i*4+2]=v.z;crowd.base[i*4+3]=cs.blk.cfg.theta;
    crowd.phase[i]=Math.random()*TAU;crowd.zone[i]=cs.blk.key;
    var u=Math.random();col.setHex(u<.48?UNI.red.hex:u<.72?0xf6f4ed:u<.86?UNI.green.hex:pick([0x30405e,0xe9b9c4,0xd6cdb4]));
    crowd.body.setColorAt(i,col);
    crowdSet(i,0);
  });
  crowd.body.instanceColor.needsUpdate=true;
})();
function crowdSet(i,lift){
  var b=crowd.base,x=b[i*4],y=b[i*4+1],z=b[i*4+2],th=b[i*4+3],k=crowd.hidden[i]?0:1;
  _q.setFromAxisAngle(_up,th);_s.set(k,k,k);
  _v.set(x,y+.72+lift,z);_m.compose(_v,_q,_s);crowd.body.setMatrixAt(i,_m);
  _v.set(x,y+1.18+lift,z);_m.compose(_v,_q,_s);crowd.head.setMatrixAt(i,_m);crowd.hair.setMatrixAt(i,_m);
}
function crowdFlush(){crowd.body.instanceMatrix.needsUpdate=true;crowd.head.instanceMatrix.needsUpdate=true;crowd.hair.instanceMatrix.needsUpdate=true}
