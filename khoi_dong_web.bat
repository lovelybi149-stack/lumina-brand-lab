@echo off
chcp 65001 >nul
title LUMINA BRAND LAB — TRUNG TÂM KHỞI ĐỘNG HỆ THỐNG
color 0F

echo ======================================================================
echo    LUMINA BRAND LAB — XƯỞNG Ý TƯỞNG NHẬN DIỆN THƯƠNG HIỆU
echo ======================================================================
echo.
echo [1/3] Đang dọn dẹp các cổng kết nối cũ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Hệ thống đã sẵn sàng kết nối.
echo [3/3] Đang khởi chạy Web Server...
echo.
echo ======================================================================
echo   ĐỊA CHỈ TRUY CẬP (Đang tự động mở trình duyệt sau 3 giây...):
echo   • Trang Khách Hàng:       http://localhost:3000
echo   • Bàn Làm Việc Admin:     http://localhost:3000/admin
echo   • Cổng Duyệt Khách Hàng:  http://localhost:3000/review
echo   • Mật khẩu Quản trị viên: lumina2026
echo ======================================================================
echo.
echo (Lưu ý: Giữ cửa sổ này mở trong khi sử dụng web. Khi muốn tắt, chỉ cần đóng cửa sổ này.)
echo.

:: Tự động bật trình duyệt sau 3 giây
start /b "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Khởi chạy Next.js Server
node --require ./patch-fs.js ./node_modules/next/dist/bin/next start -p 3000
if %errorlevel% neq 0 (
    echo.
    echo [Thong bao] Dang chuyen sang che do phat trien (Dev)...
    node --require ./patch-fs.js ./node_modules/next/dist/bin/next dev -p 3000
)

pause
