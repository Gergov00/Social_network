# --- Базовый образ (ASP.NET Runtime) ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# --- Образ для сборки (SDK) ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src

# Копируем файл проекта и восстанавливаем зависимости
COPY ["PetProjecAPI.csproj", "."]
RUN dotnet restore "PetProjecAPI.csproj"

# Копируем все остальные файлы и собираем
COPY . .
RUN dotnet build "PetProjecAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# --- Публикация ---
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "PetProjecAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# --- Финальный образ ---
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PetProjecAPI.dll"]
