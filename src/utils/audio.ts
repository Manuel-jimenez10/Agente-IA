import * as error from '@utils/error'
import { Model, Recognizer } from 'vosk';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import * as config from '@config/config'
import OpenAI from "openai";
const modelPath = 'vosk-models/vosk-model-small-es-0.42';

export async function convertAudioToWav(audioBuffer: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(audioBuffer);

    const outputStream = new PassThrough();
    const chunks: Buffer[] = [];

    ffmpeg()
      .input(inputStream)
      .inputFormat("ogg")
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .format("wav")
      .on("error", (err) => reject(`❌ Error en FFmpeg: ${err}`))
      .pipe(outputStream);

    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("finish", () => resolve(Buffer.concat(chunks))); 
  });
}


export async function transcribeAudioWithVosk(wavBuffer: any) {
  const model = new Model(modelPath);
  const rec = new Recognizer({ model, sampleRate: 16000 });

  rec.acceptWaveform(wavBuffer);
  const result = rec.finalResult();

  return result.text;
}

export async function textToSpeechBuffer(text: string): Promise<any> {

 try{

    const openai = new OpenAI({
      organization: config.OPENAI_ORGANIZATION,
      project: config.OPENAI_PROJECT,
      apiKey: config.OPENAI_API_KEY
    });     

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      response_format: "opus"    
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    return buffer

  }catch(e){
    
  }
  
}
