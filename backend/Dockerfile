FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Полностью очищаем NuGet настройки
ENV NUGET_PACKAGES=/root/.nuget/packages
RUN dotnet nuget locals all --clear

# Копируем ВСЕ файлы сразу (так проще)
COPY . .

# Восстанавливаем с явным источником
RUN dotnet restore VirtualExcursion/VirtualExcursion.API.csproj -s https://api.nuget.org/v3/index.json

# Собираем
WORKDIR "/src/VirtualExcursion"
RUN dotnet build "VirtualExcursion.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "VirtualExcursion.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app


RUN mkdir -p /app/wwwroot && \
    mkdir -p /app/wwwroot/thumbnails && \
    mkdir -p /app/wwwroot/uploads && \
    mkdir -p /app/wwwroot/models && \
    mkdir -p /app/wwwroot/videos && \
    mkdir -p /app/wwwroot/panoramas && \
    mkdir -p /app/wwwroot/scene-images

EXPOSE 80
EXPOSE 443
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VirtualExcursion.API.dll"]