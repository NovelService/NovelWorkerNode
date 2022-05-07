#!/bin/bash

# git
yum install -y git

# docker
amazon-linux-extras install -y docker
service docker start
usermod -a -G docker ec2-user
## autostart docker
chkconfig docker on

# docker-compose
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# webhook
curl -L https://github.com/adnanh/webhook/releases/latest/download/webhook-linux-amd64.tar.gz -o /tmp/webhook-linux-amd64.tar.gz
tar -xzf /tmp/webhook-linux-amd64.tar.gz -C /tmp
mv /tmp/webhook-linux-amd64/webhook /usr/local/bin
rm /tmp/webhook-linux-amd64.tar.gz
rm -d /tmp/webhook-linux-amd64

# application
mkdir /app
git clone https://github.com/NovelService/NovelWorkerNode.git /app
## todo register webhook as service https://davidauthier.com/blog/2017/09/07/deploy-using-github-webhooks/

cat >> /etc/systemd/system/webhook.service<< EOF
[Unit]
Description=Webhooks

[Service]
ExecStart=/usr/local/bin/webhook -hooks /app/deployment/hooks.json -hotreload

[Install]
WantedBy=multi-user.target
EOF
systemctl enable webhook.service
systemctl start webhook.service

cat >> /app/deployment/.env <<EOF
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=
REGION=
QUEUE_URL=
BUCKET=
POLL_INTERVAL=
TABLE=
EOF

echo "" > /app/deployment/WEBHOOK_SECRET_SHA_1

docker-compose -f /app/deployment/docker-compose.yml up -d  