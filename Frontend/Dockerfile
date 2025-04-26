# Используем более новую версию Node.js
FROM node:18 AS frontend-build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только package.json и package-lock.json
COPY ./waveify/package.json ./waveify/package-lock.json ./

# Устанавливаем зависимости внутри контейнера
RUN npm install

# Копируем остальные файлы проекта
COPY ./waveify /app

# Собираем проект
RUN npm run build

# Новый слой, для работы с фронтендом
FROM nginx:alpine

# Копируем собранные файлы в контейнер NGINX
COPY --from=frontend-build /app/.next /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80
