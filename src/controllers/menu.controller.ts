import * as menuService from '@services/menu.service'
import * as error from '@utils/error'

export async function getMenuByRole(rol: string) {
	try {
		return await menuService.getMenuByRole(rol)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllModules() {
	try {
		return await menuService.getAllModules()
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function createModule(name: string, type: string) {
	try {
		return await menuService.createModule(name, type)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function assignModuleToRole(role: string, module: string) {
	try {
		return await menuService.assignModuleToRole(role, module)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deallocateModuleFromRole(role: string, module: string) {
	try {
		return await menuService.deallocateModuleFromRole(role, module)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function createRole(name: string, description?: string) {
	try {
		return await menuService.createRole(name, description)
	} catch (e: any) {
		throw await error.createError(e)
	}
}
