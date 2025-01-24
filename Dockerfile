# Frontend Dockerfile
FROM node:22.11.0 AS angular
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=angular /app/dist/e-scheduler-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 2526


