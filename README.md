# Thesis

## Run backend

From main directory:
```
cd thesis-api-v2
docker compose up -d
./mvnw spring-boot:run -Dspring-boot.run.arguments=--UNSPLASH_API_KEY=key
```
Where `key` is the Access Key to Unsplash

Alternatively, on Windows replace last command with:
```
mvnw spring-boot:run -Dspring-boot.run.arguments=--UNSPLASH_API_KEY=key
```
On Mac or Linux if you get an error like `permission denied`, add permissions to file:
```
chmod +x mvnw
```

Cleaning up:
```
docker compose down
```

## Run frontend

From main directory:
```
cd thesis-gui
ionic serve
```