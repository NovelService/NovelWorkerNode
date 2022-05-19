FROM node:16-alpine3.15 as build

WORKDIR /home/user/build

COPY . .
RUN npm install typescript
RUN node_modules/.bin/tsc

FROM zenika/alpine-chrome:101-with-node-16

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
WORKDIR /app
USER root

COPY --from=build /home/user/build/dist/ ./dist/
COPY package.json package-lock.json ./
RUN npm install -g npm@8.10.0 && npm install
RUN chown -R chrome /app/

USER chrome

CMD ["node", "dist/index.js"]
