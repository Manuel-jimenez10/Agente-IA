import { settingModel } from '@models/setting.model';

export async function initializeUserSettings(userId: string, now: Date) {
	await settingModel.insertOne({
		userId,
		createdAt: now,
		theme: 'light',
		notificationsEnabled: true,
		language: 'es',
	})
};
