FROM node:16-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 4000

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["npm", "run", "prod"]