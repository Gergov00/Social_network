# Этап сборки: используем SDK для восстановления зависимостей, сборки и публикации приложения
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
# Копируем файл проекта и восстанавливаем зависимости
COPY *.csproj ./
RUN dotnet restore
# Копируем все файлы и собираем проект
COPY . ./
RUN dotnet publish -c Release -o out

# Этап выполнения: используем минимальный образ для запуска приложения
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
# Копируем опубликованные файлы из предыдущего этапа
COPY --from=build /app/out ./
# Указываем команду для запуска приложения (замените YourBlazorApp.dll на имя вашего файла)
ENTRYPOINT ["dotnet", "Pet-project.dll"]
