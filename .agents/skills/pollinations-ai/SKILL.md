---
name: pollinations-ai
description: >-
  Tự động khởi tạo hình ảnh Moodboard, phối cảnh Mockup sản phẩm và hình ảnh nhận diện thương hiệu độ phân giải cao sử dụng Pollinations.AI thông qua MCP Server hoặc Direct API. Kích hoạt khi cần sinh ảnh cảm hứng thị giác cho dự án branding.
---

# Pollinations.AI Brand Identity Imagery Skill

Skill này hướng dẫn Agent cách khai thác công nghệ tạo ảnh của Pollinations.AI để phục vụ quy trình thiết kế nhận diện thương hiệu tại Lumina Brand Lab.

## 1. Cơ Chế Hoạt Động (2 Phương Thức)

### Phương thức A: Thông qua Pollinations MCP Tool (Khuyên dùng)
Khi MCP Server `pollinations` đã được kết nối trong `mcp_config.json`:
- Gọi công cụ: `pollinations_generate_image`
- Truyền tham số:
  + `prompt`: Câu lệnh mô tả ảnh theo công thức Studio Photography ở Mục 2.
  + `model`: "flux" (Mô hình tạo ảnh chân thực, sắc nét nhất hiện nay).
  + `width`: 1200
  + `height`: 800

### Phương thức B: Dự Phòng Trực Tiếp (Direct REST API Fallback)
Nếu MCP chưa kết nối, sử dụng hàm helper tải ảnh trực tiếp qua URL của Pollinations (Miễn phí 100%, không cần API key):
```typescript
export function getPollinationsImageUrl(prompt: string, width = 1200, height = 800): string {
  const encodedPrompt = encodeURIComponent(prompt);
  // Endpoint chính thức của Pollinations với model FLUX
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
}
```

---

## 2. Công Thức Ghép Prompt Chuẩn Studio Cho Nhận Diện Thương Hiệu

Để ảnh tạo ra không bị méo và đạt chuẩn thẩm mỹ của Agency quốc tế, hãy tuân thủ cấu trúc prompt 5 thành tố:

`[Chủ thể sản phẩm / Không gian] + [Phong cách thương hiệu] + [Bảng màu HEX] + [Chất liệu & Ánh sáng] + [Tham số chất lượng]`

### Ví dụ mẫu theo ngành hàng:

1. **Ngành F&B / Cà phê (Gió Mộc, Aura Roasters):**
   > *"Professional commercial photography of an artisanal kraft coffee bag and minimalist ceramic cup on a dark walnut wooden table, morning highlands mist light, warm earth tones #3D2B1F and #5B7065, wabi-sabi aesthetic, 8k resolution, photorealistic, clean studio lighting, elegant depth of field."*

2. **Ngành Công nghệ & Phần mềm (Morphic Studio):**
   > *"Modern tech office workspace with sleek laptop and glass branding card, futuristic holographic geometric polygon prism floating, electric blue #0A84FF and dark obsidian graphite #1C1C1E, clean minimal aesthetic, architectural lighting, raytracing, cinematic composition."*

3. **Ngành Thời trang Cao cấp (L'Atelier Silence):**
   > *"High-end luxury fashion boutique lookbook shot, silk fabric textures, golden brass clothing rack and embossed cotton paper hangtag, warm champagne gold #D4AF37 and ivory white #F7F5F0, Vogue editorial style, soft diffused lighting, 8k, hyper-detailed."*

---

## 3. Quy Trình Lưu Trữ Ảnh Tự Động Vào Thư Viện Dự Án

Khi tạo xong ảnh từ Pollinations:
1. Tải ảnh buffer về và lưu vào thư mục dự án: `public/generated/{project_id}/moodboard_pollinations.png`.
2. Ghi nhận link ảnh vào bảng dữ liệu `curated_records/{project_id}.json` và `lumina_database.csv`.
3. Hiển thị ảnh tức thì trên tab **"4. Mockups & Moodboard"** tại Bàn làm việc Admin và trang Proposal của khách.

