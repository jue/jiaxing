FROM mhart/alpine-node:12.16.1

RUN echo "https://mirrors.ustc.edu.cn/alpine/v3.9/main/" > /etc/apk/repositories && \
  apk add --no-cache --virtual builds-deps build-base python

COPY . /app
WORKDIR /app

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN mkdir ycache
RUN yarn install --cache-folder ./ycache
RUN yarn build
RUN yarn install --production --cache-folder ./ycache
RUN rm -f next.config.js
RUN rm -rf ycache && yarn cache clean && npm cache clean -f
RUN rm -rf client constants pages server typings yarn.lock
RUN apk del builds-deps build-base python && rm -rf /var/cache/apk/*
RUN echo "done"


# gcc g++ make libpng-dev