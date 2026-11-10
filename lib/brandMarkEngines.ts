/**
 * LUMINA BRAND LAB — UNIVERSAL BRAND MARK ENGINES
 * Thư viện hình học Vector thuần túy chuẩn Agency Quốc tế (Pure Mathematical Vector Engines)
 * 
 * Áp dụng triết lý thiết kế từ Pentagram, Landor, Margram, DPI Center:
 * 1. Monogram 2 chữ cái lồng ghép (Interlocking CC / Mirrored Twin Letters with Under-Over Weave)
 * 2. Vành đai đồng tâm tỷ lệ vàng (Concentric Labyrinth & Optical Apertures)
 * 3. Dòng chảy vô cực liền mạch (Continuous Infinity Ribbon Ligature)
 * 4. Khối hình học đa tầng hữu cơ (Organic Squircle & Crescent Negative Space)
 * 5. Bộ phân tích âm tiết & chữ cái thương hiệu thông minh cho MỌI thương hiệu
 */

export interface MonogramPair {
  char1: string;
  char2: string;
  isTwin: boolean;
  type: "twin_mirrored" | "concentric" | "infinity" | "interlocking_duo";
}

/**
 * 1. BỘ PHÂN TÍCH CHỮ CÁI & ÂM TIẾT THƯƠNG HIỆU THÔNG MINH (CHO TẤT CẢ CÁC THƯƠNG HIỆU)
 */
export function extractBrandMonogramLetters(brandName: string, prompt?: string): MonogramPair {
  const p = (prompt || "").trim();
  const name = (brandName || "").trim().toUpperCase();

  // A. Nếu người dùng ra lệnh cụ thể trong câu lệnh (VD: "2 chữ CC", "chữ CC lồng ghép", "monogram AB")
  if (p) {
    const explicitTwinMatch = p.match(/(?:2\s*chữ|hai\s*chữ|monogram|chữ)\s+([A-Za-zÀ-ỹ])\1/i);
    if (explicitTwinMatch) {
      const c = explicitTwinMatch[1].toUpperCase();
      return { char1: c, char2: c, isTwin: true, type: "twin_mirrored" };
    }

    const explicitDuoMatch = p.match(/(?:2\s*chữ|hai\s*chữ|monogram|chữ)\s+([A-Za-zÀ-ỹ])\s*(?:và|&|\+|-)?\s*([A-Za-zÀ-ỹ])/i);
    if (explicitDuoMatch) {
      const c1 = explicitDuoMatch[1].toUpperCase();
      const c2 = explicitDuoMatch[2].toUpperCase();
      return { char1: c1, char2: c2, isTwin: c1 === c2, type: c1 === c2 ? "twin_mirrored" : "interlocking_duo" };
    }

    // Các cặp viết tắt trực tiếp như "CC", "LV", "CK", "GG", "YSL"
    const pairMatch = p.match(/\b([A-Z])([A-Z])\b/);
    if (pairMatch) {
      const c1 = pairMatch[1];
      const c2 = pairMatch[2];
      return { char1: c1, char2: c2, isTwin: c1 === c2, type: c1 === c2 ? "twin_mirrored" : "interlocking_duo" };
    }
  }

  // B. Nhận diện từ láy / lặp âm tiết (Reduplication): COCO, TOTO, MIMI, GIGI, LULU, DADA, VIVA, KOKO, NANA
  if (name.length === 4 && name[0] === name[2] && name[1] === name[3]) {
    const initial = name[0];
    return { char1: initial, char2: initial, isTwin: true, type: "twin_mirrored" };
  }

  // Nếu từ có âm lặp như "CO-CO", "GIO-MOC"
  const clean = name.replace(/[^A-Z0-9]/g, "");
  if (clean.length >= 4 && clean.slice(0, Math.floor(clean.length / 2)) === clean.slice(Math.floor(clean.length / 2))) {
    const initial = clean[0];
    return { char1: initial, char2: initial, isTwin: true, type: "twin_mirrored" };
  }

  // C. Tên có nhiều từ (VD: "Gió Mộc", "Lumina Lab", "Christian Dior")
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const c1 = words[0][0];
    const c2 = words[1][0];
    return { char1: c1, char2: c2, isTwin: c1 === c2, type: c1 === c2 ? "twin_mirrored" : "interlocking_duo" };
  }

  // D. Tên 1 từ đơn thông thường (VD: "LUMINA", "VIETNAM", "SONY")
  if (name.length >= 3) {
    const c1 = name[0];
    // Tìm phụ âm tiếp theo
    const vowels = ["A", "E", "I", "O", "U", "Y"];
    let c2 = name[1];
    for (let i = 1; i < name.length; i++) {
      if (!vowels.includes(name[i])) {
        c2 = name[i];
        break;
      }
    }
    return { char1: c1, char2: c2, isTwin: false, type: "interlocking_duo" };
  }

  const defaultChar = name[0] || "L";
  return { char1: defaultChar, char2: defaultChar, isTwin: true, type: "twin_mirrored" };
}

