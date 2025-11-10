FROM --platform=linux/amd64 nginx:alpine

COPY dist /usr/share/nginx/html

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]