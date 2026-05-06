from pathlib import Path
from zipfile import ZipFile
import re
import xml.etree.ElementTree as ET

DOCX = Path(r"C:\Users\SV STORE\Downloads\05042026_DA_QLTT (2).docx")
NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
}


def qn(tag):
    prefix, local = tag.split(":")
    return f"{{{NS[prefix]}}}{local}"


def p_text(p):
    return "".join(t.text or "" for t in p.findall(".//w:t", NS))


def p_style(p):
    style = p.find("./w:pPr/w:pStyle", NS)
    return style.get(qn("w:val")) if style is not None else ""


def has_drawing(p):
    return p.find(".//w:drawing", NS) is not None


def is_field_para(p):
    return p.find(".//w:fldChar", NS) is not None or p.find(".//w:instrText", NS) is not None


with ZipFile(DOCX) as z:
    xml = z.read("word/document.xml")

root = ET.fromstring(xml)
body = root.find("w:body", NS)
children = list(body)
paras = [c for c in children if c.tag == qn("w:p")]
tables = [c for c in children if c.tag == qn("w:tbl")]

print(f"FILE: {DOCX}")
print(f"Paragraphs: {len(paras)}")
print(f"Tables: {len(tables)}")
print(f"Images/drawings in paragraphs: {sum(1 for p in paras if has_drawing(p))}")
print(f"Field paragraphs: {sum(1 for p in paras if is_field_para(p))}")
print()

print("HEADINGS / LIKELY STRUCTURE:")
for i, p in enumerate(paras):
    text = p_text(p).strip()
    style = p_style(p)
    if style.startswith("Heading") or re.match(r"^(CHƯƠNG|Chương|MỤC LỤC|DANH MỤC|BẢNG|LỜI|KẾT LUẬN|TÀI LIỆU)", text):
        print(f"{i:04d} [{style or '-'}] {text[:140]}")
print()

print("CAPTIONS:")
for i, c in enumerate(children):
    if c.tag != qn("w:p"):
        continue
    text = p_text(c).strip()
    if re.match(r"^(Hình|Bảng|Biểu đồ|Sơ đồ)\s+\d", text, flags=re.I):
        prev_kind = "table" if i > 0 and children[i - 1].tag == qn("w:tbl") else "para"
        next_kind = "table" if i + 1 < len(children) and children[i + 1].tag == qn("w:tbl") else "para"
        prev_draw = i > 0 and children[i - 1].tag == qn("w:p") and has_drawing(children[i - 1])
        next_draw = i + 1 < len(children) and children[i + 1].tag == qn("w:p") and has_drawing(children[i + 1])
        print(f"child {i:04d}: {text[:140]} | prev={prev_kind}{'/drawing' if prev_draw else ''}, next={next_kind}{'/drawing' if next_draw else ''}")
print()

print("MANUAL BULLETS:")
for i, p in enumerate(paras):
    text = p_text(p).strip()
    if text.startswith(("•", "-", "–", "+", "*")):
        print(f"{i:04d} {text[:120]}")
