#!/bin/sh
pm2 start pm2.json --env $APP_ENV #启动pm2，$APP_ENV：docker运行时候传入的参数
pm2 logs
