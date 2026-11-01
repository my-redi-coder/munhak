/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 승리 티켓 그리기 (티켓팅 War · 내 라커 티켓북 공용) =================
   tkHTML(i) 티켓 한 장 전체 / tkStack(i) 매수만큼 겹친 티켓 / tkMini(i,k,n,tog) 주머니에 꽂힌 위쪽 절반 / tkBookHTML(team,newI) 티켓북 한 쪽
   모은 티켓 정보는 LOCKER.ticket(i) = {n 매수, tog 같이 앉음, seat 자리, blk 구역}. 모양은 shared/ticket.css
   (2026-11-01) 직관전승 = 한 구단 티켓을 전부 모았고 몇 석이든 전부 연석(tkTeamPerfect). 따로 저장하지 않고 티켓에서 바로 계산해요.
     금색 탭(tkTeamTabs의 class zs), 금박 스티커 tkSeal(team), 구단 위 띠 tkPerfHead(team) / 따로 앉은 티켓 다시 예매 띠 tkRebookHead(team) */
var TK_WD='일월화수목금토';
function tkDate(g){return new Date(2026,+g.d.slice(0,2)-1,+g.d.slice(2))}
function tkDay(g){return TK_WD[tkDate(g).getDay()]}
function tkMD(g){return g.d.slice(0,2)+'.'+g.d.slice(2)}
function tkWeekend(g){var w=tkDate(g).getDay();return w===0||w===6}
function tkEsc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
/* 티켓북 탭: 많이 이긴 구단부터, 같으면 시즌 중 먼저 이긴 구단 */
var TK_TEAMS=(function(){var c={},f={};TICKETS.forEach(function(g,i){c[g.opp]=(c[g.opp]||0)+1;if(f[g.opp]==null)f[g.opp]=i});
  return Object.keys(c).sort(function(a,b){return c[b]-c[a]||f[a]-f[b]})})();
function tkHTML(i){var g=TICKETS[i],o=LOCKER.ticket(i)||{};
  return '<div class="tk'+(g.home?'':' away')+'"><div class="band"><span>2026 랜더스 승리 티켓</span><span>'+(g.home?'홈':'원정')+'</span></div>'
   +'<div class="main"><div class="date">'+tkMD(g)+'<small>'+tkDay(g)+'</small></div><div class="vs">SSG vs '+tkEsc(g.opp)+' · '+tkEsc(g.park)+'</div><div class="sp">선발 '+tkEsc(g.sp)+'</div>'
   +(o.seat?'<div class="seat">'+tkEsc(o.blk+' · '+o.seat)+'</div>':'')+'</div>'
   +'<div class="stub"><small>최종</small><b>'+g.s[0]+':'+g.s[1]+'</b><span class="win">WIN</span>'+(o.n?'<small class="cnt">'+o.n+'매</small>':'')+'</div></div>';
}
function tkStack(i){var n=(LOCKER.ticket(i)||{}).n||1,h='';
  for(var k=0;k<n-1;k++){var off=n-1-k;h+='<div class="bk" style="transform:translate('+(off*6)+'px,'+(-off*5)+'px) rotate('+(off*1.2)+'deg)">'+tkHTML(i)+'</div>'}
  return '<div class="tkstack">'+h+'<div class="fr">'+tkHTML(i)+'</div></div>';
}
function tkSeed(i,k){var x=Math.sin(i*91.7+k*13.3)*43758.5;return x-Math.floor(x)}
function tkMini(i,k,n,tog){var g=TICKETS[i],off=n-1-k,tr;
  if(tog)tr='translate('+(-off*5)+'px,'+(off*4)+'px) rotate('+((k-(n-1)/2)*2.2)+'deg)';
  else tr='translate('+((tkSeed(i,k)-.5)*22)+'px,'+(tkSeed(i,k+7)*8-off*2)+'px) rotate('+((tkSeed(i,k+3)-.5)*16)+'deg)';
  return '<div class="tkm'+(g.home?'':' away')+'" style="transform:'+tr+'"><div class="bd"></div><div class="r1"><span>'+tkMD(g)+' '+tkEsc(g.opp)+'</span><b>'+g.s[0]+':'+g.s[1]+'</b></div><div class="r2">선발 '+tkEsc(g.sp)+'</div><span class="win">WIN</span></div>';
}
function tkBookHTML(team,newI){
  return TICKETS.map(function(g,i){if(g.opp!==team)return '';var o=LOCKER.ticket(i);
    if(!o)return '<div class="pocket" aria-label="'+tkMD(g)+' '+tkEsc(g.opp)+'전, 아직 없는 티켓"><div class="pf"><span class="ed">'+tkMD(g)+' '+tkEsc(g.park)+'</span></div></div>';
    var st='';for(var k=0;k<o.n;k++)st+=tkMini(i,k,o.n,o.tog);
    return '<button class="pocket has'+(i===newI?' new':'')+'" data-i="'+i+'" aria-label="'+tkMD(g)+' '+tkEsc(g.opp)+'전 티켓 '+o.n+'매 꺼내 보기"><div class="pk-stack">'+st+'</div><div class="pf">'+(o.n>1?'<span class="pn">'+o.n+'매</span>':'')+'</div></button>'}).join('');
}
function tkTeamTabs(cur){
  return TK_TEAMS.map(function(t){var all=0,got=0;TICKETS.forEach(function(g,i){if(g.opp===t){all++;if(LOCKER.ticket(i))got++}});
    return '<button data-t="'+tkEsc(t)+'"'+(tkTeamPerfect(t)?' class="zs"':'')+' aria-pressed="'+(t===cur)+'">'+tkEsc(t)+'<small>'+got+'/'+all+'</small></button>'}).join('');
}

