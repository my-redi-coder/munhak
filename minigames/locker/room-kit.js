/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 라커룸 그림 도구 (2026-11-05, 패치 Y) =================
   라커룸 한 장면을 이루는 작은 그림 부품 모음. 장면에 놓는 일은 room-scene.js, 누르기는 room.js.
   rk(태그, 속성, 부모)      SVG 조각 하나 만들어 부모에 붙임
   rkText(부모, x, y, 글, 속성)  글자 하나
   rkJersey(부모, x, y, 옵션)   옷걸이에 걸린 유니폼. side 'front'(배에 L) / 'back'(등판 이름·번호)
   rkCap(부모, x, y)           빨간 모자(앞에 L)
   rkGlove(부모, x, y, 크기, 숫자)  금 글러브(손바닥에 숫자)
   rkTicket(부모, x, y, 각도, 색, 크기)   게시판에 꽂힌 티켓(기본 38×20)
   rkBall(부모, x, y, 반지름)    공 하나(남색 실밥)
   rkGlass(부모, x, y, 크기)     유리 케이스에 든 기념구(x,y = 받침 아래 가운데)
   rkSparkle(부모, x, y, 늦춤초) 귀퉁이 ✦ 반짝(들어올 때 두 번, 누르는 곳 알려 주기)
   rkDiary(부모, x, y, 크기, 소실점)  선반에 누워 있는 두꺼운 으쓱이 다이어리(표지 '2026 DIARY' · 책등 · 책갈피 끈 둘). 라커룸 소실점에 맞춰 윗면·앞면·책등면이 보여요 (2026-11-07, 묶음 AA)
   ※ 색은 모두 이 장면 안에서만 써요(다크 모드와 상관없이 밝은 라커룸). */
var RK_NS='http://www.w3.org/2000/svg';
var RK_FONT='"Black Han Sans","Gowun Dodum",sans-serif';
function rk(tag,attrs,parent){
  var e=document.createElementNS(RK_NS,tag);
  if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);
  if(parent)parent.appendChild(e);
  return e;
}
function rkText(parent,x,y,str,attrs){
  var t=rk('text',{x:x,y:y},parent);
  if(attrs)for(var k in attrs)t.setAttribute(k,attrs[k]);
  t.textContent=str;return t;
}
/* 굵은 슬랩체 L(배·모자 앞). 가운데가 (0,0), 높이 약 26 */
var RK_L='M-9,-13H5V-9H2V5H9V1H13V13H-9V9H-6V-9H-9Z';
/* 이름 길이에 맞춘 글자 크기 */
function rkFit(len,max,room){return Math.max(6,Math.min(max,room/Math.max(1,len)))}

