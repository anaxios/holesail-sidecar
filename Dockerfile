FROM node:lts-slim AS base

RUN npm install -g pm2@latest holesail dotenv 

FROM base AS prod

ENV MODE server
ENV HOST 0.0.0.0
ENV PORT 8989
ENV PUBLIC true
ENV USERNAME admin
ENV PASSWORD admin
ENV ROLE user 
ENV CONNECTOR ""
ENV FORCE false

#EXPOSE 8989
EXPOSE 8787

COPY server /temp/server
WORKDIR /temp/server
RUN npm i

COPY app /temp/app 
COPY process.json /temp

WORKDIR /data

#ENTRYPOINT [ "/temp/run.sh" ]
#CMD ["pm2-runtime", "/temp/process.json"]
#CMD ["pm2-runtime", "/temp/server/server.js"]
ENTRYPOINT ["node", "/temp/server/server.js"]
#ENTRYPOINT ["node", "/temp/app/app.js"]
