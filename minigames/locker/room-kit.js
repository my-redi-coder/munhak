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
