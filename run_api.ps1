param(
    [string]$ConnectorJar = "java\ECommerceProject\mysql-connector-j.jar",
    [string]$MysqlUser = "root",
    [string]$MysqlPassword = "",
    [int]$Port = 8080,
    [switch]$RequireDatabase
)

$ErrorActionPreference = "Stop"

$projectDir = Join-Path $PSScriptRoot "java\ECommerceProject"
$connectorPath = if ([System.IO.Path]::IsPathRooted($ConnectorJar)) { $ConnectorJar } else { Join-Path $PSScriptRoot $ConnectorJar }

Push-Location $projectDir
try {
    Write-Host "Compiling Java sources..."
    & javac *.java

    if ($MysqlUser)     { $env:MYSQL_USER = $MysqlUser }
    if ($MysqlPassword) { $env:MYSQL_PASSWORD = $MysqlPassword }
    if (-not $env:MYSQL_URL) { $env:MYSQL_URL = "jdbc:mysql://localhost:3306/bellevouix_store" }
    $env:PORT = "$Port"
    if ($RequireDatabase) { $env:REQUIRE_DATABASE = "true" }

    $classpath = ".;$connectorPath"
    Write-Host "Starting Bellevouix API on http://localhost:$Port (classpath: $classpath)"
    & java -cp $classpath ApiServer
}
finally {
    Pop-Location
}
