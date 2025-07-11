#!/bin/bash

yt-dlp -f 95 -o - "https://www.youtube.com/watch?v=5gpfKRSGtyU" | ffmpeg -re -i pipe:0 \
      -vf fps=30 -c:v libx264 -pix_fmt yuv420p -f hls -hls_time 5 -hls_list_size 10 \
      -hls_segment_filename "/opt/venv/aigis/hls/segment_%03d.ts" \
      /opt/venv/aigis/hls/playlist.m3u8