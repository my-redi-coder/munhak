/* ================= 빅보드 화면 연출 =================
   이벤트 때 빅보드 화면(BB.scr)을 잠깐 바꿔 끼워요. 매 프레임 캔버스에 다시 그려요.
   bbShow('wave')    : 큰 파도가 밀려와 부서지는 영상 (뒤로 수평선의 배)
   bbShow('homerun') : 파란 바탕에 흰 글씨 HOME RUN
   bbShowOff()       : 원래 화면(bbScreenTex)으로 돌아가요. */
var BBS={kind:null,t:0,W:1024,H:Math.round(1024*BB.H/BB.W),spray:[]};
BBS.cv=document.createElement('canvas');BBS.cv.width=BBS.W;BBS.cv.height=BBS.H;BBS.x=BBS.cv.getContext('2d');
BBS.tex=new THREE.CanvasTexture(BBS.cv);BBS.tex.anisotropy=maxAniso;
function bbShow(kind){BBS.kind=kind;BBS.t=0;BBS.spray=[];BB.scr.material.map=BBS.tex;BB.scr.material.needsUpdate=true;bbDraw()}
function bbShowOff(){BBS.kind=null;BB.scr.material.map=bbScreenTex;BB.scr.material.needsUpdate=true}
function bbShowTick(dt){if(!BBS.kind)return;BBS.t+=dt;bbDraw()}
function bbDraw(){(BBS.kind==='wave'?bbWave:BBS.kind==='kkk'?bbKKK:bbHomerun)(BBS.x,BBS.W,BBS.H,BBS.t);BBS.tex.needsUpdate=true}

/* 파도: 0~1.2초 너울 → 1.2~2.9초 큰 파도가 솟아 말려 들어옴 → 2.9초 부서지며 물보라 */
function bbWave(x,w,h,t){
  var g=x.createLinearGradient(0,0,0,h*.55);g.addColorStop(0,'#5fa8e0');g.addColorStop(1,'#cfe8f5');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='rgba(255,250,225,.9)';x.beginPath();x.arc(w*.82,h*.2,26,0,TAU);x.fill();
  var hz=h*.46;
  // 수평선의 배 + 뱃고동 증기
  var sx=w*.2+t*6;x.fillStyle='#3b4a58';x.fillRect(sx-46,hz-14,92,12);x.beginPath();x.moveTo(sx-46,hz-2);x.lineTo(sx+46,hz-2);x.lineTo(sx+38,hz+4);x.lineTo(sx-40,hz+4);x.fill();
  x.fillStyle='#eae6da';x.fillRect(sx-20,hz-26,34,12);x.fillStyle='#c8102e';x.fillRect(sx+2,hz-38,9,14);
  if(t>.3)for(var k=0;k<5;k++){var pu=((t-.3)*1.1+k*.22)%1.1;x.fillStyle='rgba(255,255,255,'+(.75*(1-pu))+')';x.beginPath();x.arc(sx+6+pu*18,hz-42-pu*40,6+pu*16,0,TAU);x.fill()}
  // 먼 바다 층
  [['#2f74b0',hz,4,.8,.012],['#2a679f',hz+22,7,1.3,.018],['#245c8f',hz+50,10,1.9,.022]].forEach(function(L){
    x.fillStyle=L[0];x.beginPath();x.moveTo(0,h);for(var xx=0;xx<=w;xx+=8)x.lineTo(xx,L[1]+Math.sin(xx*L[4]+t*L[3])*L[2]);x.lineTo(w,h);x.fill()});
  // 큰 파도
  var u=clamp((t-1.0)/1.9,0,1),e=u*u*(3-2*u),H=h*(.1+.62*e),cx=w*(.95-.5*e),sw=w*(.34-.08*e),base=h*.88;
  function yAt(xx){var d=(xx-cx)/sw;return base-H*Math.exp(-d*d*(xx<cx?2.6:1))}
  var wg=x.createLinearGradient(0,base-H,0,h);wg.addColorStop(0,'#3fa3c9');wg.addColorStop(.45,'#1f6aa0');wg.addColorStop(1,'#123f6b');
  x.fillStyle=wg;x.beginPath();x.moveTo(0,h);for(var xx=0;xx<=w;xx+=6)x.lineTo(xx,yAt(xx));x.lineTo(w,h);x.fill();
  // 마루의 말림 + 거품
  if(u>.25&&t<3.1){var cy=base-H,r=H*.22*e;x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=10*e+3;x.beginPath();x.arc(cx-r*.6,cy+r,r,-.2,Math.PI*1.25,true);x.stroke();
    x.fillStyle='rgba(255,255,255,.9)';for(k=0;k<26;k++){var fx=cx-r*1.6+k*r*.14,fy=yAt(fx)+rnd(-4,4);x.beginPath();x.arc(fx,fy,rnd(3,8)*e+2,0,TAU);x.fill()}}
  // 부서짐: 물보라 입자 + 하얀 번쩍
  if(t>2.9&&!BBS.spray.length)for(k=0;k<140;k++)BBS.spray.push({x:cx+rnd(-sw*.6,sw*.4),y:base-H*rnd(.4,1),vx:rnd(-260,120),vy:rnd(-420,-60),r:rnd(4,16)});
  var dt=1/60;BBS.spray.forEach(function(p){p.vy+=520*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(p.x,p.y,p.r,0,TAU);x.fill()});
  if(t>2.9){var fl=Math.max(0,1-(t-2.9)/.7);x.fillStyle='rgba(255,255,255,'+(fl*.85)+')';x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.55)';x.fillRect(0,h*.62,w,h*.38)}
}

