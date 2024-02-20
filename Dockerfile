FROM node:16.17.0-alpine

#创建/opt/app 目录作为部署目录,创建容器实例时,挂载此目录
RUN mkdir -p /opt/app
# 设置工作目录
WORKDIR /opt/app

# 将代码复制到容器中
COPY . /opt/app

RUN cd /opt/app
# 添加权限，防止依赖无法安装
RUN chmod -R 777 *
# 添加执行shell文件权限
RUN chmod u+x pm2.sh
RUN yarn --registry=https://registry.npmmirror.com
RUN npm i pm2 -g --registry=https://registry.npmmirror.com
RUN npm run build

RUN ls -l -a

# 容器对外暴露的端口号，要和node项目配置的端口号一致
EXPOSE 3000
# 修复容器外无法访问问题
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 通过shell文件来执行多条命令
CMD ["./pm2.sh"]
