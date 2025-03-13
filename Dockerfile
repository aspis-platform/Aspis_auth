# 베이스 이미지 설정
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사
COPY package*.json ./

# bcrypt를 재설치하기 위해 의존성 설치
RUN npm install --omit=dev && npm rebuild bcrypt --build-from-source

# 소스 코드 복사
COPY . .

# NestJS 빌드
RUN npm run build

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["node", "dist/main.js"]
