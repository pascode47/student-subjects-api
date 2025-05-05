#!/bin/bash

# Log file location
LOG_FILE="/var/log/server_health.log"
# API Endpoints
API_STUDENTS_URL="http://localhost/students" # Assuming API runs locally on the server
API_SUBJECTS_URL="http://localhost/subjects" # Assuming API runs locally on the server
# Web server service name (e.g., nginx, apache2)
WEB_SERVER_SERVICE="nginx"
# Disk usage threshold (percentage)
DISK_THRESHOLD=10

# Function to log messages with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# --- Start Health Check ---
log_message "Starting health check..."

# 1. Check CPU Usage
# Getting the idle percentage and calculating usage
CPU_IDLE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/")
CPU_USAGE=$(echo "100 - $CPU_IDLE" | bc)
log_message "CPU Usage: ${CPU_USAGE}%"
# Note: This CPU check is basic. For more robust checks, consider tools like mpstat or sysstat if available.

# 2. Check Memory Usage
MEM_INFO=$(free -m | grep Mem)
MEM_TOTAL=$(echo "$MEM_INFO" | awk '{print $2}')
MEM_USED=$(echo "$MEM_INFO" | awk '{print $3}')
MEM_USAGE=$(echo "scale=2; $MEM_USED / $MEM_TOTAL * 100" | bc)
log_message "Memory Usage: ${MEM_USED}MB / ${MEM_TOTAL}MB (${MEM_USAGE}%)"

# 3. Check Disk Space Usage for root filesystem '/'
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
log_message "Disk Usage (/): ${DISK_USAGE}%"
if [ "$DISK_USAGE" -gt $((100 - DISK_THRESHOLD)) ]; then
    log_message "WARNING: Disk space usage (${DISK_USAGE}%) is above threshold (${100 - DISK_THRESHOLD}%)!"
fi

# 4. Check Web Server Status
if systemctl is-active --quiet "$WEB_SERVER_SERVICE"; then
    log_message "Web Server ($WEB_SERVER_SERVICE) status: Running"
else
    log_message "WARNING: Web Server ($WEB_SERVER_SERVICE) status: Not Running!"
fi

# 5. Test API Endpoints
STUDENT_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$API_STUDENTS_URL")
SUBJECT_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$API_SUBJECTS_URL")

if [ "$STUDENT_STATUS" -eq 200 ]; then
    log_message "API Endpoint (/students) status: OK (HTTP $STUDENT_STATUS)"
else
    log_message "WARNING: API Endpoint (/students) status: FAILED (HTTP $STUDENT_STATUS)"
fi

if [ "$SUBJECT_STATUS" -eq 200 ]; then
    log_message "API Endpoint (/subjects) status: OK (HTTP $SUBJECT_STATUS)"
else
    log_message "WARNING: API Endpoint (/subjects) status: FAILED (HTTP $SUBJECT_STATUS)"
fi

log_message "Health check finished."
echo "----------------------------------------" >> "$LOG_FILE"

exit 0
