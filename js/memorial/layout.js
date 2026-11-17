/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/layout: 자리 계산 + 콩코스 좌표 =================
   · MH.layoutItems(photos): 짤 목록 → 걸 자리(빈 자리 포함) 목록. 구역마다 '짤 수 + 1'칸(최소 MH.MIN_SLOTS칸)
     그리고 구역 길이·통로 양 끝·반지름을 계산해 MH.HALL에 써 넣어요 (통로가 둥근 길이 5.2라디안을 넘지 않게 반지름을 키움)
   · 좌표: s = 통로를 따라간 거리(m, 입구 홀 가운데가 0, 오른쪽 +), r = 원 중심에서의 거리 */
MH.layoutItems=function(photos){
  var H=MH.HALL,g=H.gap,byZ={K:[],A:[],B:[]},cnt={K:0,A:0,B:0},slots={};
  photos.forEach(function(p){if(byZ[p.zone])byZ[p.zone].push(p)});
  ['K','A','B'].forEach(function(z){slots[z]=Math.max(MH.MIN_SLOTS,byZ[z].length+1)});
  var zl=function(n){return 3.6+g*(n-1)+2.8};
  var L=MH.LAY={slots:slots,zoneStart:{},zoneLen:{}};
  L.zoneStart.A=H.zoneStart;L.zoneLen.A=zl(slots.A);
  L.zoneStart.B=L.zoneStart.A+L.zoneLen.A;L.zoneLen.B=zl(slots.B);
  H.endR=L.zoneStart.B+L.zoneLen.B+.5;
  H.endL=H.kStart-g*(slots.K-1)-2.1;
  H.rMid=Math.max(42,(H.endR-H.endL)/5.2);H.rIn=H.rMid-4;H.rOut=H.rMid+4;
  var items=[];
  ['K','A','B'].forEach(function(z){
    for(var k=0;k<slots[z];k++){
      var p=byZ[z][k],it=p?Object.assign({},p):{empty:true};
      it.zone=z;it.s=z==='K'?H.kStart-g*k:L.zoneStart[z]+3.6+g*k;
      if(p){cnt[z]++;it.code=MH.ZONES[z].code+'-'+(cnt[z]<10?'0':'')+cnt[z]}
      items.push(it);
    }
  });
  return items;
};

function mhAt(s,r){var t=s/MH.HALL.rMid;return{x:r*Math.sin(t),z:-r*Math.cos(t),t:t}}
function mhToSR(x,z){return{s:Math.atan2(x,-z)*MH.HALL.rMid,r:Math.hypot(x,z)}}
/* face: in=바깥 벽에서 통로 쪽을 봄, out=안쪽 벽에서 통로 쪽을 봄, cw=오른쪽(+s)을 봄, ccw=왼쪽(-s)을 봄 */
function mhPut(m,s,r,y,face){var p=mhAt(s,r),t=p.t;m.position.set(p.x,y,p.z);
  m.rotation.y=face==='in'?-t:face==='out'?Math.PI-t:face==='cw'?Math.atan2(Math.cos(t),Math.sin(t)):Math.atan2(-Math.cos(t),-Math.sin(t));return m}
/* 위치가 어느 구역인지: K(최광야구)·H(입구 홀)·A·B… */
function mhPlaceAt(s){
  var H=MH.HALL,L=MH.LAY;if(s<=H.portalS)return'K';if(s<H.zoneStart)return'H';
  for(var i=MH.OPEN.length-1;i>=0;i--){var z=MH.OPEN[i];if(s>=L.zoneStart[z])return z}
  return'H';
}
