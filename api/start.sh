#!/bin/bash

/bin/wait-for-it.sh rabbitmq:5672 --timeout=30 -- echo "RabbitMQ is Up"
/bin/wait-for-it.sh db:3306 --timeout=60 -- echo "MySQL is Up"

# npm run lint
npm run migrations
npm run test
npm run start