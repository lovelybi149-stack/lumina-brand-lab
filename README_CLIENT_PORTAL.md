# LUMINA BRAND LAB — CLIENT PORTAL & SMART BRIEF FORM (BƯỚC 3)

## Giới thiệu
Mô-đun **Giao diện Khách hàng (Client Portal & Smart Brief Form)** là phân đoạn tiếp nhận thông tin khách hàng và tự động đóng gói Brief thiết kế nhận diện thương hiệu cho dự án **LUMINA BRAND LAB — Xưởng ý tưởng nhận diện thương hiệu bán tự động**.

Giao diện được thiết kế theo phong cách **Design Studio cao cấp (Minimalist, Dark Theme, Luxury Gold & Stone Palette)**, mang lại trải nghiệm chuyên nghiệp, trực quan và mượt mà.

---

## Cấu trúc Phân đoạn (Single Page Application)
1. **Hero Section (Giới thiệu & Kêu gọi)**:
   - Headline: *"LUMINA BRAND LAB — Khởi tạo Bản sắc Thương hiệu Chuẩn mực trong 24 Giờ"*
   - Sub-headline: Tuyên ngôn kết hợp giữa tốc độ AI và thẩm mỹ của Giám đốc Sáng tạo. Bàn giao trọn bộ file `[SVG + PNG + PDF]`.
   - Nút CTA chuyển động cuộn mượt xuống Form.
   - Thẻ Case Study thực tế: Xem trước concept mẫu của **Gió Mộc Coffee** (Bao gồm vector logo SVG thực tế, bảng màu 60-30-10 và cặp font Google Fonts).

2. **Smart Brief Stepper (Form khảo sát 5 bước)**:
   - **Bước 1: Định danh thương hiệu** (Tên thương hiệu, Slogan gợi ý, Chọn ngành hàng 7 danh mục, Khách hàng mục tiêu).
   - **Bước 2: Định dạng Logo** (4 Visual Cards: Wordmark, Icon/Symbol, Combination Mark - Khuyên dùng, Mascot).
   - **Bước 3: Tông màu chủ đạo** (6 Swatches: Earth Tones, Luxury Monochrome, Cool & Tech, Warm & Vibrant, Pastel & Soft, AI Tự do đề xuất).
   - **Bước 4: Phong cách & Cảm xúc** (Tích chọn tối đa 3 tính từ với bộ đếm và cảnh báo vượt giới hạn: Minimalist, Luxury, Retro, Modern, Playful, Rustic).
   - **Bước 5: Thông tin liên hệ bàn giao & Bộ Tính Báo Giá Động**:
     + Thông tin liên hệ: Họ tên, SĐT/Zalo, Email.
     + **Cấu hình đơn hàng thời gian thực**:
       - Thời gian hoàn thành: ⚡ 24 Giờ (Hỏa tốc) vs ⏳ 3 Ngày (Tiêu chuẩn).
       - Số option logo đợt 1: 1 Mẫu chuyên sâu vs 3 Mẫu đa dạng *(Tự động khóa 1 mẫu khi chọn 24h)*.
       - Số lần duyệt & chỉnh sửa: 1 Lần vs 2 Lần bảo hành.
     + **Khung báo giá Live Quotation Box**: Tính giá tự động theo ma trận niêm yết (800.000đ - 1.500.000đ).
     + Nút Submit: **"ĐỒNG Ý BÁO GIÁ [GIÁ TIỀN] VNĐ & GỬI BRIEF THIẾT KẾ"** (Chỉ kích hoạt khi đã điền đủ thông tin liên hệ).

3. **Processing & Success State**:
   - **Loading 3 giây**: Mô phỏng quá trình AI Engine phân tích ngành hàng và phác thảo vector logo.
   - **Success Screen**: Thông báo chuyển giao hồ sơ đến Giám đốc Sáng tạo, hiển thị tóm tắt gói dịch vụ, giá tiền chốt và **Schema JSON Payload** với nút sao chép 1-click & tải file.

---

## Bảng Ma Trận Giá & Quy Tắc Ràng Buộc (Pricing Logic)
| Thời gian | Số Option Logo | Số lần duyệt mẫu | Giá dịch vụ (VNĐ) | Gói dịch vụ |
| :---: | :---: | :---: | :---: | :--- |
| **24 Giờ (Hỏa tốc)** | **1 Mẫu** | **1 Lần** | **800.000 VNĐ** | Gói Express Tiết Kiệm |
| **24 Giờ (Hỏa tốc)** | **1 Mẫu** | **2 Lần** | **1.000.000 VNĐ** | Gói Express Tiêu Chuẩn |
| **3 Ngày (Tiêu chuẩn)**| **1 Mẫu** | **1 Lần** | **800.000 VNĐ** | Gói Khởi Nghiệp Cơ Bản |
| **3 Ngày (Tiêu chuẩn)**| **1 Mẫu** | **2 Lần** | **1.000.000 VNĐ** | Gói Khởi Nghiệp Chuẩn |
| **3 Ngày (Tiêu chuẩn)**| **3 Mẫu** | **1 Lần** | **1.200.000 VNĐ** | Gói Đa Dạng Concept |
| **3 Ngày (Tiêu chuẩn)**| **3 Mẫu** | **2 Lần** | **1.500.000 VNĐ** | Gói Chuyên Nghiệp Toàn Diện |

