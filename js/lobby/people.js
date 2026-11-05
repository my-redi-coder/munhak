/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 으쓱이들 (lobby.html) =================
   앞마당에 응원 나온 작은 으쓱이와 표 받는 직원. PEOPLE 목록에 한 줄 더하면 한 명 늘어요
   (uni: red·white·green·staff / pose: stand·cheer·sign·flag·wave·scan / cap: 모자 / talk: 그 사람만의 한마디). 필요: kit.js */
const PEOPLE = [
  {x:72, y:534, uni:'red',   pose:'stand', cap:true},
  {x:66, y:554, uni:'white', pose:'stand', cap:true},
  {x:60, y:576, uni:'green', pose:'stand', cap:false},
  {x:168,y:394, uni:'red',   pose:'sign',  cap:true},
  {x:236,y:402, uni:'green', pose:'flag',  cap:false},
  {x:214,y:548, uni:'white', pose:'cheer', cap:true},
  {x:222,y:598, uni:'red',   pose:'wave',  cap:false},
  {x:200,y:352, uni:'staff', pose:'scan',  cap:true, talk:['표 보여 주세요!','입장권 확인할게요','어서 오세요']},
  {x:150,y:648, uni:'green', pose:'stand', cap:true}
];
const person = (o,i)=>{
  const C={red:['#d3303f','#fff'],white:['#fbfaf4','#c8102e'],green:['#2f9e6a','#fff'],staff:['#b80f2b','#fff']}[o.uni];
  const body=C[0], ink=C[1], skin='#ffe2cc', capC=o.uni==='white'?'#c8102e':C[0], pants=o.uni==='staff'?'#3a3f4a':'#fff', socks=o.uni==='staff'?'#2a2f38':'#c8102e';
  const arm=(d)=>`<path d="${d}" stroke="${body}" stroke-width="4.6" stroke-linecap="round" fill="none"/>`;
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.3" fill="${skin}"/>`;
  let arms='', extra='';
  if(o.pose==='cheer'){ arms=arm('M-8,-25 L-14,-38')+arm('M8,-25 L14,-38')+hand(-14.6,-39.6)+hand(14.6,-39.6); }
  else if(o.pose==='scan'){
    arms=arm('M-8,-25 L-11,-15')+hand(-11.4,-13)+arm('M8,-25 L15,-22')+hand(16.2,-21.6);
    extra=`<rect x="15" y="-30" width="7" height="11" rx="1.4" fill="#20252e"/><rect x="16.2" y="-28.6" width="4.6" height="5" rx=".8" fill="#bfe1f2"/>`;
  } else if(o.pose==='sign'){
    arms=arm('M-8,-25 L-11,-15')+hand(-11.4,-13)+arm('M8,-25 L12,-38')+hand(12.4,-39.5);
    extra=`<rect x="10.8" y="-56" width="1.4" height="17" fill="#8a6a4a"/><rect x="3" y="-66" width="17" height="11" rx="1.6" fill="#fffdf6" stroke="#c8102e" stroke-width="1"/><text x="11.5" y="-57.6" text-anchor="middle" class="t-slab" font-size="7" fill="#c8102e">V6</text>`;
  } else if(o.pose==='flag'){
    arms=arm('M-8,-25 L-11,-15')+hand(-11.4,-13)+arm('M8,-25 L12,-27')+hand(13,-27.6);
    extra=`<rect x="12.4" y="-62" width="1.4" height="58" fill="#8a6a4a"/><g transform="translate(13.8 -61)"><g><animateTransform attributeName="transform" type="skewY" values="-6;6;-6" dur="1.9s" repeatCount="indefinite"/><path d="M0,0 L17,3 L0,11Z" fill="#c8102e"/></g></g>`;
  } else if(o.pose==='wave'){
    arms=arm('M-8,-25 L-11,-15')+hand(-11.4,-13)
      +`<g><animateTransform attributeName="transform" type="rotate" values="-10 8 -25;14 8 -25;-10 8 -25" dur="1s" repeatCount="indefinite"/>${arm('M8,-25 L13,-37')}${hand(13.4,-38.6)}</g>`;
  } else { arms=arm('M-8,-25 L-11,-15')+arm('M8,-25 L11,-15')+hand(-11.4,-13)+hand(11.4,-13); }
  const cap = o.cap ? `<path d="M-9.9,-37.5 C-9.9,-49 9.9,-49 9.9,-37.5 Z" fill="${capC}"/><rect x="-11.5" y="-38.3" width="23" height="2.6" rx="1.3" fill="${capC}"/><rect x="-11.5" y="-38.3" width="23" height="2.6" rx="1.3" fill="#000" opacity=".12"/>` : '';
  return `<g transform="translate(${o.x} ${o.y}) scale(.85)"><g class="bob" style="--d:${(-i*.37).toFixed(2)}s;--t:${(2.4+(i%3)*.5).toFixed(1)}s">
    <ellipse cx="0" cy="0" rx="10" ry="2.6" fill="#000" opacity=".14"/>
    <rect x="-6" y="-14" width="4.6" height="8" fill="${pants}"/><rect x="1.4" y="-14" width="4.6" height="8" fill="${pants}"/>
    <rect x="-6" y="-6" width="4.6" height="4" fill="${socks}"/><rect x="1.4" y="-6" width="4.6" height="4" fill="${socks}"/>
    <ellipse cx="-3.7" cy="-1.4" rx="3.6" ry="1.8" fill="#2b2b33"/><ellipse cx="3.7" cy="-1.4" rx="3.6" ry="1.8" fill="#2b2b33"/>
    ${extra}${arms}
    <rect x="-8.5" y="-28" width="17" height="15" rx="5" fill="${body}" ${o.uni==='white'?'stroke="#e3dfd0" stroke-width=".8"':''}/>
    ${o.uni==='staff' ? '<path d="M0,-28 V-13" stroke="#fff" stroke-width="1"/><path d="M-3,-28 L0,-21 L3,-28" stroke="#fff" stroke-width=".9" fill="none"/><rect x="-2.2" y="-21" width="4.4" height="5.2" rx=".8" fill="#fffdf6" stroke="#c8102e" stroke-width=".6"/>' : `<text x="0" y="-17" text-anchor="middle" class="t-slab" font-size="9" fill="${ink}">L</text>`}
    <circle cx="0" cy="-35" r="8.6" fill="${skin}"/>
    <path d="M-9.6,-33 C-9.6,-48 9.6,-48 9.6,-33 L9.6,-27 Q9.6,-25 7.6,-25 L7.2,-31 Q0,-41 -7.2,-31 L-7.6,-25 Q-9.6,-25 -9.6,-27 Z" fill="#4a3228"/>
    <circle cx="-3.2" cy="-32.3" r="1.15" fill="#2b1d1a"/><circle cx="3.2" cy="-32.3" r="1.15" fill="#2b1d1a"/>
    <path d="M-1.8,-29.6 Q0,-28 1.8,-29.6" stroke="#b0524f" stroke-width=".9" fill="none" stroke-linecap="round"/>
    <circle cx="-5.4" cy="-30.3" r="1.7" fill="#ff9fa5" opacity=".55"/><circle cx="5.4" cy="-30.3" r="1.7" fill="#ff9fa5" opacity=".55"/>
    ${cap}</g></g>`;
};
L.people = ()=> PEOPLE.map(person).join('');
