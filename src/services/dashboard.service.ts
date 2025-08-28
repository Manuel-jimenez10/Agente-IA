import * as error from '@utils/error'

export async function buildDashboardSummary(data: {cameras: number; checkpoints: number; operators: number; officers: number; patrolCars: number;
	checkpointBlocks: Array<{ name: string; operators: string[]; reportedCases: number; attendedPercent: number; }> }): Promise<{ metrics: { cameras: number; checkpoints: number; operators: number; officers: number; patrolCars: number }; 
	checkpointBlocks: Array<{ name: string; operators: string[]; reportedCases: number; attendedPercent: number; }> }> {
	try {
		return {
			metrics: {
				cameras: data.cameras,
				checkpoints: data.checkpoints,
				operators: data.operators,
				officers: data.officers,
				patrolCars: data.patrolCars,
			},
			checkpointBlocks: data.checkpointBlocks,
		}
	} catch (e: any) {
		throw await error.createError(e)
	}
}
