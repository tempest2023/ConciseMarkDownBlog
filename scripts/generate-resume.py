#!/usr/bin/env python3
"""Render the Markdown resume to a selectable-text PDF. Requires reportlab.
Run: python3 scripts/generate-resume.py
"""
from pathlib import Path
from html import escape
import re
import shutil
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/articles/Blogs/Other/ResumeMarkdown.md'
OUTPUT = ROOT / 'output/pdf/Tao-Ren-Resume.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
# Embed available fonts; ReportLab standard fonts are the portable fallback.
font_dir = Path('/System/Library/Fonts/Supplemental')
if (font_dir / 'Arial.ttf').exists():
    pdfmetrics.registerFont(TTFont('ResumeSans', str(font_dir / 'Arial.ttf')))
    pdfmetrics.registerFont(TTFont('ResumeSans-Bold', str(font_dir / 'Arial Bold.ttf')))
    pdfmetrics.registerFontFamily('ResumeSans', normal='ResumeSans', bold='ResumeSans-Bold', italic='ResumeSans', boldItalic='ResumeSans-Bold')
    BODY_FONT, BOLD_FONT = 'ResumeSans', 'ResumeSans-Bold'
else:
    BODY_FONT, BOLD_FONT = 'Helvetica', 'Helvetica-Bold'
INK = colors.HexColor('#202A35')
ACCENT = colors.HexColor('#24566C')
styles = {
    'body': ParagraphStyle('body', fontName=BODY_FONT, fontSize=9.2, leading=12.4, textColor=INK, spaceAfter=5),
    'name': ParagraphStyle('name', fontName=BOLD_FONT, fontSize=23, leading=27, textColor=INK, spaceAfter=7),
    'section': ParagraphStyle('section', fontName=BOLD_FONT, fontSize=11, leading=14, textColor=ACCENT, spaceBefore=10, spaceAfter=6, keepWithNext=True),
    'entry': ParagraphStyle('entry', fontName=BOLD_FONT, fontSize=9.5, leading=12.5, textColor=INK, spaceBefore=5, spaceAfter=3, keepWithNext=True),
    'bullet': ParagraphStyle('bullet', fontName=BODY_FONT, fontSize=9.2, leading=12.4, textColor=INK, leftIndent=10, firstLineIndent=-8, spaceAfter=4),
}
def inline(s):
    s = escape(s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" color="#24566C">\1</a>', s)
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#CBD4D9'))
    canvas.setLineWidth(0.5)
    canvas.line(43, 35, 569, 35)
    canvas.setFont(BODY_FONT, 8)
    canvas.setFillColor(colors.HexColor('#65717B'))
    canvas.drawString(43, 23, 'Tao Ren | AI Engineer & Researcher')
    canvas.drawRightString(569, 23, str(doc.page))
    canvas.restoreState()

story = []
for line in SOURCE.read_text().splitlines():
    if not line.strip():
        continue
    if line == '<!-- pdf-page-break -->':
        story.append(PageBreak())
        continue
    style = 'body'
    for prefix, candidate in [('### ', 'entry'), ('## ', 'section'), ('# ', 'name'), ('- ', 'bullet')]:
        if line.startswith(prefix):
            line = line[len(prefix):]
            style = candidate
            if style == 'bullet':
                line = '- ' + line
            break
    story.append(Paragraph(inline(line), styles[style]))

doc = SimpleDocTemplate(str(OUTPUT), pagesize=letter, rightMargin=43, leftMargin=43, topMargin=35, bottomMargin=46,
    title='Tao Ren - AI Engineer & Researcher', author='Tao Ren', subject='Agent engineering and AI research resume')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
public = ROOT / 'public/resume/Tao-Ren-Resume.pdf'
public.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(OUTPUT, public)
print(f'Created {OUTPUT}\nPublished asset: {public}')
