@echo off
chcp 65001 >nul
cd /d "D:\kiro\schechle"
echo === Schechle Deploy ===
echo [1/4] Building...
call npm run build
if errorlevel 1 (
    echo BUILD FAILED!
    pause
    exit /b 1
)
echo [2/4] Switch to gh-pages...
git stash
git checkout gh-pages
echo [3/4] Copy new files...
if exist _next rmdir /s /q _next
del /q index.html 404.html index.txt manifest.json sw.js icon-192.svg icon-512.svg 2>nul
xcopy out\* . /s /e /y /q
echo [4/4] Push to GitHub...
git add index.html 404.html index.txt _next/ manifest.json sw.js 2>nul
git add icons/ 2>nul
git commit -m "deploy: update"
git push
git checkout master --force
git stash pop 2>nul
echo.
echo === DONE ===
pause
