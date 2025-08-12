import * as error from '@utils/error'
import * as droneService from '@services/drone.service'

export async function fly(longitude: string, latitude: string): Promise<any> {
  
  try{                          
      
    await droneService.modifyCoordinatesInWaylines(longitude, latitude)
    await droneService.modifyCoordinatesInTemplate(longitude, latitude)
    await droneService.zipFolderAsKMZ()    
    const token = await droneService.getProjectStsToken()
    const objectKey = await droneService.uploadFileToS3WithSTS(token.data)    
    const data = await droneService.finishUploadWayline(objectKey)    
    await droneService.flightTask(data.uuid)

    return { type: "success" }

  }catch(e: any){
    throw await error.createError(e)
  }

}