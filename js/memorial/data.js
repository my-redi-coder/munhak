/* 출처: SSG 팬 레디코더의 문학야구장 (github.com/my-redi-coder/munhak) — 가져다 써도 되지만 돈 받고 쓰는 건 안 돼요. 쓸 땐 'SSG 팬 레디코더의 문학야구장 참조'를 꼭 남겨 주세요 */
/* ================= memorial/data: 짤 목록 불러오기 =================
   memorial/photos.json 을 받아 짤마다 그림 주소(url)를 붙여 돌려줘요. 못 받으면 빈 목록(빈 액자만 있는 기념관)으로 열어요. */
function mhLoadPhotos(){
  return fetch(MH.PHOTOS_URL,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(j){
    var list=(j&&j.photos)||[];
    return list.filter(function(p){return p&&p.file&&p.title&&MH.ZONES[p.zone]}).map(function(p){
      return{id:p.id,title:String(p.title).slice(0,12),zone:p.zone,year:p.year||'-',tags:p.tags||[],people:p.people||[],comment:p.comment||'',url:'memorial/'+p.file};
    });
  }).catch(function(){return[]});
}
