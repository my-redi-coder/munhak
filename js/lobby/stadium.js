/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 경기장 건물 (lobby.html) =================
   휜 지붕선·하얀 뾰족 기둥·기둥과 빨간 삼각 장식·포스터 3장(Go for it! / V6)·환영 현수막·GATE 간판,
   활짝 열린 정문(L.gate, 눌러지는 곳), 줄 서는 빨간 줄 기둥(L.queue), 옆의 문학기념관 문(L.annex, 눌러지는 곳).
   구단 로고·실제 간판 글씨는 쓰지 않아요(빨강·흰색과 우리 문구만). 필요: kit.js */
L.stadium = ()=>{
  let s='';
  const mir=(p)=>p; // 자리표시: 좌우 대칭 조각은 아래에서 직접 적음
  // 뒤쪽 어두운 벽 + 양끝 꺾여 들어가는 벽
  s+=`<rect x="6" y="186" width="388" height="156" fill="#575a62"/>`;
  s+=`<path d="M6,186 L-10,198 L-10,342 L6,342Z" fill="#4a4d54"/><path d="M394,186 L410,198 L410,342 L394,342Z" fill="#4a4d54"/>`;
  // 칸막이 사이 X자 보강재
  const cx=[...Array(8)].map((_,i)=>20+i*51.43);
  for(let i=0;i<7;i++){
    const x1=cx[i]+4.5, x2=cx[i+1]-4.5, top=arcY((x1+x2)/2,224);
    s+=`<path d="M${x1.toFixed(1)},${(top+10).toFixed(1)} L${x2.toFixed(1)},${(top+34).toFixed(1)} M${x1.toFixed(1)},${(top+34).toFixed(1)} L${x2.toFixed(1)},${(top+10).toFixed(1)}" stroke="#7b7e86" stroke-width="1.1" fill="none" opacity=".7"/>`;
  }
  // 아래층(어두운 곳) + 작은 불빛 창
  s+=`<rect x="6" y="262" width="388" height="80" fill="#44474e"/>`;
  [0,1,5,6].forEach(i=>{
    const x1=cx[i]+8;
    for(let k=0;k<2;k++) s+=`<rect x="${(x1+k*18).toFixed(1)}" y="308" width="12" height="10" rx="1.5" fill="#f4ecdc" opacity=".8"/>`;
  });
  s+=`<rect x="6" y="258" width="388" height="7" fill="#a4a29a"/><rect x="6" y="258" width="388" height="1.6" fill="#c9c7bf"/>`;
  // 기둥 + 빨간 삼각 장식
  cx.forEach(x=>{
    const t=arcY(x,222);
    s+=`<rect x="${x-4.5}" y="${t.toFixed(1)}" width="9" height="${(342-t).toFixed(1)}" fill="#c6c4bc"/>`
     + `<rect x="${x+1.5}" y="${t.toFixed(1)}" width="3" height="${(342-t).toFixed(1)}" fill="#aeaca3"/>`
     + `<rect x="${x-6.5}" y="330" width="13" height="12" fill="#b5b3aa"/>`
     + `<path d="M${x+4.5},${t.toFixed(1)} L${x+13.5},${t.toFixed(1)} L${x+4.5},${(t+11).toFixed(1)} Z" fill="#d3303f"/>`;
  });
  // 포스터 3장 (빨강·흰색만)
  const rope=(x)=>`<path d="M${x-12},205 L${x},210 L${x+12},205" stroke="#8d8b83" stroke-width=".8" fill="none"/>`;
  s+=rope(148.6)+rope(200)+rope(251.4);
  s+=`<g><rect x="129.6" y="209" width="38" height="46" rx="2" fill="#c8102e"/>
      <text x="148.6" y="231" text-anchor="middle" class="t-slab" font-size="17" fill="#fff">Go</text>
      <text x="148.6" y="245" text-anchor="middle" class="t-slab" font-size="10" fill="#fff" textLength="30" lengthAdjust="spacingAndGlyphs">for it!</text></g>`;
  s+=`<g><rect x="181" y="209" width="38" height="46" rx="2" fill="#fffdf6" stroke="#c8102e" stroke-width="2"/>
      <text x="200" y="239" text-anchor="middle" class="t-slab" font-size="22" fill="#c8102e">V6</text></g>`;
  s+=`<g><rect x="232.4" y="209" width="38" height="46" rx="2" fill="#8f0c23"/>
      <text x="251.4" y="232" text-anchor="middle" class="t-slab" font-size="19" fill="#fff">V6</text>
      <text x="251.4" y="246" text-anchor="middle" class="t-slab" font-size="7.5" fill="#fff" textLength="31" lengthAdjust="spacingAndGlyphs">Go for it!</text></g>`;
  // 지붕 캐노피 + 처마 밑 + 베이지 띠
  s+=`<path d="M6,172 L-10,184 L-10,198 L6,186Z" fill="#3d4047"/><path d="M394,172 L410,184 L410,198 L394,186Z" fill="#3d4047"/>`;
  s+=`<path d="M6,191 L-10,203 L-10,233 L6,221Z" fill="#cdbf99"/><path d="M394,191 L410,203 L410,233 L394,221Z" fill="#cdbf99"/>`;
  s+=`<path d="M6,226 L-10,234 L-10,342 L6,342Z" fill="#96948c"/><path d="M394,226 L410,234 L410,342 L394,342Z" fill="#96948c"/>`;
  s+=`<path d="M6,172 Q200,128 394,172 L394,186 Q200,142 6,186 Z" fill="#4b4f57"/>`;
  s+=`<path d="M6,186 Q200,142 394,186 L394,191 Q200,147 6,191 Z" fill="#9fa2aa"/>`;
  s+=`<path d="M6,191 Q200,147 394,191 L394,221 Q200,177 6,221 Z" fill="#dfd3ae"/>`;
  s+=`<path d="M6,191 Q200,147 394,191" stroke="#efe7cb" stroke-width="1.6" fill="none"/>`;
  s+=`<path d="M6,221 Q200,177 394,221 L394,226 Q200,182 6,226 Z" fill="#bfb28a"/>`;
  // 지붕 위 하얀 뾰족 기둥
  for(let i=0;i<13;i++){
    const x=24+i*29.33, y=arcY(x,172);
    s+=`<path d="M${(x-8).toFixed(1)},${(y+2).toFixed(1)} L${x.toFixed(1)},${(y-12).toFixed(1)} L${(x+8).toFixed(1)},${(y+2).toFixed(1)}" stroke="#f1f1ee" stroke-width="1.4" fill="none"/>`
     + `<path d="M${(x-3.6).toFixed(1)},${y.toFixed(1)} L${x.toFixed(1)},${(y-26).toFixed(1)} L${(x+3.6).toFixed(1)},${y.toFixed(1)}Z" fill="#fff"/>`
     + `<path d="M${x.toFixed(1)},${(y-26).toFixed(1)} L${(x+3.6).toFixed(1)},${y.toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)}Z" fill="#dfe3e8"/>`;
  }
  // 빨간 환영 현수막
  s+=`<rect x="50" y="263" width="300" height="21" rx="2" fill="#000" opacity=".12"/>`
   + `<rect x="50" y="261" width="300" height="21" rx="2" fill="#d3303f"/>`
   + `<text x="200" y="276" text-anchor="middle" class="t-title" font-size="12.5" fill="#fff" textLength="262" lengthAdjust="spacingAndGlyphs">WELCOME TO THE 문학야구장</text>`;
  // 정문 간판: 빨강·흰 체크
  let chk='';
  for(let k=0;k<4;k++) for(let j=0;j<2;j++){
    const c=((k+j)%2)?'#c8102e':'#fffdf6';
    chk+=`<rect x="${128+k*7}" y="${288+j*7}" width="7" height="7" fill="${c}"/><rect x="${244+k*7}" y="${288+j*7}" width="7" height="7" fill="${c}"/>`;
  }
  s+=`<rect x="128" y="288" width="144" height="14" fill="#c8102e"/>${chk}`
   + `<text x="200" y="299.5" text-anchor="middle" class="t-title" font-size="11.5" fill="#fff" letter-spacing="2">GATE</text>`;
  // 왼쪽 분홍 경사로
  s+=`<path d="M54,342 L112,300 L112,342Z" fill="#e8b4a6"/><path d="M54,338 L112,296" stroke="#f6d4ca" stroke-width="2" fill="none"/>`
   + `<path d="M70,342 L70,331 M84,342 L84,321 M98,342 L98,310" stroke="#d29c8d" stroke-width="1" fill="none"/>`;
  // 건물 밑 그림자
  s+=`<rect x="-10" y="342" width="420" height="6" fill="#000" opacity=".07"/>`;
  return s;
};

