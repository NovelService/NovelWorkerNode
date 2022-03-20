FROM xiangronglin/puppeteer:latest

WORKDIR /home/user/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN yarn install && mv node_modules ../ 
COPY . .
EXPOSE 3000
# RUN chown -R user:user home/user/app
USER user
CMD ["node", "build/index.js"]
