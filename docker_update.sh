#!/bin/sh

docker-compose down

docker rmi registry.cn-shanghai.aliyuncs.com/qiuz/photo-web:laster
docker rmi registry.cn-shanghai.aliyuncs.com/qiuz/photo-node:laster

docker-compose up -d
