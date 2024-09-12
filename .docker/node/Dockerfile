# -- Build
FROM node:18 AS builder
WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . . 
RUN yarn build

# -- App
FROM node:18
WORKDIR /app

RUN apt-get update \
  && apt-get install -y fontconfig-config \
  && rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist

COPY ormconfig.ts ./
COPY package.json ./

CMD ["yarn", "start:prod"]
