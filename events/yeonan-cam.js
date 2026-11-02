/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요. */
/* ================= 여난부두 카메라 순서 (작은 패치 N, 2026-11-03) =================
   events/yeonan.js가 매 프레임 ynCam(장면 시간, 노래 시간)을 불러요. 이 파일은 카메라와 마지막 안내 문구만 맡아요.
   · 장면은 노래 '초'에 묶여 있어요(가사 시간표 events/yeonan-lyrics.json 기준). 음원 길이가 YN_CAM.REF와 다르면 비율로 늘이거나 줄여요.
   · 원칙: 불빛이 화면에 가득하게 — 카메라는 관중석 가까이, 관중석 경사를 따라 비스듬히. 하룰라라 지붕·조명탑은 피해서.
   · 세로 화면(폰)은 port=true일 때 거리·방향을 따로 잡아요.
   · cut:true인 장면은 바로 앞에서 화면이 잠깐 어두워졌다가(fadeTo) 새 자리에서 시작해요.
   흐름: 빅보드 '여난부두'(전주) → 내려와 1루 관중석으로 → 관중석 훑기(1절 앞) → 으쓱이존 가까이 → 떠오르며 빅보드 쪽으로(후렴)
        → 간주: 빅보드 크게 → 줌아웃하며 외야 → 2절: 옆에서 멀찍이 경기장 반 바퀴 → 내 으쓱이 앞 → 등 뒤로 돌아 내 자리 + '주변을 둘러보세요' */
var YN_CAM={
  REF:154.8,            // 기준 음원 길이(songs/song2.mp3, 초)
  K:3.2,                // 카메라가 길을 따라가는 부드러움(작을수록 더 늦게 따라옴)
  PLAN:[                // [노래 초, 장면 이름, 화면 어둡게 바꾸기]
    [0,'board'],        // 전주: 빅보드 '여난부두'
    [10,'down'],        // 빅보드에서 1루 관중석 쪽으로 내려옴
    [20.5,'sweep'],     // 어쩌다 한 번 오는 저 배는 ~ : 관중석 훑기
    [49.4,'ussk'],      // 부두에 꿈을 두고 ~ : 으쓱이존 가까이
    [62,'rise'],        // 말해다오 ~ : 떠오르며 빅보드 쪽으로 고개
    [77.3,'board2'],    // 간주: 빅보드 크게 → 줌아웃, 외야
    [85.3,'orbit',1],   // 2절: 옆에서 멀찍이 반 바퀴
    [114.3,'me',1],     // 저무는 여난부두 외로운 불빛 ~ : 내 으쓱이 앞
    [124.5,'turn'],     // 등 뒤로 돌아 내 자리 시점으로
    [129.9,'seat']      // 내 자리(직접 둘러보기) + 안내 문구
  ],
  ORBIT:{c:[0,0,-35],from:145,to:62,r:140,h:84,rp:165,hp:98,fromP:120,toP:22},  // 옆에서 멀찍이 돌기: 가운데, 시작·끝 각도(0=홈 뒤, 90=1루 쪽 옆, 180=빅보드 쪽), 반지름·높이(p=세로 화면)
                        // 세로 화면(폰)은 fromP→toP: 좁은 화면에 끝날 때 빅보드가 살짝 들어오게 홈 뒤 가까이까지 더 돌아요(2026-11-03)
                        // 1루 쪽 바깥을 돌아서 맞은편(3루·홈 뒤) 관중석 앞면 불빛이 보여요. 높이는 시선이 조명탑 머리(48m) 위로 지나가게
  HINT_MS:3600
};
var YC={i:-1,fadeAt:-1,hint:null,hintShown:false};

function ycPort(){return camera.aspect<.9}
function ycTan(){return Math.tan(camera.fov*Math.PI/360)}
function ycAt(s,o,y){var p=pos1B(s,o);return [p[0],y,p[1]]}
function ycMix(A,B,u){return [ynLerp(A[0],B[0],u),ynLerp(A[1],B[1],u)]}
function ycBoard(){return [0,BB.CY,BB.Z]}

