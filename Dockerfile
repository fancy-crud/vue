FROM node:14.18.1-slim

RUN apt-get -y update && apt-get -y install git
RUN npm install npm -g && npm update npm -g

RUN userdel -r node

ARG user=frontend
ARG uid=1000
ARG gid=1000

RUN addgroup --gid $gid ${user}
RUN adduser --disabled-password --gecos '' --uid $uid --gid $gid ${user}

USER ${user}

WORKDIR /home/${user}

RUN mkdir -p ${user}

WORKDIR /home/${user}/${user}

RUN mkdir -p node_modules

COPY package*.json ./

RUN npm install

COPY . .

USER root
RUN chown -R ${user}:${user} node_modules
RUN chown ${user}:${user} package-lock.json
USER ${user}

EXPOSE 9090