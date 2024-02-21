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


#install webapp
sudo setenforce 0
sudo echo "The current username is: $USER"
ls /home/admin
cd /home/admin || exit
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225  -m csye6225
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
sudo chown -R csye6225:csye6225 /opt/csye6225/webapp/webapp
sudo chmod -R 750 /opt/csye6225/webapp/webapp
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

sudo journalctl -u csye6225.service
sudo netstat -ln | grep 3000
sudo netstat -tulpn

# sudo curl http://localhost:3000/healthz

