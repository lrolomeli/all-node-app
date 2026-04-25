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

echo "==> Building and starting containers..."
docker compose up -d --build

echo ""
echo "Deploy complete."
if [ -d "$BACKUP_DIR" ]; then
  echo "Backup saved at: $BACKUP_DIR"
  echo "To restore: cp -r $BACKUP_DIR/* backend/data/"
fi
