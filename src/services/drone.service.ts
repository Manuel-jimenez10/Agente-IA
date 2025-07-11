import * as error from '@utils/error'
import * as path from 'path'
import AdmZip from 'adm-zip';
import axios from 'axios';
import * as config from '@config/config'
import * as drone from '@utils/drone'
import { Client } from 'minio';

export async function modifyCoordinatesInWaylines(longitude: string, latitude: string): Promise<void> {

  try{    
    
    const filePath = path.join(__dirname, '../../drone-data/wpmz', 'waylines.wpml');    
    await drone.modifyCoordinates(filePath, longitude, latitude)

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function modifyCoordinatesInTemplate(longitude: string, latitude: string): Promise<void> {

  try{    
    
    const filePath = path.join(__dirname, '../../drone-data/wpmz', 'template.kml');    
    await drone.modifyCoordinates(filePath, longitude, latitude)

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function zipFolderAsKMZ(): Promise<void> {

  try{    
    
    const zip = new AdmZip(); 
    const folderPath = path.join(__dirname, '../../drone-data/wpmz');    
    zip.addLocalFolder(folderPath, 'wpmz');
    const outputFileName = 'wpmz.kmz'   
    const outputPath = path.join(__dirname, '../../drone-data', outputFileName);
    zip.writeZip(outputPath);
  
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function getProjectStsToken(): Promise<any> {

  try{    
    
    const response = await axios.get(`${config.FLIGHT_BASE_API_URL}/project/sts-token`, {
      headers: {
        'X-User-Token': config.FLIGHT_USER_TOKEN,
        'X-Project-Uuid': config.FLIGHT_PROJECT_UUID,
        'X-Request-Id': config.FLIGHT_REQUEST_ID,
      },
    });

    return response.data
  
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function uploadFileToS3WithSTS(data: any): Promise<any> {

  try{    
    
    // Estos datos vienen de la API de la plataforma
    const accessKey = data.credentials.access_key_id;
    const secretKey = data.credentials.access_key_secret;
    const sessionToken = data.credentials.security_token
    const region = 'us-east-1';
    const endpoint = 's3.us-east-1.amazonaws.com';
    const bucket = 'vg-file-storage-prod';
    const objectKeyPrefix = data.object_key_prefix

    // Archivo a subir
    const filePath = path.join(__dirname, '../../drone-data/wpmz.kmz');
    const fileName = path.basename(filePath);
    const objectKey = `${objectKeyPrefix}/${fileName}`;

   
    const minioClient: any = new Client({
      endPoint: endpoint,
      port: 443,
      useSSL: true,
      accessKey,
      secretKey,
      sessionToken,
      region,
    });

    // Luego podés usar cualquier método sin errores de tipo
    await new Promise<void>((resolve, reject) => {
      minioClient.fPutObject(bucket, objectKey, filePath, {
        'x-amz-security-token': sessionToken,
      }, (err: any, etag: any) => {
        if (err) {
          console.error('Error al subir archivo:', err);
          return reject(err);
        }
        console.log('Archivo subido correctamente');
        console.log('ETag:', etag);
        resolve();
      });
    });

    return objectKey
  
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function finishUploadWayline(objectKey: string): Promise<any> {

  try{    
        
    const response = await axios({
      method: 'post',
      url: `${config.FLIGHT_BASE_API_URL}/wayline/finish-upload`,
      headers: {
        'Content-Type': 'text/plain',
        'X-User-Token': config.FLIGHT_USER_TOKEN,
        'X-Project-Uuid': config.FLIGHT_PROJECT_UUID,
      },
      data: {
        name: 'escobar',
        object_key: objectKey
      }
    });

    return response.data
  
  }catch(e: any){
    throw await error.createError(e)
  }

}