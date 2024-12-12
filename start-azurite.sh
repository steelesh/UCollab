#!/usr/bin/env bash

AZURITE_CONTAINER_NAME="ucollab-azurite"
AZURITE_DATA_DIR="./data/azurite"

mkdir -p $AZURITE_DATA_DIR

if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Please install docker and try again."
  exit 1
fi

if [ "$(docker ps -q -f name=$AZURITE_CONTAINER_NAME)" ]; then
  echo "Azurite container '$AZURITE_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$AZURITE_CONTAINER_NAME)" ]; then
  docker start "$AZURITE_CONTAINER_NAME"
  echo "Existing Azurite container '$AZURITE_CONTAINER_NAME' started"
  exit 0
fi

docker run -d \
  --name $AZURITE_CONTAINER_NAME \
  -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  -v "${PWD}/${AZURITE_DATA_DIR}:/data" \
  mcr.microsoft.com/azure-storage/azurite && \
  echo "Azurite container '$AZURITE_CONTAINER_NAME' was successfully created"
