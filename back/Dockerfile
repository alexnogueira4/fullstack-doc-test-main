# Backend - Node
FROM node:18
WORKDIR /app

ARG PORT=4000
ENV PORT=$PORT
ENV NODE_ENV=development

COPY package.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install -g typescript

COPY . .

RUN npm install --save-dev ts-node-dev

RUN echo "Back is ready.."

EXPOSE 4000
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
