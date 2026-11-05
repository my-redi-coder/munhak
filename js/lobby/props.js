/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 소품 (lobby.html) =================
   벽 옆 나무·깃발·만국기(L.pines, L.poles), 티켓부스(L.booth), 담벼락(L.wall), Munhak 상징물(L.monument, 누르면 별이 흔들려요),
   빨간 길찾기 표지판 한 쌍(L.sign: 불펜장·라커룸). 눌러지는 곳은 hot(...)으로 감싸 있어요. 필요: kit.js */
L.pines = ()=>{
  let s=pine(14,348,1.05)+pine(388,348,1.05);
  [[-70,338,1.1],[-140,344,1.25],[-210,356,1.15],[-330,372,1.3],[-430,380,1.2],[-560,392,1.3],[-720,404,1.2],
   [470,338,1.1],[540,344,1.25],[610,356,1.15],[730,372,1.3],[830,380,1.2],[960,392,1.3],[1120,404,1.2]]
    .forEach(p=>{ s+=pine(p[0],p[1],p[2]); });
  return s;
};

L.poles = ()=>{
  const flag=(px,py,dir,del)=>`<g transform="translate(${px} ${py})"><g><animateTransform attributeName="transform" type="skewY" values="-5;5;-5" dur="2.6s" begin="${del}s" repeatCount="indefinite"/><path d="M0,0 L${34*dir},3 L${34*dir},21 L0,22 Z" fill="#c8102e"/><path d="M0,0 L${34*dir},3 L${34*dir},6 L0,4 Z" fill="#fff" opacity=".35"/><text x="${17*dir}" y="16" text-anchor="middle" class="t-slab" font-size="10" fill="#fff">V6</text></g></g>`;
  let s=`<rect x="34.8" y="316" width="2.6" height="110" fill="#d9dadd"/><circle cx="36.1" cy="315" r="2.4" fill="#f1f1ee"/>`
       +`<rect x="364.8" y="316" width="2.6" height="126" fill="#d9dadd"/><circle cx="366.1" cy="315" r="2.4" fill="#f1f1ee"/>`
       +flag(37.4,318,1,0)+flag(364.8,318,-1,-1.1);
  // 빨강·흰 만국기
  const P=(t)=>({x:(1-t)*(1-t)*36+2*t*(1-t)*200+t*t*366, y:(1-t)*(1-t)*372+2*t*(1-t)*418+t*t*372});
  let str='M36,372 Q200,418 366,372', fl='';
  for(let i=1;i<18;i++){
    const p=P(i/18), c=(i%2)?'#d3303f':'#fffdf6';
    fl+=`<path d="M${(p.x-7).toFixed(1)},${p.y.toFixed(1)} L${(p.x+7).toFixed(1)},${p.y.toFixed(1)} L${p.x.toFixed(1)},${(p.y+15).toFixed(1)}Z" fill="${c}" stroke="${c==='#fffdf6'?'#e7a3ac':'none'}" stroke-width=".8"/>`;
  }
  return s+`<path d="${str}" stroke="#8d8b83" stroke-width="1" fill="none"/>`+fl;
};

