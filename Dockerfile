FROM node:16-alpine3.15 as build

WORKDIR /home/user/build

RUN npm install -g typescript@4.6.4 npm@8.10.0
COPY . .
RUN npm install && tsc

FROM zenika/alpine-chrome:114-with-node

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
WORKDIR /app
USER root

COPY package.json package-lock.json ./
RUN npm install -g npm@8.10.0 && npm install
COPY --from=build /home/user/build/dist/ ./dist/
RUN chown -R chrome /app/

USER chrome

CMD ["node", "dist/index.js"]
