FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .   # Эта команда копирует файлы в контейнер
RUN dotnet restore "Waveify.sln"  # Это команда восстанавливает зависимости
RUN dotnet publish "Waveify.Web/Waveify.Web.csproj" -c Release -o /app/publish  # Публикация проекта

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .  # Копируем собранный проект из build этапа
ENTRYPOINT ["dotnet", "Waveify.Web.dll"]  # Запуск приложения
