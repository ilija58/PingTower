import { type Service } from '../types'

// Mock data
const mockServices: Service[] = [
	{
		id: '1',
		name: 'PingTower API',
		status: 'online',
		type: 'success',
		url: 'api.pingtower.ru'
	},
	{
		id: '2',
		name: 'My Awesome Project',
		status: 'offline',
		type: 'error',
		url: 'my-project.com'
	},
	{
		id: '3',
		name: 'Staging Server',
		status: 'checking',
		type: 'warning',
		url: 'staging.dev.xyz'
	}
]

// Mock API call to fetch user services
export const fetchUserServices = (): Promise<Service[]> => {
	console.log('Fetching user services...')
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('Fetched services:', mockServices)
			resolve(mockServices)
		}, 1200) // Simulate network delay
	})
}

export const fetchServiceById = (id: string): Promise<Service> => {
	console.log(`Fetching service with id: ${id}...`)
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const service = mockServices.find(s => s.id === id)
			if (service) {
				console.log('Found service:', service)
				resolve(service)
			} else {
				console.error(`Service with id ${id} not found.`)
				reject(new Error('Сервис не найден'))
			}
		}, 500)
	})
}
