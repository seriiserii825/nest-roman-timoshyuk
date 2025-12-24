#!/bin/bash

# =========================
# Load .env
# =========================
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

# =========================
# Config
# =========================
BACKUPS_DIR="./backups"
CONTAINER_NAME=$(docker ps --filter "name=postgres" --format "{{.Names}}" | head -n 1)
DB_USER="${DB_USERNAME}"
DB_NAME="${DB_NAME}"

# =========================
# Select backup file
# =========================
if [ -z "$1" ]; then
    if ! command -v fzf >/dev/null 2>&1; then
        echo "Usage: ./restore.sh <backup_file>"
        echo ""
        echo "Available backups:"
        ls -lt "$BACKUPS_DIR"/backup_*.sql* | head -n 10
        exit 1
    fi

    BACKUP_FILE=$(ls -1t "$BACKUPS_DIR"/backup_*.sql* 2>/dev/null | \
        fzf --prompt="Select backup to restore > " \
            --height=40% \
            --reverse)

    if [ -z "$BACKUP_FILE" ]; then
        echo "Restore cancelled (no file selected)."
        exit 0
    fi
else
    BACKUP_FILE="$1"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# =========================
# Confirmation
# =========================
echo ""
echo "Database:   $DB_NAME"
echo "Container:  $CONTAINER_NAME"
echo "Backup:     $BACKUP_FILE"
echo ""
echo "⚠️  WARNING: This will DROP and recreate the database!"
echo "All current data will be lost!"
read -p "Continue? (yes/no): " -r
echo

if [[ "$REPLY" != "yes" ]]; then
    echo "Restore cancelled."
    exit 0
fi

# =========================
# Restore process
# =========================
echo "Starting restore process..."

echo "Disconnecting active connections..."
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c \
    "SELECT pg_terminate_backend(pid)
     FROM pg_stat_activity
     WHERE datname = '$DB_NAME'
       AND pid <> pg_backend_pid();"

echo "Dropping database..."
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres \
    -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "Creating database..."
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres \
    -c "CREATE DATABASE $DB_NAME;"

echo "Restoring data..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip < "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"
else
    docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ Restore completed successfully!"
else
    echo "❌ Restore failed!"
    exit 1
fi
