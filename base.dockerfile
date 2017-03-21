FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g yarn 
RUN yarn config set registry 'https://registry.npm.taobao.org' 
RUN yarn