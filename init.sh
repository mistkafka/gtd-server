#!/bin/bash

# Build base image
while getopts ":f" arg
do
    case $arg in
        f)
            docker rmi express-rest-base:latest # force rebuid base image
    esac
done
exist=$(docker images --format "{{.Repository}}" | grep 'express-rest-base')
if [ "$exist" != "express-rest-base" ]; then
    docker build -t express-rest-base:latest -f base.dockerfile .
fi


PROD="producstion"
if [ "$NODE_ENV" != "$PROD" ]; then
    docker run --name express-rest-dev --link mongo-server:mongodb.data.server -v `pwd`:/usr/src/app -p 3000:3000 -d express-rest-base:latest yarn start
fi
