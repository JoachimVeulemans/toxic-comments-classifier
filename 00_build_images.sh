#!/bin/bash

docker build -t joachimveulemans/toxic-comments-classifier:frontend ./frontend/

docker build -t joachimveulemans/toxic-comments-classifier:backend ./backend/
