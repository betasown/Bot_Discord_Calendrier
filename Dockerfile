FROM node:lts-alpine

RUN mkdir -p /usr/src/app/node_modules
WORKDIR /usr/src/app
COPY package*.json ./
RUN chown -R node:node /usr/src/app

USER node
RUN npm install --verbose

COPY --chown=node:node . .

CMD ["npm", "start"]