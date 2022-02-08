FROM xiangronglin/puppeteer:latest
# ENV NODE_ENV=production
WORKDIR /home/user/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install && mv node_modules ../
COPY . .
EXPOSE 3000
# RUN chown -R user:user home/user/app
USER user
CMD ["node", "src/index.js"]
