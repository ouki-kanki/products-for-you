#!/bin/bash
env='myenv'
container_name='products_for_you'

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


# TODO: not working
# open guake on the current dir  activate venv run django server
cd ../../
# TODO: have to open a useless tab cause the second statement does not seem to open the terminal in current dir.need to find a fix for that
guake .
guake --execute-command='source myenv/bin/activate && cd ./backend && python manage.py runserver' .

# run code with server
codium .

cd ./client
codium .

sleep 1 && nohup dbeaver &
sleep 1 && nohup postman &
sleep 1 && nohup drawio &


nohup chromium http://localhost:5173 &
sleep 1
nohup chromium http://localhost:8000/admin &

# start react server
yarn run dev

cd ..



