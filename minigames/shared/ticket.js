/* SSG 팬 레디코더의 문학야구장 — 출처를 남겨 주세요('SSG 팬 레디코더의 문학야구장 참조'). 판매·유료 사용은 안 돼요. */
/* ================= 승리 티켓 그리기 (티켓팅 War · 내 라커 티켓북 공용) =================
   tkHTML(i) 티켓 한 장 전체 / tkStack(i) 매수만큼 겹친 티켓 / tkMini(i,k,n,tog) 주머니에 꽂힌 위쪽 절반 / tkBookHTML(team,newI) 티켓북 한 쪽
   모은 티켓 정보는 LOCKER.ticket(i) = {n 매수, tog 같이 앉음, seat 자리, blk 구역}. 모양은 shared/ticket.css */
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
    return '<button data-t="'+tkEsc(t)+'" aria-pressed="'+(t===cur)+'">'+tkEsc(t)+'<small>'+got+'/'+all+'</small></button>'}).join('');
}
