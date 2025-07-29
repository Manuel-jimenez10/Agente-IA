import * as menuItemService from '@services/menu-items.service'
import * as error from '@utils/error'

export async function getByType(type: string) {
	try {
		return await menuItemService.getItemsByType(type)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function registerMenuItem(label: string, route: string, module: string, type: string, icon?: string, visible?: boolean, order?: number, ): Promise<{ message: string }> {
	try {
		await menuItemService.registerMenuItem(label, route, module, type, icon, visible, order)
		return { message: 'Item de menú registrado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getById(id: string) {
	try {
		return await menuItemService.getItemById(id)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateById(id: string, data: any) {
	try {
		return await menuItemService.updateItem(id, data)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteById(id: string) {
	try {
		return await menuItemService.deleteItem(id)
	} catch (e: any) {
		throw await error.createError(e)
	}
}