#!/bin/bash
set -e

echo "Drop previous process of docker image..."
docker-compose down

echo "Build application build with docker"
docker-compose up -d --build

