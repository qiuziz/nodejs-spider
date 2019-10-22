# Version 0.1

# 基础镜像
FROM node:11-alpine

RUN echo "https://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories

# 维护者信息
MAINTAINER https://github.com/qiuziz

RUN apk add -U --no-cache --allow-untrusted python make g++ && \
    mkdir -p /app /logs && \
    yarn config set registry https://registry.npm.taobao.org && \
    yarn global add pm2 && \
    yarn cache clean && \
    rm -rf /var/cache/apk/*

COPY package*.json /app
COPY yarn.lock /app

WORKDIR /app

RUN yarn install

COPY . /app

EXPOSE 8000
CMD [ "pm2-runtime", "start", "pm2.config.js" ]