L.booth = ()=>{
  let aw=''; for(let i=0;i<12;i++){ const x=10+i*12, c=i%2?'#fffdf6':'#c8102e'; aw+=`<rect x="${x}" y="464" width="12" height="11" fill="${c}"/><path d="M${x},475 a6,5 0 0 0 12,0 Z" fill="${c}"/>`; }
  let win=''; [20,63,106].forEach(x=>{ win+=`<rect x="${x}" y="481" width="38" height="25" fill="#8e0f24"/><rect x="${x+3}" y="484" width="32" height="18" rx="1.5" fill="#bfe1f2"/><rect x="${x+3}" y="484" width="32" height="6" fill="#fff" opacity=".35"/><rect x="${x+9}" y="496" width="20" height="2.4" rx="1" fill="#6f7d86"/>`; });
  return hot('stadium','경기장 입장, 티켓부스',
    `<ellipse cx="82" cy="509" rx="78" ry="5" fill="#000" opacity=".12"/>`
    +`<rect x="14" y="430" width="136" height="76" fill="url(#pBrick)"/>`
    +`<rect x="10" y="424" width="144" height="9" rx="2.5" fill="#b98a68"/><rect x="10" y="431" width="144" height="2" fill="#9a6f50" opacity=".5"/>`
    +`<rect x="20" y="438" width="18" height="19" rx="2" fill="#fffdf6" stroke="#cfc7b8" stroke-width="1"/><ellipse cx="29" cy="447.5" rx="6" ry="5" fill="none" stroke="#c8102e" stroke-width="1.2"/><ellipse cx="29" cy="447.5" rx="3" ry="2.4" fill="none" stroke="#6aa8e0" stroke-width="1"/>`
    +`<rect x="42" y="438" width="80" height="19" rx="3.5" fill="#c8102e" stroke="#fffdf6" stroke-width="1.6"/>`
    +`<text x="82" y="452" text-anchor="middle" class="t-title" font-size="12.5" fill="#fff" textLength="62" lengthAdjust="spacingAndGlyphs">TICKET</text>`
    +`<rect x="126" y="438" width="22" height="19" rx="3.5" fill="#fffdf6" stroke="#c8102e" stroke-width="1.6"/>`
    +`<text x="137" y="451.6" text-anchor="middle" class="t-title" font-size="10.5" fill="#c8102e">1루</text>`
    +aw+`<rect x="10" y="475" width="144" height="6" fill="#000" opacity=".08"/>`+win
    +`<rect x="14" y="504" width="136" height="4" fill="#8f6a4e"/>`,
    [8,418,148,94]);
};

L.wall = ()=> hot('wall','담벼락',
  `<ellipse cx="180" cy="509" rx="32" ry="3.5" fill="#000" opacity=".1"/>`
  +`<rect x="154" y="464" width="52" height="44" fill="url(#pBrick)"/>`
  +`<rect x="150" y="457" width="60" height="9" rx="2.5" fill="#b98a68"/>`
  +`<g transform="rotate(-6 165 476)"><rect x="160" y="470" width="11" height="13" fill="#fffdf6"/><path d="M162,475 h7 M162,478 h5" stroke="#9a8f82" stroke-width=".7"/><rect x="162" y="468.5" width="7" height="3" fill="#f3c7d3" opacity=".85"/></g>`
  +`<g transform="rotate(5 182 480)"><rect x="176" y="474" width="12" height="10" fill="#ffe0e8"/><path d="M178,478 h8 M178,481 h4" stroke="#9a8f82" stroke-width=".7"/><rect x="179" y="472.5" width="7" height="3" fill="#f3e3b8" opacity=".85"/></g>`
  +`<g transform="rotate(-3 196 474)"><rect x="190" y="467" width="11" height="14" fill="#dff0ff"/><path d="M192,472 h7 M192,475 h5 M192,478 h6" stroke="#9a8f82" stroke-width=".7"/><rect x="192" y="465.5" width="7" height="3" fill="#f3c7d3" opacity=".85"/></g>`
  +`<g transform="rotate(4 172 494)"><rect x="166" y="488" width="11" height="12" fill="#fffdf6"/><path d="M168,493 h7 M168,496 h4" stroke="#9a8f82" stroke-width=".7"/></g>`,
  [150,452,62,60]);

