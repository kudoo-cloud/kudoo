server {
  listen 80;
  listen [::]:80;

  server_name beta.kudoo.org;

  location / {
      proxy_pass http://localhost:3000/;
  }
}