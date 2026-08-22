Add-Type -AssemblyName System.Drawing
$src = "C:\Users\Nick_\.gemini\antigravity-ide\brain\vtuber-subtitle-app\public\app-icon.png"
$dest = "C:\Users\Nick_\.gemini\antigravity-ide\brain\vtuber-subtitle-app\src-native\app.ico"
$b = [System.Drawing.Bitmap]::FromFile($src)
$t = New-Object System.Drawing.Bitmap $b, 256, 256
$h = $t.GetHicon()
$ico = [System.Drawing.Icon]::FromHandle($h)
$s = [System.IO.File]::OpenWrite($dest)
$ico.Save($s)
$s.Close()
$b.Dispose()
$t.Dispose()
Write-Host "ICO built successfully!"
