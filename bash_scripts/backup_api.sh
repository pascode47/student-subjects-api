#!/bin/bash

# Configuration
API_DIR="/home/ubuntu/apps/student-subjects-api"
BACKUP_DIR="/home/ubuntu/backups"
DB_NAME="student-subjects-api"
LOG_FILE="/var/log/backup.log"
RETENTION_DAYS=7
DATE_FORMAT=$(date +%F) # YYYY-MM-DD

# Function to log messages with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# --- Start Backup ---
log_message "Starting backup process..."

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"
if [ ! -d "$BACKUP_DIR" ]; then
    log_message "ERROR: Failed to create backup directory: $BACKUP_DIR"
    exit 1
fi

# 1. Backup API Project Directory
API_BACKUP_FILE="$BACKUP_DIR/api_backup_${DATE_FORMAT}.tar.gz"
log_message "Backing up API directory '$API_DIR' to '$API_BACKUP_FILE'..."
tar -czf "$API_BACKUP_FILE" -C "$(dirname "$API_DIR")" "$(basename "$API_DIR")"
if [ $? -eq 0 ]; then
    log_message "API directory backup successful."
else
    log_message "ERROR: API directory backup failed."
    # Optionally exit here if API backup failure is critical
    # exit 1
fi

# 2. Backup MongoDB Database
DB_BACKUP_DIR="$BACKUP_DIR/db_backup_${DATE_FORMAT}" # mongodump creates a directory
log_message "Backing up MongoDB database '$DB_NAME' to '$DB_BACKUP_DIR'..."
# mongodump will create a directory named 'dump' inside the specified --out path
# We specify the parent directory for the dump
mongodump --db "$DB_NAME" --out "$DB_BACKUP_DIR"
if [ $? -eq 0 ]; then
    log_message "MongoDB database backup successful."
    # Optional: Compress the database backup directory
    DB_BACKUP_ARCHIVE="${DB_BACKUP_DIR}.tar.gz"
    log_message "Compressing database backup to '$DB_BACKUP_ARCHIVE'..."
    tar -czf "$DB_BACKUP_ARCHIVE" -C "$BACKUP_DIR" "$(basename "$DB_BACKUP_DIR")"
    if [ $? -eq 0 ]; then
        log_message "Database backup compression successful."
        # Remove the original directory after successful compression
        rm -rf "$DB_BACKUP_DIR"
        log_message "Removed original database backup directory '$DB_BACKUP_DIR'."
    else
        log_message "ERROR: Failed to compress database backup directory '$DB_BACKUP_DIR'."
    fi
else
    log_message "ERROR: MongoDB database backup failed."
    # Optionally exit here if DB backup failure is critical
    # exit 1
fi


# 3. Delete Old Backups
log_message "Deleting backups older than $RETENTION_DAYS days..."
# Delete old API backups (.tar.gz files)
find "$BACKUP_DIR" -maxdepth 1 -name "api_backup_*.tar.gz" -type f -mtime +"$RETENTION_DAYS" -print -delete >> "$LOG_FILE" 2>&1
# Delete old DB backups (.tar.gz files)
find "$BACKUP_DIR" -maxdepth 1 -name "db_backup_*.tar.gz" -type f -mtime +"$RETENTION_DAYS" -print -delete >> "$LOG_FILE" 2>&1
log_message "Old backup cleanup finished."


log_message "Backup process finished."
echo "----------------------------------------" >> "$LOG_FILE"

exit 0
