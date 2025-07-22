import * as patrolcarService from '@services/patrolcar.service';
import * as error from '@utils/error';
import { ObjectId } from 'mongodb';

export async function registerPatrolcar(plateNumber: string, unit: string, type: string, status: string, assignedOfficerId?: string): Promise<{ message: string }> {
  try {
    await patrolcarService.registerPatrolcar(plateNumber, unit, type, status, assignedOfficerId);
    return { message: 'Patrullero registrado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getPatrolcar(id: string): Promise<any> {
  try {
    return await patrolcarService.getPatrolcar({ _id: new ObjectId(id) });
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getAllPatrolcars(fields: string[]): Promise<any[]> {
  try {
    return await patrolcarService.getAllPatrolcars(fields);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updatePatrolcar(id: string, updateData: Record<string, any>): Promise<{ message: string }> {
  try {
    return await patrolcarService.updatePatrolcar(id, updateData);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deletePatrolcar(id: string): Promise<{ message: string }> {
  try {
    return await patrolcarService.deletePatrolcar(id);
  } catch (e: any) {
    throw await error.createError(e);
  }
}
