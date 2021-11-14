FROM node:14.18.1-slim

RUN apt-get -y update && apt-get -y install git
RUN npm install npm -g
RUN npm update npm -g
RUN npm install -g @vue/cli
RUN npm install -g vue-sfc-rollup

WORKDIR /usr/share/frontend
COPY package*.json ./

RUN npm install

COPY . ./
# EXPOSE 9090
