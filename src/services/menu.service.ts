import * as error from '@utils/error'
import { moduleModel } from '@models/module.model'
import { roleModel } from '@models/role.model'
import { roleModuleModel } from '@models/role-module.model'
import * as sanitaze from '@utils/sanitaze'

export async function getMenuByRole(rol: string) {
	try {
		const normalizedRole = sanitaze.normalizeName(rol)

		const roleExists = await roleModel.findOne({ name: normalizedRole })
		if (!roleExists) {
			throw { code: 404, message: 'Role not found' }
		}

		const assignments = await roleModuleModel.find({
			roleId: roleExists._id,
		})
		const moduleIds = assignments.map((a) => a.moduleId)

		const modules = await moduleModel.find({ _id: { $in: moduleIds } })

		return modules
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllModules() {
	try {
		return await moduleModel.find({})
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function createRole(name: string, description?: string) {
	try {
		const normalizedName = sanitaze.normalizeName(name)
		const existingRole = await roleModel.findOne({ name: normalizedName })
		if (existingRole) {
			throw { code: 409, message: 'Role already exists' }
		}

		await roleModel.insertOne({
			name: normalizedName,
			description,
			createdAt: new Date(),
		})
		return { message: 'Rol creado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function createModule(name: string, type: string) {
	try {
		const normalizedName = sanitaze.normalizeName(name)
		const existingModule = await moduleModel.findOne({
			name: normalizedName,
		})
		if (existingModule) {
			throw { code: 409, message: 'Module already exists' }
		}

		await moduleModel.insertOne({
			name: normalizedName,
			type,
			createdAt: new Date(),
		})
		return { message: 'Módulo creado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function assignModuleToRole(role: string, module: string) {
	try {
		const normalizedRole = sanitaze.normalizeName(role)
		const normalizedModule = sanitaze.normalizeName(module)

		const roleExists = await roleModel.findOne({ name: normalizedRole })
		if (!roleExists) {
			throw { code: 404, message: 'Role not found' }
		}

		const moduleExists = await moduleModel.findOne({
			name: normalizedModule,
		})
		
		if (!moduleExists) {
			throw { code: 404, message: 'Module not found' }
		}

		await roleModuleModel.insertOne({
			roleId: roleExists._id,
			moduleId: moduleExists._id,
			assignedAt: new Date(),
		})
		return { message: 'Module assigned successfully' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deallocateModuleFromRole(role: string, module: string) {
	try {
		const normalizedRole = sanitaze.normalizeName(role)
		const normalizedModule = sanitaze.normalizeName(module)

		const roleExists = await roleModel.findOne({ name: normalizedRole })
		if (!roleExists) {
			throw { code: 404, message: 'Role not found' }
		}

		const moduleExists = await moduleModel.findOne({
			name: normalizedModule,
		})

		if (!moduleExists) {
			throw { code: 404, message: 'Module not found' }
		}

		const result = await roleModuleModel.deleteOne({
			roleId: roleExists._id,
			moduleId: moduleExists._id,
		})
		if (!result) {
			throw { code: 404, message: 'Assignment not found' }
		}

		return { message: 'Module deallocated successfully' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}