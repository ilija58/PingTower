import api from '../api'
import { type Service } from '../types'

export type CreateSitePayload = {
	name: string
	target: string
	check_type: 'http' | 'ping' | 'tcp'
	http_method?: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'PATCH' | 'OPTIONS'
	port?: number
	timeout: number
	check_interval: number
	expected_status_code?: number
	ssl_check_enabled: boolean
	domain_check_enabled: boolean
	active: boolean
}

export const getAllSites = async (): Promise<Service[]> => {
	const response = await api.get<Service[]>('/api/sites/')
	return response.data
}

export const getSiteById = async (id: number): Promise<Service> => {
	const response = await api.get<Service>(`/api/sites/${id}/`)
	return response.data
}

export const createSite = async (
	siteData: CreateSitePayload
): Promise<Service> => {
	const response = await api.post<Service>('/api/sites/', siteData)
	return response.data
}

export const deleteSite = async (id: number): Promise<void> => {
	await api.delete(`/api/sites/${id}/`)
}
