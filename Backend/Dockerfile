FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Устанавливаем переменную HOME, чтобы dotnet tool install работал корректно
ENV HOME=/root
ENV PATH="$PATH:$HOME/.dotnet/tools"

COPY ./WaveifyWeb ./WaveifyWeb
RUN dotnet restore "WaveifyWeb/WaveifyWeb.sln"

RUN dotnet tool install --global dotnet-ef --version 6.0.26

RUN dotnet publish "WaveifyWeb/WaveifyWeb/Waveify.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Waveify.API.dll"]
