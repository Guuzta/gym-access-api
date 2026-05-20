FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma
RUN npx prisma generate

RUN npm install

COPY . .

RUN npm run build
RUN npm prune --omit=dev



EXPOSE 3000
CMD ["node", "dist/server.js"]