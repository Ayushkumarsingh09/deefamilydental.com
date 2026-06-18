$ErrorActionPreference = "Stop"
$port = 4173
$root = $PSScriptRoot

# Stop anything already using this port
Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object {
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
  }

Start-Sleep -Milliseconds 500

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "python"
$psi.Arguments = "-m http.server $port --bind 127.0.0.1"
$psi.WorkingDirectory = $root
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
$psi.CreateNoWindow = $true
$null = [System.Diagnostics.Process]::Start($psi)

Start-Sleep -Seconds 1

$url = "http://127.0.0.1:$port/"
Write-Host "Dee Family Dental running at $url"
Start-Process $url
