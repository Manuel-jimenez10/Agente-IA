import * as error from '@utils/error'
import { patrolcarModel } from '@models/patrolcar.model'
import { ObjectId } from 'mongodb'

export async function registerPatrolCar(plateNumber: string, unit: string, type: string, status: string, assignedOfficerId?: string ): Promise<void> {
  try {
    if (!plateNumber || !unit || !type || !status) {
      throw { code: 400, message: "DATA_NOT_FOUND" };
    }

    const data: Record<string, any> = {
		plateNumber,
		unit,
		type,
		status,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

    if (assignedOfficerId) {
      data.assignedOfficerId = new ObjectId(assignedOfficerId);
    }

    await patrolcarModel.insertOne(data);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getPatrolCar(filter: Record<string, any>): Promise<any> {
  try {
    const patrolCar = await patrolcarModel.findOne(filter);
    return patrolCar || null;
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getAllPatrolCars(fields: string[] = []): Promise<any[]> {
  try {
    return await patrolcarModel.find({}, fields);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updatePatrolCar(id: string, updateData: Record<string, any>): Promise<{ message: string }> {
  try {
    	const updatedFields = {
				...updateData,
				updatedAt: new Date(),
			}
      const result = await patrolcarModel.updateOne({ _id: new ObjectId(id) }, updatedFields);
      if (!result) {
        throw { code: 404, message: 'Patrullero no encontrado o sin campos válidos' };
      }
      return { message: 'Datos actualizados correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deletePatrolCar(id: string): Promise<{ message: string }> {
  try {
    const result = await patrolcarModel.deleteOne({ _id: new ObjectId(id) });
    if (!result) {
      throw { code: 404, message: 'Patrullero no encontrado' };
    }
    return { message: 'Patrullero eliminado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}
