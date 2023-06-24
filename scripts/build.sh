#!/bin/bash

# Pull mongodb docker image
sudo docker image pull mongo:6.0

# Build sn-api
sudo docker build -t socialnet/sn-api .
