import { create } from 'zustand'

import * as authService from '../services/authService'
import * as tokenService from '../services/tokenService'

import { useUserStore } from './userStore'

interface AuthState {
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (username: string, password: string) => Promise<void>
	register: (
		username: string,
		email: string,
		name: string,
		password: string
	) => Promise<void>
	logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	// --- STATE ---
	token: tokenService.getToken(),
	isAuthenticated: !!tokenService.getToken(),
	isLoading: false,
	error: null,

	// --- ACTIONS ---
	login: async (username, password) => {
		set({ isLoading: true, error: null })
		try {
			const { access, refresh } = await authService.login(username, password)
			tokenService.storeToken(access)
			tokenService.storeRefreshToken(refresh)
			const user = await authService.getMe()
			useUserStore.getState().setUser(user) // Update userStore
			set({ token: access, isAuthenticated: true, isLoading: false })
		} catch (error: unknown) {
			if (error instanceof Error) {
				set({ error: error.message, isLoading: false })
			} else {
				set({ error: 'An unknown error occurred', isLoading: false })
			}
			throw error
		}
	},

	register: async (username, email, name, password) => {
		set({ isLoading: true, error: null })
		try {
			await authService.register(username, email, name, password)
			set({ isLoading: false })
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
		tokenService.logout()
		useUserStore.getState().setUser(null) // Clear userStore
		set({ token: null, isAuthenticated: false })
	}
}))
