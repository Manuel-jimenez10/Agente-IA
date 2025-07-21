import * as error from '@utils/error'
import { operatorModel } from '@models/operator.model'
import { ObjectId } from 'mongodb'

export async function registerOperator(name: string, lastname: string, document: string, phone: string, status: string, role: string, assignedCheckpointId?: string ): Promise<void> {
  try {
    if (!name || !lastname || !document || !phone || !status || !role) {
      throw { code: 400, message: 'DATA_NOT_FOUND' };
    }

    const operatorData: Record<string, any> = {
      name,
      lastname,
      document,
      phone,
      status,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (assignedCheckpointId) {
      operatorData.assignedCheckpointId = new ObjectId(assignedCheckpointId);
    }

    await operatorModel.insertOne(operatorData);
  } catch (e: any) {
    throw await error.createError(e);
  }
}


export async function getOperator(filter: Record<string, any>): Promise<any> {
	try {
		const operator = await operatorModel.findOne(filter)
		return operator || null
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllOperators(fields: string[] = []): Promise<any[]> {
	try {
		return await operatorModel.find({}, fields)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateOperator(id: string, updateData: Record<string, any>, ): Promise<{ message: string }> {
	try {
		const updatedFields = {
			...updateData,
			updatedAt: new Date(),
		}
		const result = await operatorModel.updateOne(
			{ _id: new ObjectId(id) },
			updatedFields,
		)
		if (!result) {
			throw {
				code: 404,
				message: 'Operador no encontrado o sin campos válidos',
			}
		}
		return { message: 'Datos actualizados correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteOperator(id: string): Promise<{ message: string }> {
	try {
		const result = await operatorModel.deleteOne({ _id: new ObjectId(id) })
		if (!result) {
			throw { code: 404, message: 'Operador no encontrado' }
		}
		return { message: 'Operador eliminado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}