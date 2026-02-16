FROM node:22.13.1 AS build
WORKDIR /usr/src/app
COPY --chmod=765 package.json ./
# COPY --chmod=765 yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
## build
FROM nginx:1.25.2-bookworm-perl
WORKDIR /etc/nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/sakai-ng/browser /usr/share/nginx/html/

RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /etc/nginx/ && \
    chmod -R 755 /etc/nginx/ && \
    chown -R nginx:nginx /var/log/nginx

RUN mkdir -p /etc/nginx/ssl/ && \
    chown -R nginx:nginx /etc/nginx/ssl/ && \
    chmod -R 755 /etc/nginx/ssl/
RUN touch /run/nginx.pid &&  chown -R nginx:nginx /run/nginx.pid

USER nginx

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 3000
