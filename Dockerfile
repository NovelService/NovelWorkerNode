FROM node:16-alpine3.15 as build

WORKDIR /home/user/build

COPY . .
RUN npm install typescript
RUN node_modules/.bin/tsc

FROM xiangronglin/puppeteer:test

ENV NOVE_ENV=production
WORKDIR /home/user/app
USER user

COPY --from=build /home/user/build/dist/ ./dist/
COPY package.json package-lock.json ./
RUN npm install
RUN mv node_modules ../ 

CMD ["node", "dist/index.js"]
