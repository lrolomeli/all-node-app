#!/bin/bash
set -e

BACKUP_DIR="backend/data_backup_$(date +%Y%m%d_%H%M%S)"

echo "==> Backing up backend/data..."
if [ -d "backend/data" ]; then
  cp -r backend/data "$BACKUP_DIR"
  echo "    Saved to $BACKUP_DIR"
else
  echo "    backend/data not found, skipping backup"
fi

echo "==> Pulling latest changes..."
git pull

echo "==> Restoring any data files removed by git..."
if [ -d "$BACKUP_DIR" ]; then
  mkdir -p backend/data
  restored=0
  for f in "$BACKUP_DIR"/*; do
    fname=$(basename "$f")
    if [ ! -f "backend/data/$fname" ]; then
      cp "$f" "backend/data/$fname"
      echo "    Restored: $fname"
      restored=$((restored + 1))
    fi
  done
  if [ "$restored" -eq 0 ]; then
    echo "    All data files intact, nothing to restore"
  fi
fi

echo "==> Building and starting containers..."
docker compose up -d --build

echo ""
echo "Deploy complete."
echo "Backup saved at: $BACKUP_DIR"
echo "To restore manually: cp -r $BACKUP_DIR/* backend/data/"
