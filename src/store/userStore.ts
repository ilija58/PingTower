import { create } from 'zustand'

import { fetchUserServices } from '../services/serviceService'
import { type Service, type User } from '../types'

interface UserState {
	user: User | null
	services: Service[]
	isLoadingServices: boolean
	setUser: (user: User | null) => void
	fetchServices: () => Promise<void>
}

const getInitialUser = (): User | null => {
	try {
		const userJson = localStorage.getItem('pingtower_user')
		return userJson ? JSON.parse(userJson) : null
	} catch (error) {
		console.error('Failed to parse user from localStorage', error)
		localStorage.removeItem('pingtower_user')
		return null
	}
}

export const useUserStore = create<UserState>(set => ({
	// --- STATE ---
	user: getInitialUser(),
	services: [],
	isLoadingServices: false,

	// --- ACTIONS ---
	setUser: user => {
		if (user) {
			localStorage.setItem('pingtower_user', JSON.stringify(user))
		} else {
			localStorage.removeItem('pingtower_user')
		}
		set({ user })
	},

	fetchServices: async () => {
		set({ isLoadingServices: true })
		try {
			const services = await fetchUserServices()
			set({ services, isLoadingServices: false })
		} catch (error) {
			console.error('Failed to fetch services', error)
			set({ isLoadingServices: false })
		}
	}
}))
