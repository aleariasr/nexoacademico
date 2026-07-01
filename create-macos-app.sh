#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="NexoAcadémico"
APP_PATH="$PROJECT_ROOT/$APP_NAME.app"

CONTENTS="$APP_PATH/Contents"
MACOS="$CONTENTS/MacOS"
RESOURCES="$CONTENTS/Resources"

ICON_SOURCE="$PROJECT_ROOT/app-icon.png"
ICONSET="$PROJECT_ROOT/AppIcon.iconset"
ICON_FILE="$RESOURCES/AppIcon.icns"

echo "Creando $APP_NAME.app..."

if [[ ! -f "$PROJECT_ROOT/start-dev.sh" ]]; then
  echo "Error: no existe start-dev.sh en la raíz del proyecto."
  exit 1
fi

if [[ ! -f "$ICON_SOURCE" ]]; then
  echo "Error: no existe app-icon.png en la raíz del proyecto."
  exit 1
fi

rm -rf "$APP_PATH"
rm -rf "$ICONSET"

mkdir -p "$MACOS"
mkdir -p "$RESOURCES"
mkdir -p "$ICONSET"

# ============================================================
# Crear iconset de macOS
# ============================================================

sips -z 16 16 "$ICON_SOURCE" \
  --out "$ICONSET/icon_16x16.png" >/dev/null

sips -z 32 32 "$ICON_SOURCE" \
  --out "$ICONSET/icon_16x16@2x.png" >/dev/null

sips -z 32 32 "$ICON_SOURCE" \
  --out "$ICONSET/icon_32x32.png" >/dev/null

sips -z 64 64 "$ICON_SOURCE" \
  --out "$ICONSET/icon_32x32@2x.png" >/dev/null

sips -z 128 128 "$ICON_SOURCE" \
  --out "$ICONSET/icon_128x128.png" >/dev/null

sips -z 256 256 "$ICON_SOURCE" \
  --out "$ICONSET/icon_128x128@2x.png" >/dev/null

sips -z 256 256 "$ICON_SOURCE" \
  --out "$ICONSET/icon_256x256.png" >/dev/null

sips -z 512 512 "$ICON_SOURCE" \
  --out "$ICONSET/icon_256x256@2x.png" >/dev/null

sips -z 512 512 "$ICON_SOURCE" \
  --out "$ICONSET/icon_512x512.png" >/dev/null

cp "$ICON_SOURCE" "$ICONSET/icon_512x512@2x.png"

iconutil -c icns "$ICONSET" -o "$ICON_FILE"

rm -rf "$ICONSET"

# ============================================================
# Info.plist
# ============================================================

cat > "$CONTENTS/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC
  "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">

<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>NexoAcadémico</string>

    <key>CFBundleDisplayName</key>
    <string>NexoAcadémico</string>

    <key>CFBundleExecutable</key>
    <string>NexoAcademico</string>

    <key>CFBundleIdentifier</key>
    <string>com.aleariasr.nexoacademico</string>

    <key>CFBundleVersion</key>
    <string>1.0.0</string>

    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>

    <key>CFBundlePackageType</key>
    <string>APPL</string>

    <key>CFBundleIconFile</key>
    <string>AppIcon</string>

    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>

    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
PLIST

# ============================================================
# Ejecutable principal
# ============================================================

cat > "$MACOS/NexoAcademico" <<'SCRIPT'
#!/usr/bin/env bash

set -Eeuo pipefail

# El ejecutable está en:
# NexoAcadémico.app/Contents/MacOS/NexoAcademico
#
# Se suben tres niveles para regresar a la raíz del repositorio.
PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
START_SCRIPT="$PROJECT_ROOT/start-dev.sh"

if [[ ! -f "$START_SCRIPT" ]]; then
  osascript -e '
    display alert "No se encontró start-dev.sh" message "La aplicación debe permanecer dentro de la raíz del proyecto NexoAcadémico." as critical
  '
  exit 1
fi

chmod +x "$START_SCRIPT"

ESCAPED_PROJECT_ROOT=$(printf '%q' "$PROJECT_ROOT")

osascript <<EOF
tell application "Terminal"
    activate
    do script "cd $ESCAPED_PROJECT_ROOT && ./start-dev.sh"
end tell
EOF
SCRIPT

chmod +x "$MACOS/NexoAcademico"

# Eliminar cuarentena local si existe
xattr -dr com.apple.quarantine "$APP_PATH" 2>/dev/null || true

echo
echo "Aplicación creada correctamente:"
echo "$APP_PATH"
echo
echo "Ahora puedes abrir NexoAcadémico.app con doble clic."