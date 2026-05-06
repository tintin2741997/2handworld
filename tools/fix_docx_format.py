from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import copy
import re
import xml.etree.ElementTree as ET

SRC = Path(r"C:\Users\SV STORE\Downloads\05042026_DA_QLTT (2).docx")
OUT = Path(r"C:\Users\SV STORE\Downloads\05042026_DA_QLTT_chinh_sua.docx")

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


def w_el(tag, attrs=None, text=None):
    el = ET.Element(qn(tag), attrs or {})
    if text is not None:
        el.text = text
    return el


def val(value):
    return {qn("w:val"): str(value)}


def text_of(el):
    return "".join(t.text or "" for t in el.findall(".//w:t", NS)).strip()


def style_of(p):
    st = p.find("./w:pPr/w:pStyle", NS)
    return st.get(qn("w:val")) if st is not None else ""


def ensure_ppr(p):
    ppr = p.find("w:pPr", NS)
    if ppr is None:
        ppr = ET.Element(qn("w:pPr"))
        p.insert(0, ppr)
    return ppr


def set_child(parent, child):
    existing = parent.find(child.tag)
    if existing is not None:
        parent.remove(existing)
    parent.append(child)


def remove_text_prefix(p, pattern):
    full = "".join(t.text or "" for t in p.findall(".//w:t", NS))
    new = re.sub(pattern, "", full, count=1).strip()
    first = True
    for t in p.findall(".//w:t", NS):
        if first:
            t.text = new
            first = False
        else:
            t.text = ""


def make_run(text, bold=False, italic=False, size=None):
    r = w_el("w:r")
    rpr = w_el("w:rPr")
    rfonts = w_el("w:rFonts", {
        qn("w:ascii"): "Times New Roman",
        qn("w:hAnsi"): "Times New Roman",
        qn("w:eastAsia"): "Times New Roman",
    })
    rpr.append(rfonts)
    if bold:
        rpr.append(w_el("w:b"))
    if italic:
        rpr.append(w_el("w:i"))
    if size:
        rpr.append(w_el("w:sz", val(size)))
        rpr.append(w_el("w:szCs", val(size)))
    r.append(rpr)
    t = w_el("w:t", text=text)
    t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    r.append(t)
    return r


def make_para(text="", style=None, align=None, bold=False, italic=False, size=None, page_break_before=False):
    p = w_el("w:p")
    ppr = ensure_ppr(p)
    if style:
        ppr.append(w_el("w:pStyle", val(style)))
    if page_break_before:
        ppr.append(w_el("w:pageBreakBefore"))
    if align:
        ppr.append(w_el("w:jc", val(align)))
    if text:
        p.append(make_run(text, bold=bold, italic=italic, size=size))
    return p


def make_page_break_para():
    p = w_el("w:p")
    r = w_el("w:r")
    r.append(w_el("w:br", {qn("w:type"): "page"}))
    p.append(r)
    return p


def make_field_para(title, instr):
    p = make_para()
    r1 = w_el("w:r")
    r1.append(w_el("w:fldChar", {qn("w:fldCharType"): "begin"}))
    r2 = w_el("w:r")
    r2.append(w_el("w:instrText", text=instr))
    r2[0].set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    r3 = w_el("w:r")
    r3.append(w_el("w:fldChar", {qn("w:fldCharType"): "separate"}))
    r4 = make_run(title)
    r5 = w_el("w:r")
    r5.append(w_el("w:fldChar", {qn("w:fldCharType"): "end"}))
    p.extend([r1, r2, r3, r4, r5])
    return p


def make_seq_caption(label, title, seq_name, align="center", italic=False, bold=False):
    p = make_para(align=align)
    ppr = ensure_ppr(p)
    ppr.insert(0, w_el("w:pStyle", val("Caption")))
    p.append(make_run(f"{label} ", bold=bold, italic=italic))
    r1 = w_el("w:r")
    r1.append(w_el("w:fldChar", {qn("w:fldCharType"): "begin"}))
    r2 = w_el("w:r")
    r2.append(w_el("w:instrText", text=f"SEQ {seq_name} \\* ARABIC"))
    r2[0].set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    r3 = w_el("w:r")
    r3.append(w_el("w:fldChar", {qn("w:fldCharType"): "separate"}))
    r4 = make_run("1", bold=bold, italic=italic)
    r5 = w_el("w:r")
    r5.append(w_el("w:fldChar", {qn("w:fldCharType"): "end"}))
    p.extend([r1, r2, r3, r4, r5])
    p.append(make_run(f". {title}", bold=bold, italic=italic))
    return p


