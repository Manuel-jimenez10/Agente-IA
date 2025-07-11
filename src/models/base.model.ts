import * as error from '@utils/error'
import * as config from '@config/config'

import { client } from './db';
const database = client.db(config.DATABASE);

export class BaseModel {
    
    private collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    private getCollection() {
        return database.collection(this.collectionName);
    }

    async find(filter: any, fields: string[] = []): Promise<any[]> {
        try {       

            const projection = fields.length > 0 
            ? fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) 
            : {};

            return await this.getCollection().find(filter).project(projection).toArray();
        } catch (e) {            
            throw await error.createError(e);
        }
    }

    async findCount(filter: any) {
        try {           
            return await this.getCollection().countDocuments(filter)
        } catch (e) {            
            throw await error.createError(e);
        }
    }

    async findOne(filter: any, fields: string[] = []): Promise<any | null> {
        try {            
            const projection = fields.length > 0 
                ? fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) 
                : {};
            
            return await this.getCollection().findOne(filter, { projection });
        } catch (e) {
            throw await error.createError(e);
        }
    }

    async insertOne(document: any) {
        try {        
            return await this.getCollection().insertOne(document);
        } catch (e) {
            throw await error.createError(e);
        }
    }

    async updateOne(filter: any, update: any) {
        try {            
            return await this.getCollection().updateOne(
                filter,
                {$set: update}
            )
        } catch (e) {                        
            throw await error.createError(e);
        }
    }

    async deleteOne(filter: any) {
        try {
            return await this.getCollection().deleteOne(filter);
        } catch (e) {
            throw await error.createError(e);
        }
    }

    async deleteMany(filter: any) {
        try {
            return await this.getCollection().deleteMany(filter);
        } catch (e) {
            throw await error.createError(e);
        }
    }

}