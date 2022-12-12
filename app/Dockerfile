FROM node:19-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG BACKEND_HOST="http://localhost:3000"
ENV BACKEND_HOST=$BACKEND_HOST
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html