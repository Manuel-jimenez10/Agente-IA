import * as checkpointService from '@services/checkpoint.service';
import * as error from '@utils/error';
import { ObjectId } from 'mongodb';

export async function registerCheckpoint(name: string, location: string, status: string, operators: string[] = [], casesTotal: number = 0, casesAttended: number = 0 ): Promise<{ message: string }> {
  try {
    await checkpointService.registerCheckpoint(name, location, status, operators, casesTotal, casesAttended);
    return { message: 'Checkpoint registrado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getCheckpoint(id: string): Promise<any> {
  try {
    return await checkpointService.getCheckpoint({ _id: new ObjectId(id) });
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function getAllCheckpoints(fields: string[]): Promise<any[]> {
  try {
    return await checkpointService.getAllCheckpoints(fields);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updateCheckpoint(id: string, updateData: Record<string, any>): Promise<{ message: string }> {
  try {
    return await checkpointService.updateCheckpoint(id, updateData);
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deleteCheckpoint(id: string): Promise<{ message: string }> {
  try {
    return await checkpointService.deleteCheckpoint(id);
  } catch (e: any) {
    throw await error.createError(e);
  }
}
