export interface User {
	id: number
	username: string
	email: string
	full_name: string
}

type http_method = 'GET' | 'HEAD' | 'POST' | 'OPTION' | 'PUT' | 'PATCH'
type check_type = 'http' | 'ping' | 'tcp'
type port = 83 | 433
type status_type = 'ok' | 'fail' | 'degraded' | 'unknown'

export interface Service {
	id: number
	users: number[]
	name: string
	target: string
	check_type: check_type
	http_method: http_method
	port: port
	timeout: number
	check_interval: number
	expected_status_code: number
	degraded_latency_ms: number
	fail_threshold: number
	recovery_threshold: number
	ssl_check_enabled: boolean
	ssl_expiry_alert_days: number
	ssl_expires_at?: string
	domain_check_enabled: true
	domain_expiry_alert_days: number
	status: status_type
	active: boolean
	created_at: string
	updated_at: string
}

type severity_type = 'minor' | 'major' | 'critical'

export interface Incidents {
	id: number
	site: number
	start_time: string
	end_time?: string
	severity: severity_type
	description: string
	duration_seconds: string
}

export interface ISiteChecks {
	id: number
	site: number
	site_name: string
	site_target: string
	status: string
	timestamp: string
	status_code: number
	latency_ms: number
	error_type: string
	error_message: string
	created_at: string
}
