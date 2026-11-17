#!/usr/bin/env python3
"""문학기념관 짤의 '벽에 걸 사본'을 만든다 (패치 AT).
memorial/photos/<이름>.jpg(원본, 크게 보기·저장용) → memorial/photos/w/<이름>.jpg(1024×576 안쪽, 벽 액자용).
원본보다 오래됐거나 없는 사본만 새로 만든다. 짤을 반영할 때마다 한 번 돌리면 된다:  python3 tools/thumbs.py"""
import json, pathlib
from PIL import Image
R = pathlib.Path(__file__).resolve().parent.parent / 'memorial'
out = R / 'photos' / 'w'; out.mkdir(exist_ok=True)
made = 0
for p in json.loads((R / 'photos.json').read_text())['photos']:
    src = R / p['file']; dst = out / src.name
    if not src.exists() or (dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime):
        continue
    im = Image.open(src).convert('RGB'); im.thumbnail((1024, 576), Image.LANCZOS)
    im.save(dst, quality=82, optimize=True, progressive=True); made += 1
print('사본', made, '장 만듦 →', out)
