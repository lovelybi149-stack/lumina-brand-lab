"""
LUMINA BRAND LAB — Automated Brand Kit & Guideline Generator (Python Version)

Tác vụ:
1. Lưu mã vector: logo_master.svg
2. Chuyển đổi sang ảnh độ phân giải cao 300 DPI, nền trong suốt: logo_transparent.png
3. Tạo cẩm nang nhận diện thương hiệu chuẩn PDF A4 ngang (4 trang): brand_guideline.pdf

Cài đặt thư viện:
    pip install cairosvg reportlab pillow
Lưu ý Windows: cairosvg yêu cầu thư viện Cairo C-runtime. Nếu chạy trên Windows,
khuyên dùng bản Node.js (sharp + pdfkit) để cài đặt tự động không cần cấu hình C-library.
"""

import json
import os
import re
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

# 1. Đọc file JSON
JSON_FILE = "brand_identity.json"
if not os.path.exists(JSON_FILE):
    print(f"[Lỗi] Không tìm thấy file {JSON_FILE}")
    exit(1)

with open(JSON_FILE, "r", encoding="utf-8") as f:
    brand = json.load(f)

# 2. Đăng ký Font tiếng Việt từ Windows / Mac / Linux
def setup_fonts():
    font_paths = [
        ("SegoeUI", "C:/Windows/Fonts/segoeui.ttf", "SegoeUI-Bold", "C:/Windows/Fonts/segoeuib.ttf", "SegoeUI-Italic", "C:/Windows/Fonts/segoeuii.ttf"),
        ("Arial", "C:/Windows/Fonts/arial.ttf", "Arial-Bold", "C:/Windows/Fonts/arialbd.ttf", "Arial-Italic", "C:/Windows/Fonts/ariali.ttf"),
        ("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf", "Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf", "Arial-Italic", "/System/Library/Fonts/Supplemental/Arial Italic.ttf")
    ]
    for reg_name, reg_path, bold_name, bold_path, ita_name, ita_path in font_paths:
        if os.path.exists(reg_path) and os.path.exists(bold_path):
            pdfmetrics.registerFont(TTFont(reg_name, reg_path))
            pdfmetrics.registerFont(TTFont(bold_name, bold_path))
            if os.path.exists(ita_path):
                pdfmetrics.registerFont(TTFont(ita_name, ita_path))
            else:
                pdfmetrics.registerFont(TTFont(ita_name, reg_path))
            return reg_name, bold_name, ita_name
    return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"

font_reg, font_bold, font_italic = setup_fonts()

# ------------------------------------------------------------------------------
# TÁC VỤ 1: Lưu logo_master.svg
# ------------------------------------------------------------------------------
svg_code = brand["logo_design_svg"]
with open("logo_master.svg", "w", encoding="utf-8") as f:
    f.write(svg_code)
print("[1/3] Đã lưu file vector gốc: logo_master.svg")

# ------------------------------------------------------------------------------
# TÁC VỤ 2: Chuyển đổi sang logo_transparent.png (300 DPI, nền trong suốt)
# ------------------------------------------------------------------------------
# Xóa thẻ <rect> nền canvas để tạo độ trong suốt tuyệt đối
transparent_svg = re.sub(r'<rect\s+[^>]*width=["\']500["\'][^>]*height=["\']500["\'][^>]*/>', '', svg_code, flags=re.IGNORECASE)
transparent_svg = re.sub(r'<rect\s+[^>]*rx=["\']20["\'][^>]*/>', '', transparent_svg, flags=re.IGNORECASE)
transparent_svg = re.sub(r'<rect\s+[^>]*rx=["\']16["\'][^>]*/>', '', transparent_svg, flags=re.IGNORECASE)

try:
    import cairosvg
    cairosvg.svg2png(
        bytestring=transparent_svg.encode("utf-8"),
        write_to="logo_transparent.png",
        dpi=300,
        output_width=2000,
        output_height=2000
    )
    # Ảnh preview có nền cho trang bìa PDF
    cairosvg.svg2png(
        bytestring=svg_code.encode("utf-8"),
        write_to="logo_preview.png",
        dpi=300,
        output_width=1000,
        output_height=1000
    )
    print("[2/3] Đã chuyển đổi ảnh 300 DPI: logo_transparent.png")
except Exception as e:
    print(f"[Cảnh báo tác vụ 2] Không thể chạy cairosvg ({e}). Đảm bảo cài đặt Cairo runtime hoặc sử dụng bản Node.js.")