function rkJersey(parent,x,y,o){
  var g=rk('g',{transform:'translate('+x+','+y+') scale('+(o.s||1)+')'},parent),front=o.side==='front';
  /* 옷걸이 */
  rk('path',{d:'M-22,2L0,-9L22,2',fill:'none',stroke:'#8d939a','stroke-width':2.2,'stroke-linecap':'round','stroke-linejoin':'round'},g);
  rk('path',{d:'M0,-9V-12',stroke:'#8d939a','stroke-width':2.2,'stroke-linecap':'round'},g);
  /* 몸통 + 소매 */
  var neck=front?13:6;
  rk('path',{d:'M-17,0L-32,10L-28,34L-19,30V118H19V30L28,34L32,10L17,0Q0,'+neck+' -17,0Z',fill:'#f7f5ee',stroke:'#c9c3b2','stroke-width':1.1,'stroke-linejoin':'round'},g);
  /* 소매 끝 빨간 줄 */
  /* 소매 끝(바깥 모서리)을 따라 붙는 빨간 줄 */
  rk('path',{d:'M-32,10L-28,34L-24.9,33.5L-28.9,9.5ZM32,10L28,34L24.9,33.5L28.9,9.5Z',fill:'#c8102e'},g);
  /* 옷깃 */
  rk('path',{d:'M-17,0Q0,'+neck+' 17,0',fill:'none',stroke:'#c8102e','stroke-width':1.6},g);
  if(front){
    rk('path',{d:RK_L,transform:'translate(0,58) scale(1.1)',fill:'#c8102e'},g);
  }else{
    var name=o.name||'',num=(o.num===undefined||o.num===null)?'':String(o.num);
    if(name)rkText(g,0,44,name,{'text-anchor':'middle','font-size':rkFit(name.length,10.5,38),fill:'#c8102e',style:'font-family:'+RK_FONT});
    if(num)rkText(g,0,name?84:70,num,{'text-anchor':'middle','font-size':num.length>1?30:36,fill:'#c8102e',style:'font-family:'+RK_FONT});
  }
  /* 아랫단 */
  rk('path',{d:'M-19,114H19',stroke:'#e3dfd1','stroke-width':1.4},g);
  return g;
}
function rkCap(parent,x,y){
  var g=rk('g',{transform:'translate('+x+','+y+')'},parent);
  rk('path',{d:'M-14,0Q-14,-15 0,-15Q14,-15 14,0Z',fill:'#c8102e'},g);
  rk('path',{d:'M-14,0H22Q24,3 20,4H-14Z',fill:'#a30d25'},g);
  rk('path',{d:RK_L,transform:'translate(0,-6.5) scale(.36)',fill:'#fff'},g);
  rk('circle',{cx:0,cy:-15,r:1.4,fill:'#a30d25'},g);
  return g;
}
var RK_GLOVE_N=0;
function rkGlove(parent,x,y,s,num){
  var id='rkgold'+(++RK_GLOVE_N),g=rk('g',{transform:'translate('+x+','+y+') scale('+s+')'},parent);
  var defs=rk('defs',null,g),lg=rk('linearGradient',{id:id,x1:0,y1:0,x2:1,y2:1},defs);
  rk('stop',{offset:0,'stop-color':'#FFF0B0'},lg);rk('stop',{offset:.55,'stop-color':'#E2B44A'},lg);rk('stop',{offset:1,'stop-color':'#A8761F'},lg);
  var f=rk('g',{fill:'url(#'+id+')',stroke:'#8a5a12','stroke-width':.7},g);
  rk('ellipse',{cx:11.6,cy:9,rx:2.4,ry:5.6,transform:'rotate(-8 11.6 9)'},f);
  rk('ellipse',{cx:15.6,cy:8,rx:2.4,ry:6},f);
  rk('ellipse',{cx:19.6,cy:8.6,rx:2.4,ry:5.8,transform:'rotate(6 19.6 8.6)'},f);
  rk('ellipse',{cx:23.2,cy:10.4,rx:2.2,ry:5,transform:'rotate(14 23.2 10.4)'},f);
  rk('ellipse',{cx:6.6,cy:16.4,rx:2.6,ry:5.6,transform:'rotate(-40 6.6 16.4)'},f);
  rk('ellipse',{cx:16,cy:18,rx:9.6,ry:8.4},f);
  rk('ellipse',{cx:16,cy:17.4,rx:5.8,ry:4.9,fill:'#B8862B'},g);
  rk('ellipse',{cx:16,cy:18,rx:8,ry:7,fill:'none',stroke:'#FFF7D6','stroke-width':1,'stroke-dasharray':'1.6 1.6'},g);
  if(num!==undefined&&num!==null)rkText(g,16,21.4,String(num),{'text-anchor':'middle','font-size':9.2,fill:'#5a3a05',style:'font-family:'+RK_FONT});
  return g;
}
function rkTicket(parent,x,y,rot,band,sc){
  var g=rk('g',{transform:'translate('+x+','+y+') rotate('+rot+') scale('+(sc||1)+')'},parent);
  rk('rect',{x:0,y:0,width:38,height:20,rx:2,fill:'#fbf3df',stroke:'#d8c9a6','stroke-width':.8},g);
  rk('rect',{x:0,y:0,width:7,height:20,rx:2,fill:band},g);
  rk('path',{d:'M29,1V19',stroke:'#cdbf9c','stroke-width':.8,'stroke-dasharray':'1.6 1.6'},g);
  rk('path',{d:'M11,6H25M11,10H22M11,14H25',stroke:'#b9ad8e','stroke-width':1.2,'stroke-linecap':'round'},g);
  rk('circle',{cx:33.4,cy:10,r:2.6,fill:'none',stroke:'#c8102e','stroke-width':1},g);
  rk('circle',{cx:19,cy:-1.5,r:2.2,fill:'#c8102e'},g);/* 핀 */
  rk('circle',{cx:18.4,cy:-2.1,r:.7,fill:'#ff9aa8'},g);
  return g;
}
function rkBall(parent,x,y,r){
  var g=rk('g',{transform:'translate('+x+','+y+')'},parent);
  rk('circle',{r:r,fill:'#fbfaf4',stroke:'#cfcabb','stroke-width':.8},g);
  rk('path',{d:'M'+(-r*.62)+','+(-r*.7)+'Q'+(-r*.1)+',0 '+(-r*.62)+','+(r*.7)+'M'+(r*.62)+','+(-r*.7)+'Q'+(r*.1)+',0 '+(r*.62)+','+(r*.7),fill:'none',stroke:'#22306b','stroke-width':1.1,'stroke-linecap':'round'},g);
  return g;
}

