Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\vyshw\.gemini\antigravity\scratch\vyshwas-s-playground\assets\logo.jpg"
$outPath = "C:\Users\vyshw\.gemini\antigravity\scratch\vyshwas-s-playground\assets\logo.png"
$img = [System.Drawing.Image]::FromFile($imagePath)
$bmp = New-Object System.Drawing.Bitmap($img)
$bmp.MakeTransparent([System.Drawing.Color]::White)
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$bmp.Dispose()
