#!/bin/bash

PROVIDED_SECRET=$(echo $1 | cut -c6-)
WEBHOOK_SECRET=$(cat WEBHOOK_SECRET_SHA_1)

if [ $PROVIDED_SECRET != $WEBHOOK_SECRET ]; then
    exit 1
fi

git pull
docker-compose down
docker-compose up -d || :
# For some reason the first time fails, because the seccomp is not getting read properly.
# It fails with filename too long. The container is created, but not startet, so we just do it again.
docker-compose up -d 
