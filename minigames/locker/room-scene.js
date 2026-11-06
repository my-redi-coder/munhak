/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 라커룸 장면 놓기 (2026-11-05, 패치 Y · 입체 구도) =================
   그림 400 × 600 한 장(SVG). 내 라커 앞에 서서 정면에서 본 방. 소실점 RS.VP(눈높이)로 모든 칸이 안쪽으로 깊어져요(도구는 room-box.js, 부품은 room-kit.js).
     왼쪽: 긴 내 라커(빨간 틀 + 번호판 + 열린 칸, 유니폼 두 벌만 걸림, 아래 흰 서랍) = 카드 앨범
     오른쪽 위: 열린 찬장 — 안쪽 벽이 코르크, 티켓 두 장이 도드라지고 나머지(작은 일정표·메모)는 눈에 안 띄는 디테일 = 티켓북
     오른쪽 아래: 선반 4칸 — 맨 위 칸에 유리 케이스 속 기념구 + 금 글러브 자리(퍼펙트 한 번이라도 하면 옆에 놓이고, 글러브엔 퍼펙트 횟수 1~12가 박힘) = 공박스, 두 번째 칸에 누워 있는 두꺼운 으쓱이 다이어리 = 으쓱이 다이어리(packing.html#diary, 2026-11-07 묶음 AA), 아래 두 칸은 비워 둠(나중에 더할 곳)
   누르는 곳은 data-go 가 붙은 그룹(.hot): cards · balls · tickets (✦ 반짝 자리는 data-spark="x,y": 유니폼 소매 · 티켓 모서리)
   st = roomState()(room.js): name·num(입장 준비에서 정한 등판), perfect, 숫자들
   ★ 나중에 더할 때: 선반 칸 위치 RS.tiers, 글러브·유리 케이스 놓는 자리 RS.topShelf */
var RS={W:400,H:600,wall:'#e9e5da',red:'#c8102e',VP:[212,300],floorY:548,
  lockerFrame:[12,38,196,510],lockerOpen:[22,84,176,386],
  cabFrame:[214,62,178,214],cabOpen:[222,70,162,198],
  shelfFrame:[214,282,178,266],tiers:[[288,76],[370,54],[430,54],[490,54]],
  topShelf:{ballFx:.3,gloveFx:.7,d:.3},plate:{mine:'으쓱이'}};

function roomDefs(svg){
  var d=rk('defs',null,svg),g;
  g=rk('linearGradient',{id:'rmFloor',x1:0,y1:0,x2:0,y2:1},d);
  rk('stop',{offset:0,'stop-color':'#707780'},g);rk('stop',{offset:1,'stop-color':'#555c64'},g);
  g=rk('linearGradient',{id:'rmWall',x1:0,y1:0,x2:0,y2:1},d);
  rk('stop',{offset:0,'stop-color':'#f1eee5'},g);rk('stop',{offset:1,'stop-color':'#e1ddd0'},g);
  g=rk('radialGradient',{id:'rmVig',cx:.5,cy:.45,r:.78},d);
  rk('stop',{offset:.55,'stop-color':'#000','stop-opacity':0},g);rk('stop',{offset:1,'stop-color':'#000','stop-opacity':.2},g);
  g=rk('linearGradient',{id:'rmLight',x1:0,y1:0,x2:0,y2:1},d);
  rk('stop',{offset:0,'stop-color':'#fff6cf','stop-opacity':.7},g);rk('stop',{offset:.6,'stop-color':'#fff6cf','stop-opacity':0},g);
  g=rk('pattern',{id:'rmCork',width:7,height:7,patternUnits:'userSpaceOnUse'},d);
  rk('rect',{width:7,height:7,fill:'#cfa66d'},g);
  rk('circle',{cx:1.6,cy:2,r:.9,fill:'#b98c55'},g);rk('circle',{cx:5.2,cy:5,r:.8,fill:'#dfba84'},g);rk('circle',{cx:4.6,cy:1,r:.6,fill:'#b98c55'},g);
  g=rk('filter',{id:'rmDrop',x:'-20%',y:'-20%',width:'150%',height:'150%'},d);
  rk('feDropShadow',{dx:3.5,dy:4,stdDeviation:2.6,'flood-color':'#2a2418','flood-opacity':.3},g);
  g=rk('filter',{id:'rmDropS',x:'-20%',y:'-20%',width:'150%',height:'150%'},d);
  rk('feDropShadow',{dx:1.4,dy:2,stdDeviation:1.4,'flood-color':'#2a2418','flood-opacity':.35},g);
}
function roomHit(parent,c){rk('rect',{x:c[0],y:c[1],width:c[2],height:c[3],fill:'#000','fill-opacity':0,'pointer-events':'all'},parent)}

/* 벽 + 천장 조명 + 바닥 */
function roomRoom(svg){
  rk('rect',{x:0,y:0,width:RS.W,height:RS.floorY,fill:'url(#rmWall)'},svg);
  rk('rect',{x:0,y:0,width:RS.W,height:12,fill:'#d6d2c5'},svg);
  rk('rect',{x:40,y:3,width:320,height:5,rx:2.5,fill:'#fffdf2'},svg);
  rk('rect',{x:0,y:12,width:RS.W,height:130,fill:'url(#rmLight)'},svg);
  rbFloor(svg,RS.floorY,RS.H);
  /* 가구가 바닥에 닿는 그림자 */
  rk('ellipse',{cx:110,cy:RS.floorY+4,rx:108,ry:7,fill:'rgba(0,0,0,.28)'},svg);
  rk('ellipse',{cx:303,cy:RS.floorY+4,rx:96,ry:6,fill:'rgba(0,0,0,.26)'},svg);
}

/* 위쪽 빨간 띠: 왼쪽 라커 번호판 띠가 오른쪽 끝까지 이어져요(실제 라커룸 번호판 띠처럼) */
function roomTopBand(svg){
  rk('rect',{x:RS.lockerFrame[0]+RS.lockerFrame[2]-4,y:38,width:392-(RS.lockerFrame[0]+RS.lockerFrame[2]-4),height:26,fill:RS.red},svg);
  rk('rect',{x:RS.lockerFrame[0]+RS.lockerFrame[2]-4,y:38,width:392-(RS.lockerFrame[0]+RS.lockerFrame[2]-4),height:1.6,fill:'rgba(255,255,255,.55)'},svg);
  rk('rect',{x:RS.lockerFrame[0]+RS.lockerFrame[2]-4,y:62,width:392-(RS.lockerFrame[0]+RS.lockerFrame[2]-4),height:2,fill:'rgba(0,0,0,.18)'},svg);
}

/* 왼쪽: 긴 내 라커 */
function roomLocker(svg,st){
  var f=RS.lockerFrame,o=RS.lockerOpen;
  var bx=rbBox(svg,o,{k:.8,back:'#f4f1e6',wl:'#d9d5c5',wr:'#e6e2d3',top:'#ece8d9',bot:'#cdc9b9'});
  rk('rect',{x:bx.B[0],y:bx.B[1],width:bx.B[2],height:bx.B[3]/2,fill:'url(#rmLight)'},bx.g);
  /* 옷봉: 안쪽 한가운데 깊이에 가로로 */
  var a=bx.at(.5,-.1,.07),b=bx.at(.5,1.1,.07);
  rk('path',{d:'M'+a.x+','+(a.y+2.5)+'L'+b.x+','+(b.y+2.5),stroke:'rgba(0,0,0,.2)','stroke-width':4,'stroke-linecap':'round'},bx.g);
  rk('path',{d:'M'+a.x+','+a.y+'L'+b.x+','+b.y,stroke:'#b4b9be','stroke-width':3.6,'stroke-linecap':'round'},bx.g);
  rk('path',{d:'M'+a.x+','+(a.y-1)+'L'+b.x+','+(b.y-1),stroke:'#e6e9ec','stroke-width':1.2,'stroke-linecap':'round'},bx.g);
  /* 유니폼 두 벌(앞면 L / 내 등판) — 옷봉 아래에 */
  var p1=bx.at(.5,.27,.07),p2=bx.at(.5,.74,.07),s=p1.s*1.12;
  var g=rk('g',{class:'hot','data-go':'cards',tabindex:0,role:'button','aria-label':'카드 앨범, 선수 카드 '+st.cards+'장'},svg);
  var jg=rk('g',{filter:'url(#rmDrop)'},g);
  rkJersey(jg,p1.x,p1.y+12*s,{side:'front',s:s});
  rkJersey(jg,p2.x,p2.y+12*s,{side:'back',name:st.name,num:st.num,s:s});
  /* 열린 면 안으로만 보이게 */
  var cid='rbj';var cp=rk('clipPath',{id:cid},svg.querySelector('defs'));rk('rect',{x:o[0],y:o[1],width:o[2],height:o[3]},cp);
  jg.setAttribute('clip-path','url(#'+cid+')');
  g.setAttribute('data-spark',(p2.x+30*s)+','+(p2.y+12*s+9*s));/* ✦ 반짝 자리: 유니폼 소매 */
  roomHit(g,o);
  /* 앞면 틀(빨강) + 번호판 + 아래 서랍 */
  rbFrame(svg,f,[o],RS.red);
  var t=rkText(svg,f[0]+f[2]/2,68,'',{'text-anchor':'middle',fill:'#fff',style:'font-family:'+RK_FONT}),name=st.name,num=st.num;
  if(name===''&&num==='')name=RS.plate.mine;
  if(num!==''){var n1=rk('tspan',{'font-size':24},t);n1.textContent=num}
  if(name!==''){var n2=rk('tspan',{'font-size':rkFit(name.length,17,num!==''?110:150),dx:num!==''?10:0},t);n2.textContent=name}
  rk('rect',{x:o[0],y:o[1]+o[3],width:o[2],height:68,fill:'#f4f1e7'},svg);
  rk('rect',{x:o[0],y:o[1]+o[3],width:o[2],height:3,fill:'rgba(0,0,0,.18)'},svg);
  rk('path',{d:'M'+o[0]+','+(o[1]+o[3]+34)+'H'+(o[0]+o[2]),stroke:'rgba(0,0,0,.14)','stroke-width':1.5},svg);
  [o[1]+o[3]+17,o[1]+o[3]+51].forEach(function(y){rk('rect',{x:o[0]+o[2]/2-15,y:y-2.5,width:30,height:5,rx:2.5,fill:'#9aa0a6'},svg)});
}

/* 오른쪽 위: 열린 찬장 — 코르크 벽에 티켓 두 장 */
function roomCabinet(svg){
  var f=RS.cabFrame,o=RS.cabOpen;
  var bx=rbBox(svg,o,{k:.84,back:'url(#rmCork)',wl:'#a98355',wr:'#a98355',top:'#86653f',bot:'#c49b64'});
  var B=bx.B,g=rk('g',{class:'hot','data-go':'tickets',tabindex:0,role:'button','aria-label':'티켓북'},svg);
  var cg=rk('g',null,g);
  var cid='rbk';var cp=rk('clipPath',{id:cid},svg.querySelector('defs'));rk('rect',{x:o[0],y:o[1],width:o[2],height:o[3]},cp);cg.setAttribute('clip-path','url(#'+cid+')');
  /* 눈에 안 띄는 가벼운 디테일: 작은 일정표(회색 톤)·메모·핀 */
  var sx=B[0]+B[2]-34,sy=B[1]+12;
  var dim=rk('g',{opacity:.78,filter:'url(#rmDropS)'},cg);
  rk('rect',{x:sx,y:sy,width:22,height:27,fill:'#f2f2ee',stroke:'#d4d2c8','stroke-width':.6,transform:'rotate(2 '+(sx+11)+' '+(sy+13)+')'},dim);
  rk('rect',{x:sx,y:sy,width:22,height:5,fill:'#b8b8b0',transform:'rotate(2 '+(sx+11)+' '+(sy+13)+')'},dim);
  for(var r=0;r<3;r++)rk('path',{d:'M'+(sx+3)+','+(sy+11+r*5)+'H'+(sx+19),stroke:'#cfcdc3','stroke-width':1.2,transform:'rotate(2 '+(sx+11)+' '+(sy+13)+')'},dim);
  rk('rect',{x:B[0]+10,y:B[1]+14,width:15,height:15,fill:'#f3e7a8',transform:'rotate(-8 '+(B[0]+17)+' '+(B[1]+21)+')'},dim);
  rk('path',{d:'M'+(B[0]+13)+','+(B[1]+20)+'H'+(B[0]+23),stroke:'#cdbf75','stroke-width':1.1,transform:'rotate(-8 '+(B[0]+17)+' '+(B[1]+21)+')'},dim);
  rk('circle',{cx:sx+11,cy:sy+1,r:2,fill:'#8aa0b8'},dim);rk('circle',{cx:B[0]+17,cy:B[1]+15,r:2,fill:'#b78a8a'},dim);
  /* 주인공: 티켓 두 장 */
  var tg=rk('g',{filter:'url(#rmDrop)'},cg);
  rkTicket(tg,B[0]+B[2]*.1,B[1]+B[3]*.3,-6,'#c8102e',1.55);
  rkTicket(tg,B[0]+B[2]*.36,B[1]+B[3]*.62,5,'#1f3a6b',1.55);
  g.setAttribute('data-spark',(B[0]+B[2]*.1+56)+','+(B[1]+B[3]*.3+2));/* ✦ 반짝 자리: 티켓 모서리 */
  roomHit(g,o);
  rbFrame(svg,f,[o],'#f3efe4');
}

/* 오른쪽 아래: 선반 4칸 — 맨 위에 유리 케이스 속 기념구 + 금 글러브 자리 */
function roomShelves(svg,st){
  var f=RS.shelfFrame,holes=[],boxes=[],x0=222,w=162;
  RS.tiers.forEach(function(t){holes.push([x0,t[0],w,t[1]])});
  holes.forEach(function(h){boxes.push(rbBox(svg,h,{k:.84,back:'#ead9b8',wl:'#c7aa7e',wr:'#bda073',top:'#c4a87c',bot:'#dbc59b'}))});
  /* 맨 위 칸 물건 */
  var bx=boxes[0],T=RS.topShelf,pb=bx.at(T.d,T.ballFx,1),pg=bx.at(T.d,T.gloveFx,1);
  rk('ellipse',{cx:pb.x,cy:pb.y-1,rx:25*pb.s,ry:4,fill:'rgba(0,0,0,.2)'},bx.g);
  var gb=rk('g',{class:'hot','data-go':'balls',tabindex:0,role:'button','aria-label':'공박스, 홈런볼 '+st.balls+'개'},svg);
  var gf=rk('g',{filter:'url(#rmDrop)'},gb);
  rkGlass(gf,pb.x,pb.y,.95*pb.s);
  rk('rect',{x:pb.x-26,y:pb.y-52,width:52,height:54,fill:'#000','fill-opacity':0,'pointer-events':'all'},gb);
  if(st.perfect>0){
    rk('ellipse',{cx:pg.x,cy:pg.y-1,rx:16*pg.s,ry:3.5,fill:'rgba(0,0,0,.2)'},bx.g);
    var g2=rk('g',{class:'hot','data-go':'balls',tabindex:0,role:'button','aria-label':'금 글러브 '+Math.min(st.perfect,12)+', 퍼펙트 '+st.perfect+'회'},svg);
    var g2s=rk('g',{filter:'url(#rmDropS)'},g2);
    rkGlove(g2s,pg.x-15,pg.y-25,.95*pg.s,Math.min(st.perfect,12));/* 글러브 숫자 = 퍼펙트 횟수(1~12, 12가 넘어도 12) */
    rk('rect',{x:pg.x-19,y:pg.y-32,width:38,height:35,fill:'#000','fill-opacity':0,'pointer-events':'all'},g2);
  }
  /* 두 번째 칸(공 아래): 누워 있는 두꺼운 으쓱이 다이어리 = 으쓱이 다이어리(달력). 칸 가운데에 오도록 그린 뒤 폭을 재서 옆으로 밀어요 */
  var b2=boxes[1],pd=b2.at(.26,.46,1);
  var gd=rk('g',{class:'hot','data-go':'diary',tabindex:0,role:'button','aria-label':'으쓱이 다이어리, '+st.diary+'경기'},svg);
  var gdf=rk('g',{filter:'url(#rmDrop)'},gd);
  rkDiary(gdf,pd.x,pd.y,1.0*pd.s,RS.VP);
  var bb=gdf.getBBox(),dx=(x0+w/2)-(bb.x+bb.width/2),cx=bb.x+bb.width/2+dx;
  gdf.setAttribute('transform','translate('+dx+',0)');
  rk('ellipse',{cx:cx,cy:pd.y+1,rx:bb.width*.5,ry:4,fill:'rgba(0,0,0,.24)'},b2.g);
  gd.setAttribute('data-spark',(bb.x+bb.width+dx-8)+','+(bb.y+4));
  rk('rect',{x:bb.x+dx-2,y:bb.y-2,width:bb.width+4,height:bb.height+4,fill:'#000','fill-opacity':0,'pointer-events':'all'},gd);
  rbFrame(svg,f,holes,'#f3efe4');
}

/* 한 장면 만들기 (뒤 → 앞). glint 가 참이면 눌러지는 곳 귀퉁이에 ✦ 가 두 번 반짝(room.js 가 처음 한 번만 켜요) */
function roomBuild(host,st,glint){
  var old=host.querySelector('svg');if(old)host.removeChild(old);/* 이름표(#roomTag)는 남겨 둬요 */
  var svg=rk('svg',{viewBox:'0 0 '+RS.W+' '+RS.H,role:'group','aria-label':'라커룸'},host);
  roomDefs(svg);roomRoom(svg);roomTopBand(svg);roomLocker(svg,st);roomCabinet(svg);roomShelves(svg,st);
  if(glint)svg.querySelectorAll('.hot').forEach(function(h,i){var a=h.getAttribute('data-spark'),x,y;/* data-spark = 반짝 자리(없으면 눌리는 곳 오른쪽 위 귀퉁이) */
    if(a){a=a.split(',');x=+a[0];y=+a[1]}else{var b=h.getBBox();x=b.x+b.width-12;y=b.y+12}
    rkSparkle(svg,x,y,.5+i*.3)});
  return svg;
}
