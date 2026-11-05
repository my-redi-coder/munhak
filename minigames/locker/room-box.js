/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 라커룸 입체 도구 (2026-11-05, 패치 Y) =================
   모든 칸이 같은 한 점(RS.VP, 눈높이 소실점)을 향해 깊어지는 '속이 빈 상자'로 보이게 그려요.
   rbBox(부모, 열린 면 [x,y,너비,높이], 옵션) — 상자 하나: 뒷벽 + 왼쪽·오른쪽 옆벽 + 천장 + 바닥을 따로 칠함.
     눈이 위/아래/옆 어디 있느냐에 따라 보이는 면만 남도록 열린 면 모양으로 잘라 둬요(가려지는 면은 저절로 사라짐).
     옵션 k = 깊이(뒷벽이 열린 면의 몇 배 크기로 보이나, 작을수록 깊음), back·wl·wr·top·bot = 면 색(칠하기 값)
     돌려주는 것: g(잘린 그룹 — 안에 물건을 넣어요), B(뒷벽 사각형), at(깊이 d 0~1, 가로 0~1, 세로 0~1) → {x,y,s}(그 자리의 화면 좌표와 크기 비율)
   rbFrame(부모, 바깥 [x,y,w,h], 구멍들, 색) — 앞면 틀(구멍 뚫린 판) + 두께가 느껴지게 윗선 밝게·아랫선 어둡게
   rbFloor(부모, 시작 y) — 바닥: 소실점으로 모이는 줄 + 바닥 그림자
   ※ 물건은 상자 안 깊이 d 에 놓고, 크기는 at().s 로 줄여요(가까울수록 크게). */
var RB_N=0;
function rbPoly(parent,pts,fill){return rk('polygon',{points:pts.join(' '),fill:fill},parent)}
function rbBox(parent,O,o){
  var vp=RS.VP,k=o.k,x0=O[0],y0=O[1],x1=O[0]+O[2],y1=O[1]+O[3];
  function lp(x,y){return [vp[0]+(x-vp[0])*k,vp[1]+(y-vp[1])*k]}
  var b0=lp(x0,y0),b1=lp(x1,y1),id='rbc'+(++RB_N);
  var cp=rk('clipPath',{id:id},parent.querySelector('defs')||parent);rk('rect',{x:x0,y:y0,width:O[2],height:O[3]},cp);
  var g=rk('g',{'clip-path':'url(#'+id+')'},parent);
  rk('rect',{x:b0[0],y:b0[1],width:b1[0]-b0[0],height:b1[1]-b0[1],fill:o.back},g);
  rbPoly(g,[x0,y1,x1,y1,b1[0],b1[1],b0[0],b1[1]],o.bot);
  rbPoly(g,[x0,y0,x1,y0,b1[0],b0[1],b0[0],b0[1]],o.top);
  rbPoly(g,[x0,y0,b0[0],b0[1],b0[0],b1[1],x0,y1],o.wl);
  rbPoly(g,[x1,y0,b1[0],b0[1],b1[0],b1[1],x1,y1],o.wr);
  /* 안쪽 모서리 그늘 + 깊은 곳이 살짝 어두운 느낌 */
  rk('rect',{x:b0[0],y:b0[1],width:b1[0]-b0[0],height:b1[1]-b0[1],fill:'url(#rmVig)'},g);
  rk('path',{d:'M'+x0+','+y0+'L'+b0[0]+','+b0[1]+'M'+x1+','+y0+'L'+b1[0]+','+b0[1]+'M'+x0+','+y1+'L'+b0[0]+','+b1[1]+'M'+x1+','+y1+'L'+b1[0]+','+b1[1],stroke:'rgba(0,0,0,.13)','stroke-width':1,fill:'none'},g);
  rk('rect',{x:b0[0],y:b0[1],width:b1[0]-b0[0],height:b1[1]-b0[1],fill:'none',stroke:'rgba(0,0,0,.14)','stroke-width':1},g);
  return {g:g,O:O,B:[b0[0],b0[1],b1[0]-b0[0],b1[1]-b0[1]],
    at:function(d,fx,fy){var ax=x0+(b0[0]-x0)*d,ay=y0+(b0[1]-y0)*d,bx=x1+(b1[0]-x1)*d,by=y1+(b1[1]-y1)*d;
      return {x:ax+fx*(bx-ax),y:ay+fy*(by-ay),s:(bx-ax)/(x1-x0)}}};
}
function rbFrame(parent,outer,holes,fill){
  var d='M'+outer[0]+','+outer[1]+'h'+outer[2]+'v'+outer[3]+'h'+(-outer[2])+'Z';
  holes.forEach(function(h){d+='M'+h[0]+','+h[1]+'h'+h[2]+'v'+h[3]+'h'+(-h[2])+'Z'});
  var g=rk('g',null,parent);
  rk('path',{d:d,fill:fill,'fill-rule':'evenodd'},g);
  rk('rect',{x:outer[0],y:outer[1],width:outer[2],height:1.6,fill:'rgba(255,255,255,.55)'},g);
  rk('rect',{x:outer[0],y:outer[1],width:1.6,height:outer[3],fill:'rgba(255,255,255,.3)'},g);
  rk('rect',{x:outer[0]+outer[2]-2,y:outer[1],width:2,height:outer[3],fill:'rgba(0,0,0,.16)'},g);
  rk('rect',{x:outer[0],y:outer[1]+outer[3]-2,width:outer[2],height:2,fill:'rgba(0,0,0,.16)'},g);
  holes.forEach(function(h){/* 구멍 가장자리 안쪽 그늘(틀의 두께) */
    rk('rect',{x:h[0],y:h[1],width:h[2],height:2.4,fill:'rgba(0,0,0,.2)'},g);rk('rect',{x:h[0],y:h[1],width:2.4,height:h[3],fill:'rgba(0,0,0,.14)'},g);
    rk('rect',{x:h[0],y:h[1]+h[3]-1.6,width:h[2],height:1.6,fill:'rgba(255,255,255,.5)'},g)});
  return g;
}
function rbFloor(parent,y0,H){
  var vp=RS.VP,g=rk('g',null,parent),bottom=H;
  rk('rect',{x:0,y:y0,width:RS.W,height:H-y0,fill:'url(#rmFloor)'},g);
  for(var X=-240;X<=640;X+=64){var t=(y0-vp[1])/(bottom-vp[1]);rk('path',{d:'M'+(vp[0]+(X-vp[0])*t)+','+y0+'L'+X+','+bottom,stroke:'rgba(255,255,255,.07)','stroke-width':1.4},g)}
  [y0+14,y0+34,y0+58].forEach(function(y){if(y<bottom)rk('path',{d:'M0,'+y+'H'+RS.W,stroke:'rgba(0,0,0,.08)','stroke-width':1.4},g)});
  rk('rect',{x:0,y:y0-8,width:RS.W,height:8,fill:'#cfcabb'},g);/* 걸레받이 */
  rk('rect',{x:0,y:y0-8,width:RS.W,height:1.5,fill:'rgba(255,255,255,.5)'},g);
  return g;
}
