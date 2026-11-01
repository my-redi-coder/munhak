/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 야푸먹기 =================
   (묶음 B) 테이블 위 수첩 이스터에그는 js/ui/food-note.js
   내 자리 앞 테이블. 배경은 지금 3D 장면을 흐리게 보여주고, 관중 소리는 조금 낮춰 계속 들려요.
   주문 → 상에 차림(같은 음식은 한 접시) → 눌러서 한 입씩(새우4·물회5·홈런볼6) → 빈 그릇은 비닐봉투로.
   기록은 이번 방문 안에서만, 음식별 그릇 수. 맥주는 5번 홀짝 → '한 잔 더'(기록 없음). 짝짝이는 소리. */
var FD={
  shrimp:{name:'크림새우',unit:'컵',bites:4,cx:70,cy:214,snd:'crunch',fx:['바삭','냠','바사삭'],desc:'바삭한 새우에 크림소스 듬뿍'},
  mulhoe:{name:'물회',unit:'그릇',bites:5,cx:180,cy:224,snd:'slurp',fx:['후루룩','시원해','후룩'],desc:'살얼음 동동, 새콤한 한 그릇'},
  hrball:{name:'홈런볼',unit:'봉지',bites:6,cx:290,cy:212,snd:'pop',fx:['쏙','오독','냠'],desc:'한 알씩 쏙쏙'}
};
var FD_KEYS=['shrimp','mulhoe','hrball'],FD_BAG=[334,104];
var FOOD={open:false};
function foodReset(){FOOD.on={};FOOD.leaving={};FOOD.log={shrimp:0,mulhoe:0,hrball:0};FOOD.beer=5;FOOD.bag=0;FOOD.ever=false;FOOD.score=0;FOOD.sel={};FOOD.seat=[Math.floor(rnd(1,26)),Math.floor(rnd(1,31))];FOOD.built=false}
foodReset();
function foodOpen(){return FOOD.open}

/* ---------- 소리 (효과음 채널) ---------- */
function fdTone(t,f0,f1,dur,gain){var c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur+.03);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+dur+.05)}
function fdSnd(k){
  if(!AU.ctx||!AU.on||AU.ctx.state!=='running')return;var c=AU.ctx,t=c.currentTime,d=AU.sfx,i,j,s,f,g;
  if(k==='crunch'){for(i=0;i<4;i++)noiseHit(t+i*.045+Math.random()*.02,.05,'bandpass',2200+Math.random()*1800,1.4,.35,d)}
  else if(k==='pop'){fdTone(t,720,380,.08,.15);noiseHit(t+.08,.04,'bandpass',3200,1.5,.25,d);noiseHit(t+.13,.04,'bandpass',2600,1.5,.2,d)}
  else if(k==='sip'){fdTone(t,250,150,.1,.22);fdTone(t+.16,230,140,.1,.18)}
  else if(k==='clap'){for(j=0;j<2;j++)for(i=0;i<3;i++)noiseHit(t+j*.17+i*.011,.08,'bandpass',1700,.9,.5,d)}
  else if(k==='thunk'){fdTone(t,170,70,.15,.3);noiseHit(t,.03,'lowpass',1800,.7,.2,d)}
  else if(k==='rustle'){for(i=0;i<5;i++)noiseHit(t+i*.05,.06,'highpass',3500,.7,.12,d)}
  else if(k==='slurp'||k==='pour'){
    var L=k==='pour'?.75:.42;s=c.createBufferSource();s.buffer=AU.white;s.loop=true;f=c.createBiquadFilter();g=c.createGain();
    if(k==='slurp'){f.type='bandpass';f.Q.value=4;f.frequency.setValueAtTime(500,t);f.frequency.exponentialRampToValueAtTime(2400,t+.38)}
    else{f.type='lowpass';f.Q.value=.8;f.frequency.setValueAtTime(700,t);f.frequency.linearRampToValueAtTime(1300,t+L)}
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(k==='pour'?.22:.32,t+.06);g.gain.exponentialRampToValueAtTime(.001,t+L);
    s.connect(f);f.connect(g);g.connect(d);s.start(t);s.stop(t+L+.03);
  }
}

