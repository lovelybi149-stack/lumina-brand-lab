import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "LUMINA BRAND LAB — Khởi tạo Bản sắc Thương hiệu Chuẩn mực trong 24 Giờ",
  description:
    "Xưởng ý tưởng nhận diện thương hiệu bán tự động. Sự kết hợp giữa tốc độ đột phá của Trí tuệ Nhân tạo và con mắt thẩm mỹ của Giám đốc Sáng tạo. Nhận ngay Concept Logo, Màu sắc, Font chữ và Trọn bộ file [SVG + PNG + PDF].",
  keywords: [
    "Lumina Brand Lab",
    "Thiết kế logo",
    "Nhận diện thương hiệu",
    "Brand Identity",
    "Creative Director",
    "AI Branding",
    "Logo Vector SVG",
  ],
  authors: [{ name: "LUMINA BRAND LAB Creative Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-stone-950 text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
