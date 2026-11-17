/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/toolkit: 글씨·그림 그리기 도구 =================
   필요: engine/renderer.js(scene·canvasTex). 벽에 붙이는 글씨판(plane)·미터 단위 글씨 그림(texW)·글꼴 이름(MHF) · 다시 그릴 수 있는 글씨 그림(mhLiveTex) */
var MHF={cond:'"Barlow Condensed","Arial Narrow",sans-serif',kr:'"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif'};
function mhPlane(w,h,tex,opt){opt=opt||{};var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:opt.transparent!==false,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));scene.add(m);return m}
function mhTexW(wm,hm,ppm,draw){var w=Math.round(wm*ppm),h=Math.round(hm*ppm);return mhLiveTex(w,h,draw)}
/* 글씨가 있는 그림은 MH.live에 모아 둬요: 처음엔 받아 둔 글꼴(없으면 기본 글꼴)로 그리고,
   들어간 뒤 나머지 글꼴을 다 받으면 mhRedrawLive()가 한 번 더 그려요 (boot.js) */
MH.live=[];
function mhLiveTex(w,h,draw){var t=canvasTex(w,h,draw);MH.live.push({t:t,d:draw});return t}
function mhRedrawLive(){MH.live.forEach(function(L){var c=L.t.image;c.width=c.width;/* 지우고 그리기 설정도 처음으로 */L.d(c.getContext('2d'),c.width,c.height);L.t.needsUpdate=true})}
