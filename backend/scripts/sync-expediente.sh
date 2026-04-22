#!/bin/bash
set -e

REPO_URL="https://github.com/lrolomeli/Expediente_RobertoLM.git"
TMP_DIR=$(mktemp -d)
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/expediente"

echo "Clonando expediente..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

echo "Copiando archivos..."
cp "$TMP_DIR/historial.html" "$DEST/historial.html"
rm -rf "$DEST/data"
cp -r "$TMP_DIR/data" "$DEST/data"

rm -rf "$TMP_DIR"
echo "Sincronización completada."
