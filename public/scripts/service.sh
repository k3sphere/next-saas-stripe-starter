#!/bin/bash

# Check if the required environment variables are set
if [ -z "$KEY" ] || [ -z "$SWARM_KEY" ]; then
    echo "Error: Missing environment variables."
    echo "Usage: KEY=<your_key> SWARM_KEY=<your_swarm_key> curl -sfL https://k3sphere.com/scripts/service.sh | sh -"
    exit 1
fi

# Define service file path
SERVICE_FILE="/etc/systemd/system/reverse-proxy.service"

# Create systemd service file
cat <<EOF | sudo tee $SERVICE_FILE
[Unit]
Description=Reverse Proxy Service
After=network.target

[Service]
ExecStart=/root/reverse-proxy --key=$KEY --swarmKey=$SWARM_KEY
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
