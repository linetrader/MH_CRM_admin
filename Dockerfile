# 1단계: 빌드 이미지
FROM node:20 AS builder
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 전체 소스 복사
COPY . .

# 빌드 실행
RUN npm run build

# 2단계: 실행 이미지
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

# 빌드된 파일만 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 포트 오픈
EXPOSE 3000

# 실행 명령
CMD ["npm", "start"]
