#!/usr/bin/env python3
"""문학기념관 짤의 '벽에 걸 사본'을 만들고, 액자 모양(16:9 / 1:1)을 정한다 (패치 AT, AW).

memorial/photos/<이름>.jpg(원본, 크게 보기·저장용) → memorial/photos/w/<이름>.jpg(벽 액자용 사본).

액자 모양 (패치 AW):
  · 업로드 화면은 16:9가 아닌 짤의 양옆을 똑같이 하얗게 채워 올려요.
    그 하얀 여백(좌우가 같은 폭의 새하얀 세로 줄)을 빼고 '진짜 내용'의 가로:세로를 재요.
  · 내용이 4:3(SQ_UNDER)보다 좁으면 1:1 액자 → photos.json에 "frame": "sq"
    사본은 하얀 여백을 잘라 낸 내용만 저장(최대 576×576 — 16:9 사본과 같은 선명도). 정사각형에 못 미치는 부분은
    벽에서 그릴 때 흰색으로 채워요(자르지 않음 — 넓은 짤은 위아래, 세로 짤은 양옆에 흰 띠).
  · 그 밖에는 16:9 액자(지금처럼 1024×576 사본), "frame" 줄은 지움.

원본보다 오래됐거나 없는 사본만 새로 만든다. 짤을 반영할 때마다 한 번 돌리면 된다:
  python3 tools/thumbs.py          (새 짤만)
  python3 tools/thumbs.py --all    (전부 다시)"""
import json, pathlib, sys
from PIL import Image

SQ_UNDER = 4 / 3   # 내용 비율이 이보다 좁으면 1:1 액자
WHITE = 245        # 이 밝기 이상이면 '하얀 여백'
SAME = 12          # 왼쪽·오른쪽 여백 폭 차이가 이 정도 이하일 때만 업로드 여백으로 봄

R = pathlib.Path(__file__).resolve().parent.parent / 'memorial'
out = R / 'photos' / 'w'; out.mkdir(exist_ok=True)
everything = '--all' in sys.argv


def side_margins(im):
    """좌우 하얀 여백 폭(픽셀). 양쪽이 같지 않으면 업로드 여백이 아니라고 보고 (0, 0)."""
    g = im.convert('L'); w, h = g.size; px = g.load()

    def white_col(x):
        return all(px[x, y] >= WHITE for y in range(0, h, 3))

    L = 0
    while L < w // 2 and white_col(L): L += 1
    Rm = 0
    while Rm < w // 2 and white_col(w - 1 - Rm): Rm += 1
    if L >= w // 2 or abs(L - Rm) > SAME: return 0, 0
    return L, Rm


jpath = R / 'photos.json'
data = json.loads(jpath.read_text())
made = 0; sq = 0
for p in data['photos']:
    src = R / p['file']; dst = out / src.name
    if not src.exists(): continue
    im = Image.open(src).convert('RGB'); w, h = im.size
    L, Rm = side_margins(im)
    square = (w - L - Rm) / h < SQ_UNDER
    old = p.get('frame')
    if square: p['frame'] = 'sq'; sq += 1
    else: p.pop('frame', None)
    fresh = dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime
    if fresh and not everything and old == p.get('frame'): continue
    if square:
        im = im.crop((L, 0, w - Rm, h)); im.thumbnail((576, 576), Image.LANCZOS)
    else:
        im.thumbnail((1024, 576), Image.LANCZOS)
    im.save(dst, quality=82, optimize=True, progressive=True); made += 1

jpath.write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
print('사본', made, '장 만듦 →', out, '/ 1:1 액자', sq, '장')
