import api from '../api'
import { type User } from '../types'

export interface LoginResponse {
	access: string
	refresh: string
}

export const login = async (
	username: string,
	password: string
): Promise<LoginResponse> => {
	const response = await api.post<LoginResponse>('/api/users/login/', {
		username,
		password
	})
	return response.data
}

export const register = async (
	username: string,
	email: string,
	name: string,
	password: string
): Promise<void> => {
	await api.post('/api/users/register/', {
		username,
		email,
		full_name: name,
		password
	})
}

export const getMe = async (): Promise<User> => {
	const response = await api.get<User>('/api/users/me/')
	return response.data
}
