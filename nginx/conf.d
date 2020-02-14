server {
  listen 80;
  listen [::]:80;

  server_name git.kudoo.io;
  add_header Access-Control-Allow-Origin *;
  proxy_hide_header X-Frame-Options;
  client_header_timeout 120s;         
  client_body_timeout 120s;           
  client_max_body_size 200m;   

  location / {
      proxy_pass http://localhost:3000/;
  }
}

server {
  listen 80;
  listen [::]:80;

  server_name msg.kudoo.io;

  location / {
      proxy_pass http://localhost:4222/;
  }
}

server {
  listen 80;
  listen [::]:80;

  server_name msgadmin.kudoo.io;

  location / {
      proxy_pass http://localhost:8222/;
  }
}
