FROM node:21-alpine3.17

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV:-development}

# ARG PORT=3000
# ENV PORT=${PORT}
# EXPOSE ${PORT}
LABEL description="These IP address are used for andriod bridge and expo cli"
ENV ADB_IP="192.168.1.1"
ENV REACT_NATIVE_PACKAGER_HOSTNAME="192.255.255.255"

EXPOSE 19000
EXPOSE 19001

RUN apk add update && apk add install android-tools-adb
RUN --network=default --mount=type=cache,target=/var/cache/apk apk add --update --no-cache bash git openssh

# RUN apt-get install nodejs -y

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
