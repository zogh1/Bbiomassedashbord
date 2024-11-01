# Dockerfile for frontend
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm cache clean --force

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
