ARG SENTRY_AUTH_TOKEN
FROM node:18-slim as builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV NODE_OPTIONS=--max-old-space-size=16384

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM joseluisq/static-web-server:2
COPY --from=builder /app/dist /public
ENV SERVER_ROOT=/public
ENV SERVER_PORT=8000
ENV SERVER_HEALTH=true
ENV SERVER_FALLBACK_PAGE=/public/index.html
EXPOSE 8000
