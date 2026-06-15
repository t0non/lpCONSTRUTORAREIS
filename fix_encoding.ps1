# Script para corrigir encoding dos arquivos - salvar como UTF-8 sem BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$baseDir = "c:\Users\Juliana Lima\Desktop\CONSTRUTORA REIS"

$files = @(
    "index.html",
    "style.css",
    "script.js"
)

# Mapa completo de substituicoes mojibake -> UTF-8 correto
$replacements = [ordered]@{
    # Sequencias de 3 caracteres primeiro (mais especificas)
    "â€™"  = "'"
    "â€œ"  = '"'
    "â€"   = '"'
    "â€""  = "–"
    "â€""  = "—"
    "â„¢"  = "™"
    # Maiusculas acentuadas
    "Ã‡"   = "Ç"
    "Ã‰"   = "É"
    "Ã‹"   = "Ë"
    "Ã'"   = "Ñ"
    "Ã""   = "Ó"
    "Ã–"   = "Ö"
    "Ã""   = "Ô"
    "Ãš"   = "Ú"
    "Ãœ"   = "Ü"
    "Ã€"   = "À"
    "Ã"    = "Á"
    "Ã‚"   = "Â"
    "Ãƒ"   = "Ã"
    "Ã„"   = "Ä"
    "Ã…"   = "Å"
    "Ã†"   = "Æ"
    # Minusculas acentuadas
    "Ã£"   = "ã"
    "Ã§"   = "ç"
    "Ã©"   = "é"
    "Ã­"   = "í"
    "Ãµ"   = "õ"
    "Ã³"   = "ó"
    "Ã¢"   = "â"
    "Ãª"   = "ê"
    "Ã´"   = "ô"
    "Ã¡"   = "á"
    "Ã¨"   = "è"
    "Ãº"   = "ú"
    "Ã¼"   = "ü"
    "Ã±"   = "ñ"
    "Ãæ"   = "æ"
    # Caracteres especiais
    "Â°"   = "°"
    "Â®"   = "®"
    "Â©"   = "©"
    "Â·"   = "·"
    "Â½"   = "½"
    "Â¼"   = "¼"
    "Â¾"   = "¾"
    "Â²"   = "²"
    "Â³"   = "³"
    "â€¦"  = "…"
    "Ã "   = "à"
}

foreach ($file in $files) {
    $path = Join-Path $baseDir $file
    if (!(Test-Path $path)) { Write-Host "SKIP (nao encontrado): $file"; continue }

    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $original = $content

    foreach ($key in $replacements.Keys) {
        $content = $content.Replace($key, $replacements[$key])
    }

    # Contar substituicoes
    $changes = 0
    foreach ($key in $replacements.Keys) {
        $changes += ([regex]::Matches($original, [regex]::Escape($key))).Count
    }

    # Salvar como UTF-8 SEM BOM
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    Write-Host "OK: $file ($changes substituicoes aplicadas)"
}

Write-Host "`nConcluido! Todos os arquivos foram salvos em UTF-8 sem BOM."
