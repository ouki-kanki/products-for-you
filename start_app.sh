#!/bin/bash
env='myenv'
container_name='products_for_you'

# open guake on the current dir and activate venv
guake --execute-command='source myenv/bin/activate' .

# start docker deamon
if ! systemctl is-active -q "docker.service" ; then
  echo "Starting docker service"
  # TODO: inform if the service cannot be started
  sudo systemctl start docker.service && echo "docker daemon started"
else
  echo "docker service is  active"  
fi

# start venv
# NOTE: have to source the script in order to create the env in the shell that the script is envoked
. $env/bin/activate

# spin the db
cd ./backend/db
if ! docker ps | grep -q -c $container_name; then
  docker-compose up -d
  docker ps
else
  echo "container $container_name is running"
fi

# run code with server
cd ../
codium .

cd ../client
codium .

sleep 1 && nohup dbeaver &
sleep 1 && nohup postman &

# start react server
yarn run dev

# cd ../


