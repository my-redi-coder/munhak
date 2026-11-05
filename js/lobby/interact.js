/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요.
   Original work by Redi Coder, an SSG Landers fan. Reuse is welcome, commercial use is not. Please credit "Based on Munhak Ballpark by Redi Coder (SSG fan)". */
/* ================= 로비 동작 (lobby.html) =================
   누르기 → 이름표(말풍선) → 한 번 더 누르면 들어가요. 폰·PC 똑같고 hover는 쓰지 않아요.
   - 첫 번째 누름: 그곳 이름표 + 갈 곳을 미리 받기 시작(prefetch)
   - 두 번째 누름: 'enter'면 가는 중 화면 → url로 이동 / 정문은 티켓 안내 + 티켓부스 반짝 / 문학기념관은 닫힌 문(흔들림 + 안내)
   - Munhak 상징물은 누르면 노란 별이 흔들려요. 으쓱이들은 가끔 한마디 해요
   필요: config.js kit.js(NS) people.js(PEOPLE), lobby.html의 #stage #bubble #sparks #talkLayer #toast #live #go */
const $ = (id)=>document.getElementById(id);
const stage=$('stage'), bubble=$('bubble'), live=$('live'), goEl=$('go'), toastEl=$('toast');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced) stage.pauseAnimations();
const state = { sel:null, going:false, idle:0 };
const hotEl = (id)=>stage.querySelector(`.hot[data-id="${id}"]`);
const cfgOf = (id)=>CONFIG.hotspots[id];
const subsOf = (c)=>[].concat(typeof c.sub==='function'?c.sub():c.sub).filter(Boolean);

function clearSel(){
  if(state.sel){ const a=hotEl(state.sel)?.querySelector('.art'); a&&a.removeAttribute('filter'); state.sel=null; }
  bubble.replaceChildren(); clearTimeout(state.idle);
}
function idleReset(){ clearTimeout(state.idle); state.idle=setTimeout(clearSel, CONFIG.idleClearSec*1000); }

function showBubble(id){
  const c=cfgOf(id), A=CONFIG.anchors[id], subs=subsOf(c);
  const hasLabel=!!c.label;                       // label이 없으면 sub만 보여줘요
  const g=document.createElementNS(NS,'g');
  g.setAttribute('class','bub'+(hasLabel?'':' solo'));
  g.innerHTML=`<rect class="sh"/><rect class="bg"/>`
    + (hasLabel?`<text class="lb" text-anchor="middle">${c.label}</text>`:'')
    + subs.map(t=>`<text class="sb" text-anchor="middle">${t}</text>`).join('')
    + `<path class="tl"/><path class="tp"/>`;
  bubble.replaceChildren(g);
  const texts=[...g.querySelectorAll('text')];
  let w=0; texts.forEach(t=>{ w=Math.max(w,t.getComputedTextLength()); });
  const bw=Math.ceil(w)+28;
  const bh=hasLabel ? (subs.length? 35+(subs.length-1)*12+10 : 31) : 13+subs.length*15;
  const TAIL=10;                                  // 꼬리 높이: 말풍선 바닥 ~ 건물에 닿는 끝
  const bx=Math.min(Math.max(A.x-bw/2,20),380-bw), by=A.y-TAIL-bh, cx=bx+bw/2;
  const [sh,bg]=g.querySelectorAll('rect');
  for(const [el,dy] of [[sh,2],[bg,0]]){ el.setAttribute('x',bx); el.setAttribute('y',by+dy); el.setAttribute('width',bw); el.setAttribute('height',bh); el.setAttribute('rx',12); }
  if(hasLabel){
    texts[0].setAttribute('x',cx); texts[0].setAttribute('y',by+20);
    texts.slice(1).forEach((t,i)=>{ t.setAttribute('x',cx); t.setAttribute('y',by+35+i*12); });
  }else{
    texts.forEach((t,i)=>{ t.setAttribute('x',cx); t.setAttribute('y',by+19+i*15); });
  }
  // 꼬리: 말풍선 바닥에서 건물을 향해 뾰족하게 내려가는 화살표(끝이 건물 지붕에 닿음)
  const [tl,tp]=g.querySelectorAll('path');
  const tx=Math.min(Math.max(A.x,bx+16),bx+bw-16), by2=by+bh, hw=7;
  tl.setAttribute('d',`M${tx-hw},${by2-1} L${A.x},${A.y} L${tx+hw},${by2-1} Z`);
  tp.setAttribute('d',`M${tx-hw+1.2},${by2-1.6} L${tx+hw-1.2},${by2-1.6} L${tx+hw-1.2},${by2+.8} L${tx-hw+1.2},${by2+.8} Z`);
  live.textContent=[c.label,...subs].filter(Boolean).join('. ');   // 화면 읽어주는 기능용 문구
}

