# 第一阶段：构建应用
FROM node:16 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制其余文件
COPY . .

# 构建 Vue 应用
RUN pnpm run build

# 第二阶段：创建 Nginx 镜像
FROM nginx:latest

# 将构建的文件复制到 Nginx 的 html 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 将 Nginx 配置文件复制到镜像中（如果有自定义配置）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
