# Sword Test

### Export the following environment variables
```
export MYSQL_ROOT_PASSWORD=admin
export MYSQL_DATABASE=swordapi
export NODE_ENV=development
export PORT=3000
export DB_HOST=host.docker.internal
export DB_USER=root
export DB_PASSWORD=admin
export DB_PORT=3306
export DB_NAME=swordapi
export SECRET_KEY=hks%ˆ#
export NOTIFICATIONS_QUEUE_NAME=notificationsQueue
export NOTIFICATIONS_QUEUE_USER=guest
export NOTIFICATIONS_QUEUE_PASSWORD=guest
export NOTIFICATIONS_QUEUE_HOST=host.docker.internal
export TEST_PORT=5000
export TEST_DB_HOST=host.docker.internal
export TEST_DB_USER=root
export TEST_DB_PASSWORD=admin
export TEST_DB_PORT=3306
export TEST_DB_NAME=swordapi_test
export TEST_SECRET_KEY=hks%ˆ#
export TEST_NOTIFICATIONS_QUEUE_NAME=notificationsQueueTest
export TEST_NOTIFICATIONS_QUEUE_USER=guest
export TEST_NOTIFICATIONS_QUEUE_PASSWORD=guest
export TEST_NOTIFICATIONS_QUEUE_HOST=host.docker.internal
```

### Building the docker image
```
docker-compose build
```

### Running the docker image
```
docker-compose up
```

### Basic request samples
```
1 - create a user

POST http://localhost:3000/user/register
{
	"name": "cristiano",
	"email": "cristiano.sar@gmail.com",
	"password": "admin123",
	"role": 1
}

2 - log-in the created user to get his token

POST http://localhost:3000/user/login
{
	"email": "cristiano.sar@gmail.com",
	"password": "admin123"
}

3 - create a task

POST http://localhost:3000/task
HEADERS {"Authorization": "Bearer <user token>"}
{
	"title": "Task 1",
	"summary": "This is task 1",
	"performerId": "<some created user id>"
}

4 - list all tasks

GET http://localhost:3000/task
HEADERS {"Authorization": "Bearer <user token>"}

5 - set a task as "performed" (non blocking request)

PUT http://localhost:3000/task/<taskId>/perform
HEADERS {"Authorization": "Bearer <user token>"}

5 - delete a task

DELETE http://localhost:3000/task/<taskId>
HEADERS {"Authorization": "Bearer <user token>"}

```