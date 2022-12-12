FROM node:19-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG REACT_APP_BACKEND_HOST="http://localhost:5000"
ENV REACT_APP_BACKEND_HOST=$REACT_APP_BACKEND_HOST
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html