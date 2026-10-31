/* ================= petals ================= */
var petals=null;
(function(){
  var N=reduceMotion?0:240;if(!N)return;
  var tex=canvasTex(32,32,function(x){x.fillStyle='#ffd3de';x.beginPath();x.ellipse(16,16,12,7,.6,0,TAU);x.fill();x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.ellipse(13,13,5,2.5,.6,0,TAU);x.fill()});
  var g=new THREE.BufferGeometry(),a=new Float32Array(N*3);g.setAttribute('position',new THREE.BufferAttribute(a,3));
  petals={g:g,a:a,v:new Float32Array(N),ph:new Float32Array(N),N:N};
  for(var i=0;i<N;i++){a[i*3]=rnd(-22,22);a[i*3+1]=rnd(0,16);a[i*3+2]=rnd(-22,22);petals.v[i]=rnd(.4,.9);petals.ph[i]=rnd(0,TAU)}
  var pts=new THREE.Points(g,new THREE.PointsMaterial({map:tex,size:.2,transparent:true,depthWrite:false,alphaTest:.1}));pts.frustumCulled=false;scene.add(pts);petals.pts=pts;
})();
function updatePetals(dt,t){
  if(!petals)return;var a=petals.a,c=cam.look;
  for(var i=0;i<petals.N;i++){var j=i*3;a[j+1]-=petals.v[i]*dt;a[j]+=(Math.sin(t*.9+petals.ph[i])*.5+.7)*dt;a[j+2]+=Math.cos(t*.7+petals.ph[i])*.35*dt;
    var dx=a[j]-c.x,dz=a[j+2]-c.z;if(a[j+1]<c.y-6||dx>24||dx<-24||dz>24||dz<-24){a[j]=c.x+rnd(-22,18);a[j+1]=c.y+rnd(4,14);a[j+2]=c.z+rnd(-22,22)}}
  petals.g.attributes.position.needsUpdate=true;
}
