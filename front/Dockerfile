# Frontend - React
FROM node:18
WORKDIR /app

ARG PORT=3009
ENV PORT=$PORT
ENV NODE_ENV=development

COPY package.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install -g typescript

COPY . .

RUN echo "Front is ready.."

EXPOSE 3009
CMD ["npm", "start"]