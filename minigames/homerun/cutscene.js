/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 홈런볼 모으기: 컷신 =================
   drawAllstar — 올스타 브레이크(7/8 두산전과 7/16 KIA전 사이): 간판 + 올스타전 분장한 다섯 명이 춤춰요.
     캐릭터는 실제 얼굴 없이 옷차림으로만: 최정(별 머리·무지개 꼬리), 조형우(회색 진돗개 귀·연두 티·보라 줄무늬 나비넥타이),
     정준재(긴 가발·아이블랙·무지개 니트 원피스), 김건우(머리띠·염소수염·회색 가디건), 오태곤(셔터 선글라스·빨간 시퀸 조끼)
   drawGround — 그라운드 홈런(4/3 최지훈): 공이 담장 앞에 떨어짐 → '?!' → 다이아몬드 한 바퀴 2.5초 → 도장 */
/* ── 올스타 브레이크: 간판 + 춤추는 다섯 명 ── */
const DANCERS=[
  {k:'star',no:'14',name:'최정'},
  {k:'dog',no:'20',name:'조형우'},
  {k:'knit',no:'3',name:'정준재'},
  {k:'cardi',no:'39',name:'김건우'},
  {k:'vest',no:'37',name:'오태곤'}
];
function drawAllstar(W,H){
  const a=G.as; if(!a||a.t<0) return; const c=ctx, t=a.t;
  const rise=Math.min(1,t/.6), fade=t>AS.end-.5?Math.max(0,(AS.end-t)/.5):1;
  c.save(); c.globalAlpha=fade;
  /* 간판 */
  const sy=H*(.27+(1-rise)*.2), sw=W*.62, sh=H*.105, sx=W*.5-sw/2;
  c.fillStyle='#5B4632'; c.fillRect(sx+sw*.18,sy+sh,6,H*.07); c.fillRect(sx+sw*.82-6,sy+sh,6,H*.07);
  c.fillStyle='#14233D'; c.beginPath(); c.roundRect?c.roundRect(sx,sy,sw,sh,8):c.rect(sx,sy,sw,sh); c.fill();
  c.strokeStyle='#F3C83D'; c.lineWidth=3; c.stroke();
  const stars=['#F3C83D','#FF6B7F','#7FD1FF'];
  for(let k=0;k<7;k++){ c.fillStyle=stars[k%3]; c.beginPath(); c.arc(sx+10+k*(sw-20)/6,sy+7,2.2+Math.abs(Math.sin(t*5+k))*1.4,0,7); c.fill(); }
  c.textAlign='center'; c.fillStyle='#fff';
  c.font=`${Math.round(W*.062)}px "Black Han Sans",sans-serif`; c.fillText('ALL-STAR BREAK',W*.5,sy+sh*.6);
  c.font=`600 ${Math.round(W*.03)}px "IBM Plex Sans KR",sans-serif`; c.fillStyle='#F3C83D'; c.fillText('7월 11일 올스타전 · 잠깐 쉬어가요',W*.5,sy+sh*.88);
  /* 춤 */
  if(t>.5){
    const s=W*.058;
    DANCERS.forEach((d,i)=>{
      const x=W*(.14+i*.18), beat=(t-.5)*5.2+i*.7;
      const hop=Math.abs(Math.sin(beat*Math.PI/2))*s*.55;
      drawChibi(x,H*.545-hop,s,d,beat);
      c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x,H*.552,s*.8-hop*.4,s*.18,0,0,7); c.fill();
      c.fillStyle='#fff'; c.font=`${Math.round(W*.03)}px "Black Han Sans",sans-serif`;
      c.fillText(`${d.no} ${d.name}`,x,H*.59);
    });
  }
  if(t>AS.end-1.1){
    c.save(); c.translate(W*.5,H*.7); c.rotate(-.06);
    c.font=`${Math.round(W*.085)}px "Black Han Sans",sans-serif`; c.lineWidth=6; c.strokeStyle='#9E0A22';
    c.strokeText('후반기 시작!',0,0); c.fillStyle='#fff'; c.fillText('후반기 시작!',0,0); c.restore();
  }
  c.restore();
}
function drawChibi(x,y,s,d,beat){
  const c=ctx, sw=Math.sin(beat*Math.PI);
  c.save(); c.translate(x,y);
  const skin='#F2D2B0';
  /* 다리 */
  const pants = d.k==='knit' ? skin : '#F4F4F0';
  c.strokeStyle=pants; c.lineWidth=s*.26; c.lineCap='round';
  c.beginPath(); c.moveTo(-s*.22,-s*.1); c.lineTo(-s*.3-sw*s*.12,0); c.moveTo(s*.22,-s*.1); c.lineTo(s*.3-sw*s*.12,0); c.stroke();
  /* 몸통 */
  const bodyTop=-s*1.25, bodyH = d.k==='knit'? s*1.2 : s*1.1;
  const body={star:'#6E7B4E',dog:'#9BD34A',knit:'#4B5BD8',cardi:'#D9273A',vest:'#BFDDF3'}[d.k];
  c.fillStyle=body; rr(-s*.55,bodyTop,s*1.1,bodyH,s*.25); c.fill();
  if(d.k==='knit'){ /* 무지개 지그재그 */
    const cols=['#2E6BE6','#7E4FD1','#E05AA0','#F2A3C4','#5AB7F0'];
    for(let k=0;k<5;k++){ c.strokeStyle=cols[k]; c.lineWidth=s*.13; c.beginPath();
      for(let z=0;z<=6;z++){ const zx=-s*.5+z*s/6, zy=bodyTop+s*.18+k*s*.22+(z%2?s*.08:0); z?c.lineTo(zx,zy):c.moveTo(zx,zy);} c.stroke(); }
  }
  if(d.k==='cardi'){ c.fillStyle='#8E8E8E'; rr(-s*.62,bodyTop,s*.34,bodyH,s*.15); c.fill(); rr(s*.28,bodyTop,s*.34,bodyH,s*.15); c.fill();
    c.fillStyle='rgba(255,255,255,.35)'; for(let k=0;k<10;k++){ c.fillRect(-s*.58+(k%2)*s*.9,bodyTop+s*.1+k*s*.09,2,2);} }
  if(d.k==='vest'){ c.fillStyle='#D61F2E'; c.beginPath(); c.moveTo(-s*.5,bodyTop+s*.1); c.lineTo(-s*.08,bodyTop+bodyH); c.lineTo(-s*.5,bodyTop+bodyH); c.fill();
    c.beginPath(); c.moveTo(s*.5,bodyTop+s*.1); c.lineTo(s*.08,bodyTop+bodyH); c.lineTo(s*.5,bodyTop+bodyH); c.fill();
    c.fillStyle='rgba(255,220,220,.7)'; for(let k=0;k<8;k++){ const sx=(k%2?1:-1)*s*(.3+(k%3)*.05); c.fillRect(sx,bodyTop+s*.3+k*s*.08,1.6,1.6);} }
  if(d.k==='star'){ c.fillStyle='#D8D2C4'; c.beginPath(); c.moveTo(-s*.25,bodyTop); c.lineTo(0,bodyTop+s*.25); c.lineTo(s*.25,bodyTop); c.fill();
    c.fillStyle='#E4C14A'; c.fillRect(s*.12,bodyTop+s*.35,s*.25,s*.08); }
  /* 팔 */
  const arm = d.k==='cardi'?'#8E8E8E': d.k==='vest'?'#BFDDF3': d.k==='knit'?'#E05AA0': d.k==='dog'?'#9BD34A':'#6E7B4E';
  const up = d.k==='vest' ? -1.25 : -.4;
  c.strokeStyle=arm; c.lineWidth=s*.22;
  const a1=up+sw*.7, a2=up-sw*.7;
  c.beginPath(); c.moveTo(-s*.5,bodyTop+s*.25); c.lineTo(-s*.5-Math.cos(a1)*s*.6,bodyTop+s*.25+Math.sin(a1)*s*.6);
  c.moveTo(s*.5,bodyTop+s*.25); c.lineTo(s*.5+Math.cos(a2)*s*.6,bodyTop+s*.25+Math.sin(a2)*s*.6); c.stroke();
  c.fillStyle= d.k==='vest'||d.k==='star' ? '#FFFFFF' : skin;
  c.beginPath(); c.arc(-s*.5-Math.cos(a1)*s*.65,bodyTop+s*.25+Math.sin(a1)*s*.65,s*.13,0,7); c.arc(s*.5+Math.cos(a2)*s*.65,bodyTop+s*.25+Math.sin(a2)*s*.65,s*.13,0,7); c.fill();
  /* 머리 */
  const hy=bodyTop-s*.55, hr=s*.6;
  if(d.k==='star'){ /* 무지개 꼬리 + 큰 별 */
    [['#F2B6C6',-.15],['#3FAE49',.12],['#9CC8EC',.38]].forEach(([col,o])=>{ c.strokeStyle=col; c.lineWidth=s*.24; c.beginPath(); c.moveTo(-hr*.6,hy+o*s); c.lineTo(-hr*2.1,hy+o*s+s*.35); c.stroke(); });
    c.fillStyle='#F4E58E'; star5(0,hy-s*.05,hr*1.75,hr*.95); c.fill(); }
  if(d.k==='knit'){ c.fillStyle='#A8743E'; rr(-hr*1.12,hy-hr*.9,hr*2.24,hr*2.3,hr*.8); c.fill(); }
  c.fillStyle=skin; c.beginPath(); c.arc(0,hy,hr,0,7); c.fill();
  if(d.k==='knit'){ c.fillStyle='#A8743E'; c.beginPath(); c.ellipse(0,hy-hr*.55,hr*1.02,hr*.55,0,Math.PI,0); c.fill(); }
  if(d.k!=='star' && d.k!=='knit'){ c.fillStyle='#1E1E1E'; c.beginPath(); c.ellipse(0,hy-hr*.45,hr*.98,hr*.6,0,Math.PI,0); c.fill(); }
  if(d.k==='cardi'){ c.fillStyle='#111'; c.fillRect(-hr,hy-hr*.62,hr*2,hr*.24); c.fillStyle='#3A2A22'; c.beginPath(); c.moveTo(-hr*.14,hy+hr*.8); c.lineTo(hr*.14,hy+hr*.8); c.lineTo(0,hy+hr*1.08); c.closePath(); c.fill(); }
  if(d.k==='dog'){ c.fillStyle='#5E5E62';
    /* 진돗개처럼 위로 솟은 삼각 귀 */
    [-1,1].forEach(sd=>{ c.save(); c.translate(sd*hr*.55,hy-hr*.72); c.rotate(sd*(.28+Math.sin(beat*Math.PI)*.08));
      c.fillStyle='#5E5E62'; c.beginPath(); c.moveTo(-hr*.32,hr*.08); c.lineTo(hr*.32,hr*.08); c.lineTo(0,-hr*.78); c.closePath(); c.fill();
      c.fillStyle='#E8A9B4'; c.beginPath(); c.moveTo(-hr*.15,0); c.lineTo(hr*.15,0); c.lineTo(0,-hr*.5); c.closePath(); c.fill(); c.restore(); });
    /* 보라 줄무늬 나비넥타이 */
    const by=bodyTop+s*.08; c.fillStyle='#5B3FB8';
    c.beginPath(); c.moveTo(0,by); c.lineTo(-s*.28,by-s*.13); c.lineTo(-s*.28,by+s*.13); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0,by); c.lineTo(s*.28,by-s*.13); c.lineTo(s*.28,by+s*.13); c.closePath(); c.fill();
    c.strokeStyle='#E05AA0'; c.lineWidth=1.2; c.beginPath(); c.moveTo(-s*.22,by-s*.08); c.lineTo(-s*.22,by+s*.08); c.moveTo(s*.22,by-s*.08); c.lineTo(s*.22,by+s*.08); c.stroke();
  }
  if(d.k==='vest'){ c.fillStyle='#D61F2E'; c.beginPath(); c.moveTo(0,bodyTop+s*.08); c.lineTo(-s*.25,bodyTop-s*.04); c.lineTo(-s*.25,bodyTop+s*.2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0,bodyTop+s*.08); c.lineTo(s*.25,bodyTop-s*.04); c.lineTo(s*.25,bodyTop+s*.2); c.closePath(); c.fill(); }
  /* 얼굴 */
  if(d.k==='vest'){ c.fillStyle='#E52A2A'; rr(-hr*.85,hy-hr*.22,hr*1.7,hr*.42,hr*.12); c.fill();
    c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=1; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(-hr*.8,hy-hr*.22+k*hr*.1); c.lineTo(hr*.8,hy-hr*.22+k*hr*.1); c.stroke(); } }
  else{ c.fillStyle='#1E1E1E'; c.beginPath(); c.arc(-hr*.33,hy,hr*.09,0,7); c.arc(hr*.33,hy,hr*.09,0,7); c.fill(); }
  if(d.k==='knit'){ c.fillStyle='#1E1E1E'; c.fillRect(-hr*.55,hy+hr*.18,hr*.35,hr*.1); c.fillRect(hr*.2,hy+hr*.18,hr*.35,hr*.1); }
  c.strokeStyle='#8A3A2A'; c.lineWidth=1.6; c.beginPath(); c.arc(0,hy+hr*.32,hr*.22,.2,Math.PI-.2); c.stroke();
  c.fillStyle='rgba(240,120,120,.35)'; c.beginPath(); c.arc(-hr*.55,hy+hr*.28,hr*.13,0,7); c.arc(hr*.55,hy+hr*.28,hr*.13,0,7); c.fill();
  c.restore();
}
function rr(x,y,w,h,r){ const c=ctx; c.beginPath(); if(c.roundRect) c.roundRect(x,y,w,h,r); else c.rect(x,y,w,h); }
function star5(x,y,R,r){ const c=ctx; c.beginPath(); for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rad=k%2?r:R; c.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad);} c.closePath(); }
function drawGround(W,H){
  const g=G.gr; if(!g) return; const c=ctx, t=g.t;
  if(t<GR.call){
    c.fillStyle='#fff'; c.font=`${Math.round(W*.07)}px "Black Han Sans",sans-serif`; c.textAlign='center';
    c.fillText('딱!',W*.5,H*(HOME_Y-.07)); return;
  }
  /* 공: 담장 앞 잔디로 뚝 떨어져 통통 튐 */
  let bx=.5,by;
  if(t<GR.fly){ const u=(t-GR.call)/(GR.fly-GR.call); by=HOME_Y+(.5-HOME_Y)*u-Math.sin(Math.PI*u)*.16; }
  else{ const u=Math.min(1,(t-GR.fly)/.8); by=.5-Math.abs(Math.sin(u*Math.PI*2.5))*.035*(1-u); bx=.5+u*.05; }
  c.fillStyle='rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(W*bx,H*.508,6,2.5,0,0,7); c.fill();
  c.fillStyle='#FAF7EE'; c.beginPath(); c.arc(W*bx,H*by,5,0,7); c.fill();
  if(t>=GR.fly){
    const k=Math.min(1,(t-GR.fly)/.18);
    c.save(); c.translate(W*.5,H*.4); c.rotate(-.08); c.scale(.6+.4*k,.6+.4*k);
    c.font=`${Math.round(W*.2)}px "Black Han Sans",sans-serif`; c.textAlign='center';
    c.lineWidth=8; c.strokeStyle='#4A3207'; c.strokeText('?!',0,0);
    c.fillStyle='#FFE79A'; c.fillText('?!',0,0); c.restore();
  }
  if(t<GR.q) return;
  /* 다이아몬드 한 바퀴 (2.5초) */
  const u=Math.min(1,(t-GR.q)/(GR.end-GR.q-.35));
  c.fillStyle='rgba(10,20,14,.78)'; c.fillRect(0,0,W,H);
  const cx=W*.5, cy=H*.5, R=W*.3;
  const B=[[cx,cy+R],[cx+R,cy],[cx,cy-R],[cx-R,cy],[cx,cy+R]];
  c.fillStyle='#B98552'; c.beginPath(); B.slice(0,4).forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.closePath(); c.fill();
  c.fillStyle='#3F8A4C'; c.beginPath(); c.moveTo(cx,cy+R*.7); c.lineTo(cx+R*.7,cy); c.lineTo(cx,cy-R*.7); c.lineTo(cx-R*.7,cy); c.closePath(); c.fill();
  c.fillStyle='#fff'; B.slice(0,4).forEach(([x,y])=>{ c.fillRect(x-6,y-6,12,12); });
  const seg=Math.min(3.999,u*4), i=Math.floor(seg), f=seg-i;
  const [x0,y0]=B[i],[x1,y1]=B[i+1];
  const rx=x0+(x1-x0)*f, ry=y0+(y1-y0)*f;
  /* 흙먼지 */
  for(let k=1;k<=5;k++){ const s2=Math.max(0,seg-k*.06), j=Math.floor(s2), f2=s2-j; const [a,b2]=B[j],[c2,d]=B[j+1];
    c.fillStyle=`rgba(230,200,160,${.35-k*.06})`; c.beginPath(); c.arc(a+(c2-a)*f2,b2+(d-b2)*f2+10,10-k,0,7); c.fill(); }
  drawRunner(rx,ry,W,t,x1<x0);
  c.textAlign='center'; c.fillStyle='#fff'; c.font=`${Math.round(W*.05)}px "Black Han Sans",sans-serif`;
  c.fillText(u<1?'후다다닥!':'',cx,cy+R+W*.12);
  if(u>=1){
    c.save(); c.translate(cx,cy); c.rotate(-.1);
    c.font=`${Math.round(W*.1)}px "Black Han Sans",sans-serif`;
    c.lineWidth=6; c.strokeStyle='#9E0A22'; c.strokeText('그라운드 홈런!',0,10);
    c.fillStyle='#fff'; c.fillText('그라운드 홈런!',0,10); c.restore();
  }
}
function drawRunner(x,y,W,t,left){
  const c=ctx, s=W*.045, ph=Math.sin(t*28);
  c.save(); c.translate(x,y-s*1.6); if(left) c.scale(-1,1);
  c.strokeStyle='#1C2A20'; c.lineWidth=s*.32; c.lineCap='round';
  c.beginPath(); c.moveTo(0,s*.9); c.lineTo(s*.6*ph,s*1.9); c.moveTo(0,s*.9); c.lineTo(-s*.6*ph,s*1.9); c.stroke();
  c.strokeStyle='#F2D2B0'; c.beginPath(); c.moveTo(0,s*.1); c.lineTo(-s*.7*ph,s*.7); c.moveTo(0,s*.1); c.lineTo(s*.7*ph,s*.6); c.stroke();
  c.fillStyle='#CE0E2D'; c.beginPath(); c.roundRect? c.roundRect(-s*.55,-s*.2,s*1.1,s*1.25,s*.2):c.rect(-s*.55,-s*.2,s*1.1,s*1.25); c.fill();
  c.fillStyle='#fff'; c.font=`${Math.round(s*.6)}px "Black Han Sans",sans-serif`; c.textAlign='center'; c.fillText(G.gr?G.gr.h.no:'',0,s*.65);
  c.fillStyle='#F2D2B0'; c.beginPath(); c.arc(s*.1,-s*.6,s*.42,0,7); c.fill();
  c.fillStyle='#CE0E2D'; c.beginPath(); c.arc(s*.1,-s*.72,s*.44,Math.PI,0); c.fill(); c.fillRect(s*.1,-s*.78,s*.6,s*.14);
  c.restore();
}
