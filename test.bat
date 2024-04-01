start cmd /k "cd api && npm run start"
start cmd /k "cd web && npm run start"

call get_local_ip.cmd
set /p local_ip=<local_ip.txt

rem Remove all spaces from local_ip
set local_ip=%local_ip: =%

echo Local IP Address: %local_ip%

timeout /t 10 >nul

start chrome "http://%local_ip%:3000/salla"
