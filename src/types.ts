export interface User {
	id: string
	fullName: string
	email: string
	nickname: string
}

export interface Service {
	id: string
	name: string
	status: 'online' | 'offline' | 'checking'
	type: 'success' | 'error' | 'warning'
	url: string
}