# ------------------------------------------------------------------------------
# TÁC VỤ 3: Tạo cẩm nang nhận diện thương hiệu chuẩn PDF A4 ngang (4 trang)
# ------------------------------------------------------------------------------
pdf_filename = "brand_guideline.pdf"
page_w, page_h = landscape(A4) # 841.89 x 595.28 pt
c = canvas.Canvas(pdf_filename, pagesize=landscape(A4))

# Trích xuất màu sắc
c_primary = HexColor(next((item["hex"] for item in brand["color_palette"] if "Primary" in item["role"] or "chủ đạo" in item["role"]), "#3D2B1F"))
c_secondary = HexColor(next((item["hex"] for item in brand["color_palette"] if "Secondary" in item["role"] or "phụ" in item["role"]), "#9E6B55"))
c_neutral = HexColor(next((item["hex"] for item in brand["color_palette"] if "Neutral" in item["role"] or "nền" in item["role"]), "#F4EFEA"))
c_accent = HexColor(next((item["hex"] for item in brand["color_palette"] if "Accent" in item["role"] or "nhấn" in item["role"]), "#5B7065"))

def draw_header(title, section_idx):
    c.setFillColor(c_primary)
    c.rect(0, page_h - 14, page_w, 14, fill=1, stroke=0)
    
    c.setFont(font_bold, 10)
    c.setFillColor(c_secondary)
    c.drawString(55, page_h - 38, "LUMINA BRAND LAB — BRAND GUIDELINE MANUAL")
    
    c.setFont(font_bold, 16)
    c.setFillColor(c_primary)
    c.drawString(55, page_h - 58, f"{section_idx}. {title.upper()}")
    
    c.setStrokeColor(c_secondary)
    c.setLineWidth(0.8)
    c.line(55, page_h - 70, page_w - 55, page_h - 70)
    
    # Footer
    c.setFont(font_reg, 8.5)
    c.setFillColor(HexColor("#888888"))
    c.drawString(55, 28, f"{brand['brand_name']} • Bản quyền thuộc về thương hiệu")
    c.drawRightString(page_w - 55, 28, f"Trang {section_idx + 1} / 4")

# ===== TRANG 1: COVER PAGE =====
c.setFillColor(c_neutral)
c.rect(0, 0, page_w, page_h, fill=1, stroke=0)

c.setStrokeColor(c_secondary)
c.setLineWidth(1.2)
c.rect(25, 25, page_w - 50, page_h - 50, fill=0, stroke=1)
c.setLineWidth(0.6)
c.rect(30, 30, page_w - 60, page_h - 60, fill=0, stroke=1)

logo_w = 180
logo_x = (page_w - logo_w) / 2
logo_y = page_h - 330
if os.path.exists("logo_preview.png"):
    c.drawImage("logo_preview.png", logo_x, logo_y, width=logo_w, height=logo_w, mask='auto')

c.setFont(font_bold, 26)
c.setFillColor(c_primary)
c.drawCentredString(page_w / 2, logo_y - 35, brand["brand_name"].upper())

c.setFont(font_italic, 13)
c.setFillColor(c_secondary)
c.drawCentredString(page_w / 2, logo_y - 60, f'"{brand["taglines"][0]}"')

c.setFont(font_bold, 9)
c.setFillColor(c_accent)
c.drawCentredString(page_w / 2, logo_y - 90, "BRAND GUIDELINE & VISUAL IDENTITY KIT")

c.setFont(font_reg, 8.5)
c.setFillColor(c_primary)
c.drawCentredString(page_w / 2, 50, "PHÁT TRIỂN BỞI LUMINA BRAND LAB • NĂM 2024")

c.showPage()

# ===== TRANG 2: STORY & TYPOGRAPHY =====
draw_header("Câu Chuyện Thương Hiệu & Typography", 1)

# Cột trái: Story
c.setFont(font_bold, 13)
c.setFillColor(c_primary)
c.drawString(55, page_h - 105, "1.1 CÂU CHUYỆN THƯƠNG HIỆU")

c.setFillColor(HexColor("#FAF8F5"))
c.setStrokeColor(HexColor("#E5DDD5"))
c.rect(55, page_h - 265, 345, 145, fill=1, stroke=1)

story_text = c.beginText(70, page_h - 135)
story_text.setFont(font_reg, 9.8)
story_text.setFillColor(HexColor("#333333"))
story_text.setLeading(15)

# Bẻ dòng văn bản story
words = brand["brand_story"].split()
line = ""
for w in words:
    if c.stringWidth(line + " " + w, font_reg, 9.8) < 315:
        line += " " + w if line else w
    else:
        story_text.textLine(line)
        line = w
