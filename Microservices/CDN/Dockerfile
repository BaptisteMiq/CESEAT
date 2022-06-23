FROM node:latest as base

WORKDIR /src
COPY package*.json /
COPY uploads /uploads
EXPOSE 3001

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["npm", "start"]