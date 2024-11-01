FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Run tests
RUN npm test



COPY . .

EXPOSE 5000

CMD ["npm", "start"]
