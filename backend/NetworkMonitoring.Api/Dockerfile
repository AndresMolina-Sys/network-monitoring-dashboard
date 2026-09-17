FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["NetworkMonitoring.Api.csproj", "./"]

RUN dotnet restore "NetworkMonitoring.Api.csproj"

COPY . .

RUN dotnet publish "NetworkMonitoring.Api.csproj" --configuration Release --output /app/publish --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=10000

COPY --from=build /app/publish .

EXPOSE 10000

ENTRYPOINT ["dotnet", "NetworkMonitoring.Api.dll"]