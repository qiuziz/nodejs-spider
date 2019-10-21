# FROM node:10-alpine as builder

# MAINTAINER https://github.com/qiuziz

# WORKDIR /app

# COPY . .

# RUN echo "https://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories && \
#     yarn config set registry https://registry.npm.taobao.org && \
#     mkdir -p /app && \
#     yarn cache clean && \
#     rm -rf /var/cache/apk/*

# RUN yarn && \
#     yarn build

FROM nginx:stable-alpine
COPY ./dist/nodejs-spider-ng /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
