import * as error from '@utils/error'
import { transactionModel } from '@models/transaction.model'

export async function saveTransaction(now: Date, txid: string, timestamp: string): Promise<void> {

  try{    

    await transactionModel.insertOne({
      createdAt: now,
      txid: txid,
      timestamp: timestamp      
    })      
  
  }catch(e: any){
    throw await error.createError(e)
  }

}