/* HOME RUN: 파란 파도 바탕에 흰 글씨. 글씨는 튀어나오듯 커졌다 자리 잡고, 테두리 전구가 돌아요 */
function bbSea(x,w,h,t){
  var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2f86d6');g.addColorStop(.5,'#1a5fb4');g.addColorStop(1,'#0c3a85');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(var L=0;L<6;L++){var y0=h*(.12+L*.17),A=8+L*5,sp=.8+L*.35,fq=.010-L*.0008,col=['#3d97e0','#2d84d2','#2272c4','#1a62b2','#12519d','#0b4189'][L];
    x.fillStyle=col;x.beginPath();x.moveTo(0,h);for(var xx=0;xx<=w;xx+=8)x.lineTo(xx,y0+Math.sin(xx*fq+t*sp+L)*A+Math.sin(xx*fq*2.3-t*sp*.6)*A*.35);x.lineTo(w,h);x.fill();
    x.strokeStyle='rgba(255,255,255,'+(.35+L*.05)+')';x.lineWidth=2+L*.6;x.beginPath();for(xx=0;xx<=w;xx+=8){var yy=y0+Math.sin(xx*fq+t*sp+L)*A+Math.sin(xx*fq*2.3-t*sp*.6)*A*.35;xx?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke()}
}
function bbHomerun(x,w,h,t){
  bbSea(x,w,h,t);var i;
  var n=Math.floor(w/26),m=Math.floor(h/26),k=Math.floor(t*14);x.fillStyle='#ffffff';
  for(i=0;i<n;i++){x.globalAlpha=(i+k)%3===0?1:.35;x.beginPath();x.arc(13+i*26,10,5,0,TAU);x.arc(13+i*26,h-10,5,0,TAU);x.fill()}
  for(i=0;i<m;i++){x.globalAlpha=(i+k)%3===0?1:.35;x.beginPath();x.arc(10,13+i*26,5,0,TAU);x.arc(w-10,13+i*26,5,0,TAU);x.fill()}
  x.globalAlpha=1;
  var p=clamp(t/.45,0,1),s=p<1?1.5-.62*p+Math.sin(p*Math.PI)*.12:1+Math.sin(t*5)*.015;
  x.save();x.translate(w/2,h/2+6);x.scale(s,s);x.textAlign='center';x.textBaseline='middle';
  var HF='"Arial Black","Helvetica Neue",Arial,sans-serif';x.font='900 100px '+HF;var fs=Math.min(h*.6,100*w*.78/x.measureText('HOME RUN').width);x.font='900 '+Math.round(fs)+'px '+HF;
  x.lineWidth=14;x.strokeStyle='rgba(6,30,80,.45)';x.strokeText('HOME RUN',6,8);x.fillStyle='#ffffff';x.fillText('HOME RUN',0,0);x.restore();
  if(t<.25){x.fillStyle='rgba(255,255,255,'+(1-t/.25)+')';x.fillRect(0,0,w,h)}
  for(i=0;i<10;i++){var a=t*2+i*.7,px=(i*97+t*40)%w,py=h*.15+((i*53)%60)/60*h*.7,sz=4+3*Math.sin(a*3);x.fillStyle='rgba(255,255,255,'+(.5+.5*Math.sin(a*4))+')';x.fillRect(px-sz,py-1,sz*2,2);x.fillRect(px-1,py-sz,2,sz*2)}
}

/* KKK: 어두운 바탕에 K 세 칸. BBS.n개까지 켜지고, 마지막엔 K가 차례로 번쩍여요 */
function bbKKK(x,w,h,t){
  x.fillStyle='#10151f';x.fillRect(0,0,w,h);
  x.save();x.globalAlpha=.08;x.fillStyle='#ffffff';for(var i=0;i<w;i+=16)x.fillRect(i,0,1,h);x.restore();
  var n=BBS.n||0,HF='"Arial Black","Helvetica Neue",Arial,sans-serif',sw=w/3;
  x.textAlign='center';x.textBaseline='middle';x.font='900 '+Math.round(h*.78)+'px '+HF;
  for(i=0;i<3;i++){
    var cx=sw*i+sw/2,on=i<n,fl=n>=3?Math.max(0,Math.sin(t*6-i*1.1)):0,just=on&&i===n-1&&t<.5;
    if(on){x.fillStyle='rgba(200,16,46,'+(.35+.4*fl)+')';x.fillRect(sw*i+10,10,sw-20,h-20)}
    x.lineWidth=6;x.strokeStyle=on?'#ffffff':'rgba(255,255,255,.18)';x.fillStyle=on?'#ffffff':'rgba(255,255,255,0)';
    var s=just?1.35-.35*(t/.5):1;x.save();x.translate(cx,h/2+6);x.scale(s,s);x.strokeText('K',0,0);x.fillText('K',0,0);x.restore();
  }
}