L.gate = ()=>{
  let grid=''; for(let x=124;x<=276;x+=5) grid+=`<path d="M${x},303 V308"/>`;
  return hot('gate','정문',
    `<rect x="112" y="288" width="8" height="54" fill="#c6c4bc"/><rect x="280" y="288" width="8" height="54" fill="#c6c4bc"/>`
    +`<rect x="120" y="302" width="160" height="40" fill="#3a3d44"/>`
    +`<path d="M120,303 L150,309 L150,334 L120,342Z" fill="#5a5d65"/><path d="M280,303 L250,309 L250,334 L280,342Z" fill="#5a5d65"/>`
    +`<rect x="150" y="309" width="100" height="25" fill="#efe6d3"/>`
    +`<rect x="150" y="318" width="100" height="4" fill="#d3303f"/>`
    +`<rect x="176" y="311" width="48" height="6" rx="1" fill="#fffdf6"/>`
    +`<path d="M130,342 L270,342 L250,334 L150,334Z" fill="#cfc9bb"/>`
    +`<g fill="#5b616c" opacity=".75"><rect x="172" y="322" width="5" height="12" rx="2"/><circle cx="174.5" cy="319.5" r="2.6"/><rect x="224" y="323" width="5" height="11" rx="2"/><circle cx="226.5" cy="320.5" r="2.5"/></g>`
    +`<rect x="120" y="302" width="160" height="6" fill="#8e939c"/><g stroke="#6f747e" stroke-width=".8">${grid}</g>`
    +`<path d="M120,308 L134,311 L134,336 L120,340Z" fill="#a9aeb8" stroke="#7d838d" stroke-width="1"/><path d="M126,309.5 V338 M130,310.5 V337" stroke="#7d838d" stroke-width=".8"/>`
    +`<path d="M280,308 L266,311 L266,336 L280,340Z" fill="#a9aeb8" stroke="#7d838d" stroke-width="1"/><path d="M274,309.5 V338 M270,310.5 V337" stroke="#7d838d" stroke-width=".8"/>`,
    [112,286,176,58]);
};

