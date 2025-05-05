#!/bin/bash

# Configuration
API_DIR="/home/ubuntu/apps/student-subjects-api"
LOG_FILE="/var/log/update.log"
WEB_SERVER_SERVICE="nginx" # As identified from deploy.sh

# Function to log messages with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# --- Start Update ---
log_message "Starting server update process..."

# 1. Update Ubuntu Packages
log_message "Updating package list..."
sudo apt-get update >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    log_message "ERROR: Failed to update package list (apt-get update)."
    # Decide if you want to exit or continue despite this error
    # exit 1
fi

log_message "Upgrading installed packages..."
# Use DEBIAN_FRONTEND=noninteractive to avoid prompts during upgrade
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    log_message "WARNING: Failed to upgrade packages (apt-get upgrade -y). Check logs for details."
    # Decide if you want to exit or continue despite this error
fi

# 2. Update API Code from Git Repository
log_message "Navigating to API directory: $API_DIR"
cd "$API_DIR"
if [ $? -ne 0 ]; then
    log_message "ERROR: Failed to navigate to API directory: $API_DIR"
    exit 1
fi

log_message "Pulling latest changes from Git repository..."
# Store git pull output and status
GIT_PULL_OUTPUT=$(git pull 2>&1)
GIT_PULL_STATUS=$?

log_message "Git pull output:"
echo "$GIT_PULL_OUTPUT" >> "$LOG_FILE"

if [ $GIT_PULL_STATUS -ne 0 ]; then
    log_message "ERROR: Git pull failed. Aborting server restart."
    exit 1
fi

log_message "Git pull successful."

# 3. Restart Web Server (only if git pull was successful)
log_message "Restarting web server ($WEB_SERVER_SERVICE)..."
sudo systemctl restart "$WEB_SERVER_SERVICE" >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    log_message "Web server ($WEB_SERVER_SERVICE) restarted successfully."
else
    log_message "ERROR: Failed to restart web server ($WEB_SERVER_SERVICE)."
    exit 1 # Exit if server restart fails, as API might be down
fi

log_message "Server update process finished."
echo "----------------------------------------" >> "$LOG_FILE"

exit 0
