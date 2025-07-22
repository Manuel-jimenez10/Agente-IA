import * as cameraService from '@services/camera.service'
import * as checkpointService from '@services/checkpoint.service'
import * as operatorService from '@services/operator.service'
import * as officerService from '@services/officer.service'
import * as patrolcarService from '@services/patrolcar.service'
import * as dashboardService from '@services/dashboard.service'
import * as error from '@utils/error'

export async function getDashboardSummary(): Promise<any> {
  try {
	const cameras = await cameraService.getCameraCount();
	const checkpoints = await checkpointService.getCheckpointCount();
	const operators = await operatorService.getOperatorCount();
	const officers = await officerService.getOfficerCount();
	const patrolCars = await patrolcarService.getPatrolcarCount();
	const checkpointBlocks = await checkpointService.getDashboardCheckpoints();

    return dashboardService.buildDashboardSummary({cameras, checkpoints, operators, officers, patrolCars, checkpointBlocks });
  } catch (e: any) {
    throw await error.createError(e);
  }
}
