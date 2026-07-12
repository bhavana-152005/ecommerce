param(
    [string]$ConnectorJar,
    [string]$MysqlUrl = "jdbc:mysql://localhost:3306/bellevouix_store",
    [string]$MysqlUser = "root",
    [string]$MysqlPassword = "",
    [int]$Port = 8080,
    [switch]$RequireDatabase,
    [string]$OpenAiApiKey,
    [string]$GeminiApiKey,
    [string]$LlmProvider = "openai",
    [string]$JavaHome
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$javaDir = Join-Path $projectRoot "java\ECommerceProject"

function Resolve-JavaTools {
    param([string]$PreferredJavaHome)

    $javaExe = $null
    $javacExe = $null

    $javaHomeCandidates = @()
    if ($PreferredJavaHome) { $javaHomeCandidates += $PreferredJavaHome }
    if ($env:JAVA_HOME) { $javaHomeCandidates += $env:JAVA_HOME }
    if ($JavaHome) { $javaHomeCandidates += $JavaHome }

    foreach ($home in $javaHomeCandidates | Select-Object -Unique) {
        if (-not $home) { continue }
        $candidateJava = Join-Path $home "bin\java.exe"
        $candidateJavac = Join-Path $home "bin\javac.exe"
        if (-not $javaExe -and (Test-Path $candidateJava)) { $javaExe = $candidateJava }
        if (-not $javacExe -and (Test-Path $candidateJavac)) { $javacExe = $candidateJavac }
    }

    if (-not $javaExe) {
        $javaCommand = Get-Command java.exe -ErrorAction SilentlyContinue
        if ($javaCommand) { $javaExe = $javaCommand.Source }
    }

    if (-not $javacExe) {
        $javacCommand = Get-Command javac.exe -ErrorAction SilentlyContinue
        if ($javacCommand) { $javacExe = $javacCommand.Source }
    }

    if (-not $javaExe) {
        $commonRoots = @(
            "$HOME\.jdks",
            "C:\Program Files\Java",
            "C:\Program Files\OpenJDK",
            "C:\Program Files\Eclipse Adoptium",
            "C:\Program Files\Microsoft",
            "C:\Program Files\Amazon Corretto",
            "$env:LOCALAPPDATA\Programs\Eclipse Adoptium",
            "$env:LOCALAPPDATA\Programs\Microsoft",
            "$env:LOCALAPPDATA\Programs\OpenJDK"
        )

        foreach ($root in $commonRoots | Select-Object -Unique) {
            if (-not $root -or -not (Test-Path $root)) { continue }

            foreach ($folder in Get-ChildItem $root -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending) {
                $candidateJava = Join-Path $folder.FullName "bin\java.exe"
                $candidateJavac = Join-Path $folder.FullName "bin\javac.exe"
                if (-not $javaExe -and (Test-Path $candidateJava)) { $javaExe = $candidateJava }
                if (-not $javacExe -and (Test-Path $candidateJavac)) { $javacExe = $candidateJavac }
                if ($javaExe) { break }
            }

            if ($javaExe) { break }
        }
    }

    return @{ Java = $javaExe; Javac = $javacExe }
}

if (-not $ConnectorJar) {
    $candidates = @(
        (Join-Path $projectRoot "lib\mysql-connector-j.jar"),
        (Join-Path $projectRoot "mysql-connector-j.jar")
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            $ConnectorJar = $candidate
            break
        }
    }
}

if (-not $ConnectorJar) {
    $ConnectorJar = $null
}

if ($ConnectorJar -and -not (Test-Path $ConnectorJar)) {
    throw "The provided MySQL Connector/J jar was not found: $ConnectorJar"
}

if (-not $ConnectorJar) {
    Write-Warning "No MySQL Connector/J jar was supplied. The Java API will run in memory-fallback mode until you provide one with -ConnectorJar or install MySQL support."
}

$env:MYSQL_URL = $MysqlUrl
$env:MYSQL_USER = $MysqlUser
$env:MYSQL_PASSWORD = $MysqlPassword
$env:MYSQL_REQUIRED = if ($RequireDatabase) { "true" } else { "false" }
$env:API_PORT = "$Port"
$env:SEIRRAA_LLM_PROVIDER = $LlmProvider

if ($OpenAiApiKey) {
    $env:OPENAI_API_KEY = $OpenAiApiKey
}

if ($GeminiApiKey) {
    $env:GEMINI_API_KEY = $GeminiApiKey
}

if (-not $MysqlUser -or $MysqlUser -eq 'root') {
    $env:MYSQL_ROOT_PASSWORD = $MysqlPassword
}

Push-Location $javaDir
try {
    $javaTools = Resolve-JavaTools
    $javac = $javaTools.Javac
    $java = $javaTools.Java

    if (-not $java -or -not (Test-Path $java)) {
        throw "A Java runtime was not found on this machine. Install Temurin/OpenJDK 21 or pass -JavaHome <path> and rerun the script."
    }

    $classpath = "."
    if ($ConnectorJar) {
        $classpath = ".;$ConnectorJar"
    }

    if ($javac -and (Test-Path $javac)) {
        & $javac *.java
    }
    else {
        Write-Warning "javac was not found, so the script will try to run existing classes. If the server has not been compiled yet, install a full JDK first."
    }

    & $java -cp $classpath ApiServer
}

finally {
    Pop-Location
}
