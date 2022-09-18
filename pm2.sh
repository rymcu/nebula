#!/bin/sh
pm2 start pm2.json --env $APP_ENV
pm2 logs
