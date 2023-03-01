FROM node:16-alpine

WORKDIR /app
COPY . .
USER app
EXPOSE 80

CMD ["npm", "start"]


