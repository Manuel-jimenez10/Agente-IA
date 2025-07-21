import * as error from '@utils/error'
import { officerModel } from '@models/officer.model'
import { ObjectId } from 'mongodb'

export async function registerOfficer(name: string, lastname: string, badgeNumber: string, rank: string, phone: string, status: string): Promise<void> {
  try {
    if (!name || !lastname || !badgeNumber || !rank || !phone || !status) {
      throw { code: 400, message: "DATA_NOT_FOUND" };
    }

    await officerModel.insertOne({
		name,
		lastname,
		badgeNumber,
		rank,
		phone,
		status,
		createdAt: new Date(),
		updatedAt: new Date(),
	})
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getOfficer(filter: Record<string, any>): Promise<any> {
  try {
    const officer = await officerModel.findOne(filter);
    return officer || null;
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getAllOfficers(fields: string[] = []): Promise<any[]> {
  try {
    return await officerModel.find({}, fields);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updateOfficer(id: string, updateData: Record<string, any>): Promise<{ message: string }> {
  try {
    	const updatedFields = {
				...updateData,
				updatedAt: new Date(),
			}
      const result = await officerModel.updateOne({ _id: new ObjectId(id) }, updatedFields);
      if (!result) {
        throw { code: 404, message: 'Efectivo no encontrado o sin campos válidos' };
      }
      return { message: 'Datos actualizados correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deleteOfficer(id: string): Promise<{ message: string }> {
  try {
    const result = await officerModel.deleteOne({ _id: new ObjectId(id) });
    if (!result) {
      throw { code: 404, message: 'Efectivo no encontrado' };
    }
    return { message: 'Efectivo eliminado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}