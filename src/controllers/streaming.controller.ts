import * as error from '@utils/error'
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import * as path from 'path'
import { spawn } from 'child_process';

const execAsync = promisify(exec);

export async function start(): Promise<any> {
  
  try{                          
    
    exec(`ps aux | grep '[s]tream.sh'`, (err, stdout, stderr) => {
      if (err) {
        execAsync("nohup /bin/sh /opt/venv/aigis/scripts/stream.sh &");
        return;
      }        
    });
   

    return { type: "success" }

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function stop(): Promise<any> {
  
  try{                          
    
    exec('pkill -f "stream.sh"', (err, stdout, stderr) => {});

    return { type: "success" }

  }catch(e: any){
    throw await error.createError(e)
  }

}
