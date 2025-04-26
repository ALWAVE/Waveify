FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY ./WaveifyWeb ./WaveifyWeb
RUN dotnet restore "WaveifyWeb/WaveifyWeb.sln"
RUN dotnet publish "WaveifyWeb/WaveifyWeb/Waveify.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Waveify.API.dll"]
