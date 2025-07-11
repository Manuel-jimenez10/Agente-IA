import * as config from '@config/config'
import { MongoClient } from 'mongodb'
import * as error from '@utils/error'

export const client = new MongoClient(config.MONGODB_URI);

export async function connect() {

    try{
        await client.connect();
    }catch(e){
       throw await error.createError(e)
    }

}

export async function close() {

    try{
        await client.close();
    }catch(e){
        throw await error.createError(e)
    }

}