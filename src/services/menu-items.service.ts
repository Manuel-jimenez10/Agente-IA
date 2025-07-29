import { menuItemModel } from '@models/menu-item.model'
import { moduleModel } from '@models/module.model'
import * as sanitaze from '@utils/sanitaze'
import * as error  from '@utils/error'
import { ObjectId } from 'mongodb'

export async function getItemsByType(type: string) {
	try {
		const normalizedType = sanitaze.normalizeName(type)
		const items = await menuItemModel.find({ type: normalizedType })
		return items
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function registerMenuItem(label: string, route: string, module: string, type: string, icon?: string, visible: boolean = true, order?: number, ): Promise<void> {
	try {
		if (!label || !route || !module || !type) {
			throw { code: 400, message: 'DATA_NOT_FOUND' }
		}

		const normalizedModule = sanitaze.normalizeName(module)
		const existingModule = await moduleModel.findOne({
			name: normalizedModule,
		})

		if (!existingModule) {
			throw { code: 404, message: 'MODULE_NOT_FOUND' }
		}

		await menuItemModel.insertOne({
			label,
			route,
			module: normalizedModule,
			type: sanitaze.normalizeName(type),
			icon,
			visible,
			order,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getItemById(id: string) {
	try {
		const item = await menuItemModel.find({ _id: new ObjectId(id)})
		if (!item) {
			throw { code: 404, message: 'Item not found' }
		}
		return item
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateItem(id: string, data: any) {
	try {
		const normalizedData = {
			...data,
			type: sanitaze.normalizeName(data.type),
			module: sanitaze.normalizeName(data.module),
			label: data.label.trim(),
			route: data.route.trim(),
			updatedAt: new Date(),
		}

		const updated = await menuItemModel.updateOne(
			{ _id: new ObjectId(id) },
			normalizedData,
		)
		if (!updated) {
			throw { code: 404, message: 'Item not found for update' }
		}
		return { message: 'Item actualizado correctamente', updated }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteItem(id: string) {
	try {
		const deleted = await menuItemModel.deleteOne({ _id: new ObjectId(id) })
		if (!deleted) {
			throw { code: 404, message: 'Item not encontrado para eliminación' }
		}
		return { message: 'Item eliminado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}