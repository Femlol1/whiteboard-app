FROM node:19-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install redis
COPY . .
ARG REDIS_HOST="whiteboard-redis:6379"
ENV REDIS_HOST=$REDIS_HOST
ARG FRONTEND_HOST="http://whiteboard-frontend:80"
ENV FRONTEND_HOST=$FRONTEND_HOST

EXPOSE 3000

CMD [ "npm", "start"]