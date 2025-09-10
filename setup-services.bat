@echo off
setlocal enabledelayedexpansion

REM List of services
set services=auth-service user-service restaurant-service order-service

for %%s in (%services%) do (
    echo --------------------------------------
    echo Setting up %%s ...
    echo --------------------------------------
    cd /d D:\food-delivery-app\%%s

    REM Initialize package.json if not exists
    if not exist package.json (
        echo Initializing npm in %%s ...
        npm init -y
    )

    REM Install common dependencies
    echo Installing dependencies for %%s ...
    npm install express pg dotenv jsonwebtoken bcrypt

    REM Install dev dependency
    npm install --save-dev nodemon

    REM Add dev script if not present
    call :addScript "dev" "nodemon src/server.js"
)

echo.
echo ✅ All services setup completed successfully!
pause
exit /b

:addScript
    set scriptName=%~1
    set scriptCmd=%~2
    powershell -Command ^
        "$json = Get-Content package.json | ConvertFrom-Json; ^
        if (-not $json.scripts.%scriptName%) { ^
            $json.scripts.%scriptName% = '%scriptCmd%' ; ^
            $json | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 package.json ^
        }"
    exit /b