def make_abbrev_table():
    tbl = w_el("w:tbl")
    tbl_pr = w_el("w:tblPr")
    tbl_pr.append(w_el("w:tblW", {qn("w:w"): "9000", qn("w:type"): "dxa"}))
    borders = w_el("w:tblBorders")
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(w_el(f"w:{side}", {qn("w:val"): "single", qn("w:sz"): "4", qn("w:space"): "0", qn("w:color"): "999999"}))
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
        tr = w_el("w:tr")
        for cell_text in row:
            tc = w_el("w:tc")
            tc_pr = w_el("w:tcPr")
            tc_pr.append(w_el("w:tcW", {qn("w:w"): "4500", qn("w:type"): "dxa"}))
            tc.append(tc_pr)
            tc.append(make_para(cell_text, bold=(i == 0)))
            tr.append(tc)
        tbl.append(tr)
    return tbl


def add_bookmark_to_heading(p, name, bookmark_id):
    if p.find("w:bookmarkStart", NS) is not None:
        return
    start = w_el("w:bookmarkStart", {qn("w:id"): str(bookmark_id), qn("w:name"): name})
    end = w_el("w:bookmarkEnd", {qn("w:id"): str(bookmark_id)})
    insert_at = 1 if p.find("w:pPr", NS) is not None else 0
    p.insert(insert_at, start)
    p.append(end)


def slug(text):
    cleaned = re.sub(r"[^A-Za-z0-9_]+", "_", text)
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    return (cleaned or "heading")[:32]


def ensure_style(root, style_id, name, based_on="Normal"):
    style = root.find(f".//w:style[@w:styleId='{style_id}']", NS)
    if style is None:
        style = w_el("w:style", {qn("w:type"): "paragraph", qn("w:styleId"): style_id})
        root.append(style)
    for child_tag, child_val in (("w:name", name), ("w:basedOn", based_on)):
        child = style.find(child_tag, NS)
        if child is None:
            style.append(w_el(child_tag, val(child_val)))
        else:
            child.set(qn("w:val"), child_val)
    return style


def set_style_format(style, size, bold=False, align=None, outline=None):
    rpr = style.find("w:rPr", NS)
    if rpr is None:
        rpr = w_el("w:rPr")
        style.append(rpr)
    set_child(rpr, w_el("w:rFonts", {qn("w:ascii"): "Times New Roman", qn("w:hAnsi"): "Times New Roman", qn("w:eastAsia"): "Times New Roman"}))
    set_child(rpr, w_el("w:sz", val(size)))
    set_child(rpr, w_el("w:szCs", val(size)))
    if bold and rpr.find("w:b", NS) is None:
        rpr.append(w_el("w:b"))
    ppr = style.find("w:pPr", NS)
    if ppr is None:
        ppr = w_el("w:pPr")
        style.append(ppr)
    if align:
        set_child(ppr, w_el("w:jc", val(align)))
    spacing = ppr.find("w:spacing", NS)
    if spacing is None:
        spacing = w_el("w:spacing")
        ppr.append(spacing)
    spacing.set(qn("w:line"), "360")
    spacing.set(qn("w:lineRule"), "auto")
    if outline is not None:
        set_child(ppr, w_el("w:outlineLvl", val(outline)))


def ensure_numbering(xml_bytes):
    root = ET.fromstring(xml_bytes)
    max_abs = -1
    max_num = -1
    for el in root.findall("w:abstractNum", NS):
        max_abs = max(max_abs, int(el.get(qn("w:abstractNumId"), "0")))
    for el in root.findall("w:num", NS):
        max_num = max(max_num, int(el.get(qn("w:numId"), "0")))
    abs_id = max_abs + 1
    num_id = max_num + 1
    abstract = w_el("w:abstractNum", {qn("w:abstractNumId"): str(abs_id)})
    lvl = w_el("w:lvl", {qn("w:ilvl"): "0"})
    lvl.extend([
        w_el("w:start", val(1)),
        w_el("w:numFmt", val("bullet")),
        w_el("w:lvlText", val("•")),
        w_el("w:lvlJc", val("left")),
    ])
    ppr = w_el("w:pPr")
    ppr.append(w_el("w:ind", {qn("w:left"): "720", qn("w:hanging"): "360"}))
    lvl.append(ppr)
    abstract.append(lvl)
    num = w_el("w:num", {qn("w:numId"): str(num_id)})
    num.append(w_el("w:abstractNumId", val(abs_id)))
    root.extend([abstract, num])
    return ET.tostring(root, encoding="utf-8", xml_declaration=True), str(num_id)


