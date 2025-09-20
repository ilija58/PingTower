import axios, { type InternalAxiosRequestConfig } from 'axios'

import {
	getRefreshToken,
	getToken,
	logout,
	storeToken
} from './services/tokenService'

const API_URL = import.meta.env.VITE_API_URL || 'http://203.81.208.66:8000'

const api = axios.create({
	baseURL: API_URL
})

api.interceptors.request.use(config => {
	const token = getToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config as InternalAxiosRequestConfig

		// Check if the error is 401 and it's not a retry request
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true // Mark it as a retry

			const refreshToken = getRefreshToken()
			if (!refreshToken) {
				logout()
				return Promise.reject(error)
			}

			try {
				// Use a temporary, clean axios instance for the refresh request
				const refreshApi = axios.create({
					baseURL: API_URL
				})
				const response = await refreshApi.post('/api/users/refresh/', {
					refresh: refreshToken
				})

				const newAccessToken = response.data.access
				storeToken(newAccessToken)

				// Update the authorization header of the original request
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				}

				// Retry the original request
				return api(originalRequest)
			} catch (refreshError) {
				// If refresh fails, logout the user
				logout()
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export default api