*Ràng buộc đặc biệt: Khi chọn 24 Giờ, hệ thống tự động khóa và chọn 1 Option Logo, hiển thị chú thích để khách hàng an tâm về chất lượng.*

---

## Schema Dữ liệu Đầu ra (Payload JSON Chuẩn Nâng Cấp)
Khi người dùng bấm Submit tại Bước 5, hệ thống đóng gói đầy đủ cả thông tin Brief và Cấu hình đơn hàng:
```json
{
  "client_name": "Nguyễn Văn A",
  "client_phone": "0901234567",
  "client_email": "vana@gmail.com",
  "brand_name": "Gió Mộc Coffee",
  "slogan": "Đậm đà hương vị mộc mạc",
  "industry": "F&B / Ẩm thực",
  "target_audience": "Người trẻ 20-35 tuổi, thích không gian yên tĩnh và làm việc",
  "logo_format": "Combination Mark",
  "color_tone": "Earth Tones (Nâu gỗ, xanh lá rừng, be đất)",
  "style_vibes": [
    "Minimalist",
    "Rustic"
  ],
  "status": "Pending",
  "created_at": "2026-10-31T23:50:00Z",
  "order_config": {
    "delivery_time": "24h",
    "logo_options_count": 1,
    "revision_rounds": 2,
    "quote_price": 1000000,
    "currency": "VND",
    "payment_status": "Quotation_Accepted"
  }
}
```

---

## Tích hợp Backend API & Cơ sở Dữ liệu (`lumina_database.csv`)
Dự án đi kèm route API `app/api/brief/route.ts`:
- Tiếp nhận payload từ Smart Brief Form.
- Tự động sinh `project_id` tiếp theo (ví dụ: `LUMINA-03`).
- Ghi dữ liệu vào file `lumina_database.csv` (15 cột chuẩn định nghĩa tại Bước 1 & 2).
- Tự động lưu bản sao lưu JSON tại thư mục `brief_records/`.

---

## Cấu trúc Thư mục Mã nguồn
```
d:\Xưởng ý tưởng nhận diện thương hiệu\
├── app/
│   ├── api/
│   │   └── brief/
│   │       └── route.ts               # API Route ghi vào lumina_database.csv
│   ├── globals.css                    # Tailwind CSS & Studio styling
│   ├── layout.tsx                     # Root Layout với Google Fonts (Cinzel, Plus Jakarta Sans)
│   └── page.tsx                       # Next.js Page hiển thị Client Portal
├── components/
│   ├── LuminaClientPortal.tsx         # Toàn bộ trang Client Portal SPA
│   ├── LuminaSmartBriefAllInOne.tsx   # Bản All-in-One độc lập dễ dàng copy vào dự án khác
│   ├── HeroSection.tsx                # Hero section & CTA
│   ├── StepperProgressBar.tsx         # Thanh tiến trình 5 bước trực quan
│   ├── FeaturedCaseStudy.tsx          # Case study mẫu Gió Mộc Coffee
│   ├── ProcessingScreen.tsx           # Animation chờ AI 3 giây
│   ├── SuccessScreen.tsx              # Màn hình chúc mừng & JSON viewer
│   ├── StudioNavbar.tsx               # Header thanh điều hướng
│   ├── StudioFooter.tsx               # Footer chân trang
│   └── steps/
│       ├── Step1BrandIdentity.tsx     # Bước 1
│       ├── Step2LogoFormat.tsx        # Bước 2
│       ├── Step3ColorTone.tsx         # Bước 3
│       ├── Step4StyleVibes.tsx        # Bước 4
│       └── Step5Contact.tsx           # Bước 5
├── types/
│   ├── brief.ts                       # TypeScript interfaces & Schema JSON
│   └── constants.ts                   # Định nghĩa Options, Ngành hàng, Màu sắc, Vibe
├── package.json                       # Cấu hình Next.js & Dependencies
├── tailwind.config.js                 # Theme màu Stone / Gold Studio
└── tsconfig.json                      # Cấu hình TypeScript
```

---

## Hướng dẫn Khởi chạy
1. Cài đặt thư viện:
   ```bash
   npm install
   ```
2. Khởi chạy máy chủ phát triển (Development Server):
   ```bash
   npm run dev
   ```
3. Truy cập trình duyệt tại: `http://localhost:3000`
