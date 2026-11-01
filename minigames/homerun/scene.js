/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 홈런볼 모으기: 외야 장면 그리기 =================
   하늘·조명탑·그라운드·담장·관중석, 공 그림자, 글러브, 날아오는 공. 컷신(그라운드 홈런·올스타)은 cutscene.js.
   좌표는 화면 비율(0~1): 홈 HOME_Y, 받는 줄 CATCH_Y (game.js) */
const dark=()=>matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme!=='light';
function drawScene(now){
  if(!CW) return;
  const W=CW,H=CH,c=ctx, dk=dark();
  // 하늘
  let g=c.createLinearGradient(0,0,0,H*.3);
  g.addColorStop(0,dk?'#0B1830':'#8EC5F0'); g.addColorStop(1,dk?'#23385C':'#D9EEFB');
  c.fillStyle=g; c.fillRect(0,0,W,H*.3);
  // 조명탑
  c.fillStyle=dk?'#FFF6D0':'#B7C4CF';
  [[.08,.05],[.92,.05]].forEach(([x,y])=>{ c.fillRect(W*x-12,H*y,24,10); c.fillRect(W*x-1.5,H*y+10,3,H*.2); });
  if(dk){ c.fillStyle='rgba(255,246,208,.18)'; [[.08],[.92]].forEach(([x])=>{c.beginPath();c.arc(W*x,H*.055,40,0,7);c.fill();}); }
  // 그라운드 (멀리)
  g=c.createLinearGradient(0,H*.26,0,H*.56);
  g.addColorStop(0,'#3F8A4C'); g.addColorStop(1,'#2C6B3A');
  c.fillStyle=g; c.fillRect(0,H*.26,W,H*.3);
  // 잔디 줄무늬
  c.fillStyle='rgba(255,255,255,.05)';
  for(let k=0;k<6;k++){ c.beginPath(); const y0=H*(.26+k*.05); c.moveTo(0,y0); c.lineTo(W,y0); c.lineTo(W,y0+H*.025); c.lineTo(0,y0+H*.025); c.fill(); }
  // 내야 흙과 홈
  c.fillStyle='#B98552';
  c.beginPath(); c.moveTo(W*.5,H*(HOME_Y+.012)); c.lineTo(W*.43,H*(HOME_Y-.03)); c.lineTo(W*.5,H*(HOME_Y-.06)); c.lineTo(W*.57,H*(HOME_Y-.03)); c.closePath(); c.fill();
  c.fillStyle='#fff'; c.fillRect(W*.5-3,H*HOME_Y-2,6,4);
  // 파울 라인
  c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=1.5;
  c.beginPath(); c.moveTo(W*.5,H*HOME_Y); c.lineTo(-W*.05,H*.56); c.moveTo(W*.5,H*HOME_Y); c.lineTo(W*1.05,H*.56); c.stroke();
  // 외야 담장
  c.fillStyle='#1C4A2A'; c.fillRect(0,H*.555,W,H*.05);
  c.fillStyle='#F3C83D'; c.fillRect(0,H*.555,W,3);
  // 관중석
  for(let r=0;r<9;r++){
    const y=H*(.61+r*.044);
    c.fillStyle=r%2? (dk?'#5A1420':'#B3192F') : (dk?'#6A1A27':'#C9243A');
    c.fillRect(0,y,W,H*.044);
    c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(0,y+H*.036,W,H*.008);
  }
  // 받는 줄 표시
  c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(0,H*(CATCH_Y-.02),W,H*.06);

  const b=G.ball;
  // 그림자
  if(b && b.call<=0){
    const t=Math.min(1,b.t), lx=landX(b,t);
    c.fillStyle=`rgba(0,0,0,${.18+.32*t})`;
    c.beginPath(); c.ellipse(W*lx,H*(CATCH_Y+.035),8+16*t,3+6*t,0,0,7); c.fill();
  }
  // 글러브
  drawGlove(W*G.gx,H*(CATCH_Y+.01),W);
  drawGround(W,H);
  drawAllstar(W,H);
  // 공
  if(b){
    if(b.call>0){
      c.fillStyle='#fff'; c.font=`${Math.round(W*.07)}px "Black Han Sans",sans-serif`; c.textAlign='center';
      c.fillText('딱!',W*.5,H*(HOME_Y-.07));
    }else{
      const t=Math.min(1,b.t), lx=landX(b,t);
      const x=.5+(lx-.5)*t;
      const y=HOME_Y+(CATCH_Y-HOME_Y)*t - Math.sin(Math.PI*t)*b.arc*(1-.35*t);
      const peak=Math.sin(Math.PI*t)*b.arc;
      const r=(2.5+13*t*t)*(b.far?1+peak*.35:1);
      const sp=b.h.title;
      if(sp){ c.fillStyle='rgba(255,231,154,.45)'; c.beginPath(); c.arc(W*x,H*y,r*2.1,0,7); c.fill(); }
      c.fillStyle='#FAF7EE'; c.beginPath(); c.arc(W*x,H*y,r,0,7); c.fill();
      c.strokeStyle='#C2182F'; c.lineWidth=Math.max(.8,r*.14);
      c.beginPath(); c.arc(W*x-r*.9,H*y,r*.75,-.9,.9); c.stroke();
      c.beginPath(); c.arc(W*x+r*.9,H*y,r*.75,Math.PI-.9,Math.PI+.9); c.stroke();
    }
  }
}
function drawGlove(x,y,W){
  const c=ctx, s=W*.075;
  c.save(); c.translate(x,y);
  c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0,s*.95,s*1.05,s*.28,0,0,7); c.fill();
  c.fillStyle='#8B5A2B';
  // 손가락
  for(let k=-2;k<=1;k++){ c.beginPath(); c.ellipse(k*s*.36+s*.1,-s*.55,s*.2,s*.5,k*.12,0,7); c.fill(); }
  // 엄지
  c.beginPath(); c.ellipse(-s*.95,-s*.05,s*.22,s*.48,-.7,0,7); c.fill();
  // 손바닥
  c.beginPath(); c.ellipse(0,0,s*.85,s*.72,0,0,7); c.fill();
  c.fillStyle='#6E4420'; c.beginPath(); c.ellipse(0,-s*.05,s*.5,s*.42,0,0,7); c.fill();
  c.strokeStyle='#E8C99A'; c.lineWidth=1.5; c.setLineDash([3,3]);
  c.beginPath(); c.ellipse(0,0,s*.72,s*.6,0,0,7); c.stroke(); c.setLineDash([]);
  c.restore();
}