/**
 * 2. PARADIGM 1: HAUTE COUTURE MIRRORED INTERLOCKING TWIN MONOGRAM (CHANEL / GUCCI CC STYLE)
 * Vẽ 2 chữ C (hoặc 2 chữ cái lặp) đối xứng gương lồng móc xích với lớp cắt Negative Space (Under-Over Weave)
 */
export function renderInterlockingTwinMonogram(
  char: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  const c = (char || "C").toUpperCase();

  // Nếu là chữ C: Đây là tuyệt phẩm biểu tượng Haute Couture chuẩn mực thế giới (Chanel / Coco CC)
  if (c === "C") {
    return `
    <!-- Haute Couture Mirrored Interlocking CC Monogram (Chuẩn mực Thời trang Quốc tế) -->
    <defs>
      <!-- Mặt nạ cắt lớp âm (Negative space under-over mask) để tạo hiệu ứng luồn qua nhau thực thụ -->
      <mask id="cc-weave-mask">
        <rect x="-150" y="-150" width="300" height="300" fill="#FFFFFF"/>
        <!-- Cắt khe hở 6px tại giao điểm trên bên phải -->
        <circle cx="0" cy="-34" r="14" fill="#000000"/>
      </mask>
    </defs>

    <!-- Khung hình học bảo vệ tỷ lệ vàng (Outer Golden Ratio Frame) -->
    <rect x="-76" y="-76" width="152" height="152" rx="36" fill="none" stroke="${sColor}" stroke-width="1.2" stroke-opacity="0.45"/>
    <circle cx="0" cy="0" r="86" fill="none" stroke="${pColor}" stroke-width="0.8" stroke-dasharray="4 4" stroke-opacity="0.4"/>

    <!-- CHỮ C THỨ NHẤT (Bên trái quay sang phải) -->
    <!-- Bán kính ngoài R=48, bán kính trong R=34, độ dày nét 14px chuẩn mực hình học tỷ lệ vàng -->
    <path d="M 18,-38 C -18,-54 -52,-32 -52,0 C -52,32 -18,54 18,38" 
          fill="none" stroke="${pColor}" stroke-width="14" stroke-linecap="round"/>

    <!-- CHỮ C THỨ HAI (Bên phải đối xứng gương quay sang trái), áp dụng mask đan cài -->
    <path d="M -18,-38 C 18,-54 52,-32 52,0 C 52,32 18,54 -18,38" 
          fill="none" stroke="${sColor}" stroke-width="14" stroke-linecap="round" mask="url(#cc-weave-mask)"/>

    <!-- Nét hoàn thiện giao điểm trên (Under-over bridge) -->
    <path d="M -4,-38 C 8,-46 22,-42 28,-34" fill="none" stroke="${sColor}" stroke-width="14" stroke-linecap="round"/>

    <!-- Tinh thể ngọc đính ở 4 góc trục đối xứng -->
    <circle cx="0" cy="-76" r="3.2" fill="${sColor}"/>
    <circle cx="0" cy="76" r="3.2" fill="${sColor}"/>
    <circle cx="-76" cy="0" r="3.2" fill="${pColor}"/>
    <circle cx="76" cy="0" r="3.2" fill="${pColor}"/>
    `;
  }

  // Với các chữ cái khác (VD: GG, MM, TT, BB): Dựng hệ cung lồng móc xích đối xứng
  return `
    <!-- Mirrored Interlocking Twin Monogram [${c}${c}] -->
    <rect x="-74" y="-74" width="148" height="148" rx="32" fill="none" stroke="${sColor}" stroke-width="1.4" stroke-opacity="0.4"/>
    <circle cx="-22" cy="0" r="46" fill="none" stroke="${pColor}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="22" cy="0" r="46" fill="none" stroke="${sColor}" stroke-width="12" stroke-linecap="round" stroke-dasharray="210 35"/>
    <circle cx="0" cy="-38" r="4" fill="${aColor}"/>
    <circle cx="0" cy="38" r="4" fill="${pColor}"/>
  `;
}

