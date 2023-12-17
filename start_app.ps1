# load config file
$configPath = Join-Path -Path $PSScriptRoot -ChildPath "config.xml" # has to be in the same directory
$config = ([xml](Get-Content $configPath)).root
$user = $config.user

# open docker desktop
Start-Process "C:\Users\$user\AppData\Local\Postman\Postman.exe"
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
# Get-Command "Docker Desktop"
# Start-Process "Docker Desktop.exe"

# Wait until Docker Desktop is running
while (!(Get-Process -Name Docker -ErrorAction SilentlyContinue)) {
  Start-Sleep -Seconds 1
}
Start-Sleep -Seconds 5

# start postman

Set-Location $PWD\backend\db -PassThru
# TODO: check if the database is running
docker-compose up -d

Set-Location ..
Set-Location ..
Set-Location $PWD\client -PassThru
code .

Start-Process -FilePath Chrome -ArgumentList "http://localhost:8000/admin http://localhost:5173"

# start the front-end server
yarn run dev
