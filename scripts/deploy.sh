#!/bin/bash
set -e


PROCESS="local"
app_name="nev-event-management"


# Parse --process flag value
while [[ "$#" -gt 0 ]]; do              # if any flag
  if [[ "$1" == "--process" ]]; then    # if process flag
    PROCESS="$2"                        # get second flag
    shift 2
  else
    shift
  fi
done

echo "🚀 Starting $app_name deployment (process: $PROCESS)"


# Check process
if [[ "$PROCESS" = "docker" ]]; then
    # docker run
    echo "Drop previous process of docker image..."
    docker-compose down

    echo "Build application build with docker"
    docker-compose up -d --build
else
    # pm2 run
    echo "1.Install Packages"
    npm i

    echo ""
    echo "2. Generate DB"
    npm run db:generate

    echo ""
    echo "3. Build application build"
    npm run build

    # check pm2 process app exist
    if pm2 jlist | grep -q "\"name\":\"$app_name\""; then
        echo "App exists"
        pm2 restart $app_name
    else
        echo "App not found"
        pm2 start 'npm run start' --name $app_name
    fi
fi