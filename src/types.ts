export interface User {
	id: number
	username: string
	email: string
	full_name: string
}

export interface Service {
	id: number
	name: string
	url: string
	check_interval: number
	timeout: number
	expected_status_code: number
	active: boolean
	status: 'up' | 'down'
	created_at: string
	updated_at: string
}
