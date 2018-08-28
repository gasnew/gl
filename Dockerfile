FROM node:8-stretch

ENV GL_HOME /usr/app
RUN echo $GL_HOME
RUN mkdir -p $GL_HOME
WORKDIR $GL_HOME

COPY package.json .
RUN npm install --quiet

COPY . .