# 빌드 이미지
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.local .
RUN npm run build

# 실행 이미지
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY .env.local .

EXPOSE 3000
CMD ["npm", "start"]
