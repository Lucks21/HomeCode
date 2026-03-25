FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && npm ci

COPY tsconfig.json tsconfig.backend.json ./
COPY app ./app
COPY prisma ./prisma
COPY docker ./docker

RUN npm run db:generate
RUN npm run build:backend

RUN chmod +x /app/docker/api-entrypoint.sh

EXPOSE 3000

CMD ["/app/docker/api-entrypoint.sh"]
