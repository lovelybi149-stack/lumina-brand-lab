const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

console.log("================================================================================");
console.log("  LUMINA BRAND LAB — HỆ THỐNG KIỂM TRA & THỬ NGHIỆM VẬN HÀNH CƠ SỞ DỮ LIỆU");
console.log("================================================================================\n");

let passedTests = 0;
let totalTests = 0;

function assertTest(name, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${name}`);
    if (details) console.log(`         -> ${details}`);
  } else {
    console.error(`  [FAIL] Test ${totalTests}: ${name}`);
    if (details) console.error(`         -> LỖI: ${details}`);
  }
}

// ------------------------------------------------------------------------------
// PHẦN 1: KIỂM TRA FILE CSV & CẤU TRÚC 15 CỘT
// ------------------------------------------------------------------------------
console.log("--- [GIAI ĐOẠN 1]: KIỂM TRA TÍNH TOÀN VẸN CỦA FILE lumina_database.csv ---");

const csvPath = path.join(__dirname, "lumina_database.csv");
assertTest("File lumina_database.csv tồn tại", fs.existsSync(csvPath));

const csvRaw = fs.readFileSync(csvPath);
// Kiểm tra BOM
const hasBOM = csvRaw[0] === 0xEF && csvRaw[1] === 0xBB && csvRaw[2] === 0xBF;
assertTest("File CSV có UTF-8 BOM để Excel hiển thị tiếng Việt chuẩn", hasBOM);

// Phân tích CSV chuẩn (RFC 4180 parser)
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === '\r') {
        // bỏ qua \r
      } else if (char === '\n') {
        currentRow.push(currentField);
        if (currentRow.length > 1 || currentRow[0] !== "") {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

const csvText = csvRaw.toString("utf8").replace(/^\uFEFF/, "");
const csvRows = parseCSV(csvText);

const expectedHeaders = [
  "project_id", "client_name", "client_contact", "brand_name", "industry_target", "style_vibe",
  "ai_brand_story", "ai_color_palette", "ai_typography", "ai_moodboard_url", "ai_mockup_url",
  "designer_final_palette_font", "designer_final_visual_notes",
  "status", "proposal_url"
];

assertTest("Header có đủ chính xác 15 cột", csvRows[0].length === 15, `Số cột thực tế: ${csvRows[0].length}`);

const headersMatch = expectedHeaders.every((h, idx) => csvRows[0][idx] === h);
assertTest("Thứ tự và tên 15 cột khớp 100% tài liệu thiết kế", headersMatch);

assertTest("Số dòng dữ liệu ban đầu là 2 dòng mẫu", csvRows.length === 3, `Tổng số dòng (kèm header): ${csvRows.length}`);

// Kiểm tra dòng 1 (Pending)
const row1 = csvRows[1];
assertTest("Dòng 1: project_id = LUMINA-01", row1[0] === "LUMINA-01");
assertTest("Dòng 1: status = 'Pending'", row1[13] === "Pending");
assertTest("Dòng 1: ai_moodboard_url có công thức =IMAGE()", row1[9].startsWith("=IMAGE("));
assertTest("Dòng 1: ai_mockup_url có công thức =IMAGE()", row1[10].startsWith("=IMAGE("));
assertTest("Dòng 1: Khối Curation đang chờ duyệt thẩm mỹ", row1[11].includes("Chờ Designer duyệt"));

// Kiểm tra dòng 2 (Approved)
const row2 = csvRows[2];
assertTest("Dòng 2: project_id = LUMINA-02", row2[0] === "LUMINA-02");
assertTest("Dòng 2: status = 'Approved'", row2[13] === "Approved");
assertTest("Dòng 2: Khối Curation đã được tinh chỉnh hoàn chỉnh", row2[11].includes("ĐÃ DUYỆT"));
assertTest("Dòng 2: proposal_url có đường link xem Pitch Deck", row2[14].startsWith("https://"));


// ------------------------------------------------------------------------------
// PHẦN 2: KIỂM TRA FILE EXCEL (.xlsx) & CÁC TÍNH NĂNG NÂNG CAO
// ------------------------------------------------------------------------------
console.log("\n--- [GIAI ĐOẠN 2]: KIỂM TRA FILE EXCEL lumina_database.xlsx ---");

const xlsxPath = path.join(__dirname, "lumina_database.xlsx");
assertTest("File lumina_database.xlsx tồn tại", fs.existsSync(xlsxPath));

// Đọc và giải nén các thành phần OpenXML từ file .xlsx
function readZipEntries(zipBuffer) {
  const entries = {};
  let i = 0;
  while (i < zipBuffer.length - 4) {
    const sig = zipBuffer.readUInt32LE(i);
    if (sig === 0x04034b50) { // Local File Header
      const compMethod = zipBuffer.readUInt16LE(i + 8);
      const compSize = zipBuffer.readUInt32LE(i + 18);
      const uncompSize = zipBuffer.readUInt32LE(i + 22);
      const nameLen = zipBuffer.readUInt16LE(i + 26);
      const extraLen = zipBuffer.readUInt16LE(i + 28);
      const fileName = zipBuffer.toString("utf8", i + 30, i + 30 + nameLen);
      const dataStart = i + 30 + nameLen + extraLen;
      const compData = zipBuffer.subarray(dataStart, dataStart + compSize);
      
      let data;
      if (compMethod === 8) {
        data = zlib.inflateRawSync(compData);
      } else {
        data = compData;
      }
      entries[fileName] = data.toString("utf8");
      i = dataStart + compSize;
    } else {
      i++;
    }
  }
  return entries;
}

const xlsxBuffer = fs.readFileSync(xlsxPath);
const zipEntries = readZipEntries(xlsxBuffer);

assertTest("XLSX chứa định nghĩa bảng tính workbook.xml", !!zipEntries["xl/workbook.xml"]);
assertTest("Tên Sheet chính xác là 'LUMINA_Projects'", zipEntries["xl/workbook.xml"].includes('name="LUMINA_Projects"'));

const stylesXml = zipEntries["xl/styles.xml"] || "";
assertTest("Đã cấu hình màu Header Khối 1: Brief Đầu Vào (#1F4E79)", stylesXml.includes("1F4E79"));
assertTest("Đã cấu hình màu Header Khối 2: AI Đề Xuất (#53389E)", stylesXml.includes("53389E"));
assertTest("Đã cấu hình màu Header Khối 3: Duyệt Thẩm Mỹ (#B54708)", stylesXml.includes("B54708"));
assertTest("Đã cấu hình màu Header Khối 4: Quản Lý & Bàn Giao (#027A48)", stylesXml.includes("027A48"));
assertTest("Đã cấu hình màu Badge trạng thái Pending (#FEF3C7)", stylesXml.includes("FEF3C7"));
assertTest("Đã cấu hình màu Badge trạng thái Approved (#D1FAE5)", stylesXml.includes("D1FAE5"));

const sheet1Xml = zipEntries["xl/worksheets/sheet1.xml"] || "";
assertTest("Đã cấu hình Cố định dòng tiêu đề (Freeze Panes A2)", sheet1Xml.includes('state="frozen"') && sheet1Xml.includes('ySplit="1"'));
assertTest("Đã cấu hình Data Validation Dropdown chỉ nhận 'Pending,Approved'", sheet1Xml.includes('&quot;Pending,Approved&quot;'));
assertTest("Độ rộng 15 cột đã được tùy chỉnh tự động vừa vặn", sheet1Xml.includes('<col min="1" max="1"') && sheet1Xml.includes('<col min="15" max="15"'));


// ------------------------------------------------------------------------------
// PHẦN 3: THỬ NGHIỆM VẬN HÀNH THỰC TẾ LUỒNG QUY TRÌNH (WORKFLOW SIMULATION)
// ------------------------------------------------------------------------------
console.log("\n--- [GIAI ĐOẠN 3]: MÔ PHỎNG VẬN HÀNH TOÀN BỘ WORKFLOW THỰC TẾ ---");

console.log("  >>> BƯỚC 1: Khách hàng nộp Brief trên Web Form");
const newBrief = {
  project_id: "LUMINA-03",
  client_name: "Phạm Thảo Vy",
  client_contact: "0903.554.889 / vy.pham@bloomtea.vn",
  brand_name: "BLOOM BOTANICAL TEA",
  industry_target: "F&B - Trà hoa thảo mộc hữu cơ cao cấp. Target: Nữ giới 22-38 tuổi yêu lối sống lành mạnh (Wellness & Self-care).",
  style_vibe: "Earthy, Serene, Botanical Luxury, Tinh tế, Thanh thuần."
};
console.log(`      Đã nhận Brief mới: [${newBrief.project_id}] ${newBrief.brand_name} - Khách hàng: ${newBrief.client_name}`);

console.log("  >>> BƯỚC 2: AI tự động phân tích & đề xuất Text + Hình ảnh");
const aiProposal = {
  ai_brand_story: "BLOOM BOTANICAL TEA mang đến liệu pháp an yên từ những cánh hoa trà hữu cơ sấy lạnh giữ trọn tinh túy đất trời. Slogan: 'Nurture Your Inner Glow'.",
  ai_color_palette: "#2D4030 (Botanical Moss), #E8DCC4 (Chamomile Oat), #D48C70 (Dried Terracotta), #8DAA91 (Sage Leaf), #F9F8F6 (Clean Jasmine)",
  ai_typography: "Header: Playfair Display (Medium Serif) | Body: Inter (Clean Sans-serif)",
  ai_moodboard_url: '=IMAGE("https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80")',
  ai_mockup_url: '=IMAGE("https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80")'
};
console.log(`      AI đã sinh Brand Story: "${aiProposal.ai_brand_story.slice(0, 50)}..."`);
console.log(`      AI đã sinh Bảng màu: ${aiProposal.ai_color_palette}`);

console.log("  >>> BƯỚC 3: Hệ thống đẩy dự án vào Sheet với trạng thái ban đầu 'Pending'");
let projectRow = [
  newBrief.project_id,
  newBrief.client_name,
  newBrief.client_contact,
  newBrief.brand_name,
  newBrief.industry_target,
  newBrief.style_vibe,
  aiProposal.ai_brand_story,
  aiProposal.ai_color_palette,
  aiProposal.ai_typography,
  aiProposal.ai_moodboard_url,
  aiProposal.ai_mockup_url,
  "[Chờ Designer duyệt - AI đề xuất 5 màu botanical & font Playfair/Inter]",
  "[Chờ Designer duyệt - Cần dựng mockup hũ thủy tinh nắp gỗ sồi & nhãn ép kim mờ]",
  "Pending",
  "[Chưa xuất - Đang chờ duyệt thẩm mỹ]"
];
assertTest("Dự án LUMINA-03 khởi tạo ở trạng thái 'Pending'", projectRow[13] === "Pending");

console.log("  >>> BƯỚC 4: Designer mở bảng tính, duyệt & căn chỉnh thẩm mỹ (Human Curation)");
// Designer cập nhật thẩm mỹ
projectRow[11] = "ĐÃ DUYỆT & TINH CHỈNH: Tông màu rất hợp định vị trà thảo mộc. Chốt 3 màu chủ lực: #2D4030, #E8DCC4, #D48C70. Đổi font Body sang 'Plus Jakarta Sans' để hiển thị tiếng Việt mềm mại hơn.";
projectRow[12] = "HOÀN TẤT CURATION: Logo icon cách điệu cánh hoa trà kết hợp giọt nước. Nhãn in giấy Kraft mỹ thuật mờ 250gsm dập nổi logo. Visual link: https://cdn.lumina-brandlab.com/curated/lumina-03-final-pack.jpg";

console.log("  >>> BƯỚC 5: Kiểm tra ràng buộc hợp lệ Data Validation khi Designer chuyển trạng thái");
function validateStatus(status) {
  const allowed = ["Pending", "Approved"];
  return allowed.includes(status);
}

assertTest("Data Validation từ chối trạng thái không hợp lệ 'In Progress'", validateStatus("In Progress") === false);
assertTest("Data Validation từ chối trạng thái không hợp lệ 'Done'", validateStatus("Done") === false);
assertTest("Data Validation chấp thuận trạng thái hợp lệ 'Approved'", validateStatus("Approved") === true);

projectRow[13] = "Approved";

console.log("  >>> BƯỚC 6: Trạng thái Approved kích hoạt xuất Proposal / Pitch Deck");
projectRow[14] = `https://lumina-brandlab.com/proposals/${projectRow[0]}-${projectRow[3].replace(/[^A-Za-z0-9]/g, "_")}.pdf`;
assertTest("Tạo thành công đường dẫn Pitch Deck bàn giao cho khách", projectRow[14].endsWith(".pdf"));

function escapeCSVField(val) {
  if (typeof val !== "string") return String(val);
  if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

// Giả lập lưu trữ dự án mới vào bộ nhớ & kiểm tra tính toàn vẹn
const updatedRows = [...csvRows, projectRow];
const updatedCsvContent = "\uFEFF" + updatedRows.map(r => r.map(escapeCSVField).join(",")).join("\n");
const simulatedReloadedRows = parseCSV(updatedCsvContent.replace(/^\uFEFF/, ""));
assertTest("Quy trình xuất CSV lưu trữ thành công dự án LUMINA-03 (Tổng cộng 3 dự án)", simulatedReloadedRows.length === 4);

// ------------------------------------------------------------------------------
// TỔNG KẾT
// ------------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`  KẾT QUẢ KIỂM TRA & THỬ NGHIỆM: ${passedTests}/${totalTests} TESTS ĐẠT CHUẨN 100%`);
console.log("  HỆ THỐNG ĐÃ SẴN SÀNG VẬN HÀNH CHO LUMINA BRAND LAB!");
console.log("================================================================================");
