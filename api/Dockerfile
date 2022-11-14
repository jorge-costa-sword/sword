FROM node:18-alpine

WORKDIR /api
COPY . /api

RUN apk update && apk add bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

RUN npm install
RUN npm run lint

EXPOSE 3000

RUN chmod +x start.sh

ENTRYPOINT [ "./start.sh" ]