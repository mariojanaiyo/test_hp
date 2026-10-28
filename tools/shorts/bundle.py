#!/usr/bin/env python3
"""public/shorts を1枚のHTMLにまとめる(Claudeアーティファクトに公開する用)。
使い方: python3 tools/shorts/bundle.py 出力先.html"""
import re,sys,pathlib
d=pathlib.Path(__file__).resolve().parents[2]/'public'/'shorts'
out=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'tsunagari.html')
css=(d/'style.css').read_text().replace('height:100dvh','height:100%')+'\n.hint{display:none}\n'
body=re.search(r'<body>(.*)</body>',(d/'index.html').read_text(),re.S).group(1)
body=re.sub(r'<script src="[^"]+"></script>','',body)
html=('<title>つながり</title>\n'
 '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
 '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
 '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">\n'
 '<style>'+css+'</style>\n'+body+'\n<script>'+(d/'scenes.js').read_text()+'</script>\n<script>'+(d/'app.js').read_text()+'</script>\n')
out.write_text(html)
print('wrote',out,len(html),'bytes')
