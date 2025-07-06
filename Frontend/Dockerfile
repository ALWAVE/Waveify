# Frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY waveify/package.json ./
COPY waveify/package-lock.json ./
RUN npm install

COPY waveify ./

# Запуск сборки с подробным выводом
RUN npm run build
CMD ["npm", "start"]
