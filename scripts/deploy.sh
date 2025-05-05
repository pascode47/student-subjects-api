#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Update package list
sudo apt-get update

# Remove any existing Node.js and npm to prevent conflicts
echo "Removing any existing Node.js installations..."
sudo apt-get remove -y nodejs npm
sudo apt-get autoremove -y
sudo apt-get clean

# Install curl if not already installed
sudo apt-get install -y curl nginx

node -v && npm -v


# Update again with new repositories
sudo apt-get update


# Make sure MongoDB is running
echo "Starting MongoDB service..."
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod --no-pager

# Create app directory if it doesn't exist
mkdir -p ~/apps

# Navigate to the project directory
cd ~/apps

# Clone or pull latest code
if [ -d "student-subjects-api" ]; then
  cd student-subjects-api
  echo "Pulling latest code from repository..."
  git pull
else
  echo "Cloning repository..."
  git clone https://github.com/pascode47/student-subjects-api.git
  cd student-subjects-api
fi

# Install project dependencies
echo "Installing Node.js dependencies..."
npm install

# Create or update .env file
echo "Setting up environment variables..."
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/student-subjects-api
PORT=3000
NODE_ENV=production
SECRET_KEY=production_secret_key
EOF

# Create public directory structure if it doesn't exist
mkdir -p public/css public/js

# Set permissions for bash scripts
echo "Setting permissions for bash scripts..."
chmod +x ~/apps/student-subjects-api/bash_scripts/*.sh

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 process manager..."
  sudo npm install -g pm2
fi

# Start or restart the application with PM2
echo "Starting application with PM2..."
pm2 start src/app.js --name student-subjects-api || pm2 restart student-subjects-api

# Make PM2 start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# Configure Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/student-subjects-api << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site if not already enabled
if [ ! -f "/etc/nginx/sites-enabled/student-subjects-api" ]; then
  sudo ln -s /etc/nginx/sites-available/student-subjects-api /etc/nginx/sites-enabled/
fi

# Remove default site if exists
if [ -f "/etc/nginx/sites-enabled/default" ]; then
  sudo rm /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration and restart if ok
echo "Testing and restarting Nginx..."
sudo nginx -t && sudo systemctl restart nginx

echo "Deployment complete. The API is now running at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"