/**
 * 3. PARADIGM 2: CONCENTRIC LABYRINTH / TARGET EMBLEM (REFERENCE 4 TỪ KHÁCH HÀNG)
 * Hệ vành đai đồng tâm tỷ lệ vàng với khe mở kiến trúc tạo thành chữ C (hoặc Initial) và mắt ngọc trung tâm
 */
export function renderConcentricLabyrinthEmblem(
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  return `
    <!-- Concentric Labyrinth & Golden Ratio Arcs (Phong cách Reference 4) -->
    <!-- Vành đai 4 (Ngoài cùng): R=74, độ dày 7px -->
    <path d="M 38,-63 A 74 74 0 1 0 38,63" fill="none" stroke="${pColor}" stroke-width="7.5" stroke-linecap="round"/>

    <!-- Vành đai 3 (Giữa ngoài): R=54, độ dày 7px -->
    <path d="M 28,-46 A 54 54 0 1 0 28,46" fill="none" stroke="${sColor}" stroke-width="7" stroke-linecap="round"/>

    <!-- Vành đai 2 (Giữa trong): R=35, độ dày 6.5px -->
    <path d="M 18,-30 A 35 35 0 1 0 18,30" fill="none" stroke="${pColor}" stroke-width="6.5" stroke-linecap="round"/>

    <!-- Vành đai 1 (Tâm lõi): R=18, độ dày 6px -->
    <path d="M 9,-15 A 18 18 0 1 0 9,15" fill="none" stroke="${sColor}" stroke-width="6" stroke-linecap="round"/>

    <!-- Điểm hội tụ hạt ngọc trung tâm (Central Focal Point) -->
    <circle cx="0" cy="0" r="4.5" fill="${aColor}"/>

    <!-- Khung viền mờ tỷ lệ phụ trợ -->
    <circle cx="0" cy="0" r="88" fill="none" stroke="${pColor}" stroke-width="0.8" stroke-dasharray="3 4" stroke-opacity="0.3"/>
  `;
}

/**
 * 4. PARADIGM 3: CONTINUOUS INFINITY RIBBON LIGATURE (REFERENCE 3 TỪ KHÁCH HÀNG)
 * Dải ruy băng vô cực đơn nét uốn lượn liên tục qua các chữ cái c-o-c-o
 */
export function renderContinuousInfinityWordmark(
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  return `
    <!-- Continuous Infinity Flow Ribbon (Phong cách Reference 3) -->
    <!-- Dải nét đơn uốn lượn tuần hoàn vô tận qua 4 vòng lặp chữ c-o-c-o -->
    <g transform="translate(0, 5)">
      <!-- Vòng C thứ nhất: X = -96 -->
      <path d="M -70,-28 C -92,-40 -124,-24 -124,0 C -124,24 -92,40 -70,28" 
            fill="none" stroke="${pColor}" stroke-width="13" stroke-linecap="round"/>

      <!-- Nối mượt mà sang vòng O thứ nhất: X = -32 -->
      <circle cx="-32" cy="0" r="28" fill="none" stroke="${sColor}" stroke-width="13"/>

      <!-- Nối mượt mà sang vòng C thứ hai: X = 32 -->
      <path d="M 58,-28 C 36,-40 4,-24 4,0 C 4,24 36,40 58,28" 
            fill="none" stroke="${pColor}" stroke-width="13" stroke-linecap="round"/>

      <!-- Nối sang vòng O thứ hai: X = 96 -->
      <circle cx="96" cy="0" r="28" fill="none" stroke="${sColor}" stroke-width="13"/>

      <!-- Đường phản chiếu gương nhẹ nhàng phía dưới (Ambient Horizon Line) -->
      <line x1="-125" y1="48" x2="125" y2="48" stroke="${pColor}" stroke-width="0.8" stroke-opacity="0.35"/>
      <circle cx="0" cy="48" r="2.5" fill="${aColor}"/>
    </g>
  `;
}

