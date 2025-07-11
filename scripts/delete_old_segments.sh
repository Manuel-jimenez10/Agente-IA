#!/bin/bash

# Directorio donde se guardan los segmentos HLS y la playlist
HLS_DIR="/opt/venv/aigis/hls"
PLAYLIST_FILE="$HLS_DIR/playlist.m3u8"

# Verificar si el archivo de la playlist existe
if [ ! -f "$PLAYLIST_FILE" ]; then
    echo "La playlist no existe en $PLAYLIST_FILE. Aborted."
    exit 1
fi

# Obtener la lista de segmentos que están en la playlist
SEGMENTS_IN_PLAYLIST=$(grep -oP 'segment_\d+\.ts' "$PLAYLIST_FILE")

# Obtener la lista de segmentos actuales en el directorio HLS
SEGMENTS_IN_DIR=$(ls "$HLS_DIR"/segment_*.ts 2>/dev/null)

# Eliminar los segmentos que no están en la playlist
for SEGMENT in $SEGMENTS_IN_DIR; do
    BASENAME=$(basename "$SEGMENT")

    # Si el segmento no está en la playlist, eliminarlo
    if ! echo "$SEGMENTS_IN_PLAYLIST" | grep -q "$BASENAME"; then
        echo "Eliminando segmento: $SEGMENT"
        rm -f "$SEGMENT"
    fi
done