/* ✦ 반짝: 처음 들어왔을 때 누를 수 있는 곳 귀퉁이에서 두 번(모양은 CSS .rm-glint, room.css) */
function rkSparkle(parent,x,y,delay){
  var g=rk('g',{transform:'translate('+x+','+y+')','pointer-events':'none','aria-hidden':'true'},parent);
  var s=rk('path',{class:'rm-glint',d:'M0,-8C1.2,-2.6 2.6,-1.2 8,0C2.6,1.2 1.2,2.6 0,8C-1.2,2.6 -2.6,1.2 -8,0C-2.6,-1.2 -1.2,-2.6 0,-8Z',fill:'#f6cf55',stroke:'#fff',
    'stroke-width':1.3,'stroke-linejoin':'round'},g);
  s.style.animationDelay=(delay||0)+'s';
  return g;
}

/* 유리 케이스 속 기념구: 앞면·윗면·옆면이 보이는 작은 상자 + 나무 받침 + 금색 명패. 높이 약 46 */
function rkGlass(parent,x,y,sc){
  var g=rk('g',{transform:'translate('+x+','+y+') scale('+(sc||1)+')'},parent);
  rk('rect',{x:-23,y:-7,width:46,height:7,rx:1.5,fill:'#5d4330'},g);
  rk('rect',{x:-23,y:-7,width:46,height:1.6,fill:'#8a6a4a'},g);
  rk('rect',{x:-6,y:-4.6,width:12,height:2.6,rx:.8,fill:'#e2b44a'},g);
  rk('path',{d:'M-20,-7V-41L-14,-46H26V-12L20,-7Z',fill:'rgba(205,228,242,.28)'},g);
  rk('path',{d:'M-20,-41L-14,-46H26L20,-41Z',fill:'rgba(255,255,255,.55)'},g);
  rk('path',{d:'M20,-41L26,-46V-12L20,-7Z',fill:'rgba(120,160,190,.3)'},g);
  rkBall(g,0,-24,12.5);
  rk('rect',{x:-20,y:-41,width:40,height:34,fill:'none',stroke:'rgba(255,255,255,.85)','stroke-width':1},g);
  rk('path',{d:'M-15,-37L-6,-37L-14,-14L-15,-14Z',fill:'rgba(255,255,255,.55)'},g);
  rk('path',{d:'M-3,-37L0,-37L-8,-16L-10,-16Z',fill:'rgba(255,255,255,.35)'},g);
  return g;
}

/* 두꺼운 으쓱이 다이어리: 선반에 누워 있는 두꺼운 책. 라커룸의 소실점(vp)에 맞춰 윗면(표지)·앞면(쪽 옆면)·왼쪽 끝면(책등)이 보여요.
   x,y = 책 앞면 바닥 가운데, sc = 크기, vp = 장면 소실점[x,y]. 길이 58 · 두께 14 · 깊이는 소실점 쪽으로 줄어듦.
   표지: 빨강 + 이름표('2026 DIARY') + 작은 금색 별. 책등: 볼록한 띠 네 줄 + 'DIARY'. 쪽은 표지보다 살짝 안쪽. 책갈피 끈 둘이 앞 바닥으로 */
