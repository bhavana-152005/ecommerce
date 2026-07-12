param(
  [string]$OpenAiApiKey,
  [string]$GeminiApiKey,
  [string]$LlmProvider = "openai",
  [string]$JavaHome
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$arguments = @(
  "-ExecutionPolicy", "Bypass",
  "-File", (Join-Path $scriptRoot "run_api.ps1"),
  "-LlmProvider", $LlmProvider
)

if ($OpenAiApiKey) { $arguments += @("-OpenAiApiKey", $OpenAiApiKey) }
if ($GeminiApiKey) { $arguments += @("-GeminiApiKey", $GeminiApiKey) }
if ($JavaHome) { $arguments += @("-JavaHome", $JavaHome) }

Start-Process -FilePath "powershell" -ArgumentList $arguments -WorkingDirectory $scriptRoot
