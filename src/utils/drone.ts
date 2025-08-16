import * as error from '@utils/error'
import { readFile, writeFile } from 'fs/promises';
import { parseStringPromise, Builder } from 'xml2js';
import AdmZip from 'adm-zip';

export async function modifyCoordinates(filePath: string, longitude: string, latitude: string): Promise<void> {

  try{    
        
    const xmlContent = await readFile(filePath, 'utf-8');
    const parsed = await parseStringPromise(xmlContent, { explicitArray: false, trim: true });

    let count = 0;
    (function update(node: any) {
      if (!node || typeof node !== 'object') return;

      for (const key in node) {
        const val = node[key];
        if (key === 'coordinates' && typeof val === 'string') {
          const parts = val.split(',').map(s => s.trim());
          const alt = parts[2] ? `,${parts[2]}` : '';
          node[key] = `${longitude},${latitude}${alt}`;
          count++;
        } else if (Array.isArray(val)) {
          val.forEach(update);
        } else if (typeof val === 'object') {
          update(val);
        }
      }
    })(parsed);

  if (count === 0) {
    console.warn('No coordinates found.');
  }

  const builder = new Builder({ xmldec: { version: '1.0', encoding: 'UTF-8' }, renderOpts: { pretty: true } });
  await writeFile(filePath, builder.buildObject(parsed), 'utf-8');
  
  }catch(e: any){
    throw await error.createError(e)
  }

}