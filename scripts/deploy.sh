#!/bin/bash

# Update package list and install necessary packages
sudo apt-get update
sudo apt-get install -y nodejs npm

# Navigate to the project directory
cd /path/to/your/student-subjects-api

# Install project dependencies
npm install

# Start the application
npm start

# Optionally, you can add commands to set up a process manager like PM2
# npm install -g pm2
# pm2 start src/app.js --name student-subjects-api

# Print a message indicating that the deployment is complete
echo "Deployment complete. The API is now running."