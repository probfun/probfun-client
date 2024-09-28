# 第一阶段：构建前端应用
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install
# 安装 pnpm 并依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

# 暴露nginx服务端口
EXPOSE 80

# 启动nginx服务
CMD ["nginx", "-g", "daemon off;"]