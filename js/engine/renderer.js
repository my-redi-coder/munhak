/* ================= renderer ================= */
var canvas=$('c'),renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,powerPreference:'high-performance'})}catch(e){bootFail('이 브라우저에서는 3D 관중석을 열 수 없어요.');throw new Error('WebGL 없음')}
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
var scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xdcebee,170,520);
var camera=new THREE.PerspectiveCamera(55,1,0.1,1600);
var maxAniso=renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():1;

scene.add(new THREE.HemisphereLight(0xe3f1ff,0x8fb56a,0.82));
var sun=new THREE.DirectionalLight(0xfff1d8,0.78);sun.position.set(-70,120,60);scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff,0.12));

function canvasTex(w,h,draw){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');draw(x,w,h);var t=new THREE.CanvasTexture(c);t.anisotropy=maxAniso;return t}
function mergeParts(parts){
  var P=[],N=[],C=[],m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3();
  parts.forEach(function(p){
    var g=p.g.index?p.g.toNonIndexed():p.g.clone();
    e.set.apply(e,p.r||[0,0,0]);q.setFromEuler(e);v.set.apply(v,p.p||[0,0,0]);s.set.apply(s,p.s||[1,1,1]);
    m.compose(v,q,s);g.applyMatrix4(m);
    var pa=g.attributes.position.array,na=g.attributes.normal.array,col=new THREE.Color(p.c);
    for(var i=0;i<pa.length;i++){P.push(pa[i]);N.push(na[i])}
    for(i=0;i<pa.length/3;i++)C.push(col.r,col.g,col.b);
    g.dispose();
  });
  var out=new THREE.BufferGeometry();
  out.setAttribute('position',new THREE.Float32BufferAttribute(P,3));
  out.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  out.setAttribute('color',new THREE.Float32BufferAttribute(C,3));
  out.computeBoundingSphere();
  return out;
}
var MVC=new THREE.MeshLambertMaterial({vertexColors:true});
function Box(w,h,d){return new THREE.BoxGeometry(w,h,d)}
function Cyl(a,b,h,n,o,ts,tl){return new THREE.CylinderGeometry(a,b,h,n||12,1,!!o,ts||0,tl==null?TAU:tl)}
