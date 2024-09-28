# 使用 Node 作为构建环境
FROM node:18 AS build
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . ./
RUN pnpm run build

# 只保留构建后的内容
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
