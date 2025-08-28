import * as operatorService from '@services/operator.service';
import * as error from '@utils/error';
import { ObjectId } from 'mongodb';

export async function registerOperator(name: string, lastname: string, document: string, phone: string, status: string, role: string, assignedCheckpointId?: string): Promise<{ message: string }> {
  try {
    await operatorService.registerOperator(name, lastname, document, phone, status, role, assignedCheckpointId);
    return { message: 'Operador registrado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getOperator(id: string): Promise<any> {
  try {
    return await operatorService.getOperator({ _id: new ObjectId(id) });
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getAllOperators(fields: string[]): Promise<any[]> {
  try {
    return await operatorService.getAllOperators(fields);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updateOperator(id: string, updateData: Record<string, any>): Promise<{ message: string }> {
  try {
    return await operatorService.updateOperator(id, updateData);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deleteOperator(id: string): Promise<{ message: string }> {
  try {
    return await operatorService.deleteOperator(id);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

