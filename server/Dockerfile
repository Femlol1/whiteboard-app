FROM node:19-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
# ENV REDIS_HOST=whiteboard-redis
# ENV FRONTEND_HOST=http://whiteboard-frontend

EXPOSE 3000

CMD [ "npm", "start"]