L.monument = ()=>`<g transform="translate(58 0)">
  <ellipse cx="248" cy="523" rx="42" ry="10" fill="#000" opacity=".14"/>
  <ellipse cx="248" cy="518" rx="38" ry="10" fill="#20252e"/>
  <ellipse cx="248" cy="514" rx="38" ry="10" fill="#343a47"/>
  <defs><linearGradient id="gLetter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#cdd3dc"/></linearGradient></defs><rect x="233" y="476" width="6" height="38" fill="#2a2f38"/><rect x="261" y="476" width="6" height="38" fill="#2a2f38"/><rect x="233" y="476" width="2" height="38" fill="#454c59"/><rect x="261" y="476" width="2" height="38" fill="#454c59"/>
  
  <g transform="translate(248 474) skewX(-8)"><text x="1.8" y="2.8" text-anchor="middle" class="t-title" font-size="26" fill="#7d0a1f" stroke="#7d0a1f" stroke-width="8" stroke-linejoin="round" textLength="74" lengthAdjust="spacingAndGlyphs">Munhak</text><text x="0" y="0" text-anchor="middle" class="t-title" font-size="26" fill="#fff" stroke="#c8102e" stroke-width="6.4" stroke-linejoin="round" paint-order="stroke" textLength="74" lengthAdjust="spacingAndGlyphs">Munhak</text><text x="0" y="0" text-anchor="middle" class="t-title" font-size="26" fill="url(#gLetter)" textLength="74" lengthAdjust="spacingAndGlyphs">Munhak</text></g>
  <g class="star"><path d="M248,484 l3.7,7.6 8.3,1.1 -6.1,5.7 1.6,8.2 -7.5,-4.1 -7.5,4.1 1.6,-8.2 -6.1,-5.7 8.3,-1.1Z" fill="#f6c928" stroke="#c8102e" stroke-width="2.4" stroke-linejoin="round"/></g>
  <path d="M210,524 Q248,546 286,524" stroke="#e4e6ea" stroke-width="2.2" fill="none"/>
  <path d="M214,524 v-7 M230,531 v-7 M248,534 v-7 M266,531 v-7 M282,524 v-7" stroke="#e4e6ea" stroke-width="1.6" fill="none"/>
  <g class="toy" role="button" tabindex="0" aria-label="Munhak 상징물, 노란 별 흔들기"><rect class="hit" x="212" y="444" width="74" height="82" fill="#fff" fill-opacity="0"/></g>
</g>`;

L.sign = ()=>{
  // 실제 구장의 빨간 길찾기 표지판처럼: 두껍고 빨간 화살표 판 한 쌍 + 회색 받침
  const board=(id,label,x0,dir,fs,tl,hit)=>{
    const w=64, h=36, y0=564, sh=.55*h, bx=dir<0?x0+sh:x0, bw=w-sh, cx=bx+bw/2, baseX=x0+w/2;
    const pts=(dx,dy)=> dir<0
      ? `${x0+dx},${y0+h/2+dy} ${x0+sh+dx},${y0+dy} ${x0+w+dx},${y0+dy} ${x0+w+dx},${y0+h+dy} ${x0+sh+dx},${y0+h+dy}`
      : `${x0+dx},${y0+dy} ${x0+w-sh+dx},${y0+dy} ${x0+w+dx},${y0+h/2+dy} ${x0+w-sh+dx},${y0+h+dy} ${x0+dx},${y0+h+dy}`;
    const ty=y0+h/2+4.4;
    return hot(id,label+', 표지판',
      `<ellipse cx="${baseX}" cy="618" rx="34" ry="4" fill="#000" opacity=".13"/>`
      +`<rect x="${baseX-22}" y="598" width="14" height="18" fill="#6f7580"/><rect x="${baseX+8}" y="598" width="14" height="18" fill="#6f7580"/>`
      +`<rect x="${baseX-22}" y="598" width="14" height="4" fill="#9aa0ab"/><rect x="${baseX+8}" y="598" width="14" height="4" fill="#9aa0ab"/>`
      +`<polygon points="${pts(3,4)}" fill="#7d0a1f" stroke="#7d0a1f" stroke-width="2" stroke-linejoin="round"/>`
      +`<polygon points="${pts(0,0)}" fill="#d3303f" stroke="#d3303f" stroke-width="2" stroke-linejoin="round"/>`
      +`<polygon points="${pts(0,0)}" fill="none" stroke="#ff8d97" stroke-width="1" stroke-linejoin="round" opacity=".8"/>`
      +`<text x="${cx+.9}" y="${ty+1}" text-anchor="middle" class="t-title" font-size="${fs}" fill="#7d0a1f" textLength="${tl}" lengthAdjust="spacingAndGlyphs">${label}</text>`
      +`<text x="${cx}" y="${ty}" text-anchor="middle" class="t-title" font-size="${fs}" fill="#fff" textLength="${tl}" lengthAdjust="spacingAndGlyphs">${label}</text>`,
      hit);
  };
  return board('bullpen','불펜장',236,-1,13,36,[232,556,74,66]) + board('locker','라커룸',316,1,13,36,[312,556,72,66]);
};
