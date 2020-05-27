# #!/bin/sh

# #开始构建
# yarn build

# #删除远端本身的文件
# ssh root@106.54.223.176 "rm -rf /www/nodejs-spider/dist"

# #把本地编译的文件放上去远端
# scp -r ./dist root@106.54.223.176:/www/nodejs-spider


#!/bin/sh

#开始构建
docker build -t registry.cn-shanghai.aliyuncs.com/qiuz/photo-node:laster ./server

docker build -t registry.cn-shanghai.aliyuncs.com/qiuz/photo-web:laster .

docker login --username=zhu_anly@163.com --password="ydc&UzZgs3orYD;X" registry.cn-shanghai.aliyuncs.com

docker push registry.cn-shanghai.aliyuncs.com/qiuz/photo-node:laster
docker push registry.cn-shanghai.aliyuncs.com/qiuz/photo-web:laster
