FROM node:16.17.1-alpine

RUN addgroup app && adduser -S -G app app


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
USER app
EXPOSE 4000

CMD ["npm", "start"]

