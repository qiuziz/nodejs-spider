FROM node:10-alpine as builder

MAINTAINER https://github.com/qiuziz



RUN echo "https://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories && \
    yarn config set registry https://registry.npm.taobao.org && \
    mkdir -p /app && \
    yarn cache clean && \
    rm -rf /var/cache/apk/*


WORKDIR /app

COPY . .

RUN yarn && \
    yarn build

FROM nginx:stable-alpine
COPY --from=builder /app/dist/nodejs-spider-ng /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
