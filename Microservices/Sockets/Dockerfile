FROM node:latest as base

WORKDIR /src
COPY package*.json /
EXPOSE 4700

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["npm", "start"]