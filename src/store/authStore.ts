import { create } from 'zustand'

import * as authService from '../services/authService'

import { useUserStore } from './userStore'

interface AuthState {
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (nickname: string, password: string) => Promise<void>
	register: (nickname: string, password: string) => Promise<void>
	logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	// --- STATE ---
	token: authService.getToken(),
	isAuthenticated: !!authService.getToken(),
	isLoading: false,
	error: null,

	// --- ACTIONS ---
	login: async (nickname, password) => {
		set({ isLoading: true, error: null })
		try {
			const { token, user } = await authService.login(nickname, password)
			authService.storeToken(token)
			useUserStore.getState().setUser(user) // Update userStore
			set({ token, isAuthenticated: true, isLoading: false })
		} catch (error: unknown) {
			if (error instanceof Error) {
				set({ error: error.message, isLoading: false })
			} else {
				set({ error: 'An unknown error occurred', isLoading: false })
			}
			throw error
		}
	},

	register: async (nickname, password) => {
		set({ isLoading: true, error: null })
		try {
			const { token, user } = await authService.register(nickname, password)
			authService.storeToken(token)
			useUserStore.getState().setUser(user) // Update userStore
			set({ token, isAuthenticated: true, isLoading: false })
		} catch (error: unknown) {
			if (error instanceof Error) {
				set({ error: error.message, isLoading: false })
			} else {
				set({ error: 'An unknown error occurred', isLoading: false })
			}
			throw error
		}
	},

	logout: () => {
		authService.logout()
		useUserStore.getState().setUser(null) // Clear userStore
		set({ token: null, isAuthenticated: false })
	}
}))
