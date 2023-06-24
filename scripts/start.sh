#!/bin/bash

# Start sn-api-mongo
sudo docker run -d \
    --name sn-api-mongo \
    -p 27017:27017 \
    -v $(pwd)/data/db:/data/db \
    -e MONGO_INITDB_ROOT_USERNAME=root \
    -e MONGO_INITDB_ROOT_PASSWORD=password \
    -e MONGO_INITDB_DATABASE=sn-api \
    mongo:6.0

# Start sn-api
sudo docker run -d \
    --name sn-api \
    -p 8000:8000 \
    --env-file .env \
    socialnet/sn-api
