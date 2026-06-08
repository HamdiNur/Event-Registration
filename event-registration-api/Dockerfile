FROM node:20-alpine

# Add OpenSSL for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --registry https://registry.npmjs.org/ --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]
