# AiGIS backend

## Deployment

- Url: https://server.api.aigis.io/api

- Path en server: `/opt/server`

- Environment: `/env/env.[environment]`
    - environment = testing
    - `export NODE_ENV=testing`

- Verificar estado: `pm2 list`

Hard Refresh:
```
pm2 list
pm2 stop [id]
pm2 delete [id]
pm2 start "node dist/server.js" --watch
```

## APIs:
- `/api/videos`
    - `[POST] /report`
- `/api/streaming`
    - `[POST] /start`
    - `[POST] /stop`


# Inicio de Servicios

Este documento describe los pasos necesarios para iniciar los servicios requeridos en el servidor.

## 1. Backend
Para iniciar el backend, ejecute los siguientes comandos:

```sh
export NODE_ENV=testing
pm2 start "node dist/server.js" --watch --name "aigis-server"
```

## 2. Text To Speech (TTS)
Para iniciar el servicio de conversión de texto a voz (Text To Speech), utilice los siguientes comandos:

```sh
source /opt/venv/tts/bin/activate
nohup python /opt/venv/tts/server.py &
```

## 3. Base de Datos (MongoDB)
Para iniciar MongoDB, ejecute:

```sh
systemctl start mongod
```

## Notas
- Asegúrese de tener configurado `pm2` para la gestión del backend.
- `nohup` permite que el proceso de TTS continúe ejecutándose incluso después de cerrar la sesión.
- MongoDB debe estar instalado y habilitado en el sistema para que pueda iniciarse con `systemctl`.

