param(
    [Parameter(Mandatory = $true)]
    [string]$NewRootPassword,

    [string]$ServiceName = "MySQL80"
)

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)

if (-not $isAdmin) {
    Write-Error "Please run PowerShell as Administrator, then run this script again."
    exit 1
}

$mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqld = Join-Path $mysqlBin "mysqld.exe"
$mysql = Join-Path $mysqlBin "mysql.exe"
$mysqladmin = Join-Path $mysqlBin "mysqladmin.exe"
$defaultsFile = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$initFile = Join-Path $env:TEMP "bellevouix_mysql_root_reset.sql"

if (-not (Test-Path $mysqld)) {
    Write-Error "mysqld.exe was not found at $mysqld"
    exit 1
}

if (-not (Test-Path $defaultsFile)) {
    Write-Error "MySQL config file was not found at $defaultsFile"
    exit 1
}

$escapedPassword = $NewRootPassword.Replace("'", "''")
$resetSql = "ALTER USER 'root'@'localhost' IDENTIFIED BY '$escapedPassword';"
Set-Content -Path $initFile -Value $resetSql -Encoding ASCII

Write-Host "Stopping MySQL service: $ServiceName"
Stop-Service -Name $ServiceName -Force

Write-Host "Starting MySQL one time with password reset file..."
$process = Start-Process `
    -FilePath $mysqld `
    -ArgumentList "--defaults-file=`"$defaultsFile`"", "--init-file=`"$initFile`"" `
    -WindowStyle Hidden `
    -PassThru

Start-Sleep -Seconds 8

Write-Host "Shutting down temporary MySQL process..."
& $mysqladmin -u root "-p$NewRootPassword" shutdown

if (-not $process.HasExited) {
    Start-Sleep -Seconds 3
}

Remove-Item -LiteralPath $initFile -Force -ErrorAction SilentlyContinue

Write-Host "Starting normal MySQL service again..."
Start-Service -Name $ServiceName

Start-Sleep -Seconds 4

Write-Host "Testing root login..."
& $mysql -u root "-p$NewRootPassword" -e "SELECT VERSION() AS mysql_version;"

Write-Host ""
Write-Host "Done. Your MySQL root password has been reset."
Write-Host "You can now load the Bellevouix database with:"
Write-Host "mysql -u root -p < sql/bellevouix_database.sql"
