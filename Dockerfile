FROM node:lts-alpine3.12

WORKDIR '/app'

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install

COPY . .

CMD ["yarn", "start"]