/* 빅보드를 크게 담는 거리 (가로 화면은 높이, 세로 화면은 폭 기준) */
function ycBoardClose(){var tn=ycTan(),a=camera.aspect,d=Math.max(BB.H*1.05/tn,BB.W*.5*.72/(tn*a));return [[0,BB.CY+.6,BB.Z+d],[0,BB.CY-.4,BB.Z]]}

/* 장면마다 u(0~1)에 따라 [카메라 자리, 보는 곳] */
function ycShot(nm,u){
  var P=ycPort(),e=ynEase(u),V=YN.V;
  if(nm==='board'){/* 지붕 앞(홈 뒤 그물 높이)에서 빅보드 정면, 아주 천천히 다가감 */
    return [ynLerp([0,16.5,P?20:22],[0,14.5,P?12:15],e),[0,BB.CY-(P?2.5:4),BB.Z]]}
  if(nm==='down')return ycMix(ycShot('board',1),ycShot('sweep',0),e);
  if(nm==='sweep'){/* 1루 아래층 앞에서, 관중석을 비스듬히 보며 외야 쪽으로 천천히 (불빛이 화면 위아래로 층층이) */
    var s=4+26*u;return [ycAt(s,P?1.5:2.6,P?5:6),ycAt(s+(P?9:11),19,P?6.2:5.6)]}
  if(nm==='ussk'){var f=V.fw,o=V.ussk,d=(P?18:17)-6*e;return [[o[0]+f[0]*d,o[1]+3+.8*e,o[2]+f[2]*d],[o[0],o[1]+2.2,o[2]]]}
  if(nm==='rise'){/* 떠오르며 1루 관중석 전체 → 끝에는 빅보드 쪽으로 고개 */
    var a=ycShot('ussk',1),hi=ycAt(26,P?-20:-16,P?30:26),u1=clamp(u/.7,0,1),u2=ynEase(clamp((u-.72)/.28,0,1));
    return [ynLerp(a[0],hi,ynEase(u1)),ynLerp([V.ussk[0],V.ussk[1]+1,V.ussk[2]],[0,BB.CY-2,BB.Z],u2)]}
  if(nm==='board2'){/* 간주: 날아 들어가 빅보드 크게 → 잠깐 머묾 → 뒤로 빠지며 외야 관중석까지 */
    var c=ycBoardClose(),w=P?[[-26,30,BB.Z+92],[46,9,BB.Z+30]]:[[0,30,BB.Z+92],[0,15,BB.Z+12]];
    if(u<.24)return ycMix(ycShot('rise',1),c,ynEase(u/.24));
    if(u<.38)return [ynLerp(c[0],[c[0][0],c[0][1],c[0][2]-2],(u-.24)/.14),c[1]];
    return ycMix([[c[0][0],c[0][1],c[0][2]-2],c[1]],w,ynEase((u-.38)/.62))}
  if(nm==='orbit'){/* 첨부 3번처럼: 옆쪽 멀찍이, 비스듬히 내려다보며 반 바퀴 */
    var O=YN_CAM.ORBIT,R=P?O.rp:O.r,h=P?O.hp:O.h,a0=P?O.fromP:O.from,a1=P?O.toP:O.to,an=(a0+(a1-a0)*u)*Math.PI/180;
    return [[O.c[0]+Math.sin(an)*R,h,O.c[2]+Math.cos(an)*R],[O.c[0]-(P?6:0),4,O.c[2]]]}
  if(nm==='me'){/* 내 으쓱이 앞쪽에서 다가가며, 불빛 든 모습 */
    var M=ycMe(),d2=13-9.4*e;return [[M.p[0]+M.f[0]*d2,M.p[1]+1.2+3.8*(1-e),M.p[2]+M.f[2]*d2],[M.p[0],M.p[1]+1.3,M.p[2]]]}
  if(nm==='turn'){/* 으쓱이 둘레를 돌아 등 뒤(내 자리 시점)로 */
    var M2=ycMe(),S=ycSeat(),r0=3.6,h0=1.2,a0=Math.atan2(M2.f[0],M2.f[2]),
        dx=S[0][0]-M2.p[0],dz=S[0][2]-M2.p[2],r1=Math.hypot(dx,dz),h1=S[0][1]-M2.p[1],a1=Math.atan2(dx,dz),
        da=a1-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
    var an2=a0+da*e,r=r0+(r1-r0)*e,hh=h0+(h1-h0)*e+Math.sin(e*Math.PI)*.8;
    return [[M2.p[0]+Math.sin(an2)*r,M2.p[1]+hh,M2.p[2]+Math.cos(an2)*r],ynLerp([M2.p[0],M2.p[1]+1.3,M2.p[2]],S[1],e)]}
  return null;
}
/* 내 으쓱이 자리와 앞쪽(그라운드 쪽) 방향 */
var _ycv=new THREE.Vector3();
function ycMe(){player.root.getWorldPosition(_ycv);var th=curBlock?curBlock.cfg.theta:Math.PI/4;return {p:[_ycv.x,_ycv.y,_ycv.z],f:[-Math.sin(th),0,-Math.cos(th)]}}
/* 이벤트가 끝나 내 자리로 돌아왔을 때 카메라가 있을 자리 (game/camera.js의 camDesired를 그대로 빌려요) */
var _ycp=new THREE.Vector3(),_ycl=new THREE.Vector3();
function ycSeat(){var keep=EV.cam;EV.cam=null;camDesired(_ycp,_ycl);EV.cam=keep;return [[_ycp.x,_ycp.y,_ycp.z],[_ycl.x,_ycl.y,_ycl.z]]}

