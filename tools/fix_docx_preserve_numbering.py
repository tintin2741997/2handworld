from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import copy
import re
import xml.etree.ElementTree as ET

SRC = Path(r"C:\Users\SV STORE\Downloads\05042026_DA_QLTT (2).docx")
OUT = Path(r"C:\Users\SV STORE\Downloads\05042026_DA_QLTT_chinh_sua_giu_numbering.docx")

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "ct": "http://schemas.openxmlformats.org/package/2006/content-types",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}
for prefix, uri in NS.items():
    if prefix not in ("ct", "rel"):
        ET.register_namespace(prefix, uri)
ET.register_namespace("", NS["ct"])


def qn(tag):
    prefix, local = tag.split(":")
    return f"{{{NS[prefix]}}}{local}"


def el(tag, attrs=None, text=None):
    node = ET.Element(qn(tag), attrs or {})
    if text is not None:
        node.text = text
    return node


def val(value):
    return {qn("w:val"): str(value)}


def text_of(node):
    return "".join(t.text or "" for t in node.findall(".//w:t", NS)).strip()


def p_style(p):
    st = p.find("./w:pPr/w:pStyle", NS)
    return st.get(qn("w:val")) if st is not None else ""


def ensure_ppr(p):
    ppr = p.find("w:pPr", NS)
    if ppr is None:
        ppr = el("w:pPr")
        p.insert(0, ppr)
    return ppr


def set_child(parent, child):
    existing = parent.find(child.tag)
    if existing is not None:
        parent.remove(existing)
    parent.append(child)


def run(text, bold=False, italic=False, size="26"):
    r = el("w:r")
    rpr = el("w:rPr")
    rpr.append(el("w:rFonts", {
        qn("w:ascii"): "Times New Roman",
        qn("w:hAnsi"): "Times New Roman",
        qn("w:eastAsia"): "Times New Roman",
    }))
    if bold:
        rpr.append(el("w:b"))
    if italic:
        rpr.append(el("w:i"))
    rpr.append(el("w:sz", val(size)))
    rpr.append(el("w:szCs", val(size)))
    r.append(rpr)
    t = el("w:t", text=text)
    t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    r.append(t)
    return r


def para(text="", align=None, bold=False, italic=False, size="26"):
    p = el("w:p")
    ppr = ensure_ppr(p)
    if align:
        ppr.append(el("w:jc", val(align)))
    if text:
        p.append(run(text, bold=bold, italic=italic, size=size))
    return p


def page_break():
    p = el("w:p")
    r = el("w:r")
    r.append(el("w:br", {qn("w:type"): "page"}))
    p.append(r)
    return p


def field_para(display, instr):
    p = para()
    rb = el("w:r")
    rb.append(el("w:fldChar", {qn("w:fldCharType"): "begin"}))
    ri = el("w:r")
    instr_node = el("w:instrText", text=instr)
    instr_node.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    ri.append(instr_node)
    rs = el("w:r")
    rs.append(el("w:fldChar", {qn("w:fldCharType"): "separate"}))
    rv = run(display)
    re_ = el("w:r")
    re_.append(el("w:fldChar", {qn("w:fldCharType"): "end"}))
    p.extend([rb, ri, rs, rv, re_])
    return p


def simple_caption(text, align="center", italic=False, bold=False):
    p = para(text, align=align, italic=italic, bold=bold, size="24")
    ppr = ensure_ppr(p)
    ppr.insert(0, el("w:pStyle", val("Caption")))
    return p


