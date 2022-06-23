FROM node:latest as base

WORKDIR /src
COPY package*.json /
EXPOSE 3000

# FROM base as dev
# ENV NODE_ENV=production

RUN npm install --force
COPY . /
RUN npm run build
CMD ["npm", "start"]