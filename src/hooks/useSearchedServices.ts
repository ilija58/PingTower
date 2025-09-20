import { useContext, useMemo } from 'react'

import { useDebounce } from './useDebonce'
import { SearchedContext } from '@/providers/search/search.context'

export function useFilteredFlights(services: any[]) {
	const { search, setSearch } = useContext(SearchedContext)
	const debouncedFilter = useDebounce(search, 400)

	const filteredFlights = useMemo(() => {
		if (!debouncedFilter.trim()) return services
		const searchLower = debouncedFilter.trim().toLowerCase()
		return services.filter(services => {
			const fromAirport = services.departure.airport?.toLowerCase() || ''
			const toAirport = services.arrival.airport?.toLowerCase() || ''
			const airlineName = services.airline.name.toLowerCase()
			return (
				fromAirport.includes(searchLower) ||
				toAirport.includes(searchLower) ||
				airlineName.includes(searchLower)
			)
		})
	}, [debouncedFilter, services])

	return { debouncedFilter, setSearch, filteredFlights }
}
