#!/bin/bash
# Node
echo Installing Node
sudo apt update
sudo apt -y install nodejs npm
echo Installing Node Version Manager
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

# nginx
echo Installing Nginx and Certbot
sudo apt update
sudo apt -y install nginx
sudo apt-get -y install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get -y install python-certbot-nginx
sudo cp conf.d /etc/nginx/conf.d/skelm.conf
sudo nginx -t
sudo nginx -s reload
sudo certbot --nginx

# Docker 
sudo apt -y install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt -y install docker-ce

# Docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# install Postgres tools
sudo apt install postgresql-client-common
sudo apt install postgresql-client