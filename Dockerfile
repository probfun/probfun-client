FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY package.json pnpm-lock.yaml ./

# 安装pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

COPY . .

# 构建项目
RUN pnpm run build

# 使用nginx来服务构建后的静态文件
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# 暴露nginx服务端口
EXPOSE 80

# 启动nginx服务
CMD ["nginx", "-g", "daemon off;"]
