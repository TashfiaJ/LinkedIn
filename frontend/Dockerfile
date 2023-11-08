FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

#prod stage
FROM nginx:1.24.0-alpine-slim as production-stage

# WORKDIR /var/www/html
COPY ./nginx_config.conf /etc/nginx/conf.d/default.conf

# COPY ./frontend/build .
COPY --from=build-stage /app/build /etc/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]