if line:
    story_text.textLine(line)
c.drawText(story_text)

# Slogans
c.setFont(font_bold, 12)
c.setFillColor(c_primary)
c.drawString(55, page_h - 295, "1.2 ĐỊNH VỊ KHẨU HIỆU (TAGLINES)")
tag_y = page_h - 320
for tag in brand["taglines"]:
    c.setFillColor(c_accent)
    c.circle(63, tag_y + 3, 2.5, fill=1, stroke=0)
    c.setFont(font_italic, 10)
    c.setFillColor(HexColor("#444444"))
    c.drawString(74, tag_y, f'"{tag}"')
    tag_y -= 25

# Cột phải: Typography
c_right_x = 440
c.setFont(font_bold, 13)
c.setFillColor(c_primary)
c.drawString(c_right_x, page_h - 105, "1.3 HỆ THỐNG PHÔNG CHỮ (TYPOGRAPHY)")

# Box Heading
c.setFillColor(HexColor("#FAF8F5"))
c.rect(c_right_x, page_h - 235, 345, 115, fill=1, stroke=1)
c.setFont(font_bold, 10.5)
c.setFillColor(c_secondary)
c.drawString(c_right_x + 15, page_h - 130, "FONT TIÊU ĐỀ (HEADING):")
c.setFont(font_bold, 18)
c.setFillColor(c_primary)
c.drawString(c_right_x + 15, page_h - 152, brand["typography"]["heading_font"])
c.setFont(font_reg, 10)
c.setFillColor(HexColor("#444444"))
c.drawString(c_right_x + 15, page_h - 176, "Aa Bb Cc Dd Ee Gg Hh 0123456789")
c.setFont(font_reg, 8.5)
c.setFillColor(HexColor("#666666"))
c.drawString(c_right_x + 15, page_h - 200, "Ứng dụng: Tiêu đề lớn, biển hiệu, bao bì chính, poster.")

# Box Body
c.setFillColor(HexColor("#FAF8F5"))
c.rect(c_right_x, page_h - 370, 345, 115, fill=1, stroke=1)
c.setFont(font_bold, 10.5)
c.setFillColor(c_secondary)
c.drawString(c_right_x + 15, page_h - 265, "FONT NỘI DUNG (BODY TEXT):")
c.setFont(font_bold, 18)
c.setFillColor(c_primary)
c.drawString(c_right_x + 15, page_h - 287, brand["typography"]["body_font"])
c.setFont(font_reg, 10)
c.setFillColor(HexColor("#444444"))
c.drawString(c_right_x + 15, page_h - 311, "Aa Bb Cc Dd Ee Gg Hh 0123456789")
c.setFont(font_reg, 8.5)
c.setFillColor(HexColor("#666666"))
c.drawString(c_right_x + 15, page_h - 335, "Ứng dụng: Thân bài, thực đơn chi tiết, danh thiếp, giao diện web.")

c.showPage()

# ===== TRANG 3: COLOR PALETTE =====
draw_header("Bảng Màu Nhận Diện Thương Hiệu", 2)

card_w = 168
card_gap = 18
start_x = 55
card_top = page_h - 120

