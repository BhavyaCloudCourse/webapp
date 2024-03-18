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
sudo npm install
sudo ls /opt/csye6225/
sudo touch /var/log/webapp.log
sudo chown csye6225:csye6225 /var/log/webapp.log
sudo chmod 660 /var/log/webapp.log
sudo ls /var/log/
sudo echo "The current username is: $USER"
sudo cat << EOF | sudo tee /etc/systemd/system/csye6225.service
[Unit]
Description=CSYE 6225 App
ConditionPathExists=/opt/csye6225/.env
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

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo cat << EOF | sudo tee /etc/google-cloud-ops-agent/config.yaml
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/webapp.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: timestamp
      time_format: "%Y-%m-%dT%H:%M:%S.%L%z"
    move_severity:
      type: modify_fields
      fields:
        severity:
          move_from: jsonPayload.level
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor, move_severity]
EOF


sudo systemctl restart google-cloud-ops-agent