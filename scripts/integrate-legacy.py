"""One-time bridge for the only source supplied upstream: a compiled React bundle.

Does not rewrite React vendor code. Guards ensure a changed upstream bundle fails
instead of silently cutting arbitrary text. New application code lives in learning/.
"""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
file = root / 'app.js'
s = file.read_text(encoding='utf-8')
if s.startswith('import { createLearningComponents }'):
    raise SystemExit('Bridge already installed; do not apply twice.')

def once(old, new):
    global s
    if s.count(old) != 1:
        raise RuntimeError('Unexpected legacy source: ' + old[:90])
    s = s.replace(old, new, 1)

once('{id:`places`,label:`到哪儿玩`,icon:`🧭`,color:`#ed8a52`},', '')
once('{id:`math`,label:`数学专区`,icon:`➕`,color:`#45bfa7`}', '{id:`math`,label:`数学小课堂`,icon:`➕`,color:`#45bfa7`},{id:`thinking`,label:`思维探索`,icon:`💡`,color:`#cf9c4b`},{id:`roadmap`,label:`成长路线`,icon:`🌱`,color:`#399b7e`},{id:`learning-settings`,label:`家长设置`,icon:`⚙️`,color:`#6b879a`}')
once('n===`places`&&(0,x.jsx)(ze,{places:we}),', '')
start, end = s.index(',we=['), s.index(';function Te(')
s = s[:start] + s[end:]
start, end = s.index('function ze('), s.index('function Be(')
s = s[:start] + s[end:]

start, end = s.index('n===`english`&&'), s.index('n===`focus`&&')
s = s[:start] + '([`math`,`english`,`thinking`,`roadmap`,`learning-settings`].includes(n))&&(0,x.jsx)(MarioLearningPage,{section:n,onComplete:gr,onNavigate:_r}),' + s[end:]
once('function Ie(){', 'var {LearningPage:MarioLearningPage,LearningDashboard:MarioLearningDashboard}=createLearningComponents(b);function Ie(){')
start, end = s.index('n===`home`&&(0,x.jsxs)'), s.index('n===`pinyin`&&')
s = s[:start] + 'n===`home`&&(0,x.jsx)(MarioLearningDashboard,{onNavigate:_r,onComplete:gr}),' + s[end:]
once('title:`口算闯关`,desc:`40 题 · 自动批改`', 'title:`数学小课堂`,desc:`看图、计算、讲思路 · 一次一小轮`')
once('desc:`6 句 · 听说跟读`', 'desc:`零基础 · 听懂、回应、生活中用`')
once('label:`英语口语`', 'label:`英语启蒙`')
s = s.replace('项，就能完成全部成长任务 ☀️', '项可点亮全部任务；按精力选做就好 ☀️')
# Discard the retired drill generator and its memoized result; retain unrelated
# legacy literacy/game progression until their original components are available.
start, end = s.index('function Ae('), s.index('var je=')
s = s[:start] + s[end:]
once(',jn=(0,b.useMemo)(()=>Ae(P,On,Dn),[Dn,On,P])', '')
s = 'import { createLearningComponents } from "./learning/view.js";\n' + s
file.write_text(s,encoding='utf-8')
print('Legacy navigation removed; learning routes connected.')
