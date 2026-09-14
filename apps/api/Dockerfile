# Multi-stage: cada FROM e um estagio. O compose usa o estagio "development"
# (com recarga automatica); o deploy usa o "production" (imagem menor, so o
# codigo compilado e as dependencias de producao).

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start:dev"]

FROM deps AS build
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER node
EXPOSE 8080
CMD ["node", "dist/main.js"]
