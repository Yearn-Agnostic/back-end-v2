# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

FROM node:14-alpine as runner
LABEL Name='yagnostic-api' Version=1.0

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/swagger.json ./swagger.json
COPY --from=builder /app/utils/ ./utils/
COPY --from=builder /app/database/ ./database/

EXPOSE 3030

CMD NODE_ENV=production ./node_modules/.bin/knex migrate:latest && node dist/app.js
