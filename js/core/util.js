var $=function(id){return document.getElementById(id)};
var TAU=Math.PI*2;
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function damp(a,b,k,dt){return a+(b-a)*(1-Math.exp(-k*dt))}
var store={get:function(k,d){try{var v=localStorage.getItem('munhak:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem('munhak:'+k,JSON.stringify(v))}catch(e){}}};
var reduceMotion=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function bootFail(msg){var b=$('boot');b.classList.remove('out');$('bootMsg').textContent=msg;var d=b.querySelector('.dot');if(d)d.style.display='none'}
if(!window.THREE){bootFail('3D 화면을 불러오지 못했어요. 연결을 확인하고 새로고침해 주세요.');throw new Error('three.js 없음')}
