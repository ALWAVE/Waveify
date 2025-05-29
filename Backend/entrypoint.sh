#!/bin/bash
set -e

# Выполняем миграции
dotnet ef database update -s ./WaveifyWeb -p ./Waveify.Persistence

# Запускаем приложение
exec dotnet Waveify.API.dll
