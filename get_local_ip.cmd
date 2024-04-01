@echo off
setlocal enabledelayedexpansion

del local_ip.txt

set "LOCAL_IP="
rem Get the names of the network connections.
for /f "tokens=* delims=" %%a in ('wmic nic get NetConnectionID ^| findstr /i "Wi-Fi"') do (
    set "connection=%%a"
    rem Remove leading and trailing whitespace from the connection name.
    for /f "tokens=* delims=" %%b in ("!connection!") do set "connection=%%b"
    echo Found connection: !connection!
)

rem Get the IPv4 address of the Wi-Fi connection.
set "adapter="
for /f "tokens=* delims=" %%a in ('ipconfig') do (
    set "line=%%a"

    rem Check if the line is empty.
    if "!line!"==" " (
        set "adapter="
    )

    rem Check if the line contains the name of an adapter.
    echo !line! | findstr /i "adapter" >nul
    if !errorlevel! equ 0 (
        set "adapter=!line!"
    )

    rem If the current adapter is the Wi-Fi adapter and the line contains an IPv4 address, print the address.
    echo !adapter! | findstr /i "!connection!" >nul
    if !errorlevel! equ 0 (
        echo !line! | findstr /r "IPv4 Address.*[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*" >nul
        if !errorlevel! equ 0 (
            for /f "tokens=2 delims=:" %%b in ("!line!") do (
                set "ip=%%b"
                set "ip=!ip:~1!"
                rem Remove all spaces from the IP address.
                set "ip=!ip: =!"
                echo Found Wi-Fi IP: "!ip!"
                rem Uncomment the next two lines if you want to store the IP address in a variable and exit the loop.
                set "LOCAL_IP=!ip!"
                goto :found
            )
        )
    )


)

@REM :found
@REM if not "%LOCAL_IP%"=="" (
@REM     echo Final Wireless IP: "%LOCAL_IP%"
@REM     echo "%LOCAL_IP%" > local_ip.txt

@REM     @REM set DOCKER_COMPOSE_FILE=docker-compose.yml
@REM     @REM set "LOCAL_IP_PLACEHOLDER=%LOCAL_IP%"

@REM     @REM (
@REM     @REM   for /f "delims=" %%i in (!DOCKER_COMPOSE_FILE!) do (
@REM     @REM     set "line=%%i"
@REM     @REM     set "line=!line:%%LOCAL_IP_PLACEHOLDER%%=%LOCAL_IP_PLACEHOLDER%!"
@REM     @REM     echo !line!
@REM     @REM   )
@REM     @REM ) > temp.yml

@REM     @REM move /y temp.yml !DOCKER_COMPOSE_FILE!

@REM     @REM set "LOCAL_IP_PLACEHOLDER=%LOCAL_IP%"
    
@REM     @REM docker-compose build
@REM     @REM docker-compose up 
@REM ) else (
@REM     echo Unable to find the Wireless IPv4 address.
@REM )


:found
if not "%LOCAL_IP%"=="" (
    rem Trim trailing spaces from LOCAL_IP variable
    for /f "tokens=* delims= " %%a in ("%LOCAL_IP%") do set "LOCAL_IP=%%a"

    rem Write the LOCAL_IP to local_ip.txt without any extra characters
    > local_ip.txt (echo %LOCAL_IP%)

    rem Print the IP to verify
    type local_ip.txt

    rem Other actions with the IP

) else (
    echo Unable to find the Wireless IPv4 address.
)



endlocal
