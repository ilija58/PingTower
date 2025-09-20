import { create } from 'zustand'

import { fetchServiceById } from '../services/serviceService'
import { type Service } from '../types'

interface ServiceState {
	service: Service | null
	isLoading: boolean
	error: string | null
	fetchService: (id: string) => Promise<void>
	clearService: () => void
}

export const useServiceStore = create<ServiceState>(set => ({
	// --- STATE ---
	service: null,
	isLoading: true,
	error: null,

	// --- ACTIONS ---
	fetchService: async id => {
		set({ isLoading: true, error: null, service: null })
		try {
			const service = await fetchServiceById(id)
			set({ service, isLoading: false })
		} catch (error: unknown) {
			if (error instanceof Error) {
				set({ error: error.message, isLoading: false })
			} else {
				set({ error: 'An unknown error occurred', isLoading: false })
			}
		}
	},

	clearService: () => {
		set({ service: null, isLoading: false, error: null })
	}
}))