/* yeonan.js가 매 프레임 불러요. lt=장면 시간, s=노래 시간(초, 노래 전이면 null) */
function ynCam(lt,s){
  if(s==null){var b=ycShot('board',0);evCam(b[0],b[1],2.2,lt<.05);YC.i=0;return}
  s*=YN_CAM.REF/Math.max(1,YN.dur);
  var L=YN_CAM.PLAN,i=L.length-1;while(i>0&&s<L[i][0])i--;
  /* 다음 장면이 '바꾸기'면 미리 화면을 어둡게 */
  var nx=L[i+1],lead=reduceMotion?.06:.38;
  if(nx&&nx[2]&&s>=nx[0]-lead&&YC.fadeAt!==i+1){YC.fadeAt=i+1;fadeTo('',function(){})}
  var cut=i!==YC.i&&L[i][2];YC.i=i;
  if(L[i][1]==='seat'){if(EV.cam)EV.cam=null;ycHint();return}
  var s0=L[i][0],s1=nx?nx[0]:s0+10,sh=ycShot(L[i][1],clamp((s-s0)/(s1-s0),0,1));
  evCam(sh[0],sh[1],YN_CAM.K,cut);
}
function ycReset(){YC.i=-1;YC.fadeAt=-1;YC.hintShown=false;if(YC.hint)YC.hint.classList.remove('on')}

/* 마지막: 내 자리로 돌아오면 '주변을 둘러보세요'가 살짝 떴다 사라져요 (styles/event.css의 .yhint) */
function ycHint(){
  if(YC.hintShown)return;YC.hintShown=true;
  if(!YC.hint){YC.hint=document.createElement('div');YC.hint.className='yhint';YC.hint.setAttribute('aria-live','polite');document.body.appendChild(YC.hint)}
  YC.hint.textContent=YEONAN.hint||'주변을 둘러보세요';
  YC.hint.classList.remove('on');void YC.hint.offsetWidth;YC.hint.classList.add('on');
  setTimeout(function(){if(YC.hint)YC.hint.classList.remove('on')},YN_CAM.HINT_MS+100);
}
