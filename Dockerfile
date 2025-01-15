# Frontend Dockerfile
FROM node:22.11.0-alpine

WORKDIR /app

# Kopiranje package.json i instalacija zavisnosti
COPY package*.json ./
RUN npm install

# Kopiranje ostatka frontend koda
COPY . .

# Build Angular aplikacije
RUN npx ng build --configuration production

# Port na kojem Angular radi
EXPOSE 2526


# Pokretanje aplikacije koristeći nginx
CMD ["npx", "http-server", "dist/e-scheduler-front", "-p", "2526"]
