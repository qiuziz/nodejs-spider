#!/bin/sh

docker-compose down

docker rmi registry.cn-shanghai.aliyuncs.com/qiuz/photo-web:latest
docker rmi registry.cn-shanghai.aliyuncs.com/qiuz/photo-node:latest

docker-compose up -d

docker cp db.js photo-node:/app/src

docker-compose up -d
