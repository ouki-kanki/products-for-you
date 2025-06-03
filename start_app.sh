#!/bin/bash

if systemctl is-active --quiet docker; then
  echo "docker is running"
else
  echo "Starting Docker Servive"
  systemctl start docker
  echo "Docker Service started successfully"
fi

cd client || exit
code . &

sleep 5

code --add client.code-workspace &

cd ../backend || exit
code backend.code-workspace &

sleep 5

pwd

source venv/bin/activate
echo "virtual env activated..."

