/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/corner-items: 전시 코너의 3D 물건 =================
   받침대·유리장·설명 카드 → 등신대 · 유니폼 세트 · 가방 선반 · 사인과 현금. 모두 '코너 기준 좌표'(끝 벽 가운데 바닥이 0, x=오른쪽, z=통로 쪽)로 만들어요.
   필요: memorial/corner-art.js */
var mhcStoneTex=mhcNoiseTex(MHC.stone,.35,5);mhcStoneTex.wrapS=mhcStoneTex.wrapT=THREE.RepeatWrapping;
function mhcPedestal(w,h,d){var g=new THREE.Group();
  var st=mhcStoneTex.clone();st.needsUpdate=true;st.repeat.set(w*1.5,h*1.5);
  mhcCast(mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mhcStd({map:st,roughness:.95})),0,h/2,0,g));
  mhcCast(mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(w+.06,.07,d+.06),mhcStd({color:0xbfae91,roughness:.5,metalness:.2})),0,h+.035,0,g));
  mhcCast(mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(w-.1,.04,d-.1),mhcStd({color:MHC.slab,roughness:.8})),0,h+.09,0,g));
  return g}
function mhcGlass(w,h,d){var g=new THREE.Group();
  var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:0xdff5ef,transparent:true,opacity:.1,roughness:.05,metalness:.1,depthWrite:false}));
  mhcAdd(m,0,h/2,0,g);
  var e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d)),new THREE.LineBasicMaterial({color:MHC.glassEdge}));mhcAdd(e,0,h/2,0,g);
  /* 유리 반사 한 줄 */
  mhcAdd(new THREE.Mesh(new THREE.PlaneGeometry(.05,h*.9),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.16,depthWrite:false})),-w*.3,h/2,d/2+.002,g);
  return g}
function mhcCaption(title,sub){var t=mhLiveTex(420,260,function(x,w,h){x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle=MHC.ink;x.font='700 34px '+MHF.kr;x.fillText(title,26,56);
  x.fillStyle=MHC.mute;x.font='400 20px '+MHF.kr;x.fillText(sub||'',26,90);x.fillStyle='#b9b4ab';for(var i=0;i<6;i++)x.fillRect(26,120+i*20,(w-52)*(i===5?.5:.92),6)});
  var m=new THREE.Mesh(new THREE.BoxGeometry(.34,.21,.008),[0,0,0,0,mhcStd({map:t,roughness:.7}),0].map(function(v){return v||mhcStd({color:0xe8e4dc})}));
  m.rotation.x=-.35;return mhcCast(m)}

/* 7-1. 등신대: 사용자 그림(memorial/corner/cutout.webp, 흰 테두리까지 잘라 둔 것)을 납작한 판으로 세움 + 금속 받침 */
function mhcCutout(){var g=new THREE.Group(),c=MHC.cutout,H=c.h,W=H*c.ratio;
  var t=new THREE.TextureLoader().load(c.src);t.anisotropy=4;
  /* 앞면 그림 + 뒷면은 회색 판지 */
  var front=new THREE.Mesh(new THREE.PlaneGeometry(W,H),mhcStd({map:t,alphaTest:.5,roughness:.6}));
  mhcCast(mhcAdd(front,0,H/2+.035,.006,g));
  var back=new THREE.Mesh(new THREE.PlaneGeometry(W,H),mhcStd({map:t,alphaTest:.5,color:0x9a958c,roughness:.9}));back.rotation.y=Math.PI;
  mhcCast(mhcAdd(back,0,H/2+.035,-.006,g));
  mhcCast(mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(W+.15,.035,.45),mhcStd({color:0xc7c9cc,metalness:.8,roughness:.3})),0,.017,0,g));
  mhcCast(mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.04,.8,.04),mhcStd({color:0x9a9da1,metalness:.7,roughness:.4})),0,.45,-.12,g)).rotation.x=.25;
  return g}

/* 7-2. 유니폼·헬멧·장갑 세트 */
function mhcJerseyShape(){var s=new THREE.Shape();
  s.moveTo(-.27,0);s.lineTo(.27,0);s.lineTo(.28,.48);s.lineTo(.43,.42);s.lineTo(.47,.56);s.lineTo(.27,.72);s.lineTo(.09,.75);
  s.quadraticCurveTo(0,.66,-.09,.75);s.lineTo(-.27,.72);s.lineTo(-.47,.56);s.lineTo(-.43,.42);s.lineTo(-.28,.48);s.closePath();return s}