for i, col in enumerate(brand["color_palette"]):
    cx = start_x + i * (card_w + card_gap)
    c_hex = HexColor(col["hex"])
    
    # Khung card
    c.setFillColor(HexColor("#FFFFFF"))
    c.setStrokeColor(HexColor("#E8E4DF"))
    c.rect(cx, card_top - 390, card_w, 390, fill=1, stroke=1)
    
    # Khối màu
    c.setFillColor(c_hex)
    c.rect(cx + 12, card_top - 135, card_w - 24, 125, fill=1, stroke=0)
    c.setStrokeColor(HexColor("#DDDDDD"))
    c.setLineWidth(0.5)
    c.rect(cx + 12, card_top - 135, card_w - 24, 125, fill=0, stroke=1)
    
    # Vòng tròn tâm
    c.setFillColor(c_hex)
    c.circle(cx + card_w / 2, card_top - 165, 14, fill=1, stroke=0)
    c.setStrokeColor(HexColor("#D8D3CD"))
    c.circle(cx + card_w / 2, card_top - 165, 14, fill=0, stroke=1)
    
    # Vai trò & Tên
    c.setFont(font_bold, 8.5)
    c.setFillColor(c_accent)
    c.drawCentredString(cx + card_w / 2, card_top - 195, col["role"].upper())
    
    c.setFont(font_bold, 10.5)
    c.setFillColor(c_primary)
    c.drawCentredString(cx + card_w / 2, card_top - 212, col["name"])
    
    c.setStrokeColor(HexColor("#ECE8E3"))
    c.line(cx + 20, card_top - 225, cx + card_w - 20, card_top - 225)
    
    # Thông số
    c.setFont(font_bold, 9)
    c.setFillColor(HexColor("#333333"))
    c.drawString(cx + 15, card_top - 245, "HEX:")
    c.setFont(font_reg, 9.5)
    c.setFillColor(c_primary)
    c.drawString(cx + 50, card_top - 245, col["hex"])
    
    c.setFont(font_bold, 9)
    c.setFillColor(HexColor("#333333"))
    c.drawString(cx + 15, card_top - 263, "RGB:")
    c.setFont(font_reg, 8.5)
    c.setFillColor(c_primary)
    c.drawString(cx + 45, card_top - 263, col["rgb"])
    
    # Usage
    c.setFont(font_bold, 9)
    c.setFillColor(HexColor("#333333"))
    c.drawString(cx + 15, card_top - 288, "ỨNG DỤNG:")
    
    usage_text = c.beginText(cx + 15, card_top - 305)
    usage_text.setFont(font_reg, 8.5)
    usage_text.setFillColor(HexColor("#555555"))
    usage_text.setLeading(12)
    u_words = col["usage"].split()
    u_line = ""
    for w in u_words:
        if c.stringWidth(u_line + " " + w, font_reg, 8.5) < card_w - 30:
            u_line += " " + w if u_line else w
        else:
            usage_text.textLine(u_line)
            u_line = w
    if u_line:
        usage_text.textLine(u_line)
    c.drawText(usage_text)

c.showPage()

# ===== TRANG 4: MOCKUPS =====
draw_header("Hướng Dẫn Ứng Dụng Thực Tế (Mockups)", 3)

m_w = 230
m_gap = 20
m_cards = [
    ("01", "DANH THIẾP (NAMECARD)", c_primary, [
        ("MẶT TRƯỚC", brand["mockup_directions"]["namecard"]["front"]),
        ("MẶT SAU", brand["mockup_directions"]["namecard"]["back"])
    ]),
    ("02", "BAO BÌ ĐÓNG GÓI (PACKAGING)", c_secondary, [
        ("LOẠI BAO BÌ", brand["mockup_directions"]["packaging"]["type"]),
        ("BỐ TRÍ LOGO & MÀU", brand["mockup_directions"]["packaging"]["description"])
    ]),
    ("03", "BIỂN HIỆU (SIGNAGE)", c_accent, [
        ("LOẠI BIỂN HIỆU", brand["mockup_directions"]["signage"]["type"]),
        ("CHẤT LIỆU & ÁNH SÁNG", brand["mockup_directions"]["signage"]["description"])
    ])
]

for idx, (num, title, header_col, items) in enumerate(m_cards):
    mx = 55 + idx * (m_w + m_gap)
    my_top = page_h - 120
    
    # Hộp card
    c.setFillColor(HexColor("#FAF8F5"))
    c.setStrokeColor(HexColor("#E6E0D8"))
    c.rect(mx, my_top - 400, m_w, 400, fill=1, stroke=1)
    
    # Header
    c.setFillColor(header_col)
    c.rect(mx, my_top - 42, m_w, 42, fill=1, stroke=0)
    c.setFont(font_bold, 10.5)
    c.setFillColor(HexColor("#FFFFFF"))
    c.drawString(mx + 12, my_top - 26, f"{num}. {title}")
    
    cur_y = my_top - 65
    for label, text_content in items:
        c.setFont(font_bold, 9.5)
        c.setFillColor(c_primary)
        c.drawString(mx + 15, cur_y, label)
        
        t_box = c.beginText(mx + 15, cur_y - 18)
        t_box.setFont(font_reg, 8.8)
        t_box.setFillColor(HexColor("#444444"))
        t_box.setLeading(13)
        
        b_words = text_content.split()
        b_line = ""
        for w in b_words:
            if c.stringWidth(b_line + " " + w, font_reg, 8.8) < m_w - 30:
                b_line += " " + w if b_line else w
            else:
                t_box.textLine(b_line)
                b_line = w
        if b_line:
            t_box.textLine(b_line)
        c.drawText(t_box)
        cur_y -= 150

c.showPage()
c.save()

print(f"[3/3] Đã tạo thành công tài liệu PDF: {pdf_filename}")
print(f"\nHOÀN TẤT TẤT CẢ 3 TÁC VỤ CHO THƯƠNG HIỆU: {brand['brand_name'].upper()}")
