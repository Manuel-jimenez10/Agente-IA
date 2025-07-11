import * as error from '@utils/error'
import * as contract from '@utils/contract'
import * as hash from '@utils/hash'

export async function saveHash(data: string, response: string): Promise<any> {

  try{    

    const _hash = await hash.generateHash(data+response)
    const res = await contract.saveHash(_hash)

    return { txid: res.txid, timestamp: res.timestamp, hash: _hash }
  
  }catch(e: any){
    throw await error.createError(e)
  }

}