function mhcHelmet(){var g=new THREE.Group(),red=mhcStd({color:0x7e081b,roughness:.35,metalness:.2});
  var dome=new THREE.Mesh(new THREE.SphereGeometry(.13,32,16,0,Math.PI*2,0,Math.PI/2),red);dome.scale.set(1,1,1.12);mhcAdd(dome,0,0,0,g);
  var brim=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.02,32,1,false,-.9,1.8),red);mhcAdd(brim,0,.005,.03,g);
  var flap=new THREE.Mesh(new THREE.SphereGeometry(.075,16,10,0,Math.PI*2,0,Math.PI/2),red);flap.rotation.z=Math.PI/2;flap.scale.set(1,.6,1);mhcAdd(flap,.12,-.02,.0,g);
  mhcAdd(new THREE.Mesh(new THREE.TorusGeometry(.128,.008,6,32,Math.PI*2),mhcStd({color:0x1a1a1a})),0,.002,0,g).rotation.x=Math.PI/2;
  mhcAdd(new THREE.Mesh(new THREE.CircleGeometry(.03,16),mhcStd({color:0xffffff})),.0,.08,.108,g).rotation.x=-.6;
  return mhcCast(g)}
function mhcGlove(){var g=new THREE.Group(),wh=mhcStd({color:0xf4f4f2,roughness:.7}),rd=mhcStd({color:0xc8102e,roughness:.5});
  var palm=new THREE.Mesh(new THREE.BoxGeometry(.1,.025,.13),wh);mhcAdd(palm,0,.013,0,g);
  for(var i=0;i<4;i++)mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.07),wh),-.035+i*.023,.012,-.095,g);
  mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.06),wh),.06,.012,-.02,g).rotation.y=-.7;
  mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.105,.03,.035),rd),0,.016,.07,g);
  return mhcCast(g)}
function mhcJerseySet(){var g=new THREE.Group();
  g.add(mhcPedestal(1.35,.92,.95));
  var top=1.03;
  /* 유니폼: 앞뒤 그림 + 옆은 흰색 */
  var jt=mhcJerseyTex();jt.repeat.set(1/.84,1/.75);jt.offset.set(.5,0);
  var geo=new THREE.ExtrudeGeometry(mhcJerseyShape(),{depth:.05,bevelEnabled:true,bevelThickness:.012,bevelSize:.01,bevelSegments:2});
  var j=new THREE.Mesh(geo,[mhcStd({map:jt,roughness:.75}),mhcStd({color:0xf6f6f4,roughness:.8})]);
  mhcCast(mhcAdd(j,0,top+.62,-.05,g));
  mhcAdd(new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.62,8),mhcStd({color:0xb8babd,metalness:.8,roughness:.3})),0,top+.31,-.08,g);
  mhcAdd(new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.015,24),mhcStd({color:0xb8babd,metalness:.8,roughness:.3})),0,top+.008,-.08,g);
  var h=mhcHelmet();h.rotation.y=.7;mhcAdd(h,-.42,top+.005,.18,g);
  var gl=mhcGlove();gl.rotation.y=-.3;mhcAdd(gl,.08,top,.28,g);var gl2=mhcGlove();gl2.rotation.y=-.1;gl2.scale.x=-1;mhcAdd(gl2,.2,top+.026,.25,g);
  mhcAdd(mhcGlass(1.3,1.45,.9),0,top,0,g);
  var cp=mhcCaption('유니폼·헬멧·장갑','2026 시즌 착용');mhcAdd(cp,-.42,.8,.5,g);
  return g}

/* 7-3. 가방(갈색 무늬 보스턴백) — 벽 선반 위 유리장 */
function mhcBag(){var g=new THREE.Group(),L=.56,R=.16;
  var bt=mhcBagTex();bt.wrapS=bt.wrapT=THREE.RepeatWrapping;
  var leather=mhcStd({color:0xc98f52,roughness:.55}),body=mhcStd({map:bt,roughness:.6});
  var cyl=new THREE.Mesh(new THREE.CylinderGeometry(R,R,L,40,1,true),body);cyl.rotation.z=Math.PI/2;cyl.scale.set(1,1,1);mhcAdd(cyl,0,0,0,g);
  [-1,1].forEach(function(s){var cap=new THREE.Mesh(new THREE.SphereGeometry(R,32,16),body);cap.scale.set(.42,1,1);mhcAdd(cap,s*L/2,0,0,g);
    mhcAdd(new THREE.Mesh(new THREE.TorusGeometry(R,.012,8,40),leather),s*L/2,0,0,g).rotation.y=Math.PI/2;
    /* 손잡이 고정 가죽 탭 */
    /* 손잡이(길이 방향 고리, 앞·뒤 한 개씩) + 고정 가죽 탭 */
    mhcAdd(new THREE.Mesh(new THREE.TorusGeometry(.12,.011,8,28,Math.PI),leather),0,R-.03,s*.05,g).rotation.x=s*.25;
    [-1,1].forEach(function(e){mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.06,.012,.035),leather),e*.12,R-.012,s*.05,g)});
  });
  /* 아래 가죽 띠, 자물쇠, 이름표 */
  mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(L+.05,.02,.2),leather),0,-R+.02,0,g);
  mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.04,.05,.02),mhcStd({color:0xd4af37,metalness:.9,roughness:.25})),.2,R-.05,R*.8,g);
  var tag=new THREE.Mesh(new THREE.BoxGeometry(.07,.11,.008),leather);tag.rotation.z=.2;mhcAdd(tag,.24,R-.02,R*.9,g);
  mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(L*.9,.012,.012),mhcStd({color:0xd4af37,metalness:.9,roughness:.3})),0,R*.6,R*.78,g);
  return mhcCast(g)}
