FROM express-rest:latest

COPY . /usr/src/app
EXPOSE 3000
CMD ["yarn", "start"]