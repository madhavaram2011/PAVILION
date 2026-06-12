from pathlib import Path
import re

files = [
    'northHimachal.js', 'northRajasthan.js', 'northUPDelhi.js', 'northUttarakhand.js', 'northJKLadakh.js',
    'southKerala.js', 'southKarnataka.js', 'southTamilNadu.js', 'southGoaAP.js', 'westMaharashtra.js', 'westGujarat.js',
    'eastWBOdisha.js', 'eastBiharNortheast.js', 'centralMPChhattisgarh.js', 'northeastExtra.js', 'islands.js', 'remainingMixed.js'
]

header = '''const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                'Jul','Aug','Sep','Oct','Nov','Dec'];

const mc = (...rows) => rows.map((row, i) => ({
  month: MONTHS[i],
  minTemp: row[0],
  maxTemp: row[1],
  rainfall: row[2],
  season: row[3],
}));

'''

for fname in files:
    path = Path(fname)
    text = path.read_text(encoding='utf-8')
    if not text.startswith('const MONTHS ='):
        raise SystemExit(f'{fname} does not start with MONTHS block')
    if header not in text:
        text = re.sub(r"const MONTHS = \[.*?\}\);\n\n", header, text, flags=re.S)
    text = text.replace('const d = [', 'const destinations = [')
    text = text.replace('\nexport default d;', '\nexport default destinations;')
    if 'export default d' in text:
        raise SystemExit(f'{fname} still exports d')
    path.write_text(text, encoding='utf-8')
    print(f'fixed {fname}')
