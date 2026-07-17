param(
    [string]$MysqlExe,
    [string]$User = "root",
    [string]$Password = ""
)

$ErrorActionPreference = "Stop"

if (-not $MysqlExe) {
    $command = Get-Command mysql -ErrorAction SilentlyContinue
    if ($command) {
        $MysqlExe = $command.Source
    }
    else {
        $defaultPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
        if (Test-Path $defaultPath) {
            $MysqlExe = $defaultPath
        }
    }
}

if (-not $MysqlExe -or -not (Test-Path $MysqlExe)) {
    Write-Error "mysql.exe was not found. Install MySQL Server or pass -MysqlExe 'C:\path\to\mysql.exe'."
}

$sqlFile = Join-Path $PSScriptRoot "sql\bellevouix_database.sql"
$sourcePath = $sqlFile.Replace("\", "/")

Write-Host "Loading Bellevouix database from $sqlFile"

$passwordArg = if ($Password) { "-p$Password" } else { "-p" }
& $MysqlExe -u $User $passwordArg "--default-character-set=utf8mb4" "--execute=source $sourcePath"

Write-Host ""
Write-Host "Database setup finished. Start the API with .\run_api.ps1 -ConnectorJar C:\path\to\mysql-connector-j.jar"
