FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS dependencies

COPY bun.lockb package.json ./

RUN bun install

FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json bun.lockb tsconfig.json nest-cli.json ./
COPY . .

RUN bun run build && \
    bun add -d tsc-alias && \
    bunx tsc-alias

FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./
COPY --from=dependencies /app/node_modules ./node_modules

RUN npm rebuild bcrypt --build-from-source || npm install bcrypt --build-from-source

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/i18n ./src/i18n

EXPOSE 3000

CMD ["node", "dist/main"]
