# Version 0.1

# 基础镜像
FROM node:11-alpine

RUN echo "https://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories

# 维护者信息
MAINTAINER https://github.com/qiuziz
# RUN apk add --update \
# 		python \
# 		git \
# 		make \
# 		g++ \
# 		&& rm -rf /var/cache/apk/* \

RUN apk add -U --no-cache --allow-untrusted tzdata ca-certificates python make g++ && \
    mkdir -p /app /logs && \
    yarn global add pm2 && \
    yarn cache clean && \
    rm -rf /var/cache/apk/*

COPY ./startup.sh ./utc2cst.sh /usr/local/bin/
RUN chmod +x usr/local/bin/startup.sh && \
    chmod +x usr/local/bin/utc2cst.sh

WORKDIR /app
VOLUME ["/app"]

EXPOSE 8000
CMD [ "startup.sh" ]
