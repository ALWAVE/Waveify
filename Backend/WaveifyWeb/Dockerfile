FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80  # Открытие порта 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .  # Копируем весь код в контейнер
RUN dotnet restore "Waveify.sln"
RUN dotnet publish "Waveify.Web/Waveify.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .  # Копируем из предыдущего этапа
ENTRYPOINT ["dotnet", "Waveify.Web.dll"]
