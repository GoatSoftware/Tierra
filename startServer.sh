#!/bin/bash

nohup sudo http-server client/ -p 80 &> server/log/gttp-server.out&
