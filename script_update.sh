git pull origin main

docker-compose down

docker rmi voixmomotalk/nestjs-thesis-api:1.0.0

docker-compose up -d