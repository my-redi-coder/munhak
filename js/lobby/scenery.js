/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 풍경 (lobby.html) =================
   하늘·구름 · 먼 언덕 · 땅 · 앞마당 바닥 · 잔디밭·벚나무 · 떨어지는 벚꽃잎.
   그림 좌표는 가로 400 × 세로 760(1칸 = 1단위). 화면에 맞춰 늘어나고 남는 곳은 풀·하늘로 이어져요. 필요: kit.js */
L.sky = ()=>{
  const cloud = (x,y,s,d,t)=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="cloud"><g class="cl-in" style="--d:${d}s;--t:${t}s"><path d="M-36,10 C-46,10 -46,-4 -32,-4 C-30,-16 -12,-18 -6,-8 C0,-22 22,-20 24,-6 C40,-8 46,10 32,10 Z" fill="#fff" opacity=".96"/></g></g></g>`;
  return `<rect x="-2400" y="-1800" width="5200" height="2200" fill="url(#gSky)"/>`
    + cloud(60,78,1.1,-6,64)+cloud(300,60,.9,-20,52)+cloud(190,112,.7,-12,70)
    + cloud(-190,84,1.2,-3,58)+cloud(560,92,1.1,-26,66)+cloud(-420,58,1,-30,72)+cloud(780,70,1.2,-9,60);
};

L.hills = ()=>{
  const r = rng(7); let s='';
  [[-260,360,300,110,'#a6d886'],[90,372,230,84,'#b4df95'],[420,368,250,96,'#a6d886'],[740,372,300,104,'#b4df95'],
   [-640,372,300,110,'#b4df95'],[1080,370,300,100,'#a6d886'],[-980,372,300,100,'#a6d886'],[1400,372,300,104,'#b4df95']]
    .forEach(h=>{ s+=`<ellipse cx="${h[0]}" cy="${h[1]}" rx="${h[2]}" ry="${h[3]}" fill="${h[4]}"/>`; });
  const cols=['#6cb455','#5aa648','#74bd5e'];
  for(let x=-1300;x<1700;x+=15){
    if(x>-20 && x<420) continue;
    s+=`<circle cx="${x+r()*8}" cy="${322+r()*12}" r="${12+r()*7}" fill="${cols[Math.floor(r()*3)]}"/>`;
  }
  return s;
};

L.ground = ()=>{
  const r = rng(21); let s=`<rect x="-2400" y="330" width="5200" height="2800" fill="#8fcb6e"/>`;
  for(let i=0;i<26;i++){
    const x=-900+r()*1900, y=380+r()*520;
    s+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${40+r()*60}" ry="${10+r()*14}" fill="${r()>.5?'#9bd47a':'#84c264'}" opacity=".55"/>`;
  }
  return s;
};

L.plaza = ()=>{
  const r = rng(3);
  const inside=(x,y)=> y>352 && y<(636 - Math.max(0,Math.abs(x-200)-200)*.55) && x>-170 && x<570;
  let s=`<path d="M-40,340 L440,340 C560,342 620,430 600,520 C580,610 420,642 200,642 C-20,642 -180,610 -200,520 C-220,430 -160,342 -40,340 Z" fill="#ece6d8" stroke="#dcd5c1" stroke-width="3"/>`;
  let c='';
  for(let i=0;i<70;i++){
    const x=-170+r()*740, y=356+r()*270; if(!inside(x,y)) continue;
    let d=`M${x.toFixed(1)},${y.toFixed(1)}`, px=x, py=y; const n=2+Math.floor(r()*2);
    for(let k=0;k<n;k++){ const a=r()*6.283, l=10+r()*16; px+=Math.cos(a)*l; py+=Math.sin(a)*l; d+=` L${px.toFixed(1)},${py.toFixed(1)}`; }
    c+=`<path d="${d}"/>`;
  }
  s+=`<g fill="none" stroke="#d8d1bd" stroke-width=".9" stroke-linecap="round">${c}</g>`;
  // 티켓부스 앞 파란 줄서기 선
  s+=`<g stroke="#6aa8e0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"><path d="M14,614 L58,514"/><path d="M76,616 L112,514"/></g>`;
  return s;
};

L.lawn = ()=>{
  const r=rng(11); let s='';
  s+=`<path d="M174,628 L226,628 L252,800 L148,800 Z" fill="#ebe4d3"/><path d="M174,628 L148,800 M226,628 L252,800" stroke="#d6cfbb" stroke-width="2" fill="none"/>`;
  const fl=(x,y,c)=>`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.8" fill="${c}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r=".7" fill="#f7a1ba"/>`;
  for(let i=0;i<90;i++){
    const x=-560+r()*1520, y=656+r()*120; if(x>140&&x<262) continue; s+=fl(x,y,r()>.4?'#fff':'#ffd3de');
  }
  for(let i=0;i<60;i++){
    const left=r()>.5, x=left?(-700+r()*500):(600+r()*500), y=380+r()*340; s+=fl(x,y,r()>.4?'#fff':'#ffd3de');
  }
  [[28,700,1],[372,690,1.1],[112,712,.9],[300,716,.9]].forEach(b=>{ s+=bush(b[0],b[1],b[2]); });
  s+=cherry(36,676,1)+cherry(392,716,1)+cherry(322,746,.85)+cherry(82,752,.85)
    +cherry(-130,700,1.1)+cherry(-270,736,1)+cherry(-430,690,1.1)+cherry(-600,740,1)
    +cherry(530,700,1.1)+cherry(670,742,1)+cherry(830,690,1.1)+cherry(980,740,1)
    +cherry(-170,566,.9)+cherry(580,572,.9);
  return s;
};

L.petals = ()=>{
  const r=rng(5); let s='';
  for(let i=0;i<26;i++){
    const x0=-340+r()*780, x1=x0+30+r()*110, sw=(r()>.5?1:-1)*(8+r()*16), k=(.8+r()*.7).toFixed(2);
    const c=['#ffc2d1','#ffd3de','#ffb4c8'][i%3], dur=(11+r()*8).toFixed(1), dl=(-r()*18).toFixed(1);
    s+=`<g transform="scale(${k})"><path class="petal" d="M0,-4 C3,-5 6,-2 5,1 C3,4 -1,3 -2,0 C-2,-2 -1,-3.5 0,-4Z" fill="${c}" style="--x0:${x0.toFixed(0)}px;--x1:${x1.toFixed(0)}px;--sw:${sw.toFixed(0)}px;--dur:${dur}s;--dl:${dl}s"/></g>`;
  }
  return s;
};
