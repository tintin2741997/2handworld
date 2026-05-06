from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX = Path(r"C:\Users\SV STORE\Downloads\05042026_DA_QLTT (2).docx")
NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}


def qn(tag):
    prefix, local = tag.split(":")
    return f"{{{NS[prefix]}}}{local}"


def text(el):
    return " ".join("".join(t.text or "" for t in p.findall(".//w:t", NS)).strip()
                    for p in el.findall(".//w:p", NS)).strip()


def p_text(p):
    return "".join(t.text or "" for t in p.findall(".//w:t", NS)).strip()


def has_drawing(p):
    return p.find(".//w:drawing", NS) is not None


with ZipFile(DOCX) as z:
    root = ET.fromstring(z.read("word/document.xml"))

body = root.find("w:body", NS)
children = list(body)

print("DRAWING CONTEXT")
for i, c in enumerate(children):
    if c.tag == qn("w:p") and has_drawing(c):
        print(f"\n--- drawing child {i} ---")
        for j in range(max(0, i - 4), min(len(children), i + 5)):
            kind = "TBL" if children[j].tag == qn("w:tbl") else "PAR"
            mark = ">>" if j == i else "  "
            preview = text(children[j]) if kind == "TBL" else p_text(children[j])
            print(f"{mark} {j:04d} {kind}: {preview[:220]}")

print("\nTABLE CONTEXT")
for i, c in enumerate(children):
    if c.tag == qn("w:tbl"):
        prev = ""
        for k in range(i - 1, -1, -1):
            if children[k].tag == qn("w:p") and p_text(children[k]):
                prev = p_text(children[k])
                break
        first = text(c)
        print(f"{i:04d} prev='{prev[:80]}' | table='{first[:140]}'")
