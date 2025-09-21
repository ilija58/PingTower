import { create } from 'zustand'

import {
	type CreateSitePayload,
	createSite,
	deleteSite,
	getAllSites
} from '../services/serviceService'
import { type Service, type User } from '../types'

interface UserState {
	user: User | null
	services: Service[]
	isLoadingServices: boolean
	setUser: (user: User | null) => void
	fetchSites: () => Promise<void>
	addSite: (siteData: CreateSitePayload) => Promise<void>
	removeSite: (id: number) => Promise<void>
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

export const useUserStore = create<UserState>((set, get) => ({
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

	fetchSites: async () => {
		set({ isLoadingServices: true })
		try {
			const services = await getAllSites()
			set({ services, isLoadingServices: false })
		} catch (error) {
			console.error('Failed to fetch sites', error)
			set({ isLoadingServices: false })
		}
	},

	addSite: async (siteData: CreateSitePayload) => {
		try {
			await createSite(siteData)
			// Re-fetch all sites to get the updated list
			await get().fetchSites()
		} catch (error) {
			console.error('Failed to add site', error)
			// Optionally re-throw or handle error state
			throw error
		}
	},

	removeSite: async (id: number) => {
		try {
			await deleteSite(id)
			// Remove the site from the local state to avoid a re-fetch
			set(state => ({
				services: state.services.filter(service => service.id !== id)
			}))
		} catch (error) {
			console.error('Failed to delete site', error)
			throw error
		}
	}
}))
