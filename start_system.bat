@echo off
title NovaLib - Enterprise Library Management System Startup
echo ======================================================================
echo           NovaLib Enterprise Library Management System
echo ======================================================================
echo [1/3] Database Setup:
echo       1. Open SQL Server Management Studio (SSMS).
echo       2. Connect with user: thimira / pass: 123
echo       3. Open & Execute: database\schema_and_seed.sql
echo.
echo [2/3] Starting Java Spring Boot Backend (Port 8080)...
start "NovaLib Backend (Spring Boot)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"
echo.
echo [3/3] Starting React Vite Frontend (Port 5173 / 3000)...
start "NovaLib Frontend (Vite UI)" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo.
echo System launched successfully! Access the web app in your browser at:
echo http://localhost:5173 (or http://localhost:3000)
echo ======================================================================
pause
