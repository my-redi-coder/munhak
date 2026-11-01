/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 이벤트 진행 틀 =================
   장면은 EV_SCENES[id] = {start(), tick(t,dt) → 다 끝나면 true, stop()} 로 등록해요.
   startEvent(id) → 화면을 이벤트 모드로(아래 바 숨김, '건너뛰기'), 매 프레임 evTick(dt)이 장면을 돌려요.
   evRelease(msg) → 카메라·화면을 내 자리로 돌려줘요. 장면은 뒤에서 마저 돌다가(주루 등) 끝나요.
   EV.cam   {pos,look,k}가 있으면 카메라가 내 자리 대신 여기를 봐요 (game/camera.js)
   EV.field true면 fieldTick이 쉬고 장면이 선수를 직접 움직여요 (game/fieldplay.js)
   EV.excite 관중 들썩임 0~1 (app/loop.js) */
var EV={on:false,run:null,id:null,t:0,ready:false,cam:null,field:false,excite:0};
var EV_SCENES={};
function evCam(p,l,k,cut){
  if(!EV.cam)EV.cam={pos:new THREE.Vector3(),look:new THREE.Vector3(),k:6};
  EV.cam.pos.set(p[0],p[1],p[2]);EV.cam.look.set(l[0],l[1],l[2]);EV.cam.k=k||6;
  if(cut){cam.cur.copy(EV.cam.pos);cam.look.copy(EV.cam.look)}
}
function startEvent(id){
  var sc=EV_SCENES[id];if(!sc||phase!=='game'||EV.on)return;
  if(EV.run)evFinish();
  auEnsure();stopAct(true);PL.target=null;PL.onArrive=null;if(player.mode==='walk')player.mode='stand';
  EV.on=true;EV.run=sc;EV.id=id;EV.t=0;EV.ready=false;EV.excite=.15;
  document.body.classList.add('ev');setStatus(EV_TEXT[id].watch);$('statusStop').textContent='건너뛰기';
  fadeTo('',function(){sc.start();EV.ready=true});
}
function evTick(dt){
  evCaptionTick();if(!EV.run||!EV.ready)return;EV.t+=dt;
  if(EV.run.tick(EV.t,dt))evFinish();
}
function evRelease(msg){
  if(!EV.on)return;EV.on=false;
  document.body.classList.remove('ev');setStatus(null);$('statusStop').textContent='멈추기';
  fadeTo('',function(){EV.cam=null;snapCam();if(msg)setTimeout(function(){toast(msg,3200)},300)});
}
function evFinish(){
  var sc=EV.run;EV.run=null;EV.ready=false;if(sc)sc.stop();
  EV.field=false;EV.excite=0;evCrowdCalm();
}
function skipEvent(){evRelease();evFinish()}
/* 주변 으쓱이: 일어나서 같이 환호 → 끝나면 하나둘 앉아요 */
function evCrowdCheer(share){
  npcs.forEach(function(n){if(!n.follow&&Math.random()<share){n.follow=true;n.evFollow=true;n.joinAt=rnd(.1,1.6);n.want='cheer'}});
}
function evShuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
/* 환호하는 으쓱이 count명이 서로 다른 멘트를 하나씩 (사람도 멘트도 겹치지 않게) */
function evCrowdShout(lines,count){
  var c=evShuffle(npcs.filter(function(n){return n.act==='cheer'||n.evFollow})),L=evShuffle(lines),m=Math.min(count,c.length,L.length);
  for(var i=0;i<m;i++)(function(n,line,d){setTimeout(function(){if(phase==='game')addLabel(n,line,'line',2400)},d)})(c[i],L[i],400+i*650);
}
function evCrowdCalm(){npcs.forEach(function(n){if(n.evFollow){n.evFollow=false;n.follow=false;n.ai=rnd(2,8)}})}
/* 빅보드가 화면에 꽉 차게 (세로 화면이면 더 뒤로, 홈 위까지만) */
function evBoardCam(){var tn=Math.tan(camera.fov*Math.PI/360),d=Math.max(46,BB.W*.5/(tn*camera.aspect)+4,BB.H*.9/tn);d=Math.min(d,-BB.Z-2);evCam([0,BB.CY+2,BB.Z+d],[0,BB.CY,BB.Z],8,true)}
/* 화면 자막: 3D 위치 위에 잠깐 뜨는 빨간 배지 (중계 자막 흉내). evCaption(글자, 대상 Object3D, 위 높이, ms, 아이콘)
   아이콘 {k:true} 앞에 동그란 K, {k:true,rev:true} 뒤집힌 K(루킹 삼진) */
var EVCAP={el:null,obj:null,dy:0,until:0};
function evCaption(text,obj,dy,ms,ic){if(!EVCAP.el){EVCAP.el=document.createElement('div');EVCAP.el.className='evcap';document.body.appendChild(EVCAP.el)}
  var bd=document.createElement('span');bd.className='bd';
  if(ic&&ic.k){var i=document.createElement('i');i.textContent='K';if(ic.rev)i.className='rev';bd.appendChild(i)}
  var tx=document.createElement('span');tx.textContent=text;bd.appendChild(tx);EVCAP.el.replaceChildren(bd);EVCAP.obj=obj.root||obj;EVCAP.dy=dy||2.6;EVCAP.until=EV.t+(ms||1400)/1000;EVCAP.el.classList.add('on')}
var _cv=new THREE.Vector3();
function evCaptionTick(){if(!EVCAP.el||!EVCAP.obj)return;if(EV.t>EVCAP.until||!EV.run){EVCAP.el.classList.remove('on');EVCAP.obj=null;return}
  EVCAP.obj.getWorldPosition(_cv);_cv.y+=EVCAP.dy;_cv.project(camera);EVCAP.el.style.visibility=_cv.z>1?'hidden':'';EVCAP.el.style.transform='translate('+((_cv.x*.5+.5)*innerWidth)+'px,'+((-_cv.y*.5+.5)*innerHeight)+'px) translate(-50%,-100%)'}
