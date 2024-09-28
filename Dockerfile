# 使用 Node.js 镜像
FROM node:18 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建 Vue 项目
RUN pnpm run build

# 使用 Nginx 提供静态文件
FROM nginx:alpine

# 复制构建的文件
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
