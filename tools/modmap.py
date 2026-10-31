#!/usr/bin/env python3
"""index.html이 불러오는 파일마다 내놓는 이름(맨 바깥 var/function)과 줄 수를 docs/MODULES.md로 정리한다."""
import pathlib, re
R = pathlib.Path(__file__).resolve().parent.parent
files = re.findall(r'<script src="(?!http)([^"]+)"', (R / 'index.html').read_text())
out = ['# 모듈 지도 (자동 생성: tools/modmap.py)', '', 'index.html이 불러오는 순서대로예요. 뒤 파일은 앞 파일의 이름을 쓸 수 있어요.', '', '| 파일 | 줄 | 내놓는 이름 |', '|---|---|---|']
for f in files:
    src = (R / f).read_text()
    names = [m.group(1) for m in re.finditer(r'^(?:var|function)\s+([\w$]+)', src, re.M)]
    head = re.search(r'/\*\s*=+\s*(.*?)\s*=+', src)
    out.append(f'| `{f}` | {src.count(chr(10))} | {", ".join(names[:14])}{" …" if len(names) > 14 else ""} |')
(R / 'docs' / 'MODULES.md').write_text('\n'.join(out) + '\n')
print('docs/MODULES.md updated,', len(files), 'files')