def main():
    with ZipFile(SRC, "r") as zin:
        files = {name: zin.read(name) for name in zin.namelist()}

    numbering_xml = files.get("word/numbering.xml")
    if numbering_xml:
        files["word/numbering.xml"], bullet_num_id = ensure_numbering(numbering_xml)
    else:
        root = w_el("w:numbering")
        files["word/numbering.xml"], bullet_num_id = ensure_numbering(ET.tostring(root, encoding="utf-8", xml_declaration=True))

    doc_root = ET.fromstring(files["word/document.xml"])
    body = doc_root.find("w:body", NS)
    original_children = list(body)
    sect_pr = original_children[-1] if original_children and original_children[-1].tag == qn("w:sectPr") else None

    # Remove old static TOC paragraphs near the top and empty heading-only paragraphs.
    children = []
    for i, child in enumerate(original_children):
        if child.tag == qn("w:p"):
            txt = text_of(child)
            if i < 3 and "CHƯƠNG 1." in txt and "CHƯƠNG 7." in txt:
                continue
            if style_of(child).startswith("Heading") and not txt:
                continue
        children.append(child)

    # Front matter.
    front = [
        make_para("MỤC LỤC", style="Heading1", align="center", bold=True, size="32"),
        make_field_para("Mục lục sẽ được cập nhật khi mở bằng Microsoft Word.", r'TOC \o "1-3" \h \z \u'),
        make_page_break_para(),
        make_para("DANH MỤC HÌNH ẢNH", style="Heading1", align="center", bold=True, size="32"),
        make_field_para("Danh mục hình ảnh sẽ được cập nhật khi mở bằng Microsoft Word.", r'TOC \h \z \c "Hình"'),
        make_page_break_para(),
        make_para("DANH MỤC BẢNG", style="Heading1", align="center", bold=True, size="32"),
        make_field_para("Danh mục bảng sẽ được cập nhật khi mở bằng Microsoft Word.", r'TOC \h \z \c "Bảng"'),
        make_page_break_para(),
        make_para("BẢNG VIẾT TẮT", style="Heading1", align="center", bold=True, size="32"),
        make_abbrev_table(),
        make_page_break_para(),
    ]

    new_children = []
    inserted_front = False
    table_titles = {}
    image_titles = {
        "Mô hình ERD": "ERD Website 2hand",
        "Cài đặt bảng dữ liệu": "Cài đặt bảng dữ liệu",
        "Cài đặt ràng buộc toàn vẹn": "Cài đặt ràng buộc toàn vẹn",
        "Cài đặt Trigger": "Cài đặt Trigger",
    }
    last_nonempty = ""
    image_count = 0

    for child in children:
        if child.tag == qn("w:sectPr"):
            continue
        if not inserted_front and child.tag == qn("w:p") and text_of(child):
            new_children.extend(copy.deepcopy(front))
            inserted_front = True

        if child.tag == qn("w:p"):
            txt = text_of(child)
            # Normalize old Word-generated "Picture" captions to Vietnamese figure captions.
            if re.match(r"^Picture\s+\d+:", txt, re.I):
                continue
            if txt.startswith(("-", "–", "+", "*")):
                remove_text_prefix(child, r"^\s*[-–+*]{1,2}\s*")
                ppr = ensure_ppr(child)
                num_pr = ppr.find("w:numPr", NS)
                if num_pr is None:
                    num_pr = w_el("w:numPr")
                    ppr.insert(0, num_pr)
                num_pr.clear()
                num_pr.append(w_el("w:ilvl", val(0)))
                num_pr.append(w_el("w:numId", val(bullet_num_id)))
            ppr = ensure_ppr(child)
            if style_of(child) == "" and txt:
                set_child(ppr, w_el("w:jc", val("both")))
            if style_of(child) == "Heading1" and txt:
                if new_children:
                    ppr.append(w_el("w:pageBreakBefore"))
            if style_of(child).startswith("Heading") and txt:
                add_bookmark_to_heading(child, f"BM_{len(new_children)}_{slug(txt)}", 1000 + len(new_children))
            new_children.append(child)
            if child.find(".//w:drawing", NS) is not None:
                image_count += 1
                title = image_titles.get(last_nonempty, last_nonempty or f"Hình minh họa {image_count}")
                new_children.append(make_seq_caption("Hình", title, "Hình", align="center", italic=True))
            if txt:
                last_nonempty = re.sub(r"^(Hình|Bảng)\s+\d+\.\s*", "", txt).strip()
        elif child.tag == qn("w:tbl"):
            title = last_nonempty or "Bảng dữ liệu"
            # Avoid duplicating an existing caption immediately before the table.
            if not re.match(r"^Bảng\s+\d+\.", last_nonempty, re.I):
                new_children.append(make_seq_caption("Bảng", title, "Bảng", align="center", bold=True))
            new_children.append(child)

    body.clear()
    for child in new_children:
        body.append(child)
    if sect_pr is not None:
        body.append(sect_pr)

    spelling_replacements = {
        "CreateAt": "CreatedAt",
        "UpdateAt": "UpdatedAt",
    }
    for t in doc_root.findall(".//w:t", NS):
        if t.text:
            for old, new in spelling_replacements.items():
                t.text = t.text.replace(old, new)

    # Add footer with page number.
    rels_root = ET.fromstring(files["word/_rels/document.xml.rels"])
    rid_nums = []
    for rel in rels_root.findall("rel:Relationship", NS):
        rid = rel.get("Id", "")
        if rid.startswith("rId") and rid[3:].isdigit():
            rid_nums.append(int(rid[3:]))
    footer_rid = f"rId{max(rid_nums or [0]) + 1}"
    rel = ET.Element(f"{{{NS['rel']}}}Relationship", {
        "Id": footer_rid,
        "Type": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
        "Target": "footer1.xml",
    })
    rels_root.append(rel)
    files["word/_rels/document.xml.rels"] = ET.tostring(rels_root, encoding="utf-8", xml_declaration=True)

    sect = body.find("w:sectPr", NS)
    if sect is not None:
        sect.insert(0, w_el("w:footerReference", {qn("w:type"): "default", qn("r:id"): footer_rid}))
    footer = w_el("w:ftr")
    fp = make_para(align="center")
    fp.append(make_run("Trang "))
    rb = w_el("w:r")
    rb.append(w_el("w:fldChar", {qn("w:fldCharType"): "begin"}))
    ri = w_el("w:r")
    ri.append(w_el("w:instrText", text="PAGE"))
    rs = w_el("w:r")
    rs.append(w_el("w:fldChar", {qn("w:fldCharType"): "separate"}))
    rv = make_run("1")
    re_ = w_el("w:r")
    re_.append(w_el("w:fldChar", {qn("w:fldCharType"): "end"}))
    fp.extend([rb, ri, rs, rv, re_])
    footer.append(fp)
    files["word/footer1.xml"] = ET.tostring(footer, encoding="utf-8", xml_declaration=True)

    # Content types for footer and numbering if newly added.
    ct_root = ET.fromstring(files["[Content_Types].xml"])
    existing_parts = {el.get("PartName") for el in ct_root.findall("ct:Override", NS)}
    if "/word/footer1.xml" not in existing_parts:
        ct_root.append(ET.Element(f"{{{NS['ct']}}}Override", {
            "PartName": "/word/footer1.xml",
            "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml",
        }))
    if "/word/numbering.xml" not in existing_parts:
        ct_root.append(ET.Element(f"{{{NS['ct']}}}Override", {
            "PartName": "/word/numbering.xml",
            "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml",
        }))
    files["[Content_Types].xml"] = ET.tostring(ct_root, encoding="utf-8", xml_declaration=True)

    # Style cleanup.
    styles_root = ET.fromstring(files["word/styles.xml"])
    normal = ensure_style(styles_root, "Normal", "Normal")
    set_style_format(normal, "26", align="both")
    set_style_format(ensure_style(styles_root, "Heading1", "heading 1"), "32", bold=True, align="center", outline=0)
    set_style_format(ensure_style(styles_root, "Heading2", "heading 2"), "30", bold=True, outline=1)
    set_style_format(ensure_style(styles_root, "Heading3", "heading 3"), "28", bold=True, outline=2)
    set_style_format(ensure_style(styles_root, "Caption", "Caption"), "24", align="center")
    files["word/styles.xml"] = ET.tostring(styles_root, encoding="utf-8", xml_declaration=True)

    # Ask Word to update fields on open.
    settings_root = ET.fromstring(files.get("word/settings.xml", b'<?xml version="1.0" encoding="UTF-8"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
    if settings_root.find("w:updateFields", NS) is None:
        settings_root.append(w_el("w:updateFields", val("true")))
    files["word/settings.xml"] = ET.tostring(settings_root, encoding="utf-8", xml_declaration=True)

    files["word/document.xml"] = ET.tostring(doc_root, encoding="utf-8", xml_declaration=True)

    with ZipFile(OUT, "w", ZIP_DEFLATED) as zout:
        for name, data in files.items():
            zout.writestr(name, data)
    print(OUT)


if __name__ == "__main__":
    main()