function mhcBagShelf(){var g=new THREE.Group(),shelfY=1.98;
  /* 벽에 붙은 선반(돌 받침 + 유리장) */
  var sh=new THREE.Mesh(new THREE.BoxGeometry(1.05,.1,.62),mhcStd({color:0xbfa98a,roughness:.5,metalness:.15}));mhcCast(mhcAdd(sh,0,shelfY,.31,g));
  mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.9,.03,.5),mhcStd({color:MHC.slab})),0,shelfY+.065,.31,g);
  var bag=mhcBag();bag.rotation.y=-.12;mhcAdd(bag,0,shelfY+.08+.16,.33,g);
  mhcAdd(mhcGlass(1.0,.85,.6),0,shelfY+.05,.31,g);
  /* 선반 아래 유리 기둥(사진처럼 아래 유리장과 이어진 느낌) */
  mhcAdd(mhcGlass(1.0,shelfY-1.05,.6),0,1.05,.31,g);
  /* 작은 이름표 */
  var lb=mhLiveTex(300,60,function(x,w,h){x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle=MHC.ink;x.font='700 26px '+MHF.kr;x.fillText('명품 가방',14,40)});
  mhcAdd(new THREE.Mesh(new THREE.PlaneGeometry(.26,.05),mhcStd({map:lb})),-.28,shelfY+.07,.625,g);
  return g}

/* 7-4. 사인판·공·현금 */
function mhcCashStack(){var g=new THREE.Group(),bw=.24,bd=.106,bh=.035,top=mhcBillTex(),ed=mhcEdgeTex();
  var mats=[mhcStd({map:ed}),mhcStd({map:ed}),mhcStd({map:top,roughness:.8}),mhcStd({color:0xe0c78f}),mhcStd({map:ed}),mhcStd({map:ed})];
  for(var i=0;i<4;i++){var b=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd),mats);b.rotation.y=(i%2?.03:-.02);mhcAdd(b,(i%2)*.004,bh/2+i*bh,0,g)}
  return mhcCast(g)}
function mhcCashCase(){var g=new THREE.Group();
  g.add(mhcPedestal(1.4,.92,.9));var top=1.03;
  /* 사인판(살짝 뒤로 기댐) */
  var board=new THREE.Mesh(new THREE.BoxGeometry(.56,.43,.03),[0,0,0,0,mhcStd({map:mhcSignTex(),roughness:.85}),0].map(function(v){return v||mhcStd({color:0xd8d3c8})}));
  board.rotation.x=-.12;mhcCast(mhcAdd(board,-.2,top+.23,-.15,g));
  /* 공 + 받침 */
  var ball=new THREE.Mesh(new THREE.SphereGeometry(.045,24,16),mhcStd({map:mhcBallTex(),roughness:.6}));mhcCast(mhcAdd(ball,.14,top+.29,-.1,g));
  mhcAdd(new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.02,16),mhcStd({color:0xd8d8d8,transparent:true,opacity:.6})),.14,top+.235,-.1,g);
  /* 현금: 하얀 받침 위에 오만원 다발 */
  mhcCast(mhcAdd(new THREE.Mesh(new THREE.BoxGeometry(.32,.07,.2),mhcStd({color:0xf1ece2,roughness:.7})),.4,top+.035,.05,g));
  var cs=mhcCashStack();cs.rotation.y=-.08;cs.scale.setScalar(1.25);mhcAdd(cs,.4,top+.07,.05,g);
  mhcAdd(mhcGlass(1.35,.62,.86),0,top,0,g);
  mhcAdd(mhcCaption('야구공 사인','본인 직접 사인'),-.42,.8,.47,g);
  mhcAdd(mhcCaption('우승 상금','championship prize'),.36,.8,.47,g);
  return g}

