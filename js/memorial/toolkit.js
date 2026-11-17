/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/toolkit: 글씨·그림 그리기 도구 =================
   필요: engine/renderer.js(scene·canvasTex). 벽에 붙이는 글씨판(plane)·미터 단위 글씨 그림(texW)·글꼴 이름(MHF) */
var MHF={cond:'"Barlow Condensed","Arial Narrow",sans-serif',kr:'"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif'};
function mhPlane(w,h,tex,opt){opt=opt||{};var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:opt.transparent!==false,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));scene.add(m);return m}
function mhTexW(wm,hm,ppm,draw){var w=Math.round(wm*ppm),h=Math.round(hm*ppm);return canvasTex(w,h,draw)}
