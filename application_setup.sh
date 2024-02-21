#!/bin/bash

# Update the system
sudo dnf update -y


# Install MySQL 8
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld


#Create database
sudo mysql -u root -e "create database cloud"
sudo mysql -u root -e "CREATE USER 'clouduser'@'localhost' IDENTIFIED BY 'bhavya1234@C'"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON cloud.* TO 'clouduser'@'localhost';"
sudo mysql -u root -e "FLUSH PRIVILEGES;"
sudo mysql -u root -e "SHOW DATABASES";


# Install Node.js 20 using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify installations
echo "MySQL version:"
mysql --version
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

#install zip
sudo dnf install -y unzip


#install app
sudo setenforce 0
sudo pwd
sudo echo "The current username is: $USER"
ls /home/admin
cd /home/admin || exit

sudo unzip -o webapp.zip
cd /home/admin/webapp/webapp || exit
pwd
sudo npm install
sudo echo "The current username is: $USER"
sudo cat << EOF | sudo tee /etc/systemd/system/csye6225.service
[Unit]
Description=webapp
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/webapp/webapp/
ExecStart=/usr/bin/node /home/admin/webapp/webapp/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

ls /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable csye6225.service
sudo systemctl start csye6225.service

sudo journalctl -u csye6225.service
sudo netstat -ln | grep 3000
sudo netstat -tulpn

# sudo curl http://localhost:3000/healthz