def abbrev_table():
    tbl = el("w:tbl")
    tbl_pr = el("w:tblPr")
    tbl_pr.append(el("w:tblW", {qn("w:w"): "9000", qn("w:type"): "dxa"}))
    borders = el("w:tblBorders")
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(el(f"w:{side}", {qn("w:val"): "single", qn("w:sz"): "4", qn("w:space"): "0", qn("w:color"): "999999"}))
    tbl_pr.append(borders)
    tbl.append(tbl_pr)
    rows = [
        ("Từ viết tắt", "Diễn giải"),
        ("API", "Application Programming Interface"),
        ("CSDL", "Cơ sở dữ liệu"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("ERD", "Entity Relationship Diagram"),
        ("UI", "User Interface"),
        ("UC", "Use Case"),
        ("VIP", "Very Important Person"),
    ]
    for i, row in enumerate(rows):
        tr = el("w:tr")
        for value in row:
            tc = el("w:tc")
            tc_pr = el("w:tcPr")
            tc_pr.append(el("w:tcW", {qn("w:w"): "4500", qn("w:type"): "dxa"}))
            tc.append(tc_pr)
            tc.append(para(value, bold=i == 0))
            tr.append(tc)
        tbl.append(tr)
    return tbl


def front_matter():
    # These are intentionally NOT Heading styles, so they cannot affect existing chapter numbering.
    return [
        para("MỤC LỤC", align="center", bold=True, size="32"),
        field_para("Mục lục sẽ được cập nhật khi mở bằng Microsoft Word.", r'TOC \o "1-3" \h \z \u'),
        page_break(),
        para("DANH MỤC HÌNH ẢNH", align="center", bold=True, size="32"),
        field_para("Danh mục hình ảnh sẽ được cập nhật khi mở bằng Microsoft Word.", r'TOC \h \z \c "Hình"'),
        page_break(),
        para("DANH MỤC BẢNG", align="center", bold=True, size="32"),
        field_para("Danh mục bảng sẽ được cập nhật khi mở bằng Microsoft Word.", r'TOC \h \z \c "Bảng"'),
        page_break(),
        para("BẢNG VIẾT TẮT", align="center", bold=True, size="32"),
        abbrev_table(),
        page_break(),
    ]


def slug(text):
    cleaned = re.sub(r"[^A-Za-z0-9_]+", "_", text)
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    return (cleaned or "heading")[:32]


def add_bookmark(p, idx):
    if p.find("w:bookmarkStart", NS) is not None:
        return
    name = f"BM_{idx}_{slug(text_of(p))}"
    start = el("w:bookmarkStart", {qn("w:id"): str(2000 + idx), qn("w:name"): name})
    end = el("w:bookmarkEnd", {qn("w:id"): str(2000 + idx)})
    insert_at = 1 if p.find("w:pPr", NS) is not None else 0
    p.insert(insert_at, start)
    p.append(end)


def main():
    with ZipFile(SRC) as zin:
        files = {name: zin.read(name) for name in zin.namelist()}

    doc_root = ET.fromstring(files["word/document.xml"])
    body = doc_root.find("w:body", NS)
    original = list(body)
    sect = original[-1] if original and original[-1].tag == qn("w:sectPr") else None

    children = []
    for i, child in enumerate(original):
        if child.tag == qn("w:sectPr"):
            continue
        txt = text_of(child) if child.tag == qn("w:p") else ""
        # Remove only the old static pasted TOC paragraph. Existing numbered headings remain untouched.
        if i < 3 and child.tag == qn("w:p") and "CHƯƠNG 1." in txt and "CHƯƠNG 7." in txt:
            continue
        children.append(child)

    output_children = []
    output_children.extend(front_matter())
    last_nonempty = ""
    table_no = 0
    figure_no = 0
    figure_titles = {
        "Mô hình ERD": "ERD Website 2hand",
        "Cài đặt bảng dữ liệu": "Cài đặt bảng dữ liệu",
        "Cài đặt ràng buộc toàn vẹn": "Cài đặt ràng buộc toàn vẹn",
        "Cài đặt Trigger": "Cài đặt Trigger",
    }

    for child in children:
        if child.tag == qn("w:p"):
            txt = text_of(child)
            if p_style(child).startswith("Heading") and txt:
                add_bookmark(child, len(output_children))
                if p_style(child) == "Heading1" and output_children:
                    ppr = ensure_ppr(child)
                    if ppr.find("w:pageBreakBefore", NS) is None:
                        ppr.append(el("w:pageBreakBefore"))
            if txt.startswith("Picture 1:"):
                # Replace English auto caption with Vietnamese caption below its image.
                continue
            if txt:
                last_nonempty = txt
            output_children.append(child)
            if child.find(".//w:drawing", NS) is not None:
                figure_no += 1
                title = figure_titles.get(last_nonempty, last_nonempty or f"Hình minh họa {figure_no}")
                output_children.append(simple_caption(f"Hình {figure_no}. {title}", italic=True))
        elif child.tag == qn("w:tbl"):
            table_no += 1
            if not re.match(r"^Bảng\s+\d+\.", last_nonempty, re.I):
                output_children.append(simple_caption(f"Bảng {table_no}. {last_nonempty or 'Bảng dữ liệu'}", bold=True))
            output_children.append(child)

    body.clear()
    for child in output_children:
        body.append(child)
    if sect is not None:
        body.append(sect)

    for t in doc_root.findall(".//w:t", NS):
        if t.text:
            t.text = t.text.replace("CreateAt", "CreatedAt").replace("UpdateAt", "UpdatedAt")

    # Minimal style cleanup: do not edit numbering definitions or heading numbering.
    styles_root = ET.fromstring(files["word/styles.xml"])
    caption = styles_root.find(".//w:style[@w:styleId='Caption']", NS)
    if caption is None:
        caption = el("w:style", {qn("w:type"): "paragraph", qn("w:styleId"): "Caption"})
        caption.append(el("w:name", val("Caption")))
        styles_root.append(caption)
    files["word/styles.xml"] = ET.tostring(styles_root, encoding="utf-8", xml_declaration=True)

    # Footer with page number.
    rels_root = ET.fromstring(files["word/_rels/document.xml.rels"])
    rid_nums = []
    for rel in rels_root.findall("rel:Relationship", NS):
        rid = rel.get("Id", "")
        if rid.startswith("rId") and rid[3:].isdigit():
            rid_nums.append(int(rid[3:]))
    footer_rid = f"rId{max(rid_nums or [0]) + 1}"
    rels_root.append(ET.Element(f"{{{NS['rel']}}}Relationship", {
        "Id": footer_rid,
        "Type": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
        "Target": "footer_preserve_numbering.xml",
    }))
    files["word/_rels/document.xml.rels"] = ET.tostring(rels_root, encoding="utf-8", xml_declaration=True)

    sect_pr = body.find("w:sectPr", NS)
    if sect_pr is not None:
        sect_pr.insert(0, el("w:footerReference", {qn("w:type"): "default", qn("r:id"): footer_rid}))

    footer = el("w:ftr")
    fp = para(align="center")
    fp.append(run("Trang "))
    for part in [
        el("w:fldChar", {qn("w:fldCharType"): "begin"}),
        el("w:instrText", text="PAGE"),
        el("w:fldChar", {qn("w:fldCharType"): "separate"}),
    ]:
        r = el("w:r")
        r.append(part)
        fp.append(r)
    fp.append(run("1"))
    r = el("w:r")
    r.append(el("w:fldChar", {qn("w:fldCharType"): "end"}))
    fp.append(r)
    footer.append(fp)
    files["word/footer_preserve_numbering.xml"] = ET.tostring(footer, encoding="utf-8", xml_declaration=True)

    ct_root = ET.fromstring(files["[Content_Types].xml"])
    ct_root.append(ET.Element(f"{{{NS['ct']}}}Override", {
        "PartName": "/word/footer_preserve_numbering.xml",
        "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml",
    }))
    files["[Content_Types].xml"] = ET.tostring(ct_root, encoding="utf-8", xml_declaration=True)

    settings_root = ET.fromstring(files["word/settings.xml"])
    if settings_root.find("w:updateFields", NS) is None:
        settings_root.append(el("w:updateFields", val("true")))
    files["word/settings.xml"] = ET.tostring(settings_root, encoding="utf-8", xml_declaration=True)
    files["word/document.xml"] = ET.tostring(doc_root, encoding="utf-8", xml_declaration=True)

    with ZipFile(OUT, "w", ZIP_DEFLATED) as zout:
        for name, data in files.items():
            zout.writestr(name, data)
    print(OUT)


if __name__ == "__main__":
    main()
