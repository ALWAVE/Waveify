FROM node:20-alpine as build
WORKDIR /app
COPY . .  # Копируем весь код в контейнер
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html  # Копируем билд в nginx
