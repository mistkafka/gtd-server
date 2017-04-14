FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN npm install -g yarn 
RUN yarn
RUN echo "Asia/Shanghai" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata
COPY . /usr/src/app
EXPOSE 3000
CMD ["yarn", "start"]