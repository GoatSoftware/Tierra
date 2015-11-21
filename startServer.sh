#!/bin/bash

cd server/
nohup sudo node startServer.js &> log/gameServer.log&
