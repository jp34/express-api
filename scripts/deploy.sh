#!/bin/bash

./scripts/down.sh
git pull
./scripts/build.sh
./scripts/start.sh
