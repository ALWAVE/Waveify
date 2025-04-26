# Используем более новую версию Node.js
FROM node:18 AS frontend-build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если он есть)
COPY ./waveify/package.json ./waveify/package-lock.json ./
COPY ./waveify/node_modules ./node_modules

# Копируем оставшиеся файлы проекта
COPY ./waveify /app

# Собираем проект
RUN npm run build

# Новый слой, для работы с фронтендом
FROM nginx:alpine

# Копируем собранные файлы в контейнер NGINX
COPY --from=frontend-build /app/.next /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80