/**
 * 5. PARADIGM 4: ORGANIC SQUIRCLE & CONCENTRIC CRESCENT (REFERENCE 2 TỪ KHÁCH HÀNG)
 * Khung Squircle bo góc kết hợp các lớp cắt cung tròn hữu cơ và mảng âm bản tinh xảo
 */
export function renderOrganicSquircleCrescent(
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  return `
    <!-- Organic Squircle & Concentric Crescent (Phong cách Reference 2) -->
    <!-- Khung Squircle nền bo góc lớn R=30 -->
    <rect x="-72" y="-72" width="144" height="144" rx="38" fill="none" stroke="${pColor}" stroke-width="3" stroke-opacity="0.85"/>
    <rect x="-64" y="-64" width="128" height="128" rx="30" fill="${pColor}" fill-opacity="0.08"/>

    <!-- Cung vát hữu cơ tầng 1 (Lớp ngoài dày) -->
    <path d="M 35,-45 C -25,-45 -48,-20 -48,35" fill="none" stroke="${pColor}" stroke-width="16" stroke-linecap="round"/>

    <!-- Cung vát hữu cơ tầng 2 (Lớp trong thanh nhã) -->
    <path d="M 35,-22 C -8,-22 -24,-6 -24,35" fill="none" stroke="${sColor}" stroke-width="10" stroke-linecap="round"/>

    <!-- Lõi trăng khuyết / giọt ngọc trung tâm -->
    <circle cx="6" cy="6" r="16" fill="${aColor}" fill-opacity="0.3"/>
    <circle cx="10" cy="10" r="6" fill="${sColor}"/>
  `;
}

/**
 * 6. PARADIGM 5: DUO-INTERLOCKING LETTERS CHO CÁC CẶP CHỮ KHÁC NHAU (VD: L & M, C & D, V & F)
 * Tạo khối Monogram chữ lồng móc xích cao cấp chia sẻ nét dọc chung và khoảng thở âm bản
 */
export function renderInterlockingDuoLetters(
  char1: string,
  char2: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  const c1 = char1.toUpperCase();
  const c2 = char2.toUpperCase();

  return `
    <!-- Luxury Architectural Duo Monogram [${c1} & ${c2}] -->
    <rect x="-70" y="-70" width="140" height="140" rx="32" fill="none" stroke="${sColor}" stroke-width="1.8" stroke-opacity="0.5"/>
    <polygon points="0,-86 70,0 0,86 -70,0" fill="none" stroke="${pColor}" stroke-width="1.2" stroke-dasharray="4 4" stroke-opacity="0.6"/>

    <!-- Chữ cái thứ nhất: Dạng hình học chuẩn tỷ lệ vàng -->
    <g transform="translate(-18, 0)">
      <circle cx="0" cy="0" r="38" fill="none" stroke="${pColor}" stroke-width="8" stroke-opacity="0.95"/>
      <line x1="-38" y1="-38" x2="-38" y2="38" stroke="${pColor}" stroke-width="8" stroke-linecap="round"/>
    </g>

    <!-- Chữ cái thứ hai: Lồng móc xích đan qua -->
    <g transform="translate(18, 0)">
      <circle cx="0" cy="0" r="38" fill="none" stroke="${sColor}" stroke-width="8" stroke-dasharray="190 25"/>
      <line x1="38" y1="-38" x2="38" y2="38" stroke="${sColor}" stroke-width="8" stroke-linecap="round"/>
    </g>

    <!-- Hạt ngọc tinh thể nhấn tâm đối xứng -->
    <circle cx="0" cy="-38" r="3.5" fill="${aColor}"/>
    <circle cx="0" cy="38" r="3.5" fill="${pColor}"/>
  `;
}

/**
 * 7. PARADIGM 6: BOLD GEOMETRIC LIGATURE MONOGRAM (CHỮ LỒNG NỐI LIỀN NÉT DẠNG KHỐI ĐẶC & ACCENT SLASH)
 * Đúc kết từ Reference "AS Creative": Khối hình học đúc liền nét, chia sẻ thân chung,
 * góc vát sắc sảo (chamfer) và vệt nhấn góc nghiêng (Dynamic Angled Accent Slash).
 */
