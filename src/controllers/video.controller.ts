import * as error from '@utils/error'
import * as reportService from '@services/report.service'
import * as llmService from '@services/llm.service'
import * as blockchainService from '@services/blockchain.service'
import * as whatsappService from '@services/whatsapp.service'
import * as transactionService from '@services/transaction.service'
import * as videoService from '@services/video.service'
import * as config from '@config/config'
import * as whatsapp from '@utils/whatsapp'

export async function report(): Promise<any> {
  
  try{                          
      
    const now = new Date()

    // Ejecutar el script en python
    const data = await videoService.getInfo()

    const response = await llmService.getResponse(data)
    const res = await blockchainService.saveHash(data, response)
    const type = "text"

    let _response = {
      "createdAt": new Date(),
      "from": config.AGENT_TELEPHONE_NUMBER,
      "type": "answer",
      "contentType": "text",
      "content": { body: response }
    }

    await whatsappService.sendMessage(_response, config.WHATSAPP_TO)
    await reportService.saveInformation(now, data, response)           
    await transactionService.saveTransaction(now, res.txid, res.timestamp)

    return { createdAt: now, response: response, txid: res.txid, timestamp: res.timestamp, hash: res.hash }    

  }catch(e: any){
    throw await error.createError(e)
  }

}