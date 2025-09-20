import { type User } from '../types'

const JWT_KEY = 'pingtower_jwt'

interface AuthResponse {
	token: string
	user: User
}

// Mock API call for login
export const login = (
	nickname: string,
	password: string
): Promise<AuthResponse> => {
	console.log('Attempting login with', { nickname, password })
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (password === 'password123') {
				const fakeToken = 'fake-jwt-for-' + nickname
				const user: User = {
					id: 'user-1',
					nickname: nickname,
					fullName: 'Vasya Pupkin',
					email: `${nickname}@example.com`
				}
				console.log('Login successful', { token: fakeToken, user })
				resolve({ token: fakeToken, user })
			} else {
				console.log('Login failed')
				reject(new Error("Неверный пароль. Попробуйте 'password123'."))
			}
		}, 1000)
	})
}

// Mock API call for registration
export const register = (
	nickname: string,
	password: string
): Promise<AuthResponse> => {
	console.log('Attempting registration with', { nickname, password })
	return new Promise(resolve => {
		setTimeout(() => {
			const fakeToken = 'fake-jwt-for-' + nickname
			const user: User = {
				id: 'user-1',
				nickname: nickname,
				fullName: 'Vasya Pupkin',
				email: `${nickname}@example.com`
			}
			console.log('Registration successful', { token: fakeToken, user })
			resolve({ token: fakeToken, user })
		}, 1000)
	})
}

// Store token in localStorage
export const storeToken = (token: string): void => {
	localStorage.setItem(JWT_KEY, token)
	console.log('Token stored in localStorage')
}

// Retrieve token from localStorage
export const getToken = (): string | null => {
	return localStorage.getItem(JWT_KEY)
}

// Remove token from localStorage
export const logout = (): void => {
	localStorage.removeItem(JWT_KEY)
	console.log('Token removed from localStorage')
}
