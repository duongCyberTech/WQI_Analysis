##### Dockerfile #####
FROM node:18.18-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm cache clean --force && npm install
RUN npm install bcryptjs
COPY --chown=node:node . .
EXPOSE 3001
CMD [ "node", "server.js" ]