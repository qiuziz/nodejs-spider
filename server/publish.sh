#!/bin/sh

#开始构建
docker build -t registry.cn-shanghai.aliyuncs.com/qiuz/photo-node:laster .

docker login --username=zhu_anly@163.com --password="ydc&UzZgs3orYD;X" registry.cn-shanghai.aliyuncs.com

docker push registry.cn-shanghai.aliyuncs.com/qiuz/photo-node:laster