function sparkle(){
  const star='M0,-7 L1.9,-1.9 L7,0 L1.9,1.9 L0,7 L-1.9,1.9 L-7,0 L-1.9,-1.9Z';
  const sp=(x,y,d)=>`<g transform="translate(${x} ${y}) scale(1.5)"><path class="spark" d="${star}" fill="#fff" stroke="#d3303f" stroke-width="1.1" style="animation-delay:${d}s"/></g>`;
  $('sparks').innerHTML = sp(16,426,0)+sp(150,428,.2)+sp(82,418,.4);
}
function toast(msg){
  toastEl.textContent=msg; toastEl.classList.add('on');
  clearTimeout(toast.t); toast.t=setTimeout(()=>toastEl.classList.remove('on'),2200);
}
function shake(id){
  const g=hotEl(id); g.classList.remove('shake'); void g.getBoundingClientRect(); g.classList.add('shake');
  setTimeout(()=>g.classList.remove('shake'),450);
}

function wiggleStar(){
  const s=stage.querySelector('.star'); if(!s) return;
  s.classList.remove('wiggle'); void s.getBoundingClientRect(); s.classList.add('wiggle');
  clearTimeout(wiggleStar.t); wiggleStar.t=setTimeout(()=>s.classList.remove('wiggle'),800);
}
function select(id){
  clearSel(); state.sel=id;
  hotEl(id).querySelector('.art').setAttribute('filter','url(#fSel)');
  showBubble(id);
  prefetch(id);
  if(cfgOf(id).kind==='info') sparkle();   // 정문을 눌렀을 때만 티켓부스에 반짝
  idleReset();
}

/* 첫 번째 누름에서 갈 곳의 파일을 미리 받아 둬요(한 번만) */
const prefetched = new Set();
function prefetch(id){
  (cfgOf(id).prefetch||[]).forEach(u=>{
    if(prefetched.has(u)) return; prefetched.add(u);
    const l=document.createElement('link'); l.rel='prefetch'; l.href=u; document.head.appendChild(l);
  });
}

/* 가는 중 화면을 잠깐 보여 준 뒤 이동 */
function goTo(id){
  const c=cfgOf(id);
  if(!c.url){ toast('준비 중이에요'); return; }
  state.going=true; clearTimeout(state.idle);
  $('goMsg').textContent=c.go||'가는 중'; goEl.hidden=false;
  requestAnimationFrame(()=>goEl.classList.add('on'));
  setTimeout(()=>{ location.href=c.url; }, reduced?0:320);
}
function activate(id){
  const c=cfgOf(id);
  if(c.kind==='enter') goTo(id);
  else if(c.kind==='museum'){ if(CONFIG.museumOpen) goTo(id); else { shake(id); toast(c.closedMsg); } }
  else if(c.kind==='info'){ sparkle(); idleReset(); }
}
function tap(id){
  if(state.going) return;
  if(state.sel===id) activate(id); else select(id);
}

stage.addEventListener('click',(e)=>{
  if(state.going) return;
  const h=e.target.closest('.hot');
  if(h) tap(h.dataset.id);
  else if(e.target.closest('.toy')){ clearSel(); wiggleStar(); }
  else clearSel();
});
stage.addEventListener('keydown',(e)=>{
  const h=e.target.closest&&e.target.closest('.hot');
  if(h && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); tap(h.dataset.id); }
  else if(e.target.closest&&e.target.closest('.toy')&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); wiggleStar(); }
});
stage.addEventListener('focusin',(e)=>{
  const h=e.target.closest&&e.target.closest('.hot');
  if(h && h.matches(':focus-visible') && state.sel!==h.dataset.id && !state.going) select(h.dataset.id);
  const t=e.target.closest&&e.target.closest('.toy');
  if(t && t.matches(':focus-visible')) wiggleStar();
});
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') clearSel(); });
/* 다른 화면에서 '뒤로' 해서 돌아왔을 때(브라우저가 화면을 그대로 되살린 경우) 가는 중 화면을 걷어요 */
window.addEventListener('pageshow',(e)=>{
  if(e.persisted){ state.going=false; goEl.classList.remove('on'); goEl.hidden=true; clearSel(); }
});

/* 으쓱이들의 한마디: 아무것도 안 누르고 있을 때만 가끔 */
function talk(){
  if(!reduced && !state.sel && !state.going){
    const p=PEOPLE[Math.floor(Math.random()*PEOPLE.length)];
    const pool=p.talk||CONFIG.talk, txt=pool[Math.floor(Math.random()*pool.length)];
    const g=document.createElementNS(NS,'g'); g.setAttribute('class','talk');
    g.innerHTML=`<rect class="bg"/><text text-anchor="middle">${txt}</text>`;
    $('talkLayer').replaceChildren(g);
    const t=g.querySelector('text'), bw=Math.ceil(t.getComputedTextLength())+16, bh=17;
    const bx=Math.min(Math.max(p.x-bw/2,16),384-bw), by=p.y-58;
    const r=g.querySelector('rect'); r.setAttribute('x',bx); r.setAttribute('y',by); r.setAttribute('width',bw); r.setAttribute('height',bh); r.setAttribute('rx',8);
    t.setAttribute('x',bx+bw/2); t.setAttribute('y',by+12);
    setTimeout(()=>{ if(g.parentNode) g.remove(); },2700);
  }
  setTimeout(talk,4500+Math.random()*3500);
}
setTimeout(talk,3500);
