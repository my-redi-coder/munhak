#!/usr/bin/env python3
"""페이지마다 불러오는 파일의 내놓는 이름(맨 바깥 var/function)과 줄 수를 docs/MODULES.md로 정리한다.
stadium.html(3D 야구장) · index.html(로비, 첫 화면) · wall.html(담벼락 페이지). 2026-11-08 패치 AB에서 로비·담벼락도 넣음(전엔 stadium.html만)."""
import pathlib, re
R = pathlib.Path(__file__).resolve().parent.parent
PAGES = [
    ('stadium.html', '3D 야구장', '불러오는 순서대로예요. 뒤 파일은 앞 파일의 이름을 쓸 수 있어요.'),
    ('index.html', '로비(첫 화면)', '3D 야구장과 따로 도는 가벼운 2D 앞마당이에요. 자세한 건 docs/LOBBY.md.'),
    ('wall.html', '담벼락 페이지', '로비에서 3D 없이 담벼락만 여는 페이지예요. js/ui/wall-art.js는 3D 야구장 안 담벼락과 같이 써요.'),
]
out = ['# 모듈 지도 (자동 생성: tools/modmap.py)', '']
total = 0
for page, label, note in PAGES:
    files = re.findall(r'<script src="(?!http)([^"]+)"', (R / page).read_text())
    out += [f'## {label} — `{page}`', '', note, '', '| 파일 | 줄 | 내놓는 이름 |', '|---|---|---|']
    for f in files:
        src = (R / f).read_text()
        names = [mm.group(1) or mm.group(2) for mm in re.finditer(r'^(?:var|let|const|function)\s+([\w$]+)|^(L\.\w+)\s*=', src, re.M)]
        out.append(f'| `{f}` | {src.count(chr(10))} | {", ".join(names[:14])}{" …" if len(names) > 14 else ""} |')
    out.append('')
    total += len(files)
(R / 'docs' / 'MODULES.md').write_text('\n'.join(out))
print('docs/MODULES.md updated,', total, 'files')
