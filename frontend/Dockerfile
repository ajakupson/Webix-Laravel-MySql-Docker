FROM nginx:alpine

# deletion of default config
RUN rm /etc/nginx/conf.d/default.conf

# simple nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# hot reload
WORKDIR /usr/share/nginx/html
COPY app /usr/share/nginx/html

EXPOSE 80
