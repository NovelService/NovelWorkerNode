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
curl -L https://github.com/adnanh/webhook/releases/latest/download/webhook-linux-amd64.tar.gz -o /usr/local/bin/webhook-linux-amd64.tar.gz
tar -xzf /usr/local/bin/webhook-linux-amd64.tar.gz
mv /usr/local/bin/webhook-linux-amd64/webhook /usr/local/bin
rm /usr/local/bin/webhook-linux-amd64.tar.gz
rm -d /usr/local/bin/webhook-linux-amd64

# application
mkdir ~/app
git clone https://github.com/NovelService/NovelWorkerNode.git ~/app

## todo set env variables

docker-compose up -d ~/app/deployment/docker-compose.yml