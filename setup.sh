#!/bin/bash

# Update the system
sudo dnf update -y


# Install Node.js 20 using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify installations
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

#install zip
sudo dnf install -y unzip


#install webapp
sudo setenforce 0
sudo echo "The current username is: $USER"
ls /home/admin
cd /home/admin || exit
sudo groupadd csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225  -m csye6225
sudo mv /home/admin/webapp.zip /opt/csye6225/webapp.zip
cd /opt/csye6225 || exit
sudo unzip -o webapp.zip
cd /opt/csye6225/ || exit
sudo npm cache clean --force
sudo npm install
sudo -rf node_modules
sudo rm package-lock.json
sudo npm install
sudo echo "The current username is: $USER"
sudo chmod -R 700 /var/lib/mysql
sudo cat << EOF | sudo tee /etc/systemd/system/csye6225.service
[Unit]
Description=CSYE 6225 App
After=network.target

[Service]
Type=simple
User=csye6225
Group=csye6225
WorkingDirectory=/opt/csye6225
ExecStart=/usr/bin/node /opt/csye6225/server.js
Restart=always
RestartSec=3
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=csye6225

[Install]
WantedBy=multi-user.target
EOF


ls /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable csye6225.service
sudo systemctl start csye6225.service



