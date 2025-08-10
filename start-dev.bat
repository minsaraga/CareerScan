@echo off
echo Starting CareerScan Development Environment...

echo.
echo 1. Starting Docker services...
cd infra
docker-compose -f docker-compose.dev.yml up -d

echo.
echo 2. Waiting for database to be ready...
timeout /t 10

echo.
echo 3. Setting up database...
cd ..\backend
call npm install
call npx prisma migrate dev --name init
call npx prisma generate
call npm run seed

echo.
echo 4. Starting backend server...
start "Backend Server" cmd /k "npm run start:dev"

echo.
echo Setup complete!
echo - Backend: http://localhost:8080
echo - Health: http://localhost:8080/health
echo - Database: localhost:5432
echo.
echo Open Android Studio and run the app pointing to http://10.0.2.2:8080
pause