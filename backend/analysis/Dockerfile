##### Dockerfile #####
FROM node:18.18-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm cache clean --force && npm install
RUN npm install bcryptjs
RUN npm install -g nodemon
COPY --chown=node:node . .
EXPOSE 3002
CMD [ "node", "server.js" ]