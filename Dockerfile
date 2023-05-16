FROM node:16-alpine

WORKDIR /app

COPY package*.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 6060

CMD ["yarn", "start"]