FROM node:6-onbuild

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN yarn

EXPOSE 3999

CMD [ "npm", "start" ]