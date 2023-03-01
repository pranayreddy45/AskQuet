FROM node:16.17.1-alpine

WORKDIR /app
COPY . .
USER app
EXPOSE 80

CMD ["npm", "start"]


