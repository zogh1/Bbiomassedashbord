# Dockerfile for frontend
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the src and public folders
COPY src ./src
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
