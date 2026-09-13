@echo off
setlocal
chcp 65001 > nul

echo ==========================================
echo  [1/3] Vite Build (Creating dist/)
echo ==========================================
call npx vite build --emptyOutDir false
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Vite build failed.
    exit /b 1
)

echo ==========================================
echo  [2/3] Git Push to GitHub (origin/main)
echo ==========================================
git push origin main

echo ==========================================
echo  [3/3] Upload to Xserver (/home/mdo3/smile049.jp/public_html/)
echo ==========================================
scp -P 10022 -o BatchMode=yes -r dist/* mdo3@mdo3.xsrv.jp:/home/mdo3/smile049.jp/public_html/
if %ERRORLEVEL% neq 0 (
    echo [ERROR] File upload failed.
    exit /b 1
)

echo ==========================================
echo  Adjusting server permissions...
echo ==========================================
ssh -p 10022 -o BatchMode=yes mdo3@mdo3.xsrv.jp "chmod 755 /home/mdo3/smile049.jp/public_html && find /home/mdo3/smile049.jp/public_html -type d -exec chmod 755 {} + && find /home/mdo3/smile049.jp/public_html -type f -exec chmod 644 {} +"

echo ==========================================
echo  Deploy completed successfully!
echo  URL:    https://smile049.jp/
echo  GitHub: https://github.com/mdo3-system/smile049
echo ==========================================
