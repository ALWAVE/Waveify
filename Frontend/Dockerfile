# Этап сборки
FROM node:20-slim AS builder

WORKDIR /app

COPY ./Frontend/waveify/package.json ./package.json
COPY ./Frontend/waveify/package-lock.json ./package-lock.json
RUN npm install

COPY ./Frontend/waveify .
RUN npm run build

# Этап запуска
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY ./Ngins/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
