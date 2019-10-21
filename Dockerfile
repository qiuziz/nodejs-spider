FROM node:10-alpine as builder

MAINTAINER https://github.com/qiuziz



RUN echo "https://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories && \
    yarn config set registry https://registry.npm.taobao.org && \
    yarn config set sass-binary-site https://npm.taobao.org/mirrors/node-sass && \
    mkdir -p /app && \
    yarn cache clean && \
    rm -rf /var/cache/apk/*


WORKDIR /app

COPY . .

RUN yarn && \
    node --max_old_space_size=1096 ./node_modules/@angular/cli/bin/ng build --prod

FROM nginx:stable-alpine
COPY --from=builder /app/dist/nodejs-spider-ng /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