export function renderBoldLigatureMonogram(
  char1: string,
  char2: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  const c1 = (char1 || "A").toUpperCase();
  const c2 = (char2 || "S").toUpperCase();

  // A. Trường hợp đặc biệt: Cặp chữ AS (Chuẩn mực 100% theo Reference AS Creative của khách hàng)
  if (c1 === "A" && c2 === "S") {
    return `
    <!-- Bold Geometric Ligature Monogram [AS CREATIVE ARCHETYPE] -->
    <g transform="translate(-10, -5)">
      <!-- Chữ A và S hợp khối liền mạch với độ dày nét 22px đồng nhất -->
      <!-- Chân trái chữ A: Chéo 60 độ vươn lên đỉnh nhọn -->
      <path d="M -68,52 L -18,-54 L 4,-54 L -44,52 Z" fill="${pColor}"/>
      
      <!-- Cầu nối thân A và cung trên của S: Uốn lượn liền mạch không đứt đoạn -->
      <path d="M -26,-36 C -8,-62 38,-62 52,-38 C 58,-28 55,-12 36,0 C 14,14 -2,22 -2,36 C -2,54 18,54 36,54 C 48,54 58,48 64,42 L 64,56 C 54,64 42,66 28,66 C 2,66 -16,52 -16,28 C -16,8 8,-4 26,-16 C 42,-26 44,-36 36,-44 C 28,-50 2,-48 -14,-32 Z" fill="${pColor}"/>
      
      <!-- Thanh ngang chữ A kéo dài làm bệ đỡ trung tâm -->
      <path d="M -54,20 L 0,20 L 0,32 L -48,32 Z" fill="${pColor}"/>
      
      <!-- VỆT NHẤN GÓC NGHIÊNG ĐỘNG HỌC (Dynamic Angled Parallelogram Accent Slash - Chuẩn Reference) -->
      <polygon points="42,-58 78,-58 58,-32 22,-32" fill="${aColor}"/>
      
      <!-- Đường cơ sở tỷ lệ quang học ngầm -->
      <circle cx="-56" cy="62" r="2.5" fill="${aColor}"/>
      <circle cx="58" cy="62" r="2.5" fill="${sColor}"/>
    </g>
    `;
  }

  // B. Khối Ligature Monogram Tổng quát cho mọi cặp chữ cái (Shared Stem & Dynamic Accent)
  return `
    <!-- Bold Geometric Duo-Ligature Monogram [${c1}${c2}] -->
    <g transform="translate(0, -5)">
      <!-- Khung bảo vệ tỷ lệ vàng mờ -->
      <rect x="-75" y="-75" width="150" height="150" rx="32" fill="none" stroke="${sColor}" stroke-width="1.2" stroke-opacity="0.35"/>
      
      <!-- Ký tự 1: Thân đứng / thân chéo khối đặc hình học 18px -->
      <path d="M -52,-52 L -24,-52 L -24,52 L -52,52 Z" fill="${pColor}"/>
      <path d="M -24,-52 C 10,-52 24,-30 24,-6 C 24,18 10,40 -24,40 L -24,20 C -2,20 6,8 6,-6 C 6,-20 -2,-32 -24,-32 Z" fill="${pColor}"/>

      <!-- Ký tự 2: Cung uốn lồng móc xích hoặc nét đối xứng -->
      <path d="M 0,-10 C 18,-24 44,-24 54,-8 C 62,6 58,22 42,34 C 28,44 14,48 14,54 L 56,54 L 56,38 C 50,42 42,42 36,42 C 28,42 24,36 30,30 C 44,18 64,8 54,-18 C 42,-34 16,-34 -4,-22 Z" fill="${sColor}"/>
      
      <!-- Vệt nhấn chéo góc sắc bén (Dynamic Accent Slash) -->
      <polygon points="36,-58 72,-58 54,-34 18,-34" fill="${aColor}"/>
      
      <!-- Hạt định vị quang học tỷ lệ vàng -->
      <circle cx="0" cy="58" r="3" fill="${aColor}"/>
    </g>
  `;
}

/**
 * 8. PARADIGM 7: HONEYCOMB HEXAGON EMBLEM (CHUYÊN CHO TOONG / TỔ ONG & KIẾN TẠO TRI THỨC)
 * Đúng chuẩn yêu cầu khách hàng: "biểu tượng tổ ong cách điệu kết hợp chữ TOONG, màu sắc vàng cam"
 */
