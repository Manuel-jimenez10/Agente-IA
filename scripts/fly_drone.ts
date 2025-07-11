import { readFile, writeFile } from 'fs/promises';
import { parseStringPromise, Builder } from 'xml2js';
import AdmZip from 'adm-zip';
import { Client } from 'minio';
import { statSync } from 'fs';
import { createReadStream } from 'fs';
import * as path from 'path'
import axios from 'axios';

async function modifyCoordinatesInWaylines() {

  const filePath = './drone-data/wpmz/waylines.wpml'
  const newLongitude = -50.800001;
  const newLatitude = -30.361111;

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

  secondPlacemark.Point.coordinates = `${newLongitude},${newLatitude}`;

  const builder = new Builder();
  const updatedXml = builder.buildObject(parsed);

  await writeFile(filePath, updatedXml);  

}

async function modifyCoordinatesInTemplate() {

  const filePath = './drone-data/wpmz/template.kml'
  const newLongitude = -50.800001;
  const newLatitude = -30.361111;

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

  secondPlacemark.Point.coordinates = `${newLongitude},${newLatitude}`;

  const builder = new Builder();
  const updatedXml = builder.buildObject(parsed);

  await writeFile(filePath, updatedXml);  

}

function zipFolderAsKMZ(): void {
   
  const zip = new AdmZip(); 
  const folderPath = './drone-data/wpmz' 
  zip.addLocalFolder(folderPath, 'wpmz');
  const outputFileName = 'wpmz.kmz'
  const outputPath = `./drone-data/${outputFileName}`
  zip.writeZip(outputPath);
  
}

async function getProjectStsToken(){

  const response = await axios.get(`https://es-flight-api-us.djigate.com/openapi/v0.1/project/sts-token`, {
    headers: {
      'X-User-Token': "eyJhbGciOiJIUzUxMiIsImNyaXQiOlsidHlwIiwiYWxnIiwia2lkIl0sImtpZCI6IjBkNzQyMzFmLTgxOWYtNDE3NS04NWUzLTRhZDQxODUzMzEyZiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiYW5kcmVzanVhcmV6QG5pZGVwb3J0LmNvbSIsImV4cCI6MjA2NTI1Njg2NCwibmJmIjoxNzQ5NzI0MDY0LCJvcmdhbml6YXRpb25fdXVpZCI6ImYyNzIxYjgxLTc3MTMtNDBiNC05OGQzLWZkYzhlNDRlYjEwOCIsInByb2plY3RfdXVpZCI6IiIsInN1YiI6ImZoMiIsInVzZXJfaWQiOiIxOTE3NzMxNDA1NTc5MjMxMjMyIn0.1d9LQlY9H6O-OJRvQyHCDRshPizLv8s_ns3lGPjaky-2YRbhjx2qmM1L0TrHxKiCyHemfwMSapfughibEIDMCA",
      'X-Project-Uuid': "e83d8d3c-2714-4862-8d00-f7736b8ea4ac",
      'X-Request-Id': "f2721b81-7713-40b4-98d3-fdc8e44eb108",
    },
  });

  return response.data

}

async function uploadFileToS3WithSTS(data: any){

  // Estos datos vienen de la API de la plataforma
  const accessKey = data.credentials.access_key_id;
  const secretKey = data.credentials.access_key_secret;
  const sessionToken = data.credentials.security_token
  const region = 'us-east-1';
  const endpoint = 's3.us-east-1.amazonaws.com';
  const bucket = 'vg-file-storage-prod';
  const objectKeyPrefix = data.object_key_prefix

  // Archivo a subir
  const filePath = './drone-data/wpmz.kmz';
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
    }, async (err: any, etag: any) => {
      if (err) {
        console.error('Error al subir archivo:', err);
        return reject(err);
      }
      console.log('Archivo subido correctamente');
      console.log('ETag:', etag);

       try {
        const stat = await minioClient.statObject(bucket, objectKey);
        //console.log('Verificación existosa:', stat);
        resolve();
      } catch (statErr) {
        console.error('Error verificando existencia:', statErr);
        reject(statErr);
      }

      resolve();
    });
  });

  return objectKey

}

async function finishUploadWayline(objectKey: any){
    console.log(objectKey)
  try{
    const response = await axios({
      method: 'post',
      url: `https://es-flight-api-us.djigate.com/openapi/v0.1/wayline/finish-upload`,
      headers: {
        'Content-Type': 'text/plain',
        'X-User-Token': "eyJhbGciOiJIUzUxMiIsImNyaXQiOlsidHlwIiwiYWxnIiwia2lkIl0sImtpZCI6IjBkNzQyMzFmLTgxOWYtNDE3NS04NWUzLTRhZDQxODUzMzEyZiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiYW5kcmVzanVhcmV6QG5pZGVwb3J0LmNvbSIsImV4cCI6MjA2NTI1Njg2NCwibmJmIjoxNzQ5NzI0MDY0LCJvcmdhbml6YXRpb25fdXVpZCI6ImYyNzIxYjgxLTc3MTMtNDBiNC05OGQzLWZkYzhlNDRlYjEwOCIsInByb2plY3RfdXVpZCI6IiIsInN1YiI6ImZoMiIsInVzZXJfaWQiOiIxOTE3NzMxNDA1NTc5MjMxMjMyIn0.1d9LQlY9H6O-OJRvQyHCDRshPizLv8s_ns3lGPjaky-2YRbhjx2qmM1L0TrHxKiCyHemfwMSapfughibEIDMCA",
        'X-Project-Uuid': "e83d8d3c-2714-4862-8d00-f7736b8ea4ac",
      },
      data: {
        name: 'escobar',
        object_key: objectKey
      }
    });    

    return response.data
  }catch(e: any){
    console.log(e)
  }
}

async function main(){

  await modifyCoordinatesInWaylines()  
  await modifyCoordinatesInTemplate()    
  await zipFolderAsKMZ()  
  const token = await getProjectStsToken()  
  console.log(token)
  const objectKey = await uploadFileToS3WithSTS(token.data)  
  const data = await finishUploadWayline(objectKey)     

  console.log(data)

}

main()