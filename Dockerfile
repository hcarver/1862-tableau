FROM node:14-alpine

RUN mkdir /src
WORKDIR /src

ADD package.json package.json
ADD yarn.lock yarn.lock
RUN yarn install

ADD . /src
CMD yarn start
