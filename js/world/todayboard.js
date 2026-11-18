/* 출처: SSG 팬 레디코더의 문학야구장 (가져다 써도 되지만 돈 받고 쓰면 안 돼요. 'SSG 팬 레디코더의 문학야구장 참조'를 남겨 주세요) */
/* ================= 기간 한정 빅보드 (2026-11-18 ~ 11-30) =================
   TD.FROM~TD.TO(한국 날짜, 양끝 포함) 동안만 빅보드 평소 화면(bbScreenTex)을 '외야의 중심' 화면으로 바꿔요.
   - 원래 화면은 따로 복사해 두었다가, 날짜가 지나면(1분마다 확인) 그대로 되돌려요.
   - 이벤트 화면(bbshow.js)이 끝나면 bbScreenTex로 돌아오니 이벤트도 그대로 돌아가요.
   - 미리 보기: 주소 끝에 ?bbday=1 을 붙이면 날짜와 상관없이 켜져요.
   빅보드 앞 공중 컨페티는 world/confetti.js. */
var TD={FROM:'2026-11-18',TO:'2026-11-30',on:false,chk:0,bak:null};
TD.LINES={no:'No.54',a:'무낙에서 정라까지',b:'란더스 외야의 중심!!!!',c:'- 9시의 남자도 환영 -'};
function tdIsDay(){if(/[?&]bbday=1/.test(location.search))return true;var d=new Date(Date.now()+9*36e5).toISOString().slice(0,10);return d>=TD.FROM&&d<=TD.TO}

/* 화면 그림: 빨간 경기장 조명 바탕 + 왼쪽 54번 유니폼 + 오른쪽 큰 문구 */
function tdDraw(x,w,h){
  var BH='"Black Han Sans","Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  // 바탕: 빨강 그라데이션 + 위쪽 조명 번짐 + 관중석 점무늬 + 가장자리 어둡게
  var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#e5263b');g.addColorStop(.55,'#c5162c');g.addColorStop(1,'#7e0a19');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(var i=0;i<7;i++){var lx=w*(.08+i*.14),rg=x.createRadialGradient(lx,-20,4,lx,-20,h*.7);rg.addColorStop(0,'rgba(255,236,220,.32)');rg.addColorStop(1,'rgba(255,236,220,0)');x.fillStyle=rg;x.fillRect(0,0,w,h)}
  x.fillStyle='rgba(255,255,255,.06)';for(var r=0;r<9;r++)for(var c=0;c<90;c++){var px=c*23+(r%2)*11,py=h*.52+r*30;x.beginPath();x.arc(px,py,4+r*.5,0,TAU);x.fill()}
  var vg=x.createRadialGradient(w*.5,h*.45,h*.3,w*.5,h*.5,w*.6);vg.addColorStop(0,'rgba(60,0,10,0)');vg.addColorStop(1,'rgba(60,0,10,.45)');x.fillStyle=vg;x.fillRect(0,0,w,h);
  // 비스듬한 빛줄기
  x.save();x.globalAlpha=.08;x.fillStyle='#fff';for(i=0;i<5;i++){x.beginPath();var sx=w*.3+i*260;x.moveTo(sx,0);x.lineTo(sx+90,0);x.lineTo(sx-140,h);x.lineTo(sx-230,h);x.fill()}x.restore();
  tdJersey(x,w*.17,h*.54,h*.86,BH);
  // 문구 (오른쪽 큰 덩어리, 가운데 정렬)
  var cx=w*.62;x.textAlign='center';x.textBaseline='alphabetic';x.lineJoin='round';
  function line(t,size,y,fill,maxW){x.font=size+'px '+BH;var s=Math.min(1,maxW/x.measureText(t).width);x.save();x.translate(cx,y);x.scale(s,1);
    x.fillStyle='rgba(70,0,12,.5)';x.fillText(t,6,8);x.fillStyle=fill;x.fillText(t,0,0);x.restore();return x.measureText(t).width*s}
  x.font='64px '+BH;var aw=line(TD.LINES.a,150,h*.47,'#ffffff',w*.66);
  x.save();x.textAlign='left';x.font='60px '+BH;x.fillStyle='#ffe9a8';x.fillText(TD.LINES.no,cx-aw/2,h*.17);
  x.fillStyle='rgba(255,255,255,.75)';x.fillRect(cx-aw/2+x.measureText(TD.LINES.no).width+24,h*.17-24,aw-x.measureText(TD.LINES.no).width-24,5);x.restore();
  line(TD.LINES.b,118,h*.72,'#ffffff',w*.66);
  x.save();x.font='50px '+BH;x.textAlign='center';x.fillStyle='rgba(255,236,200,.92)';x.fillText(TD.LINES.c,cx,h*.9);x.restore();
}
/* 54번 유니폼(등 쪽): 흰 바탕, 빨간 테두리, 빨간 54 */
function tdJersey(x,cx,cy,H,BH){
  var W=H*1.15;x.save();x.translate(cx,cy);
  var sp=x.createRadialGradient(0,0,10,0,0,H*.75);sp.addColorStop(0,'rgba(255,240,230,.45)');sp.addColorStop(1,'rgba(255,240,230,0)');x.fillStyle=sp;x.fillRect(-H,-H,H*2,H*2);
  x.rotate(-.05);
  function body(){x.beginPath();x.moveTo(-W*.22,-H*.46);x.quadraticCurveTo(0,-H*.4,W*.22,-H*.46);x.lineTo(W*.5,-H*.3);x.lineTo(W*.42,-H*.04);x.lineTo(W*.3,-H*.1);x.lineTo(W*.31,H*.46);x.lineTo(-W*.31,H*.46);x.lineTo(-W*.3,-H*.1);x.lineTo(-W*.42,-H*.04);x.lineTo(-W*.5,-H*.3);x.closePath()}
  x.shadowColor='rgba(60,0,10,.45)';x.shadowBlur=30;x.shadowOffsetY=12;body();x.fillStyle='#fbfaf6';x.fill();x.shadowColor='transparent';
  x.lineWidth=9;x.strokeStyle='#c8102e';body();x.stroke();
  x.textAlign='center';x.textBaseline='middle';x.font=Math.round(H*.48)+'px '+BH;x.lineJoin='round';x.lineWidth=12;x.strokeStyle='#ffffff';
  x.fillStyle='#c8102e';x.fillText('54',0,H*.1);x.lineWidth=3;x.strokeStyle='#14213d';x.strokeText('54',0,H*.1);x.fillText('54',0,H*.1);
  x.restore();
}
function tdApply(on){
  var cv=bbScreenTex.image,x=cv.getContext('2d');
  if(!TD.bak){TD.bak=document.createElement('canvas');TD.bak.width=cv.width;TD.bak.height=cv.height;TD.bak.getContext('2d').drawImage(cv,0,0)}
  if(on)tdDraw(x,cv.width,cv.height);else{x.clearRect(0,0,cv.width,cv.height);x.drawImage(TD.bak,0,0)}
  bbScreenTex.needsUpdate=true;TD.on=on;if(window.cfShow)cfShow(on);
}
function tdTick(dt){TD.chk+=dt;if(TD.chk<60)return;TD.chk=0;var want=tdIsDay();if(want!==TD.on)tdApply(want)}
(function(){
  if(!tdIsDay())return;tdApply(true);
  // 글꼴이 늦게 오면 받은 뒤 한 번 더 그려요
  if(document.fonts&&document.fonts.load)document.fonts.load('60px "Black Han Sans"',TD.LINES.no+TD.LINES.a+TD.LINES.b+TD.LINES.c).then(function(){if(TD.on)tdApply(true)}).catch(function(){});
})();
