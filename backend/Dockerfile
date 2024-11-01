FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install
COPY . .

# Run tests
RUN npm test --detectOpenHandles




EXPOSE 5000

CMD ["npm", "start"]
