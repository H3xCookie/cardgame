FROM node:21-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN chown node:node package*.json
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 7777
CMD [ "npm", "run", "serve" ]
