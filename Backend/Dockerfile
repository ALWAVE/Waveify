
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем все исходники
COPY . .

# Восстанавливаем зависимости
RUN dotnet restore "WaveifyWeb/WaveifyWeb.sln"

# Публикуем проект
RUN dotnet publish "WaveifyWeb/WaveifyWeb.csproj" -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WaveifyWeb.dll"]