/* 정문 앞 줄 서는 길: 빨간 줄 기둥 */
L.queue = ()=>{
  const post=(x,y)=>`<ellipse cx="${x}" cy="${y+1}" rx="3.6" ry="1.4" fill="#2a2f38"/><rect x="${x-.9}" y="${y-10}" width="1.8" height="10" fill="#2a2f38"/><circle cx="${x}" cy="${y-11}" r="2" fill="#c8102e"/>`;
  const belt=(a,b)=>`<path d="M${a[0]},${a[1]-9} L${b[0]},${b[1]-9}" stroke="#c8102e" stroke-width="1.7" stroke-linecap="round"/>`;
  const sides=[[[172,350],[162,362],[152,375]],[[228,350],[238,362],[248,375]]];
  let s='';
  sides.forEach(a=>{ s+=belt(a[0],a[1])+belt(a[1],a[2]); a.forEach(q=>{ s+=post(q[0],q[1]); }); });
  return s;
};

L.annex = ()=> hot('museum','문학기념관',
  `<ellipse cx="316" cy="356" rx="36" ry="5" fill="#000" opacity=".12"/>`
  +`<rect x="288" y="318" width="56" height="36" fill="#f1ead9" stroke="#d9d0b8" stroke-width="1"/>`
  +`<path d="M282,322 L316,300 L350,322 Z" fill="#565a63"/><path d="M282,322 L316,300 L316,322Z" fill="#6a6e77" opacity=".6"/>`
  +`<rect x="292" y="325" width="48" height="13" rx="3" fill="#fffdf6" stroke="#c8102e" stroke-width="1"/>`
  +`<text x="316" y="335" text-anchor="middle" class="t-body" font-size="8.4" font-weight="700" fill="#c8102e" textLength="40" lengthAdjust="spacingAndGlyphs">문학기념관</text>`
  +`<path d="M306,354 V347 Q306,340 316,340 Q326,340 326,347 V354 Z" fill="#a8132b"/>`
  +`<path d="M316,341 V354" stroke="#7a0d1f" stroke-width="1"/><circle cx="321.5" cy="348" r="1.1" fill="#fffdf6"/>`
  +`<g transform="translate(296 354)"><rect x="-4" y="-5" width="8" height="5" rx="1" fill="#b98a68"/><circle cx="-2" cy="-8" r="2.6" fill="#ffb4c8"/><circle cx="2" cy="-9" r="2.4" fill="#ffd3de"/></g>`
  +`<g transform="translate(338 354)"><rect x="-4" y="-5" width="8" height="5" rx="1" fill="#b98a68"/><circle cx="-1.5" cy="-9" r="2.6" fill="#ffd3de"/><circle cx="2" cy="-8" r="2.4" fill="#ffb4c8"/></g>`,
  [282,298,72,60]);
