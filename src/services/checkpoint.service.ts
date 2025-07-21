import * as error from '@utils/error'
import { checkpointModel } from '@models/checkpoint.model'
import { ObjectId } from 'mongodb'

export async function registerCheckpoint(name: string, location: string, status: string, operators: string[] = [], casesTotal: number = 0, casesAttended: number = 0, ): Promise<void> {
	try {
		if (!name || !location || !status) {
			throw { code: 400, message: 'DATA_NOT_FOUND' }
		}

		await checkpointModel.insertOne({
			name,
			location,
			status,
			operators,
			casesTotal,
			casesAttended,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	} catch (e: any) {
		throw await error.createError(e)
	}
}


export async function getCheckpoint(filter: Record<string, any>): Promise<any> {
  try {
    const checkpoint = await checkpointModel.findOne(filter);
    return checkpoint || null;
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getAllCheckpoints(fields: string[] = []): Promise<any[]> {
  try {
    return await checkpointModel.find({}, fields);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updateCheckpoint(id: string, updateData: Record<string, any>): Promise<{ message: string }> {
  try {
    		const updatedFields = {
				...updateData,
				updatedAt: new Date(),
			}

      const result = await checkpointModel.updateOne({ _id: new ObjectId(id) }, updatedFields);
      if (!result) {
        throw { code: 404, message: 'Checkpoint no encontrado o sin campos válidos' };
      }
      return { message: 'Datos actualizados correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deleteCheckpoint(id: string): Promise<{ message: string }> {
  try {
    const result = await checkpointModel.deleteOne({ _id: new ObjectId(id) });
    if (!result) {
      throw { code: 404, message: 'Checkpoint no encontrado' };
    }
    return { message: 'Checkpoint eliminado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

  