/* ---------- 직관전승 · 연석으로 다시 예매 (2026-11-01) ---------- */
function tkTeamIds(t){var a=[];TICKETS.forEach(function(g,i){if(g.opp===t)a.push(i)});return a}
function tkTeamPerfect(t){return tkTeamIds(t).every(function(i){var o=LOCKER.ticket(i);return !!o&&(o.tog||o.n===1)})}
function tkTeamSplit(t){return tkTeamIds(t).filter(function(i){var o=LOCKER.ticket(i);return !!o&&!o.tog&&o.n>1})}
var TK_SEAL_N=0;
/* 밝은 금박 스티커: 톱니 테두리 + 흰 빛줄기 + 빨간 '직관전승' */
function tkSeal(team){var id='tks'+(++TK_SEAL_N),d='',n=24,k,a,r;
  for(k=0;k<n*2;k++){a=Math.PI*k/n;r=k%2?44:48.5;d+=(k?'L':'M')+(50+r*Math.cos(a)).toFixed(1)+' '+(50+r*Math.sin(a)).toFixed(1)}
  return '<svg class="gseal" viewBox="0 0 100 100" aria-hidden="true"><defs>'
   +'<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6C4"/><stop offset=".35" stop-color="#FFD54A"/><stop offset=".7" stop-color="#F6B92B"/><stop offset="1" stop-color="#FFE68A"/></linearGradient>'
   +'<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
   +'<clipPath id="'+id+'c"><circle cx="50" cy="50" r="41"/></clipPath></defs>'
   +'<path d="'+d+'Z" fill="#F2B12A" stroke="#E09A1A" stroke-width=".8"/><circle cx="50" cy="50" r="41" fill="url(#'+id+')"/>'
   +'<g clip-path="url(#'+id+'c)"><rect x="8" y="-10" width="18" height="120" fill="url(#'+id+'s)" transform="rotate(30 50 50)"/></g>'
   +'<circle cx="50" cy="50" r="36" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 2.2" opacity=".9"/>'
   +'<text x="50" y="36" text-anchor="middle" font-family="Gowun Dodum,sans-serif" font-size="10.5" fill="#B5121B">'+tkEsc(team)+'전</text>'
   +'<text x="50" y="59" text-anchor="middle" font-family="Black Han Sans,sans-serif" font-size="20" fill="#C8102E" stroke="#fff" stroke-width="2.4" paint-order="stroke">직관전승</text>'
   +'<text x="50" y="73" text-anchor="middle" font-family="Gowun Dodum,sans-serif" font-size="8.5" fill="#B5121B">전부 연석</text></svg>';
}
function tkPerfHead(team){return '<div class="zs-head"><div class="gs">'+tkSeal(team)+'</div><div><b>'+tkEsc(team)+'전 직관전승</b><span>'+tkTeamIds(team).length+'경기 전부 연석으로 모았어요</span></div></div>'}
function tkRebookHead(team){var n=tkTeamSplit(team).length;if(!n)return '';
  return '<div class="rb-head"><div><b>따로 앉은 티켓 '+n+'장</b><span>다 연석으로 바꾸면 직관전승에 한 걸음 더!</span></div><button class="rebook" data-rb="'+tkEsc(team)+'">연석으로 다시 예매</button></div>'}
