export const ACCESS_TOKEN_KEY = 'pingtower_access_jwt'
export const REFRESH_TOKEN_KEY = 'pingtower_refresh_jwt'

// --- Access Token --- //
export const storeToken = (token: string): void => {
	localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getToken = (): string | null => {
	return localStorage.getItem(ACCESS_TOKEN_KEY)
}

// --- Refresh Token --- //
export const storeRefreshToken = (token: string): void => {
	localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const getRefreshToken = (): string | null => {
	return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// --- Logout --- //
export const logout = (): void => {
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	localStorage.removeItem(REFRESH_TOKEN_KEY)
	// Optionally, redirect to login page
	window.location.href = '/auth'
}
