@echo off
setlocal

echo Bellevouix MySQL root password reset
echo.
echo IMPORTANT: Right-click this file and choose "Run as administrator".
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$password = Read-Host 'Enter new MySQL root password';" ^
  "& '%~dp0reset_mysql_root_password.ps1' -NewRootPassword $password"

echo.
pause