/* ---------- 그림 ---------- */
function fdDish(k,r){
  var o='',i,P,f;
  if(k==='shrimp'){
    o='<path d="M-34-4L-27 40L27 40L34-4Z" fill="#fbf7ef" stroke="#d8cfbd"/><path d="M-31.5 12H31.5M-29.6 26H29.6" stroke="#c8102e" stroke-width="5" opacity=".85"/><ellipse cy="-4" rx="34" ry="11" fill="#efe2c6" stroke="#d8cfbd"/>';
    if(r<4)o+='<path d="M-15-6q8-4 16 0t10-2" stroke="#f6ead2" stroke-width="3" fill="none" stroke-linecap="round"/>';
    P=[[-15,-11,-20],[9,-15,15],[-3,-4,-5],[16,-4,30]];
    for(i=0;i<r;i++)o+='<g transform="translate('+P[i][0]+' '+P[i][1]+') rotate('+P[i][2]+')"><ellipse rx="12" ry="7.5" fill="#e9a64e" stroke="#c98535" stroke-width=".8"/><path d="M11-1L19-6L18 4Z" fill="#e2603e"/><path d="M-9-2q4-5 8 0t8 0" stroke="#fff6e3" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>';
  }else if(k==='mulhoe'){
    f=.45+.55*r/5;
    o='<path d="M-42-2Q-38 34 0 36Q38 34 42-2Z" fill="#e8e3d6" stroke="#cfc8b6"/><path d="M-30 18Q0 30 30 18" stroke="#6f9fc7" stroke-width="2" fill="none" opacity=".7"/><ellipse cy="-2" rx="42" ry="15" fill="#f6f3ec" stroke="#cfc8b6"/>';
    if(r>0){o+='<ellipse cy="'+(-1+(1-r/5)*3)+'" rx="'+(34*f)+'" ry="'+(11*f)+'" fill="#de5536" opacity=".9"/>';
      var T=[['i',-14,-4],['s',8,-6],['c',-2,2],['p',16,0],['i',2,-8],['s',-10,3],['c',12,-9],['i',-20,1],['p',-6,-9],['s',20,-3]];
      for(i=0;i<r*2;i++){var x=T[i][1]*f,y=T[i][2]*f-1,ty=T[i][0];
        if(ty==='i')o+='<rect x="'+(x-3.5)+'" y="'+(y-3.5)+'" width="7" height="7" rx="1.5" fill="#eaf6fb" stroke="#bfdbe6" opacity=".9" transform="rotate(15 '+x+' '+y+')"/>';
        else if(ty==='s')o+='<ellipse cx="'+x+'" cy="'+y+'" rx="6" ry="3" fill="#fff3ec" stroke="#f0cbbd" stroke-width=".6"/>';
        else if(ty==='c')o+='<rect x="'+(x-5)+'" y="'+(y-1)+'" width="10" height="2.2" rx="1" fill="#79b257"/>';
        else o+='<rect x="'+(x-4)+'" y="'+(y-1.5)+'" width="8" height="3" rx="1" fill="#f6efc8"/>';}
      o+='<g fill="#f5e6c4"><circle cx="-6" cy="-3" r=".8"/><circle cx="4" cy="1" r=".8"/><circle cx="10" cy="-5" r=".8"/></g>';
    }else o+='<ellipse cy="1" rx="12" ry="4" fill="#de5536" opacity=".35"/>';
  }else{
    o='<rect x="-36" y="-15" width="72" height="14" rx="4" fill="#1f3f78"/>';
    P=[[-22,-9],[0,-11],[22,-9],[-11,-3],[11,-3],[0,-17]];
    for(i=0;i<r;i++)o+='<g transform="translate('+P[i][0]+' '+P[i][1]+')"><circle r="9" fill="#d69b54" stroke="#b67a37" stroke-width=".8"/><ellipse cx="-3" cy="-3.5" rx="3.5" ry="2" fill="#f2c88f"/></g>';
    o+='<path d="M-38-5L-34 32L34 32L38-5Z" fill="#2f5aa0"/><circle cx="0" cy="14" r="8" fill="#fff"/><path d="M-4 8q3 6 0 12M4 8q-3 6 0 12" stroke="#c8102e" stroke-width="1.1" fill="none"/>';
  }
  return o;
}
function fdBeer(){
  var b=FOOD.beer,yL=386-84*b/5,o='<path d="M288 296L340 296L335 388L293 388Z" fill="rgba(255,255,255,.22)"/>';
  if(b>0)o+='<rect x="286" y="'+yL+'" width="56" height="'+(388-yL)+'" fill="url(#fdAmber)" clip-path="url(#fdCup)"/><rect x="286" y="'+(yL-7)+'" width="56" height="9" rx="4" fill="#fffbea" clip-path="url(#fdCup)"/><g fill="#fff" opacity=".6"><circle cx="304" cy="'+(yL+20)+'" r="1.4"/><circle cx="322" cy="'+(yL+34)+'" r="1.1"/></g>';
  o+='<path d="M288 296L340 296L335 388L293 388Z" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1.6"/><path d="M294 304L297 380" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>';
  if(b===0)o+='<rect x="285" y="262" width="58" height="20" rx="10" fill="#c8102e"/><text x="314" y="275.5" font-size="9" fill="#fff" text-anchor="middle">한 잔 더</text>';
  return o;
}
function fdBagSvg(){
  var o='<path d="M312 66q4-16 10 0M336 66q4-16 10 0" stroke="#e8e8e8" stroke-width="2.5" fill="none"/><path d="M308 66L350 66L356 146Q331 152 304 146Z" fill="rgba(255,255,255,.7)" stroke="#dcdcdc"/>',n=Math.min(FOOD.bag,5);
  for(var i=0;i<n;i++)o+='<ellipse cx="'+(320+(i%2)*14)+'" cy="'+(138-i*12)+'" rx="10" ry="5" fill="'+['#f0e6d0','#e8e3d6','#2f5aa0'][i%3]+'" opacity=".55"/>';
  return o;
}
function fdTable(){
  var z=ZONES[curBlock&&ZONES[curBlock.key]?curBlock.key:ME.zone].label,d=new Date(),hm=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);
  return '<defs><linearGradient id="fdWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99c64"/><stop offset="1" stop-color="#a77946"/></linearGradient><linearGradient id="fdAmber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4b73a"/><stop offset="1" stop-color="#d6871c"/></linearGradient><clipPath id="fdCup"><path d="M288 296L340 296L335 388L293 388Z"/></clipPath></defs>'
  +'<path d="M14 6L346 6L360 400L0 400Z" fill="url(#fdWood)"/><path d="M14 6L346 6L347 13L13 13Z" fill="#87602f"/><g stroke="#8d6136" opacity=".35"><path d="M10 112H350M5 222H355M2 318H358"/><path d="M60 40q40 8 80 0M210 160q50 10 100 0M40 270q60-8 110 2" fill="none"/></g>'
  /* 태블릿 중계 */
  +'<path d="M42 130L54 104M126 130L114 104" stroke="#4a4a4a" stroke-width="4" stroke-linecap="round"/><rect x="18" y="14" width="134" height="92" rx="8" fill="#2b2d30"/><rect x="24" y="20" width="122" height="80" rx="3" fill="#3f8a46"/>'
  +'<path d="M85 92L109 70L85 48L61 70Z" fill="#b9824f"/><path d="M85 86L103 70L85 54L67 70Z" fill="#4f9a52"/><circle cx="85" cy="72" r="4" fill="#b9824f"/><g fill="#fff"><rect x="83.5" y="89" width="3" height="3"/><rect x="106" y="68.5" width="3" height="3"/><rect x="83.5" y="46.5" width="3" height="3"/><rect x="61" y="68.5" width="3" height="3"/></g><circle class="fd-ball" cx="85" cy="74" r="1.6" fill="#fff"/>'
  +'<rect x="27" y="23" width="60" height="14" rx="2" fill="rgba(0,0,0,.62)"/><text x="31" y="33" font-size="7.5" fill="#fff">SSG</text><text id="fdScore" x="52" y="33" font-size="7.5" fill="#fff">'+FOOD.score+' : 0</text><text x="71" y="33" font-size="6" fill="#ffd6dc">3회말</text><rect x="118" y="24" width="24" height="10" rx="2" fill="#c8102e"/><text x="130" y="31.5" font-size="6" fill="#fff" text-anchor="middle">LIVE</text>'
  +'<text id="fdCall" x="85" y="62" font-size="12" fill="#fff" text-anchor="middle" opacity="0" style="paint-order:stroke;stroke:rgba(0,0,0,.5);stroke-width:3px"></text>'
  /* 기록지 */
  +'<g transform="translate(166 22) rotate(4)"><rect width="70" height="86" fill="#fbfaf4" stroke="#ddd8c8"/><text x="6" y="11" font-size="6.5" fill="#8a8670">기록지</text><g stroke="#cfc9b4" stroke-width=".6"><path d="M4 16H66M4 25H66M4 34H66M4 43H66M4 52H66M4 61H66M4 70H66M4 79H66M18 16V79M30 16V79M42 16V79M54 16V79"/></g><g font-size="5.5" fill="#c8102e"><text x="20" y="23">1B</text><text x="33" y="32">K</text><text x="44" y="41">BB</text><text x="20" y="50">HR</text></g><path d="M48 76L80 48" stroke="#f1c24a" stroke-width="4.5" stroke-linecap="round"/><path d="M48 76l-3 3" stroke="#444" stroke-width="2" stroke-linecap="round"/></g>'
  +noteSvg()
  /* 핸드폰 */
  +'<g transform="translate(258 28) rotate(-8)"><rect width="48" height="92" rx="8" fill="#1d1e22"/><rect x="3" y="4" width="42" height="84" rx="5" fill="#9cbcd9"/><text id="fdClock" x="24" y="24" font-size="11" fill="#fff" text-anchor="middle">'+hm+'</text><rect x="5" y="36" width="38" height="20" rx="4" fill="rgba(255,255,255,.88)"/><text x="8" y="44" font-size="5.5" fill="#333">옂달</text><text x="8" y="52" font-size="5" fill="#555">새 글 3개</text><rect x="18" y="82" width="12" height="2" rx="1" fill="#fff" opacity=".7"/></g>'
  +'<g id="fdBag">'+fdBagSvg()+'</g>'
  /* 입장권 */
  +'<g transform="translate(150 354) rotate(-6)"><rect x="-50" y="-27" width="100" height="54" rx="3" fill="#fffaf0" stroke="#e0d6c0"/><rect x="-50" y="-27" width="100" height="10" fill="#c8102e"/><text x="-44" y="-19.5" font-size="6.5" fill="#fff">문학 · 1루 입장권</text><text x="-44" y="-3" font-size="10" fill="#3a3a30">'+z+'</text><text x="-44" y="9" font-size="7" fill="#3a3a30">'+FOOD.seat[0]+'열 '+FOOD.seat[1]+'번</text><text x="-44" y="20" font-size="5.5" fill="#8a8670">봄날 경기</text><path d="M26-17V27" stroke="#cfc4aa" stroke-dasharray="2 2"/><g stroke="#3a3a30" stroke-width=".9"><path d="M32-12V20M35-12V20M37-12V20M41-12V20M44-12V20"/></g></g>'
  /* 물티슈·휴지 */
  +'<g transform="translate(234 356)"><rect x="-24" y="-18" width="48" height="34" rx="7" fill="#f7f9fb" stroke="#d7dde3"/><rect x="-24" y="-6" width="48" height="10" fill="#6aa6d6"/><text y="1.5" font-size="6.5" fill="#fff" text-anchor="middle">물티슈</text></g><g transform="translate(262 322)"><circle r="9" fill="#fff" stroke="#e2e2e2"/><path d="M-5-2q3 3 6-1t4 3M-3 4q3-2 6 1" stroke="#e2e2e2" fill="none"/></g>'
  /* 짝짝이 */
  +'<g transform="translate(50 344)"><g class="fd-clap fd-tap" id="fdClap" role="button" tabindex="0" aria-label="짝짝이 치기"><rect x="-26" y="-40" width="30" height="54" rx="14" fill="#c8102e" transform="rotate(-10)"/><rect x="-4" y="-40" width="30" height="54" rx="14" fill="#e23a50" transform="rotate(10)"/><path d="M-14-26v14M-6-28v14M6-28v14M14-26v14" stroke="#fff" stroke-width="1.4" opacity=".5" stroke-linecap="round"/><rect x="-5" y="12" width="10" height="26" rx="3" fill="#8f0c22"/></g></g>'
  +'<g id="fdBeer" class="fd-tap" role="button" tabindex="0">'+fdBeer()+'</g>'
  +'<g id="fdDishes"></g><g id="fdFx"></g>';
}

