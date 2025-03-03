#!/bin/bash

# Check if the required arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <key> <swarmKey>"
    exit 1
fi

KEY=$1
SWARM_KEY=$2

# Define service file path
SERVICE_FILE="/etc/systemd/system/reverse-proxy.service"

# Create systemd service file
cat <<EOF | sudo tee $SERVICE_FILE
[Unit]
Description=Reverse Proxy Service
After=network.target

[Service]
ExecStart=$(pwd)/reverse-proxy --key=$KEY --swarmKey=$SWARM_KEY
Restart=always
User=$(whoami)
WorkingDirectory=$(pwd)
StandardOutput=journal
StandardError=journal
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd, enable, and start the service
sudo systemctl daemon-reload
sudo systemctl enable reverse-proxy
sudo systemctl start reverse-proxy

echo "Reverse Proxy service installed and started."
