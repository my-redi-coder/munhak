/* ================= 볼카운트 불 (이벤트 중 왼쪽 위) =================
   evCount(b,s,o) 불 켜기 · evCountOff() 숨기기. B 초록 / S 노랑 / O 빨강.
   아웃 불은 3개(실제 전광판은 2개지만 쓰리아웃이 보이게). 3개 다 켜지면 번쩍여요. */
var EVCOUNT={el:null,n:{b:3,s:2,o:3},cur:{b:0,s:0,o:0}};
function evCountEl(){
  if(EVCOUNT.el)return EVCOUNT.el;
  var el=EVCOUNT.el=document.createElement('div');el.className='evcount';el.setAttribute('aria-hidden','true');
  ['b','s','o'].forEach(function(k){var r=document.createElement('div');r.className='r '+k;r.innerHTML='<b>'+k.toUpperCase()+'</b>'+new Array(EVCOUNT.n[k]+1).join('<i></i>');el.appendChild(r)});
  document.body.appendChild(el);return el;
}
function evCount(b,s,o){
  var el=evCountEl(),v={b:b,s:s,o:o};el.classList.add('on');
  ['b','s','o'].forEach(function(k){var r=el.querySelector('.'+k),ii=r.querySelectorAll('i');
    for(var i=0;i<ii.length;i++){var on=i<v[k],was=ii[i].classList.contains('lit');ii[i].classList.toggle('lit',on);
      if(on&&!was){ii[i].classList.remove('pop');void ii[i].offsetWidth;ii[i].classList.add('pop')}}
    r.classList.toggle('full',v[k]>=EVCOUNT.n[k]&&k==='o')});
  EVCOUNT.cur=v;
}
function evCountOff(){if(!EVCOUNT.el)return;EVCOUNT.el.classList.remove('on');evCount0()}
function evCount0(){EVCOUNT.el.querySelectorAll('i').forEach(function(i){i.classList.remove('lit','pop')});EVCOUNT.el.querySelectorAll('.r').forEach(function(r){r.classList.remove('full')})}
