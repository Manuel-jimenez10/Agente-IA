import * as error from '@utils/error'
import { readFile, writeFile } from 'fs/promises';
import { parseStringPromise, Builder } from 'xml2js';
import AdmZip from 'adm-zip';

export async function modifyCoordinates(filePath: string, longitude: string, latitude: string): Promise<void> {

  try{    
        
    const xmlContent = await readFile(filePath, 'utf-8');
    const parsed = await parseStringPromise(xmlContent, { explicitArray: false });

    const placemarks = parsed.kml.Document.Folder.Placemark;

    if (!placemarks || placemarks.length < 2) {
      console.error('No second Placemark found.');
      return;
    }

    const secondPlacemark = Array.isArray(placemarks) ? placemarks[1] : null;
    if (!secondPlacemark?.Point?.coordinates) {
      console.error('Second Placemark does not have coordinates.');
      return;
    }

    secondPlacemark.Point.coordinates = `${longitude},${latitude}`;

    const builder = new Builder();
    const updatedXml = builder.buildObject(parsed);

    await writeFile(filePath, updatedXml);
  
  }catch(e: any){
    throw await error.createError(e)
  }

}