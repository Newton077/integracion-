FROM oven/bun:1 AS base

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
