/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= sky & world ================= */
var skyU=null;/* 하늘 색 uniforms(top·mid·bot) — world/daynight.js가 써요 */
(function sky(){
  var g=new THREE.SphereGeometry(900,32,16);
  var m=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new THREE.Color(0x6fb1e6)},mid:{value:new THREE.Color(0xa9d3ef)},bot:{value:new THREE.Color(0xeef5ec)}},
    vertexShader:'varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 top;uniform vec3 mid;uniform vec3 bot;varying vec3 vp;void main(){float h=vp.y;vec3 c=h>0.18?mix(mid,top,smoothstep(0.18,0.75,h)):mix(bot,mid,smoothstep(-0.05,0.18,h));gl_FragColor=vec4(c,1.0);}'});
  skyU=m.uniforms;scene.add(new THREE.Mesh(g,m));
})();
var cloudTex=canvasTex(256,128,function(x,w,h){for(var i=0;i<14;i++){var cx=rnd(50,206),cy=rnd(55,85),r=rnd(22,44);var gr=x.createRadialGradient(cx,cy,0,cx,cy,r);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill()}});
var clouds=[];
for(var ci=0;ci<11;ci++){var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTex,transparent:true,depthWrite:false,fog:false,opacity:.9}));var a=rnd(-1.4,4.6),r=rnd(260,520);sp.position.set(Math.sin(a)*r,rnd(80,150),-Math.cos(a)*r);var sc=rnd(90,170);sp.scale.set(sc,sc*.5,1);scene.add(sp);clouds.push(sp)}
