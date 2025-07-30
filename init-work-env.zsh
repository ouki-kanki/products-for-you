#!/usr/bin/env zsh

# $0 is the script itslelf
cd "$(dirname "$0")/client" || exit
code .

# for some reason if i open the workspace it does not remember the session
cd ../backend || exit
code .

if ! docker info > /dev/null 2>&1; then
    echo "docker offline.starting.."
    docker-start # an alias is defined in zshrc
else
    echo "docker is allready running"
fi

qutebrowser &
drawio &
chromium &
# dbeaver &

cd ../docker

