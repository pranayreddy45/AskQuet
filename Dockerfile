FROM node:16-alpine

RUN addgroup app && adduser -S -G app app


WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run install-client
RUN npm run build

USER app
EXPOSE 4000

CMD ["npm", "start"]


