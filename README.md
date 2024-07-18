# Holesail-docker

> ⚠️ **Warning!** Some of these features are untested.

Holesail-docker proxies traffic from or to other containers.

Clone this repo then from within the directory run: 
```
docker compose up --build
```

The easiest way to do this is to create a network in Docker:
```
docker network create proxy
```
## Server mode

You can then use the contaier name and port of the container you want to proxy, as exampled below.

```
---
services:
  holesail:
    container_name: holesail
    restart: unless-stopped
    build: .
    environment:
      MODE: server                      # defaults to client
      PORT: 25565
      HOST: minecraft                   # defaults to 0.0.0.0
      CONNECTOR: very-super-secret      # leave this blank to generate a random secret.
    networks:
      - proxy

  mc:
    image: itzg/minecraft-server
    container_name: minecraft
    tty: true
    stdin_open: true
    restart: unless-stopped
    ports:
      - "25565:25565"
    environment:
      EULA: "TRUE"
    volumes:
      - ./data:/data
    depends_on:
      - holesail
    networks:
      - proxy

networks:
  proxy:
    external: true 
```

## Client Mode

Client mode is untested!

```
services:
  holesail:
    container_name: holesail
    restart: unless-stopped
    network_mode: "host"                # host mode is required
    build: .
    environment:
      MODE: client                      # defaults to client
      PORT: 8989
      HOST: 0.0.0.0                     # defaults to 0.0.0.0
      CONNECTOR: very-super-secret      # leave this blank to generate a random secret.
```

"host" network mode only works with linux. Windows and Mac are incompatible.

## Filemanager Mode

```
services:
  holesail:
    container_name: holesail
    restart: unless-stopped
    build: .
    environment:
      MODE: filemanager                 # defaults to client
      PORT: 8989 
      HOST: 0.0.0.0                     # defaults to 0.0.0.0
      PUBLIC: true                      # Defaults to true
      ROLE: user                        # admin for write priveleges. 
      USERNAME: admin
      PASSWORD: admin
      CONNECTOR: very-super-secret      # leave this blank to generate a random secret.
    volumes:
      - <host dir>:/data                # Change <host dir> to the directory you wish to share.
```