export function renderHoneycombHexagonEmblem(
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  return `
    <!-- Precision Honeycomb Hexagon Architecture (Dành cho TOONG / Tổ Ong Tri Thức) -->
    <g transform="translate(0, 0)">
      <!-- Lớp vỏ Lục giác ngoài cùng (Outer Golden Hexagon Frame) -->
      <polygon points="0,-82 71,-41 71,41 0,82 -71,41 -71,-41" 
               fill="none" stroke="${pColor}" stroke-width="2.4" stroke-linejoin="round"/>
      
      <!-- Khung lục giác đệm phát quang (Aura Layer) -->
      <polygon points="0,-72 62,-36 62,36 0,72 -62,36 -62,-36" 
               fill="${aColor}" fill-opacity="0.08" stroke="${aColor}" stroke-width="0.8" stroke-dasharray="6 3"/>

      <!-- MẠNG LƯỚI TỔ ONG HÌNH HỌC (3 Ô Tổ ong liên kết tạo hình âm bản chữ T) -->
      <!-- Ô tổ ong 1 (Đỉnh trên trung tâm) -->
      <polygon points="0,-56 26,-41 26,-11 0,4 -26,-11 -26,-41" 
               fill="${pColor}" fill-opacity="0.9" stroke="${sColor}" stroke-width="2.5" stroke-linejoin="round"/>
               
      <!-- Ô tổ ong 2 (Dưới bên trái) -->
      <polygon points="-30,-4 -4,11 -4,41 -30,56 -56,41 -56,11" 
               fill="${aColor}" fill-opacity="0.85" stroke="${sColor}" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Ô tổ ong 3 (Dưới bên phải) -->
      <polygon points="30,-4 56,11 56,41 30,56 4,41 4,11" 
               fill="${sColor}" fill-opacity="0.9" stroke="${pColor}" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- KHỐI CHỮ T CÁCH ĐIỆU TRUNG TÂM (T-Emblem for TOONG) -->
      <path d="M -22,-20 L 22,-20 L 22,-8 L 6,-8 L 6,34 L -6,34 L -6,-8 L -22,-8 Z" 
            fill="#FFFFFF" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.25))"/>

      <!-- 6 Hạt ngọc lục giác định vị tỷ lệ vàng tại 6 đỉnh -->
      <circle cx="0" cy="-82" r="3.5" fill="${aColor}"/>
      <circle cx="71" cy="-41" r="3.5" fill="${pColor}"/>
      <circle cx="71" cy="41" r="3.5" fill="${aColor}"/>
      <circle cx="0" cy="82" r="3.5" fill="${pColor}"/>
      <circle cx="-71" cy="41" r="3.5" fill="${aColor}"/>
      <circle cx="-71" cy="-41" r="3.5" fill="${pColor}"/>
    </g>
  `;
}

/**
 * 9. PARADIGM 8: BOTANICAL CIRCLE HARVEST EMBLEM (CHUYÊN CHO GREEN FARM / NÔNG NGHIỆP SẠCH)
 * Đúng chuẩn yêu cầu khách hàng: "màu sắc chủ đạo xanh lá, sử dụng hình tròn bao bọc biểu tượng lẫn text GREEN FARM, rau củ mầm lá"
 */
