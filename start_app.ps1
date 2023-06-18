Set-Location $PWD\backend\db -PassThru
# TODO: check if the database is running
docker-compose up -d

Set-Location ..
Set-Location ..
Set-Location $PWD\client -PassThru

Start-Process -FilePath Chrome -ArgumentList "http://localhost:8000/admin http://localhost:5173"

yarn run dev
