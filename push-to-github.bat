@echo off
echo ============================================
echo Pushing QR Attendance Code to GitHub
echo ============================================
echo.
echo Repository: https://github.com/Sopan7654/Qr-Attendance.git
echo.
echo This will push your updated code with:
echo - Custom Date-Time Picker
echo - Mobile Responsive Design
echo - Premium UI Improvements
echo.
pause

git push -f origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo SUCCESS! Code pushed to GitHub
    echo ============================================
) else (
    echo.
    echo ============================================
    echo FAILED! Authentication required
    echo ============================================
    echo.
    echo Please use one of these methods:
    echo.
    echo 1. GitHub Desktop (Easiest):
    echo    - Open GitHub Desktop
    echo    - Add this repository
    echo    - Click Push
    echo.
    echo 2. Personal Access Token:
    echo    - Go to github.com/settings/tokens
    echo    - Generate new token (classic)
    echo    - Select 'repo' scope
    echo    - Copy the token
    echo    - Run: git push https://TOKEN@github.com/Sopan7654/Qr-Attendance.git main -f
    echo.
)

pause
