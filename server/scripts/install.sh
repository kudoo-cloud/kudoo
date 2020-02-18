#!/bin/bash
echo Installing new packages
sudo apt update
sudo apt install nginx
echo Copying new nginx conf

echo Is nginx conf valid
sudo nginx -t
sudo systemctl reload nginx
echo Install certbot
sudo add-apt-repository ppa:certbot/certbot
sudo apt install python-certbot-nginx
sudo certbot --nginx