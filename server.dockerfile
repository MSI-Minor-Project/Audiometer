FROM node:21

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV:-development}

WORKDIR /server

COPY ./prisma /server/prisma

RUN npm init -y
RUN npm install --save-dev @types/node
RUN npm install -g prisma
RUN npm install @prisma/client
RUN npm install -g ts-node
RUN npm install typescript -g
RUN npx tsc --init
RUN npx prisma generate

RUN npm install @trpc/server @trpc/client zod @trpc/react-query

COPY ./trpc /server/trpc
COPY ./.env /server/.env

EXPOSE 3000
EXPOSE 5555

CMD ["npx", "ts-node", "trpc/server/index.ts"]