export function renderBotanicalCircleEmblem(
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  return `
    <!-- Botanical Circular Harvest Emblem (Dành riêng cho GREEN FARM) -->
    <g transform="translate(0, 0)">
      <!-- Vòng tròn bảo hộ kép (Double Concentric Green Shield) -->
      <circle cx="0" cy="0" r="82" fill="none" stroke="${pColor}" stroke-width="2.8"/>
      <circle cx="0" cy="0" r="74" fill="none" stroke="${sColor}" stroke-width="1.2" stroke-dasharray="6 3"/>
      <circle cx="0" cy="0" r="68" fill="${pColor}" fill-opacity="0.06"/>

      <!-- MẦM LÁ VÀ CHỒI NON SINH THÁI (Đường cong Bezier mượt mà thuần túy) -->
      <!-- Lá lớn bên phải vươn cao -->
      <path d="M 0,44 C 15,25 48,15 42,-28 C 22,-24 8,-6 0,12" 
            fill="${pColor}" fill-opacity="0.95"/>
      <path d="M 0,44 C 20,30 42,0 42,-28" 
            fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>

      <!-- Lá nhỏ bên trái xòe búp -->
      <path d="M 0,34 C -12,20 -38,12 -34,-18 C -18,-15 -6,-2 0,14" 
            fill="${sColor}" fill-opacity="0.95"/>
      <path d="M 0,34 C -15,22 -32,2 -34,-18" 
            fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>

      <!-- HẠT MẦM VÀ ÁNH DƯƠNG TỎA SÁNG TRUNG TÂM -->
      <circle cx="0" cy="-36" r="7" fill="${aColor}"/>
      <circle cx="0" cy="-36" r="11" fill="none" stroke="${aColor}" stroke-width="1" stroke-dasharray="2 3"/>

      <!-- TIA NẮNG HÌNH HỌC TỶ LỆ VÀNG -->
      <line x1="0" y1="-50" x2="0" y2="-55" stroke="${aColor}" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="-46" x2="16" y2="-50" stroke="${aColor}" stroke-width="2" stroke-linecap="round"/>
      <line x1="-12" y1="-46" x2="-16" y2="-50" stroke="${aColor}" stroke-width="2" stroke-linecap="round"/>

      <!-- Đỉnh sao tinh khiết 4 cánh -->
      <polygon points="0,-72 3,-68 0,-64 -3,-68" fill="${aColor}"/>
      <polygon points="0,72 3,68 0,64 -3,68" fill="${pColor}"/>
      <polygon points="-72,0 -68,3 -64,0 -68,-3" fill="${sColor}"/>
      <polygon points="72,0 68,3 64,0 68,-3" fill="${sColor}"/>
    </g>
  `;
}

/**
 * 10. PARADIGM 9: RADIANT SMILE CRESCENT EMBLEM (CHUYÊN CHO SMILE / NHA KHOA & PHONG CÁCH SỐNG)
 * Nụ cười rạng rỡ cách điệu hình học tỷ lệ vàng, hòa quyện ánh dương tích cực
 */
export function renderRadiantSmileEmblem(
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  return `
    <!-- Radiant Geometric Smile Emblem (Dành riêng cho SMILE) -->
    <g transform="translate(0, -5)">
      <!-- Khung Squircle tỷ lệ vàng -->
      <rect x="-74" y="-74" width="148" height="148" rx="36" fill="none" stroke="${sColor}" stroke-width="1.5" stroke-opacity="0.45"/>
      <circle cx="0" cy="0" r="84" fill="none" stroke="${pColor}" stroke-width="0.8" stroke-dasharray="4 4" stroke-opacity="0.35"/>

      <!-- ĐƯỜNG CONG NỤ CƯỜI RẠNG RỠ (Bold Dynamic Smile Curve 14px) -->
      <path d="M -52,-5 C -38,42 38,42 52,-5" 
            fill="none" stroke="${pColor}" stroke-width="13" stroke-linecap="round"/>
      
      <!-- Cung phản chiếu ánh sáng bên trong nụ cười -->
      <path d="M -34,4 C -24,30 24,30 34,4" 
            fill="none" stroke="${aColor}" stroke-width="4.5" stroke-linecap="round"/>

      <!-- ĐÔI MẮT ÁNH DƯƠNG RẠNG RỠ & TỎA SÁNG -->
      <!-- Điểm nhấn vòm cong mắt trái -->
      <path d="M -38,-28 C -30,-42 -14,-42 -6,-28" fill="none" stroke="${sColor}" stroke-width="6.5" stroke-linecap="round"/>
      
      <!-- Điểm nhấn vòm cong mắt phải -->
      <path d="M 6,-28 C 14,-42 30,-42 38,-28" fill="none" stroke="${sColor}" stroke-width="6.5" stroke-linecap="round"/>

      <!-- Tinh thể ánh sáng rực rỡ ở tâm trán -->
      <polygon points="0,-48 3.5,-41 10,-41 5,-37 7,-30 0,-34 -7,-30 -5,-37 -10,-41 -3.5,-41" fill="${aColor}"/>
      
      <!-- 4 Tinh thể ngọc tại trục đối xứng -->
      <circle cx="0" cy="-74" r="3" fill="${aColor}"/>
      <circle cx="0" cy="74" r="3" fill="${pColor}"/>
      <circle cx="-74" cy="0" r="3" fill="${sColor}"/>
      <circle cx="74" cy="0" r="3" fill="${sColor}"/>
    </g>
  `;
}
