FROM node:18

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm --allow-root -g npm@latest expo-cli@latest

RUN mkdir /audiometer_app
WORKDIR /audiometer_app
ENV PATH /audiometer_app/node_modules/.bin:$PATH
COPY package.json /audiometer_app/package.json
COPY package-lock.json /audiometer_app/package-lock.json
RUN npm install

COPY . /audiometer_app

ENTRYPOINT [ "npx" , "expo" , "start" ]
