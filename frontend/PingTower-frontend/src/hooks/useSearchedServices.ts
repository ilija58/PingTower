import { useContext, useMemo } from 'react'

import { SearchedContext } from '@/providers/search/search.context'

import { useDebounce } from './useDebonce'
import { type Service } from '@/types'

export function useSearchedServices(services: Service[]) {
	const { search, setSearch } = useContext(SearchedContext)
	const debouncedFilter = useDebounce(search, 400)

	const searchedServices = useMemo(() => {
		if (!debouncedFilter.trim()) return services
		const searchLower = debouncedFilter.trim().toLowerCase()
		return services.filter(service => {
			const serviceName = service.name.toLowerCase()
			return serviceName.includes(searchLower)
		})
	}, [debouncedFilter, services])

	return { debouncedFilter, setSearch, searchedServices }
}
