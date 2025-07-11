import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as helper from '@utils/helper'

const HLS_DIR = '/opt/venv/aigis/hls/';
const PLAYLIST_PATH = path.join(HLS_DIR, 'playlist.m3u8');

export async function extractFrameFromLastSegment() {

  // 1. Leer el playlist
  const playlistContent = fs.readFileSync(PLAYLIST_PATH, 'utf-8');
  const lines = playlistContent.split('\n');
  
  // 2. Filtrar las líneas que terminan en .ts
  const segmentFiles = lines.filter(line => line.trim().endsWith('.ts'));
  if (segmentFiles.length === 0) throw new Error('No segment files found');

  const lastSegment = segmentFiles[segmentFiles.length - 1];
  const segmentPath = path.join(HLS_DIR, lastSegment);

  // 3. Definir path de salida
  const imageName = await helper.generateRandomCode()
  const outputImagePath = path.join(__dirname, '../../storage/whatsapp', `${imageName}.png`); 

  // 4. Ejecutar ffmpeg para capturar un frame (el primero por defecto)
  const ffmpegCommand = `ffmpeg -y -i "${segmentPath}" -frames:v 1 "${outputImagePath}"`;
  execSync(ffmpegCommand);

  return outputImagePath

}