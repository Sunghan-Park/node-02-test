# stop.sh

#!/bin/bash
APP_NAME="nest_mk4"

echo "Stopping application: $APP_NAME"


pm2 stop $APP_NAME
pm2 delete $APP_NAME

echo " Application stopped successfully!"