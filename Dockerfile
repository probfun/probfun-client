# 使用 Node.js 构建 Vue 应用
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

# 使用 Nginx 提供服务
FROM nginx:latest
COPY --from=build /usr/src/app/dist /usr/share/nginx/html