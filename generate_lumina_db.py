"""
LUMINA BRAND LAB — Database Generator Script
Tự động tạo cơ sở dữ liệu Excel (.xlsx) chuẩn quản lý quy trình nhận diện thương hiệu bán tự động.

Yêu cầu thư viện:
    pip install openpyxl
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

def build_lumina_database(output_filename="lumina_database.xlsx"):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "LUMINA_Projects"
    ws.views.sheetView[0].showGridLines = True

    # 1. ĐỊNH NGHĨA 15 CỘT & 4 KHỐI LOGIC
    # Khối 1: Brief đầu vào (Navy #1F4E79)
    # Khối 2: AI Đề xuất (Tím Royal #53389E)
    # Khối 3: Human Curation (Hổ phách Warm Rust #B54708)
    # Khối 4: Trạng thái & Bàn giao (Xanh lục Emerald #027A48)
    columns_config = [
        # KHỐI 1: THÔNG TIN KHÁCH HÀNG & BRIEF ĐẦU VÀO
        {"col": "A", "id": "project_id", "name": "project_id\n[Mã Dự Án]", "block": 1, "color": "1F4E79", "width": 14, "align": "center"},
        {"col": "B", "id": "client_name", "name": "client_name\n[Tên Khách Hàng]", "block": 1, "color": "1F4E79", "width": 18, "align": "left"},
        {"col": "C", "id": "client_contact", "name": "client_contact\n[SĐT/Zalo/Email]", "block": 1, "color": "1F4E79", "width": 26, "align": "left"},
        {"col": "D", "id": "brand_name", "name": "brand_name\n[Tên Thương Hiệu]", "block": 1, "color": "1F4E79", "width": 22, "align": "left"},
        {"col": "E", "id": "industry_target", "name": "industry_target\n[Ngành Hàng & Target]", "block": 1, "color": "1F4E79", "width": 38, "align": "left"},
        {"col": "F", "id": "style_vibe", "name": "style_vibe\n[Phong Cách/Tính Cách]", "block": 1, "color": "1F4E79", "width": 32, "align": "left"},

        # KHỐI 2: DỮ LIỆU AI TỰ ĐỘNG ĐỀ XUẤT (TEXT & ẢNH)
        {"col": "G", "id": "ai_brand_story", "name": "ai_brand_story\n[Story & Slogan AI]", "block": 2, "color": "53389E", "width": 42, "align": "left"},
        {"col": "H", "id": "ai_color_palette", "name": "ai_color_palette\n[Bảng Màu HEX AI]", "block": 2, "color": "53389E", "width": 34, "align": "left"},
        {"col": "I", "id": "ai_typography", "name": "ai_typography\n[Cặp Google Fonts AI]", "block": 2, "color": "53389E", "width": 36, "align": "left"},
        {"col": "J", "id": "ai_moodboard_url", "name": "ai_moodboard_url\n[Link Ảnh Moodboard =IMAGE()]", "block": 2, "color": "53389E", "width": 32, "align": "left"},
        {"col": "K", "id": "ai_mockup_url", "name": "ai_mockup_url\n[Link Ảnh Mockup =IMAGE()]", "block": 2, "color": "53389E", "width": 32, "align": "left"},

        # KHỐI 3: PHẦN DUYỆT & ĐIỀU CHỈNH THẨM MỸ (HUMAN CURATION)
        {"col": "L", "id": "designer_final_palette_font", "name": "designer_final_palette_font\n[Màu & Font Chốt/Chỉnh Sửa]", "block": 3, "color": "B54708", "width": 40, "align": "left"},
        {"col": "M", "id": "designer_final_visual_notes", "name": "designer_final_visual_notes\n[Ghi Chú Căn Chỉnh & Visual]", "block": 3, "color": "B54708", "width": 42, "align": "left"},

        # KHỐI 4: QUẢN LÝ TRẠNG THÁI & BÀN GIAO
        {"col": "N", "id": "status", "name": "status\n[Trạng Thái Duyệt]", "block": 4, "color": "027A48", "width": 16, "align": "center"},
        {"col": "O", "id": "proposal_url", "name": "proposal_url\n[Link Proposal / Pitch Deck]", "block": 4, "color": "027A48", "width": 36, "align": "left"}
    ]

    # Thiết lập đường viền mảnh (Thin Border)
    thin_border = Border(
        left=Side(style='thin', color='D0D5DD'),
        right=Side(style='thin', color='D0D5DD'),
        top=Side(style='thin', color='D0D5DD'),
        bottom=Side(style='thin', color='D0D5DD')
    )

    # 2. VẼ HEADER ROW 1
    ws.row_dimensions[1].height = 42
    for col_idx, col_info in enumerate(columns_config, start=1):
        cell = ws.cell(row=1, column=col_idx, value=col_info["name"])
        cell.font = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color=col_info["color"], end_color=col_info["color"], fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border
        
        # Cài đặt độ rộng cột
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = col_info["width"]

    # 3. DỮ LIỆU MẪU (2 DÒNG THỰC TẾ ĐẠI DIỆN 2 GIAI ĐOẠN)
    sample_data = [
        # Dòng 1: F&B Specialty Coffee - Khách mới gửi Brief, AI đã đề xuất, đang chờ Designer duyệt (Pending)
        [
            "LUMINA-01",
            "Lê Tuấn Hưng",
            "0912.839.201 / hung.le@auracoffee.vn",
            "AURA ROASTERS",
            "F&B Specialty Coffee & Trải nghiệm Slow Bar. Target: Giới trẻ 22-38 tuổi, dân sáng tạo & văn phòng cao cấp chuộng cà phê mộc thủ công.",
            "Artisanal, Organic Modernism, Warm & Earthy, Tinh tế, Trải nghiệm đa giác quan.",
            "AURA ROASTERS tin rằng mỗi tách cà phê là một quãng nghỉ thiền định giữa nhịp sống đô thị. Kết hợp Arabica Cầu Đất nguyên bản cùng kỹ nghệ rang mộc Bắc Âu, Aura đánh thức tần số năng lượng tích cực cho ngày mới. Slogan: \"Awaken Your Pure Frequency\".",
            "#2E1E1A (Dark Espresso), #9C6644 (Terra Cotta), #DDB892 (Warm Sand), #EDE0D4 (Oat Milk), #588157 (Highland Sage)",
            "Header: Syne (Bold Display) | Body: Plus Jakarta Sans (Regular/Medium - hỗ trợ tiếng Việt sắc nét)",
            '=IMAGE("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80")',
            '=IMAGE("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80")',
            "[Chờ Designer duyệt - AI đề xuất 5 mã màu & bộ font Syne / Plus Jakarta Sans]",
            "[Chờ Designer duyệt - Cần dựng mockup túi zip màng nhôm giấy kraft van 1 chiều]",
            "Pending",
            "[Chưa xuất - Chờ hoàn tất duyệt thẩm mỹ]"
        ],
        # Dòng 2: Thời trang tối giản - Đã được Designer duyệt & tinh chỉnh hoàn chỉnh, trạng thái Approved, có link Pitch Deck
        [
            "LUMINA-02",
            "Nguyễn Mai Chi",
            "0978.112.985 / maichi@noirstudio.com",
            "L'ATELIER SILENCE",
            "Thời trang thiết kế nữ cao cấp (Ready-to-wear). Target: Phụ nữ 26-42 tuổi, quản lý & doanh nhân độc lập, chuộng lối sống Quiet Luxury, Monochromatic.",
            "Quiet Luxury, Minimalist, Architectural, Timeless Elegance, Thanh lịch & Tĩnh lặng.",
            "L'ATELIER SILENCE là tuyên ngôn của vẻ đẹp không phô trương. Chúng tôi kiến tạo sự thanh lịch qua phom dáng chuẩn xác, chất liệu tự nhiên thượng hạng và từng đường cắt tối giản, giúp phụ nữ tỏa sáng bằng khí chất tự tại. Slogan: \"The Power of Pure Form\".",
            "#1A1A1A (Deep Obsidian), #7E7F83 (Mineral Slate), #E7E3DC (Raw Linen), #C2A676 (Brushed Champagne), #FAF9F6 (Chalk White)",
            "Header: Cormorant Garamond (SemiBold/Italic) | Body: Montserrat (Light/Regular)",
            '=IMAGE("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80")',
            '=IMAGE("https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80")',
            "ĐÃ DUYỆT & TINH CHỈNH: Giữ tone chủ đạo, chỉnh #1A1A1A thành #141415 (Soft Noir giảm độ gắt trên vải lụa). Font Header: Cormorant Garamond Display (Tracking +150); Font Body: Đổi sang Be Vietnam Pro để tối ưu tiếng Việt trên tag mác quần áo.",
            "HOÀN TẤT CURATION: Monogram 'LS' cách điệu tối giản theo cấu trúc cột thức kiến trúc. Tag mác dùng giấy Colorplan 350gsm màu Raw Linen ép kim mờ Champagne. Mockup hộp cứng dập nổi logo. Visual preview: https://cdn.lumina-brandlab.com/curated/lumina-02-final-brandkit.jpg",
            "Approved",
            "https://lumina-brandlab.com/proposals/LUMINA-02-LATELIER-SILENCE.pdf"
        ]
    ]

    # Đổ dữ liệu mẫu vào trang tính
    for row_idx, row_values in enumerate(sample_data, start=2):
        ws.row_dimensions[row_idx].height = 80  # Chiều cao phù hợp cho hiển thị nội dung nhiều dòng
        for col_idx, value in enumerate(row_values, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=value)
            cell.font = Font(name="Segoe UI", size=9.5)
            cell.border = thin_border
            
            align_type = columns_config[col_idx - 1]["align"]
            cell.alignment = Alignment(horizontal=align_type, vertical="top", wrap_text=True)

            # Highlight nhẹ theo trạng thái ở cột N
            if col_idx == 14:  # Cột status
                if value == "Approved":
                    cell.fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
                    cell.font = Font(name="Segoe UI", size=9.5, bold=True, color="065F46")
                elif value == "Pending":
                    cell.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
                    cell.font = Font(name="Segoe UI", size=9.5, bold=True, color="92400E")

    # 4. DATA VALIDATION: CỘT STATUS (Cột N: từ N2 đến N500)
    dv = DataValidation(
        type="list",
        formula1='"Pending,Approved"',
        allow_blank=True,
        showDropDown=False,
        showInputMessage=True,
        promptTitle="Chọn Trạng Thái",
        prompt="Vui lòng chọn: 'Pending' hoặc 'Approved'"
    )
    ws.add_data_validation(dv)
    dv.add("N2:N500")

    # Cố định hàng tiêu đề (Freeze Pane)
    ws.freeze_panes = "A2"

    # Lưu file
    wb.save(output_filename)
    print(f"Đã tạo thành công cơ sở dữ liệu Lumina: {output_filename}")

if __name__ == "__main__":
    build_lumina_database("lumina_database.xlsx")
