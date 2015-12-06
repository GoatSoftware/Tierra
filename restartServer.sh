#!/bin/bash

sudo killall node
cd server/
nohup sudo node startServer.js &> log/gameServer.log&
