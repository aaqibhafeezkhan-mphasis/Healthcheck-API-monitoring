@echo off
SET "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.15.6-hotspot"
SET "PATH=%JAVA_HOME%\bin;%PATH%"
echo Using Java:
java -version
echo.
echo Starting Health-Check_Utility Spring Boot API...
cd /d C:\PracticeSquad\Health-Check_Utility
call mvnw.cmd spring-boot:run