/* ---------- 동작 ---------- */
function fdFx(x,y,t){var g=$('fdFx');if(!g)return;var e=document.createElementNS('http://www.w3.org/2000/svg','text');e.setAttribute('x',x);e.setAttribute('y',y);e.setAttribute('text-anchor','middle');e.setAttribute('class','fd-fx');e.textContent=t;g.appendChild(e);setTimeout(function(){e.remove()},820)}
function fdBind(el,fn){el.onclick=fn;el.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}}}
function fdAddDish(k,arrive){
  var D=FD[k],o=document.createElementNS('http://www.w3.org/2000/svg','g');o.setAttribute('class','fd-dish');o.setAttribute('transform','translate('+D.cx+' '+D.cy+')');o.id='fdO_'+k;
  o.innerHTML='<g class="fd-tap" role="button" tabindex="0"></g>';var g=o.firstChild;$('fdDishes').appendChild(o);fdPaint(k);
  fdBind(g,function(){fdEat(k)});
  if(arrive){g.style.transform='translate(0px,-80px)';g.style.opacity='0';requestAnimationFrame(function(){requestAnimationFrame(function(){g.style.transform='';g.style.opacity=''})})}
}
function fdPaint(k){var o=$('fdO_'+k);if(!o)return;var g=o.firstChild,r=FOOD.on[k];g.innerHTML=fdDish(k,r);g.setAttribute('aria-label',FD[k].name+(r?' 한 입 먹기, '+r+'번 남음':' 다 먹음'))}
function fdEat(k){
  if(FOOD.leaving[k]||!FOOD.on[k])return;var D=FD[k],r=--FOOD.on[k];
  fdSnd(D.snd);fdFx(D.cx+rnd(-10,10),D.cy-24,pick(D.fx));fdPaint(k);
  var o=$('fdO_'+k);o.classList.remove('fd-bite');void o.getBoundingClientRect();o.classList.add('fd-bite');
  if(r===0){FOOD.leaving[k]=1;setTimeout(function(){
    var g=o.firstChild;g.classList.add('leave');g.style.transform='translate('+(FD_BAG[0]-D.cx)+'px,'+(FD_BAG[1]-D.cy)+'px) scale(.2)';g.style.opacity='0';
    setTimeout(function(){o.remove();delete FOOD.on[k];delete FOOD.leaving[k];FOOD.log[k]++;FOOD.bag++;$('fdBag').innerHTML=fdBagSvg();fdSnd('rustle');fdUI(D.name+' 한 '+D.unit+' 다 먹었어요')},560);
  },380)}
}
function fdSip(){
  if(FOOD.pouring)return;
  if(FOOD.beer>0){FOOD.beer--;fdSnd('sip');fdFx(314,286,FOOD.beer?'꿀꺽':'캬');$('fdBeer').innerHTML=fdBeer();fdBeerLabel();return}
  FOOD.pouring=1;fdSnd('pour');var n=0,t=setInterval(function(){FOOD.beer=++n;$('fdBeer').innerHTML=fdBeer();if(n>=5){clearInterval(t);FOOD.pouring=0;fdBeerLabel()}},140);
}
function fdBeerLabel(){$('fdBeer').setAttribute('aria-label',FOOD.beer?'생맥주 홀짝, '+FOOD.beer+'번 남음':'한 잔 더')}
function fdClap(){var c=$('fdClap');c.classList.remove('go');void c.getBoundingClientRect();c.classList.add('go');fdSnd('clap');fdFx(50,292,'짝짝!')}
function fdOnTable(){return FD_KEYS.filter(function(k){return FOOD.on[k]!=null})}
function fdUI(msg){
  var n=fdOnTable().length,h=$('fdHint');
  h.textContent=msg||(n?'눌러서 한 입씩 먹어요':(FOOD.ever?'또 주문해서 상을 차려요':'주문해서 상을 차려요'));
  clearTimeout(FOOD.hintT);if(msg)FOOD.hintT=setTimeout(function(){fdUI()},2400);
  var L=FD_KEYS.filter(function(k){return FOOD.log[k]}).map(function(k){return FD[k].name+' '+FOOD.log[k]+FD[k].unit});
  $('fdLog').textContent=L.length?'이번 방문 · '+L.join(' · '):'이번 방문에 먹은 건 아직 없어요';
  var b=$('fdOrder');b.textContent=n>=3?'상이 가득 찼어요':(FOOD.ever?'또 주문하기':'주문하기');b.disabled=n>=3;
}
function fdSheet(open){
  var s=$('fdSheet');if(!open){s.hidden=true;$('fdOrder').focus();return}
  FOOD.sel={};var box=$('fdOpts');box.innerHTML='';
  FD_KEYS.forEach(function(k){var D=FD[k],on=FOOD.on[k]!=null,b=document.createElement('button');b.className='fd-opt';b.setAttribute('aria-pressed','false');b.disabled=on;
    b.innerHTML='<svg class="ic" viewBox="-46 -32 92 74">'+fdDish(k,D.bites)+'</svg><div><b>'+D.name+'</b><span>'+(on?'상에 있어요':D.desc)+'</span></div><i class="rd"></i>';
    b.onclick=function(){FOOD.sel[k]=!FOOD.sel[k];b.setAttribute('aria-pressed',!!FOOD.sel[k]);fdGoLabel();fdSnd('thunk')};box.appendChild(b)});
  fdGoLabel();s.hidden=false;var f=box.querySelector('button:not(:disabled)');if(f)f.focus();
}
function fdGoLabel(){var n=FD_KEYS.filter(function(k){return FOOD.sel[k]}).length,g=$('fdGo');g.disabled=!n;g.textContent=n?'주문하기 · '+n+'개':'골라 주세요'}
function fdOrder(){
  var ks=FD_KEYS.filter(function(k){return FOOD.sel[k]&&FOOD.on[k]==null});if(!ks.length)return;
  fdSheet(false);FOOD.ever=true;
  ks.forEach(function(k,i){setTimeout(function(){FOOD.on[k]=FD[k].bites;fdAddDish(k,true);fdSnd('thunk');fdUI()},250+i*260)});
  fdUI('주문 들어갔어요');
}
function fdSwell(){
  if(!FOOD.open||Math.random()<.4)return;
  var call=pick(['안타!','호수비!','볼넷','삼진!','안타!']);if(call==='안타!'&&Math.random()<.4){call='득점!';FOOD.score++;var s=$('fdScore');if(s)s.textContent=FOOD.score+' : 0'}
  if(!AU.beatOn)crowdSwell(call==='득점!'?1:.85,2.2);
  var c=$('fdCall');if(c){c.textContent=call;c.setAttribute('opacity','1');c.classList.remove('fd-flash');void c.getBoundingClientRect();c.classList.add('fd-flash');setTimeout(function(){c.setAttribute('opacity','0')},2100)}
}
function openFood(){
  if(phase!=='game'||FOOD.open)return;if(EV.on){toast('이벤트가 끝나면 먹을 수 있어요');return}
  auEnsure();FOOD.open=true;var t=$('fdTbl');t.innerHTML=fdTable();
  FD_KEYS.forEach(function(k){if(FOOD.on[k]!=null)fdAddDish(k,false)});
  fdBind($('fdBeer'),fdSip);fdBind($('fdClap'),fdClap);noteBind();fdBeerLabel();
  var z=ZONES[curBlock&&ZONES[curBlock.key]?curBlock.key:ME.zone].label;$('fdWhere').textContent=z+' · 내 자리';
  $('fdSheet').hidden=true;$('food').hidden=false;fdUI();
  if(AU.ctx){var tt=AU.ctx.currentTime;AU.amb.gain.setTargetAtTime(AU.vol.amb/100*.7,tt,.3);AU.beat.gain.setTargetAtTime(AU.vol.beat/100*.7,tt,.3)}
  clearInterval(FOOD.swT);FOOD.swT=setInterval(fdSwell,8000);
  $('fdOrder').focus();
}
function closeFood(){
  if(!FOOD.open)return;noteClose();FOOD.open=false;$('food').hidden=true;clearInterval(FOOD.swT);clearTimeout(FOOD.hintT);applyVol();
  var b=document.querySelector('.act[data-act="food"]');if(b)b.focus();
}
function foodEsc(){if(NOTE.on)noteClose();else if(!$('fdSheet').hidden)fdSheet(false);else closeFood()}
$('fdClose').onclick=closeFood;$('fdOrder').onclick=function(){fdSheet(true)};$('fdSheetX').onclick=function(){fdSheet(false)};$('fdGo').onclick=fdOrder;
var _fdEnter=enterGame;enterGame=function(){foodReset();closeFood();return _fdEnter.apply(this,arguments)};