function rkDiary(parent,x,y,sc,vp){
  var g=rk('g',{transform:'translate('+x+','+y+') scale('+sc+')'},parent),O='#6b3a2a',L=58,H=14,D=38,K=.8;
  var Vx=(vp[0]-x)/sc,Vy=(vp[1]-y)/sc;
  function B(p){return [Vx+(p[0]-Vx)*K,Vy+(p[1]-Vy)*K]}
  function lerp(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
  function fmt(n){return n.toFixed(3)}
  function poly(pts,fill,sw){return rk('polygon',{points:pts.map(function(p){return p[0].toFixed(2)+','+p[1].toFixed(2)}).join(' '),fill:fill,stroke:O,'stroke-width':sw==null?1.1:sw,'stroke-linejoin':'round'},g)}
  var FL=[-L/2,0],FR=[L/2,0],TL=[-L/2,-H],TR=[L/2,-H],BBL=B(FL),BTL=B(TL),BTR=B(TR),BBR=B(FR);
  /* ---- 왼쪽 끝면 = 책등 ---- */
  poly([FL,BBL,BTL,TL],'#a8132a');
  poly([lerp(FL,TL,.62),lerp(BBL,BTL,.62),lerp(BBL,BTL,.9),lerp(FL,TL,.9)],'rgba(255,255,255,.13)',0);   /* 볼록한 느낌의 빛 */
  [.1,.3,.7,.9].forEach(function(t){var p=lerp(FL,BBL,t),q=lerp(TL,BTL,t);   /* 책등 띠: 깊이 방향 위치 t */
    rk('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:(t===.3||t===.7)?'#E8B923':'#7a0f20','stroke-width':(t===.3||t===.7)?1.1:1.6},g)});
  var sp=rk('g',{transform:'matrix('+[(BTL[0]-TL[0])/D,(BTL[1]-TL[1])/D,(FL[0]-TL[0])/H,(FL[1]-TL[1])/H,TL[0],TL[1]].map(fmt).join(',')+')'},g);
  rk('rect',{x:13,y:H*.2,width:12,height:H*.6,rx:1,fill:'#fbf4de',stroke:'#7a0f20','stroke-width':.5},sp);
  var st=rk('text',{x:19,y:H*.5+1.2,'font-size':3.6,'text-anchor':'middle',fill:'#a8132a','font-family':RK_FONT},sp);st.textContent='DIARY';
  /* ---- 윗면 = 앞표지 ---- */
  poly([TL,TR,BTR,BTL],'#b3192f');
  var u=[(TR[0]-TL[0])/L,(TR[1]-TL[1])/L],v=[(TL[0]-BTL[0])/D,(TL[1]-BTL[1])/D];
  var art=rk('g',{transform:'matrix('+[u[0],u[1],v[0],v[1],BTL[0],BTL[1]].map(fmt).join(',')+')'},g);
  rk('rect',{x:3,y:3,width:L-6,height:D-6,rx:2,fill:'none',stroke:'rgba(255,225,160,.55)','stroke-width':.8},art);   /* 표지 안쪽 가는 테두리 */
  rk('rect',{x:11,y:10,width:36,height:19,rx:3,fill:'#fbf4de',stroke:O,'stroke-width':.9},art);
  var t1=rk('text',{x:29,y:21.2,'font-size':9.6,'text-anchor':'middle',fill:'#b3192f','font-family':RK_FONT},art);t1.textContent='2026';
  var t2=rk('text',{x:29,y:26.6,'font-size':4.6,'text-anchor':'middle',fill:'#14233D','font-family':RK_FONT,'letter-spacing':1.2},art);t2.textContent='DIARY';
  rk('polygon',{points:'49,26 50.2,29.2 53.6,29.4 50.9,31.5 51.8,34.8 49,32.9 46.2,34.8 47.1,31.5 44.4,29.4 47.8,29.2',fill:'#E8B923',stroke:O,'stroke-width':.5},art);
  /* ---- 앞면: 아래 표지 · 쪽(표지보다 살짝 안쪽) · 위 표지 ---- */
  var cv=[[0,.17,'#8c1024'],[.83,1,'#a8132a']];
  cv.forEach(function(bd){var y0=-H*bd[0],y1=-H*bd[1];poly([[-L/2,y0],[L/2,y0],[L/2,y1],[-L/2,y1]],bd[2])});
  poly([[-L/2,-H*.17],[L/2-2.2,-H*.17],[L/2-2.2,-H*.83],[-L/2,-H*.83]],'#f4ecd6');
  [.34,.5,.66].forEach(function(t){rk('line',{x1:-L/2+1,y1:-H*t,x2:L/2-3.4,y2:-H*t,stroke:'#d4c8a8','stroke-width':.7},g)});
  /* ---- 책갈피 끈(노랑·청록)이 앞 바닥으로 ---- */
  [[-17,'#E8B923'],[-11,'#2fb5a3']].forEach(function(r){rk('polygon',{points:(r[0])+',-5 '+(r[0]+4)+',-5 '+(r[0]+5)+',7 '+(r[0]+2)+',4.4 '+(r[0]-1)+',7',fill:r[1],stroke:O,'stroke-width':.6,'stroke-linejoin':'round'},g)});
  return g;
}
